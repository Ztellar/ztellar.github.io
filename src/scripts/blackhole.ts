// Fallback canvas 2D del agujero negro (cuando WebGL no está disponible). Usa el mismo estado
// que el shader (lens.ts) para ubicarse; la lente del fondo la hace el campo de estrellas en CPU.
import { SHADOW_UV, type HoleState } from './lens';
import type { BlackHole } from './blackhole-gl';

export function createBlackHole2D(canvas: HTMLCanvasElement): BlackHole {
  const ctx = canvas.getContext('2d')!;

  let W = 0, H = 0, CX = 0, CY = 0, R_EH = 0, R_PHOTON = 0;

  // Partículas del disco de acreción (factores de órbita; radio real = f · R_EH)
  const N = 240;
  const parts = Array.from({ length: N }, (_, i) => ({
    af: 1.7 + Math.pow(i / N, 1.6) * 3.2,
    th: (i * 2.399963) % (Math.PI * 2),
    hue: 22 + Math.random() * 18,
  }));
  const TILT = 0.32;

  function resize(w: number, h: number) {
    W = w; H = h;
    canvas.width = W; canvas.height = H;
  }

  function draw(tSec: number, s: HoleState) {
    const t = tSec * 1000;
    CX = s.cx * W;
    CY = s.cy * H;
    R_EH = (SHADOW_UV / s.zoom) * H * 0.8;
    R_PHOTON = R_EH * 1.35;
    canvas.style.opacity = String(s.opacity);
    ctx.clearRect(0, 0, W, H);

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

  return { resize, draw };
}
