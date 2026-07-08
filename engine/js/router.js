import {
  renderInbox,
  renderNewObservation,
  renderObservationDetail,
  renderStageReview,
  renderAiAssist,
  renderHumanReview,
  renderPublication,
  renderArchive,
  renderNewsFeed,
} from "./views.js";

const ROUTES = [
  { pattern: /^#\/$/, handler: (c) => renderInbox(c) },
  { pattern: /^#\/new$/, handler: (c) => renderNewObservation(c) },
  { pattern: /^#\/news$/, handler: (c) => renderNewsFeed(c) },
  { pattern: /^#\/archive$/, handler: (c) => renderArchive(c) },
  {
    pattern: /^#\/observation\/([^/]+)$/,
    handler: (c, m) => renderObservationDetail(c, { id: decodeURIComponent(m[1]) }),
  },
  {
    pattern: /^#\/observation\/([^/]+)\/(source|consent|risk|accessibility)$/,
    handler: (c, m) =>
      renderStageReview(c, { id: decodeURIComponent(m[1]), stageKey: m[2] }),
  },
  {
    pattern: /^#\/observation\/([^/]+)\/ai-assist$/,
    handler: (c, m) => renderAiAssist(c, { id: decodeURIComponent(m[1]) }),
  },
  {
    pattern: /^#\/observation\/([^/]+)\/human-review$/,
    handler: (c, m) => renderHumanReview(c, { id: decodeURIComponent(m[1]) }),
  },
  {
    pattern: /^#\/observation\/([^/]+)\/publication$/,
    handler: (c, m) => renderPublication(c, { id: decodeURIComponent(m[1]) }),
  },
];

export async function route() {
  const container = document.getElementById("app");
  const hash = location.hash || "#/";
  const match = ROUTES.find((r) => r.pattern.test(hash));
  if (!match) {
    container.innerHTML = `<p>Not found: <code>${hash}</code>. <a href="#/">Return to inbox</a>.</p>`;
    return;
  }
  const m = hash.match(match.pattern);
  try {
    await match.handler(container, m);
  } catch (err) {
    console.error(err);
    container.innerHTML = `<p role="alert">Something went wrong loading this screen. See console for details.</p>`;
  }
  // Move focus to main for screen-reader / keyboard users on every
  // navigation, matching the keyboard-workflow.md baseline requirement.
  container.focus();
}

export function initRouter() {
  window.addEventListener("hashchange", route);
  route();
}
