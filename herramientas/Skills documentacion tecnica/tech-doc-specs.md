---
name: tech-doc-specs
description: Genera especificaciones técnicas exhaustivas para proyectos Python. Triggers: cuando el usuario menciona 'especificación técnica', 'requisitos funcionales', 'SRS (Software Requirements Specification)', 'características detalladas', 'formato de datos', 'algoritmos', 'performance', 'testing', o necesita documentación profunda del proyecto. Usa esta skill para crear documentos de especificación profesionales.
compatibility: Python 3.6+
---

# Documentación Técnica: Especificaciones Técnicas Detalladas

## Propósito

Esta skill genera **especificaciones técnicas exhaustivas y formales** para proyectos Python, incluyendo requisitos, algoritmos, formatos de datos, performance y estrategias de testing.

## Cuándo usar

- **Crear una especificación formal** desde cero
- **Documentar requisitos funcionales y no-funcionales** del proyecto
- **Especificar formatos de datos** (JSON, CSV, binarios)
- **Describir algoritmos** implementados
- **Definir métricas de performance** y benchmarks
- **Estrategia de testing** y cobertura
- **Compatibilidad y requisitos** del sistema
- **Roadmap técnico** futuro del proyecto

## Estructura de Especificación Técnica

### 1. Documento: Especificación de Requisitos de Software (SRS)

```markdown
# Especificación de Requisitos de Software (SRS)
## Proyecto: [Nombre del Proyecto]

**Versión:** 1.0  
**Fecha:** 2024-01-15  
**Autor:** [Tu Nombre]  
**Estado:** Aprobado

---

## 1. Introducción

### 1.1 Propósito

Este documento especifica los requisitos funcionales y no-funcionales del Proyecto [Nombre],
destinado a [propósito principal].

### 1.2 Alcance

El proyecto incluye:
- [Característica 1]
- [Característica 2]
- [Característica 3]

No incluye:
- [Exclusión 1]
- [Exclusión 2]

### 1.3 Definiciones, Acrónimos y Abreviaturas

| Término | Definición |
|---------|-----------|
| API | Application Programming Interface - Interfaz de Programación |
| CLI | Command Line Interface - Interfaz de Línea de Comandos |
| JSON | JavaScript Object Notation - Formato de datos |

---

## 2. Requisitos Funcionales

### RF-1: Procesamiento de Datos
**ID:** RF-1  
**Descripción:** El sistema debe procesar datos de entrada y transformarlos.  
**Prioridad:** Alta  
**Complejidad:** Media

**Especificación Detallada:**
- Entrada: Diccionario Python con estructura específica
- Proceso: Transformación según reglas definidas
- Salida: Diccionario con resultados

**Casos de Uso:**
1. Usuario proporciona archivo JSON
2. Sistema lee y valida datos
3. Sistema aplica transformaciones
4. Sistema retorna resultado

### RF-2: Validación de Entrada
**ID:** RF-2  
**Descripción:** El sistema debe validar todos los datos de entrada.  
**Prioridad:** Alta

**Validaciones:**
- Campo requerido: nombre (string, 1-100 caracteres)
- Campo requerido: edad (int, 0-150)
- Campo opcional: email (string, formato email válido)

### RF-3: Manejo de Errores
**ID:** RF-3  
**Descripción:** El sistema debe capturar y reportar errores claramente.  
**Prioridad:** Alta

**Errores Específicos:**
- ValueError: Cuando datos son inválidos
- FileNotFoundError: Cuando archivo no existe
- TimeoutError: Cuando se excede tiempo máximo

---

## 3. Requisitos No-Funcionales

### NF-1: Performance
**Métricas:**
- Procesamiento de 1MB de datos: < 2 segundos
- Memoria máxima: < 500MB
- Throughput: > 100 registros/segundo

### NF-2: Confiabilidad
**Disponibilidad:** 99.5%
**MTTR (Mean Time To Repair):** < 1 hora
**Tasa de Error:** < 0.1%

### NF-3: Usabilidad
- Interfaz intuitiva
- Documentación completa
- Ejemplos de código

### NF-4: Mantenibilidad
- Código bien comentado
- Pruebas unitarias: > 80% cobertura
- Arquitectura modular

### NF-5: Portabilidad
- Compatible con Python 3.8+
- Funciona en Windows, macOS, Linux

---

## 4. Restricciones Técnicas

- **Python mínimo:** 3.8
- **Dependencias principales:** NumPy, Pandas
- **Tamaño máximo de entrada:** 1GB
- **Timeout máximo:** 300 segundos

---

## 5. Interfaces Externas

### 5.1 Interfaz de Línea de Comandos (CLI)
\`\`\`bash
python -m proyecto --input <archivo> --output <archivo> [--config <json>]
\`\`\`

### 5.2 Interfaz Programática (API)
\`\`\`python
from proyecto import procesar
resultado = procesar(datos, config={})
\`\`\`

### 5.3 Formatos de Entrada/Salida

**Entrada (JSON):**
\`\`\`json
{
  "datos": [...],
  "opciones": {...}
}
\`\`\`

**Salida (JSON):**
\`\`\`json
{
  "status": "éxito",
  "resultado": {...},
  "metadata": {...}
}
\`\`\`
```

### 2. Especificación de Formatos de Datos

```markdown
# Especificación de Formatos de Datos

## Formato de Entrada

### Estructura JSON Principal
\`\`\`json
{
  "version": "1.0",
  "timestamp": "2024-01-15T10:30:00Z",
  "datos": {
    "tipo": "string",
    "valores": ["valor1", "valor2"]
  },
  "metadata": {
    "fuente": "string",
    "id_usuario": "string"
  }
}
\`\`\`

### Especificación de Campos

| Campo | Tipo | Requerido | Descripción | Ejemplo |
|-------|------|-----------|-------------|---------|
| version | string | Sí | Versión del formato | "1.0" |
| timestamp | ISO8601 | Sí | Fecha/hora UTC | "2024-01-15T10:30:00Z" |
| datos.tipo | string | Sí | Tipo de datos | "numerico" \| "texto" |
| datos.valores | array | Sí | Valores a procesar | [1, 2, 3] |

### Ejemplos Válidos

**Ejemplo 1: Datos Numéricos**
\`\`\`json
{
  "version": "1.0",
  "timestamp": "2024-01-15T10:30:00Z",
  "datos": {
    "tipo": "numerico",
    "valores": [1.5, 2.3, 3.7]
  }
}
\`\`\`

**Ejemplo 2: Datos de Texto**
\`\`\`json
{
  "version": "1.0",
  "timestamp": "2024-01-15T10:30:00Z",
  "datos": {
    "tipo": "texto",
    "valores": ["hola", "mundo"]
  }
}
\`\`\`

## Formato de Salida

\`\`\`json
{
  "status": "éxito|error|advertencia",
  "resultado": {
    "procesados": 100,
    "errores": 0,
    "datos": [...]
  },
  "metadata": {
    "duracion_ms": 234,
    "version_algoritmo": "2.1"
  }
}
\`\`\`
```

### 3. Especificación de Algoritmos

```markdown
# Especificación de Algoritmos

## Algoritmo 1: Pipeline de Transformación

### Descripción Conceptual
El algoritmo procesa datos a través de múltiples etapas de transformación.

### Pseudocódigo
\`\`\`
ALGORITMO ProcesarDatos(entrada, opciones)
  1. VALIDAR entrada
     SI no válida
       RETORNAR error
  2. INICIALIZAR resultado = {}
  3. PARA cada registro EN entrada
       3.1 LIMPIAR datos
       3.2 NORMALIZAR valores
       3.3 APLICAR transformaciones
       3.4 AGREGAR a resultado
  4. RETORNAR resultado
FIN
\`\`\`

### Implementación Python
\`\`\`python
def procesar_datos(entrada: dict, opciones: dict = None) -> dict:
    \"\"\"Implementación del algoritmo de transformación.\"\"\"
    # Validación
    if not entrada:
        raise ValueError("Entrada vacía")
    
    resultado = {}
    
    # Procesamiento
    for registro in entrada.get('valores', []):
        limpio = limpiar(registro)
        normalizado = normalizar(limpio)
        transformado = transformar(normalizado)
        resultado[registro['id']] = transformado
    
    return resultado
\`\`\`

### Complejidad

**Temporal (Time):**
- Mejor caso: O(n)
- Caso promedio: O(n log n)
- Peor caso: O(n²)

**Espacial (Space):** O(n)

**Donde n = número de registros**

### Benchmarks
- 1000 registros: 0.05s
- 10000 registros: 0.45s
- 100000 registros: 5.2s
```

### 4. Especificación de Testing

```markdown
# Plan de Testing

## Estrategia de Testing

### Niveles de Testing
1. **Unitarias** - Funciones individuales
2. **Integración** - Módulos juntos
3. **Sistema** - Proyecto completo
4. **Aceptación** - Requisitos de usuario

## Cobertura de Testing

**Meta:** > 85% de cobertura de código

### Test Unitarios

#### TC-1: Validación de Entrada
\`\`\`python
def test_validar_entrada_correcta():
    entrada = {'tipo': 'numerico', 'valores': [1, 2, 3]}
    assert validar_entrada(entrada) == True

def test_validar_entrada_faltante():
    entrada = {'tipo': 'numerico'}  # Falta 'valores'
    with pytest.raises(ValueError):
        validar_entrada(entrada)
\`\`\`

#### TC-2: Procesamiento
\`\`\`python
def test_procesar_numeros():
    entrada = {'valores': [1, 2, 3]}
    resultado = procesar(entrada)
    assert resultado['procesados'] == 3
    assert resultado['errores'] == 0
\`\`\`

### Test de Integración

#### TI-1: Flujo Completo
\`\`\`python
def test_flujo_completo():
    # Setup
    entrada = cargar_json('test_data.json')
    
    # Ejecución
    resultado = proyecto.procesar(entrada)
    
    # Verificación
    assert resultado['status'] == 'éxito'
    assert len(resultado['resultado']) > 0
\`\`\`

### Matriz de Testing

| Requisito | Test Unitario | Test Integración | Test Sistema |
|-----------|---------------|------------------|--------------|
| RF-1: Procesar datos | TC-1 | TI-1 | TS-1 |
| RF-2: Validar entrada | TC-2 | TI-1 | TS-1 |
| NF-1: Performance | - | - | TS-2 |

## Casos de Prueba Específicos

### Caso de Prueba Positivo
**ID:** TC-001  
**Nombre:** Procesamiento exitoso
**Entrada:** datos válidos
**Salida esperada:** resultado correcto
**Estado:** ✓ Pasa

### Caso de Prueba Negativo
**ID:** TC-002  
**Nombre:** Entrada inválida
**Entrada:** datos con campo faltante
**Salida esperada:** ValueError
**Estado:** ✓ Pasa
```

### 5. Requisitos de Performance

```markdown
# Especificación de Performance

## Métricas de Performance

| Métrica | Objetivo | Crítica |
|---------|----------|--------|
| Latencia (p50) | < 100ms | No |
| Latencia (p99) | < 500ms | Sí |
| Throughput | > 100 req/s | Sí |
| Memoria Peak | < 500MB | Sí |
| CPU | < 80% | Sí |

## Benchmarks de Referencia

### Procesamiento de Datos
\`\`\`
Tamaño  | Tiempo  | Memoria
--------|---------|----------
1KB     | 1ms     | 2MB
1MB     | 100ms   | 50MB
10MB    | 1.2s    | 200MB
100MB   | 12s     | 450MB
\`\`\`

## Pruebas de Carga

\`\`\`
Usuarios Concurrentes | Latencia p95 | Tasa Error
--------------------|--------------|----------
10                  | 50ms         | 0%
100                 | 150ms        | 0%
1000                | 450ms        | 1%
\`\`\`

## Optimizaciones Implementadas

1. **Caché de resultados** - Evita recálculos
2. **Procesamiento paralelo** - Usa multiprocessing
3. **Índices de búsqueda** - Acceso O(1) a datos frecuentes
```

### 6. Compatibilidad y Requisitos del Sistema

```markdown
# Compatibilidad y Requisitos

## Requisitos de Sistema

### Mínimos
- **CPU:** 2 cores
- **RAM:** 512MB
- **Disco:** 100MB de espacio libre
- **Python:** 3.8+

### Recomendados
- **CPU:** 4+ cores
- **RAM:** 2GB
- **Disco:** 500MB de espacio libre
- **Python:** 3.11+

## Compatibilidad de Plataformas

| OS | Versión | Soporte |
|----|---------|---------|
| Windows | 10, 11 | ✓ Completo |
| macOS | 10.14+ | ✓ Completo |
| Linux | Ubuntu 20.04+ | ✓ Completo |

## Dependencias Externas

| Paquete | Versión | Opcional | Propósito |
|---------|---------|----------|-----------|
| numpy | >=1.20 | No | Operaciones numéricas |
| pandas | >=1.3 | No | Manipulación de datos |
| requests | >=2.25 | Sí | Requests HTTP |

## Versiones de Python Probadas

- Python 3.8 ✓
- Python 3.9 ✓
- Python 3.10 ✓
- Python 3.11 ✓
```

## Estructura de Documento Completo

```
ESPECIFICACION_TECNICA.md
├── 1. Introducción
│   ├── 1.1 Propósito
│   ├── 1.2 Alcance
│   └── 1.3 Definiciones
├── 2. Requisitos Funcionales
│   ├── RF-1: ...
│   ├── RF-2: ...
│   └── RF-N: ...
├── 3. Requisitos No-Funcionales
│   ├── NF-1: Performance
│   ├── NF-2: Confiabilidad
│   └── NF-N: ...
├── 4. Restricciones Técnicas
├── 5. Interfaces Externas
├── 6. Formatos de Datos
├── 7. Algoritmos
├── 8. Plan de Testing
├── 9. Roadmap Técnico
└── 10. Apéndices
```

## Tips para Especificaciones Efectivas

1. **Sé específico** - Evita ambigüedades
2. **Usa plantillas** - Facilita lectura y consistencia
3. **Prioriza requisitos** - Alta/Media/Baja
4. **Incluye ejemplos** - Código y datos reales
5. **Mantén actualizado** - Refleja el estado actual
6. **Versiona cambios** - Histórico de modificaciones
7. **Vincula a requisitos** - Traceabilidad completa

## Plantilla de Control de Cambios

```
## Histórico de Cambios

| Versión | Fecha | Autor | Cambios |
|---------|-------|-------|---------|
| 1.0 | 2024-01-15 | Tu Nombre | Versión inicial |
| 1.1 | 2024-02-01 | Tu Nombre | Agregado RF-5 |
| 1.2 | 2024-02-15 | Tu Nombre | Actualizado NF-1 |
```

---

**Próximo paso:** Proporciona detalles específicos de tu proyecto y generaré una especificación técnica completa.
