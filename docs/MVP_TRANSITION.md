# MVP v1 Transition

How `omoluabi-news` moved from an unversioned working build to
**Omoluabi MVP v1**, and what changed to get there. For the preservation
mechanism and the reasoning behind it, see `archive/README.md` and
`docs/decisions/004-foundational-omoluabi-archive.md`.

## Where the repository stood

At git tag `foundational-omoluabi-news` (the tip of `main` when this pass
began), the repository was a functioning static site:

- A homepage, a news archive, and one demo story
  (`news/how-this-newsroom-holds-evidence/`), clearly labeled as
  demonstration content.
- An 18-layer editorial reasoning engine and a timeline-integrity
  checker, both deterministic, both client-side, both dependency-free.
- A research-ingestion toolkit (`tools/research_scraper.py`,
  `tools/rss_ingester.py`, `tools/entity_keyword_extractor.py`) writing
  to a gitignored `data/raw/` / `data/processed/`, gated behind a source
  registry (`sources/source_registry.json`) holding only placeholder
  entries — nothing had been scraped or ingested for real.
- CI validating HTML, CSS, JSON, and JSON Schema well-formedness on every
  push and pull request.
- Nine docs already in `docs/`: `ARCHITECTURE.md`, `ACCESSIBILITY.md`,
  `CONTRIBUTING.md`, `DATA_VISUALIZATION.md`, `DEPLOYMENT.md`,
  `EDITING-GUIDELINES.md`, `ETHICAL_SCRAPING_POLICY.md`,
  `MAPS_AND_DISTORTION.md`, `REASONING.md`, `RESEARCH_ARCHITECTURE.md`,
  `RESEARCH_REFERENCES.md`, `REPO_AUDIT.md`.

This was already close to the directive's thesis. What follows is what
this pass changed to close the gap, not a rebuild.

## What this pass changed

1. **Named and tested the sandbox/publication boundary.** The feed
   renderer (`_js/main.js`) rendered every entry in `_data/news.json`
   regardless of `status`, relying on editorial discipline (don't commit
   an unfinished story) rather than code to keep unpublished material off
   the live site. This pass added an explicit `status` enum (`draft`,
   `sandbox`, `published`, `example`, `retracted`,
   `schemas/news_entry.schema.json`), a `PUBLIC_STATUSES` allow-list in
   the renderer, and a test (`tools/test-editorial-invariants.js`) that
   fails CI if that filter is ever weakened. See
   `docs/decisions/003-sandbox-publication-boundary.md`.
2. **Added JSON Schemas for the live data files.** `_data/news.json` and
   `_data/evidence.json` previously had no formal schema (only the
   research-pipeline's `schemas/evidence.schema.json`, a different
   format, did). `tools/validate-schemas.js` now validates both files on
   every CI run.
3. **Added an empty-state message** to the feed renderer for the case of
   zero published entries — previously an empty feed rendered nothing at
   all, with no indication to a visitor that this was expected.
4. **Added the documentation set MVP v1 requires**: this file,
   `README.md` (restructured), `CHANGELOG.md`, `archive/README.md`,
   `docs/USER_GUIDE.md`, `docs/DEVELOPER_SETUP.md`,
   `docs/KNOWN_LIMITATIONS.md`, four architecture decision records,
   `.env.example`, and a `LICENSE` decision-pending note.
5. **Tagged the pre-pass state** `foundational-omoluabi-news` and will
   tag the verified result `mvp-v1`.

## What this pass did not change

The visual system, the reasoning/timeline engine logic, the demo story's
content, the research tools' behavior, the deploy workflow, and every
existing doc's substance (beyond small cross-references to the new
material). Nothing here was a rewrite.

## Naming

Per the directive, the product is now referred to as **Omoluabi MVP v1**
in user-facing documentation; the software package version
(`package.json`) is `0.1.0`, unchanged by this pass — it already matched
the directive's suggested scheme for an MVP release.
