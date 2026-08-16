import { get, getAll, put, getLinkedRecords } from "./store.js";
import { pipelineStatus, isStageUnlocked } from "./gate.js";
import { draftSuggestion } from "./ai-assist.js";

function esc(str) {
  const div = document.createElement("div");
  div.textContent = str ?? "";
  return div.innerHTML;
}

function nowIso() {
  return new Date().toISOString();
}

function renderStepper(observation, linked, activeKey) {
  const statuses = pipelineStatus(observation, linked);
  const items = statuses
    .map((s) => {
      const href = `#/observation/${observation.observation_id}/${s.path}`;
      const isActive = s.key === activeKey;
      if (s.status === "locked") {
        return `<li><span class="locked" aria-current="${isActive}">${esc(
          s.label
        )} <span class="step-status" data-state="locked">Locked</span></span></li>`;
      }
      return `<li><a href="${href}" aria-current="${isActive ? "page" : "false"}">${esc(
        s.label
      )} <span class="step-status" data-state="${s.status}">${
        s.status === "complete" ? "Done" : "Review"
      }</span></a></li>`;
    })
    .join("");
  return `<ol class="stepper" aria-label="Governance pipeline progress">${items}</ol>`;
}

function lockedNotice(stageLabel) {
  return `
    <div class="review-card">
      <h2>${esc(stageLabel)}</h2>
      <p class="inline-note" role="status">
        This stage is locked. Earlier stages in the governance pipeline have
        not been reviewed yet — see architecture/governance-pipeline.md.
        No screen may skip ahead.
      </p>
    </div>`;
}

/* ==========================================================================
   Inbox
   ========================================================================== */

export async function renderInbox(container) {
  const observations = await getAll("observations");
  if (observations.length === 0) {
    container.innerHTML = `
      <h2>Inbox</h2>
      <p>No observations yet. Observations arrive from the field device,
      a web form, or import — see architecture/data-lifecycle.md.</p>
      <p><a class="btn" href="#/new">+ New observation</a></p>`;
    return;
  }

  const rows = await Promise.all(
    observations.map(async (obs) => {
      const linked = await getLinkedRecords(obs);
      const statuses = pipelineStatus(obs, linked);
      const current = statuses.find((s) => s.status === "current");
      const doneCount = statuses.filter((s) => s.status === "complete").length;
      return `
        <li class="review-card inbox-item">
          <div>
            <h2 style="margin-top:0;"><a href="#/observation/${esc(
              obs.observation_id
            )}">${esc(obs.title || obs.observation_id)}</a></h2>
            <p class="text-small" style="margin:0;">${esc(
              obs.observation_id
            )} &middot; System: ${esc(
              obs.system
            )} &middot; Created ${esc(obs.created_at)}</p>
          </div>
          <div>
            <p class="text-small" style="margin:0;">${doneCount} / ${
        statuses.length
      } stages reviewed</p>
            <p style="margin:0;">${
              current
                ? `Next: <strong>${esc(current.label)}</strong>`
                : "All stages reviewed"
            }</p>
          </div>
        </li>`;
    })
  );

  container.innerHTML = `
    <h2>Inbox — new and in-review observations</h2>
    <p>Each observation must pass Source, Consent, Risk, and Accessibility
      review, then Human Review, before a Publication Status decision can
      be recorded.</p>
    <p><a class="btn" href="#/new">+ New observation</a></p>
    <ul class="inbox-grid" style="list-style:none; padding:0;">${rows.join(
      ""
    )}</ul>`;
}

/* ==========================================================================
   New observation (manual, no field device — origin_type: "web-form")
   ========================================================================== */

function generateId(prefix) {
  const rand =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);
  return `${prefix}-${rand}`;
}

export async function renderNewObservation(container) {
  container.innerHTML = `
    <p><a href="#/">&larr; Back to inbox</a></p>
    <h2>New observation</h2>
    <p class="inline-note">
      Creates an observation with <code>source.origin_type: "web-form"</code>
      instead of a field device (SSL-002, Provenance Required — the source
      is still recorded, just not device-collected). It still enters the
      same governance pipeline as any other observation: nothing here skips
      Source, Consent, Risk, Accessibility, or Human Review.
    </p>
    <form class="review-form" data-role="new-observation">
      <h3>Content</h3>
      <div class="form-row">
        <label for="no-title">Headline</label>
        <input type="text" id="no-title" name="title" required />
        <p class="help-text">Every story needs a headline. Stored as <code>title</code> on the observation.</p>
      </div>
      <div class="form-row">
        <label for="no-observer">Your name or id</label>
        <input type="text" id="no-observer" name="observer_id" required />
      </div>
      <div class="form-row">
        <label for="no-transcript">Text content</label>
        <textarea id="no-transcript" name="transcript" required></textarea>
        <p class="help-text">The observation's written content. Stored as <code>media.transcript</code>.</p>
      </div>
      <div class="form-row">
        <label for="no-image">Image URL or path (optional)</label>
        <input type="text" id="no-image" name="image" />
      </div>
      <div class="form-row">
        <label for="no-audio">Audio URL or path (optional)</label>
        <input type="text" id="no-audio" name="audio" />
      </div>
      <div class="form-row">
        <label for="no-precision">Location</label>
        <select id="no-precision" name="location_precision">
          <option value="withheld" selected>Withheld</option>
          <option value="exact">Exact</option>
          <option value="approximate">Approximate</option>
          <option value="unknown">Unknown</option>
        </select>
      </div>

      <h3>Consent (SSL-003)</h3>
      <div class="form-row">
        <label for="no-consent-state">Consent state</label>
        <select id="no-consent-state" name="consent_state">
          <option value="private" selected>Private</option>
          <option value="consented">Consented</option>
          <option value="review-public">Review-public</option>
        </select>
      </div>
      <div class="form-row">
        <label for="no-consent-ack">
          <input type="checkbox" id="no-consent-ack" name="subject_acknowledged" style="width:auto; display:inline-block;" />
          Subject acknowledged
        </label>
      </div>

      <h3>Risk (SSL-008)</h3>
      <div class="form-row">
        <label for="no-risk-level">Risk level</label>
        <select id="no-risk-level" name="risk_level">
          <option value="low" selected>Low</option>
          <option value="moderate">Moderate</option>
          <option value="high">High</option>
          <option value="severe">Severe</option>
        </select>
      </div>
      <div class="form-row">
        <label for="no-risk-factors">Risk factors (comma-separated, optional)</label>
        <input type="text" id="no-risk-factors" name="risk_factors" />
      </div>

      <h3>Accessibility (SSL-004)</h3>
      <div class="form-row">
        <label for="no-alt-text">Alt text</label>
        <input type="text" id="no-alt-text" name="alt_text" required />
        <p class="help-text">Required before this observation can be reviewed as accessible.</p>
      </div>
      <div class="form-row">
        <label for="no-plain-summary">Plain-language summary (optional)</label>
        <textarea id="no-plain-summary" name="plain_language_summary"></textarea>
      </div>

      <button type="submit" class="btn">Create observation</button>
    </form>`;

  const form = container.querySelector('form[data-role="new-observation"]');
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const f = form.elements;
    const observerId = f.observer_id.value.trim();
    const title = f.title.value.trim();
    if (!title || !observerId || !f.transcript.value.trim() || !f.alt_text.value.trim()) return;

    const now = nowIso();
    const observationId = generateId("om-obs");
    const consentId = generateId("consent");
    const sourceId = generateId("source");
    const riskId = generateId("risk");
    const accessibilityId = generateId("access");

    const media = { transcript: f.transcript.value.trim() };
    if (f.image.value.trim()) media.image = f.image.value.trim();
    if (f.audio.value.trim()) media.audio = f.audio.value.trim();

    const observation = {
      observation_id: observationId,
      title,
      created_at: now,
      system: "omoluabi",
      observer_id: observerId,
      location: { precision: f.location_precision.value },
      media,
      consent_id: consentId,
      source_id: sourceId,
      risk_id: riskId,
      accessibility_id: accessibilityId,
      publication_status: "private",
    };
    const consent = {
      consent_id: consentId,
      observation_id: observationId,
      state: f.consent_state.value,
      consent_version: 1,
      subject_acknowledged: f.subject_acknowledged.checked,
      recorded_by: observerId,
      recorded_at: now,
    };
    const source = {
      source_id: sourceId,
      observation_id: observationId,
      origin_type: "web-form",
      collector_id: observerId,
      recorded_at: now,
    };
    const risk = {
      risk_id: riskId,
      observation_id: observationId,
      risk_level: f.risk_level.value,
      risk_factors: f.risk_factors.value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      assessed_by: observerId,
      assessed_at: now,
    };
    const accessibility = {
      accessibility_id: accessibilityId,
      observation_id: observationId,
      alt_text: f.alt_text.value.trim(),
      plain_language_summary: f.plain_language_summary.value.trim() || undefined,
      captions_available: false,
      recorded_at: now,
    };

    await Promise.all([
      put("observations", observation),
      put("consent", consent),
      put("sources", source),
      put("risks", risk),
      put("accessibility", accessibility),
    ]);

    location.hash = `#/observation/${observationId}`;
  });
}

/* ==========================================================================
   Observation detail
   ========================================================================== */

export async function renderObservationDetail(container, { id }) {
  const observation = await get("observations", id);
  if (!observation) {
    container.innerHTML = `<p>No observation found with id "${esc(id)}".</p>`;
    return;
  }
  const linked = await getLinkedRecords(observation);

  container.innerHTML = `
    <p><a href="#/">&larr; Back to inbox</a></p>
    <h2>Observation ${esc(observation.observation_id)}</h2>
    <dl class="field-list">
      <dt>Headline</dt><dd>${esc(observation.title || "— (pre-headline record)")}</dd>
      <dt>System</dt><dd>${esc(observation.system)}</dd>
      <dt>Created</dt><dd>${esc(observation.created_at)}</dd>
      <dt>Observer</dt><dd>${esc(observation.observer_id || "—")}</dd>
      <dt>Device</dt><dd>${esc(observation.device_id || "—")}</dd>
      <dt>Location precision</dt><dd>${esc(
        (observation.location && observation.location.precision) || "—"
      )}</dd>
      <dt>Media</dt><dd>${
        observation.media
          ? Object.entries(observation.media)
              .map(([k, v]) => `${esc(k)}: <code>${esc(v)}</code>`)
              .join("<br>")
          : "—"
      }</dd>
      <dt>Publication status (recorded on observation)</dt>
      <dd>${esc(observation.publication_status)}</dd>
    </dl>
    ${renderStepper(observation, linked, null)}
    <p class="help-text">Open the current or completed stage above to review it.
      Locked stages become reachable once every earlier stage is reviewed.</p>`;
}

/* ==========================================================================
   Generic reviewable-field screen (source, consent, risk, accessibility)
   ========================================================================== */

const STAGE_CONFIG = {
  source: {
    label: "Source",
    storeName: "sources",
    linkedKey: "source",
    fields: [
      ["origin_type", "Origin type"],
      ["collector_id", "Collector"],
      ["device_id", "Device"],
      ["recorded_at", "Recorded at"],
    ],
    ruleNote: "SSL-002, Provenance Required — governance/rule-library.md.",
  },
  consent: {
    label: "Consent",
    storeName: "consent",
    linkedKey: "consent",
    fields: [
      ["state", "State"],
      ["consent_version", "Consent version"],
      ["subject_acknowledged", "Subject acknowledged"],
      ["recorded_by", "Recorded by"],
      ["recorded_at", "Recorded at"],
    ],
    ruleNote: "SSL-003, Consent State Required — governance/consent-model.md.",
  },
  risk: {
    label: "Risk",
    storeName: "risks",
    linkedKey: "risk",
    fields: [
      ["risk_level", "Risk level"],
      ["risk_factors", "Risk factors"],
      ["mitigations", "Mitigations"],
      ["assessed_by", "Assessed by"],
      ["assessed_at", "Assessed at"],
    ],
    ruleNote: "SSL-008, Risk Before Reach — governance/rule-library.md.",
  },
  accessibility: {
    label: "Accessibility",
    storeName: "accessibility",
    linkedKey: "accessibility",
    fields: [
      ["alt_text", "Alt text"],
      ["transcript", "Transcript"],
      ["captions_available", "Captions available"],
      ["plain_language_summary", "Plain-language summary"],
      ["screen_reader_label", "Screen reader label"],
    ],
    ruleNote: "SSL-004, Accessibility Required — governance/rule-library.md.",
  },
};

function formatValue(v) {
  if (v === undefined || v === null || v === "") return "—";
  if (Array.isArray(v)) return v.length ? esc(v.join(", ")) : "—";
  if (typeof v === "boolean") return v ? "Yes" : "No";
  return esc(String(v));
}

export async function renderStageReview(container, { id, stageKey }) {
  const observation = await get("observations", id);
  if (!observation) {
    container.innerHTML = `<p>No observation found with id "${esc(id)}".</p>`;
    return;
  }
  const linked = await getLinkedRecords(observation);
  const config = STAGE_CONFIG[stageKey];

  if (!isStageUnlocked(stageKey, observation, linked)) {
    container.innerHTML =
      `<p><a href="#/observation/${esc(id)}">&larr; Back to observation</a></p>` +
      renderStepper(observation, linked, stageKey) +
      lockedNotice(config.label);
    return;
  }

  const record = linked[config.linkedKey];
  const reviewed = Boolean(record && record._reviewed_at);

  const fieldRows = config.fields
    .map(([key, label]) => `<dt>${esc(label)}</dt><dd>${formatValue(record?.[key])}</dd>`)
    .join("");

  container.innerHTML = `
    <p><a href="#/observation/${esc(id)}">&larr; Back to observation</a></p>
    ${renderStepper(observation, linked, stageKey)}
    <section class="review-card">
      <h2>${esc(config.label)} review</h2>
      <p class="inline-note">${esc(config.ruleNote)}</p>
      ${
        record
          ? `<dl class="field-list">${fieldRows}</dl>`
          : `<p>No ${esc(config.label.toLowerCase())} record is linked to this observation.</p>`
      }
      ${
        reviewed
          ? `<p class="inline-note" role="status">Reviewed by ${esc(
              record._reviewed_by
            )} at ${esc(record._reviewed_at)}.</p>`
          : record
          ? `<form class="review-form" data-role="mark-reviewed">
              <div class="form-row">
                <label for="reviewer-id">Reviewer name or id</label>
                <input type="text" id="reviewer-id" name="reviewer" required />
                <p class="help-text">Required so this confirmation carries provenance, per Constitutional Principle 2.</p>
              </div>
              <button type="submit" class="btn">Confirm ${esc(
                config.label.toLowerCase()
              )} reviewed</button>
            </form>`
          : ""
      }
    </section>`;

  const form = container.querySelector('form[data-role="mark-reviewed"]');
  if (form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const reviewer = form.elements.reviewer.value.trim();
      if (!reviewer) return;
      record._reviewed_by = reviewer;
      record._reviewed_at = nowIso();
      await put(config.storeName, record);
      location.hash = `#/observation/${id}`;
    });
  }
}

/* ==========================================================================
   AI assist
   ========================================================================== */

export async function renderAiAssist(container, { id }) {
  const observation = await get("observations", id);
  if (!observation) {
    container.innerHTML = `<p>No observation found with id "${esc(id)}".</p>`;
    return;
  }
  const linked = await getLinkedRecords(observation);

  if (!isStageUnlocked("ai-assist", observation, linked)) {
    container.innerHTML =
      `<p><a href="#/observation/${esc(id)}">&larr; Back to observation</a></p>` +
      renderStepper(observation, linked, "ai-assist") +
      lockedNotice("AI assist");
    return;
  }

  const assist = observation.ai_assist;
  if (!assist || assist.enabled === false) {
    container.innerHTML =
      `<p><a href="#/observation/${esc(id)}">&larr; Back to observation</a></p>` +
      renderStepper(observation, linked, "ai-assist") +
      `<div class="review-card"><h2>AI assist</h2><p>AI assist is not enabled for this observation. Nothing to review — you can continue to Human Review.</p></div>`;
    return;
  }

  if (assist.human_verified) {
    container.innerHTML =
      `<p><a href="#/observation/${esc(id)}">&larr; Back to observation</a></p>` +
      renderStepper(observation, linked, "ai-assist") +
      `<div class="review-card"><h2>AI assist</h2><p class="inline-note" role="status">A human has already verified this suggestion.</p></div>`;
    return;
  }

  const suggestion = draftSuggestion(observation);

  container.innerHTML = `
    <p><a href="#/observation/${esc(id)}">&larr; Back to observation</a></p>
    ${renderStepper(observation, linked, "ai-assist")}
    <section class="review-card">
      <h2>AI assist review</h2>
      <p class="inline-note">
        Advisory only, per governance/ai-permissions.md (SSL-005). AI may
        suggest; it may not publish, decide risk, or decide status.
      </p>
      <p>Task: <strong>${esc(suggestion.task)}</strong> &middot; Model: <code>${esc(
    suggestion.model
  )}</code> &middot; Confidence: ${
    suggestion.confidence === null ? "—" : esc(String(suggestion.confidence))
  }</p>
      <div class="ai-suggestion">
        <p class="text-small">Suggested draft</p>
        <p>${esc(suggestion.draftText)}</p>
      </div>
      <form class="review-form" data-role="ai-decision">
        <div class="form-row">
          <label for="ai-reviewer">Your name or id</label>
          <input type="text" id="ai-reviewer" name="reviewer" required />
        </div>
        <div class="button-row">
          <button type="submit" class="btn" data-decision="accept">Accept — mark human-verified</button>
          <button type="submit" class="btn" data-decision="reject">Reject — discard suggestion</button>
        </div>
      </form>
    </section>`;

  const form = container.querySelector('form[data-role="ai-decision"]');
  form.querySelectorAll("button[data-decision]").forEach((btn) => {
    btn.addEventListener("click", async (event) => {
      event.preventDefault();
      const reviewer = form.elements.reviewer.value.trim();
      if (!reviewer) return;
      const decision = btn.dataset.decision;
      observation.ai_assist.human_verified = decision === "accept";
      observation.ai_assist._reviewed_by = reviewer;
      observation.ai_assist._reviewed_at = nowIso();
      observation.ai_assist._decision = decision;
      await put("observations", observation);
      location.hash = `#/observation/${id}`;
    });
  });
}

/* ==========================================================================
   Human review
   ========================================================================== */

export async function renderHumanReview(container, { id }) {
  const observation = await get("observations", id);
  if (!observation) {
    container.innerHTML = `<p>No observation found with id "${esc(id)}".</p>`;
    return;
  }
  const linked = await getLinkedRecords(observation);

  if (!isStageUnlocked("human-review", observation, linked)) {
    container.innerHTML =
      `<p><a href="#/observation/${esc(id)}">&larr; Back to observation</a></p>` +
      renderStepper(observation, linked, "human-review") +
      lockedNotice("Human review");
    return;
  }

  if (linked.review) {
    container.innerHTML =
      `<p><a href="#/observation/${esc(id)}">&larr; Back to observation</a></p>` +
      renderStepper(observation, linked, "human-review") +
      `<div class="review-card"><h2>Human review</h2>
        <p class="inline-note" role="status">Signed off by ${esc(
          linked.review.reviewed_by
        )} at ${esc(linked.review.reviewed_at)}.</p>
        ${
          linked.review.notes
            ? `<p><strong>Notes:</strong> ${esc(linked.review.notes)}</p>`
            : ""
        }
      </div>`;
    return;
  }

  container.innerHTML = `
    <p><a href="#/observation/${esc(id)}">&larr; Back to observation</a></p>
    ${renderStepper(observation, linked, "human-review")}
    <section class="review-card">
      <h2>Human review sign-off</h2>
      <p class="inline-note">
        SSL-006, Human Publication — governance/rule-library.md. This
        confirms a human has reviewed source, consent, risk, accessibility,
        and any AI assist output for this observation. This log entry is a
        prototype extension of this app, not yet a schema in /schemas/.
      </p>
      <form class="review-form" data-role="human-review">
        <div class="form-row">
          <label for="hr-reviewer">Reviewer name or id</label>
          <input type="text" id="hr-reviewer" name="reviewer" required />
        </div>
        <div class="form-row">
          <label for="hr-notes">Notes (optional)</label>
          <textarea id="hr-notes" name="notes"></textarea>
        </div>
        <div class="form-row">
          <label for="hr-confirm" style="display:flex; gap: var(--space-sm); align-items: baseline; font-weight:400;">
            <input type="checkbox" id="hr-confirm" name="confirm" required style="width:auto;" />
            I confirm I have reviewed source, consent, risk, and accessibility
            for this observation.
          </label>
        </div>
        <button type="submit" class="btn">Record human review</button>
      </form>
    </section>`;

  const form = container.querySelector('form[data-role="human-review"]');
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const reviewer = form.elements.reviewer.value.trim();
    if (!reviewer || !form.elements.confirm.checked) return;
    await put("reviews", {
      review_id: `review-${observation.observation_id}`,
      observation_id: observation.observation_id,
      reviewed_by: reviewer,
      reviewed_at: nowIso(),
      notes: form.elements.notes.value.trim(),
    });
    location.hash = `#/observation/${id}`;
  });
}

/* ==========================================================================
   Publication status
   ========================================================================== */

const PUBLICATION_STATES = [
  "private",
  "internal_review",
  "public",
  "embargoed",
  "withdrawn",
];

export async function renderPublication(container, { id }) {
  const observation = await get("observations", id);
  if (!observation) {
    container.innerHTML = `<p>No observation found with id "${esc(id)}".</p>`;
    return;
  }
  const linked = await getLinkedRecords(observation);

  if (!isStageUnlocked("publication", observation, linked)) {
    container.innerHTML =
      `<p><a href="#/observation/${esc(id)}">&larr; Back to observation</a></p>` +
      renderStepper(observation, linked, "publication") +
      lockedNotice("Publication status");
    return;
  }

  if (linked.publication) {
    container.innerHTML =
      `<p><a href="#/observation/${esc(id)}">&larr; Back to observation</a></p>` +
      renderStepper(observation, linked, "publication") +
      `<div class="review-card"><h2>Publication status</h2>
        <p class="inline-note" role="status">
          Decided: <strong>${esc(linked.publication.status)}</strong> by
          ${esc(linked.publication.decided_by)} at ${esc(
        linked.publication.decided_at
      )}.
        </p>
        <p>See governance/publication-status.md. This decision, not the
          observation's own <code>publication_status</code> field, is the
          canonical record per ADR-0004.</p>
      </div>`;
    return;
  }

  container.innerHTML = `
    <p><a href="#/observation/${esc(id)}">&larr; Back to observation</a></p>
    ${renderStepper(observation, linked, "publication")}
    <section class="review-card">
      <h2>Publication status decision</h2>
      <p class="inline-note">
        governance/publication-status.md. Consent constrains which status
        values are reachable but does not set this field — a human editor
        does (ADR-0004).
      </p>
      <form class="review-form" data-role="publication">
        <div class="form-row">
          <label for="pub-status">Status</label>
          <select id="pub-status" name="status">
            ${PUBLICATION_STATES.map(
              (s) => `<option value="${esc(s)}">${esc(s)}</option>`
            ).join("")}
          </select>
        </div>
        <div class="form-row">
          <label for="pub-decider">Decided by</label>
          <input type="text" id="pub-decider" name="decider" required />
        </div>
        <div class="form-row">
          <label for="pub-reason">Withdrawal reason (only if withdrawing)</label>
          <input type="text" id="pub-reason" name="reason" />
        </div>
        <button type="submit" class="btn">Record decision</button>
      </form>
    </section>`;

  const form = container.querySelector('form[data-role="publication"]');
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const decider = form.elements.decider.value.trim();
    if (!decider) return;
    const status = form.elements.status.value;
    const decidedAt = nowIso();
    await put("publications", {
      publication_id: `pub-${observation.observation_id}`,
      observation_id: observation.observation_id,
      status,
      decided_by: decider,
      decided_at: decidedAt,
      withdrawal_reason:
        status === "withdrawn" ? form.elements.reason.value.trim() : undefined,
    });
    observation.publication_status = status;
    await put("observations", observation);
    location.hash = `#/observation/${id}`;
  });
}

/* ==========================================================================
   Archive & search
   ========================================================================== */

export async function renderArchive(container) {
  const observations = await getAll("observations");
  const rows = await Promise.all(
    observations.map(async (obs) => {
      const linked = await getLinkedRecords(obs);
      const exportable = linked.publication && linked.publication.status !== "private";
      return `
        <tr>
          <td><a href="#/observation/${esc(obs.observation_id)}">${esc(
        obs.observation_id
      )}</a></td>
          <td>${esc(obs.system)}</td>
          <td>${esc(obs.publication_status)}</td>
          <td>${esc(obs.created_at)}</td>
          <td>${
            exportable
              ? `<button class="btn" type="button" data-export="${esc(
                  obs.observation_id
                )}">Export JSON</button>`
              : `<span class="text-small">Not exportable while private / undecided</span>`
          }</td>
        </tr>`;
    })
  );

  container.innerHTML = `
    <h2>Archive &amp; search</h2>
    <p>Original records are preserved with their review and decision
      history (Data Lifecycle step 7). Export is only offered for records
      with a non-private publication decision — "APIs expose governed
      records, not raw extraction" (Constitutional Principle 13).</p>
    <table class="archive-table">
      <caption>All observations</caption>
      <thead>
        <tr><th scope="col">Observation</th><th scope="col">System</th><th scope="col">Status</th><th scope="col">Created</th><th scope="col">Export</th></tr>
      </thead>
      <tbody>${rows.join("")}</tbody>
    </table>`;

  container.querySelectorAll("button[data-export]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const obsId = btn.dataset.export;
      const obs = await get("observations", obsId);
      const linked = await getLinkedRecords(obs);
      const bundle = { observation: obs, ...linked };
      const blob = new Blob([JSON.stringify(bundle, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${obsId}.json`;
      a.click();
      URL.revokeObjectURL(url);
    });
  });
}

/* ==========================================================================
   News feed — public reader view
   ========================================================================== */

export async function renderNewsFeed(container) {
  const observations = await getAll("observations");
  const published = [];
  for (const obs of observations) {
    const linked = await getLinkedRecords(obs);
    // The publication decision record is the canonical gate (ADR-0004),
    // not the observation's own publication_status field. Only an explicit
    // human decision of "public" reaches the feed — embargoed, withdrawn,
    // internal_review, private, and undecided records never do.
    if (linked.publication && linked.publication.status === "public") {
      published.push({ obs, linked });
    }
  }

  published.sort((a, b) =>
    (b.linked.publication.decided_at || "").localeCompare(
      a.linked.publication.decided_at || ""
    )
  );

  if (published.length === 0) {
    container.innerHTML = `
      <h2>News</h2>
      <p>Nothing published yet. A story appears here only after a human
        editor records a <strong>public</strong> publication decision at
        the end of the governance pipeline.</p>`;
    return;
  }

  const articles = published.map(({ obs, linked }) => {
    const summary = linked.accessibility?.plain_language_summary;
    const body = obs.media?.transcript;
    // Every story needs a headline: obs.title is required by the New
    // Observation form. Older records (device-era or pre-title) fall back
    // to the plain-language summary, then a body excerpt, so they remain
    // readable rather than silently dropped.
    const headline =
      obs.title ||
      summary ||
      (body ? `${body.slice(0, 80)}${body.length > 80 ? "…" : ""}` : obs.observation_id);
    const standfirst = obs.title && summary ? summary : null;
    const decided = linked.publication;
    const place =
      obs.location?.precision && obs.location.precision !== "withheld"
        ? ` &middot; Location: ${esc(obs.location.precision)}`
        : "";
    return `
      <article class="review-card" aria-labelledby="news-${esc(obs.observation_id)}">
        <h3 id="news-${esc(obs.observation_id)}" style="margin-top:0;">${esc(headline)}</h3>
        ${standfirst ? `<p><strong>${esc(standfirst)}</strong></p>` : ""}
        <p class="text-small">
          Observed by ${esc(obs.observer_id || "unrecorded")} &middot;
          ${esc(obs.created_at)}${place}
        </p>
        ${(obs.title || summary) && body ? `<p>${esc(body)}</p>` : ""}
        ${
          obs.media?.image
            ? `<p class="text-small">Image: <code>${esc(obs.media.image)}</code> — ${esc(
                linked.accessibility?.alt_text || "no alt text recorded"
              )}</p>`
            : ""
        }
        <p class="inline-note text-small">
          Published by ${esc(decided.decided_by)} on ${esc(decided.decided_at)}
          after source, consent, risk, accessibility, and human review
          (Constitutional Principle 12: public does not mean context-free).
          <a href="#/observation/${esc(obs.observation_id)}">Full governed record</a>
        </p>
      </article>`;
  });

  container.innerHTML = `
    <h2>News</h2>
    <p>Every story below passed the full governance pipeline and carries a
      human publication decision. AI assists; it does not decide what
      appears here (SSL-005, SSL-006).</p>
    <div class="news-grid">${articles.join("")}</div>`;
}
