# Black Hole v3 Full-Bleed + OLED Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Agujero negro WebGL como fondo completo del hero con parallax de mouse, y paleta true black #000 para OLED.

**Architecture:** El canvas pasa a `absolute inset:0` dentro de un hero con breakout a 100vw; el shader recibe `u_center` (composición) y `u_look` (parallax) y renderiza a resolución interna reducida. La paleta cambia `--bg` a #000 con ajustes de alpha en nebulosa. El fallback 2D adopta las mismas coordenadas relativas.

**Tech Stack:** el existente (Astro 5, WebGL 1, canvas 2D).

## Global Constraints

- Igual que v2: cero librerías, i18n estricto, reduced-motion = frame único, pausas fuera de viewport, Lighthouse ≥ 90/95.
- Sin scroll horizontal pese al breakout (usar `overflow-x: clip`).
- Sincronizar contenido EN con la edición del usuario en `es.ts` (Mustakis 2022–2026, en pasado) y regenerar el CV PDF.

---

### Task 1: Paleta OLED + sincronía EN + CV

**Files:**
- Modify: `src/styles/global.css` (tokens + overflow-x), `src/layouts/Base.astro` (theme-color), `src/scripts/starfield.ts` (alphas nebulosa), `src/i18n/en.ts` (Mustakis en pasado)
- Regenerate: `public/cv/benjamin-salamanca-cv.pdf`

**Interfaces:**
- Produces: tokens `--bg: #000`, `--bg-soft: #0a0f1e` que consumen todos los componentes sin cambios.

- [ ] **Step 1:** En `global.css`: `--bg: #000000;` y `--bg-soft: #0a0f1e;`; agregar `html { overflow-x: clip; }` junto al scroll-behavior.
- [ ] **Step 2:** En `Base.astro` `<head>`: `<meta name="theme-color" content="#000000" />`.
- [ ] **Step 3:** En `starfield.ts` makeNebula: banda `0.16`→`0.12`; manchas `0.05 + rand() * 0.09`→`0.04 + rand() * 0.07`.
- [ ] **Step 4:** En `en.ts`: about.p2 → "From 2022 to 2026 I was a mentor at Fundación Mustakis, teaching educational robotics and game development (Scratch and Roblox Studio) to middle and high school students."; item Mustakis period → `'2022 — 2026'` y bullet en pasado ("Taught educational robotics and game development workshops...").
- [ ] **Step 5:** `npm run test; npm run build` → PASS/OK. Regenerar PDF: build + Edge headless `--print-to-pdf` sobre `dist/cv/index.html` (file://), verificar que dice "2022 — 2026".
- [ ] **Step 6:** Commit: `feat: true-black OLED palette + Mustakis dates sync + CV regen`.

---

### Task 2: Hero full-bleed + shader u_center/u_look + fallback 2D

**Files:**
- Modify: `src/components/BlackHole.astro`, `src/components/Hero.astro`, `src/scripts/blackhole-gl.ts`, `src/scripts/blackhole.ts`

**Interfaces:**
- Consumes: tokens de Task 1.
- Produces: mismos exports (`initBlackHoleGL(canvas): boolean`, `initBlackHole2D(canvas): void`), ahora dimensionados por `canvas.clientWidth/Height` con centro relativo (0.62, 0.5) desktop / (0.5, 0.42) móvil.

- [ ] **Step 1:** `BlackHole.astro` completo:

```astro
<canvas id="blackhole" aria-hidden="true"></canvas>
<script src="../scripts/blackhole-main.ts"></script>

<style>
  canvas { position: absolute; inset: 0; width: 100%; height: 100%; display: block; }
</style>
```

- [ ] **Step 2:** `Hero.astro` completo (breakout, texto superpuesto, caption reubicada):

```astro
---
import BlackHole from './BlackHole.astro';
import type { Dict } from '../i18n';
interface Props { dict: Dict }
const { dict } = Astro.props;
---
<section id="hero">
  <BlackHole />
  <div class="inner">
    <div class="text">
      <p class="mono">{dict.hero.kicker}</p>
      <h1>{dict.hero.name}</h1>
      <p class="title">{dict.hero.title}</p>
      <p class="eso mono">▸ {dict.hero.eso}</p>
      <div class="ctas">
        <a class="btn primary" href="#projects">{dict.hero.ctaProjects}</a>
        <a class="btn" href="#contact">{dict.hero.ctaContact}</a>
      </div>
    </div>
  </div>
  <p class="caption mono" aria-hidden="true">Sgr A* · 17h 45m 40s · −29° 00′ 28″</p>
</section>

<style>
  section {
    position: relative;
    width: 100vw;
    margin-left: calc(50% - 50vw);
    min-height: calc(100svh - 3.5rem);
    display: flex;
    align-items: center;
    border-top: none;
    padding: 0;
  }
  .inner { width: 100%; max-width: 60rem; margin: 0 auto; padding: 0 1.5rem; position: relative; z-index: 1; }
  .text { max-width: 34rem; }
  h1 { font-size: clamp(2.2rem, 6vw, 3.6rem); text-shadow: 0 2px 24px rgba(0, 0, 0, 0.85); }
  .title { color: var(--ink-dim); font-size: 1.15rem; }
  .eso { color: var(--accent); }
  .ctas { display: flex; gap: 0.8rem; margin-top: 1.5rem; flex-wrap: wrap; }
  .caption {
    position: absolute; right: 1.5rem; bottom: 1.2rem; z-index: 1;
    font-size: 0.72rem; letter-spacing: 0.12em; opacity: 0.75;
  }
  @media (max-width: 720px) {
    section { align-items: flex-end; }
    .inner { padding-bottom: 4.5rem; }
    .text { max-width: 100%; text-align: center; margin: 0 auto; }
    .ctas { justify-content: center; }
  }
</style>
```

- [ ] **Step 3:** `blackhole-gl.ts` — reemplazo completo. Cambios respecto a v2: tamaño por `clientWidth/Height × SCALE` con `resize()`; uniforms nuevos `u_center` y `u_look`; `uv = (gl_FragCoord.xy - u_center * u_res) / u_res.y`; cámara `ro = vec3(look.x*3.0, 1.6 + look.y*1.2, -20.0)`; vignette ampliado `smoothstep(0.9, 0.55, length(uv))`; parallax con lerp 0.05 solo `(pointer: fine)`. (Código completo en la implementación; el shader de disco/lensing/bgStars/tonemap se conserva de v2 tal cual.)

- [ ] **Step 4:** `blackhole.ts` (fallback 2D) — adaptar a full-bleed: dimensiones por `clientWidth/Height`, centro `(0.62W, 0.5H)` desktop / `(0.5W, 0.42H)` móvil, radios relativos a `min(W,H)` (factores de órbita precalculados y multiplicados por `R_EH` en cada frame), listener de `resize`. Mantener IO/visibility/reduced.

- [ ] **Step 5:** `npm run build` OK; preview + screenshots desktop (1400×900) y móvil (390×844): agujero dominante, texto legible, caption abajo derecha, sin scroll horizontal (comprobar `document.documentElement.scrollWidth <= innerWidth` vía DevTools o visual).
- [ ] **Step 6:** Verificar negro puro: muestrear esquina del screenshot con node (pixel RGB === 0,0,0 en zona sin estrellas) — nota: el canvas del starfield cubre todo, el fondo entre estrellas debe ser #000.
- [ ] **Step 7:** Commit: `feat: full-bleed hero black hole with mouse parallax`.

---

### Task 3: QA + deploy + verificación en vivo

- [ ] **Step 1:** `npm run test` (4 PASS) y Lighthouse (Perf ≥ 90, A11y ≥ 95); si Perf < 90 bajar SCALE a 0.45/0.4.
- [ ] **Step 2:** `git push origin main`; monitorear run; recordar que deploy-pages puede reportar falso "failure" — verificar SIEMPRE el contenido vivo.
- [ ] **Step 3:** Verificar en vivo: HTML nuevo servido (hash de bundle distinto), screenshot de producción, y confirmar criterios 1-5 del spec v3. Reportar con evidencia.
