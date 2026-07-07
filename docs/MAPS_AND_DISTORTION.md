# Maps and Map Distortion

## Why map distortion matters

Maps are not neutral. Projection, scale, boundary choices, missing data, and
symbol sizing can distort what a reader perceives. Omoluabi should expose
distortion rather than hide it — every map layer gets a distortion note
(`src/maps/distortion.js`'s `distortionWarning()`), rendered as plain text
next to the map, not buried in a tooltip.

## What's built

`research/index.html` renders one map (`src/maps/map.js`'s
`initEvidenceMap`, Leaflet + OpenStreetMap tiles + GeoJSON points) against
`data/sample/map_layer_sample.geojson`, always paired with:

- a distortion note above the map (current projection + what it distorts)
- an accessible table below the map (`src/visualizations/charts.js`'s
  `renderFeatureTable`) listing every feature's title, summary, and
  coordinates — the required fallback per `docs/ACCESSIBILITY.md`

## Required map modes (from the original package) — status

The original spec listed ten map modes: standard, evidence, timeline,
uncertainty, distortion, missing-data, projection comparison, local
testimony overlay, infrastructure/survival-systems overlay, historical
erasure overlay. This pass builds one: a standard evidence map with a
distortion note and table fallback. The other nine are real, useful ideas
that need real data behind them (a timeline map needs dated locations; an
uncertainty map needs a defined uncertainty model) — building empty layer
toggles for modes with nothing to show would be scaffolding without
substance. Add each mode when a story actually needs it.

## Distortion types this module can explain

`distortion.js`'s `projectionNote()` currently covers four projections
(Mercator, Equal Earth, Natural Earth, Orthographic) with a one-line note
on what each distorts. The map itself still renders with Leaflet's default
Web Mercator tiles — switching the live map's projection is not wired up;
`projections` in `distortion.js` is reference material for that future work
(d3-geo projection objects), not yet connected to anything a user can
toggle.

## Accessibility requirements

Every map on this site must have: a text summary, a distortion note, a
table fallback, and coordinates a reader can check without the interactive
map loading at all. `research/index.html`'s map does not (yet) have
keyboard-operable layer controls, because it has only one layer — add that
requirement back in the moment a second layer exists to toggle between.
