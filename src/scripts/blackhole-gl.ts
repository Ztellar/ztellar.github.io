// Agujero negro con lente gravitacional real: por cada pixel se integra la
// trayectoria del rayo con acc = -1.5·h²·pos/r⁵ (geodésica nula aproximada,
// Schwarzschild con r_s = 1). El disco emite en cada cruce del plano y=0.
// Full-bleed: el canvas llena el hero; u_center compone el agujero y u_look
// aplica parallax de cámara con el puntero. La posición vive en lens.ts para que
// el campo de estrellas de fondo aplique la lente en el mismo lugar.
import { layout } from './lens';

export function initBlackHoleGL(canvas: HTMLCanvasElement): boolean {
  const gl = canvas.getContext('webgl', { antialias: false, alpha: true, premultipliedAlpha: true });
  if (!gl) return false;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  const mobile = window.innerWidth < 720;
  const STEPS = mobile ? 110 : 170;
  const SCALE = Math.min(window.devicePixelRatio || 1, 1.5) * (mobile ? 0.6 : 0.55);

  const vsSrc = 'attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }';
  const fsSrc = `
precision highp float;
uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_center;
uniform vec2 u_look;
uniform float u_zoom;
#define STEPS ${STEPS}

float hash(vec3 p) { p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }

vec3 bgStars(vec3 rd) {
  vec3 col = vec3(0.0);
  for (int i = 0; i < 2; i++) {
    float scale = i == 0 ? 60.0 : 130.0;
    vec3 cell = floor(rd * scale);
    float h = hash(cell);
    if (h > 0.996) {
      float b = fract(h * 901.37);
      vec3 f = fract(rd * scale) - 0.5;
      col += (0.25 + 0.75 * b) * smoothstep(0.35, 0.0, length(f)) * vec3(0.8 + 0.3 * b, 0.85, 1.0);
    }
  }
  return col * 0.85;
}

vec3 diskColor(vec3 pos, vec3 rd) {
  float r = length(pos.xz);
  float tR = clamp(1.0 - (r - 2.6) / 4.4, 0.0, 1.0);
  float phi = atan(pos.z, pos.x);
  float om = 8.0 * pow(2.6 / r, 1.5);
  float stripe = 0.7 + 0.3 * sin(phi * 9.0 - u_time * om + r * 3.0);
  stripe *= 0.8 + 0.2 * sin(phi * 23.0 - u_time * om * 1.7);
  vec3 vdir = normalize(vec3(-sin(phi), 0.0, cos(phi)));
  float dop = 1.0 + 0.7 * dot(vdir, -rd);
  float bright = (0.3 + 1.9 * tR * tR) * stripe * dop;
  vec3 c = mix(vec3(1.0, 0.30, 0.02), vec3(1.0, 0.62, 0.22), tR);
  c = mix(c, vec3(1.0, 0.95, 0.85), clamp(dop - 1.0, 0.0, 1.0) * 0.45);
  return c * bright;
}

void main() {
  vec2 uv = (gl_FragCoord.xy - u_center * u_res) / u_res.y * u_zoom;
  vec3 ro = vec3(u_look.x * 3.0, 1.6 + u_look.y * 1.2, -20.0);
  vec3 fw = normalize(-ro);
  vec3 rt = normalize(cross(vec3(0.0, 1.0, 0.0), fw));
  vec3 up = cross(fw, rt);
  vec3 rd = normalize(fw * 1.2 + uv.x * rt + uv.y * up);

  vec3 pos = ro;
  vec3 vel = rd;
  float h2 = dot(cross(pos, vel), cross(pos, vel));

  vec3 col = vec3(0.0);
  float glow = 0.0;
  bool captured = false;

  for (int i = 0; i < STEPS; i++) {
    float r = length(pos);
    if (r < 1.0) { captured = true; break; }
    if (r > 42.0) break;
    float dt = 0.045 + 0.06 * clamp(r - 2.0, 0.0, 6.0);
    vec3 prevPos = pos;
    float prevY = pos.y;
    vec3 acc = -1.5 * h2 * pos / pow(r, 5.0);
    vel += acc * dt;
    pos += vel * dt;
    if (r < 8.0) glow += dt * 0.012 / (r * r * 0.5 + 0.3);
    if (prevY * pos.y < 0.0) {
      float k = prevY / (prevY - pos.y);
      vec3 hit = mix(prevPos, pos, k);
      float rr = length(hit.xz);
      if (rr > 2.6 && rr < 7.0) col += diskColor(hit, normalize(vel)) * 0.6;
    }
  }
  if (!captured) col += bgStars(normalize(vel));
  col += vec3(1.0, 0.72, 0.4) * glow * 1.1;
  col = col / (1.0 + col);
  col = pow(col, vec3(0.4545));
  // Vignette centrado en el agujero: funde a transparente hacia los bordes
  float vig = smoothstep(1.15, 0.6, length(uv));
  col *= vig;
  float alpha = clamp(max(max(col.r, col.g), col.b) * 1.6, 0.0, 1.0) * vig;
  gl_FragColor = vec4(col, alpha);
}`;

  function compile(type: number, src: string): WebGLShader | null {
    const s = gl!.createShader(type);
    if (!s) return null;
    gl!.shaderSource(s, src);
    gl!.compileShader(s);
    if (!gl!.getShaderParameter(s, gl!.COMPILE_STATUS)) {
      console.error(gl!.getShaderInfoLog(s));
      return null;
    }
    return s;
  }

  const vs = compile(gl.VERTEX_SHADER, vsSrc);
  const fs = compile(gl.FRAGMENT_SHADER, fsSrc);
  if (!vs || !fs) return false;
  const prog = gl.createProgram();
  if (!prog) return false;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(prog));
    return false;
  }
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const uRes = gl.getUniformLocation(prog, 'u_res');
  const uTime = gl.getUniformLocation(prog, 'u_time');
  const uCenter = gl.getUniformLocation(prog, 'u_center');
  const uLook = gl.getUniformLocation(prog, 'u_look');
  const uZoom = gl.getUniformLocation(prog, 'u_zoom');

  // Parallax: objetivo desde el puntero, aplicado con lerp por frame
  let lookX = 0, lookY = 0, targetX = 0, targetY = 0;
  if (finePointer && !reduced) {
    window.addEventListener('pointermove', (e) => {
      targetX = e.clientX / window.innerWidth - 0.5;
      targetY = e.clientY / window.innerHeight - 0.5;
    }, { passive: true });
  }

  function resize() {
    const cw = Math.max(1, canvas.clientWidth);
    const ch = Math.max(1, canvas.clientHeight);
    canvas.width = Math.max(1, Math.round(cw * SCALE));
    canvas.height = Math.max(1, Math.round(ch * SCALE));
    gl!.viewport(0, 0, canvas.width, canvas.height);
    gl!.uniform2f(uRes, canvas.width, canvas.height);
    const { cx, cy, zoom } = layout(window.innerWidth < 720);
    gl!.uniform2f(uCenter, cx, 1 - cy); // GL tiene la y invertida
    gl!.uniform1f(uZoom, zoom);
    if (reduced) {
      gl!.uniform2f(uLook, 0, 0);
      gl!.uniform1f(uTime, 4.0);
      gl!.drawArrays(gl!.TRIANGLES, 0, 3);
    }
  }

  let raf = 0, running = false;
  const t0 = performance.now();

  function frame(now: number) {
    lookX += (targetX - lookX) * 0.05;
    lookY += (targetY - lookY) * 0.05;
    gl!.uniform2f(uLook, lookX, lookY);
    gl!.uniform1f(uTime, (now - t0) / 1000);
    gl!.drawArrays(gl!.TRIANGLES, 0, 3);
    raf = requestAnimationFrame(frame);
  }

  window.addEventListener('resize', resize);
  resize();
  if (reduced) return true;

  const io = new IntersectionObserver(([e]) => {
    const want = !!e && e.isIntersecting && !document.hidden;
    if (want && !running) { running = true; raf = requestAnimationFrame(frame); }
    if (!want && running) { running = false; cancelAnimationFrame(raf); }
  });
  io.observe(canvas);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && running) { running = false; cancelAnimationFrame(raf); }
    else if (!document.hidden && !running) { running = true; raf = requestAnimationFrame(frame); }
  });
  return true;
}
