import { describe, expect, it } from 'vitest';
import { constellations, shapeOf } from '../src/data/constellations';
import { holeState, lensImages } from '../src/scripts/lens';

describe('constelaciones del mapa', () => {
  it('una por sección, sin repetir', () => {
    expect(new Set(constellations.map((c) => c.section)).size).toBe(constellations.length);
  });
  it('las líneas solo unen estrellas definidas y la forma cabe en la caja unitaria', () => {
    for (const c of constellations) {
      const s = shapeOf(c);
      for (const [a, b] of c.lines) {
        expect(s.points[a]).toBeDefined();
        expect(s.points[b]).toBeDefined();
      }
      for (const p of Object.values(s.points)) {
        expect(Math.abs(p.x)).toBeLessThanOrEqual(0.5 + 1e-9);
        expect(Math.abs(p.y)).toBeLessThanOrEqual(0.5 + 1e-9);
      }
    }
  });
  it('Orión queda con el norte arriba: Betelgeuse sobre Rigel', () => {
    const s = shapeOf(constellations.find((c) => c.key === 'osiris')!);
    expect(s.points.betelgeuse!.y).toBeLessThan(s.points.rigel!.y);
  });
});

describe('estado del agujero negro', () => {
  const base = { w: 1366, h: 900, navH: 56, heroH: 844 };
  it('en el hero está a la derecha del texto', () => {
    const s = holeState({ ...base, scrollY: 0 });
    expect(s.cx).toBeCloseTo(0.66);
    expect(s.rail).toBe(true);
    expect(s.opacity).toBe(1);
  });
  it('al bajar se instala en el margen derecho, más pequeño y centrado en vertical', () => {
    const top = holeState({ ...base, scrollY: 0 });
    const s = holeState({ ...base, scrollY: 2000 });
    expect(s.progress).toBe(1);
    expect(s.cx * base.w).toBeCloseTo(s.railX);
    expect(s.cy).toBeCloseTo(0.5);
    expect(s.zoom).toBeGreaterThan(top.zoom * 2);
  });
  it('en móvil se desvanece al dejar el hero', () => {
    const s = holeState({ w: 390, h: 844, navH: 48, heroH: 796, scrollY: 1200 });
    expect(s.rail).toBe(false);
    expect(s.opacity).toBe(0);
  });
});

describe('lente gravitacional (fallback en CPU)', () => {
  const lens = { x: 0, y: 0, shadow: 40, einstein: 100 };
  it('empuja la imagen primaria hacia afuera', () => {
    const [im] = lensImages(lens, 150, 0);
    expect(im!.primary).toBe(true);
    expect(im!.x).toBeGreaterThan(150);
  });
  it('una estrella justo detrás forma imágenes a ambos lados, cerca del anillo de Einstein', () => {
    const ims = lensImages(lens, 5, 0);
    expect(ims).toHaveLength(2);
    expect(ims[0]!.x).toBeGreaterThan(90);
    expect(ims[1]!.x).toBeLessThan(-90);
  });
});
