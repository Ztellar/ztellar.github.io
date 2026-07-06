import starsData from '../data/stars.json';

type Star = { x: number; y: number; m: number; c: string };

const canvas = document.getElementById('starfield') as HTMLCanvasElement | null;
if (canvas) init(canvas);

function init(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d')!;
  const stars = starsData as Star[];
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let w = 0, h = 0, dpr = 1, raf = 0;
  const t0 = performance.now();

  // Fase de parpadeo estable por estrella (determinista, sin estado extra)
  const phase = stars.map((_, i) => (i * 2.399963) % (Math.PI * 2)); // ángulo áureo

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth; h = window.innerHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (reduced) draw(0);
  }

  function draw(t: number) {
    ctx.clearRect(0, 0, w, h);
    const scroll = window.scrollY;
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i]!;
      // Magnitud -> tamaño y brillo (mag 5 tenue, mag <0 brillante)
      const bright = Math.min(1, Math.max(0.15, 1 - (s.m + 1) / 6.5));
      const size = Math.max(0.4, 2.2 - s.m * 0.38);
      // Paralaje: estrellas brillantes ("cercanas") se mueven más
      const py = (s.y * h * 1.4 - scroll * (0.06 + bright * 0.1)) % (h + 40);
      const y = py < -20 ? py + h + 40 : py;
      const x = s.x * w;
      const twinkle = reduced ? 1 : 0.75 + 0.25 * Math.sin(t / 900 + phase[i]!);
      ctx.globalAlpha = bright * twinkle;
      ctx.fillStyle = s.c;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
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
