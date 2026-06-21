const DATA_BASE = new URL("./data/", import.meta.url);
const ASSET_BASE = "https://rankedwr.com/";
const SLOT_ROLES = ["2", "5", "1", "3", "4"];
const ROLE_ICONS = { "1": "◇", "2": "◈", "3": "➹", "4": "✦", "5": "⌁" };

const messages = {
  en: {
    primaryNav: "Primary navigation", language: "Language", dataFilters: "Data filters", analyzerRegion: "Team composition analyzer", navAnalyzer: "Analyzer", navMethod: "Method",
    statusConnecting: "Connecting to ranked data", statusLive: "Live ranked snapshot", statusCached: "Cached ranked snapshot",
    eyebrow: "Wild Rift draft intelligence", heroTitle: "Build the draft.<br><em>Find the edge.</em>",
    heroCopy: "Set either team and instantly see the top three available picks for every open allied lane.",
    region: "Region", chinaServer: "China server", rank: "Rank", snapshot: "Snapshot", latestAvailable: "Latest available",
    buildDraft: "Build your draft", resetDraft: "Reset draft", yourTeam: "Your team", allyHint: "Select known allied champions",
    enemyTeam: "Enemy team", enemyHint: "Select revealed enemy champions", autoRankTitle: "Automatic team recommendations",
    autoRankHint: "Top picks for every open allied lane update immediately as the draft changes.", resultPlaceholderTitle: "Building live<br>recommendations", resultPlaceholderCopy: "Loading the latest lane rankings and draft signals.",
    pickTiming: "Pick timing", timingAuto: "Auto", timingEarly: "Early", timingMiddle: "Mid", timingLast: "Last", timingModeSummary: "Timing · {mode}", timingModeAuto: "{mode} (auto)",
    howItWorks: "How it works", methodTitle: "Every signal stays visible.", methodDraftTitle: "Observed evidence",
    methodDraftCopy: "Observed lane matchups, calibrated Diamond+ role strength, blind-pick safety, and historical change remain separate evidence components.", methodRoleTitle: "Joint draft search",
    methodRoleCopy: "Every recommendation is scored inside complete, duplicate-free lineup projections across all remaining lanes.", methodWinTitle: "Walk-forward calibration",
    methodWinCopy: "Daily snapshots are archived and tested only against later snapshots; until enough dates exist, calibration is explicitly marked as collecting.",
    methodDisclaimer: "Lane matchup, blind safety, role strength, and historical change use published statistics. Enemy response uses observed pairings when available and a labeled class-based fallback otherwise; ally synergy remains an estimate. Joint-plan scores are not composition win rates or win probabilities.",
    footerCopy: "Diamond+ role data via RankedWR, observed lane matchups via RiftGG, and historical comparison via statsWR. Team-fit estimates use official Riot champion information. Not affiliated with Riot Games.",
    viewSource: "View source", chooseChampion: "Choose a champion", closePicker: "Close champion picker", closeDetails: "Close details", compactDraft: "Compact draft",
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
    confidenceTitle: "Data coverage", confidenceHigh: "Strong", confidenceMedium: "Partial", confidenceLimited: "Limited",
    confidenceDetail: "{coverage}% applicable source coverage · current data {freshness}", confidenceNote: "Coverage measures available sources and freshness, not certainty of winning.",
    freshnessToday: "updated today", freshnessOneDay: "1 day old", freshnessDays: "{days} days old", freshnessUnknown: "age unavailable",
    counterMatrix: "Enemy counter matrix", counterMatrixHint: "How this pick answers every selected enemy", synergyMatrix: "Ally synergy matrix", synergyMatrixHint: "How this pick complements every selected ally",
    observedWinShort: "{rate}% observed", responseScoreShort: "{score}/100 response", synergyScoreShort: "{score}/100 synergy",
    reasonFrontline: "Frontline", reasonControl: "CC setup", reasonProtection: "Peel & sustain", reasonFollowup: "Damage follow-up", reasonAccess: "Engage follow-up", reasonGeneral: "Role complement",
    dashboardTitle: "Best picks for every open lane", dashboardCopy: "Each lane shows its top three available champions and updates automatically.", openLaneCount: "{count} open lane{plural}", topThree: "Top 3", bestPick: "Best pick", noOpenLanes: "Your allied lineup is complete.",
    counterSummary: "Enemy response", synergySummary: "Ally synergy", noCounterSignals: "No enemies selected", noSynergySignals: "No allies selected",
    tapToDraft: "Tap to draft", draftRecommendation: "Draft {name} in {role}", addedRecommendation: "{name} added to {role}", undo: "Undo", laneNavigation: "Recommendation lanes", coverageShort: "{score}% coverage",
    jointProjection: "{score}/100 joint plan", optimizerSummary: "Joint search · {count} projected lineups", calibrationCollecting: "Calibration collecting ({count} snapshot)", calibrationCollectingMany: "Calibration collecting ({count} snapshots)", calibrationReady: "Calibrated on {count} later observations", observedProxy: "Observed", estimatedProxy: "Estimated",
    whyPick: "Why?", whyName: "Why {name}?", pickDetailsKicker: "Recommendation details", componentBreakdown: "Score breakdown", projectedTeam: "Projected team", draftThisPick: "Draft {name}", blindSafety: "Blind-pick safety",
    scoreExcellent: "Excellent", scoreStrong: "Strong", scoreGood: "Good", scoreSituational: "Situational", sourceFreshness: "Data freshness", sourcesTitle: "Source freshness", sourcesKicker: "Published data", sourceRanked: "RankedWR role data", sourceMatchups: "RiftGG matchups", sourceHistory: "statsWR history", sourceCalibration: "Walk-forward calibration", sourceDate: "{date} · {freshness}", sourceCollecting: "Collecting later snapshots",
    role1: "Mid", role2: "Solo", role3: "Duo", role4: "Support", role5: "Jungle",
  },
  tr: {
    primaryNav: "Ana gezinme", language: "Dil", dataFilters: "Veri filtreleri", analyzerRegion: "Takım kompozisyonu analiz aracı", navAnalyzer: "Analiz", navMethod: "Yöntem",
    statusConnecting: "Dereceli verilere bağlanılıyor", statusLive: "Canlı dereceli veri", statusCached: "Önbellekteki dereceli veri",
    eyebrow: "Wild Rift seçim zekâsı", heroTitle: "Kompozisyonu kur.<br><em>Avantajı yakala.</em>",
    heroCopy: "İki takımı seç ve her boş takım koridoru için en iyi üç uygun seçimi anında gör.",
    region: "Bölge", chinaServer: "Çin sunucusu", rank: "Lig", snapshot: "Veri tarihi", latestAvailable: "En güncel veri",
    buildDraft: "Takım seçimini oluştur", resetDraft: "Seçimleri sıfırla", yourTeam: "Takımın", allyHint: "Bilinen takım şampiyonlarını seç",
    enemyTeam: "Rakip takım", enemyHint: "Gösterilen rakip şampiyonları seç", autoRankTitle: "Otomatik takım önerileri",
    autoRankHint: "Her boş takım koridoru için en iyi seçimler, kompozisyon değiştikçe anında güncellenir.", resultPlaceholderTitle: "Canlı öneriler<br>hazırlanıyor", resultPlaceholderCopy: "En güncel koridor sıralamaları ve seçim sinyalleri yükleniyor.",
    pickTiming: "Seçim zamanı", timingAuto: "Otomatik", timingEarly: "Erken", timingMiddle: "Orta", timingLast: "Son", timingModeSummary: "Zaman · {mode}", timingModeAuto: "{mode} (otomatik)",
    howItWorks: "Nasıl çalışır", methodTitle: "Her sinyal görünür kalır.", methodDraftTitle: "Gözlemlenmiş kanıt",
    methodDraftCopy: "Gözlemlenmiş koridor eşleşmeleri, kalibre edilmiş Elmas+ rol gücü, kör seçim güvenliği ve geçmiş değişim ayrı kanıt bileşenleri olarak kalır.", methodRoleTitle: "Ortak seçim araması",
    methodRoleCopy: "Her öneri, kalan tüm koridorlarda eksiksiz ve tekrarsız takım projeksiyonları içinde puanlanır.", methodWinTitle: "İleri tarihli kalibrasyon",
    methodWinCopy: "Günlük veriler arşivlenir ve yalnızca sonraki verilerle test edilir; yeterli tarih oluşana kadar kalibrasyon veri topluyor olarak gösterilir.",
    methodDisclaimer: "Koridor eşleşmesi, kör seçim güvenliği, rol gücü ve geçmiş değişim yayımlanmış istatistikleri kullanır. Rakip yanıtı varsa gözlemlenmiş eşleşmeyi, yoksa etiketli sınıf tahminini kullanır; takım sinerjisi tahmin olarak kalır. Ortak plan puanları kompozisyon kazanma oranı veya kazanma olasılığı değildir.",
    footerCopy: "RankedWR üzerinden Elmas+ rol verisi, RiftGG üzerinden gözlemlenmiş koridor eşleşmeleri ve statsWR üzerinden geçmiş karşılaştırma. Takım uyumu tahminleri resmi Riot şampiyon bilgilerini kullanır. Riot Games ile bağlantılı değildir.",
    viewSource: "Kaynağı görüntüle", chooseChampion: "Bir şampiyon seç", closePicker: "Şampiyon seçiciyi kapat", closeDetails: "Ayrıntıları kapat", compactDraft: "Kompakt seçim",
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
    confidenceTitle: "Veri kapsamı", confidenceHigh: "Güçlü", confidenceMedium: "Kısmi", confidenceLimited: "Sınırlı",
    confidenceDetail: "%{coverage} uygulanabilir kaynak kapsamı · güncel veri {freshness}", confidenceNote: "Kapsam, mevcut kaynakları ve güncelliği ölçer; kazanma kesinliği değildir.",
    freshnessToday: "bugün güncellendi", freshnessOneDay: "1 günlük", freshnessDays: "{days} günlük", freshnessUnknown: "veri yaşı bilinmiyor",
    counterMatrix: "Rakip karşılık matrisi", counterMatrixHint: "Bu seçimin seçilen her rakibe verdiği yanıt", synergyMatrix: "Takım sinerjisi matrisi", synergyMatrixHint: "Bu seçimin her takım arkadaşını nasıl tamamladığı",
    observedWinShort: "%{rate} gözlemlenmiş", responseScoreShort: "{score}/100 yanıt", synergyScoreShort: "{score}/100 sinerji",
    reasonFrontline: "Ön saf", reasonControl: "Kitle kontrolü", reasonProtection: "Koruma ve iyileştirme", reasonFollowup: "Hasar takibi", reasonAccess: "Başlatma takibi", reasonGeneral: "Rol tamamlayıcılığı",
    dashboardTitle: "Her boş koridor için en iyi seçimler", dashboardCopy: "Her koridorda en iyi üç uygun şampiyon gösterilir ve sonuçlar otomatik güncellenir.", openLaneCount: "{count} boş koridor", topThree: "İlk 3", bestPick: "En iyi seçim", noOpenLanes: "Takım kadron tamamlandı.",
    counterSummary: "Rakip yanıtı", synergySummary: "Takım sinerjisi", noCounterSignals: "Rakip seçilmedi", noSynergySignals: "Takım arkadaşı seçilmedi",
    tapToDraft: "Seçime ekle", draftRecommendation: "{name} şampiyonunu {role} için seç", addedRecommendation: "{name}, {role} için eklendi", undo: "Geri al", laneNavigation: "Öneri koridorları", coverageShort: "%{score} kapsam",
    jointProjection: "{score}/100 ortak plan", optimizerSummary: "Ortak arama · {count} takım projeksiyonu", calibrationCollecting: "Kalibrasyon veri topluyor ({count} anlık veri)", calibrationCollectingMany: "Kalibrasyon veri topluyor ({count} anlık veri)", calibrationReady: "Sonraki {count} gözlemle kalibre edildi", observedProxy: "Gözlemlenmiş", estimatedProxy: "Tahmin",
    whyPick: "Neden?", whyName: "Neden {name}?", pickDetailsKicker: "Öneri ayrıntıları", componentBreakdown: "Puan dağılımı", projectedTeam: "Öngörülen takım", draftThisPick: "{name} seç", blindSafety: "Kör seçim güvenliği",
    scoreExcellent: "Mükemmel", scoreStrong: "Güçlü", scoreGood: "İyi", scoreSituational: "Duruma bağlı", sourceFreshness: "Veri güncelliği", sourcesTitle: "Kaynak güncelliği", sourcesKicker: "Yayımlanmış veri", sourceRanked: "RankedWR rol verisi", sourceMatchups: "RiftGG eşleşmeleri", sourceHistory: "statsWR geçmişi", sourceCalibration: "İleri tarihli kalibrasyon", sourceDate: "{date} · {freshness}", sourceCollecting: "Sonraki anlık veriler toplanıyor",
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
  calibration: { status: "collecting", snapshotCount: 1, observations: 0, rolePickRateFullWeight: 5, actualSampleFullWeight: 1000, componentHalfLifeDays: 45 },
  statDate: "20260619",
  source: "loading",
  ready: false,
  lastResult: null,
  activeMobileRole: null,
  lastAutoPick: null,
  draftMode: localStorage.getItem("riftdraft-draft-mode") || "auto",
  optimizerMeta: { projectedLineups: 0 },
  analysisVersion: 0,
};

const elements = {
  allySlots: document.querySelector("#ally-slots"),
  enemySlots: document.querySelector("#enemy-slots"),
  allyCount: document.querySelector("#ally-count"),
  enemyCount: document.querySelector("#enemy-count"),
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
  timingButtons: document.querySelectorAll("[data-draft-mode]"),
  draftDock: document.querySelector("#draft-dock"),
  insightDialog: document.querySelector("#insight-dialog"),
  insightKicker: document.querySelector("#insight-kicker"),
  insightTitle: document.querySelector("#insight-title"),
  insightContent: document.querySelector("#insight-content"),
  closeInsight: document.querySelector("#close-insight"),
};

let optimizerWorker = null;
let optimizerRequestId = 0;
const optimizerRequests = new Map();

try {
  optimizerWorker = new Worker(new URL("./optimizer-worker.js?v=20260621a", import.meta.url), { type: "module" });
  optimizerWorker.addEventListener("message", (event) => {
    const request = optimizerRequests.get(event.data.id);
    if (!request) return;
    optimizerRequests.delete(event.data.id);
    request.resolve(event.data.result);
  });
  optimizerWorker.addEventListener("error", () => {
    optimizerRequests.forEach((request) => request.reject(new Error("Optimizer worker failed")));
    optimizerRequests.clear();
    optimizerWorker = null;
  });
} catch {
  optimizerWorker = null;
}

function requestWorkerOptimization(key, payload) {
  if (!optimizerWorker) return Promise.reject(new Error("Optimizer worker unavailable"));
  optimizerRequestId += 1;
  return new Promise((resolve, reject) => {
    optimizerRequests.set(optimizerRequestId, { resolve, reject });
    optimizerWorker.postMessage({ id: optimizerRequestId, key, payload });
  });
}

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
  elements.timingButtons.forEach((button) => {
    const active = button.dataset.draftMode === state.draftMode;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  if (state.pickerTarget) {
    elements.pickerKicker.textContent = state.pickerTarget.team === "ally" ? t("addToAlly") : t("addToEnemy");
  }
  updateDataStatus();
  renderAllSlots();
  if (state.ready) analyzeAllOpenRoles();
  if (elements.picker.open) renderChampionGrid();
}

function setLanguage(language) {
  if (!messages[language] || language === state.language) return;
  closeInsight();
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

function normalizeChampion(raw) {
  if (Array.isArray(raw)) {
    raw = { id: raw[0], displayName: raw[1], avatar: raw[2], riotSlug: raw[3] };
  }
  const avatarUrl = raw.avatar
    ? new URL(raw.avatar.replace(/^\/+/, ""), ASSET_BASE).href
    : new URL(`data/avatars/${raw.id}.png`, ASSET_BASE).href;
  return {
    id: String(raw.id),
    name: raw.displayName,
    search: `${raw.displayName} ${raw.riotSlug || ""}`.toLowerCase(),
    avatarUrl,
  };
}

function expandCompactMatchups(compact = {}) {
  return Object.fromEntries(Object.entries(compact).map(([championId, roles]) => [
    championId,
    Object.fromEntries(Object.entries(roles).map(([role, rows]) => [
      role,
      Object.fromEntries(rows.map(([enemyId, winRate, pickRate, sampleSize]) => [String(enemyId), { winRate, pickRate, sampleSize: Number(sampleSize) || null }])),
    ])),
  ]));
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
    const manifestResponse = await fetch(new URL("manifest.v1.json", DATA_BASE), { cache: "no-store" });
    if (!manifestResponse.ok) throw new Error("The data manifest was unavailable.");
    const manifest = await manifestResponse.json();
    const versionedUrl = (file) => {
      const url = new URL(file, DATA_BASE);
      url.searchParams.set("v", manifest.revision);
      return url;
    };
    const [latestResponse, championsResponse, matchupsResponse, historyResponse, signalsResponse, calibrationResponse] = await Promise.all([
      fetch(versionedUrl(manifest.files.ranked), { cache: "force-cache" }),
      fetch(versionedUrl(manifest.files.champions), { cache: "force-cache" }),
      fetch(versionedUrl(manifest.files.matchups), { cache: "force-cache" }),
      fetch(versionedUrl(manifest.files.history), { cache: "force-cache" }),
      fetch(versionedUrl(manifest.files.signals), { cache: "force-cache" }),
      fetch(versionedUrl(manifest.files.calibration), { cache: "force-cache" }),
    ]);
    if (![latestResponse, championsResponse].every((response) => response.ok)) {
      throw new Error("One or more ranked data endpoints were unavailable.");
    }
    const [latest, championPayload, matchupPayload, historyPayload, signalPayload, calibrationPayload] = await Promise.all([
      latestResponse.json(), championsResponse.json(),
      matchupsResponse.ok ? matchupsResponse.json() : Promise.resolve({ champions: {} }),
      historyResponse.ok ? historyResponse.json() : Promise.resolve({ champions: {} }),
      signalsResponse.ok ? signalsResponse.json() : Promise.resolve({ champions: {} }),
      calibrationResponse.ok ? calibrationResponse.json() : Promise.resolve(state.calibration),
    ]);

    state.champions = (championPayload.champions || [])
      .filter((champion) => Array.isArray(champion) ? champion[1] : champion.displayName)
      .map((champion) => normalizeChampion(champion))
      .sort((a, b) => a.name.localeCompare(b.name));

    const tier = latest.roles;
    if (!tier) throw new Error("Diamond+ statistics were missing from the response.");
    state.stats = Object.fromEntries(Object.entries(tier).map(([role, rows]) => [
      role,
      rows.map(([championId, winRate, pickRate, banRate, sampleSize]) => ({ championId, winRate, pickRate, banRate, sampleSize: Number(sampleSize) || null })),
    ]));
    state.matchups = expandCompactMatchups(matchupPayload.champions || {});
    state.matchupDate = matchupPayload.dataDate || null;
    state.history = historyPayload.champions || {};
    state.historyDate = historyPayload.dataDate || null;
    state.signals = signalPayload.champions || {};
    state.calibration = { ...state.calibration, ...calibrationPayload };
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
    state.calibration = { ...state.calibration, status: "collecting" };
    state.source = "fallback";
  }

  state.championMap = new Map(state.champions.map((champion) => [champion.id, champion]));
  state.ready = true;
  updateDataStatus();
  updateRecommendationState();
  analyzeAllOpenRoles();
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
  renderDraftDock();
  updateRecommendationState();
  requestAnimationFrame(updateDraftDockVisibility);
}

function renderDraftDock() {
  const renderTeam = (team) => `<div class="dock-team"><b>${t(team === "ally" ? "yourTeam" : "enemyTeam")}</b><div>${state.teams[team].map((championId, index) => {
    const role = SLOT_ROLES[index];
    const champion = championId ? state.championMap.get(String(championId)) : null;
    const label = champion
      ? t("removeChampion", { name: champion.name, team: t(team === "ally" ? "allyTeam" : "enemyTeamLabel") })
      : t("addSlot", { team: t(team === "ally" ? "allyTeam" : "enemyTeamLabel"), role: roleName(role) });
    return `<button type="button" class="dock-slot ${champion ? "filled" : ""}" data-dock-team="${team}" data-dock-index="${index}" aria-label="${escapeHtml(label)}" title="${escapeHtml(champion?.name || roleName(role))}">${champion
      ? `<img src="${escapeHtml(champion.avatarUrl)}" alt="" data-fallback="${escapeHtml(champion.name)}">`
      : `<span>${ROLE_ICONS[role]}</span>`}</button>`;
  }).join("")}</div></div>`;
  elements.draftDock.innerHTML = `${renderTeam("ally")}<span class="dock-versus">VS</span>${renderTeam("enemy")}`;
  bindImageFallbacks(elements.draftDock);
}

function updateDraftDockVisibility() {
  const draftPanel = document.querySelector(".draft-panel");
  if (!draftPanel) return;
  elements.draftDock.classList.toggle("visible", draftPanel.getBoundingClientRect().bottom < 92);
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
  elements.championGrid.replaceChildren();
  elements.pickerEmpty.hidden = true;
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
    button.innerHTML = `<img src="${escapeHtml(champion.avatarUrl)}" alt="" loading="lazy" decoding="async" data-fallback="${escapeHtml(champion.name)}"><span>${escapeHtml(champion.name)}</span>`;
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
  state.lastAutoPick = null;
  closePicker();
  renderAllSlots();
  analyzeAllOpenRoles();
}

function removeChampion(team, index) {
  state.teams[team][index] = null;
  state.lastAutoPick = null;
  renderAllSlots();
  analyzeAllOpenRoles();
}

function updateRecommendationState() {
  elements.draftNote.textContent = t(state.ready ? "autoRankHint" : "loadingData");
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

function allyPairReasons(candidate, ally) {
  const reasons = [
    ["reasonFrontline", candidate.frontline * ally.carry],
    ["reasonControl", candidate.control * (ally.carry * .7 + ally.access * .3)],
    ["reasonProtection", candidate.protection * ally.carry],
    ["reasonFollowup", candidate.carry * (ally.frontline * .7 + ally.control * .3)],
    ["reasonAccess", candidate.access * ally.control],
  ].sort((left, right) => right[1] - left[1]);
  const useful = reasons.filter(([, value]) => value >= .08).slice(0, 2).map(([key]) => key);
  return useful.length ? useful : ["reasonGeneral"];
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

function boundedScores(values) {
  if (!values.length) return [];
  const mean = average(values);
  const variance = average(values.map((value) => (value - mean) ** 2));
  const deviation = Math.sqrt(variance);
  return values.map((value) => deviation < .000001
    ? 50
    : Math.round(Math.max(15, Math.min(85, 50 + ((value - mean) / deviation) * 15))));
}

function normalizeScores(entries, rawKey, scoreKey, active) {
  const values = entries.map((entry) => entry[rawKey]).filter(Number.isFinite);
  const scores = boundedScores(values);
  let scoreIndex = 0;
  entries.forEach((entry) => {
    if (!active || !Number.isFinite(entry[rawKey]) || !values.length) {
      entry[scoreKey] = 50;
    } else {
      entry[scoreKey] = scores[scoreIndex];
      scoreIndex += 1;
    }
  });
}

function normalizePairDetails(entries, detailKey) {
  const championIds = [...new Set(entries.flatMap((entry) => entry[detailKey].map((detail) => detail.championId)))];
  championIds.forEach((championId) => {
    const details = entries.map((entry) => entry[detailKey].find((detail) => detail.championId === championId)).filter(Boolean);
    const values = details.map((detail) => detail.raw).filter(Number.isFinite);
    const scores = boundedScores(values);
    let scoreIndex = 0;
    details.forEach((detail) => {
      detail.score = !values.length || !Number.isFinite(detail.raw) ? 50 : scores[scoreIndex++];
    });
  });
}

function reliabilityFactor(appearanceRate, fullWeightAt = null, sampleSize = null) {
  const actualSample = Number(sampleSize);
  if (Number.isFinite(actualSample) && actualSample > 0) {
    return Math.max(.2, Math.min(1, Math.sqrt(actualSample / (state.calibration.actualSampleFullWeight || 1000))));
  }
  const rate = Math.max(0, Number(appearanceRate) || 0);
  const target = fullWeightAt || state.calibration.rolePickRateFullWeight || 5;
  return Math.max(.2, Math.min(1, Math.sqrt(rate / target)));
}

function shrinkToward(value, baseline, factor) {
  return baseline + (value - baseline) * factor;
}

function componentFreshness(compactDate) {
  const age = dataAgeDays(compactDate);
  if (!Number.isFinite(age)) return .35;
  const halfLife = state.calibration.componentHalfLifeDays || 45;
  return Math.max(.2, 2 ** (-age / halfLife));
}

function resolvedDraftMode() {
  if (state.draftMode !== "auto") return state.draftMode;
  const revealed = state.teams.enemy.filter(Boolean).length;
  if (revealed <= 1) return "early";
  if (revealed >= 4) return "last";
  return "middle";
}

function draftWeights() {
  return {
    early: { role: 38, blind: 25, matchup: 10, enemy: 7, ally: 12, trend: 8 },
    middle: { role: 32, blind: 15, matchup: 22, enemy: 12, ally: 12, trend: 7 },
    last: { role: 25, blind: 5, matchup: 36, enemy: 18, ally: 10, trend: 6 },
  }[resolvedDraftMode()];
}

function percentile(values, fraction) {
  if (!values.length) return null;
  const sorted = [...values].sort((left, right) => left - right);
  return sorted[Math.floor((sorted.length - 1) * fraction)];
}

function blindSafetyRaw(championId, role) {
  const records = Object.values(state.matchups[String(championId)]?.[String(role)] || {});
  return percentile(records.map((record) => shrinkToward(
    record.winRate,
    50,
    reliabilityFactor(record.pickRate, 3, record.sampleSize),
  )), .25);
}

function dataAgeDays(compactDate) {
  if (!/^\d{8}$/.test(compactDate || "")) return null;
  const date = new Date(`${compactDate.slice(0, 4)}-${compactDate.slice(4, 6)}-${compactDate.slice(6, 8)}T12:00:00Z`);
  return Math.max(0, Math.floor((Date.now() - date.getTime()) / 86400000));
}

function freshnessScore(compactDates) {
  const ages = compactDates.map(dataAgeDays).filter(Number.isFinite);
  if (!ages.length) return .5;
  const age = Math.max(...ages);
  if (age <= 7) return 1;
  if (age <= 30) return .9;
  if (age <= 90) return .75;
  if (age <= 180) return .6;
  return .45;
}

function confidenceFor(entry, context) {
  let expected = 2;
  let available = 1 + (entry.historical ? 1 : 0);
  if (context.hasLaneEnemy) {
    expected += 1;
    if (entry.matchup) available += 1;
  }
  if (context.enemyCount) {
    expected += 1;
    available += context.enemyProfileCount / context.enemyCount;
  }
  if (context.allyCount) {
    expected += 1;
    available += context.allyProfileCount / context.allyCount;
  }
  const coverage = Math.round((available / expected) * 100);
  const dates = [state.statDate];
  if (entry.matchup) dates.push(state.matchupDate);
  const freshness = freshnessScore(dates);
  const score = Math.round(coverage * .85 + freshness * 100 * .15);
  return {
    score,
    coverage,
    ageDays: dataAgeDays(state.statDate),
    levelKey: score >= 85 ? "confidenceHigh" : score >= 65 ? "confidenceMedium" : "confidenceLimited",
  };
}

function rankRole(role, additionalUnavailable = new Set()) {
  const unavailable = new Set([...selectedIds(), ...additionalUnavailable]);
  const enemyId = enemyForRole(role);
  const allies = state.teams.ally.filter(Boolean);
  const enemies = state.teams.enemy.filter(Boolean);
  const allyInputs = allies.map((championId) => ({ championId, profile: championProfile(championId) })).filter(({ profile }) => profile.available);
  const enemyInputs = enemies.map((championId) => ({ championId, profile: championProfile(championId) })).filter(({ profile }) => profile.available);
  let available = [...(state.stats[role] || [])]
    .filter((entry) => !unavailable.has(String(entry.championId)))
    .map((entry) => {
      const candidate = championProfile(entry.championId);
      const historical = state.history[String(entry.championId)]?.[role] || null;
      const enemyDetails = enemyInputs.map(({ championId, profile }) => {
        const observed = observedMatchup(entry.championId, role, championId);
        return {
          championId,
          observed,
          source: observed ? "observedProxy" : "estimatedProxy",
          raw: observed
            ? shrinkToward(observed.winRate, 50, reliabilityFactor(observed.pickRate, 3, observed.sampleSize))
            : enemyPairResponse(candidate, profile),
        };
      });
      const allyDetails = allyInputs.map(({ championId, profile }) => ({
        championId,
        raw: allyPairFit(candidate, profile),
        reasons: allyPairReasons(candidate, profile),
      }));
      return {
        ...entry,
        role,
        matchup: enemyId ? observedMatchup(entry.championId, role, enemyId) : null,
        historical,
        enemyDetails,
        allyDetails,
        roleRaw: shrinkToward(entry.winRate, 50, reliabilityFactor(entry.pickRate, null, entry.sampleSize)),
        blindRaw: blindSafetyRaw(entry.championId, role),
        trendRaw: historical ? (entry.winRate - historical.winRate) * reliabilityFactor(entry.pickRate, null, entry.sampleSize) : null,
      };
    });
  const useMatchups = Boolean(enemyId && available.some((entry) => entry.matchup));
  available.forEach((entry) => {
    entry.matchupRaw = entry.matchup
      ? shrinkToward(entry.matchup.winRate, 50, reliabilityFactor(entry.matchup.pickRate, 3, entry.matchup.sampleSize))
      : null;
  });
  const useBlindSafety = available.some((entry) => Number.isFinite(entry.blindRaw));
  const useTrend = available.some((entry) => Number.isFinite(entry.trendRaw));
  const useEnemyResponse = enemies.some((championId) => String(championId) !== String(enemyId));
  const useAllyEstimate = allyInputs.length > 0;

  normalizeScores(available, "roleRaw", "roleScore", true);
  normalizeScores(available, "blindRaw", "blindScore", useBlindSafety);
  normalizeScores(available, "matchupRaw", "matchupScore", useMatchups);
  normalizeScores(available, "trendRaw", "trendScore", useTrend);
  normalizePairDetails(available, "enemyDetails");
  normalizePairDetails(available, "allyDetails");
  available.forEach((entry) => {
    const responseDetails = entry.enemyDetails.filter((detail) => String(detail.championId) !== String(enemyId));
    entry.enemyScore = responseDetails.length ? average(responseDetails.map((detail) => detail.score)) : 50;
    entry.enemyObservedRatio = responseDetails.length ? responseDetails.filter((detail) => detail.observed).length / responseDetails.length : 0;
    entry.allyScore = entry.allyDetails.length ? average(entry.allyDetails.map((detail) => detail.score)) : 50;
  });

  const profile = draftWeights();
  const roleFreshness = componentFreshness(state.statDate);
  const matchupFreshness = componentFreshness(state.matchupDate);
  const trendFreshness = componentFreshness(state.historyDate);
  const observedEnemyRatio = available.length ? average(available.map((entry) => entry.enemyObservedRatio)) : 0;
  const weights = [
    ["roleScore", profile.role * roleFreshness, true],
    ["blindScore", profile.blind * matchupFreshness, useBlindSafety],
    ["matchupScore", profile.matchup * matchupFreshness, useMatchups],
    ["enemyScore", profile.enemy * matchupFreshness * (.35 + observedEnemyRatio * .65), useEnemyResponse],
    ["allyScore", profile.ally * .45, useAllyEstimate],
    ["trendScore", profile.trend * trendFreshness, useTrend],
  ].filter(([, , active]) => active);
  const totalWeight = weights.reduce((total, [, weight]) => total + weight, 0);
  const context = {
    hasLaneEnemy: Boolean(enemyId),
    enemyCount: enemies.length,
    allyCount: allies.length,
    enemyProfileCount: enemyInputs.length,
    allyProfileCount: allyInputs.length,
  };
  return available.map((entry) => {
    const ranked = {
      ...entry,
      evidenceScore: Math.round(weights.reduce((total, [key, weight]) => total + entry[key] * weight, 0) / totalWeight),
      evidence: { useMatchups, useBlindSafety, useTrend, useEnemyResponse, useAllyEstimate, draftMode: resolvedDraftMode() },
      coverage: { enemies: enemyInputs.length, allies: allyInputs.length },
    };
    ranked.confidence = confidenceFor(ranked, context);
    return ranked;
  }).sort((left, right) => right.evidenceScore - left.evidenceScore || right.winRate - left.winRate);
}

function freshnessText(ageDays) {
  if (!Number.isFinite(ageDays)) return t("freshnessUnknown");
  if (ageDays === 0) return t("freshnessToday");
  if (ageDays === 1) return t("freshnessOneDay");
  return t("freshnessDays", { days: ageDays });
}

function compactEnemySignals(entry) {
  if (!entry.enemyDetails.length) return `<span class="signal-empty">${t("noCounterSignals")}</span>`;
  return entry.enemyDetails.map((detail) => {
    const target = state.championMap.get(String(detail.championId));
    if (!target) return "";
    const value = detail.observed ? `${detail.observed.winRate.toFixed(1)}%` : `${detail.score}/100`;
    return `<span class="signal-chip"><img src="${escapeHtml(target.avatarUrl)}" alt="" loading="lazy" decoding="async" data-fallback="${escapeHtml(target.name)}"><b>${escapeHtml(target.name)}</b><em>${value} · ${t(detail.source)}</em></span>`;
  }).join("");
}

function compactAllySignals(entry) {
  if (!entry.allyDetails.length) return `<span class="signal-empty">${t("noSynergySignals")}</span>`;
  return entry.allyDetails.map((detail) => {
    const target = state.championMap.get(String(detail.championId));
    if (!target) return "";
    return `<span class="signal-chip"><img src="${escapeHtml(target.avatarUrl)}" alt="" loading="lazy" decoding="async" data-fallback="${escapeHtml(target.name)}"><b>${escapeHtml(target.name)}</b><em>${t(detail.reasons[0])}</em></span>`;
  }).join("");
}

function scoreLabelKey(score) {
  if (score >= 76) return "scoreExcellent";
  if (score >= 66) return "scoreStrong";
  if (score >= 56) return "scoreGood";
  return "scoreSituational";
}

function renderLaneRecommendation(group) {
  const [best] = group.entries;
  if (!best) return "";
  const picks = group.entries.map((entry, index) => {
    const champion = state.championMap.get(String(entry.championId));
    if (!champion) return "";
    const score = entry.projectedScore ?? entry.evidenceScore;
    return `<div class="ranked-pick-wrap ${index === 0 ? "best" : ""}">
      <button type="button" class="ranked-pick ${index === 0 ? "best" : ""}" data-pick-role="${group.role}" data-pick-champion="${escapeHtml(entry.championId)}" aria-label="${escapeHtml(t("draftRecommendation", { name: champion.name, role: roleName(group.role) }))}">
        <span class="pick-rank">${index + 1}</span>
        <img src="${escapeHtml(champion.avatarUrl)}" alt="" loading="lazy" decoding="async" data-fallback="${escapeHtml(champion.name)}">
        <div class="pick-identity"><small>${index === 0 ? t("bestPick") : `${t("topThree")} · ${index + 1}`}</small><b>${escapeHtml(champion.name)}</b><span>${entry.winRate.toFixed(2)}% WR · ${t("tapToDraft")}</span></div>
        <div class="pick-score"><strong>${score}</strong><small>/100</small><em>${t(scoreLabelKey(score))}</em></div>
      </button>
      <button type="button" class="pick-details" data-pick-details-role="${group.role}" data-pick-details-champion="${escapeHtml(entry.championId)}" aria-label="${escapeHtml(t("whyName", { name: champion.name }))}">${t("whyPick")}</button>
    </div>`;
  }).join("");
  const activeClass = state.activeMobileRole === group.role ? " mobile-active" : "";
  return `<section class="lane-recommendation${activeClass}" data-lane-role="${group.role}">
    <header><div><span class="lane-icon">${ROLE_ICONS[group.role]}</span><div><small>${t("topThree")}</small><h3>${escapeHtml(roleName(group.role))}</h3></div></div><strong>${t("coverageShort", { score: best.confidence.score })}</strong></header>
    <div class="ranked-picks">${picks}</div>
    <div class="lane-signal"><span>${t("counterSummary")}</span><div>${compactEnemySignals(best)}</div></div>
    <div class="lane-signal"><span>${t("synergySummary")}</span><div>${compactAllySignals(best)}</div></div>
    <div class="lane-confidence"><span>${t("confidenceTitle")}: <b>${t(best.confidence.levelKey)}</b></span><span>${t("confidenceDetail", { coverage: best.confidence.coverage, freshness: freshnessText(best.confidence.ageDays) })}</span></div>
  </section>`;
}

function autoPickNotice() {
  if (!state.lastAutoPick) return "";
  return `<div class="auto-pick-notice" role="status"><span>${escapeHtml(t("addedRecommendation", {
    name: state.lastAutoPick.name,
    role: roleName(state.lastAutoPick.role),
  }))}</span><button type="button" class="undo-pick">${t("undo")}</button></div>`;
}

function calibrationText() {
  if (state.calibration.status === "calibrated") {
    return t("calibrationReady", { count: state.calibration.observations });
  }
  const count = state.calibration.snapshotCount || 1;
  return t(count === 1 ? "calibrationCollecting" : "calibrationCollectingMany", { count });
}

function draftModeText() {
  const mode = resolvedDraftMode();
  const label = t(`timing${mode[0].toUpperCase()}${mode.slice(1)}`);
  return t("timingModeSummary", { mode: state.draftMode === "auto" ? t("timingModeAuto", { mode: label }) : label });
}

function renderAutomaticResults(groups) {
  state.lastResult = groups;
  if (!groups.some((group) => group.role === state.activeMobileRole)) {
    state.activeMobileRole = groups[0]?.role || null;
  }
  const notice = autoPickNotice();
  if (!groups.length) {
    elements.resultContent.innerHTML = `${notice}<div class="complete-lineup"><span>✓</span><h2>${t("noOpenLanes")}</h2></div>`;
  } else {
    const tabs = `<div class="mobile-lane-tabs" role="tablist" aria-label="${escapeHtml(t("laneNavigation"))}">${groups.map((group) => `<button type="button" class="lane-tab" role="tab" data-lane-tab="${group.role}" aria-selected="${group.role === state.activeMobileRole}"><span>${ROLE_ICONS[group.role]}</span>${escapeHtml(roleName(group.role))}</button>`).join("")}</div>`;
    elements.resultContent.innerHTML = `${notice}<div class="dashboard-header">
      <div><span class="section-number">03</span><h2>${t("dashboardTitle")}</h2><p>${t("dashboardCopy")}</p></div>
      <div class="dashboard-meta"><span>${t("openLaneCount", { count: groups.length, plural: state.language === "en" && groups.length !== 1 ? "s" : "" })}</span><span>${draftModeText()}</span><button type="button" class="source-details" data-source-details>${t("sourceFreshness")}</button></div>
    </div>${tabs}<div class="lane-dashboard-grid">${groups.map(renderLaneRecommendation).join("")}</div>`;
  }
  bindImageFallbacks(elements.resultContent);
  elements.resultPlaceholder.hidden = true;
  elements.resultContent.hidden = false;
}

function recommendationEntry(role, championId) {
  return state.lastResult
    ?.find((group) => String(group.role) === String(role))
    ?.entries.find((entry) => String(entry.championId) === String(championId));
}

function openInsight(kicker, title, content) {
  elements.insightKicker.textContent = kicker;
  elements.insightTitle.textContent = title;
  elements.insightContent.innerHTML = content;
  bindImageFallbacks(elements.insightContent);
  if (!elements.insightDialog.open) elements.insightDialog.showModal();
}

function closeInsight() {
  if (elements.insightDialog.open) elements.insightDialog.close();
  elements.insightContent.replaceChildren();
}

function openRecommendationDetails(role, championId) {
  const entry = recommendationEntry(role, championId);
  const champion = state.championMap.get(String(championId));
  if (!entry || !champion) return;
  const components = [
    ["roleStrength", entry.roleScore, true],
    ["blindSafety", entry.blindScore, entry.evidence.useBlindSafety],
    ["observedLane", entry.matchupScore, entry.evidence.useMatchups],
    ["enemyResponse", entry.enemyScore, entry.evidence.useEnemyResponse],
    ["allySynergy", entry.allyScore, entry.evidence.useAllyEstimate],
    ["historicalTrend", entry.trendScore, entry.evidence.useTrend],
  ].filter(([, score, active]) => active && Number.isFinite(score));
  const projectedIds = [...new Set([
    ...state.teams.ally.filter(Boolean),
    ...(entry.projectedLineup || []),
  ].map(String))];
  const score = entry.projectedScore ?? entry.evidenceScore;
  const rows = components.map(([key, value]) => `<div class="insight-score-row"><div><span>${t(key)}</span><strong>${Math.round(value)}</strong></div><i><b style="width:${Math.max(0, Math.min(100, value))}%"></b></i></div>`).join("");
  const projected = projectedIds.map((id) => {
    const member = state.championMap.get(id);
    return member ? `<span class="projected-champion"><img src="${escapeHtml(member.avatarUrl)}" alt="" data-fallback="${escapeHtml(member.name)}"><b>${escapeHtml(member.name)}</b></span>` : "";
  }).join("");
  openInsight(t("pickDetailsKicker"), t("whyName", { name: champion.name }), `
    <div class="insight-summary"><img src="${escapeHtml(champion.avatarUrl)}" alt="" data-fallback="${escapeHtml(champion.name)}"><div><span>${escapeHtml(roleName(role))}</span><b>${score}/100 · ${t(scoreLabelKey(score))}</b><small>${entry.winRate.toFixed(2)}% WR</small></div></div>
    <section class="insight-section"><h3>${t("componentBreakdown")}</h3><div class="insight-scores">${rows}</div></section>
    <section class="insight-section"><h3>${t("projectedTeam")}</h3><div class="projected-team">${projected}</div></section>
    <div class="insight-actions"><button type="button" data-insight-draft-role="${role}" data-insight-draft-champion="${escapeHtml(championId)}">${t("draftThisPick", { name: champion.name })}</button></div>`);
}

function sourceStatusClass(compactDate) {
  const age = dataAgeDays(compactDate);
  if (!Number.isFinite(age) || age > 90) return "stale";
  return age > 30 ? "aging" : "fresh";
}

function openSourceDetails() {
  const sources = [
    ["sourceRanked", state.statDate],
    ["sourceMatchups", state.matchupDate],
    ["sourceHistory", state.historyDate],
  ].map(([key, date]) => `<div class="source-row"><i class="${sourceStatusClass(date)}"></i><div><b>${t(key)}</b><span>${t("sourceDate", { date: formatDate(date), freshness: freshnessText(dataAgeDays(date)) })}</span></div></div>`).join("");
  openInsight(t("sourcesKicker"), t("sourcesTitle"), `<div class="source-list">${sources}<div class="source-row"><i class="${state.calibration.status === "calibrated" ? "fresh" : "aging"}"></i><div><b>${t("sourceCalibration")}</b><span>${calibrationText()}</span></div></div></div>`);
}

function activateMobileLane(role) {
  if (!state.lastResult?.some((group) => group.role === role)) return;
  state.activeMobileRole = role;
  elements.resultContent.querySelectorAll("[data-lane-tab]").forEach((button) => {
    button.setAttribute("aria-selected", String(button.dataset.laneTab === role));
  });
  elements.resultContent.querySelectorAll("[data-lane-role]").forEach((section) => {
    section.classList.toggle("mobile-active", section.dataset.laneRole === role);
  });
}

function draftRecommendation(role, championId) {
  const index = SLOT_ROLES.indexOf(String(role));
  const champion = state.championMap.get(String(championId));
  if (index < 0 || !champion || state.teams.ally[index] || selectedIds().has(String(championId))) return;
  state.teams.ally[index] = String(championId);
  state.lastAutoPick = { index, role: String(role), championId: String(championId), name: champion.name };
  state.activeMobileRole = SLOT_ROLES.find((candidateRole, candidateIndex) => !state.teams.ally[candidateIndex]) || null;
  renderAllSlots();
  analyzeAllOpenRoles();
}

function undoAutoPick() {
  const pick = state.lastAutoPick;
  if (!pick) return;
  if (state.teams.ally[pick.index] === pick.championId) state.teams.ally[pick.index] = null;
  state.lastAutoPick = null;
  state.activeMobileRole = pick.role;
  renderAllSlots();
  analyzeAllOpenRoles();
}

function lineupPairFitScore(championIds) {
  const profiles = championIds.map(championProfile).filter((profile) => profile.available);
  const scores = [];
  for (let left = 0; left < profiles.length; left += 1) {
    for (let right = left + 1; right < profiles.length; right += 1) {
      scores.push((allyPairFit(profiles[left], profiles[right]) + allyPairFit(profiles[right], profiles[left])) * 50);
    }
  }
  return scores.length ? Math.max(15, Math.min(85, average(scores))) : 50;
}

function lineupBalanceScore(championIds) {
  const profiles = championIds.map(championProfile).filter((profile) => profile.available);
  if (!profiles.length) return 50;
  const totals = profiles.reduce((sum, profile) => ({
    frontline: sum.frontline + profile.frontline,
    control: sum.control + profile.control,
    protection: sum.protection + profile.protection,
    carry: sum.carry + profile.carry,
    access: sum.access + profile.access,
  }), { frontline: 0, control: 0, protection: 0, carry: 0, access: 0 });
  const targets = { frontline: 1.2, control: 1.2, protection: .65, carry: 1.7, access: .8 };
  return Math.round(average(Object.keys(targets).map((key) => Math.min(1, totals[key] / targets[key]))) * 100);
}

function projectedLineupScore(entries) {
  const knownAllies = state.teams.ally.filter(Boolean);
  const championIds = [...knownAllies, ...entries.map((entry) => String(entry.championId))];
  const evidence = entries.length ? average(entries.map((entry) => entry.evidenceScore)) : 50;
  return Math.round(
    evidence * .82
    + lineupPairFitScore(championIds) * .10
    + lineupBalanceScore(championIds) * .08
  );
}

function bestCompletionForSeed(seedRole, seedEntry, openRoles, pools, counter) {
  let beam = [{ entries: [seedEntry], used: new Set([String(seedEntry.championId)]), score: projectedLineupScore([seedEntry]) }];
  openRoles.filter((role) => role !== seedRole).forEach((role) => {
    const expanded = [];
    beam.forEach((plan) => {
      (pools.get(role) || []).forEach((entry) => {
        if (plan.used.has(String(entry.championId))) return;
        const entries = [...plan.entries, entry];
        expanded.push({ entries, used: new Set([...plan.used, String(entry.championId)]), score: projectedLineupScore(entries) });
        counter.count += 1;
      });
    });
    beam = expanded.sort((left, right) => right.score - left.score).slice(0, 70);
  });
  return beam.sort((left, right) => right.score - left.score)[0] || { entries: [seedEntry], score: seedEntry.evidenceScore };
}

function optimizeOpenRolesSync(openRoles) {
  const pools = new Map(openRoles.map((role) => [
    role,
    rankRole(role).filter((entry) => state.championMap.has(String(entry.championId))).slice(0, 8),
  ]));
  const counter = { count: 0 };
  const groups = openRoles.map((role) => ({
    role,
    entries: (pools.get(role) || []).map((entry) => {
      const plan = bestCompletionForSeed(role, entry, openRoles, pools, counter);
      return { ...entry, projectedScore: plan.score, projectedLineup: plan.entries.map((planned) => String(planned.championId)) };
    }).sort((left, right) => right.projectedScore - left.projectedScore || right.evidenceScore - left.evidenceScore).slice(0, 3),
  })).filter((group) => group.entries.length);
  state.optimizerMeta = { projectedLineups: counter.count };
  return groups;
}

async function optimizeOpenRoles(openRoles) {
  if (!optimizerWorker) return optimizeOpenRolesSync(openRoles);
  const pools = new Map(openRoles.map((role) => [
    role,
    rankRole(role).filter((entry) => state.championMap.has(String(entry.championId))).slice(0, 8),
  ]));
  const knownAllies = state.teams.ally.filter(Boolean).map((championId) => ({
    championId: String(championId),
    profile: championProfile(championId),
  }));
  const serializedPools = openRoles.map((role) => ({
    role,
    entries: (pools.get(role) || []).map((entry) => ({
      championId: String(entry.championId),
      evidenceScore: entry.evidenceScore,
      profile: championProfile(entry.championId),
    })),
  }));
  const key = JSON.stringify({
    ally: state.teams.ally,
    enemy: state.teams.enemy,
    draftMode: state.draftMode,
    statDate: state.statDate,
    matchupDate: state.matchupDate,
    pools: serializedPools.map((group) => [group.role, group.entries.map((entry) => [entry.championId, entry.evidenceScore])]),
  });
  try {
    const result = await requestWorkerOptimization(key, { openRoles, pools: serializedPools, knownAllies });
    const groups = result.groups.map((group) => ({
      role: group.role,
      entries: group.entries.map((projection) => {
        const entry = (pools.get(group.role) || []).find((candidate) => String(candidate.championId) === projection.championId);
        return entry ? { ...entry, projectedScore: projection.projectedScore, projectedLineup: projection.projectedLineup } : null;
      }).filter(Boolean),
    })).filter((group) => group.entries.length);
    state.optimizerMeta = { projectedLineups: result.projectedLineups, cached: result.cached };
    return groups;
  } catch {
    return optimizeOpenRolesSync(openRoles);
  }
}

async function analyzeAllOpenRoles() {
  if (!state.ready) return;
  const analysisVersion = ++state.analysisVersion;
  const openRoles = SLOT_ROLES.filter((role, index) => !state.teams.ally[index]);
  elements.resultContent.classList.add("optimizing");
  elements.resultContent.setAttribute("aria-busy", "true");
  const groups = await optimizeOpenRoles(openRoles);
  if (analysisVersion !== state.analysisVersion) return;
  renderAutomaticResults(groups);
  elements.resultContent.dataset.optimizerCached = String(Boolean(state.optimizerMeta.cached));
  elements.resultContent.dataset.projectedLineups = String(state.optimizerMeta.projectedLineups || 0);
  elements.resultContent.classList.remove("optimizing");
  elements.resultContent.setAttribute("aria-busy", "false");
}

function setDraftMode(mode) {
  if (!["auto", "early", "middle", "last"].includes(mode)) return;
  state.draftMode = mode;
  localStorage.setItem("riftdraft-draft-mode", mode);
  elements.timingButtons.forEach((button) => {
    const active = button.dataset.draftMode === mode;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  analyzeAllOpenRoles();
}

function resetDraft() {
  state.teams.ally.fill(null);
  state.teams.enemy.fill(null);
  state.lastAutoPick = null;
  state.activeMobileRole = null;
  renderAllSlots();
  analyzeAllOpenRoles();
}

document.querySelectorAll(".language-button").forEach((button) => {
  button.addEventListener("click", () => setLanguage(button.dataset.language));
});
elements.timingButtons.forEach((button) => {
  button.addEventListener("click", () => setDraftMode(button.dataset.draftMode));
});

elements.resetButton.addEventListener("click", resetDraft);
elements.closePicker.addEventListener("click", closePicker);
elements.championSearch.addEventListener("input", renderChampionGrid);
elements.resultContent.addEventListener("click", (event) => {
  const undoButton = event.target.closest(".undo-pick");
  if (undoButton) return undoAutoPick();
  const laneTab = event.target.closest("[data-lane-tab]");
  if (laneTab) return activateMobileLane(laneTab.dataset.laneTab);
  const detailButton = event.target.closest("[data-pick-details-champion]");
  if (detailButton) return openRecommendationDetails(detailButton.dataset.pickDetailsRole, detailButton.dataset.pickDetailsChampion);
  if (event.target.closest("[data-source-details]")) return openSourceDetails();
  const pickButton = event.target.closest("[data-pick-champion]");
  if (pickButton) draftRecommendation(pickButton.dataset.pickRole, pickButton.dataset.pickChampion);
});
elements.draftDock.addEventListener("click", (event) => {
  const slot = event.target.closest("[data-dock-team]");
  if (!slot) return;
  const team = slot.dataset.dockTeam;
  const index = Number(slot.dataset.dockIndex);
  if (state.teams[team][index]) removeChampion(team, index);
  else openPicker(team, index);
});
elements.picker.addEventListener("click", (event) => {
  if (event.target === elements.picker) closePicker();
});
elements.closeInsight.addEventListener("click", closeInsight);
elements.insightDialog.addEventListener("click", (event) => {
  if (event.target === elements.insightDialog) return closeInsight();
  const draftButton = event.target.closest("[data-insight-draft-champion]");
  if (!draftButton) return;
  const { insightDraftRole: role, insightDraftChampion: championId } = draftButton.dataset;
  closeInsight();
  draftRecommendation(role, championId);
});
window.addEventListener("scroll", updateDraftDockVisibility, { passive: true });
window.addEventListener("resize", updateDraftDockVisibility, { passive: true });

applyTranslations();
loadData();
