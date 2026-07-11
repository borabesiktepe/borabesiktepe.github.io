import { useEffect, useRef } from "react";

const MAX_PARTICLES = 80_000;
const MIN_PARTICLES = 28_000;
const TARGET_FPS = 30;

const VERTEX_SHADER = `
  precision highp float;

  attribute vec4 aParticle;

  uniform float uTime;
  uniform float uLightMode;

  varying float vAlpha;

  void main() {
    float variation = aParticle.w;
    float speed = mix(0.006, 0.013, variation);
    float travel = fract(aParticle.x + uTime * speed);

    // Particles continuously enter from the left and fade before reaching the
    // far right. Each point has its own vertical offset and orbital phase.
    float x = travel * 1.14 - 0.08;
    float center =
      0.5 +
      sin(x * 2.35 + uTime * 0.075) * 0.095 +
      sin(x * 0.82 - uTime * 0.038 + 1.7) * 0.055;
    float width = 0.15 +
      (0.5 + 0.5 * sin(x * 1.55 - uTime * 0.045 + aParticle.z * 0.07)) *
      0.17;

    float y = center + aParticle.y * width;

    // Slow counter-clockwise local orbits keep neighboring points from moving
    // as a rigid texture while the cloud as a whole travels to the right.
    float orbitAngle = aParticle.z + uTime * mix(0.11, 0.19, variation);
    float orbitSize = mix(0.006, 0.024, variation);
    x += cos(orbitAngle) * orbitSize;
    y += sin(orbitAngle) * orbitSize * 1.55;

    // Seeded micro-currents break up the silhouette without creating a shared,
    // repeating edge across the cloud.
    y += sin(aParticle.z * 1.73 + x * 4.7 + uTime * 0.09) *
      mix(0.006, 0.021, variation);
    x += sin(aParticle.z * 0.61 + y * 3.2 - uTime * 0.055) * 0.009;

    float leftFade = smoothstep(-0.075, 0.025, x);
    float rightFade = 1.0 - smoothstep(0.7, 1.02, x);
    float verticalFade = smoothstep(0.015, 0.09, y) *
      smoothstep(0.015, 0.09, 1.0 - y);
    float themeAlpha = mix(1.0, 0.68, uLightMode);

    vAlpha = leftFade * rightFade * verticalFade *
      mix(0.3, 0.68, variation) * themeAlpha;

    gl_PointSize = mix(1.65, 2.45, variation);
    gl_Position = vec4(x * 2.0 - 1.0, y * 2.0 - 1.0, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision highp float;

  uniform float uLightMode;
  varying float vAlpha;

  void main() {
    float distanceFromCenter = length(gl_PointCoord - vec2(0.5));
    float coverage = 1.0 - smoothstep(0.16, 0.54, distanceFromCenter);
    vec3 color = mix(vec3(0.94), vec3(0.14), uLightMode);

    gl_FragColor = vec4(color, vAlpha * coverage);
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
  let state = 0x6d2b79f5;

  const random = () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };

  for (let index = 0; index < MAX_PARTICLES; index += 1) {
    const offset = index * 4;
    const verticalDistribution =
      (random() + random() + random() + random()) * 0.5 - 1.0;

    data[offset] = random();
    data[offset + 1] = verticalDistribution;
    data[offset + 2] = random() * Math.PI * 2;
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
      premultipliedAlpha: false,
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
    const timeLocation = gl.getUniformLocation(program, "uTime");
    const lightModeLocation = gl.getUniformLocation(program, "uLightMode");

    gl.bindBuffer(gl.ARRAY_BUFFER, particleBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, createParticleData(), gl.STATIC_DRAW);
    gl.useProgram(program);
    gl.enableVertexAttribArray(particleLocation);
    gl.vertexAttribPointer(particleLocation, 4, gl.FLOAT, false, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    let frameId;
    let particleCount = MIN_PARTICLES;
    let startTime = performance.now();
    let lastFrameTime = 0;

    const resize = () => {
      const cssWidth = Math.max(1, window.innerWidth);
      const cssHeight = Math.max(1, window.innerHeight);
      const mobilePixelRatio = cssWidth <= 820
        ? Math.min(window.devicePixelRatio || 1, 2)
        : 1;
      const width = Math.max(1, Math.round(cssWidth * mobilePixelRatio));
      const height = Math.max(1, Math.round(cssHeight * mobilePixelRatio));

      particleCount = Math.min(
        MAX_PARTICLES,
        Math.max(MIN_PARTICLES, Math.round((cssWidth * cssHeight) / 27)),
      );

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
      }
    };

    const draw = (time) => {
      const elapsed = reduceMotion.matches ? 4.0 : (time - startTime) * 0.001;
      const lightMode = document.body.classList.contains("light-mode");

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(timeLocation, elapsed);
      gl.uniform1f(lightModeLocation, lightMode ? 1 : 0);
      gl.drawArrays(gl.POINTS, 0, particleCount);
    };

    const animate = (time) => {
      if (time - lastFrameTime >= 1000 / TARGET_FPS) {
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
      if (!document.hidden) {
        startTime = performance.now() - 4000;
      }
      restart();
    };

    const themeObserver = new MutationObserver(() => draw(performance.now()));

    resize();
    restart();
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", handleVisibility);
    reduceMotion.addEventListener("change", restart);
    themeObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
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
