# Changelog

## Omoluabi MVP v1

### Added

- `schemas/news_entry.schema.json` and `schemas/news_evidence_source.schema.json`
  — formal JSON Schemas for `_data/news.json` and `_data/evidence.json`,
  validated in CI (`tools/validate-schemas.js`).
- An explicit editorial `status` enum: `draft`, `sandbox`, `published`,
  `example`, `retracted`.
- `_js/main.js`: a `PUBLIC_STATUSES` allow-list that filters the feed
  renderer to `published`/`example` only, plus an empty-state message
  when no story qualifies.
- `tools/test-editorial-invariants.js` — five tests locking in the
  invariants that must never silently regress: unpublished statuses
  never render, the research-ingestion sandbox stays git-ignored,
  evidence references resolve, live statuses are declared and correctly
  governed, and no frontier-AI SDK is a dependency. Wired into
  `.github/workflows/test.yml`.
- `README.md` (restructured), `CONTRIBUTING.md` (root), `LICENSE`
  (decision-pending note), `.env.example`.
- `archive/README.md`, `docs/MVP_TRANSITION.md`,
  `docs/USER_GUIDE.md`, `docs/DEVELOPER_SETUP.md`,
  `docs/KNOWN_LIMITATIONS.md`.
- `docs/decisions/001-human-governed-editorial-authority.md`,
  `002-no-frontier-model-core-dependency.md`,
  `003-sandbox-publication-boundary.md`,
  `004-foundational-omoluabi-archive.md`.
- `.empty-state` style in `_css/style.css`.

### Changed

- `tools/validate-schemas.js` now also validates `_data/news.json` and
  `_data/evidence.json` against the new schemas, not just compiling the
  research-pipeline schemas.
- `.github/workflows/test.yml`: added an "Editorial invariants" step.

### Preserved

- The visual system (`_css/style.css`), the reasoning engine
  (`_js/reasoning-engine.js`), the timeline engine
  (`_js/timeline-engine.js`), the one demo story
  (`news/how-this-newsroom-holds-evidence/`), all research-ingestion
  tools (`tools/*.py`), all prior documentation
  (`docs/ARCHITECTURE.md`, `ACCESSIBILITY.md`, `CONTRIBUTING.md`,
  `DATA_VISUALIZATION.md`, `DEPLOYMENT.md`, `EDITING-GUIDELINES.md`,
  `ETHICAL_SCRAPING_POLICY.md`, `MAPS_AND_DISTORTION.md`, `REASONING.md`,
  `REPO_AUDIT.md`, `RESEARCH_ARCHITECTURE.md`, `RESEARCH_REFERENCES.md`),
  the deploy workflow, and the complete git history from the initial
  commit forward (also preserved explicitly at git tag
  `foundational-omoluabi-news`).

### Retired from Active MVP

- Nothing. No feature, page, or tool was removed. The feed renderer's
  behavior changed (see "Changed" — draft/sandbox entries no longer
  render), but no status value or capability was deleted.

### Known Limitations

See `docs/KNOWN_LIMITATIONS.md` for the full, itemized list. Headlines:
no graphical editing interface (git-based publishing only), no
authentication, one demo story only, no real research sources
registered, no automated accessibility scan or manual screen-reader pass
yet, no licensing decision made yet.

### Why This Version Exists

The repository already had a working static site, a deterministic
editorial reasoning engine, and real documentation — it did not need a
rewrite. What it lacked was a *named and tested* boundary between
exploratory/draft content and what's actually published: the feed
renderer displayed every entry in `_data/news.json` regardless of status,
which meant the only thing keeping unfinished work off the live site was
editorial discipline, not code. This version closes that specific gap,
formalizes the editorial data model as JSON Schema, and adds the
documentation set — user guide, developer setup, known limitations,
architecture decision records, transition and archive notes — a project
moving toward public testing and eventual open-source release needs so
it can be understood by someone other than its original developer. It
does not add features beyond that scope, per the directive's instruction
not to expand scope indefinitely.
