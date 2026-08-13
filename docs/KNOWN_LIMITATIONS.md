# Known Limitations — Omoluabi MVP v1

Honest, itemized. A transparent incomplete MVP is better than a
fictional complete one. For each item: what doesn't work, whether
there's a workaround, whether it blocks testing, and whether it's
expected before public beta / open-source release.

## Editorial workflow

**No graphical editing interface.** Creating, editing, and publishing a
story requires editing JSON/HTML files and using git (see
`docs/USER_GUIDE.md`, `docs/CONTRIBUTING.md`).
- Workaround: none — this is the actual mechanism, not a stand-in for a
  missing one.
- Blocks testing: no, for a developer or technically-comfortable editor.
  Yes, for a non-technical editor working alone.
- Expected before public beta: a lighter-weight authoring path (even a
  guided script, short of a full CMS) is reasonable to want before wider
  non-developer use; no timeline is set. See `docs/decisions/001-human-governed-editorial-authority.md`.

**No authentication or access control.** Anyone with repository write
access can publish; there's no reader/editor account distinction.
- Workaround: control access via GitHub repository permissions.
- Blocks testing: no.
- Expected before public beta: yes, if this project takes external
  contributions before a CMS-style workflow exists.

**Retraction has no distinct UI.** A `"status": "retracted"` story is
simply excluded from the feed — same as `draft`. The directive's intent
(a visible correction notice rather than silent removal) isn't built.
- Workaround: none currently; retracting today reads the same as never
  having published.
- Blocks testing: no (no story has needed retraction yet).
- Expected before public beta: recommended, not required.

## Content

**One demo story only.** `_data/news.json` has a single `"example"`
entry. No real reporting has been published yet.
- Workaround: none needed — this is expected for an MVP being tested.
- Blocks testing: no, the point of this pass is to validate the
  mechanism, not populate it.
- Expected before public beta: real content, yes, eventually — not a
  blocker for MVP testing itself.

**No media (images, audio, video) ships yet.** Alt-text and
caption/transcript requirements (`docs/ACCESSIBILITY.md`) are specified
but untested against real media.
- Workaround: none.
- Blocks testing: no.
- Expected before public beta: yes, once any story needs media.

**Research tools are not pointed at real sources.**
`sources/source_registry.json` and `sources/rss_feeds.json` contain only
`example.com` placeholders; nothing has been scraped or ingested for
real. The Research page renders sample data only.
- Workaround: register a real, policy-compliant source per
  `docs/ETHICAL_SCRAPING_POLICY.md` when ready.
- Blocks testing: no.
- Expected before public beta: a deliberate, later decision — not
  automatic.

## Accessibility

**No automated accessibility scan (axe-core, Lighthouse) in CI.**
`docs/ACCESSIBILITY.md`'s "Known gaps" already documents this; CI
currently runs `html-validate` and `stylelint` only.
- Workaround: manual review against WCAG 2.2 criteria.
- Blocks testing: no.
- Expected before public beta: yes — flagged as a "larger, separate
  piece of work" in `docs/ACCESSIBILITY.md`, not yet scheduled.

**No manual screen-reader pass has been performed.** VoiceOver/NVDA
testing is called out as a required manual step before wider release in
`docs/DEPLOYMENT.md`'s checklist and hasn't happened yet.
- Workaround: none — this is a genuine gap, not a documentation gap.
- Blocks testing: no, for sighted/keyboard-only testing. Yes, for
  confidently claiming screen-reader support.
- Expected before public beta: required.

**WCAG conformance is a target, not a verified claim.**
`docs/ACCESSIBILITY.md` targets AAA text contrast / AA+ UI contrast and
implements specific patterns (skip link, landmarks, focus-visible,
reduced-motion, contrast-more, color-independent status), but no formal
conformance audit has been done.
- Workaround: none.
- Blocks testing: no.
- Expected before public beta: an audit is recommended before any public
  accessibility claim is made.

## Provenance and review

**No in-app edit history view.** Provenance (`who changed what, when`)
exists only as git history (`git log -p _data/news.json`), not as a
feature visible on the site itself.
- Workaround: `git log` / `git blame`, or GitHub's own commit history UI.
- Blocks testing: no.
- Expected before public beta: not required — git history is a
  legitimate provenance record for a project this size, per
  `docs/decisions/001-human-governed-editorial-authority.md`.

## Architecture

**Static site only — no server, no database.** By design for MVP v1
(see `docs/decisions/001-human-governed-editorial-authority.md`), but it
does mean nothing here can do server-side validation, rate-limiting, or
access control beyond what GitHub itself provides.
- Blocks testing: no.
- Expected before public beta: revisit only if a graphical CMS is later
  built; not planned for MVP v1 itself.

**No licensing decision yet.** See root `LICENSE` — publication under a
specific open-source license is pending a decision, not yet made.
- Blocks testing: no.
- Expected before public beta: required before any public open-source
  release (directive §11).

## Testing coverage

**No end-to-end browser test suite.** Verification is: static analysis
(`html-validate`, `stylelint`, JSON/schema validation), the editorial-
invariant unit tests (`tools/test-editorial-invariants.js`), and manual
click-through in a local server. No Playwright/Cypress-style automated
browser test exists.
- Workaround: manual click-through per `docs/DEPLOYMENT.md`.
- Blocks testing: no.
- Expected before public beta: worth adding if the editorial UI grows
  more interactive; not required for the current static-page scope.
