import starsData from '../data/stars.json';
import { lensImages, type Lens } from './lens';

type Star = { x: number; y: number; m: number; c: string };

export interface Starfield {
  resize(w: number, h: number): void;
  /**
   * Dibuja el cielo sin lente. Si `cpuLens` viene, aplica la lente en CPU (fallback sin WebGL);
   * con WebGL la lente la hace el shader del agujero negro usando este canvas como textura.
   */
  draw(t: number, scroll: number, cpuLens: Lens | null): void;
  /**
   * Galaxia lejana detrás del agujero del hero (px de viewport, ya con scroll). Una lente solo
   * forma un anillo de Einstein visible con una fuente compacta alineada; al hacer scroll la
   * alineación se rompe y el anillo se abre en arcos.
   */
  setGalaxy(x: number, y: number, r: number): void;
  canvas: HTMLCanvasElement;
}

export const WARP_MS = 1200;

export function createStarfield(canvas: HTMLCanvasElement, reduced: boolean): Starfield {
  const ctx = canvas.getContext('2d')!;
  // Catálogo real + una capa de estrellas tenues (mag 5–6.5, deterministas) para que la lente
  // del agujero negro tenga suficiente fondo que deformar.
  let fs = 2026;
  const frand = () => { fs = (fs * 16807) % 2147483647; return fs / 2147483647; };
  const faint: Star[] = Array.from({ length: 1400 }, () => ({
    x: frand(), y: frand(), m: 5 + frand() * 1.5, c: frand() > 0.7 ? '#ffe9d6' : '#d6e2ff',
  }));
  const allStars = [...(starsData as Star[]), ...faint];
  let stars = allStars;
  let w = 0, h = 0, dpr = 1;
  // Rotación del cielo en AR: deja la Vía Láctea y las estrellas más brillantes repartidas
  // alrededor del agujero negro del hero
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
    // Banda de Vía Láctea diagonal: fuente continua que el agujero curva en un anillo de Einstein
    g.save();
    g.translate(w / 2, h / 2);
    g.rotate(-0.35);
    const band = g.createLinearGradient(0, -h * 0.28, 0, h * 0.28);
    band.addColorStop(0, 'rgba(26,37,80,0)');
    band.addColorStop(0.5, 'rgba(70,82,135,0.16)');
    band.addColorStop(1, 'rgba(26,37,80,0)');
    g.fillStyle = band;
    g.fillRect(-w, -h, w * 2, h * 2);
    g.restore();
    // Manchas de nebulosa. El verde es un guiño a la niebla de la portada de The Stage
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

  function resize(nw: number, nh: number) {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = nw; h = nh;
    stars = w < 720 ? allStars.filter((s) => s.m < 4 || (s.m >= 5 && s.m < 5.5)) : allStars;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    nebula = makeNebula();
  }

  // Posición en pantalla de una estrella (proyección + parallax según brillo)
  function brightness(s: Star) { return Math.min(1, Math.max(0.15, 1 - (s.m + 1) / 6.5)); }
  function place(s: Star, scroll: number) {
    const py = (s.y * h * 1.4 - scroll * (0.06 + brightness(s) * 0.1)) % (h + 40);
    return { x: ((s.x + SKY_SHIFT) % 1) * w, y: py < -20 ? py + h + 40 : py };
  }

  // Sombra del agujero negro (solo en el fallback): tapa la nebulosa que quedaría "detrás"
  function drawShadow(lens: Lens) {
    const g = ctx.createRadialGradient(lens.x, lens.y, lens.shadow * 0.9, lens.x, lens.y, lens.shadow * 1.15);
    g.addColorStop(0, 'rgba(0,0,0,1)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(lens.x, lens.y, lens.shadow * 1.15, 0, Math.PI * 2);
    ctx.fill();
  }

  let galaxy = { x: -1e4, y: -1e4, r: 0 };
  function setGalaxy(x: number, y: number, r: number) { galaxy = { x, y, r }; }
  function drawGalaxy() {
    const { x, y, r } = galaxy;
    if (r <= 0 || x < -r || y < -r || x > w + r || y > h + r) return;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(-0.5);
    ctx.scale(1, 0.55);
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
    g.addColorStop(0, 'rgba(255,244,225,0.5)');
    g.addColorStop(0.18, 'rgba(255,214,170,0.3)');
    g.addColorStop(0.5, 'rgba(160,170,255,0.1)');
    g.addColorStop(1, 'rgba(120,130,220,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  function draw(t: number, scroll: number, lens: Lens | null) {
    ctx.clearRect(0, 0, w, h);
    if (nebula) ctx.drawImage(nebula, 0, 0);
    drawGalaxy();
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
      } else if (lens) {
        // Lente en CPU: imagen primaria desplazada y estirada; cerca del anillo, una secundaria
        for (const im of lensImages(lens, x, y)) {
          ctx.globalAlpha = Math.min(1, bright * twinkle * im.gain);
          const r = size * Math.min(1.6, Math.sqrt(im.gain));
          ctx.beginPath();
          if (im.stretch > 1.15) ctx.ellipse(im.x, im.y, r, r * im.stretch, im.angle, 0, Math.PI * 2);
          else ctx.arc(im.x, im.y, r, 0, Math.PI * 2);
          ctx.fill();
        }
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

  return { resize, draw, setGalaxy, canvas };
}
