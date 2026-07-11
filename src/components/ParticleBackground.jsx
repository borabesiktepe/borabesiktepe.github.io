import { useEffect, useRef } from "react";

const MAX_DEVICE_PIXEL_RATIO = 1;
const MAX_RENDER_PIXELS = 1_200_000;

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
  uniform float uLightMode;

  float hash21(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.103, 0.0973));
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
  }

  float noise(vec2 p) {
    vec2 cell = floor(p);
    vec2 local = fract(p);
    local = local * local * (3.0 - 2.0 * local);

    float a = hash21(cell);
    float b = hash21(cell + vec2(1.0, 0.0));
    float c = hash21(cell + vec2(0.0, 1.0));
    float d = hash21(cell + vec2(1.0, 1.0));

    return mix(mix(a, b, local.x), mix(c, d, local.x), local.y);
  }

  mat2 rotate2d(float angle) {
    float sine = sin(angle);
    float cosine = cos(angle);
    return mat2(cosine, -sine, sine, cosine);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution;
    vec2 p = uv - 0.5;
    float aspect = uResolution.x / uResolution.y;
    p.x *= aspect;

    float time = uTime;

    // Cheap analytic flow: no texture lookups and only one noise sample in
    // the entire shader. This keeps integrated GPUs smooth as well.
    float flowA =
      sin(p.y * 3.1 + time * 0.72) * 0.58 +
      sin((p.x + p.y) * 2.2 - time * 0.43) * 0.3;
    float flowB =
      cos(p.x * 2.75 - time * 0.61) * 0.55 +
      sin((p.x - p.y) * 2.0 + time * 0.37) * 0.28;

    vec2 warped = p;
    warped.x += flowA * 0.1;
    warped.y += flowB * 0.105;
    warped.x += sin(warped.y * 3.4 + time * 0.78) * 0.065;
    warped.y += sin(warped.x * 2.8 - time * 0.66) * 0.09;

    // An animated, imperfect elliptical ribbon forms the broad grain wave.
    vec2 ribbonPoint = rotate2d(-0.14 + sin(time * 0.12) * 0.035) *
      (warped - vec2(-0.18, 0.015));
    ribbonPoint *= vec2(0.82, 1.08);

    float radius = length(ribbonPoint);
    float ribbonAngle = atan(ribbonPoint.y, ribbonPoint.x);
    float targetRadius =
      0.52 +
      sin(ribbonAngle * 2.0 + time * 0.24) * 0.045 +
      sin(ribbonAngle * 3.0 - time * 0.18) * 0.028;
    float ribbonDistance = abs(radius - targetRadius);
    float ribbon = 1.0 - smoothstep(0.035, 0.15, ribbonDistance);
    ribbon *= 0.78 + 0.22 * sin(ribbonAngle + flowA * 0.7 + 0.9);

    // Break the perfect ring and create the diffuse left/top mass.
    float leftMass = exp(
      -dot(
        (warped - vec2(-0.48, 0.08)) * vec2(0.9, 1.2),
        (warped - vec2(-0.48, 0.08)) * vec2(0.9, 1.2)
      ) * 2.4
    );
    float bottomSweep = exp(
      -dot(
        (warped - vec2(0.0, -0.58)) * vec2(0.8, 2.2),
        (warped - vec2(0.0, -0.58)) * vec2(0.8, 2.2)
      ) * 2.8
    );

    float breakup = 0.7 +
      noise(warped * 3.25 + vec2(time * 0.08, -time * 0.055)) * 0.46;
    float density = clamp(
      (ribbon * 0.98 + leftMass * 0.32 + bottomSweep * 0.36) * breakup,
      0.0,
      1.0
    );

    // The grain coordinates travel with the flow, so the dots participate in
    // the wave instead of flickering in a stationary mask.
    vec2 grainFlow = vec2(flowA, flowB) * 28.0;
    vec2 grainPosition =
      gl_FragCoord.xy + grainFlow + vec2(time * 13.0, -time * 8.0);
    float grain = hash21(floor(grainPosition));
    float grainAlpha = hash21(floor(grainPosition) + vec2(19.7, 83.1));
    float particle = step(1.0 - density * 0.32, grain);

    float edgeFade = smoothstep(0.0, 0.12, uv.x) *
      smoothstep(0.0, 0.1, uv.y) *
      smoothstep(0.0, 0.08, 1.0 - uv.x) *
      smoothstep(0.0, 0.08, 1.0 - uv.y);

    float alpha = particle * edgeFade * mix(0.2, 0.64, grainAlpha);
    vec3 color = mix(vec3(1.0), vec3(0.0), uLightMode);

    gl_FragColor = vec4(color, alpha);
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
    const program = createProgram(gl);
    const positionBuffer = gl.createBuffer();
    const positionLocation = gl.getAttribLocation(program, "aPosition");
    const resolutionLocation = gl.getUniformLocation(program, "uResolution");
    const timeLocation = gl.getUniformLocation(program, "uTime");
    const lightModeLocation = gl.getUniformLocation(program, "uLightMode");

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    gl.useProgram(program);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    let frameId;
    let startTime = performance.now();

    const resize = () => {
      const cssWidth = Math.max(1, window.innerWidth);
      const cssHeight = Math.max(1, window.innerHeight);
      const requestedRatio = Math.min(
        window.devicePixelRatio || 1,
        MAX_DEVICE_PIXEL_RATIO,
      );
      const pixelScale = Math.min(
        requestedRatio,
        Math.sqrt(MAX_RENDER_PIXELS / (cssWidth * cssHeight)),
      );
      const width = Math.max(1, Math.round(cssWidth * pixelScale));
      const height = Math.max(1, Math.round(cssHeight * pixelScale));

      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        gl.viewport(0, 0, width, height);
        gl.uniform2f(resolutionLocation, width, height);
      }
    };

    const draw = (time) => {
      const elapsed = reduceMotion.matches ? 3.5 : (time - startTime) * 0.001;
      const lightMode = document.body.classList.contains("light-mode");

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(timeLocation, elapsed);
      gl.uniform1f(lightModeLocation, lightMode ? 1 : 0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };

    const animate = (time) => {
      draw(time);
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
        startTime = performance.now() - 3500;
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
      gl.deleteBuffer(positionBuffer);
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
