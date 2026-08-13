# Decision

Final publication authority belongs to a human editor. No automated
process in this repository may convert content from "possible" to
"publishable."

## Context

Omoluabi News's premise is sovereignty over observation: the person who
noticed something controls how it's held, when it moves, what form it
takes, and who benefits (`docs/REASONING.md`). A reasoning system that
could publish on its own would contradict that premise regardless of how
good its judgment was — the point isn't accuracy, it's who holds the
authority to decide.

## Decision

- The reasoning engine (`_js/reasoning-engine.js`) and timeline engine
  (`_js/timeline-engine.js`) are read-only with respect to publication.
  They compute a ranking, a confidence score, and a set of flagged
  contradictions from data that already exists. Neither writes to
  `_data/news.json`, sets a story's `status`, or has any code path that
  changes what's live on the site.
- The only mechanism that changes what a visitor sees is a human editing
  `_data/news.json` / `_data/evidence.json` / a page under `news/`,
  committing that change, and either merging it to `main` or pushing
  directly (both require repository write access). GitHub Pages then
  redeploys automatically (`.github/workflows/deploy.yml`).
- Git itself is the provenance record: every change to editorial data
  carries an author, a timestamp, and a diff against the prior state,
  inspectable with `git log` / `git blame` on `_data/news.json`. This MVP
  does not build a separate audit-log database — the existing git history
  already satisfies "who decided, what changed, when, and what it changed
  from," per the directive's provenance requirement, without adding
  infrastructure this project doesn't otherwise need.

## Alternatives Considered

- **A CMS with an in-app "publish" button.** Rejected for MVP v1: it
  would require a server, a database, and authentication where none
  currently exist, and the directive explicitly asks not to expand scope
  to match an assumed stack the repository doesn't have. Git-mediated
  publication is a legitimate, auditable human-authority mechanism on its
  own; it's just not a graphical one yet. See `docs/KNOWN_LIMITATIONS.md`.
- **Letting the reasoning engine's confidence score gate publication**
  (e.g., auto-hide anything below a threshold). Rejected: `docs/REASONING.md`
  already states this explicitly — "None of this decides whether a story
  runs... Corrections and disputes should be handled editorially, not by
  tuning the score."

## Consequences

- Publishing a real story currently requires git/GitHub familiarity. This
  is a real, documented limitation for a non-technical editor (see
  `docs/USER_GUIDE.md` and `docs/KNOWN_LIMITATIONS.md`), not a hidden one.
- Because the only path to "live" is a human-authored git commit, the
  feed-filter fix in this same pass (`_js/main.js`'s `PUBLIC_STATUSES`)
  is what keeps a merged-but-not-ready entry (`draft`/`sandbox`) from
  becoming visible even after that human action — see
  `docs/decisions/003-sandbox-publication-boundary.md`.

## Status

Accepted — MVP v1.
