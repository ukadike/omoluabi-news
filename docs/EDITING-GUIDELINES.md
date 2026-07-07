# Editing Guidelines

## No fabrication

Do not publish a story, quote, source, or evidence record describing a
real-world event, person, or claim that didn't actually happen or wasn't
actually said. If something is unconfirmed, say so in the story rather
than filling the gap.

## Example vs. published content

`_data/news.json`'s `status` field distinguishes:

- `"published"` — real reporting. Every source in its `evidenceIds` must
  be a real, checkable source.
- `"example"` — demonstration content, for showing how the reasoning
  engine and page templates work. Must say so visibly on the page (see
  the `.example-notice` block on `news/how-this-newsroom-holds-evidence/`)
  and must still only cite real, checkable sources — an example story is
  not license to invent facts, just license to be about something small
  and self-referential (like this repository's own build) instead of a
  real external event.

Never ship an `"example"` story that could be mistaken for a real report
about real people or events.

## Voice

Direct, evidence-first. State what's confirmed, what's disputed, and what's
still open — don't collapse uncertainty into a confident-sounding sentence
because it reads better.

## Sourcing

Every factual claim in a story's `content` should trace to something in
its `evidenceIds`. If a claim has no evidence entry, either add one or cut
the claim.
