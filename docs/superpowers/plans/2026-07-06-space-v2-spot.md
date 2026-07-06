# Space v2 (WebGL + cine) + Spot Featured Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Agujero negro WebGL con lensing real en el hero, fondo 2D cinemático (nebulosas, fugaces, warp) y tarjeta destacada de Spot en Proyectos.

**Architecture:** El shader WebGL (sin librerías) integra trayectorias de luz por pixel con `acc = -1.5·h²·pos/r⁵` y acumula emisión del disco en cada cruce del plano; `blackhole-main.ts` intenta GL y cae al 2D existente. El starfield gana una capa de nebulosa precomputada en canvas offscreen, meteoros temporizados y warp de entrada. Spot es un bloque `projects.featured` nuevo en los diccionarios renderizado antes de la grilla.

**Tech Stack:** Astro 5 existente, WebGL 1 crudo (GLSL ES 1.00), canvas 2D, Vitest.

## Global Constraints

- Cero dependencias externas en runtime y cero librerías nuevas.
- Texto visible solo desde `src/i18n/{es,en}.ts` (paridad de claves testeada).
- `prefers-reduced-motion: reduce` ⇒ un solo frame estático en TODOS los efectos (warp y meteoros ni aparecen).
- Animaciones pausadas fuera de viewport y con pestaña oculta.
- Lighthouse Performance ≥ 90, Accessibility ≥ 95 tras los cambios.
- Working dir: `C:\Users\Benja\Downloads\Portfolio`, rama `main` (push despliega).

---

### Task 1: Tarjeta destacada Spot (i18n + componente)

**Files:**
- Modify: `src/i18n/types.ts` (bloque `projects`)
- Modify: `src/i18n/es.ts`, `src/i18n/en.ts` (agregar `featured`)
- Modify: `src/components/Projects.astro`

**Interfaces:**
- Produces: `dict.projects.featured: ProjectItem` (name, description, context, stack). El test de paridad existente (`tests/i18n.test.ts`) cubre las claves nuevas sin cambios.

- [ ] **Step 1: Tipo**

En `src/i18n/types.ts` cambiar el bloque `projects` a:
```ts
  projects: { heading: string; privateNote: string; featured: ProjectItem; items: ProjectItem[] };
```

- [ ] **Step 2: Contenido ES**

En `src/i18n/es.ts`, dentro de `projects`, después de `privateNote`:
```ts
    featured: {
      name: 'Spot — Ticketing con blockchain invisible',
      description:
        'Plataforma de venta de entradas donde cada ticket es un cNFT en Solana sin que el usuario vea nada de crypto: login tradicional y wallets custodiales autogeneradas. Anti-falsificación, reventa limitada a +20% con regalías automáticas para organizadores y artistas, entrada por NFC "tap to enter" y validación offline.',
      context: 'Proyecto personal · MVP en pilotos controlados · TICSUR 2026, Temuco',
      stack: ['Next.js', 'NestJS', 'TypeScript', 'PostgreSQL', 'Redis', 'Solana cNFTs', 'Expo / React Native', 'NFC'],
    },
```

- [ ] **Step 3: Contenido EN**

En `src/i18n/en.ts`, dentro de `projects`, después de `privateNote`:
```ts
    featured: {
      name: 'Spot — Ticketing with invisible blockchain',
      description:
        'Ticketing platform where every ticket is a Solana cNFT without users ever touching crypto: traditional login and auto-generated custodial wallets. Anti-counterfeiting, resale capped at +20% with automatic royalties for organizers and artists, NFC "tap to enter" access and offline validation.',
      context: 'Personal project · MVP in controlled pilots · TICSUR 2026, Temuco',
      stack: ['Next.js', 'NestJS', 'TypeScript', 'PostgreSQL', 'Redis', 'Solana cNFTs', 'Expo / React Native', 'NFC'],
    },
```

- [ ] **Step 4: Componente**

En `src/components/Projects.astro`, entre `<p class="mono">{dict.projects.privateNote}</p>` y `<div class="grid">` insertar:
```astro
  <article class="card featured">
    <h3>{dict.projects.featured.name}</h3>
    <p class="mono">{dict.projects.featured.context}</p>
    <p>{dict.projects.featured.description}</p>
    <div>{dict.projects.featured.stack.map((s) => <span class="chip">{s}</span>)}</div>
  </article>
```
Y en el `<style>` agregar:
```css
  .featured {
    margin-top: 1.5rem;
    border-color: color-mix(in srgb, var(--accent) 55%, transparent);
    box-shadow: 0 0 28px rgba(255, 158, 79, 0.12);
  }
  .featured h3 { font-size: 1.3rem; }
```

- [ ] **Step 5: Verificar y commit**

Run: `npm run test` → 4 PASS (paridad incluye `featured`).
Run: `npm run build; node -e "const f=require('fs');console.log('ES Spot:',f.readFileSync('dist/index.html','utf8').includes('blockchain invisible'),'| EN Spot:',f.readFileSync('dist/en/index.html','utf8').includes('invisible blockchain'))"`
Expected: `ES Spot: true | EN Spot: true`

```bash
git add src/i18n src/components/Projects.astro
git commit -m "feat: Spot featured project card (ES/EN)"
```

---

### Task 2: Fondo cinemático (nebulosas + meteoros + warp)

**Files:**
- Modify: `src/scripts/starfield.ts` (reemplazo completo del archivo)

**Interfaces:**
- Consumes: `src/data/stars.json`, `<canvas id="starfield">`.
- Produces: mismo contrato externo (script autónomo al importarse).

- [ ] **Step 1: Reemplazar `src/scripts/starfield.ts` completo con:**

```ts
import starsData from '../data/stars.json';

type Star = { x: number; y: number; m: number; c: string };

const canvas = document.getElementById('starfield') as HTMLCanvasElement | null;
if (canvas) init(canvas);

function init(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d')!;
  const allStars = starsData as Star[];
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let stars = allStars;
  let w = 0, h = 0, dpr = 1, raf = 0;
  const t0 = performance.now();
  const WARP_MS = 1200;

  // Fase de parpadeo estable por estrella (ángulo áureo)
  const phase = allStars.map((_, i) => (i * 2.399963) % (Math.PI * 2));

  let nebula: HTMLCanvasElement | null = null;

  // PRNG determinista para que la nebulosa sea estable entre resizes
  function makeNebula(): HTMLCanvasElement {
    const nc = document.createElement('canvas');
    nc.width = w; nc.height = h;
    const g = nc.getContext('2d')!;
    let seed = 1604;
    const rand = () => {
      seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    // Banda de Vía Láctea diagonal
    g.save();
    g.translate(w / 2, h / 2);
    g.rotate(-0.35);
    const band = g.createLinearGradient(0, -h * 0.28, 0, h * 0.28);
    band.addColorStop(0, 'rgba(26,37,80,0)');
    band.addColorStop(0.5, 'rgba(60,72,120,0.16)');
    band.addColorStop(1, 'rgba(26,37,80,0)');
    g.fillStyle = band;
    g.fillRect(-w, -h, w * 2, h * 2);
    g.restore();
    // Manchas de nebulosa
    const palettes = ['26,37,80', '42,31,74', '20,45,70', '70,40,80'];
    for (let i = 0; i < 26; i++) {
      const x = rand() * w, y = rand() * h;
      const r = (0.08 + rand() * 0.22) * Math.max(w, h);
      const col = palettes[Math.floor(rand() * palettes.length)]!;
      const a = 0.05 + rand() * 0.09;
      const rg = g.createRadialGradient(x, y, 0, x, y, r);
      rg.addColorStop(0, `rgba(${col},${a})`);
      rg.addColorStop(1, `rgba(${col},0)`);
      g.fillStyle = rg;
      g.fillRect(x - r, y - r, r * 2, r * 2);
    }
    return nc;
  }

  // Estrellas fugaces
  type Meteor = { x0: number; y0: number; dx: number; dy: number; start: number; dur: number };
  let meteor: Meteor | null = null;
  let nextMeteorAt = 2500 + Math.random() * 4000;

  function spawnMeteor(t: number) {
    const ang = Math.PI * (0.15 + Math.random() * 0.2);
    const speed = (0.55 + Math.random() * 0.4) * Math.max(w, h);
    meteor = {
      x0: Math.random() * w * 0.8,
      y0: Math.random() * h * 0.35,
      dx: Math.cos(ang) * speed,
      dy: Math.sin(ang) * speed,
      start: t,
      dur: 700 + Math.random() * 400,
    };
    nextMeteorAt = t + 4000 + Math.random() * 5000;
  }

  function drawMeteor(t: number) {
    if (!meteor) return;
    const k = (t - meteor.start) / meteor.dur;
    if (k >= 1) { meteor = null; return; }
    const x = meteor.x0 + meteor.dx * k;
    const y = meteor.y0 + meteor.dy * k;
    const kt = Math.max(0, k - 0.06);
    const x2 = meteor.x0 + meteor.dx * kt;
    const y2 = meteor.y0 + meteor.dy * kt;
    const fade = Math.sin(Math.PI * Math.min(1, k));
    const grad = ctx.createLinearGradient(x2, y2, x, y);
    grad.addColorStop(0, 'rgba(220,240,255,0)');
    grad.addColorStop(1, `rgba(220,240,255,${0.85 * fade})`);
    ctx.strokeStyle = grad;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x2, y2);
    ctx.lineTo(x, y);
    ctx.stroke();
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth; h = window.innerHeight;
    stars = w < 720 ? allStars.filter((s) => s.m < 4) : allStars;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    nebula = makeNebula();
    if (reduced) draw(WARP_MS + 1);
  }

  function draw(t: number) {
    ctx.clearRect(0, 0, w, h);
    if (nebula) ctx.drawImage(nebula, 0, 0);
    const scroll = window.scrollY;
    // Warp de entrada: factor 1→0 con ease-out cúbico
    const wk = reduced ? 0 : Math.max(0, 1 - t / WARP_MS);
    const warp = wk * wk * wk;
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i]!;
      const bright = Math.min(1, Math.max(0.15, 1 - (s.m + 1) / 6.5));
      const size = Math.max(0.4, 2.2 - s.m * 0.38);
      const py = (s.y * h * 1.4 - scroll * (0.06 + bright * 0.1)) % (h + 40);
      const y = py < -20 ? py + h + 40 : py;
      const x = s.x * w;
      const twinkle = reduced ? 1 : 0.75 + 0.25 * Math.sin(t / 900 + phase[i]!);
      ctx.globalAlpha = bright * twinkle;
      ctx.fillStyle = s.c;
      if (warp > 0.01) {
        // viaje radial desde el centro con estela
        const dxr = x - w / 2, dyr = y - h / 2;
        const px = x + dxr * warp * 2.5, pyw = y + dyr * warp * 2.5;
        const qx = x + dxr * warp * 3.4, qy = y + dyr * warp * 3.4;
        ctx.strokeStyle = s.c;
        ctx.lineWidth = size;
        ctx.beginPath();
        ctx.moveTo(qx, qy);
        ctx.lineTo(px, pyw);
        ctx.stroke();
      } else {
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
    if (!reduced && t > WARP_MS) {
      if (t >= nextMeteorAt && !meteor) spawnMeteor(t);
      drawMeteor(t);
    }
  }

  function loop(now: number) {
    draw(now - t0);
    raf = requestAnimationFrame(loop);
  }

  window.addEventListener('resize', resize);
  resize();
  if (!reduced) {
    document.addEventListener('visibilitychange', () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) raf = requestAnimationFrame(loop);
    });
    raf = requestAnimationFrame(loop);
  }
}
```

- [ ] **Step 2: Verificar**

Run: `npm run build`
Expected: OK.
Levantar `npm run preview` (background) y screenshot con Edge headless (1400×900): se ven manchas azul-púrpura sutiles y banda diagonal; tras 1.2 s las estrellas están en posición (la captura llega tarde, así que se ven puntos, no streaks).

- [ ] **Step 3: Commit**

```bash
git add src/scripts/starfield.ts
git commit -m "feat: cinematic background — nebula layer, shooting stars, warp-in"
```

---

### Task 3: Agujero negro WebGL con lensing + fallback

**Files:**
- Modify: `src/scripts/blackhole.ts` (envolver en export, quitar auto-run)
- Create: `src/scripts/blackhole-gl.ts`
- Create: `src/scripts/blackhole-main.ts`
- Modify: `src/components/BlackHole.astro` (script src)

**Interfaces:**
- Produces: `initBlackHole2D(canvas: HTMLCanvasElement): void` (blackhole.ts); `initBlackHoleGL(canvas: HTMLCanvasElement): boolean` (blackhole-gl.ts; false si WebGL/compilación falla). `blackhole-main.ts` orquesta.

- [ ] **Step 1: Refactor 2D a export**

En `src/scripts/blackhole.ts` reemplazar las 2 primeras líneas efectivas:
```ts
const canvas = document.getElementById('blackhole') as HTMLCanvasElement | null;
if (canvas) init(canvas);

function init(canvas: HTMLCanvasElement) {
```
por:
```ts
export function initBlackHole2D(canvas: HTMLCanvasElement) {
```
(el resto del archivo queda igual).

- [ ] **Step 2: Crear `src/scripts/blackhole-gl.ts`:**

```ts
// Agujero negro con lente gravitacional real: por cada pixel se integra la
// trayectoria del rayo con acc = -1.5·h²·pos/r⁵ (geodésica nula aproximada,
// Schwarzschild con r_s = 1). El disco emite en cada cruce del plano y=0.
export function initBlackHoleGL(canvas: HTMLCanvasElement): boolean {
  const gl = canvas.getContext('webgl', { antialias: false, alpha: true, premultipliedAlpha: true });
  if (!gl) return false;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const mobile = window.innerWidth < 720;
  const STEPS = mobile ? 110 : 170;
  const SCALE = Math.min(window.devicePixelRatio || 1, 1.5) * (mobile ? 0.75 : 1);

  const vsSrc = 'attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }';
  const fsSrc = `
precision highp float;
uniform vec2 u_res;
uniform float u_time;
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
  float stripe = 0.55 + 0.45 * sin(phi * 9.0 - u_time * om + r * 3.0);
  stripe *= 0.7 + 0.3 * sin(phi * 23.0 - u_time * om * 1.7);
  vec3 vdir = normalize(vec3(-sin(phi), 0.0, cos(phi)));
  float dop = 1.0 + 0.7 * dot(vdir, -rd);
  float bright = (0.25 + 1.6 * tR * tR) * stripe * dop;
  vec3 c = mix(vec3(1.0, 0.36, 0.05), vec3(1.0, 0.85, 0.6), tR);
  c = mix(c, vec3(1.0, 0.97, 0.92), clamp(dop - 1.0, 0.0, 1.0) * 0.8);
  return c * bright;
}

void main() {
  vec2 uv = (gl_FragCoord.xy - 0.5 * u_res) / u_res.y;
  vec3 ro = vec3(0.0, 1.1, -13.0);
  vec3 fw = normalize(-ro);
  vec3 rt = normalize(cross(vec3(0.0, 1.0, 0.0), fw));
  vec3 up = cross(fw, rt);
  vec3 rd = normalize(fw * 1.9 + uv.x * rt + uv.y * up);

  vec3 pos = ro;
  vec3 vel = rd;
  float h2 = dot(cross(pos, vel), cross(pos, vel));

  vec3 col = vec3(0.0);
  float glow = 0.0;
  bool captured = false;

  for (int i = 0; i < STEPS; i++) {
    float r = length(pos);
    if (r < 1.0) { captured = true; break; }
    if (r > 30.0) break;
    float dt = 0.06 + 0.04 * clamp(r - 2.0, 0.0, 4.0);
    vec3 prevPos = pos;
    float prevY = pos.y;
    vec3 acc = -1.5 * h2 * pos / pow(r, 5.0);
    vel += acc * dt;
    pos += vel * dt;
    glow += dt * 0.012 / (r * r * 0.5 + 0.3);
    if (prevY * pos.y < 0.0) {
      float k = prevY / (prevY - pos.y);
      vec3 hit = mix(prevPos, pos, k);
      float rr = length(hit.xz);
      if (rr > 2.6 && rr < 7.0) col += diskColor(hit, normalize(vel)) * 0.6;
    }
  }
  if (!captured) col += bgStars(normalize(vel));
  col += vec3(1.0, 0.75, 0.45) * glow * 1.2;
  col = col / (1.0 + col);
  col = pow(col, vec3(0.4545));
  float alpha = clamp(max(max(col.r, col.g), col.b) * 1.6, 0.0, 1.0);
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
  const prog = gl.createProgram()!;
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

  const size = Math.round(520 * SCALE);
  canvas.width = size;
  canvas.height = size;
  gl.viewport(0, 0, size, size);
  gl.uniform2f(uRes, size, size);

  let raf = 0, running = false;
  const t0 = performance.now();

  function frame(now: number) {
    gl!.uniform1f(uTime, (now - t0) / 1000);
    gl!.drawArrays(gl!.TRIANGLES, 0, 3);
    raf = requestAnimationFrame(frame);
  }

  if (reduced) {
    gl.uniform1f(uTime, 4.0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    return true;
  }

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
```

- [ ] **Step 3: Crear `src/scripts/blackhole-main.ts`:**

```ts
import { initBlackHole2D } from './blackhole';
import { initBlackHoleGL } from './blackhole-gl';

const canvas = document.getElementById('blackhole') as HTMLCanvasElement | null;
if (canvas && !initBlackHoleGL(canvas)) initBlackHole2D(canvas);
```

- [ ] **Step 4: Apuntar el componente al orquestador**

En `src/components/BlackHole.astro` cambiar `<script src="../scripts/blackhole.ts"></script>` por `<script src="../scripts/blackhole-main.ts"></script>`.

- [ ] **Step 5: Verificar**

Run: `npm run build`
Expected: OK sin warnings de TS.
Con `npm run preview` en background, screenshot Edge headless del hero (1400×900): el agujero negro muestra disco atravesando por delante, arco superior E inferior alrededor del horizonte (lensing), lado izquierdo más brillante. Si en el screenshot se ve el 2D antiguo, revisar consola del navegador (log de compilación del shader).

- [ ] **Step 6: Commit**

```bash
git add src/scripts/blackhole.ts src/scripts/blackhole-gl.ts src/scripts/blackhole-main.ts src/components/BlackHole.astro
git commit -m "feat: WebGL gravitational-lensing black hole with 2D fallback"
```

---

### Task 4: QA integral + deploy + verificación en vivo

**Files:**
- Modify: solo ajustes que surjan de QA.

**Interfaces:**
- Consumes: Tasks 1–3 completas.

- [ ] **Step 1: Suite completa**

Run: `npm run test; npm run build`
Expected: 4 tests PASS, build limpio.

- [ ] **Step 2: Lighthouse**

Con `npm run preview` en background:
```powershell
$env:CHROME_PATH = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"; npx -y lighthouse http://localhost:4321 --quiet --chrome-flags="--headless=new" --only-categories=performance,accessibility --output=json --output-path="$env:TEMP\lh2.json"; node -e "const r=require(process.env.TEMP+'/lh2.json');console.log('Perf:',Math.round(r.categories.performance.score*100),'A11y:',Math.round(r.categories.accessibility.score*100))"
```
Expected: Perf ≥ 90, A11y ≥ 95. Si Perf < 90: reducir STEPS a 130 desktop / 90 mobile y SCALE a 1.25.

- [ ] **Step 3: Screenshots de validación** (hero + proyectos con Spot, ES y EN) con Edge headless; revisar visualmente lensing y tarjeta.

- [ ] **Step 4: Push y verificación en vivo**

```bash
git push origin main
```
Esperar el run de Actions (Monitor sobre la API con token de `git credential fill`). Luego:
```
node -e "fetch('https://ztellar.github.io').then(r=>r.text()).then(t=>console.log('live Spot:',t.includes('blockchain invisible')))"
```
Expected: `live Spot: true`. Confirmar criterios del spec v2 (1–5) y reportar con evidencia.
