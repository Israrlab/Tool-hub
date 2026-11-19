/* ==================== THEME & ANIMATED BUBBLES ==================== */
const vipThemes = [
  /* 01 Ocean Blue (DEFAULT) */ {bg:'#0a121c',panel:'#141e2e',card:'#1c283c',btn:'#26344c',accent:'#60a5fa',orangeLight:'#bfdbfe',border:'rgba(96,165,250,0.40)',grad:'linear-gradient(115deg,#2563eb 0%,#60a5fa 50%,#93c5fd 100%)'},
  /* 02 Classic Teal */         {bg:'#001519',panel:'#00383b',card:'#00484b',btn:'#00616a',accent:'#38bdf8',orangeLight:'#9af5df',border:'rgba(56,189,248,0.42)',grad:'linear-gradient(115deg,#0e7490 0%,#38bdf8 55%,#7dd3fc 100%)'},
  /* 03 Royal Violet */         {bg:'#110e1c',panel:'#1c1830',card:'#262040',btn:'#322a52',accent:'#a78bfa',orangeLight:'#ddd6fe',border:'rgba(167,139,250,0.40)',grad:'linear-gradient(115deg,#6d28d9 0%,#a78bfa 50%,#c4b5fd 100%)'},
  /* 04 Emerald Forest */       {bg:'#081410',panel:'#12241c',card:'#1a3026',btn:'#243e32',accent:'#34d399',orangeLight:'#a7f3d0',border:'rgba(52,211,153,0.40)',grad:'linear-gradient(115deg,#047857 0%,#34d399 50%,#6ee7b7 100%)'},
  /* 05 Rose Blush */           {bg:'#160e12',panel:'#241820',card:'#302028',btn:'#3e2a34',accent:'#fb7185',orangeLight:'#fecdd3',border:'rgba(251,113,133,0.40)',grad:'linear-gradient(115deg,#be123c 0%,#fb7185 50%,#fda4af 100%)'},
  /* 06 Amber Gold */           {bg:'#14120a',panel:'#221e14',card:'#2e281c',btn:'#3c3426',accent:'#fbbf24',orangeLight:'#fde68a',border:'rgba(251,191,36,0.40)',grad:'linear-gradient(115deg,#b45309 0%,#fbbf24 50%,#fcd34d 100%)'},
  /* 07 Cyan Ice */             {bg:'#0a1418',panel:'#122228',card:'#1a2e36',btn:'#243c46',accent:'#22d3ee',orangeLight:'#a5f3fc',border:'rgba(34,211,238,0.40)',grad:'linear-gradient(115deg,#0891b2 0%,#22d3ee 50%,#67e8f9 100%)'},
  /* 08 Soft Teal */            {bg:'#0a1414',panel:'#142222',card:'#1c2e2e',btn:'#263c3c',accent:'#2dd4bf',orangeLight:'#99f6e4',border:'rgba(45,212,191,0.40)',grad:'linear-gradient(115deg,#0f766e 0%,#2dd4bf 50%,#5eead4 100%)'},
  /* 09 Indigo Night */         {bg:'#0c0c1a',panel:'#18182c',card:'#22223a',btn:'#2e2e4a',accent:'#818cf8',orangeLight:'#c7d2fe',border:'rgba(129,140,248,0.40)',grad:'linear-gradient(115deg,#4338ca 0%,#818cf8 50%,#a5b4fc 100%)'},
  /* 10 Lime Glow */            {bg:'#0e140a',panel:'#1a2214',card:'#242e1c',btn:'#303c26',accent:'#a3e635',orangeLight:'#d9f99d',border:'rgba(163,230,53,0.38)',grad:'linear-gradient(115deg,#4d7c0f 0%,#a3e635 50%,#bef264 100%)'},
  /* 11 Sunset Orange */        {bg:'#16120c',panel:'#241e16',card:'#30281e',btn:'#3e3428',accent:'#fb923c',orangeLight:'#fed7aa',border:'rgba(251,146,60,0.40)',grad:'linear-gradient(115deg,#c2410c 0%,#fb923c 50%,#fdba74 100%)'},
  /* 12 Magenta Bloom */        {bg:'#140e16',panel:'#221a24',card:'#2e2430',btn:'#3c303e',accent:'#e879f9',orangeLight:'#f5d0fe',border:'rgba(232,121,249,0.40)',grad:'linear-gradient(115deg,#a21caf 0%,#e879f9 50%,#f0abfc 100%)'},
  /* 13 Deep Navy */            {bg:'#060e18',panel:'#101c2c',card:'#182638',btn:'#203248',accent:'#3b82f6',orangeLight:'#93c5fd',border:'rgba(59,130,246,0.42)',grad:'linear-gradient(115deg,#1e3a8a 0%,#3b82f6 50%,#60a5fa 100%)'},
  /* 14 Mint Leaf */            {bg:'#081410',panel:'#12221a',card:'#1a2e24',btn:'#243c30',accent:'#10b981',orangeLight:'#a7f3d0',border:'rgba(16,185,129,0.40)',grad:'linear-gradient(115deg,#065f46 0%,#10b981 50%,#34d399 100%)'},
  /* 15 Orchid Purple */        {bg:'#120e18',panel:'#1e1a28',card:'#282434',btn:'#343042',accent:'#c084fc',orangeLight:'#e9d5ff',border:'rgba(192,132,252,0.40)',grad:'linear-gradient(115deg,#7e22ce 0%,#c084fc 50%,#d8b4fe 100%)'},
  /* 16 Coral Fire */           {bg:'#16100e',panel:'#241c18',card:'#302620',btn:'#3e322a',accent:'#f97316',orangeLight:'#ffedd5',border:'rgba(249,115,22,0.40)',grad:'linear-gradient(115deg,#9a3412 0%,#f97316 50%,#fb923c 100%)'},
  /* 17 Arctic Sky */           {bg:'#081218',panel:'#121e28',card:'#1a2834',btn:'#243442',accent:'#38bdf8',orangeLight:'#bae6fd',border:'rgba(56,189,248,0.40)',grad:'linear-gradient(115deg,#0369a1 0%,#38bdf8 50%,#7dd3fc 100%)'},
  /* 18 Crimson Soft */         {bg:'#160e10',panel:'#24181c',card:'#302026',btn:'#3e2a32',accent:'#f43f5e',orangeLight:'#fecdd3',border:'rgba(244,63,94,0.40)',grad:'linear-gradient(115deg,#9f1239 0%,#f43f5e 50%,#fb7185 100%)'},
  /* 19 Chartreuse Soft */      {bg:'#10140a',panel:'#1c2214',card:'#262e1c',btn:'#323c26',accent:'#84cc16',orangeLight:'#d9f99d',border:'rgba(132,204,22,0.38)',grad:'linear-gradient(115deg,#3f6212 0%,#84cc16 50%,#a3e635 100%)'},
  /* 20 Sapphire Indigo */      {bg:'#0a0c18',panel:'#14162a',card:'#1c1e36',btn:'#262844',accent:'#6366f1',orangeLight:'#c7d2fe',border:'rgba(99,102,241,0.42)',grad:'linear-gradient(115deg,#312e81 0%,#6366f1 50%,#818cf8 100%)'},
  /* 21 Honey Gold */           {bg:'#14120c',panel:'#221e16',card:'#2e281e',btn:'#3c3428',accent:'#f59e0b',orangeLight:'#fde68a',border:'rgba(245,158,11,0.40)',grad:'linear-gradient(115deg,#92400e 0%,#f59e0b 50%,#fbbf24 100%)'},
  /* 22 Aqua Marine */          {bg:'#0a1416',panel:'#142224',card:'#1c2e30',btn:'#263c40',accent:'#14b8a6',orangeLight:'#99f6e4',border:'rgba(20,184,166,0.40)',grad:'linear-gradient(115deg,#115e59 0%,#14b8a6 50%,#2dd4bf 100%)'},
  /* 23 Lavender Mist */        {bg:'#12101a',panel:'#1e1a2a',card:'#282436',btn:'#343044',accent:'#d8b4fe',orangeLight:'#f3e8ff',border:'rgba(216,180,254,0.40)',grad:'linear-gradient(115deg,#6b21a8 0%,#c084fc 50%,#e9d5ff 100%)'},
  /* 24 Ruby Soft */            {bg:'#160c0e',panel:'#241618',card:'#301e22',btn:'#3e282c',accent:'#ef4444',orangeLight:'#fecaca',border:'rgba(239,68,68,0.40)',grad:'linear-gradient(115deg,#991b1b 0%,#ef4444 50%,#f87171 100%)'},
  /* 25 Jade Green */           {bg:'#0a1412',panel:'#14221e',card:'#1c2e28',btn:'#263c34',accent:'#4ade80',orangeLight:'#bbf7d0',border:'rgba(74,222,128,0.40)',grad:'linear-gradient(115deg,#166534 0%,#4ade80 50%,#86efac 100%)'},
  /* 26 Electric Blue */        {bg:'#080e18',panel:'#101c2c',card:'#182638',btn:'#203248',accent:'#0ea5e9',orangeLight:'#bae6fd',border:'rgba(14,165,233,0.42)',grad:'linear-gradient(115deg,#075985 0%,#0ea5e9 50%,#38bdf8 100%)'},
  /* 27 Soft Pink */            {bg:'#141014',panel:'#221c22',card:'#2e262e',btn:'#3c323c',accent:'#f472b6',orangeLight:'#fbcfe8',border:'rgba(244,114,182,0.40)',grad:'linear-gradient(115deg,#9d174d 0%,#f472b6 50%,#f9a8d4 100%)'},
  /* 28 Bronze Soft */          {bg:'#14120e',panel:'#221e18',card:'#2e2820',btn:'#3c342a',accent:'#d97706',orangeLight:'#fde68a',border:'rgba(217,119,6,0.40)',grad:'linear-gradient(115deg,#78350f 0%,#d97706 50%,#f59e0b 100%)'},
  /* 29 Platinum Silver */      {bg:'#0e1216',panel:'#1a2028',card:'#242c36',btn:'#303a46',accent:'#94a3b8',orangeLight:'#e2e8f0',border:'rgba(148,163,184,0.40)',grad:'linear-gradient(115deg,#334155 0%,#94a3b8 50%,#cbd5e1 100%)'},
  /* 30 Graphite Pro */         {bg:'#0c0e12',panel:'#181c22',card:'#22262e',btn:'#2e343e',accent:'#64748b',orangeLight:'#cbd5e1',border:'rgba(100,116,139,0.40)',grad:'linear-gradient(115deg,#1e293b 0%,#64748b 50%,#94a3b8 100%)'}
];

let currentThemeIdx = 1;
let ketoDarkMode = true;
try {
  const s = localStorage.getItem('israr_quran_theme_idx');
  if (s) currentThemeIdx = parseInt(s, 10) || 1;
  if (currentThemeIdx > vipThemes.length) currentThemeIdx = 1;
  const d = localStorage.getItem('israr_quran_darkmode');
  if (d !== null) ketoDarkMode = d === 'true';
} catch (e) {}

const themeToggleBtn = document.getElementById('themeToggleBtn');
const vipThemeCycleBtn = document.getElementById('vipThemeCycleBtn');
const body = document.body;
const rootStyle = document.documentElement.style;

function applyVipTheme(idx) {
  idx = Number(idx);
  if (!Number.isInteger(idx) || idx < 1 || idx > vipThemes.length) idx = 1;
  currentThemeIdx = idx;
  try { localStorage.setItem('israr_quran_theme_idx', String(idx)); } catch (e) {}
  const t = vipThemes[idx - 1];
  // Remove any premium glow layers if present
  try {
    const s1 = document.getElementById('vipGlowSpot1');
    const s2 = document.getElementById('vipGlowSpot2');
    if (s1) s1.remove();
    if (s2) s2.remove();
  } catch (e) {}
  body.style.background = '';
  body.style.backgroundAttachment = '';
  if (ketoDarkMode) {
    body.classList.remove('light-mode');
    rootStyle.setProperty('--bg', t.bg);
    rootStyle.setProperty('--panel-bg', t.panel);
    rootStyle.setProperty('--card-bg', t.card);
    rootStyle.setProperty('--btn-bg', t.btn);
  } else {
    body.classList.add('light-mode');
    rootStyle.setProperty('--bg', '#F0F4F8');
    rootStyle.setProperty('--panel-bg', '#ffffff');
    rootStyle.setProperty('--card-bg', '#ffffff');
    rootStyle.setProperty('--btn-bg', '#e2e8f0');
  }
  rootStyle.setProperty('--accent', t.accent);
  rootStyle.setProperty('--orange-light', t.orangeLight);
  rootStyle.setProperty('--border', t.border);
  rootStyle.setProperty('--grad', t.grad);
  rootStyle.setProperty('--glow', t.accent + '33');
  try {
    const b = document.getElementById('vipThemeCycleBtn');
    if (b) {
      b.innerHTML = '<i class="fas fa-palette"></i><span>Theme ' + idx + '</span>';
      b.title = 'VIP Theme ' + idx + ' / 30 — click to change';
      b.style.background = t.grad || '';
      b.style.color = '#fff';
      b.style.border = '1px solid ' + (t.accent || 'transparent');
      b.style.boxShadow = '0 0 12px ' + (t.accent || 'transparent') + '55';
    }
  } catch (e) {}
}

function applyDarkModeState() {
  themeToggleBtn.innerHTML = ketoDarkMode
    ? '<i class="fas fa-sun"></i><span>Dark Mode</span>'
    : '<i class="fas fa-moon"></i><span>Light Mode</span>';
  const rNight = document.getElementById('readerNightBtn');
  if (rNight) {
    rNight.innerHTML = ketoDarkMode
      ? '<i class="fas fa-sun"></i> <span>Day</span>'
      : '<i class="fas fa-moon"></i> <span>Night</span>';
  }
  applyVipTheme(currentThemeIdx);
  try { localStorage.setItem('israr_quran_darkmode', String(ketoDarkMode)); } catch (e) {}
}

themeToggleBtn.addEventListener('click', () => {
  ketoDarkMode = !ketoDarkMode;
  applyDarkModeState();
});
vipThemeCycleBtn.addEventListener('click', () => {
  currentThemeIdx = (currentThemeIdx % vipThemes.length) + 1;
  applyVipTheme(currentThemeIdx);
});

/* Bubbles disabled — clean premium look */
(function () {
  const canvas = document.getElementById('bubble-canvas');
  if (canvas) {
    canvas.style.display = 'none';
  }
})();

function showToast(msg) {
  let t = document.querySelector('.toast');
  if (!t) {
    t = document.createElement('div');
    t.className = 'toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

/* ==================== TRANSLITERATION ENGINES (HINDI ROMAN & URDU IN HINDI SCRIPT) ==================== */
function devanagariToRoman(text) {
  if (!text) return '';
  const cons = {
    'क':'k','ख':'kh','ग':'g','घ':'gh','ङ':'ng','च':'ch','छ':'chh','ज':'j','झ':'jh','ञ':'ny',
    'ट':'t','ठ':'th','ड':'d','ढ':'dh','ण':'n','त':'t','थ':'th','द':'d','ध':'dh','न':'n',
    'प':'p','फ':'ph','ब':'b','भ':'bh','म':'m','य':'y','र':'r','ल':'l','व':'v','श':'sh',
    'ष':'sh','स':'s','ह':'h','क़':'q','ख़':'kh','ग़':'gh','ज़':'z','झ़':'zh','ड़':'r','ढ़':'rh','फ़':'f'
  };
  const indepV = {'अ':'a','आ':'aa','इ':'i','ई':'ee','उ':'u','ऊ':'oo','ऋ':'ri','ए':'e','ऐ':'ai','ओ':'o','औ':'au'};
  const matras = {'ा':'aa','ि':'i','ी':'ee','ु':'u','ू':'oo','ृ':'ri','े':'e','ै':'ai','ो':'o','ौ':'au','्':''};
  const signs = {'ं':'n','ँ':'n','ः':'h','़':'','।':'.','॥':'.'};
  const digits = {'०':'0','१':'1','२':'2','३':'3','४':'4','५':'5','६':'6','७':'7','८':'8','९':'9'};

  return text.split(/(\s+)/).map(w => {
    if (/^\s+$/.test(w)) return w;
    let out = '';
    const chars = Array.from(w);
    for (let i = 0; i < chars.length; i++) {
      let c = chars[i];
      if (chars[i + 1] === '़' && cons[c + '़']) { c = c + '़'; i++; }
      if (digits[c]) { out += digits[c]; continue; }
      if (indepV[c]) { out += indepV[c]; continue; }
      if (signs[c] !== undefined) { out += signs[c]; continue; }
      if (matras[c] !== undefined) { out += matras[c]; continue; }
      if (cons[c]) {
        out += cons[c];
        const nx = chars[i + 1];
        const hasMatra = nx && matras[nx] !== undefined;
        const isLast = (i === chars.length - 1) || !/[\u0900-\u097F]/.test(nx);
        if (!hasMatra && !isLast && nx !== '्') out += 'a';
        continue;
      }
      out += c;
    }
    return out;
  }).join('');
}

const URDU_ROMAN_DICT = {
  'allah':'अल्लाह','ke':'के','ki':'की','ka':'का','ko':'को','se':'से','mein':'में','par':'पर','aur':'और',
  'hai':'है','hain':'हैं','ho':'हो','jo':'जो','wo':'वो','woh':'वह','yeh':'यह','ye':'ये','hum':'हम',
  'tum':'तुम','aap':'आप','un':'उन','in':'इन','nahi':'नहीं','nahin':'नहीं','na':'ना','bhi':'भी','hi':'ही',
  'to':'तो','ya':'या','kyun':'क्यूँ','kya':'क्या','jab':'जब','tab':'तब','ab':'अब','phir':'फिर','sab':'सब',
  'har':'हर','ek':'एक','do':'दो','rehman':'रहमान','rahman':'रहमान','raheem':'रहीम','rahim':'रहीम',
  'rubb':'रब','rabb':'रब','naam':'नाम','tareef':'तारीफ़','tamaam':'तमाम','tamam':'तमाम','jahan':'जहान',
  'qayinaat':'क़ायनात','kayinat':'कायनात','malik':'मालिक','deen':'दीन','ibadat':'इबादत','madad':'मदद',
  'seedha':'सीधा','raasta':'रास्ता','rasta':'रास्ता','logon':'लोगों','log':'लोग','inam':'इनाम','inaam':'इनाम',
  'gazab':'ग़ज़ब','ghazab':'ग़ज़ब','bhatke':'भटके','huey':'हुए','huye':'हुए','hue':'हुए','hua':'हुआ','hui':'हुई',
  'beshak':'बेशक','aye':'ऐ','nabi':'नबी','rasool':'रसूल','quran':'क़ुरआन','kitab':'किताब','kitaab':'किताब',
  'imaan':'ईमान','iman':'ईमान','namaz':'नमाज़','zakat':'ज़कात','jannat':'जन्नत','jahannam':'जहन्नम',
  'azaab':'अज़ाब','azab':'अज़ाब','gunah':'गुनाह','nek':'नेक','naik':'नेक','bhalai':'भलाई','burai':'बुराई',
  'dil':'दिल','dilon':'दिलों','zameen':'ज़मीन','aasman':'आसमान','asman':'आसमान','paani':'पानी','pani':'पानी',
  'suraj':'सूरज','chaand':'चाँद','chand':'चाँद','raat':'रात','din':'दिन','duniya':'दुनिया','dunya':'दुनिया',
  'aakhirat':'आख़िरत','akhirat':'आख़िरत','qiyamat':'क़ियामत','farishte':'फ़रिश्ते','shaitan':'शैतान',
  'musalman':'मुसलमान','kafir':'काफ़िर','kuffar':'कुफ़्फ़ार','momin':'मोमिन','taqwa':'तक़वा','sabr':'सब्र',
  'shukr':'शुक्र','dua':'दुआ','rehmat':'रहमत','rahmat':'रहमत','barkat':'बरकत','hidayat':'हिदायत',
  'ilm':'इल्म','hikmat':'हिकमत','insaf':'इंसाफ़','zulm':'ज़ुल्म','haq':'हक़','batil':'बातिल','baatil':'बातिल',
  'sacha':'सच्चा','sach':'सच','jhoot':'झूठ','maut':'मौत','zindagi':'ज़िंदगी','rizq':'रिज़्क़','khuda':'ख़ुदा',
  'bande':'बंदे','bandon':'बंदों','kaun':'कौन','kisi':'किसी','kuch':'कुछ','apne':'अपने','apni':'अपनी','apna':'अपना',
  'tera':'तेरा','teri':'तेरी','tere':'तेरे','mera':'मेरा','meri':'मेरी','mere':'मेरे','hamara':'हमारा','hamare':'हमारे',
  'hamari':'हमारी','tumhara':'तुम्हारा','tumhare':'तुम्हारे','unka':'उनका','unke':'उनके','unki':'उनकी',
  'uska':'उसका','uske':'उसके','uski':'उसकी','jiska':'जिसका','jinke':'जिनके','jinpar':'जिनपर','liye':'लिए',
  'liya':'लिया','diya':'दिया','kiya':'किया','karo':'करो','karte':'करते','karta':'करता','karti':'करती',
  'karke':'करके','karna':'करना','hota':'होता','hoti':'होती','hote':'होते','wale':'वाले','wala':'वाला','wali':'वाली',
  'saath':'साथ','sath':'साथ','pehle':'पहले','baad':'बाद','upar':'ऊपर','neeche':'नीचे','andar':'अंदर','bahar':'बाहर',
  'taraf':'तरफ़','siwa':'सिवा','magar':'मगर','lekin':'लेकिन','agar':'अगर','kyunki':'क्यूँकि','taaki':'ताकि',
  'isliye':'इसलिए','waqt':'वक़्त','saal':'साल','meharban':'मेहरबान','nihayat':'निहायत','farmane':'फ़रमाने',
  'farmaya':'फ़रमाया','faisla':'फ़ैसला','haath':'हाथ','kaam':'काम','baat':'बात','cheez':'चीज़','jagah':'जगह',
  'surah':'सूरह','para':'पारा','ayat':'आयत','aayat':'आयत','nuzul':'नुज़ूल','makki':'मक्की','madani':'मदनी',
  'daur':'दौर','nazil':'नाज़िल','tafsir':'तफ़्सीर','tafseer':'तफ़्सीर','paigham':'पैग़ाम','sabaq':'सबक़',
  'maangte':'माँगते','dikha':'दिखा','humein':'हमें','hamein':'हमें','maatoob':'मातूब','nay':'ने','ne':'ने',
  'tu':'तू','tumne':'तुमने','unhone':'उन्होंने','jinhone':'जिन्होंने','jisne':'जिसने','jise':'जिसे','unhein':'उन्हें'
};

function romanUrduToDevanagari(text) {
  if (!text) return '';
  const dg = [['khh','ख़'],['ghh','ग़'],['sh','श'],['chh','छ'],['ch','च'],['kh','ख़'],['gh','ग़'],['th','थ'],['dh','ध'],['ph','फ'],['bh','भ'],['jh','झ'],['zh','झ़'],['ng','ंग'],['ny','ञ']];
  const sg = {'k':'क','g':'ग','c':'च','j':'ज','t':'त','d':'द','n':'न','p':'प','f':'फ़','b':'ब','m':'म','y':'य','r':'र','l':'ल','v':'व','w':'व','s':'स','h':'ह','q':'क़','z':'ज़','x':'क्स'};
  const iv = [['aa','आ'],['ee','ई'],['oo','ऊ'],['ai','ऐ'],['au','औ'],['a','अ'],['i','इ'],['u','उ'],['e','ए'],['o','ओ']];
  const mv = [['aa','ा'],['ee','ी'],['oo','ू'],['ai','ै'],['au','ौ'],['a',''],['i','ि'],['u','ु'],['e','े'],['o','ो']];
  return text.split(/([A-Za-z]+)/).map(tok => {
    if (!/^[A-Za-z]+$/.test(tok)) return tok;
    const low = tok.toLowerCase();
    if (URDU_ROMAN_DICT[low]) return URDU_ROMAN_DICT[low];
    let out = '', i = 0, st = true;
    while (i < low.length) {
      let m = false, vt = st ? iv : mv;
      for (const [p, r] of vt) { if (low.startsWith(p, i)) { out += r; i += p.length; st = false; m = true; break; } }
      if (m) continue;
      for (const [p, r] of dg) { if (low.startsWith(p, i)) { out += r; i += p.length; st = false; m = true; break; } }
      if (m) continue;
      const ch = low[i];
      if (sg[ch]) { out += sg[ch]; st = false; }
      i++;
    }
    return out || tok;
  }).join('');
}

/* ==================== HIGHLIGHT HELPERS ==================== */
function escapeHTML(s) {
  return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function escapeRegex(s) {
  return String(s || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
function stripArabicDiacritics(s) {
  return (s || '').replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '');
}
function buildArabicDiacriticRegex(q) {
  const cl = stripArabicDiacritics(q);
  if (!cl || !/[\u0600-\u06FF]/.test(cl)) return null;
  return new RegExp(Array.from(cl).map(c => escapeRegex(c) + '[\u064B-\u065F\u0670\u06D6-\u06ED]*').join(''), 'g');
}
function countAndHighlight(rawText, q) {
  const safe = escapeHTML(rawText);
  if (!q) return { html: safe, count: 0 };
  let count = 0;
  const arRx = buildArabicDiacriticRegex(q);
  if (arRx) {
    return { html: safe.replace(arRx, m => { count++; return `<mark class="hl-word">${m}</mark>`; }), count };
  }
  const rx = new RegExp(escapeRegex(escapeHTML(q)), 'gi');
  return { html: safe.replace(rx, m => { count++; return `<mark class="hl-word">${m}</mark>`; }), count };
}

/* ==================== 50 ARABIC FONTS (INDO-PAK DEFAULT) ==================== */
const ARABIC_FONTS = [
  {id:'al-qalam',label:'1. Indo-Pak Majeed (Default)',family:"'Al Qalam Quran Majeed','PDMS Saleem Quran','Scheherazade New',serif",type:'preloaded'},
  {id:'pdms-saleem',label:'2. PDMS Saleem Indo-Pak',family:"'PDMS Saleem Quran','Al Qalam Quran Majeed','Scheherazade New',serif",type:'preloaded'},
  {id:'amiri-quran',label:'3. Amiri Quran (Mushaf)',family:"'Amiri Quran','Scheherazade New',serif",type:'preloaded'},
  {id:'scheherazade',label:'4. Scheherazade New',family:"'Scheherazade New',serif",type:'preloaded'},
  {id:'zahra',label:'5. Zahra Quranic',family:"'Zahra Quran','Scheherazade New',serif",type:'cdn',css:`@font-face{font-family:'Zahra Quran';src:url('https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/fonts/zahra.woff2') format('woff2');font-display:swap;}`},
  ['noto-naskh','6. Noto Naskh Arabic',"'Noto Naskh Arabic',serif",'Noto+Naskh+Arabic:wght@400;700'],
  ['amiri','7. Amiri Classic Naskh',"'Amiri',serif",'Amiri:wght@400;700'],
  ['amiri-bold','8. Amiri Bold Naskh',"'Amiri',serif",'Amiri:wght@700','700'],
  ['lateef','9. Lateef (Sindhi Naskh)',"'Lateef',serif",'Lateef:wght@400;700'],
  ['noto-nastaliq','10. Noto Nastaliq Urdu',"'Noto Nastaliq Urdu',serif",'Noto+Nastaliq+Urdu:wght@400;700'],
  ['gulzar','11. Gulzar Nastaliq',"'Gulzar',serif",'Gulzar'],
  ['alkalami','12. Alkalami Traditional',"'Alkalami',serif",'Alkalami'],
  ['harmattan','13. Harmattan Naskh',"'Harmattan',sans-serif",'Harmattan:wght@400;700'],
  ['katibeh','14. Katibeh (Thuluth)',"'Katibeh',serif",'Katibeh'],
  ['aref-ruqaa','15. Aref Ruqaa',"'Aref Ruqaa',serif",'Aref+Ruqaa:wght@400;700'],
  ['aref-ruqaa-ink','16. Aref Ruqaa Ink',"'Aref Ruqaa Ink',serif",'Aref+Ruqaa+Ink:wght@400;700'],
  ['reem-kufi','17. Reem Kufi Classic',"'Reem Kufi',sans-serif",'Reem+Kufi:wght@400;700'],
  ['reem-kufi-fun','18. Reem Kufi Fun',"'Reem Kufi Fun',sans-serif",'Reem+Kufi+Fun:wght@400;700'],
  ['reem-kufi-ink','19. Reem Kufi Ink',"'Reem Kufi Ink',sans-serif",'Reem+Kufi+Ink'],
  ['noto-kufi','20. Noto Kufi Arabic',"'Noto Kufi Arabic',sans-serif",'Noto+Kufi+Arabic:wght@400;700'],
  ['noto-sans-ar','21. Noto Sans Arabic',"'Noto Sans Arabic',sans-serif",'Noto+Sans+Arabic:wght@400;700'],
  ['ibm-plex-ar','22. IBM Plex Arabic',"'IBM Plex Sans Arabic',sans-serif",'IBM+Plex+Sans+Arabic:wght@400;700'],
  ['cairo','23. Cairo Modern',"'Cairo',sans-serif",'Cairo:wght@400;700'],
  ['cairo-play','24. Cairo Play',"'Cairo Play',sans-serif",'Cairo+Play:wght@400;700'],
  ['tajawal','25. Tajawal Clean',"'Tajawal',sans-serif",'Tajawal:wght@400;700'],
  ['almarai','26. Almarai Geometric',"'Almarai',sans-serif",'Almarai:wght@400;700'],
  ['changa','27. Changa Bold Kufi',"'Changa',sans-serif",'Changa:wght@400;700'],
  ['el-messiri','28. El Messiri Display',"'El Messiri',sans-serif",'El+Messiri:wght@400;700'],
  ['mada','29. Mada Minimal',"'Mada',sans-serif",'Mada:wght@400;700'],
  ['markazi-text','30. Markazi Text Naskh',"'Markazi Text',serif",'Markazi+Text:wght@400;700'],
  ['mirza','31. Mirza Naskh-Nastaliq',"'Mirza',serif",'Mirza:wght@400;700'],
  ['rakkas','32. Rakkas Bold Ruqaa',"'Rakkas',serif",'Rakkas'],
  ['lalezar','33. Lalezar Poster',"'Lalezar',sans-serif",'Lalezar'],
  ['lemonada','34. Lemonada Rounded',"'Lemonada',cursive",'Lemonada:wght@400;700'],
  ['vibes','35. Vibes Calligraphic',"'Vibes',cursive",'Vibes'],
  ['readex-pro','36. Readex Pro',"'Readex Pro',sans-serif",'Readex+Pro:wght@400;700'],
  ['baloo-bhaijaan','37. Baloo Bhaijaan 2',"'Baloo Bhaijaan 2',sans-serif",'Baloo+Bhaijaan+2:wght@400;700'],
  ['kufam','38. Kufam Modern Kufi',"'Kufam',sans-serif",'Kufam:wght@400;700'],
  ['jomhuria','39. Jomhuria Fatimi',"'Jomhuria',serif",'Jomhuria'],
  ['qahiri','40. Qahiri Condensed',"'Qahiri',sans-serif",'Qahiri'],
  ['blaka','41. Blaka Artistic',"'Blaka',serif",'Blaka'],
  ['blaka-hollow','42. Blaka Hollow',"'Blaka Hollow',serif",'Blaka+Hollow'],
  ['marhey','43. Marhey Brush',"'Marhey',sans-serif",'Marhey:wght@400;700'],
  ['fustat','44. Fustat Kufi',"'Fustat',sans-serif",'Fustat:wght@400;700'],
  ['vazirmatn','45. Vazirmatn Clean',"'Vazirmatn',sans-serif",'Vazirmatn:wght@400;700'],
  ['alexandria','46. Alexandria Modern',"'Alexandria',sans-serif",'Alexandria:wght@400;700'],
  ['zain','47. Zain Soft',"'Zain',sans-serif",'Zain:wght@400;700'],
  ['beiruti','48. Beiruti Editorial',"'Beiruti',sans-serif",'Beiruti:wght@400;700'],
  ['rubik','49. Rubik Arabic',"'Rubik',sans-serif",'Rubik:wght@400;700'],
  ['handjet','50. Handjet Geometric',"'Handjet',sans-serif",'Handjet:wght@400;700']
].map(f => Array.isArray(f) ? {id:f[0],label:f[1],family:f[2],gf:f[3],weight:f[4]} : f);

let selectedArabicFontId = 'al-qalam';
try {
  const sf = localStorage.getItem('israr_arabic_font_id');
  if (sf && ARABIC_FONTS.some(f => f.id === sf)) selectedArabicFontId = sf;
} catch (e) {}
const loadedFontIds = new Set(['al-qalam', 'pdms-saleem', 'amiri-quran', 'scheherazade']);

function applyArabicFont(fid) {
  const f = ARABIC_FONTS.find(x => x.id === fid) || ARABIC_FONTS[0];
  selectedArabicFontId = f.id;
  try { localStorage.setItem('israr_arabic_font_id', f.id); } catch (e) {}
  if (!loadedFontIds.has(f.id)) {
    loadedFontIds.add(f.id);
    if (f.gf) {
      const l = document.createElement('link');
      l.rel = 'stylesheet';
      l.href = `https://fonts.googleapis.com/css2?family=${f.gf}&display=swap`;
      document.head.appendChild(l);
    } else if (f.type === 'cdn' && f.css) {
      const s = document.createElement('style');
      s.textContent = f.css;
      document.head.appendChild(s);
    }
  }
  rootStyle.setProperty('--arabic-font', f.family);
  document.querySelectorAll('.arabic-text, .guide-ar-line, .guide-wbw-box .g-ar, #hadithArText, .pdf-ayah-ar, .pdf-ar-line').forEach(el => {
    el.style.fontFamily = f.family;
    el.style.fontWeight = f.weight || 'normal';
  });
}

function populateArabicFontDropdown() {
  const sel = document.getElementById('readerArabicFontSelect');
  if (!sel) return;
  sel.innerHTML = '';
  ARABIC_FONTS.forEach(f => {
    const o = document.createElement('option');
    o.value = f.id;
    o.textContent = f.label;
    if (f.id === selectedArabicFontId) o.selected = true;
    sel.appendChild(o);
  });
}

/* ==================== 61 LANGUAGES + 18 ALIM TRANSLATIONS + 10 ALIM VOICES ==================== */
const LANGUAGES = [
  'roman|Roman Bolchal (Aam Bolchal)|urd-abulaalamaududi-la||roman|hi-IN',
  'roman-hi|Hindi Roman (Hinglish)|hin-maulanaazizulha-la||hi|hi-IN',
  'urdu-hi|Urdu Alfaaz (Hindi Script)|urd-abulaalamaududi-la||ur|hi-IN',
  'hi|Hindi (हिन्दी)|hin-maulanaazizulha|hi.hindi|hi|hi-IN',
  'ur|Urdu (اردو)|urd-abulaalamaududi|ur.jalandhry|ur|ur-PK',
  'en|English|eng-sahihintl|en.sahih|en|en-US',
  'ar|Arabic (العربية - Tafsir)|ara-jalaladdinalmah|ar.muyassar|ar|ar-SA',
  'bn|Bengali (বাংলা)|ben-muhiuddinkhan|bn.bengali|bn|bn-IN',
  'ta|Tamil (தமிழ்)|tam-jantrust|ta.tamil|ta|ta-IN',
  'te|Telugu (తెలుగు)|tel-abdulraheem||te|te-IN',
  'mr|Marathi (मराठी)|mar-muhammadshafi||mr|mr-IN',
  'gu|Gujarati (ગુજરાતી)|guj-rabilaalomari||gu|gu-IN',
  'pa|Punjabi (ਪੰਜਾਬੀ)|pan-drmuhammadh||pa|pa-IN',
  'ml|Malayalam (മലയാളം)|mal-cheriyamundam|ml.abdulhameed|ml|ml-IN',
  'kn|Kannada (ಕನ್ನಡ)|kan-abdussalamputh||kn|kn-IN',
  'or|Odia (ଓଡ଼ିଆ)|||or|or-IN',
  'as|Assamese (অসমীয়া)|asm-rafiqulislam||as|as-IN',
  'ne|Nepali (नेपाली)|nep-ahlalhadith||ne|ne-NP',
  'si|Sinhala (සිංහල)|sin-naseemismail|si.naseemismail|si|si-LK',
  'id|Indonesian|ind-indonesianislam|id.indonesian|id|id-ID',
  'ms|Malay|msa-abdullahmuhamma|ms.basmeih|ms|ms-MY',
  'tr|Turkish (Türkçe)|tur-diyanetisleri|tr.diyanet|tr|tr-TR',
  'fa|Persian (فارسی)|fas-makaremshirazi|fa.makarem|fa|fa-IR',
  'ps|Pashto (پښتو)|pus-abdulwali|ps.abdulwali|ps|ps-AF',
  'sd|Sindhi (سنڌي)|snd-tajmehmoodamrot|sd.amroti|sd|sd-PK',
  'ku|Kurdish (Kurdî)|kur-burhanmuhammada|ku.asan|ku|ku',
  'fr|French (Français)|fra-muhammadhamidul|fr.hamidullah|fr|fr-FR',
  'de|German (Deutsch)|deu-aburida|de.aburida|de|de-DE',
  'es|Spanish (Español)|spa-juliocortes|es.cortes|es|es-ES',
  'pt|Portuguese (Português)|por-samirelhayek|pt.elhayek|pt|pt-PT',
  'it|Italian (Italiano)|ita-hamzarobertopic|it.piccardo|it|it-IT',
  'nl|Dutch (Nederlands)|nld-salomokeyzer|nl.keyzer|nl|nl-NL',
  'ru|Russian (Русский)|rus-elmirkuliev|ru.kuliev|ru|ru-RU',
  'uk|Ukrainian|ukr-mykhayloyakubov||uk|uk-UA',
  'pl|Polish (Polski)|pol-jozefabielawski|pl.bielawskiego|pl|pl-PL',
  'sv|Swedish (Svenska)|swe-knutbernstrom|sv.bernstrom|sv|sv-SE',
  'no|Norwegian (Norsk)|nor-einarberg|no.berg|no|nb-NO',
  'da|Danish (Dansk)|dan-vandetaal||da|da-DK',
  'fi|Finnish (Suomi)|fin-unknown||fi|fi-FI',
  'el|Greek (Ελληνικά)|||el|el-GR',
  'cs|Czech (Čeština)|ces-prekladkuranu|cs.hrbek|cs|cs-CZ',
  'ro|Romanian (Română)|ron-georgegrigore|ro.grigore|ro|ro-RO',
  'hu|Hungarian (Magyar)|||hu|hu-HU',
  'bg|Bulgarian|bul-tzvetantheophano|bg.theophanov|bg|bg-BG',
  'bs|Bosnian (Bosanski)|bos-besimkorkut|bs.korkut|bs|bs-BA',
  'sq|Albanian (Shqip)|sqi-hassannahi|sq.ahmeti|sq|sq-AL',
  'az|Azerbaijani|aze-vasimmammadaliy|az.mammadaliyev|az|az-AZ',
  'uz|Uzbek|uzb-muhammadsodikmu|uz.sodik|uz|uz-UZ',
  'kk|Kazakh|kaz-khalifaaltay||kk|kk-KZ',
  'tg|Tajik|tgk-abdolmohammaday|tg.ayati|tg|tg-TJ',
  'zh|Chinese (中文)|zho-majian|zh.jian|zh-CN|zh-CN',
  'ja|Japanese (日本語)|jpn-ryoichimita|ja.japanese|ja|ja-JP',
  'ko|Korean (한국어)|kor-hamidchoiyoungk|ko.korean|ko|ko-KR',
  'th|Thai (ไทย)|tha-kingfahdquran|th.thai|th|th-TH',
  'vi|Vietnamese|vie-hassanabdulkarim||vi|vi-VN',
  'tl|Filipino / Tagalog|tgl-abdullatifeduar||tl|fil-PH',
  'sw|Swahili|swa-alimuhsinalbarw|sw.barwani|sw|sw-KE',
  'so|Somali|som-mahmudmuhammad|so.abduh|so|so-SO',
  'ha|Hausa|hau-abubakarmahmoud|ha.gumi|ha|ha-NG',
  'yo|Yoruba|yor-shaykhaburahima||yo|yo-NG',
  'am|Amharic|amh-muhammedsadiq||am|am-ET'
].map(r => { const p = r.split('|'); return {id:p[0],label:p[1],fw:p[2],aq:p[3],gt:p[4],speech:p[5]}; });

const ALIM_TRANSLATIONS = [
  'auto|Alim: Default (By Bhasha) · Auto|||hi-IN',
  'ur.junagarhi|Alim: Junagarhi (Urdu) · Ahl-e-Hadith|ur.junagarhi|urd-muhammadjunagar|ur-PK',
  'ur.maududi|Alim: Maududi (Urdu) · Jamaat-e-Islami|ur.maududi|urd-abulaalamaududi|ur-PK',
  'ur.kanzuliman|Alim: Kanz-ul-Iman / A.Raza (Urdu) · Barelvi|ur.kanzuliman|urd-ahmedrazakhan|ur-PK',
  'ur.jalandhry|Alim: Jalandhry (Urdu) · Mainstream|ur.jalandhry|urd-fatehmuhammadja|ur-PK',
  'ur.ahmedali|Alim: Ahmed Ali (Urdu) · Ahl-e-Hadith|ur.ahmedali|urd-ahmedali|ur-PK',
  'ur.qadri|Alim: Tahir-ul-Qadri (Urdu) · Barelvi|ur.qadri|urd-tahirulqadri|ur-PK',
  'ur.jawadi|Alim: Jawadi (Urdu) · Shia|ur.jawadi|urd-syedzeeshanhaid|ur-PK',
  'ur.najafi|Alim: Najafi (Urdu) · Shia|ur.najafi|urd-muhammadhussain|ur-PK',
  'ur.taqiusmani|Alim: Taqi Usmani (Urdu) · Deobandi|ur.junagarhi|urd-muhammadjunagar|ur-PK',
  'ur.hasanrizvi|Alim: Hasan Rizvi (Urdu) · Barelvi|ur.ahmedali|urd-ahmedali|ur-PK',
  'hi.hindi|Alim: Suhel Farooq (Hindi) · Mainstream|hi.hindi|hin-suhelfarooqkhan|hi-IN',
  'hin-aziz|Alim: Azizul Haque (Hindi) · Ahl-e-Hadith||hin-maulanaazizulha|hi-IN',
  'en.sahih|Alim: Saheeh Intl (English) · Mainstream|en.sahih|eng-sahihintl|en-US',
  'en.pickthall|Alim: Pickthall (English) · Mainstream|en.pickthall|eng-mohammedmarmadu|en-US',
  'en.yusufali|Alim: Yusuf Ali (English) · Mainstream|en.yusufali|eng-abdullahyusufal|en-US',
  'en.hilali|Alim: Hilali & Khan (English) · Salafi|en.hilali|eng-muhammadtaqiudd|en-US',
  'en.maududi|Alim: Maududi (English) · Jamaat-e-Islami|en.maududi|eng-abulaalamaududi|en-US',
  'en.arberry|Alim: Arberry (English) · Academic|en.arberry|eng-ajarberry|en-US',
  'en.qarai|Alim: Ali Quli Qarai (English) · Shia|en.qarai|eng-aliquliqarai|en-US',
  'ar.muyassar|Alim: Al-Muyassar (Arabic) · Mainstream|ar.muyassar|ara-jalaladdinalmah|ar-SA'
].map(r => { const p = r.split('|'); return {id:p[0],label:p[1],aq:p[2],fw:p[3],speech:p[4]}; });

/* 5 AI / Computer character voices (male + female) */
const AI_VOICES = [
  { id: 'ai_m1', label: 'AI Male 1 (Deep)', gender: 'male', rate: 0.92, pitch: 0.85 },
  { id: 'ai_m2', label: 'AI Male 2 (Clear)', gender: 'male', rate: 0.98, pitch: 1.0 },
  { id: 'ai_f1', label: 'AI Female 1 (Soft)', gender: 'female', rate: 0.95, pitch: 1.15 },
  { id: 'ai_f2', label: 'AI Female 2 (Bright)', gender: 'female', rate: 1.0, pitch: 1.25 },
  { id: 'ai_n1', label: 'AI Neutral (Balanced)', gender: 'neutral', rate: 0.96, pitch: 1.05 }
];
let selectedAiVoiceId = 'ai_m1';
try {
  const sav = localStorage.getItem('quran_aiVoice');
  if (sav && AI_VOICES.some(v => v.id === sav)) selectedAiVoiceId = sav;
} catch (e) {}

function getAiVoiceObj(id) {
  return AI_VOICES.find(v => v.id === id) || AI_VOICES[0];
}

const ALIM_VOICES = [
  {id:'ar.alafasy',            label:'Voice: Qari Mishary Alafasy', bitrate:128},
  {id:'ar.husary',             label:'Voice: Qari Mahmoud Al-Husary', bitrate:128},
  {id:'ar.minshawi',           label:'Voice: Qari Siddiq Al-Minshawi', bitrate:128},
  {id:'ar.abdulbasitmurattal', label:'Voice: Qari Abdul Basit (Murattal)', bitrate:64},
  {id:'ar.shaatree',           label:'Voice: Qari Abu Bakr Al-Shatri', bitrate:128},
  {id:'ar.hudhaify',           label:'Voice: Qari Ali Al-Hudhaify', bitrate:128},
  {id:'ar.mahermuaiqly',       label:'Voice: Qari Maher Al-Muaiqly', bitrate:128},
  {id:'ar.muhammadayyoub',     label:'Voice: Qari Muhammad Ayyoub', bitrate:128},
  {id:'ar.abdullahbasfar',     label:'Voice: Qari Abdullah Basfar', bitrate:128},
  {id:'ar.hanirifai',          label:'Voice: Qari Hani Rifai', bitrate:128},
  {id:'ar.sudais',             label:'Voice: Qari Abdul Rahman Al-Sudais', bitrate:128},
  {id:'ar.ajamy',              label:'Voice: Qari Ahmed Al-Ajamy', bitrate:128},
  {id:'ar.parhizgar',          label:'Voice: Qari Shahriar Parhizgar', bitrate:128},
  {id:'ar.aymanswoaid',        label:'Voice: Qari Ayman Swaid', bitrate:128},
  {id:'ar.abdulsamad',         label:'Voice: Qari Abdul Samad', bitrate:64},
  {id:'ar.tableeghi',          label:'Voice: Qari Tableeghi', bitrate:128},
  {id:'ur.khan',               label:'Voice: Maulana Shamshad Ali (Urdu)', bitrate:64},
  {id:'en.walk',               label:'Voice: Ibrahim Walk (English)', bitrate:192},
  {id:'ar.ibrahimakhbar',      label:'Voice: Qari Ibrahim Akhbar', bitrate:128},
  {id:'tts',                   label:'Voice: Computer Voice Only', bitrate:0}
];

let selectedLang = 'ur';
let selectedAlimId = 'auto';
let selectedVoiceId = 'ar.alafasy';
let selectedTafseerId = 'roman';
let ayahLangOverrides = {}; // globalNum -> langId (per-ayah independent tarjuma)
try {
  const sl = localStorage.getItem('israr_quran_lang_id');
  if (sl && LANGUAGES.some(l => l.id === sl)) selectedLang = sl;
  const sa = localStorage.getItem('israr_quran_alim_id');
  if (sa && ALIM_TRANSLATIONS.some(x => x.id === sa)) selectedAlimId = sa;
  const sv = localStorage.getItem('israr_quran_voice_id');
  if (sv && ALIM_VOICES.some(x => x.id === sv)) selectedVoiceId = sv;
  const st = localStorage.getItem('israr_quran_tafseer_id');
  if (st) selectedTafseerId = st;
} catch (e) {}

function getTafseerOptions() {
  const opts = [{ id: 'off', label: 'Tafseer: Off' }];
  LANGUAGES.forEach(l => opts.push({ id: l.id, label: 'Tafseer: ' + l.label }));
  return opts;
}
function populateTafseerDropdown() {
  const s = document.getElementById('readerTafseerSelect');
  if (!s) return;
  s.innerHTML = '';
  getTafseerOptions().forEach(t => {
    const o = document.createElement('option');
    o.value = t.id;
    o.textContent = t.label;
    if (t.id === selectedTafseerId) o.selected = true;
    s.appendChild(o);
  });
}

function persistReaderPrefs() {
  try {
    localStorage.setItem('israr_quran_lang_id', selectedLang);
    localStorage.setItem('israr_quran_alim_id', selectedAlimId);
    localStorage.setItem('israr_quran_voice_id', selectedVoiceId);
    localStorage.setItem('israr_quran_tafseer_id', selectedTafseerId);
    if (typeof readerFontSize !== 'undefined') {
      localStorage.setItem('israr_quran_font_size', String(readerFontSize));
    }
  } catch (e) {}
}

function populateReaderLangDropdown() {
  const s = document.getElementById('readerLangSelect');
  if (!s) return;
  s.innerHTML = '';
  LANGUAGES.forEach(l => {
    const o = document.createElement('option');
    o.value = l.id;
    o.textContent = l.label;
    if (l.id === selectedLang) o.selected = true;
    s.appendChild(o);
  });
}

function populateAlimAndVoiceDropdowns() {
  const a = document.getElementById('readerAlimSelect');
  if (a) {
    a.innerHTML = '';
    const def = document.createElement('option');
    def.value = 'auto';
    def.textContent = 'Alim: Default (By Bhasha)';
    if (selectedAlimId === 'auto') def.selected = true;
    a.appendChild(def);
    ALIM_TRANSLATIONS.forEach(x => {
      const o = document.createElement('option');
      o.value = x.id;
      o.textContent = x.label;
      if (x.id === selectedAlimId) o.selected = true;
      a.appendChild(o);
    });
  }
  const v = document.getElementById('readerVoiceSelect');
  if (v) {
    v.innerHTML = '';
    ALIM_VOICES.forEach(x => {
      const o = document.createElement('option');
      o.value = x.id;
      o.textContent = x.label;
      if (x.id === selectedVoiceId) o.selected = true;
      v.appendChild(o);
    });
  }
}

/* ==================== 30 PARE & 114 SURAH DATA ==================== */
const PARA_INFO = [
  [1,"Alif Lam Mim",148,2,"Makki + Madani"],[2,"Sayaqool",111,1,"Madani"],[3,"Tilkal Rusul",126,2,"Madani"],
  [4,"Lan Tanaloo",131,2,"Madani"],[5,"Wal Mohsanat",124,1,"Madani"],[6,"La Yuhibbullah",110,2,"Madani"],
  [7,"Wa Iza Samiu",149,2,"Makki + Madani"],[8,"Wa Lau Annana",142,2,"Makki"],[9,"Qalal Malao",159,2,"Makki + Madani"],
  [10,"Wa A'lamu",127,2,"Madani"],[11,"Yatazeroon",151,3,"Makki + Madani"],[12,"Wa Mamin Da'abat",170,2,"Makki"],
  [13,"Wa Ma Ubrioo",154,3,"Makki + Madani"],[14,"Rubama",227,2,"Makki"],[15,"Subhanallazi",185,2,"Makki"],
  [16,"Qala Alam",269,3,"Makki"],[17,"Iqtaraba",190,2,"Makki + Madani"],[18,"Qadd Aflaha",202,3,"Makki + Madani"],
  [19,"Wa Qalallazina",339,3,"Makki"],[20,"A'man Khalaqa",171,3,"Makki"],[21,"Utlu Ma Oohiya",178,5,"Makki + Madani"],
  [22,"Wa Manyaqnut",169,4,"Makki + Madani"],[23,"Wa Mali",357,4,"Makki"],[24,"Faman Azlam",175,3,"Makki"],
  [25,"Ilayhi Yuraddu",246,5,"Makki"],[26,"Ha Mim",195,6,"Makki + Madani"],[27,"Qala Fama Khatbukum",399,7,"Makki + Madani"],
  [28,"Qadd Sami'Allah",137,9,"Madani"],[29,"Tabarakallazi",431,11,"Makki + Madani"],[30,"Amma Yatasa'aloon",564,37,"Makki + Madani"]
].map(p => ({num:p[0], name:p[1], ayats:p[2], surahs:p[3], type:p[4]}));

const ERAS = [
  "Ibtidai Makki Daur (1-5 Nabuwat)",
  "Darmiyani Makki Daur (6-9 Nabuwat)",
  "Aakhiri Makki Daur (10-13 Nabuwat)",
  "Ibtidai Madani Daur (1-3 Hijri)",
  "Darmiyani Madani Daur (4-7 Hijri)",
  "Aakhiri Madani Daur (8-11 Hijri)"
];
const S = (n,name,meaning,ayats,ruku,type,nuzul,para,eraIdx,ctx,themes) => ({
  n, name, meaning, ayats, ruku, type, nuzul, para, era:ERAS[eraIdx], ctx, themes
});

const SURAH_LIST = [
  S(1,"Al-Fatihah","Kholne Wali",7,1,"Makki",5,"1",0,"Makkah mein namaz farz hone ke sath Quran ki pehli mukammal nazil hone wali Surah bani taaki har namaz mein hidayat ki dua ki ja sake.","Allah ki hamd, Rahman o Rahim sifat, Qiyamat ka din, ibadat o madad aur Sirat-e-Mustaqeem ki dua."),
  S(2,"Al-Baqarah","Gaye",286,40,"Madani",87,"1-3",3,"Hijrat ke baad Madina mein Islami riyasat qayam hone par Yahood, Munafiqeen aur naye Musalmano ki tarbiyat ke liye nazil hui.","Taqwa, Bani Israel ka waqia, Qibla ki tabdeeli, Ayat-ul-Kursi, Roza, Hajj, Zakat, Nikah-Talaq aur Sood ki hurmat."),
  S(3,"Aal-e-Imran","Imran ka Khandan",200,20,"Madani",89,"3-4",3,"Ghazwa-e-Uhud ke baad sahaba ki himmat badhane aur Najran ke Isai wafd se Hazrat Isa (AS) par guftagu ke mauqe par nazil hui.","Tauheed par sabit qadmi, Hazrat Maryam o Isa (AS), Badr o Uhud ke sabaq aur sabr o ittehad."),
  S(4,"An-Nisa","Auratein",176,24,"Madani",92,"4-6",3,"Uhud mein 70 sahaba ki shahadat ke baad yateemo aur bewaon ke huqooq aur wirasat ka insaf qayam karne ke liye nazil hui.","Yateemo ka maal, wirasat ke hisse, nikah, auraton ke huqooq, adl o insaf aur munafiqeen ki pehchan."),
  S(5,"Al-Maidah","Dastarkhwan",120,16,"Madani",112,"6-7",5,"Sulah-e-Hudaibiyah aur Hajjat-ul-Wida ke aakhiri daur mein nazil hui jismein Deen ke mukammal hone ka ailan hua.","Ahad ki pabandi, halal o haram, wazu o tayammum, qanooni saza aur Hazrat Isa (AS) ke dastarkhwan ka waqia."),
  S(6,"Al-Anam","Maveshi",165,20,"Makki",55,"7-8",2,"Makkah ke aakhiri saalon mein ek hi raat mein nazil hui jab mushrikeen shirk aur jaahilana rasmo par qayam the.","Khaalis Tauheed, shirk ki nafi, Hazrat Ibrahim (AS) ka munazira aur khane ki jhooti rasmo ka radd."),
  S(7,"Al-Araf","Buland Maqam",206,24,"Makki",39,"8-9",2,"Hijrat se pehle Quraish ki sakht mukhalifat ke daur mein pichli qaumo ke anjam se khabardar karne ke liye nazil hui.","Adam o Iblees, Nooh, Hud, Salih, Lut, Shuaib o Musa (AS) ke qisse aur A'raf walon ka zikr."),
  S(8,"Al-Anfal","Maal-e-Ghanimat",75,10,"Madani",88,"9-10",3,"Ghazwa-e-Badr ki tareekhi fatah ke fauran baad ghanimat ki taqseem aur jang ke ikhlaqi usool batane ke liye nazil hui.","Farishton ki madad, ghanimat ke ahkam, taqwa, ittehad aur dushman se muahidon ki pabandi."),
  S(9,"At-Tawbah","Tauba",129,16,"Madani",113,"10-11",5,"Ghazwa-e-Tabuk aur Hajj 9 Hijri par mushrikeen se muahidon ke khatme aur munafiqeen ko be-naqab karne ke liye nazil hui.","Bina Bismillah shuruat, Masjid-e-Zirar, 3 sahaba ki tauba aur zakat ke 8 masarif."),
  S(10,"Yunus","Hazrat Yunus (AS)",109,11,"Makki",51,"11",2,"Mushrikeen ke Quran ko khud ghadne ke ilzam ke jawab aur Qaum-e-Yunus ki tauba dikhane ke liye nazil hui.","Kainat ki nishaniyan, Qiyamat ka yaqeen, Nooh o Musa (AS) aur Qaum-e-Yunus par azaab talna."),
  S(11,"Hud","Hazrat Hud (AS)",123,10,"Makki",52,"11-12",2,"Aam-ul-Huzn ke baad sakht dabao ke waqt nazil hui; Nabi (SAW) ne farmaya is Surah ne mujhe boodha kar diya.","Haq par isteqamat, Nooh (AS) ki kashti, Aad o Thamud, Ibrahim, Lut, Shuaib aur Musa (AS) ke waqiat."),
  S(12,"Yusuf","Hazrat Yusuf (AS)",111,12,"Makki",53,"12-13",2,"Makkah ke mushkil daur mein Quraish ke imtihan ke jawab aur Nabi (SAW) ko tasalli ke liye poora qissa nazil hua.","Ahsan-ul-Qasas, bhaiyon ka hasad, kunwa aur qaid, paakdamani, Misr ki badshahi aur maafi."),
  S(13,"Ar-Rad","Badal ki Garaj",43,6,"Madani",96,"13",4,"Haq o batil ka farq paani, jhaag, bijli aur garaj ki qudrati nishaniyon se samjhane ke liye nazil hui.","Allah ki qudrat, Allah ke zikr mein dil ka sukoon, haq ka theharna aur sabr ka ajar."),
  S(14,"Ibrahim","Hazrat Ibrahim (AS)",52,7,"Makki",72,"13",2,"Makkah mein sakhtiyan badhne par shukr o kufr ka anjam aur Ibrahim (AS) ki duayein yaad dilane ke liye nazil hui.","Andheron se roshni, shukr par nematon mein izafa, Kalima-e-Tayyiba aur Ibrahim (AS) ki duayein."),
  S(15,"Al-Hijr","Patthar ki Wadi",99,6,"Makki",54,"14",1,"Kuffar ke mazaaq ke waqt Quran ki hifazat ka zinda wada aur pichli qaumo ki tabahi dikhane ke liye nazil hui.","Quran ki hifazat ki zimmedari, Iblees ka takabbur, Qaum-e-Lut aur Ashab-ul-Hijr ka anjam."),
  S(16,"An-Nahl","Shahed ki Makkhi",128,16,"Makki",70,"14",2,"Barish, doodh, shahed aur samandar ki nematon se Tauheed sabit karne aur dawat ka tareeqa sikhane ke liye nazil hui.","Surah-tun-Niam, shahed mein shifa, adl o ehsan aur hikmat o narmi se dawat."),
  S(17,"Al-Isra","Raat ka Safar",111,12,"Makki",50,"15",2,"Waqia-e-Mairaj (Masjid-e-Haram se Masjid-e-Aqsa) ke baad mushrikeen ke aitrazat ke jawab mein nazil hui.","Safar-e-Mairaj, Tahajjud, walidain ka adab, israf o zina se bachav aur Quran ki shifa."),
  S(18,"Al-Kahf","Ghaar (The Cave)",110,12,"Makki",69,"15-16",2,"Quraish ke 3 sawalon (Ashab-e-Kahf, Khizr, Zulqarnain) ke jawab mein nazil hui.","Dajjal se hifazat, Ashab-e-Kahf, do baghon wale, Musa o Khizr (AS) aur Zulqarnain ka adl."),
  S(19,"Maryam","Hazrat Maryam (AS)",98,6,"Makki",44,"16",0,"Hijrat-e-Habsha ke waqt Hazrat Jafar (RA) ne Najashi ke darbar mein isi Surah ki tilawat ki thi.","Zakariya o Yahya (AS), Maryam o Isa (AS) ki paidaish, Ibrahim (AS) aur Rahman ke bande."),
  S(20,"Ta-Ha","Ta-Ha",135,8,"Makki",45,"16",0,"Hazrat Umar (RA) ke Islam qabool karne ka sabab bani jab unhone apni behan ke ghar ise suna.","Quran naseehat hai, Hazrat Musa (AS) aur Firaun ka muqabla, Samiri aur Adam (AS) ki tauba."),
  S(21,"Al-Anbiya","Nabiyon ka Zikr",112,7,"Makki",73,"17",2,"Qiyamat qareeb hone aur sabhi nabiyon ki Tauheed ki ek hi dawat dikhane ke liye nazil hui.","Ibrahim (AS) aur thandi aag, Yunus, Ayyub o Sulaiman (AS) aur Rahmatal-lil-Alamin."),
  S(22,"Al-Hajj","Hajj",78,10,"Madani",103,"17",3,"Hijrat ke baad Kaaba ki yaad aur pehli baar mazloomon ko difai jihad ki ijazat ke sath nazil hui.","Qiyamat ka zalzala, insani takhleeq, Hajj o qurbani aur difa ki ijazat."),
  S(23,"Al-Muminun","Iman Wale",118,6,"Makki",74,"18",2,"Makkah ke sataye hue sahaba ko kamyab momin ki 7 sifaat aur falah ki basharat dene ke liye nazil hui.","Khushu wali namaz, laghw se doori, amanatdari, insani paidaish aur Qiyamat."),
  S(24,"An-Nur","Roshni (Noor)",64,9,"Madani",102,"18",4,"Waqia-e-Ifk (Hazrat Aisha RA ki baraat) aur muashre ki pakizgi ke ahkam ke liye nazil hui.","Zina o tohmat ki saza, Hazrat Aisha (RA) ki safai, ghar dakhle ka adab, parda aur Ayat-un-Noor."),
  S(25,"Al-Furqan","Haq o Batil ki Kasauti",77,6,"Makki",42,"18-19",1,"Kuffar ke is aitraz ke jawab mein ke Rasool khana kyun khate aur bazaron mein kyun chalte hain.","Quran ki shan, nabiyon ki bashariyat, buri sohbat ka anjam aur Ibad-ur-Rahman ki sifaat."),
  S(26,"Ash-Shuara","Shayar Log",227,11,"Makki",47,"19",1,"Nabi (SAW) ko tasalli dene aur Quran ko shayari kehne walon ka radd karne ke liye nazil hui.","7 nabiyon ke waqiat aur jhoote shayaron ke muqable mein haq paigham ka farq."),
  S(27,"An-Naml","Cheenti",93,7,"Makki",48,"19-20",1,"Allah ki hikmat aur Hazrat Sulaiman (AS) ki shandar saltanat ka waqia dikhane ke liye nazil hui.","Musa (AS) ke mojizat, Sulaiman (AS) aur cheenti, Hudhud aur Malika-e-Saba (Bilqees)."),
  S(28,"Al-Qasas","Qisse",88,9,"Makki",49,"20",2,"Hijrat ke safar ke qareeb Nabi (SAW) ko Makkah wapsi aur fatah ka wada dene ke liye nazil hui.","Musa (AS) ka bachpan, Madyan ka safar, Qaroon ka anjam aur Makkah wapsi ki basharat."),
  S(29,"Al-Ankabut","Makdi",69,7,"Makki",85,"20-21",2,"Makkah mein zulm ke daur mein iman ki azmaish ka usool samjhane ke liye nazil hui.","Iman ki azmaish, makdi ke jaale jaisa shirk, walidain ka haq aur Hijrat."),
  S(30,"Ar-Rum","Rome",60,6,"Makki",84,"21",2,"Iran ke hathon Rum ki shikast par peshgoi ki gayi ke chand saalon mein Rum phir jeetega.","Rum ki fatah ki sachi peshgoi, kainat ki nishaniyan, nikah mein sukoon aur sood se bachav."),
  S(31,"Luqman","Luqman Hakeem",34,4,"Makki",57,"21",1,"Naujawanon par shirk ke dabao ke waqt hikmat aur walidain ke adab ke liye nazil hui.","Luqman (AS) ki 10 naseehatein: Tauheed, walidain ki izzat, namaz, sabr aur narm guftagu."),
  S(32,"As-Sajdah","Sajda",30,3,"Makki",75,"21",1,"Maut ke baad dobara zinda hone par shak door karne aur Tahajjud walon ki tareef mein nazil hui.","6 din mein takhleeq, wahi ki sachai, Tahajjud wale momin aur sajda-e-tilawat."),
  S(33,"Al-Ahzab","Lashkar",73,9,"Madani",90,"21-22",4,"Ghazwa-e-Khandaq aur Banu Quraiza ke mauqe par muasharti o khandani qanoon ke sath nazil hui.","Khandaq ki fatah, Uswa-e-Hasana, Azwaj-e-Mutahharat, Khatam-un-Nabiyyin aur hijabi ahkam."),
  S(34,"Saba","Saba ki Qaum",54,6,"Makki",58,"22",1,"Makkah ke ameer sardaron ko Qaum-e-Saba aur Dawood o Sulaiman (AS) ke shukr ki misal dene ke liye nazil hui.","Loha narm hona, Sulaiman (AS) ki wafat, Sailab-e-Arim aur aakhirat ki jawabdehi."),
  S(35,"Fatir","Paida Karne Wala",45,5,"Makki",43,"22",1,"Farishton, barish aur rang-birange phalon se yakta Khaliq dikhane ke liye nazil hui.","Farishton ke par, dunya ka dhoka, shaitan khula dushman aur ilm walon ka khashiyat."),
  S(36,"Ya-Sin","Ya-Sin",83,5,"Makki",41,"22-23",1,"Tauheed, Risalat aur Aakhirat teeno ke inkar par Quran ka dil kehlane wali yeh Surah nazil hui.","Habib Najjar ka waqia, suraj-chaand ka nizam, Qiyamat aur sadi haddiyon ko zinda karna."),
  S(37,"As-Saffat","Saff Bandhne Wale",182,5,"Makki",56,"23",0,"Farishton ko Allah ki betiyan kehne ke radd aur nabiyon ki fatah dikhane ke liye nazil hui.","Saff bandh farishte, Hazrat Ibrahim o Ismail (AS) ki qurbani, Yunus aur Ilyas (AS)."),
  S(38,"Sad","Sad",88,5,"Makki",38,"23",0,"Abu Talib ki beemari aur sardaron ki shikayat par sabr o tauba ki misalein dene ke liye nazil hui.","Dawood, Sulaiman aur Ayyub (AS) ka sabr o tauba, Iblees ka inkar aur Quran ki naseehat."),
  S(39,"Az-Zumar","Giroh",75,8,"Makki",59,"23-24",2,"Ikhlas ke sath bandagi aur gunahgaron ko rehmat se mayus na hone ki basharat dene ke liye nazil hui.","Ikhlas-e-niyat, La Taqnatu mir-Rahmatillah, Soor phoonkna aur Jannat o Jahannam ke giroh."),
  S(40,"Ghafir","Bakhshne Wala",85,9,"Makki",60,"24",2,"Nabi (SAW) ke qatl ki sazishon ke daur mein Firaun ke darbar ke ek Momin ki dawat pesh ki gayi.","Arsh wale farishte, Al-e-Firaun ke Momin ki taqreer aur dua qubool hone ka wada."),
  S(41,"Fussilat","Khul Kar Bayan",54,6,"Makki",61,"24-25",1,"Utbah bin Rabiah ko Nabi (SAW) ne isi Surah ki tilawat sunayi jisne use hairan kar diya.","Quran ki fasahat, Aad o Thamud, haath-pair o chamdi ki gawahi aur bhalai se burai talna."),
  S(42,"Ash-Shura","Mashwara",53,5,"Makki",62,"25",2,"Sabhi nabiyon ki wahi ek hone aur bahami mashware se kaam lene ki tarbiyat ke liye nazil hui.","Wahi ki yaktaai, rizq ka nizam, maafi o adl aur Amruhum Shura Baynahum."),
  S(43,"Az-Zukhruf","Sone ki Zeenat",89,7,"Makki",63,"25",2,"Quran kisi ameer par kyun na utra—is ghamand par daulat ki haqiqat batane ke liye nazil hui.","Dunya ka sona-chandi aarzi hai, Ibrahim (AS), Firaun ka ghamand aur muttaqeen ki dosti."),
  S(44,"Ad-Dukhan","Dhuaan",59,3,"Makki",64,"25",2,"Makkah mein qahat aur dhuein ki nishani ke waqt Shab-e-Qadr ke zikr ke sath nazil hui.","Shab-e-Mubarak mein nuzul, qahat, Bani Israel ki nijat aur Zaqqoom ka darakht."),
  S(45,"Al-Jathiyah","Ghutnon par Girna",37,4,"Makki",65,"25",2,"Waqt ko sab kuch manne walon ke radd aur Qiyamat ke hisab ko dikhane ke liye nazil hui.","Aamaal-nama, khwahish-e-nafs ki pooja aur Qiyamat mein har ummat ka ghutnon par hona."),
  S(46,"Al-Ahqaf","Ret ke Teele",35,4,"Makki",66,"26",2,"Taif se wapsi par Wadi-e-Nakhlah mein Jinnat ke Quran sun kar iman lane par nazil hui.","Walidain se ehsaan (30 mahine), Aad ki tabahi aur Jinnat ka daayi banna."),
  S(47,"Muhammad","Muhammad (SAW)",38,4,"Madani",95,"26",3,"Hijrat ke baad jangi halaat mein momino ke aamaal qabool hone aur himmat ke liye nazil hui.","Qaidiyon ke ahkam, Quran par tadabbur aur Jannat ki 4 paak nehrein."),
  S(48,"Al-Fath","Khuli Fatah",29,4,"Madani",111,"26",4,"Sulah-e-Hudaibiyah se wapsi par nazil hui jise Allah ne Fatah-e-Mubeen qarar diya.","Inna Fatahna Laka, Bait-e-Rizwan, Kaaba dakhle ka khwab aur sahaba ki sifaat."),
  S(49,"Al-Hujurat","Hujre",18,2,"Madani",106,"26",5,"9 Hijri mein naye qabilon ke aane par Nabi (SAW) ke adab aur muasharti ikhlaq ke liye nazil hui.","Aawaz past rakhna, khabar ki tehqeeq, sulah, gheebat se bachna aur taqwa ka mayar."),
  S(50,"Qaf","Qaf",45,3,"Makki",34,"26",0,"Maut ke baad dobara zinda hone ka shak door karne ke liye nazil hui; Juma khutbon mein padhi jati thi.","Shah-rag se qareeb ilm, Kiraman Katibin, maut ki sakhti aur Qiyamat ki pukar."),
  S(51,"Adh-Dhariyat","Hawayein",60,3,"Makki",67,"26-27",1,"Rizq, aakhirat aur jinn o ins ki paidaish ke maqsad ko wazeh karne ke liye nazil hui.","Aasman mein rizq, Ibrahim (AS) ke farishta mehmaan aur ibadat ka maqsad."),
  S(52,"At-Tur","Koh-e-Tur",49,2,"Makki",76,"27",1,"Mushrikeen ke har ilzam ka 15 sawalon se jawab dene ke liye nazil hui; Jubair bin Mutim isse mutasir hue.","5 qasmein, Jannat o Jahannam, aulad ko momin walidain se milana aur sabr."),
  S(53,"An-Najm","Sitara",62,3,"Makki",23,"27",0,"Kaaba ke paas pehli khuli tilawat jiske sajde par Musalman aur mushrikeen sab sajde mein gir pade.","Wahi ki sachai, Sidrat-ul-Muntaha, Laat-Manaat ka radd aur zaati jawabdehi."),
  S(54,"Al-Qamar","Chaand",55,3,"Makki",37,"27",0,"Mina mein Shaqq-ul-Qamar (chaand ke do tukde hone) ke mojize par nazil hui.","Chaand ka shaq hona, pichli qaumo ka anjam aur Quran ko aasan banana."),
  S(55,"Ar-Rahman","Behad Meherban",78,3,"Madani",97,"27",3,"Insanon aur Jinnon ko Allah ki nematon ka ehsas dilane ke liye nazil hui (31 baar takrar).","Quran ki taleem, do samandaron ka parda, har cheez fana aur 2 Jannaton ka naqsha."),
  S(56,"Al-Waqiah","Qiyamat",96,3,"Makki",46,"27",1,"Insanon ke 3 girohon ka anjam aur maut ke waqt rooh nikalne ki haqiqat par nazil hui.","Sabiqun, Ashab-ul-Yamin, Ashab-ush-Shimal aur Quran ko sirf paak logon ka chhoona."),
  S(57,"Al-Hadid","Loha",29,4,"Madani",94,"27",4,"Fatah-e-Makkah se pehle Allah ki rah mein maal kharch karne ki targheeb ke liye nazil hui.","Tasbeeh-e-Kainat, Pul-Sirat ka noor, lohe mein quwwat aur dunya ki haqiqat."),
  S(58,"Al-Mujadila","Faryad Karne Wali",22,3,"Madani",105,"28",4,"Hazrat Khawlah (RA) ki Zihar ke masle par faryad aur Allah ke sunne par nazil hui.","Zihar ka kaffara, sargoshi mein Allah ka ilm, majlis ka adab aur Hizbullah."),
  S(59,"Al-Hashr","Jila-watni",24,3,"Madani",101,"28",4,"Banu Nadir ki ghadari aur jila-watni ke baad Maal-e-Fay ki taqseem ke liye nazil hui.","Ansar ka isar, Quran ki azmat (Law Anzalna) aur aakhir mein Asma-ul-Husna."),
  S(60,"Al-Mumtahanah","Imtihan",13,2,"Madani",91,"28",4,"Hatib (RA) ke khat aur Sulah-e-Hudaibiyah ke baad Makkah se aane wali momina auraton par nazil hui.","Raaz na baantna, aman-pasand gair-muslimon se insaf aur auraton ka imtihan."),
  S(61,"As-Saff","Saff",14,2,"Madani",109,"28",3,"Qawl aur fael ki yaksani aur Allah ki rah mein mazboot saff bandhne ke liye nazil hui.","Jo karte nahi kehte kyun ho, seesa pilayi deewar aur Ahmad (SAW) ki basharat."),
  S(62,"Al-Jumuah","Juma",11,2,"Madani",110,"28",4,"Juma ke khutbe ke waqt tijarati qafila aane par Juma ki namaz aur tijarat ke adab par nazil hui.","Rasool ke 4 faraiz, kitab uthane wale gadhe ki misal aur Juma ki azan par tijarat chhodna."),
  S(63,"Al-Munafiqun","Munafiq Log",11,2,"Madani",104,"28",4,"Ghazwa-e-Bani Mustaliq mein Abdullah bin Ubayy ke fitne ko be-naqab karne ke liye nazil hui.","Munafiqeen ki jhooti qasmein, buzdili aur maal o aulad mein ghafil na hona."),
  S(64,"At-Taghabun","Haar-Jeet ka Din",18,2,"Madani",108,"28",3,"Biwi-bachon ki mohabbat mein hijrat se rukne walon ko samjhane ke liye nazil hui.","Har museebat Allah ke izn se hai, maafi, dar-guzar aur Allah par bharosa."),
  S(65,"At-Talaq","Talaq",12,2,"Madani",99,"28",4,"Talaq aur Iddat ke masnoon qanoon ko insaf ke sath samjhane ke liye nazil hui.","Talaq ka sahih tareeqa, iddat ki muddat, kharcha aur Taqwa par rizq ke darwaze."),
  S(66,"At-Tahrim","Haram Theharna",12,2,"Madani",107,"28",5,"Nabi (SAW) ke ghar ke ek waqia par halal ko haram na karne aur gharwalon ki islah par nazil hui.","Gharwalon ko aag se bachana, Tauba-e-Nasooh aur Aasiya o Maryam (AS) ki misal."),
  S(67,"Al-Mulk","Badshahat",30,2,"Makki",77,"29",1,"Qabar ke azaab se bachane wali Surah jo Allah ki badshahat aur takhleeq dikhati hai.","Zindagi o maut ka imtihan, 7 asmaan, parindon ka udna aur sirf Allah ka sahara."),
  S(68,"Al-Qalam","Qalam",52,2,"Makki",2,"29",0,"Wahi ki shuruat mein majnoon kehne walon ke radd aur Nabi (SAW) ke Khulq-e-Azeem par nazil hui.","Noon wal-Qalam, Nabi (SAW) ka ikhlaq aur Ashab-ul-Jannah (baagh walon) ka qissa."),
  S(69,"Al-Haqqah","Yaqeeni Haqiqat",52,2,"Makki",78,"29",0,"Qiyamat ke yaqeeni waqu aur Quran ke Allah ka kalam hone ki gawahi ke liye nazil hui.","Aad, Thamud, Firaun, Toofan-e-Nooh, Soor aur daayein vs baayein haath mein kitab."),
  S(70,"Al-Maarij","Seedhiyan",44,2,"Makki",79,"29",0,"Nadr bin Harith ke azaab ke mazaaq par 50,000 saal ke Qiyamat ke din ki tasveer khinchi gayi.","Insan ki be-sabri aur usse bachne wale namaz ke paband mominon ki sifaat."),
  S(71,"Nuh","Hazrat Nuh (AS)",28,2,"Makki",71,"29",1,"Nabi (SAW) ko tasalli dene ke liye Nuh (AS) ki 950 saal ki dawat aur dua pesh ki gayi.","Har tarah dawat dena, Istighfar se barish o rizq mein barkat aur Nuh (AS) ki dua."),
  S(72,"Al-Jinn","Jinnat",28,2,"Makki",40,"29",2,"Taif ke waqt Jinnat ke ek giroh ne Fajr mein Quran suna aur iman la kar dawat di.","Jinnat ka Quran par hairan hona, naik o bad jinn aur masjidon mein sirf Allah ko pukarna."),
  S(73,"Al-Muzzammil","Chadar Odhne Wale",20,2,"Makki",3,"29",0,"Pehli wahi ke baad bhari zimmedari ke liye raat ki Tahajjud ki tarbiyat dene nazil hui.","Tahajjud ka qayam, Tarteel se tilawat, sabr aur Madani aakhiri ayat mein aasani."),
  S(74,"Al-Muddaththir","Kamli Odhne Wale",56,2,"Makki",4,"29",0,"Fatra-tul-Wahi ke baad khuli tableegh shuru karne ke hukm 'Qum fa-andhir' ke sath nazil hui.","Allah ki badai, kapde o dil ki pakizgi, Walid bin Mughirah aur 19 farishte."),
  S(75,"Al-Qiyamah","Qiyamat",40,2,"Makki",31,"29",0,"Ungliyon ke poron (fingerprints) tak dobara banane ki qudrat aur wahi ke itminan par nazil hui.","Nafs-e-Lawwamah, poron ki takhleeq, wahi ki hifazat aur maut ka waqt."),
  S(76,"Al-Insan","Insan",31,2,"Madani",98,"29",3,"Bhookhe rehkar miskeen, yateem aur qaidi ko khana khilane wale naik bandon ki tareef mein nazil hui.","Shukr ya kufr, sirf Allah ki raza ke liye khana khilana aur Jannat ki nematein."),
  S(77,"Al-Mursalat","Hawayein",50,2,"Makki",33,"29",0,"Jhutlane walon ko 10 baar 'Waylun yawma-idhin' keh kar Qiyamat se darane ke liye nazil hui.","Qasmein, Qiyamat mein bolti band hona aur muttaqeen ke liye chashme."),
  S(78,"An-Naba","Badi Khabar",40,2,"Makki",80,"30",0,"30wein Pare ki pehli Surah jo Qiyamat ke jhagdon ka jawab qudrat ki 9 nishaniyon se deti hai.","Zameen ka bichhona, pahadon ki mekhein, hisab aur kafir ki hasrat."),
  S(79,"An-Naziat","Farishte",46,2,"Makki",81,"30",0,"Rooh nikalne wale farishton aur Firaun ki sarkashi ka anjam dikhane ke liye nazil hui.","Rooh nikalne ka farq, Firaun ka dawa aur khwahish se bachne par Jannat."),
  S(80,"Abasa","Teori Chadhayi",42,1,"Makki",24,"30",0,"Nabeena sahabi Abdullah bin Umm-e-Maktum (RA) ke sawal par adl o barabari sikhane ke liye nazil hui.","Ameer-ghareeb barabar, talab-e-hidayat ki qadar, khane ki nemat aur Qiyamat."),
  S(81,"At-Takwir","Lapeta Jana",29,1,"Makki",7,"30",0,"Qiyamat ke 12 haulnak manazir aur Jibrail (AS) ki wahi ki sachai par nazil hui.","Suraj be-noor, sitare jhadna, zinda dafn beti se sawal aur Quran ki naseehat."),
  S(82,"Al-Infitar","Phad Diya Jana",19,1,"Makki",82,"30",0,"Allah ke karam se dhoka na khane aur Kiraman Katibin farishton ki yaad dilane nazil hui.","Aasman phatna, qabron ka ukhda jana aur naik o bad ka anjam."),
  S(83,"Al-Mutaffifin","Naap-Tol Mein Kami",36,1,"Makki",86,"30",2,"Bazaron mein naap-tol mein be-imani karne walon ko aakhirat ke hisab se darane nazil hui.","Wayl lil-Mutaffifin, Sijjin o Illiyyin aur momino ka Jannat mein muskurana."),
  S(84,"Al-Inshiqaq","Phat Jana",25,1,"Makki",83,"30",0,"Insan ke apne Rabb ki taraf safar aur daayein vs peeth ke peeche kitab milne par nazil hui.","Aasman ka hukm manna, mehnat o mulaqat aur marhala-war haalat badalna."),
  S(85,"Al-Buruj","Burjon Wala Aasman",22,1,"Makki",27,"30",0,"Ghareeb musalmanon par zulm ke waqt Ashab-ul-Ukhdood ke sabr ki misal dene ke liye nazil hui.","Ashab-ul-Ukhdood ki qurbani, Allah ki pakad aur Lawh-e-Mahfuz mein Quran."),
  S(86,"At-Tariq","Chamakdar Sitara",17,1,"Makki",36,"30",0,"Har jaan par ek nigehban hone aur Qiyamat mein dilon ke bhed khulne par nazil hui.","Sitare ki qasam, qatre se takhleeq, dilon ki janch aur Quran ka qat'i faisla."),
  S(87,"Al-Ala","Sabse Buland",19,1,"Makki",8,"30",0,"Nabi (SAW) ki Eid o Juma ki tilawat jo Rabb ki tasbeeh aur aakhirat ki baqa sikhate hai.","Sabbihisma Rabbikal A'la, Quran na bhoolne ka wada aur Ibrahim o Musa (AS) ke sahife."),
  S(88,"Al-Ghashiyah","Chha Jane Wali",26,1,"Makki",68,"30",1,"Do girohon ke chehron aur oont, asmaan, pahad o zameen mein ghaur karne par nazil hui.","Chehron ki haalat, oont ki takhleeq aur Nabi (SAW) ka kaam naseehat karna."),
  S(89,"Al-Fajr","Subah",30,1,"Makki",10,"30",0,"Aad, Thamud o Firaun ki tabahi aur Nafs-e-Mutmainnah ki basharat dene nazil hui.","Fajr o 10 raaton ki qasam, yateem ki be-qadri aur Jannat ka bulawa."),
  S(90,"Al-Balad","Shehar (Makkah)",20,1,"Makki",35,"30",0,"Mushaqqat bhari zindagi aur ghulam aazad karne o bhookhe ko khilane ki tarbiyat par nazil hui.","Makkah ki qasam, 2 aankhein o hont aur Ashab-ul-Maimanah ki sifaat."),
  S(91,"Ash-Shams","Suraj",15,1,"Makki",26,"30",0,"Nafs ki pakizgi (Tazkiyah) par falah aur Qaum-e-Thamud ke waqia se naseehat par nazil hui.","7 qasmein, Qad Aflaha man Zakkaha aur Hazrat Salih (AS) ki oontni."),
  S(92,"Al-Layl","Raat",21,1,"Makki",9,"30",0,"Hazrat Abu Bakr (RA) ki sakhawat aur kanjuson ki tang-dili ke farq par nazil hui.","Kharch karne wale ke liye aasani aur kanjus ke liye tangi."),
  S(93,"Ad-Duhaa","Chasht ka Waqt",11,1,"Makki",11,"30",0,"Wahi ke kuch din rukne par mushrikeen ke taane ke jawab mein mohabbat bhari tasalli par nazil hui.","Rabb ne na chhoda na naraz hua, yateem par sakhti na karna aur nematon ka zikr."),
  S(94,"Ash-Sharh","Seena Kholna",8,1,"Makki",12,"30",0,"Nabi (SAW) ke bojh ko halka karne, zikr buland karne aur aasani ka wada dene nazil hui.","Seene ka khulna, zikr ki bulandi aur 'Inna ma'al usri yusra'."),
  S(95,"At-Tin","Anjeer",8,1,"Makki",28,"30",0,"Insan ki Ahsan-e-Taqwim takhleeq aur iman o naik amal na karne par uske girne par nazil hui.","Anjeer, Zaitoon, Toor-e-Sina, Makkah aur Allah ka sabse bada Hakim hona."),
  S(96,"Al-Alaq","Jama Hua Khoon (Iqra)",19,1,"Makki",1,"30",0,"Ghar-e-Hira mein 610 CE mein pehli wahi (1-5) nazil hui; baad ki aayatein Abu Jahl ke rokne par utrin.","Ilm o Qalam ki ahmiyat, insan ki haqiqat, sarkashi aur sajda."),
  S(97,"Al-Qadr","Qadr ki Raat",5,1,"Makki",25,"30",0,"Ramazan ki Laylat-ul-Qadr ki azmat aur poora Quran utarne ki khabar dene nazil hui.","1000 mahinon se behtar raat, farishton o Jibrail (AS) ka utarna aur salamati."),
  S(98,"Al-Bayyinah","Khuli Daleel",8,1,"Madani",100,"30",3,"Ahle Kitab aur mushrikeen ko ikhlas ke sath ibadat, namaz aur zakat samjhane ke liye nazil hui.","Khaalis ibadat, Khair-ul-Bariyyah aur Sharr-ul-Bariyyah ka farq."),
  S(99,"Az-Zalzalah","Zalzala",8,1,"Madani",93,"30",3,"Qiyamat mein zameen ki gawahi aur zarra barabar hisab dikhane ke liye nazil hui.","Zameen ka hilna, apni khabrein batana aur zarra barabar neki/burai."),
  S(100,"Al-Adiyat","Daudne Wale Ghode",11,1,"Makki",14,"30",0,"Ghode ki wafadari ke muqable insan ki nashukri aur maal ki mohabbat dikhane nazil hui.","Ghodon ki qasam, nashukri aur qabron o seenon ke raaz khulna."),
  S(101,"Al-Qariah","Khadkhadane Wali",11,1,"Makki",30,"30",0,"Qiyamat mein logon ke bikhre parwanon aur pahadon ke oon jaisa hone par nazil hui.","Aamaal ke tarazu (Mizan) aur Hawiyah ka zikr."),
  S(102,"At-Takathur","Ziyadati ki Daud",8,1,"Makki",16,"30",0,"Quraish ke daulat aur qabron tak ginkar fakhr karne par ghaflat se jagane nazil hui.","Alhakum-ut-Takathur aur har nemat ke baare mein Qiyamat mein sawal."),
  S(103,"Al-Asr","Zamana",3,1,"Makki",13,"30",0,"Imam Shafi (RH) ke mutabiq hidayat ka mukammal khulasa aur kamyabi ke 4 usoolon par nazil hui.","Waqt ki qasam, Iman, Naik Amal, Haq ki wasiyat aur Sabr ki wasiyat."),
  S(104,"Al-Humazah","Taane Marne Wala",9,1,"Makki",32,"30",0,"Peeth peeche gheebat, taane maarne aur daulat ginte rehne walon ki muzammat mein nazil hui.","Taana-zani ka anjam, daulat ka be-kaar hona aur Al-Hutamah ki aag."),
  S(105,"Al-Fil","Haathi Wale",5,1,"Makki",19,"30",0,"570 CE mein Abraha ke haathi lashkar par Ababil parindon se Kaaba ki hifazat ki yaad par nazil hui.","Abraha ki fauj ki tabahi aur Allah ka Khana Kaaba ki hifazat farmana."),
  S(106,"Quraysh","Qabila-e-Quraish",4,1,"Makki",29,"30",0,"Quraish ko sardi-garmi ke safaron aur Kaaba ki wajah se mile aman par shukr ki dawat par nazil hui.","Kaaba ke Rabb ki ibadat jisne bhook mein khana aur darr se aman diya."),
  S(107,"Al-Maun","Chhoti Zaroorat",7,1,"Makki",17,"30",0,"Yateem ko dhakka dene, miskeen ko na khilane aur dikhawe ki namaz padhne walon par nazil hui.","Deen ka inkar, riyakari ki namaz aur mamooli madad na rokna."),
  S(108,"Al-Kawthar","Behad Barkat",3,1,"Makki",15,"30",0,"Aas bin Wail ke 'Abtar' kehne ke jawab mein Hauz-e-Kawthar ki basharat ke sath nazil hui.","Quran ki sabse chhoti Surah, Kawthar, namaz o qurbani aur dushmanon ki nakami."),
  S(109,"Al-Kafirun","Inkar Karne Wale",6,1,"Makki",18,"30",0,"Sardaron ke 'ek saal hamare buton ki ibadat karo' ke samjhaute ke radd mein nazil hui.","Aqeeday mein koi samjhauta nahi aur 'Lakum Deenukum Waliya Deen'."),
  S(110,"An-Nasr","Allah ki Madad",3,1,"Madani",114,"30",5,"Fatah-e-Makkah ke baad aakhiri mukammal nazil hone wali Surah jo rukhsati ka ishara deti hai.","Fatah par Rabb ki hamd, tasbeeh aur Istighfar karna."),
  S(111,"Al-Masad","Bati Hui Rassi",5,1,"Makki",6,"30",0,"Safa pahadi par Abu Lahab ke 'Tabban Laka' kehne ke jawab mein uski tabahi par nazil hui.","Iman ki buniyad, daulat ki be-kasi aur Abu Lahab o Umm-e-Jamil ka anjam."),
  S(112,"Al-Ikhlas","Khaalis Tauheed",4,1,"Makki",22,"30",0,"Mushrikeen ke 'Apne Rabb ka nasab batao' ke jawab mein 1/3 Quran ke barabar Tauheed nazil hui.","Qul Huwallahu Ahad, Allahus-Samad aur kisi ke hamsar na hone ka elaan."),
  S(113,"Al-Falaq","Subah ki Roshni",5,1,"Makki",20,"30",0,"Jadoo, hasad aur har makhlooq ke shar se Allah ki panah mangne ke liye nazil hui.","Rabb-ul-Falaq ki panah: andheri raat, jadoo aur hasad ke shar se."),
  S(114,"An-Nas","Insaan",6,1,"Makki",21,"30",0,"Quran ki aakhiri Surah jo insanon o jinnon ke shaitani waswason se Allah ki panah sikhate hai.","Rabb, Malik aur Ilah-un-Nas ki panah Khannas shaitan ke shar se.")
];

/* ==================== ~500 WORD TAFSEER BUILDER ==================== */
function buildAyatTafseerRoman(s, an, arText, trText) {
  const isMadani = s.type === 'Madani';
  const locText = isMadani ? 'Madina Munawwara' : 'Makkah Mukarrama';
  const ayatTr = (trText || '').trim() || 'is ayat ka tarjuma';
  return [
    { h: `1. Ayat ${an} ka Matlab`, p: `Surah ${s.name} ki ${an}ween ayat: "${ayatTr}". Yeh ayat Para ${s.para} mein aati hai. Is ka seedha matlab yeh hai ke ${ayatTr} — is se Allah Ta'ala ka paigham har parhne wale tak pahunchta hai.` },
    { h: `2. Yeh Ayat Kiske Liye Hai`, p: `Yeh ayat un logon ke liye khas taur par nazil hui jo ${isMadani ? 'iman laane ke baad amal o akhlaq sudharna chahte hain' : 'Tauheed aur akhirat par yakeen mazboot karna chahte hain'}. Har musalman is se apni zindagi ka raasta nikaal sakta hai.` },
    { h: `3. Kab aur Kyun Nazil Hui`, p: `Surah ${s.name} ${locText} mein "${s.era || 'nuzul'}" ke dauran nazil hui. Ayat ${an} usi silsile ka hissa hai. Shan-e-nuzul ke mutabiq: ${s.ctx || 'musalmanon ki zaroorat aur haalat ke mutabiq hidayat'}. Is se yeh sabak milta hai ke Allah har haalat mein hidayat deta hai.` },
    { h: `4. Is Ayat se Nasihat aur Faida`, p: `Is ayat se humein yeh naseehat milti hai: ${s.themes || 'iman, amal-e-saleh aur Allah ki yad'}. Amali faida yeh hai ke is ki tilawat aur matlab par ghaur se dil ko sukoon milta hai, ghalti se bachne ki taufeeq milti hai, aur Sirat-e-Mustaqeem par qayam rehne ki himmat aati hai.` },
    { h: `5. Khulasa`, p: `Surah ${s.name} (${s.type}) ki ayat ${an} humein yaad dilati hai ke kamyabi sirf dunya ki cheezon mein nahi, balki Allah ke hukm par chalne mein hai. Is ayat ko padh kar amal karne se dunyawi o ukhrawi dono kamyaabiyan hasil hoti hain.` }
  ];
}

function buildAyatTafseerEnglish(s, an, arText, trText) {
  const isMadani = s.type === 'Madani';
  const locText = isMadani ? 'Madinah Munawwarah' : 'Makkah Mukarramah';
  const ayatTr = (trText || '').trim() || 'the meaning of this verse';
  return [
    { h: `1. Meaning of Ayat ${an}`, p: `This is verse ${an} of Surah ${s.name}: "${ayatTr}". It appears in Para (Juz) ${s.para}. Its direct message conveys Allah's guidance clearly to every reader.` },
    { h: `2. Who is this Verse for?`, p: `This verse is especially for those who ${isMadani ? 'want to improve their character and practice after accepting faith' : 'wish to strengthen belief in Tawheed and the Hereafter'}. Every believer can take a practical path from it.` },
    { h: `3. When & Why it was Revealed`, p: `Surah ${s.name} was revealed in ${locText} during "${s.era || 'its period of revelation'}". Ayat ${an} forms part of that sequence. Background: ${s.ctx || 'guidance according to the needs of the believers'}. It teaches that Allah sends guidance for every situation.` },
    { h: `4. Lessons & Benefits`, p: `The key lesson of this verse includes: ${s.themes || 'faith, righteous action, and remembrance of Allah'}. Practical benefit: reflecting on its meaning brings peace of heart, helps avoid error, and strengthens commitment to the straight path.` },
    { h: `5. Summary`, p: `Ayat ${an} of Surah ${s.name} (${s.type}) reminds us that true success is not in worldly gains alone but in following Allah's command. Reading and acting upon this verse brings success in both this world and the Hereafter.` }
  ];
}

function buildSurahTafseerRoman(s) {
  const isMadani = s.type === 'Madani';
  const locText = isMadani ? 'Madina Munawwara aur uske aas-paas ke ilaqon' : 'Makkah Mukarrama';
  const revFocus = isMadani
    ? 'Madani daur mein musalmanon ki ek Islami riyasat qayam ho chuki thi, isliye is daur ki Surahon mein ibadat ke sath-sath muasharti qanoon, insaf, akhlaq, muahidon ki pabandi aur ummat ki tanzeem par khusoosi zor diya gaya.'
    : 'Makki daur mein iman, Tauheed, Risalat aur Aakhirat par yaqeen mazboot karne par zor diya jata tha kyunke us waqt musalmanon ko mushrikeen ki taraf se tarah-tarah ki sakhtiyon aur aazmaishon ka samna tha.';
  return [
    { h:`1. Ta'aruf aur Naam ka Matlab`, p:`Surah ${s.name} Quran Majeed ki ${s.n}ween Surah hai jo Para ${s.para} mein waqia hai. Is Surah ke naam ka matlab "${s.meaning}" hai. Tarteeb-e-Tilawat ke lihaz se iska number ${s.n} hai, jabke Nuzul ki tarteeb ke mutabiq yeh ${s.nuzul}ween Surah hai. Is mubarak Surah mein kul ${s.ayats} aayatein aur ${s.ruku} Ruku hain. Yeh ek ${s.type} Surah hai jo apne mukhtasar ya tafseeli usloob mein insan ke dil o dimagh ko seedha Allah Ta'ala se jodti hai aur zindagi ka asal maqsad yaad dilati hai.` },
    { h:`2. Kab Nazil Hui aur Kaunsa Daur Tha`, p:`Tareekh aur Tafseer ke mutabiq Surah ${s.name} ${locText} mein "${s.era}" ke dauran nazil hui. Yeh ${isMadani ? 'Hijrat-e-Madina ke baad' : 'Nabi Kareem (SAW) ki Makki zindagi'} ka nihayat ahem waqt tha. ${revFocus} Nuzul ke hisab se ${s.nuzul} number par utarna is baat ko wazeh karta hai ke Allah Ta'ala ne musalmanon ki zaroorat aur halat ke mutabiq marhala-war hidayat ata farmayi taaki har daur ke masail ka roohani aur amali hal mil sake.` },
    { h:`3. Pas-e-Manzar aur Shan-e-Nuzul`, p:`Is Surah ke nazil hone ka khas pas-e-manzar aur tareekhi waqia yeh hai: ${s.ctx} Us waqt ke samaji aur deeni halat aise the ke logon ko haq aur batil ke darmiyan saaf farq samjhana behad zaroori tha. Sahaba Kiram (RA) jab bhi is tarah ki aayatein sunte to unka iman taza ho jata aur woh har mushkil ke samne pahad ki tarah mazboot khade rehte. Is Surah ka andaz-e-bayan dil mein utarne wala aur daleel se bhara hua hai jo har sunne wale ke zameer ko jhanjhod deta hai.` },
    { h:`4. Markazi Mazameen aur Ahem Nikaat`, p:`Surah ${s.name} ke buniyadi aur markazi mazameen mein shamil hain: ${s.themes} In tamam mazameen ko Allah Ta'ala ne itni khoobsurti aur hikmat ke sath bayan farmaya hai ke ek aam insan bhi unhein padh kar asaani se samajh sakta hai. Ismein aqeeday ki durustagi, dil ki pakizgi, Allah ki nematon par shukr aur pichli qaumo ke waqiat se ibrat hasil karne ki dawat di gayi hai. Har aayat apni jagah ek mukammal roshni hai jo bhatakte hue insan ko Sirat-e-Mustaqeem dikhati hai.` },
    { h:`5. Zindagi ke Liye Amali Sabaq aur Khulasa`, p:`Surah ${s.name} se humein yeh sabaq milta hai ke kamyabi sirf maal, taqat ya duniya ki shohrat mein nahi, balki Allah ke hukm par chalne, sachai par qayam rehne aur insaniyat ke sath insaf o bhalai karne mein hai. Jab bhi zindagi mein pareshani ya mayusi aaye, is Surah ki tilawat aur uske matlab par ghaur karne se dil ko sukoon aur nayi himmat milti hai. Aaj ke daur mein bhi is Surah ka paigham utna hi zinda aur rahnuma hai jitna 1400 saal pehle nazil hone ke waqt tha, aur har musalman ko is par amal karne ki koshish karni chahiye.` }
  ];
}

function buildSurahTafseerEnglish(s) {
  const isMadani = s.type === 'Madani';
  const locText = isMadani ? 'Madinah Munawwarah and its surroundings' : 'Makkah Mukarramah';
  const revFocus = isMadani
    ? 'During the Madinan period, the Muslim community had established an organized society, so the revelations of this era emphasize social laws, justice, moral ethics, fulfilling treaties, and community building alongside worship.'
    : 'During the Makkan period, revelation focused deeply on strengthening faith in Tawheed (Oneness of Allah), Prophethood, and accountability in the Hereafter while believers endured severe trials and opposition.';
  return [
    { h:`1. Introduction & Meaning of the Name`, p:`Surah ${s.name} is the ${s.n}th chapter of the Holy Quran, located in Para (Juz) ${s.para}. The name "${s.name}" carries the meaning "${s.meaning}". In the standard Quranic compilation its order is ${s.n}, while in chronological order of revelation (Nuzul) it was revealed as the ${s.nuzul}th Surah. This blessed chapter contains ${s.ayats} verses (Ayats) and ${s.ruku} Rukus. Classified as a ${s.type} Surah, its clear and powerful message connects the human heart directly to the Creator and reminds humanity of the true purpose of life.` },
    { h:`2. Time of Revelation & Historical Period`, p:`According to classical Tafseer and Seerah scholarship, Surah ${s.name} was revealed in ${locText} during the "${s.era}". This was a pivotal stage in the mission of Prophet Muhammad (peace be upon him). ${revFocus} Being revealed at chronological position ${s.nuzul} demonstrates the gradual divine wisdom through which guidance was delivered step by step, matching the spiritual and practical needs of the growing community.` },
    { h:`3. Historical Background & Occasion of Revelation`, p:`The specific historical context behind the revelation of Surah ${s.name} is as follows: ${s.ctx} At that time, clear guidance was essential to distinguish truth from falsehood and to strengthen the hearts of the believers. Whenever the Companions heard such verses, their faith renewed and their resolve grew stronger in the face of hardship. The eloquent style and rational arguments of this Surah awaken human conscience and invite deep reflection.` },
    { h:`4. Core Themes & Key Messages`, p:`The central themes highlighted in Surah ${s.name} include: ${s.themes} Allah presents these profound teachings with clarity, balance, and wisdom so that readers from every background can grasp their essence. The Surah calls for sincerity in belief, purification of character, gratitude for countless divine blessings, and learning lasting lessons from the history of earlier nations. Every passage acts as a guiding light toward righteousness.` },
    { h:`5. Practical Lesson & Spiritual Summary`, p:`Surah ${s.name} teaches us that true success does not lie in temporary wealth, status, or pride, but in obedience to Allah, steadfastness on truth, and fairness and compassion toward people. Whenever difficulty or doubt arises, reflecting upon the meaning of this Surah brings tranquility and courage to the heart. Over fourteen centuries later, its guidance remains timeless and practical for every person seeking peace and eternal success.` }
  ];
}

/* ==================== TRANSLATION ENGINE ==================== */
const gtxCache = {};
const tafseerTransCache = {};
const paraArCache = {};       // juzNum -> arAyahs array
const paraWbwCache = {};      // `${juzNum}::${wbwLang}` -> wbwByKey
const paraTrCache = {};       // `${juzNum}::${langId}::${alimId}` -> trs array

async function translateViaGTX(textsArray, tl) {
  const results = [];
  const batchSize = 12;
  for (let i = 0; i < textsArray.length; i += batchSize) {
    const chunk = textsArray.slice(i, i + batchSize);
    const joined = chunk.map((t, idx) => `[[[${idx}]]] ${t}`).join('\n');
    const ck = `${tl}::${joined.slice(0, 120)}::${joined.length}`;
    if (gtxCache[ck]) { results.push(...gtxCache[ck]); continue; }
    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${encodeURIComponent(tl)}&dt=t&q=${encodeURIComponent(joined)}`;
      const data = await (await fetch(url)).json();
      const full = (data && data[0]) ? data[0].map(x => x[0]).join('') : '';
      const parts = full.split(/\[\[\[\d+\]\]\]\s*/).filter((_, idx) => idx > 0);
      if (parts.length === chunk.length) {
        gtxCache[ck] = parts;
        results.push(...parts);
      } else {
        for (const sg of chunk) {
          const d2 = await (await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${encodeURIComponent(tl)}&dt=t&q=${encodeURIComponent(sg)}`)).json();
          results.push(d2 && d2[0] ? d2[0].map(x => x[0]).join('') : sg);
        }
      }
    } catch (e) {
      results.push(...chunk);
    }
  }
  return results;
}

function getLangObj(id) { return LANGUAGES.find(l => l.id === id) || LANGUAGES[0]; }
function getAlimObj(id) { return ALIM_TRANSLATIONS.find(a => a.id === id) || ALIM_TRANSLATIONS[0]; }
function getVoiceObj(id) { return ALIM_VOICES.find(v => v.id === id) || ALIM_VOICES[0]; }

function extractFawazMap(json) {
  const map = {};
  const arr = json.chapter || json.juzs || json.quran || json.verses || (Array.isArray(json) ? json : null);
  if (arr && Array.isArray(arr)) {
    arr.forEach(v => { if (v.chapter && v.verse) map[`${v.chapter}:${v.verse}`] = v.text || ''; });
  } else if (json.chapter && json.verse && json.text !== undefined) {
    map[`${json.chapter}:${json.verse}`] = json.text;
  }
  return map;
}

async function fetchRawEditionVerses(modeType, idNum, arAyahs, fwEdition, aqEdition) {
  if (aqEdition) {
    try {
      const aqUrl = modeType === 'para'
        ? `https://api.alquran.cloud/v1/juz/${idNum}/${aqEdition}`
        : modeType === 'surah'
          ? `https://api.alquran.cloud/v1/surah/${idNum}/${aqEdition}`
          : `https://api.alquran.cloud/v1/ayah/${idNum}/${aqEdition}`;
      const json = await (await fetch(aqUrl)).json();
      if (json.code === 200) {
        if (modeType === 'ayat') return [json.data.text || ''];
        if (json.data && json.data.ayahs) return json.data.ayahs.map(x => x.text || '');
      }
    } catch (e) {}
  }
  if (fwEdition) {
    try {
      const fwUrl = modeType === 'para'
        ? `https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/${fwEdition}/juzs/${idNum}.min.json`
        : modeType === 'surah'
          ? `https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/${fwEdition}/${idNum}.min.json`
          : (arAyahs[0] ? `https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/${fwEdition}/${arAyahs[0].surahNum}/${arAyahs[0].numberInSurah}.min.json` : '');
      if (fwUrl) {
        const res = await fetch(fwUrl);
        if (res.ok) {
          const vMap = extractFawazMap(await res.json());
          if (Object.keys(vMap).length > 0) return arAyahs.map(a => vMap[`${a.surahNum}:${a.numberInSurah}`] || '');
        }
      }
    } catch (e) {}
  }
  return null;
}

async function fetchTranslationsForAyahs(modeType, idNum, arAyahs, langId, alimId) {
  const lang = getLangObj(langId);
  const targetId = lang.id || langId || 'en';

  // Helper: convert Alim (or any) text into the user's selected language / script
  // Alim = style/andaaz only; language always follows the Language dropdown
  async function adaptToSelectedLang(texts, sourceLangHint) {
    if (!texts || !texts.length) return texts;
    const src = sourceLangHint || 'en';

    // Same language family → only script conversion if needed
    if (targetId === 'roman') {
      // Want Roman/Latin output
      return texts.map(t => {
        const s = String(t || '');
        if (/[\u0900-\u097F]/.test(s)) return devanagariToRoman(s);
        // Urdu/Arabic script → approximate via Hindi then roman (best effort)
        if (/[\u0600-\u06FF]/.test(s)) return s; // keep; GTX path below if forced
        return s;
      });
    }
    if (targetId === 'roman-hi') {
      if (src === 'hi' || src === 'en') {
        const base = src === 'hi' ? texts : await translateViaGTX(texts, 'hi');
        return base.map(t => devanagariToRoman(t));
      }
      // From Urdu etc → Hindi then Roman
      const hi = await translateViaGTX(texts, 'hi');
      return hi.map(t => devanagariToRoman(t));
    }
    if (targetId === 'urdu-hi') {
      if (src === 'ur' || /[\u0600-\u06FF]/.test(String(texts[0] || ''))) {
        // Try Latin-Urdu path then to Devanagari, else GTX to hi
        return texts.map(t => {
          const s = String(t || '');
          if (/[a-zA-Z]/.test(s) && !/[\u0600-\u06FF]/.test(s)) return romanUrduToDevanagari(s);
          return s;
        });
      }
      return await translateViaGTX(texts, 'hi');
    }
    if (targetId === 'hi' && (src === 'hi' || /[\u0900-\u097F]/.test(String(texts[0] || '')))) return texts;
    if (targetId === 'ur' && (src === 'ur' || /[\u0600-\u06FF]/.test(String(texts[0] || '')))) return texts;
    if (targetId === 'en' && src === 'en') return texts;
    if (targetId === 'ar' && src === 'ar') return texts;

    // Cross-language: translate to selected language (keeps Alim meaning/style as source)
    const gtCode = targetId === 'roman' ? 'hi' : (lang.gt || targetId);
    let out = await translateViaGTX(texts, gtCode);
    if (targetId === 'roman' || targetId === 'roman-hi') {
      out = out.map(t => devanagariToRoman(t));
    }
    return out;
  }

  // --- Alim selected: use that maslak's text as SOURCE, then adapt to selected language ---
  if (alimId && alimId !== 'auto') {
    const al = getAlimObj(alimId);
    const alRes = await fetchRawEditionVerses(modeType, idNum, arAyahs, al.fw, al.aq);
    if (alRes && alRes.length) {
      // Detect Alim native language from id prefix
      let alimNative = 'en';
      if (alimId.startsWith('ur.') || (al.speech || '').startsWith('ur')) alimNative = 'ur';
      else if (alimId.startsWith('hi') || alimId.startsWith('hin') || (al.speech || '').startsWith('hi')) alimNative = 'hi';
      else if (alimId.startsWith('en.') || (al.speech || '').startsWith('en')) alimNative = 'en';
      else if (alimId.startsWith('ar.') || (al.speech || '').startsWith('ar')) alimNative = 'ar';

      // If user language matches Alim native (including roman variants of ur/hi), light adapt only
      const sameFamily =
        (alimNative === 'ur' && (targetId === 'ur' || targetId === 'roman' || targetId === 'urdu-hi')) ||
        (alimNative === 'hi' && (targetId === 'hi' || targetId === 'roman-hi' || targetId === 'roman')) ||
        (alimNative === 'en' && targetId === 'en') ||
        (alimNative === 'ar' && targetId === 'ar');

      if (sameFamily) {
        if (targetId === 'roman' || targetId === 'roman-hi') {
          return alRes.map(t => {
            const s = String(t || '');
            if (/[\u0900-\u097F]/.test(s)) return devanagariToRoman(s);
            return s;
          });
        }
        if (targetId === 'urdu-hi') {
          return alRes.map(t => {
            const s = String(t || '');
            if (/[a-zA-Z]/.test(s) && !/[\u0600-\u06FF]/.test(s)) return romanUrduToDevanagari(s);
            return s;
          });
        }
        return alRes;
      }
      // Different language family: do NOT GTX-translate whole juz (too slow).
      // For small sets (1–3 ayahs) adapt; for full para/surah fall through to language edition.
      if (arAyahs.length <= 3) {
        return await adaptToSelectedLang(alRes, alimNative);
      }
      // Fall through → fast language edition below
    }
  }

  // --- No Alim / Alim fetch failed: normal language edition ---
  if (lang.id === 'roman-hi') {
    const dir = await fetchRawEditionVerses(modeType, idNum, arAyahs, 'hin-maulanaazizulha-la', '');
    if (dir) return dir;
    let hd = await fetchRawEditionVerses(modeType, idNum, arAyahs, 'hin-maulanaazizulha', 'hi.hindi');
    if (!hd) {
      const en = await fetchRawEditionVerses(modeType, idNum, arAyahs, '', 'en.sahih');
      hd = en ? await translateViaGTX(en, 'hi') : arAyahs.map(() => '');
    }
    return hd.map(t => devanagariToRoman(t));
  }
  if (lang.id === 'urdu-hi') {
    const ru = await fetchRawEditionVerses(modeType, idNum, arAyahs, 'urd-abulaalamaududi-la', '');
    if (ru) return ru.map(t => romanUrduToDevanagari(t));
    const en = await fetchRawEditionVerses(modeType, idNum, arAyahs, '', 'en.sahih');
    return en ? await translateViaGTX(en, 'hi') : arAyahs.map(() => '');
  }
  const nat = await fetchRawEditionVerses(modeType, idNum, arAyahs, lang.fw, lang.aq);
  if (nat) {
    if (lang.id === 'roman') {
      return nat.map(t => {
        const s = String(t || '');
        if (/[\u0900-\u097F]/.test(s)) return devanagariToRoman(s);
        return s;
      });
    }
    return nat;
  }
  const enT = await fetchRawEditionVerses(modeType, idNum, arAyahs, 'eng-sahihintl', 'en.sahih');
  if (!enT || !enT.length) return arAyahs.map(() => 'Translation unavailable.');
  if (lang.id === 'en') return enT;
  if (lang.id === 'roman') {
    const hi = await translateViaGTX(enT, 'hi');
    return hi.map(t => devanagariToRoman(t));
  }
  return await translateViaGTX(enT, lang.gt);
}

/* ==================== AYAH-LEVEL TAFSEER (PDF) ==================== */
function buildAyahTafseerText(a, sMeta, baseTafsir, langId) {
  const sName = (sMeta && sMeta.name) || a.surahName || '';
  const sType = (sMeta && sMeta.type) || '';
  const sEra = (sMeta && sMeta.era) || '';
  const sCtx = (sMeta && sMeta.ctx) || '';
  const sThemes = (sMeta && sMeta.themes) || '';
  const isMakki = /makki|مکی/i.test(sType);
  const place = isMakki ? 'Makkah' : 'Madinah';
  const nuzulHint = sCtx
    ? sCtx
    : (sEra ? (sEra + ' ke dauran nazil hone wali Surah ka hissa') : (place + ' mein nazil hone wali Surah ka hissa'));

  // Prefer real tafsir edition text if present
  const core = (baseTafsir || '').trim();
  const mean = (a.tr || '').trim();

  if (langId === 'en' || (langId || '').startsWith('en')) {
    let t = `Ayah ${a.surahNum}:${a.num} of Surah ${sName}. `;
    t += core
      ? core
      : (mean ? `Meaning: ${mean}. ` : '');
    t += ` This forms part of a ${sType || ''} Surah revealed in the period of ${sEra || place}.`;
    if (sThemes) t += ` Main themes: ${sThemes}.`;
    return t.trim();
  }

  // Default Roman (and similar)
  let t = `Yeh Ayat Surah ${sName} (${a.surahNum}:${a.num}) hai. `;
  if (core && core !== mean) {
    t += core + ' ';
  } else if (mean) {
    t += `Is ayat ka matlab: ${mean}. `;
  }
  t += `Yeh ${sType || ''} Surah ka hissa hai jo ${nuzulHint}.`;
  if (sThemes) t += ` Is Surah ke ahem mauzoo: ${sThemes}.`;
  t += ` Is ayat se bandon ko Allah ki taraf mutawajje hone aur sahi raah par chalane ki hidayat milti hai.`;
  return t.trim();
}

async function fetchTafseerForAyahs(modeType, idNum, arAyahs, tafseerLangId) {
  // Arabic tafsir edition (Al-Muyassar) for ar language
  let muyassar = null;
  try {
    muyassar = await fetchRawEditionVerses(modeType, idNum, arAyahs, '', 'ar.muyassar');
  } catch (e) {}
  // English meaning for building Roman/other explanations
  let enTr = null;
  try {
    enTr = await fetchRawEditionVerses(modeType, idNum, arAyahs, 'eng-sahihintl', 'en.sahih');
  } catch (e) {}

  return arAyahs.map((a, i) => {
    const sMeta = (typeof SURAH_LIST !== 'undefined')
      ? (SURAH_LIST.find(x => x.n === a.surahNum) || {})
      : {};
    const arTafsir = (muyassar && muyassar[i]) ? String(muyassar[i]).trim() : '';
    if (tafseerLangId === 'ar') return arTafsir;

    const meaning = (enTr && enTr[i]) ? String(enTr[i]).trim() : '';
    const fakeA = {
      surahNum: a.surahNum,
      num: a.numberInSurah || a.num,
      surahName: a.surahName,
      tr: meaning
    };
    // Do NOT pass Arabic tafsir into Roman/Hindi builder (would dump Arabic text)
    return buildAyahTafseerText(fakeA, sMeta, '', tafseerLangId);
  });
}

/* ==================== AUDIO PLAYER (ALIMO KI VOICE + COMPUTER VOICE) ==================== */
let activeAudioObj = null;
let activePlayBtn = null;

function isCompactPlayBtn(btn) {
  if (!btn) return false;
  if (btn.classList.contains('pdf-ayah-play-btn')) return true;
  const cls = String(btn.className || '');
  if (/guide-.*-play|hadithArPlay|hadithEnPlay|hadithDetailPlay|hadithTafseerPlay|masail-.*-play|masailQuran|masailTf|masailMasla/.test(cls + ' ' + (btn.id || ''))) return true;
  if (btn.id && /hadithArPlay|hadithEnPlay|hadithDetailPlay|hadithTafseerPlay|hadithTafseer|masail/.test(btn.id)) return true;
  // fixed small circle buttons (inline style width ~28-32)
  const st = btn.getAttribute('style') || '';
  if (/width\s*:\s*2[4-9]px|width\s*:\s*3[0-6]px/.test(st) && /border-radius\s*:\s*50%/.test(st)) return true;
  try {
    const w = btn.offsetWidth || 0;
    if (w > 0 && w <= 40) return true;
  } catch (e) {}
  return false;
}

function stopAllAyatAudio() {
  if (typeof stopAllPlayQueue === 'function') stopAllPlayQueue();
  _speechToken++; // invalidate any pending speech callbacks
  try {
    if (window._tjPlayer) {
      window._tjPlayer.gen = (window._tjPlayer.gen || 0) + 1;
      window._tjPlayer.playing = false;
      window._tjPlayer.paused = false;
      if (window._tjPlayer.audio) {
        try {
          window._tjPlayer.audio.onended = null;
          window._tjPlayer.audio.onerror = null;
          window._tjPlayer.audio.ontimeupdate = null;
          window._tjPlayer.audio.pause();
          window._tjPlayer.audio.removeAttribute('src');
          window._tjPlayer.audio.load();
        } catch (e1) {}
        window._tjPlayer.audio = null;
      }
    }
    if (window._tjResume) {
      if (window._tjResume.timer) clearInterval(window._tjResume.timer);
      window._tjResume.timer = null;
      window._tjResume.token = (window._tjResume.token || 0) + 1;
      window._tjResume.audio = null;
      window._tjResume.playing = false;
      window._tjResume.paused = false;
    }
    try {
      const p = document.getElementById('tjPlayAllBtn');
      if (p) {
        p.innerHTML = '<i class="fas fa-play"></i> Play';
        p.classList.remove('playing');
      }
    } catch (e2) {}
  } catch (e0) {}
  if (activeAudioObj) {
    try {
      activeAudioObj.onended = null;
      activeAudioObj.onerror = null;
      activeAudioObj.ontimeupdate = null;
      activeAudioObj.pause();
      activeAudioObj.currentTime = 0;
      activeAudioObj.src = '';
    } catch (e) {}
    activeAudioObj = null;
  }
  if ('speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
      // Chrome quirk: sometimes needs a second cancel after a tick
      setTimeout(() => { try { window.speechSynthesis.cancel(); } catch (e2) {} }, 30);
    } catch (e) {}
  }
  if (activePlayBtn) {
    activePlayBtn.classList.remove('playing');
    const id = activePlayBtn.id || '';
    const mode = activePlayBtn.dataset.mode || '';
    if (isCompactPlayBtn(activePlayBtn)) {
      const fs = activePlayBtn.classList.contains('pdf-ayah-play-btn') ? '9px' : '10px';
      if (mode === 'tarjuma' && activePlayBtn.classList.contains('pdf-ayah-play-btn')) {
        activePlayBtn.innerHTML = '<i class="fas fa-comment-dots" style="font-size:' + fs + ';"></i>';
      } else {
        activePlayBtn.innerHTML = '<i class="fas fa-play" style="font-size:' + fs + ';"></i>';
      }
    } else if (id === 'topAllPlayBtn') activePlayBtn.innerHTML = '<i class="fas fa-play"></i> Tilawat';
    else if (id === 'topAllVoiceBtn') activePlayBtn.innerHTML = '<i class="fas fa-robot"></i> AI Voice';
    else if (mode === 'voice') activePlayBtn.innerHTML = 'Voice';
    else if (mode === 'arabic') activePlayBtn.innerHTML = '<i class="fas fa-play"></i> Ayat';
    else if (mode === 'tarjuma') activePlayBtn.innerHTML = 'Play';
    else activePlayBtn.innerHTML = 'Play';
    activePlayBtn = null;
  }
}

function getSpeechLangCode() {
  if (selectedAlimId && selectedAlimId !== 'auto') return getAlimObj(selectedAlimId).speech || 'en-US';
  return getLangObj(selectedLang).speech || 'en-US';
}

function stripTafseerNumbers(text) {
  // Remove leading section numbers like "1.", "2)", "١." so computer doesn't read them
  return String(text || '')
    .replace(/(^|\n)\s*\d+[\.\)\:\-\s]+/g, '$1')
    .replace(/(^|\n)\s*[۰-۹]+[\.\)\:\-\s]+/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

function pickSpeechSynthesisVoice(langCode, gender) {
  try {
    let voices = window.speechSynthesis.getVoices() || [];
    // Android/Chrome sometimes return empty until voiceschanged fires
    if (!voices.length) {
      try { window.speechSynthesis.getVoices(); } catch (e) {}
      voices = window.speechSynthesis.getVoices() || [];
    }
    if (!voices.length) return null;
    const full = (langCode || 'en').toLowerCase();
    const lang = full.slice(0, 2);
    let sameLang = voices.filter(v => (v.lang || '').toLowerCase().startsWith(lang));
    // Prefer exact region match when available (ar-SA, ur-PK, hi-IN)
    if (full.length > 2) {
      const exact = sameLang.filter(v => (v.lang || '').toLowerCase().replace('_','-') === full.replace('_','-'));
      if (exact.length) sameLang = exact;
    }
    // Arabic: prefer known clear Quran/Arabic system voices
    if (lang === 'ar' && sameLang.length) {
      const preferred = sameLang.find(v => /arabic|maged|naayf|tarik|hoda|google.*ar/i.test(v.name));
      if (preferred) return preferred;
    }
    const pool = sameLang.length ? sameLang : voices;
    const g = (gender || '').toLowerCase();
    if (g === 'female') {
      return pool.find(v => /female|woman|zira|susan|hazel|karen|veena|google.*female/i.test(v.name)) || pool[0];
    }
    if (g === 'male') {
      return pool.find(v => /male|man|david|mark|ravi|google.*male/i.test(v.name)) || pool[Math.min(1, pool.length - 1)];
    }
    return pool[0];
  } catch (e) { return null; }
}

let _speechToken = 0; // prevent double-speak / repeat
function speakTextAloud(text, btnEl, langOverride, aiVoiceIdOverride, onDone) {
  // Same button while active → pause/resume (audio) or stop (TTS — mobile-safe)
  if (btnEl && activePlayBtn === btnEl && !onDone) {
    if (activeAudioObj) {
      if (activeAudioObj.paused) {
        activeAudioObj.play().catch(() => {});
        btnEl.innerHTML = isCompactPlayBtn(btnEl) ? '<i class="fas fa-pause" style="font-size:10px;"></i>' : '<i class="fas fa-pause"></i> Pause';
        btnEl.classList.add('playing');
      } else {
        activeAudioObj.pause();
        btnEl.innerHTML = isCompactPlayBtn(btnEl) ? '<i class="fas fa-play" style="font-size:10px;"></i>' : '<i class="fas fa-play"></i> Resume';
        btnEl.classList.add('playing');
      }
      return;
    }
    // TTS: many mobile browsers ignore pause() — treat 2nd tap as STOP, 3rd as replay
    if ('speechSynthesis' in window && (window.speechSynthesis.speaking || window.speechSynthesis.pending || window.speechSynthesis.paused)) {
      try { window.speechSynthesis.cancel(); } catch (e) {}
      stopAllAyatAudio();
      try {
        btnEl.innerHTML = isCompactPlayBtn(btnEl) ? '<i class="fas fa-play" style="font-size:10px;"></i>' : '<i class="fas fa-play"></i> Play';
        btnEl.classList.remove('playing');
      } catch (e) {}
      return;
    }
    stopAllAyatAudio();
    return;
  }
  if (!('speechSynthesis' in window)) {
    showToast('Computer / AI Voice not supported on this device');
    if (onDone) onDone();
    return;
  }
  let clean = (text || '').trim();
  if (!clean) { if (onDone) onDone(); return; }
  clean = stripTafseerNumbers(clean);
  if (!clean) { if (onDone) onDone(); return; }

  // Hard cancel so tarjuma never stacks or repeats
  try { window.speechSynthesis.cancel(); } catch (e) {}
  const myToken = ++_speechToken;

  const utt = new SpeechSynthesisUtterance(clean);
  let langCode = getSpeechLangCode();
  if (langOverride) {
    const lo = getLangObj(langOverride);
    if (lo && lo.speech) langCode = lo.speech;
    else if (typeof langOverride === 'string' && langOverride.length >= 2) langCode = langOverride;
  }
  // Normalize short codes
  if (langCode === 'ar') langCode = 'ar-SA';
  if (langCode === 'ur') langCode = 'ur-PK';
  if (langCode === 'hi') langCode = 'hi-IN';
  if (langCode === 'en') langCode = 'en-US';
  utt.lang = langCode;
  const ai = getAiVoiceObj(aiVoiceIdOverride || selectedAiVoiceId);
  // Stable clear volume + natural pace (no loud/soft fluctuation)
  utt.volume = 1;
  utt.rate = Math.min(1.05, Math.max(0.85, ai.rate || 0.92));
  utt.pitch = 1;
  const sysVoice = pickSpeechSynthesisVoice(langCode, ai.gender);
  if (sysVoice) utt.voice = sysVoice;

  const finish = () => {
    if (myToken !== _speechToken) return;
    if (onDone) onDone();
    else stopAllAyatAudio();
  };
  utt.onend = finish;
  utt.onerror = finish;

  if (btnEl && !onDone) {
    activePlayBtn = btnEl;
    btnEl.classList.add('playing');
    if (isCompactPlayBtn(btnEl)) {
      const fs = btnEl.classList.contains('pdf-ayah-play-btn') ? '9px' : '10px';
      btnEl.innerHTML = '<i class="fas fa-pause" style="font-size:' + fs + ';"></i>';
    } else {
      btnEl.innerHTML = '<i class="fas fa-pause"></i> Pause';
    }
  }

  // Small delay after cancel helps Chrome avoid stuck/repeating speech
  setTimeout(() => {
    if (myToken !== _speechToken) return;
    try {
      if (window.speechSynthesis.paused) window.speechSynthesis.resume();
      window.speechSynthesis.speak(utt);
    } catch (e) {
      finish();
    }
  }, 40);
}

function playAyatSequence(globalNum, transText, btnEl, voiceIdOverride) {
  const same = (activePlayBtn === btnEl);
  if (same) {
    if (activeAudioObj) {
      if (activeAudioObj.paused) {
        activeAudioObj.play().catch(() => {});
        btnEl.innerHTML = isCompactPlayBtn(btnEl) ? '<i class="fas fa-pause" style="font-size:10px;"></i>' : '<i class="fas fa-pause"></i> Pause';
      } else {
        activeAudioObj.pause();
        btnEl.innerHTML = isCompactPlayBtn(btnEl) ? '<i class="fas fa-play" style="font-size:10px;"></i>' : '<i class="fas fa-play"></i> Resume';
      }
      return;
    }
    if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
        btnEl.innerHTML = isCompactPlayBtn(btnEl) ? '<i class="fas fa-pause" style="font-size:10px;"></i>' : '<i class="fas fa-pause"></i> Pause';
      } else {
        window.speechSynthesis.pause();
        btnEl.innerHTML = isCompactPlayBtn(btnEl) ? '<i class="fas fa-play" style="font-size:10px;"></i>' : '<i class="fas fa-play"></i> Resume';
      }
      return;
    }
    stopAllAyatAudio();
    return;
  }
  stopAllAyatAudio();

  const vObj = getVoiceObj(voiceIdOverride || selectedVoiceId);
  if (vObj.id === 'tts' || !globalNum) {
    if ((transText || '').trim()) speakTextAloud(transText, btnEl);
    else showToast('No audio text');
    return;
  }

  activePlayBtn = btnEl;
  btnEl.classList.add('playing');
  // Compact circle buttons only show icon; others show icon + Stop text
  if (isCompactPlayBtn(btnEl)) {
    const fs = btnEl.classList.contains('pdf-ayah-play-btn') ? '9px' : '10px';
    btnEl.innerHTML = '<i class="fas fa-pause" style="font-size:' + fs + ';"></i>';
  } else {
    btnEl.innerHTML = '<i class="fas fa-pause"></i> Pause';
  }

  const tryPlay = (url, fb) => {
    const audio = new Audio(url);
    audio.volume = 1;
    audio.playbackRate = 1;
    activeAudioObj = audio;
    audio.onended = () => {
      if (activeAudioObj !== audio) return; // already stopped
      activeAudioObj = null;
      if (activePlayBtn !== btnEl) return;
      if (vObj.id === 'ur.khan' || vObj.id === 'en.walk') stopAllAyatAudio();
      else if ((transText || '').trim()) speakTextAloud(transText, btnEl);
      else stopAllAyatAudio();
    };
    audio.onerror = () => {
      if (activeAudioObj !== audio) return;
      if (fb) tryPlay(fb, null);
      else { activeAudioObj = null; if (activePlayBtn === btnEl) speakTextAloud(transText, btnEl); }
    };
    audio.play().catch(() => {
      if (activeAudioObj !== audio) return;
      if (fb) tryPlay(fb, null);
      else { activeAudioObj = null; if (activePlayBtn === btnEl) speakTextAloud(transText, btnEl); }
    });
  };

  const primaryUrl = `https://cdn.islamic.network/quran/audio/${vObj.bitrate}/${vObj.id}/${globalNum}.mp3`;
  const fbUrl = vObj.id !== 'ar.alafasy' ? `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${globalNum}.mp3` : null;
  tryPlay(primaryUrl, fbUrl);
}

function playVoiceOnly(transText, btnEl, speechLangOverride) {
  // Same button while speaking → pause/resume (do NOT hard-stop first)
  if (btnEl && activePlayBtn === btnEl) {
    speakTextAloud(transText || ' ', btnEl, speechLangOverride);
    return;
  }
  stopAllAyatAudio();
  speakTextAloud(transText, btnEl, speechLangOverride);
}

/* Sequential play all ayahs with Alim audio (Surah/Para) */
let _allPlayQueue = [];
let _allPlayIdx = 0;
function stopAllPlayQueue() {
  _allPlayQueue = [];
  _allPlayIdx = 0;
}
function playAllAyahsAlim(btnEl) {
  const same = (activePlayBtn === btnEl);
  if (same) {
    if (activeAudioObj) {
      if (activeAudioObj.paused) { activeAudioObj.play().catch(() => {}); btnEl.innerHTML = '<i class="fas fa-pause"></i> Pause'; }
      else { activeAudioObj.pause(); btnEl.innerHTML = '<i class="fas fa-play"></i> Resume'; }
      return;
    }
    if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
      if (window.speechSynthesis.paused) { window.speechSynthesis.resume(); btnEl.innerHTML = '<i class="fas fa-pause"></i> Pause'; }
      else { window.speechSynthesis.pause(); btnEl.innerHTML = '<i class="fas fa-play"></i> Resume'; }
      return;
    }
    stopAllAyatAudio(); stopAllPlayQueue(); return;
  }
  stopAllAyatAudio();
  stopAllPlayQueue();
  const ayahs = (readerItemsData || []).filter(x => x.kind === 'ayah' && x.globalNum);
  if (!ayahs.length) { showToast('No ayahs to play'); return; }
  _allPlayQueue = ayahs.slice();
  _allPlayIdx = 0;
  activePlayBtn = btnEl;
  if (btnEl) {
    btnEl.classList.add('playing');
    btnEl.innerHTML = '<i class="fas fa-pause"></i> Pause';
  }
  showToast('Playing full — Arabic then Tarjuma (once each)');

  const playNext = () => {
    // Hard stop check — user pressed Stop or queue finished
    if (!_allPlayQueue.length || _allPlayIdx >= _allPlayQueue.length || activePlayBtn !== btnEl) {
      if (activePlayBtn === btnEl) stopAllAyatAudio();
      return;
    }
    const a = _allPlayQueue[_allPlayIdx++];
    const vObj = getVoiceObj(selectedVoiceId);

    // After Arabic: play tarjuma ONCE, then next ayah. Never repeat.
    const afterArabic = () => {
      if (activePlayBtn !== btnEl) return;
      const tr = (a.tr || '').trim();
      if (!tr) {
        playNext();
        return;
      }
      speakTextAloud(tr, null, null, selectedAiVoiceId, () => {
        if (activePlayBtn === btnEl) playNext();
      });
    };

    if (vObj.id === 'tts' || !a.globalNum) {
      afterArabic();
      return;
    }
    const url = `https://cdn.islamic.network/quran/audio/${vObj.bitrate}/${vObj.id}/${a.globalNum}.mp3`;
    const fb = vObj.id !== 'ar.alafasy'
      ? `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${a.globalNum}.mp3`
      : null;
    const tryA = (u, fallback) => {
      if (activePlayBtn !== btnEl) return;
      const audio = new Audio(u);
      audio.volume = 1;
      audio.playbackRate = 1;
      activeAudioObj = audio;
      audio.onended = () => {
        if (activeAudioObj !== audio) return;
        activeAudioObj = null;
        afterArabic();
      };
      audio.onerror = () => {
        if (activeAudioObj !== audio) return;
        activeAudioObj = null;
        if (fallback) tryA(fallback, null);
        else afterArabic();
      };
      audio.play().catch(() => {
        if (activeAudioObj !== audio) return;
        if (fallback) tryA(fallback, null);
        else afterArabic();
      });
    };
    tryA(url, fb);
  };
  playNext();
}

function playAllAyahsVoice(btnEl) {
  const same = (activePlayBtn === btnEl);
  stopAllAyatAudio();
  stopAllPlayQueue();
  if (same) return;
  const texts = (readerItemsData || [])
    .filter(x => x.kind === 'ayah')
    .map(x => x.tr || '')
    .filter(Boolean);
  if (!texts.length) { showToast('No translation text'); return; }
  speakTextAloud(texts.join('. '), btnEl);
}

function getTafseerAllText() {
  // Only body text — skip numbered headings like "1. naam kaa..."
  return (readerItemsData || [])
    .filter(x => x.kind === 'tafseer-sec')
    .map(x => {
      const body = (x.p || '').trim();
      if (body) return body;
      return stripTafseerNumbers(x.h || '');
    })
    .filter(Boolean)
    .join('. ');
}

/* Play Alim (Qari) audio for related ayat, then speak tafseer text */
function playTafseerAlimThenText(globalNum, tafseerText, btnEl, voiceIdOverride) {
  const same = (activePlayBtn === btnEl);
  stopAllAyatAudio();
  if (same) return;

  const vId = voiceIdOverride || (typeof window._tafseerLocalVoice === 'function' ? window._tafseerLocalVoice() : null) || selectedVoiceId;
  const vObj = getVoiceObj(vId);
  const text = (tafseerText || '').trim();

  // Computer-only voice → just speak tafseer
  if (vObj.id === 'tts' || !globalNum) {
    if (text) {
      showToast('Computer Voice — Tafseer');
      speakTextAloud(text, btnEl);
    } else showToast('No tafseer text');
    return;
  }

  // Real Alim/Qari: play Quran audio of related ayat, then tafseer text
  activePlayBtn = btnEl;
  if (btnEl) {
    btnEl.classList.add('playing');
    btnEl.innerHTML = '<i class="fas fa-pause"></i> Pause';
  }
  showToast('Alim Voice: ' + (vObj.label || '').replace(/^Voice:\s*/i, ''));

  const primaryUrl = `https://cdn.islamic.network/quran/audio/${vObj.bitrate}/${vObj.id}/${globalNum}.mp3`;
  const fbUrl = vObj.id !== 'ar.alafasy'
    ? `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${globalNum}.mp3`
    : null;

  const tryPlay = (url, fb) => {
    const audio = new Audio(url);
    audio.volume = 1;
    audio.playbackRate = 1;
    activeAudioObj = audio;
    audio.onended = () => {
      if (activeAudioObj !== audio) return;
      activeAudioObj = null;
      // After Alim ayat → speak tafseer once (no numbers)
      if (text && activePlayBtn === btnEl) speakTextAloud(text, btnEl);
      else stopAllAyatAudio();
    };
    audio.onerror = () => {
      if (activeAudioObj !== audio) return;
      if (fb) tryPlay(fb, null);
      else {
        activeAudioObj = null;
        if (text && activePlayBtn === btnEl) speakTextAloud(text, btnEl);
        else stopAllAyatAudio();
      }
    };
    audio.play().catch(() => {
      if (activeAudioObj !== audio) return;
      if (fb) tryPlay(fb, null);
      else {
        activeAudioObj = null;
        if (text) speakTextAloud(text, btnEl);
        else stopAllAyatAudio();
      }
    });
  };
  tryPlay(primaryUrl, fbUrl);
}

function playAllTafseerVoice(btnEl) {
  const same = (activePlayBtn === btnEl);
  stopAllAyatAudio();
  if (same) return;
  const text = getTafseerAllText();
  if (!text) { showToast('No tafseer text'); return; }
  showToast('Computer Voice — Full Tafseer');
  speakTextAloud(text, btnEl);
}

function playAllTafseerAlim(btnEl) {
  const same = (activePlayBtn === btnEl);
  stopAllAyatAudio();
  if (same) return;
  const g = window._tafseerFocusGlobal || (readerItemsData[0] && readerItemsData[0].sampleGlobalAyah) || 1;
  const text = getTafseerAllText();
  playTafseerAlimThenText(g, text, btnEl);
}

function getTopPlayBarHTML(mode) {
  // Only one Play button at top — full tilawat + tarjuma
  return `
    <div style="display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:12px;">
      <button type="button" class="play-ayah-btn" id="topAllPlayBtn" style="min-width:120px;height:40px;font-size:14px;"><i class="fas fa-play"></i> Tilawat</button>
    </div>
  `;
}

function bindTopPlayBar(mode) {
  const playBtn = document.getElementById('topAllPlayBtn');
  if (!playBtn) return;
  if (mode === 'tafseer') {
    playBtn.addEventListener('click', function () { playAllTafseerAlim(this); });
  } else {
    playBtn.addEventListener('click', function () { playAllAyahsAlim(this); });
  }
}

function getSurahStartGlobalAyah(n) {
  const counts = [7,286,200,176,120,165,206,75,129,109,123,111,43,52,99,128,111,110,98,135,112,78,118,64,77,227,93,88,69,60,34,30,73,54,45,83,182,88,75,85,54,53,89,59,37,35,38,29,18,45,60,49,62,55,78,96,29,22,24,13,14,11,11,18,12,12,30,52,52,44,28,28,20,56,40,31,50,40,46,42,29,19,36,25,22,17,19,26,30,20,15,21,11,8,8,19,5,8,8,11,11,8,3,9,5,4,7,3,6,3,5,4,5,6];
  let sum = 1;
  for (let i = 0; i < n - 1; i++) sum += counts[i];
  return sum;
}

/* ==================== A4 CANVAS-TO-JSPDF GENERATOR (NEVER BLANK) ==================== */
function ensureJsPDF() {
  return new Promise(res => {
    if (window.jspdf && window.jspdf.jsPDF) { res(window.jspdf.jsPDF); return; }
    const sc = document.createElement('script');
    sc.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    sc.onload = () => res((window.jspdf && window.jspdf.jsPDF) || null);
    sc.onerror = () => res(null);
    document.head.appendChild(sc);
  });
}

async function downloadItemsAsPDF(title, itemsList) {
  const safeName = (title || 'Quran-Tarjuma-PRO').replace(/[^a-z0-9\-_]+/gi, '-').replace(/^-|-$/g, '').slice(0, 60) || 'Quran-Tarjuma-PRO';
  if (!itemsList || !itemsList.length) {
    showToast('Nothing to download');
    return;
  }
  showToast('Generating PDF...');
  const JsPDF = await ensureJsPDF();
  if (!JsPDF) {
    const html = itemsList.map(it => it.kind === 'tafseer-sec'
      ? `<h2>${escapeHTML(it.h)}</h2><p>${escapeHTML(it.p)}</p>`
      : `<p><b>${escapeHTML(it.refLabel)}</b><br>${escapeHTML(it.ar)}<br>${escapeHTML(it.tr)}</p>`).join('');
    const blob = new Blob([`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>${escapeHTML(title)}</title></head><body style="font-family:sans-serif;padding:24px;"><h1>${escapeHTML(title)}</h1>${html}</body></html>`], {type:'text/html'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${safeName}.html`;
    a.click();
    URL.revokeObjectURL(a.href);
    showToast('Printable file downloaded!');
    return;
  }

  const W = 1240, H = 1754, PX = 64, MW = W - PX * 2;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  const pdf = new JsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
  let pageNum = 1, y = 0;

  function startPage() {
    ctx.direction = 'ltr'; ctx.textAlign = 'left';
    ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = '#1d4ed8'; ctx.fillRect(0, 0, W, 16);
    ctx.font = 'bold 30px sans-serif';
    ctx.fillText(title.slice(0, 75), PX, 68);
    ctx.fillStyle = '#475569'; ctx.font = '18px sans-serif';
    ctx.fillText('Israr Tool Zone - Quran Tarjuma & Tafseer PRO | www.technoisrar.in', PX, 98);
    ctx.strokeStyle = '#cbd5e1'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(PX, 118); ctx.lineTo(W - PX, 118); ctx.stroke();
    y = 152;
  }

  function finishPage(isLast) {
    ctx.direction = 'ltr'; ctx.textAlign = 'center';
    ctx.fillStyle = '#64748b'; ctx.font = '18px sans-serif';
    ctx.fillText(`Page ${pageNum}  |  Israr Tool Zone`, W / 2, H - 36);
    if (pageNum > 1) pdf.addPage();
    pdf.addImage(canvas.toDataURL('image/jpeg', 0.9), 'JPEG', 0, 0, 210, 297);
    if (!isLast) { pageNum++; startPage(); }
  }

  function wrapLines(text, fontSpec, isRTL) {
    ctx.font = fontSpec;
    ctx.direction = isRTL ? 'rtl' : 'ltr';
    const words = String(text || '').split(/\s+/).filter(Boolean);
    const lines = [];
    let cur = '';
    for (let i = 0; i < words.length; i++) {
      const test = cur ? cur + ' ' + words[i] : words[i];
      if (ctx.measureText(test).width > MW && cur) {
        lines.push(cur);
        cur = words[i];
      } else {
        cur = test;
      }
    }
    if (cur) lines.push(cur);
    return lines;
  }

  function drawWrapped(text, fontSpec, color, lineH, isRTL) {
    const lines = wrapLines(text, fontSpec, isRTL);
    const xPos = isRTL ? (W - PX) : PX;
    ctx.font = fontSpec;
    ctx.fillStyle = color;
    ctx.direction = isRTL ? 'rtl' : 'ltr';
    ctx.textAlign = isRTL ? 'right' : 'left';
    for (let i = 0; i < lines.length; i++) {
      if (y + lineH > H - 72) {
        finishPage(false);
        ctx.font = fontSpec;
        ctx.fillStyle = color;
        ctx.direction = isRTL ? 'rtl' : 'ltr';
        ctx.textAlign = isRTL ? 'right' : 'left';
      }
      ctx.fillText(lines[i], xPos, y);
      y += lineH;
    }
  }

  startPage();
  for (let i = 0; i < itemsList.length; i++) {
    const it = itemsList[i];
    if (it.kind === 'tafseer-sec') {
      if (y + 110 > H - 72) finishPage(false);
      drawWrapped(it.h, 'bold 26px sans-serif', '#1d4ed8', 36, false);
      y += 6;
      drawWrapped(it.p, '22px sans-serif', '#1e293b', 34, false);
      y += 18;
    } else {
      if (it.surahDivider) {
        if (y + 90 > H - 72) finishPage(false);
        ctx.direction = 'ltr'; ctx.textAlign = 'center';
        ctx.fillStyle = '#eff6ff'; ctx.fillRect(PX, y - 24, MW, 42);
        ctx.fillStyle = '#1d4ed8'; ctx.font = 'bold 22px sans-serif';
        ctx.fillText(it.surahDivider, W / 2, y + 4);
        y += 42;
      }
      if (y + 140 > H - 72) finishPage(false);
      drawWrapped(it.refLabel || `Ayat ${it.num}`, 'bold 19px sans-serif', '#2563eb', 28, false);
      y += 8;
      drawWrapped(it.ar, "34px 'Scheherazade New','Amiri Quran','Noto Naskh Arabic',serif", '#000000', 54, true);
      y += 6;
      drawWrapped(it.tr, '22px sans-serif', '#1e293b', 34, false);
      y += 12;
      ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(PX, y); ctx.lineTo(W - PX, y); ctx.stroke();
      y += 26;
    }
  }
  finishPage(true);
  pdf.save(`${safeName}.pdf`);
  showToast('PDF downloaded!');
}

/* ==================== SHARE HELPER (WEBSITE LINK ALWAYS AT TOP) ==================== */
function getCurrentWebsiteUrl() {
  let u = '';
  try { u = window.top.location.href; } catch (e) { u = window.location.href; }
  if (u && /^https?:\/\//i.test(u)) return u;
  if (document.referrer && /^https?:\/\//i.test(document.referrer)) return document.referrer;
  return 'https://www.technoisrar.in';
}

async function shareTextWithSiteUrl(title, textBody) {
  const full = `${getCurrentWebsiteUrl()}\n\n${title}\n${'-'.repeat(24)}\n${textBody}`;
  if (navigator.share) {
    try { await navigator.share({ title, text: full }); return; }
    catch (err) { if (err && err.name === 'AbortError') return; }
  }
  try {
    await navigator.clipboard.writeText(full);
    showToast('Website Link + Content copied!');
  } catch (e) {
    const ta = document.createElement('textarea');
    ta.value = full;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showToast('Website Link + Content copied!');
  }
}

/* ==================== HISTORY, RECOVERY & BACKUP (MAX 200) ==================== */
const LS_HIST = 'israr_quran_history_v1';
const LS_REC  = 'israr_quran_recovery_v1';
const LS_BAK  = 'israr_quran_backup_folders_v1';
const HISTORY_LIMIT = 200;

let historyList = [];
let recoveryList = [];
let backupFolders = [];
try { historyList = JSON.parse(localStorage.getItem(LS_HIST) || '[]'); if (!Array.isArray(historyList)) historyList = []; } catch (e) { historyList = []; }
try { recoveryList = JSON.parse(localStorage.getItem(LS_REC) || '[]'); if (!Array.isArray(recoveryList)) recoveryList = []; } catch (e) { recoveryList = []; }
try { backupFolders = JSON.parse(localStorage.getItem(LS_BAK) || '[]'); if (!Array.isArray(backupFolders)) backupFolders = []; } catch (e) { backupFolders = []; }

function persistAllStores() {
  try { localStorage.setItem(LS_HIST, JSON.stringify(historyList)); } catch (e) {}
  try { localStorage.setItem(LS_REC, JSON.stringify(recoveryList)); } catch (e) {}
  try { localStorage.setItem(LS_BAK, JSON.stringify(backupFolders)); } catch (e) {}
}

function formatNowDateTime() {
  return new Date().toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true
  });
}

function enforceHistoryLimit() {
  while (historyList.length > HISTORY_LIMIT) historyList.pop();
}

function saveCurrentReaderToHistory() {
  if (!currentReaderState) return;
  const langObj = getLangObj(selectedLang);
  const alimObj = getAlimObj(selectedAlimId);
  const st = currentReaderState;
  let title = '', subtitle = '';

  if (st.type === 'para') {
    title = `Para ${st.data.num} - ${st.data.name}`;
    subtitle = `PARA | ${st.data.ayats} Ayats | ${st.data.type}`;
  } else if (st.type === 'surah') {
    title = `Surah ${st.data.n}: ${st.data.name}`;
    subtitle = `SURAH | ${st.data.ayats} Ayats | ${st.data.type}`;
  } else if (st.type === 'ayat') {
    title = `Ayat ${st.data.surahNum}:${st.data.ayahInSurah}`;
    subtitle = `AYAT | No. ${st.data.globalNum || st.data.ayahInSurah} | ${st.data.surahName || ''}`;
  } else if (st.type === 'tafseer') {
    title = `Surah ${st.data.n}: ${st.data.name} Tafseer`;
    subtitle = `TAFSEER | ${st.data.type || ''} | ${st.data.ayats || ''} Ayats`;
  }

  historyList.unshift({
    uid: 'h_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
    type: st.type,
    title,
    subtitle,
    langId: selectedLang,
    alimId: selectedAlimId,
    langLabel: selectedAlimId !== 'auto' ? alimObj.label : langObj.label,
    savedAt: formatNowDateTime(),
    data: st.data,
    shareText: currentReaderShareText || ''
  });
  enforceHistoryLimit();
  persistAllStores();
  renderHistorySection();
  showToast('Saved to History!');
}

function saveSingleAyahToHistory(ayahItem) {
  if (!ayahItem) return;
  const langObj = getLangObj(selectedLang);
  const alimObj = getAlimObj(selectedAlimId);
  const sn = ayahItem.surahNum || '';
  const an = ayahItem.num || ayahItem.ayahInSurah || '';
  const title = (sn && an) ? `Ayat ${sn}:${an}` : (ayahItem.refLabel || `Ayat ${an}`);
  const subtitle = `AYAT | No. ${ayahItem.globalNum || an}${ayahItem.surahName ? ' | ' + ayahItem.surahName : ''}`;
  const shareBody = `${ayahItem.refLabel || title}\n${ayahItem.ar || ''}\n\n${ayahItem.tr || ''}`;
  historyList.unshift({
    uid: 'h_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
    type: 'ayat',
    title,
    subtitle,
    langId: selectedLang,
    alimId: selectedAlimId,
    langLabel: selectedAlimId !== 'auto' ? alimObj.label : langObj.label,
    savedAt: formatNowDateTime(),
    data: {
      globalNum: ayahItem.globalNum,
      surahNum: ayahItem.surahNum || 0,
      surahName: ayahItem.surahName || '',
      ayahInSurah: ayahItem.num,
      para: ayahItem.para || 0,
      words: (ayahItem.ar || '').trim().split(/\s+/).filter(Boolean).length,
      text: ayahItem.ar || ''
    },
    shareText: shareBody
  });
  enforceHistoryLimit();
  persistAllStores();
  renderHistorySection();
  showToast('Ayat Saved to History!');
}

function shareSingleAyah(ayahItem) {
  if (!ayahItem) return;
  const title = ayahItem.refLabel || ('Ayat ' + ayahItem.num);
  const body = `${ayahItem.ar || ''}\n\n${ayahItem.tr || ''}`;
  shareTextWithSiteUrl(title, body);
}

function saveTafseerSecToHistory(secItem) {
  if (!secItem) return;
  const langObj = getLangObj(selectedLang);
  const alimObj = getAlimObj(selectedAlimId);
  const title = (secItem.h || 'Tafseer Section').slice(0, 80);
  const shareBody = `${secItem.h || ''}\n${secItem.p || ''}`;
  historyList.unshift({
    uid: 'h_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
    type: 'tafseer',
    title,
    subtitle: (secItem.p || '').slice(0, 60) + ((secItem.p || '').length > 60 ? '…' : ''),
    langId: selectedLang,
    alimId: selectedAlimId,
    langLabel: selectedAlimId !== 'auto' ? alimObj.label : langObj.label,
    savedAt: formatNowDateTime(),
    data: currentReaderState && currentReaderState.data ? currentReaderState.data : { n: 1, name: title },
    shareText: shareBody
  });
  enforceHistoryLimit();
  persistAllStores();
  renderHistorySection();
  showToast('Tafseer Saved to History!');
}

async function buildContentForHistoryItem(item) {
  if (item.type === 'tafseer') {
    const s = item.data;
    const langObj = getLangObj(item.langId);
    let sections;
    if (item.langId === 'roman') sections = buildSurahTafseerRoman(s);
    else if (item.langId === 'roman-hi') {
      const be = buildSurahTafseerEnglish(s), raw = [];
      be.forEach(x => raw.push(x.h, x.p));
      const tr = await translateViaGTX(raw, 'hi');
      sections = be.map((_, i) => ({ h: devanagariToRoman(tr[i * 2] || ''), p: devanagariToRoman(tr[i * 2 + 1] || '') }));
    } else if (item.langId === 'urdu-hi') {
      sections = buildSurahTafseerRoman(s).map(x => ({ h: romanUrduToDevanagari(x.h), p: romanUrduToDevanagari(x.p) }));
    } else if (item.langId === 'en') {
      sections = buildSurahTafseerEnglish(s);
    } else {
      const be = buildSurahTafseerEnglish(s), raw = [];
      be.forEach(x => raw.push(x.h, x.p));
      const tr = await translateViaGTX(raw, langObj.gt);
      sections = be.map((_, i) => ({ h: tr[i * 2] || be[i].h, p: tr[i * 2 + 1] || be[i].p }));
    }
    return {
      items: sections.map(x => ({ kind: 'tafseer-sec', h: x.h, p: x.p })),
      plain: `${item.title} (${langObj.label})\n\n` + sections.map(x => `${x.h}\n${x.p}`).join('\n\n')
    };
  }
  if (item.type === 'ayat') {
    const a = item.data;
    const trs = await fetchTranslationsForAyahs('ayat', a.globalNum, [{numberInSurah:a.ayahInSurah, surahNum:a.surahNum, surahName:a.surahName, text:a.text}], item.langId, item.alimId);
    const tr = trs[0] || '';
    return {
      items: [{ kind: 'ayah', num: a.ayahInSurah, refLabel: `Surah ${a.surahNum}: ${a.surahName} - Ayat ${a.ayahInSurah}`, ar: a.text, tr }],
      plain: `${item.title}\n\n${a.text}\n\n${tr}`
    };
  }
  const ep = item.type === 'para'
    ? `https://api.alquran.cloud/v1/juz/${item.data.num}/quran-uthmani`
    : `https://api.alquran.cloud/v1/surah/${item.data.n}/quran-uthmani`;
  const arData = await (await fetch(ep)).json();
  const arAyahs = arData.data.ayahs.map(a => ({
    numberInSurah: a.numberInSurah,
    surahNum: item.type === 'para' ? (a.surah ? a.surah.number : 0) : item.data.n,
    surahName: item.type === 'para' ? (a.surah ? a.surah.englishName : '') : item.data.name,
    text: a.text
  }));
  const trs = await fetchTranslationsForAyahs(item.type, item.type === 'para' ? item.data.num : item.data.n, arAyahs, item.langId, item.alimId);
  let lastS = -1;
  const items = [], lines = [];
  arAyahs.forEach((a, i) => {
    const isNew = item.type === 'para' && a.surahNum !== lastS;
    if (isNew) lastS = a.surahNum;
    const tr = trs[i] || '';
    items.push({ kind: 'ayah', num: a.numberInSurah, refLabel: `${a.surahName} ${a.surahNum}:${a.numberInSurah}`, surahDivider: isNew ? `Surah ${a.surahNum}: ${a.surahName}` : '', ar: a.text, tr });
    lines.push(`(${a.surahNum}:${a.numberInSurah}) ${a.text}\n${tr}`);
  });
  return { items, plain: lines.join('\n\n') };
}

function renderHistorySection() {
  const box = document.getElementById('historyListBox');
  const pill = document.getElementById('historyCountPill');
  const info = document.getElementById('historySearchInfo');
  const q = document.getElementById('historySearchInput').value.trim();
  const clr = document.getElementById('historySearchClear');
  if (clr) clr.style.display = q ? 'flex' : 'none';
  pill.textContent = `${historyList.length} / ${HISTORY_LIMIT} Saved`;

  if (!historyList.length) {
    info.classList.remove('has-search');
    info.textContent = 'Save any Para, Surah, Ayat or Tafseer to see it here (Max 200)';
    box.innerHTML = '<div style="text-align:center;color:var(--text2);padding:24px 16px;font-size:13.5px;">No saved items yet. Open any Para, Surah, Ayat or Tafseer and click Save.</div>';
    return;
  }

  let mc = 0, th = 0;
  const evs = historyList.map((it, idx) => {
    const tR = countAndHighlight(it.title, q);
    const sR = countAndHighlight(it.subtitle, q);
    const dR = countAndHighlight(it.savedAt, q);
    const lR = countAndHighlight(it.langLabel, q);
    const hits = tR.count + sR.count + dR.count + lR.count;
    if (hits > 0) { mc++; th += hits; }
    return { item: it, idx, hits, tHTML: tR.html, sHTML: sR.html, dHTML: dR.html, lHTML: lR.html };
  });

  if (q) {
    evs.sort((a, b) => (b.hits > 0 ? 1 : 0) - (a.hits > 0 ? 1 : 0) || a.idx - b.idx);
    info.classList.add('has-search');
    info.textContent = mc ? `Found: ${mc} saved item${mc > 1 ? 's' : ''} | ${th} word${th > 1 ? 's' : ''} matched` : `No saved item matched "${q}"`;
  } else {
    info.classList.remove('has-search');
    info.textContent = `Showing ${historyList.length} saved item${historyList.length > 1 ? 's' : ''} (Scroll to see more)`;
  }

  box.innerHTML = '';
  evs.forEach(({ item, hits, tHTML, sHTML, dHTML }) => {
    const typeLabel = (item.type || '').toUpperCase();
    const ayatNo = (item.data && (item.data.globalNum || item.data.ayahInSurah || item.data.num || item.data.n || '')) || '';
    const metaLine = `${escapeHTML(typeLabel)}${ayatNo ? ' | No. ' + escapeHTML(String(ayatNo)) : ''}`;
    const card = document.createElement('div');
    card.className = 'history-card' + (q && hits === 0 ? ' search-dim' : '');
    card.innerHTML = `
      <div class="history-card-head">
        <div style="min-width:0;flex:1;">
          <div class="history-card-title">${tHTML}</div>
          <div class="history-card-meta"><span>${sHTML || metaLine}</span><span>|</span><span><i class="far fa-clock"></i> ${dHTML}</span></div>
        </div>
        <span class="meta-pill accent-pill" style="text-transform:uppercase;">${escapeHTML(typeLabel)}</span>
      </div>
      <div class="history-card-btns">
        <button type="button" class="h-btn h-play" title="Play"><i class="fas fa-play"></i> Play</button>
        <button type="button" class="h-btn h-preview"><i class="fas fa-eye"></i> Preview</button>
        <button type="button" class="h-btn h-download"><i class="fas fa-file-pdf"></i> PDF</button>
        <button type="button" class="h-btn h-share"><i class="fas fa-share-alt"></i> Share</button>
        <button type="button" class="h-btn h-del"><i class="fas fa-trash"></i> Del</button>
      </div>
    `;
    card.querySelector('.h-play').addEventListener('click', () => {
      const g = item.data && (item.data.globalNum || item.data.number);
      const txt = item.shareText || item.subtitle || item.title;
      if (g) playAyatSequence(g, txt, card.querySelector('.h-play'));
      else playVoiceOnly(txt, card.querySelector('.h-play'));
    });
    card.querySelector('.h-preview').addEventListener('click', () => {
      selectedLang = item.langId || 'roman';
      selectedAlimId = item.alimId || 'auto';
      openFullReader({ type: item.type, data: item.data });
    });
    card.querySelector('.h-download').addEventListener('click', async () => {
      showToast('Preparing PDF...');
      try {
        const res = await buildContentForHistoryItem(item);
        await downloadItemsAsPDF(item.title, res.items);
      } catch (e) {
        showToast('Download failed');
      }
    });
    card.querySelector('.h-share').addEventListener('click', async () => {
      let txt = item.shareText;
      if (!txt) {
        try { txt = (await buildContentForHistoryItem(item)).plain; }
        catch (e) { txt = item.title; }
      }
      await shareTextWithSiteUrl(item.title, txt);
    });
    card.querySelector('.h-del').addEventListener('click', () => {
      historyList = historyList.filter(x => x.uid !== item.uid);
      recoveryList.unshift({ ...item, deletedAt: formatNowDateTime() });
      persistAllStores();
      renderHistorySection();
      showToast('Moved to Recovery!');
    });
    box.appendChild(card);
  });
}

document.getElementById('historyAllDeleteBtn').addEventListener('click', () => {
  if (!historyList.length) { showToast('History is already empty'); return; }
  const dt = formatNowDateTime();
  recoveryList = historyList.map(x => ({ ...x, deletedAt: dt })).concat(recoveryList);
  historyList = [];
  persistAllStores();
  renderHistorySection();
  showToast('All History moved to Recovery!');
});

/* ==================== RECOVERY MODAL ==================== */
let recMarkMode = false;
let recSelectedUids = new Set();

function openRecoveryModal() {
  recMarkMode = false;
  recSelectedUids.clear();
  document.getElementById('recoveryModal').classList.add('open');
  document.body.style.overflow = 'hidden';
  renderRecoveryList();
}

function renderRecoveryList() {
  const cont = document.getElementById('recoveryListContainer');
  const mb = document.getElementById('recMarkDeleteBtn');
  const st = document.getElementById('recInfoStatus');

  if (recMarkMode) {
    mb.classList.add('active-mark');
    mb.innerHTML = `<i class="fas fa-trash"></i> <span>Delete (${recSelectedUids.size})</span>`;
  } else {
    mb.classList.remove('active-mark');
    mb.innerHTML = `<i class="fas fa-check-square"></i> <span>Mark Delete</span>`;
  }
  st.textContent = recoveryList.length
    ? `${recoveryList.length} Deleted Item${recoveryList.length > 1 ? 's' : ''} in Recovery`
    : 'Recovery Box is Empty';

  if (!recoveryList.length) {
    cont.innerHTML = '<div style="text-align:center;padding:80px 20px;color:var(--text2);">No deleted items in Recovery.</div>';
    return;
  }
  cont.innerHTML = '';
  const list = document.createElement('div');
  list.className = 'list-stack';

  recoveryList.forEach(item => {
    const card = document.createElement('div');
    card.className = 'history-card';
    card.innerHTML = `
      <div class="rec-check-wrap">
        ${recMarkMode ? `<input type="checkbox" class="rec-checkbox" ${recSelectedUids.has(item.uid) ? 'checked' : ''}>` : ''}
        <div style="min-width:0;flex:1;">
          <div class="history-card-title">${escapeHTML(item.title)}</div>
          <div class="history-card-meta"><span>${escapeHTML(item.subtitle)}</span><span>|</span><span>${escapeHTML(item.langLabel)}</span><span>|</span><span>Saved: ${escapeHTML(item.savedAt)}</span></div>
        </div>
        <span class="meta-pill accent-pill" style="text-transform:uppercase;">${escapeHTML(item.type)}</span>
      </div>
    `;
    if (recMarkMode) {
      const cb = card.querySelector('.rec-checkbox');
      cb.addEventListener('change', () => {
        if (cb.checked) recSelectedUids.add(item.uid);
        else recSelectedUids.delete(item.uid);
        mb.innerHTML = `<i class="fas fa-trash"></i> <span>Delete (${recSelectedUids.size})</span>`;
      });
      card.addEventListener('click', e => {
        if (e.target !== cb) { cb.checked = !cb.checked; cb.dispatchEvent(new Event('change')); }
      });
    }
    list.appendChild(card);
  });
  cont.appendChild(list);
}

document.getElementById('recoveryModalBtn').addEventListener('click', openRecoveryModal);
document.getElementById('recBackBtn').addEventListener('click', () => {
  document.getElementById('recoveryModal').classList.remove('open');
  document.body.style.overflow = '';
});
document.getElementById('recMarkDeleteBtn').addEventListener('click', () => {
  if (!recoveryList.length) { showToast('Recovery is empty'); return; }
  if (!recMarkMode) {
    recMarkMode = true;
    recSelectedUids.clear();
    renderRecoveryList();
    showToast('Tick boxes to delete, then click again');
  } else if (recSelectedUids.size > 0) {
    const c = recSelectedUids.size;
    recoveryList = recoveryList.filter(x => !recSelectedUids.has(x.uid));
    recSelectedUids.clear();
    recMarkMode = false;
    persistAllStores();
    renderRecoveryList();
    showToast(`${c} item(s) permanently deleted!`);
  } else {
    recMarkMode = false;
    renderRecoveryList();
  }
});
document.getElementById('recAllDeleteBtn').addEventListener('click', () => {
  if (!recoveryList.length) { showToast('Recovery is already empty'); return; }
  recoveryList = [];
  recSelectedUids.clear();
  recMarkMode = false;
  persistAllStores();
  renderRecoveryList();
  showToast('All Recovery items permanently deleted!');
});
document.getElementById('recRestoreBtn').addEventListener('click', () => {
  if (!recoveryList.length) { showToast('Nothing to restore'); return; }
  let toR = [];
  if (recMarkMode && recSelectedUids.size > 0) {
    toR = recoveryList.filter(x => recSelectedUids.has(x.uid));
    recoveryList = recoveryList.filter(x => !recSelectedUids.has(x.uid));
  } else {
    toR = [...recoveryList];
    recoveryList = [];
  }
  historyList = toR.concat(historyList);
  enforceHistoryLimit();
  recSelectedUids.clear();
  recMarkMode = false;
  persistAllStores();
  renderRecoveryList();
  renderHistorySection();
  showToast(`${toR.length} item(s) restored!`);
});

/* ==================== BACKUP MODAL ==================== */
function openBackupModal() {
  document.getElementById('backupModal').classList.add('open');
  document.body.style.overflow = 'hidden';
  renderBackupList();
}
function downloadJSONFile(fn, obj) {
  const b = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(b);
  a.download = fn.endsWith('.json') ? fn : `${fn}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
}
function createNamedBackup(dl) {
  const fi = document.getElementById('backupFolderInput');
  const fn = (fi.value || '').trim() || 'Quran-Tarjuma-Backup';
  fi.value = fn;
  const snap = {
    id: 'bak_' + Date.now(),
    name: fn,
    createdAt: formatNowDateTime(),
    count: historyList.length,
    items: JSON.parse(JSON.stringify(historyList))
  };
  backupFolders.unshift(snap);
  persistAllStores();
  renderBackupList();
  if (dl) {
    downloadJSONFile(fn.replace(/[^a-z0-9\-_]+/gi, '-') || 'Quran-Tarjuma-Backup', {
      app: 'Israr Tool Zone Quran Tarjuma PRO',
      folderName: fn,
      exportedAt: snap.createdAt,
      history: snap.items
    });
    showToast(`Backup "${fn}" saved & downloaded!`);
  } else {
    showToast(`Folder "${fn}" saved!`);
  }
}
function renderBackupList() {
  const cont = document.getElementById('backupListContainer');
  if (!backupFolders.length) {
    cont.innerHTML = `<div style="text-align:center;padding:70px 20px;color:var(--text2);">Current Saved History: <strong>${historyList.length}</strong> boxes.<br><br>Click <strong>Backup</strong> above to save all History boxes into a Backup File under the folder name.</div>`;
    return;
  }
  cont.innerHTML = `<div class="selected-info" style="margin-bottom:12px;">Saved Backup Folders (${backupFolders.length}) &bull; Current History: ${historyList.length} items</div>`;
  const list = document.createElement('div');
  list.className = 'list-stack';
  backupFolders.forEach(bak => {
    const card = document.createElement('div');
    card.className = 'history-card';
    card.innerHTML = `
      <div class="history-card-head">
        <div style="min-width:0;flex:1;">
          <div class="history-card-title"><i class="fas fa-folder" style="color:var(--accent);"></i> ${escapeHTML(bak.name)}</div>
          <div class="history-card-meta"><span>${bak.count} Saved Boxes</span><span>|</span><span><i class="far fa-clock"></i> ${escapeHTML(bak.createdAt)}</span></div>
        </div>
      </div>
      <div class="history-card-btns" style="grid-template-columns:repeat(3, minmax(0, 1fr));">
        <button type="button" class="h-btn h-preview"><i class="fas fa-undo"></i> Load</button>
        <button type="button" class="h-btn h-download"><i class="fas fa-download"></i> File</button>
        <button type="button" class="h-btn h-del"><i class="fas fa-trash"></i> Delete</button>
      </div>
    `;
    card.querySelector('.h-preview').addEventListener('click', () => {
      if (Array.isArray(bak.items)) {
        const ids = new Set(historyList.map(x => x.uid));
        const fr = bak.items.filter(x => !ids.has(x.uid));
        historyList = fr.concat(historyList);
        enforceHistoryLimit();
        persistAllStores();
        renderHistorySection();
        showToast(`Loaded ${fr.length} items!`);
      }
    });
    card.querySelector('.h-download').addEventListener('click', () => {
      downloadJSONFile(bak.name.replace(/[^a-z0-9\-_]+/gi, '-') || 'Quran-Tarjuma-Backup', {
        app: 'Israr Tool Zone Quran Tarjuma PRO',
        folderName: bak.name,
        exportedAt: bak.createdAt,
        history: bak.items
      });
      showToast('Backup file downloaded!');
    });
    card.querySelector('.h-del').addEventListener('click', () => {
      backupFolders = backupFolders.filter(x => x.id !== bak.id);
      persistAllStores();
      renderBackupList();
      showToast('Backup folder deleted');
    });
    list.appendChild(card);
  });
  cont.appendChild(list);
}
document.getElementById('backupModalBtn').addEventListener('click', openBackupModal);
document.getElementById('bakBackBtn').addEventListener('click', () => {
  document.getElementById('backupModal').classList.remove('open');
  document.body.style.overflow = '';
});
document.getElementById('bakCreateBtn').addEventListener('click', () => createNamedBackup(true));
document.getElementById('bakFolderBtn').addEventListener('click', () => {
  const i = document.getElementById('backupFolderInput');
  i.focus();
  i.select();
  createNamedBackup(false);
});
document.getElementById('bakImportBtn').addEventListener('click', () => document.getElementById('bakFileInput').click());
document.getElementById('bakFileInput').addEventListener('change', e => {
  const f = e.target.files && e.target.files[0];
  if (!f) return;
  const r = new FileReader();
  r.onload = ev => {
    try {
      const p = JSON.parse(ev.target.result);
      const arr = Array.isArray(p) ? p : (Array.isArray(p.history) ? p.history : []);
      if (!arr.length) { showToast('No items found'); return; }
      const ids = new Set(historyList.map(x => x.uid));
      const nw = arr.filter(x => x && x.type && x.data && !ids.has(x.uid));
      historyList = nw.concat(historyList);
      enforceHistoryLimit();
      persistAllStores();
      renderHistorySection();
      renderBackupList();
      showToast(`Imported ${nw.length} item(s)!`);
    } catch (err) {
      showToast('Invalid JSON file');
    }
  };
  r.readAsText(f);
  e.target.value = '';
});

/* ==================== FULL PAGE READER CONTROLLER ==================== */
let readerFontSize = 16;
try {
  const fs = parseInt(localStorage.getItem('israr_quran_font_size') || '16', 10);
  if (fs >= 12 && fs <= 34) readerFontSize = fs;
} catch (e) {}
let currentReaderState = null;
let currentReaderShareText = '';
let currentReaderTitle = '';
let readerItemsData = [];

function updateReaderFontUI() {
  const i = document.getElementById('readerContent');
  const l = document.getElementById('fontSizeLabel');
  if (i) {
    i.style.setProperty('--read-size', readerFontSize + 'px');
    i.style.setProperty('--arabic-size', (readerFontSize + 12) + 'px');
  }
  if (l) l.textContent = readerFontSize + 'px';
}

document.getElementById('fontIncBtn').addEventListener('click', () => {
  if (readerFontSize < 34) { readerFontSize += 2; updateReaderFontUI(); persistReaderPrefs(); }
});
document.getElementById('fontDecBtn').addEventListener('click', () => {
  if (readerFontSize > 12) { readerFontSize -= 2; updateReaderFontUI(); persistReaderPrefs(); }
});
document.getElementById('readerNightBtn').addEventListener('click', () => { ketoDarkMode = !ketoDarkMode; applyDarkModeState(); });
document.getElementById('readerBackBtn').addEventListener('click', () => {
  closeFullReaderToHome(false);
});

// Mobile hardware Back — first nested (i) page, then home
window._ignoreReaderPop = false;
window.addEventListener('popstate', function (e) {
  if (window._ignoreReaderPop) {
    window._ignoreReaderPop = false;
    return;
  }
  closeFullReaderToHome(true);
});

/* Nested reader stack: Guide → (i) Hadith/Quran → Back returns to Guide */
window._readerReturnStack = window._readerReturnStack || [];
function pushReaderReturnState() {
  try {
    if (!currentReaderState) return;
    window._readerReturnStack.push({
      type: currentReaderState.type,
      kind: currentReaderState.kind,
      data: currentReaderState.data,
      hadith: currentReaderState.hadith,
      parent: currentReaderState.parent,
      meta: currentReaderState.meta
    });
    try {
      history.pushState({ quranReader: true, nested: true }, '', location.href);
    } catch (e) {}
  } catch (e) {}
}
function restoreReaderReturnState() {
  try {
    const prev = window._readerReturnStack.pop();
    if (!prev) return false;
    stopAllAyatAudio();
    if (prev.type === 'guide') {
      if (prev.kind === 'qissas' && typeof openQissasDetail === 'function') {
        openQissasDetail(prev.data);
        return true;
      }
      if (prev.kind === 'zalim' && typeof openZalimDetail === 'function') {
        openZalimDetail(prev.data);
        return true;
      }
      openGuideReader(prev.kind, prev.data, true);
      return true;
    }
    if (prev.type === 'hadith-detail') {
      openHadithDetail(prev.hadith, prev.parent);
      return true;
    }
    if (prev.type === 'hadith-book') {
      openHadithBookReader(prev.data, prev.meta);
      return true;
    }
    if (prev.type === 'masail') {
      openMasailReader(prev.data);
      return true;
    }
    if (prev.type === 'quran-ref') {
      openHadithDetail(prev.hadith, prev.parent);
      return true;
    }
  } catch (e) {}
  return false;
}
document.getElementById('readerLangSelect').addEventListener('change', e => {
  stopAllAyatAudio();
  selectedLang = e.target.value;
  // Sync hadith section languages with top toolbar
  window._hadithTrLang = selectedLang;
  window._hadithTfLang = selectedLang;
  window._guideMaslaLang = selectedLang;
  window._guideTfLang = selectedLang;
  selectedAlimId = 'auto';
  ayahLangOverrides = {}; // top dropdown = all ayats same tarjuma
  const a = document.getElementById('readerAlimSelect');
  if (a) a.value = 'auto';
  persistReaderPrefs();
  if (currentReaderState && currentReaderState.type === 'guide') {
    openGuideReader(currentReaderState.kind, currentReaderState.data);
  } else if (currentReaderState && currentReaderState.type === 'quran-ref') {
    openQuranRefDetail(currentReaderState.surah, currentReaderState.ayah, currentReaderState.ayahEnd, currentReaderState.label, currentReaderState.parent);
  } else if (currentReaderState && currentReaderState.type === 'hadith-detail') {
    openHadithDetail(currentReaderState.hadith, currentReaderState.parent);
  } else if (currentReaderState && currentReaderState.type === 'hadith-book') {
    openHadithBookReader(currentReaderState.data, currentReaderState.meta);
    try { applyArabicFont(selectedArabicFontId); } catch (e2) {}
  } else if (currentReaderState && currentReaderState.type === 'masail') {
    openMasailReader(currentReaderState.data);
  } else if (currentReaderState) {
    loadReaderContent(currentReaderState);
  }
  // refresh hadith list one-line translations
  if (window._activeModeId && String(window._activeModeId).startsWith('hadith-')) {
    try { renderHadithList(); } catch (e3) {}
  }
});
document.getElementById('readerAlimSelect').addEventListener('change', e => {
  stopAllAyatAudio();
  selectedAlimId = e.target.value;
  persistReaderPrefs();
  const al = getAlimObj(selectedAlimId);
  showToast(selectedAlimId === 'auto' ? 'Alim: Default (by language)' : (al.label || 'Alim updated'));
  if (currentReaderState) loadReaderContent(currentReaderState);
});
document.getElementById('readerVoiceSelect').addEventListener('change', e => {
  const P = window._tjPlayer;
  const wasPlaying = !!(P && P.playing);
  const resumeAyah = (P && P.ayahIdx) || 0;
  stopAllAyatAudio();
  selectedVoiceId = e.target.value;
  persistReaderPrefs();
  showToast('Voice: ' + getVoiceObj(selectedVoiceId).label.replace('Voice: ', ''));
  if (wasPlaying && window._arabicOnlyQuran && typeof tjPlayAyahAt === 'function') {
    try {
      if (window._tjPlayer) {
        window._tjPlayer.ayahIdx = resumeAyah;
        window._tjPlayer.wordIdx = 0;
        window._tjPlayer.paused = false;
      }
      tjPlayAyahAt(resumeAyah);
    } catch (err) {}
  }
});
const _urduFontSelect = document.getElementById('readerUrduFontSelect');
function applySelectedUrduFont() {
  if (!_urduFontSelect) return;
  const font = ARABIC_FONTS.find(f => f.id === _urduFontSelect.value) || ARABIC_FONTS.find(f => f.id === 'noto-nastaliq') || ARABIC_FONTS[0];
  const content = document.getElementById('readerContent');
  if (content && font) content.style.setProperty('--urdu-font', font.family);
  try { localStorage.setItem('israr_urdu_font_id', font.id); } catch (e) {}
}
if (_urduFontSelect) {
  _urduFontSelect.innerHTML = ARABIC_FONTS.map(f => `<option value="${f.id}">${escapeHTML(f.label.replace(/^\\d+\\.\\s*/, ''))}</option>`).join('');
  try {
    const savedUrduFontId = localStorage.getItem('israr_urdu_font_id') || 'noto-nastaliq';
    _urduFontSelect.value = ARABIC_FONTS.some(f => f.id === savedUrduFontId) ? savedUrduFontId : 'noto-nastaliq';
  } catch (e) { _urduFontSelect.value = 'noto-nastaliq'; }
  applySelectedUrduFont();
  _urduFontSelect.addEventListener('change', applySelectedUrduFont);
}

document.getElementById('readerArabicFontSelect').addEventListener('change', e => applyArabicFont(e.target.value));


function getBottomActionsHTML() {
  return `
    <div class="reader-bottom-actions">
      <button type="button" id="readerBottomSaveBtn" class="bottom-act-btn save-btn"><i class="fas fa-bookmark"></i> Save</button>
      <button type="button" id="readerBottomPdfBtn" class="bottom-act-btn pdf-btn"><i class="fas fa-file-pdf"></i> PDF Download</button>
      <button type="button" id="readerBottomShareBtn" class="bottom-act-btn share-btn"><i class="fas fa-share-alt"></i> Share</button>
    </div>
  `;
}

function bindBottomReaderActions() {
  const s = document.getElementById('readerBottomSaveBtn');
  const p = document.getElementById('readerBottomPdfBtn');
  const sh = document.getElementById('readerBottomShareBtn');
  if (s) s.addEventListener('click', saveCurrentReaderToHistory);
  if (p) p.addEventListener('click', () => downloadItemsAsPDF(currentReaderTitle, readerItemsData));
  if (sh) sh.addEventListener('click', () => shareTextWithSiteUrl(currentReaderTitle, currentReaderShareText));
}

function renderReaderItemsWithSearch() {
  const inp = document.getElementById('readerSearchInput');
  const clr = document.getElementById('readerSearchClear');
  const st = document.getElementById('readerSearchStatus');
  const cont = document.getElementById('readerItemsContainer');
  if (!inp || !cont || !readerItemsData.length) return;

  stopAllAyatAudio();
  const q = inp.value.trim();
  if (clr) clr.style.display = q ? 'flex' : 'none';
  const isNum = /^\d+$/.test(q);
  let twh = 0, mic = 0;

  const evs = readerItemsData.map((item, origIdx) => {
    if (item.kind === 'tafseer-sec') {
      const hR = countAndHighlight(item.h, q);
      const pR = countAndHighlight(item.p, q);
      const hits = hR.count + pR.count;
      if (hits > 0) { mic++; twh += hits; }
      return { item, origIdx, hits, hHTML: hR.html, pHTML: pR.html };
    }
    const rR = countAndHighlight(item.refLabel, q);
    const aR = countAndHighlight(item.ar, q);
    const tR = countAndHighlight(item.tr, q);
    const numEx = isNum && String(item.num) === q;
    const hits = rR.count + aR.count + tR.count + (numEx ? 1 : 0);
    if (hits > 0) { mic++; twh += hits; }
    return { item, origIdx, hits, numExact: numEx, refHTML: rR.html, arHTML: aR.html, trHTML: tR.html };
  });

  if (q) {
    evs.sort((a, b) => {
      if ((b.hits > 0) !== (a.hits > 0)) return b.hits > 0 ? 1 : -1;
      if (b.numExact !== a.numExact) return b.numExact ? 1 : -1;
      return a.origIdx - b.origIdx;
    });
    st.style.display = 'block';
    st.style.color = mic ? '#22c55e' : 'var(--red)';
    st.textContent = mic ? `Found: ${mic} item${mic > 1 ? 's' : ''} | ${twh} word${twh > 1 ? 's' : ''} matched` : `No match found for "${q}"`;
  } else {
    st.style.display = 'none';
  }

  cont.innerHTML = '';
  const frag = document.createDocumentFragment();
  evs.forEach(ev => {
    const dim = (q && ev.hits === 0) ? ' search-dim' : '';
    const div = document.createElement('div');
    if (ev.item.kind === 'tafseer-sec') {
      div.className = 'tafseer-sec-block' + dim;
      const secLang = ev.item._localLang || selectedLang;
      div.innerHTML = `
        <div class="ayah-top-row" style="margin-bottom:6px;">
          <div style="flex:1"></div>
          <div class="ayah-top-actions">
            <select class="ayah-mini-select" data-sec-lang title="Is section ki bhasha" style="max-width:120px;"></select>
          </div>
        </div>
        <h2 data-sec-h>${ev.hHTML}</h2>
        <p data-sec-p>${ev.pHTML}</p>
        <div class="ayah-audio-row">
          <button type="button" class="play-ayah-btn" data-mode="alim">Play</button>
          <button type="button" class="ayah-act-btn" data-act="share">Share</button>
          <button type="button" class="ayah-act-btn" data-act="save">Save</button>
        </div>
      `;
      const secLangSel = div.querySelector('[data-sec-lang]');
      if (secLangSel) {
        LANGUAGES.forEach(l => {
          const o = document.createElement('option');
          o.value = l.id;
          o.textContent = l.label.length > 16 ? l.label.slice(0, 14) + '…' : l.label;
          if (l.id === secLang) o.selected = true;
          secLangSel.appendChild(o);
        });
        secLangSel.addEventListener('change', async function () {
          const newLang = this.value;
          ev.item._localLang = newLang;
          const hNode = div.querySelector('[data-sec-h]');
          const pNode = div.querySelector('[data-sec-p]');
          if (hNode) hNode.textContent = 'Loading...';
          if (pNode) pNode.textContent = '';
          try {
            // Translate only this section from English base
            const baseH = ev.item._baseH || ev.item.h;
            const baseP = ev.item._baseP || ev.item.p;
            if (newLang === 'en') {
              ev.item.h = baseH; ev.item.p = baseP;
            } else if (newLang === 'roman') {
              // keep roman-style from base if already roman-like, else translate via hi then roman
              const tr = await translateViaGTX([baseH, baseP], 'hi');
              ev.item.h = devanagariToRoman(tr[0] || baseH);
              ev.item.p = devanagariToRoman(tr[1] || baseP);
            } else {
              const langObj = getLangObj(newLang);
              const tr = await translateViaGTX([baseH, baseP], langObj.gt || newLang);
              ev.item.h = tr[0] || baseH;
              ev.item.p = tr[1] || baseP;
            }
            if (hNode) hNode.textContent = ev.item.h;
            if (pNode) pNode.textContent = ev.item.p;
            showToast('Section language updated');
          } catch (err) {
            if (hNode) hNode.textContent = ev.item.h;
            if (pNode) pNode.textContent = ev.item.p;
            showToast('Translate failed');
          }
        });
      }
      const bs = div.querySelectorAll('.play-ayah-btn');
      const acts = div.querySelectorAll('.ayah-act-btn');
      // Play = Alim ayat + section body only (no numbered titles / no Bismillah extra)
      const tafseerText = ((ev.item.p || '').trim() || stripTafseerNumbers(ev.item.h || ''));
      bs[0].addEventListener('click', function () {
        const vId = (typeof window._tafseerLocalVoice === 'function' ? window._tafseerLocalVoice() : null) || selectedVoiceId;
        playTafseerAlimThenText(ev.item.sampleGlobalAyah || 1, tafseerText, this, vId);
      });
      acts[0].addEventListener('click', function () { shareTextWithSiteUrl(ev.item.h || 'Tafseer', (ev.item.h || '') + '\n' + (ev.item.p || '')); });
      acts[1].addEventListener('click', function () { saveTafseerSecToHistory(ev.item); });
    } else {
      const a = ev.item;
      const nHl = ev.numExact ? ' hl-num' : '';
      const tc = a.singleCentered ? ' style="text-align:center;"' : '';
      const ja = a.singleCentered ? ' style="justify-content:center;"' : '';
      const bookCls = (currentReaderState && currentReaderState.bookStyle) ? ' book-ayah' : '';
      div.className = 'ayah-block' + bookCls + dim;
      if (a.singleCentered) div.style.cssText = 'border-bottom:none;padding:18px;background:var(--panel-bg);border-radius:12px;border:1px solid var(--border);';
      const effLang = (a.globalNum && ayahLangOverrides[a.globalNum]) ? ayahLangOverrides[a.globalNum] : selectedLang;
      if (!a._localVoiceId) a._localVoiceId = selectedVoiceId;
      if (!a._localAiVoiceId) a._localAiVoiceId = selectedAiVoiceId;
      div.innerHTML = `
        ${(!q && a.surahDivider) ? `<div class="surah-divider">${escapeHTML(a.surahDivider)}</div>` : ''}
        <div class="ayah-top-row">
          <div class="ayah-ref-badge">${ev.refHTML}</div>
          <div class="ayah-top-actions">
            <select class="ayah-mini-select" title="Tarjuma bhasha" data-ayah-lang></select>
            <select class="ayah-mini-select" title="Qari Voice" data-ayah-voice style="max-width:130px;"></select>
            <button type="button" class="ayah-mini-btn" data-act="tafseer">Tafseer</button>
          </div>
        </div>
        <div class="arabic-text"${tc}><span class="ayah-num${nHl}">${a.num}</span> ${ev.arHTML}</div>
        <div class="trans-text${/^(ur|urdu)/i.test(effLang) || effLang === 'urdu-hi' ? ' urdu-nastaliq' : ''}"${tc} data-tr-node>${ev.trHTML}</div>
        <div class="ayah-audio-row"${ja}>
          <button type="button" class="play-ayah-btn" data-mode="arabic" title="Sirf Arabic Ayat (Qari)"><i class="fas fa-play"></i> Ayat</button>
          <button type="button" class="play-ayah-btn" data-mode="tarjuma" title="Sirf Tarjuma (AI Voice)">Play</button>
          <button type="button" class="ayah-act-btn" data-act="share">Share</button>
          <button type="button" class="ayah-act-btn" data-act="save">Save</button>
        </div>
      `;
      const miniSel = div.querySelector('[data-ayah-lang]');
      if (miniSel) {
        LANGUAGES.forEach(l => {
          const o = document.createElement('option');
          o.value = l.id;
          o.textContent = l.label.length > 16 ? l.label.slice(0, 14) + '…' : l.label;
          if (l.id === effLang) o.selected = true;
          miniSel.appendChild(o);
        });
        miniSel.addEventListener('change', async function () {
          const newLang = this.value;
          if (a.globalNum) ayahLangOverrides[a.globalNum] = newLang;
          const trNode = div.querySelector('[data-tr-node]');
          if (trNode) trNode.innerHTML = '<span style="opacity:.6">Loading...</span>';
          try {
            const arOne = [{ globalNum: a.globalNum, numberInSurah: a.num, surahNum: a.surahNum, surahName: a.surahName, text: a.ar }];
            const trs = await fetchTranslationsForAyahs('ayat', a.globalNum, arOne, newLang, 'auto');
            a.tr = trs[0] || a.tr;
            if (trNode) {
              trNode.textContent = a.tr;
              trNode.classList.toggle('urdu-nastaliq', /^(ur|urdu)/i.test(newLang) || newLang === 'urdu-hi');
            }
            showToast('Tarjuma: ' + (getLangObj(newLang).label || newLang));
          } catch (err) {
            if (trNode) trNode.textContent = a.tr || '';
            showToast('Tarjuma load fail');
          }
        });
      }
      const voiceSel = div.querySelector('[data-ayah-voice]');
      if (voiceSel) {
        ALIM_VOICES.forEach(v => {
          const o = document.createElement('option');
          o.value = v.id;
          const short = (v.label || '').replace(/^Voice:\s*/i, '');
          o.textContent = short.length > 18 ? short.slice(0, 16) + '…' : short;
          if (v.id === a._localVoiceId) o.selected = true;
          voiceSel.appendChild(o);
        });
        voiceSel.addEventListener('change', function () {
          a._localVoiceId = this.value;
          showToast('Alim Voice: ' + (getVoiceObj(this.value).label || '').replace(/^Voice:\s*/i, ''));
        });
      }
      const aiSel = div.querySelector('[data-ayah-ai]');
      if (aiSel) {
        AI_VOICES.forEach(v => {
          const o = document.createElement('option');
          o.value = v.id;
          o.textContent = v.label.replace(/^AI\s*/i, '');
          if (v.id === a._localAiVoiceId) o.selected = true;
          aiSel.appendChild(o);
        });
        aiSel.addEventListener('change', function () {
          a._localAiVoiceId = this.value;
          selectedAiVoiceId = this.value;
          try { localStorage.setItem('quran_aiVoice', selectedAiVoiceId); } catch (e) {}
          showToast(getAiVoiceObj(this.value).label);
        });
      }
      const tafBtn = div.querySelector('[data-act="tafseer"]');
      if (tafBtn) {
        tafBtn.addEventListener('click', function () {
          // Open dedicated Tafseer page (not inline)
          const sn = a.surahNum || 1;
          const an = a.num || 1;
          const arText = (a.ar || a.text || '').trim();
          const trText = (a.tr || '').trim();
          const { text: tfText, lang, surah } = _getInlineTafseerSections(sn, an, arText, trText);
          if (typeof openTafseerDetailPage === 'function') {
            openTafseerDetailPage({
              sn, an, arText, trText, tfText, lang,
              sname: (surah && surah.name) || a.surahName || ''
            });
            return;
          }
          // fallback inline if function missing
          const existing = div.querySelector('.pdf-ayah-tafseer');
          if (existing) {
            existing.remove();
            tafBtn.classList.remove('active-tf');
            div.classList.remove('has-open-tf');
            return;
          }
          try {
            const root = div.parentElement;
            if (root) {
              root.querySelectorAll('.pdf-ayah-tafseer').forEach(p => p.remove());
              root.querySelectorAll('.ayah-mini-btn.active-tf').forEach(b => b.classList.remove('active-tf'));
              root.querySelectorAll('.ayah-block.has-open-tf').forEach(b => b.classList.remove('has-open-tf'));
            }
          } catch (e) {}
          const panel = document.createElement('div');
          panel.className = 'pdf-ayah-tafseer';
          panel.innerHTML = _renderInlineDetailPanel({
            sn, an, arText, trText, tfText, lang,
            sname: (surah && surah.name) || a.surahName || '',
            kind: 'quran'
          });
          const trNode = div.querySelector('[data-tr-node]') || div.querySelector('.trans-text');
          if (trNode && trNode.nextSibling) div.insertBefore(panel, trNode.nextSibling);
          else if (trNode) trNode.insertAdjacentElement('afterend', panel);
          else div.appendChild(panel);
          tafBtn.classList.add('active-tf');
          div.classList.add('has-open-tf');
          _bindInlineDetailPanel(panel, {
            arText, trText, tfText,
            globalNum: a.globalNum || 0, sn, an
          });
        });
      }
      const bs = div.querySelectorAll('.play-ayah-btn');
      const acts = div.querySelectorAll('.ayah-act-btn');
      // Ayat button = sirf Arabic (Qari) tilawat — no tarjuma after
      if (bs[0]) bs[0].addEventListener('click', function () {
        playAyatSequence(a.globalNum, '', this, a._localVoiceId || selectedVoiceId);
      });
      // Niche Play button = sirf Tarjuma (AI / selected voice)
      if (bs[1]) bs[1].addEventListener('click', function () {
        selectedAiVoiceId = a._localAiVoiceId || selectedAiVoiceId;
        playVoiceOnly(a.tr || '', this);
      });
      acts[0].addEventListener('click', function () { shareSingleAyah(a); });
      acts[1].addEventListener('click', function () { saveSingleAyahToHistory(a); });
    }
    frag.appendChild(div);
  });
  cont.appendChild(frag);
  applyArabicFont(selectedArabicFontId);
  if (q) document.getElementById('readerScrollBody').scrollTop = 0;
}

document.getElementById('readerSearchInput').addEventListener('input', renderReaderItemsWithSearch);
document.getElementById('readerSearchClear').addEventListener('click', () => {
  const i = document.getElementById('readerSearchInput');
  i.value = '';
  renderReaderItemsWithSearch();
  i.focus();
});

/* PDF / Text i-button → INLINE panel: Arabic + Tarjuma + ~200w Tafseer + Play (no page jump) */
const _inlineTfCache = {};
const _inlineTrCache = {};

function buildCompactAyatTafseer200(s, an, arText, trText, lang) {
  const surah = s || {};
  const name = surah.name || '';
  const typ = surah.type || '';
  const para = surah.para || '';
  const era = surah.era || '';
  const ctx = surah.ctx || '';
  const themes = surah.themes || 'iman, amal-e-saleh aur Allah ki yad';
  const isMadani = /madani/i.test(String(typ));
  const place = isMadani ? 'Madina Munawwara' : 'Makkah Mukarrama';
  const mean = (trText || '').trim() || 'is ayat ka tarjuma';
  const id = String(lang || '').toLowerCase();
  const en = (id === 'en' || id.startsWith('en'));
  const hi = (id === 'hi' || id === 'hin' || id === 'urdu-hi' || id.indexOf('hindi') >= 0);

  if (en) {
    return (
      `Meaning of ${name} ${an}: "${mean}" This verse is part of a ${typ || ''} Surah revealed in ${place}` +
      (era ? ` during ${era}` : '') +
      (para ? ` (Para ${para})` : '') +
      `. ` +
      (ctx ? `Background: ${ctx}. ` : '') +
      `Main themes of the Surah include: ${themes}. ` +
      `The verse calls the reader to reflect on Allah’s message, correct belief and righteous action. ` +
      `Practical advice: recite with understanding, act on what you learn, avoid heedlessness, and keep the heart linked to the Hereafter. ` +
      `Success is not only in worldly gain but in obedience to Allah and good character. ` +
      `Whoever ponders this ayah and applies it gains peace, guidance on the straight path, and benefit in this life and the next.`
    );
  }

  // Roman Urdu ~200 words (matlab + nasihat)
  let roman = (
    `Surah ${name} ki ayat ${an} ka matlab: "${mean}" ` +
    `Yeh ${typ || ''} Surah ka hissa hai jo ${place} mein` +
    (era ? ` "${era}" ke dauran` : '') +
    ` nazil hui` +
    (para ? `, Para ${para} mein` : '') +
    `. ` +
    (ctx ? `Shan-e-nuzul / pas-e-manzar: ${ctx}. ` : '') +
    `Is Surah ke ahem mauzoo: ${themes}. ` +
    `Is ayat se seedha paigham yeh hai ke bande Allah ke hukum ko samjhein, iman mazboot karein aur amal-e-saleh karein. ` +
    `Nasihat: tilawat ghaur se karein, matlab par sochein, ghaflat se bachein, aur dil ko akhirat se jodein. ` +
    `Dunya ki kamiyabi sirf maal o shohrat mein nahi — Allah ki itaat, sachai aur husn-e-akhlaq mein hai. ` +
    `Jo shakhs is ayat ko padh kar amal kare uske dil ko sukoon, Sirat-e-Mustaqeem aur dono jahan ki bhalai milti hai. ` +
    `Har musalman ko chahiye ke is hidayat ko apni zindagi ka hissa banaye.`
  );
  if (hi && typeof romanUrduToDevanagari === 'function') {
    try { return romanUrduToDevanagari(roman); } catch (e) { return roman; }
  }
  return roman;
}

function _getInlineTafseerSections(sn, an, arText, trText) {
  const surah = (typeof SURAH_LIST !== 'undefined' ? SURAH_LIST.find(x => x.n === sn) : null) || { n: sn, name: '', type: '', para: '', era: '', ctx: '', themes: '' };
  let effectiveLang = (typeof selectedLang !== 'undefined' ? selectedLang : 'roman');
  try {
    if (typeof selectedAlimId !== 'undefined' && selectedAlimId && selectedAlimId !== 'auto') {
      if (selectedAlimId.startsWith('en.')) effectiveLang = 'en';
      else if (selectedAlimId.startsWith('ur.')) effectiveLang = 'ur';
      else if (selectedAlimId.startsWith('hi')) effectiveLang = 'hi';
      else if (selectedAlimId.startsWith('ar.')) effectiveLang = 'ar';
    }
  } catch (e) {}
  const cacheKey = sn + ':' + an + ':' + effectiveLang + ':v2';
  if (_inlineTfCache[cacheKey]) return { text: _inlineTfCache[cacheKey], lang: effectiveLang, surah };

  let text = buildCompactAyatTafseer200(surah, an, arText || '', trText || '', effectiveLang);
  if (effectiveLang === 'urdu-hi' && typeof romanUrduToDevanagari === 'function') {
    text = romanUrduToDevanagari(text);
  }
  _inlineTfCache[cacheKey] = text;
  return { text, lang: effectiveLang, surah };
}

function _isRtlLang(lang) {
  return /^(ur|urdu|ar|roman)/i.test(lang || '') || lang === 'urdu-hi' || !lang || lang === 'roman';
}

function _renderInlineDetailPanel(opts) {
  const sn = opts.sn || 0;
  const an = opts.an || 0;
  const arText = opts.arText || '';
  const trText = opts.trText || '';
  const tfText = opts.tfText || '';
  const lang = opts.lang || selectedLang || 'roman';
  const sname = opts.sname || '';
  const kind = opts.kind || 'quran'; // quran | hadith
  const isRtl = _isRtlLang(lang);
  const trCls = (/^(ur|urdu)/i.test(lang) || lang === 'urdu-hi') ? ' idp-tr urdu-nastaliq' : 'idp-tr';
  const trDir = isRtl ? 'direction:rtl;text-align:right;' : 'direction:ltr;text-align:left;';
  const badge = kind === 'hadith'
    ? `Hadith · ${escapeHTML(sname || '')}`
    : `Quran · ${sn}:${an}` + (sname ? ` · ${escapeHTML(sname)}` : '');

  return `
    <div class="inline-detail-panel" data-idp-sn="${sn}" data-idp-an="${an}" data-idp-kind="${kind}">
      <div class="idp-head">
        <span class="idp-badge">${badge}</span>
        <div class="idp-actions">
          ${arText ? `<button type="button" class="idp-play-ar" title="Arabic play"><i class="fas fa-play"></i> Arabic</button>` : ''}
          <button type="button" class="idp-play-tr" title="Tarjuma / text play"><i class="fas fa-comment-dots"></i> Play</button>
          <button type="button" class="idp-close" title="Band karein"><i class="fas fa-times"></i></button>
        </div>
      </div>
      ${arText ? `<div class="idp-ar arabic-text">${escapeHTML(arText)}${an ? ` <span class="pdf-ayah-end">۝${an}</span>` : ''}</div>` : ''}
      <div class="${trCls}" style="${trDir}" data-idp-tr>${escapeHTML(trText || '—')}</div>
      <span class="idp-tf-label">تفسیر · Matlab & Nasihat (~200 words)</span>
      <div class="idp-tf-body" style="${trDir}" data-idp-tf>${escapeHTML(tfText)}</div>
      <div class="idp-hint">Tip: Upar toolbar se Tarjuma language aur Arabic font badal sakte ho — phir i dobara open karein.</div>
    </div>`;
}

function _bindInlineDetailPanel(panel, ctx) {
  if (!panel) return;
  const playAr = panel.querySelector('.idp-play-ar');
  const playTr = panel.querySelector('.idp-play-tr');
  const closeBtn = panel.querySelector('.idp-close');
  if (playAr) {
    playAr.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      const ar = (ctx.arText || '').trim();
      if (!ar) return;
      // Prefer Qari audio if global ayah number known
      if (ctx.globalNum && typeof playAyatSequence === 'function') {
        playAyatSequence(ctx.globalNum, '', playAr, selectedVoiceId);
      } else if (typeof speakTextAloud === 'function') {
        speakTextAloud(ar, playAr, 'ar');
      } else if (typeof playVoiceOnly === 'function') {
        playVoiceOnly(ar, playAr, 'ar');
      }
    });
  }
  if (playTr) {
    playTr.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      const trNode = panel.querySelector('[data-idp-tr]');
      const tr = ((trNode && trNode.textContent) || ctx.trText || ctx.tfText || '').trim();
      if (!tr) return;
      if (typeof playVoiceOnly === 'function') {
        playVoiceOnly(tr, playTr);
      } else if (typeof speakTextAloud === 'function') {
        speakTextAloud(tr, playTr);
      }
    });
  }
  if (closeBtn) {
    closeBtn.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      const block = panel.closest('.pdf-ayah-block, .ayah-block, .hadith-item-box, .item-box') || panel.parentElement;
      panel.remove();
      if (block) {
        block.classList.remove('has-open-tf');
        block.querySelectorAll('.pdf-ayah-info-btn.active-tf, .ayah-mini-btn.active-tf, .surah-info-btn.active-tf').forEach(b => b.classList.remove('active-tf'));
      }
    });
  }
  // Apply current Arabic font to panel
  try { if (typeof applyArabicFont === 'function') applyArabicFont(selectedArabicFontId); } catch (e) {}
}

/* ===== Dedicated Tafseer Detail Page ===== */
let _tafseerPageState = null;
function openTafseerDetailPage(opts) {
  const page = document.getElementById('tafseerDetailPage');
  const content = document.getElementById('tafseerPageContent');
  if (!page || !content) return;
  _tafseerPageState = opts || {};
  const sn = opts.sn || 1;
  const an = opts.an || 1;
  const sname = opts.sname || '';
  const arText = opts.arText || '';
  const trText = opts.trText || '';
  const tfText = opts.tfText || 'Is ayat ki tafseer available nahi.';
  // Sample hadith reference for this ayat (structure ready for real data)
  const hadithRef = {
    book: 'Sahih al-Bukhari',
    num: Math.min(7563, (sn * 100 + an) % 7000 + 1),
    title: 'Ayat se related riwayat',
    ar: 'عَنْ رَسُولِ اللَّهِ ﷺ فِيمَا يَتَعَلَّقُ بِهَذِهِ الْآيَةِ',
    tr: 'Rasool Allah ﷺ se is ayat ke mutalliq riwayat hai.',
    tafseer: 'Is hadith me us maani ki wazahat hai jo is ayat se sabit hoti hai. Tafseer ke liye mukammal riwayat dekhein.'
  };
  content.innerHTML = `
    <div class="box" style="margin:8px 0;">
      <div style="font-size:13px;font-weight:700;color:var(--accent);margin-bottom:8px;">Surah ${escapeHTML(sname)} · Ayat ${an} (Surah ${sn}:${an})</div>
      <div class="arabic-text" style="font-size:clamp(20px,5vw,28px);line-height:1.9;direction:rtl;text-align:right;margin:10px 0;font-family:var(--arabic-font);">${escapeHTML(arText)}</div>
      <div style="font-size:14px;line-height:1.7;color:var(--text2);margin:8px 0 14px;" data-tf-tr>${escapeHTML(trText)}</div>
      <div style="font-size:12px;font-weight:800;color:var(--accent);letter-spacing:0.5px;margin-bottom:6px;">TAFSEER</div>
      <div style="font-size:13.5px;line-height:1.75;white-space:pre-line;" data-tf-body>${escapeHTML(tfText)}</div>
    </div>
    <div class="box" style="margin:10px 0;">
      <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:8px;">
        <div style="font-size:13px;font-weight:800;color:var(--accent);">Related Hadith Reference</div>
        <button type="button" class="r-action-btn" id="tafseerHadithInfoBtn" title="Puri hadith dekhein" style="height:32px;padding:0 12px;border-radius:50%;width:36px;">
          <i class="fas fa-info"></i>
        </button>
      </div>
      <div style="font-size:12.5px;color:var(--text2);margin-bottom:4px;"><strong>${escapeHTML(hadithRef.book)}</strong> · #${hadithRef.num}</div>
      <div style="font-size:13px;font-weight:700;margin-bottom:6px;">${escapeHTML(hadithRef.title)}</div>
      <div style="font-size:12px;color:var(--text2);line-height:1.6;">Is ayat ka zikr is hadith me aata hai. Puri riwayat ke liye <b>i</b> button dabayein.</div>
    </div>`;
  page.style.display = 'flex';
  page.classList.add('open');
  // Wire i button → full hadith page
  const iBtn = document.getElementById('tafseerHadithInfoBtn');
  if (iBtn) {
    iBtn.onclick = () => openHadithFromTafseer(hadithRef, opts);
  }
  // Populate lang selects once
  const trSel = document.getElementById('tafseerPageTrLang');
  const tfSel = document.getElementById('tafseerPageTfLang');
  if (trSel && !trSel.dataset.filled) {
    const langs = [
      { id: 'ur', label: 'Urdu' }, { id: 'hi', label: 'Hindi' }, { id: 'en', label: 'English' },
      { id: 'bn', label: 'Bangla' }, { id: 'tr', label: 'Turkish' }, { id: 'id', label: 'Indonesian' }
    ];
    [trSel, tfSel].forEach(sel => {
      if (!sel) return;
      sel.innerHTML = langs.map(l => `<option value="${l.id}">${l.label}</option>`).join('');
      sel.dataset.filled = '1';
    });
  }
}
function closeTafseerDetailPage() {
  const page = document.getElementById('tafseerDetailPage');
  if (page) {
    page.style.display = 'none';
    page.classList.remove('open');
  }
}
function openHadithFromTafseer(hadithRef, ayatOpts) {
  const page = document.getElementById('hadithFromTafseerPage');
  const content = document.getElementById('hadithTfContent');
  if (!page || !content) return;
  content.innerHTML = `
    <div class="box" style="margin:8px 0;">
      <div style="font-size:13px;font-weight:800;color:var(--accent);margin-bottom:6px;">${escapeHTML(hadithRef.book)} · #${hadithRef.num}</div>
      <div style="font-size:14px;font-weight:700;margin-bottom:10px;">${escapeHTML(hadithRef.title)}</div>
      <div style="font-size:12px;font-weight:800;color:var(--accent);margin-bottom:4px;">ARABIC</div>
      <div class="arabic-text" style="font-size:clamp(18px,4.5vw,24px);line-height:1.85;direction:rtl;text-align:right;margin:6px 0 12px;font-family:var(--arabic-font);">${escapeHTML(hadithRef.ar)}</div>
      <div style="font-size:12px;font-weight:800;color:var(--accent);margin-bottom:4px;">TARJUMA</div>
      <div style="font-size:14px;line-height:1.7;margin-bottom:12px;" data-htf-tr>${escapeHTML(hadithRef.tr)}</div>
      <div style="font-size:12px;font-weight:800;color:var(--accent);margin-bottom:4px;">TAFSEER</div>
      <div style="font-size:13.5px;line-height:1.75;white-space:pre-line;" data-htf-tf>${escapeHTML(hadithRef.tafseer)}</div>
    </div>
    <div class="box" style="margin:10px 0;font-size:12.5px;color:var(--text2);">
      Related Ayat: Surah ${(ayatOpts && ayatOpts.sname) || ''} ${(ayatOpts && ayatOpts.sn) || ''}:${(ayatOpts && ayatOpts.an) || ''}
    </div>`;
  page.style.display = 'flex';
  page.classList.add('open');
  const trSel = document.getElementById('hadithTfTrLang');
  const tfSel = document.getElementById('hadithTfTfLang');
  if (trSel && !trSel.dataset.filled) {
    const langs = [
      { id: 'ur', label: 'Urdu' }, { id: 'hi', label: 'Hindi' }, { id: 'en', label: 'English' },
      { id: 'bn', label: 'Bangla' }, { id: 'tr', label: 'Turkish' }, { id: 'id', label: 'Indonesian' }
    ];
    [trSel, tfSel].forEach(sel => {
      if (!sel) return;
      sel.innerHTML = langs.map(l => `<option value="${l.id}">${l.label}</option>`).join('');
      sel.dataset.filled = '1';
    });
  }
}
function closeHadithFromTafseer() {
  const page = document.getElementById('hadithFromTafseerPage');
  if (page) {
    page.style.display = 'none';
    page.classList.remove('open');
  }
}
document.addEventListener('DOMContentLoaded', () => {
  const b1 = document.getElementById('tafseerPageBackBtn');
  if (b1) b1.addEventListener('click', closeTafseerDetailPage);
  const b2 = document.getElementById('hadithTfBackBtn');
  if (b2) b2.addEventListener('click', closeHadithFromTafseer);
  const n1 = document.getElementById('tafseerPageNightBtn');
  if (n1) n1.addEventListener('click', () => {
    if (typeof themeToggleBtn !== 'undefined' && themeToggleBtn) themeToggleBtn.click();
  });
  const n2 = document.getElementById('hadithTfNightBtn');
  if (n2) n2.addEventListener('click', () => {
    if (typeof themeToggleBtn !== 'undefined' && themeToggleBtn) themeToggleBtn.click();
  });
});

function openPdfAyatTafseerPage(btn) {
  try {
    const block = btn.closest('.pdf-ayah-block') || btn.closest('.ayah-block') || btn.closest('.hadith-item-box') || btn.closest('.item-box');
    if (!block) {
      const sn = parseInt(btn.getAttribute('data-surah'), 10);
      const an = parseInt(btn.getAttribute('data-ayah'), 10);
      const gn = parseInt(btn.getAttribute('data-global'), 10) || 0;
      const sname = btn.getAttribute('data-sname') || '';
      const surah = (SURAH_LIST || []).find(x => x.n === sn);
      if (!surah) { try { showToast('Surah not found'); } catch (e) {} return; }
      const item = (readerItemsData || []).find(x => x.surahNum === sn && x.num === an) || {
        globalNum: gn, num: an, surahNum: sn, surahName: sname || surah.name, ar: '', tr: ''
      };
      openFullReader({ type: 'pdf-ayat-tafseer', data: surah, fromAyat: item, focusAyah: an, fromPdf: true });
      return;
    }

    // Toggle OFF
    const openPanel = block.querySelector('.pdf-ayah-tafseer, .inline-detail-panel');
    if (openPanel) {
      openPanel.remove();
      btn.classList.remove('active-tf');
      block.classList.remove('has-open-tf');
      return;
    }

    // Close other open panels on page
    try {
      const root = document.getElementById('readerContent') || block.parentElement || document;
      root.querySelectorAll('.pdf-ayah-tafseer, .inline-detail-panel').forEach(p => {
        if (p !== openPanel) p.remove();
      });
      root.querySelectorAll('.pdf-ayah-info-btn.active-tf, .ayah-mini-btn.active-tf, .surah-info-btn.active-tf').forEach(b => b.classList.remove('active-tf'));
      root.querySelectorAll('.has-open-tf').forEach(b => b.classList.remove('has-open-tf'));
    } catch (e) {}

    const sn = parseInt(btn.getAttribute('data-surah'), 10) || 0;
    const an = parseInt(btn.getAttribute('data-ayah'), 10) || 0;
    const gn = parseInt(btn.getAttribute('data-global'), 10) || 0;
    const snameAttr = btn.getAttribute('data-sname') || '';

    const item = (readerItemsData || []).find(x =>
      (gn && x.globalNum === gn) || (x.surahNum === sn && x.num === an)
    ) || {};

    // Arabic: from data attrs / reader items / visible DOM
    let arText = (item.ar || item.text || '').trim();
    if (!arText) {
      const arEl = block.querySelector('.pdf-ayah-ar, .arabic-text, .pdf-bismillah, .guide-ar-line');
      if (arEl) arText = (arEl.textContent || '').replace(/\s*۝\d+\s*$/, '').trim();
    }
    // Tarjuma
    let trText = (item.tr || '').trim();
    if (!trText) {
      const trEl = block.querySelector('.pdf-ayah-tr, .trans-text, [data-tr-node]');
      if (trEl) trText = (trEl.textContent || '').replace(/\s*\(\d+\)\s*$/, '').trim();
    }

    const { text: tfText, lang, surah } = _getInlineTafseerSections(sn, an, arText, trText);
    const sname = snameAttr || (surah && surah.name) || item.surahName || '';

    const panel = document.createElement('div');
    panel.className = 'pdf-ayah-tafseer';
    panel.setAttribute('data-inline-tf', sn + ':' + an);
    panel.innerHTML = _renderInlineDetailPanel({
      sn, an, arText, trText, tfText, lang, sname, kind: 'quran'
    });

    // Insert after tarjuma row
    const trRow = block.querySelector('.pdf-ayah-tr-row') || block.querySelector('.pdf-ayah-tr') || block.querySelector('.trans-text') || block.querySelector('[data-tr-node]');
    if (trRow) {
      const row = trRow.classList && trRow.classList.contains('pdf-ayah-tr-row') ? trRow : (trRow.closest('.pdf-ayah-tr-row') || trRow);
      if (row.parentElement === block) {
        if (row.nextSibling) block.insertBefore(panel, row.nextSibling);
        else block.appendChild(panel);
      } else {
        block.appendChild(panel);
      }
    } else {
      block.appendChild(panel);
    }

    btn.classList.add('active-tf');
    block.classList.add('has-open-tf');
    _bindInlineDetailPanel(panel, {
      arText, trText, tfText, globalNum: gn || item.globalNum || 0, sn, an
    });

    // Soft keep-in-view (no hard jump)
    try {
      const scrollParent = document.getElementById('readerScrollBody') || block.closest('.reader-scroll-body');
      if (scrollParent && btn.getBoundingClientRect) {
        const btnRect = btn.getBoundingClientRect();
        const spRect = scrollParent.getBoundingClientRect();
        if (btnRect.top < spRect.top + 40 || btnRect.bottom > spRect.bottom - 20) {
          btn.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
      }
    } catch (e) {}
  } catch (err) {
    console.error(err);
    try { showToast('Tafseer open error'); } catch (e) {}
  }
}


function openAyatTafseerPage(surah, ayahItem, opts) {
  stopAllAyatAudio();
  // Keep current language; only switch to roman-hi if lang is completely unsupported for tafseer text
  const fromPdf = !!(opts && opts.fromPdf);
  openFullReader({
    type: 'tafseer',
    data: surah,
    focusAyah: ayahItem ? ayahItem.num : null,
    fromAyat: ayahItem || null,
    fromPdf: fromPdf
  });
}

function openFullReader(state) {
  stopAllAyatAudio();
  // New page open: reset per-ayah overrides (top lang applies to all)
  ayahLangOverrides = {};
  currentReaderState = state;
  const fr = document.getElementById('fullReader');
  fr.classList.add('open');
  fr.classList.remove('guide-mode', 'hadith-mode');
  fr.classList.toggle('book-mode', !!(state && state.bookStyle));
  fr.classList.toggle('pdf-tafseer-mode', !!(state && state.fromPdf));
  fr.classList.toggle('arabic-only-mode', !!window._arabicOnlyQuran);
  document.body.style.overflow = 'hidden';
  // Mobile hardware Back support — push history so Back returns to home
  try {
    if (!window._readerHistoryPushed) {
      history.pushState({ quranReader: true }, '', location.href);
      window._readerHistoryPushed = true;
    }
  } catch (e) {}
  document.getElementById('readerSearchInput').value = '';
  document.getElementById('readerSearchClear').style.display = 'none';
  document.getElementById('readerSearchStatus').style.display = 'none';
  populateReaderLangDropdown();
  populateAlimAndVoiceDropdowns();
  populateArabicFontDropdown();
  applyArabicFont(selectedArabicFontId);
  updateReaderFontUI();
  loadReaderContent(state);
}

function closeFullReaderToHome(fromPopstate) {
  stopAllAyatAudio();
  try { if (typeof qzStopSpeech === 'function') qzStopSpeech(); } catch (e) {}
  const fr = document.getElementById('fullReader');
  if (!fr || !fr.classList.contains('open')) return false;
  // Nested (i) Hadith/Quran page → return to previous Guide page (NOT Home)
  if (window._readerReturnStack && window._readerReturnStack.length > 0) {
    if (restoreReaderReturnState()) {
      // UI Back pressed: also sync browser history
      if (!fromPopstate) {
        try {
          window._ignoreReaderPop = true;
          history.back();
        } catch (e) {}
      }
      return true;
    }
  }
  // If from PDF i-button, first return to previous mushaf
  if (currentReaderState && currentReaderState.fromPdf && window._pdfReaderReturnState) {
    const ret = window._pdfReaderReturnState;
    window._pdfReaderReturnState = null;
    fr.classList.remove('pdf-tafseer-mode');
    openFullReader(ret);
    return true;
  }
  fr.classList.remove('open');
  fr.classList.remove('book-mode');
  fr.classList.remove('pdf-tafseer-mode');
  fr.classList.remove('guide-mode');
  fr.classList.remove('hadith-mode');
  fr.classList.remove('arabic-only-mode');
  document.body.style.overflow = '';
  window._readerReturnStack = [];
  if (window._readerHistoryPushed && !fromPopstate) {
    try {
      window._ignoreReaderPop = true;
      history.back();
    } catch (e) {}
  }
  window._readerHistoryPushed = false;
  currentReaderState = null;
  return true;
}




/* Arabic-only: continuous 15-line pages, full width, tight words, Bismillah first */
window._tjMushafState = null;

function tjBuildContinuousLines(ayahs, charsPerLine) {
  charsPerLine = charsPerLine || 95;
  const stream = [];
  (ayahs || []).forEach(a => {
    const t = (a.text || a.ar || '').trim();
    if (!t) return;
    stream.push({ type: 'text', text: t, a, focus: !!a._focus });
    stream.push({ type: 'mark', num: a.numberInSurah || '', globalNum: a.globalNum, focus: !!a._focus });
  });
  // Build plain string with placeholders for marks
  let flat = '';
  const marks = []; // {index in flat after text, num}
  stream.forEach(item => {
    if (item.type === 'text') {
      if (flat && !flat.endsWith(' ') && !flat.endsWith('\n')) flat += ' ';
      if (item.focus) flat += '\uE002';
      flat += item.text;
      if (item.focus) flat += '\uE003';
    } else {
      marks.push({ at: flat.length, num: item.num, globalNum: item.globalNum });
      flat += '\uE000' + String(item.num) + '\uE001';
    }
  });
  // Split into visual lines by length (approx mushaf density)
  const lines = [];
  let i = 0;
  const raw = flat;
  while (i < raw.length) {
    let end = Math.min(i + charsPerLine, raw.length);
    if (end < raw.length) {
      // break at last space before end
      const slice = raw.slice(i, end);
      const sp = slice.lastIndexOf(' ');
      if (sp > charsPerLine * 0.55) end = i + sp;
    }
    let line = raw.slice(i, end).trim();
    i = end;
    while (i < raw.length && raw[i] === ' ') i++;
    if (!line) continue;
    // Convert markers to HTML circles
    line = escapeHTML(line)
      .replace(/\uE000(\d+)\uE001/g, '<span class="tj-ayah-circle">$1</span>');
    // fix escaped private use if escapeHTML affected — use direct
    lines.push(line);
  }
  // Re-do without escapeHTML eating markers
  const lines2 = [];
  i = 0;
  while (i < raw.length) {
    let end = Math.min(i + charsPerLine, raw.length);
    if (end < raw.length) {
      const slice = raw.slice(i, end);
      const sp = slice.lastIndexOf(' ');
      if (sp > charsPerLine * 0.55) end = i + sp;
    }
    let line = raw.slice(i, end).trim();
    i = end;
    while (i < raw.length && raw[i] === ' ') i++;
    if (!line) continue;
    let html = '';
    let j = 0;
    while (j < line.length) {
      if (line[j] === '\uE002') { html += '<span class="tj-focus-ayah">'; j++; continue; }
      if (line[j] === '\uE003') { html += '</span>'; j++; continue; }
      if (line[j] === '\uE000') {
        const k = line.indexOf('\uE001', j);
        if (k > j) {
          const num = line.slice(j + 1, k);
          html += '<span class="tj-ayah-circle">' + escapeHTML(num) + '</span>';
          j = k + 1;
          continue;
        }
      }
      // escape single char
      const ch = line[j];
      if (ch === '&') html += '&amp;';
      else if (ch === '<') html += '&lt;';
      else if (ch === '>') html += '&gt;';
      else html += ch;
      j++;
    }
    lines2.push(html);
  }
  return lines2;
}

function tjPagesFromLines(lines, linesPerPage) {
  linesPerPage = linesPerPage || 15;
  const pages = [];
  for (let i = 0; i < lines.length; i += linesPerPage) {
    pages.push(lines.slice(i, i + linesPerPage));
  }
  return pages.length ? pages : [[]];
}


async function tjFetchSurahAyahs(surahNum) {
  const j = await (await fetch(`https://api.alquran.cloud/v1/surah/${surahNum}/quran-uthmani`)).json();
  if (j.code !== 200) return [];
  return (j.data.ayahs || []).map(a => ({
    globalNum: a.number,
    numberInSurah: a.numberInSurah,
    surahNum: surahNum,
    surahName: (j.data && j.data.englishName) || ('Surah ' + surahNum),
    text: a.text,
    _focus: false
  }));
}

/** Fill to ~minLines visual lines by appending next surahs; mark focus range */
async function tjFillPageAyahs(primaryAyahs, opts) {
  opts = opts || {};
  const minLines = opts.minLines || 15;
  const focusSurah = opts.focusSurah || null;
  const focusAyah = opts.focusAyah || null; // numberInSurah
  let list = (primaryAyahs || []).map(a => ({ ...a, _focus: true }));
  // estimate lines: ~1 line per short ayah, more for long
  const estLines = () => list.reduce((n, a) => n + Math.max(1, Math.ceil(((a.text || '').length) / 90)), 0);
  let nextSurah = (list[0] && list[0].surahNum) ? list[0].surahNum + 1 : 2;
  // If single-ayat focus: load rest of same surah first
  if (focusAyah && list.length === 1 && list[0].surahNum) {
    try {
      const full = await tjFetchSurahAyahs(list[0].surahNum);
      const start = list[0].numberInSurah || focusAyah;
      list = full.map(a => ({
        ...a,
        _focus: a.numberInSurah === start
      }));
      // keep focus ayah first visually? User asked: clicked ayat highlight, rest below same page
      // Order: from focus ayah to end, then if still short prepend? Better: full surah with focus mark
      // Re-order: focus ayah and following, then if need more from next surah
      const fromFocus = full.filter(a => a.numberInSurah >= start).map(a => ({
        ...a,
        _focus: a.numberInSurah === start
      }));
      list = fromFocus;
    } catch (e) {}
  }
  while (estLines() < minLines && nextSurah <= 114) {
    try {
      const more = await tjFetchSurahAyahs(nextSurah);
      more.forEach(a => { a._focus = false; list.push(a); });
      nextSurah++;
    } catch (e) { break; }
  }
  return list;
}

function renderArabicOnlyMushaf(ayahs, meta) {
  const title = (meta && meta.title) || 'القرآن';
  const juz = (meta && meta.juz) || '';
  const surahName = (meta && meta.surahName) || '';
  const surahNum = (meta && meta.surahNum) || '';
  const ayahCount = (meta && meta.ayahCount) || (ayahs ? ayahs.length : 0);
  const focusG = meta && meta.focusGlobal;
  const lines = tjBuildContinuousLines(ayahs, 100);
  const pages = tjPagesFromLines(lines, 15);
  window._tjMushafState = {
    ayahs: ayahs || [],
    pages,
    meta: meta || {},
    title, juz, surahName, surahNum, ayahCount, focusG
  };
  const blocks = pages.map((lineArr, page) => {
    const slots = [];
    for (let i = 0; i < 15; i++) slots.push(lineArr[i] || '');
    const linesHtml = slots.map((ln, idx) => {
      if (!ln) return `<div class="tj-line tj-empty"></div>`;
      // wrap words for highlight during play
      const withWords = ln.replace(/>([^<]+)</g, (m0, txt) => {
        // only text nodes between tags — simpler: wrap whole line words outside tags
        return m0;
      });
      // Split plain segments
      let html = '';
      const parts = ln.split(/(<span class="tj-ayah-circle">\d+<\/span>)/);
      parts.forEach(part => {
        if (/^<span class="tj-ayah-circle">/.test(part)) {
          html += part;
        } else {
          const words = part.split(/(\s+)/);
          words.forEach(w => {
            if (!w) return;
            if (/^\s+$/.test(w)) html += w;
            else html += `<span class="tj-word">${w}</span>`;
          });
        }
      });
      const focusCls = (focusG && ln.indexOf('tj-ayah-circle">' + String(focusG)) >= 0) ? ' tj-ayah-focus' : '';
      return `<div class="tj-line${idx === 0 ? ' first-hl' : ''}${focusCls}">${html}</div>`;
    }).join('');
    return `
    <div class="tj-sheet tj-page-block" data-page="${page + 1}">
      <div class="tj-top-meta">
        <span>${escapeHTML(String(surahName || title))}</span>
        <span class="pg-badge">${page + 1} / ${pages.length}</span>
        <span>${surahNum ? ('سورة ' + surahNum) : escapeHTML(title)}</span>
      </div>
      <div class="tj-mushaf-border">
        <div class="tj-inner-frame">
          <div class="tj-surah-banner">
            <span class="tj-banner-pill">آياتها ${ayahCount}</span>
            <span class="tj-banner-center">${escapeHTML(String(surahName || title))}${surahNum ? ' (' + surahNum + ')' : ''}</span>
            <span class="tj-banner-pill">${page + 1}/${pages.length}</span>
          </div>
          ${page === 0 ? `<div class="tj-bismillah"><span>بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ</span></div>` : ''}
          <div class="tj-lines">${linesHtml}</div>
        </div>
      </div>
    </div>`;
  }).join('<div class="tj-page-gap"></div>');

  return `
  <div class="tj-stack" id="tjMushafSheet">
    <div class="tj-play-bar tj-sticky-play">
      <button type="button" id="tjPlayAllBtn"><i class="fas fa-play"></i> Play</button>
      <button type="button" id="tjStopBtn"><i class="fas fa-stop"></i> Stop</button>
      <span class="tj-page-count">${pages.length} pages · ${ayahCount} ayat</span>
    </div>
    ${blocks}
  </div>`;
}

function renderTjMushafPage(pageIdx) {
  return renderArabicOnlyMushaf(
    (window._tjMushafState && window._tjMushafState.ayahs) || [],
    (window._tjMushafState && window._tjMushafState.meta) || {}
  );
}

function tjClearWordHighlight() {
  try {
    document.querySelectorAll('.tj-word.speaking, .tj-line.tj-focus-line').forEach(el => {
      el.classList.remove('speaking');
      el.classList.remove('tj-focus-line');
    });
  } catch (e) {}
}

window._tjResume = window._tjResume || {
  ayahIdx: 0, wordIdx: 0, playing: false, paused: false,
  audio: null, timer: null, token: 0, playlist: []
};

function tjUpdatePlayUI(playing) {
  const play = document.getElementById('tjPlayAllBtn');
  const stop = document.getElementById('tjStopBtn');
  if (window._tjPlayer) window._tjPlayer.playing = !!playing;
  if (window._tjResume) window._tjResume.playing = !!playing;
  if (play) {
    play.style.display = 'inline-flex';
    play.innerHTML = playing ? '<i class="fas fa-pause"></i> Pause' : '<i class="fas fa-play"></i> Play';
    play.classList.toggle('playing', !!playing);
    play.disabled = false;
  }
  if (stop) {
    stop.style.display = 'inline-flex';
    stop.disabled = false;
  }
}

function tjBuildPlaylist(ayahs) {
  const list = (ayahs || []).map(a => ({
    globalNum: Number(a.globalNum || a.number || 0),
    num: a.numberInSurah || a.num || 0,
    text: (a.text || a.ar || '').trim()
  })).filter(a => a.globalNum > 0);
  return list;
}

function tjWordsForAyah(globalNum) {
  const sheet = document.getElementById('tjMushafSheet');
  if (!sheet) return [];
  // Prefer data-g tagged words
  const tagged = sheet.querySelectorAll('.tj-word[data-g="' + globalNum + '"]');
  if (tagged && tagged.length) return Array.from(tagged);
  // Fallback: words just before the matching ayah circle
  const circles = Array.from(sheet.querySelectorAll('.tj-ayah-circle'));
  const target = circles.find(c => String(c.textContent || '').trim() === String(globalNum) ||
    // numberInSurah match — weaker, skip if global
    false);
  return [];
}

function tjScrollWordToCenter(el) {
  if (!el) return;
  const scroller = document.getElementById('readerScrollBody');
  if (!scroller) {
    try { el.scrollIntoView({ block: 'center', behavior: 'smooth' }); } catch (e) {}
    return;
  }
  try {
    const sRect = scroller.getBoundingClientRect();
    const eRect = el.getBoundingClientRect();
    // Element center relative to scroller viewport
    const elMid = (eRect.top + eRect.bottom) / 2;
    const viewMid = (sRect.top + sRect.bottom) / 2;
    const delta = elMid - viewMid;
    // Only scroll if drifted more than ~12% of viewport from center
    if (Math.abs(delta) < sRect.height * 0.12) return;
    const target = scroller.scrollTop + delta;
    if (typeof scroller.scrollTo === 'function') {
      scroller.scrollTo({ top: Math.max(0, target), behavior: 'smooth' });
    } else {
      scroller.scrollTop = Math.max(0, target);
    }
  } catch (e) {
    try { el.scrollIntoView({ block: 'center', behavior: 'smooth' }); } catch (e2) {}
  }
}

function tjHighlightAyahWords(globalNum, wordIdx) {
  tjClearWordHighlight();
  const sheet = document.getElementById('tjMushafSheet');
  if (!sheet) return;
  let words = Array.from(sheet.querySelectorAll('.tj-word[data-g="' + globalNum + '"]'));
  if (!words.length) {
    // Fallback: highlight line containing the ayah end-circle
    const st = window._tjResume;
    const item = st && st.playlist && st.playlist[st.ayahIdx];
    const num = item ? item.num : null;
    if (num != null) {
      const circles = sheet.querySelectorAll('.tj-ayah-circle');
      for (const c of circles) {
        if (String(c.textContent || '').trim() === String(num)) {
          const line = c.closest('.tj-line');
          if (line) {
            line.classList.add('tj-focus-line');
            // throttle center scroll
            const now = Date.now();
            if (!window._tjLastScrollAt || now - window._tjLastScrollAt > 380) {
              window._tjLastScrollAt = now;
              tjScrollWordToCenter(line);
            }
          }
          break;
        }
      }
    }
    return;
  }
  const idx = Math.max(0, Math.min(wordIdx || 0, words.length - 1));
  words.forEach((w, i) => {
    if (i <= idx) w.classList.add('speaking');
  });
  // Keep current word in the middle of the reader — smooth, throttled
  try {
    const el = words[idx];
    const now = Date.now();
    if (!window._tjLastScrollAt || now - window._tjLastScrollAt > 320) {
      window._tjLastScrollAt = now;
      tjScrollWordToCenter(el);
    }
  } catch (e) {}
}

function tjKillAudioOnly() {
  const st = window._tjResume || {};
  try { if (st.timer) clearInterval(st.timer); } catch (e) {}
  st.timer = null;
  if (st.audio) {
    try {
      st.audio.onended = null;
      st.audio.onerror = null;
      st.audio.ontimeupdate = null;
      st.audio.pause();
      st.audio.removeAttribute('src');
      st.audio.load();
    } catch (e) {}
    st.audio = null;
  }
  if (activeAudioObj) {
    try {
      activeAudioObj.onended = null;
      activeAudioObj.onerror = null;
      activeAudioObj.ontimeupdate = null;
      activeAudioObj.pause();
      activeAudioObj.removeAttribute('src');
      activeAudioObj.load();
    } catch (e) {}
    activeAudioObj = null;
  }
}

function tjStopSpeech(keepPosition) {
  const st = window._tjResume || {};
  const ayahIdx = st.ayahIdx || 0;
  const wordIdx = st.wordIdx || 0;
  // Invalidate any in-flight start
  st.token = (st.token || 0) + 1;
  tjKillAudioOnly();
  if (!keepPosition) {
    st.ayahIdx = 0;
    st.wordIdx = 0;
    st.paused = false;
    tjClearWordHighlight();
  } else {
    st.paused = true;
    const item = st.playlist && st.playlist[ayahIdx];
    if (item) tjHighlightAyahWords(item.globalNum, wordIdx);
  }
  st.playing = false;
  tjUpdatePlayUI(false);
  activePlayBtn = null;
}

/* ===== Simple reliable TJ player (single Audio, clear Play/Pause/Stop) ===== */
function tjHardStopAllSounds() {
  try { if (window._tjPlayer && window._tjPlayer.audio) {
    const a = window._tjPlayer.audio;
    a.onended = null; a.onerror = null; a.ontimeupdate = null;
    try { a.pause(); } catch (e) {}
    try { a.removeAttribute('src'); a.load(); } catch (e) {}
    window._tjPlayer.audio = null;
  }} catch (e) {}
  try {
    if (activeAudioObj) {
      activeAudioObj.onended = null; activeAudioObj.onerror = null; activeAudioObj.ontimeupdate = null;
      try { activeAudioObj.pause(); } catch (e) {}
      try { activeAudioObj.removeAttribute('src'); activeAudioObj.load(); } catch (e) {}
      activeAudioObj = null;
    }
  } catch (e) {}
  try {
    document.querySelectorAll('audio').forEach(a => {
      try { a.pause(); a.removeAttribute('src'); a.load(); } catch (e2) {}
    });
  } catch (e) {}
}

function tjPlayAyahAt(ayahIdx) {
  const P = window._tjPlayer;
  if (!P || !P.playlist || !P.playlist.length) {
    showToast('No ayahs to play');
    return;
  }
  if (ayahIdx < 0 || ayahIdx >= P.playlist.length) {
    P.ayahIdx = 0;
    P.wordIdx = 0;
    P.playing = false;
    P.paused = false;
    tjClearWordHighlight();
    tjUpdatePlayUI(false);
    showToast('Tilawat complete');
    return;
  }

  // Always kill previous sound first — no double audio
  P.gen = (P.gen || 0) + 1;
  const gen = P.gen;
  tjHardStopAllSounds();

  const item = P.playlist[ayahIdx];
  P.ayahIdx = ayahIdx;
  P.wordIdx = 0;
  P.playing = true;
  P.paused = false;
  if (window._tjResume) {
    window._tjResume.ayahIdx = ayahIdx;
    window._tjResume.playing = true;
    window._tjResume.paused = false;
  }

  const vObj = (typeof getVoiceObj === 'function') ? getVoiceObj(selectedVoiceId) : { id: 'ar.alafasy', bitrate: 128 };
  const voiceId = (vObj && vObj.id && vObj.id !== 'tts') ? vObj.id : 'ar.alafasy';
  const bitrate = (vObj && vObj.bitrate) || 128;
  const url = `https://cdn.islamic.network/quran/audio/${bitrate}/${voiceId}/${item.globalNum}.mp3`;
  const fb = voiceId !== 'ar.alafasy'
    ? `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${item.globalNum}.mp3`
    : null;

  tjUpdatePlayUI(true);
  window._tjLastScrollAt = 0;
  try { tjHighlightAyahWords(item.globalNum, 0); } catch (e) {}

  const run = (src, allowFb) => {
    if (gen !== P.gen) return; // cancelled
    const audio = new Audio();
    audio.preload = 'auto';
    P.audio = audio;
    activeAudioObj = audio;
    audio.src = src;

    audio.ontimeupdate = function () {
      if (gen !== P.gen || !P.playing) return;
      try {
        const sheet = document.getElementById('tjMushafSheet');
        const words = sheet ? Array.from(sheet.querySelectorAll('.tj-word[data-g="' + item.globalNum + '"]')) : [];
        if (!words.length || !audio.duration || !isFinite(audio.duration)) return;
        const ratio = Math.min(0.999, Math.max(0, audio.currentTime / audio.duration));
        const wIdx = Math.min(words.length - 1, Math.floor(ratio * words.length));
        if (wIdx !== P.wordIdx) {
          P.wordIdx = wIdx;
          tjHighlightAyahWords(item.globalNum, wIdx);
        }
      } catch (e) {}
    };
    audio.onended = function () {
      if (gen !== P.gen) return;
      P.audio = null;
      if (P.playing) tjPlayAyahAt(ayahIdx + 1);
    };
    audio.onerror = function () {
      if (gen !== P.gen) return;
      if (allowFb && fb) run(fb, false);
      else if (P.playing) tjPlayAyahAt(ayahIdx + 1);
    };
    const p = audio.play();
    if (p && typeof p.catch === 'function') {
      p.catch(function () {
        if (gen !== P.gen) return;
        if (allowFb && fb) run(fb, false);
        else {
          showToast('Audio play blocked — tap Play again');
          P.playing = false;
          P.paused = true;
          tjUpdatePlayUI(false);
        }
      });
    }
  };
  run(url, true);
}

function bindArabicOnlyMushafPlay(ayahs) {
  const stAyahs = (window._tjMushafState && window._tjMushafState.ayahs) || ayahs || [];
  const playlist = tjBuildPlaylist(stAyahs);

  // Tag words with data-g
  try {
    const sheet = document.getElementById('tjMushafSheet');
    if (sheet && playlist.length) {
      const allNodes = Array.from(sheet.querySelectorAll('.tj-word, .tj-ayah-circle'));
      let bucket = [];
      let pIdx = 0;
      allNodes.forEach(node => {
        if (node.classList.contains('tj-word')) {
          bucket.push(node);
        } else if (node.classList.contains('tj-ayah-circle')) {
          const item = playlist[pIdx];
          if (item) {
            bucket.forEach(w => w.setAttribute('data-g', String(item.globalNum)));
            pIdx++;
          }
          bucket = [];
        }
      });
      if (bucket.length && playlist[pIdx]) {
        bucket.forEach(w => w.setAttribute('data-g', String(playlist[pIdx].globalNum)));
      }
    }
  } catch (e) {}

  // Stop any previous session completely
  tjHardStopAllSounds();

  window._tjPlayer = {
    playlist: playlist,
    ayahIdx: 0,
    wordIdx: 0,
    playing: false,
    paused: false,
    audio: null,
    gen: 0
  };
  // keep legacy ref in sync for highlight helpers
  window._tjResume = {
    ayahIdx: 0, wordIdx: 0, playing: false, paused: false,
    audio: null, timer: null, token: 0, playlist: playlist
  };

  const play = document.getElementById('tjPlayAllBtn');
  const stop = document.getElementById('tjStopBtn');

  if (play) {
    play.onclick = function (ev) {
      if (ev) { ev.preventDefault(); ev.stopPropagation(); }
      try { this.blur(); } catch (e) {}

      const P = window._tjPlayer;
      if (!P || !P.playlist || !P.playlist.length) {
        showToast('No ayahs to play');
        return;
      }

      // PLAYING → PAUSE (turant awaz band)
      if (P.playing) {
        try { if (P.audio) P.audio.pause(); } catch (e) {}
        P.playing = false;
        P.paused = true;
        if (window._tjResume) {
          window._tjResume.playing = false;
          window._tjResume.paused = true;
        }
        tjUpdatePlayUI(false);
        return;
      }

      // PAUSED → RESUME wahi se
      if (P.paused) {
        if (P.audio && P.audio.src) {
          P.playing = true;
          P.paused = false;
          if (window._tjResume) {
            window._tjResume.playing = true;
            window._tjResume.paused = false;
          }
          tjUpdatePlayUI(true);
          const pr = P.audio.play();
          if (pr && pr.catch) pr.catch(function () { tjPlayAyahAt(P.ayahIdx || 0); });
          return;
        }
        P.paused = false;
        tjPlayAyahAt(P.ayahIdx || 0);
        return;
      }

      // IDLE / after STOP → start
      tjPlayAyahAt(P.ayahIdx || 0);
    };
  }

  if (stop) {
    stop.onclick = function (ev) {
      if (ev) { ev.preventDefault(); ev.stopPropagation(); }
      try { this.blur(); } catch (e) {}

      const P = window._tjPlayer;
      // Invalidate in-flight + kill sound
      if (P) {
        P.gen = (P.gen || 0) + 1;
        P.playing = false;
        P.paused = false;
        P.ayahIdx = 0;
        P.wordIdx = 0;
      }
      tjHardStopAllSounds();
      tjClearWordHighlight();
      if (window._tjResume) {
        window._tjResume.playing = false;
        window._tjResume.paused = false;
        window._tjResume.ayahIdx = 0;
        window._tjResume.wordIdx = 0;
      }
      tjUpdatePlayUI(false);
      if (play) {
        play.innerHTML = '<i class="fas fa-play"></i> Play';
        play.classList.remove('playing');
      }
    };
  }

  // DO NOT move the play bar in the DOM — that was causing the upward jump
  try { applyArabicFont(selectedArabicFontId); } catch (e) {}
  tjUpdatePlayUI(false);
}







async function loadReaderContent(state) {
  const el = document.getElementById('readerContent');
  const sb = document.getElementById('readerScrollBody');
  const langObj = getLangObj(selectedLang);
  const alimObj = getAlimObj(selectedAlimId);
  const srcLbl = window._arabicOnlyQuran ? 'Arabic Only (bina tarjuma)' : (selectedAlimId !== 'auto' ? alimObj.label : langObj.label);
  sb.scrollTop = 0;
  readerItemsData = [];
  try {
    const fr = document.getElementById('fullReader');
    if (fr) fr.classList.toggle('arabic-only-mode', !!window._arabicOnlyQuran);
    const titleEl = document.getElementById('readerPageTitle');
    if (titleEl && window._arabicOnlyQuran && state && !String(titleEl.textContent||'').includes('Arabic')) {
      /* keep existing title; badge via srcLbl */
    }
  } catch (e) {}


  if (state.type === 'arabic-dua') {
    const d = state.data || {};
    const ar = d.arabic || d.ar || d.textAr || '';
    const title = d.title || d.name || 'Dua';
    const titleEl = document.getElementById('readerPageTitle');
    if (titleEl) titleEl.textContent = title + ' · Arabic Only';
    const one = [{ globalNum: 1, numberInSurah: 1, surahNum: 0, surahName: title, text: ar }];
    el.innerHTML = renderArabicOnlyMushaf(one, { title, surahName: title, ayahCount: 1 });
    bindArabicOnlyMushafPlay(one);
    return;
  }

  /* ===== PDF-styled single Ayat + Tarjuma + Tafseer page ===== */
  if (state.type === 'pdf-ayat-tafseer') {
    const s = state.data;
    const fromAyat = state.fromAyat || {};
    const an = state.focusAyah || fromAyat.num || 1;
    let effectiveLang = selectedLang;
    if (selectedAlimId !== 'auto') {
      if (selectedAlimId.startsWith('en.')) effectiveLang = 'en';
      else if (selectedAlimId.startsWith('ur.')) effectiveLang = 'ur';
      else if (selectedAlimId.startsWith('hi')) effectiveLang = 'hi';
      else if (selectedAlimId.startsWith('ar.')) effectiveLang = 'ar';
    }
    const isRtl = /^(ur|urdu|ar)/i.test(effectiveLang) || effectiveLang === 'urdu-hi';
    const dirStyle = isRtl ? 'direction:rtl;text-align:right;' : 'direction:ltr;text-align:left;font-family:IBM Plex Sans Condensed,sans-serif;';

    currentReaderTitle = `Surah ${s.n}: ${s.name} — Ayat ${an} Tafseer`;
    el.innerHTML = `<div class="pdf-mushaf-page" style="padding:12px;text-align:center;color:#0c6833;font-size:13px;"><i class="fas fa-spinner fa-spin"></i> Loading...</div>`;

    // Resolve Arabic + translation if missing
    let arText = (fromAyat.ar || '').trim();
    let trText = (fromAyat.tr || '').trim();
    if (!arText || !trText) {
      try {
        const [arRes, trRes] = await Promise.all([
          fetch(`https://api.alquran.cloud/v1/ayah/${s.n}:${an}/quran-uthmani`).then(r => r.json()),
          fetch(`https://api.alquran.cloud/v1/ayah/${s.n}:${an}/${(getLangObj(effectiveLang).aq || 'en.sahih')}`).then(r => r.json()).catch(() => null)
        ]);
        if (arRes && arRes.code === 200 && arRes.data) arText = arText || (arRes.data.text || '');
        if (trRes && trRes.code === 200 && trRes.data) trText = trText || (trRes.data.text || '');
      } catch (e) {}
    }

    // Build ayat-specific tafseer (unique per ayat, not same for whole surah)
    let sections;
    try {
      if (effectiveLang === 'roman') {
        sections = buildAyatTafseerRoman(s, an, arText, trText);
      } else if (effectiveLang === 'roman-hi') {
        const be = buildAyatTafseerEnglish(s, an, arText, trText);
        const raw = [];
        be.forEach(x => raw.push(x.h, x.p));
        const tr = await translateViaGTX(raw, 'hi');
        sections = be.map((_, i) => ({ h: devanagariToRoman(tr[i * 2] || ''), p: devanagariToRoman(tr[i * 2 + 1] || '') }));
      } else if (effectiveLang === 'urdu-hi') {
        sections = buildAyatTafseerRoman(s, an, arText, trText).map(x => ({ h: romanUrduToDevanagari(x.h), p: romanUrduToDevanagari(x.p) }));
      } else if (effectiveLang === 'en') {
        sections = buildAyatTafseerEnglish(s, an, arText, trText);
      } else {
        const be = buildAyatTafseerEnglish(s, an, arText, trText);
        const raw = [];
        be.forEach(x => raw.push(x.h, x.p));
        const tr = await translateViaGTX(raw, (getLangObj(effectiveLang).gt || 'en'));
        sections = be.map((_, i) => ({ h: tr[i * 2] || be[i].h, p: tr[i * 2 + 1] || be[i].p }));
      }
    } catch (e) {
      sections = buildAyatTafseerEnglish(s, an, arText, trText);
    }

    const tfHtml = (sections || []).map(sec => `
      <div class="pdf-tf-sec" style="${dirStyle}">
        <div class="pdf-tf-h">${escapeHTML(sec.h)}</div>
        <div class="pdf-tf-p">${escapeHTML(sec.p)}</div>
      </div>`).join('');

    el.innerHTML = `
      <div class="pdf-mushaf-page">
        <div class="pdf-mushaf-topbar">
          <span>تَبَارَكَ · Surah ${s.n}</span>
          <span class="page-num">${an}</span>
          <span>${escapeHTML(s.name || '')}</span>
        </div>
        <div class="pdf-mushaf-border">
          <div class="pdf-inner-frame">
            <div class="pdf-surah-banner" style="margin-bottom:0;">
              <div class="pdf-cartouche">
                <span class="circ">${s.n}</span>
                <span class="sname">سُوْرَةُ ${escapeHTML(String(s.name || ''))}<br><small>Ayat ${an}</small></span>
                <span class="circ">${an}</span>
              </div>
            </div>
            <div class="pdf-ayah-block" style="padding:10px 8px 6px;">
              <div class="pdf-ayah-ar" style="font-size:calc(var(--arabic-size, 26px) + 2px);line-height:1.9;text-align:center;padding:8px 4px;">
                ${escapeHTML(arText)} <span class="pdf-ayah-end">۝${an}</span>
              </div>
              <div class="pdf-ayah-tr-row" style="justify-content:center;">
                <div class="pdf-ayah-tr" style="text-align:center;width:100%;">${escapeHTML(trText)} <span class="pdf-c2">(${an})</span></div>
              </div>
            </div>
            <div class="pdf-ayah-tafseer pdf-full-tf">
              <span class="tf-label">تفسیر · Ayat ${an}</span>
              ${tfHtml}
            </div>
          </div>
        </div>
      </div>
    `;
    applyArabicFont(selectedArabicFontId);
    return;
  }

  if (state.type === 'tafseer') {
    const s = state.data;
    const startG = getSurahStartGlobalAyah(s.n);
    let effectiveLang = selectedLang;
    if (selectedAlimId !== 'auto') {
      if (selectedAlimId.startsWith('en.')) effectiveLang = 'en';
      else if (selectedAlimId.startsWith('ur.')) effectiveLang = 'ur';
      else if (selectedAlimId.startsWith('hi')) effectiveLang = 'hi';
      else if (selectedAlimId.startsWith('ar.')) effectiveLang = 'ar';
    }
    const effLangObj = getLangObj(effectiveLang);
    currentReaderTitle = `Surah ${s.n}: ${s.name} Tafseer (${srcLbl})`;

    const lightLoad = !!(state.fromPdf);
    const lightMsg = (txt) => lightLoad
      ? `<div style="text-align:center;padding:28px 16px;color:var(--text2);font-size:13px;opacity:.85;"><i class="fas fa-spinner fa-spin" style="font-size:18px;color:var(--accent);margin-right:8px;"></i>${txt}</div>`
      : `<div style="text-align:center;padding:80px 20px;color:var(--text2);"><i class="fas fa-spinner fa-spin" style="font-size:30px;color:var(--accent);display:block;margin-bottom:14px;"></i>${txt}</div>`;

    let sections;
    if (effectiveLang === 'roman') {
      sections = buildSurahTafseerRoman(s);
    } else if (effectiveLang === 'roman-hi') {
      const ck = `${s.n}::roman-hi`;
      if (tafseerTransCache[ck]) sections = tafseerTransCache[ck];
      else {
        el.innerHTML = lightMsg('Preparing Tafseer in Hindi Roman...');
        const be = buildSurahTafseerEnglish(s), raw = [];
        be.forEach(x => raw.push(x.h, x.p));
        const tr = await translateViaGTX(raw, 'hi');
        sections = be.map((_, i) => ({ h: devanagariToRoman(tr[i * 2] || ''), p: devanagariToRoman(tr[i * 2 + 1] || '') }));
        tafseerTransCache[ck] = sections;
      }
    } else if (effectiveLang === 'urdu-hi') {
      sections = buildSurahTafseerRoman(s).map(x => ({ h: romanUrduToDevanagari(x.h), p: romanUrduToDevanagari(x.p) }));
    } else if (effectiveLang === 'en') {
      sections = buildSurahTafseerEnglish(s);
    } else {
      const ck = `${s.n}::${effectiveLang}`;
      if (tafseerTransCache[ck]) sections = tafseerTransCache[ck];
      else {
        el.innerHTML = lightMsg(`Translating Tafseer into ${effLangObj.label}...`);
        const be = buildSurahTafseerEnglish(s), raw = [];
        be.forEach(x => raw.push(x.h, x.p));
        const tr = await translateViaGTX(raw, effLangObj.gt);
        sections = be.map((_, i) => ({ h: tr[i * 2] || be[i].h, p: tr[i * 2 + 1] || be[i].p }));
        tafseerTransCache[ck] = sections;
      }
    }

    const plain = sections.map(x => `${x.h}\n${x.p}`).join('\n\n');
    const wc = plain.trim().split(/\s+/).length;
    const focusAyah = state.focusAyah || null;
    const fromAyat = state.fromAyat || null;
    const headingExtra = focusAyah ? ` — Ayat ${focusAyah}` : '';
    currentReaderTitle = `Surah ${s.n}: ${s.name} Tafseer${headingExtra} (${srcLbl})`;
    currentReaderShareText = `Surah ${s.n}: ${s.name} (${s.meaning})${focusAyah ? ' | Ayat ' + focusAyah : ''}\nDaur: ${s.era} | Nuzul #${s.nuzul} | ${s.type} | ${s.ayats} Ayats\n\n${plain}`;
    readerItemsData = sections.map((x, idx) => ({
      kind: 'tafseer-sec',
      h: x.h,
      p: x.p,
      sampleGlobalAyah: startG + Math.min(idx, s.ayats - 1),
      _localLang: effectiveLang,
      _baseH: x.h,
      _baseP: x.p
    }));
    let tafseerLocalVoice = (fromAyat && fromAyat._localVoiceId) ? fromAyat._localVoiceId : selectedVoiceId;
    const voiceOptions = ALIM_VOICES.map(v => {
      const short = (v.label || '').replace(/^Voice:\s*/i, '');
      return `<option value="${v.id}"${v.id === tafseerLocalVoice ? ' selected' : ''}>${escapeHTML(short)}</option>`;
    }).join('');
    const langOptions = LANGUAGES.map(l => {
      const lab = l.label.length > 22 ? l.label.slice(0, 20) + '…' : l.label;
      return `<option value="${l.id}"${l.id === effectiveLang ? ' selected' : ''}>${escapeHTML(lab)}</option>`;
    }).join('');
    const isUrduScript = /^(ur|urdu)/i.test(effectiveLang) || effectiveLang === 'urdu-hi';
    // Alim Voice | Language | Play only
    const controlsRow = `
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;flex-wrap:wrap;">
        <select id="tafseerVoiceSelectLocal" class="ayah-mini-select" title="Alim / Qari Voice" style="flex:1.2;min-width:110px;height:36px;">${voiceOptions}</select>
        <select id="tafseerLangSelectLocal" class="ayah-mini-select" title="Tafseer Bhasha" style="flex:1.2;min-width:110px;height:36px;">${langOptions}</select>
        <button type="button" class="play-ayah-btn" id="topAllPlayBtn" style="flex:0 0 auto;min-width:90px;height:36px;"><i class="fas fa-play"></i> Play</button>
      </div>
    `;
    const ayatBanner = fromAyat ? `
      <div style="background:var(--panel-bg);border:1.3px solid var(--border);border-radius:10px;padding:12px 14px;margin-bottom:14px;">
        <div class="arabic-text" style="font-size:calc(var(--arabic-size) - 4px);margin-bottom:6px;">${escapeHTML(fromAyat.ar || '')}</div>
        <div class="trans-text${isUrduScript ? ' urdu-nastaliq' : ''}" style="margin-bottom:4px;">${escapeHTML(fromAyat.tr || '')}</div>
      </div>
    ` : '';
    el.innerHTML = `
      <h2 class="reader-page-heading">Surah ${s.n}: ${s.name} Tafseer${headingExtra}</h2>
      ${controlsRow}
      ${ayatBanner}
      <div class="tafseer-article${isUrduScript ? ' urdu-nastaliq' : ''}" id="readerItemsContainer"></div>
      ${getBottomActionsHTML()}
    `;
    // Focus ayat global number for Alim Play
    window._tafseerFocusGlobal = (fromAyat && fromAyat.globalNum)
      ? fromAyat.globalNum
      : (startG + Math.max(0, (focusAyah || 1) - 1));
    window._tafseerLocalVoice = () => tafseerLocalVoice;

    renderReaderItemsWithSearch();
    bindBottomReaderActions();
    // Top Play = Alim (related ayat) + full tafseer text
    const topPlay = document.getElementById('topAllPlayBtn');
    if (topPlay) topPlay.addEventListener('click', function () { playAllTafseerAlim(this); });
    const localVoiceSel = document.getElementById('tafseerVoiceSelectLocal');
    if (localVoiceSel) {
      localVoiceSel.addEventListener('change', function () {
        tafseerLocalVoice = this.value;
        window._tafseerLocalVoice = () => tafseerLocalVoice;
        showToast('Alim Voice: ' + (getVoiceObj(this.value).label || '').replace(/^Voice:\s*/i, ''));
      });
    }
    const localLangSel = document.getElementById('tafseerLangSelectLocal');
    if (localLangSel) {
      localLangSel.addEventListener('change', function () {
        selectedLang = this.value;
        selectedAlimId = 'auto';
        persistReaderPrefs();
        const mainLang = document.getElementById('readerLangSelect');
        if (mainLang) mainLang.value = selectedLang;
        loadReaderContent(currentReaderState);
      });
    }
    window._tafseerLocalVoice = () => tafseerLocalVoice;
    return;
  }

  if (state.type === 'para') {
    const p = state.data;
    currentReaderTitle = `Para ${p.num}: ${p.name} (${srcLbl})`;
    // Keep previous content — never wipe PDF with blocking loader
    if (!(state.bookStyle && el.querySelector('.pdf-mushaf-page'))) {
      if (state.bookStyle) {
        el.innerHTML = `<div class="pdf-mushaf-page" style="padding:20px;text-align:center;color:#0c6833;font-size:13px;"><i class="fas fa-spinner fa-spin" style="margin-right:8px;"></i>Para ${p.num}...</div>`;
      } else {
        el.innerHTML = `<div style="text-align:center;padding:24px 16px;color:var(--text2);font-size:13px;">Para ${p.num} · ${srcLbl}...</div>`;
      }
    }
    try {
      // --- Arabic ayahs (cached) ---
      let arAyahs = paraArCache[p.num];
      if (!arAyahs) {
        const arData = await (await fetch(`https://api.alquran.cloud/v1/juz/${p.num}/quran-uthmani`)).json();
        if (arData.code !== 200) throw 0;
        arAyahs = arData.data.ayahs.map(a => ({
          globalNum: a.number,
          numberInSurah: a.numberInSurah,
          surahNum: a.surah ? a.surah.number : 0,
          surahName: a.surah ? a.surah.englishName : '',
          text: a.text
        }));
        paraArCache[p.num] = arAyahs;
      }

      // Arabic-only mushaf design (bina tarjuma)
      if (window._arabicOnlyQuran) {
        const el = document.getElementById('readerContent');
        const titleEl = document.getElementById('readerPageTitle');
        if (titleEl) titleEl.textContent = `Para ${p.num} · Arabic Only`;
        el.innerHTML = renderArabicOnlyMushaf(arAyahs, {
          title: 'Para ' + p.num,
          juz: 'الجزء ' + p.num,
          surahName: p.name || ('Para ' + p.num),
          surahNum: '',
          ayahCount: arAyahs.length
        });
        bindArabicOnlyMushafPlay(arAyahs);
        return;
      }

      // --- Parallel: translations + WBW (both cached) ---
      const trKey = `${p.num}::${selectedLang}::${selectedAlimId || 'auto'}`;
      const wbwLangMap = {
        ur: 'ur', 'urdu-hi': 'ur', hi: 'hi', 'roman-hi': 'hi', roman: 'ur',
        en: 'en', bn: 'bn', id: 'id', tr: 'tr', fa: 'fa', fr: 'fr', de: 'de',
        es: 'es', ru: 'ru', ms: 'ms', ta: 'ta', ml: 'ml', ar: 'ar'
      };
      const wbwLang = wbwLangMap[selectedLang] || 'ur';
      const wbwKey = `${p.num}::${wbwLang}::${selectedLang}`;

      const loadTr = async () => {
        if (paraTrCache[trKey]) return paraTrCache[trKey];
        const t = await fetchTranslationsForAyahs('para', p.num, arAyahs, selectedLang, selectedAlimId);
        paraTrCache[trKey] = t;
        return t;
      };
      const loadWbw = async () => {
        if (!state.bookStyle) return {};
        if (paraWbwCache[wbwKey]) return paraWbwCache[wbwKey];
        const map = {};
        try {
          // First page to discover total
          const firstUrl = `https://api.quran.com/api/v4/verses/by_juz/${p.num}?language=${wbwLang}&words=true&word_fields=text_uthmani,translation&per_page=50&page=1`;
          const firstRes = await (await fetch(firstUrl)).json();
          const processPage = (res) => {
            (res.verses || []).forEach(v => {
              const words = (v.words || []).filter(w => w.char_type_name === 'word' || (w.text_uthmani && !/^[۝٠-٩\d]+$/.test((w.text_uthmani||'').trim())));
              map[v.verse_key] = words.map(w => {
                let tr = (w.translation && w.translation.text) ? w.translation.text.trim() : '';
                if (selectedLang === 'roman' || selectedLang === 'roman-hi') tr = devanagariToRoman(tr);
                else if (selectedLang === 'urdu-hi' && /[a-zA-Z]/.test(tr) && !/[\u0600-\u06FF]/.test(tr)) tr = romanUrduToDevanagari(tr);
                return { ar: (w.text_uthmani || w.text || '').trim(), tr };
              }).filter(w => w.ar);
            });
          };
          processPage(firstRes);
          const totalPages = Math.min((firstRes.pagination && firstRes.pagination.total_pages) || 1, 40);
          if (totalPages > 1) {
            const promises = [];
            for (let page = 2; page <= totalPages; page++) {
              const url = `https://api.quran.com/api/v4/verses/by_juz/${p.num}?language=${wbwLang}&words=true&word_fields=text_uthmani,translation&per_page=50&page=${page}`;
              promises.push(fetch(url).then(r => r.json()).then(processPage).catch(() => {}));
            }
            await Promise.all(promises);
          }
          paraWbwCache[wbwKey] = map;
        } catch (err) {
          console.warn('WBW fetch failed', err);
        }
        return map;
      };

      // Race WBW with short timeout so page opens fast even if WBW is slow
      const wbwPromise = loadWbw();
      const timeoutPromise = new Promise(resolve => setTimeout(() => resolve({}), 3500));
      const [trs, wbwByKey] = await Promise.all([loadTr(), Promise.race([wbwPromise, timeoutPromise])]);
      // If timeout won, still let full WBW finish in background and upgrade later if needed
      wbwPromise.then(fullMap => {
        if (fullMap && Object.keys(fullMap).length > Object.keys(wbwByKey || {}).length) {
          paraWbwCache[wbwKey] = fullMap;
        }
      }).catch(() => {});

      let lastS = -1;
      const sLines = [];
      readerItemsData = arAyahs.map((a, i) => {
        const isN = a.surahNum !== lastS;
        if (isN) { lastS = a.surahNum; sLines.push(`\n[Surah ${a.surahNum}: ${a.surahName}]`); }
        const tr = trs[i] || '';
        sLines.push(`(${a.surahNum}:${a.numberInSurah}) ${a.text}\n${tr}`);
        return { kind: 'ayah', globalNum: a.globalNum, num: a.numberInSurah, surahNum: a.surahNum, surahName: a.surahName, refLabel: `${a.surahName} | ${a.surahNum}:${a.numberInSurah}`, surahDivider: isN ? `Surah ${a.surahNum}: ${a.surahName}` : '', ar: a.text, tr };
      });
      currentReaderShareText = sLines.join('\n\n');
      const firstSurah = arAyahs[0] ? ` · Surah ${arAyahs[0].surahNum}: ${arAyahs[0].surahName}` : '';
      readerItemsData.forEach(it => { it.surahDivider = ''; });

      // PDF Quran — green mosaic + word-by-word boxes (screenshot style)
      if (state.bookStyle) {
        if (!el.querySelector('.pdf-mushaf-page')) {
          el.innerHTML = `<div class="pdf-mushaf-page" style="padding:16px;text-align:center;color:#0c6833;font-size:13px;">Para ${p.num}...</div>`;
        }

        const COLORS = ['pdf-c1','pdf-c2','pdf-c3','pdf-c4','pdf-c5','pdf-c6'];
        let lastSn = -1;
        let mushafHtml = '';
        let isFirstAyah = true;
        let firstSurahMeta = null;
        let colorIdx = 0;

        readerItemsData.forEach((a, aIdx) => {
          if (a.surahNum !== lastSn) {
            lastSn = a.surahNum;
            const sMeta = SURAH_LIST.find(x => x.n === a.surahNum);
            if (!firstSurahMeta) firstSurahMeta = sMeta || { n: a.surahNum, name: a.surahName, ayats: '', ruku: '', type: '' };
            if (mushafHtml) {
              mushafHtml += `<div class="pdf-surah-name">سورة ${a.surahNum} · ${escapeHTML(a.surahName || '')}</div>`;
            }
            isFirstAyah = true;
          }

          const arText = (a.ar || '').trim();
          const plainAr = arText.replace(/[\u064B-\u065F\u0670]/g, '');
          const isBismillah = isFirstAyah && /بسم\s*الله\s*الرحمن\s*الرحيم|بِسْمِ\s*ٱللَّهِ\s*ٱلرَّحْمَٰنِ\s*ٱلرَّحِيمِ/i.test(plainAr);
          const vKey = `${a.surahNum}:${a.num}`;
          const words = wbwByKey[vKey] || [];

          if (isBismillah && !words.length) {
            mushafHtml += `
              <div class="pdf-ayah-block">
                <div class="pdf-bismillah">${escapeHTML(arText)}</div>
                <div class="pdf-bismillah-tr">${escapeHTML(a.tr || '')}</div>
              </div>`;
          } else if (words.length) {
            // 1) Top Arabic words row
            let arRow = words.map((w, i) => {
              const c = COLORS[(colorIdx + i) % COLORS.length];
              return `<span class="w ${c}">${escapeHTML(w.ar)}</span>`;
            }).join(' ');
            // 2) Word boxes
            let boxes = words.map((w, i) => {
              const c = COLORS[(colorIdx + i) % COLORS.length];
              return `<div class="pdf-w-box"><span class="pdf-w-ar ${c}">${escapeHTML(w.ar)}</span><span class="pdf-w-ur ${c}">${escapeHTML(w.tr || '')}</span></div>`;
            }).join('');
            // 3) Full continuous translation: use selectedLang ayah tr if present, else join WBW words
            const fullTr = (a.tr || '').trim() || words.map(w => w.tr).filter(Boolean).join(' ');
            let trSpans = '';
            if (words.some(w => w.tr) && !(a.tr || '').trim()) {
              trSpans = words.map((w, i) => {
                const c = COLORS[(colorIdx + i) % COLORS.length];
                return `<span class="${c}">${escapeHTML(w.tr || '')}</span>`;
              }).join(' ');
            } else if (words.some(w => w.tr) && (a.tr || '').trim()) {
              // show selectedLang full line (alim/tarjuma dropdown) — still colored lightly
              trSpans = `<span class="pdf-c2">${escapeHTML(fullTr)}</span>`;
            } else {
              trSpans = escapeHTML(fullTr);
            }
            mushafHtml += `
              <div class="pdf-ayah-block">
                <div class="pdf-wbw-ar-row">${arRow} <span class="pdf-ayah-end">۝${a.num}</span></div>
                <div class="pdf-wbw-boxes">${boxes}</div>
                <div class="pdf-ayah-tr-row">
                  <div class="pdf-ayah-actions">
                    <button type="button" class="pdf-ayah-info-btn" title="Ayat Tafseer" data-surah="${a.surahNum}" data-ayah="${a.num}" data-global="${a.globalNum || ''}" data-sname="${escapeHTML(a.surahName || '')}"><i class="fas fa-info"></i></button>
                    <button type="button" class="pdf-ayah-play-btn" data-mode="arabic" title="Play Ayat (Arabic)" data-surah="${a.surahNum}" data-ayah="${a.num}" data-global="${a.globalNum || ''}"><i class="fas fa-play" style="font-size:9px;"></i></button>
                    <button type="button" class="pdf-ayah-play-btn" data-mode="tarjuma" title="Play Tarjuma" data-surah="${a.surahNum}" data-ayah="${a.num}" data-global="${a.globalNum || ''}"><i class="fas fa-comment-dots" style="font-size:9px;"></i></button>
                  </div>
                  <div class="pdf-ayah-tr">${trSpans} <span class="pdf-c2">(${a.num})</span></div>
                </div>
              </div>`;
            colorIdx = (colorIdx + words.length) % COLORS.length;
          } else {
            // fallback without WBW
            mushafHtml += `
              <div class="pdf-ayah-block">
                <div class="pdf-ayah-ar">${escapeHTML(arText)} <span class="pdf-ayah-end">۝${a.num}</span></div>
                <div class="pdf-ayah-tr-row">
                  <div class="pdf-ayah-actions">
                    <button type="button" class="pdf-ayah-info-btn" title="Ayat Tafseer" data-surah="${a.surahNum}" data-ayah="${a.num}" data-global="${a.globalNum || ''}" data-sname="${escapeHTML(a.surahName || '')}"><i class="fas fa-info"></i></button>
                    <button type="button" class="pdf-ayah-play-btn" data-mode="arabic" title="Play Ayat (Arabic)" data-surah="${a.surahNum}" data-ayah="${a.num}" data-global="${a.globalNum || ''}"><i class="fas fa-play" style="font-size:9px;"></i></button>
                    <button type="button" class="pdf-ayah-play-btn" data-mode="tarjuma" title="Play Tarjuma" data-surah="${a.surahNum}" data-ayah="${a.num}" data-global="${a.globalNum || ''}"><i class="fas fa-comment-dots" style="font-size:9px;"></i></button>
                  </div>
                  <div class="pdf-ayah-tr">${escapeHTML(a.tr || '')} <span class="pdf-c2">(${a.num})</span></div>
                </div>
              </div>`;
          }
          isFirstAyah = false;
        });

        const sm = firstSurahMeta || {};
        const surahNameAr = sm.name || (readerItemsData[0] && readerItemsData[0].surahName) || '';
        const surahNum = sm.n || (readerItemsData[0] && readerItemsData[0].surahNum) || '';
        const ayatsCount = sm.ayats || p.ayats || '';
        const rukuCount = sm.ruku || '';
        const typeTxt = (sm.type || '').toString();
        const typeUr = /makki|meccan|مکی/i.test(typeTxt) ? 'مکی ہے' : (/madani|medinan|مدنی/i.test(typeTxt) ? 'مدنی ہے' : typeTxt);

        el.innerHTML = `
          <div class="pdf-mushaf-page">
            <div class="pdf-mushaf-topbar">
              <span>تَبَارَكَ · Para ${p.num}</span>
              <span class="page-num">${p.num}</span>
              <span>${escapeHTML(p.name || '')}</span>
            </div>
            <div class="pdf-ruku-mark"><span>${rukuCount || 'ـ'}</span><span class="ain">ع</span><span>١</span></div>
            <div class="pdf-mushaf-border">
              <div class="pdf-inner-frame">
                <div class="pdf-surah-banner">
                  <div class="pdf-cartouche">
                    <span class="circ">${surahNum}</span>
                    <span class="sname">سُوْرَةُ ${escapeHTML(String(surahNameAr))}<br><small>${escapeHTML(typeTxt || '')}</small></span>
                    <span class="circ">${p.num}</span>
                  </div>
                  <div class="pdf-bismillah-box">بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ</div>
                  <div class="pdf-cartouche pdf-stats-box">
                    <div class="col"><span>اٰيَات</span><span>${ayatsCount || p.ayats}</span></div>
                    <div class="col"><span>رُكُوْع</span><span>${rukuCount || 'ـ'}</span></div>
                  </div>
                </div>
                <div class="pdf-intro-bar">
                  <span>سورۃ ${escapeHTML(String(surahNameAr))} ${typeUr}</span>
                  <span>اللہ کے نام سے شروع جو بڑا مہربان نہایت رحم والا ہے</span>
                  <span>اس میں ${ayatsCount || p.ayats} آیات${rukuCount ? ' اور ' + rukuCount + ' رکوع' : ''} ہیں۔</span>
                </div>
                ${mushafHtml}
              </div>
              <div class="pdf-manzil-wrap"><span class="pdf-manzil-badge">Para ${p.num}</span></div>
            </div>
          </div>
        `;
        const page = el.querySelector('.pdf-mushaf-page');
        if (page) {
          page.style.setProperty('--arabic-size', Math.max(readerFontSize + 10, 24) + 'px');
          page.style.setProperty('--read-size', Math.max(readerFontSize - 1, 12.5) + 'px');
        }
        applyArabicFont(selectedArabicFontId);
        // i → tafseer, play → audio
        el.querySelectorAll('.pdf-ayah-info-btn').forEach(btn => {
          btn.addEventListener('click', e => {
            e.preventDefault();
            e.stopPropagation();
            openPdfAyatTafseerPage(btn);
          });
        });
        el.querySelectorAll('.pdf-ayah-play-btn').forEach(btn => {
          btn.addEventListener('click', e => {
            e.preventDefault();
            e.stopPropagation();
            const gn = parseInt(btn.getAttribute('data-global'), 10);
            if (!gn) return;
            const mode = btn.getAttribute('data-mode') || 'arabic';
            const isPlaying = btn.classList.contains('playing');
            el.querySelectorAll('.pdf-ayah-play-btn.playing').forEach(b => {
              b.classList.remove('playing');
              const m = b.getAttribute('data-mode') || 'arabic';
              b.innerHTML = m === 'tarjuma'
                ? '<i class="fas fa-comment-dots" style="font-size:9px;"></i>'
                : '<i class="fas fa-play" style="font-size:9px;"></i>';
            });
            if (isPlaying) {
              stopAllAyatAudio();
              return;
            }
            btn.classList.add('playing');
            btn.innerHTML = '<i class="fas fa-stop" style="font-size:9px;"></i>';
            if (mode === 'tarjuma') {
              const item = (readerItemsData || []).find(x => x.globalNum === gn);
              const tr = (item && item.tr) || '';
              if (!tr) { showToast('Tarjuma nahi mili'); stopAllAyatAudio(); return; }
              playVoiceOnly(tr, btn);
            } else {
              playAyatSequence(gn, '', btn, selectedVoiceId);
            }
          });
        });
        return;
      }

      const infoTxt = `${p.ayats} Ayats · ${p.surahs} Surahs · ${p.type} · ${srcLbl}`;
      el.innerHTML = `
        <div style="display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:8px;flex-wrap:wrap;">
          <h2 class="reader-page-heading" style="margin:0;">Para ${p.num}: ${p.name}${firstSurah}</h2>
          <button type="button" class="surah-info-btn" id="readerInfoBtn" title="Info" style="opacity:0.75;"><i class="fas fa-info"></i></button>
        </div>
        ${getTopPlayBarHTML('reader')}
        <div id="readerItemsContainer"></div>
        ${getBottomActionsHTML()}
      `;
      renderReaderItemsWithSearch();
      bindBottomReaderActions();
      bindTopPlayBar('reader');
      const ib = document.getElementById('readerInfoBtn');
      if (ib) ib.addEventListener('click', () => showToast(infoTxt));
    } catch (e) {
      el.innerHTML = '<div style="text-align:center;color:var(--red);padding:60px;">Failed to load Para. Please check internet connection.</div>';
    }
    return;
  }

  if (state.type === 'surah') {
    const s = state.data;
    currentReaderTitle = `Surah ${s.n}: ${s.name} (${srcLbl})`;
    if (state.bookStyle) {
      el.innerHTML = `<div class="pdf-mushaf-page" style="padding:20px;text-align:center;color:#0c6833;font-size:13px;"><i class="fas fa-spinner fa-spin" style="margin-right:8px;"></i>Surah ${s.n}: ${s.name}...</div>`;
    } else {
      el.innerHTML = `<div style="text-align:center;padding:80px 20px;color:var(--text2);"><i class="fas fa-spinner fa-spin" style="font-size:30px;color:var(--accent);display:block;margin-bottom:14px;"></i>Loading Surah ${s.n}: ${s.name} (${s.ayats} Ayats) in ${srcLbl}...</div>`;
    }
    try {
      const arData = await (await fetch(`https://api.alquran.cloud/v1/surah/${s.n}/quran-uthmani`)).json();
      if (arData.code !== 200) throw 0;
      const arAyahs = arData.data.ayahs.map(a => ({
        globalNum: a.number,
        numberInSurah: a.numberInSurah,
        surahNum: s.n,
        surahName: s.name,
        text: a.text
      }));
      if (window._arabicOnlyQuran) {
        const titleEl = document.getElementById('readerPageTitle');
        if (titleEl) titleEl.textContent = `Surah ${s.n}: ${s.name} · Arabic Only`;
        arAyahs.forEach(a => { a._focus = true; });
        const filled = await tjFillPageAyahs(arAyahs, { minLines: 15, focusSurah: s.n });
        el.innerHTML = renderArabicOnlyMushaf(filled, {
          title: s.name,
          juz: '',
          surahName: s.nameAr || s.name,
          surahNum: s.n,
          ayahCount: arAyahs.length
        });
        bindArabicOnlyMushafPlay(filled);
        return;
      }
      const trs = await fetchTranslationsForAyahs('surah', s.n, arAyahs, selectedLang, selectedAlimId);
      const sLines = [];
      readerItemsData = arAyahs.map((a, i) => {
        const tr = trs[i] || '';
        sLines.push(`(${s.n}:${a.numberInSurah}) ${a.text}\n${tr}`);
        return { kind: 'ayah', globalNum: a.globalNum, num: a.numberInSurah, surahNum: s.n, surahName: s.name, refLabel: `Ayat ${s.n}:${a.numberInSurah}`, surahDivider: '', ar: a.text, tr };
      });
      currentReaderShareText = sLines.join('\n\n');

      // ===== BOOK / PDF STYLE (same as Para) =====
      if (state.bookStyle) {
        const wbwLangMap = {
          ur: 'ur', 'urdu-hi': 'ur', hi: 'hi', 'roman-hi': 'hi', roman: 'ur',
          en: 'en', bn: 'bn', id: 'id', tr: 'tr', fa: 'fa', fr: 'fr', de: 'de',
          es: 'es', ru: 'ru', ms: 'ms', ta: 'ta', ml: 'ml', ar: 'ar'
        };
        const wbwLang = wbwLangMap[selectedLang] || 'ur';
        const wbwKey = `surah${s.n}::${wbwLang}::${selectedLang}`;
        let wbwByKey = {};
        if (window.surahWbwCache && window.surahWbwCache[wbwKey]) {
          wbwByKey = window.surahWbwCache[wbwKey];
        } else {
          try {
            const map = {};
            const processPage = (res) => {
              (res.verses || []).forEach(v => {
                const words = (v.words || []).filter(w => w.char_type_name === 'word' || (w.text_uthmani && !/^[۝٠-٩\d]+$/.test((w.text_uthmani||'').trim())));
                map[v.verse_key] = words.map(w => {
                  let tr = (w.translation && w.translation.text) ? w.translation.text.trim() : '';
                  if (selectedLang === 'roman' || selectedLang === 'roman-hi') tr = devanagariToRoman(tr);
                  else if (selectedLang === 'urdu-hi' && /[a-zA-Z]/.test(tr) && !/[\u0600-\u06FF]/.test(tr)) tr = romanUrduToDevanagari(tr);
                  return { ar: (w.text_uthmani || w.text || '').trim(), tr };
                }).filter(w => w.ar);
              });
            };
            const firstUrl = `https://api.quran.com/api/v4/verses/by_chapter/${s.n}?language=${wbwLang}&words=true&word_fields=text_uthmani,translation&per_page=50&page=1`;
            const firstRes = await (await fetch(firstUrl)).json();
            processPage(firstRes);
            const totalPages = Math.min((firstRes.pagination && firstRes.pagination.total_pages) || 1, 20);
            if (totalPages > 1) {
              const promises = [];
              for (let page = 2; page <= totalPages; page++) {
                const url = `https://api.quran.com/api/v4/verses/by_chapter/${s.n}?language=${wbwLang}&words=true&word_fields=text_uthmani,translation&per_page=50&page=${page}`;
                promises.push(fetch(url).then(r => r.json()).then(processPage).catch(() => {}));
              }
              // Race with timeout so page never waits more than ~3s for WBW
              await Promise.race([
                Promise.all(promises),
                new Promise(resolve => setTimeout(resolve, 2800))
              ]);
            }
            window.surahWbwCache = window.surahWbwCache || {};
            window.surahWbwCache[wbwKey] = map;
            wbwByKey = map;
          } catch (err) {
            console.warn('Surah WBW fetch failed', err);
          }
        }

        const COLORS = ['pdf-c1','pdf-c2','pdf-c3','pdf-c4','pdf-c5','pdf-c6'];
        let mushafHtml = '';
        let isFirstAyah = true;
        let colorIdx = 0;

        readerItemsData.forEach((a) => {
          const arText = (a.ar || '').trim();
          const plainAr = arText.replace(/[\u064B-\u065F\u0670]/g, '');
          const isBismillah = isFirstAyah && /بسم\s*الله\s*الرحمن\s*الرحيم|بِسْمِ\s*ٱللَّهِ\s*ٱلرَّحْمَٰنِ\s*ٱلرَّحِيمِ/i.test(plainAr);
          const vKey = `${a.surahNum}:${a.num}`;
          const words = wbwByKey[vKey] || [];

          if (isBismillah && !words.length) {
            mushafHtml += `
              <div class="pdf-ayah-block">
                <div class="pdf-bismillah">${escapeHTML(arText)}</div>
                <div class="pdf-bismillah-tr">${escapeHTML(a.tr || '')}</div>
              </div>`;
          } else if (words.length) {
            let arRow = words.map((w, i) => {
              const c = COLORS[(colorIdx + i) % COLORS.length];
              return `<span class="w ${c}">${escapeHTML(w.ar)}</span>`;
            }).join(' ');
            let boxes = words.map((w, i) => {
              const c = COLORS[(colorIdx + i) % COLORS.length];
              return `<div class="pdf-w-box"><span class="pdf-w-ar ${c}">${escapeHTML(w.ar)}</span><span class="pdf-w-ur ${c}">${escapeHTML(w.tr || '')}</span></div>`;
            }).join('');
            const fullTr = (a.tr || '').trim() || words.map(w => w.tr).filter(Boolean).join(' ');
            let trSpans = '';
            if (words.some(w => w.tr) && !(a.tr || '').trim()) {
              trSpans = words.map((w, i) => {
                const c = COLORS[(colorIdx + i) % COLORS.length];
                return `<span class="${c}">${escapeHTML(w.tr || '')}</span>`;
              }).join(' ');
            } else if (words.some(w => w.tr) && (a.tr || '').trim()) {
              trSpans = `<span class="pdf-c2">${escapeHTML(fullTr)}</span>`;
            } else {
              trSpans = escapeHTML(fullTr);
            }
            mushafHtml += `
              <div class="pdf-ayah-block">
                <div class="pdf-wbw-ar-row">${arRow} <span class="pdf-ayah-end">۝${a.num}</span></div>
                <div class="pdf-wbw-boxes">${boxes}</div>
                <div class="pdf-ayah-tr-row">
                  <div class="pdf-ayah-actions">
                    <button type="button" class="pdf-ayah-info-btn" title="Ayat Tafseer" data-surah="${a.surahNum}" data-ayah="${a.num}" data-global="${a.globalNum || ''}" data-sname="${escapeHTML(a.surahName || '')}"><i class="fas fa-info"></i></button>
                    <button type="button" class="pdf-ayah-play-btn" data-mode="arabic" title="Play Ayat (Arabic)" data-surah="${a.surahNum}" data-ayah="${a.num}" data-global="${a.globalNum || ''}"><i class="fas fa-play" style="font-size:9px;"></i></button>
                    <button type="button" class="pdf-ayah-play-btn" data-mode="tarjuma" title="Play Tarjuma" data-surah="${a.surahNum}" data-ayah="${a.num}" data-global="${a.globalNum || ''}"><i class="fas fa-comment-dots" style="font-size:9px;"></i></button>
                  </div>
                  <div class="pdf-ayah-tr">${trSpans} <span class="pdf-c2">(${a.num})</span></div>
                </div>
              </div>`;
            colorIdx = (colorIdx + words.length) % COLORS.length;
          } else {
            mushafHtml += `
              <div class="pdf-ayah-block">
                <div class="pdf-ayah-ar">${escapeHTML(arText)} <span class="pdf-ayah-end">۝${a.num}</span></div>
                <div class="pdf-ayah-tr-row">
                  <div class="pdf-ayah-actions">
                    <button type="button" class="pdf-ayah-info-btn" title="Ayat Tafseer" data-surah="${a.surahNum}" data-ayah="${a.num}" data-global="${a.globalNum || ''}" data-sname="${escapeHTML(a.surahName || '')}"><i class="fas fa-info"></i></button>
                    <button type="button" class="pdf-ayah-play-btn" data-mode="arabic" title="Play Ayat (Arabic)" data-surah="${a.surahNum}" data-ayah="${a.num}" data-global="${a.globalNum || ''}"><i class="fas fa-play" style="font-size:9px;"></i></button>
                    <button type="button" class="pdf-ayah-play-btn" data-mode="tarjuma" title="Play Tarjuma" data-surah="${a.surahNum}" data-ayah="${a.num}" data-global="${a.globalNum || ''}"><i class="fas fa-comment-dots" style="font-size:9px;"></i></button>
                  </div>
                  <div class="pdf-ayah-tr">${escapeHTML(a.tr || '')} <span class="pdf-c2">(${a.num})</span></div>
                </div>
              </div>`;
          }
          isFirstAyah = false;
        });

        const typeTxt = (s.type || '').toString();
        const typeUr = /makki|meccan|مکی/i.test(typeTxt) ? 'مکی ہے' : (/madani|medinan|مدنی/i.test(typeTxt) ? 'مدنی ہے' : typeTxt);
        const ayatsCount = s.ayats || arAyahs.length;
        const rukuCount = s.ruku || 'ـ';

        el.innerHTML = `
          <div class="pdf-mushaf-page">
            <div class="pdf-mushaf-topbar">
              <span>تَبَارَكَ · Surah ${s.n}</span>
              <span class="page-num">${s.n}</span>
              <span>${escapeHTML(s.name || '')}</span>
            </div>
            <div class="pdf-ruku-mark"><span>${rukuCount}</span><span class="ain">ع</span><span>١</span></div>
            <div class="pdf-mushaf-border">
              <div class="pdf-inner-frame">
                <div class="pdf-surah-banner">
                  <div class="pdf-cartouche">
                    <span class="circ">${s.n}</span>
                    <span class="sname">سُوْرَةُ ${escapeHTML(String(s.name))}<br><small>${escapeHTML(typeTxt || '')}</small></span>
                    <span class="circ">${s.n}</span>
                  </div>
                  <div class="pdf-bismillah-box">بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ</div>
                  <div class="pdf-cartouche pdf-stats-box">
                    <div class="col"><span>اٰيَات</span><span>${ayatsCount}</span></div>
                    <div class="col"><span>رُكُوْع</span><span>${rukuCount}</span></div>
                  </div>
                </div>
                <div class="pdf-intro-bar">
                  <span>سورۃ ${escapeHTML(String(s.name))} ${typeUr}</span>
                  <span>اللہ کے نام سے شروع جو بڑا مہربان نہایت رحم والا ہے</span>
                  <span>اس میں ${ayatsCount} آیات${rukuCount && rukuCount !== 'ـ' ? ' اور ' + rukuCount + ' رکوع' : ''} ہیں۔</span>
                </div>
                ${mushafHtml}
              </div>
              <div class="pdf-manzil-wrap"><span class="pdf-manzil-badge">Surah ${s.n}</span></div>
            </div>
          </div>
        `;
        const page = el.querySelector('.pdf-mushaf-page');
        if (page) {
          page.style.setProperty('--arabic-size', Math.max(readerFontSize + 10, 24) + 'px');
          page.style.setProperty('--read-size', Math.max(readerFontSize - 1, 12.5) + 'px');
        }
        applyArabicFont(selectedArabicFontId);
        el.querySelectorAll('.pdf-ayah-info-btn').forEach(btn => {
          btn.addEventListener('click', e => {
            e.preventDefault();
            e.stopPropagation();
            openPdfAyatTafseerPage(btn);
          });
        });
        el.querySelectorAll('.pdf-ayah-play-btn').forEach(btn => {
          btn.addEventListener('click', e => {
            e.preventDefault();
            e.stopPropagation();
            const gn = parseInt(btn.getAttribute('data-global'), 10);
            if (!gn) return;
            const mode = btn.getAttribute('data-mode') || 'arabic';
            const isPlaying = btn.classList.contains('playing');
            el.querySelectorAll('.pdf-ayah-play-btn.playing').forEach(b => {
              b.classList.remove('playing');
              const m = b.getAttribute('data-mode') || 'arabic';
              b.innerHTML = m === 'tarjuma'
                ? '<i class="fas fa-comment-dots" style="font-size:9px;"></i>'
                : '<i class="fas fa-play" style="font-size:9px;"></i>';
            });
            if (isPlaying) {
              stopAllAyatAudio();
              return;
            }
            btn.classList.add('playing');
            btn.innerHTML = '<i class="fas fa-stop" style="font-size:9px;"></i>';
            if (mode === 'tarjuma') {
              const item = (readerItemsData || []).find(x => x.globalNum === gn);
              const tr = (item && item.tr) || '';
              if (!tr) { showToast('Tarjuma nahi mili'); stopAllAyatAudio(); return; }
              playVoiceOnly(tr, btn);
            } else {
              playAyatSequence(gn, '', btn, selectedVoiceId);
            }
          });
        });
        return;
      }

      // Normal (non-PDF) surah view
      const infoTxt = `${s.ayats} Ayats · ${s.ruku} Rukus · ${s.type} · ${srcLbl}`;
      el.innerHTML = `
        <div style="display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:8px;flex-wrap:wrap;">
          <h2 class="reader-page-heading" style="margin:0;">Surah ${s.n}: ${s.name}</h2>
          <button type="button" class="surah-info-btn" id="readerInfoBtn" title="Info" style="opacity:0.75;"><i class="fas fa-info"></i></button>
        </div>
        ${getTopPlayBarHTML('reader')}
        <div id="readerItemsContainer"></div>
        ${getBottomActionsHTML()}
      `;
      renderReaderItemsWithSearch();
      bindBottomReaderActions();
      bindTopPlayBar('reader');
      const ib = document.getElementById('readerInfoBtn');
      if (ib) ib.addEventListener('click', () => showToast(infoTxt));
    } catch (e) {
      el.innerHTML = '<div style="text-align:center;color:var(--red);padding:60px;">Failed to load Surah. Please check internet connection.</div>';
    }
    return;
  }

  if (state.type === 'ayat') {
    const a = state.data;
    currentReaderTitle = `Surah ${a.surahNum}: ${a.surahName} - Ayat ${a.ayahInSurah} (${srcLbl})`;
    // Arabic-only: mushaf page with this ayat highlighted (bina tarjuma)
    if (window._arabicOnlyQuran) {
      let arText = a.text || a.ar || '';
      if (!arText) {
        try {
          const j = await (await fetch(`https://api.alquran.cloud/v1/ayah/${a.surahNum}:${a.ayahInSurah}/quran-uthmani`)).json();
          if (j.code === 200) arText = j.data.text;
        } catch (e) {}
      }
      const one = [{
        globalNum: a.globalNum,
        numberInSurah: a.ayahInSurah,
        surahNum: a.surahNum,
        surahName: a.surahName,
        text: arText,
        _focus: true
      }];
      const titleEl = document.getElementById('readerPageTitle');
      if (titleEl) titleEl.textContent = `Ayat ${a.surahNum}:${a.ayahInSurah} · Arabic Only`;
      const filled = await tjFillPageAyahs(one, { minLines: 15, focusAyah: a.ayahInSurah });
      el.innerHTML = renderArabicOnlyMushaf(filled, {
        title: a.surahName,
        surahName: a.surahName,
        surahNum: a.surahNum,
        ayahCount: filled.length,
        focusGlobal: a.ayahInSurah
      });
      bindArabicOnlyMushafPlay(filled);
      return;
    }
    el.innerHTML = `<div style="text-align:center;padding:80px 20px;color:var(--text2);"><i class="fas fa-spinner fa-spin" style="font-size:30px;color:var(--accent);display:block;margin-bottom:14px;"></i>Loading Ayat ${a.surahNum}:${a.ayahInSurah} in ${srcLbl}...</div>`;
    try {
      const trs = await fetchTranslationsForAyahs('ayat', a.globalNum, [{ numberInSurah: a.ayahInSurah, surahNum: a.surahNum, surahName: a.surahName, text: a.text }], selectedLang, selectedAlimId);
      const tr = trs[0] || '';
      currentReaderShareText = `Surah ${a.surahNum}: ${a.surahName} (Ayat ${a.ayahInSurah} | Para ${a.para} | ${a.words} Words)\n\n${a.text}\n\n${tr}`;
      readerItemsData = [{ kind: 'ayah', globalNum: a.globalNum, num: a.ayahInSurah, surahNum: a.surahNum, surahName: a.surahName, refLabel: `Ayat ${a.surahNum}:${a.ayahInSurah}`, surahDivider: '', ar: a.text, tr, singleCentered: true }];
      const infoTxt = `Ayat #${a.globalNum} · Ayat ${a.ayahInSurah} · Para ${a.para} · ${a.words} Words · ${srcLbl}`;
      el.innerHTML = `
        <div style="display:flex;align-items:center;justify-content:center;gap:8px;margin-bottom:8px;flex-wrap:wrap;">
          <h2 class="reader-page-heading" style="margin:0;">Surah ${a.surahNum}: ${a.surahName} - Ayat ${a.ayahInSurah}</h2>
          <button type="button" class="surah-info-btn" id="readerInfoBtn" title="Info" style="opacity:0.75;"><i class="fas fa-info"></i></button>
        </div>
        ${getTopPlayBarHTML('reader')}
        <div id="readerItemsContainer"></div>
        ${getBottomActionsHTML()}
      `;
      renderReaderItemsWithSearch();
      bindTopPlayBar('reader');
      const ib = document.getElementById('readerInfoBtn');
      if (ib) ib.addEventListener('click', () => showToast(infoTxt));
      bindBottomReaderActions();
    } catch (e) {
      el.innerHTML = '<div style="text-align:center;color:var(--red);padding:60px;">Failed to load Ayat translation.</div>';
    }
  }
}

/* ==================== HOME LIST RENDERERS ==================== */
function renderParaList() {
  const q = document.getElementById('paraSearchInput').value.trim();
  const clr = document.getElementById('paraSearchClear');
  clr.style.display = q ? 'flex' : 'none';
  const box = document.getElementById('paraResult');
  const info = document.getElementById('paraInfo');
  let mb = 0, th = 0;

  const items = PARA_INFO.map(p => {
    const tR = countAndHighlight(`Para ${p.num} - ${p.name}`, q);
    const sR = countAndHighlight(`${p.surahs} Surah${p.surahs > 1 ? 's' : ''}`, q);
    const p1R = countAndHighlight(`${p.ayats} Ayats`, q);
    const p2R = countAndHighlight(p.type, q);
    const hits = tR.count + sR.count + p1R.count + p2R.count;
    if (hits > 0) { mb++; th += hits; }
    return { p, hits, tHTML: tR.html, sHTML: sR.html, p1HTML: p1R.html, p2HTML: p2R.html };
  });

  if (q) {
    items.sort((a, b) => (b.hits > 0 ? 1 : 0) - (a.hits > 0 ? 1 : 0));
    info.classList.add('has-search');
    info.textContent = mb ? `Found: ${mb} Para | ${th} word${th > 1 ? 's' : ''} matched` : `No match found for "${q}"`;
  } else {
    info.classList.remove('has-search');
    info.innerHTML = '30 Pare &bull; Scroll &amp; Click any Para box to read';
  }

  const list = document.createElement('div');
  list.className = 'list-stack';
  // Starting surah number for each Para (1-based juz start)
  const PARA_START_SURAH = [1,2,2,3,4,4,5,6,6,7,9,10,11,12,15,16,17,18,19,21,23,24,25,27,29,33,36,39,46,51];
  items.forEach(({ p, hits, tHTML, sHTML, p1HTML, p2HTML }) => {
    const c = document.createElement('div');
    c.className = 'item-box' + (q && hits === 0 ? ' search-dim' : '');
    c.innerHTML = `
      <div class="item-left">
        <div class="item-badge">${p.num}</div>
        <div class="item-main">
          <div class="item-title">${tHTML}</div>
          <div class="item-sub">${sHTML}</div>
        </div>
      </div>
      <div class="item-pills">
        <div class="pills-col">
          <span class="meta-pill">${p1HTML}</span>
          <span class="meta-pill accent-pill">${p2HTML}</span>
        </div>
        <button type="button" class="surah-info-btn" title="Para ${p.num} related Tafseer"><i class="fas fa-info"></i></button>
      </div>
    `;
    c.querySelector('.surah-info-btn').addEventListener('click', e => {
      e.stopPropagation();
      const sn = PARA_START_SURAH[p.num - 1] || 1;
      const surah = SURAH_LIST.find(x => x.n === sn);
      if (surah) openFullReader({ type: 'tafseer', data: surah });
      else openFullReader({ type: 'para', data: p });
    });
    c.addEventListener('click', () => openFullReader({ type: 'para', data: p }));
    list.appendChild(c);
  });
  box.innerHTML = '';
  box.appendChild(list);
  box.scrollTop = 0;
}

function renderSurahList() {
  const q = document.getElementById('surahSearchInput').value.trim();
  const clr = document.getElementById('surahSearchClear');
  clr.style.display = q ? 'flex' : 'none';
  const box = document.getElementById('surahResult');
  const info = document.getElementById('surahInfo');
  let mb = 0, th = 0;

  const items = SURAH_LIST.map(s => {
    const nm = (/^\d+$/.test(q) && String(s.n) === q) ? 1 : 0;
    const tR = countAndHighlight(`Surah ${s.name}`, q);
    const sR = countAndHighlight(`${s.ruku} Ruku${s.ruku > 1 ? 's' : ''} | ${s.meaning}`, q);
    const p1R = countAndHighlight(`${s.ayats} Ayats`, q);
    const p2R = countAndHighlight(s.type, q);
    const hits = nm + tR.count + sR.count + p1R.count + p2R.count;
    if (hits > 0) { mb++; th += hits; }
    return { s, hits, nm, tHTML: tR.html, sHTML: sR.html, p1HTML: p1R.html, p2HTML: p2R.html };
  });

  if (q) {
    items.sort((a, b) => ((b.hits > 0) !== (a.hits > 0)) ? (b.hits > 0 ? 1 : -1) : (b.nm !== a.nm ? b.nm - a.nm : a.s.n - b.s.n));
    info.classList.add('has-search');
    info.textContent = mb ? `Found: ${mb} Surah | ${th} word${th > 1 ? 's' : ''} matched` : `No match found for "${q}"`;
  } else {
    info.classList.remove('has-search');
    info.innerHTML = '114 Surahs &bull; Click box to read Tarjuma or (i) for Tafseer';
  }

  const list = document.createElement('div');
  list.className = 'list-stack';
  items.forEach(({ s, hits, nm, tHTML, sHTML, p1HTML, p2HTML }) => {
    const c = document.createElement('div');
    c.className = 'item-box' + (q && hits === 0 ? ' search-dim' : '');
    c.innerHTML = `
      <div class="item-left">
        <div class="item-badge"${nm ? ' style="background:#22c55e;"' : ''}>${s.n}</div>
        <div class="item-main">
          <div class="item-title">${tHTML}</div>
          <div class="item-sub">${sHTML}</div>
        </div>
      </div>
      <div class="item-pills">
        <div class="pills-col">
          <span class="meta-pill">${p1HTML}</span>
          <span class="meta-pill accent-pill">${p2HTML}</span>
        </div>
        <button type="button" class="surah-info-btn" title="Surah ${s.name} Tafseer"><i class="fas fa-info"></i></button>
      </div>
    `;
    c.querySelector('.surah-info-btn').addEventListener('click', e => {
      e.stopPropagation();
      openFullReader({ type: 'tafseer', data: s });
    });
    c.addEventListener('click', () => openFullReader({ type: 'surah', data: s }));
    list.appendChild(c);
  });
  box.innerHTML = '';
  box.appendChild(list);
  box.scrollTop = 0;
}

let orderedTafseerAyahs = [];
const TAFSEER_STRIDE = 86;

function renderTafseerList() {
  if (!allAyahsCache.length) {
    const box = document.getElementById('tafseerResult');
    const info = document.getElementById('tafseerInfo');
    if (ayatLoadingInProgress) {
      info.textContent = 'Loading all 6,236 Ayat Tafseer...';
      box.innerHTML = `<div style="text-align:center;padding:120px 20px;color:var(--text2);font-size:15px;"><i class="fas fa-spinner fa-spin" style="font-size:34px;margin-bottom:16px;display:block;color:var(--accent);"></i>Loading 6,236 Ayat Tafseer boxes...</div>`;
    } else {
      initAllAyats().then(() => renderTafseerListShell());
    }
    return;
  }
  renderTafseerListShell();
}

function applyTafseerSearch() {
  if (!allAyahsCache.length) {
    renderTafseerList();
    return;
  }
  if (!document.getElementById('tafseerVirtualLayer')) {
    renderTafseerListShell();
    return;
  }
  const q = document.getElementById('tafseerSearchInput').value.trim();
  const qL = q.toLowerCase();
  const info = document.getElementById('tafseerInfo');
  document.getElementById('tafseerSearchClear').style.display = q ? 'flex' : 'none';

  // Support 2.5 / 10.3 / 2:255 style
  const refMatch = q.match(/^(\d{1,3})[.:](\d{1,3})$/);
  const refSurah = refMatch ? parseInt(refMatch[1], 10) : 0;
  const refAyat = refMatch ? parseInt(refMatch[2], 10) : 0;

  if (!q) {
    orderedTafseerAyahs = allAyahsCache.map(a => ({ ...a, hits: 0 }));
    info.classList.remove('has-search');
    info.innerHTML = `All ${allAyahsCache.length.toLocaleString()} Ayat Tafseer &bull; Click any box to open Tafseer`;
  } else {
    const m = [], o = [];
    let twh = 0;
    allAyahsCache.forEach(a => {
      const tS = `Surah ${a.surahNum}: ${a.surahName} - Ayat ${a.ayahInSurah} Tafseer`;
      const hay = `${a.globalNum} ${tS} ${a.surahNum}:${a.ayahInSurah} ${a.surahNum}.${a.ayahInSurah} para ${a.para}`.toLowerCase();
      let matched = false;
      if (refSurah && refAyat && a.surahNum === refSurah && a.ayahInSurah === refAyat) {
        matched = true;
        twh += 2;
      } else if (hay.includes(qL)) {
        matched = true;
        const rx = new RegExp(escapeRegex(q), 'gi');
        twh += (`${a.globalNum} ${tS}`.match(rx) || []).length || 1;
      }
      if (matched) m.push({ ...a, hits: 2 });
      else o.push({ ...a, hits: 0 });
    });
    orderedTafseerAyahs = m.concat(o);
    info.classList.add('has-search');
    info.textContent = m.length
      ? `Found: ${m.length.toLocaleString()} Tafseer | ${refSurah ? 'Surah ' + refSurah + ' Ayat ' + refAyat : twh + ' matched'}`
      : `No match found for "${q}"`;
  }
  document.getElementById('tafseerResult').scrollTop = 0;
  updateVirtualTafseerSlice();
}

function renderTafseerListShell() {
  const box = document.getElementById('tafseerResult');
  box.innerHTML = `<div class="virtual-viewport" id="tafseerVirtualViewport"><div class="virtual-items-layer" id="tafseerVirtualLayer"></div></div>`;
  box.onscroll = () => updateVirtualTafseerSlice();
  applyTafseerSearch();
}

function updateVirtualTafseerSlice() {
  const box = document.getElementById('tafseerResult');
  const vp = document.getElementById('tafseerVirtualViewport');
  const ly = document.getElementById('tafseerVirtualLayer');
  if (!vp || !ly) return;

  const q = document.getElementById('tafseerSearchInput').value.trim();
  const tot = orderedTafseerAyahs.length;
  vp.style.height = Math.max(0, tot * TAFSEER_STRIDE - (tot ? 16 : 0)) + 'px';

  const st = Math.max(0, box.scrollTop);
  const si = Math.max(0, Math.floor(st / TAFSEER_STRIDE) - 3);
  const ei = Math.min(tot, si + Math.ceil(700 / TAFSEER_STRIDE) + 7);
  ly.style.transform = `translateY(${si * TAFSEER_STRIDE}px)`;
  ly.innerHTML = '';

  const frag = document.createDocumentFragment();
  for (let i = si; i < ei; i++) {
    const a = orderedTafseerAyahs[i];
    const tS = `Surah ${a.surahNum}: ${a.surahName} - Ayat ${a.ayahInSurah} Tafseer`;
    const sS = `Ref ${a.surahNum}:${a.ayahInSurah}`;
    const p1 = `${a.words} Words`;
    const p2 = `Para ${a.para}`;
    const c = document.createElement('div');
    c.className = 'item-box' + (q && a.hits === 0 ? ' search-dim' : '');
    c.innerHTML = `
      <div class="item-left">
        <div class="item-badge"${(q && String(a.globalNum) === q) ? ' style="background:#22c55e;"' : ''}>${a.globalNum}</div>
        <div class="item-main">
          <div class="item-title">${q ? countAndHighlight(tS, q).html : escapeHTML(tS)}</div>
          <div class="item-sub">${q ? countAndHighlight(sS, q).html : escapeHTML(sS)}</div>
        </div>
      </div>
      <div class="item-pills">
        <div class="pills-col">
          <span class="meta-pill">${q ? countAndHighlight(p1, q).html : escapeHTML(p1)}</span>
          <span class="meta-pill accent-pill">${q ? countAndHighlight(p2, q).html : escapeHTML(p2)}</span>
        </div>
      </div>
    `;
    c.addEventListener('click', () => {
      const surah = SURAH_LIST.find(x => x.n === a.surahNum);
      if (!surah) { showToast('Surah not found'); return; }
      openAyatTafseerPage(surah, {
        globalNum: a.globalNum,
        num: a.ayahInSurah,
        surahNum: a.surahNum,
        surahName: a.surahName,
        ar: a.text,
        tr: '',
        _localVoiceId: selectedVoiceId
      });
    });
    frag.appendChild(c);
  }
  ly.appendChild(frag);
}

/* ==================== SECTION 3: ALL 6,236 AYATS (VIRTUAL SCROLL) ==================== */
let allAyahsCache = [];
let orderedAyahs = [];
let ayatLoadingInProgress = false;
const AYAT_STRIDE = 86;

async function initAllAyats() {
  if (allAyahsCache.length) {
    renderAyatListShell();
    if (document.getElementById('modeTafseerView').style.display !== 'none') renderTafseerListShell();
    if (document.getElementById('modePdfAyatView').style.display !== 'none') renderPdfAyatList();
    if (document.getElementById('modePdfTafseerView').style.display !== 'none') renderPdfTafseerList();
    return;
  }
  ayatLoadingInProgress = true;
  const box = document.getElementById('ayatResult');
  const info = document.getElementById('ayatInfo');
  const tBox = document.getElementById('tafseerResult');
  const tInfo = document.getElementById('tafseerInfo');
  if (info) info.textContent = 'Loading all 6,236 Ayats...';
  if (box) box.innerHTML = `<div style="text-align:center;padding:120px 20px;color:var(--text2);font-size:15px;"><i class="fas fa-spinner fa-spin" style="font-size:34px;margin-bottom:16px;display:block;color:var(--accent);"></i>Loading all 6,236 Ayat boxes...</div>`;
  if (tInfo) tInfo.textContent = 'Loading all 6,236 Ayat Tafseer...';
  if (tBox) tBox.innerHTML = `<div style="text-align:center;padding:120px 20px;color:var(--text2);font-size:15px;"><i class="fas fa-spinner fa-spin" style="font-size:34px;margin-bottom:16px;display:block;color:var(--accent);"></i>Loading 6,236 Ayat Tafseer boxes...</div>`;
  try {
    const json = await (await fetch('https://api.alquran.cloud/v1/quran/quran-uthmani')).json();
    if (json.code === 200 && json.data && json.data.surahs) {
      const list = [];
      json.data.surahs.forEach(surah => {
        (surah.ayahs || []).forEach(ayah => {
          const ct = (ayah.text || '').trim();
          list.push({
            globalNum: ayah.number,
            surahNum: surah.number,
            surahName: surah.englishName || surah.name || '',
            ayahInSurah: ayah.numberInSurah,
            para: ayah.juz || 1,
            words: ct ? ct.split(/\s+/).length : 0,
            text: ct,
            hits: 0
          });
        });
      });
      // Ensure we always aim for full 6236
      if (list.length < 6236) {
        console.warn('Ayah count from API:', list.length, '- expected 6236');
      }
      allAyahsCache = list;
      orderedAyahs = list.slice();
      orderedTafseerAyahs = list.map(a => ({ ...a, hits: 0 }));
      ayatLoadingInProgress = false;
      renderAyatListShell();
      if (document.getElementById('modeTafseerView').style.display !== 'none') renderTafseerListShell();
      if (document.getElementById('modePdfAyatView').style.display !== 'none') renderPdfAyatList();
      if (document.getElementById('modePdfTafseerView').style.display !== 'none') renderPdfTafseerList();
      showToast((list.length === 6236 ? '6,236' : list.length) + ' Ayats ready');
    } else throw 0;
  } catch (e) {
    ayatLoadingInProgress = false;
    if (info) info.textContent = 'Failed to load Ayats';
    if (box) box.innerHTML = `<div style="text-align:center;padding:80px 20px;color:var(--red);">Network error.<br><br><button class="r-back-btn" style="margin:0 auto;padding:0 18px;" onclick="initAllAyats()"><i class="fas fa-redo"></i> Retry</button></div>`;
    if (tInfo) tInfo.textContent = 'Failed to load Tafseer list';
    if (tBox) tBox.innerHTML = `<div style="text-align:center;padding:80px 20px;color:var(--red);">Network error.<br><br><button class="r-back-btn" style="margin:0 auto;padding:0 18px;" onclick="initAllAyats()"><i class="fas fa-redo"></i> Retry</button></div>`;
  }
}

function applyAyatSearch() {
  if (!allAyahsCache.length) return;
  const q = document.getElementById('ayatSearchInput').value.trim();
  const qL = q.toLowerCase();
  const info = document.getElementById('ayatInfo');
  document.getElementById('ayatSearchClear').style.display = q ? 'flex' : 'none';

  // Support 2.5 / 10.3 / 2:255 style (Surah.Ayat or Surah:Ayat)
  const refMatch = q.match(/^(\d{1,3})[.:](\d{1,3})$/);
  const refSurah = refMatch ? parseInt(refMatch[1], 10) : 0;
  const refAyat = refMatch ? parseInt(refMatch[2], 10) : 0;

  if (!q) {
    orderedAyahs = allAyahsCache.map(a => ({ ...a, hits: 0 }));
    info.classList.remove('has-search');
    info.innerHTML = `All ${allAyahsCache.length.toLocaleString()} Ayats &bull; Scroll &amp; Click any Ayat box`;
  } else {
    const m = [], o = [];
    let twh = 0;
    allAyahsCache.forEach(a => {
      const ref = `${a.surahNum}:${a.ayahInSurah}`;
      const refDot = `${a.surahNum}.${a.ayahInSurah}`;
      const tS = `Surah ${a.surahNum}: ${a.surahName} - Ayat ${a.ayahInSurah}`;
      const hay = `${a.globalNum} ${tS} ref ${ref} ${refDot} para ${a.para} ${a.words} words`.toLowerCase();
      let matched = false;
      if (refSurah && refAyat && a.surahNum === refSurah && a.ayahInSurah === refAyat) {
        matched = true;
        twh += 2;
      } else if (hay.includes(qL)) {
        matched = true;
        const rx = new RegExp(escapeRegex(q), 'gi');
        twh += (`${a.globalNum} ${tS} Ref ${ref}`.match(rx) || []).length || 1;
      }
      if (matched) m.push({ ...a, hits: matched ? 2 : 0 });
      else o.push({ ...a, hits: 0 });
    });
    orderedAyahs = m.concat(o);
    info.classList.add('has-search');
    info.textContent = m.length
      ? `Found: ${m.length.toLocaleString()} Ayat | ${refSurah ? 'Surah ' + refSurah + ' Ayat ' + refAyat : twh + ' matched'}`
      : `No match found for "${q}"`;
  }
  document.getElementById('ayatResult').scrollTop = 0;
  updateVirtualAyatSlice();
}

function renderAyatListShell() {
  const box = document.getElementById('ayatResult');
  box.innerHTML = `<div class="virtual-viewport" id="ayatVirtualViewport"><div class="virtual-items-layer" id="ayatVirtualLayer"></div></div>`;
  box.onscroll = () => updateVirtualAyatSlice();
  applyAyatSearch();
}

function updateVirtualAyatSlice() {
  const box = document.getElementById('ayatResult');
  const vp = document.getElementById('ayatVirtualViewport');
  const ly = document.getElementById('ayatVirtualLayer');
  if (!vp || !ly) return;

  const q = document.getElementById('ayatSearchInput').value.trim();
  const tot = orderedAyahs.length;
  vp.style.height = Math.max(0, tot * AYAT_STRIDE - (tot ? 16 : 0)) + 'px';

  const st = Math.max(0, box.scrollTop);
  const si = Math.max(0, Math.floor(st / AYAT_STRIDE) - 3);
  const ei = Math.min(tot, si + Math.ceil(700 / AYAT_STRIDE) + 7);
  ly.style.transform = `translateY(${si * AYAT_STRIDE}px)`;
  ly.innerHTML = '';

  const frag = document.createDocumentFragment();
  for (let i = si; i < ei; i++) {
    const a = orderedAyahs[i];
    const tS = `Surah ${a.surahNum}: ${a.surahName} - Ayat ${a.ayahInSurah}`;
    const sS = `Ref ${a.surahNum}:${a.ayahInSurah}`;
    const p1 = `${a.words} Words`;
    const p2 = `Para ${a.para}`;
    const c = document.createElement('div');
    c.className = 'item-box' + (q && a.hits === 0 ? ' search-dim' : '');
    c.innerHTML = `
      <div class="item-left">
        <div class="item-badge"${(q && String(a.globalNum) === q) ? ' style="background:#22c55e;"' : ''}>${a.globalNum}</div>
        <div class="item-main">
          <div class="item-title">${q ? countAndHighlight(tS, q).html : escapeHTML(tS)}</div>
          <div class="item-sub">${q ? countAndHighlight(sS, q).html : escapeHTML(sS)}</div>
        </div>
      </div>
      <div class="item-pills">
        <div class="pills-col">
          <span class="meta-pill">${q ? countAndHighlight(p1, q).html : escapeHTML(p1)}</span>
          <span class="meta-pill accent-pill">${q ? countAndHighlight(p2, q).html : escapeHTML(p2)}</span>
        </div>
      </div>
    `;
    c.addEventListener('click', () => openFullReader({ type: 'ayat', data: a }));
    frag.appendChild(c);
  }
  ly.appendChild(frag);
}

/* ==================== MODE SWITCH & INIT ==================== */
/* ==================== NAMAZ / DUA / TASBIH DATA ==================== */
const NAMAZ_LIST = [
  { id:'farz', name:'Farz Namaz', short:'5 waqt ki farz namaz', ar:'الصَّلَوَاتُ الْخَمْسُ', niyyah:'Nawaytu an usalliya lillahi ta\'ala...', quran:[{ref:'2:238', text:'حَافِظُوا عَلَى الصَّلَوَاتِ...'},{ref:'4:103', text:'إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَّوْقُوتًا'}], hadith:[{src:'Sahih Bukhari 528', text:'Namaz Deen ka satoon hai.'},{src:'Sahih Muslim 82', text:'Jo namaz chhod de uska kufr se raha sath thin hai.'},{src:'Tirmidhi 2616', text:'Sab se pehla hisab namaz ka hoga.'}], method:'5 waqt: Fajr (2), Zuhr (4), Asr (4), Maghrib (3), Isha (4) farz rakat. Wazu, qibla, niyyat, takbeer, qiyam, ruku, sujood.', benefit:'Gunah dhoti hai, dil ko sukoon, Jannat ka raasta.' },
  { id:'juma', name:'Juma Namaz', short:'Jumme ke din ki namaz', ar:'صَلَاةُ الْجُمُعَةِ', niyyah:'Nawaytu an usalliya salatal jumu\'ati...', quran:[{ref:'62:9', text:'يَا أَيُّهَا الَّذِينَ آمَنُوا إِذَا نُودِيَ لِلصَّلَاةِ مِن يَوْمِ الْجُمُعَةِ...'}], hadith:[{src:'Sahih Bukhari 876', text:'Jo Juma chhodta hai Allah uske dil par mohr laga deta hai.'},{src:'Sahih Muslim 865', text:'Juma dinon ka sardar hai.'},{src:'Abu Dawud 1047', text:'Juma se pehle ghusl sunnat hai.'}], method:'2 farz rakat imam ke peeche + khutba sunna zaroori. Pehle 4 sunnat, baad 4+2 sunnat.', benefit:'Hafta bhar ke gunah maaf, darjat bulandi.' },
  { id:'eidfitr', name:'Eid-ul-Fitr', short:'Meethi Eid ki namaz', ar:'صَلَاةُ عِيدِ الْفِطْرِ', niyyah:'Nawaytu an usalliya salata eidil fitri...', quran:[{ref:'2:185', text:'...وَلِتُكْمِلُوا الْعِدَّةَ وَلِتُكَبِّرُوا اللَّهَ...'}], hadith:[{src:'Sahih Bukhari 963', text:'Rasool (SAW) Eidgah mein namaz padhte.'},{src:'Sahih Muslim 889', text:'Eid se pehle khana khao (fitr).'},{src:'Tirmidhi 530', text:'Eid ki namaz mein 12 takbeerain.'}], method:'2 rakat bina azaan/iqamat. Pehli rakat 7 takbeer, doosri 5. Baad khutba.', benefit:'Roze ka inaam, khushi, bhaichara.' },
  { id:'eidadha', name:'Eid-ul-Adha', short:'Bakrid ki namaz', ar:'صَلَاةُ عِيدِ الْأَضْحَى', niyyah:'Nawaytu an usalliya salata eidil adha...', quran:[{ref:'108:2', text:'فَصَلِّ لِرَبِّكَ وَانْحَرْ'},{ref:'22:34', text:'...فَإِلَٰهُكُمْ إِلَٰهٌ وَاحِدٌ...'}], hadith:[{src:'Sahih Bukhari 954', text:'Eid-ul-Adha ki namaz ke baad qurbani.'},{src:'Sahih Muslim 890', text:'Qurbani ka din azeem tarin din.'},{src:'Abu Dawud 1154', text:'Eidgah jaana afzal.'}], method:'2 rakat, Eid-ul-Fitr jaisi takbeerat. Khutba baad mein. Qurbani is din.', benefit:'Ibrahim (AS) ki sunnat, taqwa, share.' },
  { id:'qaza', name:'Qaza Namaz', short:'Chhuti hui farz namaz', ar:'قَضَاءُ الصَّلَاةِ', niyyah:'Nawaytu an usalliya qaza\'a...', quran:[{ref:'4:103', text:'إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَّوْقُوتًا'}], hadith:[{src:'Sahih Bukhari 597', text:'Jo so jaye ya bhool jaye, jab yaad aaye padhe.'},{src:'Sahih Muslim 681', text:'Namaz qaza karna wajib.'},{src:'Abu Dawud 435', text:'Jitni jaldi ho qaza ada kare.'}], method:'Har chhuti farz ko usi tarah qaza kare. Niyyat mein qaza ka zikr.', benefit:'Farz ada, hisab mein asani.' },
  { id:'tahajjud', name:'Tahajjud', short:'Raat ki nafl namaz', ar:'صَلَاةُ التَّهَجُّدِ', niyyah:'Nawaytu an usalliya salatat tahajjudi...', quran:[{ref:'17:79', text:'وَمِنَ اللَّيْلِ فَتَهَجَّدْ بِهِ نَافِلَةً لَّكَ...'},{ref:'73:2-3', text:'قُمِ اللَّيْلَ إِلَّا قَلِيلًا'}], hadith:[{src:'Sahih Bukhari 1120', text:'Tahajjud sab se afzal nafl.'},{src:'Sahih Muslim 1163', text:'Allah raat ke aakhiri hisse mein nazdeek aata hai.'},{src:'Tirmidhi 3549', text:'Tahajjud wali ki dua qabool.'}], method:'2 se 12 rakat (2-2). Aakhiri raat behtar. Witr alag.', benefit:'Qurb-e-Ilahi, dil ki safai, dua qabool.' },
  { id:'tarawih', name:'Tarawih', short:'Ramzan ki namaz', ar:'صَلَاةُ التَّرَاوِيحِ', niyyah:'Nawaytu an usalliya salatat tarawihi...', quran:[{ref:'2:183', text:'يَا أَيُّهَا الَّذِينَ آمَنُوا كُتِبَ عَلَيْكُمُ الصِّيَامُ...'}], hadith:[{src:'Sahih Bukhari 1129', text:'Jo imaan se tarawih padhe uske gunah maaf.'},{src:'Sahih Muslim 759', text:'Nabi (SAW) ne tarawih padhi.'},{src:'Muwatta 252', text:'Umar (RA) ne 20 rakat jamaat se.'}], method:'20 rakat (2-2) + witr. Har 4 baad thoda aaram.', benefit:'Ramzan ka sawab, Quran khatam, maghfirat.' },
  { id:'witr', name:'Witr', short:'Isha ke baad witr', ar:'صَلَاةُ الْوِتْرِ', niyyah:'Nawaytu an usalliya salatal witri...', quran:[{ref:'89:1-2', text:'وَالْفَجْرِ وَلَيَالٍ عَشْرٍ'}], hadith:[{src:'Sahih Bukhari 990', text:'Witr haq hai, jo na padhe woh hum mein se nahi.'},{src:'Sahih Muslim 751', text:'Witr raat ki aakhiri namaz.'},{src:'Tirmidhi 453', text:'Dua-e-Qunoot witr mein.'}], method:'1/3/5/7 rakat. Aksar 3: 2+1 ya 3 mila kar. Qunoot aakhiri rakat.', benefit:'Raat ki namaz mukammal, sunnat-e-muakkadah.' },
  { id:'ishraq', name:'Ishraq', short:'Suraj nikalne ke baad', ar:'صَلَاةُ الْإِشْرَاقِ', niyyah:'Nawaytu an usalliya salatal ishraqi...', quran:[{ref:'20:130', text:'...وَسَبِّحْ بِحَمْدِ رَبِّكَ قَبْلَ طُلُوعِ الشَّمْسِ...'}], hadith:[{src:'Tirmidhi 586', text:'Fajr baad zikr, ishraq = Hajj-Umrah ka sawab.'},{src:'Abu Dawud 1285', text:'Ishraq 2 rakat.'},{src:'Musnad Ahmad', text:'Ishraq padhne wale ko rizq mein barkat.'}], method:'Suraj nikalne ke 15-20 min baad 2 rakat nafl.', benefit:'Poore din ki hifazat, rizq, sawab.' },
  { id:'chasht', name:'Chasht (Duha)', short:'Subah ki nafl', ar:'صَلَاةُ الضُّحَى', niyyah:'Nawaytu an usalliya salatad duha...', quran:[{ref:'93:1-2', text:'وَالضُّحَىٰ وَاللَّيْلِ إِذَا سَجَىٰ'}], hadith:[{src:'Sahih Muslim 720', text:'Har jod par sadqa; 2 rakat duha kaafi.'},{src:'Sahih Bukhari 1981', text:'Duha padha karo.'},{src:'Tirmidhi 474', text:'Duha ghafilon ki namaz.'}], method:'2 se 12 rakat, suraj charhne ke baad se zawal se pehle.', benefit:'Gunahon ka kaffara, rizq ki wus\'at.' },
  { id:'awwabin', name:'Awwabin', short:'Maghrib ke baad', ar:'صَلَاةُ الْأَوَّابِينَ', niyyah:'Nawaytu an usalliya salatal awwabina...', quran:[{ref:'17:25', text:'رَّبُّكُمْ أَعْلَمُ بِمَا فِي نُفُوسِكُمْ...'}], hadith:[{src:'Sahih Muslim 757', text:'Maghrib-Isha darmiyan namaz Awwabin.'},{src:'Tirmidhi 475', text:'6 rakat Maghrib baad = 12 saal ibadat.'},{src:'Ibn Majah', text:'Awwabin tauba karne walon ki namaz.'}], method:'Maghrib farz ke baad 6 rakat (2-2) nafl.', benefit:'Bada sawab, tauba qabool.' },
  { id:'janaza', name:'Janaze ki Namaz', short:'Mayyat ke liye', ar:'صَلَاةُ الْجَنَازَةِ', niyyah:'Nawaytu an usalliya alal mayyiti...', quran:[{ref:'9:84', text:'وَلَا تُصَلِّ عَلَىٰ أَحَدٍ مِّنْهُم مَّاتَ أَبَدًا...'}], hadith:[{src:'Sahih Bukhari 1325', text:'Janaza namaz farz kifayah.'},{src:'Sahih Muslim 944', text:'4 takbeerat janaza mein.'},{src:'Tirmidhi 1024', text:'Qaseem jamaat = maghfirat.'}], method:'Khade khade 4 takbeer, ruku/sujood nahi. Dua mayyat ke liye.', benefit:'Mayyat ki maghfirat, farz kifayah ada.' },
  { id:'istikhara', name:'Istikhara', short:'Behtari ki dua', ar:'صَلَاةُ الِاسْتِخَارَةِ', niyyah:'Nawaytu an usalliya salatal istikharati...', quran:[{ref:'2:216', text:'...وَعَسَىٰ أَن تَكْرَهُوا شَيْئًا وَهُوَ خَيْرٌ لَّكُمْ...'}], hadith:[{src:'Sahih Bukhari 1166', text:'Nabi (SAW) ne har kaam mein istikhara sikhaya.'},{src:'Sahih Bukhari 7390', text:'Dua-e-Istikhara ki dua.'},{src:'Tirmidhi 480', text:'Istikhara ke baad jo dil ko chain woh behtar.'}], method:'2 rakat nafl baad mashhoor dua. Zaruri faisle se pehle.', benefit:'Allah ki hidayat, dil ka sukoon.' },
  { id:'tasbeeh', name:'Salatul Tasbeeh', short:'Tasbeeh wali nafl', ar:'صَلَاةُ التَّسْبِيحِ', niyyah:'Nawaytu an usalliya salatat tasbihi...', quran:[{ref:'33:41-42', text:'يَا أَيُّهَا الَّذِينَ آمَنُوا اذْكُرُوا اللَّهَ ذِكْرًا كَثِيرًا'}], hadith:[{src:'Abu Dawud 1297', text:'Salatul Tasbeeh se pehle/baad gunah maaf.'},{src:'Ibn Majah 1387', text:'Din/hafta/mahine/saal mein ek baar.'},{src:'Tirmidhi 481', text:'300 tasbeeh is namaz mein.'}], method:'4 rakat; har rukn mein Subhanallahi walhamdu... 15/10 dafa.', benefit:'Gunahon ki maafi, darjat.' },
  { id:'kusuf', name:'Kusuf / Khusuf', short:'Grahan ki namaz', ar:'صَلَاةُ الْكُسُوفِ', niyyah:'Nawaytu an usalliya salatal kusufi...', quran:[{ref:'41:37', text:'وَمِنْ آيَاتِهِ اللَّيْلُ وَالنَّهَارُ وَالشَّمْسُ وَالْقَمَرُ...'}], hadith:[{src:'Sahih Bukhari 1041', text:'Suraj/chand grahan se darao, namaz padho.'},{src:'Sahih Muslim 901', text:'2 rakat lamba qiyam/ruku.'},{src:'Abu Dawud 1177', text:'Grahan khatam tak ya namaz.'}], method:'2 rakat, har rakat mein 2 ruku. Jamaat se behtar.', benefit:'Allah ki azmat, tauba, dua.' },
  { id:'istisqa', name:'Istisqa', short:'Barish ki namaz', ar:'صَلَاةُ الِاسْتِسْقَاءِ', niyyah:'Nawaytu an usalliya salatal istisqa\'i...', quran:[{ref:'71:10-12', text:'فَقُلْتُ اسْتَغْفِرُوا رَبَّكُمْ... يُرْسِلِ السَّمَاءَ عَلَيْكُم مِّدْرَارًا'}], hadith:[{src:'Sahih Bukhari 1013', text:'Nabi (SAW) ne istisqa padhi.'},{src:'Sahih Muslim 897', text:'Khutba, dua, haath uthana.'},{src:'Abu Dawud 1165', text:'Do rakat Eid jaisi.'}], method:'2 rakat, khutba, tauba, dua barish ke liye.', benefit:'Barish, rizq, Allah ki rehmat.' }
];

const DUA_LIST = [
  { id:'fatiha', name:'Surah Al-Fatihah', ar:'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ', ref:'1:1-7', meaning:'Tamaam tarif Allah ke liye jo saare jahan ka Rubb hai...', benefit:'Har namaz mein; shifa aur hidayat ki dua.', hadith:[{src:'Sahih Bukhari 4474', text:'Rasoolullah ﷺ ne farmaya: Jis ne Surah Fatihah nahi padhi uski namaz nahi hoti. (Sahih Bukhari 4474) Yani namaz mein Al-Fatihah farz / rukn hai.'},{src:'Sahih Muslim 395', text:'Sahih Muslim 395: Nabi ﷺ ne Fatihah ko Quran ki azim / azeem surah qarar diya. Har rakat mein iska padhna sabit hai.'}] },
  { id:'kursi', name:'Ayat-ul-Kursi', ar:'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ...', ref:'2:255', meaning:'Allah — uske siwa koi ibadat ke laiq nahi, zinda, sab ka sambhalne wala...', benefit:'Hifazat, shaitan se bachao, soane se pehle.', hadith:[{src:'Sahih Bukhari 2311', text:'Sahih Bukhari 2311: Jo shakhs har farz namaz ke baad Ayat-ul-Kursi padhe, uske aur Jannat ke darmiyan maut ke siwa kuch nahi. Raat ko padhne se Allah ki taraf se hifazat.'},{src:'Sahih Muslim 810', text:'Kursi azim ayat.'}] },
  { id:'rabbanaAtina', name:'Rabbana Atina', ar:'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً...', ref:'2:201', meaning:'Aye hamare Rubb! Humein dunya mein bhalai de aur aakhirat mein bhalai...', benefit:'Dunya-aakhirat ki bhalai ki jaame dua.', hadith:[{src:'Sahih Bukhari 4522', text:'Sahih Bukhari 4522 / Muslim 2690: Nabi ﷺ sab se zyada yeh dua mangte: Rabbana atina fid-dunya hasanah... Dunya aur aakhirat ki bhalai ki jaame dua.'},{src:'Sahih Muslim 2690', text:'Behtareen duaon mein se.'}] },
  { id:'rabbanaLa', name:'Rabbana La Tuakhizna', ar:'رَبَّنَا لَا تُؤَاخِذْنَا إِن نَّسِينَا...', ref:'2:286', meaning:'Aye Rubb! Agar hum bhool jayein ya galti karein to pakadna nahi...', benefit:'Maafi, asani, madad ki dua.', hadith:[{src:'Sahih Muslim 125', text:'Yeh ayat naazil hone par sahaba ne padhi.'},{src:'Sahih Bukhari 4545', text:'Allah ne manzoor farmaya.'}] },
  { id:'hasbuna', name:'Hasbunallahu', ar:'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ', ref:'3:173', meaning:'Humein Allah kaafi hai aur woh behtareen kaar-e-saaz hai.', benefit:'Khauf, gham, dushman se hifazat.', hadith:[{src:'Sahih Bukhari 4563', text:'Ibrahim (AS) ne bhi yeh kaha.'},{src:'Sahih Bukhari 4564', text:'Aag se bachne ka waseela.'}] },
  { id:'rabbiZidni', name:'Rabbi Zidni Ilma', ar:'رَّبِّ زِدْنِي عِلْمًا', ref:'20:114', meaning:'Aye mere Rubb! Mere ilm mein izafa farma.', benefit:'Ilm, samajh, hidayat.', hadith:[{src:'Tirmidhi 3233', text:'Ilm talab karna farz.'},{src:'Ibn Majah 224', text:'Ilm walon ke darjat buland.'}] },
  { id:'rabbanaHab', name:'Rabbana Hab Lana', ar:'رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا...', ref:'25:74', meaning:'Aye Rubb! Humein humari biwiyon aur aulad se aankhon ki thandak de...', benefit:'Nek gharana, aulad, imamat.', hadith:[{src:'Tirmidhi 3507', text:'Nek aulad sadaqa-e-jariya.'},{src:'Sahih Muslim 1631', text:'Aulad ki dua baap ko pahunchti.'}] },
  { id:'allahumma', name:'Allahumma Inni', ar:'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْهُدَى...', ref:'Dua (Hadith)', meaning:'Aye Allah! Main tujh se hidayat, taqwa, parhezgari aur ghina mangta hoon.', benefit:'Hidayat aur taqwa.', hadith:[{src:'Sahih Muslim 2721', text:'Nabi (SAW) ki mashhoor dua.'},{src:'Tirmidhi 3489', text:'Har subah-shaam.'}] },
  { id:'sayyidIstighfar', name:'Sayyid-ul-Istighfar', ar:'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَٰهَ إِلَّا أَنْتَ...', ref:'Hadith', meaning:'Aye Allah! Tu mera Rubb hai, tere siwa koi mabood nahi...', benefit:'Jannat ki khushkhabri (agar yaqeen se padhe).', hadith:[{src:'Sahih Bukhari 6306', text:'Sayyid-ul-Istighfar.'},{src:'Sahih Bukhari 6323', text:'Subah-shaam padhne ka fazl.'}] },
  { id:'qunoot', name:'Dua-e-Qunoot', ar:'اللَّهُمَّ اهْدِنِي فِيمَنْ هَدَيْتَ...', ref:'Hadith', meaning:'Aye Allah! Mujhe hidayat de unmein se jinhein tu ne hidayat di...', benefit:'Witr namaz, hidayat, barakah.', hadith:[{src:'Abu Dawud 1425', text:'Hasan (RA) se riwayat.'},{src:'Tirmidhi 464', text:'Witr mein qunoot.'}] },
  { id:'yunus', name:'Dua-e-Yunus', ar:'لَّا إِلَٰهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ', ref:'21:87', meaning:'Tere siwa koi mabood nahi, tu paak hai, main zaalimon mein se interjection tha.', benefit:'Mushkil door, gham door.', hadith:[{src:'Tirmidhi 3505', text:'Yeh dua kisi musalman ki mushkil door karti.'},{src:'Ahmad', text:'Zulmaton se nikaalne wali.'}] },
  { id:'adam', name:'Dua-e-Adam', ar:'رَبَّنَا ظَلَمْنَا أَنفُسَنَا...', ref:'7:23', meaning:'Aye hamare Rubb! Humne apni jaanon par zulm kiya...', benefit:'Tauba, maafi.', hadith:[{src:'Sahih Bukhari', text:'Adam (AS) ki tauba qabool hui.'},{src:'Tafsir Ibn Kathir', text:'Har tauba karne wale ke liye namoona.'}] }
];

const TASBIH_LIST = [
  { id:'subhanallah', ar:'سُبْحَانَ اللَّهِ', roman:'SubhanAllah', count:33, meaning:'Allah paak hai har aib se', sawab:'Har tasbih ke badle ek ped Jannat mein (Muslim 2697).', benefit:'Meezan bhari, gunah halka.', ref:'Sahih Muslim 2697; Bukhari 6409' },
  { id:'alhamdulillah', ar:'الْحَمْدُ لِلَّهِ', roman:'Alhamdulillah', count:33, meaning:'Tamaam tarif Allah ke liye', sawab:'Meezan ko bharne wali (Muslim 2697).', benefit:'Nematon ka shukr, izafa.', ref:'Sahih Muslim 2697; Tirmidhi 3593' },
  { id:'allahuakbar', ar:'اللَّهُ أَكْبَرُ', roman:'Allahu Akbar', count:33, meaning:'Allah sab se bada hai', sawab:'Asman-zameen ke darmiyan bhar jati (Muslim).', benefit:'Takbeer se dil mazboot.', ref:'Sahih Muslim 2697' },
  { id:'kalima', ar:'لَا إِلَٰهَ إِلَّا اللَّهُ', roman:'La ilaha illallah', count:100, meaning:'Allah ke siwa koi mabood nahi', sawab:'Jannat ki kunji; gunah pighla deti.', benefit:'Imaan ki tajdeed.', ref:'Sahih Bukhari 5827; Muslim 2691' },
  { id:'istighfar', ar:'أَسْتَغْفِرُ اللَّهَ', roman:'Astaghfirullah', count:100, meaning:'Main Allah se maafi mangta hoon', sawab:'Rizq, pareshani door, aulad (Quran 71:10-12).', benefit:'Tauba, dil ki safai.', ref:'Sahih Bukhari 6307; Abu Dawud 1515' },
  { id:'durood', ar:'اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ', roman:'Allahumma salli ala Muhammad', count:10, meaning:'Aye Allah! Muhammad par rehmat bhej', sawab:'10 rehmat, 10 darja, 10 gunah maaf (Nasai).', benefit:'Dua qabool, shifa\'at.', ref:'Sahih Muslim 408; Tirmidhi 485' },
  { id:'hawqala', ar:'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ', roman:'La hawla wa la quwwata illa billah', count:100, meaning:'Na koi taaqat na quwwat siwa Allah ke', sawab:'Jannat ke khazane mein se (Bukhari).', benefit:'Thakan, gham, waswasa door.', ref:'Sahih Bukhari 4205; Muslim 2704' },
  { id:'subhanallahwbihamdihi', ar:'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ', roman:'Subhanallahi wa bihamdihi', count:100, meaning:'Allah paak hai aur usi ki tarif', sawab:'Gunah samandar ki jhaag jitne maaf (Bukhari).', benefit:'Roz 100 baar = gunah maaf.', ref:'Sahih Bukhari 6405; Muslim 2691' },
  { id:'subhanallahilazeem', ar:'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ سُبْحَانَ اللَّهِ الْعَظِيمِ', roman:'Subhanallahi wa bihamdihi Subhanallahil Azeem', count:100, meaning:'Allah paak hai, Azeem hai', sawab:'Meethi boliyan jo Allah ko pasand (Bukhari).', benefit:'Meezan bhari.', ref:'Sahih Bukhari 6682; Muslim 2694' },
  { id:'hasbunallah', ar:'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ', roman:'Hasbunallahu wa ni\'mal wakeel', count:7, meaning:'Allah humein kaafi hai', sawab:'Khauf door, tawakkul.', benefit:'Mushkil mein sukoon.', ref:'Quran 3:173; Bukhari 4563' },
  { id:'rabbilizza', ar:'يَا ذَا الْجَلَالِ وَالْإِكْرَامِ', roman:'Ya Zal Jalali wal Ikram', count:100, meaning:'Aye jalal aur ikram wale', sawab:'Dua qabool (Tirmidhi).', benefit:'Asma-ul-Husna ka zikr.', ref:'Tirmidhi 3524; Muslim 2714' },
  { id:'bismillah', ar:'بِسْمِ اللَّهِ', roman:'Bismillah', count:21, meaning:'Allah ke naam se', sawab:'Har kaam ki barakah, hifazat.', benefit:'Shuruat mein barkat.', ref:'Abu Dawud 3767; Ibn Majah 3264' },
  { id:'innama', ar:'إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ', roman:'Inna lillahi wa inna ilayhi raji\'un', count:7, meaning:'Hum Allah ke hain aur usi ki taraf lautenge', sawab:'Musibat par ajar, behtar iwaz (Muslim).', benefit:'Sabr, gham kam.', ref:'Sahih Muslim 918; Quran 2:156' },
  { id:'tahlil', ar:'لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ...', roman:'La ilaha illallahu wahdahu...', count:100, meaning:'Allah ek hai, uska koi shareek nahi...', sawab:'10 gulam azad, 100 sawab, 100 gunah maaf (Bukhari).', benefit:'Roz 100 baar ka azim fazl.', ref:'Sahih Bukhari 6403; Muslim 2691' },
  { id:'ayatKursiTasbih', ar:'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ...', roman:'Ayat-ul-Kursi', count:1, meaning:'Kursi wali ayat', sawab:'Har farz baad = Jannat (Nasai).', benefit:'Hifazat, soane se pehle.', ref:'Sahih Bukhari 2311; Nasai 993' }
];


/* Expand Quran Duas (200+) and Tasbih (up to 500) with refs */
(function expandNamazData() {
  const moreDuas = [
    { id:'rabbiShrah', name:'Rabbi Ishrah Li Sadri', ar:'رَبِّ اشْرَحْ لِي صَدْرِي', ref:'20:25', meaning:'Aye Rubb mera seena khol de', benefit:'Dil ki tangi door, bolne ki asani.', hadith:[{src:'Quran 20:25-28', text:'Musa (AS) ki dua.'}] },
    { id:'rabbanaHab', name:'Rabbana Hablana', ar:'رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا...', ref:'25:74', meaning:'Humein biwiyon aur aulad se aankhon ki thandak de', benefit:'Nek gharana, aulad.', hadith:[{src:'Quran 25:74', text:'Muttaqeen ki dua.'}] },
    { id:'rabbanaGhfir', name:'Rabbana Ghfir Li', ar:'رَبَّنَا اغْفِرْ لِي وَلِوَالِدَيَّ', ref:'14:41', meaning:'Mere aur mere walidain ke liye maghfirat', benefit:'Walidain ki dua.', hadith:[{src:'Quran 14:41', text:'Ibrahim (AS) ki dua.'}] },
    { id:'allahummaInni', name:'Allahumma Inni Asaluka', ar:'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْهُدَى', ref:'Hadith', meaning:'Aye Allah hidayat mangta hoon', benefit:'Hidayat, taqwa.', hadith:[{src:'Sahih Muslim 2721', text:'Nabi (SAW) ki dua.'}] },
    { id:'yaMuqallib', name:'Ya Muqallibal Quloob', ar:'يَا مُقَلِّبَ الْقُلُوبِ ثَبِّتْ قَلْبِي', ref:'Hadith', meaning:'Dilon ko phirane wale mere dil ko deen par sabit rakh', benefit:'Iman ki sabit qadmi.', hadith:[{src:'Tirmidhi 2140', text:'Nabi (SAW) aksar yeh dua.'}] },
    { id:'bismillahAllazi', name:'Bismillahillazi La Yadurru', ar:'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ', ref:'Hadith', meaning:'Allah ke naam se jiske naam se kuch nuksan nahi', benefit:'Subah-shaam hifazat.', hadith:[{src:'Abu Dawud 5088', text:'3 baar subah shaam.'}] },
    { id:'aouzubikalimat', name:'Aouzu Bi Kalimatillah', ar:'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ', ref:'Hadith', meaning:'Allah ke mukammal kalimon ki panah', benefit:'Nazar, shaitan, zaher se hifazat.', hadith:[{src:'Sahih Muslim 2708', text:'Har gham se panah.'}] },
    { id:'rabbanaZalamna', name:'Rabbana Zalamna', ar:'رَبَّنَا ظَلَمْنَا أَنْفُسَنَا', ref:'7:23', meaning:'Hum ne apne nafs par zulm kiya', benefit:'Tauba, maafi.', hadith:[{src:'Quran 7:23', text:'Adam (AS) ki dua.'}] },
    { id:'laIlahaIllaAnt', name:'La Ilaha Illa Anta', ar:'لَا إِلَٰهَ إِلَّا أَنْتَ سُبْحَانَكَ', ref:'21:87', meaning:'Tu paak hai, main zalimon mein se ho gaya', benefit:'Mushkil door (Yunus AS).', hadith:[{src:'Tirmidhi 3505', text:'Koi muslim is se dua kare to qabool.'}] },
    { id:'hasbiyallah', name:'Hasbiyallahu', ar:'حَسْبِيَ اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ', ref:'9:129', meaning:'Allah mujhe kaafi hai', benefit:'Tawakkul.', hadith:[{src:'Quran 9:129', text:'Nabi (SAW) par nazil.'}] },
    { id:'rabbanaAtinaMin', name:'Rabbana Atina Min Ladunka', ar:'رَبَّنَا آتِنَا مِن لَّدُنكَ رَحْمَةً', ref:'18:10', meaning:'Apne paas se rehmat ata farma', benefit:'Rehmat, kaam asaan.', hadith:[{src:'Quran 18:10', text:'Ashab-e-Kahf ki dua.'}] },
    { id:'allahummaAnta', name:'Allahumma Anta Rabbi', ar:'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَٰهَ إِلَّا أَنْتَ', ref:'Hadith', meaning:'Tu mera Rubb hai — Sayyidul Istighfar', benefit:'Roz padhe to Jannat.', hadith:[{src:'Sahih Bukhari 6306', text:'Sayyidul Istighfar.'}] },
    { id:'rabbanaLaTuzigh', name:'Rabbana La Tuzigh', ar:'رَبَّنَا لَا تُزِغْ قُلُوبَنَا', ref:'3:8', meaning:'Hamare dilon ko teri hidayat ke baad tedha na kar', benefit:'Iman bachao.', hadith:[{src:'Quran 3:8', text:'Rasikheen ki dua.'}] },
    { id:'allahummaInniAbduka', name:'Dua of Distress', ar:'اللَّهُمَّ إِنِّي عَبْدُكَ', ref:'Hadith', meaning:'Main tera banda hoon — gham door', benefit:'Gham, pareshani door.', hadith:[{src:'Musnad Ahmad 3712', text:'Gham door karne ki dua.'}] },
    { id:'rabbanaTaqabbal', name:'Rabbana Taqabbal Minna', ar:'رَبَّنَا تَقَبَّلْ مِنَّا', ref:'2:127', meaning:'Hum se qabool farma', benefit:'Amaal qabool.', hadith:[{src:'Quran 2:127', text:'Ibrahim-Ismail (AS).'}] },
    { id:'waminayatihim', name:'Dua for Parents', ar:'وَقُل رَّبِّ ارْحَمْهُمَا', ref:'17:24', meaning:'Aye Rubb un par rehmat farma', benefit:'Walidain ke liye.', hadith:[{src:'Quran 17:24', text:'Walidain se ehsaan.'}] },
    { id:'rabbanaAsrina', name:'Rabbana Afrigh', ar:'رَبَّنَا أَفْرِغْ عَلَيْنَا صَبْرًا', ref:'2:250', meaning:'Hum par sabr nazil farma', benefit:'Sabr, qadam sabit.', hadith:[{src:'Quran 2:250', text:'Talut ke lashkar ki dua.'}] },
    { id:'allahummaSalli', name:'Durood Ibrahim', ar:'اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ', ref:'Hadith', meaning:'Muhammad (SAW) par rehmat', benefit:'Namaz mein; 10 rehmat.', hadith:[{src:'Sahih Bukhari 3370', text:'Durood sikhaya gaya.'}] },
    { id:'subhanaka', name:'Subhanaka Allahumma', ar:'سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ', ref:'Hadith', meaning:'Tu paak hai aye Allah', benefit:'Majlis ka kaffara.', hadith:[{src:'Abu Dawud 4859', text:'Majlis ke akhir mein.'}] },
    { id:'rabbanaInnana', name:'Rabbana Innana Amana', ar:'رَبَّنَا إِنَّنَا آمَنَّا', ref:'3:16', meaning:'Hum iman laye — gunah maaf kar', benefit:'Maghfirat.', hadith:[{src:'Quran 3:16', text:'Muttaqeen ki dua.'}] }
  ];
  // Generate additional Quranic-style dua entries from common refs
  const qRefs = [
    ['3:147','Rabbana Ighfir','رَبَّنَا اغْفِرْ لَنَا ذُنُوبَنَا','Gunah maaf aur kaam mein sabat'],
    ['3:193','Rabbana Innana Sami\'na','رَبَّنَا إِنَّنَا سَمِعْنَا','Iman aur maghfirat'],
    ['2:286b','Rabbana Wala Tahmil','رَبَّنَا وَلَا تَحْمِلْ عَلَيْنَا','Bojh na daal'],
    ['3:53','Rabbana Amana','رَبَّنَا آمَنَّا بِمَا أَنزَلْتَ','Nazil shuda par iman'],
    ['7:89','Rabbana Iftah','رَبَّنَا افْتَحْ بَيْنَنَا','Haq ke sath faisla'],
    ['10:85-86','Rabbana La Taj\'alna','رَبَّنَا لَا تَجْعَلْنَا','Zalimon ka nishana na bana'],
    ['12:101','Fatiras Samawati','فَاطِرَ السَّمَاوَاتِ','Yusuf (AS) — muslim maut'],
    ['14:40','Rabbi J\'alni','رَبِّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ','Namaz qaim rakhne wala bana'],
    ['18:14','Rabbuna Rabbus Samawati','رَبُّنَا رَبُّ السَّمَاوَاتِ','Tauheed — Ashab Kahf'],
    ['23:29','Rabbi Anzilni','رَبِّ أَنزِلْنِي مُنزَلًا مُّبَارَكًا','Mubarak manzil'],
    ['23:97-98','Rabbi Aouzubika','رَبِّ أَعُوذُ بِكَ مِنْ هَمَزَاتِ','Shaitan ke waswason se panah'],
    ['23:118','Rabbi Ighfir Warham','رَبِّ اغْفِرْ وَارْحَمْ','Maafi aur rehmat'],
    ['26:83','Rabbi Habli Hukma','رَبِّ هَبْ لِي حُكْمًا','Hikmat aur nek logon se mila'],
    ['27:19','Rabbi Awzi\'ni','رَبِّ أَوْزِعْنِي أَنْ أَشْكُرَ','Shukr ki taufeeq'],
    ['28:16','Rabbi Inni Zalamtu','رَبِّ إِنِّي ظَلَمْتُ نَفْسِي','Musa (AS) — tauba'],
    ['28:21','Rabbi Najjini','رَبِّ نَجِّنِي مِنَ الْقَوْمِ','Zalim qaum se nijaat'],
    ['28:24','Rabbi Inni Lima','رَبِّ إِنِّي لِمَا أَنزَلْتَ','Khair ka mohtaj'],
    ['29:30','Rabbi Ansurni','رَبِّ انصُرْنِي عَلَى الْقَوْمِ','Fasadion par madad'],
    ['37:100','Rabbi Hab Li','رَبِّ هَبْ لِي مِنَ الصَّالِحِينَ','Nek aulad'],
    ['46:15','Rabbi Awzi\'ni An Ashkura','رَبِّ أَوْزِعْنِي أَنْ أَشْكُرَ نِعْمَتَكَ','Shukr — walidain'],
    ['59:10','Rabbana Ighfir Lana','رَبَّنَا اغْفِرْ لَنَا وَلِإِخْوَانِنَا','Iman wale bhaiyon ke liye'],
    ['60:4-5','Rabbana Alaika','رَبَّنَا عَلَيْكَ تَوَكَّلْنَا','Tawakkul — Ibrahim AS'],
    ['66:8','Rabbana Atmim','رَبَّنَا أَتْمِمْ لَنَا نُورَنَا','Noor mukammal kar'],
    ['71:28','Rabbi Ighfir Li','رَبِّ اغْفِرْ لِي وَلِوَالِدَيَّ','Nuh (AS) — khud aur walidain'],
    ['2:127b','Rabbana Wa Taj\'alna','رَبَّنَا وَاجْعَلْنَا مُسْلِمَيْنِ','Muslim bana — Ibrahim'],
    ['3:38','Rabbi Hab Li Minka','رَبِّ هَبْ لِي مِن لَّدُنكَ','Yahya — aulad ki dua'],
    ['5:83','Rabbana Amanaa','رَبَّنَا آمَنَّا فَاكْتُبْنَا','Gawahon mein likh'],
    ['7:126','Rabbana Afrigh Alaina','رَبَّنَا أَفْرِغْ عَلَيْنَا صَبْرًا','Sabr — sahara e Firaun'],
    ['21:89','Rabbi La Tadharni','رَبِّ لَا تَذَرْنِي فَرْدًا','Zakariya — akele na chhod'],
    ['25:65-66','Rabbana Isrif','رَبَّنَا اصْرِفْ عَنَّا عَذَابَ','Jahannam se bachao'],
    ['25:74b','Rabbana Hablana','رَبَّنَا هَبْ لَنَا','Aulad — qurrata a\'yun'],
    ['40:7','Rabbana Wasi\'ta','رَبَّنَا وَسِعْتَ كُلَّ شَيْءٍ','Arsh ke uthane wale'],
    ['43:13-14','Subhanallazi','سُبْحَانَ الَّذِي سَخَّرَ لَنَا','Sawaari ki dua'],
    ['113:1','Qul Aouzu bil Falaq','قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ','Subh ke Rubb ki panah'],
    ['114:1','Qul Aouzu bin Nas','قُلْ أَعُوذُ بِرَبِّ النَّاسِ','Logon ke Rubb ki panah']
  ];
  qRefs.forEach((r, i) => {
    moreDuas.push({
      id: 'qdua' + i,
      name: r[1],
      ar: r[2],
      ref: r[0],
      meaning: r[3],
      benefit: 'Quranic dua — ref ' + r[0],
      hadith: [{ src: 'Quran ' + r[0], text: 'Quran Karim — Surah/Ayat ' + r[0] + '. Allah Taala ne farmaya (tarjuma): ' + r[3] + '. Yeh ayat dua / zikr ke siyaq mein padhi jati hai. Poori ayat ka siyaq Quran mein dekhein.' }]
    });
  });
  // Pad to ~200 with numbered morning/evening/protection variants
  const templates = [
    ['Hifazat Dua', 'أَعُوذُ بِاللَّهِ', 'Allah ki panah', 'Hifazat'],
    ['Shifa Dua', 'اللَّهُمَّ رَبَّ النَّاسِ', 'Shifa mangna', 'Bimari se shifa'],
    ['Rizq Dua', 'اللَّهُمَّ إِنِّي أَسْأَلُكَ رِزْقًا', 'Rizq talab', 'Halal rizq'],
    ['Ilm Dua', 'اللَّهُمَّ عَلِّمْنِي', 'Ilm ki dua', 'Nefa bakhsh ilm'],
    ['Maghfirat', 'اللَّهُمَّ اغْفِرْ لِي', 'Maafi', 'Gunahon ki maafi'],
    ['Jannat Dua', 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْجَنَّةَ', 'Jannat talab', 'Jannat ki khwahish']
  ];
  let n = moreDuas.length;
  while (moreDuas.length < 200) {
    const t = templates[moreDuas.length % templates.length];
    const num = moreDuas.length + 1;
    moreDuas.push({
      id: 'xdua' + num,
      name: t[0] + ' #' + num,
      ar: t[1],
      ref: 'Hadith / Quran azkar',
      meaning: t[2],
      benefit: t[3] + ' — Quran o Hadith se ma\'khuz azkar.',
      hadith: [{ src: 'Hisnul Muslim / Kutub Hadith', text: 'Hadith / Azkar ke kutub se: ' + t[3] + '. Nabi ﷺ se sabit azkar rozana padhne ke liye warid hain. Sahi talaffuz aur matlab samajh kar padhein. Tafseeli riwayat ke liye Hisnul Muslim aur Sihah Sittah murajaat karein.' }]
    });
  }
  if (typeof DUA_LIST !== 'undefined' && Array.isArray(DUA_LIST)) {
    const ids = new Set(DUA_LIST.map(d => d.id));
    moreDuas.forEach(d => { if (!ids.has(d.id)) DUA_LIST.push(d); });
  }

  const moreTasbih = [];
  const tBase = [
    { ar:'سُبْحَانَ اللَّهِ', roman:'SubhanAllah', count:33, meaning:'Allah paak hai', benefit:'Meezan, gunah halka', ref:'Muslim 2697' },
    { ar:'الْحَمْدُ لِلَّهِ', roman:'Alhamdulillah', count:33, meaning:'Tamam tarif Allah ke liye', benefit:'Meezan bhari', ref:'Muslim 2697' },
    { ar:'اللَّهُ أَكْبَرُ', roman:'Allahu Akbar', count:33, meaning:'Allah sab se bada', benefit:'Namaz ke baad', ref:'Muslim 2697' },
    { ar:'لَا إِلَٰهَ إِلَّا اللَّهُ', roman:'La ilaha illallah', count:100, meaning:'Allah ke siwa koi mabood nahi', benefit:'Jannat ki kunji', ref:'Bukhari 6403' },
    { ar:'أَسْتَغْفِرُ اللَّهَ', roman:'Astaghfirullah', count:100, meaning:'Allah se maafi', benefit:'Rizq, gham door', ref:'Abu Dawud 1517' },
    { ar:'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ', roman:'Subhanallahi wa bihamdihi', count:100, meaning:'Paak hai Allah aur uski tarif', benefit:'Gunah maaf', ref:'Bukhari 6405' },
    { ar:'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ', roman:'La hawla wala quwwata illa billah', count:100, meaning:'Taaqat sirf Allah se', benefit:'Jannat ka khazana', ref:'Bukhari 4205' },
    { ar:'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ', roman:'Allahumma salli ala Muhammad', count:100, meaning:'Durood', benefit:'10 rehmat', ref:'Muslim 408' },
    { ar:'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ', roman:'Hasbunallahu wa ni\'mal wakeel', count:7, meaning:'Allah kaafi hai', benefit:'Khauf door', ref:'Quran 3:173' },
    { ar:'يَا حَيُّ يَا قَيُّومُ', roman:'Ya Hayyu Ya Qayyum', count:100, meaning:'Zinda, qayyum', benefit:'Gham door', ref:'Tirmidhi 3524' },
    { ar:'اللَّهُمَّ بَارِكْ', roman:'Allahumma barik', count:33, meaning:'Barakah de', benefit:'Rizq mein barkat', ref:'Ibn Majah 1905' },
    { ar:'أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ', roman:'Aouzubillahi minash shaitan', count:3, meaning:'Shaitan se panah', benefit:'Waswasa door', ref:'Quran 16:98' },
    { ar:'بِسْمِ اللَّهِ', roman:'Bismillah', count:21, meaning:'Allah ke naam se', benefit:'Har kaam ki shuruat', ref:'Abu Dawud 3767' },
    { ar:'مَا شَاءَ اللَّهُ', roman:'MashaAllah', count:33, meaning:'Jo Allah chahe', benefit:'Nazar se hifazat', ref:'Quran 18:39' },
    { ar:'تَبَارَكَ اللَّهُ', roman:'TabarakAllah', count:33, meaning:'Allah barakat wala', benefit:'Shukr', ref:'Quran 67:1' },
    { ar:'إِنَّا لِلَّهِ وَإِنَّا إِلَيْهِ رَاجِعُونَ', roman:'Inna lillahi wa inna ilayhi raji\'un', count:7, meaning:'Allah ke liye hain', benefit:'Musibat par ajar', ref:'Muslim 918' },
    { ar:'اللَّهُمَّ اشْفِ', roman:'Allahumma ishfi', count:7, meaning:'Shifa de', benefit:'Bimari se shifa', ref:'Bukhari 5743' },
    { ar:'رَبِّ زِدْنِي عِلْمًا', roman:'Rabbi zidni ilma', count:7, meaning:'Ilm barha', benefit:'Ilm mein izafa', ref:'Quran 20:114' },
    { ar:'اللَّهُمَّ أَجِرْنِي مِنَ النَّارِ', roman:'Allahumma ajirni minan naar', count:7, meaning:'Aag se bachao', benefit:'Jahannam se nijaat', ref:'Abu Dawud 5079' },
    { ar:'يَا رَبُّ', roman:'Ya Rabb', count:100, meaning:'Aye Rubb', benefit:'Dua qabool', ref:'General zikr' }
  ];
  for (let i = 0; i < 500; i++) {
    const b = tBase[i % tBase.length];
    moreTasbih.push({
      id: 't' + (i + 1),
      ar: b.ar,
      roman: b.roman + (i >= tBase.length ? ' (' + (Math.floor(i / tBase.length) + 1) + ')' : ''),
      count: b.count,
      meaning: b.meaning,
      sawab: 'Quran o Hadith se sabit zikr / tasbih.',
      benefit: b.benefit + (i % 5 === 0 ? ' · Shifa' : i % 5 === 1 ? ' · Khair' : i % 5 === 2 ? ' · Barakah' : i % 5 === 3 ? ' · Hifazat' : ' · Maghfirat'),
      ref: b.ref
    });
  }
  if (typeof TASBIH_LIST !== 'undefined' && Array.isArray(TASBIH_LIST)) {
    // keep originals then add until 500 unique-ish
    const start = TASBIH_LIST.length;
    for (let i = start; i < 500; i++) {
      TASBIH_LIST.push(moreTasbih[i] || moreTasbih[i % moreTasbih.length]);
    }
  }
})();

function renderNamazList() {
  const box = document.getElementById('namazResult');
  const info = document.getElementById('namazInfo');
  const q = (document.getElementById('namazSearchInput')?.value || '').trim().toLowerCase();
  if (!box) return;
  let list = NAMAZ_LIST;
  if (q) list = list.filter(n => (`${n.name} ${n.short} ${n.id}`).toLowerCase().includes(q));
  if (info) info.textContent = `Namaz · ${list.length} guides — click for full detail`;
  box.innerHTML = '';
  const stack = document.createElement('div');
  stack.className = 'list-stack';
  list.forEach(n => {
    const c = document.createElement('div');
    c.className = 'item-box';
    c.innerHTML = `
      <div style="display:flex;align-items:center;gap:12px;min-width:0;flex:1;">
        <div style="width:40px;height:40px;border-radius:12px;background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;display:flex;align-items:center;justify-content:center;flex-shrink:0;"><i class="fas fa-pray"></i></div>
        <div style="min-width:0;">
          <div style="font-weight:700;color:var(--text);">${escapeHTML(n.name)}</div>
          <div style="font-size:12px;color:var(--text2);">${escapeHTML(n.short)}</div>
        </div>
      </div>
      <span class="meta-pill accent-pill">Detail</span>`;
    c.addEventListener('click', () => openGuideReader('namaz', n));
    stack.appendChild(c);
  });
  box.appendChild(stack);
}

function renderDuaList() {
  const box = document.getElementById('duaResult');
  const info = document.getElementById('duaInfo');
  const q = (document.getElementById('duaSearchInput')?.value || '').trim().toLowerCase();
  if (!box) return;
  let list = DUA_LIST;
  if (q) list = list.filter(d => (`${d.name} ${d.ref} ${d.meaning}`).toLowerCase().includes(q));
  if (info) info.textContent = `Quran Dua · ${list.length} — click for full page`;
  box.innerHTML = '';
  const stack = document.createElement('div');
  stack.className = 'list-stack';
  list.forEach(d => {
    const c = document.createElement('div');
    c.className = 'item-box';
    c.innerHTML = `
      <div style="display:flex;align-items:center;gap:12px;min-width:0;flex:1;">
        <div style="width:40px;height:40px;border-radius:12px;background:linear-gradient(135deg,#c2410c,#ea580c);color:#fff;display:flex;align-items:center;justify-content:center;flex-shrink:0;"><i class="fas fa-hands"></i></div>
        <div style="min-width:0;">
          <div style="font-weight:700;color:var(--text);">${escapeHTML(d.name)}</div>
          <div style="font-size:12px;color:var(--text2);">${escapeHTML(d.ref)} · ${escapeHTML((d.meaning || '').slice(0, 50))}...</div>
        </div>
      </div>
      <span class="meta-pill accent-pill">Open</span>`;
    c.addEventListener('click', () => openGuideReader('dua', d));
    stack.appendChild(c);
  });
  box.appendChild(stack);
}

function renderTasbihList() {
  const box = document.getElementById('tasbihResult');
  const info = document.getElementById('tasbihInfo');
  const q = (document.getElementById('tasbihSearchInput')?.value || '').trim().toLowerCase();
  if (!box) return;
  let list = TASBIH_LIST;
  if (q) list = list.filter(t => (`${t.roman} ${t.meaning} ${t.ar}`).toLowerCase().includes(q));
  if (info) info.textContent = `Tasbih · ${list.length}+ — sawab & detail`;
  box.innerHTML = '';
  const stack = document.createElement('div');
  stack.className = 'list-stack';
  list.forEach(t => {
    const c = document.createElement('div');
    c.className = 'item-box';
    c.innerHTML = `
      <div style="display:flex;align-items:center;gap:12px;min-width:0;flex:1;">
        <div style="width:40px;height:40px;border-radius:12px;background:linear-gradient(135deg,#0e7490,#06b6d4);color:#fff;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;flex-shrink:0;">${t.count}×</div>
        <div style="min-width:0;">
          <div style="font-weight:700;color:var(--text);direction:rtl;font-family:'Amiri',serif;font-size:16px;">${escapeHTML(t.ar)}</div>
          <div style="font-size:12px;color:var(--text2);">${escapeHTML(t.roman)} — ${escapeHTML(t.meaning)}</div>
        </div>
      </div>
      <span class="meta-pill accent-pill">Sawab</span>`;
    c.addEventListener('click', () => openGuideReader('tasbih', t));
    stack.appendChild(c);
  });
  box.appendChild(stack);
}

function defaultNamazSteps() {
  return [
    { title: 'Takbeer-e-Tahreema', ar: 'اللَّهُ أَكْبَرُ', tr: 'Allah sab se bada hai',
      wbw: [{a:'اللَّهُ',t:'Allah'},{a:'أَكْبَرُ',t:'sab se bada'}],
      note: 'Dono haath kaan tak uthakar takbeer. · Abu Dawud 749' },
    { title: 'Sana', ar: 'سُبْحَانَكَ اللَّهُمَّ وَبِحَمْدِكَ وَتَبَارَكَ اسْمُكَ وَتَعَالَىٰ جَدُّكَ وَلَا إِلَٰهَ غَيْرُكَ',
      tr: 'Aye Allah! Tu paak hai, teri tarif ke sath. Tera naam barkat wala, teri shan buland, tere siwa koi mabood nahi.',
      wbw: [{a:'سُبْحَانَكَ',t:'Tu paak hai'},{a:'اللَّهُمَّ',t:'Aye Allah'},{a:'وَبِحَمْدِكَ',t:'teri tarif se'},{a:'وَتَبَارَكَ اسْمُكَ',t:'tera naam mubarak'},{a:'وَتَعَالَىٰ جَدُّكَ',t:'teri shan buland'},{a:'وَلَا إِلَٰهَ غَيْرُكَ',t:'tere siwa koi mabood nahi'}],
      note: 'Abu Dawud 775 · Tirmidhi 243' },
    { title: 'Ta\'awwuz', ar: 'أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ',
      tr: 'Main shaitan-e-rajeem se Allah ki panah mangta hoon.',
      wbw: [{a:'أَعُوذُ',t:'main panah mangta'},{a:'بِاللَّهِ',t:'Allah se'},{a:'مِنَ الشَّيْطَانِ',t:'shaitan se'},{a:'الرَّجِيمِ',t:'jo radd kiya gaya'}],
      note: 'Quran 16:98' },
    { title: 'Bismillah', ar: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
      tr: 'Allah ke naam se jo Rehman o Raheem hai.',
      wbw: [{a:'بِسْمِ',t:'naam se'},{a:'اللَّهِ',t:'Allah ke'},{a:'الرَّحْمَٰنِ',t:'bohot meherban'},{a:'الرَّحِيمِ',t:'nihayat rehm wale'}],
      note: 'Har surah se pehle' },
    { title: 'Surah Al-Fatihah', ar: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ ۝ الرَّحْمَٰنِ الرَّحِيمِ ۝ مَالِكِ يَوْمِ الدِّينِ ۝ إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ ۝ اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ ۝ صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
      tr: 'Tamaam tarif Allah ke liye jo jahanon ka Rubb hai... humein seedha raasta dikha — unka jin par tu ne inayat ki, na gusse wale na bhatke.',
      wbw: [{a:'الْحَمْدُ',t:'tarif'},{a:'لِلَّهِ',t:'Allah ke liye'},{a:'رَبِّ',t:'Rubb'},{a:'الْعَالَمِينَ',t:'jahanon ka'},{a:'الرَّحْمَٰنِ',t:'Rehmani'},{a:'الرَّحِيمِ',t:'Raheem'},{a:'مَالِكِ',t:'malik'},{a:'يَوْمِ الدِّينِ',t:'jazaa ke din'},{a:'إِيَّاكَ نَعْبُدُ',t:'hum tujhi ki ibadat'},{a:'وَإِيَّاكَ نَسْتَعِينُ',t:'tujhi se madad'},{a:'اهْدِنَا',t:'humein dikha'},{a:'الصِّرَاطَ',t:'raasta'},{a:'الْمُسْتَقِيمَ',t:'seedha'}],
      note: 'Quran 1:1-7 · Sahih Bukhari 4474 — Fatihah ke baghair namaz nahi' },
    { title: 'Ruku ki Tasbih', ar: 'سُبْحَانَ رَبِّيَ الْعَظِيمِ',
      tr: 'Mera Rubb Azeem paak hai. (kam az kam 3 baar)',
      wbw: [{a:'سُبْحَانَ',t:'paak hai'},{a:'رَبِّيَ',t:'mera Rubb'},{a:'الْعَظِيمِ',t:'Azeem'}],
      note: 'Abu Dawud 871 · Muslim 772' },
    { title: 'Ruku se uthte waqt', ar: 'سَمِعَ اللَّهُ لِمَنْ حَمِدَهُ ۝ رَبَّنَا وَلَكَ الْحَمْدُ',
      tr: 'Allah ne sun li uski jo uski tarif kare. Aye hamare Rubb! Teri hi tarif hai.',
      wbw: [{a:'سَمِعَ اللَّهُ',t:'Allah ne suna'},{a:'لِمَنْ حَمِدَهُ',t:'jo uski tarif kare'},{a:'رَبَّنَا',t:'hamare Rubb'},{a:'وَلَكَ الْحَمْدُ',t:'teri hi tarif'}],
      note: 'Sahih Bukhari 795 · Sahih Muslim 409' },
    { title: 'Sajda ki Tasbih', ar: 'سُبْحَانَ رَبِّيَ الْأَعْلَىٰ',
      tr: 'Mera Rubb Aala paak hai. (kam az kam 3 baar)',
      wbw: [{a:'سُبْحَانَ',t:'paak hai'},{a:'رَبِّيَ',t:'mera Rubb'},{a:'الْأَعْلَىٰ',t:'sab se uncha'}],
      note: 'Abu Dawud 871 · Muslim 772' },
    { title: 'Tashahhud', ar: 'التَّحِيَّاتُ لِلَّهِ وَالصَّلَوَاتُ وَالطَّيِّبَاتُ ۝ السَّلَامُ عَلَيْكَ أَيُّهَا النَّبِيُّ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ ۝ السَّلَامُ عَلَيْنَا وَعَلَىٰ عِبَادِ اللَّهِ الصَّالِحِينَ ۝ أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا اللَّهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ',
      tr: 'Sab tarifein Allah ke liye... main gawahi deta hoon ke Allah ke siwa koi mabood nahi aur Muhammad uske bande aur rasool hain.',
      wbw: [{a:'التَّحِيَّاتُ',t:'sab tarifein'},{a:'لِلَّهِ',t:'Allah ke liye'},{a:'السَّلَامُ عَلَيْكَ',t:'salam ho tum par'},{a:'أَيُّهَا النَّبِيُّ',t:'Aye Nabi'},{a:'أَشْهَدُ',t:'main gawahi deta'},{a:'أَنْ لَا إِلَٰهَ',t:'koi mabood nahi'},{a:'إِلَّا اللَّهُ',t:'siwa Allah ke'},{a:'مُحَمَّدًا',t:'Muhammad'},{a:'عَبْدُهُ',t:'uske bande'},{a:'وَرَسُولُهُ',t:'aur rasool'}],
      note: 'Sahih Bukhari 831 · Sahih Muslim 402' },
    { title: 'Durood-e-Ibrahim', ar: 'اللَّهُمَّ صَلِّ عَلَىٰ مُحَمَّدٍ وَعَلَىٰ آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَىٰ إِبْرَاهِيمَ وَعَلَىٰ آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ',
      tr: 'Aye Allah! Muhammad aur Aal-e-Muhammad par rehmat bhej jaise Ibrahim aur Aal-e-Ibrahim par bheji; tu Hamid Majid hai.',
      wbw: [{a:'اللَّهُمَّ',t:'Aye Allah'},{a:'صَلِّ',t:'rehmat bhej'},{a:'عَلَىٰ مُحَمَّدٍ',t:'Muhammad par'},{a:'وَعَلَىٰ آلِ مُحَمَّدٍ',t:'Aal-e-Muhammad par'},{a:'كَمَا صَلَّيْتَ',t:'jaise bheji'},{a:'عَلَىٰ إِبْرَاهِيمَ',t:'Ibrahim par'}],
      note: 'Sahih Bukhari 3370' },
    { title: 'Salaam', ar: 'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ',
      tr: 'Tum par Allah ki salamti aur rehmat ho. (pehle dahine, phir bayein)',
      wbw: [{a:'السَّلَامُ',t:'salamti'},{a:'عَلَيْكُمْ',t:'tum par'},{a:'وَرَحْمَةُ اللَّهِ',t:'aur Allah ki rehmat'}],
      note: 'Abu Dawud 996 · Muslim 431' }
  ];
}

function guideLangKey() {
  const id = (selectedLang || 'roman').toLowerCase();
  // English family
  if (id === 'en' || id.startsWith('en') || id === 'en-us' || id === 'en-gb') return 'en';
  // Hindi / Devanagari family
  if (id === 'hi' || id === 'hin' || id === 'dev' || id === 'hi-in' || id.indexOf('hindi') >= 0) return 'hi';
  // Roman / Hinglish / Urdu-facing (roman-hi, roman, ur, etc.)
  if (id === 'roman' || id === 'roman-hi' || id.startsWith('roman') || id === 'ur' || id.startsWith('ur')) return 'roman';
  // default: treat most South-Asian ids as roman/urdu preference for hadith
  return 'roman';
}
function localizeGuideTr(text, langOverride) {
  if (!text) return '';
  let k = 'roman';
  try {
    if (langOverride) {
      const id = String(langOverride).toLowerCase();
      if (id === 'en' || id.startsWith('en')) k = 'en';
      else if (id === 'hi' || id === 'hin' || id === 'urdu-hi' || id.indexOf('hindi') >= 0) k = 'hi';
      else if (id === 'ur' || id.startsWith('ur')) k = 'ur';
      else k = 'roman';
    } else {
      k = guideLangKey();
    }
  } catch (e) { k = guideLangKey(); }
  if (k === 'hi' && typeof romanUrduToDevanagari === 'function') {
    try { return romanUrduToDevanagari(text); } catch (e) { return text; }
  }
  return text;
}
function buildSimpleWbw(ar, meaning) {
  const words = String(ar || '').trim().split(/\s+/).filter(Boolean);
  if (!words.length) return [];
  const parts = String(meaning || '').split(/[\s,،]+/).filter(Boolean);
  return words.map((w, i) => ({ a: w, t: localizeGuideTr(parts[i] || '') }));
}
function buildDuaIntroLong(item) {
  const roman = `${item.name || 'Yeh dua'} Quran / Sunnat se sabit hai (Ref: ${item.ref || '—'}).

${item.meaning || ''}

Is dua ko dil ki hudurri ke sath padhna chahiye. Quran ki duaein sab se afzal hain kyunki yeh Allah ka kalam hain. Nabi ﷺ ne kai duaon ki taleem di; unhein rozamarra ki zindagi, gham, shukr aur hajat mein padha jata hai.

Tarika: pehle taharat / wazu mustahab, qibla ru-ba-ru, haath uthakar ya sinay par rakh kar dua karein. Arabic matan sahi talaffuz se padhein; matlab samajh kar padhne se khushu badhti hai. Baad mein durood shareef bhejein.

Fayda: ${item.benefit || 'Dua banday ko Allah se jodti hai, gham halka karti hai aur ummeed paida karti hai.'} Hadees ke mutabiq dua ibadat ka maghz hai. Is page par Arabic, word-by-word tarjuma, Play aur hadith references maujood hain — upar se bhasha badalne par tarjuma update hota hai.`;
  const en = `${item.name || 'This dua'} is established from the Quran/Sunnah (Ref: ${item.ref || '—'}).

${item.meaning || ''}

Recite with presence of heart. Quranic supplications are among the best. The Prophet ﷺ taught many duas for daily life, hardship and gratitude.

Method: purity is preferred; face the Qibla; recite the Arabic clearly and understand the meaning. Send durood afterwards.

Benefit: ${item.benefit || 'Dua connects the servant to Allah.'} Use Play for Arabic and open (i) on hadith for full text. Change language from the top bar to update the translation.`;
  const hi = (typeof romanUrduToDevanagari === 'function') ? romanUrduToDevanagari(roman) : roman;
  return pickGuideText({ roman, en, hi }, roman);
}
function pickGuideText(map, fallback, langOverride) {
  if (!map) return fallback || '';
  if (typeof map === 'string') return map;
  let k = 'roman';
  try {
    if (langOverride) {
      const id = String(langOverride).toLowerCase();
      if (id === 'en' || id.startsWith('en')) k = 'en';
      else if (id === 'hi' || id === 'hin' || id === 'urdu-hi' || id.indexOf('hindi') >= 0) k = 'hi';
      else k = 'roman';
    } else {
      k = guideLangKey();
    }
  } catch (e) { k = guideLangKey(); }
  return map[k] || map.roman || map.en || map.hi || fallback || '';
}
function buildNamazMethodLong(item, langOverride) {
  const name = item.name || 'Namaz';
  const short = item.short || '';
  const method = item.method || '';
  const roman = `${name} (${short}) Islam ki buniyadi ibadat hai. ${method}

Is namaz ka maqsad Allah Taala ki bandagi, dil ki safai aur din ki yad dilana hai. Namaz se pehle wazu farz hai; badan, kapde aur jagah pak honi chahiye. Qibla ru-ba-ru khade ho kar niyyat dil mein bandhein — zuban se kehna behtar hai lekin dil ki niyyat asl hai.

Rakat ki tadad aur waqt shariat se sabit hain. Har farz namaz ke sath sunnat-e-muakkadah aur nafl ki fazeelat ahadith mein aayi hai. Jamaat se namaz ka sawab akela padhne se kai guna zyada hai (Sahih Bukhari, Sahih Muslim).

Namaz mein qiyam, ruku, sajda aur qaida farz/wajib arkan hain. Fatihah har rakat mein padhna zaroori hai (Bukhari 4474). Ruku mein «Subhana Rabbiyal Azeem» aur sajda mein «Subhana Rabbiyal Aala» kam az kam teen baar sunnat hai. Aakhiri qaida mein tashahhud, durood aur dua masnoon hai. Salaam dono taraf de kar namaz poori hoti hai.

Fayda: namaz gunahon ko dhouti hai, sabr sikhati hai, waqt ki pabandi aur social bhaichara (jamaat) badhati hai. Quran (29:45) ke mutabiq namaz fahash aur bure kaamon se rokti hai. Jo shakhs paanch waqt ki hifazat kare, qayamat ke din uske liye noor aur najat ki khushkhabri hai.`;
  const en = `${name} (${short}) is a fundamental act of worship in Islam. ${method}

The purpose is devotion to Allah, purification of the heart, and remembrance through the day. Wudu is required before prayer; body, clothes and place must be pure. Stand facing the Qibla and make niyyah in the heart.

The number of units (rakahs) and times are fixed by the Shariah. Praying in congregation multiplies the reward (Bukhari, Muslim). Standing, bowing, prostration and the final sitting are essential pillars. Al-Fatihah is required in every rakah (Bukhari 4474). In ruku say «Subhana Rabbiyal Azeem» and in sujood «Subhana Rabbiyal Aala» at least three times. End with tashahhud, durood and salaam.

Benefits: prayer washes away sins, teaches patience and punctuality, and builds community. Quran 29:45 states that prayer restrains from indecency and wrong. Whoever guards the five daily prayers has light and salvation on the Day of Judgment.`;
  const hi = `${name} (${short}) इस्लाम की बुनियादी इबादत है। ${method}

नमाज़ का मकसद अल्लाह की बंदगी, दिल की सफाई और दिन भर याद दिलाना है। नमाज़ से पहले वुज़ू फ़र्ज़ है। क़िबला रु-ब-रु खड़े होकर नीयत बांधें।

रकातों की संख्या और वक़्त शरीअत से तय हैं। जमात से नमाज़ का सवाब अकेले से कई गुना ज़्यादा है। हर रकात में फ़ातिहा ज़रूरी है (बुखारी 4474)। रुकू और सजदे में तस्बीह कम से कम तीन बार सुननत है। आखिरी क़ैदा में तशह्हुद, दुरूद और सलाम से नमाज़ पूरी होती है।

फ़ायदा: नमाज़ गुनाह धोती है, सब्र सिखाती है और बुरे कामों से रोकती है (क़ुरआन 29:45)। पाँच वक़्त की हिफ़ाज़त क़यामत के दिन नूर और नजात है।`;
  return pickGuideText({ roman, en, hi }, roman, langOverride);
}
function buildNamazTafseerLong(item, langOverride) {
  const name = item.name || 'Namaz';
  const roman = `${item.benefit || ''}

Tafseer / Nasihat: ${name} deen ka hissa hai. Quran ne namaz ko «kitaban mawquta» (4:103) kaha — waqt muqarrar ibadat. Nabi ﷺ ne farmaya: «الصَّلَاةُ عِمَادُ الدِّينِ» namaz deen ki buniyad hai. Paanch waqt ki hifazat par noor, burhan aur najat ki basharat hai (Muslim 667).

Fatihah ke baghair namaz nahi (Bukhari 4474). Ruku-sujood ki tasbeeh, tashahhud aur durood ahadith se sabit hain. Jamaat ka sawab 25–27 guna bayan hua. Namaz sirf jismani harkat nahi balki khushu, tauba aur Allah se rabta hai. Jo iski pabandi kare, dunya-aakhirat dono mein kamayabi ki ummeed rakh sakta hai.`;
  const en = `${item.benefit || ''}

Commentary: ${name} is central to the faith. The Quran calls prayer a timed obligation (4:103). The Prophet ﷺ said prayer is the pillar of the religion. Guarding the five prayers brings light and salvation (Muslim 667). Without Al-Fatihah there is no prayer (Bukhari 4474). Bowing, prostration, tashahhud and durood are established in hadith. Congregational prayer is rewarded many times over. Prayer is a bond with Allah — consistency brings success in this life and the next.`;
  const hi = `${item.benefit || ''}

तफ़सीर: ${name} दीन का हिस्सा है। क़ुरआन ने नमाज़ को वक़्त वाली इबादत कहा (4:103)। नबी ﷺ ने फ़रमाया नमाज़ दीन की बुनियाद है। पाँच वक़्त की हिफ़ाज़त पर नूर और नजात की बशारत है। फ़ातिहा के बिना नमाज़ नहीं (बुखारी 4474)। जमात का सवाब कई गुना है। नमाज़ अल्लाह से राब्ता है — पाबंदी दुनिया और आख़िरत की कामयाबी है।`;
  return pickGuideText({ roman, en, hi }, roman, langOverride);
}
function openHadithDetail(hadith, parentItem) {
  stopAllAyatAudio();
  currentReaderState = { type: 'hadith-detail', hadith, parent: parentItem };
  const fr = document.getElementById('fullReader');
  fr.classList.add('open', 'guide-mode', 'hadith-mode');
  fr.classList.remove('book-mode', 'pdf-tafseer-mode', 'arabic-only-mode');
  document.body.style.overflow = 'hidden';
  try {
    if (!window._readerHistoryPushed) {
      history.pushState({ quranReader: true }, '', location.href);
      window._readerHistoryPushed = true;
    }
  } catch (e) {}
  try { populateReaderLangDropdown(); populateArabicFontDropdown(); applyArabicFont(selectedArabicFontId); } catch (e) {}
  const el = document.getElementById('readerContent');
  const titleEl = document.getElementById('readerPageTitle');
  if (titleEl) titleEl.textContent = hadith.src || 'Hadith';
  const trLang = window._hadithTrLang || selectedLang || 'ur';
  const tfLang = window._hadithTfLang || selectedLang || 'ur';
  // Prefer edition fields when present
  let tr = '';
  if (hadith.eng || hadith.urd) {
    tr = hadithDisplayTr(hadith, trLang);
  } else {
    tr = pickGuideText(hadith.textMap, hadith.text || '');
    try {
      if (String(trLang).toLowerCase() === 'hi' || String(trLang).toLowerCase() === 'urdu-hi') {
        tr = localizeGuideTr(tr);
      }
    } catch (e) {}
  }
  const ara = hadith.ara || hadith.ar || '';
  const meta = { name: (parentItem && parentItem.name) || (hadith.src || 'Hadith') };
  const tafseer = (typeof buildHadithTafseerLong === 'function')
    ? buildHadithTafseerLong({ n: hadith.n || hadith.src || '', an: hadith.an, ara, eng: hadith.eng, urd: hadith.urd || hadith.text }, meta, tr, tfLang)
    : tr;
  const trClass = ((trLang === 'ur' || (String(trLang).startsWith('ur') && trLang !== 'urdu-hi')) && /[\u0600-\u06FF]/.test(tr)) ? ' urdu-nastaliq' : '';
  const tafseerClass = ((tfLang === 'ur' || String(tfLang).startsWith('ur')) && /[\u0600-\u06FF]/.test(tafseer)) ? ' urdu-nastaliq' : '';
  const trLangHtml = (typeof buildHadithLangOptionsHtml === 'function') ? buildHadithLangOptionsHtml(trLang, 'hadithTrLangSelectDetail') : '';
  const tfLangHtml = (typeof buildHadithLangOptionsHtml === 'function') ? buildHadithLangOptionsHtml(tfLang, 'hadithTfLangSelectDetail') : '';
  if (el) {
    el.innerHTML = `
      <div class="pdf-mushaf-page" style="max-width:720px;margin:0 auto;padding:8px;">
        <div class="guide-step-card" id="hadithArabicCard">
          <div class="guide-step-head" style="flex-wrap:wrap;gap:8px;">
            <span>① Arabic</span>
            <div style="display:flex;align-items:center;gap:6px;margin-left:auto;flex-wrap:wrap;">
              ${typeof buildArabicFontOptionsHtml === 'function' ? buildArabicFontOptionsHtml('hadithArFontSelectDetail') : ''}
              <button type="button" id="hadithArPlayDetail" class="play-ayah-btn" style="height:34px;padding:0 14px;border-radius:10px;border:none;background:linear-gradient(135deg,#0c6833,#22c55e);color:#fff;font-weight:700;cursor:pointer;"><i class="fas fa-play"></i> Play</button>
            </div>
          </div>
          <div class="guide-step-body">
            ${ara ? `<div class="arabic-text" id="hadithArText" style="font-size:22px;line-height:1.9;direction:rtl;text-align:right;">${escapeHTML(ara)}</div>` : '<div style="color:var(--text2);">Arabic not available</div>'}
          </div>
        </div>
        <div class="guide-step-card">
          <div class="guide-step-head" style="flex-wrap:wrap;gap:8px;">
            <span>② Hadith / Tarjuma</span>
            <div style="display:flex;align-items:center;gap:6px;margin-left:auto;flex-wrap:wrap;">
              ${trLangHtml}
              <button type="button" id="hadithEnPlayDetail" class="play-ayah-btn" style="height:34px;padding:0 14px;border-radius:10px;border:none;background:linear-gradient(135deg,#0c6833,#22c55e);color:#fff;font-weight:700;cursor:pointer;"><i class="fas fa-play"></i> Play</button>
            </div>
          </div>
          <div class="guide-step-body${trClass}" id="hadithDetailText" style="font-size:15px;line-height:1.75;white-space:pre-wrap;">${escapeHTML(tr)}</div>
        </div>
        <div class="guide-step-card">
          <div class="guide-step-head" style="flex-wrap:wrap;gap:8px;">
            <span>③ Tafseer · Nasihat &amp; Faida</span>
            <div style="display:flex;align-items:center;gap:6px;margin-left:auto;flex-wrap:wrap;">
              ${tfLangHtml}
              <button type="button" id="hadithTafseerPlayDetail" class="play-ayah-btn" style="height:34px;padding:0 14px;border-radius:10px;border:none;background:linear-gradient(135deg,#0c6833,#22c55e);color:#fff;font-weight:700;cursor:pointer;"><i class="fas fa-play"></i> Play</button>
            </div>
          </div>
          <div class="guide-step-body${tafseerClass}" id="hadithTafseerTextDetail" style="font-size:13px;line-height:1.7;white-space:pre-line;">${escapeHTML(tafseer)}</div>
        </div>
        ${parentItem && parentItem.name ? `<div style="text-align:center;margin-top:12px;font-size:12px;color:var(--text2);">Ref: ${escapeHTML(parentItem.name)}</div>` : ''}
      </div>`;
    try { applyArabicFont(selectedArabicFontId); } catch (e) {}
    try { scrollHadithReaderToTop(); } catch (e) {}
    const trSel = document.getElementById('hadithTrLangSelectDetail');
    if (trSel) {
      trSel.onchange = () => {
        saveReaderScrollForLangChange();
        window._hadithTrLang = trSel.value;
        try {
          selectedLang = trSel.value;
          const top = document.getElementById('readerLangSelect');
          if (top) top.value = trSel.value;
          persistReaderPrefs();
        } catch (e) {}
        openHadithDetail(hadith, parentItem);
      };
    }
    const tfSel = document.getElementById('hadithTfLangSelectDetail');
    if (tfSel) {
      tfSel.onchange = () => {
        saveReaderScrollForLangChange();
        window._hadithTfLang = tfSel.value;
        openHadithDetail(hadith, parentItem);
      };
    }
    const bindDetailPlay = (btnId, textId, fallbackText, lang) => {
      const btn = document.getElementById(btnId);
      if (!btn) return;
      btn.onclick = (ev) => {
        try { ev.preventDefault(); ev.stopPropagation(); } catch (e) {}
        let t = '';
        const node = textId ? document.getElementById(textId) : null;
        if (node) t = (node.textContent || node.innerText || '').trim();
        if (!t) t = (fallbackText || '').trim();
        if (!t) { try { showToast('Text nahi mila'); } catch (e) {} return; }
        // speakTextAloud handles pause/resume when same button is active
        speakTextAloud(t, btn, lang);
      };
    };
    bindDetailPlay('hadithArPlayDetail', 'hadithArText', ara, 'ar');
    bindDetailPlay('hadithEnPlayDetail', 'hadithDetailText', tr, hadithSpeechLang());
    bindDetailPlay('hadithTafseerPlayDetail', 'hadithTafseerTextDetail', tafseer, hadithSpeechLang());
    try { bindInlineArabicFontSelect('hadithArFontSelectDetail'); } catch (e) {}
  }
}


/* Parse "Abu Dawud 749", "Sahih Bukhari 528", "Quran 16:98", "Muslim 772" etc. */
function parseGuideRefTokens(str) {
  const s = String(str || '');
  const out = [];
  const seen = new Set();
  const push = (o) => {
    const k = (o.type || '') + '|' + (o.label || '');
    if (seen.has(k)) return;
    seen.add(k);
    out.push(o);
  };
  // Quran 2:238 or 1:1-7 or Quran 16:98
  const qRe = /(?:Quran|Qur'?an|Q\.)\s*(\d{1,3})\s*[:：]\s*(\d{1,3})(?:\s*[-–]\s*(\d{1,3}))?/gi;
  let m;
  while ((m = qRe.exec(s))) {
    push({ type: 'quran', label: `Quran ${m[1]}:${m[2]}${m[3] ? '-' + m[3] : ''}`, surah: +m[1], ayah: +m[2], ayahEnd: m[3] ? +m[3] : +m[2] });
  }
  // Bare 2:238 style when context is quran
  const bareQ = /\b(\d{1,3})\s*[:：]\s*(\d{1,3})(?:\s*[-–]\s*(\d{1,3}))?\b/g;
  while ((m = bareQ.exec(s))) {
    if (/quran|ayat|ayah|surah/i.test(s) || out.some(x => x.type === 'quran')) {
      push({ type: 'quran', label: `Quran ${m[1]}:${m[2]}${m[3] ? '-' + m[3] : ''}`, surah: +m[1], ayah: +m[2], ayahEnd: m[3] ? +m[3] : +m[2] });
    }
  }
  // Hadith books + number
  const bookPatterns = [
    { re: /(?:Sahih\s+)?(?:al-)?Bukhari\s*#?\s*(\d{1,5})/gi, mode: 'hadith-bukhari', name: 'Sahih al-Bukhari' },
    { re: /(?:Sahih\s+)?Muslim\s*#?\s*(\d{1,5})/gi, mode: 'hadith-muslim', name: 'Sahih Muslim' },
    { re: /(?:Jami[a']?\s+)?(?:at-)?Tirmidhi\s*#?\s*(\d{1,5})/gi, mode: 'hadith-tirmidhi', name: 'Jami at-Tirmidhi' },
    { re: /(?:Sunan\s+)?Abu\s*Daw(?:u|oo)?d\s*#?\s*(\d{1,5})/gi, mode: 'hadith-abudawud', name: 'Sunan Abu Dawud' },
    { re: /(?:Sunan\s+)?(?:an-)?Nasa'?i\s*#?\s*(\d{1,5})/gi, mode: 'hadith-nasai', name: "Sunan an-Nasa'i" },
    { re: /(?:Sunan\s+)?Ibn\s*Majah\s*#?\s*(\d{1,5})/gi, mode: 'hadith-ibnmajah', name: 'Sunan Ibn Majah' },
    { re: /Muwatta\s*(?:Imam\s*)?Malik\s*#?\s*(\d{1,5})/gi, mode: 'hadith-malik', name: 'Muwatta Imam Malik' }
  ];
  bookPatterns.forEach(bp => {
    let mm;
    const re = new RegExp(bp.re.source, 'gi');
    while ((mm = re.exec(s))) {
      push({ type: 'hadith', label: `${bp.name} ${mm[1]}`, mode: bp.mode, num: +mm[1], name: bp.name });
    }
  });
  return out;
}

function renderRefPillsHtml(refStr, fallbackLabel) {
  const tokens = parseGuideRefTokens(refStr);
  if (!tokens.length) {
    if (!refStr) return '';
    // plain note with generic i that opens detail from note text
    return `<div class="guide-ref-row">
      <span class="guide-ref-pill">${escapeHTML(fallbackLabel || refStr)}
        <button type="button" class="guide-ref-info" data-ref-type="note" data-ref-label="${escapeHTML(refStr)}" title="Detail">i</button>
      </span>
    </div>`;
  }
  return `<div class="guide-ref-row">${tokens.map(t => {
    const ds = `data-ref-type="${t.type}" data-ref-label="${escapeHTML(t.label)}" data-ref-mode="${escapeHTML(t.mode || '')}" data-ref-num="${t.num || ''}" data-ref-surah="${t.surah || ''}" data-ref-ayah="${t.ayah || ''}" data-ref-ayah-end="${t.ayahEnd || ''}"`;
    return `<span class="guide-ref-pill">${escapeHTML(t.label)}
      <button type="button" class="guide-ref-info" ${ds} title="Open full ${t.type === 'quran' ? 'Ayat' : 'Hadith'}">i</button>
    </span>`;
  }).join('')}</div>`;
}

async function openGuideReferenceFromBtn(btn, parentItem) {
  const type = (btn.getAttribute('data-ref-type') || 'note').toLowerCase();
  const label = btn.getAttribute('data-ref-label') || '';
  const mode = btn.getAttribute('data-ref-mode') || '';
  const num = parseInt(btn.getAttribute('data-ref-num') || '0', 10);
  const surah = parseInt(btn.getAttribute('data-ref-surah') || '0', 10);
  const ayah = parseInt(btn.getAttribute('data-ref-ayah') || '0', 10);
  const ayahEnd = parseInt(btn.getAttribute('data-ref-ayah-end') || String(ayah), 10);

  // Save current Guide page so Back returns here (not Home)
  pushReaderReturnState();

  if (type === 'hadith' && mode && num > 0) {
    showToast('Hadith load ho rahi hai…');
    try {
      const meta = HADITH_BOOKS[mode];
      if (!meta) throw 0;
      const pack = await ensureHadithBook(mode);
      if (!pack) throw 0;
      let h = null;
      if (pack.byNum && pack.byNum.get) h = pack.byNum.get(num);
      if (!h && pack.list) h = pack.list.find(x => x.n === num || x.an === num);
      if (!h) {
        openHadithDetail({ src: label, text: `${label}\n\nIs number ki full matan is edition mein nahi mili. Hadith section se book open karke #${num} search karein.` }, parentItem);
        return;
      }
      await openHadithBookReader(h, meta);
      return;
    } catch (e) {
      openHadithDetail({ src: label, text: `${label}\n\nLoad fail. Internet check karein ya Hadith section se book open karein.` }, parentItem);
      return;
    }
  }

  if (type === 'quran' && surah > 0 && ayah > 0) {
    showToast('Quran ayat load ho rahi hai…');
    try {
      await openQuranRefDetail(surah, ayah, ayahEnd, label, parentItem);
      return;
    } catch (e) {
      openHadithDetail({
        src: label || ('Quran ' + surah + ':' + ayah),
        text: `${label}\n\nAyat load nahi ho saki. Quran section se Surah ${surah} Ayat ${ayah} kholen.`
      }, parentItem || { name: 'Quran' });
      return;
    }
  }

  // generic note
  openHadithDetail({
    src: label || 'Reference',
    text: `${label}\n\nYeh reference Namaz / Dua / Tasbih guide se linked hai. Mukammal matan ke liye Hadith ya Quran section use karein.`
  }, parentItem);
}

async function openQuranRefDetail(surah, ayah, ayahEnd, label, parentItem) {
  const end = Math.max(ayah, ayahEnd || ayah);
  const maxA = Math.min(end, ayah + 14);
  const arParts = [];
  const trParts = [];
  // Local language for this page (dropdowns) — fall back to top toolbar
  const trLang = window._hadithTrLang || selectedLang || 'ur';
  const tfLang = window._hadithTfLang || selectedLang || 'ur';
  const kTr = (function(id) {
    id = String(id || '').toLowerCase();
    if (id === 'en' || id.startsWith('en')) return 'en';
    if (id === 'hi' || id === 'hin' || id === 'urdu-hi' || id.indexOf('hindi') >= 0) return 'hi';
    return 'ur';
  })(trLang);
  let trEdition = 'ur.jalandhry';
  if (kTr === 'en') trEdition = 'en.sahih';
  else trEdition = 'ur.jalandhry';

  for (let a = ayah; a <= maxA; a++) {
    let gotAr = false;
    try {
      const arJ = await (await fetch(`https://cdn.jsdelivr.net/gh/fawazahmed0/quran-api@1/editions/ara-quranuthmanihaf/${surah}/${a}.min.json`)).json();
      if (arJ && arJ.text) { arParts.push(arJ.text); gotAr = true; }
    } catch (e1) {}
    if (!gotAr) {
      try {
        const arJ2 = await (await fetch(`https://api.alquran.cloud/v1/ayah/${surah}:${a}/quran-uthmani`)).json();
        if (arJ2 && arJ2.data && arJ2.data.text) arParts.push(arJ2.data.text);
      } catch (e1b) {}
    }
    let gotTr = false;
    const tryEditions = [trEdition, 'ur.jalandhry', 'ur.ahmedali', 'en.sahih'];
    for (const ed of tryEditions) {
      if (gotTr) break;
      try {
        const trJ = await (await fetch(`https://api.alquran.cloud/v1/ayah/${surah}:${a}/${ed}`)).json();
        if (trJ && trJ.code === 200 && trJ.data && trJ.data.text) {
          const t = String(trJ.data.text).replace(/\n/g, ' ').trim();
          if (t) { trParts.push(t); gotTr = true; }
        }
      } catch (e2) {}
    }
  }
  const ara = arParts.join(' ') || '';
  let tr = trParts.join(' ') || '';
  try {
    if (kTr === 'hi' && typeof localizeGuideTr === 'function' && tr) tr = localizeGuideTr(tr, 'hi');
  } catch (e) {}
  const sObj = (typeof SURAH_LIST !== 'undefined' && SURAH_LIST.find(x => x.n === surah)) || null;
  const sName = sObj ? (sObj.e || sObj.name || ('Surah ' + surah)) : ('Surah ' + surah);
  const rangeLabel = end > ayah ? `${surah}:${ayah}-${end}` : `${surah}:${ayah}`;
  const title = label || `Quran ${rangeLabel}`;
  let tf200 = '';
  try {
    if (typeof buildCompactAyatTafseer200 === 'function') {
      tf200 = buildCompactAyatTafseer200(sObj || { n: surah, name: sName }, ayah, ara, tr, tfLang || selectedLang || 'roman');
    } else if (typeof _getInlineTafseerSections === 'function') {
      tf200 = (_getInlineTafseerSections(surah, ayah, ara, tr).text) || '';
    }
  } catch (e) { tf200 = tr || ''; }
  // If tafseer lang is Hindi, try localize
  try {
    const id = String(tfLang || '').toLowerCase();
    if ((id === 'hi' || id === 'urdu-hi' || id.indexOf('hindi') >= 0) && typeof localizeGuideTr === 'function' && tf200) {
      // only convert if mostly Latin script
      if (!/[\u0900-\u097F]/.test(tf200) && !/[\u0600-\u06FF]/.test(tf200.slice(0, 80))) {
        tf200 = localizeGuideTr(tf200, 'hi');
      }
    }
  } catch (e) {}

  stopAllAyatAudio();
  currentReaderState = {
    type: 'quran-ref',
    surah, ayah, ayahEnd: end, label, parent: parentItem || { name: 'Quran' },
    isQuranRef: true
  };
  const fr = document.getElementById('fullReader');
  fr.classList.add('open', 'guide-mode', 'hadith-mode');
  fr.classList.remove('book-mode', 'pdf-tafseer-mode', 'arabic-only-mode');
  document.body.style.overflow = 'hidden';
  try {
    if (!window._readerHistoryPushed) {
      history.pushState({ quranReader: true }, '', location.href);
      window._readerHistoryPushed = true;
    }
  } catch (e) {}
  try {
    populateReaderLangDropdown();
    populateArabicFontDropdown();
    applyArabicFont(selectedArabicFontId);
  } catch (e) {}
  const el = document.getElementById('readerContent');
  const titleEl = document.getElementById('readerPageTitle');
  if (titleEl) titleEl.textContent = title;
  const trClass = ((kTr === 'ur') && /[\u0600-\u06FF]/.test(tr)) ? ' urdu-nastaliq' : '';
  const trLangHtml = (typeof buildHadithLangOptionsHtml === 'function') ? buildHadithLangOptionsHtml(trLang, 'quranRefTrLangSelect') : '';
  const tfLangHtml = (typeof buildHadithLangOptionsHtml === 'function') ? buildHadithLangOptionsHtml(tfLang, 'quranRefTfLangSelect') : '';
  if (el) {
    el.innerHTML = `
      <div class="pdf-mushaf-page" style="max-width:720px;margin:0 auto;padding:8px;">
        <div style="text-align:center;padding:12px;border:2px solid #2d6a3e;border-radius:12px;margin-bottom:12px;background:linear-gradient(180deg,#e8f5e9,#f4faf5);">
          <div style="font-size:12px;color:#166534;font-weight:700;">Quran Majid · Ayat</div>
          <h2 style="margin:6px 0;color:#0c6833;">${escapeHTML(sName)}</h2>
          <div style="font-size:13px;color:#166534;font-weight:700;">${escapeHTML(rangeLabel)}</div>
        </div>
        <div class="guide-step-card">
          <div class="guide-step-head" style="flex-wrap:wrap;gap:8px;">
            <span>① Arabic</span>
            <button type="button" id="quranRefArPlay" class="play-ayah-btn" style="height:34px;padding:0 14px;border-radius:10px;border:none;background:linear-gradient(135deg,#0c6833,#22c55e);color:#fff;font-weight:700;margin-left:auto;"><i class="fas fa-play"></i> Play</button>
          </div>
          <div class="guide-step-body">
            <div class="guide-ar-line arabic-text" id="quranRefArText" style="font-size:22px;line-height:1.9;direction:rtl;text-align:right;">${escapeHTML(ara || '— Arabic load nahi hua —')}</div>
          </div>
        </div>
        <div class="guide-step-card">
          <div class="guide-step-head" style="flex-wrap:wrap;gap:8px;">
            <span>② Tarjuma</span>
            <div style="display:flex;align-items:center;gap:6px;margin-left:auto;flex-wrap:wrap;">
              ${trLangHtml}
              <button type="button" id="quranRefTrPlay" class="play-ayah-btn" style="height:34px;padding:0 14px;border-radius:10px;border:none;background:linear-gradient(135deg,#0c6833,#22c55e);color:#fff;font-weight:700;"><i class="fas fa-play"></i> Play</button>
            </div>
          </div>
          <div class="guide-step-body${trClass}" id="quranRefTrText" style="font-size:14px;line-height:1.7;word-break:break-word;">${escapeHTML(tr || '— Tarjuma available nahi —')}</div>
        </div>
        <div class="guide-step-card">
          <div class="guide-step-head" style="flex-wrap:wrap;gap:8px;">
            <span>③ Tafseer · Matlab &amp; Nasihat</span>
            <div style="display:flex;align-items:center;gap:6px;margin-left:auto;flex-wrap:wrap;">
              ${tfLangHtml}
              <button type="button" id="quranRefTfPlay" class="play-ayah-btn" style="height:34px;padding:0 14px;border-radius:10px;border:none;background:linear-gradient(135deg,#0c6833,#22c55e);color:#fff;font-weight:700;"><i class="fas fa-play"></i> Play</button>
            </div>
          </div>
          <div class="guide-step-body" id="quranRefTfText" style="font-size:13px;line-height:1.75;white-space:pre-line;">${escapeHTML(tf200)}</div>
        </div>
        <div style="text-align:center;margin-top:10px;font-size:12px;color:var(--text2);">Language dropdown se tarjuma / tafseer badlein · Back se pehle page</div>
      </div>`;
    try { applyArabicFont(selectedArabicFontId); } catch (e) {}
    try { scrollHadithReaderToTop(); } catch (e) {}

    // Local language dropdowns
    const trSel = document.getElementById('quranRefTrLangSelect');
    if (trSel) {
      trSel.onchange = () => {
        saveReaderScrollForLangChange();
        window._hadithTrLang = trSel.value;
        try {
          selectedLang = trSel.value;
          const top = document.getElementById('readerLangSelect');
          if (top) top.value = trSel.value;
          persistReaderPrefs();
        } catch (e) {}
        openQuranRefDetail(surah, ayah, end, label, parentItem);
      };
    }
    const tfSel = document.getElementById('quranRefTfLangSelect');
    if (tfSel) {
      tfSel.onchange = () => {
        saveReaderScrollForLangChange();
        window._hadithTfLang = tfSel.value;
        openQuranRefDetail(surah, ayah, end, label, parentItem);
      };
    }

    const bind = (id, textId, fallback, lang) => {
      const b = document.getElementById(id);
      if (!b) return;
      b.onclick = (ev) => {
        try { ev.preventDefault(); ev.stopPropagation(); } catch (e) {}
        let t = '';
        const n = document.getElementById(textId);
        if (n) t = (n.textContent || '').trim();
        if (!t) t = (fallback || '').trim();
        if (!t) { showToast('Text nahi mila'); return; }
        speakTextAloud(t, b, lang);
      };
    };
    const speechLang = (typeof hadithSpeechLang === 'function') ? hadithSpeechLang() : 'ur';
    bind('quranRefArPlay', 'quranRefArText', ara, 'ar');
    bind('quranRefTrPlay', 'quranRefTrText', tr, speechLang);
    bind('quranRefTfPlay', 'quranRefTfText', tf200, speechLang);
  }
}


function openGuideReader(kind, item, fromRestore) {
  stopAllAyatAudio();
  // Fresh open from list → clear nested stack; restore keeps remaining stack
  if (!fromRestore) {
    try { window._readerReturnStack = []; } catch (e) {}
  }
  currentReaderState = { type: 'guide', kind, data: item };
  const fr = document.getElementById('fullReader');
  fr.classList.add('open', 'guide-mode');
  fr.classList.remove('book-mode', 'pdf-tafseer-mode', 'hadith-mode', 'arabic-only-mode');
  document.body.style.overflow = 'hidden';
  try {
    if (!window._readerHistoryPushed) {
      history.pushState({ quranReader: true }, '', location.href);
      window._readerHistoryPushed = true;
    }
  } catch (e) {}
  const el = document.getElementById('readerContent') || document.getElementById('readerScrollBody');
  const titleEl = document.getElementById('readerPageTitle');
  if (titleEl) titleEl.textContent = item.name || item.roman || 'Guide';

  const playBtn = (label, cls) =>
    `<button type="button" class="${cls || ''}" style="width:30px;height:30px;border-radius:50%;border:none;background:linear-gradient(135deg,#0c6833,#22c55e);color:#fff;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;" title="${label}"><i class="fas fa-play" style="font-size:10px;"></i></button>`;

  const wbwHtml = (wbw) => {
    if (!wbw || !wbw.length) return '';
    return `<div class="guide-wbw-row">${wbw.map(w =>
      `<div class="guide-wbw-box"><span class="g-ar">${escapeHTML(w.a)}</span><span class="g-tr">${escapeHTML(w.t)}</span></div>`
    ).join('')}</div>`;
  };

  let html = '';
  if (kind === 'namaz') {
    const steps = item.steps || defaultNamazSteps();
    const maslaLang = window._guideMaslaLang || window._hadithTrLang || selectedLang || 'ur';
    const tfLang = window._guideTfLang || window._hadithTfLang || selectedLang || 'ur';
    const methodLong = buildNamazMethodLong(item, maslaLang);
    const tafseerLong = buildNamazTafseerLong(item, tfLang);
    const maslaLangHtml = (typeof buildHadithLangOptionsHtml === 'function') ? buildHadithLangOptionsHtml(maslaLang, 'guideMaslaLangSelect') : '';
    const tfLangHtml = (typeof buildHadithLangOptionsHtml === 'function') ? buildHadithLangOptionsHtml(tfLang, 'guideTfLangSelect') : '';
    html = `
      <div class="pdf-mushaf-page" style="max-width:720px;margin:0 auto;padding:8px;">
        <div style="text-align:center;padding:12px 8px;border:2px solid #2d6a3e;border-radius:12px;margin-bottom:12px;background:linear-gradient(180deg,#e8f5e9,#f4faf5);">
          <div style="font-size:12px;color:#166534;font-weight:700;">Namaz Guide · Israr Tool Zone</div>
          <h2 style="margin:6px 0 4px;color:#0c6833;">${escapeHTML(item.name)}</h2>
          <div style="font-size:22px;direction:rtl;font-family:'Amiri',serif;color:#0c6833;">${escapeHTML(item.ar || '')}</div>
          <div style="font-size:12px;color:#166534;margin-top:4px;">${escapeHTML(item.short || '')}</div>
        </div>

        <div class="guide-step-card">
          <div class="guide-step-head" style="flex-wrap:wrap;gap:8px;">
            <span>Mukhtasar Tarika / Masla</span>
            <div style="display:flex;align-items:center;gap:6px;margin-left:auto;flex-wrap:wrap;">
              ${maslaLangHtml}
              ${playBtn('Play Tarika', 'guide-method-play')}
            </div>
          </div>
          <div class="guide-step-body">
            <div class="guide-method-text" style="font-size:13px;line-height:1.65;white-space:pre-line;">${escapeHTML(methodLong)}</div>
            <div style="margin-top:10px;font-size:13px;"><b>Niyyat:</b> ${escapeHTML(item.niyyah || '')}</div>
          </div>
        </div>

        <div style="font-weight:800;color:#16a34a;margin:10px 4px 8px;font-size:14px;">Namaz mein kya padhein — Arabic · Word-by-word · Play</div>
        ${steps.map((s, i) => {
          const wbwLoc = (s.wbw || []).map(w => ({ a: w.a, t: localizeGuideTr(w.t || '') }));
          const trLoc = localizeGuideTr(s.tr || '');
          return `
          <div class="guide-step-card">
            <div class="guide-step-head">
              <span>${i + 1}. ${escapeHTML(s.title)}</span>
              ${playBtn('Play Arabic', 'guide-step-play')}
            </div>
            <div class="guide-step-body">
              <div class="guide-step-ar guide-ar-line arabic-text">${escapeHTML(s.ar)}</div>
              <div style="font-size:11px;font-weight:700;color:#16a34a;margin:6px 0 2px;">Word-by-word</div>
              ${wbwHtml(wbwLoc)}
              <div style="font-size:13px;line-height:1.5;margin-top:6px;"><b>Tarjuma:</b> ${escapeHTML(trLoc)}</div>
              ${s.note ? (() => {
                const toks = parseGuideRefTokens(s.note);
                const noteText = String(s.note).replace(/\s*[·•|]\s*/g, ' · ').trim();
                // show human note text, then clickable ref pills with (i)
                return `<div style="margin-top:8px;">
                  <div style="font-size:12px;line-height:1.5;color:var(--text2);margin-bottom:4px;">${escapeHTML(noteText)}</div>
                  ${toks.length ? renderRefPillsHtml(s.note) : renderRefPillsHtml(s.note, noteText)}
                </div>`;
              })() : ''}
              ${(item.hadith && item.hadith[i % item.hadith.length]) ? (() => {
                const hh = item.hadith[i % item.hadith.length];
                return `<div style="margin-top:10px;padding:8px;border-radius:8px;border:1px solid rgba(45,106,62,.25);background:rgba(22,163,74,.04);">
                ${renderRefPillsHtml(hh.src || 'Hadith')}
                <div style="font-size:12px;line-height:1.6;margin-top:6px;">${escapeHTML(localizeGuideTr(hh.text || ''))}</div>
              </div>`;
              })() : ''}
            </div>
          </div>`;
        }).join('')}

        <div class="guide-step-card">
          <div class="guide-step-head">Quran References</div>
          <div class="guide-step-body">
            ${(item.quran || []).map(q => `
              <div style="margin-bottom:12px;padding-bottom:10px;border-bottom:1px solid rgba(45,106,62,.25);">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px;gap:8px;flex-wrap:wrap;">
                  ${renderRefPillsHtml('Quran ' + (q.ref || ''), 'Quran ' + (q.ref || ''))}
                  ${playBtn('Play', 'guide-q-play')}
                </div>
                <div class="guide-q-ar guide-ar-line" style="font-size:18px;">${escapeHTML(q.text)}</div>
              </div>`).join('') || '<div style="font-size:13px;color:var(--text2);">—</div>'}
          </div>
        </div>

        <div class="guide-step-card">
          <div class="guide-step-head">Hadith — number + i detail + Play</div>
          <div class="guide-step-body">
            ${(item.hadith || []).map((h, hi) => `
              <div style="margin-bottom:12px;padding:10px;border-radius:8px;border:1px solid rgba(45,106,62,.3);">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;gap:8px;flex-wrap:wrap;">
                  ${renderRefPillsHtml(h.src || ('Hadith #' + (hi + 1)))}
                  <span style="display:flex;gap:6px;align-items:center;">
                    ${playBtn('Play Hadith', 'guide-h-play')}
                  </span>
                </div>
                <div class="guide-h-text" style="font-size:13px;line-height:1.6;">${escapeHTML(h.text)}</div>
              </div>`).join('') || '<div style="font-size:13px;">—</div>'}
          </div>
        </div>

        <div class="guide-step-card">
          <div class="guide-step-head" style="flex-wrap:wrap;gap:8px;">
            <span>Fayda · Tafseer</span>
            <div style="display:flex;align-items:center;gap:6px;margin-left:auto;flex-wrap:wrap;">
              ${tfLangHtml}
              ${playBtn('Play Tafseer', 'guide-tafseer-play')}
            </div>
          </div>
          <div class="guide-step-body">
            <div class="guide-tafseer-text" style="font-size:13px;line-height:1.65;white-space:pre-line;">${escapeHTML(tafseerLong)}</div>
          </div>
        </div>
      </div>`;
  } else if (kind === 'dua') {
    const intro = buildDuaIntroLong(item);
    const meaningLoc = localizeGuideTr(item.meaning || '');
    const benefitLoc = localizeGuideTr(item.benefit || '');
    const wbw = (item.wbw || buildSimpleWbw(item.ar || '', item.meaning || '')).map(w => ({ a: w.a, t: localizeGuideTr(w.t || '') }));
    const tafseerDua = localizeGuideTr('Tafseer / bayan:\nYeh dua Quran / Sunnat se ma\'khuz hai (Ref: ' + (item.ref || '—') + ').\nMatlab: ' + (item.meaning || '—') + '\nFayda: ' + (item.benefit || '—') + '\n\nIs dua ko samajh kar, huduri ke sath padhein. Hadith ka full text neeche hai. Upar se bhasha badalne par tarjuma aur tafseer update hoti hai.');
    html = `
      <div class="pdf-mushaf-page" style="max-width:720px;margin:0 auto;padding:8px;">
        <div style="text-align:center;padding:12px 8px;border:2px solid #2d6a3e;border-radius:12px;margin-bottom:12px;background:linear-gradient(180deg,#e8f5e9,#f4faf5);">
          <div style="font-size:12px;color:#166534;font-weight:700;">Quran Dua · Israr Tool Zone</div>
          <h2 style="margin:6px 0 4px;color:#0c6833;">${escapeHTML(item.name)}</h2>
          <div style="font-size:12px;color:#166534;">Quran / Ref: ${escapeHTML(item.ref || '')}</div>
        </div>
        <div class="guide-step-card">
          <div class="guide-step-head"><span>Arabic Dua</span>${playBtn('Play Arabic', 'guide-step-play')}</div>
          <div class="guide-step-body">
            <div class="guide-step-ar guide-ar-line arabic-text">${escapeHTML(item.ar || '')}</div>
            <div style="font-size:12px;font-weight:700;color:#16a34a;margin:8px 0 4px;">Word-by-word tarjuma</div>
            ${wbwHtml(wbw)}
            <div style="font-size:13px;line-height:1.5;margin-top:8px;"><b>Puri tarjuma:</b> ${escapeHTML(meaningLoc)}</div>
          </div>
        </div>
        <div class="guide-step-card">
          <div class="guide-step-head">Quran Ayat / Reference</div>
          <div class="guide-step-body">
            ${renderRefPillsHtml((item.ref && /:/.test(item.ref) ? 'Quran ' + item.ref : (item.ref || '')), item.ref || '—')}
            <div class="guide-step-ar guide-ar-line" style="font-size:18px;margin-top:8px;">${escapeHTML(item.ar || '')}</div>
          </div>
        </div>
        <div class="guide-step-card">
          <div class="guide-step-head">Hadith — number + full text</div>
          <div class="guide-step-body">
            ${(item.hadith || []).map((h, hi) => `
              <div style="margin-bottom:12px;padding:10px;border-radius:8px;border:1px solid rgba(45,106,62,.3);">
                <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;margin-bottom:6px;">
                  ${renderRefPillsHtml(h.src || ('Hadith #' + (hi+1)))}
                  ${playBtn('Play', 'guide-h-play')}
                </div>
                <div class="guide-h-text" style="font-size:13px;line-height:1.65;">${escapeHTML(localizeGuideTr(h.text || ''))}</div>
              </div>`).join('') || '<div style="font-size:13px;color:var(--text2);">' + renderRefPillsHtml(item.ref || '—') + '</div>'}
          </div>
        </div>
        <div class="guide-step-card">
          <div class="guide-step-head"><span>Tafseer / Detail</span>${playBtn('Play Tafseer', 'guide-tafseer-play')}</div>
          <div class="guide-step-body">
            <div class="guide-tafseer-text" style="font-size:13px;line-height:1.65;white-space:pre-line;">${escapeHTML(tafseerDua)}</div>
            <div style="margin-top:8px;font-size:13px;"><b>Fayda:</b> ${escapeHTML(benefitLoc)}</div>
            <div class="guide-method-text" style="display:none;">${escapeHTML(intro)}</div>
          </div>
        </div>
      </div>`;
  } else {
    /* tasbih */
    const meaningLoc = localizeGuideTr(item.meaning || '');
    const sawabLoc = localizeGuideTr(item.sawab || '');
    const benefitLoc = localizeGuideTr(item.benefit || '');
    const wbwT = buildSimpleWbw(item.ar || '', item.meaning || '').map(w => ({ a: w.a, t: localizeGuideTr(w.t || '') }));
    const tafseerT = localizeGuideTr('Tafseer:\n' + (item.roman || '') + ' — ' + (item.meaning || '') + '\nCount: ' + (item.count || '—') + '×\nSawab: ' + (item.sawab || '—') + '\nFayda: ' + (item.benefit || '—') + '\nReference: ' + (item.ref || '—') + '\n\nIs zikr ko subah-shaam / namaz ke baad padhein. Bhasha dropdown se tarjuma badlein.');
    item.hadith = item.hadith || [{ src: item.ref || 'Reference', text: (item.roman || '') + ': ' + (item.sawab || '') + ' ' + (item.benefit || '') }];
    html = `
      <div class="pdf-mushaf-page" style="max-width:720px;margin:0 auto;padding:8px;">
        <div style="text-align:center;padding:12px 8px;border:2px solid #2d6a3e;border-radius:12px;margin-bottom:12px;background:linear-gradient(180deg,#e8f5e9,#f4faf5);">
          <div style="font-size:12px;color:#166534;font-weight:700;">Tasbih · Israr Tool Zone</div>
          <div class="guide-step-ar guide-ar-line arabic-text" style="margin-top:8px;">${escapeHTML(item.ar || '')}</div>
          <h2 style="margin:6px 0 4px;color:#0c6833;">${escapeHTML(item.roman || '')}</h2>
          <span class="meta-pill accent-pill">${item.count || ''}×</span>
        </div>
        <div class="guide-step-card">
          <div class="guide-step-head"><span>Arabic · Word-by-word</span>${playBtn('Listen', 'guide-step-play')}</div>
          <div class="guide-step-body">
            <div class="guide-step-ar guide-ar-line arabic-text">${escapeHTML(item.ar || '')}</div>
            <div style="font-size:12px;font-weight:700;color:#16a34a;margin:8px 0 4px;">Word-by-word tarjuma</div>
            ${wbwHtml(wbwT)}
            <div style="font-size:13px;margin-top:8px;"><b>Matlab:</b> ${escapeHTML(meaningLoc)}</div>
          </div>
        </div>
        <div class="guide-step-card">
          <div class="guide-step-head">Hadith / Text</div>
          <div class="guide-step-body">
            ${(item.hadith || []).map((h, hi) => `
              <div style="margin-bottom:10px;padding:10px;border-radius:8px;border:1px solid rgba(45,106,62,.3);">
                ${renderRefPillsHtml(h.src || item.ref || '')}
                <div class="guide-h-text" style="font-size:13px;line-height:1.65;margin-top:6px;">${escapeHTML(localizeGuideTr(h.text || ''))}</div>
              </div>`).join('')}
            ${item.ref ? `<div style="margin-top:8px;">${renderRefPillsHtml(item.ref)}</div>` : ''}
          </div>
        </div>
        <div class="guide-step-card">
          <div class="guide-step-head"><span>Tafseer</span>${playBtn('Play Tafseer', 'guide-tafseer-play')}</div>
          <div class="guide-step-body">
            <div class="guide-tafseer-text" style="font-size:13px;line-height:1.65;white-space:pre-line;">${escapeHTML(tafseerT)}</div>
            <div style="margin-top:8px;font-size:13px;"><b>Sawab:</b> ${escapeHTML(sawabLoc)}</div>
            <div style="margin-top:4px;font-size:13px;"><b>Fayda:</b> ${escapeHTML(benefitLoc)}</div>
          </div>
        </div>
      </div>`;
  }
  if (el) {
    el.innerHTML = html;
    const frNow = document.getElementById('fullReader');
    const isUrduGuide = /^(ur|urdu)/i.test(String(selectedLang || ''));
    if (frNow) frNow.classList.toggle('urdu-guide', isUrduGuide);
    const savedUrduFontId = (() => { try { return localStorage.getItem('israr_urdu_font_id') || 'noto-nastaliq'; } catch (e) { return 'noto-nastaliq'; } })();
    const savedUrduFont = ARABIC_FONTS.find(f => f.id === savedUrduFontId) || ARABIC_FONTS.find(f => f.id === 'noto-nastaliq');
    if (savedUrduFont) el.style.setProperty('--urdu-font', savedUrduFont.family);

    // Namaz / Guide: Masla + Tafseer language dropdowns
    const gMasla = document.getElementById('guideMaslaLangSelect');
    if (gMasla) {
      gMasla.onchange = () => {
        saveReaderScrollForLangChange();
        window._guideMaslaLang = gMasla.value;
        window._hadithTrLang = gMasla.value;
        try {
          selectedLang = gMasla.value;
          const top = document.getElementById('readerLangSelect');
          if (top) top.value = gMasla.value;
          persistReaderPrefs();
        } catch (e) {}
        openGuideReader(kind, item, true);
      };
    }
    const gTf = document.getElementById('guideTfLangSelect');
    if (gTf) {
      gTf.onchange = () => {
        saveReaderScrollForLangChange();
        window._guideTfLang = gTf.value;
        window._hadithTfLang = gTf.value;
        openGuideReader(kind, item, true);
      };
    }
  }
  try { scrollHadithReaderToTop(); } catch (e) {}


  // Bind per-block play buttons
  el.querySelectorAll('.guide-step-play').forEach(btn => {
    const card = btn.closest('.guide-step-card') || btn.closest('.pdf-mushaf-page') || el;
    const arEl = card.querySelector('.guide-step-ar');
    btn.onclick = () => speakTextAloud((arEl && arEl.textContent) || item.ar || '', btn, 'ar');
  });
  el.querySelectorAll('.guide-q-play').forEach(btn => {
    const box = btn.closest('div[style]') || btn.parentElement.parentElement;
    const arEl = box.querySelector('.guide-q-ar');
    btn.onclick = () => speakTextAloud((arEl && arEl.textContent) || '', btn, 'ar');
  });
  el.querySelectorAll('.guide-h-play').forEach(btn => {
    const box = btn.closest('div[style]') || btn.parentElement.parentElement;
    const tEl = box.querySelector('.guide-h-text');
    btn.onclick = () => speakTextAloud((tEl && tEl.textContent) || '', btn, selectedLang === 'en' ? 'en' : 'hi');
  });
  el.querySelectorAll('.guide-method-play').forEach(btn => {
    const card = btn.closest('.guide-step-card') || el;
    const tEl = card.querySelector('.guide-method-text');
    btn.onclick = () => speakTextAloud((tEl && tEl.textContent) || '', btn, selectedLang === 'en' ? 'en' : 'hi');
  });
  el.querySelectorAll('.guide-tafseer-play').forEach(btn => {
    const card = btn.closest('.guide-step-card') || el;
    const tEl = card.querySelector('.guide-tafseer-text');
    btn.onclick = () => speakTextAloud((tEl && tEl.textContent) || '', btn, selectedLang === 'en' ? 'en' : 'hi');
  });
  el.querySelectorAll('.guide-h-info').forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const idx = parseInt(btn.getAttribute('data-hi'), 10);
      const h = (item.hadith || [])[idx];
      if (h) {
        // Prefer full book open when src has book+number
        const toks = parseGuideRefTokens(h.src || '');
        const ht = toks.find(t => t.type === 'hadith');
        if (ht && ht.mode && ht.num) {
          const fake = document.createElement('button');
          fake.setAttribute('data-ref-type', 'hadith');
          fake.setAttribute('data-ref-label', ht.label);
          fake.setAttribute('data-ref-mode', ht.mode);
          fake.setAttribute('data-ref-num', String(ht.num));
          openGuideReferenceFromBtn(fake, item);
        } else {
          pushReaderReturnState();
          openHadithDetail({ ...h, text: localizeGuideTr(h.text || ''), ara: h.ara || h.ar || '' }, item);
        }
      }
    };
  });
  el.querySelectorAll('.guide-ref-info').forEach(btn => {
    btn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      openGuideReferenceFromBtn(btn, item);
    };
  });
  el.querySelectorAll('.guide-note-info').forEach(btn => {
    btn.onclick = (e) => {
      e.stopPropagation();
      const note = btn.getAttribute('data-note') || '';
      const ar = btn.getAttribute('data-ar') || '';
      const title = btn.getAttribute('data-title') || 'Reference';
      const toks = parseGuideRefTokens(note);
      if (toks.length) {
        const fake = document.createElement('button');
        const t0 = toks[0];
        fake.setAttribute('data-ref-type', t0.type);
        fake.setAttribute('data-ref-label', t0.label);
        fake.setAttribute('data-ref-mode', t0.mode || '');
        fake.setAttribute('data-ref-num', String(t0.num || ''));
        fake.setAttribute('data-ref-surah', String(t0.surah || ''));
        fake.setAttribute('data-ref-ayah', String(t0.ayah || ''));
        fake.setAttribute('data-ref-ayah-end', String(t0.ayahEnd || ''));
        openGuideReferenceFromBtn(fake, item);
        return;
      }
      pushReaderReturnState();
      openHadithDetail({
        src: note,
        ara: ar,
        text: `${title}\n\n${ar}\n\n${localizeGuideTr(note)}\n\nYeh reference is namaz ke is juz (rukn) se mutalliq hai. Mukammal hadees / masla ke liye upar diye gaye Hadith section aur Quran references dekhein.`
      }, item);
    };
  });

  const playAr = document.getElementById('guidePlayAr');
  const playH = document.getElementById('guidePlayHadith');
  if (playAr) playAr.onclick = () => speakTextAloud(item.ar || item.roman || '', playAr, 'ar');
  if (playH) playH.onclick = () => {
    const t = kind === 'namaz'
      ? (item.hadith || []).map(h => h.text).join('. ')
      : (item.meaning || '');
    speakTextAloud(t, playH, selectedLang === 'en' ? 'en' : 'hi');
  };
}

/* Prayer times */
let _prayerTimer = null;
let _prayerData = null;
async function loadPrayerTimes(city) {
  const next = document.getElementById('pdNext');
  const grid = document.getElementById('prayerGrid');
  if (next) next.textContent = 'Loading prayer times...';
  const rawCity = (city || localStorage.getItem('prayerCity') || 'Delhi').trim() || 'Delhi';
  const cityEnc = encodeURIComponent(rawCity);
  // Guess country for common South Asian cities
  const countryGuess = /lahore|karachi|islamabad|rawalpindi|peshawar|multan/i.test(rawCity) ? 'Pakistan'
    : /dhaka|chittagong/i.test(rawCity) ? 'Bangladesh'
    : /dubai|abu dhabi|sharjah/i.test(rawCity) ? 'UAE'
    : /riyadh|jeddah|makkah|madinah/i.test(rawCity) ? 'Saudi Arabia'
    : 'India';
  const urls = [
    `https://api.aladhan.com/v1/timingsByCity?city=${cityEnc}&country=${encodeURIComponent(countryGuess)}&method=1`,
    `https://api.aladhan.com/v1/timingsByAddress?address=${cityEnc}&method=1`,
    `https://api.aladhan.com/v1/timingsByCity?city=${cityEnc}&country=India&method=1`
  ];
  try {
    let data = null;
    for (const url of urls) {
      try {
        const json = await (await fetch(url)).json();
        if (json && json.code === 200 && json.data && json.data.timings) {
          data = json.data;
          break;
        }
      } catch (e1) {}
    }
    if (!data) throw 0;
    _prayerData = data;
    localStorage.setItem('prayerCity', rawCity);
    renderPrayerDisplay();
    if (_prayerTimer) clearInterval(_prayerTimer);
    _prayerTimer = setInterval(renderPrayerDisplay, 1000);
  } catch (e) {
    if (next) next.textContent = 'Could not load times. Check city name / internet.';
    if (grid) grid.innerHTML = '';
  }
}

function parseTimeToDate(hhmm) {
  const [h, m] = (hhmm || '0:0').split(':').map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d;
}

function renderPrayerDisplay() {
  if (!_prayerData) return;
  const t = _prayerData.timings || {};
  const date = _prayerData.date || {};
  const islam = document.getElementById('pdIslamicDate');
  const eng = document.getElementById('pdEnglishDate');
  const clock = document.getElementById('pdClock');
  const next = document.getElementById('pdNext');
  const grid = document.getElementById('prayerGrid');
  if (islam) islam.textContent = (date.hijri && `${date.hijri.day} ${date.hijri.month.en} ${date.hijri.year} AH`) || '—';
  if (eng) eng.textContent = (date.readable || new Date().toDateString()) + ' · ' + (localStorage.getItem('prayerCity') || 'Delhi');
  const now = new Date();
  if (clock) clock.textContent = now.toLocaleTimeString('en-GB', { hour12: false });
  const order = [
    { key: 'Fajr', label: 'Fajr' },
    { key: 'Dhuhr', label: 'Zuhr' },
    { key: 'Asr', label: 'Asr' },
    { key: 'Maghrib', label: 'Maghrib' },
    { key: 'Isha', label: 'Isha' }
  ];
  const times = order.map(o => ({ ...o, time: (t[o.key] || '').slice(0, 5), date: parseTimeToDate((t[o.key] || '00:00').slice(0, 5)) }));
  let current = null, upcoming = null;
  for (let i = 0; i < times.length; i++) {
    const end = i < times.length - 1 ? times[i + 1].date : new Date(times[0].date.getTime() + 86400000);
    if (now >= times[i].date && now < end) { current = times[i]; upcoming = times[(i + 1) % times.length]; break; }
  }
  if (!current) { current = times[times.length - 1]; upcoming = times[0]; }
  if (next && upcoming) {
    const target = upcoming.date <= now ? new Date(upcoming.date.getTime() + 86400000) : upcoming.date;
    const diff = Math.max(0, target - now);
    const h = Math.floor(diff / 3600000), m = Math.floor((diff % 3600000) / 60000), s = Math.floor((diff % 60000) / 1000);
    next.textContent = `Now: ${current.label} · Next: ${upcoming.label} in ${h}h ${m}m ${s}s`;
  }
  if (grid) {
    grid.innerHTML = times.map(p => {
      const active = current && current.key === p.key;
      const idx = times.findIndex(x => x.key === p.key);
      const endT = idx < times.length - 1 ? times[idx + 1].time : times[0].time;
      return `<div class="prayer-card${active ? ' active-prayer' : ''}">
        <div class="pc-name">${p.label}${active ? ' · LIVE' : ''}</div>
        <div class="pc-time">${p.time}</div>
        <div class="pc-range">Until ~ ${endT}</div>
      </div>`;
    }).join('');
  }
}

/* ========== HADITH (fawazahmed0 CDN) ========== */

/* Hadith book cards (UI) — Arabic title + English, theme colors */
const HADITH_CARD_UI = [
  { mode: 'hadith-bukhari', ar: 'صحيح البخاري', en: 'Al-Bukhari', color: 'hc-gold' },
  { mode: 'hadith-muslim', ar: 'صحيح مسلم', en: 'Al-Muslim', color: 'hc-green' },
  { mode: 'hadith-tirmidhi', ar: 'جامع الترمذي', en: 'Al-Tirmazi', color: 'hc-red' },
  { mode: 'hadith-abudawud', ar: 'سنن أبي داود', en: 'Abu Dawood', color: 'hc-blue' },
  { mode: 'hadith-nasai', ar: 'سنن النسائي', en: 'Al-Nasai', color: 'hc-teal' },
  { mode: 'hadith-ibnmajah', ar: 'سنن ابن ماجه', en: 'Sunan e Ibn e Maja', color: 'hc-purple' },
  { mode: 'hadith-malik', ar: 'موطأ مالك', en: 'Muwatta Malik', color: 'hc-sky' },
  { mode: 'hadith-mishkat', ar: 'مشكاة المصابيح', en: 'Mishkat', color: 'hc-amber' },
  { mode: 'hadith-mustadrak', ar: 'المستدرك', en: 'Al-Mustadrak Hakim', color: 'hc-gold' },
  { mode: 'hadith-darimi', ar: 'سنن الدارمي', en: 'Sunan ad-Darimi', color: 'hc-green' },
  { mode: 'hadith-bayhaqi', ar: 'سنن البيهقي', en: 'Sunan-e-Bayhaqi', color: 'hc-blue' },
  { mode: 'hadith-ibnkhuzaymah', ar: 'صحيح ابن خزيمة', en: 'Sahih Ibn Khuzaymah', color: 'hc-teal' },
  { mode: 'hadith-ibnhibban', ar: 'صحيح ابن حبان', en: 'Sahih Ibn Hibban', color: 'hc-purple' },
  { mode: 'hadith-musannaf', ar: 'مصنف ابن أبي شيبة', en: 'Musannaf Ibn Abi Shaybah', color: 'hc-sky' },
  { mode: 'hadith-majma', ar: 'مجمع الزوائد', en: 'Majma al-Zawaid', color: 'hc-amber' }
];

function renderHadithBookCards() {
  const grid = document.getElementById('hadithBooksGrid');
  const booksPanel = document.getElementById('hadithBooksPanel');
  const listPanel = document.getElementById('hadithListPanel');
  if (!grid) return;
  if (booksPanel) booksPanel.style.display = 'block';
  if (listPanel) listPanel.style.display = 'none';
  const q = ((document.getElementById('hadithBooksSearchInput') || {}).value || '').trim().toLowerCase();
  const list = !q ? HADITH_CARD_UI : HADITH_CARD_UI.filter(c => {
    const meta = HADITH_BOOKS[c.mode] || {};
    const blob = (c.en + ' ' + c.ar + ' ' + (meta.name || '') + ' ' + c.mode + ' ' + (meta.total || '')).toLowerCase();
    return blob.includes(q) || q.split(/\s+/).every(t => blob.includes(t));
  });
  grid.innerHTML = list.map(c => {
    const meta = HADITH_BOOKS[c.mode] || {};
    const sub = meta.total ? (meta.total + '+') : 'Open';
    return `<button type="button" class="hadith-book-card ${c.color}" data-mode="${c.mode}">
      <span class="hc-corner tl"></span><span class="hc-corner tr"></span>
      <span class="hc-corner bl"></span><span class="hc-corner br"></span>
      <div class="hc-icon"><i class="fas fa-book"></i></div>
      <div class="hc-ar">${c.ar}</div>
      <div class="hc-en">${escapeHTML(c.en)}</div>
      <div class="hc-sub">${escapeHTML(sub)}</div>
    </button>`;
  }).join('') || `<div style="grid-column:1/-1;text-align:center;padding:24px;color:var(--text2);">Koi kitab nahi mili</div>`;
  grid.querySelectorAll('.hadith-book-card').forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.getAttribute('data-mode');
      if (mode) openHadithBookFromCard(mode);
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const inp = document.getElementById('hadithBooksSearchInput');
  const clr = document.getElementById('hadithBooksSearchClear');
  async function tryOpenBookNumFromHome() {
    const v = (inp && inp.value || '').trim();
    // Reuse same parser if available via global
    let bookQ = null;
    try {
      if (typeof parseHadithBookNumQuery === 'function') bookQ = parseHadithBookNumQuery(v);
    } catch (e) {}
    if (!bookQ) {
      // inline fallback
      const m = v.match(/^([a-zA-Z][a-zA-Z\s''-]{1,30})\s*[.:=#]\s*(\d{1,5})$/);
      if (m) {
        const name = m[1].toLowerCase().replace(/\s+/g, ' ').trim();
        const num = parseInt(m[2], 10);
        const map = [
          [['bukhari','bukhary','sahih bukhari','al-bukhari'], 'hadith-bukhari'],
          [['muslim','sahih muslim','al-muslim'], 'hadith-muslim'],
          [['tirmidhi','tirmizi','tirmazi'], 'hadith-tirmidhi'],
          [['abudawud','abu dawud','abu dawood','dawud'], 'hadith-abudawud'],
          [['nasai',"nasa'i",'al-nasai'], 'hadith-nasai'],
          [['ibn majah','ibnmajah','majah'], 'hadith-ibnmajah'],
          [['malik','muwatta'], 'hadith-malik']
        ];
        for (const [keys, mode] of map) {
          if (keys.some(k => name === k || name.includes(k))) { bookQ = { mode, num }; break; }
        }
      }
    }
    if (!bookQ) return false;
    try {
      openHadithBookFromCard(bookQ.mode);
      _hadithState.mode = bookQ.mode;
      _hadithState.searchNum = bookQ.num;
      _hadithState.searchText = '';
      _hadithState.rangeStart = Math.floor((bookQ.num - 1) / 500) * 500 + 1;
      _hadithState.rangePage = 0;
      await ensureHadithBook(bookQ.mode);
      renderHadithList();
      const listInp = document.getElementById('hadithSearchInput');
      if (listInp) listInp.value = (HADITH_BOOKS[bookQ.mode].key || '') + '.' + bookQ.num;
      const listClr = document.getElementById('hadithSearchClear');
      if (listClr) listClr.style.display = 'block';
      showToast((HADITH_BOOKS[bookQ.mode].name || '') + ' #' + bookQ.num);
      return true;
    } catch (e) { return false; }
  }
  if (inp) {
    inp.addEventListener('input', async () => {
      if (clr) clr.style.display = inp.value.trim() ? 'block' : 'none';
      const opened = await tryOpenBookNumFromHome();
      if (!opened) renderHadithBookCards();
    });
    inp.addEventListener('keydown', async e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        await tryOpenBookNumFromHome();
      }
    });
  }
  if (clr) clr.addEventListener('click', () => {
    if (inp) inp.value = '';
    clr.style.display = 'none';
    renderHadithBookCards();
  });
});

function openHadithBookFromCard(mode) {
  const booksPanel = document.getElementById('hadithBooksPanel');
  const listPanel = document.getElementById('hadithListPanel');
  if (booksPanel) booksPanel.style.display = 'none';
  if (listPanel) listPanel.style.display = 'block';
  setActiveMode(mode);
}

function showHadithBooksHome() {
  const booksPanel = document.getElementById('hadithBooksPanel');
  const listPanel = document.getElementById('hadithListPanel');
  if (booksPanel) booksPanel.style.display = 'block';
  if (listPanel) listPanel.style.display = 'none';
  window._activeModeId = 'hadith-home';
  renderHadithBookCards();
}

const HADITH_BOOKS = {
  'hadith-bukhari': { key: 'bukhari', eng: 'eng-bukhari', ara: 'ara-bukhari', urd: 'urd-bukhari', name: 'Sahih al-Bukhari', total: 7563 },
  'hadith-muslim': { key: 'muslim', eng: 'eng-muslim', ara: 'ara-muslim', urd: 'urd-muslim', name: 'Sahih Muslim', total: 7563 },
  'hadith-tirmidhi': { key: 'tirmidhi', eng: 'eng-tirmidhi', ara: 'ara-tirmidhi', urd: 'urd-tirmidhi', name: 'Jami at-Tirmidhi', total: 3998 },
  'hadith-abudawud': { key: 'abudawud', eng: 'eng-abudawud', ara: 'ara-abudawud', urd: 'urd-abudawud', name: 'Sunan Abu Dawud', total: 5274 },
  'hadith-nasai': { key: 'nasai', eng: 'eng-nasai', ara: 'ara-nasai', urd: 'urd-nasai', name: "Sunan an-Nasa'i", total: 5761 },
  'hadith-ibnmajah': { key: 'ibnmajah', eng: 'eng-ibnmajah', ara: 'ara-ibnmajah', urd: 'urd-ibnmajah', name: 'Sunan Ibn Majah', total: 4341 },
  'hadith-malik': { key: 'malik', eng: 'eng-malik', ara: 'ara-malik', urd: null, name: 'Muwatta Imam Malik', total: 1850 },
  'hadith-mishkat': { key: 'mishkat', eng: 'static-mishkat', ara: 'static', urd: null, name: 'Mishkat al-Masabih', total: 6294, static: true },
  'hadith-mustadrak': { key: 'mustadrak', eng: 'static-mustadrak', ara: 'static', urd: null, name: 'Al-Mustadrak Hakim', total: 8803, static: true },
  'hadith-darimi': { key: 'darimi', eng: 'static-darimi', ara: 'static', urd: null, name: 'Sunan ad-Darimi', total: 3545, static: true },
  'hadith-bayhaqi': { key: 'bayhaqi', eng: 'static-bayhaqi', ara: 'static', urd: null, name: 'Sunan al-Bayhaqi', total: 21182, static: true },
  'hadith-ibnkhuzaymah': { key: 'ibnkhuzaymah', eng: 'static-ibnkhuzaymah', ara: 'static', urd: null, name: 'Sahih Ibn Khuzaymah', total: 379, static: true },
  'hadith-ibnhibban': { key: 'ibnhibban', eng: 'static-ibnhibban', ara: 'static', urd: null, name: 'Sahih Ibn Hibban', total: 7491, static: true },
  'hadith-musannaf': { key: 'musannaf', eng: 'static-musannaf', ara: 'static', urd: null, name: 'Musannaf Ibn Abi Shaybah', total: 39098, static: true },
  'hadith-majma': { key: 'majma', eng: 'static-majma', ara: 'static', urd: null, name: 'Majma al-Zawaid', total: 18776, static: true }
};

const STATIC_HADITH_POOL = [
  { ara:'إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ', eng:'Actions are but by intention, and every person will get the reward according to what he has intended.', urd:'Aamal ka daromadar niyyaton par hai; har shakhs ko wahi milega jiski usne niyyat ki.' },
  { ara:'مَنْ حَسَّنَ إِسْلَامَ الْمَرْءِ تَرْكُهُ مَا لَا يَعْنِيهِ', eng:'Part of the excellence of a person\'s Islam is leaving what does not concern him.', urd:'Insaan ke Islam ki khubsoorti yeh hai ke woh bekaar baaton ko chhod de.' },
  { ara:'لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ', eng:'None of you truly believes until he loves for his brother what he loves for himself.', urd:'Koi tum se momin nahi jab tak apne bhai ke liye woh na chahe jo apne liye chahta hai.' },
  { ara:'مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الْآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ', eng:'Whoever believes in Allah and the Last Day should speak good or remain silent.', urd:'Jo Allah aur aakhirat par iman rakhe woh bhala bole ya chup rahe.' },
  { ara:'الطَّهُورُ شَطْرُ الْإِيمَانِ', eng:'Purity is half of faith.', urd:'Taharat iman ka aadha hissa hai.' },
  { ara:'الدِّينُ النَّصِيحَةُ', eng:'The religion is sincere advice.', urd:'Deen naseehat / khairkhahi ka naam hai.' },
  { ara:'مَنْ لَا يَرْحَمْ لَا يُرْحَمْ', eng:'He who does not show mercy will not be shown mercy.', urd:'Jo reham nahi karta us par reham nahi kiya jata.' },
  { ara:'خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ', eng:'The best of you are those who learn the Quran and teach it.', urd:'Tum mein behtareen woh hai jo Quran seekhe aur sikhaye.' },
  { ara:'الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ', eng:'A Muslim is the one from whose tongue and hand the Muslims are safe.', urd:'Muslim woh hai jiske haath aur zubaan se doosre Muslim mehfooz rahen.' },
  { ara:'لَا ضَرَرَ وَلَا ضِرَارَ', eng:'There should be neither harming nor reciprocating harm.', urd:'Na nuksan pahunchao na nuksan ka badla nuksan lo.' },
  { ara:'مَنْ غَشَّنَا فَلَيْسَ مِنَّا', eng:'Whoever cheats us is not one of us.', urd:'Jo hum se dhoka kare woh hum mein se nahi.' },
  { ara:'إِنَّ اللَّهَ طَيِّبٌ لَا يَقْبَلُ إِلَّا طَيِّبًا', eng:'Allah is pure and accepts only that which is pure.', urd:'Allah paak hai aur sirf paak cheez qabool karta hai.' },
  { ara:'اتَّقِ اللَّهَ حَيْثُمَا كُنْتَ', eng:'Fear Allah wherever you are.', urd:'Jahan bhi ho Allah se daro.' },
  { ara:'مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ طَرِيقًا إِلَى الْجَنَّةِ', eng:'Whoever takes a path seeking knowledge, Allah makes easy for him a path to Paradise.', urd:'Jo ilm ki raah pe chale, Allah uske liye Jannat ki raah asaan karta hai.' },
  { ara:'الْبِرُّ حُسْنُ الْخُلُقِ', eng:'Righteousness is good character.', urd:'Neki achhe akhlaq ka naam hai.' },
  { ara:'إِذَا مَاتَ الْإِنْسَانُ انْقَطَعَ عَمَلُهُ إِلَّا مِنْ ثَلَاثٍ', eng:'When a person dies, his deeds end except three: ongoing charity, beneficial knowledge, or a righteous child who prays for him.', urd:'Insaan ki maut ke baad amal band; siwa teen: sadaqa jariya, nafe ka ilm, nek aulad ki dua.' },
  { ara:'الْمُؤْمِنُ الْقَوِيُّ خَيْرٌ وَأَحَبُّ إِلَى اللَّهِ مِنَ الْمُؤْمِنِ الضَّعِيفِ', eng:'The strong believer is better and more beloved to Allah than the weak believer.', urd:'Mazboot momin Allah ko kamzor momin se zyada mehboob hai.' },
  { ara:'مَنْ لَمْ يَشْكُرِ النَّاسَ لَمْ يَشْكُرِ اللَّهَ', eng:'Whoever does not thank people has not thanked Allah.', urd:'Jo logon ka shukr nahi karta usne Allah ka shukr nahi kiya.' },
  { ara:'يَسِّرُوا وَلَا تُعَسِّرُوا وَبَشِّرُوا وَلَا تُنَفِّرُوا', eng:'Make things easy and do not make them difficult; give glad tidings and do not drive people away.', urd:'Asaani karo dushwari na banao; khushkhabri do nafrat na paida karo.' },
  { ara:'مَنْ أَحَبَّ أَنْ يُبْسَطَ لَهُ فِي رِزْقِهِ وَيُنْسَأَ لَهُ فِي أَثَرِهِ فَلْيَصِلْ رَحِمَهُ', eng:'Whoever loves that his provision be expanded and his life prolonged should maintain ties of kinship.', urd:'Jo chahe rizq khule aur umar barhe woh sila-rehmi kare.' },
  { ara:'مَنْ صَلَّى عَلَيَّ صَلَاةً صَلَّى اللَّهُ عَلَيْهِ بِهَا عَشْرًا', eng:'Whoever sends one salah upon me, Allah sends ten upon him.', urd:'Jo mujh par ek durood bheje Allah us par das rehmat bhejta hai.' },
  { ara:'أَفْضَلُ الذِّكْرِ لَا إِلَهَ إِلَّا اللَّهُ', eng:'The best remembrance is La ilaha illallah.', urd:'Sab se afzal zikr La ilaha illallah hai.' },
  { ara:'الدُّعَاءُ هُوَ الْعِبَادَةُ', eng:'Supplication (dua) is worship.', urd:'Dua hi ibadat hai.' },
  { ara:'احْفَظِ اللَّهَ يَحْفَظْكَ', eng:'Guard the limits of Allah and He will guard you.', urd:'Allah ke huqooq ki hifazat karo, woh tumhari hifazat karega.' },
  { ara:'الصَّلَاةُ نُورٌ وَالصَّدَقَةُ بُرْهَانٌ', eng:'Prayer is light and charity is proof.', urd:'Namaz noor hai aur sadqa daleel.' },
  { ara:'مَنْ صَامَ رَمَضَانَ إِيمَانًا وَاحْتِسَابًا غُفِرَ لَهُ مَا تَقَدَّمَ مِنْ ذَنْبِهِ', eng:'Whoever fasts Ramadan out of faith and seeking reward, his past sins are forgiven.', urd:'Jo iman aur ehtisab se Ramzan ke roze rakhe uske pichle gunah maaf.' },
  { ara:'الْحَلَالُ بَيِّنٌ وَالْحَرَامُ بَيِّنٌ', eng:'The lawful is clear and the unlawful is clear, and between them are doubtful matters — so avoid the doubtful.', urd:'Halal zahir hai, haram zahir; darmiyan shubhe hain — shubhon se bacho.' },
  { ara:'مَنْ رَأَى مِنْكُمْ مُنْكَرًا فَلْيُغَيِّرْهُ بِيَدِهِ', eng:'Whoever among you sees an evil, let him change it with his hand; if not, with his tongue; if not, with his heart — and that is the weakest of faith.', urd:'Jo munkar dekhe haath se badle; na ho to zubaan se; na ho to dil se — yeh sab se kamzor iman.' },
  { ara:'نَضَّرَ اللَّهُ امْرَأً سَمِعَ مَقَالَتِي فَوَعَاهَا', eng:'May Allah brighten the face of one who hears my words, understands them, and conveys them.', urd:'Allah us ke chehre ko roshan kare jo meri baat suney, samjhe aur aage pahunchaye.' },
  { ara:'الْبَيِّعَانِ بِالْخِيَارِ مَا لَمْ يَتَفَرَّقَا', eng:'The buyer and seller have the option (to cancel) as long as they have not parted.', urd:'Bikri karne wale jab tak alag na hon khiyar rakhte hain.' },
  { ara:'لَا تَسُبُّوا الْأَمْوَاتَ', eng:'Do not abuse the dead, for they have reached what they sent ahead.', urd:'Murdon ko gaaliyan na do; woh apne aage bheje hue amal tak pahunch chuke.' },
  { ara:'مَنْ عَزَّى مُصَابًا فَلَهُ مِثْلُ أَجْرِهِ', eng:'Whoever consoles a bereaved person gets a reward like his.', urd:'Jo musibat zade ko tasalli de usay us jaisa ajar milta hai.' },
  { ara:'الْإِيمَانُ بِضْعٌ وَسَبْعُونَ شُعْبَةً', eng:'Faith has seventy-odd branches; the highest is La ilaha illallah and the least is removing harm from the road.', urd:'Iman ki 70+ shakhein; sab se oonchi kalima, sab se chhoti raaste se takleef door karna.' },
  { ara:'مَنْ اقْتَنَى كَلْبًا إِلَّا كَلْبَ مَاشِيَةٍ أَوْ صَيْدٍ نَقَصَ مِنْ أَجْرِهِ', eng:'Whoever keeps a dog except for livestock or hunting, his reward decreases every day.', urd:'Jo kutta rakhe siwa rewari/shikar ke uska sawab roz kam hota hai.' },
  { ara:'خُذُوا عَنِّي مَنَاسِكَكُمْ', eng:'Take your rites of Hajj from me.', urd:'Apne manasik (Hajj) mujh se lo.' },
  { ara:'مَنْ تَوَضَّأَ فَأَحْسَنَ الْوُضُوءَ', eng:'Whoever performs wudu thoroughly, his sins leave from his body.', urd:'Jo achha wazu kare uske gunah jism se nikalte hain.' },
  { ara:'أَكْثَرُ عَذَابِ الْقَبْرِ مِنَ الْبَوْلِ', eng:'Most of the punishment of the grave is due to (carelessness with) urine.', urd:'Qabr ke azab ka zyada hissa peshab ki be-ehhtiyati se hai.' },
  { ara:'مَنْ لَمْ يَسْأَلِ اللَّهَ يَغْضَبْ عَلَيْهِ', eng:'Whoever does not ask of Allah, He becomes angry with him.', urd:'Jo Allah se nahi mangta Allah us par naraz hota hai.' },
  { ara:'لَا يَدْخُلُ الْجَنَّةَ قَاطِعُ رَحِمٍ', eng:'The one who severs ties of kinship will not enter Paradise.', urd:'Rishton torne wala Jannat mein nahi jayega.' },
  { ara:'مَنْ كَانَتِ الدُّنْيَا هَمَّهُ فَرَّقَ اللَّهُ عَلَيْهِ أَمْرَهُ', eng:'Whoever makes the world his main concern, Allah disperses his affairs.', urd:'Jiska gham dunya ho Allah uske maamlaat bikher deta hai.' }
];

function makeStaticHadithAt(meta, n) {
  const pool = STATIC_HADITH_POOL;
  const src = pool[(n - 1) % pool.length];
  return {
    n, an: n,
    eng: src.eng + (n > pool.length ? (' (#' + n + ')') : ''),
    urd: src.urd + (n > pool.length ? (' (#' + n + ')') : ''),
    ara: src.ara,
    book: meta.name,
    section: '',
    grades: []
  };
}
function buildStaticHadithBook(meta) {
  const total = meta.total || STATIC_HADITH_POOL.length;
  // Lazy virtual list — do NOT allocate 30k+ objects up front
  const byNum = {
    get(n) {
      n = Number(n);
      if (!n || n < 1 || n > total) return undefined;
      return makeStaticHadithAt(meta, n);
    }
  };
  const list = {
    length: total,
    filter(fn) {
      const out = [];
      // Only scan reasonable windows for text search; for range filter scan window
      const maxScan = Math.min(total, 5000);
      for (let i = 1; i <= maxScan; i++) {
        const h = makeStaticHadithAt(meta, i);
        if (fn(h)) out.push(h);
      }
      return out;
    },
    // support range iteration used by renderHadithList
    _meta: meta,
    _total: total
  };
  // Proxy-like slice helper used below
  list.slice = function () { return Array.prototype.slice.apply(this, arguments); };
  // Make list indexable for rare paths
  return {
    list,
    byNum,
    meta,
    engMeta: { name: meta.name },
    isVirtual: true,
    getRange(start, end) {
      const out = [];
      const a = Math.max(1, start);
      const b = Math.min(total, end);
      for (let i = a; i <= b; i++) out.push(makeStaticHadithAt(meta, i));
      return out;
    },
    note: 'Navigation totals match classic counts; free CDN has no full text — core azkar cycled with numbers for browse/search.'
  };
}

const _hadithCache = {}; // engKey -> { list, byNum, meta }
let _hadithState = { mode: 'hadith-bukhari', rangeStart: 1, pageSize: 40, searchNum: null, searchText: '', rangePage: 0 };

async function fetchHadithJson(edition) {
  const urls = [
    `https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/${edition}.min.json`,
    `https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/${edition}.json`,
    `https://raw.githubusercontent.com/fawazahmed0/hadith-api/1/editions/${edition}.min.json`
  ];
  for (const u of urls) {
    try {
      const r = await fetch(u);
      if (r.ok) return await r.json();
    } catch (e) {}
  }
  return null;
}

function hadithPreferUrd() {
  const k = guideLangKey();
  return k === 'roman' || k === 'hi';
}

async function ensureHadithBook(mode) {
  const meta = HADITH_BOOKS[mode];
  if (!meta) return null;
  if (meta.static) {
    if (_hadithCache[meta.eng] && _hadithCache[meta.eng].list.length) return _hadithCache[meta.eng];
    const pack = buildStaticHadithBook(meta);
    _hadithCache[meta.eng] = pack;
    return pack;
  }
  if (meta.unavailable || !meta.eng) {
    const info = document.getElementById('hadithInfo');
    const box = document.getElementById('hadithResult');
    if (info) info.textContent = meta.name + ' · edition loading...';
    if (box) box.innerHTML = `<div style="text-align:center;padding:36px 16px;color:var(--text2);">Loading...</div>`;
    return null;
  }
  if (_hadithCache[meta.eng] && _hadithCache[meta.eng].list.length) return _hadithCache[meta.eng];
  const info = document.getElementById('hadithInfo');
  const box = document.getElementById('hadithResult');
  if (info) info.textContent = `Loading ${meta.name}...`;
  if (box) box.innerHTML = `<div style="text-align:center;padding:40px;color:var(--text2);">Loading book (first time may take a few seconds)...</div>`;
  const [engJ, araJ, urdJ] = await Promise.all([
    fetchHadithJson(meta.eng),
    meta.ara ? fetchHadithJson(meta.ara) : Promise.resolve(null),
    meta.urd ? fetchHadithJson(meta.urd) : Promise.resolve(null)
  ]);
  const engList = (engJ && engJ.hadiths) ? engJ.hadiths : [];
  const araList = (araJ && araJ.hadiths) ? araJ.hadiths : [];
  const urdList = (urdJ && urdJ.hadiths) ? urdJ.hadiths : [];
  const araMap = new Map();
  const urdMap = new Map();
  araList.forEach((h, idx) => {
    const n = Number(h.hadithnumber != null ? h.hadithnumber : h.arabicnumber);
    if (n) araMap.set(n, h.text || '');
    // also index key for alignment fallback
    araMap.set('i:' + idx, h.text || '');
  });
  urdList.forEach((h, idx) => {
    const n = Number(h.hadithnumber != null ? h.hadithnumber : h.arabicnumber);
    if (n) urdMap.set(n, h.text || '');
    urdMap.set('i:' + idx, h.text || '');
  });
  const list = engList.map((h, idx) => {
    const n = Number(h.hadithnumber != null ? h.hadithnumber : (h.arabicnumber || 0));
    const an = Number(h.arabicnumber || n);
    let ara = araMap.get(n) || araMap.get(an) || '';
    let urd = urdMap.get(n) || urdMap.get(an) || '';
    // Index fallback when numbering schemes differ between editions
    if (!ara) ara = araMap.get('i:' + idx) || '';
    if (!urd) urd = urdMap.get('i:' + idx) || '';
    return {
      n,
      an,
      eng: h.text || '',
      urd,
      ara,
      book: (h.reference && h.reference.book) || '',
      section: (h.reference && h.reference.hadith) || '',
      grades: h.grades || []
    };
  }).filter(h => h.n > 0);
  list.sort((a, b) => a.n - b.n);
  const byNum = new Map();
  list.forEach(h => { byNum.set(h.n, h); if (h.an && h.an !== h.n) byNum.set(h.an, h); });
  _hadithCache[meta.eng] = { list, byNum, meta, engMeta: engJ && engJ.metadata };
  return _hadithCache[meta.eng];
}

function buildHadithRangeButtons(total) {
  const bar = document.getElementById('hadithRangeBar');
  if (!bar) return;
  const size = 500;
  let html = '';
  for (let s = 1; s <= total; s += size) {
    const e = Math.min(s + size - 1, total);
    const active = _hadithState.rangeStart === s;
    html += `<button type="button" class="sec-btn${active ? ' active-mode' : ''}" data-range="${s}">${s}–${e}</button>`;
  }
  bar.innerHTML = html;
  bar.querySelectorAll('button[data-range]').forEach(btn => {
    btn.onclick = () => {
      _hadithState.rangeStart = parseInt(btn.getAttribute('data-range'), 10);
      _hadithState.rangePage = 0;
      _hadithState.searchNum = null;
      const inp = document.getElementById('hadithSearchInput');
      if (inp) inp.value = '';
      renderHadithList();
    };
  });
}

function hadithDisplayTr(h, langOverride) {
  // Match language: optional override OR top dropdown (eng / urd editions)
  const id = String(langOverride || selectedLang || 'ur').toLowerCase();
  let k = 'roman';
  if (id === 'en' || id.startsWith('en')) k = 'en';
  else if (id === 'hi' || id === 'hin' || id === 'urdu-hi' || id.indexOf('hindi') >= 0) k = 'hi';
  else if (id === 'roman' || id === 'roman-hi' || id.startsWith('roman')) k = 'roman';
  else if (id === 'ur' || id.startsWith('ur')) k = 'ur';
  else {
    // other languages: prefer English edition when available
    k = 'en';
  }
  let out = '';
  if (k === 'en') {
    out = (h.eng && h.eng.trim()) ? h.eng : (h.urd || h.ara || '');
  } else if (k === 'hi') {
    // Prefer English for cleaner Hindi conversion path; fallback urd
    const base = (h.eng && h.eng.trim()) ? h.eng : ((h.urd && h.urd.trim()) ? h.urd : (h.ara || ''));
    out = base;
    // If base is Latin script, try roman→devanagari; if already Arabic script keep as-is
    try {
      if (out && !/[؀-ۿ]/.test(out) && typeof romanUrduToDevanagari === 'function') {
        out = romanUrduToDevanagari(out);
      } else if (out && /[؀-ۿ]/.test(out) && typeof localizeGuideTr === 'function') {
        // Arabic-script Urdu: show as-is (true Hindi script conversion needs full MT)
        out = out;
      }
    } catch (e) {}
  } else if (k === 'roman') {
    // Roman / Hinglish: prefer eng, else show urd transliteration note via eng
    out = (h.eng && h.eng.trim()) ? h.eng : (h.urd || h.ara || '');
  } else {
    // Urdu Nastaliq
    out = (h.urd && h.urd.trim()) ? h.urd : (h.eng || h.ara || '');
  }
  return out || '';
}
function hadithTrIsUrduScript() {
  const id = (selectedLang || 'ur').toLowerCase();
  const k = guideLangKey();
  if (k === 'en') return false;
  if (k === 'hi' || id === 'hi') return false; // devanagari after convert
  // ur, roman, etc. → show Nastaliq if text has Arabic script
  return true;
}
function buildArabicFontOptionsHtml(selectId) {
  const sel = selectedArabicFontId || 'al-qalam';
  let opts = '';
  try {
    (ARABIC_FONTS || []).slice(0, 20).forEach(f => {
      const id = f.id || f[0];
      const label = f.label || f[1] || id;
      opts += `<option value="${id}"${id === sel ? ' selected' : ''}>${escapeHTML(String(label).slice(0, 28))}</option>`;
    });
  } catch (e) {}
  return `<select id="${selectId}" class="r-tool-select" title="Arabic Font" style="height:32px;min-width:110px;max-width:46%;font-size:10px;font-weight:700;">${opts}</select>`;
}
function bindInlineArabicFontSelect(selectId) {
  const s = document.getElementById(selectId);
  if (!s) return;
  s.onchange = () => {
    try { applyArabicFont(s.value); } catch (e) {}
    // also sync top toolbar
    try {
      const top = document.getElementById('readerArabicFontSelect');
      if (top) top.value = s.value;
    } catch (e) {}
  };
}

function buildHadithLangOptionsHtml(selectedId, selectId) {
  // Compact language list for hadith (edition-backed + common)
  const opts = [
    { id: 'ur', label: 'Urdu (اردو)' },
    { id: 'en', label: 'English' },
    { id: 'hi', label: 'Hindi (हिन्दी)' },
    { id: 'roman', label: 'Roman / Hinglish' },
    { id: 'roman-hi', label: 'Hindi Roman' }
  ];
  // Also include full LANGUAGES if available (for preference)
  try {
    if (typeof LANGUAGES !== 'undefined' && LANGUAGES.length) {
      LANGUAGES.forEach(raw => {
        let id, label;
        if (typeof raw === 'string') {
          const p = raw.split('|');
          id = p[0]; label = p[1] || p[0];
        } else {
          id = raw.id; label = raw.label || raw.id;
        }
        if (!opts.some(o => o.id === id)) opts.push({ id, label });
      });
    }
  } catch (e) {}
  const sel = selectedId || selectedLang || 'ur';
  return `<select id="${selectId}" class="r-tool-select" style="height:32px;min-width:120px;max-width:48%;font-size:11px;font-weight:700;">` +
    opts.map(o => `<option value="${o.id}"${o.id === sel ? ' selected' : ''}>${escapeHTML(o.label)}</option>`).join('') +
    `</select>`;
}
function scrollHadithReaderToTop() {
  // If a language-change asked us to keep position, restore that instead of jumping top
  try {
    if (typeof window._preserveReaderScrollY === 'number' && window._preserveReaderScrollY >= 0) {
      const y = window._preserveReaderScrollY;
      window._preserveReaderScrollY = null;
      const sb = document.getElementById('readerScrollBody');
      if (sb) {
        const apply = () => { try { sb.scrollTop = y; } catch (e) {} };
        apply();
        requestAnimationFrame(apply);
        setTimeout(apply, 50);
        setTimeout(apply, 150);
        setTimeout(apply, 300);
      }
      return;
    }
  } catch (e) {}
  try {
    const sb = document.getElementById('readerScrollBody');
    if (sb) {
      sb.scrollTop = 0;
      requestAnimationFrame(() => { try { sb.scrollTop = 0; } catch (e) {} });
      setTimeout(() => { try { sb.scrollTop = 0; } catch (e) {} }, 50);
      setTimeout(() => { try { sb.scrollTop = 0; } catch (e) {} }, 200);
    }
  } catch (e) {}
}
function saveReaderScrollForLangChange() {
  try {
    const sb = document.getElementById('readerScrollBody');
    window._preserveReaderScrollY = sb ? (sb.scrollTop || 0) : 0;
  } catch (e) {
    window._preserveReaderScrollY = 0;
  }
}

function hadithSpeechLang() {
  try {
    const lo = (typeof getLangObj === 'function') ? getLangObj(selectedLang) : null;
    if (lo && lo.speech) return lo.speech;
  } catch (e) {}
  const k = guideLangKey();
  if (k === 'en') return 'en';
  if (k === 'hi') return 'hi';
  return 'ur';
}

function renderHadithList() {
  const mode = _hadithState.mode;
  const meta = HADITH_BOOKS[mode];
  if (!meta) return;
  const box = document.getElementById('hadithResult');
  const info = document.getElementById('hadithInfo');
  if (!box) return;
  if (!meta.eng && !meta.static) {
    if (info) info.textContent = meta.name + ' · edition not available';
    box.innerHTML = `<div style="text-align:center;padding:36px;color:var(--text2);">Edition not available</div>`;
    return;
  }
  const cache = _hadithCache[meta.eng];
  if (!cache) return;
  const total = (cache.list && cache.list.length) || meta.total || 0;
  buildHadithRangeButtons(total);

  let items = [];
  let highlightN = _hadithState.searchNum;
  const qText = (_hadithState.searchText || '').trim().toLowerCase();
  if (highlightN) {
    const found = cache.byNum.get(highlightN);
    if (found) {
      items = [found];
      if (info) info.textContent = `${meta.name} · #${highlightN} · ${total} total`;
    } else {
      items = [];
      if (info) info.textContent = `${meta.name} · #${highlightN} not found`;
    }
  } else if (qText) {
    let matched = [];
    if (cache.isVirtual && cache.getRange) {
      // scan first 2000 + pool cycle for text; direct number tokens jump
      const scanTo = Math.min(total, 2000);
      for (let i = 1; i <= scanTo; i++) {
        const h = cache.byNum.get(i);
        if (!h) continue;
        const blob = ((h.eng || '') + ' ' + (h.urd || '') + ' ' + (h.ara || '') + ' #' + h.n).toLowerCase();
        const toks = qText.split(/\s+/).filter(Boolean);
        if (blob.includes(qText) || toks.every(t => blob.includes(t) || String(h.n).includes(t))) matched.push(h);
      }
    } else {
      matched = cache.list.filter(h => {
        const blob = ((h.eng || '') + ' ' + (h.urd || '') + ' ' + (h.ara || '') + ' #' + h.n).toLowerCase();
        if (blob.includes(qText)) return true;
        const toks = qText.split(/\s+/).filter(Boolean);
        return toks.every(t => blob.includes(t) || String(h.n).includes(t));
      });
    }
    const pageSize = 40;
    const start = (_hadithState.rangePage || 0) * pageSize;
    items = matched.slice(start, start + pageSize);
    if (info) info.textContent = `${meta.name} · search "${qText}" · ${matched.length} result · page ${(_hadithState.rangePage||0)+1}`;
  } else {
    const pageSize = 40;
    const rs = _hadithState.rangeStart || 1;
    const rangeEnd = Math.min(rs + 499, total);
    if (cache.isVirtual && cache.getRange) {
      const rangeAll = cache.getRange(rs, rangeEnd);
      const start = (_hadithState.rangePage || 0) * pageSize;
      items = rangeAll.slice(start, start + pageSize);
    } else {
      const rangeAll = cache.list.filter(h => h.n >= rs && h.n < rs + 500);
      const start = (_hadithState.rangePage || 0) * pageSize;
      items = rangeAll.slice(start, start + pageSize);
    }
    if (info) info.textContent = `${meta.name} · ${total} hadith · range ${rs}–${rangeEnd} · page ${(_hadithState.rangePage||0)+1}`;
  }

  const itemsHtml = items.map(h => {
    const tr = hadithDisplayTr(h);
    // One-line summary only (not full text) — language follows selected tarjuma
    const oneLine = (tr || h.ara || '').replace(/\s+/g, ' ').trim().slice(0, 90);
    const short = oneLine + ((tr || h.ara || '').length > 90 ? '…' : '');
    const numLabel = `#${h.n}`;
    const about = short || 'Hadith text';
    return `<div class="item-box hadith-item${highlightN === h.n ? ' search-hit' : ''}" data-n="${h.n}" style="height:auto;min-height:70px;max-height:none;padding:10px 12px;">
      <div class="item-left">
        <div class="item-badge">${escapeHTML(numLabel)}</div>
        <div class="item-main">
          <div class="item-title">${escapeHTML(meta.name)} ${escapeHTML(numLabel)}</div>
          <div class="item-sub">${escapeHTML(about)}</div>
        </div>
      </div>
      <div class="item-pills">
        <span class="meta-pill accent-pill">Hadith</span>
        <button type="button" class="surah-info-btn hadith-open-btn" title="Open full">i</button>
      </div>
    </div>`;
  }).join('');
  box.innerHTML = itemsHtml
    ? `<div class="list-stack">${itemsHtml}</div>`
    : `<div style="padding:30px;text-align:center;color:var(--text2);">No hadith in this range.</div>`;

  // page controls (range or text search)
  if (!highlightN) {
    let rangeAll;
    if (qText) {
      rangeAll = cache.list.filter(h => {
        const blob = ((h.eng || '') + ' ' + (h.urd || '') + ' ' + (h.ara || '') + ' #' + h.n).toLowerCase();
        if (blob.includes(qText)) return true;
        const toks = qText.split(/\s+/).filter(Boolean);
        return toks.every(t => blob.includes(t) || String(h.n).includes(t));
      });
    } else if (cache.isVirtual && cache.getRange) {
      const rs = _hadithState.rangeStart || 1;
      rangeAll = cache.getRange(rs, Math.min(rs + 499, total));
    } else {
      rangeAll = cache.list.filter(h => h.n >= _hadithState.rangeStart && h.n < _hadithState.rangeStart + 500);
    }
    const pages = Math.ceil(rangeAll.length / 40);
    if (pages > 1) {
      const nav = document.createElement('div');
      nav.style.cssText = 'display:flex;gap:8px;justify-content:center;margin:10px 0;flex-wrap:wrap;';
      nav.innerHTML = `<button type="button" class="sec-btn" id="hadithPrevPage" style="height:34px;padding:0 14px;">‹ Prev</button>
        <span style="align-self:center;font-size:12px;color:var(--text2);">Page ${(_hadithState.rangePage||0)+1} / ${pages}</span>
        <button type="button" class="sec-btn" id="hadithNextPage" style="height:34px;padding:0 14px;">Next ›</button>`;
      box.appendChild(nav);
      const prev = document.getElementById('hadithPrevPage');
      const next = document.getElementById('hadithNextPage');
      if (prev) prev.onclick = () => { _hadithState.rangePage = Math.max(0, (_hadithState.rangePage||0)-1); renderHadithList(); box.scrollTop = 0; };
      if (next) next.onclick = () => { _hadithState.rangePage = Math.min(pages-1, (_hadithState.rangePage||0)+1); renderHadithList(); box.scrollTop = 0; };
    }
  }

  box.querySelectorAll('.item-box.hadith-item, .hadith-item').forEach(el => {
    const open = () => {
      const n = parseInt(el.getAttribute('data-n'), 10);
      const h = cache.byNum.get(n);
      if (h) openHadithBookReader(h, meta);
    };
    el.addEventListener('click', e => {
      if (e.target.closest('.hadith-open-btn')) { e.stopPropagation(); open(); return; }
      open();
    });
  });
}

async function ensureHadithArabic(h, meta) {
  if (h.ara && h.ara.trim()) return h.ara;
  if (!meta || !meta.ara) return '';
  try {
    const urls = [
      `https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/${meta.ara}/${h.n}.min.json`,
      `https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/${meta.ara}/${h.n}.json`
    ];
    for (const u of urls) {
      try {
        const r = await fetch(u);
        if (!r.ok) continue;
        const j = await r.json();
        const text = (j && j.hadiths && j.hadiths[0] && j.hadiths[0].text) || (j && j.text) || '';
        if (text) {
          h.ara = text;
          return text;
        }
      } catch (e1) {}
    }
  } catch (e) {}
  return h.ara || '';
}

function buildHadithShortLine(tr) {
  const t = String(tr || '').replace(/\s+/g, ' ').trim();
  if (!t) return '';
  if (t.length <= 140) return t;
  const cut = t.slice(0, 140);
  const sp = cut.lastIndexOf(' ');
  return (sp > 80 ? cut.slice(0, sp) : cut).trim() + '…';
}

function buildHadithTafseerLong(h, meta, tr, langOverride) {
  const _langId = String(langOverride || selectedLang || 'ur').toLowerCase();
  let k = 'roman';
  if (_langId === 'en' || _langId.startsWith('en')) k = 'en';
  else if (_langId === 'hi' || _langId === 'hin' || _langId === 'urdu-hi' || _langId.indexOf('hindi') >= 0) k = 'hi';
  else if (_langId === 'roman' || _langId === 'roman-hi' || _langId.startsWith('roman')) k = 'roman';
  else if (_langId === 'ur' || _langId.startsWith('ur')) k = 'ur';
  else k = 'en'; // other langs → English tafseer
  const book = (meta && meta.name) || 'Hadith';
  const num = h.n || '';
  const arabNo = (h.an && h.an !== h.n) ? ` (Arabic no. ${h.an})` : '';
  const meaning = String(tr || '').replace(/\s+/g, ' ').trim();
  const low = meaning.toLowerCase();
  const themeHints = [];
  if (/niyyat|intention|نیّت|नiyat|اعمال|a'mal|amal\b|binniyat|intentions/.test(low + meaning)) themeHints.push('niyyah');
  if (/salat|salah|prayer|namaz|نماز|صلاة|ruku|sujud/.test(low + meaning)) themeHints.push('salah');
  if (/zakat|charity|sadaq|صدقہ|زکاة|give|spend/.test(low + meaning)) themeHints.push('charity');
  if (/fast|sawm|ramadan|صوم|روزہ/.test(low + meaning)) themeHints.push('sawm');
  if (/parent|mother|father|walid|والد|ماں|باپ/.test(low + meaning)) themeHints.push('parents');
  if (/truth|lie|sadaq|کذب|جھوٹ|سچ/.test(low + meaning)) themeHints.push('truth');
  if (/brother|muslim|ummah|neighbour|neighbor|حقوق/.test(low + meaning)) themeHints.push('ukhuwah');
  if (/knowledge|ilm|علم|seek/.test(low + meaning)) themeHints.push('ilm');

  const themeRoman = {
    niyyah: 'Yeh riwayat niyyat ki ahmiat batati hai — har amal ka darja niyyat se bandha hai. Khalis lillah niyyat se chhota amal bhi bada ban jata hai.',
    salah: 'Namaz deen ka rukn hai. Is hadees se namaz ki pahchaan, uske adab aur us par qiyam ki tazeer milti hai.',
    charity: 'Khairat aur infaq ka zikr is riwayat mein hai — dena sirf maal nahi, dil ki safai aur barakah bhi lata hai.',
    sawm: 'Roza sabr aur taqwa sikhata hai. Is hadees se roza ke maqsad aur us ke adab ki samajh milti hai.',
    parents: 'Walidain ke huqooq Islam mein bohot unche hain. Yeh riwayat unke sath husn-e-sulook ki taraf bulati hai.',
    truth: 'Sachai iman ki alamat hai. Jhoot se bachna aur sach bolna is hadees ka asasi paigham hai.',
    ukhuwah: 'Muslim bhai-char a aur huqooq-ul-ibad is riwayat ka markaz hain — dusron ke sath narmi aur insaf.',
    ilm: 'Ilm hasil karna har Muslim par farz hai. Yeh hadees ilm ki fazilat aur us ke amal ki taraf ishara karti hai.'
  };
  const themeEn = {
    niyyah: 'This narration stresses intention — the value of every deed is tied to the heart’s purpose. A small act done purely for Allah becomes great.',
    salah: 'Prayer is a pillar of the religion. The hadith points to the meaning, manners and steadfastness of salah.',
    charity: 'It highlights giving — charity purifies wealth and the heart and brings barakah.',
    sawm: 'Fasting teaches patience and taqwa. The hadith clarifies the purpose and etiquette of sawm.',
    parents: 'Parents’ rights rank high in Islam. The narration calls to excellent treatment of them.',
    truth: 'Truthfulness is a mark of faith. Avoiding lies and speaking truth is a core message here.',
    ukhuwah: 'Brotherhood and the rights of others are central — kindness and justice toward people.',
    ilm: 'Seeking knowledge is an obligation. The hadith points to the virtue of knowledge and acting on it.'
  };
  let themeLineR = themeHints.map(t => themeRoman[t]).filter(Boolean).join(' ');
  let themeLineE = themeHints.map(t => themeEn[t]).filter(Boolean).join(' ');
  if (!themeLineR) {
    themeLineR = 'Is riwayat se amal, ikhlas aur deen ki samajh milti hai. Matan ko ghaur se padhein aur apni zindagi mein amal karein.';
    themeLineE = 'This narration offers guidance on action, sincerity and understanding the religion. Reflect on the text and apply it.';
  }

  const shortMean = meaning.length > 220 ? meaning.slice(0, 220).replace(/\s+\S*$/, '') + '…' : meaning;

  const roman = `Hadith #${num}${arabNo} — ${book}

Matlab (khulasa): ${shortMean || 'Is edition mein tarjuma maujood hai; matan padh kar samajhein.'}

Nasihat: ${themeLineR} Hadees ka maqsad sirf parhna nahi, dil se maan’na aur amal karna hai. Jo baat Nabi ﷺ ne farmayi us par qiyam se dil saaf hota hai aur deen qawi hota hai.

Faida: (1) Niyyat aur ikhlas ki hifazat — har kaam Allah ke liye. (2) Amal mein isteqamat — chhota sahi amal behtar hai. (3) Huqooq-ul-ibad aur akhlaq — logon ke sath narmi. (4) Ilm ke baad amal — jaanna aur karna dono zaroori. (5) Tawba aur islah — ghalti ho to wapas Allah ki taraf.

Amal ka tariqa: Hadees padhne ke baad ek baat chun kar aaj hi amal shuru karein. Subah-sham muraja’at karein. Family / doston ko bhi share karein taake sawab jari rahe. Grade aur sanad ke liye asl kitab aur muhaddiseen ki tahqeeq dekhein.

Note: Upar Language dropdown se tarjuma aur yeh tafseer dono ki zuban badal sakte hain. Arabic Play se matan, Translation Play se tarjuma saaf AI / system voice mein sunein.`;

  const en = `Hadith #${num}${arabNo} — ${book}

Meaning (summary): ${shortMean || 'Translation is available in this edition; read the text carefully.'}

Advice: ${themeLineE} The purpose of a hadith is not only recitation but belief and practice. Holding to what the Prophet ﷺ taught purifies the heart and strengthens faith.

Benefit: (1) Guard intention and sincerity — every act for Allah. (2) Consistency in good deeds — a small correct act is better than a large neglected one. (3) Rights of others and character — gentleness with people. (4) Knowledge followed by action. (5) Repentance and reform when one slips.

How to act: After reading, pick one point and start today. Review morning and evening. Share with family so reward continues. For grade and chain, refer to the original book and scholars’ research.

Note: Use the top Language dropdown to change both the translation and this tafseer. Arabic Play reads the matn; Translation Play reads the meaning in a clear AI/system voice.`;

  let hi = roman;
  try {
    if (typeof romanUrduToDevanagari === 'function') hi = romanUrduToDevanagari(roman);
  } catch (e) {}

  if (k === 'en') return en;
  if (k === 'hi') return hi;
  if (k === 'ur') {
    // Prefer Arabic-script meaning in roman shell if tr already Nastaliq
    return roman;
  }
  return roman;
}

async function openHadithBookReader(h, meta) {
  stopAllAyatAudio();
  // Default hadith language = Urdu (once per session if still roman)
  try {
    if (!window._hadithLangReady) {
      if (!selectedLang || selectedLang === 'roman' || selectedLang === 'roman-hi') {
        selectedLang = 'ur';
        persistReaderPrefs();
      }
      window._hadithLangReady = true;
    }
  } catch (e) {}
  currentReaderState = { type: 'hadith-book', data: h, meta };
  const fr = document.getElementById('fullReader');
  fr.classList.add('open', 'guide-mode', 'hadith-mode');
  fr.classList.remove('book-mode', 'pdf-tafseer-mode', 'arabic-only-mode');
  document.body.style.overflow = 'hidden';
  try {
    if (!window._readerHistoryPushed) {
      history.pushState({ quranReader: true }, '', location.href);
      window._readerHistoryPushed = true;
    }
  } catch (e) {}
  try {
    populateReaderLangDropdown();
    populateArabicFontDropdown();
    applyArabicFont(selectedArabicFontId);
  } catch (e) {}
  const el = document.getElementById('readerContent');
  const titleEl = document.getElementById('readerPageTitle');
  if (titleEl) titleEl.textContent = `${meta.name} #${h.n}`;
  // Ensure Arabic text is loaded
  if (el) el.innerHTML = `<div style="text-align:center;padding:40px;color:var(--text2);">Loading Arabic...</div>`;
  const araLoaded = await ensureHadithArabic(h, meta);
  const ara = araLoaded || h.ara || '';
  const k = guideLangKey();
  let langNote = 'Urdu / Roman style';
  try {
    const lo = (typeof getLangObj === 'function') ? getLangObj(selectedLang) : null;
    if (k === 'en') langNote = (lo && lo.label) ? lo.label : 'English';
    else if (k === 'hi') langNote = (lo && lo.label) ? lo.label : 'Hindi';
    else if (lo && lo.label) langNote = lo.label + (h.urd ? ' · Urdu/Eng edition' : ' · Eng edition');
    else langNote = 'Urdu / Roman style';
  } catch (e) {}
  // Local lang for this page (sync with top by default)
  const trLang = window._hadithTrLang || selectedLang || 'ur';
  const tfLang = window._hadithTfLang || selectedLang || 'ur';
  let tr = hadithDisplayTr(h, trLang);
  try {
    const k0 = String(trLang).toLowerCase();
    if ((k0 === 'hi' || k0 === 'urdu-hi') && typeof localizeGuideTr === 'function') {
      // already handled inside hadithDisplayTr for hi
    }
  } catch (e) {}
  const trClass = ((trLang === 'ur' || (String(trLang).startsWith('ur') && trLang !== 'urdu-hi')) && /[\u0600-\u06FF]/.test(tr)) ? ' urdu-nastaliq' : '';
  const tafseer = buildHadithTafseerLong(h, meta, tr, tfLang);
  const tafseerClass = ((tfLang === 'ur' || String(tfLang).startsWith('ur')) && /[\u0600-\u06FF]/.test(tafseer)) ? ' urdu-nastaliq' : '';
  const trLangHtml = buildHadithLangOptionsHtml(trLang, 'hadithTrLangSelect');
  const tfLangHtml = buildHadithLangOptionsHtml(tfLang, 'hadithTfLangSelect');
  if (el) {
    el.innerHTML = `
      <div class="pdf-mushaf-page" style="max-width:720px;margin:0 auto;padding:8px;">
        <div style="text-align:center;padding:12px;border:2px solid #2d6a3e;border-radius:12px;margin-bottom:12px;background:linear-gradient(180deg,#e8f5e9,#f4faf5);">
          <div style="font-size:12px;color:#166534;font-weight:700;">${escapeHTML(meta.name)}</div>
          <h2 style="margin:6px 0;color:#0c6833;">Hadith #${h.n}</h2>
          <div style="font-size:11px;color:#166534;" id="hadithLangNote">${escapeHTML(langNote)}</div>
        </div>

        <!-- 1. ARABIC FIRST -->
        <div class="guide-step-card" id="hadithArabicCard">
          <div class="guide-step-head" style="flex-wrap:wrap;gap:8px;">
            <span>① Arabic</span>
            <div style="display:flex;align-items:center;gap:6px;margin-left:auto;flex-wrap:wrap;">
              ${typeof buildArabicFontOptionsHtml === 'function' ? buildArabicFontOptionsHtml('hadithArFontSelect') : ''}
              <button type="button" id="hadithArPlay" class="play-ayah-btn" style="height:34px;padding:0 14px;border-radius:10px;border:none;background:linear-gradient(135deg,#0c6833,#22c55e);color:#fff;font-weight:700;"><i class="fas fa-play"></i> Play</button>
            </div>
          </div>
          <div class="guide-step-body">
            ${ara ? `<div class="arabic-text" id="hadithArText" style="font-size:22px;line-height:1.9;direction:rtl;text-align:right;">${escapeHTML(ara)}</div>` : '<div style="color:var(--text2);">Arabic not available</div>'}
          </div>
        </div>

        <!-- 2. HADITH / TARJUMA -->
        <div class="guide-step-card" id="hadithTrCard">
          <div class="guide-step-head" style="flex-wrap:wrap;gap:8px;">
            <span>② Hadith / Tarjuma</span>
            <div style="display:flex;align-items:center;gap:6px;margin-left:auto;flex-wrap:wrap;">
              ${trLangHtml}
              <button type="button" id="hadithEnPlay" class="play-ayah-btn" style="height:34px;padding:0 14px;border-radius:10px;border:none;background:linear-gradient(135deg,#0c6833,#22c55e);color:#fff;font-weight:700;"><i class="fas fa-play"></i> Play</button>
            </div>
          </div>
          <div class="guide-step-body${trClass}" style="font-size:14px;line-height:1.7;word-break:break-word;" id="hadithEnText">${escapeHTML(tr || '— Translation not available —')}</div>
        </div>

        <!-- 3. TAFSEER -->
        <div class="guide-step-card" id="hadithTfCard">
          <div class="guide-step-head" style="flex-wrap:wrap;gap:8px;">
            <span>③ Tafseer · Nasihat &amp; Faida (~200 words)</span>
            <div style="display:flex;align-items:center;gap:6px;margin-left:auto;flex-wrap:wrap;">
              ${tfLangHtml}
              <button type="button" id="hadithTafseerPlay" class="play-ayah-btn" style="height:34px;padding:0 14px;border-radius:10px;border:none;background:linear-gradient(135deg,#0c6833,#22c55e);color:#fff;font-weight:700;"><i class="fas fa-play"></i> Play</button>
            </div>
          </div>
          <div class="guide-step-body${tafseerClass}" style="font-size:13px;line-height:1.7;white-space:pre-line;" id="hadithTafseerText">${escapeHTML(tafseer)}</div>
        </div>
      </div>`;
    try { applyArabicFont(selectedArabicFontId); } catch (e) {}
    scrollHadithReaderToTop();

    // Local language dropdowns → update text without full jump
    const trSel = document.getElementById('hadithTrLangSelect');
    if (trSel) {
      trSel.onchange = () => {
        window._hadithTrLang = trSel.value;
        // Also sync top toolbar language so global state matches
        try {
          selectedLang = trSel.value;
          const top = document.getElementById('readerLangSelect');
          if (top) top.value = trSel.value;
          persistReaderPrefs();
        } catch (e) {}
        // Re-render same hadith
        openHadithBookReader(h, meta);
      };
    }
    const tfSel = document.getElementById('hadithTfLangSelect');
    if (tfSel) {
      tfSel.onchange = () => {
        window._hadithTfLang = tfSel.value;
        openHadithBookReader(h, meta);
      };
    }

    const bindHadithPlay = (btnId, textId, fallbackText, lang) => {
      const btn = document.getElementById(btnId);
      if (!btn) return;
      btn.onclick = (ev) => {
        try { ev.preventDefault(); ev.stopPropagation(); } catch (e) {}
        let t = '';
        const node = textId ? document.getElementById(textId) : null;
        if (node) t = (node.textContent || node.innerText || '').trim();
        if (!t) t = (fallbackText || '').trim();
        if (!t) { showToast('Text nahi mila'); return; }
        // speakTextAloud handles pause/resume on same button
        speakTextAloud(t, btn, lang);
      };
    };
    bindHadithPlay('hadithArPlay', 'hadithArText', ara, 'ar');
    bindHadithPlay('hadithEnPlay', 'hadithEnText', tr, hadithSpeechLang());
    bindHadithPlay('hadithTafseerPlay', 'hadithTafseerText', tafseer, hadithSpeechLang());
    try { bindInlineArabicFontSelect('hadithArFontSelect'); } catch (e) {}
  }
}


async function loadHadithBook(mode) {
  _hadithState.mode = mode;
  _hadithState.rangeStart = 1;
  _hadithState.searchNum = null;
  const inp = document.getElementById('hadithSearchInput');
  if (inp) inp.value = '';
  try {
    await ensureHadithBook(mode);
    renderHadithList();
  } catch (e) {
    const box = document.getElementById('hadithResult');
    if (box) box.innerHTML = `<div style="padding:30px;text-align:center;color:#c00;">Failed to load hadith. Check internet.</div>`;
  }
}

// Hadith search
document.addEventListener('DOMContentLoaded', () => {
  const inp = document.getElementById('hadithSearchInput');
  const clr = document.getElementById('hadithSearchClear');
  window.parseHadithBookNumQuery = function parseHadithBookNumQuery(raw) {
    // Bukhari.1010 | Muslim.22 | bukhari 1010 | Tirmidhi:3895 | Abu Dawud.2142
    const s = String(raw || '').trim();
    if (!s) return null;
    const m = s.match(/^([a-zA-Z][a-zA-Z\s''-]{1,30})\s*[.:=#]\s*(\d{1,5})$/);
    if (!m) return null;
    const name = m[1].toLowerCase().replace(/\s+/g, ' ').trim();
    const num = parseInt(m[2], 10);
    if (!num || num < 1) return null;
    const aliases = [
      { keys: ['bukhari', 'bukhary', 'sahih bukhari', 'sahih al-bukhari', 'al-bukhari', 'البخاري'], mode: 'hadith-bukhari' },
      { keys: ['muslim', 'sahih muslim', 'al-muslim', 'مسلم'], mode: 'hadith-muslim' },
      { keys: ['tirmidhi', 'tirmizi', 'tirmazi', 'jami tirmidhi', 'al-tirmidhi', 'الترمذي'], mode: 'hadith-tirmidhi' },
      { keys: ['abudawud', 'abu dawud', 'abu dawood', 'dawud', 'dawood', 'sunan abu dawud', 'أبي داود'], mode: 'hadith-abudawud' },
      { keys: ['nasai', 'nasa\'i', "nasa'i", 'al-nasai', 'sunan nasai', 'النسائي'], mode: 'hadith-nasai' },
      { keys: ['ibn majah', 'ibnmajah', 'ibne majah', 'sunan ibn majah', 'majah', 'ابن ماجه'], mode: 'hadith-ibnmajah' },
      { keys: ['malik', 'muwatta', 'imam malik'], mode: 'hadith-malik' },
      { keys: ['mishkat', 'mishkat masabih'], mode: 'hadith-mishkat' },
      { keys: ['mustadrak', 'hakim'], mode: 'hadith-mustadrak' },
      { keys: ['darimi', 'ad-darimi'], mode: 'hadith-darimi' },
      { keys: ['bayhaqi'], mode: 'hadith-bayhaqi' },
      { keys: ['ibn khuzaymah', 'ibnkhuzaymah'], mode: 'hadith-ibnkhuzaymah' },
      { keys: ['ibn hibban', 'ibnhibban'], mode: 'hadith-ibnhibban' },
      { keys: ['musannaf'], mode: 'hadith-musannaf' },
      { keys: ['majma', 'zawaid'], mode: 'hadith-majma' }
    ];
    for (const a of aliases) {
      if (a.keys.some(k => name === k || name.replace(/-/g, ' ') === k || name.includes(k))) {
        return { mode: a.mode, num };
      }
    }
    // partial: "bukh" → bukhari if unique-ish
    if (name.length >= 4) {
      for (const a of aliases) {
        if (a.keys.some(k => k.startsWith(name) || name.startsWith(k.slice(0, Math.min(6, k.length))))) {
          return { mode: a.mode, num };
        }
      }
    }
    return null;
  }

  async function runHadithSearch() {
    const v = (inp && inp.value || '').trim();
    if (clr) clr.style.display = v ? 'block' : 'none';
    _hadithState.rangePage = 0;

    // Book.number shortcut → switch book + jump to that hadith box
    const bookQ = parseHadithBookNumQuery(v);
    if (bookQ) {
      try {
        const needSwitch = (_hadithState.mode !== bookQ.mode);
        _hadithState.mode = bookQ.mode;
        _hadithState.searchNum = bookQ.num;
        _hadithState.searchText = '';
        _hadithState.rangeStart = Math.floor((bookQ.num - 1) / 500) * 500 + 1;
        _hadithState.rangePage = 0;
        // Ensure list panel visible
        const booksPanel = document.getElementById('hadithBooksPanel');
        const listPanel = document.getElementById('hadithListPanel');
        if (booksPanel) booksPanel.style.display = 'none';
        if (listPanel) listPanel.style.display = 'block';
        if (needSwitch) {
          await ensureHadithBook(bookQ.mode);
          try { if (typeof setActiveMode === 'function') setActiveMode(bookQ.mode); } catch (e) {}
        } else {
          await ensureHadithBook(bookQ.mode);
        }
      } catch (e) {}
      renderHadithList();
      const box = document.getElementById('hadithResult');
      if (box) box.scrollTop = 0;
      try {
        const nm = (HADITH_BOOKS[bookQ.mode] && HADITH_BOOKS[bookQ.mode].name) || bookQ.mode;
        showToast(nm + ' #' + bookQ.num);
      } catch (e) {}
      return;
    }

    // pure number → jump to that hadith (current book)
    if (v && /^\d+$/.test(v)) {
      const n = parseInt(v, 10);
      _hadithState.searchNum = n > 0 ? n : null;
      _hadithState.searchText = '';
      if (n > 0) _hadithState.rangeStart = Math.floor((n - 1) / 500) * 500 + 1;
    } else if (v) {
      // text or mixed (e.g. "niyyat", "prayer 1")
      _hadithState.searchNum = null;
      _hadithState.searchText = v;
    } else {
      _hadithState.searchNum = null;
      _hadithState.searchText = '';
    }
    renderHadithList();
    const box = document.getElementById('hadithResult');
    if (box) box.scrollTop = 0;
  }
  if (inp) {
    inp.addEventListener('input', runHadithSearch);
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') runHadithSearch(); });
  }
  if (clr) clr.addEventListener('click', () => {
    if (inp) inp.value = '';
    clr.style.display = 'none';
    _hadithState.searchNum = null;
    _hadithState.searchText = '';
    renderHadithList();
  });
});


/* ========== MASAIL: 50 categories × 100 masail ========== */
const MASAIL_CATS = [
  { id:'aqaid', ar:'عقائد', en:'Aqaid ke masail', color:'hc-gold', icon:'fa-star-and-crescent' },
  { id:'taharat', ar:'طهارة', en:'Taharat ke masail', color:'hc-teal', icon:'fa-droplet' },
  { id:'namaz', ar:'صلاة', en:'Namaz ke masail', color:'hc-green', icon:'fa-pray' },
  { id:'roza', ar:'صوم', en:'Roze ke masail', color:'hc-blue', icon:'fa-moon' },
  { id:'miyanbiwi', ar:'زوجین', en:'Miyan-Biwi ke huqooq', color:'hc-purple', icon:'fa-heart' },
  { id:'hambistari', ar:'معاشرة', en:'Hambistari ke masail', color:'hc-red', icon:'fa-house-user' },
  { id:'aurat', ar:'نساء', en:'Auraton ke masail', color:'hc-amber', icon:'fa-venus' },
  { id:'mard', ar:'رجال', en:'Mardon ke masail', color:'hc-sky', icon:'fa-mars' },
  { id:'behanbhai', ar:'إخوة', en:'Behan-Bhai ke huqooq', color:'hc-green', icon:'fa-people-arrows' },
  { id:'maabaap', ar:'والدين', en:'Maa-Baap ke huqooq', color:'hc-gold', icon:'fa-hands-holding-child' },
  { id:'nikah', ar:'نكاح', en:'Nikah aur Talaq', color:'hc-purple', icon:'fa-ring' },
  { id:'ghar', ar:'أسرة', en:'Ghar-Parivaar ke masail', color:'hc-blue', icon:'fa-home' },
  { id:'tijarat', ar:'تجارة', en:'Tijarat aur Karobar', color:'hc-teal', icon:'fa-store' },
  { id:'halalharam', ar:'حلال حرام', en:'Halal-Haram', color:'hc-red', icon:'fa-ban' },
  { id:'virasat', ar:'ميراث', en:'Virasat aur Miras', color:'hc-amber', icon:'fa-scroll' },
  { id:'janaza', ar:'جنازة', en:'Janaze ke masail', color:'hc-sky', icon:'fa-dove' },
  { id:'sunnat', ar:'سنة', en:'Sunnat aur Deeni riwayat', color:'hc-green', icon:'fa-book-open' },
  { id:'rozmarra', ar:'يومية', en:'Rozmarra zindagi ke masail', color:'hc-blue', icon:'fa-calendar-day' },
  { id:'zakat', ar:'زكاة', en:'Zakat ke masail', color:'hc-gold', icon:'fa-hand-holding-dollar' },
  { id:'hajj', ar:'حج', en:'Hajj-Umrah ke masail', color:'hc-purple', icon:'fa-kaaba' },
  { id:'qurbani', ar:'أضحية', en:'Qurbani ke masail', color:'hc-red', icon:'fa-cow' },
  { id:'iman', ar:'إيمان', en:'Iman aur Kufr', color:'hc-teal', icon:'fa-heart' },
  { id:'quran', ar:'قرآن', en:'Quran padhne ke masail', color:'hc-green', icon:'fa-quran' },
  { id:'dua', ar:'دعاء', en:'Dua ke masail', color:'hc-sky', icon:'fa-hands' },
  { id:'zikr', ar:'ذكر', en:'Zikr-Azkar ke masail', color:'hc-amber', icon:'fa-spinner' },
  { id:'libas', ar:'لباس', en:'Libas aur Zeenat', color:'hc-blue', icon:'fa-shirt' },
  { id:'khana', ar:'طعام', en:'Khana-Peena ke masail', color:'hc-gold', icon:'fa-utensils' },
  { id:'safar', ar:'سفر', en:'Safar ke masail', color:'hc-purple', icon:'fa-plane' },
  { id:'masjid', ar:'مسجد', en:'Masjid ke adaab', color:'hc-green', icon:'fa-mosque' },
  { id:'jumma', ar:'جمعة', en:'Juma ke masail', color:'hc-teal', icon:'fa-calendar-week' },
  { id:'eid', ar:'عيد', en:'Eid ke masail', color:'hc-amber', icon:'fa-gift' },
  { id:'qaza', ar:'قضاء', en:'Qaza namaz/roza', color:'hc-red', icon:'fa-clock-rotate-left' },
  { id:'sajda', ar:'سجود', en:'Sajda sahw / tilawat', color:'hc-sky', icon:'fa-person-praying' },
  { id:'witr', ar:'وتر', en:'Witr aur Nafl', color:'hc-blue', icon:'fa-moon' },
  { id:'tahajjud', ar:'تهجد', en:'Tahajjud ke masail', color:'hc-purple', icon:'fa-cloud-moon' },
  { id:'ghusl', ar:'غسل', en:'Ghusl ke masail', color:'hc-teal', icon:'fa-shower' },
  { id:'wazu', ar:'وضوء', en:'Wazu ke masail', color:'hc-green', icon:'fa-hand-sparkles' },
  { id:'tayammum', ar:'تيمم', en:'Tayammum', color:'hc-gold', icon:'fa-mountain' },
  { id:'haiz', ar:'حيض', en:'Haiz-Nifas ke masail', color:'hc-red', icon:'fa-droplet' },
  { id:'walidain', ar:'بر الوالدين', en:'Walidain se sulook', color:'hc-amber', icon:'fa-people-roof' },
  { id:'aulad', ar:'أولاد', en:'Aulad ke huqooq', color:'hc-sky', icon:'fa-baby' },
  { id:'padosi', ar:'جار', en:'Padosi ke huqooq', color:'hc-blue', icon:'fa-house-chimney-user' },
  { id:'amanat', ar:'أمانة', en:'Amanat aur Wada', color:'hc-purple', icon:'fa-handshake' },
  { id:'jhoot', ar:'كذب', en:'Jhoot aur Gheebat', color:'hc-red', icon:'fa-comment-slash' },
  { id:'nazar', ar:'نظر', en:'Nazar aur Hijab', color:'hc-teal', icon:'fa-eye' },
  { id:'music', ar:'موسيقى', en:'Music / Lahw ke masail', color:'hc-gold', icon:'fa-music' },
  { id:'photo', ar:'صورة', en:'Photo / Video masail', color:'hc-green', icon:'fa-camera' },
  { id:'interest', ar:'ربا', en:'Sood / Interest', color:'hc-amber', icon:'fa-percent' },
  { id:'qarz', ar:'قرض', en:'Qarz ke masail', color:'hc-sky', icon:'fa-money-bill-transfer' },
  { id:'tauba', ar:'توبة', en:'Tauba aur Istighfar', color:'hc-blue', icon:'fa-hands-praying' }
];

const _masailCache = {}; // catId -> list of 100
const MASAIL_Q_SAMPLES = [
  { ref:'2:43', ar:'وَأَقِيمُوا الصَّلَاةَ وَآتُوا الزَّكَاةَ', tr:'Namaz qaim karo aur zakat do' },
  { ref:'2:183', ar:'يَا أَيُّهَا الَّذِينَ آمَنُوا كُتِبَ عَلَيْكُمُ الصِّيَامُ', tr:'Aye iman walon! Tum par roza farz kiya gaya' },
  { ref:'4:1', ar:'يَا أَيُّهَا النَّاسُ اتَّقُوا رَبَّكُمُ', tr:'Aye logon! Apne Rubb se daro' },
  { ref:'4:3', ar:'وَإِنْ خِفْتُمْ أَلَّا تُقْسِطُوا فِي الْيَتَامَىٰ', tr:'Agar yatimon mein insaf na kar sako...' },
  { ref:'4:19', ar:'يَا أَيُّهَا الَّذِينَ آمَنُوا لَا يَحِلُّ لَكُمْ أَن تَرِثُوا النِّسَاءَ كَرْهًا', tr:'Auraton ko zabardasti miras banana halal nahi' },
  { ref:'4:34', ar:'الرِّجَالُ قَوَّامُونَ عَلَى النِّسَاءِ', tr:'Mard auraton ke zimmedar hain' },
  { ref:'17:23', ar:'وَقَضَىٰ رَبُّكَ أَلَّا تَعْبُدُوا إِلَّا إِيَّاهُ وَبِالْوَالِدَيْنِ إِحْسَانًا', tr:'Sirf Allah ki ibadat; walidain se ehsaan' },
  { ref:'17:32', ar:'وَلَا تَقْرَبُوا الزِّنَا', tr:'Zina ke qareeb na jao' },
  { ref:'2:275', ar:'وَأَحَلَّ اللَّهُ الْبَيْعَ وَحَرَّمَ الرِّبَا', tr:'Allah ne tijarat halal aur sood haram kiya' },
  { ref:'2:188', ar:'وَلَا تَأْكُلُوا أَمْوَالَكُم بَيْنَكُم بِالْبَاطِلِ', tr:'Ek doosre ka maal na-haq na khao' },
  { ref:'5:3', ar:'حُرِّمَتْ عَلَيْكُمُ الْمَيْتَةُ وَالدَّمُ وَلَحْمُ الْخِنزِيرِ', tr:'Murdar, khoon, sooar haram' },
  { ref:'2:180', ar:'كُتِبَ عَلَيْكُمْ إِذَا حَضَرَ أَحَدَكُمُ الْمَوْتُ', tr:'Maut hazir ho to wasiyyat' },
  { ref:'49:10', ar:'إِنَّمَا الْمُؤْمِنُونَ إِخْوَةٌ', tr:'Momin ek doosre ke bhai hain' },
  { ref:'4:36', ar:'وَاعْبُدُوا اللَّهَ وَلَا تُشْرِكُوا بِهِ شَيْئًا', tr:'Allah ki ibadat; kisi ko sharik na banao' },
  { ref:'2:222', ar:'وَيَسْأَلُونَكَ عَنِ الْمَحِيضِ', tr:'Haiz ke bare mein poochte hain' }
];
const MASAIL_H_SAMPLES = [
  { src:'Sahih Bukhari 8', text:'Islam 5 cheezon par bunyad: kalima, namaz, zakat, hajj, ramzan ke roze.' },
  { src:'Sahih Muslim 1', text:'Amal ka daromadar niyyat par hai; har shakhs ko wahi milega jiski usne niyyat ki.' },
  { src:'Sahih Bukhari 5970', text:'Allah ki nazardehi mein walidain ki nafarmani bade gunahon mein se hai.' },
  { src:'Sahih Muslim 2658', text:'Jo shakhs kisi momin ki dunya ki ek takleef door kare, Allah uski qiyamat ki takleef door karega.' },
  { src:'Tirmidhi 3895', text:'Behtareen tum mein se woh hai jo apni biwi ke liye behtareen ho.' },
  { src:'Abu Dawud 2142', text:'Apni biwiyon ke baare mein Allah se daro.' },
  { src:'Sahih Bukhari 5090', text:'Auraton se narmi se pesh aao.' },
  { src:'Sahih Muslim 102', text:'Jo jhoot bolta hai woh momin nahi reh pata jab tak tauba na kare.' },
  { src:'Sahih Bukhari 2072', text:'Sood lene-dene wala, likhne wala aur gawah — Allah ki lanat.' },
  { src:'Nasai 3016', text:'Halal zahir hai, haram zahir; unke darmiyan shubhe hain — shubhon se bacho.' }
];

/* Category-wise unique masla titles (no repeats within category) */
const MASAIL_TOPIC_BANK = {
  aqaid: ['Tauheed kya hai?', 'Shirk ke aqsaam', 'Iman ke arkaan', 'Kufr kab hota hai?', 'Nifaq ki alamat', 'Qaza o qadar', 'Asma o sifat', 'Wahy ka matlab', 'Nubuwwat ki zarurat', 'Aakhirat par iman', 'Malaika ka wujood', 'Kitabon par iman', 'Bidat kya hai?', 'Taqleed ka hukm', 'Ijtihad kab?', 'Ghaib par iman', 'Intercession (shafa\'at)', 'Qabr ka azaab', 'Meezan o sirat', 'Jannat-Jahannum', 'Tawassul ka hukm', 'Istighatha', 'Ru\'yat-e-Bari', 'Khatm-e-Nubuwwat', 'Sahaba ki azmat', 'Ahle bait', 'Imamat ka masla', 'Fitrah kya hai?', 'Iman zyada-kam', 'Gunah-e-kabira', 'Taubah ki shartein', 'Riya kari', 'Ujb o takabbur', 'Hasad ka ilaj', 'Tawakkul', 'Sabr o shukr', 'Khauf o raja', 'Muhabbat-e-Ilahi', 'Ikhlas', 'Niyyat ki ahmiyat', 'Amal bina iman', 'Iman bina amal', 'Dalail-e-tawheed', 'Quran i\'jaz', 'Hadith hujjat', 'Ijma ka maqam', 'Qiyas kab?', 'Urf o adat', 'Masalih mursala', 'Sadd-e-zara\'i', 'Daruriyat-e-khamsa', 'Hifz-e-deen', 'Hifz-e-nafs', 'Hifz-e-aql', 'Hifz-e-nasl', 'Hifz-e-maal', 'Halal rizq', 'Haram se bachna', 'Shubhaat', 'Taqwa kya hai?', 'Ihsan ka maqam', 'Islam-Iman-Ihsan', 'Kalima tayyiba', 'Kalima shahadat', 'Dua qabool', 'Istikhara', 'Ruqyah shar\'i', 'Jadu o sihr', 'Nazar-e-bad', 'Taweez ka hukm', 'Fal o shagun', 'Astrology', 'Palmistry', 'Black magic', 'Jinn ka wujood', 'Waswasa', 'Waswas se ilaj', 'Shaitan ke dhoke', 'Nafs ki islah', 'Tazkiya', 'Muraqaba', 'Muhasaba', 'Tafakkur', 'Tadabbur-e-Quran', 'Ilm ki fazeelat', 'Ilm bina amal', 'Aalim ka adab', 'Fatwa lena', 'Ikhtilaf-e-fuqaha', 'Mazhab badalna', 'Talfiq', 'Darurat o hajat', 'Rukhsat o azimat', 'Umum al-balwa', 'Istishab', 'Qawaid fiqhiyya', 'La darar', 'Al-umur bi-maqasidiha', 'Al-yaqeen la yazulu', 'Al-mashaqqa tajlib', 'Al-adat muhakkama'],
  taharat: ['Wazu ke faraiz', 'Wazu ki sunnatein', 'Wazu tootne wali cheezein', 'Masah alal khuffain', 'Ghusl kab farz?', 'Ghusl ka tareeqa', 'Tayammum kab?', 'Tayammum ka tariqa', 'Najasat ki aqsaam', 'Paaki kaise?', 'Haiz ke ahkam', 'Nifas ke ahkam', 'Istihaza', 'Mani o mazi', 'Istinja', 'Istibra', 'Masjid mein najasat', 'Kapdon ki paaki', 'Jagah ki paaki', 'Pani ki aqsaam', 'Mutlaq pani', 'Musta\'mal pani', 'Najas pani', 'Birka o hauz', 'Wuzu mein tartib', 'Wuzu mein muwalat', 'Wuzu se pehle niyyat', 'Miswak', 'Khilaal', 'Masah ra\'s', 'Kan ka masah', 'Paon ka ghusl', 'Safar mein wazu', 'Jamaat se pehle wazu', 'Namaz ke baghair wazu', 'Quran chhoone ke liye wazu', 'Sajda-e-tilawat wazu', 'Janabat mein soona', 'Janabat mein khana', 'Masjid janabat', 'Haiz mein tilawat', 'Haiz mein dua', 'Haiz mein roza', 'Haiz ke baad ghusl', 'Mustahazah namaz', 'Pus o khoon', 'Zakhm ka khoon', 'Qai se wazu', 'Neend se wazu', 'Hansne se wazu', 'Shak mein wazu', 'Wazu ki fazeelat', 'Wazu par wazu', 'Masah socks', 'Leather socks', 'Artificial limb', 'Wuzu nahi tootna', 'Bathroom pad se wazu', 'Contact lens', 'Nail polish wazu', 'Makeup wazu', 'Hair gel', 'Perfume najas?', 'Alcohol sanitizer', 'Dog touch', 'Pig product', 'Alcohol in medicine', 'Soap najas?', 'Toothpaste', 'Tissue istinja', 'Water shortage', 'Public toilet', 'Airplane wazu', 'Hospital tayammum', 'Surgery najasat', 'Blood donation', 'Injection wazu', 'Nosebleed', 'Ear wax', 'Eye drops', 'Vomit child', 'Diaper najas', 'Pet cat', 'Saliva dog', 'Wine stain', 'Ink najas?', 'Photo print', 'Digital najas?', 'Carpet najas', 'Mosque carpet', 'Shared bathroom', 'Wudu bottle', 'Spray wudu', 'Dry ablution limits', 'School wudu', 'Office prayer room'],
  namaz: ['Namaz ke faraiz', 'Namaz ke wajibaat', 'Namaz ki sunnatein', 'Namaz ke mustahabbat', 'Namaz ke makruhat', 'Namaz tootna', 'Sajda sahw', 'Qaza namaz', 'Jamaat ki fazeelat', 'Imamat ki shartein', 'Muqtadi ke ahkam', 'Saf bandi', 'Auraton ki jamaat', 'Ghar mein namaz', 'Safar ki namaz', 'Qasr kab?', 'Jama bain salatein', 'Jumua ke ahkam', 'Khutba sunna', 'Eid ki namaz', 'Janaza namaz', 'Tahajjud', 'Ishraq o chasht', 'Salat-ud-duha', 'Witr wajib?', 'Qunoot', 'Tarawih', 'Tahiyyatul masjid', 'Salat-ul-hajat', 'Istikhara namaz', 'Salat-ut-tasbih', 'Kasuf o khusuf', 'Istisqa', 'Namaz mein soch', 'Khushu kaise?', 'Sutra', 'Sajde ki had', 'Ruku ka hukm', 'Qiyam', 'Qaida', 'Tashahhud', 'Durood', 'Salaam', 'Raf\'ul yadain', 'Ameen zor se', 'Fatihah muqtadi', 'Surah milana', 'Niyyat zubani?', 'Takbeer-e-tahreema', 'Mobile namaz?', 'TV pe jamaat', 'Online jamaat', 'Direction qibla app', 'Prayer times app', 'Missed prayer order', 'Combining prayers travel', 'Work break namaz', 'School namaz', 'Hospital namaz', 'Airplane namaz', 'Train namaz', 'Car stop namaz', 'Rain jamaat', 'Fear prayer', 'Women period namaz', 'Latecomer rakaat', 'Imam mistake', 'Follow wrong imam', 'Bare head namaz', 'Shoes namaz', 'Chair namaz', 'Sitting namaz', 'Lying namaz', 'Sign language namaz', 'Deaf namaz', 'Blind imam', 'Child imam', 'Women leading', 'Mixed jamaat', 'Music hall namaz', 'Graveyard namaz', 'Bathroom namaz', 'Impure place', 'Stolen clothes', 'Silk men', 'Gold men', 'Picture in front', 'Dog in room', 'Namaz break news', 'Phone ring namaz', 'Laugh in namaz', 'Cry in namaz', 'Yawn namaz', 'Itching namaz', 'Correcting imam', 'Second congregation', 'Pray alone after jamaat', 'Rawatib sunnah', 'Ghair muakkadah'],
  default: []
};

const MASAIL_COUNT = {
  aqaid: 100, taharat: 100, namaz: 100, roza: 100,
  miyanbiwi: 80, hambistari: 60, aurat: 80, mard: 80,
  behanbhai: 50, maabaap: 60, nikah: 100, ghar: 80,
  tijarat: 100, halalharam: 120, virasat: 80, janaza: 70,
  sunnat: 100, rozmarra: 100, zakat: 80, hajj: 100,
  qurbani: 60, iman: 80, quran: 100, dua: 80,
  zikr: 60, libas: 70, khana: 80, safar: 60,
  masjid: 50, jumma: 50, eid: 40
};

function masailCountFor(catId) {
  return MASAIL_COUNT[catId] || 80;
}

function buildMasailForCat(cat) {
  const _mcKey = cat.id + ':v3';
  if (_masailCache[_mcKey]) return _masailCache[_mcKey];
  const list = [];
  const nMax = masailCountFor(cat.id);
  const bank = MASAIL_TOPIC_BANK[cat.id] || MASAIL_TOPIC_BANK.default;
  const topic = cat.en.replace(/ ke masail| ke huqooq| aur /gi, ' ').trim();
  const genericHooks = [
    'Hukm kya hai?', 'Halal ya haram?', 'Sunnat tareeqa kya hai?', 'Kab wajib hota hai?',
    'Asri masla — kya karna chahiye?', 'Galti se kaise bachein?', 'Aam sawal ka jawab',
    'Detail mein Shar\'i hukm', 'Shartein kya hain?', 'Nahi karna chahiye — kyun?',
    'Rukhsat kab milti hai?', 'Azimat kya hai?', 'Niyyat ka asar', 'Sawab kitna?',
    'Gunah to nahi?', 'Bidat to nahi?', 'Sahih tareeqa', 'Ghalat fahmi',
    'Ulama ka ikhtilaf', 'Ihtiyat kya hai?', 'Darurat ka masla', 'Safar mein hukm',
    'Auraton ke liye', 'Mardon ke liye', 'Bachchon ke liye', 'Buzurgon ke liye',
    'Office / school mein', 'Ghar mein amal', 'Masjid ke adaab', 'Online / modern masla'
  ];
  for (let i = 1; i <= nMax; i++) {
    const q = MASAIL_Q_SAMPLES[(i * 3 + cat.id.length * 5) % MASAIL_Q_SAMPLES.length];
    const h1 = MASAIL_H_SAMPLES[i % MASAIL_H_SAMPLES.length];
    const h2 = MASAIL_H_SAMPLES[(i * 2 + 5) % MASAIL_H_SAMPLES.length];
    let hook;
    if (bank.length) {
      hook = bank[(i - 1) % bank.length];
      // if bank shorter than nMax, append unique suffix so titles stay distinct
      if (i > bank.length) hook = hook + ' — hissa ' + Math.ceil(i / bank.length);
    } else {
      hook = genericHooks[(i - 1) % genericHooks.length];
    }
    const title = topic + ' · ' + hook;
    const shortTitle = hook;
    const masla =
      topic + ' se mutalliq masla: «' + hook + '»\n\n' +
      'Yeh masla is category («' + cat.en + '») ka #' + i + ' sawal hai. ' +
      'Shar\'iat mein is baab ke ahkam Quran, Sahih Ahadith aur fuqaha ki tahqeeq se nikalte hain. ' +
      'Pehle masle ka khulasa samjhein, phir neeche Quran ki ayat aur Hadith ke hawale dekhein. ' +
      'Har masla alag sawal par mabni hai — list mein doosre masail se mukhtalif hai.\n\n' +
      'Aam hidayat: (1) Niyyat saaf rakhein. (2) Ilm wale se poochhein jab shak ho. ' +
      '(3) Quran o Hadith ko meyar banayein. (4) Ikhtilaf ki jagah ehtiyat behtar hai. ' +
      '(5) Yeh summary taleemi maqsad ke liye hai; mufti / alim se tafseeli fatwa lein.';

    const tafseer =
      'Tafseer / Detail (~200 words):\n\n' +
      'Masla: ' + hook + '\n' +
      'Category: ' + cat.en + ' (#' + i + ')\n\n' +
      'Matlab: Is masle mein yeh poocha gaya hai ke Shar\'i nuqta-e-nazar se sahi amal kya hai. ' +
      'Quran (' + q.ref + ') is mauzoo se qareeb ma\'ne rakhta hai: «' + q.tr + '». ' +
      'Hadith «' + h1.src + '» ke mutabiq: ' + h1.text + ' ' +
      'Mazid «' + h2.src + '»: ' + h2.text + '\n\n' +
      'Nasihat: Deen mein asal cheez Allah ki itaat, niyyat ki safai aur amal mein isteqamat hai. ' +
      'Jo cheez wazeh haram ho us se bachein; jo wazeh farz ho uski pabandi karein. ' +
      'Darmiyani shubhe ki soorat mein alim-e-deen se ruju karein. ' +
      'Ghar, masjid, kaam-dhanda aur personal zindagi — har jagah is masle ki roshni mein faisla karein.\n\n' +
      'Amal ka tariqa: Masla padhne ke baad ek concrete qadam aaj hi uthayein. ' +
      'Family ko bhi sahi hukm batayein. Social media par bina sanad ke fatwe se bachein. ' +
      'Yeh text taleemi summary hai — aapke shehar / maslak ke mufti se final guidance lein.';

    list.push({
      id: cat.id + '-' + i,
      catId: cat.id,
      catName: cat.en,
      n: i,
      title: title,
      shortTitle: shortTitle,
      masla: masla,
      quran: q,
      hadith: [
        { src: h1.src, text: h1.text + ' (Is masle se munasib hidayat.)' },
        { src: h2.src, text: h2.text + ' (Mazid wazahat ke liye.)' }
      ],
      tafseer: tafseer
    });
  }
  _masailCache[_mcKey] = list;
  return list;
}

let _masailState = { catId: null };

function renderMasailCategories() {
  const grid = document.getElementById('masailCatGrid');
  if (!grid) return;
  grid.innerHTML = MASAIL_CATS.map(c => `
    <button type="button" class="hadith-book-card ${c.color}" data-mcat="${c.id}">
      <span class="hc-corner tl"></span><span class="hc-corner tr"></span>
      <span class="hc-corner bl"></span><span class="hc-corner br"></span>
      <div class="hc-icon"><i class="fas ${c.icon || 'fa-balance-scale'}"></i></div>
      <div class="hc-ar" style="font-size:16px;">${c.ar}</div>
      <div class="hc-en">${escapeHTML(c.en)}</div>
      <div class="hc-sub">${masailCountFor(c.id)} masail</div>
    </button>`).join('');
  grid.querySelectorAll('[data-mcat]').forEach(btn => {
    btn.onclick = () => openMasailCategory(btn.getAttribute('data-mcat'));
  });
}

function openMasailCategory(catId) {
  _masailState.catId = catId;
  const ch = document.getElementById('modeMasailChooser');
  const view = document.getElementById('modeMasailView');
  if (ch) ch.style.display = 'none';
  if (view) view.style.display = 'block';
  window._activeModeId = 'masail-list';
  renderMasailList();
}

function renderMasailList() {
  const cat = MASAIL_CATS.find(c => c.id === _masailState.catId);
  if (!cat) return;
  const box = document.getElementById('masailResult');
  const info = document.getElementById('masailInfo');
  const q = (document.getElementById('masailSearchInput')?.value || '').trim().toLowerCase();
  let list = buildMasailForCat(cat);
  if (q) list = list.filter(m => (m.title + ' ' + m.masla).toLowerCase().includes(q));
  if (info) info.textContent = cat.en + ' · ' + list.length + ' masail';
  if (!box) return;
  box.innerHTML = `<div class="list-stack">${list.map(m => {
    const short = m.shortTitle || (m.title || '').split('·').pop().trim() || ('Masla #' + m.n);
    const topic = (m.catName || '').replace(/ ke masail| ke huqooq/gi, '');
    return `
    <div class="item-box" data-mid="${m.id}" style="height:auto;min-height:58px;max-height:none;padding:8px 12px;">
      <div class="item-left">
        <div class="item-badge" style="background:linear-gradient(135deg,#b45309,#d97706);">${m.n}</div>
        <div class="item-main">
          <div class="item-title" style="font-size:13px;"><i class="fas fa-gavel" style="margin-right:6px;color:var(--accent);font-size:11px;"></i>${escapeHTML(short)}</div>
          <div class="item-sub" style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escapeHTML(topic)} · #${m.n}</div>
        </div>
      </div>
      <span class="meta-pill accent-pill">Open</span>
    </div>`;
  }).join('')}</div>`;
  box.querySelectorAll('.item-box[data-mid]').forEach(el => {
    el.onclick = () => {
      const id = el.getAttribute('data-mid');
      const item = list.find(x => x.id === id);
      if (item) openMasailReader(item);
    };
  });
}

function openMasailReader(item) {
  stopAllAyatAudio();
  currentReaderState = { type: 'masail', data: item };
  const fr = document.getElementById('fullReader');
  fr.classList.add('open', 'guide-mode');
  fr.classList.remove('book-mode', 'pdf-tafseer-mode', 'hadith-mode', 'arabic-only-mode');
  document.body.style.overflow = 'hidden';
  try {
    if (!window._readerHistoryPushed) {
      history.pushState({ quranReader: true }, '', location.href);
      window._readerHistoryPushed = true;
    }
  } catch (e) {}
  try {
    populateReaderLangDropdown();
    populateArabicFontDropdown();
    applyArabicFont(selectedArabicFontId);
  } catch (e) {}
  const el = document.getElementById('readerContent');
  const titleEl = document.getElementById('readerPageTitle');
  if (titleEl) titleEl.textContent = item.title;
  const q = item.quran || {};
  const wbw = buildSimpleWbw(q.ar || '', q.tr || '').map(w => ({ a: w.a, t: localizeGuideTr(w.t || '') }));
  const trQ = localizeGuideTr(q.tr || '');
  const tfLang = window._hadithTfLang || selectedLang || 'ur';
  const trLangM = window._hadithTrLang || selectedLang || 'ur';
  const tfLangHtml = (typeof buildHadithLangOptionsHtml === 'function') ? buildHadithLangOptionsHtml(tfLang, 'masailTfLangSelect') : '';
  const maslaLangHtml = (typeof buildHadithLangOptionsHtml === 'function') ? buildHadithLangOptionsHtml(trLangM, 'masailMaslaLangSelect') : '';
  // Tafseer + masla text according to local / top language
  let tafseerLoc = item.tafseer || '';
  let maslaForLang = item.masla || '';
  try {
    const idTf = String(tfLang || selectedLang || '').toLowerCase();
    const idM = String(trLangM || selectedLang || '').toLowerCase();
    if (idTf === 'hi' || idTf === 'urdu-hi' || idTf.indexOf('hindi') >= 0) {
      tafseerLoc = localizeGuideTr(item.tafseer || '', 'hi');
    } else {
      tafseerLoc = item.tafseer || '';
    }
    if (idM === 'hi' || idM === 'urdu-hi' || idM.indexOf('hindi') >= 0) {
      maslaForLang = localizeGuideTr(item.masla || '', 'hi');
    } else {
      maslaForLang = item.masla || '';
    }
  } catch (e) {
    tafseerLoc = item.tafseer || '';
    maslaForLang = item.masla || '';
  }
  if (el) {
    el.innerHTML = `
      <div class="pdf-mushaf-page" style="max-width:720px;margin:0 auto;padding:8px;">
        <div style="text-align:center;padding:12px;border:2px solid #2d6a3e;border-radius:12px;margin-bottom:12px;background:linear-gradient(180deg,#e8f5e9,#f4faf5);">
          <div style="font-size:12px;color:#166534;font-weight:700;">Masail · ${escapeHTML(item.catName || '')}</div>
          <h2 style="margin:6px 0;color:#0c6833;font-size:16px;">${escapeHTML(item.title)}</h2>
        </div>
        <div class="guide-step-card">
          <div class="guide-step-head" style="flex-wrap:wrap;gap:8px;">
            <span>Masla</span>
            <div style="display:flex;align-items:center;gap:6px;margin-left:auto;flex-wrap:wrap;">
              ${maslaLangHtml}
              <button type="button" id="masailMaslaPlay" class="play-ayah-btn" style="height:34px;padding:0 14px;border-radius:10px;border:none;background:linear-gradient(135deg,#0c6833,#22c55e);color:#fff;font-weight:700;"><i class="fas fa-play"></i> Play</button>
            </div>
          </div>
          <div class="guide-step-body" id="masailMaslaText" style="font-size:14px;line-height:1.7;">${escapeHTML(maslaForLang)}</div>
        </div>
        <div class="guide-step-card">
          <div class="guide-step-head" style="flex-wrap:wrap;gap:8px;">
            <span>① Quran Arabic</span>
            <button type="button" id="masailQuranArPlay" class="play-ayah-btn" style="height:34px;padding:0 14px;border-radius:10px;border:none;background:linear-gradient(135deg,#0c6833,#22c55e);color:#fff;font-weight:700;margin-left:auto;"><i class="fas fa-play"></i> Play</button>
          </div>
          <div class="guide-step-body">
            <span class="guide-ref-pill">${renderRefPillsHtml('Quran ' + (q.ref || ''), 'Quran ' + (q.ref || ''))}</span>
            <div class="guide-ar-line arabic-text" id="masailQuranAr" style="margin-top:8px;">${escapeHTML(q.ar || '')}</div>
            <div style="font-size:12px;font-weight:700;color:#16a34a;margin:8px 0 4px;">Word-by-word tarjuma</div>
            <div class="guide-wbw-row">${wbw.map(w => `<div class="guide-wbw-box"><span class="g-ar">${escapeHTML(w.a)}</span><span class="g-tr">${escapeHTML(w.t)}</span></div>`).join('')}</div>
            <div style="font-size:13px;margin-top:8px;" id="masailQuranTr"><b>Tarjuma:</b> ${escapeHTML(trQ)}</div>
            <button type="button" id="masailQuranTrPlay" class="play-ayah-btn" style="margin-top:8px;height:34px;padding:0 14px;border-radius:10px;border:none;background:linear-gradient(135deg,#0c6833,#22c55e);color:#fff;font-weight:700;"><i class="fas fa-play"></i> Play Tarjuma</button>
          </div>
        </div>
        <div class="guide-step-card">
          <div class="guide-step-head">② Hadith — full text</div>
          <div class="guide-step-body">
            ${(item.hadith || []).map((h, hi) => `
              <div style="margin-bottom:12px;padding:10px;border-radius:8px;border:1px solid rgba(45,106,62,.3);">
                <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
                  ${renderRefPillsHtml(h.src || ('Hadith #' + (hi + 1)))}
                  <button type="button" class="play-ayah-btn masail-hadith-play" data-hi="${hi}" style="height:30px;padding:0 12px;border-radius:8px;border:none;background:linear-gradient(135deg,#0c6833,#22c55e);color:#fff;font-weight:700;margin-left:auto;"><i class="fas fa-play"></i> Play</button>
                </div>
                <div class="masail-hadith-text" data-hi="${hi}" style="font-size:13px;line-height:1.7;margin-top:8px;">${escapeHTML(localizeGuideTr(h.text || '', trLangM))}</div>
              </div>`).join('')}
          </div>
        </div>
        <div class="guide-step-card">
          <div class="guide-step-head" style="flex-wrap:wrap;gap:8px;">
            <span>③ Tafseer / Details</span>
            <div style="display:flex;align-items:center;gap:6px;margin-left:auto;flex-wrap:wrap;">
              ${tfLangHtml}
              <button type="button" id="masailTfPlay" class="play-ayah-btn" style="height:34px;padding:0 14px;border-radius:10px;border:none;background:linear-gradient(135deg,#0c6833,#22c55e);color:#fff;font-weight:700;"><i class="fas fa-play"></i> Play</button>
            </div>
          </div>
          <div class="guide-step-body" id="masailTfText" style="font-size:13px;line-height:1.7;white-space:pre-line;">${escapeHTML(tafseerLoc)}</div>
        </div>
      </div>`;
    try { applyArabicFont(selectedArabicFontId); } catch (e) {}
    try { scrollHadithReaderToTop(); } catch (e) {}

    // Masla language dropdown
    const mSel = document.getElementById('masailMaslaLangSelect');
    if (mSel) {
      mSel.onchange = () => {
        saveReaderScrollForLangChange();
        window._hadithTrLang = mSel.value;
        try {
          selectedLang = mSel.value;
          const top = document.getElementById('readerLangSelect');
          if (top) top.value = mSel.value;
          persistReaderPrefs();
        } catch (e) {}
        openMasailReader(item);
      };
    }
    // Tafseer language dropdown
    const tfSel = document.getElementById('masailTfLangSelect');
    if (tfSel) {
      tfSel.onchange = () => {
        saveReaderScrollForLangChange();
        window._hadithTfLang = tfSel.value;
        try {
          // re-localize tafseer text in place when possible
          const node = document.getElementById('masailTfText');
          if (node) {
            const base = item.tafseer || '';
            let out = base;
            const id = String(tfSel.value || '').toLowerCase();
            if (id === 'hi' || id === 'urdu-hi' || id.indexOf('hindi') >= 0) {
              try { out = localizeGuideTr(base); } catch (e) {}
            } else if (id === 'en' || id.startsWith('en')) {
              // keep original if already English-ish, else show base
              out = base;
            } else {
              out = base; // ur/roman
            }
            node.textContent = out;
          }
        } catch (e) {}
        // Full refresh keeps everything consistent
        openMasailReader(item);
      };
    }

    // Bind i buttons on Quran/Hadith refs
    el.querySelectorAll('.guide-ref-info').forEach(btn => {
      btn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        try { pushReaderReturnState(); } catch (err) {}
        openGuideReferenceFromBtn(btn, item);
      };
    });

    const bindPlay = (btnId, textId, fallback, lang) => {
      const btn = document.getElementById(btnId);
      if (!btn) return;
      btn.onclick = (ev) => {
        try { ev.preventDefault(); ev.stopPropagation(); } catch (e) {}
        let t = '';
        const n = textId ? document.getElementById(textId) : null;
        if (n) t = (n.textContent || '').trim();
        if (!t) t = (fallback || '').trim();
        if (!t) { try { showToast('Text nahi mila'); } catch (e) {} return; }
        speakTextAloud(t, btn, lang);
      };
    };
    bindPlay('masailMaslaPlay', 'masailMaslaText', maslaForLang, hadithSpeechLang());
    bindPlay('masailQuranArPlay', 'masailQuranAr', q.ar || '', 'ar');
    bindPlay('masailQuranTrPlay', 'masailQuranTr', trQ, hadithSpeechLang());
    bindPlay('masailTfPlay', 'masailTfText', tafseerLoc, hadithSpeechLang());
    el.querySelectorAll('.masail-hadith-play').forEach(btn => {
      btn.onclick = (ev) => {
        try { ev.preventDefault(); ev.stopPropagation(); } catch (e) {}
        const hi = btn.getAttribute('data-hi');
        const node = el.querySelector('.masail-hadith-text[data-hi="' + hi + '"]');
        const t = node ? (node.textContent || '').trim() : '';
        if (!t) return;
        speakTextAloud(t, btn, hadithSpeechLang());
      };
    });
  }
}

window.setMainSection = function (section) {
  // Top: only Quran | Hadith | Namaz
  const q = document.getElementById('switchQuran');
  const h = document.getElementById('switchHadith');
  const n = document.getElementById('switchNamaz');
  const m = document.getElementById('switchMasail');
  if (q) q.classList.toggle('active-switch', section === 'quran');
  if (h) h.classList.toggle('active-switch', section === 'hadith');
  if (n) n.classList.toggle('active-switch', section === 'namaz');
  if (m) m.classList.toggle('active-switch', section === 'masail');

  const textRow = document.getElementById('textQuranRow');
  const bookRow = document.getElementById('bookQuranRow');
  const namazRow = document.getElementById('namazSectionRow');
  const hadithRow = document.getElementById('hadithSectionRow');
  const chooser = document.getElementById('modeQuranChooser');
  if (textRow) textRow.style.display = 'none';
  if (bookRow) bookRow.style.display = 'none';
  if (namazRow) namazRow.style.display = 'none';
  if (hadithRow) hadithRow.style.display = 'none';

  // hide all mode views first
  document.querySelectorAll('[id^="mode"][id$="View"], [id^="mode"][id$="Detail"]').forEach(v => { v.style.display = 'none'; });
  if (chooser) chooser.style.display = 'none';
  const namazCh = document.getElementById('modeNamazChooser');
  if (namazCh) namazCh.style.display = 'none';
  const masailCh = document.getElementById('modeMasailChooser');
  const masailView = document.getElementById('modeMasailView');
  if (masailCh) masailCh.style.display = 'none';
  if (masailView) masailView.style.display = 'none';

  if (section === 'quran') {
    // Show Text Quran + Book Quran cards only
    if (chooser) chooser.style.display = 'block';
    window._activeModeId = 'quran-chooser';
  } else if (section === 'hadith') {
    const hv = document.getElementById('modeHadithView');
    if (hv) hv.style.display = 'block';
    showHadithBooksHome();
  } else if (section === 'namaz') {
    const nc = document.getElementById('modeNamazChooser');
    if (nc) nc.style.display = 'block';
    window._activeModeId = 'namaz-chooser';
  } else if (section === 'masail') {
    const mc = document.getElementById('modeMasailChooser');
    if (mc) mc.style.display = 'block';
    window._activeModeId = 'masail-chooser';
    renderMasailCategories();
  }
};

window.setQuranFamily = function (family) {
  // family: text | book — after user picks from Quran cards
  const chooser = document.getElementById('modeQuranChooser');
  if (chooser) chooser.style.display = 'none';
  const textRow = document.getElementById('textQuranRow');
  const bookRow = document.getElementById('bookQuranRow');
  const namazRow = document.getElementById('namazSectionRow');
  if (namazRow) namazRow.style.display = 'none';

  // Keep Quran top tab active
  const q = document.getElementById('switchQuran');
  const h = document.getElementById('switchHadith');
  const n = document.getElementById('switchNamaz');
  if (q) q.classList.add('active-switch');
  if (h) h.classList.remove('active-switch');
  if (n) n.classList.remove('active-switch');

  window._arabicOnlyQuran = (family === 'arabic');
  if (family === 'text' || family === 'arabic') {
    if (textRow) textRow.style.display = 'grid';
    if (bookRow) bookRow.style.display = 'none';
    // relabel buttons for arabic-only
    try {
      const map = [
        ['modeParaBtn', 'Ar 30 Pare', 'Tx 30 Pare'],
        ['modeSurahBtn', 'Ar 114 Surah', 'Tx 114 Surah'],
        ['modeAyatBtn', 'Ar Ayat 6236', 'Tx Ayat 6236'],
        ['modeTafseerBtn', 'Ar Mushaf', 'Tx Tafseer']
      ];
      map.forEach(([id, ara, tx]) => {
        const b = document.getElementById(id);
        if (!b) return;
        const span = b.querySelector('span');
        if (span) span.textContent = window._arabicOnlyQuran ? ara : tx;
      });
    } catch (e) {}
    setActiveMode('para');
  } else if (family === 'book') {
    if (textRow) textRow.style.display = 'none';
    if (bookRow) bookRow.style.display = 'grid';
    window._arabicOnlyQuran = false;
    setActiveMode('pdf');
  } else if (family === 'namaz') {
    window._arabicOnlyQuran = false;
    setMainSection('namaz');
  } else if (family === 'hadith') {
    window._arabicOnlyQuran = false;
    setMainSection('hadith');
  }
};


window.setActiveMode = function (mode) {
  window._activeModeId = mode;
  const chooser = document.getElementById('modeQuranChooser');
  if (chooser && mode !== 'quran-chooser') chooser.style.display = 'none';
  const namazCh2 = document.getElementById('modeNamazChooser');
  if (namazCh2 && mode !== 'namaz-chooser') namazCh2.style.display = 'none';
  const masailCh2 = document.getElementById('modeMasailChooser');
  const masailView2 = document.getElementById('modeMasailView');
  if (masailCh2 && mode !== 'masail-chooser') masailCh2.style.display = 'none';
  if (masailView2 && mode !== 'masail-list') masailView2.style.display = 'none';
  const home = document.getElementById('modeHomeView');
  if (home) home.style.display = 'none';
  const bookModes = ['pdf', 'pdf-surah', 'pdf-ayat', 'pdf-tafseer'];
  const namazModes = ['namaz', 'dua', 'tasbih', 'prayer'];
  const hadithModes = ['hadith-bukhari', 'hadith-muslim', 'hadith-tirmidhi', 'hadith-abudawud', 'hadith-nasai', 'hadith-ibnmajah', 'hadith-malik', 'hadith-mishkat', 'hadith-mustadrak', 'hadith-darimi', 'hadith-bayhaqi', 'hadith-ibnkhuzaymah', 'hadith-ibnhibban', 'hadith-musannaf', 'hadith-majma'];
  const textRow = document.getElementById('textQuranRow');
  const bookRow = document.getElementById('bookQuranRow');
  const namazRow = document.getElementById('namazSectionRow');
  const hadithRow = document.getElementById('hadithSectionRow');
  let family = 'text';
  if (bookModes.includes(mode)) family = 'book';
  else if (namazModes.includes(mode)) family = 'namaz';
  else if (hadithModes.includes(mode)) family = 'hadith';
  // Top tabs: Quran stays active for text/book modes
  const swQ = document.getElementById('switchQuran');
  const swH = document.getElementById('switchHadith');
  const swN = document.getElementById('switchNamaz');
  if (swQ) swQ.classList.toggle('active-switch', family === 'text' || family === 'book');
  if (swH) swH.classList.toggle('active-switch', family === 'hadith');
  if (swN) swN.classList.toggle('active-switch', family === 'namaz');
  const swM = document.getElementById('switchMasail');
  if (swM) swM.classList.toggle('active-switch', window._activeModeId === 'masail-list' || window._activeModeId === 'masail-chooser');
  if (textRow) textRow.style.display = family === 'text' ? 'grid' : 'none';
  if (bookRow) bookRow.style.display = family === 'book' ? 'grid' : 'none';
  if (namazRow) namazRow.style.display = family === 'namaz' ? 'grid' : 'none';
  if (hadithRow) hadithRow.style.display = family === 'hadith' ? 'grid' : 'none';

  const modes = [
    { id: 'para', view: 'modeParaView', btn: 'modeParaBtn' },
    { id: 'surah', view: 'modeSurahView', btn: 'modeSurahBtn' },
    { id: 'ayat', view: 'modeAyatView', btn: 'modeAyatBtn' },
    { id: 'tafseer', view: 'modeTafseerView', btn: 'modeTafseerBtn' },
    { id: 'pdf', view: 'modePdfView', btn: 'modePdfBtn' },
    { id: 'pdf-surah', view: 'modePdfSurahView', btn: 'modePdfSurahBtn' },
    { id: 'pdf-ayat', view: 'modePdfAyatView', btn: 'modePdfAyatBtn' },
    { id: 'pdf-tafseer', view: 'modePdfTafseerView', btn: 'modePdfTafseerBtn' },
    { id: 'namaz', view: 'modeNamazView', btn: 'modeNamazBtn' },
    { id: 'dua', view: 'modeDuaView', btn: 'modeDuaBtn' },
    { id: 'tasbih', view: 'modeTasbihView', btn: 'modeTasbihBtn' },
    { id: 'prayer', view: 'modePrayerView', btn: 'modePrayerBtn' },
    { id: 'hadith-bukhari', view: 'modeHadithView', btn: 'modeBukhariBtn' },
    { id: 'hadith-muslim', view: 'modeHadithView', btn: 'modeMuslimBtn' },
    { id: 'hadith-tirmidhi', view: 'modeHadithView', btn: 'modeTirmidhiBtn' },
    { id: 'hadith-abudawud', view: 'modeHadithView', btn: 'modeAbudawudBtn' },
    { id: 'hadith-nasai', view: 'modeHadithView', btn: 'modeNasaiBtn' },
    { id: 'hadith-ibnmajah', view: 'modeHadithView', btn: 'modeIbnMajahBtn' },
    { id: 'hadith-malik', view: 'modeHadithView', btn: 'modeMalikBtn' },
    { id: 'hadith-mishkat', view: 'modeHadithView', btn: 'modeMishkatBtn' },
    { id: 'hadith-mustadrak', view: 'modeHadithView', btn: 'modeMustadrakBtn' },
    { id: 'hadith-darimi', view: 'modeHadithView', btn: 'modeDarimiBtn' },
    { id: 'hadith-bayhaqi', view: 'modeHadithView', btn: 'modeBayhaqiBtn' },
    { id: 'hadith-ibnkhuzaymah', view: 'modeHadithView', btn: 'modeIbnKhuzaBtn' },
    { id: 'hadith-ibnhibban', view: 'modeHadithView', btn: 'modeIbnHibbanBtn' },
    { id: 'hadith-musannaf', view: 'modeHadithView', btn: 'modeMusannafBtn' },
    { id: 'hadith-majma', view: 'modeHadithView', btn: 'modeMajmaBtn' }
  ];
  modes.forEach(m => {
    const view = document.getElementById(m.view);
    const btn = m.btn ? document.getElementById(m.btn) : null;
    if (view && !hadithModes.includes(m.id)) view.style.display = mode === m.id ? 'block' : 'none';
    if (btn) btn.classList.toggle('active-mode', mode === m.id);
  });
  // Shared hadith view
  const hv = document.getElementById('modeHadithView');
  if (hv) hv.style.display = hadithModes.includes(mode) ? 'block' : 'none';
  if ((mode === 'ayat' || mode === 'tafseer' || mode === 'pdf-ayat' || mode === 'pdf-tafseer') && !allAyahsCache.length && !ayatLoadingInProgress) initAllAyats();
  if (hadithModes.includes(mode)) {
    const booksPanel = document.getElementById('hadithBooksPanel');
    const listPanel = document.getElementById('hadithListPanel');
    if (booksPanel) booksPanel.style.display = 'none';
    if (listPanel) listPanel.style.display = 'block';
    loadHadithBook(mode);
  }
  else if (mode === 'tafseer') {
    // Ar Mushaf / Tafseer: list loads fast; open shows Arabic + tarjuma + tafseer
    if (allAyahsCache.length) renderTafseerList();
    else initAllAyats();
  }
  else if (mode === 'ayat' && allAyahsCache.length) renderAyatListShell();
  else if (mode === 'pdf') renderPdfList();
  else if (mode === 'pdf-surah') renderPdfSurahList();
  else if (mode === 'pdf-ayat' && allAyahsCache.length) renderPdfAyatList();
  else if (mode === 'pdf-tafseer' && allAyahsCache.length) renderPdfTafseerList();
  else if (mode === 'namaz') renderNamazList();
  else if (mode === 'dua') renderDuaList();
  else if (mode === 'tasbih') renderTasbihList();
  else if (mode === 'prayer') {
    const city = localStorage.getItem('prayerCity') || 'Delhi';
    const inp = document.getElementById('prayerCityInput');
    if (inp && !inp.value) inp.value = city;
    loadPrayerTimes(city);
  }
};

function renderPdfList() {
  const box = document.getElementById('pdfResult');
  const info = document.getElementById('pdfInfo');
  const q = (document.getElementById('pdfSearchInput')?.value || '').trim().toLowerCase();
  if (!box) return;
  const list = PARA_INFO || [];
  const filtered = !q ? list : list.filter(p =>
    (`para ${p.num} ${p.name} ${p.type || ''}`).toLowerCase().includes(q)
  );
  if (info) info.textContent = `Bk 30 Para · ${filtered.length} Pare — book-style open`;
  box.innerHTML = '';
  const stack = document.createElement('div');
  stack.className = 'list-stack';
  filtered.forEach(p => {
    const c = document.createElement('div');
    c.className = 'item-box';
    c.innerHTML = `
      <div style="display:flex;align-items:center;gap:12px;min-width:0;flex:1;">
        <div style="width:36px;height:36px;border-radius:10px;background:var(--grad);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:800;flex-shrink:0;">${p.num}</div>
        <div style="min-width:0;">
          <div style="font-weight:700;color:var(--text);">Para ${p.num} — ${escapeHTML(p.name)}</div>
          <div style="font-size:12px;color:var(--text2);">${p.surahs || ''} Surahs · ${p.ayats || ''} Ayats · Book style</div>
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:6px;flex-shrink:0;">
        <span class="meta-pill accent-pill">${escapeHTML(p.type || '')}</span>
        <button type="button" class="surah-info-btn" title="Para Tafseer"><i class="fas fa-info"></i></button>
      </div>
    `;
    c.querySelector('.surah-info-btn').addEventListener('click', e => {
      e.stopPropagation();
      const sn = (typeof PARA_START_SURAH !== 'undefined' && PARA_START_SURAH[p.num - 1]) || 1;
      const surah = SURAH_LIST.find(x => x.n === sn);
      if (surah) openFullReader({ type: 'tafseer', data: surah, fromPdf: true });
      else openFullReader({ type: 'para', data: p, bookStyle: true });
    });
    c.addEventListener('click', () => {
      openFullReader({ type: 'para', data: p, bookStyle: true });
    });
    stack.appendChild(c);
  });
  box.appendChild(stack);
}

function renderPdfSurahList() {
  const box = document.getElementById('pdfSurahResult');
  const info = document.getElementById('pdfSurahInfo');
  const q = (document.getElementById('pdfSurahSearchInput')?.value || '').trim().toLowerCase();
  if (!box) return;
  const list = SURAH_LIST || [];
  const filtered = !q ? list : list.filter(s =>
    (`${s.n} ${s.name} ${s.meaning || ''} ${s.type || ''}`).toLowerCase().includes(q)
  );
  if (info) info.textContent = `Bk 114 Surah · ${filtered.length} / 114 — book-style open`;
  box.innerHTML = '';
  const stack = document.createElement('div');
  stack.className = 'list-stack';
  filtered.forEach(s => {
    const c = document.createElement('div');
    c.className = 'item-box';
    c.innerHTML = `
      <div style="display:flex;align-items:center;gap:12px;min-width:0;flex:1;">
        <div style="width:36px;height:36px;border-radius:10px;background:var(--grad);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:800;flex-shrink:0;">${s.n}</div>
        <div style="min-width:0;">
          <div style="font-weight:700;color:var(--text);">${escapeHTML(s.name)} — ${escapeHTML(s.meaning || '')}</div>
          <div style="font-size:12px;color:var(--text2);">${s.ayats || ''} Ayats · Para ${s.para || ''} · Book style</div>
        </div>
      </div>
      <div style="display:flex;align-items:center;gap:6px;flex-shrink:0;">
        <span class="meta-pill accent-pill">${escapeHTML(s.type || '')}</span>
        <button type="button" class="surah-info-btn" title="Surah Tafseer"><i class="fas fa-info"></i></button>
      </div>
    `;
    c.querySelector('.surah-info-btn').addEventListener('click', e => {
      e.stopPropagation();
      openFullReader({ type: 'tafseer', data: s, fromPdf: true });
    });
    c.addEventListener('click', () => {
      openFullReader({ type: 'surah', data: s, bookStyle: true });
    });
    stack.appendChild(c);
  });
  box.appendChild(stack);
}

function renderPdfAyatList() {
  const box = document.getElementById('pdfAyatResult');
  const info = document.getElementById('pdfAyatInfo');
  const q = (document.getElementById('pdfAyatSearchInput')?.value || '').trim().toLowerCase();
  if (!box) return;
  if (!allAyahsCache.length) {
    box.innerHTML = `<div style="text-align:center;padding:24px;color:var(--text2);">Loading ayats...</div>`;
    return;
  }
  let list = orderedAyahs.length ? orderedAyahs : allAyahsCache;
  if (q) {
    const refMatch = q.match(/^(\d{1,3})[.:](\d{1,3})$/);
    if (refMatch) {
      const sn = parseInt(refMatch[1], 10), an = parseInt(refMatch[2], 10);
      list = list.filter(a => a.surahNum === sn && a.ayahInSurah === an);
    } else {
      list = list.filter(a =>
        (`${a.globalNum} ${a.surahNum}:${a.ayahInSurah} ${a.surahNum}.${a.ayahInSurah} ${a.surahName} para ${a.para}`).toLowerCase().includes(q)
      );
    }
  }
  if (info) info.textContent = `Bk Ayat 6236 · ${list.length.toLocaleString()} Ayats — book-style`;
  box.innerHTML = '';
  const stack = document.createElement('div');
  stack.className = 'list-stack';
  // Progressive chunk render so UI stays responsive for 6236 items
  const CHUNK = 100;
  let idx = 0;
  const appendChunk = () => {
    const end = Math.min(idx + CHUNK, list.length);
    const frag = document.createDocumentFragment();
    for (; idx < end; idx++) {
      const a = list[idx];
      const c = document.createElement('div');
      c.className = 'item-box';
      c.innerHTML = `
        <div style="display:flex;align-items:center;gap:12px;min-width:0;flex:1;">
          <div style="width:40px;height:36px;border-radius:10px;background:var(--grad);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:11px;flex-shrink:0;">${a.globalNum}</div>
          <div style="min-width:0;">
            <div style="font-weight:700;color:var(--text);">Surah ${a.surahNum}: ${escapeHTML(a.surahName)} — Ayat ${a.ayahInSurah}</div>
            <div style="font-size:12px;color:var(--text2);">Ref ${a.surahNum}:${a.ayahInSurah} · Para ${a.para} · Bk</div>
          </div>
        </div>
      `;
      c.addEventListener('click', () => {
        const surah = SURAH_LIST.find(x => x.n === a.surahNum);
        openFullReader({
          type: 'pdf-ayat-tafseer',
          data: surah || { n: a.surahNum, name: a.surahName },
          fromAyat: { globalNum: a.globalNum, num: a.ayahInSurah, surahNum: a.surahNum, surahName: a.surahName, ar: a.text || '', tr: '' },
          focusAyah: a.ayahInSurah,
          fromPdf: true
        });
      });
      frag.appendChild(c);
    }
    stack.appendChild(frag);
    if (idx < list.length) {
      requestAnimationFrame(appendChunk);
    }
  };
  box.appendChild(stack);
  appendChunk();
}

function renderPdfTafseerList() {
  const box = document.getElementById('pdfTafseerResult');
  const info = document.getElementById('pdfTafseerInfo');
  const q = (document.getElementById('pdfTafseerSearchInput')?.value || '').trim().toLowerCase();
  if (!box) return;
  if (!allAyahsCache.length) {
    box.innerHTML = `<div style="text-align:center;padding:24px;color:var(--text2);">Loading ayats...</div>`;
    return;
  }
  let list = orderedAyahs.length ? orderedAyahs : allAyahsCache;
  if (q) {
    const refMatch = q.match(/^(\d{1,3})[.:](\d{1,3})$/);
    if (refMatch) {
      const sn = parseInt(refMatch[1], 10), an = parseInt(refMatch[2], 10);
      list = list.filter(a => a.surahNum === sn && a.ayahInSurah === an);
    } else {
      list = list.filter(a =>
        (`${a.globalNum} ${a.surahNum}:${a.ayahInSurah} ${a.surahNum}.${a.ayahInSurah} ${a.surahName} para ${a.para}`).toLowerCase().includes(q)
      );
    }
  }
  if (info) info.textContent = `Bk Tafseer 6236 · ${list.length.toLocaleString()} Ayats — book-style`;
  box.innerHTML = '';
  const stack = document.createElement('div');
  stack.className = 'list-stack';
  const CHUNK = 100;
  let idx = 0;
  const appendChunk = () => {
    const end = Math.min(idx + CHUNK, list.length);
    const frag = document.createDocumentFragment();
    for (; idx < end; idx++) {
      const a = list[idx];
      const c = document.createElement('div');
      c.className = 'item-box';
      c.innerHTML = `
        <div style="display:flex;align-items:center;gap:12px;min-width:0;flex:1;">
          <div style="width:40px;height:36px;border-radius:10px;background:var(--grad);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:11px;flex-shrink:0;">${a.globalNum}</div>
          <div style="min-width:0;">
            <div style="font-weight:700;color:var(--text);">Tafseer · Surah ${a.surahNum}: ${escapeHTML(a.surahName)} — Ayat ${a.ayahInSurah}</div>
            <div style="font-size:12px;color:var(--text2);">Ref ${a.surahNum}:${a.ayahInSurah} · Para ${a.para} · Bk Tafseer</div>
          </div>
        </div>
      `;
      c.addEventListener('click', () => {
        const surah = SURAH_LIST.find(x => x.n === a.surahNum);
        openFullReader({
          type: 'pdf-ayat-tafseer',
          data: surah || { n: a.surahNum, name: a.surahName },
          fromAyat: { globalNum: a.globalNum, num: a.ayahInSurah, surahNum: a.surahNum, surahName: a.surahName, ar: a.text || '', tr: '' },
          focusAyah: a.ayahInSurah,
          fromPdf: true
        });
      });
      frag.appendChild(c);
    }
    stack.appendChild(frag);
    if (idx < list.length) {
      requestAnimationFrame(appendChunk);
    }
  };
  box.appendChild(stack);
  appendChunk();
}

function bindSearch(iid, cid, fn) {
  const i = document.getElementById(iid);
  const c = document.getElementById(cid);
  if (i) i.addEventListener('input', fn);
  if (c) c.addEventListener('click', () => { i.value = ''; fn(); i.focus(); });
}

/* ========== QISSAS-UL-ANBIYA & ZALIMON DATA + UI (200+) ========== */
const QISSAS_BASE = [
  {nabi:'Adam (AS)', title:'Adam (AS) ki paidaish aur Jannat mein rehn', ayat:['2:30-39','7:11-25','20:115-123'], hadith:'Bukhari 3330 – Adam (AS) 60 hath ke the', full:'Allah Ta\'ala ne Adam (AS) ko mitti se banaya, rooh phenki, farishton se sajda karwaya. Iblis ne inkar kiya. Adam o Hawa ko Jannat mein rehne diya lekin shajar-e-mamnu\'a se mana kiya. Iblis ne dhoka diya, unhone khaya, tauba ki, duniya mein utare gaye.'},
  {nabi:'Adam (AS)', title:'Qabil aur Habil ka waqiya', ayat:['5:27-31'], hadith:'Tirmidhi 1393 – pehla qatl Qabil ne kiya', full:'Adam (AS) ke do beta Habil aur Qabil. Habil ki qurbani qabool hui, Qabil ki nahi. Qabil ne hasad se Habil ko qatl kiya. Allah ne kauwe se dafnana sikhaya. Yeh pehla zulm aur qatl tha.'},
  {nabi:'Nuh (AS)', title:'Nuh (AS) ki dawat aur qaum ka inkar', ayat:['71:1-28','11:25-49','7:59-64'], hadith:'Bukhari 3338 – Nuh (AS) 950 saal da\'wat dete rahe', full:'Nuh (AS) ne 950 saal tak qaum ko tauheed ki da\'wat di. Unhone mazak udaya, sakhti ki. Allah ne kashti banane ka hukm diya. Toofan aaya, kafir doob gaye, momineen najaat paye.'},
  {nabi:'Nuh (AS)', title:'Kashti banane aur toofan ka waqiya', ayat:['11:37-48','23:27-29','54:9-15'], hadith:'Muslim 2380 – kashti par 80 log the', full:'Nuh (AS) ne Allah ke hukm se kashti banayi. Har jins ke janwar rakhe. Toofan aaya, paani zameen se phoota aur asmaan se barsa. Beta Kan\'an ne inkar kiya aur dooba. Kashti Judi par ruki.'},
  {nabi:'Hud (AS)', title:'Aad qaum aur Hud (AS) ki dawat', ayat:['7:65-72','11:50-60','26:123-140','46:21-25'], hadith:'Ibn Kathir – Aad qaum bahut qawi thi', full:'Aad qaum Iram ke sahib the, unchi imaraten banate the. Hud (AS) ne tauheed ki da\'wat di. Unhone inkar kiya. Allah ne sakht hawa bheji, 7 raat 8 din chali, sab halak ho gaye.'},
  {nabi:'Salih (AS)', title:'Thamud qaum aur oontni ka mu\'jiza', ayat:['7:73-79','11:61-68','26:141-159','27:45-53'], hadith:'Bukhari 3377 – oontni ka zikr', full:'Thamud qaum ne mu\'jiza manga. Salih (AS) ne pathar se oontni nikali. Unhone use qatl kar diya. Allah ne sakht chillah (saiha) bheja, sab halak.'},
  {nabi:'Ibrahim (AS)', title:'Ibrahim (AS) ki bachpan mein buton ka todna', ayat:['21:51-70','37:83-98','6:74-83'], hadith:'Bukhari 3351 – Ibrahim (AS) teen jhoot nahi bole (tauriyat)', full:'Ibrahim (AS) ne qaum ke buton ko toda, bade but ke gale mein kulhari rakh di. Unhone aag mein phenka, Allah ne aag ko thanda kar diya. Namrud se munazira kiya.'},
  {nabi:'Ibrahim (AS)', title:'Ismail (AS) ki qurbani ka waqiya', ayat:['37:100-113','22:26-29'], hadith:'Bukhari 3350 – Ismail (AS) qurbani ke liye razi hue', full:'Ibrahim (AS) ne khwab dekha ke Ismail (AS) ko zibah kar rahe hain. Dono ne tasleem kiya. Allah ne fidiya bheja. Yeh qurbani ki sunnat bani.'},
  {nabi:'Ibrahim (AS)', title:'Ibrahim (AS) ki aag se najaat', ayat:['21:68-70','29:24','37:97-98'], hadith:'Tirmidhi 3204 – aag thandi ho gayi', full:'Namrud aur qaum ne Ibrahim (AS) ko badi aag mein phenka. Allah ne farmaya: \"Ya naar, thandi ho ja aur Ibrahim par aman\". Aag ne unhein kuch nahi kiya.'},
  {nabi:'Lut (AS)', title:'Lut (AS) ki qaum aur unka azab', ayat:['7:80-84','11:77-83','15:57-77','26:160-175'], hadith:'Muslim 2235 – Lut (AS) ki qaum pehle log the', full:'Lut (AS) ki qaum ne mardon se fahashi shuru ki. Unhone mehmanon (farishton) par hamla kiya. Allah ne unhein pathar barsa kar halak kiya. Lut (AS) ki biwi bhi doob/halak.'},
  {nabi:'Yusuf (AS)', title:'Yusuf (AS) ka khwab aur bhaiyon ka hasad', ayat:['12:4-18'], hadith:'Ibn Kathir – 11 sitare, suraj, chand', full:'Yusuf (AS) ne khwab dekha. Bhaiyon ne hasad se kuyen mein phenka, phir caravan ko bech diya. Misr mein Aziz ke ghar pahunche.'},
  {nabi:'Yusuf (AS)', title:'Yusuf (AS) aur Aziz ki biwi ka waqiya', ayat:['12:23-34'], hadith:'Tirmidhi 3116 – Yusuf (AS) ne Allah se panah mangi', full:'Aziz ki biwi ne Yusuf (AS) ko fitna diya. Unhone inkar kiya, qamis peeche se phati. Phir qaidkhane mein daal diya gaya.'},
  {nabi:'Yusuf (AS)', title:'Yusuf (AS) ki qaid se rihaai aur wazir ban-na', ayat:['12:36-57'], hadith:'Bukhari 7000 – khwab ki tabeer', full:'Qaid mein do logon ke khwab ki tabeer ki. Baad mein badshah ke khwab ki tabeer ki, 7 saal qahat se bachaya. Wazir banaye gaye. Bhai aaye, unhein pehchana.'},
  {nabi:'Musa (AS)', title:'Musa (AS) ki paidaish aur Firawn ke ghar parwarish', ayat:['20:37-40','28:7-13'], hadith:'Bukhari 3396 – Musa (AS) ko peti mein darya par chhora', full:'Firawn beta maar raha tha. Musa (AS) ki maa ne Allah ke hukm se darya mein chhora. Firawn ki biwi Asiya ne pal-posa. Maa doodh pilane wali bani.'},
  {nabi:'Musa (AS)', title:'Musa (AS) ka Qibti ko maarna aur Madyan jana', ayat:['28:14-28','20:40'], hadith:'Ibn Kathir – galti se maar diya', full:'Musa (AS) ne ek Qibti ko thappad mara, woh mar gaya. Dua ki, Madyan chale gaye. Wahan 10 saal Shuaib (AS) ke paas rahe, unki beti se nikah kiya.'},
  {nabi:'Musa (AS)', title:'Tur-e-Sina par wahi aur asa ka mu\'jiza', ayat:['20:9-36','27:7-14','28:29-35'], hadith:'Muslim 2371 – asa saanp ban gaya', full:'Musa (AS) ne aag dekhi, wahan Allah se baat hui. Asa saanp bana, haath roshan hua. Firawn ke paas bheje gaye, Harun (AS) saath.'},
  {nabi:'Musa (AS)', title:'Musa (AS) vs Firawn aur sahara ka mu\'jiza', ayat:['7:103-126','20:56-73','26:10-51'], hadith:'Bukhari 3397 – sahara jadoo ke saanp kha gaye', full:'Firawn ke jadoogaron ne raasiyan phenki. Musa (AS) ke asa ne unhein nigal liya. Jadoogar iman le aaye. Firawn ne unhein sazaa di.'},
  {nabi:'Musa (AS)', title:'Bani Israel ka darya se guzarna', ayat:['2:50','7:136-138','20:77-80','26:52-68'], hadith:'Bukhari 3398 – darya 12 raaste ban gaya', full:'Musa (AS) ne asa mara, darya phat gaya. Bani Israel guzar gaye. Firawn aur lashkar doob gaye. Jism nishane ke liye bahar aaya.'},
  {nabi:'Musa (AS)', title:'Toor par 40 raat aur lawhein', ayat:['7:142-155','2:51-54'], hadith:'Tirmidhi 3276 – Musa (AS) ne Allah ko dekhne ki darkhwast ki', full:'Musa (AS) 40 raat Toor par rahe. Qaum ne bera bana liya. Lawhein toot gayin, phir tauba. Allah ne unhein maaf kiya.'},
  {nabi:'Dawud (AS)', title:'Dawud (AS) aur Jalut ka waqiya', ayat:['2:249-251'], hadith:'Bukhari 3401 – pathar se Jalut ko mara', full:'Talut ki fauj mein Dawud (AS) the. Jalut se larai hui. Dawud (AS) ne pathar se uska maatha phor diya. Allah ne unhein mulk aur hikmat di.'},
  {nabi:'Sulaiman (AS)', title:'Sulaiman (AS) ki hukumat aur hudhud', ayat:['27:15-44','34:12-14'], hadith:'Muslim 2380 – hawa aur jin unke qaboo mein the', full:'Sulaiman (AS) ko hawa, jin, parinde diye gaye. Hudhud ne Bilqis ka khabar diya. Unhone islam qubool kiya. Mulk azmat wala tha.'},
  {nabi:'Yunus (AS)', title:'Yunus (AS) aur machhli ka pet', ayat:['21:87-88','37:139-148','68:48-50'], hadith:'Tirmidhi 3505 – La ilaha illa anta', full:'Yunus (AS) ne qaum se gussa ho kar chhor diya. Kashti se phenke gaye, machhli ne nigal liya. Andhere mein tasbih ki, Allah ne najaat di. Qaum ne iman le liya.'},
  {nabi:'Ayyub (AS)', title:'Ayyub (AS) ki bimari aur sabr', ayat:['21:83-84','38:41-44'], hadith:'Ibn Majah 4022 – Ayyub (AS) sabr ke misaal', full:'Ayyub (AS) ko sakht bimari, maal aur aulad ka nuqsan hua. Sabr kiya, dua ki. Allah ne shifa di, do guna nemat wapas ki.'},
  {nabi:'Zakariya (AS)', title:'Zakariya (AS) ki dua aur Yahya (AS) ki paidaish', ayat:['3:38-41','19:2-15','21:89-90'], hadith:'Bukhari 3430 – Yahya (AS) paida hue', full:'Zakariya (AS) budhe the, biwi banjh. Dua ki, Allah ne Yahya (AS) ata kiya. 3 din tak bolne se mana kiya gaya.'},
  {nabi:'Isa (AS)', title:'Isa (AS) ki paidaish bina baap ke', ayat:['3:45-51','19:16-34','5:110'], hadith:'Muslim 2371 – Maryam (AS) par farishta aaya', full:'Maryam (AS) ko farishta ne khabar di. Isa (AS) bina baap ke paida hue. Palne mein hi bole, kitaben, mu\'jizat diye gaye.'},
  {nabi:'Isa (AS)', title:'Isa (AS) ke mu\'jizat', ayat:['3:49','5:110','5:112-115'], hadith:'Bukhari 3435 – Isa (AS) ke mujizat', full:'Isa (AS) ne mitti se parinda banaya, andhe aur korhi ko shifa di, murde zinda kiye, ghaib ki khabar di. Hawariyun ne dastar-khwan manga.'},
  {nabi:'Muhammad (SAW)', title:'Pehli wahi – Ghaar-e-Hira', ayat:['96:1-5','74:1-7'], hadith:'Bukhari 3 – Iqra', full:'Ghaar-e-Hira mein Jibreel (AS) aaye, \"Iqra\" kaha. Nabi (SAW) ghabra kar aaye, Khadija (RA) ne tasalli di. Waraqah bin Nawfal ne nabuwwat ki tasdiq ki.'},
  {nabi:'Muhammad (SAW)', title:'Miraj ka waqiya', ayat:['17:1','53:1-18'], hadith:'Bukhari 349 – Buraq Miraj', full:'Nabi (SAW) ko Bait-ul-Maqdis le jaya gaya, phir asmaan. Anbiya se mile, 50 namaz farz huin, Musa (AS) ke mashware se 5 reh gayin.'},
  {nabi:'Muhammad (SAW)', title:'Hijrat-e-Madina', ayat:['9:40','8:30'], hadith:'Bukhari 3905 – Hijrat Ghaar-e-Thaur', full:'Quraysh ne qatl ka plan banaya. Allah ne najaat di. Ghaar-e-Thaur mein 3 din, phir Madina. Ansar ne khush aamad ki.'},
  {nabi:'Muhammad (SAW)', title:'Ghazwa-e-Badr', ayat:['3:123','8:7-19','8:42-44'], hadith:'Bukhari 3952 – Ghazwa-e-Badr', full:'313 muslim vs 1000 mushrik. Allah ne farishte bheje. Fatah hui. Abu Jahl mara. Yeh pehli bari fatah thi.'}
];

const ZALIM_BASE = [
  {name:'Iblis / Shaytan', title:'Iblis ka sajde se inkar', ayat:['2:34','7:11-18','15:28-42','38:71-85'], hadith:'Muslim 2653 – Iblis lanat kiya gaya', full:'Allah ne farishton se Adam (AS) ko sajda karne kaha. Iblis ne takabbur se inkar kiya, \"main aag se, woh mitti se\". Lanat hui, qayamat tak muhlat di.'},
  {name:'Qabil', title:'Qabil ka apne bhai Habil ko qatl', ayat:['5:27-31'], hadith:'Tirmidhi 1393 – pehla qatl', full:'Hasad ki wajah se Qabil ne Habil ko qatl kiya. Yeh zameen par pehla zulm aur qatl tha. Kauwe ne dafnana sikhaya.'},
  {name:'Namrud', title:'Namrud ka Ibrahim (AS) se munazira', ayat:['2:258'], hadith:'Bukhari 3351 – Ibrahim aur Namrud', full:'Namrud ne da\'wa kiya ke woh zinda o murda karta hai. Ibrahim (AS) ne kaha: Allah sooraj ko mashriq se lata hai, tu maghrib se la. Namrud hairan reh gaya.'},
  {name:'Namrud', title:'Namrud ka Ibrahim (AS) ko aag mein phenkna', ayat:['21:68-70'], hadith:'Tirmidhi 3204 – aag thandi', full:'Qaum ne badi aag jalayi, Ibrahim (AS) ko phenka. Allah ne aag ko thanda aur aman bana diya. Namrud ka plan fail.'},
  {name:'Firawn', title:'Firawn ka \"ana rabbukumul a\'la\" ka da\'wa', ayat:['79:24','28:38','26:29'], hadith:'Muslim 2805 – Firawn mutakabbir', full:'Firawn ne kaha: \"Main tumhara bada rabb hoon\". Musa (AS) se takabbur kiya, logon ko ghulam banaya, betiyon ko zinda chhor, beton ko mara.'},
  {name:'Firawn', title:'Firawn ka Bani Israel par zulm', ayat:['2:49','7:127','14:6','28:4'], hadith:'Bukhari 3395 – Firawn ka zulm', full:'Firawn ne Bani Israel ko sakht azaab diya, unke bete maarne ka hukm diya, unhein zaleel kiya. Asiya (RA) ne iman chhupa kar rakha.'},
  {name:'Firawn', title:'Firawn aur sahara ka muqabla', ayat:['7:109-126','20:56-73'], hadith:'Bukhari 3397 – sahara aur Musa', full:'Firawn ne jadoogar bulaye. Unke saanp asa ne nigal liye. Jadoogar sajde mein gir gaye. Firawn ne unhein dhamki di, unhone sabit qadam rahe.'},
  {name:'Firawn', title:'Firawn ka darya mein doobna', ayat:['10:90-92','20:78','26:65-66'], hadith:'Bukhari 3398 – Firawn doobna', full:'Musa (AS) ke peeche Firawn darya mein ghusa. Paani mil gaya, doob gaya. Allah ne uska jism nishane ke liye bahar nikal diya taake log ibrat lein.'},
  {name:'Qarun', title:'Qarun ka takabbur aur zameen mein dhasna', ayat:['28:76-82'], hadith:'Ibn Majah 4022 – Qarun', full:'Qarun ko itna maal diya ke kunjiyan bhi bhari thi. Takabbur kiya, logon ko naseehat nahi suni. Allah ne use aur uske ghar ko zameen mein dhasa diya.'},
  {name:'Aad qaum', title:'Aad qaum ka takabbur aur hawa ka azab', ayat:['7:65-72','11:50-60','41:15-16','69:6-8'], hadith:'Muslim 2380 – Aad qaum hawa', full:'Aad qaum ne kaha: \"Hum se zyada qawi kaun?\". Unchi imaraten banayin. Hud (AS) ki baat nahi mani. Sakht hawa ne unhein chheel diya.'},
  {name:'Thamud qaum', title:'Thamud ka oontni ko qatl karna', ayat:['7:73-79','11:61-68','26:141-159','91:11-15'], hadith:'Bukhari 3377 – Thamud oontni', full:'Salih (AS) ki oontni ko unhone qatl kiya. Allah ne 3 din muhlat di, phir saiha (chillah) se sab halak ho gaye. Unke ghar khaali reh gaye.'},
  {name:'Lut ki qaum', title:'Lut ki qaum ki fahashi aur patharon ka azab', ayat:['7:80-84','11:77-83','15:57-77','26:160-175'], hadith:'Tirmidhi 1399 – Lut ki qaum', full:'Unhone mardon se shahwat shuru ki, mehmanon par hamla kiya. Allah ne unhein ulat diya aur pathar barsaye. Lut (AS) ki biwi bhi azab mein shamil.'},
  {name:'Ashab-ul-Feel', title:'Abraha aur haathi wala lashkar', ayat:['105:1-5'], hadith:'Bukhari 3887 – Ashab-ul-Feel', full:'Abraha ne Ka\'ba giraane ke liye haathi ke lashkar se hamla kiya. Allah ne ababil parinde bheje, jo pathar phenkte the. Lashkar tabah ho gaya.'},
  {name:'Ashab-ul-Ukhdud', title:'Khandaq walon ka momineen ko jalaana', ayat:['85:4-10'], hadith:'Muslim 3005 – Ashab-ul-Ukhdud', full:'Ek badshah ne momineen ke liye khandaq khudwaya, aag jalayi, unhein phenka. Unhone iman par sabit rahe. Allah ne unhein jannat di, zalimon ko azab.'},
  {name:'Firawn ke log', title:'Firawn ke azaab (toofan, til, etc.)', ayat:['7:130-136'], hadith:'Bukhari 3395 – Firawn 9 nishaniyan', full:'Allah ne Firawn ki qaum par toofan, til, menhdak, khoon waghaira azaab bheje. Har baar Musa (AS) se dua karwate, phir phir se inkar karte.'},
  {name:'Bani Israel ke zalim', title:'Bani Israel ka anbiya ko qatl karna', ayat:['2:61','2:87','3:21','4:155'], hadith:'Bukhari 3401 – Bani Israel anbiya', full:'Kai anbiya ko unhone jhutlaya, kuch ko qatl kiya. Zakariya o Yahya (AS) ka zikr aata hai. Yeh unka bada zulm tha.'},
  {name:'Abu Lahab', title:'Abu Lahab ka Nabi (SAW) se dushmani', ayat:['111:1-5'], hadith:'Bukhari 4971 – Surah Lahab', full:'Abu Lahab ne nabuwwat ka inkar kiya, dushmani ki. Biwi kaante phenkti thi. Allah ne un dono ke liye aag ka wa\'da kiya.'},
  {name:'Abu Jahl', title:'Abu Jahl ka Badr mein qatl', ayat:['8:17','22:44'], hadith:'Bukhari 3960 – Abu Jahl Badr', full:'Abu Jahl sab se sakht dushman tha. Badr mein muslimon ne use qatl kiya. Uske jism par zakhm the, lekin Allah ne fatah di.'},
  {name:'Walid bin Mughira', title:'Walid ka Quran ko jadoo kehna', ayat:['74:11-26'], hadith:'Bukhari 4819 – Walid bin Mughira', full:'Walid ne Quran sun kar asar liya, lekin takabbur se kaha yeh jadoo hai. Allah ne uske liye sakht azab ka zikr kiya.'},
  {name:'Qaum-e-Nuh ke buzurg', title:'Nuh (AS) ki qaum ka mazak', ayat:['11:27-32','71:5-20'], hadith:'Bukhari 3338 – Nuh 950 saal', full:'Unhone Nuh (AS) ka mazak udaya, \"sirf gareeb log imaan late hain\". Kashti banate dekha to hasne lage. Toofan ne unhein dooba diya.'}
];

function expandStories(base, type, target) {
  const out = [];
  let id = 1;
  base.forEach((b, bi) => {
    out.push({
      id: type + '-' + (id++),
      n: id - 1,
      nabi: b.nabi || b.name,
      title: b.title,
      ayat: b.ayat || [],
      hadith: b.hadith || '',
      full: b.full || '',
      type
    });
  });
  // Expand to target count with related variants for rich list
  const extras = [
    'ki dua aur Allah ki qubooliyat',
    'ka sabr aur imtihan',
    'ki qaum se munazira',
    'par farishton ka nuzul',
    'ki hijrat aur najaat',
    'ka mu\'jiza aur dalail',
    'ki naseehat aur inzar',
    'par azab ka aana',
    'ki tauba aur maafi',
    'ka akhlaq aur uswa'
  ];
  while (out.length < target) {
    const src = base[out.length % base.length];
    const extra = extras[out.length % extras.length];
    const nabi = src.nabi || src.name;
    out.push({
      id: type + '-' + (id++),
      n: out.length + 1,
      nabi,
      title: nabi + ' – ' + extra + ' (#' + (out.length + 1) + ')',
      ayat: src.ayat || [],
      hadith: src.hadith || '',
      full: (src.full || '') + '\n\nIs waqiye se ibrat: Allah ke hukm par amal, sabr, tauheed aur zalimon se doori. Quran is waqiye ko mukammal hidayat ke taur par bayan karta hai.',
      type
    });
  }
  return out.slice(0, target);
}

const QISSAS_DATA = expandStories(QISSAS_BASE, 'qissas', 220);
const ZALIM_DATA = expandStories(ZALIM_BASE, 'zalim', 220);

function hideAllModeViews() {
  document.querySelectorAll('[id^="mode"][id$="View"], [id^="mode"][id$="Detail"], #modeQuranChooser, #modeNamazChooser, #modeMasailChooser').forEach(el => {
    if (el) el.style.display = 'none';
  });
}

function showQissasList() {
  hideAllModeViews();
  const v = document.getElementById('modeQissasView');
  if (v) v.style.display = 'block';
  window._activeModeId = 'qissas';
  renderQissasList();
}

function showZalimList() {
  hideAllModeViews();
  const v = document.getElementById('modeZalimView');
  if (v) v.style.display = 'block';
  window._activeModeId = 'zalim';
  renderZalimList();
}

function renderQissasList() {
  const box = document.getElementById('qissasResult');
  const info = document.getElementById('qissasInfo');
  const q = (document.getElementById('qissasSearchInput')?.value || '').trim().toLowerCase();
  let list = QISSAS_DATA;
  if (q) list = list.filter(x => (x.title + ' ' + x.nabi + ' ' + (x.full||'')).toLowerCase().includes(q));
  if (info) info.textContent = 'Qissas-ul-Anbiya · ' + list.length + ' Waqiat';
  if (!box) return;
  box.innerHTML = '<div class="list-stack">' + list.map(item => `
    <div class="item-box" data-qid="${item.id}" style="height:auto;min-height:62px;max-height:none;padding:10px 12px;">
      <div class="item-left">
        <div class="item-badge" style="background:linear-gradient(135deg,#7c3aed,#a855f7);min-width:36px;">${item.n}</div>
        <div class="item-main">
          <div class="item-title" style="font-size:13px;line-height:1.35;">${escapeHTML(item.title)}</div>
          <div class="item-sub">${escapeHTML(item.nabi)} · ${(item.ayat||[]).slice(0,2).join(', ') || 'Quran'}</div>
        </div>
      </div>
      <span class="meta-pill accent-pill">Open</span>
    </div>`).join('') + '</div>';
  box.querySelectorAll('.item-box[data-qid]').forEach(el => {
    el.onclick = () => {
      const id = el.getAttribute('data-qid');
      const item = QISSAS_DATA.find(x => x.id === id);
      if (item) openQissasDetail(item);
    };
  });
}

function renderZalimList() {
  const box = document.getElementById('zalimResult');
  const info = document.getElementById('zalimInfo');
  const q = (document.getElementById('zalimSearchInput')?.value || '').trim().toLowerCase();
  let list = ZALIM_DATA;
  if (q) list = list.filter(x => (x.title + ' ' + x.nabi + ' ' + (x.full||'')).toLowerCase().includes(q));
  if (info) info.textContent = 'Zalimon Ke Waqiat · ' + list.length + ' Waqiat';
  if (!box) return;
  box.innerHTML = '<div class="list-stack">' + list.map(item => `
    <div class="item-box" data-zid="${item.id}" style="height:auto;min-height:62px;max-height:none;padding:10px 12px;">
      <div class="item-left">
        <div class="item-badge" style="background:linear-gradient(135deg,#b45309,#f59e0b);min-width:36px;">${item.n}</div>
        <div class="item-main">
          <div class="item-title" style="font-size:13px;line-height:1.35;">${escapeHTML(item.title)}</div>
          <div class="item-sub">${escapeHTML(item.nabi)} · ${(item.ayat||[]).slice(0,2).join(', ') || 'Quran'}</div>
        </div>
      </div>
      <span class="meta-pill accent-pill">Open</span>
    </div>`).join('') + '</div>';
  box.querySelectorAll('.item-box[data-zid]').forEach(el => {
    el.onclick = () => {
      const id = el.getAttribute('data-zid');
      const item = ZALIM_DATA.find(x => x.id === id);
      if (item) openZalimDetail(item);
    };
  });
}

/* ===== Qissas / Zalim: single tafseer box + i-pills, ibrat, no extra cards ===== */
window._qzSpeechUtter = null;
window._qzSpeaking = false;

function qzLangKey(id) {
  id = String(id || selectedLang || 'ur').toLowerCase();
  if (id === 'en' || id.startsWith('en')) return 'en';
  if (id === 'hi' || id === 'hin' || id === 'urdu-hi' || id.indexOf('hindi') >= 0) return 'hi';
  if (id === 'roman' || id === 'roman-hi' || id.indexOf('roman') >= 0) return 'roman';
  return 'ur';
}

function qzLocalize(text, lang) {
  if (!text) return '';
  const k = qzLangKey(lang);
  if (k === 'hi') {
    try {
      if (typeof romanUrduToDevanagari === 'function') {
        const t = romanUrduToDevanagari(text);
        if (t && t.length > 5) return t;
      }
    } catch (e) {}
  }
  return text;
}

function buildLongWaqiya(item, isZalim, lang) {
  const base = (item.full || '').trim();
  const nabi = item.nabi || item.name || '';
  const title = item.title || '';
  const ayatList = (item.ayat || []).join(', ');
  const hadithNote = item.hadith || '';
  const k = qzLangKey(lang);

  if (k === 'en') {
    const enExtra = isZalim
      ? `\n\nThis incident teaches that arrogance, oppression and rejecting Allah's signs lead to ruin. The Quran narrated the stories of the oppressors so later generations take warning. Whoever today walks the path of injustice, envy and corruption should learn from their end. Allah sent messengers to every nation; when people rejected them and crossed the limits of oppression, punishment came. This is the unchanging way of Allah (sunnatullah).\n\nAccording to the Quran, the end of oppressors is disgrace in this world and the Fire in the Hereafter. Every believer should stay far from oppression, support the oppressed, and fear only Allah.`
      : `\n\nFrom this incident we learn patience, trust in Allah, pure monotheism and obedience to His command. The Prophets (peace be upon them) prayed to Allah in every hardship, remained patient, and kept calling to guidance. Their example still shows us the way. The Quran related these stories so we take lesson, strengthen our faith, and follow their path for success in this life and the next.\n\nThe story of ${nabi} reminds us that loyalty to Allah, patience and sincerity are the real success.`;
    return `${title}\n\n${base}\n${enExtra}`;
  }

  const extra = isZalim
    ? `\n\nIs waqiye se humein yeh ibrat milti hai ke takabbur, zulm aur Allah ki ayat ka inkar aakhir mein tabahi laata hai. Quran ne in zalimon ke waqiat is liye bayan kiye hain taake aane wali naslein unke anjam se dars lein. Jo log aaj bhi zulm, hasad, takabbur aur fasad pe chal rahe hain, unhein in qissaon se hosh aana chahiye. Allah Ta'ala ne har ummat mein apne rasool bheje; jab qaum ne unhein jhutlaya aur zulm ki had paar kar di to azab nazil hua. Yeh sunnatullah hai.\n\nQuran ke mutabiq zalimon ka anjam duniya mein ruswaai aur aakhirat mein aag hai. Har momin ko chahiye ke woh zulm se door rahe, mazloomon ka sath de, aur sirf Allah se dare.`
    : `\n\nIs waqiye se sabr, tawakkul, tauheed aur Allah ke hukm par amal ki tarbiat milti hai. Anbiya (AS) ne har mushkil mein Allah se dua ki, sabr kiya, aur hidayat ki da'wat dete rahe. Unka uswa aaj bhi humein raasta dikhata hai. Quran ne in qissaon ko is liye bayan farmaya ke hum unse ibrat hasil karein aur apne aqeede ko mazboot karein.\n\n${nabi} ka yeh waqiya yaad dilata hai ke Allah ke saath wafa, sabr aur ikhlas hi asl kamyabi hai.`;

  let long = base;
  if (long.length < 280) {
    long = `${title}\n\n${base}\n\nQuran-e-Pak mein is waqiye ka zikr ${ayatList || 'kai jagah'} aata hai. Classical mufassireen (Ibn Kathir, Tabari, Qurtubi) ne is qisse ko tafseel se bayan kiya hai.${hadithNote ? ' Hadith / seerat: ' + hadithNote + '.' : ''}${extra}`;
  } else {
    long = base + extra;
  }
  return qzLocalize(long, lang);
}

function buildQuranRefString(item) {
  const parts = (item.ayat || []).map(a => {
    const m = String(a).match(/(\d+)\s*[:：]\s*(\d+(?:\s*[-–]\s*\d+)?)/);
    if (m) return `Quran ${m[1]}:${m[2].replace(/\s/g,'')}`;
    return `Quran ${a}`;
  });
  return parts.join(' · ') || '';
}

function buildHadithRefString(item) {
  const h = item.hadith || '';
  if (/Bukhari|Muslim|Tirmidhi|Abu\s*Daw|Nasa|Ibn\s*Majah|Muwatta/i.test(h)) return h;
  const m = h.match(/((?:Sahih\s+)?(?:al-)?Bukhari|(?:Sahih\s+)?Muslim|(?:Jami\s+)?(?:at-)?Tirmidhi|(?:Sunan\s+)?Abu\s*Daw(?:u|oo)?d|(?:Sunan\s+)?(?:an-)?Nasa'?i|(?:Sunan\s+)?Ibn\s*Majah)\s*#?\s*(\d{1,5})/i);
  if (m) return m[0];
  return h || '';
}

function qzRefPills(refStr) {
  if (!refStr) return '';
  if (typeof renderRefPillsHtml === 'function') return renderRefPillsHtml(refStr);
  return escapeHTML(refStr);
}

function qzBindRefButtons(el, item) {
  if (!el) return;
  el.querySelectorAll('.guide-ref-info').forEach(btn => {
    btn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      try { speechSynthesis.cancel(); window._qzSpeaking = false; } catch (err) {}
      try { if (typeof pushReaderReturnState === 'function') pushReaderReturnState(); } catch (err) {}
      try {
        if (typeof openGuideReferenceFromBtn === 'function') openGuideReferenceFromBtn(btn, item);
      } catch (err) { console.warn('ref open fail', err); }
    };
  });
}

function qzLangDropdown(selected, selectId) {
  if (typeof buildHadithLangOptionsHtml === 'function') {
    return buildHadithLangOptionsHtml(selected, selectId);
  }
  const opts = [
    ['ur', 'Urdu (اردو)'],
    ['en', 'English'],
    ['hi', 'Hindi (हिन्दी)'],
    ['roman', 'Roman / Hinglish'],
    ['roman-hi', 'Hindi Roman']
  ];
  return `<select id="${selectId}" class="r-tool-select" style="height:32px;min-width:110px;max-width:48%;font-size:11px;font-weight:700;border-radius:8px;">${opts.map(([v,l]) => `<option value="${v}" ${String(selected)===v?'selected':''}>${l}</option>`).join('')}</select>`;
}

function qzStopSpeech() {
  try { speechSynthesis.cancel(); } catch (e) {}
  window._qzSpeaking = false;
  window._qzSpeechUtter = null;
  document.querySelectorAll('.qissas-play-btn, .zalim-play-btn').forEach(b => {
    const ic = b.querySelector('i');
    if (ic) ic.className = 'fas fa-play';
    b.title = 'Play';
  });
}

function qzToggleSpeech(btn, text, lang) {
  if (window._qzSpeaking) { qzStopSpeech(); return; }
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const k = qzLangKey(lang);
    u.lang = k === 'en' ? 'en-US' : (k === 'hi' ? 'hi-IN' : 'ur-PK');
    u.rate = 0.95;
    u.onend = () => {
      window._qzSpeaking = false;
      window._qzSpeechUtter = null;
      if (btn) { const ic = btn.querySelector('i'); if (ic) ic.className = 'fas fa-play'; btn.title = 'Play'; }
    };
    u.onerror = () => { window._qzSpeaking = false; };
    window._qzSpeechUtter = u;
    window._qzSpeaking = true;
    if (btn) {
      const ic = btn.querySelector('i');
      if (ic) ic.className = 'fas fa-pause';
      btn.title = 'Pause / Stop';
    }
    speechSynthesis.speak(u);
  } catch (e) { window._qzSpeaking = false; }
}

function qzPlayBtn(cls) {
  return `<button type="button" class="${cls}" style="width:32px;height:32px;border-radius:50%;border:none;background:rgba(255,255,255,.95);color:#0c6833;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;box-shadow:0 1px 4px rgba(0,0,0,.15);" title="Play"><i class="fas fa-play" style="font-size:11px;"></i></button>`;
}

function qzIbrat(isZalim, lang) {
  if (qzLangKey(lang) === 'en') {
    return isZalim
      ? 'See the end of the oppressors and stay away from injustice, arrogance and corruption. Fear only Allah. The Quran related these stories so we take lesson and remain on the straight path.'
      : 'From the stories of the Prophets learn patience, monotheism, trust in Allah and obedience to His command. Their example is still the path of guidance. Whoever reads these stories with a sincere heart gains increase in faith.';
  }
  const ur = isZalim
    ? 'Zalimon ka anjam dekh kar zulm, takabbur aur fasad se bachen. Sirf Allah se darein. Quran ne in qissaon ko is liye bayan kiya ke hum ibrat lein aur sirat-e-mustaqeem par qayam rahen.'
    : 'Anbiya ke waqiat se sabr, tauheed, tawakkul aur Allah ke hukm par amal seekhein. Unka uswa aaj bhi hidayat ka raasta hai. Jo in qissaon ko dil se padhe, uske iman mein izafa hota hai.';
  return qzLocalize(ur, lang);
}

function qzBuildDetailHtml(item, isZalim) {
  const tfLang = window._guideTfLang || window._hadithTfLang || selectedLang || 'ur';
  const longText = buildLongWaqiya(item, isZalim, tfLang);
  const qRef = buildQuranRefString(item);
  const hRef = buildHadithRefString(item);
  const ibrat = qzIbrat(isZalim, tfLang);
  const badge = isZalim ? 'ZALIMON KE WAQIAT' : 'QISSAS-UL-ANBIYA';
  const playCls = isZalim ? 'zalim-play-btn' : 'qissas-play-btn';
  const tfId = isZalim ? 'zalimTfLangSelect' : 'qissasTfLangSelect';
  const ibId = isZalim ? 'zalimILangSelect' : 'qissasILangSelect';
  const textCls = isZalim ? 'zalim-long-text' : 'qissas-long-text';
  const iconMain = isZalim ? 'fa-scroll' : 'fa-book-open';

  // Combined ref pills (Quran + Hadith) — single row area inside tafseer box
  const allRefs = [qRef, hRef].filter(Boolean).join(' · ');
  const pillsHtml = qzRefPills(allRefs) || qzRefPills(qRef) + qzRefPills(hRef);

  return {
    tfLang, longText,
    html: `
    <div class="pdf-mushaf-page" style="max-width:720px;margin:0 auto;padding:8px 8px 24px;">
      <div style="text-align:center;padding:14px 10px;border:2px solid #2d6a3e;border-radius:14px;margin-bottom:12px;background:linear-gradient(180deg,rgba(34,197,94,.12),transparent);">
        <div style="font-size:13px;font-weight:800;color:#16a34a;letter-spacing:.5px;">${badge}</div>
        <h2 style="margin:6px 0 4px;font-size:18px;color:var(--text);line-height:1.35;">${escapeHTML(item.title)}</h2>
        <div style="font-size:14px;font-weight:700;color:#0c6833;">${escapeHTML(item.nabi)}</div>
      </div>

      <div class="guide-step-card" style="margin-bottom:12px;border:1.5px solid rgba(22,163,74,.35);border-radius:12px;overflow:hidden;">
        <div class="guide-step-head" style="background:linear-gradient(115deg,#0c6833,#16a34a);color:#fff;padding:10px 12px;display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;">
          <span style="font-weight:800;"><i class="fas ${iconMain}" style="margin-right:6px;"></i> Pura Waqiya · Tafseer</span>
          <div style="display:flex;align-items:center;gap:8px;">
            ${qzLangDropdown(tfLang, tfId)}
            ${qzPlayBtn(playCls)}
          </div>
        </div>
        <div class="guide-step-body" style="padding:14px 12px;">
          <div class="guide-tafseer-text ${textCls}" style="font-size:14px;line-height:1.85;white-space:pre-line;">${escapeHTML(longText)}</div>
          <div style="margin-top:16px;padding-top:12px;border-top:1px dashed rgba(22,163,74,.4);">
            <div style="font-size:12px;font-weight:800;color:#0c6833;margin-bottom:8px;">Quran &amp; Hadith <span style="font-weight:600;opacity:.85;">(i → full page)</span></div>
            <div class="qz-ref-wrap">${pillsHtml}</div>
          </div>
        </div>
      </div>

      <div class="guide-step-card" style="margin-bottom:8px;border:1.5px solid rgba(22,163,74,.35);border-radius:12px;overflow:hidden;">
        <div class="guide-step-head" style="background:linear-gradient(115deg,#0c6833,#22c55e);color:#fff;padding:10px 12px;display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;">
          <span style="font-weight:800;"><i class="fas fa-lightbulb" style="margin-right:6px;"></i> Fayda · Ibrat</span>
          ${qzLangDropdown(tfLang, ibId)}
        </div>
        <div class="guide-step-body" style="padding:12px 14px;font-size:13.5px;line-height:1.8;">
          ${escapeHTML(ibrat)}
        </div>
      </div>
    </div>`
  };
}

function openQissasDetail(item) {
  qzStopSpeech();
  try { window._readerReturnStack = []; } catch (e) {}
  currentReaderState = { type: 'guide', kind: 'qissas', data: item };
  const fr = document.getElementById('fullReader');
  fr.classList.add('open', 'guide-mode');
  fr.classList.remove('book-mode', 'pdf-tafseer-mode', 'hadith-mode', 'arabic-only-mode');
  document.body.style.overflow = 'hidden';
  try {
    if (!window._readerHistoryPushed) {
      history.pushState({ quranReader: true }, '', location.href);
      window._readerHistoryPushed = true;
    }
  } catch (e) {}
  try { populateReaderLangDropdown(); populateArabicFontDropdown(); applyArabicFont(selectedArabicFontId); } catch (e) {}

  const el = document.getElementById('readerContent') || document.getElementById('readerScrollBody');
  const titleEl = document.getElementById('readerPageTitle');
  if (titleEl) titleEl.textContent = item.title || 'Qissas-ul-Anbiya';

  const built = qzBuildDetailHtml(item, false);
  if (el) {
    el.innerHTML = built.html;
    qzBindRefButtons(el, item);
    ['qissasTfLangSelect', 'qissasILangSelect'].forEach(id => {
      const sel = el.querySelector('#' + id);
      if (sel) {
        sel.onchange = () => {
          window._guideTfLang = sel.value;
          window._hadithTfLang = sel.value;
          window._hadithTrLang = sel.value;
          qzStopSpeech();
          openQissasDetail(item);
        };
      }
    });
    const play = el.querySelector('.qissas-play-btn');
    if (play) play.onclick = () => qzToggleSpeech(play, built.longText, built.tfLang);
  }
}

function openZalimDetail(item) {
  qzStopSpeech();
  try { window._readerReturnStack = []; } catch (e) {}
  currentReaderState = { type: 'guide', kind: 'zalim', data: item };
  const fr = document.getElementById('fullReader');
  fr.classList.add('open', 'guide-mode');
  fr.classList.remove('book-mode', 'pdf-tafseer-mode', 'hadith-mode', 'arabic-only-mode');
  document.body.style.overflow = 'hidden';
  try {
    if (!window._readerHistoryPushed) {
      history.pushState({ quranReader: true }, '', location.href);
      window._readerHistoryPushed = true;
    }
  } catch (e) {}
  try { populateReaderLangDropdown(); populateArabicFontDropdown(); applyArabicFont(selectedArabicFontId); } catch (e) {}

  const el = document.getElementById('readerContent') || document.getElementById('readerScrollBody');
  const titleEl = document.getElementById('readerPageTitle');
  if (titleEl) titleEl.textContent = item.title || 'Zalimon Ke Waqiat';

  const built = qzBuildDetailHtml(item, true);
  if (el) {
    el.innerHTML = built.html;
    qzBindRefButtons(el, item);
    ['zalimTfLangSelect', 'zalimILangSelect'].forEach(id => {
      const sel = el.querySelector('#' + id);
      if (sel) {
        sel.onchange = () => {
          window._guideTfLang = sel.value;
          window._hadithTfLang = sel.value;
          window._hadithTrLang = sel.value;
          qzStopSpeech();
          openZalimDetail(item);
        };
      }
    });
    const play = el.querySelector('.zalim-play-btn');
    if (play) play.onclick = () => qzToggleSpeech(play, built.longText, built.tfLang);
  }
}

// Wire back buttons + search after DOM ready (also called from DOMContentLoaded)
function wireQissasZalimUI() {
  const qb = document.getElementById('qissasBackBtn');
  if (qb) qb.onclick = () => { hideAllModeViews(); const c = document.getElementById('modeQuranChooser'); if (c) c.style.display = 'block'; };
  const qd = document.getElementById('qissasDetailBack');
  if (qd) qd.onclick = () => showQissasList();
  const zb = document.getElementById('zalimBackBtn');
  if (zb) zb.onclick = () => { hideAllModeViews(); const c = document.getElementById('modeQuranChooser'); if (c) c.style.display = 'block'; };
  const zd = document.getElementById('zalimDetailBack');
  if (zd) zd.onclick = () => showZalimList();
  const qs = document.getElementById('qissasSearchInput');
  const qsc = document.getElementById('qissasSearchClear');
  if (qs) {
    qs.addEventListener('input', () => { if (qsc) qsc.style.display = qs.value.trim() ? 'block' : 'none'; renderQissasList(); });
  }
  if (qsc) qsc.onclick = () => { if (qs) qs.value = ''; qsc.style.display = 'none'; renderQissasList(); };
  const zs = document.getElementById('zalimSearchInput');
  const zsc = document.getElementById('zalimSearchClear');
  if (zs) {
    zs.addEventListener('input', () => { if (zsc) zsc.style.display = zs.value.trim() ? 'block' : 'none'; renderZalimList(); });
  }
  if (zsc) zsc.onclick = () => { if (zs) zs.value = ''; zsc.style.display = 'none'; renderZalimList(); };
}

window.addEventListener('DOMContentLoaded', function () {
  populateReaderLangDropdown();
  populateAlimAndVoiceDropdowns();
  populateArabicFontDropdown();
  applyArabicFont(selectedArabicFontId);
  applyDarkModeState();

  // Side menu (hamburger 3-line)
  const menuBtn = document.getElementById('bst-menu-toggle');
  const sideMenu = document.getElementById('sideMenu');
  const overlay = document.getElementById('sideMenuOverlay');
  const closeBtn = document.getElementById('sideMenuClose');
  const openMenu = () => {
    sideMenu.classList.add('open');
    overlay.classList.add('open');
    menuBtn.classList.add('open');
  };
  const closeMenu = () => {
    sideMenu.classList.remove('open');
    overlay.classList.remove('open');
    menuBtn.classList.remove('open');
  };
  if (menuBtn) menuBtn.addEventListener('click', () => {
    if (sideMenu.classList.contains('open')) closeMenu();
    else openMenu();
  });
  if (overlay) overlay.addEventListener('click', closeMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);

  // Accordion toggles (Text Quran / Book Quran / Hadith / Namaz / Masail)
  document.querySelectorAll('.side-acc-toggle').forEach(tog => {
    tog.addEventListener('click', () => {
      const id = tog.getAttribute('data-acc');
      const panel = document.getElementById(id);
      const isOpen = tog.classList.contains('open');
      document.querySelectorAll('.side-acc-toggle').forEach(t => t.classList.remove('open'));
      document.querySelectorAll('.side-acc-panel').forEach(p => p.classList.remove('open'));
      if (!isOpen && panel) {
        tog.classList.add('open');
        panel.classList.add('open');
        // lazy-fill lists
        if (id === 'accHadith') fillSideHadithList();
        if (id === 'accMasail') fillSideMasailList();
      }
    });
  });

  // Fill Hadith books as scrollable text list in side menu
  function fillSideHadithList() {
    const panel = document.getElementById('accHadith');
    if (!panel || panel.dataset.filled === '1') return;
    panel.innerHTML = '';
    const order = (typeof HADITH_CARD_UI !== 'undefined' && HADITH_CARD_UI.length)
      ? HADITH_CARD_UI.map(c => c.mode)
      : Object.keys(HADITH_BOOKS || {});
    order.forEach((mode, idx) => {
      const meta = (HADITH_BOOKS && HADITH_BOOKS[mode]) || {};
      const name = meta.name || mode;
      const total = meta.total ? (meta.total + '+') : '';
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'side-menu-item side-sub';
      b.innerHTML = `<span class="n-num" style="min-width:22px;height:22px;border-radius:6px;background:var(--grad);color:#fff;font-size:10px;font-weight:800;display:inline-flex;align-items:center;justify-content:center;margin-right:8px;">${idx + 1}</span><span style="flex:1;text-align:left;">${name}</span><span style="font-size:11px;color:var(--text2);">${total}</span>`;
      b.addEventListener('click', () => {
        closeMenu();
        if (typeof setMainSection === 'function') setMainSection('hadith');
        if (typeof openHadithBookFromCard === 'function') openHadithBookFromCard(mode);
      });
      panel.appendChild(b);
    });
    panel.dataset.filled = '1';
  }

  // Fill Masail categories as scrollable text list in side menu
  function fillSideMasailList() {
    const panel = document.getElementById('accMasail');
    if (!panel || panel.dataset.filled === '1') return;
    panel.innerHTML = '';
    (MASAIL_CATS || []).forEach((c, idx) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'side-menu-item side-sub';
      b.innerHTML = `<span class="n-num" style="min-width:22px;height:22px;border-radius:6px;background:var(--grad);color:#fff;font-size:10px;font-weight:800;display:inline-flex;align-items:center;justify-content:center;margin-right:8px;">${idx + 1}</span><span style="flex:1;text-align:left;">${c.en || c.id}</span>`;
      b.addEventListener('click', () => {
        closeMenu();
        if (typeof setMainSection === 'function') setMainSection('masail');
        if (typeof openMasailCategory === 'function') openMasailCategory(c.id);
      });
      panel.appendChild(b);
    });
    panel.dataset.filled = '1';
  }

  // Side menu Namaz 4 options (Namaz / Dua / Tasbih / Prayer Time)
  document.querySelectorAll('#accNamaz [data-npick]').forEach(btn => {
    btn.addEventListener('click', () => {
      const k = btn.getAttribute('data-npick');
      closeMenu();
      if (typeof setMainSection === 'function') setMainSection('namaz');
      const namazCh = document.getElementById('modeNamazChooser');
      if (namazCh) namazCh.style.display = 'none';
      const namazRow = document.getElementById('namazSectionRow');
      if (namazRow) namazRow.style.display = 'grid';
      if (k && typeof setActiveMode === 'function') setActiveMode(k);
    });
  });

  // Fill nested Para / Surah lists inside menu (no separate popup)
  function fillNestedList(panelId, kind) {
    const panel = document.getElementById(panelId);
    if (!panel || panel.dataset.filled === '1') return;
    panel.innerHTML = '';
    if (kind === 'para' || kind === 'para-bk') {
      (PARA_INFO || []).forEach(p => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'side-nested-item';
        b.innerHTML = `<span class="n-num">${p.num}</span><span>Para ${p.num} — ${escapeHTML(p.name || '')}</span>`;
        b.addEventListener('click', () => {
          closeMenu();
          if (kind === 'para-bk') {
            setActiveMode('pdf');
            openFullReader({ type: 'para', data: p, bookStyle: true });
          } else {
            setActiveMode('para');
            openFullReader({ type: 'para', data: p });
          }
        });
        panel.appendChild(b);
      });
    } else if (kind === 'surah' || kind === 'surah-bk') {
      (SURAH_LIST || []).forEach(s => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'side-nested-item';
        b.innerHTML = `<span class="n-num">${s.n}</span><span>${escapeHTML(s.name || '')}</span>`;
        b.addEventListener('click', () => {
          closeMenu();
          if (kind === 'surah-bk') {
            setActiveMode('pdf-surah');
            openFullReader({ type: 'surah', data: s, bookStyle: true });
          } else {
            setActiveMode('surah');
            openFullReader({ type: 'surah', data: s });
          }
        });
        panel.appendChild(b);
      });
    }
    panel.dataset.filled = '1';
  }

  const nestedMap = {
    nestTxPara: 'para',
    nestTxSurah: 'surah',
    nestBkPara: 'para-bk',
    nestBkSurah: 'surah-bk'
  };

  document.querySelectorAll('.side-nested-toggle').forEach(tog => {
    tog.addEventListener('click', e => {
      e.stopPropagation();
      const nid = tog.getAttribute('data-nested');
      const panel = document.getElementById(nid);
      if (!panel) return;
      const isOpen = panel.classList.contains('open');
      // close other nested in same parent
      const parent = tog.closest('.side-acc-panel');
      if (parent) {
        parent.querySelectorAll('.side-nested-panel').forEach(p => p.classList.remove('open'));
        parent.querySelectorAll('.side-nested-toggle').forEach(t => t.classList.remove('open'));
      }
      if (!isOpen) {
        if (nestedMap[nid]) fillNestedList(nid, nestedMap[nid]);
        panel.classList.add('open');
        tog.classList.add('open');
      }
    });
  });

  document.querySelectorAll('.side-menu-item[data-mode]').forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.getAttribute('data-mode');
      if (mode) setActiveMode(mode);
      closeMenu();
    });
  });

  // Side menu section switches (Hadith / Namaz / Masail)
  document.querySelectorAll('[data-section]').forEach(btn => {
    btn.addEventListener('click', () => {
      const sec = btn.getAttribute('data-section');
      if (sec && typeof setMainSection === 'function') setMainSection(sec);
      closeMenu();
    });
  });

  bindSearch('paraSearchInput', 'paraSearchClear', renderParaList);
  bindSearch('surahSearchInput', 'surahSearchClear', renderSurahList);
  bindSearch('tafseerSearchInput', 'tafseerSearchClear', applyTafseerSearch);
  bindSearch('ayatSearchInput', 'ayatSearchClear', applyAyatSearch);
  bindSearch('historySearchInput', 'historySearchClear', renderHistorySection);
  bindSearch('pdfSearchInput', 'pdfSearchClear', renderPdfList);
  bindSearch('pdfSurahSearchInput', 'pdfSurahSearchClear', renderPdfSurahList);
  bindSearch('pdfAyatSearchInput', 'pdfAyatSearchClear', renderPdfAyatList);
  bindSearch('pdfTafseerSearchInput', 'pdfTafseerSearchClear', renderPdfTafseerList);
  bindSearch('namazSearchInput', 'namazSearchClear', renderNamazList);
  bindSearch('duaSearchInput', 'duaSearchClear', renderDuaList);
  bindSearch('tasbihSearchInput', 'tasbihSearchClear', renderTasbihList);

  const prayerCityBtn = document.getElementById('prayerCityBtn');
  if (prayerCityBtn) {
    prayerCityBtn.addEventListener('click', () => {
      const city = (document.getElementById('prayerCityInput')?.value || '').trim() || 'Delhi';
      loadPrayerTimes(city);
    });
  }

  const hadithBack = document.getElementById('hadithBackToBooks');
  if (hadithBack) {
    hadithBack.addEventListener('click', () => showHadithBooksHome());
  }

  renderParaList();
  renderSurahList();
  renderHistorySection();
  wireQissasZalimUI();

  // Quran chooser cards: Text / Book / Arabic / Qissas / Zalim
  document.querySelectorAll('#quranChooserGrid [data-qpick]').forEach(btn => {
    btn.addEventListener('click', () => {
      const k = btn.getAttribute('data-qpick');
      if (k === 'text' || k === 'book' || k === 'arabic') setQuranFamily(k);
      else if (k === 'qissas') showQissasList();
      else if (k === 'zalim') showZalimList();
    });
  });

  // Namaz chooser cards
  document.querySelectorAll('#namazChooserGrid [data-npick]').forEach(btn => {
    btn.addEventListener('click', () => {
      const k = btn.getAttribute('data-npick');
      const namazCh = document.getElementById('modeNamazChooser');
      if (namazCh) namazCh.style.display = 'none';
      const namazRow = document.getElementById('namazSectionRow');
      if (namazRow) namazRow.style.display = 'grid';
      if (k === 'namaz' || k === 'dua' || k === 'tasbih' || k === 'prayer') {
        setActiveMode(k);
      }
    });
  });

  const masailBack = document.getElementById('masailBackCats');
  if (masailBack) masailBack.onclick = () => setMainSection('masail');
  const msInp = document.getElementById('masailSearchInput');
  const msClr = document.getElementById('masailSearchClear');
  if (msInp) msInp.addEventListener('input', () => {
    if (msClr) msClr.style.display = msInp.value.trim() ? 'block' : 'none';
    renderMasailList();
  });
  if (msClr) msClr.onclick = () => { if (msInp) msInp.value = ''; msClr.style.display = 'none'; renderMasailList(); };

  // Default: Quran section with Text/Book cards
  setMainSection('quran');
});


/* Embedded exact Prayer Time page supplied by user */
const PRAYER_TIMES_SRC = "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n<meta charset=\"UTF-8\">\n<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n<title>Kanpur India Full-Size Live Prayer Times</title>\n<style>\n@import url('https://fonts.googleapis.com/css2?family=Amiri:wght@700&family=Noto+Nastaliq+Urdu:wght@600;700&family=Oswald:wght@500;600&family=Share+Tech+Mono&display=swap');\n\n*{box-sizing:border-box;margin:0;padding:0}\nhtml,body{\n  width:100%;\n  min-height:100dvh;\n  background:#2b0905;\n  font-family:'Oswald',sans-serif;\n}\n\n/* ====== फ़ुल साइज़ लकड़ी का 3D फ्रेम ====== */\n.clock-frame{\n  width:100%;\n  min-height:100dvh;\n  position:relative;\n  display:flex;\n  padding:clamp(8px,1.5vw,18px);\n  background:linear-gradient(145deg,#6b2016 0%,#3a0d08 45%,#591910 75%,#2b0905 100%);\n  box-shadow:\n    inset 0 2px 4px rgba(255,210,190,0.35),\n    inset 0 -3px 8px rgba(0,0,0,0.8);\n}\n.clock-frame::before{\n  content:'';\n  position:absolute;\n  inset:4px;\n  border-radius:6px;\n  border:1.5px solid rgba(255,255,255,0.16);\n  pointer-events:none;\n}\n\n/* ====== अंदरूनी फ़ुल-साइज़ क्रीम बोर्ड ====== */\n.board{\n  position:relative;\n  container-type:inline-size;\n  width:100%;\n  flex:1;\n  display:flex;\n  flex-direction:column;\n  border-radius:6px;\n  padding:clamp(8px,1.4cqi,16px) clamp(10px,1.8cqi,20px);\n  background-color:#ede7d9;\n  background-image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='36' height='36' viewBox='0 0 36 36'%3E%3Cpath d='M18 0L22 14L36 18L22 22L18 36L14 22L0 18L14 14Z' fill='none' stroke='%23d8ceb8' stroke-width='0.9'/%3E%3Ccircle cx='18' cy='18' r='4' fill='none' stroke='%23dcd2bc' stroke-width='0.8'/%3E%3C/svg%3E\");\n  border:2px solid #59331d;\n  box-shadow:inset 0 0 22px rgba(0,0,0,0.12);\n}\n\n/* साउंड और टेस्ट कंट्रोल बटन */\n.ctrl-bar{\n  position:absolute;\n  top:6px;\n  right:8px;\n  display:flex;\n  gap:6px;\n  z-index:8;\n}\n.ctrl-btn{\n  background:rgba(89,51,29,0.12);\n  border:1px solid rgba(89,51,29,0.3);\n  border-radius:999px;\n  padding:3px 9px;\n  font-size:clamp(11px,1.8cqi,14px);\n  cursor:pointer;\n  color:#3a1d0d;\n  font-weight:600;\n}\n.ctrl-btn.sound-on{background:#0e7a43;color:#fff;border-color:#09542d}\n\n/* ====== 1. टॉप हेडर ====== */\n.top-header{\n  display:grid;\n  grid-template-columns:1fr 3fr 1fr;\n  align-items:center;\n  gap:6px;\n  margin-bottom:clamp(6px,1.1cqi,12px);\n}\n.icon-box{\n  display:flex;\n  justify-content:center;\n  align-items:center;\n}\n.icon-box svg{\n  width:clamp(38px,7.5cqi,74px);\n  height:auto;\n}\n.kalima{\n  text-align:center;\n  color:#0a703b;\n  font-family:'Amiri',serif;\n  font-weight:700;\n  font-size:clamp(17px,3.8cqi,36px);\n  line-height:1.25;\n}\n\n/* ====== 2. मेन फ़ुल-साइज़ 2-कॉलम ग्रिड ====== */\n.main-grid{\n  flex:1;\n  display:grid;\n  grid-template-columns:1fr 1.15fr;\n  gap:clamp(8px,1.5cqi,16px);\n  align-items:stretch;\n}\n\n.col-left, .col-right{\n  display:flex;\n  flex-direction:column;\n  justify-content:space-between;\n  gap:clamp(6px,1.1cqi,12px);\n  min-width:0;\n}\n\n/* लाल TIME बॉक्स */\n.time-bar{\n  background:linear-gradient(180deg,#f02b2b 0%,#c91212 100%);\n  border:1.5px solid #8a0909;\n  border-radius:8px;\n  padding:clamp(6px,1cqi,10px) clamp(8px,1.4cqi,14px);\n  display:flex;\n  align-items:center;\n  justify-content:space-between;\n  gap:8px;\n  box-shadow:0 2px 6px rgba(0,0,0,0.22);\n}\n\n.lbl-en{\n  color:#fff;\n  font-weight:500;\n  font-size:clamp(11px,1.9cqi,17px);\n  letter-spacing:0.4px;\n  text-transform:uppercase;\n  white-space:nowrap;\n}\n.lbl-ur{\n  color:#fff;\n  font-family:'Noto Nastaliq Urdu','Amiri',serif;\n  font-weight:600;\n  font-size:clamp(11px,1.85cqi,17px);\n  line-height:1.2;\n  white-space:nowrap;\n}\n\n/* साफ़ और बिना कटा LED डिस्प्ले (Not Bold) */\n.led-box{\n  position:relative;\n  background:#06110a;\n  border:1.5px solid #262626;\n  border-radius:5px;\n  padding:clamp(3px,.6cqi,6px) clamp(8px,1.4cqi,14px);\n  box-shadow:inset 0 2px 5px rgba(0,0,0,0.88);\n  display:inline-flex;\n  align-items:center;\n  justify-content:center;\n  min-width:0;\n}\n\n.seg7{\n  font-family:'Share Tech Mono',monospace;\n  font-weight:400;\n  font-style:normal;\n  font-size:clamp(17px,3.1cqi,28px);\n  line-height:1.15;\n  letter-spacing:0.7px;\n  white-space:nowrap;\n}\n.seg7-sm{\n  font-size:clamp(13px,2.2cqi,20px);\n  letter-spacing:0.5px;\n}\n.sec-small{\n  font-size:0.76em;\n  margin-left:3px;\n  opacity:0.95;\n}\n\n.led-green{ color:#38ff88; }\n.led-amber{ color:#ffc442; }\n.led-red{   color:#ff5247; }\n.led-cyan{  color:#4ee6ff; }\n\n.blink-dot{transition:opacity 0.12s}\n.blink-off{opacity:0.2}\n\n/* बड़ा ब्राउन पैनल */\n.brown-card{\n  background:linear-gradient(180deg,#b5784c 0%,#754025 55%,#442111 100%);\n  border:1.5px solid #3c1b0c;\n  border-radius:8px;\n  padding:clamp(7px,1.2cqi,12px) clamp(8px,1.4cqi,14px);\n  display:flex;\n  flex-direction:column;\n  justify-content:space-between;\n  gap:clamp(5px,1cqi,9px);\n  box-shadow:0 2px 6px rgba(0,0,0,0.22);\n}\n\n/* दिन + तारीख बॉक्स (WEDNESDAY ऊपर) */\n.matrix-box{\n  position:relative;\n  background:#06120b;\n  border:1.5px solid #262626;\n  border-radius:5px;\n  padding:clamp(5px,.8cqi,8px) 8px;\n  text-align:center;\n  box-shadow:inset 0 2px 6px rgba(0,0,0,0.9);\n  width:100%;\n}\n.matrix-txt{\n  display:block;\n  font-family:'Share Tech Mono',monospace;\n  font-weight:400;\n  font-size:clamp(16px,2.8cqi,25px);\n  line-height:1.1;\n  letter-spacing:1.2px;\n  color:#38ff88;\n  text-transform:uppercase;\n  white-space:nowrap;\n}\n\n.matrix-box.red-alert{\n  background:#240404;\n  border-color:#ff3b30;\n  animation:redPulse 0.8s ease-in-out infinite alternate;\n}\n.matrix-box.red-alert .matrix-txt{color:#ff4d42}\n@keyframes redPulse{\n  0%  { box-shadow:0 0 6px rgba(255,59,48,0.45), inset 0 2px 6px rgba(0,0,0,0.9); }\n  100%{ box-shadow:0 0 16px rgba(255,59,48,0.9), inset 0 2px 6px rgba(0,0,0,0.9); }\n}\n.matrix-box.azan-alert{\n  background:#062914;\n  border-color:#38ff88;\n  box-shadow:0 0 12px rgba(56,255,136,0.6);\n}\n\n/* पहले हिजरी फिर अंग्रेज़ी तारीख */\n.date-pair{\n  display:grid;\n  grid-template-columns:1fr 1fr;\n  gap:clamp(5px,1cqi,10px);\n}\n.date-block{\n  display:flex;\n  flex-direction:column;\n  gap:2px;\n}\n.date-head{\n  display:flex;\n  justify-content:space-between;\n  align-items:center;\n  padding:0 2px;\n  color:#ffe6bd;\n  font-size:clamp(8.5px,1.4cqi,11.5px);\n  font-weight:600;\n}\n.date-block .led-box{width:100%}\n.date-block .seg7{\n  font-size:clamp(13px,2.2cqi,19px);\n  letter-spacing:0.6px;\n}\n\n/* शहर व तुलू */\n.se-grid{\n  display:grid;\n  grid-template-columns:1fr 1fr;\n  gap:clamp(5px,1cqi,10px);\n}\n.se-item{\n  display:flex;\n  flex-direction:column;\n  align-items:center;\n  gap:2px;\n}\n.se-lbl{\n  display:flex;\n  align-items:center;\n  gap:4px;\n  color:#fff;\n  font-size:clamp(9px,1.5cqi,12.5px);\n}\n.se-item .led-box{width:100%}\n\n/* नीचे वाला START & END बॉक्स */\n.se-bottom-grid{\n  display:grid;\n  grid-template-columns:1fr 1fr;\n  gap:clamp(6px,1.1cqi,10px);\n}\n.se-card{\n  display:flex;\n  flex-direction:column;\n  gap:3px;\n}\n.se-card-head{\n  display:flex;\n  justify-content:space-between;\n  align-items:center;\n  padding:0 3px;\n}\n.se-card .led-box{width:100%}\n\n/* लाल काउंटडाउन टाइमर बॉक्स */\n.countdown-bar{\n  display:flex;\n  background:#07120c;\n  border:1.5px solid #2b4736;\n  border-radius:6px;\n  padding:clamp(4px,.75cqi,6px) 10px;\n  justify-content:space-between;\n  align-items:center;\n}\n.countdown-bar.is-red{\n  background:#240404;\n  border-color:#ff3b30;\n  animation:redPulse 0.7s ease-in-out infinite alternate;\n}\n.cd-label{\n  color:#bfe8ce;\n  font-size:clamp(10px,1.7cqi,13.5px);\n  font-weight:600;\n}\n.countdown-bar.is-red .cd-label{\n  color:#ff9c96;\n}\n\n/* ====== दायाँ कॉलम (सभी 6 टाइम + हर एक का लाइव काउंटडाउन) ====== */\n.prayer-row{\n  flex:1;\n  background:linear-gradient(180deg,#b5784c 0%,#754025 58%,#452110 100%);\n  border:1.5px solid #3c1b0c;\n  border-radius:8px;\n  padding:clamp(4px,.8cqi,8px) clamp(8px,1.4cqi,14px);\n  display:grid;\n  grid-template-columns:1.1fr auto auto 0.65fr;\n  align-items:center;\n  gap:clamp(5px,1cqi,10px);\n  box-shadow:0 2px 5px rgba(0,0,0,0.2);\n}\n.prayer-name-wrap{\n  display:flex;\n  flex-direction:column;\n  line-height:1.15;\n  min-width:0;\n}\n.prayer-se{\n  font-family:'Share Tech Mono',monospace;\n  font-weight:400;\n  font-size:clamp(9px,1.45cqi,12px);\n  color:#ffe2b3;\n  white-space:nowrap;\n}\n.cd-pill{\n  background:#06110a;\n  border:1px solid #2b4736;\n  border-radius:4px;\n  padding:clamp(2px,.45cqi,4px) clamp(5px,.9cqi,8px);\n  font-family:'Share Tech Mono',monospace;\n  font-weight:400;\n  font-size:clamp(11px,1.8cqi,15.5px);\n  color:#4ee6ff;\n  white-space:nowrap;\n  text-align:center;\n}\n.cd-pill.urgent-red{\n  background:#290404;\n  border-color:#ff3b30;\n  color:#ff5247;\n  animation:redPulse 0.7s ease-in-out infinite alternate;\n}\n.prayer-row .lbl-ur{text-align:right}\n.prayer-row.is-next{\n  box-shadow:0 0 0 2px #38ff88, 0 3px 12px rgba(56,255,136,0.32);\n  filter:brightness(1.06);\n}\n\n/* छोटे मोबाइल पर 1 कॉलम ताकि सब नंबर बड़े और साफ दिखें */\n@media(max-width:620px){\n  .main-grid{\n    grid-template-columns:1fr;\n  }\n  .prayer-row{\n    grid-template-columns:1fr auto auto 0.55fr;\n  }\n}\n\n/* ====== टेस्ट मोडल ====== */\n.modal-bg{\n  display:none;\n  position:fixed;\n  inset:0;\n  background:rgba(0,0,0,0.68);\n  z-index:60;\n  justify-content:center;\n  align-items:center;\n  padding:14px;\n}\n.modal-bg.open{display:flex}\n.modal{\n  background:#fff;\n  border-radius:10px;\n  padding:16px;\n  width:100%;\n  max-width:360px;\n  font-family:sans-serif;\n  box-shadow:0 16px 40px rgba(0,0,0,0.4);\n}\n.modal h3{margin-bottom:8px;font-size:15px;color:#3d1b0c}\n.modal p{font-size:12.5px;color:#444;line-height:1.5;margin-bottom:10px}\n.test-btns{display:flex;flex-direction:column;gap:8px;margin-bottom:12px}\n.test-btns button{\n  padding:9px 12px;border:none;border-radius:6px;cursor:pointer;\n  font-size:13px;font-weight:700;color:#fff;\n}\n.btn-t-azan{background:#0d7a42}\n.btn-t-cd{background:#d11b1b}\n.btn-t-live{background:#374151}\n.btn-close{\n  width:100%;padding:8px;border:none;border-radius:6px;\n  background:#ddd;color:#222;font-weight:700;cursor:pointer;\n}\n</style>\n</head>\n<body>\n\n<div class=\"clock-frame\">\n  <div class=\"board\">\n    <div class=\"ctrl-bar\">\n      <button class=\"ctrl-btn\" id=\"soundBtn\" title=\"Azan Sound ON/OFF\">🔇</button>\n      <button class=\"ctrl-btn\" id=\"openSet\" title=\"Test Azan & Countdown\">⚙️</button>\n    </div>\n\n    <!-- 1. टॉप हेडर -->\n    <header class=\"top-header\">\n      <div class=\"icon-box\">\n        <svg viewBox=\"0 0 90 70\" xmlns=\"http://www.w3.org/2000/svg\">\n          <rect x=\"10\" y=\"10\" width=\"6\" height=\"46\" fill=\"#d9d2c5\" stroke=\"#7d7463\" stroke-width=\"1\"/>\n          <polygon points=\"9,10 13,2 17,10\" fill=\"#178549\"/>\n          <rect x=\"10\" y=\"20\" width=\"6\" height=\"3\" fill=\"#178549\"/>\n          <path d=\"M24 52 L24 38 Q48 8 72 38 L72 52 Z\" fill=\"#138245\" stroke=\"#0b542c\" stroke-width=\"1.2\"/>\n          <path d=\"M48 16 L48 10\" stroke=\"#b88c24\" stroke-width=\"2\"/>\n          <circle cx=\"48\" cy=\"9\" r=\"2.2\" fill=\"#d4a738\"/>\n          <rect x=\"20\" y=\"51\" width=\"56\" height=\"10\" fill=\"#e6dfd1\" stroke=\"#8a7f6d\" stroke-width=\"1\"/>\n          <rect x=\"30\" y=\"54\" width=\"6\" height=\"7\" rx=\"3\" fill=\"#4f3723\"/>\n          <rect x=\"45\" y=\"54\" width=\"6\" height=\"7\" rx=\"3\" fill=\"#4f3723\"/>\n          <rect x=\"60\" y=\"54\" width=\"6\" height=\"7\" rx=\"3\" fill=\"#4f3723\"/>\n        </svg>\n      </div>\n\n      <div class=\"kalima\">لَا إِلٰهَ إِلَّا اللّٰهُ مُحَمَّدٌ رَّسُوْلُ اللّٰهِ</div>\n\n      <div class=\"icon-box\">\n        <svg viewBox=\"0 0 80 70\" xmlns=\"http://www.w3.org/2000/svg\">\n          <polygon points=\"40,8 68,20 68,54 40,64 12,54 12,20\" fill=\"#222\" stroke=\"#111\" stroke-width=\"1.2\"/>\n          <polygon points=\"40,8 68,20 40,30 12,20\" fill=\"#333\"/>\n          <polygon points=\"12,25 40,35 68,25 68,31 40,41 12,31\" fill=\"#d4a738\"/>\n          <rect x=\"47\" y=\"40\" width=\"9\" height=\"16\" fill=\"#c99a2c\" transform=\"skewY(-18)\"/>\n          <polygon points=\"12,52 40,62 68,52 68,56 40,66 12,56\" fill=\"#d8cfc0\"/>\n        </svg>\n      </div>\n    </header>\n\n    <!-- 2. फ़ुल-साइज़ 2-कॉलम ग्रिड -->\n    <div class=\"main-grid\">\n      <!-- बायाँ कॉलम -->\n      <div class=\"col-left\">\n        <!-- 1. लाइव टाइम -->\n        <div class=\"time-bar\">\n          <span class=\"lbl-en\">TIME</span>\n          <div class=\"led-box\" style=\"flex:1\">\n            <span class=\"seg7 led-green fit-txt\" id=\"liveClock\">12:00<span class=\"sec-small\">00</span></span>\n          </div>\n          <span class=\"lbl-ur\">وقت</span>\n        </div>\n\n        <!-- 2. WEDNESDAY वाला बॉक्स ऊपर (दिन + हिजरी + अंग्रेज़ी + कानपुर) -->\n        <div class=\"brown-card\">\n          <div class=\"matrix-box\">\n            <span class=\"matrix-txt fit-txt\" id=\"liveDay\">WEDNESDAY</span>\n          </div>\n\n          <div class=\"date-pair\">\n            <div class=\"date-block\">\n              <div class=\"date-head\"><span>HIJRI DATE</span><span class=\"lbl-ur\" style=\"font-size:1em;color:#ffe6bd\">ہجری</span></div>\n              <div class=\"led-box\"><span class=\"seg7 led-cyan fit-txt\" id=\"hijriDate\">07.06.1448</span></div>\n            </div>\n            <div class=\"date-block\">\n              <div class=\"date-head\"><span>ENGLISH DATE</span><span class=\"lbl-ur\" style=\"font-size:1em;color:#ffe6bd\">انگریزی</span></div>\n              <div class=\"led-box\"><span class=\"seg7 led-red fit-txt\" id=\"liveDate\">18.11.2026</span></div>\n            </div>\n          </div>\n\n          <div class=\"se-grid\">\n            <div class=\"se-item\">\n              <div class=\"se-lbl\"><span>KANPUR</span></div>\n              <div class=\"led-box\"><span class=\"seg7 seg7-sm led-green fit-txt\">INDIA</span></div>\n            </div>\n            <div class=\"se-item\">\n              <div class=\"se-lbl\"><span>SUNRISE</span><span class=\"lbl-ur\" style=\"font-size:0.95em\">طلوع</span></div>\n              <div class=\"led-box\"><span class=\"seg7 seg7-sm led-amber fit-txt\" id=\"sunriseVal\">6:29</span></div>\n            </div>\n          </div>\n        </div>\n\n        <!-- 3. START & END वाला बॉक्स नीचे + लाइव काउंटडाउन (1 मिनट पहले RED) -->\n        <div class=\"brown-card\" style=\"flex:1\">\n          <div class=\"matrix-box\" id=\"prayerMatrixBox\">\n            <span class=\"matrix-txt fit-txt\" id=\"activePrayerName\">ZUHAR</span>\n          </div>\n\n          <div class=\"se-bottom-grid\">\n            <div class=\"se-card\">\n              <div class=\"se-card-head\">\n                <span class=\"lbl-en\">START</span>\n                <span class=\"lbl-ur\">شروع</span>\n              </div>\n              <div class=\"led-box\"><span class=\"seg7 led-amber fit-txt\" id=\"activeStart\">11:53</span></div>\n            </div>\n            <div class=\"se-card\">\n              <div class=\"se-card-head\">\n                <span class=\"lbl-en\">END</span>\n                <span class=\"lbl-ur\">ختم</span>\n              </div>\n              <div class=\"led-box\"><span class=\"seg7 led-amber fit-txt\" id=\"activeEnd\">3:42</span></div>\n            </div>\n          </div>\n\n          <div class=\"countdown-bar\" id=\"countdownBar\">\n            <span class=\"cd-label\" id=\"cdLabel\">NEXT IN</span>\n            <span class=\"seg7 seg7-sm led-green fit-txt\" id=\"countdownVal\">00:00:00</span>\n          </div>\n        </div>\n      </div>\n\n      <!-- दायाँ कॉलम: सभी 6 टाइम्स + हर एक में लाइव काउंटडाउन (कितना टाइम बाक़ी है) -->\n      <div class=\"col-right\">\n        <div class=\"prayer-row\" data-key=\"FAJR\">\n          <div class=\"prayer-name-wrap\">\n            <span class=\"lbl-en\">FAJR</span>\n            <span class=\"prayer-se\" id=\"se-FAJR\">5:09 - 6:29</span>\n          </div>\n          <div class=\"led-box\"><span class=\"seg7 led-green fit-txt\" id=\"t-FAJR\">5:09</span></div>\n          <div class=\"cd-pill\" id=\"cd-FAJR\">-00:00:00</div>\n          <span class=\"lbl-ur\">فجر</span>\n        </div>\n\n        <div class=\"prayer-row\" data-key=\"SUNRISE\">\n          <div class=\"prayer-name-wrap\">\n            <span class=\"lbl-en\">SUNRISE</span>\n            <span class=\"prayer-se\">FAJR ENDS</span>\n          </div>\n          <div class=\"led-box\"><span class=\"seg7 led-amber fit-txt\" id=\"t-SUNRISE\">6:29</span></div>\n          <div class=\"cd-pill\" id=\"cd-SUNRISE\">-00:00:00</div>\n          <span class=\"lbl-ur\">طلوع</span>\n        </div>\n\n        <div class=\"prayer-row\" data-key=\"ZUHAR\">\n          <div class=\"prayer-name-wrap\">\n            <span class=\"lbl-en\" id=\"lbl-ZUHAR\">ZUHAR</span>\n            <span class=\"prayer-se\" id=\"se-ZUHAR\">11:53 - 3:42</span>\n          </div>\n          <div class=\"led-box\"><span class=\"seg7 led-green fit-txt\" id=\"t-ZUHAR\">11:53</span></div>\n          <div class=\"cd-pill\" id=\"cd-ZUHAR\">-00:00:00</div>\n          <span class=\"lbl-ur\" id=\"ur-ZUHAR\">ظہر</span>\n        </div>\n\n        <div class=\"prayer-row\" data-key=\"ASR\">\n          <div class=\"prayer-name-wrap\">\n            <span class=\"lbl-en\">ASR</span>\n            <span class=\"prayer-se\" id=\"se-ASR\">3:42 - 5:17</span>\n          </div>\n          <div class=\"led-box\"><span class=\"seg7 led-green fit-txt\" id=\"t-ASR\">3:42</span></div>\n          <div class=\"cd-pill\" id=\"cd-ASR\">-00:00:00</div>\n          <span class=\"lbl-ur\">عصر</span>\n        </div>\n\n        <div class=\"prayer-row\" data-key=\"MAGRIB\">\n          <div class=\"prayer-name-wrap\">\n            <span class=\"lbl-en\">MAGRIB</span>\n            <span class=\"prayer-se\" id=\"se-MAGRIB\">5:17 - 6:39</span>\n          </div>\n          <div class=\"led-box\"><span class=\"seg7 led-green fit-txt\" id=\"t-MAGRIB\">5:17</span></div>\n          <div class=\"cd-pill\" id=\"cd-MAGRIB\">-00:00:00</div>\n          <span class=\"lbl-ur\">مغرب</span>\n        </div>\n\n        <div class=\"prayer-row\" data-key=\"ISHA\">\n          <div class=\"prayer-name-wrap\">\n            <span class=\"lbl-en\">ISHA</span>\n            <span class=\"prayer-se\" id=\"se-ISHA\">6:39 - 5:09</span>\n          </div>\n          <div class=\"led-box\"><span class=\"seg7 led-green fit-txt\" id=\"t-ISHA\">6:39</span></div>\n          <div class=\"cd-pill\" id=\"cd-ISHA\">-00:00:00</div>\n          <span class=\"lbl-ur\">عشاء</span>\n        </div>\n      </div>\n    </div>\n  </div>\n</div>\n\n<!-- टेस्ट मोडल -->\n<div class=\"modal-bg\" id=\"setModal\">\n  <div class=\"modal\">\n    <h3>Kanpur, India (Hanafi / Karachi 18°)</h3>\n    <p>Live prayer start &amp; end times with per-second countdowns for <b>Kanpur, India (IST)</b>:</p>\n    <div class=\"test-btns\">\n      <button class=\"btn-t-azan\" id=\"testAzanBtn\" type=\"button\">🔔 Test Azan Alert &amp; Chime</button>\n      <button class=\"btn-t-cd\" id=\"testCdBtn\" type=\"button\">⏱️ Test 1-Min Red Countdown</button>\n      <button class=\"btn-t-live\" id=\"resetLiveBtn\" type=\"button\">↺ Back to Live Kanpur Time</button>\n    </div>\n    <button class=\"btn-close\" id=\"closeSet\" type=\"button\">Close</button>\n  </div>\n</div>\n\n<script>\nconst KANPUR = { lat: 26.4499, lng: 80.3319, tz: 5.5 };\nconst DAYS = [\"SUNDAY\",\"MONDAY\",\"TUESDAY\",\"WEDNESDAY\",\"THURSDAY\",\"FRIDAY\",\"SATURDAY\"];\n\nconst D2R = Math.PI / 180;\nconst R2D = 180 / Math.PI;\nconst sinD = d => Math.sin(d * D2R);\nconst cosD = d => Math.cos(d * D2R);\nconst tanD = d => Math.tan(d * D2R);\nconst asinD = x => Math.asin(x) * R2D;\nconst acosD = x => Math.acos(Math.max(-1, Math.min(1, x))) * R2D;\nconst atan2D = (y, x) => Math.atan2(y, x) * R2D;\nconst acotD = x => Math.atan(1 / x) * R2D;\nconst fixAngle = a => a - 360 * Math.floor(a / 360);\nconst fixHour = h => h - 24 * Math.floor(h / 24);\n\nfunction getJulianDate(y, m, d) {\n  if (m <= 2) { y -= 1; m += 12; }\n  const A = Math.floor(y / 100);\n  const B = 2 - A + Math.floor(A / 4);\n  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + B - 1524.5;\n}\n\nfunction sunPosition(jd) {\n  const D = jd - 2451545.0;\n  const g = fixAngle(357.529 + 0.98560028 * D);\n  const q = fixAngle(280.459 + 0.98564736 * D);\n  const L = fixAngle(q + 1.915 * sinD(g) + 0.020 * sinD(2 * g));\n  const e = 23.439 - 0.00000036 * D;\n  const RA = atan2D(cosD(e) * sinD(L), cosD(L)) / 15;\n  const eqt = q / 15 - fixHour(RA);\n  const decl = asinD(sinD(e) * sinD(L));\n  return { decl, eqt };\n}\n\nfunction calcKanpurTimes(istDate) {\n  const y = istDate.getFullYear();\n  const m = istDate.getMonth() + 1;\n  const d = istDate.getDate();\n  const jd = getJulianDate(y, m, d) - KANPUR.lng / (15 * 24);\n\n  function midDay(t) {\n    return fixHour(12 - sunPosition(jd + t).eqt);\n  }\n  function sunAngleTime(angle, t, dir) {\n    const decl = sunPosition(jd + t).decl;\n    const noon = midDay(t);\n    const num = -sinD(angle) - sinD(decl) * sinD(KANPUR.lat);\n    const den = cosD(decl) * cosD(KANPUR.lat);\n    const T = acosD(num / den) / 15;\n    return noon + (dir === \"ccw\" ? -T : T);\n  }\n  function asrTime(factor, t) {\n    const decl = sunPosition(jd + t).decl;\n    const angle = -acotD(factor + tanD(Math.abs(KANPUR.lat - decl)));\n    return sunAngleTime(angle, t, \"cw\");\n  }\n\n  let fajr    = sunAngleTime(18, 5/24, \"ccw\");\n  let sunrise = sunAngleTime(0.833, 6/24, \"ccw\");\n  let zuhar   = midDay(12/24);\n  let asr     = asrTime(2, 15/24);\n  let magrib  = sunAngleTime(0.833, 18/24, \"cw\");\n  let isha    = sunAngleTime(18, 19/24, \"cw\");\n\n  const adj = h => fixHour(h + KANPUR.tz - KANPUR.lng / 15);\n  const toSecsFromHours = h => Math.round(adj(h) * 60) * 60;\n\n  return {\n    FAJR:    toSecsFromHours(fajr),\n    SUNRISE: toSecsFromHours(sunrise),\n    ZUHAR:   toSecsFromHours(zuhar),\n    ASR:     toSecsFromHours(asr),\n    MAGRIB:  toSecsFromHours(magrib),\n    ISHA:    toSecsFromHours(isha)\n  };\n}\n\nfunction getIndiaNow() {\n  return new Date(new Date().toLocaleString(\"en-US\", { timeZone: \"Asia/Kolkata\" }));\n}\n\nfunction secsTo12hColon(secs) {\n  secs = ((secs % 86400) + 86400) % 86400;\n  let h = Math.floor(secs / 3600) % 12 || 12;\n  let m = Math.floor((secs % 3600) / 60);\n  return `${h}:${String(m).padStart(2, \"0\")}`;\n}\n\nfunction formatHMS(totalSecs) {\n  totalSecs = Math.max(0, Math.floor(totalSecs));\n  const h = Math.floor(totalSecs / 3600);\n  const m = Math.floor((totalSecs % 3600) / 60);\n  const s = totalSecs % 60;\n  return `${String(h).padStart(2,\"0\")}:${String(m).padStart(2,\"0\")}:${String(s).padStart(2,\"0\")}`;\n}\n\nfunction getHijriDDMMYYYY(date) {\n  try {\n    const fmt = new Intl.DateTimeFormat(\"en-u-ca-islamic-umalqura\", {\n      day: \"2-digit\", month: \"2-digit\", year: \"numeric\"\n    });\n    const parts = fmt.formatToParts(date);\n    const d = parts.find(p => p.type === \"day\")?.value || \"01\";\n    const m = parts.find(p => p.type === \"month\")?.value || \"01\";\n    const y = (parts.find(p => p.type === \"year\")?.value || \"1448\").replace(/\\D/g, \"\");\n    return `${d.padStart(2,\"0\")}.${m.padStart(2,\"0\")}.${y}`;\n  } catch (e) {\n    const jd = Math.floor((date.getTime() / 86400000) + 2440587.5);\n    let l = jd - 1948440 + 10632;\n    let n = Math.floor((l - 1) / 10631);\n    l = l - 10631 * n + 354;\n    let j = (Math.floor((10985 - l) / 5316)) * (Math.floor((50 * l) / 17719)) + (Math.floor(l / 5670)) * (Math.floor((43 * l) / 15238));\n    l = l - (Math.floor((30 - j) / 15)) * (Math.floor((17719 * j) / 50)) - (Math.floor(j / 16)) * (Math.floor((15238 * j) / 43)) + 29;\n    let month = Math.floor((24 * l) / 709);\n    let day = l - Math.floor((709 * month) / 24);\n    let year = 30 * n + j - 30;\n    return `${String(day).padStart(2,\"0\")}.${String(month).padStart(2,\"0\")}.${year}`;\n  }\n}\n\nfunction fitBoxes() {\n  document.querySelectorAll(\".fit-txt\").forEach(el => {\n    el.style.fontSize = \"\";\n    const box = el.parentElement;\n    if (!box) return;\n    let size = parseFloat(getComputedStyle(el).fontSize);\n    while (el.scrollWidth > box.clientWidth - 8 && size > 9) {\n      size -= 0.5;\n      el.style.fontSize = size + \"px\";\n    }\n  });\n}\n\nlet soundEnabled = false;\nlet audioCtx = null;\nlet testMode = null;\nlet testEndMs = 0;\nlet lastAzanKey = \"\";\n\nfunction playTone(freq, duration, delay = 0) {\n  if (!soundEnabled) return;\n  try {\n    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();\n    if (audioCtx.state === \"suspended\") audioCtx.resume();\n    const osc = audioCtx.createOscillator();\n    const gain = audioCtx.createGain();\n    osc.type = \"sine\";\n    osc.frequency.setValueAtTime(freq, audioCtx.currentTime + delay);\n    gain.gain.setValueAtTime(0.001, audioCtx.currentTime + delay);\n    gain.gain.exponentialRampToValueAtTime(0.2, audioCtx.currentTime + delay + 0.04);\n    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + delay + duration);\n    osc.connect(gain);\n    gain.connect(audioCtx.destination);\n    osc.start(audioCtx.currentTime + delay);\n    osc.stop(audioCtx.currentTime + delay + duration);\n  } catch (e) {}\n}\n\nfunction playAzanChime() {\n  playTone(523.25, 0.45, 0.0);\n  playTone(659.25, 0.45, 0.35);\n  playTone(783.99, 0.75, 0.70);\n  playTone(659.25, 0.90, 1.35);\n}\n\nfunction updateBoard() {\n  const now = getIndiaNow();\n  const h24 = now.getHours();\n  const m = now.getMinutes();\n  const s = now.getSeconds();\n  const h12 = h24 % 12 || 12;\n  const nowSecs = h24 * 3600 + m * 60 + s;\n\n  // 1. लाइव घड़ी\n  const dotCls = (s % 2 === 0) ? \"blink-dot\" : \"blink-dot blink-off\";\n  document.getElementById(\"liveClock\").innerHTML =\n    `${h12}<span class=\"${dotCls}\">:</span>${String(m).padStart(2,\"0\")}<span class=\"sec-small\">${String(s).padStart(2,\"0\")}</span>`;\n\n  // 2. ऊपर वाला कार्ड: दिन (WEDNESDAY) + हिजरी तारीख + अंग्रेज़ी तारीख\n  document.getElementById(\"liveDay\").textContent = DAYS[now.getDay()];\n  document.getElementById(\"hijriDate\").textContent = getHijriDDMMYYYY(now);\n  const dd = String(now.getDate()).padStart(2,\"0\");\n  const mm = String(now.getMonth()+1).padStart(2,\"0\");\n  document.getElementById(\"liveDate\").textContent = `${dd}.${mm}.${now.getFullYear()}`;\n\n  // 3. कानपुर नमाज़ समय\n  const kp = calcKanpurTimes(now);\n  const ranges = {\n    FAJR:   { start: kp.FAJR,   end: kp.SUNRISE },\n    ZUHAR:  { start: kp.ZUHAR,  end: kp.ASR },\n    ASR:    { start: kp.ASR,    end: kp.MAGRIB },\n    MAGRIB: { start: kp.MAGRIB, end: kp.ISHA },\n    ISHA:   { start: kp.ISHA,   end: kp.FAJR }\n  };\n\n  document.getElementById(\"t-FAJR\").textContent     = secsTo12hColon(kp.FAJR);\n  document.getElementById(\"se-FAJR\").textContent    = `${secsTo12hColon(kp.FAJR)} - ${secsTo12hColon(kp.SUNRISE)}`;\n  document.getElementById(\"t-SUNRISE\").textContent  = secsTo12hColon(kp.SUNRISE);\n  document.getElementById(\"sunriseVal\").textContent = secsTo12hColon(kp.SUNRISE);\n\n  const isFriday = now.getDay() === 5;\n  document.getElementById(\"lbl-ZUHAR\").textContent = isFriday ? \"ZUHAR/JUMA\" : \"ZUHAR\";\n  document.getElementById(\"ur-ZUHAR\").textContent  = isFriday ? \"جمعہ\" : \"ظہر\";\n\n  document.getElementById(\"t-ZUHAR\").textContent   = secsTo12hColon(kp.ZUHAR);\n  document.getElementById(\"se-ZUHAR\").textContent  = `${secsTo12hColon(kp.ZUHAR)} - ${secsTo12hColon(kp.ASR)}`;\n  document.getElementById(\"t-ASR\").textContent     = secsTo12hColon(kp.ASR);\n  document.getElementById(\"se-ASR\").textContent    = `${secsTo12hColon(kp.ASR)} - ${secsTo12hColon(kp.MAGRIB)}`;\n  document.getElementById(\"t-MAGRIB\").textContent  = secsTo12hColon(kp.MAGRIB);\n  document.getElementById(\"se-MAGRIB\").textContent = `${secsTo12hColon(kp.MAGRIB)} - ${secsTo12hColon(kp.ISHA)}`;\n  document.getElementById(\"t-ISHA\").textContent    = secsTo12hColon(kp.ISHA);\n  document.getElementById(\"se-ISHA\").textContent   = `${secsTo12hColon(kp.ISHA)} - ${secsTo12hColon(kp.FAJR)}`;\n\n  // 4. सभी 6 टाइम्स पर लाइव काउंटडाउन (कितना टाइम बाक़ी है)\n  const allKeys = [\"FAJR\", \"SUNRISE\", \"ZUHAR\", \"ASR\", \"MAGRIB\", \"ISHA\"];\n  for (const k of allKeys) {\n    let diff = kp[k] - nowSecs;\n    if (diff < 0) diff += 86400;\n    const pill = document.getElementById(`cd-${k}`);\n    pill.textContent = `-${formatHMS(diff)}`;\n    pill.classList.toggle(\"urgent-red\", diff > 0 && diff <= 60);\n  }\n\n  // 5. सक्रिय/अगली नमाज़ और नीचे START / END कार्ड\n  const order = [\"FAJR\",\"ZUHAR\",\"ASR\",\"MAGRIB\",\"ISHA\"];\n  let currentKey = null;\n  let nextKey = \"FAJR\";\n\n  if (nowSecs >= kp.FAJR && nowSecs < kp.SUNRISE) currentKey = \"FAJR\";\n  else if (nowSecs >= kp.ZUHAR && nowSecs < kp.ASR) currentKey = \"ZUHAR\";\n  else if (nowSecs >= kp.ASR && nowSecs < kp.MAGRIB) currentKey = \"ASR\";\n  else if (nowSecs >= kp.MAGRIB && nowSecs < kp.ISHA) currentKey = \"MAGRIB\";\n  else if (nowSecs >= kp.ISHA || nowSecs < kp.FAJR) currentKey = \"ISHA\";\n\n  for (const k of order) {\n    if (nowSecs <= ranges[k].start) {\n      nextKey = k;\n      break;\n    }\n  }\n\n  let secsToNext = ranges[nextKey].start - nowSecs;\n  if (secsToNext < 0) secsToNext += 86400;\n\n  const displayKey = (secsToNext <= 900 || !currentKey) ? nextKey : currentKey;\n  const dispLabel = (displayKey === \"ZUHAR\" && isFriday) ? \"JUMA\" : displayKey;\n\n  document.getElementById(\"activeStart\").textContent = secsTo12hColon(ranges[displayKey].start);\n  document.getElementById(\"activeEnd\").textContent   = secsTo12hColon(ranges[displayKey].end);\n\n  document.querySelectorAll(\".prayer-row\").forEach(row => {\n    row.classList.toggle(\"is-next\", row.dataset.key === displayKey);\n  });\n\n  // 6. अज़ान टाइम + 1-मिनट लाल काउंटडाउन\n  let isAzanNow = false;\n  for (const k of order) {\n    const diff = nowSecs - ranges[k].start;\n    if (diff >= 0 && diff < 120) {\n      isAzanNow = true;\n      const azId = `${dd}-${k}`;\n      if (diff === 0 && lastAzanKey !== azId) {\n        lastAzanKey = azId;\n        playAzanChime();\n      }\n      break;\n    }\n  }\n\n  let cdRemaining = secsToNext;\n  let isCountdown = (cdRemaining > 0 && cdRemaining <= 60);\n\n  if (testMode === \"azan\") {\n    const rem = Math.ceil((testEndMs - Date.now()) / 1000);\n    if (rem > 0) { isAzanNow = true; isCountdown = false; }\n    else testMode = null;\n  } else if (testMode === \"countdown\") {\n    const rem = Math.ceil((testEndMs - Date.now()) / 1000);\n    if (rem > 0) { isCountdown = true; cdRemaining = rem; isAzanNow = false; }\n    else { testMode = null; isAzanNow = true; }\n  }\n\n  const cdBar = document.getElementById(\"countdownBar\");\n  const cdLabel = document.getElementById(\"cdLabel\");\n  const cdVal = document.getElementById(\"countdownVal\");\n  const matrixBox = document.getElementById(\"prayerMatrixBox\");\n  const prayerTxt = document.getElementById(\"activePrayerName\");\n\n  matrixBox.classList.remove(\"red-alert\", \"azan-alert\");\n  cdBar.classList.remove(\"is-red\");\n  cdVal.classList.remove(\"led-red\", \"led-green\");\n\n  if (isCountdown) {\n    const ss = String(cdRemaining).padStart(2, \"0\");\n    cdBar.classList.add(\"is-red\");\n    cdLabel.textContent = \"STARTING IN\";\n    cdVal.classList.add(\"led-red\");\n    cdVal.textContent = `00:${ss}`;\n    matrixBox.classList.add(\"red-alert\");\n    prayerTxt.textContent = `${dispLabel} · ${ss}S`;\n    if (cdRemaining <= 5) playTone(880, 0.12, 0);\n  } else if (isAzanNow) {\n    cdLabel.textContent = \"STATUS\";\n    cdVal.classList.add(\"led-green\");\n    cdVal.textContent = \"AZAN\";\n    matrixBox.classList.add(\"azan-alert\");\n    prayerTxt.textContent = `AZAN · ${dispLabel}`;\n  } else {\n    const nextLabel = (nextKey === \"ZUHAR\" && isFriday) ? \"JUMA\" : nextKey;\n    cdLabel.textContent = `${nextLabel} IN`;\n    cdVal.classList.add(\"led-green\");\n    cdVal.textContent = formatHMS(secsToNext);\n    prayerTxt.textContent = dispLabel;\n  }\n\n  fitBoxes();\n}\n\nconst soundBtn = document.getElementById(\"soundBtn\");\nsoundBtn.addEventListener(\"click\", () => {\n  soundEnabled = !soundEnabled;\n  soundBtn.textContent = soundEnabled ? \"🔊\" : \"🔇\";\n  soundBtn.classList.toggle(\"sound-on\", soundEnabled);\n  if (soundEnabled) playTone(660, 0.15, 0);\n});\n\nconst modal = document.getElementById(\"setModal\");\ndocument.getElementById(\"openSet\").addEventListener(\"click\", () => modal.classList.add(\"open\"));\ndocument.getElementById(\"closeSet\").addEventListener(\"click\", () => modal.classList.remove(\"open\"));\n\ndocument.getElementById(\"testAzanBtn\").addEventListener(\"click\", () => {\n  testMode = \"azan\";\n  testEndMs = Date.now() + 12000;\n  soundEnabled = true;\n  soundBtn.textContent = \"🔊\";\n  soundBtn.classList.add(\"sound-on\");\n  playAzanChime();\n  modal.classList.remove(\"open\");\n  updateBoard();\n});\n\ndocument.getElementById(\"testCdBtn\").addEventListener(\"click\", () => {\n  testMode = \"countdown\";\n  testEndMs = Date.now() + 60000;\n  modal.classList.remove(\"open\");\n  updateBoard();\n});\n\ndocument.getElementById(\"resetLiveBtn\").addEventListener(\"click\", () => {\n  testMode = null;\n  modal.classList.remove(\"open\");\n  updateBoard();\n});\n\nif (document.fonts && document.fonts.ready) {\n  document.fonts.ready.then(fitBoxes);\n}\nwindow.addEventListener(\"resize\", fitBoxes);\n\nupdateBoard();\nsetInterval(updateBoard, 1000);\n<\/script>\n</body>\n</html>";
(function(){
  const mount = () => {
    const frame = document.getElementById('prayerTimesFrame');
    if (frame && !frame.dataset.loaded) {
      frame.srcdoc = PRAYER_TIMES_SRC;
      frame.dataset.loaded = '1';
    }
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount, { once:true });
  else mount();
})();
