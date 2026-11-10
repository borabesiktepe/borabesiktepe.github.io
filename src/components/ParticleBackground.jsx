import { useEffect, useRef } from "react";

// A huge, slowly turning globe made of fine dust. Bright bands of noise sweep
// across its surface, and the pointer gently tilts the whole thing.

const MAX_PARTICLES = 480_000;
const MIN_PARTICLES = 160_000;
const TARGET_FPS = 60;

const NOISE = `
  vec4 permute(vec4 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;

    i = mod(i, 289.0);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0)) +
      i.y + vec4(0.0, i1.y, i2.y, 1.0)) +
      i.x + vec4(0.0, i1.x, i2.x, 1.0));

    float n_ = 1.0 / 7.0;
    vec3 ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);

    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);

    vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
  }
`;

const VERTEX_SHADER = `
  precision highp float;

  attribute vec4 aParticle; // xyz: point on unit sphere, w: random 0..1

  uniform float uTime;
  uniform float uAspect;
  uniform float uPointSize;
  uniform vec2 uPointer;
  uniform float uLightMode;

  varying float vAlpha;

  ${NOISE}

  mat3 rotateX(float a) {
    float c = cos(a), s = sin(a);
    return mat3(1.0, 0.0, 0.0, 0.0, c, s, 0.0, -s, c);
  }

  mat3 rotateY(float a) {
    float c = cos(a), s = sin(a);
    return mat3(c, 0.0, -s, 0.0, 1.0, 0.0, s, 0.0, c);
  }

  mat3 rotateZ(float a) {
    float c = cos(a), s = sin(a);
    return mat3(c, s, 0.0, -s, c, 0.0, 0.0, 0.0, 1.0);
  }

  void main() {
    float seed = aParticle.w;
    vec3 dir = aParticle.xyz;

    // The globe turns on its own axis; the pointer adds a soft tilt on top.
    mat3 spin = rotateY(uTime * 0.045) * rotateX(0.35 + sin(uTime * 0.03) * 0.12);
    mat3 tilt = rotateX(uPointer.y * 0.22) * rotateY(uPointer.x * 0.3) * rotateZ(-0.25);
    vec3 normal = tilt * (spin * dir);

    // Noise is sampled in the globe's own space so its patterns ride along
    // with the rotation while also slowly morphing over time.
    vec3 local = spin * dir;
    float flow = snoise(local * 1.35 + vec3(0.0, uTime * 0.11, uTime * 0.07));
    float detail = snoise(local * 3.4 - vec3(uTime * 0.09, 0.0, uTime * 0.05));

    // A thin, slightly uneven shell gives the surface its grainy depth.
    float radius = 1.0 + flow * 0.004 + detail * 0.003 + (seed - 0.5) * 0.025;
    vec3 world = normal * radius;

    // Place the globe left of centre so its right rim crosses the screen.
    world += vec3(-0.5, 0.12, 0.0);

    vec3 camera = vec3(0.0, 0.0, 1.55);
    vec3 view = world - camera;
    float depth = -view.z;

    // Bands of light sweep over the surface.
    float band = smoothstep(-0.45, 0.6, flow + detail * 0.3);
    vec3 lightDir = normalize(vec3(
      cos(uTime * 0.07) * 0.8,
      0.55,
      0.6 + sin(uTime * 0.07) * 0.4
    ));
    float lambert = clamp(dot(normal, lightDir) * 0.5 + 0.5, 0.0, 1.0);
    float facing = dot(normal, normalize(camera - world));
    float faceFade = mix(0.25, 1.0, smoothstep(-0.25, 0.15, facing));

    float sparkle = mix(0.6, 1.0, fract(seed * 91.7));
    vAlpha = band * mix(0.1, 1.0, lambert) * faceFade * sparkle;
    vAlpha *= mix(0.95, 0.75, uLightMode);
    vAlpha *= smoothstep(0.05, 0.35, depth);

    float focal = 1.0 / tan(radians(34.0));
    gl_Position = vec4(
      view.x * focal / uAspect,
      view.y * focal,
      0.0,
      depth
    );
    gl_PointSize = uPointSize;
  }
`;

const FRAGMENT_SHADER = `
  precision highp float;

  uniform float uLightMode;
  varying float vAlpha;

  void main() {
    vec3 color = mix(vec3(0.95), vec3(0.12), uLightMode);
    // Output is premultiplied so the page composites it correctly.
    gl_FragColor = vec4(color * vAlpha, vAlpha);
  }
`;

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const message = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`Particle shader could not compile: ${message}`);
  }

  return shader;
}

function createProgram(gl) {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
  const program = gl.createProgram();

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const message = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(`Particle shader could not link: ${message}`);
  }

  return program;
}

function createParticleData() {
  const data = new Float32Array(MAX_PARTICLES * 4);
  let state = 0x9e3779b9;

  const random = () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };

  for (let index = 0; index < MAX_PARTICLES; index += 1) {
    // Uniformly distributed points on the unit sphere.
    const z = random() * 2 - 1;
    const angle = random() * Math.PI * 2;
    const ring = Math.sqrt(1 - z * z);
    const offset = index * 4;

    data[offset] = ring * Math.cos(angle);
    data[offset + 1] = ring * Math.sin(angle);
    data[offset + 2] = z;
    data[offset + 3] = random();
  }

  return data;
}

export default function ParticleBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      premultipliedAlpha: true,
      powerPreference: "high-performance",
    });

    if (!gl) {
      canvas.style.display = "none";
      return undefined;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let program;

    try {
      program = createProgram(gl);
    } catch (error) {
      console.error(error);
      canvas.style.display = "none";
      return undefined;
    }

    const particleBuffer = gl.createBuffer();
    const particleLocation = gl.getAttribLocation(program, "aParticle");
    const uniforms = {
      time: gl.getUniformLocation(program, "uTime"),
      aspect: gl.getUniformLocation(program, "uAspect"),
      pointSize: gl.getUniformLocation(program, "uPointSize"),
      pointer: gl.getUniformLocation(program, "uPointer"),
      lightMode: gl.getUniformLocation(program, "uLightMode"),
    };

    gl.bindBuffer(gl.ARRAY_BUFFER, particleBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, createParticleData(), gl.STATIC_DRAW);
    gl.useProgram(program);
    gl.enableVertexAttribArray(particleLocation);
    gl.vertexAttribPointer(particleLocation, 4, gl.FLOAT, false, 0, 0);
    gl.enable(gl.BLEND);

    let frameId;
    let particleCount = MIN_PARTICLES;
    let pixelRatio = 1;
    let startTime = performance.now();
    let lastFrameTime = 0;
    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };

    const resize = () => {
      const cssWidth = Math.max(1, window.innerWidth);
      const cssHeight = Math.max(1, window.innerHeight);
      pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, Math.round(cssWidth * pixelRatio));
      const height = Math.max(1, Math.round(cssHeight * pixelRatio));

      particleCount = Math.min(
        MAX_PARTICLES,
        Math.max(MIN_PARTICLES, Math.round((cssWidth * cssHeight) / 2.6)),
      );

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
    };

    const draw = (time) => {
      const elapsed = reduceMotion.matches ? 12.0 : (time - startTime) * 0.001;
      const lightMode = document.body.classList.contains("light-mode");

      pointer.x += (pointer.targetX - pointer.x) * 0.04;
      pointer.y += (pointer.targetY - pointer.y) * 0.04;

      if (lightMode) {
        gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      } else {
        // Additive blending lets dense areas (like the rim) glow brighter.
        gl.blendFunc(gl.ONE, gl.ONE);
      }

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(uniforms.time, elapsed);
      gl.uniform1f(uniforms.aspect, canvas.width / canvas.height);
      gl.uniform1f(uniforms.pointSize, Math.max(1, pixelRatio));
      gl.uniform2f(uniforms.pointer, pointer.x, pointer.y);
      gl.uniform1f(uniforms.lightMode, lightMode ? 1 : 0);
      gl.drawArrays(gl.POINTS, 0, particleCount);
    };

    const animate = (time) => {
      if (time - lastFrameTime >= 1000 / TARGET_FPS - 2) {
        draw(time);
        lastFrameTime = time;
      }
      frameId = window.requestAnimationFrame(animate);
    };

    const restart = () => {
      window.cancelAnimationFrame(frameId);
      if (reduceMotion.matches || document.hidden) {
        draw(performance.now());
      } else {
        frameId = window.requestAnimationFrame(animate);
      }
    };

    const handleVisibility = () => {
      restart();
    };

    const handlePointer = (event) => {
      pointer.targetX = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.targetY = (event.clientY / window.innerHeight) * 2 - 1;
    };

    const themeObserver = new MutationObserver(() => draw(performance.now()));

    resize();
    restart();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", handlePointer, { passive: true });
    document.addEventListener("visibilitychange", handleVisibility);
    reduceMotion.addEventListener("change", restart);
    themeObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointer);
      document.removeEventListener("visibilitychange", handleVisibility);
      reduceMotion.removeEventListener("change", restart);
      themeObserver.disconnect();
      gl.deleteBuffer(particleBuffer);
      gl.deleteProgram(program);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}
