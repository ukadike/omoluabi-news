#!/usr/bin/env python3
"""RSS ingestion prototype for Omoluabi News. Use RSS before scraping HTML
whenever a feed is available (docs/ETHICAL_SCRAPING_POLICY.md). Every item
is tagged review_status="needs_review" — nothing here auto-publishes.
"""
import hashlib
import json
from datetime import datetime, timezone
from pathlib import Path

import feedparser

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "data" / "processed"
SOURCES = ROOT / "sources" / "rss_feeds.json"


def stable_id(value: str) -> str:
    return hashlib.sha256(value.encode("utf-8")).hexdigest()[:16]


def run():
    feeds = json.loads(SOURCES.read_text(encoding="utf-8"))["feeds"]
    OUT.mkdir(parents=True, exist_ok=True)
    for feed in feeds:
        parsed = feedparser.parse(feed["url"])
        for entry in parsed.entries[: feed.get("limit", 20)]:
            url = entry.get("link", "")
            item = {
                "id": stable_id(url or entry.get("title", "")),
                "title": entry.get("title", "Untitled"),
                "source_url": url,
                "source_type": feed.get("source_type", "reputable_reporting"),
                "publisher": feed.get("name", ""),
                "author": entry.get("author", ""),
                "published_at": entry.get("published", ""),
                "accessed_at": datetime.now(timezone.utc).isoformat(),
                "summary": entry.get("summary", ""),
                "claims": [],
                "locations": [],
                "tags": feed.get("tags", []),
                "confidence": 0.45,
                "review_status": "needs_review",
                "notes": "RSS ingested. Human review required before use.",
            }
            (OUT / f"{item['id']}.evidence.json").write_text(
                json.dumps(item, indent=2, ensure_ascii=False), encoding="utf-8"
            )
            print("Wrote", item["title"])


if __name__ == "__main__":
    run()
