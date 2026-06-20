const DATA_BASE = new URL("./data/", import.meta.url);
const ASSET_BASE = "https://rankedwr.com/";
const RANK_BUCKET = "1"; // Diamond+ in the Riot/Tencent CN dataset.
const SLOT_ROLES = ["2", "5", "1", "3", "4"];
const ROLE_ICONS = { "1": "◇", "2": "◈", "3": "➹", "4": "✦", "5": "⌁" };

const messages = {
  en: {
    primaryNav: "Primary navigation", language: "Language", dataFilters: "Data filters", analyzerRegion: "Team composition analyzer", navAnalyzer: "Analyzer", navMethod: "Method",
    statusConnecting: "Connecting to ranked data", statusLive: "Live ranked snapshot", statusCached: "Cached ranked snapshot",
    eyebrow: "Wild Rift draft intelligence", heroTitle: "Build the draft.<br><em>Find the edge.</em>",
    heroCopy: "Combine observed matchups, current meta strength, historical comparison, and transparent whole-draft estimates.",
    region: "Region", chinaServer: "China server", rank: "Rank", snapshot: "Snapshot", latestAvailable: "Latest available",
    buildDraft: "Build your draft", resetDraft: "Reset draft", yourTeam: "Your team", allyHint: "Select known allied champions",
    enemyTeam: "Enemy team", enemyHint: "Select revealed enemy champions", choosePosition: "Choose your position",
    positionHint: "We compare all available Diamond+ picks in this role.", analyze: "Analyze composition",
    resultPlaceholderTitle: "Your recommendation<br>will appear here", resultPlaceholderCopy: "Complete the draft on the left and run the analysis.",
    howItWorks: "How it works", methodTitle: "Every signal stays visible.", methodDraftTitle: "Observed evidence",
    methodDraftCopy: "RiftGG lane matchups, RankedWR Diamond+ role strength, and statsWR historical comparison remain separate evidence components.", methodRoleTitle: "Whole-draft fit",
    methodRoleCopy: "Every selected enemy and ally contributes to labeled enemy-response and ally-synergy estimates using official champion classes and ability signals.", methodWinTitle: "Transparent ranking",
    methodWinCopy: "Available components are combined into an evidence score; the full breakdown and data coverage are shown for every recommendation.",
    methodDisclaimer: "Lane matchup, role strength, and historical change are published statistics. Enemy response and ally synergy are estimates from official champion classes and ability descriptions—not observed composition win rates or a win probability.",
    footerCopy: "Diamond+ role data via RankedWR, observed lane matchups via RiftGG, and historical comparison via statsWR. Team-fit estimates use official Riot champion information. Not affiliated with Riot Games.",
    viewSource: "View source", chooseChampion: "Choose a champion", closePicker: "Close champion picker",
    searchChampions: "Search champions…", filterByPosition: "Filter champions by position", all: "All",
    draftedUnavailable: "Already drafted champions are unavailable", noSearchResults: "No champions match those filters.",
    addToAlly: "Add to your team", addToEnemy: "Add to enemy team", addChampion: "Add champion", pickerLane: "{team} · {role}",
    removeChampion: "Remove {name} from {team}", addSlot: "Add a {role} champion to {team}", allyTeam: "ally team", enemyTeamLabel: "enemy team",
    alreadyDrafted: "{name}, already drafted", chooseName: "Choose {name}", championCount: "{shown} of {total} champions",
    loadingData: "Loading Wild Rift ranked data…", selectToBegin: "Select at least one ally or enemy champion to begin.",
    draftedReady: "{count} champion{plural} drafted · {role} recommendation ready", noPositionData: "No available champion data exists for this position.",
    topRecommendation: "Top recommendation", highestEvidence: "Highest combined evidence", evidenceScore: "Evidence score", diamondWinRate: "Overall Diamond+ win rate",
    matchupWinRate: "Observed vs {enemy}", noDirectMatchup: "No direct matchup", pickRate: "Pick rate", banRate: "Ban rate", historyChange: "Change since {date}", whyThisPick: "Why this pick:",
    observedLane: "Lane matchup", roleStrength: "Role strength", enemyResponse: "All-enemy response", allySynergy: "Ally synergy", historicalTrend: "Historical comparison", observedLabel: "Observed", estimatedLabel: "Estimate",
    evidenceExplanation: "{name} leads at {score}/100 for {role}. {matchup}. Overall role win rate: {winRate}%. Historical change: {trend}. The team-fit estimates evaluate {enemyCoverage} and {allyCoverage}.",
    directMatchupPhrase: "Observed lane win rate against {enemy}: {rate}%", noMatchupPhrase: "No published direct lane matchup was available",
    trendPoints: "{value} percentage points", trendUnavailable: "unavailable", oneEnemy: "1 selected enemy", manyEnemies: "{count} selected enemies", oneAlly: "1 selected ally", manyAllies: "{count} selected allies", nextBest: "Next best available", evidenceShort: "{score}/100 evidence",
    role1: "Mid", role2: "Solo", role3: "Duo", role4: "Support", role5: "Jungle",
  },
  tr: {
    primaryNav: "Ana gezinme", language: "Dil", dataFilters: "Veri filtreleri", analyzerRegion: "Takım kompozisyonu analiz aracı", navAnalyzer: "Analiz", navMethod: "Yöntem",
    statusConnecting: "Dereceli verilere bağlanılıyor", statusLive: "Canlı dereceli veri", statusCached: "Önbellekteki dereceli veri",
    eyebrow: "Wild Rift seçim zekâsı", heroTitle: "Kompozisyonu kur.<br><em>Avantajı yakala.</em>",
    heroCopy: "Gözlemlenmiş eşleşmeleri, güncel meta gücünü, geçmiş karşılaştırmayı ve şeffaf tüm seçim tahminlerini birleştir.",
    region: "Bölge", chinaServer: "Çin sunucusu", rank: "Lig", snapshot: "Veri tarihi", latestAvailable: "En güncel veri",
    buildDraft: "Takım seçimini oluştur", resetDraft: "Seçimleri sıfırla", yourTeam: "Takımın", allyHint: "Bilinen takım şampiyonlarını seç",
    enemyTeam: "Rakip takım", enemyHint: "Gösterilen rakip şampiyonları seç", choosePosition: "Pozisyonunu seç",
    positionHint: "Bu roldeki tüm uygun Elmas+ seçimleri karşılaştırırız.", analyze: "Kompozisyonu analiz et",
    resultPlaceholderTitle: "Önerin burada<br>görünecek", resultPlaceholderCopy: "Soldaki seçimi tamamla ve analizi çalıştır.",
    howItWorks: "Nasıl çalışır", methodTitle: "Her sinyal görünür kalır.", methodDraftTitle: "Gözlemlenmiş kanıt",
    methodDraftCopy: "RiftGG koridor eşleşmeleri, RankedWR Elmas+ rol gücü ve statsWR geçmiş karşılaştırması ayrı kanıt bileşenleri olarak kalır.", methodRoleTitle: "Tüm seçim uyumu",
    methodRoleCopy: "Seçilen her rakip ve takım arkadaşı, resmi şampiyon sınıfları ve yetenek sinyalleriyle etiketlenmiş rakip yanıtı ve takım sinerjisi tahminlerine katkı sağlar.", methodWinTitle: "Şeffaf sıralama",
    methodWinCopy: "Mevcut bileşenler bir kanıt puanında birleştirilir; tam dağılım ve veri kapsamı her öneride gösterilir.",
    methodDisclaimer: "Koridor eşleşmesi, rol gücü ve geçmiş değişim yayımlanmış istatistiklerdir. Rakip yanıtı ve takım sinerjisi resmi şampiyon sınıfları ile yetenek açıklamalarından üretilen tahminlerdir; gözlemlenmiş kompozisyon kazanma oranı veya kazanma olasılığı değildir.",
    footerCopy: "RankedWR üzerinden Elmas+ rol verisi, RiftGG üzerinden gözlemlenmiş koridor eşleşmeleri ve statsWR üzerinden geçmiş karşılaştırma. Takım uyumu tahminleri resmi Riot şampiyon bilgilerini kullanır. Riot Games ile bağlantılı değildir.",
    viewSource: "Kaynağı görüntüle", chooseChampion: "Bir şampiyon seç", closePicker: "Şampiyon seçiciyi kapat",
    searchChampions: "Şampiyon ara…", filterByPosition: "Şampiyonları pozisyona göre filtrele", all: "Tümü",
    draftedUnavailable: "Daha önce seçilen şampiyonlar kullanılamaz", noSearchResults: "Bu filtrelerle eşleşen şampiyon yok.",
    addToAlly: "Takımına ekle", addToEnemy: "Rakip takıma ekle", addChampion: "Şampiyon ekle", pickerLane: "{team} · {role}",
    removeChampion: "{name} şampiyonunu {team} listesinden çıkar", addSlot: "{team} için {role} şampiyonu ekle", allyTeam: "takım", enemyTeamLabel: "rakip takım",
    alreadyDrafted: "{name}, zaten seçildi", chooseName: "{name} seç", championCount: "{total} şampiyondan {shown} tanesi",
    loadingData: "Wild Rift dereceli verileri yükleniyor…", selectToBegin: "Başlamak için en az bir takım veya rakip şampiyonu seç.",
    draftedReady: "{count} şampiyon seçildi · {role} önerisi hazır", noPositionData: "Bu pozisyon için uygun şampiyon verisi yok.",
    topRecommendation: "En iyi öneri", highestEvidence: "En yüksek birleşik kanıt", evidenceScore: "Kanıt puanı", diamondWinRate: "Genel Elmas+ kazanma oranı",
    matchupWinRate: "{enemy} karşısı gözlemlenmiş", noDirectMatchup: "Doğrudan eşleşme yok", pickRate: "Seçilme oranı", banRate: "Yasaklanma oranı", historyChange: "{date} tarihinden beri değişim", whyThisPick: "Neden bu seçim:",
    observedLane: "Koridor eşleşmesi", roleStrength: "Rol gücü", enemyResponse: "Tüm rakiplere yanıt", allySynergy: "Takım sinerjisi", historicalTrend: "Geçmiş karşılaştırma", observedLabel: "Gözlemlenmiş", estimatedLabel: "Tahmin",
    evidenceExplanation: "{name}, {role} için {score}/100 ile önde. {matchup}. Genel rol kazanma oranı: %{winRate}. Geçmiş değişim: {trend}. Takım uyumu tahminleri {enemyCoverage} ve {allyCoverage} değerlendirir.",
    directMatchupPhrase: "{enemy} karşısı gözlemlenmiş koridor kazanma oranı: %{rate}", noMatchupPhrase: "Yayımlanmış doğrudan koridor eşleşmesi bulunamadı",
    trendPoints: "{value} yüzde puanı", trendUnavailable: "kullanılamıyor", oneEnemy: "seçilen 1 rakibi", manyEnemies: "seçilen {count} rakibi", oneAlly: "seçilen 1 takım arkadaşını", manyAllies: "seçilen {count} takım arkadaşını", nextBest: "Sonraki en iyi seçenekler", evidenceShort: "{score}/100 kanıt",
    role1: "Orta", role2: "Baron", role3: "Ejder", role4: "Destek", role5: "Orman",
  },
};

function t(key, values = {}) {
  const template = messages[state?.language || "en"]?.[key] || messages.en[key] || key;
  return Object.entries(values).reduce((text, [name, value]) => text.replaceAll(`{${name}}`, value), template);
}

function roleName(role) {
  return t(`role${role}`);
}

const fallbackRows = {
  "1": [
    ["10146", "Taliyah", 52.80, 4.59, 35.89], ["10061", "Kennen", 52.61, 1.46, .43],
    ["10119", "Brand", 52.49, 11.57, 10.41], ["10126", "Swain", 52.29, 3.13, 4.20],
    ["10144", "Viktor", 52.20, 5.23, 1.32], ["10065", "Nasus", 52.04, 1.78, 5.38],
    ["10063", "Zyra", 51.84, 2.77, 25.70], ["10028", "Morgana", 51.79, 5.90, 28.34],
  ],
  "2": [
    ["10009", "Wukong", 53.06, 2.56, .51], ["10137", "Ryze", 52.98, 1.70, 4.11],
    ["10118", "Shen", 52.80, 2.09, .16], ["10010", "Vayne", 52.38, 2.16, 13.25],
    ["10134", "Kalista", 52.35, 1.24, 4.27], ["10046", "Teemo", 52.05, 3.95, 20.89],
    ["10152", "K'Sante", 51.98, 7.68, 57.54], ["10041", "Kayle", 51.93, 3.92, .73],
  ],
  "3": [
    ["10138", "Smolder", 52.63, 12.90, 16.31], ["10110", "Kog'Maw", 51.77, 3.03, .43],
    ["10066", "Miss Fortune", 51.76, 22.18, 3.57], ["10022", "Jhin", 51.62, 16.09, .78],
    ["10051", "Xayah", 51.40, 4.92, .20], ["10079", "Ashe", 50.89, 8.06, .17],
    ["10067", "Zeri", 50.74, 1.82, .03], ["10098", "Ezreal", 50.51, 11.07, .37],
  ],
  "4": [
    ["10099", "Galio", 52.94, 3.47, 2.30], ["10080", "Zilean", 52.69, 1.57, 1.73],
    ["10068", "Sett", 52.59, 2.85, 4.63], ["10044", "Leona", 51.94, 11.54, 8.33],
    ["10116", "Rell", 51.93, 4.46, 2.88], ["10074", "Maokai", 51.92, 5.45, .55],
    ["10021", "Braum", 51.69, 4.65, 1.30], ["10091", "Nami", 51.18, 5.02, .14],
  ],
  "5": [
    ["10004", "Amumu", 56.55, 4.07, .19], ["10008", "Nunu", 56.21, 2.34, .74],
    ["10064", "Rammus", 55.00, 4.11, 3.93], ["10135", "Lillia", 54.42, 3.13, 1.23],
    ["10133", "Fiddlesticks", 53.94, 3.17, 3.03], ["10146", "Taliyah", 53.85, 1.99, 35.89],
    ["10050", "Vi", 52.48, 7.66, .87], ["10049", "Shyvana", 52.13, 8.70, 4.84],
  ],
};

const state = {
  teams: { ally: Array(5).fill(null), enemy: Array(5).fill(null) },
  selectedRole: "1",
  pickerRole: "1",
  pickerTarget: null,
  language: localStorage.getItem("riftdraft-language") || (navigator.language.toLowerCase().startsWith("tr") ? "tr" : "en"),
  champions: [],
  championMap: new Map(),
  stats: {},
  matchups: {},
  matchupDate: null,
  history: {},
  historyDate: null,
  signals: {},
  statDate: "20260619",
  source: "loading",
  ready: false,
  lastResult: null,
};

const elements = {
  allySlots: document.querySelector("#ally-slots"),
  enemySlots: document.querySelector("#enemy-slots"),
  allyCount: document.querySelector("#ally-count"),
  enemyCount: document.querySelector("#enemy-count"),
  analyzeButton: document.querySelector("#analyze-button"),
  draftNote: document.querySelector("#draft-note"),
  resetButton: document.querySelector("#reset-button"),
  picker: document.querySelector("#champion-picker"),
  closePicker: document.querySelector("#close-picker"),
  pickerKicker: document.querySelector("#picker-kicker"),
  championSearch: document.querySelector("#champion-search"),
  championGrid: document.querySelector("#champion-grid"),
  championTotal: document.querySelector("#champion-total"),
  pickerEmpty: document.querySelector("#picker-empty"),
  resultPlaceholder: document.querySelector("#result-placeholder"),
  resultContent: document.querySelector("#result-content"),
  snapshotLabel: document.querySelector("#snapshot-label"),
  headerStatus: document.querySelector("#header-status"),
};

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function fallbackAvatar(name) {
  const initials = name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="220"><rect width="100%" height="100%" fill="#13263b"/><circle cx="90" cy="95" r="46" fill="#1b3950"/><text x="90" y="107" text-anchor="middle" font-family="sans-serif" font-size="30" fill="#41e3d4">${initials}</text></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function bindImageFallbacks(container = document) {
  container.querySelectorAll("img[data-fallback]").forEach((image) => {
    image.addEventListener("error", () => {
      image.src = fallbackAvatar(image.dataset.fallback || "WR");
    }, { once: true });
  });
}

function applyTranslations() {
  document.documentElement.lang = state.language;
  document.title = state.language === "tr" ? "RiftDraft — Wild Rift Kompozisyon Analizi" : "RiftDraft — Wild Rift Comp Analyzer";

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-html]").forEach((element) => {
    element.innerHTML = t(element.dataset.i18nHtml);
  });
  document.querySelectorAll("[data-i18n-aria]").forEach((element) => {
    element.setAttribute("aria-label", t(element.dataset.i18nAria));
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
    element.setAttribute("placeholder", t(element.dataset.i18nPlaceholder));
  });
  document.querySelectorAll("[data-role-label]").forEach((element) => {
    element.textContent = roleName(element.dataset.roleLabel);
  });
  document.querySelectorAll(".language-button").forEach((button) => {
    const active = button.dataset.language === state.language;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  if (state.pickerTarget) {
    elements.pickerKicker.textContent = state.pickerTarget.team === "ally" ? t("addToAlly") : t("addToEnemy");
  }
  updateDataStatus();
  renderAllSlots();
  if (state.lastResult) renderResult(state.lastResult, false);
  if (elements.picker.open) renderChampionGrid();
}

function setLanguage(language) {
  if (!messages[language] || language === state.language) return;
  state.language = language;
  localStorage.setItem("riftdraft-language", language);
  applyTranslations();
}

function normalizeSearch(value) {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

function editDistance(left, right) {
  const rows = Array.from({ length: left.length + 1 }, (_, index) => [index]);
  for (let column = 0; column <= right.length; column += 1) rows[0][column] = column;
  for (let row = 1; row <= left.length; row += 1) {
    for (let column = 1; column <= right.length; column += 1) {
      const substitution = left[row - 1] === right[column - 1] ? 0 : 1;
      rows[row][column] = Math.min(
        rows[row - 1][column] + 1,
        rows[row][column - 1] + 1,
        rows[row - 1][column - 1] + substitution,
      );
      if (
        row > 1 && column > 1
        && left[row - 1] === right[column - 2]
        && left[row - 2] === right[column - 1]
      ) {
        rows[row][column] = Math.min(rows[row][column], rows[row - 2][column - 2] + 1);
      }
    }
  }
  return rows[left.length][right.length];
}

function fuzzyScore(query, champion) {
  const normalizedQuery = normalizeSearch(query);
  if (!normalizedQuery) return 0;
  const candidates = [champion.name, ...champion.search.split(/\s+/)].map(normalizeSearch).filter(Boolean);
  let best = -1;

  candidates.forEach((candidate) => {
    if (candidate === normalizedQuery) best = Math.max(best, 1000);
    else if (candidate.startsWith(normalizedQuery)) best = Math.max(best, 850 - (candidate.length - normalizedQuery.length));
    else if (candidate.includes(normalizedQuery)) best = Math.max(best, 700 - candidate.indexOf(normalizedQuery));
    else {
      let queryIndex = 0;
      let gaps = 0;
      for (let index = 0; index < candidate.length && queryIndex < normalizedQuery.length; index += 1) {
        if (candidate[index] === normalizedQuery[queryIndex]) queryIndex += 1;
        else if (queryIndex > 0) gaps += 1;
      }
      if (queryIndex === normalizedQuery.length) best = Math.max(best, 500 - gaps);

      const allowedDistance = normalizedQuery.length <= 4 ? 1 : Math.max(2, Math.floor(normalizedQuery.length * .3));
      if (Math.abs(candidate.length - normalizedQuery.length) <= allowedDistance) {
        const distance = editDistance(normalizedQuery, candidate);
        if (distance <= allowedDistance) best = Math.max(best, 400 - distance * 30);
      }
    }
  });
  return best;
}

function formatDate(compactDate) {
  if (!/^\d{8}$/.test(compactDate || "")) return t("latestAvailable");
  const date = new Date(`${compactDate.slice(0, 4)}-${compactDate.slice(4, 6)}-${compactDate.slice(6, 8)}T12:00:00Z`);
  return new Intl.DateTimeFormat(state.language === "tr" ? "tr-TR" : "en", { day: "numeric", month: "short", year: "numeric" }).format(date);
}

function normalizeChampion(raw, page = null) {
  const avatarUrl = raw.avatar
    ? new URL(raw.avatar.replace(/^\/+/, ""), ASSET_BASE).href
    : new URL(`data/avatars/${raw.id}.png`, ASSET_BASE).href;
  return {
    id: String(raw.id),
    name: raw.displayName,
    search: `${raw.displayName} ${raw.riotSlug || ""}`.toLowerCase(),
    avatarUrl,
    cardUrl: page?.cardImageUrl || avatarUrl,
  };
}

function buildFallbackData() {
  const unique = new Map();
  const stats = {};
  Object.entries(fallbackRows).forEach(([role, rows]) => {
    stats[role] = rows.map(([id, name, winRate, pickRate, banRate]) => {
      if (!unique.has(id)) {
        unique.set(id, normalizeChampion({ id, displayName: name, riotSlug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-") }));
      }
      return { championId: id, winRate, pickRate, banRate };
    });
  });
  return { champions: [...unique.values()], stats };
}

async function loadData() {
  try {
    const [latestResponse, championsResponse, pagesResponse, matchupsResponse, historyResponse, signalsResponse] = await Promise.all([
      fetch(new URL("latest.v1.json", DATA_BASE), { cache: "no-store" }),
      fetch(new URL("champions.v1.json", DATA_BASE), { cache: "no-store" }),
      fetch(new URL("champion-pages.index.v1.json", DATA_BASE), { cache: "no-store" }),
      fetch(new URL("matchups.v1.json", DATA_BASE), { cache: "no-store" }),
      fetch(new URL("history.v1.json", DATA_BASE), { cache: "no-store" }),
      fetch(new URL("champion-signals.v1.json", DATA_BASE), { cache: "no-store" }),
    ]);
    if (![latestResponse, championsResponse, pagesResponse].every((response) => response.ok)) {
      throw new Error("One or more ranked data endpoints were unavailable.");
    }
    const [latest, championPayload, pagePayload, matchupPayload, historyPayload, signalPayload] = await Promise.all([
      latestResponse.json(), championsResponse.json(), pagesResponse.json(),
      matchupsResponse.ok ? matchupsResponse.json() : Promise.resolve({ champions: {} }),
      historyResponse.ok ? historyResponse.json() : Promise.resolve({ champions: {} }),
      signalsResponse.ok ? signalsResponse.json() : Promise.resolve({ champions: {} }),
    ]);

    const pages = pagePayload.champions || {};
    state.champions = Object.values(championPayload.champions || {})
      .filter((champion) => champion.displayName)
      .map((champion) => normalizeChampion(champion, pages[champion.id]))
      .sort((a, b) => a.name.localeCompare(b.name));

    const tier = latest.tiers?.[RANK_BUCKET];
    if (!tier) throw new Error("Diamond+ statistics were missing from the response.");
    state.stats = Object.fromEntries(Object.entries(tier).map(([role, rows]) => [
      role,
      rows.map(([championId, winRate, pickRate, banRate]) => ({ championId, winRate, pickRate, banRate })),
    ]));
    state.matchups = matchupPayload.champions || {};
    state.matchupDate = matchupPayload.dataDate || null;
    state.history = historyPayload.champions || {};
    state.historyDate = historyPayload.dataDate || null;
    state.signals = signalPayload.champions || {};
    state.statDate = latest.statDate;
    state.source = "live";
  } catch (error) {
    console.warn("Using bundled ranked snapshot:", error);
    const fallback = buildFallbackData();
    state.champions = fallback.champions.sort((a, b) => a.name.localeCompare(b.name));
    state.stats = fallback.stats;
    state.matchups = {};
    state.matchupDate = null;
    state.history = {};
    state.historyDate = null;
    state.signals = {};
    state.source = "fallback";
  }

  state.championMap = new Map(state.champions.map((champion) => [champion.id, champion]));
  state.ready = true;
  updateDataStatus();
  updateAnalyzeState();
  if (elements.picker.open) renderChampionGrid();
}

function updateDataStatus() {
  elements.snapshotLabel.textContent = formatDate(state.statDate);
  elements.headerStatus.classList.remove("live", "fallback");
  if (state.source === "live" || state.source === "fallback") elements.headerStatus.classList.add(state.source);
  elements.headerStatus.querySelector("span:last-child").textContent = state.source === "loading"
    ? t("statusConnecting")
    : t(state.source === "live" ? "statusLive" : "statusCached");
}

function selectedIds() {
  return new Set([...state.teams.ally, ...state.teams.enemy].filter(Boolean));
}

function renderSlots(team) {
  const container = elements[`${team}Slots`];
  container.replaceChildren();
  state.teams[team].forEach((championId, index) => {
    const slotRole = SLOT_ROLES[index];
    const button = document.createElement("button");
    button.type = "button";
    button.className = "champion-slot";
    button.dataset.team = team;
    button.dataset.index = String(index);
    button.dataset.role = slotRole;

    if (championId) {
      const champion = state.championMap.get(championId);
      if (!champion) return;
      button.classList.add("filled");
      const teamLabel = t(team === "ally" ? "allyTeam" : "enemyTeamLabel");
      button.setAttribute("aria-label", t("removeChampion", { name: champion.name, team: teamLabel }));
      button.innerHTML = `
        <img src="${escapeHtml(champion.avatarUrl)}" alt="" data-fallback="${escapeHtml(champion.name)}">
        <span class="slot-role"><span aria-hidden="true">${ROLE_ICONS[slotRole]}</span>${escapeHtml(roleName(slotRole))}</span>
        <span class="remove-hint" aria-hidden="true">×</span>
        <span class="selected-name">${escapeHtml(champion.name)}</span>`;
      button.addEventListener("click", () => removeChampion(team, index));
    } else {
      const teamLabel = t(team === "ally" ? "allyTeam" : "enemyTeamLabel");
      button.setAttribute("aria-label", t("addSlot", { team: teamLabel, role: roleName(slotRole) }));
      button.innerHTML = `
        <span class="slot-role"><span aria-hidden="true">${ROLE_ICONS[slotRole]}</span>${escapeHtml(roleName(slotRole))}</span>
        <span class="plus-icon">+</span>
        <span class="slot-label">${escapeHtml(roleName(slotRole))}</span>`;
      button.addEventListener("click", () => openPicker(team, index));
    }
    container.append(button);
  });
  bindImageFallbacks(container);
  elements[`${team}Count`].textContent = `${state.teams[team].filter(Boolean).length} / 5`;
}

function renderAllSlots() {
  renderSlots("ally");
  renderSlots("enemy");
  updateAnalyzeState();
}

function openPicker(team, index) {
  if (!state.ready) return;
  state.pickerTarget = { team, index };
  state.pickerRole = SLOT_ROLES[index];
  elements.pickerKicker.textContent = t("pickerLane", {
    team: t(team === "ally" ? "addToAlly" : "addToEnemy"),
    role: roleName(state.pickerRole),
  });
  elements.championSearch.value = "";
  renderChampionGrid();
  elements.picker.showModal();
  requestAnimationFrame(() => elements.championSearch.focus());
}

function closePicker() {
  if (elements.picker.open) elements.picker.close();
  state.pickerTarget = null;
}

function renderChampionGrid() {
  const query = elements.championSearch.value.trim();
  const drafted = selectedIds();
  const eligibleIds = state.pickerRole === "all"
    ? null
    : new Set((state.stats[state.pickerRole] || []).map((entry) => String(entry.championId)));
  const filtered = state.champions
    .filter((champion) => !eligibleIds || eligibleIds.has(champion.id))
    .map((champion) => ({ champion, score: fuzzyScore(query, champion) }))
    .filter(({ score }) => score >= 0)
    .sort((left, right) => query
      ? right.score - left.score || left.champion.name.localeCompare(right.champion.name)
      : left.champion.name.localeCompare(right.champion.name))
    .map(({ champion }) => champion);
  elements.championGrid.replaceChildren();

  filtered.forEach((champion) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "picker-champion";
    button.disabled = drafted.has(champion.id);
    button.setAttribute("aria-label", drafted.has(champion.id)
      ? t("alreadyDrafted", { name: champion.name })
      : t("chooseName", { name: champion.name }));
    button.innerHTML = `<img src="${escapeHtml(champion.avatarUrl)}" alt="" loading="lazy" data-fallback="${escapeHtml(champion.name)}"><span>${escapeHtml(champion.name)}</span>`;
    button.addEventListener("click", () => selectChampion(champion.id));
    elements.championGrid.append(button);
  });

  bindImageFallbacks(elements.championGrid);
  elements.championTotal.textContent = t("championCount", { shown: filtered.length, total: state.champions.length });
  elements.pickerEmpty.hidden = filtered.length > 0;
}

function selectChampion(championId) {
  if (!state.pickerTarget) return;
  const { team, index } = state.pickerTarget;
  state.teams[team][index] = championId;
  closePicker();
  renderAllSlots();
  clearResult();
}

function removeChampion(team, index) {
  state.teams[team][index] = null;
  renderAllSlots();
  clearResult();
}

function updateAnalyzeState() {
  const count = selectedIds().size;
  elements.analyzeButton.disabled = !state.ready || count === 0;
  if (!state.ready) {
    elements.draftNote.textContent = t("loadingData");
  } else if (count === 0) {
    elements.draftNote.textContent = t("selectToBegin");
  } else {
    elements.draftNote.textContent = t("draftedReady", {
      count,
      plural: state.language === "en" && count !== 1 ? "s" : "",
      role: roleName(state.selectedRole),
    });
  }
}

function clearResult() {
  state.lastResult = null;
  elements.resultPlaceholder.hidden = false;
  elements.resultContent.hidden = true;
  elements.resultContent.replaceChildren();
}

function enemyForRole(role) {
  const slotIndex = SLOT_ROLES.indexOf(String(role));
  return slotIndex < 0 ? null : state.teams.enemy[slotIndex];
}

function observedMatchup(championId, role, enemyId) {
  return state.matchups[String(championId)]?.[String(role)]?.[String(enemyId)] || null;
}

function championProfile(championId) {
  const signal = state.signals[String(championId)] || {};
  const roles = new Set(signal.roles || []);
  return {
    frontline: Math.max(roles.has("TANK") ? 1 : 0, roles.has("FIGHTER") ? .6 : 0, roles.has("SUPPORT") ? .2 : 0),
    control: Math.max(Number(signal.control) || 0, roles.has("TANK") ? .4 : 0, roles.has("SUPPORT") ? .25 : 0, roles.has("MAGE") ? .15 : 0),
    protection: Math.max(Number(signal.sustain) || 0, roles.has("SUPPORT") ? .75 : 0, roles.has("TANK") ? .2 : 0),
    carry: Math.max(roles.has("MARKSMAN") ? 1 : 0, roles.has("MAGE") ? .85 : 0, roles.has("ASSASSIN") ? .8 : 0, roles.has("FIGHTER") ? .55 : 0),
    access: Math.max(Number(signal.mobility) || 0, roles.has("ASSASSIN") ? 1 : 0, roles.has("FIGHTER") ? .45 : 0),
    available: Boolean(signal.roles?.length),
  };
}

function allyPairFit(candidate, ally) {
  return (
    candidate.frontline * ally.carry
    + candidate.control * (ally.carry * .7 + ally.access * .3)
    + candidate.protection * ally.carry
    + candidate.carry * (ally.frontline * .7 + ally.control * .3)
    + candidate.access * ally.control
  ) / 5;
}

function enemyPairResponse(candidate, enemy) {
  return (
    candidate.frontline * enemy.access
    + candidate.control * (enemy.access * .65 + enemy.carry * .35)
    + candidate.protection * enemy.access
    + candidate.carry * enemy.frontline
    + candidate.access * enemy.carry
  ) / 5;
}

function average(values) {
  return values.length ? values.reduce((total, value) => total + value, 0) / values.length : 0;
}

function normalizeScores(entries, rawKey, scoreKey, active) {
  const values = entries.map((entry) => entry[rawKey]).filter(Number.isFinite);
  const minimum = Math.min(...values);
  const maximum = Math.max(...values);
  entries.forEach((entry) => {
    if (!active || !Number.isFinite(entry[rawKey]) || !values.length || maximum === minimum) {
      entry[scoreKey] = 50;
    } else {
      entry[scoreKey] = Math.round(((entry[rawKey] - minimum) / (maximum - minimum)) * 100);
    }
  });
}

function analyzeComposition() {
  const unavailable = selectedIds();
  const enemyId = enemyForRole(state.selectedRole);
  const allies = state.teams.ally.filter(Boolean);
  const enemies = state.teams.enemy.filter(Boolean);
  const allyProfiles = allies.map(championProfile).filter((profile) => profile.available);
  const enemyProfiles = enemies.map(championProfile).filter((profile) => profile.available);
  let available = [...(state.stats[state.selectedRole] || [])]
    .filter((entry) => !unavailable.has(String(entry.championId)))
    .map((entry) => {
      const candidate = championProfile(entry.championId);
      const historical = state.history[String(entry.championId)]?.[state.selectedRole] || null;
      return {
        ...entry,
        matchup: enemyId ? observedMatchup(entry.championId, state.selectedRole, enemyId) : null,
        historical,
        trendRaw: historical ? entry.winRate - historical.winRate : null,
        enemyRaw: enemyProfiles.length ? average(enemyProfiles.map((enemy) => enemyPairResponse(candidate, enemy))) : null,
        allyRaw: allyProfiles.length ? average(allyProfiles.map((ally) => allyPairFit(candidate, ally))) : null,
      };
    });
  const useMatchups = Boolean(enemyId && available.some((entry) => entry.matchup));
  if (useMatchups) available = available.filter((entry) => entry.matchup);
  available.forEach((entry) => { entry.matchupRaw = entry.matchup?.winRate ?? null; });
  const useTrend = available.some((entry) => Number.isFinite(entry.trendRaw));
  const useEnemyEstimate = enemyProfiles.length > 0;
  const useAllyEstimate = allyProfiles.length > 0;

  normalizeScores(available, "winRate", "roleScore", true);
  normalizeScores(available, "matchupRaw", "matchupScore", useMatchups);
  normalizeScores(available, "trendRaw", "trendScore", useTrend);
  normalizeScores(available, "enemyRaw", "enemyScore", useEnemyEstimate);
  normalizeScores(available, "allyRaw", "allyScore", useAllyEstimate);

  const weights = [
    ["roleScore", 30, true],
    ["matchupScore", 30, useMatchups],
    ["enemyScore", 15, useEnemyEstimate],
    ["allyScore", 15, useAllyEstimate],
    ["trendScore", 10, useTrend],
  ].filter(([, , active]) => active);
  const totalWeight = weights.reduce((total, [, weight]) => total + weight, 0);
  const ranking = available.map((entry) => ({
    ...entry,
    evidenceScore: Math.round(weights.reduce((total, [key, weight]) => total + entry[key] * weight, 0) / totalWeight),
    evidence: { useMatchups, useTrend, useEnemyEstimate, useAllyEstimate },
    coverage: { enemies: enemyProfiles.length, allies: allyProfiles.length },
  })).sort((left, right) => right.evidenceScore - left.evidenceScore || right.winRate - left.winRate);
  const top = ranking.filter((entry) => state.championMap.has(String(entry.championId))).slice(0, 3);
  if (!top.length) {
    elements.draftNote.textContent = t("noPositionData");
    return;
  }
  renderResult(top);
}

function renderResult(entries, shouldScroll = true) {
  state.lastResult = entries;
  const [best, ...alternatives] = entries;
  const champion = state.championMap.get(String(best.championId));
  const role = roleName(state.selectedRole);
  const enemyId = enemyForRole(state.selectedRole);
  const enemy = enemyId ? state.championMap.get(String(enemyId)) : null;
  const isMatchup = best.evidence.useMatchups && best.matchup && enemy;
  const trendText = Number.isFinite(best.trendRaw)
    ? t("trendPoints", { value: `${best.trendRaw >= 0 ? "+" : ""}${best.trendRaw.toFixed(2)}` })
    : t("trendUnavailable");
  const matchupText = isMatchup
    ? t("directMatchupPhrase", { enemy: enemy.name, rate: best.matchup.winRate.toFixed(2) })
    : t("noMatchupPhrase");
  const alternativesHtml = alternatives.map((entry, index) => {
    const option = state.championMap.get(String(entry.championId));
    return `<div class="alternative">
      <img src="${escapeHtml(option.avatarUrl)}" alt="" data-fallback="${escapeHtml(option.name)}">
      <b>${index + 2}. ${escapeHtml(option.name)}</b>
      <span>${t("evidenceShort", { score: entry.evidenceScore })}</span>
    </div>`;
  }).join("");

  const breakdown = [
    ["observedLane", best.matchupScore, best.evidence.useMatchups, "observedLabel"],
    ["roleStrength", best.roleScore, true, "observedLabel"],
    ["enemyResponse", best.enemyScore, best.evidence.useEnemyEstimate, "estimatedLabel"],
    ["allySynergy", best.allyScore, best.evidence.useAllyEstimate, "estimatedLabel"],
    ["historicalTrend", best.trendScore, best.evidence.useTrend, "observedLabel"],
  ].filter(([, , active]) => active).map(([label, score, , type]) => `
    <div class="evidence-row">
      <div><span>${t(label)}</span><small>${t(type)}</small><strong>${score}</strong></div>
      <div class="evidence-track"><i style="width:${score}%"></i></div>
    </div>`).join("");
  const explanation = t("evidenceExplanation", {
    name: champion.name,
    score: best.evidenceScore,
    role,
    matchup: matchupText,
    winRate: best.winRate.toFixed(2),
    trend: trendText,
    enemyCoverage: t(best.coverage.enemies === 1 ? "oneEnemy" : "manyEnemies", { count: best.coverage.enemies }),
    allyCoverage: t(best.coverage.allies === 1 ? "oneAlly" : "manyAllies", { count: best.coverage.allies }),
  });

  elements.resultContent.innerHTML = `
    <div class="result-hero">
      <img src="${escapeHtml(champion.cardUrl)}" alt="${escapeHtml(champion.name)}" data-fallback="${escapeHtml(champion.name)}">
      <span class="result-badge">${t("topRecommendation")}</span>
      <div class="result-title"><span>${t("highestEvidence")}</span><h2>${escapeHtml(champion.name)}</h2></div>
    </div>
    <div class="result-body">
      <div class="winrate-callout">
        <div><span>${t("evidenceScore")}</span><div class="winrate">${best.evidenceScore}<small>/100</small></div></div>
        <div class="position-tag">${escapeHtml(role)}</div>
      </div>
      <div class="metric-grid">
        <div class="metric"><span>${isMatchup ? t("matchupWinRate", { enemy: escapeHtml(enemy.name) }) : t("noDirectMatchup")}</span><strong>${isMatchup ? `${best.matchup.winRate.toFixed(2)}%` : "—"}</strong></div>
        <div class="metric"><span>${t("diamondWinRate")}</span><strong>${best.winRate.toFixed(2)}%</strong></div>
        <div class="metric"><span>${t("historyChange", { date: formatDate(state.historyDate) })}</span><strong>${escapeHtml(trendText)}</strong></div>
      </div>
      <div class="evidence-breakdown">${breakdown}</div>
      <p class="why-copy"><strong>${t("whyThisPick")}</strong> ${escapeHtml(explanation)}</p>
      <div class="alternatives-label">${t("nextBest")}</div>
      ${alternativesHtml}
    </div>`;
  bindImageFallbacks(elements.resultContent);
  elements.resultPlaceholder.hidden = true;
  elements.resultContent.hidden = false;
  if (shouldScroll && window.matchMedia("(max-width: 1050px)").matches) {
    elements.resultContent.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function resetDraft() {
  state.teams.ally.fill(null);
  state.teams.enemy.fill(null);
  renderAllSlots();
  clearResult();
}

document.querySelectorAll(".role-button").forEach((button) => {
  button.addEventListener("click", () => {
    state.selectedRole = button.dataset.role;
    document.querySelectorAll(".role-button").forEach((roleButton) => {
      const active = roleButton === button;
      roleButton.classList.toggle("active", active);
      roleButton.setAttribute("aria-checked", String(active));
    });
    updateAnalyzeState();
    clearResult();
  });
});

document.querySelectorAll(".language-button").forEach((button) => {
  button.addEventListener("click", () => setLanguage(button.dataset.language));
});

elements.analyzeButton.addEventListener("click", analyzeComposition);
elements.resetButton.addEventListener("click", resetDraft);
elements.closePicker.addEventListener("click", closePicker);
elements.championSearch.addEventListener("input", renderChampionGrid);
elements.picker.addEventListener("click", (event) => {
  if (event.target === elements.picker) closePicker();
});

applyTranslations();
loadData();
