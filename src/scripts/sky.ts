// Bucle único del cielo: campo de estrellas → agujero negro (lente sobre ese cielo) → mapa de
// constelaciones. Todo se ubica con el mismo estado (lens.ts), que depende del scroll.
// Con prefers-reduced-motion se dibuja un solo frame por scroll/resize, sin animación.
import { createStarfield, WARP_MS } from './starfield';
import { createBlackHoleGL, type BlackHole } from './blackhole-gl';
import { createBlackHole2D } from './blackhole';
import { createSkyMap } from './skymap';
import { holeState, lensFromState, type Viewport } from './lens';

const starCanvas = document.getElementById('starfield') as HTMLCanvasElement | null;
const holeCanvas = document.getElementById('blackhole') as HTMLCanvasElement | null;

if (starCanvas && holeCanvas) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const stars = createStarfield(starCanvas, reduced);
  const gl = createBlackHoleGL(holeCanvas, reduced);
  const hole: BlackHole = gl ?? createBlackHole2D(holeCanvas);
  const map = createSkyMap();
  const hero = document.getElementById('hero');

  const vp: Viewport = { scrollY: 0, w: 0, h: 0, navH: 0, heroH: 0 };
  function measure() {
    vp.w = window.innerWidth;
    vp.h = window.innerHeight;
    vp.navH = 0; // la barra es fija y flota sobre el hero: no lo desplaza
    vp.heroH = hero?.offsetHeight ?? vp.h;
    stars.resize(vp.w, vp.h);
    hole.resize(vp.w, vp.h);
  }

  const t0 = performance.now();
  function render(now: number) {
    const t = reduced ? WARP_MS + 1 : now - t0;
    vp.scrollY = window.scrollY;
    const s = holeState(vp);
    const visible = s.opacity > 0.01;
    // Galaxia de fondo: alineada con el agujero en el hero, con parallax lento (está muy lejos)
    const g0 = holeState({ ...vp, scrollY: 0 });
    stars.setGalaxy(g0.cx * vp.w, g0.cy * vp.h - vp.scrollY * 0.05, (0.05 / g0.zoom) * vp.h);
    // Sin WebGL, la lente la aplica el campo de estrellas en CPU
    stars.draw(t, vp.scrollY, !gl && visible ? lensFromState(s, vp.w, vp.h) : null);
    holeCanvas!.style.visibility = visible ? 'visible' : 'hidden';
    if (visible) hole.draw(reduced ? 4 : t / 1000, s, starCanvas!);
    map?.update(s, vp);
    // La barra de navegación solo hace falta donde no se ven las constelaciones
    document.documentElement.classList.toggle('nav-on', vp.w < 720 || (!s.rail && s.opacity < 0.3));
  }

  measure();
  window.addEventListener('resize', () => { measure(); if (reduced) render(0); });

  if (reduced) {
    let pending = false;
    const once = () => {
      if (pending) return;
      pending = true;
      requestAnimationFrame(() => { pending = false; render(0); });
    };
    window.addEventListener('scroll', once, { passive: true });
    once();
  } else {
    let raf = 0;
    const loop = (now: number) => { render(now); raf = requestAnimationFrame(loop); };
    document.addEventListener('visibilitychange', () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) raf = requestAnimationFrame(loop);
    });
    raf = requestAnimationFrame(loop);
  }
}
