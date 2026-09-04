# 02 · Tablas y listas avanzadas

## Tablas con alineación

Los dos puntos `:` en la fila separadora controlan la alineación:

```markdown
| Izquierda | Centro | Derecha |
|:----------|:------:|--------:|
| a         |   b    |       c |
| largo texto | x    |     123 |
```

| Izquierda | Centro | Derecha |
|:----------|:------:|--------:|
| a         |   b    |       c |
| largo texto | x    |     123 |

## Tablas comparativas (uso típico en apuntes de ingeniería)

| Variable | Símbolo | Unidad SI | Descripción |
|---|---|---|---|
| Empuje | $T$ | N | Fuerza que produce el motor |
| Arrastre | $D$ | N | Resistencia aerodinámica |
| Sustentación | $L$ | N | Fuerza perpendicular al viento relativo |
| Peso | $W$ | N | $W = m g$ |

## Listas de tareas (checkboxes)

```markdown
- [x] Leer el capítulo 3
- [ ] Resolver los ejercicios 4.1–4.5
- [ ] Repasar antes del examen
```

- [x] Leer el capítulo 3
- [ ] Resolver los ejercicios 4.1–4.5
- [ ] Repasar antes del examen

## Listas anidadas mixtas

```markdown
1. Cinemática
   - Posición
   - Velocidad
   - Aceleración
2. Dinámica
   1. Leyes de Newton
   2. Momento lineal
      - Conservación
      - Colisiones
```

1. Cinemática
   - Posición
   - Velocidad
   - Aceleración
2. Dinámica
   1. Leyes de Newton
   2. Momento lineal
      - Conservación
      - Colisiones

## Listas de definición (solo algunos renderizadores: Obsidian con plugin, Pandoc)

```markdown
Sustentación
: Fuerza aerodinámica perpendicular a la corriente libre.

Arrastre
: Fuerza aerodinámica paralela a la corriente libre.
```
