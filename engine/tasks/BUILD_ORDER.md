# Web Engine — Build Order (reconstructed draft)

Status: **DRAFT — reconstructed** from
`../sources/planning-conversation-2026-08.md`. The original
`BUILD_ORDER.md` is `AWAITING FRAGMENT` — the source conversation names
12 phases but characterizes only some of them. Do not invent the missing
ones; they stay `AWAITING FRAGMENT` until the original lands.

Working rule after each phase (per the source): run typecheck, lint,
build, and tests before moving on.

## Phases as known

| Phase | Content | Provenance |
|---|---|---|
| 0 | Foundation: Next.js + Supabase auth, migrations (including the sections/pages/page_blocks/section_items/themes SQL in `../docs/PRODUCT_SPEC.md`) | SECOND-HAND + VERBATIM migrations |
| 1 | Investigations workspace | SECOND-HAND |
| 2–3 | `AWAITING FRAGMENT` (source implies claims/evidence/contradictions/timeline/locations fall in 1–3) | — |
| 4 | Intake: RSS/Atom, dedupe, TTL, provenance; never abort a run on one source failure. Flagged in the source as the highest-risk phase | SECOND-HAND |
| 5 | `AWAITING FRAGMENT` (referenced as containing story/CMS work) | — |
| 6 | Public CMS + the editorial UI additions below | SECOND-HAND base + VERBATIM additions |
| 7 | `AWAITING FRAGMENT` | — |
| 8 | Maps (MapLibre, with non-map equivalents) | SECOND-HAND |
| 9, 11 | `AWAITING FRAGMENT` | — |
| 10 | Theme editor (placement proposed in the source, accepted by Kemi) | VERBATIM |
| 12 | Release gate incl. accessibility (see `RELEASE_GATE.md`) | SECOND-HAND |

## Phase 6 additions [VERBATIM]

1. **Sections CRUD** (`/app/sections`): list with ordering, create/edit
   (title, slug, section_type, description), `is_visible_public` toggle.
   Hard rule: only one `front_page` active — activating one deactivates
   the rest. `breaking` takes `expires_at` and auto-hides after it.
2. **Pages CRUD** (`/app/pages`): draft/published list; block editor
   (see below); preview at `/app/pages/[id]/preview`; publish is a human
   action that writes `published_at`.
3. **Page builder** (the block editor): single column, flat ordered list.
   Block types: heading, markdown, image, quote, story_list, divider.
   Reorder with up/down **buttons** (drag-drop libraries rejected — see
   `../docs/LEAN_CODE_STANDARD.md`). Changing a block's type wipes its
   `content_json` (intentional friction). Debounced save with text
   indicator. Preview opens in a new tab, server-rendered.
4. **Features / Special Reports**: not new objects — Sections with the
   type set, plus a "Curated Content" tab managing `section_items`.
5. **Navigation editor** (`/app/settings/navigation`): three lists
   (Public, Editorial, Footer); items link to URL, Page, Section, or
   Story; one-level nesting; keyboard-only operable.

## Phase 10 — Theme editor [VERBATIM]

- List view + edit view at `/app/settings/themes`; hex-only text inputs
  (regex `^#[0-9a-fA-F]{6}$`, no color-picker lib), system-font datalist
  (no webfonts).
- Server actions `updateTheme` / `activateTheme`: admin-gated,
  Zod-validated, WCAG contrast hard gate (≥ 4.5:1 paper/ink and
  paper/muted) blocking both save and activate, default theme immutable
  and undeletable, transactional activation, audit-logged, then
  `revalidatePath('/', 'layout')`. Full code:
  `../docs/reference/theme-server-actions.md`.

> **OPEN QUESTION (steward):** the source's final position — theme editor
> in MVP at Phase 10, page builder in MVP at Phase 6, layout widgets never
> — reflects Kemi's corrections during the conversation ("I need page
> builders", "Sorry also theme editor"). Confirmed as the standing intent;
> phase numbering itself awaits the original file.
