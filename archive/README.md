# Archive

This directory documents where and how this repository's history is
preserved. It does not contain a copy of a prior codebase — see
`docs/decisions/004-foundational-omoluabi-archive.md` for why.

## What existed before?

`omoluabi-news` before this pass was already a working static site: a
homepage, a news feed, one honestly-sourced demo story, a 18-layer
editorial reasoning engine, a timeline-integrity checker, and a
research-ingestion toolkit (scraper, RSS ingester, keyword extractor)
gated behind a source registry holding only placeholder entries. It had
no explicit, tested boundary between exploratory/draft content and
published content, and it did not yet carry the documentation set
(`README`, `CHANGELOG`, user/developer guides, architecture decision
records) a project preparing for public release needs.

That state is preserved exactly, byte-for-byte, at git tag
[`foundational-omoluabi-news`](../../../tree/foundational-omoluabi-news) —
`git checkout foundational-omoluabi-news` reproduces it.

## Why was it changed?

To bring the existing build into alignment with the Omoluabi MVP v1
directive: a named, tested sandbox/publication boundary; explicit
editorial states; and the documentation required for another developer,
an editor, or a future public audience to understand and use the project
without reconstructing context from scratch.

## What did we learn?

That the repository's existing architecture — static files, git-mediated
publishing, a gitignored research-ingestion sandbox, a deterministic
reasoning engine — already embodied most of the directive's principles.
The gap wasn't the architecture; it was that one real invariant (the news
feed rendering *every* entry regardless of status, not just published
ones) was enforced by convention only, and nothing said so in writing
until this pass.

## What was preserved?

Everything: the visual system, the reasoning and timeline engines, the
demo story, the research tools, every existing doc, and the full git
history from the initial commit forward. Nothing was rewritten or
replaced. See `CHANGELOG.md`'s "Preserved" section for the itemized list.

## What was retired?

Nothing was removed from active use. The only behavioral change is that
`_js/main.js`'s feed renderer now filters by status instead of rendering
unconditionally — see
`docs/decisions/003-sandbox-publication-boundary.md`.

## Where can the prior implementation be inspected?

- `git checkout foundational-omoluabi-news` (or browse the tag on GitHub)
  for the exact pre-MVP-v1 state.
- `git log` for the full incremental history — every commit from
  `12156ed` (initial commit) forward is unmodified.
- The parent [`omoluabi`](https://github.com/ukadike/omoluabi) repository
  holds the broader Omoluabi governance/architecture material (schema
  cards, quantum-state design) this repository's README has always
  pointed to. It is a separate repository and was not touched by this
  pass.

## What is canonical now?

**Omoluabi MVP v1**, on the default branch, as described in this
repository's `README.md`, `CHANGELOG.md`, and `docs/`.
