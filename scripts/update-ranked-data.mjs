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

for (const file of files) {
  const response = await fetch(new URL(file, sourceBase), {
    headers: { "user-agent": "RiftDraft data updater" },
  });
  if (!response.ok) {
    throw new Error(`Failed to download ${file}: ${response.status} ${response.statusText}`);
  }

  const body = await response.text();
  JSON.parse(body);
  await writeFile(resolve(outputDirectory, file), `${body.trim()}\n`, "utf8");
  console.log(`Updated data/${file}`);
}
