# Spec v3: Agujero negro full-bleed + true black OLED

**Fecha:** 2026-07-06
**Estado:** Aprobado (opción "Hero full-bleed"; ejecución completa autorizada)
**Modifica:** spec v2 (el agujero negro deja de ser figura lateral)

## 1. Hero full-bleed

- El canvas WebGL ocupa todo el hero: `position: absolute; inset: 0`, hero con breakout a ancho de viewport (`width: 100vw; margin-left: calc(50% - 50vw)`) y `min-height: calc(100svh - 3.5rem)`.
- El texto del hero se superpone (z-index 1) alineado a la izquierda dentro de un contenedor que respeta la grilla de `main` (max-width 60rem). `text-shadow` sutil para legibilidad.
- El agujero se compone en `u_center`: (0.62, 0.5) del canvas en desktop; (0.5, 0.42) bajo 720px, con el texto abajo (align-items: flex-end).
- La leyenda "Sgr A* · 17h 45m 40s · −29° 00′ 28″" pasa a la esquina inferior derecha del hero.
- `html { overflow-x: clip }` para que el breakout no genere scroll horizontal.

## 2. Parallax de cámara

- Uniform `u_look` (vec2): la cámara del shader se desplaza (`ro.x += look.x*3`, `ro.y += look.y*1.2`) mirando siempre al origen.
- JS: `pointermove` → objetivo (−0.5..0.5); lerp 0.05 por frame. Solo con `(pointer: fine)` y sin `prefers-reduced-motion`.

## 3. Rendimiento

- Resolución interna reducida: `min(dpr, 1.5) × 0.55` en desktop, `× 0.45` y 110 STEPS en móvil; CSS escala el canvas (los gradientes del disco toleran upscale).
- Se mantienen: pausa por IntersectionObserver y visibilitychange; frame único con reduced-motion; fallback 2D (adaptado a full-bleed con el mismo `u_center` relativo).
- Presupuesto: Lighthouse Performance ≥ 90, Accessibility ≥ 95.

## 4. True black OLED

- `--bg: #000000` (antes #05070f); `--bg-soft: #0a0f1e` para cards; `<meta name="theme-color" content="#000000">` en el head.
- Nebulosa baja alpha (banda 0.16→0.12; manchas 0.05–0.14 → 0.04–0.11) para conservar zonas de negro puro.
- Contraste de texto se verifica ≥ AA (mejora al oscurecer el fondo).

## Criterios de éxito

1. Tests y build limpios; sin scroll horizontal en 360–1600 px de ancho.
2. Screenshot desktop: agujero negro dominando el hero completo con texto legible encima; caption abajo a la derecha.
3. Fondo de página `#000000` exacto fuera de nebulosas/estrellas (verificable muestreando el screenshot).
4. Lighthouse ≥ 90/95.
5. Desplegado y verificado en https://ztellar.github.io.
