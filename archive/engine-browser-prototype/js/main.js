import { getAll, put } from "./store.js";
import {
  SEED_OBSERVATION,
  SEED_CONSENT,
  SEED_SOURCE,
  SEED_RISK,
  SEED_ACCESSIBILITY,
} from "./seed-data.js";
import { initRouter } from "./router.js";

async function seedIfEmpty() {
  const existing = await getAll("observations");
  if (existing.length > 0) return;
  await Promise.all([
    put("observations", SEED_OBSERVATION),
    put("consent", SEED_CONSENT),
    put("sources", SEED_SOURCE),
    put("risks", SEED_RISK),
    put("accessibility", SEED_ACCESSIBILITY),
  ]);
}

function initBlindEditorMode() {
  const toggle = document.querySelector("[data-blind-editor-toggle]");
  if (!toggle) return;
  toggle.addEventListener("click", (event) => {
    event.preventDefault();
    const active = document.body.classList.toggle("blind-editor-mode");
    toggle.setAttribute("aria-pressed", String(active));
  });
}

async function init() {
  initBlindEditorMode();
  await seedIfEmpty();
  initRouter();
}

init();
