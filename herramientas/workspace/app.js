/* ============================================================
   app.js — Centro de recursos academicos - Ingenieria Aeroespacial UNLP
   Interfaz tipo VS Code sobre las carpetas reales del repo.
   ============================================================ */

/* ---------- 0. Utilidades base ---------------------------- */

const $  = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const el = (tag, cls, html) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (html != null) n.innerHTML = html;
  return n;
};
const esc = s => String(s).replace(/[&<>"']/g, c =>
  ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));

/* Raíz del repo: este archivo vive en "general/workspace/" */
const ROOT = new URL('../../', location.href);
const urlFor = relPath => new URL(relPath.split('/').map(encodeURIComponent).join('/'), ROOT).href;
const extOf = name => (name.split('.').pop() || '').toLowerCase();
const kindOf = name => EXT_KIND[extOf(name)] || 'binary';
const baseName = p => p.split('/').filter(Boolean).pop() || p;

/* Progreso y mapas de la Red de asignaturas. Se conservan estas claves para no
   perder lo que ya habías marcado cuando la red era un archivo aparte. */
const PASSED_KEY = 'aero_passed_claude_dark';
const NETMAPS_KEY = 'aero_mapas_claude_dark';
const ESTADOS_KEY = 'aero_estados_claude_dark';
const NOTAS_EST_KEY = 'aero_estnotas_claude_dark';
const NOTAS_KEY = 'aero_notas_claude_dark';
const QUIZ_KEY = 'aero_quiz_claude_dark';
const readShared = (key, d) => {
  try { const v = localStorage.getItem(key); return v == null ? d : JSON.parse(v); }
  catch { return d; }
};
const writeShared = (key, v) => { try { localStorage.setItem(key, JSON.stringify(v)); } catch {} };

const ESTADOS = ['pendiente', 'cursando', 'regular', 'aprobada'];
const ESTADO_LABEL = { pendiente:'Pendiente', cursando:'Cursando', regular:'Regular', aprobada:'Aprobada' };

/* Primera vez con el modelo de 4 estados: migra desde el aprobada/no-aprobada
   binario anterior, para no perder lo que ya estaba marcado. */
function estadosIniciales() {
  const guardados = readShared(ESTADOS_KEY, null);
  if (guardados) return guardados;
  const migrado = {};
  readShared(PASSED_KEY, []).forEach(code => { migrado[code] = 'aprobada'; });
  writeShared(ESTADOS_KEY, migrado);
  return migrado;
}

const LS = {
  get(k, d) { try { const v = localStorage.getItem('aula_' + k); return v == null ? d : JSON.parse(v); }
              catch { return d; } },
  set(k, v) { try { localStorage.setItem('aula_' + k, JSON.stringify(v)); } catch {} },
  del(k)    { try { localStorage.removeItem('aula_' + k); } catch {} }
};

function toast(msg) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.classList.remove('show'), 2200);
}

/* ---------- 1. Iconos ------------------------------------- */

const I = {
  files:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4.7h3.4M4 11.6h3.4M4 4.7v13.8h3.4"/><rect x="7.4" y="2.9" width="12.6" height="3.6" rx="1.2"/><rect x="7.4" y="9.8" width="12.6" height="3.6" rx="1.2"/><rect x="7.4" y="16.7" width="12.6" height="3.6" rx="1.2"/></svg>',
  network: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><rect x="2.4" y="3.2" width="6.2" height="5" rx="1.4"/><rect x="2.4" y="15.8" width="6.2" height="5" rx="1.4"/><rect x="15.4" y="9.5" width="6.2" height="5" rx="1.4"/><path d="M8.6 5.7h2.6a1.6 1.6 0 0 1 1.6 1.6V12h2.2M8.6 18.3h2.6a1.6 1.6 0 0 0 1.6-1.6V12"/><path d="m13.6 10.2 1.8 1.8-1.8 1.8"/></svg>',
  map:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="2.9"/><circle cx="4.6" cy="4.6" r="2"/><circle cx="19.4" cy="4.6" r="2"/><circle cx="4.6" cy="19.4" r="2"/><circle cx="19.4" cy="19.4" r="2"/><path d="m6.1 6.1 3.8 3.8m8.2-3.8-3.8 3.8m-8.2 8.2 3.8-3.8m8.2 3.8-3.8-3.8"/></svg>',
  book:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><rect x="3.2" y="4.6" width="4.4" height="14.8" rx="1.1"/><rect x="8.8" y="4.6" width="4.4" height="14.8" rx="1.1"/><path d="m15.5 6.3 3.3-.9a1.1 1.1 0 0 1 1.4.8l2.6 9.9a1.1 1.1 0 0 1-.8 1.3l-3.3.9z"/><path d="M3.2 8.4h4.4M8.8 8.4h4.4"/></svg>',
  home:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11.5 12 4l8 7.5"/><path d="M6 10v9.5a1 1 0 0 0 1 1h3.2v-6h3.6v6H17a1 1 0 0 0 1-1V10"/></svg>',
  gear:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="3.2"/><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9a1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z"/></svg>',
  chev:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="m9 6 6 6-6 6"/></svg>',
  folder:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M3 6a1 1 0 0 1 1-1h4.6l1.8 2H20a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6z"/></svg>',
  fpdf:    '<svg viewBox="0 0 24 24" fill="none" stroke="#DD7B5C" stroke-width="1.7"><path d="M6 3h8l4 4v14H6V3z"/><path d="M14 3v4h4"/><path d="M9 13h1.6a1.2 1.2 0 0 1 0 2.4H9V13zM9 17.4V13"/></svg>',
  fmd:     '<svg viewBox="0 0 24 24" fill="none" stroke="#8CADD1" stroke-width="1.7"><rect x="3" y="6" width="18" height="12" rx="1.5"/><path d="M6.5 15V9.5l2.4 3 2.4-3V15M15 9.5V15m0 0 1.9-2M15 15l-1.9-2"/></svg>',
  ftex:    '<svg viewBox="0 0 24 24" fill="none" stroke="#DCB259" stroke-width="1.7"><path d="M6 3h8l4 4v14H6V3z"/><path d="M14 3v4h4"/><path d="M9 12h5m-2.5 0v5.5"/></svg>',
  fnb:     '<svg viewBox="0 0 24 24" fill="none" stroke="#9AC086" stroke-width="1.7"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 3v18M11 8h6M11 12h6M11 16h4"/></svg>',
  fimg:    '<svg viewBox="0 0 24 24" fill="none" stroke="#B08ACD" stroke-width="1.7"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="10" r="1.6"/><path d="m4 17 5-4.5 4 3.5 3-2.5 4 3.5"/></svg>',
  ffile:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M6 3h8l4 4v14H6V3z"/><path d="M14 3v4h4"/></svg>',
  x:       '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 6 12 12M18 6 6 18"/></svg>',
  refresh: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 11a8 8 0 1 0-.7 4.3"/><path d="M20 5v6h-6"/></svg>',
  collapse:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 9h6V3M19 15h-6v6"/></svg>',
  ext:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 4h6v6M20 4l-8.5 8.5"/><path d="M18 13.5V19a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5.5"/></svg>',
  pin:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M9.2 3.6h5.6l-.75 5.4 2.95 2.6v1.7H7v-1.7l2.95-2.6-.75-5.4z"/><path d="M12 13.3V20.4"/></svg>',
  pinOn:   '<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M9.2 3.6h5.6l-.75 5.4 2.95 2.6v1.7H7v-1.7l2.95-2.6-.75-5.4z"/><path d="M12 13.3V20.4" fill="none"/></svg>',
  check:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.5 4.5 4.5L19 7"/></svg>',
  search:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2"/></svg>',
  gridView:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3.5" y="3.5" width="7" height="7" rx="1.2"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.2"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.2"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.2"/></svg>',
  listView:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M8.2 6h12.3M8.2 12h12.3M8.2 18h12.3"/><path d="M3.5 6h.01M3.5 12h.01M3.5 18h.01"/></svg>'
};
const fileIcon = name => ({
  pdf: I.fpdf, md: I.fmd, latex: I.ftex, notebook: I.fnb,
  image: I.fimg, html: I.fmd, code: I.ffile, text: I.ffile
}[kindOf(name)] || I.ffile);

/* ---------- 2. Estado ------------------------------------- */

const state = {
  view: LS.get('view', 'files'),
  online: false,
  dirCache: new Map(),      // relPath -> [{name, path, isDir}]
  current: null,            // vista abierta: {id, title, kind, path}
  expanded: new Set(LS.get('expanded', [])),
  estados: estadosIniciales(),           // code -> pendiente|cursando|regular|aprobada
  passed: new Set(),                     // caché derivada: códigos en estado "aprobada"
  netMaps: readShared(NETMAPS_KEY, {}),   // code -> {tiene, link}, lo usa la Red
  netNotas: readShared(NOTAS_EST_KEY, {}), // code -> nota corta dejada al cambiar de estado
  notas: readShared(NOTAS_KEY, {}),      // code -> {notaFinal, aplazos:[...]}, para el promedio
  quizStats: readShared(QUIZ_KEY, {}),   // id de pregunta -> {vecesCorrecta, vecesIncorrecta, ultimaVez}
  recent: LS.get('recent', []),           // [{path, name}] lo último abierto, primero
  pinned: LS.get('pinned', []),           // códigos de materia fijados arriba del árbol
  todos: LS.get('todos', []),             // [{id, t, code, due, done}] tareas pendientes
  maps: LS.get('maps', {}), // code -> {files:[...]}  resultado del escaneo
  scanned: LS.get('scanned', false),
  fileIndex: LS.get('fileIndex', []),   // para la paleta Ctrl+P
  settings: LS.get('settings', {
    theme: 'win11', fontSize: 14,
    hideEmpty: false, openPdfExternal: false, defaultPane: 'files', math: true,
    netZoom: 100, anim: true, netUnlock: false
  })
};
const byCode = Object.fromEntries(SUBJECTS.map(s => [s.code, s]));

/* ---------- 2b. Correlativas (Red de asignaturas) ----------
   `correlativasCursar` bloquea la materia para cursar si esos códigos no
   están, al menos, "regular". `correlativasAprobar` es más estricto: exige
   "aprobada", y solo se usa para saber si ya se puede rendir el final.
----------------------------------------------------------- */

const estadoDe = code => state.estados[code] || 'pendiente';

/* Recalcula la caché de aprobadas: el resto de la app (Escritorio, barra de
   estado, respaldo JSON) sigue leyendo state.passed sin enterarse de que
   por dentro ahora hay 4 estados en vez de un booleano. */
function syncPassed() {
  state.passed = new Set(SUBJECTS.filter(s => estadoDe(s.code) === 'aprobada').map(s => s.code));
  writeShared(PASSED_KEY, [...state.passed]);
}

function calcularBloqueo(s) {
  return (s.correlativasCursar || []).some(c => !['regular', 'aprobada'].includes(estadoDe(c)));
}

function correlativasFaltantes(s) {
  return (s.correlativasCursar || []).filter(c => !['regular', 'aprobada'].includes(estadoDe(c)));
}

function puedeRendirFinal(s) {
  return (s.correlativasAprobar || []).every(c => estadoDe(c) === 'aprobada');
}

/* code -> [códigos que la tienen como correlativa para cursar]. Se arma una
   sola vez: SUBJECTS es estático, no hace falta recalcularlo. */
function mapaInverso(materias) {
  const inv = {};
  materias.forEach(s => (s.correlativasCursar || []).forEach(c => {
    (inv[c] = inv[c] || []).push(s.code);
  }));
  return inv;
}
const NET_INVERSO = mapaInverso(SUBJECTS);

/* DFS transitivo: todo lo que, directa o indirectamente, necesita `code`. */
function materiasQueDesbloquea(code, inv) {
  const vistos = new Set();
  const pila = [...(inv[code] || [])];
  while (pila.length) {
    const c = pila.pop();
    if (vistos.has(c)) continue;
    vistos.add(c);
    (inv[c] || []).forEach(x => pila.push(x));
  }
  return [...vistos];
}

/* Directas nada más: unión de las dos listas, sin duplicados. */
function correlativasDirectas(s) {
  return [...new Set([...(s.correlativasCursar || []), ...(s.correlativasAprobar || [])])];
}

/* Cambia el estado de una materia y recalcula el bloqueo de todas — no hace
   falta orden topológico porque el plan de estudios no tiene ciclos. */
function actualizarEstado(code, nuevoEstado) {
  state.estados[code] = nuevoEstado;
  writeShared(ESTADOS_KEY, state.estados);
  syncPassed();
}
syncPassed();

/* ---------- 2c. Simulador de promedio -----------------------
   Mismo criterio que SIU-Guaraní (sin ponderar por créditos ni por tipo de
   materia). notaFinal/aplazos se guardan en el navegador (state.notas),
   no en data.js: son datos personales del alumno, no del plan de estudios.
----------------------------------------------------------- */

const aprobadasConNota = () =>
  SUBJECTS.filter(s => estadoDe(s.code) === 'aprobada' && state.notas[s.code]?.notaFinal != null);

function promedioSinAplazos() {
  const datos = aprobadasConNota();
  if (!datos.length) return null;
  return datos.reduce((a, s) => a + state.notas[s.code].notaFinal, 0) / datos.length;
}

function promedioConAplazos() {
  const datos = aprobadasConNota();
  if (!datos.length) return null;
  let sumaNotas = 0, aplazos = [];
  datos.forEach(s => {
    sumaNotas += state.notas[s.code].notaFinal;
    aplazos.push(...(state.notas[s.code].aplazos || []));
  });
  const sumaAplazos = aplazos.reduce((a, b) => a + b, 0);
  return (sumaNotas + sumaAplazos) / (datos.length + aplazos.length);
}

/* Nota que hace falta, en promedio, en lo que queda del plan para llegar
   al objetivo. null si ya no quedan materias pendientes; > 10 significa
   que el objetivo ya no es alcanzable con lo que resta. */
function notaNecesaria(objetivo) {
  const total = SUBJECTS.length;
  const datos = aprobadasConNota();
  const pendientes = total - datos.length;
  if (pendientes <= 0) return null;
  const sumaActual = datos.reduce((a, s) => a + state.notas[s.code].notaFinal, 0);
  return (objetivo * total - sumaActual) / pendientes;
}

function saveNotas() { writeShared(NOTAS_KEY, state.notas); }

/* ---------- 2d. Banco de autoevaluaciones -------------------
   Las preguntas (enunciado, respuesta) viven en data.js, en QUESTIONS;
   son contenido curado, no cambian solas. Cuántas veces se acertó/falló
   cada una y cuándo se practicó por última vez sí cambia todo el tiempo,
   así que vive en el navegador, igual que notas y estados.
----------------------------------------------------------- */

const statsDe = qid => state.quizStats[qid] || { vecesCorrecta:0, vecesIncorrecta:0, ultimaVez:null };

const preguntasDe = code => QUESTIONS.filter(q => q.materiaId === code);

/* Peor ratio de fallo primero (las nunca practicadas cuentan como el peor
   caso); entre empates, la practicada hace más tiempo primero. */
function ordenarPreguntas(qs) {
  const prioridad = q => {
    const s = statsDe(q.id);
    const total = s.vecesCorrecta + s.vecesIncorrecta;
    return total ? s.vecesIncorrecta / total : 1;
  };
  const antiguedad = q => {
    const t = statsDe(q.id).ultimaVez;
    return t ? new Date(t).getTime() : -Infinity;
  };
  return [...qs].sort((a, b) => prioridad(b) - prioridad(a) || antiguedad(a) - antiguedad(b));
}

function registrarResultado(qid, acierto) {
  const s = statsDe(qid);
  acierto ? s.vecesCorrecta++ : s.vecesIncorrecta++;
  s.ultimaVez = new Date().toISOString();
  state.quizStats[qid] = s;
  writeShared(QUIZ_KEY, state.quizStats);
}

const DEFAULT_THEME = 'win11';

/* Ancho de la columna de archivos: ya no se elige a mano. Crece solo a
   medida que se despliegan subcarpetas más profundas, y se achica de
   nuevo si se contraen. */
const SIDEBAR_BASE = 260, SIDEBAR_STEP = 40, SIDEBAR_MAX = 460;
function updateSidebarWidth() {
  let depth = 0;
  $$('.node-children[data-depth]:not(.hidden)').forEach(k => {
    depth = Math.max(depth, +k.dataset.depth);
  });
  const px = Math.min(SIDEBAR_BASE + depth * SIDEBAR_STEP, SIDEBAR_MAX);
  document.documentElement.style.setProperty('--sidebar-w', px + 'px');
}

function applySettings() {
  /* Al cambiar el tema por defecto, se aplica una sola vez sobre lo ya guardado;
     después de eso manda siempre lo que elijas en Configuración. */
  if (LS.get('themeBase', null) !== DEFAULT_THEME) {
    LS.set('themeBase', DEFAULT_THEME);
    state.settings.theme = DEFAULT_THEME;
  }
  if (!THEMES.some(t => t.id === state.settings.theme)) state.settings.theme = DEFAULT_THEME;
  document.documentElement.dataset.theme = state.settings.theme;
  document.documentElement.dataset.anim = state.settings.anim === false ? 'off' : 'on';
  document.documentElement.style.setProperty('--fs', state.settings.fontSize + 'px');
  updateSidebarWidth();
  applyOnColors(document.documentElement, getComputedStyle(document.documentElement));
  LS.set('settings', state.settings);
  themeIframes();
  if (state.current && state.current.kind === 'correl' && viewCorrel._redraw) viewCorrel._redraw();
}

/* Texto legible sobre un color plano: elige negro o blanco según cuál
   contraste más con el fondo. Evita tener que fijar a mano el color del
   texto de chips y botones en cada uno de los temas. */
function onColor(css) {
  const c = (css || '').trim();
  let r, g, b;
  const hex = c.match(/^#([0-9a-fA-F]{3,8})$/);
  if (hex) {
    let h = hex[1];
    if (h.length < 6) h = h.slice(0, 3).split('').map(x => x + x).join('');
    r = parseInt(h.slice(0, 2), 16); g = parseInt(h.slice(2, 4), 16); b = parseInt(h.slice(4, 6), 16);
  } else {
    const m = c.match(/(\d+(?:\.\d+)?)[\s,]+(\d+(?:\.\d+)?)[\s,]+(\d+(?:\.\d+)?)/);
    if (!m) return '#161310';
    [r, g, b] = [m[1], m[2], m[3]].map(Number);
  }
  const lin = v => (v /= 255) <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  const L = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  /* Se compara contra los dos colores que realmente se usan, no contra el
     negro puro: #161310 tiene luminancia 0.0067, no 0. */
  return (L + 0.05) / 0.0567 >= 1.05 / (L + 0.05) ? '#161310' : '#FFFFFF';
}

const ON_VARS = ['accent', 'cb', 'tb', 'ta', 'co'];
function applyOnColors(target, src) {
  ON_VARS.forEach(v => target.style.setProperty('--on-' + v, onColor(src.getPropertyValue('--' + v))));
}

/* La red de asignaturas trae su propia paleta fija. Como se sirve desde el
   mismo origen, le copiamos las variables del tema activo para que la vista
   embebida no desentone. */
const IFRAME_VARS = ['bg','paper','panel','ink','ink-muted','border','border-soft',
                     'accent','accent-dark','accent-soft','cb','tb','ta','co'];
function themeIframes() {
  const mine = getComputedStyle(document.documentElement);
  $$('iframe.frame').forEach(f => {
    let doc;
    try { doc = f.contentDocument; } catch { return; }
    if (!doc || !doc.documentElement) return;
    const root = doc.documentElement.style;
    IFRAME_VARS.forEach(v => root.setProperty('--' + v, mine.getPropertyValue('--' + v).trim()));
    /* «Necesita» en rojo fuerte; «abre paso a» en el color del texto — blanco en
       los temas oscuros, y legible también en los claros. */
    root.setProperty('--prereq', mine.getPropertyValue('--dep-prereq').trim());
    root.setProperty('--unlocks', mine.getPropertyValue('--ink').trim());
    root.setProperty('--ink-dim', mine.getPropertyValue('--ink-dim').trim());
    applyOnColors(doc.documentElement, mine);
    /* La red mide todo en rem: cambiar la raíz escala tarjetas, textos y columnas. */
    if (f.classList.contains('net')) {
      root.setProperty('font-size', (16 * (state.settings.netZoom || 100) / 100).toFixed(2) + 'px');
      try {
        doc.defaultView.setOptions({
          unlock: state.settings.netUnlock === true,
          anim:   state.settings.anim !== false
        });
        /* Las flechas son SVG calculado a mano: hay que pedirle que las rehaga. */
        doc.defaultView.renderLines();
      } catch {}
    }
  });
}

/* ---------- 3. Acceso al sistema de archivos --------------
   Servido por un servidor estático (python -m http.server), el
   listado de directorios llega como HTML: lo parseamos.
   Con file:// no hay listados: se usa el árbol declarado en data.js.
----------------------------------------------------------- */

async function probeServer() {
  if (location.protocol === 'file:') { state.online = false; return false; }
  try {
    const r = await fetch(ROOT.href, { cache: 'no-store' });
    state.online = r.ok;
  } catch { state.online = false; }
  return state.online;
}

async function listDir(relPath) {
  if (state.dirCache.has(relPath)) return state.dirCache.get(relPath);
  if (!state.online) { state.dirCache.set(relPath, []); return []; }
  let out = [];
  try {
    const res = await fetch(urlFor(relPath + '/'), { cache: 'no-store' });
    if (res.ok) {
      const doc = new DOMParser().parseFromString(await res.text(), 'text/html');
      out = [...doc.querySelectorAll('a[href]')]
        .map(a => a.getAttribute('href'))
        .filter(h => h && !h.startsWith('/') && !h.startsWith('..') && !h.startsWith('?') && !h.startsWith('#'))
        .map(h => {
          const isDir = h.endsWith('/');
          const name = decodeURIComponent(isDir ? h.slice(0, -1) : h);
          return { name, isDir, path: relPath + '/' + name };
        })
        .filter(f => !f.name.startsWith('.'))
        .sort((a, b) => (b.isDir - a.isDir) || a.name.localeCompare(b.name, 'es'));
    }
  } catch { out = []; }
  state.dirCache.set(relPath, out);
  return out;
}

async function fetchText(relPath) {
  const r = await fetch(urlFor(relPath), { cache: 'no-store' });
  if (!r.ok) throw new Error('HTTP ' + r.status);
  return r.text();
}

/* ---------- 4. Barra de actividad -------------------------- */

/* Seis secciones, cada una una ventana completa. No hay panel lateral. */
const VIEWS = [
  { id:'dashboard', icon:I.home,    title:'Inicio' },
  { id:'files',   icon:I.files,   title:'Explorador' },
  { id:'correl',  icon:I.network, title:'Red de asignaturas' },
  { id:'maps',    icon:I.map,     title:'Mapas conceptuales' },
  { id:'library', icon:I.book,    title:'Librería' },
  { id:'config',  icon:I.gear,    title:'Configuración' }
];

function renderRail() {
  const rail = $('#rail');
  rail.innerHTML = '';
  VIEWS.forEach((v, i) => {
    if (v.id === 'config') rail.appendChild(el('div', 'rail-spacer'));
    const b = el('button', 'rail-btn' + (state.view === v.id ? ' active' : ''), v.icon);
    b.title = v.title + '  (Ctrl+' + (i + 1) + ')';
    b.onclick = () => setView(v.id);
    rail.appendChild(b);
  });
}

function setView(id) {
  const v = VIEWS.find(x => x.id === id);
  state.view = id;
  LS.set('view', id);
  renderRail();
  /* Cada sección es una ventana completa: el clic en el rail la abre. */
  openTab({ id, title:v.title, kind:id });
}

/* ---------- 5. Sidebar ------------------------------------- */

/* --- 5a. Explorador de archivos --- */

/* Columna de archivos de la ventana del Explorador. Antes era el panel lateral;
   ahora vive dentro de la vista, con sus propias acciones. */
function xpTree(host) {
  const head = el('div', 'xp-h', '<span>Archivos</span>');
  const acts = el('span', 'acts');
  [[I.refresh, 'Volver a leer las carpetas', () => {
      state.dirCache.clear(); renderViewport(); toast('Carpetas releídas');
    }],
   [I.collapse, 'Contraer todo', () => {
      state.expanded.clear(); LS.set('expanded', []); renderViewport();
    }]].forEach(([ico, tit, fn]) => {
    const b = el('button', 'icon-btn', ico);
    b.title = tit; b.onclick = fn;
    acts.appendChild(b);
  });
  head.appendChild(acts);
  host.appendChild(head);

  const body = el('div', 'xp-tree-body');
  host.appendChild(body);

  const wrap = el('div', 'search-wrap');
  const inp = el('input', 'search-input');
  inp.placeholder = 'Filtrar asignaturas…';
  inp.value = state._filter || '';
  inp.oninput = () => { state._filter = inp.value; drawTree(); };
  wrap.appendChild(inp);
  body.appendChild(wrap);

  const tree = el('div', 'tree');
  body.appendChild(tree);

  function drawTree() {
    tree.innerHTML = '';
    const q = (state._filter || '').toLowerCase().trim();

    if (!q || 'libreria librería libros bibliografia bibliografía'.includes(q)) {
      const lib = dirNode(LIBRARY_DIR, 'Librería', 0,
        'Los libros de toda la carrera, fuera del plan de estudios', I.book);
      lib.style.marginBottom = '10px';
      tree.appendChild(lib);
    }

    SEMESTERS.forEach((semLabel, semIdx) => {
      let subs = SUBJECTS.filter(s => s.sem === semIdx);
      if (q) subs = subs.filter(s =>
        (s.name + ' ' + s.code + ' ' + s.concepts.join(' ')).toLowerCase().includes(q));
      if (!subs.length) return;
      tree.appendChild(semNode(semLabel, semIdx, subs, !!q));
    });
  }

  function semNode(label, idx, subs, forceOpen) {
    const key = 'sem:' + idx;
    const open = forceOpen || state.expanded.has(key);
    const box = el('div');
    const row = el('div', 'node-row' + (open ? ' open' : ''));
    row.innerHTML = `<span class="chev">${I.chev}</span>
      <span class="ico" style="color:var(--ink-muted)">${I.folder}</span>
      <span class="lbl" style="font-weight:600">${esc(label)}</span>
      <span class="code">${subs.length}</span>`;
    const kids = el('div', 'node-children' + (open ? '' : ' hidden'));
    subs.forEach(s => kids.appendChild(subjectNode(s)));
    row.onclick = () => { toggle(key, row, kids); };
    box.append(row, kids);
    return box;
  }

  function subjectNode(s) {
    const key = 'sub:' + s.code;
    const open = state.expanded.has(key);
    const box = el('div');
    const row = el('div', 'node-row' + (open ? ' open' : ''));
    const fijada = state.pinned.includes(s.code);
    row.innerHTML = `<span class="chev">${I.chev}</span>
      <span class="lbl">${esc(s.name)}</span>
      <span class="pin${fijada ? ' on' : ''}">${fijada ? I.pinOn : I.pin}</span>
      <span class="code">${s.code}</span>`;
    row.querySelector('.pin').title = fijada ? 'Quitar de Anclados' : 'Anclar arriba del árbol';
    row.querySelector('.pin').onclick = e => { e.stopPropagation(); togglePin(s.code); };
    row.title = s.dir;
    const kids = el('div', 'node-children' + (open ? '' : ' hidden'));
    SUBFOLDERS.forEach(f => kids.appendChild(dirNode(s.dir + '/' + f.key, f.label, 1, f.hint)));
    row.onclick = e => {
      if (e.detail === 2) { openSubject(s.code); return; }
      toggle(key, row, kids);
    };
    row.oncontextmenu = e => { e.preventDefault(); openSubject(s.code); };
    box.append(row, kids);
    return box;
  }

  /* Nodo de carpeta real: se lista por demanda contra el servidor */
  function dirNode(relPath, label, depth, hint, icon) {
    const key = 'dir:' + relPath;
    const open = state.expanded.has(key);
    const box = el('div');
    const row = el('div', 'node-row' + (open ? ' open' : ''));
    row.innerHTML = `<span class="chev">${I.chev}</span>
      <span class="ico" style="color:${icon ? 'var(--accent)' : 'var(--ink-dim)'}">${icon || I.folder}</span>
      <span class="lbl"${icon ? ' style="font-weight:600"' : ''}>${esc(label)}</span>
      <span class="code" data-cnt></span>`;
    if (hint) row.title = hint;
    const kids = el('div', 'node-children' + (open ? '' : ' hidden'));
    kids.dataset.depth = depth;
    let loaded = false;

    async function load() {
      if (loaded) return;
      loaded = true;
      kids.innerHTML = '<div class="tree-empty">leyendo…</div>';
      const items = await listDir(relPath);
      kids.innerHTML = '';
      row.querySelector('[data-cnt]').textContent = items.length || '';
      if (!items.length) {
        kids.innerHTML = state.online
          ? '<div class="tree-empty">vacía</div>'
          : '<div class="tree-empty">sin servidor — ver Configuración</div>';
        return;
      }
      items.forEach(it => {
        if (it.isDir) { kids.appendChild(dirNode(it.path, it.name, depth + 1)); return; }
        const f = el('div', 'node-row');
        f.innerHTML = `<span style="width:12px;flex:0 0 12px"></span>
          <span class="ico">${fileIcon(it.name)}</span>
          <span class="lbl">${esc(it.name)}</span>`;
        f.title = it.path;
        f.onclick = () => { markSelected(f); openFile(it.path); };
        kids.appendChild(f);
      });
      updateSidebarWidth();
    }
    if (open) load();
    row.onclick = () => { toggle(key, row, kids); if (state.expanded.has(key)) load(); };
    box.append(row, kids);
    return box;
  }

  function toggle(key, row, kids) {
    if (state.expanded.has(key)) state.expanded.delete(key); else state.expanded.add(key);
    row.classList.toggle('open');
    kids.classList.toggle('hidden');
    LS.set('expanded', [...state.expanded]);
    updateSidebarWidth();
  }

  function markSelected(node) {
    $$('.node-row.selected').forEach(n => n.classList.remove('selected'));
    node.classList.add('selected');
  }

  drawTree();
  updateSidebarWidth();
}

/* Repinta un bloque sin tocar el resto del panel: así abrir un archivo desde el
   árbol no pierde el scroll ni cierra las carpetas que tenías desplegadas. */
function repaintBlock(cuerpo, pintar, cuenta) {
  if (!cuerpo || !document.body.contains(cuerpo)) return false;
  cuerpo.innerHTML = '';
  pintar(cuerpo);
  cuerpo._head.querySelector('.blk-n').textContent = cuenta || '';
  return true;
}

/* Anclar es para las materias del cuatrimestre en curso: quedan a un clic,
   sin desplegar semestre por semestre. */
function togglePin(code) {
  state.pinned = state.pinned.includes(code)
    ? state.pinned.filter(c => c !== code)
    : [...state.pinned, code];
  LS.set('pinned', state.pinned);
  repaintBlock(drawPinned._box, drawPinned, state.pinned.length);
  /* La chincheta del árbol tiene que reflejarlo sin redibujar el panel entero. */
  $$('.tree .node-row').forEach(row => {
    const pin = row.querySelector('.pin');
    if (!pin || row.querySelector('.code')?.textContent !== code) return;
    const on = state.pinned.includes(code);
    pin.className = 'pin' + (on ? ' on' : '');
    pin.innerHTML = on ? I.pinOn : I.pin;
    pin.title = on ? 'Quitar de Anclados' : 'Anclar arriba del árbol';
  });
}

function drawPinned(cuerpo) {
  if (!state.pinned.length) {
    cuerpo.appendChild(el('div', 'tree-empty',
      'Anclá acá las materias que estás cursando, con la chincheta de cada fila.'));
    return;
  }
  const tree = el('div', 'tree');
  state.pinned.forEach(code => {
    const s = byCode[code];
    if (!s) return;
    const row = el('div', 'node-row');
    row.innerHTML = `<span style="width:12px;flex:0 0 12px"></span>
      <span class="lbl">${esc(s.name)}</span>
      <span class="pin on">${I.pinOn}</span>
      <span class="code">${s.code}</span>`;
    row.title = s.dir + '  ·  clic para abrir la ficha';
    row.onclick = () => openSubject(code);
    const pin = row.querySelector('.pin');
    pin.title = 'Quitar de Anclados';
    pin.onclick = e => { e.stopPropagation(); togglePin(code); };
    tree.appendChild(row);
  });
  cuerpo.appendChild(tree);
}

function drawRecent(cuerpo) {
  if (!state.recent.length) {
    cuerpo.appendChild(el('div', 'tree-empty', 'Todavía no abriste ningún archivo.'));
    return;
  }
  const tree = el('div', 'tree');
  state.recent.forEach(r => {
    const row = el('div', 'node-row');
    row.innerHTML = `<span style="width:12px;flex:0 0 12px"></span>
      <span class="ico">${fileIcon(r.name)}</span>
      <span class="lbl">${esc(r.name)}</span>`;
    row.title = r.path;
    row.onclick = () => openFile(r.path);
    tree.appendChild(row);
  });
  cuerpo.appendChild(tree);
}

/* ---------- Ventana del Explorador -------------------------
   Una sola vista a todo el ancho: el árbol de archivos como columna fija a la
   izquierda y, al lado, el tablero con lo que estás cursando, las tareas
   pendientes, las materias ancladas y lo último abierto. No hay panel
   lateral: todo vive acá adentro.
----------------------------------------------------------- */

/* Tarjeta del tablero: encabezado con contador y acciones, cuerpo que pinta
   quien la llama. Cada tarjeta se repinta sola con repaintBlock(). */
function xpCard(host, titulo, pintar, cuenta, acciones) {
  const card = el('div', 'xp-card');
  const head = el('div', 'xp-h', `<span>${esc(titulo)}</span>
    <span class="blk-n">${cuenta || ''}</span>`);
  const acts = el('span', 'acts');
  (acciones || []).forEach(a => {
    const b = el('button', 'icon-btn', a.icon);
    b.title = a.title;
    b.onclick = a.run;
    acts.appendChild(b);
  });
  head.appendChild(acts);
  const cuerpo = el('div', 'xp-card-body');
  cuerpo._head = head;
  card.append(head, cuerpo);
  host.appendChild(card);
  pintar(cuerpo);
  return cuerpo;
}

/* --- 5c. Inicio (Dashboard) --------------------------------
   Cruza datos de todas las secciones en un solo lugar: no reemplaza a
   `.welcome` (esa sigue siendo la pantalla de bienvenida sin materia
   abierta) — esto es una vista más, para no entrar sección por sección
   a ver qué hay pendiente.
----------------------------------------------------------- */

function pendientesUrgentes() {
  return ordenarTodos(state.todos.filter(t => !t.done)).slice(0, 5);
}

function actividadReciente() {
  return state.recent.slice(0, 5);
}

function progresoGeneral() {
  const total = SUBJECTS.length;
  const aprobadas = state.passed.size;
  return { aprobadas, total, pct: total ? Math.round((aprobadas / total) * 100) : 0 };
}

function viewDashboard(vp) {
  const pane = el('div', 'pane');
  const prog = progresoGeneral();
  pane.innerHTML = `
    <div class="pane-head"><div>
      <h1>Inicio</h1>
      <p class="lead">Lo pendiente más urgente, lo último que abriste y cuánto llevás del
        plan de estudios, todo junto — sin entrar sección por sección.</p>
    </div></div>

    <div class="section-title">Pendientes urgentes</div>
    <div class="td-list" id="db-todos"></div>

    <div class="section-title">Actividad reciente</div>
    <div class="grid g4" id="db-recent"></div>

    <div class="section-title">Progreso general</div>
    <div class="nt-stat" style="--u:16px;align-items:flex-start">
      <b>${prog.aprobadas} / ${prog.total}</b>
      <span>Materias aprobadas · ${prog.pct}%</span>
      <div class="nt-track" style="width:280px">
        <div class="nt-fill" style="width:${prog.pct}%"></div>
      </div>
    </div>

    <div class="section-title">Promedio</div>
    <div class="grid g3">
      <div class="card flat">
        <div class="c-code">sin aplazos</div>
        <div class="c-name" id="db-prom-sin">—</div>
        <div class="c-meta">El que se usa informalmente.</div>
      </div>
      <div class="card flat">
        <div class="c-code">con aplazos</div>
        <div class="c-name" id="db-prom-con">—</div>
        <div class="c-meta">El que pide el certificado analítico.</div>
      </div>
      <div class="card flat">
        <div class="c-code">simulador</div>
        <div style="display:flex;gap:6px;margin-top:4px">
          <input class="ctl" id="db-obj" type="number" min="4" max="10" step="0.1"
            placeholder="Promedio objetivo" style="width:100%">
        </div>
        <div class="c-meta" id="db-sim" style="margin-top:8px"></div>
      </div>
    </div>`;
  vp.appendChild(pane);

  const fmt = n => n == null ? '—' : n.toFixed(2);
  pane.querySelector('#db-prom-sin').textContent = fmt(promedioSinAplazos());
  pane.querySelector('#db-prom-con').textContent = fmt(promedioConAplazos());

  const obj = pane.querySelector('#db-obj'), simOut = pane.querySelector('#db-sim');
  const simular = () => {
    const objetivo = Number(obj.value);
    if (!obj.value || Number.isNaN(objetivo)) { simOut.textContent = ''; return; }
    const necesaria = notaNecesaria(objetivo);
    if (necesaria == null) simOut.textContent = 'Ya no quedan materias pendientes.';
    else if (necesaria > 10) simOut.textContent = 'No se alcanza con las materias que quedan.';
    else simOut.innerHTML = `Necesitás <b>${necesaria.toFixed(2)}</b> de promedio en lo que falta.`;
  };
  obj.oninput = simular;

  const tbox = pane.querySelector('#db-todos');
  const urgentes = pendientesUrgentes();
  if (!urgentes.length) {
    tbox.appendChild(el('div', 'tree-empty', 'Sin pendientes urgentes. Vas al día.'));
  } else {
    urgentes.forEach(t => {
      const row = todoRow(t, { conMateria:true });
      row.onclick = () => openTab({ id:'todos', title:'Pendientes', kind:'todos' });
      tbox.appendChild(row);
    });
  }

  const rbox = pane.querySelector('#db-recent');
  const recientes = actividadReciente();
  if (!recientes.length) {
    rbox.appendChild(el('div', 'empty', 'Todavía no abriste ningún archivo.'));
  } else {
    recientes.forEach(r => {
      const c = el('div', 'card flat');
      c.innerHTML = `<div class="c-code">${esc(extOf(r.name).toUpperCase())}</div>
        <div class="c-name">${esc(r.name)}</div>`;
      c.onclick = () => openFile(r.path);
      rbox.appendChild(c);
    });
  }
}

function viewFiles(vp) {
  const root = el('div', 'xp');
  const col = el('div', 'xp-tree');
  const board = el('div', 'xp-board');
  root.append(col, board);
  vp.appendChild(root);

  xpTree(col);

  const done = SUBJECTS.filter(s => state.passed.has(s.code)).length;
  const cursando = SEMESTERS[
    SEMESTERS.findIndex((_, i) =>
      SUBJECTS.some(s => s.sem === i && !state.passed.has(s.code)))] || SEMESTERS[0];
  board.appendChild(el('div', 'xp-lead', `
    <h2>Escritorio</h2>
    <p>${esc(cursando)} · ${done} de ${SUBJECTS.length} asignaturas aprobadas ·
       ${state.todos.filter(t => !t.done).length} pendientes</p>`));

  const cards = el('div', 'xp-cards');
  board.appendChild(cards);

  drawTodos._box = xpCard(cards, 'Pendientes', drawTodos,
    state.todos.filter(t => !t.done).length,
    [{ icon:I.ext, title:'Ver todas', run:() => openTab({ id:'todos', title:'Pendientes', kind:'todos' }) }]);

  drawPinned._box = xpCard(cards, 'Anclados', drawPinned, state.pinned.length, []);

  drawRecent._box = xpCard(cards, 'Recientes', drawRecent, state.recent.length,
    [{ icon:I.x, title:'Vaciar la lista', run(){
      state.recent = []; LS.set('recent', []);
      repaintBlock(drawRecent._box, drawRecent, 0);
    } }]);
}

/* ---------- Materia con autocompletado ----------------------
   Se escribe el código o parte del nombre y la lista se va filtrando sola.
   La usa Pendientes para asociar una tarea a una materia.
----------------------------------------------------------- */
function subjectInput(lista, attrs) {
  return `<input class="ctl" list="${lista}" autocomplete="off" ${attrs}>
    <datalist id="${lista}">${SUBJECTS.map(x =>
      `<option value="${esc(x.code + ' · ' + x.name)}"></option>`).join('')}</datalist>`;
}

/* Del texto escrito al código de materia. Acepta el código suelto, la opción
   completa de la lista, o parte del nombre. Sin coincidencia devuelve null. */
function subjectFrom(txt) {
  const v = (txt || '').trim();
  if (!v) return null;
  const cod = v.split(/[\s·]+/)[0].toUpperCase();
  if (byCode[cod]) return cod;
  const n = v.toLowerCase();
  const s = SUBJECTS.find(x => x.name.toLowerCase() === n)
         || SUBJECTS.find(x => x.name.toLowerCase().includes(n));
  return s ? s.code : null;
}

/* ---------- Pendientes -------------------------------------
   Tareas cortas con materia y fecha opcionales. Viven en el navegador,
   igual que el avance, y entran en el respaldo JSON de Configuración.
----------------------------------------------------------- */

const hoyISO = () => {
  const d = new Date();
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
};

/* Días entre hoy y una fecha ISO. Negativo = ya pasó. */
function diasHasta(iso) {
  if (!iso) return null;
  const ms = new Date(iso + 'T00:00').getTime() - new Date(hoyISO() + 'T00:00').getTime();
  return Math.round(ms / 86400000);
}

function cuando(iso) {
  const d = diasHasta(iso);
  if (d == null) return { txt:'', cls:'' };
  if (d < -1) return { txt:`hace ${-d} d`, cls:'late' };
  if (d === -1) return { txt:'ayer', cls:'late' };
  if (d === 0) return { txt:'hoy', cls:'late' };
  if (d === 1) return { txt:'mañana', cls:'soon' };
  if (d <= 7) return { txt:`en ${d} d`, cls:'soon' };
  return { txt:new Date(iso + 'T00:00').toLocaleDateString('es-AR',
           { day:'numeric', month:'short' }), cls:'' };
}

/* Vencidas primero, después por fecha, y las sin fecha al final. */
function ordenarTodos(lista) {
  return [...lista].sort((a, b) => {
    if (!a.due && !b.due) return b.id - a.id;
    if (!a.due) return 1;
    if (!b.due) return -1;
    return a.due.localeCompare(b.due) || b.id - a.id;
  });
}

function saveTodos() {
  LS.set('todos', state.todos);
  buildSearchIndex();
  repaintBlock(drawTodos._box, drawTodos, state.todos.filter(t => !t.done).length);
  if (state.current && state.current.kind === 'todos') renderViewport();
}

function addTodo(texto, code, due) {
  const t = texto.trim();
  if (!t) return null;
  const nuevo = { id: Date.now(), t, code: code || null, due: due || null, done: false };
  state.todos.unshift(nuevo);
  saveTodos();
  return nuevo;
}

function toggleTodo(id) {
  const t = state.todos.find(x => x.id === id);
  if (t) { t.done = !t.done; saveTodos(); }
}

function delTodo(id) {
  state.todos = state.todos.filter(x => x.id !== id);
  saveTodos();
}

/* Fila de tarea, la misma en el panel y en la vista completa. */
function todoRow(t, { conMateria } = {}) {
  const row = el('div', 'td' + (t.done ? ' done' : ''));
  const w = cuando(t.due);
  const s = t.code && byCode[t.code];
  row.innerHTML = `
    <span class="td-box">${I.check}</span>
    <span class="td-t">${esc(t.t)}</span>
    ${conMateria && s ? `<span class="td-sub">${s.code}</span>` : ''}
    ${w.txt ? `<span class="td-when ${w.cls}">${w.txt}</span>` : ''}`;
  row.querySelector('.td-box').onclick = e => { e.stopPropagation(); toggleTodo(t.id); };
  if (s) row.title = s.name;
  return row;
}

/* --- Bloque del panel --- */

function drawTodos(cuerpo) {
  const alta = el('input', 'search-input td-add');
  alta.placeholder = 'Nueva tarea…  (Enter)';
  alta.onkeydown = e => {
    if (e.key !== 'Enter') return;
    /* Agregar repinta el bloque: hay que devolverle el foco para poder
       escribir varias tareas seguidas sin volver a hacer clic. */
    drawTodos._focus = true;
    if (addTodo(alta.value)) toast('Tarea agregada');
    drawTodos._focus = false;
  };
  const caja = el('div', 'search-wrap');
  caja.appendChild(alta);
  cuerpo.appendChild(caja);
  if (drawTodos._focus) requestAnimationFrame(() => alta.focus());

  const abiertas = ordenarTodos(state.todos.filter(t => !t.done));
  if (!abiertas.length) {
    cuerpo.appendChild(el('div', 'tree-empty', 'Sin pendientes. Escribí arriba para agregar una.'));
    return;
  }
  const lista = el('div', 'tree');
  abiertas.slice(0, 6).forEach(t => {
    const row = todoRow(t, { conMateria:true });
    row.onclick = () => openTab({ id:'todos', title:'Pendientes', kind:'todos' });
    lista.appendChild(row);
  });
  cuerpo.appendChild(lista);

  if (abiertas.length > 6) {
    const mas = el('div', 'tree-empty', `y ${abiertas.length - 6} más — ver todas`);
    mas.style.cursor = 'pointer';
    mas.onclick = () => openTab({ id:'todos', title:'Pendientes', kind:'todos' });
    cuerpo.appendChild(mas);
  }
}

/* --- Vista completa --- */

function viewTodos(vp) {
  const pane = el('div', 'pane');
  const abiertas = ordenarTodos(state.todos.filter(t => !t.done));
  const hechas = state.todos.filter(t => t.done);
  const vencidas = abiertas.filter(t => t.due && diasHasta(t.due) < 0).length;

  pane.innerHTML = `
    <div class="pane-head"><div>
      <h1>Pendientes</h1>
      <p class="lead">Tareas cortas de la carrera: entregas, trámites, lo que quieras acordarte.
        ${abiertas.length} sin hacer${vencidas ? `, <b style="color:var(--err)">${vencidas} vencida${vencidas > 1 ? 's' : ''}</b>` : ''}.</p>
    </div></div>

    <div class="td-form">
      <input class="ctl" id="td-t" placeholder="Qué hay que hacer" style="flex:1;min-width:220px">
      ${subjectInput('td-subj', 'id="td-c" placeholder="Materia (opcional)" style="min-width:200px"')}
      <input class="ctl" id="td-d" type="date" style="min-width:150px">
      <button class="btn primary" id="td-add">Agregar</button>
    </div>

    <div id="td-open"></div>
    <div id="td-done"></div>`;
  vp.appendChild(pane);

  const txt = pane.querySelector('#td-t');
  const sel = pane.querySelector('#td-c');
  const fec = pane.querySelector('#td-d');
  const agregar = () => {
    if (addTodo(txt.value, subjectFrom(sel.value), fec.value)) { txt.value = ''; fec.value = ''; }
  };
  pane.querySelector('#td-add').onclick = agregar;
  txt.onkeydown = e => { if (e.key === 'Enter') agregar(); };

  /* Grupos por urgencia: es la pregunta que uno le hace a una lista de tareas. */
  const grupos = [
    ['Vencidas',   t => t.due && diasHasta(t.due) < 0],
    ['Hoy',        t => t.due && diasHasta(t.due) === 0],
    ['Esta semana',t => t.due && diasHasta(t.due) > 0 && diasHasta(t.due) <= 7],
    ['Más adelante', t => t.due && diasHasta(t.due) > 7],
    ['Sin fecha',  t => !t.due]
  ];
  const cont = pane.querySelector('#td-open');
  grupos.forEach(([titulo, filtro]) => {
    const items = abiertas.filter(filtro);
    if (!items.length) return;
    cont.appendChild(el('div', 'section-title', esc(titulo)));
    const caja = el('div', 'td-list');
    items.forEach(t => caja.appendChild(todoFull(t)));
    cont.appendChild(caja);
  });

  if (hechas.length) {
    const d = pane.querySelector('#td-done');
    const head = el('div', 'section-title', `Hechas (${hechas.length})`);
    const limpiar = el('button', 'btn', 'Borrar las hechas');
    limpiar.style.cssText = 'margin-left:auto;font-size:var(--t-sm)';
    limpiar.onclick = () => {
      state.todos = state.todos.filter(t => !t.done);
      saveTodos(); toast('Tareas hechas borradas');
    };
    head.appendChild(limpiar);
    d.appendChild(head);
    const caja = el('div', 'td-list');
    hechas.slice(0, 40).forEach(t => caja.appendChild(todoFull(t)));
    d.appendChild(caja);
  }
}

function todoFull(t) {
  const row = todoRow(t, { conMateria:false });
  row.classList.add('wide');
  const s = t.code && byCode[t.code];
  if (s) {
    const chip = el('span', 'pill');
    chip.textContent = s.code + ' · ' + s.name;
    chip.style.cursor = 'pointer';
    chip.onclick = e => { e.stopPropagation(); openSubject(s.code); };
    row.insertBefore(chip, row.querySelector('.td-when'));
  }
  const x = el('button', 'icon-btn td-del', I.x);
  x.title = 'Borrar';
  x.onclick = e => { e.stopPropagation(); delTodo(t.id); };
  row.appendChild(x);
  return row;
}

/* ---------- 6. Vista abierta -------------------------------- */

/* Una sola vista a la vez: abrir algo reemplaza lo que estuviera. */
function openTab(tab) {
  state.current = tab;
  renderViewport();
}

function closeCurrent() {
  state.current = null;
  renderViewport();
}

function renderStatus() {
  state.estados = readShared(ESTADOS_KEY, state.estados);   // la red puede haberlo cambiado
  syncPassed();
  const t = state.current;
  $('#statusbar').innerHTML = `
    <span class="sb-item"><span class="sb-dot ${state.online ? 'on' : ''}"></span>
      ${state.online ? 'servidor local' : 'sin servidor'}</span>
    <span class="sb-item">${SUBJECTS.length} asignaturas</span>
    <span class="sb-item">${state.passed.size} aprobadas</span>
    <span class="sb-item" style="margin-left:auto">${t ? esc(t.path || t.title) : 'Ctrl+P para buscar'}</span>`;
}

/* ---------- 7. Viewport ------------------------------------ */

function renderViewport() {
  const vp = $('#viewport');
  vp.innerHTML = '';
  const t = state.current;
  if (!t) { vp.appendChild(viewWelcome()); renderStatus(); return; }
  ({
    dashboard: viewDashboard,
    file: viewFile, files: viewFiles, correl: viewCorrel, todos: viewTodos,
    maps: viewMaps, library: viewLibrary,
    config: viewConfig, subject: viewSubject, quiz: viewQuiz, book: viewBook
  })[t.kind](vp, t);
  renderStatus();
}

/* --- 7a. Bienvenida --- */

function viewWelcome() {
  const w = el('div', 'welcome');
  const done = SUBJECTS.filter(s => state.passed.has(s.code)).length;
  w.innerHTML = `
    <h1>Centro de recursos academicos - Ingenieria Aeroespacial</h1>
    <p class="sub">Tus carpetas, apuntes, mapas y libros de la carrera, en un solo lugar.</p>
    <div class="wcols">
      <div>
        <h4>Empezar</h4>
        <div class="wlist" id="w-start"></div>
      </div>
      <div>
        <h4>Atajos</h4>
        <div class="wlist" style="color:var(--ink-muted)">
          <div><span class="kbd">Ctrl</span> <span class="kbd">P</span>&nbsp; buscar archivo o materia</div>
          <div><span class="kbd">Ctrl</span> <span class="kbd">1…6</span>&nbsp; cambiar de sección</div>
          <div><span class="kbd">Ctrl</span> <span class="kbd">B</span>&nbsp; plegar la barra lateral</div>
          <div><span class="kbd">Ctrl</span> <span class="kbd">W</span>&nbsp; volver al inicio</div>
          <div>Doble clic en una materia&nbsp; abre su ficha</div>
        </div>
      </div>
    </div>
    <div class="wsteps">
      <b>Estado:</b> ${state.online
        ? 'leyendo las carpetas reales del repositorio desde el servidor local.'
        : 'abriste el archivo directamente (<code>file://</code>), así que el navegador no puede listar carpetas. Ejecutá <code>abrir-aula.cmd</code> en la raíz del proyecto para levantar el servidor local y ver tus archivos.'}
      <br><b>Progreso:</b> ${done} de ${SUBJECTS.length} asignaturas marcadas como aprobadas.
    </div>`;
  const start = w.querySelector('#w-start');
  [
    ['Ir a Inicio', () => openTab({ id:'dashboard', title:'Inicio', kind:'dashboard' })],
    ['Explorar mis carpetas', () => setView('files')],
    ['Ver la Red de asignaturas', () => openTab({ id:'correl', title:'Red de asignaturas', kind:'correl' })],
    ['Ver los mapas conceptuales', () => openTab({ id:'maps', title:'Mapas conceptuales', kind:'maps' })],
    ['Abrir la librería', () => openTab({ id:'library', title:'Librería', kind:'library' })],
    ['Configuración', () => openTab({ id:'config', title:'Configuración', kind:'config' })]
  ].forEach(([label, fn]) => {
    const a = el('a', null, label);
    a.onclick = fn;
    start.appendChild(a);
  });
  return w;
}

/* --- 7b. Archivos --- */

async function viewFile(vp, t) {
  const kind = kindOf(t.title);
  const url = urlFor(t.path);

  if (kind === 'pdf' || kind === 'html') {
    const f = el('iframe', 'frame' + (kind === 'html' ? ' dark' : ''));
    f.src = url;
    vp.appendChild(f);
    return;
  }
  if (kind === 'image') {
    vp.appendChild(el('div', 'img-view', `<img src="${url}" alt="${esc(t.title)}">`));
    return;
  }
  if (kind === 'binary') {
    vp.appendChild(el('div', 'pane', `<h1>${esc(t.title)}</h1>
      <p class="lead">No puedo mostrar este tipo de archivo dentro de la interfaz.</p>
      <p style="margin-top:16px"><a class="btn" href="${url}" target="_blank">Abrirlo fuera ${I.ext}</a></p>`));
    return;
  }

  const box = el('div', 'doc', '<p style="color:var(--ink-muted)">Cargando…</p>');
  vp.appendChild(box);
  let raw;
  try { raw = await fetchText(t.path); }
  catch (e) {
    box.innerHTML = `<h1>No pude leer el archivo</h1>
      <p class="lead">${esc(String(e.message))} — ${esc(t.path)}</p>`;
    return;
  }
  if (kind === 'md') {
    box.innerHTML = mdToHtml(raw);
    assignBlocks(box);
    indexarBloques(t.path, t.title, raw, 'md');
  } else if (kind === 'notebook') {
    box.remove();
    vp.appendChild(renderNotebook(raw, t.title));
    indexarBloques(t.path, t.title, raw, 'notebook');
  } else if (kind === 'latex')box.innerHTML = `<h1>${esc(t.title)}</h1>${renderLatex(raw)}`;
  else                      box.innerHTML = `<h1>${esc(t.title)}</h1><pre><code>${esc(raw)}</code></pre>`;
}

const RECENT_MAX = 8;

function pushRecent(path) {
  const lista = state.recent.filter(r => r.path !== path);
  lista.unshift({ path, name: baseName(path) });
  state.recent = lista.slice(0, RECENT_MAX);
  LS.set('recent', state.recent);
  repaintBlock(drawRecent._box, drawRecent, state.recent.length);
}

function openFile(path) {
  pushRecent(path);
  openTab({ id:'f:' + path, title:baseName(path), kind:'file', path });
}

/* --- 7c. Fórmulas --------------------------------------------
   KaTeX vive en vendor/katex/ (sin CDN, funciona sin internet).
   Si por lo que fuera no cargó, se cae con elegancia a la fuente
   monoespaciada, que es como se veía antes.
--------------------------------------------------------------- */

function renderMath(tex, display) {
  tex = tex.trim();
  if (!window.katex || state.settings.math === false) {
    return `<span class="math-src${display ? '-block' : ''}">${esc(tex)}</span>`;
  }
  try {
    return katex.renderToString(tex, {
      displayMode: !!display,
      throwOnError: false,
      strict: false,
      trust: false,
      macros: MATH_MACROS
    });
  } catch (e) {
    return `<span class="tex-error" title="${esc(e.message)}">${esc(tex)}</span>`;
  }
}

/* Abreviaturas propias para las fórmulas: agregá las que uses en tus apuntes.
   La clave es el comando y el valor su expansión en LaTeX. */
const MATH_MACROS = {
  "\\R": "\\mathbb{R}", "\\N": "\\mathbb{N}", "\\Z": "\\mathbb{Z}",
  "\\C": "\\mathbb{C}", "\\dd": "\\mathrm{d}",
  "\\deriv": "\\frac{\\mathrm{d}#1}{\\mathrm{d}#2}",
  "\\pderiv": "\\frac{\\partial #1}{\\partial #2}"
};

/* --- 7c bis. Markdown mínimo (sin dependencias) --- */

/* Código, fórmulas e imágenes se apartan en `blocks` y se reemplazan por un
   centinela para que el resto del parseo no los toque; al final se reponen.
   Las citas se parsean recursivamente, y por eso comparten ese mismo arreglo:
   con uno propio, los centinelas del nivel de arriba no tendrían con qué
   resolverse. */
function mdToHtml(src, blocks) {
  const outermost = !blocks;
  blocks = blocks || [];
  const stash = s => `\uE000${blocks.push(s) - 1}\uE000`;

  let t = src.replace(/\r\n?/g, '\n');
  t = t.replace(/^---\n[\s\S]*?\n---\n/, '');                       // front-matter
  t = t.replace(/```(\w*)\n([\s\S]*?)```/g,
      (_, l, c) => stash(`<pre><code data-lang="${esc(l)}">${esc(c)}</code></pre>`));
  t = t.replace(/\$\$([\s\S]+?)\$\$/g, (_, m) => stash(renderMath(m, true)));
  t = t.replace(/`([^`\n]+)`/g, (_, c) => stash(`<code>${esc(c)}</code>`));
  t = t.replace(/\$([^$\n]+?)\$/g, (_, m) => stash(renderMath(m, false)));

  const inline = s => esc(s)
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|\W)\*([^*\n]+)\*/g, '$1<em>$2</em>')
    .replace(/~~([^~]+)~~/g, '<del>$1</del>');

  const out = [];
  const lines = t.split('\n');
  let i = 0;
  while (i < lines.length) {
    const L = lines[i];

    if (/^\s*$/.test(L)) { i++; continue; }
    if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(L)) { out.push('<hr>'); i++; continue; }

    let m = L.match(/^(#{1,6})\s+(.*)$/);
    if (m) { out.push(`<h${m[1].length}>${inline(m[2])}</h${m[1].length}>`); i++; continue; }

    if (/^\s*\|.*\|\s*$/.test(L) && /^\s*\|[\s:|-]+\|\s*$/.test(lines[i + 1] || '')) {
      const cells = r => r.trim().replace(/^\||\|$/g, '').split('|').map(c => c.trim());
      const head = cells(L);
      i += 2;
      const rows = [];
      while (i < lines.length && /^\s*\|.*\|\s*$/.test(lines[i])) rows.push(cells(lines[i++]));
      out.push('<table><thead><tr>' + head.map(c => `<th>${inline(c)}</th>`).join('') +
        '</tr></thead><tbody>' + rows.map(r => '<tr>' + r.map(c => `<td>${inline(c)}</td>`).join('') + '</tr>').join('') +
        '</tbody></table>');
      continue;
    }

    if (/^\s*>/.test(L)) {
      const buf = [];
      while (i < lines.length && /^\s*>/.test(lines[i])) buf.push(lines[i++].replace(/^\s*>\s?/, ''));
      out.push(`<blockquote>${mdToHtml(buf.join('\n'), blocks)}</blockquote>`);
      continue;
    }

    if (/^\s*([-*+]|\d+\.)\s+/.test(L)) {
      const ordered = /^\s*\d+\./.test(L);
      const items = [];
      while (i < lines.length && /^\s*([-*+]|\d+\.)\s+/.test(lines[i]))
        items.push(lines[i++].replace(/^\s*([-*+]|\d+\.)\s+/, ''));
      out.push(`<${ordered ? 'ol' : 'ul'}>` +
        items.map(x => `<li>${inline(x)}</li>`).join('') + `</${ordered ? 'ol' : 'ul'}>`);
      continue;
    }

    const para = [];
    while (i < lines.length && !/^\s*$/.test(lines[i]) &&
           !/^(#{1,6}\s|\s*>|\s*([-*+]|\d+\.)\s)/.test(lines[i])) para.push(lines[i++]);
    out.push(`<p>${inline(para.join(' '))}</p>`);
  }

  const html = out.join('\n');
  return outermost ? html.replace(/\uE000(\d+)\uE000/g, (_, n) => blocks[+n]) : html;
}

/* --- 7d. LaTeX ------------------------------------------------
   No es un compilador de LaTeX: es un índice de secciones, las
   ecuaciones del documento compuestas con KaTeX, y la fuente.
--------------------------------------------------------------- */

const MATH_ENVS = 'equation|equation\\*|align|align\\*|aligned|gather|gather\\*|multline|multline\\*';

function renderLatex(src) {
  /* --- índice de secciones --- */
  const secs = [];
  src.replace(/\\(chapter|section|subsection|subsubsection)\*?\{([^}]*)\}/g,
    (_, lvl, name) => { secs.push({ lvl, name }); return _; });
  const toc = secs.length
    ? `<h3>Estructura del documento</h3><ul>${secs.map(s =>
        `<li style="margin-left:${{chapter:0,section:0,subsection:1,subsubsection:2}[s.lvl] * 14}px">
          <span style="color:var(--ink-dim);font-size:11px;font-family:var(--mono)">${s.lvl}</span>
          &nbsp;${esc(s.name)}</li>`).join('')}</ul>`
    : '';

  /* --- ecuaciones en modo display --- */
  const eqs = [];
  const push = tex => { if (tex.trim() && eqs.length < 80) eqs.push(tex.trim()); };
  src.replace(new RegExp('\\\\begin\\{(' + MATH_ENVS + ')\\}([\\s\\S]*?)\\\\end\\{\\1\\}', 'g'),
    (_, env, body) => { push(/^align|^gather|^multline/.test(env) ? `\\begin{aligned}${body}\\end{aligned}` : body); return _; });
  src.replace(/\\\[([\s\S]*?)\\\]/g, (_, body) => { push(body); return _; });
  src.replace(/\$\$([\s\S]*?)\$\$/g, (_, body) => { push(body); return _; });

  const formulas = eqs.length
    ? `<h3>Ecuaciones <span style="color:var(--ink-dim);font-size:12px;
         font-family:var(--mono);font-weight:400">${eqs.length}${eqs.length === 80 ? '+' : ''}</span></h3>
       ${eqs.map(t => renderMath(t, true)).join('')}`
    : '';

  return `${toc}${formulas}<h3>Fuente</h3><pre><code>${esc(src)}</code></pre>`;
}

/* --- 7e. Jupyter Notebook --- */

function renderNotebook(raw, title) {
  const wrap = el('div', 'nb');
  let nb;
  try { nb = JSON.parse(raw); }
  catch { wrap.innerHTML = `<div class="doc"><h1>${esc(title)}</h1><p>El notebook no es JSON válido.</p></div>`; return wrap; }

  const head = el('div', 'doc');
  head.style.padding = '0 0 10px';
  head.innerHTML = `<h1>${esc(title)}</h1>
    <p style="color:var(--ink-muted);font-size:12.5px;font-family:var(--mono)">
      ${(nb.cells || []).length} celdas · kernel ${esc((nb.metadata &&
        nb.metadata.kernelspec && nb.metadata.kernelspec.display_name) || '—')}</p>`;
  wrap.appendChild(head);

  (nb.cells || []).forEach((c, i) => {
    const src = Array.isArray(c.source) ? c.source.join('') : (c.source || '');
    const cell = el('div', 'nb-cell');
    cell.dataset.cell = i;
    const gutter = el('div', 'nb-gutter',
      c.cell_type === 'code' ? `In [${c.execution_count ?? ' '}]:` : 'md');
    const bodyBox = el('div', 'nb-body');

    if (c.cell_type === 'markdown') {
      const d = el('div', 'doc');
      d.style.cssText = 'padding:0;max-width:none;font-size:14.5px';
      d.innerHTML = mdToHtml(src);
      bodyBox.appendChild(d);
    } else {
      bodyBox.appendChild(el('pre', 'nb-src', esc(src)));
      (c.outputs || []).forEach(o => {
        if (o.output_type === 'stream')
          bodyBox.appendChild(el('div', 'nb-out',
            esc(Array.isArray(o.text) ? o.text.join('') : o.text || '')));
        else if (o.output_type === 'error')
          bodyBox.appendChild(el('div', 'nb-out err',
            esc((o.traceback || []).join('\n').replace(/\[[\d;]*m/g, ''))));
        else {
          const d = (o.data || {});
          if (d['image/png'])
            bodyBox.appendChild(el('div', 'nb-out',
              `<img src="data:image/png;base64,${String(d['image/png']).replace(/\s/g, '')}">`));
          else if (d['text/plain'])
            bodyBox.appendChild(el('div', 'nb-out',
              esc(Array.isArray(d['text/plain']) ? d['text/plain'].join('') : d['text/plain'])));
        }
      });
    }
    cell.append(gutter, bodyBox);
    wrap.appendChild(cell);
  });
  return wrap;
}

/* --- 7f. Red de asignaturas -------------------------------
   Cada materia tiene 4 estados posibles (pendiente/cursando/regular/
   aprobada, en state.estados) y dos listas de correlativas: para CURSAR
   alcanza con "regular", para RENDIR el final hace falta "aprobada". El
   resto de la app (Escritorio, barra de estado, respaldo JSON) sigue
   leyendo state.passed, una caché derivada que syncPassed() mantiene al
   día — no le hace falta enterarse de que por dentro hay 4 estados.
----------------------------------------------------------- */

const NET_TYPES = { CB:'Ciencias Básicas', TB:'Tecnologías Básicas',
                    TA:'Tecnologías Aplicadas', CO:'Complementarias' };

function netLocked(s) {
  if (state.settings.netUnlock !== true || estadoDe(s.code) === 'aprobada') return false;
  return calcularBloqueo(s) || (s.req > 0 && state.passed.size < s.req);
}

function netAnim() {
  return state.settings.anim !== false &&
         !matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function viewCorrel(vp) {
  const root = el('div', 'nt');
  root.style.setProperty('--nz', state.settings.netZoom || 100);
  root.innerHTML = `
    <div class="nt-head">
      <div class="nt-title">
        <h1>Red de asignaturas</h1>
        <p>Ingeniería Aeroespacial — Universidad Nacional de La Plata, Plan 2018</p>
      </div>
      <div class="nt-stats">
        <div class="nt-stat"><b id="nt-ap">0 / 0</b><span>Aprobadas</span></div>
        <div class="nt-stat"><b id="nt-hs">0 / 0</b><span>Horas</span></div>
        <div class="nt-stat"><b id="nt-mp">0 / 0</b><span>Mapeadas</span></div>
        <div class="nt-stat"><b id="nt-pc">0%</b><span>Avance</span>
          <div class="nt-track"><div class="nt-fill" id="nt-fill"></div></div></div>
      </div>
    </div>
    <div class="nt-legend">
      ${Object.entries(NET_TYPES).map(([k, v]) =>
        `<i style="--c:var(--${k.toLowerCase()})">${v}</i>`).join('')}
      <span class="nt-hint">Clic en la tarjeta para entrar a la asignatura (Retroceso para volver) ·
        clic derecho para cambiar su estado · 🗺 para el mapa conceptual · el avance se guarda solo</span>
    </div>
    <div class="nt-scroll" id="nt-scroll">
      <svg class="nt-lines" id="nt-lines"></svg>
      <div class="nt-grid" id="nt-grid"></div>
    </div>`;
  vp.appendChild(root);

  const tip = el('div', 'nt-tip');
  /* El mismo popover sirve para dos cosas: marcar el mapa conceptual (como
     siempre) o, ahora, cambiar el estado de cursada. Un solo `.nt-pop`
     alcanza — se alterna qué mitad se ve según quién lo abrió. */
  const pop = el('div', 'nt-pop');
  pop.innerHTML = `
    <h5></h5>
    <div class="pop-mapa">
      <label><input type="checkbox"> Ya tengo el mapa generado</label>
      <input type="text" placeholder="Ruta o link del mapa (opcional)">
    </div>
    <div class="pop-estado" hidden>
      <label>Estado
        <select class="ctl" style="width:100%;margin-top:4px">
          ${ESTADOS.map(e => `<option value="${e}">${ESTADO_LABEL[e]}</option>`).join('')}
        </select>
      </label>
      <input type="text" placeholder="Nota corta (opcional)" style="margin-top:8px">
    </div>
    <div class="hint"></div>
    <div class="acts"><button class="primary"></button><button class="cerrar">Cerrar</button></div>`;
  root.append(tip, pop);

  const grid = root.querySelector('#nt-grid');
  const svg = root.querySelector('#nt-lines');
  const scroll = root.querySelector('#nt-scroll');

  /* ---- tarjetas ---- */
  function paintLock(card, s) {
    const falta = correlativasFaltantes(s);
    const partes = falta.slice(0, 4);
    if (falta.length > 4) partes.push('+' + (falta.length - 4));
    if (s.req > 0 && state.passed.size < s.req)
      partes.push(state.passed.size + '/' + s.req + ' aprob.');
    card.querySelector('.nt-lock span').textContent = partes.join(' · ');
  }

  function paintRinde(card, s) {
    card.querySelector('.rinde').hidden =
      !(!netLocked(s) && estadoDe(s.code) !== 'aprobada' && puedeRendirFinal(s));
  }

  function drawGrid() {
    grid.innerHTML = '';
    SEMESTERS.forEach((label, sem) => {
      const subs = SUBJECTS.filter(s => s.sem === sem);
      if (!subs.length) return;
      const col = el('div', 'nt-col');
      col.appendChild(el('div', 'nt-sem', esc(label)));

      subs.forEach(s => {
        const hasMap = !!(state.netMaps[s.code] && state.netMaps[s.code].tiene);
        const card = el('div', 'nt-card t-' + s.type +
          (estadoDe(s.code) === 'aprobada' ? ' passed' : '') +
          (hasMap ? ' has-map' : '') + (netLocked(s) ? ' locked' : ''));
        card.dataset.code = s.code;
        card.innerHTML = `
          <div class="nt-map" title="Mapa conceptual">🗺</div>
          <div class="nt-code"><span>${s.code}</span><span class="nt-chip">${s.type}</span></div>
          <div class="nt-name">${esc(s.name)}</div>
          <div class="nt-meta"><span>${s.het} hs</span>
            ${s.req ? `<span class="req">Requiere ${s.req} mat.</span>` : ''}
            <span class="req rinde" hidden>Podés rendir final</span></div>
          <div class="nt-lock"><b>🔒</b><span></span></div>`;
        paintLock(card, s);
        paintRinde(card, s);

        card.onclick = () => {
          if (card.classList.contains('locked')) return;
          openSubject(s.code, { id:'correl', title:'Red de asignaturas', kind:'correl' });
        };
        card.oncontextmenu = e => {
          e.preventDefault();
          if (card.classList.contains('locked')) return;
          openEstadoPop(s, card);
        };
        card.querySelector('.nt-map').onclick = e => { e.stopPropagation(); openMapaPop(s, e.currentTarget); };
        card.onmouseenter = e => hover(s.code, true, e);
        card.onmouseleave = () => hover(s.code, false);
        card.onmousemove = e => moveTip(e);
        col.appendChild(card);
      });
      grid.appendChild(col);
    });
  }

  /* ---- flechas ---- */
  function drawLines() {
    svg.innerHTML = '';
    const box = scroll.getBoundingClientRect();
    SUBJECTS.forEach(s => {
      if (!s.correlativasCursar || !s.correlativasCursar.length) return;
      const dst = grid.querySelector(`[data-code="${s.code}"]`);
      if (!dst) return;
      const dr = dst.getBoundingClientRect();
      const dx = dr.left - box.left + scroll.scrollLeft;
      const dy = dr.top - box.top + scroll.scrollTop + dr.height / 2;
      s.correlativasCursar.forEach(pre => {
        const src = grid.querySelector(`[data-code="${pre}"]`);
        if (!src) return;
        const sr = src.getBoundingClientRect();
        const sx = sr.right - box.left + scroll.scrollLeft;
        const sy = sr.top - box.top + scroll.scrollTop + sr.height / 2;
        const mid = (sx + dx) / 2;
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', `M ${sx} ${sy} C ${mid} ${sy}, ${mid} ${dy}, ${dx} ${dy}`);
        path.setAttribute('class', 'nt-edge');
        path.dataset.source = pre;
        path.dataset.target = s.code;
        svg.appendChild(path);
      });
    });
  }

  /* ---- estado y volteo de las que se desbloquean ---- */
  function refresh() {
    const suave = netAnim();
    grid.querySelectorAll('.nt-card').forEach(card => {
      const s = byCode[card.dataset.code];
      card.classList.toggle('passed', estadoDe(s.code) === 'aprobada');
      card.classList.toggle('has-map', !!(state.netMaps[s.code] && state.netMaps[s.code].tiene));
      paintRinde(card, s);
      if (netLocked(s)) { card.classList.add('locked'); paintLock(card, s); }
      else if (card.classList.contains('locked')) {
        if (suave) {
          card.classList.add('flip');
          setTimeout(() => card.classList.remove('locked'), 280);
          setTimeout(() => card.classList.remove('flip'), 560);
        } else card.classList.remove('locked');
      }
    });
    stats();
    renderStatus();
  }

  function stats() {
    const ap = SUBJECTS.filter(s => state.passed.has(s.code));
    const hs = ap.reduce((a, s) => a + s.het, 0);
    const pc = ((hs / TOTAL_HOURS) * 100).toFixed(1);
    const mp = SUBJECTS.filter(s => state.netMaps[s.code] && state.netMaps[s.code].tiene).length;
    root.querySelector('#nt-ap').textContent = `${ap.length} / ${SUBJECTS.length}`;
    root.querySelector('#nt-hs').textContent = `${hs} / ${TOTAL_HOURS}`;
    root.querySelector('#nt-mp').textContent = `${mp} / ${SUBJECTS.length}`;
    root.querySelector('#nt-pc').textContent = pc + '%';
    root.querySelector('#nt-fill').style.width = pc + '%';
  }

  /* ---- resaltado al apuntar ---- */
  function hover(code, on, ev) {
    const cards = grid.querySelectorAll('.nt-card');
    if (on && grid.querySelector(`[data-code="${code}"]`).classList.contains('locked')) return;
    if (!on) {
      cards.forEach(c => c.classList.remove('hl', 'pre', 'post', 'dim'));
      svg.querySelectorAll('.nt-edge').forEach(l => l.classList.remove('pre', 'post'));
      tip.style.display = 'none';
      return;
    }
    const s = byCode[code];
    const prereqs = correlativasDirectas(s);
    const abre = materiasQueDesbloquea(code, NET_INVERSO);   // transitivo: toda la cadena

    cards.forEach(card => {
      const c = card.dataset.code;
      if (c === code) card.classList.add('hl');
      else if (prereqs.includes(c)) card.classList.add('pre');
      else if (abre.includes(c)) card.classList.add('post');   // perímetro blanco
      else card.classList.add('dim');
    });
    svg.querySelectorAll('.nt-edge').forEach(l => {
      if (l.dataset.target === code) l.classList.add('pre');
      else if (l.dataset.source === code) l.classList.add('post');
    });

    const nom = cs => {
      const nombres = cs.map(c => byCode[c] && byCode[c].name).filter(Boolean);
      return nombres.length > 6
        ? nombres.slice(0, 6).join(', ') + ` (+${nombres.length - 6} más)`
        : nombres.join(', ');
    };
    tip.innerHTML = `
      <h4>${esc(s.name)}</h4>
      <p><b>${s.code}</b> · ${NET_TYPES[s.type]} · ${s.het} hs</p>
      <p>Estado: <b>${ESTADO_LABEL[estadoDe(s.code)]}</b>${puedeRendirFinal(s) && estadoDe(s.code) !== 'aprobada' ? ' · ya podés rendir el final' : ''}</p>
      ${s.req ? `<p>Requiere ${s.req} materias aprobadas</p>` : ''}
      ${prereqs.length ? `<p class="l-pre"><b>Necesita:</b> ${esc(nom(prereqs))}</p>`
                       : '<p class="none">Sin correlativas previas</p>'}
      ${abre.length ? `<p class="l-post"><b>Abre paso a (directa o indirectamente):</b> ${esc(nom(abre))}</p>` : ''}`;
    tip.style.display = 'block';
    moveTip(ev);
  }

  function moveTip(e) {
    tip.style.left = Math.min(e.clientX + 16, innerWidth - 290) + 'px';
    tip.style.top = Math.min(e.clientY + 16, innerHeight - 180) + 'px';
  }

  /* ---- popover: mapas conceptuales o cambio de estado ---- */
  let popCode = null;
  let popKind = 'mapa';
  const popMapaBox = pop.querySelector('.pop-mapa');
  const popEstadoBox = pop.querySelector('.pop-estado');
  const popChk = pop.querySelector('input[type=checkbox]');
  const popTxt = popMapaBox.querySelector('input[type=text]');
  const popSel = pop.querySelector('.pop-estado select');
  const popNota = popEstadoBox.querySelector('input[type=text]');
  const popBtn = pop.querySelector('button.primary');
  const popHint = pop.querySelector('.hint');

  function popMode() {
    if (popKind === 'estado') return;   // el modo estado no tiene sub-modos
    if (popChk.checked && popTxt.value.trim()) {
      popHint.textContent = 'Vas a poder abrir el mapa directo desde acá.';
      popBtn.textContent = 'Abrir mapa'; popBtn.dataset.mode = 'open';
    } else if (!popChk.checked) {
      popHint.textContent = 'Todavía no tenés mapa conceptual de esta materia.';
      popBtn.textContent = 'Copiar pedido para Claude'; popBtn.dataset.mode = 'copy';
    } else {
      popHint.textContent = 'Marcado como generado. Con la ruta o el link, después lo abrís directo.';
      popBtn.textContent = 'Guardar'; popBtn.dataset.mode = 'save';
    }
  }
  function place(anchor) {
    const r = anchor.getBoundingClientRect();
    pop.style.left = Math.max(12, Math.min(r.left, innerWidth - 280)) + 'px';
    pop.style.top = (r.bottom + 8) + 'px';
    pop.classList.add('open');
  }
  function openMapaPop(s, badge) {
    popCode = s.code; popKind = 'mapa';
    popMapaBox.hidden = false; popEstadoBox.hidden = true;
    const m = state.netMaps[s.code] || { tiene:false, link:'' };
    pop.querySelector('h5').textContent = s.name;
    popChk.checked = !!m.tiene;
    popTxt.value = m.link || '';
    popMode();
    place(badge);
  }
  function openEstadoPop(s, card) {
    popCode = s.code; popKind = 'estado';
    popMapaBox.hidden = true; popEstadoBox.hidden = false;
    pop.querySelector('h5').textContent = s.name;
    popSel.value = estadoDe(s.code);
    popNota.value = state.netNotas[s.code] || '';
    popHint.textContent = puedeRendirFinal(s)
      ? 'Ya cumple las correlativas para rendir el final.'
      : 'Todavía le faltan correlativas para rendir el final.';
    popBtn.textContent = 'Guardar';
    place(card);
  }
  popChk.oninput = popMode;
  popTxt.oninput = popMode;
  pop.querySelector('.cerrar').onclick = () => pop.classList.remove('open');
  popBtn.onclick = async () => {
    if (!popCode) return;
    const s = byCode[popCode];
    if (popKind === 'estado') {
      actualizarEstado(popCode, popSel.value);
      state.netNotas[popCode] = popNota.value.trim();
      writeShared(NOTAS_EST_KEY, state.netNotas);
      pop.classList.remove('open');
      refresh();
      return;
    }
    if (popBtn.dataset.mode === 'open') { window.open(popTxt.value.trim(), '_blank'); return; }
    if (popBtn.dataset.mode === 'copy') {
      const texto = `Generá un mapa conceptual de "${s.name}" (código ${s.code}) a partir de mis apuntes.`;
      try { await navigator.clipboard.writeText(texto); toast('Pedido copiado'); }
      catch { toast('No pude copiar: ' + texto); }
      return;
    }
    state.netMaps[popCode] = { tiene: popChk.checked, link: popTxt.value.trim() };
    writeShared(NETMAPS_KEY, state.netMaps);
    pop.classList.remove('open');
    refresh();
  };
  root.onclick = e => {
    if (pop.classList.contains('open') && !pop.contains(e.target) &&
        !e.target.classList.contains('nt-map')) pop.classList.remove('open');
  };

  /* ---- recorrido de semestres al entrar ---- */
  function sweep() {
    const cols = [...grid.children];
    const sems = SEMESTERS.map((_, i) => i).filter(i => SUBJECTS.some(s => s.sem === i));
    const pend = sems.find(i => SUBJECTS.some(s => s.sem === i && !state.passed.has(s.code)));
    const hasta = Math.min(pend == null ? cols.length - 1 : Math.max(0, sems.indexOf(pend)),
                           cols.length - 1);
    if (hasta < 0) return;
    const settle = col => Math.max(0, Math.min(
      col.offsetLeft - (scroll.clientWidth - col.offsetWidth) / 2,
      scroll.scrollWidth - scroll.clientWidth));

    if (!netAnim()) { scroll.scrollLeft = settle(cols[hasta]); drawLines(); return; }
    cols.slice(0, hasta + 1).forEach((col, i) => {
      setTimeout(() => {
        col.classList.add('lit');
        setTimeout(() => col.classList.remove('lit'), 700);
        scroll.scrollTo({ left: settle(col), behavior:'smooth' });
        drawLines();
      }, i * 190);
    });
  }

  scroll.addEventListener('scroll', drawLines);
  viewCorrel._resize = drawLines;   // lo llama el único listener global de resize

  drawGrid();
  stats();
  requestAnimationFrame(() => { drawLines(); sweep(); });

  /* Para el exportador: rehacer la vista con la escala actual. */
  viewCorrel._root = root;
  viewCorrel._redraw = () => {
    root.style.setProperty('--nz', state.settings.netZoom || 100);
    drawGrid(); refresh(); drawLines();
  };
}

/* Copia autónoma de la red: un HTML suelto, con el tema y el avance del
   momento, que se abre sin servidor y se puede compartir o imprimir.
   Reutiliza el mismo CSS que usa la vista, así que nunca se desfasa. */
const NET_TOKENS = ['bg','paper','panel','ink','ink-muted','ink-dim','border','border-soft',
  'accent','accent-dark','accent-soft','cb','tb','ta','co','dep-prereq',
  'on-accent','on-cb','on-tb','on-ta','on-co','mono','serif','sans',
  'r-xs','r-sm','r-md','r-lg','r-full','dur-1','dur-2','ease','sh-1','sh-2','sh-3','sh-4'];

async function exportNetwork() {
  if (!viewCorrel._root || !document.body.contains(viewCorrel._root)) {
    setView('correl');
    toast('Abro la Red para tomar la copia…');
    await new Promise(r => setTimeout(r, 900));
  }
  const root = viewCorrel._root;
  const scroll = root.querySelector('.nt-scroll');
  const cs = getComputedStyle(document.documentElement);
  const vars = NET_TOKENS.map(v => `  --${v}:${cs.getPropertyValue('--' + v).trim()};`)
                        .join(String.fromCharCode(10));

  const copia = root.cloneNode(true);
  copia.querySelectorAll('.nt-tip,.nt-pop,.nt-map').forEach(n => n.remove());
  copia.querySelector('.nt-hint').textContent =
    'Copia estática — el avance se marca en la aplicación, no acá.';
  const svg = copia.querySelector('.nt-lines');
  svg.setAttribute('width', scroll.scrollWidth);
  svg.setAttribute('height', scroll.scrollHeight);

  const ap = SUBJECTS.filter(s => state.passed.has(s.code)).length;
  const html = `<!DOCTYPE html>
<html lang="es"><head><meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Red de asignaturas · ${ap} de ${SUBJECTS.length} aprobadas</title>
<style>
:root{
${vars}
}
*{box-sizing:border-box;margin:0;padding:0}
body{background:var(--bg);color:var(--ink);font-family:var(--sans);
  -webkit-font-smoothing:antialiased}
h1,h4,h5{font-family:var(--serif);font-weight:600}
${document.getElementById('net-css').textContent.replace(/<\/?style[^>]*>/g, '')}
/* La copia no tiene scroll propio: se despliega entera. */
.nt{position:static;height:auto;min-height:100vh}
.nt-scroll{overflow:visible;flex:none}
.nt-card{cursor:default}
.nt-card:hover{transform:none;box-shadow:none;border-color:var(--border)}
</style></head><body>
${copia.outerHTML}
</body></html>`;

  const nombre = 'red-de-asignaturas-' + new Date().toISOString().slice(0, 10) + '.html';
  const a = el('a');
  a.href = URL.createObjectURL(new Blob([html], { type:'text/html;charset=utf-8' }));
  a.download = nombre;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  toast('Copia exportada: ' + nombre);
}

/* --- 7g. Ficha de asignatura --- */

function openSubject(code, back) {
  const s = byCode[code];
  openTab({ id:'s:' + code, title:s.code + ' · ' + s.name, kind:'subject', code, path:s.dir, back });
}

async function viewSubject(vp, t) {
  const s = byCode[t.code];
  const pane = el('div', 'pane');
  const unlocks = SUBJECTS.filter(x => (x.correlativasCursar || []).includes(s.code));
  const area = AREAS[s.area];

  pane.innerHTML = `
    <div class="pane-head">
      <div>
        <div style="font-family:var(--mono);font-size:11.5px;color:var(--ink-dim);
          display:flex;gap:9px;align-items:center;margin-bottom:6px">
          <span class="chip ${s.type}">${s.type}</span>${s.code}
          <span class="pill" style="border-color:${area.color};color:${area.color}">${area.label}</span>
        </div>
        <h1>${esc(s.name)}</h1>
        <p class="lead">${SEMESTERS[s.sem]} · ${s.het} horas totales ·
          <span style="font-family:var(--mono);font-size:12px">${esc(s.dir)}</span></p>
      </div>
      <div style="display:flex;gap:8px;align-items:center">
        <select class="ctl" id="sel-estado">
          ${ESTADOS.map(e => `<option value="${e}">${ESTADO_LABEL[e]}</option>`).join('')}
        </select>
        <a class="btn" href="${urlFor(s.dir + '/')}" target="_blank">Abrir carpeta ${I.ext}</a>
      </div>
    </div>

    <div class="section-title">Correlatividades</div>
    <div class="grid g3">
      <div class="card flat">
        <div class="c-code">requiere</div>
        <div id="pre-list" style="display:flex;flex-direction:column;gap:6px;font-size:13px"></div>
      </div>
      <div class="card flat">
        <div class="c-code">habilita</div>
        <div id="post-list" style="display:flex;flex-direction:column;gap:6px;font-size:13px"></div>
      </div>
      <div class="card flat">
        <div class="c-code">conceptos clave</div>
        <div class="c-meta" style="margin-top:2px">
          ${s.concepts.length ? s.concepts.map(c => `<span class="pill">${esc(c)}</span>`).join('')
            : '<span style="color:var(--ink-dim)">sin conceptos cargados</span>'}</div>
      </div>
    </div>

    <div class="section-title" id="nota-title">Nota final</div>
    <div class="grid g3" id="nota-box">
      <div class="card flat">
        <div class="c-code">nota final</div>
        <input class="ctl" id="nf-input" type="number" min="4" max="10" step="1" style="width:100%;margin-top:6px">
      </div>
      <div class="card flat">
        <div class="c-code">aplazos previos</div>
        <div id="ap-list" style="display:flex;gap:6px;flex-wrap:wrap;margin-top:6px"></div>
        <div style="display:flex;gap:6px;margin-top:8px">
          <input class="ctl" id="ap-input" type="number" min="1" max="9" step="1" style="width:70px" placeholder="nota">
          <button class="btn" id="ap-add">Agregar aplazo</button>
        </div>
      </div>
    </div>

    <div class="section-title">Carpetas</div>
    <div class="grid g3" id="folders"></div>

    <div class="section-title">Bibliografía sugerida</div>
    <div class="grid g3" id="books"></div>

    <div class="section-title">Autoevaluación</div>
    <div class="card flat" id="quiz-card" style="cursor:pointer"></div>`;
  vp.appendChild(pane);

  const qcard = pane.querySelector('#quiz-card');
  const nq = preguntasDe(s.code).length;
  qcard.innerHTML = nq
    ? `<div class="c-name">${nq} pregunta${nq === 1 ? '' : 's'} de práctica</div>
       <div class="c-meta">Se prioriza lo que más se falla. Clic para empezar.</div>`
    : '<div class="c-name" style="color:var(--ink-dim)">Todavía no hay preguntas cargadas para esta materia.</div>';
  qcard.onclick = () => {
    if (!nq) return;
    openTab({ id:'quiz:' + s.code, title:'Autoevaluación · ' + s.code, kind:'quiz', code:s.code });
  };

  const link = (code, box) => {
    const x = byCode[code];
    const a = el('a', null, `${x.code} · ${x.name}`);
    a.style.cursor = 'pointer';
    a.onclick = () => openSubject(code);
    box.appendChild(a);
  };
  const pre = pane.querySelector('#pre-list'), post = pane.querySelector('#post-list');
  const cursar = s.correlativasCursar || [];
  cursar.length ? cursar.forEach(c => link(c, pre))
                : pre.appendChild(el('span', null, '<span style="color:var(--ink-dim)">ninguna</span>'));
  unlocks.length ? unlocks.forEach(x => link(x.code, post))
                 : post.appendChild(el('span', null, '<span style="color:var(--ink-dim)">ninguna</span>'));

  const sel = pane.querySelector('#sel-estado');
  sel.value = estadoDe(s.code);

  /* La nota final y los aplazos solo importan una vez aprobada: el resto
     del tiempo el bloque queda oculto, no vacío mostrando ceros. */
  const notaBox = pane.querySelector('#nota-box'), notaTitle = pane.querySelector('#nota-title');
  const nfInput = pane.querySelector('#nf-input'), apList = pane.querySelector('#ap-list');
  const apInput = pane.querySelector('#ap-input');
  const datosNota = () => state.notas[s.code] || { notaFinal:null, aplazos:[] };
  const toggleNotaBox = () => {
    const on = sel.value === 'aprobada';
    notaBox.hidden = !on; notaTitle.hidden = !on;
  };
  const pintarNota = () => {
    const d = datosNota();
    nfInput.value = d.notaFinal ?? '';
    apList.innerHTML = '';
    (d.aplazos || []).forEach((n, i) => {
      const p = el('span', 'pill', n + ' ');
      const x = el('button', 'icon-btn', I.x);
      x.style.cssText = 'width:14px;height:14px';
      x.onclick = () => { d.aplazos.splice(i, 1); state.notas[s.code] = d; saveNotas(); pintarNota(); };
      p.appendChild(x);
      apList.appendChild(p);
    });
  };
  nfInput.onchange = () => {
    const d = datosNota();
    d.notaFinal = nfInput.value ? Number(nfInput.value) : null;
    state.notas[s.code] = d; saveNotas();
  };
  pane.querySelector('#ap-add').onclick = () => {
    const v = Number(apInput.value);
    if (!v) return;
    const d = datosNota();
    d.aplazos = [...(d.aplazos || []), v];
    state.notas[s.code] = d; saveNotas();
    apInput.value = '';
    pintarNota();
  };
  sel.onchange = () => { actualizarEstado(s.code, sel.value); renderStatus(); toggleNotaBox(); };
  toggleNotaBox();
  pintarNota();

  const books = pane.querySelector('#books');
  const recs = RECOMMENDED.filter(r => r.codes.includes(s.code));
  if (!recs.length) books.innerHTML = '<div class="empty">Sin recomendaciones cargadas para esta materia.</div>';
  recs.forEach(r => books.appendChild(bookCard(r)));

  const fbox = pane.querySelector('#folders');
  for (const f of SUBFOLDERS) {
    const rel = s.dir + '/' + f.key;
    const card = el('div', 'card');
    card.innerHTML = `<div class="c-code">${f.key}<span data-n>…</span></div>
      <div class="c-name">${f.hint}</div>
      <div class="c-meta" data-files></div>`;
    card.onclick = () => {
      setView('files');
      state.expanded.add('sem:' + s.sem);
      state.expanded.add('sub:' + s.code);
      state.expanded.add('dir:' + rel);
      LS.set('expanded', [...state.expanded]);
      renderViewport();
    };
    fbox.appendChild(card);
    listDir(rel).then(items => {
      card.querySelector('[data-n]').textContent = items.length;
      const box = card.querySelector('[data-files]');
      if (!items.length) { box.innerHTML = '<span style="color:var(--ink-dim)">vacía</span>'; return; }
      items.slice(0, 6).forEach(it => {
        const p = el('span', 'pill', esc(it.name));
        p.style.cursor = 'pointer';
        p.onclick = e => { e.stopPropagation(); it.isDir ? null : openFile(it.path); };
        box.appendChild(p);
      });
      if (items.length > 6) box.appendChild(el('span', 'pill off', `+${items.length - 6}`));
    });
  }
}

/* --- 7g bis. Autoevaluación (modo estudio) ------------------
   Una pregunta a la vez, respuesta oculta hasta pedirla. El orden lo
   decide ordenarPreguntas(): primero lo que más se falla o nunca se
   practicó.
----------------------------------------------------------- */

function viewQuiz(vp, t) {
  const s = byCode[t.code];
  const pool = ordenarPreguntas(preguntasDe(t.code));
  const pane = el('div', 'pane');
  pane.innerHTML = `
    <div class="pane-head"><div>
      <h1>Autoevaluación · ${esc(s.name)}</h1>
      <p class="lead">${pool.length} pregunta${pool.length === 1 ? '' : 's'} en el banco de esta materia.</p>
    </div></div>
    <div id="quiz-body"></div>`;
  vp.appendChild(pane);
  const body = pane.querySelector('#quiz-body');

  let i = 0;
  function pintar() {
    body.innerHTML = '';
    if (i >= pool.length) {
      body.appendChild(el('div', 'empty',
        'Repasaste todo el banco de esta materia. Volvé a entrar para repetirlo con la prioridad al día.'));
      return;
    }
    const q = pool[i];
    const card = el('div', 'card flat');
    card.style.cursor = 'default';
    card.innerHTML = `
      <div class="c-code">${i + 1} / ${pool.length}</div>
      <div class="doc" style="padding:0;max-width:none" id="quiz-enun"></div>
      <div style="margin-top:14px" id="quiz-resp"></div>`;
    card.querySelector('#quiz-enun').innerHTML = mdToHtml(q.enunciado);
    body.appendChild(card);

    const resp = card.querySelector('#quiz-resp');
    const verBtn = el('button', 'btn primary', 'Ver respuesta');
    verBtn.onclick = () => {
      resp.innerHTML = `<div class="doc" style="padding:0;max-width:none">${mdToHtml(q.respuesta)}</div>
        <div style="display:flex;gap:8px;margin-top:12px">
          <button class="btn primary" id="q-bien">La resolví bien</button>
          <button class="btn" id="q-mal">La resolví mal</button>
        </div>`;
      resp.querySelector('#q-bien').onclick = () => { registrarResultado(q.id, true); i++; pintar(); };
      resp.querySelector('#q-mal').onclick = () => { registrarResultado(q.id, false); i++; pintar(); };
    };
    resp.appendChild(verBtn);
  }
  pintar();
}

/* --- 7h. Mapa inter-asignaturas --- */

function viewMaps(vp, t) {
  const foco = t.focus || null;
  const pane = el('div', 'pane');
  pane.innerHTML = `
    <div class="pane-head">
      <div><h1>Mapas conceptuales</h1>
      <p class="lead">Qué materias ya tienen mapa conceptual entre tus apuntes, y qué
        correlativas cruzan de un área temática a otra: esos cruces son los puentes
        conceptuales de la carrera. Filtrá por área con los botones de abajo.</p></div>
      <button class="btn primary" id="scan">Escanear apuntes</button>
    </div>
    <div style="display:flex;gap:7px;flex-wrap:wrap;margin-top:16px" id="areas"></div>
    <div class="section-title">Puentes entre áreas</div>
    <div class="grid g3" id="bridges"></div>
    <div class="section-title">Mapas por asignatura</div>
    <div class="grid g4" id="mgrid"></div>`;
  vp.appendChild(pane);
  pane.querySelector('#scan').onclick = () => scanMaps().then(() => renderViewport());

  /* Las áreas temáticas eran una lista del panel: ahora son filtros de la ventana
     y valen para las dos mitades, el grafo y el índice. */
  const chips = pane.querySelector('#areas');
  const chip = (label, key, color, n) => {
    const b = el('button', 'pill' + (foco === key ? ' on' : ''),
      `${esc(label)}${n != null ? ` · ${n}` : ''}`);
    b.style.cssText = 'cursor:pointer;padding:5px 11px' +
      (color && foco === key ? `;border-color:${color};color:${color}` : '');
    b.onclick = () => openTab({ id:'maps', title:'Mapas conceptuales', kind:'maps',
                               focus: foco === key ? null : key });
    chips.appendChild(b);
  };
  chip('Todas', null, null, SUBJECTS.length);
  Object.entries(AREAS).forEach(([k, a]) =>
    chip(a.label, k, a.color, SUBJECTS.filter(x => x.area === k).length));

  drawMapIndex(pane.querySelector('#mgrid'), foco);

  const bridges = {};
  SUBJECTS.forEach(s => (s.correlativasCursar || []).forEach(p => {
    const a = byCode[p]; if (!a || a.area === s.area) return;
    const k = a.area + '→' + s.area;
    (bridges[k] = bridges[k] || []).push(`${a.code} → ${s.code}`);
  }));
  const bbox = pane.querySelector('#bridges');
  Object.entries(bridges)
    .sort((x, y) => y[1].length - x[1].length)
    .forEach(([k, list]) => {
      const [from, to] = k.split('→');
      const c = el('div', 'card flat');
      c.innerHTML = `<div class="c-code">${list.length} enlace${list.length > 1 ? 's' : ''}</div>
        <div class="c-name" style="display:flex;align-items:center;gap:7px">
          <span class="dot" style="background:${AREAS[from].color}"></span>${AREAS[from].label}
          <span style="color:var(--ink-dim)">→</span>
          <span class="dot" style="background:${AREAS[to].color}"></span>${AREAS[to].label}</div>
        <div class="c-meta">${list.map(x => `<span class="pill">${x}</span>`).join('')}</div>`;
      bbox.appendChild(c);
    });
}

function drawMapIndex(grid, foco) {
  const declared = readShared(NETMAPS_KEY, {});
  SUBJECTS.filter(s => s.concepts.length && (!foco || s.area === foco)).forEach(s => {
    const found = (state.maps[s.code] || []);
    const dec = declared[s.code] && declared[s.code].tiene;
    const c = el('div', 'card bl-' + s.type);
    c.innerHTML = `<div class="c-code">${s.code}<span class="chip ${s.type}">${s.type}</span></div>
      <div class="c-name">${esc(s.name)}</div>
      <div class="c-meta">
        <span class="pill ${found.length ? 'on' : 'off'}">${found.length ? found.length + ' mapa' + (found.length > 1 ? 's' : '') : 'sin mapa'}</span>
        ${dec ? '<span class="pill on">declarado en la red</span>' : ''}
        <span class="pill">${SEMESTERS[s.sem]}</span></div>`;
    c.onclick = () => found.length ? openFile(found[0]) : openSubject(s.code);
    if (found.length) c.title = found.join('\n');
    grid.appendChild(c);
  });

  if (!state.scanned)
    grid.parentElement.insertBefore(
      el('div', 'loading', 'Todavía no escaneaste las carpetas de apuntes.'), grid);
}

async function scanMaps() {
  if (!state.online) { toast('Necesitás el servidor local para escanear'); return; }
  toast('Escaneando apuntes…');
  const res = {};
  for (const s of SUBJECTS) {
    const items = await listDir(s.dir + '/apuntes');
    const hits = items.filter(i => !i.isDir && /mapa|red/i.test(i.name)).map(i => i.path);
    if (hits.length) res[s.code] = hits;
  }
  state.maps = res; state.scanned = true;
  LS.set('maps', res); LS.set('scanned', true);
  buildSearchIndex();
  toast(`Listo: ${Object.keys(res).length} asignaturas con mapa`);
}

/* --- 7j. Librería --- */

function bookCard(r, extra, mode) {
  const c = el('div', 'card flat' + (mode === 'list' ? ' book-row' : ''));
  const area = AREAS[r.area];
  c.innerHTML = `<div class="book">
      <div class="book-cover">${r.cover ? `<img src="${r.cover}" alt="">` : I.book}</div>
      <div class="book-info">
        <div class="book-title">${esc(r.title)}</div>
        <div class="book-author">${esc(r.author || '—')}</div>
        <div class="book-tags">
          ${area ? `<span class="pill" style="border-color:${area.color};color:${area.color}">${area.label}</span>` : ''}
          ${(r.codes || []).map(x => `<span class="pill">${x}</span>`).join('')}
          ${extra || ''}
        </div>
      </div></div>
    ${r.note ? `<div style="font-size:12px;color:var(--ink-muted);margin-top:10px;line-height:1.55">${esc(r.note)}</div>` : ''}`;
  (r.codes || []).forEach(code => {
    const p = $$('.pill', c).find(x => x.textContent === code);
    if (p) { p.style.cursor = 'pointer'; p.onclick = e => { e.stopPropagation(); openSubject(code); }; }
  });
  $$('a', c).forEach(a => a.onclick = e => e.stopPropagation());
  c.style.cursor = 'pointer';
  c.onclick = () => openBook({
    id: r.id || 'rec:' + r.title,
    source: r.source || 'recommended',
    title: r.title, author: r.author, note: r.note, area: r.area,
    codes: r.codes, cover: r.cover, olUrl: r.olUrl
  }, state.current);
  return c;
}

/* Categoría de cada libro local: la elegís vos a mano desde el
   desplegable de su tarjeta; se guarda por ruta de archivo. */
function getLibCat(path) {
  return LS.get('libCats', {})[path] || 'NONE';
}
function setLibCat(path, cat) {
  const m = LS.get('libCats', {});
  if (cat === 'NONE') delete m[path]; else m[path] = cat;
  LS.set('libCats', m);
}

/* Descripción manual por libro local, en Markdown, escrita a mano
   desde la ficha del libro (no hay forma de extraerla del PDF/epub). */
function getLibDesc(path) {
  return LS.get('libDescs', {})[path] || '';
}
function setLibDesc(path, text) {
  const m = LS.get('libDescs', {});
  if (!text.trim()) delete m[path]; else m[path] = text;
  LS.set('libDescs', m);
}

function localBookCard(b, mode, sub) {
  const cat = getLibCat(b.path);
  const catDef = LIB_CATEGORIES[cat] || LIB_CATEGORIES.NONE;
  const catPill = `<span class="pill" style="border-color:${catDef.color};color:${catDef.color}">${esc(catDef.label)}</span>`;
  const subtitle = sub !== undefined ? sub : b.folder;
  const c = el('div', 'card' + (mode === 'list' ? ' book-row' : ' book-vert-card'));
  c.innerHTML = mode === 'list'
    ? `<div class="book">
        <div class="book-cover">${I.book}</div>
        <div class="book-info">
          <div class="book-title">${esc(b.name)}</div>
          <div class="book-author">${subtitle ? esc(subtitle) : '—'}</div>
          <div class="book-tags">${catPill}<span class="pill">${extOf(b.name).toUpperCase()}</span></div>
        </div></div>`
    : `<div class="book-vert">
        <div class="book-cover">${I.book}</div>
        <div class="book-title">${esc(b.name)}</div>
        <div class="book-author">${subtitle ? esc(subtitle) : '—'}</div>
        <div class="book-tags">${catPill}<span class="pill">${extOf(b.name).toUpperCase()}</span></div>
      </div>`;
  c.onclick = () => openBook({
    id: 'local:' + b.path, source: 'local', title: b.name, folder: b.folder, path: b.path
  }, state.current);
  return c;
}

/* Ficha de libro: el mismo mecanismo que «abrir una materia» desde la Red
   (openSubject → openTab kind:'subject'), pero para libros. El clic en una
   tarjeta ya no abre el archivo directo: entra a esta ficha, y desde ahí
   se decide si se lee adentro, afuera, o se sigue a la materia relacionada. */
function openBook(book, back) {
  openTab({ id: book.id, title: book.title, kind: 'book', book, back });
}

function viewBook(vp, t) {
  const b = t.book;
  const pane = el('div', 'pane');

  if (b.source === 'local') {
    const cat = getLibCat(b.path);
    const catDef = LIB_CATEGORIES[cat] || LIB_CATEGORIES.NONE;
    pane.innerHTML = `
      <div class="pane-head">
        <div>
          <div style="font-family:var(--mono);font-size:11.5px;color:var(--ink-dim);
            display:flex;gap:9px;align-items:center;margin-bottom:6px">
            <span class="pill" style="border-color:${catDef.color};color:${catDef.color}">${esc(catDef.label)}</span>
            <span class="pill">${extOf(b.path).toUpperCase()}</span>
          </div>
          <h1>${esc(b.title)}</h1>
          <p class="lead">${b.folder ? esc(b.folder) : 'Librería'} ·
            <span style="font-family:var(--mono);font-size:12px">${esc(b.path)}</span></p>
        </div>
        <div style="display:flex;gap:8px;align-items:center">
          <select class="ctl" id="book-cat">
            ${Object.entries(LIB_CATEGORIES).map(([k, a]) =>
              `<option value="${k}" ${k === cat ? 'selected' : ''}>${esc(a.label)}</option>`).join('')}
          </select>
          <button class="btn primary" id="book-open">Ver aquí</button>
          <a class="btn" href="${urlFor(b.path)}" target="_blank">Abrir afuera ${I.ext}</a>
        </div>
      </div>

      <div class="section-title">Descripción</div>
      <div class="book-desc-wrap">
        <div class="book-desc-content" id="book-desc"></div>
        <div class="book-desc-side" id="book-desc-actions"></div>
      </div>`;
    vp.appendChild(pane);
    pane.querySelector('#book-cat').onchange = e => setLibCat(b.path, e.target.value);
    pane.querySelector('#book-open').onclick = () => openFile(b.path);

    const descBox = pane.querySelector('#book-desc');
    const descActions = pane.querySelector('#book-desc-actions');
    const renderDescView = () => {
      const desc = getLibDesc(b.path);
      descBox.className = 'book-desc-content' + (desc ? '' : ' is-empty');
      descBox.innerHTML = desc ? mdToHtml(desc)
        : 'Sin descripción todavía. Agregá una nota en formato Markdown — tuya, no la de la contratapa.';
      descActions.innerHTML = `<a class="book-desc-link" id="book-desc-edit">${desc ? 'Editar' : 'Agregar'} descripción</a>`;
      descActions.querySelector('#book-desc-edit').onclick = renderDescEdit;
    };
    const renderDescEdit = () => {
      const desc = getLibDesc(b.path);
      descBox.className = 'book-desc-content';
      descBox.innerHTML = `<textarea class="ctl book-desc-ta" id="book-desc-ta"
        style="width:100%;min-height:180px;font-family:var(--mono);font-size:13px;resize:vertical"
        placeholder="Notas en Markdown: de qué trata, por qué lo guardaste, qué capítulos importan...">${esc(desc)}</textarea>`;
      descActions.innerHTML = `<a class="book-desc-link primary" id="book-desc-save">Guardar</a>
        <a class="book-desc-link" id="book-desc-cancel">Cancelar</a>`;
      descActions.querySelector('#book-desc-save').onclick = () => {
        setLibDesc(b.path, pane.querySelector('#book-desc-ta').value);
        renderDescView();
      };
      descActions.querySelector('#book-desc-cancel').onclick = renderDescView;
    };
    renderDescView();
    return;
  }

  const area = AREAS[b.area];
  pane.innerHTML = `
    <div class="pane-head">
      <div>
        ${area ? `<div style="margin-bottom:6px"><span class="pill" style="border-color:${area.color};color:${area.color}">${esc(area.label)}</span></div>` : ''}
        <h1>${esc(b.title)}</h1>
        <p class="lead">${esc(b.author || '—')}</p>
      </div>
      ${b.cover ? `<div class="book-cover" style="width:100px;height:140px;flex:none"><img src="${b.cover}" alt=""></div>` : ''}
    </div>

    ${b.note ? `<div class="section-title">Nota</div><div class="card flat">${esc(b.note)}</div>` : ''}

    ${(b.codes || []).length ? `<div class="section-title">Materias relacionadas</div>
      <div class="grid g3" id="book-subjects"></div>` : ''}

    <div style="margin-top:20px">
      <a class="btn" target="_blank" href="${b.olUrl || 'https://openlibrary.org/search?q=' + encodeURIComponent(b.title + ' ' + (b.author || ''))}">
        Buscar en Open Library ↗</a>
    </div>`;
  vp.appendChild(pane);

  if ((b.codes || []).length) {
    const box = pane.querySelector('#book-subjects');
    b.codes.forEach(code => {
      const s = byCode[code];
      if (!s) return;
      const card = el('div', 'card flat');
      card.style.cursor = 'pointer';
      card.innerHTML = `<div class="c-code">${s.code}</div><div class="c-name">${esc(s.name)}</div>`;
      card.onclick = () => openSubject(code, t);
      box.appendChild(card);
    });
  }
}

/* Botonera de vista (cuadrícula de 5 columnas / lista horizontal),
   compartida por «Mis libros locales» y «Recomendados». */
function mkViewToggle(host, key, onChange) {
  const wrap = el('div', 'view-toggle');
  const render = () => {
    wrap.innerHTML = '';
    const mode = LS.get(key, 'grid');
    [['grid', I.gridView, 'Cuadrícula'], ['list', I.listView, 'Lista']].forEach(([m, ico, tit]) => {
      const b = el('button', 'icon-btn' + (mode === m ? ' on' : ''), ico);
      b.title = tit;
      b.onclick = () => { LS.set(key, m); render(); onChange(m); };
      wrap.appendChild(b);
    });
  };
  render();
  host.appendChild(wrap);
}

function viewLibrary(vp, t) {
  const pane = el('div', 'pane');
  pane.innerHTML = `
    <div class="pane-head"><div>
      <h1>Librería</h1>
      <p class="lead">Los libros que ya tenés en <code>Asignaturas/Libreria/</code>, la bibliografía
        recomendada para cada materia y una búsqueda sobre el catálogo abierto de Open Library.</p>
    </div></div>

    <div class="section-title">Buscar en la web</div>
    <div class="searchbar">
      <input id="q" placeholder="Título, autor o tema — p. ej. «aerodynamics Anderson»">
      <button class="btn primary" id="go">Buscar</button>
    </div>
    <div id="results"></div>

    <div class="section-title">Mis libros locales</div>
    <div class="lib-toolbar">
      <div class="chipbar" id="localFilters"></div>
      <div class="toolbar-right">
        <div id="localViewToggle"></div>
        <button class="btn" id="rescan">Reindexar</button>
      </div>
    </div>
    <div id="local"></div>

    <div class="section-title">Recomendados</div>
    <div class="lib-toolbar">
      <div class="chipbar" id="filters"></div>
      <div class="toolbar-right"><div id="recViewToggle"></div></div>
    </div>
    <div class="grid g5" id="recs"></div>`;
  vp.appendChild(pane);

  /* --- búsqueda web --- */
  const q = pane.querySelector('#q'), results = pane.querySelector('#results');
  const search = async () => {
    const term = q.value.trim();
    if (!term) return;
    results.innerHTML = '<div class="loading">Buscando en Open Library…</div>';
    try {
      const r = await fetch('https://openlibrary.org/search.json?limit=12&fields=title,author_name,first_publish_year,cover_i,key&q='
        + encodeURIComponent(term));
      const j = await r.json();
      if (!j.docs || !j.docs.length) { results.innerHTML = '<div class="empty">Sin resultados.</div>'; return; }
      const grid = el('div', 'grid g3');
      grid.style.marginTop = '14px';
      j.docs.forEach(d => {
        const card = bookCard({
          title: d.title,
          author: (d.author_name || []).slice(0, 2).join(', '),
          cover: d.cover_i ? `https://covers.openlibrary.org/b/id/${d.cover_i}-S.jpg` : null,
          note: d.first_publish_year ? 'Primera edición ' + d.first_publish_year : '',
          source: 'openlibrary', id: 'ol:' + d.key, olUrl: 'https://openlibrary.org' + d.key
        });
        grid.appendChild(card);
      });
      results.innerHTML = '';
      results.appendChild(grid);
    } catch (e) {
      results.innerHTML = `<div class="empty">No pude consultar Open Library (${esc(e.message)}).
        Revisá la conexión a internet.</div>`;
    }
  };
  pane.querySelector('#go').onclick = search;
  q.onkeydown = e => { if (e.key === 'Enter') search(); };

  /* --- libros locales --- */
  const local = pane.querySelector('#local');
  const localFilters = pane.querySelector('#localFilters');
  let localActive = null;
  const paintLocal = () => {
    const mode = LS.get('libLocalView', 'grid');
    const idx = LS.get('libIndex', []);
    local.innerHTML = '';
    if (!idx.length) {
      local.innerHTML = state.online
        ? `<div class="empty">Todavía no indexaste. Tocá «Reindexar» para recorrer
             <code>${esc(LIBRARY_DIR)}/</code>.</div>`
        : '<div class="empty">Necesitás el servidor local para leer tus carpetas.</div>';
      return;
    }
    const filtered = idx.filter(b => !localActive || getLibCat(b.path) === localActive);
    if (!filtered.length) { local.innerHTML = '<div class="empty">Ningún libro en esta categoría todavía.</div>'; return; }

    /* Se agrupa por la primera carpeta debajo de Librería/ (Libros, Cuardernillos,
       etc.) en vez de mostrar todo en una sola grilla mezclada. */
    const groups = new Map();
    filtered.forEach(b => {
      const top = b.folder ? b.folder.split('/')[0] : 'Sin carpeta';
      if (!groups.has(top)) groups.set(top, []);
      groups.get(top).push(b);
    });
    [...groups.keys()].sort((a, c) => a.localeCompare(c)).forEach(name => {
      const books = groups.get(name);
      const section = el('div', 'lib-group');
      section.innerHTML = `<div class="lib-group-title">${esc(name)}<span class="pill">${books.length}</span></div>`;
      const grid = el('div', 'grid ' + (mode === 'list' ? 'list' : 'g5'));
      books.forEach(b => grid.appendChild(localBookCard(b, mode, b.folder.slice(name.length + 1))));
      section.appendChild(grid);
      local.appendChild(section);
    });
  };
  const mkLocal = (label, key, color) => {
    const b = el('button', 'pill' + (localActive === key ? ' on' : ''), label);
    b.style.cssText = 'cursor:pointer;padding:5px 11px' + (color && localActive === key ? `;border-color:${color};color:${color}` : '');
    b.onclick = () => { localActive = key; paintLocal(); paintLocalFilters(); };
    localFilters.appendChild(b);
  };
  const paintLocalFilters = () => {
    localFilters.innerHTML = '';
    mkLocal('Todas', null);
    Object.entries(LIB_CATEGORIES).forEach(([k, a]) => mkLocal(a.label, k, a.color));
  };
  mkViewToggle(pane.querySelector('#localViewToggle'), 'libLocalView', paintLocal);
  pane.querySelector('#rescan').onclick = () => scanLibrary().then(paintLocal);
  paintLocalFilters(); paintLocal();
  if (state.online) scanLibrary({ silent:true }).then(paintLocal);

  /* --- recomendados con filtro por área --- */
  const recs = pane.querySelector('#recs'), filters = pane.querySelector('#filters');
  let active = t.focus || null;
  const paintRecs = () => {
    const mode = LS.get('libRecView', 'grid');
    recs.className = 'grid ' + (mode === 'list' ? 'list' : 'g5');
    recs.innerHTML = '';
    RECOMMENDED.filter(r => !active || r.area === active).forEach(r => recs.appendChild(bookCard(r, null, mode)));
  };
  const mk = (label, key, color) => {
    const b = el('button', 'pill' + (active === key ? ' on' : ''), label);
    b.style.cssText = 'cursor:pointer;padding:5px 11px' + (color && active === key ? `;border-color:${color};color:${color}` : '');
    b.onclick = () => { active = key; paintRecs(); paintFilters(); };
    filters.appendChild(b);
  };
  const paintFilters = () => {
    filters.innerHTML = '';
    mk('Todas', null);
    Object.entries(AREAS).forEach(([k, a]) => mk(a.label, k, a.color));
  };
  mkViewToggle(pane.querySelector('#recViewToggle'), 'libRecView', paintRecs);
  paintFilters(); paintRecs();
}

let libScanInFlight = null;

/* Dos escaneos a la vez (el silencioso al abrir la vista y un clic en
   «Reindexar») no deben pisarse: si ya hay uno corriendo, todos esperan
   ese mismo resultado en vez de disparar otro. */
async function scanLibrary(opts) {
  const silent = opts && opts.silent;
  if (!state.online) { if (!silent) toast('Necesitás el servidor local para indexar'); return LS.get('libIndex', []); }
  if (libScanInFlight) return libScanInFlight;
  libScanInFlight = scanLibraryNow(silent).finally(() => { libScanInFlight = null; });
  return libScanInFlight;
}

async function scanLibraryNow(silent) {
  if (!silent) toast('Indexando la carpeta Librería…');
  /* Si la carpeta raíz no se puede leer (hiccup del servidor, ruta movida),
     no pisamos el índice anterior con uno vacío: lo dejamos como está. */
  try {
    const res = await fetch(urlFor(LIBRARY_DIR + '/'), { cache: 'no-store' });
    if (!res.ok) throw new Error('HTTP ' + res.status);
  } catch (e) {
    if (!silent) toast(`No pude leer ${LIBRARY_DIR}/ (${e.message}). Dejé el índice anterior.`);
    return LS.get('libIndex', []);
  }
  const EXTS = ['pdf', 'tex', 'epub', 'djvu'];
  const out = [];
  /* La carpeta puede tener subcarpetas propias; se recorren hasta 3 niveles. */
  async function walk(dir, depth) {
    for (const it of await listDir(dir)) {
      if (it.isDir) { if (depth < 3) await walk(it.path, depth + 1); }
      else if (EXTS.includes(extOf(it.name)))
        out.push({ name:it.name, path:it.path,
                   folder: dir === LIBRARY_DIR ? '' : dir.slice(LIBRARY_DIR.length + 1) });
    }
  }
  state.dirCache.clear();
  await walk(LIBRARY_DIR, 0);
  LS.set('libIndex', out);
  buildSearchIndex();
  if (!silent) toast(out.length ? `${out.length} libros indexados` : 'La carpeta Librería está vacía');
  return out;
}

/* --- 7k. Configuración --- */

function viewConfig(vp) {
  const pane = el('div', 'pane');
  const S = state.settings;
  pane.innerHTML = `
    <div class="pane-head"><div>
      <h1>Configuración</h1>
      <p class="lead">Todo se guarda en el almacenamiento local de este navegador.
        No hay cuentas, servidores externos ni datos privados fuera de tu máquina.</p>
    </div></div>

    <div class="section-title">Apariencia</div>
    <div class="set-row stack">
      <div><div class="k">Tema</div>
        <div class="d">${THEMES.length} paletas. Cambian toda la interfaz, los documentos
          y la Red de asignaturas embebida.</div></div>
      <div class="theme-grid" id="themes"></div>
    </div>
    <div class="set-row">
      <div><div class="k">Tamaño de letra</div><div class="d">Afecta a toda la interfaz y a los documentos.</div></div>
      <div class="set-ctl"><select class="ctl" id="fs">
        ${[12,13,14,15,16,17].map(n => `<option value="${n}">${n} px</option>`).join('')}</select></div>
    </div>
    <div class="set-row">
      <div><div class="k">Animaciones</div>
        <div class="d">Transiciones de la interfaz, el recorrido de semestres al abrir la
          Red de asignaturas y el volteo de las tarjetas al desbloquearlas. Apagalo si preferís
          que todo aparezca de una o si la máquina va justa.</div></div>
      <div class="set-ctl"><div class="switch${S.anim === false ? '' : ' on'}" id="anim"></div></div>
    </div>

    <div class="section-title">Red de asignaturas</div>
    <div class="set-row">
      <div><div class="k">Tamaño de la red</div>
        <div class="d">Escala tarjetas, textos, columnas y encabezado de la Red de asignaturas,
          sin tocar el resto de la interfaz. Bajalo en pantallas chicas para ver más semestres
          de una vez; subilo en un monitor grande. Entre 60 % y 140 %.</div></div>
      <div class="set-ctl"><input class="ctl" type="range" min="60" max="140" step="5" id="nz">
        <span id="nzv" style="font-family:var(--mono);font-size:12px;width:52px">${S.netZoom || 100}%</span></div>
    </div>

    <div class="set-row">
      <div><div class="k">Modo desbloqueo</div>
        <div class="d">Las materias que todavía no podés cursar aparecen como tarjeta negra
          con un candado y los códigos que te faltan aprobar. Al cumplir el requisito, la tarjeta
          se da vuelta y muestra sus datos. Apuntando una materia se ponen en blanco las que
          habilita; las bloqueadas no responden al cursor.</div></div>
      <div class="set-ctl"><div class="switch${S.netUnlock === true ? ' on' : ''}" id="unlock"></div></div>
    </div>

    <div class="set-row">
      <div><div class="k">Exportar una copia</div>
        <div class="d">Guarda un HTML suelto con la red tal como se ve ahora: tu avance, el tema
          y la escala actuales. Se abre con doble clic sin servidor, sirve para imprimirla o
          mandársela a alguien. Es una foto: marcar materias se sigue haciendo acá.</div></div>
      <div class="set-ctl"><button class="btn" id="netexp">Exportar red</button></div>
    </div>

    <div class="section-title">Documentos</div>
    <div class="set-row">
      <div><div class="k">Componer las fórmulas</div>
        <div class="d">Con KaTeX (local, en <code style="font-family:var(--mono)">vendor/katex/</code>),
          <code style="font-family:var(--mono)">$…$</code> y <code style="font-family:var(--mono)">$$…$$</code>
          se tipografían de verdad en apuntes, notebooks y archivos <code style="font-family:var(--mono)">.tex</code>.
          Apagalo para ver la fuente LaTeX tal cual la escribiste.
          ${window.katex ? '' : '<b style="color:var(--err)">KaTeX no cargó: revisá que exista vendor/katex/katex.min.js.</b>'}</div></div>
      <div class="set-ctl"><div class="switch${S.math === false ? '' : ' on'}" id="math"></div></div>
    </div>

    <div class="section-title">Archivos</div>
    <div class="set-row">
      <div><div class="k">Modo de lectura</div>
        <div class="d">
          Modo: <b style="color:${state.online ? 'var(--ok)' : 'var(--err)'}">${state.online ? 'servidor local' : 'sin servidor'}</b><br>
          Raíz: <span style="font-family:var(--mono);font-size:11.5px;word-break:break-all">${esc(decodeURIComponent(ROOT.href))}</span>
        </div></div>
      <div class="set-ctl"><span class="pill ${state.online ? 'on' : 'off'}">${state.online ? 'accesible' : 'sin acceso'}</span></div>
    </div>
    <div class="set-row">
      <div><div class="k">Cómo leer las carpetas</div>
        <div class="d">El navegador sólo puede listar carpetas si las sirve un servidor.
          Ejecutá <code style="font-family:var(--mono)">abrir-aula.cmd</code> en la raíz del proyecto
          (levanta <code style="font-family:var(--mono)">python -m http.server 8777</code> y abre esta página).
          Abriendo el HTML con doble clic vas a ver la estructura, pero no los archivos.</div></div>
      <div class="set-ctl"><button class="btn" id="recheck">Volver a comprobar</button></div>
    </div>
    <div class="set-row">
      <div><div class="k">Subcarpetas por asignatura</div>
        <div class="d">${SUBFOLDERS.map(f => `<code style="font-family:var(--mono)">${f.key}/</code>`).join(' · ')}
          — creadas dentro de cada una de las ${SUBJECTS.length} carpetas de materia.</div></div>
      <div class="set-ctl"><button class="btn" id="clearcache">Vaciar caché de carpetas</button></div>
    </div>

    <div class="section-title">Datos guardados</div>
    <div class="set-row">
      <div><div class="k">Materias aprobadas</div>
        <div class="d">${state.passed.size} marcadas. Es el mismo dato que usa la Red de asignaturas: lo que marques en un lado aparece en el otro.</div></div>
      <div class="set-ctl"><button class="btn" id="clearpass">Reiniciar</button></div>
    </div>
    <div class="set-row">
      <div><div class="k">Índices</div>
        <div class="d">Mapas detectados: ${Object.keys(state.maps).length} ·
          Libros indexados: ${LS.get('libIndex', []).length}</div></div>
      <div class="set-ctl">
        <button class="btn" id="rescanall">Reindexar todo</button>
        <button class="btn" id="clearidx">Borrar índices</button></div>
    </div>
    <div class="set-row" style="border:none">
      <div><div class="k">Exportar / importar</div>
        <div class="d">Llevate tu progreso a otra máquina o navegador.</div></div>
      <div class="set-ctl">
        <button class="btn" id="exp">Exportar JSON</button>
        <button class="btn" id="imp">Importar</button></div>
    </div>`;
  vp.appendChild(pane);

  const tg = pane.querySelector('#themes');
  const paintThemes = () => {
    tg.innerHTML = '';
    THEMES.forEach(t => {
      const p = t.prev;
      const c = el('button', 'theme-card' + (S.theme === t.id ? ' on' : ''),
        `<div class="theme-prev" style="background:${p.bg}">
           <div class="p-rail" style="background:${p.rail}"></div>
           <div class="p-side" style="background:${p.panel}"></div>
           <div class="p-main">
             <div class="bar" style="background:${p.accent};width:52%"></div>
             <div class="bar" style="background:${p.ink};opacity:.7;width:80%"></div>
             <div class="bar" style="background:${p.cb};opacity:.8;width:38%"></div>
             <div class="bar" style="background:${p.tb};opacity:.8;width:62%"></div>
           </div>
         </div>
         <div class="theme-name">${esc(t.label)}</div>
         <div class="theme-note">${esc(t.note)}</div>`);
      c.onclick = () => { S.theme = t.id; applySettings(); paintThemes(); };
      tg.appendChild(c);
    });
  };
  paintThemes();
  const fs = pane.querySelector('#fs'); fs.value = S.fontSize;
  fs.onchange = () => { S.fontSize = +fs.value; applySettings(); };

  const animSw = pane.querySelector('#anim');
  animSw.onclick = () => {
    S.anim = S.anim === false;
    animSw.classList.toggle('on', S.anim !== false);
    applySettings();
  };

  const unlockSw = pane.querySelector('#unlock');
  unlockSw.onclick = () => {
    S.netUnlock = S.netUnlock !== true;
    unlockSw.classList.toggle('on', S.netUnlock === true);
    applySettings();
    toast(S.netUnlock ? 'Modo desbloqueo activado' : 'Modo desbloqueo desactivado');
  };

  pane.querySelector('#netexp').onclick = exportNetwork;

  const nz = pane.querySelector('#nz'); nz.value = S.netZoom || 100;
  nz.oninput = () => {
    S.netZoom = +nz.value;
    pane.querySelector('#nzv').textContent = nz.value + '%';
    applySettings();
  };
  const mathSw = pane.querySelector('#math');
  mathSw.onclick = () => {
    S.math = S.math === false;
    mathSw.classList.toggle('on', S.math !== false);
    LS.set('settings', S);
    if (state.current && state.current.kind === 'file') renderViewport();
    toast(S.math === false ? 'Fórmulas en fuente LaTeX' : 'Fórmulas compuestas con KaTeX');
  };

  pane.querySelector('#recheck').onclick = async () => {
    state.dirCache.clear(); await probeServer(); renderViewport();
    toast(state.online ? 'Servidor detectado' : 'Sigo sin poder listar carpetas');
  };
  pane.querySelector('#clearcache').onclick = () => { state.dirCache.clear(); toast('Caché vaciada'); };
  pane.querySelector('#clearpass').onclick = () => {
    state.estados = {}; writeShared(ESTADOS_KEY, {});
    syncPassed(); renderViewport(); toast('Progreso reiniciado');
  };
  pane.querySelector('#clearidx').onclick = () => {
    state.maps = {}; state.scanned = false;
    LS.set('maps', {}); LS.set('scanned', false); LS.set('libIndex', []);
    renderViewport(); toast('Índices borrados');
  };
  pane.querySelector('#rescanall').onclick = async () => {
    await scanMaps(); await scanLibrary(); renderViewport();
  };
  pane.querySelector('#exp').onclick = () => {
    const data = { estados:state.estados, netNotas:state.netNotas, notas:state.notas, quizStats:state.quizStats,
                   maps:state.maps, settings:S,
                   libIndex:LS.get('libIndex', []), recent:state.recent, pinned:state.pinned, todos:state.todos,
                   netMaps:state.netMaps };
    const a = el('a');
    a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type:'application/json' }));
    a.download = 'aula-aeroespacial.json';
    a.click();
  };
  pane.querySelector('#imp').onclick = () => {
    const inp = el('input'); inp.type = 'file'; inp.accept = '.json';
    inp.onchange = async () => {
      try {
        const d = JSON.parse(await inp.files[0].text());
        if (d.estados) { state.estados = d.estados; writeShared(ESTADOS_KEY, d.estados); }
        else if (d.passed) { d.passed.forEach(c => { state.estados[c] = 'aprobada'; }); writeShared(ESTADOS_KEY, state.estados); }
        if (d.netNotas) { state.netNotas = d.netNotas; writeShared(NOTAS_EST_KEY, d.netNotas); }
        if (d.notas) { state.notas = d.notas; writeShared(NOTAS_KEY, d.notas); }
        if (d.quizStats) { state.quizStats = d.quizStats; writeShared(QUIZ_KEY, d.quizStats); }
        syncPassed();
        if (d.maps)   { state.maps = d.maps; LS.set('maps', d.maps); }
        if (d.recent)  { state.recent = d.recent; LS.set('recent', d.recent); }
        if (d.pinned)  { state.pinned = d.pinned; LS.set('pinned', d.pinned); }
        if (d.todos)   { state.todos = d.todos; LS.set('todos', d.todos); }
        if (d.netMaps) { state.netMaps = d.netMaps; writeShared(NETMAPS_KEY, d.netMaps); }
        if (d.settings) { state.settings = Object.assign(S, d.settings); applySettings(); }
        if (d.libIndex) LS.set('libIndex', d.libIndex);
        buildSearchIndex();
        renderViewport(); toast('Datos importados');
      } catch { toast('El archivo no es válido'); }
    };
    inp.click();
  };
}

/* ---------- 8. Buscador global (paleta de comandos, Ctrl+P) ---
   Un solo índice sobre materias, documentos, pendientes, libros y vistas.
   Se reconstruye con buildSearchIndex() cuando cambian los datos —no en
   cada tecla—; search(query) puntúa y ordena lo que ya está armado.
----------------------------------------------------------- */

let searchIndex = [];

const SEARCH_TIPOS = { materia:'Materias', pendiente:'Pendientes', doc:'Documentos',
  nb:'Notebooks', libro:'Bibliografía', vista:'Vistas', reciente:'Recientes' };

function buildSearchIndex() {
  const materias = SUBJECTS.map(s => ({
    tipo:'materia', titulo:s.name, texto:s.name + ' ' + s.code, sub:s.code,
    icon:`<span class="chip ${s.type}" style="padding:1px 5px">${s.type}</span>`,
    run:() => openSubject(s.code)
  }));

  const pendientes = state.todos.map(t => {
    const s = t.code && byCode[t.code];
    return { tipo:'pendiente', titulo:t.t, texto:t.t + ' ' + (s ? s.name : ''),
      sub: s ? s.code : 'sin materia', icon:I.check,
      run:() => openTab({ id:'todos', title:'Pendientes', kind:'todos' }) };
  });

  const libros = LS.get('libIndex', []).map(b => ({
    tipo:'doc', docId:b.path, titulo:b.name, texto:b.name + ' ' + (b.folder || ''), sub:b.path,
    icon:fileIcon(b.name), run:() => openFile(b.path)
  }));

  const mapas = Object.entries(state.maps).flatMap(([code, files]) => files.map(f => {
    const s = byCode[code];
    return { tipo:'doc', docId:f, titulo:baseName(f), texto:baseName(f) + ' ' + (s ? s.name : ''),
      sub:f, icon:I.map, run:() => openFile(f) };
  }));

  const recomendados = RECOMMENDED.map(r => ({
    tipo:'libro', titulo:r.title, texto:r.title + ' ' + (r.author || '') + ' ' + (r.codes || []).join(' '),
    sub:r.author || '', icon:I.book,
    run:() => openTab({ id:'library', title:'Librería', kind:'library', focus:r.area })
  }));

  const vistas = VIEWS.map(v => ({
    tipo:'vista', titulo:v.title, texto:v.title, sub:'vista', icon:v.icon,
    run:() => openTab({ id:v.id, title:v.title, kind:v.id })
  }));

  searchIndex = [...materias, ...pendientes, ...libros, ...mapas, ...recomendados, ...vistas];
}

/* Puntaje: exacto > empieza con > contiene en el título > contiene en el texto. */
function scoreItem(item, q) {
  const t = item.titulo.toLowerCase();
  if (t === q) return 4;
  if (t.startsWith(q)) return 3;
  if (t.includes(q)) return 2;
  if ((item.texto || '').toLowerCase().includes(q)) return 1;
  return 0;
}

/* Un documento puede tener varias coincidencias; en la lista de resultados
   solo entra la de mayor puntaje por documento, para no inundar la
   paleta con una fila por cada párrafo que matchea. */
function search(query) {
  const q = (query || '').toLowerCase().trim();
  if (!q) {
    /* Sin texto: lo último abierto, no la lista vacía. */
    return state.recent.map(r => ({
      tipo:'reciente', titulo:r.name, sub:r.path, icon:fileIcon(r.name), run:() => openFile(r.path)
    }));
  }
  const puntuados = [...searchIndex, ...blockEntries]
    .map(item => ({ item, score:scoreItem(item, q) }))
    .filter(x => x.score > 0);

  const mejorPorDoc = new Map();
  const resto = [];
  puntuados.forEach(x => {
    const key = x.item.docId;
    if (!key) { resto.push(x); return; }
    const prev = mejorPorDoc.get(key);
    if (!prev || x.score > prev.score) mejorPorDoc.set(key, x);
  });

  return [...resto, ...mejorPorDoc.values()]
    .sort((a, b) => b.score - a.score)
    .slice(0, 80)
    .map(x => x.item);
}

/* ---------- 8b. Salto a párrafo exacto -----------------------
   Un documento se indexa a nivel de bloque (párrafo, celda) recién la
   primera vez que se abre —así no hay que renderizar toda la carpeta al
   arrancar—, más un pase de fondo en tiempo ocioso que va cubriendo el
   resto de lo que ya está en el índice de archivos.
----------------------------------------------------------- */

let blockEntries = [];
const blockIndexed = new Set();

function assignBlocks(container) {
  container.querySelectorAll('p, li, h1, h2, h3, h4, blockquote, pre, tr')
    .forEach((n, i) => { n.dataset.block = i; });
}

function bloquesDeTexto(raw, kind) {
  if (kind === 'md') {
    const div = document.createElement('div');
    div.innerHTML = mdToHtml(raw);
    assignBlocks(div);
    return [...div.querySelectorAll('[data-block]')]
      .map(n => ({ blockId:n.dataset.block, texto:n.textContent.trim() }))
      .filter(b => b.texto);
  }
  if (kind === 'notebook') {
    let nb;
    try { nb = JSON.parse(raw); } catch { return []; }
    return (nb.cells || []).map((c, i) => {
      const src = Array.isArray(c.source) ? c.source.join('') : (c.source || '');
      const salida = (c.outputs || []).map(o => {
        if (o.output_type === 'stream') return Array.isArray(o.text) ? o.text.join('') : (o.text || '');
        if (o.data && o.data['text/plain'])
          return Array.isArray(o.data['text/plain']) ? o.data['text/plain'].join('') : o.data['text/plain'];
        return '';
      }).join(' ');
      return { blockId:i, texto:(src + ' ' + salida).trim() };
    }).filter(b => b.texto);
  }
  return [];
}

function indexarBloques(path, titulo, raw, kind) {
  if (blockIndexed.has(path)) return;
  blockIndexed.add(path);
  const tipo = kind === 'notebook' ? 'nb' : 'doc';
  bloquesDeTexto(raw, kind).forEach(b => {
    blockEntries.push({
      tipo, docId:path, blockId:b.blockId, titulo, texto:b.texto, sub:titulo,
      icon:fileIcon(titulo), run:() => openFileAtBlock(path, b.blockId)
    });
  });
}

/* Abre el documento y, apenas termina de renderizarse, hace scroll hasta
   el bloque exacto con un flash breve para confirmar dónde aterrizó. */
function openFileAtBlock(path, blockId) {
  openFile(path);
  let intentos = 0;
  const buscar = () => {
    const destino = document.querySelector(`[data-block="${blockId}"], [data-cell="${blockId}"]`);
    if (destino) {
      destino.scrollIntoView({ behavior:'smooth', block:'center' });
      destino.classList.add('search-hit');
      setTimeout(() => destino.classList.remove('search-hit'), 1200);
    } else if (intentos++ < 20) {
      setTimeout(buscar, 100);   // el documento puede seguir renderizándose
    }
  };
  setTimeout(buscar, 150);
}

/* Pase de fondo: uno por uno, en tiempo ocioso, sobre lo que ya está en
   libIndex/maps y todavía no se abrió. */
function idleIndexPass() {
  const siguiente = window.requestIdleCallback || (fn => setTimeout(fn, 300));
  siguiente(() => {
    if (!state.online) return;
    const candidato = [...LS.get('libIndex', []).map(b => b.path), ...Object.values(state.maps).flat()]
      .find(p => /\.(md|markdown|ipynb)$/i.test(p) && !blockIndexed.has(p));
    if (!candidato) return;
    fetchText(candidato)
      .then(raw => indexarBloques(candidato, baseName(candidato), raw,
        extOf(candidato) === 'ipynb' ? 'notebook' : 'md'))
      .catch(() => blockIndexed.add(candidato))
      .finally(idleIndexPass);
  });
}

const pal = { filtered: [], sel: 0 };

function openPalette() {
  $('#overlay').classList.add('show');
  const inp = $('#pal-input');
  inp.value = ''; inp.focus();
  paintPalette('');
}

/* Recorta ~90 caracteres alrededor del término, con el término en <strong>. */
function snippetDe(texto, q) {
  const idx = texto.toLowerCase().indexOf(q);
  if (idx < 0) return esc(texto.slice(0, 90));
  const ini = Math.max(0, idx - 40), fin = Math.min(texto.length, idx + q.length + 40);
  return (ini > 0 ? '…' : '') + esc(texto.slice(ini, idx)) +
    '<strong>' + esc(texto.slice(idx, idx + q.length)) + '</strong>' +
    esc(texto.slice(idx + q.length, fin)) + (fin < texto.length ? '…' : '');
}

let paletteDebounce;
function paintPalette(q) {
  clearTimeout(paletteDebounce);
  paletteDebounce = setTimeout(() => renderPaletteList(search(q), q.toLowerCase().trim()), 120);
}

function renderPaletteList(list, q) {
  pal.filtered = list;
  pal.sel = 0;
  const box = $('#pal-list');
  box.innerHTML = '';
  if (!list.length) { box.innerHTML = '<div class="empty">Nada coincide.</div>'; return; }
  let lastTipo = null;
  list.forEach((x, i) => {
    if (x.tipo !== lastTipo) {
      lastTipo = x.tipo;
      box.appendChild(el('div', 'tree-empty', SEARCH_TIPOS[x.tipo] || x.tipo));
    }
    const sub = (x.blockId != null && q) ? snippetDe(x.texto, q) : esc(x.sub || '');
    const n = el('div', 'p-item' + (i === 0 ? ' sel' : ''),
      `<span style="display:flex">${x.icon}</span><span>${esc(x.titulo)}</span>
       <span class="p-sub">${sub}</span>`);
    n.onclick = () => { closePalette(); x.run(); };
    n.onmouseenter = () => {
      $$('.p-item', box).forEach(o => o.classList.remove('sel'));
      n.classList.add('sel'); pal.sel = i;
    };
    box.appendChild(n);
  });
}

function closePalette() { $('#overlay').classList.remove('show'); }

function movePalette(d) {
  const items = $$('.p-item');
  if (!items.length) return;
  pal.sel = (pal.sel + d + items.length) % items.length;
  items.forEach((n, i) => n.classList.toggle('sel', i === pal.sel));
  items[pal.sel].scrollIntoView({ block:'nearest' });
}

/* ---------- 9. Teclado ------------------------------------- */

document.addEventListener('keydown', e => {
  const overlayOpen = $('#overlay').classList.contains('show');
  if (overlayOpen) {
    if (e.key === 'Escape') { closePalette(); e.preventDefault(); }
    if (e.key === 'ArrowDown') { movePalette(1); e.preventDefault(); }
    if (e.key === 'ArrowUp') { movePalette(-1); e.preventDefault(); }
    if (e.key === 'Enter') {
      const x = (pal.filtered || [])[pal.sel];
      closePalette(); if (x) x.run(); e.preventDefault();
    }
    return;
  }
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') { e.preventDefault(); openPalette(); }
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'w') { e.preventDefault(); if (state.current) closeCurrent(); }
  if ((e.ctrlKey || e.metaKey) && /^[1-6]$/.test(e.key)) { e.preventDefault(); setView(VIEWS[+e.key - 1].id); }
  if (e.key === 'Backspace' && !isTypingTarget(e.target) && state.current && state.current.back) {
    e.preventDefault();
    openTab(state.current.back);
  }
});
function isTypingTarget(t) {
  return t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));
}
addEventListener('resize', () => {
  if (state.current && state.current.kind === 'correl' && viewCorrel._resize) viewCorrel._resize();
});
$('#pal-input').addEventListener('input', e => paintPalette(e.target.value));
$('#overlay').addEventListener('click', e => { if (e.target.id === 'overlay') closePalette(); });

/* ---------- 10. Arranque ----------------------------------- */

(async function init() {
  applySettings();
  buildSearchIndex();
  await probeServer();
  idleIndexPass();
  renderRail();
  const v = VIEWS.find(x => x.id === state.view);
  openTab({ id:v.id, title:v.title, kind:v.id });
  renderViewport();
})();
