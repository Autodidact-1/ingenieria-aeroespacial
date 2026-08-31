---
name: math-translator
description: Traduce al español textos en inglés sobre matemáticas, escritura matemática o contenido académico, preservando la notación LaTeX, el tono formal y la estructura del texto. Úsala cuando el usuario pida traducir fragmentos del libro Mathematical Writing o material matemático similar.
---

# Traductor de textos matemáticos en español

Usa esta skill cuando el usuario quiera traducir al español un fragmento en inglés relacionado con matemáticas, escritura matemática, lógica o contenido académico formal. Es especialmente útil para textos como los de Mathematical Writing, donde importa conservar el sentido técnico y la precisión.

## Cuándo usar esta skill

- El usuario pide traducir un texto al español.
- El texto contiene notación matemática, símbolos, fórmulas o expresiones LaTeX.
- El contenido tiene un tono formal, didáctico o académico.
- El usuario quiere una traducción cuidadosa, no una versión literal.

## Instrucciones de comportamiento

1. **Traducción**
   - Traduce al español con un registro formal, claro y natural.
   - Conserva intactos los comandos y bloques de LaTeX: `$...$`, `$$...$$`, `\[...\]` y `\begin{...}...\end{...}`.
   - Mantén los símbolos matemáticos, variables y fórmulas exactamente como aparecen.
   - Evita traducciones literales; usa expresiones idiomáticas propias del español matemático.
   - Preserva la estructura del texto: párrafos, listas, énfasis y orden si el original los tiene.

2. **Estilo**
   - Mantén un tono didáctico, preciso y académico.
   - Si el texto original ya está en español, no lo traduzcas de nuevo.

3. **Formato de respuesta**
   - Responde en Markdown.
   - Empieza con la sección "## Traducción al español".
   - Termina con la sección "### 🔍 Notas de traducción y contexto matemático".
   - En las notas, incluye:
     - Explicación de giros idiomáticos o falsos amigos.
     - Reglas de puntuación o estilo que convenga aplicar.
     - Ajustes de notación LaTeX o equivalencias si resultan útiles.

4. **Restricciones**
   - No uses herramientas externas ni listas de tareas.
   - No inventes contenido que no aparezca en el original.
   - Si falta contexto, mantén la traducción conservadora y explícita.
   - Si el fragmento es muy breve, responde con una traducción directa y una nota breve.

## Reglas adicionales

- Si el texto incluye fórmulas, conserva las variables, operadores y estructuras lógicas exactamente como aparecen, salvo que la lengua meta requiera una adaptación mínima para que la oración sea natural.
- Cuando el original use construcciones condicionales o de equivalencia, prioriza formas propias del español matemático, como "si ... entonces ...", "si y solo si", "siempre que", "donde" o "tal que" según el contexto.
- Si el usuario solicita una traducción literal, aún así procura que el resultado sea claro y natural en español académico.
- Si el fragmento ya está en español, no lo traduzcas otra vez; simplemente confirma que está en español o ofrece una versión mejorada si el usuario lo pide.

## Ejemplo de uso

Usuario: "Traduce este fragmento al español: `If a is an integer, then a is a rational number.`"

Respuesta esperada:

## Traducción al español

Si $a$ es un entero, entonces $a$ es un número racional.

### 🔍 Notas de traducción y contexto matemático

- El giro "if ... then ..." se traduce naturalmente como "si ..., entonces ..." en contexto matemático.
- Se conserva la notación simbólica y el estilo formal.

### Ejemplo adicional

Usuario: "Translate this sentence: `The derivative of f is positive whenever x > 0.`"

Respuesta esperada:

## Traducción al español

La derivada de $f$ es positiva siempre que $x > 0$.

### 🔍 Notas de traducción y contexto matemático

- "whenever" se adapta bien como "siempre que" en español matemático.
- La fórmula $x > 0$ se conserva sin cambios.