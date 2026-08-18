# Source: Web Engine Planning Conversation (August 2026)

**What this is:** the planning conversation Kemi shared with the steward
session on 2026-08-18, designating the new web engine plan. The conversation
took place on 2026-08-12 between Kemi and another AI assistant, which had
been given two files Kemi uploaded there — an MVP spec
(`file6237706060197109462.md`) and a plan addendum
(`file7817525827771015171.md`). **Those two original files are not in this
repository** and remain `AWAITING FRAGMENT`; this transcript is the primary
source the spec drafts in `../docs/` and `../tasks/` are reconstructed from.

**Provenance caveat:** everything below describing the uploaded files is the
*other assistant's* reading of them, not the files themselves. Where the
transcript quotes proposed additions in full (SQL, block types, theme rules,
server actions), those are treated as first-hand; where it summarizes the
base spec, the drafts mark it as second-hand summary.

---

## Transcript (as pasted by Kemi, 2026-08-18)

> **Kemi:** [uploaded file6237706060197109462.md] My mvp for a news site
>
> **Kemi:** Em check it out no vibes
>
> **Assistant:** Got it — no fluff. Reading your file. What you actually
> have here: This isn't a "news site" MVP. This is Omoluabi — a greenfield
> spec for an investigative CMS + publishing system. Closer to ProPublica
> meets Supabase meets Obsidian than WordPress.
>
> Core of your MVP, per the doc:
> - **Stack:** Next.js App Router + React + TypeScript + Supabase + MapLibre
>   + Tailwind. Lean, modern, sensible. No AI/LLM in core.
> - **Workflow:** WATCHED SOURCES → SCHEDULED COLLECTION → TEMP INTAKE →
>   HUMAN REVIEW → INVESTIGATION → STORY → HUMAN PUBLISH. Machines collect,
>   humans publish.
> - **Investigation Tabs:** Overview, Sources, Claims, Evidence,
>   Contradictions, Timeline, Locations, Notes, Story Draft, Review.
>   ("Notion for investigations.")
> - **Public Routes:** /, /latest, /local, /category/[slug],
>   /investigations, /story/[slug]. Local News + /investigations are
>   first-class.
> - **Non-negotiables:** WCAG 2.2 AA, MapLibre with a non-map equivalent,
>   separate research-media vs public-media, RLS + audit trail.
> - **Build Order:** 12 phases. Phase 0 = foundation. Phase 1 =
>   Investigations. Maps don't hit until Phase 8.
> - Rule cited from the doc: "Every line must earn its place" — no
>   speculative abstractions.
> - Risks flagged: Phase 4 intake (RSS/Atom + dedupe + TTL + provenance +
>   "never abort run on one source failure"); accessibility as a Phase 12
>   release gate that cannot be faked.
>
> **Kemi:** [uploaded file7817525827771015171.md] My plan but i don't see
> any visual language direction. Here's the plan
>
> **Assistant:** You actually do have visual language direction in that
> addendum — rules, not moodboards:
> - **Tokens:** paper `#efece2`, ink `#1a1a1a`, line `#d0cdc6`, muted
>   `#595959`. Fonts: Helvetica Neue = UI/nav, Georgia = headlines/body,
>   Courier Prime = metadata/IDs.
> - **Forbidden:** gradients, shadows, border-radius, animation.
> - **8px spacing grid only.** Type scale locked: 40px Display → 28px H1 →
>   20px H2 uppercase → 17px H3 → 16px Body.
> - **Evidence-state component:** `[●] HUMAN OBSERVED` with
>   shape + glyph + text; used by every claim, timeline event,
>   contradiction.
> - **Nav:** Public = paper + 1px line; Editorial = same + "EDITORIAL"
>   label; active = underline + bold.
> - **Buttons:** text only; icon-only forbidden; ink-filled button only for
>   "New Investigation".
> - Section 15 quoted: beauty "is: consistency, restraint, legible
>   hierarchy, and an interface that gets out of the way of the reporting"
>   — not decoration, color, motion, cleverness.
> - Gaps identified: no component renders, no page wireframes, no mobile
>   comps — direction exists, translation doesn't.
>
> **Kemi:** Add the ability to create sections, pages, front pages, themes,
> features, breaking news, special reports and new pages, a ui as well for
> adding content
>
> **Assistant:** [proposed, quoted in full — see the reconstructed drafts]
> - `sections` table with `section_type` in
>   `standard | front_page | feature | breaking | special_report`; only one
>   active front_page; breaking auto-expires via `expires_at`;
>   special_report gets `/special/[slug]`.
> - `pages` table (evergreen pages, `/[slug]` checked last).
> - `section_items` relation table (curated stories/investigations per
>   section, ordered).
> - `themes` table (`tokens_json`, one active).
> - `navigation` extended with `nav_type [public | editorial | footer]` and
>   one-level `parent_id`.
> - Editorial UI in Phase 6: Sections CRUD, Pages CRUD, curated-content
>   tab, navigation editor; drag-drop libraries rejected (up/down buttons
>   instead, per the lean-code dependency test).
> - New public routes: `/special/[slug]`, `/breaking`, `/[slug]` fallback.
> - Release-gate additions for all of the above.
>
> **Kemi:** Yes but I need page builders, no layout widgets, no theme
> editor in MVP.
>
> **Assistant:** [proposed, quoted in full] Page builder = ordered flat
> list of content blocks, not layout widgets. `page_blocks` table with
> `block_type` in `heading | markdown | image | quote | story_list |
> divider`, `content_json` per type, explicit `display_order`, no nesting,
> no HTML block, no embeds; image blocks require alt text; `story_list`
> pulls only from existing sections/tags. Editor UI: single column, up/down
> buttons, block-type select, preview in new tab, debounced save with text
> indicator. Public render: server component switch over block types.
>
> **Kemi:** Sorry also theme editor
>
> **Assistant:** [proposed, quoted in full] Theme editor constrained so it
> cannot violate the visual rules: editable = the 4 color token values +
> 3 font-role families (system fonts only, from a fixed allowlist) + theme
> name + activation. Never editable: new colors, new roles, sizes,
> border-radius, shadows, animations, webfonts. `themes` table with JSONB
> schema check, unique partial indexes for one active + one default theme,
> seeded immutable "Omoluabi Base" default. Hard WCAG contrast gate
> (paper/ink and paper/muted ≥ 4.5:1) blocking both save and activate.
> CSS-variable render pipeline in the root layout, no client JS.
>
> **Kemi:** Yes
>
> **Assistant:** [provided in full] Zod token schema + native-JS WCAG
> contrast utility, `updateTheme` and `activateTheme` server actions
> (admin-gated, contrast-gated, default-theme-immutable, audit-logged,
> transactional activation), and the themed form markup. Ends: "Ship it."

---

## What the transcript does NOT contain

- The full text of either uploaded file (base spec and addendum) — both
  remain `AWAITING FRAGMENT`.
- The names/contents of build phases 2, 3, 5, 7, 9, 10, 11 (only 0, 1, 4,
  6, 8, 12 are characterized, and 10 only by the assistant's proposal to
  put themes there).
- The full CMS-object field lists, the intake design, RLS policies, the
  media model, and the addendum's section numbering beyond sections 1, 2,
  4, 5, 8, 12, 15 as cited above.

## Known conflict for Kemi's ruling

The addendum's `muted` is quoted as `#595959`; the locked shared Small
Systems Lab token system (`variables.css`, used across Omoluabi, Umada,
Echo, Small Systems Lab, Earth Sensors Lab) defines
`--color-muted: #6f6f6f`. Paper, ink, and the three font families match
the shared system exactly. **OPEN QUESTION** — which muted value governs
the web engine?
