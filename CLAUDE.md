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
- Concepto: "órbita de transferencia" (quería estudiar Astronomía, terminó en Informática, hoy en Paranal). El portfolio cuenta la historia; el detalle de cargos vive solo en `/cv` (`dict.cv`).
- `src/scripts/sky.ts` — bucle único del cielo: `starfield.ts` dibuja el cielo sin lente → `blackhole-gl.ts` lo usa como textura y lo deforma con la física del disco (anillo de Einstein real con la galaxia de fondo) → `skymap.ts` ubica las constelaciones. Sin WebGL: `blackhole.ts` (2D) y lente en CPU en `starfield.ts`.
- `src/scripts/lens.ts` — `holeState()`: posición/tamaño/opacidad del agujero según el scroll (en el hero; luego se instala en el margen derecho si hay ≥190px, o se desvanece en móvil/angosto). Todo lo demás lee este estado.
- `src/data/constellations.ts` + `SkyMap.astro` — menú de constelaciones (Sah/Osiris → Historia, Sopdet/Isis → Trabajo, Meskhetyu/Set → Fuera del código, Casiopea → Contacto) con formas desde AR/Dec reales. En móvil se ven como íconos en el nav.
- `src/components/StageArt.astro` — ilustración SVG inspirada (no copiada) en la portada de The Stage: punto azul pálido, niebla verde, rayos.
- `src/scripts/reveal.ts` — aparición al hacer scroll para elementos `.reveal` (solo con JS y sin reduced-motion).
- `public/cv/benjamin-salamanca-cv.pdf` se genera imprimiendo `/cv` a PDF (Playwright/navegador) tras cambiar los diccionarios.
- Animaciones: pausar fuera de viewport / pestaña oculta; con `prefers-reduced-motion` dibujar un solo frame.

## Reglas
- Cero dependencias externas en runtime (sin CDN, sin fuentes remotas).
- PRIVACIDAD: nunca commitear el CV original (contiene RUT/teléfono/fecha de nacimiento). Solo el CV sanitizado en `public/cv/`.
- Deploy: push a `main` dispara `.github/workflows/deploy.yml`.
