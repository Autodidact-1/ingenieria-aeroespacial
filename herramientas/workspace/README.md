# Ingeniería Aeroespacial

Interfaz local para administrar todo el material de la carrera: carpetas de
asignaturas, apuntes, prácticas, libros, mapas conceptuales y la red de
correlativas. No tiene login, ni cuentas, ni datos privados: es HTML, CSS y
JavaScript planos leyendo las carpetas reales del repositorio.

## Cómo se abre

```bash
abrir-aula.cmd
```

Está en la raíz del proyecto. Levanta `python -m http.server 8777 --bind 127.0.0.1`
sobre la raíz del repositorio y abre la interfaz en el navegador. Dejá esa ventana
abierta mientras la usás; `Ctrl+C` la cierra.

**Por qué hace falta un servidor.** Un navegador no puede listar el contenido de
una carpeta cuando la página se abre con doble clic (`file://`). Con el servidor
local, el listado de directorios llega como HTML y la interfaz lo interpreta: por
eso ves los archivos reales, y aparecen solos cuando agregás uno con el
explorador de Windows o con VS Code. Si abrís `index.html` directamente vas a ver
la estructura del plan de estudios, pero las carpetas figuran vacías.

## Las cinco secciones

| Sección | Qué hace |
|---|---|
| **Explorador** | Árbol semestre → asignatura → `material/` `apuntes/` `practica/` → archivos, sobre las carpetas reales. Doble clic (o clic derecho) en una asignatura abre su ficha. |
| **Red de asignaturas** | Columnas por semestre con las flechas de correlatividad, a todo el ancho y sin panel lateral. Vive dentro de esta misma página: no hay archivo aparte ni iframe. Al abrirla recorre las columnas hasta el semestre en curso; escala, modo desbloqueo y exportación se manejan desde Configuración. |
| **Mapas conceptuales** | Mapa inter-asignaturas por área temática, e índice de qué materias ya tienen mapa. |
| **Librería** | Libros locales indexados desde `Asignaturas/Libreria/` (la carpeta única de bibliografía, que también aparece arriba del árbol del Explorador), bibliografía recomendada por materia y búsqueda en el catálogo abierto de Open Library. |
| **Configuración** | Tema, tipografía, ancho del panel, animaciones, escala y modo desbloqueo de la Red de asignaturas, estado del servidor, índices y exportar/importar el progreso. |

## Qué archivos sabe mostrar

- **PDF** y **HTML** — en el visor propio del navegador.
- **Markdown** — renderizado (encabezados, listas, tablas, citas, código, imágenes)
  **con fórmulas compuestas**: `$…$` en línea y `$$…$$` en bloque pasan por KaTeX.
- **Jupyter Notebook** — celdas de markdown y de código con sus salidas de texto,
  errores e imágenes PNG.
- **LaTeX** (`.tex`) — índice de `\chapter`/`\section`/`\subsection`, las ecuaciones
  del documento compuestas con KaTeX, y la fuente completa.
- **Imágenes** (PNG, JPG, SVG, WebP, GIF).
- Código y texto plano (`.py`, `.json`, `.csv`, `.txt`, `.bib`, …).

## Fórmulas

Las fórmulas se componen con **KaTeX 0.18.4**, vendorizado en `vendor/katex/` —
no hay CDN, así que funciona sin internet. Son unos 610 kB: el JS, el CSS y las
20 fuentes `woff2` (se descartaron los `.woff` y `.ttf`, que ningún navegador
actual llega a pedir). La licencia MIT de KaTeX está en `vendor/katex/LICENSE`.

Funciona en los tres lugares donde aparece matemática: apuntes Markdown, celdas
markdown de los notebooks, y los `.tex` de `material/`. Para los `.tex` no hay
compilación completa de LaTeX: se extraen y componen los entornos `equation`,
`align`, `gather`, `multline` y `aligned`, más `\[…\]` y `$$…$$`, y la fuente
queda igual debajo.

El color de las fórmulas sale del tema activo, así que se leen bien en las 13
paletas. Si una fórmula tiene un error de sintaxis se marca en rojo en su lugar
sin romper el resto del documento.

Hay macros propias en `MATH_MACROS`, dentro de `app.js`: `\R \N \Z \C` para los
conjuntos, `\dd` para el diferencial, y `\deriv{u}{x}` / `\pderiv{u}{x}` para
derivadas. Agregá ahí las que uses.

Desde Configuración se puede apagar la composición y volver a ver la fuente
LaTeX en monoespaciado, que es como se veía antes.

## Atajos

| | |
|---|---|
| `Ctrl+P` | buscar archivo, asignatura o vista |
| `Ctrl+1…5` | cambiar de sección |
| `Ctrl+B` | plegar la barra lateral (Librería y Configuración no la tienen) |
| `Ctrl+W` | cerrar la vista actual y volver al inicio |

## Temas de color

Hay 15 paletas, elegibles desde Configuración con una miniatura de cada una:
**Windows 11** (el tema por defecto), **Papel nocturno** (el original), **Papel claro**,
**Hangar**, **Vuelo nocturno**, **Nebulosa**, **Cabina**, **Altímetro**, **Nórdico**,
**Plano técnico**, **Solarizado oscuro**, **Solarizado claro**, **Amanecer**,
**Alto contraste** y **Carmesí**.

El tema alcanza también a la Red de asignaturas: es una vista más de la interfaz
y usa los mismos tokens, así que se repinta sola. La copia que exportás desde
Configuración se lleva los colores del tema que tengas puesto en ese momento.

Cada tema es un bloque `html[data-theme="id"]` en `index.html` que redefine las
mismas ~19 variables, y una entrada en `THEMES` dentro de `data.js` con el nombre
y los colores de la miniatura. Agregar uno propio es escribir esas dos cosas.

## Dónde viven los datos

Todo lo que marcás se guarda en el `localStorage` de tu navegador, nunca sale de
la máquina. El progreso de materias aprobadas usa la **misma clave** que la red de
correlativas (`aero_passed_claude_dark`), así que lo que marques en una vista
aparece en la otra. Desde Configuración podés exportarlo a JSON e importarlo en
otra máquina.

Los índices de libros y de mapas se construyen recorriendo las carpetas cuando
tocás «Reindexar» o «Escanear»; no se actualizan solos.

## Editar el plan de estudios

Todo el contenido declarativo está en [`data.js`](data.js): asignaturas, código,
semestre, correlativas, horas, área temática, la ruta real de la carpeta en disco
(`dir`), los conceptos clave que alimentan el mapa, y la lista de libros
recomendados. Si renombrás una carpeta en el disco, actualizá su `dir` y listo.

`app.js` es la aplicación; `index.html` es la cáscara y todo el CSS. No hay
dependencias externas ni proceso de compilación: se edita y se recarga.
