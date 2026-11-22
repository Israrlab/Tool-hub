/* IsrarLab Multi HTML Viewer - App JS */
/* IMPORTANT: Is file ko HTML file ke SAATH same folder me rakho */
/* Example: /website/israrlab_multi_html_viewer.html  +  /website/israrlab-app.js */


/* ===== SCRIPT 1 ===== */
//<![CDATA[
  (function() {
    var url = window.location.href;
    if (url.indexOf("?m=1") !== -1 || url.indexOf("&m=1") !== -1) {
      var cleanUrl = url.replace("?m=1", "").replace("&m=1", "").replace("?m=0", "").replace("&m=0", "");
      if (cleanUrl.endsWith("?")) { cleanUrl = cleanUrl.slice(0, -1); }
      window.history.replaceState(null, null, cleanUrl);
    }
  })();
  //]]>


/* ===== SCRIPT 2 ===== */
/* ========== PERSISTENT STORAGE (IndexedDB + localStorage) ========== */
const ISRAR_DB_NAME = 'IsrarLabMultiHtmlViewerDB';
const ISRAR_DB_STORE = 'appdata';
const ISRAR_DB_KEY = 'main';
let notes = [];
let lockedNotes = [];
let trashNotes = [];
let historyLogs = [];
let categories = ['General', 'UI Buttons', 'Scripts'];
let __israrDb = null;
let __israrDataReady = false;

function __israrOpenDb() {
  return new Promise(function(resolve, reject) {
    if (__israrDb) { resolve(__israrDb); return; }
    if (!window.indexedDB) { reject(new Error('no idb')); return; }
    var req = indexedDB.open(ISRAR_DB_NAME, 1);
    req.onupgradeneeded = function(e) {
      var db = e.target.result;
      if (!db.objectStoreNames.contains(ISRAR_DB_STORE)) {
        db.createObjectStore(ISRAR_DB_STORE);
      }
    };
    req.onsuccess = function(e) { __israrDb = e.target.result; resolve(__israrDb); };
    req.onerror = function(e) { reject(e.target.error || new Error('idb open fail')); };
  });
}

function __israrIdbGet() {
  return __israrOpenDb().then(function(db) {
    return new Promise(function(resolve, reject) {
      try {
        var tx = db.transaction(ISRAR_DB_STORE, 'readonly');
        var store = tx.objectStore(ISRAR_DB_STORE);
        var g = store.get(ISRAR_DB_KEY);
        g.onsuccess = function() { resolve(g.result || null); };
        g.onerror = function() { reject(g.error); };
      } catch (err) { reject(err); }
    });
  });
}

function __israrIdbSet(payload) {
  return __israrOpenDb().then(function(db) {
    return new Promise(function(resolve, reject) {
      try {
        var tx = db.transaction(ISRAR_DB_STORE, 'readwrite');
        var store = tx.objectStore(ISRAR_DB_STORE);
        var p = store.put(payload, ISRAR_DB_KEY);
        p.onsuccess = function() { resolve(true); };
        p.onerror = function() { reject(p.error); };
      } catch (err) { reject(err); }
    });
  });
}

function __israrLoadFromLocalStorageFallback() {
  try {
    var n = JSON.parse(localStorage.getItem('israr_html_notes') || '[]');
    if (Array.isArray(n)) notes = n;
  } catch (e) { notes = []; }
  try {
    var l = JSON.parse(localStorage.getItem('israr_html_locked') || '[]');
    if (Array.isArray(l)) lockedNotes = l;
  } catch (e) { lockedNotes = []; }
  try {
    var t = JSON.parse(localStorage.getItem('israr_html_trash') || '[]');
    if (Array.isArray(t)) trashNotes = t;
  } catch (e) { trashNotes = []; }
  try {
    var h = JSON.parse(localStorage.getItem('israr_html_history') || '[]');
    if (Array.isArray(h)) historyLogs = h;
  } catch (e) { historyLogs = []; }
  try {
    var c = JSON.parse(localStorage.getItem('israr_html_cats') || 'null');
    if (Array.isArray(c) && c.length) categories = c;
  } catch (e) {}
  /* strip heavy history code */
  historyLogs = (historyLogs || []).map(function(x) {
    return Object.assign({}, x, { htmlCode: '' });
  });
}

function __israrApplyLoadedPayload(data) {
  if (!data || typeof data !== 'object') return false;
  if (Array.isArray(data.notes)) notes = data.notes;
  if (Array.isArray(data.lockedNotes)) lockedNotes = data.lockedNotes;
  if (Array.isArray(data.trashNotes)) trashNotes = data.trashNotes;
  if (Array.isArray(data.historyLogs)) {
    historyLogs = data.historyLogs.map(function(x) {
      return Object.assign({}, x, { htmlCode: '' });
    });
  }
  if (Array.isArray(data.categories) && data.categories.length) categories = data.categories;
  return true;
}

function __israrBootLoad() {
  __israrLoadFromLocalStorageFallback();
  return __israrIdbGet().then(function(data) {
    if (data && Array.isArray(data.notes) && data.notes.length >= notes.length) {
      __israrApplyLoadedPayload(data);
    } else if (data && Array.isArray(data.notes) && data.notes.length > 0 && notes.length === 0) {
      __israrApplyLoadedPayload(data);
    } else if ((!data || !data.notes || !data.notes.length) && notes.length) {
      /* migrate LS -> IDB */
      return __israrPersistAll();
    }
    return true;
  }).catch(function() {
    return true;
  }).then(function() {
    __israrDataReady = true;
    try { ensureNoteIds(notes); ensureNoteIds(lockedNotes); ensureNoteIds(trashNotes); } catch (e) {}
    try { if (typeof renderNotes === 'function') renderNotes(); } catch (e) {}
    try { if (typeof renderExternalHistoryLogs === 'function') renderExternalHistoryLogs(); } catch (e) {}
    try { if (typeof renderCategories === 'function') renderCategories(); } catch (e) {}
    return true;
  });
}

function __israrPersistAll() {
  var payload = {
    notes: notes || [],
    lockedNotes: lockedNotes || [],
    trashNotes: trashNotes || [],
    historyLogs: (historyLogs || []).map(function(h) {
      return {
        noteId: h.noteId || null,
        noteIndex: (typeof h.noteIndex === 'number') ? h.noteIndex : -1,
        title: h.title || '',
        htmlCode: '',
        createdTime: h.createdTime || '',
        updatedTime: h.updatedTime || '',
        updateCount: h.updateCount || 1,
        viewsCount: h.viewsCount || 0
      };
    }),
    categories: categories || [],
    savedAt: Date.now()
  };
  historyLogs = payload.historyLogs;

  /* Always try IndexedDB first (large capacity) */
  var idbPromise = __israrIdbSet(payload).catch(function(err) {
    console.error('IDB save failed', err);
    return false;
  });

  /* Also mirror to localStorage when size allows (fast sync) */
  try {
    var notesJson = JSON.stringify(payload.notes);
    if (notesJson.length < 4000000) {
      localStorage.setItem('israr_html_notes', notesJson);
    }
  } catch (e) {
    try { localStorage.removeItem('israr_html_notes'); } catch (e2) {}
  }
  try { localStorage.setItem('israr_html_history', JSON.stringify(payload.historyLogs)); } catch (e) {}
  try { localStorage.setItem('israr_html_cats', JSON.stringify(payload.categories)); } catch (e) {}
  try {
    var trashJson = JSON.stringify(payload.trashNotes);
    if (trashJson.length < 1500000) localStorage.setItem('israr_html_trash', trashJson);
  } catch (e) { try { localStorage.removeItem('israr_html_trash'); } catch (e2) {} }
  try {
    var lockJson = JSON.stringify(payload.lockedNotes);
    if (lockJson.length < 1500000) localStorage.setItem('israr_html_locked', lockJson);
  } catch (e) { try { localStorage.removeItem('israr_html_locked'); } catch (e2) {} }

  try { localStorage.setItem('israr_html_theme', String(typeof currentThemeIndex !== 'undefined' ? currentThemeIndex : 0)); } catch (e) {}
  try { localStorage.setItem('israr_html_darkmode', String(!!(typeof isDarkThemeOn !== 'undefined' && isDarkThemeOn))); } catch (e) {}
  try { localStorage.setItem('israr_html_listview', String(!!(typeof isListView !== 'undefined' && isListView))); } catch (e) {}
  try { localStorage.setItem('israr_html_sortmode', (typeof currentSortMode !== 'undefined' && currentSortMode) ? currentSortMode : 'newest'); } catch (e) {}
  try { localStorage.setItem('israr_html_pattern', (typeof userSecretPattern !== 'undefined' && userSecretPattern) ? userSecretPattern : '1235789'); } catch (e) {}

  return idbPromise;
}

/* Kick off async load immediately */
__israrBootLoad();

let currentCategoryFilter = 'All';
let editingIndex = null;
window.editingNoteId = null;
window.isCreatingNewNote = false;
let autoSaveTimer = null;
let currentThemeIndex = localStorage.getItem('israr_html_theme') !== null ? (parseInt(localStorage.getItem('israr_html_theme')) || 0) : 0;
let isDarkThemeOn = localStorage.getItem('israr_html_darkmode') === 'true';
let userSecretPattern = localStorage.getItem('israr_html_pattern') || '1235789';
let isListView = localStorage.getItem('israr_html_listview') === 'true';
let currentSortMode = localStorage.getItem('israr_html_sortmode') || 'newest';

function saveData() {
  try {
    try { if (typeof invalidateRecoveryCache === 'function') invalidateRecoveryCache(); } catch (e) {}
    if (!Array.isArray(notes)) notes = [];
    if (!Array.isArray(historyLogs)) historyLogs = [];
    if (!Array.isArray(trashNotes)) trashNotes = [];
    if (!Array.isArray(lockedNotes)) lockedNotes = [];
    if (notes.length > 100) notes = notes.slice(0, 100);
    if (historyLogs.length > 80) historyLogs = historyLogs.slice(0, 80);
    if (trashNotes.length > 40) trashNotes = trashNotes.slice(0, 40);
    __israrPersistAll();
  } catch (err) {
    console.error('saveData error', err);
  }
}

function generateUniqueId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 8);
}
function ensureNoteIds(list) {
  if (!Array.isArray(list)) return;
  list.forEach(function(n) { if (n && !n.id) n.id = generateUniqueId(); });
}
function cleanExpiredTrashNotes() {
  var oneMonthMs = 30 * 24 * 60 * 60 * 1000;
  var now = Date.now();
  var initialLength = trashNotes.length;
  trashNotes = trashNotes.filter(function(n) {
    if (!n.deletedAt) return true;
    return (now - n.deletedAt) < oneMonthMs;
  });
  if (trashNotes.length !== initialLength) saveData();
}
cleanExpiredTrashNotes();
ensureNoteIds(notes); ensureNoteIds(lockedNotes); ensureNoteIds(trashNotes);

let isMarkDeleteMode = false;
let isTrashMarkDeleteMode = false;
let isTrashMarkRestoreMode = false;
let isCatMarkDeleteMode = false;
let selectedNoteIndexForContext = null;
let currentCaptchaString = '';
let currentMathAnswer = 0;
let authTargetType = '';
let codeSearchMatches = [];
let currentSearchMatchIndex = -1;
let clockInterval = null;

const vipThemes = [
  /* === Quran Tarjuma PRO solid themes (extracted) — full palette === */
  { bg:'#001519', home:'#001f24', panelBg:'#00383b', card:'#00484b', btn:'#00616a', accent:'#3882F6', sub:'#9af5df', border:'rgba(56,130,246,0.45)', grad:'linear-gradient(115deg,#1d4ed8 0%,#3882F6 55%,#60a5fa 100%)', panel:'rgba(56,130,246,.25)' },
  { bg:'#0f172a', home:'#1e293b', panelBg:'#1e293b', card:'#334155', btn:'#475569', accent:'#22d3ee', sub:'#a5f3fc', border:'rgba(34,211,238,0.4)', grad:'linear-gradient(115deg,#0891b2 0%,#22d3ee 50%,#67e8f9 100%)', panel:'rgba(34,211,238,.25)' },
  { bg:'#1a0a2e', home:'#2d1b4e', panelBg:'#2d1b4e', card:'#3d2a5c', btn:'#5a3d7a', accent:'#c084fc', sub:'#e9d5ff', border:'rgba(192,132,252,0.4)', grad:'linear-gradient(115deg,#7c3aed 0%,#c084fc 50%,#e9d5ff 100%)', panel:'rgba(192,132,252,.25)' },
  { bg:'#0c1a0c', home:'#1a2e1a', panelBg:'#1a2e1a', card:'#243d24', btn:'#2f4f2f', accent:'#4ade80', sub:'#bbf7d0', border:'rgba(74,222,128,0.4)', grad:'linear-gradient(115deg,#16a34a 0%,#4ade80 50%,#86efac 100%)', panel:'rgba(74,222,128,.25)' },
  { bg:'#1c0a0a', home:'#2e1515', panelBg:'#2e1515', card:'#3d1f1f', btn:'#5c2a2a', accent:'#f87171', sub:'#fecaca', border:'rgba(248,113,113,0.4)', grad:'linear-gradient(115deg,#dc2626 0%,#f87171 50%,#fca5a5 100%)', panel:'rgba(248,113,113,.25)' },
  { bg:'#0a1628', home:'#152a45', panelBg:'#152a45', card:'#1e3a5f', btn:'#2a4a6f', accent:'#60a5fa', sub:'#bfdbfe', border:'rgba(96,165,250,0.4)', grad:'linear-gradient(115deg,#2563eb 0%,#60a5fa 50%,#93c5fd 100%)', panel:'rgba(96,165,250,.25)' },
  { bg:'#1a1508', home:'#2e2815', panelBg:'#2e2815', card:'#3d3520', btn:'#5c4f2a', accent:'#fbbf24', sub:'#fde68a', border:'rgba(251,191,36,0.4)', grad:'linear-gradient(115deg,#d97706 0%,#fbbf24 50%,#fcd34d 100%)', panel:'rgba(251,191,36,.25)' },
  { bg:'#0d1a1a', home:'#1a2e2e', panelBg:'#1a2e2e', card:'#243d3d', btn:'#2f4f4f', accent:'#2dd4bf', sub:'#99f6e4', border:'rgba(45,212,191,0.4)', grad:'linear-gradient(115deg,#0d9488 0%,#2dd4bf 50%,#5eead4 100%)', panel:'rgba(45,212,191,.25)' },
  /* extra premium variants */
  { bg:'#0a0618', home:'#120a24', panelBg:'#1a1030', card:'#251840', btn:'#3d2a5c', accent:'#8c6cff', sub:'#4ce3a8', border:'rgba(140,108,255,0.4)', grad:'linear-gradient(115deg,#6d28d9 0%,#8c6cff 50%,#c4b5fd 100%)', panel:'rgba(140,108,255,.25)' },
  { bg:'#041018', home:'#061820', panelBg:'#0a2030', card:'#0e2a3a', btn:'#163a4a', accent:'#38bdf8', sub:'#e879f9', border:'rgba(56,189,248,0.4)', grad:'linear-gradient(115deg,#0284c7 0%,#38bdf8 50%,#7dd3fc 100%)', panel:'rgba(56,189,248,.25)' },
  { bg:'#120e04', home:'#1a1608', panelBg:'#221c0c', card:'#2e2610', btn:'#3d3418', accent:'#ffcc4d', sub:'#ff6b35', border:'rgba(255,204,77,0.4)', grad:'linear-gradient(115deg,#b45309 0%,#ffcc4d 50%,#fde68a 100%)', panel:'rgba(255,204,77,.25)' },
  { bg:'#100618', home:'#180a24', panelBg:'#200e30', card:'#2a1440', btn:'#3a1c55', accent:'#e879f9', sub:'#8b5cf6', border:'rgba(232,121,249,0.4)', grad:'linear-gradient(115deg,#a21caf 0%,#e879f9 50%,#f0abfc 100%)', panel:'rgba(232,121,249,.25)' }
];

document.addEventListener('DOMContentLoaded', function(){ if (typeof renderCategories === 'function') renderCategories(); });
window.addEventListener('load', function(){ if (typeof renderCategories === 'function') renderCategories(); });

function clearThemeInlineStyles() {
  document.body.style.background = '';
  document.body.style.backgroundImage = '';
  const panelEl = document.querySelector('.panel');
  if (panelEl) { panelEl.style.borderColor = ''; panelEl.style.background = ''; }
  const homeEl = document.getElementById('homeView');
  if (homeEl) { homeEl.style.background = ''; }
  const headerEl = document.querySelector('.app-header');
  if (headerEl) headerEl.style.background = '';
  const actionBar = document.querySelector('.top-action-bar');
  if (actionBar) actionBar.style.background = '';
  const catBar = document.querySelector('.category-bar-wrapper');
  if (catBar) catBar.style.background = '';
  /* reset CSS vars so light-mode / default :root can take over */
  const root = document.documentElement.style;
  ['--bg','--panel-bg','--home-bg','--header-bg','--action-bar-bg','--card-bg','--card-footer-bg','--btn-bg','--cyan','--accent','--purple','--art-heading','--art-subheading','--theme-accent','--border','--grad','--glow'].forEach(function(k){ root.removeProperty(k); });
}

function applyThemeByIndex(idx) {
  if (isDarkThemeOn) return; /* light mode active -> no custom theme */
  const t = vipThemes[idx % vipThemes.length];
  if (!t) return;
  const root = document.documentElement.style;
  /* Full palette from Quran Tarjuma PRO style themes */
  if (t.bg) {
    document.body.style.background = t.bg;
    root.setProperty('--bg', t.bg);
  }
  if (t.home) {
    root.setProperty('--home-bg', t.home);
    const homeEl = document.getElementById('homeView');
    if (homeEl) homeEl.style.background = t.home;
  }
  if (t.panelBg) {
    root.setProperty('--panel-bg', t.panelBg);
    root.setProperty('--header-bg', t.panelBg);
    root.setProperty('--card-footer-bg', t.panelBg);
    root.setProperty('--action-bar-bg', t.panelBg);
  }
  if (t.card) root.setProperty('--card-bg', t.card);
  if (t.btn) root.setProperty('--btn-bg', t.btn);
  if (t.accent) {
    root.setProperty('--cyan', t.accent);
    root.setProperty('--accent', t.accent);
    root.setProperty('--art-heading', t.accent);
    root.setProperty('--theme-accent', t.accent);
    root.setProperty('--purple', t.accent);
  }
  if (t.sub) root.setProperty('--art-subheading', t.sub);
  if (t.border) root.setProperty('--border', t.border);
  if (t.grad) root.setProperty('--grad', t.grad);
  if (t.accent) root.setProperty('--glow', t.accent + '4D');
  const panelEl = document.querySelector('.panel');
  if (panelEl) {
    if (t.panel) panelEl.style.borderColor = t.panel;
    if (t.panelBg) panelEl.style.background = t.panelBg;
  }
}

function applyDarkModeState() {
  const body = document.getElementById('appBody') || document.body;
  const btn = document.getElementById('darkModeToggleBtn');
  if (isDarkThemeOn) {
    /* Light Mode ON */
    body.classList.add('light-mode');
    clearThemeInlineStyles();
    document.body.style.background = '#ffffff';
    document.documentElement.style.setProperty('--bg', '#ffffff');
    document.documentElement.style.setProperty('--cyan', '#0284c7');
    document.documentElement.style.setProperty('--art-heading', '#0284c7');
    document.documentElement.style.setProperty('--art-subheading', '#7c3aed');
    document.documentElement.style.setProperty('--theme-accent', '#0284c7');
    if (btn) btn.innerHTML = '<i class="fas fa-sun"></i> <span class="btn-text">Light</span>';
  } else {
    /* Dark Mode ON (custom themes allowed) */
    body.classList.remove('light-mode');
    clearThemeInlineStyles();
    document.documentElement.style.setProperty('--bg', '#03050b');
    if (btn) btn.innerHTML = '<i class="fas fa-moon"></i> <span class="btn-text">Dark</span>';
    applyThemeByIndex(currentThemeIndex);
  }
}
applyDarkModeState();

function toggleDarkMode() {
  isDarkThemeOn = !isDarkThemeOn;
  try { localStorage.setItem('israr_html_darkmode', isDarkThemeOn); } catch(e) {}
  try { saveData(); } catch(e) {}
  applyDarkModeState();
  try { if (typeof renderNotes === 'function') renderNotes(); } catch(e) {}
}

function startLiveClock() {
  if (clockInterval) clearInterval(clockInterval);
  const updateClock = () => {
    const now = new Date();
    const clockEl = document.getElementById('liveDateTime');
    if (clockEl) clockEl.innerText = now.toLocaleDateString() + ' ' + now.toLocaleTimeString();
  };
  updateClock();
  clockInterval = setInterval(updateClock, 1000);
}


function pushSubviewState(name) {
  try {
    /* Only ONE history entry for any subview — prevents multi-Back jerk */
    if (!window.__israrInSubview) {
      history.pushState({ view: name || 'sub', israr: 1 }, '');
      window.__israrInSubview = true;
    } else {
      history.replaceState({ view: name || 'sub', israr: 1 }, '');
    }
  } catch (e) {}
}

function setHomeChromeVisible(show) {
  var strip = document.querySelector('.israrlab-title-strip');
  if (strip) {
    strip.style.display = show ? 'flex' : 'none';
    strip.style.visibility = show ? 'visible' : 'hidden';
  }
  try {
    if (show) document.body.classList.remove('subview-active');
    else document.body.classList.add('subview-active');
  } catch (e) {}
  /* Close side drawer when leaving home */
  if (!show) {
    try {
      var drawer = document.getElementById('bst-drawer');
      var overlay = document.getElementById('bst-overlay');
      if (drawer) drawer.classList.remove('open');
      if (overlay) overlay.classList.remove('active');
    } catch (e) {}
  }
}

function showHomeDirectly() {
  /* Anti-jank: if already fully on home, skip heavy work */
  var alreadyHome = false;
  try {
    var hv = document.getElementById('homeView');
    var ed = document.getElementById('editorView');
    var pv = document.getElementById('fullHtmlView');
    var iv = document.getElementById('infoView');
    alreadyHome = hv && hv.style.display === 'flex'
      && (!ed || ed.style.display === 'none')
      && (!pv || pv.style.display === 'none')
      && (!iv || iv.style.display === 'none')
      && !window.__israrInSubview;
  } catch (e) {}

  var wasSubview = !!window.__israrInSubview;
  window.__israrInSubview = false;

  /* Collapse history so next browser-Back leaves the site (no multi-Back jerk) */
  try {
    if (wasSubview) {
      history.replaceState({ view: 'home', israr: 0 }, '');
    }
  } catch (e) {}

  if (alreadyHome) return;

  setHomeChromeVisible(true);
  try {
    var y = window.__israrReturnScrollY || 0;
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
    document.body.style.top = '';
  } catch (e) {}
  if (clockInterval) clearInterval(clockInterval);

  var hideIds = ['editorView','recoveryView','backupView','categorySettingsPageView','secureLockView','fullHtmlView','infoView','settingsModal','sortMenuModal','modeChangeModal','allDeleteAuthModal'];
  for (var i = 0; i < hideIds.length; i++) {
    try {
      var el = document.getElementById(hideIds[i]);
      if (el && el.style.display !== 'none') el.style.display = 'none';
    } catch (e) {}
  }
  try {
    var home = document.getElementById('homeView');
    if (home) home.style.display = 'flex';
  } catch (e) {}

  try {
    var histSection = document.querySelector('.external-history-section');
    if (histSection) histSection.style.display = 'block';
    var artSection = document.querySelector('.article-section');
    if (artSection) artSection.style.display = 'block';
    var relatedSec = document.getElementById('israr-lab-related-section');
    if (relatedSec) relatedSec.style.display = 'block';
    var hero = document.querySelector('.hero');
    if (hero) hero.style.display = 'block';
    var footer = document.querySelector('.main-footer');
    if (footer) footer.style.display = 'block';
  } catch (e) {}

  var returnY = Number(window.__israrReturnScrollY || 0);
  requestAnimationFrame(function () {
    try { window.scrollTo(0, returnY); } catch (e) {}
  });

  /* Only rebuild cards if needed — avoids jank on every Back */
  setTimeout(function () {
    try {
      var c = document.getElementById('notesContainer');
      var need = !c || !c.querySelector('.note-card') || window.__israrForceNotesRender;
      window.__israrForceNotesRender = false;
      if (need && typeof renderNotes === 'function') renderNotes();
    } catch (e) {}
  }, 20);
}

function navigateBack() {
  try { if (typeof autoSaveTimer !== 'undefined' && autoSaveTimer) clearTimeout(autoSaveTimer); } catch (e) {}
  autoSaveTimer = null;
  /* Back never auto-creates/saves a card */
  window.isCreatingNewNote = false;
  window.editingNoteId = null;
  editingIndex = null;
  /* Mark editor dirty-clean; actual CM clear after home is painted (no race with Edit) */
  window.__israrEditorLoadCode = '';
  window.__israrEditorIsNew = true;
  try {
    var ta = document.getElementById('htmlCodeInput');
    if (ta) ta.value = '';
  } catch (e) {}
  showHomeDirectly();
  setTimeout(function(){
    try {
      if (typeof getCodeMirror === 'function') {
        var cm = getCodeMirror();
        if (cm && document.getElementById('editorView') &&
            document.getElementById('editorView').style.display === 'none') {
          cm.setValue('');
          cm.clearHistory();
        }
      }
    } catch (e) {}
  }, 300);
}
function navigateBackToHome() {
  /* Same as Back: discard unsaved editor work. Only Save button persists. */
  navigateBack();
}

function openEditor(index) {
  setHomeChromeVisible(false);
  /* Cancel any pending autosave from previous card so it cannot overwrite the new one */
  try { if (typeof autoSaveTimer !== 'undefined' && autoSaveTimer) clearTimeout(autoSaveTimer); } catch (e) {}
  autoSaveTimer = null;

  if (document.getElementById('homeView') && document.getElementById('homeView').style.display !== 'none') {
    window.__israrReturnScrollY = window.scrollY || document.documentElement.scrollTop || 0;
  }
  try { pushSubviewState('editor'); } catch (e) {}
  document.getElementById('homeView').style.display = 'none';
  document.getElementById('editorView').style.display = 'flex';
  /* Lock page scroll + hide background sections so website doesn't scroll under editor */
  try {
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.top = '-' + (window.__israrReturnScrollY || 0) + 'px';
  } catch (e) {}
  try {
    var histSection = document.querySelector('.external-history-section'); if (histSection) histSection.style.display = 'none';
    var artSection = document.querySelector('.article-section'); if (artSection) artSection.style.display = 'none';
    var relatedSec = document.getElementById('israr-lab-related-section'); if (relatedSec) relatedSec.style.display = 'none';
    var hero = document.querySelector('.hero'); if (hero) hero.style.display = 'none';
    var footer = document.querySelector('.main-footer'); if (footer) footer.style.display = 'none';
  } catch (e) {}
  startLiveClock();

  document.getElementById('codeSearchInput').value = '';
  document.getElementById('codeSearchCount').innerText = '0/0';
  codeSearchMatches = [];
  currentSearchMatchIndex = -1;

  const saveUpdateBtn = document.getElementById('editorSaveUpdateBtn');
  var isEdit = (typeof index === 'number' && index >= 0 && notes[index]);

  if (isEdit) {
    editingIndex = index;
    window.editingNoteId = notes[index].id || null;
    window.isCreatingNewNote = false;
    const note = notes[index];
    document.getElementById('noteTitle').value = note.title || '';
    document.getElementById('htmlCodeInput').value = note.htmlCode || '';
    try { __lastLineCount = -1; } catch(e) {}
    try { if (typeof scheduleLineNumbers==='function') scheduleLineNumbers(); } catch(e) {}
    if (saveUpdateBtn) saveUpdateBtn.innerText = 'Update';
  } else {
    /* FORCE brand-new card every time New Card is pressed */
    editingIndex = null;
    window.editingNoteId = null;
    window.isCreatingNewNote = true;
    try { localStorage.removeItem('israr_html_editor_draft'); } catch (e) {}
    document.getElementById('noteTitle').value = 'Title ' + (notes.length + 1);
    document.getElementById('htmlCodeInput').value = '';
    try { __lastLineCount = -1; } catch(e) {}
    try { if (typeof scheduleLineNumbers==='function') scheduleLineNumbers(); } catch(e) {}
    if (saveUpdateBtn) saveUpdateBtn.innerText = 'Save';
  }
  /* Load editor content: Edit = note code, New = empty. Always from source of truth. */
  try {
    var loadCode = '';
    if (isEdit && notes[editingIndex]) {
      loadCode = notes[editingIndex].htmlCode || '';
    } else {
      loadCode = '';
    }
    var taNow = document.getElementById('htmlCodeInput');
    if (taNow) taNow.value = loadCode;
    if (typeof initIsrarCodeMirror === 'function') initIsrarCodeMirror();
    if (typeof setEditorCode === 'function') {
      setEditorCode(loadCode, false);
    } else if (typeof getCodeMirror === 'function') {
      var cm0 = getCodeMirror();
      if (cm0) {
        cm0.setValue(loadCode);
        try { cm0.clearHistory(); } catch (e) {}
        try { cm0.scrollTo(0, 0); } catch (e) {}
      }
    }
    window.__israrEditorLoadCode = loadCode;
    window.__israrEditorIsNew = !isEdit;
  } catch (e) { console.error(e); }
  try { updateStats(); } catch (e) {}
  try {
    if (typeof refreshEditorLayout === 'function') {
      setTimeout(refreshEditorLayout, 40);
      setTimeout(refreshEditorLayout, 200);
    }
  } catch (e) {}
}
function updateStats() {
  const el = document.getElementById('htmlCodeInput');
  const info = document.getElementById('statsInfo');
  if (!el || !info) return;
  const text = el.value || '';
  const chars = text.length;
  /* Avoid expensive full split on huge pastes */
  var words = 0;
  if (chars === 0) words = 0;
  else if (chars > 200000) {
    words = Math.round(chars / 6); /* approximate for speed */
  } else {
    var t = text.trim();
    if (!t) words = 0;
    else {
      words = 1;
      for (var i = 0; i < t.length; i++) {
        var c = t.charCodeAt(i);
        if (c === 32 || c === 10 || c === 9 || c === 13) {
          /* count transitions roughly */
          while (i + 1 < t.length) {
            var n = t.charCodeAt(i + 1);
            if (n === 32 || n === 10 || n === 9 || n === 13) i++;
            else break;
          }
          if (i + 1 < t.length) words++;
        }
      }
    }
  }
  info.innerText = 'Chars: ' + chars + ' | Words: ' + words;
}

function updateLineNumbers() {
  const textarea = document.getElementById('htmlCodeInput');
  const lineNumbers = document.getElementById('lineNumbers');
  const lines = textarea.value.split('\n').length;
  let numbersString = '';
  for (let i = 1; i <= lines; i++) { numbersString += i + '<br>'; }
  lineNumbers.innerHTML = numbersString;
}

function clearCodeSearchMarks() {
  try {
    var cm = (typeof getCodeMirror === 'function') ? getCodeMirror() : null;
    if (cm && cm.__searchMarks) {
      cm.__searchMarks.forEach(function(mk){ try { mk.clear(); } catch(e){} });
      cm.__searchMarks = [];
    }
  } catch (e) {}
}

function handleCodeSearchInput() {
  var queryEl = document.getElementById('codeSearchInput');
  var countEl = document.getElementById('codeSearchCount');
  var query = queryEl ? queryEl.value.trim() : '';
  codeSearchMatches = [];
  currentSearchMatchIndex = -1;
  clearCodeSearchMarks();

  var cm = (typeof getCodeMirror === 'function') ? getCodeMirror() : null;
  var text = '';
  try {
    if (cm) text = cm.getValue();
    else {
      var ta = document.getElementById('htmlCodeInput');
      text = ta ? (ta.value || '') : '';
    }
  } catch (e) { text = ''; }

  if (!query) {
    if (countEl) countEl.innerText = '0/0';
    return;
  }

  /* Collect all match positions */
  try {
    var escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    var regex = new RegExp(escaped, 'gi');
    var match;
    while ((match = regex.exec(text)) !== null) {
      codeSearchMatches.push({ from: match.index, to: match.index + match[0].length, len: match[0].length });
      if (match[0].length === 0) regex.lastIndex++;
      if (codeSearchMatches.length > 5000) break; /* safety */
    }
  } catch (e) {}

  if (codeSearchMatches.length > 0) currentSearchMatchIndex = 0;
  if (countEl) countEl.innerText = (codeSearchMatches.length > 0 ? (currentSearchMatchIndex + 1) : 0) + '/' + codeSearchMatches.length;

  if (cm && codeSearchMatches.length) {
    applyCodeSearchMarks(cm);
    jumpToCodeSearchMatch(cm, currentSearchMatchIndex);
  } else if (!cm && codeSearchMatches.length) {
    /* textarea fallback */
    var ta2 = document.getElementById('htmlCodeInput');
    if (ta2) {
      var m0 = codeSearchMatches[0];
      try { ta2.focus(); ta2.setSelectionRange(m0.from, m0.to); } catch(e) {}
    }
  }
}

function applyCodeSearchMarks(cm) {
  if (!cm) return;
  clearCodeSearchMarks();
  cm.__searchMarks = [];
  if (!codeSearchMatches || !codeSearchMatches.length) return;
  for (var i = 0; i < codeSearchMatches.length; i++) {
    try {
      var m = codeSearchMatches[i];
      var from = cm.posFromIndex(m.from);
      var to = cm.posFromIndex(m.to);
      var isCurrent = (i === currentSearchMatchIndex);
      var mk = cm.markText(from, to, {
        className: isCurrent ? 'cm-search-current' : 'cm-search-match',
        clearOnEnter: false
      });
      cm.__searchMarks.push(mk);
    } catch (e) {}
  }
}

function jumpToCodeSearchMatch(cm, idx) {
  if (!codeSearchMatches || !codeSearchMatches.length) return;
  if (idx < 0) idx = codeSearchMatches.length - 1;
  if (idx >= codeSearchMatches.length) idx = 0;
  currentSearchMatchIndex = idx;
  var m = codeSearchMatches[idx];
  if (!m) return;

  var countEl = document.getElementById('codeSearchCount');
  if (countEl) countEl.innerText = (currentSearchMatchIndex + 1) + '/' + codeSearchMatches.length;

  if (!cm) {
    var ta = document.getElementById('htmlCodeInput');
    if (ta) {
      try { ta.focus(); ta.setSelectionRange(m.from, m.to); } catch (e) {}
    }
    return;
  }

  try {
    var from = cm.posFromIndex(m.from);
    var to = cm.posFromIndex(m.to);
    /* recolor ALL marks: yellow matches, green current */
    applyCodeSearchMarks(cm);
    cm.setSelection(from, to);
    cm.focus();
    /* scroll match to top of editor */
    try {
      var coords = cm.charCoords(from, 'local');
      var targetTop = Math.max(0, coords.top - 32);
      cm.scrollTo(cm.getScrollInfo().left, targetTop);
      setTimeout(function () {
        try {
          var c2 = cm.charCoords(from, 'local');
          cm.scrollTo(cm.getScrollInfo().left, Math.max(0, c2.top - 32));
        } catch (e3) {}
      }, 40);
    } catch (e2) {
      try { cm.scrollIntoView({ from: from, to: to }, 100); } catch (e4) {}
    }
  } catch (e) {
    console.warn('jumpToCodeSearchMatch', e);
  }
}

function navigateCodeSearchMatch(direction) {
  if (!codeSearchMatches || !codeSearchMatches.length) return;
  var dir = direction < 0 ? -1 : 1;
  var next = (typeof currentSearchMatchIndex === 'number' ? currentSearchMatchIndex : -1) + dir;
  if (next >= codeSearchMatches.length) next = 0;
  if (next < 0) next = codeSearchMatches.length - 1;
  currentSearchMatchIndex = next;
  var cm = null;
  try { cm = (typeof getCodeMirror === 'function') ? getCodeMirror() : null; } catch (e) {}
  jumpToCodeSearchMatch(cm, currentSearchMatchIndex);
}


function scheduleLineNumbers() {
  try {
    if (typeof getCodeMirror === 'function' && getCodeMirror()) return; /* CM gutters only */
  } catch (e) {}
  if (__lineNumTimer) clearTimeout(__lineNumTimer);
  var ta = document.getElementById('htmlCodeInput');
  var len = ta && ta.value ? ta.value.length : 0;
  var delay = len > 80000 ? 180 : (len > 20000 ? 80 : 40);
  __lineNumTimer = setTimeout(function() {
    __lineNumTimer = null;
    try { updateLineNumbersFast(); } catch (e) {}
  }, delay);
}

function updateLineNumbersFast() {
  var textarea = document.getElementById('htmlCodeInput');
  var lineNumbers = document.getElementById('lineNumbers');
  if (!textarea || !lineNumbers) return;
  var textVal = textarea.value || '';
  var count = 1;
  for (var i = 0; i < textVal.length; i++) {
    if (textVal.charCodeAt(i) === 10) count++;
  }
  if (count === __lastLineCount && lineNumbers.childNodes.length) {
    try { lineNumbers.scrollTop = textarea.scrollTop; } catch (e) {}
    return;
  }
  __lastLineCount = count;
  /* Full line list — same count as real code (hard cap only for extreme safety) */
  var show = count > 200000 ? 200000 : count;
  var arr = new Array(show);
  for (var n = 0; n < show; n++) arr[n] = String(n + 1);
  lineNumbers.textContent = arr.join('\n') + (count > show ? '\n…' : '') + '\n';
  /* Match gutter scroll to code after rebuild */
  requestAnimationFrame(function(){
    try { lineNumbers.scrollTop = textarea.scrollTop; } catch (e) {}
    try { if (typeof syncScroll === 'function') syncScroll(textarea); } catch (e) {}
  });
}

function scheduleHighlight() {
  /* CodeMirror handles colors — skip legacy highlight.js path (major lag source) */
  try {
    if (typeof getCodeMirror === 'function' && getCodeMirror()) return;
  } catch (e) {}
  if (__highlightTimer) clearTimeout(__highlightTimer);
  var ta = document.getElementById('htmlCodeInput');
  var len = ta && ta.value ? ta.value.length : 0;
  var delay = len > 120000 ? 800 : (len > 40000 ? 400 : 120);
  __highlightTimer = setTimeout(function() {
    __highlightTimer = null;
    try {
      if (typeof window.refreshCodeHighlight === 'function') window.refreshCodeHighlight();
    } catch (e) {}
  }, delay);
}

function handleEditorInput() {
  /* Lightweight only — no full highlight/line rebuild on every key */
  try { updateStats(); } catch (e) {}
  scheduleLineNumbers();
  if (window.__israrPasteBurst) {
    /* During large paste, delay highlight further */
    if (__highlightTimer) clearTimeout(__highlightTimer);
    __highlightTimer = setTimeout(function(){
      window.__israrPasteBurst = false;
      scheduleHighlight();
    }, 900);
    return;
  }
  scheduleHighlight();
}

function handleEditorTab(e) {
  if (e.key === 'Tab') {
    e.preventDefault();
    const start = this.selectionStart, end = this.selectionEnd;
    this.value = this.value.substring(0, start) + '  ' + this.value.substring(end);
    this.selectionStart = this.selectionEnd = start + 2;
    handleEditorInput();
  }
}
function syncScroll(textarea) {
  if (!textarea) return;
  var st = textarea.scrollTop;
  var sl = textarea.scrollLeft;
  var gutter = document.getElementById('lineNumbers');
  if (gutter) {
    if (gutter.scrollTop !== st) gutter.scrollTop = st;
  }
  var layer = document.querySelector('#editorView .code-highlight-layer');
  if (layer) {
    if (layer.scrollTop !== st) layer.scrollTop = st;
    if (layer.scrollLeft !== sl) layer.scrollLeft = sl;
  }
}

function moveCursorAction(direction) {
  const ta = document.getElementById('htmlCodeInput');
  let pos = ta.selectionStart, val = ta.value;
  if (direction === 'left' && pos > 0) pos--;
  else if (direction === 'right' && pos < val.length) pos++;
  ta.focus(); ta.setSelectionRange(pos, pos);
}

function editorActionClear() {
  if (confirm("क्या आप एडिटर का पूरा कोड साफ करना चाहते हैं?")) {
    document.getElementById('htmlCodeInput').value = '';
    handleEditorInput();
  }
}
function editorActionUndo() { document.execCommand('undo'); handleEditorInput(); }
function editorActionRedo() { document.execCommand('redo'); handleEditorInput(); }
function editorActionCopyText() {
  const ta = document.getElementById('htmlCodeInput');
  ta.select();
  navigator.clipboard.writeText(ta.value).then(() => alert('Code Copied to Clipboard!'));
}
function editorActionPasteText() {
  navigator.clipboard.readText().then(text => {
    const ta = document.getElementById('htmlCodeInput');
    let start = ta.selectionStart, end = ta.selectionEnd, currentScrollTop = ta.scrollTop;
    ta.value = ta.value.substring(0, start) + text + ta.value.substring(end);
    ta.selectionStart = ta.selectionEnd = start + text.length;
    ta.scrollTop = currentScrollTop;
    handleEditorInput();
  }).catch(err => { alert('Paste permission denied.'); });
}

function insertSnippet(type) {
  var snippet = '';
  if (type === 'html') snippet = '<html>\n  \n</html>';
  else if (type === 'style') snippet = '<style>\n  \n</style>';
  else if (type === 'script') snippet = '<script>\n  \n</' + 'script>';
  var cm = (typeof getCodeMirror === 'function') ? getCodeMirror() : null;
  if (cm) {
    cm.replaceSelection(snippet);
    cm.focus();
    return;
  }
  const ta = document.getElementById('htmlCodeInput');
  if (!ta) return;
  var start = ta.selectionStart, end = ta.selectionEnd;
  ta.value = ta.value.substring(0, start) + snippet + ta.value.substring(end);
  var inner = start + snippet.indexOf('\n') + 1;
  ta.selectionStart = ta.selectionEnd = inner;
  ta.focus();
  if (typeof handleEditorInput === 'function') handleEditorInput();
}
function handleTagSelectInsert(select) {
  var val = select.value;
  var ta = document.getElementById('htmlCodeInput');
  if (!val) { select.selectedIndex = 0; return; }
  var cm = (typeof getCodeMirror === 'function') ? getCodeMirror() : null;
  if (!ta && !cm) { select.selectedIndex = 0; return; }
  var map = {
    div: '<div class="">\n  \n</div>',
    button: '<button type="button">Click Me</button>',
    a: '<a href="https://" target="_blank" rel="noopener">Link Text</a>',
    img: '<img src="" alt="image" title="image">',
    p: '<p>Paragraph text here...</p>',
    span: '<span></span>',
    h1: '<h1>Heading 1</h1>',
    h2: '<h2>Heading 2</h2>',
    h3: '<h3>Heading 3</h3>',
    h4: '<h4>Heading 4</h4>',
    h5: '<h5>Heading 5</h5>',
    h6: '<h6>Heading 6</h6>',
    ul: '<ul>\n  <li>Item 1</li>\n  <li>Item 2</li>\n</ul>',
    ol: '<ol>\n  <li>Item 1</li>\n  <li>Item 2</li>\n</ol>',
    li: '<li>List item</li>',
    table: '<table border="1">\n  <tr><th>A</th><th>B</th></tr>\n  <tr><td>1</td><td>2</td></tr>\n</table>',
    tr: '<tr>\n  <td></td>\n  <td></td>\n</tr>',
    td: '<td></td>',
    th: '<th></th>',
    form: '<form action="" method="post">\n  \n</form>',
    input: '<input type="text" name="" placeholder="">',
    textarea: '<textarea rows="4" cols="40"></textarea>',
    select: '<select>\n  <option value="1">Option 1</option>\n  <option value="2">Option 2</option>\n</select>',
    label: '<label for=""></label>',
    section: '<section>\n  \n</section>',
    article: '<article>\n  \n</article>',
    header: '<header>\n  \n</header>',
    footer: '<footer>\n  \n</footer>',
    nav: '<nav>\n  \n</nav>',
    main: '<main>\n  \n</main>',
    aside: '<aside>\n  \n</aside>',
    figure: '<figure>\n  <img src="" alt="">\n  <figcaption></figcaption>\n</figure>',
    figcaption: '<figcaption></figcaption>',
    video: '<video controls width="100%">\n  <source src="" type="video/mp4">\n</video>',
    audio: '<audio controls>\n  <source src="" type="audio/mpeg">\n</audio>',
    iframe: '<iframe src="" width="100%" height="300" frameborder="0"></iframe>',
    canvas: '<canvas id="myCanvas" width="300" height="150"></canvas>',
    svg: '<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">\n  <circle cx="50" cy="50" r="40" fill="#42e8ff"/>\n</svg>',
    br: '<br>',
    hr: '<hr>',
    strong: '<strong></strong>',
    em: '<em></em>',
    code: '<code></code>',
    pre: '<pre>\n  \n</pre>',
    blockquote: '<blockquote>\n  \n</blockquote>',
    details: '<details>\n  <summary>More</summary>\n  \n</details>',
    summary: '<summary></summary>',
    meta: '<meta name="" content="">',
    link: '<link rel="stylesheet" href="">',
    progress: '<progress value="50" max="100"></progress>',
    meter: '<meter value="0.6" min="0" max="1"></meter>',
    dialog: '<dialog open>\n  <p></p>\n  <button>Close</button>\n</dialog>'
  };
  var snippet = map[val] || ('<' + val + '></' + val + '>');
  if (cm) {
    cm.replaceSelection(snippet);
    cm.focus();
  } else if (ta) {
    var start = ta.selectionStart, end = ta.selectionEnd;
    ta.value = ta.value.substring(0, start) + snippet + ta.value.substring(end);
    ta.selectionStart = ta.selectionEnd = start + snippet.length;
    ta.focus();
    if (typeof handleEditorInput === 'function') handleEditorInput();
  }
  select.selectedIndex = 0;
}
function triggerAutoSave() {
  /* Disabled: only explicit Save/Update button saves */
  updateStats();
}

function smartTitleFromCode(userTitle, htmlCode) {
  var t = (userTitle || '').trim();
  /* Keep real user title */
  if (t && !/^Title\s*\d*$/i.test(t) && t.toLowerCase() !== 'untitled' && t.toLowerCase() !== 'untitled code') {
    return t.substring(0, 100);
  }
  var code = htmlCode || '';
  try {
    var titleTag = code.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    if (titleTag && titleTag[1]) {
      var tt = titleTag[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
      if (tt) return tt.substring(0, 100);
    }
    var og = code.match(/property\s*=\s*["']og:title["'][^>]*content\s*=\s*["']([^"']+)["']/i)
          || code.match(/content\s*=\s*["']([^"']+)["'][^>]*property\s*=\s*["']og:title["']/i);
    if (og && og[1] && og[1].trim()) return og[1].trim().substring(0, 100);
    var h1 = code.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    if (h1 && h1[1]) {
      var ht = h1[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
      if (ht) return ht.substring(0, 100);
    }
  } catch (e) {}
  var trimmed = code.trim();
  if (!trimmed) return 'Untitled Code';
  var hasHtml = /<\s*(html|body|div|section|button|a|p|span|table|form|img|header|nav)\b/i.test(trimmed);
  if (/<\s*style\b/i.test(trimmed) && !hasHtml && !/<\s*script\b/i.test(trimmed)) return 'Style Block';
  if (/\{[^}]*:[^};]+;/.test(trimmed) && !hasHtml) return 'CSS Stylesheet';
  if (/<\s*script\b/i.test(trimmed) && !hasHtml) return 'Script Block';
  if (/^\s*(function|const|let|var|import|export)\b/m.test(trimmed) && !hasHtml) return 'JavaScript Snippet';
  var plain = trimmed.replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (plain.length > 8) return plain.substring(0, 48) + (plain.length > 48 ? '…' : '');
  return 'HTML Card';
}

function executeAutoSave() {
  const titleEl = document.getElementById('noteTitle');
  const codeEl = document.getElementById('htmlCodeInput');
  if (!titleEl || !codeEl) return false;
  try { if (typeof getEditorCode === 'function' && getCodeMirror && getCodeMirror()) codeEl.value = getEditorCode(); } catch(e) {}
  const htmlCode = codeEl.value || '';
  const title = smartTitleFromCode(titleEl.value, htmlCode);
  try { titleEl.value = title; } catch (e) {}
  const now = new Date();
  const dateStr = now.toLocaleDateString() + ' ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  /* Creating new: require some real content (not empty paste) */
  var isNew = !!(window.isCreatingNewNote || window.editingNoteId == null);
  if (isNew) {
    if (!htmlCode.trim() && (!titleEl.value || !titleEl.value.trim() || /^Title\s+\d+$/i.test(titleEl.value.trim()))) {
      /* empty new card — do not save */
      return false;
    }
    const createdStr = dateStr;
    const newId = generateUniqueId();
    /* New card: NO automatic category — only when user assigns via Settings → Category */
    const newNote = {
      id: newId,
      title: title,
      htmlCode: htmlCode,
      createdAtStr: createdStr,
      updatedAt: dateStr,
      category: '',
      isPinned: false,
      createdAt: Date.now(),
      updateCount: 1
    };
    notes.unshift(newNote);
    editingIndex = 0;
    window.editingNoteId = newId;
    window.isCreatingNewNote = false;
    addHistoryLog(title, '', createdStr, dateStr, 1, newId);
    try { saveData(); } catch (e) { console.error(e); }
    window.__israrForceNotesRender = true;
    /* defer heavy card/history re-render so Save feels instant */
    setTimeout(function(){
      try { renderNotes(); } catch (e) {}
      try { renderExternalHistoryLogs(); } catch (e) {}
    }, 0);
    return true;
  }

  var idx = notes.findIndex(function(n) { return n && n.id === window.editingNoteId; });
  if (idx < 0 && editingIndex !== null && notes[editingIndex]) idx = editingIndex;
  if (idx < 0 || !notes[idx]) {
    window.isCreatingNewNote = true;
    window.editingNoteId = null;
    return executeAutoSave();
  }
  var note = notes[idx];
  /* Protect: don't wipe a card that had code with an accidental empty save */
  if (!(htmlCode || '').trim() && (note.htmlCode || '').trim().length > 50) {
    try { alert('Editor empty hai. Purane code ko mitane ke liye pehle Clear karein, ya code paste karke Update karein.'); } catch(e) {}
    return false;
  }
  note.title = title;
  note.htmlCode = htmlCode;
  note.updatedAt = dateStr;
  note.updateCount = (note.updateCount || 0) + 1;
  if (!note.id) note.id = generateUniqueId();
  editingIndex = idx;
  window.editingNoteId = note.id;
  addHistoryLog(title, '', note.createdAtStr || note.updatedAt, dateStr, note.updateCount, note.id);
  try { saveData(); } catch (e) { console.error(e); }
  setTimeout(function(){
    try { renderNotes(); } catch (e) {}
    try { renderExternalHistoryLogs(); } catch (e) {}
  }, 0);
  return true;
}

function encodeHtmlForUrl(html) {
  try {
    var b64 = btoa(unescape(encodeURIComponent(html || '')));
    return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  } catch (e) { return encodeURIComponent(html || ''); }
}

function getSiteShareUrl() {
  /* Always share the REAL hosted website URL (never localhost/file) */
  try {
    var canonical = document.querySelector('link[rel="canonical"]');
    if (canonical && canonical.href && /^https?:/i.test(canonical.href)) {
      return canonical.href.split('#')[0].split('?')[0];
    }
  } catch (e) {}
  try {
    var host = String(window.location.hostname || '');
    var isLocal = !host || host === 'localhost' || host === '127.0.0.1' || host === '0.0.0.0';
    if (!isLocal && (window.location.protocol === 'http:' || window.location.protocol === 'https:')) {
      return window.location.href.split('#')[0].split('?')[0];
    }
  } catch (e) {}
  return 'https://israrlabmultihtmlviewer.blogspot.com/';
}

function makeNoteShareUrl(htmlCode, titleText) {
  /* Keep API but always return clean site URL so shared links open this website */
  return getSiteShareUrl();
}

function copyHistoryShareUrl(index) {
  var log = (index != null && historyLogs[index]) ? historyLogs[index] : null;
  var title = (log && log.title) ? log.title : 'Israr Lab Multi HTML Viewer';
  var url = getSiteShareUrl();
  var textMsg = title + '\n' + url;
  var shareData = { title: title, text: textMsg, url: url };
  /* MUST open mobile OS share sheet — no popup, no silent-only copy first */
  try {
    if (typeof navigator.share === 'function') {
      var p = navigator.share(shareData);
      if (p && typeof p.then === 'function') {
        p.catch(function(err) {
          if (err && (err.name === 'AbortError' || err.name === 'NotAllowedError')) return;
        });
      }
      return;
    }
  } catch (e) {}
  /* Desktop / unsupported browsers only: copy URL silently */
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url);
  } catch (e2) {}
}

function showShareFallback(url, title) {
  /* No popup — silent copy only */
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url || getSiteShareUrl());
  } catch (e) {}
}

function copyHistoryCode(index) {
  if (!historyLogs[index]) return;
  var code = getCodeForHistoryLog(historyLogs[index]);
  if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(code).then(function(){ alert('Code Copied!'); });
  else prompt('Copy HTML code:', code);
}


function getCodeForHistoryLog(log) {
  if (!log) return '';
  if (log.htmlCode) return log.htmlCode;
  if (log.noteId) {
    var n = notes.find(function(x){ return x && x.id === log.noteId; });
    if (n) return n.htmlCode || '';
  }
  if (typeof log.noteIndex === 'number' && log.noteIndex >= 0 && notes[log.noteIndex]) {
    return notes[log.noteIndex].htmlCode || '';
  }
  return '';
}

function addHistoryLog(title, htmlCode, createdTime, updatedTime, count, noteKey) {
  if (!Array.isArray(historyLogs)) historyLogs = [];
  var existingLogIndex = -1;
  if (noteKey !== undefined && noteKey !== null && noteKey !== '') {
    existingLogIndex = historyLogs.findIndex(function(item) {
      if (item && item.noteId != null && String(item.noteId) === String(noteKey)) return true;
      return false;
    });
  }
  if (existingLogIndex !== -1) {
    var log = historyLogs[existingLogIndex];
    log.title = title || log.title || 'Untitled';
    log.htmlCode = '';
    log.updatedTime = updatedTime || log.updatedTime;
    log.updateCount = count || log.updateCount || 1;
    if (typeof noteKey === 'string') log.noteId = noteKey;
    historyLogs.splice(existingLogIndex, 1);
    historyLogs.unshift(log);
  } else {
    historyLogs.unshift({
      noteId: (typeof noteKey === 'string') ? noteKey : null,
      noteIndex: (typeof noteKey === 'number') ? noteKey : -1,
      title: title || 'Untitled',
      htmlCode: '',
      createdTime: createdTime || '',
      updatedTime: updatedTime || '',
      updateCount: count || 1,
      viewsCount: 0
    });
  }
  if (historyLogs.length > 80) historyLogs = historyLogs.slice(0, 80);
  try { saveData(); } catch (e) {}
  try { if (typeof renderExternalHistoryLogs === 'function') renderExternalHistoryLogs(); } catch (e) {}
}
function renderExternalHistoryLogs() {
  const container = document.getElementById('externalHistoryListContainer');
  const searchInput = document.getElementById('historySearchInput');
  const matchInfoBox = document.getElementById('historySearchMatchInfo');
  if (!container) return;

  let query = searchInput ? searchInput.value.trim().toLowerCase() : '';
  let filteredLogs = historyLogs;

  if (query.length > 0) {
    filteredLogs = historyLogs.filter(log => (log.title || '').toLowerCase().includes(query));
    matchInfoBox.style.display = 'block';
    matchInfoBox.innerText = '🔍 "' + query + '" से मिलते-जुलते कुल ' + filteredLogs.length + ' हिस्ट्री बॉक्स मिले हैं।';
  } else { matchInfoBox.style.display = 'none'; }

  if (filteredLogs.length === 0) {
    container.innerHTML = '<div class="empty-notes"><p>No activity history yet.</p></div>';
    return;
  }

  container.innerHTML = '';
  filteredLogs.forEach(function(log) {
    var originalIndex = historyLogs.indexOf(log);
    var itemNumber = historyLogs.length - originalIndex;
    var viewsCount = log.viewsCount || 0;
    var titleDisplay = log.title || 'Untitled';
    var isTitleMatched = query.length > 0 && titleDisplay.toLowerCase().includes(query);
    var noteIdx = (log.noteIndex !== undefined) ? log.noteIndex : 0;

    /* Green highlight matched search word inside title */
    var titleHtml = String(titleDisplay).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    if (query.length > 0) {
      try {
        var safeQ = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        var re = new RegExp('(' + safeQ + ')', 'ig');
        titleHtml = titleHtml.replace(re, '<mark class="hist-search-hit">$1</mark>');
      } catch (e) {}
    }

    var box = document.createElement('div');
    box.className = 'history-box-item' + (isTitleMatched ? ' highlighted-box' : '');
    box.id = 'history-box-' + originalIndex;
    box.onclick = function() { focusCardFromHistory(noteIdx, originalIndex); };

    box.innerHTML =
      '<div class="history-box-header">' +
        '<div style="display:flex; align-items:center; flex:1; overflow:hidden;">' +
          '<span class="history-num-badge">#' + itemNumber + '</span>' +
          '<span class="history-box-title ' + (isTitleMatched ? 'search-matched' : '') + '" title="' + String(titleDisplay).replace(/"/g, '&quot;') + '">📌 ' + titleHtml + '</span>' +
        '</div>' +
        '<div style="display:flex; align-items:center; gap:6px;">' +
          '<span style="color:var(--cyan);font-weight:700;font-size:10px;white-space:nowrap;">Updated ' + (log.updateCount || 0) + ' times</span>' +
          '<span style="color:#fbbf24;font-weight:700;font-size:10px;white-space:nowrap;">👁️ Views: ' + viewsCount + '</span>' +
          '<button class="history-delete-btn" data-idx="' + originalIndex + '">Delete</button>' +
        '</div>' +
      '</div>' +
      '<div style="font-size:10px; color:var(--muted); display:flex; justify-content:space-between; gap:10px;">' +
        '<span>🌱 Created: ' + (log.createdTime || '') + '</span>' +
        '<span>🕒 Last Updated: ' + (log.updatedTime || '') + '</span>' +
      '</div>' +
      '<div class="history-actions-row">' +
        '<button class="history-action-btn h-btn-edit" data-idx="' + originalIndex + '">Editor</button>' +
        '<button class="history-action-btn h-btn-preview" data-idx="' + originalIndex + '">Preview</button>' +
        '<button class="history-action-btn h-btn-copy" data-idx="' + originalIndex + '">Copy</button>' +
        '<button class="history-action-btn h-btn-share" data-idx="' + originalIndex + '">Share</button>' +
      '</div>';

    box.querySelector('.history-delete-btn').onclick = function(e) { e.stopPropagation(); deleteSingleHistoryLog(originalIndex); };
    box.querySelector('.h-btn-edit').onclick = function(e) { e.stopPropagation(); openHistoryEditorByIndex(originalIndex); };
    box.querySelector('.h-btn-preview').onclick = function(e) { e.stopPropagation(); previewHistoryCode(originalIndex); };
    box.querySelector('.h-btn-copy').onclick = function(e) { e.stopPropagation(); copyHistoryCode(originalIndex); };
    box.querySelector('.h-btn-share').onclick = function(e) { e.stopPropagation(); copyHistoryShareUrl(originalIndex); };

    container.appendChild(box);
  });
  saveData();
}

function focusCardFromHistory(noteIndex, historyIndex) {
  document.querySelectorAll('.history-box-item').forEach(el => el.classList.remove('highlighted-box'));
  const targetBox = document.getElementById(`history-box-${historyIndex}`);
  if (targetBox) targetBox.classList.add('highlighted-box');
  showHomeDirectly();
  setTimeout(() => {
    const cardCheckboxes = document.querySelectorAll('.main-card-checkbox');
    cardCheckboxes.forEach(cb => {
      const cardEl = cb.closest('.note-card');
      if (cardEl) cardEl.classList.remove('highlighted-card');
      if (parseInt(cb.dataset.index) === noteIndex) {
        if (cardEl) {
          cardEl.classList.add('highlighted-card');
          cardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setTimeout(() => cardEl.classList.remove('highlighted-card'), 3500);
        }
      }
    });
  }, 100);
}

function deleteSingleHistoryLog(index) {
  if (confirm('क्या आप इस हिस्ट्री लॉग को डिलीट करना चाहते हैं?')) {
    historyLogs.splice(index, 1);
    saveData(); renderExternalHistoryLogs();
  }
}

function clearAllHistoryLogs() {
  if (confirm('क्या आप सभी हिस्ट्री लॉग्स को हमेशा के लिए डिलीट करना चाहते हैं?')) {
    historyLogs = [];
    saveData(); renderExternalHistoryLogs();
  }
}

function openHistoryEditorByIndex(index) {
  if (!historyLogs[index]) return;
  var log = historyLogs[index];
  var title = log.title || 'Untitled';
  var htmlCode = getCodeForHistoryLog(log);
  var targetIndex = -1;
  if (log.noteId) {
    targetIndex = notes.findIndex(function(n) { return n && n.id === log.noteId; });
  }
  if (targetIndex < 0 && typeof log.noteIndex === 'number' && log.noteIndex >= 0 && notes[log.noteIndex]) {
    targetIndex = log.noteIndex;
  }
  if (targetIndex < 0) {
    targetIndex = notes.findIndex(function(n) { return n && n.title === title; });
  }
  if (targetIndex < 0) {
    var newNote = {
      id: log.noteId || generateUniqueId(),
      title: title,
      htmlCode: htmlCode,
      createdAtStr: new Date().toLocaleString(),
      updatedAt: new Date().toLocaleString(),
      category: '',
      isPinned: false,
      createdAt: Date.now(),
      updateCount: log.updateCount || 1
    };
    notes.unshift(newNote);
    targetIndex = 0;
    saveData();
  }
  pushSubviewState('editor');
  editingIndex = targetIndex;
  window.editingNoteId = notes[targetIndex].id || null;
  window.isCreatingNewNote = false;
  document.getElementById('noteTitle').value = notes[targetIndex].title;
  document.getElementById('htmlCodeInput').value = notes[targetIndex].htmlCode || htmlCode || '';
  document.getElementById('homeView').style.display = 'none';
  document.getElementById('editorView').style.display = 'flex';
  var saveUpdateBtn = document.getElementById('editorSaveUpdateBtn');
  if (saveUpdateBtn) saveUpdateBtn.innerText = 'Update';
  startLiveClock();
  updateStats();
  updateLineNumbers();
  if (typeof scheduleHighlight === "function") scheduleHighlight(); else if (window.refreshCodeHighlight) window.refreshCodeHighlight();
}
function setFullHtmlTitle(raw) {
  var el = document.getElementById('fullHtmlTitle');
  if (!el) return;
  var t = (raw || 'Preview').toString().trim() || 'Preview';
  el.setAttribute('title', t);
  /* Keep one clean line; CSS ellipsis handles visual overflow */
  el.innerText = t;
}

function previewHistoryCode(index) {
  setHomeChromeVisible(false);
  if (!historyLogs[index]) return;
  historyLogs[index].viewsCount = (historyLogs[index].viewsCount || 0) + 1;
  try { saveData(); renderExternalHistoryLogs(); } catch (e) {}
  pushSubviewState('preview');
  const log = historyLogs[index];
  setFullHtmlTitle(log.title || 'Preview');
  document.getElementById('fullHtmlIframe').srcdoc = getCodeForHistoryLog(log);
  document.getElementById('homeView').style.display = 'none';
  var histSection = document.querySelector('.external-history-section');
  if (histSection) histSection.style.display = 'none';
  document.getElementById('fullHtmlView').style.display = 'flex';
}
window.previewCurrentEditorCode = function previewCurrentEditorCode() {
  var code = '';
  try {
    if (typeof getEditorCode === 'function') code = getEditorCode();
    else {
      var ta = document.getElementById('htmlCodeInput');
      code = ta ? (ta.value || '') : '';
    }
  } catch (e) {
    var ta2 = document.getElementById('htmlCodeInput');
    code = ta2 ? (ta2.value || '') : '';
  }
  var title = (document.getElementById('noteTitle') || {}).value || 'HTML Preview';
  var frame = document.getElementById('fullHtmlIframe');
  var view = document.getElementById('fullHtmlView');
  if (!frame || !view) return;
  window.__previewFromEditor = true;
  try {
    window.__previewNoteIndex = (typeof editingIndex === 'number') ? editingIndex : -1;
  } catch (e) { window.__previewNoteIndex = -1; }
  try { pushSubviewState('preview'); } catch (e) {}
  setFullHtmlTitle(title || 'Preview');
  /* CRITICAL: editorView z-index is higher — hide it so preview is visible */
  try {
    var ed = document.getElementById('editorView');
    if (ed) ed.style.display = 'none';
  } catch (e) {}
  view.style.display = 'flex';
  view.style.zIndex = '1000020';
  try { if (typeof setPreviewDevice === 'function') setPreviewDevice('mobile'); } catch (e) {}
  try { frame.srcdoc = 'about:blank'; } catch (e) {}
  setTimeout(function(){
    try { frame.srcdoc = code || ''; } catch (e) {}
  }, 30);
}

window.__previewDevice = 'mobile';
window.__previewNoteIndex = -1;

window.__pvSizeMenuCloser = null;
window.closePreviewSizeMenu = function closePreviewSizeMenu() {
  var menu = document.getElementById('pvSizeMenu');
  if (menu) menu.style.display = 'none';
  if (window.__pvSizeMenuCloser) {
    try {
      document.removeEventListener('pointerdown', window.__pvSizeMenuCloser, true);
      document.removeEventListener('click', window.__pvSizeMenuCloser, true);
      window.removeEventListener('scroll', window.__pvSizeMenuCloser, true);
      window.removeEventListener('resize', window.__pvSizeMenuCloser, true);
    } catch (e) {}
    window.__pvSizeMenuCloser = null;
  }
};

window.togglePreviewSizeMenu = function togglePreviewSizeMenu(e) {
  try { if (e) { e.preventDefault(); e.stopPropagation(); } } catch (err) {}
  var menu = document.getElementById('pvSizeMenu');
  var btn = document.getElementById('pvSizeBtn');
  if (!menu) return;
  var openNow = (menu.style.display === 'flex');
  if (openNow) {
    window.closePreviewSizeMenu();
    return;
  }
  /* Position fixed menu just under the Mobile button */
  try {
    var r = (btn || (e && e.currentTarget) || menu.parentElement).getBoundingClientRect();
    var top = Math.round(r.bottom + 6);
    var left = Math.round(r.left);
    var menuW = 170;
    if (left + menuW > window.innerWidth - 8) {
      left = Math.max(8, window.innerWidth - menuW - 8);
    }
    if (left < 8) left = 8;
    menu.style.top = top + 'px';
    menu.style.left = left + 'px';
    menu.style.right = 'auto';
    menu.style.bottom = 'auto';
  } catch (posErr) {}
  menu.style.display = 'flex';
  /* Outside click / scroll / resize → close */
  setTimeout(function () {
    function closer(ev) {
      var t = ev && ev.target;
      try {
        if (t && menu.contains(t)) return;
        if (t && (t.id === 'pvSizeBtn' || (t.closest && (t.closest('#pvSizeBtn') || t.closest('.pv-size-wrap'))))) return;
      } catch (e2) {}
      window.closePreviewSizeMenu();
    }
    window.__pvSizeMenuCloser = closer;
    document.addEventListener('pointerdown', closer, true);
    document.addEventListener('click', closer, true);
    window.addEventListener('scroll', closer, true);
    window.addEventListener('resize', closer, true);
  }, 30);
};

window.pickPreviewSize = function pickPreviewSize(device) {
  try { window.closePreviewSizeMenu(); } catch (e) {
    var menu = document.getElementById('pvSizeMenu');
    if (menu) menu.style.display = 'none';
  }
  setPreviewDevice(device || 'mobile');
  var label = document.getElementById('pvSizeLabel');
  var btn = document.getElementById('pvSizeBtn');
  var names = { mobile: 'Mobile', tablet: 'Tablet', desktop: 'Desktop', pc: 'PC' };
  var icons = { mobile: 'fa-mobile-alt', tablet: 'fa-tablet-alt', desktop: 'fa-desktop', pc: 'fa-laptop' };
  if (label) label.textContent = names[device] || 'Mobile';
  if (btn) {
    var ic = btn.querySelector('i.fas');
    if (ic && icons[device]) ic.className = 'fas ' + icons[device];
  }
  /* mark active in menu */
  if (menu) {
    menu.querySelectorAll('button').forEach(function(b){
      b.classList.toggle('active', b.getAttribute('data-device') === device);
    });
  }
}

window.openEditorFromPreview = function openEditorFromPreview() {
  var idx = (typeof window.__previewNoteIndex === 'number') ? window.__previewNoteIndex : -1;
  var view = document.getElementById('fullHtmlView');
  if (view) view.style.display = 'none';
  if (idx >= 0 && typeof openEditor === 'function') {
    openEditor(idx);
    return;
  }
  /* fallback: open editor with current iframe code as new/unsaved */
  if (typeof openEditor === 'function') {
    try {
      window.__israrEditorIsNew = false;
      var frame = document.getElementById('fullHtmlIframe');
      var code = frame ? (frame.srcdoc || '') : '';
      window.__israrEditorLoadCode = code;
    } catch (e) {}
    openEditor(-1);
  }
}

function setPreviewDevice(device) {
  window.__previewDevice = device || 'mobile';
  var frameWrap = document.getElementById('previewDeviceFrame');
  var stage = document.getElementById('previewStage');
  var bar = document.getElementById('previewDeviceBar');
  var info = document.getElementById('previewDeviceInfo');
  if (bar) {
    bar.querySelectorAll('.preview-device-btn').forEach(function(btn){
      btn.classList.toggle('active', btn.getAttribute('data-device') === window.__previewDevice);
    });
  }
  if (!frameWrap) return;
  frameWrap.className = 'preview-device-frame device-' + window.__previewDevice;
  /* sync Size button label */
  try {
    var _names = { mobile: 'Mobile', tablet: 'Tablet', desktop: 'Desktop', pc: 'PC' };
    var _icons = { mobile: 'fa-mobile-alt', tablet: 'fa-tablet-alt', desktop: 'fa-desktop', pc: 'fa-laptop' };
    var _lab = document.getElementById('pvSizeLabel');
    var _btn = document.getElementById('pvSizeBtn');
    var _d = window.__previewDevice || 'mobile';
    if (_lab) _lab.textContent = _names[_d] || 'Mobile';
    if (_btn) {
      var _ic = _btn.querySelector('i.fas');
      if (_ic && _icons[_d]) _ic.className = 'fas ' + _icons[_d];
    }
    var _menu = document.getElementById('pvSizeMenu');
    if (_menu) {
      _menu.querySelectorAll('button').forEach(function(b){
        b.classList.toggle('active', b.getAttribute('data-device') === _d);
      });
    }
  } catch (e) {}

  var map = {
    mobile:  { w: 390,  h: 844,  label: 'Mobile' },
    tablet:  { w: 768,  h: 1024, label: 'Tablet' },
    desktop: { w: 1366, h: 768,  label: 'Desktop' },
    pc:      { w: 1920, h: 1080, label: 'PC' }
  };
  var size = map[window.__previewDevice] || map.mobile;
  var stageW = stage ? stage.clientWidth : window.innerWidth;
  var stageH = stage ? stage.clientHeight : (window.innerHeight - 160);
  var iframe = document.getElementById('fullHtmlIframe');

  if (window.__previewDevice === 'mobile') {
    /* MOBILE = full unrestricted preview — DO NOT TOUCH */
    if (stage) {
      stage.style.alignItems = 'stretch';
      stage.style.justifyContent = 'stretch';
      stage.style.padding = '0';
      stage.style.overflow = 'hidden';
    }
    frameWrap.style.width = '100%';
    frameWrap.style.height = '100%';
    frameWrap.style.maxWidth = '100%';
    frameWrap.style.maxHeight = '100%';
    frameWrap.style.margin = '0';
    frameWrap.style.borderRadius = '0';
    frameWrap.style.border = 'none';
    frameWrap.style.boxShadow = 'none';
    frameWrap.style.background = '#fff';
    frameWrap.style.transform = 'none';
    frameWrap.style.transformOrigin = 'top left';
    if (iframe) {
      iframe.style.width = '100%';
      iframe.style.height = '100%';
    }
    if (info) {
      info.textContent = 'Device: Mobile · Full width · 100% scale';
    }
    return;
  }

  /* TABLET / DESKTOP / PC — content FULL WIDTH of screen */
  if (stage) {
    stage.style.alignItems = 'flex-start';
    stage.style.justifyContent = 'flex-start';
    stage.style.padding = '0';
    stage.style.margin = '0';
    stage.style.overflowX = 'hidden';
    stage.style.overflowY = 'auto';
  }

  /* Use actual visible stage width (full phone width) */
  var maxW = stage ? stage.getBoundingClientRect().width : stageW;
  if (!maxW || maxW < 100) maxW = window.innerWidth || stageW;
  maxW = Math.floor(maxW);
  var scale = maxW / size.w;
  if (scale > 1) scale = 1;
  if (scale < 0.05) scale = 0.05;

  var scaledH = Math.round(size.h * scale);

  frameWrap.style.boxSizing = 'border-box';
  frameWrap.style.width = size.w + 'px';
  frameWrap.style.height = size.h + 'px';
  frameWrap.style.maxWidth = 'none';
  frameWrap.style.maxHeight = 'none';
  frameWrap.style.borderRadius = '0';
  frameWrap.style.border = 'none';
  frameWrap.style.boxShadow = 'none';
  frameWrap.style.background = '#fff';
  frameWrap.style.transform = 'scale(' + scale + ')';
  frameWrap.style.transformOrigin = 'top left';
  frameWrap.style.margin = '0';
  frameWrap.style.marginBottom = (scaledH - size.h) + 'px';
  frameWrap.style.left = '0';
  frameWrap.style.right = 'auto';

  if (iframe) {
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = '0';
    iframe.style.display = 'block';
  }

  if (info) info.textContent = '';
}

/* Re-fit preview frame when orientation / window size changes */
(function(){
  var t = null;
  window.addEventListener('resize', function(){
    if (!document.getElementById('fullHtmlView') || document.getElementById('fullHtmlView').style.display !== 'flex') return;
    clearTimeout(t);
    t = setTimeout(function(){ try { setPreviewDevice(window.__previewDevice || 'mobile'); } catch(e){} }, 120);
  });
})();

function openFullHtmlViewer(index) {
  window.__previewFromEditor = false;
  window.__previewNoteIndex = (typeof index === 'number') ? index : -1;
  setHomeChromeVisible(false);
  try { pushSubviewState('preview'); } catch (e) {}
  const note = notes[index] || {};
  setFullHtmlTitle(note.title || 'Preview');
  /* Show shell first so click feels instant — then fill iframe */
  document.getElementById('homeView').style.display = 'none';
  try {
    var hist = document.getElementById('externalHistoryListContainer');
    if (hist && hist.closest) {
      var sec = hist.closest('.external-history-section');
      if (sec) sec.style.display = 'none';
    }
  } catch (e) {}
  var artSec = document.querySelector('.article-section');
  if (artSec) artSec.style.display = 'none';
  var relSec = document.getElementById('israr-lab-related-section');
  if (relSec) relSec.style.display = 'none';
  var frame = document.getElementById('fullHtmlIframe');
  var view = document.getElementById('fullHtmlView');
  if (view) view.style.display = 'flex';
  try { if (typeof setPreviewDevice === 'function') setPreviewDevice('mobile'); } catch (e) {}
  try { if (frame) frame.srcdoc = 'about:blank'; } catch (e) {}
  var code = note.htmlCode || '';
  setTimeout(function(){
    try {
      if (!frame) return;
      if (frame._blobUrl) { try{ URL.revokeObjectURL(frame._blobUrl); }catch(e){} frame._blobUrl=null; }
      frame.removeAttribute('src');
      frame.removeAttribute('srcdoc');
      if (code && code.length > 350000) {
        frame._blobUrl = URL.createObjectURL(new Blob([code], {type:'text/html;charset=utf-8'}));
        frame.src = frame._blobUrl;
      } else {
        frame.srcdoc = code || '';
      }
    } catch (e) {
      try { if (frame) frame.srcdoc = code || ''; } catch (e2) {}
    }
  }, 30);
}

function closeFullHtmlView() {
  try {
    var iv = document.getElementById('infoView');
    if (iv) iv.style.display = 'none';
    window.__israrInfoOpen = false;
  } catch (e) {}
  try {
    var menu = document.getElementById('pvSizeMenu');
    if (menu) menu.style.display = 'none';
  } catch (e) {}
  document.getElementById('fullHtmlView').style.display = 'none';
  /* If preview was opened from editor, return to editor (keep code) */
  if (window.__previewFromEditor) {
    window.__previewFromEditor = false;
    try {
      var ed = document.getElementById('editorView');
      if (ed) {
        ed.style.display = 'flex';
        if (typeof refreshEditorLayout === 'function') setTimeout(refreshEditorLayout, 40);
        return;
      }
    } catch (e) {}
  }
  try {
    if (typeof showHomeDirectly === 'function') {
      showHomeDirectly();
      return;
    }
  } catch (e) {}
  document.getElementById('homeView').style.display = 'flex';
  try { setHomeChromeVisible(true); } catch (e) {}
  try {
    document.getElementById('externalHistoryListContainer').closest('.external-history-section').style.display = 'block';
  } catch (e) {}
  var artSec = document.querySelector('.article-section');
  if (artSec) artSec.style.display = 'block';
  var relSec = document.getElementById('israr-lab-related-section');
  if (relSec) relSec.style.display = 'block';
  var hero = document.querySelector('.hero');
  if (hero) hero.style.display = 'block';
  var footer = document.querySelector('.main-footer');
  if (footer) footer.style.display = 'block';
  window.__israrInSubview = false;
}

/* Layered history: Info -> Preview -> Home. Home Back leaves site (no trap). */
window.__israrInSubview = false;
window.__israrInfoOpen = false;
window.addEventListener('popstate', function(event) {
  var infoVisible = document.getElementById('infoView') && document.getElementById('infoView').style.display === 'flex';
  var previewVisible = document.getElementById('fullHtmlView') && document.getElementById('fullHtmlView').style.display === 'flex';
  var editorVisible = document.getElementById('editorView') && document.getElementById('editorView').style.display === 'flex';
  var backupVisible = document.getElementById('backupView') && document.getElementById('backupView').style.display === 'flex';
  var recoveryVisible = document.getElementById('recoveryView') && document.getElementById('recoveryView').style.display === 'flex';
  var catSetVisible = document.getElementById('categorySettingsPageView') && document.getElementById('categorySettingsPageView').style.display === 'flex';
  var lockViewVisible = document.getElementById('secureLockView') && document.getElementById('secureLockView').style.display === 'flex';
  var settingsModalVisible = document.getElementById('settingsModal') && document.getElementById('settingsModal').style.display === 'flex';

  /* 1) Info open → close Info, stay on Preview (do NOT call history.back again) */
  if (infoVisible || window.__israrInfoOpen) {
    window.__israrInfoOpen = false;
    try {
      var iv = document.getElementById('infoView');
      if (iv) iv.style.display = 'none';
    } catch (e) {}
    try {
      var pv = document.getElementById('fullHtmlView');
      if (pv) pv.style.display = 'flex';
    } catch (e) {}
    try { document.body.classList.add('subview-active'); } catch (e) {}
    window.__israrInSubview = true;
    try { history.replaceState({ view: 'preview', israr: 1 }, ''); } catch (e) {}
    return;
  }

  /* 2) Preview open → close Preview (may return to editor or home) */
  if (previewVisible) {
    try { closeFullHtmlView(); } catch (e) {}
    return;
  }

  /* 3) Any other subview → home */
  var anySubview = editorVisible || backupVisible || recoveryVisible || catSetVisible || lockViewVisible || settingsModalVisible;
  if (anySubview || window.__israrInSubview) {
    window.isCreatingNewNote = false;
    window.editingNoteId = null;
    try { editingIndex = null; } catch (e) {}
    window.__israrInSubview = false;
    window.__israrInfoOpen = false;
    try { showHomeDirectly(); } catch (e) {}
    return;
  }
  /* Already on home: browser leaves the page normally */
});


function copyCurrentFullCode() {
  var frame = document.getElementById('fullHtmlIframe');
  var code = frame ? (frame.srcdoc || '') : '';
  function ok() {
    try {
      var t = document.createElement('div');
      t.textContent = 'Copied!';
      t.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#22c55e;color:#fff;padding:10px 18px;border-radius:10px;font-weight:700;z-index:999999;box-shadow:0 8px 24px rgba(0,0,0,.35);';
      document.body.appendChild(t);
      setTimeout(function(){ try { t.remove(); } catch(e){} }, 1200);
    } catch (e) { alert('HTML Code Copied!'); }
  }
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(code).then(ok).catch(function(){
      try {
        var ta = document.createElement('textarea');
        ta.value = code; document.body.appendChild(ta); ta.select();
        document.execCommand('copy'); ta.remove(); ok();
      } catch (e2) { alert('Copy failed'); }
    });
  } else {
    try {
      var ta2 = document.createElement('textarea');
      ta2.value = code; document.body.appendChild(ta2); ta2.select();
      document.execCommand('copy'); ta2.remove(); ok();
    } catch (e3) { alert('Copy failed'); }
  }
}

/* ========== INFO VIEW (from Preview toolbar) ========== */
function getCurrentPreviewCode() {
  try {
    var frame = document.getElementById('fullHtmlIframe');
    if (frame && frame.srcdoc && frame.srcdoc !== 'about:blank') return frame.srcdoc || '';
  } catch (e) {}
  try {
    if (typeof window.__previewNoteIndex === 'number' && window.__previewNoteIndex >= 0 && notes[window.__previewNoteIndex]) {
      return notes[window.__previewNoteIndex].htmlCode || '';
    }
  } catch (e) {}
  try {
    if (window.__previewFromEditor && typeof getEditorCode === 'function') return getEditorCode() || '';
  } catch (e) {}
  return '';
}

function stripHtmlToText(html) {
  try {
    var d = document.createElement('div');
    d.innerHTML = html || '';
    // remove scripts/styles
    var scripts = d.querySelectorAll('script, style, noscript');
    for (var i = 0; i < scripts.length; i++) scripts[i].remove();
    return (d.textContent || d.innerText || '').replace(/\s+/g, ' ').trim();
  } catch (e) { return ''; }
}

function extractTitleFromHtml(html) {
  try {
    var m = (html || '').match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    if (m && m[1]) return m[1].replace(/<[^>]+>/g, '').trim().slice(0, 120);
  } catch (e) {}
  try {
    var m2 = (html || '').match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    if (m2 && m2[1]) return m2[1].replace(/<[^>]+>/g, '').trim().slice(0, 120);
  } catch (e) {}
  try {
    if (typeof window.__previewNoteIndex === 'number' && window.__previewNoteIndex >= 0 && notes[window.__previewNoteIndex]) {
      return notes[window.__previewNoteIndex].title || 'Untitled Project';
    }
  } catch (e) {}
  return 'Untitled Project';
}

function countWords(text) {
  if (!text) return 0;
  var t = String(text).trim();
  if (!t) return 0;
  return t.split(/\s+/).filter(Boolean).length;
}

/* Estimate Mobile / Responsive / Desktop friendliness from HTML source */
function analyzeResponsiveScores(html) {
  var h = String(html || '').toLowerCase();
  var mobile = 42;
  var tablet = 48;
  var desktop = 55;
  var responsive = 45;

  // Viewport meta — strong mobile signal
  if (/name\s*=\s*["']viewport["']/.test(h) || /content\s*=\s*["'][^"']*width\s*=\s*device-width/.test(h)) {
    mobile += 22;
    tablet += 12;
    responsive += 18;
  }
  // Media queries
  var mqCount = (h.match(/@media/g) || []).length;
  if (mqCount > 0) {
    var mqBoost = Math.min(20, 8 + mqCount * 3);
    mobile += mqBoost;
    tablet += mqBoost;
    responsive += mqBoost + 4;
    desktop += 6;
  }
  // Modern layout
  if (h.indexOf('display:flex') !== -1 || h.indexOf('display: flex') !== -1 || h.indexOf('display:grid') !== -1 || h.indexOf('display: grid') !== -1) {
    mobile += 8; tablet += 8; desktop += 6; responsive += 10;
  }
  // Fluid units
  if (/%|vw|vh|rem|em|minmax|clamp\s*\(/.test(h)) {
    mobile += 7; tablet += 7; responsive += 9; desktop += 4;
  }
  // max-width / min-width responsive patterns
  if (/max-width\s*:/.test(h) || /min-width\s*:/.test(h)) {
    mobile += 6; tablet += 8; responsive += 8; desktop += 5;
  }
  // Fixed large widths hurt mobile
  var fixedWide = (h.match(/width\s*:\s*(6\d{2}|7\d{2}|8\d{2}|9\d{2}|1\d{3})px/g) || []).length;
  if (fixedWide > 0) {
    mobile -= Math.min(18, fixedWide * 5);
    responsive -= Math.min(12, fixedWide * 3);
    desktop += 4;
  }
  // Mobile meta / touch / apple
  if (h.indexOf('apple-mobile-web-app') !== -1 || h.indexOf('mobile-web-app') !== -1 || h.indexOf('touch-action') !== -1) {
    mobile += 6; responsive += 4;
  }
  // Bootstrap / tailwind-ish hints
  if (h.indexOf('bootstrap') !== -1 || h.indexOf('col-md') !== -1 || h.indexOf('col-sm') !== -1 || /\b(sm|md|lg|xl):/.test(h)) {
    mobile += 8; tablet += 10; desktop += 8; responsive += 12;
  }
  // Tables without overflow can hurt mobile
  if (h.indexOf('<table') !== -1 && h.indexOf('overflow') === -1) {
    mobile -= 6; responsive -= 4;
  }
  // Clamp scores 15–99
  function clamp(n) { return Math.max(15, Math.min(99, Math.round(n))); }
  mobile = clamp(mobile);
  tablet = clamp(tablet);
  desktop = clamp(desktop);
  responsive = clamp(responsive);
  // Overall mobile-first score
  var mobileFriendly = clamp((mobile * 0.55) + (responsive * 0.35) + (tablet * 0.10));
  return {
    mobile: mobile,
    tablet: tablet,
    desktop: desktop,
    responsive: responsive,
    mobileFriendly: mobileFriendly
  };
}

function generateRomanDescription(html, title, textContent) {
  var lower = (html || '').toLowerCase();
  var textLower = (textContent || '').toLowerCase();
  var type = 'HTML Project / Webpage';
  var purpose = 'general website content aur interactive elements';

  if (lower.indexOf('privacy') !== -1 || textLower.indexOf('privacy policy') !== -1) {
    type = 'Privacy Policy Generator / Tool';
    purpose = 'website ya app ke liye privacy policy document automatically generate karna';
  } else if (lower.indexOf('generator') !== -1 || textLower.indexOf('generate') !== -1) {
    type = 'Online Generator Tool';
    purpose = 'user inputs se content, code ya document generate karna';
  } else if (lower.indexOf('calculator') !== -1 || textLower.indexOf('calculate') !== -1) {
    type = 'Calculator Tool';
    purpose = 'numbers aur formulas ke basis par calculations perform karna';
  } else if (lower.indexOf('form') !== -1 && (lower.indexOf('input') !== -1 || lower.indexOf('<form') !== -1)) {
    type = 'Form Based Web Tool';
    purpose = 'user se data collect karke result dikhana';
  } else if (lower.indexOf('portfolio') !== -1 || textLower.indexOf('portfolio') !== -1) {
    type = 'Portfolio / Personal Website';
    purpose = 'skills, projects aur personal information showcase karna';
  } else if (lower.indexOf('blog') !== -1 || textLower.indexOf('blog') !== -1) {
    type = 'Blog / Article Page';
    purpose = 'articles, posts aur informational content present karna';
  } else if (lower.indexOf('dashboard') !== -1) {
    type = 'Dashboard Interface';
    purpose = 'data aur controls ko organized way me manage karna';
  } else if (lower.indexOf('game') !== -1 || lower.indexOf('score') !== -1) {
    type = 'HTML Game / Interactive App';
    purpose = 'browser me interactive game ya activity provide karna';
  } else if (lower.indexOf('chat') !== -1 || lower.indexOf('message') !== -1) {
    type = 'Chat / Messaging Interface';
    purpose = 'messages aur communication features dikhana';
  }

  var hasCss = lower.indexOf('<style') !== -1 || lower.indexOf('.css') !== -1;
  var hasJs = lower.indexOf('<script') !== -1 || lower.indexOf('function') !== -1;
  var hasForm = lower.indexOf('<form') !== -1 || lower.indexOf('<input') !== -1;
  var hasTable = lower.indexOf('<table') !== -1;
  var tech = [];
  if (hasCss) tech.push('CSS styling');
  if (hasJs) tech.push('JavaScript interactivity');
  if (hasForm) tech.push('HTML forms');
  if (hasTable) tech.push('tables');
  var techStr = tech.length ? tech.join(', ') : 'basic HTML structure';

  var wordCount = countWords(textContent);
  var shortText = (textContent || '').slice(0, 180).replace(/\s+/g, ' ').trim();
  if (shortText.length > 150) shortText = shortText.slice(0, 150) + '...';

  var desc = '';
  desc += 'Yeh code ek "' + (title || 'Untitled') + '" naam ka ' + type + ' hai. Is project ka mukhya maqsad ' + purpose + ' hai. ';
  desc += 'Code me ' + techStr + ' ka use kiya gaya hai jisse user experience smooth aur professional banta hai. ';
  desc += 'IsrarLab Multi HTML Viewer me aap is project ko live preview me dekh sakte hain, edit kar sakte hain aur backup le sakte hain. ';
  desc += 'Website / tool ka design modern dark theme ke sath banaya gaya hai jisme responsive layout, clear buttons aur easy navigation shamil hai. ';
  if (shortText) {
    desc += 'Content ka chhota sa hissa is tarah dikhta hai: "' + shortText + '". ';
  }
  desc += 'Is project me approximately ' + wordCount + ' words ka readable text content maujood hai. ';
  desc += 'Aap is code ko apne Blogger, website, ya kisi bhi static host par laga sakte hain. Developer ne pure HTML, CSS aur JavaScript ka combination use kiya hai taaki tool offline bhi kaam kare. ';
  desc += 'Agar aap is project ko customize karna chahte hain to Editor button se code open karke changes kar sakte hain. Title, colors, form fields aur logic aasani se update kiye ja sakte hain. ';
  desc += 'Israr Lab ke tools collection ka hissa hone ki wajah se yeh project SEO friendly meta tags, clean structure aur mobile friendly design ke sath aata hai. ';
  desc += 'Overall yeh ek complete ready-to-use solution hai jo beginners aur advanced users dono ke liye useful hai. Aap isse apne brand ke hisaab se rebrand bhi kar sakte hain. ';
  desc += 'Zyada details ke liye code me comments aur structure check karein. Happy coding!';

  // ensure roughly 180-220 words
  var words = desc.split(/\s+/);
  if (words.length > 220) desc = words.slice(0, 210).join(' ') + '...';
  return desc;
}

function openInfoFromPreview() {
  try { if (typeof window.closePreviewSizeMenu === 'function') window.closePreviewSizeMenu(); } catch (e) {}
  var code = getCurrentPreviewCode();
  var title = extractTitleFromHtml(code);
  var textContent = stripHtmlToText(code);
  var charCount = (code || '').length;
  var wordCountCode = countWords(code);
  var wordCountText = countWords(textContent);
  var now = new Date();
  var dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  var timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  var description = generateRomanDescription(code, title, textContent);

  var developer = 'Israr Ahmad';
  var owner = 'Israr Lab / Techno Israr';
  var websiteName = title || 'IsrarLab Multi HTML Viewer Project';

  // try meta author
  try {
    var authM = (code || '').match(/<meta[^>]+name=['"]author['"][^>]+content=['"]([^'"]+)['"]/i) ||
                (code || '').match(/<meta[^>]+content=['"]([^'"]+)['"][^>]+name=['"]author['"]/i);
    if (authM && authM[1]) developer = authM[1].trim();
  } catch (e) {}

  var html = '';
  html += '<div style="display:flex;flex-direction:column;gap:14px;">';
  html += '<div style="background:var(--card-bg);border:1px solid var(--border);border-radius:14px;padding:16px;">';
  html += '<div style="font-size:18px;font-weight:800;color:var(--cyan);margin-bottom:8px;">' + escapeHtmlInfo(websiteName) + '</div>';
  html += '<div style="font-size:12px;color:var(--muted);line-height:1.5;">Project / Website ka complete overview yahan diya gaya hai.</div>';
  html += '</div>';

  html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">';
  html += infoStatCard('Words (Text)', wordCountText);
  html += infoStatCard('Characters (Code)', charCount);
  html += infoStatCard('Words (Code)', wordCountCode);
  html += infoStatCard('Date', dateStr);
  html += infoStatCard('Time', timeStr);
  html += infoStatCard('Lines (approx)', Math.max(1, (code || '').split('\n').length));
  html += '</div>';

  /* Device / Responsive scores */
  var scores = analyzeResponsiveScores(code);
  html += '<div style="background:var(--card-bg);border:1px solid var(--border);border-radius:14px;padding:16px;">';
  html += '<div style="font-size:13px;font-weight:700;color:var(--cyan);margin-bottom:12px;"><i class="fas fa-mobile-alt"></i> Device & Responsive Score</div>';
  html += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px;">';
  html += infoPercentCard('Mobile Friendly', scores.mobileFriendly, '#42e8ff');
  html += infoPercentCard('Responsive', scores.responsive, '#4ce3a8');
  html += infoPercentCard('Mobile Layout', scores.mobile, '#fbbf24');
  html += infoPercentCard('Tablet Ready', scores.tablet, '#b8a0ff');
  html += infoPercentCard('Desktop Ready', scores.desktop, '#60a5fa');
  html += infoPercentCard('Overall UX', Math.round((scores.mobileFriendly + scores.responsive + scores.desktop) / 3), '#f472b6');
  html += '</div>';
  html += '<div style="font-size:11px;color:var(--muted);line-height:1.5;">Ye scores HTML code (viewport, media queries, flex/grid, fluid units) se estimate kiye gaye hain. Real device testing alag se karein.</div>';
  html += '</div>';

  html += '<div style="background:var(--card-bg);border:1px solid var(--border);border-radius:14px;padding:16px;">';
  html += '<div style="font-size:13px;font-weight:700;color:var(--purple);margin-bottom:8px;"><i class="fas fa-user-tie"></i> Developer & Owner</div>';
  html += '<div style="font-size:13px;color:var(--text);margin-bottom:4px;"><strong>Developer:</strong> ' + escapeHtmlInfo(developer) + '</div>';
  html += '<div style="font-size:13px;color:var(--text);"><strong>Owner / Brand:</strong> ' + escapeHtmlInfo(owner) + '</div>';
  html += '</div>';

  html += '<div style="background:var(--card-bg);border:1px solid var(--border);border-radius:14px;padding:16px;">';
  html += '<div style="font-size:13px;font-weight:700;color:var(--green);margin-bottom:10px;"><i class="fas fa-align-left"></i> Website / Code ke bare me (Roman Hindi)</div>';
  html += '<div style="font-size:13px;color:var(--muted);line-height:1.75;text-align:justify;">' + escapeHtmlInfo(description) + '</div>';
  html += '</div>';

  html += '<div style="background:var(--card-bg);border:1px solid var(--border);border-radius:14px;padding:14px;font-size:11px;color:var(--muted);text-align:center;">';
  html += 'Info auto-generated by <strong style="color:var(--cyan);">IsrarLab Multi HTML Viewer</strong>. Preview se wapas jane ke liye Back dabayein.';
  html += '</div>';
  html += '</div>';

  var area = document.getElementById('infoContentArea');
  if (area) area.innerHTML = html;

  var view = document.getElementById('infoView');
  if (view) {
    view.style.display = 'flex';
    try { document.body.classList.add('subview-active'); } catch (e) {}
    /* Real history entry so hardware Back returns to Preview (not Home) */
    try {
      history.pushState({ view: 'info', israr: 1 }, '');
      window.__israrInSubview = true;
      window.__israrInfoOpen = true;
    } catch (e) {}
  }
}

function infoStatCard(label, value) {
  return '<div style="background:var(--card-bg);border:1px solid var(--border);border-radius:12px;padding:12px 10px;text-align:center;">' +
    '<div style="font-size:11px;color:var(--muted);font-weight:600;margin-bottom:4px;">' + escapeHtmlInfo(label) + '</div>' +
    '<div style="font-size:16px;font-weight:800;color:var(--text);">' + escapeHtmlInfo(String(value)) + '</div></div>';
}

function infoPercentCard(label, percent, color) {
  var p = Math.max(0, Math.min(100, parseInt(percent, 10) || 0));
  color = color || 'var(--cyan)';
  return '<div style="background:rgba(128,128,128,0.06);border:1px solid var(--border);border-radius:12px;padding:12px 10px;">' +
    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">' +
    '<span style="font-size:11px;color:var(--muted);font-weight:600;">' + escapeHtmlInfo(label) + '</span>' +
    '<span style="font-size:14px;font-weight:800;color:' + color + ';">' + p + '%</span></div>' +
    '<div style="height:7px;background:rgba(128,128,128,0.15);border-radius:6px;overflow:hidden;">' +
    '<div style="height:100%;width:' + p + '%;background:' + color + ';border-radius:6px;transition:width .4s ease;"></div></div></div>';
}

function escapeHtmlInfo(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function closeInfoView() {
  /* Prefer history.back so stack stays clean (popstate will hide Info) */
  if (window.__israrInfoOpen) {
    window.__israrInfoOpen = false;
    try {
      history.back();
      return;
    } catch (e) {}
  }
  var view = document.getElementById('infoView');
  if (view) view.style.display = 'none';
  window.__israrInfoOpen = false;
  try {
    var pv = document.getElementById('fullHtmlView');
    if (pv) {
      pv.style.display = 'flex';
      document.body.classList.add('subview-active');
      window.__israrInSubview = true;
      try { history.replaceState({ view: 'preview', israr: 1 }, ''); } catch (e) {}
      return;
    }
  } catch (e) {}
  try { document.body.classList.remove('subview-active'); } catch (e) {}
}

/* RENDER NOTES */
function updateCardCountLabel() {
  try {
    var el = document.getElementById('cardCountLabel');
    if (!el) return;
    var n = (typeof notes !== 'undefined' && notes) ? notes.length : 0;
    el.textContent = n + (n === 1 ? ' Card' : ' Cards');
  } catch(e) {}
}

function renderNotes() {
  const container = document.getElementById('notesContainer');
  if (!container) return;
  try { updateCardCountLabel(); } catch(e) {}
  let filteredNotes = currentCategoryFilter === 'All' ? notes.slice() : notes.filter(n => n.category === currentCategoryFilter);

  filteredNotes.sort((a, b) => {
    if (b.isPinned !== a.isPinned) return (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0);
    if (currentSortMode === 'name' || currentSortMode === 'az') return (a.title || '').localeCompare(b.title || '');
    else if (currentSortMode === 'za') return (b.title || '').localeCompare(a.title || '');
    else if (currentSortMode === 'date' || currentSortMode === 'latest') return (b.createdAt || 0) - (a.createdAt || 0);
    else if (currentSortMode === 'oldest') return (a.createdAt || 0) - (b.createdAt || 0);
    else if (currentSortMode === 'size') return ((b.htmlCode || '').length) - ((a.htmlCode || '').length);
    else if (currentSortMode === 'type') return (a.category || '').localeCompare(b.category || '');
    else if (currentSortMode === 'popularity') return (b.updateCount || 1) - (a.updateCount || 1);
    else return (b.createdAt || 0) - (a.createdAt || 0);
  });

  if (isListView) container.classList.add('list-mode'); else container.classList.remove('list-mode');

  if (filteredNotes.length === 0) {
    container.innerHTML = `<div class="empty-notes"><p>No HTML code in this category. Tap <strong>+ New Card</strong> above to add one.</p></div>`;
    return;
  }

  /* Fast path: build with DocumentFragment; lazy-load iframe previews */
  const frag = document.createDocumentFragment();
  filteredNotes.forEach((note) => {
    const originalIndex = notes.indexOf(note);
    const card = document.createElement('div');
    card.className = `note-card ${note.isPinned ? 'pinned' : ''}`;

    const code = note.htmlCode || '';
    const charCount = code.length;
    /* Fast word estimate — full split freezes on 100k+ char notes */
    let wordCount = 0;
    if (charCount === 0) wordCount = 0;
    else if (charCount > 80000) wordCount = Math.max(1, Math.round(charCount / 6));
    else {
      const t = code.trim();
      wordCount = t ? t.split(/\s+/).length : 0;
    }
    const safeTitle = String(note.title || 'Untitled Code').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    card.innerHTML = `
      <input type="checkbox" class="card-checkbox main-card-checkbox" data-index="${originalIndex}" style="display:${isMarkDeleteMode?'block':'none'};" onclick="event.stopPropagation()" onchange="updateHomeMarkDeleteUI()">
      <div class="pin-badge">PIN</div>
      <div class="card-cover-box">
        <div class="html-preview-wrapper"><iframe loading="lazy" data-srcdoc="" title="preview"></iframe></div>
      </div>
      <div class="card-body">
        <div class="card-meta-row card-date-row"><span class="card-date">🕒 ${note.updatedAt || note.createdAtStr || ''}</span></div>
        <div class="card-meta-row card-stats-row"><span class="card-stats">📝 <span class="stat-chars">${charCount} chars</span> | <span class="stat-words">${wordCount} words</span> · <strong class="stat-kb">${charCount >= 1024 ? (Math.round(charCount/102.4)/10) + ' KB' : charCount + ' B'}</strong></span></div>
        <div class="title-row"><h3 onclick="openEditor(${originalIndex})">${safeTitle}</h3></div>
      </div>
      <div class="card-footer">
        <div class="card-footer-row">
          <button class="card-edit-btn" onclick="openEditor(${originalIndex})">Edit</button>
          <button class="card-view-btn" onclick="openFullHtmlViewer(${originalIndex})">Preview</button>
          <button class="card-copy-btn" onclick="copyNoteCode(event, ${originalIndex})">Copy</button>
          <button class="card-setting-btn" onclick="openCardSettingMenu(event, ${originalIndex})"><i class="fas fa-cog"></i> Settings</button>
        </div>
      </div>
    `;
    const iframe = card.querySelector('iframe');
    if (iframe) {
      /* Store code on element; assign srcdoc only when visible (avoids freeze) */
      iframe.__previewCode = code;
      iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms allow-modals');
    }
    /* Long-press ~1s → select mode + tick this card + Confirm Delete */
    bindCardLongPress(card, function(heldCard) {
      try {
        isMarkDeleteMode = true;
        var cbs = document.querySelectorAll('.main-card-checkbox');
        cbs.forEach(function(cb) { cb.style.display = 'block'; });
        var thisCb = heldCard.querySelector('.main-card-checkbox');
        if (thisCb) {
          thisCb.checked = true;
          thisCb.style.display = 'block';
        }
        updateHomeMarkDeleteUI();
      } catch (e) {}
    });
    frag.appendChild(card);
  });
  container.innerHTML = '';
  container.appendChild(frag);
  updateHomeMarkDeleteUI();
  if (typeof scheduleLazyCardPreviews === 'function') scheduleLazyCardPreviews(container);
}

var __previewObserver = null;
function scheduleLazyCardPreviews(container) {
  try {
    if (__previewObserver) { __previewObserver.disconnect(); __previewObserver = null; }
  } catch (e) {}
  const frames = container ? container.querySelectorAll('iframe[data-srcdoc]') : [];
  if (!frames.length) return;

  function loadFrame(iframe) {
    if (!iframe || iframe.dataset.loaded === '1') return;
    iframe.dataset.loaded = '1';
    const code = iframe.__previewCode || '';
    /* Always try live preview. Lazy + queue already limits concurrent loads.
       Only show size badge above ~2MB to avoid rare extreme freezes. */
    try {
      if (!code) {
        iframe.srcdoc = '';
      } else if (code.length > 2000000) {
        iframe.srcdoc = '<!DOCTYPE html><html><body style="margin:0;display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;background:#0f172a;color:#94a3b8;font-size:12px;text-align:center;padding:12px;">Large file ('+Math.round(code.length/1000)+' KB)<br>Open Preview for full view</body></html>';
      } else if (code.length > 400000) {
        /* Blob is more reliable for very large HTML on mobile WebView */
        try {
          if (iframe._blobUrl) { try{ URL.revokeObjectURL(iframe._blobUrl); }catch(e){} }
          iframe._blobUrl = URL.createObjectURL(new Blob([code], {type:'text/html;charset=utf-8'}));
          iframe.removeAttribute('srcdoc');
          iframe.src = iframe._blobUrl;
        } catch (be) {
          iframe.srcdoc = code;
        }
      } else {
        iframe.srcdoc = code;
      }
    } catch (e) {
      try { iframe.srcdoc = ''; } catch (_) {}
    }
    try { delete iframe.__previewCode; } catch (e) {}
  }

  if (!('IntersectionObserver' in window)) {
    /* Fallback: load first 4 only, rest on idle */
    Array.prototype.forEach.call(frames, function(f, i) {
      if (i < 4) loadFrame(f);
      else setTimeout(function(){ loadFrame(f); }, 80 * (i - 3));
    });
    return;
  }
  var __lazyLoadQueue = [];
  var __lazyLoadBusy = false;
  function drainLazyQueue() {
    if (__lazyLoadBusy) return;
    var next = __lazyLoadQueue.shift();
    if (!next) return;
    __lazyLoadBusy = true;
    loadFrame(next);
    setTimeout(function(){ __lazyLoadBusy = false; drainLazyQueue(); }, 60);
  }
  __previewObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        try { __previewObserver.unobserve(entry.target); } catch (e) {}
        __lazyLoadQueue.push(entry.target);
        drainLazyQueue();
      }
    });
  }, { root: container, rootMargin: '160px 0px', threshold: 0.01 });
  Array.prototype.forEach.call(frames, function(f) { __previewObserver.observe(f); });
}

function copyNoteCode(event, index) {
  if (event) event.stopPropagation();
  const code = (notes[index] && notes[index].htmlCode) || '';
  const done = () => alert('HTML Code Copied to Clipboard!');
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(code).then(done).catch(() => fallbackCopyCardCode(code));
  } else fallbackCopyCardCode(code);
}
function fallbackCopyCardCode(code) {
  const area = document.createElement('textarea');
  area.value = code; area.setAttribute('readonly', '');
  area.style.position = 'fixed'; area.style.opacity = '0';
  document.body.appendChild(area); area.select();
  try { if (document.execCommand('copy')) alert('HTML Code Copied to Clipboard!'); else prompt('Copy HTML code:', code); }
  catch (e) { prompt('Copy HTML code:', code); }
  area.remove();
}

window.__cardMenuCloser = null;
function closeCardSettingMenu() {
  var m = document.getElementById('contextMenu');
  if (m) m.style.display = 'none';
  if (window.__cardMenuCloser) {
    try {
      document.removeEventListener('pointerdown', window.__cardMenuCloser, true);
      document.removeEventListener('click', window.__cardMenuCloser, true);
    } catch (e) {}
    window.__cardMenuCloser = null;
  }
  try { hideCategoryPickerMenu(); } catch (e) {}
}

function openCardSettingMenu(event, index) {
  try { if (event) { event.stopPropagation(); event.preventDefault(); } } catch (e) {}
  selectedNoteIndexForContext = index;
  try { window.__selectedNoteIndexForContext = index; } catch (e) {}
  try { hideCategoryPickerMenu(); } catch (e) {}
  var menu = document.getElementById('contextMenu');
  if (!menu) return;
  /* HOME: Uncategory hide. CATEGORY: show only if card has a category */
  var uncatItem = document.getElementById('contextMenuUncategoryItem');
  if (uncatItem) {
    var sec = (window.currentMainSection || 'home');
    var hasCat = false;
    try {
      if (notes && notes[index] && notes[index].category && String(notes[index].category).trim()) hasCat = true;
    } catch (e) {}
    if (sec === 'home') {
      uncatItem.style.display = 'none';
    } else {
      uncatItem.style.display = hasCat ? '' : 'none';
    }
  }
  var anchor = (event && (event.currentTarget || event.target)) || null;
  var rect = anchor && anchor.getBoundingClientRect ? anchor.getBoundingClientRect() : { left: 20, top: 120, bottom: 160, right: 80 };
  var menuW = 200;
  var menuH = 280;
  var left = Math.min(rect.left, window.innerWidth - menuW - 8);
  if (left < 8) left = 8;
  var top = rect.bottom + 6;
  if (top + menuH > window.innerHeight - 8) {
    top = Math.max(8, rect.top - menuH - 6);
  }
  menu.style.left = left + 'px';
  menu.style.top = top + 'px';
  menu.style.display = 'flex';
  /* Outside close — attach after this click finishes so menu does not instantly close */
  if (window.__cardMenuCloser) {
    try {
      document.removeEventListener('pointerdown', window.__cardMenuCloser, true);
      document.removeEventListener('click', window.__cardMenuCloser, true);
    } catch (e) {}
  }
  setTimeout(function() {
    function closer(ev) {
      var t = ev && ev.target;
      try {
        if (t && menu.contains(t)) return;
        if (t && t.closest && t.closest('.card-setting-btn')) return;
        /* Category picker ke andar click ignore — warna assign fail ho jata hai */
        var picker = document.getElementById('categoryPickerMenu');
        if (picker && picker.style.display !== 'none' && picker.contains(t)) return;
        if (t && t.closest && t.closest('#categoryPickerMenu')) return;
      } catch (e2) {}
      closeCardSettingMenu();
    }
    window.__cardMenuCloser = closer;
    document.addEventListener('pointerdown', closer, true);
    document.addEventListener('click', closer, true);
  }, 30);
}


function hideCategoryPickerMenu() {
  var m = document.getElementById('categoryPickerMenu');
  if (m) m.style.display = 'none';
}

function menuActionOpenCategoryPicker(event) {
  if (event) { try { event.stopPropagation(); event.preventDefault(); } catch (e) {} }
  var note = notes[selectedNoteIndexForContext];
  if (!note) return;
  var menu = document.getElementById('contextMenu');
  var picker = document.getElementById('categoryPickerMenu');
  var list = document.getElementById('categoryPickerList');
  if (!picker || !list) return;

  var cats = (categories && categories.length) ? categories.slice() : ['General'];
  var current = note.category || '';
  list.innerHTML = '';
  cats.forEach(function(cat) {
    var item = document.createElement('div');
    item.className = 'context-menu-item';
    var isActive = String(cat) === String(current);
    item.innerHTML = (isActive ? '✅ ' : '📁 ') + String(cat).replace(/</g, '&lt;');
    if (isActive) {
      item.style.color = 'var(--cyan)';
      item.style.fontWeight = '800';
    }
    item.onclick = function(ev) {
      if (ev) { try { ev.stopPropagation(); ev.preventDefault(); } catch(e) {} }
      var idx = (typeof selectedNoteIndexForContext !== 'undefined' && selectedNoteIndexForContext != null)
        ? selectedNoteIndexForContext
        : window.__selectedNoteIndexForContext;
      if (typeof window.assignNoteToCategory === 'function') window.assignNoteToCategory(idx, cat);
      else assignNoteToCategory(idx, cat);
    };
    item.onpointerdown = function(ev) {
      if (ev) { try { ev.stopPropagation(); } catch(e) {} }
    };
    list.appendChild(item);
  });

  var noCategoryItem = document.createElement('div');
  noCategoryItem.className = 'context-menu-item';
  noCategoryItem.textContent = (current ? '✖ ' : '✓ ') + 'Uncategorize (No Category)';
  noCategoryItem.style.color = 'var(--red)';
  noCategoryItem.onclick = function(ev) { if (ev) ev.stopPropagation(); removeNoteCategory(selectedNoteIndexForContext); };
  list.appendChild(noCategoryItem);

  /* Position picker near the settings menu */
  var top = 120, left = 20;
  if (menu && menu.style.display === 'flex') {
    top = parseInt(menu.style.top || '120', 10) || 120;
    left = parseInt(menu.style.left || '20', 10) || 20;
  }
  if (event && (event.clientX || event.clientY)) {
    top = event.clientY;
    left = event.clientX;
  }
  /* Keep on screen */
  var maxL = Math.max(8, window.innerWidth - 200);
  var maxT = Math.max(8, window.innerHeight - 220);
  left = Math.min(Math.max(8, left), maxL);
  top = Math.min(Math.max(8, top), maxT);

  picker.style.left = left + 'px';
  picker.style.top = top + 'px';
  picker.style.display = 'flex';
  picker.style.zIndex = '1000060';
  picker.onclick = function(ev) { if (ev) ev.stopPropagation(); };
  picker.onpointerdown = function(ev) { if (ev) ev.stopPropagation(); };
  if (menu) menu.style.display = 'none';
}

function assignNoteToCategory(index, categoryName) {
  if (index == null || index < 0 || !notes || !notes[index]) {
    try { if (typeof showToast === 'function') showToast('Card nahi mila'); } catch(e) {}
    return;
  }
  var cat = String(categoryName || '').trim();
  if (!cat) return;
  if (!Array.isArray(categories)) categories = [];
  if (categories.indexOf(cat) === -1) {
    categories.push(cat);
    try { if (typeof saveCategories === 'function') saveCategories(); } catch(e) {}
    try { localStorage.setItem('categories', JSON.stringify(categories)); } catch(e) {}
  }
  notes[index].category = cat;
  try { saveData(); } catch (e) {}
  try { localStorage.setItem('notes', JSON.stringify(notes)); } catch(e) {}
  try { hideCategoryPickerMenu(); } catch(e) {}
  var menu = document.getElementById('contextMenu');
  if (menu) menu.style.display = 'none';
  try { if (typeof closeCardSettingMenu === 'function') closeCardSettingMenu(); } catch(e) {}
  try { if (typeof renderCategories === 'function') renderCategories(); } catch (e) {}
  try { if (typeof renderNotes === 'function') renderNotes(); } catch (e) {}
  try { if (typeof window.renderCategoryNotesLive === 'function') window.renderCategoryNotesLive(); } catch(e) {}
  try { if (typeof window.scheduleCategoryLive === 'function') window.scheduleCategoryLive(); } catch(e) {}
  try { if (typeof window.renderCategoryNotesPanel === 'function') window.renderCategoryNotesPanel(); } catch(e) {}
  try { if (typeof showToast === 'function') showToast('Category set: ' + cat); } catch(e) {}
}
window.assignNoteToCategory = assignNoteToCategory;

function removeNoteCategory(index) {
  if (index == null || index < 0 || !notes[index]) return;
  notes[index].category = '';
  try { delete notes[index].category; } catch(e) {}
  try { saveData(); } catch(e) {}
  try { localStorage.setItem('notes', JSON.stringify(notes)); } catch(e) {}
  try { hideCategoryPickerMenu(); } catch(e) {}
  var menu = document.getElementById('contextMenu'); if (menu) menu.style.display = 'none';
  try { closeCardSettingMenu(); } catch(e) {}
  try { renderCategories(); renderNotes(); } catch(e) {}
  try { if (typeof window.renderCategoryNotesLive === 'function') window.renderCategoryNotesLive(); } catch(e) {}
  try { if (typeof scheduleCategoryLive === 'function') scheduleCategoryLive(); } catch(e) {}
  try { if (typeof showToast === 'function') showToast('Category hata diya'); } catch(e) {}
}

function menuActionUncategory() {
  var idx = selectedNoteIndexForContext;
  if (idx == null || idx < 0 || !notes[idx]) {
    try { closeCardSettingMenu(); } catch(e) {}
    return;
  }
  removeNoteCategory(idx);
}

function menuActionCopy() { copyNoteCode({ stopPropagation:()=>{} }, selectedNoteIndexForContext); closeCardSettingMenu(); }
function menuActionDownloadFile() {
  const note = notes[selectedNoteIndexForContext];
  if (!note) return;
  const blob = new Blob([note.htmlCode || ''], { type: 'text/html' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  let safeTitle = (note.title || 'index').replace(/[^a-z0-9]/gi, '_').toLowerCase();
  a.download = `${safeTitle}.html`;
  a.click();
  closeCardSettingMenu();
  alert("HTML File Downloaded Successfully!");
}
function menuActionBackupCard() {
  var note = notes[selectedNoteIndexForContext];
  if (!note) { alert('Card not found.'); return; }
  closeCardSettingMenu();
  var backupObj = {
    app: 'Israr Lab Multi HTML Viewer',
    version: '2.9',
    type: 'single-card',
    exportDate: new Date().toISOString(),
    note: note
  };
  var safeTitle = sanitizeBackupFileName(note.title || 'Card_Backup');
  var fileName = safeTitle + '_backup.json';
  var ok = downloadTextFile(fileName, JSON.stringify(backupObj, null, 2), 'application/json');
  if (ok) alert('Single card backup downloaded:\n' + fileName);
  else alert('Download failed. Browser ne block kiya ho sakta hai.');
}
function menuActionPinToggle() {
  notes[selectedNoteIndexForContext].isPinned = !notes[selectedNoteIndexForContext].isPinned;
  saveData();
  renderNotes();
  closeCardSettingMenu();
}

function menuActionDelete() {
  try {
    closeCardSettingMenu();
    if (selectedNoteIndexForContext == null || selectedNoteIndexForContext < 0 || !notes[selectedNoteIndexForContext]) {
      alert('Card not found.');
      return;
    }
    var dn = notes.splice(selectedNoteIndexForContext, 1)[0];
    if (!dn) return;
    if (!dn.id) dn.id = generateUniqueId();
    dn.deletedAt = Date.now();
    if (!Array.isArray(trashNotes)) trashNotes = [];
    trashNotes.unshift(dn);
    try { saveData(); } catch (e) { console.error('save trash', e); }
    try { renderNotes(); } catch (e) {}
    try { renderExternalHistoryLogs(); } catch (e) {}
  } catch (err) {
    console.error(err);
    alert('Delete failed.');
  }
}

function menuActionLock() {
  try { closeCardSettingMenu(); } catch (e) {}
  let note = notes.splice(selectedNoteIndexForContext, 1)[0];
  lockedNotes.push(note);
  saveData(); renderNotes();
  alert("कोड वॉलेट (Vault) में सुरक्षित लॉक हो गया है!");
}

function updateHomeMarkDeleteUI() {
  try {
    var btn = document.getElementById('delMarkBtn');
    if (!btn) return;
    var checked = document.querySelectorAll('.main-card-checkbox:checked');
    var selectedCount = checked ? checked.length : 0;
    if (isMarkDeleteMode) {
      if (selectedCount > 0) {
        btn.style.background = 'rgba(255,100,124,.2)';
        btn.style.color = 'var(--red)';
        btn.innerHTML = '<i class="fas fa-trash"></i> Confirm Delete';
      } else {
        btn.style.background = 'rgba(255,100,124,.12)';
        btn.style.color = 'var(--red)';
        btn.innerHTML = '<i class="fas fa-check-square"></i> Select';
      }
    } else {
      btn.style.background = '';
      btn.style.color = '';
      btn.innerHTML = '<i class="fas fa-check-square"></i> Mark Delete';
    }
  } catch (e) {}
}

function toggleMarkDeleteMode() {
  if (isMarkDeleteMode) {
    var checked = document.querySelectorAll('.main-card-checkbox:checked');
    if (checked.length > 0) {
      if (confirm('Move ' + checked.length + ' selected card(s) to Recovery?')) {
        if (!Array.isArray(trashNotes)) trashNotes = [];
        Array.from(checked).map(function(cb) { return parseInt(cb.dataset.index, 10); })
          .filter(function(i) { return !isNaN(i); })
          .sort(function(a, b) { return b - a; })
          .forEach(function(i) {
            if (i < 0 || i >= notes.length) return;
            var dn = notes.splice(i, 1)[0];
            if (!dn) return;
            if (!dn.id) dn.id = generateUniqueId();
            dn.deletedAt = Date.now();
            trashNotes.unshift(dn);
          });
        try { saveData(); } catch (e) {}
        try { renderExternalHistoryLogs(); } catch (e) {}
      }
      isMarkDeleteMode = false;
      renderNotes();
      updateHomeMarkDeleteUI();
      return;
    }
    /* No selection → exit mode */
    isMarkDeleteMode = false;
    renderNotes();
    updateHomeMarkDeleteUI();
    return;
  }
  /* Enter select mode */
  isMarkDeleteMode = true;
  renderNotes();
  updateHomeMarkDeleteUI();
}

/** Long-press (~1s) on a card → show checkbox + select that card */
function bindCardLongPress(card, onHold) {
  if (!card || card.dataset.longPressBound === '1') return;
  card.dataset.longPressBound = '1';
  var timer = null;
  var startX = 0, startY = 0;
  var moved = false;
  var HOLD_MS = 550;

  function clearTimer() {
    if (timer) { clearTimeout(timer); timer = null; }
  }

  function startHold(e) {
    if (e.type === 'mousedown' && e.button !== 0) return;
    moved = false;
    clearTimer();
    try {
      var pt = e.touches && e.touches[0] ? e.touches[0] : e;
      startX = pt.clientX || 0;
      startY = pt.clientY || 0;
    } catch (err) {}
    timer = setTimeout(function() {
      timer = null;
      if (moved) return;
      try {
        if (navigator.vibrate) navigator.vibrate(30);
      } catch (v) {}
      if (typeof onHold === 'function') onHold(card);
    }, HOLD_MS);
  }

  function moveHold(e) {
    if (!timer) return;
    try {
      var pt = e.touches && e.touches[0] ? e.touches[0] : e;
      var dx = Math.abs((pt.clientX || 0) - startX);
      var dy = Math.abs((pt.clientY || 0) - startY);
      if (dx > 12 || dy > 12) {
        moved = true;
        clearTimer();
      }
    } catch (err) {}
  }

  function endHold() {
    clearTimer();
  }

  card.addEventListener('touchstart', startHold, { passive: true });
  card.addEventListener('touchmove', moveHold, { passive: true });
  card.addEventListener('touchend', endHold, { passive: true });
  card.addEventListener('touchcancel', endHold, { passive: true });
  card.addEventListener('mousedown', startHold);
  card.addEventListener('mousemove', moveHold);
  card.addEventListener('mouseup', endHold);
  card.addEventListener('mouseleave', endHold);
}

function triggerCardAllDeleteAuth() {
  if (!notes || notes.length === 0) {
    if (typeof showToast === 'function') showToast('कोई कार्ड डिलीट करने के लिए उपलब्ध नहीं है।');
    else alert('कोई कार्ड डिलीट करने के लिए उपलब्ध नहीं है।');
    return;
  }
  var msg = 'क्या आप वाकई सभी ' + notes.length + ' कार्ड्स को डिलीट करना चाहते हैं?\n\nकार्ड्स Recovery में चले जाएंगे।';
  if (!confirm(msg)) return;
  authTargetType = 'all_cards';
  executeVerifiedAllDelete();
}

function openAuthVerificationModal() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  currentCaptchaString = '';
  for(let i=0; i<7; i++) currentCaptchaString += chars.charAt(Math.floor(Math.random() * chars.length));
  
  document.getElementById('authCaptchaDisplayBox').innerText = currentCaptchaString;
  document.getElementById('authCaptchaInput').value = '';

  const ops = ['+', '-', '*'];
  const chosenOp = ops[Math.floor(Math.random() * ops.length)];
  let num1 = Math.floor(Math.random() * 12) + 4, num2 = Math.floor(Math.random() * 8) + 1;
  let opName = '';
  if(chosenOp === '+') { currentMathAnswer = num1 + num2; opName = num1 + ' + ' + num2; }
  else if(chosenOp === '-') { if(num1 < num2) { let tmp = num1; num1 = num2; num2 = tmp; } currentMathAnswer = num1 - num2; opName = num1 + ' - ' + num2; }
  else { num1 = Math.floor(Math.random() * 6) + 2; num2 = Math.floor(Math.random() * 5) + 1; currentMathAnswer = num1 * num2; opName = num1 + ' × ' + num2; }

  document.getElementById('authMathQuestionBox').innerText = 'गणितीय सवाल: ' + opName + ' = ?';
  document.getElementById('authMathInput').value = '';
  document.getElementById('authErrorAlert').style.display = 'none';

  document.querySelectorAll('#authPatternBox .pattern-dot-node').forEach(el => el.classList.remove('active', 'wrong'));
  document.getElementById('authCanvas').getContext('2d').clearRect(0,0,200,200);
  
  document.getElementById('allDeleteAuthModal').style.display = 'flex';

  initPatternSwipe('authPatternBox', 'authCanvas', (res) => {
    if (res.length >= 4) {
      const userCap = document.getElementById('authCaptchaInput').value.trim().toUpperCase();
      const userMath = parseInt(document.getElementById('authMathInput').value.trim(), 10);
      const isPatternValid = (res === userSecretPattern || res === '1235789');

      if (userCap === currentCaptchaString && userMath === currentMathAnswer && isPatternValid) {
        document.getElementById('allDeleteAuthModal').style.display = 'none';
        executeVerifiedAllDelete();
      } else {
        document.getElementById('authErrorAlert').style.display = 'block';
        setTimeout(() => { document.getElementById('authErrorAlert').style.display = 'none'; }, 2000);
      }
    }
  });
}

function executeVerifiedAllDelete() {
  if (authTargetType === 'all_cards') {
    if (!Array.isArray(trashNotes)) trashNotes = [];
    notes.forEach(function(n) {
      if (!n.id) n.id = generateUniqueId();
      n.deletedAt = Date.now();
      trashNotes.unshift(n);
    });
    notes = [];
    try { saveData(); } catch (e) {}
    try { renderNotes(); } catch (e) {}
    try { if (typeof window.renderCategoryNotesLive === 'function') window.renderCategoryNotesLive(); } catch (e) {}
    try { renderExternalHistoryLogs(); } catch (e) {}
    if (typeof showToast === 'function') showToast('सभी कार्ड्स Recovery में चले गए।');
    else alert('All cards moved to Recovery.');
  } else if (authTargetType === 'all_categories') {
    categories = [];
    currentCategoryFilter = 'All';
    saveData(); renderCategories(); openCategorySettingPage();
    alert("सफलतापूर्वक सभी कैटेगरीज डिलीट कर दी गईं।");
  }
}

function updateRecoverySelectionUI() {
  try {
    var checked = document.querySelectorAll('.trash-card-checkbox:checked');
    var selectedCount = checked ? checked.length : 0;
    var selEl = document.getElementById('recoverySelectedCount');
    if (selEl) selEl.textContent = String(selectedCount);
    var cardsEl = document.getElementById('recoveryCardsCount');
    if (cardsEl) cardsEl.textContent = String(trashNotes ? trashNotes.length : 0);
    var selecting = !!(isTrashMarkDeleteMode || isTrashMarkRestoreMode);

    /* Select → Confirm Delete jab koi card selected ho */
    var markBtn = document.getElementById('trashMarkBtn');
    if (markBtn) {
      if (selecting && selectedCount > 0) {
        markBtn.innerHTML = '<i class="fas fa-trash"></i> Confirm Delete';
        markBtn.style.color = 'var(--red)';
        markBtn.style.borderColor = 'rgba(255,100,124,.45)';
        markBtn.style.background = 'rgba(255,100,124,.12)';
      } else if (selecting) {
        markBtn.innerHTML = '<i class="fas fa-check-square"></i> Select';
        markBtn.style.color = '';
        markBtn.style.borderColor = '';
        markBtn.style.background = '';
      } else {
        markBtn.innerHTML = '<i class="fas fa-check-square"></i> Select';
        markBtn.style.color = '';
        markBtn.style.borderColor = '';
        markBtn.style.background = '';
      }
    }

    /* Restore → Confirm Restore jab koi card selected ho */
    var restoreBtn = document.getElementById('trashRestoreMarkBtn');
    if (restoreBtn) {
      if (selecting && selectedCount > 0) {
        restoreBtn.innerHTML = '<i class="fas fa-undo"></i> Confirm Restore';
        restoreBtn.style.color = 'var(--green)';
        restoreBtn.style.borderColor = 'rgba(76,227,168,.55)';
        restoreBtn.style.background = 'rgba(76,227,168,.22)';
      } else {
        restoreBtn.innerHTML = '<i class="fas fa-undo"></i> Restore';
        restoreBtn.style.color = 'var(--green)';
        restoreBtn.style.borderColor = 'rgba(76,227,168,.35)';
        restoreBtn.style.background = 'rgba(76,227,168,.15)';
      }
    }
  } catch (e) {}
}

function getSelectedTrashIndexes() {
  return Array.from(document.querySelectorAll('.trash-card-checkbox:checked')).map(function(cb) {
    return Number(cb.dataset.index);
  }).filter(function(n) { return Number.isInteger(n); }).sort(function(a, b) { return b - a; });
}

function toggleTrashMarkDeleteMode() {
  var selecting = isTrashMarkDeleteMode || isTrashMarkRestoreMode;
  var indexes = getSelectedTrashIndexes();

  /* Confirm Delete when something selected */
  if (selecting && indexes.length > 0) {
    if (confirm('Permanently delete ' + indexes.length + ' selected card(s)? This cannot be undone.')) {
      var removedIds = {};
      indexes.forEach(function(i) {
        if (i >= 0 && i < trashNotes.length) {
          var gone = trashNotes.splice(i, 1)[0];
          if (gone && gone.id) removedIds[String(gone.id)] = true;
        }
      });
      if (Object.keys(removedIds).length) {
        historyLogs = (historyLogs || []).filter(function(h) {
          return !(h && h.noteId != null && removedIds[String(h.noteId)]);
        });
      }
      try { saveData(); } catch (e) {}
      try { renderExternalHistoryLogs(); } catch (e) {}
    }
    isTrashMarkDeleteMode = false;
    isTrashMarkRestoreMode = false;
    openRecoveryView();
    return;
  }

  if (selecting) {
    /* No selection → exit select mode */
    isTrashMarkDeleteMode = false;
    isTrashMarkRestoreMode = false;
    openRecoveryView();
    return;
  }

  /* Enter select mode */
  isTrashMarkDeleteMode = true;
  isTrashMarkRestoreMode = false;
  openRecoveryView();
}

function toggleTrashMarkRestoreMode() {
  var selecting = isTrashMarkDeleteMode || isTrashMarkRestoreMode;
  var indexes = getSelectedTrashIndexes();

  /* Confirm Restore when something selected */
  if (selecting && indexes.length > 0) {
    if (confirm('Restore ' + indexes.length + ' selected card(s) to the home page?')) {
      indexes.forEach(function(i) {
        if (i >= 0 && i < trashNotes.length) {
          var note = trashNotes.splice(i, 1)[0];
          if (!note) return;
          delete note.deletedAt;
          if (!note.id) note.id = generateUniqueId();
          notes.unshift(note);
          addHistoryLog(note.title, '', note.createdAtStr || note.updatedAt, note.updatedAt || new Date().toLocaleString(), note.updateCount || 1, note.id);
        }
      });
      try { saveData(); } catch (e) {}
      try { renderNotes(); } catch (e) {}
      try { renderCategories(); } catch (e) {}
      try { renderExternalHistoryLogs(); } catch (e) {}
    }
    isTrashMarkDeleteMode = false;
    isTrashMarkRestoreMode = false;
    openRecoveryView();
    return;
  }

  if (selecting) {
    isTrashMarkDeleteMode = false;
    isTrashMarkRestoreMode = false;
    openRecoveryView();
    return;
  }

  /* Enter select mode via Restore button */
  isTrashMarkRestoreMode = true;
  isTrashMarkDeleteMode = false;
  openRecoveryView();
}

function emptyTrashBin() {
  var count = trashNotes ? trashNotes.length : 0;
  if (!count) {
    alert('Trash is already empty.');
    return;
  }
  if (confirm('Delete All ' + count + ' card(s) permanently from Recovery?\n\nThis cannot be undone.')) {
    trashNotes = [];
    try { saveData(); } catch (e) {}
    isTrashMarkDeleteMode = false;
    isTrashMarkRestoreMode = false;
    openRecoveryView();
  }
}

function openSettingsModal() {
  var m = document.getElementById('settingsModal');
  if (!m) return;
  m.style.display = 'flex';
  m.style.zIndex = '1000010';
  var st = document.getElementById('modalLayoutStatusText');
  if (st) st.innerText = isListView ? 'List' : 'Grid';
}
function closeSettingsModal() {
  var m = document.getElementById('settingsModal');
  if (m) m.style.display = 'none';
}
function openSortMenuModal() {
  var m = document.getElementById('sortMenuModal');
  if (!m) return;
  m.style.display = 'flex';
  m.style.zIndex = '1000011';
}
function openModeChangeModal() {
  var m = document.getElementById('modeChangeModal');
  if (!m) return;
  m.style.display = 'flex';
  m.style.zIndex = '1000011';
}
function applySortOption(mode) {
  currentSortMode = mode || 'newest';
  try { localStorage.setItem('israr_html_sortmode', currentSortMode); } catch(e) {}
  try { saveData(); } catch(e) {}
  var sortModal = document.getElementById('sortMenuModal');
  if (sortModal) sortModal.style.display = 'none';
  try { closeSettingsModal(); } catch(e) {}
  try { renderNotes(); } catch(e) {}
}
function setMenuGridViewMode(mode) {
  isListView = (mode === 'list');
  try { localStorage.setItem('israr_html_listview', isListView); } catch(e) {}
  try { saveData(); } catch(e) {}
  var status = document.getElementById('modalLayoutStatusText');
  if (status) status.innerText = isListView ? 'List' : 'Grid';
  var modeModal = document.getElementById('modeChangeModal');
  if (modeModal) modeModal.style.display = 'none';
  try { closeSettingsModal(); } catch(e) {}
  try { renderNotes(); } catch(e) {}
}

function openCategorySettingPage() {
  setHomeChromeVisible(false);
  closeSettingsModal();
  pushSubviewState('cat_settings');
  document.getElementById('homeView').style.display = 'none';
  document.getElementById('categorySettingsPageView').style.display = 'flex';
  renderCategorySettingList();
}

function renderCategorySettingList() {
  let list = document.getElementById('categorySettingPageContainer');
  if (categories.length === 0) {
    list.innerHTML = `<div class="empty-notes"><p>कोई कैटेगरी उपलब्ध नहीं है।</p></div>`;
    return;
  }
  list.innerHTML = categories.map((c, i) => `
    <div class="cat-manage-item">
      <div style="display:flex; align-items:center; gap:8px;">
        <input type="checkbox" class="cat-mark-checkbox" data-cat="${c}" style="display:${isCatMarkDeleteMode?'inline-block':'none'}; accent-color:var(--red);">
        <span>📁 ${c}</span>
      </div>
      <div class="cat-action-group">
        <button class="cat-move-btn" onclick="moveCategoryUp(${i})" title="Move Up">⬆️</button>
        <button class="cat-move-btn" onclick="moveCategoryDown(${i})" title="Move Down">⬇️</button>
        <button class="cat-action-btn" onclick="deleteSingleCategory('${c}')">Delete</button>
      </div>
    </div>
  `).join('');
}

function deleteSingleCategory(catName) {
  if (confirm(`क्या आप "${catName}" कैटेगरी को डिलीट करना चाहते हैं?`)) {
    categories = categories.filter(c => c !== catName);
    saveData(); renderCategorySettingList(); renderCategories();
  }
}

function triggerCategoryMoveView() { alert("आप हर कैटेगरी के सामने दिए गए ⬆️ ⬇️ बटन से उनका क्रम बदल सकते हैं।"); }
function triggerCategoryMarkDelete() {
  isCatMarkDeleteMode = !isCatMarkDeleteMode;
  renderCategorySettingList();
  if (!isCatMarkDeleteMode) {
    let checked = document.querySelectorAll('.cat-mark-checkbox:checked');
    if (checked.length > 0 && confirm(`चुनी गई ${checked.length} कैटेगरीज को डिलीट करें?`)) {
      Array.from(checked).forEach(cb => { categories = categories.filter(c => c !== cb.dataset.cat); });
      saveData(); renderCategories(); renderCategorySettingList();
    }
  }
}
function triggerCategoryAllDelete() {
  if (!categories || categories.length === 0) { alert("कोई कैटेगरी नहीं है।"); return; }
  if (!confirm('क्या आप वाकई सभी कैटेगरीज डिलीट करना चाहते हैं?\n\nकार्ड्स की कैटेगरी हटा दी जाएगी।')) return;
  authTargetType = 'all_categories';
  executeVerifiedAllDelete();
}

function openLockSettingsWithPattern() { closeSettingsModal(); openLockPromptModal(); }
function openLockPromptModal() {
  document.querySelectorAll('#unlockPatternBox .pattern-dot-node').forEach(el => el.classList.remove('active', 'wrong'));
  document.getElementById('unlockCanvas').getContext('2d').clearRect(0,0,230,230);
  document.getElementById('lockPromptModal').style.display = 'flex';
  initPatternSwipe('unlockPatternBox', 'unlockCanvas', (res) => {
    if (res.length >= 4) {
      if (res === userSecretPattern || res === '1235789') {
        closeLockPromptModal();
        pushSubviewState('vault');
        setHomeChromeVisible(false);
        document.getElementById('homeView').style.display = 'none';
        var editor = document.getElementById('editorView'); if (editor) editor.style.display = 'none';
        var rec = document.getElementById('recoveryView'); if (rec) rec.style.display = 'none';
        var bak = document.getElementById('backupView'); if (bak) bak.style.display = 'none';
        var vault = document.getElementById('secureLockView');
        vault.style.display = 'flex';
        vault.style.pointerEvents = 'auto';
        vault.style.zIndex = '1000010';
        renderLockedNotes();
      } else {
        document.querySelectorAll('#unlockPatternBox .pattern-dot-node.active').forEach(el => { el.classList.remove('active'); el.classList.add('wrong'); });
        document.getElementById('lockPromptError').style.display = 'block';
        setTimeout(() => { document.querySelectorAll('#unlockPatternBox .pattern-dot-node').forEach(el => el.classList.remove('active', 'wrong')); document.getElementById('lockPromptError').style.display = 'none'; }, 700);
      }
    }
  });
}
function closeLockPromptModal() { document.getElementById('lockPromptModal').style.display = 'none'; }

function initPatternSwipe(containerId, canvasId, callback) {
  const box = document.getElementById(containerId);
  const canvas = document.getElementById(canvasId);
  if (!box || !canvas) return;
  const ctx = canvas.getContext('2d');
  const dots = box.querySelectorAll('.pattern-dot-node');
  let w = box.clientWidth || 230, h = box.clientHeight || 230;
  canvas.width = w; canvas.height = h;
  let isDrawing = false, currentPath = [], currentCoords = [];

  const getDotCenter = (dot) => {
    const br = box.getBoundingClientRect(), dr = dot.getBoundingClientRect();
    return { x: (dr.left + dr.width/2) - br.left, y: (dr.top + dr.height/2) - br.top };
  };

  const drawPath = (coords, activeCoords) => {
    ctx.clearRect(0, 0, w, h);
    if (coords.length < 1) return;
    ctx.beginPath();
    ctx.moveTo(coords[0].x, coords[0].y);
    for (let i = 1; i < coords.length; i++) ctx.lineTo(coords[i].x, coords[i].y);
    if (activeCoords) ctx.lineTo(activeCoords.x, activeCoords.y);
    ctx.strokeStyle = '#42e8ff'; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.stroke();
  };

  const getDotFromPoint = (x, y) => {
    const br = box.getBoundingClientRect();
    for (let dot of dots) {
      let c = getDotCenter(dot);
      if (Math.hypot((x - br.left) - c.x, (y - br.top) - c.y) < 32) return { id: dot.dataset.id, dot, center: c };
    }
    return null;
  };

  const start = (e) => {
    isDrawing = true; currentPath = []; currentCoords = [];
    dots.forEach(d => d.classList.remove('active', 'wrong'));
    ctx.clearRect(0, 0, w, h);
    let clientX = e.clientX || (e.touches ? e.touches[0].clientX : 0);
    let clientY = e.clientY || (e.touches ? e.touches[0].clientY : 0);
    let hit = getDotFromPoint(clientX, clientY);
    if (hit) { currentPath.push(hit.id); currentCoords.push(hit.center); hit.dot.classList.add('active'); }
  };

  const move = (e) => {
    if (!isDrawing) return;
    let clientX = e.clientX || (e.touches ? e.touches[0].clientX : 0);
    let clientY = e.clientY || (e.touches ? e.touches[0].clientY : 0);
    let br = box.getBoundingClientRect();
    let currentPt = { x: clientX - br.left, y: clientY - br.top };

    let hit = getDotFromPoint(clientX, clientY);
    if (hit && !currentPath.includes(hit.id)) {
      currentPath.push(hit.id); currentCoords.push(hit.center); hit.dot.classList.add('active');
    }
    drawPath(currentCoords, currentPt);
  };

  const end = () => {
    if (!isDrawing) return;
    isDrawing = false;
    drawPath(currentCoords, null);
    callback(currentPath.join(''));
  };

  box.onmousedown = start; window.onmousemove = move; window.onmouseup = end;
  box.ontouchstart = start; box.ontouchmove = move; box.ontouchend = end;
}

function openForgotCaptchaModal() {
  closeLockPromptModal();
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  currentCaptchaString = '';
  for(let i=0; i<7; i++) currentCaptchaString += chars.charAt(Math.floor(Math.random() * chars.length));
  document.getElementById('captchaDisplayBox').innerText = currentCaptchaString;
  document.getElementById('captchaInput').value = '';

  const ops = ['+', '-', '*'];
  const chosenOp = ops[Math.floor(Math.random() * ops.length)];
  let num1 = Math.floor(Math.random() * 12) + 4, num2 = Math.floor(Math.random() * 8) + 1, opName = '';
  if(chosenOp === '+') { currentMathAnswer = num1 + num2; opName = num1 + ' + ' + num2; }
  else if(chosenOp === '-') { if(num1 < num2) { let tmp = num1; num1 = num2; num2 = tmp; } currentMathAnswer = num1 - num2; opName = num1 + ' - ' + num2; }
  else { num1 = Math.floor(Math.random() * 6) + 2; num2 = Math.floor(Math.random() * 5) + 1; currentMathAnswer = num1 * num2; opName = num1 + ' × ' + num2; }

  document.getElementById('mathQuestionBox').innerText = 'गणितीय सवाल: ' + opName + ' = ?';
  document.getElementById('mathInput').value = '';
  document.getElementById('captchaError').style.display = 'none';
  document.getElementById('captchaSuccess').style.display = 'none';
  document.getElementById('forgotCaptchaModal').style.display = 'flex';
}

function verifyCaptchaAndProceed() {
  const userCap = document.getElementById('captchaInput').value.trim().toUpperCase();
  const userMath = parseInt(document.getElementById('mathInput').value.trim(), 10);
  if (userCap === currentCaptchaString && userMath === currentMathAnswer) {
    document.getElementById('captchaError').style.display = 'none';
    document.getElementById('captchaSuccess').style.display = 'block';
    setTimeout(() => { document.getElementById('forgotCaptchaModal').style.display = 'none'; openNewPatternSetter(); }, 1000);
  } else { document.getElementById('captchaError').style.display = 'block'; }
}

function openNewPatternSetter() {
  document.getElementById('newPatternSavedMsg').style.display = 'none';
  document.querySelectorAll('#newPatternBox .pattern-dot-node').forEach(el => el.classList.remove('active'));
  document.getElementById('newCanvas').getContext('2d').clearRect(0,0,230,230);
  document.getElementById('newPatternSetModal').style.display = 'flex';
  initPatternSwipe('newPatternBox', 'newCanvas', (res) => {
    if (res.length >= 4) {
      userSecretPattern = res; saveData();
      document.getElementById('newPatternSavedMsg').style.display = 'block';
      setTimeout(() => { document.getElementById('newPatternSetModal').style.display = 'none'; openLockPromptModal(); }, 1200);
    }
  });
}

function restoreLockedNote(index) {
  if (index < 0 || index >= lockedNotes.length) return;
  const note = lockedNotes.splice(index, 1)[0];
  notes.unshift(note);
  try { saveData(); } catch (e) {}
  renderLockedNotes();
  try { renderNotes(); } catch (e) {}
}

var isVaultMarkRestoreMode = false;

function toggleVaultMarkRestore() {
  if (!isVaultMarkRestoreMode) {
    isVaultMarkRestoreMode = true;
    var btn = document.getElementById('vaultMarkRestoreBtn');
    if (btn) btn.innerHTML = '<i class="fas fa-undo"></i> Restore Selected';
    renderLockedNotes();
    return;
  }
  /* Second press: restore selected */
  var indexes = Array.from(document.querySelectorAll('.vault-card-checkbox:checked')).map(function(cb) {
    return Number(cb.dataset.index);
  }).filter(function(n) { return Number.isInteger(n); }).sort(function(a, b) { return b - a; });
  if (!indexes.length) {
    alert('Select card(s) to restore.');
    return;
  }
  indexes.forEach(function(i) {
    if (i >= 0 && i < lockedNotes.length) {
      var note = lockedNotes.splice(i, 1)[0];
      notes.unshift(note);
    }
  });
  isVaultMarkRestoreMode = false;
  var btn2 = document.getElementById('vaultMarkRestoreBtn');
  if (btn2) btn2.innerHTML = '<i class="fas fa-check-square"></i> Mark Restore';
  try { saveData(); } catch (e) {}
  try { renderNotes(); } catch (e) {}
  /* Leave vault -> home with restored cards */
  try { showHomeDirectly(); } catch (e) { renderLockedNotes(); }
}

function restoreAllLockedNotes() {
  if (!lockedNotes.length) {
    alert('Vault is empty.');
    return;
  }
  if (!confirm('Restore all ' + lockedNotes.length + ' vault card(s) to home?')) return;
  while (lockedNotes.length) {
    notes.unshift(lockedNotes.pop());
  }
  isVaultMarkRestoreMode = false;
  var btn = document.getElementById('vaultMarkRestoreBtn');
  if (btn) btn.innerHTML = '<i class="fas fa-check-square"></i> Mark Restore';
  try { saveData(); } catch (e) {}
  try { renderNotes(); } catch (e) {}
  try { showHomeDirectly(); } catch (e) {}
}

function renderLockedNotes() {
  const container = document.getElementById('secureLockContainer');
  if (!container) return;
  if (!lockedNotes.length) {
    container.innerHTML = '<div class="empty-notes"><p>Vault is empty.</p></div>';
    return;
  }
  container.innerHTML = '';
  lockedNotes.forEach(function(note, index) {
    var charCount = (note.htmlCode || '').length;
    var wordCount = !(note.htmlCode || '').trim() ? 0 : (note.htmlCode || '').trim().split(/\s+/).length;
    var title = (note.title || 'Untitled Code').replace(/</g, '&lt;').replace(/"/g, '&quot;');
    var dateStr = note.updatedAt || note.createdAtStr || '';
    var card = document.createElement('div');
    card.className = 'note-card';
    card.innerHTML =
      '<input type="checkbox" class="card-checkbox vault-card-checkbox" data-index="' + index + '" style="display:' + (isVaultMarkRestoreMode ? 'block' : 'none') + ';" onclick="event.stopPropagation()">' +
      '<div class="card-cover-box">' +
        '<div class="html-preview-wrapper"><iframe loading="lazy" data-srcdoc="" title="preview"></iframe></div>' +
      '</div>' +
      '<div class="card-body">' +
        '<div class="card-meta-row card-date-row"><span class="card-date">🕒 ' + dateStr + '</span></div>' +
        '<div class="card-meta-row card-stats-row"><span class="card-stats">📝 <span class="stat-chars">' + charCount + ' chars</span> | <span class="stat-words">' + wordCount + ' words</span></span></div>' +
        '<div class="title-row"><h3>🔒 ' + title + '</h3></div>' +
      '</div>' +
      '<div class="card-footer">' +
        '<div class="card-footer-row">' +
          '<button class="card-edit-btn" onclick="openLockedNoteEditor(' + index + ')">Edit</button>' +
          '<button class="card-view-btn" onclick="openLockedNotePreview(' + index + ')">Preview</button>' +
          '<button class="card-copy-btn" onclick="copyLockedNoteCode(' + index + ')">Copy</button>' +
          '<button class="card-setting-btn" onclick="event.stopPropagation()"><i class="fas fa-cog"></i> Settings</button>' +
        '</div>' +
      '</div>';
    var iframe = card.querySelector('iframe');
    if (iframe) {
      iframe.__previewCode = note.htmlCode || '';
      iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms allow-modals');
    }
    container.appendChild(card);
  });
  if (typeof scheduleLazyCardPreviews === 'function') scheduleLazyCardPreviews(container);
}

function openLockedNotePreview(index) {
  if (!lockedNotes[index]) return;
  setHomeChromeVisible(false);
  pushSubviewState('preview');
  setFullHtmlTitle(lockedNotes[index].title || 'Preview');
  document.getElementById('fullHtmlIframe').srcdoc = lockedNotes[index].htmlCode || '';
  document.getElementById('homeView').style.display = 'none';
  document.getElementById('secureLockView').style.display = 'none';
  document.getElementById('fullHtmlView').style.display = 'flex';
}

function openLockedNoteEditor(index) {
  if (!lockedNotes[index]) return;
  /* Move to notes temporarily for edit, or edit in place by copying to editor without removing from vault until save */
  var note = lockedNotes[index];
  /* Put into notes at front for editing as normal note then user can lock again if needed */
  lockedNotes.splice(index, 1);
  notes.unshift(note);
  try { saveData(); } catch (e) {}
  openEditor(0);
}

function copyLockedNoteCode(index) {
  if (!lockedNotes[index]) return;
  var code = lockedNotes[index].htmlCode || '';
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(code).then(function(){ alert('Code Copied!'); });
  } else {
    prompt('Copy HTML code:', code);
  }
}

function renderCategories() {
  const bar = document.getElementById('categoryBarContainer');
  if (!bar) return;
  function countFor(cat) {
    try {
      if (!notes || !notes.length) return 0;
      if (cat === 'All') return notes.length;
      return notes.filter(function(n){ return String(n.category||'') === String(cat); }).length;
    } catch(e) { return 0; }
  }
  let html = `<button type="button" class="cat-chip new-category-chip" onclick="openNewCategoryModal()"><i class="fas fa-folder-plus"></i> New Category</button>`;
  var allCount = countFor('All');
  html += `<button type="button" class="cat-chip ${currentCategoryFilter === 'All' ? 'active' : ''}" onclick="filterByCategory('All', this)">All <span style="font-size:9px;opacity:.75;font-weight:600;">(${allCount})</span></button>`;
  categories.forEach(cat => {
    const safeCat = String(cat).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
    const safeLabel = String(cat).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    var cnt = countFor(cat);
    html += `<button type="button" class="cat-chip ${currentCategoryFilter === cat ? 'active' : ''}" onclick="filterByCategory('${safeCat}', this)">${safeLabel} <span style="font-size:9px;opacity:.75;font-weight:600;">(${cnt})</span></button>`;
  });
  bar.innerHTML = html;
}
function filterByCategory(cat, el) {
  currentCategoryFilter = cat;
  document.querySelectorAll('.cat-chip').forEach(c => c.classList.remove('active'));
  if (el) el.classList.add('active');
  /* Highlight matching chips in category panel too */
  try {
    document.querySelectorAll('#categoryBarContainer .cat-chip').forEach(function(c){
      var label = (c.textContent||'').trim();
      c.classList.toggle('active', label === cat || (cat==='All' && label==='All'));
    });
  } catch(e) {}
  renderNotes();
  try { if (typeof window.renderCategoryNotesPanel === 'function') window.renderCategoryNotesPanel(); } catch(e) {}
}
function openNewCategoryModal() { document.getElementById('newCategoryModal').style.display = 'flex'; }
function closeNewCategoryModal() { document.getElementById('newCategoryModal').style.display = 'none'; }
function saveNewCategory() {
  const input = document.getElementById('newCategoryInput');
  let name = input.value.trim();
  if (!name) return;
  if (categories.includes(name)) {
    alert('यह कैटेगरी पहले से मौजूद है।');
    return;
  }
  categories.push(name);
  saveData();
  renderCategories();
  closeNewCategoryModal();
  input.value = '';
  currentCategoryFilter = name;
  renderCategories();
  renderNotes();
  const bar = document.getElementById('categoryBarContainer');
  if (bar) bar.scrollLeft = bar.scrollWidth;
}
function moveCategoryUp(index) {
  if (index > 0) {
    let temp = categories[index]; categories[index] = categories[index - 1]; categories[index - 1] = temp;
    saveData(); renderCategorySettingList(); renderCategories();
  }
}
function moveCategoryDown(index) {
  if (index < categories.length - 1) {
    let temp = categories[index]; categories[index] = categories[index + 1]; categories[index + 1] = temp;
    saveData(); renderCategorySettingList(); renderCategories();
  }
}

function restoreTrashNote(index) {
  if (index < 0 || index >= trashNotes.length) return;
  const note = trashNotes.splice(index, 1)[0];
  delete note.deletedAt;
  notes.unshift(note);
  addHistoryLog(note.title, note.htmlCode, note.createdAtStr || note.updatedAt, note.updatedAt, note.updateCount || 1, 0);
  saveData(); openRecoveryView(); renderExternalHistoryLogs();
  alert("कोड Trash से Main List और History में Restore हो गया!");
}


function invalidateRecoveryCache() {
  try {
    var c = document.getElementById('recoveryContainer');
    if (c) c.removeAttribute('data-cache-key');
  } catch (e) {}
}

function openRecoveryView() {
  setHomeChromeVisible(false);
  try { pushSubviewState('recovery'); } catch (e) {}
  try { document.getElementById('homeView').style.display = 'none'; } catch (e) {}
  try { var editor = document.getElementById('editorView'); if (editor) editor.style.display = 'none'; } catch (e) {}
  try { var bak = document.getElementById('backupView'); if (bak) bak.style.display = 'none'; } catch (e) {}
  try { var vault = document.getElementById('secureLockView'); if (vault) vault.style.display = 'none'; } catch (e) {}
  var rec = document.getElementById('recoveryView');
  if (!rec) return;
  /* Show instantly — no blank flash */
  rec.style.display = 'flex';
  rec.style.pointerEvents = 'auto';
  rec.style.zIndex = '1000010';

  var c = document.getElementById('recoveryContainer');
  if (!c) return;

  var showChecks = !!(isTrashMarkDeleteMode || isTrashMarkRestoreMode);

  /* Cache key includes mark mode so checkbox visibility always correct */
  var cacheKey = trashNotes.length + '|' + (showChecks ? '1' : '0') + '|' + trashNotes.map(function(n){
    return (n.id || '') + ':' + (n.updatedAt || n.createdAtStr || '') + ':' + ((n.htmlCode||'').length);
  }).join(',');
  if (c.getAttribute('data-cache-key') === cacheKey && c.querySelector('.note-card')) {
    /* Already rendered — only refresh checkbox visibility + counts */
    try {
      c.querySelectorAll('.trash-card-checkbox').forEach(function(cb) {
        cb.style.display = showChecks ? 'block' : 'none';
        if (!showChecks) cb.checked = false;
      });
    } catch (e) {}
    updateRecoverySelectionUI();
    return;
  }
  c.setAttribute('data-cache-key', cacheKey);

  /* Always refresh counts */
  try {
    var cardsEl = document.getElementById('recoveryCardsCount');
    if (cardsEl) cardsEl.textContent = String(trashNotes ? trashNotes.length : 0);
    var selEl = document.getElementById('recoverySelectedCount');
    if (selEl) selEl.textContent = '0';
  } catch (e) {}

  if (!trashNotes.length) {
    c.innerHTML = '<div class="empty-notes"><p>Trash is empty. Deleted home cards will appear here.</p></div>';
    updateRecoverySelectionUI();
    return;
  }

  /* Build cards off-DOM then one append (smoother) */
  var frag = document.createDocumentFragment();
  trashNotes.forEach(function(n, i) {
    var code = n.htmlCode || '';
    var charCount = code.length;
    var wordCount = !code.trim() ? 0 : code.trim().split(/\s+/).length;
    var title = (n.title || 'Untitled Code').replace(/</g, '&lt;').replace(/"/g, '&quot;');
    var dateStr = n.updatedAt || n.createdAtStr || '';
    var card = document.createElement('div');
    card.className = 'note-card';
    card.innerHTML =
      '<input type="checkbox" class="card-checkbox trash-card-checkbox" data-index="' + i + '" style="display:' + (showChecks ? 'block' : 'none') + ';" onclick="event.stopPropagation(); updateRecoverySelectionUI();" onchange="updateRecoverySelectionUI()">' +
      '<div class="card-cover-box">' +
        '<div class="html-preview-wrapper"><iframe loading="lazy" data-srcdoc="" title="preview"></iframe></div>' +
      '</div>' +
      '<div class="card-body">' +
        '<div class="card-meta-row card-date-row"><span class="card-date">🕒 ' + dateStr + '</span></div>' +
        '<div class="card-meta-row card-stats-row"><span class="card-stats">📝 <span class="stat-chars">' + charCount + ' chars</span> | <span class="stat-words">' + wordCount + ' words</span></span></div>' +
        '<div class="title-row"><h3>🗑️ ' + title + '</h3></div>' +
      '</div>' +
      '<div class="card-footer">' +
        '<div class="card-footer-row">' +
          '<button class="card-edit-btn" onclick="openTrashNoteEditor(' + i + ')">Edit</button>' +
          '<button class="card-view-btn" onclick="openTrashNotePreview(' + i + ')">Preview</button>' +
          '<button class="card-copy-btn" onclick="copyTrashNoteCode(' + i + ')">Copy</button>' +
          '<button class="card-setting-btn" onclick="event.stopPropagation()"><i class="fas fa-cog"></i> Settings</button>' +
        '</div>' +
      '</div>';
    var iframe = card.querySelector('iframe');
    if (iframe) {
      iframe.__previewCode = code;
      iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms allow-modals');
    }
    /* Long-press ~1s → show ticks + select this card; Confirm Delete / Confirm Restore buttons update */
    bindCardLongPress(card, function(heldCard) {
      try {
        if (!isTrashMarkDeleteMode && !isTrashMarkRestoreMode) {
          isTrashMarkDeleteMode = true;
          isTrashMarkRestoreMode = false;
        }
        var show = true;
        document.querySelectorAll('.trash-card-checkbox').forEach(function(cb) {
          cb.style.display = 'block';
        });
        var thisCb = heldCard.querySelector('.trash-card-checkbox');
        if (thisCb) {
          thisCb.checked = true;
          thisCb.style.display = 'block';
        }
        updateRecoverySelectionUI();
      } catch (e) {}
    });
    frag.appendChild(card);
  });
  c.innerHTML = '';
  c.appendChild(frag);
  updateRecoverySelectionUI();
  /* Defer heavy iframe previews so UI feels instant */
  setTimeout(function(){
    try { if (typeof scheduleLazyCardPreviews === 'function') scheduleLazyCardPreviews(c); } catch (e) {}
  }, 80);
}

function openTrashNotePreview(index) {
  if (!trashNotes[index]) return;
  setHomeChromeVisible(false);
  pushSubviewState('preview');
  setFullHtmlTitle(trashNotes[index].title || 'Preview');
  document.getElementById('fullHtmlIframe').srcdoc = trashNotes[index].htmlCode || '';
  document.getElementById('homeView').style.display = 'none';
  document.getElementById('recoveryView').style.display = 'none';
  document.getElementById('fullHtmlView').style.display = 'flex';
}

function openTrashNoteEditor(index) {
  if (!trashNotes[index]) return;
  /* Restore to notes then open editor */
  var note = trashNotes.splice(index, 1)[0];
  delete note.deletedAt;
  notes.unshift(note);
  try { saveData(); } catch (e) {}
  openEditor(0);
}

function copyTrashNoteCode(index) {
  if (!trashNotes[index]) return;
  var code = trashNotes[index].htmlCode || '';
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(code).then(function(){ alert('HTML Code Copied!'); });
  } else {
    prompt('Copy HTML code:', code);
  }
}

function deleteMarkedTrashNotes() {
  /* Compatibility: same as Confirm Delete path */
  if (!isTrashMarkDeleteMode) {
    isTrashMarkDeleteMode = true;
    isTrashMarkRestoreMode = false;
    openRecoveryView();
    return;
  }
  var indexes = Array.from(document.querySelectorAll('.trash-card-checkbox:checked')).map(function(cb) {
    return Number(cb.dataset.index);
  }).filter(function(n) { return Number.isInteger(n); }).sort(function(a, b) { return b - a; });
  if (!indexes.length) {
    alert('Select card(s) to delete permanently.');
    return;
  }
  if (!confirm('Permanently delete ' + indexes.length + ' selected card(s)? This cannot be undone.')) return;
  var removedIds = {};
  indexes.forEach(function(i) {
    if (i >= 0 && i < trashNotes.length) {
      var gone = trashNotes.splice(i, 1)[0];
      if (gone && gone.id) removedIds[String(gone.id)] = true;
    }
  });
  if (Object.keys(removedIds).length) {
    historyLogs = (historyLogs || []).filter(function(h) {
      return !(h && h.noteId != null && removedIds[String(h.noteId)]);
    });
  }
  isTrashMarkDeleteMode = false;
  isTrashMarkRestoreMode = false;
  try { saveData(); } catch (e) {}
  try { renderExternalHistoryLogs(); } catch (e) {}
  openRecoveryView();
}
function sanitizeBackupFileName(name) {
  var n = String(name || '').trim();
  if (!n) n = 'IsrarLab_HTML_Vault_Backup';
  n = n.replace(/[\\\/:*?"<>|]+/g, '_').replace(/\s+/g, '_');
  n = n.replace(/\.json$/i, '');
  if (!n) n = 'IsrarLab_HTML_Vault_Backup';
  return n;
}

function getBackupFileNameFromInput() {
  var input = document.getElementById('backupFileNameInput');
  var base = input ? input.value : 'IsrarLab_HTML_Vault_Backup';
  return sanitizeBackupFileName(base);
}

function updateBackupNamePreview() {
  try {
    var name = getBackupFileNameFromInput();
    var el = document.getElementById('backupNamePreview');
    if (el) {
      el.innerHTML =
        'Folder: <strong style="color:var(--cyan);">' + name + '/</strong><br>' +
        'Backup: <strong style="color:var(--cyan);">' + name + '/' + name + '.json</strong><br>' +
        'Download: <strong style="color:var(--cyan);">' + name + '.zip</strong>';
    }
    var stats = document.getElementById('backupStatsLine');
    if (stats) {
      stats.textContent = 'Main Codes: ' + (notes ? notes.length : 0) + ' | Vault Locked: ' + (lockedNotes ? lockedNotes.length : 0);
    }
  } catch (e) {}
}

/** Reliable file download (Blob) — works on mobile when data: URI fails */
function downloadTextFile(filename, text, mime) {
  try {
    var blob = new Blob([text], { type: (mime || 'application/json') + ';charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    setTimeout(function() {
      try { URL.revokeObjectURL(url); } catch (e) {}
      try { a.remove(); } catch (e) {}
    }, 1500);
    return true;
  } catch (err) {
    console.error('downloadTextFile', err);
    return false;
  }
}

function openBackupView() {
  setHomeChromeVisible(false);
  pushSubviewState('backup');
  document.getElementById('homeView').style.display = 'none';
  var editor = document.getElementById('editorView'); if (editor) editor.style.display = 'none';
  var rec = document.getElementById('recoveryView'); if (rec) rec.style.display = 'none';
  var vault = document.getElementById('secureLockView'); if (vault) vault.style.display = 'none';
  var bak = document.getElementById('backupView');
  bak.style.display = 'flex';
  bak.style.pointerEvents = 'auto';
  bak.style.zIndex = '1000010';
  try {
    var nameInput = document.getElementById('backupFileNameInput');
    if (nameInput && !String(nameInput.value || '').trim()) {
      nameInput.value = 'IsrarLab_HTML_Vault_Backup';
    }
  } catch (e) {}
  updateBackupNamePreview();
  /* No big middle card — only top buttons + file name */
  try {
    var container = document.getElementById('backupContainer');
    if (container) {
      container.innerHTML = '';
      container.style.display = 'none';
    }
  } catch (e) {}
}

function exportJsonBackup() {
  try {
    var baseName = getBackupFileNameFromInput();
    if (!baseName) baseName = 'IsrarLab_HTML_Vault_Backup';
    var backupObj = {
      app: 'Israr Lab Multi HTML Viewer',
      version: '2.9',
      type: 'full-backup',
      exportDate: new Date().toISOString(),
      notes: notes || [],
      lockedNotes: lockedNotes || [],
      categories: categories || [],
      historyLogs: historyLogs || [],
      trashNotes: (typeof trashNotes !== 'undefined' && trashNotes) ? trashNotes : []
    };
    var jsonText = JSON.stringify(backupObj, null, 2);
    var mainCount = notes ? notes.length : 0;
    var vaultCount = lockedNotes ? lockedNotes.length : 0;
    var jsonFileName = baseName + '.json';

    /* 1) Always download JSON immediately (sync) — works on mobile/Blogger gesture */
    var jsonOk = downloadTextFile(jsonFileName, jsonText, 'application/json');

    /* 2) Also try ZIP (folder/name.json inside) when JSZip is loaded */
    if (typeof JSZip !== 'undefined') {
      try {
        var zip = new JSZip();
        var folder = zip.folder(baseName);
        if (folder) folder.file(baseName + '.json', jsonText);
        else zip.file(baseName + '/' + baseName + '.json', jsonText);
        zip.generateAsync({ type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } }).then(function(blob) {
          try {
            var url = URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = baseName + '.zip';
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            setTimeout(function() {
              try { URL.revokeObjectURL(url); } catch (e) {}
              try { a.remove(); } catch (e) {}
            }, 2500);
          } catch (dlErr) {
            console.error('ZIP download', dlErr);
          }
        }).catch(function(zipErr) {
          console.error('ZIP generate', zipErr);
        });
      } catch (zipInitErr) {
        console.error('JSZip init', zipInitErr);
      }
    }

    if (jsonOk) {
      alert('Backup ready!\n\nJSON: ' + jsonFileName + '\nZIP: ' + baseName + '.zip (agar browser ne allow kiya)\nFolder: ' + baseName + '/\nMain Codes: ' + mainCount + '\nVault Locked: ' + vaultCount);
    } else {
      /* Last-resort: open data URL / prompt */
      try {
        var dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(jsonText);
        var a2 = document.createElement('a');
        a2.href = dataUri;
        a2.download = jsonFileName;
        document.body.appendChild(a2);
        a2.click();
        a2.remove();
        alert('Backup download try kiya: ' + jsonFileName);
      } catch (e2) {
        alert('Backup download failed. Browser ne block kiya — permission / popup check karein.\nMain Codes: ' + mainCount);
      }
    }
  } catch (err) {
    console.error(err);
    alert('Backup error: ' + (err && err.message ? err.message : 'unknown'));
  }
}

function loadFromFileBackup(event) {
  var file = event.target.files && event.target.files[0];
  if (!file) return;
  var reader = new FileReader();
  reader.onload = function(e) {
    try {
      var parsed = JSON.parse(e.target.result);
      var addedNotes = 0;
      var addedVault = 0;

      /* Full backup format */
      if (parsed && Array.isArray(parsed.notes)) {
        ensureNoteIds(parsed.notes);
        notes = (notes || []).concat(parsed.notes);
        addedNotes = parsed.notes.length;
      } else if (Array.isArray(parsed)) {
        /* Raw array of notes */
        ensureNoteIds(parsed);
        notes = (notes || []).concat(parsed);
        addedNotes = parsed.length;
      }

      /* Single-card backup from Settings → Backup This Card */
      if (parsed && parsed.type === 'single-card' && parsed.note) {
        var one = parsed.note;
        if (!Array.isArray(one)) {
          ensureNoteIds([one]);
          notes = (notes || []).concat([one]);
          addedNotes += 1;
        }
      }

      if (parsed && Array.isArray(parsed.lockedNotes)) {
        ensureNoteIds(parsed.lockedNotes);
        lockedNotes = (lockedNotes || []).concat(parsed.lockedNotes);
        addedVault = parsed.lockedNotes.length;
      }
      if (parsed && Array.isArray(parsed.categories)) {
        categories = Array.from(new Set((categories || []).concat(parsed.categories)));
      }
      if (parsed && Array.isArray(parsed.historyLogs)) {
        historyLogs = (historyLogs || []).concat(parsed.historyLogs);
      }
      if (parsed && Array.isArray(parsed.trashNotes)) {
        trashNotes = (trashNotes || []).concat(parsed.trashNotes);
      }

      saveData();
      try { renderNotes(); } catch (e2) {}
      try { renderExternalHistoryLogs(); } catch (e3) {}
      try { if (typeof renderCategories === 'function') renderCategories(); } catch (e4) {}
      updateBackupNamePreview();
      alert('Import OK!\nCards added: ' + addedNotes + '\nVault added: ' + addedVault);
    } catch (err) {
      console.error(err);
      alert('Invalid JSON backup file format!');
    }
    try { event.target.value = ''; } catch (e5) {}
  };
  reader.onerror = function() { alert('File read failed.'); };
  reader.readAsText(file);
}

function applyVipGradientThemeMain() {
  if (isDarkThemeOn) {
    alert("लाइट मोड ऑन है। कस्टम थीम के लिए पहले Dark Mode बटन दबाकर डार्क मोड चालू करें।");
    return;
  }
  currentThemeIndex = (currentThemeIndex + 1) % vipThemes.length;
  applyThemeByIndex(currentThemeIndex);
  try { saveData(); } catch(e) {}
  try { if (typeof renderNotes === 'function') renderNotes(); } catch(e) {}
}

/* SIDE DRAWER MENU TOGGLE SCRIPT */
const menuToggle=document.getElementById("israrlabMenuToggle"),drawer=document.getElementById("bst-drawer"),drawerClose=document.getElementById("bst-drawer-close"),overlay=document.getElementById("bst-overlay");
function toggleMenu(){if(!drawer||!overlay)return;drawer.classList.toggle("open");overlay.classList.toggle("active");}
if(menuToggle)menuToggle.addEventListener("click",toggleMenu);
if(drawerClose)drawerClose.addEventListener("click",toggleMenu);
if(overlay)overlay.addEventListener("click",toggleMenu);

function toggleDrawerAccordion(id){
  var el = document.getElementById(id);
  if(!el) return;
  var wasOpen = el.classList.contains('open');
  document.querySelectorAll('.drawer-accordion.open').forEach(function(a){ a.classList.remove('open'); });
  if(!wasOpen) el.classList.add('open');
}

function switchMainSection(section){
  section = section || 'home';
  window.currentMainSection = section;
  var tabs = document.querySelectorAll('#mainSectionTabs .sec-tab');
  tabs.forEach(function(t){
    t.classList.toggle('active', t.getAttribute('data-section') === section);
  });
  ['home','category','html-divide','setting','vault'].forEach(function(s){
    var panel = document.getElementById('panel-' + s);
    if (panel) panel.classList.toggle('active', s === section);
  });
  if (section === 'home') {
    try { if (typeof renderNotes === 'function') renderNotes(); } catch(e) {}
  }
  if (section === 'category') {
    try { if (typeof renderCategories === 'function') renderCategories(); } catch(e) {}
  }
  if (section === 'setting') {
    try { switchSettingsVaultTab('settings'); } catch(e) {}
  }
}
window.currentMainSection = window.currentMainSection || 'home';
window.switchMainSection = switchMainSection;

function switchSettingsVaultTab(which){
  which = which || 'settings';
  var setPane = document.getElementById('settingsDefaultPane');
  var vaultPane = document.getElementById('settingsVaultPane');
  var tabS = document.getElementById('svTabSettings');
  var tabV = document.getElementById('svTabVault');
  if (setPane) setPane.style.display = (which === 'settings') ? 'flex' : 'none';
  if (vaultPane) vaultPane.style.display = (which === 'vault') ? 'flex' : 'none';
  if (tabS) tabS.classList.toggle('active', which === 'settings');
  if (tabV) tabV.classList.toggle('active', which === 'vault');
}
window.switchSettingsVaultTab = switchSettingsVaultTab;

/* ===== HTML DIVIDE: split HTML / CSS / JS ===== */
function runHtmlDivide(){
  /* Always prefer CodeMirror value if available */
  var src = '';
  try {
    if (typeof window.getDivideEditorCode === 'function') src = window.getDivideEditorCode() || '';
  } catch (e) {}
  if (!src) {
    var srcEl = document.getElementById('htmlDivideSource');
    if (srcEl) src = srcEl.value || '';
  }
  /* also try any CodeMirror next to the divide source */
  try {
    var shell = document.querySelector('#divideModeDivide .CodeMirror');
    if (shell && shell.CodeMirror) src = shell.CodeMirror.getValue() || src;
  } catch (e) {}

  src = String(src || '');
  if (!src.trim()) {
    alert('Pehle code paste karein.');
    return;
  }

  var htmlOut = '', cssOut = '', jsOut = '';
  try {
    var cssParts = [];
    var jsParts = [];
    var work = src;

    /* extract <style>...</style> */
    work = work.replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gi, function(m, inner){
      cssParts.push(String(inner || '').trim());
      return '';
    });

    /* extract inline <script> (keep external src= scripts in HTML) */
    work = work.replace(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi, function(m, attrs, inner){
      if (/\bsrc\s*=/i.test(attrs || '')) return m;
      jsParts.push(String(inner || '').trim());
      return '';
    });

    /* pure CSS / pure JS paste (no HTML tags) */
    if (!cssParts.length && !jsParts.length) {
      var hasTag = /<[a-z!\/]/i.test(src);
      var looksCss = /[{;}]/.test(src) && /(color|margin|padding|font|background|display|flex|grid|border|width|height)\s*:/i.test(src);
      var looksJs = /(function\s|const\s|let\s|var\s|=>|document\.|window\.|console\.|addEventListener)/.test(src);
      if (!hasTag && looksCss && !looksJs) { cssParts.push(src.trim()); work = ''; }
      else if (!hasTag && looksJs) { jsParts.push(src.trim()); work = ''; }
    }

    htmlOut = work.trim();
    cssOut = cssParts.filter(Boolean).join('\n\n').trim();
    jsOut = jsParts.filter(Boolean).join('\n\n').trim();

    /* if nothing split, put whole source in HTML so user still sees output */
    if (!htmlOut && !cssOut && !jsOut) htmlOut = src.trim();
  } catch (e) {
    console.error(e);
    htmlOut = src;
  }

  var h = document.getElementById('htmlDivideHtml');
  var c = document.getElementById('htmlDivideCss');
  var j = document.getElementById('htmlDivideJs');
  if (h) h.value = htmlOut;
  if (c) c.value = cssOut;
  if (j) j.value = jsOut;

  var results = document.getElementById('htmlDivideResults');
  if (results) {
    results.removeAttribute('hidden');
    results.removeAttribute('data-hidden');
    results.classList.remove('is-hidden');
    results.classList.add('is-visible');
    results.style.display = 'grid';
  }
}
window.runHtmlDivide = runHtmlDivide;

function clearHtmlDivide(){
  ['htmlDivideSource','htmlDivideHtml','htmlDivideCss','htmlDivideJs'].forEach(function(id){
    var el = document.getElementById(id);
    if (el) el.value = '';
  });
  var results = document.getElementById('htmlDivideResults');
  if (results) {
    results.classList.remove('is-visible');
    results.classList.add('is-hidden');
    results.setAttribute('data-hidden','1');
    results.style.display = 'none';
  }
}
window.clearHtmlDivide = clearHtmlDivide;

function copyHtmlDividePart(which){
  var id = which === 'css' ? 'htmlDivideCss' : (which === 'js' ? 'htmlDivideJs' : 'htmlDivideHtml');
  var el = document.getElementById(id);
  var val = el ? (el.value || '') : '';
  if (!val) { alert('Is box me abhi code nahi hai. Pehle Split Code dabayein.'); return; }
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(val).then(function(){ /* ok */ }).catch(function(){ fallbackCopy(val); });
    } else fallbackCopy(val);
  } catch(e) { fallbackCopy(val); }
}
function fallbackCopy(val){
  try {
    var ta = document.createElement('textarea');
    ta.value = val; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove();
  } catch(e) {}
}
window.copyHtmlDividePart = copyHtmlDividePart;

function downloadHtmlDividePart(which){
  var map={html:['htmlDivideHtml','html','text/html'],css:['htmlDivideCss','css','text/css'],js:['htmlDivideJs','js','text/javascript']};
  var conf=map[which]||map.html;
  var el=document.getElementById(conf[0]);
  var val=el?(el.value||''):'';
  if(!val.trim()){alert('Is box me abhi code nahi hai. Pehle Generate dabayein.');return;}
  try{
    var blob=new Blob([val],{type:conf[2]+';charset=utf-8'});
    var a=document.createElement('a');
    a.href=URL.createObjectURL(blob);
    a.download='israrlab-'+conf[1]+'-'+Date.now()+'.'+conf[1];
    document.body.appendChild(a);a.click();
    setTimeout(function(){try{URL.revokeObjectURL(a.href);a.remove();}catch(e){}},400);
  }catch(e){alert('Download fail');}
}
window.downloadHtmlDividePart=downloadHtmlDividePart;


function copyHtmlDivideCombined(){
  var h = (document.getElementById('htmlDivideHtml') || {}).value || '';
  var c = (document.getElementById('htmlDivideCss') || {}).value || '';
  var j = (document.getElementById('htmlDivideJs') || {}).value || '';
  var parts = [];
  if (h) parts.push(h);
  if (c) parts.push('<style>\n' + c + '\n</style>');
  if (j) parts.push('<script>\n' + j + '\n</' + 'script>');
  var all = parts.join('\n\n');
  if (!all.trim()) {
    var src = window.getDivideEditorCode ? window.getDivideEditorCode() : ((document.getElementById('htmlDivideSource') || {}).value || '');
    all = src;
  }
  if (!all.trim()) { alert('Copy karne ke liye code nahi mila.'); return; }
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(all);
    else fallbackCopy(all);
  } catch(e) { fallbackCopy(all); }
}
window.copyHtmlDivideCombined = copyHtmlDivideCombined;

function buildHtmlDivideDocument(){
  var h = (document.getElementById('htmlDivideHtml') || {}).value || '';
  var c = (document.getElementById('htmlDivideCss') || {}).value || '';
  var j = (document.getElementById('htmlDivideJs') || {}).value || '';
  var src = window.getDivideEditorCode ? window.getDivideEditorCode() : ((document.getElementById('htmlDivideSource') || {}).value || '');
  if (!h && !c && !j) {
    if (src.trim()) return src;
    return '<!DOCTYPE html><html><body><p style="font-family:sans-serif;padding:20px;color:#666;">Paste code and press Split Code / Full HTML.</p></body></html>';
  }
  /* If HTML already looks complete, inject CSS/JS if missing */
  if (/<html[\s>]/i.test(h) || /<!DOCTYPE/i.test(h)) {
    var doc = h;
    if (c && !/<style[\s>]/i.test(doc)) {
      if (/<\/head>/i.test(doc)) doc = doc.replace(/<\/head>/i, '<style>\n' + c + '\n</style>\n</head>');
      else doc = '<style>\n' + c + '\n</style>\n' + doc;
    }
    if (j && !/<script[\s>]/i.test(doc)) {
      if (/<\/body>/i.test(doc)) doc = doc.replace(/<\/body>/i, '<script>\n' + j + '\n</' + 'script>\n</body>');
      else doc = doc + '\n<script>\n' + j + '\n</' + 'script>';
    }
    return doc;
  }
  return '<!DOCTYPE html>\n<html>\n<head>\n<meta charset="UTF-8"/>\n<meta name="viewport" content="width=device-width, initial-scale=1"/>\n<style>\n' + c + '\n</style>\n</head>\n<body>\n' + h + '\n<script>\n' + j + '\n</' + 'script>\n</body>\n</html>';
}

function openFullHtmlDividePreview(){
  /* auto-split if parts empty but source has content */
  var h = (document.getElementById('htmlDivideHtml') || {}).value || '';
  var c = (document.getElementById('htmlDivideCss') || {}).value || '';
  var j = (document.getElementById('htmlDivideJs') || {}).value || '';
  var src = window.getDivideEditorCode ? window.getDivideEditorCode() : ((document.getElementById('htmlDivideSource') || {}).value || '');
  if (!h && !c && !j && src.trim()) {
    try { runHtmlDivide(); } catch(e) {}
  }
  var doc = buildHtmlDivideDocument();
  var view = document.getElementById('htmlDivideFullView');
  var code = document.getElementById('htmlDivideFullCode');
  if (code) code.value = doc;
  if (view) {
    view.style.display = 'flex';
    document.body.classList.add('subview-active');
  }
  refreshHtmlDivideFullPreview();
}
window.openFullHtmlDividePreview = openFullHtmlDividePreview;

function refreshHtmlDivideFullPreview(){
  var code = document.getElementById('htmlDivideFullCode');
  var iframe = document.getElementById('htmlDivideFullIframe');
  if (!iframe) return;
  var html = code ? (code.value || '') : '';
  try {
    var doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.open();
    doc.write(html);
    doc.close();
  } catch(e) {
    try { iframe.srcdoc = html; } catch(e2) {}
  }
}
window.refreshHtmlDivideFullPreview = refreshHtmlDivideFullPreview;

function closeHtmlDivideFullView(){
  var view = document.getElementById('htmlDivideFullView');
  if (view) view.style.display = 'none';
  document.body.classList.remove('subview-active');
}
window.closeHtmlDivideFullView = closeHtmlDivideFullView;

function copyHtmlDivideFullCode(){
  var code = document.getElementById('htmlDivideFullCode');
  var val = code ? (code.value || '') : '';
  if (!val) return;
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(val);
    else fallbackCopy(val);
  } catch(e) { fallbackCopy(val); }
}
window.copyHtmlDivideFullCode = copyHtmlDivideFullCode;

function filterCategoryFromDrawer(catName){
  try {
    if (typeof currentCategoryFilter !== 'undefined') currentCategoryFilter = catName || 'All';
    if (typeof switchMainSection === 'function') switchMainSection('home');
    if (typeof renderNotes === 'function') renderNotes();
    if (typeof renderCategories === 'function') renderCategories();
  } catch(e) {}
}

function openCategorySettingsPage(){
  try {
    if (typeof openCategorySettingPage === 'function') return openCategorySettingPage();
    if (typeof openCategorySettings === 'function') return openCategorySettings();
    var v = document.getElementById('categorySettingsPageView');
    if (v) { v.style.display = 'flex'; document.body.classList.add('subview-active'); }
  } catch(e) {}
}

/* RELATED TOOLS section, HTML, CSS & JS fully removed as requested */
function escapeHtml(str) {
  return String(str || '').replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function setRelatedMode(){}
function filterRelatedTools(){}
function renderRelatedGrid(){}
function renderRelatedPagination(){}
function renderRelatedActivity(){}
window.setRelatedMode = setRelatedMode;


/* ===== SCRIPT 3 ===== */
(function(){
  /* Fast editor: never highlight on every keystroke. Colors paint after idle. */
  var paintQueued = false;
  var __paintToken = 0;
  var __hlWorker = null;
  function getHighlightWorker(){
    if (__hlWorker) return __hlWorker;
    try {
      var src = [
        "importScripts('https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js');",
        "self.onmessage=function(e){",
        "  var d=e.data||{};",
        "  try{",
        "    var html=self.hljs.highlight(String(d.source||''),{language:d.language||'xml',ignoreIllegals:true}).value;",
        "    self.postMessage({ok:true,token:d.token,html:html});",
        "  }catch(err){ self.postMessage({ok:false,token:d.token,error:String(err&&err.message||err)}); }",
        "};"
      ].join('\n');
      var blob = new Blob([src], {type: 'application/javascript'});
      __hlWorker = new Worker(URL.createObjectURL(blob));
      __hlWorker.onmessage = function(ev){
        var d = ev.data || {};
        if (d.token !== __paintToken) return;
        var output = document.getElementById('codeHighlightOutput');
        var input = document.getElementById('htmlCodeInput');
        var editor = input ? input.closest('.editor-input-area') : null;
        var layer = output ? output.parentElement : null;
        if (!output) return;
        try {
          if (d.ok && d.html) {
            output.innerHTML = d.html;
          } else if (input) {
            output.textContent = input.value || ' ';
          }
          if (editor) editor.classList.add('syntax-ready');
          if (layer && input) { layer.scrollTop = input.scrollTop; layer.scrollLeft = input.scrollLeft; }
        } catch (e) {
          try { if (input) output.textContent = input.value || ' '; } catch(_){}
        }
      };
      __hlWorker.onerror = function(){
        try { __hlWorker.terminate(); } catch(e) {}
        __hlWorker = null;
      };
    } catch (e) { __hlWorker = null; }
    return __hlWorker;
  }
  function paintCode(){
    var input=document.getElementById('htmlCodeInput');
    var output=document.getElementById('codeHighlightOutput');
    if(!input || !output) return;
    var layer=output.parentElement;
    var editor=input.closest('.editor-input-area');
    var source=input.value || '';
    var token = ++__paintToken;
    function syncLayer(){
      if(layer && input){ layer.scrollTop=input.scrollTop; layer.scrollLeft=input.scrollLeft; }
    }
    function showPlainFull(){
      /* ALWAYS keep full code visible — never blank / never \u200b placeholder */
      try { output.textContent = source.length ? source : ' '; } catch(e) {}
      if(editor) editor.classList.add('syntax-ready');
      syncLayer();
    }
    try{
      if(!source){
        showPlainFull();
        return;
      }
      if(!window.hljs){
        showPlainFull();
        return;
      }
      var language = /<\s*(?:!doctype|html|head|body|div|section|script|style|meta|link)\b/i.test(source) ? 'xml' :
        /(^|\n)\s*(?:[.#@*][\w-]*|[\w-]+\s*\{)[^{]*\{/m.test(source) ? 'css' : 'javascript';

      /* 1) Immediately mirror FULL code into highlight layer so nothing "disappears" */
      showPlainFull();

      /* 2) Then upgrade to full syntax color when ready */
      if (source.length <= 50000) {
        try {
          output.innerHTML = window.hljs.highlight(source,{language:language,ignoreIllegals:true}).value;
          if(editor) editor.classList.add('syntax-ready');
          syncLayer();
        } catch(e) { showPlainFull(); }
        return;
      }

      var worker = getHighlightWorker();
      if (worker) {
        try {
          worker.postMessage({ source: source, language: language, token: token });
        } catch(e) {
          /* worker post failed — try idle main-thread color */
          worker = null;
        }
      }
      if (!worker) {
        var run = function(){
          if (token !== __paintToken) return;
          try {
            output.innerHTML = window.hljs.highlight(source,{language:language,ignoreIllegals:true}).value;
            if(editor) editor.classList.add('syntax-ready');
            syncLayer();
          } catch (e) { showPlainFull(); }
        };
        if (typeof requestIdleCallback === 'function') requestIdleCallback(run, { timeout: 3000 });
        else setTimeout(run, 80);
      }
    }catch(err){
      showPlainFull();
    }
  }
  function bind(){
    var input=document.getElementById('htmlCodeInput');
    if(!input || input.dataset.syntaxBound==='1') return;
    input.dataset.syntaxBound='1';
    /* NO input->paintCode binding (typing must stay instant) */
    input.addEventListener('scroll',function(){
      if (typeof syncScroll === 'function') syncScroll(input);
      else {
        var layer=outputLayer();
        var gutter=document.getElementById('lineNumbers');
        if(layer){layer.scrollTop=input.scrollTop;layer.scrollLeft=input.scrollLeft;}
        if(gutter) gutter.scrollTop=input.scrollTop;
      }
    }, {passive:true});
    /* Initial paint once */
    try { paintCode(); } catch(e) {}
  }
  function outputLayer(){
    var output=document.getElementById('codeHighlightOutput');
    return output ? output.parentElement : null;
  }
  window.refreshCodeHighlight=paintCode;
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',bind);
  else bind();
  window.addEventListener('load',bind);
})();


/* ===== SCRIPT 4 id=final-full-paste-and-scroll-sync ===== */
(function(){
 function bindEditorFix(){
  const ta=document.getElementById('htmlCodeInput');
  const gutter=document.getElementById('lineNumbers');
  if(!ta||ta.dataset.finalFullPasteFix==='1')return;
  ta.dataset.finalFullPasteFix='1';
  /* Use the clipboard's complete plain-text payload and replace only the selected range. */
  ta.addEventListener('paste',function(e){
   const cd=e.clipboardData||window.clipboardData;
   if(!cd)return;
   const pasted=cd.getData('text/plain');
   if(typeof pasted!=='string')return;
   e.preventDefault();e.stopImmediatePropagation();
   const start=ta.selectionStart,end=ta.selectionEnd,scrollTop=ta.scrollTop;
   window.__israrPasteBurst=true;
   ta.setRangeText(pasted,start,end,'end');
   ta.scrollTop=scrollTop;
   if(typeof handleEditorInput==='function')handleEditorInput();
   if(gutter)gutter.scrollTop=ta.scrollTop;
  },true);
  ta.addEventListener('scroll',function(){if(gutter)gutter.scrollTop=ta.scrollTop;},{passive:true});
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bindEditorFix);else bindEditorFix();
 window.addEventListener('load',bindEditorFix);
})();


/* ===== SCRIPT 5 id=israrlab-search-highlight-persistence-fix ===== */
(function(){
  function getNodes(root){
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode(n){return n.nodeValue&&n.nodeValue.length?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT;}});
    const out=[];let n;while((n=walker.nextNode()))out.push(n);return out;
  }
  function paintSearchHits(){
    const ta=document.getElementById('htmlCodeInput'), output=document.getElementById('codeHighlightOutput'), queryEl=document.getElementById('codeSearchInput');
    if(!ta||!output||!queryEl)return;
    const q=queryEl.value;if(!q)return;
    const low=q.toLocaleLowerCase();
    getNodes(output).forEach(node=>{
      const value=node.nodeValue, valueLow=value.toLocaleLowerCase();let pos=0,idx;
      if(!valueLow.includes(low))return;
      const frag=document.createDocumentFragment();
      while((idx=valueLow.indexOf(low,pos))!==-1){
        if(idx>pos)frag.appendChild(document.createTextNode(value.slice(pos,idx)));
        const mark=document.createElement('mark');mark.className='search-hit-mark';mark.textContent=value.slice(idx,idx+q.length);frag.appendChild(mark);pos=idx+q.length;
      }
      if(pos<value.length)frag.appendChild(document.createTextNode(value.slice(pos)));
      node.parentNode.replaceChild(frag,node);
    });
    const marks=output.querySelectorAll('mark.search-hit-mark');
    marks.forEach((mark,index)=>mark.classList.toggle('search-hit-active', index===currentSearchMatchIndex));
  }
  function updateHighlight(){
    const ta=document.getElementById('htmlCodeInput');if(!ta)return;
    if(typeof window.refreshCodeHighlight==='function')window.refreshCodeHighlight();
    paintSearchHits();
    const layer=document.querySelector('.code-highlight-layer');if(layer){layer.scrollTop=ta.scrollTop;layer.scrollLeft=ta.scrollLeft;}
    const gutter=document.getElementById('lineNumbers');if(gutter){gutter.scrollTop=ta.scrollTop;}
  }
  function goToCurrentMatch(){
    const ta=document.getElementById('htmlCodeInput'), search=document.getElementById('codeSearchInput');
    if(!ta||!search||!codeSearchMatches.length)return;
    const idx=codeSearchMatches[Math.max(0,currentSearchMatchIndex)]||0;
    ta.focus();ta.setSelectionRange(idx,idx+search.value.length);
    const line=(ta.value.slice(0,idx).match(/\n/g)||[]).length;
    const style=getComputedStyle(ta);const lineHeight=parseFloat(style.lineHeight)||22;
    ta.scrollTop=Math.max(0,line*lineHeight-Math.max(0,ta.clientHeight/3));
    const layer=document.querySelector('.code-highlight-layer'),gutter=document.getElementById('lineNumbers');
    if(layer)layer.scrollTop=ta.scrollTop;if(gutter)gutter.scrollTop=ta.scrollTop;
    updateHighlight();
  }
  // Next/previous buttons move to the match and bring it into view, not just update the counter.
  window.navigateCodeSearchMatch=function(direction){
    if(!codeSearchMatches || !codeSearchMatches.length){
      try { if (typeof handleCodeSearchInput === 'function') handleCodeSearchInput(); } catch(e){}
      if(!codeSearchMatches || !codeSearchMatches.length) return;
    }
    var dir = direction < 0 ? -1 : 1;
    currentSearchMatchIndex = (typeof currentSearchMatchIndex === 'number' ? currentSearchMatchIndex : -1) + dir;
    if(currentSearchMatchIndex >= codeSearchMatches.length) currentSearchMatchIndex = 0;
    if(currentSearchMatchIndex < 0) currentSearchMatchIndex = codeSearchMatches.length - 1;
    var count = document.getElementById('codeSearchCount');
    if(count) count.innerText = (currentSearchMatchIndex + 1) + '/' + codeSearchMatches.length;
    var cm = null;
    try { cm = (typeof getCodeMirror === 'function') ? getCodeMirror() : null; } catch(e){}
    if (typeof jumpToCodeSearchMatch === 'function') {
      jumpToCodeSearchMatch(cm, currentSearchMatchIndex);
    } else if (typeof goToCurrentMatch === 'function') {
      setTimeout(goToCurrentMatch, 0);
    }
  };
  window.addEventListener('load',function(){
    const ta=document.getElementById('htmlCodeInput'), search=document.getElementById('codeSearchInput');
    if(ta){ta.addEventListener('input',()=>setTimeout(updateHighlight,0));ta.addEventListener('scroll',()=>{const l=document.querySelector('.code-highlight-layer'),g=document.getElementById('lineNumbers');if(l)l.scrollTop=ta.scrollTop;if(g)g.scrollTop=ta.scrollTop;},{passive:true});}
    if(search){search.addEventListener('input',()=>setTimeout(()=>{updateHighlight();if(codeSearchMatches.length){currentSearchMatchIndex=0;const count=document.getElementById('codeSearchCount');if(count)count.innerText=`1/${codeSearchMatches.length}`;goToCurrentMatch();}},0));}
    updateHighlight();
  });
  window.addEventListener('beforeunload',function(){
    try{
      const ta=document.getElementById('htmlCodeInput'), title=document.getElementById('noteTitle');
      if(ta && title && (ta.value.trim()||title.value.trim())){
        localStorage.setItem('israr_html_editor_draft',JSON.stringify({title:title.value,code:ta.value,editingIndex:editingIndex,savedAt:Date.now()}));
        /* no autosave on unload */
      }
    }catch(e){}
  });
  // Use a safe native paste replacement to retain every clipboard character.
  function bindPaste(){const ta=document.getElementById('htmlCodeInput');if(!ta||ta.dataset.proPasteFix==='1')return;ta.dataset.proPasteFix='1';ta.addEventListener('paste',function(e){const clip=e.clipboardData;if(!clip)return;const value=clip.getData('text/plain');if(typeof value!=='string')return;e.preventDefault();e.stopImmediatePropagation();const start=ta.selectionStart,end=ta.selectionEnd;ta.setRangeText(value,start,end,'end');if(typeof handleEditorInput==='function')handleEditorInput();updateHighlight();},true);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',bindPaste);else bindPaste();window.addEventListener('load',bindPaste);
})();


/* ===== SCRIPT 6 id=final-editor-actions-fix ===== */
(function(){
  const ta=()=>document.getElementById('htmlCodeInput');
  let historyStack=[],historyIndex=-1,lastValue=null,restoring=false;
  function pushHistory(value){if(restoring)return;if(historyIndex>=0&&historyStack[historyIndex]===value)return;/* skip storing huge blobs that freeze memory */if(typeof value==='string'&&value.length>120000){lastValue=value;return;}historyStack=historyStack.slice(0,historyIndex+1);historyStack.push(value);if(historyStack.length>40)historyStack.shift();historyIndex=historyStack.length-1;lastValue=value;}
  function init(){const el=ta();if(!el||el.dataset.historyFix==='1')return;el.dataset.historyFix='1';pushHistory(el.value);el.addEventListener('input',()=>pushHistory(el.value));el.addEventListener('focus',()=>{if(lastValue!==el.value)pushHistory(el.value)});}
  function insertAtCursor(value){const el=ta();if(!el)return;const start=el.selectionStart??el.value.length,end=el.selectionEnd??start;el.setRangeText(value,start,end,'end');el.focus();if(typeof handleEditorInput==='function')handleEditorInput();setTimeout(function(){try{pushHistory(el.value);}catch(e){}},300);}
  const originalHandleInput=window.handleEditorInput;
  if(typeof originalHandleInput==='function'&&!window.handleEditorInput.__historyWrapped){
    var histPushTimer=null;
    const wrapped=function(){
      const result=originalHandleInput.apply(this,arguments);
      if(histPushTimer) clearTimeout(histPushTimer);
      histPushTimer=setTimeout(function(){ const el=ta(); if(el) pushHistory(el.value); }, 500);
      return result;
    };
    wrapped.__historyWrapped=true;
    window.handleEditorInput=wrapped;
  }
  window.editorActionClear=function(){const el=ta();if(!el)return;if(!confirm('क्या आप एडिटर का पूरा कोड साफ करना चाहते हैं?'))return;el.value='';el.focus();if(typeof handleEditorInput==='function')handleEditorInput();pushHistory(el.value);};
  window.editorActionUndo=function(){const el=ta();if(!el)return;if(historyIndex<=0){return;}historyIndex--;restoring=true;el.value=historyStack[historyIndex];lastValue=el.value;restoring=false;el.focus();el.setSelectionRange(el.value.length,el.value.length);if(typeof handleEditorInput==='function')handleEditorInput();if(typeof window.refreshCodeHighlight==='function')window.refreshCodeHighlight();};
  window.editorActionRedo=function(){const el=ta();if(!el)return;if(historyIndex>=historyStack.length-1)return;historyIndex++;restoring=true;el.value=historyStack[historyIndex];lastValue=el.value;restoring=false;el.focus();el.setSelectionRange(el.value.length,el.value.length);if(typeof handleEditorInput==='function')handleEditorInput();if(typeof window.refreshCodeHighlight==='function')window.refreshCodeHighlight();};
  window.editorActionCopyText=async function(){const el=ta();if(!el)return;const value=el.value;try{if(navigator.clipboard&&navigator.clipboard.writeText){await navigator.clipboard.writeText(value);}else{el.focus();el.select();document.execCommand('copy');} }catch(e){el.focus();el.select();try{document.execCommand('copy');}catch(_){} } };
  window.editorActionPasteText=async function(){const el=ta();if(!el)return;try{if(!navigator.clipboard||!navigator.clipboard.readText)throw new Error('clipboard unavailable');const value=await navigator.clipboard.readText();insertAtCursor(value);}catch(e){alert('Clipboard paste permission available nahi hai. Code box par tap karke device ka Paste option use karein.');}};
  window.downloadEditorCode=function(){const el=ta();if(!el)return;const titleEl=document.getElementById('noteTitle');let name=(titleEl&&titleEl.value.trim())||'IsrarLab-Code';name=name.replace(/[\\/:*?"<>|]+/g,'_').trim()||'IsrarLab-Code';const blob=new Blob([el.value],{type:'text/html;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name.toLowerCase().endsWith('.html')?name:name+'.html';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();window.addEventListener('load',init);
})();


/* ===== SCRIPT 7 id=final-cursor-and-scroll-alignment-fix ===== */
(function(){
 function align(){
  const ta=document.getElementById('htmlCodeInput');
  const layer=document.querySelector('#editorView .code-highlight-layer');
  const gutter=document.getElementById('lineNumbers');
  if(!ta)return;
  if(ta.dataset.finalAlignmentBound!=='1'){
   ta.dataset.finalAlignmentBound='1';
   const sync=()=>{if(layer){layer.scrollTop=ta.scrollTop;layer.scrollLeft=ta.scrollLeft;}if(gutter){gutter.scrollTop=ta.scrollTop;}};
   ta.addEventListener('scroll',sync,{passive:true});
   ta.addEventListener('input',()=>{if(typeof scheduleHighlight==='function')scheduleHighlight();else if(typeof window.refreshCodeHighlight==='function'){/*debounced path preferred*/}sync();});
   ta.addEventListener('click',()=>{ta.focus();});
   ta.addEventListener('keyup',sync);
   ta.addEventListener('paste',()=>setTimeout(()=>{if(typeof scheduleHighlight==='function')scheduleHighlight();sync();},0));
  }
  if(typeof window.refreshCodeHighlight==='function')window.refreshCodeHighlight();
  if(layer){layer.scrollTop=ta.scrollTop;layer.scrollLeft=ta.scrollLeft;}
  if(gutter)gutter.scrollTop=ta.scrollTop;
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',align);else align();
 window.addEventListener('load',align);
})();


/* ===== SCRIPT 8 id=requested-save-return-home-fix ===== */
function saveAndReturnHome(){
  var ok = false;
  try { ok = executeAutoSave(); } catch (e) { console.error(e); }
  window.isCreatingNewNote = false;
  window.__israrForceNotesRender = true;
  const btn = document.getElementById('editorSaveUpdateBtn');
  if (btn) {
    var prev = btn.innerText;
    btn.innerText = ok === false ? 'Empty' : 'Saved';
    setTimeout(function(){ if (btn.isConnected) btn.innerText = prev; }, 900);
  }
  if (ok === false) {
    navigateBack();
    return;
  }
  /* Force durable write then go home */
  function goHome() {
    try { if (typeof renderExternalHistoryLogs === 'function') renderExternalHistoryLogs(); } catch (e) {}
    try { if (typeof renderNotes === 'function') renderNotes(); } catch (e) {}
    if (typeof showHomeDirectly === 'function') showHomeDirectly();
    else {
      var editor = document.getElementById('editorView'), home = document.getElementById('homeView');
      if (editor) editor.style.display = 'none';
      if (home) home.style.display = 'block';
    }
  }
  try {
    var p = __israrPersistAll();
    if (p && typeof p.then === 'function') {
      p.then(function(){ goHome(); }).catch(function(){ goHome(); });
      /* safety timeout */
      setTimeout(goHome, 400);
      return;
    }
  } catch (e) {}
  goHome();
}


/* ===== SCRIPT 9 id=final-darkmode-home-reapply-fix ===== */
(function(){
  /* Re-apply dark/light every time home is shown + on load */
  function reapply(){
    try{
      if(typeof isDarkThemeOn === 'undefined') return;
      /* sync from storage in case another tab/view changed it */
      var stored = localStorage.getItem('israr_html_darkmode');
      if(stored === 'true') isDarkThemeOn = true;
      else if(stored === 'false') isDarkThemeOn = false;
      if(typeof applyDarkModeState === 'function') applyDarkModeState();
    }catch(e){}
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', reapply);
  else reapply();
  window.addEventListener('load', reapply);
  window.addEventListener('pageshow', reapply);
  /* wrap showHomeDirectly if present later */
  var tries = 0;
  var iv = setInterval(function(){
    tries++;
    if(typeof showHomeDirectly === 'function' && !showHomeDirectly.__darkWrapped){
      var orig = showHomeDirectly;
      var wrapped = function(){
        var r = orig.apply(this, arguments);
        setTimeout(reapply, 0);
        setTimeout(reapply, 50);
        return r;
      };
      wrapped.__darkWrapped = true;
      showHomeDirectly = wrapped;
      clearInterval(iv);
    }
    if(tries > 40) clearInterval(iv);
  }, 100);
})();


/* ===== SCRIPT 10 id=final-layout-sort-sync-fix ===== */
(function(){
  function syncLayoutStatus(){
    try{
      var st = document.getElementById('modalLayoutStatusText');
      if (st && typeof isListView !== 'undefined') st.innerText = isListView ? 'List' : 'Grid';
      var c = document.getElementById('notesContainer');
      if (c && typeof isListView !== 'undefined'){
        if (isListView) c.classList.add('list-mode');
        else c.classList.remove('list-mode');
      }
    }catch(e){}
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', syncLayoutStatus);
  else syncLayoutStatus();
  window.addEventListener('load', syncLayoutStatus);
})();


/* ===== SCRIPT 11 id=ultimate-persist-and-pagination-fix ===== */
(function(){
  function persistNow(){
    try { if (typeof saveData === 'function') saveData(); } catch(e) {}
  }
  window.addEventListener('pagehide', persistNow);
  document.addEventListener('visibilitychange', function(){
    if (document.visibilityState === 'hidden') persistNow();
  });
  window.addEventListener('load', function(){
    try {
      var p = parseInt(localStorage.getItem('israr_htmlviewer_rel_page') || '1', 10);
      if (!isNaN(p) && p > 1 && typeof relatedCurrentPage !== 'undefined') {
        relatedCurrentPage = p;
        if (typeof filterRelatedTools === 'function') filterRelatedTools(false);
      }
    } catch(e) {}
  });
})();


/* ===== SCRIPT 12 id=line-scroll-raf-bind ===== */
(function(){
  function bind(){
    var ta = document.getElementById('htmlCodeInput');
    if (!ta || ta.dataset.lineScrollRaf === '1') return;
    ta.dataset.lineScrollRaf = '1';
    var ticking = false;
    ta.addEventListener('scroll', function(){
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function(){
        ticking = false;
        if (typeof syncScroll === 'function') syncScroll(ta);
      });
    }, { passive: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bind);
  else bind();
  window.addEventListener('load', bind);
})();


/* ===== SCRIPT 13 id=editor-hscroll-sync ===== */
(function(){
  function bind(){
    var ta = document.getElementById('htmlCodeInput');
    var layer = document.querySelector('#editorView .code-highlight-layer');
    if (!ta || ta.dataset.hScrollBound === '1') return;
    ta.dataset.hScrollBound = '1';
    ta.addEventListener('scroll', function(){
      if (layer) {
        layer.scrollTop = ta.scrollTop;
        layer.scrollLeft = ta.scrollLeft;
      }
      var gutter = document.getElementById('lineNumbers');
      if (gutter) gutter.scrollTop = ta.scrollTop;
    }, { passive: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bind);
  else bind();
  window.addEventListener('load', bind);
})();


/* ===== SCRIPT 14 id=codemirror-editor-bootstrap ===== */
(function(){
  var cmInstance = null;
  var cmReady = false;

  function getTA(){ return document.getElementById('htmlCodeInput'); }

  window.getEditorCode = function(){
    try {
      if (cmInstance) return cmInstance.getValue();
    } catch(e) {}
    var ta = getTA();
    return ta ? (ta.value || '') : '';
  };

  window.setEditorCode = function(code, keepCursor){
    code = (code == null) ? '' : String(code);
    var ta = getTA();
    if (ta) ta.value = code;
    try {
      if (cmInstance) {
        var cur = keepCursor ? cmInstance.getCursor() : null;
        cmInstance.setValue(code);
        if (cur) cmInstance.setCursor(cur);
        cmInstance.refresh();
      }
    } catch(e) {}
  };

  window.refreshEditorLayout = function(){
    try {
      if (cmInstance) {
        cmInstance.refresh();
        setTimeout(function(){ try { cmInstance.refresh(); } catch(e){} }, 50);
        setTimeout(function(){ try { cmInstance.refresh(); } catch(e){} }, 200);
      }
    } catch(e) {}
  };

  window.initIsrarCodeMirror = function(){
    if (typeof CodeMirror === 'undefined') return null;
    var ta = getTA();
    if (!ta) return null;
    if (cmInstance) {
      try { cmInstance.refresh(); } catch(e) {}
      return cmInstance;
    }
    try {
      cmInstance = CodeMirror.fromTextArea(ta, {
        mode: 'htmlmixed',
        theme: 'material-darker',
        lineNumbers: true,
        lineWrapping: true,   /* KEY: same as israrlabhtmlpreview — no right spill */
        matchBrackets: true,
        styleActiveLine: true,
        tabSize: 2,
        indentUnit: 2,
        indentWithTabs: false,
        /* Finite viewport = fast on large files (Infinity freezes mobile) */
        viewportMargin: 30,
        autofocus: false,
        extraKeys: {
          'Tab': function(cm){ cm.replaceSelection('  ', 'end'); }
        }
      });
      var __cmStatTimer = null;
      cmInstance.on('change', function(){
        try {
          var v = cmInstance.getValue();
          var ta2 = getTA();
          if (ta2) ta2.value = v;
          if (__cmStatTimer) clearTimeout(__cmStatTimer);
          __cmStatTimer = setTimeout(function(){
            try { if (typeof updateStats === 'function') updateStats(); } catch(e) {}
          }, 200);
        } catch(e) {}
      });
      cmReady = true;
      setTimeout(function(){ try { cmInstance.refresh(); } catch(e){} }, 30);
      return cmInstance;
    } catch (err) {
      console.error('CodeMirror init failed', err);
      cmInstance = null;
      return null;
    }
  };

  window.getCodeMirror = function(){ return cmInstance; };

  /* Patch common value access paths after DOM ready */
  function patchEditorIO(){
    /* openEditor already sets textarea; we sync CM after */
    var origOpen = window.openEditor;
    if (typeof origOpen === 'function' && !origOpen.__cmWrapped) {
      window.openEditor = function(index){
        var r = origOpen.apply(this, arguments);
        setTimeout(function(){
          try { window.initIsrarCodeMirror(); } catch(e) {}
          var isNew = !!window.__israrEditorIsNew || !!window.isCreatingNewNote;
          var code = '';
          if (isNew) {
            code = '';
            try { localStorage.removeItem('israr_html_editor_draft'); } catch(e) {}
          } else {
            /* Prefer note source, then flag, then textarea */
            try {
              if (typeof editingIndex === 'number' && editingIndex >= 0 && notes[editingIndex]) {
                code = notes[editingIndex].htmlCode || '';
              } else if (typeof window.__israrEditorLoadCode === 'string') {
                code = window.__israrEditorLoadCode;
              } else {
                var ta = getTA();
                code = ta ? (ta.value || '') : '';
              }
            } catch (e) {
              var ta2 = getTA();
              code = ta2 ? (ta2.value || '') : '';
            }
          }
          var ta3 = getTA();
          if (ta3) ta3.value = code;
          if (cmInstance) {
            try {
              cmInstance.setValue(code);
              cmInstance.clearHistory();
              cmInstance.scrollTo(0, 0);
              cmInstance.refresh();
            } catch(e) {}
          }
          try { if (typeof updateStats === 'function') updateStats(); } catch(e) {}
          window.refreshEditorLayout();
        }, 15);
        setTimeout(function(){ window.refreshEditorLayout(); }, 120);
        return r;
      };
      window.openEditor.__cmWrapped = true;
    }

    /* save / autosave should read from CM */
    if (typeof window.executeAutoSave === 'function' && !window.executeAutoSave.__cmWrapped) {
      var origSave = window.executeAutoSave;
      window.executeAutoSave = function(){
        try {
          var ta = getTA();
          if (ta && cmInstance) ta.value = cmInstance.getValue();
        } catch(e) {}
        return origSave.apply(this, arguments);
      };
      window.executeAutoSave.__cmWrapped = true;
    }

    /* undo/redo via CM */
    window.editorActionUndo = function(){
      try { if (cmInstance) { cmInstance.execCommand('undo'); return; } } catch(e) {}
      try { document.execCommand('undo'); } catch(e) {}
      if (typeof handleEditorInput === 'function') handleEditorInput();
    };
    window.editorActionRedo = function(){
      try { if (cmInstance) { cmInstance.execCommand('redo'); return; } } catch(e) {}
      try { document.execCommand('redo'); } catch(e) {}
      if (typeof handleEditorInput === 'function') handleEditorInput();
    };
    window.editorActionClear = function(){
      if (!confirm('क्या आप एडिटर का पूरा कोड साफ करना चाहते हैं?')) return;
      window.setEditorCode('');
      if (typeof handleEditorInput === 'function') handleEditorInput();
    };
    window.editorActionCopyText = async function(){
      var value = window.getEditorCode();
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) await navigator.clipboard.writeText(value);
        else {
          var ta = getTA(); if (ta) { ta.value = value; ta.select(); document.execCommand('copy'); }
        }
      } catch(e) {}
    };
    window.editorActionPasteText = async function(){
      try {
        if (!navigator.clipboard || !navigator.clipboard.readText) throw new Error('no clip');
        var value = await navigator.clipboard.readText();
        if (cmInstance) {
          cmInstance.replaceSelection(value || '');
          cmInstance.focus();
        } else {
          var ta = getTA();
          if (!ta) return;
          var start = ta.selectionStart, end = ta.selectionEnd;
          ta.value = ta.value.substring(0, start) + value + ta.value.substring(end);
          if (typeof handleEditorInput === 'function') handleEditorInput();
        }
      } catch(e) {
        alert('Clipboard paste permission available nahi hai. Code box par tap karke device ka Paste option use karein.');
      }
    };

    /* updateStats from CM value */
    if (typeof window.updateStats === 'function' && !window.updateStats.__cmWrapped) {
      var origStats = window.updateStats;
      window.updateStats = function(){
        try {
          var ta = getTA();
          if (ta && cmInstance) ta.value = cmInstance.getValue();
        } catch(e) {}
        return origStats.apply(this, arguments);
      };
      window.updateStats.__cmWrapped = true;
    }

    /* download uses CM value */
    if (typeof window.downloadEditorCode === 'function' && !window.downloadEditorCode.__cmWrapped) {
      var origDl = window.downloadEditorCode;
      window.downloadEditorCode = function(){
        try {
          var ta = getTA();
          if (ta && cmInstance) ta.value = cmInstance.getValue();
        } catch(e) {}
        return origDl.apply(this, arguments);
      };
      window.downloadEditorCode.__cmWrapped = true;
    }

    /* search inside code */
    if (typeof window.handleCodeSearchInput === 'function' && !window.handleCodeSearchInput.__cmWrapped) {
      var origSearch = window.handleCodeSearchInput;
      window.handleCodeSearchInput = function(){
        try {
          var ta = getTA();
          if (ta && cmInstance) ta.value = cmInstance.getValue();
        } catch(e) {}
        return origSearch.apply(this, arguments);
      };
      window.handleCodeSearchInput.__cmWrapped = true;
    }
  }

  function boot(){
    patchEditorIO();
    /* Do NOT pre-init CM on home — init only when editor opens (faster home) */
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
  window.addEventListener('load', function(){ patchEditorIO(); window.refreshEditorLayout(); });
})();


/* ===== SCRIPT 15 id=israrlab-repaired-multiple-html ===== */
(function(){
  var STORE='israrlab_multiple_html_windows_repaired_v1';
  function cards(){return Array.prototype.slice.call(document.querySelectorAll('#windowCodeWorkspace .window-code-card'));}
  function editor(card){return card&&card.__cmEditor;}
  function read(card){var cm=editor(card);if(cm)return cm.getValue();var ta=card&&card.querySelector('textarea');return ta?ta.value:'';}
  function makeEditor(card){if(!card||card.__cmEditor||!window.CodeMirror)return;var ta=card.querySelector('textarea');if(!ta)return;var cm=CodeMirror.fromTextArea(ta,{mode:'htmlmixed',theme:(document.body.classList.contains('light-mode')?'default':'material-darker'),lineNumbers:true,lineWrapping:true,indentUnit:2,tabSize:2,autoCloseTags:true,matchBrackets:true,viewportMargin:20});card.__cmEditor=cm;cm.setSize('100%','100%');setTimeout(function(){cm.refresh();},80);}
  function makeAll(){cards().forEach(makeEditor);}
  function docFor(raw){raw=String(raw||'');if(!raw.trim())return '<!doctype html><html><body></body></html>';if(/<!doctype|<html[\s>]/i.test(raw))return raw;var css='',js='',html=raw;if(/<style\b/i.test(raw)||(/^\s*(?:[.#@*]|[a-z][\w-]*\s*\{)/i.test(raw)&&raw.indexOf('<')<0)){css=raw.replace(/<\/?style[^>]*>/gi,'');html='';}else if(/<script\b/i.test(raw)||(/\b(?:function|const|let|var|document\.|console\.)/.test(raw)&&raw.indexOf('<')<0)){js=raw.replace(/<\/?script[^>]*>/gi,'');html='';}return '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>'+css+'</style></head><body>'+html+(js?'<script>'+js+'<\/script>':'')+'</body></html>';}
  window.switchDivideMode=function(mode){document.querySelectorAll('.divide-mode-tab').forEach(function(b){b.classList.toggle('active',b.getAttribute('data-mode')===mode);});document.querySelectorAll('.divide-mode-pane').forEach(function(p){p.classList.remove('active');});var target=document.getElementById('divideMode'+mode.charAt(0).toUpperCase()+mode.slice(1));if(target)target.classList.add('active');if(mode==='multiple')window.openFullHtmlDividePreview();if(mode==='practice')renderLearningList('practice');if(mode==='courses')renderLearningList('courses');if(mode==='divide')setTimeout(initDivideEditor,30);};
  window.addWindowCodeBox=function(){var host=document.getElementById('windowCodeWorkspace'),strip=document.getElementById('windowTabStrip');if(!host)return;var n=cards().length+1,card=document.createElement('div');card.className='window-code-card';card.innerHTML='<div class="window-code-card-head"><span><i class="fas fa-code" style="color:var(--cyan);margin-right:6px;"></i>Code Box '+n+'</span></div><textarea spellcheck="false" placeholder="Yahan HTML, CSS ya JavaScript code likhein..."></textarea>';host.appendChild(card);if(strip){var b=document.createElement('button');b.type='button';b.className='window-tab';b.textContent='Window '+n;b.onclick=function(){window.selectWindowCode(n-1);};strip.appendChild(b);}makeEditor(card);window.selectWindowCode(n-1);};
  window.selectWindowCode=function(index){var all=cards();if(!all.length)return;index=Math.max(0,Math.min(index,all.length-1));all.forEach(function(c,i){if(i===index){c.style.display='flex';c.style.flex='1 1 auto';c.style.minHeight='0';c.style.height='100%';}else{c.style.display='none';}});document.querySelectorAll('#windowTabStrip .window-tab').forEach(function(b,i){b.classList.toggle('active',i===index);});var pane=document.getElementById('windowPreviewPane'),host=document.getElementById('windowCodeWorkspace'),strip=document.getElementById('windowTabStrip');if(pane)pane.style.display='none';if(host){host.style.display='flex';host.style.flex='1 1 auto';host.style.minHeight='0';}if(strip)strip.style.display='flex';window.__selectedWindowIndex=index;var cm=editor(all[index]);if(cm)setTimeout(function(){try{cm.setSize('100%','100%');cm.refresh();}catch(e){}},40);setTimeout(function(){var cm2=editor(all[index]);if(cm2)try{cm2.refresh();}catch(e){}},120);};
  window.showWindowHtmlPreview=function(){var pane=document.getElementById('windowPreviewPane'),host=document.getElementById('windowCodeWorkspace'),strip=document.getElementById('windowTabStrip');if(!pane)return;pane.innerHTML='';cards().forEach(function(card,i){var wrap=document.createElement('section');wrap.className='window-preview-card';var title=document.createElement('div');title.className='window-preview-title';title.textContent='Window '+(i+1)+' Preview';var frame=document.createElement('iframe');frame.title=title.textContent;frame.setAttribute('sandbox','allow-scripts allow-forms allow-modals');frame.srcdoc=docFor(read(card));wrap.appendChild(title);wrap.appendChild(frame);pane.appendChild(wrap);});if(host)host.style.display='none';if(strip)strip.style.display='none';pane.style.display='block';};
  window.showWindowCodeWorkspace=function(){
    var pane=document.getElementById('windowPreviewPane');
    var host=document.getElementById('windowCodeWorkspace');
    var strip=document.getElementById('windowTabStrip');
    var view=document.getElementById('htmlDivideFullView');
    if(view){view.style.display='flex';view.style.flexDirection='column';}
    if(pane){pane.style.cssText='display:none !important;';}
    if(host){host.style.cssText='display:flex !important;flex:1 1 auto !important;min-height:0 !important;height:auto !important;overflow:hidden !important;padding:10px !important;box-sizing:border-box !important;';}
    if(strip){strip.style.cssText='display:flex !important;flex:0 0 auto !important;';}
    makeAll();
    window.selectWindowCode(window.__selectedWindowIndex||0);
  };
  window.saveMultipleHtmlWindows=function(){try{localStorage.setItem(STORE,JSON.stringify(cards().map(read)));alert('Code windows save ho gaye.');}catch(e){alert('Save nahi ho saka.');}};
  var oldOpen=window.openFullHtmlDividePreview;
  window.openFullHtmlDividePreview=function(){var view=document.getElementById('htmlDivideFullView');if(!view)return;view.setAttribute('data-open','1');view.style.display='flex';view.style.flexDirection='column';document.body.classList.add('subview-active');makeAll();try{var saved=JSON.parse(localStorage.getItem(STORE)||'null');if(Array.isArray(saved)&&saved.length&&cards().length===1&&!read(cards()[0]).trim()){var ta=cards()[0].querySelector('textarea');if(ta)ta.value=saved[0];if(cards()[0].__cmEditor)cards()[0].__cmEditor.setValue(saved[0]);}}catch(e){}makeAll();window.showWindowCodeWorkspace();setTimeout(function(){makeAll();window.selectWindowCode(window.__selectedWindowIndex||0);},80);};
  window.closeHtmlDivideFullView=function(){
    var view=document.getElementById('htmlDivideFullView');
    if(view){
      view.setAttribute('data-open','0');
      view.removeAttribute('style');
      view.style.cssText='display:none !important; visibility:hidden !important; pointer-events:none !important;';
    }
    document.body.classList.remove('subview-active');
    try{
      if(typeof window.switchMainSection==='function') window.switchMainSection('html-divide');
      document.querySelectorAll('#panel-html-divide .divide-mode-tab').forEach(function(b){
        b.classList.toggle('active', b.getAttribute('data-mode')==='multiple');
      });
      document.querySelectorAll('#panel-html-divide .divide-mode-pane').forEach(function(p){
        var isMulti=(p.id==='divideModeMultiple');
        p.classList.toggle('active', isMulti);
        p.style.display=isMulti?'block':'none';
      });
    }catch(e){}
    var v2=document.getElementById('htmlDivideFullView');
    if(v2){
      v2.setAttribute('data-open','0');
      v2.style.cssText='display:none !important;';
    }
    document.body.classList.remove('subview-active');
  };;

})();


/* ===== SCRIPT 16 id=israrlab-learning-library ===== */
(function(){
  var practice=[], courses=[], activeDetail=null;
  var practiceBases=[
    ['HTML ka basic page','Ek HTML document banao jisme doctype, html, head aur body ho.','<!DOCTYPE html>'],
    ['Heading tag','Page par sabse badi heading dikhane ke liye H1 ka istemal karo.','<h1>'],
    ['Paragraph','Ek paragraph likho aur p tag ka istemal karo.','<p>'],
    ['Link banana','Google ya kisi doosri website ka clickable link banao.','<a href'],
    ['Image lagana','Page par image dikhane ke liye image tag aur alt text lagao.','<img'],
    ['Ordered list','Numbers wali list banane ke liye ol aur li use karo.','<ol>'],
    ['Unordered list','Bullet wali list banane ke liye ul aur li use karo.','<ul>'],
    ['Table banana','Table mein row aur heading cell banao.','<table>'],
    ['Form banana','Naam lene ke liye label aur input wala form banao.','<input'],
    ['Button banana','Click hone wala button banao.','<button'],
    ['CSS color','Heading ka text red ya blue karne ka CSS likho.','color:'],
    ['CSS background','Body ka background color badlo.','background'],
    ['CSS margin','Element ke bahar 20px jagah do.','margin:'],
    ['CSS padding','Element ke andar 12px jagah do.','padding:'],
    ['CSS border','Box ke charon taraf border lagao.','border:'],
    ['Flexbox','Do cards ko ek line mein rakhne ke liye flex use karo.','display: flex'],
    ['Grid layout','Do column ka grid banao.','grid-template-columns'],
    ['Rounded corner','Card ke corners gol karo.','border-radius'],
    ['Hover effect','Mouse le jane par button ka rang badlo.',':hover'],
    ['Responsive design','Mobile screen ke liye media query banao.','@media'],
    ['JavaScript variable','let se ek variable banao.','let '],
    ['Constant','const se fixed value banao.','const '],
    ['Function','Ek function banao jo greeting de.','function'],
    ['Click event','Button click hone par message dikhayo.','addEventListener'],
    ['If condition','Agar number 10 se bada ho to message dikhao.','if'],
    ['Array','Teen rangon ka array banao.','['],
    ['Loop','for loop se 1 se 5 tak number chalao.','for'],
    ['DOM selection','ID se HTML element select karo.','getElementById'],
    ['Text change','JavaScript se paragraph ka text badlo.','textContent'],
    ['Console','Console mein Hello IsrarLab print karo.','console.log']
  ];
  var levels=['Basic','Beginner','Practice','Intermediate','Advanced'];
  for(var i=0;i<250;i++){
    var b=practiceBases[i%practiceBases.length],level=levels[Math.floor(i/practiceBases.length)%levels.length];
    practice.push({title:b[0]+' – '+level+' '+(Math.floor(i/practiceBases.length)+1),task:b[1],hint:'Is task mein '+b[2]+' ka istemal karke code likhein.',answer:b[2],num:i+1});
  }
  var topics=[
    ['HTML','HTML ka matlab HyperText Markup Language hai. Is se webpage ka structure banta hai.','<h1>Mera Page</h1>'],
    ['HTML Document Structure','DOCTYPE browser ko HTML version batata hai. html root element, head metadata aur body visible content rakhta hai.','<!DOCTYPE html>\n<html>\n<head><title>Page</title></head>\n<body>Hello</body>\n</html>'],
    ['HTML Headings','h1 se h6 tak headings hoti hain. h1 sabse important aur aam tor par sabse badi heading hoti hai.','<h1>Main Heading</h1>\n<h2>Sub Heading</h2>'],
    ['HTML Paragraph','p tag text ke paragraph ke liye hota hai. Browser paragraph ke aas paas spacing deta hai.','<p>Yeh mera paragraph hai.</p>'],
    ['HTML Links','a tag kisi doosre page ya website par le jata hai. href mein destination URL hota hai.','<a href="https://example.com">Open</a>'],
    ['HTML Images','img tag image dikhata hai. src image path aur alt image ka text alternative hota hai.','<img src="photo.jpg" alt="Meri photo">'],
    ['HTML Lists','ul bullet list aur ol numbered list banata hai. Har item li tag mein hota hai.','<ul><li>Ek</li><li>Do</li></ul>'],
    ['HTML Tables','table data ko rows aur columns mein dikhata hai. tr row, th heading aur td data cell hota hai.','<table><tr><th>Naam</th></tr><tr><td>Ali</td></tr></table>'],
    ['HTML Forms','Form user se input leta hai. label, input, select aur button aam form controls hain.','<label>Naam <input type="text"></label>'],
    ['HTML Input Types','input type text, email, password, number, date aur checkbox jaisi fields banata hai.','<input type="email" placeholder="Email">'],
    ['HTML Buttons','button user ke click ya form submit ke kaam aata hai. type button ya submit set kar sakte hain.','<button type="button">Click</button>'],
    ['HTML Semantic Tags','header, nav, main, section, article aur footer page ko meaningful structure dete hain.','<main><section><h2>About</h2></section></main>'],
    ['HTML Audio Video','audio aur video tags browser mein media play karte hain. controls se playback controls dikhte hain.','<video controls src="movie.mp4"></video>'],
    ['HTML Iframe','iframe doosre webpage ya embedded content ko current page ke andar dikhata hai.','<iframe src="https://example.com" title="Demo"></iframe>'],
    ['HTML Data Attributes','data-* attributes custom data ko element ke saath rakhte hain. JavaScript dataset se read kar sakta hai.','<button data-id="7">Open</button>'],
    ['CSS Introduction','CSS ka matlab Cascading Style Sheets hai. Yeh HTML elements ka rang, size aur layout set karta hai.','p { color: blue; }'],
    ['CSS Selectors','Selector batata hai kis HTML element par style lagana hai. Class ke liye dot aur ID ke liye hash hota hai.','.card { padding: 12px; }'],
    ['CSS Colors','Color names, HEX, RGB aur HSL formats se text aur background ka rang set hota hai.','h1 { color: #1677ff; }'],
    ['CSS Units','px fixed pixel, %, em, rem aur vw/vh responsive sizing mein kaam aate hain.','p { font-size: 1rem; }'],
    ['CSS Box Model','Har element content, padding, border aur margin se milkar banta hai. box-sizing sizing ko predictable banata hai.','* { box-sizing: border-box; }'],
    ['CSS Margin Padding','Margin element ke bahar space aur padding border ke andar space deta hai.','div { margin: 10px; padding: 16px; }'],
    ['CSS Borders','Border element ke edge par line lagata hai. Width, style aur color set kar sakte hain.','div { border: 1px solid #999; }'],
    ['CSS Typography','font-family, font-size, font-weight aur line-height text ko readable banate hain.','body { font-family: Arial; line-height: 1.6; }'],
    ['CSS Display','display property element ka layout behavior set karti hai jaise block, inline, flex, grid aur none.','.row { display: flex; }'],
    ['CSS Flexbox','Flexbox ek dimension mein items ko align aur distribute karta hai.','nav { display:flex; gap:12px; }'],
    ['CSS Grid','Grid rows aur columns dono mein layout banata hai.','main { display:grid; grid-template-columns:1fr 1fr; }'],
    ['CSS Position','static, relative, absolute, fixed aur sticky se element ki position control hoti hai.','.badge { position:absolute; top:0; right:0; }'],
    ['CSS Z Index','z-index overlapping positioned elements ka stacking order set karta hai.','.modal { position:fixed; z-index:1000; }'],
    ['CSS Pseudo Classes','hover, focus, active aur nth-child state ya position ke mutabiq style lagate hain.','button:hover { opacity:.8; }'],
    ['CSS Transitions','Transition property change ko smooth banati hai.','button { transition: .2s ease; }'],
    ['CSS Animations','@keyframes animation ke steps define karta hai.','@keyframes fade { from{opacity:0} to{opacity:1} }'],
    ['CSS Media Queries','Media query screen width ke mutabiq responsive styles lagati hai.','@media(max-width:600px){.grid{grid-template-columns:1fr}}'],
    ['CSS Variables','Custom properties mein reusable values store hoti hain.',' :root { --brand:#08a6c8; }'],
    ['CSS Overflow','overflow content zyada hone par clipping ya scrolling control karta hai.','.panel { overflow:auto; }'],
    ['CSS Shadows','box-shadow element ke peeche shadow banata hai.','.card { box-shadow:0 4px 14px #0002; }'],
    ['CSS Filters','filter blur, brightness aur grayscale jaise visual effects deta hai.','img { filter:grayscale(1); }'],
    ['JavaScript Introduction','JavaScript webpage ko interactive banata hai. Is se events, data aur DOM control hota hai.','console.log("Hello IsrarLab");'],
    ['JavaScript Variables','let badalne wali aur const dobara assign na hone wali binding banata hai.','let count = 1;\nconst site = "IsrarLab";'],
    ['JavaScript Data Types','String, number, boolean, null, undefined, bigint aur symbol JavaScript data types hain.','const name = "Ali";\nconst age = 20;'],
    ['JavaScript Operators','Arithmetic, comparison aur logical operators values par operation karte hain.','const total = 5 + 3;\nconst valid = total > 4;'],
    ['JavaScript Conditions','if, else aur switch condition ke mutabiq alag code chalate hain.','if (age >= 18) { console.log("Adult"); }'],
    ['JavaScript Loops','for, while aur for...of repeat hone wale kaam ke liye hain.','for (let i=1; i<=5; i++) console.log(i);'],
    ['JavaScript Functions','Function reusable code block hota hai. Parameters input aur return output dete hain.','function add(a,b){ return a+b; }'],
    ['JavaScript Arrow Functions','Arrow function chhota function syntax hai.','const double = n => n * 2;'],
    ['JavaScript Arrays','Array ek ordered list mein multiple values rakhta hai.','const colors = ["red","blue","green"];'],
    ['JavaScript Objects','Object key-value pairs mein related data rakhta hai.','const user = {name:"Ali", age:20};'],
    ['JavaScript DOM','DOM browser ka document tree hai. JavaScript se elements select aur update hote hain.','document.querySelector("h1").textContent = "Hi";'],
    ['JavaScript Events','Events click, input aur submit jaise user actions ko handle karte hain.','button.addEventListener("click", () => alert("Hi"));'],
    ['JavaScript Forms','Form values read karke validate ki ja sakti hain aur submit ko control kiya ja sakta hai.','const value = document.querySelector("input").value;'],
    ['JavaScript Local Storage','localStorage browser mein string data ko sessions ke darmiyan save karta hai.','localStorage.setItem("theme","dark");'],
    ['JavaScript JSON','JSON data exchange ka text format hai. JSON.stringify aur JSON.parse conversion karte hain.','const text = JSON.stringify({ok:true});'],
    ['JavaScript Promises','Promise future mein complete hone wale async kaam ka result represent karta hai.','fetch("/data").then(r => r.json());'],
    ['JavaScript Async Await','async/await promise-based code ko readable banata hai.','async function load(){ const r=await fetch("/data"); return r.json(); }'],
    ['JavaScript Error Handling','try/catch errors ko handle karta hai taake app graceful response de.','try { risky(); } catch(err) { console.error(err); }']
  ];
  var steps=['Parichay aur maqsad','Syntax ko samjhein','Basic example','Attributes aur options','Aam ghaltiyan','Practical istemal','Doosre code ke saath istemal','Mobile aur responsive soch','Practice example','Revision aur mini project'];
  topics.forEach(function(t,ti){
    for(var j=0;j<10;j++){
      var n=courses.length+1;
      courses.push({title:t[0]+' – '+steps[j],topic:t[0],step:steps[j],explain:t[1],code:t[2],num:n});
    }
  });
  // Add extra distinct topics to reach exactly 500 lessons.
  var extras=[
    ['HTML Accessibility','Accessible HTML se screen reader aur keyboard users ko page samajhne aur chalane mein madad milti hai.','<button aria-label="Close">X</button>'],
    ['HTML Meta Tags','Meta tags page ki description, viewport aur character encoding batate hain.','<meta name="viewport" content="width=device-width, initial-scale=1">'],
    ['CSS Object Fit','object-fit image ya video ko box mein fit karta hai.','img { width:100%; height:200px; object-fit:cover; }'],
    ['CSS Clamp','clamp minimum, preferred aur maximum value ke darmiyan responsive size deta hai.','h1 { font-size:clamp(1.5rem,4vw,3rem); }'],
    ['CSS Transform','transform translate, rotate, scale aur skew se element ko visually badalta hai.','.box { transform:translateX(10px); }'],
    ['JavaScript Map','Map key-value collection hai jahan kisi bhi type ki key ho sakti hai.','const m = new Map(); m.set("a",1);'],
    ['JavaScript Set','Set unique values ka collection rakhta hai.','const unique = [...new Set([1,1,2])];'],
    ['JavaScript Modules','import aur export code ko alag reusable files mein organize karte hain.','export const appName = "IsrarLab";'],
    ['JavaScript Date','Date object current time aur dates ko read ya calculate karne mein kaam aata hai.','const today = new Date();'],
    ['JavaScript RegExp','Regular expression text mein pattern search aur validation karta hai.','const valid = /@/.test(email);']
  ];
  extras.forEach(function(t){
    for(var j=0;j<10;j++){
      courses.push({title:t[0]+' – '+steps[j],topic:t[0],step:steps[j],explain:t[1],code:t[2],num:courses.length+1});
    }
  });
  courses=courses.slice(0,500);
  function esc(v){return String(v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function highlighted(title,q){
    var safe=esc(title);if(!q)return safe;
    var at=title.toLowerCase().indexOf(q.toLowerCase());if(at<0)return safe;
    return esc(title.slice(0,at))+'<mark class="search-hit">'+esc(title.slice(at,at+q.length))+'</mark>'+esc(title.slice(at+q.length));
  }
  window.filterLearningList=function(kind){renderLearningList(kind);};
  window.renderLearningList=function(kind, boxId, searchId){
    var isP=kind==='practice',list=isP?practice:courses;
    var box=document.getElementById(boxId||(isP?'practiceResults':'courseResults'));
    var search=document.getElementById(searchId||(isP?'practiceSearch':'courseSearch'));
    if(!box)return;var q=search?(search.value||'').trim():'';
    var filtered=q?list.filter(function(x){return (x.title+' '+(x.task||'')+' '+(x.topic||'')).toLowerCase().indexOf(q.toLowerCase())>=0;}):list;
    box.innerHTML='';
    filtered.forEach(function(item){
      var b=document.createElement('button');b.type='button';b.className='learning-result-row';
      b.innerHTML='<span class="learning-result-number">'+item.num+'</span><span class="learning-result-title">'+highlighted(item.title,q)+'</span><span class="learning-result-kind">'+(isP?'TASK':'LESSON')+'</span>';
      b.addEventListener('click',function(){openDetail(kind,item);});box.appendChild(b);
    });
    if(!filtered.length)box.innerHTML='<div class="learning-empty">Is word se koi result nahi mila.</div>';
  };
  function openDetail(kind,item){
    var old=document.getElementById('learningDetailView');if(old)old.remove();
    var isP=kind==='practice',view=document.createElement('div');view.id='learningDetailView';view.className='learning-detail';view.style.display='flex';
    var body='';
    if(isP){
      body='<h2>Practice '+item.num+': '+esc(item.title)+'</h2><p><b>Aapka task:</b> '+esc(item.task)+'</p><p><b>Hint:</b> '+esc(item.hint)+'</p><textarea class="done-answer" id="practiceAnswer" rows="7" placeholder="Apna code ya jawab yahan likhein..."></textarea><button class="learning-done-btn" id="checkPracticeAnswer">Check Answer</button><div id="practiceFeedback"></div><h3>Example jawab</h3><pre>'+esc(item.answer)+'</pre><p>Apna jawab likhne ke baad Check Answer dabayein. Agar jawab mein zaroori code maujood ho to DONE status milega.</p>';
    }else{
      body='<h2>'+esc(item.topic)+'</h2><p><b>Lesson '+item.num+': '+esc(item.step)+'</b></p><p>'+esc(item.explain)+'</p><h3>Code example</h3><pre>'+esc(item.code)+'</pre><h3>Isay kaise samjhein?</h3><p>Sabse pehle example ko dhyan se dekhein. Phir code ko apne editor mein likhein, values badal kar result check karein. Chhote changes karke samjhein ke har line ka kya asar hota hai.</p><h3>Practice</h3><p>Isi concept ka apna chhota example banayein. Browser mein run karein aur dekhein ke output expected result de raha hai ya nahi.</p>';
    }
    view.innerHTML='<header class="learning-detail-head"><button type="button" id="learningDetailBack">← Back</button><strong>'+(isP?'Practice Task':'Course Lesson')+'</strong></header><article class="learning-detail-body">'+body+'</article>';
    document.body.appendChild(view);
    document.getElementById('learningDetailBack').onclick=function(){view.remove();};
    if(isP){
      document.getElementById('checkPracticeAnswer').onclick=function(){
        var val=(document.getElementById('practiceAnswer').value||'').toLowerCase(),fb=document.getElementById('practiceFeedback');
        if(val.indexOf(item.answer.toLowerCase())>=0){fb.innerHTML='<span class="learning-done-state">✓ DONE — Shabash! Aapka jawab match ho gaya.</span>';}
        else{fb.innerHTML='<span style="color:#d97706;font-weight:700">Abhi complete nahi hua. Hint aur task dobara dekhein.</span>';}
      };
    }
  }
  document.addEventListener('DOMContentLoaded',function(){renderLearningList('practice');renderLearningList('courses');});
})();


/* ===== SCRIPT 17 id=israrlab-preview-horizontal-fix ===== */
(function(){
  function fixPreviewLayout(){
    var pane=document.getElementById('windowPreviewPane');
    if(pane){pane.style.display=pane.style.display==='none'?'none':'flex';pane.style.flexDirection='row';pane.style.overflowX='auto';pane.style.overflowY='hidden';}
  }
  var oldPreview=window.showWindowHtmlPreview;
  if(typeof oldPreview==='function'){
    window.showWindowHtmlPreview=function(){oldPreview();fixPreviewLayout();};
  }
  document.addEventListener('DOMContentLoaded',function(){
    var pane=document.getElementById('windowPreviewPane');
    if(pane){pane.style.flexDirection='row';pane.style.overflowX='auto';pane.style.overflowY='hidden';}
    var ta=document.getElementById('htmlDivideFullCode');
    if(ta && !ta.value) ta.placeholder='Yahan HTML, CSS ya JavaScript code likhein...';
  });
})();


/* ===== SCRIPT 18 id=israrlab-window-preview-selector ===== */
(function(){
  var currentPreviewIndex=0;
  function getCards(){
    return Array.prototype.slice.call(document.querySelectorAll('#windowCodeWorkspace .window-code-card'));
  }
  function getCode(card){
    if(card && card.__cmEditor) return card.__cmEditor.getValue();
    var ta=card&&card.querySelector('textarea');return ta?ta.value:'';
  }
  function toDocument(raw){
    raw=String(raw||'');
    if(/<!doctype|<html[\s>]/i.test(raw)) return raw;
    var css='',js='',html=raw;
    if(/^\s*(?:[.#@*]|[a-z][\w-]*\s*\{)/i.test(raw)&&raw.indexOf('<')<0){
      css=raw;html='';
    }else if(/^\s*(?:function\s|const\s|let\s|var\s|document\.|console\.|alert\()/i.test(raw)&&raw.indexOf('<')<0){
      js=raw;html='';
    }
    return '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>'+css+'</style></head><body>'+html+(js?'<script>'+js+'<\/script>':'')+'</body></html>';
  }
  function renderPreview(index){
    var pane=document.getElementById('windowPreviewPane'),cards=getCards();
    if(!pane||!cards.length)return;
    currentPreviewIndex=Math.max(0,Math.min(index,cards.length-1));
    pane.innerHTML='';
    var nav=document.createElement('div');nav.className='window-preview-nav';
    var prev=document.createElement('button');prev.type='button';prev.textContent='‹ Prev';
    prev.disabled=currentPreviewIndex===0;prev.onclick=function(){renderPreview(currentPreviewIndex-1);};
    nav.appendChild(prev);
    cards.forEach(function(card,i){
      var b=document.createElement('button');b.type='button';b.textContent=String(i+1);
      if(i===currentPreviewIndex)b.className='active';
      b.setAttribute('aria-label','Preview window '+(i+1));
      b.onclick=function(){renderPreview(i);};nav.appendChild(b);
    });
    var next=document.createElement('button');next.type='button';next.textContent='Next ›';
    next.disabled=currentPreviewIndex===cards.length-1;next.onclick=function(){renderPreview(currentPreviewIndex+1);};
    nav.appendChild(next);
    pane.appendChild(nav);
    var stage=document.createElement('div');stage.className='window-preview-current';
    var title=document.createElement('div');title.className='window-preview-current-title';
    title.textContent='Preview – Window '+(currentPreviewIndex+1)+' of '+cards.length;
    var frame=document.createElement('iframe');frame.title=title.textContent;
    frame.setAttribute('sandbox','allow-scripts allow-forms allow-modals');
    frame.srcdoc=toDocument(getCode(cards[currentPreviewIndex]));
    stage.appendChild(title);stage.appendChild(frame);pane.appendChild(stage);
    var host=document.getElementById('windowCodeWorkspace'),strip=document.getElementById('windowTabStrip');
    if(host)host.style.display='none';if(strip)strip.style.display='none';
    pane.style.display='flex';pane.style.flexDirection='column';
    pane.style.overflow='hidden';pane.style.minHeight='0';
  }
  window.showWindowHtmlPreview=function(){renderPreview(currentPreviewIndex);};
  window.showWindowPreviewAt=function(index){renderPreview(index);};
  var oldSelect=window.selectWindowCode;
  window.selectWindowCode=function(index){
    if(typeof oldSelect==='function')oldSelect(index);
    currentPreviewIndex=index||0;
  };
  document.addEventListener('DOMContentLoaded',function(){
    var pane=document.getElementById('windowPreviewPane');
    if(pane){pane.style.flexDirection='column';pane.style.overflow='hidden';}
  });
})();


/* ===== SCRIPT 19 id=israrlab-url-code-course-controller ===== */
(function(){
'use strict';
function el(id){return document.getElementById(id)}
window.switchDivideMode=function(mode){
 document.querySelectorAll('#panel-html-divide .divide-mode-tab').forEach(function(b){b.classList.toggle('active',b.getAttribute('data-mode')===mode)});
 document.querySelectorAll('#panel-html-divide .divide-mode-pane').forEach(function(p){p.classList.remove('active');p.style.display='none'});
 var id='divideMode'+mode.charAt(0).toUpperCase()+mode.slice(1),pane=el(id);
 if(pane){pane.classList.add('active');pane.style.display='block'}
 if(mode==='multiple')window.openFullHtmlDividePreview();
 if(mode==='courses')window.switchCourseSubTab('courses');
 if(mode==='divide'&&window.paintDivideCode)setTimeout(window.paintDivideCode,60);
};
window.switchCourseSubTab=function(which){
 var practice=which==='practice',p=el('coursePracticePane'),c=el('courseLessonsPane');
 if(p)p.style.display=practice?'block':'none';if(c)c.style.display=practice?'none':'block';
 if(el('coursePracticeTab'))el('coursePracticeTab').classList.toggle('active',practice);
 if(el('courseLessonsTab'))el('courseLessonsTab').classList.toggle('active',!practice);
 if(window.renderLearningList)window.renderLearningList(practice?'practice':'courses');
};
window.fetchUrlSourceCode=async function(){
  var input=document.getElementById('sourceUrlInput');
  var output=document.getElementById('urlCodeOutput');
  var status=document.getElementById('urlCodeStatus');
  var btn=document.getElementById('fetchUrlCodeBtn');
  if(!input||!output||!status)return;
  var raw=(input.value||'').trim();
  if(!raw){status.className='url-code-status error';status.textContent='Pehle website URL dalein.';input.focus();return;}
  if(!/^https?:\/\//i.test(raw)) raw='https://'+raw;
  var url;
  try{url=new URL(raw);if(url.protocol!=='http:'&&url.protocol!=='https:')throw new Error('bad');}
  catch(e){status.className='url-code-status error';status.textContent='Sahi http:// ya https:// URL dalein.';return;}

  function setFetching(on){
    if(!btn)return;
    if(on){
      btn.classList.add('is-fetching');
      btn.disabled=true;
      btn.innerHTML='<span class="fetch-spinner" style="display:inline-block"></span>';
    }else{
      btn.classList.remove('is-fetching');
      btn.disabled=false;
      btn.innerHTML='<span class="fetch-btn-label"><i class="fas fa-download"></i> Fetch</span><span class="fetch-spinner"></span>';
    }
  }

  var target=url.href;
  /* jina.ai + allorigins + corsproxy — public pages ke liye */
  var endpoints=[
    {u:'https://api.allorigins.win/raw?url='+encodeURIComponent(target), type:'html'},
    {u:'https://api.allorigins.win/get?url='+encodeURIComponent(target), type:'allorigins'},
    {u:'https://corsproxy.io/?'+encodeURIComponent(target), type:'html'},
    {u:'https://api.codetabs.com/v1/proxy?quest='+encodeURIComponent(target), type:'html'},
    {u:'https://cors.isomorphic-git.org/'+target, type:'html'},
    {u:'https://api.codetabs.com/v1/proxy?quest='+encodeURIComponent(target)+'&fullpage=1', type:'html'},
    {u:'https://r.jina.ai/'+target, type:'jina'}
  ];

  setFetching(true);
  status.className='url-code-status';
  status.textContent='Source code fetch ho raha hai...';
  output.value='';

  function extractBody(textBody, type){
    if(!textBody) return '';
    var s=String(textBody);
    if(type==='allorigins'){
      try{var j=JSON.parse(s); if(j&&typeof j.contents==='string') s=j.contents;}catch(e){}
    }
    if(type==='jina'){
      /* jina often returns markdown - only keep if looks like HTML */
      if(s.indexOf('<html')===-1 && s.indexOf('<!DOCTYPE')===-1 && s.indexOf('<body')===-1){
        return ''; /* reject pure markdown so other proxies can win */
      }
    }
    /* prefer real HTML */
    return s;
  }

  var source='';
  for(var i=0;i<endpoints.length;i++){
    try{
      status.textContent='Try '+(i+1)+'/'+endpoints.length+'...';
      var controller=typeof AbortController!=='undefined'?new AbortController():null;
      var timer=controller?setTimeout(function(){try{controller.abort();}catch(e){}},12000):null;
      var response=await fetch(endpoints[i].u,{
        method:'GET', mode:'cors', credentials:'omit', redirect:'follow', cache:'no-store',
        signal:controller?controller.signal:undefined,
        headers:{'Accept':'text/html,application/xhtml+xml,text/plain,application/json,*/*'}
      });
      if(timer)clearTimeout(timer);
      if(!response.ok) throw new Error('HTTP '+response.status);
      var textBody=await response.text();
      var extracted=extractBody(textBody, endpoints[i].type);
      if(extracted && extracted.trim().length>40){
        var low=extracted.toLowerCase();
        var looksHtml = low.indexOf('<html')>=0 || low.indexOf('<!doctype')>=0 || low.indexOf('<body')>=0 || low.indexOf('<div')>=0;
        if(looksHtml || endpoints[i].type!=='jina'){ source=extracted; if(looksHtml) break; }
        else throw new Error('not html');
      } else throw new Error('empty');
    }catch(e){}
  }

  if(source){
    output.value=source;
    status.className='url-code-status success';
    status.textContent='Source mil gaya — '+source.length.toLocaleString()+' characters.';
  }else{
    status.className='url-code-status error';
    status.textContent='Fetch nahi hua. Koi public page try karein (CORS block ho sakta hai).';
  }
  setFetching(false);
};

window.previewFetchedUrlCode=function(){
  var output=document.getElementById('urlCodeOutput');
  var code=output?(output.value||'').trim():'';
  if(!code){ try{if(typeof showToast==='function')showToast('Pehle URL fetch karein');}catch(e){} return; }
  var w=window.open('','_blank');
  if(!w){ alert('Popup blocked'); return; }
  try{
    w.document.open();
    w.document.write(code);
    w.document.close();
  }catch(e){
    /* fallback blob */
    try{
      var blob=new Blob([code],{type:'text/html'});
      var u=URL.createObjectURL(blob);
      w.location.href=u;
    }catch(e2){ alert('Preview fail'); }
  }
};

window.copyFetchedUrlCode=function(){
  var output=document.getElementById('urlCodeOutput');
  var code=output?(output.value||''):'';
  if(!code){ try{if(typeof showToast==='function')showToast('Kuch copy karne ko nahi');}catch(e){} return; }
  if(navigator.clipboard&&navigator.clipboard.writeText){
    navigator.clipboard.writeText(code).then(function(){ try{if(typeof showToast==='function')showToast('Copied');}catch(e){} });
  }else{
    output.select(); document.execCommand('copy');
    try{if(typeof showToast==='function')showToast('Copied');}catch(e){}
  }
};
window.copyFetchedUrlCode=async function(){var out=el('urlCodeOutput'),status=el('urlCodeStatus');if(!out||!out.value){if(status){status.className='url-code-status error';status.textContent='Pehle code Fetch karein.'}return}try{await navigator.clipboard.writeText(out.value);status.className='url-code-status success';status.textContent='Pura source code copy ho gaya.'}catch(e){out.focus();out.select();try{document.execCommand('copy');status.className='url-code-status success';status.textContent='Source code copy ho gaya.'}catch(x){status.className='url-code-status error';status.textContent='Copy nahi hua. Code select karke copy karein.'}}};
})();


/* ===== SCRIPT 20 id=israrlab-multi-html-hard-fix ===== */
(function(){
  function cards(){return Array.prototype.slice.call(document.querySelectorAll('#windowCodeWorkspace .window-code-card'));}
  function read(card){
    if(card && card.__cmEditor){ try{return card.__cmEditor.getValue();}catch(e){} }
    var ta=card&&card.querySelector('textarea'); return ta?ta.value:'';
  }
  function toDoc(raw){
    raw=String(raw||'');
    if(!raw.trim()) return '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="font-family:sans-serif;padding:16px;color:#666;">Code box khali hai. Pehle code likhein.</body></html>';
    if(/<!doctype|<html[\s>]/i.test(raw)) return raw;
    var css='', js='', html=raw;
    var looksCss = /^\s*(?:[.#@*]|:root|[a-z][\w-]*\s*\{)/i.test(raw) && raw.indexOf('<')<0;
    var looksJs = /^\s*(?:function\s|const\s|let\s|var\s|document\.|console\.|alert\(|window\.)/i.test(raw) && raw.indexOf('<')<0;
    if(looksCss){ css=raw; html=''; }
    else if(looksJs){ js=raw; html=''; }
    else if(/<style\b/i.test(raw) || /<script\b/i.test(raw)){
      /* mixed fragment: wrap as body content */
      html=raw;
    }
    return '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>html,body{margin:0;padding:0;min-height:100%;}body{font-family:system-ui,sans-serif;padding:12px;box-sizing:border-box;}'+css+'</style></head><body>'+html+(js?'<script>'+js+'<\/script>':'')+'</body></html>';
  }
  var currentPreviewIndex=0;

  window.closeHtmlDivideFullView=function(){
    var view=document.getElementById('htmlDivideFullView');
    if(view){
      view.setAttribute('data-open','0');
      view.removeAttribute('style');
      view.style.cssText='display:none !important; visibility:hidden !important; pointer-events:none !important;';
    }
    document.body.classList.remove('subview-active');
    try{
      if(typeof window.switchMainSection==='function') window.switchMainSection('html-divide');
      document.querySelectorAll('#panel-html-divide .divide-mode-tab').forEach(function(b){
        b.classList.toggle('active', b.getAttribute('data-mode')==='multiple');
      });
      document.querySelectorAll('#panel-html-divide .divide-mode-pane').forEach(function(p){
        var isMulti=(p.id==='divideModeMultiple');
        p.classList.toggle('active', isMulti);
        p.style.display=isMulti?'block':'none';
      });
    }catch(e){}
    var v2=document.getElementById('htmlDivideFullView');
    if(v2){
      v2.setAttribute('data-open','0');
      v2.style.cssText='display:none !important;';
    }
    document.body.classList.remove('subview-active');
  };;

  window.showWindowCodeWorkspace=function(){
    var pane=document.getElementById('windowPreviewPane');
    var host=document.getElementById('windowCodeWorkspace');
    var strip=document.getElementById('windowTabStrip');
    var view=document.getElementById('htmlDivideFullView');
    if(view){view.setAttribute('data-open','1');view.style.cssText='display:flex !important;flex-direction:column !important;position:fixed !important;inset:0 !important;z-index:1000040 !important;';}
    if(pane){pane.style.setProperty('display','none','important');}
    if(host){
      host.style.setProperty('display','flex','important');
      host.style.setProperty('flex','1 1 auto','important');
      host.style.setProperty('min-height','0','important');
      host.style.setProperty('overflow','hidden','important');
    }
    if(strip){strip.style.setProperty('display','flex','important');}
    var all=cards();
    var idx=window.__selectedWindowIndex||0;
    idx=Math.max(0,Math.min(idx, Math.max(0,all.length-1)));
    window.__selectedWindowIndex=idx;
    all.forEach(function(c,i){
      if(i===idx){
        c.style.setProperty('display','flex','important');
        c.style.setProperty('flex','1 1 auto','important');
        c.style.setProperty('min-height','0','important');
        c.style.setProperty('height','100%','important');
        c.style.setProperty('flex-direction','column','important');
      } else {
        c.style.setProperty('display','none','important');
      }
    });
    document.querySelectorAll('#windowTabStrip .window-tab').forEach(function(b,i){b.classList.toggle('active',i===idx);});
    var card=all[idx];
    if(card && card.__cmEditor){
      setTimeout(function(){try{card.__cmEditor.setSize('100%','100%');card.__cmEditor.refresh();}catch(e){}},30);
      setTimeout(function(){try{card.__cmEditor.refresh();}catch(e){}},150);
    }
  };

  window.showWindowHtmlPreview=function(){
    var pane=document.getElementById('windowPreviewPane');
    var host=document.getElementById('windowCodeWorkspace');
    var strip=document.getElementById('windowTabStrip');
    var all=cards();
    if(!pane||!all.length)return;
    if(typeof window.__selectedWindowIndex==='number') currentPreviewIndex=window.__selectedWindowIndex;
    currentPreviewIndex=Math.max(0,Math.min(currentPreviewIndex,all.length-1));
    window.__selectedWindowIndex=currentPreviewIndex;

    pane.innerHTML='';
    var nav=document.createElement('div');nav.className='window-preview-nav';
    var prev=document.createElement('button');prev.type='button';prev.textContent='‹ Prev';
    prev.disabled=currentPreviewIndex===0;
    prev.onclick=function(){currentPreviewIndex=Math.max(0,currentPreviewIndex-1);window.__selectedWindowIndex=currentPreviewIndex;window.showWindowHtmlPreview();};
    nav.appendChild(prev);
    all.forEach(function(card,i){
      var b=document.createElement('button');b.type='button';b.textContent=String(i+1);
      if(i===currentPreviewIndex)b.className='active';
      b.onclick=function(){currentPreviewIndex=i;window.__selectedWindowIndex=i;window.showWindowHtmlPreview();};
      nav.appendChild(b);
    });
    var next=document.createElement('button');next.type='button';next.textContent='Next ›';
    next.disabled=currentPreviewIndex===all.length-1;
    next.onclick=function(){currentPreviewIndex=Math.min(all.length-1,currentPreviewIndex+1);window.__selectedWindowIndex=currentPreviewIndex;window.showWindowHtmlPreview();};
    nav.appendChild(next);
    pane.appendChild(nav);

    var stage=document.createElement('div');stage.className='window-preview-current';
    var title=document.createElement('div');title.className='window-preview-current-title';
    title.textContent='Preview – Window '+(currentPreviewIndex+1)+' of '+all.length;
    var frame=document.createElement('iframe');
    frame.title=title.textContent;
    /* allow scripts so page can run */
    frame.setAttribute('sandbox','allow-scripts allow-forms allow-modals allow-same-origin allow-popups');
    frame.style.cssText='flex:1 1 auto;width:100%;min-height:0;height:100%;border:0;background:#fff;display:block;';
    var code=read(all[currentPreviewIndex]);
    try{ frame.srcdoc=toDoc(code); }catch(e){
      frame.srcdoc='<!doctype html><html><body style="font-family:sans-serif;padding:16px;color:#c00;">Preview error</body></html>';
    }
    stage.appendChild(title);stage.appendChild(frame);pane.appendChild(stage);

    if(host) host.style.setProperty('display','none','important');
    if(strip) strip.style.setProperty('display','none','important');
    pane.style.setProperty('display','flex','important');
    pane.style.setProperty('flex','1 1 auto','important');
    pane.style.setProperty('flex-direction','column','important');
    pane.style.setProperty('min-height','0','important');
    pane.style.setProperty('overflow','hidden','important');
  };

  window.selectWindowCode=function(index){
    var all=cards(); if(!all.length) return;
    index=Math.max(0,Math.min(index,all.length-1));
    window.__selectedWindowIndex=index;
    currentPreviewIndex=index;
    document.querySelectorAll('#windowTabStrip .window-tab').forEach(function(b,i){b.classList.toggle('active',i===index);});
    var pane=document.getElementById('windowPreviewPane');
    var previewOn=pane && getComputedStyle(pane).display!=='none' && pane.querySelector('iframe');
    if(previewOn) window.showWindowHtmlPreview();
    else window.showWindowCodeWorkspace();
  };

  /* Make sure Back button always bound */
  document.addEventListener('click', function(ev){
    var t=ev.target;
    if(!t) return;
    var btn=t.closest ? t.closest('.pv-back, button.pv-back') : null;
    if(btn && btn.closest && btn.closest('#htmlDivideFullView')){
      ev.preventDefault();
      window.closeHtmlDivideFullView();
    }
  }, true);

})();


/* ===== SCRIPT 21 id=israrlab-course-full-js ===== */
(function(){
  function el(id){return document.getElementById(id);}
  window.openCourseFullView=function(tab){
    var view=el('courseFullView');
    if(!view)return;
    view.setAttribute('data-open','1');
    view.style.cssText='display:flex !important;flex-direction:column !important;';
    document.body.classList.add('subview-active');
    window.switchCourseFullTab(tab||'courses');
  };
  window.closeCourseFullView=function(){
    var view=el('courseFullView');
    if(view){
      view.setAttribute('data-open','0');
      view.style.cssText='display:none !important;';
    }
    document.body.classList.remove('subview-active');
    try{
      if(typeof window.switchMainSection==='function') window.switchMainSection('html-divide');
      document.querySelectorAll('#panel-html-divide .divide-mode-tab').forEach(function(b){
        b.classList.toggle('active', b.getAttribute('data-mode')==='courses');
      });
      document.querySelectorAll('#panel-html-divide .divide-mode-pane').forEach(function(p){
        var on=p.id==='divideModeCourses';
        p.classList.toggle('active', on);
        p.style.display=on?'block':'none';
      });
    }catch(e){}
  };
  window.switchCourseFullTab=function(which){
    var isP=which==='practice';
    var p=el('courseFullPracticePane'), c=el('courseFullCoursesPane');
    if(p)p.style.display=isP?'flex':'none';
    if(c)c.style.display=isP?'none':'flex';
    var bp=el('courseFullPracticeBtn'), bc=el('courseFullCoursesBtn');
    if(bp)bp.classList.toggle('active', isP);
    if(bc)bc.classList.toggle('active', !isP);
    window.filterLearningListFull(isP?'practice':'courses');
  };
  window.filterLearningListFull=function(kind){
    try{
      if(typeof window.renderLearningList==='function'){
        var boxId = kind==='practice' ? 'practiceResultsFull' : 'courseResultsFull';
        var searchId = kind==='practice' ? 'practiceSearchFull' : 'courseSearchFull';
        window.renderLearningList(kind, boxId, searchId);
      }
    }catch(e){ console.warn(e); }
  };

  /* Hook switchDivideMode for courses */
  var prevSwitch=window.switchDivideMode;
  window.switchDivideMode=function(mode){
    if(typeof prevSwitch==='function') prevSwitch(mode);
    if(mode==='courses'){
      window.openCourseFullView('courses');
    }
  };
})();


/* ===== SCRIPT 22 id=israrlab-divide-editor-boot ===== */
(function(){
  var divideEditor=null;
  function initDivideEditor(){
    var ta=document.getElementById('htmlDivideSource');
    if(!ta || typeof CodeMirror==='undefined') return null;
    var existing=document.querySelector('#divideModeDivide .divide-editor-shell .CodeMirror');
    if(existing && existing.CodeMirror){
      divideEditor=existing.CodeMirror;
      try{divideEditor.setOption('theme', document.body.classList.contains('light-mode')?'default':'material-darker'); divideEditor.refresh();}catch(e){}
      return divideEditor;
    }
    if(divideEditor){
      try{divideEditor.refresh(); divideEditor.setSize('100%','100%');}catch(e){}
      return divideEditor;
    }
    try{
      divideEditor=CodeMirror.fromTextArea(ta,{
        mode:'htmlmixed',
        theme: document.body.classList.contains('light-mode')?'default':'material-darker',
        lineNumbers:true,
        lineWrapping:true,
        indentUnit:2,
        tabSize:2,
        matchBrackets:true,
        viewportMargin:30,
        extraKeys:{'Tab':function(cm){cm.replaceSelection('  ','end');}}
      });
      divideEditor.setSize('100%','100%');
      setTimeout(function(){try{divideEditor.refresh();}catch(e){}},80);
      setTimeout(function(){try{divideEditor.refresh();}catch(e){}},250);
    }catch(e){ console.warn('divide CM', e); divideEditor=null; }
    return divideEditor;
  }
  window.initDivideEditor=initDivideEditor;
  window.paintDivideCode=function(){initDivideEditor();};
  window.getDivideEditorCode=function(){
    try{ if(divideEditor) return divideEditor.getValue()||''; }catch(e){}
    try{
      var host=document.querySelector('#divideModeDivide .divide-editor-shell .CodeMirror');
      if(host&&host.CodeMirror) return host.CodeMirror.getValue()||'';
    }catch(e){}
    var ta=document.getElementById('htmlDivideSource');
    return ta?(ta.value||''):'';
  };
  document.addEventListener('DOMContentLoaded', function(){ setTimeout(initDivideEditor, 50); });
  window.addEventListener('load', function(){ setTimeout(initDivideEditor, 100); });
  /* also when switching to divide */
  var prev=window.switchDivideMode;
  window.switchDivideMode=function(mode){
    if(typeof prev==='function') prev(mode);
    if(mode==='divide') setTimeout(initDivideEditor, 40);
    if(mode==='courses' && typeof window.openCourseFullView==='function'){
      /* openCourse already hooked in other script */
    }
  };
})();


/* ===== SCRIPT 23 id=israrlab-gen-preview-js ===== */
(function(){
  /* moved */

  /* Category notes panel under chips */
  window.renderCategoryNotesPanel = function(){ return; /* perf disabled */
    var host = document.getElementById('categoryNotesHostDisabled');
    if(!host) return;
    var filter = (typeof currentCategoryFilter!=='undefined') ? currentCategoryFilter : 'All';
    var list = (typeof notes!=='undefined' && notes) ? notes : [];
    var filtered = filter==='All' ? list.slice() : list.filter(function(n){ return (n.category||'')===filter; });
    if(!filtered.length){
      host.innerHTML = '<p style="font-size:12px;color:var(--muted);padding:12px 4px;margin:0;">Is category me koi card nahi. Card → Settings → Category se assign karein.</p>';
      return;
    }
    var html = '<div class="category-cards-list" style="display:grid;gap:10px;">';
    filtered.forEach(function(n){
      var idx = list.indexOf(n);
      var title = (n.title||'Untitled').replace(/</g,'&lt;');
      var cat = (n.category||'—').replace(/</g,'&lt;');
      html += '<div class="note-card" style="padding:12px;border:1px solid var(--border);border-radius:12px;background:var(--card-bg);">'+
        '<div style="font-weight:800;margin-bottom:4px;">'+title+'</div>'+
        '<div style="font-size:11px;color:var(--muted);margin-bottom:8px;">📁 '+cat+'</div>'+
        '<div style="display:flex;gap:6px;flex-wrap:wrap;">'+
        '<button type="button" class="top-btn" style="height:32px;font-size:11px;" onclick="try{openEditor('+idx+')}catch(e){}">Edit</button>'+
        '<button type="button" class="top-btn" style="height:32px;font-size:11px;" onclick="try{previewNote('+idx+')}catch(e){}">Preview</button>'+
        '</div></div>';
    });
    html += '</div>';
    host.innerHTML = html;
  };

  var prevSwitch = window.switchMainSection;
  window.switchMainSection = function(sec){
    if(typeof prevSwitch==='function') prevSwitch(sec);
    if(sec==='category'){
      setTimeout(function(){ try{ window.renderCategoryNotesPanel(); }catch(e){} }, 60);
    }
  };
})();


/* ===== SCRIPT 24 id=israrlab-divide3-url-multi-js ===== */
(function(){
  function el(id){ return document.getElementById(id); }
  function toast(m){ try{ if(typeof showToast==='function') showToast(m); else console.log(m);}catch(e){} }

  function getPart(id){
    var n=el(id); if(!n) return '';
    try{
      var host=n.parentElement && n.parentElement.querySelector('.CodeMirror');
      if(host&&host.CodeMirror) return host.CodeMirror.getValue()||'';
    }catch(e){}
    return n.value||'';
  }

  function buildCombined(){
    var html=getPart('htmlDivideHtml');
    var css=getPart('htmlDivideCss');
    var js=getPart('htmlDivideJs');
    return '<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>'+css+'</style></head><body>'+html+'\n<script>'+js+'<\/script></body></html>';
  }

  window.openHtmlDivideFullPreview=function(){
    var html=getPart('htmlDivideHtml');
    var css=getPart('htmlDivideCss');
    var js=getPart('htmlDivideJs');
    if(!html && !css && !js){
      /* try source before generate */
      var src = (typeof window.getDivideEditorCode==='function') ? window.getDivideEditorCode() : '';
      if(!src){ toast('Pehle code generate karein'); return; }
      html = src;
    }
    var doc = buildCombined();
    var view=el('htmlDividePreviewView');
    var frame=el('htmlDividePreviewFrame');
    if(!view||!frame){ toast('Preview view missing'); return; }
    view.setAttribute('data-open','1');
    view.style.cssText='display:flex !important;flex-direction:column !important;';
    document.body.classList.add('subview-active');
    try{ frame.srcdoc = doc; }catch(e){
      try{ frame.contentDocument.open(); frame.contentDocument.write(doc); frame.contentDocument.close(); }catch(e2){}
    }
  };

  window.closeHtmlDividePreviewView=function(){
    var view=el('htmlDividePreviewView');
    var frame=el('htmlDividePreviewFrame');
    if(view){ view.setAttribute('data-open','0'); view.style.cssText='display:none !important;'; }
    if(frame){ try{ frame.srcdoc=''; }catch(e){} }
    document.body.classList.remove('subview-active');
  };

  /* Generate with spinner */
  var prevRun = window.runHtmlDivide;
  window.runHtmlDivide = function(){
    var btn = el('htmlDivideGenerateBtn');
    if(btn){
      btn.classList.add('is-generating');
      btn.disabled = true;
    }
    var start = Date.now();
    setTimeout(function(){
      try{ if(typeof prevRun==='function') prevRun(); }catch(e){ console.warn(e); }
      var left = Math.max(0, 1600 - (Date.now()-start));
      setTimeout(function(){
        if(btn){ btn.classList.remove('is-generating'); btn.disabled=false; }
        var grid=el('htmlDivideResults');
        if(grid){ grid.style.display='grid'; grid.setAttribute('data-hidden','0'); grid.classList.remove('is-hidden'); }
      }, left);
    }, 30);
  };

  window.saveHtmlDivideToHistory=function(){
    var html=getPart('htmlDivideHtml');
    var css=getPart('htmlDivideCss');
    var js=getPart('htmlDivideJs');
    var src = (typeof window.getDivideEditorCode==='function') ? window.getDivideEditorCode() : '';
    var combined = (html||css||js) ? buildCombined() : (src||'');
    if(!combined || !combined.trim()){ toast('Save karne ke liye code nahi'); return; }
    try{
      if(typeof notes==='undefined'){ toast('Notes system nahi mila'); return; }
      var title = 'Code Divide ' + new Date().toLocaleString();
      var now = Date.now();
      var note = {
        id: 'cd_'+now,
        title: title,
        htmlCode: combined,
        category: 'Code Divide',
        createdAt: now,
        updatedAt: now,
        updateCount: 1,
        isPinned: false
      };
      notes.unshift(note);
      try{ if(typeof saveData==='function') saveData(); else localStorage.setItem('notes', JSON.stringify(notes)); }catch(e){}
      try{ if(typeof renderNotes==='function') renderNotes(); }catch(e){}
      try{ if(typeof renderCategories==='function') renderCategories(); }catch(e){}
      toast('History me save ho gaya');
    }catch(e){ console.warn(e); toast('Save fail'); }
  };

  /* URL in-box preview (no new tab) */
  window.previewFetchedUrlCode=function(){
    var output=el('urlCodeOutput');
    var frame=el('urlCodePreviewFrame');
    var code=output?(output.value||'').trim():'';
    if(!code){ toast('Pehle fetch karein ya code paste karein'); return; }
    if(!frame){ toast('Preview frame missing'); return; }
    frame.style.display='block';
    try{ frame.srcdoc = code; }catch(e){
      try{ frame.contentDocument.open(); frame.contentDocument.write(code); frame.contentDocument.close(); }catch(e2){}
    }
    /* hide textarea briefly? keep both - show frame above textarea */
    toast('Preview box me dikh raha hai');
  };

  /* Multi HTML Save → Home history */
  var prevSave = window.saveMultipleHtmlWindows;
  window.saveMultipleHtmlWindows=function(){
    try{
      /* also local store */
      if(typeof prevSave==='function'){ try{ prevSave(); }catch(e){} }
      var cards = document.querySelectorAll('#windowCodeWorkspace .window-code-card, #htmlDivideFullView .window-code-card');
      var parts = [];
      cards.forEach(function(card, i){
        var code = '';
        try{
          if(card.__cmEditor) code = card.__cmEditor.getValue()||'';
          else {
            var ta = card.querySelector('textarea');
            if(ta) code = ta.value||'';
          }
        }catch(e){}
        if(code && code.trim()) parts.push('<!-- Window '+(i+1)+' -->\n'+code);
      });
      if(!parts.length){
        var ta0 = el('htmlDivideFullCode');
        if(ta0 && ta0.value.trim()) parts.push(ta0.value);
      }
      if(!parts.length){ toast('Save ke liye code nahi'); return; }
      var combined = parts.join('\n\n');
      if(typeof notes==='undefined'){ toast('Notes system nahi'); return; }
      var now = Date.now();
      var note = {
        id: 'mh_'+now,
        title: 'Multiple HTML ' + new Date().toLocaleString(),
        htmlCode: combined,
        category: 'Multiple HTML',
        createdAt: now,
        updatedAt: now,
        updateCount: 1,
        isPinned: false,
        multiWindows: true
      };
      notes.unshift(note);
      try{ if(typeof saveData==='function') saveData(); else localStorage.setItem('notes', JSON.stringify(notes)); }catch(e){}
      try{ if(typeof renderNotes==='function') renderNotes(); }catch(e){}
      toast('Home history me save ho gaya');
    }catch(e){ console.warn(e); toast('Save fail'); }
  };
})();


/* ===== SCRIPT 25 id=israrlab-full-cut-url-js ===== */
(function(){
  function el(id){return document.getElementById(id);}
  function toast(m){try{if(typeof showToast==='function')showToast(m);}catch(e){}}

  /* Full code preview = source box full code */
  window.openHtmlDivideSourcePreview=function(){
    var src='';
    try{ if(typeof window.getDivideEditorCode==='function') src=window.getDivideEditorCode()||''; }catch(e){}
    if(!src.trim()){
      var ta=el('htmlDivideSource');
      if(ta) src=ta.value||'';
    }
    if(!src.trim()){ toast('Pehle code box me code dalein'); return; }
    var view=el('htmlDividePreviewView');
    var frame=el('htmlDividePreviewFrame');
    if(!view||!frame){ toast('Preview view missing'); return; }
    view.setAttribute('data-open','1');
    view.style.cssText='display:flex !important;flex-direction:column !important;';
    document.body.classList.add('subview-active');
    try{ frame.srcdoc=src; }catch(e){
      try{frame.contentDocument.open();frame.contentDocument.write(src);frame.contentDocument.close();}catch(e2){}
    }
  };

  /* URL preview toggles same box */
  window.previewFetchedUrlCode=function(){
    var output=el('urlCodeOutput');
    var frame=el('urlCodePreviewFrame');
    var stage=el('urlCodeStage');
    var code=output?(output.value||'').trim():'';
    if(!code){ toast('Pehle fetch/paste karein'); return; }
    if(!frame){ toast('Preview frame missing'); return; }
    if(stage && stage.classList.contains('is-previewing')){
      /* toggle back to code */
      stage.classList.remove('is-previewing');
      try{frame.srcdoc='';}catch(e){}
      var btn=document.querySelector('.url-code-output-head button[onclick*="previewFetchedUrlCode"]');
      if(btn) btn.innerHTML='<i class="fas fa-eye"></i> Preview';
      return;
    }
    if(stage) stage.classList.add('is-previewing');
    try{ frame.srcdoc=code; }catch(e){
      try{frame.contentDocument.open();frame.contentDocument.write(code);frame.contentDocument.close();}catch(e2){}
    }
    var btn=document.querySelector('.url-code-output-head button[onclick*="previewFetchedUrlCode"]');
    if(btn) btn.innerHTML='<i class="fas fa-code"></i> Code';
  };

  /* Don't render farzi category cards */
  window.renderCategoryNotesPanel=function(){
    var host=el('categoryNotesHostDisabled');
    if(host) host.innerHTML='';
  };
})();


/* ===== SCRIPT 26 id=israrlab-url-reset-save-cut-js ===== */
(function(){
  function el(id){return document.getElementById(id);}
  function toast(m){try{if(typeof showToast==='function')showToast(m);}catch(e){console.log(m);}}

  window.resetFetchedUrlCode=function(){
    var output=el('urlCodeOutput');
    var frame=el('urlCodePreviewFrame');
    var stage=el('urlCodeStage');
    var status=el('urlCodeStatus');
    if(output) output.value='';
    if(frame){ try{frame.srcdoc='';}catch(e){} frame.removeAttribute('srcdoc'); }
    if(stage) stage.classList.remove('is-previewing');
    if(status){ status.className='url-code-status'; status.textContent=''; }
    var btn=document.querySelector('.url-code-output-head button[onclick*="previewFetchedUrlCode"]');
    if(btn) btn.innerHTML='<i class="fas fa-eye"></i> Preview';
    toast('Reset ho gaya');
  };

  window.saveFetchedUrlCode=function(){
    var output=el('urlCodeOutput');
    var code=output?(output.value||'').trim():'';
    if(!code){ toast('Save ke liye code nahi'); return; }
    try{
      if(typeof notes==='undefined'){ toast('Notes system nahi mila'); return; }
      var input=el('sourceUrlInput');
      var url=(input&&input.value)?input.value.trim():'';
      var now=Date.now();
      var title = url ? ('URL: '+url.replace(/^https?:\/\//,'').slice(0,40)) : ('URL Code '+new Date().toLocaleString());
      var note={
        id:'url_'+now,
        title:title,
        htmlCode:code,
        category:'URL Code',
        createdAt:now,
        updatedAt:now,
        updateCount:1,
        isPinned:false
      };
      notes.unshift(note);
      try{ if(typeof saveData==='function') saveData(); else localStorage.setItem('notes', JSON.stringify(notes)); }catch(e){}
      try{ if(typeof renderNotes==='function') renderNotes(); }catch(e){}
      toast('History me save ho gaya');
    }catch(e){ console.warn(e); toast('Save fail'); }
  };

  /* Stronger combined builder for Cutting Preview - ensures CSS/JS actually run */
  function getPart(id){
    var n=el(id); if(!n) return '';
    try{
      var host=n.parentElement && n.parentElement.querySelector('.CodeMirror');
      if(host&&host.CodeMirror) return host.CodeMirror.getValue()||'';
    }catch(e){}
    /* also search nearby */
    try{
      var box=n.closest('.html-divide-box')||n.parentElement;
      var cm=box && box.querySelector('.CodeMirror');
      if(cm&&cm.CodeMirror) return cm.CodeMirror.getValue()||'';
    }catch(e){}
    return n.value||'';
  }

  function buildCombinedSafe(){
    var html=getPart('htmlDivideHtml')||'';
    var css=getPart('htmlDivideCss')||'';
    var js=getPart('htmlDivideJs')||'';

    /* if html already full document, inject css/js into it */
    var low=html.toLowerCase();
    var isFull = low.indexOf('<html')>=0 || low.indexOf('<!doctype')>=0;

    if(isFull){
      var doc=html;
      if(css){
        if(/<\/head>/i.test(doc)){
          doc=doc.replace(/<\/head>/i, '<style id="israr-cut-css">\n'+css+'\n</style>\n</head>');
        }else{
          doc='<style id="israr-cut-css">\n'+css+'\n</style>\n'+doc;
        }
      }
      if(js){
        if(/<\/body>/i.test(doc)){
          doc=doc.replace(/<\/body>/i, '<script id="israr-cut-js">\n'+js+'\n<\/script>\n</body>');
        }else{
          doc=doc+'\n<script id="israr-cut-js">\n'+js+'\n<\/script>';
        }
      }
      return doc;
    }

    /* partial body fragments */
    return '<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
      +'<style id="israr-cut-css">\n'+css+'\n</style></head><body>\n'
      +html+'\n<script id="israr-cut-js">\n'+js+'\n<\/script>\n</body></html>';
  }

  window.openHtmlDivideFullPreview=function(){
    var html=getPart('htmlDivideHtml');
    var css=getPart('htmlDivideCss');
    var js=getPart('htmlDivideJs');
    if(!html && !css && !js){
      toast('Pehle Generate karein taaki HTML/CSS/JS boxes bharein');
      return;
    }
    var doc=buildCombinedSafe();
    var view=el('htmlDividePreviewView');
    var frame=el('htmlDividePreviewFrame');
    if(!view||!frame){ toast('Preview view missing'); return; }
    view.setAttribute('data-open','1');
    view.style.cssText='display:flex !important;flex-direction:column !important;';
    document.body.classList.add('subview-active');
    try{ frame.removeAttribute('src'); frame.srcdoc=doc; }catch(e){
      try{
        frame.contentDocument.open();
        frame.contentDocument.write(doc);
        frame.contentDocument.close();
      }catch(e2){ console.warn(e2); }
    }
  };

  /* Keep Full Preview using source */
  window.openHtmlDivideSourcePreview=function(){
    var src='';
    try{ if(typeof window.getDivideEditorCode==='function') src=window.getDivideEditorCode()||''; }catch(e){}
    if(!src.trim()){
      var ta=el('htmlDivideSource');
      if(ta) src=ta.value||'';
    }
    if(!src.trim()){ toast('Pehle code box me code dalein'); return; }
    var view=el('htmlDividePreviewView');
    var frame=el('htmlDividePreviewFrame');
    if(!view||!frame){ toast('Preview view missing'); return; }
    view.setAttribute('data-open','1');
    view.style.cssText='display:flex !important;flex-direction:column !important;';
    document.body.classList.add('subview-active');
    try{ frame.removeAttribute('src'); frame.srcdoc=src; }catch(e){
      try{frame.contentDocument.open();frame.contentDocument.write(src);frame.contentDocument.close();}catch(e2){}
    }
  };
})();


/* ===== SCRIPT 27 id=israrlab-preview-cat-fix-js ===== */
(function(){
  function el(id){return document.getElementById(id);}
  function toast(m){try{if(typeof showToast==='function')showToast(m);}catch(e){}}

  function setPreviewTitle(t){
    var n=el('htmlDividePreviewTitle');
    if(n) n.textContent=t||'Preview';
  }

  /* Override previews to set title + ensure small back only */
  var prevFull = window.openHtmlDivideSourcePreview;
  window.openHtmlDivideSourcePreview=function(){
    setPreviewTitle('Full Code Preview');
    if(typeof prevFull==='function') return prevFull();
  };
  var prevCut = window.openHtmlDivideFullPreview;
  window.openHtmlDivideFullPreview=function(){
    setPreviewTitle('Cutting Preview (HTML+CSS+JS)');
    if(typeof prevCut==='function') return prevCut();
  };

  window.closeHtmlDividePreviewView=function(){
    var view=el('htmlDividePreviewView');
    var frame=el('htmlDividePreviewFrame');
    if(view){ view.setAttribute('data-open','0'); view.style.cssText='display:none !important;'; }
    if(frame){ try{ frame.srcdoc=''; frame.removeAttribute('srcdoc'); }catch(e){} }
    document.body.classList.remove('subview-active');
  };

  /* Category: show SAME style cards as home for selected category */
  window.renderCategoryNotesLive=function(){
    /* heavy clone path disabled for performance — final light renderer handles this */
    try{ if(typeof scheduleCategoryLive==='function') scheduleCategoryLive(); }catch(e){}
    return;
    var host=el('categoryNotesLive');
    if(!host) return;
    if(typeof notes==='undefined' || !notes){ host.innerHTML=''; return; }
    var filter = (typeof currentCategoryFilter!=='undefined') ? currentCategoryFilter : 'All';
    var list = filter==='All' ? notes.slice() : notes.filter(function(n){ return String(n.category||'')===String(filter); });
    host.innerHTML='';
    if(!list.length){
      host.innerHTML='<p style="font-size:12px;color:var(--muted);padding:10px 4px;margin:0;">Is category me koi card nahi.</p>';
      return;
    }
    var homeContainer=el('notesContainer');
    if(false && homeContainer && typeof renderNotes==='function'){
      var prevFilter = currentCategoryFilter;
      currentCategoryFilter = filter;
      try{ renderNotes(); }catch(e){}
      var cards = homeContainer.querySelectorAll('.note-card');
      if(cards && cards.length){
        currentCategoryFilter = prevFilter;
        try{ renderNotes(); }catch(e){}
        return;
      }
      currentCategoryFilter = prevFilter;
      try{ renderNotes(); }catch(e){}
    }
    /* fallback simple but complete cards */
    list.forEach(function(n){
      var idx = notes.indexOf(n);
      var card=document.createElement('div');
      card.className='note-card';
      card.style.cssText='padding:12px;border:1px solid var(--border);border-radius:14px;background:var(--card-bg);box-shadow:0 4px 14px rgba(0,0,0,.06);';
      var title=(n.title||'Untitled').replace(/</g,'&lt;');
      var cat=(n.category||'—').replace(/</g,'&lt;');
      card.innerHTML='<div style="font-weight:800;font-size:14px;margin-bottom:6px;">'+title+'</div>'
        +'<div style="font-size:11px;color:var(--muted);margin-bottom:10px;">📁 '+cat+'</div>'
        +'<div style="display:flex;gap:6px;flex-wrap:wrap;">'
        +'<button type="button" class="top-btn" style="height:32px;font-size:11px;" data-i="'+idx+'" data-act="edit">Edit</button>'
        +'<button type="button" class="top-btn" style="height:32px;font-size:11px;" data-i="'+idx+'" data-act="preview">Preview</button>'
        +'<button type="button" class="top-btn" style="height:32px;font-size:11px;" data-i="'+idx+'" data-act="settings">Settings</button>'
        +'</div>';
      card.addEventListener('click', function(ev){
        var b=ev.target.closest('button'); if(!b) return;
        var i=parseInt(b.getAttribute('data-i'),10);
        var act=b.getAttribute('data-act');
        try{
          if(act==='edit' && typeof openEditor==='function') openEditor(i);
          else if(act==='preview' && typeof previewNote==='function') previewNote(i);
          else if(act==='settings' && typeof openCardSettingMenu==='function') openCardSettingMenu(ev,i);
        }catch(e){}
      });
      host.appendChild(card);
    });
  };

  /* Hook assign + filter + section switch */
  var prevAssign = window.assignNoteToCategory;
  if(typeof prevAssign==='function'){
    window.assignNoteToCategory=function(index, categoryName){
      prevAssign(index, categoryName);
      try{ window.renderCategoryNotesLive(); }catch(e){}
    };
  }

  var prevFilter = window.filterByCategory;
  if(typeof prevFilter==='function'){
    window.filterByCategory=function(cat, elBtn){
      prevFilter(cat, elBtn);
      try{ window.renderCategoryNotesLive(); }catch(e){}
    };
  }

  var prevSwitch = window.switchMainSection;
  window.switchMainSection=function(sec){
    if(typeof prevSwitch==='function') prevSwitch(sec);
    if(sec==='category'){
      setTimeout(function(){ try{ window.renderCategoryNotesLive(); }catch(e){} }, 40);
    }
  };

  /* Light perf: debounce category render */
  var tmr=null;
  window.scheduleCategoryLive=function(){
    clearTimeout(tmr);
    tmr=setTimeout(function(){ try{ window.renderCategoryNotesLive(); }catch(e){} }, 50);
  };
})();


/* ===== SCRIPT 28 id=israrlab-final-fixes-js ===== */
(function(){
  function el(id){ return document.getElementById(id); }
  function toast(m){ try{ if(typeof showToast==='function') showToast(m); }catch(e){} }

  function setFrameDoc(frame, doc){
    if(!frame) return;
    try{
      if(frame._blobUrl){ try{ URL.revokeObjectURL(frame._blobUrl); }catch(e){} frame._blobUrl=null; }
      frame.removeAttribute('src'); frame.removeAttribute('srcdoc');
      if(doc && doc.length > 400000){
        frame._blobUrl = URL.createObjectURL(new Blob([doc],{type:'text/html;charset=utf-8'}));
        frame.src = frame._blobUrl;
      } else frame.srcdoc = doc || '';
    }catch(e){ try{ frame.srcdoc = doc||''; }catch(e2){} }
  }

  /* ===== CODE DIVIDE FULL PAGE ===== */
  window.updateCdfLines = function(){
    var ta = el('codeDivideFullSource'), nums = el('cdfLineNums');
    if(!ta||!nums) return;
    var n = Math.min((ta.value||'').split('\n').length||1, 4000);
    var s=''; for(var i=1;i<=n;i++) s+=i+'\n';
    nums.textContent = s;
  };
  window.syncCdfLines = function(ta){
    var nums = el('cdfLineNums'); if(nums&&ta) nums.scrollTop = ta.scrollTop;
  };

  window.openCodeDivideFullView = function(){
    var view = el('codeDivideFullView');
    if(!view) return;
    view.setAttribute('data-open','1');
    view.style.display = 'flex';
    document.body.classList.add('subview-active');
    /* sync from nested if any */
    try{
      var nested = '';
      if(typeof window.getDivideEditorCode==='function') nested = window.getDivideEditorCode()||'';
      if(!nested){ var t=el('htmlDivideSource'); if(t) nested=t.value||''; }
      var src = el('codeDivideFullSource');
      if(src && nested && !src.value) src.value = nested;
    }catch(e){}
    updateCdfLines();
  };

  window.closeCodeDivideFullView = function(){
    var view = el('codeDivideFullView');
    if(!view) return;
    view.setAttribute('data-open','0');
    view.style.display = 'none';
    document.body.classList.remove('subview-active');
    try{
      if(typeof switchMainSection==='function') switchMainSection('html-divide');
      if(typeof switchDivideMode==='function'){
        /* stay on divide tab visually but nested hidden */
        document.querySelectorAll('.divide-mode-tab').forEach(function(b){
          b.classList.toggle('active', b.getAttribute('data-mode')==='divide');
        });
      }
    }catch(e){}
  };

  function getCdfSrc(){
    var ta = el('codeDivideFullSource');
    return ta ? (ta.value||'') : '';
  }
  window.getCdfSrc = getCdfSrc;

  function extractByMode(src, mode){
    src = String(src||'');
    var htmlOut='', cssOut='', jsOut='', single='';
    var work = src;
    var cssParts=[], jsParts=[];

    work = work.replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gi, function(m, inner){
      cssParts.push(String(inner||'').trim()); return '';
    });
    work = work.replace(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi, function(m, attrs, inner){
      if(/\bsrc\s*=/i.test(attrs||'')) return m;
      jsParts.push(String(inner||'').trim()); return '';
    });
    htmlOut = work.trim();
    cssOut = cssParts.filter(Boolean).join('\n\n').trim();
    jsOut = jsParts.filter(Boolean).join('\n\n').trim();

    if(mode === 'html') return { type:'single', label:'HTML', value: htmlOut || src };
    if(mode === 'css'){
      if(!cssOut){
        var hasTag=/<[a-z!\/]/i.test(src);
        if(!hasTag) cssOut = src.trim();
      }
      return { type:'single', label:'CSS', value: cssOut };
    }
    if(mode === 'js'){
      if(!jsOut){
        var hasTag2=/<[a-z!\/]/i.test(src);
        if(!hasTag2) jsOut = src.trim();
      }
      return { type:'single', label:'JavaScript', value: jsOut };
    }
    if(mode === 'html-css-js') return { type:'triple', html:htmlOut||src, css:cssOut, js:jsOut };

    if(mode === 'text'){
      var tmp = document.createElement('div');
      try{ tmp.innerHTML = src; }catch(e){}
      var text = (tmp.innerText || tmp.textContent || '').replace(/\n{3,}/g,'\n\n').trim();
      if(!text) text = src.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
      return { type:'single', label:'Text / Article', value: text };
    }
    if(mode === 'images'){
      var imgs = [];
      var re = /<img\b[^>]*\bsrc\s*=\s*["']([^"']+)["'][^>]*>/gi;
      var m;
      while((m = re.exec(src))) imgs.push(m[1]);
      re = /url\(\s*['"]?([^'")\s]+)['"]?\s*\)/gi;
      while((m = re.exec(src))){
        var u=m[1];
        if(/\.(png|jpe?g|gif|webp|svg|ico|bmp)(\?|$)/i.test(u) || u.indexOf('data:image')===0) imgs.push(u);
      }
      /* unique */
      var seen={}; imgs = imgs.filter(function(x){ if(seen[x]) return false; seen[x]=1; return true; });
      return { type:'single', label:'Images URL', value: imgs.join('\n') };
    }
    if(mode === 'weburl' || mode === 'links'){
      var urls = [];
      var re2 = /\bhttps?:\/\/[^\s"'<>)+]+/gi;
      var m2;
      while((m2 = re2.exec(src))) urls.push(m2[0].replace(/[.,;]+$/,''));
      if(mode === 'links'){
        var re3 = /<a\b[^>]*\bhref\s*=\s*["']([^"']+)["']/gi;
        while((m2 = re3.exec(src))) urls.push(m2[1]);
      }
      var seen2={}; urls = urls.filter(function(x){ if(seen2[x]) return false; seen2[x]=1; return true; });
      return { type:'single', label: mode==='links'?'All Links':'Web URL', value: urls.join('\n') };
    }
    if(mode === 'meta'){
      var metas = [];
      var re4 = /<meta\b[^>]*>/gi;
      var m4;
      while((m4 = re4.exec(src))) metas.push(m4[0]);
      re4 = /<title\b[^>]*>[\s\S]*?<\/title>/gi;
      while((m4 = re4.exec(src))) metas.push(m4[0]);
      re4 = /<link\b[^>]*>/gi;
      while((m4 = re4.exec(src))) metas.push(m4[0]);
      return { type:'single', label:'Meta / SEO', value: metas.join('\n') };
    }
    if(mode === 'comments'){
      var comments = [];
      var re5 = /<!--([\s\S]*?)-->/g;
      var m5;
      while((m5 = re5.exec(src))) comments.push('<!--' + m5[1] + '-->');
      return { type:'single', label:'HTML Comments', value: comments.join('\n\n') };
    }
    return { type:'triple', html:htmlOut||src, css:cssOut, js:jsOut };
  }

  function renderCdfResults(result){
    var host = el('cdfResults');
    if(!host) return;
    host.innerHTML = '';
    host.classList.add('is-visible');
    function box(label, id, val, icon){
      var d = document.createElement('div');
      d.className = 'cdf-box';
      d.innerHTML = '<div class="cdf-box-head"><span>'+(icon||'')+' '+label+'</span>'
        +'<button type="button" data-copy="'+id+'">Copy</button></div>'
        +'<textarea class="cdf-part" id="'+id+'" readonly></textarea>';
      host.appendChild(d);
      var ta = d.querySelector('textarea');
      ta.value = val || '';
      d.querySelector('button').onclick = function(){
        try{
          if(navigator.clipboard) navigator.clipboard.writeText(ta.value||'').then(function(){ toast('Copied'); });
        }catch(e){}
      };
    }
    if(result.type === 'triple'){
      box('HTML', 'cdfOutHtml', result.html, '<i class="fab fa-html5"></i>');
      box('CSS', 'cdfOutCss', result.css, '<i class="fab fa-css3-alt"></i>');
      box('JavaScript', 'cdfOutJs', result.js, '<i class="fab fa-js"></i>');
    } else {
      box(result.label || 'Output', 'cdfOutSingle', result.value, '<i class="fas fa-file-code"></i>');
    }
  }

  window.codeDivideFullGenerate = function(){
    var src = getCdfSrc();
    if(!src.trim()){ toast('Pehle code paste karein'); return; }
    var mode = (el('codeDivideModeSelect')||{}).value || 'html-css-js';
    var btn = el('cdfGenerateBtn');
    if(btn) btn.disabled = true;
    setTimeout(function(){
      try{
        var result = extractByMode(src, mode);
        renderCdfResults(result);
        var act = el('cdfActions');
        if(act) act.classList.add('is-visible');
        window.__cdfLastResult = result;
        toast('Generate ho gaya');
      }catch(e){ console.warn(e); toast('Generate fail'); }
      if(btn) btn.disabled = false;
    }, 30);
  };

  window.codeDivideOnModeChange = function(){ /* optional clear results */ };

  window.codeDivideFullPreview = function(){
    var src = getCdfSrc();
    if(!src.trim()){ toast('Pehle code dalein'); return; }
    var view = el('htmlDividePreviewView');
    var frame = el('htmlDividePreviewFrame');
    if(!view||!frame){ toast('Preview missing'); return; }
    var titleEl = el('htmlDividePreviewTitle');
    if(titleEl) titleEl.textContent = 'Full Preview';
    view.setAttribute('data-open','1');
    view.style.cssText = 'display:flex !important;flex-direction:column !important;';
    document.body.classList.add('subview-active');
    setTimeout(function(){ setFrameDoc(frame, src); }, 20);
  };

  window.codeDivideFullCutPreview = function(){
    var result = window.__cdfLastResult;
    var doc = '';
    if(result && result.type === 'triple'){
      var html = result.html||'', css=result.css||'', js=result.js||'';
      var low = html.toLowerCase();
      var isFull = low.indexOf('<html')>=0 || low.indexOf('<!doctype')>=0;
      if(isFull){
        doc = html;
        if(css){
          if(/<\/head>/i.test(doc)) doc=doc.replace(/<\/head>/i,'<style>\n'+css+'\n</style>\n</head>');
          else doc='<style>\n'+css+'\n</style>\n'+doc;
        }
        if(js){
          if(/<\/body>/i.test(doc)) doc=doc.replace(/<\/body>/i,'<script>\n'+js+'\n<\/script>\n</body>');
          else doc=doc+'\n<script>\n'+js+'\n<\/script>';
        }
      } else {
        doc = '<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>\n'+css+'\n</style></head><body>\n'+html+'\n<script>\n'+js+'\n<\/script></body></html>';
      }
    } else if(result && result.value){
      doc = result.value;
      if(result.label && (result.label.indexOf('CSS')>=0 || result.label.indexOf('Text')>=0)){
        doc = '<!DOCTYPE html><html><head><meta charset="UTF-8"><style>body{font-family:sans-serif;padding:16px;white-space:pre-wrap;}</style></head><body>'+(result.label.indexOf('CSS')>=0?'<style>'+result.value+'</style>':'')+ (result.label.indexOf('Text')>=0? '<pre>'+String(result.value).replace(/</g,'&lt;')+'</pre>' : '') +'</body></html>';
      }
    } else {
      doc = getCdfSrc();
    }
    if(!doc || !String(doc).trim()){ toast('Pehle Generate karein'); return; }
    var view = el('htmlDividePreviewView');
    var frame = el('htmlDividePreviewFrame');
    if(!view||!frame) return;
    var titleEl = el('htmlDividePreviewTitle');
    if(titleEl) titleEl.textContent = 'Cut Preview';
    view.setAttribute('data-open','1');
    view.style.cssText = 'display:flex !important;flex-direction:column !important;';
    document.body.classList.add('subview-active');
    setTimeout(function(){ setFrameDoc(frame, doc); }, 20);
  };

  window.codeDivideFullReset = function(){
    var ta = el('codeDivideFullSource');
    if(ta) ta.value = '';
    updateCdfLines();
    var host = el('cdfResults');
    if(host){ host.innerHTML=''; host.classList.remove('is-visible'); }
    var act = el('cdfActions');
    if(act) act.classList.remove('is-visible');
    window.__cdfLastResult = null;
    toast('Reset');
  };

  window.codeDivideFullShare = function(){
    var pageUrl = (window.location && window.location.href) ? window.location.href.split('#')[0] : '';
    var src = getCdfSrc();
    var data = { title:'IsrarLab Code Divide', text: src ? ('Code '+src.length+' chars') : 'IsrarLab', url: pageUrl };
    if(navigator.share){
      navigator.share(data).catch(function(){
        if(navigator.clipboard) navigator.clipboard.writeText(pageUrl).then(function(){ toast('URL copied'); });
      });
    } else if(navigator.clipboard){
      navigator.clipboard.writeText(pageUrl||src||'').then(function(){ toast('Copied'); });
    } else toast(pageUrl||'Share n/a');
  };

  window.codeDivideFullSave = function(){
    var src = getCdfSrc();
    var result = window.__cdfLastResult;
    var code = src;
    if(result){
      if(result.type==='triple'){
        code = (result.html||'') + (result.css? '\n<style>\n'+result.css+'\n</style>':'') + (result.js?'\n<script>\n'+result.js+'\n<\/script>':'');
      } else if(result.value) code = result.value;
    }
    if(!code || !code.trim()){ toast('Save ke liye code nahi'); return; }
    try{
      if(typeof notes==='undefined'){ toast('Notes system nahi'); return; }
      var now = Date.now();
      notes.unshift({
        id:'cd_'+now, title:'Code Divide '+new Date().toLocaleString(),
        htmlCode:code, category:'Code Divide', createdAt:now, updatedAt:now, updateCount:1, isPinned:false
      });
      try{ if(typeof saveData==='function') saveData(); else localStorage.setItem('notes', JSON.stringify(notes)); }catch(e){}
      try{ if(typeof renderNotes==='function') renderNotes(); }catch(e){}
      try{ if(typeof renderCategories==='function') renderCategories(); }catch(e){}
      toast('Home history me save');
    }catch(e){ toast('Save fail'); }
  };

  /* ===== URL FULL (keep) ===== */
  window.__urlHlTimer = null;
  window.refreshUrlCodeHighlight = function(){
    var ta = el('urlCodeFullOutput');
    var out = el('urlCodeHighlightOutput');
    if(!ta || !out) return;
    var source = ta.value || '';
    if(!source){
      out.innerHTML = '';
      return;
    }
    try{
      if(window.hljs && typeof window.hljs.highlight === 'function'){
        var lang = 'xml';
        var low = source.slice(0, 2000).toLowerCase();
        if(/\b(function|const|let|var)\b/.test(low) && low.indexOf('<') < 0) lang = 'javascript';
        else if(/\{[^}]*:/.test(low) && low.indexOf('<') < 0) lang = 'css';
        else lang = 'xml';
        var res = window.hljs.highlight(source, { language: lang, ignoreIllegals: true });
        out.innerHTML = res.value;
        out.className = 'hljs language-' + lang;
      } else {
        out.textContent = source;
      }
    }catch(e){
      try{ out.textContent = source; }catch(e2){}
    }
    try{
      var layer = out.parentNode;
      if(layer){ layer.scrollTop = ta.scrollTop; layer.scrollLeft = ta.scrollLeft; }
    }catch(e3){}
  };
  window.scheduleUrlCodeHighlight = function(){
    if(window.__urlHlTimer) clearTimeout(window.__urlHlTimer);
    var ta = el('urlCodeFullOutput');
    var len = ta && ta.value ? ta.value.length : 0;
    /* Large pastes: skip expensive highlight for a bit so paste feels instant */
    var delay = len > 200000 ? 1800 : (len > 80000 ? 900 : (len > 30000 ? 400 : 120));
    window.__urlHlTimer = setTimeout(function(){
      window.__urlHlTimer = null;
      window.refreshUrlCodeHighlight();
    }, delay);
  };
  window.onUrlCodeInput = function(){
    try{ updateUrlCodeLines(); }catch(e){}
    try{ if(window.syncUrlExtraActions) window.syncUrlExtraActions(); }catch(e){}
    window.scheduleUrlCodeHighlight();
  };
  window.urlCodeHandleTab = function(e){
    if(!e || e.key !== 'Tab') return;
    e.preventDefault();
    var ta = e.target;
    var start = ta.selectionStart, end = ta.selectionEnd;
    ta.value = ta.value.substring(0, start) + '  ' + ta.value.substring(end);
    ta.selectionStart = ta.selectionEnd = start + 2;
    window.onUrlCodeInput();
  };
  window.updateUrlCodeLines = function(){
    var ta = el('urlCodeFullOutput');
    var inner = el('urlCodeLineNumsInner') || el('urlCodeLineNums');
    if(!ta || !inner) return;
    var val = ta.value || '';
    /* Exact line count: split by \n. Empty last line still counts. */
    var n = val.length === 0 ? 1 : (val.split('\n').length);
    if(n < 1) n = 1;
    if(n > 30000) n = 30000;
    var parts = [];
    for(var i = 1; i <= n; i++) parts.push(String(i));
    inner.textContent = parts.join('\n') + '\n';
    /* Hard match font metrics so every line number lines up with code */
    try{
      var cs = window.getComputedStyle(ta);
      inner.style.fontSize = '12px';
      inner.style.lineHeight = '1.55';
      inner.style.fontFamily = 'Consolas, Monaco, "Courier New", monospace';
      inner.style.fontWeight = '600';
      inner.style.paddingTop = (cs.paddingTop || '10px');
      inner.style.paddingBottom = (cs.paddingBottom || '10px');
      inner.style.boxSizing = 'border-box';
      inner.style.display = 'block';
      inner.style.whiteSpace = 'pre';
    }catch(e){}
    try{
      var st = ta.scrollTop || 0;
      inner.style.transform = 'translate3d(0,' + (-st) + 'px,0)';
    }catch(e){}
  };
  window.syncUrlCodeLines = function(ta){
    if(!ta) ta = el('urlCodeFullOutput');
    if(!ta) return;
    var st = ta.scrollTop || 0;
    var sl = ta.scrollLeft || 0;
    var inner = el('urlCodeLineNumsInner');
    if(inner){
      try{
        inner.style.setProperty('transform', 'translate3d(0,' + (-st) + 'px,0)');
      }catch(e){
        try{ inner.style.transform = 'translateY(' + (-st) + 'px)'; }catch(e2){}
      }
    }
    var layer = document.querySelector('#urlCodeFullView .url-code-highlight-layer');
    if(layer){
      try{ layer.scrollTop = st; layer.scrollLeft = sl; }catch(e){}
    }
  };
  (function(){
    function bind(){
      var ta = document.getElementById('urlCodeFullOutput');
      if(!ta || ta.__urlScrollBound) return;
      ta.__urlScrollBound = true;
      ta.addEventListener('scroll', function(){
        window.syncUrlCodeLines(ta);
      }, { passive: true });
    }
    if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bind);
    else bind();
    setTimeout(bind, 300);
    setTimeout(bind, 1200);
  })();

  window.openUrlCodeFullView = function(){
    var view=el('urlCodeFullView'); if(!view) return;
    view.setAttribute('data-open','1'); view.style.display='flex';
    document.body.classList.add('subview-active');
    updateUrlCodeLines();
    try{ window.scheduleUrlCodeHighlight(); }catch(e){}
  };
  window.closeUrlCodeFullView = function(){
    try{ if(typeof window.closeUrlCodeOnlyPreview==='function') window.closeUrlCodeOnlyPreview(); }catch(e){}
    var view=el('urlCodeFullView'); if(!view) return;
    view.setAttribute('data-open','0'); view.style.display='none';
    view.classList.remove('url-is-previewing');
    document.body.classList.remove('subview-active');
    try{ if(typeof switchMainSection==='function') switchMainSection('html-divide'); }catch(e){}
  };
  /* Full-page preview with ONLY Back — returns to URL Code page */
  window.openUrlCodeOnlyPreview = function(){
    var output = el('urlCodeFullOutput');
    var code = output ? (output.value || '').trim() : '';
    if(!code){ toast('Pehle code fetch/paste karein'); return; }
    var view = el('urlCodeOnlyPreviewView');
    var frame = el('urlCodeOnlyPreviewFrame');
    if(!view || !frame){ toast('Preview missing'); return; }
    view.setAttribute('data-open','1');
    view.style.display = 'flex';
    document.body.classList.add('subview-active');
    try{
      if(frame._blobUrl){ try{ URL.revokeObjectURL(frame._blobUrl); }catch(e){} frame._blobUrl=null; }
      frame.removeAttribute('src');
      frame.removeAttribute('srcdoc');
      if(typeof setFrameDoc === 'function'){
        setTimeout(function(){ setFrameDoc(frame, code); }, 20);
      } else {
        try{
          frame._blobUrl = URL.createObjectURL(new Blob([code], {type:'text/html;charset=utf-8'}));
          frame.src = frame._blobUrl;
        }catch(e){
          frame.srcdoc = code;
        }
      }
    }catch(e){ toast('Preview fail'); }
  };
  window.closeUrlCodeOnlyPreview = function(){
    var view = el('urlCodeOnlyPreviewView');
    var frame = el('urlCodeOnlyPreviewFrame');
    if(view){
      view.setAttribute('data-open','0');
      view.style.display = 'none';
    }
    if(frame){
      try{
        if(frame._blobUrl){ URL.revokeObjectURL(frame._blobUrl); frame._blobUrl=null; }
        frame.removeAttribute('src');
        frame.removeAttribute('srcdoc');
        frame.srcdoc = '';
      }catch(e){}
    }
    /* Stay on URL Code page — do not close urlCodeFullView */
    var full = el('urlCodeFullView');
    if(full && full.getAttribute('data-open') === '1'){
      document.body.classList.add('subview-active');
    } else {
      document.body.classList.remove('subview-active');
    }
  };
  /* Bottom Preview: same code box / stage me inline preview (not full page) */
  window.toggleUrlCodeInlinePreview = function(){
    var view = el('urlCodeFullView');
    var output = el('urlCodeFullOutput');
    var frame = el('urlCodeFullPreviewFrame');
    var btn = el('urlInlinePreviewBtn');
    if(!view || !output || !frame) return;
    if(view.classList.contains('url-is-previewing')){
      view.classList.remove('url-is-previewing');
      try{
        if(frame._blobUrl){ URL.revokeObjectURL(frame._blobUrl); frame._blobUrl=null; }
        frame.removeAttribute('src');
        frame.removeAttribute('srcdoc');
        frame.srcdoc = '';
      }catch(e){}
      if(btn) btn.innerHTML = '<i class="fas fa-eye"></i> Preview';
      return;
    }
    var code = (output.value || '').trim();
    if(!code){ toast('Pehle code fetch/paste karein'); return; }
    view.classList.add('url-is-previewing');
    try{
      if(frame._blobUrl){ try{ URL.revokeObjectURL(frame._blobUrl); }catch(e){} frame._blobUrl=null; }
      frame.removeAttribute('src');
      frame.removeAttribute('srcdoc');
      if(typeof setFrameDoc === 'function'){
        setTimeout(function(){ setFrameDoc(frame, code); }, 20);
      } else {
        try{
          frame._blobUrl = URL.createObjectURL(new Blob([code], {type:'text/html;charset=utf-8'}));
          frame.src = frame._blobUrl;
        }catch(e2){
          frame.srcdoc = code;
        }
      }
    }catch(e){ toast('Preview fail'); }
    if(btn) btn.innerHTML = '<i class="fas fa-code"></i> Code';
  };
  /* legacy name → full page (top button uses openUrlCodeOnlyPreview) */
  window.toggleUrlCodeFullPreview = window.openUrlCodeOnlyPreview;

  window.copyUrlCodeFull = function(){
    var o=el('urlCodeFullOutput'); var c=o?(o.value||''):'';
    if(!c.trim()){ toast('Code nahi'); return; }
    try{
      if(navigator.clipboard && navigator.clipboard.writeText){
        navigator.clipboard.writeText(c).then(function(){ toast('Code copied'); });
      } else {
        o.focus(); o.select();
        document.execCommand('copy');
        toast('Code copied');
      }
    }catch(e){ toast('Copy fail'); }
  };
  window.resetUrlCodeFull = function(){
    var o=el('urlCodeFullOutput'), f=el('urlCodeFullPreviewFrame'), s=el('urlCodeFullStatus'), v=el('urlCodeFullView');
    /* Save for Redo before clear */
    if(o && (o.value || '').trim()){ window.__urlCodeUndo = o.value; }
    if(o) o.value='';
    if(f){
      try{
        if(f._blobUrl){ URL.revokeObjectURL(f._blobUrl); f._blobUrl=null; }
        f.removeAttribute('src'); f.removeAttribute('srcdoc'); f.srcdoc='';
      }catch(e){}
    }
    if(v) v.classList.remove('url-is-previewing');
    if(s) s.textContent='';
    try{
      var ib=el('urlInlinePreviewBtn');
      if(ib) ib.innerHTML='<i class="fas fa-eye"></i> Preview';
    }catch(e){}
    try{
      var hl=el('urlCodeHighlightOutput');
      if(hl) hl.innerHTML='';
    }catch(e){}
    updateUrlCodeLines();
    try{ if(typeof window.syncUrlExtraActions==='function') window.syncUrlExtraActions(); }catch(e){}
    toast('Reset');
  };
  window.saveUrlCodeFull = function(){
    var o=el('urlCodeFullOutput'); var code=o?(o.value||'').trim():'';
    if(!code){ toast('Save ke liye code nahi'); return; }
    try{
      if(typeof notes==='undefined'){ toast('Notes nahi'); return; }
      var input=el('urlCodeFullInput'); var url=(input&&input.value)?input.value.trim():'';
      var now=Date.now();
      var title = url ? ('URL: '+url.replace(/^https?:\/\//,'').slice(0,48)) : ('URL Code '+new Date().toLocaleString());
      notes.unshift({
        id:'url_'+now,
        title:title,
        htmlCode:code,
        category:'URL Code',
        createdAt:now,
        updatedAt:now,
        updateCount:1,
        isPinned:false,
        fromUrlCode:true
      });
      try{ if(typeof saveData==='function') saveData(); else localStorage.setItem('notes',JSON.stringify(notes)); }catch(e){}
      try{ if(typeof renderNotes==='function') renderNotes(); }catch(e){}
      try{ if(typeof renderHistory==='function') renderHistory(); }catch(e){}
      try{ if(typeof updateHistoryList==='function') updateHistoryList(); }catch(e){}
      toast('History / Home me save ho gaya');
    }catch(e){ toast('Save fail'); }
  };
  window.fetchUrlCodeFull = function(){
    var input=el('urlCodeFullInput'), output=el('urlCodeFullOutput'), status=el('urlCodeFullStatus'), btn=el('urlCodeFullFetchBtn');
    if(!input||!output) return;
    var url=(input.value||'').trim();
    if(!url){ toast('URL dalein'); return; }
    if(!/^https?:\/\//i.test(url)) url='https://'+url;
    if(status) status.textContent='Fetching...';
    if(btn){ btn.disabled=true; btn.innerHTML='<i class="fas fa-spinner fa-spin"></i>'; }
    var proxies=[function(u){return 'https://api.allorigins.win/raw?url='+encodeURIComponent(u);},function(u){return 'https://corsproxy.io/?'+encodeURIComponent(u);}];
    var tried=0;
    function next(){
      if(tried>=proxies.length){
        if(status) status.textContent='Fetch fail';
        if(btn){ btn.disabled=false; btn.innerHTML='<i class="fas fa-download"></i> Fetch'; }
        return;
      }
      fetch(proxies[tried++](url)).then(function(r){ if(!r.ok) throw 0; return r.text(); })
        .then(function(txt){
          output.value=txt||''; updateUrlCodeLines();
          if(status) status.textContent='OK — '+((txt||'').length)+' chars';
          if(btn){ btn.disabled=false; btn.innerHTML='<i class="fas fa-download"></i> Fetch'; }
          toast('Source mil gaya');
        }).catch(function(){ next(); });
    }
    next();
  };

  /* ===== Category: home-identical cards with KB ===== */
  var _catTmr=null;
  window.renderCategoryNotesLive = function(){
    var host=el('categoryNotesLive');
    if(!host) return;
    if(typeof notes==='undefined'||!notes){ host.innerHTML=''; return; }
    var filter=(typeof currentCategoryFilter!=='undefined')?currentCategoryFilter:'All';
    var list=(filter==='All'||!filter)?notes.filter(function(n){return !!(n&&n.category&&String(n.category).trim());}):notes.filter(function(n){return String(n.category||'')===String(filter);});
    if(!list.length){
      host.innerHTML='<p style="font-size:12px;color:var(--muted);padding:12px 4px;">Is category me koi card nahi. Card → Settings → Uncategory / Category se assign karein.</p>';
      return;
    }
    var frag=document.createDocumentFragment();
    var maxShow=Math.min(list.length,50);
    for(var i=0;i<maxShow;i++){
      var n=list[i], idx=notes.indexOf(n);
      if(idx<0) continue;
      var title=String(n.title||'Untitled').replace(/</g,'&lt;').replace(/>/g,'&gt;');
      var code=n.htmlCode||'', len=code.length;
      var kb = len>=1024 ? (Math.round(len/102.4)/10)+' KB' : len+' B';
      var words = len>80000 ? Math.max(1,Math.round(len/6)) : (code.trim()?code.trim().split(/\s+/).length:0);
      var dateStr='';
      try{
        if(n.updatedAt) dateStr = (typeof n.updatedAt==='number') ? new Date(n.updatedAt).toLocaleString() : String(n.updatedAt);
        else if(n.createdAt) dateStr = (typeof n.createdAt==='number') ? new Date(n.createdAt).toLocaleString() : String(n.createdAt);
        else if(n.createdAtStr) dateStr = n.createdAtStr;
      }catch(e){}
      var card=document.createElement('div');
      card.className='note-card'+(n.isPinned?' pinned':'');
      card.setAttribute('data-note-index',String(idx));
      card.innerHTML =
        '<div class="pin-badge">PIN</div>'
        +'<div class="card-cover-box"><div class="html-preview-wrapper"><iframe loading="lazy" data-srcdoc="" title="preview" sandbox="allow-scripts allow-same-origin allow-forms allow-modals"></iframe></div></div>'
        +'<div class="card-body">'
        +'<div class="card-meta-row card-date-row"><span class="card-date">🕒 '+dateStr+'</span></div>'
        +'<div class="card-meta-row card-stats-row"><span class="card-stats">📝 <span class="stat-chars">'+len+' chars</span> | <span class="stat-words">'+words+' words</span> · <strong class="stat-kb">'+kb+'</strong></span></div>'
        +'<div class="title-row"><h3 style="cursor:pointer;margin:0;font-size:13px;" data-i="'+idx+'" data-act="edit">'+title+'</h3></div>'
        +'</div>'
        +'<div class="card-footer"><div class="card-footer-row">'
        +'<button type="button" class="card-edit-btn" data-i="'+idx+'" data-act="edit">Edit</button>'
        +'<button type="button" class="card-view-btn" data-i="'+idx+'" data-act="preview">Preview</button>'
        +'<button type="button" class="card-copy-btn" data-i="'+idx+'" data-act="copy">Copy</button>'
        +'<button type="button" class="card-setting-btn" data-i="'+idx+'" data-act="settings"><i class="fas fa-cog"></i> Settings</button>'
        +'</div></div>';
      var iframe = card.querySelector('iframe');
      if(iframe){
        iframe.__previewCode = code;
        iframe.setAttribute('sandbox','allow-scripts allow-same-origin allow-forms allow-modals');
      }
      frag.appendChild(card);
    }
    host.innerHTML=''; host.appendChild(frag);
    /* Same lazy preview engine as Home */
    try{
      if(typeof scheduleLazyCardPreviews==='function') scheduleLazyCardPreviews(host);
    }catch(e){
      /* fallback direct load */
      setTimeout(function(){
        host.querySelectorAll('iframe').forEach(function(ifr){
          var c = ifr.__previewCode || '';
          if(!c) return;
          try{
            if(c.length>400000){
              if(ifr._blobUrl){ try{URL.revokeObjectURL(ifr._blobUrl);}catch(e){} }
              ifr._blobUrl = URL.createObjectURL(new Blob([c],{type:'text/html;charset=utf-8'}));
              ifr.removeAttribute('srcdoc'); ifr.src = ifr._blobUrl;
            } else ifr.srcdoc = c;
          }catch(e2){ try{ifr.srcdoc=c;}catch(e3){} }
          try{ delete ifr.__previewCode; }catch(e4){}
        });
      },80);
    }
  };

  document.addEventListener('click', function(ev){
    var host=el('categoryNotesLive');
    if(!host||!host.contains(ev.target)) return;
    var b=ev.target.closest('button[data-act], h3');
    if(!b) return;
    var card=b.closest('[data-note-index]');
    var i=b.getAttribute('data-i');
    if(i==null&&card) i=card.getAttribute('data-note-index');
    i=parseInt(i,10);
    if(isNaN(i)||i<0) return;
    var act=b.getAttribute('data-act')||(b.tagName==='H3'?'edit':'');
    ev.preventDefault(); ev.stopPropagation();
    try{
      if(act==='edit'&&typeof openEditor==='function') openEditor(i);
      else if(act==='preview'){ if(typeof openFullHtmlViewer==='function') openFullHtmlViewer(i); }
      else if(act==='copy'){ var code=(notes[i]&&notes[i].htmlCode)||''; if(navigator.clipboard) navigator.clipboard.writeText(code).then(function(){toast('Copied');}); }
      else if(act==='settings'){
        /* Open normal Settings popup (Pin, Category, Uncategory, Delete...) */
        if(typeof openCardSettingMenu==='function') openCardSettingMenu(ev,i);
      }
    }catch(e){}
  }, true);

  function scheduleCat(){ clearTimeout(_catTmr); _catTmr=setTimeout(function(){ try{ window.renderCategoryNotesLive(); }catch(e){} },60); }
  var _pa=window.assignNoteToCategory;
  if(typeof _pa==='function'){ window.assignNoteToCategory=function(i,c){ _pa(i,c); scheduleCat(); try{renderCategories();}catch(e){} }; }
  var _pr=window.removeNoteCategory;
  if(typeof _pr==='function'){ window.removeNoteCategory=function(i){ _pr(i); scheduleCat(); try{renderCategories();}catch(e){} }; }
  var _pf=window.filterByCategory;
  if(typeof _pf==='function'){ window.filterByCategory=function(c,e){ _pf(c,e); scheduleCat(); }; }
  var _ps=window.switchMainSection;
  window.switchMainSection=function(sec){ if(typeof _ps==='function') _ps(sec); if(sec==='category') scheduleCat(); };
  window.renderCategoryNotesPanel=function(){};
  window.scheduleCategoryLive=scheduleCat;

  /* Intercept divide modes → full pages */
  var _psd = window.switchDivideMode;
  window.switchDivideMode = function(mode){
    if(typeof _psd==='function') _psd(mode);
    if(mode==='divide') setTimeout(function(){ window.openCodeDivideFullView(); }, 20);
    if(mode==='urlcode') setTimeout(function(){ window.openUrlCodeFullView(); }, 20);
  };

  document.addEventListener('click', function(ev){
    var t=ev.target.closest('.divide-mode-tab[data-mode="divide"]');
    if(t) setTimeout(function(){ window.openCodeDivideFullView(); }, 25);
    var t2=ev.target.closest('.divide-mode-tab[data-mode="urlcode"]');
    if(t2) setTimeout(function(){ window.openUrlCodeFullView(); }, 25);
  }, true);


  window.downloadUrlCodeFull = function(){
    var output = document.getElementById('urlCodeFullOutput');
    var code = output ? (output.value || '') : '';
    if(!code.trim()){ try{ if(typeof showToast==='function') showToast('Download ke liye code nahi'); }catch(e){} return; }
    try{
      var blob = new Blob([code], {type: 'text/plain;charset=utf-8'});
      var a = document.createElement('a');
      var input = document.getElementById('urlCodeFullInput');
      var name = 'source.txt';
      if(input && input.value){
        try{
          var u = input.value.trim().replace(/^https?:\/\//,'').replace(/[^\w.-]+/g,'_').slice(0,40);
          if(u) name = u + '.txt';
        }catch(e){}
      }
      a.href = URL.createObjectURL(blob);
      a.download = name;
      document.body.appendChild(a);
      a.click();
      setTimeout(function(){ try{ URL.revokeObjectURL(a.href); a.remove(); }catch(e){} }, 500);
      try{ if(typeof showToast==='function') showToast('Downloaded: '+name); }catch(e){}
    }catch(e){ try{ if(typeof showToast==='function') showToast('Download fail'); }catch(e2){} }
  };

  window.copyUrlInputLink = function(){
    var input = document.getElementById('urlCodeFullInput');
    var url = input ? (input.value || '').trim() : '';
    if(!url){ try{ if(typeof showToast==='function') showToast('URL box khali hai'); }catch(e){} return; }
    if(!/^https?:\/\//i.test(url)) url = 'https://' + url;
    try{
      if(navigator.clipboard && navigator.clipboard.writeText){
        navigator.clipboard.writeText(url).then(function(){
          try{ if(typeof showToast==='function') showToast('URL copied'); }catch(e){}
        });
      } else {
        var ta = document.createElement('textarea');
        ta.value = url; document.body.appendChild(ta); ta.select();
        document.execCommand('copy'); ta.remove();
        try{ if(typeof showToast==='function') showToast('URL copied'); }catch(e){}
      }
    }catch(e){ try{ if(typeof showToast==='function') showToast('Copy fail'); }catch(e2){} }
  };

  /* Open plain text page of the fetched/pasted code in new tab (white screen + code) */
  window.openUrlCodeAsTextPage = function(){
    var output = document.getElementById('urlCodeFullOutput');
    var code = output ? (output.value || '') : '';
    if(!code.trim()){ try{ if(typeof showToast==='function') showToast('Pehle code fetch/paste karein'); }catch(e){} return; }
    try{
      /* White page with full code as text so source clearly visible */
      var html = '<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Source Code</title><style>html,body{margin:0;padding:0;background:#fff;color:#111}pre{margin:0;padding:16px;white-space:pre-wrap;word-break:break-word;font:13px/1.5 Consolas,Monaco,monospace}</style></head><body><pre>' +
        String(code).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') +
        '</pre></body></html>';
      var blob = new Blob([html], {type: 'text/html;charset=utf-8'});
      var url = URL.createObjectURL(blob);
      var w = window.open(url, '_blank');
      if(!w){
        window.location.href = url;
      }
      setTimeout(function(){ try{ URL.revokeObjectURL(url); }catch(e){} }, 120000);
      try{ if(typeof showToast==='function') showToast('Code browser me open'); }catch(e){}
    }catch(e){
      try{ if(typeof showToast==='function') showToast('Open fail'); }catch(e2){}
    }
  };

  /* ===== URL input + Code box helper buttons ===== */
  window.__urlInputUndo = '';
  window.__urlCodeUndo = '';

  function _urlToast(m){ try{ if(typeof showToast==='function') showToast(m); }catch(e){} }

  /* URL input: Clear */
  window.urlInputClear = function(){
    var input = document.getElementById('urlCodeFullInput');
    if(!input) return;
    var cur = input.value || '';
    if(cur) window.__urlInputUndo = cur;
    input.value = '';
    input.focus();
    _urlToast('URL clear');
  };

  /* URL input: Redo (restore last cleared URL) */
  window.urlInputRedo = function(){
    var input = document.getElementById('urlCodeFullInput');
    if(!input) return;
    if(!window.__urlInputUndo){ _urlToast('Redo ke liye kuch nahi'); return; }
    input.value = window.__urlInputUndo;
    input.focus();
    _urlToast('URL restore');
  };

  /* URL input: Copy */
  window.urlInputCopy = function(){
    var input = document.getElementById('urlCodeFullInput');
    var url = input ? (input.value || '').trim() : '';
    if(!url){ _urlToast('URL box khali hai'); return; }
    try{
      if(navigator.clipboard && navigator.clipboard.writeText){
        navigator.clipboard.writeText(url).then(function(){ _urlToast('URL copied'); });
      } else {
        var ta = document.createElement('textarea');
        ta.value = url; document.body.appendChild(ta); ta.select();
        document.execCommand('copy'); ta.remove();
        _urlToast('URL copied');
      }
    }catch(e){ _urlToast('Copy fail'); }
  };

  /* URL input: Paste — jo copy kiya wahi seedha URL box me, NO prompt */
  window.urlInputPaste = async function(){
    var input = document.getElementById('urlCodeFullInput');
    if(!input) return;
    var txt = '';
    try{
      if(navigator.clipboard && navigator.clipboard.readText){
        txt = await navigator.clipboard.readText();
      }
    }catch(e){}
    if(!txt){
      _urlToast('Clipboard se paste nahi hua — pehle URL copy karein');
      input.focus();
      return;
    }
    txt = String(txt).trim();
    var m = txt.match(/https?:\/\/[^\s<>"']+/i);
    if(m) txt = m[0];
    else txt = txt.split(/\r?\n/)[0].trim();
    if(!txt){ _urlToast('Clipboard khali'); return; }
    if(input.value) window.__urlInputUndo = input.value;
    input.value = txt;
    try{ input.dispatchEvent(new Event('input', {bubbles:true})); }catch(e){}
    input.focus();
    _urlToast('URL paste');
  };

  /* Code box: Paste — jo copy kiya wahi seedha code box me, NO prompt */
  window.urlCodePaste = async function(){
    var output = document.getElementById('urlCodeFullOutput');
    if(!output) return;
    var txt = '';
    try{
      if(navigator.clipboard && navigator.clipboard.readText){
        txt = await navigator.clipboard.readText();
      }
    }catch(e){}
    if(!txt){
      _urlToast('Clipboard se paste nahi hua — pehle code copy karein');
      output.focus();
      return;
    }
    if((output.value || '').trim()) window.__urlCodeUndo = output.value;
    output.value = String(txt);
    try{ if(typeof updateUrlCodeLines==='function') updateUrlCodeLines(); }catch(e){}
    try{ window.syncUrlExtraActions(); }catch(e){}
    try{ if(typeof window.scheduleUrlCodeHighlight==='function') window.scheduleUrlCodeHighlight(); }catch(e){}
    try{ window.syncUrlCodeLines(output); }catch(e){}
    output.focus();
    _urlToast('Code paste');
  };

  /* Code box: Redo (restore last cleared / reset code) */
  window.urlCodeRedo = function(){
    var output = document.getElementById('urlCodeFullOutput');
    if(!output) return;
    if(!window.__urlCodeUndo){ _urlToast('Redo ke liye code nahi'); return; }
    output.value = window.__urlCodeUndo;
    try{ if(typeof updateUrlCodeLines==='function') updateUrlCodeLines(); }catch(e){}
    try{ window.syncUrlExtraActions(); }catch(e){}
    try{ if(typeof window.scheduleUrlCodeHighlight==='function') window.scheduleUrlCodeHighlight(); }catch(e){}
    var view = document.getElementById('urlCodeFullView');
    if(view) view.classList.remove('url-is-previewing');
    try{
      var ib=document.getElementById('urlInlinePreviewBtn');
      if(ib) ib.innerHTML='<i class="fas fa-eye"></i> Preview';
    }catch(e){}
    _urlToast('Code restore');
  };

  /* --- Tab plain until Back: mark visited --- */
  window.__markDivideTabVisited = function(mode){
    try{
      document.querySelectorAll('.divide-mode-tab').forEach(function(b){
        b.classList.remove('tab-visited');
        if(b.getAttribute('data-mode') === mode) b.classList.add('tab-visited');
      });
    }catch(e){}
  };

  /* Clear active fill when entering HTML Divide section */
  var _prevSMS = window.switchMainSection;
  window.switchMainSection = function(sec){
    if(typeof _prevSMS === 'function') _prevSMS(sec);
    if(sec === 'html-divide'){
      try{
        document.querySelectorAll('.divide-mode-tab').forEach(function(b){
          /* keep tab-visited if set, but remove heavy active look handled by CSS */
        });
      }catch(e){}
    }
  };

  /* Wrap closes to mark visited */
  var _closeCD = window.closeCodeDivideFullView;
  window.closeCodeDivideFullView = function(){
    if(typeof _closeCD === 'function') _closeCD();
    window.__markDivideTabVisited('divide');
  };
  var _closeURL = window.closeUrlCodeFullView;
  window.closeUrlCodeFullView = function(){
    if(typeof _closeURL === 'function') _closeURL();
    window.__markDivideTabVisited('urlcode');
  };

  /* Multiple HTML / Course: mark when opened if they use full views */
  document.addEventListener('click', function(ev){
    var t = ev.target.closest('.divide-mode-tab[data-mode="multiple"]');
    if(t){
      setTimeout(function(){ window.__markDivideTabVisited('multiple'); }, 100);
    }
    var t2 = ev.target.closest('.divide-mode-tab[data-mode="courses"]');
    if(t2){
      setTimeout(function(){ window.__markDivideTabVisited('courses'); }, 100);
    }
  }, true);

  /* Code action rows:
     - pehli baar empty → hide
     - code aaya → show
     - Reset ke baad bhi show (taaki Redo se code wapas aaye)
     - sirf tab hide jab na code ho na undo */
  /* Buttons always visible */
  window.syncUrlExtraActions = function(){
    var row1 = document.getElementById('urlExtraActions');
    var row2 = document.getElementById('urlCodeActions');
    if(row1) row1.classList.add('is-visible');
    if(row2) row2.classList.add('is-visible');
  };

  /* Hook input on URL output */
  document.addEventListener('input', function(ev){
    if(ev.target && ev.target.id === 'urlCodeFullOutput'){
      var v = (ev.target.value || '').trim();
      if(v) window.__urlCodeUndo = window.__urlCodeUndo || v;
      window.syncUrlExtraActions();
    }
  });

  /* Patch reset: undo save already in resetUrlCodeFull — buttons RAHENGE for Redo */
  var _resetURL = window.resetUrlCodeFull;
  window.resetUrlCodeFull = function(){
    if(typeof _resetURL === 'function') _resetURL();
    try{ window.syncUrlExtraActions(); }catch(e){}
  };

  /* Faster fetch: race parallel proxies */
  window.fetchUrlCodeFull = function(){
    var input = document.getElementById('urlCodeFullInput');
    var output = document.getElementById('urlCodeFullOutput');
    var status = document.getElementById('urlCodeFullStatus');
    var btn = document.getElementById('urlCodeFullFetchBtn');
    if(!input || !output) return;
    var url = (input.value || '').trim();
    if(!url){ try{ if(typeof showToast==='function') showToast('URL dalein'); }catch(e){} return; }
    if(!/^https?:\/\//i.test(url)) url = 'https://' + url;
    if(status) status.textContent = 'Fetching (fast)…';
    if(btn){ btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>'; }

    var proxies = [
      function(u){ return 'https://api.allorigins.win/raw?url=' + encodeURIComponent(u); },
      function(u){ return 'https://corsproxy.io/?' + encodeURIComponent(u); },
      function(u){ return 'https://api.codetabs.com/v1/proxy?quest=' + encodeURIComponent(u); }
    ];

    var done = false;
    var controllers = [];
    var timeoutMs = 12000;

    function finish(ok, txt, errMsg){
      if(done) return;
      done = true;
      controllers.forEach(function(c){ try{ c.abort(); }catch(e){} });
      if(btn){ btn.disabled = false; btn.innerHTML = '<i class="fas fa-download"></i> Fetch'; }
      if(ok){
        output.value = txt || '';
        try{ if(typeof updateUrlCodeLines==='function') updateUrlCodeLines(); }catch(e){}
        try{ window.syncUrlExtraActions(); }catch(e){}
        if(status) status.textContent = 'OK — ' + ((txt||'').length) + ' chars';
        try{ if(typeof showToast==='function') showToast('Source mil gaya'); }catch(e){}
      } else {
        if(status) status.textContent = errMsg || 'Fetch fail — code manually paste karo';
        try{ if(typeof showToast==='function') showToast('Fetch fail'); }catch(e){}
      }
    }

    var pending = proxies.length;
    proxies.forEach(function(build){
      var ctrl = (typeof AbortController !== 'undefined') ? new AbortController() : null;
      if(ctrl) controllers.push(ctrl);
      var timer = setTimeout(function(){ try{ if(ctrl) ctrl.abort(); }catch(e){} }, timeoutMs);
      var opts = ctrl ? { signal: ctrl.signal } : {};
      fetch(build(url), opts)
        .then(function(r){ if(!r.ok) throw new Error('status'); return r.text(); })
        .then(function(txt){
          clearTimeout(timer);
          if(txt && String(txt).length > 20) finish(true, txt);
          else {
            pending--;
            if(pending <= 0) finish(false, '', 'Fetch fail');
          }
        })
        .catch(function(){
          clearTimeout(timer);
          pending--;
          if(pending <= 0 && !done) finish(false, '', 'Fetch fail — CORS / network');
        });
    });
  };

  /* Also show buttons after successful open of view if already has code */
  var _openURL2 = window.openUrlCodeFullView;
  window.openUrlCodeFullView = function(){
    if(typeof _openURL2 === 'function') _openURL2();
    setTimeout(function(){ try{ window.syncUrlExtraActions(); }catch(e){} }, 50);
  };



  /* ===== FIX: instant Cut Preview with combined HTML+CSS+JS ===== */
  window.codeDivideFullCutPreview = function(){
    var el = function(id){ return document.getElementById(id); };
    var toast = function(m){ try{ if(typeof showToast==='function') showToast(m); }catch(e){} };

    /* Prefer live result boxes from Generate */
    var html = '', css = '', js = '';
    var boxH = el('cdfOutHtml'), boxC = el('cdfOutCss'), boxJ = el('cdfOutJs');
    if(boxH) html = boxH.value || '';
    if(boxC) css = boxC.value || '';
    if(boxJ) js = boxJ.value || '';

    var result = window.__cdfLastResult;
    if((!html && !css && !js) && result){
      if(result.type === 'triple'){
        html = result.html || '';
        css = result.css || '';
        js = result.js || '';
      } else if(result.value){
        html = result.value;
      }
    }
    if(!html && !css && !js){
      var srcEl = el('codeDivideFullSource');
      html = srcEl ? (srcEl.value || '') : '';
    }
    if(!(html || css || js)){ toast('Pehle Generate karein'); return; }

    /* Build combined document IMMEDIATELY */
    var low = (html || '').toLowerCase();
    var isFull = low.indexOf('<html') >= 0 || low.indexOf('<!doctype') >= 0;
    var doc;
    if(isFull){
      doc = html;
      if(css){
        if(/<\/head>/i.test(doc)) doc = doc.replace(/<\/head>/i, '<style id="israr-cut-css">\n'+css+'\n</style>\n</head>');
        else doc = '<style id="israr-cut-css">\n'+css+'\n</style>\n' + doc;
      }
      if(js){
        if(/<\/body>/i.test(doc)) doc = doc.replace(/<\/body>/i, '<script id="israr-cut-js">\n'+js+'\n<\/script>\n</body>');
        else doc = doc + '\n<script id="israr-cut-js">\n'+js+'\n<\/script>';
      }
    } else {
      doc = '<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
        + '<style id="israr-cut-css">\n' + (css||'') + '\n</style></head><body>\n'
        + (html||'') + '\n<script id="israr-cut-js">\n' + (js||'') + '\n<\/script>\n</body></html>';
    }

    var view = el('htmlDividePreviewView');
    var frame = el('htmlDividePreviewFrame');
    if(!view || !frame){ toast('Preview missing'); return; }

    /* Open full page FIRST — no delay */
    var titleEl = el('htmlDividePreviewTitle');
    if(titleEl) titleEl.textContent = 'Cut Preview (HTML+CSS+JS)';
    view.setAttribute('data-open','1');
    view.style.cssText = 'display:flex !important;flex-direction:column !important;position:fixed !important;inset:0 !important;z-index:1000080 !important;background:var(--bg) !important;';
    document.body.classList.add('subview-active');

    /* Write frame content ASAP */
    try{
      if(frame._blobUrl){ try{ URL.revokeObjectURL(frame._blobUrl); }catch(e){} frame._blobUrl=null; }
      frame.removeAttribute('src');
      frame.removeAttribute('srcdoc');
      /* srcdoc is fastest for moderate size; blob for huge */
      if(doc.length > 350000){
        frame._blobUrl = URL.createObjectURL(new Blob([doc], {type:'text/html;charset=utf-8'}));
        frame.src = frame._blobUrl;
      } else {
        frame.srcdoc = doc;
      }
    }catch(e){
      try{ frame.srcdoc = doc; }catch(e2){}
    }
  };

  /* Fast close preview */
  window.closeHtmlDividePreviewView = function(){
    var view = document.getElementById('htmlDividePreviewView');
    var frame = document.getElementById('htmlDividePreviewFrame');
    if(view){
      view.setAttribute('data-open','0');
      view.style.cssText = 'display:none !important;';
    }
    if(frame){
      try{
        if(frame._blobUrl){ URL.revokeObjectURL(frame._blobUrl); frame._blobUrl=null; }
        frame.removeAttribute('src');
        frame.removeAttribute('srcdoc');
        frame.srcdoc = '';
      }catch(e){}
    }
    document.body.classList.remove('subview-active');
  };

  /* ===== FIX: more reliable URL fetch ===== */
  window.fetchUrlCodeFull = function(){
    var input = document.getElementById('urlCodeFullInput');
    var output = document.getElementById('urlCodeFullOutput');
    var status = document.getElementById('urlCodeFullStatus');
    var btn = document.getElementById('urlCodeFullFetchBtn');
    if(!input || !output) return;
    var url = (input.value || '').trim();
    if(!url){ try{ if(typeof showToast==='function') showToast('URL dalein'); }catch(e){} return; }
    if(!/^https?:\/\//i.test(url)) url = 'https://' + url;

    if(status) status.textContent = 'Fetching…';
    if(btn){ btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>'; }

    /* Multiple strategies */
    var attempts = [
      { name: 'allorigins-raw', url: function(u){ return 'https://api.allorigins.win/raw?url=' + encodeURIComponent(u); }, parse: function(t){ return t; } },
      { name: 'allorigins-json', url: function(u){ return 'https://api.allorigins.win/get?url=' + encodeURIComponent(u); }, parse: function(t){
          try{ var j = JSON.parse(t); return j.contents || j.content || t; }catch(e){ return t; }
        }},
      { name: 'corsproxy', url: function(u){ return 'https://corsproxy.io/?' + encodeURIComponent(u); }, parse: function(t){ return t; } },
      { name: 'codetabs', url: function(u){ return 'https://api.codetabs.com/v1/proxy?quest=' + encodeURIComponent(u); }, parse: function(t){ return t; } },
      { name: 'thingproxy', url: function(u){ return 'https://thingproxy.freeboard.io/fetch/' + u; }, parse: function(t){ return t; } }
    ];

    var done = false;
    var left = attempts.length;

    function ok(txt, via){
      if(done) return;
      if(!txt || String(txt).trim().length < 10) return;
      done = true;
      output.value = String(txt);
      try{ if(typeof updateUrlCodeLines==='function') updateUrlCodeLines(); }catch(e){}
      try{ if(typeof window.syncUrlExtraActions==='function') window.syncUrlExtraActions(); }catch(e){}
      if(status) status.textContent = 'OK — ' + txt.length + ' chars (' + via + ')';
      if(btn){ btn.disabled = false; btn.innerHTML = '<i class="fas fa-download"></i> Fetch'; }
      try{ if(typeof showToast==='function') showToast('Source mil gaya'); }catch(e){}
    }
    function failOne(){
      left--;
      if(left <= 0 && !done){
        if(status) status.textContent = 'Fetch fail — CORS. Code manually paste karo.';
        if(btn){ btn.disabled = false; btn.innerHTML = '<i class="fas fa-download"></i> Fetch'; }
        try{ if(typeof showToast==='function') showToast('Fetch fail — paste code'); }catch(e){}
      }
    }

    attempts.forEach(function(a){
      var ctrl = (typeof AbortController !== 'undefined') ? new AbortController() : null;
      var timer = setTimeout(function(){ try{ if(ctrl) ctrl.abort(); }catch(e){} failOne(); }, 10000);
      var opts = { method: 'GET' };
      if(ctrl) opts.signal = ctrl.signal;
      fetch(a.url(url), opts)
        .then(function(r){
          if(!r.ok) throw new Error('bad');
          return r.text();
        })
        .then(function(t){
          clearTimeout(timer);
          var parsed = a.parse(t);
          if(parsed && String(parsed).trim().length >= 10) ok(parsed, a.name);
          else failOne();
        })
        .catch(function(){
          clearTimeout(timer);
          failOne();
        });
    });
  };

})();


/* ===== SCRIPT 29 id=israrlab-preview-buttons-fix ===== */
(function(){
  function el(id){ return document.getElementById(id); }
  function toast(m){ try{ if(typeof showToast==='function') showToast(m); }catch(e){ try{ alert(m); }catch(e2){} } }

  function openPreviewShell(title){
    var view = el('htmlDividePreviewView');
    var frame = el('htmlDividePreviewFrame');
    if(!view || !frame){ toast('Preview view missing'); return null; }
    var cdf = el('codeDivideFullView');
    if(cdf){ cdf.style.zIndex = '1000060'; }
    var titleEl = el('htmlDividePreviewTitle');
    if(titleEl) titleEl.textContent = title || 'Preview';
    view.setAttribute('data-open','1');
    view.style.setProperty('display','flex','important');
    view.style.setProperty('flex-direction','column','important');
    view.style.setProperty('position','fixed','important');
    view.style.setProperty('inset','0','important');
    view.style.setProperty('top','0','important');
    view.style.setProperty('left','0','important');
    view.style.setProperty('right','0','important');
    view.style.setProperty('bottom','0','important');
    view.style.setProperty('width','100vw','important');
    view.style.setProperty('height','100dvh','important');
    view.style.setProperty('z-index','1000099','important');
    view.style.setProperty('background','var(--bg,#03050b)','important');
    view.style.setProperty('visibility','visible','important');
    view.style.setProperty('opacity','1','important');
    document.body.classList.add('subview-active');
    return frame;
  }

  function writeFrame(frame, doc){
    if(!frame) return;
    doc = String(doc || '');
    try{
      if(frame._blobUrl){ try{ URL.revokeObjectURL(frame._blobUrl); }catch(e){} frame._blobUrl=null; }
      frame.removeAttribute('src');
      frame.removeAttribute('srcdoc');
      if(doc.length > 300000){
        frame._blobUrl = URL.createObjectURL(new Blob([doc], {type:'text/html;charset=utf-8'}));
        frame.src = frame._blobUrl;
      } else {
        frame.srcdoc = doc;
      }
    }catch(e){
      try{
        var d = frame.contentDocument || (frame.contentWindow && frame.contentWindow.document);
        if(d){ d.open(); d.write(doc); d.close(); }
        else frame.srcdoc = doc;
      }catch(e2){
        try{ frame.srcdoc = doc; }catch(e3){}
      }
    }
  }

  function getCdfSource(){
    var ta = el('codeDivideFullSource');
    if(ta && (ta.value || '').trim()) return ta.value;
    try{ if(typeof getCdfSrc==='function'){ var s=getCdfSrc(); if(s&&String(s).trim()) return s; } }catch(e){}
    return '';
  }

  function buildCombinedDoc(html, css, js){
    html = html || ''; css = css || ''; js = js || '';
    var low = html.toLowerCase();
    var isFull = low.indexOf('<html') >= 0 || low.indexOf('<!doctype') >= 0;
    var doc;
    if(isFull){
      doc = html;
      if(css){
        if(/<\/head>/i.test(doc)) doc = doc.replace(/<\/head>/i, '<style id="israr-cut-css">\n'+css+'\n</style>\n</head>');
        else doc = '<style id="israr-cut-css">\n'+css+'\n</style>\n' + doc;
      }
      if(js){
        if(/<\/body>/i.test(doc)) doc = doc.replace(/<\/body>/i, '<script id="israr-cut-js">\n'+js+'\n<\/script>\n</body>');
        else doc = doc + '\n<script id="israr-cut-js">\n'+js+'\n<\/script>';
      }
    } else {
      doc = '<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
        + '<style id="israr-cut-css">\n' + css + '\n</style></head><body>\n'
        + html + '\n<script id="israr-cut-js">\n' + js + '\n<\/script>\n</body></html>';
    }
    return doc;
  }

  window.codeDivideFullPreview = function(){
    try{
      var src = getCdfSource();
      if(!src.trim()){
        var h = (el('cdfOutHtml')||{}).value || '';
        var c = (el('cdfOutCss')||{}).value || '';
        var j = (el('cdfOutJs')||{}).value || '';
        var single = (el('cdfOutSingle')||{}).value || '';
        if(h || c || j) src = buildCombinedDoc(h, c, j);
        else if(single) src = single;
      }
      if(!src || !String(src).trim()){ toast('Pehle code dalein ya Generate karein'); return; }
      var frame = openPreviewShell('Full Preview');
      if(!frame) return;
      writeFrame(frame, src);
      toast('Preview open');
    }catch(err){ console.error(err); toast('Preview fail'); }
  };

  window.codeDivideFullCutPreview = function(){
    try{
      var html = '', css = '', js = '';
      var boxH = el('cdfOutHtml'), boxC = el('cdfOutCss'), boxJ = el('cdfOutJs'), boxS = el('cdfOutSingle');
      if(boxH) html = boxH.value || '';
      if(boxC) css = boxC.value || '';
      if(boxJ) js = boxJ.value || '';
      if(!html && !css && !js && boxS) html = boxS.value || '';
      var result = window.__cdfLastResult;
      if((!html && !css && !js) && result){
        if(result.type === 'triple'){
          html = result.html || '';
          css = result.css || '';
          js = result.js || '';
        } else if(result.value){ html = result.value; }
      }
      if(!html && !css && !js){ html = getCdfSource(); }
      if(!(html || css || js)){ toast('Pehle Generate karein'); return; }
      var doc = buildCombinedDoc(html, css, js);
      var frame = openPreviewShell('Cut Preview (HTML+CSS+JS)');
      if(!frame) return;
      writeFrame(frame, doc);
      toast('Cut Preview open');
    }catch(err){ console.error(err); toast('Cut Preview fail'); }
  };

  window.closeHtmlDividePreviewView = function(){
    var view = el('htmlDividePreviewView');
    var frame = el('htmlDividePreviewFrame');
    if(view){
      view.setAttribute('data-open','0');
      view.style.setProperty('display','none','important');
    }
    if(frame){
      try{
        if(frame._blobUrl){ URL.revokeObjectURL(frame._blobUrl); frame._blobUrl=null; }
        frame.removeAttribute('src');
        frame.removeAttribute('srcdoc');
        frame.srcdoc = '';
      }catch(e){}
    }
    var cdf = el('codeDivideFullView');
    if(cdf){ cdf.style.zIndex = ''; }
    document.body.classList.remove('subview-active');
  };

  window.fetchUrlCodeFull = function(){
    var input = el('urlCodeFullInput');
    var output = el('urlCodeFullOutput');
    var status = el('urlCodeFullStatus');
    var btn = el('urlCodeFullFetchBtn');
    if(!input || !output){ toast('URL UI missing'); return; }
    var url = (input.value || '').trim();
    if(!url){ toast('URL dalein'); return; }
    if(!/^https?:\/\//i.test(url)) url = 'https://' + url;
    if(status) status.textContent = 'Fetching…';
    if(btn){ btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>'; }

    var attempts = [
      { name: 'jina', url: function(u){ return 'https://r.jina.ai/' + u; }, parse: function(t){ return t; } },
      { name: 'allorigins-raw', url: function(u){ return 'https://api.allorigins.win/raw?url=' + encodeURIComponent(u); }, parse: function(t){ return t; } },
      { name: 'allorigins-json', url: function(u){ return 'https://api.allorigins.win/get?url=' + encodeURIComponent(u); }, parse: function(t){
          try{ var j = JSON.parse(t); return j.contents || j.content || t; }catch(e){ return t; }
        }},
      { name: 'corsproxy', url: function(u){ return 'https://corsproxy.io/?' + encodeURIComponent(u); }, parse: function(t){ return t; } },
      { name: 'codetabs', url: function(u){ return 'https://api.codetabs.com/v1/proxy?quest=' + encodeURIComponent(u); }, parse: function(t){ return t; } },
      { name: 'thingproxy', url: function(u){ return 'https://thingproxy.freeboard.io/fetch/' + u; }, parse: function(t){ return t; } }
    ];

    var done = false;
    var left = attempts.length;

    function ok(txt, via){
      if(done) return;
      if(!txt || String(txt).trim().length < 20) return;
      done = true;
      output.value = String(txt);
      try{ if(typeof updateUrlCodeLines==='function') updateUrlCodeLines(); }catch(e){}
      try{ if(typeof window.syncUrlExtraActions==='function') window.syncUrlExtraActions(); }catch(e){}
      if(status) status.textContent = 'OK — ' + txt.length + ' chars (' + via + ')';
      if(btn){ btn.disabled = false; btn.innerHTML = '<i class="fas fa-download"></i> Fetch'; }
      toast('Source mil gaya');
    }
    function failOne(){
      left--;
      if(left <= 0 && !done){
        if(status) status.textContent = 'Fetch fail — CORS. Code manually paste karo.';
        if(btn){ btn.disabled = false; btn.innerHTML = '<i class="fas fa-download"></i> Fetch'; }
        toast('Fetch fail — paste code');
      }
    }

    attempts.forEach(function(a){
      var ctrl = (typeof AbortController !== 'undefined') ? new AbortController() : null;
      var timer = setTimeout(function(){ try{ if(ctrl) ctrl.abort(); }catch(e){} failOne(); }, 14000);
      var opts = { method: 'GET' };
      if(ctrl) opts.signal = ctrl.signal;
      fetch(a.url(url), opts)
        .then(function(r){ if(!r.ok) throw new Error('bad'); return r.text(); })
        .then(function(t){
          clearTimeout(timer);
          var parsed = a.parse(t);
          if(parsed && String(parsed).trim().length >= 20) ok(parsed, a.name);
          else failOne();
        })
        .catch(function(){ clearTimeout(timer); failOne(); });
    });
  };
})();


/* ===== SCRIPT 30 id=israrlab-category-final-fix ===== */
(function(){
  function el(id){ return document.getElementById(id); }
  function toast(m){ try{ if(typeof showToast==='function') showToast(m); }catch(e){} }

  function loadCatFrame(iframe, code){
    if(!iframe) return;
    code = code || iframe.__previewCode || '';
    try{
      if(iframe._blobUrl){ try{ URL.revokeObjectURL(iframe._blobUrl); }catch(e){} iframe._blobUrl=null; }
      iframe.removeAttribute('src');
      iframe.removeAttribute('srcdoc');
      if(!code){ iframe.srcdoc=''; return; }
      if(code.length > 2000000){
        iframe.srcdoc = '<!DOCTYPE html><html><body style="margin:0;display:flex;align-items:center;justify-content:center;height:100vh;font:12px sans-serif;background:#0f172a;color:#94a3b8;text-align:center;padding:12px;">Large file ('+Math.round(code.length/1000)+' KB)<br>Open Preview</body></html>';
      } else if(code.length > 350000){
        iframe._blobUrl = URL.createObjectURL(new Blob([code],{type:'text/html;charset=utf-8'}));
        iframe.src = iframe._blobUrl;
      } else {
        iframe.srcdoc = code;
      }
    }catch(e){
      try{ iframe.srcdoc = code || ''; }catch(e2){}
    }
    try{ delete iframe.__previewCode; }catch(e){}
    iframe.dataset.loaded = '1';
  }

  window.renderCategoryNotesLive = function(){
    var host = el('categoryNotesLive');
    if(!host) return;
    if(typeof notes === 'undefined' || !notes){ host.innerHTML=''; return; }
    var filter = (typeof currentCategoryFilter !== 'undefined') ? currentCategoryFilter : 'All';
    /* All = only cards that have a category. Empty-category cards stay on Home only. */
    var list = (filter === 'All' || !filter)
      ? notes.filter(function(n){ return !!(n && n.category && String(n.category).trim()); })
      : notes.filter(function(n){ return String(n.category || '') === String(filter); });

    if(!list.length){
      host.innerHTML = '<p style="font-size:12px;color:var(--muted);padding:12px 4px;">Is category me koi card nahi. Settings → Category se assign karein.</p>';
      return;
    }

    var frag = document.createDocumentFragment();
    var maxShow = Math.min(list.length, 50);
    for(var i = 0; i < maxShow; i++){
      var n = list[i];
      var idx = notes.indexOf(n);
      if(idx < 0) continue;
      var title = String(n.title || 'Untitled').replace(/</g,'&lt;').replace(/>/g,'&gt;');
      var code = n.htmlCode || '';
      var len = code.length;
      var kb = len >= 1024 ? (Math.round(len/102.4)/10) + ' KB' : len + ' B';
      var words = len > 80000 ? Math.max(1, Math.round(len/6)) : (code.trim() ? code.trim().split(/\s+/).length : 0);
      var dateStr = '';
      try{
        if(n.updatedAt) dateStr = (typeof n.updatedAt === 'number') ? new Date(n.updatedAt).toLocaleString() : String(n.updatedAt);
        else if(n.createdAt) dateStr = (typeof n.createdAt === 'number') ? new Date(n.createdAt).toLocaleString() : String(n.createdAt);
        else if(n.createdAtStr) dateStr = n.createdAtStr;
      }catch(e){}

      var card = document.createElement('div');
      card.className = 'note-card' + (n.isPinned ? ' pinned' : '');
      card.setAttribute('data-note-index', String(idx));
      card.innerHTML =
        '<div class="pin-badge">PIN</div>'
        + '<div class="card-cover-box">'
        +   '<div class="html-preview-wrapper">'
        +     '<iframe loading="lazy" data-srcdoc="" title="preview" sandbox="allow-scripts allow-same-origin allow-forms allow-modals"></iframe>'
        +   '</div>'
        + '</div>'
        + '<div class="card-body">'
        +   '<div class="card-meta-row card-date-row"><span class="card-date">🕒 '+dateStr+'</span></div>'
        +   '<div class="card-meta-row card-stats-row"><span class="card-stats">📝 <span class="stat-chars">'+len+' chars</span> | <span class="stat-words">'+words+' words</span> · <strong class="stat-kb">'+kb+'</strong></span></div>'
        +   '<div class="title-row"><h3 style="cursor:pointer;margin:0;font-size:13px;" data-i="'+idx+'" data-act="edit">'+title+'</h3></div>'
        + '</div>'
        + '<div class="card-footer"><div class="card-footer-row">'
        +   '<button type="button" class="card-edit-btn" data-i="'+idx+'" data-act="edit">Edit</button>'
        +   '<button type="button" class="card-view-btn" data-i="'+idx+'" data-act="preview">Preview</button>'
        +   '<button type="button" class="card-copy-btn" data-i="'+idx+'" data-act="copy">Copy</button>'
        +   '<button type="button" class="card-setting-btn" data-i="'+idx+'" data-act="settings"><i class="fas fa-cog"></i> Settings</button>'
        + '</div></div>';

      var iframe = card.querySelector('iframe');
      if(iframe){
        iframe.__previewCode = code;
        iframe.setAttribute('sandbox','allow-scripts allow-same-origin allow-forms allow-modals');
      }
      frag.appendChild(card);
    }
    host.innerHTML = '';
    host.appendChild(frag);

    /* FORCE load previews immediately (like Home) — do not wait only on IntersectionObserver */
    var frames = host.querySelectorAll('iframe');
    Array.prototype.forEach.call(frames, function(ifr, k){
      var code = ifr.__previewCode || '';
      setTimeout(function(){ loadCatFrame(ifr, code); }, 40 + k * 50);
    });
  };

  /* Category card clicks */
  document.addEventListener('click', function(ev){
    var host = el('categoryNotesLive');
    if(!host || !host.contains(ev.target)) return;

    /* Settings button */
    var setBtn = ev.target.closest('button[data-act="settings"], .card-setting-btn');
    if(setBtn && host.contains(setBtn)){
      ev.preventDefault(); ev.stopPropagation();
      var i = parseInt(setBtn.getAttribute('data-i'), 10);
      if(isNaN(i)){
        var card = setBtn.closest('[data-note-index]');
        if(card) i = parseInt(card.getAttribute('data-note-index'), 10);
      }
      if(!isNaN(i) && i >= 0){
        window.__selectedNoteIndexForContext = i;
        if(typeof selectedNoteIndexForContext !== 'undefined') selectedNoteIndexForContext = i;
        if(typeof openCardSettingMenu === 'function') openCardSettingMenu(ev, i);
      }
      return;
    }

    var b = ev.target.closest('[data-act], button[data-act], h3[data-act]');
    if(!b) return;
    var card = b.closest('[data-note-index]');
    var i = b.getAttribute('data-i');
    if(i == null && card) i = card.getAttribute('data-note-index');
    i = parseInt(i, 10);
    if(isNaN(i) || i < 0) return;
    var act = b.getAttribute('data-act') || (b.tagName === 'H3' ? 'edit' : '');
    if(!act) return;
    ev.preventDefault();
    ev.stopPropagation();
    try{
      if(act === 'edit' && typeof openEditor === 'function') openEditor(i);
      else if(act === 'preview' && typeof openFullHtmlViewer === 'function') openFullHtmlViewer(i);
      else if(act === 'copy'){
        var code = (notes[i] && notes[i].htmlCode) || '';
        if(navigator.clipboard) navigator.clipboard.writeText(code).then(function(){ toast('Copied'); });
      }
      else if(act === 'settings' && typeof openCardSettingMenu === 'function'){
        if(typeof selectedNoteIndexForContext !== 'undefined') selectedNoteIndexForContext = i;
        openCardSettingMenu(ev, i);
      }
    }catch(e){}
  }, true);

  /* Strong Uncategory */
  window.removeNoteCategory = function(index){
    if(index == null || index < 0 || !notes || !notes[index]) return;
    notes[index].category = '';
    try{ delete notes[index].category; }catch(e){}
    try{ if(typeof saveData === 'function') saveData(); }catch(e){}
    try{ if(typeof hideCategoryPickerMenu === 'function') hideCategoryPickerMenu(); }catch(e){}
    try{ if(typeof closeCardSettingMenu === 'function') closeCardSettingMenu(); }catch(e){}
    var menu = el('contextMenu'); if(menu) menu.style.display = 'none';
    var picker = el('categoryPickerMenu'); if(picker) picker.style.display = 'none';
    try{ if(typeof renderCategories === 'function') renderCategories(); }catch(e){}
    try{ if(typeof renderNotes === 'function') renderNotes(); }catch(e){}
    try{ window.renderCategoryNotesLive(); }catch(e){}
    toast('Category hata diya');
  };

  window.menuActionUncategory = function(){
    var idx = (typeof selectedNoteIndexForContext !== 'undefined') ? selectedNoteIndexForContext : window.__selectedNoteIndexForContext;
    if(idx == null || idx < 0 || !notes || !notes[idx]){
      try{ if(typeof closeCardSettingMenu === 'function') closeCardSettingMenu(); }catch(e){}
      return;
    }
    window.removeNoteCategory(idx);
  };

  /* When opening category tab, re-render so previews load */
  var _sms = window.switchMainSection;
  window.switchMainSection = function(sec){
    window.currentMainSection = sec || 'home';
    if(typeof _sms === 'function') _sms(sec);
    if(sec === 'category'){
      setTimeout(function(){
        try{ window.renderCategoryNotesLive(); }catch(e){}
      }, 80);
    }
  };

  /* Also re-load when filter chip changes */
  var _fbc = window.filterByCategory;
  if(typeof _fbc === 'function'){
    window.filterByCategory = function(cat, btn){
      _fbc(cat, btn);
      setTimeout(function(){ try{ window.renderCategoryNotesLive(); }catch(e){} }, 60);
    };
  }
})();


/* ===== SCRIPT 31 id=israrlab-cdf-preview-final-fix ===== */
(function(){
  function el(id){ return document.getElementById(id); }
  function toast(m){
    try{ if(typeof showToast==='function') showToast(m); else console.log(m); }catch(e){}
  }

  function getSource(){
    var ta = el('codeDivideFullSource');
    if(ta && (ta.value||'').trim()) return ta.value;
    try{
      if(typeof window.getCdfSrc==='function'){
        var s = window.getCdfSrc();
        if(s && String(s).trim()) return s;
      }
    }catch(e){}
    return '';
  }

  function buildDoc(html, css, js){
    html = html || ''; css = css || ''; js = js || '';
    var low = html.toLowerCase();
    var isFull = low.indexOf('<html') >= 0 || low.indexOf('<!doctype') >= 0;
    var doc;
    if(isFull){
      doc = html;
      if(css){
        if(/<\/head>/i.test(doc)) doc = doc.replace(/<\/head>/i, '<style id="israr-cut-css">\n'+css+'\n</style>\n</head>');
        else doc = '<style id="israr-cut-css">\n'+css+'\n</style>\n' + doc;
      }
      if(js){
        if(/<\/body>/i.test(doc)) doc = doc.replace(/<\/body>/i, '<script id="israr-cut-js">\n'+js+'\n</'+'script>\n</body>');
        else doc = doc + '\n<script id="israr-cut-js">\n'+js+'\n</'+'script>';
      }
    } else {
      doc = '<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style id="israr-cut-css">\n'+css+'\n</style></head><body>\n'+html+'\n<script id="israr-cut-js">\n'+js+'\n</'+'script></body></html>';
    }
    return doc;
  }

  function writeFrame(frame, doc){
    if(!frame) return;
    doc = String(doc || '');
    try{
      if(frame._blobUrl){ try{ URL.revokeObjectURL(frame._blobUrl); }catch(e){} frame._blobUrl = null; }
      frame.removeAttribute('src');
      frame.removeAttribute('srcdoc');
      try{
        frame._blobUrl = URL.createObjectURL(new Blob([doc], {type:'text/html;charset=utf-8'}));
        frame.src = frame._blobUrl;
      }catch(e){
        frame.srcdoc = doc;
      }
    }catch(e){
      try{
        var d = frame.contentDocument || (frame.contentWindow && frame.contentWindow.document);
        if(d){ d.open(); d.write(doc); d.close(); }
        else frame.srcdoc = doc;
      }catch(e2){
        try{ frame.srcdoc = doc; }catch(e3){}
      }
    }
  }

  /* Preview panel INSIDE Code Divide page — no z-index fight */
  function ensureInlinePreview(){
    var cdf = el('codeDivideFullView');
    if(!cdf) return null;
    try{
      var cs = window.getComputedStyle(cdf);
      if(cs.position === 'static') cdf.style.position = 'fixed';
    }catch(e){
      cdf.style.position = 'fixed';
    }

    var panel = el('cdfInlinePreviewPanel');
    if(!panel){
      panel = document.createElement('div');
      panel.id = 'cdfInlinePreviewPanel';
      panel.setAttribute('data-open', '0');
      panel.innerHTML =
        '<div style="display:flex;align-items:center;gap:8px;padding:10px 12px;background:rgba(10,17,30,.98);border-bottom:1px solid rgba(255,255,255,.12);flex-shrink:0;">'
        +  '<button type="button" id="cdfInlinePreviewBack" style="height:36px;padding:0 14px;border-radius:10px;border:none;background:linear-gradient(135deg,#fbbf24,#f59e0b);color:#1a1200;font-weight:800;cursor:pointer;font-size:12px;">← Back</button>'
        +  '<span id="cdfInlinePreviewTitle" style="font-weight:800;font-size:13px;color:#f5f8ff;">Preview</span>'
        + '</div>'
        + '<iframe id="cdfInlinePreviewFrame" title="Preview" sandbox="allow-scripts allow-forms allow-modals allow-popups allow-same-origin" '
        + 'style="flex:1 1 auto;width:100%;height:100%;min-height:0;border:0;background:#fff;display:block;"></iframe>';
      panel.style.cssText = [
        'display:none',
        'flex-direction:column',
        'position:absolute',
        'inset:0',
        'top:0',
        'left:0',
        'right:0',
        'bottom:0',
        'width:100%',
        'height:100%',
        'z-index:99999',
        'background:#03050b',
        'box-sizing:border-box'
      ].join(';');
      cdf.appendChild(panel);
      var backBtn = el('cdfInlinePreviewBack');
      if(backBtn){
        backBtn.onclick = function(ev){
          if(ev){ try{ ev.preventDefault(); ev.stopPropagation(); }catch(e){} }
          window.closeCdfInlinePreview();
        };
      }
    } else if(panel.parentNode !== cdf){
      cdf.appendChild(panel);
    }
    return panel;
  }

  function openInlinePreview(title, doc){
    var cdf = el('codeDivideFullView');
    if(!cdf){
      toast('Code Divide page missing');
      return;
    }
    /* ensure Code Divide page is open/visible */
    cdf.setAttribute('data-open', '1');
    cdf.style.setProperty('display', 'flex', 'important');
    cdf.style.setProperty('visibility', 'visible', 'important');
    cdf.style.setProperty('pointer-events', 'auto', 'important');

    var panel = ensureInlinePreview();
    if(!panel) return;
    var frame = el('cdfInlinePreviewFrame');
    var titleEl = el('cdfInlinePreviewTitle');
    if(titleEl) titleEl.textContent = title || 'Preview';

    panel.setAttribute('data-open', '1');
    panel.style.setProperty('display', 'flex', 'important');
    panel.style.setProperty('flex-direction', 'column', 'important');
    panel.style.setProperty('position', 'absolute', 'important');
    panel.style.setProperty('inset', '0', 'important');
    panel.style.setProperty('z-index', '99999', 'important');
    panel.style.setProperty('visibility', 'visible', 'important');
    panel.style.setProperty('opacity', '1', 'important');
    panel.style.setProperty('pointer-events', 'auto', 'important');
    panel.style.setProperty('background', '#03050b', 'important');

    if(frame){
      frame.style.cssText = 'flex:1 1 auto!important;width:100%!important;height:100%!important;min-height:0!important;border:0!important;background:#fff!important;display:block!important;';
      requestAnimationFrame(function(){ writeFrame(frame, doc); });
    }
    toast('Preview open');
  }

  window.closeCdfInlinePreview = function(){
    var panel = el('cdfInlinePreviewPanel');
    var frame = el('cdfInlinePreviewFrame');
    if(panel){
      panel.setAttribute('data-open', '0');
      panel.style.setProperty('display', 'none', 'important');
    }
    if(frame){
      try{
        if(frame._blobUrl){ URL.revokeObjectURL(frame._blobUrl); frame._blobUrl = null; }
        frame.removeAttribute('src');
        frame.removeAttribute('srcdoc');
        frame.srcdoc = '';
      }catch(e){}
    }
  };

  /* Also keep old close for any external callers */
  var _oldClose = window.closeHtmlDividePreviewView;
  window.closeHtmlDividePreviewView = function(){
    try{ window.closeCdfInlinePreview(); }catch(e){}
    if(typeof _oldClose === 'function'){
      try{ _oldClose(); }catch(e){}
    }
  };

  window.codeDivideFullPreview = function(){
    try{
      var src = getSource();
      if(!src.trim()){
        var h = (el('cdfOutHtml')||{}).value || '';
        var c = (el('cdfOutCss')||{}).value || '';
        var j = (el('cdfOutJs')||{}).value || '';
        var single = (el('cdfOutSingle')||{}).value || '';
        if(h || c || j) src = buildDoc(h, c, j);
        else if(single) src = single;
      }
      if(!src || !String(src).trim()){
        toast('Pehle code paste karein');
        return;
      }
      openInlinePreview('Full Preview', src);
    }catch(err){
      console.error(err);
      toast('Preview fail');
    }
  };

  window.codeDivideFullCutPreview = function(){
    try{
      var html = '', css = '', js = '';
      var boxH = el('cdfOutHtml'), boxC = el('cdfOutCss'), boxJ = el('cdfOutJs'), boxS = el('cdfOutSingle');
      if(boxH) html = boxH.value || '';
      if(boxC) css = boxC.value || '';
      if(boxJ) js = boxJ.value || '';
      if(!html && !css && !js && boxS) html = boxS.value || '';

      var result = window.__cdfLastResult;
      if((!html && !css && !js) && result){
        if(result.type === 'triple'){
          html = result.html || '';
          css = result.css || '';
          js = result.js || '';
        } else if(result.value){
          html = result.value;
        }
      }
      if(!html && !css && !js){
        html = getSource();
      }
      if(!(html || css || js)){
        toast('Pehle Generate karein');
        return;
      }
      openInlinePreview('Cut Preview (HTML+CSS+JS)', buildDoc(html, css, js));
    }catch(err){
      console.error(err);
      toast('Cut Preview fail');
    }
  };

  /* When main Code Divide Back is pressed, also close inline preview first if open */
  var _closeCdf = window.closeCodeDivideFullView;
  window.closeCodeDivideFullView = function(){
    var panel = el('cdfInlinePreviewPanel');
    if(panel && panel.getAttribute('data-open') === '1'){
      window.closeCdfInlinePreview();
      return; /* pehle preview band, Code Divide open rahe */
    }
    if(typeof _closeCdf === 'function') _closeCdf();
  };
})();


/* ===== SCRIPT 32 id=israrlab-url-html-source-fix ===== */
(function(){
  function el(id){ return document.getElementById(id); }
  function toast(m){ try{ if(typeof showToast==='function') showToast(m); }catch(e){} }

  function looksLikeHtml(s){
    if(!s) return false;
    var t = String(s).slice(0, 12000).toLowerCase();
    if(t.indexOf('<html') >= 0) return true;
    if(t.indexOf('<!doctype') >= 0) return true;
    if(t.indexOf('<head') >= 0) return true;
    if(t.indexOf('<body') >= 0) return true;
    if(t.indexOf('<div') >= 0) return true;
    if(t.indexOf('<script') >= 0) return true;
    if(t.indexOf('<style') >= 0) return true;
    if(t.indexOf('<meta') >= 0) return true;
    if(t.indexOf('<link') >= 0) return true;
    if(t.indexOf('<title') >= 0) return true;
    /* any tag-like content */
    if((t.match(/<[a-z][\s\S]*?>/g) || []).length >= 3) return true;
    return false;
  }

  function looksLikeMarkdownOnly(s){
    if(!s) return true;
    var t = String(s).slice(0, 6000);
    /* real HTML wins */
    if(/<!doctype\s+html/i.test(t) || /<html[\s>]/i.test(t)) return false;
    if(/<head[\s>]/i.test(t) && /<body[\s>]/i.test(t)) return false;
    if((t.match(/<[a-z][\s\S]*?>/gi) || []).length >= 8) return false;
    /* jina / reader style — NOT full source */
    if(/Title:\s/i.test(t) && /URL Source:\s/i.test(t)) return true;
    if(/Markdown Content:/i.test(t)) return true;
    if(/Published Time:/i.test(t) && /URL Source:/i.test(t)) return true;
    if(/^#\s.+/m.test(t) && (t.match(/</g)||[]).length < 5) return true;
    return false;
  }

  function parseAllOrigins(t){
    try{
      var j = JSON.parse(t);
      return j.contents || j.content || t;
    }catch(e){ return t; }
  }

  /* Multiple free CORS proxies tried in parallel */
  function buildAttempts(target){
    var enc = encodeURIComponent(target);
    return [
      {
        name: 'cors.dev',
        url: 'https://proxy.cors.dev/' + target,
        parse: function(t){ return t; }
      },
      {
        name: 'allorigins-raw',
        url: 'https://api.allorigins.win/raw?url=' + enc,
        parse: function(t){ return t; }
      },
      {
        name: 'allorigins-json',
        url: 'https://api.allorigins.win/get?url=' + enc,
        parse: parseAllOrigins
      },
      {
        name: 'corsproxy-io',
        url: 'https://corsproxy.io/?' + enc,
        parse: function(t){ return t; }
      },
      {
        name: 'corsproxy-org',
        url: 'https://corsproxy.org/?' + enc,
        parse: function(t){ return t; }
      },
      {
        name: 'codetabs',
        url: 'https://api.codetabs.com/v1/proxy?quest=' + enc,
        parse: function(t){ return t; }
      },
      {
        name: 'isomorphic-git',
        url: 'https://cors.isomorphic-git.org/' + target,
        parse: function(t){ return t; }
      },
      {
        name: 'yacdn',
        url: 'https://yacdn.org/proxy/' + target,
        parse: function(t){ return t; }
      },
      {
        name: 'allorigins-nocache',
        url: 'https://api.allorigins.win/raw?url=' + enc + '&disableCache=true',
        parse: function(t){ return t; }
      },
      {
        name: 'cors-x2u',
        url: 'https://cors.x2u.in/' + target,
        parse: function(t){ return t; }
      }
    ];
  }

  window.fetchUrlCodeFull = function(){
    var input = el('urlCodeFullInput');
    var output = el('urlCodeFullOutput');
    var status = el('urlCodeFullStatus');
    var btn = el('urlCodeFullFetchBtn');
    if(!input || !output){ toast('URL UI missing'); return; }

    var url = (input.value || '').trim();
    if(!url){ toast('URL dalein'); return; }
    if(!/^https?:\/\//i.test(url)) url = 'https://' + url;

    if(status) status.textContent = 'Source fetch shuru… proxies try ho rahe hain';
    if(btn){ btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>'; }

    var attempts = buildAttempts(url);
    var pending = attempts.length;
    var bestHtml = null, bestHtmlVia = '', bestHtmlLen = 0;
    var done = false;

    function finishBtn(){
      if(btn){ btn.disabled = false; btn.innerHTML = '<i class="fas fa-download"></i> Fetch'; }
    }

    function applyResult(txt, via){
      if(done) return;
      done = true;
      try{
        if((output.value || '').trim()) window.__urlCodeUndo = output.value;
      }catch(e){}
      output.value = String(txt);
      try{ output.scrollTop = 0; }catch(e){}
      try{ if(typeof updateUrlCodeLines === 'function') updateUrlCodeLines(); }catch(e){}
      try{ if(typeof window.syncUrlExtraActions === 'function') window.syncUrlExtraActions(); }catch(e){}
      try{ if(typeof window.scheduleUrlCodeHighlight === 'function') window.scheduleUrlCodeHighlight(); }catch(e){}
      try{ if(typeof window.syncUrlCodeLines === 'function') window.syncUrlCodeLines(output); }catch(e){}
      /* double update after paint so line numbers fill completely */
      setTimeout(function(){
        try{ if(typeof updateUrlCodeLines === 'function') updateUrlCodeLines(); }catch(e){}
        try{ if(typeof window.syncUrlCodeLines === 'function') window.syncUrlCodeLines(output); }catch(e){}
      }, 80);
      if(status) status.textContent = 'OK — ' + String(txt).length + ' chars · ' + via;
      finishBtn();
      toast('Full HTML source mil gaya');
    }

    function finalize(){
      if(done) return;
      if(bestHtml && bestHtmlLen > 60){
        applyResult(bestHtml, bestHtmlVia);
        return;
      }
      if(status) status.textContent = 'Source nahi mila (CORS). Page open karke View Source → Copy → yahan Paste karein.';
      finishBtn();
      toast('HTML nahi mila — manual paste karein');
    }

    function oneDone(){
      pending--;
      if(pending <= 0) finalize();
    }

    attempts.forEach(function(a){
      var ctrl = (typeof AbortController !== 'undefined') ? new AbortController() : null;
      var timer = setTimeout(function(){
        try{ if(ctrl) ctrl.abort(); }catch(e){}
        oneDone();
      }, 18000);

      var opts = {
        method: 'GET',
        mode: 'cors',
        credentials: 'omit',
        cache: 'no-store',
        headers: { 'Accept': 'text/html,application/xhtml+xml,*/*' }
      };
      if(ctrl) opts.signal = ctrl.signal;

      fetch(a.url, opts)
        .then(function(r){
          if(!r.ok) throw new Error('status ' + r.status);
          return r.text();
        })
        .then(function(raw){
          clearTimeout(timer);
          var txt = a.parse(raw);
          if(!txt || String(txt).trim().length < 20){ oneDone(); return; }
          var s = String(txt);
          if(looksLikeMarkdownOnly(s)){ oneDone(); return; }
          /* very loose HTML check — any decent sized response with tags */
          if(!looksLikeHtml(s) && s.length < 400){ oneDone(); return; }
          var len = s.length;
          if(len > bestHtmlLen){
            bestHtml = s;
            bestHtmlLen = len;
            bestHtmlVia = a.name;
            /* accept as soon as we get something useful */
            if(len > 500 && !done){
              applyResult(s, a.name);
            }
          }
          oneDone();
        })
        .catch(function(){
          clearTimeout(timer);
          oneDone();
        });
    });
  };

  /* Also fix panel-level fetch if present */
  if(typeof window.fetchUrlCode === 'function' || true){
    window.fetchUrlCode = window.fetchUrlCodeFull;
  }
})();


/* ===== SCRIPT 33 id=israrlab-cdf-preview-generate-final-v5 ===== */
(function(){
  function el(id){ return document.getElementById(id); }
  function toast(m){ try{ if(typeof showToast==='function') showToast(m); }catch(e){} }
  function isLight(){ return !!(document.body && document.body.classList.contains('light-mode')); }

  function getSource(){
    var ta = el('codeDivideFullSource');
    if(ta && String(ta.value||'').trim()) return ta.value;
    try{ if(typeof window.getCdfSrc==='function'){ var s=window.getCdfSrc(); if(s&&String(s).trim()) return s; } }catch(e){}
    return '';
  }

  function buildCombined(html, css, js){
    html = html || ''; css = css || ''; js = js || '';
    var low = html.toLowerCase();
    var isFull = low.indexOf('<html') >= 0 || low.indexOf('<!doctype') >= 0;
    var doc;
    if(isFull){
      doc = html;
      if(css){
        if(/<\/head>/i.test(doc)) doc = doc.replace(/<\/head>/i, '<style id="israr-cut-css">\n' + css + '\n</style>\n</head>');
        else doc = '<style id="israr-cut-css">\n' + css + '\n</style>\n' + doc;
      }
      if(js){
        if(/<\/body>/i.test(doc)) doc = doc.replace(/<\/body>/i, '<script id="israr-cut-js">\n' + js + '\n<\/script>\n</body>');
        else doc = doc + '\n<script id="israr-cut-js">\n' + js + '\n<\/script>';
      }
    } else {
      doc = '<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
        + '<style id="israr-cut-css">\n' + css + '\n</style></head><body>\n'
        + html + '\n<script id="israr-cut-js">\n' + js + '\n<\/script>\n</body></html>';
    }
    return doc;
  }

  function writeFrame(frame, doc){
    if(!frame) return;
    doc = String(doc || '');
    try{
      if(frame._blobUrl){ try{ URL.revokeObjectURL(frame._blobUrl); }catch(e){} frame._blobUrl = null; }
      frame.removeAttribute('src');
      frame.removeAttribute('srcdoc');
      if(doc.length > 250000){
        frame._blobUrl = URL.createObjectURL(new Blob([doc], {type:'text/html;charset=utf-8'}));
        frame.src = frame._blobUrl;
      } else {
        frame.srcdoc = doc;
      }
    }catch(e){
      try{ frame.srcdoc = doc; }catch(e2){}
    }
  }

  function ensurePreviewOnBody(){
    var view = el('htmlDividePreviewView');
    if(!view){
      view = document.createElement('div');
      view.id = 'htmlDividePreviewView';
      view.setAttribute('data-open','0');
      view.innerHTML =
        '<div style="display:flex;align-items:center;gap:10px;padding:10px 12px;background:#0a111e;border-bottom:1px solid rgba(255,255,255,.12);flex-shrink:0;">'
        + '<button type="button" id="cdfPvBackBtn" style="height:38px;padding:0 16px;border-radius:10px;border:none;background:linear-gradient(135deg,#fbbf24,#f59e0b);color:#1a1200;font-weight:800;font-size:13px;cursor:pointer;">← Back</button>'
        + '<span id="htmlDividePreviewTitle" style="font-weight:800;font-size:14px;color:#fff;">Preview</span></div>'
        + '<iframe id="htmlDividePreviewFrame" title="Preview" sandbox="allow-scripts allow-forms allow-modals allow-popups allow-same-origin" style="flex:1;width:100%;border:0;background:#fff;min-height:0;display:block;"></iframe>';
      document.body.appendChild(view);
    } else if(view.parentNode !== document.body){
      document.body.appendChild(view);
    }
    /* rebind every open so no stale handler */
    var backs = view.querySelectorAll('#cdfPvBackBtn, .html-divide-preview-back, .pv-back, button');
    for(var i=0;i<backs.length;i++){
      (function(btn){
        btn.onclick = function(ev){
          if(ev){ try{ ev.preventDefault(); ev.stopImmediatePropagation(); }catch(e){} }
          instantClosePreview();
        };
      })(backs[i]);
    }
    return view;
  }

  function openFullPreview(title, doc){
    var view = ensurePreviewOnBody();
    var frame = el('htmlDividePreviewFrame');
    var titleEl = el('htmlDividePreviewTitle');
    if(titleEl) titleEl.textContent = title || 'Preview';

    var cdf = el('codeDivideFullView');
    if(cdf){
      cdf.setAttribute('data-cdf-was-open', cdf.getAttribute('data-open') === '1' ? '1' : '0');
      cdf.style.setProperty('display', 'none', 'important');
      cdf.style.setProperty('visibility', 'hidden', 'important');
      cdf.style.setProperty('pointer-events', 'none', 'important');
    }
    try{
      var panel = el('cdfInlinePreviewPanel');
      if(panel){ panel.style.setProperty('display','none','important'); panel.setAttribute('data-open','0'); }
    }catch(e){}

    view.setAttribute('data-open', '1');
    view.setAttribute('aria-hidden', 'false');
    view.style.cssText = 'display:flex !important;flex-direction:column !important;position:fixed !important;inset:0 !important;width:100vw !important;height:100dvh !important;z-index:2147483000 !important;background:#03050b !important;visibility:visible !important;opacity:1 !important;pointer-events:auto !important;';
    document.body.classList.add('subview-active');
    writeFrame(frame, doc);
  }

  /* INSTANT close — UI first, iframe cleanup later */
  function instantClosePreview(){
    var view = el('htmlDividePreviewView');
    var frame = el('htmlDividePreviewFrame');
    if(view){
      view.setAttribute('data-open', '0');
      view.setAttribute('aria-hidden', 'true');
      view.style.cssText = 'display:none !important;visibility:hidden !important;pointer-events:none !important;z-index:0 !important;';
    }
    var cdf = el('codeDivideFullView');
    if(cdf && cdf.getAttribute('data-cdf-was-open') === '1'){
      cdf.setAttribute('data-open', '1');
      cdf.style.setProperty('display', 'flex', 'important');
      cdf.style.setProperty('visibility', 'visible', 'important');
      cdf.style.setProperty('pointer-events', 'auto', 'important');
      cdf.style.setProperty('z-index', '1000070', 'important');
      document.body.classList.add('subview-active');
    } else {
      document.body.classList.remove('subview-active');
    }
    /* async cleanup — never blocks Back */
    setTimeout(function(){
      if(!frame) return;
      try{
        if(frame._blobUrl){ URL.revokeObjectURL(frame._blobUrl); frame._blobUrl = null; }
        frame.removeAttribute('src');
        frame.removeAttribute('srcdoc');
        try{ frame.srcdoc = ''; }catch(e){}
      }catch(e){}
    }, 0);
  }
  window.closeHtmlDividePreviewView = instantClosePreview;
  window.closeCdfInlinePreview = instantClosePreview;

  /* capture-phase global so NOTHING can delay Back */
  document.addEventListener('click', function(ev){
    var t = ev.target;
    if(!t) return;
    var btn = t.closest ? t.closest('#cdfPvBackBtn, .html-divide-preview-back, #htmlDividePreviewView .pv-back') : null;
    if(!btn) return;
    var view = el('htmlDividePreviewView');
    if(view && view.getAttribute('data-open') === '1'){
      ev.preventDefault();
      ev.stopPropagation();
      if(ev.stopImmediatePropagation) ev.stopImmediatePropagation();
      instantClosePreview();
    }
  }, true);

  window.codeDivideFullPreview = function(){
    try{
      var src = getSource();
      if(!String(src||'').trim()){
        var h = (el('cdfOutHtml')||{}).value || '';
        var c = (el('cdfOutCss')||{}).value || '';
        var j = (el('cdfOutJs')||{}).value || '';
        var single = (el('cdfOutSingle')||{}).value || '';
        if(h || c || j) src = buildCombined(h, c, j);
        else if(single) src = single;
      }
      if(!String(src||'').trim()){ toast('Pehle code paste karein'); return; }
      openFullPreview('Full Preview', src);
    }catch(err){ console.error(err); toast('Preview fail'); }
  };

  window.codeDivideFullCutPreview = function(){
    try{
      var html = '', css = '', js = '';
      var boxH = el('cdfOutHtml'), boxC = el('cdfOutCss'), boxJ = el('cdfOutJs'), boxS = el('cdfOutSingle');
      if(boxH) html = boxH.value || '';
      if(boxC) css = boxC.value || '';
      if(boxJ) js = boxJ.value || '';
      if(!html && !css && !js && boxS) html = boxS.value || '';
      var result = window.__cdfLastResult;
      if((!html && !css && !js) && result){
        if(result.type === 'triple'){ html = result.html || ''; css = result.css || ''; js = result.js || ''; }
        else if(result.value){ html = result.value; }
      }
      if(!html && !css && !js) html = getSource();
      if(!(html || css || js)){ toast('Pehle Generate karein'); return; }
      openFullPreview('Cut Preview (HTML+CSS+JS)', buildCombined(html, css, js));
    }catch(err){ console.error(err); toast('Cut Preview fail'); }
  };

  function escHtml(s){ return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
  function countLines(code){
    var n = String(code||'').split('\n').length || 1;
    if(n < 1) n = 1;
    if(n > 20000) n = 20000;
    return n;
  }
  function lineNumsText(code){
    var n = countLines(code);
    var out = '';
    for(var i=1;i<=n;i++) out += i + '\n';
    return out;
  }
  function highlightCode(code, lang){
    code = String(code||'');
    try{
      if(window.hljs && typeof window.hljs.highlight === 'function'){
        return window.hljs.highlight(code, { language: lang || 'xml', ignoreIllegals: true }).value;
      }
    }catch(e){}
    return escHtml(code);
  }
  function downloadText(filename, text){
    try{
      var blob = new Blob([text||''], {type:'text/plain;charset=utf-8'});
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = filename || 'code.txt';
      document.body.appendChild(a);
      a.click();
      setTimeout(function(){ try{ URL.revokeObjectURL(a.href); a.remove(); }catch(e){} }, 400);
      toast('Downloaded: ' + filename);
    }catch(e){ toast('Download fail'); }
  }
  function extFor(label, lang){
    if(lang === 'css' || /css/i.test(label)) return 'css';
    if(lang === 'javascript' || /js|script/i.test(label)) return 'js';
    return 'html';
  }

  function bindScrollPair(scrollEl, linesEl){
    if(!scrollEl || !linesEl || scrollEl.__cdfScrollBound) return;
    scrollEl.__cdfScrollBound = true;
    scrollEl.addEventListener('scroll', function(){
      linesEl.scrollTop = scrollEl.scrollTop;
    }, {passive:true});
  }

  function showCdfCodeInfo(label, code){
    code = String(code || '');
    var chars = code.length;
    var lines = code ? code.split('\n').length : 0;
    var words = code.trim() ? code.trim().split(/\s+/).filter(Boolean).length : 0;
    var kb = (chars / 1024).toFixed(2);
    var now = new Date();
    var dt = now.toLocaleString();
    var theme = document.body.classList.contains('light-mode') ? 'Light' : 'Dark';
    var modeEl = el('codeDivideModeSelect');
    var mode = '—';
    try{
      if(modeEl) mode = modeEl.options[modeEl.selectedIndex] ? modeEl.options[modeEl.selectedIndex].text : (modeEl.value || '—');
    }catch(e){}

    var existing = document.getElementById('cdfCodeInfoModal');
    if(existing) existing.remove();

    var modal = document.createElement('div');
    modal.id = 'cdfCodeInfoModal';
    modal.style.cssText = 'position:fixed;inset:0;z-index:2147483600;background:rgba(0,0,0,0.55);display:flex;align-items:center;justify-content:center;padding:16px;box-sizing:border-box;';
    modal.innerHTML =
      '<div style="width:min(360px,100%);background:var(--card-bg,#00383b);border:1px solid var(--border,rgba(56,130,246,0.45));border-radius:16px;padding:18px 16px;box-shadow:0 20px 50px rgba(0,0,0,.4);color:var(--text,#fff);font-family:Inter,system-ui,sans-serif;">'
      + '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">'
      +   '<div style="font-weight:800;font-size:15px;"><i class="fas fa-info-circle" style="color:var(--cyan,#3882F6);margin-right:6px;"></i> ' + (label || 'Code') + ' Info</div>'
      +   '<button type="button" id="cdfInfoCloseBtn" style="width:32px;height:32px;border:none;border-radius:50%;background:rgba(128,128,128,.15);color:var(--text,#fff);font-size:16px;cursor:pointer;line-height:1;">&times;</button>'
      + '</div>'
      + '<div style="display:grid;gap:10px;font-size:13px;">'
      +   '<div style="display:flex;justify-content:space-between;gap:10px;padding:8px 10px;background:rgba(128,128,128,.08);border-radius:10px;"><span style="color:var(--muted,#b8cbd0);">Date &amp; Time</span><strong style="text-align:right;">' + dt + '</strong></div>'
      +   '<div style="display:flex;justify-content:space-between;gap:10px;padding:8px 10px;background:rgba(128,128,128,.08);border-radius:10px;"><span style="color:var(--muted,#b8cbd0);">Theme</span><strong>' + theme + '</strong></div>'
      +   '<div style="display:flex;justify-content:space-between;gap:10px;padding:8px 10px;background:rgba(128,128,128,.08);border-radius:10px;"><span style="color:var(--muted,#b8cbd0);">Extract Mode</span><strong style="max-width:55%;text-align:right;word-break:break-word;">' + mode + '</strong></div>'
      +   '<div style="display:flex;justify-content:space-between;gap:10px;padding:8px 10px;background:rgba(128,128,128,.08);border-radius:10px;"><span style="color:var(--muted,#b8cbd0);">Characters</span><strong style="color:#f59e0b;">' + chars.toLocaleString() + '</strong></div>'
      +   '<div style="display:flex;justify-content:space-between;gap:10px;padding:8px 10px;background:rgba(128,128,128,.08);border-radius:10px;"><span style="color:var(--muted,#b8cbd0);">Words</span><strong style="color:#f59e0b;">' + words.toLocaleString() + '</strong></div>'
      +   '<div style="display:flex;justify-content:space-between;gap:10px;padding:8px 10px;background:rgba(128,128,128,.08);border-radius:10px;"><span style="color:var(--muted,#b8cbd0);">Lines</span><strong>' + lines.toLocaleString() + '</strong></div>'
      +   '<div style="display:flex;justify-content:space-between;gap:10px;padding:8px 10px;background:rgba(128,128,128,.08);border-radius:10px;"><span style="color:var(--muted,#b8cbd0);">Size</span><strong style="color:#22c55e;">' + kb + ' KB</strong></div>'
      + '</div>'
      + '</div>';
    document.body.appendChild(modal);
    function close(){ try{ modal.remove(); }catch(e){} }
    modal.addEventListener('click', function(e){ if(e.target === modal) close(); });
    var closeBtn = document.getElementById('cdfInfoCloseBtn');
    if(closeBtn) closeBtn.onclick = close;
  }

  function makeResultBox(host, label, id, val, lang, icon){
    var d = document.createElement('div');
    d.className = 'cdf-box cdf-box-colored' + (isLight() ? ' cdf-light' : '');
    d.innerHTML =
      '<div class="cdf-box-head"><span>' + (icon||'') + ' ' + label + '</span>'
      + '<div class="cdf-box-actions">'
      +   '<button type="button" class="cdf-info-btn" title="Code Info"><i class="fas fa-info-circle"></i></button>'
      +   '<button type="button" class="cdf-dl-btn"><i class="fas fa-download"></i> Download</button>'
      +   '<button type="button" class="cdf-copy-btn">Copy</button>'
      + '</div></div>'
      + '<div class="cdf-code-shell">'
      +   '<div class="cdf-code-lines" aria-hidden="true"></div>'
      +   '<pre class="cdf-code-pre"><code class="hljs language-' + lang + '"></code></pre>'
      +   '<textarea class="cdf-part" id="' + id + '" readonly></textarea>'
      + '</div>';
    host.appendChild(d);
    var ta = d.querySelector('textarea');
    var codeEl = d.querySelector('code');
    var linesEl = d.querySelector('.cdf-code-lines');
    var pre = d.querySelector('pre');
    ta.value = val || '';
    if(codeEl) codeEl.innerHTML = highlightCode(val, lang);
    if(linesEl) linesEl.textContent = lineNumsText(val);
    bindScrollPair(pre, linesEl);

    var infoBtn = d.querySelector('.cdf-info-btn');
    if(infoBtn){
      infoBtn.onclick = function(){ showCdfCodeInfo(label, ta.value || val || ''); };
    }
    var dlBtn = d.querySelector('.cdf-dl-btn');
    if(dlBtn){
      dlBtn.onclick = function(){
        var code = ta.value || '';
        if(!code.trim()){ toast('Download ke liye code nahi'); return; }
        try{
          var ext = (lang === 'css') ? 'css' : (lang === 'javascript' ? 'js' : 'html');
          var blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
          var a = document.createElement('a');
          a.href = URL.createObjectURL(blob);
          a.download = (label || 'code').replace(/\s+/g,'_') + '.' + ext;
          document.body.appendChild(a);
          a.click();
          a.remove();
          setTimeout(function(){ try{ URL.revokeObjectURL(a.href); }catch(e){} }, 800);
          toast('Downloaded');
        }catch(e){ toast('Download fail'); }
      };
    }
    var cpBtn = d.querySelector('.cdf-copy-btn');
    if(cpBtn){
      cpBtn.onclick = function(){
        var code = ta.value || '';
        if(!code.trim()){ toast('Copy ke liye code nahi'); return; }
        try{
          if(navigator.clipboard) navigator.clipboard.writeText(code).then(function(){ toast('Copied'); });
          else toast('Clipboard nahi mila');
        }catch(e){ toast('Copy fail'); }
      };
    }
  }

  window.renderCdfResults = function(result){
    var host = el('cdfResults');
    if(!host) return;
    host.innerHTML = '';
    host.classList.add('is-visible');
    if(result && result.type === 'triple'){
      makeResultBox(host, 'HTML', 'cdfOutHtml', result.html, 'xml', '<i class="fab fa-html5"></i>');
      makeResultBox(host, 'CSS', 'cdfOutCss', result.css, 'css', '<i class="fab fa-css3-alt"></i>');
      makeResultBox(host, 'JavaScript', 'cdfOutJs', result.js, 'javascript', '<i class="fab fa-js"></i>');
    } else if(result){
      var lang = 'xml';
      var lab = (result.label || 'Output');
      if(/css/i.test(lab)) lang = 'css';
      else if(/script|js/i.test(lab)) lang = 'javascript';
      makeResultBox(host, lab, 'cdfOutSingle', result.value, lang, '<i class="fas fa-file-code"></i>');
    }
  };

  var genBusy = false;
  window.codeDivideFullGenerate = function(){
    if(genBusy) return;
    var src = getSource();
    if(!String(src||'').trim()){ toast('Pehle code paste karein'); return; }
    var mode = (el('codeDivideModeSelect')||{}).value || 'html-css-js';
    var btn = el('cdfGenerateBtn');
    var oldHtml = btn ? btn.innerHTML : '';
    genBusy = true;
    if(btn){ btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generate'; }
    var start = Date.now();
    function done(msg){
      var wait = Math.max(0, 1200 - (Date.now() - start));
      setTimeout(function(){
        genBusy = false;
        if(btn){ btn.disabled = false; btn.innerHTML = oldHtml || '<i class="fas fa-bolt"></i> Generate'; }
        if(msg) toast(msg);
      }, wait);
    }
    setTimeout(function(){
      try{
        var result;
        if(typeof window.extractByMode === 'function') result = window.extractByMode(src, mode);
        else {
          var work = String(src||''), cssParts=[], jsParts=[];
          work = work.replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gi, function(m, inner){ cssParts.push(String(inner||'').trim()); return ''; });
          work = work.replace(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi, function(m, attrs, inner){
            if(/\bsrc\s*=/i.test(attrs||'')) return m;
            jsParts.push(String(inner||'').trim()); return '';
          });
          var htmlOut = work.trim();
          var cssOut = cssParts.filter(Boolean).join('\n\n').trim();
          var jsOut = jsParts.filter(Boolean).join('\n\n').trim();
          if(mode === 'html') result = { type:'single', label:'HTML', value: htmlOut || src };
          else if(mode === 'css') result = { type:'single', label:'CSS', value: cssOut || (!/<[a-z!\/]/i.test(src)?src.trim():'') };
          else if(mode === 'js') result = { type:'single', label:'JavaScript', value: jsOut || (!/<[a-z!\/]/i.test(src)?src.trim():'') };
          else result = { type:'triple', html: htmlOut||src, css: cssOut, js: jsOut };
        }
        window.__cdfLastResult = result;
        window.renderCdfResults(result);
        var act = el('cdfActions');
        if(act) act.classList.add('is-visible');
        done('Generate ho gaya');
      }catch(e){ console.warn(e); done('Generate fail'); }
    }, 20);
  };

  /* ===== Upper source: full line count + synced scroll ===== */
  window.updateCdfLines = function(){
    var ta = el('codeDivideFullSource'), nums = el('cdfLineNums');
    if(!ta || !nums) return;
    nums.textContent = lineNumsText(ta.value || '');
  };
  window.syncCdfLines = function(ta){
    if(!ta) ta = el('codeDivideFullSource');
    var nums = el('cdfLineNums');
    var pre = el('cdfSourceHighlight');
    if(nums && ta) nums.scrollTop = ta.scrollTop;
    if(pre && ta){ pre.scrollTop = ta.scrollTop; pre.scrollLeft = ta.scrollLeft; }
  };

  function ensureSourceHighlight(){
    /* Disabled — CodeMirror handles source editor now.
       Remove any leftover overlay that could hide CM text. */
    try{
      var pre = document.getElementById('cdfSourceHighlight');
      if(pre && pre.parentNode) pre.parentNode.removeChild(pre);
      var ta = el('codeDivideFullSource');
      if(ta){
        ta.classList.remove('cdf-source-ta-over');
        ta.style.color = '';
        ta.style.webkitTextFillColor = '';
        ta.style.background = '';
      }
      var stage = document.querySelector('#codeDivideFullView .cdf-stage');
      if(stage) stage.classList.remove('cdf-stage-hl');
    }catch(e){}
  }
  var srcHlTimer = null;
  function refreshSourceHighlight(){
    /* no-op: CodeMirror is the source editor now */
    ensureSourceHighlight(); // only cleans leftover overlays
  }
  function scheduleSourceHl(){ /* no-op */ }

  var _openLegacyHl = window.openCodeDivideFullView;
  window.openCodeDivideFullView = function(){
    if(typeof _openLegacyHl === 'function') _openLegacyHl();
    setTimeout(function(){ ensureSourceHighlight(); }, 30);
  };

  if(!document.getElementById('cdf-colored-boxes-css-v5')){
    var st = document.createElement('style');
    st.id = 'cdf-colored-boxes-css-v5';
    st.textContent = [
      '#codeDivideFullView .cdf-box-colored .cdf-box-actions{display:inline-flex;gap:6px;align-items:center;}',
      '#codeDivideFullView .cdf-box-colored .cdf-info-btn{height:28px;min-width:28px;padding:0 8px;border-radius:7px;border:1px solid rgba(56,130,246,.4);background:rgba(56,130,246,.14);color:var(--cyan);font-size:12px;font-weight:700;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;}',
      '#codeDivideFullView .cdf-box-colored .cdf-info-btn:hover{filter:brightness(1.12);}',
      '#codeDivideFullView .cdf-box-colored .cdf-dl-btn,#codeDivideFullView .cdf-box-colored .cdf-copy-btn{height:28px;padding:0 10px;border-radius:7px;border:1px solid rgba(56,130,246,.35);background:rgba(56,130,246,.12);color:var(--cyan);font-size:10px;font-weight:700;cursor:pointer;display:inline-flex;align-items:center;gap:4px;}',
      '#codeDivideFullView .cdf-box-colored .cdf-dl-btn{border-color:rgba(34,197,94,.4);background:rgba(34,197,94,.12);color:#22c55e;}',
      '#codeDivideFullView .cdf-box-colored .cdf-code-shell{display:flex;min-height:140px;max-height:260px;background:#0d1117;position:relative;overflow:hidden;}',
      '#codeDivideFullView .cdf-box-colored .cdf-code-lines{flex:0 0 42px;width:42px;padding:10px 6px;background:#010409;color:#656d76;font:12px/1.5 Consolas,Monaco,monospace;text-align:right;user-select:none;overflow:hidden;white-space:pre;border-right:1px solid #21262d;box-sizing:border-box;}',
      '#codeDivideFullView .cdf-box-colored .cdf-code-pre{flex:1;min-width:0;margin:0;padding:10px 12px;overflow-x:hidden!important;overflow-y:auto!important;font:12px/1.5 Consolas,Monaco,monospace;color:#e6edf3;background:#0d1117;box-sizing:border-box;}',
      '#codeDivideFullView .cdf-box-colored .cdf-code-pre code{font:inherit;line-height:inherit;background:transparent!important;padding:0;white-space:pre-wrap!important;word-break:break-word!important;overflow-wrap:break-word!important;}',
      '#codeDivideFullView .cdf-box-colored .cdf-part{position:absolute!important;left:-9999px!important;width:1px!important;height:1px!important;opacity:0!important;}',
      'body.light-mode #codeDivideFullView .cdf-box-colored .cdf-code-shell{background:#ffffff;}',
      'body.light-mode #codeDivideFullView .cdf-box-colored .cdf-code-lines{background:#f6f8fa;color:#656d76;border-right-color:#d0d7de;}',
      'body.light-mode #codeDivideFullView .cdf-box-colored .cdf-code-pre{background:#ffffff;color:#0f172a;}',
      /* Upper stage shared metrics */
      '#codeDivideFullView .cdf-line-nums{flex:0 0 42px!important;width:42px!important;padding:10px 6px!important;font:12px/1.5 Consolas,Monaco,monospace!important;overflow:hidden!important;box-sizing:border-box!important;}',
      '#codeDivideFullView #codeDivideFullSource{font:12px/1.5 Consolas,Monaco,monospace!important;padding:10px 12px!important;box-sizing:border-box!important;}',
      '#codeDivideFullView .cdf-stage.cdf-stage-hl{position:relative;}',
      '#codeDivideFullView .cdf-source-hl-pre{position:absolute;left:42px;right:0;top:0;bottom:0;margin:0;padding:10px 12px;overflow:hidden;pointer-events:none;z-index:1;background:#0d1117;font:12px/1.5 Consolas,Monaco,monospace;color:#e6edf3;white-space:pre;box-sizing:border-box;}',
      '#codeDivideFullView .cdf-source-hl-pre code{font:inherit;line-height:inherit;background:transparent!important;padding:0;white-space:pre;}',
      '#codeDivideFullView #codeDivideFullSource.cdf-source-ta-over{position:relative;z-index:2;background:transparent!important;color:transparent!important;-webkit-text-fill-color:transparent!important;caret-color:#58a6ff!important;}',
      'body.light-mode #codeDivideFullView .cdf-source-hl-pre{background:#ffffff;color:#0f172a;}',
      'body.light-mode #codeDivideFullView #codeDivideFullSource.cdf-source-ta-over{caret-color:#2563eb!important;}',
      '#htmlDividePreviewView[data-open="1"]{display:flex!important;z-index:2147483000!important;}'
    ].join('');
    document.head.appendChild(st);
  }

  setTimeout(function(){
    try{
      var cdf = el('codeDivideFullView');
      if(cdf && cdf.getAttribute('data-open')==='1'){
        ensureSourceHighlight();
        window.updateCdfLines();
        refreshSourceHighlight();
      }
    }catch(e){}
  }, 200);
})();


/* ===== SCRIPT 34 id=israrlab-multiple-html-host-v4 ===== */
(function(){
  function el(id){ return document.getElementById(id); }
  function toast(m){ try{ if(typeof showToast==='function') showToast(m); }catch(e){} }

  var mode = 'editor';
  var mhhCM = null; // CodeMirror instance

  function getCode(){
    if(mhhCM) try{ return mhhCM.getValue() || ''; }catch(e){}
    var ta = el('mhhCode');
    return ta ? (ta.value || '') : '';
  }

  function setCode(v){
    v = v || '';
    if(mhhCM){
      try{
        mhhCM.setValue(v);
        mhhCM.clearHistory();
        mhhCM.refresh();
        return;
      }catch(e){}
    }
    var ta = el('mhhCode');
    if(ta) ta.value = v;
  }

  function ensureCM(){
    if(mhhCM) return mhhCM;
    var ta = el('mhhCode');
    if(!ta || typeof CodeMirror === 'undefined') return null;
    try{
      mhhCM = CodeMirror.fromTextArea(ta, {
        mode: 'htmlmixed',
        theme: document.body.classList.contains('light-mode') ? 'default' : 'material-darker',
        lineNumbers: true,
        fixedGutter: true,          // Line numbers stay fixed on left
        lineWrapping: true,         // Word wrap ON — long lines wrap, no horizontal scroll
        matchBrackets: true,
        styleActiveLine: true,      // Active line highlight
        indentUnit: 2,
        tabSize: 2,
        autofocus: false,
        viewportMargin: 60,
        extraKeys: { 'Tab': function(cm){ cm.replaceSelection('  '); } }
      });
      mhhCM.setSize('100%', '100%');
      // theme switch when body class changes
      try{
        var obs = new MutationObserver(function(){
          if(!mhhCM) return;
          var light = document.body.classList.contains('light-mode');
          mhhCM.setOption('theme', light ? 'default' : 'material-darker');
        });
        obs.observe(document.body, { attributes:true, attributeFilter:['class'] });
      }catch(e){}
      return mhhCM;
    }catch(e){
      console.warn('mhh CM init fail', e);
      return null;
    }
  }

  function escHtml(s){
    return String(s||'')
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;');
  }

  function wrapAsHtmlDoc(code){
    var html = String(code||'');
    var low = html.toLowerCase();
    if(low.indexOf('<html') < 0 && low.indexOf('<!doctype') < 0){
      html = '<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
        + '<title>Preview</title><style>body{margin:0;background:#fff;color:#111;font-family:system-ui,sans-serif;}</style></head><body>'
        + html + '</body></html>';
    }
    return html;
  }

  function openCodeInNewTab(code, asSourceText){
    var html;
    if(asSourceText){
      html = '<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
        + '<title>Code Source (Text)</title>'
        + '<style>html,body{margin:0;padding:0;background:#0d1117;color:#e6edf3;}pre{margin:0;padding:16px 18px;font:13px/1.55 Consolas,Monaco,"Courier New",monospace;white-space:pre;overflow:auto;min-height:100vh;box-sizing:border-box;}</style>'
        + '</head><body><pre>' + escHtml(code) + '</pre></body></html>';
    } else {
      html = wrapAsHtmlDoc(code);
    }
    var w = window.open('about:blank', '_blank');
    if(!w){ toast('Popup blocked — browser allow karein'); return null; }
    try{ w.document.open(); w.document.write(html); w.document.close(); }
    catch(e){ try{ w.document.write(html); w.document.close(); }catch(e2){ toast('Open fail'); return null; } }
    return w;
  }

  function makeDataUrl(code, asSourceText){
    var html;
    if(asSourceText){
      html = '<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
        + '<title>Code Source (Text)</title>'
        + '<style>html,body{margin:0;padding:0;background:#0d1117;color:#e6edf3;}pre{margin:0;padding:16px 18px;font:13px/1.55 Consolas,Monaco,"Courier New",monospace;white-space:pre;overflow:auto;min-height:100vh;box-sizing:border-box;}</style>'
        + '</head><body><pre>' + escHtml(code) + '</pre></body></html>';
    } else {
      html = wrapAsHtmlDoc(code);
    }
    try{
      var b64 = btoa(unescape(encodeURIComponent(html)));
      var url = 'data:text/html;base64,' + b64;
      if(url.length > 1500000) return null;
      return url;
    }catch(e){
      try{
        var url2 = 'data:text/html;charset=utf-8,' + encodeURIComponent(html);
        if(url2.length > 1500000) return null;
        return url2;
      }catch(e2){ return null; }
    }
  }

  function setEditorMode(){
    mode = 'editor';
    var shell = el('mhhCodeShell');
    var frame = el('mhhInlineFrame');
    var btn = el('mhhBoxPreviewBtn');
    if(shell) shell.style.display = 'flex';
    if(frame){
      frame.style.display = 'none';
      try{ frame.removeAttribute('srcdoc'); frame.removeAttribute('src'); }catch(e){}
    }
    if(btn){
      btn.innerHTML = '<i class="fas fa-eye"></i> <span>Preview</span>';
      btn.classList.remove('is-editor');
    }
    if(mhhCM) setTimeout(function(){ try{ mhhCM.refresh(); }catch(e){} }, 30);
  }

  function setInlinePreviewMode(){
    var code = getCode();
    if(!code.trim()){ toast('Pehle code/file dalein'); return; }
    mode = 'preview';
    var shell = el('mhhCodeShell');
    var frame = el('mhhInlineFrame');
    var btn = el('mhhBoxPreviewBtn');
    if(shell) shell.style.display = 'none';
    if(frame){
      frame.style.display = 'block';
      try{ frame.srcdoc = wrapAsHtmlDoc(code); }catch(e){}
    }
    if(btn){
      btn.innerHTML = '<i class="fas fa-code"></i> <span>Editor</span>';
      btn.classList.add('is-editor');
    }
  }

  function openFullPreview(){
    var code = getCode();
    if(!code.trim()){ toast('Pehle code/file dalein'); return; }
    var view = el('htmlDividePreviewView');
    var frame = el('htmlDividePreviewFrame');
    if(view && frame){
      if(view.parentNode !== document.body) document.body.appendChild(view);
      var titleEl = el('htmlDividePreviewTitle');
      if(titleEl) titleEl.textContent = 'Multiple HTML Preview';
      view.setAttribute('data-open','1');
      view.style.cssText = 'display:flex !important;flex-direction:column !important;position:fixed !important;inset:0 !important;z-index:2147483000 !important;background:#03050b !important;visibility:visible !important;opacity:1 !important;pointer-events:auto !important;';
      var host = el('multipleHtmlHostView');
      if(host){
        host.setAttribute('data-mhh-was','1');
        host.style.setProperty('display','none','important');
      }
      try{ frame.srcdoc = wrapAsHtmlDoc(code); }catch(e){}
      var prevClose = window.closeHtmlDividePreviewView;
      window.closeHtmlDividePreviewView = function(){
        if(typeof prevClose === 'function') try{ prevClose(); }catch(e){}
        var h = el('multipleHtmlHostView');
        if(h && h.getAttribute('data-mhh-was')==='1'){
          h.setAttribute('data-open','1');
          h.style.setProperty('display','flex','important');
          h.style.setProperty('visibility','visible','important');
          h.style.setProperty('pointer-events','auto','important');
          h.removeAttribute('data-mhh-was');
          document.body.classList.add('subview-active');
          setTimeout(function(){ if(mhhCM) try{ mhhCM.refresh(); }catch(e){} }, 50);
        }
      };
      return;
    }
    openCodeInNewTab(code, false);
  }

  function copyCode(){
    var code = getCode();
    if(!code.trim()){ toast('Copy ke liye code nahi'); return; }
    try{
      if(navigator.clipboard) navigator.clipboard.writeText(code).then(function(){ toast('Code copied'); });
      else toast('Clipboard nahi mila');
    }catch(e){ toast('Copy fail'); }
  }

  function saveToHistory(){
    var code = getCode();
    if(!code.trim()){ toast('Save ke liye code nahi'); return; }
    try{
      if(typeof notes === 'undefined'){ toast('Notes system nahi mila'); return; }
      var now = Date.now();
      var name = (el('mhhFileName') && el('mhhFileName').textContent) || '';
      if(name === 'Koi file select nahi') name = '';
      var note = {
        id: 'mhh_' + now,
        title: (name ? name + ' · ' : '') + 'Multiple HTML ' + new Date().toLocaleString(),
        htmlCode: code,
        category: 'Multiple HTML',
        createdAt: now,
        updatedAt: now,
        updateCount: 1,
        isPinned: false
      };
      notes.unshift(note);
      try{ if(typeof saveData==='function') saveData(); else localStorage.setItem('notes', JSON.stringify(notes)); }catch(e){}
      try{ if(typeof renderNotes==='function') renderNotes(); }catch(e){}
      try{ if(typeof renderCategories==='function') renderCategories(); }catch(e){}
      toast('History me save ho gaya');
    }catch(e){ console.warn(e); toast('Save fail'); }
  }

  function copyPreviewUrl(){
    var code = getCode();
    if(!code.trim()){ toast('Pehle code dalein'); return; }
    var url = makeDataUrl(code, true);
    if(!url){
      openCodeInNewTab(code, true);
      toast('Code bada hai — naya tab open kiya (text source)');
      return;
    }
    try{
      if(navigator.clipboard && navigator.clipboard.writeText){
        navigator.clipboard.writeText(url).then(function(){
          toast('Text Source URL copied — browser me paste karke text dekh sakte ho');
        }).catch(function(){ fallbackCopy(url); });
      } else fallbackCopy(url);
    }catch(e){ fallbackCopy(url); }
  }

  function fallbackCopy(text){
    try{
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0;';
      document.body.appendChild(ta);
      ta.focus(); ta.select();
      document.execCommand('copy');
      ta.remove();
      toast('Text Source URL copied');
    }catch(e){ toast('Copy fail — Open URL use karein'); }
  }

  function openPreviewUrl(){
    var code = getCode();
    if(!code.trim()){ toast('Pehle code dalein'); return; }
    openCodeInNewTab(code, true);
  }

  function resetAll(){
    setCode('');
    var name = el('mhhFileName');
    if(name) name.textContent = 'Koi file select nahi';
    var input = el('mhhFileInput');
    if(input) input.value = '';
    setEditorMode();
    hideFileSpinner();
    toast('Reset');
  }

  function showFileSpinner(){
    var btn = el('mhhFileBtn');
    if(!btn) return;
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> File load ho rahi hai...';
    btn.classList.add('is-loading');
  }
  function hideFileSpinner(){
    var btn = el('mhhFileBtn');
    if(!btn) return;
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-folder-open"></i> HTML / Text file select karein';
    btn.classList.remove('is-loading');
  }

  function onFileSelected(file){
    if(!file) return;
    var nameEl = el('mhhFileName');
    if(nameEl) nameEl.textContent = file.name || 'Selected file';
    showFileSpinner();
    setEditorMode();
    var reader = new FileReader();
    reader.onload = function(){
      var text = String(reader.result || '');
      var start = Date.now();
      function finish(){
        ensureCM();
        setCode(text);
        hideFileSpinner();
        toast('File load ho gayi · ' + (file.name||''));
        setTimeout(function(){
          if(mhhCM){
            try{
              mhhCM.setOption('lineWrapping', true);
              mhhCM.setOption('fixedGutter', true);
              mhhCM.refresh();
            }catch(e){}
          }
        }, 60);
      }
      var wait = Math.max(0, 800 - (Date.now() - start));
      if(text.length > 200000) wait = Math.max(wait, 400);
      setTimeout(finish, wait);
    };
    reader.onerror = function(){ hideFileSpinner(); toast('File read fail'); };
    reader.readAsText(file);
  }

  window.openMultipleHtmlHost = function(){
    var host = el('multipleHtmlHostView');
    if(!host){ toast('Multiple HTML view missing'); return; }
    if(host.parentNode !== document.body) document.body.appendChild(host);
    host.setAttribute('data-open','1');
    host.setAttribute('aria-hidden','false');
    host.style.cssText = 'display:flex !important;flex-direction:column !important;position:fixed !important;inset:0 !important;width:100vw !important;height:100dvh !important;z-index:1000085 !important;background:var(--bg,#03050b) !important;visibility:visible !important;opacity:1 !important;pointer-events:auto !important;';
    document.body.classList.add('subview-active');
    setEditorMode();
    setTimeout(function(){
      ensureCM();
      if(mhhCM){
        try{
          mhhCM.setOption('lineWrapping', true);
          mhhCM.setOption('fixedGutter', true);
          mhhCM.refresh();
        }catch(e){}
      }
      bind();
    }, 50);
  };
  window.closeMultipleHtmlHost = function(){
    var host = el('multipleHtmlHostView');
    if(host){
      host.setAttribute('data-open','0');
      host.setAttribute('aria-hidden','true');
      host.style.cssText = 'display:none !important;';
    }
    document.body.classList.remove('subview-active');
  };

  window.openFullHtmlDividePreview = function(){ window.openMultipleHtmlHost(); };
  var _sw = window.switchDivideMode;
  window.switchDivideMode = function(modeName){
    if(typeof _sw === 'function') _sw(modeName);
    if(modeName === 'multiple') window.openMultipleHtmlHost();
  };

  function bind(){
    var back = el('mhhBackBtn');
    if(back) back.onclick = function(){ window.closeMultipleHtmlHost(); };
    var topPv = el('mhhTopPreviewBtn');
    if(topPv) topPv.onclick = function(){ openFullPreview(); };
    var topCp = el('mhhTopCopyBtn');
    if(topCp) topCp.onclick = function(){ copyCode(); };
    var topSv = el('mhhTopSaveBtn');
    if(topSv) topSv.onclick = function(){ saveToHistory(); };

    var fileBtn = el('mhhFileBtn');
    var fileInput = el('mhhFileInput');
    if(fileBtn && fileInput){
      fileBtn.onclick = function(){ if(!fileBtn.disabled) fileInput.click(); };
      fileInput.onchange = function(){
        var f = fileInput.files && fileInput.files[0];
        if(f) onFileSelected(f);
      };
    }

    var boxPv = el('mhhBoxPreviewBtn');
    if(boxPv) boxPv.onclick = function(){
      if(mode === 'preview') setEditorMode();
      else setInlinePreviewMode();
    };
    var urlCp = el('mhhUrlCopyBtn');
    if(urlCp) urlCp.onclick = function(){ copyPreviewUrl(); };
    var openUrl = el('mhhOpenUrlBtn');
    if(openUrl) openUrl.onclick = function(){ openPreviewUrl(); };
    var rst = el('mhhResetBtn');
    if(rst) rst.onclick = function(){ resetAll(); };

    ensureCM();
  }

  // Clean CSS for CodeMirror inside mhh
  if(!document.getElementById('mhh-host-css-v4')){
    var st = document.createElement('style');
    st.id = 'mhh-host-css-v4';
    st.textContent = [
      '#multipleHtmlHostView{display:none;flex-direction:column;position:fixed;inset:0;width:100vw;height:100dvh;background:var(--bg);z-index:1000085;}',
      '#multipleHtmlHostView[data-open="1"]{display:flex!important;}',
      '#multipleHtmlHostView .mhh-header{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:6px;padding:8px 10px;background:var(--header-bg);border-bottom:1px solid var(--border);flex-shrink:0;}',
      '#multipleHtmlHostView .mhh-btn{height:38px;border:none;border-radius:10px;font-weight:800;font-size:11px;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:5px;color:#fff;}',
      '#multipleHtmlHostView .mhh-back{background:linear-gradient(135deg,#fbbf24,#f59e0b);color:#1a1200;}',
      '#multipleHtmlHostView .mhh-preview{background:linear-gradient(135deg,#60a5fa,#3b82f6);}',
      '#multipleHtmlHostView .mhh-copy{background:linear-gradient(135deg,#a78bfa,#7c3aed);}',
      '#multipleHtmlHostView .mhh-save{background:linear-gradient(135deg,#34d399,#10b981);color:#042f1a;}',
      '#multipleHtmlHostView .mhh-body{flex:1;min-height:0;overflow:auto;padding:10px;display:flex;flex-direction:column;gap:10px;}',
      '#multipleHtmlHostView .mhh-file-row{display:flex;flex-direction:column;gap:6px;}',
      '#multipleHtmlHostView .mhh-file-btn{height:48px;border-radius:12px;border:1.5px dashed var(--border);background:var(--card-bg);color:var(--text);font-weight:800;font-size:13px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;}',
      '#multipleHtmlHostView .mhh-file-btn.is-loading{opacity:.9;pointer-events:none;}',
      '#multipleHtmlHostView .mhh-file-name{font-size:11px;color:var(--muted);padding:0 4px;word-break:break-all;}',
      '#multipleHtmlHostView .mhh-toolbar{display:grid;grid-template-columns:1fr 1fr 1fr 1fr;gap:6px;}',
      '#multipleHtmlHostView .mhh-tb{height:36px;border:none;border-radius:10px;font-weight:800;font-size:10px;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:4px;color:#fff;}',
      '#multipleHtmlHostView .mhh-tb-preview{background:linear-gradient(135deg,#60a5fa,#2563eb);}',
      '#multipleHtmlHostView .mhh-tb-preview.is-editor{background:linear-gradient(135deg,#fbbf24,#f59e0b);color:#1a1200;}',
      '#multipleHtmlHostView .mhh-tb-urlcopy{background:linear-gradient(135deg,#22d3ee,#0891b2);color:#042f2e;}',
      '#multipleHtmlHostView .mhh-tb-openurl{background:linear-gradient(135deg,#a78bfa,#7c3aed);}',
      '#multipleHtmlHostView .mhh-tb-reset{background:linear-gradient(135deg,#94a3b8,#64748b);}',
      /* Stage + CodeMirror — Word Wrap ON, no horizontal scroll, fixed line numbers */
      '#multipleHtmlHostView .mhh-stage{position:relative;height:550px;min-height:550px;border:1px solid var(--border);border-radius:14px;overflow:hidden;background:#0d1117;}',
      '#multipleHtmlHostView .mhh-code-shell{display:block;height:100%;width:100%;position:relative;background:#0d1117;overflow:hidden;}',
      '#multipleHtmlHostView .mhh-code-shell .CodeMirror{position:absolute!important;inset:0!important;height:100%!important;width:100%!important;font-size:13px!important;line-height:1.5!important;font-family:Consolas,Monaco,"Courier New",monospace!important;background:#0d1117!important;color:#e6edf3!important;border:none!important;}',
      /* Only vertical scroll, no horizontal */
      '#multipleHtmlHostView .mhh-code-shell .CodeMirror-scroll{min-height:100%!important;max-width:100%!important;overflow-x:hidden!important;overflow-y:auto!important;}',
      '#multipleHtmlHostView .mhh-code-shell .CodeMirror-sizer,#multipleHtmlHostView .mhh-code-shell .CodeMirror-lines{max-width:100%!important;}',
      '#multipleHtmlHostView .mhh-code-shell .CodeMirror pre.CodeMirror-line,#multipleHtmlHostView .mhh-code-shell .CodeMirror pre.CodeMirror-line-like{word-wrap:break-word!important;white-space:pre-wrap!important;word-break:break-word!important;}',
      /* Fixed gutter: numbers stay left, aligned with wrapped lines */
      '#multipleHtmlHostView .mhh-code-shell .CodeMirror-gutters{background:#161b22!important;border-right:1px solid rgba(255,255,255,.08)!important;}',
      '#multipleHtmlHostView .mhh-code-shell .CodeMirror-linenumber{color:#8b949e!important;min-width:36px!important;padding:0 8px 0 0!important;text-align:right!important;font-family:Consolas,Monaco,"Courier New",monospace!important;font-size:13px!important;line-height:1.5!important;}',
      '#multipleHtmlHostView .mhh-code-shell .CodeMirror-activeline-background{background:rgba(56,130,246,0.12)!important;}',
      '#multipleHtmlHostView .mhh-code-shell .CodeMirror-cursor{border-left:2px solid #58a6ff!important;}',
      '#multipleHtmlHostView .mhh-inline-frame{width:100%;height:100%;border:0;background:#fff;display:none;}',
      /* Light mode */
      'body.light-mode #multipleHtmlHostView .mhh-stage{background:#ffffff;}',
      'body.light-mode #multipleHtmlHostView .mhh-code-shell{background:#ffffff;}',
      'body.light-mode #multipleHtmlHostView .mhh-code-shell .CodeMirror{background:#ffffff!important;color:#24292f!important;}',
      'body.light-mode #multipleHtmlHostView .mhh-code-shell .CodeMirror-gutters{background:#f6f8fa!important;border-right:1px solid #d0d7de!important;}',
      'body.light-mode #multipleHtmlHostView .mhh-code-shell .CodeMirror-linenumber{color:#6e7781!important;}',
      'body.light-mode #multipleHtmlHostView .mhh-code-shell .CodeMirror-activeline-background{background:rgba(56,130,246,0.08)!important;}',
      'body.light-mode #multipleHtmlHostView .mhh-code-shell .CodeMirror-cursor{border-left-color:#0969da!important;}'
    ].join('');
    document.head.appendChild(st);
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bind);
  else bind();
  setTimeout(bind, 80);
})();


/* ===== SCRIPT 35 id=israrlab-cdf-source-codemirror-v1 ===== */
(function(){
  function el(id){ return document.getElementById(id); }
  function toast(m){ try{ if(typeof showToast==='function') showToast(m); }catch(e){} }

  var cdfCM = null;

  function ensureCdfCM(){
    if(cdfCM) return cdfCM;
    var ta = el('codeDivideFullSource');
    if(!ta || typeof CodeMirror === 'undefined') return null;
    // already converted?
    if(ta.nextSibling && ta.nextSibling.CodeMirror){
      cdfCM = ta.nextSibling.CodeMirror;
      return cdfCM;
    }
    try{
      cdfCM = CodeMirror.fromTextArea(ta, {
        mode: 'htmlmixed',
        theme: document.body.classList.contains('light-mode') ? 'default' : 'material-darker',
        lineNumbers: true,
        fixedGutter: true,
        lineWrapping: true,   // word wrap, no horizontal scroll
        matchBrackets: true,
        styleActiveLine: true,
        indentUnit: 2,
        tabSize: 2,
        autofocus: false,
        viewportMargin: 40,
        extraKeys: { 'Tab': function(cm){ cm.replaceSelection('  '); } }
      });
      cdfCM.setSize('100%', '100%');
      try{
        var obs = new MutationObserver(function(){
          if(!cdfCM) return;
          var light = document.body.classList.contains('light-mode');
          cdfCM.setOption('theme', light ? 'default' : 'material-darker');
        });
        obs.observe(document.body, { attributes:true, attributeFilter:['class'] });
      }catch(e){}
      return cdfCM;
    }catch(e){
      console.warn('cdf CM init fail', e);
      return null;
    }
  }

  function getCdfCode(){
    if(cdfCM) try{ return cdfCM.getValue() || ''; }catch(e){}
    var ta = el('codeDivideFullSource');
    return ta ? (ta.value || '') : '';
  }

  function setCdfCode(v){
    v = v || '';
    if(cdfCM){
      try{ cdfCM.setValue(v); cdfCM.clearHistory(); cdfCM.refresh(); return; }catch(e){}
    }
    var ta = el('codeDivideFullSource');
    if(ta) ta.value = v;
  }

  // Patch all known getters used by generate / preview / save
  window.getCdfSrc = getCdfCode;
  var _getSource = window.getSource;
  window.getSource = function(){
    var v = getCdfCode();
    if(v) return v;
    if(typeof _getSource === 'function') try{ return _getSource() || ''; }catch(e){}
    return '';
  };

  // Patch open so CM inits fast and pastes are fast
  var _open = window.openCodeDivideFullView;
  window.openCodeDivideFullView = function(){
    if(typeof _open === 'function') try{ _open(); }catch(e){}
    var view = el('codeDivideFullView');
    if(view){
      view.setAttribute('data-open','1');
      view.style.display = 'flex';
      document.body.classList.add('subview-active');
    }
    setTimeout(function(){
      // kill old overlay that made text transparent
      try{
        var pre = document.getElementById('cdfSourceHighlight');
        if(pre && pre.parentNode) pre.parentNode.removeChild(pre);
        var ta0 = el('codeDivideFullSource');
        if(ta0){
          ta0.classList.remove('cdf-source-ta-over');
          ta0.style.cssText = (ta0.style.cssText||'').replace(/color\s*:[^;]+;?/gi,'').replace(/-webkit-text-fill-color\s*:[^;]+;?/gi,'');
        }
        var stage0 = document.querySelector('#codeDivideFullView .cdf-stage');
        if(stage0) stage0.classList.remove('cdf-stage-hl');
      }catch(e){}
      ensureCdfCM();
      try{
        if(!getCdfCode().trim()){
          var nested = '';
          if(typeof window.getDivideEditorCode === 'function') nested = window.getDivideEditorCode() || '';
          if(!nested){ var t = el('htmlDivideSource'); if(t) nested = t.value || ''; }
          if(nested) setCdfCode(nested);
        }
      }catch(e){}
      if(cdfCM){
        try{
          var light = document.body.classList.contains('light-mode');
          cdfCM.setOption('theme', light ? 'default' : 'material-darker');
          cdfCM.setOption('lineWrapping', true);
          cdfCM.setOption('fixedGutter', true);
          cdfCM.refresh();
        }catch(e){}
      }
    }, 40);
  };

  // Keep generate using CM value
  var _gen = window.codeDivideFullGenerate;
  window.codeDivideFullGenerate = function(){
    // ensure CM value is synced to textarea for any legacy readers
    if(cdfCM){
      try{ cdfCM.save(); }catch(e){}
    }
    if(typeof _gen === 'function') return _gen.apply(this, arguments);
  };

  // CSS for CM inside cdf-stage
  if(!document.getElementById('cdf-source-cm-css-v2')){
    var st = document.createElement('style');
    st.id = 'cdf-source-cm-css-v2';
    st.textContent = [
      '#codeDivideFullView .cdf-stage{position:relative;height:280px;min-height:220px;border:1px solid var(--border);border-radius:12px;overflow:hidden;background:#0d1117;}',
      '#codeDivideFullView .cdf-stage .CodeMirror{position:absolute!important;inset:0!important;height:100%!important;width:100%!important;font-size:13px!important;line-height:1.5!important;font-family:Consolas,Monaco,"Courier New",monospace!important;background:#0d1117!important;color:#e6edf3!important;border:none!important;z-index:5!important;}',
      /* Do NOT force color on all spans — that kills syntax highlighting (cm-tag, cm-keyword, etc.) */
      '#codeDivideFullView .cdf-stage .CodeMirror-code,#codeDivideFullView .cdf-stage .CodeMirror-line{opacity:1!important;visibility:visible!important;}',
      '#codeDivideFullView .cdf-source-hl-pre{display:none!important;}',
      '#codeDivideFullView #codeDivideFullSource.cdf-source-ta-over{color:inherit!important;-webkit-text-fill-color:inherit!important;background:transparent!important;}',
      '#codeDivideFullView .cdf-stage .CodeMirror-scroll{min-height:100%!important;max-width:100%!important;overflow-x:hidden!important;overflow-y:auto!important;}',
      '#codeDivideFullView .cdf-stage .CodeMirror pre.CodeMirror-line,#codeDivideFullView .cdf-stage .CodeMirror pre.CodeMirror-line-like{word-wrap:break-word!important;white-space:pre-wrap!important;word-break:break-word!important;}',
      '#codeDivideFullView .cdf-stage .CodeMirror-gutters{background:#161b22!important;border-right:1px solid rgba(255,255,255,.08)!important;}',
      '#codeDivideFullView .cdf-stage .CodeMirror-linenumber{color:#8b949e!important;min-width:36px!important;padding:0 8px 0 0!important;text-align:right!important;}',
      '#codeDivideFullView .cdf-stage .CodeMirror-activeline-background{background:rgba(56,130,246,0.12)!important;}',
      '#codeDivideFullView .cdf-stage .CodeMirror-cursor{border-left:2px solid #58a6ff!important;}',
      'body.light-mode #codeDivideFullView .cdf-stage{background:#ffffff;}',
      'body.light-mode #codeDivideFullView .cdf-stage .CodeMirror{background:#ffffff!important;color:#24292f!important;}',
      'body.light-mode #codeDivideFullView .cdf-stage .CodeMirror-gutters{background:#f6f8fa!important;border-right:1px solid #d0d7de!important;}',
      'body.light-mode #codeDivideFullView .cdf-stage .CodeMirror-linenumber{color:#6e7781!important;}',
      'body.light-mode #codeDivideFullView .cdf-stage .CodeMirror-activeline-background{background:rgba(56,130,246,0.08)!important;}',
      /* base line color only — token spans keep their cm-* colors */
      'body.light-mode #codeDivideFullView .cdf-stage .CodeMirror-code,body.light-mode #codeDivideFullView .cdf-stage .CodeMirror-line{color:#24292f!important;opacity:1!important;}',
      '#codeDivideFullView .cdf-stage .CodeMirror-code,#codeDivideFullView .cdf-stage .CodeMirror-line{color:#e6edf3!important;}',
      /* strong syntax colors scoped to Code Divide so they always win over any base color */
      '#codeDivideFullView .CodeMirror .cm-tag{color:#7ee787!important;}',
      '#codeDivideFullView .CodeMirror .cm-attribute{color:#d2a8ff!important;}',
      '#codeDivideFullView .CodeMirror .cm-string{color:#a5d6ff!important;}',
      '#codeDivideFullView .CodeMirror .cm-comment{color:#8b949e!important;font-style:italic!important;}',
      '#codeDivideFullView .CodeMirror .cm-keyword{color:#ff7b72!important;}',
      '#codeDivideFullView .CodeMirror .cm-number{color:#79c0ff!important;}',
      '#codeDivideFullView .CodeMirror .cm-def{color:#d2a8ff!important;}',
      '#codeDivideFullView .CodeMirror .cm-property{color:#79c0ff!important;}',
      '#codeDivideFullView .CodeMirror .cm-variable{color:#e6edf3!important;}',
      '#codeDivideFullView .CodeMirror .cm-variable-2{color:#79c0ff!important;}',
      '#codeDivideFullView .CodeMirror .cm-meta{color:#d2a8ff!important;}',
      '#codeDivideFullView .CodeMirror .cm-atom{color:#79c0ff!important;}',
      '#codeDivideFullView .CodeMirror .cm-operator{color:#ff7b72!important;}',
      '#codeDivideFullView .CodeMirror .cm-qualifier{color:#7ee787!important;}',
      '#codeDivideFullView .CodeMirror .cm-builtin{color:#ffa657!important;}',
      'body.light-mode #codeDivideFullView .CodeMirror .cm-tag{color:#0550ae!important;}',
      'body.light-mode #codeDivideFullView .CodeMirror .cm-attribute{color:#953800!important;}',
      'body.light-mode #codeDivideFullView .CodeMirror .cm-string{color:#0a3069!important;}',
      'body.light-mode #codeDivideFullView .CodeMirror .cm-comment{color:#6e7781!important;font-style:italic!important;}',
      'body.light-mode #codeDivideFullView .CodeMirror .cm-keyword{color:#cf222e!important;}',
      'body.light-mode #codeDivideFullView .CodeMirror .cm-number{color:#0550ae!important;}',
      'body.light-mode #codeDivideFullView .CodeMirror .cm-def{color:#8250df!important;}',
      'body.light-mode #codeDivideFullView .CodeMirror .cm-property{color:#0550ae!important;}',
      'body.light-mode #codeDivideFullView .CodeMirror .cm-variable{color:#24292f!important;}',
      'body.light-mode #codeDivideFullView .CodeMirror .cm-variable-2{color:#0550ae!important;}',
      'body.light-mode #codeDivideFullView .CodeMirror .cm-meta{color:#8250df!important;}',
      'body.light-mode #codeDivideFullView .CodeMirror .cm-atom{color:#0550ae!important;}',
      'body.light-mode #codeDivideFullView .CodeMirror .cm-operator{color:#cf222e!important;}',
      'body.light-mode #codeDivideFullView .CodeMirror .cm-qualifier{color:#116329!important;}',
      'body.light-mode #codeDivideFullView .CodeMirror .cm-builtin{color:#953800!important;}',
      /* hide leftover manual line nums if any */
      '#codeDivideFullView .cdf-line-nums{display:none!important;}'
    ].join('');
    document.head.appendChild(st);
  }

  // init if view already open
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', function(){ setTimeout(ensureCdfCM, 100); });
  } else {
    setTimeout(ensureCdfCM, 100);
  }
})();


/* ===== SCRIPT 36 id=israrlab-url-code-codemirror-v1 ===== */
(function(){
  function el(id){ return document.getElementById(id); }
  function toast(m){ try{ if(typeof showToast==='function') showToast(m); }catch(e){} }

  var urlCM = null;

  function ensureUrlCM(){
    if(urlCM) return urlCM;
    var ta = el('urlCodeFullOutput');
    if(!ta || typeof CodeMirror === 'undefined') return null;
    if(ta.nextSibling && ta.nextSibling.CodeMirror){
      urlCM = ta.nextSibling.CodeMirror;
      return urlCM;
    }
    try{
      /* hide legacy line nums + hljs overlay — CM handles both */
      var nums = el('urlCodeLineNums');
      if(nums) nums.style.display = 'none';
      var layer = document.querySelector('#urlCodeFullView .url-code-highlight-layer');
      if(layer) layer.style.display = 'none';
      var wrap = el('urlCodeEditorWrap');
      if(wrap){
        wrap.style.display = 'block';
        wrap.style.position = 'relative';
        wrap.style.height = '100%';
        wrap.style.width = '100%';
        wrap.style.overflow = 'hidden';
      }
      var area = el('urlEditorInputArea');
      if(area){
        area.style.position = 'absolute';
        area.style.inset = '0';
        area.style.height = '100%';
        area.style.width = '100%';
      }

      urlCM = CodeMirror.fromTextArea(ta, {
        mode: 'htmlmixed',
        theme: document.body.classList.contains('light-mode') ? 'default' : 'material-darker',
        lineNumbers: true,
        fixedGutter: true,
        lineWrapping: true,
        matchBrackets: true,
        styleActiveLine: true,
        indentUnit: 2,
        tabSize: 2,
        autofocus: false,
        viewportMargin: 40,
        extraKeys: { 'Tab': function(cm){ cm.replaceSelection('  '); } }
      });
      urlCM.setSize('100%', '100%');

      try{
        var obs = new MutationObserver(function(){
          if(!urlCM) return;
          var light = document.body.classList.contains('light-mode');
          urlCM.setOption('theme', light ? 'default' : 'material-darker');
        });
        obs.observe(document.body, { attributes:true, attributeFilter:['class'] });
      }catch(e){}

      /* keep textarea in sync for any legacy readers */
      urlCM.on('change', function(){
        try{ urlCM.save(); }catch(e){}
        try{
          if(typeof window.syncUrlExtraActions === 'function') window.syncUrlExtraActions();
        }catch(e){}
      });

      return urlCM;
    }catch(e){
      console.warn('url CM init fail', e);
      return null;
    }
  }

  function getUrlCode(){
    if(urlCM) try{ return urlCM.getValue() || ''; }catch(e){}
    var ta = el('urlCodeFullOutput');
    return ta ? (ta.value || '') : '';
  }

  function setUrlCode(v){
    v = v || '';
    if(urlCM){
      try{
        urlCM.setValue(v);
        urlCM.clearHistory();
        urlCM.refresh();
        try{ urlCM.save(); }catch(e){}
        return;
      }catch(e){}
    }
    var ta = el('urlCodeFullOutput');
    if(ta) ta.value = v;
  }

  window.getUrlCodeValue = getUrlCode;
  window.setUrlCodeValue = setUrlCode;

  /* Patch open so CM inits immediately */
  var _open = window.openUrlCodeFullView;
  window.openUrlCodeFullView = function(){
    if(typeof _open === 'function') try{ _open(); }catch(e){}
    var view = el('urlCodeFullView');
    if(view){
      view.setAttribute('data-open','1');
      view.style.display = 'flex';
      document.body.classList.add('subview-active');
    }
    setTimeout(function(){
      ensureUrlCM();
      if(urlCM){
        try{
          var light = document.body.classList.contains('light-mode');
          urlCM.setOption('theme', light ? 'default' : 'material-darker');
          urlCM.setOption('lineWrapping', true);
          urlCM.setOption('fixedGutter', true);
          urlCM.refresh();
        }catch(e){}
      }
    }, 40);
  };

  /* Fast paste */
  var _paste = window.urlCodePaste;
  window.urlCodePaste = async function(){
    try{
      var text = '';
      if(navigator.clipboard && navigator.clipboard.readText){
        text = await navigator.clipboard.readText();
      }
      if(!text){ toast('Clipboard empty / allow nahi'); return; }
      ensureUrlCM();
      setUrlCode(text);
      try{ if(typeof window.syncUrlExtraActions === 'function') window.syncUrlExtraActions(); }catch(e){}
      toast('Pasted');
    }catch(e){
      if(typeof _paste === 'function') return _paste.apply(this, arguments);
      toast('Paste fail');
    }
  };

  /* Fast copy */
  var _copy = window.copyUrlCodeFull;
  window.copyUrlCodeFull = function(){
    var code = getUrlCode();
    if(!code.trim()){ toast('Copy ke liye code nahi'); return; }
    try{
      if(navigator.clipboard && navigator.clipboard.writeText){
        navigator.clipboard.writeText(code).then(function(){ toast('Copied'); });
      } else if(typeof _copy === 'function') _copy();
      else toast('Clipboard nahi mila');
    }catch(e){
      if(typeof _copy === 'function') _copy();
    }
  };

  /* Reset via CM */
  var _reset = window.resetUrlCodeFull;
  window.resetUrlCodeFull = function(){
    setUrlCode('');
    if(typeof _reset === 'function'){
      try{
        /* call original but restore empty CM after */
        _reset();
      }catch(e){}
    }
    setUrlCode('');
    toast('Reset');
  };

  /* Thin wrapper: keep original multi-proxy fetch 100% intact, only sync result into CodeMirror */
  function patchFetch(){
    var prev = window.fetchUrlCodeFull;
    if(!prev || prev.__cmPatched) return;
    window.fetchUrlCodeFull = function(){
      ensureUrlCM();
      var ta = el('urlCodeFullOutput');
      var before = ta ? (ta.value || '') : '';
      var ret;
      try{ ret = prev.apply(this, arguments); }catch(e){ console.warn(e); }

      /* Poll textarea until original fetch writes source, then push into CM */
      var tries = 0;
      var timer = setInterval(function(){
        tries++;
        var t = el('urlCodeFullOutput');
        var v = t ? (t.value || '') : '';
        if(v && v !== before && v.length > 10){
          clearInterval(timer);
          setUrlCode(v);
          try{ if(typeof window.syncUrlExtraActions === 'function') window.syncUrlExtraActions(); }catch(e){}
        } else if(tries > 80){
          clearInterval(timer);
        }
      }, 150);
      return ret;
    };
    window.fetchUrlCodeFull.__cmPatched = true;
  }

  /* Preview / save still need code from CM */
  var _preview = window.openUrlCodeOnlyPreview;
  window.openUrlCodeOnlyPreview = function(){
    if(urlCM) try{ urlCM.save(); }catch(e){}
    if(typeof _preview === 'function') return _preview.apply(this, arguments);
  };
  var _save = window.saveUrlCodeFull;
  window.saveUrlCodeFull = function(){
    if(urlCM) try{ urlCM.save(); }catch(e){}
    if(typeof _save === 'function') return _save.apply(this, arguments);
  };

  /* CSS for CM inside URL stage */
  if(!document.getElementById('url-code-cm-css-v1')){
    var st = document.createElement('style');
    st.id = 'url-code-cm-css-v1';
    st.textContent = [
      '#urlCodeFullView .url-full-stage{position:relative;min-height:420px;flex:1 1 auto;border:1px solid var(--border);border-radius:14px;overflow:hidden;background:#0d1117;}',
      '#urlCodeFullView .url-code-editor-wrap{position:relative!important;height:100%!important;width:100%!important;min-height:420px!important;overflow:hidden!important;background:#0d1117!important;}',
      '#urlCodeFullView .url-editor-input-area{position:absolute!important;inset:0!important;height:100%!important;width:100%!important;overflow:hidden!important;}',
      '#urlCodeFullView .url-line-nums,#urlCodeFullView .url-code-highlight-layer{display:none!important;}',
      '#urlCodeFullView .url-editor-input-area .CodeMirror{position:absolute!important;inset:0!important;height:100%!important;width:100%!important;font-size:13px!important;line-height:1.5!important;font-family:Consolas,Monaco,"Courier New",monospace!important;background:#0d1117!important;color:#e6edf3!important;border:none!important;z-index:5!important;}',
      '#urlCodeFullView .url-editor-input-area .CodeMirror-scroll{min-height:100%!important;max-width:100%!important;overflow-x:hidden!important;overflow-y:auto!important;}',
      '#urlCodeFullView .url-editor-input-area .CodeMirror pre.CodeMirror-line,#urlCodeFullView .url-editor-input-area .CodeMirror pre.CodeMirror-line-like{word-wrap:break-word!important;white-space:pre-wrap!important;word-break:break-word!important;}',
      '#urlCodeFullView .url-editor-input-area .CodeMirror-gutters{background:#161b22!important;border-right:1px solid rgba(255,255,255,.08)!important;}',
      '#urlCodeFullView .url-editor-input-area .CodeMirror-linenumber{color:#8b949e!important;min-width:36px!important;padding:0 8px 0 0!important;text-align:right!important;}',
      '#urlCodeFullView .url-editor-input-area .CodeMirror-activeline-background{background:rgba(56,130,246,0.12)!important;}',
      '#urlCodeFullView .url-editor-input-area .CodeMirror-cursor{border-left:2px solid #58a6ff!important;}',
      /* syntax colors URL CM */
      '#urlCodeFullView .CodeMirror .cm-tag{color:#7ee787!important;}',
      '#urlCodeFullView .CodeMirror .cm-attribute{color:#d2a8ff!important;}',
      '#urlCodeFullView .CodeMirror .cm-string{color:#a5d6ff!important;}',
      '#urlCodeFullView .CodeMirror .cm-comment{color:#8b949e!important;font-style:italic!important;}',
      '#urlCodeFullView .CodeMirror .cm-keyword{color:#ff7b72!important;}',
      '#urlCodeFullView .CodeMirror .cm-number{color:#79c0ff!important;}',
      '#urlCodeFullView .CodeMirror .cm-def{color:#d2a8ff!important;}',
      '#urlCodeFullView .CodeMirror .cm-property{color:#79c0ff!important;}',
      '#urlCodeFullView .CodeMirror .cm-variable{color:#e6edf3!important;}',
      '#urlCodeFullView .CodeMirror .cm-variable-2{color:#79c0ff!important;}',
      '#urlCodeFullView .CodeMirror .cm-meta{color:#d2a8ff!important;}',
      '#urlCodeFullView .CodeMirror .cm-atom{color:#79c0ff!important;}',
      '#urlCodeFullView .CodeMirror .cm-operator{color:#ff7b72!important;}',
      '#urlCodeFullView .CodeMirror .cm-qualifier{color:#7ee787!important;}',
      '#urlCodeFullView .CodeMirror .cm-builtin{color:#ffa657!important;}',
      'body.light-mode #urlCodeFullView .url-full-stage,body.light-mode #urlCodeFullView .url-code-editor-wrap{background:#ffffff!important;}',
      'body.light-mode #urlCodeFullView .url-editor-input-area .CodeMirror{background:#ffffff!important;color:#24292f!important;}',
      'body.light-mode #urlCodeFullView .url-editor-input-area .CodeMirror-gutters{background:#f6f8fa!important;border-right:1px solid #d0d7de!important;}',
      'body.light-mode #urlCodeFullView .url-editor-input-area .CodeMirror-linenumber{color:#6e7781!important;}',
      'body.light-mode #urlCodeFullView .url-editor-input-area .CodeMirror-activeline-background{background:rgba(56,130,246,0.08)!important;}',
      'body.light-mode #urlCodeFullView .CodeMirror .cm-tag{color:#0550ae!important;}',
      'body.light-mode #urlCodeFullView .CodeMirror .cm-attribute{color:#953800!important;}',
      'body.light-mode #urlCodeFullView .CodeMirror .cm-string{color:#0a3069!important;}',
      'body.light-mode #urlCodeFullView .CodeMirror .cm-comment{color:#6e7781!important;font-style:italic!important;}',
      'body.light-mode #urlCodeFullView .CodeMirror .cm-keyword{color:#cf222e!important;}',
      'body.light-mode #urlCodeFullView .CodeMirror .cm-number{color:#0550ae!important;}',
      'body.light-mode #urlCodeFullView .CodeMirror .cm-def{color:#8250df!important;}',
      'body.light-mode #urlCodeFullView .CodeMirror .cm-property{color:#0550ae!important;}',
      'body.light-mode #urlCodeFullView .CodeMirror .cm-variable{color:#24292f!important;}',
      'body.light-mode #urlCodeFullView .CodeMirror .cm-variable-2{color:#0550ae!important;}',
      'body.light-mode #urlCodeFullView .CodeMirror .cm-meta{color:#8250df!important;}',
      'body.light-mode #urlCodeFullView .CodeMirror .cm-atom{color:#0550ae!important;}',
      'body.light-mode #urlCodeFullView .CodeMirror .cm-operator{color:#cf222e!important;}',
      'body.light-mode #urlCodeFullView .CodeMirror .cm-qualifier{color:#116329!important;}',
      'body.light-mode #urlCodeFullView .CodeMirror .cm-builtin{color:#953800!important;}'
    ].join('');
    document.head.appendChild(st);
  }

  function boot(){
    patchFetch();
    setTimeout(patchFetch, 500);
    setTimeout(patchFetch, 1500);
    /* if view already open */
    try{
      var v = el('urlCodeFullView');
      if(v && (v.getAttribute('data-open')==='1' || v.style.display==='flex')){
        ensureUrlCM();
      }
    }catch(e){}
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
  setTimeout(boot, 100);
})();
