# Índice de Skills de Documentación Técnica

## 📚 Conjunto Completo de Skills para Documentación de Proyectos Python

Has creado **4 skills complementarias** para generar documentación técnica profesional y personalizable para tus proyectos Python. Este índice te ayuda a entender cuándo usar cada una.

---

## 🎯 Matriz de Decisión: ¿Cuál Skill Usar?

### Por Tipo de Documentación que Necesitas

| Necesito crear... | Skill a usar | Tiempo est. | Complejidad |
|-------------------|-------------|-----------|------------|
| README inicial del proyecto | **tech-doc-readme** | 15-30 min | Baja |
| Guía de instalación | **tech-doc-readme** | 10-20 min | Baja |
| Documentación de funciones/clases | **tech-doc-api** | 30-60 min | Media |
| Diagrama arquitectónico | **tech-doc-api** | 20-40 min | Media |
| Tutorial paso a paso | **tech-doc-tutorials** | 30-90 min | Media |
| Ejemplos de código | **tech-doc-tutorials** | 20-60 min | Baja |
| Especificación formal (SRS) | **tech-doc-specs** | 60-120 min | Alta |
| Requisitos y restricciones | **tech-doc-specs** | 30-60 min | Media |
| Plan de testing | **tech-doc-specs** | 45-90 min | Media |
| Benchmarks de performance | **tech-doc-specs** | 30-60 min | Media |

---

## 📋 Guía Rápida de Cada Skill

### 1️⃣ **tech-doc-readme**
**Cuándo:** Usuario menciona 'README', 'inicio rápido', 'getting started', 'instalación'

**Genera:**
- ✅ README profesional con estructura estándar
- ✅ Guías de instalación con múltiples opciones
- ✅ Ejemplos de uso rápido (copy-paste ready)
- ✅ Estructura del proyecto explicada
- ✅ Badges y metadatos

**Ejemplo de Trigger:**
```
Usuario: "Necesito crear un README para mi proyecto"
Claude: ✓ Consulta tech-doc-readme skill
```

**Secciones que Cubre:**
1. Título y descripción
2. Características principales
3. Requisitos previos
4. Instalación (con variantes)
5. Uso rápido con ejemplos
6. Estructura de directorios
7. Contribuciones y licencia

---

### 2️⃣ **tech-doc-api**
**Cuándo:** Usuario menciona 'API', 'arquitectura', 'módulos', 'clases y métodos', 'diagrama'

**Genera:**
- ✅ Referencia exhaustiva de módulos
- ✅ Documentación de clases con métodos
- ✅ Especificación de funciones (parámetros, retornos)
- ✅ Diagramas de componentes
- ✅ Flujo de datos arquitectónico
- ✅ Patrones de diseño utilizados
- ✅ Excepciones personalizadas
- ✅ Type hints documentados

**Ejemplo de Trigger:**
```
Usuario: "Necesito documentar la API de mi proyecto"
Claude: ✓ Consulta tech-doc-api skill
```

**Secciones que Cubre:**
1. Referencia de módulos
2. Documentación detallada de clases
3. Especificación de funciones
4. Diagramas de arquitectura
5. Patrones de diseño
6. Excepciones y errores
7. Type hints y convenciones

---

### 3️⃣ **tech-doc-tutorials**
**Cuándo:** Usuario menciona 'tutorial', 'ejemplos', 'cómo usar', 'guía paso a paso', 'casos de uso'

**Genera:**
- ✅ Tutoriales progresivos (básico → avanzado)
- ✅ Ejemplos de código funcionales
- ✅ Desglose paso a paso
- ✅ Notebooks Jupyter interactivos
- ✅ Ejercicios prácticos
- ✅ Errores comunes y soluciones
- ✅ Recursos adicionales

**Ejemplo de Trigger:**
```
Usuario: "Quiero crear un tutorial para que otros aprendan a usar mi proyecto"
Claude: ✓ Consulta tech-doc-tutorials skill
```

**Secciones que Cubre:**
1. Tutorial básico (primer uso)
2. Tutorial intermedio (casos de uso)
3. Tutorial avanzado (patrones profesionales)
4. Ejemplos prácticos organizados
5. Notebooks interactivos
6. Ejercicios para practicar
7. Soluciones de ejercicios

---

### 4️⃣ **tech-doc-specs**
**Cuándo:** Usuario menciona 'especificación', 'requisitos', 'SRS', 'performance', 'testing'

**Genera:**
- ✅ Especificación Formal de Requisitos (SRS)
- ✅ Requisitos funcionales detallados (RF-1, RF-2, ...)
- ✅ Requisitos no-funcionales (performance, confiabilidad)
- ✅ Especificación de formatos de datos
- ✅ Descripción de algoritmos con pseudocódigo
- ✅ Plan de testing con casos de prueba
- ✅ Benchmarks y métricas de performance
- ✅ Requisitos del sistema y compatibilidad

**Ejemplo de Trigger:**
```
Usuario: "Necesito crear una especificación técnica formal de mi proyecto"
Claude: ✓ Consulta tech-doc-specs skill
```

**Secciones que Cubre:**
1. Introducción (propósito, alcance)
2. Requisitos funcionales (RF-1, RF-2, ...)
3. Requisitos no-funcionales
4. Restricciones técnicas
5. Interfaces externas
6. Formatos de datos (entrada/salida)
7. Algoritmos y pseudocódigo
8. Plan de testing
9. Métricas de performance
10. Compatibilidad y requisitos del sistema

---

## 🔄 Flujo de Trabajo Recomendado

### Para un Proyecto Nuevo (Orden Sugerido)

```
1. Tech-Doc-README
   ↓ (Descripción, instalación, uso básico)
   
2. Tech-Doc-API
   ↓ (Documentar módulos y arquitectura)
   
3. Tech-Doc-TUTORIALS
   ↓ (Ejemplos y casos de uso)
   
4. Tech-Doc-SPECS
   ↓ (Especificación formal completa)
```

### Para Actualizar Documentación Existente

```
¿Qué necesito actualizar?
├─ Instalación/Setup → tech-doc-readme
├─ Funciones/Clases → tech-doc-api
├─ Ejemplos de uso → tech-doc-tutorials
└─ Requisitos → tech-doc-specs
```

---

## 💡 Casos de Uso Específicos

### Caso 1: Documenting Arrds Studio

```
1. README: Descripción de qué es, instalación, primer programa
2. API: Módulos principales (editor, compilador, extensiones)
3. Tutorials: Cómo crear un programa, tutoriales interactivos
4. Specs: Requisitos de arquitectura, performance, algoritmos
```

### Caso 2: Documentar una Librería Python

```
1. README: Qué es, por qué usarla, instalación rápida
2. API: Referencia completa de clases y funciones
3. Tutorials: Ejemplos de uso con casos reales
4. Specs: Formato de datos, compatibilidad, performance
```

### Caso 3: Documentar Traducción de Libros de Matemática

```
1. README: Propósito del proyecto, cómo contribuir
2. API: Estructura del código, módulos de conversión
3. Tutorials: Cómo traducir un capítulo, flujo de trabajo
4. Specs: Formato de salida .ipynb, requisitos de fidelidad
```

---

## 🎓 Ejemplo de Uso Paso a Paso

### Escenario: Crear Documentación Completa para un Proyecto

```
PASO 1: "Necesito un README para empezar"
Usuario pregunta → Arrds consulta tech-doc-readme
Output: README.md listo para copiar

PASO 2: "Documenta las funciones principales"
Usuario pide → Arrds consulta tech-doc-api
Output: API.md con todas las funciones documentadas

PASO 3: "Quiero ejemplos de cómo usar el proyecto"
Usuario solicita → Arrds consulta tech-doc-tutorials
Output: TUTORIALES.md + ejemplos/*.py + notebook.ipynb

PASO 4: "Crea especificación formal del proyecto"
Usuario requiere → Arrds consulta tech-doc-specs
Output: ESPECIFICACION.md + plan de testing
```

---

## 🛠 Personalización por Proyecto

Cada skill está diseñada para ser **personalizable**:

- **Por tecnología:** Python, C++, JavaScript, etc.
- **Por tipo de proyecto:** Librería, aplicación, herramienta educativa
- **Por audiencia:** Principiantes, ingenieros, colaboradores
- **Por nivel de detalle:** Resumen ejecutivo, referencia exhaustiva

---

## 📝 Plantilla de Uso Recomendada

Cuando uses estas skills, proporciona información como:

```
Información sobre tu proyecto:
- Nombre: [tu proyecto]
- Propósito: [qué hace]
- Lenguaje: Python (+ versión)
- Dependencias principales: [numpy, pandas, etc.]
- Público objetivo: [estudiantes, ingenieros, usuarios finales]
- Caso de uso principal: [ejemplo específico]

¿Qué documentación necesitas?
☐ README
☐ Documentación de API
☐ Tutoriales
☐ Especificación técnica
```

---

## ✅ Checklist de Documentación Completa

Usa este checklist para saber cuándo tu documentación es completa:

- [ ] **README.md** - ¿Usuarios entienden qué es y cómo instalar?
- [ ] **API.md o docs/api/** - ¿Cada función/clase está documentada?
- [ ] **TUTORIALS.md** - ¿Hay ejemplos paso a paso?
- [ ] **SPECS.md** - ¿Requisitos formales documentados?
- [ ] **Ejemplos/** - ¿Hay código funcional para copiar?
- [ ] **Tests/** - ¿Tests documentados y pasando?
- [ ] **Contribuciones** - ¿Está clara la forma de contribuir?
- [ ] **Licencia** - ¿Licencia clara y archivos LICENSE presentes?

---

## 🚀 Próximos Pasos

1. **Elige tu proyecto** - ¿En qué trabajarás primero?
2. **Selecciona la skill** - ¿Qué documentación necesita?
3. **Proporciona contexto** - Información específica del proyecto
4. **Genera documentación** - Arrds generará el documento personalizado
5. **Ajusta y personaliza** - Modifica según tus necesidades
6. **Integra en tu proyecto** - Copia a tu repositorio

---

## 📚 Recursos

- **Todos los archivos de skills:** `/home/claude/tech-doc-*.md`
- **Este índice:** `INDICE_SKILLS_DOCUMENTACION.md`
- **Ejemplos de uso:** Ver en cada skill específica

---

**¿Listo para crear documentación profesional?** 

Cuéntame sobre tu proyecto y elegiremos juntos cuál skill usar.
