# Contexto de la Carrera — Ingeniería Aeroespacial UNLP

**Última actualización:** Agosto 2026

---

## Datos generales

- **Carrera:** Ingeniería Aeroespacial
- **Institución:** Facultad de Ingeniería, Universidad Nacional de La Plata (UNLP)
- **Plan de estudios:** Plan 2018 — 47 materias en 10 semestres, 3944 horas académicas totales
- **Situación actual:** segundo año, terminando semestres 3-4, próximo es 5to semestre

## Materias por área

### Ciencias Básicas (CB)
Matemática para Ingeniería, Matemática A/B/C/D, Física I/II, Probabilidades y Estadística, Química para Ingeniería, Introducción a Programación y Análisis Numérico.

### Tecnologías Básicas (TB)
Estructuras I/II, Materiales, Materiales Aeroespaciales, Ensayos no Destructivos, Termodinámica, Mecánica Racional, Electrotecnia y Sistemas Eléctricos, Mecánica de Fluidos I/II.

### Tecnologías Aplicadas (TA)
Mecanismos y Sistemas, Estructuras III/IV/V, Sistemas Dinámicos, Motores a Reacción, Aerodinámica y Mecánica de Vuelo I/II, Procesos de Fabricación, Mediciones e Instrumentos, Aeropuertos y Operaciones, Control y Guiado, Talleres y Mantenimiento, Sistemas y Equipos, Motores Alternativos, Optativa, PPS.

### Complementarias (CO)
Introducción a Ing. Aeroespacial, Actividades de Formación Complementaria (I-V), Economía para Ingenieros, Electiva Humanística, Ingeniería Legal.

## Objetivos

**Corto plazo (este trimestre)**
- Aprobar todas las asignaturas a tiempo y forma
- Adelantarse en contenido para dedicar tiempo a proyectos personales
- Mejorar habilidades de análisis y documentación

**Mediano plazo**
- Mapear conceptualmente cada materia cursada
- Monetizar avances académicos y proyectos personales
- Consolidar base técnica en ingeniería aeroespacial e industria digital

**Largo plazo**
- Hacer el TFG con rigor académico y buena documentación
- Aplicar ingeniería aeroespacial a proyectos reales o investigación

## Estructura de carpetas

```
carrera-aeroespacial/
│
├── 00-general/
│   ├── correlativas/
│   │   └── red_correlativas_aeroespacial.html
│   ├── mapa-general/
│   │   ├── red-aeroespacial.html
│   │   └── red-aeroespacial.datos.json
│   └── README.md
│
├── 00-nivelacion/
│   └── D1001-matematica-para-ingenieria/
│       ├── apuntes/
│       ├── mapa-conceptual/
│       ├── flashcards/
│       └── guia-repaso/
│
├── 01-1er-semestre/
│   ├── F1301-matematica-a/
│   ├── M1602-grafica-para-ingenieria/
│   └── A1101-introduccion-ing-aeroespacial/
│
├── 02-2do-semestre/
│   ├── F1302-matematica-b/
│   ├── F1303-fisica-i/
│   └── U1901-quimica-para-ingenieria/
│
├── 03-3er-semestre/
│   ├── F1304-matematica-c/
│   ├── F1305-fisica-ii/
│   └── F1315-probabilidades-estadistica/
│
├── 04-4to-semestre/
│   ├── F1306-matematica-d/
│   ├── F1316-intro-prog-analisis-numerico/
│   ├── C1151-estructuras-i/
│   └── M1603-materiales/
│
├── 05-5to-semestre/
│   ├── A1102-materiales-aeroespaciales/
│   ├── A1006-ensayos-no-destructivos/
│   ├── M1604-termodinamica/
│   ├── C1153-estructuras-ii/
│   └── A1009-mecanica-racional/
│
├── 06-6to-semestre/
│   ├── A1010-electrotecnia-sistemas-electricos/
│   ├── A1011-mecanica-fluidos-i/
│   ├── A1016-mecanismos-sistemas/
│   ├── A1008-estructuras-iii/
│   └── DA200-actividad-formacion-comp-i/
│
├── 07-7mo-semestre/
│   ├── A1013-estructuras-iv/
│   ├── A1015-mecanica-fluidos-ii/
│   ├── A1012-sistemas-dinamicos/
│   ├── P1752-economia-ingenieros/
│   ├── S0001-electiva-humanistica/
│   └── DA300-actividad-formacion-comp-ii/
│
├── 08-8vo-semestre/
│   ├── A1017-motores-reaccion/
│   ├── A1018-aerodinamica-mecanica-vuelo-i/
│   ├── A1019-procesos-fabricacion/
│   ├── A1014-estructuras-v/
│   ├── P1759-ingenieria-legal-ejercicio-profesional/
│   └── DA400-actividad-formacion-comp-iii/
│
├── 09-9no-semestre/
│   ├── A1020-motores-alternativos/
│   ├── A1022-aerodinamica-mecanica-vuelo-ii/
│   ├── A1021-mediciones-instrumentos/
│   ├── A1028-aeropuertos-operaciones-vuelo/
│   └── DA500-actividad-formacion-comp-iv/
│
├── 10-10mo-semestre/
│   ├── A1023-control-guiado/
│   ├── A1024-talleres-mantenimiento/
│   ├── A1026-sistemas-equipos/
│   ├── A1025-optativa/
│   ├── DA600-actividad-formacion-comp-v/
│   └── A1034-pps-practica-profesional-supervisada/
│
├── tfg/
│   ├── estructura-tfg.md
│   ├── glosario-notacion.md
│   ├── bibliografia.json
│   ├── capitulos/
│   └── borrador-tesis.docx
│
└── README.md (índice general)
```

Dentro de cada materia, siempre:
```
<codigo>-<nombre>/
├── apuntes/          ← .md / .ipynb / .tex originales (fuente de verdad)
├── mapa-conceptual/
│   ├── mapa-<materia>.html
│   └── mapa-<materia>.datos.json
├── flashcards/
│   └── flashcards-<materia>.html
├── guia-repaso/
│   └── guia-repaso-<materia>.html
├── labos/            ← si la materia tiene laboratorio
│   └── informe-<tp>.docx
└── bibliografia.json ← si hay papers propios de la materia
```

## Archivos clave del proyecto

- `00-general/correlativas/red_correlativas_aeroespacial.html` — tracker de avance de materias + datos de prerrequisitos por código. Permite marcar aprobadas y ahora también trackear qué materias tienen mapa conceptual generado (ver [[Contexto_Herramientas]]).
- `tfg/` — estructura, glosario y bibliografía del Trabajo Final de Grado.

## Bloque para copiar al iniciar sesión

```
=== CONTEXTO DE CARRERA ===
Ingeniería Aeroespacial, UNLP, Plan 2018 (47 materias, 10 semestres, 3944 hs totales).
Situación: 2do año, terminando semestres 3-4, próximo 5to semestre.

OBJETIVOS: aprobar a tiempo | mapear conceptualmente cada materia | documentar bien para TFG | avanzar en proyectos personales

ARCHIVOS CLAVE:
- red_correlativas_aeroespacial.html (tracker de avance + prereqs + estado de mapas conceptuales)
- tfg/ (estructura-tfg.md, glosario-notacion.md, bibliografia.json)
=== FIN CONTEXTO ===
```

---

**Próxima revisión recomendada:** fin de trimestre, o al pasar de semestre.
