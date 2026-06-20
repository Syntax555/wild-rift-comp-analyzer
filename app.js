const API_BASE = "https://rankedwr.com/";
const RANK_BUCKET = "1"; // Diamond+ in the Riot/Tencent CN dataset.

const roleNames = {
  "1": "Mid",
  "2": "Solo",
  "3": "Duo",
  "4": "Support",
  "5": "Jungle",
};

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
  pickerTarget: null,
  champions: [],
  championMap: new Map(),
  stats: {},
  statDate: "20260619",
  source: "loading",
  ready: false,
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

function formatDate(compactDate) {
  if (!/^\d{8}$/.test(compactDate || "")) return "Latest available";
  const date = new Date(`${compactDate.slice(0, 4)}-${compactDate.slice(4, 6)}-${compactDate.slice(6, 8)}T12:00:00Z`);
  return new Intl.DateTimeFormat(undefined, { day: "numeric", month: "short", year: "numeric" }).format(date);
}

function normalizeChampion(raw, page = null) {
  const avatarUrl = raw.avatar
    ? new URL(raw.avatar.replace(/^\/+/, ""), API_BASE).href
    : new URL(`data/avatars/${raw.id}.png`, API_BASE).href;
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
    const [latestResponse, championsResponse, pagesResponse] = await Promise.all([
      fetch(new URL("data/latest.v1.json", API_BASE), { cache: "no-store" }),
      fetch(new URL("data/champions.v1.json", API_BASE), { cache: "no-store" }),
      fetch(new URL("data/champion-pages.index.v1.json", API_BASE), { cache: "no-store" }),
    ]);
    if (![latestResponse, championsResponse, pagesResponse].every((response) => response.ok)) {
      throw new Error("One or more ranked data endpoints were unavailable.");
    }
    const [latest, championPayload, pagePayload] = await Promise.all([
      latestResponse.json(), championsResponse.json(), pagesResponse.json(),
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
    state.statDate = latest.statDate;
    state.source = "live";
  } catch (error) {
    console.warn("Using bundled ranked snapshot:", error);
    const fallback = buildFallbackData();
    state.champions = fallback.champions.sort((a, b) => a.name.localeCompare(b.name));
    state.stats = fallback.stats;
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
  elements.headerStatus.classList.add(state.source);
  elements.headerStatus.querySelector("span:last-child").textContent = state.source === "live"
    ? "Live ranked snapshot"
    : "Cached ranked snapshot";
}

function selectedIds() {
  return new Set([...state.teams.ally, ...state.teams.enemy].filter(Boolean));
}

function renderSlots(team) {
  const container = elements[`${team}Slots`];
  container.replaceChildren();
  state.teams[team].forEach((championId, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "champion-slot";
    button.dataset.team = team;
    button.dataset.index = String(index);

    if (championId) {
      const champion = state.championMap.get(championId);
      if (!champion) return;
      button.classList.add("filled");
      button.setAttribute("aria-label", `Remove ${champion.name} from ${team} team`);
      button.innerHTML = `
        <img src="${escapeHtml(champion.avatarUrl)}" alt="" data-fallback="${escapeHtml(champion.name)}">
        <span class="slot-index">${String(index + 1).padStart(2, "0")}</span>
        <span class="remove-hint" aria-hidden="true">×</span>
        <span class="selected-name">${escapeHtml(champion.name)}</span>`;
      button.addEventListener("click", () => removeChampion(team, index));
    } else {
      button.setAttribute("aria-label", `Add champion to ${team} slot ${index + 1}`);
      button.innerHTML = `
        <span class="slot-index">${String(index + 1).padStart(2, "0")}</span>
        <span class="plus-icon">+</span>
        <span class="slot-label">Add champion</span>`;
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
  elements.pickerKicker.textContent = team === "ally" ? "Add to your team" : "Add to enemy team";
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
  const query = elements.championSearch.value.trim().toLowerCase();
  const drafted = selectedIds();
  const filtered = state.champions.filter((champion) => champion.search.includes(query));
  elements.championGrid.replaceChildren();

  filtered.forEach((champion) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "picker-champion";
    button.disabled = drafted.has(champion.id);
    button.setAttribute("aria-label", drafted.has(champion.id) ? `${champion.name}, already drafted` : `Choose ${champion.name}`);
    button.innerHTML = `<img src="${escapeHtml(champion.avatarUrl)}" alt="" loading="lazy" data-fallback="${escapeHtml(champion.name)}"><span>${escapeHtml(champion.name)}</span>`;
    button.addEventListener("click", () => selectChampion(champion.id));
    elements.championGrid.append(button);
  });

  bindImageFallbacks(elements.championGrid);
  elements.championTotal.textContent = `${filtered.length} of ${state.champions.length} champions`;
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
    elements.draftNote.textContent = "Loading Wild Rift ranked data…";
  } else if (count === 0) {
    elements.draftNote.textContent = "Select at least one ally or enemy champion to begin.";
  } else {
    elements.draftNote.textContent = `${count} champion${count === 1 ? "" : "s"} drafted · ${roleNames[state.selectedRole]} recommendation ready`;
  }
}

function clearResult() {
  elements.resultPlaceholder.hidden = false;
  elements.resultContent.hidden = true;
  elements.resultContent.replaceChildren();
}

function analyzeComposition() {
  const unavailable = selectedIds();
  const ranking = [...(state.stats[state.selectedRole] || [])]
    .filter((entry) => !unavailable.has(String(entry.championId)))
    .sort((a, b) => b.winRate - a.winRate);
  const top = ranking.filter((entry) => state.championMap.has(String(entry.championId))).slice(0, 3);
  if (!top.length) {
    elements.draftNote.textContent = "No available champion data exists for this position.";
    return;
  }
  renderResult(top);
}

function renderResult(entries) {
  const [best, ...alternatives] = entries;
  const champion = state.championMap.get(String(best.championId));
  const role = roleNames[state.selectedRole];
  const sourceLabel = state.source === "live" ? "Live Diamond+ snapshot" : "Cached Diamond+ snapshot";
  const alternativesHtml = alternatives.map((entry, index) => {
    const option = state.championMap.get(String(entry.championId));
    return `<div class="alternative">
      <img src="${escapeHtml(option.avatarUrl)}" alt="" data-fallback="${escapeHtml(option.name)}">
      <b>${index + 2}. ${escapeHtml(option.name)}</b>
      <span>${entry.winRate.toFixed(2)}%</span>
    </div>`;
  }).join("");

  elements.resultContent.innerHTML = `
    <div class="result-hero">
      <img src="${escapeHtml(champion.cardUrl)}" alt="${escapeHtml(champion.name)}" data-fallback="${escapeHtml(champion.name)}">
      <span class="result-badge">Top recommendation</span>
      <div class="result-title"><span>Highest available win rate</span><h2>${escapeHtml(champion.name)}</h2></div>
    </div>
    <div class="result-body">
      <div class="winrate-callout">
        <div><span>Diamond+ win rate</span><div class="winrate">${best.winRate.toFixed(2)}<small>%</small></div></div>
        <div class="position-tag">${escapeHtml(role)}</div>
      </div>
      <div class="metric-grid">
        <div class="metric"><span>Pick rate</span><strong>${best.pickRate.toFixed(2)}%</strong></div>
        <div class="metric"><span>Ban rate</span><strong>${best.banRate.toFixed(2)}%</strong></div>
      </div>
      <p class="why-copy"><strong>Why this pick:</strong> ${escapeHtml(champion.name)} has the highest recorded ${escapeHtml(role)} win rate among champions not already present in this draft. ${sourceLabel}, ${formatDate(state.statDate)}.</p>
      <div class="alternatives-label">Next best available</div>
      ${alternativesHtml}
    </div>`;
  bindImageFallbacks(elements.resultContent);
  elements.resultPlaceholder.hidden = true;
  elements.resultContent.hidden = false;
  if (window.matchMedia("(max-width: 1050px)").matches) {
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

elements.analyzeButton.addEventListener("click", analyzeComposition);
elements.resetButton.addEventListener("click", resetDraft);
elements.closePicker.addEventListener("click", closePicker);
elements.championSearch.addEventListener("input", renderChampionGrid);
elements.picker.addEventListener("click", (event) => {
  if (event.target === elements.picker) closePicker();
});

renderAllSlots();
loadData();
