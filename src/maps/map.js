/**
 * Evidence map, built on Leaflet. Loaded via an import map (see
 * research/index.html) pointing "leaflet" at a CDN ESM build — this repo
 * has no bundler, so the import below resolves at the browser's fetch
 * time, not at a build step.
 *
 * This never runs standalone: every call site must also render the
 * accessible table fallback (see src/visualizations/charts.js's
 * renderFeatureTable) and a distortion note (see distortion.js). A map
 * with no fallback is not accessible, per docs/ACCESSIBILITY.md.
 */
import L from "leaflet";

export function initEvidenceMap(containerId, geojson) {
  const map = L.map(containerId).setView([0, 0], 2);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);

  const layer = L.geoJSON(geojson, {
    onEachFeature: (feature, featureLayer) => {
      const props = feature.properties || {};
      featureLayer.bindPopup(
        `<strong>${props.title || "Evidence location"}</strong><br>${props.summary || ""}`
      );
    },
  }).addTo(map);

  try {
    map.fitBounds(layer.getBounds());
  } catch (error) {
    console.warn("Could not fit bounds", error);
  }

  return map;
}
