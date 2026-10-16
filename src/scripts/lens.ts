// Geometría compartida del agujero negro del hero, para que el campo de estrellas
// de fondo pueda aplicarle lente gravitacional en el mismo lugar de la pantalla.
//
// En el shader (blackhole-gl.ts) la cámara está a ~20 r_s y con focal 1.2. La sombra
// (parámetro de impacto crítico b = 3√3/2 · r_s) subtiende |uv| ≈ 0.157, y el radio de
// Einstein para fuentes en el infinito (θ_E² = 2 r_s / D) queda en |uv| ≈ 0.39.
export const SHADOW_UV = 0.157;
export const EINSTEIN_UV = 0.39;

/** Posición del agujero dentro del canvas del hero: fracción desde la izquierda y desde arriba. */
export function layout(narrow: boolean) {
  return narrow ? { cx: 0.5, cy: 0.42, zoom: 1.35 } : { cx: 0.66, cy: 0.5, zoom: 1.0 };
}

export interface Lens {
  /** Centro en coordenadas de viewport (px CSS). */
  x: number;
  y: number;
  /** Radio de la sombra (nada detrás se ve). */
  shadow: number;
  /** Radio de Einstein: donde las estrellas de fondo se agolpan en un anillo. */
  einstein: number;
}

/** Lente en coordenadas de viewport, o null si el agujero no está en pantalla. */
export function currentLens(): Lens | null {
  const el = document.getElementById('blackhole');
  if (!el) return null;
  const r = el.getBoundingClientRect();
  if (r.bottom < 0 || r.top > window.innerHeight || r.height === 0) return null;
  const { cx, cy, zoom } = layout(window.innerWidth < 720);
  return {
    x: r.left + cx * r.width,
    y: r.top + cy * r.height,
    shadow: (SHADOW_UV / zoom) * r.height,
    einstein: (EINSTEIN_UV / zoom) * r.height,
  };
}

export interface LensImage {
  x: number;
  y: number;
  gain: number;
  primary: boolean;
  /** Estiramiento tangencial de la imagen (θ/β): cerca del anillo las estrellas se vuelven arcos. */
  stretch: number;
  /** Ángulo (rad) de la dirección radial, para orientar el estiramiento. */
  angle: number;
}

/**
 * Lente puntual (aprox. de campo débil): una fuente a distancia β del centro forma una imagen
 * primaria en θ+ = (β + √(β² + 4θE²)) / 2, del mismo lado, y una secundaria en θ− del lado opuesto.
 * El desplazamiento se atenúa lejos del agujero para que no deforme el cielo completo.
 * Devuelve las imágenes visibles (fuera de la sombra) con su factor de brillo.
 */
export function lensImages(lens: Lens, x: number, y: number): LensImage[] {
  const dx = x - lens.x, dy = y - lens.y;
  const beta = Math.hypot(dx, dy) || 0.001;
  const ux = dx / beta, uy = dy / beta;
  const angle = Math.atan2(dy, dx);
  const E = lens.einstein;
  const root = Math.sqrt(beta * beta + 4 * E * E);
  const fade = 1 / (1 + (beta / (3 * E)) ** 2);
  const out: LensImage[] = [];

  const plus = beta + ((beta + root) / 2 - beta) * fade;
  if (plus > lens.shadow) {
    const mu = Math.abs(1 / (1 - (E / plus) ** 4));
    out.push({ x: lens.x + ux * plus, y: lens.y + uy * plus, gain: Math.min(3, 1 + (mu - 1) * fade), primary: true, stretch: Math.min(6, plus / beta), angle });
  }
  const minus = (root - beta) / 2;
  if (minus > lens.shadow && beta < 2.2 * E) {
    const mu = Math.abs(1 / (1 - (E / minus) ** 4));
    out.push({ x: lens.x - ux * minus, y: lens.y - uy * minus, gain: Math.min(2, mu * 0.5), primary: false, stretch: Math.min(6, minus / beta), angle: angle + Math.PI });
  }
  return out;
}
