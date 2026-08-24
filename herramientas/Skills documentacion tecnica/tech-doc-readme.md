---
name: tech-doc-readme
description: Crea READMEs profesionales y guías de inicio rápido para proyectos Python. Triggers: cuando el usuario menciona 'README', 'inicio rápido', 'getting started', 'guía de instalación', o necesita documentar cómo usar un proyecto. Usa esta skill para generar o mejorar el README.md de cualquier proyecto Python, incluyendo descripción, instalación, uso, estructura del proyecto y ejemplos básicos.
compatibility: Python 3.6+
---

# Documentación Técnica: README y Guías de Inicio Rápido

## Propósito

Esta skill genera **READMEs profesionales y guías de inicio rápido** personalizadas para proyectos Python, con estructura clara y ejemplos funcionales.

## Cuándo usar

- **Crear un README desde cero** para un proyecto nuevo
- **Mejorar un README existente** con secciones faltantes
- **Documentar pasos de instalación** con dependencias y requisitos
- **Generar ejemplos de uso rápido** para que usuarios empiecen inmediatamente
- **Estructurar la jerarquía de secciones** de forma profesional

## Estructura Estándar del README

Los READMEs generados siguen esta estructura:

```
1. Título y Badge/Status
2. Descripción Breve (1-2 párrafos)
3. Características Principales
4. Requisitos Previos
5. Instalación
6. Uso Rápido (Ejemplo Básico)
7. Estructura del Proyecto
8. Documentación Avanzada
9. Contribuciones
10. Licencia
```

## Proceso de Generación

### Paso 1: Recopilar Información del Proyecto

Hazme estas preguntas sobre tu proyecto:

- **Nombre y propósito**: ¿Qué es y qué problema resuelve?
- **Público objetivo**: ¿Quién lo usará? (estudiantes, ingenieros, usuarios finales)
- **Dependencias principales**: ¿Qué bibliotecas requiere?
- **Caso de uso principal**: ¿Cuál es el ejemplo más importante?
- **Estado del proyecto**: ¿Es estable, en desarrollo, o experimental?

### Paso 2: Customización por Tipo de Proyecto

Dependiendo del tipo de proyecto Python, adaptamos el README:

**Para librerías/paquetes:**
- Énfasis en instalación vía pip
- API principal y funciones clave
- Ejemplos de importación

**Para aplicaciones/herramientas:**
- Instrucciones de ejecución
- Opciones de línea de comandos
- Ejemplos de flujo de trabajo

**Para proyectos educativos (como Arrds Studio):**
- Requisitos de desarrollo
- Cómo ejecutar localmente
- Estructura de código comentada
- Enlace a documentación completa

### Paso 3: Secciones Clave

#### Descripción
```markdown
## Descripción

[2-3 párrafos explicando qué hace, para quién, y por qué es útil]

### ¿Por qué usar este proyecto?
- Ventaja 1
- Ventaja 2
- Ventaja 3
```

#### Requisitos Previos
```markdown
## Requisitos Previos

- Python 3.8+
- pip (gestor de paquetes de Python)
- [Otros requisitos del sistema]
```

#### Instalación
```markdown
## Instalación

### Opción 1: Instalación desde PyPI (recomendado)
\`\`\`bash
pip install nombre-proyecto
\`\`\`

### Opción 2: Instalación desde fuentes
\`\`\`bash
git clone https://github.com/usuario/proyecto.git
cd proyecto
pip install -e .
\`\`\`

### Instalación con dependencias de desarrollo
\`\`\`bash
pip install -e ".[dev]"
\`\`\`
```

#### Uso Rápido
```markdown
## Uso Rápido

### Ejemplo Básico
\`\`\`python
from proyecto import MiClase

# Crear instancia
objeto = MiClase()

# Usar funcionalidad principal
resultado = objeto.procesar(datos)
print(resultado)
\`\`\`

Para más ejemplos, ver [documentación completa](#documentación).
```

#### Estructura del Proyecto
```markdown
## Estructura del Proyecto

\`\`\`
proyecto/
├── src/
│   └── nombre_proyecto/
│       ├── __init__.py
│       ├── modulo_principal.py
│       └── utilidades.py
├── tests/
│   ├── test_modulo_principal.py
│   └── test_utilidades.py
├── docs/
│   └── README.md
├── setup.py
└── requirements.txt
\`\`\`

**Descripción de directorios:**
- `src/`: Código fuente principal
- `tests/`: Pruebas unitarias
- `docs/`: Documentación adicional
```

## Personalizaciones Comunes

### Para proyectos con CLI
```markdown
## Línea de Comandos

\`\`\`bash
python -m proyecto --help
python -m proyecto --input archivo.txt --output resultado.txt
\`\`\`
```

### Para proyectos con configuración
```markdown
## Configuración

Crea un archivo \`.env\`:
\`\`\`
API_KEY=tu_clave_aqui
DEBUG=True
\`\`\`
```

### Para proyectos colaborativos
```markdown
## Contribuir

1. Fork el repositorio
2. Crea una rama: \`git checkout -b feature/tu-feature\`
3. Commit: \`git commit -am 'Añade feature'\`
4. Push: \`git push origin feature/tu-feature\`
5. Abre un Pull Request
```

## Tips para README Efectivo

1. **Primeras líneas importan**: Los usuarios deciden en 5 segundos si les interesa
2. **Ejemplos funcionales**: Copia y pega debe funcionar directamente
3. **Evita tecnicismos innecesarios**: Explica términos o enlaza a documentación
4. **Mantén actualizado**: README desactualizado es peor que no tenerlo
5. **Sé honesto**: Sobre limitaciones, estado del proyecto, y requisitos
6. **Visual es mejor**: Usa badges, emojis, y formato claro

## Output Esperado

El README generado será:
- ✅ Profesional y bien estructurado
- ✅ Personalizado a tu proyecto específico
- ✅ Con ejemplos funcionales y copiables
- ✅ Listo para copiar a tu repositorio
- ✅ En formato Markdown estándar

---

**Próximo paso:** Proporciona información sobre tu proyecto Python y generaré un README personalizado.
