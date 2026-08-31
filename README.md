# Ingeniería Aeroespacial — UNLP

Repositorio personal de apuntes, material de estudio y herramientas para la carrera de Ingeniería Aeroespacial (UNLP). Organiza el contenido por asignatura y semestre, e incluye una interfaz web local para navegarlo.

## Estructura

```
Asignaturas/           Apuntes y material por semestre y materia (código - nombre)
├── Nivelacion/
├── 1° Semestre/ … 10° Semestre/
└── Libreria/           Recursos transversales a varias materias

Material Matematico/   Libros de redacción matemática, cuadernillos en PDF y notebooks de Jupyter

Apuntes-Markdown-Avanzado/  Guía de referencia de sintaxis Markdown (tablas, LaTeX, Mermaid, etc.)

general/
├── correlativas/       Red de correlativas de la carrera (HTML interactivo)
└── mapa general/

herramientas/
├── workspace/           Interfaz web (Aula) para navegar el material del repo
└── Skills/               Skills de Claude para tareas de estudio (resúmenes, flashcards, etc.)

Servidor-interfaz.cmd   Levanta un servidor local y abre la interfaz Aula
```

Cada materia sigue la convención `CÓDIGO - nombre` y suele contener subcarpetas como `apuntes/` y `material/`.

## Uso

Para explorar el material desde la interfaz web (Aula):

1. Ejecutar `Servidor-interfaz.cmd` (Windows).
2. Se abre automáticamente `http://127.0.0.1:8777/herramientas/workspace/index.html`.
3. El servidor solo escucha en `127.0.0.1`, no expone nada fuera de la máquina.

Requiere tener Python instalado y accesible en el `PATH`.

## Notas

- Algunos PDF del material bibliográfico superan los 50 MB; GitHub recomienda migrarlos a Git LFS si el repositorio sigue creciendo.
- El contenido es de uso personal para el cursado de la carrera.
