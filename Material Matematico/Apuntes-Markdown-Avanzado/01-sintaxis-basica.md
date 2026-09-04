# 01 · Sintaxis básica (repaso)

Este archivo repasa lo que ya dominas, pero mostrando variantes que quizá no
conocías.

## Títulos

```markdown
# Título 1
## Título 2
### Título 3
#### Título 4
```

También existe la forma "subrayada", solo para H1 y H2:

```markdown
Título 1
========

Título 2
--------
```

## Énfasis

| Sintaxis | Resultado |
|---|---|
| `*cursiva*` o `_cursiva_` | *cursiva* |
| `**negrita**` o `__negrita__` | **negrita** |
| `***negrita y cursiva***` | ***negrita y cursiva*** |
| `~~tachado~~` | ~~tachado~~ |
| `` `código en línea` `` | `código en línea` |
| `==resaltado==` (solo Obsidian / algunos renderizadores) | ==resaltado== |

## Listas

Lista no ordenada:

```markdown
- Elemento 1
- Elemento 2
  - Sub-elemento 2.1
  - Sub-elemento 2.2
```

Lista ordenada:

```markdown
1. Primero
2. Segundo
3. Tercero
```

## Citas (blockquotes)

```markdown
> Esto es una cita.
>
> Puede tener varios párrafos.
>> Y citas anidadas.
```

> Esto es una cita.
>
>> Y una cita anidada dentro.

## Líneas horizontales

Cualquiera de estas tres funciona igual:

```markdown
---
***
___
```

---

## Escapar caracteres especiales

Si necesitas mostrar un carácter que Markdown interpreta (`*`, `_`, `#`, `` ` ``),
antepón una barra invertida:

```markdown
\*esto no es cursiva\*
```

\*esto no es cursiva\*
