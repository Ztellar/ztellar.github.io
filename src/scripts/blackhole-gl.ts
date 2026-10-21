// Agujero negro con lente gravitacional real: por cada pixel se integra la trayectoria del rayo
// con acc = -1.5·h²·pos/r⁵ (geodésica nula aproximada, Schwarzschild con r_s = 1). El disco emite
// en cada cruce del plano y=0. El fondo es el cielo real del sitio (el canvas del campo de
// estrellas, subido como textura): cada rayo, ya desviado, se proyecta de vuelta a la pantalla y
// lee el cielo ahí. Así aparecen el anillo de Einstein y las imágenes dobles de verdad.
//
// Lejos del agujero (parámetro de impacto b > 8) no se integra: se usa la deflexión de campo
// débil α = 2·r_s / b. La lente se atenúa hacia el borde de la región para fundirse sin costura
// con el campo de estrellas nítido que está debajo.
import type { HoleState } from './lens';

export interface BlackHole {
  resize(w: number, h: number): void;
  draw(tSec: number, s: HoleState, sky: HTMLCanvasElement): void;
}

export function createBlackHoleGL(canvas: HTMLCanvasElement, reduced: boolean): BlackHole | null {
  const gl = canvas.getContext('webgl', { antialias: false, alpha: true, premultipliedAlpha: true });
  if (!gl) return null;
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  const mobile = window.innerWidth < 720;
  const STEPS = mobile ? 110 : 150;
  const SCALE = Math.min(window.devicePixelRatio || 1, 1.5) * (mobile ? 0.6 : 0.75);

  const vsSrc = 'attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }';
  const fsSrc = `
precision highp float;
uniform vec2 u_res;
uniform float u_time;
uniform vec2 u_center;
uniform vec2 u_look;
uniform float u_zoom;
uniform float u_fade;
uniform sampler2D u_sky;
#define STEPS ${STEPS}
#define REGION 1.05

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
  float rUv = length(uv);
  if (rUv > REGION) { gl_FragColor = vec4(0.0); return; }

  vec3 ro = vec3(u_look.x * 3.0, 1.6 + u_look.y * 1.2, -20.0);
  vec3 fw = normalize(-ro);
  vec3 rt = normalize(cross(vec3(0.0, 1.0, 0.0), fw));
  vec3 up = cross(fw, rt);
  vec3 rd = normalize(fw * 1.2 + uv.x * rt + uv.y * up);

  // Punto de máximo acercamiento del rayo sin desviar
  vec3 pc = ro + rd * dot(-ro, rd);
  float b = length(pc);

  vec3 col = vec3(0.0);
  bool captured = false;
  vec3 dirOut;

  if (b > 8.0) {
    dirOut = normalize(rd - normalize(pc) * (2.0 / b));
  } else {
    vec3 pos = ro;
    vec3 vel = rd;
    float h2 = dot(cross(pos, vel), cross(pos, vel));
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
      if (prevY * pos.y < 0.0) {
        float k = prevY / (prevY - pos.y);
        vec3 hit = mix(prevPos, pos, k);
        float rr = length(hit.xz);
        if (rr > 2.6 && rr < 7.0) col += diskColor(hit, normalize(vel)) * 0.6;
      }
    }
    dirOut = normalize(vel);
  }

  // Cielo: proyecta la dirección final de vuelta a la pantalla y lee la textura ahí
  vec3 sky = vec3(0.0);
  if (!captured) {
    float fz = dot(dirOut, fw);
    vec2 uvd = vec2(dot(dirOut, rt), dot(dirOut, up)) * 1.2 / max(fz, 0.05);
    float lensW = 1.0 - smoothstep(0.6, REGION, rUv);
    vec2 uvs = mix(uv, uvd, lensW);
    vec2 tc = (uvs / u_zoom * u_res.y + u_center * u_res) / u_res;
    vec2 inside = step(vec2(0.0), tc) * step(tc, vec2(1.0));
    sky = texture2D(u_sky, clamp(tc, 0.0, 1.0)).rgb * inside.x * inside.y * smoothstep(0.0, 0.25, fz);
  }

  vec3 lit = col;
  lit = lit / (1.0 + lit);
  lit = pow(lit, vec3(0.4545));
  float a = (1.0 - smoothstep(REGION * 0.85, REGION, rUv)) * u_fade;
  gl_FragColor = vec4(min(sky + lit, 1.0) * a, a);
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
  if (!vs || !fs) return null;
  const prog = gl.createProgram();
  if (!prog) return null;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(prog));
    return null;
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
  const uFade = gl.getUniformLocation(prog, 'u_fade');

  // Textura del cielo: copia reducida y opaca del campo de estrellas (fondo negro)
  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  const skyCopy = document.createElement('canvas');
  const skyCtx = skyCopy.getContext('2d')!;

  // Parallax: objetivo desde el puntero, aplicado con lerp por frame
  let lookX = 0, lookY = 0, targetX = 0, targetY = 0;
  if (finePointer && !reduced) {
    window.addEventListener('pointermove', (e) => {
      targetX = e.clientX / window.innerWidth - 0.5;
      targetY = e.clientY / window.innerHeight - 0.5;
    }, { passive: true });
  }

  function resize(w: number, h: number) {
    canvas.width = Math.max(1, Math.round(w * SCALE));
    canvas.height = Math.max(1, Math.round(h * SCALE));
    skyCopy.width = canvas.width;
    skyCopy.height = canvas.height;
    gl!.viewport(0, 0, canvas.width, canvas.height);
    gl!.uniform2f(uRes, canvas.width, canvas.height);
  }

  function draw(tSec: number, s: HoleState, sky: HTMLCanvasElement) {
    skyCtx.fillStyle = '#000';
    skyCtx.fillRect(0, 0, skyCopy.width, skyCopy.height);
    skyCtx.drawImage(sky, 0, 0, skyCopy.width, skyCopy.height);
    gl!.texImage2D(gl!.TEXTURE_2D, 0, gl!.RGBA, gl!.RGBA, gl!.UNSIGNED_BYTE, skyCopy);

    lookX += (targetX - lookX) * 0.05;
    lookY += (targetY - lookY) * 0.05;
    gl!.uniform2f(uLook, lookX, lookY);
    gl!.uniform1f(uTime, tSec);
    gl!.uniform2f(uCenter, s.cx, 1 - s.cy); // GL tiene la y invertida
    gl!.uniform1f(uZoom, s.zoom);
    gl!.uniform1f(uFade, s.opacity);
    gl!.clearColor(0, 0, 0, 0);
    gl!.clear(gl!.COLOR_BUFFER_BIT);
    gl!.drawArrays(gl!.TRIANGLES, 0, 3);
  }

  return { resize, draw };
}
