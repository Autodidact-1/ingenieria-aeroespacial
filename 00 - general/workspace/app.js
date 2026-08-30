/* ============================================================
   app.js — Aula · Ingeniería Aeroespacial UNLP
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

/* Raíz del repo: este archivo vive en "00 - general/workspace/" */
const ROOT = new URL('../../', location.href);
const urlFor = relPath => new URL(relPath.split('/').map(encodeURIComponent).join('/'), ROOT).href;
const extOf = name => (name.split('.').pop() || '').toLowerCase();
const kindOf = name => EXT_KIND[extOf(name)] || 'binary';
const baseName = p => p.split('/').filter(Boolean).pop() || p;

/* Claves compartidas con "red_correlativas_aeroespacial.html": la red se
   embebe en un iframe del mismo origen, así que ambas vistas leen y escriben
   exactamente el mismo progreso. */
const PASSED_KEY = 'aero_passed_claude_dark';
const NETMAPS_KEY = 'aero_mapas_claude_dark';
const readShared = (key, d) => {
  try { const v = localStorage.getItem(key); return v == null ? d : JSON.parse(v); }
  catch { return d; }
};
const writeShared = (key, v) => { try { localStorage.setItem(key, JSON.stringify(v)); } catch {} };

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
  files:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 4h5l2 2h9v13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z"/></svg>',
  network: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="6" cy="6" r="2.4"/><circle cx="18" cy="6" r="2.4"/><circle cx="12" cy="18" r="2.4"/><path d="M7.7 7.6 10.6 16M16.3 7.6 13.4 16M8.4 6h7.2"/></svg>',
  map:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M9 4 3 6.5v13L9 17l6 2.5 6-2.5v-13L15 6.5 9 4z"/><path d="M9 4v13M15 6.5v13"/></svg>',
  book:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2V5z"/><path d="M4 19a2 2 0 0 1 2-2h13"/></svg>',
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
  search:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2"/></svg>'
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
  tabs: [],                 // {id, title, kind, path}
  active: null,
  expanded: new Set(LS.get('expanded', [])),
  passed: new Set(readShared(PASSED_KEY, [])),
  maps: LS.get('maps', {}), // code -> {files:[...]}  resultado del escaneo
  scanned: LS.get('scanned', false),
  fileIndex: LS.get('fileIndex', []),   // para la paleta Ctrl+P
  settings: LS.get('settings', {
    theme: 'dark', fontSize: 14, sidebar: 300,
    hideEmpty: false, openPdfExternal: false, defaultPane: 'files', math: true
  })
};
const byCode = Object.fromEntries(SUBJECTS.map(s => [s.code, s]));

function applySettings() {
  if (!THEMES.some(t => t.id === state.settings.theme)) state.settings.theme = 'dark';
  document.documentElement.dataset.theme = state.settings.theme;
  document.documentElement.style.setProperty('--fs', state.settings.fontSize + 'px');
  document.documentElement.style.setProperty('--sidebar-w', state.settings.sidebar + 'px');
  LS.set('settings', state.settings);
  themeIframes();
}

/* La red de correlativas trae su propia paleta fija. Como se sirve desde el
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
    root.setProperty('--prereq', mine.getPropertyValue('--err').trim());
    root.setProperty('--unlocks', mine.getPropertyValue('--ok').trim());
    root.setProperty('--passed-bg', mine.getPropertyValue('--accent-soft').trim());
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

const VIEWS = [
  { id:'files',   icon:I.files,   title:'Explorador' },
  { id:'correl',  icon:I.network, title:'Red de correlativas' },
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
  if (state.view === id) {                       // segundo clic: plegar
    $('#sidebar').classList.toggle('collapsed');
    return;
  }
  $('#sidebar').classList.remove('collapsed');
  state.view = id;
  LS.set('view', id);
  renderRail();
  renderSidebar();
}

/* ---------- 5. Sidebar ------------------------------------- */

function renderSidebar() {
  const v = VIEWS.find(x => x.id === state.view);
  $('#side-title').textContent = v.title;
  $('#side-acts').innerHTML = '';
  const body = $('#side-body');
  body.innerHTML = '';
  ({
    files: sideFiles, correl: sideCorrel, maps: sideMaps,
    library: sideLibrary, config: sideConfig
  })[state.view](body);
}

function addAct(icon, title, fn) {
  const b = el('button', 'icon-btn', icon);
  b.title = title;
  b.onclick = fn;
  $('#side-acts').appendChild(b);
  return b;
}

/* --- 5a. Explorador de archivos --- */

function sideFiles(body) {
  addAct(I.refresh, 'Volver a leer las carpetas', () => {
    state.dirCache.clear(); renderSidebar(); toast('Carpetas releídas');
  });
  addAct(I.collapse, 'Contraer todo', () => {
    state.expanded.clear(); LS.set('expanded', []); renderSidebar();
  });

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

    SEMESTERS.forEach((semLabel, semIdx) => {
      let subs = SUBJECTS.filter(s => s.sem === semIdx);
      if (q) subs = subs.filter(s =>
        (s.name + ' ' + s.code + ' ' + s.concepts.join(' ')).toLowerCase().includes(q));
      if (!subs.length) return;
      tree.appendChild(semNode(semLabel, semIdx, subs, !!q));
    });

    EXTRA_ROOTS.forEach(r => {
      if (q && !r.label.toLowerCase().includes(q)) return;
      tree.appendChild(dirNode(r.path, r.label, 0));
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
    row.innerHTML = `<span class="chev">${I.chev}</span>
      <span class="dot ${s.type}"></span>
      <span class="lbl">${esc(s.name)}</span>
      <span class="code">${s.code}</span>`;
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
  function dirNode(relPath, label, depth, hint) {
    const key = 'dir:' + relPath;
    const open = state.expanded.has(key);
    const box = el('div');
    const row = el('div', 'node-row' + (open ? ' open' : ''));
    row.innerHTML = `<span class="chev">${I.chev}</span>
      <span class="ico" style="color:var(--ink-dim)">${I.folder}</span>
      <span class="lbl">${esc(label)}</span>
      <span class="code" data-cnt></span>`;
    if (hint) row.title = hint;
    const kids = el('div', 'node-children' + (open ? '' : ' hidden'));
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
  }

  function markSelected(node) {
    $$('.node-row.selected').forEach(n => n.classList.remove('selected'));
    node.classList.add('selected');
  }

  drawTree();
}

/* --- 5b. Correlativas --- */

function sideCorrel(body) {
  const wrap = el('div', 'search-wrap');
  wrap.innerHTML = `<div style="font-size:12px;color:var(--ink-muted);line-height:1.6">
    Marcá las materias aprobadas dentro de la red; el progreso se guarda en tu navegador.</div>`;
  body.appendChild(wrap);

  const tree = el('div', 'tree');
  const b = el('div', 'card', `<div class="c-name">Abrir la red completa</div>
    <div class="c-meta" style="margin-top:5px">Vista de columnas por semestre con las flechas de correlatividad</div>`);
  b.style.margin = '0 12px 14px';
  b.onclick = () => openTab({ id:'correl', title:'Red de correlativas', kind:'correl' });
  body.appendChild(b);

  const st = el('div', 'search-wrap');
  const done = SUBJECTS.filter(s => state.passed.has(s.code));
  const hrs = done.reduce((a, s) => a + s.het, 0);
  st.innerHTML = `<div style="font-size:11.5px;color:var(--ink-muted);line-height:1.9">
     Aprobadas <b style="color:var(--accent-dark)">${done.length}</b> de ${SUBJECTS.length}<br>
     Horas <b style="color:var(--accent-dark)">${hrs}</b> / ${TOTAL_HOURS}
     (${((hrs / TOTAL_HOURS) * 100).toFixed(1)}%)</div>`;
  body.appendChild(st);

  body.appendChild(el('div', 'side-head', 'Por semestre'));
  SEMESTERS.forEach((label, i) => {
    const subs = SUBJECTS.filter(s => s.sem === i);
    if (!subs.length) return;
    const row = el('div', 'node-row');
    const n = subs.filter(s => state.passed.has(s.code)).length;
    row.innerHTML = `<span style="width:12px;flex:0 0 12px"></span>
      <span class="lbl">${esc(label)}</span>
      <span class="code">${n}/${subs.length}</span>`;
    row.onclick = () => openTab({ id:'correl', title:'Red de correlativas', kind:'correl' });
    tree.appendChild(row);
  });
  body.appendChild(tree);
}

/* --- 5c. Mapas --- */

function sideMaps(body) {
  addAct(I.refresh, 'Escanear carpetas de apuntes en busca de mapas', scanMaps);
  const wrap = el('div', 'search-wrap');
  wrap.innerHTML = `<div style="font-size:12px;color:var(--ink-muted);line-height:1.6">
    Un mapa es cualquier archivo dentro de <code style="font-family:var(--mono)">apuntes/</code>
    cuyo nombre contenga «mapa» o «red».</div>`;
  body.appendChild(wrap);

  const list = [
    { id:'maps-inter', t:'Mapa inter-asignaturas', d:'Todas las materias conectadas por área y correlatividad' },
    { id:'maps-index', t:'Índice de mapas por materia', d:'Qué asignaturas ya tienen mapa conceptual' }
  ];
  list.forEach(x => {
    const c = el('div', 'card', `<div class="c-name">${x.t}</div>
      <div class="c-meta" style="margin-top:5px">${x.d}</div>`);
    c.style.margin = '0 12px 10px';
    c.onclick = () => openTab({ id:x.id, title:x.t, kind:x.id });
    body.appendChild(c);
  });

  body.appendChild(el('div', 'side-head', 'Áreas temáticas'));
  const tree = el('div', 'tree');
  Object.entries(AREAS).forEach(([k, a]) => {
    const subs = SUBJECTS.filter(s => s.area === k);
    const row = el('div', 'node-row');
    row.innerHTML = `<span style="width:12px;flex:0 0 12px"></span>
      <span class="dot" style="background:${a.color}"></span>
      <span class="lbl">${esc(a.label)}</span>
      <span class="code">${subs.length}</span>`;
    row.onclick = () => openTab({ id:'maps-inter', title:'Mapa inter-asignaturas', kind:'maps-inter', focus:k });
    tree.appendChild(row);
  });
  body.appendChild(tree);
}

/* --- 5d. Librería --- */

function sideLibrary(body) {
  addAct(I.refresh, 'Reindexar las carpetas material/', scanLibrary);
  const c = el('div', 'card', `<div class="c-name">Abrir la librería</div>
    <div class="c-meta" style="margin-top:5px">Tus libros locales, recomendaciones y búsqueda web</div>`);
  c.style.margin = '4px 12px 14px';
  c.onclick = () => openTab({ id:'library', title:'Librería', kind:'library' });
  body.appendChild(c);

  body.appendChild(el('div', 'side-head', 'Recomendados por área'));
  const tree = el('div', 'tree');
  Object.entries(AREAS).forEach(([k, a]) => {
    const n = RECOMMENDED.filter(r => r.area === k).length;
    if (!n) return;
    const row = el('div', 'node-row');
    row.innerHTML = `<span style="width:12px;flex:0 0 12px"></span>
      <span class="dot" style="background:${a.color}"></span>
      <span class="lbl">${esc(a.label)}</span><span class="code">${n}</span>`;
    row.onclick = () => openTab({ id:'library', title:'Librería', kind:'library', focus:k });
    tree.appendChild(row);
  });
  body.appendChild(tree);
}

/* --- 5e. Configuración --- */

function sideConfig(body) {
  const c = el('div', 'card', `<div class="c-name">Abrir configuración</div>
    <div class="c-meta" style="margin-top:5px">Tema, tipografía, rutas y datos guardados</div>`);
  c.style.margin = '4px 12px 14px';
  c.onclick = () => openTab({ id:'config', title:'Configuración', kind:'config' });
  body.appendChild(c);

  const s = el('div', 'search-wrap');
  s.innerHTML = `<div style="font-size:11.5px;color:var(--ink-muted);line-height:1.8">
    Modo: <b style="color:${state.online ? 'var(--ok)' : 'var(--err)'}">${state.online ? 'servidor local' : 'sin servidor'}</b><br>
    Raíz: <span style="font-family:var(--mono);font-size:10.5px;word-break:break-all">${esc(decodeURIComponent(ROOT.href))}</span>
  </div>`;
  body.appendChild(s);
}

/* ---------- 6. Pestañas ------------------------------------ */

function openTab(tab) {
  const found = state.tabs.find(t => t.id === tab.id);
  if (found) { Object.assign(found, tab); state.active = found.id; }
  else { state.tabs.push(tab); state.active = tab.id; }
  renderTabs();
  renderViewport();
}

function closeTab(id) {
  const i = state.tabs.findIndex(t => t.id === id);
  if (i < 0) return;
  state.tabs.splice(i, 1);
  if (state.active === id) state.active = (state.tabs[i] || state.tabs[i - 1] || {}).id || null;
  renderTabs();
  renderViewport();
}

function renderTabs() {
  const bar = $('#tabbar');
  bar.innerHTML = '';
  state.tabs.forEach(t => {
    const n = el('div', 'tab' + (t.id === state.active ? ' active' : ''));
    const ico = t.kind === 'file' ? fileIcon(t.title) : '';
    n.innerHTML = (ico ? `<span class="ftype" style="display:flex">${ico}</span>` : '') +
                  `<span class="name">${esc(t.title)}</span>`;
    const x = el('span', 'x', I.x);
    x.onclick = e => { e.stopPropagation(); closeTab(t.id); };
    n.appendChild(x);
    n.onclick = () => { state.active = t.id; renderTabs(); renderViewport(); };
    n.title = t.path || t.title;
    bar.appendChild(n);
  });
  renderStatus();
}

function renderStatus() {
  state.passed = new Set(readShared(PASSED_KEY, []));   // la red puede haberlo cambiado
  const t = state.tabs.find(x => x.id === state.active);
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
  const t = state.tabs.find(x => x.id === state.active);
  if (!t) { vp.appendChild(viewWelcome()); renderStatus(); return; }
  ({
    file: viewFile, correl: viewCorrel, 'maps-inter': viewMapsInter,
    'maps-index': viewMapsIndex, library: viewLibrary,
    config: viewConfig, subject: viewSubject
  })[t.kind](vp, t);
  renderStatus();
}

/* --- 7a. Bienvenida --- */

function viewWelcome() {
  const w = el('div', 'welcome');
  const done = SUBJECTS.filter(s => state.passed.has(s.code)).length;
  w.innerHTML = `
    <h1>Aula aeroespacial</h1>
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
          <div><span class="kbd">Ctrl</span> <span class="kbd">1…5</span>&nbsp; cambiar de sección</div>
          <div><span class="kbd">Ctrl</span> <span class="kbd">B</span>&nbsp; plegar la barra lateral</div>
          <div><span class="kbd">Ctrl</span> <span class="kbd">W</span>&nbsp; cerrar la pestaña</div>
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
    ['Explorar mis carpetas', () => setView('files')],
    ['Ver la red de correlativas', () => openTab({ id:'correl', title:'Red de correlativas', kind:'correl' })],
    ['Mapa inter-asignaturas', () => openTab({ id:'maps-inter', title:'Mapa inter-asignaturas', kind:'maps-inter' })],
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
  if (kind === 'md')        box.innerHTML = mdToHtml(raw);
  else if (kind === 'notebook') { box.remove(); vp.appendChild(renderNotebook(raw, t.title)); }
  else if (kind === 'latex')box.innerHTML = `<h1>${esc(t.title)}</h1>${renderLatex(raw)}`;
  else                      box.innerHTML = `<h1>${esc(t.title)}</h1><pre><code>${esc(raw)}</code></pre>`;
}

function openFile(path) {
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

  (nb.cells || []).forEach(c => {
    const src = Array.isArray(c.source) ? c.source.join('') : (c.source || '');
    const cell = el('div', 'nb-cell');
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

/* --- 7f. Red de correlativas (se embebe el archivo existente) --- */

function viewCorrel(vp) {
  const f = el('iframe', 'frame dark');
  f.src = urlFor('00 - general/correlativas/red_correlativas_aeroespacial.html');
  f.addEventListener('load', themeIframes);
  vp.appendChild(f);
  clearInterval(viewCorrel._t);
  viewCorrel._t = setInterval(() => {          // la red guarda sola: reflejamos el avance
    const now = readShared(PASSED_KEY, []);
    if (now.length !== state.passed.size) { renderStatus(); if (state.view === 'correl') renderSidebar(); }
  }, 1500);
}

/* --- 7g. Ficha de asignatura --- */

function openSubject(code) {
  const s = byCode[code];
  openTab({ id:'s:' + code, title:s.code + ' · ' + s.name, kind:'subject', code, path:s.dir });
}

async function viewSubject(vp, t) {
  const s = byCode[t.code];
  const pane = el('div', 'pane');
  const unlocks = SUBJECTS.filter(x => x.prereqs.includes(s.code));
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
      <div style="display:flex;gap:8px">
        <button class="btn" id="btn-pass"></button>
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

    <div class="section-title">Carpetas</div>
    <div class="grid g3" id="folders"></div>

    <div class="section-title">Bibliografía sugerida</div>
    <div class="grid g3" id="books"></div>`;
  vp.appendChild(pane);

  const link = (code, box) => {
    const x = byCode[code];
    const a = el('a', null, `${x.code} · ${x.name}`);
    a.style.cursor = 'pointer';
    a.onclick = () => openSubject(code);
    box.appendChild(a);
  };
  const pre = pane.querySelector('#pre-list'), post = pane.querySelector('#post-list');
  s.prereqs.length ? s.prereqs.forEach(c => link(c, pre))
                   : pre.appendChild(el('span', null, '<span style="color:var(--ink-dim)">ninguna</span>'));
  unlocks.length ? unlocks.forEach(x => link(x.code, post))
                 : post.appendChild(el('span', null, '<span style="color:var(--ink-dim)">ninguna</span>'));

  const btn = pane.querySelector('#btn-pass');
  const paintBtn = () => {
    const on = state.passed.has(s.code);
    btn.className = 'btn' + (on ? ' primary' : '');
    btn.textContent = on ? '✓ Aprobada' : 'Marcar aprobada';
  };
  btn.onclick = () => {
    state.passed.has(s.code) ? state.passed.delete(s.code) : state.passed.add(s.code);
    writeShared(PASSED_KEY, [...state.passed]); paintBtn(); renderStatus();
  };
  paintBtn();

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
      renderSidebar();
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

/* --- 7h. Mapa inter-asignaturas --- */

function viewMapsInter(vp, t) {
  const pane = el('div', 'pane');
  pane.innerHTML = `
    <div class="pane-head"><div>
      <h1>Mapa inter-asignaturas</h1>
      <p class="lead">Las 47 asignaturas agrupadas por área temática. Cada línea es una correlatividad;
        las líneas que cruzan de un área a otra son los puentes conceptuales de la carrera.
        Pasá el cursor por un nodo para aislar su vecindario, hacé clic para abrir la ficha.</p>
    </div></div>
    <div class="graph-wrap" id="gwrap"></div>
    <div class="section-title">Puentes entre áreas</div>
    <div class="grid g3" id="bridges"></div>`;
  vp.appendChild(pane);
  drawInterGraph(pane.querySelector('#gwrap'), t.focus);

  const bridges = {};
  SUBJECTS.forEach(s => s.prereqs.forEach(p => {
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

function drawInterGraph(wrap, focusArea) {
  const W = 1100, H = 640, cx = W / 2, cy = H / 2, R = 245;
  const order = Object.keys(AREAS);
  const grouped = order.flatMap(a => SUBJECTS.filter(s => s.area === a));
  const pos = {};
  grouped.forEach((s, i) => {
    const ang = (i / grouped.length) * Math.PI * 2 - Math.PI / 2;
    pos[s.code] = { x: cx + Math.cos(ang) * R, y: cy + Math.sin(ang) * R, ang };
  });

  const NS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

  const gEdges = document.createElementNS(NS, 'g');
  const gNodes = document.createElementNS(NS, 'g');
  svg.append(gEdges, gNodes);

  const edges = [];
  SUBJECTS.forEach(s => s.prereqs.forEach(p => {
    if (!pos[p] || !pos[s.code]) return;
    const a = pos[p], b = pos[s.code];
    const path = document.createElementNS(NS, 'path');
    const k = 0.42;                                  // curvatura hacia el centro
    const mx = cx + (a.x + b.x) / 2 * 0 + ((a.x + b.x) / 2 - cx) * k;
    const my = cy + ((a.y + b.y) / 2 - cy) * k;
    path.setAttribute('d', `M${a.x.toFixed(1)},${a.y.toFixed(1)} Q${mx.toFixed(1)},${my.toFixed(1)} ${b.x.toFixed(1)},${b.y.toFixed(1)}`);
    path.setAttribute('class', 'g-edge');
    const cross = byCode[p].area !== s.area;
    if (cross) { path.setAttribute('stroke', AREAS[byCode[p].area].color); path.setAttribute('stroke-opacity', '.7'); path.setAttribute('stroke-width', '1.4'); }
    gEdges.appendChild(path);
    edges.push({ el: path, a: p, b: s.code });
  }));

  const nodes = [];
  grouped.forEach(s => {
    const p = pos[s.code];
    const g = document.createElementNS(NS, 'g');
    g.setAttribute('class', 'g-node');
    const c = document.createElementNS(NS, 'circle');
    c.setAttribute('cx', p.x); c.setAttribute('cy', p.y);
    c.setAttribute('r', 6 + Math.min(6, s.het / 40));
    c.setAttribute('fill', AREAS[s.area].color);
    c.setAttribute('stroke', 'var(--panel)');
    c.setAttribute('stroke-width', state.passed.has(s.code) ? 3 : 1.5);
    c.setAttribute('fill-opacity', state.passed.has(s.code) ? 1 : .75);
    const tx = document.createElementNS(NS, 'text');
    const right = Math.cos(p.ang) > -0.01;
    tx.setAttribute('x', p.x + Math.cos(p.ang) * 16);
    tx.setAttribute('y', p.y + Math.sin(p.ang) * 16 + 3.2);
    tx.setAttribute('text-anchor', right ? 'start' : 'end');
    tx.textContent = s.code;
    g.append(c, tx);
    g.addEventListener('mouseenter', () => highlight(s.code, p, s));
    g.addEventListener('mouseleave', clearHi);
    g.addEventListener('click', () => openSubject(s.code));
    gNodes.appendChild(g);
    nodes.push({ el: g, code: s.code, area: s.area });
  });

  const tip = el('div', 'g-tip');
  wrap.append(svg, tip);

  function highlight(code, p, s) {
    const near = new Set([code]);
    edges.forEach(e => { if (e.a === code) near.add(e.b); if (e.b === code) near.add(e.a); });
    nodes.forEach(n => n.el.classList.toggle('dim', !near.has(n.code)));
    edges.forEach(e => {
      const hot = e.a === code || e.b === code;
      e.el.classList.toggle('hot', hot);
      e.el.classList.toggle('dim', !hot);
    });
    const rect = wrap.getBoundingClientRect();
    tip.innerHTML = `<b>${esc(s.name)}</b><br>
      <span style="color:var(--ink-muted)">${s.code} · ${SEMESTERS[s.sem]} · ${AREAS[s.area].label}</span>
      ${s.concepts.length ? '<br>' + s.concepts.map(esc).join(' · ') : ''}`;
    tip.style.left = Math.min(rect.width - 260, Math.max(8, p.x / W * rect.width + 14)) + 'px';
    tip.style.top = Math.max(8, p.y / H * rect.height - 10) + 'px';
    tip.classList.add('show');
  }
  function clearHi() {
    nodes.forEach(n => n.el.classList.remove('dim'));
    edges.forEach(e => e.el.classList.remove('hot', 'dim'));
    tip.classList.remove('show');
  }

  const legend = el('div', 'g-legend');
  Object.entries(AREAS).forEach(([k, a]) => {
    const li = el('div', 'li', `<span class="sw" style="background:${a.color}"></span>${a.label}`);
    li.onclick = () => {
      const on = !li.dataset.on;
      nodes.forEach(n => n.el.classList.toggle('dim', on && n.area !== k));
      li.dataset.on = on ? '1' : '';
      $$('.g-legend .li', legend).forEach(o => { if (o !== li) o.dataset.on = ''; });
    };
    if (focusArea === k) setTimeout(() => li.click(), 60);
    legend.appendChild(li);
  });
  wrap.appendChild(legend);
}

/* --- 7i. Índice de mapas por materia --- */

function viewMapsIndex(vp) {
  const pane = el('div', 'pane');
  pane.innerHTML = `
    <div class="pane-head">
      <div><h1>Mapas conceptuales por asignatura</h1>
        <p class="lead">Se considera mapa cualquier archivo dentro de <code>apuntes/</code>
          cuyo nombre contenga «mapa» o «red». Escaneá para actualizar el índice.</p></div>
      <button class="btn primary" id="scan">Escanear apuntes</button>
    </div>
    <div class="grid g4" id="mgrid" style="margin-top:18px"></div>`;
  vp.appendChild(pane);
  pane.querySelector('#scan').onclick = () => scanMaps().then(() => renderViewport());

  const grid = pane.querySelector('#mgrid');
  const declared = readShared(NETMAPS_KEY, {});
  SUBJECTS.filter(s => s.concepts.length).forEach(s => {
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
  toast(`Listo: ${Object.keys(res).length} asignaturas con mapa`);
}

/* --- 7j. Librería --- */

function bookCard(r, extra) {
  const c = el('div', 'card flat');
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
    if (p) { p.style.cursor = 'pointer'; p.onclick = () => openSubject(code); }
  });
  return c;
}

function viewLibrary(vp, t) {
  const pane = el('div', 'pane');
  pane.innerHTML = `
    <div class="pane-head"><div>
      <h1>Librería</h1>
      <p class="lead">Los libros que ya tenés en las carpetas <code>material/</code>, la bibliografía
        recomendada para cada materia y una búsqueda sobre el catálogo abierto de Open Library.</p>
    </div></div>

    <div class="section-title">Buscar en la web</div>
    <div class="searchbar">
      <input id="q" placeholder="Título, autor o tema — p. ej. «aerodynamics Anderson»">
      <button class="btn primary" id="go">Buscar</button>
    </div>
    <div id="results"></div>

    <div class="section-title">Mis libros locales
      <button class="btn" id="rescan" style="margin-left:auto">Reindexar</button></div>
    <div class="grid g3" id="local"></div>

    <div class="section-title">Recomendados</div>
    <div style="display:flex;gap:7px;flex-wrap:wrap;margin-bottom:14px" id="filters"></div>
    <div class="grid g3" id="recs"></div>`;
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
          note: d.first_publish_year ? 'Primera edición ' + d.first_publish_year : ''
        }, `<a class="pill" href="https://openlibrary.org${d.key}" target="_blank">Open Library ↗</a>`);
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
  const paintLocal = () => {
    const idx = LS.get('libIndex', []);
    local.innerHTML = '';
    if (!idx.length) {
      local.innerHTML = state.online
        ? '<div class="empty">Todavía no indexaste. Tocá «Reindexar» para recorrer todas las carpetas material/.</div>'
        : '<div class="empty">Necesitás el servidor local para leer tus carpetas.</div>';
      return;
    }
    idx.forEach(b => {
      const s = byCode[b.code];
      const c = el('div', 'card');
      c.innerHTML = `<div class="book">
          <div class="book-cover">${fileIcon(b.name)}</div>
          <div class="book-info">
            <div class="book-title">${esc(b.name)}</div>
            <div class="book-author">${esc(s.code)} · ${esc(s.name)}</div>
            <div class="book-tags"><span class="pill">${extOf(b.name).toUpperCase()}</span>
              <span class="pill" style="border-color:${AREAS[s.area].color};color:${AREAS[s.area].color}">${AREAS[s.area].label}</span></div>
          </div></div>`;
      c.onclick = () => openFile(b.path);
      local.appendChild(c);
    });
  };
  pane.querySelector('#rescan').onclick = () => scanLibrary().then(paintLocal);
  paintLocal();

  /* --- recomendados con filtro por área --- */
  const recs = pane.querySelector('#recs'), filters = pane.querySelector('#filters');
  let active = t.focus || null;
  const paintRecs = () => {
    recs.innerHTML = '';
    RECOMMENDED.filter(r => !active || r.area === active).forEach(r => recs.appendChild(bookCard(r)));
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
  paintFilters(); paintRecs();
}

async function scanLibrary() {
  if (!state.online) { toast('Necesitás el servidor local para indexar'); return; }
  toast('Indexando carpetas material/…');
  const out = [];
  for (const s of SUBJECTS) {
    const items = await listDir(s.dir + '/material');
    items.filter(i => !i.isDir && ['pdf', 'tex', 'epub', 'djvu'].includes(extOf(i.name)))
         .forEach(i => out.push({ name:i.name, path:i.path, code:s.code }));
  }
  LS.set('libIndex', out);
  toast(`${out.length} libros indexados`);
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
          y la red de correlativas embebida.</div></div>
      <div class="theme-grid" id="themes"></div>
    </div>
    <div class="set-row">
      <div><div class="k">Tamaño de letra</div><div class="d">Afecta a toda la interfaz y a los documentos.</div></div>
      <div class="set-ctl"><select class="ctl" id="fs">
        ${[12,13,14,15,16,17].map(n => `<option value="${n}">${n} px</option>`).join('')}</select></div>
    </div>
    <div class="set-row">
      <div><div class="k">Ancho de la barra lateral</div><div class="d">Entre 220 y 460 píxeles.</div></div>
      <div class="set-ctl"><input class="ctl" type="range" min="220" max="460" step="10" id="sw">
        <span id="swv" style="font-family:var(--mono);font-size:12px;width:52px">${S.sidebar}px</span></div>
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
      <div><div class="k">Raíz del repositorio</div>
        <div class="d" style="font-family:var(--mono);font-size:11.5px;word-break:break-all">${esc(decodeURIComponent(ROOT.href))}</div></div>
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
        <div class="d">${state.passed.size} marcadas. Es el mismo dato que usa la red de correlativas: lo que marques en un lado aparece en el otro.</div></div>
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
  const sw = pane.querySelector('#sw'); sw.value = S.sidebar;
  sw.oninput = () => { S.sidebar = +sw.value; pane.querySelector('#swv').textContent = sw.value + 'px'; applySettings(); };

  const mathSw = pane.querySelector('#math');
  mathSw.onclick = () => {
    S.math = S.math === false;
    mathSw.classList.toggle('on', S.math !== false);
    LS.set('settings', S);
    state.tabs.filter(t => t.kind === 'file').forEach(t => { if (t.id === state.active) renderViewport(); });
    toast(S.math === false ? 'Fórmulas en fuente LaTeX' : 'Fórmulas compuestas con KaTeX');
  };

  pane.querySelector('#recheck').onclick = async () => {
    state.dirCache.clear(); await probeServer(); renderViewport(); renderSidebar();
    toast(state.online ? 'Servidor detectado' : 'Sigo sin poder listar carpetas');
  };
  pane.querySelector('#clearcache').onclick = () => { state.dirCache.clear(); toast('Caché vaciada'); };
  pane.querySelector('#clearpass').onclick = () => {
    state.passed.clear(); writeShared(PASSED_KEY, []); renderViewport(); renderSidebar(); toast('Progreso reiniciado');
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
    const data = { passed:[...state.passed], maps:state.maps, settings:S, libIndex:LS.get('libIndex', []) };
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
        if (d.passed) { state.passed = new Set(d.passed); writeShared(PASSED_KEY, d.passed); }
        if (d.maps)   { state.maps = d.maps; LS.set('maps', d.maps); }
        if (d.settings) { state.settings = Object.assign(S, d.settings); applySettings(); }
        if (d.libIndex) LS.set('libIndex', d.libIndex);
        renderViewport(); renderSidebar(); toast('Datos importados');
      } catch { toast('El archivo no es válido'); }
    };
    inp.click();
  };
}

/* ---------- 8. Paleta de comandos (Ctrl+P) ----------------- */

const pal = { items: [], sel: 0 };

function openPalette() {
  pal.items = SUBJECTS.map(s => ({
    label: s.code + ' · ' + s.name, sub: s.dir, icon: I.files, run: () => openSubject(s.code)
  })).concat(
    LS.get('libIndex', []).map(b => ({
      label: b.name, sub: b.path, icon: fileIcon(b.name), run: () => openFile(b.path)
    })),
    Object.entries(state.maps).flatMap(([code, files]) => files.map(f => ({
      label: baseName(f), sub: f, icon: I.map, run: () => openFile(f)
    }))),
    [
      { label:'Red de correlativas', sub:'vista', icon:I.network, run:() => openTab({ id:'correl', title:'Red de correlativas', kind:'correl' }) },
      { label:'Mapa inter-asignaturas', sub:'vista', icon:I.map, run:() => openTab({ id:'maps-inter', title:'Mapa inter-asignaturas', kind:'maps-inter' }) },
      { label:'Índice de mapas', sub:'vista', icon:I.map, run:() => openTab({ id:'maps-index', title:'Índice de mapas', kind:'maps-index' }) },
      { label:'Librería', sub:'vista', icon:I.book, run:() => openTab({ id:'library', title:'Librería', kind:'library' }) },
      { label:'Configuración', sub:'vista', icon:I.gear, run:() => openTab({ id:'config', title:'Configuración', kind:'config' }) }
    ]
  );
  $('#overlay').classList.add('show');
  const inp = $('#pal-input');
  inp.value = ''; inp.focus();
  paintPalette('');
}

function paintPalette(q) {
  q = q.toLowerCase().trim();
  const list = pal.items
    .filter(x => !q || (x.label + ' ' + x.sub).toLowerCase().includes(q))
    .slice(0, 60);
  pal.filtered = list;
  pal.sel = 0;
  const box = $('#pal-list');
  box.innerHTML = '';
  if (!list.length) { box.innerHTML = '<div class="empty">Nada coincide.</div>'; return; }
  list.forEach((x, i) => {
    const n = el('div', 'p-item' + (i === 0 ? ' sel' : ''),
      `<span style="display:flex">${x.icon}</span><span>${esc(x.label)}</span>
       <span class="p-sub">${esc(x.sub)}</span>`);
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
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') { e.preventDefault(); $('#sidebar').classList.toggle('collapsed'); }
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'w') { e.preventDefault(); if (state.active) closeTab(state.active); }
  if ((e.ctrlKey || e.metaKey) && /^[1-5]$/.test(e.key)) { e.preventDefault(); setView(VIEWS[+e.key - 1].id); }
});
$('#pal-input').addEventListener('input', e => paintPalette(e.target.value));
$('#overlay').addEventListener('click', e => { if (e.target.id === 'overlay') closePalette(); });

/* ---------- 10. Arranque ----------------------------------- */

(async function init() {
  applySettings();
  await probeServer();
  renderRail();
  renderSidebar();
  renderTabs();
  renderViewport();
})();
