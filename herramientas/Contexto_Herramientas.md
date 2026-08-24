# Contexto de Herramientas — Skills instaladas

**Última actualización:** Agosto 2026

Referencia rápida de las skills disponibles para el trabajo en la carrera. Ver [[Contexto_Carrera_Aeroespacial]] para la estructura de carpetas donde se guarda cada salida, y [[Contexto_Aprendizaje_IA]] para las reglas generales de colaboración.

---

## 1. Mapa Conceptual de Apuntes (`mapa-conceptual-apuntes`)

**Cuándo usar:** subís apuntes de una materia (`.md`, `.ipynb`, `.tex`) y pedís "hacé un mapa conceptual".

**Salida:** artifact HTML interactivo con nodos conectados por 4 capas:
- Jerarquía (tema → subtema → concepto)
- Prerrequisito explícito (marcado con `<!-- requiere: X -->` en los apuntes)
- Prerrequisito inferido (línea punteada, cuando una definición menciona un concepto anterior)
- Co-ocurrencia (grosor según frecuencia)

También genera `mapa-<materia>.datos.json` para conectar después con otras materias.

**Guardar en:** `<semestre>/<codigo>-<materia>/mapa-conceptual/`

## 2. Conector de Mapas Entre Asignaturas (`mapa-conceptual-interasignaturas`)

**Cuándo usar:** hay 2+ mapas de materias y se quiere ver cómo se relacionan.

**Inputs:** archivos `.html`/`.json` de los mapas, opcionalmente `red_correlativas_aeroespacial.html`.

**Salida:** artifact con vista general (cada materia como cluster, solo vínculos inter-materias) y vista detalle (click en un cluster expande su mapa completo).

**Tipos de conexión detectadas:** concepto compartido (automático), conexión explícita (la indica el usuario), prerrequisito entre materias (extraído automáticamente del archivo de correlativas).

**Guardar en:** `00-general/mapa-general/`

## 3. Guía de Repaso Pre-Parcial (`guia-repaso-preparcial`)

**Cuándo usar:** falta poco para un parcial/final y se quiere un resumen accionable.

**Inputs:** apuntes de la materia (o un rango de temas).

**Salida:** artifact HTML con idea central de cada tema, fórmulas clave, errores típicos, tipo de problema esperado, autoevaluación colapsable y checklist que persiste entre sesiones.

**Guardar en:** `<semestre>/<codigo>-<materia>/guia-repaso/`

## 4. Flashcards con Repaso Espaciado (`flashcards-repaso-espaciado`)

**Cuándo usar:** memorizar definiciones/fórmulas/teoremas de una materia.

**Salida:** artifact HTML con mazo interactivo, algoritmo SM-2 real (otra vez/difícil/bien/fácil), progreso persistente (storage local), exportable a Anki si se pide.

**Guardar en:** `<semestre>/<codigo>-<materia>/flashcards/`

## 5. Informe de Laboratorio (`informe-laboratorio`)

**Cuándo usar:** hay un TP experimental que armar con análisis de incertidumbre.

**Inputs:** datos experimentales (tabla, valores con error instrumental), objetivo del TP.

**Salida:** `.docx` con estructura de cátedra — carátula, objetivo, marco teórico, método, datos, análisis con propagación de error calculada paso a paso (SymPy), gráficos con barras de error, resultados con cifras significativas correctas, discusión/conclusión.

**Guardar en:** `<semestre>/<codigo>-<materia>/labos/`

## 6. Resumen de Papers Técnicos (`resumen-papers-aiaa`)

**Cuándo usar:** se sube o linkea un paper técnico (arXiv, DOI, revista) y se pide resumen.

**Salida:** ficha de lectura en Markdown (parafraseada, nunca copiada textualmente) — referencia completa, objetivo/pregunta de investigación, método, resultados clave, limitaciones, relevancia.

## 7. Gestor de Bibliografía (`gestor-bibliografia`)

**Cuándo usar:** se están juntando referencias (papers, libros, webs) para un informe/TFG.

**Inputs:** DOI, link, o datos manuales de una fuente.

**Salida:** `bibliografia.json` persistente con todas las referencias organizadas (IEEE o APA), formato de cita listo para pegar, compatible con el flujo de TFG.

## 8. Asistente de TFG/Tesis (`asistente-tfg`)

**Cuándo usar:** al empezar a escribir el Trabajo Final de Grado.

**Mantiene entre sesiones:** `estructura-tfg.md` (índice de capítulos y estado), `glosario-notacion.md` (símbolos usados, para no reusar con distinto significado), `bibliografia.json`.

**Funciones:** revisar consistencia de notación entre capítulos, sugerir redacción manteniendo el tono del resto del TFG, evitar contradicciones entre capítulos, generar el documento final en `.docx`.

---

## Workflow típico por tipo de tarea

**Generar mapa conceptual de una materia**
1. Subir apuntes (`.md`/`.ipynb`/`.tex`)
2. Pedir: "hacé un mapa conceptual de [Materia]"
3. Recibir `.html` interactivo + `.datos.json`
4. Guardar en `<semestre>/<codigo>-<materia>/mapa-conceptual/`

**Conectar mapas de varias materias**
1. Juntar los `.html`/`.json` de 2+ mapas
2. Pedir: "conectá estos mapas con correlativas"
3. Pasar también `red_correlativas_aeroespacial.html` (carga automática de prereqs por código)
4. Recibir `red-[tema].html` con vista general y detalle
5. Guardar en `00-general/mapa-general/`

**Prepararse para un parcial**
1. Subir apuntes relevantes
2. Pedir: "hacé una guía de repaso para el parcial de [Materia]"
3. Recibir guía con autoevaluación colapsable y checklist
4. Usar entre sesiones (el progreso se guarda)
5. Guardar en `<semestre>/<codigo>-<materia>/guia-repaso/`

**Armar un informe de laboratorio**
1. Reunir datos experimentales (tabla, errores instrumentales)
2. Pedir: "generá informe de labo de [Materia TP N]"
3. Pasar los datos en cualquier formato
4. Recibir `.docx` con propagación de error, gráficos con barras de error, cifras significativas correctas
5. Revisar y completar secciones que requieran análisis propio (discusión, conclusión)
6. Guardar en `<semestre>/<codigo>-<materia>/labos/`

**Gestionar bibliografía**
1. Al citar algo mientras se escribe, pasar el DOI/link o datos manuales
2. Pedir: "agregá esta referencia a la bibliografía"
3. Se guarda en `bibliografia.json` del proyecto, con la cita lista para pegar
4. Al final: "generá la bibliografía completa formateada (IEEE/APA)"

**Escribir el TFG**
1. Al empezar: "inicializá un proyecto de TFG para [tema]"
2. Se crean `estructura-tfg.md`, `glosario-notacion.md`, `bibliografia.json`
3. Cada sesión: pedir redacción de un capítulo o sección (se revisa consistencia contra capítulos anteriores)
4. Al terminar: "generá el documento final completo" → `.docx` listo para entregar

---

## Persistencia y sincronización

**Archivos que persisten entre sesiones:**
- `estructura-tfg.md`, `glosario-notacion.md`, `bibliografia.json` (en `tfg/`)
- `mapa-<materia>.datos.json` (por materia, para `mapa-conceptual-interasignaturas`)
- `red_correlativas_aeroespacial.html` (tracker + prereqs + estado de mapas conceptuales generados)
- Progreso en guías de repaso y flashcards (storage local del artifact)

**Antes de cada sesión nueva:**
1. Copiar los bloques "para copiar" de [[Contexto_Aprendizaje_IA]] y [[Contexto_Carrera_Aeroespacial]] si es una sesión importante.
2. Si se continúa trabajo previo (TFG, mapa de una materia), avisar explícitamente: "estoy continuando el TFG" o "voy a generar otro mapa de [Materia]".
3. Si se agregaron nuevas materias mapeadas, avisar para que la próxima red inter-asignaturas las incluya.

**Nota técnica:** usar storage local (`window.storage` / `localStorage` según el artifact), no depender de estado en memoria. Parafrasear siempre, nunca copiar textual de papers o libros.

---

**Próxima revisión recomendada:** cuando se instale o modifique una skill.
