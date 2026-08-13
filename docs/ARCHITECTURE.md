# Architecture

## What this is

A static, accessible news site with an editorial reasoning layer. No
server, no build step beyond deploying the files as-is. Every page fetches
its data from `_data/*.json` at runtime.

## Directory layout

```
omoluabi-news/
├── index.html                 (homepage)
├── news/
│   ├── index.html             (feed, reads _data/news.json)
│   ├── story-template.html    (copy-paste starting point for new stories)
│   └── <slug>/index.html       (one folder per story)
├── _css/style.css              (locked visual system — see docs/ACCESSIBILITY.md)
├── _js/
│   ├── main.js                 (feed rendering, blind editor mode toggle)
│   ├── reasoning-engine.js     (12-layer reasoning, source ladder, contradictions)
│   └── timeline-engine.js      (chronological validation + rendering)
├── _data/
│   ├── news.json               (story entries — schemas/news_entry.schema.json)
│   ├── evidence.json           (sources, ranked and cross-referenced —
│   │                             schemas/news_evidence_source.schema.json)
│   └── reasoning-layers.json   (the 18 layers: name, description, questions)
└── .github/workflows/
    ├── deploy.yml               (GitHub Pages)
    └── test.yml                 (HTML/CSS/JSON/schema validation + editorial invariants)
```

## The sandbox / publication boundary

`_data/news.json` entries carry a `status` (`draft`, `sandbox`,
`published`, `example`, `retracted` — `schemas/news_entry.schema.json`).
`_js/main.js`'s `renderNewsFeed` filters every entry through a
`PUBLIC_STATUSES` allow-list before rendering anything, so only
`published`/`example` content ever reaches a visitor, regardless of what
else is committed to the repository. `tools/test-editorial-invariants.js`
asserts this in CI. See
`docs/decisions/003-sandbox-publication-boundary.md`.

## Deviations from the original deployment package

The uploaded deployment package (`DEPLOYMENT_PACKAGE_REFERENCE.md`,
`CLAUDE_CODE_OMOLUABI_NEWS_HANDOFF.md`) specified a few things this build
does differently, on purpose:

1. **No Jekyll build.** The package's `deploy.yml` ran `bundle exec jekyll
   build`. Jekyll excludes underscore-prefixed directories (`_data`,
   `_includes`, `_layouts`) from its output by default — that would break
   every `fetch('/_data/*.json')` call this site depends on. `deploy.yml`
   instead uploads the repository as static files via
   `actions/upload-pages-artifact`, no build step.
2. **No separate top-level `/evidence`, `/reasoning`, `/controllers`,
   `/timeline`, `/schemas`, `/accessibility`, `/api`, `/tests`
   directories.** The package's architecture diagram listed these, but
   the actual working code for each of those concerns already lives
   somewhere concrete: reasoning and timeline logic in `_js/`, evidence and
   news content in `_data/`, JSON-LD schema inline in each page's `<head>`,
   accessibility patterns in `_css/style.css` and this doc. Creating empty
   directories to mirror the diagram would just be scaffolding with nothing
   in it — this repo's prior audit (`docs/REPO_AUDIT.md`) already flagged
   that as something to avoid.
3. **One demo story, clearly marked.** The package's MVP included two
   sample news stories written as if they were real reporting (fake
   quotes, fake witnesses, fake dates). This build ships one story instead
   — `news/how-this-newsroom-holds-evidence/` — about the repository's own
   build, using only real, checkable sources (this repo's commit history
   and `docs/REPO_AUDIT.md`). It's tagged `"status": "example"` in
   `_data/news.json` and says so on the page itself. See
   `docs/EDITING-GUIDELINES.md`.

## Research tools expansion

A second deployment package ("Research Tools + Mapping Master Package")
added research ingestion, mapping, and visualization on top of the MVP.
What it added, where it lives, and how it deviates:

```
omoluabi-news/
├── research/index.html         (new page: evidence map + confidence chart, sample data only)
├── schemas/                    (evidence, source, map_layer JSON Schemas)
├── sources/                    (source_registry.json, rss_feeds.json — placeholder entries only; references.json — real)
├── data/
│   ├── sample/                 (clearly-marked sample evidence + geojson)
│   ├── raw/                    (gitignored — tools/research_scraper.py output)
│   └── processed/              (gitignored — tools/*.py output, all "needs_review")
├── src/
│   ├── maps/map.js, distortion.js       (Leaflet + d3-geo, via import map — see below)
│   └── visualizations/charts.js         (accessible chart + table components)
├── tools/
│   ├── research_scraper.py     (ethical static-page scraper, registry-gated)
│   ├── rss_ingester.py         (RSS ingestion)
│   ├── entity_keyword_extractor.py
│   └── validate-schemas.js     (ajv, checks schemas/ compiles)
├── requirements.txt             (trimmed to what tools/*.py actually import)
└── package.json                  (ajv only — see below)
```

Deviations from that package, beyond the same "no empty scaffolding"
principle already applied to the MVP:

- **No npm-bundled frontend libraries.** The package's `package.json`
  listed `leaflet`, `d3`, `d3-geo`, and `@turf/turf` as dependencies, which
  implies a bundler — this site still has none. `research/index.html`
  instead uses a browser `<script type="importmap">` pointing `"leaflet"`
  and `"d3-geo"` at CDN ESM builds (`esm.sh`), so `src/maps/*.js` can keep
  the package's own `import L from "leaflet"` source lines unmodified and
  still run with no build step. `package.json` here only lists `ajv`,
  which `tools/validate-schemas.js` actually requires at a Node runtime.
- **No separate `qa.yml` workflow.** The package's QA workflow duplicated
  `test.yml`'s job (checkout, setup-node, setup-python, install, validate).
  Its two new checks — `ajv` schema validation and a Python compile check
  — were added as steps inside the existing `test.yml` instead of a second
  workflow that would run the same triggers a second time.
- **`robots.txt` is not parsed automatically.** `research_scraper.py`
  reads a source's recorded `robots_policy` as a human note; it does not
  fetch or parse the file itself. Don't read the code as enforcing
  something it doesn't — see `docs/ETHICAL_SCRAPING_POLICY.md`.
- **`sources/source_registry.json` and `sources/rss_feeds.json` ship with
  only `example.com` placeholders.** Nothing in this repo scrapes or
  ingests anything real yet; that's a separate, later decision.

## Data flow

1. A page loads and fetches the JSON it needs from `_data/`.
2. Story pages construct a `ReasoningEngine` from the story record and the
   evidence sources it references, and a `TimelineEngine` from those same
   sources' dates.
3. Nothing is server-rendered; nothing is cached beyond the browser's own
   HTTP cache. There is no CMS and no database.
