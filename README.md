# RiftDraft

A static, GitHub Pages-ready Wild Rift team composition analyzer. Users select allied and enemy champions, choose an open position, and receive a recommendation that blends Diamond+ role win rate with draft fit.

The interface supports English and Turkish. The champion picker defaults to the selected position, includes an **All** option for full-draft selection, and uses typo-tolerant fuzzy search for champion names.

## Data

The site reads a same-origin ranked snapshot from `data/`. A scheduled GitHub Action refreshes it daily from the public JSON files published by [RankedWR](https://rankedwr.com/), which mirrors Riot/Tencent's [official Wild Rift CN statistics](https://lolm.qq.com/act/a20220818raider/index.html). A small JavaScript fallback keeps the analyzer usable if the checked-in snapshot is unavailable.

Riot's public developer API does not currently expose Wild Rift match history. GitHub Pages is also a static host, so a private API key must never be embedded in this frontend.

The recommendation removes drafted champions, filters by role, then blends Diamond+ win rate with a relative draft-fit score. Draft fit uses Riot's official champion classes and ability descriptions to estimate allied composition gaps and enemy threat profiles. It is a transparent heuristic, not an observed matchup or composition-specific win rate.

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
- `data/champion-traits.v1.json`: compact class, crowd-control, sustain, and mobility signals derived from Riot's official Wild Rift champion pages.
- `data/latest.v1.json`: ranked snapshot. `tiers["1"]` is Diamond+; lane keys are `1` Mid, `2` Solo, `3` Duo, `4` Support, and `5` Jungle. Each row is `[championId, winRate, pickRate, banRate]`.
