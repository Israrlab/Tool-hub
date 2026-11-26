
(function () {
  "use strict";

  /* STATE STORAGE */
  var historyList = JSON.parse(localStorage.getItem("bst_history_list") || "[]");

  var searchHistory = [];
  try { searchHistory = JSON.parse(localStorage.getItem("bst_search_history_v1") || "[]"); } catch (e) { searchHistory = []; }
  if (!Array.isArray(searchHistory)) searchHistory = [];
  searchHistory = searchHistory.filter(function(word){ return typeof word === "string" && word.trim(); }).slice(0, 200);

  /* URL & View State Manager */
  var urlParams = new URLSearchParams(window.location.search);
  var savedViewState = {};
  try { savedViewState = JSON.parse(sessionStorage.getItem("bst_current_view_state") || "{}"); } catch (_) {}
  var initialPage = parseInt(urlParams.get("page") || savedViewState.page, 10) || 1;
  var initialSearch = urlParams.get("q") || savedViewState.q || "";

  /* TOOLS CARD DATA:
     url    -> Visit button par click karne se direct yeh website khulegi
     apkUrl -> APK button par click karne se direct yeh APK link download/open hoga
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

  /* LIVE COUNTERS: New User and Active User fluctuate; Today Views stay fixed. */
  originalItems.forEach(function(item) {
    var seedText = String(item.url || item.title || "card");
    var seed = seedText.split("").reduce(function(sum, ch) { return (sum * 31 + ch.charCodeAt(0)) >>> 0; }, 7);
    if (typeof item.newUsers !== "number") item.newUsers = 15000 + (seed % 24000);
    if (typeof item.active !== "number") item.active = 2500 + (seed % 8500);
    if (typeof item.todayViews !== "number") item.todayViews = 15000 + (seed % 65000);
  });

  setInterval(function() {
    originalItems.forEach(function(item) {
      item.newUsers = Math.max(0, item.newUsers + (Math.floor(Math.random() * 15) - 7));
      item.active = Math.max(0, Math.min(15000, item.active + (Math.floor(Math.random() * 21) - 10)));
    });
    document.querySelectorAll('.bst-item-container').forEach(function(card) {
      var newValEl = card.querySelector('.new-user-val');
      var activeValEl = card.querySelector('.active-val');
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
  var searchInput = document.getElementById("bst-search");
  var resultsInfo = document.getElementById("bst-results-info");
  var pagination = document.getElementById("bst-pagination-buttons");
  var pageInfo = document.getElementById("bst-page-info");
  var recentBtn = document.getElementById("bst-recent-btn");
  var topBtn = document.getElementById("bst-top-btn");
  var rankingBtn = document.getElementById("bst-ranking-btn");
  var activityBtn = document.getElementById("bst-activity-btn");
  var isActivityMarkMode = false;
  var inlineLoader = document.getElementById("bst-inline-loader");
  var searchHistoryPopup = document.getElementById("bst-search-history-popup");
  var searchSubmitBtn = document.getElementById("bst-search-submit");

  var itemsPerPage = 4;
  var currentPage = initialPage;
  var currentSort = "recent";
  var searchQuery = initialSearch;

  if (searchQuery) searchInput.value = searchQuery;

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
        updateURLState();
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
    var regex = new RegExp("(" + escapedQuery.replace(/[-\[\]{}()*+?.,\\^$|#\s]/g, "\\$&") + ")", "gi");
    return escapedText.replace(regex, '<span class="bst-highlight">$1</span>');
  }

  function getWebsiteScreenshot(url) {
    return "https://s.wordpress.com/mshots/v1/" + encodeURIComponent(url) + "?w=600";
  }

  function getFilteredItems() {
    var query = searchQuery.toLowerCase();

    /* ACTIVITY: show tools user clicked / visited */
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
      /* TOP: sort by highest Today Views + Total Views */
      filtered.sort(function(a, b) {
        var topA = (Number(a.todayViews) || 0) + (Number(a.views) || 0);
        var topB = (Number(b.todayViews) || 0) + (Number(b.views) || 0);
        return topB - topA;
      });
    } else if (currentSort === "ranking") {
      /* RANKING: sort by highest Active Users + New Users + Online score */
      filtered.sort(function(a, b) {
        var scoreA = (Number(a.active) || 0) * 4 + (Number(a.newUsers) || 0) * 0.5 + (Number(a.online) || 0);
        var scoreB = (Number(b.active) || 0) * 4 + (Number(b.newUsers) || 0) * 0.5 + (Number(b.online) || 0);
        return scoreB - scoreA;
      });
    }
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
    }

    historyList.unshift({
      title: item.title,
      url: item.url,
      time: dateStr,
      viewsCount: currentViews
    });

    if (historyList.length > 200) historyList.pop();
    localStorage.setItem("bst_history_list", JSON.stringify(historyList));
  }

  function triggerDirectApkDownload(apkHref, title) {
    try {
      var a = document.createElement("a");
      a.href = apkHref;
      var cleanName = String(title || "app").replace(/[^a-zA-Z0-9._-]+/g, "_").replace(/^_+|_+$/g, "");
      if (!/\.apk(\?|$)/i.test(apkHref)) {
        a.setAttribute("download", (cleanName || "IsrarToolZone") + ".apk");
      } else {
        a.setAttribute("download", "");
      }
      a.rel = "noopener noreferrer";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      window.location.href = apkHref;
    }
  }

  function createCard(item) {
    var card = document.createElement("article");
    card.className = "bst-item-container";
    card.dataset.toolUrl = item.url || "";

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

    img.onload = function () {
      loading.style.display = "none";
    };
    img.onerror = function () {
      img.style.display = "none";
      loading.textContent = "Image preview unavailable";
      loading.style.display = "flex";
    };

    imageWrapper.appendChild(loading);
    imageWrapper.appendChild(img);

    var content = document.createElement("div");
    content.className = "bst-item-content";

    var title = document.createElement("h3");
    title.className = "bst-item-title";
    title.innerHTML = highlightText(item.title || "Tool", searchQuery);

    content.appendChild(title);

    var statsDiv = document.createElement("div");
    statsDiv.className = "bst-card-stats";

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

    /* VISIT BUTTON: Direct website open in new tab (no in-app page / no article) */
    var siteUrl = (item.url && String(item.url).trim()) ? String(item.url).trim() : "#";
    var link = document.createElement("a");
    link.className = "bst-image-title-overlay";
    link.href = siteUrl;
    if (siteUrl && siteUrl !== "#") {
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    }
    link.textContent = "Visit " + String.fromCharCode(8599);

    link.addEventListener("click", function(e) {
      handleToolClick(item);
      if (!siteUrl || siteUrl === "#") {
        e.preventDefault();
        alert("Website link abhi available nahi hai.");
      }
    });

    /* APK BUTTON: Direct APK download using the card's apkUrl (no extra page) */
    var apkHref = (item.apkUrl && String(item.apkUrl).trim() && String(item.apkUrl).trim() !== "#")
      ? String(item.apkUrl).trim()
      : "";

    var apkLink = document.createElement("a");
    apkLink.className = "bst-apk-btn";
    apkLink.href = apkHref || "#";
    apkLink.textContent = "APK";
    apkLink.addEventListener("click", function(e) {
      e.preventDefault();
      e.stopPropagation();
      handleToolClick(item);
      if (!apkHref) {
        alert("Is tool ka APK link abhi available nahi hai. Jald hi add kiya jayega.");
        return;
      }
      triggerDirectApkDownload(apkHref, item.title);
    });

    actionRow.appendChild(link);
    actionRow.appendChild(apkLink);

    content.appendChild(statsDiv);
    content.appendChild(actionRow);

    card.appendChild(imageWrapper);
    card.appendChild(content);

    return card;
  }

  /* SMART SINGLE-LINE FULL PAGINATION (Prev | 1 2 3 4 5 6 7 | Next - sliding window) */
  function renderPagination(totalPages) {
    if (!pagination) return;
    pagination.innerHTML = "";
    pagination.style.flexWrap = "nowrap";
    pagination.style.gap = "4px";
    pagination.style.width = "100%";

    var previous = document.createElement("button");
    previous.type = "button";
    previous.textContent = "Prev";
    previous.className = "bst-pag-nav";
    previous.disabled = currentPage <= 1;

    previous.addEventListener("click", function () {
      if (currentPage > 1) {
        triggerLoadingAndChangeAction(function() { currentPage--; });
      }
    });
    pagination.appendChild(previous);

    var visibleCount = 7;
    var startPage = 1;
    if (totalPages <= visibleCount) {
      startPage = 1;
    } else if (currentPage <= 4) {
      startPage = 1;
    } else if (currentPage >= totalPages - 3) {
      startPage = Math.max(1, totalPages - visibleCount + 1);
    } else {
      startPage = currentPage - 3;
    }
    var endPage = Math.min(totalPages, startPage + visibleCount - 1);

    for (var i = startPage; i <= endPage; i++) {
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
    next.className = "bst-pag-nav";
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
        updateURLState();
        renderPage();
      } catch (err) {
        try { renderPage(); } catch (e2) {}
      } finally {
        if (inlineLoader) inlineLoader.classList.remove("active");
      }
    }, 450);
  }

  function buildAppUrl() {
    var newUrl = window.location.pathname + "?page=" + (currentPage || 1);
    if (currentSort && currentSort !== "recent") newUrl += "&tab=" + encodeURIComponent(currentSort);
    if (searchQuery) newUrl += "&q=" + encodeURIComponent(searchQuery);
    return newUrl;
  }

  function updateURLState() {
    var newUrl = buildAppUrl();
    try { sessionStorage.setItem("bst_current_view_state", JSON.stringify({ page: currentPage, tab: currentSort, q: searchQuery || "" })); } catch (_) {}
    try { window.history.replaceState({ bstApp: true }, "", newUrl); } catch (err) {}
  }

  /* ACTIVITY LIST VIEW (Under Activity Tab) */
  function renderActivityList(items) {
    grid.innerHTML = "";
    grid.style.display = "block";
    grid.style.gridTemplateColumns = "none";

    var wrap = document.createElement("div");
    wrap.className = "bst-activity-panel";
    wrap.style.cssText = "border:1px solid var(--border);border-radius:14px;padding:14px 12px;background:var(--card-bg);box-shadow:0 4px 14px rgba(0,0,0,0.22);";

    var title = document.createElement("h3");
    title.textContent = "Recent Activity";
    title.style.cssText = "margin:0 0 4px;font-size:16px;font-weight:800;color:var(--text);";
    wrap.appendChild(title);

    var sub = document.createElement("p");
    sub.id = "activity-history-label";
    sub.textContent = "Activity history: " + items.length + " records";
    sub.style.cssText = "margin:0 0 12px;font-size:12px;color:var(--muted);";
    wrap.appendChild(sub);

    var actions = document.createElement("div");
    actions.style.cssText = "display:flex;gap:8px;margin-bottom:12px;width:100%;";
    var markLabel = isActivityMarkMode ? "Confirm Delete" : "Mark";
    var markBg = isActivityMarkMode ? "#e53e3e" : "linear-gradient(120deg,#ff5e00,#ffad33)";
    actions.innerHTML =
      '<button type="button" id="activity-list-back" style="flex:1;min-width:0;padding:10px 6px;border:none;border-radius:9px;cursor:pointer;font-size:12px;font-weight:800;color:#fff;background:var(--btn-bg);border:1px solid var(--border);">← Back</button>' +
      '<button type="button" id="activity-list-mark" style="flex:1;min-width:0;padding:10px 6px;border:none;border-radius:9px;cursor:pointer;font-size:12px;font-weight:800;color:#fff;background:' + markBg + ';">' + markLabel + '</button>' +
      '<button type="button" id="activity-list-alldel" style="flex:1;min-width:0;padding:10px 6px;border:none;border-radius:9px;cursor:pointer;font-size:12px;font-weight:800;color:#fff;background:linear-gradient(120deg,#e53e3e,#c53030);">All Delete</button>';
    wrap.appendChild(actions);

    var list = document.createElement("div");
    list.style.cssText = "display:flex;flex-direction:column;gap:8px;max-height:340px;overflow-y:auto;padding-right:4px;overscroll-behavior:contain;";

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
        nameEl.addEventListener("click", function() {
          handleToolClick(item);
        });
        info.appendChild(timeEl);
        info.appendChild(nameEl);
        row.appendChild(info);
        list.appendChild(row);
      });
    }

    wrap.appendChild(list);
    grid.appendChild(wrap);

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

    if (currentSort === "activity") {
      resultsInfo.textContent = "Activity history: " + totalItems + " records";
      renderActivityList(filteredItems);
      if (pagination) pagination.innerHTML = "";
      if (pageInfo) pageInfo.textContent = "";
      if (inlineLoader) inlineLoader.classList.remove("active");
      return;
    }

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
      pageItems.forEach(function (item) {
        grid.appendChild(createCard(item));
      });
    }

    var firstItem = totalItems === 0 ? 0 : startIndex + 1;
    var lastItem = Math.min(startIndex + itemsPerPage, totalItems);
    resultsInfo.textContent = "Showing " + firstItem + "–" + lastItem + " of " + totalItems + " tools";
    renderPagination(totalPages);
    if (pageInfo) pageInfo.textContent = "Page " + currentPage + " of " + totalPages;
  }

  /* SEARCH & SORT LISTENERS */
  searchInput.addEventListener("focus", openSearchHistory);
  searchInput.addEventListener("click", openSearchHistory);
  searchInput.addEventListener("input", function () {
    searchQuery = searchInput.value.trim();
    currentPage = 1;
    updateURLState();
    renderPage();
    if (searchHistory.length) openSearchHistory();
  });
  searchInput.addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      saveCurrentSearch();
      searchQuery = searchInput.value.trim();
      currentPage = 1;
      updateURLState();
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
    updateURLState();
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
    isActivityMarkMode = false;
    triggerLoadingAndChangeAction(function() {
      currentSort = "recent";
      setSortActive("recent");
      currentPage = 1;
    });
  });

  topBtn.addEventListener("click", function () {
    if (currentSort === "top") return;
    isActivityMarkMode = false;
    triggerLoadingAndChangeAction(function() {
      currentSort = "top";
      setSortActive("top");
      currentPage = 1;
    });
  });

  if (rankingBtn) rankingBtn.addEventListener("click", function () {
    if (currentSort === "ranking") return;
    isActivityMarkMode = false;
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

  /* INITIAL RENDER */
  updateURLState();
  renderPage();
})();
</script>
<script>
setTimeout(function(){
  var A=String.fromCharCode(38);
  var H=String.fromCharCode(35);
  var S=String.fromCharCode(59);
  function fix(n){
    if(n.nodeType===3){
      if(n.nodeValue.indexOf(A)!==-1){
        n.nodeValue=n.nodeValue.replace(new RegExp(A+'amp;'+H+'([0-9]+)'+S,'g'),function(m,c){return String.fromCharCode(c);}).replace(new RegExp(A+H+'([0-9]+)'+S,'g'),function(m,c){return String.fromCharCode(c);});
      }
    }else{for(var i=0;i<n.childNodes.length;i++){fix(n.childNodes[i]);}}
  }
  fix(document.body);
  setInterval(function(){fix(document.body);},800);
},500);
