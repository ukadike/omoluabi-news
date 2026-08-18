# Omoluabi-News

An accessible, static editorial reasoning platform — the first working build of
this repository, per the "Ready for Claude Code sprint" deployment package
delivered by Kemi (see `docs/` for the full architecture, reasoning, accessibility,
deployment, contributing, and editing-standards docs).

## Quick start

```bash
python3 -m http.server 8000
# open http://localhost:8000/index.html
```

No build step, no framework, no server dependency — every page fetches its data
from `_data/*.json` at runtime. See `docs/ARCHITECTURE.md`.

The retired browser-prototype engine (the newsroom's first back office) still
runs at `http://localhost:8000/archive/engine-browser-prototype/` — see
"Web Engine" below for the current direction.

## What this is meant to be

Per the [Omoluabi repository](https://github.com/ukadike/omoluabi)'s README, which
already describes this project:

> Omoluabi-News, an accessible, portable newsroom system, is the first live
> implementation of this model: self-hostable, deployable on low-cost hardware, and
> built to help independent publishers reclaim control over how they create, publish,
> and sustain their work.

It's the first live implementation of the Omoluabi model — an accessible, portable,
self-hostable newsroom/publishing node built to help independent publishers reclaim
control over how they create, publish, and sustain their work, with AI assistance
under clear human oversight (editorial control, accessibility, provenance, and
consent as governing principles).

This repository now has real content of its own — see `docs/ARCHITECTURE.md`,
`docs/REASONING.md`, `docs/ACCESSIBILITY.md`, `docs/DEPLOYMENT.md`,
`docs/CONTRIBUTING.md`, and `docs/EDITING-GUIDELINES.md`. The fuller Omoluabi
governance docs still live in the [Omoluabi repo](https://github.com/ukadike/omoluabi)
(`governance/`, `architecture/`, `cards/`, `schemas/`) and remain the source of
truth for anything not specific to this newsroom implementation.

## Web Engine (`engine/`)

The web engine — Omoluabi's governed review and authoring interface — lives in
this repository, per Kemi's direction (2026-07-08) that Omoluabi-News is where
the web engine lives.

**Current state (2026-08-18):** Kemi designated a new web engine plan and
shared the planning conversation behind it. That conversation is preserved
at `engine/sources/planning-conversation-2026-08.md`, and draft spec
documents reconstructed from it — with per-section provenance markers —
live in `engine/docs/` and `engine/tasks/`. The two original files Kemi
uploaded to that conversation remain `AWAITING FRAGMENT`; see
`engine/README.md` for the index and open questions (including a
muted-token conflict awaiting Kemi's ruling). No app code exists yet.

**Previous engine:** the first running engine — a browser-only, local-first
(IndexedDB) human review interface over the governance pipeline, moved here
from the Omoluabi repo's `web-engine/app/` — is retired and preserved intact
at `archive/engine-browser-prototype/` (see its `ARCHIVED.md`). It still runs
from that directory. The planning documentation it implemented
(`web-engine/*.md`, `architecture/governance-pipeline.md`) remains in the
[Omoluabi repo](https://github.com/ukadike/omoluabi).

Whatever the stack, the engine never bypasses the governance pipeline
(Observation → Consent → Source → Risk → Accessibility → Human Review →
Publication Status → Archive), AI assists but does not decide publication
status, and the shared Small Systems Lab visual-token system stays locked.

## Related repos

- [Omoluabi](https://github.com/ukadike/omoluabi) — the parent research initiative and
  governance/architecture source of truth for this project.
- [Small Systems Lab](https://github.com/ukadike/Small-Systems-Lab) — ecosystem hub.

## Status

MVP built: homepage, news feed, one demo story exercising the full reasoning and
timeline engines, GitHub Actions deploy + validation workflows. One demo story
only (`_data/news.json`, `status: "example"`) — see `docs/EDITING-GUIDELINES.md`
before adding real reporting. Not yet manually screen-reader tested; see
`docs/ACCESSIBILITY.md` "Known gaps".

Research tools added: an 18-layer reasoning model (12 original + 6 new),
a `/research/` page (evidence map + confidence chart, sample data only),
and dormant scraper/RSS/entity-extraction tools gated behind a source
registry that currently holds only placeholder entries — see
`docs/RESEARCH_ARCHITECTURE.md` and `docs/ETHICAL_SCRAPING_POLICY.md`
before pointing any of it at a real source.
