# Research Architecture

## Research workflow

1. Define a research question.
2. Register approved sources in `sources/source_registry.json` (for scraping)
   or `sources/rss_feeds.json` (for feeds).
3. Fetch public pages, feeds, datasets, or documents — `tools/research_scraper.py`
   for registered pages, `tools/rss_ingester.py` for feeds.
4. Extract metadata (title, summary, publisher) — done automatically by the
   two tools above.
5. Normalize into Evidence Cards — both tools write
   `data/processed/<id>.evidence.json`, matching `schemas/evidence.schema.json`.
6. Run source ladder scoring — see `_js/reasoning-engine.js`'s `SOURCE_LADDER`,
   the same ladder the news reasoning engine uses.
7. Detect contradictions — same reasoning engine, once an evidence item is
   attached to a story via `evidenceIds`.
8. Attach timeline and location references — `claims`/`locations` fields on
   the evidence card; currently filled in by a human editor, not automated.
9. Review manually — every card `tools/*.py` produces is tagged
   `"review_status": "needs_review"`. Nothing here sets it to `"approved"`.
10. Publish approved items — an editor moves reviewed material into
    `_data/evidence.json` and `_data/news.json` by hand, per
    `docs/CONTRIBUTING.md`.

## Evidence levels

`source_type` on an evidence card, from strongest to weakest:
primary document, official statement, direct observation, local testimony,
expert analysis, reputable reporting, secondary reference, unverified claim.
See `schemas/evidence.schema.json`'s enum for the exact values.

## What's implemented vs. not

Implemented: RSS ingestion (`tools/rss_ingester.py`), static-page scraping for
explicitly registered sources (`tools/research_scraper.py`), a candidate-
keyword extractor (`tools/entity_keyword_extractor.py`), and schema validation
(`tools/validate-schemas.js`).

Not implemented (listed in the original research-tools package, not built in
this pass): PDF metadata tracking, CSV/dataset ingestion, a duplicate
detector, a geocoder adapter. These would follow the same pattern — write to
`data/processed/*.evidence.json`, tag `needs_review` — but weren't built
because nothing in this pass needed them yet; adding one without a concrete
use is exactly the kind of scaffolding-for-its-own-sake this repo's audits
have flagged before.

## Never automate final truth

These tools surface patterns and candidates for a human to review. None of
them decide what's true, what's confirmed, or what gets published — that
stays editorial, per `docs/EDITING-GUIDELINES.md`.
