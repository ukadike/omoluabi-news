# Ethical Scraping Policy

Omoluabi News only scrapes or ingests data that is publicly accessible,
permitted by a site's terms, or intentionally provided by an approved source
(an RSS feed, an API, a dataset).

## Rules

- Respect `robots.txt`. `tools/research_scraper.py` does **not** parse
  `robots.txt` automatically yet — the `robots_policy` field on a
  `sources/source_registry.json` entry is a human-recorded note, not an
  enforced check. Verify it yourself before adding `"html_scrape"` to a
  source's `allowed_methods`.
- Prefer RSS feeds, official APIs, CSV downloads, and public datasets before
  scraping HTML. `tools/rss_ingester.py` exists so RSS is never the harder
  path.
- Rate-limit. Default is one request every 3–10 seconds per domain
  (`rate_limit_seconds` on a source registry entry; `research_scraper.py`
  sleeps for that long before every fetch).
- Identify the project in the User-Agent string —
  `OmoluabiNewsResearchBot/0.1 (+https://ukadike.github.io/omoluabi-news)`,
  set in `tools/research_scraper.py`.
- Never bypass paywalls, logins, CAPTCHAs, or other technical restrictions.
- Store source URL, access date, and extraction method on every evidence
  card (`source_url`, `accessed_at`, and the tool that produced it, implicit
  in which script wrote the file).
- Keep raw data (`data/raw/`) separate from reviewed/published data
  (`_data/evidence.json`, `_data/news.json`). Both `data/raw/` and
  `data/processed/` are gitignored — see `docs/CONTRIBUTING.md` before
  changing that.
- Flag sensitive content for review — every card starts
  `"review_status": "needs_review"`; nothing in this repo's tooling sets it
  to anything else.
- Never publish private personal data unless it is clearly public-interest,
  lawful, and editorially reviewed.

## Before adding a real source

`sources/source_registry.json` and `sources/rss_feeds.json` currently contain
only placeholder `example.com` entries. Before replacing either with a real
source: confirm its terms of service allow the intended method, confirm a
human has reviewed its `robots.txt` if `html_scrape` is one of the allowed
methods, and set a rate limit appropriate to that specific site.
