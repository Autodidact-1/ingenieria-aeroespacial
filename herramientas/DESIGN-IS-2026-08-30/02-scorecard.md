# 02 · Scorecard

Diez principios, 0–3 cada uno, peso igual. Regla de desempate aplicada: ante la duda, el puntaje más bajo. Regla de la peor instancia: cuando un principio tiene varios ejemplos, se puntúa el peor.

---

**1. Good design is innovative — 2/3**
Evidencia: shell tipo VS Code trasladado casi literal — rail de 52 px (`index.html:144-155`), tabbar con barra de acento `::after` (`index.html:212`), statusbar de 24 px (`index.html:219`), paleta Ctrl+P (`index.html:451-454`). Sobre eso, el grafo de correlativas (`app.js:1032-1045`) y el árbol por semestre son una mejora real y específica del dominio.
Justificación: refresca un patrón existente con una mejora clara para el dominio, pero no introduce una forma que no exista en cinco productos pares — es un 2, no un 3.

**2. Good design makes a product useful — 3/3**
Evidencia: la tarea primaria se completa en dos clics por el árbol, o en una pulsación por la paleta de comandos (`index.html:451-454`). No hay acciones señuelo en la superficie primaria. El estado «Necesitás el servidor local» (`app.js:1244`) es un límite ambiental reportado con honestidad, y el proyecto envía `Servidor-interfaz.cmd` como ruta prevista.
Justificación: la tarea primaria se completa en la menor cantidad de pasos posible y nada compite con ella.

**3. Good design is aesthetic — 1/3**
Evidencia: 16 tamaños de fuente distintos, once de ellos apretados entre 9.5 px y 15 px en pasos de medio píxel; 12 radios de borde que cubren casi todos los enteros del 4 al 12; paddings sin grilla (`9px 10px 10px`, `7px 6px`, `6px 12px 10px`, y `2.5px` en `.switch`, `index.html:369`). Ver 01-evidence §B.
Justificación: hay muchas más de cinco inconsistencias y no existe una escala visible de tipo ni de espacio — no llega a 2; no es 0 porque sí hay un sistema de color coherente y un lenguaje de tarjeta consistente.

**4. Good design makes a product understandable — 2/3**
Evidencia: el copy es español llano y exacto (01-evidence §C), y el árbol espeja la estructura real en disco. Pero la navegación primaria son seis botones icon-only cuya única desambiguación es el `title` nativo (`app.js:188`).
Justificación: el ancla de 2 es «un control necesita tooltip»; acá son seis los que lo necesitan, aunque lo tengan. Por peor instancia, 2.

**5. Good design is unobtrusive — 2/3**
Evidencia: paleta apagada, bordes de 1 px, cero animación en reposo. En contra: cada card se levanta 2 px con sombra de 18 px al pasar el mouse (`index.html:319`), y el estado activo del rail apila tres señales simultáneas — color, fondo y barra lateral de 2 px (`index.html:153-154`).
Justificación: el chrome se ve pero es callado; no llega a receder del todo detrás del contenido.

**6. Good design is honest — 3/3**
Evidencia: inventario completo de cadenas en 01-evidence §C. Cero superlativos sin respaldo, cero patrones oscuros, cero desajustes entre etiqueta y comportamiento. Los estados de fallo dicen exactamente qué falló y qué hacer (`app.js:1229`, `:1243`, `:1244`).
Justificación: cada afirmación y etiqueta mapea 1:1 con el comportamiento real.

**7. Good design is long-lasting — 2/3**
Evidencia: la base es atemporal (sans del sistema, Georgia para títulos, bordes planos, sin gradientes). El marcador fechado es el selector de 14 temas con tarjetas de vista previa y nombres de fantasía — «Nebulosa», «Carmesí», «Vuelo nocturno» (`data.js:32-61`), un tic de herramienta de desarrollo de los 2020.
Justificación: un solo marcador fechado.

**8. Good design is thorough down to the last detail — 1/3**
Evidencia: vacío, cargando y error están presentes y bien redactados (8 sitios, 01-evidence §A). Faltan tres estados: `:focus-visible` en cualquier control (solo 3 reglas `:focus`, todas sobre inputs — `index.html:178`, `:366`, `:407`), `disabled` (0 ocurrencias en todo el proyecto), y `prefers-reduced-motion` (0 ocurrencias contra 11 transiciones).
Justificación: faltan tres estados — cae exactamente en el ancla de 1.

**9. Good design is environmentally friendly — 2/3**
Evidencia: 93 KB de JS inicial, por debajo del umbral de 100 KB; KaTeX diferido; cero animación en reposo; modo oscuro honrado con 14 temas.
Justificación: cumple todo el ancla de 3 salvo un requisito explícito — `prefers-reduced-motion` no se respeta. Por eso 2 y no 3.

**10. Good design is as little design as possible — 2/3**
Evidencia: `.math`/`.math-block` (`index.html:264-268`) y `.math-src`/`.math-src-block` (`index.html:277-281`) son dos pares de reglas casi idénticas para el mismo propósito, sobrevivientes de antes de que entrara KaTeX. La statusbar (`index.html:219-226`) es el otro candidato, pero su punto de conexión al servidor sí informa algo que no está en ningún otro lado y es determinante para esta app.
Justificación: dos elementos removibles reales (los dos pares de math colapsan en uno) — ancla de 2.

---

## Total: **20 / 30**

| # | Principio | Puntaje |
|---|---|---|
| 1 | innovative | 2 |
| 2 | useful | **3** |
| 3 | aesthetic | **1** |
| 4 | understandable | 2 |
| 5 | unobtrusive | 2 |
| 6 | honest | **3** |
| 7 | long-lasting | 2 |
| 8 | thorough | **1** |
| 9 | environmentally friendly | 2 |
| 10 | as little design as possible | 2 |
| | **Total** | **20/30** |
