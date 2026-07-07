# Research References

Anchor references for implementation decisions, kept in sync with
`sources/references.json`:

- [W3C WCAG 2.2](https://www.w3.org/TR/WCAG22/) — accessibility baseline
- [W3C WAI](https://www.w3.org/WAI/) — accessibility standards and support materials
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/) — component interaction patterns
- [axe-core](https://github.com/dequelabs/axe-core) — automated accessibility testing
- [Leaflet](https://leafletjs.com/) — lightweight interactive maps
- [Schema.org](https://schema.org/) + [JSON-LD](https://json-ld.org/) — machine-readable metadata
- [GeoJSON](https://geojson.org/) — mapped evidence, events, and spatial layers
- [D3 / D3-geo](https://d3js.org/) — visualization and projection experiments

Turf.js was in the original package's reference list for spatial
calculations (buffer, distance, area) but isn't used by anything shipped in
this pass — `src/maps/` doesn't yet do any spatial math beyond what Leaflet
handles natively. Add it when something actually needs it, per
`docs/RESEARCH_ARCHITECTURE.md`'s "what's implemented vs. not."

Keep `sources/references.json` updated with URLs, descriptions, and access
dates as this list changes.
