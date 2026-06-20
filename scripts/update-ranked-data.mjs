import { mkdir, writeFile } from "node:fs/promises";
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

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputDirectory = resolve(root, "data");
await mkdir(outputDirectory, { recursive: true });

const downloaded = new Map();

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
const champions = Object.values(championPayload.champions || {}).filter((champion) => champion.riotSlug);
const championIdBySlug = new Map(champions.map((champion) => [champion.riotSlug, String(champion.id)]));
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
      opponents[opponentId] = {
        winRate: Number((Number(counter.metrics?.winRate || 0) * 100).toFixed(4)),
        pickRate: Number((Number(counter.metrics?.appearRate || 0) * 100).toFixed(4)),
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
