# 04 · Handoff a /make-plan

````
/make-plan Refinar la interfaz del workspace académico en "00 - general/workspace/index.html" (+ app.js) a partir de una auditoría Dieter Rams (total 20/30).

Contexto: app de una sola página, sin build step, sin framework, HTML + CSS embebido + JS plano. Debe seguir funcionando offline y sobre file://. Usuario único: un estudiante de Ingeniería Aeroespacial navegando el material de su carrera en sesiones largas de lectura. El shell (rail de iconos, sidebar con árbol, tabbar, viewport, statusbar) imita VS Code y se conserva tal cual.

Veredicto (citado de 03-verdict.md):
> Los huesos están bien: la arquitectura de información, la utilidad y la honestidad del copy puntúan alto (3, 3), y todo lo que falla — 16 tamaños de fuente sin escala, 12 radios de borde, paddings sin grilla, cero estados de foco — vive en la capa de terminación, que es exactamente lo que un refinamiento arregla sin tocar estructura.

Conservar (ya son fuertes, NO tocar en esta pasada):
- Principio #2 (useful) puntuó 3 — Evidencia: la tarea primaria se completa en dos clics por el árbol o una pulsación por la paleta de comandos (index.html:451-454), sin acciones señuelo. Chequeo de regresión: abrir la app, pulsar Ctrl+P, tipear un código de asignatura y confirmar que sigue abriendo en un solo Enter; contar que no se agregaron controles nuevos a la superficie primaria.
- Principio #6 (honest) puntuó 3 — Evidencia: inventario completo de cadenas visibles en 01-evidence §C; cero superlativos, cero patrones oscuros, cero desajustes etiqueta→comportamiento (app.js:929, 1138, 1209, 1214, 1229, 1243, 1244, 1498). Chequeo de regresión: `grep -nE "'(loading|empty)'|class=\"(loading|empty)\"" app.js` debe seguir devolviendo las mismas 8 cadenas, sin texto nuevo de marketing.

Arreglar en orden de prioridad (movimientos textuales de la auditoría):
1. Principio #3 — aesthetic: Imponer una escala tipográfica y colapsar los 16 tamaños en 7 tokens. Reemplazar los `font-size` sueltos por una escala con razón fija expuesta como variables CSS; los once valores entre 9.5px y 15px se mapean a tres o cuatro pasos reales. Evidencia: 01-evidence §B «Escala tipográfica observada» — 9.5·10·10.5·11·11.5·12·12.5·13·13.5·14·15·17·21·24·27·30.
2. Principio #3 — aesthetic: Imponer una grilla de espacio de 4px y colapsar los 12 radios en 4 tokens. Todos los `padding` pasan a múltiplos de 4 vía tokens `--sp-*`; los radios se reducen a `--r-sm / --r-md / --r-lg / --r-full`. Eliminar los `2.5px` de `.switch`. Evidencia: 01-evidence §B «Espaciado — sin grilla»; index.html:369-372.
3. Principio #8 — thorough: Agregar `:focus-visible` a todos los controles y un estado `disabled`. Hoy rail, tabs, cards, filas del árbol y theme-cards son invisibles al teclado. Evidencia: index.html:178, :366, :407 (únicas 3 reglas de foco, todas sobre inputs); 0 ocurrencias de `disabled` en app.js e index.html.
4. Principio #9 — environmentally friendly: Respetar `prefers-reduced-motion` con un bloque @media que anule las 11 transiciones y el `translateY` del hover de card. Es el único requisito que separa este principio de un 3. Evidencia: 0 ocurrencias de `prefers-reduced-motion` contra 11 declaraciones `transition` en index.html.
5. Principio #1 + #3: Darle voz tipográfica propia en lugar de la sans del sistema. `--sans` resuelve a Segoe UI en Windows — la fuente por defecto del SO, y la razón principal por la que la interfaz se ve genérica. Cambiar a una familia con carácter, autoalojada para no romper el modo offline, y ajustar `letter-spacing` óptico en los tamaños grandes. Evidencia: index.html:18 (`--sans`), index.html:132 (`h1..h4` en serif).

Fuera de alcance de esta pasada:
- Cambiar el layout: rail, sidebar, tabbar, viewport y statusbar se quedan como están.
- Reducir los 14 temas de color (data.js:32-61) — son una preferencia deliberada del usuario.
- Reescribir el copy: puntuó 3/3.
- Cualquier cambio en app.js que no sea agregar clases o atributos de accesibilidad.

Entregables del plan:
- Por cada arreglo: archivos objetivo, cambio exacto, paso de verificación.
- Los tokens nuevos (tipo, espacio, radio, elevación) consolidados en un solo bloque `:root`, antes de los 14 bloques `html[data-theme=...]`, de modo que ningún tema tenga que redefinirlos.
- Checklist de regresión para los dos ítems de "Conservar".
- Verificación de que los 14 temas siguen renderizando: recorrer el selector de Configuración y confirmar que ninguno perdió contraste.

Anti-patrones a evitar:
- Agregar abstracciones nuevas donde alcanza un cambio directo (nada de un sistema de componentes: esto es CSS plano en un `<style>`).
- Reestilizar zonas que ya puntuaron 3 (la paleta de comandos, el copy de estados).
- Scope creep hacia rediseño estructural — si hay que mover el layout, esto deja de ser REFINE.
- Dejar que los arreglos muten principios fuera de la lista de prioridad.
````
