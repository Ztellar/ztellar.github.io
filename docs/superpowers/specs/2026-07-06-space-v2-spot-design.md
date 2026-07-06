# Spec v2: Espectáculo espacial (WebGL) + tarjeta destacada Spot

**Fecha:** 2026-07-06
**Estado:** Aprobado por el usuario (opción "Ambos" + Spot como tarjeta destacada; ejecución completa autorizada)
**Modifica:** `2026-07-06-portfolio-design.md` (levanta la restricción "sin WebGL" con condiciones)

## 1. Agujero negro WebGL en el hero

- Nuevo `src/scripts/blackhole-gl.ts`: WebGL crudo (sin three.js ni librerías). Fragment shader que integra trayectorias de luz alrededor de un agujero negro estilo Gargantúa:
  - Rayos curvados por gravedad (integración iterativa por pixel).
  - Disco de acreción fino visible por encima y por debajo del horizonte (lente gravitacional), con anillo de fotones/Einstein.
  - Doppler beaming: el lado que se acerca brilla más y más azul-blanco; el que se aleja, más tenue y rojizo.
  - Fondo de estrellas procedural (hash) distorsionado por la lente.
- Calidad adaptativa: DPR limitado a 1.5; en viewport angosto (< 720 px) menos iteraciones y menor resolución interna.
- Ciclo de vida idéntico al actual: IntersectionObserver pausa fuera de viewport, `visibilitychange` pausa en pestaña oculta, `prefers-reduced-motion` renderiza un solo frame.
- **Fallback:** si `getContext('webgl')` falla, se usa el canvas 2D existente (`blackhole.ts` se conserva).
- `BlackHole.astro` mantiene figura y caption Sgr A*; el script decide GL o 2D.

## 2. Fondo cinemático (canvas 2D, starfield)

Sobre `src/scripts/starfield.ts`:
- **Nebulosas + Vía Láctea:** capa generada UNA vez en canvas offscreen al cargar/resize (radial gradients apilados: azules #1a2550, púrpuras #2a1f4a, toque naranja tenue; banda diagonal luminosa). Se dibuja detrás de las estrellas con alpha bajo. Costo por frame ≈ un drawImage.
- **Estrellas fugaces:** cada 4–9 s (aleatorio), un streak con estela que se desvanece (~0.8 s), trayectoria y ángulo aleatorios en el tercio superior. No aparecen con reduced-motion.
- **Warp de entrada:** al cargar, ~1.2 s donde las estrellas viajan radialmente desde el centro desacelerando hasta su posición final (ease-out). Omitido con reduced-motion.
- Se conservan: parpadeo, paralaje por scroll, subset m<4 en móvil, colores por temperatura.

## 3. Tarjeta destacada: Spot

- En Proyectos, ANTES de la grilla actual, tarjeta a ancho completo con borde de acento y glow sutil.
- Contenido (de `C:\Users\Benja\Downloads\Proyecto-Ticket\README.md`):
  - **Nombre:** Spot — Plataforma de ticketing con blockchain invisible.
  - **Descripción (ES):** venta de entradas donde cada ticket es un cNFT en Solana sin que el usuario vea nada de crypto (wallets custodiales, login tradicional); anti-falsificación, reventa limitada a +20% con regalías automáticas, entrada por NFC "tap to enter" y validación offline.
  - **Contexto:** Proyecto personal · MVP en pilotos controlados · TICSUR 2026, Temuco.
  - **Stack chips:** Next.js, NestJS, TypeScript, PostgreSQL, Redis, Solana cNFTs, Expo / React Native, NFC.
  - Sin enlace a repositorio (código propietario). EN traducido con paridad de claves.
- i18n: nuevo bloque `projects.featured` en `Dict` (name, description, context, stack). El test de paridad cubre las claves nuevas automáticamente.

## 4. Restricciones que se mantienen

- Cero dependencias externas en runtime y cero librerías nuevas (el shader es texto embebido).
- Lighthouse Performance ≥ 90 y Accessibility ≥ 95 tras los cambios.
- Texto visible solo desde diccionarios i18n.
- Sin datos sensibles.

## Criterios de éxito

1. `npm run build` y `npm run test` limpios (paridad i18n incluye a Spot).
2. Hero muestra el agujero negro WebGL con lensing (verificable en screenshot); con WebGL deshabilitado se ve el 2D actual.
3. Fondo muestra nebulosas y estrellas fugaces; warp solo al cargar; reduced-motion = todo estático.
4. Tarjeta Spot visible en ES y EN antes de la grilla de proyectos.
5. Lighthouse ≥ 90/95 y sitio actualizado vivo en https://ztellar.github.io.
