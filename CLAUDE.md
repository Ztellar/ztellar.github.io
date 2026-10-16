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
- `src/components/Console.astro` — terminal interactiva; comandos y salidas viven en `console.commands` del diccionario.
- `src/scripts/reveal.ts` — aparición al hacer scroll para elementos `.reveal` (solo con JS y sin reduced-motion).
- `public/cv/benjamin-salamanca-cv.pdf` se genera imprimiendo `/cv` a PDF (Playwright/navegador) tras cambiar los diccionarios.
- Animaciones: pausar fuera de viewport / pestaña oculta; con `prefers-reduced-motion` dibujar un solo frame.

## Reglas
- Cero dependencias externas en runtime (sin CDN, sin fuentes remotas).
- PRIVACIDAD: nunca commitear el CV original (contiene RUT/teléfono/fecha de nacimiento). Solo el CV sanitizado en `public/cv/`.
- Deploy: push a `main` dispara `.github/workflows/deploy.yml`.
