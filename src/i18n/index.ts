import { es } from './es';
import { en } from './en';
import type { Dict } from './types';

export type { Dict } from './types';
export function getDict(lang: 'es' | 'en'): Dict {
  return lang === 'en' ? en : es;
}
