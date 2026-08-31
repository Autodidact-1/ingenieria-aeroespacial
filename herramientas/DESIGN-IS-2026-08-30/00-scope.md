# 00 · Alcance de la auditoría

**Fecha:** 2026-08-30
**Rama:** `feat/aula-workspace`

## Qué se audita

| Item | Valor |
|---|---|
| Superficie | `00 - general/workspace/index.html` (460 líneas, CSS embebido líneas 8–436) |
| Lógica de render | `00 - general/workspace/app.js` (1553 líneas) |
| Datos | `00 - general/workspace/data.js` (306 líneas) |
| Ejecución | Servidor local vía `Servidor-interfaz.cmd`; degrada a `file://` |
| Vendor | `vendor/katex/` (555 KB, `defer`) |

## Usuario y tarea primaria

- **Usuario primario:** un estudiante de Ingeniería Aeroespacial (UNLP) — usuario único, uso local, sesiones largas de lectura.
- **Tarea primaria:** encontrar y abrir el material de una asignatura del plan de estudios, y entender cómo esa asignatura se conecta con sus correlativas.

## Restricciones

- Sin build step, sin framework, sin red obligatoria. HTML + CSS + JS plano.
- Debe funcionar offline.
- 14 temas de color ya existentes deben seguir funcionando.
- **Alcance elegido por el usuario:** refinar lo existente. Mantener layout y estructura (rail, sidebar, tabs, statusbar); trabajar tipografía, espaciado, color, densidad y micro-detalles.

## Referencias implícitas

El shell imita el patrón de VS Code / editores de código: rail de iconos de 52 px, árbol de archivos, tabbar con pestañas cerrables, statusbar de 24 px, paleta de comandos con Ctrl+P.

## No auditado

- Contenido de los apuntes en sí (fuera de la superficie de UI).
- El servidor `.cmd` (no es superficie de diseño).
