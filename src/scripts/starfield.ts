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
    band.addColorStop(0.5, 'rgba(60,72,120,0.12)');
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
