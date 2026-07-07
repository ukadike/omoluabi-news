/**
 * Accessible chart components. Per docs/DATA_VISUALIZATION.md: every chart
 * needs a text summary, a data table, and must not use color as the only
 * encoding — this site's visual system is monochrome anyway, so every
 * "chart" here is bar length (or table order), never color, carrying the
 * value.
 */

function esc(str) {
  const div = document.createElement("div");
  div.textContent = str ?? "";
  return div.innerHTML;
}

/** Confidence table + a length-encoded bar per row, ink-on-paper only. */
export function renderEvidenceConfidence(container, evidenceItems) {
  const rows = evidenceItems.map((item) => ({
    title: item.title,
    confidence: item.confidence,
    status: item.review_status,
  }));

  const bars = rows
    .map(
      (row) => `
      <li>
        <span class="text-small">${esc(row.title)} — ${esc(String(row.confidence))} (${esc(
        row.status
      )})</span>
        <span class="confidence-bar" role="img" aria-label="Confidence ${esc(
          String(row.confidence)
        )} of 1">
          <span style="width: ${Math.round((row.confidence || 0) * 100)}%"></span>
        </span>
      </li>`
    )
    .join("");

  container.innerHTML = `
    <h2>Evidence Confidence</h2>
    <p>This chart shows each item's confidence score as a bar length, not a
      color — screen readers get the same number from the
      <code>aria-label</code>, and the table below is the full accessible
      fallback.</p>
    <ul class="confidence-chart">${bars}</ul>
    <table>
      <caption>Evidence confidence (accessible fallback for the chart above)</caption>
      <thead>
        <tr><th scope="col">Title</th><th scope="col">Confidence</th><th scope="col">Status</th></tr>
      </thead>
      <tbody>
        ${rows
          .map(
            (row) =>
              `<tr><td>${esc(row.title)}</td><td>${esc(String(row.confidence))}</td><td>${esc(
                row.status
              )}</td></tr>`
          )
          .join("")}
      </tbody>
    </table>`;
}

/** Table fallback for a GeoJSON FeatureCollection — required alongside any
 *  map per docs/MAPS_AND_DISTORTION.md's accessibility requirements. */
export function renderFeatureTable(container, geojson) {
  const features = (geojson && geojson.features) || [];
  const rows = features.map((f) => {
    const props = f.properties || {};
    const coords = f.geometry && f.geometry.coordinates;
    return {
      title: props.title || "Untitled location",
      summary: props.summary || "",
      coordinates: Array.isArray(coords) ? coords.join(", ") : "—",
    };
  });

  container.innerHTML = `
    <table>
      <caption>Mapped locations (accessible fallback for the map above)</caption>
      <thead>
        <tr><th scope="col">Location</th><th scope="col">Summary</th><th scope="col">Coordinates (lng, lat)</th></tr>
      </thead>
      <tbody>
        ${rows
          .map(
            (row) =>
              `<tr><td>${esc(row.title)}</td><td>${esc(row.summary)}</td><td><code>${esc(
                row.coordinates
              )}</code></td></tr>`
          )
          .join("")}
      </tbody>
    </table>`;
}
