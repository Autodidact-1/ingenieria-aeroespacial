---
name: tech-doc-api
description: Genera documentación completa de API y arquitectura para proyectos Python. Triggers: cuando el usuario menciona 'documentación de API', 'especificación de funciones', 'arquitectura del sistema', 'módulos', 'clases y métodos', 'diagrama de arquitectura', o necesita documentar la interfaz técnica de un proyecto. Usa esta skill para crear referencias exhaustivas de APIs.
compatibility: Python 3.6+
---

# Documentación Técnica: API y Arquitectura

## Propósito

Esta skill genera **documentación exhaustiva de APIs y arquitectura** para proyectos Python, incluyendo referencias de clases, funciones, módulos y diagramas arquitectónicos.

## Cuándo usar

- **Documentar módulos y paquetes** públicos
- **Especificar clases y métodos** con parámetros y retornos
- **Describir arquitectura del sistema** y flujo de datos
- **Crear referencias rápidas** de funciones disponibles
- **Diagrama de componentes** y dependencias
- **Documentar decoradores y patrones** de diseño usados

## Estructura de Documentación de API

### 1. Referencia de Módulos

```markdown
## Módulos Disponibles

### `proyecto.modulo_principal`
Módulo central que gestiona la lógica principal del proyecto.

**Importar:**
\`\`\`python
from proyecto import modulo_principal
\`\`\`

**Clases:**
- `MiClase` - Clase principal para procesar datos
- `ConfiguradorOpciones` - Configura opciones del sistema

**Funciones:**
- `inicializar()` - Inicia el sistema
- `procesar(datos)` - Procesa datos de entrada
\`\`\`

### `proyecto.utilidades`
Funciones auxiliares y utilidades.

**Importar:**
\`\`\`python
from proyecto.utilidades import ayudante_funcion
\`\`\`
```

### 2. Referencia Detallada de Clases

```markdown
## Clases

### MiClase

**Propósito:** Procesa datos y gestiona el flujo principal.

**Firma:**
\`\`\`python
class MiClase:
    def __init__(self, config: dict = None):
        ...
\`\`\`

**Parámetros del Constructor:**
- `config` (dict, opcional): Diccionario de configuración
  - `timeout` (int): Tiempo máximo de ejecución en segundos. Default: 30
  - `debug` (bool): Modo de depuración. Default: False

**Ejemplo de Uso:**
\`\`\`python
# Crear instancia con configuración
config = {'timeout': 60, 'debug': True}
objeto = MiClase(config=config)
\`\`\`

**Métodos:**

#### `procesar(datos: dict) -> dict`

**Descripción:** Procesa datos de entrada y retorna resultado procesado.

**Parámetros:**
- `datos` (dict): Diccionario con datos a procesar
  - `entrada` (str): Ruta del archivo de entrada
  - `opciones` (dict, opcional): Opciones de procesamiento

**Retorna:**
- dict: Resultado del procesamiento
  - `status` (str): 'éxito' o 'error'
  - `resultado` (dict): Datos procesados
  - `tiempo_ejecucion` (float): Segundos tardados

**Lanza:**
- `ValueError`: Si `datos` está vacío
- `FileNotFoundError`: Si archivo de entrada no existe

**Ejemplo:**
\`\`\`python
resultado = objeto.procesar({
    'entrada': 'datos.txt',
    'opciones': {'normalizar': True}
})
print(resultado['resultado'])
\`\`\`

#### `obtener_estado() -> str`

**Descripción:** Retorna el estado actual del objeto.

**Retorna:**
- str: Estado actual ('inicializado', 'procesando', 'completado')

**Ejemplo:**
\`\`\`python
estado = objeto.obtener_estado()
print(f"Estado: {estado}")
\`\`\`
```

### 3. Referencia de Funciones

```markdown
## Funciones

### `inicializar(config: dict = None) -> bool`

**Descripción:** Inicializa el sistema con la configuración especificada.

**Parámetros:**
- `config` (dict, opcional): Diccionario de configuración del sistema

**Retorna:**
- bool: True si inicialización fue exitosa, False en caso contrario

**Lanza:**
- `RuntimeError`: Si el sistema ya fue inicializado

**Ejemplo:**
\`\`\`python
from proyecto import inicializar

if inicializar({'debug': True}):
    print("Sistema inicializado")
else:
    print("Error en inicialización")
\`\`\`

### `procesar(datos: dict, **kwargs) -> dict`

**Descripción:** Procesa datos siguiendo el pipeline configurado.

**Parámetros:**
- `datos` (dict): Datos a procesar
- `**kwargs`: Parámetros adicionales
  - `verbose` (bool): Imprimir progreso. Default: False
  - `cache` (bool): Usar caché. Default: True

**Retorna:**
- dict: Resultado del procesamiento

**Ejemplo:**
\`\`\`python
resultado = procesar(datos, verbose=True, cache=False)
\`\`\`
```

## Arquitectura del Sistema

### Diagrama de Componentes

```
┌─────────────────────────────────────────────┐
│         Interface de Usuario                │
│  (CLI / Web / Librería Python)              │
└────────────────┬────────────────────────────┘
                 │
        ┌────────▼────────┐
        │  Módulo Principal│
        │  (Lógica Central)│
        └────────┬────────┘
                 │
    ┌────────────┼────────────┐
    │            │            │
┌───▼───┐  ┌────▼─────┐  ┌───▼────┐
│Entrada│  │Procesador│  │Salida  │
│(I/O)  │  │(Core)    │  │(Output)│
└───────┘  └──────────┘  └────────┘
```

### Flujo de Datos

1. **Entrada** - Lectura de datos (archivos, API, stdin)
2. **Procesamiento** - Transformación y análisis de datos
3. **Salida** - Escritura de resultados (archivos, stdout, API)

### Módulos y Responsabilidades

| Módulo | Responsabilidad | Dependencias |
|--------|-----------------|--------------|
| `modulo_principal` | Orquestación y flujo principal | `utilidades`, `procesadores` |
| `procesadores` | Lógica de transformación de datos | `utilidades` |
| `utilidades` | Funciones auxiliares reutilizables | ninguna |
| `io` | Lectura/escritura de archivos | `utilidades` |

## Patrones de Diseño Utilizados

### Pattern 1: Factory Pattern
```python
class ProcesadorFactory:
    @staticmethod
    def crear_procesador(tipo: str):
        if tipo == 'tipo_a':
            return ProcesadorTipoA()
        elif tipo == 'tipo_b':
            return ProcesadorTipoB()
```

### Pattern 2: Strategy Pattern
```python
class Procesador:
    def __init__(self, estrategia: Estrategia):
        self.estrategia = estrategia
    
    def procesar(self, datos):
        return self.estrategia.ejecutar(datos)
```

## Excepciones Personalizadas

```markdown
### ProyectoError

Excepción base para todos los errores del proyecto.

\`\`\`python
class ProyectoError(Exception):
    pass
\`\`\`

### DatosInvalidosError

Lanzada cuando los datos de entrada no son válidos.

\`\`\`python
class DatosInvalidosError(ProyectoError):
    pass
\`\`\`

### ConfiguracionError

Lanzada cuando hay un error en la configuración.

\`\`\`python
class ConfiguracionError(ProyectoError):
    pass
\`\`\`
```

## Tipos y Interfaces

### Usando Type Hints

```python
from typing import Dict, List, Optional, Callable

def procesar_lote(
    datos: List[Dict[str, Any]],
    transformador: Callable[[dict], dict]
) -> List[Dict[str, Any]]:
    """Procesa un lote de datos con una función transformadora."""
    return [transformador(item) for item in datos]
```

## Convenciones de Código

### Convención de Nombres

- **Variables:** `snake_case` (ej: `mi_variable`)
- **Funciones:** `snake_case` (ej: `obtener_datos()`)
- **Clases:** `PascalCase` (ej: `MiClase`)
- **Constantes:** `UPPER_SNAKE_CASE` (ej: `TIMEOUT_MAXIMO`)
- **Privados:** Prefijo `_` (ej: `_metodo_privado()`)

### Docstrings

Se usan docstrings en formato Google:

```python
def obtener_datos(archivo: str) -> dict:
    """Obtiene datos del archivo especificado.
    
    Args:
        archivo: Ruta del archivo a leer.
    
    Returns:
        Diccionario con los datos del archivo.
    
    Raises:
        FileNotFoundError: Si el archivo no existe.
    """
    pass
```

## Dependencias Externas

| Paquete | Versión | Propósito |
|---------|---------|-----------|
| `numpy` | >=1.20 | Operaciones numéricas |
| `pandas` | >=1.3 | Manipulación de datos |
| `requests` | >=2.25 | Peticiones HTTP |

---

**Próximo paso:** Proporciona información sobre la arquitectura de tu proyecto y generaré la documentación de API completa.
