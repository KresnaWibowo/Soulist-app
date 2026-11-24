/* ==========================================================================
   Soulis — Desktop Web App (Auth + Multi-Layer Mood + 7-Day Journal + Stress Articles)
   Pure Vanilla ES6+ | Multi-Account LocalStorage | GitHub Pages Ready
   ========================================================================== */

(() => {
  "use strict";

  const ACCOUNTS_KEY = "soulis_accounts_v1";
  const SESSION_KEY = "soulis_session_v1";

  /* -------------------- DOMAIN DATA -------------------- */
  const EMOTIONS = {
    Joy: {
      gradient: "radial-gradient(circle at 38% 35%, #F59E0B, #FDE047 54%, #FDBA74 90%)",
      color: "#F59E0B",
      sub: [
        { word: "sunlit", desc: "warmth from within" },
        { word: "grateful", desc: "appreciating what is here" },
        { word: "hopeful", desc: "leaning gently forward" },
        { word: "playful", desc: "light on your feet" },
        { word: "inspired", desc: "bright spark moving" },
        { word: "content", desc: "enough for right now" }
      ]
    },
    Calm: {
      gradient: "radial-gradient(circle at 38% 35%, #0D9488, #5EEAD4 54%, #99F6E4 90%)",
      color: "#10B981",
      sub: [
        { word: "grounded", desc: "held by steady ground" },
        { word: "peaceful", desc: "quiet without effort" },
        { word: "unhurried", desc: "room to breathe" },
        { word: "clear", desc: "fog has lifted" },
        { word: "soft", desc: "shoulders dropped down" },
        { word: "relieved", desc: "weight set aside" }
      ]
    },
    Anxiety: {
      gradient: "radial-gradient(circle at 38% 35%, #EC4899, #F9A8D4 52%, #FDE68A 90%)",
      color: "#EC4899",
      sub: [
        { word: "uneasy", desc: "something feels off" },
        { word: "restless", desc: "can't settle down" },
        { word: "nervous", desc: "on alert" },
        { word: "tense", desc: "wound tight inside" },
        { word: "on edge", desc: "one push too many" },
        { word: "panicky", desc: "alarm is loud" }
      ]
    },
    Sadness: {
      gradient: "radial-gradient(circle at 38% 35%, #6366F1, #93C5FD 56%, #FBCFE8 90%)",
      color: "#6366F1",
      sub: [
        { word: "tender", desc: "easily bruised today" },
        { word: "drained", desc: "quietly empty" },
        { word: "lonely", desc: "missing warmth near" },
        { word: "heavy-hearted", desc: "carrying an ache" },
        { word: "blue", desc: "gentle lingering rain" },
        { word: "numb", desc: "muted far away" }
      ]
    },
    Anger: {
      gradient: "radial-gradient(circle at 38% 35%, #E11D48, #FB7185 52%, #FCD34D 90%)",
      color: "#E11D48",
      sub: [
        { word: "annoyed", desc: "small things scratch" },
        { word: "peeved", desc: "a quiet «not okay»" },
        { word: "mad", desc: "done with this" },
        { word: "resentful", desc: "it keeps replaying" },
        { word: "furious", desc: "losing temper" },
        { word: "enraged", desc: "barely contained" }
      ]
    }
  };

  const BODY_SENSATIONS = [
    { name: "Live", icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 2c2 3.5 5 6 5 10a5 5 0 1 1-10 0c0-2.2 1-4.3 2.5-6 .3 1.7 1.2 2.6 2.5 3-1-2.5-.8-4.8 0-7z"/></svg>` },
    { name: "Heavy", icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M9 7a3 3 0 0 1 6 0"/><path d="M6 10h12l1.5 9h-15L6 10z"/></svg>` },
    { name: "Tight", icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 18l4-10 4 5 4-6 4 11H4z"/></svg>` },
    { name: "Foggy", icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M7 15h10a3.5 3.5 0 0 0 .5-6.95A4.5 4.5 0 0 0 8.6 7.6 3.5 3.5 0 0 0 7 15z"/><path d="M6 19h12"/></svg>` },
    { name: "Warm", icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="4"/><path d="M12 3v2M12 19v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M3 12h2M19 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>` },
    { name: "Light", icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M19 5c-7 0-12 4-13 13 9-1 13-6 13-13z"/><path d="M6 18c2-3 5-5 8-7"/></svg>` },
    { name: "Quiet inside", icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M8 7c-2.5 2.5-2.5 7.5 0 10M16 7c2.5 2.5 2.5 7.5 0 10"/></svg>` },
    { name: "Hard to tell", icon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-dasharray="2.5 2.5"><rect x="5" y="5" width="14" height="14" rx="3"/></svg>` }
  ];

  const DEFAULT_INFLUENCES = [
    "Work", "Partner", "Kids", "Health", "Cycle",
    "Sleep", "Money", "Friends", "News", "Parents & family"
  ];

  const MEDITATION_SOUNDS = [
    {
      id: "forest-rain",
      type: "Nature Soundscape",
      title: "Forest Rain & Stream",
      desc: "Soft woodland rainfall drifting over smooth stones—ideal for calming overthinking.",
      duration: 600,
      mode: "rain"
    },
    {
      id: "yoga-bowl",
      type: "Yoga • 432Hz Resonance",
      title: "Yoga Singing Bowl",
      desc: "Warm golden harmonic bowls gently pulsing in breathing tempo for yoga or stretching.",
      duration: 600,
      mode: "bowl"
    },
    {
      id: "ocean-tide",
      type: "Nature Soundscape",
      title: "Ocean Tide",
      desc: "Slow coastal swells rolling softly onto shore in a calm nine-second wave cadence.",
      duration: 600,
      mode: "ocean"
    },
    {
      id: "night-wind",
      type: "Nature & Yoga Chimes",
      title: "Evening Breeze & Chimes",
      desc: "Quiet dusk wind through tall pines accompanied by sparse pentatonic wind chimes.",
      duration: 480,
      mode: "wind"
    }
  ];

  const JOURNAL_PROMPTS = {
    1: { title: "What are you grateful for today?", sub: "Notice one quiet detail—a warm meal, someone's patience, or making it through today." },
    2: { title: "What softened your day even a little?", sub: "Recall a tiny pause, light through a window, or a moment you felt understood." },
    3: { title: "Who or what supported you today?", sub: "It can be a friend, your own persistence, or simply resting when you needed to." },
    4: { title: "What is one small win you want to keep?", sub: "No victory is too quiet to acknowledge before tonight settles in." },
    5: { title: "What does your body thank you for today?", sub: "Stretching, drinking water, stepping outside, or taking a deep breath." },
    6: { title: "What brought a sense of warmth this week?", sub: "Look back gently at anything that made your shoulders drop." },
    7: { title: "What are you grateful to carry into next week?", sub: "Close this 7-day circle with one honest sentence of appreciation." }
  };

  /* Complete Articles from Stress Report Document */
  const ARTICLES = {
    prism: {
      meta: "ARTIKEL 1 • 7 MENIT BACA • 18 NOVEMBER 2026",
      title: "Inside Your Stress PRISM: Lima Dimensi Tenang yang Membentuk Penumpukan Emosi",
      html: `
        <p><strong>Rabu, 18 November 2026</strong> — Kelelahan sehari-hari jarang datang dari satu kejadian. Ia menumpuk pelan selama berminggu-minggu. Data global terbaru menunjukkan pola itu terjadi pada skala besar. Laporan <em>State of the Global Workplace 2026</em> dari Gallup, yang terbit April 2026 dengan data tahun 2025, mencatat sekitar <strong>40 persen</strong> pekerja di dunia mengalami stres berat pada hari sebelumnya. Survei ini melibatkan 263.810 responden di 160 negara.</p>
        <p>Angka itu mengundang pertanyaan baru: bukan hanya <em>seberapa</em> stres, tetapi <em>dari mana</em> stres itu berasal. Kerangka <strong>Stress PRISM</strong> mengajak kita mengamati lima dimensi: <em>Perspective, Regulation, Identity, Somatics</em>, dan <em>Meaning</em>.</p>

        <h3>1. Perspective: Memperlebar Sudut Pandang</h3>
        <p>Melihat dari jarak yang lebih jauh membuat urgensi terasa lebih ringan. Gallup melacak stres harian pekerja sejak 2009. Angkanya sekitar 31 persen pada 2009, memuncak di 44 persen pada 2021 dan 2022, lalu turun menjadi 40 persen pada 2024 dan 2025. Satu tahun yang berat ternyata hanyalah satu titik dalam kurva panjang yang bergerak naik-turun. Meski membaik dari puncaknya, angka tersebut masih di atas level sebelum pandemi.</p>
        <p>Perspektif juga mengubah cara kita membaca hari yang buruk. Satu sore yang melelahkan terlihat berbeda ketika ditaruh di samping tiga puluh hari pemulihan yang lambat tetapi nyata.</p>

        <h3>2. Regulation: Atur Tubuh Dulu, Baru Pikiran</h3>
        <p>Sebelum menyelesaikan masalah hidup di kepala, panjangkan satu embusan napas. Pengaturan dasar seperti tidur dan energi menentukan seberapa luas "ruang emosi" yang kita punya.</p>
        <p>Di Indonesia, tidur menjadi sorotan. Laporan Jakpat 2024 terhadap 1.155 responden Gen Z menemukan <strong>54 persen</strong> mengalami gangguan tidur dalam enam bulan terakhir. Survei <em>Asia Pacific Wellness Culture 2026</em> yang dirilis Herbalife Indonesia pada Oktober 2026 menunjukkan kualitas tidur menjadi aspek yang paling ingin diperbaiki oleh Gen Z Indonesia, dipilih <strong>52 persen</strong> responden.</p>

        <h3>3. Identity, Somatics &amp; Meaning: Mendengar Tubuh, Menamai Diri, Menemukan Arti</h3>
        <p><strong>Somatics.</strong> Rasa <em>tegang</em> atau <em>berkabut</em> di tubuh adalah cara sistem saraf berbicara jujur. Menamai sensasi itu dengan satu kata sederhana dapat membantu menurunkan rasa kewalahan.</p>
        <p><strong>Identity.</strong> Ketika identitas melekat pada produktivitas, tekanan terasa personal. Survei <em>Muda Bicara ID</em> kuartal I 2026 (800 responden usia 17–40 tahun, Maret 2026) mencatat <strong>61,9 persen</strong> anak muda menilai tekanan ekonomi dan kekhawatiran masa depan sebagai tantangan terbesar kesehatan mental mereka.</p>
        <p><strong>Meaning.</strong> Stres tinggi tidak selalu berarti pekerjaan tidak bermakna. Gallup menemukan pekerja Filipina melaporkan stres tertinggi di Asia Tenggara, yakni 50 persen, dua kali rata-rata kawasan yang 25 persen. Di sisi lain, mereka juga termasuk yang paling terikat secara psikologis pada pekerjaannya. Komitmen dan ketegangan bisa hadir bersamaan.</p>
        <p>Di Indonesia, Menteri Kesehatan Budi Gunadi Sadikin pada 17 Juni 2026 di Indonesia Summit mengakui kesehatan mental <em>"under-detected"</em> dan <em>"underserved"</em>. Ia mengajak Gen Z memanfaatkan program cek kesehatan gratis yang menyertakan skrining kesehatan jiwa. Menurutnya, satu dari delapan orang berpotensi mengalami gangguan mental.</p>
        <p><em>Catatan: PRISM adalah alat refleksi diri, bukan alat diagnosis. Jika stres berlangsung lama atau mengganggu fungsi sehari-hari, bicarakan dengan psikolog atau tenaga kesehatan.</em></p>

        <div class="article-source-box">
          <strong>Sumber data:</strong> Gallup <em>State of the Global Workplace 2026</em>; Muda Bicara ID Q1 2026; Jakpat (2024 dan Februari 2026); Herbalife Indonesia <em>Asia Pacific Wellness Culture Survey 2026</em> (via Antara, 5 Oktober 2026); IDN Times (17 Juni 2026).
        </div>`
    },
    ally: {
      meta: "ARTIKEL 2 • 7 MENIT BACA • 18 NOVEMBER 2026",
      title: "Understanding Stress: Your Ally or Burden? Ketika Kewaspadaan Dianggap Kelemahan",
      html: `
        <p><strong>Rabu, 18 November 2026</strong> — Stres menjadi berat ketika kita memperlakukan kewaspadaan sebagai cacat. Rasa gelisah dan tegang sering kali justru sinyal bahwa sesuatu yang bermakna terasa belum berpijak. Pertanyaannya: kapan stres menjadi sekutu, dan kapan ia menjadi beban?</p>

        <h3>Sinyal yang Makin Sulit Diabaikan</h3>
        <p>Gallup mencatat bahwa <strong>40 persen</strong> pekerja global mengalami stres besar dalam sehari, sementara keterlibatan kerja turun ke <strong>20 persen</strong>, level terendah sejak 2020. Gallup memperkirakan kerugian produktivitas global sekitar 10 triliun dolar AS, setara 9 persen PDB dunia.</p>
        <p>Beban ini tidak merata. Perempuan melaporkan stres lebih tinggi (43 persen) dibanding laki-laki (39 persen). Pekerja di bawah 35 tahun mencatat 42 persen, dan manajer 45 persen dibanding 39 persen pada kontributor individu. Gallup juga menemukan manajer menyumbang sekitar 70 persen variasi pengalaman kerja harian karyawan. Di Singapura, 43 persen pekerja mengalami stres besar, dan di Inggris 46 persen.</p>

        <h3>Notice the Trigger Loop: Kenali Lingkaran Pemicu</h3>
        <p>Stres yang menumpuk biasanya punya pola. Kecemasan sering memuncak bukan karena kegagalan, melainkan karena malam-malam berturut-turut dengan tidur kurang dari enam jam ditambah tuntutan kerja yang tak berhenti. Melihat kembali <strong>Trigger-to-Mood Correlations</strong> di <em>Soulis Accumulation</em> membantu menemukan lingkaran itu.</p>
        <p>Di Indonesia, pemicunya terlihat jelas dalam data. Jakpat (Februari 2026) menyebut <strong>63 persen</strong> Gen Z menyebut persaingan kerja sebagai tantangan terbesar. Survei IDN Research Institute dalam <em>Indonesia Millennial &amp; Gen Z Report 2025</em> (1.500 responden di 12 kota) mencatat <strong>55 persen</strong> menyebut ketidakstabilan ekonomi sebagai sumber utama kecemasan, 28 persen cemas soal tekanan kerja, dan 22 persen kesulitan mencari kerja.</p>

        <h3>Gentle Calibration: Satu Langkah Kecil ke Bawah</h3>
        <p>Pilih satu langkah kecil hari ini: menjauh dari layar selama empat tarikan napas, atau tulis tiga baris tenang di jurnal syukur sebelum malam tiba.</p>
        <p>Langkah kecil bisa menjadi pintu masuk ke bantuan yang lebih besar. Jakpat mencatat hampir separuh Gen Z dengan gangguan mental memilih mencari bantuan profesional seperti konseling atau terapi. Di sisi lain, survei Digital Resilience Indonesia Foundation (Agustus–Desember 2025, 402 responden) menemukan 59,4 persen Gen Z pernah curhat ke chatbot AI. Pakar mengingatkan risiko privasi dan saran yang tidak setara dengan psikolog berkualifikasi.</p>

        <h3>Jadi, Sekutu atau Beban?</h3>
        <p>Stres yang singkat dan jelas sebabnya dapat menjadi sekutu yang menajamkan fokus. Ia berubah menjadi beban ketika menetap berminggu-minggu, mengganggu tidur, dan tidak lagi mereda setelah pemicunya lewat. Pada titik itu, mencari dukungan profesional adalah langkah yang masuk akal.</p>

        <div class="article-source-box">
          <strong>Sumber data:</strong> Gallup <em>State of the Global Workplace 2026</em>; Muda Bicara ID Q1 2026; Jakpat (2024 dan Februari 2026); Herbalife Indonesia <em>Asia Pacific Wellness Culture Survey 2026</em> (via Antara, 5 Oktober 2026); IDN Research Institute (via Databoks); IDN Times (17 Juni 2026); Digital Resilience Indonesia Foundation (via Asia News Network).
        </div>`
    }
  };

  function buildSeedEntries(includeDemoHistory = true) {
    const base = includeDemoHistory
      ? [
          { dayOffset: 13, energy: 7, sleep: "Slept well", category: "Joy", words: ["grateful", "content"], body: "Warm", influences: ["Friends", "Sleep"] },
          { dayOffset: 12, energy: 6, sleep: "Slept well", category: "Calm", words: ["grounded", "unhurried"], body: "Quiet inside", influences: ["Sleep"] },
          { dayOffset: 11, energy: 4, sleep: "So-so", category: "Anxiety", words: ["uneasy", "tense"], body: "Tight", influences: ["Work"] },
          { dayOffset: 10, energy: 3, sleep: "Barely slept", category: "Anxiety", words: ["restless", "on edge"], body: "Tight", influences: ["Work", "Sleep"] },
          { dayOffset: 9, energy: 5, sleep: "So-so", category: "Sadness", words: ["drained", "tender"], body: "Heavy", influences: ["Work", "Money"] },
          { dayOffset: 8, energy: 6, sleep: "Slept well", category: "Calm", words: ["relieved", "soft"], body: "Light", influences: ["Partner", "Sleep"] },
          { dayOffset: 7, energy: 8, sleep: "Slept well", category: "Joy", words: ["sunlit", "hopeful"], body: "Warm", influences: ["Friends"] },
          { dayOffset: 6, energy: 7, sleep: "Slept well", category: "Calm", words: ["clear", "peaceful"], body: "Quiet inside", influences: ["Health", "Sleep"] },
          { dayOffset: 5, energy: 4, sleep: "Barely slept", category: "Anger", words: ["peeved", "resentful"], body: "Tight", influences: ["Work", "News"] },
          { dayOffset: 4, energy: 5, sleep: "So-so", category: "Anxiety", words: ["nervous", "uneasy"], body: "Foggy", influences: ["Work", "Cycle"] },
          { dayOffset: 3, energy: 6, sleep: "Slept well", category: "Calm", words: ["grounded", "soft"], body: "Warm", influences: ["Partner"] },
          { dayOffset: 2, energy: 7, sleep: "Slept well", category: "Joy", words: ["playful", "grateful"], body: "Light", influences: ["Friends", "Health"] },
          { dayOffset: 1, energy: 4, sleep: "So-so", category: "Sadness", words: ["blue", "drained"], body: "Heavy", influences: ["Parents & family", "Sleep"] },
          { dayOffset: 0, energy: 5, sleep: "So-so", category: "Anxiety", words: ["nervous", "restless", "uneasy"], body: "Tight", influences: ["Work"] }
        ]
      : [
          { dayOffset: 0, energy: 6, sleep: "Slept well", category: "Calm", words: ["grounded", "hopeful"], body: "Warm", influences: ["Sleep"] }
        ];

    const today = new Date();
    today.setHours(17, 30, 0, 0);
    return base.map((item, idx) => {
      const d = new Date(today);
      d.setDate(today.getDate() - item.dayOffset);
      return {
        id: `seed-${idx}`,
        dateISO: d.toISOString(),
        year: d.getFullYear(),
        month: d.getMonth(),
        dayNum: d.getDate(),
        timeLabel: item.dayOffset === 0 ? "Today at 17:30" : d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        energy: item.energy,
        sleep: item.sleep,
        category: item.category,
        words: item.words,
        body: item.body,
        influences: item.influences
      };
    });
  }

  /* -------------------- AUTH & MULTI-USER STORAGE -------------------- */
  async function hashPassword(password) {
    try {
      if (window.crypto && window.crypto.subtle) {
        const data = new TextEncoder().encode("soulis_salt_" + password);
        const buf = await window.crypto.subtle.digest("SHA-256", data);
        return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
      }
    } catch (_) {}
    let h = 2166136261;
    for (let i = 0; i < password.length; i++) {
      h ^= password.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return "f_" + (h >>> 0).toString(16);
  }

  function getAccountsStore() {
    try {
      const raw = localStorage.getItem(ACCOUNTS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") return parsed;
      }
    } catch (_) {}
    return {};
  }

  function saveAccountsStore(store) {
    try {
      localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(store));
    } catch (_) {}
  }

  async function ensureDemoAccount() {
    const store = getAccountsStore();
    if (!store["larissa@soulis.app"]) {
      store["larissa@soulis.app"] = {
        email: "larissa@soulis.app",
        userName: "Larissa",
        passwordHash: await hashPassword("soulis123"),
        plusUnlocked: false,
        customInfluences: [],
        journals: {},
        entries: buildSeedEntries(true)
      };
      saveAccountsStore(store);
    }
    return store;
  }

  function getSessionEmail() {
    try {
      return localStorage.getItem(SESSION_KEY) || "";
    } catch (_) {
      return "";
    }
  }

  function setSessionEmail(email) {
    try {
      if (email) localStorage.setItem(SESSION_KEY, email);
      else localStorage.removeItem(SESSION_KEY);
    } catch (_) {}
  }

  /* -------------------- APP STATE -------------------- */
  let activeAccount = null;
  let currentCheckinDraft = resetDraft();
  let activeStep = 1;
  let activeJournalDay = 1;
  let selectedPeriodDays = 7;
  let activeCalendarDay = new Date().getDate();
  let audioCtx = null;
  let activeAudioNodes = null;
  let playerInterval = null;
  let playerElapsed = 0;
  let currentSound = MEDITATION_SOUNDS[0];
  let breathInterval = null;
  let breathRunning = false;

  function persistCurrentAccount() {
    if (!activeAccount) return;
    const store = getAccountsStore();
    store[activeAccount.email] = activeAccount;
    saveAccountsStore(store);
  }

  function resetDraft() {
    return {
      energy: 5,
      sleep: "",
      emotions: [],
      body: "",
      influences: []
    };
  }

  /* -------------------- DOM HELPERS -------------------- */
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  function showToast(msg) {
    const toast = $("#toast");
    toast.textContent = msg;
    toast.classList.add("is-visible");
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(() => toast.classList.remove("is-visible"), 2800);
  }

  function cap(str) {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : "";
  }

  /* -------------------- AUTH FLOW HANDLERS -------------------- */
  function showAuthScreen() {
    $("#auth-screen").hidden = false;
    $("#app-wrapper").hidden = true;
    $("#login-error").hidden = true;
    $("#register-error").hidden = true;
  }

  function enterAppForAccount(account) {
    if (!Array.isArray(account.entries) || account.entries.length === 0) {
      account.entries = buildSeedEntries(false);
    }
    if (!account.journals) account.journals = {};
    if (!Array.isArray(account.customInfluences)) account.customInfluences = [];

    activeAccount = account;
    setSessionEmail(account.email);
    $("#auth-screen").hidden = true;
    $("#app-wrapper").hidden = false;
    renderToday();
    syncPlusUI();
    switchView("today");
  }

  function switchAuthTab(mode) {
    const isLogin = mode === "login";
    $("#auth-tab-login").classList.toggle("is-active", isLogin);
    $("#auth-tab-register").classList.toggle("is-active", !isLogin);
    $("#auth-login-form").hidden = !isLogin;
    $("#auth-register-form").hidden = isLogin;
    $("#login-error").hidden = true;
    $("#register-error").hidden = true;
  }

  async function handleLoginSubmit(e) {
    e.preventDefault();
    const email = $("#login-email").value.trim().toLowerCase();
    const password = $("#login-password").value;
    const errEl = $("#login-error");
    errEl.hidden = true;

    if (!email || !password) {
      errEl.textContent = "Mohon isi email dan password Anda.";
      errEl.hidden = false;
      return;
    }

    const store = await ensureDemoAccount();
    const found = store[email];
    const hash = await hashPassword(password);

    if (!found || found.passwordHash !== hash) {
      errEl.textContent = "Email atau password tidak sesuai.";
      errEl.hidden = false;
      return;
    }

    $("#auth-login-form").reset();
    enterAppForAccount(found);
    showToast(`Welcome back, ${found.userName}`);
  }

  async function handleRegisterSubmit(e) {
    e.preventDefault();
    const name = $("#reg-name").value.trim();
    const email = $("#reg-email").value.trim().toLowerCase();
    const pw = $("#reg-password").value;
    const confirm = $("#reg-confirm").value;
    const errEl = $("#register-error");
    errEl.hidden = true;

    if (!name || !email || !pw) {
      errEl.textContent = "Lengkapi semua kolom pendaftaran.";
      errEl.hidden = false;
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errEl.textContent = "Format email belum valid.";
      errEl.hidden = false;
      return;
    }
    if (pw.length < 6) {
      errEl.textContent = "Password minimal 6 karakter.";
      errEl.hidden = false;
      return;
    }
    if (pw !== confirm) {
      errEl.textContent = "Konfirmasi password tidak cocok.";
      errEl.hidden = false;
      return;
    }

    const store = await ensureDemoAccount();
    if (store[email]) {
      errEl.textContent = "Email ini sudah terdaftar. Silakan Sign in.";
      errEl.hidden = false;
      return;
    }

    const newAccount = {
      email,
      userName: name,
      passwordHash: await hashPassword(pw),
      plusUnlocked: false,
      customInfluences: [],
      journals: {},
      entries: buildSeedEntries(false)
    };
    store[email] = newAccount;
    saveAccountsStore(store);

    $("#auth-register-form").reset();
    enterAppForAccount(newAccount);
    showToast(`Akun Soulis dibuat untuk ${name}`);
  }

  /* -------------------- NAVIGATION -------------------- */
  function switchView(viewName) {
    $$(".view").forEach((v) => v.classList.remove("is-active"));
    const target = $(`#view-${viewName}`);
    if (target) target.classList.add("is-active");

    $$(".nav-pill__item").forEach((btn) => {
      btn.classList.toggle("is-active", btn.dataset.nav === viewName);
    });

    if (viewName === "accumulation") renderAccumulation();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* -------------------- RENDER VIEW 1: TODAY -------------------- */
  function renderToday() {
    if (!activeAccount) return;
    const name = activeAccount.userName || "Larissa";
    const now = new Date();
    const hour = now.getHours();
    const salutation = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

    $("#topbar-user-name").textContent = name;
    $("#topbar-avatar-initial").textContent = name.charAt(0).toUpperCase();
    $("#today-greeting").textContent = `${salutation}, ${name}`;
    $("#today-date").textContent = now.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric"
    });

    const latest = activeAccount.entries[activeAccount.entries.length - 1];
    const emoInfo = EMOTIONS[latest.category] || EMOTIONS.Anxiety;

    $("#today-hero-orb").style.background = emoInfo.gradient;
    $("#brand-aura-dot").style.background = emoInfo.gradient;
    $("#last-checkin-orb").style.background = emoInfo.gradient;

    $("#last-checkin-time").textContent = latest.timeLabel || "Today";
    $("#last-checkin-category").textContent = latest.category;
    $("#last-checkin-emotions").textContent = latest.words.map(cap).join(", ");
    $("#last-checkin-meta").innerHTML = `
      <span class="soft-pill">Energy ${latest.energy}/10</span>
      <span class="soft-pill">Body: ${latest.body}</span>
      <span class="soft-pill">Sleep: ${latest.sleep}</span>
    `;
    $("#last-checkin-influences").textContent = `Influenced by: ${latest.influences.join(", ")}`;

    renderWeeklyJournalPath();
  }

  function renderWeeklyJournalPath() {
    const journals = (activeAccount && activeAccount.journals) || {};
    let writtenCount = 0;

    const dotsHtml = [];
    const nodesHtml = [];
    const penIcon = `
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 20h9"/>
        <path d="M16.5 3.5a2.12 2.12 0 1 1 3 3L7 19l-4 1 1-4Z"/>
      </svg>`;
    const checkIcon = `
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20 6L9 17l-5-5"/>
      </svg>`;

    for (let day = 1; day <= 7; day++) {
      const entry = journals[day];
      const isWritten = Boolean(entry && (entry.gratitude.trim() || entry.notes.trim()));
      if (isWritten) writtenCount++;

      dotsHtml.push(`<span class="dot-track__item ${isWritten ? "is-done" : ""}"></span>`);

      const staggerClass = day % 2 === 0 ? "week-day-node--up" : day === 1 || day === 7 ? "" : "week-day-node--down";
      nodesHtml.push(`
        <button class="week-day-node ${staggerClass} ${isWritten ? "is-written" : ""}" data-journal-day="${day}" type="button">
          <span class="week-day-node__circle" aria-hidden="true">
            ${isWritten ? checkIcon : penIcon}
          </span>
          <span class="week-day-node__label">Day ${day}</span>
          <span class="week-day-node__badge">${isWritten ? "Written" : "Write"}</span>
        </button>
      `);
    }

    $("#journal-dot-track").innerHTML = dotsHtml.join("");
    $("#week-days-path").innerHTML = nodesHtml.join("");
    $("#journal-progress-count").textContent = `${writtenCount}/7`;
  }

  /* -------------------- WEEKLY JOURNAL MODAL -------------------- */
  function openJournalDay(day) {
    activeJournalDay = day;
    const prompt = JOURNAL_PROMPTS[day] || JOURNAL_PROMPTS[1];
    const saved = (activeAccount.journals && activeAccount.journals[day]) || { gratitude: "", notes: "", updatedAt: "" };
    const isWritten = Boolean(saved.gratitude.trim() || saved.notes.trim());

    $("#journal-day-kicker").textContent = `DAY ${day}`;
    $("#journal-saved-pill").textContent = isWritten ? "Saved" : "New entry";
    $("#journal-prompt-title").textContent = prompt.title;
    $("#journal-prompt-sub").textContent = prompt.sub;
    $("#journal-gratitude-input").value = saved.gratitude || "";
    $("#journal-notes-input").value = saved.notes || "";
    $("#journal-updated-at").textContent = saved.updatedAt ? `Saved ${saved.updatedAt}` : "Not written yet";

    renderJournalDaySwitcher();
    $("#modal-journal").hidden = false;
  }

  function renderJournalDaySwitcher() {
    const journals = activeAccount.journals || {};
    $("#journal-day-switcher").innerHTML = Array.from({ length: 7 }, (_, i) => {
      const d = i + 1;
      const entry = journals[d];
      const hasEntry = Boolean(entry && (entry.gratitude.trim() || entry.notes.trim()));
      return `
        <button class="journal-day-pill ${d === activeJournalDay ? "is-active" : ""} ${hasEntry ? "has-entry" : ""}" data-switch-jday="${d}" type="button">
          Day ${d}
        </button>
      `;
    }).join("");
  }

  function saveJournalEntry(e) {
    e.preventDefault();
    const gratitude = $("#journal-gratitude-input").value.trim();
    const notes = $("#journal-notes-input").value.trim();

    if (!gratitude && !notes) {
      showToast("Write a gratitude line or reflection first");
      return;
    }

    const now = new Date();
    const updatedAt = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

    if (!activeAccount.journals) activeAccount.journals = {};
    activeAccount.journals[activeJournalDay] = { gratitude, notes, updatedAt };
    persistCurrentAccount();
    renderWeeklyJournalPath();
    renderJournalDaySwitcher();

    $("#journal-saved-pill").textContent = "Saved";
    $("#journal-updated-at").textContent = `Saved ${updatedAt}`;
    showToast(`Saved Day ${activeJournalDay} gratitude journal`);
  }

  /* -------------------- CHECK-IN FLOW -------------------- */
  function openCheckin() {
    currentCheckinDraft = resetDraft();
    activeStep = 1;
    $("#energy-slider").value = 5;
    updateEnergyOrb(5);
    $$(".choice-pill-row").forEach((b) => b.classList.remove("is-selected"));
    $("#step2-next").disabled = true;
    $("#step3-next").disabled = true;
    $("#step4-next").disabled = true;
    renderEmotionConstellation();
    renderBodyMatrix();
    renderInfluenceCloud();
    goToStep(1);
    $("#checkin-overlay").hidden = false;
    document.body.style.overflow = "hidden";
  }

  function closeCheckin() {
    $("#checkin-overlay").hidden = true;
    document.body.style.overflow = "";
  }

  function goToStep(step) {
    activeStep = step;
    $$(".checkin-step").forEach((el) => {
      el.classList.toggle("is-active", Number(el.dataset.step) === step);
    });
    const pct = Math.min(100, (step / 6) * 100);
    $("#checkin-progress-fill").style.width = `${pct}%`;
    $("#checkin-back").style.visibility = step === 1 || step === 6 ? "hidden" : "visible";
    $("#checkin-overlay").scrollTo({ top: 0, behavior: "smooth" });
  }

  function updateEnergyOrb(val) {
    const n = Number(val);
    currentCheckinDraft.energy = n;
    $("#energy-value-num").textContent = n;

    const labels = [
      "Running empty", "Barely a spark", "Low tide", "Gentle pace", "Taking it slow",
      "It's okay", "Steady warmth", "Clear flow", "Bright & steady", "Full current", "Radiant"
    ];
    $("#energy-value-label").textContent = labels[n];

    const pct = n * 10;
    $("#energy-slider").style.background = `linear-gradient(to right, #DF4678 ${pct}%, #F4E1E8 ${pct}%)`;

    const orb = $("#energy-live-orb");
    if (n <= 3) {
      orb.style.background = "radial-gradient(circle at 40% 40%, #FBCFE8, #F9A8D4 55%, #FDE68A 90%)";
      orb.style.transform = "scale(0.9)";
    } else if (n <= 6) {
      orb.style.background = "radial-gradient(circle at 40% 40%, #F472B6, #FBCFE8 54%, #FDE047 90%)";
      orb.style.transform = "scale(1)";
    } else {
      orb.style.background = "radial-gradient(circle at 40% 40%, #F59E0B, #FDE047 50%, #FB7185 90%)";
      orb.style.transform = "scale(1.1)";
    }
  }

  function renderEmotionConstellation() {
    $("#emotion-overview").hidden = false;
    $("#emotion-cluster").hidden = true;

    const container = $("#emotion-overview");
    container.innerHTML = Object.keys(EMOTIONS).map((cat) => {
      const count = currentCheckinDraft.emotions.filter((e) => e.category === cat).length;
      const dots = [0, 1, 2].map((i) => `<i class="${i < count ? "is-filled" : ""}"></i>`).join("");
      return `
        <button class="primary-aura-btn" data-emotion-cat="${cat}" type="button">
          <span class="primary-aura-btn__orb" style="background: ${EMOTIONS[cat].gradient};"></span>
          <span class="primary-aura-btn__label">${cat}</span>
          <span class="primary-aura-dots">${dots}</span>
        </button>
      `;
    }).join("");

    renderSelectedEmotionChips();
  }

  function openEmotionCluster(cat) {
    $("#emotion-overview").hidden = true;
    $("#emotion-cluster").hidden = false;
    const info = EMOTIONS[cat];
    const canvas = $("#cluster-canvas");

    canvas.innerHTML = info.sub.map((item) => {
      const isChosen = currentCheckinDraft.emotions.some((e) => e.word === item.word);
      return `
        <button class="sub-emotion-btn ${isChosen ? "is-selected" : ""}" data-word="${item.word}" data-cat="${cat}" type="button">
          <span class="sub-emotion-btn__orb" style="background: ${info.gradient};"></span>
          <strong>${item.word}</strong>
          <span>${item.desc}</span>
        </button>
      `;
    }).join("");
  }

  function toggleEmotionWord(cat, word) {
    const existingIdx = currentCheckinDraft.emotions.findIndex((e) => e.word === word);
    if (existingIdx > -1) {
      currentCheckinDraft.emotions.splice(existingIdx, 1);
    } else {
      if (currentCheckinDraft.emotions.length >= 3) {
        showToast("Choose up to three words that sit closest");
        return;
      }
      currentCheckinDraft.emotions.push({ category: cat, word });
    }
    $("#step3-next").disabled = currentCheckinDraft.emotions.length === 0;
    openEmotionCluster(cat);
    renderSelectedEmotionChips();
  }

  function renderSelectedEmotionChips() {
    const bar = $("#selected-emotions-bar");
    if (currentCheckinDraft.emotions.length === 0) {
      bar.innerHTML = `<span class="muted-meta">Tap an aura below to explore nuances</span>`;
      return;
    }
    bar.innerHTML = currentCheckinDraft.emotions.map((e) => `
      <button class="selected-emotion-chip" data-remove-word="${e.word}" type="button">
        <span>${e.word}</span>
        <span aria-hidden="true">&times;</span>
      </button>
    `).join("");
  }

  function renderBodyMatrix() {
    $("#body-options").innerHTML = BODY_SENSATIONS.map((b) => `
      <button class="body-card ${currentCheckinDraft.body === b.name ? "is-selected" : ""}" data-body="${b.name}" type="button">
        <span class="body-card__left">
          <span class="body-card__icon">${b.icon}</span>
          <span>${b.name}</span>
        </span>
        <span class="body-card__check" aria-hidden="true">&#10003;</span>
      </button>
    `).join("");
  }

  function renderInfluenceCloud() {
    const allTags = [...DEFAULT_INFLUENCES, ...(activeAccount.customInfluences || [])];
    $("#influence-cloud").innerHTML = allTags.map((tag) => {
      const selected = currentCheckinDraft.influences.includes(tag);
      return `<button class="influence-pill ${selected ? "is-selected" : ""}" data-influence="${tag}" type="button">${tag}</button>`;
    }).join("");
  }

  function completeCheckin() {
    const primaryCat = currentCheckinDraft.emotions[0]?.category || "Calm";
    const now = new Date();
    const newEntry = {
      id: `entry-${Date.now()}`,
      dateISO: now.toISOString(),
      year: now.getFullYear(),
      month: now.getMonth(),
      dayNum: now.getDate(),
      timeLabel: `Today at ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`,
      energy: currentCheckinDraft.energy,
      sleep: currentCheckinDraft.sleep || "So-so",
      category: primaryCat,
      words: currentCheckinDraft.emotions.map((e) => e.word),
      body: currentCheckinDraft.body || "Quiet inside",
      influences: currentCheckinDraft.influences.length ? [...currentCheckinDraft.influences] : ["Daily rhythm"]
    };

    activeAccount.entries.push(newEntry);
    activeCalendarDay = now.getDate();
    persistCurrentAccount();
    renderToday();

    const emoInfo = EMOTIONS[primaryCat] || EMOTIONS.Calm;
    $("#result-summary-orb").style.background = emoInfo.gradient;
    $("#result-summary-category").textContent = `${primaryCat.toUpperCase()} • SAVED`;
    $("#result-summary-words").textContent = newEntry.words.map(cap).join(", ");
    $("#result-summary-meta").textContent = `Energy ${newEntry.energy}/10 • Body: ${newEntry.body} • Sleep: ${newEntry.sleep}`;

    goToStep(6);
  }

  /* -------------------- ACCUMULATION ANALYTICS -------------------- */
  function renderAccumulation() {
    if (!activeAccount) return;
    const slice = selectedPeriodDays === 7 ? activeAccount.entries.slice(-7) : activeAccount.entries;
    const total = slice.length || 1;

    const counts = { Joy: 0, Calm: 0, Anxiety: 0, Sadness: 0, Anger: 0 };
    const bodyCounts = {};
    let energySum = 0;
    let restedCount = 0;

    slice.forEach((e) => {
      if (counts[e.category] !== undefined) counts[e.category] += 1;
      energySum += e.energy;
      if (e.sleep === "Slept well") restedCount += 1;
      bodyCounts[e.body] = (bodyCounts[e.body] || 0) + 1;
    });

    const sortedCats = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const top1 = sortedCats[0][0];
    const top2 = sortedCats[1][0];
    const topBody = Object.entries(bodyCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "Quiet inside";

    const c1 = EMOTIONS[top1].color;
    const c2 = EMOTIONS[top2].color;
    const blended = `radial-gradient(circle at 32% 35%, ${c1}, ${c2} 58%, rgba(255,247,249,0.2) 95%)`;
    $("#acc-dominant-sphere").style.background = blended;
    $("#wrapped-poster-orb").style.background = blended;

    const titleMap = {
      Joy: "Sunlit Momentum",
      Calm: "Anchored Stillness",
      Anxiety: "Quiet Vigilance",
      Sadness: "Soft Weather",
      Anger: "Guarded Fire"
    };
    const dominantTitle = `${titleMap[top1]} & ${top2}`;
    $("#acc-dominant-name").textContent = dominantTitle;
    $("#acc-checkin-total").textContent = `Based on ${total} check-ins (${selectedPeriodDays}-day horizon)`;

    const avgEnergy = (energySum / total).toFixed(1);
    const sleepPct = Math.round((restedCount / total) * 100);
    $("#acc-avg-energy").textContent = `${avgEnergy} / 10`;
    $("#acc-sleep-rate").textContent = `${sleepPct}%`;
    $("#acc-top-body").textContent = topBody;

    $("#acc-narrative").textContent =
      `Across your last ${total} check-ins, ${top1} (${Math.round((counts[top1] / total) * 100)}%) and ${top2} shaped your emotional landscape, most often felt physically as "${topBody.toLowerCase()}".`;

    $("#acc-emotion-bars").innerHTML = sortedCats.map(([cat, count]) => {
      const pct = Math.round((count / total) * 100);
      return `
        <div class="emotion-bar-row">
          <span>${cat}</span>
          <div class="emotion-bar-track">
            <div class="emotion-bar-fill" style="width:${pct}%; background:${EMOTIONS[cat].color};"></div>
          </div>
          <span>${pct}%</span>
        </div>`;
    }).join("");

    renderCorrelations(slice);
    renderCalendarHeatmap();
    renderWrappedPreview(dominantTitle, total, top1, top2, topBody, avgEnergy);
  }

  function renderCorrelations(entries) {
    const workAnxiety = entries.filter((e) => e.influences.includes("Work") && (e.category === "Anxiety" || e.category === "Anger")).length;
    const workTotal = Math.max(1, entries.filter((e) => e.influences.includes("Work")).length);
    const workPct = Math.round((workAnxiety / workTotal) * 100);

    const wellSleepPositive = entries.filter((e) => e.sleep === "Slept well" && (e.category === "Joy" || e.category === "Calm")).length;
    const wellSleepTotal = Math.max(1, entries.filter((e) => e.sleep === "Slept well").length);
    const sleepLiftPct = Math.round((wellSleepPositive / wellSleepTotal) * 100);

    const lowEnergyTight = entries.filter((e) => e.energy <= 5 && e.body === "Tight").length;

    $("#acc-insights-list").innerHTML = `
      <article class="insight-strip">
        <span class="insight-strip__tag">TRIGGER CORRELATION</span>
        <h3>Work tags lean toward vigilance (${workPct}%)</h3>
        <p>${workPct}% of check-ins tagged with Work coincided with alert or tense emotions—especially when afternoon energy dropped below 5.</p>
      </article>
      <article class="insight-strip">
        <span class="insight-strip__tag">SLEEP RHYTHM</span>
        <h3>Rested nights widen Calm &amp; Joy (${sleepLiftPct}%)</h3>
        <p>When you slept well, ${sleepLiftPct}% of your following check-ins settled into Calm or Joy with softer somatic states.</p>
      </article>
      <article class="insight-strip">
        <span class="insight-strip__tag">SOMATIC SIGNATURE</span>
        <h3>"Tight" appeared ${lowEnergyTight} times under mid-energy</h3>
        <p>Notice chest or jaw tightness early—three minutes of slow exhale resets tend to soften it before evening.</p>
      </article>
    `;
  }

  function getCurrentMonthMap() {
    const now = new Date();
    const yr = now.getFullYear();
    const mo = now.getMonth();
    const map = {};
    activeAccount.entries.forEach((e) => {
      const d = new Date(e.dateISO);
      if (d.getFullYear() === yr && d.getMonth() === mo) {
        map[d.getDate()] = e;
      }
    });
    return { yr, mo, map };
  }

  function renderCalendarHeatmap() {
    const grid = $("#acc-calendar-grid");
    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const { yr, mo, map: byDay } = getCurrentMonthMap();
    const monthName = new Date(yr, mo, 1).toLocaleDateString("en-US", { month: "long" });
    const daysInMonth = new Date(yr, mo + 1, 0).getDate();
    const startOffset = new Date(yr, mo, 1).getDay();

    $("#calendar-heading").textContent = `${monthName} Aura Rhythm`;
    const wrappedSubMonth = document.querySelector("#wrapped-poster-preview .micro-label");
    if (wrappedSubMonth) {
      wrappedSubMonth.textContent = `${monthName.toUpperCase()} ${yr} • SOULIS`;
    }

    let html = weekdays.map((w) => `<div class="cal-weekday">${w}</div>`).join("");
    for (let pad = 0; pad < startOffset; pad++) {
      html += `<div class="cal-cell is-empty" aria-hidden="true"></div>`;
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const entry = byDay[day];
      const selected = day === activeCalendarDay ? "is-selected" : "";
      if (entry) {
        const grad = EMOTIONS[entry.category].gradient;
        html += `
          <button class="cal-cell ${selected}" data-cal-day="${day}" type="button">
            <span class="cal-cell__num">${day}</span>
            <span class="cal-cell__orb" style="background:${grad};"></span>
          </button>`;
      } else {
        html += `
          <div class="cal-cell is-empty">
            <span class="cal-cell__num" style="opacity:0.4;">${day}</span>
          </div>`;
      }
    }
    grid.innerHTML = html;
    inspectCalendarDay(activeCalendarDay, byDay);
  }

  function inspectCalendarDay(day, byDayMap) {
    const { yr, mo, map: defaultMap } = getCurrentMonthMap();
    const map = byDayMap || defaultMap;
    const entry = map[day];
    const dateLabel = new Date(yr, mo, day).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric"
    });
    $("#inspector-date").textContent = dateLabel;
    if (!entry) {
      $("#inspector-body").innerHTML = `<p class="muted-meta">No check-in logged on this date yet.</p>`;
      return;
    }
    $("#inspector-body").innerHTML = `
      <p><strong>${entry.category}</strong> &mdash; ${entry.words.join(", ")}</p>
      <div class="inspector-chip-row">
        <span class="soft-pill">Energy ${entry.energy}/10</span>
        <span class="soft-pill">Sleep: ${entry.sleep}</span>
        <span class="soft-pill">Body: ${entry.body}</span>
      </div>
      <p class="muted-meta">Influenced by: ${entry.influences.join(", ")}</p>
    `;
  }

  function renderWrappedPreview(title, total, top1, top2, topBody, avgEnergy) {
    $("#wrapped-poster-title").textContent = title;
    $("#wrapped-poster-sub").textContent = `${total} moments witnessed • ${top1} & ${top2}`;
    $("#wrapped-summary-pills").innerHTML = `
      <span class="soft-pill">${total} check-ins</span>
      <span class="soft-pill">Dominant: ${top1}</span>
      <span class="soft-pill">Body: ${topBody}</span>
      <span class="soft-pill">Avg energy: ${avgEnergy}</span>
    `;
  }

  function downloadWrappedPNG() {
    const title = $("#wrapped-poster-title").textContent;
    const sub = $("#wrapped-poster-sub").textContent;
    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1350;
    const ctx = canvas.getContext("2d");

    const bgGrad = ctx.createLinearGradient(0, 0, 1080, 1350);
    bgGrad.addColorStop(0, "#FFF7F9");
    bgGrad.addColorStop(1, "#FFF8E8");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const g = ctx.createRadialGradient(540, 500, 40, 540, 500, 320);
    g.addColorStop(0, "rgba(244, 114, 182, 0.72)");
    g.addColorStop(0.55, "rgba(253, 224, 71, 0.56)");
    g.addColorStop(1, "rgba(255, 247, 249, 0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(540, 500, 320, 0, Math.PI * 2);
    ctx.fill();

    ctx.textAlign = "center";
    ctx.fillStyle = "#8E7D82";
    ctx.font = "600 24px sans-serif";
    const nowLabel = new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }).toUpperCase();
    ctx.fillText(`${nowLabel} • SOULIS WRAPPED`, 540, 140);

    ctx.fillStyle = "#2B2124";
    ctx.font = "400 68px Georgia, serif";
    ctx.fillText(title, 540, 860);

    ctx.fillStyle = "#5E4E53";
    ctx.font = "400 28px sans-serif";
    ctx.fillText(sub, 540, 925);

    ctx.fillStyle = "#DF4678";
    ctx.font = "italic 34px Georgia, serif";
    ctx.fillText('"One direction you trust a little is enough to go on."', 540, 1060);

    ctx.fillStyle = "#8E7D82";
    ctx.font = "400 22px sans-serif";
    ctx.fillText(`Curated for ${activeAccount.userName || "Larissa"} • Soulis Accumulation`, 540, 1245);

    const link = document.createElement("a");
    link.download = "soulis-monthly-wrapped.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
    showToast("Downloaded Soulis Monthly Wrapped PNG");
  }

  /* -------------------- MEDITATION NATURE & YOGA SOUND ENGINE -------------------- */
  function openMeditationPlayer(soundId) {
    const found = MEDITATION_SOUNDS.find((s) => s.id === soundId) || MEDITATION_SOUNDS[0];
    selectMeditationSound(found);
    renderMeditationPlaylist();
    $("#modal-player").hidden = false;
  }

  function selectMeditationSound(sound) {
    stopAmbientAudio();
    currentSound = sound;
    playerElapsed = 0;
    $("#player-kicker").textContent = "MEDITATION • RELAXING SOUND";
    $("#player-type").textContent = sound.type;
    $("#player-title").textContent = sound.title;
    $("#player-desc").textContent = sound.desc;
    $("#player-play-icon").innerHTML = "&#9654;";
    $("#player-play-label").textContent = "Play";
    updateTimerDisplay();
  }

  function renderMeditationPlaylist() {
    $("#player-playlist").innerHTML = MEDITATION_SOUNDS.map((s) => `
      <button class="playlist-row ${s.id === currentSound.id ? "is-active" : ""}" data-select-sound="${s.id}" type="button">
        <div>
          <span class="playlist-row__meta">${s.type}</span>
          <span class="playlist-row__name">${s.title}</span>
        </div>
        <span class="muted-meta">${formatSec(s.duration)}</span>
      </button>
    `).join("");
  }

  function toggleMeditationPlay() {
    if (playerInterval) {
      stopAmbientAudio();
      $("#player-play-icon").innerHTML = "&#9654;";
      $("#player-play-label").textContent = "Play";
      return;
    }

    startMeditationAudio(currentSound.mode);
    $("#player-play-icon").innerHTML = "&#10074;&#10074;";
    $("#player-play-label").textContent = "Pause";

    playerInterval = setInterval(() => {
      playerElapsed += 1;
      updateTimerDisplay();
      if (playerElapsed >= currentSound.duration) {
        stopAmbientAudio();
        showToast("Meditation session complete");
      }
    }, 1000);
  }

  function createNoiseBuffer(ctx, softness) {
    const bufferSize = ctx.sampleRate * 3;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + softness * white) / (1 + softness);
      lastOut = data[i];
      data[i] *= 2.6;
    }
    return buffer;
  }

  function startMeditationAudio(mode) {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      if (!audioCtx) audioCtx = new AudioContextClass();
      if (audioCtx.state === "suspended") audioCtx.resume();

      const master = audioCtx.createGain();
      master.gain.setValueAtTime(0.001, audioCtx.currentTime);
      master.gain.exponentialRampToValueAtTime(0.08, audioCtx.currentTime + 1.8);
      master.connect(audioCtx.destination);

      const cleanups = [];

      if (mode === "rain") {
        const src = audioCtx.createBufferSource();
        src.buffer = createNoiseBuffer(audioCtx, 0.045);
        src.loop = true;

        const lowpass = audioCtx.createBiquadFilter();
        lowpass.type = "lowpass";
        lowpass.frequency.value = 920;

        const highpass = audioCtx.createBiquadFilter();
        highpass.type = "highpass";
        highpass.frequency.value = 140;

        src.connect(highpass);
        highpass.connect(lowpass);
        lowpass.connect(master);
        src.start();
        cleanups.push(() => src.stop());
      } else if (mode === "ocean") {
        const src = audioCtx.createBufferSource();
        src.buffer = createNoiseBuffer(audioCtx, 0.02);
        src.loop = true;

        const filter = audioCtx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = 500;

        const waveGain = audioCtx.createGain();
        waveGain.gain.value = 0.6;

        const lfo = audioCtx.createOscillator();
        lfo.frequency.value = 0.11;
        const lfoDepth = audioCtx.createGain();
        lfoDepth.gain.value = 0.4;
        lfo.connect(lfoDepth);
        lfoDepth.connect(waveGain.gain);

        src.connect(filter);
        filter.connect(waveGain);
        waveGain.connect(master);
        src.start();
        lfo.start();
        cleanups.push(() => { src.stop(); lfo.stop(); });
      } else if (mode === "bowl") {
        const freqs = [216, 432, 648];
        freqs.forEach((f, idx) => {
          const osc = audioCtx.createOscillator();
          const g = audioCtx.createGain();
          osc.type = "sine";
          osc.frequency.value = f;
          g.gain.value = idx === 0 ? 0.35 : idx === 1 ? 0.45 : 0.15;
          osc.connect(g);
          g.connect(master);
          osc.start();
          cleanups.push(() => osc.stop());
        });
      } else {
        const src = audioCtx.createBufferSource();
        src.buffer = createNoiseBuffer(audioCtx, 0.018);
        src.loop = true;
        const filter = audioCtx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = 380;
        src.connect(filter);
        filter.connect(master);
        src.start();
        cleanups.push(() => src.stop());

        const notes = [329.63, 392.0, 440.0, 523.25];
        const chimeTimer = setInterval(() => {
          try {
            const osc = audioCtx.createOscillator();
            const g = audioCtx.createGain();
            osc.type = "sine";
            osc.frequency.value = notes[Math.floor(Math.random() * notes.length)];
            const t = audioCtx.currentTime;
            g.gain.setValueAtTime(0.001, t);
            g.gain.exponentialRampToValueAtTime(0.18, t + 0.4);
            g.gain.exponentialRampToValueAtTime(0.001, t + 3.4);
            osc.connect(g);
            g.connect(master);
            osc.start(t);
            osc.stop(t + 3.5);
          } catch (_) {}
        }, 4200);
        cleanups.push(() => clearInterval(chimeTimer));
      }

      activeAudioNodes = {
        stop: () => {
          cleanups.forEach((fn) => {
            try { fn(); } catch (_) {}
          });
          try { master.disconnect(); } catch (_) {}
        }
      };
    } catch (_) {}
  }

  function stopAmbientAudio() {
    clearInterval(playerInterval);
    playerInterval = null;
    if (activeAudioNodes) {
      activeAudioNodes.stop();
      activeAudioNodes = null;
    }
  }

  function formatSec(sec) {
    const m = String(Math.floor(sec / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${m}:${s}`;
  }

  function updateTimerDisplay() {
    $("#player-timer").textContent = `${formatSec(playerElapsed)} / ${formatSec(currentSound.duration)}`;
  }

  /* -------------------- GUIDED 4-4-6 BREATHING -------------------- */
  function toggleBreathing() {
    const ring = $("#breath-ring");
    const phaseEl = $("#breath-phase-label");
    const countEl = $("#breath-count-label");
    const btn = $("#btn-breath-toggle");

    if (breathRunning) {
      stopBreathing();
      return;
    }

    breathRunning = true;
    btn.textContent = "Pause Breath";
    const phases = [
      { label: "Inhale", secs: 4, cls: "breath-ring--inhale" },
      { label: "Hold gently", secs: 4, cls: "breath-ring--hold" },
      { label: "Exhale slowly", secs: 6, cls: "breath-ring--exhale" }
    ];
    let idx = 0;
    let remaining = phases[0].secs;

    const applyPhase = () => {
      const p = phases[idx];
      ring.className = `breath-ring ${p.cls}`;
      phaseEl.textContent = p.label;
      countEl.textContent = `${remaining}s`;
    };
    applyPhase();

    breathInterval = setInterval(() => {
      remaining -= 1;
      if (remaining <= 0) {
        idx = (idx + 1) % phases.length;
        remaining = phases[idx].secs;
      }
      applyPhase();
    }, 1000);
  }

  function stopBreathing() {
    clearInterval(breathInterval);
    breathRunning = false;
    $("#breath-ring").className = "breath-ring";
    $("#breath-phase-label").textContent = "Ready";
    $("#breath-count-label").textContent = "Tap begin";
    $("#btn-breath-toggle").textContent = "Begin Breath Cycle";
  }

  /* -------------------- EVENT WIRING -------------------- */
  function bindEvents() {
    $("#auth-tab-login").addEventListener("click", () => switchAuthTab("login"));
    $("#auth-tab-register").addEventListener("click", () => switchAuthTab("register"));
    $("#auth-login-form").addEventListener("submit", handleLoginSubmit);
    $("#auth-register-form").addEventListener("submit", handleRegisterSubmit);

    $("#btn-demo-login").addEventListener("click", async () => {
      const store = await ensureDemoAccount();
      enterAppForAccount(store["larissa@soulis.app"]);
      showToast("Signed in as Larissa (Demo)");
    });

    $$("[data-toggle-pw]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const input = document.getElementById(btn.dataset.togglePw);
        if (!input) return;
        const hidden = input.type === "password";
        input.type = hidden ? "text" : "password";
        btn.textContent = hidden ? "Hide" : "Show";
      });
    });

    $$("[data-nav]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        switchView(btn.dataset.nav);
      });
    });

    $("#btn-start-checkin").addEventListener("click", openCheckin);
    $("#btn-topbar-checkin").addEventListener("click", openCheckin);
    $("#btn-jump-accumulation").addEventListener("click", () => switchView("accumulation"));

    $("#checkin-close").addEventListener("click", closeCheckin);
    $("#checkin-back").addEventListener("click", () => {
      if (activeStep > 1) goToStep(activeStep - 1);
    });

    $("#energy-slider").addEventListener("input", (e) => updateEnergyOrb(e.target.value));
    $("#step1-next").addEventListener("click", () => goToStep(2));

    $("#sleep-options").addEventListener("click", (e) => {
      const btn = e.target.closest("[data-sleep]");
      if (!btn) return;
      currentCheckinDraft.sleep = btn.dataset.sleep;
      $$(".choice-pill-row").forEach((b) => b.classList.remove("is-selected"));
      btn.classList.add("is-selected");
      $("#step2-next").disabled = false;
    });
    $("#step2-next").addEventListener("click", () => goToStep(3));

    $("#emotion-overview").addEventListener("click", (e) => {
      const btn = e.target.closest("[data-emotion-cat]");
      if (btn) openEmotionCluster(btn.dataset.emotionCat);
    });
    $("#btn-back-constellation").addEventListener("click", renderEmotionConstellation);

    $("#cluster-canvas").addEventListener("click", (e) => {
      const btn = e.target.closest("[data-word]");
      if (btn) toggleEmotionWord(btn.dataset.cat, btn.dataset.word);
    });

    $("#selected-emotions-bar").addEventListener("click", (e) => {
      const chip = e.target.closest("[data-remove-word]");
      if (!chip) return;
      currentCheckinDraft.emotions = currentCheckinDraft.emotions.filter((x) => x.word !== chip.dataset.removeWord);
      $("#step3-next").disabled = currentCheckinDraft.emotions.length === 0;
      if (!$("#emotion-overview").hidden) renderEmotionConstellation();
      else {
        const currentCat = $("#cluster-canvas [data-cat]")?.dataset.cat;
        if (currentCat) openEmotionCluster(currentCat);
      }
      renderSelectedEmotionChips();
    });

    $("#step3-next").addEventListener("click", () => goToStep(4));

    $("#body-options").addEventListener("click", (e) => {
      const btn = e.target.closest("[data-body]");
      if (!btn) return;
      currentCheckinDraft.body = btn.dataset.body;
      renderBodyMatrix();
      $("#step4-next").disabled = false;
    });
    $("#step4-next").addEventListener("click", () => goToStep(5));

    $("#influence-cloud").addEventListener("click", (e) => {
      const btn = e.target.closest("[data-influence]");
      if (!btn) return;
      const val = btn.dataset.influence;
      const idx = currentCheckinDraft.influences.indexOf(val);
      if (idx > -1) currentCheckinDraft.influences.splice(idx, 1);
      else currentCheckinDraft.influences.push(val);
      renderInfluenceCloud();
    });

    $("#custom-word-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const input = $("#custom-word-input");
      const val = input.value.trim();
      if (!val) return;
      if (!activeAccount.customInfluences) activeAccount.customInfluences = [];
      if (!activeAccount.customInfluences.includes(val) && !DEFAULT_INFLUENCES.includes(val)) {
        activeAccount.customInfluences.push(val);
      }
      if (!currentCheckinDraft.influences.includes(val)) {
        currentCheckinDraft.influences.push(val);
      }
      persistCurrentAccount();
      input.value = "";
      renderInfluenceCloud();
    });

    $("#step5-finish").addEventListener("click", completeCheckin);
    $("#btn-finish-checkin").addEventListener("click", () => {
      closeCheckin();
      switchView("today");
    });
    $("#btn-result-to-journal").addEventListener("click", () => {
      closeCheckin();
      const nextDay = Math.min(7, Object.keys(activeAccount.journals || {}).length + 1);
      openJournalDay(nextDay);
    });

    $("#week-days-path").addEventListener("click", (e) => {
      const btn = e.target.closest("[data-journal-day]");
      if (btn) openJournalDay(Number(btn.dataset.journalDay));
    });

    $("#journal-day-switcher").addEventListener("click", (e) => {
      const btn = e.target.closest("[data-switch-jday]");
      if (btn) openJournalDay(Number(btn.dataset.switchJday));
    });

    $("#journal-form").addEventListener("submit", saveJournalEntry);
    $("#journal-close").addEventListener("click", () => { $("#modal-journal").hidden = true; });

    document.addEventListener("click", (e) => {
      const medBtn = e.target.closest("[data-meditation-open]");
      if (medBtn) openMeditationPlayer(medBtn.dataset.meditationOpen);

      const breathBtn = e.target.closest("[data-breath-open]");
      if (breathBtn) { $("#modal-breath").hidden = false; }

      const articleBtn = e.target.closest("[data-article]");
      if (articleBtn) {
        const art = ARTICLES[articleBtn.dataset.article];
        if (art) {
          $("#article-meta").textContent = art.meta;
          $("#article-title").textContent = art.title;
          $("#article-body").innerHTML = art.html;
          $("#modal-article").hidden = false;
        }
      }
    });

    $("#player-close").addEventListener("click", () => {
      stopAmbientAudio();
      $("#modal-player").hidden = true;
    });
    $("#player-toggle-play").addEventListener("click", toggleMeditationPlay);
    $("#player-skip").addEventListener("click", () => {
      const idx = MEDITATION_SOUNDS.findIndex((s) => s.id === currentSound.id);
      selectMeditationSound(MEDITATION_SOUNDS[(idx + 1) % MEDITATION_SOUNDS.length]);
      renderMeditationPlaylist();
    });
    $("#player-playlist").addEventListener("click", (e) => {
      const row = e.target.closest("[data-select-sound]");
      if (!row) return;
      const found = MEDITATION_SOUNDS.find((s) => s.id === row.dataset.selectSound);
      if (found) {
        selectMeditationSound(found);
        renderMeditationPlaylist();
      }
    });

    $("#breath-close").addEventListener("click", () => {
      stopBreathing();
      $("#modal-breath").hidden = true;
    });
    $("#btn-breath-toggle").addEventListener("click", toggleBreathing);
    $("#article-close").addEventListener("click", () => { $("#modal-article").hidden = true; });

    $$(".period-switch__btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const days = Number(btn.dataset.period);
        if (days > 7 && !activeAccount.plusUnlocked) {
          showToast("Previewing 30-day & seasonal accumulation (Soulis Plus unlocked for preview)");
          activeAccount.plusUnlocked = true;
          persistCurrentAccount();
          syncPlusUI();
        }
        selectedPeriodDays = days;
        $$(".period-switch__btn").forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        renderAccumulation();
      });
    });

    $("#acc-calendar-grid").addEventListener("click", (e) => {
      const cell = e.target.closest("[data-cal-day]");
      if (!cell) return;
      activeCalendarDay = Number(cell.dataset.calDay);
      renderCalendarHeatmap();
    });

    $("#btn-download-wrapped").addEventListener("click", downloadWrappedPNG);
    $("#btn-print-wrapped").addEventListener("click", () => window.print());

    $$(".subtab-pill__item").forEach((tab) => {
      tab.addEventListener("click", () => {
        $$(".subtab-pill__item").forEach((t) => t.classList.remove("is-active"));
        tab.classList.add("is-active");
        $$(".explore-panel").forEach((p) => p.classList.remove("is-active"));
        $(`#explore-${tab.dataset.exploreTab}`).classList.add("is-active");
      });
    });

    $$(".billing-toggle__btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        $$(".billing-toggle__btn").forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        const isAnnual = btn.dataset.billing === "annual";
        $("#plus-price-label").innerHTML = isAnnual
          ? `Rp 22.750 <span>/ month (billed yearly)</span>`
          : `Rp 35.000 <span>/ month</span>`;
      });
    });

    $("#btn-toggle-plus-demo").addEventListener("click", () => {
      activeAccount.plusUnlocked = !activeAccount.plusUnlocked;
      persistCurrentAccount();
      syncPlusUI();
      showToast(activeAccount.plusUnlocked ? "Soulis Plus mode preview active" : "Switched back to Soulis Basic view");
    });

    $("#btn-open-account").addEventListener("click", () => {
      $("#account-email-display").textContent = activeAccount.email;
      $("#account-plan-badge").textContent = activeAccount.plusUnlocked ? "Soulis Plus" : "Soulis Basic";
      $("#name-input").value = activeAccount.userName || "";
      $("#modal-account").hidden = false;
    });
    $("#account-modal-close").addEventListener("click", () => { $("#modal-account").hidden = true; });
    $("#name-form").addEventListener("submit", (e) => {
      e.preventDefault();
      const val = $("#name-input").value.trim();
      if (val) {
        activeAccount.userName = val;
        persistCurrentAccount();
        renderToday();
        showToast("Display name updated");
      }
      $("#modal-account").hidden = true;
    });
    $("#btn-logout").addEventListener("click", () => {
      stopAmbientAudio();
      stopBreathing();
      $("#modal-account").hidden = true;
      activeAccount = null;
      setSessionEmail("");
      showAuthScreen();
      showToast("You have signed out safely");
    });

    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      if (!$("#modal-journal").hidden) { $("#modal-journal").hidden = true; return; }
      if (!$("#modal-player").hidden) { stopAmbientAudio(); $("#modal-player").hidden = true; return; }
      if (!$("#modal-breath").hidden) { stopBreathing(); $("#modal-breath").hidden = true; return; }
      if (!$("#modal-article").hidden) { $("#modal-article").hidden = true; return; }
      if (!$("#modal-account").hidden) { $("#modal-account").hidden = true; return; }
      if (!$("#checkin-overlay").hidden) { closeCheckin(); }
    });

    $$(".modal-sheet").forEach((sheet) => {
      sheet.addEventListener("click", (e) => {
        if (e.target !== sheet) return;
        if (sheet.id === "modal-breath") stopBreathing();
        sheet.hidden = true;
      });
    });
  }

  function syncPlusUI() {
    if (!activeAccount) return;
    $("#plus-demo-status").textContent = activeAccount.plusUnlocked
      ? "Currently viewing: Soulis Plus unlocked"
      : "Currently viewing: Basic mode";
    $("#btn-toggle-plus-demo").textContent = activeAccount.plusUnlocked
      ? "Return to Basic View"
      : "Preview Soulis Plus Unlocked";
  }

  /* -------------------- INIT -------------------- */
  async function init() {
    bindEvents();
    const store = await ensureDemoAccount();
    const savedEmail = getSessionEmail();
    if (savedEmail && store[savedEmail]) {
      enterAppForAccount(store[savedEmail]);
    } else {
      showAuthScreen();
    }
  }

  init();
})();