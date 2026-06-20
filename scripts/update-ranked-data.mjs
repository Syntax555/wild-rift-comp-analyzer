import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const sourceBase = "https://rankedwr.com/data/";
const files = [
  "latest.v1.json",
  "champions.v1.json",
  "champion-pages.index.v1.json",
];

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

const pageIndexPayload = downloaded.get("champion-pages.index.v1.json") || {};
const pageIndex = pageIndexPayload.champions || {};
const pageEntries = Object.entries(pageIndex);
const profiles = {};
let cursor = 0;

const signalPatterns = {
  control: /\b(stun|stuns|stunned|root|roots|rooted|knock|knocks|airborne|charm|charms|charmed|fear|fears|feared|taunt|taunts|taunted|sleep|sleeps|silence|silences|suppress|suppresses|immobil|unable to (?:attack|move)|pulls?|entangles?|binds?)\b/i,
  sustain: /\b(heal|heals|healed|healing|shield|shields|shielded|restore|restores|restored|regenerat|protect|protects|protected)\b/i,
  mobility: /\b(dash|dashes|leap|leaps|blink|blinks|teleport|teleports|charge|charges|lunges?|jumps?|rolls?)\b/i,
};

function signalScore(abilities, pattern) {
  const matchingAbilities = abilities.filter((ability) => pattern.test(ability.description || "")).length;
  return Number(Math.min(1, matchingAbilities / 2).toFixed(2));
}

async function downloadProfile([championId, entry]) {
  const relativePath = String(entry.pagePath || "").replace(/^data\//, "");
  if (!relativePath) return;
  const response = await fetch(new URL(relativePath, sourceBase), {
    headers: { "user-agent": "RiftDraft data updater" },
  });
  if (!response.ok) {
    console.warn(`Skipped traits for ${championId}: ${response.status} ${response.statusText}`);
    return;
  }
  const page = await response.json();
  const abilities = Array.isArray(page.abilities) ? page.abilities : [];
  profiles[championId] = {
    roles: (page.roles || []).map((role) => String(role).toUpperCase()),
    control: signalScore(abilities, signalPatterns.control),
    sustain: signalScore(abilities, signalPatterns.sustain),
    mobility: signalScore(abilities, signalPatterns.mobility),
  };
}

async function worker() {
  while (cursor < pageEntries.length) {
    const entry = pageEntries[cursor];
    cursor += 1;
    try {
      await downloadProfile(entry);
    } catch (error) {
      console.warn(`Skipped traits for ${entry[0]}: ${error.message}`);
    }
  }
}

await Promise.all(Array.from({ length: Math.min(10, pageEntries.length) }, () => worker()));

const traitsPayload = {
  version: 1,
  generatedAt: pageIndexPayload.generatedAt || downloaded.get("latest.v1.json")?.fetchedAt,
  source: "Official Riot Wild Rift champion classes and ability descriptions via RankedWR",
  champions: Object.fromEntries(Object.entries(profiles).sort(([left], [right]) => left.localeCompare(right))),
};
await writeFile(resolve(outputDirectory, "champion-traits.v1.json"), `${JSON.stringify(traitsPayload, null, 2)}\n`, "utf8");
console.log(`Updated data/champion-traits.v1.json (${Object.keys(profiles).length} profiles)`);
