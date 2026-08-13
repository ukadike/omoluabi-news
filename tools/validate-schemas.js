#!/usr/bin/env node
/**
 * Compiles every schema in schemas/ with ajv to catch malformed JSON
 * Schema documents before they're relied on elsewhere, then validates the
 * two data files that back the live site — _data/news.json and
 * _data/evidence.json — against schemas/news_entry.schema.json and
 * schemas/news_evidence_source.schema.json. The other schemas
 * (evidence.schema.json, source.schema.json, map_layer.schema.json) cover
 * the research pipeline's own formats; data/sample/* is illustrative, not
 * schema-conformance fixtures, so it's not validated here.
 */
const fs = require("fs");
const path = require("path");
// These schemas declare $schema: draft/2020-12, which Ajv only supports
// via this separate entry point (its default export only bundles the
// draft-07 meta-schema).
const Ajv2020 = require("ajv/dist/2020");

const ajv = new Ajv2020({ allErrors: true });
const root = path.join(__dirname, "..");
const schemaDir = path.join(root, "schemas");

const compiled = {};
for (const file of fs.readdirSync(schemaDir)) {
  if (!file.endsWith(".json")) continue;
  const schema = JSON.parse(fs.readFileSync(path.join(schemaDir, file), "utf8"));
  compiled[file] = ajv.compile(schema);
  console.log(`Valid schema: ${file}`);
}

function validateDataFile(dataPath, arrayField, schemaFile) {
  const data = JSON.parse(fs.readFileSync(path.join(root, dataPath), "utf8"));
  const items = data[arrayField];
  const validate = compiled[schemaFile];
  let failures = 0;
  for (const item of items) {
    if (!validate(item)) {
      failures++;
      console.error(
        `${dataPath} :: ${arrayField} item ${item.id || "(no id)"} failed ${schemaFile}:`,
        validate.errors
      );
    }
  }
  if (failures > 0) {
    throw new Error(`${failures} item(s) in ${dataPath} failed ${schemaFile}`);
  }
  console.log(`Valid data: ${dataPath} (${items.length} item(s) against ${schemaFile})`);
}

validateDataFile("_data/news.json", "entries", "news_entry.schema.json");
validateDataFile("_data/evidence.json", "sources", "news_evidence_source.schema.json");
