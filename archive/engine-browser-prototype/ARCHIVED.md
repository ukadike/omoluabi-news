# ARCHIVED — Editorial Engine (browser prototype)

Status: **RETIRED** (2026-08-16, per Kemi's direction)

## What this was

The first running web engine: a browser-only, local-first (IndexedDB) human
review interface over the Omoluabi governance pipeline. It implemented the ten
screens of the Omoluabi repo's `web-engine/screens.md`, gated in the exact
order of `architecture/governance-pipeline.md` (no screen may skip ahead,
enforced by `js/gate.js`), plus a manual "New observation" form with a
required headline and a news preview limited to records with an explicit
human `public` decision. AI assist was a labeled stub — no model wired in,
advisory only, never deciding publication status.

## Provenance

- Built in the Omoluabi repo as `web-engine/app/`.
- Moved here as `engine/`, per Kemi's direction (2026-07-08) that
  Omoluabi-News is where the web engine lives.
- Moved to `archive/engine-browser-prototype/`, retired per Kemi's direction
  (2026-08-16) that a new web engine plan supersedes it.

## Why retired

Kemi designated a new web engine plan (2026-08-16). This prototype answered
its question — the full Observation → Consent → Source → Risk →
Accessibility → Human Review → Publication Status → Archive → Read loop can
run end to end in a browser with no backend — and is preserved here as the
working record of that answer.

## What replaced it

See `engine/README.md` at the repository root. The new engine's specification
documents are not yet physically present in this repository and are indexed
there as `AWAITING FRAGMENT` only.

## Still runs

The prototype is self-contained static HTML/CSS/JS and still runs from this
directory (`index.html`). Its data lives in the browser's IndexedDB. Its
`css/variables.css` is a verbatim copy of the locked Small Systems Lab
visual-token system, frozen here as part of the record — the live copy of
that system is maintained elsewhere; do not update this one.
