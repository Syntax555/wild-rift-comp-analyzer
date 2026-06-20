# RiftDraft

A static, GitHub Pages-ready Wild Rift draft analyzer. Users fill fixed lane slots, choose their position, and receive a transparent evidence ranking that combines observed statistics with clearly labeled whole-draft estimates.

The interface supports English and Turkish. Each Solo, Jungle, Mid, Duo, and Support slot opens a lane-filtered champion picker with typo-tolerant fuzzy search.

Each result includes source-coverage confidence, a per-enemy response matrix, per-ally synergy reasons, and one unique recommendation for every empty allied lane. The responsive interface uses touch-sized, horizontally scrollable lane selectors and a bottom-sheet champion picker on mobile.

## Data

The site reads same-origin snapshots from `data/`. A scheduled GitHub Action refreshes overall role statistics from [RankedWR](https://rankedwr.com/), observed Diamond+ same-lane matchups from [RiftGG](https://www.riftgg.app/en/champions), and a historical comparison snapshot from the [statsWR public API](https://statswr-api.onrender.com/api-docs). RiftGG declares its champion statistics dataset CC0.

Riot's public developer API does not currently expose Wild Rift match history. GitHub Pages is also a static host, so a private API key must never be embedded in this frontend.

The evidence score ranks available role candidates with explicitly disclosed weights: current role strength 30, observed same-lane matchup 30 when available, all-enemy response estimate 15, ally-synergy estimate 15, and historical comparison 10. Missing components are removed and the remaining weights are normalized. Enemy response and ally synergy use official champion classes and ability-description signals; they are estimates, not observed composition win rates or a predicted win probability.

## Run locally

Any static server works. For example:

```powershell
python -m http.server 4173
```

Open `http://localhost:4173`.

## Deploy to GitHub Pages

In the repository settings, open **Pages**, choose **Deploy from a branch**, select the default branch and `/ (root)`, then save. No build step is required.

## Data refresh

`.github/workflows/update-ranked-data.yml` runs every day and can also be started manually from GitHub Actions. It executes `scripts/update-ranked-data.mjs`, commits changed snapshots, and requests a Pages rebuild.

## API contract

- `data/champions.v1.json`: champion IDs, display names, and avatar paths.
- `data/champion-pages.index.v1.json`: official Wild Rift champion card art.
- `data/matchups.v1.json`: observed Diamond+ same-lane win rate and appearance rate by candidate, role, and opponent, sourced from RiftGG.
- `data/history.v1.json`: earlier role statistics sourced from statsWR for cross-snapshot comparison.
- `data/champion-signals.v1.json`: official class, crowd-control, sustain, and mobility signals used only for labeled team-fit estimates.
- `data/latest.v1.json`: ranked snapshot. `tiers["1"]` is Diamond+; lane keys are `1` Mid, `2` Solo, `3` Duo, `4` Support, and `5` Jungle. Each row is `[championId, winRate, pickRate, banRate]`.
