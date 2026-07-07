# Contributing

## Adding a story

1. Add any new sources to `_data/evidence.json` (`sources` array). Each
   needs at minimum `id`, `type` (one of the source-ladder keys in
   `_js/reasoning-engine.js`'s `SOURCE_LADDER`), `title`, `date`, `text`.
2. Add the story to `_data/news.json` (`entries` array): `id`, `slug`,
   `title`, `date`, `author`, `excerpt`, `content` (HTML string),
   `evidenceIds` (array of the ids from step 1), `reasoningLayers` (array
   of layer ids from `_data/reasoning-layers.json` that actually apply —
   don't list a layer you didn't actually reason through), `tags`,
   `status` (`"published"` for real reporting; `"example"` only for
   demonstration content, see `docs/EDITING-GUIDELINES.md`).
3. Copy `news/story-template.html` to `news/<slug>/index.html`. Fill in
   the `<title>`, meta description, JSON-LD block, and set
   `data-news-id` on the `<h1>` to match the id from step 2.
4. Run the local checks in `docs/DEPLOYMENT.md` before pushing.

## Adding a reasoning layer

Layers are meant to be a fixed set of 12 (see `docs/REASONING.md`). If a
story genuinely needs a 13th, that's an editorial-standards conversation,
not a JSON edit — raise it before adding one.

## Code style

- No build tooling. Plain HTML/CSS/vanilla JS, ES modules are fine in new
  files but existing `_js/*.js` files load as plain scripts (no bundler),
  so keep new script tags in that same style unless you're also updating
  every page that loads them.
- Follow the locked visual system in `_css/style.css` — paper/ink/line
  only, no gradients, no shadows, no border-radius.
