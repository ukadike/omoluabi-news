# Decision

Nothing exploratory, unreviewed, or unresolved can reach the live site
without an explicit human action that moves it out of a bounded sandbox
first. This is enforced in code and CI, not only stated as policy.

## Context

The directive requires an "Omoluabi Sandbox" where competing
interpretations, incomplete evidence, and unresolved material can exist
without being mistaken for a published fact, and requires that boundary
be architectural, not just philosophical. This repository already had
the pieces — they just weren't named or tested as one boundary.

## Decision

Two sandboxes exist, for the two kinds of exploratory content this repo
produces, each with its own enforcement mechanism:

1. **The research-ingestion sandbox** — `data/raw/` and `data/processed/`.
   `tools/research_scraper.py` and `tools/rss_ingester.py` write here,
   every item tagged `"review_status": "needs_review"`
   (`schemas/evidence.schema.json`). Both directories are git-ignored
   (`.gitignore`) — nothing written there can reach a deployed site
   through any automated path, because GitHub Pages only ever serves
   what's committed. The only way material leaves this sandbox is a human
   reading a card and manually copying reviewed content into
   `_data/evidence.json` (see `docs/RESEARCH_ARCHITECTURE.md`, step 10).
   `tools/test-editorial-invariants.js`'s
   `testSandboxDirectoriesAreGitIgnored` asserts this stays true.

2. **The story-drafting sandbox** — the `draft` and `sandbox` values of a
   `_data/news.json` entry's `status` field
   (`schemas/news_entry.schema.json`). `_js/main.js`'s `renderNewsFeed`
   filters every entry through a `PUBLIC_STATUSES` allow-list
   (`["published", "example"]`) before rendering anything — a `draft` or
   `sandbox` entry committed to the repository (for review-in-progress,
   or to demonstrate the reasoning engine on hypothetical content) does
   not appear in the feed even though the JSON file itself is public in
   git history. `tools/test-editorial-invariants.js`'s
   `testFeedFilterExcludesUnpublished` and
   `testLiveStatusesAreDeclaredAndGoverned` assert this.

`retracted` is a third non-authoring state: a story that was published
and no longer stands. It is deliberately **not** in `PUBLIC_STATUSES`
either, on the theory that a retraction should render as a visible
correction notice rather than silently vanish — but no retraction UI is
built yet (see `docs/KNOWN_LIMITATIONS.md`); today setting `status:
"retracted"` simply removes a story from the feed, same as `draft`.

## Alternatives Considered

- **Trusting editorial discipline alone** (i.e., "just don't add
  unfinished stories to news.json"). This is what the repository had
  before this pass — true today because there's only one, reviewed,
  `example` story, but nothing would have stopped a future draft from
  rendering. A convention that isn't tested isn't a boundary.
- **A database-backed draft/published split with row-level access
  control.** Rejected for MVP v1 as a stack change disproportionate to
  what a static site with no server needs — see
  `docs/decisions/001-human-governed-editorial-authority.md`.

## Consequences

- An editor can now safely commit in-progress work (`status: "draft"`)
  without it appearing on the live site, which the previous feed-render
  logic did not actually guarantee.
- The sandbox/publish boundary is exactly two enforcement points
  (a `.gitignore` entry and one array filter) plus one test file. Small
  enough to audit by reading it, which matches the "inspectable,
  explainable" requirement better than a larger permissions system would.

## Status

Accepted — MVP v1.
