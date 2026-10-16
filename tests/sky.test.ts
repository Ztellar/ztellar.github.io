import { describe, expect, it } from 'vitest';
import stars from '../src/data/stars.json';
import { constellations, reference } from '../src/data/constellations';
import { lensImages } from '../src/scripts/lens';

describe('constelaciones egipcias', () => {
  it('cada índice apunta a la estrella correcta de stars.json', () => {
    for (const [idx, [ra, dec]] of Object.entries(reference)) {
      const s = (stars as { x: number; y: number }[])[Number(idx)]!;
      expect(Math.abs(s.x * 360 - ra)).toBeLessThan(0.1);
      expect(Math.abs(90 - s.y * 180 - dec)).toBeLessThan(0.1);
    }
  });
  it('solo usan estrellas con referencia', () => {
    for (const c of constellations) {
      for (const i of [c.anchor, ...c.lines.flat(), ...(c.halo ?? [])]) expect(reference[i]).toBeDefined();
    }
  });
});

describe('lente gravitacional', () => {
  const lens = { x: 0, y: 0, shadow: 40, einstein: 100 };
  it('empuja la imagen primaria hacia afuera', () => {
    const [im] = lensImages(lens, 150, 0);
    expect(im!.primary).toBe(true);
    expect(im!.x).toBeGreaterThan(150);
    expect(im!.y).toBeCloseTo(0);
  });
  it('una estrella justo detrás forma imágenes a ambos lados, cerca del anillo de Einstein', () => {
    const ims = lensImages(lens, 5, 0);
    expect(ims).toHaveLength(2);
    expect(ims[0]!.x).toBeGreaterThan(90);
    expect(ims[1]!.x).toBeLessThan(-90);
  });
  it('casi no deforma estrellas lejanas', () => {
    const [im] = lensImages(lens, 3000, 0);
    expect(im!.x - 3000).toBeLessThan(5);
  });
});
