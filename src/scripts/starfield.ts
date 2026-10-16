import starsData from '../data/stars.json';
import { constellations } from '../data/constellations';
import { currentLens, lensImages, type Lens } from './lens';

type Star = { x: number; y: number; m: number; c: string };

const canvas = document.getElementById('starfield') as HTMLCanvasElement | null;
if (canvas) init(canvas);

function init(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d')!;
  // Catálogo real + una capa de estrellas tenues (mag 5–6.5, deterministas) para que la lente
  // del agujero negro tenga suficiente fondo que deformar. Van al final: no mueven los índices
  // que usan las constelaciones.
  let fs = 2026;
  const frand = () => { fs = (fs * 16807) % 2147483647; return fs / 2147483647; };
  const faint: Star[] = Array.from({ length: 1400 }, () => ({
    x: frand(), y: frand(), m: 5 + frand() * 1.5, c: frand() > 0.7 ? '#ffe9d6' : '#d6e2ff',
  }));
  const allStars = [...(starsData as Star[]), ...faint];
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let stars = allStars;
  let w = 0, h = 0, dpr = 1, raf = 0;
  const t0 = performance.now();
  const WARP_MS = 1200;
  // Rotación del cielo en AR: deja Orión y Sirio a la derecha (junto al agujero negro)
  // y la Osa Mayor arriba a la izquierda, lejos del texto del hero
  const SKY_SHIFT = 0.62;

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
    band.addColorStop(0.5, 'rgba(60,72,120,0.12)');
    band.addColorStop(1, 'rgba(26,37,80,0)');
    g.fillStyle = band;
    g.fillRect(-w, -h, w * 2, h * 2);
    g.restore();
    // Manchas de nebulosa
    // El verde es un guiño a la niebla de la portada de The Stage (Avenged Sevenfold)
    const palettes = ['26,37,80', '42,31,74', '20,45,70', '70,40,80', '22,60,46'];
    for (let i = 0; i < 26; i++) {
      const x = rand() * w, y = rand() * h;
      const r = (0.08 + rand() * 0.22) * Math.max(w, h);
      const col = palettes[Math.floor(rand() * palettes.length)]!;
      const a = 0.04 + rand() * 0.07;
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
    stars = w < 720 ? allStars.filter((s) => s.m < 4 || (s.m >= 5 && s.m < 5.5)) : allStars;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    nebula = makeNebula();
    if (reduced) draw(WARP_MS + 1);
  }

  // Posición en pantalla de una estrella, antes de la lente (proyección + parallax por brillo)
  function brightness(s: Star) { return Math.min(1, Math.max(0.15, 1 - (s.m + 1) / 6.5)); }
  function place(s: Star, scroll: number) {
    const py = (s.y * h * 1.4 - scroll * (0.06 + brightness(s) * 0.1)) % (h + 40);
    return { x: ((s.x + SKY_SHIFT) % 1) * w, y: py < -20 ? py + h + 40 : py };
  }

  // Sombra del agujero negro: tapa la nebulosa que quedaría "detrás"
  function drawShadow(lens: Lens) {
    const g = ctx.createRadialGradient(lens.x, lens.y, lens.shadow * 0.9, lens.x, lens.y, lens.shadow * 1.15);
    g.addColorStop(0, 'rgba(0,0,0,1)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(lens.x, lens.y, lens.shadow * 1.15, 0, Math.PI * 2);
    ctx.fill();
  }

  // Constelaciones egipcias, deformadas por la misma lente que las estrellas
  function drawConstellations(scroll: number, lens: Lens | null, alpha: number) {
    const at = (i: number) => {
      const p = place(allStars[i]!, scroll);
      if (!lens) return p;
      return lensImages(lens, p.x, p.y).find((im) => im.primary) ?? null;
    };
    ctx.save();
    ctx.strokeStyle = `rgba(217,192,138,${0.28 * alpha})`;
    ctx.fillStyle = `rgba(217,192,138,${0.5 * alpha})`;
    ctx.lineWidth = 1;
    ctx.font = '10px ui-monospace, Consolas, monospace';
    for (const c of constellations) {
      ctx.beginPath();
      for (const [a, b] of c.lines) {
        const pa = at(a), pb = at(b);
        if (!pa || !pb || Math.abs(pa.y - pb.y) > h / 2) continue; // tramo partido por el wrap vertical
        ctx.moveTo(pa.x, pa.y);
        ctx.lineTo(pb.x, pb.y);
      }
      ctx.stroke();
      for (const i of c.halo ?? []) {
        const p = at(i);
        if (!p) continue;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 7, 0, Math.PI * 2);
        ctx.stroke();
      }
      const p = at(c.anchor);
      if (p) ctx.fillText(c.name, p.x + 10, p.y - 10);
    }
    ctx.restore();
  }

  function draw(t: number) {
    ctx.clearRect(0, 0, w, h);
    if (nebula) ctx.drawImage(nebula, 0, 0);
    const scroll = window.scrollY;
    const lens = currentLens();
    if (lens) drawShadow(lens);
    // Warp de entrada: factor 1→0 con ease-out cúbico
    const wk = reduced ? 0 : Math.max(0, 1 - t / WARP_MS);
    const warp = wk * wk * wk;
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i]!;
      const bright = brightness(s);
      const size = Math.max(0.4, 2.2 - s.m * 0.38);
      const { x, y } = place(s, scroll);
      const twinkle = reduced ? 1 : 0.75 + 0.25 * Math.sin(t / 900 + phase[i]!);
      ctx.globalAlpha = bright * twinkle;
      ctx.fillStyle = s.c;
      if (warp <= 0.01 && lens) {
        // Lente gravitacional: imagen primaria desplazada hacia afuera y, cerca del
        // anillo de Einstein, una imagen secundaria del lado opuesto
        for (const im of lensImages(lens, x, y)) {
          ctx.globalAlpha = Math.min(1, bright * twinkle * im.gain);
          const r = size * Math.min(1.6, Math.sqrt(im.gain));
          ctx.beginPath();
          if (im.stretch > 1.15) ctx.ellipse(im.x, im.y, r, r * im.stretch, im.angle, 0, Math.PI * 2);
          else ctx.arc(im.x, im.y, r, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (warp > 0.01) {
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
    if (t > WARP_MS) drawConstellations(scroll, lens, reduced ? 1 : Math.min(1, (t - WARP_MS) / 1500));
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
  if (reduced) {
    // Sin animación, pero la lente sigue al agujero negro al hacer scroll
    let pending = false;
    window.addEventListener('scroll', () => {
      if (pending) return;
      pending = true;
      requestAnimationFrame(() => { pending = false; draw(WARP_MS + 1); });
    }, { passive: true });
  }
  if (!reduced) {
    document.addEventListener('visibilitychange', () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) raf = requestAnimationFrame(loop);
    });
    raf = requestAnimationFrame(loop);
  }
}
