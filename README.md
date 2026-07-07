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
