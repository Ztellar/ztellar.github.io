// Estado compartido del agujero negro: dónde está y qué tamaño tiene según el scroll.
// Lo usan el shader (blackhole-gl.ts), el fallback 2D, el campo de estrellas y el mapa de
// constelaciones, para que todo se mueva junto.
//
// En el shader la cámara está a ~20 r_s y con focal 1.2. La sombra (parámetro de impacto
// crítico b = 3√3/2 · r_s) subtiende |uv| ≈ 0.157, el radio de Einstein para fuentes en el
// infinito (θ_E² = 2 r_s / D) queda en |uv| ≈ 0.39 y el borde del disco (r = 7) en ≈ 0.42.
export const SHADOW_UV = 0.157;
export const EINSTEIN_UV = 0.39;
export const DISK_UV = 0.42;

/** Ancho máximo del contenido (main: 60rem) menos su padding, en px. */
const CONTENT_PX = 960 - 48;
/** Margen lateral mínimo para que el agujero acompañe el scroll en el costado. */
const RAIL_MIN_MARGIN = 190;

export interface HoleState {
  /** Centro en fracciones del viewport (x desde la izquierda, y desde arriba). */
  cx: number;
  cy: number;
  /** Escala del shader: un tamaño en uv mide (uv / zoom) · alto del viewport. */
  zoom: number;
  /** 0–1: en móvil y pantallas angostas el agujero se desvanece al dejar el hero. */
  opacity: number;
  /** true si al hacer scroll el agujero se instala en el margen derecho. */
  rail: boolean;
  /** Progreso 0–1 de la transición hero → margen (suavizado). */
  progress: number;
  /** Centro del margen derecho, en px. */
  railX: number;
}

export interface Viewport {
  scrollY: number;
  w: number;
  h: number;
  /** Alto del nav y del hero, en px. */
  navH: number;
  heroH: number;
}

const smooth = (x: number) => { const t = Math.min(1, Math.max(0, x)); return t * t * (3 - 2 * t); };

export function holeState(v: Viewport): HoleState {
  const narrow = v.w < 720;
  const heroH = Math.max(1, v.heroH);
  // Posición dentro del hero (fracción de su alto) y tamaño relativo al hero
  const inHero = narrow ? { x: 0.5, y: 0.42, zoom: 1.35 } : { x: 0.66, y: 0.5, zoom: 1.0 };
  const zoom0 = inHero.zoom * (v.h / heroH);
  const heroCy = (scroll: number) => (v.navH + inHero.y * heroH - scroll) / v.h;

  const margin = (v.w - CONTENT_PX) / 2;
  const rail = !narrow && margin >= RAIL_MIN_MARGIN;
  const railX = v.w - margin / 2;

  if (!rail) {
    return {
      cx: inHero.x, cy: heroCy(v.scrollY), zoom: zoom0,
      opacity: 1 - smooth((v.scrollY / heroH - 0.45) / 0.55),
      rail: false, progress: 0, railX,
    };
  }
  const p = smooth(v.scrollY / (heroH * 0.75));
  const railZoom = (DISK_UV * v.h) / (margin * 0.46); // el disco ocupa ~46% del margen
  return {
    cx: inHero.x + (railX / v.w - inHero.x) * p,
    cy: heroCy(0) + (0.5 - heroCy(0)) * p,
    zoom: zoom0 * Math.pow(railZoom / zoom0, p),
    opacity: 1,
    rail: true,
    progress: p,
    railX,
  };
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

export function lensFromState(s: HoleState, w: number, h: number): Lens {
  return { x: s.cx * w, y: s.cy * h, shadow: (SHADOW_UV / s.zoom) * h, einstein: (EINSTEIN_UV / s.zoom) * h };
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
 * Lente puntual en CPU, solo para el fallback sin WebGL (con WebGL la hace el shader).
 * Una fuente a distancia β forma una imagen primaria en θ+ = (β + √(β² + 4θE²)) / 2, del mismo
 * lado, y una secundaria en θ− del lado opuesto. El desplazamiento se atenúa lejos del agujero.
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
