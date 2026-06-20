# RiftDraft

A static, GitHub Pages-ready Wild Rift draft analyzer. Users fill fixed lane slots, choose their position, and receive a transparent evidence ranking that combines observed statistics with clearly labeled whole-draft estimates.

The interface supports English and Turkish. Each Solo, Jungle, Mid, Duo, and Support slot opens a lane-filtered champion picker with typo-tolerant fuzzy search.

Recommendations update automatically whenever either draft changes. Every empty allied lane shows its top three available champions with source coverage, per-enemy response signals, and per-ally synergy reasons. Recommendations can be drafted with one tap and immediately undone. Mobile uses a compact lane-tab view and a bottom-sheet champion picker.

## Data

The site reads same-origin snapshots from `data/`. A scheduled GitHub Action refreshes overall role statistics from [RankedWR](https://rankedwr.com/), observed Diamond+ same-lane matchups from [RiftGG](https://www.riftgg.app/en/champions), and a historical comparison snapshot from the [statsWR public API](https://statswr-api.onrender.com/api-docs). RiftGG declares its champion statistics dataset CC0.

Riot's public developer API does not currently expose Wild Rift match history. GitHub Pages is also a static host, so a private API key must never be embedded in this frontend.

The evidence score ranks available role candidates with explicitly disclosed weights: current role strength 30, observed same-lane matchup 30 when available, all-enemy response estimate 15, ally-synergy estimate 15, and historical comparison 10. Low-appearance win rates are shrunk toward a neutral baseline, missing matchup records remain eligible with a neutral score, and bounded standardized scores prevent a single outlier from forcing a 0/100 result. Enemy response and ally synergy use official champion classes and ability-description signals; they are estimates, not observed composition win rates or a predicted win probability.

The browser first checks a small revision manifest, then loads compact Diamond+ snapshots through revisioned, cacheable URLs. Source snapshots remain in the repository for the scheduled updater, but the UI no longer downloads unused tiers or champion-page metadata.

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

## Browser data contract

- `data/manifest.v1.json`: current compact-snapshot revision and filenames.
- `data/champions-ui.v1.json`: compact champion IDs, display names, avatar paths, and Riot slugs.
- `data/ranked-diamond.v1.json`: Diamond+ role rows only.
- `data/matchups-compact.v1.json`: compact observed same-lane win rate and appearance rate by candidate, role, and opponent, sourced from RiftGG.
- `data/history.v1.json`: earlier role statistics sourced from statsWR for cross-snapshot comparison.
- `data/champion-signals.v1.json`: official class, crowd-control, sustain, and mobility signals used only for labeled team-fit estimates.

The updater also retains `latest.v1.json`, `champions.v1.json`, `champion-pages.index.v1.json`, and `matchups.v1.json` as full source/debug snapshots. Lane keys are `1` Mid, `2` Solo, `3` Duo, `4` Support, and `5` Jungle. Ranked rows are `[championId, winRate, pickRate, banRate]`.
