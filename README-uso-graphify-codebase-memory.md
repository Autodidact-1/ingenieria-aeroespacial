# Herramientas de Mapeo de Código — Guía de Uso

**Ubicación sugerida:** `herramientas-ia/herramientas-terceros/`  
**Última actualización:** Agosto 2026

Documenta dos herramientas de terceros para que Claude Code (u otros agentes) entienda tu codebase sin releerlo entero cada sesión. Son de **arquitectura distinta** — ver comparación al final. Ambas son de código abierto, no son productos de Anthropic.

⚠️ **Antes de instalar cualquiera de las dos:** revisá el repositorio (actividad, mantenedores, issues abiertos) — es una práctica sana con cualquier dependencia nueva, y más con una que toca hooks o corre como servidor con acceso a tu filesystem.

---

## 1. Codebase Memory MCP

Servidor MCP persistente (binario nativo en C) — indexa tu código en un grafo consultable (SQLite embebido) con un watcher que lo mantiene actualizado en background. Repo: `github.com/DeusData/codebase-memory-mcp`.

### Instalación

**macOS / Linux:**
```bash
curl -fsSL https://raw.githubusercontent.com/DeusData/codebase-memory-mcp/main/install.sh | bash
```

Con la UI de visualización 3D del grafo:
```bash
curl -fsSL https://raw.githubusercontent.com/DeusData/codebase-memory-mcp/main/install.sh | bash -s -- --ui
```

**Windows (PowerShell):**
```powershell
irm https://raw.githubusercontent.com/DeusData/codebase-memory-mcp/main/install.sh | iex
```
> Nota: revisá el script antes de correrlo si querés inspeccionarlo primero — la práctica recomendada del propio proyecto es `Invoke-WebRequest` a un archivo local y abrirlo en un editor antes de ejecutar.

**Alternativa desde Claude Code**, pegando directo en el chat:
```
Instalá este servidor MCP: https://github.com/DeusData/codebase-memory-mcp
```
Claude Code clona, compila y configura automáticamente.

**Prerequisito:** compilador de C (usa CGO para el parser tree-sitter).
- macOS: `xcode-select --install`
- Linux (Debian/Ubuntu): `sudo apt install build-essential`

### Verificar instalación
```bash
which codebase-memory-mcp
codebase-memory-mcp --help
```
En Claude Code, correr `/mcp` después de reiniciar — debería listar `codebase-memory-mcp`.

### Uso
El instalador auto-detecta y configura Claude Code (y otros agentes: Codex, Cursor, Gemini CLI, Zed, Windsurf...). Una vez reiniciado el agente:

```
Indexá este proyecto
```
Primera vez es indexado completo; después es incremental (solo re-parsea archivos con hash cambiado). A partir de ahí, preguntas como:
```
¿Qué llama a la función X?
¿Qué se rompe si cambio esta clase?
¿Hay código muerto en este módulo?
```
se resuelven con tools MCP (`trace_call_path`, `search_graph`, detección de dead code) en vez de que el agente grepee archivo por archivo.

### Config manual (si el instalador no detecta tu agente)
```json
{
  "mcpServers": {
    "codebase-memory-mcp": {
      "command": "codebase-memory-mcp",
      "args": []
    }
  }
}
```
Va en `~/.claude/.mcp.json` (global) o `.mcp.json` del proyecto (por proyecto).

### Variables de entorno útiles
- `CBM_CACHE_DIR` — dónde guarda la base de datos (default `~/.cache/codebase-memory-mcp/`)
- `CBM_DIAGNOSTICS=1` — output de diagnóstico periódico

### Actualizar / desinstalar
```bash
codebase-memory-mcp update      # re-corre el instalador, es idempotente
# desinstalar: quita config de agentes, skills, hooks — no borra el binario ni la base SQLite, hacerlo a mano si se quiere limpiar del todo
```

### Notas de seguridad (documentadas por el propio proyecto)
- Firmas Sigstore + SLSA Level 3 + checksums SHA-256 en cada release.
- Único llamado de red no solicitado: chequeo de versión contra la API de GitHub (no manda datos del proyecto).
- Sin API key, sin LLM embebido — la inteligencia la pone el agente (Claude Code) vía MCP.

---

## 2. Graphify

Skill (no servidor persistente) que convierte una carpeta —código, pero también SQL, docs, PDFs, papers, imágenes— en un grafo de conocimiento local. Se re-corre manualmente cuando el proyecto cambia. Paquete en PyPI: **`graphifyy`** (con doble "y" — ojo, es fácil escribirlo mal).

⚠️ **Cuidado con el nombre**: hay varios repos en GitHub con nombres muy parecidos (`Graphify-Labs/graphify`, `safishamsi/graphify`, y forks/clones de terceros) todos publicando o referenciando el mismo paquete `graphifyy`. Antes de instalar, confirmá que estás mirando el repo oficial vigente (chequeá actividad reciente, estrellas, y que el README coincida con lo documentado acá) — es un patrón típico de "name squatting" que conviene verificar.

### Instalación

**Recomendado (entorno aislado, evita problemas de PATH):**
```bash
uv tool install graphifyy
```

**Alternativas:**
```bash
pipx install graphifyy
pip install graphifyy   # puede necesitar configurar el PATH después
```

Si `graphify` no se reconoce como comando después de instalar con `uv`:
```bash
uv tool update-shell
```
(con `pipx`, el equivalente es `pipx ensurepath`) — y abrir una terminal nueva.

**Prerequisito:** Python ≥3.10 y <3.14.

### Registrar el skill en Claude Code
```bash
graphify install
```
Instala el skill en tu perfil de usuario (todos los proyectos). Para instalarlo solo en el proyecto actual:
```bash
graphify install --project
```
Esto escribe `.claude/skills/graphify/SKILL.md` en el repo — se puede commitear a git.

### Uso
Dentro de Claude Code (no en la terminal — la construcción del grafo corre adentro del agente):
```
/graphify .
```
> En PowerShell, sin la barra inicial: `graphify .` (PowerShell interpreta `/` como separador de rutas).

Esto genera:
```
graphify-out/
├── graph.html          ← visualización interactiva (abrir en el navegador)
├── GRAPH_REPORT.md      ← nodos más conectados, comunidades, preguntas sugeridas
├── graph.json           ← grafo consultable, formato máquina
└── cache/                ← cache incremental
```

Re-escanear solo lo que cambió (no todo de cero):
```
/graphify . --update
```

Consultas directas una vez construido el grafo:
```
/graphify query "¿qué conecta el módulo de auth con la base de datos?"
/graphify path "ClaseA" "ClaseB"
/graphify explain "NombreDeClase"
```

### Integración "siempre activa"
```bash
graphify claude install
```
Corrido dentro del proyecto, hace dos cosas:
- Agrega una sección a `CLAUDE.md` diciéndole a Claude que lea `graphify-out/GRAPH_REPORT.md` antes de responder preguntas de arquitectura.
- Instala un hook `PreToolUse` en `settings.json` que se dispara antes de cada `Glob`/`Grep`, sugiriendo mirar el grafo primero.

### Ingesta de video/audio (opcional, además de código)
```bash
pip install 'graphifyy[video]'
/graphify ./mi-corpus
```
Transcribe localmente con Whisper (nunca sale de tu máquina) y lo suma al mismo grafo.

### Ignorar archivos sensibles
Igual sintaxis que `.gitignore`, en `.graphifyignore`:
```
.env
.env.*
*.pem
*.key
secrets/
private/
```

### Troubleshooting común
| Problema | Solución |
|---|---|
| `graphify: command not found` | Usar `uv tool install` o `pipx install` en vez de `pip install` — evita problemas de PATH |
| `ModuleNotFoundError: No module named 'graphify'` | El intérprete que usa el skill (`graphify-out/.graphify_python`) apunta a otro entorno — reinstalar con `uv`/`pipx` |
| Nodos duplicados tras rebuild | Se mergean automáticamente desde v0.8.33 en adelante; en versiones previas, forzar re-extract completo |

---

## Comparación rápida

| | Codebase Memory MCP | Graphify |
|---|---|---|
| Arquitectura | Servidor MCP persistente | Skill, corre bajo demanda |
| Actualización | Automática (watcher + incremental) | Manual (`/graphify . --update`) |
| Alcance | Solo código | Código + docs + PDFs + papers + video/audio |
| Instalación | Binario único, sin dependencias | Requiere Python + `uv`/`pipx` |
| Mejor para | Codebases que consultás todo el tiempo, en producción activa (ej. Arrds Studio a mediano plazo) | Entender de una un repo nuevo, o mapear código junto con documentación/papers |

## Dónde usar cada una en tus proyectos

- **Arrds Studio** (motor matemático, puente C++/pybind11): candidato natural para **Codebase Memory MCP** a medida que crezca — es el caso de uso que más se beneficia del watcher automático.
- **Repos que abrís puntualmente** para entender su arquitectura, o donde querés mapear código junto con papers/documentación (ej. algo relacionado a tu TFG con código de apoyo): **Graphify**.
- Nada te impide tener las dos activas en proyectos distintos — no compiten entre sí, resuelven necesidades distintas.
