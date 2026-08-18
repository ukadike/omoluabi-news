# Web Engine — Visual Language Addendum (reconstructed draft)

Status: **DRAFT — reconstructed** from
`../sources/planning-conversation-2026-08.md`. The original addendum file
is `AWAITING FRAGMENT`; its own section numbering (sections 1, 2, 4, 5, 8,
12, 15 are cited in the source) is only partially known. All items below
are as quoted/characterized in the source conversation.

The direction is rules, not moodboards: "The Economist printed on recycled
stock," "a court transcript" — institutional, quiet, flat.

## 1. Tokens

| Token | Value | Note |
|---|---|---|
| paper | `#efece2` | matches locked shared system |
| ink | `#1a1a1a` | matches locked shared system |
| line | `#d0cdc6` | matches locked shared system |
| muted | `#595959` **(OPEN QUESTION)** | shared system says `#6f6f6f` — awaiting Kemi's ruling |

Fonts: **Helvetica Neue** = UI/nav · **Georgia** = headlines/body ·
**Courier Prime** = metadata/IDs. (Matches the shared system's families.)

Forbidden — ever: gradients, shadows, border-radius, animation.

## 2. Type scale (locked)

40px Display → 28px H1 → 20px H2 (uppercase) → 17px H3 → 16px Body.
Breaking the scale fails acceptance.

## Spacing

8px grid only. No arbitrary padding.

## 4. Evidence-state component

`[●] HUMAN OBSERVED` — shape + glyph + text (never color-only meaning).
This component is the UI's brand; every claim, timeline event, and
contradiction uses it.

## 5. Navigation

Public = paper + 1px line. Editorial = same + "EDITORIAL" label.
Active item = underline + bold.

## Buttons

Text only; icon-only buttons forbidden. The ink-filled button is reserved
for "New Investigation"; everything else is plain links or outlined.

## 8. Saving

Debounced save with a plain-text indicator ("Saved 10:32am"). No toasts.

## 12. Homepage

Top Story: full-width, Display-size Georgia. (Wireframes do not exist —
translation gap acknowledged in the source.)

## 15. What "beautiful" means

> "Not: decoration, color, motion, cleverness.
> Is: consistency, restraint, legible hierarchy, and an interface that
> gets out of the way of the reporting."

## Known gaps (named in the source)

No component renders, no page wireframes, no mobile comps. The rules are
complete enough to build from; the first build renders become the visual
reference.
