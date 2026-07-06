# Spec: Portfolio personal de Benjamín Salamanca

**Fecha:** 2026-07-06
**Estado:** Aprobado por el usuario (diseño conversacional, sesión 2026-07-06)

## Objetivo

Portfolio personal bilingüe (ES/EN) publicado en GitHub Pages en `https://ztellar.github.io`, orientado a dos audiencias: reclutadores en Chile y empresas extranjeras para trabajo remoto. Tema visual espacial motivado por la próxima práctica del autor en la ESO (European Southern Observatory).

## Stack y arquitectura

- **Framework:** Astro 5, salida 100% estática, TypeScript.
- **Repositorio:** `Ztellar/ztellar.github.io` (user site de GitHub Pages).
- **Deploy:** GitHub Actions con la acción oficial de Astro (`withastro/action`); cada push a `main` construye y publica.
- **i18n:** routing nativo de Astro. Español en `/` (locale por defecto, sin prefijo) e inglés en `/en/`. Textos centralizados en diccionarios `src/i18n/es.ts` y `src/i18n/en.ts`; los componentes reciben strings del diccionario, nunca texto hardcodeado.
- **Sin dependencias externas en runtime:** todo asset (datos de estrellas, fuentes si se usan, imágenes) se sirve desde el propio sitio.

## Estructura del sitio (one-page con anclas)

1. **Hero:** nombre, título ("Full-Stack Developer · Estudiante de Ingeniería Civil Informática"), mención "próximamente: práctica en ESO", links a GitHub (Ztellar), LinkedIn (benjaminsalamanca) y email (bsalamanca159@hotmail.com). Elemento visual: agujero negro animado.
2. **Sobre mí:** párrafo breve; rol de mentor en Fundación Mustakis (robótica educativa y creación de videojuegos); interés en el cruce software/astronomía por la práctica ESO.
3. **Experiencia (timeline):**
   - SM Factory — Full-Stack Developer (sept 2025 – actualidad): mantenedor de "3tiz" (Flask, Angular/Ionic/Capacitor), desplegado en Rep. Dominicana y EE.UU.
   - CTR — Práctica Full-Stack (may–jun 2025): plataforma interna de métricas y horas extra; Angular + Spring Boot, CI/CD en Bitbucket, deploy en VPS.
   - Transportes Llico — Práctica Full-Stack (ene–feb 2025): Data Warehouse y ETL con AWS y Spark; plataforma web de visualización con CI/CD en GitLab.
   - Fundación Mustakis — Mentor (2022 – actualidad).
   - ESO — Práctica (próximamente; fechas y rol por confirmar con el usuario antes de publicar detalles).
4. **Proyectos (tarjetas):**
   - Laborales, sin enlace a código (privado): 3tiz, plataforma CTR, pipeline de datos Llico. Cada tarjeta: descripción, stack, contexto.
   - Repos públicos con enlace: `perceptron` (Python), `shamir` (Python), `Codigos-Mustakis` (C++).
5. **Habilidades:** Frontend (React, Angular), Backend (FastAPI, Node.js, Spring Boot, Flask, AWS Lambda), Bases de datos (SQL, NoSQL, clave-valor), Cloud (AWS: EC2, S3, Lambda, Glue).
6. **Educación:** Ingeniería Civil Informática, Universidad de La Frontera (2021 – actualidad).
7. **Footer/contacto:** email, GitHub, LinkedIn, toggle de idioma repetido.

## Diseño visual: tema espacial

- **Campo de estrellas (fondo):** canvas 2D con un subconjunto del Yale Bright Star Catalog (magnitud < 5, ~1.600 estrellas) embebido como JSON generado en build; posiciones proyectadas y color derivado del tipo espectral (índice B–V). Parpadeo sutil y paralaje leve con el scroll.
- **Agujero negro (hero):** canvas 2D estilizado con disco de acreción animado y distorsión tipo lente simplificada (estética EHT/Gargantúa). Sin WebGL ni three.js: mantener el bundle liviano.
- **Paleta:** negros profundos / azul espacio de fondo; acento naranja-acreción y cyan estelar; tipografía monoespaciada para detalles técnicos (easter eggs: coordenadas, magnitudes).
- **Rendimiento/accesibilidad:** animaciones pausadas fuera del viewport (IntersectionObserver); con `prefers-reduced-motion` se renderiza un frame estático; contraste AA en textos; el sitio debe cargar rápido (objetivo Lighthouse performance ≥ 90).
- Se usará la skill `frontend-design` durante la implementación para dirección estética.

## Privacidad y CV

- **No publicar** el PDF actual del CV: contiene RUT, teléfono y fecha de nacimiento.
- Generar un **CV sanitizado** (sin RUT, sin teléfono, sin fecha de nacimiento; solo email público) como PDF descargable desde el sitio, en ambos idiomas si es viable (mínimo: español).

## Fuera de alcance (por ahora)

- Blog, CMS, formulario de contacto con backend, analytics, dominio propio.
- Listado dinámico de repos vía API de GitHub (se decidió curación manual).

## Criterios de éxito

1. `npm run build` sin errores ni warnings de Astro.
2. Ambos idiomas completos y navegables localmente (`/` y `/en/`).
3. Animaciones fluidas y versión estática correcta con `prefers-reduced-motion`.
4. Sitio publicado y accesible en `https://ztellar.github.io` tras push a `main`.
5. Ningún dato sensible (RUT, teléfono, fecha de nacimiento) en el repo ni en el sitio.
