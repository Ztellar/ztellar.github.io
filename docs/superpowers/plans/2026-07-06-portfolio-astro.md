# Portfolio Astro (ztellar.github.io) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Portfolio bilingüe (ES/EN) con tema espacial, estático en Astro 5, desplegado en GitHub Pages en https://ztellar.github.io.

**Architecture:** Sitio one-page generado por Astro con dos rutas (`/` español, `/en/` inglés) que renderizan los mismos componentes con diccionarios i18n. Dos canvas 2D vanilla (starfield de fondo con datos del Yale Bright Star Catalog precomputados en build; agujero negro en el hero). Deploy vía GitHub Actions.

**Tech Stack:** Astro 5, TypeScript, Vitest (tests de lógica pura), canvas 2D sin librerías, GitHub Actions + `withastro/action`.

## Global Constraints

- Sitio 100% estático; **cero requests a hosts externos en runtime** (fuentes del sistema, datos embebidos).
- Todo texto visible viene de `src/i18n/es.ts` o `src/i18n/en.ts` — nunca hardcodeado en componentes.
- Español en `/` (default sin prefijo), inglés en `/en/`.
- `prefers-reduced-motion: reduce` ⇒ canvas renderiza un solo frame estático.
- **Nunca** commitear `CV_Benjamín_Salamanca (1).pdf` ni RUT/teléfono/fecha de nacimiento (el `.gitignore` ya excluye `*.pdf` salvo `public/**`).
- Working dir: `C:\Users\Benja\Downloads\Portfolio` (repo git ya inicializado, rama `master` → se renombra `main` en Task 1).
- Site URL en config: `https://ztellar.github.io`.

---

### Task 1: Scaffold Astro + tooling + CLAUDE.md

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `vitest.config.ts`, `CLAUDE.md`, `src/pages/index.astro` (provisional), `public/favicon.svg`

**Interfaces:**
- Produces: proyecto Astro compilable; comandos `npm run dev|build|test`; config i18n `defaultLocale: 'es'`.

- [ ] **Step 1: Verificar toolchain**

Run: `node --version; npm --version`
Expected: Node ≥ 20. Si no existe, detenerse y pedir al usuario instalar Node LTS.

- [ ] **Step 2: Crear package.json y config**

`package.json`:
```json
{
  "name": "ztellar.github.io",
  "type": "module",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "test": "vitest run",
    "stars": "node tools/fetch-stars.mjs"
  },
  "dependencies": {
    "astro": "^5.0.0"
  },
  "devDependencies": {
    "typescript": "^5.5.0",
    "vitest": "^3.0.0"
  }
}
```

`astro.config.mjs`:
```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://ztellar.github.io',
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en'],
    routing: { prefixDefaultLocale: false },
  },
});
```

`tsconfig.json`:
```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "src/**/*", "tools/**/*", "tests/**/*"],
  "exclude": ["dist"]
}
```

`vitest.config.ts`:
```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: { include: ['tests/**/*.test.ts'] },
});
```

- [ ] **Step 3: Página provisional y favicon**

`src/pages/index.astro`:
```astro
---
---
<html lang="es"><head><meta charset="utf-8" /><title>Benjamín Salamanca</title></head>
<body><h1>WIP</h1></body></html>
```

`public/favicon.svg`:
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="18" fill="#000"/>
  <circle cx="50" cy="50" r="22" fill="none" stroke="#ff9e4f" stroke-width="3"/>
  <ellipse cx="50" cy="50" rx="46" ry="10" fill="none" stroke="#ffb36b" stroke-width="4" transform="rotate(-18 50 50)"/>
</svg>
```

- [ ] **Step 4: Instalar y verificar build**

Run: `npm install; npm run build`
Expected: `npm install` sin errores; build genera `dist/index.html`.

- [ ] **Step 5: CLAUDE.md**

`CLAUDE.md`:
```markdown
# ztellar.github.io — Portfolio de Benjamín Salamanca

Portfolio one-page bilingüe con tema espacial. Astro 5 estático, GitHub Pages.

## Comandos
- `npm run dev` — servidor local (http://localhost:4321)
- `npm run build` — build estático a dist/
- `npm run test` — tests Vitest (lógica pura e i18n)
- `npm run stars` — regenera src/data/stars.json desde el Yale Bright Star Catalog

## Arquitectura
- `src/pages/index.astro` (ES, ruta `/`) y `src/pages/en/index.astro` (EN, `/en/`) renderizan los mismos componentes pasando el diccionario del idioma.
- `src/i18n/{es,en}.ts` — TODO texto visible vive aquí; nunca hardcodear texto en componentes. Ambos diccionarios deben tener claves idénticas (hay test).
- `src/scripts/starfield.ts` — canvas de fondo con estrellas reales (src/data/stars.json, precomputado en build con posición proyectada, magnitud y color por tipo espectral).
- `src/scripts/blackhole.ts` — agujero negro animado del hero (canvas 2D, sin WebGL).
- Animaciones: pausar fuera de viewport / pestaña oculta; con `prefers-reduced-motion` dibujar un solo frame.

## Reglas
- Cero dependencias externas en runtime (sin CDN, sin fuentes remotas).
- PRIVACIDAD: nunca commitear el CV original (contiene RUT/teléfono/fecha de nacimiento). Solo el CV sanitizado en `public/cv/`.
- Deploy: push a `main` dispara `.github/workflows/deploy.yml`.
```

- [ ] **Step 6: Renombrar rama y commit**

```bash
git branch -m master main
git add -A
git commit -m "chore: scaffold Astro 5 project with i18n config and CLAUDE.md"
```

---

### Task 2: Diccionarios i18n + test de paridad de claves

**Files:**
- Create: `src/i18n/types.ts`, `src/i18n/es.ts`, `src/i18n/en.ts`, `src/i18n/index.ts`
- Test: `tests/i18n.test.ts`

**Interfaces:**
- Produces: `getDict(lang: 'es' | 'en'): Dict`; tipo `Dict` (estructura abajo); `dict.experience.items[]`, `dict.projects.items[]` que consumen los componentes de Task 7.

- [ ] **Step 1: Test de paridad (failing)**

`tests/i18n.test.ts`:
```ts
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
```

- [ ] **Step 2: Verificar que falla**

Run: `npm run test`
Expected: FAIL (módulos `../src/i18n/es` inexistentes).

- [ ] **Step 3: Tipos y diccionarios**

`src/i18n/types.ts`:
```ts
export interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  bullets: string[];
  stack: string[];
}

export interface ProjectItem {
  name: string;
  description: string;
  context: string;
  stack: string[];
}

export interface Dict {
  lang: 'es' | 'en';
  meta: { title: string; description: string };
  nav: { about: string; experience: string; projects: string; skills: string; contact: string };
  langSwitch: { otherPath: string; otherLabel: string; ariaLabel: string };
  hero: {
    kicker: string;
    name: string;
    title: string;
    eso: string;
    ctaProjects: string;
    ctaContact: string;
  };
  about: { heading: string; p1: string; p2: string; p3: string };
  experience: { heading: string; items: ExperienceItem[] };
  projects: { heading: string; privateNote: string; items: ProjectItem[] };
  skills: { heading: string; groups: { label: string; items: string[] }[] };
  education: { heading: string; degree: string; school: string; period: string };
  footer: { heading: string; blurb: string; email: string; github: string; linkedin: string; cv: string; builtWith: string };
}
```

`src/i18n/es.ts` (contenido real, copiar tal cual):
```ts
import type { Dict } from './types';

export const es: Dict = {
  lang: 'es',
  meta: {
    title: 'Benjamín Salamanca — Full-Stack Developer',
    description:
      'Portfolio de Benjamín Salamanca: desarrollador full-stack chileno (React, Angular, FastAPI, Spring Boot, AWS), estudiante de Ingeniería Civil Informática y próximo practicante en ESO.',
  },
  nav: { about: 'Sobre mí', experience: 'Experiencia', projects: 'Proyectos', skills: 'Habilidades', contact: 'Contacto' },
  langSwitch: { otherPath: '/en/', otherLabel: 'EN', ariaLabel: 'Switch to English' },
  hero: {
    kicker: 'Temuco, Chile · UTC-4',
    name: 'Benjamín Salamanca',
    title: 'Full-Stack Developer · Estudiante de Ingeniería Civil Informática',
    eso: 'Próximamente: práctica en el European Southern Observatory (ESO)',
    ctaProjects: 'Ver proyectos',
    ctaContact: 'Contáctame',
  },
  about: {
    heading: 'Sobre mí',
    p1: 'Soy desarrollador full-stack y estudiante de Ingeniería Civil Informática en la Universidad de La Frontera. He construido plataformas web completas —del pipeline de datos al frontend— en empresas de transporte, retail y software.',
    p2: 'Desde 2022 soy mentor de la Fundación Mustakis, enseñando robótica educativa y creación de videojuegos (Scratch y Roblox Studio) a estudiantes de 7° básico a 3° medio.',
    p3: 'Pronto haré mi práctica en el European Southern Observatory: el cruce entre software y astronomía es exactamente el tipo de problema que me motiva — este sitio, con su cielo de estrellas reales, es un adelanto.',
  },
  experience: {
    heading: 'Experiencia',
    items: [
      {
        role: 'Full-Stack Developer',
        company: 'SM Factory',
        period: 'Sept 2025 — Actualidad',
        bullets: [
          'Mantenedor del proyecto "3tiz", desplegado en República Dominicana y Estados Unidos.',
          'Mantenciones correctivas y evolutivas sobre una app Flask + Angular/Ionic/Capacitor en producción.',
        ],
        stack: ['Flask', 'Angular', 'Ionic', 'Capacitor'],
      },
      {
        role: 'Práctica Full-Stack Developer',
        company: 'CTR',
        period: 'May 2025 — Jun 2025',
        bullets: [
          'Plataforma web interna para registro de métricas, horas extra y boletas de dos procesos de negocio.',
          'CI/CD en Bitbucket y despliegue en VPS.',
        ],
        stack: ['Angular', 'Spring Boot', 'Bitbucket CI/CD', 'VPS'],
      },
      {
        role: 'Práctica Full-Stack Developer',
        company: 'Transportes Llico',
        period: 'Ene 2025 — Feb 2025',
        bullets: [
          'Scripts de descarga automática de datos en tiempo real.',
          'Data Warehouse y procesos ETL con AWS y Spark para un sistema unificado de alertas.',
          'Plataforma web full-stack con CI/CD en GitLab para visualizar datos con alta granularidad.',
        ],
        stack: ['AWS', 'Spark', 'ETL', 'GitLab CI/CD'],
      },
      {
        role: 'Mentor',
        company: 'Fundación Mustakis',
        period: '2022 — Actualidad',
        bullets: [
          'Docente de talleres de robótica educativa y creación de videojuegos (Scratch y Roblox Studio) para estudiantes de 7° básico a 3° medio.',
        ],
        stack: ['Robótica educativa', 'Scratch', 'Roblox Studio'],
      },
    ],
  },
  projects: {
    heading: 'Proyectos',
    privateNote: 'Código privado de empresa — descripciones sin enlace al repositorio.',
    items: [
      {
        name: '3tiz',
        description: 'Aplicación multiplataforma en producción en República Dominicana y EE.UU. Mantención correctiva y evolutiva del stack completo.',
        context: 'SM Factory · en producción',
        stack: ['Flask', 'Angular', 'Ionic', 'Capacitor'],
      },
      {
        name: 'Plataforma de métricas CTR',
        description: 'Sistema interno de registro de métricas, contabilidad de horas extra y boletas, usado por dos procesos de negocio de la empresa.',
        context: 'CTR · práctica profesional',
        stack: ['Angular', 'Spring Boot', 'Bitbucket', 'VPS'],
      },
      {
        name: 'Pipeline de datos Llico',
        description: 'Data Warehouse con ETL (AWS + Spark) alimentando una plataforma de visualización de alta granularidad para un sistema unificado de alertas de flota.',
        context: 'Transportes Llico · práctica profesional',
        stack: ['AWS', 'Spark', 'GitLab', 'Data Warehouse'],
      },
    ],
  },
  skills: {
    heading: 'Habilidades',
    groups: [
      { label: 'Frontend', items: ['React', 'Angular'] },
      { label: 'Backend', items: ['FastAPI', 'Node.js', 'Spring Boot', 'Flask', 'AWS Lambda'] },
      { label: 'Bases de datos', items: ['SQL', 'NoSQL', 'Clave-valor'] },
      { label: 'Cloud (AWS)', items: ['EC2', 'S3', 'Lambda', 'Glue'] },
    ],
  },
  education: {
    heading: 'Educación',
    degree: 'Ingeniería Civil Informática',
    school: 'Universidad de La Frontera',
    period: '2021 — Actualidad',
  },
  footer: {
    heading: 'Contacto',
    blurb: '¿Un proyecto, una oportunidad o simplemente hablar de software y espacio? Escríbeme.',
    email: 'bsalamanca159@hotmail.com',
    github: 'https://github.com/Ztellar',
    linkedin: 'https://www.linkedin.com/in/benjaminsalamanca/',
    cv: 'Descargar CV',
    builtWith: 'Hecho con Astro · estrellas del Yale Bright Star Catalog',
  },
};
```

`src/i18n/en.ts` (traducción completa, misma estructura):
```ts
import type { Dict } from './types';

export const en: Dict = {
  lang: 'en',
  meta: {
    title: 'Benjamín Salamanca — Full-Stack Developer',
    description:
      'Portfolio of Benjamín Salamanca: Chilean full-stack developer (React, Angular, FastAPI, Spring Boot, AWS), Computer Science Engineering student and upcoming ESO intern.',
  },
  nav: { about: 'About', experience: 'Experience', projects: 'Projects', skills: 'Skills', contact: 'Contact' },
  langSwitch: { otherPath: '/', otherLabel: 'ES', ariaLabel: 'Cambiar a español' },
  hero: {
    kicker: 'Temuco, Chile · UTC-4',
    name: 'Benjamín Salamanca',
    title: 'Full-Stack Developer · Computer Science Engineering student',
    eso: 'Upcoming: internship at the European Southern Observatory (ESO)',
    ctaProjects: 'View projects',
    ctaContact: 'Get in touch',
  },
  about: {
    heading: 'About me',
    p1: 'I am a full-stack developer and Computer Science Engineering student at Universidad de La Frontera, Chile. I have built complete web platforms — from data pipelines to frontends — for transport, retail and software companies.',
    p2: 'Since 2022 I have been a mentor at Fundación Mustakis, teaching educational robotics and game development (Scratch and Roblox Studio) to middle and high school students.',
    p3: 'I will soon join the European Southern Observatory as an intern: the intersection of software and astronomy is exactly the kind of problem that drives me — this site, with its sky of real stars, is a preview.',
  },
  experience: {
    heading: 'Experience',
    items: [
      {
        role: 'Full-Stack Developer',
        company: 'SM Factory',
        period: 'Sept 2025 — Present',
        bullets: [
          'Maintainer of "3tiz", deployed in the Dominican Republic and the United States.',
          'Corrective and evolutionary maintenance of a production Flask + Angular/Ionic/Capacitor app.',
        ],
        stack: ['Flask', 'Angular', 'Ionic', 'Capacitor'],
      },
      {
        role: 'Full-Stack Developer Intern',
        company: 'CTR',
        period: 'May 2025 — Jun 2025',
        bullets: [
          'Internal web platform for metrics tracking, overtime accounting and receipts across two business processes.',
          'CI/CD on Bitbucket, deployed to a VPS.',
        ],
        stack: ['Angular', 'Spring Boot', 'Bitbucket CI/CD', 'VPS'],
      },
      {
        role: 'Full-Stack Developer Intern',
        company: 'Transportes Llico',
        period: 'Jan 2025 — Feb 2025',
        bullets: [
          'Scripts for automated real-time data ingestion.',
          'Data Warehouse and ETL processes with AWS and Spark for a unified fleet alert system.',
          'Full-stack web platform with GitLab CI/CD for high-granularity data visualization.',
        ],
        stack: ['AWS', 'Spark', 'ETL', 'GitLab CI/CD'],
      },
      {
        role: 'Mentor',
        company: 'Fundación Mustakis',
        period: '2022 — Present',
        bullets: [
          'Teaching educational robotics and game development workshops (Scratch and Roblox Studio) to students from 7th grade to high school.',
        ],
        stack: ['Educational robotics', 'Scratch', 'Roblox Studio'],
      },
    ],
  },
  projects: {
    heading: 'Projects',
    privateNote: 'Private company code — described without repository links.',
    items: [
      {
        name: '3tiz',
        description: 'Cross-platform application in production in the Dominican Republic and the US. Corrective and evolutionary maintenance across the full stack.',
        context: 'SM Factory · in production',
        stack: ['Flask', 'Angular', 'Ionic', 'Capacitor'],
      },
      {
        name: 'CTR metrics platform',
        description: 'Internal system for metrics tracking, overtime accounting and receipts, used by two of the company\'s business processes.',
        context: 'CTR · internship',
        stack: ['Angular', 'Spring Boot', 'Bitbucket', 'VPS'],
      },
      {
        name: 'Llico data pipeline',
        description: 'Data Warehouse with ETL (AWS + Spark) feeding a high-granularity visualization platform for a unified fleet alert system.',
        context: 'Transportes Llico · internship',
        stack: ['AWS', 'Spark', 'GitLab', 'Data Warehouse'],
      },
    ],
  },
  skills: {
    heading: 'Skills',
    groups: [
      { label: 'Frontend', items: ['React', 'Angular'] },
      { label: 'Backend', items: ['FastAPI', 'Node.js', 'Spring Boot', 'Flask', 'AWS Lambda'] },
      { label: 'Databases', items: ['SQL', 'NoSQL', 'Key-value'] },
      { label: 'Cloud (AWS)', items: ['EC2', 'S3', 'Lambda', 'Glue'] },
    ],
  },
  education: {
    heading: 'Education',
    degree: 'Computer Science Engineering (Ingeniería Civil Informática)',
    school: 'Universidad de La Frontera',
    period: '2021 — Present',
  },
  footer: {
    heading: 'Contact',
    blurb: 'A project, an opportunity, or just talking software and space? Reach out.',
    email: 'bsalamanca159@hotmail.com',
    github: 'https://github.com/Ztellar',
    linkedin: 'https://www.linkedin.com/in/benjaminsalamanca/',
    cv: 'Download CV',
    builtWith: 'Built with Astro · stars from the Yale Bright Star Catalog',
  },
};
```

`src/i18n/index.ts`:
```ts
import { es } from './es';
import { en } from './en';
import type { Dict } from './types';

export type { Dict } from './types';
export function getDict(lang: 'es' | 'en'): Dict {
  return lang === 'en' ? en : es;
}
```

- [ ] **Step 4: Verificar test pasa**

Run: `npm run test`
Expected: 2 tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/i18n tests/i18n.test.ts
git commit -m "feat: bilingual i18n dictionaries with key-parity test"
```

---

### Task 3: Datos de estrellas reales (build-time)

**Files:**
- Create: `tools/fetch-stars.mjs`, `src/data/stars.json` (generado y commiteado)
- Test: `tests/stars.test.ts`

**Interfaces:**
- Produces: `src/data/stars.json` = array de `{ x: number, y: number, m: number, c: string }` — `x` ∈ [0,1) desde RA, `y` ∈ [0,1] desde Dec (0 = polo norte celeste), `m` = magnitud visual, `c` = color hex por índice B−V. Lo consume `starfield.ts` (Task 5).

- [ ] **Step 1: Inspeccionar la fuente**

Run: `node -e "fetch('https://raw.githubusercontent.com/brettonw/YaleBrightStarCatalog/master/bsc5-short.json').then(r=>r.json()).then(d=>{console.log(d.length); console.log(JSON.stringify(d[0])); console.log(JSON.stringify(d[100]))})"`
Expected: ~9000 entradas; anotar los nombres exactos de campos de RA, Dec, magnitud V y B−V para ajustar el paso siguiente si difieren (candidatos: `RA` "HH:MM:SS.S", `Dec` "±DD:MM:SS", `V`, `B-V`). Si la URL falla, probar `bsc5.json` en el mismo repo.

- [ ] **Step 2: Script de generación**

`tools/fetch-stars.mjs` (ajustar nombres de campos según Step 1):
```js
// Genera src/data/stars.json desde el Yale Bright Star Catalog (magnitud < 5).
// Uso: npm run stars
import { writeFileSync, mkdirSync } from 'node:fs';

const SOURCE = 'https://raw.githubusercontent.com/brettonw/YaleBrightStarCatalog/master/bsc5-short.json';
const MAG_LIMIT = 5.0;

function sexToDeg(s, isRA) {
  const m = String(s).trim().match(/^([+-]?)(\d+):(\d+):([\d.]+)$/);
  if (!m) return null;
  const sign = m[1] === '-' ? -1 : 1;
  const deg = Number(m[2]) + Number(m[3]) / 60 + Number(m[4]) / 3600;
  return sign * deg * (isRA ? 15 : 1); // RA viene en horas
}

// Aproximación estándar B-V -> RGB (rango válido -0.4 a 2.0)
function bvToHex(bv) {
  const t = Math.max(-0.4, Math.min(2.0, bv));
  let r, g, b;
  if (t < 0.4) r = 0.83 + 0.17 * Math.max(0, t) / 0.4;
  else r = 1.0;
  if (t < 0) r = 0.62 + 0.52 * ((t + 0.4) / 0.4) * 0.4;
  if (t < 0) g = 0.7 + 0.243 * ((t + 0.4) / 0.4);
  else if (t < 0.4) g = 0.87 + 0.11 * (t / 0.4);
  else if (t < 1.6) g = 0.98 - 0.16 * ((t - 0.4) / 1.2);
  else g = 0.82 - 0.5 * ((t - 1.6) / 0.4) ** 2;
  if (t < 0.4) b = 1.0;
  else if (t < 1.5) b = 1.0 - 0.47 * ((t - 0.4) / 1.1) + 0.1 * ((t - 0.4) / 1.1) ** 2;
  else if (t < 1.94) b = 0.63 - 0.6 * ((t - 1.5) / 0.44) ** 2;
  else b = 0.03;
  const hex = (v) => Math.round(Math.max(0, Math.min(1, v)) * 255).toString(16).padStart(2, '0');
  return `#${hex(r)}${hex(g)}${hex(b)}`;
}

const raw = await (await fetch(SOURCE)).json();
const stars = [];
for (const s of raw) {
  const mag = parseFloat(s.V ?? s.Vmag ?? s.v);
  if (!Number.isFinite(mag) || mag >= MAG_LIMIT) continue;
  const ra = sexToDeg(s.RA ?? s.ra, true);
  const dec = sexToDeg(s.Dec ?? s.dec, false);
  if (ra === null || dec === null) continue;
  const bv = parseFloat(s['B-V'] ?? s.BV ?? '0.6');
  stars.push({
    x: Number((ra / 360).toFixed(4)),
    y: Number(((90 - dec) / 180).toFixed(4)),
    m: Number(mag.toFixed(2)),
    c: bvToHex(Number.isFinite(bv) ? bv : 0.6),
  });
}

if (stars.length < 800) throw new Error(`Solo ${stars.length} estrellas — revisar nombres de campos de la fuente`);
mkdirSync('src/data', { recursive: true });
writeFileSync('src/data/stars.json', JSON.stringify(stars));
console.log(`OK: ${stars.length} estrellas escritas en src/data/stars.json`);
```

- [ ] **Step 3: Generar datos**

Run: `npm run stars`
Expected: `OK: ~1600 estrellas escritas` (entre 1400 y 1800).

- [ ] **Step 4: Test de forma de datos**

`tests/stars.test.ts`:
```ts
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
```

Run: `npm run test`
Expected: PASS (4 tests en total).

- [ ] **Step 5: Commit**

```bash
git add tools/fetch-stars.mjs src/data/stars.json tests/stars.test.ts
git commit -m "feat: real star catalog data (Yale BSC, mag < 5) with build script"
```

---

### Task 4: Layout base + estilos globales (tema espacial)

**Files:**
- Create: `src/styles/global.css`, `src/layouts/Base.astro`, `src/components/Nav.astro`

**Interfaces:**
- Consumes: `Dict` de Task 2.
- Produces: `<Base dict={dict}>` layout con `<slot />`, nav fija, canvas de starfield (`<canvas id="starfield">`) detrás del contenido; tokens CSS `--bg`, `--bg-soft`, `--ink`, `--ink-dim`, `--accent` (naranja acreción), `--accent-2` (cyan estelar), `--mono`.

- [ ] **Step 1: Estilos globales**

`src/styles/global.css`:
```css
:root {
  --bg: #05070f;
  --bg-soft: #0b1020;
  --ink: #e8ecf4;
  --ink-dim: #9aa5bd;
  --accent: #ff9e4f;
  --accent-2: #6fd7ff;
  --line: rgba(154, 165, 189, 0.18);
  --mono: ui-monospace, 'Cascadia Code', Consolas, monospace;
  --sans: system-ui, 'Segoe UI', Roboto, sans-serif;
}

* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after { animation: none !important; transition: none !important; }
}

body {
  margin: 0;
  background: var(--bg);
  color: var(--ink);
  font-family: var(--sans);
  line-height: 1.6;
}

#starfield {
  position: fixed;
  inset: 0;
  z-index: -1;
  display: block;
}

main { max-width: 60rem; margin: 0 auto; padding: 0 1.5rem; }
section { padding: 5rem 0; border-top: 1px solid var(--line); }
section:first-of-type { border-top: none; }

h1, h2, h3 { line-height: 1.2; margin: 0 0 1rem; }
h2 { font-size: 1.6rem; }
h2::before { content: '// '; color: var(--accent); font-family: var(--mono); }
p { margin: 0 0 1rem; max-width: 46rem; }
a { color: var(--accent-2); }

.mono { font-family: var(--mono); font-size: 0.85rem; color: var(--ink-dim); }
.chip {
  display: inline-block;
  font-family: var(--mono);
  font-size: 0.75rem;
  padding: 0.15rem 0.6rem;
  border: 1px solid var(--line);
  border-radius: 999px;
  color: var(--accent-2);
  margin: 0 0.35rem 0.35rem 0;
}
.card {
  background: color-mix(in srgb, var(--bg-soft) 82%, transparent);
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 1.5rem;
  backdrop-filter: blur(2px);
}
```

- [ ] **Step 2: Nav**

`src/components/Nav.astro`:
```astro
---
import type { Dict } from '../i18n';
interface Props { dict: Dict }
const { dict } = Astro.props;
const base = dict.lang === 'en' ? '/en/' : '/';
---
<header>
  <nav aria-label="principal">
    <a class="brand mono" href={base}>~/ztellar</a>
    <div class="links">
      <a href={`${base}#about`}>{dict.nav.about}</a>
      <a href={`${base}#experience`}>{dict.nav.experience}</a>
      <a href={`${base}#projects`}>{dict.nav.projects}</a>
      <a href={`${base}#skills`}>{dict.nav.skills}</a>
      <a href={`${base}#contact`}>{dict.nav.contact}</a>
      <a class="lang mono" href={dict.langSwitch.otherPath} aria-label={dict.langSwitch.ariaLabel}>{dict.langSwitch.otherLabel}</a>
    </div>
  </nav>
</header>

<style>
  header {
    position: sticky; top: 0; z-index: 10;
    background: color-mix(in srgb, var(--bg) 78%, transparent);
    backdrop-filter: blur(8px);
    border-bottom: 1px solid var(--line);
  }
  nav {
    max-width: 60rem; margin: 0 auto; padding: 0.8rem 1.5rem;
    display: flex; justify-content: space-between; align-items: center; gap: 1rem;
  }
  .brand { color: var(--accent); text-decoration: none; }
  .links { display: flex; gap: 1.1rem; flex-wrap: wrap; }
  .links a { color: var(--ink-dim); text-decoration: none; font-size: 0.95rem; }
  .links a:hover { color: var(--ink); }
  .lang { border: 1px solid var(--line); border-radius: 6px; padding: 0.1rem 0.5rem; color: var(--accent-2); }
</style>
```

- [ ] **Step 3: Layout base**

`src/layouts/Base.astro`:
```astro
---
import '../styles/global.css';
import Nav from '../components/Nav.astro';
import type { Dict } from '../i18n';
interface Props { dict: Dict }
const { dict } = Astro.props;
---
<!doctype html>
<html lang={dict.lang}>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content={dict.meta.description} />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <title>{dict.meta.title}</title>
  </head>
  <body>
    <canvas id="starfield" aria-hidden="true"></canvas>
    <Nav dict={dict} />
    <main><slot /></main>
    <script src="../scripts/starfield.ts"></script>
  </body>
</html>
```

Nota: `starfield.ts` no existe aún — crear en este paso un stub para que el build no falle:

`src/scripts/starfield.ts` (stub, se reemplaza en Task 5):
```ts
export {};
```

- [ ] **Step 4: Usar el layout en la página provisional y verificar**

Reemplazar `src/pages/index.astro`:
```astro
---
import Base from '../layouts/Base.astro';
import { getDict } from '../i18n';
const dict = getDict('es');
---
<Base dict={dict}>
  <section><h2>{dict.about.heading}</h2><p>{dict.about.p1}</p></section>
</Base>
```

Run: `npm run build`
Expected: build OK; `dist/index.html` contiene "Sobre mí".

- [ ] **Step 5: Commit**

```bash
git add src/styles src/layouts src/components/Nav.astro src/scripts/starfield.ts src/pages/index.astro
git commit -m "feat: base layout, nav and space-theme design tokens"
```

---

### Task 5: Starfield con estrellas reales

**Files:**
- Modify: `src/scripts/starfield.ts` (reemplazar stub completo)

**Interfaces:**
- Consumes: `src/data/stars.json` (Task 3), `<canvas id="starfield">` (Task 4).
- Produces: fondo animado con parpadeo + paralaje por scroll; frame único si `prefers-reduced-motion`.

- [ ] **Step 1: Implementación completa**

`src/scripts/starfield.ts`:
```ts
import starsData from '../data/stars.json';

type Star = { x: number; y: number; m: number; c: string };

const canvas = document.getElementById('starfield') as HTMLCanvasElement | null;
if (canvas) init(canvas);

function init(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d')!;
  const stars = starsData as Star[];
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let w = 0, h = 0, dpr = 1, raf = 0, t0 = performance.now();

  // Fase de parpadeo estable por estrella (determinista, sin estado extra)
  const phase = stars.map((_, i) => (i * 2.399963) % (Math.PI * 2)); // ángulo áureo

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth; h = window.innerHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (reduced) draw(0);
  }

  function draw(t: number) {
    ctx.clearRect(0, 0, w, h);
    const scroll = window.scrollY;
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      // Magnitud -> tamaño y brillo (mag 5 tenue, mag <0 brillante)
      const bright = Math.min(1, Math.max(0.15, 1 - (s.m + 1) / 6.5));
      const size = Math.max(0.4, 2.2 - s.m * 0.38);
      // Paralaje: estrellas brillantes ("cercanas") se mueven más
      const py = (s.y * h * 1.4 - scroll * (0.06 + bright * 0.1)) % (h + 40);
      const y = py < -20 ? py + h + 40 : py;
      const x = s.x * w;
      const twinkle = reduced ? 1 : 0.75 + 0.25 * Math.sin(t / 900 + phase[i]);
      ctx.globalAlpha = bright * twinkle;
      ctx.fillStyle = s.c;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  function loop(now: number) {
    draw(now - t0);
    raf = requestAnimationFrame(loop);
  }

  window.addEventListener('resize', resize);
  resize();
  if (!reduced) {
    document.addEventListener('visibilitychange', () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) raf = requestAnimationFrame(loop);
    });
    raf = requestAnimationFrame(loop);
  }
}
```

- [ ] **Step 2: Verificación manual**

Run: `npm run dev` (background) y abrir http://localhost:4321
Expected: fondo negro-azulado con ~cielo de estrellas de colores levemente parpadeando; al hacer scroll las estrellas se desplazan suavemente. En DevTools, emular `prefers-reduced-motion: reduce` y recargar: estrellas estáticas, sin animación.

- [ ] **Step 3: Build y commit**

Run: `npm run build`
Expected: OK.

```bash
git add src/scripts/starfield.ts
git commit -m "feat: real-star canvas background with twinkle and scroll parallax"
```

---

### Task 6: Agujero negro del hero

**Files:**
- Create: `src/scripts/blackhole.ts`, `src/components/BlackHole.astro`

**Interfaces:**
- Consumes: tokens CSS de Task 4.
- Produces: `<BlackHole />` — canvas cuadrado autónomo (disco de acreción animado, horizonte, anillo de fotones). Task 7 lo monta en el Hero.

- [ ] **Step 1: Componente**

`src/components/BlackHole.astro`:
```astro
<div class="bh-wrap" aria-hidden="true">
  <canvas id="blackhole" width="520" height="520"></canvas>
</div>
<script src="../scripts/blackhole.ts"></script>

<style>
  .bh-wrap { display: grid; place-items: center; }
  canvas {
    width: min(70vw, 26rem);
    height: auto;
    filter: drop-shadow(0 0 40px rgba(255, 158, 79, 0.25));
  }
</style>
```

- [ ] **Step 2: Animación**

`src/scripts/blackhole.ts`:
```ts
const canvas = document.getElementById('blackhole') as HTMLCanvasElement | null;
if (canvas) init(canvas);

function init(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d')!;
  const S = canvas.width; // lienzo cuadrado, coordenadas fijas
  const C = S / 2;
  const R_EH = S * 0.11;          // horizonte de eventos
  const R_PHOTON = R_EH * 1.35;   // anillo de fotones
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Partículas del disco de acreción (elipse inclinada, kepleriano aproximado)
  const N = 240;
  const parts = Array.from({ length: N }, (_, i) => ({
    a: R_EH * (1.7 + Math.pow(i / N, 1.6) * 3.2),      // semieje mayor
    th: (i * 2.399963) % (Math.PI * 2),                 // ángulo inicial
    hue: 22 + Math.random() * 18,                       // naranjas
  }));
  const TILT = 0.32; // aplanamiento de la elipse (vista casi de canto)

  let raf = 0, running = false;

  function draw(t: number) {
    ctx.clearRect(0, 0, S, S);

    // Glow ambiental
    const glow = ctx.createRadialGradient(C, C, R_EH, C, C, S * 0.48);
    glow.addColorStop(0, 'rgba(255,158,79,0.18)');
    glow.addColorStop(1, 'rgba(255,158,79,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, S, S);

    // Disco de acreción: mitad trasera se dibuja "lenteada" por encima del horizonte
    ctx.globalCompositeOperation = 'lighter';
    for (const p of parts) {
      const om = 900 * Math.pow(R_EH * 2.4 / p.a, 1.5); // velocidad kepleriana
      const ang = p.th + (t / 16000) * om;
      const x = C + Math.cos(ang) * p.a;
      const behind = Math.sin(ang) < 0;
      let y = C + Math.sin(ang) * p.a * TILT;
      if (behind) {
        // Lente gravitacional simplificada: la mitad trasera se curva sobre el agujero
        const lift = Math.max(0, 1 - Math.abs(x - C) / (p.a)) * R_PHOTON * 1.7;
        y = C - Math.abs(Math.sin(ang)) * p.a * TILT * 0.35 - lift * 0.35;
      }
      // Doppler beaming: el lado que se acerca (izquierda) brilla más
      const doppler = 0.55 - Math.cos(ang) * 0.45;
      const d = Math.hypot(x - C, y - C);
      if (d < R_EH * 0.98) continue; // tragado por el horizonte
      ctx.globalAlpha = Math.min(1, 0.16 + doppler * 0.5) * (behind ? 0.7 : 1);
      ctx.fillStyle = `hsl(${p.hue} 100% ${55 + doppler * 20}%)`;
      ctx.beginPath();
      ctx.arc(x, y, 1.3 + doppler * 1.2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;

    // Anillo de fotones
    ctx.strokeStyle = 'rgba(255,190,120,0.85)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(C, C, R_PHOTON, 0, Math.PI * 2);
    ctx.stroke();

    // Horizonte de eventos
    ctx.fillStyle = '#000';
    ctx.beginPath();
    ctx.arc(C, C, R_EH, 0, Math.PI * 2);
    ctx.fill();
  }

  function loop(now: number) {
    draw(now);
    raf = requestAnimationFrame(loop);
  }

  if (reduced) { draw(4000); return; }

  // Animar solo cuando está en viewport y la pestaña visible
  const io = new IntersectionObserver(([e]) => {
    const want = e.isIntersecting && !document.hidden;
    if (want && !running) { running = true; raf = requestAnimationFrame(loop); }
    if (!want && running) { running = false; cancelAnimationFrame(raf); }
  });
  io.observe(canvas);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && running) { running = false; cancelAnimationFrame(raf); }
    else if (!document.hidden && !running) { running = true; raf = requestAnimationFrame(loop); }
  });
}
```

- [ ] **Step 3: Verificación manual**

Montar temporalmente `<BlackHole />` en `index.astro` (import + dentro de la primera section), `npm run dev`, abrir la página.
Expected: agujero negro con disco naranja girando, lado izquierdo más brillante (Doppler), arco elevado sobre el horizonte (lente), centro perfectamente negro con anillo de fotones. Con `prefers-reduced-motion`: frame estático. Al salir del viewport (scroll), la animación se pausa (verificar en la pestaña Performance que no hay rAF).

- [ ] **Step 4: Build y commit**

Run: `npm run build`
Expected: OK.

```bash
git add src/scripts/blackhole.ts src/components/BlackHole.astro src/pages/index.astro
git commit -m "feat: accretion-disk black hole hero animation (canvas 2D)"
```

---

### Task 7: Secciones de contenido + páginas ES/EN

**Files:**
- Create: `src/components/Hero.astro`, `src/components/About.astro`, `src/components/Experience.astro`, `src/components/Projects.astro`, `src/components/Skills.astro`, `src/components/FooterContact.astro`, `src/components/Home.astro`, `src/pages/en/index.astro`
- Modify: `src/pages/index.astro`

**Interfaces:**
- Consumes: `Dict` (Task 2), `<BlackHole />` (Task 6), layout `Base` (Task 4).
- Produces: sitio completo en ambos idiomas. `Home.astro` recibe `dict` y compone todas las secciones; las páginas solo eligen idioma.

- [ ] **Step 1: Hero**

`src/components/Hero.astro`:
```astro
---
import BlackHole from './BlackHole.astro';
import type { Dict } from '../i18n';
interface Props { dict: Dict }
const { dict } = Astro.props;
---
<section id="hero">
  <div class="text">
    <p class="mono">{dict.hero.kicker}</p>
    <h1>{dict.hero.name}</h1>
    <p class="title">{dict.hero.title}</p>
    <p class="eso mono">▸ {dict.hero.eso}</p>
    <div class="ctas">
      <a class="btn primary" href="#projects">{dict.hero.ctaProjects}</a>
      <a class="btn" href="#contact">{dict.hero.ctaContact}</a>
    </div>
  </div>
  <BlackHole />
</section>

<style>
  section {
    display: grid;
    grid-template-columns: 1.2fr 1fr;
    align-items: center;
    gap: 2rem;
    min-height: calc(100svh - 8rem);
    border-top: none;
  }
  h1 { font-size: clamp(2.2rem, 6vw, 3.6rem); }
  .title { color: var(--ink-dim); font-size: 1.15rem; }
  .eso { color: var(--accent); }
  .ctas { display: flex; gap: 0.8rem; margin-top: 1.5rem; flex-wrap: wrap; }
  .btn {
    padding: 0.6rem 1.2rem; border-radius: 8px; text-decoration: none;
    border: 1px solid var(--line); color: var(--ink);
  }
  .btn.primary { background: var(--accent); border-color: var(--accent); color: #1a0e02; font-weight: 600; }
  @media (max-width: 720px) { section { grid-template-columns: 1fr; text-align: center; } .ctas { justify-content: center; } }
</style>
```

- [ ] **Step 2: About, Experience, Projects, Skills (con Educación), FooterContact**

`src/components/About.astro`:
```astro
---
import type { Dict } from '../i18n';
interface Props { dict: Dict }
const { dict } = Astro.props;
---
<section id="about">
  <h2>{dict.about.heading}</h2>
  <p>{dict.about.p1}</p>
  <p>{dict.about.p2}</p>
  <p>{dict.about.p3}</p>
</section>
```

`src/components/Experience.astro`:
```astro
---
import type { Dict } from '../i18n';
interface Props { dict: Dict }
const { dict } = Astro.props;
---
<section id="experience">
  <h2>{dict.experience.heading}</h2>
  <ol class="timeline">
    {dict.experience.items.map((job) => (
      <li>
        <div class="dot" aria-hidden="true"></div>
        <div class="card">
          <p class="mono">{job.period}</p>
          <h3>{job.role} · <span class="company">{job.company}</span></h3>
          <ul>{job.bullets.map((b) => <li>{b}</li>)}</ul>
          <div>{job.stack.map((s) => <span class="chip">{s}</span>)}</div>
        </div>
      </li>
    ))}
  </ol>
</section>

<style>
  .timeline { list-style: none; margin: 0; padding: 0; display: grid; gap: 1.5rem; }
  .timeline > li { position: relative; padding-left: 1.6rem; }
  .timeline > li::before {
    content: ''; position: absolute; left: 0.28rem; top: 1.4rem; bottom: -1.5rem;
    width: 1px; background: var(--line);
  }
  .timeline > li:last-child::before { display: none; }
  .dot {
    position: absolute; left: 0; top: 0.9rem; width: 0.6rem; height: 0.6rem;
    border-radius: 50%; background: var(--accent-2); box-shadow: 0 0 8px var(--accent-2);
  }
  h3 { font-size: 1.1rem; }
  .company { color: var(--accent-2); }
  .card ul { margin: 0.5rem 0 1rem; padding-left: 1.2rem; color: var(--ink-dim); }
</style>
```

`src/components/Projects.astro`:
```astro
---
import type { Dict } from '../i18n';
interface Props { dict: Dict }
const { dict } = Astro.props;
---
<section id="projects">
  <h2>{dict.projects.heading}</h2>
  <p class="mono">{dict.projects.privateNote}</p>
  <div class="grid">
    {dict.projects.items.map((p) => (
      <article class="card">
        <h3>{p.name}</h3>
        <p class="mono">{p.context}</p>
        <p>{p.description}</p>
        <div>{p.stack.map((s) => <span class="chip">{s}</span>)}</div>
      </article>
    ))}
  </div>
</section>

<style>
  .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr)); gap: 1.2rem; margin-top: 1.5rem; }
  h3 { color: var(--accent); font-size: 1.15rem; }
  article p:nth-of-type(2) { color: var(--ink-dim); }
</style>
```

`src/components/Skills.astro`:
```astro
---
import type { Dict } from '../i18n';
interface Props { dict: Dict }
const { dict } = Astro.props;
---
<section id="skills">
  <h2>{dict.skills.heading}</h2>
  <div class="grid">
    {dict.skills.groups.map((g) => (
      <div class="card">
        <h3 class="mono">{g.label}</h3>
        <div>{g.items.map((s) => <span class="chip">{s}</span>)}</div>
      </div>
    ))}
  </div>
  <p class="edu">
    <span class="mono">{dict.education.heading}:</span>
    {dict.education.degree} — {dict.education.school} <span class="mono">({dict.education.period})</span>
  </p>
</section>

<style>
  .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(13rem, 1fr)); gap: 1.2rem; }
  h3 { color: var(--accent-2); font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.08em; }
  .edu { margin-top: 2rem; }
</style>
```

`src/components/FooterContact.astro`:
```astro
---
import type { Dict } from '../i18n';
interface Props { dict: Dict }
const { dict } = Astro.props;
---
<section id="contact">
  <h2>{dict.footer.heading}</h2>
  <p>{dict.footer.blurb}</p>
  <div class="links">
    <a class="btn" href={`mailto:${dict.footer.email}`}>{dict.footer.email}</a>
    <a class="btn" href={dict.footer.github} rel="me noopener">GitHub</a>
    <a class="btn" href={dict.footer.linkedin} rel="me noopener">LinkedIn</a>
  </div>
  <footer class="mono">{dict.footer.builtWith}</footer>
</section>

<style>
  .links { display: flex; gap: 0.8rem; flex-wrap: wrap; margin: 1.5rem 0 3rem; }
  .btn { padding: 0.6rem 1.2rem; border: 1px solid var(--line); border-radius: 8px; text-decoration: none; color: var(--ink); }
  .btn:hover { border-color: var(--accent-2); }
  footer { padding-bottom: 2rem; color: var(--ink-dim); }
</style>
```

- [ ] **Step 3: Composición y páginas**

`src/components/Home.astro`:
```astro
---
import Base from '../layouts/Base.astro';
import Hero from './Hero.astro';
import About from './About.astro';
import Experience from './Experience.astro';
import Projects from './Projects.astro';
import Skills from './Skills.astro';
import FooterContact from './FooterContact.astro';
import type { Dict } from '../i18n';
interface Props { dict: Dict }
const { dict } = Astro.props;
---
<Base dict={dict}>
  <Hero dict={dict} />
  <About dict={dict} />
  <Experience dict={dict} />
  <Projects dict={dict} />
  <Skills dict={dict} />
  <FooterContact dict={dict} />
</Base>
```

`src/pages/index.astro` (reemplazo completo):
```astro
---
import Home from '../components/Home.astro';
import { getDict } from '../i18n';
---
<Home dict={getDict('es')} />
```

`src/pages/en/index.astro`:
```astro
---
import Home from '../../components/Home.astro';
import { getDict } from '../../i18n';
---
<Home dict={getDict('en')} />
```

- [ ] **Step 4: Verificar ambos idiomas**

Run: `npm run build`
Expected: build OK, genera `dist/index.html` y `dist/en/index.html`.

Run (comprobación de contenido):
```
node -e "const f=require('fs');const es=f.readFileSync('dist/index.html','utf8');const en=f.readFileSync('dist/en/index.html','utf8');console.log('ES ok:',es.includes('Sobre mí')&&es.includes('SM Factory')&&es.includes('European Southern Observatory'));console.log('EN ok:',en.includes('About me')&&en.includes('SM Factory'));console.log('no RUT:',!es.includes('<RUT>')&&!es.includes('<TELEFONO>')&&!es.includes('<TELEFONO>'));"
```
Expected: `ES ok: true`, `EN ok: true`, `no RUT: true`.

Verificación visual con `npm run dev`: recorrer `/` y `/en/` completos, probar toggle de idioma y anchors del nav.

- [ ] **Step 5: Commit**

```bash
git add src/components src/pages
git commit -m "feat: full one-page portfolio sections in Spanish and English"
```

---

### Task 8: CV sanitizado descargable

**Files:**
- Create: `src/pages/cv.astro`, `public/cv/benjamin-salamanca-cv.pdf` (generado)
- Modify: `src/components/FooterContact.astro` (agregar botón), `src/i18n/types.ts` ya tiene `footer.cv`

**Interfaces:**
- Consumes: `Dict` (contenido del CV sale de `es`), datos de experiencia ya en diccionarios.
- Produces: `/cv` (página imprimible, excluida de nav) y PDF en `public/cv/`.

- [ ] **Step 1: Página imprimible**

`src/pages/cv.astro` — página autónoma con estilos print (fondo blanco, tipografía serif/sans legible), SIN datos sensibles. Estructura: nombre, email `bsalamanca159@hotmail.com`, GitHub y LinkedIn, luego las mismas secciones de `es.experience`, `es.skills`, `es.education` iteradas desde el diccionario:
```astro
---
import { getDict } from '../i18n';
const d = getDict('es');
---
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="robots" content="noindex" />
  <title>CV — {d.hero.name}</title>
  <style>
    body { font-family: 'Segoe UI', system-ui, sans-serif; color: #111; background: #fff; max-width: 48rem; margin: 2rem auto; padding: 0 1.5rem; line-height: 1.5; font-size: 0.95rem; }
    h1 { margin: 0; font-size: 1.8rem; }
    h2 { font-size: 1.1rem; border-bottom: 1px solid #999; padding-bottom: 0.2rem; margin-top: 1.6rem; }
    .contact { color: #444; margin-top: 0.3rem; }
    .job { margin-bottom: 0.9rem; }
    .head { display: flex; justify-content: space-between; font-weight: 600; }
    .period { font-weight: 400; color: #555; }
    ul { margin: 0.3rem 0; padding-left: 1.2rem; }
    @media print { body { margin: 0; } }
  </style>
</head>
<body>
  <h1>{d.hero.name}</h1>
  <p class="contact">{d.footer.email} · github.com/Ztellar · linkedin.com/in/benjaminsalamanca · {d.hero.kicker}</p>
  <p>{d.hero.title}. {d.hero.eso}.</p>
  <h2>{d.experience.heading}</h2>
  {d.experience.items.map((j) => (
    <div class="job">
      <div class="head"><span>{j.role} — {j.company}</span><span class="period">{j.period}</span></div>
      <ul>{j.bullets.map((b) => <li>{b}</li>)}</ul>
    </div>
  ))}
  <h2>{d.skills.heading}</h2>
  {d.skills.groups.map((g) => <p><strong>{g.label}:</strong> {g.items.join(', ')}</p>)}
  <h2>{d.education.heading}</h2>
  <p>{d.education.degree}, {d.education.school} ({d.education.period})</p>
</body>
</html>
```

- [ ] **Step 2: Generar PDF con Edge headless**

```powershell
npm run build
# preview en background en puerto 4321
Start-Process npm -ArgumentList 'run','preview' -NoNewWindow
Start-Sleep -Seconds 4
& "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" --headless --disable-gpu --print-to-pdf="C:\Users\Benja\Downloads\Portfolio\public\cv\benjamin-salamanca-cv.pdf" --no-pdf-header-footer http://localhost:4321/cv
```
(Si Edge no está en esa ruta, buscar con `(Get-Command msedge).Source` o usar `C:\Program Files\Microsoft\Edge\Application\msedge.exe`.) Detener el preview después.
Expected: `public/cv/benjamin-salamanca-cv.pdf` existe, < 200 KB.

- [ ] **Step 3: Verificar PDF sin datos sensibles**

Abrir/leer el PDF y confirmar: contiene email y experiencia; NO contiene "<RUT>", "<TELEFONO>", "<FECHA_NACIMIENTO>", ni "hotmail" adicionales no deseados… (el email público sí va).
Expected: limpio.

- [ ] **Step 4: Botón de descarga**

En `src/components/FooterContact.astro`, dentro de `.links` agregar:
```astro
    <a class="btn" href="/cv/benjamin-salamanca-cv.pdf" download>{dict.footer.cv}</a>
```

Run: `npm run build`
Expected: OK; `dist/cv/benjamin-salamanca-cv.pdf` presente.

- [ ] **Step 5: Commit**

```bash
git add src/pages/cv.astro public/cv/benjamin-salamanca-cv.pdf src/components/FooterContact.astro
git commit -m "feat: sanitized downloadable CV (printable page + PDF)"
```

---

### Task 9: Pulido visual + accesibilidad + rendimiento

**Files:**
- Modify: los que indique la revisión (principalmente `src/styles/global.css` y componentes)

**Interfaces:**
- Consumes: sitio completo (Tasks 4–8).
- Produces: sitio con dirección visual final. Esta task usa la skill `frontend-design` como guía.

- [ ] **Step 1: Cargar skill frontend-design y revisar el sitio en dev** — evaluar jerarquía tipográfica, ritmo vertical, contraste, personalidad (detalles mono/espaciales), estados hover/focus. Aplicar ajustes CSS concretos derivados de esa revisión (mantener paleta y estructura del spec).
- [ ] **Step 2: Accesibilidad** — verificar: navegación por teclado completa (focus visible en links/botones), `aria-label` del toggle de idioma, contraste AA de `--ink-dim` sobre `--bg` (ratio ≥ 4.5, comprobar con DevTools), ambos canvas con `aria-hidden="true"`.
- [ ] **Step 3: Rendimiento** — Lighthouse en modo incógnito sobre `npm run preview`: Performance ≥ 90, Accessibility ≥ 95. Si el starfield baja el score en móvil, reducir estrellas dibujadas bajo 720px de ancho (filtrar `m < 4`).
- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "polish: visual refinement, a11y and performance pass"
```

---

### Task 10: Repo GitHub + deploy a Pages

**Files:**
- Create: `.github/workflows/deploy.yml`

**Interfaces:**
- Consumes: build funcionando (`npm run build`).
- Produces: sitio vivo en https://ztellar.github.io.

- [ ] **Step 1: Workflow**

`.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: withastro/action@v3

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: GitHub Pages deploy workflow"
```

- [ ] **Step 2: Crear repo remoto y push**

Run: `gh auth status`
- Si autenticado: `gh repo create Ztellar/ztellar.github.io --public --source . --push`
- Si NO autenticado: pedir al usuario ejecutar `! gh auth login` (o crear el repo manualmente en github.com/new con nombre exacto `ztellar.github.io`), luego:
```bash
git remote add origin https://github.com/Ztellar/ztellar.github.io.git
git push -u origin main
```

- [ ] **Step 3: Configurar Pages para usar Actions**

Run: `gh api -X POST repos/Ztellar/ztellar.github.io/pages -f build_type=workflow` (ignorar error 409 si ya existe; en ese caso `gh api -X PUT repos/Ztellar/ztellar.github.io/pages -f build_type=workflow`).
Expected: Pages configurado con source "GitHub Actions".

- [ ] **Step 4: Verificar deploy**

Run: `gh run watch` (o `gh run list --limit 1` hasta `completed success`), luego:
```
node -e "fetch('https://ztellar.github.io').then(r=>{console.log('status',r.status);return r.text()}).then(t=>console.log('contains name:',t.includes('Benjamín Salamanca')))"
node -e "fetch('https://ztellar.github.io/en/').then(r=>console.log('en status',r.status))"
```
Expected: status 200 y `contains name: true` en ambas rutas. **Este es el criterio de éxito final del spec.**

- [ ] **Step 5: Commit final de cualquier ajuste y confirmar criterios del spec**

Repasar los 5 criterios de éxito del spec (build limpio, dos idiomas, reduced-motion, sitio vivo, sin datos sensibles) y reportar al usuario con evidencia.
