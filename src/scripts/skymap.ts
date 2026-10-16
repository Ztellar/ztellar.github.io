// Ubica las constelaciones del mapa alrededor del agujero negro según el scroll: en el hero
// rodean al agujero grande; al bajar (si hay margen) se ordenan en el margen derecho junto a él.
import type { HoleState, Viewport } from './lens';

type Key = 'osiris' | 'isis' | 'set' | 'cassiopeia';

// Posición en el hero, como fracción del ancho del viewport y del alto del hero
const HERO: Record<Key, [number, number]> = {
  osiris: [0.47, 0.15],
  isis: [0.9, 0.16],
  set: [0.9, 0.78],
  cassiopeia: [0.6, 0.87],
};
// Posición vertical en el margen derecho (fracción del alto del viewport), en orden de lectura
const RAIL: Record<Key, number> = { osiris: 0.14, isis: 0.31, set: 0.69, cassiopeia: 0.86 };
const RAIL_SCALE = 0.78;

export function createSkyMap() {
  const root = document.querySelector<HTMLElement>('[data-skymap]');
  if (!root) return null;
  const items = [...root.querySelectorAll<HTMLAnchorElement>('a[data-key]')].map((el) => ({
    el,
    key: el.dataset.key as Key,
    section: document.getElementById(el.dataset.section!),
  }));
  let current: string | null = null;

  // Al llegar desde una constelación, la sección destaca su título un momento
  for (const it of items) {
    it.el.addEventListener('click', () => {
      const sec = it.section;
      if (!sec) return;
      sec.classList.remove('arrived');
      void sec.offsetWidth;
      sec.classList.add('arrived');
    });
  }

  function update(s: HoleState, v: Viewport) {
    const p = s.rail ? s.progress : 0;
    const scroll = s.rail ? 0 : v.scrollY;
    const opacity = s.rail ? 1 : s.opacity;
    for (const it of items) {
      const [fx, fy] = HERO[it.key];
      const hx = fx * v.w, hy = v.navH + fy * v.heroH - scroll;
      const x = hx + (s.railX - hx) * p;
      const y = hy + (RAIL[it.key] * v.h - hy) * p;
      const k = 1 + (RAIL_SCALE - 1) * p;
      it.el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) translate(-50%, -50%) scale(${k.toFixed(3)})`;
      it.el.style.opacity = String(opacity);
      it.el.style.visibility = opacity < 0.05 ? 'hidden' : 'visible';
    }
    // Sección actual: la última cuyo inicio ya pasó el 45% superior de la pantalla
    // (al llegar al final de la página, la última sección aunque no alcance esa altura)
    let now: string | null = null;
    const atEnd = v.scrollY + v.h >= document.documentElement.scrollHeight - 4;
    for (const it of items) {
      if (it.section && (atEnd || it.section.getBoundingClientRect().top < v.h * 0.45)) now = it.key;
    }
    if (now !== current) {
      current = now;
      for (const it of items) it.el.setAttribute('aria-current', String(it.key === now));
    }
  }

  return { update };
}
