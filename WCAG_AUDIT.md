# WCAG 2.1 AA Accessibility Audit — Omoluabi News

Scope: all HTML (`index.html`, `news/index.html`, `news/story-template.html`,
`news/how-this-newsroom-holds-evidence/index.html`, `research/index.html`),
`_css/style.css`, and all JS (`_js/*.js`, `src/**/*.js`).

This repository's visual system and markup were already built with
accessibility as a first-class concern (skip link, landmarks, `:focus-visible`
outlines, `prefers-reduced-motion`, `prefers-contrast: more`, chart/map table
fallbacks, no forms, no images). The audit found a small number of concrete
defects plus a few low-risk improvements; nothing structural was wrong.

## Summary

| Severity | Found | Fixed | Left open |
|---|---|---|---|
| Serious | 1 | 1 | 0 |
| Moderate | 3 | 3 | 0 |
| Minor | 2 | 2 | 0 |
| **Total** | **6** | **6** | **0** |

No `AWAITING FRAGMENT` items — there is no ambiguous image or content whose
meaning would require guessing; the repository ships no images at all.

## Issues found and fixed

### 1. Duplicate `id="timeline-container"` (Serious — WCAG 4.1.1 Parsing / 1.3.1)
- **Where:** `_js/timeline-engine.js:41` (old), rendering into
  `<div id="timeline-container">` in `news/story-template.html:75` and
  `news/how-this-newsroom-holds-evidence/index.html:81`.
- **Issue:** `TimelineEngine.render()` injected `<ol id="timeline-container">`
  *inside* a container `<div>` that already carried that same id, so every
  story page rendered two elements sharing one id. Duplicate ids break
  `id`-based references (fragment links, `aria-describedby`/`aria-labelledby`,
  `getElementById`) and are invalid HTML.
- **Fix:** removed the `id` from the generated `<ol>`; the existing container
  div's id is authoritative.

### 2. Heading level skipped in the timeline (Moderate — WCAG 1.3.1 Info & Relationships)
- **Where:** `_js/timeline-engine.js:36` (old).
- **Issue:** Each story page has `h2 "Timeline"` then, per rendered event,
  jumped straight to `<h4>${event.title}</h4>` — skipping `h3`.
- **Fix:** changed to `<h3>`, correctly nesting one level under the section
  heading (matches the sibling pattern already used for evidence cards, which
  are `h3` under their own `h2`).

### 3. Missing `aria-current="page"` on the homepage nav (Moderate — WCAG 1.3.1 / 4.1.2)
- **Where:** `index.html:30`.
- **Issue:** `news/index.html` and `research/index.html` both mark their own
  nav item with `aria-current="page"`; `index.html`'s "Home" link was the only
  one that didn't, so the site's own wayfinding pattern was inconsistent and
  assistive tech got no "current page" signal on the homepage.
- **Fix:** added `aria-current="page"` to the Home link in `index.html`. Also
  added a same-page CSS rule, `.primary-nav a[aria-current="page"]` in
  `_css/style.css`, giving the current nav item a bold weight and thicker
  underline — a sighted-but-non-color cue that matches the ARIA state (WCAG
  1.4.1, belt-and-suspenders; not previously any color-only issue, but there
  was no visual cue at all).

### 4. Ambiguous repeated link text (Moderate — WCAG 2.4.4 Link Purpose)
- **Where:** `_js/main.js` (news feed cards, "Read full story"); inline
  render scripts in `news/story-template.html` and
  `news/how-this-newsroom-holds-evidence/index.html` ("Source link" per
  evidence card).
- **Issue:** Every news-card teaser repeats the exact link text "Read full
  story," and every evidence card repeats "Source link" — both technically
  pass 2.4.4 today because the enclosing article/card gives context, but a
  screen-reader user browsing by a flattened links list (a common navigation
  mode) hears the same ambiguous phrase over and over with no way to tell
  which story or source it points to.
- **Fix:** added `aria-label` on each such link carrying the specific title,
  e.g. `aria-label="Read full story: {title}"` and
  `aria-label="Source link: {evidence title}"`, so the accessible name is
  unique and descriptive per instance while the visible text stays short.

### 5. Documented "blind editor mode" toggle had no way to invoke it (Serious — WCAG 4.1.2 Name, Role, Value / 2.1.1)
- **Where:** all five HTML pages; existing support code in `_js/main.js`
  (`initBlindEditorMode()`) and `_css/style.css` (`.blind-editor-mode` rules).
- **Issue:** `docs/ACCESSIBILITY.md` documents this feature as implemented,
  "toggled by the footer link" — the JS handler and CSS are fully built and
  correctly wire up `aria-pressed` state changes on click — but **no page
  actually renders the control**. The feature was completely unreachable by
  any user, sighted or not, despite being fully functional underneath.
- **Fix:** added `<button type="button" class="button" data-blind-editor-toggle aria-pressed="false">Blind editor mode</button>`
  to the footer of all five pages (`index.html`, `news/index.html`,
  `research/index.html`, `news/story-template.html`,
  `news/how-this-newsroom-holds-evidence/index.html`). It's a native
  `<button>` (correct role, keyboard-operable by default, no custom ARIA
  widget needed) and the existing JS already sets `aria-pressed` correctly on
  toggle.

### 6. `line` color used only for non-essential decoration (Reviewed, no fix needed)
- **Where:** `_css/style.css` — `--line: #d0cdc6` borders on `pre`,
  `.tag-list li`, `#reasoning-layers details`, `.evidence-card`, `table`
  cells, `.evidence-map`.
- **Contrast:** `--line` on `--paper` measures **1.34:1**, well under the
  3:1 non-text contrast threshold (SC 1.4.11).
- **Assessment:** 1.4.11 applies to UI components/states and graphical
  objects required to understand content. None of these borders gate
  understanding or mark an interactive control's boundary/state — every
  interactive element (`button`, `.button`, focus outlines, the
  confidence-bar) already uses `--ink` (14.7:1) for its border. Text inside
  bordered boxes remains fully legible without the border. Left as-is; noted
  here rather than silently passed over.

## Checked and already compliant (no changes needed)

- **1.1.1 Non-text content:** no images ship anywhere in the repository; the
  one external-image dependency (OpenStreetMap map tiles via Leaflet) always
  ships with a text distortion note and a full accessible data-table fallback
  (`src/visualizations/charts.js` `renderFeatureTable`), per
  `docs/MAPS_AND_DISTORTION.md`.
- **1.3.1 Landmarks/lists/labels:** `header`/`nav`/`main`/`footer` on every
  page, no redundant landmark roles, tag lists and nav lists marked up as
  `<ul>`, evidence fields as `<dl>`/`<dt>`/`<dd>`. No forms exist in this
  repository, so no label-association issue applies.
- **1.4.1 Use of color:** links are always underlined (never color-only);
  the example-story notice is a bordered box with its own text, not a color
  cue; tag pills carry meaning in text, not color.
- **1.4.3 / 1.4.11 Contrast:** measured against the actual custom-property
  values — ink-on-paper body text 14.7:1, muted-on-paper (footer/metadata
  text) 6.6:1, both clear of the 4.5:1 text threshold; interactive borders
  (buttons, focus rings, confidence bar) use ink at 14.7:1, clear of 3:1.
- **2.1.1 / 2.4.7 Keyboard & focus:** every interactive element is a native
  `<a>`, `<button>`, or `<summary>`/`<details>` — no custom click-only
  widgets, no positive `tabindex`, no `onclick` on non-interactive elements.
  `:focus-visible` outlines are defined and only suppressed once the
  `:focus-visible`-aware fallback is guaranteed to apply.
- **2.4.1 Bypass blocks:** `.skip-link` to `#main` is the first focusable
  element on every page.
- **2.4.2 Page titled:** every real page has a distinct, descriptive
  `<title>`; the one shared generic title is in `news/story-template.html`,
  which is explicitly documented as a template, not a published page (its own
  top-of-file comment says so), and gets a real title filled in per the
  template's own instructions when copied for a new story.
- **3.1.1 Language of page:** `<html lang="en">` on every page.
- **4.1.2 Name, role, value:** `<details>`/`<summary>` (native disclosure
  widget, no extra ARIA needed), the confidence bar (`role="img"` with a
  numeric `aria-label`, plus a full data-table fallback), `aria-current` on
  nav items — all correctly implemented.
- **Motion:** `@media (prefers-reduced-motion: reduce)` collapses all
  animation/transition durations sitewide; no CSS animation exists outside
  that safety net today.
- **Timestamps:** every dateline uses `<time datetime="...">` with a
  machine-readable ISO date, in news cards, story metadata, and timeline
  items.

## Open items

None. Every issue found had a clear, non-speculative fix available in the
existing code (either a straightforward correction or wiring up
already-built, already-tested support code that had lost its entry point).
No fix required inventing content, so nothing is tagged `AWAITING FRAGMENT`.
