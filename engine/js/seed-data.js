/**
 * Seed records, copied verbatim from this repository's own
 * examples/omoluabi-field-observation.json and the "examples" arrays in
 * schemas/consent.schema.json, schemas/source.schema.json,
 * schemas/risk.schema.json, and schemas/accessibility.schema.json.
 * Nothing here is invented — these are the repo's own worked examples,
 * loaded so the review screens have one real record to walk through.
 */

export const SEED_OBSERVATION = {
  observation_id: "om-obs-0001",
  created_at: "2026-06-25T19:30:00-04:00",
  system: "omoluabi",
  observer_id: "observer-local-001",
  device_id: "om-device-prototype-001",
  location: { lat: 40.0, lng: -73.0, precision: "approximate" },
  media: {
    audio: "media/audio.wav",
    image: "media/image.jpg",
    transcript: "transcripts/auto-draft.txt",
  },
  consent_id: "consent-0001",
  source_id: "source-0001",
  risk_id: "risk-0001",
  accessibility_id: "access-0001",
  ai_assist: {
    enabled: true,
    model: "local-or-browser-prototype",
    task: "transcript draft",
    confidence: 0.72,
    human_verified: false,
  },
  publication_status: "internal_review",
};

export const SEED_CONSENT = {
  consent_id: "consent-0001",
  observation_id: "om-obs-0001",
  state: "consented",
  consent_version: 1,
  subject_acknowledged: true,
  recorded_by: "observer-local-001",
  recorded_at: "2026-06-25T19:30:00-04:00",
};

export const SEED_SOURCE = {
  source_id: "source-0001",
  observation_id: "om-obs-0001",
  origin_type: "field-device",
  collector_id: "observer-local-001",
  device_id: "om-device-prototype-001",
  recorded_at: "2026-06-25T19:30:00-04:00",
};

export const SEED_RISK = {
  risk_id: "risk-0001",
  observation_id: "om-obs-0001",
  risk_level: "low",
  risk_factors: [],
  assessed_by: "observer-local-001",
  assessed_at: "2026-06-25T19:30:00-04:00",
};

export const SEED_ACCESSIBILITY = {
  accessibility_id: "access-0001",
  observation_id: "om-obs-0001",
  alt_text: "Field recording of a community meeting, audio only.",
  captions_available: false,
  recorded_at: "2026-06-25T19:30:00-04:00",
};
