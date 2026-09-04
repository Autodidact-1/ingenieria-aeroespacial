# 04 · Enlaces, imágenes, notas al pie y referencias

## Enlaces

```markdown
[Texto del enlace](https://ejemplo.com)
[Enlace con título](https://ejemplo.com "Se muestra al pasar el mouse")
[Enlace a otro archivo del apunte](03-codigo-y-matematicas.md)
[Enlace a una sección dentro del mismo archivo](#enlaces)
```

[Enlace a otro archivo del apunte](03-codigo-y-matematicas.md)

## Enlaces por referencia (útiles si repites el mismo enlace muchas veces)

```markdown
Consulta la [documentación oficial][doc] o el [repositorio][doc].

[doc]: https://ejemplo.com "Documentación"
```

## Imágenes

```markdown
![Texto alternativo](ruta/a/la/imagen.png)
![Diagrama con título](ruta/a/la/imagen.png "Diagrama del cohete")
```

Puedes envolver la imagen en un enlace para que sea clicable:

```markdown
[![Texto alt](imagen.png)](https://ejemplo.com)
```

## Notas al pie (footnotes)

Soportado en GitHub, Obsidian, Pandoc y VSCode (extensión Markdown All in One).

```markdown
La velocidad de escape de la Tierra es de ~11.2 km/s[^1].

[^1]: Calculada con $v_e = \sqrt{2GM/R}$.
```

La velocidad de escape de la Tierra es de ~11.2 km/s[^1].

[^1]: Calculada con $v_e = \sqrt{2GM/R}$.

## Autoenlaces

```markdown
<https://ejemplo.com>
<correo@ejemplo.com>
```

## Anclas manuales para saltar a un punto exacto (útil en apuntes largos)

```markdown
<a id="seccion-clave"></a>
## Sección clave

[Ir a la sección clave](#seccion-clave)
```
