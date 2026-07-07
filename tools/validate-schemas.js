#!/usr/bin/env node
/**
 * Compiles every schema in schemas/ with ajv to catch malformed JSON
 * Schema documents before they're relied on elsewhere. This checks the
 * schemas are well-formed — it does not validate any data files against
 * them (there's no data yet that needs to pass one of these schemas; the
 * sample files in data/sample/ are illustrative, not schema-conformance
 * fixtures).
 */
const fs = require("fs");
const path = require("path");
// These schemas declare $schema: draft/2020-12, which Ajv only supports
// via this separate entry point (its default export only bundles the
// draft-07 meta-schema).
const Ajv2020 = require("ajv/dist/2020");

const ajv = new Ajv2020({ allErrors: true });
const schemaDir = path.join(__dirname, "..", "schemas");

for (const file of fs.readdirSync(schemaDir)) {
  if (!file.endsWith(".json")) continue;
  const schema = JSON.parse(fs.readFileSync(path.join(schemaDir, file), "utf8"));
  ajv.compile(schema);
  console.log(`Valid schema: ${file}`);
}
