# User Guide — Omoluabi News (MVP v1)

This guide explains how to use Omoluabi News as a reader or as an editor.
It does not assume you know Git, JavaScript, or the command line — where
using the software currently does require one of those things, that's
said plainly rather than glossed over, because MVP v1 doesn't have a
graphical editing interface yet (see "Not yet implemented" notes below
and `docs/KNOWN_LIMITATIONS.md`).

## Getting into Omoluabi News

The live site is a public website — visit
`https://ukadike.github.io/omoluabi-news/` (or wherever it's deployed).
There is no login. Reading the site requires nothing beyond a web
browser.

**Not yet implemented in MVP v1:** there is no account system and no
authentication. Everything on the live site is visible to anyone; there
is no reader-only vs. editor-only view. Editing happens in the
repository, described below, not on the website itself.

## Understanding the interface

The site has three areas, in the top navigation on every page:

- **Home** — an introduction to Omoluabi News and its most recent
  stories.
- **News** — the full archive of published stories.
- **Research** — an evidence map and confidence chart over sample
  research data (not yet real research data — see
  `docs/RESEARCH_ARCHITECTURE.md`).

Every story page has three sections beneath the story text: **Editorial
Reasoning** (which of the 18 reasoning layers apply, and what question
each one answers for this story), **Sources & Evidence** (every source
cited, ranked by reliability), and **Timeline** (the story's events in
chronological order, with any ordering inconsistency flagged).

A footer link labeled for blind/low-vision readers toggles **blind
editor mode**, which hides decorative images and framing so only text and
structure remain.

## Creating content

**Not yet implemented in MVP v1 as a graphical workflow.** There is no
"New Story" button. Creating a story today means an editor with
repository access:

1. Copies `news/story-template.html` to a new folder under `news/`.
2. Adds a matching entry to `_data/news.json`.
3. Commits and opens a pull request (or pushes directly, if authorized).

Full mechanical steps are in `docs/CONTRIBUTING.md` and
`docs/DEVELOPER_SETUP.md`. This is a real, working process — just a
git-based one rather than a web form.

## Adding sources

Every source a story cites is a separate entry in `_data/evidence.json`,
with a reliability level (firsthand account, direct testimony,
secondhand account, written record, or hearsay — see
`docs/REASONING.md`'s source ladder), and can be marked as contradicting
another source. A story links to its sources by listing their IDs in its
`evidenceIds` field. The reasoning engine reads this at page-load time
and ranks/scores automatically — no separate step is needed once the
link exists.

## Adding media

**Not yet implemented in MVP v1.** No story ships with images, audio, or
video yet — the one demo story is text-only. `docs/ACCESSIBILITY.md`
requires alt text on any image and a caption/transcript on any audio or
video before either is added; there's no media-handling code to describe
here until that happens.

## Maps and data

The Research page (`research/`) reads sample evidence and a sample map
layer (`data/sample/`), rendered as an accessible map with a plain-text
distortion note above it and a full data table below it, plus a
length-encoded confidence chart with its own data table. See
`docs/MAPS_AND_DISTORTION.md` and `docs/DATA_VISUALIZATION.md`. This is
sample data only — registering and ingesting a real dataset is a
separate, not-yet-done step described in `docs/RESEARCH_ARCHITECTURE.md`.

## Editorial states

A story's `status` field is one of:

- **`draft`** — being written. Never appears on the live site, even if
  committed to the repository.
- **`sandbox`** — held for reasoning-engine testing or exploration. Never
  appears on the live site.
- **`published`** — real reporting, cleared to appear on the live site.
- **`example`** — demonstration content. Appears on the live site with a
  visible "example story" notice, and must only cite real, checkable
  sources even though it isn't a field report (see
  `docs/EDITING-GUIDELINES.md`).
- **`retracted`** — was published, no longer stands. Currently removed
  from the feed, same as a draft; a visible correction notice instead of
  simple removal is not yet built (see `docs/KNOWN_LIMITATIONS.md`).

Only `published` and `example` stories ever render on the site — this is
enforced in code (`_js/main.js`), not just editorial practice; see
`docs/decisions/003-sandbox-publication-boundary.md`.

## Uncertainty and contradiction

Nothing in Omoluabi News requires an editor to force a conclusion. A
source can be marked `"contradicts": ["other-source-id"]` in
`_data/evidence.json`, and the reasoning engine surfaces that as a
flagged contradiction on the story page rather than silently picking a
side. The story's prose itself is where an editor states what's
confirmed, disputed, or still open — see `docs/EDITING-GUIDELINES.md`'s
"Voice" section: "don't collapse uncertainty into a confident-sounding
sentence because it reads better."

## Sandbox

The "sandbox" is where exploratory or unreviewed material lives before a
human decides it's ready:

- Research-tool output (`tools/research_scraper.py`, `tools/rss_ingester.py`)
  lands in `data/raw/` and `data/processed/`, tagged `"review_status":
  "needs_review"`. Both directories are excluded from the repository by
  `.gitignore` — nothing there can reach the live site automatically.
- A story or evidence entry marked `draft` or `sandbox` in the repository
  itself stays out of the rendered feed even though it's visible in git
  history to anyone with repository access.

Sandbox content is never treated as fact, never treated as a decision,
and never publishes itself. A human has to deliberately move it — by
editing `_data/evidence.json` or `_data/news.json` by hand and changing
its status — before it's live.

## Human review

Today, "review" means a pull request: a second person (or the same
editor, for a low-stakes fix) reads the diff to `_data/news.json` /
`_data/evidence.json` / the new page under `news/`, checks sourcing
against `docs/EDITING-GUIDELINES.md`, and approves the merge. There is no
separate in-app review queue or approval button — the mechanism is git's
own.

## Publishing

1. Confirm every claim in the story traces to an entry in `evidenceIds`.
2. Set `"status": "published"` (or `"example"` for demonstration
   content — see `docs/EDITING-GUIDELINES.md` for what that requires).
3. Merge the pull request (or push, if authorized) to `main`.
4. GitHub Actions (`.github/workflows/deploy.yml`) redeploys the site
   automatically. No manual deploy step.

## Correcting or updating published material

Edit the story's `content` (or its evidence entries) in a new commit and
merge it, same as any other change. Because every change to
`_data/news.json` is a git commit, the prior version, who made the
change, and when, remain inspectable with `git log -p
_data/news.json` indefinitely — this is the provenance record for MVP
v1 (see `docs/decisions/001-human-governed-editorial-authority.md`).
There is no in-app "edit history" view yet; the git history is it.

## Accessibility

- Every page has a skip-to-content link, landmark regions, and a logical
  heading order.
- Keyboard focus is always visible (`:focus-visible` outlines).
- `prefers-reduced-motion` and `prefers-contrast: more` are both
  respected.
- Status (like the example-story notice) is conveyed with text and
  borders, not color alone.
- Blind editor mode (footer link) strips decorative images/framing.

See `docs/ACCESSIBILITY.md` for the full implemented list and its "Known
gaps" section (no automated axe-core/Lighthouse check yet, no manual
screen-reader pass yet).

## Export / backup

**Not yet implemented in MVP v1.** There is no in-app export or backup
feature. The entire site — content, evidence, code — is a git repository;
cloning it (`git clone https://github.com/ukadike/omoluabi-news.git`) is
a complete backup, and every past state is recoverable through git
history. See `docs/DEVELOPER_SETUP.md`.

## Troubleshooting

- **The site looks unstyled / broken locally.** Serve it with `python3 -m
  http.server 8000` and open `http://localhost:8000/index.html` —
  opening `index.html` directly from the filesystem (`file://`) breaks
  the `fetch('/_data/...')` calls the pages depend on. See
  `docs/DEVELOPER_SETUP.md`.
- **A story doesn't appear in the feed.** Check its `status` — only
  `published` and `example` render (see "Editorial states" above).
- **The Research page's map or chart looks empty.** It reads
  `data/sample/*` only; there's no real dataset registered yet (see
  "Maps and data" above).
- **I don't have repository access and want to suggest a change.** See
  `docs/CONTRIBUTING.md`. External contribution is planned but this
  project is still in pre-public testing — see this repository's
  `README.md`, "Contributing" section.
