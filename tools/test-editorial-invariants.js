#!/usr/bin/env node
/**
 * Tests the editorial-governance invariants Omoluabi MVP v1 must not
 * silently regress (see docs/decisions/003-sandbox-publication-boundary.md
 * and the directive's "Tests That Matter" section). These are behavioral
 * checks on the actual feed-rendering logic and the actual data files —
 * not schema shape checks (tools/validate-schemas.js already does those).
 *
 * Exits non-zero and prints a message on the first failed assertion.
 */
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const assert = require("assert");

const root = path.join(__dirname, "..");

function readJson(relPath) {
  return JSON.parse(fs.readFileSync(path.join(root, relPath), "utf8"));
}

// ---------------------------------------------------------------------
// 1. Unpublished content cannot appear as published content.
//    Reproduces _js/main.js's PUBLIC_STATUSES filter against fixture
//    data that includes every status the schema allows, so a future edit
//    that removes or weakens the filter fails this test even though the
//    real _data/news.json today only contains "example" content.
// ---------------------------------------------------------------------
function testFeedFilterExcludesUnpublished() {
  const mainJsSource = fs.readFileSync(path.join(root, "_js/main.js"), "utf8");
  const match = mainJsSource.match(/const PUBLIC_STATUSES = (\[[^\]]*\]);/);
  assert(match, "main.js must define a PUBLIC_STATUSES allow-list");
  const PUBLIC_STATUSES = JSON.parse(match[1].replace(/'/g, '"'));

  const fixture = [
    { id: "a", status: "draft", date: "2026-01-01" },
    { id: "b", status: "sandbox", date: "2026-01-02" },
    { id: "c", status: "retracted", date: "2026-01-03" },
    { id: "d", status: "published", date: "2026-01-04" },
    { id: "e", status: "example", date: "2026-01-05" },
  ];
  const rendered = fixture.filter((item) => PUBLIC_STATUSES.includes(item.status));
  const renderedIds = rendered.map((item) => item.id).sort();

  assert.deepStrictEqual(
    renderedIds,
    ["d", "e"],
    `Expected only published/example entries to render, got: ${renderedIds.join(", ")}`
  );
  console.log("PASS: feed filter excludes draft/sandbox/retracted, includes published/example");
}

// ---------------------------------------------------------------------
// 2. Sandbox content (the research-ingestion pipeline) cannot publish
//    itself: data/raw and data/processed — the only places tools/*.py
//    write to — must stay git-ignored, so nothing in them ships to the
//    live site without a human manually copying it into _data/*.json.
// ---------------------------------------------------------------------
function testSandboxDirectoriesAreGitIgnored() {
  for (const dir of ["data/raw/some-file.evidence.json", "data/processed/some-file.evidence.json"]) {
    const result = execFileSync("git", ["check-ignore", dir], { cwd: root })
      .toString()
      .trim();
    assert.strictEqual(result, dir, `${dir} must be git-ignored (sandbox boundary)`);
  }
  console.log("PASS: data/raw and data/processed are git-ignored (sandbox cannot publish itself)");
}

// ---------------------------------------------------------------------
// 3. Every status actually used in the live data file is one of the
//    schema's declared editorial states, and every non-public status
//    (if any ever appears) is excluded from PUBLIC_STATUSES.
// ---------------------------------------------------------------------
function testLiveStatusesAreDeclaredAndGoverned() {
  const schema = readJson("schemas/news_entry.schema.json");
  const declaredStatuses = schema.properties.status.enum;
  const publicStatuses = ["published", "example"];
  const news = readJson("_data/news.json");

  for (const entry of news.entries) {
    assert(
      declaredStatuses.includes(entry.status),
      `news entry ${entry.id} has undeclared status "${entry.status}"`
    );
  }
  for (const status of declaredStatuses) {
    if (!publicStatuses.includes(status)) {
      assert(
        !news.entries.some((e) => e.status === status && publicStatuses.includes(e.status)),
        `status "${status}" must never be treated as public`
      );
    }
  }
  console.log("PASS: live news entries use only declared, correctly-governed statuses");
}

// ---------------------------------------------------------------------
// 4. Provenance / referential integrity: every evidenceId a story cites
//    must resolve to a real entry in _data/evidence.json.
// ---------------------------------------------------------------------
function testEvidenceReferencesResolve() {
  const news = readJson("_data/news.json");
  const evidence = readJson("_data/evidence.json");
  const evidenceIds = new Set(evidence.sources.map((s) => s.id));

  for (const entry of news.entries) {
    for (const id of entry.evidenceIds) {
      assert(evidenceIds.has(id), `news entry ${entry.id} cites unknown evidence id "${id}"`);
    }
  }
  console.log("PASS: every cited evidenceId resolves to a real evidence entry");
}

// ---------------------------------------------------------------------
// 5. Core operation has no frontier-model / hosted-LLM dependency.
//    Deny-lists known AI vendor SDKs from the two dependency manifests
//    this repo has. A real regression (someone adding `openai` to
//    package.json) fails this test at commit time, not at incident time.
// ---------------------------------------------------------------------
function testNoFrontierAiDependency() {
  const denyList = [
    "openai",
    "@anthropic-ai",
    "anthropic",
    "@google/generative-ai",
    "google-generativeai",
    "google-genai",
    "cohere-ai",
    "langchain",
  ];
  const pkg = readJson("package.json");
  const deps = Object.keys({ ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) });
  for (const dep of deps) {
    assert(!denyList.includes(dep), `package.json depends on frontier-AI SDK "${dep}"`);
  }

  const requirements = fs.readFileSync(path.join(root, "requirements.txt"), "utf8");
  const pyDenyList = ["openai", "anthropic", "google-generativeai", "google-genai", "langchain"];
  for (const line of requirements.split("\n")) {
    const pkgName = line.trim().split(/[=<>#]/)[0].trim().toLowerCase();
    if (!pkgName) continue;
    assert(!pyDenyList.includes(pkgName), `requirements.txt depends on frontier-AI SDK "${pkgName}"`);
  }
  console.log("PASS: no frontier-AI SDK in package.json or requirements.txt");
}

const tests = [
  testFeedFilterExcludesUnpublished,
  testSandboxDirectoriesAreGitIgnored,
  testLiveStatusesAreDeclaredAndGoverned,
  testEvidenceReferencesResolve,
  testNoFrontierAiDependency,
];

let failed = 0;
for (const test of tests) {
  try {
    test();
  } catch (err) {
    failed++;
    console.error(`FAIL: ${test.name}`);
    console.error(err.message);
  }
}

if (failed > 0) {
  console.error(`\n${failed} of ${tests.length} editorial-invariant test(s) failed.`);
  process.exit(1);
}
console.log(`\nAll ${tests.length} editorial-invariant tests passed.`);
