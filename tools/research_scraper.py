#!/usr/bin/env python3
"""Omoluabi Research Scraper: ethical static-page scraper prototype.

Only fetches sources explicitly registered in sources/source_registry.json
with "html_scrape" in their allowed_methods (see docs/ETHICAL_SCRAPING_POLICY.md).
Every card it produces is tagged review_status="needs_review" — this tool
never marks anything approved or published; that decision is editorial.

Does NOT parse robots.txt automatically. robots_policy on a source registry
entry is a human-recorded note, not an enforced check — verify it yourself
before adding a source's "html_scrape" method.
"""
from __future__ import annotations

import hashlib
import json
import time
from dataclasses import asdict, dataclass
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlparse

import requests
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
RAW_DIR = ROOT / "data" / "raw"
PROCESSED_DIR = ROOT / "data" / "processed"
SOURCE_REGISTRY = ROOT / "sources" / "source_registry.json"
USER_AGENT = "OmoluabiNewsResearchBot/0.1 (+https://ukadike.github.io/omoluabi-news)"


@dataclass
class EvidenceCard:
    id: str
    title: str
    source_url: str
    source_type: str
    publisher: str
    author: str
    published_at: str
    accessed_at: str
    summary: str
    claims: list
    locations: list
    tags: list
    confidence: float
    review_status: str
    notes: str


def load_sources():
    return json.loads(SOURCE_REGISTRY.read_text(encoding="utf-8"))["sources"]


def stable_id(url: str) -> str:
    return hashlib.sha256(url.encode("utf-8")).hexdigest()[:16]


def fetch_html(url: str, rate_limit_seconds: float = 5.0) -> str:
    time.sleep(rate_limit_seconds)
    response = requests.get(url, headers={"User-Agent": USER_AGENT}, timeout=30)
    response.raise_for_status()
    return response.text


def extract_basic(url: str, html: str) -> EvidenceCard:
    soup = BeautifulSoup(html, "html.parser")
    title = soup.title.string.strip() if soup.title and soup.title.string else "Untitled source"
    meta_description = soup.find("meta", attrs={"name": "description"})
    summary = meta_description.get("content", "").strip() if meta_description else ""
    if not summary:
        paragraphs = [p.get_text(" ", strip=True) for p in soup.find_all("p")]
        summary = " ".join(paragraphs[:3])[:1200]
    return EvidenceCard(
        id=stable_id(url),
        title=title,
        source_url=url,
        source_type="reputable_reporting",
        publisher=urlparse(url).netloc,
        author="",
        published_at="",
        accessed_at=datetime.now(timezone.utc).isoformat(),
        summary=summary,
        claims=[],
        locations=[],
        tags=[],
        confidence=0.35,
        review_status="needs_review",
        notes="Auto-extracted. Human editorial review required before use.",
    )


def save_raw(url: str, html: str) -> Path:
    RAW_DIR.mkdir(parents=True, exist_ok=True)
    path = RAW_DIR / f"{stable_id(url)}.html"
    path.write_text(html, encoding="utf-8")
    return path


def save_evidence(card: EvidenceCard) -> Path:
    PROCESSED_DIR.mkdir(parents=True, exist_ok=True)
    path = PROCESSED_DIR / f"{card.id}.evidence.json"
    path.write_text(json.dumps(asdict(card), indent=2, ensure_ascii=False), encoding="utf-8")
    return path


def run():
    for source in load_sources():
        if "html_scrape" not in source.get("allowed_methods", []):
            continue
        url = source["url"]
        html = fetch_html(url, source.get("rate_limit_seconds", 5))
        card = extract_basic(url, html)
        print("Saved", save_raw(url, html), save_evidence(card))


if __name__ == "__main__":
    run()
