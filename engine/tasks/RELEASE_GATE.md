# Web Engine — Release Gate (reconstructed draft)

Status: **DRAFT — reconstructed** from
`../sources/planning-conversation-2026-08.md`. The original file is
`AWAITING FRAGMENT`; the base gate is only characterized as including a
real (unfakeable) WCAG 2.2 AA pass — keyboard-only operation, captions,
map alternatives, 200% zoom. The checklists below were quoted in full.

## CMS Editorial [VERBATIM]

- [ ] Editor can create a Section with `type=front_page` and it renders at `/`
- [ ] Editor can create a Section with `type=breaking` + `expires_at`, and it disappears after expiry
- [ ] Editor can create Page `/about` and it renders at `/about`
- [ ] Editor can add a Story to a `special_report` Section and it appears at `/special/[slug]`
- [ ] Only one `front_page` can be active — enforced by DB constraint or app check
- [ ] All new UI uses the type scale + 8px grid + no icon-only buttons
- [ ] Navigation editor works for public + footer, keyboard only

## Page builder [VERBATIM]

- [ ] `/about` built with 3+ blocks renders correctly
- [ ] Blocks keyboard-navigable in the editor, 44px targets
- [ ] No `block_type` outside the allowlist can be saved
- [ ] `story_list` block respects RLS — shows only published stories

## Themes [VERBATIM]

- [ ] Default theme cannot be deleted or edited
- [ ] Activating a theme with `paper=#fff ink=#fff` is blocked by the contrast check
- [ ] Changing theme updates public + editorial in one request, no mismatch
- [ ] No network request for fonts — all system fonts
- [ ] Theme editor keyboard-only, 44px targets, labels visible

## Base gate

`AWAITING FRAGMENT` beyond the accessibility characterization above.
Steward addition pending Kemi's confirmation: the governance invariants
(human-only publish, machines-collect-only, audit trail on editorial
actions) belong in this gate as testable checks.
