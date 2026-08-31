# 05 · Diagramas con Mermaid

Mermaid permite dibujar diagramas escribiendo texto plano dentro de un bloque
de código con la etiqueta `mermaid`. Funciona nativo en GitHub y Obsidian; en
VSCode requiere la extensión **Markdown Preview Mermaid Support**.

## Diagrama de flujo

````markdown
```mermaid
flowchart TD
    A[Inicio de la misión] --> B{¿Hay ventana de lanzamiento?}
    B -- Sí --> C[Despegue]
    B -- No --> D[Esperar]
    D --> B
    C --> E[Separación de etapas]
    E --> F[Órbita alcanzada]
```
````

```mermaid
flowchart TD
    A[Inicio de la misión] --> B{¿Hay ventana de lanzamiento?}
    B -- Sí --> C[Despegue]
    B -- No --> D[Esperar]
    D --> B
    C --> E[Separación de etapas]
    E --> F[Órbita alcanzada]
```

## Diagrama de secuencia

```mermaid
sequenceDiagram
    participant Control as Control de tierra
    participant Cohete
    Control->>Cohete: Comando de ignición
    Cohete-->>Control: Confirmación de encendido
    Cohete->>Cohete: Ascenso
    Cohete-->>Control: Telemetría en tiempo real
```

## Diagrama de Gantt (planificación de un proyecto)

```mermaid
gantt
    title Cronograma del proyecto
    dateFormat  YYYY-MM-DD
    section Diseño
    Requisitos           :a1, 2026-08-24, 5d
    Diseño preliminar     :a2, after a1, 10d
    section Análisis
    Cálculo estructural   :b1, after a2, 7d
    Análisis aerodinámico :b2, after a2, 7d
    section Fabricación
    Prototipo             :c1, after b1, 14d
```

## Diagrama de clases (útil para modelar sistemas)

```mermaid
classDiagram
    class Vehiculo {
        +float masa
        +float empuje
        calcularAceleracion()
    }
    class Cohete {
        +float isp
        calcularDeltaV()
    }
    Vehiculo <|-- Cohete
```
