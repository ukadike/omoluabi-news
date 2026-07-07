/**
 * Map distortion notes. projectionNote() and distortionWarning() are pure
 * string lookups with no dependency on d3-geo, deliberately — this module
 * has no top-level import, so it always loads even if the d3-geo CDN
 * import used elsewhere is unreachable. getProjections() is reference
 * material for a future projection-comparison mode
 * (docs/MAPS_AND_DISTORTION.md, "Required map modes" #7) — the live map in
 * research/index.html still renders with Leaflet's default Web Mercator
 * tiles, so switching projection isn't wired up yet, and nothing here
 * calls getProjections() outside of that future work.
 */

export async function getProjections() {
  const d3 = await import("d3-geo");
  return {
    mercator: d3.geoMercator(),
    equalEarth: d3.geoEqualEarth(),
    naturalEarth: d3.geoNaturalEarth1(),
    orthographic: d3.geoOrthographic(),
  };
}

export function projectionNote(name) {
  const notes = {
    mercator: "Mercator preserves local angles but exaggerates area toward the poles.",
    equalEarth: "Equal Earth preserves area better for global comparisons but changes shapes.",
    naturalEarth: "Natural Earth is a compromise projection for world maps.",
    orthographic: "Orthographic resembles a globe view but hides the far side of Earth.",
  };
  return notes[name] || "Projection distortion should be reviewed.";
}

export function distortionWarning(layerConfig) {
  return {
    layerId: layerConfig.id,
    title: layerConfig.title,
    projection: layerConfig.projection || "unknown",
    warning: projectionNote(layerConfig.projection),
    accessibilitySummary:
      layerConfig.accessibility_summary || "Map data should also be reviewed in table form.",
  };
}
