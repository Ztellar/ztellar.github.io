// Constelaciones del antiguo Egipto dibujadas sobre las estrellas reales del fondo.
// Los números son índices en stars.json (verificados contra AR/Dec de cada estrella).
// Si se regenera stars.json con `npm run stars`, hay que volver a verificarlos (hay test).
export interface Constellation {
  /** Nombre egipcio · deidad asociada. */
  name: string;
  /** Pares de índices de estrellas unidas por una línea. */
  lines: [number, number][];
  /** Estrella junto a la que se escribe el nombre. */
  anchor: number;
  /** Estrellas solitarias que se marcan con un halo (p. ej. Sirio). */
  halo?: number[];
}

// Índices de estrellas
const BETELGEUSE = 381, BELLATRIX = 332, ALNITAK = 358, ALNILAM = 350, MINTAKA = 341;
const SAIPH = 367, RIGEL = 317, MEISSA = 346, SIRIUS = 437;
const DUBHE = 740, MERAK = 737, PHECDA = 789, MEGREZ = 802, ALIOTH = 854, MIZAR = 882, ALKAID = 902;

export const constellations: Constellation[] = [
  {
    // Orión: Sah, el alma de Osiris
    name: 'SAH · OSIRIS',
    anchor: BETELGEUSE,
    lines: [
      [MEISSA, BETELGEUSE], [MEISSA, BELLATRIX], [BETELGEUSE, ALNITAK], [BELLATRIX, MINTAKA],
      [MINTAKA, ALNILAM], [ALNILAM, ALNITAK], [ALNITAK, SAIPH], [MINTAKA, RIGEL],
    ],
  },
  {
    // Sirio: Sopdet, identificada con Isis; su orto helíaco anunciaba la crecida del Nilo
    name: 'SOPDET · ISIS',
    anchor: SIRIUS,
    lines: [],
    halo: [SIRIUS],
  },
  {
    // Osa Mayor: Meskhetyu, la pata del toro de Set
    name: 'MESKHETYU · SET',
    anchor: DUBHE,
    lines: [
      [DUBHE, MERAK], [MERAK, PHECDA], [PHECDA, MEGREZ], [MEGREZ, DUBHE],
      [MEGREZ, ALIOTH], [ALIOTH, MIZAR], [MIZAR, ALKAID],
    ],
  },
];

/** AR/Dec (grados) de referencia para verificar los índices en tests. */
export const reference: Record<number, [number, number]> = {
  [BETELGEUSE]: [88.79, 7.41], [BELLATRIX]: [81.28, 6.35], [ALNITAK]: [85.19, -1.94], [ALNILAM]: [84.05, -1.2],
  [MINTAKA]: [83.0, -0.3], [SAIPH]: [86.94, -9.67], [RIGEL]: [78.63, -8.2], [MEISSA]: [83.78, 9.93],
  [SIRIUS]: [101.29, -16.72], [DUBHE]: [165.93, 61.75], [MERAK]: [165.46, 56.38], [PHECDA]: [178.46, 53.69],
  [MEGREZ]: [183.86, 57.03], [ALIOTH]: [193.51, 55.96], [MIZAR]: [200.98, 54.93], [ALKAID]: [206.89, 49.31],
};
