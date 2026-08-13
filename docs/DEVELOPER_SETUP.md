# Developer Setup

Every command below was run against this repository as part of preparing
MVP v1 and verified to work. None are generic/unverified boilerplate.

## Supported runtimes

- **Node.js 20** (matches `.github/workflows/test.yml`'s
  `actions/setup-node` version). Used for `ajv` (schema validation),
  `html-validate`, and `stylelint` — all via `npx`, no global install
  required.
- **Python 3.12** (matches CI's `actions/setup-python` version). Used by
  the research-ingestion tools only (`tools/*.py`). The site itself needs
  no Python beyond the built-in `http.server` module for local preview.

No database, no build tool, no bundler, no authentication provider, and
no file-storage service are required — this is a static site with a
client-side data layer (`_data/*.json`, `fetch()` at page-load time).

## Installation

```bash
git clone https://github.com/ukadike/omoluabi-news.git
cd omoluabi-news
npm install                    # installs ajv (package.json's only runtime dependency)
pip install -r requirements.txt   # only needed for tools/*.py (research ingestion)
```

## Environment configuration

None required. See `.env.example` — MVP v1 has no environment variables
because it has no server, no database, and no API keys of any kind
(including no AI-provider keys; see
`docs/decisions/002-no-frontier-model-core-dependency.md`).

## Database setup

Not applicable. There is no database. Content lives in
`_data/news.json` and `_data/evidence.json`, committed directly to the
repository. See `docs/ARCHITECTURE.md`.

## Running locally

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000/index.html`. Opening the file directly
from disk (`file://…`) will not work — pages fetch `_data/*.json` at
runtime, which browsers block for `file://` origins.

There is no separate production build command; the deployed site is the
repository's files as-is (`.github/workflows/deploy.yml` uploads the repo
root via `actions/upload-pages-artifact`, with no build step — see
`docs/ARCHITECTURE.md`'s "Deviations" section for why there's no Jekyll
build despite `_config.yml` existing).

## Test / validation commands

Run these before pushing — they're exactly what CI runs
(`.github/workflows/test.yml`):

```bash
# HTML semantics/landmarks/validity
npx --yes html-validate 'index.html' 'news/index.html' 'news/**/index.html' 'research/index.html'

# CSS lint against the locked visual system
npm install --no-save stylelint stylelint-config-standard
npx stylelint --config .stylelintrc.json '_css/**/*.css'

# JSON well-formedness
for f in _data/*.json data/sample/*.json data/sample/*.geojson sources/*.json; do
  python3 -m json.tool "$f" > /dev/null
done

# JSON Schema validation (schemas compile + _data/news.json and
# _data/evidence.json validate against their schemas)
npm install --no-save ajv
node tools/validate-schemas.js

# Editorial-governance invariants (sandbox boundary, feed filter,
# evidence integrity, no frontier-AI dependency)
node tools/test-editorial-invariants.js

# Python tools compile check
python3 -m py_compile tools/research_scraper.py tools/rss_ingester.py tools/entity_keyword_extractor.py
```

All of the above were run against this repository during the MVP v1 pass
and pass cleanly. See `docs/KNOWN_LIMITATIONS.md` for what these checks
do *not* cover (no automated accessibility scan, no manual screen-reader
pass).

## Lint / typecheck

There is no separate lint or typecheck command beyond `html-validate` and
`stylelint` above — plain JavaScript, no TypeScript, no ESLint config in
this repository yet.

## File storage

None required. The only binary/media assets would live under a static
directory served as-is (no media ships yet — see `docs/USER_GUIDE.md`,
"Adding media").

## Authentication setup

None exists. See `docs/decisions/001-human-governed-editorial-authority.md`
for why publication is git-mediated rather than app-authenticated in MVP
v1.

## Known platform assumptions

- Deployment target is GitHub Pages via GitHub Actions (`Settings → Pages
  → Source: GitHub Actions`) — see `docs/DEPLOYMENT.md` for the one-time,
  manual repository setting this requires.
- `tools/research_scraper.py` identifies itself with a fixed User-Agent
  string pointing at this repository's GitHub Pages URL — update it if
  you fork this project under a different URL (see
  `docs/ETHICAL_SCRAPING_POLICY.md`).

## Using the research-ingestion tools

Optional — the site runs fully without ever using these. See
`docs/RESEARCH_ARCHITECTURE.md` and `docs/ETHICAL_SCRAPING_POLICY.md`
before pointing either at a real source (the shipped registry entries are
`example.com` placeholders):

```bash
python3 tools/research_scraper.py
python3 tools/rss_ingester.py
python3 tools/entity_keyword_extractor.py
```

## Deployment notes

See `docs/DEPLOYMENT.md` for the full one-time GitHub Pages setup and the
pre-merge checklist.
