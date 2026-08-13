# Decision

Preserve this repository's pre-MVP-v1 history through a git tag
(`foundational-omoluabi-news`) and honest documentation
(`archive/README.md`, `docs/MVP_TRANSITION.md`), rather than moving files
into an `/archive/` directory or fabricating a "previous implementation"
that didn't exist inside this specific repository.

## Context

The directive assumes a scenario where an earlier, materially different
implementation is being replaced by MVP v1, and asks that it be preserved
under `/archive/foundational-omoluabi/` and documented as "Foundational
Omoluabi." This repository's actual history doesn't match that shape: it
is one continuous, incrementally-built line of work —

1. `12156ed` — initial commit, `.gitattributes` only.
2. `0ffa6b9` — a repository-restoration pass found the repo "effectively
   empty" and added a stub README and audit (`docs/REPO_AUDIT.md`).
3. `b299057` — the first MVP build: homepage, news feed, one demo story,
   the reasoning and timeline engines, deploy/test workflows.
4. `40c2e14` — a research-tools expansion: scraper, RSS ingestion,
   evidence map, six additional reasoning layers.
5. This pass — the sandbox/publication boundary formalized as tested
   code, plus the documentation set the directive requires.

There is no separate, divergent "old build" living alongside the current
one inside `omoluabi-news` to move into an archive folder. Physically
relocating today's only implementation into `/archive/` and leaving
nothing at the repository root would misrepresent the repo as having a
history it doesn't have.

The broader "Foundational Omoluabi" governance and architecture material
the directive describes — schema cards, quantum-state design, the wider
research initiative — lives in the parent
[`omoluabi`](https://github.com/ukadike/omoluabi) repository, which this
README already pointed to before this pass and which is outside this
session's repository access.

## Decision

- Tag the commit immediately before this pass's changes
  (`ec72af9`, the tip of `main` at session start) as
  `foundational-omoluabi-news`. That tag is the preservation mechanism
  the directive asks for — "if a Git tag... is a cleaner preservation
  mechanism, use that instead" — applied literally, because it is.
- `archive/README.md` documents this decision and answers the directive's
  required questions (what existed before, why it changed, what was
  learned, preserved, retired, where it's inspectable, what's canonical
  now) against the repository's real history, not an invented one.
- No files move. `main`'s history from `12156ed` forward remains exactly
  as it is; nothing is rewritten, squashed, or force-pushed.
- After this pass is verified (tests pass, site runs locally), tag the
  resulting commit `mvp-v1`, matching `package.json`'s `"version":
  "0.1.0"` and the product name "Omoluabi MVP v1" used throughout the
  documentation.

## Alternatives Considered

- **Physically copying the pre-pass tree into `archive/foundational-
  omoluabi/`.** Rejected: it would duplicate nearly the entire repository
  (the pre-pass tree *is* almost all of the current tree) inside itself,
  and git already preserves it exactly, byte-for-byte, more reliably than
  a manual copy would.
- **Describing the pre-research-tools MVP (`b299057`) as "Foundational"
  and the research-tools expansion (`40c2e14`) plus this pass as "v1."**
  Rejected as an arbitrary line: nothing about the research-tools commit
  was a rewrite or a different implementation, it was additive, same as
  this pass. Drawing a "foundational vs. current" boundary there would be
  inventing a discontinuity that isn't in the actual history.

## Consequences

- A reader looking for "the old Omoluabi News" will find it at `git show
  foundational-omoluabi-news` or in `git log`, not in a subdirectory —
  documented clearly in `archive/README.md` and `README.md`'s Archive
  section so this isn't a dead end.
- This ADR itself is the record of why `/archive/` in this repository
  contains documentation rather than a second copy of the codebase.

## Status

Accepted — MVP v1.
