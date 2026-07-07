# Data Visualization

## Principles

- Every chart answers one clear question.
- Every chart has a text summary and a data table — the table is not an
  afterthought, it's the accessible fallback screen readers and low-
  bandwidth readers actually get.
- Color is never the only encoding. This site's visual system is
  monochrome anyway (paper/ink/line), so every chart here uses length or
  position, never hue, to carry a value.
- Distinguish evidence from inference; show uncertainty and missing data
  rather than smoothing over it.

## What's built

`src/visualizations/charts.js`:

- `renderEvidenceConfidence(container, evidenceItems)` — one bar per
  evidence item, its length set by `confidence` (0–1), with an
  `aria-label` carrying the same number for screen readers, followed by a
  full data table (title, confidence, review status).
- `renderFeatureTable(container, geojson)` — the table fallback for the
  evidence map, see `docs/MAPS_AND_DISTORTION.md`.

Rendered together on `research/index.html` against
`data/sample/evidence_sample.json` — sample data, not real evidence.

## What's listed in the original package but not built here

Bar chart, line chart, scatterplot, contradiction matrix, missing-data
chart, distortion comparison chart, map-linked chart. Each is a reasonable
idea; none was built in this pass because there's no real dataset yet that
needs a contradiction matrix or a scatterplot — see the same reasoning in
`docs/RESEARCH_ARCHITECTURE.md`'s "what's implemented vs. not." The
confidence chart and feature table were built because they're the two that
had real (if sample) data to render immediately.
