import { useEffect, useRef } from "react";

// A large, softly masked disc filled with slowly drifting, domain-warped noise.
// Every pixel samples the noise at a small random offset, which dithers the
// smooth pattern into a fine, particle-like grain. Runs on its own: no pointer
// interaction.

// Share of pixels that light up (1 = every pixel, as dense as possible).
const GRAIN_DENSITY = 0.7;

const VERTEX_SHADER = `
  attribute vec2 aPosition;

  void main() {
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision highp float;

  uniform vec2 uResolution;
  uniform float uTime;
  uniform float uSeed;
  uniform float uLightMode;
  uniform float uDensity;

  #define TAU 6.283185307179586

  // 2D simplex noise.
  // Based on webgl-noise by Ian McEwan / Ashima Arts (MIT License).
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x * 34.0) + 10.0) * x); }

  float simplex(vec2 v) {
    const vec4 C = vec4(
      0.211324865405187,
      0.366025403784439,
      -0.577350269189626,
      0.024390243902439
    );
    vec2 i = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m * m;
    m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  // Slowly drifting noise remapped to 0..1.
  float drift(vec2 p) {
    p += vec2(uTime * 0.02, -uTime * 0.04 + uSeed);
    return simplex(p) * 0.5 + 0.5;
  }

  // Two rounds of domain warping give the soft, folded light shapes.
  float warped(vec2 p) {
    vec2 a = vec2(drift(p), drift(p + vec2(5.2, 1.3)));
    vec2 b = vec2(
      drift(p + 4.0 * a + vec2(1.7, 9.2)),
      drift(p + 4.0 * a + vec2(8.3, 2.8))
    );
    return drift(p + b);
  }

  // Per-pixel white noise used for the grain scatter.
  vec2 hash22(vec2 p) {
    vec3 q = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
    q += dot(q, q.yzx + 33.33);
    return fract((q.xx + q.yz) * q.zy);
  }

  // The disc: crisp along its upper-right rim, feathered toward the
  // lower-left so it melts into the background.
  float discMask(vec2 uv) {
    vec2 d = uv - vec2(0.585, 0.62);
    float dist = length(d);
    vec2 dir = d / max(dist, 1e-4);
    float feather = mix(
      0.012,
      0.16,
      smoothstep(-0.35, 1.0, dot(dir, normalize(vec2(-0.55, -1.0))))
    );
    float inside = 1.0 - smoothstep(0.375 - feather, 0.375 + feather * 0.35, dist);
    vec2 edge = step(vec2(0.0), uv) * step(uv, vec2(1.0));
    return inside * edge.x * edge.y;
  }

  void main() {
    // Scene space: the shorter screen side spans 2 units, like an
    // orthographic camera. The noise plane is 3x3 units, centred down-left.
    float aspect = uResolution.x / uResolution.y;
    vec2 scene = aspect >= 1.0 ? vec2(2.0, 2.0 / aspect) : vec2(2.0 * aspect, 2.0);
    vec2 world = (gl_FragCoord.xy / uResolution - 0.5) * scene;
    vec2 uv = (world - vec2(-0.8, -0.5)) / 3.0 + 0.5;

    float mask = discMask(uv);
    if (mask <= 0.0) {
      gl_FragColor = vec4(0.0);
      return;
    }

    // Scatter each pixel's sample point in a random direction; the scatter
    // is stronger where the disc fades out, so the edge dissolves into dust.
    vec2 rnd = hash22(gl_FragCoord.xy + fract(uSeed) * 517.0);
    float spread = pow(rnd.x, 1.5) + 0.5 * (1.0 - mask);
    vec2 scatter = 0.05 * spread * vec2(cos(rnd.y * TAU), sin(rnd.y * TAU));

    vec2 freq = vec2(0.2, 0.4) + 0.1 * (1.0 - mask);
    float n = warped(uv * freq + scatter);
    n = smoothstep(0.0, 1.0, pow(n * 1.05, 6.0));

    // Thin out the grain: only part of the pixels light up.
    float keep = step(hash22(gl_FragCoord.yx * 1.37 + 91.0).x, uDensity);
    n *= keep;

    vec3 back = vec3(mix(0.0, 0.898, uLightMode));
    vec3 front = vec3(0.5);
    vec3 color = mix(back, front, n);

    // Premultiplied output.
    gl_FragColor = vec4(color * mask, mask);
  }
`;

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const message = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`Background shader could not compile: ${message}`);
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
    throw new Error(`Background shader could not link: ${message}`);
  }

  return program;
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

    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );
    gl.useProgram(program);

    const positionLocation = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const uniforms = {
      resolution: gl.getUniformLocation(program, "uResolution"),
      time: gl.getUniformLocation(program, "uTime"),
      seed: gl.getUniformLocation(program, "uSeed"),
      lightMode: gl.getUniformLocation(program, "uLightMode"),
      density: gl.getUniformLocation(program, "uDensity"),
    };

    gl.uniform1f(uniforms.seed, Math.random() * 100);
    gl.uniform1f(uniforms.density, GRAIN_DENSITY);

    let frameId;
    const startTime = performance.now();
    let lastTime = startTime;
    let lightMix = document.body.classList.contains("light-mode") ? 1 : 0;

    const resize = () => {
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      const width = Math.max(1, Math.round(window.innerWidth * pixelRatio));
      const height = Math.max(1, Math.round(window.innerHeight * pixelRatio));

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
      gl.uniform2f(uniforms.resolution, width, height);
    };

    const draw = (time) => {
      const elapsed = reduceMotion.matches ? 20 : (time - startTime) * 0.001;
      const target = document.body.classList.contains("light-mode") ? 1 : 0;

      // Ease the background tone when the theme flips.
      const delta = Math.min(0.1, Math.max(0, time - lastTime) * 0.001);
      lastTime = time;
      lightMix += (target - lightMix) * Math.min(1, delta * 3);
      if (Math.abs(target - lightMix) < 0.002 || reduceMotion.matches) {
        lightMix = target;
      }

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(uniforms.time, elapsed);
      gl.uniform1f(uniforms.lightMode, lightMix);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    const animate = (time) => {
      draw(time);
      frameId = window.requestAnimationFrame(animate);
    };

    const restart = () => {
      window.cancelAnimationFrame(frameId);
      lastTime = performance.now();
      if (reduceMotion.matches || document.hidden) {
        draw(performance.now());
      } else {
        frameId = window.requestAnimationFrame(animate);
      }
    };

    const themeObserver = new MutationObserver(() => {
      if (reduceMotion.matches) draw(performance.now());
    });

    resize();
    restart();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", restart);
    reduceMotion.addEventListener("change", restart);
    themeObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", restart);
      reduceMotion.removeEventListener("change", restart);
      themeObserver.disconnect();
      gl.deleteBuffer(quad);
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
