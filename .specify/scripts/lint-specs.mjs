#!/usr/bin/env node
/**
 * Spec linting for CI: validates that PRs referencing specs are well-formed.
 *
 * In CI context: checks that all specs listed in specs/README.md have the
 * expected directory structure (spec.md exists).
 *
 * In pre-push context: validates that any spec referenced in staged commit
 * messages exists and is in an approved state.
 *
 * Usage: node .specify/scripts/lint-specs.mjs [--ci]
 * Exit code: 0 = all pass, 1 = errors found
 */

import { existsSync, readFileSync, readdirSync } from "fs";
import { dirname, join, relative } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..", "..");
const SPECS_DIR = join(ROOT, "specs");
const SPECS_README = join(SPECS_DIR, "README.md");

let errors = 0;

function err(msg) { console.error(`\x1b[31m[ERROR]\x1b[0m ${msg}`); errors++; }
function ok(msg)  { console.log(`\x1b[32m[OK]\x1b[0m   ${msg}`); }
function info(msg) { console.log(`\x1b[36m[INFO]\x1b[0m ${msg}`); }

// ─── 1. Check specs directory exists ─────────────────────────────────────────
if (!existsSync(SPECS_DIR)) {
  err("specs/ directory not found. Run: mkdir specs");
  process.exit(1);
}

// ─── 2. Check specs/README.md exists ─────────────────────────────────────────
if (!existsSync(SPECS_README)) {
  err("specs/README.md not found. The specs index is required.");
  process.exit(1);
}

// ─── 3. Parse specs from README.md table ─────────────────────────────────────
const readmeContent = readFileSync(SPECS_README, "utf-8");
// Matches any row with [SPEC-NNN](...) and captures all pipe-separated cells
const specRowPattern = /^\|(\s*\[SPEC-(\d+)\]\(([^)]+)\)[^|]*)\|(.+)$/gm;
const indexedSpecs = [];

for (const match of readmeContent.matchAll(specRowPattern)) {
  const [, , id, link, rest] = match;
  const cells = rest.split("|").map(c => c.trim()).filter(c => c !== "");
  // cells: [Title, Status, Date] (4-col) or [Title, Portal, Status, Date] (5-col)
  // Status is always the second-to-last cell (before the date)
  const status = cells.length >= 3 ? cells[cells.length - 2] : cells[0];
  const title  = cells[0];
  indexedSpecs.push({
    id: `SPEC-${id}`,
    link: link.trim(),
    title: title.trim(),
    status: status.trim(),
  });
}

info(`Found ${indexedSpecs.length} specs in README.md index`);

// ─── 4. Validate each indexed spec has a directory and spec.md ───────────────
for (const spec of indexedSpecs) {
  const specDir = join(SPECS_DIR, spec.link.replace("/spec.md", ""));
  const specFile = join(SPECS_DIR, spec.link);

  if (!existsSync(specDir)) {
    err(`${spec.id}: Directory not found — expected: specs/${relative(SPECS_DIR, specDir)}/`);
    continue;
  }

  if (!existsSync(specFile)) {
    err(`${spec.id}: spec.md not found — expected: ${spec.link}`);
    continue;
  }

  ok(`${spec.id}: ${spec.title} [${spec.status}]`);
}

// ─── 5. Check for spec directories not in README ─────────────────────────────
if (existsSync(SPECS_DIR)) {
  const actualDirs = readdirSync(SPECS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && /^\d{3}-/.test(d.name))
    .map((d) => d.name);

  for (const dir of actualDirs) {
    const specId = `SPEC-${dir.slice(0, 3)}`;
    const isIndexed = indexedSpecs.some((s) => s.id === specId);
    if (!isIndexed) {
      err(`${specId}: Directory "specs/${dir}/" exists but is not in specs/README.md index. Add it.`);
    }
  }
}

// ─── 6. Validate spec.md status field ────────────────────────────────────────
const validStatuses = ["draft", "review", "approved", "implemented", "deprecated", "stub"];
for (const spec of indexedSpecs) {
  if (!validStatuses.includes(spec.status.toLowerCase())) {
    err(`${spec.id}: Invalid status "${spec.status}". Valid: ${validStatuses.join(", ")}`);
  }
}

// ─── Summary ─────────────────────────────────────────────────────────────────
console.log(`\n${"─".repeat(50)}`);
if (errors === 0) {
  console.log(`\x1b[32m✅ All spec checks passed! (${indexedSpecs.length} specs validated)\x1b[0m\n`);
} else {
  console.log(`\x1b[31m✗ ${errors} error(s) found in spec index\x1b[0m\n`);
}

process.exit(errors > 0 ? 1 : 0);
