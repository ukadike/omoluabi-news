# Web Engine

This directory is the home of the Omoluabi web engine, per Kemi's direction
(2026-07-08) that Omoluabi-News is where the web engine lives.

## Status: new plan designated — specification AWAITING FRAGMENT

On 2026-08-16 Kemi designated a new web engine plan, superseding the
browser-only prototype that previously lived here (now preserved at
`archive/engine-browser-prototype/` — see its `ARCHIVED.md`).

The new plan's specification documents are **not yet physically present in
this repository**. Per the no-fabrication rule, they are indexed here only —
their contents are not described, summarized, or inferred:

- `PRODUCT_SPEC.md` — `AWAITING FRAGMENT`
- `BUILD_ORDER.md` — `AWAITING FRAGMENT`
- Visual-language addendum — `AWAITING FRAGMENT`
- `LEAN_CODE_STANDARD.md` — `AWAITING FRAGMENT`
- `RELEASE_GATE.md` — `AWAITING FRAGMENT`

(Names as referenced in the planning conversation Kemi shared on 2026-08-16.
When the fragments land, this index becomes real files and this notice goes
away.)

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
  Kemi's ruling when the spec fragments land.
- **OPEN QUESTION — relation to local-first research.** The Omoluabi repo's
  `web-engine/local-first-plan.md` recorded sync/storage as open research.
  Whether the new plan closes those questions is not asserted here until the
  fragments are present.
