/**
 * Site-wide initialization: news feed rendering and the blind editor
 * mode toggle. Individual story pages load reasoning-engine.js and
 * timeline-engine.js themselves and drive their own rendering.
 */

function renderNewsFeed(entries, container) {
  if (!container) return;
  const base = document.body.dataset.baseurl || "";
  const sorted = [...entries].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );
  container.innerHTML = sorted
    .map(
      (item) => `
    <article class="news-card">
      ${
        item.status === "example"
          ? '<p class="example-notice">Example story — demonstrates the reasoning engine, not a field report.</p>'
          : ""
      }
      <h2><a href="${base}/news/${item.slug}/">${item.title}</a></h2>
      <time datetime="${item.date}">${item.date}</time>
      <p>${item.excerpt}</p>
      <ul class="tag-list" aria-label="Tags">
        ${(item.tags || []).map((tag) => `<li>${tag}</li>`).join("")}
      </ul>
      <a href="${base}/news/${item.slug}/">Read full story</a>
    </article>`
    )
    .join("");
}

function initBlindEditorMode() {
  const toggle = document.querySelector("[data-blind-editor-toggle]");
  if (!toggle) return;
  toggle.addEventListener("click", () => {
    const active = document.body.classList.toggle("blind-editor-mode");
    toggle.setAttribute("aria-pressed", String(active));
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initBlindEditorMode();

  const feedContainer = document.getElementById("news-feed");
  if (feedContainer) {
    const base = document.body.dataset.baseurl || "";
    fetch(`${base}/_data/news.json`)
      .then((r) => r.json())
      .then((data) => renderNewsFeed(data.entries, feedContainer))
      .catch((err) => console.error("Could not load news feed:", err));
  }
});
