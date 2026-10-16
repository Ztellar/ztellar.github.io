// Fallback canvas 2D del agujero negro (cuando WebGL no está disponible).
// Full-bleed: dibuja en la misma posición relativa que el shader (u_center).
import { layout } from './lens';

export function initBlackHole2D(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d')!;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let W = 0, H = 0, CX = 0, CY = 0, R_EH = 0, R_PHOTON = 0;

  // Partículas del disco de acreción (factores de órbita; radio real = f · R_EH)
  const N = 240;
  const parts = Array.from({ length: N }, (_, i) => ({
    af: 1.7 + Math.pow(i / N, 1.6) * 3.2,
    th: (i * 2.399963) % (Math.PI * 2),
    hue: 22 + Math.random() * 18,
  }));
  const TILT = 0.32;

  function resize() {
    W = Math.max(1, canvas.clientWidth);
    H = Math.max(1, canvas.clientHeight);
    canvas.width = W; canvas.height = H;
    const { cx, cy } = layout(window.innerWidth < 720);
    CX = W * cx;
    CY = H * cy;
    const S = Math.min(W, H);
    R_EH = S * 0.11;
    R_PHOTON = R_EH * 1.35;
    if (reduced) draw(4000);
  }

  let raf = 0, running = false;

  function draw(t: number) {
    ctx.clearRect(0, 0, W, H);

    // Glow ambiental
    const glow = ctx.createRadialGradient(CX, CY, R_EH, CX, CY, Math.min(W, H) * 0.48);
    glow.addColorStop(0, 'rgba(255,158,79,0.18)');
    glow.addColorStop(1, 'rgba(255,158,79,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);

    // Disco de acreción: mitad trasera se dibuja "lenteada" por encima del horizonte
    ctx.globalCompositeOperation = 'lighter';
    for (const p of parts) {
      const a = p.af * R_EH;
      const om = 900 * Math.pow((R_EH * 2.4) / a, 1.5);
      const ang = p.th + (t / 16000) * om;
      const x = CX + Math.cos(ang) * a;
      const behind = Math.sin(ang) < 0;
      let y = CY + Math.sin(ang) * a * TILT;
      if (behind) {
        const lift = Math.max(0, 1 - Math.abs(x - CX) / a) * R_PHOTON * 1.7;
        y = CY - Math.abs(Math.sin(ang)) * a * TILT * 0.35 - lift * 0.35;
      }
      const dop = 0.55 - Math.cos(ang) * 0.45;
      const d = Math.hypot(x - CX, y - CY);
      if (d < R_EH * 0.98) continue;
      ctx.globalAlpha = Math.min(1, 0.16 + dop * 0.5) * (behind ? 0.7 : 1);
      ctx.fillStyle = `hsl(${p.hue} 100% ${55 + dop * 20}%)`;
      ctx.beginPath();
      ctx.arc(x, y, 1.3 + dop * 1.2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;

    // Anillo de fotones
    ctx.strokeStyle = 'rgba(255,190,120,0.85)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(CX, CY, R_PHOTON, 0, Math.PI * 2);
    ctx.stroke();

    // Horizonte de eventos
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(CX, CY, R_EH, 0, Math.PI * 2);
    ctx.fill();
  }

  function loop(now: number) {
    draw(now);
    raf = requestAnimationFrame(loop);
  }

  window.addEventListener('resize', resize);
  resize();
  if (reduced) return;

  const io = new IntersectionObserver(([e]) => {
    const want = !!e && e.isIntersecting && !document.hidden;
    if (want && !running) { running = true; raf = requestAnimationFrame(loop); }
    if (!want && running) { running = false; cancelAnimationFrame(raf); }
  });
  io.observe(canvas);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && running) { running = false; cancelAnimationFrame(raf); }
    else if (!document.hidden && !running) { running = true; raf = requestAnimationFrame(loop); }
  });
}
