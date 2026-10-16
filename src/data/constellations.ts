// Constelaciones del mapa de navegación: cada una abre una sección del sitio.
// Las formas salen de las coordenadas reales (AR/Dec J2000, grados) y magnitudes de sus estrellas.
export type SectionId = 'story' | 'work' | 'offline' | 'contact';

interface CatalogStar { ra: number; dec: number; mag: number }

export interface ConstellationDef {
  key: 'osiris' | 'isis' | 'set' | 'cassiopeia';
  /** Nombre propio (no se traduce). */
  name: string;
  section: SectionId;
  stars: Record<string, CatalogStar>;
  lines: [string, string][];
  /** Estrella destacada (se dibuja con halo). */
  highlight?: string;
}

export const constellations: ConstellationDef[] = [
  {
    // Orión: Sah, el alma de Osiris
    key: 'osiris',
    name: 'Sah · Osiris',
    section: 'story',
    stars: {
      betelgeuse: { ra: 88.79, dec: 7.41, mag: 0.5 }, bellatrix: { ra: 81.28, dec: 6.35, mag: 1.64 },
      alnitak: { ra: 85.19, dec: -1.94, mag: 1.77 }, alnilam: { ra: 84.05, dec: -1.2, mag: 1.69 },
      mintaka: { ra: 83.0, dec: -0.3, mag: 2.23 }, saiph: { ra: 86.94, dec: -9.67, mag: 2.06 },
      rigel: { ra: 78.63, dec: -8.2, mag: 0.13 }, meissa: { ra: 83.78, dec: 9.93, mag: 3.39 },
    },
    lines: [
      ['meissa', 'betelgeuse'], ['meissa', 'bellatrix'], ['betelgeuse', 'alnitak'], ['bellatrix', 'mintaka'],
      ['mintaka', 'alnilam'], ['alnilam', 'alnitak'], ['alnitak', 'saiph'], ['mintaka', 'rigel'],
    ],
  },
  {
    // Sirio: Sopdet, identificada con Isis; su orto helíaco anunciaba la crecida del Nilo.
    // Las estrellas vecinas (Can Mayor) van sin unir: la figura egipcia es solo Sirio.
    key: 'isis',
    name: 'Sopdet · Isis',
    section: 'work',
    stars: {
      sirius: { ra: 101.29, dec: -16.72, mag: -1.46 }, mirzam: { ra: 95.67, dec: -17.96, mag: 1.98 },
      adhara: { ra: 104.66, dec: -28.97, mag: 1.5 }, wezen: { ra: 107.1, dec: -26.39, mag: 1.83 },
      aludra: { ra: 111.02, dec: -29.3, mag: 2.45 },
    },
    lines: [],
    highlight: 'sirius',
  },
  {
    // Osa Mayor: Meskhetyu, la pata del toro de Set
    key: 'set',
    name: 'Meskhetyu · Set',
    section: 'offline',
    stars: {
      dubhe: { ra: 165.93, dec: 61.75, mag: 1.79 }, merak: { ra: 165.46, dec: 56.38, mag: 2.37 },
      phecda: { ra: 178.46, dec: 53.69, mag: 2.44 }, megrez: { ra: 183.86, dec: 57.03, mag: 3.31 },
      alioth: { ra: 193.51, dec: 55.96, mag: 1.77 }, mizar: { ra: 200.98, dec: 54.93, mag: 2.27 },
      alkaid: { ra: 206.89, dec: 49.31, mag: 1.86 },
    },
    lines: [
      ['dubhe', 'merak'], ['merak', 'phecda'], ['phecda', 'megrez'], ['megrez', 'dubhe'],
      ['megrez', 'alioth'], ['alioth', 'mizar'], ['mizar', 'alkaid'],
    ],
  },
  {
    // Casiopea: por la banda de jazz fusión
    key: 'cassiopeia',
    name: 'Casiopea',
    section: 'contact',
    stars: {
      caph: { ra: 2.29, dec: 59.15, mag: 2.27 }, schedar: { ra: 10.13, dec: 56.54, mag: 2.24 },
      navi: { ra: 14.18, dec: 60.72, mag: 2.47 }, ruchbah: { ra: 21.45, dec: 60.24, mag: 2.68 },
      segin: { ra: 28.6, dec: 63.67, mag: 3.37 },
    },
    lines: [['caph', 'schedar'], ['schedar', 'navi'], ['navi', 'ruchbah'], ['ruchbah', 'segin']],
  },
];

export interface Shape {
  /** Estrellas proyectadas, centradas y escaladas a una caja de lado 1 (y hacia abajo). */
  points: Record<string, { x: number; y: number; r: number }>;
  lines: [string, string][];
  highlight?: string;
}

/** Proyección local (norte arriba, este a la izquierda, como se ve en el cielo). */
export function shapeOf(c: ConstellationDef): Shape {
  const list = Object.values(c.stars);
  const ra0 = list.reduce((a, s) => a + s.ra, 0) / list.length;
  const dec0 = list.reduce((a, s) => a + s.dec, 0) / list.length;
  const k = Math.cos((dec0 * Math.PI) / 180);
  const raw = Object.entries(c.stars).map(([id, s]) => ({ id, x: -(s.ra - ra0) * k, y: -(s.dec - dec0), mag: s.mag }));
  const xs = raw.map((p) => p.x), ys = raw.map((p) => p.y);
  const span = Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)) || 1;
  const mx = (Math.max(...xs) + Math.min(...xs)) / 2, my = (Math.max(...ys) + Math.min(...ys)) / 2;
  const points: Shape['points'] = {};
  for (const p of raw) {
    points[p.id] = { x: (p.x - mx) / span, y: (p.y - my) / span, r: Math.max(0.012, 0.04 - p.mag * 0.008) };
  }
  return { points, lines: c.lines, highlight: c.highlight };
}
