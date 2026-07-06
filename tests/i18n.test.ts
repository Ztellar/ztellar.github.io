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
  it('experience and projects have same item counts', () => {
    expect(en.experience.items.length).toBe(es.experience.items.length);
    expect(en.projects.items.length).toBe(es.projects.items.length);
  });
});
