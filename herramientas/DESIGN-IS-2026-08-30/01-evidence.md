# 01 · Evidencia

Todo lo de abajo son hechos medidos sobre el código, no opiniones. Sin puntaje.

---

## A. Evidencia estructural

| Métrica | Valor | Fuente |
|---|---|---|
| Vistas en el rail | 6 botones, todos icon-only | `app.js:182-191` |
| Botones del rail con `title` | 6/6 (incluye atajo `Ctrl+N`) | `app.js:188` |
| Atributos `aria-*`, `role=`, `tabindex` en todo el proyecto | **0** | `app.js`, `index.html` |
| Reglas `:focus` en el CSS | **3**, todas sobre inputs | `index.html:178`, `:366`, `:407` |
| Reglas `:focus-visible` | **0** | `index.html` |
| Estado `disabled` (CSS o JS) | **0 ocurrencias** | `app.js`, `index.html` |
| Sets de reglas de math casi duplicados | 2 pares: `.math`/`.math-block` y `.math-src`/`.math-src-block` | `index.html:264-268`, `:277-281` |

**Estados presentes** (8 sitios de render):

- vacío — `app.js:929`, `:1214`, `:1243`, `:1244`, `:1498`
- cargando — `app.js:1138`, `:1209`
- error — `app.js:1229`
- foco visible — **ausente** en botones, tabs, cards, filas del árbol y theme-cards
- deshabilitado — **ausente**

---

## B. Evidencia visual

### Escala tipográfica observada — 16 tamaños distintos

```
9.5 · 10 · 10.5 · 11 · 11.5 · 12 · 12.5 · 13 · 13.5 · 14 · 15 · 17 · 21 · 24 · 27 · 30
```

Once de los dieciséis valores caen entre 9.5 px y 15 px, en pasos de medio píxel. No hay razón de escala (ni 1.125, ni 1.2, ni 1.25). Fuente: `index.html`, extraído de todas las declaraciones `font-size`.

### Pesos tipográficos — 3 en total

`400` (implícito) · `600` (×9) · `700` (×1, en `.chip`). No hay peso intermedio para jerarquía secundaria.

### Familias

- `--sans: ui-sans-serif, -apple-system, "Segoe UI", Helvetica, Arial` — `index.html:18`. En Windows resuelve a **Segoe UI**, la tipografía por defecto del sistema operativo.
- `--serif: ui-serif, Georgia, "Iowan Old Style", "Palatino Linotype"` — `index.html:17`, aplicada a `h1..h4` en `index.html:132`.

### Radios de borde — 12 valores distintos

```
2 · 4 · 5 · 6 · 7 · 8 · 9 · 10 · 11 · 12 · 14 · 99
```

Cubre casi todos los enteros entre 4 y 12. Fuente: `index.html`, todas las declaraciones `border-radius`.

### Espaciado — sin grilla

Valores de `padding` observados, todos únicos o casi:

```
1px 5px · 1px 6px · 0 4px · 4px 12px · 6px · 6px 10px · 6px 12px 10px
7px 6px · 7px 10px · 7px 11px · 7px 13px · 8px 0 · 8px 11px · 8px 12px
9px 10px 10px · 9px 14px · 14px · 40px 44px 120px · 60px 32px
```

Más `top:2.5px; left:2.5px` y `left:19.5px` en `.switch` (`index.html:369-372`). No hay múltiplos consistentes de 4 ni de 8.

### Color

- **181 valores hexadecimales distintos** en el CSS — corresponden a 14 bloques `html[data-theme=...]` (`index.html:9-124`), ~13 tokens cada uno. Es un sistema de temas, no ruido, pero **no hay tokens de elevación** (superficie base / elevada / flotante se resuelven ad-hoc con `--paper`, `--panel`, `--bg`).
- Colores de área de asignatura: 8 valores en `data.js:16-25`, saturados en esta misma sesión.

### Movimiento

- **11 declaraciones `transition`** en el CSS.
- **0 ocurrencias de `prefers-reduced-motion`.**
- Animación en reposo: **0** (nada se mueve sin interacción del usuario).
- Hover de `.card`: `translateY(-2px)` + `box-shadow 0 6px 18px rgba(0,0,0,.28)` — `index.html:319`.

---

## C. Copy y honestidad

Cadenas visibles al usuario, muestreo completo de las de estado:

| Cadena | Ubicación |
|---|---|
| «Sin recomendaciones cargadas para esta materia.» | `app.js:929` |
| «Todavía no escaneaste las carpetas de apuntes.» | `app.js:1138` |
| «Buscando en Open Library…» | `app.js:1209` |
| «Sin resultados.» | `app.js:1214` |
| «No pude consultar Open Library (…).» | `app.js:1229` |
| «Todavía no indexaste. Tocá «Reindexar» para recorrer todas las carpetas material/.» | `app.js:1243` |
| «Necesitás el servidor local para leer tus carpetas.» | `app.js:1244` |
| «Nada coincide.» | `app.js:1498` |
| «Ir a archivo o asignatura…» | `index.html:452` |
| «Explorador» | `index.html:442` |
| Título del documento: «Centro de recursos academicos - Ingenieria Aeroespacial UNLP» | `index.html:6` |

- **Superlativos de marketing sin respaldo:** ninguno.
- **Patrones oscuros** (continuidad forzada, costo oculto, escasez falsa, confirmshaming): ninguno.
- **Jerga o etiquetas confusas:** ninguna. Todo el copy es español rioplatense llano y describe exactamente lo que pasa.
- **Desajustes etiqueta→comportamiento:** ninguno detectado.
- Nota menor: el `<title>` va sin tildes («academicos», «Ingenieria») mientras el resto de la app sí las usa.

---

## D. Peso y fricción

| Métrica | Valor | Método |
|---|---|---|
| JS inicial | **93 KB** (`app.js` 70 505 B + `data.js` 23 050 B) | `du -b` |
| HTML + CSS | 25 600 B, CSS embebido (0 requests extra) | `du -b` |
| KaTeX | 555 KB, cargado con `defer` (`index.html:456`) | `du -b vendor` |
| Requests para la vista primaria | 4 (html, css katex, data.js, app.js) + fuentes KaTeX bajo demanda | `index.html:7,456-458` |
| Time-to-interactive | Estimado <100 ms — todo local, sin red, sin build, sin framework | inferido |
| Animaciones en reposo | **0** | grep de `animation` / `@keyframes` |
| Notificaciones / badges / modales al cargar | **0** (el overlay arranca en `display:none`, `index.html:411`) | `index.html:411-413` |

---

## E. Accesibilidad

| Chequeo | Resultado |
|---|---|
| Landmarks ARIA | `<nav>`, `<aside>`, `<main>` presentes (`index.html:440,441,445`); **0 atributos `role` o `aria-*` explícitos** |
| Skip-link | **Ausente** |
| Foco visible en controles primarios | **Ausente** — rail, tabs, cards, filas del árbol y theme-cards no tienen ninguna regla de foco |
| Foco visible en inputs | Presente (3 reglas: `index.html:178`, `:366`, `:407`) |
| Alcanzable por teclado | Los `<button>` del rail sí (son botones nativos); las cards y filas del árbol son `<div>` con `onclick` → **no alcanzables** |
| `prefers-reduced-motion` | **No respetado** (11 transiciones activas siempre) |

---

## Huecos conocidos

- No se midió contraste computado en vivo (no se levantó el servidor durante la auditoría); las cifras de color son las declaradas en los tokens, no las renderizadas. Marcadas como inferidas donde corresponde.
- No se auditaron los 14 temas uno por uno; la evidencia visual se tomó sobre el tema por defecto (`dark`, «Papel nocturno»).
