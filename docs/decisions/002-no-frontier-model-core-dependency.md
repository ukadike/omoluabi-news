# Decision

Omoluabi News's core operation has no dependency on Claude, GPT, Gemini,
or any other hosted/frontier AI model or API key.

## Context

Omoluabi is being built while most software is moving toward frontier
models as a primary intelligence layer. This project deliberately does
the opposite for its core system: editorial judgment stays with a human,
and where the system can reason at all, it reasons deterministically —
see `docs/REASONING.md`'s 18-layer model, source ladder, and contradiction
detector.

## Decision

- `_js/reasoning-engine.js` and `_js/timeline-engine.js` are plain
  deterministic JavaScript: array sort, filter, and a fixed lookup table
  (`SOURCE_LADDER`). No network call, no model inference, no API key.
- `package.json`'s only runtime dependency is `ajv` (JSON Schema
  validation). `requirements.txt` is `beautifulsoup4`, `requests`,
  `feedparser` — an HTML parser, an HTTP client, and an RSS parser, used
  by the research-ingestion tools (`tools/research_scraper.py`,
  `tools/rss_ingester.py`) to fetch and structure publicly available
  pages and feeds a human explicitly registered. None of them call a
  model.
- `tools/test-editorial-invariants.js`'s `testNoFrontierAiDependency`
  deny-lists known AI vendor SDK package names (`openai`,
  `@anthropic-ai`, `anthropic`, Google/Cohere/LangChain equivalents)
  against both manifests and runs in CI, so this isn't just a point-in-
  time claim — it's a regression test. See `.github/workflows/test.yml`.
- The site requires zero environment variables to run (`.env.example`).
  There is nothing to configure a model provider with, because nothing
  calls one.

## Alternatives Considered

- **Using an LLM to draft reasoning-layer summaries or evidence
  extraction.** Rejected for core operation: it would make the editorial
  reasoning opaque and vendor-dependent, contradicting the "inspectable,
  explainable, portable" requirement this system is built around.
- **A future, explicitly-authorized experimental AI-assisted function
  inside the Omoluabi Sandbox** (directive §7) remains possible in
  principle — e.g., a research-tool suggestion pass — but nothing like
  that exists in this codebase today, and building one is out of scope
  for MVP v1.

## Consequences

- Some things a model could plausibly speed up (entity extraction,
  summarization) stay manual or use simple heuristics
  (`tools/entity_keyword_extractor.py` is a keyword-frequency extractor,
  not an NLP model) — slower, but inspectable and dependency-free.
- Claude Code (or any other AI coding assistant) may still be used to
  *develop* this repository, per the directive's distinction: "AI can
  help us build Omoluabi. Omoluabi does not need AI to be Omoluabi." That
  distinction is what this ADR formalizes for this specific codebase.

## Status

Accepted — MVP v1.
