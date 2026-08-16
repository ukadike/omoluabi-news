/**
 * Governance pipeline gate. Encodes architecture/governance-pipeline.md's
 * order — Source, Consent, Risk, Accessibility, AI Assist (optional),
 * Human Review, Publication Status — as a strict unlock sequence.
 * screens.md: "No screen may skip ahead in the pipeline." This module
 * is the one place that rule is enforced; every view checks it before
 * rendering a form.
 */

export const STAGES = [
  {
    key: "source",
    label: "Source",
    path: "source",
    isComplete: (linked) => Boolean(linked.source && linked.source._reviewed_at),
  },
  {
    key: "consent",
    label: "Consent",
    path: "consent",
    isComplete: (linked) => Boolean(linked.consent && linked.consent._reviewed_at),
  },
  {
    key: "risk",
    label: "Risk",
    path: "risk",
    isComplete: (linked) => Boolean(linked.risk && linked.risk._reviewed_at),
  },
  {
    key: "accessibility",
    label: "Accessibility",
    path: "accessibility",
    isComplete: (linked) =>
      Boolean(linked.accessibility && linked.accessibility._reviewed_at),
  },
  {
    key: "ai-assist",
    label: "AI assist",
    path: "ai-assist",
    isComplete: (linked, observation) =>
      !observation.ai_assist ||
      observation.ai_assist.enabled === false ||
      observation.ai_assist.human_verified === true,
  },
  {
    key: "human-review",
    label: "Human review",
    path: "human-review",
    isComplete: (linked) => Boolean(linked.review),
  },
  {
    key: "publication",
    label: "Publication status",
    path: "publication",
    isComplete: (linked) => Boolean(linked.publication),
  },
];

/** Returns STAGES annotated with status: 'complete' | 'current' | 'locked'. */
export function pipelineStatus(observation, linked) {
  let currentAssigned = false;
  return STAGES.map((stage) => {
    const complete = stage.isComplete(linked, observation);
    let status;
    if (complete) {
      status = "complete";
    } else if (!currentAssigned) {
      status = "current";
      currentAssigned = true;
    } else {
      status = "locked";
    }
    return { ...stage, status };
  });
}

/** Can this specific stage be opened for review right now? Complete or
 *  current stages are reachable; locked stages are not. */
export function isStageUnlocked(stageKey, observation, linked) {
  const statuses = pipelineStatus(observation, linked);
  const stage = statuses.find((s) => s.key === stageKey);
  return stage ? stage.status !== "locked" : false;
}
