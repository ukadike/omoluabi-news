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

The editorial engine (the newsroom's back office) is at
`http://localhost:8000/engine/` — see "Editorial Engine" below.

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

## Editorial Engine (`engine/`)

The web engine — Omoluabi's governed review and authoring interface — lives in
this repository, per Kemi's direction (2026-07-08) that Omoluabi-News is where
the web engine lives. It was moved here from the Omoluabi repo's
`web-engine/app/` (which now points back here); the planning documentation it
implements (`web-engine/*.md`, `architecture/governance-pipeline.md`) remains
in the [Omoluabi repo](https://github.com/ukadike/omoluabi) as the source of
truth.

What it does:

- **New observation** (`engine/#/new`) — create a story by hand, no field
  device required (`source.origin_type: "web-form"`). **Every story needs a
  headline**: the form requires a `title`, stored on the observation record.
- **Review pipeline** — Source → Consent → Risk → Accessibility → AI assist →
  Human review → Publication status, gated in order; no screen may skip ahead.
- **News preview** (`engine/#/news`) — reader view of records with an explicit
  human `public` publication decision only.
- **Archive & search** — JSON export for non-private decided records.

Engine data lives in the browser's IndexedDB (prototype decision — see the
Omoluabi repo's `web-engine/local-first-plan.md`); the public site's stories
live in `_data/news.json`. Bridging the two (exporting a published engine
record as a `news.json` entry) is a planned follow-up, not yet built — today
an editor copies the story across by hand.

`engine/css/variables.css` is a verbatim copy of the shared Small Systems Lab
visual-token system (locked; do not redesign from this repo).

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
