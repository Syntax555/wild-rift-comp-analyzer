# RiftDraft

A static, GitHub Pages-ready Wild Rift draft analyzer. Users fill fixed lane slots, choose their position, and receive a recommendation based on observed Diamond+ same-lane matchup win rate when it is available.

The interface supports English and Turkish. Each Solo, Jungle, Mid, Duo, and Support slot opens a lane-filtered champion picker with typo-tolerant fuzzy search.

## Data

The site reads same-origin snapshots from `data/`. A scheduled GitHub Action refreshes overall role statistics from the public JSON files published by [RankedWR](https://rankedwr.com/), which mirrors Riot/Tencent's [official Wild Rift CN statistics](https://lolm.qq.com/act/a20220818raider/index.html). It also snapshots the observed Diamond+ same-lane matchup records published in [RiftGG's Chinese Server Stats](https://www.riftgg.app/en/champions). RiftGG declares that dataset CC0 on each champion statistics page.

Riot's public developer API does not currently expose Wild Rift match history. GitHub Pages is also a static host, so a private API key must never be embedded in this frontend.

The recommendation removes drafted champions and filters by role. If an enemy is selected in the same lane, candidates with published matchup observations are sorted by their win rate against that enemy. If no matching observation exists, candidates are sorted by overall Diamond+ role win rate. The app does not invent an allied-synergy score or claim that any pick is guaranteed.

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
- `data/latest.v1.json`: ranked snapshot. `tiers["1"]` is Diamond+; lane keys are `1` Mid, `2` Solo, `3` Duo, `4` Support, and `5` Jungle. Each row is `[championId, winRate, pickRate, banRate]`.
