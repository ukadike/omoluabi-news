# Web Engine — Lean Code Standard (reconstructed draft)

Status: **DRAFT — reconstructed** from
`../sources/planning-conversation-2026-08.md`. The original file is
`AWAITING FRAGMENT`; only its operative principle and applied examples
appear in the source.

## Principle (quoted in the source)

**"Every line must earn its place."** No speculative abstractions.
Native first: before adding a dependency or abstraction, show that the
platform (browser, Postgres, Next.js) and the existing stack cannot do it.

## The dependency test, as applied in the source

Every proposed addition was argued in this form — why is the native
platform insufficient, why is the existing stack insufficient:

| Proposed | Verdict | Reasoning recorded |
|---|---|---|
| `sections`, `pages`, `section_items`, `page_blocks` tables | Keep | no native concept; categories/stories can't express curation, evergreen pages, or block assembly |
| `themes` table | Keep, editing constrained | CSS vars exist, but a DB-driven active theme is needed |
| Drag-and-drop library | **Remove** | HTML buttons (`Move up`/`Move down`) do the job |
| Color-picker library | **Remove** | hex text input + regex |
| Google Fonts / webfonts | **Remove** | new dependency, network, layout shift; system fonts only |
| Live preview iframe | **Remove** | complexity not required by spec |
| `react-markdown` | Keep | already in the preferred stack |
| WCAG contrast check | Keep, hand-rolled | native JS formula, no library |

## Steward note

This standard is the same instinct as the retired prototype's
no-framework build and the ecosystem's no-decoration visual rules: the
default answer to "should we add this?" is no, until it earns its place.
