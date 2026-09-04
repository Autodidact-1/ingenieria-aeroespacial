# 06 · HTML embebido y extras

Markdown permite mezclar HTML directamente cuando necesitas algo que la
sintaxis pura no ofrece.

## Secciones plegables (`<details>`)

Muy útil para ocultar soluciones o contenido opcional en apuntes de estudio.

```markdown
<details>
<summary>Haz clic para ver la solución</summary>

$$
\Delta v = 9.4 \text{ km/s}
$$

</details>
```

<details>
<summary>Haz clic para ver la solución</summary>

$$
\Delta v = 9.4 \text{ km/s}
$$

</details>

## Salto de línea forzado

Un párrafo normal no respeta los saltos de línea simples. Para forzar uno,
termina la línea con **dos espacios** o usa `<br>`:

```markdown
Primera línea.  
Segunda línea (dos espacios al final de la anterior).

Primera línea.<br>
Segunda línea (con &lt;br&gt;).
```

## Texto de color o tamaño (HTML puro, no todos los renderizadores lo permiten)

```markdown
<span style="color:red">Texto en rojo</span>
<span style="font-size:20px">Texto grande</span>
```

## Comentarios (invisibles en el renderizado)

```markdown
<!-- Esto es un comentario, no aparece en la vista previa -->
```

<!-- Este comentario no se ve al renderizar el archivo -->

## Subíndices y superíndices (HTML, ya que Markdown puro no los soporta)

```markdown
H<sub>2</sub>O, E = mc<sup>2</sup>
```

H<sub>2</sub>O, E = mc<sup>2</sup>

(Alternativa en LaTeX, más natural en apuntes técnicos: `$H_2O$`, `$E = mc^2$`)

$H_2O$, $E = mc^2$

## Tabla con celdas combinadas (solo vía HTML, Markdown no soporta `colspan`)

```html
<table>
  <tr><th colspan="2">Fase de vuelo</th></tr>
  <tr><td>Ascenso</td><td>Órbita</td></tr>
</table>
```

<table>
  <tr><th colspan="2">Fase de vuelo</th></tr>
  <tr><td>Ascenso</td><td>Órbita</td></tr>
</table>
