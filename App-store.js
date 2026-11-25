
(function () {
  "use strict";

  /* STATE STORAGE */
  var savedTools = JSON.parse(localStorage.getItem("bst_saved_tools") || "[]");
  var historyList = JSON.parse(localStorage.getItem("bst_history_list") || "[]");
  var privateCards = JSON.parse(localStorage.getItem("bst_private_cards") || "[]");
  var privateRecovery = JSON.parse(localStorage.getItem("bst_private_recovery") || "[]");
  var privateActivity = JSON.parse(localStorage.getItem("bst_private_activity") || "[]");
  var searchHistory = [];
  try { searchHistory = JSON.parse(localStorage.getItem("bst_search_history_v1") || "[]"); } catch (searchHistoryError) { searchHistory = []; }
  if (!Array.isArray(searchHistory)) searchHistory = [];
  searchHistory = searchHistory.filter(function(word){ return typeof word === "string" && word.trim(); }).slice(0, 200);
  var lockedCards = JSON.parse(localStorage.getItem("bst_locked_cards") || "[]");
  var categories = JSON.parse(localStorage.getItem("bst_categories") || "[]");
  var vaultPattern = JSON.parse(localStorage.getItem("bst_vault_pattern") || "[]");
  var patternResetInProgress = false;
  var currentThemeIdx = parseInt(localStorage.getItem("bst_theme_idx") || "1", 10);
  if (!Number.isFinite(currentThemeIdx) || currentThemeIdx < 1 || currentThemeIdx > 30) currentThemeIdx = 1;
  var patternFailedAttempts = parseInt(localStorage.getItem("bst_pattern_failures") || "0", 10) || 0;
  var patternLockUntil = parseInt(localStorage.getItem("bst_pattern_lock_until") || "0", 10) || 0;
  var isDarkMode = localStorage.getItem("bst_dark_mode") !== "false";
  var isSavedMarkDelMode = false;
  var isPrivMarkDelMode = false;
  var isLockMarkRestMode = false;
  var isCatMarkDelMode = false;

  /* 30 VIP THEMES PALETTES */
  var vipThemes = [
    { name: "Default Navy Orange", bg: "#090d16", panel: "linear-gradient(145deg, #151b2a, #0c111d)", card: "linear-gradient(145deg, #211e1b, #121722)", btn: "linear-gradient(135deg, #1f293d, #111827)", header: "linear-gradient(115deg, #e95a00 0%, #ff8500 45%, #ffb347 100%)", footer: "radial-gradient(circle at 0% 0%, rgba(255, 133, 0, 0.16), transparent 42%), radial-gradient(circle at 100% 100%, rgba(119, 75, 190, 0.18), transparent 45%), linear-gradient(135deg, #101827 0%, #17152b 48%, #101827 100%)" },
    { name: "Cyberpunk Neon", bg: "#050508", panel: "linear-gradient(145deg, #18122b, #090614)", card: "linear-gradient(145deg, #23193a, #100b1e)", btn: "linear-gradient(135deg, #2e1a47, #130922)", header: "linear-gradient(115deg, #9333ea 0%, #c084fc 50%, #f43f5e 100%)", footer: "radial-gradient(circle at 0% 0%, rgba(147, 51, 234, 0.2), transparent 42%), linear-gradient(135deg, #0f081c 0%, #1a0b2e 100%)" },
    { name: "Emerald Matrix", bg: "#02120a", panel: "linear-gradient(145deg, #062816, #02120a)", card: "linear-gradient(145deg, #0b3820, #041a0e)", btn: "linear-gradient(135deg, #0f4a29, #052112)", header: "linear-gradient(115deg, #059669 0%, #10b981 50%, #34d399 100%)", footer: "radial-gradient(circle at 0% 0%, rgba(16, 185, 129, 0.2), transparent 42%), linear-gradient(135deg, #02120a 0%, #062816 100%)" },
    { name: "Royal Purple", bg: "#10071a", panel: "linear-gradient(145deg, #241038, #10071a)", card: "linear-gradient(145deg, #381856, #1b0c2b)", btn: "linear-gradient(135deg, #4b2075, #220e36)", header: "linear-gradient(115deg, #6b21a8 0%, #9333ea 50%, #c084fc 100%)", footer: "radial-gradient(circle at 0% 0%, rgba(147, 51, 234, 0.2), transparent 42%), linear-gradient(135deg, #10071a 0%, #241038 100%)" },
    { name: "Crimson Spark", bg: "#140505", panel: "linear-gradient(145deg, #2b0f0f, #140505)", card: "linear-gradient(145deg, #451717, #1f0808)", btn: "linear-gradient(135deg, #5c2020, #260a0a)", header: "linear-gradient(115deg, #dc2626 0%, #ef4444 50%, #fca5a5 100%)", footer: "radial-gradient(circle at 0% 0%, rgba(239, 68, 68, 0.2), transparent 42%), linear-gradient(135deg, #140505 0%, #2b0f0f 100%)" },
    { name: "Deep Ocean", bg: "#02101a", panel: "linear-gradient(145deg, #0a2538, #02101a)", card: "linear-gradient(145deg, #0f3754, #051b2b)", btn: "linear-gradient(135deg, #164a70, #082236)", header: "linear-gradient(115deg, #0284c7 0%, #0ea5e9 50%, #38bdf8 100%)", footer: "radial-gradient(circle at 0% 0%, rgba(14, 165, 233, 0.2), transparent 42%), linear-gradient(135deg, #02101a 0%, #0a2538 100%)" },
    { name: "Golden Sunset", bg: "#171203", panel: "linear-gradient(145deg, #332706, #171203)", card: "linear-gradient(145deg, #52400a, #211904)", btn: "linear-gradient(135deg, #6e550d, #2d2306)", header: "linear-gradient(115deg, #d97706 0%, #f59e0b 50%, #fcd34d 100%)", footer: "radial-gradient(circle at 0% 0%, rgba(245, 158, 11, 0.2), transparent 42%), linear-gradient(135deg, #171203 0%, #332706 100%)" },
    { name: "Midnight Charcoal", bg: "#111111", panel: "linear-gradient(145deg, #222222, #111111)", card: "linear-gradient(145deg, #333333, #1a1a1a)", btn: "linear-gradient(135deg, #444444, #222222)", header: "linear-gradient(115deg, #374151 0%, #4b5563 50%, #9ca3af 100%)", footer: "radial-gradient(circle at 0% 0%, rgba(107, 114, 128, 0.2), transparent 42%), linear-gradient(135deg, #111111 0%, #222222 100%)" },
    { name: "Neon Turquoise", bg: "#011616", panel: "linear-gradient(145deg, #032d2d, #011616)", card: "linear-gradient(145deg, #064545, #021f1f)", btn: "linear-gradient(135deg, #095c5c, #032d2d)", header: "linear-gradient(115deg, #0d9488 0%, #14b8a6 50%, #5eead4 100%)", footer: "radial-gradient(circle at 0% 0%, rgba(20, 184, 166, 0.2), transparent 42%), linear-gradient(135deg, #011616 0%, #032d2d 100%)" },
    { name: "Amethyst Glow", bg: "#16061a", panel: "linear-gradient(145deg, #2e0d36, #16061a)", card: "linear-gradient(145deg, #471454, #210826)", btn: "linear-gradient(135deg, #5e1c6e, #2c0b33)", header: "linear-gradient(115deg, #a21caf 0%, #c084fc 50%, #e879f9 100%)", footer: "radial-gradient(circle at 0% 0%, rgba(192, 132, 252, 0.2), transparent 42%), linear-gradient(135deg, #16061a 0%, #2e0d36 100%)" },
    { name: "Neon Lime", bg: "#081404", panel: "linear-gradient(145deg, #132e09, #081404)", card: "linear-gradient(145deg, #1f470e, #0d2106)", btn: "linear-gradient(135deg, #2b6114, #122b08)", header: "linear-gradient(115deg, #65a30d 0%, #84cc16 50%, #bef264 100%)", footer: "radial-gradient(circle at 0% 0%, rgba(132, 204, 22, 0.2), transparent 42%), linear-gradient(135deg, #081404 0%, #132e09 100%)" },
    { name: "Sunset Coral", bg: "#1a0808", panel: "linear-gradient(145deg, #381212, #1a0808)", card: "linear-gradient(145deg, #591d1d, #260c0c)", btn: "linear-gradient(135deg, #752626, #331010)", header: "linear-gradient(115deg, #ea580c 0%, #f97316 50%, #fdba74 100%)", footer: "radial-gradient(circle at 0% 0%, rgba(249, 115, 22, 0.2), transparent 42%), linear-gradient(135deg, #1a0808 0%, #381212 100%)" },
    { name: "Electric Indigo", bg: "#0a0a1a", panel: "linear-gradient(145deg, #171738, #0a0a1a)", card: "linear-gradient(145deg, #252554, #0f0f26)", btn: "linear-gradient(135deg, #343473, #151536)", header: "linear-gradient(115deg, #4f46e5 0%, #6366f1 50%, #a5b4fc 100%)", footer: "radial-gradient(circle at 0% 0%, rgba(99, 102, 241, 0.2), transparent 42%), linear-gradient(135deg, #0a0a1a 0%, #171738 100%)" },
    { name: "Deep Ruby", bg: "#1c040d", panel: "linear-gradient(145deg, #3d091d, #1c040d)", card: "linear-gradient(145deg, #5e0e2d, #2a0614)", btn: "linear-gradient(135deg, #7d133c, #38081b)", header: "linear-gradient(115deg, #be185d 0%, #db2777 50%, #f472b6 100%)", footer: "radial-gradient(circle at 0% 0%, rgba(219, 39, 119, 0.2), transparent 42%), linear-gradient(135deg, #1c040d 0%, #3d091d 100%)" },
    { name: "Nordic Frost", bg: "#0a1118", panel: "linear-gradient(145deg, #132232, #0a1118)", card: "linear-gradient(145deg, #1d364f, #0f1b26)", btn: "linear-gradient(135deg, #284c6e, #142536)", header: "linear-gradient(115deg, #0369a1 0%, #0284c7 50%, #7dd3fc 100%)", footer: "radial-gradient(circle at 0% 0%, rgba(2, 132, 199, 0.2), transparent 42%), linear-gradient(135deg, #0a1118 0%, #132232 100%)" },
    { name: 'Obsidian Gold', bg: '#100b04', panel: 'linear-gradient(145deg, #2a1c08, #100b04)', card: 'linear-gradient(145deg, #49300b, #2a1c08)', btn: 'linear-gradient(135deg, #60420d, #2a1c08)', header: 'linear-gradient(115deg, #b77908 0%, #fbbf24 100%)', footer: 'radial-gradient(circle at 0% 0%, #b7790833, transparent 48%), linear-gradient(135deg, #100b04, #2a1c08)' },
    { name: 'Ice Crystal', bg: '#07131f', panel: 'linear-gradient(145deg, #102a40, #07131f)', card: 'linear-gradient(145deg, #183d59, #102a40)', btn: 'linear-gradient(135deg, #205578, #102a40)', header: 'linear-gradient(115deg, #0284c7 0%, #bae6fd 100%)', footer: 'radial-gradient(circle at 0% 0%, #0284c733, transparent 48%), linear-gradient(135deg, #07131f, #102a40)' },
    { name: 'Rose Quartz', bg: '#1b0912', panel: 'linear-gradient(145deg, #351324, #1b0912)', card: 'linear-gradient(145deg, #4a1b31, #351324)', btn: 'linear-gradient(135deg, #642342, #351324)', header: 'linear-gradient(115deg, #db2777 0%, #f9a8d4 100%)', footer: 'radial-gradient(circle at 0% 0%, #db277733, transparent 48%), linear-gradient(135deg, #1b0912, #351324)' },
    { name: 'Arctic Aurora', bg: '#04191b', panel: 'linear-gradient(145deg, #073235, #04191b)', card: 'linear-gradient(145deg, #0b4546, #073235)', btn: 'linear-gradient(135deg, #12615c, #073235)', header: 'linear-gradient(115deg, #14b8a6 0%, #99f6e4 100%)', footer: 'radial-gradient(circle at 0% 0%, #14b8a633, transparent 48%), linear-gradient(135deg, #04191b, #073235)' },
    { name: 'Royal Sapphire', bg: '#050c27', panel: 'linear-gradient(145deg, #101c48, #050c27)', card: 'linear-gradient(145deg, #192b63, #101c48)', btn: 'linear-gradient(135deg, #253d86, #101c48)', header: 'linear-gradient(115deg, #3b82f6 0%, #93c5fd 100%)', footer: 'radial-gradient(circle at 0% 0%, #3b82f633, transparent 48%), linear-gradient(135deg, #050c27, #101c48)' },
    { name: 'Copper Luxe', bg: '#190d08', panel: 'linear-gradient(145deg, #32190e, #190d08)', card: 'linear-gradient(145deg, #4c2515, #32190e)', btn: 'linear-gradient(135deg, #68351b, #32190e)', header: 'linear-gradient(115deg, #c26932 0%, #fdba74 100%)', footer: 'radial-gradient(circle at 0% 0%, #c2693233, transparent 48%), linear-gradient(135deg, #190d08, #32190e)' },
    { name: 'Phantom Violet', bg: '#10091e', panel: 'linear-gradient(145deg, #201039, #10091e)', card: 'linear-gradient(145deg, #301653, #201039)', btn: 'linear-gradient(135deg, #432070, #201039)', header: 'linear-gradient(115deg, #8b5cf6 0%, #c4b5fd 100%)', footer: 'radial-gradient(circle at 0% 0%, #8b5cf633, transparent 48%), linear-gradient(135deg, #10091e, #201039)' },
    { name: 'Jade Empire', bg: '#04130e', panel: 'linear-gradient(145deg, #09271b, #04130e)', card: 'linear-gradient(145deg, #103c29, #09271b)', btn: 'linear-gradient(135deg, #185338, #09271b)', header: 'linear-gradient(115deg, #059669 0%, #a7f3d0 100%)', footer: 'radial-gradient(circle at 0% 0%, #05966933, transparent 48%), linear-gradient(135deg, #04130e, #09271b)' },
    { name: 'Ruby Diamond', bg: '#1a0610', panel: 'linear-gradient(145deg, #340b20, #1a0610)', card: 'linear-gradient(145deg, #4b102d, #340b20)', btn: 'linear-gradient(135deg, #67153e, #340b20)', header: 'linear-gradient(115deg, #e11d48 0%, #fda4af 100%)', footer: 'radial-gradient(circle at 0% 0%, #e11d4833, transparent 48%), linear-gradient(135deg, #1a0610, #340b20)' },
    { name: 'Solar Flare', bg: '#1a1002', panel: 'linear-gradient(145deg, #332006, #1a1002)', card: 'linear-gradient(145deg, #4b2d08, #332006)', btn: 'linear-gradient(135deg, #68400a, #332006)', header: 'linear-gradient(115deg, #f59e0b 0%, #fde68a 100%)', footer: 'radial-gradient(circle at 0% 0%, #f59e0b33, transparent 48%), linear-gradient(135deg, #1a1002, #332006)' },
    { name: 'Blue Steel', bg: '#0a111a', panel: 'linear-gradient(145deg, #172331, #0a111a)', card: 'linear-gradient(145deg, #223548, #172331)', btn: 'linear-gradient(135deg, #2e465d, #172331)', header: 'linear-gradient(115deg, #64748b 0%, #cbd5e1 100%)', footer: 'radial-gradient(circle at 0% 0%, #64748b33, transparent 48%), linear-gradient(135deg, #0a111a, #172331)' },
    { name: 'Toxic Neon', bg: '#091303', panel: 'linear-gradient(145deg, #172b08, #091303)', card: 'linear-gradient(145deg, #25420c, #172b08)', btn: 'linear-gradient(135deg, #365e11, #172b08)', header: 'linear-gradient(115deg, #84cc16 0%, #d9f99d 100%)', footer: 'radial-gradient(circle at 0% 0%, #84cc1633, transparent 48%), linear-gradient(135deg, #091303, #172b08)' },
    { name: 'Berry Champagne', bg: '#190b17', panel: 'linear-gradient(145deg, #30152b, #190b17)', card: 'linear-gradient(145deg, #48203f, #30152b)', btn: 'linear-gradient(135deg, #612b53, #30152b)', header: 'linear-gradient(115deg, #c084fc 0%, #f5d0fe 100%)', footer: 'radial-gradient(circle at 0% 0%, #c084fc33, transparent 48%), linear-gradient(135deg, #190b17, #30152b)' },
    { name: 'Volcanic Ember', bg: '#190805', panel: 'linear-gradient(145deg, #35110a, #190805)', card: 'linear-gradient(145deg, #4e190d, #35110a)', btn: 'linear-gradient(135deg, #6d2412, #35110a)', header: 'linear-gradient(115deg, #f97316 0%, #fdba74 100%)', footer: 'radial-gradient(circle at 0% 0%, #f9731633, transparent 48%), linear-gradient(135deg, #190805, #35110a)' },
    { name: 'Moonlight Teal', bg: '#041317', panel: 'linear-gradient(145deg, #09272d, #041317)', card: 'linear-gradient(145deg, #10383f, #09272d)', btn: 'linear-gradient(135deg, #174c55, #09272d)', header: 'linear-gradient(115deg, #06b6d4 0%, #a5f3fc 100%)', footer: 'radial-gradient(circle at 0% 0%, #06b6d433, transparent 48%), linear-gradient(135deg, #041317, #09272d)' }
  ];

  function applyTheme(idx) {
    currentThemeIdx = idx;
    localStorage.setItem("bst_theme_idx", idx);
    var t = vipThemes[idx - 1];
    if (!t) { idx = 1; currentThemeIdx = 1; t = vipThemes[0]; }
    if (!isDarkMode) return;

    document.documentElement.style.setProperty('--bg', t.bg);
    document.documentElement.style.setProperty('--panel-bg', t.panel);
    document.documentElement.style.setProperty('--card-bg', t.card);
    document.documentElement.style.setProperty('--btn-bg', t.btn);
    document.documentElement.style.setProperty('--header-bg', t.header);
    document.documentElement.style.setProperty('--footer-bg', t.footer);

    var themeIdxSpan = document.getElementById("theme-index");
    if (themeIdxSpan) themeIdxSpan.textContent = idx;
  }

  function applyDarkMode() {
    var dmStatus = document.getElementById("darkmode-status");
    if (isDarkMode) {
      document.body.classList.remove("light-mode");
      if (dmStatus) dmStatus.textContent = "On";
      applyTheme(currentThemeIdx);
    } else {
      document.body.classList.add("light-mode");
      if (dmStatus) dmStatus.textContent = "Off";
      document.documentElement.style.removeProperty('--bg');
      document.documentElement.style.removeProperty('--panel-bg');
      document.documentElement.style.removeProperty('--card-bg');
      document.documentElement.style.removeProperty('--btn-bg');
      document.documentElement.style.removeProperty('--header-bg');
      document.documentElement.style.removeProperty('--footer-bg');
    }
    localStorage.setItem("bst_dark_mode", isDarkMode);
  }

  /* URL & View State Manager */
  var urlParams = new URLSearchParams(window.location.search);
  var savedViewState = {};
  try { savedViewState = JSON.parse(sessionStorage.getItem("bst_current_view_state") || "{}"); } catch (_) {}
  var initialView = urlParams.get("view") || savedViewState.view || "home";
  var initialPage = parseInt(urlParams.get("page") || savedViewState.page, 10) || 1;
  var initialSearch = urlParams.get("q") || savedViewState.q || "";

  /* DRAWER MENU */
  var menuToggle = document.getElementById("bst-menu-toggle");
  var drawer = document.getElementById("bst-drawer");
  var drawerClose = document.getElementById("bst-drawer-close");
  var overlay = document.getElementById("bst-overlay");

  function toggleMenu() {
    drawer.classList.toggle("open");
    overlay.classList.toggle("active");
  }

  menuToggle.addEventListener("click", toggleMenu);
  drawerClose.addEventListener("click", toggleMenu);
  overlay.addEventListener("click", toggleMenu);

  /* WEBSITE DATA
     Har tool mein apkUrl set karo:
     - "#" = abhi koi APK link nahi (button click pe kuch nahi hoga)
     - "https://example.com/app.apk" = real APK / Play Store / download link
     Example:
     { title: "...", url: "https://...", views: 1000, online: 500, active: 200, imgUrl: "...", apkUrl: "https://play.google.com/store/apps/details?id=..." },
  */
  var originalItems = [
    { title: "Israr Tool Zone - Multi HTML Viewer", url: "https://isrartoolzone.blogspot.com/p/israr-tool-zone-multi-html-viewer.html", views: 14200, online: 8680, active: 6200, imgUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjAAOOkKlvYcxFrgIegjuqWjbvDko3iT6oUFDKcF-DUSnpUr_L5HVNmxl19VPpjNGZ70uT9puZz0tG4SQwVO5JU_fqQkG3hN7uGFHyaX2xZcdTXR4aRqs61Ds1joYnZj9oF_6W4X464Ct5MnV60GQuTO4Ok5MZwmfFEy4nZ4st654qB-bdmRCXmjxZR8ic/s1365/113094.png", apkUrl: "https://www.technoisrar.in" },
    { title: "Israr Tool Zone - Quran Tarjuma PRO | Free Quran Translation & Tafseer Tool", url: "https://isrartoolzone.blogspot.com/p/israr-tool-zone-quran-tarjuma-pro-free.html", views: 14200, online: 8680, active: 6200, imgUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh3FqR6U4MzSEH7Z-CJM3AnaTbMThPdfhCVHkGAjTvpeSAvX8ikGoXhW2-CwCmlRDs9QTT0Fgq5NqlMokHI5mvAwwj1LXKcYkFfcwAdD0QRalNqBB4pq6Jy1Rs3VLztkeiRJJ86BcdvdwWfNn8xJc9sNn8JkrsxCW0e35kOzXatiU1OyO5_Gg7sjPBCd9g/s1365/112208.webp", apkUrl: "#" },
    { title: "Premium Verification Gateway Generator Free Israr Tool Zone", url: "https://isrartoolzone.blogspot.com/p/premium-verification-gateway-generator.html", views: 14200, online: 8680, active: 6200, imgUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjyNHf1cvZ4zYVwta08SwZ5V8fBQMpH1pDrxyDqGGrZUVIzxLMycosCZUpraDTfLXAd8RiAbY-F8GaNcilIwOZoYVtSYJwrzGmz4PsFUwYvDqnOE6ZI6IeHS2Sq4h7RGKIt14AUVAdm5XyS_c2dHexdU_h_jHwUhIqIKa2umt9nAk_BhAn0q3eR3Vy5mt8/s1376/85793.jpg", apkUrl: "#" },
    { title: "Article Divider - Split Text Into 200+", url: "https://isrartoolzone.blogspot.com/p/article-divider-split-text-into-200.html", views: 18500, online: 11340, active: 8100, imgUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhJiYmkQQaUiGo3G17Gqf7jRZGBgHuv8fquhNiLk-Rj8Lniqg-6Q0qOLq7VyFRWpPokU62kRfRuQoyldTvSHZuuROKsR7pHg7FigUrm-BS5P3sAlNUW7cfaALRRifdrXah-BLo8jo0eBOiKgqcgeg2Ld5c80Dv7qcayn5U6To_aV6mc21pmJEjlVn65fhg/s1024/A_luxurious,_ultra-modern_crea_330810882%20(1).jpeg", apkUrl: "#" },
    { title: "Email Generator - Unlimited Custom Emails", url: "https://isrartoolzone.blogspot.com/p/email-generator-unlimited-custom-emails.html", views: 12100, online: 7419, active: 5300, imgUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhh6I0x3O0sjuxMKHeFiANLLdPaHqRu26l2sS5K4ACJTUQlgAFn5_LWdzhhVg05saFzQzEMmToy4Ba1Wvd3i7cBFnrAZ8EmoeD4g3PuYiWgoiPVdAbKPZpAFQRks0FVG67weHo6LrlyJLnRj3q7WDlSCK4hWziDK33el4JjlVEH1Qw0f7M5EvpYtZdU4bY/s944/Futuristic_premium_studio_with_8830680.jpeg", apkUrl: "#" },
    { title: "AI Images Generator - Text to Image", url: "https://isrartoolzone.blogspot.com/p/ai-images-generator-text-to-image.html", views: 22400, online: 13160, active: 9400, imgUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjvpnQrD15qS57_HoLip6Wf7PLVzNMTxZjbzGxqLOvQls43Y-8fCR1uyiAxwM3KfuoSyoAiwod0UDj69QNw9UXzbKi321KIRzfTt0zcKxVHEalnOtVWBQGTSMfVlLNjSlBSYF1BR_za4iaIs_SJtHAvaldoQROZFb-gjRnL5kh9m64NGbbA08NooxTWE_VW/s1024/A_modern,_futuristic_tech_678662982.png", apkUrl: "#" },
    { title: "AI Creative Suite - Free Text to Image", url: "https://isrartoolzone.blogspot.com/p/ai-creative-suite-free-text-to-image.html", views: 15400, online: 10080, active: 7200, imgUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhoY2lysf4-5Q9AoE7vGmodh1bMVuziRNDRqzQ6vbhN3iK5rfyokOzEVt7Ur4jWE5LN2NXzTT8Pcyjr124LFA97i70lZgwnHr5IJpuByJupSR8S_8iLvG2DzugdwgyOCBTKEIclcSp5M8yNKbB3e4BTOUUcG9pqd-6pMmUSpmBzD6GEcu9pZZBzrfzQPSZi/s1704/A_futuristic_3D_studio_interio_685484605.png.jpg", apkUrl: "#" },
    { title: "AI Art Generator - Text to Image Free", url: "https://isrartoolzone.blogspot.com/p/ai-art-generator-text-to-image-free.html", views: 19800, online: 11900, active: 8500, imgUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhUlv-vYxogNx95PW4h5NC5nyskjIrrixgkq7FqxBS5BWcTRPMe3ChuER0Oc-OhYGz7ezVLwGPUww8vxBQbx0QBd50Ya_njJ4efGAhMnb_7-1vAQJGwSLPAkhI9W0ETSd-QLvxVs1fPmV2OiCoaiHauTvR2lVDiBaEnPyCfJfNPJwQ0cDo1rg3vJYYiVI0/s1024/generated_image_1756796196225.png.jpg", apkUrl: "#" },
    { title: "AI Code Builder - Free No API Key", url: "https://isrartoolzone.blogspot.com/p/ai-code-builder-free-no-api-key-israr.html", views: 16700, online: 10360, active: 7400, imgUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhUJdq45TV9gQfwJj6TAs666cFvPR5YC3fL9-RgkpkwFdXRWBsY62mceGmqpF5vZlYOif4OG3oqG8h2kTt1vu0ifusrrG2mppCfmAE3jBBX38qDBnyPQToRQ4ukHvuCXhcTwgV7jJkdCOQm_gi5zWWYdYc4B3Lpn1a4digH87pVrRZOUz6GVo0W4UnWjHSz/s1024/A_futuristic_3D_tech_work_925742714.png.jpg", apkUrl: "#" },
    { title: "Paste to Link Generator Code Share", url: "https://isrartoolzone.blogspot.com/p/paste-to-link-generator-code-share.html", views: 11200, online: 6860, active: 4900, imgUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEivxdWKmsx-QRj4ecXe5voulhXKyxwRLJT-6QQl3TqKvnM_8rj4ouN2j9IDlgtt_ANwNwOuxE1OM1YS-fYTIvwwpQSZgVUV6c361LKgIq_sj9qmD17DuqQvhJ508xAA-ixq7Dy_N6D1J-5xCtugUgFTaHV10zKxDAAMBgOD2XpGtpTJcRE9omJG5Obc1JE/s1024/Ultra-realistic_8K_3D_futurist_474969675%20(1).jpeg", apkUrl: "#" },
    { title: "URL Shortener Short Link QR Generator", url: "https://isrartoolzone.blogspot.com/p/url-shortener-short-link-qr-generator.html", views: 25100, online: 14280, active: 10200, imgUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiyaFKUeZY-0PjkvG_CK_viHaM_GvDEf8ky9hPZAcY3pg3HumBnU8n1Ai8ebb5dxBIDztT5VO2iTR4snFxuy0YRSU3X18RcQ6yp5adGAq40I1r7BfKHKpMzKVCwqENQrixY8eyq1I2graCfiI5k8e2xiwV_dLxFQQM4lyHeZlG2rco-EMPX3SJPHk7iZ6RB/s1024/A_stylish_young_woman_sta_518554105.png", apkUrl: "#" },
    { title: "Advance HTML Viewer Code Live Preview", url: "https://isrartoolzone.blogspot.com/p/advance-html-viewer-code-live-preview.html", views: 13400, online: 8119, active: 5800, imgUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEia8mazQu3xBBGmE4v0pcYe2wO45RCzWfLLSkSeAPkR5uEBVN96pVyQIQgRKp_v4CxJK6IqFLLYSoBfRZ4ZfwhZPkEtHjDSAFLjifAiv6nbJckI5aKz3r1b6UPczwZ0lmvl8_sHbOUSdDf2oPC2Soku4GAkDe2jRkWatGWo_wbhJ92Y-TkmnY_IWDpQSEjz/s1024/A_modern_classroom_design_252651673.png", apkUrl: "#" },
    { title: "HTML Viewer Live Preview Tool Online", url: "https://isrartoolzone.blogspot.com/p/html-viewer-live-preview-tool-online.html", views: 14500, online: 8540, active: 6100, imgUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhYVaagKHgwBPn5rfvIkedoaSLNBoUvDBuaJjRrABJY8BE7qEg5o5a48V-1EdkmuYxkwy7CrL68W9WSV2F9tHGduoATkkjLzWGcflY3t83rno6d1EHvKlfobLpdb2pq9ySV1_RMB40SMFeFppQzsuFkY5BIe3WazFZX3BHnB13AppIr8Usdf-OUxFw9u3dH/s1024/A_modern_tech_workspace_r_226046361.png.jpg", apkUrl: "#" },
    { title: "Text to Speech Speech to Text Voice", url: "https://isrartoolzone.blogspot.com/p/text-to-speech-speech-to-text-voice.html", views: 17200, online: 10500, active: 7500, imgUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgW2gC5TSitsAPJ0vUivjkW4kAlGEhpXUR6SxMR9_lRSroWyhefH6CFjrXiasDyhOH4YGM6jF2P3nM8iVOzoKReNiQ2k2LbcXTQAL5xO0DGy4u2sTz-KfVAx4k5u_Zw7JInjOgbf2DxEoIvuxReyxmyZ_1lPElc4hQu1E4T491LFMH-0wpcTommB_YmR76k/s1024/A_realistic_tech_workspac_333279290.png.jpg", apkUrl: "#" },
    { title: "Word Counter Character Count Tool", url: "https://isrartoolzone.blogspot.com/p/word-counter-character-count-tool.html", views: 16100, online: 9520, active: 6800, imgUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhqnd4EAAHU6YXpK4t30tBYnXDi60ZdIzWU7zbRQuyHeX4s56PRib4ee25efh-ayNvgvV_ZprfY7lroRR_hR8yhZTWch789cwV-rV6gROSzexsp3RG0F75UyNOhRFObEVkgAOzF3jPoMUHPi1u86xakEgw9H8x_y8UGT4C4HIaMKcJbgChXZD2DTpY2WbPw/s1024/A_modern_workspace_setup__236130886.png.jpg", apkUrl: "#" },
    { title: "Hijri Date Converter Islamic Calendar", url: "https://isrartoolzone.blogspot.com/p/hijri-date-converter-islamic-calendar.html", views: 9400, online: 5740, active: 4100, imgUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgOPG8PQG3AzegUFx3pXasamoA9VjYU8zzbR5EDyy4q8weLw81DjDNExPgRoZr0_X31_hySEOeY5SJ8JaoLScRpWOH3AG8PIh4kyXVFe1vEtWlV-3KQ9AgT-CKGYNYBbHoTURyVrcScARBcvepgM7kUjiEqpfoJbzTCIUhK1V1lVMYoDsH8t0w8CtES11mK/s1024/3D_digital_artwork_of_a_m_552705508.png.jpg", apkUrl: "#" },
    { title: "Age Calculator Birthday DOB Calculator", url: "https://isrartoolzone.blogspot.com/p/age-calculator-birthday-dob-calculator.html", views: 13200, online: 7979, active: 5700, imgUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjW1VOO-cASN3dHSxJMH5qY7MY8ksmKkCaQt3CIx6wJlkpQf7Zx4KZiKxfXMi-NPabnqYRm4pzZWbAJVQuAzZC174lWzozRohqfsDoI0bxZTiVzxZkPQAIyct3bl4HvkPnl-CuCZmOb3F47Cc3Y7ALiDlmXPqgxiqZEzMkCCEqR3-i_W5fdvTZtT-7U-kib/s1024/3D_digital_illustration_o_465396204.png.jpg", apkUrl: "#" },
    { title: "Bijli Calculator Electricity Bill India", url: "https://isrartoolzone.blogspot.com/p/bijli-calculator-electricity-bill-india.html", views: 10500, online: 6440, active: 4600, imgUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj-2-PXvurQ-2_9Dr_tRorNmREZu9UwXuLLIctkvkkM93bb2goClY1c9FRDyw0ZkZG5n0yoL69PZp_fUSGZRSKMp2xi_tYKpyn6kTio2pryembFC5Hy5mf5r40NYEb0qqBcYacNvowlth3GkrLRX24TKozxazgh7oc_6ihagtfg6uEl-yXqHcwi_2PxAGGG/s1024/_3D_digital_artwork_of_an_100067981.png", apkUrl: "#" },
    { title: "Loan Calculator EMI Calculator Free", url: "https://isrartoolzone.blogspot.com/p/loan-calculator-emi-calculator-free.html", views: 15600, online: 9380, active: 6700, imgUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh5MY4xXWUJ73IJ62w1j7kGfdUOBF4rgL_1NPwPaqsfZhMLeUxg-4I5n9gMXv4MSm9wELsn61AOlJ6xlLq4D3kfNJjxpWSFPZoJD2KEjm_pq-qBf5fY3KtHCR0ALXVM6XmOcDt8hvziWriu_CBWi2cFJ1knp7TjHisQJ7ETJ8t_jwkZrvqE_qwxM5a0IAd2/s1024/_3D_digital_illustration__674769610.png", apkUrl: "#" },
    { title: "All Unit Converter Convert Online", url: "https://isrartoolzone.blogspot.com/p/all-unit-converter-convert-online-israr.html", views: 12900, online: 7699, active: 5500, imgUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg52gYZmDj7UU5PQ6RdRDbFG5St2lqjGVE7Wu5yE5E2pxS91pjbFJvSavCs62Hmrf9csec6wg8RaT6r0m2Mos6svq_Z9PKz0RbBqO4YNSYmTZp-CdHFDbXlWf1gaxZt5ttSB3K4tNib-uHDNa4HVB57JeLRpA1mH80lxAJUq7PFY9gOQyFaMUiRTXJdTIA/s1376/85478.jpg", apkUrl: "#" },
    { title: "Free Quiz Maker Create Online Quiz", url: "https://isrartoolzone.blogspot.com/p/free-quiz-maker-create-online-quiz.html", views: 11800, online: 7140, active: 5100, imgUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiKg0LGvsyynNtTwoDk4WhvUH5zD7MzfmVzUWi-mPswiayxTXZbXSEpbzPIv5XeJ_hjnI7WZE9XYAQ0XBLFMGIEu0z6Ysw-Ha8G8ld86AJ9OgGkkq_svW6Qx_2lE4AASoyogw0AxFPyfqySE85R8V8i5ZWHzA3bvjAlJj1guD2nwGv-fj7gyIz3pxSFLVuh/s1024/A_realistic_workspace_set_759290890.png.jpg", apkUrl: "#" },
    { title: "Internet Speed Test Real Speed Check", url: "https://isrartoolzone.blogspot.com/p/internet-speed-test-real-speed-check.html", views: 28400, online: 16660, active: 11900, imgUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg-OFuPGheUx_fMx6VSaVtIxfdzMZiY8gKlhpjEv1NHSf88vAIYYrTWIcQvAbj6OfwEU-hpZtgRkjnq3wTby3O6mlEUU5gMkv0PHL5_rDjJy9jxUjNDLAMQk2Lh-MGlvPV2Qbs9T3m9yxKPtKmB9J8Ac1EV6zYWeHF_7_amQ0adtlsbHxeAwY6cRHZO2HI/s1376/85471.jpg", apkUrl: "#" },
    { title: "WhatsApp Direct Message No Save Needed", url: "https://isrartoolzone.blogspot.com/p/whatsapp-direct-message-no-save-needed.html", views: 21300, online: 12740, active: 9100, imgUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEist7Zgf7M-Bf12FVVWXsS9H1_B76ibECoTWLC6QMkr3nRhcLTYoB4EE5ac6YprFLyN_dlwvobV7aJMPOc4S6_cF8L34-sVnKO7pnTrNnLaN3vC27XbDRxjnnjq3xTUBrSqci9VZN-kEwi4k_fMN_NarPhOyxVlvOkiLel_6fYXl4aiBXl1MtoguFT-BZS/s1024/A_realistic,_modern_works_572379611.png.jpg", apkUrl: "#" },
    { title: "Strong Password Generator Free Secure", url: "https://isrartoolzone.blogspot.com/p/strong-password-generator-free-secure.html", views: 14700, online: 8820, active: 6300, imgUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhnrreen0pq16tb4bc62futy9x1UC1HRbYQ9PThhOKF_gDnv4G5EQ8n31NOyN5lqh6IPGMpsY5MPQ12YqKQ6nWDo3yaeKKcflTCE7aDr8IM-1yzUr2L61QXaYfMqR6Qaokn5LQOmbkmVv8BhWAmxsSa4yJ51uPvkE65qhRvq-HPFEcu6w7SL52z-uf5Xxu6/s1024/A_high-resolution_modern__733840994.png.jpg", apkUrl: "#" },
    { title: "IFSC Code Finder All Banks Instantly", url: "https://isrartoolzone.blogspot.com/p/ifsc-code-finder-all-banks-instantly.html", views: 16900, online: 10220, active: 7300, imgUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjI-jBSdrAB6Tn2sIrOMTBGnHVw4OlETxJI1FXROgKiFL5nkYXV0GMBE2aWDYsP0MYvFjCGL4B0PHcdE-AwWoqoLMKsYYIYadWqEMj9tHxy47InwCwJTfl_-JCXvgsHoAueZAARdDcaWH2tNllYpjElASodvY8DV1EBumsPzLw7hW4XwyqE5Ocgmi1ft4sL/s1024/A_modern,_ultra-realistic_296282460.png.jpg", apkUrl: "#" },
    { title: "Stylish Button Generator Free Custom", url: "https://isrartoolzone.blogspot.com/p/stylish-button-generator-free-custom.html", views: 13800, online: 8260, active: 5900, imgUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh11vKg8nolORYkMgLrtiOMu3Fj_AQ7SdGV8BmM-6_9fkUvKdxXvNGxReKTomWiP08yO8Q0cD2NgAWeffWMMVOsgkYUGXwcejSO4slFNVi06Av2uHne6HtNUZrLHO9s4M9snG-HRKbp22cUcMZZPseEkYJvLO56U6mkW7XrG0kXdqegap3MCLI_svAeiVvD/s1024/A-beautiful-stylish-dark-263720649.jpg", apkUrl: "#" },
    { title: "CSS Button Generator Free Stylish Maker", url: "https://isrartoolzone.blogspot.com/p/css-button-generator-free-stylish-maker.html", views: 15200, online: 9100, active: 6500, imgUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh8CungducxWsZhba3tDXkQZyAKfCQV7dXOGdUfA_mWykzmiFgy_fEN6feQzD2VouWQH_fVApMy2NPo5gM6HdYi6RahNOjfvEW94FLG80b2pR1YH8wfq2ZvjEi0zF7rzNiBJTXDCavZVNCK4REMlVVvV6vUWtF8G4Wi0ZgTJXE0ITKuNx02k6Nx5BuRvuj5/s1024/A_modern_tech-themed_thum_975821435.png.jpg", apkUrl: "#" },
    { title: "Random Button Generator Modern CSS Tool", url: "https://isrartoolzone.blogspot.com/p/random-button-generator-modern-css-tool.html", views: 11900, online: 7279, active: 5200, imgUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhyq7HRTOiKpEoKAuuL6XlUu0Xsk-9awGQ1fk1_WEEdMEVQMXzwKg3u-p3HeVVUFwY2P70HQvVJISFSvrsvSNPVyHKUWV6PcYGLOI36KRpVQ3qDCbOdJVqfxyE_mxzyLNq3K4zUWv5Spi_ogQbhRgxlROBRzx3dQx2xYekmLQLFwSbOoxJMVDZGs-dtuvxJ/s1024/A_modern_computer_monitor_897506577.png", apkUrl: "#" },
    { title: "200 CSS Buttons Stylish Modern Button", url: "https://isrartoolzone.blogspot.com/p/200-css-buttons-stylish-modern-button.html", views: 19400, online: 11620, active: 8300, imgUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhvhAdwBK_beWICNDWnlLRn3UKLKCxyUrtFYCqNFiGSLVl-qKdF4fQu8CXrtqFATj3ubF3KzMbV0odE3hSf6UiHDpBBluMPxGbcbXS2rQgjThiVlUIAZEDKn7eQr4pGg1pP36YDpndsQVMeurHOyfuoeL39mf_h2jeHxIwvoj6VEP7GWfjUuRHvZiD-e6o9/s1024/A_modern_workspace_setup__996476333.png.jpg", apkUrl: "#" },
    { title: "Gradient Generator Custom Color", url: "https://isrartoolzone.blogspot.com/p/gradient-generator-custom-color.html", views: 12600, online: 7559, active: 5400, imgUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgrjyUU01S3FcQiXxWxwwANeGMoKs7O20_zmQdhqBExrF-6PZSSIT-IKwtY-aKOKAHfQtrlcloYAC5HVwfFvWy8iUGHHEhyznXAjopj4-rcc1MnYS2RCzsE3emkwGf-Owt4smzdEhrXoiC6PvZMomLdmd1npvL19NxdZdQNgbf8m4_-cgevi2y7vSBx6xS4/s1024/A_modern_digital_workspac_520016822.png.jpg", apkUrl: "#" },
    { title: "Text Shadow Create Advanced Stylish", url: "https://isrartoolzone.blogspot.com/p/text-shadow-create-advanced-stylish.html", views: 10800, online: 6580, active: 4700, imgUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiHd-Qs1RpkMlFreti2wD_MBcwqhLYBiXdy-EqWxsT_Dvrs5uFQxrpSowmju05CTJqMBvOtRkQEhcW0PTuXCF-74QJUHW39c_dcroVN8bwFL9PiH-ECjNGBg7KBKaI5iXd3zDq-A68MhdPQiQvQUVW3Qj3Y4kuE82KM6ebMs095oNdsi68zQlz0g7UpVdHN/s1024/A_realistic_and_modern_wo_871813681.png.jpg", apkUrl: "#" },
    { title: "Text Shadow Generator Stylish", url: "https://isrartoolzone.blogspot.com/p/text-shadow-generator-stylish.html", views: 11500, online: 7000, active: 5000, imgUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh17Lei4xnMgHRsZ2gBTdaCMKKmZx1H4ypDFgvmd_3oByPHUue9DsUxdml6CeZhFzrHsTEzBL_R5cUQ86ivEs-1_T2jSRZTfVMnOEhcThvohe7PJ1HXFHr_69S6rytgFdpnJf16VtPwFnBh-wLKrByTRIBf0iH3eLjb8-8wIPEkdfDXmfDJdFlku_etOPv0/s1024/A_beautiful_girl_sitting__723633607.png", apkUrl: "#" },
    { title: "Soft Shadow Generator Modern", url: "https://isrartoolzone.blogspot.com/p/soft-shadow-generator-modern.html", views: 9900, online: 6020, active: 4300, imgUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiZUaLsINHNhYW0uvbSVcX94eirlvp_q_F9L5J8WGRO5ESDHMpXSGEGeqOT3qshuU6INPmphyFlhtbIQnt0a-TPAtp6qZhXQUuT_mMTAsN76JMq1vpuL7et0iUME4NMxnWTfehEszV-tcg_qTh-o6yzUYghzqz563DAOnARtOF_vvSggr_Yd0_X_6IeUEKS/s1024/A_modern_creative_workspa_425799789.png.jpg", apkUrl: "#" },
    { title: "Box Shadow Generator Stylish CSS", url: "https://isrartoolzone.blogspot.com/p/box-shadow-generator-stylish-css.html", views: 16400, online: 9940, active: 7100, imgUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgBkzPxtcQX3P0epcAxv-Un__phzRnzqBKz_2Usg8LT0rMBVqZMAAuxd61YGt3IqGExFCUwIV02PDO1TYP869H8jhP_3pf_oefJJeV2e26p2Mr7Rb_A_XqaAzG0LiYSxpVoiS2Euigsj8oB3B8s_cicuK2D85e-VEnz7EoXa4jx2aPMIBQkMvDRtLCK6-E/s1024/A-realistic-19-year-old-g-299570621.jpg", apkUrl: "#" },
    { title: "Border Style Generator Stylish CSS", url: "https://isrartoolzone.blogspot.com/p/border-style-generator-stylish-css.html", views: 10400, online: 6300, active: 4500, imgUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgaIN1lwHJjma3tutHxqGpnkJ4kb1-_sKvyNPQ-YVhszDo_flMVsmX4tmqbenC-WG__0pZnLX95lwP96-sfcSu9WG26ByfdTTzExwlb7pORYpwzStRHonzV9pyfyi0SQphFr3jSreCrALmZn5k4b3yUSWonox789tqH5eA4YTKSarZtgzQgctxCZMscAFV4/s1024/A_vibrant,_slightly_isome_901030846.png.jpg", apkUrl: "#" },
    { title: "Dashed Border Generator Stylish CSS", url: "https://isrartoolzone.blogspot.com/p/dashed-border-generator-stylish-css.html", views: 9200, online: 5600, active: 4000, imgUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgFhB1kH61tVuzAInFLnNkf800mxcakNkZLRt04eiBelE2sdxZ5c_XDsFqrFQkoQ_4E2MSYkNp39xv6UTLX1plZ4YxMtTQaKBCr4LmWvJwNFAqjoMFIWIRR0PPzWAZlg1UyxmT4t2yYPkG5kb43C96jpHFNB6Sxg3rlFEUbq5l4tu5PtpzYEg5o1ZhIVqA/s1024/86626.jpg", apkUrl: "#" },
    { title: "CSS Transform Generator Visual Scale", url: "https://isrartoolzone.blogspot.com/p/css-transform-generator-visual-scale.html", views: 11100, online: 6720, active: 4800, imgUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgETlCYH96-APYh7nGtaKm4uAVS7-AfmF_hdtZSD76MFVHlVNUp1v7kjirplPrI3m6ZBEo3fjKSN6BqAr21HU3ea_urgoHX0aTLQ6DiIXUo2J3AIDWX6-tE3EWdTKQdu7VJp9miatQtSn8Bz2QCY7cJ_OLCTmCQxsym2HzHnCtgNs2e1T6mTFDNGHbgAnSA/s1024/A_realistic_19-year-old_g_927578681.png.jpg", apkUrl: "#" },
    { title: "YouTube Revenue Calculator Estimate", url: "https://isrartoolzone.blogspot.com/p/youtube-revenue-calculator-estimate.html", views: 23500, online: 14140, active: 10100, imgUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjWDpLiWbQ9mDD-VOBl9t5Hw7RTEuMaqonxUbnwvO7Un7qpCGbulZiDL12xjS9xj9kDPGdhCpljLpnmme_XAdhvnFqyU68y5qxFklSPARUDxNi9DFMkLjob9fJfteGD_6CBvdTgEpcFjjiwbIhN5iEz8R3WYh6ZtOC2wg5dzEC-JjPg-0Q0walSJh6Z10EA/s1024/3D_digital_artwork_of_a_c_390156647.png.jpg", apkUrl: "#" },
    { title: "YouTube Thumbnail Downloader Download", url: "https://isrartoolzone.blogspot.com/p/youtube-thumbnail-downloader-download.html", views: 26800, online: 15959, active: 11400, imgUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjWDpLiWbQ9mDD-VOBl9t5Hw7RTEuMaqonxUbnwvO7Un7qpCGbulZiDL12xjS9xj9kDPGdhCpljLpnmme_XAdhvnFqyU68y5qxFklSPARUDxNi9DFMkLjob9fJfteGD_6CBvdTgEpcFjjiwbIhN5iEz8R3WYh6ZtOC2wg5dzEC-JjPg-0Q0walSJh6Z10EA/s1024/3D_digital_artwork_of_a_c_390156647.png.jpg", apkUrl: "#" },
    { title: "YouTube Tags Extractor Get Tags Title", url: "https://isrartoolzone.blogspot.com/p/youtube-tags-extractor-get-tags-title.html", views: 17900, online: 10780, active: 7700, imgUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiRsmmlV4xs3inRcfr-y3xhK7jhALSUr2Aoy81ZdAxN2e5rVyiwMsfDazUeR3qAhQWebM2Vkn0Yed-9mHZi6dIZaoKX8HYE91GLoSiPLg6RjIV_dNI1h1O4PcfSPgDXhgIrfz1pCoLXoHNrjxlle9U0wxNi09x8vm2Cszj3NilMRViKq14DSm8jAyX6yyZm/s1024/Design-a-vibrant-eye-cat-409136621.jpg", apkUrl: "#" },
    { title: "YouTube Tag Extractor Extract Tags", url: "https://isrartoolzone.blogspot.com/p/youtube-tag-extractor-extract-tags-from.html", views: 15800, online: 9520, active: 6800, imgUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhOMnwXGDQeRdfMUMnaFX6DswALeA8TXEWeIb0xlPQo7kMn2Cx7ncmVABzXbo3YqRIohdCjVRQ7vboBmYNdDoMkIgHnBBMu-PJOAThCZMddLIRIbc2Zrw6BbSRWo2R8wOKUUw_QJ10nacZ68eag3XaBKWq2X4MTanMM0tF3nMEZGzKyWNXp5DKWu1OpP9ZP/s1024/A_premium,_realistic_work_586583276.png.jpg", apkUrl: "#" },
    { title: "Israr Tool Zone YouTube Suite Pro", url: "https://isrartoolzone.blogspot.com/p/israr-tool-zone-youtube-suite-pro-all.html", views: 29500, online: 17920, active: 12800, imgUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhoJN9KJnchdLBuTkswSnUKRLHiHxHgnF0u2NdAkWFXTjFKlgEcmDjSmTXTrmNN69VdW8A_TQ_qOm5Z3JU9IDmNfgYay8KYWskJLTJozFHPtEeVXPGeFruDcSGKAFoxUSh142CQhR_DViH9jNKijHi8k9Oo-F7l6jP1aAN39sfMewZj1V1lXl40PLAc1rjM/s1024/a-modern-and-vibrant-digital-workspace-showing-multiple-tools-like-youtube-description-generator-im-1.jpg", apkUrl: "#" },
    { title: "Image Crop Tool Online Circle Crop", url: "https://isrartoolzone.blogspot.com/p/image-crop-tool-online-circle-crop.html", views: 14100, online: 8540, active: 6100, imgUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhN-a2DyOWA_E-Vquj62RIUuO-mCgJwV3k08rJl0BYT67gTBrR6sb0wY3q0q-jRZAyOjyc1TZu2gCbBFjZ2jkxme6BDLkx3Y7IGZa4B5t4zPzYNMNw5RFhfgFkIuesqbiK6nCTjCZ9ihXh5_Ri5OeKhYJd_k_yUVwBn-JQDXLdsL3plePwFPdofwDSPmN15/s1024/A_modern_digital_workspac_634396879.png.jpg", apkUrl: "#" },
    { title: "Compress Image Online Reduce Photo Size", url: "https://isrartoolzone.blogspot.com/p/compress-image-online-reduce-photo-size.html", views: 21900, online: 13020, active: 9300, imgUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjXvu7BgPz-r-c3DURYsr4g-xocl0QmfW30MBuYNHIi-fCFvyAtY27fYi61M27E_bYYn8z-0iHNylJ7yr4TMvi0A2ld_v5REjC0cz-94fUL_jcV6BWUZH-we1qtRKYhyphenhyphenuUvF4pXWO3XCGs_8F-Qq9p1eKqu4MDHpZYqgYvtbKzY355rmKQMPFmIJB_eJD_U/s1024/3D_digital_art_showing_a__466267296.png.jpg", apkUrl: "#" },
    { title: "Free Keyword Generator Tool", url: "https://isrartoolzone.blogspot.com/p/free-keyword-generator-tool-100-working.html", views: 13300, online: 8119, active: 5800, imgUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg6YuNE99KFDev80Kpc4JWAZVrcu2oYQ7SqcPnV9wYtwuGXvrPovXzZsWw206dpHxgJTSts5HOZVezmrs-4JA0l6sDE1gaXT11fWUOly1IPrItpFfqAw8mcRKLVo-f_AqNLuZ5ZnpzA6XxCPbt_44M4uWtE3U1jovqS7hUgUk91gMwRoonTLKyJsQXUjymv/s1024/A_realistic_workspace_fea_109311379.png.jpg", apkUrl: "#" },
    { title: "Free Keyword Finder Tool Unlimited SEO", url: "https://isrartoolzone.blogspot.com/p/free-keyword-finder-tool-unlimited-seo.html", views: 12500, online: 7559, active: 5400, imgUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiOcESecPB0A0xfXMaj0A85OWQ8Qfe0yCsJKHyWXbuoK2FwRqmk9i3YpTMxyjwhZKwbKezCroQbugz5bslKkno9G_gRcEhA0Bw99phPXvB3x_xmojAOB9g2ATcG40wI0H_kaSfYD7uWJx19MTsVNxEOhso-ueE81k_o1tK28CG8b8dHBe3LiEut2IZ3iO0O/s1024/3D_digital_illustration_o_786134816.png.jpg", apkUrl: "#" },
    { title: "Free HTML Code Converter Parse HTML", url: "https://isrartoolzone.blogspot.com/p/free-html-code-converter-parse-html.html", views: 10600, online: 6440, active: 4600, imgUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj4rqg-09AHicyxZEC0KwWvMG9rZzCFw4tJx1XB7cTQre59sjHs7Z7Mps7m_8UYVWNe2GSQzV2kjV0OE136cl9OWQLiyNOn5-YvOR-xTymiQoX1Xyrs-WECTvKU6xMyyIbGVIKg35IbKdSa0i1TUohEzF6igfopjCruX27KPfzH3NG3v1vKnpHd8i1TV1jb/s1024/A_realistic_digital_works_328734446.png.jpg", apkUrl: "#" },
    { title: "Free AdSense Calculator Calculate", url: "https://isrartoolzone.blogspot.com/p/free-adsense-calculator-calculate.html", views: 18100, online: 10920, active: 7800, imgUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiNxHjhaA2KJhepbFfTPOCaQizuc_uWXmzhB4Ncp_e2POJLc1HJZEBmcJjla0Da8PxadmKuVVfwFCZ42ezM0qotLZZjK6JIaFaHJTVbXDQsXO5FHsPtzE78jrPJIacWukn8SR1e4Fc-_QJNHCQu1xvdGtRRFpZoJcR1VCqjR8WzbRgpO30_iFWGhESkkYrC/s1024/3D_digital_artwork_of_a_m_639514542.png.jpg", apkUrl: "#" },
    { title: "Free AdSense Approval Checker", url: "https://isrartoolzone.blogspot.com/p/free-adsense-approval-checker-check.html", views: 14900, online: 8960, active: 6400, imgUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEihKsYErSqjZwWP5cCsPlCxVHTDsJeeUCkyEk_u8Be0TgFptUhYKPH6ZLjCGfsPfMXo2F3CSAavfKba4oQcYI1kOm941lPy0W9alZkqhkkuyvT2mpYhnRFNPymxHjUlT7r6rP3ix2Dh7FxWiMFPmThTNLSq7K5Pgt8mXXZJohaD3S5PlcWmAEgeKolb040V/s1024/A_large_ultra-HD_monitor__107871603.png.jpg", apkUrl: "#" },
    { title: "Free Favicon Generator Create Favicon", url: "https://isrartoolzone.blogspot.com/p/free-favicon-generator-create-favicon.html", views: 11200, online: 6860, active: 4900, imgUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjr2r0Lk7DcCgMnA-KUrUNGZBDsA4N-EYzcQ3myBfvdPcEn-5287TqCB684Zf6OjESvqPvZIvEKVNLN3tkntJkuSqOVUyuv4G60-6ZATG1ZnPbUXnYRNzl6O7t8J7k_PXd_u7a1XnIbB-MAWbdMD8T8asEM2ef7M6ndOpmendQIqINN_JXG6AN3Xs1e8AFp/s1704/A_modern_3D_office_room_with_g_454643402.png.jpg", apkUrl: "#" },
    { title: "Free Robots.txt Generator Custom", url: "https://isrartoolzone.blogspot.com/p/free-robotstxt-generator-custom.html", views: 10100, online: 6160, active: 4400, imgUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjbbzTgRwcSbVuTrpr0E8fLZPMhHuAicc_Jn5Dw_t0mKVxpE8-UgSOh5tqfg7OBR8YkqcJsmqMinw4znYe2xbocHTqIIqRzs_0u1eMJXaYE2gJ_m-a90l9kA4k9maZOrqi0KhxkH2E-UXw13R3_1NR_3_dv4r7-yHV7TZOmSIZeAECF2j90LywqbyiuMI57/s1024/3D_digital_artwork_of_an__996230162.png.jpg", apkUrl: "#" },
    { title: "Free Meta Description Generator SEO", url: "https://isrartoolzone.blogspot.com/p/free-meta-description-generator-seo.html", views: 13600, online: 8260, active: 5900, imgUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgaEauCnZqQDvOWXsBTlfz1BloPQlaVhgae59TJmXZHTlZoex9B22CsrsDkYgd7PhyphenhyphenYfl6oq9FjW1CKpU48KjqNZ_GJ_ZsQTcLBa448aG4CRI0oOmVSY3XxtAkmVGgBu9h0RMKPYYn91zwtSqGjxXNI051H7umVye2eLvMmswDk3N0hm8mhy9xuHNvJfHPy/s1024/3D_digital_artwork_of_a_s_474133995.png.jpg", apkUrl: "#" },
    { title: "Free About Us Page Generator", url: "https://isrartoolzone.blogspot.com/p/free-about-us-page-generator-for.html", views: 15700, online: 9520, active: 6800, imgUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiNkQ10P0xR8h2j4y_o2zNiatsIgliVdfA9eIOa_N2z4rEVLhbT9FT3_2grilRRQnx-LlJTF-jaUr5NNAsjM5amhVskbFZfIDI6Szb7dxEBlPmK6iZVs_zZ416cvSxmsDTLuqYnR5MVO-UZr3cKrn7AJFjZANpm3HV47i0HObaHj2G6hvKbXjPTpG68MvHg/s1024/_3D_digital_illustration__965042156.png.jpg", apkUrl: "#" },
    { title: "Free Contact Form Generator", url: "https://isrartoolzone.blogspot.com/p/free-contact-form-generator-for-blogger.html", views: 11800, online: 7140, active: 5100, imgUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiamUHVbY39aoOxSE-Lh5J3_KdUObEoDO3t3mT3jt_qWkbAsDhPWl532g1wm76ABAR8SELTD9KJtD27ykZYMpwzLYFnAR2YcedMrUOcy-KHB65WOImI3Ypq4TDNikUA1CUspK1cU4_tSM1LRGMQdU4JI7f8mvZ3CbCmsjz98rJ0PcbOLbbg0z8rjqBZe5qL/s1704/A_modern_office_interior_scene_349539268.png.jpg", apkUrl: "#" },
    { title: "Free Cookie Banner Generator GDPR", url: "https://isrartoolzone.blogspot.com/p/free-cookie-banner-generator-gdpr.html", views: 9600, online: 5880, active: 4200, imgUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg2M16n1tMqpt_dutRY4TU6MgTUF4WLcRZ61vQCgPh853VBRFd0dEbVBjXUKDOnYCNWxa_0RZ96EfH8rA4aR663ZVUsn-XtYCre2pr0UiCPMnmkeVUv7m6X5ejs4Yyaoc-q_Gy59vKwfS4TQfhC2BUzFaxg2YYUzrglAIAMFBJvzsiQc60JhkKPH6w7c1YT/s1704/A_modern_office_interior_scene_3988369.png.jpg", apkUrl: "#" },
    { title: "Cookies Policy Generator Free GDPR", url: "https://isrartoolzone.blogspot.com/p/cookies-policy-generator-free-gdpr.html", views: 8900, online: 5460, active: 3900, imgUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgW8V7KY31VWMGhYm8Cwkvar5iFGKOVn2qHZWds7jbh91rMAlrHBfFOBV1OmvQ55MpKKnh1yrweEVbwHF5Q9Jz06vJ0Rgp9KwLzTtIJ4irqEzpn1i-Do9Qo1tZxs7L6L8wLnsKVZ_b6LWe6HdFcDRctB2hTQbpLkruSuRyWtaEbM-nAq__RKsekmW8nnMi3/s1704/A_modern_office_interior_scene_870095492.png.jpg", apkUrl: "#" },
    { title: "Free Disclaimer Generator", url: "https://isrartoolzone.blogspot.com/p/free-disclaimer-generator-for-website.html", views: 12400, online: 7419, active: 5300, imgUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEibtOeDV8CmSr_gET5g1z1cJymjILzET_m2j69LA7ZVofN7wN0e6GifvRLaZe_wJeEzJ8QM3iohjN1YHqGmdUWBXV8I76nVF5EWRjsv-LbgYgazGt74oghff3CQoOf-TPsaffFjqMNfHjUpgauGhStRSFqXJawgB1p2GPcMaWVbLixGvWqwivpsMHk8eLqz/s1024/_3D_digital_illustration__910356462.png.jpg", apkUrl: "#" },
    { title: "Free Terms and Conditions Generator", url: "https://isrartoolzone.blogspot.com/p/free-terms-and-conditions-generator-for.html", views: 13100, online: 7839, active: 5600, imgUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgOe7R0H26pDgxcnlcg0xcnGoTXW_u7RuGmle0ik22wu38O1_7AaTflKvpXa2cUT1_bB_FJiVNTB4oVNDjzg4XdeMA8g0ClU85l43jc21YycX269sohezTeGtX2FvcBvFAcIKxzst8ZwwRIfBlvtOWhD2_KGbgA_5SKae_Kitgwt2vyjxXJfJjRs6Ei7yTs/s1024/3D_digital_illustration_o_84667914.png.jpg", apkUrl: "#" },
    { title: "Free Privacy Policy Generator", url: "https://isrartoolzone.blogspot.com/p/free-privacy-policy-generator-for.html", views: 16800, online: 10080, active: 7200, imgUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi_TQGmxZYxWHwqp-eE1Q0kHOmysMvZYEXTKQcwMaM3GmiO7sU_UVVItRp-0xWGzppVWdv6-lySiqOp5wq5T-3WjWll-dHj3FR_nX65hspPCJNKvrHv-f76_u97Th5u7m_iIwSAay8bKKOzAiFbWkLvYP426fZ2-snGvv58YW-9cyo3LopZ83bY8N678dE/s1024/_3D_digital_illustration__223292339.png.jpg", apkUrl: "#" },
    { title: "Israr Lab Multi HTML Viewer", url: "https://israrlabmultihtmlviewer.blogspot.com/", views: 14250, online: 8420, active: 4120, imgUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhWybvYuTI1bQ3d_dBtkzkPl6XVh6smiO_p21Lg_51eTrXA38-Ld8vduLC8fV1Qe9GSZFawtN3bBkSNXNbdJOjyT2BKVogeW5VGSaW-IhX_c_IW12Xckk7lsnEawOuH_-G5mOed27teHute56BAItGmUum7UOifRilJzjD8eC-z7rqO1tJDCmgNLl9JKIY/s1672/103334.jpg", apkUrl: "#" },
    { title: "Israr Lab About Generator", url: "https://israrlababoutgenerator.blogspot.com/", views: 8930, online: 6100, active: 3050, imgUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgnJQjsxvpP9A0c491A1np6erL7PPazXAUifaTB-fQxNrUFaU5q8ZnhwnDQIqOvEUB8dV4lHBMRE8X8sXsC4NAsdvPCwTTJJvox6-I-c4tlodHmHRpBi6fZ0Uge00zxrdadxo7kgDJtoYLgjRnUwDHIgmzksFJLzVJx3uoI4sjgpBLtNtqfLbwOXrTqUUs/s1672/103337.jpg", apkUrl: "#" },
    { title: "Israr Lab AI Image Generator", url: "https://israrlab-ai-image-generator.blogspot.com/", views: 45200, online: 9200, active: 5410, imgUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgJhj_BprKg2cnBcfPd1_kyG8UDv2nY03GrNXT0ydY3EiPZN-6ASTaE8Fi7IR8ER-kqu5tMsT7Hel3O1hOHzYzhPsBDlx2ExyclbpKPA5FBLcFRJHMACa4soho461Jk_i71MrGFBSK3mGRN1R4bjT2du8znOH_VJPzx3iPzpspxTeO7Iw692ptMsiDeCw8/s1672/103887.jpg", apkUrl: "#" },
    { title: "Israr Lab Power AI", url: "https://israr-labpower-ai.blogspot.com/", views: 23100, online: 7300, active: 3890, imgUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjNCmmo8MgUci9wuiUCQRBoYTRoFb3hC_gDspw7LPEqunPou2LkHNfYh1SF11u8ogfghn0kCGprp4Yxy0Jk6yRCf2bUW-gpmO1Qt8N0KSx_UR5dPEjumfxaY9sd8gn_gKVGd0eMP9Fyqutau8kFzACPCmeDQRjQfUbv8fiDN5oNX1MYE8mELaznKUwMfHI/s1672/103896.jpg", apkUrl: "#" },
    { title: "Israr Lab Art Generator", url: "https://israrlab-art-generator.blogspot.com/", views: 18740, online: 6800, active: 3120, imgUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiaenhVeqcs6O6fu7L_Y5uTM0CGu7-8p6xvjcvujkQnA8dnLTooFWSgTOkDpHjmsCHNdbGOvp27oDOVEyQeVAk7L9t9OawrbmwtLqNaGbRpuayx5-WKYBopAPkM5cy3D19PD5yC486RBDSnc0tL0VoKmD8w8gVZOY7cfVVSRrt6hqP5_UlISMN6lp4jp5U/s1672/103904.jpg", apkUrl: "#" },
    { title: "Israr Lab Code View", url: "https://israrlabcodeview.blogspot.com/", views: 9410, online: 5400, active: 2700, imgUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhvX8mbzaENkbBeBh3khITEvGiRA6inpiMQkVICgd9bp1wzeRK3ZEAFJ67n9MH73qxEKuHpVBJKx3mX1mFeQPQsp8El16HqEIENJqIoAkdA7RCoyJQ2A8LZLhBubhglwob2LBxXF6WFIaweDJQx4PIQ3FFf9kP-pBBbuC2VgSXmMkU8Me4NLf79z4csp80O/s1671/103910.jpg", apkUrl: "#" },
    { title: "Israr Lab Easy Notes", url: "https://israrlab-easy-notes.blogspot.com/", views: 12450, online: 6200, active: 2950, imgUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgLgCThLzmIH1Ar8aY-ihvtRndozI8RsUetxSR_eVCuGa83gAP7V9VqNwej5eyxRYiZAUqdXEZqS7IPZCGa4sirPkt77oXrCVXlkGOwS1tN3etw_QtHux2X7IoAJw8cAobiMXlOBZv1HNzwmKlrDxVcGK2pnzee2WEypBIwcFJbgblaKnWv1Bux1yLiq9I/s1672/103915.jpg", apkUrl: "#" },
    { title: "Israr Lab Favicon Generator", url: "https://israrlab-favicon-generator.blogspot.com/", views: 16780, online: 7100, active: 3600, imgUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj0Jh71I3_aviP2gkFW-Bdk9catMwYQJMbIolXPblysiOJVpwXbow65D8prrP84FaP-agsjLu8vEUifCp3wgY9Yn8fHe1EwQArLewkCbFGBWM0HsyV1jtU2YhISdEiNRLtB0W7VVRMwjehc8oQA2SViDkQ4YIRALPbqp-acbQI4dpJOUFSqQhX3wvbLJsk/s1672/103919.jpg", apkUrl: "#" },
    { title: "Israr Lab Email Generator Pro", url: "https://israrlabemailgeneratorpro.blogspot.com/", views: 25400, online: 8100, active: 4200, imgUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgG-SmwvFx8zNc7pWXZ1o-iNcVKxqrp3T5LFcUuI76hyphenhyphenhoV8lGQAT4HH-S4wiydENgRNW2A5Ze5iPEqL9Zv2gMY2-Qcgg_F5Sn2IFzbkEaEKCGY6GcXwoSZYM_RLnusAVZBjc-_gNsZextGuCk2QvnE6_uHBuoHsm9sGD6rVVEXXp9xqDghDegiEw2mzK0/s1672/103923.jpg", apkUrl: "#" },
    { title: "Israr Lab HTML Preview", url: "https://israrlabhtmlpreview.blogspot.com/", views: 34100, online: 8900, active: 4800, imgUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjaMqCSpu1C8-XcPSLHQdVJVGYiFjp4t9K1tR9SC60hCYDEXwwOgVnZ_FxO-ntgBGxoYHORUF-RTpttx8XgG8O3UPePD_-7phpzm357YIwEqGse26j0Pm-e0Q0W_-TPu8u0X1kgiM1jdfqABkR3xc4M1ZDWJiX4zdnnZDq2mRyXmVyOxdzg_GGXR5lAfJg/s1672/103964.jpg", apkUrl: "#" },
    { title: "Israr Lab Image Compressor Pro", url: "https://israrlabimagecompresspro.blogspot.com/", views: 52300, online: 9800, active: 5900, imgUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjknlEwOcBb08Kl3SCXyGRe11peKCkZ5DdIZKmS6vvFGBdqBqsaMvIAYSoOV9V4E3I2c3c3xqNHwyr4oBwqMYLkENhPpg9MbjDka6yFlL3YM-OlFag8ejdcX0kZUfpalwq2OmQasft7tEsdE-mmZDW5nqKSOmva2bWN6XF0TIlzHiGloy3I-BExsPQU9cBg/s1672/103968.jpg", apkUrl: "#" },
    { title: "Israr Lab Link Shortener", url: "https://israrlab-link-shortener.blogspot.com/", views: 19820, online: 6900, active: 3400, imgUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiKauBQHj_xuAaLwf7f5j9AS_Gmc0g-LgmHTPR6QiV-TyZaDJ6zpTmo9PthJ_O6TPJ8tp3l3bi1TCepL09r1YQHXgHMQUfGceiR4Zo7OwLaSCGxIYc8ttgYefky6v1fg9_OV7ssT-zccScCxuMLiCm5MUsSg4sP3SU7_dbS_M_uYp49-a0XLso0CFg6DIt9/s1672/103975.jpg", apkUrl: "#" },
    { title: "Israr Lab Meta Generator", url: "https://israrlabmetagenerator.blogspot.com/", views: 27600, online: 7500, active: 3900, imgUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjJgHwHUmUYkMpoFYnnn35zAv-SToB3mLJgWxa8mB-OXEcFzwPqP3SWaYyjTILXng4ebHlTPtTu1MBcMR_wUj46mIFySCLZQ_JVv9TUa-vpDsrdZgd_wiPViy_QLxLZnhauSbao6eJsULjPGB4C1LVrnS2SzJq7WDoxhByVjbyRNIKYu_lt4lmE7uvdQBA/s1672/103980.jpg", apkUrl: "#" },
    { title: "Israr Lab Paste Link", url: "https://israrlab-paste-link.blogspot.com/", views: 8430, online: 5100, active: 2400, imgUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiSWB59yfm3N_7yVtyV0zgoSiBq9Uw66RD25ZZeaAKy_kRqE5Euay59-V9mn-Gm2Mxnkcm42fzVg6-lXuprtNSvPIh54B46rT6SkaV6VQAp9__czrvgFdpRoAzZoGYEuA07G3klnzv1n1435eF3b3xda8ubUzBn9P3Q4u1De5Pr7dP6CzfDjIEC2KNgsoI/s1672/103988.jpg", apkUrl: "#" },
    { title: "Israr Lab Robots.txt Generator", url: "https://israrlabrobotstxtgenerator.blogspot.com/", views: 11250, online: 5900, active: 2800, imgUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhtID47PR_EEbKsvC-6p2-yKPkVWWcTyz-0SJIgcsYMBLNi0i1DnG99E_yytlrgLrP-jO2mv55zREXj6ZuvpBds-LjFQ4KC2jTbMKsAx41dqSCzg3Y0RVdTuZKotEHukszEag1vRjA1MDEyqQxJEE20u8jSjo4_Igll1dK-zhtAF7PujZuBRrRvnljiaZc/s1672/103993.jpg", apkUrl: "#" },
    { title: "Israr Lab SEO Keyword Finder", url: "https://israrlabseokeywordfinder.blogspot.com/", views: 61200, online: 9950, active: 6200, imgUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgXTYw1iZhHrb91sPrwofCtiUvsFxWmzBbu3g9QNWWYtXEjOC2xfGFpN7k7UdlBG-61O1E-qBuihR7pTpPOXG0KwKAp5QCXYRlLhNhAMtux5dWHQ2eDsOwn9rzemRx-BaYDVZXaa3pXZgKh7D6FN9aFhhtKSAq_O8Ao7kT30fR7_nmf1G0vPBZKla3gzPI/s1672/104003.jpg", apkUrl: "#" },
    { title: "Israr Lab Verification Gateway", url: "https://israrlab-verification-gateway.blogspot.com/", views: 7650, online: 4800, active: 2100, imgUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjyuOauixor62oMxqLTskUNLfQstojWIIZvsODt3kmllH99JBfCBWUTCrSMpxgxnXpDA7B3j6Rn88pEg7IWhORxy5PFVePP4S0x89NuyEu1yRr2NE4InHMNt4jVjthaWAVZ7h5k_OQKfSEV92C9qoqDauUV-s_ekpu6orEQTdc_kQHZVAHMdBcOLEd6BxZS/s1672/86009.jp", apkUrl: "#" },
    { title: "Israr Lab YouTube Extractor", url: "https://israrlabyoutubeextractor.blogspot.com/", views: 38920, online: 8600, active: 4500, imgUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgxba8LOA5PvkYydIspmATsvslCyet4pS8wgjScbpP1FCD0HJU28Si9y2hArL591wIpu8lIWuT_gTkzU4PtfPtzVa9wAWkXAcwqJzbzQUe5mE08HoQpy2OuZNX5HEq6diEFFsG0Ybajb2UI49Zh0nGvByNx3VwnPkF-kIaE_CipG31bdwFumqRmn-jmANU/s1672/104009.jpg", apkUrl: "#" }
  ];

  /* DEMO COUNTERS: New User and Active User fluctuate; Today Views stay fixed. */
  originalItems.forEach(function(item) {
    var seedText = String(item.url || item.title || "card");
    var seed = seedText.split("").reduce(function(sum, ch) { return (sum * 31 + ch.charCodeAt(0)) >>> 0; }, 7);
    if (typeof item.newUsers !== "number") item.newUsers = 15000 + (seed % 24000);
    if (typeof item.active !== "number") item.active = 2500 + (seed % 8500);
    if (typeof item.todayViews !== "number") item.todayViews = 15000 + (seed % 65000);
  });
  setInterval(function() {
    originalItems.forEach(function(item) {
      // New User count can rise or fall a little each tick.
      item.newUsers = Math.max(0, item.newUsers + (Math.floor(Math.random() * 15) - 7));
      // Active User count can also rise or fall, within a reasonable demo range.
      item.active = Math.max(0, Math.min(15000, item.active + (Math.floor(Math.random() * 21) - 10)));
      // Intentionally do not modify item.todayViews: it must remain stable.
    });
    document.querySelectorAll('.bst-item-container').forEach(function(card) {
      var newValEl = card.querySelector('.new-user-val');
      var activeValEl = card.querySelector('.active-val');
      // Today Views is intentionally excluded so its value never increases or decreases.
      if (newValEl) {
        var curNew = parseInt(newValEl.textContent.replace(/,/g, ''), 10);
        if (!isNaN(curNew)) newValEl.textContent = Math.max(0, curNew + (Math.floor(Math.random() * 15) - 7)).toLocaleString();
      }
      if (activeValEl) {
        var curActive = parseInt(activeValEl.textContent.replace(/,/g, ''), 10);
        if (!isNaN(curActive)) activeValEl.textContent = Math.max(0, Math.min(15000, curActive + (Math.floor(Math.random() * 21) - 10))).toLocaleString();
      }
    });
  }, 1000);

  /* ELEMENTS */
  var grid = document.getElementById("bst-grid");
  var savedGrid = document.getElementById("saved-grid");
  var historyListEl = document.getElementById("history-list");
  var searchInput = document.getElementById("bst-search");
  var resultsInfo = document.getElementById("bst-results-info");
  var pagination = document.getElementById("bst-pagination-buttons");
  var pageInfo = document.getElementById("bst-page-info");
  var recentBtn = document.getElementById("bst-recent-btn");
  var topBtn = document.getElementById("bst-top-btn");
  var rankingBtn = document.getElementById("bst-ranking-btn");
  var activityBtn = document.getElementById("bst-activity-btn");
  var activityToolbar = document.getElementById("bst-activity-toolbar");
  var activityCountEl = document.getElementById("bst-activity-count");
  var isActivityMarkMode = false;
  var inlineLoader = document.getElementById("bst-inline-loader");
  var mainFooter = document.getElementById("main-footer");
  var searchHistoryPopup = document.getElementById("bst-search-history-popup");
  var searchSubmitBtn = document.getElementById("bst-search-submit");

  function saveCurrentSearch() {
    var word = (searchInput.value || "").trim().replace(/\s+/g, " ");
    if (!word) return;
    searchHistory = searchHistory.filter(function(savedWord){ return savedWord.toLowerCase() !== word.toLowerCase(); });
    searchHistory.unshift(word);
    searchHistory = searchHistory.slice(0, 200);
    try { localStorage.setItem("bst_search_history_v1", JSON.stringify(searchHistory)); } catch (e) {}
    renderSearchHistory();
  }

  function renderSearchHistory() {
    if (!searchHistoryPopup) return;
    searchHistoryPopup.innerHTML = '<div class="bst-search-history-heading">Recent Searches · ' + searchHistory.length + '/200</div>';
    if (!searchHistory.length) {
      var emptySearch = document.createElement("div");
      emptySearch.className = "bst-search-history-empty";
      emptySearch.textContent = "Abhi koi search save nahi hui hai.";
      searchHistoryPopup.appendChild(emptySearch);
      return;
    }
    searchHistory.forEach(function(word) {
      var row = document.createElement("button");
      row.type = "button";
      row.className = "bst-search-history-item";
      row.setAttribute("role", "option");
      row.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12a9 9 0 1 0 2.64-6.36L3 8"></path><path d="M3 3v5h5"></path><path d="M12 7v5l3 2"></path></svg>';
      var label = document.createElement("span");
      label.textContent = word;
      row.appendChild(label);
      row.addEventListener("click", function() {
        searchInput.value = word;
        searchQuery = word;
        currentPage = 1;
        updateURLState("home");
        renderPage();
        closeSearchHistory();
      });
      searchHistoryPopup.appendChild(row);
    });
  }

  function openSearchHistory() {
    if (!searchHistoryPopup) return;
    renderSearchHistory();
    searchHistoryPopup.classList.add("open");
    searchInput.setAttribute("aria-expanded", "true");
  }

  function closeSearchHistory() {
    if (!searchHistoryPopup) return;
    searchHistoryPopup.classList.remove("open");
    searchInput.setAttribute("aria-expanded", "false");
  }

  var viewHome = document.getElementById("view-home");
  var viewSaved = document.getElementById("view-saved");
  var viewHistory = document.getElementById("view-history");
  var viewPrivate = document.getElementById("view-private");
  var viewLock = document.getElementById("view-lock");
  var viewCategory = document.getElementById("view-category");
  var viewApkStore = document.getElementById("view-apk-store");
  var viewVisit = document.getElementById("view-visit");
  var currentApkItem = null;
  var currentVisitItem = null;

  var itemsPerPage = 8;
  var currentPage = initialPage;
  var currentSort = "recent";
  var searchQuery = initialSearch;

  if (searchQuery) searchInput.value = searchQuery;

  function updateBadges() {
    var sb = document.getElementById("saved-badge");
    var hb = document.getElementById("history-badge");
    var ms = document.getElementById("menu-saved-count");
    var mh = document.getElementById("menu-history-count");
    if(sb) sb.textContent = savedTools.length;
    if(hb) hb.textContent = historyList.length;
    if(ms) ms.textContent = savedTools.length;
    if(mh) mh.textContent = historyList.length;
  }

  function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, function (character) {
      var entities = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
      return entities[character];
    });
  }

  function highlightText(text, query) {
    if (!query) return escapeHTML(text);
    var escapedText = escapeHTML(text);
    var escapedQuery = escapeHTML(query);
    var regex = new RegExp("(" + escapedQuery.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&") + ")", "gi");
    return escapedText.replace(regex, '<span class="bst-highlight">$1</span>');
  }

  function getWebsiteScreenshot(url) {
    return "https://s.wordpress.com/mshots/v1/" + encodeURIComponent(url) + "?w=600";
  }

  function getFilteredItems() {
    var query = searchQuery.toLowerCase();

    /* ACTIVITY: show tools user clicked / searched (from historyList) */
    if (currentSort === "activity") {
      var activityItems = [];
      historyList.forEach(function(h) {
        var found = originalItems.find(function(it) { return it.url === h.url; });
        if (found) {
          var copy = Object.assign({}, found);
          copy._activityTime = h.time;
          copy._activityViews = h.viewsCount || 1;
          activityItems.push(copy);
        } else if (h.title && h.url) {
          activityItems.push({
            title: h.title,
            url: h.url,
            views: h.viewsCount || 1,
            active: 0,
            online: 0,
            imgUrl: "",
            apkUrl: "#",
            _activityTime: h.time,
            _activityViews: h.viewsCount || 1
          });
        }
      });
      if (query) {
        activityItems = activityItems.filter(function(item) {
          return (item.title || "").toLowerCase().indexOf(query) !== -1 ||
                 (item.url || "").toLowerCase().indexOf(query) !== -1;
        });
      }
      return activityItems;
    }

    var filtered = originalItems.filter(function (item) {
      return item.title.toLowerCase().indexOf(query) !== -1 || item.url.toLowerCase().indexOf(query) !== -1;
    });

    if (currentSort === "top") {
      filtered.sort(function(a, b) { return (Number(b.views) || 0) - (Number(a.views) || 0); });
    } else if (currentSort === "ranking") {
      /* Ranking = best quality tools (active users + views weighted) */
      filtered.sort(function(a, b) {
        var scoreA = (Number(a.active) || 0) * 3 + (Number(a.views) || 0) * 0.01 + (Number(a.online) || 0) * 0.5;
        var scoreB = (Number(b.active) || 0) * 3 + (Number(b.views) || 0) * 0.01 + (Number(b.online) || 0) * 0.5;
        return scoreB - scoreA;
      });
    }
    /* recent = original order (newest tools first as defined in array) */
    return filtered;
  }

  function handleToolClick(item) {
    var now = new Date();
    var dateStr = now.toLocaleDateString() + " " + now.toLocaleTimeString();
    
    var existingIndex = historyList.findIndex(function(h) { return h.url === item.url; });
    var currentViews = 1;
    if (existingIndex !== -1) {
      currentViews = (historyList[existingIndex].viewsCount || 1) + 1;
      historyList.splice(existingIndex, 1);
    } else {
      currentViews = 1;
    }

    historyList.unshift({
      title: item.title,
      url: item.url,
      time: dateStr,
      viewsCount: currentViews
    });

    if (historyList.length > 200) historyList.pop();

    localStorage.setItem("bst_history_list", JSON.stringify(historyList));
    updateBadges();
  }

  function logPrivateActivity(action, item, details) {
    var entry = {
      id: Date.now() + "-" + Math.random().toString(36).slice(2, 8),
      date: new Date().toISOString(),
      action: action,
      title: (item && item.title) ? item.title : "Untitled card",
      url: (item && item.url) ? item.url : "",
      details: details || ""
    };
    privateActivity.unshift(entry);
    privateActivity = privateActivity.slice(0, 500);
    localStorage.setItem("bst_private_activity", JSON.stringify(privateActivity));
  }

  function renderPrivateActivity() {
    var panel = document.getElementById("private-activity-panel");
    if (!panel) return;
    panel.innerHTML = '<h4 style="color:var(--orange-light);margin:0 0 10px;">Private Card Activity</h4>' +
      '<div class="private-activity-list" style="display:flex;flex-direction:column;gap:6px;"></div>' +
      '<button type="button" id="private-activity-clear" class="bst-sub-btn danger" style="margin-top:10px;">Clear Activity</button>';
    var list = panel.querySelector(".private-activity-list");
    if (!privateActivity.length) {
      list.innerHTML = '<div class="bst-empty">No activity recorded yet.</div>';
    } else {
      privateActivity.forEach(function(entry) {
        var row = document.createElement("div");
        row.style.cssText = "padding:8px 10px;border:1px solid var(--border-color,rgba(255,255,255,.14));border-radius:9px;font-size:12px;line-height:1.45;overflow-wrap:anywhere;";
        var dateText = entry.date ? new Date(entry.date).toLocaleString() : "Date unavailable";
        row.innerHTML = '<div style="font-weight:700;color:var(--orange-light);"></div><div style="opacity:.9;"></div><div style="opacity:.65;font-size:11px;"></div>';
        row.children[0].textContent = entry.action || "Activity";
        row.children[1].textContent = (entry.title || "Untitled card") + (entry.details ? " — " + entry.details : "");
        row.children[2].textContent = dateText + (entry.url ? " · " + entry.url : "");
        list.appendChild(row);
      });
    }
    document.getElementById("private-activity-clear").addEventListener("click", function() {
      if (confirm("Clear all private card activity?")) {
        privateActivity = [];
        localStorage.removeItem("bst_private_activity");
        renderPrivateActivity();
      }
    });
  }

  function createCard(item, contextType, indexInList) {
    var card = document.createElement("article");
    card.className = "bst-item-container";
    card.dataset.toolUrl = item.url || "";

    var isMarkActive = (contextType === 'saved' && isSavedMarkDelMode) || 
                       (contextType === 'private' && isPrivMarkDelMode) ||
                       (contextType === 'lock' && isLockMarkRestMode) ||
                       (contextType === 'activity' && isActivityMarkMode);

    if (isMarkActive) {
      var chk = document.createElement("input");
      chk.type = "checkbox";
      chk.className = "card-select-chk";
      chk.style.position = "absolute";
      chk.style.top = "10px";
      chk.style.left = "10px";
      chk.style.zIndex = "10";
      chk.style.width = "20px";
      chk.style.height = "20px";
      card.appendChild(chk);
      card._selectChk = chk;
    }

    var imageWrapper = document.createElement("div");
    imageWrapper.className = "bst-panel-image-wrapper";

    var loading = document.createElement("div");
    loading.className = "bst-image-loading";
    loading.textContent = "Israr Lab";

    var img = document.createElement("img");
    img.alt = item.title + " website preview";
    img.loading = "lazy";
    img.decoding = "async";
    img.referrerPolicy = "no-referrer";
    img.src = item.imgUrl || getWebsiteScreenshot(item.url);

    img.onload = function () { loading.style.display = "none"; };
    img.onerror = function () {
      img.style.display = "none";
      if (contextType === "private" && !item.imgUrl && item.url) {
        loading.textContent = "Loading website preview…";
        loading.style.display = "flex";
        var siteFrame = document.createElement("iframe");
        siteFrame.title = (item.title || "Website") + " live website preview";
        siteFrame.src = item.url;
        siteFrame.loading = "lazy";
        siteFrame.setAttribute("sandbox", "allow-forms allow-scripts allow-same-origin");
        siteFrame.setAttribute("referrerpolicy", "no-referrer");
        siteFrame.style.cssText = "position:absolute;inset:0;width:300%;height:300%;border:0;transform:scale(.333333);transform-origin:top left;pointer-events:none;background:#fff;";
        imageWrapper.appendChild(siteFrame);
        var frameTimer = setTimeout(function(){
          if (loading.parentNode) {
            var safeHost = item.url;
            try { safeHost = new URL(item.url).hostname; } catch (hostError) {}
            loading.textContent = "Website preview unavailable · " + safeHost;
            loading.style.display = "flex";
          }
        }, 7000);
        siteFrame.addEventListener("load", function(){
          clearTimeout(frameTimer);
          loading.style.display = "none";
        });
      } else {
        loading.textContent = "Image preview unavailable";
        loading.style.display = "flex";
      }
    };

    imageWrapper.appendChild(loading);
    imageWrapper.appendChild(img);

    var content = document.createElement("div");
    content.className = "bst-item-content";

    var title = document.createElement("h3");
    title.className = "bst-item-title";
    title.innerHTML = highlightText(item.title || "Tool", searchQuery);

    var controlsRow = document.createElement("div");
    controlsRow.className = "bst-card-controls-row";

    var settingsBtn = document.createElement("button");
    settingsBtn.className = "bst-card-settings-btn";
    settingsBtn.innerHTML = " Settings";

    var popupMenu = document.createElement("div");
    popupMenu.className = "bst-settings-popup";
    popupMenu.innerHTML = 
      '<button class="pop-priv">Private Cards</button>' +
      '<button class="pop-lock">Card Lock</button>' +
      '<button class="pop-save">Saved Card</button>' +
      '<button class="pop-visit">Visit Cards</button>' +
      '<button class="pop-cat">Category</button>' +
      (contextType === 'private' ? '<button class="pop-edit-private">Edit Card</button><button class="pop-delete-private" style="color:#ef4444;">Delete Private Card</button>' : '');

    settingsBtn.addEventListener("click", function(e) {
      e.preventDefault();
      e.stopPropagation();
      document.querySelectorAll('.bst-settings-popup').forEach(function(p){
        if (p !== popupMenu) {
          p.classList.remove('open');
          p.style.display = 'none';
          p.style.visibility = 'hidden';
        }
      });
      var willOpen = !popupMenu.classList.contains("open");
      if (willOpen) {
        if (popupMenu.parentElement !== document.body) document.body.appendChild(popupMenu);
        popupMenu.style.position = "fixed";
        popupMenu.style.display = "flex";
        popupMenu.style.visibility = "hidden";
        popupMenu.classList.add("open");
        var rect = settingsBtn.getBoundingClientRect();
        var popupWidth = Math.min(190, window.innerWidth - 16);
        popupMenu.style.width = popupWidth + "px";
        popupMenu.style.maxWidth = "calc(100vw - 16px)";
        popupMenu.style.left = Math.max(8, Math.min(rect.left, window.innerWidth - popupWidth - 8)) + "px";
        var popupHeight = popupMenu.getBoundingClientRect().height;
        var top = rect.bottom + 5;
        if (top + popupHeight > window.innerHeight - 8) top = rect.top - popupHeight - 5;
        top = Math.max(8, Math.min(top, window.innerHeight - popupHeight - 8));
        popupMenu.style.top = top + "px";
        popupMenu.style.visibility = "visible";
      } else {
        popupMenu.classList.remove("open");
        popupMenu.style.display = 'none';
        popupMenu.style.visibility = 'hidden';
      }
    });

    popupMenu.querySelector('.pop-priv').addEventListener('click', function(e) {
      e.stopPropagation();
      popupMenu.classList.remove('open');
      if(!privateCards.some(function(p){return p.url===item.url;})) {
        var privateCopy = Object.assign({}, item, { views: Number(item.views) || 0 });
        privateCards.push(privateCopy);
        localStorage.setItem("bst_private_cards", JSON.stringify(privateCards));
        logPrivateActivity("Added to Private Cards", privateCopy, "Added from card Settings");
        alert("Added to Private Cards!");
      } else {
        alert("Already in Private Cards!");
      }
    });

    popupMenu.querySelector('.pop-lock').addEventListener('click', function(e) {
      e.stopPropagation();
      popupMenu.classList.remove('open');
      if(!lockedCards.some(function(l){return l.url===item.url;})) {
        lockedCards.push(item);
        localStorage.setItem("bst_locked_cards", JSON.stringify(lockedCards));
        alert("Added to Card Lock Vault!");
      } else {
        alert("Already locked!");
      }
    });

    popupMenu.querySelector('.pop-save').addEventListener('click', function(e) {
      e.stopPropagation();
      popupMenu.classList.remove('open');
      if(!savedTools.some(function(s){return s.url===item.url;})) {
        savedTools.push(item);
        localStorage.setItem("bst_saved_tools", JSON.stringify(savedTools));
        updateBadges();
        alert("Saved successfully!");
      } else {
        alert("Already saved!");
      }
    });

    popupMenu.querySelector('.pop-visit').addEventListener('click', function(e) {
      e.stopPropagation();
      popupMenu.classList.remove('open');
      window.open(item.url, '_blank');
      handleToolClick(item);
    });

    popupMenu.querySelector('.pop-cat').addEventListener('click', function(e) {
      e.stopPropagation();
      popupMenu.classList.remove('open');
      if(categories.length === 0) {
        alert("No categories created yet! Please create a category first.");
        switchView("category");
        return;
      }
      var catNames = categories.map(function(c, i){ return (i+1) + ". " + c.name; }).join("\n");
      var choice = prompt("Select category number to assign card:\n" + catNames);
      var idx = parseInt(choice) - 1;
      if(!isNaN(idx) && categories[idx]) {
        if(!categories[idx].items) categories[idx].items = [];
        if(!categories[idx].items.some(function(it){return it.url===item.url;})) {
          categories[idx].items.push(item);
          localStorage.setItem("bst_categories", JSON.stringify(categories));
          alert("Card added to category: " + categories[idx].name);
        } else {
          alert("Card already exists in this category!");
        }
      }
    });

    var editPrivateSettingBtn = popupMenu.querySelector('.pop-edit-private');
    if (editPrivateSettingBtn) {
      editPrivateSettingBtn.addEventListener("click", function(e) {
        e.preventDefault(); e.stopPropagation();
        popupMenu.classList.remove("open");
        var idx = privateCards.findIndex(function(p) { return p.url === item.url; });
        if (idx < 0) { alert("Private card nahi mila."); return; }
        var current = privateCards[idx];
        var newTitle = prompt("Edit Card Title:", current.title || "");
        if (newTitle === null) return;
        newTitle = newTitle.trim();
        if (!newTitle) { alert("Card title khali nahi ho sakta."); return; }
        var newUrl = prompt("Edit Website URL:", current.url || "");
        if (newUrl === null) return;
        newUrl = newUrl.trim();
        if (!/^https?:\/\//i.test(newUrl)) newUrl = "https://" + newUrl.replace(/^\/+/, "");
        try { var parsedEditUrl = new URL(newUrl); if (!["http:","https:"].includes(parsedEditUrl.protocol) || !parsedEditUrl.hostname || parsedEditUrl.hostname.indexOf(".") < 0) throw new Error(); newUrl = parsedEditUrl.href; }
        catch(err) { alert("Valid website URL dalein, jaise https://example.com"); return; }
        var newImg = prompt("Edit Preview Image URL (blank = automatic preview):", current.imgUrl || "");
        if (newImg === null) return;
        newImg = newImg.trim();
        if (newImg) { try { var parsedEditImg = new URL(newImg); if (!["http:","https:"].includes(parsedEditImg.protocol)) throw new Error(); newImg = parsedEditImg.href; } catch(err) { alert("Valid image URL dalein ya blank chhodein."); return; } }
        var oldTitle = current.title;
        current.title = newTitle; current.url = newUrl; current.imgUrl = newImg;
        localStorage.setItem("bst_private_cards", JSON.stringify(privateCards));
        logPrivateActivity("Private card edited", current, "Title: " + oldTitle + " → " + newTitle);
        loadPrivateCardsGrid();
        alert("Private card update ho gaya!");
      });
    }

    var deletePrivateSettingBtn = popupMenu.querySelector('.pop-delete-private');
    if (deletePrivateSettingBtn) {
      deletePrivateSettingBtn.addEventListener("click", function(e) {
        e.preventDefault();
        e.stopPropagation();
        popupMenu.classList.remove("open");
        if (!confirm('Move "' + (item.title || "this card") + '" to Recovery?')) return;
        var idx = privateCards.findIndex(function(p) { return p.url === item.url; });
        if (idx >= 0) {
          var removed = privateCards.splice(idx, 1)[0];
          removed.deletedAt = Date.now();
          privateRecovery.push(removed);
          localStorage.setItem("bst_private_cards", JSON.stringify(privateCards));
          localStorage.setItem("bst_private_recovery", JSON.stringify(privateRecovery));
          logPrivateActivity("Card deleted to Recovery", removed, "Deleted from Settings");
          loadPrivateCardsGrid();
        }
      });
    }

    var isSaved = savedTools.some(function(s) { return s.url === item.url; });
    var saveBtn = document.createElement("button");
    saveBtn.className = "bst-card-save-btn" + (isSaved ? " saved" : "");
    saveBtn.innerHTML = isSaved ? " Saved" : "Save";

    saveBtn.addEventListener("click", function(e) {
      e.preventDefault();
      e.stopPropagation();
      var currentlySaved = savedTools.some(function(s) { return s.url === item.url; });
      if (currentlySaved) {
        savedTools = savedTools.filter(function(s) { return s.url !== item.url; });
        saveBtn.className = "bst-card-save-btn";
        saveBtn.innerHTML = "Save";
        if (contextType === "private") logPrivateActivity("Card unsaved", item, "Removed from Saved Cards");
      } else {
        savedTools.push(item);
        saveBtn.className = "bst-card-save-btn saved";
        saveBtn.innerHTML = "Saved";
        if (contextType === "private") {
          item.saveCount = (Number(item.saveCount) || 0) + 1;
          localStorage.setItem("bst_private_cards", JSON.stringify(privateCards));
          logPrivateActivity("Card saved", item, "Save count: " + item.saveCount);
        }
      }
      localStorage.setItem("bst_saved_tools", JSON.stringify(savedTools));
      updateBadges();
      if (contextType === 'saved') renderSavedView();
    });

    controlsRow.appendChild(settingsBtn);
    controlsRow.appendChild(popupMenu);
    controlsRow.appendChild(saveBtn);

    content.appendChild(title);
    content.appendChild(controlsRow);

    var statsDiv = document.createElement("div");
    statsDiv.className = "bst-card-stats";

    // Stable per-card demo figures, shared by main/saved/locked/private cards.
    var cardSeed = String(item.url || item.title || "card").split("").reduce(function(sum, ch){ return (sum * 31 + ch.charCodeAt(0)) >>> 0; }, 7);
    if (typeof item.newUsers !== "number") item.newUsers = 15000 + (cardSeed % 24000);
    if (typeof item.active !== "number") item.active = 2500 + (cardSeed % 8500);
    if (typeof item.todayViews !== "number") item.todayViews = 15000 + (cardSeed % 65000);
    var newUserRow = document.createElement("div");
    newUserRow.className = "bst-stat-row";
    newUserRow.innerHTML = '<span class="bst-stat-label"><span class="bst-new-user-dot"></span>New User:</span><span class="bst-stat-val new-user-val">' + Number(item.newUsers).toLocaleString() + '</span>';
    statsDiv.appendChild(newUserRow);

    var activeCount = Number(item.active) || 3500;
    var activeRow = document.createElement("div");
    activeRow.className = "bst-stat-row";
    activeRow.innerHTML = '<span class="bst-stat-label"><span class="bst-blinking-dot"></span>Active User:</span><span class="bst-stat-val active-val">' + activeCount.toLocaleString() + '</span>';
    statsDiv.appendChild(activeRow);

    var todayRow = document.createElement("div");
    todayRow.className = "bst-stat-row";
    todayRow.innerHTML = '<span class="bst-stat-label"><span class="bst-today-dot"></span>Today Views:</span><span class="bst-stat-val today-val">' + Number(item.todayViews).toLocaleString() + '</span>';
    statsDiv.appendChild(todayRow);

    var actionRow = document.createElement("div");
    actionRow.className = "bst-card-action-row";

    var link = document.createElement("a");
    link.className = "bst-image-title-overlay";
    link.href = "#";
    link.textContent = "Visit " + String.fromCharCode(8599);
    
    link.addEventListener("click", function(e) {
      e.preventDefault();
      e.stopPropagation();
      handleToolClick(item);
      if (contextType === "private") {
        item.views = (Number(item.views) || 0) + 1;
        item.lastViewedAt = new Date().toISOString();
        localStorage.setItem("bst_private_cards", JSON.stringify(privateCards));
        var viewCountEl = card.querySelector(".private-views-count");
        if (viewCountEl) viewCountEl.textContent = "Website Views: " + item.views;
        logPrivateActivity("Website opened", item, "Views: " + item.views);
      }
      currentVisitItem = item;
      switchView("visit");
      try {
        var hdr = document.querySelector(".bst-panel-header");
        if (hdr) hdr.scrollIntoView({ behavior: "smooth", block: "start" });
      } catch (err) {}
    });

    var apkLink = document.createElement("a");
    apkLink.className = "bst-apk-btn";
    apkLink.href = "#";
    apkLink.textContent = "APK";
    apkLink.addEventListener("click", function(e) {
      e.preventDefault();
      e.stopPropagation();
      handleToolClick(item);
      currentApkItem = item;
      switchView("apkstore");
      try {
        var hdr = document.querySelector(".bst-panel-header");
        if (hdr) hdr.scrollIntoView({ behavior: "smooth", block: "start" });
      } catch (err) {}
    });

    actionRow.appendChild(link);
    actionRow.appendChild(apkLink);

    content.appendChild(statsDiv);
    if (contextType === "private") {
      var viewsDiv = document.createElement("div");
      viewsDiv.className = "bst-card-stats private-views-count";
      viewsDiv.style.cssText = "font-size:12px;padding:7px 10px;margin-top:8px;";
      viewsDiv.textContent = "Website Views: " + (Number(item.views) || 0);
      content.appendChild(viewsDiv);
    }
    content.appendChild(actionRow);

    card.appendChild(imageWrapper);
    card.appendChild(content);

    return card;
  }

  document.addEventListener('click', function(e) {
    var clickedSettings = e.target && e.target.closest ? e.target.closest('.bst-card-settings-btn') : null;
    var clickedPopup = e.target && e.target.closest ? e.target.closest('.bst-settings-popup') : null;
    if (clickedSettings || clickedPopup) return;
    document.querySelectorAll('.bst-settings-popup').forEach(function(p) {
      p.classList.remove('open');
      p.style.display = 'none';
      p.style.visibility = 'hidden';
    });
  }, true);

  /* CATEGORY VIEW & MANAGEMENT */
  function renderCategoryView() {
    var swipeContainer = document.getElementById("category-swipe-container");
    swipeContainer.innerHTML = "";
    document.getElementById("category-details-section").style.display = "none";

    if(categories.length === 0) {
      swipeContainer.innerHTML = '<div class="bst-empty">No categories created yet. Click "New Category" to add one!</div>';
      return;
    }

    categories.forEach(function(cat, cIdx) {
      var pill = document.createElement("div");
      pill.className = "bst-cat-pill-card";

      var chkBoxHtml = isCatMarkDelMode ? '<input type="checkbox" class="cat-del-chk" style="width:18px;height:18px;margin-bottom:5px;" />' : '';

      pill.innerHTML =
        (isCatMarkDelMode ? chkBoxHtml : '') +
        '<button class="bst-sub-btn view-cat-btn" type="button"></button>';
      pill.querySelector('.view-cat-btn').textContent = cat.name + ' (' + ((cat.items && cat.items.length) ? cat.items.length : 0) + ')';

      pill._catIndex = cIdx;
      pill.querySelector('.view-cat-btn').addEventListener('click', function() {
        openCategoryDetails(cat);
      });

      swipeContainer.appendChild(pill);
    });
  }

  function openCategoryDetails(cat) {
    document.getElementById("selected-category-title").textContent = "Category: " + cat.name;
    var detailsSec = document.getElementById("category-details-section");
    detailsSec.style.display = "block";
    var gridEl = document.getElementById("category-items-grid");
    gridEl.innerHTML = "";

    if(!cat.items || cat.items.length === 0) {
      gridEl.innerHTML = '<div class="bst-empty" style="grid-column:1/-1;">No cards inside this category. Use card settings to add items here.</div>';
      return;
    }

    cat.items.forEach(function(item, idx) {
      gridEl.appendChild(createCard(item, 'category', idx));
    });
  }

  function showCategoryNameDialog() {
    var backdrop = document.createElement("div");
    backdrop.className = "bst-modal-backdrop";
    backdrop.innerHTML =
      '<div class="bst-modal-card" role="dialog" aria-modal="true" aria-labelledby="bst-cat-dialog-title">' +
        '<h3 class="bst-modal-title" id="bst-cat-dialog-title">New Category</h3>' +
        '<p class="bst-modal-help">Enter a name for your category</p>' +
        '<input class="bst-modal-input" type="text" maxlength="40" placeholder="Category name" autocomplete="off">' +
        '<div class="bst-modal-actions"><button type="button" class="bst-modal-btn bst-modal-cancel">Cancel</button>' +
        '<button type="button" class="bst-modal-btn bst-modal-confirm">Create</button></div>' +
      '</div>';
    document.body.appendChild(backdrop);
    var input = backdrop.querySelector(".bst-modal-input");
    function closeDialog() { backdrop.remove(); }
    function createCategory() {
      var name = input.value.trim();
      if (!name) { input.focus(); return; }
      if (categories.some(function(c){ return String(c.name).toLowerCase() === name.toLowerCase(); })) {
        input.value = "";
        input.placeholder = "Name already exists";
        input.focus();
        return;
      }
      categories.push({ name: name, items: [] });
      localStorage.setItem("bst_categories", JSON.stringify(categories));
      closeDialog();
      renderCategoryView();
    }
    backdrop.querySelector(".bst-modal-cancel").addEventListener("click", closeDialog);
    backdrop.querySelector(".bst-modal-confirm").addEventListener("click", createCategory);
    backdrop.addEventListener("click", function(e){ if (e.target === backdrop) closeDialog(); });
    input.addEventListener("keydown", function(e){
      if (e.key === "Enter") createCategory();
      if (e.key === "Escape") closeDialog();
    });
    input.focus();
  }
  document.getElementById("cat-new-btn").addEventListener("click", showCategoryNameDialog);

  document.getElementById("cat-all-del").addEventListener("click", function() {
    if(confirm("Delete all categories?")) {
      categories = [];
      localStorage.removeItem("bst_categories");
      renderCategoryView();
    }
  });

  document.getElementById("cat-mark-del").addEventListener("click", function() {
    isCatMarkDelMode = !isCatMarkDelMode;
    var btn = document.getElementById("cat-mark-del");
    btn.style.background = isCatMarkDelMode ? "#319795" : "#e53e3e";
    btn.textContent = isCatMarkDelMode ? "Confirm Delete" : "Mark Delete";

    if(!isCatMarkDelMode) {
      var swipeContainer = document.getElementById("category-swipe-container");
      var pills = swipeContainer.querySelectorAll(".bst-cat-pill-card");
      var newCats = [];
      pills.forEach(function(pill, idx) {
        var chk = pill.querySelector('.cat-del-chk');
        if(chk && chk.checked) {
          // deleted
        } else {
          newCats.push(categories[pill._catIndex]);
        }
      });
      categories = newCats;
      localStorage.setItem("bst_categories", JSON.stringify(categories));
    }
    renderCategoryView();
  });

  /* PRIVATE CARDS VIEW */
  function renderPrivateView() {
    showPrivatePanel("main");
    loadPrivateCardsGrid();
    purgeExpiredPrivateRecovery();
  }

  function purgeExpiredPrivateRecovery() {
    var cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
    privateRecovery = privateRecovery.filter(function(item){ return (item.deletedAt || Date.now()) > cutoff; });
    localStorage.setItem("bst_private_recovery", JSON.stringify(privateRecovery));
  }

  function showPrivatePanel(which) {
    document.getElementById("private-create-form").style.display = "none";
    document.getElementById("private-main-panel").style.display = which === "main" ? "" : "none";
    document.getElementById("private-recovery-panel").style.display = which === "recovery" ? "" : "none";
    document.getElementById("private-activity-panel").style.display = which === "activity" ? "" : "none";
    document.querySelectorAll("#view-private .bst-subpage-actions").forEach(function(el){
      if (el.classList.contains("private-actions-grid")) el.style.display = which === "main" ? "grid" : (el.closest("#private-recovery-panel") ? "grid" : "none");
    });
  }

  function loadPrivateRecoveryGrid() {
    purgeExpiredPrivateRecovery();
    var grid = document.getElementById("recovery-grid");
    grid.innerHTML = "";
    if (!privateRecovery.length) {
      grid.innerHTML = '<div class="bst-empty" style="grid-column:1/-1;">Recovery is empty.</div>';
      return;
    }
    privateRecovery.forEach(function(item, idx) {
      var card = createCard(item, "recovery", idx);
      grid.appendChild(card);
    });
  }

  function loadPrivateCardsGrid() {
    var pGrid = document.getElementById("private-grid");
    if(!pGrid) return;
    pGrid.innerHTML = "";

    if(privateCards.length === 0) {
      pGrid.innerHTML = '<div class="bst-empty" style="grid-column:1/-1;">No private cards added yet.</div>';
      return;
    }

    privateCards.forEach(function(item, idx) {
      pGrid.appendChild(createCard(item, 'private', idx));
    });
  }

  /* PATTERN LOCK VAULT */
  function renderLockView() {
    var container = document.getElementById("lock-vault-box");
    container.innerHTML = "";

    if (vaultPattern.length === 0) {
      renderPatternSetup(container);
      return;
    }

    renderPatternUnlock(container);
  }

  function enablePatternSwipe(grid, getPattern, onComplete) {
    var active = false, pointerId = null;
    var svgNS = "http://www.w3.org/2000/svg";
    grid.style.position = 'relative';
    grid.style.touchAction = 'none';
    var svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('class', 'pattern-lines');
    svg.setAttribute('aria-hidden', 'true');
    svg.style.position = 'absolute';
    svg.style.left = '0'; svg.style.top = '0';
    svg.style.width = '100%'; svg.style.height = '100%';
    svg.style.overflow = 'visible'; svg.style.pointerEvents = 'none';
    var line = document.createElementNS(svgNS, 'polyline');
    line.setAttribute('fill', 'none');
    line.setAttribute('stroke', 'var(--orange-light)');
    line.setAttribute('stroke-width', '5');
    line.setAttribute('stroke-linecap', 'round');
    line.setAttribute('stroke-linejoin', 'round');
    line.setAttribute('vector-effect', 'non-scaling-stroke');
    line.setAttribute('opacity', '.98');
    svg.appendChild(line);
    grid.appendChild(svg);

    function redrawLines() {
      var gr = grid.getBoundingClientRect();
      var dots = getPattern().map(function(id) {
        return grid.querySelector('.pattern-dot[data-id="' + id + '"]');
      }).filter(Boolean);
      var points = dots.map(function(dot) {
        var r = dot.getBoundingClientRect();
        return (r.left + r.width / 2 - gr.left) + ',' + (r.top + r.height / 2 - gr.top);
      });
      line.setAttribute('points', points.join(' '));
      svg.setAttribute('viewBox', '0 0 ' + Math.max(1, gr.width) + ' ' + Math.max(1, gr.height));
      svg.setAttribute('preserveAspectRatio', 'none');
    }
    function addDotFromPoint(x, y) {
      var dots = Array.prototype.slice.call(grid.querySelectorAll('.pattern-dot'));
      var dot = null, best = Infinity;
      dots.forEach(function(candidate) {
        var r = candidate.getBoundingClientRect();
        var cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        var dx = x - cx, dy = y - cy;
        var dist = Math.sqrt(dx * dx + dy * dy);
        var hitRadius = Math.max(r.width, r.height) * 0.62;
        if (dist <= hitRadius && dist < best) { best = dist; dot = candidate; }
      });
      if (!dot) return;
      var id = Number(dot.dataset.id), pattern = getPattern();
      if (!pattern.includes(id)) {
        pattern.push(id);
        dot.classList.add('selected');
        redrawLines();
      }
    }
    function onMove(e) {
      if (!active || (pointerId !== null && e.pointerId !== pointerId)) return;
      e.preventDefault();
      addDotFromPoint(e.clientX, e.clientY);
    }
    function onEnd(e) {
      if (!active || (e && pointerId !== null && e.pointerId !== pointerId)) return;
      active = false; pointerId = null;
      document.removeEventListener('pointermove', onMove, true);
      document.removeEventListener('pointerup', onEnd, true);
      document.removeEventListener('pointercancel', onEnd, true);
      redrawLines();
      onComplete();
    }
    grid.addEventListener('pointerdown', function(e) {
      var dot = e.target.closest ? e.target.closest('.pattern-dot') : null;
      if (!dot || !grid.contains(dot) || active) return;
      e.preventDefault();
      active = true; pointerId = e.pointerId;
      if (grid.setPointerCapture && e.pointerId !== undefined) {
        try { grid.setPointerCapture(e.pointerId); } catch (_) {}
      }
      addDotFromPoint(e.clientX, e.clientY);
      document.addEventListener('pointermove', onMove, { capture: true, passive: false });
      document.addEventListener('pointerup', onEnd, true);
      document.addEventListener('pointercancel', onEnd, true);
    });
    window.addEventListener('resize', redrawLines);
    requestAnimationFrame(redrawLines);
  }

  function renderPatternSetup(container, confirmMode) {
    container.innerHTML = "";
    var setupDiv = document.createElement("div");
    setupDiv.className = "bst-vault-lock-screen";
    setupDiv.innerHTML = 
      '<h3>' + (confirmMode ? 'Confirm New Pattern' : 'Secure Vault Setup') + '</h3>' +
      '<p style="font-size:13px; color:var(--muted);">' + (confirmMode ? 'Draw the same new pattern one more time.' : (patternResetInProgress ? 'Verification successful. Please draw your new pattern.' : 'Please set your pattern. Swipe from one circle to another.')) + '</p>' +
      '<div class="pattern-grid" id="setup-pattern"></div>' +
      '<div class="bst-vault-lock-btns">' +
        '<button class="bst-sub-btn danger" id="reset-dots">Clear</button>' +
        '<button class="bst-sub-btn" id="save-pattern-btn">' + (confirmMode ? 'Confirm Pattern' : 'Save Pattern') + '</button>' +
        (!confirmMode ? '<button class="bst-sub-btn" id="forgot-pattern-first">Forgot Pattern?</button>' : '') +
      '</div>';
    
    container.appendChild(setupDiv);

    var currentPattern = [];
    var pGrid = setupDiv.querySelector('#setup-pattern');
    for(var i=1; i<=9; i++) {
      var dot = document.createElement("div");
      dot.className = "pattern-dot";
      dot.dataset.id = i;
      dot.innerHTML = '<div style="width:14px;height:14px;border-radius:50%;background:var(--orange-light);"></div>';
      pGrid.appendChild(dot);
    }

    enablePatternSwipe(pGrid, function(){ return currentPattern; }, function(){});
    var firstForgotBtn = setupDiv.querySelector('#forgot-pattern-first');
    if (firstForgotBtn) firstForgotBtn.addEventListener('click', function(){
      openCaptchaModal(function(){
        patternResetInProgress = true;
        vaultPattern = [];
        localStorage.removeItem('bst_vault_pattern');
        renderPatternSetup(document.getElementById('lock-vault-box'), false);
      });
    });
    setupDiv.querySelector('#reset-dots').addEventListener('click', function() {
      currentPattern = [];
      pGrid.querySelectorAll('.pattern-dot').forEach(function(d){ d.classList.remove('selected'); });
      var poly = pGrid.querySelector('.pattern-lines polyline'); if (poly) poly.setAttribute('points', '');
    });

    setupDiv.querySelector('#save-pattern-btn').addEventListener('click', function() {
      if(currentPattern.length < 3) { alert("Connect at least 3 dots!"); return; }
      if (confirmMode) {
        var firstPattern = JSON.parse(localStorage.getItem("bst_pending_vault_pattern") || "[]");
        if (firstPattern.length !== currentPattern.length || !firstPattern.every(function(id, idx){ return id === currentPattern[idx]; })) {
          alert("Pattern did not match. Please draw the same pattern again.");
          currentPattern = [];
          pGrid.querySelectorAll('.pattern-dot').forEach(function(d){ d.classList.remove('selected'); });
          var poly = pGrid.querySelector('.pattern-lines polyline'); if(poly) poly.setAttribute('points','');
          return;
        }
        vaultPattern = currentPattern.slice();
        localStorage.setItem("bst_vault_pattern", JSON.stringify(vaultPattern));
        localStorage.removeItem("bst_pending_vault_pattern");
        patternResetInProgress = false;
        renderUnlockedLockVault();
      } else if (patternResetInProgress) {
        localStorage.setItem("bst_pending_vault_pattern", JSON.stringify(currentPattern));
        renderPatternSetup(container, true);
      } else {
        vaultPattern = currentPattern.slice();
        localStorage.setItem("bst_vault_pattern", JSON.stringify(vaultPattern));
        renderUnlockedLockVault();
      }
    });
  }

  function renderPatternUnlock(container) {
    var lockDiv = document.createElement("div");
    lockDiv.className = "bst-vault-lock-screen";
    lockDiv.innerHTML = 
      '<h3>Pattern Lock</h3>' +
      '<p style="font-size:13px; color:var(--muted);">Please sahi pattern swipe karein</p>' +
      '<div class="pattern-grid" id="unlock-pattern"></div>' +
      '<div class="bst-vault-lock-btns">' +
        '<button class="bst-slim-btn" id="forgot-pattern" style="background:#718096;">Forgot?</button>' +
        '<button class="bst-slim-btn danger" id="cancel-lock" style="background:#e53e3e;">Cancel</button>' +
      '</div>';

    container.appendChild(lockDiv);

    var enteredPattern = [];
    var pGrid = lockDiv.querySelector('#unlock-pattern');
    for(var i=1; i<=9; i++) {
      var dot = document.createElement("div");
      dot.className = "pattern-dot";
      dot.dataset.id = i;
      dot.innerHTML = '<div style="width:14px;height:14px;border-radius:50%;background:var(--orange-light);"></div>';
      pGrid.appendChild(dot);
    }

    enablePatternSwipe(pGrid, function(){ return enteredPattern; }, function() {
      if (Date.now() < patternLockUntil) { enteredPattern=[]; return; }
      if (!enteredPattern.length) return;
      if (enteredPattern.length < vaultPattern.length) return;
      var match = enteredPattern.length === vaultPattern.length && enteredPattern.every(function(val, idx){ return val === vaultPattern[idx]; });
      if (match) {
        patternFailedAttempts=0; localStorage.setItem('bst_pattern_failures','0'); localStorage.removeItem('bst_pattern_lock_until'); patternLockUntil=0;
        renderUnlockedLockVault();
      } else {
        patternFailedAttempts++;
        localStorage.setItem('bst_pattern_failures',String(patternFailedAttempts));
        if (patternFailedAttempts >= 3) {
          patternFailedAttempts=0; patternLockUntil=Date.now()+30000;
          localStorage.setItem('bst_pattern_failures','0'); localStorage.setItem('bst_pattern_lock_until',String(patternLockUntil));
          var lockedMsg=lockDiv.querySelector('.pattern-error');
          if(!lockedMsg){lockedMsg=document.createElement('div');lockedMsg.className='pattern-error';pGrid.insertAdjacentElement('afterend',lockedMsg);}
          lockedMsg.style.cssText='color:#ff5a6a;text-align:center;font-size:13px;margin-top:8px;';
          pGrid.style.pointerEvents='none';
          var left=30; lockedMsg.textContent='Too many wrong patterns. Wait '+left+' seconds.';
          var countdown=setInterval(function(){left--;if(left<=0){clearInterval(countdown);patternLockUntil=0;localStorage.removeItem('bst_pattern_lock_until');pGrid.style.pointerEvents='';lockedMsg.textContent='You can try again now.';}else lockedMsg.textContent='Too many wrong patterns. Wait '+left+' seconds.';},1000);
        }
        if (navigator.vibrate) navigator.vibrate(200);
        lockDiv.classList.add('vibrate');
        setTimeout(function(){ lockDiv.classList.remove('vibrate'); }, 300);
        var error = lockDiv.querySelector('.pattern-error');
        if (!error) {
          error = document.createElement('div');
          error.className = 'pattern-error';
          error.style.cssText = 'color:#ff5a6a;text-align:center;font-size:13px;margin-top:8px;';
          error.textContent = 'Wrong Pattern! Try again.';
          pGrid.insertAdjacentElement('afterend', error);
        } else error.style.display = 'block';
        enteredPattern = [];
        pGrid.querySelectorAll('.pattern-dot').forEach(function(d){ d.classList.remove('selected'); });
      }
    });

    if (Date.now() < patternLockUntil) {
      var remain=Math.ceil((patternLockUntil-Date.now())/1000);
      var lockMsg=document.createElement('div');lockMsg.className='pattern-error';lockMsg.style.cssText='color:#ff5a6a;text-align:center;font-size:13px;margin-top:8px;';lockDiv.querySelector('#unlock-pattern').insertAdjacentElement('afterend',lockMsg);
      pGrid.style.pointerEvents='none';lockMsg.textContent='Too many wrong patterns. Wait '+remain+' seconds.';
      var lockTimer=setInterval(function(){remain--;if(remain<=0){clearInterval(lockTimer);patternLockUntil=0;localStorage.removeItem('bst_pattern_lock_until');pGrid.style.pointerEvents='';lockMsg.textContent='You can try again now.';}else lockMsg.textContent='Too many wrong patterns. Wait '+remain+' seconds.';},1000);
    }

    lockDiv.querySelector('#cancel-lock').addEventListener('click', function() {
      switchView("home");
    });

    lockDiv.querySelector('#forgot-pattern').addEventListener('click', function() {
      openCaptchaModal(function() {
        vaultPattern = [];
        patternResetInProgress = true;
        localStorage.removeItem("bst_vault_pattern");
        renderPatternSetup(document.getElementById("lock-vault-box"), false);
      });
    });
  }

  function openCaptchaModal(onSuccess) {
    var captchaText = '', mathAnswer = 0;
    var modalBg = document.createElement('div');
    Object.assign(modalBg.style, { position:'fixed', inset:'0', background:'rgba(0,0,0,.85)', zIndex:'2500', display:'flex', alignItems:'center', justifyContent:'center', padding:'16px' });
    var modalBox = document.createElement('div');
    Object.assign(modalBox.style, { background:'var(--card-bg)', padding:'22px', borderRadius:'14px', border:'1px solid var(--border)', width:'min(360px, calc(100vw - 32px))', boxSizing:'border-box', maxHeight:'85vh', overflowY:'auto', display:'flex', flexDirection:'column', gap:'12px', color:'var(--text)', textAlign:'center' });
    modalBox.innerHTML =
      '<h4 style="margin:0;">Security Verification</h4>' +
      '<p style="font-size:12px;color:var(--muted);margin:0;">Dono jawab sahi bharein. Galat jawab par dono challenge badal jayenge.</p>' +
      '<div id="cap-challenge" style="font-size:20px;letter-spacing:2px;font-weight:900;color:var(--orange-light);background:rgba(0,0,0,.3);padding:12px;border-radius:8px;user-select:none;"></div>' +
      '<div style="position:relative;"><input type="text" id="cap-text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Captcha yahan bharein" style="width:100%;padding:11px 38px 11px 10px;border-radius:7px;border:1px solid var(--border);background:var(--bg);color:var(--text);text-align:center;outline:none;box-sizing:border-box;"/><span id="tick-1" style="position:absolute;right:12px;top:9px;color:#00e676;display:none;font-weight:bold;font-size:20px;">✓</span></div>' +
      '<div id="math-challenge" style="font-size:18px;font-weight:800;color:var(--orange-light);background:rgba(0,0,0,.3);padding:10px;border-radius:8px;"></div>' +
      '<div style="position:relative;"><input type="number" id="cap-math" inputmode="numeric" placeholder="Math answer" style="width:100%;padding:11px 38px 11px 10px;border-radius:7px;border:1px solid var(--border);background:var(--bg);color:var(--text);text-align:center;outline:none;box-sizing:border-box;"/><span id="tick-2" style="position:absolute;right:12px;top:9px;color:#00e676;display:none;font-weight:bold;font-size:20px;">✓</span></div>' +
      '<div id="cap-error" style="display:none;color:#ff5364;font-size:12px;font-weight:700;">Wrong answer. New CAPTCHA generated.</div>' +
      '<div id="success-msg" style="display:none;color:#00e676;font-size:12px;font-weight:700;">✓ Verification Successful!</div>' +
      '<button class="bst-sub-btn" id="verify-captcha">Verify</button>' +
      '<button class="bst-sub-btn danger" id="cancel-captcha" style="background:#4a5568;">Cancel</button>';
    modalBg.appendChild(modalBox); document.body.appendChild(modalBg);
    var textInput=modalBox.querySelector('#cap-text'), mathInput=modalBox.querySelector('#cap-math');
    var tick1=modalBox.querySelector('#tick-1'), tick2=modalBox.querySelector('#tick-2');
    var errorMsg=modalBox.querySelector('#cap-error'), successMsg=modalBox.querySelector('#success-msg');
    function makeChallenge() {
      var chars='ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
      captchaText='';
      for(var i=0;i<9;i++) captchaText += chars[Math.floor(Math.random()*chars.length)];
      var a=Math.floor(Math.random()*12)+3, b=Math.floor(Math.random()*9)+1;
      var ops=['+','−','×'], op=ops[Math.floor(Math.random()*ops.length)];
      if(op==='−' && b>a){var temp=a;a=b;b=temp;}
      mathAnswer=op==='+'?a+b:(op==='−'?a-b:a*b);
      modalBox.querySelector('#cap-challenge').textContent=captchaText;
      modalBox.querySelector('#math-challenge').textContent='Solve: '+a+' '+op+' '+b+' = ?';
      textInput.value=''; mathInput.value=''; tick1.style.display='none'; tick2.style.display='none';
      errorMsg.style.display='none'; successMsg.style.display='none';
    }
    textInput.addEventListener('input',function(){tick1.style.display=textInput.value.trim().toLowerCase()===captchaText.toLowerCase()?'block':'none';});
    mathInput.addEventListener('input',function(){tick2.style.display=mathInput.value!=='' && Number(mathInput.value)===mathAnswer?'block':'none';});
    modalBox.querySelector('#verify-captcha').addEventListener('click',function(){
      var textOk=textInput.value.trim().toLowerCase()===captchaText.toLowerCase();
      var mathOk=mathInput.value!=='' && Number(mathInput.value)===mathAnswer;
      if(textOk && mathOk){
        successMsg.style.display='block'; if(navigator.vibrate) navigator.vibrate(100);
        setTimeout(function(){if(modalBg.parentNode) modalBg.parentNode.removeChild(modalBg);onSuccess();},500);
      } else {
        if(navigator.vibrate) navigator.vibrate(180);
        makeChallenge(); errorMsg.style.display='block';
      }
    });
    modalBox.querySelector('#cancel-captcha').addEventListener('click',function(){if(modalBg.parentNode) modalBg.parentNode.removeChild(modalBg);});
    makeChallenge();
  }

  function renderUnlockedLockVault() {
    var container = document.getElementById("lock-vault-box");
    container.innerHTML = '<h4 style="margin-bottom:10px;">Locked Cards Collection</h4>';
    
    var lGrid = document.createElement("div");
    lGrid.className = "bst-grid";
    container.appendChild(lGrid);

    if(lockedCards.length === 0) {
      lGrid.innerHTML = '<div class="bst-empty" style="grid-column:1/-1;">No cards locked yet.</div>';
    } else {
      lockedCards.forEach(function(item, idx) {
        lGrid.appendChild(createCard(item, 'lock', idx));
      });
    }
  }

  var approvedAllDeleteClick = false;
  function verifyPatternBeforeAllDelete(done) {
    if (!vaultPattern || vaultPattern.length < 3) {
      alert("Pehle Look / Card Lock Vault me pattern set karein. Uske baad All Delete kar sakte hain.");
      switchView("lock");
      return;
    }
    if (Date.now() < patternLockUntil) {
      alert("Pattern temporarily locked. " + Math.ceil((patternLockUntil-Date.now())/1000) + " seconds baad try karein.");
      return;
    }
    var wrap=document.createElement("div");
    Object.assign(wrap.style,{position:"fixed",inset:"0",zIndex:"30000",background:"rgba(0,0,0,.88)",display:"flex",alignItems:"center",justifyContent:"center",padding:"14px"});
    var box=document.createElement("div");
    box.className="bst-vault-lock-screen";
    box.style.cssText+=";width:min(420px,100%);max-width:420px;box-sizing:border-box;max-height:94vh;overflow:auto;";
    box.innerHTML='<h3 style="margin:0">Confirm Pattern to Delete</h3><p style="font-size:13px;color:var(--muted)">All Delete karne ke liye apna saved pattern draw karein.</p><div class="pattern-grid" id="all-delete-pattern"></div><div id="all-delete-msg" style="color:#ff5364;font-size:13px"></div><button class="bst-sub-btn danger" id="all-delete-cancel">Cancel</button>';
    wrap.appendChild(box);document.body.appendChild(wrap);
    var grid=box.querySelector('#all-delete-pattern'), entered=[];
    for(var i=1;i<=9;i++){var dot=document.createElement('div');dot.className='pattern-dot';dot.dataset.id=i;dot.innerHTML='<div style="width:14px;height:14px;border-radius:50%;background:var(--orange-light)"></div>';grid.appendChild(dot);}
    function close(){if(wrap.parentNode)wrap.parentNode.removeChild(wrap);}
    enablePatternSwipe(grid,function(){return entered;},function(){
      if(!entered.length)return;
      var ok=entered.length===vaultPattern.length&&entered.every(function(v,i){return v===vaultPattern[i];});
      if(ok){patternFailedAttempts=0;localStorage.setItem('bst_pattern_failures','0');close();done();return;}
      patternFailedAttempts++;localStorage.setItem('bst_pattern_failures',String(patternFailedAttempts));
      if(patternFailedAttempts>=3){patternFailedAttempts=0;patternLockUntil=Date.now()+30000;localStorage.setItem('bst_pattern_failures','0');localStorage.setItem('bst_pattern_lock_until',String(patternLockUntil));box.querySelector('#all-delete-msg').textContent='Too many wrong attempts. Try again in 30 seconds.';grid.style.pointerEvents='none';setTimeout(function(){close();},30000);return;}
      box.querySelector('#all-delete-msg').textContent='Wrong pattern. Attempt '+patternFailedAttempts+' of 3.';
      entered=[];grid.querySelectorAll('.pattern-dot').forEach(function(d){d.classList.remove('selected');});var pl=grid.querySelector('.pattern-lines polyline');if(pl)pl.setAttribute('points','');
    });
    box.querySelector('#all-delete-cancel').addEventListener('click',close);
  }
  document.addEventListener('click', function(e){
    var target=e.target && e.target.closest ? e.target.closest('#saved-all-del,#history-clear-all,#private-all-del,#cat-all-del') : null;
    if(!target || approvedAllDeleteClick) return;
    e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();
    verifyPatternBeforeAllDelete(function(){approvedAllDeleteClick=true;target.click();approvedAllDeleteClick=false;});
  }, true);

  /* PAGINATION */
  function renderPagination(totalPages) {
    pagination.innerHTML = "";
    var previous = document.createElement("button");
    previous.type = "button";
    previous.textContent = "Previous";
    previous.disabled = currentPage <= 1;

    previous.addEventListener("click", function () {
      if (currentPage > 1) {
        triggerLoadingAndChangeAction(function() { currentPage--; });
      }
    });
    pagination.appendChild(previous);

    for (var i = 1; i <= totalPages; i++) {
      var pageButton = document.createElement("button");
      pageButton.type = "button";
      pageButton.textContent = String(i);

      if (i === currentPage) {
        pageButton.className = "active";
        pageButton.setAttribute("aria-current", "page");
      }

      pageButton.addEventListener("click", (function (pageNumber) {
        return function () {
          if (pageNumber !== currentPage) {
            triggerLoadingAndChangeAction(function() { currentPage = pageNumber; });
          }
        };
      })(i));
      pagination.appendChild(pageButton);
    }

    var next = document.createElement("button");
    next.type = "button";
    next.textContent = "Next";
    next.disabled = currentPage >= totalPages;

    next.addEventListener("click", function () {
      if (currentPage < totalPages) {
        triggerLoadingAndChangeAction(function() { currentPage++; });
      }
    });
    pagination.appendChild(next);
  }

  var loadingTimer = null;
  function triggerLoadingAndChangeAction(callback) {
    if (inlineLoader) inlineLoader.classList.add("active");
    try {
      var tb = document.querySelector(".bst-toolbar");
      if (tb) tb.scrollIntoView({ behavior: "smooth", block: "nearest" });
    } catch (e) {}

    if (loadingTimer) clearTimeout(loadingTimer);
    loadingTimer = setTimeout(function() {
      loadingTimer = null;
      try {
        if (typeof callback === "function") callback();
        updateURLState("home");
        renderPage();
      } catch (err) {
        console.error("Sort/render error:", err);
        try { renderPage(); } catch (e2) {}
      } finally {
        if (inlineLoader) inlineLoader.classList.remove("active");
      }
    }, 1000);
  }

  var currentAppView = "home";

  function buildAppUrl(view) {
    var v = view || "home";
    var newUrl = window.location.pathname + "?view=" + encodeURIComponent(v) + "&page=" + (currentPage || 1);
    if (searchQuery) newUrl += "&q=" + encodeURIComponent(searchQuery);
    return newUrl;
  }

  function updateURLState(view, usePush) {
    var v = view || "home";
    currentAppView = v;
    var newUrl = buildAppUrl(v);
    try { sessionStorage.setItem("bst_current_view_state", JSON.stringify({view:v, page:currentPage, q:searchQuery || ""})); } catch (_) {}
    var stateObj = { view: v, bstApp: true };
    try {
      if (usePush) window.history.pushState(stateObj, "", newUrl);
      else window.history.replaceState(stateObj, "", newUrl);
    } catch (err) {}
  }

  /* Mobile / browser Back: APK (aur doosre pages) se home/cards pe, site se bahar nahi */
  window.addEventListener("popstate", function(e) {
    // Agar APK pe the aur trap active tha → seedha Home
    if (currentAppView === "apkstore" || currentAppView === "visit" || (e.state && e.state.bstAppTrap) || bstIframeTrapOn) {
      try { window.bstForceHome(); } catch (err) {
        currentAppView = "home";
        switchView("home", true);
      }
      return;
    }
    var v = "home";
    if (e.state && e.state.bstApp && e.state.view) {
      v = e.state.view;
    } else {
      try {
        var params = new URLSearchParams(window.location.search);
        var qv = params.get("view");
        if (qv) v = qv;
      } catch (err) {}
    }
    if (!['home','saved','history','private','lock','category','apkstore','visit'].includes(v)) v = "home";
    currentAppView = v;
    switchView(v, true);
  });

  function renderActivityList(items) {
    grid.innerHTML = "";
    grid.style.display = "block";
    grid.style.gridTemplateColumns = "none";

    var wrap = document.createElement("div");
    wrap.className = "bst-activity-panel";
    wrap.style.cssText = "border:1px solid var(--border);border-radius:14px;padding:14px 12px;background:var(--card-bg);box-shadow:0 4px 14px rgba(0,0,0,0.22);";

    var title = document.createElement("h3");
    title.textContent = "Explore Related Free Tools";
    title.style.cssText = "margin:0 0 4px;font-size:16px;font-weight:800;color:var(--text);";
    wrap.appendChild(title);

    var sub = document.createElement("p");
    sub.id = "activity-history-label";
    sub.textContent = "Activity history: " + items.length + " records";
    sub.style.cssText = "margin:0 0 12px;font-size:12px;color:var(--muted);";
    wrap.appendChild(sub);

    /* Equal size buttons: Back | Mark | All Delete */
    var actions = document.createElement("div");
    actions.style.cssText = "display:flex;gap:8px;margin-bottom:12px;width:100%;";
    var markLabel = isActivityMarkMode ? "Confirm Delete" : "Mark";
    var markBg = isActivityMarkMode ? "#e53e3e" : "linear-gradient(120deg,#ff5e00,#ffad33)";
    actions.innerHTML =
      '<button type="button" id="activity-list-back" style="flex:1;min-width:0;padding:10px 6px;border:none;border-radius:9px;cursor:pointer;font-size:12px;font-weight:800;color:#fff;background:var(--btn-bg);border:1px solid var(--border);">← Back</button>' +
      '<button type="button" id="activity-list-mark" style="flex:1;min-width:0;padding:10px 6px;border:none;border-radius:9px;cursor:pointer;font-size:12px;font-weight:800;color:#fff;background:' + markBg + ';">' + markLabel + '</button>' +
      '<button type="button" id="activity-list-alldel" style="flex:1;min-width:0;padding:10px 6px;border:none;border-radius:9px;cursor:pointer;font-size:12px;font-weight:800;color:#fff;background:linear-gradient(120deg,#e53e3e,#c53030);">All Delete</button>';
    wrap.appendChild(actions);

    /* Scroll list – ~4-5 boxes visible */
    var list = document.createElement("div");
    list.style.cssText = "display:flex;flex-direction:column;gap:8px;max-height:280px;overflow-y:auto;padding-right:4px;overscroll-behavior:contain;";

    if (items.length === 0) {
      var empty = document.createElement("div");
      empty.className = "bst-empty";
      empty.style.padding = "24px 10px";
      empty.textContent = "No activity yet. Visit ya APK click karo – yahan record dikhega.";
      list.appendChild(empty);
    } else {
      items.forEach(function(item) {
        var row = document.createElement("div");
        row.className = "bst-activity-row";
        row.dataset.toolUrl = item.url || "";
        row.style.cssText = "display:flex;align-items:flex-start;gap:12px;padding:11px 12px;border-radius:11px;border:1px solid var(--border);background:rgba(0,0,0,0.18);box-shadow:0 2px 8px rgba(0,0,0,0.15);";

        if (isActivityMarkMode) {
          var chk = document.createElement("input");
          chk.type = "checkbox";
          chk.className = "activity-select-chk";
          chk.style.cssText = "width:18px;height:18px;margin-top:3px;flex-shrink:0;accent-color:#ff8500;";
          row.appendChild(chk);
          row._selectChk = chk;
        } else {
          var circle = document.createElement("span");
          circle.style.cssText = "width:16px;height:16px;border-radius:50%;border:2px solid var(--orange-light);flex-shrink:0;margin-top:4px;display:inline-block;box-shadow:0 0 6px rgba(255,133,0,0.25);";
          row.appendChild(circle);
        }

        var info = document.createElement("div");
        info.style.cssText = "min-width:0;flex:1;";
        var timeEl = document.createElement("div");
        timeEl.textContent = item._activityTime || "";
        timeEl.style.cssText = "font-size:11px;color:var(--muted);margin-bottom:3px;";
        var nameEl = document.createElement("a");
        nameEl.href = item.url || "#";
        nameEl.target = "_blank";
        nameEl.rel = "noopener noreferrer";
        nameEl.textContent = item.title || "Tool";
        nameEl.style.cssText = "font-size:13px;font-weight:700;color:var(--orange-light);text-decoration:none;word-break:break-word;";
        nameEl.addEventListener("click", function() { handleToolClick(item); });
        info.appendChild(timeEl);
        info.appendChild(nameEl);
        row.appendChild(info);
        list.appendChild(row);
      });
    }

    wrap.appendChild(list);
    grid.appendChild(wrap);

    /* Wire activity list buttons */
    var backBtn = document.getElementById("activity-list-back");
    var markBtn = document.getElementById("activity-list-mark");
    var allDelBtn = document.getElementById("activity-list-alldel");

    if (backBtn) {
      backBtn.onclick = function() {
        isActivityMarkMode = false;
        currentSort = "recent";
        setSortActive("recent");
        currentPage = 1;
        grid.style.display = "";
        grid.style.gridTemplateColumns = "";
        renderPage();
      };
    }
    if (markBtn) {
      markBtn.onclick = function() {
        if (!isActivityMarkMode) {
          isActivityMarkMode = true;
          renderPage();
          return;
        }
        var rows = grid.querySelectorAll(".bst-activity-row");
        var urlsToDelete = [];
        rows.forEach(function(r) {
          if (r._selectChk && r._selectChk.checked && r.dataset.toolUrl) {
            urlsToDelete.push(r.dataset.toolUrl);
          }
        });
        if (urlsToDelete.length) {
          historyList = historyList.filter(function(h) {
            return urlsToDelete.indexOf(h.url) === -1;
          });
          localStorage.setItem("bst_history_list", JSON.stringify(historyList));
          updateBadges();
        }
        isActivityMarkMode = false;
        renderPage();
      };
    }
    if (allDelBtn) {
      allDelBtn.onclick = function() {
        if (!historyList.length) { alert("Activity already empty."); return; }
        if (confirm("Delete all activity records?")) {
          historyList = [];
          localStorage.removeItem("bst_history_list");
          updateBadges();
          isActivityMarkMode = false;
          renderPage();
        }
      };
    }
  }

  function renderPage() {
    var filteredItems = getFilteredItems();
    var totalItems = filteredItems.length;
    var totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;

    var startIndex = (currentPage - 1) * itemsPerPage;
    var pageItems = filteredItems.slice(startIndex, startIndex + itemsPerPage);

    /* Hide old activity toolbar – new list has its own buttons */
    if (activityToolbar) activityToolbar.classList.remove("visible");

    if (currentSort === "activity") {
      /* Show full activity list (no card grid) */
      resultsInfo.textContent = "Activity history: " + totalItems + " records";
      renderActivityList(filteredItems);
      if (pagination) pagination.innerHTML = "";
      if (pageInfo) pageInfo.textContent = "";
      if (inlineLoader) inlineLoader.classList.remove("active");
      return;
    }

    /* Normal card grid */
    if (grid) {
      grid.style.display = "";
      grid.style.gridTemplateColumns = "";
      grid.style.gridTemplateRows = "";
      grid.innerHTML = "";
    }
    if (inlineLoader) inlineLoader.classList.remove("active");
    if (pageItems.length === 0) {
      var empty = document.createElement("div");
      empty.className = "bst-empty";
      empty.textContent = "No tools found. Try another search.";
      grid.appendChild(empty);
    } else {
      pageItems.forEach(function (item, idx) {
        grid.appendChild(createCard(item, "home", startIndex + idx));
      });
    }

    var firstItem = totalItems === 0 ? 0 : startIndex + 1;
    var lastItem = Math.min(startIndex + itemsPerPage, totalItems);
    resultsInfo.textContent = "Showing " + firstItem + "–" + lastItem + " of " + totalItems + " tools";
    renderPagination(totalPages);
    pageInfo.textContent = "Page " + currentPage + " of " + totalPages;
  }

  function renderSavedView() {
    savedGrid.innerHTML = "";
    var savedEmpty = document.getElementById("saved-empty");
    if (savedTools.length === 0) {
      savedEmpty.style.display = "block";
    } else {
      savedEmpty.style.display = "none";
      savedTools.forEach(function(item, idx) {
        savedGrid.appendChild(createCard(item, 'saved', idx));
      });
    }
  }

  function renderHistoryView() {
    historyListEl.innerHTML = "";
    var historyEmpty = document.getElementById("history-empty");
    if (historyList.length === 0) {
      historyEmpty.style.display = "block";
    } else {
      historyEmpty.style.display = "none";
      historyList.forEach(function(h, index) {
        var itemDiv = document.createElement("div");
        itemDiv.className = "bst-history-item";

        itemDiv.innerHTML = 
          '<div class="bst-history-info">' +
            '<div>' +
              '<div class="bst-history-title-url">' + escapeHTML(h.title) + '</div>' +
              '<a href="' + escapeHTML(h.url) + '" target="_blank" class="bst-history-url" rel="noopener noreferrer">' + escapeHTML(h.url) + '</a>' +
            '</div>' +
            '<div style="text-align:right;">' +
              '<div class="bst-history-meta">' + escapeHTML(h.time) + '</div>' +
              '<div style="font-size:11px; color:var(--orange-light); font-weight:700; margin-top:2px;">Views: ' + (h.viewsCount || 1).toLocaleString() + '</div>' +
            '</div>' +
          '</div>' +
          '<div class="bst-history-buttons-row">' +
            '<button class="bst-slim-btn copy-url" data-url="' + escapeHTML(h.url) + '">Copy URL</button>' +
            '<a href="' + escapeHTML(h.url) + '" target="_blank" class="bst-slim-btn" rel="noopener noreferrer">Open URL</a>' +
            '<button class="bst-slim-btn share-url" data-title="' + escapeHTML(h.title) + '" data-url="' + escapeHTML(h.url) + '">Share</button>' +
            '<button class="bst-slim-btn del del-single" data-index="' + index + '">Delete</button>' +
          '</div>';

        itemDiv.querySelector('.copy-url').addEventListener('click', function() {
          navigator.clipboard.writeText(h.url);
          alert("URL Copied!");
        });

        itemDiv.querySelector('.share-url').addEventListener('click', function() {
          if (navigator.share) {
            navigator.share({ title: h.title, url: h.url }).catch(function(){});
          } else {
            navigator.clipboard.writeText(h.url);
            alert("URL Copied!");
          }
        });

        itemDiv.querySelector('.del-single').addEventListener('click', function() {
          historyList.splice(index, 1);
          localStorage.setItem("bst_history_list", JSON.stringify(historyList));
          updateBadges();
          renderHistoryView();
        });

        historyListEl.appendChild(itemDiv);
      });
    }
  }

  var apkDownloadTimer = null;

  function renderVisitView() {
    try {
      if (typeof window.bstArmBackTrap === "function") window.bstArmBackTrap();
    } catch (err) {}
    var item = currentVisitItem || { title: "Tool", url: "#" };
    var iframe = document.getElementById("visit-iframe");
    var openExt = document.getElementById("visit-open-external");
    var fallback = document.getElementById("visit-iframe-fallback");
    var fallbackOpen = document.getElementById("visit-fallback-open");
    var infoPanel = document.getElementById("visit-info-panel");
    var progOverlay = document.getElementById("visit-progress-overlay");
    var progBar = document.getElementById("visit-progress-bar");
    var progPct = document.getElementById("visit-progress-pct");
    var progLabel = document.getElementById("visit-progress-label");
    var progTrack = document.getElementById("visit-progress-track");
    var url = (item.url && String(item.url).trim()) ? String(item.url).trim() : "";

    if (infoPanel) infoPanel.style.display = "none";
    if (fallback) fallback.style.display = "none";

    // Theme: Dark Mode On → dark progress; Off → white/safe screen
    var isDark = true;
    try {
      // App ka official flag (default dark on unless "false")
      if (typeof isDarkMode === "boolean") {
        isDark = isDarkMode;
      } else {
        isDark = localStorage.getItem("bst_dark_mode") !== "false";
      }
    } catch (eTh) {
      try { isDark = localStorage.getItem("bst_dark_mode") !== "false"; } catch (e2) { isDark = true; }
    }

    if (progOverlay) {
      if (isDark) {
        progOverlay.style.background = "rgba(9,13,22,0.96)";
        if (progLabel) progLabel.style.color = "#ffb347";
        if (progPct) progPct.style.color = "#ffb347";
        if (progTrack) {
          progTrack.style.background = "rgba(255,255,255,0.1)";
          progTrack.style.borderColor = "rgba(255,147,40,0.35)";
        }
      } else {
        progOverlay.style.background = "#ffffff";
        if (progLabel) progLabel.style.color = "#e65100";
        if (progPct) progPct.style.color = "#e65100";
        if (progTrack) {
          progTrack.style.background = "rgba(0,0,0,0.08)";
          progTrack.style.borderColor = "rgba(255,147,40,0.4)";
        }
      }
    }

    if (openExt) {
      if (url && url !== "#") { openExt.href = url; openExt.style.display = ""; }
      else { openExt.href = "#"; openExt.style.display = "none"; }
    }
    if (fallbackOpen) {
      if (url && url !== "#") fallbackOpen.href = url;
      else fallbackOpen.href = "#";
    }

    if (window._visitLoadTimer) { clearTimeout(window._visitLoadTimer); window._visitLoadTimer = null; }
    if (window._visitProgTimer) { clearInterval(window._visitProgTimer); window._visitProgTimer = null; }
    if (window._visitHideTimer) { clearTimeout(window._visitHideTimer); window._visitHideTimer = null; }

    function hideProgress() {
      if (window._visitProgTimer) { clearInterval(window._visitProgTimer); window._visitProgTimer = null; }
      if (window._visitHideTimer) { clearTimeout(window._visitHideTimer); window._visitHideTimer = null; }
      if (progOverlay) progOverlay.style.display = "none";
    }

    function showProgress() {
      if (!progOverlay) return;
      progOverlay.style.display = "flex";
      if (progBar) progBar.style.width = "2%";
      if (progPct) progPct.textContent = "2%";
      var pct = 2;
      // Fast progress – website ke load ke hisaab se, der tak nahi
      window._visitProgTimer = setInterval(function () {
        if (pct >= 88) return;
        var step = pct < 30 ? 5 : (pct < 55 ? 3 : (pct < 75 ? 2 : 1));
        pct = Math.min(88, pct + step);
        if (progBar) progBar.style.width = pct + "%";
        if (progPct) progPct.textContent = pct + "%";
      }, 80);
    }

    // Load complete → 100%, phir ~1s pehle feel: turant 100% + 350ms me hide (site jaldi dikhe)
    function finishProgressThen(cb) {
      if (window._visitProgTimer) { clearInterval(window._visitProgTimer); window._visitProgTimer = null; }
      if (progBar) progBar.style.width = "100%";
      if (progPct) progPct.textContent = "100%";
      // 1 second se pehle hata do – short delay only so % 100 dikhe
      window._visitHideTimer = setTimeout(function () {
        hideProgress();
        if (typeof cb === "function") cb();
      }, 280);
    }

    if (iframe) {
      iframe.onload = null;
      iframe.onerror = null;

      if (url && url !== "#") {
        var loadOk = false;
        showProgress();

        iframe.onload = function () {
          loadOk = true;
          finishProgressThen(function () {
            try {
              var doc = iframe.contentDocument || (iframe.contentWindow && iframe.contentWindow.document);
              if (doc && doc.URL === "about:blank") {
                if (fallback) fallback.style.display = "block";
              }
            } catch (err) {}
          });
        };
        iframe.onerror = function () {
          finishProgressThen(function () {
            if (fallback) fallback.style.display = "block";
          });
        };
        // Light mode: iframe area white so site colors natural
        try {
          iframe.style.background = isDark ? "#0b0f16" : "#ffffff";
        } catch (eBg) {}
        iframe.src = url;

        // Max wait – agar jaldi load ho gaya to onload pe pehle hide
        window._visitLoadTimer = setTimeout(function () {
          if (loadOk) return;
          try {
            var showFb = false;
            try {
              var doc2 = iframe.contentDocument;
              if (doc2 && (!doc2.body || !doc2.body.innerHTML || doc2.URL === "about:blank")) {
                showFb = true;
              }
            } catch (eCross) {
              loadOk = true;
            }
            finishProgressThen(function () {
              if (showFb && fallback) fallback.style.display = "block";
            });
          } catch (e) {
            hideProgress();
          }
        }, 6000);
      } else {
        iframe.src = "about:blank";
        hideProgress();
        if (fallback) fallback.style.display = "block";
      }
    }
    document.title = "Israr Tool Zone App Store";
  }

  function getVisitInfoArticle(item) {
    var name = (item && item.title) ? item.title : "Israr Tool Zone Tool";
    var url = (item && item.url) ? item.url : "";
    return (
      "<p><strong>" + name + "</strong> Israr Tool Zone App Store ke free online tools me se ek hai. Is tool ko aap browser me bilkul free use kar sakte ho — koi signup, login ya payment ki zarurat nahi.</p>" +
      "<p>Israr Tool Zone ka goal simple hai: daily digital kaam (Blogger, SEO, HTML, study, verification, content writing) ke liye useful tools ek clean mobile-first interface me dena. Har tool fast load hota hai, mobile pe smooth chalta hai, aur focus mode me kaam asaan rehta hai.</p>" +
      "<p>Is page se aap tool ka web version dekh rahe ho. <strong>Open Browser</strong> se full site alag tab me khulegi, <strong>URL Copy</strong> se link clipboard pe copy ho jayega, aur <strong>Back</strong> se App Store ke cards pe wapas aa sakte ho.</p>" +
      "<p>Official tools sirf Israr Tool Zone / related pages se use karein taaki safe aur updated features milte rahein. Offline ke liye APK option bhi cards pe available hai jahan link add kiya gaya ho.</p>" +
      (url ? ("<p style=\"margin-top:10px;word-break:break-all;font-size:12px;color:var(--muted);\">Link: " + url + "</p>") : "")
    );
  }

  function renderApkStoreView() {
    // Arm back trap – system Back pe Home (cards)
    try {
      if (typeof window.bstArmBackTrap === "function") window.bstArmBackTrap();
      else if (window.parent && window.parent !== window && typeof window.parent.bstPushAppTrap === "function") {
        window.parent.bstPushAppTrap();
      }
    } catch (err) {}

    var toolNameEl = document.getElementById("apk-store-tool-name");
    var downloadBtn = document.getElementById("apk-download-btn");
    var visitBtn = document.getElementById("apk-visit-btn");
    var shareBtn = document.getElementById("apk-share-btn");
    var item = currentApkItem || { title: "Israr Tool Zone Tool", apkUrl: "#", url: "#" };

    if (toolNameEl) {
      toolNameEl.textContent = item.title || "Israr Tool Zone Tool";
    }

    var apkHref = (item.apkUrl && String(item.apkUrl).trim() && String(item.apkUrl).trim() !== "#")
      ? String(item.apkUrl).trim()
      : "";

    /* Download APK – progress bar 1→99% in 10s, then redirect to apkUrl */
    var progressWrap = document.getElementById("apk-progress-wrap");
    var progressBar = document.getElementById("apk-progress-bar");
    var progressPct = document.getElementById("apk-progress-pct");
    var shortTitle = document.getElementById("apk-short-title");
    if (shortTitle) shortTitle.textContent = (item.title || "This tool") + " APK";

    if (downloadBtn) {
      if (apkDownloadTimer) { clearInterval(apkDownloadTimer); apkDownloadTimer = null; }
      downloadBtn.href = "#";
      downloadBtn.removeAttribute("target");
      downloadBtn.style.opacity = "1";
      downloadBtn.style.pointerEvents = "auto";
      downloadBtn.textContent = "Download APK";
      if (progressWrap) progressWrap.style.display = "none";
      if (progressBar) progressBar.style.width = "1%";
      if (progressPct) progressPct.textContent = "1%";

      downloadBtn.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();
        if (!apkHref) {
          alert("Is tool ka APK link abhi available nahi hai. Jald hi add kiya jayega.");
          return;
        }
        if (apkDownloadTimer) return;

        // Button text stays same – only progress bar runs
        downloadBtn.style.pointerEvents = "none";
        downloadBtn.style.opacity = "0.85";
        if (progressWrap) progressWrap.style.display = "block";

        var pct = 1;
        if (progressBar) progressBar.style.width = "1%";
        if (progressPct) progressPct.textContent = "1%";

        // 10 seconds: 1 → 99 (about every ~101ms)
        apkDownloadTimer = setInterval(function() {
          pct += 1;
          if (pct >= 99) {
            pct = 99;
            if (progressBar) progressBar.style.width = "99%";
            if (progressPct) progressPct.textContent = "99%";
            clearInterval(apkDownloadTimer);
            apkDownloadTimer = null;
            // brief full then redirect
            setTimeout(function() {
              if (progressBar) progressBar.style.width = "100%";
              if (progressPct) progressPct.textContent = "100%";
              window.location.href = apkHref;
            }, 200);
            return;
          }
          if (progressBar) progressBar.style.width = pct + "%";
          if (progressPct) progressPct.textContent = pct + "%";
        }, 100); // ~10s for 1→99
      };
    }

    if (visitBtn) {
      var toolUrl = (item.url && String(item.url).trim()) ? String(item.url).trim() : "#";
      visitBtn.href = toolUrl;
      visitBtn.target = "_blank";
      visitBtn.rel = "noopener noreferrer";
      visitBtn.onclick = function() {
        if (toolUrl && toolUrl !== "#") handleToolClick(item);
      };
    }

    /* Share – system share sheet: APK details + real host page link (not about:srcdoc) */
    if (shareBtn) {
      shareBtn.onclick = function(e) {
        e.preventDefault();
        e.stopPropagation();

        // Real website URL nikaalo (iframe srcdoc me about:srcdoc aata hai, isliye parent/top use karo)
        var pageUrl = "";
        try {
          if (window.top && window.top.location && window.top.location.href && window.top.location.href.indexOf("http") === 0) {
            pageUrl = window.top.location.href.split("?")[0].split("#")[0];
          }
        } catch (err) {}
        if (!pageUrl) {
          try {
            if (window.parent && window.parent.location && window.parent.location.href && window.parent.location.href.indexOf("http") === 0) {
              pageUrl = window.parent.location.href.split("?")[0].split("#")[0];
            }
          } catch (err2) {}
        }
        if (!pageUrl || pageUrl.indexOf("about:") === 0 || pageUrl.indexOf("srcdoc") !== -1) {
          var can = document.querySelector('link[rel="canonical"]');
          if (can && can.href && can.href.indexOf("http") === 0) {
            pageUrl = can.href.split("?")[0].split("#")[0];
          }
        }
        // Last fallback – main site
        if (!pageUrl || pageUrl.indexOf("about:") === 0 || pageUrl.indexOf("srcdoc") !== -1) {
          pageUrl = "https://isrartoolzone.blogspot.com/";
        }

        var toolName = (item.title || "Israr Tool Zone Tool").replace(/&#8211;|&#x2013;|&ndash;|\u2013/gi, "-").replace(/&#8212;|&#x2014;|&mdash;|\u2014/gi, "-");
        // Clean title – koi HTML entity nahi
        var shareTitle = "Israr Tool Zone App Store - " + toolName;

        // Pehle app ki information, niche usi website ka link
        var shareText =
          shareTitle + "\n\n" +
          "Israr Tool Zone App Store se free tools ka official APK download karo.\n" +
          "Offline access, fast performance, home screen icon, secure download.\n" +
          "70+ free tools - Blogger, SEO, HTML, study - bina signup.\n\n" +
          "Tool: " + toolName + "\n\n" +
          "Website Link:\n" + pageUrl;

        function openWhatsApp() {
          window.open("https://wa.me/?text=" + encodeURIComponent(shareText), "_blank");
        }

        // Mobile system share (Android/iOS share sheet)
        if (navigator.share) {
          var data = { title: shareTitle, text: shareText, url: pageUrl };
          var doShare = function(payload) {
            return navigator.share(payload);
          };
          // Prefer canShare when available
          if (navigator.canShare && !navigator.canShare(data)) {
            data = { text: shareText };
          }
          doShare(data).catch(function(err) {
            if (err && err.name === "AbortError") return; // user cancelled
            // second try: text only (some WebViews fail with url+text)
            doShare({ text: shareText }).catch(function() {
              openWhatsApp();
            });
          });
        } else {
          // No Web Share API → WhatsApp direct (no alert popup)
          openWhatsApp();
        }
      };
    }

    document.title = "Israr Tool Zone App Store - " + (item.title || "Free Tools");
  }

  function switchView(viewName, fromPopstate) {
    viewName = viewName || "home";

    /* History FIRST – taaki render error pe bhi Back kaam kare */
    if (!fromPopstate) {
      if (viewName === "apkstore" || viewName === "visit" || viewName === "saved" || viewName === "history" ||
          viewName === "private" || viewName === "lock" || viewName === "category") {
        // Naya page → push (mobile Back se home/cards pe aayega)
        if (currentAppView !== viewName) {
          updateURLState(viewName, true);
        } else {
          updateURLState(viewName, false);
        }
        /* Arm back trap – system Back pe Home (cards) */
        if (viewName === "apkstore" || viewName === "visit") {
          try {
            if (typeof window.bstArmBackTrap === "function") window.bstArmBackTrap();
            else if (window.parent && window.parent !== window && typeof window.parent.bstPushAppTrap === "function") {
              window.parent.bstPushAppTrap();
            }
          } catch (err) {}
        }
      } else {
        // home
        updateURLState("home", false);
        try {
          if (window.parent && window.parent !== window && typeof window.parent.bstClearAppTrap === "function") {
            window.parent.bstClearAppTrap();
          }
        } catch (err) {}
      }
    } else {
      currentAppView = viewName;
    }

    viewHome.classList.remove("active");
    viewSaved.classList.remove("active");
    viewHistory.classList.remove("active");
    viewPrivate.classList.remove("active");
    viewLock.classList.remove("active");
    viewCategory.classList.remove("active");
    if (viewApkStore) viewApkStore.classList.remove("active");
    if (viewVisit) viewVisit.classList.remove("active");

    var vipActions = document.querySelector(".bst-vip-actions");
    var dualBar = document.querySelector(".bst-dual-bar");
    if (viewName === "apkstore" || viewName === "visit") {
      if (vipActions) vipActions.style.display = "none";
      if (dualBar) dualBar.style.display = "none";
    } else {
      if (vipActions) vipActions.style.display = "";
      if (dualBar) dualBar.style.display = "";
    }

    if (mainFooter) mainFooter.style.display = (viewName === "home") ? "block" : "none";

    try {
      if (viewName === "saved") {
        viewSaved.classList.add("active");
        renderSavedView();
      } else if (viewName === "history") {
        viewHistory.classList.add("active");
        renderHistoryView();
      } else if (viewName === "private") {
        viewPrivate.classList.add("active");
        renderPrivateView();
      } else if (viewName === "lock") {
        viewLock.classList.add("active");
        renderLockView();
      } else if (viewName === "category") {
        viewCategory.classList.add("active");
        renderCategoryView();
      } else if (viewName === "apkstore") {
        if (viewApkStore) viewApkStore.classList.add("active");
        renderApkStoreView();
      } else if (viewName === "visit") {
        if (viewVisit) viewVisit.classList.add("active");
        renderVisitView();
      } else {
        viewHome.classList.add("active");
        renderPage();
      }
    } catch (err) {
      console.error("switchView render error:", err);
      viewHome.classList.add("active");
      try { renderPage(); } catch (e2) {}
    }
  }

  /* EVENT LISTENERS */
  document.getElementById("vip-theme-btn").addEventListener("click", function() {
    currentThemeIdx++;
    if (currentThemeIdx > vipThemes.length) currentThemeIdx = 1;
    applyTheme(currentThemeIdx);
  });

  document.getElementById("vip-darkmode-btn").addEventListener("click", function() {
    isDarkMode = !isDarkMode;
    applyDarkMode();
  });

  document.getElementById("vip-saved-btn").addEventListener("click", function() {
    if(drawer.classList.contains("open")) toggleMenu();
    switchView("saved");
  });

  document.getElementById("vip-history-btn").addEventListener("click", function() {
    if(drawer.classList.contains("open")) toggleMenu();
    switchView("history");
  });

  document.getElementById("vip-home-quick-btn").addEventListener("click", function() {
    if(drawer.classList.contains("open")) toggleMenu();
    switchView("home");
  });

  document.getElementById("vip-private-btn").addEventListener("click", function() {
    if(drawer.classList.contains("open")) toggleMenu();
    switchView("private");
  });

  document.getElementById("vip-lock-btn").addEventListener("click", function() {
    if(drawer.classList.contains("open")) toggleMenu();
    switchView("lock");
  });

  document.getElementById("vip-category-btn").addEventListener("click", function() {
    if(drawer.classList.contains("open")) toggleMenu();
    switchView("category");
  });

  document.getElementById("saved-back-btn").addEventListener("click", function() { switchView("home"); });

  var visitBackBtn = document.getElementById("visit-back-btn");
  if (visitBackBtn) visitBackBtn.addEventListener("click", function() {
    try {
      var iframe = document.getElementById("visit-iframe");
      if (iframe) iframe.src = "about:blank";
    } catch (e) {}
    try {
      if (typeof window.bstForceHome === "function") window.bstForceHome();
      else switchView("home");
    } catch (err) {
      switchView("home");
    }
  });

  var visitCopyBtn = document.getElementById("visit-copy-url-btn");
  if (visitCopyBtn) visitCopyBtn.addEventListener("click", function() {
    var item = currentVisitItem || {};
    var url = (item.url && String(item.url).trim()) ? String(item.url).trim() : "";
    if (!url || url === "#") { alert("URL available nahi hai."); return; }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(function() {
        visitCopyBtn.textContent = "Copied!";
        setTimeout(function() { visitCopyBtn.textContent = "URL Copy"; }, 1500);
      }).catch(function() {
        prompt("URL copy karein:", url);
      });
    } else {
      prompt("URL copy karein:", url);
    }
  });

  var visitInfoBtn = document.getElementById("visit-info-btn");
  if (visitInfoBtn) visitInfoBtn.addEventListener("click", function() {
    var panel = document.getElementById("visit-info-panel");
    var body = document.getElementById("visit-info-body");
    var title = document.getElementById("visit-info-title");
    var item = currentVisitItem || { title: "Tool", url: "#" };
    if (!panel) return;
    if (panel.style.display === "block") {
      panel.style.display = "none";
      return;
    }
    if (title) title.textContent = (item.title || "Tool") + " - Info";
    if (body) body.innerHTML = getVisitInfoArticle(item);
    panel.style.display = "block";
    try { panel.scrollIntoView({ behavior: "smooth", block: "nearest" }); } catch (e) {}
  });

  var visitInfoClose = document.getElementById("visit-info-close");
  if (visitInfoClose) visitInfoClose.addEventListener("click", function() {
    var panel = document.getElementById("visit-info-panel");
    if (panel) panel.style.display = "none";
  });
  document.getElementById("history-back-btn").addEventListener("click", function() { switchView("home"); });
  document.getElementById("private-back-btn").addEventListener("click", function() { switchView("home"); });
  document.getElementById("lock-back-btn").addEventListener("click", function() { switchView("home"); });
  document.getElementById("cat-back-btn").addEventListener("click", function() { switchView("home"); });
  var apkStoreBack = document.getElementById("apk-store-back-btn");
  if (apkStoreBack) apkStoreBack.addEventListener("click", function() {
    if (currentAppView === "apkstore") {
      try {
        if (typeof window.bstForceHome === "function") window.bstForceHome();
        else { currentAppView = "home"; switchView("home", true); }
      } catch (err) {
        currentAppView = "home";
        switchView("home", true);
      }
    } else {
      switchView("home");
    }
  });

  document.getElementById("saved-save-btn").addEventListener("click", function() { switchView("home"); });
  document.getElementById("history-home-btn").addEventListener("click", function() { switchView("home"); });

  document.getElementById("menu-home").addEventListener("click", function(e) { e.preventDefault(); toggleMenu(); switchView("home"); });
  document.getElementById("menu-saved").addEventListener("click", function(e) { e.preventDefault(); toggleMenu(); switchView("saved"); });
  document.getElementById("menu-history").addEventListener("click", function(e) { e.preventDefault(); toggleMenu(); switchView("history"); });
  document.getElementById("menu-private").addEventListener("click", function(e) { e.preventDefault(); toggleMenu(); switchView("private"); });
  document.getElementById("menu-lock").addEventListener("click", function(e) { e.preventDefault(); toggleMenu(); switchView("lock"); });
  document.getElementById("menu-category").addEventListener("click", function(e) { e.preventDefault(); toggleMenu(); switchView("category"); });

  document.getElementById("saved-all-del").addEventListener("click", function() {
    if (confirm("Delete all saved tools?")) {
      savedTools = [];
      localStorage.removeItem("bst_saved_tools");
      updateBadges();
      renderSavedView();
    }
  });

  document.getElementById("saved-mark-del").addEventListener("click", function() {
    isSavedMarkDelMode = !isSavedMarkDelMode;
    var btn = document.getElementById("saved-mark-del");
    btn.style.background = isSavedMarkDelMode ? "#319795" : "#e53e3e";
    btn.textContent = isSavedMarkDelMode ? "Confirm Delete" : "Mark Delete";

    if (!isSavedMarkDelMode) {
      var sGrid = document.getElementById("saved-grid");
      if (sGrid) {
        var cards = sGrid.querySelectorAll(".bst-item-container");
        var newSaved = [];
        cards.forEach(function(c, idx) {
          if (c._selectChk && c._selectChk.checked) {
            // deleted
          } else {
            newSaved.push(savedTools[idx]);
          }
        });
        savedTools = newSaved;
        localStorage.setItem("bst_saved_tools", JSON.stringify(savedTools));
        updateBadges();
      }
    }
    renderSavedView();
  });

  document.getElementById("history-clear-all").addEventListener("click", function() {
    if (confirm("Clear all history?")) {
      historyList = [];
      localStorage.removeItem("bst_history_list");
      updateBadges();
      renderHistoryView();
    }
  });

  document.getElementById("history-mark-del").addEventListener("click", function() {
    if(confirm("Delete selected history records?")) {
      historyList = [];
      localStorage.setItem("bst_history_list", JSON.stringify(historyList));
      updateBadges();
      renderHistoryView();
    }
  });

  document.getElementById("private-new-card").addEventListener("click", function() {
    showPrivatePanel("main");
    var form = document.getElementById("private-create-form");
    form.style.display = "block";
    form.scrollIntoView({behavior:"smooth", block:"start"});
    setTimeout(function(){ document.getElementById("p-title").focus({preventScroll:true}); }, 250);
  });
  document.getElementById("p-cancel-btn").addEventListener("click", function() {
    document.getElementById("private-create-form").style.display = "none";
  });
  document.getElementById("private-recovery").addEventListener("click", function() {
    showPrivatePanel("recovery");
    loadPrivateRecoveryGrid();
  });
  document.getElementById("private-activity").addEventListener("click", function() {
    showPrivatePanel("activity");
    renderPrivateActivity();
  });
  document.getElementById("recovery-back").addEventListener("click", function() {
    showPrivatePanel("main");
    loadPrivateCardsGrid();
  });
  document.getElementById("p-save-btn").addEventListener("click", function() {
    var title = document.getElementById("p-title").value.trim();
    var url = document.getElementById("p-url").value.trim();
    var imgUrl = document.getElementById("p-img").value.trim();
    if (!title) { alert("Private Card ka title zaroor dalein."); document.getElementById("p-title").focus(); return; }
    if (!url) { alert("Website domain or URL zaroor dalein (example.com ya https://example.com)."); document.getElementById("p-url").focus(); return; }
    if (!/^https?:\/\//i.test(url)) url = "https://" + url.replace(/^\/+/, "");
    try { var parsed = new URL(url); if (!["http:","https:"].includes(parsed.protocol) || !parsed.hostname || parsed.hostname.indexOf(".") < 0) throw new Error(); url = parsed.href; }
    catch(e) { alert("Valid website domain/URL dalein, jaise example.com ya https://example.com"); document.getElementById("p-url").focus(); return; }
    if (imgUrl) {
      try { var parsedImg = new URL(imgUrl); if (!["http:","https:"].includes(parsedImg.protocol)) throw new Error(); }
      catch(e) { alert("Please enter a valid image URL or leave it blank."); document.getElementById("p-img").focus(); return; }
    }
    var newPrivateCard = {title:title, url:url, imgUrl:imgUrl, views:0, createdAt:new Date().toISOString()};
    privateCards.push(newPrivateCard);
    localStorage.setItem("bst_private_cards", JSON.stringify(privateCards));
    logPrivateActivity("Private card created", newPrivateCard, "Website URL added");
    ["p-title","p-url","p-img"].forEach(function(id){document.getElementById(id).value="";});
    document.getElementById("private-create-form").style.display = "none";
    loadPrivateCardsGrid();
  });

  document.getElementById("private-all-del").addEventListener("click", function() {
    if (confirm("Delete all private cards?")) {
      var now = Date.now();
      privateCards.forEach(function(item){
        var removed = Object.assign({}, item, {deletedAt:now});
        privateRecovery.push(removed);
        logPrivateActivity("Card deleted to Recovery", removed, "All Delete");
      });
      localStorage.setItem("bst_private_recovery", JSON.stringify(privateRecovery));
      privateCards = [];
      localStorage.setItem("bst_private_cards", JSON.stringify(privateCards));
      loadPrivateCardsGrid();
    }
  });

  document.getElementById("private-mark-del").addEventListener("click", function() {
    isPrivMarkDelMode = !isPrivMarkDelMode;
    var btn = document.getElementById("private-mark-del");
    btn.textContent = isPrivMarkDelMode ? "Confirm Delete" : "Mark Delete";
    if (!isPrivMarkDelMode) {
      var cards = document.querySelectorAll("#private-grid .bst-item-container");
      var keep = [], now = Date.now();
      cards.forEach(function(c, idx) {
        if (c._selectChk && c._selectChk.checked) {
          var removed = Object.assign({}, privateCards[idx], {deletedAt:now});
          privateRecovery.push(removed);
          logPrivateActivity("Card deleted to Recovery", removed, "Mark Delete");
        } else keep.push(privateCards[idx]);
      });
      privateCards = keep;
      localStorage.setItem("bst_private_cards", JSON.stringify(privateCards));
      localStorage.setItem("bst_private_recovery", JSON.stringify(privateRecovery));
    }
    loadPrivateCardsGrid();
  });

  document.getElementById("recovery-mark").addEventListener("click", function() {
    var cards = document.querySelectorAll("#recovery-grid .bst-item-container");
    var keep = [], restore = [];
    cards.forEach(function(c, idx) {
      if (c._selectChk && c._selectChk.checked) restore.push(privateRecovery[idx]);
      else keep.push(privateRecovery[idx]);
    });
    restore.forEach(function(item){ logPrivateActivity("Card restored", item, "Restored from Recovery"); });
    privateCards = privateCards.concat(restore.map(function(item){ var copy=Object.assign({},item); delete copy.deletedAt; return copy; }));
    privateRecovery = keep;
    localStorage.setItem("bst_private_cards", JSON.stringify(privateCards));
    localStorage.setItem("bst_private_recovery", JSON.stringify(privateRecovery));
    loadPrivateRecoveryGrid();
  });
  document.getElementById("recovery-all").addEventListener("click", function() {
    if (!privateRecovery.length) return;
    privateRecovery.forEach(function(item){ logPrivateActivity("Card restored", item, "All Recover"); });
    privateCards = privateCards.concat(privateRecovery.map(function(item){var copy=Object.assign({},item);delete copy.deletedAt;return copy;}));
    privateRecovery = [];
    localStorage.setItem("bst_private_cards", JSON.stringify(privateCards));
    localStorage.setItem("bst_private_recovery", JSON.stringify(privateRecovery));
    loadPrivateRecoveryGrid();
  });
  document.getElementById("recovery-permanent").addEventListener("click", function() {
    if (!confirm("Permanently delete all cards in Recovery?")) return;
    privateRecovery.forEach(function(item){ logPrivateActivity("Permanent delete", item, "Removed from Recovery"); });
    privateRecovery = [];
    localStorage.setItem("bst_private_recovery", JSON.stringify(privateRecovery));
    loadPrivateRecoveryGrid();
  });

  document.getElementById("private-backup").addEventListener("click", function() {
    logPrivateActivity("Private cards backup", {title:"Private Cards"}, "Cards in backup: " + privateCards.length);
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(privateCards));
    var dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", "private_cards_backup.json");
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
  });

  document.getElementById("private-import").addEventListener("click", function() {
    document.getElementById("import-file-input").click();
  });

  document.getElementById("import-file-input").addEventListener("change", function(e) {
    var file = e.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function(evt) {
      try {
        var imported = JSON.parse(evt.target.result);
        if (Array.isArray(imported)) {
          privateCards = privateCards.concat(imported);
          logPrivateActivity("Private cards imported", {title:"Private Cards"}, "Imported cards: " + imported.length);
          localStorage.setItem("bst_private_cards", JSON.stringify(privateCards));
          loadPrivateCardsGrid();
          alert("Private cards imported successfully!");
        } else {
          alert("Invalid backup file format.");
        }
      } catch(err) {
        alert("Error parsing JSON file.");
      }
    };
    reader.readAsText(file);
  });

  searchInput.addEventListener("focus", openSearchHistory);
  searchInput.addEventListener("click", openSearchHistory);
  searchInput.addEventListener("input", function () {
    searchQuery = searchInput.value.trim();
    currentPage = 1;
    updateURLState("home");
    renderPage();
    if (searchHistory.length) openSearchHistory();
  });
  searchInput.addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      saveCurrentSearch();
      searchQuery = searchInput.value.trim();
      currentPage = 1;
      updateURLState("home");
      renderPage();
      closeSearchHistory();
      searchInput.blur();
    } else if (e.key === "Escape") {
      closeSearchHistory();
    }
  });
  if (searchSubmitBtn) searchSubmitBtn.addEventListener("click", function() {
    saveCurrentSearch();
    searchQuery = searchInput.value.trim();
    currentPage = 1;
    updateURLState("home");
    renderPage();
    closeSearchHistory();
    searchInput.blur();
  });
  document.addEventListener("click", function(e) {
    var searchBox = document.getElementById("bst-search-box");
    if (searchBox && !searchBox.contains(e.target)) closeSearchHistory();
  });

  function setSortActive(sortName) {
    [recentBtn, topBtn, rankingBtn, activityBtn].forEach(function(btn) {
      if (btn) btn.classList.remove("active");
    });
    if (sortName === "recent" && recentBtn) recentBtn.classList.add("active");
    if (sortName === "top" && topBtn) topBtn.classList.add("active");
    if (sortName === "ranking" && rankingBtn) rankingBtn.classList.add("active");
    if (sortName === "activity" && activityBtn) activityBtn.classList.add("active");
  }

  recentBtn.addEventListener("click", function () {
    if (currentSort === "recent") return;
    triggerLoadingAndChangeAction(function() {
      currentSort = "recent";
      setSortActive("recent");
      currentPage = 1;
    });
  });

  topBtn.addEventListener("click", function () {
    if (currentSort === "top") return;
    triggerLoadingAndChangeAction(function() {
      currentSort = "top";
      setSortActive("top");
      currentPage = 1;
    });
  });

  if (rankingBtn) rankingBtn.addEventListener("click", function () {
    if (currentSort === "ranking") return;
    triggerLoadingAndChangeAction(function() {
      currentSort = "ranking";
      setSortActive("ranking");
      currentPage = 1;
    });
  });

  if (activityBtn) activityBtn.addEventListener("click", function () {
    if (currentSort === "activity") return;
    triggerLoadingAndChangeAction(function() {
      currentSort = "activity";
      setSortActive("activity");
      currentPage = 1;
    });
  });

  /* Activity Mark / All Delete */
  var activityMarkBtn = document.getElementById("activity-mark-btn");
  var activityAllDelBtn = document.getElementById("activity-all-del-btn");

  if (activityMarkBtn) {
    activityMarkBtn.addEventListener("click", function() {
      if (currentSort !== "activity") return;
      isActivityMarkMode = !isActivityMarkMode;
      if (isActivityMarkMode) {
        activityMarkBtn.textContent = "Confirm Delete";
        activityMarkBtn.style.background = "#e53e3e";
        renderPage();
      } else {
        /* Confirm Delete: remove checked items from historyList */
        var cards = grid.querySelectorAll(".bst-item-container");
        var urlsToDelete = [];
        cards.forEach(function(c) {
          if (c._selectChk && c._selectChk.checked && c.dataset.toolUrl) {
            urlsToDelete.push(c.dataset.toolUrl);
          }
        });
        if (urlsToDelete.length) {
          historyList = historyList.filter(function(h) {
            return urlsToDelete.indexOf(h.url) === -1;
          });
          localStorage.setItem("bst_history_list", JSON.stringify(historyList));
          updateBadges();
        }
        activityMarkBtn.textContent = "Mark";
        activityMarkBtn.style.background = "#319795";
        renderPage();
      }
    });
  }

  if (activityAllDelBtn) {
    activityAllDelBtn.addEventListener("click", function() {
      if (currentSort !== "activity") return;
      if (!historyList.length) { alert("Activity already empty."); return; }
      if (confirm("Delete all activity records?")) {
        historyList = [];
        localStorage.removeItem("bst_history_list");
        updateBadges();
        isActivityMarkMode = false;
        if (activityMarkBtn) {
          activityMarkBtn.textContent = "Mark";
          activityMarkBtn.style.background = "#319795";
        }
        renderPage();
      }
    });
  }

  /* INIT INITIALIZATION */
  if (!['home','saved','history','private','lock','category','apkstore','visit'].includes(initialView)) initialView = 'home';
  if (initialSearch) { searchQuery = initialSearch; searchInput.value = initialSearch; }
  applyDarkMode();
  applyTheme(currentThemeIdx);
  updateBadges();
  // Home state seed – APK open hone pe iske upar push hoga
  try {
    window.history.replaceState({ view: "home", bstApp: true }, "", buildAppUrl("home"));
  } catch (e) {}
  currentAppView = "home";
  if (initialView && initialView !== "home") {
    switchView(initialView);
  } else {
    switchView("home", true);
    try { renderPage(); } catch (e) {}
  }

  /* ===== Strong Back Trap: 1 entry only. Home pe Back = turant site se bahar ===== */
  var bstIframeTrapOn = false;

  window.bstDisarmBackTrap = function () {
    bstIframeTrapOn = false;
    try {
      if (window.parent && window.parent !== window && typeof window.parent.bstClearAppTrap === "function") {
        window.parent.bstClearAppTrap();
      }
    } catch (e) {}
    // Hash hatao bina extra history entry ke
    try {
      var tw = window.top || window.parent;
      if (tw && tw.location && String(tw.location.hash || "") === "#apk") {
        var clean = tw.location.pathname + (tw.location.search || "");
        tw.history.replaceState({ view: "home", bstApp: true }, "", clean);
      }
    } catch (e2) {}
  };

  window.bstForceHome = function () {
    try {
      try {
        var iframe = document.getElementById("visit-iframe");
        if (iframe) iframe.src = "about:blank";
      } catch (e0) {}
      window.bstDisarmBackTrap();
      currentAppView = "home";
      switchView("home", true);
    } catch (err) {
      try { console.error("bstForceHome error", err); } catch (_) {}
    }
  };

  window.addEventListener("message", function (e) {
    if (!e.data || e.data.type !== "bst-go-home") return;
    window.bstForceHome();
  });

  /* Sirf EK history entry – double push nahi */
  window.bstArmBackTrap = function () {
    if (bstIframeTrapOn) return;
    bstIframeTrapOn = true;
    try {
      var tw = window.top || window.parent;
      if (tw && tw.history) {
        // Agar pehle se #apk hai to naya push mat karo
        if (String(tw.location.hash || "") === "#apk") return;
        var base = tw.location.pathname + (tw.location.search || "");
        tw.history.pushState({ bstAppTrap: true, bstView: "sub" }, "", base + "#apk");
      }
    } catch (e2) {}
    // Parent flag only (extra push nahi)
    try {
      if (window.parent && window.parent !== window && typeof window.parent.bstPushAppTrap === "function") {
        // parent may push - but parent fn is once-only via bstTrapActive
        window.parent.bstPushAppTrap();
      }
    } catch (e1) {}
  };

  try {
    var twListen = window.top || window.parent;
    if (twListen && twListen !== window && !twListen._bstApkTrapBound) {
      twListen._bstApkTrapBound = true;
      twListen.addEventListener("popstate", function (e) {
        var onSub = (currentAppView === "apkstore" || currentAppView === "visit");
        var isTrap = (e.state && e.state.bstAppTrap) || (bstIframeTrapOn && onSub);
        if (isTrap || (onSub && bstIframeTrapOn)) {
          try {
            if (typeof window.bstForceHome === "function") window.bstForceHome();
          } catch (err) {}
        }
      });
    }
  } catch (eListen) {}

})();
