#!/usr/bin/env node
/**
 * Spec linting for CI: validates that PRs referencing specs are well-formed.
 *
 * Checks:
 *   1. specs/README.md is synced with specs/ directories.
 *   2. Every spec.md has valid YAML frontmatter.
 *   3. spec.md status matches README.md status.
 *   4. spec.md contains all required sections (Problem, Constraints, Non-Goals, User Stories).
 *
 * Usage: node .specify/scripts/lint-specs.mjs [--ci]
 * Exit code: 0 = all pass, 1 = errors found
 */

import { existsSync, readFileSync, readdirSync } from "fs";
import { dirname, join, relative } from "path";
import { fileURLToPath } from "url";
import matter from "gray-matter";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..", "..");
const SPECS_DIR = join(ROOT, "specs");
const SPECS_README = join(SPECS_DIR, "README.md");

let errors = 0;

function err(msg) { console.error(`\x1b[31m[ERROR]\x1b[0m ${msg}`); errors++; }
function ok(msg)  { console.log(`\x1b[32m[OK]\x1b[0m   ${msg}`); }
function info(msg) { console.log(`\x1b[36m[INFO]\x1b[0m ${msg}`); }

const REQUIRED_SECTIONS = [
  { name: "Problem", pattern: /##\s*\d*\.?\s*Problem/i },
  { name: "Constraints", pattern: /##\s*\d*\.?\s*Constraints/i },
  { name: "Non-Goals", pattern: /##\s*\d*\.?\s*Non-Goals/i },
  { name: "User Stories", pattern: /##\s*\d*\.?\s*User Stories/i }
];

const VALID_STATUSES = ["draft", "review", "approved", "implemented", "deprecated", "stub"];

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
const specRowPattern = /^\|(\s*\[SPEC-(\d+)\]\(([^)]+)\)[^|]*)\|(.+)$/gm;
const indexedSpecs = [];

for (const match of readmeContent.matchAll(specRowPattern)) {
  const [, , id, link, rest] = match;
  const cells = rest.split("|").map(c => c.trim()).filter(c => c !== "");
  const status = cells.length >= 3 ? cells[cells.length - 2] : cells[0];
  const title  = cells[0];
  indexedSpecs.push({
    id: `SPEC-${id}`,
    link: link.trim(),
    title: title.trim(),
    status: status.trim().toLowerCase(),
  });
}

info(`Found ${indexedSpecs.length} specs in README.md index`);

// ─── 4. Validate each indexed spec ───────────────────────────────────────────
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

  // Deep validation using gray-matter
  let specErrors = 0;
  function specErr(msg) { err(msg); specErrors++; }

  try {
    const fileContent = readFileSync(specFile, "utf-8");
    const { data, content } = matter(fileContent);

    // Validate Frontmatter
    if (!data.id) specErr(`${spec.id}: Missing 'id' in YAML frontmatter`);
    if (data.id && data.id !== spec.id) specErr(`${spec.id}: Frontmatter ID mismatch (found ${data.id})`);
    
    if (!data.status) {
      specErr(`${spec.id}: Missing 'status' in YAML frontmatter`);
    } else if (data.status.toLowerCase() !== spec.status) {
      specErr(`${spec.id}: Status mismatch — README says "${spec.status}", Frontmatter says "${data.status}"`);
    }

    if (!VALID_STATUSES.includes(data.status?.toLowerCase())) {
      specErr(`${spec.id}: Invalid status "${data.status}". Valid: ${VALID_STATUSES.join(", ")}`);
    }

    // Validate Required Sections (skip for stubs)
    if (data.status !== "stub") {
      for (const section of REQUIRED_SECTIONS) {
        if (!section.pattern.test(content)) {
          specErr(`${spec.id}: Missing required section "${section.name}"`);
        }
      }
    }

  } catch (e) {
    specErr(`${spec.id}: Failed to parse spec.md — ${e.message}`);
  }

  if (specErrors === 0) {
    ok(`${spec.id}: ${spec.title} [${spec.status}]`);
  }
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

// ─── Summary ─────────────────────────────────────────────────────────────────
console.log(`\n${"─".repeat(50)}`);
if (errors === 0) {
  console.log(`\x1b[32m✅ All spec checks passed! (${indexedSpecs.length} specs validated)\x1b[0m\n`);
} else {
  console.log(`\x1b[31m✗ ${errors} error(s) found in spec index\x1b[0m\n`);
}

process.exit(errors > 0 ? 1 : 0);
