# RiftDraft

A static, GitHub Pages-ready Wild Rift draft analyzer. Users fill fixed lane slots, choose their position, and receive a transparent evidence ranking that combines observed statistics with clearly labeled whole-draft estimates.

The interface supports English and Turkish. Each Solo, Jungle, Mid, Duo, and Support slot opens a lane-filtered champion picker with typo-tolerant fuzzy search.

Recommendations update automatically whenever either draft changes. Every empty allied lane shows its top three available champions with source coverage, per-enemy response signals, and per-ally synergy reasons. Recommendations can be drafted with one tap and immediately undone. A compact sticky draft bar keeps every allied and enemy slot reachable while reviewing results; optional bottom-sheet details explain score components, projected teammates, and source freshness without lengthening the main page. Pick timing can be automatic, early, middle, or last-pick; this changes the balance between blind safety and counter strength. Mobile uses a compact lane-tab view and bottom-sheet controls.

## Data

The site reads same-origin snapshots from `data/`. A scheduled GitHub Action refreshes overall role statistics from [RankedWR](https://rankedwr.com/), observed Diamond+ same-lane matchups from [RiftGG](https://www.riftgg.app/en/champions), and a historical comparison snapshot from the [statsWR public API](https://statswr-api.onrender.com/api-docs). RiftGG declares its champion statistics dataset CC0.

Riot's public developer API does not currently expose Wild Rift match history. GitHub Pages is also a static host, so a private API key must never be embedded in this frontend.

The ranking engine first builds a stable baseline from current role strength, observed blind-pick safety, and historical change. Selected allies and enemies then contribute a separate context uplift relative to that baseline. Its maximum influence rises from early to last pick and scales with observed matchup coverage and sample reliability; class-based enemy responses and ally-fit estimates remain deliberately weaker. Low-appearance win rates are shrunk toward a neutral baseline, missing records remain eligible with neutral scores, stale components decay on a configurable half-life, and bounded standardized scores prevent a single outlier from forcing a 0/100 result. When a selected enemy has a published RiftGG pairing, that observed record replaces the class-based fallback for that enemy.

Each candidate is then evaluated in a beam search over complete remaining lineups. The search prevents duplicate flex picks and combines 82% calibrated evidence, 10% pair-fit projection, and 8% composition coverage. This search runs in a Web Worker and memoizes recent draft states, keeping picks responsive without reducing the search space. The displayed joint-plan score is an optimizer score, not a predicted win probability.

The recommendation detail sheet labels a result `Stable best` when it remains ahead after draft context and `Draft-driven` when allies, enemies, or the joint lineup search materially move it. These labels explain ranking movement; they do not force different champions to appear.

RankedWR and RiftGG currently publish rates but not raw game counts. The updater supports provider sample-count fields when present; otherwise it uses the calibrated appearance-rate fallback and reports reduced coverage. Ally-pair fit still uses official champion class and ability signals because none of the public sources provides observed ally-pair outcomes.

`ranked-archive.v1.json` retains up to 60 dated RankedWR snapshots. The updater performs walk-forward calibration against later snapshots and chooses the appearance-rate shrinkage with the lowest later-snapshot error. Calibration remains visibly marked as `collecting` until at least three dates and 200 later observations exist; it never treats same-date data as a backtest.

The browser first checks a small revision manifest, then loads compact Diamond+ snapshots through revisioned, cacheable URLs. Source snapshots remain in the repository for the scheduled updater, but the UI no longer downloads unused tiers or champion-page metadata.

## Run locally

Any static server works. For example:

```powershell
python -m http.server 4173
```

Open `http://localhost:4173`.

Run the pure scoring regression checks with:

```powershell
node scripts/check-context-ranking.mjs
```

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
- `data/calibration.v1.json`: walk-forward calibration status and selected reliability settings.
- `data/ranked-archive.v1.json`: retained dated Diamond+ snapshots used by the updater for later-outcome calibration; the browser does not download this file.

The updater also retains `latest.v1.json`, `champions.v1.json`, `champion-pages.index.v1.json`, and `matchups.v1.json` as full source/debug snapshots. Lane keys are `1` Mid, `2` Solo, `3` Duo, `4` Support, and `5` Jungle. Ranked rows are `[championId, winRate, pickRate, banRate]`.
