# Web Engine — Product Spec (reconstructed draft)

Status: **DRAFT — reconstructed** from
`../sources/planning-conversation-2026-08.md`. The original uploaded spec
file is `AWAITING FRAGMENT`; when it lands, it replaces the second-hand
parts of this draft.

Provenance markers used throughout:
- **[VERBATIM]** — quoted in full in the source conversation.
- **[SECOND-HAND]** — the other assistant's summary of the uploaded file;
  treat as probable, not locked.

## What this is [SECOND-HAND]

Omoluabi: an investigative CMS + publishing system — not a blog CMS.
"Closer to ProPublica meets Supabase meets Obsidian than WordPress."

## Stack [SECOND-HAND]

Next.js App Router + React + TypeScript + Supabase + MapLibre + Tailwind.
No AI/LLM in the core product.

> **OPEN QUESTION (steward):** this supersedes the retired browser
> prototype's local-first/no-backend posture. The Omoluabi repo's
> `web-engine/local-first-plan.md` questions (sync, encryption-at-rest,
> production storage) are presumably answered by Supabase — presumed, not
> confirmed, until the original spec lands.

## Editorial workflow [SECOND-HAND, consistent with locked governance]

WATCHED SOURCES → SCHEDULED COLLECTION → TEMP INTAKE → HUMAN REVIEW →
INVESTIGATION → STORY → HUMAN PUBLISH.

Machines collect; humans publish. This matches the Omoluabi governance
pipeline (which remains binding regardless of stack): the engine never
decides publication status on its own, and AI assist — if ever added — is
advisory only per `governance/ai-permissions.md` in the Omoluabi repo.

## Investigation workspace [SECOND-HAND]

Per-investigation tabs: Overview, Sources, Claims, Evidence,
Contradictions, Timeline, Locations, Notes, Story Draft, Review.

## Public routes

[SECOND-HAND — base] `/`, `/latest`, `/local`, `/category/[slug]`,
`/investigations`, `/story/[slug]`, `/about`. Local News and
`/investigations` are first-class.

[VERBATIM — additions] `/special/[slug]` (special_report sections),
`/breaking` (active breaking section, if any), `/[slug]` (Pages, checked
last, 404 if no match). `/` is rendered by the active
`section_type = front_page` section; if none exists, fall back to the
Latest list.

## Non-negotiables [SECOND-HAND, consistent with locked governance]

- WCAG 2.2 AA (accessibility is infrastructure, not a feature).
- Every MapLibre map has a non-map equivalent.
- Research media and public media are separate stores.
- Row-level security + audit trail on editorial actions.

## CMS objects

[SECOND-HAND — base] Stories, Investigations, Pages, Categories, Tags,
Authors, Media, Locations, Navigation, Site Settings, Themes.
Field lists `AWAITING FRAGMENT`.

[VERBATIM — additions, from Kemi's 2026-08-12 requests] Sections (with
front pages, features, breaking news, special reports), section_items,
page_blocks (the page builder), themes (with a constrained editor), and
navigation extensions:

```sql
create table sections (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text,
  section_type text not null check (section_type in
    ('standard','front_page','feature','breaking','special_report')),
  display_order int not null default 0,
  is_visible_public boolean default false,
  expires_at timestamptz,
  created_by uuid references profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table pages (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  template text default 'basic' check (template in ('basic','statement','about')),
  status text default 'draft' check (status in ('draft','published')),
  published_at timestamptz,
  updated_by uuid references profiles(id),
  updated_at timestamptz default now()
);

create table page_blocks (
  id uuid primary key default gen_random_uuid(),
  page_id uuid references pages(id) on delete cascade,
  block_type text not null check (block_type in (
    'heading',    -- H2/H3 only. H1 is page.title
    'markdown',   -- body copy, lists, links
    'image',      -- single image + caption/alt/description (alt required)
    'quote',      -- blockquote + attribution
    'story_list', -- auto list: latest from section_id or tag_id
    'divider'     -- 1px line rule
  )),
  content_json jsonb not null,
  display_order int not null default 0,
  created_at timestamptz default now()
);

create table section_items (
  section_id uuid references sections(id) on delete cascade,
  item_type text check (item_type in ('story','investigation')),
  item_id uuid not null,
  display_order int not null default 0,
  added_at timestamptz default now(),
  primary key (section_id, item_type, item_id)
);

create table themes (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  tokens_json jsonb not null,
  is_active boolean default false,
  is_default boolean default false,
  created_by uuid references profiles(id),
  updated_at timestamptz default now(),
  constraint tokens_schema check (
    jsonb_typeof(tokens_json) = 'object' and
    tokens_json ? 'colors' and tokens_json ? 'fonts' and
    jsonb_typeof(tokens_json->'colors') = 'object' and
    jsonb_typeof(tokens_json->'fonts') = 'object' and
    (tokens_json->'colors') ? 'paper' and (tokens_json->'colors') ? 'ink' and
    (tokens_json->'colors') ? 'line' and (tokens_json->'colors') ? 'muted' and
    (tokens_json->'fonts') ? 'ui' and (tokens_json->'fonts') ? 'headline' and
    (tokens_json->'fonts') ? 'meta'
  )
);
create unique index one_active_theme on themes (is_active) where is_active = true;
create unique index one_default_theme on themes (is_default) where is_default = true;

alter table navigation add column nav_type text default 'public'
  check (nav_type in ('public','editorial','footer'));
alter table navigation add column parent_id uuid references navigation(id);
```

Section rules [VERBATIM]: only one `front_page` can be active (activating
one deactivates the others); `breaking` renders with urgency treatment and
auto-hides after `expires_at`; `special_report` bundles stories +
investigations at `/special/[slug]`; `feature` is a magazine-style
`/category/[slug]` takeover; `standard` is the default bucket.

Page-builder rules [VERBATIM]: ordered flat list of blocks — no columns,
no positioning, no nesting, no HTML block, no embeds, no spacers. `image`
blocks must reference the media table and require alt text (WCAG gate).
`story_list` pulls only from existing sections/tags and respects RLS
(published stories only).

Theme rules [VERBATIM]: editable = the 4 color token *values*, 3 font-role
families (system-font allowlist only), name, activation. Never editable:
new colors, new roles, sizes/scale, border-radius, shadows, animations,
webfonts. Default "Omoluabi Base" theme is seeded, immutable, undeletable.
Contrast gate: paper/ink and paper/muted must be ≥ 4.5:1 to save or
activate. Render via CSS variables set in the root layout server-side —
no client JS, no network font requests.

Theme seed [VERBATIM as quoted — see OPEN QUESTION on `muted`]:

```json
{
  "colors": {"paper":"#efece2","ink":"#1a1a1a","line":"#d0cdc6","muted":"#595959"},
  "fonts": {"ui":"Helvetica Neue","headline":"Georgia","meta":"Courier Prime"}
}
```

> **OPEN QUESTION — muted token.** The conversation quotes `#595959`; the
> locked shared Small Systems Lab token system uses `#6f6f6f`
> (`--color-muted` in `variables.css`, shared across the ecosystem). Do not
> seed the default theme until Kemi rules. Everything else in the seed
> matches the shared system exactly.

## Server actions [VERBATIM]

The theme server actions (Zod token schema, native WCAG contrast check,
`updateTheme`, `activateTheme` — admin-gated, contrast-gated,
default-immutable, audit-logged, transactional activation) were provided
in full; preserved at `reference/theme-server-actions.md`.
