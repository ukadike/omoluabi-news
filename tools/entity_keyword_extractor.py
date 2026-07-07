#!/usr/bin/env python3
"""Lightweight keyword extractor. Surfaces candidate keywords for a human
reviewer to confirm or discard — it does not tag entities as fact, and it
does not change review_status.
"""
import json
import re
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data" / "processed"
STOPWORDS = set(
    "the a an and or but if then of in on for to with from by as at is are "
    "was were be been being this that these those it its into about".split()
)


def tokenize(text: str):
    return [t.lower() for t in re.findall(r"[A-Za-z][A-Za-z\-']{2,}", text) if t.lower() not in STOPWORDS]


def run():
    for path in DATA.glob("*.evidence.json"):
        item = json.loads(path.read_text(encoding="utf-8"))
        text = " ".join([item.get("title", ""), item.get("summary", ""), " ".join(item.get("claims", []))])
        item["candidate_keywords"] = [k for k, _ in Counter(tokenize(text)).most_common(20)]
        path.write_text(json.dumps(item, indent=2, ensure_ascii=False), encoding="utf-8")
        print("Updated", path.name)


if __name__ == "__main__":
    run()
