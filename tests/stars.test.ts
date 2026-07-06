import { describe, expect, it } from 'vitest';
import stars from '../src/data/stars.json';

describe('stars.json', () => {
  it('has a realistic star count for mag < 5', () => {
    expect(stars.length).toBeGreaterThan(800);
    expect(stars.length).toBeLessThan(3000);
  });
  it('every star has normalized coords, magnitude and hex color', () => {
    for (const s of stars as { x: number; y: number; m: number; c: string }[]) {
      expect(s.x).toBeGreaterThanOrEqual(0);
      expect(s.x).toBeLessThan(1);
      expect(s.y).toBeGreaterThanOrEqual(0);
      expect(s.y).toBeLessThanOrEqual(1);
      expect(s.m).toBeLessThan(5);
      expect(s.c).toMatch(/^#[0-9a-f]{6}$/);
    }
  });
});
