import { describe, expect, it } from 'vitest';
import { es } from '../src/i18n/es';
import { en } from '../src/i18n/en';

function keyPaths(obj: unknown, prefix = ''): string[] {
  if (Array.isArray(obj)) return [`${prefix}[]`];
  if (obj !== null && typeof obj === 'object') {
    return Object.entries(obj).flatMap(([k, v]) => keyPaths(v, prefix ? `${prefix}.${k}` : k));
  }
  return [prefix];
}

describe('i18n dictionaries', () => {
  it('es and en have identical key structure', () => {
    expect(keyPaths(en).sort()).toEqual(keyPaths(es).sort());
  });
  it('lists have the same item counts', () => {
    expect(en.cv.experience.length).toBe(es.cv.experience.length);
    expect(en.work.others.length).toBe(es.work.others.length);
    expect(en.story.orbit.waypoints.length).toBe(es.story.orbit.waypoints.length);
    expect(en.story.paragraphs.length).toBe(es.story.paragraphs.length);
  });
});
