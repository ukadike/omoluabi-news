/**
 * Editorial reasoning engine.
 * Evaluates evidence for a single story against the 12 reasoning layers
 * defined in /_data/reasoning-layers.json. Pure data-in/data-out — this
 * file renders nothing itself; callers (news pages, main.js) decide how
 * to display the result.
 */

const SOURCE_LADDER = {
  "firsthand-account": 5,
  "direct-testimony": 4,
  "secondhand-account": 3,
  "written-record": 2,
  hearsay: 1,
};

class ReasoningEngine {
  constructor(story, evidenceList = []) {
    this.story = story;
    this.evidence = evidenceList.filter((ev) =>
      (story.evidenceIds || []).includes(ev.id)
    );
  }

  evaluateEvidence(source) {
    return SOURCE_LADDER[source.type] || 0;
  }

  rankedEvidence() {
    return [...this.evidence].sort(
      (a, b) => this.evaluateEvidence(b) - this.evaluateEvidence(a)
    );
  }

  detectContradictions() {
    const contradictions = [];
    const byId = new Map(this.evidence.map((ev) => [ev.id, ev]));
    for (const ev of this.evidence) {
      for (const otherId of ev.contradicts || []) {
        const other = byId.get(otherId);
        if (!other) continue;
        const pair = [ev.id, otherId].sort();
        if (contradictions.some((c) => c.between.join() === pair.join())) {
          continue;
        }
        contradictions.push({
          between: pair,
          nature: "flagged-contradiction",
          detail: `${ev.title} is marked as contradicting ${other.title}.`,
        });
      }
    }
    return contradictions;
  }

  checkReturnability() {
    return {
      canRevise: this.story.allowsRevision !== false,
      revisedAt: this.story.lastRevision || null,
      consentRequired: true,
    };
  }

  detectErasures() {
    return {
      missingVoices: this.story.expectedVoices || [],
      erasedHistories: this.story.erasedContexts || [],
      whoseTimelineMatters: this.story.primaryTimeline || null,
    };
  }

  calculateConfidence() {
    const strength = this.evidence.reduce(
      (sum, ev) => sum + this.evaluateEvidence(ev),
      0
    );
    const baseScore = Math.min(strength * 10, 90);
    const penalty = this.detectContradictions().length * 5;
    return Math.max(baseScore - penalty, 0);
  }

  reason() {
    return {
      observation: this.story.excerpt || null,
      evidenceStrength: this.evidence.reduce(
        (sum, ev) => sum + this.evaluateEvidence(ev),
        0
      ),
      rankedEvidence: this.rankedEvidence(),
      contradictions: this.detectContradictions(),
      erasures: this.detectErasures(),
      returnability: this.checkReturnability(),
      confidence: this.calculateConfidence(),
    };
  }
}

if (typeof window !== "undefined") {
  window.ReasoningEngine = ReasoningEngine;
}
