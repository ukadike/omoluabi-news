# Editorial Reasoning

## Why

Omoluabi News is built on sovereignty over observation: the person who
noticed something controls how it's held, when it moves, what form it
takes, and who benefits. The reasoning engine exists to make an editor's
judgment visible and checkable, not to automate it away.

## The 18 layers

Defined in `_data/reasoning-layers.json`, each with a name, a one-line
description, and the questions an editor should be able to answer before
a story runs with that layer attached. Layers 1–12 are the original MVP
set; 13–18 were added from the research-tools expansion package without
renaming or renumbering the first 12 (some of that package's layers —
Evidence Integrity, Contradiction Layer, Map-Data Layer — cover the same
ground as layers 2, 4, and 11 under different names, so only the genuinely
new ones were appended):

1. Observation — what was noticed, by whom, when
2. Evidence — what sources corroborate or contradict
3. Source Ladder — rank reliability, firsthand account to hearsay
4. Contradiction Detection — identify and document inconsistencies
5. Narrative Probability — which narrative fits the evidence best
6. Historical Erasure Detection — what histories are omitted
7. Timeline Integrity — do accounts align chronologically
8. Returnability Index — can the observer revise the account later
9. Risk Assessment — what are the stakes, for whom
10. Local Testimony — who has lived experience here
11. Map Intelligence — what geography reveals
12. Temporal Justice — whose timeline matters, whose is erased
13. Dangerous Words — does the language put anyone at risk if published as written
14. Ceasefire Distortion — is de-escalation reported with equal scrutiny on all sides
15. Survival Systems — what survival infrastructure does the story touch, and its state
16. Education Continuity — is anyone's access to education disrupted, and for how long
17. Legal / Ethical Caution — legal or ethical constraints on publishing this
18. Unrecoverable Loss Register — losses that can't be undone, named rather than abstracted

Not every story needs all 18. `news.json`'s `reasoningLayers` field lists
only the layers actually used, and only those render on the story page.

## How it's computed

`_js/reasoning-engine.js`'s `ReasoningEngine` class takes a story and its
linked evidence (`evidenceIds` → `_data/evidence.json`) and:

- ranks evidence by a source ladder (`firsthand-account` down to
  `hearsay`, see the `SOURCE_LADDER` map in that file)
- surfaces any evidence explicitly marked as `contradicts` another source
- reports a `confidence` score: evidence strength minus a penalty per
  unresolved contradiction

None of this decides whether a story runs — it's a display of the
editor's own reasoning, not a gatekeeper. Corrections and disputes should
be handled editorially, not by tuning the score.

## Timeline integrity

`_js/timeline-engine.js`'s `TimelineEngine` sorts a story's dated events
(currently: the dates on its own evidence sources) and flags any
out-of-order pair. It renders the ordered list into `#timeline-container`
on the story page.
