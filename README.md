# Omoluabi News — Omoluabi MVP v1

An accessible, static editorial reasoning platform: the first working
implementation of the Omoluabi model. Self-hostable, deployable on
low-cost hardware, built to help independent publishers reclaim control
over how they create, publish, and sustain their work — with editorial
judgment kept explicitly human.

## What Omoluabi Is

Omoluabi is a human-governed editorial intelligence system: software
that helps people gather, hold, compare, and publish civic information —
stories, sources, evidence, timelines, contradictions, uncertainty —
without surrendering editorial judgment to automated systems. This
repository, Omoluabi News, is the first live, working implementation of
that model: a real newsroom node, not a mockup.

A story here carries an 18-layer editorial reasoning trail, evidence
ranked by a source ladder, and a timeline-integrity check — all visible
to a reader, none of it hidden behind the byline. See `docs/REASONING.md`.

## What Omoluabi Is Not

Omoluabi News's core operation does not depend on Claude, GPT, Gemini, or
any other frontier/hosted AI model — no model inference, no AI API key,
anywhere in its core path. Its reasoning engine is deterministic
JavaScript: a fixed source-reliability ladder, contradiction detection
by cross-reference, a chronology check. See
`docs/decisions/002-no-frontier-model-core-dependency.md`.

It also does not automate final editorial judgment. The reasoning engine
computes and displays; it never decides what publishes. Publication is
always an explicit human action — see
`docs/decisions/001-human-governed-editorial-authority.md`.

(AI-assisted tools, including Claude Code, were used to help *build* this
repository. That's development assistance, not a runtime dependency —
the distinction the two decision records above make explicit.)

## MVP v1 Status

This is an active MVP under testing, not a production-ready product.
Editorial content is real but minimal (one clearly-labeled demo story).
The editing workflow is git-based, not a graphical CMS. See
`docs/KNOWN_LIMITATIONS.md` for the full, honest list of gaps.

## Features

Only what actually works, today:

- Static homepage, news archive, and per-story pages — no server, no
  build step, deployed as-is via GitHub Pages.
- An 18-layer editorial reasoning engine (`_js/reasoning-engine.js`):
  source-ladder ranking, contradiction detection, a confidence score.
- A timeline-integrity checker (`_js/timeline-engine.js`).
- A named, tested sandbox/publication boundary: draft and sandbox
  content, and the entire research-ingestion pipeline's raw output, are
  structurally excluded from the public site — see
  `docs/decisions/003-sandbox-publication-boundary.md`.
- A research-ingestion toolkit (RSS ingestion, static-page scraping
  gated by an explicit source registry, keyword extraction) — currently
  wired to placeholder sources only; see `docs/RESEARCH_ARCHITECTURE.md`.
- An accessible Research page: evidence map with a plain-text distortion
  note and full data-table fallback, and a length-encoded confidence
  chart with its own data table — see `docs/MAPS_AND_DISTORTION.md` and
  `docs/DATA_VISUALIZATION.md`.
- CI validation: HTML semantics/landmarks, CSS lint, JSON well-formedness,
  JSON Schema validation, and the editorial-invariant test suite
  described below, on every push and pull request.
- Blind editor mode: a toggle that strips decorative images/framing to
  text-and-structure only.

## Architecture

A static, accessible site with an editorial reasoning layer. No server,
no build step beyond deploying the files as-is; every page fetches its
data from `_data/*.json` at runtime. Full directory layout, data flow,
and deliberate deviations from the original deployment package are in
`docs/ARCHITECTURE.md`.

## Requirements

- Node.js 20+ (for `ajv`, `html-validate`, `stylelint` via `npx`)
- Python 3.12+ (only for the optional research-ingestion tools)
- A web browser and, for local preview, Python's built-in `http.server`

No database, no bundler, no authentication provider, no file-storage
service, and no AI-provider account of any kind.

## Installation

```bash
git clone https://github.com/ukadike/omoluabi-news.git
cd omoluabi-news
npm install
pip install -r requirements.txt   # optional — only for tools/*.py
```

## Environment Configuration

None required — see `.env.example`. This MVP has no server, no database,
and no API keys, including no AI-provider key.

## Database Setup

Not applicable. Content lives in `_data/news.json` and
`_data/evidence.json`, committed directly to the repository — there is no
database in this build. See `docs/ARCHITECTURE.md`.

## Running Locally

```bash
python3 -m http.server 8000
# open http://localhost:8000/index.html
```

Opening `index.html` directly from disk will not work — pages fetch
`_data/*.json` at runtime, which requires an HTTP origin.

## Using the MVP

See `docs/USER_GUIDE.md` for a plain-language walkthrough aimed at
someone using Omoluabi News, not developing it: reading the site,
understanding editorial states, sourcing, uncertainty/contradictions, and
what's genuinely not built yet.

## Publishing Workflow

Publication is git-mediated and always requires an explicit human action:
an editor sets a story's `status` to `published` (or `example` for
demonstration content), commits the change, and merges it to `main`.
GitHub Actions then redeploys automatically — there is no separate manual
deploy step. Full steps: `docs/CONTRIBUTING.md`; the reasoning behind
this mechanism: `docs/decisions/001-human-governed-editorial-authority.md`.

## Sandbox

Two sandboxes exist, and neither can publish itself:

1. Research-tool output (`data/raw/`, `data/processed/`) — git-ignored,
   tagged `needs_review`, and cannot reach the live site through any
   automated path.
2. Story/evidence content marked `status: "draft"` or `"sandbox"` — held
   out of the rendered feed by an explicit allow-list in
   `_js/main.js`, even if committed to the repository.

Both boundaries are tested in CI (`tools/test-editorial-invariants.js`),
not just documented. See `docs/decisions/003-sandbox-publication-boundary.md`.

## Accessibility

WCAG 2.2 AAA text contrast / AA+ UI contrast is the target. Implemented:
skip link, landmark regions, logical heading order, visible keyboard
focus, `prefers-reduced-motion` and `prefers-contrast: more` support,
color-independent status indicators, accessible table patterns, and
blind editor mode. Not yet done: an automated accessibility scan in CI,
and a manual screen-reader pass. Full detail: `docs/ACCESSIBILITY.md`;
gaps: `docs/KNOWN_LIMITATIONS.md`.

## Testing

```bash
npx --yes html-validate 'index.html' 'news/index.html' 'news/**/index.html' 'research/index.html'
npx --yes stylelint --config .stylelintrc.json '_css/**/*.css'
for f in _data/*.json data/sample/*.json data/sample/*.geojson sources/*.json; do python3 -m json.tool "$f" > /dev/null; done
node tools/validate-schemas.js
node tools/test-editorial-invariants.js
python3 -m py_compile tools/research_scraper.py tools/rss_ingester.py tools/entity_keyword_extractor.py
```

All of the above run in CI on every push/PR (`.github/workflows/test.yml`)
and were verified locally during the MVP v1 pass. Full instructions,
including install steps: `docs/DEVELOPER_SETUP.md`.

## Current Limitations

See `docs/KNOWN_LIMITATIONS.md` for the complete, itemized list — no
graphical editing interface, no authentication, one demo story only, no
real research sources registered yet, no automated accessibility scan or
manual screen-reader pass yet, no licensing decision made yet.

## Roadmap / Next Work

Short and grounded, not speculative:

1. A manual screen-reader pass and, separately, an automated
   accessibility check in CI.
2. A lighter-weight authoring path for a non-technical editor, short of
   a full CMS rewrite.
3. A visible retraction/correction notice (today `retracted` just removes
   a story from the feed, same as `draft`).
4. Registering a real research source once one is chosen, per
   `docs/ETHICAL_SCRAPING_POLICY.md`.
5. A licensing decision.

## Archive

The repository's state immediately before this MVP v1 pass is preserved
at git tag `foundational-omoluabi-news` — nothing was rewritten or
discarded. See `archive/README.md` and `docs/MVP_TRANSITION.md` for what
changed and why, and the parent
[Omoluabi](https://github.com/ukadike/omoluabi) repository for the
broader governance/architecture material this project draws on.

## Contributing

Broader external contribution is planned but this project is still in
active pre-public testing — see `CONTRIBUTING.md` (root) and
`docs/CONTRIBUTING.md` for the actual mechanics of adding a story, a
source, or using the research tools.

## Related repos

- [Omoluabi](https://github.com/ukadike/omoluabi) — the parent research
  initiative and governance/architecture source of truth for this
  project.
- [Small Systems Lab](https://github.com/ukadike/Small-Systems-Lab) —
  ecosystem hub.

## License

No open-source license has been formally selected yet. See `LICENSE` for
the decision-pending note — this is a recorded pending decision, not an
invented license.
