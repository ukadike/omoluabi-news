# Accessibility

WCAG 2.2 AAA is the target for text contrast (7:1) and AA+ for UI
components (4.5:1). This is not negotiable against visual preference —
see the Visual System Lock in the deployment reference: paper `#efece2`,
ink `#1a1a1a`, line `#d0cdc6`, no gradients, no shadows, no border-radius.

## What's implemented

- **Skip link** — `.skip-link` in `_css/style.css`, first focusable element
  on every page, jumps to `#main`.
- **Landmarks** — `<header>`, `<nav>`, `<main>`, `<footer>` on every page,
  without redundant `role` attributes (the elements already carry those
  landmark roles; `html-validate`'s `no-redundant-role` rule enforces this
  in CI).
- **Heading hierarchy** — h1 (page title) → h2 (section) → h3 (evidence
  card titles), no skipped levels.
- **Focus indicators** — `:focus-visible` outlines at 2px solid ink, with
  an explicit fallback for browsers without `:focus-visible` support (see
  the `:focus:not(:focus-visible)` rules in `_css/style.css`, which only
  suppress the default outline once the newer selector is guaranteed to
  draw its own).
- **`prefers-contrast: more`** — line and muted colors collapse to ink for
  stronger borders and text.
- **`prefers-reduced-motion: reduce`** — all transitions/animations
  collapse to near-zero duration.
- **Color-independent status** — tags and the example-story notice use
  text and borders, not color alone, to carry meaning.
- **Accessible tables** — `<caption>`, `<th scope="col">` on evidence
  matrices (see the example in the deployment reference; not yet needed by
  the one shipped story, but the CSS supports it).
- **Blind editor mode** — `.blind-editor-mode` class toggled by the footer
  link, hides `img` and `.decorative` elements and forces backgrounds back
  to paper, so a reader who wants text-and-structure-only can get it.
- **Alt text** — no images ship in this build yet (the one demo story is
  text-only); when an image is added, `alt` is required by review before
  merge (see `docs/CONTRIBUTING.md`).
- **Map + chart fallbacks** — `research/index.html`'s evidence map always
  renders with a plain-text distortion note above it and a full data table
  below it (`src/visualizations/charts.js`'s `renderFeatureTable`); the
  confidence chart is a length-encoded bar with an `aria-label` carrying
  the number, plus its own data table. See `docs/MAPS_AND_DISTORTION.md`
  and `docs/DATA_VISUALIZATION.md`.

## Omoluabi extensions not yet built

The research-tools package also asked for a transcript-first research
mode, a low-bandwidth mode, and a print archive mode. None are built —
there's no audio/video or bandwidth-heavy content yet for the first two to
apply to, and a print stylesheet without real long-form printable content
to test against would be guesswork. Blind editor mode (above) was built
because it has something concrete to hide today (the example-story
notice's decorative framing).

## What's checked in CI

`html-validate` on every page (semantics, landmark roles, void-element
style) and `stylelint` on `_css/style.css`. Neither one substitutes for a
real screen-reader pass — that's still a manual step (VoiceOver or NVDA)
before anything ships to a wider audience, per the deployment checklist.

## Known gaps

- No automated axe-core or Lighthouse CI job yet — the original deployment
  package asked for both; this pass shipped HTML/CSS/JSON validation only,
  because adding axe/Lighthouse against a live local server inside CI is a
  larger, separate piece of work (spinning up a server, waiting for it,
  handling flakiness) that deserves its own pass rather than a rushed,
  probably-broken first attempt.
- No captions/transcripts exist yet because no audio/video ships yet.
