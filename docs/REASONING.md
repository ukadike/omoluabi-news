# Editorial Reasoning

## Why

Omoluabi News is built on sovereignty over observation: the person who
noticed something controls how it's held, when it moves, what form it
takes, and who benefits. The reasoning engine exists to make an editor's
judgment visible and checkable, not to automate it away.

## The 12 layers

Defined in `_data/reasoning-layers.json`, each with a name, a one-line
description, and the questions an editor should be able to answer before
a story runs with that layer attached:

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

Not every story needs all 12. `news.json`'s `reasoningLayers` field lists
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
