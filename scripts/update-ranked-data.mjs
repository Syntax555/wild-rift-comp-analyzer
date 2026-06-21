import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const sourceBase = "https://rankedwr.com/data/";
const files = [
  "latest.v1.json",
  "champions.v1.json",
  "champion-pages.index.v1.json",
];
const riftGgBase = "https://www.riftgg.app/en/champions/";
const riftGgLaneToAppRole = { "1": "1", "2": "2", "3": "3", "4": "5", "5": "4" };
const statsWrUrl = "https://statswr-api.onrender.com/api/v1/champions/lanes/0";
const statsWrRoleToAppRole = { "1": "2", "2": "5", "3": "1", "4": "3", "5": "4" };

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputDirectory = resolve(root, "data");
await mkdir(outputDirectory, { recursive: true });

const downloaded = new Map();

async function readExistingJson(file, fallback) {
  try {
    return JSON.parse(await readFile(resolve(outputDirectory, file), "utf8"));
  } catch {
    return fallback;
  }
}

for (const file of files) {
  const response = await fetch(new URL(file, sourceBase), {
    headers: { "user-agent": "RiftDraft data updater" },
  });
  if (!response.ok) {
    throw new Error(`Failed to download ${file}: ${response.status} ${response.statusText}`);
  }

  const body = await response.text();
  downloaded.set(file, JSON.parse(body));
  await writeFile(resolve(outputDirectory, file), `${body.trim()}\n`, "utf8");
  console.log(`Updated data/${file}`);
}

const championPayload = downloaded.get("champions.v1.json") || {};
const latestPayload = downloaded.get("latest.v1.json") || {};
const champions = Object.values(championPayload.champions || {}).filter((champion) => champion.riotSlug);
const championIdBySlug = new Map(champions.map((champion) => [champion.riotSlug, String(champion.id)]));
const championIdByName = new Map(champions.map((champion) => [normalizeName(champion.displayName), String(champion.id)]));
const matchups = {};
const dataDates = new Set();
let cursor = 0;

function extractMatchups(html) {
  const startToken = 'matchups\\":';
  const endToken = ',\\"core_items\\":';
  const start = html.indexOf(startToken);
  const end = html.indexOf(endToken, start);
  if (start < 0 || end < 0) throw new Error("RiftGG matchup payload was not found");
  return JSON.parse(html.slice(start + startToken.length, end).replaceAll('\\"', '"'));
}

function normalizeName(name) {
  return String(name || "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

async function downloadMatchups(champion) {
  const response = await fetch(`${riftGgBase}${champion.riotSlug}/cn-stats`, {
    headers: { "user-agent": "RiftDraft data updater" },
  });
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }
  const records = extractMatchups(await response.text());
  const championId = String(champion.id);
  const championMatchups = {};

  records.filter((record) => Number(record.rankLevel) === 1).forEach((record) => {
    const role = riftGgLaneToAppRole[String(record.lane)];
    if (!role) return;
    const opponents = {};
    (record.counters || []).forEach((counter) => {
      const opponentId = championIdBySlug.get(counter.heroSlug);
      if (!opponentId) return;
      const sampleSize = Number(counter.metrics?.gameCount || counter.metrics?.games || counter.metrics?.sampleSize) || null;
      opponents[opponentId] = {
        winRate: Number((Number(counter.metrics?.winRate || 0) * 100).toFixed(4)),
        pickRate: Number((Number(counter.metrics?.appearRate || 0) * 100).toFixed(4)),
        ...(sampleSize ? { sampleSize } : {}),
      };
    });
    if (Object.keys(opponents).length) championMatchups[role] = opponents;
    if (record.dataDate) dataDates.add(String(record.dataDate).slice(0, 10).replaceAll("-", ""));
  });

  if (Object.keys(championMatchups).length) matchups[championId] = championMatchups;
}

async function worker() {
  while (cursor < champions.length) {
    const champion = champions[cursor];
    cursor += 1;
    try {
      await downloadMatchups(champion);
    } catch (error) {
      console.warn(`Skipped RiftGG matchups for ${champion.displayName}: ${error.message}`);
    }
  }
}

await Promise.all(Array.from({ length: Math.min(10, champions.length) }, () => worker()));

if (Object.keys(matchups).length < Math.floor(champions.length * 0.6)) {
  throw new Error(`Only ${Object.keys(matchups).length} of ${champions.length} champion matchup pages were available`);
}

const matchupPayload = {
  version: 1,
  generatedAt: new Date().toISOString(),
  dataDate: [...dataDates].sort().at(-1) || null,
  rank: "Diamond+",
  scope: "Observed same-lane matchup win rate and appearance rate; China server",
  source: {
    name: "RiftGG Chinese Server Stats",
    url: "https://www.riftgg.app/en/champions",
    license: "CC0-1.0",
  },
  champions: Object.fromEntries(Object.entries(matchups).sort(([left], [right]) => left.localeCompare(right))),
};
await writeFile(resolve(outputDirectory, "matchups.v1.json"), `${JSON.stringify(matchupPayload)}\n`, "utf8");
console.log(`Updated data/matchups.v1.json (${Object.keys(matchups).length} champions)`);

const compactMatchupPayload = {
  version: 1,
  generatedAt: matchupPayload.generatedAt,
  dataDate: matchupPayload.dataDate,
  source: matchupPayload.source,
  champions: Object.fromEntries(Object.entries(matchups).sort(([left], [right]) => left.localeCompare(right)).map(([championId, roles]) => [
    championId,
    Object.fromEntries(Object.entries(roles).map(([role, opponents]) => [
      role,
      Object.entries(opponents).map(([opponentId, values]) => values.sampleSize
        ? [opponentId, values.winRate, values.pickRate, values.sampleSize]
        : [opponentId, values.winRate, values.pickRate]),
    ])),
  ])),
};
await writeFile(resolve(outputDirectory, "matchups-compact.v1.json"), `${JSON.stringify(compactMatchupPayload)}\n`, "utf8");
console.log(`Updated data/matchups-compact.v1.json (${Object.keys(matchups).length} champions)`);

try {
  const statsWrResponse = await fetch(statsWrUrl, {
    headers: { "user-agent": "RiftDraft data updater" },
    signal: AbortSignal.timeout(90000),
  });
  if (!statsWrResponse.ok) throw new Error(`${statsWrResponse.status} ${statsWrResponse.statusText}`);
  const statsWrPayload = await statsWrResponse.json();
  const history = {};
  const historyDates = new Set();
  (statsWrPayload.champions || []).forEach((record) => {
    const championId = championIdByName.get(normalizeName(record.name));
    const role = statsWrRoleToAppRole[String(record.role)];
    const point = [...(record.gameplayData || [])].sort((left, right) => new Date(left.date) - new Date(right.date)).at(-1);
    if (!championId || !role || !point) return;
    history[championId] ||= {};
    history[championId][role] = {
      winRate: Number(point.winRate) || 0,
      pickRate: Number(point.pickRate) || 0,
      banRate: Number(point.banRate) || 0,
      tier: String(point.tier || "").split(",")[0],
    };
    if (point.date) historyDates.add(String(point.date).slice(0, 10).replaceAll("-", ""));
  });

  const historyPayload = {
    version: 1,
    generatedAt: new Date().toISOString(),
    dataDate: [...historyDates].sort().at(-1) || null,
    source: { name: "statsWR public API", url: statsWrUrl },
    scope: "Historical Wild Rift role win, pick, and ban rate snapshot",
    champions: Object.fromEntries(Object.entries(history).sort(([left], [right]) => left.localeCompare(right))),
  };
  await writeFile(resolve(outputDirectory, "history.v1.json"), `${JSON.stringify(historyPayload)}\n`, "utf8");
  console.log(`Updated data/history.v1.json (${Object.keys(history).length} champions)`);
} catch (error) {
  console.warn(`Kept the existing statsWR history snapshot: ${error.message}`);
}

const signalPatterns = {
  control: /\b(stun|stuns|stunned|root|roots|rooted|knock|knocks|airborne|charm|charms|charmed|fear|fears|feared|taunt|taunts|taunted|sleep|sleeps|silence|silences|suppress|suppresses|immobil|unable to (?:attack|move)|pulls?|entangles?|binds?)\b/i,
  sustain: /\b(heal|heals|healed|healing|shield|shields|shielded|restore|restores|restored|regenerat|protect|protects|protected)\b/i,
  mobility: /\b(dash|dashes|leap|leaps|blink|blinks|teleport|teleports|charge|charges|lunges?|jumps?|rolls?)\b/i,
};

function signalScore(abilities, pattern) {
  const matchingAbilities = abilities.filter((ability) => pattern.test(ability.description || "")).length;
  return Number(Math.min(1, matchingAbilities / 2).toFixed(2));
}

const pageIndexPayload = downloaded.get("champion-pages.index.v1.json") || {};
const pageEntries = Object.entries(pageIndexPayload.champions || {});
const signals = {};
let pageCursor = 0;

async function downloadSignals([championId, entry]) {
  const relativePath = String(entry.pagePath || "").replace(/^data\//, "");
  if (!relativePath) return;
  const response = await fetch(new URL(relativePath, sourceBase), {
    headers: { "user-agent": "RiftDraft data updater" },
  });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  const page = await response.json();
  const abilities = Array.isArray(page.abilities) ? page.abilities : [];
  signals[championId] = {
    roles: (page.roles || []).map((role) => String(role).toUpperCase()),
    control: signalScore(abilities, signalPatterns.control),
    sustain: signalScore(abilities, signalPatterns.sustain),
    mobility: signalScore(abilities, signalPatterns.mobility),
  };
}

async function signalWorker() {
  while (pageCursor < pageEntries.length) {
    const entry = pageEntries[pageCursor];
    pageCursor += 1;
    try {
      await downloadSignals(entry);
    } catch (error) {
      console.warn(`Skipped official signals for ${entry[0]}: ${error.message}`);
    }
  }
}

await Promise.all(Array.from({ length: Math.min(10, pageEntries.length) }, () => signalWorker()));
const signalPayload = {
  version: 1,
  generatedAt: pageIndexPayload.generatedAt || downloaded.get("latest.v1.json")?.fetchedAt,
  source: "Official Riot Wild Rift champion classes and ability descriptions via RankedWR",
  scope: "Class, crowd-control, sustain, and mobility signals used only for labeled team-fit estimates",
  champions: Object.fromEntries(Object.entries(signals).sort(([left], [right]) => left.localeCompare(right))),
};
await writeFile(resolve(outputDirectory, "champion-signals.v1.json"), `${JSON.stringify(signalPayload)}\n`, "utf8");
console.log(`Updated data/champion-signals.v1.json (${Object.keys(signals).length} champions)`);

const generatedAt = new Date().toISOString();
const archivePayload = await readExistingJson("ranked-archive.v1.json", { version: 1, snapshots: [] });
const archiveSnapshots = [...(archivePayload.snapshots || [])].filter((snapshot) => snapshot.statDate !== latestPayload.statDate);
archiveSnapshots.push({ statDate: latestPayload.statDate || generatedAt.slice(0, 10).replaceAll("-", ""), roles: latestPayload.tiers?.["1"] || {} });
archiveSnapshots.sort((left, right) => String(left.statDate).localeCompare(String(right.statDate)));
const retainedSnapshots = archiveSnapshots.slice(-60);

function archiveRows(snapshot) {
  const rows = new Map();
  Object.entries(snapshot.roles || {}).forEach(([role, entries]) => entries.forEach((entry) => {
    rows.set(`${role}:${entry[0]}`, { winRate: Number(entry[1]), pickRate: Number(entry[2]), sampleSize: Number(entry[4]) || null });
  }));
  return rows;
}

const calibrationCandidates = [1, 2, 3, 5, 8, 12, 20, 40];
const calibrationErrors = new Map(calibrationCandidates.map((candidate) => [candidate, []]));
for (let index = 1; index < retainedSnapshots.length; index += 1) {
  const previous = archiveRows(retainedSnapshots[index - 1]);
  const next = archiveRows(retainedSnapshots[index]);
  previous.forEach((value, key) => {
    const outcome = next.get(key);
    if (!outcome) return;
    calibrationCandidates.forEach((fullWeightAt) => {
      const reliability = value.sampleSize
        ? Math.max(.2, Math.min(1, Math.sqrt(value.sampleSize / 1000)))
        : Math.max(.2, Math.min(1, Math.sqrt(value.pickRate / fullWeightAt)));
      const prediction = 50 + (value.winRate - 50) * reliability;
      calibrationErrors.get(fullWeightAt).push(Math.abs(prediction - outcome.winRate));
    });
  });
}
const errorSummary = calibrationCandidates.map((fullWeightAt) => {
  const errors = calibrationErrors.get(fullWeightAt);
  return { fullWeightAt, observations: errors.length, mae: errors.length ? Number((errors.reduce((sum, error) => sum + error, 0) / errors.length).toFixed(4)) : null };
});
const bestCalibration = errorSummary.filter((entry) => Number.isFinite(entry.mae)).sort((left, right) => left.mae - right.mae)[0];
const calibrationPayload = {
  version: 1,
  generatedAt,
  status: retainedSnapshots.length >= 3 && (bestCalibration?.observations || 0) >= 200 ? "calibrated" : "collecting",
  snapshotCount: retainedSnapshots.length,
  observations: bestCalibration?.observations || 0,
  rolePickRateFullWeight: bestCalibration?.fullWeightAt || 5,
  actualSampleFullWeight: 1000,
  componentHalfLifeDays: 45,
  candidates: errorSummary,
  scope: "Walk-forward calibration against later RankedWR Diamond+ snapshots; no composition-outcome claim",
};
const rankedDiamondPayload = {
  version: 1,
  generatedAt,
  statDate: latestPayload.statDate || null,
  rank: "Diamond+",
  source: latestPayload.source || "RankedWR",
  roles: latestPayload.tiers?.["1"] || {},
};
const championsUiPayload = {
  version: 1,
  generatedAt,
  champions: champions
    .map((champion) => [String(champion.id), champion.displayName, champion.avatar || "", champion.riotSlug || ""])
    .sort((left, right) => left[1].localeCompare(right[1])),
};
const revision = generatedAt.replace(/\D/g, "").slice(0, 14);
const manifestPayload = {
  version: 1,
  revision,
  generatedAt,
  files: {
    ranked: "ranked-diamond.v1.json",
    champions: "champions-ui.v1.json",
    matchups: "matchups-compact.v1.json",
    history: "history.v1.json",
    signals: "champion-signals.v1.json",
    calibration: "calibration.v1.json",
  },
};
await Promise.all([
  writeFile(resolve(outputDirectory, "ranked-diamond.v1.json"), `${JSON.stringify(rankedDiamondPayload)}\n`, "utf8"),
  writeFile(resolve(outputDirectory, "champions-ui.v1.json"), `${JSON.stringify(championsUiPayload)}\n`, "utf8"),
  writeFile(resolve(outputDirectory, "ranked-archive.v1.json"), `${JSON.stringify({ version: 1, generatedAt, snapshots: retainedSnapshots })}\n`, "utf8"),
  writeFile(resolve(outputDirectory, "calibration.v1.json"), `${JSON.stringify(calibrationPayload)}\n`, "utf8"),
  writeFile(resolve(outputDirectory, "manifest.v1.json"), `${JSON.stringify(manifestPayload)}\n`, "utf8"),
]);
console.log(`Updated compact browser snapshots (revision ${revision})`);
