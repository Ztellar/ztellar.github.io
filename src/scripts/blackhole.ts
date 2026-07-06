export function initBlackHole2D(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d')!;
  const S = canvas.width; // lienzo cuadrado, coordenadas fijas
  const C = S / 2;
  const R_EH = S * 0.11;          // horizonte de eventos
  const R_PHOTON = R_EH * 1.35;   // anillo de fotones
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Partículas del disco de acreción (elipse inclinada, kepleriano aproximado)
  const N = 240;
  const parts = Array.from({ length: N }, (_, i) => ({
    a: R_EH * (1.7 + Math.pow(i / N, 1.6) * 3.2),      // semieje mayor
    th: (i * 2.399963) % (Math.PI * 2),                 // ángulo inicial
    hue: 22 + Math.random() * 18,                       // naranjas
  }));
  const TILT = 0.32; // aplanamiento de la elipse (vista casi de canto)

  let raf = 0, running = false;

  function draw(t: number) {
    ctx.clearRect(0, 0, S, S);

    // Glow ambiental
    const glow = ctx.createRadialGradient(C, C, R_EH, C, C, S * 0.48);
    glow.addColorStop(0, 'rgba(255,158,79,0.18)');
    glow.addColorStop(1, 'rgba(255,158,79,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, S, S);

    // Disco de acreción: mitad trasera se dibuja "lenteada" por encima del horizonte
    ctx.globalCompositeOperation = 'lighter';
    for (const p of parts) {
      const om = 900 * Math.pow((R_EH * 2.4) / p.a, 1.5); // velocidad kepleriana
      const ang = p.th + (t / 16000) * om;
      const x = C + Math.cos(ang) * p.a;
      const behind = Math.sin(ang) < 0;
      let y = C + Math.sin(ang) * p.a * TILT;
      if (behind) {
        // Lente gravitacional simplificada: la mitad trasera se curva sobre el agujero
        const lift = Math.max(0, 1 - Math.abs(x - C) / p.a) * R_PHOTON * 1.7;
        y = C - Math.abs(Math.sin(ang)) * p.a * TILT * 0.35 - lift * 0.35;
      }
      // Doppler beaming: el lado que se acerca (izquierda) brilla más
      const doppler = 0.55 - Math.cos(ang) * 0.45;
      const d = Math.hypot(x - C, y - C);
      if (d < R_EH * 0.98) continue; // tragado por el horizonte
      ctx.globalAlpha = Math.min(1, 0.16 + doppler * 0.5) * (behind ? 0.7 : 1);
      ctx.fillStyle = `hsl(${p.hue} 100% ${55 + doppler * 20}%)`;
      ctx.beginPath();
      ctx.arc(x, y, 1.3 + doppler * 1.2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;

    // Anillo de fotones
    ctx.strokeStyle = 'rgba(255,190,120,0.85)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(C, C, R_PHOTON, 0, Math.PI * 2);
    ctx.stroke();

    // Horizonte de eventos
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(C, C, R_EH, 0, Math.PI * 2);
    ctx.fill();
  }

  function loop(now: number) {
    draw(now);
    raf = requestAnimationFrame(loop);
  }

  if (reduced) { draw(4000); return; }

  // Animar solo cuando está en viewport y la pestaña visible
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
