# 03 · Veredicto

## REFINE

**Los huesos están bien: la arquitectura de información, la utilidad y la honestidad del copy puntúan alto (3, 3), y todo lo que falla — 16 tamaños de fuente sin escala, 12 radios de borde, paddings sin grilla, cero estados de foco — vive en la capa de terminación, que es exactamente lo que un refinamiento arregla sin tocar estructura.**

Regla aplicada: total 20/30 ≥ 20 **y** ningún principio en 0 → REFINE.

La razón sustantiva coincide con la aritmética. Lo que hace que esta interfaz se lea «genérica» no es su estructura sino su acabado: usa la tipografía por defecto de Windows en once tamaños distintos separados por medio píxel, y no tiene ni una grilla de espacio ni un anillo de foco. Ninguno de esos defectos se arregla rediseñando la navegación — se arreglan imponiendo un sistema sobre las decisiones que ya se tomaron a ojo.

---

## Movimientos de mayor palanca

### 1. Principio #3 (aesthetic) — Imponer una escala tipográfica y colapsar los 16 tamaños en 7 tokens
Reemplazar los `font-size` sueltos por una escala con razón fija expuesta como variables CSS. Los once valores entre 9.5 px y 15 px se mapean a tres o cuatro pasos reales.
**Evidencia:** 01-evidence §B, «Escala tipográfica observada»; los 16 valores se extraen de todo `index.html`.

### 2. Principio #3 (aesthetic) — Imponer una grilla de espacio de 4 px y colapsar los 12 radios en 4 tokens
Todos los `padding` pasan a múltiplos de 4 vía tokens `--sp-*`; los radios se reducen a `--r-sm / --r-md / --r-lg / --r-full`. Eliminar los `2.5px` de `.switch`.
**Evidencia:** 01-evidence §B, «Espaciado — sin grilla» y «Radios de borde»; `index.html:369-372`.

### 3. Principio #8 (thorough) — Agregar `:focus-visible` a todos los controles y un estado `disabled`
Hoy hay 3 reglas de foco y todas son de input. Rail, tabs, cards, filas del árbol y theme-cards son invisibles al teclado.
**Evidencia:** `index.html:178`, `:366`, `:407`; 0 ocurrencias de `disabled` en `app.js` e `index.html`.

### 4. Principio #9 (environmentally friendly) — Respetar `prefers-reduced-motion`
Un bloque `@media` que anule las 11 transiciones y el `translateY` del hover de card. Es el único requisito que separa este principio de un 3.
**Evidencia:** 0 ocurrencias de `prefers-reduced-motion` contra 11 declaraciones `transition` en `index.html`.

### 5. Principio #1 + #3 — Darle voz tipográfica propia en lugar de la sans del sistema
`--sans` resuelve a Segoe UI en Windows: es la fuente por defecto del sistema operativo, y es la razón principal por la que la interfaz «se ve genérica». Cambiar a una familia con carácter, autoalojada para no romper el modo offline, y ajustar `letter-spacing` óptico en los tamaños grandes.
**Evidencia:** `index.html:18` (`--sans`), `index.html:132` (`h1..h4` en serif); 01-evidence §B, «Familias».

---

## Fuera de alcance de este refinamiento

- Cambiar el layout: rail, sidebar, tabbar, viewport y statusbar se quedan como están.
- Reducir los 14 temas (`data.js:32-61`). Puntúan en #7 pero son una preferencia deliberada del usuario, no un defecto a corregir sin pedirlo.
- Reescribir el copy: puntuó 3/3, no se toca.
- Cualquier cambio en `app.js` que no sea agregar clases o atributos de accesibilidad.
