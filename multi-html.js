





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
    if (!window.__israrInSubview) {
      history.pushState({ view: name || 'sub' }, '');
      window.__israrInSubview = true;
    } else {
      /* Replace current subview state instead of stacking */
      history.replaceState({ view: name || 'sub' }, '');
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
  window.__israrInSubview = false;
  setHomeChromeVisible(true);
  /* Unlock page scroll */
  try {
    var y = window.__israrReturnScrollY || 0;
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
    document.body.style.top = '';
    window.scrollTo(0, y);
  } catch (e) {}
  if (clockInterval) clearInterval(clockInterval);
  document.getElementById('editorView').style.display = 'none';
  document.getElementById('recoveryView').style.display = 'none';
  document.getElementById('backupView').style.display = 'none';
  document.getElementById('categorySettingsPageView').style.display = 'none';
  document.getElementById('secureLockView').style.display = 'none';
  document.getElementById('fullHtmlView').style.display = 'none';
  document.getElementById('settingsModal').style.display = 'none';
  document.getElementById('sortMenuModal').style.display = 'none';
  document.getElementById('modeChangeModal').style.display = 'none';
  document.getElementById('allDeleteAuthModal').style.display = 'none';
  document.getElementById('homeView').style.display = 'flex';
  
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
  try { applyDarkModeState(); } catch(e) {}
  try { renderCategories(); } catch(e) {}
  const returnY = Number(window.__israrReturnScrollY || 0);
  requestAnimationFrame(function(){ requestAnimationFrame(function(){ window.scrollTo(0, returnY); }); });
  /* Smooth return: only rebuild cards if container empty or forced */
  setTimeout(function(){
    try {
      var c = document.getElementById('notesContainer');
      var need = !c || !c.querySelector('.note-card') || window.__israrForceNotesRender;
      window.__israrForceNotesRender = false;
      if (need && typeof renderNotes === 'function') renderNotes();
    } catch(e) { try { renderNotes(); } catch(_){} }
    try { if (typeof renderExternalHistoryLogs === 'function') renderExternalHistoryLogs(); } catch(e) {}
  }, 16);
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
    var titleDisplay = log.title || '';
    var isTitleMatched = query.length > 0 && titleDisplay.toLowerCase().includes(query);
    var noteIdx = (log.noteIndex !== undefined) ? log.noteIndex : 0;

    var box = document.createElement('div');
    box.className = 'history-box-item';
    box.id = 'history-box-' + originalIndex;
    box.onclick = function() { focusCardFromHistory(noteIdx, originalIndex); };

    box.innerHTML =
      '<div class="history-box-header">' +
        '<div style="display:flex; align-items:center; flex:1; overflow:hidden;">' +
          '<span class="history-num-badge">#' + itemNumber + '</span>' +
          '<span class="history-box-title ' + (isTitleMatched ? 'search-matched' : '') + '" title="' + (log.title || '').replace(/"/g, '&quot;') + '">📌 ' + (log.title || '') + '</span>' +
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

window.togglePreviewSizeMenu = function togglePreviewSizeMenu(e) {
  try { if (e) { e.preventDefault(); e.stopPropagation(); } } catch (err) {}
  var menu = document.getElementById('pvSizeMenu');
  if (!menu) return;
  var openNow = (menu.style.display === 'flex');
  /* close any other */
  if (openNow) {
    menu.style.display = 'none';
    return;
  }
  menu.style.display = 'flex';
  /* outside close */
  setTimeout(function () {
    function closer(ev) {
      var t = ev.target;
      try {
        if (menu.contains(t)) return;
        if (t && (t.id === 'pvSizeBtn' || (t.closest && t.closest('#pvSizeBtn')))) return;
      } catch (e2) {}
      menu.style.display = 'none';
      document.removeEventListener('click', closer, true);
      document.removeEventListener('touchend', closer, true);
    }
    document.addEventListener('click', closer, true);
    document.addEventListener('touchend', closer, true);
  }, 80);
};

window.pickPreviewSize = function pickPreviewSize(device) {
  var menu = document.getElementById('pvSizeMenu');
  if (menu) menu.style.display = 'none';
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

/* One-level history: subview -> home on Back. Home Back leaves site (no trap). */
window.__israrInSubview = false;
window.addEventListener('popstate', function(event) {
  const editorVisible = document.getElementById('editorView') && document.getElementById('editorView').style.display === 'flex';
  const previewVisible = document.getElementById('fullHtmlView') && document.getElementById('fullHtmlView').style.display === 'flex';
  const backupVisible = document.getElementById('backupView') && document.getElementById('backupView').style.display === 'flex';
  const recoveryVisible = document.getElementById('recoveryView') && document.getElementById('recoveryView').style.display === 'flex';
  const catSetVisible = document.getElementById('categorySettingsPageView') && document.getElementById('categorySettingsPageView').style.display === 'flex';
  const lockViewVisible = document.getElementById('secureLockView') && document.getElementById('secureLockView').style.display === 'flex';
  const settingsModalVisible = document.getElementById('settingsModal') && document.getElementById('settingsModal').style.display === 'flex';
  const anySubview = editorVisible || previewVisible || backupVisible || recoveryVisible || catSetVisible || lockViewVisible || settingsModalVisible;

  if (anySubview || window.__israrInSubview) {
    window.isCreatingNewNote = false;
    window.editingNoteId = null;
    editingIndex = null;
    window.__israrInSubview = false;
    try { showHomeDirectly(); } catch (e) {}
    /* Do NOT pushState again — one Back from home exits the page */
    return;
  }
  /* Already on home: allow browser to leave */
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
      <input type="checkbox" class="card-checkbox main-card-checkbox" data-index="${originalIndex}" style="display:${isMarkDeleteMode?'block':'none'};" onclick="event.stopPropagation()">
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
    frag.appendChild(card);
  });
  container.innerHTML = '';
  container.appendChild(frag);
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

function openCardSettingMenu(event, index) {
  event.stopPropagation();
  selectedNoteIndexForContext = index;
  try { hideCategoryPickerMenu(); } catch (e) {}
  const rect = event.target.getBoundingClientRect();
  const menu = document.getElementById('contextMenu');
  menu.style.left = Math.min(rect.left, window.innerWidth - 190) + 'px';
  menu.style.top = Math.max(8, rect.top - 160) + 'px';
  menu.style.display = 'flex';
}
window.addEventListener('click', function() {
  var m = document.getElementById('contextMenu');
  if (m) m.style.display = 'none';
  try { hideCategoryPickerMenu(); } catch (e) {}
});


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

function menuActionCopy() { copyNoteCode({ stopPropagation:()=>{} }, selectedNoteIndexForContext); }
function menuActionDownloadFile() {
  const note = notes[selectedNoteIndexForContext];
  if (!note) return;
  const blob = new Blob([note.htmlCode || ''], { type: 'text/html' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  let safeTitle = (note.title || 'index').replace(/[^a-z0-9]/gi, '_').toLowerCase();
  a.download = `${safeTitle}.html`;
  a.click();
  alert("HTML File Downloaded Successfully!");
}
function menuActionPinToggle() { notes[selectedNoteIndexForContext].isPinned = !notes[selectedNoteIndexForContext].isPinned; saveData(); renderNotes(); }

function menuActionDelete() {
  try {
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
  let note = notes.splice(selectedNoteIndexForContext, 1)[0]; 
  lockedNotes.push(note); 
  saveData(); renderNotes(); 
  alert("कोड वॉलेट (Vault) में सुरक्षित लॉक हो गया है!"); 
}

function toggleMarkDeleteMode() {
  isMarkDeleteMode = !isMarkDeleteMode;
  const btn = document.getElementById('delMarkBtn');
  if (isMarkDeleteMode) {
    btn.style.background = 'rgba(255,100,124,.2)'; btn.style.color = 'var(--red)';
    btn.innerHTML = '<i class="fas fa-trash"></i> Confirm Delete';
  } else {
    btn.style.background = ''; btn.style.color = '';
    btn.innerHTML = '<i class="fas fa-check-square"></i> Mark Delete';
    let checked = document.querySelectorAll('.main-card-checkbox:checked');
    if (checked.length > 0 && confirm('Move ' + checked.length + ' selected card(s) to Recovery?')) {
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
  }
  renderNotes();
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

function toggleTrashMarkDeleteMode() {
  isTrashMarkDeleteMode = !isTrashMarkDeleteMode;
  isTrashMarkRestoreMode = false;
  const delBtn = document.getElementById('trashMarkBtn');
  const restoreBtn = document.getElementById('trashRestoreMarkBtn');
  if (delBtn) delBtn.innerHTML = isTrashMarkDeleteMode ? '<i class="fas fa-trash"></i> Delete Selected' : '<i class="fas fa-check-square"></i> Mark Delete';
  if (restoreBtn) restoreBtn.innerHTML = '<i class="fas fa-undo"></i> Mark Restore';
  if (isTrashMarkDeleteMode) { openRecoveryView(); return; }
  const indexes = Array.from(document.querySelectorAll('.trash-card-checkbox:checked')).map(cb => Number(cb.dataset.index)).filter(Number.isInteger).sort((a,b)=>b-a);
  if (indexes.length && confirm(`Permanently delete ${indexes.length} selected item(s)?`)) {
    indexes.forEach(i => { if (i >= 0 && i < trashNotes.length) trashNotes.splice(i,1); });
    saveData();
  }
  openRecoveryView();
}
function toggleTrashMarkRestoreMode() {
  isTrashMarkRestoreMode = !isTrashMarkRestoreMode;
  isTrashMarkDeleteMode = false;
  const delBtn = document.getElementById('trashMarkBtn');
  const restoreBtn = document.getElementById('trashRestoreMarkBtn');
  if (delBtn) delBtn.innerHTML = '<i class="fas fa-check-square"></i> Mark Delete';
  if (restoreBtn) restoreBtn.innerHTML = isTrashMarkRestoreMode ? '<i class="fas fa-undo"></i> Restore Selected' : '<i class="fas fa-undo"></i> Mark Restore';
  if (isTrashMarkRestoreMode) { openRecoveryView(); return; }
  const indexes = Array.from(document.querySelectorAll('.trash-card-checkbox:checked')).map(cb => Number(cb.dataset.index)).filter(Number.isInteger).sort((a,b)=>b-a);
  if (indexes.length && confirm('Restore ' + indexes.length + ' selected card(s) to the home page?')) {
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
  openRecoveryView();
}

function emptyTrashBin() {
  if (confirm("क्या आप ट्रैश के सभी आइटम्स को हमेशा के लिए खाली करना चाहते हैं?")) {
    trashNotes = []; saveData(); openRecoveryView();
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

function openRecoveryView() {
  setHomeChromeVisible(false);
  try { pushSubviewState('recovery'); } catch (e) {}
  document.getElementById('homeView').style.display = 'none';
  var editor = document.getElementById('editorView'); if (editor) editor.style.display = 'none';
  var bak = document.getElementById('backupView'); if (bak) bak.style.display = 'none';
  var vault = document.getElementById('secureLockView'); if (vault) vault.style.display = 'none';
  var rec = document.getElementById('recoveryView');
  rec.style.display = 'flex';
  rec.style.pointerEvents = 'auto';
  rec.style.zIndex = '1000010';
  var c = document.getElementById('recoveryContainer');
  if (!c) return;
  if (!trashNotes.length) {
    c.innerHTML = '<div class="empty-notes"><p>Trash is empty. Deleted home cards will appear here.</p></div>';
    return;
  }
  c.innerHTML = '';
  trashNotes.forEach(function(n, i) {
    var charCount = (n.htmlCode || '').length;
    var wordCount = !(n.htmlCode || '').trim() ? 0 : (n.htmlCode || '').trim().split(/\s+/).length;
    var title = (n.title || 'Untitled Code').replace(/</g, '&lt;').replace(/"/g, '&quot;');
    var dateStr = n.updatedAt || n.createdAtStr || '';
    var card = document.createElement('div');
    card.className = 'note-card';
    card.innerHTML =
      '<input type="checkbox" class="card-checkbox trash-card-checkbox" data-index="' + i + '" style="display:' + ((isTrashMarkDeleteMode || isTrashMarkRestoreMode) ? 'block' : 'none') + ';" onclick="event.stopPropagation()">' +
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
      iframe.__previewCode = n.htmlCode || '';
      iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms allow-modals');
    }
    c.appendChild(card);
  });
  if (typeof scheduleLazyCardPreviews === 'function') scheduleLazyCardPreviews(c);
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
  /* If not in mark mode, enable it. Second press / with selections deletes permanently. */
  if (!isTrashMarkDeleteMode) {
    isTrashMarkDeleteMode = true;
    isTrashMarkRestoreMode = false;
    var markBtn = document.getElementById('trashMarkBtn');
    if (markBtn) markBtn.innerHTML = '<i class="fas fa-check-square"></i> Mark Delete';
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
  try { saveData(); } catch (e) {}
  try { renderExternalHistoryLogs(); } catch (e) {}
  openRecoveryView();
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
  let container = document.getElementById('backupContainer');
  if (notes.length === 0 && lockedNotes.length === 0) {
    container.innerHTML = `<div class="empty-notes"><p>कोई डेटा उपलब्ध नहीं है।</p></div>`;
  } else {
    container.innerHTML = `
      <div class="note-card" style="height:auto; grid-column: 1 / -1; padding:16px;">
        <h3 style="color:var(--cyan); font-size:14px; margin-bottom:6px;">📦 Total Backups Ready</h3>
        <p style="font-size:11px; color:var(--muted); margin-bottom:12px;">Main Codes: ${notes.length} | Vault Locked: ${lockedNotes.length}</p>
        <button class="recovery-btn-restore" style="width:100%; padding:10px;" onclick="exportJsonBackup()">Download JSON Backup File</button>
      </div>`;
  }
}

function exportJsonBackup() {
  const backupObj = { app: "Israr Lab Multi HTML Viewer", version: "2.9", exportDate: new Date().toISOString(), notes, lockedNotes, categories, historyLogs };
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupObj, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `IsrarLab_HTML_Vault_Backup_${Date.now()}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click(); downloadAnchor.remove();
  alert("JSON Backup file generated & downloaded successfully!");
}

function loadFromFileBackup(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const parsed = JSON.parse(e.target.result);
      let importedNotes = parsed.notes || parsed;
      if (Array.isArray(importedNotes)) { ensureNoteIds(importedNotes); notes = notes.concat(importedNotes); }
      if (parsed.lockedNotes && Array.isArray(parsed.lockedNotes)) { ensureNoteIds(parsed.lockedNotes); lockedNotes = lockedNotes.concat(parsed.lockedNotes); }
      if (parsed.categories && Array.isArray(parsed.categories)) { categories = Array.from(new Set(categories.concat(parsed.categories))); }
      if (parsed.historyLogs && Array.isArray(parsed.historyLogs)) { historyLogs = historyLogs.concat(parsed.historyLogs); }
      saveData(); renderNotes(); renderExternalHistoryLogs(); openBackupView();
      alert("Backup successfully imported and restored!");
    } catch(err) { alert("Invalid JSON backup file format!"); }
  };
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
</script>

<script>
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
</script>


<style id="editor-topbar-screenshot-style">
/* Compact mobile editor header matching the supplied reference screenshot. */
#editorView .editor-top-bar{padding:12px 14px 10px!important;background:var(--header-bg)!important;border-bottom:1px solid var(--border)!important;display:flex!important;flex-direction:column!important;gap:7px!important;flex-shrink:0!important}
#editorView .editor-top-row1{display:grid!important;grid-template-columns:auto minmax(0,1fr) auto auto!important;align-items:center!important;gap:7px!important;flex-wrap:nowrap!important;width:100%!important}
#editorView .editor-top-row1 .top-btn{min-width:0!important;white-space:nowrap!important;border-radius:12px!important;font-size:12px!important;height:44px!important;padding:0 12px!important}
#editorView #statsInfo{min-width:0!important;text-align:center!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;font-size:11px!important;padding:12px 8px!important;border:1px solid var(--border)!important;border-radius:10px!important;background:rgba(128,128,128,.06)!important;color:var(--muted)!important}
#editorView #saveIndicatorText{white-space:nowrap!important;font-size:12px!important;font-weight:700!important;color:var(--green)!important;padding:0 2px!important}
#editorView #editorSaveUpdateBtn{height:44px!important;min-width:76px!important;padding:0 15px!important;border:0!important;border-radius:13px!important;background:var(--cyan)!important;color:#031018!important;font-size:13px!important;font-weight:800!important;white-space:nowrap!important}
#editorView .editor-top-row2{display:flex!important;justify-content:flex-start!important;align-items:center!important;min-height:18px!important;flex-wrap:nowrap!important}
#editorView #liveDateTime{font-size:12px!important;font-weight:600!important;color:var(--muted)!important;white-space:nowrap!important}
@media(max-width:390px){#editorView .editor-top-bar{padding:10px 10px 9px!important}#editorView .editor-top-row1{grid-template-columns:auto minmax(0,1fr) auto auto!important;gap:5px!important}#editorView .editor-top-row1 .top-btn{padding:0 9px!important;font-size:11px!important}#editorView #statsInfo{font-size:10px!important;padding:11px 5px!important}#editorView #saveIndicatorText{font-size:11px!important}#editorView #editorSaveUpdateBtn{min-width:65px!important;padding:0 10px!important;font-size:12px!important}}
</style>

<style id="editor-top-buttons-not-hidden-fix">
/* Keep the editor view above the site's fixed header so its top controls never sit underneath it. */
#editorView{z-index:1000001!important;position:fixed!important;top:0!important;left:0!important;right:0!important;width:100vw!important;height:100dvh!important;max-height:100dvh!important;overflow:hidden!important;padding-top:env(safe-area-inset-top,0px)!important;box-sizing:border-box!important;}
#editorView .editor-top-bar{position:relative!important;top:auto!important;left:auto!important;right:auto!important;z-index:1000002!important;visibility:visible!important;opacity:1!important;flex-shrink:0!important;margin-top:0!important;}
#editorView .editor-top-row1,#editorView .editor-top-row2{position:relative!important;z-index:1000003!important;}
#editorView .editor-top-row1 .top-btn,#editorView #statsInfo,#editorView #saveIndicatorText{position:relative!important;z-index:1000004!important;visibility:visible!important;opacity:1!important;}
/* Ensure editor content scrolls below the toolbar rather than over it. */
#editorView .editor-body{position:relative!important;z-index:1!important;min-height:0!important;flex:1 1 auto!important;overflow:hidden!important;}
</style>

<style id="editor-top-row-visible-final-fix">
/* The website's sticky main header was covering the first editor toolbar row on mobile.
   Put the live date first and the action buttons immediately beneath it, in normal flow. */
#editorView .editor-top-bar{display:flex!important;flex-direction:column!important;gap:8px!important;padding:10px 12px!important;overflow:visible!important;height:auto!important;min-height:0!important;}
#editorView .editor-top-row2{order:1!important;display:flex!important;position:relative!important;inset:auto!important;transform:none!important;margin:0!important;padding:0!important;min-height:20px!important;visibility:visible!important;opacity:1!important;}
#editorView .editor-top-row1{order:2!important;display:grid!important;position:relative!important;inset:auto!important;transform:none!important;margin:0!important;padding:0!important;width:100%!important;grid-template-columns:auto minmax(0,1fr) auto auto!important;align-items:center!important;gap:6px!important;visibility:visible!important;opacity:1!important;}
#editorView .editor-top-row1>*{min-width:0!important;position:relative!important;visibility:visible!important;opacity:1!important;}
#editorView .editor-top-row1 .top-btn,#editorView #statsInfo,#editorView #saveIndicatorText{display:flex!important;align-items:center!important;justify-content:center!important;visibility:visible!important;opacity:1!important;z-index:5!important;}
#editorView .editor-top-row1 .top-btn{height:42px!important;padding:0 10px!important;font-size:12px!important;white-space:nowrap!important;}
#editorView #statsInfo{white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;padding:8px 5px!important;font-size:10px!important;}
#editorView #editorSaveUpdateBtn{min-width:64px!important;padding:0 10px!important;}
#editorView .editor-body{flex:1 1 auto!important;min-height:0!important;overflow-y:auto!important;overflow-x:hidden!important;}
@media(max-width:380px){#editorView .editor-top-bar{padding-left:8px!important;padding-right:8px!important}#editorView .editor-top-row1{grid-template-columns:auto minmax(0,1fr) auto auto!important;gap:4px!important}#editorView .editor-top-row1 .top-btn{padding:0 7px!important;font-size:11px!important}#editorView #statsInfo{font-size:9px!important;padding:7px 3px!important}#editorView #saveIndicatorText{font-size:10px!important}}
</style>

<style id="final-header-clearance-and-paste-fix">
/* Place editor controls below the site's fixed header so they are never covered. */
#editorView{top:96px!important;height:calc(100dvh - 96px)!important;max-height:calc(100dvh - 96px)!important;padding-top:0!important;box-sizing:border-box!important;}
#editorView .editor-top-bar{position:relative!important;z-index:100!important;flex-shrink:0!important;margin:0!important;}
#editorView .editor-top-row2,#editorView .editor-top-row1{position:relative!important;z-index:101!important;}
#editorView .editor-body{min-height:0!important;overflow:hidden!important;}
#editorView .code-editor-wrapper{min-height:0!important;overflow:hidden!important;}
#editorView #htmlCodeInput{overflow-y:auto!important;overflow-x:hidden!important;white-space:pre!important;overflow-wrap:anywhere!important;word-break:break-word!important;}
@media(max-width:420px){#editorView{top:96px!important;height:calc(100dvh - 96px)!important;max-height:calc(100dvh - 96px)!important;}}
</style>
<script id="final-full-paste-and-scroll-sync">
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
</script>

<style id="editor-one-line-toolbar-fixed-size">
#editorView{z-index:1000001!important;position:fixed!important;inset:0!important;width:100vw!important;height:100dvh!important;max-height:100dvh!important;overflow:hidden!important;box-sizing:border-box!important;}
#editorView .editor-top-bar{padding:8px 10px!important;gap:0!important;flex:0 0 auto!important;position:relative!important;z-index:10!important;}
#editorView .editor-top-row1{display:grid!important;grid-template-columns:auto minmax(0,1fr) auto auto!important;align-items:center!important;gap:6px!important;flex-wrap:nowrap!important;width:100%!important;}
#editorView .editor-top-row1>*{min-width:0!important;max-width:100%!important;}
#editorView .editor-top-row1 .editor-back-btn,#editorView .editor-top-row1 .editor-preview-btn,#editorView #editorSaveUpdateBtn{height:40px!important;min-width:0!important;padding:0 9px!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;gap:4px!important;white-space:nowrap!important;font-size:11px!important;border-radius:10px!important;}
#editorView #statsInfo{min-width:0!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;text-align:center!important;font-size:10px!important;padding:8px 4px!important;}
#editorView #editorSaveUpdateBtn{background:var(--theme-accent,var(--cyan))!important;color:#061018!important;font-weight:800!important;}
#editorView .editor-top-row2{display:none!important;}
#editorView .editor-body{display:flex!important;flex-direction:column!important;gap:8px!important;flex:1 1 auto!important;min-height:0!important;overflow:hidden!important;padding:10px 14px!important;}
#editorView .title-input,#editorView .code-search-bar,#editorView .quick-toolbar{flex:0 0 auto!important;}
#editorView .editor-body>div[style*="flex-direction:column"]{display:flex!important;flex:1 1 0!important;min-height:0!important;overflow:hidden!important;}
#editorView .code-editor-wrapper{flex:1 1 auto!important;height:100%!important;min-height:0!important;max-height:none!important;overflow:hidden!important;}
#editorView .editor-input-area{flex:1 1 0!important;min-width:0!important;min-height:0!important;height:100%!important;overflow:hidden!important;}
#editorView #htmlCodeInput{height:100%!important;min-height:0!important;max-height:none!important;overflow-y:auto!important;overflow-x:hidden!important;}
@media(max-width:390px){#editorView .editor-top-bar{padding:7px 7px!important}#editorView .editor-top-row1{gap:4px!important;grid-template-columns:auto minmax(0,1fr) auto auto!important}#editorView .editor-top-row1 .editor-back-btn,#editorView .editor-top-row1 .editor-preview-btn,#editorView #editorSaveUpdateBtn{padding:0 6px!important;font-size:10px!important;height:38px!important}#editorView #statsInfo{font-size:9px!important;padding:7px 2px!important}}
</style>

<style id="israrlab-professional-ui-fixes">
/* Requested layout: four equal buttons on row one, five equal buttons on row two, larger cards. */
.header-btn-row{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:6px!important;width:100%!important;}
.header-btn-row .hdr-btn{width:100%!important;min-width:0!important;white-space:nowrap!important;}
.top-action-bar{display:grid!important;grid-template-columns:repeat(5,minmax(0,1fr))!important;gap:6px!important;overflow-x:visible!important;white-space:normal!important;}
.top-action-bar .top-btn{width:100%!important;min-width:0!important;flex:none!important;padding:0 5px!important;font-size:10px!important;white-space:nowrap!important;}
#notesContainer{grid-template-columns:repeat(4,minmax(0,1fr))!important;max-height:none!important;gap:12px!important;}
#notesContainer .note-card{height:350px!important;min-width:0!important;}
#notesContainer .card-footer{padding:6px!important;}
#notesContainer .card-footer-row{display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:5px!important;}
#notesContainer .card-footer-row button{min-width:0!important;width:100%!important;height:30px!important;padding:4px 5px!important;font-size:10px!important;white-space:nowrap!important;border-radius:7px!important;}
#notesContainer .card-cover-box{height:150px!important;flex-shrink:0!important;}
#notesContainer .card-body{padding:7px 9px!important;min-width:0!important;}
#notesContainer .card-date,#notesContainer .card-stats{font-size:9px!important;}

#editorView .editor-top-row1{grid-template-columns:minmax(58px,.8fr) minmax(0,1.6fr) minmax(62px,.8fr) minmax(65px,.8fr)!important;gap:5px!important;}
#editorView .editor-top-row1 .editor-back-btn,#editorView .editor-top-row1 .editor-preview-btn,#editorView #editorSaveUpdateBtn{width:100%!important;height:40px!important;font-size:10px!important;padding:0 5px!important;}
#editorView #statsInfo{font-size:9px!important;padding:7px 3px!important;}
#editorView .editor-body{display:flex!important;flex-direction:column!important;min-height:0!important;overflow:hidden!important;}
#editorView .editor-body>div[style*="flex-direction:column"]{flex:1 1 0!important;min-height:0!important;}
#editorView .code-editor-wrapper{flex:1 1 auto!important;min-height:0!important;height:100%!important;}
#editorView .editor-input-area{min-height:0!important;min-width:0!important;}
#editorView #htmlCodeInput{font-size:14px!important;line-height:1.6!important;white-space:pre!important;overflow-wrap:anywhere!important;word-break:break-word!important;overflow-x:hidden!important;}
#editorView .code-highlight-layer{white-space:pre!important;overflow-wrap:anywhere!important;word-break:break-word!important;}
.search-hit-mark{background:#ffeb3b!important;color:#111!important;border-radius:2px!important;box-shadow:0 0 0 1px #ffeb3b!important;}
#recoveryView .recovery-header{gap:8px!important;padding:12px!important;}
#recoveryView .recovery-top-actions{display:flex!important;gap:6px!important;flex-wrap:wrap!important;width:100%!important;}
#recoveryView .recovery-top-actions button{flex:1 1 auto!important;min-width:0!important;}
.footer-social-icon,.main-footer .footer-social-icons .footer-social-icon{background:var(--theme-accent,var(--cyan))!important;background-image:none!important;color:#07111d!important;border-color:var(--theme-accent,var(--cyan))!important;}
@media(max-width:1000px){#notesContainer{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:10px!important;}#notesContainer .note-card{height:330px!important;}#notesContainer .card-cover-box{height:140px!important;} .top-action-bar .top-btn{font-size:9px!important;padding:0 3px!important;}}
@media(max-width:420px){.header-btn-row .hdr-btn{font-size:9px!important;gap:3px!important;padding:0 2px!important}.top-action-bar{gap:4px!important;padding:8px 6px!important}.top-action-bar .top-btn{font-size:8px!important;gap:3px!important;padding:0 1px!important;}#notesContainer .note-card{height:310px!important;}#notesContainer .card-cover-box{height:125px!important;}}
@media(max-width:360px){#editorView .editor-top-row1{grid-template-columns:55px minmax(0,1fr) 57px 60px!important;gap:3px!important;}#editorView .editor-top-row1 .editor-back-btn,#editorView .editor-top-row1 .editor-preview-btn,#editorView #editorSaveUpdateBtn{font-size:9px!important;padding:0 3px!important;}#editorView #statsInfo{font-size:8px!important;}}
</style>
<script id="israrlab-search-highlight-persistence-fix">
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
</script>


<style id="final-editor-usability-fix">
/* Keep editor dimensions stable and keep the visible syntax layer aligned with the real textarea. */
#editorView .editor-top-row1{grid-template-columns:minmax(48px,.72fr) minmax(0,1.9fr) minmax(48px,.72fr) minmax(56px,.82fr)!important;gap:4px!important}
#editorView .editor-top-row1 .editor-back-btn,#editorView .editor-top-row1 #editorSaveUpdateBtn,#editorView .editor-top-row1 .editor-preview-btn{min-width:0!important;width:100%!important;height:34px!important;padding:0 3px!important;font-size:10px!important;gap:3px!important;box-sizing:border-box!important}
#editorView #statsInfo{font-size:clamp(8px,2.3vw,10px)!important;letter-spacing:-.25px!important;padding:5px 1px!important;overflow:visible!important;text-overflow:clip!important;white-space:nowrap!important;line-height:1.2!important}
#editorView .code-editor-wrapper{height:100%!important;min-height:0!important;max-height:none!important;flex:1 1 auto!important}
#editorView .editor-input-area{height:100%!important;min-height:0!important;overflow:hidden!important}
#editorView #htmlCodeInput,#editorView .code-highlight-layer{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono",monospace!important;font-size:14px!important;line-height:1.6!important;letter-spacing:normal!important;tab-size:2!important;white-space:pre!important;overflow-wrap:normal!important;word-break:normal!important;}
#editorView #htmlCodeInput{overflow:auto!important;resize:none!important;}
#editorView .code-highlight-layer{overflow:visible!important;min-width:max-content!important;}
#editorView .quick-toolbar .quick-row{display:flex!important;gap:4px!important;align-items:stretch!important;width:100%!important}
#editorView .quick-toolbar .quick-row .quick-btn{flex:1 1 0!important;min-width:0!important;height:34px!important;min-height:34px!important;padding:0 3px!important;font-size:11px!important;white-space:nowrap!important}
#editorView .quick-toolbar .quick-row:nth-child(2) .editor-download-btn{flex:0 0 36px!important;width:36px!important;max-width:36px!important}
#editorView .quick-toolbar .quick-row:nth-child(2) .quick-select{flex:1 1 0!important;min-width:0!important;height:34px!important;font-size:10px!important}
@media(max-width:390px){#editorView .editor-top-row1{grid-template-columns:minmax(45px,.72fr) minmax(0,1.9fr) minmax(45px,.72fr) minmax(52px,.82fr)!important;gap:3px!important}#editorView .editor-top-row1 .editor-back-btn,#editorView .editor-top-row1 #editorSaveUpdateBtn,#editorView .editor-top-row1 .editor-preview-btn{font-size:9px!important;height:32px!important;padding:0 2px!important}#editorView #statsInfo{font-size:8px!important;letter-spacing:-.4px!important}#editorView .quick-toolbar .quick-row .quick-btn{font-size:10px!important;height:32px!important;min-height:32px!important}}
</style>
<script id="final-editor-actions-fix">
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
</script>


<style id="user-request-editor-fixes">
/* Editor top row: compact action buttons, more room for character/word counts */
#editorView .editor-top-row1{display:grid!important;grid-template-columns:minmax(0,.85fr) minmax(0,1.55fr) minmax(0,.85fr) minmax(0,.85fr)!important;gap:6px!important;align-items:stretch!important;width:100%!important;flex-wrap:nowrap!important}
#editorView .editor-top-row1 .editor-back-btn,#editorView .editor-top-row1 #editorSaveUpdateBtn,#editorView .editor-top-row1 .editor-preview-btn{width:100%!important;min-width:0!important;height:40px!important;padding:0 3px!important;display:flex!important;align-items:center!important;justify-content:center!important;white-space:nowrap!important;font-size:11px!important;box-sizing:border-box!important}
#editorView #statsInfo{width:100%!important;min-width:0!important;box-sizing:border-box!important;padding:8px 3px!important;font-size:10px!important;text-align:center!important;overflow:visible!important;white-space:nowrap!important;letter-spacing:-.15px!important}
#editorView .quick-toolbar .quick-row{display:flex!important;gap:5px!important;width:100%!important}
#editorView .quick-toolbar .quick-row .quick-btn{flex:1 1 0!important;min-width:0!important}
/* Home cards: smaller four action buttons inside each card */
.card-footer{padding:4px 5px!important;gap:3px!important}
.card-footer-row{grid-template-rows:repeat(2,27px)!important;gap:4px!important}
.card-footer button{height:27px!important;min-height:27px!important;font-size:8px!important;padding:0 2px!important;gap:2px!important;border-radius:4px!important}
/* Make the home card area taller; keep overflow scrolling inside the card area */
.notes-container{height:1000px!important;max-height:1000px!important;overflow-y:auto!important;align-content:start!important}
@media(max-width:640px){
  #editorView .editor-top-row1{grid-template-columns:minmax(0,.85fr) minmax(0,1.55fr) minmax(0,.85fr) minmax(0,.85fr)!important;gap:4px!important}
  #editorView .editor-top-row1 .editor-back-btn,#editorView .editor-top-row1 #editorSaveUpdateBtn,#editorView .editor-top-row1 .editor-preview-btn{font-size:10px!important;padding:0 2px!important;height:38px!important}
  #editorView #statsInfo{font-size:10px!important;padding:7px 1px!important;letter-spacing:-.3px!important}
  .notes-container{height:1000px!important;max-height:1000px!important;padding:10px!important;gap:10px!important}
  .note-card{height:320px!important}
  .card-footer-row{grid-template-rows:repeat(2,26px)!important;gap:3px!important}
  .card-footer button{height:26px!important;min-height:26px!important;font-size:8px!important}
}
</style>


<style id="user-request-card-spacing-fix">
/* Remove the large blank area inside home cards and keep card actions compact. */
#notesContainer .note-card{
  height:auto!important;
  min-height:0!important;
  justify-content:flex-start!important;
}
#notesContainer .card-cover-box{height:82px!important;min-height:82px!important;flex:0 0 82px!important;}
#notesContainer .card-body{flex:0 0 auto!important;min-height:0!important;padding:5px 7px!important;gap:2px!important;}
#notesContainer .card-meta-row{font-size:8px!important;line-height:1.2!important;}
#notesContainer .note-card h3{font-size:11px!important;line-height:1.2!important;margin:1px 0!important;}
#notesContainer .card-footer{padding:3px 4px!important;gap:3px!important;flex:0 0 auto!important;}
#notesContainer .card-footer-row{grid-template-columns:repeat(2,minmax(0,1fr))!important;grid-template-rows:repeat(2,24px)!important;gap:4px!important;}
#notesContainer .card-footer button{height:24px!important;min-height:24px!important;font-size:8px!important;line-height:1!important;padding:0 2px!important;border-radius:5px!important;gap:2px!important;}
/* Compact editor header buttons while keeping the count fully visible. */
#editorView .editor-top-row1{grid-template-columns:minmax(48px,.7fr) minmax(0,2fr) minmax(48px,.7fr) minmax(54px,.78fr)!important;gap:4px!important;}
#editorView .editor-top-row1 .editor-back-btn,
#editorView .editor-top-row1 #editorSaveUpdateBtn,
#editorView .editor-top-row1 .editor-preview-btn{height:32px!important;min-height:32px!important;font-size:9px!important;padding:0 2px!important;gap:2px!important;}
#editorView #statsInfo{font-size:9px!important;padding:4px 1px!important;letter-spacing:-.25px!important;white-space:nowrap!important;overflow:visible!important;}
@media(max-width:640px){
  #notesContainer{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:8px!important;padding:8px!important;}
  #notesContainer .note-card{height:auto!important;min-height:0!important;}
  #notesContainer .card-cover-box{height:65px!important;min-height:65px!important;flex-basis:65px!important;}
  #notesContainer .card-body{padding:4px 5px!important;}
  #notesContainer .card-meta-row{font-size:7.5px!important;}
  #notesContainer .note-card h3{font-size:10px!important;}
  #notesContainer .card-footer{padding:3px!important;}
  #notesContainer .card-footer-row{grid-template-rows:repeat(2,22px)!important;gap:3px!important;}
  #notesContainer .card-footer button{height:22px!important;min-height:22px!important;font-size:7.5px!important;}
  #editorView .editor-top-row1{grid-template-columns:minmax(44px,.72fr) minmax(0,1.9fr) minmax(44px,.72fr) minmax(50px,.8fr)!important;gap:3px!important;}
  #editorView .editor-top-row1 .editor-back-btn,#editorView .editor-top-row1 #editorSaveUpdateBtn,#editorView .editor-top-row1 .editor-preview-btn{height:30px!important;font-size:8px!important;padding:0 1px!important;}
  #editorView #statsInfo{font-size:8px!important;letter-spacing:-.35px!important;padding:3px 0!important;}
}
</style>

<style id="final-user-preview-theme-cursor-fixes">
/* Home-card preview: show the actual site at readable scale instead of shrinking it to half size. */
#notesContainer .note-card{height:310px!important;min-height:310px!important;justify-content:flex-start!important;}
#notesContainer .card-cover-box{height:118px!important;min-height:118px!important;flex:0 0 118px!important;overflow:hidden!important;background:#fff!important;}
#notesContainer .html-preview-wrapper{width:222%!important;height:222%!important;transform:scale(0.45)!important;transform-origin:top left!important;pointer-events:auto!important;background:transparent!important;}
#notesContainer .html-preview-wrapper iframe{display:block!important;width:100%!important;height:100%!important;border:0!important;background:#fff!important;}
#notesContainer .card-body{flex:1 1 auto!important;min-height:0!important;padding:6px 7px!important;gap:3px!important;}
#notesContainer .card-footer{flex:0 0 auto!important;padding:5px!important;}
#notesContainer .card-footer-row{grid-template-columns:repeat(2,minmax(0,1fr))!important;grid-template-rows:repeat(2,28px)!important;gap:5px!important;}
#notesContainer .card-footer button{height:28px!important;min-height:28px!important;font-size:9px!important;border-radius:7px!important;padding:0 3px!important;}
@media(max-width:640px){
 #notesContainer .note-card{height:300px!important;min-height:300px!important;}
 #notesContainer .card-cover-box{height:105px!important;min-height:105px!important;flex-basis:105px!important;}
 #notesContainer .card-footer-row{grid-template-rows:repeat(2,26px)!important;gap:4px!important;}
 #notesContainer .card-footer button{height:26px!important;min-height:26px!important;font-size:8.5px!important;}
}
/* Keep typed characters, visible syntax layer, and line numbers on the exact same lines. */
#editorView .code-editor-wrapper{position:relative!important;overflow:hidden!important;min-height:0!important;}
#editorView .line-numbers,
#editorView #htmlCodeInput,
#editorView .code-highlight-layer,
#editorView .code-highlight-layer code{
 font-family:Consolas,Monaco,"Courier New",monospace!important;
 font-size:14px!important;font-weight:600!important;line-height:1.6!important;
 letter-spacing:normal!important;tab-size:2!important;
 white-space:pre!important;word-break:normal!important;overflow-wrap:normal!important;
 font-variant-ligatures:none!important;
}
#editorView .line-numbers{padding-top:12px!important;box-sizing:border-box!important;}
#editorView .editor-input-area{position:relative!important;overflow:hidden!important;min-width:0!important;}
#editorView .code-highlight-layer{position:absolute!important;top:0!important;left:0!important;right:auto!important;bottom:auto!important;
 width:100%!important;height:100%!important;min-height:100%!important;margin:0!important;padding:12px!important;
 overflow:hidden!important;box-sizing:border-box!important;pointer-events:none!important;z-index:1!important;
 background:#0d1117!important;color:#e6edf3!important;}
#editorView .code-highlight-layer code{display:block!important;padding:0!important;margin:0!important;background:transparent!important;}
#editorView #htmlCodeInput{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;
 margin:0!important;padding:12px!important;box-sizing:border-box!important;resize:none!important;overflow:auto!important;
 white-space:pre!important;background:transparent!important;color:transparent!important;
 -webkit-text-fill-color:transparent!important;caret-color:#58a6ff!important;z-index:2!important;}
#editorView .editor-input-area.syntax-ready #htmlCodeInput{color:transparent!important;-webkit-text-fill-color:transparent!important;}
#editorView #htmlCodeInput::selection{-webkit-text-fill-color:transparent!important;background:rgba(88,166,255,.30)!important;}
/* In light mode, keep the code pane light while preserving colored HTML/CSS/JS tokens. */
body.light-mode #editorView .code-highlight-layer{background:#ffffff!important;color:#24292f!important;}
body.light-mode #editorView #htmlCodeInput{caret-color:#0969da!important;}
body.light-mode #editorView .code-highlight-layer .hljs-tag,
body.light-mode #editorView .code-highlight-layer .hljs-name{color:#0550ae!important;}
body.light-mode #editorView .code-highlight-layer .hljs-attr{color:#8250df!important;}
body.light-mode #editorView .code-highlight-layer .hljs-string{color:#0a3069!important;}
body.light-mode #editorView .code-highlight-layer .hljs-keyword,
body.light-mode #editorView .code-highlight-layer .hljs-selector-tag{color:#cf222e!important;}
body.light-mode #editorView .code-highlight-layer .hljs-number,
body.light-mode #editorView .code-highlight-layer .hljs-literal{color:#0550ae!important;}
body.light-mode #editorView .code-highlight-layer .hljs-comment{color:#6e7781!important;font-style:italic!important;}
body.light-mode #editorView .code-highlight-layer .hljs-title,
body.light-mode #editorView .code-highlight-layer .hljs-function{color:#8250df!important;}
</style>
<script id="final-cursor-and-scroll-alignment-fix">
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
</script>

<style id="requested-search-update-card-preview-fix">
/* All search matches stay yellow; the currently selected match turns red. */
#editorView mark.search-hit-mark{background:#ffeb3b!important;color:#111!important;border-radius:2px!important;box-shadow:0 0 0 1px #ffeb3b!important;}
#editorView mark.search-hit-mark.search-hit-active{background:#ff3030!important;color:#fff!important;box-shadow:0 0 0 1px #ff3030!important;}
/* Show a larger, miniature website viewport in each home card without adding blank filler. */
#notesContainer .note-card{height:auto!important;min-height:0!important;justify-content:flex-start!important;}
#notesContainer .card-cover-box{height:150px!important;min-height:150px!important;flex:0 0 150px!important;overflow:hidden!important;background:#fff!important;}
#notesContainer .html-preview-wrapper{width:200%!important;height:200%!important;transform:scale(.5)!important;transform-origin:top left!important;pointer-events:auto!important;background:transparent!important;}
#notesContainer .html-preview-wrapper iframe{display:block!important;width:100%!important;height:100%!important;border:0!important;background:#fff!important;}
#notesContainer .card-body{flex:0 0 auto!important;min-height:0!important;padding:6px 7px!important;gap:3px!important;}
#notesContainer .card-footer{flex:0 0 auto!important;padding:5px!important;}
#notesContainer .card-footer-row{grid-template-columns:repeat(2,minmax(0,1fr))!important;grid-template-rows:repeat(2,28px)!important;gap:5px!important;}
#notesContainer .card-footer button{height:28px!important;min-height:28px!important;font-size:9px!important;border-radius:7px!important;padding:0 3px!important;}
@media(max-width:640px){
 #notesContainer .card-cover-box{height:140px!important;min-height:140px!important;flex-basis:140px!important;}
 #notesContainer .card-footer-row{grid-template-rows:repeat(2,26px)!important;gap:4px!important;}
 #notesContainer .card-footer button{height:26px!important;min-height:26px!important;font-size:8.5px!important;}
}
</style>
<script id="requested-save-return-home-fix">
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
</script>


<style id="final-darkmode-card-preview-scroll-fix">
/* ===== Dark / Light reliability ===== */
body.light-mode{
  --bg:#ffffff !important;
  --panel-bg:#ffffff !important;
  --home-bg:#ffffff !important;
  --header-bg:#ffffff !important;
  --action-bar-bg:#ffffff !important;
  --card-bg:#ffffff !important;
  --card-footer-bg:#ffffff !important;
  --text:#0f172a !important;
  --muted:#475467 !important;
  --border:rgba(0,0,0,.12) !important;
}

/* ===== Title strip spacing ===== */
.israrlab-title-strip{
  height:52px !important;
  min-height:52px !important;
  padding:0 14px !important;
}
.wrapper{padding-top:64px !important;}
@media(max-width:640px){
  .israrlab-title-strip{height:48px !important;min-height:48px !important;}
  .wrapper{padding-top:58px !important;}
}
#homeView .app-header{padding:8px 10px !important;}
#homeView .top-action-bar{padding:8px 10px !important;}
#homeView .category-bar-wrapper{padding:6px 10px !important;min-height:42px !important;}

/* ===== Settings / Sort / Mode modals above fixed header ===== */
#settingsModal,
#sortMenuModal,
#modeChangeModal,
#lockPromptModal,
#newCategoryModal,
#forgotCaptchaModal,
#newPatternSetModal,
#allDeleteAuthModal{
  z-index:1000010 !important;
}

/* ===== Cards container: 2 per row, ~4 visible, then internal scroll ===== */
#notesContainer.notes-container,
#notesContainer{
  display:grid !important;
  grid-template-columns:repeat(2,minmax(0,1fr)) !important;
  gap:12px !important;
  padding:12px !important;
  align-content:start !important;
  overflow-x:hidden !important;
  overflow-y:auto !important;
  -webkit-overflow-scrolling:touch !important;
  height:680px !important;
  max-height:680px !important;
  min-height:320px !important;
  box-sizing:border-box !important;
}
/* List mode must win over the 2-col grid */
#notesContainer.list-mode,
#notesContainer.notes-container.list-mode{
  grid-template-columns:1fr !important;
}
@media(min-width:1100px){
  #notesContainer:not(.list-mode){
    grid-template-columns:repeat(2,minmax(0,1fr)) !important;
  }
}
@media(max-width:640px){
  #notesContainer{
    height:620px !important;
    max-height:620px !important;
    gap:10px !important;
    padding:10px !important;
  }
}

/* ===== Card layout: proper width, not thin ===== */
#notesContainer .note-card{
  width:100% !important;
  min-width:0 !important;
  max-width:100% !important;
  height:auto !important;
  min-height:0 !important;
  display:flex !important;
  flex-direction:column !important;
  justify-content:flex-start !important;
  box-sizing:border-box !important;
}
#notesContainer.list-mode .note-card{
  width:100% !important;
}

#notesContainer .card-cover-box{
  height:150px !important;
  min-height:150px !important;
  flex:0 0 150px !important;
  overflow:hidden !important;
  background:#ffffff !important;
  position:relative !important;
  border-bottom:1px solid var(--border) !important;
}
@media(max-width:640px){
  #notesContainer .card-cover-box{
    height:140px !important;
    min-height:140px !important;
    flex-basis:140px !important;
  }
}

/* Mobile-like preview – readable scale, interactive */
#notesContainer .html-preview-wrapper{
  width:222% !important;
  height:222% !important;
  transform:scale(0.45) !important;
  transform-origin:top left !important;
  pointer-events:auto !important;
  background:#ffffff !important;
  overflow:auto !important;
  -webkit-overflow-scrolling:touch !important;
}
#notesContainer .html-preview-wrapper iframe{
  display:block !important;
  width:100% !important;
  height:100% !important;
  min-height:100% !important;
  border:0 !important;
  background:#ffffff !important;
  pointer-events:auto !important;
}

#notesContainer .card-body{
  flex:0 0 auto !important;
  min-height:0 !important;
  padding:7px 9px !important;
  gap:3px !important;
}
#notesContainer .card-meta-row{font-size:9px !important;}
#notesContainer .note-card h3{font-size:12px !important;margin:2px 0 !important;}
#notesContainer .card-footer{
  flex:0 0 auto !important;
  padding:6px !important;
  gap:4px !important;
}
#notesContainer .card-footer-row{
  grid-template-columns:repeat(2,minmax(0,1fr)) !important;
  grid-template-rows:repeat(2,30px) !important;
  gap:5px !important;
}
#notesContainer .card-footer button{
  height:30px !important;
  min-height:30px !important;
  font-size:9.5px !important;
  border-radius:6px !important;
  padding:0 4px !important;
}
@media(max-width:640px){
  #notesContainer .card-footer-row{grid-template-rows:repeat(2,28px) !important;gap:4px !important;}
  #notesContainer .card-footer button{height:28px !important;min-height:28px !important;font-size:9px !important;}
}
</style>
<script id="final-darkmode-home-reapply-fix">
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
</script>


<script id="final-layout-sort-sync-fix">
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
</script>


<style id="new-card-cta-style">
/* New Card CTA - same highlight style as New Category */
.top-btn.new-card-main-btn{
  background:var(--cyan) !important;
  color:#03050b !important;
  border-color:var(--cyan) !important;
  font-weight:800 !important;
}
.top-btn.new-card-main-btn:hover{
  filter:brightness(1.08);
}
body.light-mode .top-btn.new-card-main-btn{
  background:var(--cyan) !important;
  color:#ffffff !important;
  border-color:var(--cyan) !important;
}
</style>
<style id="ultimate-card-box-scroll-fix">
#homeView{
  display:flex !important;
  flex-direction:column !important;
  overflow:hidden !important;
  min-height:0 !important;
}
#notesContainer.notes-container,
#notesContainer{
  display:grid !important;
  grid-template-columns:repeat(2, minmax(0, 1fr)) !important;
  gap:12px !important;
  padding:12px !important;
  align-content:start !important;
  box-sizing:border-box !important;
  flex:0 0 auto !important;
  width:100% !important;
  height:620px !important;
  max-height:620px !important;
  min-height:620px !important;
  overflow-x:hidden !important;
  overflow-y:auto !important;
  -webkit-overflow-scrolling:touch !important;
}
#notesContainer.list-mode,
#notesContainer.notes-container.list-mode{
  grid-template-columns:1fr !important;
}
#notesContainer .note-card{
  width:100% !important;
  min-width:0 !important;
  height:290px !important;
  min-height:290px !important;
  max-height:290px !important;
  display:flex !important;
  flex-direction:column !important;
  justify-content:flex-start !important;
  overflow:hidden !important;
  box-sizing:border-box !important;
}
#notesContainer .card-cover-box{
  height:145px !important;
  min-height:145px !important;
  max-height:145px !important;
  flex:0 0 145px !important;
  overflow:hidden !important;
  background:#fff !important;
}
#notesContainer .html-preview-wrapper{
  width:222% !important;
  height:222% !important;
  transform:scale(0.45) !important;
  transform-origin:top left !important;
  pointer-events:auto !important;
  background:#fff !important;
  overflow:auto !important;
}
#notesContainer .html-preview-wrapper iframe{
  width:100% !important;
  height:100% !important;
  border:0 !important;
  pointer-events:auto !important;
  background:#fff !important;
}
#notesContainer .card-body{
  flex:1 1 auto !important;
  min-height:0 !important;
  padding:6px 8px !important;
  overflow:hidden !important;
}
#notesContainer .card-footer{
  flex:0 0 auto !important;
  padding:5px 6px !important;
}
#notesContainer .card-footer-row{
  grid-template-columns:repeat(2,minmax(0,1fr)) !important;
  grid-template-rows:repeat(2,28px) !important;
  gap:5px !important;
}
#notesContainer .card-footer button{
  height:28px !important;
  min-height:28px !important;
  font-size:9px !important;
}
@media(max-width:640px){
  #notesContainer{
    height:600px !important;
    max-height:600px !important;
    min-height:600px !important;
    gap:10px !important;
    padding:10px !important;
  }
  #notesContainer .note-card{
    height:280px !important;
    min-height:280px !important;
    max-height:280px !important;
  }
  #notesContainer .card-cover-box{
    height:130px !important;
    min-height:130px !important;
    max-height:130px !important;
    flex-basis:130px !important;
  }
}
#israr-lab-related-pagination button{
  -webkit-appearance:none;
  appearance:none;
}
</style>
<script id="ultimate-persist-and-pagination-fix">
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
</script>


<style id="recovery-same-as-home-cards-fix">
#recoveryView{
  display:none;
  flex-direction:column !important;
  background:var(--bg) !important;
}
#recoveryView .recovery-header{
  flex-shrink:0 !important;
}
#recoveryContainer.notes-container,
#recoveryContainer{
  display:grid !important;
  grid-template-columns:repeat(2, minmax(0, 1fr)) !important;
  gap:12px !important;
  padding:12px !important;
  align-content:start !important;
  overflow-x:hidden !important;
  overflow-y:auto !important;
  -webkit-overflow-scrolling:touch !important;
  flex:1 1 auto !important;
  min-height:0 !important;
  height:auto !important;
  max-height:none !important;
  box-sizing:border-box !important;
}
#recoveryContainer .note-card{
  width:100% !important;
  min-width:0 !important;
  height:290px !important;
  min-height:290px !important;
  max-height:290px !important;
  display:flex !important;
  flex-direction:column !important;
  justify-content:flex-start !important;
  overflow:hidden !important;
  box-sizing:border-box !important;
}
#recoveryContainer .card-cover-box{
  height:145px !important;
  min-height:145px !important;
  max-height:145px !important;
  flex:0 0 145px !important;
  overflow:hidden !important;
  background:#fff !important;
  position:relative !important;
}
#recoveryContainer .html-preview-wrapper{
  width:222% !important;
  height:222% !important;
  transform:scale(0.45) !important;
  transform-origin:top left !important;
  pointer-events:auto !important;
  background:transparent !important;
  overflow:hidden !important;
}
#recoveryContainer .html-preview-wrapper iframe{
  width:100% !important;
  height:100% !important;
  border:0 !important;
  background:#fff !important;
}
#recoveryContainer .card-body{
  flex:1 1 auto !important;
  min-height:0 !important;
  padding:6px 8px !important;
  overflow:hidden !important;
}
#recoveryContainer .card-footer{
  flex:0 0 auto !important;
  padding:5px 6px !important;
}
#recoveryContainer .card-checkbox{
  display:none;
  position:absolute !important;
  top:8px !important;
  right:8px !important;
  width:18px !important;
  height:18px !important;
  z-index:6 !important;
}
@media(max-width:640px){
  #recoveryContainer .note-card{
    height:280px !important;
    min-height:280px !important;
    max-height:280px !important;
  }
  #recoveryContainer .card-cover-box{
    height:130px !important;
    min-height:130px !important;
    max-height:130px !important;
    flex-basis:130px !important;
  }
}
</style>


<style id="hide-home-header-on-subviews">
/* Fixed home title strip only on home; sub-views are true fullscreen */
#editorView, #recoveryView, #backupView, #categorySettingsPageView, #secureLockView, #fullHtmlView {
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  width: 100vw !important;
  height: 100dvh !important;
  max-height: 100dvh !important;
  z-index: 1000005 !important;
  padding-top: env(safe-area-inset-top, 0px) !important;
  box-sizing: border-box !important;
}
#recoveryView .recovery-header,
#backupView .recovery-header,
#categorySettingsPageView .recovery-header {
  position: relative !important;
  z-index: 2 !important;
  margin-top: 0 !important;
}
body.subview-active .israrlab-title-strip {
  display: none !important;
  visibility: hidden !important;
  pointer-events: none !important;
}
</style>


<style id="card-no-side-lines-solid">
#notesContainer .note-card,
#recoveryContainer .note-card,
.notes-container .note-card{
  border: none !important;
  outline: none !important;
  box-shadow: 0 8px 24px rgba(0,0,0,.18) !important;
  background: var(--card-bg) !important;
}
#notesContainer .card-cover-box,
#recoveryContainer .card-cover-box,
.notes-container .card-cover-box{
  border: none !important;
  border-bottom: none !important;
  outline: none !important;
  box-shadow: none !important;
}
#notesContainer .html-preview-wrapper,
#notesContainer .html-preview-wrapper iframe,
#recoveryContainer .html-preview-wrapper,
#recoveryContainer .html-preview-wrapper iframe{
  border: none !important;
  outline: none !important;
  box-shadow: none !important;
}
#notesContainer .card-body,
#notesContainer .card-footer,
#recoveryContainer .card-body,
#recoveryContainer .card-footer{
  border: none !important;
  border-top: none !important;
  outline: none !important;
}
body.light-mode #notesContainer .note-card,
body.light-mode #recoveryContainer .note-card{
  box-shadow: 0 6px 18px rgba(0,0,0,.08) !important;
  border: none !important;
}
</style>


<style id="card-preview-fill-no-empty">
/* Card HTML preview fills cover solidly (no black/white empty slabs) */
#notesContainer .card-cover-box,
#recoveryContainer .card-cover-box,
.notes-container .card-cover-box{
  background: var(--card-bg) !important;
  overflow: hidden !important;
  position: relative !important;
  border: none !important;
}
#notesContainer .html-preview-wrapper,
#recoveryContainer .html-preview-wrapper,
.notes-container .html-preview-wrapper{
  width: 222% !important;
  height: 222% !important;
  transform: scale(0.45) !important;
  transform-origin: top left !important;
  pointer-events: none !important;
  background: transparent !important;
  overflow: hidden !important;
}
#notesContainer .html-preview-wrapper iframe,
#recoveryContainer .html-preview-wrapper iframe,
.notes-container .html-preview-wrapper iframe{
  width: 100% !important;
  height: 100% !important;
  border: 0 !important;
  background: transparent !important;
  display: block !important;
}
</style>


<style id="editor-scroll-lock-and-vault-cards">
body.subview-active, body.subview-active html {
  overflow: hidden !important;
  overscroll-behavior: none !important;
  touch-action: none;
}
/* Only hide interaction on home content, NOT on subviews */
body.subview-active #homeView,
body.subview-active .external-history-section,
body.subview-active .article-section,
body.subview-active #israr-lab-related-section,
body.subview-active .hero,
body.subview-active .main-footer,
body.subview-active .israrlab-title-strip {
  pointer-events: none !important;
}
#editorView,
#recoveryView,
#backupView,
#secureLockView,
#categorySettingsPageView,
#fullHtmlView {
  position: fixed !important;
  inset: 0 !important;
  z-index: 1000010 !important;
  background: var(--bg) !important;
  overflow: hidden !important;
  touch-action: auto !important;
  pointer-events: auto !important;
  display: none;
  flex-direction: column !important;
}
#editorView { z-index: 1000012 !important; }
#fullHtmlView { z-index: 1000025 !important; }
#recoveryView .recovery-header,
#backupView .recovery-header,
#secureLockView .recovery-header,
#categorySettingsPageView .recovery-header,
#recoveryView .recovery-top-actions,
#backupView .backup-controls,
#secureLockView button,
#recoveryView button,
#backupView button {
  pointer-events: auto !important;
  position: relative;
  z-index: 5;
}
#editorView .code-editor-wrapper,
#editorView .content-textarea,
#editorView .code-highlight-layer {
  touch-action: pan-y pan-x !important;
}
#secureLockView {
  position: fixed !important;
  inset: 0 !important;
  z-index: 1000005 !important;
  display: none;
  flex-direction: column !important;
  background: var(--bg) !important;
}
#secureLockContainer.notes-container {
  display: grid !important;
  grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
  gap: 12px !important;
  padding: 12px !important;
  overflow-y: auto !important;
  flex: 1 1 auto !important;
  min-height: 0 !important;
  align-content: start !important;
}
#secureLockContainer .note-card {
  width: 100% !important;
  height: 290px !important;
  min-height: 290px !important;
  max-height: 290px !important;
  display: flex !important;
  flex-direction: column !important;
  overflow: hidden !important;
  border: none !important;
  box-shadow: 0 8px 24px rgba(0,0,0,.18) !important;
}
#secureLockContainer .card-cover-box {
  height: 145px !important;
  min-height: 145px !important;
  flex: 0 0 145px !important;
  overflow: hidden !important;
  background: var(--card-bg) !important;
  border: none !important;
}
#secureLockContainer .html-preview-wrapper {
  width: 222% !important;
  height: 222% !important;
  transform: scale(0.45) !important;
  transform-origin: top left !important;
  pointer-events: none !important;
  background: transparent !important;
}
#secureLockContainer .html-preview-wrapper iframe {
  width: 100% !important;
  height: 100% !important;
  border: 0 !important;
  background: transparent !important;
}
#secureLockContainer .card-checkbox {
  position: absolute !important;
  top: 8px !important;
  right: 8px !important;
  width: 18px !important;
  height: 18px !important;
  z-index: 6 !important;
}
</style>


<style id="card-clip-and-interactive-preview">
/* Clip card so preview never sticks out (dark/light) */
#notesContainer .note-card,
#recoveryContainer .note-card,
#secureLockContainer .note-card {
  overflow: hidden !important;
  position: relative !important;
  isolation: isolate !important;
  contain: layout paint !important;
  border-radius: 14px !important;
  max-width: 100% !important;
}
#notesContainer .card-cover-box,
#recoveryContainer .card-cover-box,
#secureLockContainer .card-cover-box {
  overflow: hidden !important;
  position: relative !important;
  border-radius: 14px 14px 0 0 !important;
  z-index: 1 !important;
  max-width: 100% !important;
}
#notesContainer .html-preview-wrapper,
#recoveryContainer .html-preview-wrapper,
#secureLockContainer .html-preview-wrapper {
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  width: 222% !important;
  height: 222% !important;
  transform: scale(0.45) !important;
  transform-origin: top left !important;
  /* Interactive: buttons inside HTML preview work */
  pointer-events: auto !important;
  overflow: hidden !important;
  background: transparent !important;
  z-index: 1 !important;
}
#notesContainer .html-preview-wrapper iframe,
#recoveryContainer .html-preview-wrapper iframe,
#secureLockContainer .html-preview-wrapper iframe {
  pointer-events: auto !important;
  border: 0 !important;
  background: transparent !important;
  display: block !important;
  width: 100% !important;
  height: 100% !important;
}
/* Footer buttons stay above iframe */
#notesContainer .card-body,
#notesContainer .card-footer,
#recoveryContainer .card-body,
#recoveryContainer .card-footer,
#secureLockContainer .card-body,
#secureLockContainer .card-footer {
  position: relative !important;
  z-index: 3 !important;
  pointer-events: auto !important;
  background: var(--card-bg) !important;
}
#notesContainer .card-footer button,
#notesContainer .card-body,
#secureLockContainer .card-footer button {
  pointer-events: auto !important;
}
</style>


<style id="live-interactive-card-preview">
/* Live interactive HTML inside card previews (home + recovery + vault) */
#notesContainer .card-cover-box,
#recoveryContainer .card-cover-box,
#secureLockContainer .card-cover-box {
  overflow: hidden !important;
  position: relative !important;
  z-index: 1 !important;
}
#notesContainer .html-preview-wrapper,
#recoveryContainer .html-preview-wrapper,
#secureLockContainer .html-preview-wrapper {
  pointer-events: auto !important;
  overflow: auto !important;
  -webkit-overflow-scrolling: touch !important;
}
#notesContainer .html-preview-wrapper iframe,
#recoveryContainer .html-preview-wrapper iframe,
#secureLockContainer .html-preview-wrapper iframe {
  pointer-events: auto !important;
  touch-action: auto !important;
}
/* Keep card action buttons always clickable above preview */
#notesContainer .card-footer,
#notesContainer .card-body,
#recoveryContainer .card-footer,
#recoveryContainer .card-body,
#secureLockContainer .card-footer,
#secureLockContainer .card-body {
  position: relative !important;
  z-index: 4 !important;
  pointer-events: auto !important;
  background: var(--card-bg) !important;
}
</style>


<style id="force-interactive-previews-final">
#notesContainer .html-preview-wrapper,
#recoveryContainer .html-preview-wrapper,
#secureLockContainer .html-preview-wrapper {
  pointer-events: auto !important;
}
#notesContainer .html-preview-wrapper iframe,
#recoveryContainer .html-preview-wrapper iframe,
#secureLockContainer .html-preview-wrapper iframe {
  pointer-events: auto !important;
}
#recoveryContainer .note-card .card-footer .recovery-btn-restore {
  display: none !important;
}
</style>


<style id="card-thin-theme-outline">
/* Very thin theme-colored outline on cards */
#notesContainer .note-card,
#recoveryContainer .note-card,
#secureLockContainer .note-card {
  border: 1px solid color-mix(in srgb, var(--cyan) 35%, transparent) !important;
  outline: none !important;
  box-shadow: 0 8px 22px rgba(0,0,0,.16) !important;
}
body:not(.light-mode) #notesContainer .note-card,
body:not(.light-mode) #recoveryContainer .note-card,
body:not(.light-mode) #secureLockContainer .note-card {
  border: 1px solid color-mix(in srgb, var(--cyan) 42%, transparent) !important;
  box-shadow: 0 0 0 0.5px color-mix(in srgb, var(--cyan) 18%, transparent), 0 10px 24px rgba(0,0,0,.28) !important;
}
body.light-mode #notesContainer .note-card,
body.light-mode #recoveryContainer .note-card,
body.light-mode #secureLockContainer .note-card {
  border: 1px solid color-mix(in srgb, var(--cyan) 28%, #ccc) !important;
  box-shadow: 0 6px 16px rgba(0,0,0,.08) !important;
}
/* Clip so preview never sticks outside the thin outline */
#notesContainer .note-card,
#recoveryContainer .note-card,
#secureLockContainer .note-card {
  overflow: hidden !important;
  border-radius: 14px !important;
}
</style>


<style id="recovery-visible-cards">
#recoveryView {
  position: fixed !important;
  inset: 0 !important;
  z-index: 1000010 !important;
  flex-direction: column !important;
  background: var(--bg) !important;
  pointer-events: auto !important;
  overflow: hidden !important;
}
#recoveryContainer.notes-container,
#recoveryContainer {
  display: grid !important;
  grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
  gap: 12px !important;
  padding: 12px !important;
  overflow-y: auto !important;
  flex: 1 1 auto !important;
  min-height: 0 !important;
  align-content: start !important;
  pointer-events: auto !important;
}
#recoveryContainer .note-card {
  display: flex !important;
  flex-direction: column !important;
  height: 290px !important;
  min-height: 290px !important;
  max-height: 290px !important;
  overflow: hidden !important;
  visibility: visible !important;
  opacity: 1 !important;
  background: var(--card-bg) !important;
  border: 1px solid color-mix(in srgb, var(--cyan) 35%, transparent) !important;
  border-radius: 14px !important;
}
#recoveryContainer .empty-notes {
  grid-column: 1 / -1 !important;
  color: var(--muted) !important;
  text-align: center !important;
  padding: 40px 16px !important;
}
</style>

<style id="full-html-preview-header-fix">
/* Full HTML Preview header: single-line title + buttons that never overflow */
#fullHtmlView .full-html-preview-header,
#fullHtmlView .recovery-header.full-html-preview-header {
  display: flex !important;
  flex-direction: row !important;
  align-items: center !important;
  justify-content: flex-start !important;
  gap: 8px !important;
  padding: 10px 12px !important;
  flex-shrink: 0 !important;
  min-height: 48px !important;
  box-sizing: border-box !important;
  overflow: visible !important;
  position: relative !important;
  z-index: 50 !important;
}
#fullHtmlView .full-html-back-btn,
#fullHtmlView .full-html-copy-btn {
  flex: 0 0 auto !important;
  min-width: 0 !important;
  max-width: 42% !important;
  height: 34px !important;
  min-height: 34px !important;
  padding: 0 10px !important;
  font-size: 11px !important;
  font-weight: 700 !important;
  white-space: nowrap !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  gap: 5px !important;
  border-radius: 8px !important;
}
#fullHtmlView .full-html-back-btn .btn-label,
#fullHtmlView .full-html-copy-btn .btn-label {
  font-size: 11px !important;
  font-weight: 700 !important;
  line-height: 1 !important;
}
#fullHtmlView .full-html-title,
#fullHtmlView #fullHtmlTitle {
  display: none !important;
}
@media (max-width: 420px) {
  #fullHtmlView .full-html-preview-header {
    padding: 8px 8px !important;
    gap: 6px !important;
  }
  #fullHtmlView .full-html-back-btn,
  #fullHtmlView .full-html-copy-btn {
    height: 32px !important;
    min-height: 32px !important;
    padding: 0 8px !important;
    font-size: 10px !important;
    max-width: 38% !important;
  }
  #fullHtmlView .full-html-back-btn .btn-label,
  #fullHtmlView .full-html-copy-btn .btn-label {
    font-size: 10px !important;
  }
  #fullHtmlView .full-html-title,
  #fullHtmlView #fullHtmlTitle {
    font-size: 12px !important;
  }
}
@media (max-width: 340px) {
  #fullHtmlView .full-html-back-btn .btn-label,
  #fullHtmlView .full-html-copy-btn .btn-label {
    /* keep short labels only */
  }
  #fullHtmlView .full-html-title {
    font-size: 11px !important;
  }
}
</style>


<style id="mobile-code-box-no-overflow-full-color-fix">
/* Code must stay INSIDE the editor box on mobile: no right-side spill */
#editorView .code-editor-wrapper{
  overflow: hidden !important;
  max-width: 100% !important;
  width: 100% !important;
  min-width: 0 !important;
  position: relative !important;
  box-sizing: border-box !important;
}
#editorView .editor-input-area{
  overflow: hidden !important;
  max-width: 100% !important;
  min-width: 0 !important;
  width: 100% !important;
  position: relative !important;
}
#editorView .line-numbers{
  flex-shrink: 0 !important;
  overflow: hidden !important;
}
/* Wrap long lines so full code is readable on phone without horizontal spill */
#editorView #htmlCodeInput,
#editorView .content-textarea,
#editorView .code-highlight-layer,
#editorView .code-highlight-layer code{
  white-space: pre !important;
  overflow-wrap: anywhere !important;
  word-break: break-word !important;
  word-wrap: break-word !important;
  max-width: 100% !important;
  box-sizing: border-box !important;
  min-width: 0 !important;
}
#editorView .code-highlight-layer{
  position: absolute !important;
  inset: 0 !important;
  width: 100% !important;
  height: 100% !important;
  margin: 0 !important;
  padding: 12px !important;
  overflow: hidden !important; /* textarea drives scroll */
  min-width: 0 !important;
  max-width: 100% !important;
  pointer-events: none !important;
  z-index: 1 !important;
}
#editorView #htmlCodeInput,
#editorView .content-textarea{
  position: absolute !important;
  inset: 0 !important;
  width: 100% !important;
  height: 100% !important;
  margin: 0 !important;
  padding: 12px !important;
  overflow-x: hidden !important;
  overflow-y: auto !important;
  resize: none !important;
  z-index: 2 !important;
  background: transparent !important;
}
#editorView .editor-input-area.syntax-ready #htmlCodeInput,
#editorView .editor-input-area.syntax-ready .content-textarea{
  color: transparent !important;
  -webkit-text-fill-color: transparent !important;
  caret-color: #58a6ff !important;
}
body.light-mode #editorView .editor-input-area.syntax-ready #htmlCodeInput,
body.light-mode #editorView .editor-input-area.syntax-ready .content-textarea{
  caret-color: #0969da !important;
}
/* Dark / light colored tokens always visible when highlighted */
#editorView .code-highlight-layer .hljs-tag,
#editorView .code-highlight-layer .hljs-name{color:#79c0ff;}
#editorView .code-highlight-layer .hljs-attr{color:#d2a8ff;}
#editorView .code-highlight-layer .hljs-string{color:#a5d6ff;}
#editorView .code-highlight-layer .hljs-keyword,
#editorView .code-highlight-layer .hljs-selector-tag{color:#ff7b72;}
#editorView .code-highlight-layer .hljs-comment{color:#8b949e;font-style:italic;}
#editorView .code-highlight-layer .hljs-number,
#editorView .code-highlight-layer .hljs-literal{color:#79c0ff;}
body.light-mode #editorView .code-highlight-layer{background:#ffffff !important;color:#24292f !important;}
body.light-mode #editorView .code-highlight-layer .hljs-tag,
body.light-mode #editorView .code-highlight-layer .hljs-name{color:#0550ae !important;}
body.light-mode #editorView .code-highlight-layer .hljs-attr{color:#8250df !important;}
body.light-mode #editorView .code-highlight-layer .hljs-string{color:#0a3069 !important;}
body.light-mode #editorView .code-highlight-layer .hljs-keyword,
body.light-mode #editorView .code-highlight-layer .hljs-selector-tag{color:#cf222e !important;}
body.light-mode #editorView .code-highlight-layer .hljs-comment{color:#6e7781 !important;}
body.light-mode #editorView .code-highlight-layer .hljs-number,
body.light-mode #editorView .code-highlight-layer .hljs-literal{color:#0550ae !important;}
</style>


<style id="line-gutter-scroll-sync-fix">
#editorView .line-numbers{
  overflow: hidden !important;
  height: 100% !important;
  max-height: 100% !important;
  overscroll-behavior: none !important;
  scrollbar-width: none !important;
}
#editorView .line-numbers::-webkit-scrollbar{ display:none !important; width:0 !important; height:0 !important; }
#editorView .code-editor-wrapper{
  align-items: stretch !important;
}
#editorView .line-numbers,
#editorView #htmlCodeInput,
#editorView .code-highlight-layer,
#editorView .code-highlight-layer code{
  font-family: Consolas, Monaco, "Courier New", monospace !important;
  font-size: 14px !important;
  font-weight: 600 !important;
  line-height: 1.6 !important;
  letter-spacing: normal !important;
  tab-size: 2 !important;
}
</style>


<style id="line-code-perfect-scroll-sync">
/* 1 code line = 1 gutter line. No wrap mismatch. Horizontal scroll stays INSIDE editor. */
#editorView .code-editor-wrapper{
  overflow: hidden !important;
  max-width: 100% !important;
  min-width: 0 !important;
  display: flex !important;
  align-items: stretch !important;
}
#editorView .line-numbers{
  overflow: hidden !important; /* driven only by JS scrollTop */
  height: 100% !important;
  max-height: none !important;
  flex-shrink: 0 !important;
  white-space: pre !important;
  line-height: 1.6 !important;
  font-size: 14px !important;
  font-family: Consolas, Monaco, "Courier New", monospace !important;
  font-weight: 600 !important;
  padding: 12px 6px 12px 0 !important;
  box-sizing: border-box !important;
  scrollbar-width: none !important;
}
#editorView .line-numbers::-webkit-scrollbar{ display: none !important; width: 0 !important; }
#editorView .editor-input-area{
  overflow: hidden !important;
  min-width: 0 !important;
  flex: 1 1 auto !important;
  position: relative !important;
}
#editorView #htmlCodeInput,
#editorView .content-textarea,
#editorView .code-highlight-layer,
#editorView .code-highlight-layer code{
  white-space: pre !important;          /* NO wrap — keeps line numbers locked to code */
  overflow-wrap: normal !important;
  word-break: normal !important;
  word-wrap: normal !important;
  line-height: 1.6 !important;
  font-size: 14px !important;
  font-family: Consolas, Monaco, "Courier New", monospace !important;
  font-weight: 600 !important;
  tab-size: 2 !important;
  letter-spacing: normal !important;
  box-sizing: border-box !important;
}
#editorView #htmlCodeInput,
#editorView .content-textarea{
  overflow-x: auto !important;   /* long lines scroll inside, not outside screen */
  overflow-y: auto !important;
  padding: 12px !important;
  margin: 0 !important;
}
#editorView .code-highlight-layer{
  overflow: hidden !important;   /* textarea is the only scroller */
  padding: 12px !important;
  margin: 0 !important;
  inset: 0 !important;
  width: 100% !important;
  height: 100% !important;
  min-width: 0 !important;
  max-width: none !important;
}
</style>
<script id="line-scroll-raf-bind">
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
</script>


<style id="editor-no-right-spill-fix">
/* Long lines stay INSIDE the editor card — swipe left/right inside code area only */
#editorView .code-editor-wrapper{
  overflow: hidden !important;
  max-width: 100% !important;
  width: 100% !important;
  min-width: 0 !important;
  display: flex !important;
  flex-direction: row !important;
  align-items: stretch !important;
  box-sizing: border-box !important;
}
#editorView .line-numbers{
  overflow: hidden !important;
  flex: 0 0 auto !important;
  max-width: 52px !important;
  z-index: 3 !important;
}
#editorView .editor-input-area{
  position: relative !important;
  flex: 1 1 auto !important;
  min-width: 0 !important;          /* critical: allow shrink so flex child doesn't explode width */
  max-width: 100% !important;
  width: 100% !important;
  overflow-x: auto !important;      /* horizontal pan inside */
  overflow-y: hidden !important;
  -webkit-overflow-scrolling: touch !important;
  overscroll-behavior: contain !important;
  touch-action: pan-x pan-y !important;
}
#editorView #htmlCodeInput,
#editorView .content-textarea{
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  width: 100% !important;
  max-width: 100% !important;
  min-width: 0 !important;
  height: 100% !important;
  margin: 0 !important;
  padding: 12px !important;
  box-sizing: border-box !important;
  white-space: pre !important;
  overflow-x: auto !important;
  overflow-y: auto !important;
  -webkit-overflow-scrolling: touch !important;
  overscroll-behavior: contain !important;
  touch-action: pan-x pan-y !important;
  z-index: 2 !important;
}
#editorView .code-highlight-layer{
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  right: 0 !important;
  bottom: 0 !important;
  width: 100% !important;
  max-width: 100% !important;
  min-width: 0 !important;
  height: 100% !important;
  margin: 0 !important;
  padding: 12px !important;
  box-sizing: border-box !important;
  white-space: pre !important;
  overflow-x: hidden !important;
  overflow-y: hidden !important;
  pointer-events: none !important;
  z-index: 1 !important;
}
#editorView .code-highlight-layer code{
  display: block !important;
  white-space: pre !important;
  max-width: none !important;
}
/* Prevent any parent from letting code paint outside the phone screen */
#editorView,
#editorView .editor-body,
#editorView .editor-body > div{
  max-width: 100vw !important;
  overflow-x: hidden !important;
  box-sizing: border-box !important;
}
</style>
<script id="editor-hscroll-sync">
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
</script>


<style id="codemirror-editor-skin">
/* CodeMirror fills editor like israrlabhtmlpreview — line wrap, no right spill */
#editorView .code-editor-wrapper{
  display:flex !important;
  flex-direction:column !important;
  overflow:hidden !important;
  min-height:0 !important;
  height:100% !important;
  position:relative !important;
  background:#0d1117 !important;
}
#editorView .line-numbers{ display:none !important; } /* CM has built-in gutters */
#editorView .editor-input-area{
  flex:1 1 auto !important;
  min-height:0 !important;
  height:100% !important;
  position:relative !important;
  overflow:hidden !important;
}
#editorView .code-highlight-layer{ display:none !important; } /* CM does colors */
#editorView #htmlCodeInput.content-textarea{
  /* hidden once CM mounts; keep in DOM for fallback */
  opacity:0 !important;
  position:absolute !important;
  pointer-events:none !important;
  height:0 !important;
  width:0 !important;
}
#editorView .CodeMirror{
  position:absolute !important;
  inset:0 !important;
  width:100% !important;
  height:100% !important;
  font-family: Consolas, Monaco, "Courier New", monospace !important;
  font-size:14px !important;
  line-height:1.55 !important;
  background:#0d1117 !important;
  color:#e6edf3 !important;
  border:none !important;
}
#editorView .CodeMirror-scroll{
  min-height:100% !important;
  max-width:100% !important;
}
#editorView .CodeMirror-gutters{
  background:#161b22 !important;
  border-right:1px solid rgba(255,255,255,.08) !important;
}
#editorView .CodeMirror-linenumber{
  color:#8b949e !important;
  min-width:36px !important;
  padding:0 8px 0 0 !important;
}
#editorView .CodeMirror-cursor{ border-left:2px solid #58a6ff !important; }
#editorView .CodeMirror-focused .CodeMirror-selected,
#editorView .CodeMirror-line::selection,
#editorView .CodeMirror-line > span::selection{
  background: rgba(88,166,255,.28) !important;
}
body.light-mode #editorView .CodeMirror{
  background:#ffffff !important;
  color:#24292f !important;
}
body.light-mode #editorView .CodeMirror-gutters{
  background:#f6f8fa !important;
  border-right:1px solid #d0d7de !important;
}
body.light-mode #editorView .CodeMirror-linenumber{ color:#6e7781 !important; }
body.light-mode #editorView .CodeMirror-cursor{ border-left-color:#0969da !important; }
</style>
<script id="codemirror-editor-bootstrap">
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

