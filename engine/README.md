# Web Engine

This directory is the home of the Omoluabi web engine, per Kemi's direction
(2026-07-08) that Omoluabi-News is where the web engine lives.

## Status: plan reconstructed from Kemi's planning conversation — originals still AWAITING FRAGMENT

Kemi designated a new web engine plan, superseding the browser-only
prototype that previously lived here (now preserved at
`archive/engine-browser-prototype/` — see its `ARCHIVED.md`). On 2026-08-18
Kemi shared the planning conversation behind that plan, and the spec
documents below were reconstructed from it, with per-section provenance
markers (**[VERBATIM]** = quoted in full in the conversation,
**[SECOND-HAND]** = the other assistant's summary of a file not present
here).

- `sources/planning-conversation-2026-08.md` — the primary source: Kemi's
  2026-08-12 planning conversation, preserved with its provenance caveats
- `docs/PRODUCT_SPEC.md` — identity, stack, workflow, routes, CMS objects
  (including the sections / pages / page-builder / themes SQL)
- `docs/VISUAL_ADDENDUM.md` — tokens, type scale, forbidden list,
  evidence-state component, "what beautiful means"
- `docs/LEAN_CODE_STANDARD.md` — "every line must earn its place" + the
  dependency test as applied
- `docs/reference/theme-server-actions.md` — theme editor implementation
  code, preserved verbatim
- `tasks/BUILD_ORDER.md` — the 12 phases as known (several phases still
  unknown), plus the Phase 6 and Phase 10 additions
- `tasks/RELEASE_GATE.md` — quoted checklists; base gate still unknown

The two original files Kemi uploaded to that conversation (the base MVP
spec and the plan addendum) are **not** physically present in any
repository and remain indexed as:

- Base MVP spec (`file6237706060197109462.md`) — `AWAITING FRAGMENT`
- Plan addendum (`file7817525827771015171.md`) — `AWAITING FRAGMENT`

When they land, they replace the [SECOND-HAND] portions of the drafts.
No app code exists yet; Build Order Phase 0 has not started.

## What carries over regardless of stack

These are existing governance, not properties of the retired prototype:

- The engine never bypasses the governance pipeline: Observation → Consent →
  Source → Risk → Accessibility → Human Review → Publication Status →
  Archive. Machines collect; humans publish.
- AI assists; it does not decide publication status
  (Omoluabi repo, `governance/ai-permissions.md`).
- Accessibility is infrastructure, not a feature (WCAG 2.2 AA target).
- The shared Small Systems Lab visual-token system is locked and is not
  redesigned from this repo.

## Open questions

- **OPEN QUESTION — muted token value.** The planning conversation quotes a
  muted color of `#595959`; the locked shared token system
  (`variables.css`) defines `--color-muted: #6f6f6f`. Which governs? Needs
  Kemi's ruling before the default theme is seeded.
- **OPEN QUESTION — relation to local-first research.** The Omoluabi repo's
  `web-engine/local-first-plan.md` recorded sync/storage as open research.
  The new stack (Supabase) presumably answers those questions — presumed,
  not confirmed, until the original spec fragments are present.
- **OPEN QUESTION — unknown build phases.** Phases 2, 3, 5, 7, 9, and 11
  are not characterized in the source conversation.
