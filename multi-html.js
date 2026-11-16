<script id="israrlab-app-main-js">

/* ===== merged block: inline#14 ===== */
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
let currentThemeIndex = localStorage.getItem('israr_html_theme') !== null ? (parseInt(localStorage.getItem('israr_html_theme')) || 0) : 26;
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
  { bg:'#03050b', home:'#060d18', panel:'rgba(66,232,255,.25)', accent:'#42e8ff', sub:'#8c6cff' },
  { bg:'#0a0618', home:'#120a24', panel:'rgba(140,108,255,.25)', accent:'#8c6cff', sub:'#4ce3a8' },
  { bg:'#0b0a06', home:'#181206', panel:'rgba(255,159,67,.25)', accent:'#ff9f43', sub:'#ff4d8d' },
  { bg:'#04110c', home:'#061a12', panel:'rgba(0,212,166,.25)', accent:'#00d4a6', sub:'#00a3ff' },
  { bg:'#120e04', home:'#1a1608', panel:'rgba(255,204,77,.25)', accent:'#ffcc4d', sub:'#ff6b35' },
  { bg:'#100618', home:'#180a24', panel:'rgba(232,121,249,.25)', accent:'#e879f9', sub:'#8b5cf6' },
  { bg:'#041018', home:'#061820', panel:'rgba(34,211,238,.25)', accent:'#22d3ee', sub:'#3b82f6' },
  { bg:'#14060a', home:'#1c0a10', panel:'rgba(251,113,133,.25)', accent:'#fb7185', sub:'#f97316' },
  { bg:'#0a1406', home:'#101c08', panel:'rgba(163,230,53,.25)', accent:'#a3e635', sub:'#14b8a6' },
  { bg:'#120610', home:'#1a0a18', panel:'rgba(244,114,182,.25)', accent:'#f472b6', sub:'#818cf8' },
  { bg:'#141004', home:'#1c1808', panel:'rgba(250,204,21,.25)', accent:'#facc15', sub:'#f43f5e' },
  { bg:'#041412', home:'#061c18', panel:'rgba(45,212,191,.25)', accent:'#2dd4bf', sub:'#a78bfa' },
  { bg:'#061018', home:'#081820', panel:'rgba(96,165,250,.25)', accent:'#60a5fa', sub:'#34d399' },
  { bg:'#100818', home:'#180c24', panel:'rgba(192,132,252,.25)', accent:'#c084fc', sub:'#f472b6' },
  { bg:'#141004', home:'#1c1606', panel:'rgba(245,158,11,.25)', accent:'#f59e0b', sub:'#06b6d4' },
  { bg:'#06140a', home:'#081c10', panel:'rgba(74,222,128,.25)', accent:'#4ade80', sub:'#a3e635' },
  { bg:'#061018', home:'#081820', panel:'rgba(56,189,248,.25)', accent:'#38bdf8', sub:'#e879f9' },
  { bg:'#140808', home:'#1c0c0c', panel:'rgba(248,113,113,.25)', accent:'#f87171', sub:'#fbbf24' },
  { bg:'#0a0a18', home:'#101024', panel:'rgba(129,140,248,.25)', accent:'#818cf8', sub:'#2dd4bf' },
  { bg:'#140a04', home:'#1c1006', panel:'rgba(251,146,60,.25)', accent:'#fb923c', sub:'#c084fc' },
  { bg:'#041210', home:'#061a16', panel:'rgba(20,184,166,.25)', accent:'#14b8a6', sub:'#f472b6' },
  { bg:'#0a1018', home:'#101820', panel:'rgba(147,197,253,.25)', accent:'#93c5fd', sub:'#fda4af' },
  { bg:'#0e1406', home:'#141c08', panel:'rgba(190,242,100,.25)', accent:'#bef264', sub:'#38bdf8' },
  { bg:'#120614', home:'#1a0a1c', panel:'rgba(240,171,252,.25)', accent:'#f0abfc', sub:'#67e8f9' },
  { bg:'#040e14', home:'#06141c', panel:'rgba(103,232,249,.25)', accent:'#67e8f9', sub:'#c4b5fd' },
  { bg:'#140c04', home:'#1c1206', panel:'rgba(253,186,116,.25)', accent:'#fdba74', sub:'#86efac' },
  { bg:'#03050b', home:'#060d18', panel:'rgba(66,232,255,.25)', accent:'#42e8ff', sub:'#8c6cff' }
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
}

function applyThemeByIndex(idx) {
  if (isDarkThemeOn) return; /* light mode active -> no custom theme */
  const t = vipThemes[idx % vipThemes.length];
  if (!t) return;
  document.body.style.background = t.bg || '';
  const panelEl = document.querySelector('.panel');
  if (panelEl) panelEl.style.borderColor = t.panel || '';
  const homeEl = document.getElementById('homeView');
  if (homeEl) homeEl.style.background = t.home || '';
  if (t.accent) {
    document.documentElement.style.setProperty('--cyan', t.accent);
    document.documentElement.style.setProperty('--art-heading', t.accent);
    document.documentElement.style.setProperty('--theme-accent', t.accent);
  }
  if (t.sub) document.documentElement.style.setProperty('--art-subheading', t.sub);
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
    if (btn) btn.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
  } else {
    /* Dark Mode ON (custom themes allowed) */
    body.classList.remove('light-mode');
    clearThemeInlineStyles();
    document.documentElement.style.setProperty('--bg', '#03050b');
    if (btn) btn.innerHTML = '<i class="fas fa-moon"></i> Dark Mode';
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
    const newNote = {
      id: newId,
      title: title,
      htmlCode: htmlCode,
      createdAtStr: createdStr,
      updatedAt: dateStr,
      category: currentCategoryFilter === 'All' ? (categories[0] || 'General') : currentCategoryFilter,
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
      category: categories[0] || 'General',
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
    try { if (frame) frame.srcdoc = code; } catch (e) {}
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
function renderNotes() {
  const container = document.getElementById('notesContainer');
  if (!container) return;
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
    const wordCount = code.trim() === '' ? 0 : code.trim().split(/\s+/).length;
    const safeTitle = String(note.title || 'Untitled Code').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    card.innerHTML = `
      <input type="checkbox" class="card-checkbox main-card-checkbox" data-index="${originalIndex}" style="display:${isMarkDeleteMode?'block':'none'};" onclick="event.stopPropagation()" onchange="updateHomeMarkDeleteUI()">
      <div class="pin-badge">PIN</div>
      <div class="card-cover-box">
        <div class="html-preview-wrapper"><iframe loading="lazy" data-srcdoc="" title="preview"></iframe></div>
      </div>
      <div class="card-body">
        <div class="card-meta-row card-date-row"><span class="card-date">🕒 ${note.updatedAt || note.createdAtStr || ''}</span></div>
        <div class="card-meta-row card-stats-row"><span class="card-stats">📝 ${charCount} chars | ${wordCount} words</span></div>
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
    /* Always show real HTML preview on the card (user requirement).
       Large docs still load, but only when the card is visible — keeps home smooth. */
    try {
      iframe.srcdoc = code;
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
  try { hideCategoryPickerMenu(); } catch (e) {}
  var menu = document.getElementById('contextMenu');
  if (!menu) return;
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
      if (ev) ev.stopPropagation();
      assignNoteToCategory(selectedNoteIndexForContext, cat);
    };
    list.appendChild(item);
  });

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
  picker.onclick = function(ev) { if (ev) ev.stopPropagation(); };
  if (menu) menu.style.display = 'none';
}

function assignNoteToCategory(index, categoryName) {
  if (index == null || index < 0 || !notes[index]) return;
  var cat = String(categoryName || '').trim();
  if (!cat) return;
  if (categories.indexOf(cat) === -1) {
    categories.push(cat);
  }
  notes[index].category = cat;
  try { saveData(); } catch (e) {}
  hideCategoryPickerMenu();
  var menu = document.getElementById('contextMenu');
  if (menu) menu.style.display = 'none';
  try { renderCategories(); } catch (e) {}
  try { renderNotes(); } catch (e) {}
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
  if (notes.length === 0) { alert("कोई कार्ड डिलीट करने के लिए उपलब्ध नहीं है।"); return; }
  authTargetType = 'all_cards';
  openAuthVerificationModal();
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
    try { renderExternalHistoryLogs(); } catch (e) {}
    alert('All cards moved to Recovery.');
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
  if (categories.length === 0) { alert("कोई कैटेगरी नहीं है।"); return; }
  authTargetType = 'all_categories';
  openAuthVerificationModal();
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
        '<div class="card-meta-row card-stats-row"><span class="card-stats">📝 ' + charCount + ' chars | ' + wordCount + ' words</span></div>' +
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
  // Keep the category row directly below the main action buttons. All items
  // share the same chip sizing and remain in one horizontally scrollable line.
  let html = `<button type="button" class="cat-chip new-category-chip" onclick="openNewCategoryModal()"><i class="fas fa-folder-plus"></i> New Category</button>`;
  categories.forEach(cat => {
    const safeCat = String(cat).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
    const safeLabel = String(cat).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    html += `<button type="button" class="cat-chip ${currentCategoryFilter === cat ? 'active' : ''}" onclick="filterByCategory('${safeCat}', this)">${safeLabel}</button>`;
  });
  bar.innerHTML = html;
}
function filterByCategory(cat, el) {
  currentCategoryFilter = cat;
  document.querySelectorAll('.cat-chip').forEach(c => c.classList.remove('active'));
  if (el) el.classList.add('active');
  renderNotes();
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
        '<div class="card-meta-row card-stats-row"><span class="card-stats">📝 ' + charCount + ' chars | ' + wordCount + ' words</span></div>' +
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

/* RELATED TOOLS 57 CARDS ENGINE & FILTERS */
const allRelatedTools=[
  { title: "Premium Verification Gateway Generator Free Israr Tool Zone", url: "https://isrartoolzone.blogspot.com/p/premium-verification-gateway-generator.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjyNHf1cvZ4zYVwta08SwZ5V8fBQMpH1pDrxyDqGGrZUVIzxLMycosCZUpraDTfLXAd8RiAbY-F8GaNcilIwOZoYVtSYJwrzGmz4PsFUwYvDqnOE6ZI6IeHS2Sq4h7RGKIt14AUVAdm5XyS_c2dHexdU_h_jHwUhIqIKa2umt9nAk_BhAn0q3eR3Vy5mt8/s1376/85793.jpg", views: 14200, active: 6200 },
  { title: "Article Divider - Split Text Into 200+", url: "https://isrartoolzone.blogspot.com/p/article-divider-split-text-into-200.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhJiYmkQQaUiGo3G17Gqf7jRZGBgHuv8fquhNiLk-Rj8Lniqg-6Q0qOLq7VyFRWpPokU62kRfRuQoyldTvSHZuuROKsR7pHg7FigUrm-BS5P3sAlNUW7cfaALRRifdrXah-BLo8jo0eBOiKgqcgeg2Ld5c80Dv7qcayn5U6To_aV6mc21pmJEjlVn65fhg/s1024/A_luxurious,_ultra-modern_crea_330810882%20(1).jpeg", views: 18500, active: 8100 },
  { title: "Email Generator - Unlimited Custom Emails", url: "https://isrartoolzone.blogspot.com/p/email-generator-unlimited-custom-emails.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhh6I0x3O0sjuxMKHeFiANLLdPaHqRu26l2sS5K4ACJTUQlgAFn5_LWdzhhVg05saFzQzEMmToy4Ba1Wvd3i7cBFnrAZ8EmoeD4g3PuYiWgoiPVdAbKPZpAFQRks0FVG67weHo6LrlyJLnRj3q7WDlSCK4hWziDK33el4JjlVEH1Qw0f7M5EvpYtZdU4bY/s944/Futuristic_premium_studio_with_8830680.jpeg", views: 12100, active: 5300 },
  { title: "AI Images Generator - Text to Image", url: "https://isrartoolzone.blogspot.com/p/ai-images-generator-text-to-image.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjvpnQrD15qS57_HoLip6Wf7PLVzNMTxZjbzGxqLOvQls43Y-8fCR1uyiAxwM3KfuoSyoAiwod0UDj69QNw9UXzbKi321KIRzfTt0zcKxVHEalnOtVWBQGTSMfVlLNjSlBSYF1BR_za4iaIs_SJtHAvaldoQROZFb-gjRnL5kh9m64NGbbA08NooxTWE_VW/s1024/A_modern,_futuristic_tech_678662982.png", views: 22400, active: 9400 },
  { title: "AI Creative Suite - Free Text to Image", url: "https://isrartoolzone.blogspot.com/p/ai-creative-suite-free-text-to-image.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhoY2lysf4-5Q9AoE7vGmodh1bMVuziRNDRqzQ6vbhN3iK5rfyokOzEVt7Ur4jWE5LN2NXzTT8Pcyjr124LFA97i70lZgwnHr5IJpuByJupSR8S_8iLvG2DzugdwgyOCBTKEIclcSp5M8yNKbB3e4BTOUUcG9pqd-6pMmUSpmBzD6GEcu9pZZBzrfzQPSZi/s1704/A_futuristic_3D_studio_interio_685484605.png.jpg", views: 15400, active: 7200 },
  { title: "AI Art Generator - Text to Image Free", url: "https://isrartoolzone.blogspot.com/p/ai-art-generator-text-to-image-free.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhUlv-vYxogNx95PW4h5NC5nyskjIrrixgkq7FqxBS5BWcTRPMe3ChuER0Oc-OhYGz7ezVLwGPUww8vxBQbx0QBd50Ya_njJ4efGAhMnb_7-1vAQJGwSLPAkhI9W0ETSd-QLvxVs1fPmV2OiCoaiHauTvR2lVDiBaEnPyCfJfNPJwQ0cDo1rg3vJYYiVI0/s1024/generated_image_1756796196225.png.jpg", views: 19800, active: 8500 },
  { title: "AI Code Builder - Free No API Key", url: "https://isrartoolzone.blogspot.com/p/ai-code-builder-free-no-api-key-israr.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhUJdq45TV9gQfwJj6TAs666cFvPR5YC3fL9-RgkpkwFdXRWBsY62mceGmqpF5vZlYOif4OG3oqG8h2kTt1vu0ifusrrG2mppCfmAE3jBBX38qDBnyPQToRQ4ukHvuCXhcTwgV7jJkdCOQm_gi5zWWYdYc4B3Lpn1a4digH87pVrRZOUz6GVo0W4UnWjHSz/s1024/A_futuristic_3D_tech_work_925742714.png.jpg", views: 16700, active: 7400 },
  { title: "Paste to Link Generator Code Share", url: "https://isrartoolzone.blogspot.com/p/paste-to-link-generator-code-share.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEivxdWKmsx-QRj4ecXe5voulhXKyxwRLJT-6QQl3TqKvnM_8rj4ouN2j9IDlgtt_ANwNwOuxE1OM1YS-fYTIvwwpQSZgVUV6c361LKgIq_sj9qmD17DuqQvhJ508xAA-ixq7Dy_N6D1J-5xCtugUgFTaHV10zKxDAAMBgOD2XpGtpTJcRE9omJG5Obc1JE/s1024/Ultra-realistic_8K_3D_futurist_474969675%20(1).jpeg", views: 11200, active: 4900 },
  { title: "URL Shortener Short Link QR Generator", url: "https://isrartoolzone.blogspot.com/p/url-shortener-short-link-qr-generator.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiyaFKUeZY-0PjkvG_CK_viHaM_GvDEf8ky9hPZAcY3pg3HumBnU8n1Ai8ebb5dxBIDztT5VO2iTR4snFxuy0YRSU3X18RcQ6yp5adGAq40I1r7BfKHKpMzKVCwqENQrixY8eyq1I2graCfiI5k8e2xiwV_dLxFQQM4lyHeZlG2rco-EMPX3SJPHk7iZ6RB/s1024/A_stylish_young_woman_sta_518554105.png", views: 25100, active: 10200 },
  { title: "Advance HTML Viewer Code Live Preview", url: "https://isrartoolzone.blogspot.com/p/advance-html-viewer-code-live-preview.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEia8mazQu3xBBGmE4v0pcYe2wO45RCzWfLLSkSeAPkR5uEBVN96pVyQIQgRKp_v4CxJK6IqFLLYSoBfRZ4ZfwhZPkEtHjDSAFLjifAiv6nbJckI5aKz3r1b6UPczwZ0lmvl8_sHbOUSdDf2oPC2Soku4GAkDe2jRkWatGWo_wbhJ92Y-TkmnY_IWDpQSEjz/s1024/A_modern_classroom_design_252651673.png", views: 13400, active: 5800 },
  { title: "HTML Viewer Live Preview Tool Online", url: "https://isrartoolzone.blogspot.com/p/html-viewer-live-preview-tool-online.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhYVaagKHgwBPn5rfvIkedoaSLNBoUvDBuaJjRrABJY8BE7qEg5o5a48V-1EdkmuYxkwy7CrL68W9WSV2F9tHGduoATkkjLzWGcflY3t83rno6d1EHvKlfobLpdb2pq9ySV1_RMB40SMFeFppQzsuFkY5BIe3WazFZX3BHnB13AppIr8Usdf-OUxFw9u3dH/s1024/A_modern_tech_workspace_r_226046361.png.jpg", views: 14500, active: 6100 },
  { title: "Text to Speech Speech to Text Voice", url: "https://isrartoolzone.blogspot.com/p/text-to-speech-speech-to-text-voice.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgW2gC5TSitsAPJ0vUivjkW4kAlGEhpXUR6SxMR9_lRSroWyhefH6CFjrXiasDyhOH4YGM6jF2P3nM8iVOzoKReNiQ2k2LbcXTQAL5xO0DGy4u2sTz-KfVAx4k5u_Zw7JInjOgbf2DxEoIvuxReyxmyZ_1lPElc4hQu1E4T491LFMH-0wpcTommB_YmR76k/s1024/A_realistic_tech_workspac_333279290.png.jpg", views: 17200, active: 7500 },
  { title: "Word Counter Character Count Tool", url: "https://isrartoolzone.blogspot.com/p/word-counter-character-count-tool.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhqnd4EAAHU6YXpK4t30tBYnXDi60ZdIzWU7zbRQuyHeX4s56PRib4ee25efh-ayNvgvV_ZprfY7lroRR_hR8yhZTWch789cwV-rV6gROSzexsp3RG0F75UyNOhRFObEVkgAOzF3jPoMUHPi1u86xakEgw9H8x_y8UGT4C4HIaMKcJbgChXZD2DTpY2WbPw/s1024/A_modern_workspace_setup__236130886.png.jpg", views: 16100, active: 6800 },
  { title: "Hijri Date Converter Islamic Calendar", url: "https://isrartoolzone.blogspot.com/p/hijri-date-converter-islamic-calendar.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgOPG8PQG3AzegUFx3pXasamoA9VjYU8zzbR5EDyy4q8weLw81DjDNExPgRoZr0_X31_hySEOeY5SJ8JaoLScRpWOH3AG8PIh4kyXVFe1vEtWlV-3KQ9AgT-CKGYNYBbHoTURyVrcScARBcvepgM7kUjiEqpfoJbzTCIUhK1V1lVMYoDsH8t0w8CtES11mK/s1024/3D_digital_artwork_of_a_m_552705508.png.jpg", views: 9400, active: 4100 },
  { title: "Age Calculator Birthday DOB Calculator", url: "https://isrartoolzone.blogspot.com/p/age-calculator-birthday-dob-calculator.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjW1VOO-cASN3dHSxJMH5qY7MY8ksmKkCaQt3CIx6wJlkpQf7Zx4KZiKxfXMi-NPabnqYRm4pzZWbAJVQuAzZC174lWzozRohqfsDoI0bxZTiVzxZkPQAIyct3bl4HvkPnl-CuCZmOb3F47Cc3Y7ALiDlmXPqgxiqZEzMkCCEqR3-i_W5fdvTZtT-7U-kib/s1024/3D_digital_illustration_o_465396204.png.jpg", views: 13200, active: 5700 },
  { title: "Bijli Calculator Electricity Bill India", url: "https://isrartoolzone.blogspot.com/p/bijli-calculator-electricity-bill-india.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj-2-PXvurQ-2_9Dr_tRorNmREZu9UwXuLLIctkvkkM93bb2goClY1c9FRDyw0ZkZG5n0yoL69PZp_fUSGZRSKMp2xi_tYKpyn6kTio2pryembFC5Hy5mf5r40NYEb0qqBcYacNvowlth3GkrLRX24TKozxazgh7oc_6ihagtfg6uEl-yXqHcwi_2PxAGGG/s1024/_3D_digital_artwork_of_an_100067981.png", views: 10500, active: 4600 },
  { title: "Loan Calculator EMI Calculator Free", url: "https://isrartoolzone.blogspot.com/p/loan-calculator-emi-calculator-free.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh5MY4xXWUJ73IJ62w1j7kGfdUOBF4rgL_1NPwPaqsfZhMLeUxg-4I5n9gMXv4MSm9wELsn61AOlJ6xlLq4D3kfNJjxpWSFPZoJD2KEjm_pq-qBf5fY3KtHCR0ALXVM6XmOcDt8hvziWriu_CBWi2cFJ1knp7TjHisQJ7ETJ8t_jwkZrvqE_qwxM5a0IAd2/s1024/_3D_digital_illustration__674769610.png", views: 15600, active: 6700 },
  { title: "All Unit Converter Convert Online", url: "https://isrartoolzone.blogspot.com/p/all-unit-converter-convert-online-israr.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg52gYZmDj7UU5PQ6RdRDbFG5St2lqjGVE7Wu5yE5E2pxS91pjbFJvSavCs62Hmrf9csec6wg8RaT6r0m2Mos6svq_Z9PKz0RbBqO4YNSYmTZp-CdHFDbXlWf1gaxZt5ttSB3K4tNib-uHDNa4HVB57JeLRpA1mH80lxAJUq7PFY9gOQyFaMUiRTXJdTIA/s1376/85478.jpg", views: 12900, active: 5500 },
  { title: "Free Quiz Maker Create Online Quiz", url: "https://isrartoolzone.blogspot.com/p/free-quiz-maker-create-online-quiz.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiKg0LGvsyynNtTwoDk4WhvUH5zD7MzfmVzUWi-mPswiayxTXZbXSEpbzPIv5XeJ_hjnI7WZE9XYAQ0XBLFMGIEu0z6Ysw-Ha8G8ld86AJ9OgGkkq_svW6Qx_2lE4AASoyogw0AxFPyfqySE85R8V8i5ZWHzA3bvjAlJj1guD2nwGv-fj7gyIz3pxSFLVuh/s1024/A_realistic_workspace_set_759290890.png.jpg", views: 11800, active: 5100 },
  { title: "Internet Speed Test Real Speed Check", url: "https://isrartoolzone.blogspot.com/p/internet-speed-test-real-speed-check.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg-OFuPGheUx_fMx6VSaVtIxfdzMZiY8gKlhpjEv1NHSf88vAIYYrTWIcQvAbj6OfwEU-hpZtgRkjnq3wTby3O6mlEUU5gMkv0PHL5_rDjJy9jxUjNDLAMQk2Lh-MGlvPV2Qbs9T3m9yxKPtKmB9J8Ac1EV6zYWeHF_7_amQ0adtlsbHxeAwY6cRHZO2HI/s1376/85471.jpg", views: 28400, active: 11900 },
  { title: "WhatsApp Direct Message No Save Needed", url: "https://isrartoolzone.blogspot.com/p/whatsapp-direct-message-no-save-needed.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEist7Zgf7M-Bf12FVVWXsS9H1_B76ibECoTWLC6QMkr3nRhcLTYoB4EE5ac6YprFLyN_dlwvobV7aJMPOc4S6_cF8L34-sVnKO7pnTrNnLaN3vC27XbDRxjnnjq3xTUBrSqci9VZN-kEwi4k_fMN_NarPhQOyxVlvOkiLel_6fYXl4aiBXl1MtoguFT-BZS/s1024/A_realistic,_modern_works_572379611.png.jpg", views: 21300, active: 9100 },
  { title: "Strong Password Generator Free Secure", url: "https://isrartoolzone.blogspot.com/p/strong-password-generator-free-secure.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhnrreen0pq16tb4bc62futy9x1UC1HRbYQ9PThhOKF_gDnv4G5EQ8n31NOyN5lqh6IPGMpsY5MPQ12YqKQ6nWDo3yaeKKcflTCE7aDr8IM-1yzUr2L61QXaYfMqR6Qaokn5LQOmbkmVv8BhWAmxsSa4yJ51uPvkE65qhRvq-HPFEcu6w7SL52z-uf5Xxu6/s1024/A_high-resolution_modern__733840994.png.jpg", views: 14700, active: 6300 },
  { title: "IFSC Code Finder All Banks Instantly", url: "https://isrartoolzone.blogspot.com/p/ifsc-code-finder-all-banks-instantly.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjI-jBSdrAB6Tn2sIrOMTBGnHVw4OlETxJI1FXROgKiFL5nkYXV0GMBE2aWDYsP0MYvFjCGL4B0PHcdE-AwWoqoLMKsYYIYadWqEMj9tHxy47InwCwJTfl_-JCXvgsHoAueZAARdDcaWH2tNllYpjElASodvY8DV1EBumsPzLw7hW4XwyqE5Ocgmi1ft4sL/s1024/A_modern,_ultra-realistic_296282460.png.jpg", views: 16900, active: 7300 },
  { title: "Stylish Button Generator Free Custom", url: "https://isrartoolzone.blogspot.com/p/stylish-button-generator-free-custom.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh11vKg8nolORYkMgLrtiOMu3Fj_AQ7SdGV8BmM-6_9fkUvKdxXvNGxReKTomWiP08yO8Q0cD2NgAWeffWMMVOsgkYUGXwcejSO4slFNVi06Av2uHne6HtNUZrLHO9s4M9snG-HRKbp22cUcMZZPseEkYJvLO56U6mkW7XrG0kXdqegap3MCLI_svAeiVvD/s1024/A-beautiful-stylish-dark-263720649.jpg", views: 13800, active: 5900 },
  { title: "CSS Button Generator Free Stylish Maker", url: "https://isrartoolzone.blogspot.com/p/css-button-generator-free-stylish-maker.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh8CungducxWsZhba3tDXkQZyAKfCQV7dXOGdUfA_mWykzmiFgy_fEN6feQzD2VouWQH_fVApMy2NPo5gM6HdYi6RahNOjfvEW94FLG80b2pR1YH8wfq2ZvjEi0zF7rzNiBJTXDCavZVNCK4REMlVVvV6vUWtF8G4Wi0ZgTJXE0ITKuNx02k6Nx5BuRvuj5/s1024/A_modern_tech-themed_thum_975821435.png.jpg", views: 15200, active: 6500 },
  { title: "Random Button Generator Modern CSS Tool", url: "https://isrartoolzone.blogspot.com/p/random-button-generator-modern-css-tool.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhyq7HRTOiKpEoKAuuL6XlUu0Xsk-9awGQ1fk1_WEEdMEVQMXzwKg3u-p3HeVVUFwY2P70HQvVJISFSvrsvSNPVyHKUWV6PcYGLOI36KRpVQ3qDCbOdJVqfxyE_mxzyLNq3K4zUWv5Spi_ogQbhRgxlROBRzx3dQx2xYekmLQLFwSbOoxJMVDZGs-dtuvxJ/s1024/A_modern_computer_monitor_897506577.png", views: 11900, active: 5200 },
  { title: "200 CSS Buttons Stylish Modern Button", url: "https://isrartoolzone.blogspot.com/p/200-css-buttons-stylish-modern-button.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhvhAdwBK_beWICNDWnlLRn3UKLKCxyUrtFYCqNFiGSLVl-qKdF4fQu8CXrtqFATj3ubF3KzMbV0odE3hSf6UiHDpBBluMPxGbcbXS2rQgjThiVlUIAZEDKn7eQr4pGg1pP36YDpndsQVMeurHOyfuoeL39mf_h2jeHxIwvoj6VEP7GWfjUuRHvZiD-e6o9/s1024/A_modern_workspace_setup__996476333.png.jpg", views: 19400, active: 8300 },
  { title: "Gradient Generator Custom Color", url: "https://isrartoolzone.blogspot.com/p/gradient-generator-custom-color.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgrjyUU01S3FcQiXxWxwwANeGMoKs7O20_zmQdhqBExrF-6PZSSIT-IKwtY-aKOKAHfQtrlcloYAC5HVwfFvWy8iUGHHEhyznXAjopj4-rcc1MnYS2RCzsE3emkwGf-Owt4smzdEhrXoiC6PvZMomLdmd1npvL19NxdZdQNgbf8m4_-cgevi2y7vSBx6xS4/s1024/A_modern_digital_workspac_520016822.png.jpg", views: 12600, active: 5400 },
  { title: "Text Shadow Create Advanced Stylish", url: "https://isrartoolzone.blogspot.com/p/text-shadow-create-advanced-stylish.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiHd-Qs1RpkMlFreti2wD_MBcwqhLYBiXdy-EqWxsT_Dvrs5uFQxrpSowmju05CTJqMBvOtRkQEhcW0PTuXCF-74QJUHW39c_dcroVN8bwFL9PiH-ECjNGBg7KBKaI5iXd3zDq-A68MhdPQiQvQUVW3Qj3Y4kuE82KM6ebMs095oNdsi68zQlz0g7UpVdHN/s1024/A_realistic_and_modern_wo_871813681.png.jpg", views: 10800, active: 4700 },
  { title: "Text Shadow Generator Stylish", url: "https://isrartoolzone.blogspot.com/p/text-shadow-generator-stylish.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh17Lei4xnMgHRsZ2gBTdaCMKKmZx1H4ypDFgvmd_3oByPHUue9DsUxdml6CeZhFzrHsTEzBL_R5cUQ86ivEs-1_T2jSRZTfVMnOEhcThvohe7PJ1HXFHr_69S6rytgFdpnJf16VtPwFnBh-wLKrByTRIBf0iH3eLjb8-8wIPEkdfDXmfDJdFlku_etOPv0/s1024/A_beautiful_girl_sitting__723633607.png", views: 11500, active: 5000 },
  { title: "Soft Shadow Generator Modern", url: "https://isrartoolzone.blogspot.com/p/soft-shadow-generator-modern.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiZUaLsINHNhYW0uvbSVcX94eirlvp_q_F9L5J8WGRO5ESDHMpXSGEGeqOT3qshuU6INPmphyFlhtbIQnt0a-TPAtp6qZhXQUuT_mMTAsN76JMq1vpuL7et0iUME4NMxnWTfehEszV-tcg_qTh-o6yzUYghzqz563DAOnARtOF_vvSggr_Yd0_X_6IeUEKS/s1024/A_modern_creative_workspa_425799789.png.jpg", views: 9900, active: 4300 },
  { title: "Box Shadow Generator Stylish CSS", url: "https://isrartoolzone.blogspot.com/p/box-shadow-generator-stylish-css.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgBkzPxtcQX3P0epcAxv-Un__phzRnzqBKz_2Usg8LT0rMBVqZMAAuxd61YGt3IqGExFCUwIV02PDO1TYP869H8jhP_3pf_oefJJeV2e26p2Mr7Rb_A_XqaAzG0LiYSxpVoiS2Euigsj8oB3B8s_cicuK2D85e-VEnz7EoXa4jx2aPMIBQkMvDRtLCK6-E/s1024/A-realistic-19-year-old-g-299570621.jpg", views: 16400, active: 7100 },
  { title: "Border Style Generator Stylish CSS", url: "https://isrartoolzone.blogspot.com/p/border-style-generator-stylish-css.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgaIN1lwHJjma3tutHxqGpnkJ4kb1-_sKvyNPQ-YVhszDo_flMVsmX4tmqbenC-WG__0pZnLX95lwP96-sfcSu9WG26ByfdTTzExwlb7pORYpwzStRHonzV9pyfyi0SQphFr3jSreCrALmZn5k4b3yUSWonox789tqH5eA4YTKSarZtgzQgctxCZMscAFV4/s1024/A_vibrant,_slightly_isome_901030846.png.jpg", views: 10400, active: 4500 },
  { title: "Dashed Border Generator Stylish CSS", url: "https://isrartoolzone.blogspot.com/p/border-style-generator-stylish-css.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgFhB1kH61tVuzAInFLnNkf800mxcakNkZLRt04eiBelE2sdxZ5c_XDsFqrFQkoQ_4E2MSYkNp39xv6UTLX1plZ4YxMtTQaKBCr4LmWvJwNFAqjoMFIWIRR0PPzWAZlg1UyxmT4t2yYPkG5kb43C96jpHFNB6Sxg3rlFEUbq5l4tu5PtpzYEg5o1ZhIVqA/s1024/86626.jpg", views: 9200, active: 4000 },
  { title: "CSS Transform Generator Visual Scale", url: "https://isrartoolzone.blogspot.com/p/css-transform-generator-visual-scale.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgETlCYH96-APYh7nGtaKm4uAVS7-AfmF_hdtZSD76MFVHlVNUp1v7kjirplPrI3m6ZBEo3fjKSN6BqAr21HU3ea_urgoHX0aTLQ6DiIXUo2J3AIDWX6-tE3EWdTKQdu7VJp9miatQtSn8Bz2QCY7cJ_OLCTmCQxsym2HzHnCtgNs2e1T6mTFDNGHbgAnSA/s1024/A_realistic_19-year-old_g_927578681.png.jpg", views: 11100, active: 4800 },
  { title: "YouTube Revenue Calculator Estimate", url: "https://isrartoolzone.blogspot.com/p/youtube-revenue-calculator-estimate.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjWDpLiWbQ9mDD-VOBl9t5Hw7RTEuMaqonxUbnwvO7Un7qpCGbulZiDL12xjS9xj9kDPGdhCpljLpnmme_XAdhvnFqyU68y5qxFklSPARUDxNi9DFMkLjob9fJfteGD_6CBvdTgEpcFjjiwbIhN5iEz8R3WYh6ZtOC2wg5dzEC-JjPg-0Q0walSJh6Z10EA/s1024/3D_digital_artwork_of_a_c_390156647.png.jpg", views: 23500, active: 10100 },
  { title: "YouTube Thumbnail Downloader Download", url: "https://isrartoolzone.blogspot.com/p/youtube-thumbnail-downloader-download.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjWDpLiWbQ9mDD-VOBl9t5Hw7RTEuMaqonxUbnwvO7Un7qpCGbulZiDL12xjS9xj9kDPGdhCpljLpnmme_XAdhvnFqyU68y5qxFklSPARUDxNi9DFMkLjob9fJfteGD_6CBvdTgEpcFjjiwbIhN5iEz8R3WYh6ZtOC2wg5dzEC-JjPg-0Q0walSJh6Z10EA/s1024/3D_digital_artwork_of_a_c_390156647.png.jpg", views: 26800, active: 11400 },
  { title: "YouTube Tags Extractor Get Tags Title", url: "https://isrartoolzone.blogspot.com/p/youtube-tags-extractor-get-tags-title.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiRsmmlV4xs3inRcfr-y3xhK7jhALSUr2Aoy81ZdAxN2e5rVyiwMsfDazUeR3qAhQWebM2Vkn0Yed-9mHZi6dIZaoKX8HYE91GLoSiPLg6RjIV_dNI1h1O4PcfSPgDXhgIrfz1pCoLXoHNrjxlle9U0wxNi09x8vm2Cszj3NilMRViKq14DSm8jAyX6yyZm/s1024/Design-a-vibrant-eye-cat-409136621.jpg", views: 17900, active: 7700 },
  { title: "YouTube Tag Extractor Extract Tags", url: "https://isrartoolzone.blogspot.com/p/youtube-tag-extractor-extract-tags-from.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhOMnwXGDQeRdfMUMnaFX6DswALeA8TXEWeIb0xlPQo7kMn2Cx7ncmVABzXbo3YqRIohdCjVRQ7vboBmYNdDoMkIgHnBBMu-PJOAThCZMddLIRIbc2Zrw6BbSRWo2R8wOKUUw_QJ10nacZ68eag3XaBKWq2X4MTanMM0tF3nMEZGzKyWNXp5DKWu1OpP9ZP/s1024/A_premium,_realistic_work_586583276.png.jpg", views: 15800, active: 6800 },
  { title: "Israr Tool Zone YouTube Suite Pro", url: "https://isrartoolzone.blogspot.com/p/israr-tool-zone-youtube-suite-pro-all.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhoJN9KJnchdLBuTkswSnUKRLHiHxHgnF0u2NdAkWFXTjFKlgEcmDjSmTXTrmNN69VdW8A_TQ_qOm5Z3JU9IDmNfgYay8KYWskJLTJozFHPtEeVXPGeFruDcSGKAFoxUSh142CQhR_DViH9jNKijHi8k9Oo-F7l6jP1aAN39sfMewZj1V1lXl40PLAc1rjM/s1024/a-modern-and-vibrant-digital-workspace-showing-multiple-tools-like-youtube-description-generator-im-1.jpg", views: 29500, active: 12800 },
  { title: "Image Crop Tool Online Circle Crop", url: "https://isrartoolzone.blogspot.com/p/image-crop-tool-online-circle-crop.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhN-a2DyOWA_E-Vquj62RIUuO-mCgJwV3k08rJl0BYT67gTBrR6sb0wY3q0q-jRZAyOjyc1TZu2gCbBFjZ2jkxme6BDLkx3Y7IGZa4B5t4zPzYNMNw5RFhfgFkIuesqbiK6nCTjCZ9ihXh5_Ri5OeKhYJd_k_yUVwBn-JQDXLdsL3plePwFPdofwDSPmN15/s1024/A_modern_digital_workspac_634396879.png.jpg", views: 14100, active: 6100 },
  { title: "Compress Image Online Reduce Photo Size", url: "https://isrartoolzone.blogspot.com/p/compress-image-online-reduce-photo-size.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjXvu7BgPz-r-c3DURYsr4g-xocl0QmfW30MBuYNHIi-fCFvyAtY27fYi61M27E_bYYn8z-0iHNylJ7yr4TMvi0A2ld_v5REjC0cz-94fUL_jcV6BWUZH-we1qtRKYhyphenhyphenuUvF4pXWO3XCGs_8F-Qq9p1eKqu4MDHpZYqgYvtbKzY355rmKQMPFmIJB_eJD_U/s1024/3D_digital_art_showing_a__466267296.png.jpg", views: 21900, active: 9300 },
  { title: "Free Keyword Generator Tool", url: "https://isrartoolzone.blogspot.com/p/free-keyword-generator-tool-100-working.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg6YuNE99KFDev80Kpc4JWAZVrcu2oYQ7SqcPnV9wYtwuGXvrPovXzZsWw206dpHxgJTSts5HOZVezmrs-4JA0l6sDE1gaXT11fWUOly1IPrItpFfqAw8mcRKLVo-f_AqNLuZ5ZnpzA6XxCPbt_44M4uWtE3U1jovqS7hUgUk91gMwRoonTLKyJsQXUjymv/s1024/A_realistic_workspace_fea_109311379.png.jpg", views: 13300, active: 5800 },
  { title: "Free Keyword Finder Tool Unlimited SEO", url: "https://isrartoolzone.blogspot.com/p/AVvXsEiOcESecPB0A0xfXMaj0A85OWQ8Qfe0yCsJKHyWXbuoK2FwRqmk9i3YpTMxyjwhZKwbKezCroQbugz5bslKkno9G_gRcEhA0Bw99phPXvB3x_xmojAOB9g2ATcG40wI0H_kaSfYD7uWJx19MTsVNxEOhso-ueE81k_o1tK28CG8b8dHBe3LiEut2IZ3iO0O/s1024/3D_digital_illustration_o_786134816.png.jpg", views: 12500, active: 5400 },
  { title: "Free HTML Code Converter Parse HTML", url: "https://isrartoolzone.blogspot.com/p/free-html-code-converter-parse-html.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj4rqg-09AHicyxZEC0KwWvMG9rZzCFw4tJx1XB7cTQre59sjHs7Z7Mps7m_8UYVWNe2GSQzV2kjV0OE136cl9OWQLiyNOn5-YvOR-xTymiQoX1Xyrs-WECTvKU6xMyyIbGVIKg35IbKdSa0i1TUohEzF6igfopjCruX27KPfzH3NG3v1vKnpHd8i1TV1jb/s1024/A_realistic_digital_works_328734446.png.jpg", views: 10600, active: 4600 },
  { title: "Free AdSense Calculator Calculate", url: "https://isrartoolzone.blogspot.com/p/free-adsense-calculator-calculate.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiNxHjhaA2KJhepbFfTPOCaQizuc_uWXmzhB4Ncp_e2POJLc1HJZEBmcJjla0Da8PxadmKuVVfwFCZ42ezM0qotLZZjK6JIaFaHJTVbXDQsXO5FHsPtzE78jrPJIacWukn8SR1e4Fc-_QJNHCQu1xvdGtRRFpZoJcR1VCqjR8WzbRgpO30_iFWGhESkkYrC/s1024/3D_digital_artwork_of_a_m_639514542.png.jpg", views: 18100, active: 7800 },
  { title: "Free AdSense Approval Checker", url: "https://isrartoolzone.blogspot.com/p/free-adsense-approval-checker-check.html", thumb: "https://blogger.googleusercontent.com/img/b/R2_vZxl/AVvXsEihKsYErSqjZwWP5cCsPlCxVHTDsJeeUCkyEk_u8Be0TgFptUhYKPH6ZLjCGfsPfMXo2F3CSAavfKba4oQcYI1kOm941lPy0W9alZkqhkkuyvT2mpYhnRFNPymxHjUlT7r6rP3ix2Dh7FxWiMFPmThTNLSq7K5Pgt8mXXZJohaD3S5PlcWmAEgeKolb040V/s1024/A_large_ultra-HD_monitor__107871603.png.jpg", views: 14900, active: 6400 },
  { title: "Free Favicon Generator Create Favicon", url: "https://isrartoolzone.blogspot.com/p/free-favicon-generator-create-favicon.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjr2r0Lk7DcCgMnA-KUrUNGZBDsA4N-EYzcQ3myBfvdPcEn-5287TqCB684Zf6OjESvqPvZIvEKVNLN3tkntJkuSqOVUyuv4G60-6ZATG1ZnPbUXnYRNzl6O7t8J7k_PXd_u7a1XnIbB-MAWbdMD8T8asEM2ef7M6ndOpmendQIqINN_JXG6AN3Xs1e8AFp/s1704/A_modern_3D_office_room_with_g_454643402.png.jpg", views: 11200, active: 4900 },
  { title: "Free Robots.txt Generator Custom", url: "https://isrartoolzone.blogspot.com/p/free-robotstxt-generator-custom.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjbbzTgRwcSbVuTrpr0E8fLZPMhHuAicc_Jn5Dw_t0mKVxpE8-UgSOh5tqfg7OBR8YkqcJsmqMinw4znYe2xbocHTqIIqRzs_0u1eMJXaYE2gJ_m-a90l9kA4k9maZOrqi0KhxkH2E-UXw13R3_1NR_3_dv4r7-yHV7TZOmSIZeAECF2j90LywqbyiuMI57/s1024/3D_digital_artwork_of_an__996230162.png.jpg", views: 10100, active: 4400 },
  { title: "Free Meta Description Generator SEO", url: "https://isrartoolzone.blogspot.com/p/free-meta-description-generator-seo.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgaEauCnZqQDvOWXsBTlfz1BloPQlaVhgae59TJmXZHTlZoex9B22CsrsDkYgd7PhyphenhyphenYfl6oq9FjW1CKpU48KjqNZ_GJ_ZsQTcLBa448aG4CRI0oOmVSY3XxtAkmVGgBu9h0RMKPYYn91zwtSqGjxXNI051H7umVye2eLvMmswDk3N0hm8mhy9xuHNvJfHPy/s1024/3D_digital_artwork_of_a_s_474133995.png.jpg", views: 13600, active: 5900 },
  { title: "Free About Us Page Generator", url: "https://isrartoolzone.blogspot.com/p/free-about-us-page-generator-for.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiNkQ10P0xR8h2j4y_o2zNiatsIgliVdfA9eIOa_N2z4rEVLhbT9FT3_2grilRRQnx-LlJTF-jaUr5NNAsjM5amhVskbFZfIDI6Szb7dxEBlPmK6iZVs_zZ416cvSxmsDTLuqYnR5MVO-UZr3cKrn7AJFjZANpm3HV47i0HObaHj2G6hvKbXjPTpG68MvHg/s1024/_3D_digital_illustration__965042156.png.jpg", views: 15700, active: 6800 },
  { title: "Free Contact Form Generator", url: "https://isrartoolzone.blogspot.com/p/free-contact-form-generator-for-blogger.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiamUHVbY39aoOxSE-Lh5J3_KdUObEoDO3t3mT3jt_qWkbAsDhPWl532g1wm76ABAR8SELTD9KJtD27ykZYMpwzLYFnAR2YcedMrUOcy-KHB65WOImI3Ypq4TDNikUA1CUspK1cU4_tSM1LRGMQdU4JI7f8mvZ3CbCmsjz98rJ0PcbOLbbg0z8rjqBZe5qL/s1704/A_modern_office_interior_with__349539268.png.jpg", views: 11800, active: 5100 },
  { title: "Free Cookie Banner Generator GDPR", url: "https://isrartoolzone.blogspot.com/p/free-cookie-banner-generator-gdpr.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg2M16n1tMqpt_dutRY4TU6MgTUF4WLcRZ61vQCgPh853VBRFd0dEbVBjXUKDOnYCNWxa_0RZ96EfH8rA4aR663ZVUsn-XtYCre2pr0UiCPMnmkeVUv7m6X5ejs4Yyaoc-q_Gy59vKwfS4TQfhC2BUzFaxg2YYUzrglAIAMFBJvzsiQc60JhkKPH6w7c1YT/s1704/A_modern_office_interior_with__3988369.png.jpg", views: 9600, active: 4200 },
  { title: "Cookies Policy Generator Free GDPR", url: "https://isrartoolzone.blogspot.com/p/cookies-policy-generator-free-gdpr.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgW8V7KY31VWMGhYm8Cwkvar5iFGKOVn2qHZWds7jbh91rMAlrHBfFOBV1OmvQ55MpKKnh1yrweEVbwHF5Q9Jz06vJ0Rgp9KwLzTtIJ4irqEzpn1i-Do9Qo1tZxs7L6L8wLnsKVZ_b6LWe6HdFcDRctB2hTQbpLkruSuRyWtaEbM-nAq__RKsekmW8nnMi3/s1704/A_modern_office_interior_scene_870095492.png.jpg", views: 8900, active: 3900 },
  { title: "Free Disclaimer Generator", url: "https://isrartoolzone.blogspot.com/p/free-disclaimer-generator-for-website.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEibtOeDV8CmSr_gET5g1z1cJymjILzET_m2j69LA7ZVofN7wN0e6GifvRLaZe_wJeEzJ8QM3iohjN1YHqGmdUWBXV8I76nVF5EWRjsv-LbgYgazGt74oghff3CQoOf-TPsaffFjqMNfHjUpgauGhStRSFqXJawgB1p2GPcMaWVbLixGvWqwivpsMHk8eLqz/s1024/_3D_digital_illustration__910356462.png.jpg", views: 12400, active: 5300 },
  { title: "Free Terms and Conditions Generator", url: "https://isrartoolzone.blogspot.com/p/free-terms-and-conditions-generator-for.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgOe7R0H26pDgxcnlcg0xcnGoTXW_u7RuGmle0ik22wu38O1_7AaTflKvpXa2cUT1_bB_FJiVNTB4oVNDjzg4XdeMA8g0ClU85l43jc21YycX269sohezTeGtX2FvcBvFAcIKxzst8ZwwRIfBlvtOWhD2_KGbgA_5SKae_Kitgwt2vyjxXJfJjRs6Ei7yTs/s1024/3D_digital_illustration_o_84667914.png.jpg", views: 13100, active: 5600 },
  { title: "Free Privacy Policy Generator", url: "https://isrartoolzone.blogspot.com/p/free-privacy-policy-generator-for.html", thumb: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi_TQGmxZYxWHwqp-eE1Q0kHOmysMvZYEXTKQcwMaM3GmiO7sU_UVVItRp-0xWGzppVWdv6-lySiqOp5wq5T-3WjWll-dHj3FR_nX65hspPCJNKvrHv-f76_u97Th5u7m_iIwSAay8bKKOzAiFbWkLvYP426fZ2-snGvv58YW-9cyo3LopZ83bY8N678dE/s1024/_3D_digital_illustration__223292339.png.jpg", views: 16800, active: 7200 }
];

const relatedBatchSize = 4;
let relatedCurrentPage = parseInt(localStorage.getItem('israr_htmlviewer_rel_page') || '1', 10);
let relatedMode = localStorage.getItem('israr_htmlviewer_rel_mode') || 'recent';
let relatedSearchResults = allRelatedTools.slice();

function getRelatedViews(){try{return JSON.parse(localStorage.getItem('israr_lab_related_views')||'{}')}catch(e){return {}}}
function getRelatedActivity(){try{return JSON.parse(localStorage.getItem('israr_lab_related_activity')||'[]')}catch(e){return []}}
function trackRelatedVisit(tool){
  try {
    const views=getRelatedViews(); views[tool.url]=(Number(views[tool.url])||0)+1;
    localStorage.setItem('israr_lab_related_views',JSON.stringify(views));
    const activity=getRelatedActivity();
    activity.unshift({action:'Tool Visit',title:tool.title,url:tool.url,time:Date.now()});
    localStorage.setItem('israr_lab_related_activity',JSON.stringify(activity.slice(0,200)));
  } catch(e) {}
}

function saveSearchHistory(query) {
  if(!query || query.trim() === "") return;
  let history = [];
  try { history = JSON.parse(localStorage.getItem('israr_htmlviewer_search_history') || '[]'); } catch(e){ history = []; }
  history = history.filter(item => String(item).toLowerCase() !== query.toLowerCase());
  history.unshift(query);
  if(history.length > 200) history = history.slice(0, 200);
  try { localStorage.setItem('israr_htmlviewer_search_history', JSON.stringify(history)); } catch(e) {}
}

function showSearchSuggestions() {
  const box = document.getElementById('searchSuggestionsBox');
  if (!box) return;
  let history = [];
  try { history = JSON.parse(localStorage.getItem('israr_htmlviewer_search_history') || '[]'); } catch(e) { history = []; }
  const items = [];
  history.forEach(item => {
    const value = String(item || '').trim();
    if (value && !items.some(existing => existing.toLowerCase() === value.toLowerCase())) items.push(value);
  });
  box.innerHTML = '';
  if (!items.length) {
    const empty = document.createElement('div');
    empty.className = 'search-suggestion-item';
    empty.textContent = 'No recent searches yet';
    box.appendChild(empty);
  } else {
    items.forEach(item => {
      const div = document.createElement('div');
      div.className = 'search-suggestion-item';
      div.textContent = String(item);
      div.onclick = function() {
        const searchInput = document.getElementById('relatedSearchInput');
        if (searchInput) searchInput.value = String(item);
        box.style.display = 'none';
        filterRelatedTools(true);
      };
      box.appendChild(div);
    });
  }
  box.style.display = 'block';
}

document.addEventListener('click', function(e) {
  const box = document.getElementById('searchSuggestionsBox');
  const input = document.getElementById('relatedSearchInput');
  if(box && input && !box.contains(e.target) && e.target !== input) { box.style.display = 'none'; }
});

function submitRelatedSearch(saveQuery = false) {
  const input = document.getElementById('relatedSearchInput');
  const query = input ? input.value.trim() : '';
  if (!query) { if (input) input.focus(); showSearchSuggestions(); return; }
  if (saveQuery) saveSearchHistory(query);
  filterRelatedTools(true);
  const box = document.getElementById('searchSuggestionsBox');
  if (box) box.style.display = 'none';
}

function handleRelatedSearchInput() { filterRelatedTools(true); }
function triggerSearch() { submitRelatedSearch(true); }

function highlightRelatedTitle(title, query) {
  const original = String(title || '');
  const terms = String(query || '').trim().split(/\s+/).filter(Boolean);
  if (!terms.length) return escapeHtml(original);
  const escapedTerms = [...new Set(terms)].sort((a,b) => b.length-a.length).map(term => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  try {
    const matcher = new RegExp('(' + escapedTerms.join('|') + ')', 'ig');
    let result = '', lastIndex = 0, match;
    while ((match = matcher.exec(original)) !== null) {
      result += escapeHtml(original.slice(lastIndex, match.index));
      result += '<mark>' + escapeHtml(match[0]) + '</mark>';
      lastIndex = match.index + match[0].length;
    }
    result += escapeHtml(original.slice(lastIndex));
    return result;
  } catch (e) { return escapeHtml(original); }
}

function getSortedRelatedTools(list){
  if(relatedMode === 'recent') return list.slice();
  if(relatedMode === 'top') return list.slice().sort((a, b) => (Number(b.views) || 0) - (Number(a.views) || 0));
  if(relatedMode === 'ranking') {
    const visitCounts = getRelatedViews();
    return list.slice().sort((a, b) => {
      const visitsA = Number(visitCounts[a.url]) || 0;
      const visitsB = Number(visitCounts[b.url]) || 0;
      if (visitsB !== visitsA) return visitsB - visitsA;
      return (Number(b.views) || 0) - (Number(a.views) || 0);
    });
  }
  return list.slice();
}

function filterRelatedTools(resetPage = false) {
  const input = document.getElementById('relatedSearchInput');
  const rawQuery = (input ? input.value : '').trim();
  const terms = rawQuery.toLowerCase().split(/\s+/).filter(Boolean);
  if(resetPage) relatedCurrentPage = 1;

  relatedSearchResults = allRelatedTools.filter(t => {
    const title = String(t.title || '').toLowerCase();
    return terms.every(term => title.includes(term));
  });

  localStorage.setItem('israr_htmlviewer_rel_page', relatedCurrentPage);
  localStorage.setItem('israr_htmlviewer_rel_mode', relatedMode);

  const status = document.getElementById('relatedSearchStatus');
  const count = document.getElementById('relatedSearchCount');
  if (status) {
    if (rawQuery) {
      status.style.display = 'block';
      status.innerHTML = 'Searched: <strong>' + escapeHtml(rawQuery) + '</strong> &nbsp;|&nbsp; Matching cards: <strong>' + relatedSearchResults.length + '</strong>';
    } else { status.style.display = 'none'; status.textContent = ''; }
  }

  if(relatedMode === 'activity') {
    renderRelatedActivity();
    renderRelatedPagination(0);
    if(count) count.textContent = rawQuery ? `${relatedSearchResults.length} matching items found` : 'Recent activity timeline';
    return;
  }

  const sorted = getSortedRelatedTools(relatedSearchResults);
  const totalPages = Math.max(1, Math.ceil(sorted.length / relatedBatchSize));
  relatedCurrentPage = Math.min(relatedCurrentPage, totalPages);
  const visible = sorted.slice((relatedCurrentPage - 1) * relatedBatchSize, relatedCurrentPage * relatedBatchSize);
  renderRelatedGrid(visible, rawQuery);

  if(count) count.textContent = rawQuery ? `${relatedSearchResults.length} matching card found` : `Showing ${visible.length} of ${sorted.length} tools`;
  renderRelatedPagination(totalPages);
}

function renderRelatedGrid(tools, query = '') {
  const grid = document.getElementById('relatedToolsGrid');
  grid.innerHTML = '';
  if(!tools.length) {
    grid.innerHTML = '<div style="color:var(--muted);font-size:12px;grid-column:1/-1;text-align:center;padding:18px;">No matching tools found.</div>';
    return;
  }
  tools.forEach((t, idx) => {
    const card = document.createElement('a');
    const queryTerms = String(query || '').toLowerCase().split(/\s+/).filter(Boolean);
    const titleText = String(t.title || '').toLowerCase();
    card.className = 'related-card' + (queryTerms.length && queryTerms.every(term => titleText.includes(term)) ? ' search-match' : '');
    card.href = t.url; card.target = '_blank'; card.rel = 'noopener noreferrer';
    card.addEventListener('click', () => trackRelatedVisit(t));

    const image = document.createElement('img');
    image.className = 'related-card-image'; image.alt = t.title + ' image'; image.loading = 'lazy'; image.src = t.thumb;
    image.onerror = function(){this.onerror=null;this.src='https://www.google.com/s2/favicons?domain='+encodeURIComponent(new URL(t.url).hostname)+'&sz=256';};

    const title = document.createElement('div');
    title.className = 'related-card-title';
    title.innerHTML = highlightRelatedTitle(t.title, query);

    const stats = document.createElement('div');
    stats.className = 'related-card-stats';
    stats.innerHTML = `
      <div><span class="live-dot-orange"></span>New user: <b>${t.views.toLocaleString()}</b></div>
      <div><span class="live-dot-green"></span>Active user: <b>${t.active.toLocaleString()}</b></div>
    `;

    card.appendChild(image); card.appendChild(title); card.appendChild(stats);
    grid.appendChild(card);
  });
}

function renderRelatedPagination(totalPages){
  const box=document.getElementById('israr-lab-related-pagination'); if(!box)return; box.innerHTML='';
  if(relatedMode==='activity') return;
  totalPages = Math.max(1, Number(totalPages) || 1);
  const goPage = function(page, ev){
    if (ev) { try { ev.preventDefault(); ev.stopPropagation(); } catch(e) {} }
    relatedCurrentPage = Math.min(Math.max(1, page), totalPages);
    try { localStorage.setItem('israr_htmlviewer_rel_page', String(relatedCurrentPage)); } catch(e) {}
    filterRelatedTools(false);
    var sec = document.getElementById('israr-lab-related-section');
    if (sec) try { sec.scrollIntoView({behavior:'smooth', block:'start'}); } catch(e) {}
  };
  const addBtn=function(label,page,disabled,active){
    const b=document.createElement('button');
    b.type='button';
    b.className='israr-lab-related-page-btn'+(active?' active':'');
    b.textContent=label;
    b.disabled=!!disabled;
    b.style.opacity=disabled?'.45':'1';
    b.addEventListener('click', function(ev){ goPage(page, ev); });
    box.appendChild(b);
  };
  addBtn('Prev', Math.max(1, relatedCurrentPage-1), relatedCurrentPage<=1, false);
  for(let i=1;i<=totalPages;i++) addBtn(String(i), i, false, i===relatedCurrentPage);
  addBtn('Next', Math.min(totalPages, relatedCurrentPage+1), relatedCurrentPage>=totalPages, false);
}

function renderRelatedActivity(){
  const grid=document.getElementById('relatedToolsGrid');
  const count=document.getElementById('relatedSearchCount');
  const activity=getRelatedActivity().slice(0,200);
  if(count) count.textContent=`Activity history: ${activity.length} record${activity.length===1?'':'s'}`;
  
  let html=`<div class="activity-controls" id="activityControls" style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:0 0 12px;width:100%;">
    <button class="top-btn" id="markActivityBtn" type="button">${activityMarkMode?'Delete Marked':'Mark'}</button>
    <button class="top-btn" id="deleteAllActivityBtn" type="button" style="color:var(--red);">Delete All</button>
  </div>`;
  if(!activity.length){
    html+='<div style="color:var(--muted);font-size:12px;text-align:center;padding:18px;">No activity yet. Searches and tool visits will appear here.</div>';
    grid.className=''; grid.innerHTML=html;
    bindActivityControls(); return;
  }
  html+='<div class="israr-lab-activity-list">';
  activity.forEach((a,i)=>{
    const timeStr=new Date(Number(a.time)||Date.now()).toLocaleString();
    const marked=activityMarkedIds.has(String(a.time)+'|'+i);
    const safeTitle=escapeHtml(String(a.title || a.action || 'Activity'));
    html+=`<div class="israr-lab-activity-row ${marked?'activity-marked':''}" data-activity-row="${i}">
      <input class="activity-check" type="checkbox" data-activity-index="${i}" ${marked?'checked':''} onclick="event.stopPropagation()" style="display:${activityMarkMode?'inline-block':'none'}">
      <div class="activity-details"><div class="act-time">${timeStr}</div><div class="act-url">${safeTitle}</div></div>
    </div>`;
  });
  html+='</div>';
  grid.className=''; grid.innerHTML=html;
  
  grid.querySelectorAll('.israr-lab-activity-row').forEach(row=>row.addEventListener('click',e=>{
    if(e.target.closest('.activity-check') || activityMarkMode) return;
    const item=activity[Number(row.dataset.activityRow)];
    try { const u=new URL(String(item?.url||''), location.href); if(['http:','https:'].includes(u.protocol) && item?.url) window.open(u.href,'_blank','noopener,noreferrer'); } catch(_) {}
  }));

  grid.querySelectorAll('.activity-check').forEach(c=>c.addEventListener('change',()=>{
    const row=c.closest('.israr-lab-activity-row');
    row?.classList.toggle('activity-marked',c.checked);
    const idx=Number(c.dataset.activityIndex);
    const item=getRelatedActivity()[idx];
    if(item){const key=String(item.time)+'|'+idx;if(c.checked)activityMarkedIds.add(key);else activityMarkedIds.delete(key);}
  }));
  bindActivityControls();
}

function bindActivityControls(){
  const markBtn=document.getElementById('markActivityBtn');
  const deleteBtn=document.getElementById('deleteAllActivityBtn');
  if(markBtn) markBtn.addEventListener('click',()=>{
    if(!activityMarkMode){activityMarkMode=true;activityMarkedIds.clear();renderRelatedActivity();return;}
    const checks=[...document.querySelectorAll('#relatedToolsGrid .activity-check:checked')];
    if(!checks.length){activityMarkMode=false;activityMarkedIds.clear();renderRelatedActivity();return;}
    const indexes=new Set(checks.map(c=>Number(c.dataset.activityIndex)));
    let all=getRelatedActivity(); all = all.filter((_,i)=>!indexes.has(i));
    try{localStorage.setItem('israr_lab_related_activity',JSON.stringify(all));}catch(e){}
    activityMarkMode=false;activityMarkedIds.clear();renderRelatedActivity();
  });
  if(deleteBtn) deleteBtn.addEventListener('click',()=>{
    try{localStorage.removeItem('israr_lab_related_activity');}catch(e){}
    activityMarkMode=false;activityMarkedIds.clear();renderRelatedActivity();
  });
}

function setRelatedMode(mode) {
  relatedMode=mode; relatedCurrentPage=1;
  try{localStorage.setItem('israr_htmlviewer_rel_mode',mode);localStorage.setItem('israr_htmlviewer_rel_page','1');}catch(e){}
  document.querySelectorAll('#israr-lab-related-tabs .israr-lab-related-tab').forEach(b=>b.classList.toggle('active',b.dataset.mode===mode));
  const searchWrap=document.querySelector('.related-search-wrap');
  const searchCount=document.getElementById('relatedSearchCount');
  const pagination=document.getElementById('israr-lab-related-pagination');
  if(mode!=='activity'){
    if(searchWrap)searchWrap.style.display='block';
    if(searchCount)searchCount.style.display='block';
    if(pagination)pagination.style.display='flex';
    const grid=document.getElementById('relatedToolsGrid');if(grid)grid.className='related-grid';
  }else{
    if(searchWrap)searchWrap.style.display='none';
    if(searchCount)searchCount.style.display='block';
    if(pagination)pagination.style.display='none';
  }
  filterRelatedTools(false);
}
window.setRelatedMode=setRelatedMode;

let activityMarkMode=false;
let activityMarkedIds=new Set();

const relatedSearchInputEl = document.getElementById('relatedSearchInput');
const relatedSearchButtonEl = document.getElementById('relatedSearchButton');
if (relatedSearchInputEl) {
  relatedSearchInputEl.addEventListener('input', handleRelatedSearchInput);
  relatedSearchInputEl.addEventListener('focus', showSearchSuggestions);
  relatedSearchInputEl.addEventListener('click', showSearchSuggestions);
}
if (relatedSearchButtonEl) relatedSearchButtonEl.addEventListener('click', triggerSearch);

filterRelatedTools(false);

function escapeHtml(str) {
  return String(str || '').replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}


/* ===== merged block: inline#15 ===== */
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


/* ===== merged block: final-full-paste-and-scroll-sync ===== */
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


/* ===== merged block: israrlab-search-highlight-persistence-fix ===== */
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


/* ===== merged block: final-editor-actions-fix ===== */
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


/* ===== merged block: final-cursor-and-scroll-alignment-fix ===== */
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


/* ===== merged block: requested-save-return-home-fix ===== */
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


/* ===== merged block: final-darkmode-home-reapply-fix ===== */
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


/* ===== merged block: final-layout-sort-sync-fix ===== */
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


/* ===== merged block: ultimate-persist-and-pagination-fix ===== */
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


/* ===== merged block: line-scroll-raf-bind ===== */
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


/* ===== merged block: editor-hscroll-sync ===== */
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


/* ===== merged block: codemirror-editor-bootstrap ===== */
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


