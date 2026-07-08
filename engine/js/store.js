/**
 * Local-first record store. Browser IndexedDB is a prototype decision —
 * see web-engine/local-first-plan.md — not a settled production
 * architecture. Object stores mirror the schema files in /schemas/
 * exactly: one store per governed record type, keyed by that record's
 * own id field. Nothing here talks to a network.
 *
 * Prototype-only fields (not part of any schemas/*.schema.json file)
 * are always prefixed with an underscore, e.g. `_reviewed_at`, so they
 * are never mistaken for canonical schema fields.
 */

const DB_NAME = "omoluabi-web-engine";
const DB_VERSION = 1;

const STORES = {
  observations: "observation_id",
  consent: "consent_id",
  sources: "source_id",
  risks: "risk_id",
  accessibility: "accessibility_id",
  publications: "publication_id",
  reviews: "review_id", // prototype-only: human sign-off log, no canonical schema yet
};

let dbPromise = null;

export function openStore() {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      for (const [storeName, keyPath] of Object.entries(STORES)) {
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath });
        }
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return dbPromise;
}

function tx(db, storeName, mode) {
  return db.transaction(storeName, mode).objectStore(storeName);
}

export async function put(storeName, record) {
  const db = await openStore();
  return new Promise((resolve, reject) => {
    const req = tx(db, storeName, "readwrite").put(record);
    req.onsuccess = () => resolve(record);
    req.onerror = () => reject(req.error);
  });
}

export async function get(storeName, id) {
  if (!id) return null;
  const db = await openStore();
  return new Promise((resolve, reject) => {
    const req = tx(db, storeName, "readonly").get(id);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  });
}

export async function getAll(storeName) {
  const db = await openStore();
  return new Promise((resolve, reject) => {
    const req = tx(db, storeName, "readonly").getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

export async function count(storeName) {
  const db = await openStore();
  return new Promise((resolve, reject) => {
    const req = tx(db, storeName, "readonly").count();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

/** Resolve every record an observation links to, by the id fields
 *  defined in observation.schema.json (consent_id, source_id, risk_id,
 *  accessibility_id), plus any publication decision recorded against it
 *  and the prototype review log entry. */
export async function getLinkedRecords(observation) {
  const [consent, source, risk, accessibility, publications, reviews] =
    await Promise.all([
      get("consent", observation.consent_id),
      get("sources", observation.source_id),
      get("risks", observation.risk_id),
      get("accessibility", observation.accessibility_id),
      getAll("publications"),
      getAll("reviews"),
    ]);
  const publication =
    publications.find(
      (p) => p.observation_id === observation.observation_id
    ) || null;
  const review =
    reviews.find((r) => r.observation_id === observation.observation_id) ||
    null;
  return { consent, source, risk, accessibility, publication, review };
}

export const STORE_NAMES = STORES;
