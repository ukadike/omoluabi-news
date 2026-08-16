/**
 * AI assist — advisory only, per governance/ai-permissions.md (SSL-005).
 * No model is wired in yet; this is a labeled stub that returns a fixed
 * draft so the review screen and its human-in-the-loop controls can be
 * exercised honestly. It never writes to a record on its own — every
 * suggestion requires an explicit human "Accept" action, which is the
 * only thing that sets ai_assist.human_verified.
 *
 * Do not use for: consent, risk, accessibility sign-off, or publication
 * status decisions (web-engine/p5-ml5-prototype-plan.md, "Do Not Use For").
 */

export function draftSuggestion(observation) {
  const task = observation.ai_assist && observation.ai_assist.task;
  const stubs = {
    "transcript draft":
      "[STUB — no model wired in] Draft transcript would appear here for human correction before use as alt text, caption, or summary.",
    "alt text draft":
      "[STUB — no model wired in] Draft alt text would appear here for human correction.",
  };
  return {
    task: task || "unspecified",
    model: (observation.ai_assist && observation.ai_assist.model) || "none",
    confidence: (observation.ai_assist && observation.ai_assist.confidence) ?? null,
    draftText: stubs[task] || stubs["transcript draft"],
    advisoryOnly: true,
  };
}
