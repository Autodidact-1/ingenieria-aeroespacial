---
name: tech-doc-tutorials
description: Crea tutoriales interactivos y ejemplos de código prácticos para proyectos Python. Triggers: cuando el usuario menciona 'tutorial', 'ejemplos de código', 'guía paso a paso', 'cómo usar', 'casos de uso', 'demostración', o quiere enseñar cómo usar su proyecto con ejemplos funcionales. Usa esta skill para crear guías educativas con código reproducible.
compatibility: Python 3.6+
---

# Documentación Técnica: Tutoriales y Ejemplos

## Propósito

Esta skill genera **tutoriales interactivos y ejemplos prácticos** que permiten a los usuarios aprender a usar tu proyecto Python mediante código funcional y explicaciones paso a paso.

## Cuándo usar

- **Crear un tutorial desde cero** para usuarios nuevos
- **Documentar casos de uso comunes** con código real
- **Mostrar progresión de dificultad** (básico → intermedio → avanzado)
- **Proveer notebooks Jupyter** con ejemplos interactivos
- **Generar ejercicios prácticos** para que usuarios practiquen
- **Resolver problemas frecuentes** con ejemplos de solución

## Estructura de Tutoriales

### 1. Tutorial Básico: Primer Uso

```markdown
# Tutorial 1: Tu Primer Programa

## Objetivo

Al finalizar este tutorial, habrás:
- Instalado correctamente el paquete
- Escrito tu primer script
- Entendido los conceptos básicos

## Paso 1: Verificar Instalación

\`\`\`bash
python -c "import proyecto; print(proyecto.__version__)"
\`\`\`

Si ves un número de versión, ¡la instalación fue exitosa!

## Paso 2: Crear tu Primer Script

Crea un archivo llamado `primer_script.py`:

\`\`\`python
# primer_script.py
from proyecto import MiClase

# Crear una instancia
mi_objeto = MiClase()

# Usar la funcionalidad principal
resultado = mi_objeto.procesar({'dato': 'ejemplo'})

print("Resultado:", resultado)
\`\`\`

## Paso 3: Ejecutar el Script

\`\`\`bash
python primer_script.py
\`\`\`

## Explicación

- **Línea 2:** Importamos la clase principal
- **Línea 5:** Creamos una instancia del objeto
- **Línea 8:** Procesamos datos de entrada
- **Línea 10:** Mostramos el resultado

## ¿Qué Sigue?

Ahora que tienes lo básico, puedes:
- Explorar diferentes opciones de configuración
- Procesar archivos reales
- Integrar en tus propios proyectos

Continúa con el [Tutorial 2](#tutorial-2-trabajar-con-archivos).
```

### 2. Tutorial Intermedio: Casos de Uso Comunes

```markdown
# Tutorial 2: Trabajar con Archivos

## Objetivo

Aprender a leer datos de archivos y guardar resultados.

## Requisitos

- Completado: Tutorial 1
- Archivo de ejemplo: `datos.txt`

## Caso de Uso

Procesar un archivo de datos y guardar los resultados en otro archivo.

## Solución Completa

\`\`\`python
# procesar_archivo.py
import json
from proyecto import MiClase

def procesar_archivo(ruta_entrada: str, ruta_salida: str):
    \"\"\"Procesa un archivo y guarda los resultados.\"\"\"
    
    # Paso 1: Leer datos del archivo
    with open(ruta_entrada, 'r') as f:
        datos = json.load(f)
    
    # Paso 2: Crear procesador
    procesador = MiClase(config={'debug': True})
    
    # Paso 3: Procesar datos
    print("Procesando datos...")
    resultado = procesador.procesar(datos)
    
    # Paso 4: Guardar resultados
    with open(ruta_salida, 'w') as f:
        json.dump(resultado, f, indent=2)
    
    print(f"Resultados guardados en: {ruta_salida}")

if __name__ == '__main__':
    procesar_archivo('entrada.json', 'salida.json')
\`\`\`

## Desglose Paso a Paso

### Paso 1: Lectura de Datos
\`\`\`python
with open(ruta_entrada, 'r') as f:
    datos = json.load(f)
\`\`\`
- `open()`: Abre el archivo
- `json.load()`: Convierte JSON a diccionario Python
- `with`: Cierra el archivo automáticamente

### Paso 2-4: Procesamiento y Guardado

[Explicación detallada...]

## Datos de Ejemplo

Crea `entrada.json`:
\`\`\`json
{
  "nombre": "Proyecto Ejemplo",
  "valores": [1, 2, 3, 4, 5],
  "configuracion": {
    "modo": "produccion"
  }
}
\`\`\`

## Resultado Esperado

Después de ejecutar el script, verás `salida.json`:
\`\`\`json
{
  "status": "éxito",
  "resultado": {
    ...
  },
  "tiempo_ejecucion": 0.234
}
\`\`\`

## Errores Comunes

### Error 1: FileNotFoundError
**Causa:** El archivo de entrada no existe
**Solución:** Verifica la ruta: \`python -c "import os; print(os.path.exists('entrada.json'))"\`

### Error 2: JSONDecodeError
**Causa:** Archivo JSON mal formado
**Solución:** Valida el JSON: [link a validador online]
```

### 3. Tutorial Avanzado: Patrones Profesionales

```markdown
# Tutorial 3: Patrones Avanzados

## Objetivo

Aprender patrones profesionales para proyectos grandes.

## Patrón 1: Factory Pattern

\`\`\`python
# procesadores.py
from proyecto import Procesador

class ProcesadorFactory:
    \"\"\"Factory para crear diferentes tipos de procesadores.\"\"\"
    
    @staticmethod
    def crear(tipo: str, config: dict = None):
        if tipo == 'basico':
            return ProcesadorBasico(config)
        elif tipo == 'avanzado':
            return ProcesadorAvanzado(config)
        else:
            raise ValueError(f"Tipo desconocido: {tipo}")

# Uso
procesador = ProcesadorFactory.crear('avanzado', {'timeout': 60})
\`\`\`

## Patrón 2: Pipeline de Transformación

\`\`\`python
from proyecto import Transformador

class Pipeline:
    def __init__(self):
        self.etapas = []
    
    def agregar_etapa(self, transformador: Transformador):
        self.etapas.append(transformador)
        return self
    
    def ejecutar(self, datos):
        resultado = datos
        for etapa in self.etapas:
            resultado = etapa.procesar(resultado)
        return resultado

# Uso
pipeline = (Pipeline()
    .agregar_etapa(LimpiarDatos())
    .agregar_etapa(Normalizar())
    .agregar_etapa(Analizar()))

resultado = pipeline.ejecutar(datos_crudos)
\`\`\`

## Patrón 3: Configuración Flexible

\`\`\`python
from dataclasses import dataclass
from typing import Optional

@dataclass
class Configuracion:
    timeout: int = 30
    debug: bool = False
    log_nivel: str = 'INFO'
    cache_enabled: bool = True
    
    def a_dict(self):
        return {
            'timeout': self.timeout,
            'debug': self.debug,
            'log_nivel': self.log_nivel,
            'cache_enabled': self.cache_enabled
        }

# Uso
config = Configuracion(timeout=60, debug=True)
procesador = MiClase(config=config.a_dict())
\`\`\`
```

## Ejemplos Prácticos Organizados

### Ejemplo 1: Procesamiento Básico
**Archivo:** `ejemplos/basico.py`
**Tiempo:** 5 minutos
**Concepto:** Instanciación y uso básico

### Ejemplo 2: Manejo de Errores
**Archivo:** `ejemplos/manejo_errores.py`
**Tiempo:** 10 minutos
**Concepto:** Try/except y recuperación de errores

### Ejemplo 3: Integración con FastAPI
**Archivo:** `ejemplos/fastapi_integration.py`
**Tiempo:** 15 minutos
**Concepto:** Usar el paquete en una API web

### Ejemplo 4: Testing
**Archivo:** `ejemplos/testing.py`
**Tiempo:** 15 minutos
**Concepto:** Escribir pruebas unitarias

## Notebook Jupyter Interactivo

Proporcionar un archivo `.ipynb` con:

\`\`\`markdown
# Notebook: Introducción Interactiva

## Celda 1: Instalación y Setup
\`\`\`python
!pip install proyecto
from proyecto import *
import json
\`\`\`

## Celda 2: Primer Uso
\`\`\`python
# Tu código aquí
objeto = MiClase()
print(objeto)
\`\`\`

## Celda 3: Visualización (con gráficos)
\`\`\`python
import matplotlib.pyplot as plt
# Graficar resultados
\`\`\`
\`\`\`
```

## Estructura de Directorios de Ejemplos

```
proyecto/
├── ejemplos/
│   ├── 01_basico.py           # Hola Mundo del paquete
│   ├── 02_configuracion.py    # Configurar opciones
│   ├── 03_archivos.py         # Trabajar con archivos
│   ├── 04_errores.py          # Manejo de excepciones
│   ├── 05_performance.py      # Optimización
│   ├── 06_testing.py          # Pruebas
│   ├── 07_integracion.py      # Con otras librerías
│   └── README_EJEMPLOS.md     # Índice de ejemplos
├── notebooks/
│   └── introduccion.ipynb     # Jupyter notebook
└── docs/
    └── tutoriales.md          # Esta documentación
```

## Guía de Ejercicios Prácticos

```markdown
# Ejercicios para Practicar

## Ejercicio 1: Modificar Configuración
**Dificultad:** ⭐ Fácil
**Objetivo:** Aprender a configurar el comportamiento del paquete

Tarea: Modifica el Ejemplo 2 para usar timeout=120 y debug=False

## Ejercicio 2: Procesar Múltiples Archivos
**Dificultad:** ⭐⭐ Intermedio
**Objetivo:** Usar loops y manejo de excepciones

Tarea: Crear un script que procese todos los archivos en un directorio

## Ejercicio 3: Crear una Extensión
**Dificultad:** ⭐⭐⭐ Avanzado
**Objetivo:** Subclasificar y extender funcionalidad

Tarea: Crear una subclase de MiClase que añada nueva funcionalidad
```

## Solución a Ejercicios

[Proporcionar soluciones paso a paso]

## Recursos Adicionales

- 📚 [Documentación Completa](#)
- 🔗 [Repositorio en GitHub](#)
- 💬 [Comunidad/Foro](#)
- 📖 [Paper académico (si aplica)](#)

---

**Próximo paso:** Proporciona casos de uso específicos de tu proyecto y generaré tutoriales personalizados.
