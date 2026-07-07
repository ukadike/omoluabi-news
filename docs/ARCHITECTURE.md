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
│   ├── news.json               (story entries)
│   ├── evidence.json           (sources, ranked and cross-referenced)
│   └── reasoning-layers.json   (the 12 layers: name, description, questions)
└── .github/workflows/
    ├── deploy.yml               (GitHub Pages)
    └── test.yml                 (HTML/CSS/JSON validation)
```

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

## Data flow

1. A page loads and fetches the JSON it needs from `_data/`.
2. Story pages construct a `ReasoningEngine` from the story record and the
   evidence sources it references, and a `TimelineEngine` from those same
   sources' dates.
3. Nothing is server-rendered; nothing is cached beyond the browser's own
   HTTP cache. There is no CMS and no database.
