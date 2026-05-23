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
 * Usage: node .specify/scripts/lint-specs.mjs [--ci] [--changed-only] [--json] [--self-test]
 * Exit code: 0 = all pass, 1 = errors found
 */

import { execFileSync } from "child_process";
import { existsSync, readFileSync, readdirSync } from "fs";
import { dirname, join, relative } from "path";
import { fileURLToPath } from "url";
import matter from "gray-matter";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..", "..");
const SPECS_DIR = join(ROOT, "specs");
const SPECS_README = join(SPECS_DIR, "README.md");
const args = new Set(process.argv.slice(2));
const isHarnessPR = process.env.HARNESS_PULL_REQUEST_NUMBER || (process.env.HARNESS_PR_SOURCE_BRANCH && process.env.HARNESS_PR_TARGET_BRANCH);
const changedOnly = args.has("--changed-only") || Boolean(isHarnessPR);
const jsonOutput = args.has("--json");
const selfTest = args.has("--self-test");

let errors = 0;
const report = {
  mode: changedOnly ? "changed-only" : "full",
  specsFound: 0,
  specsValidated: 0,
  errors: [],
  warnings: [],
  specs: [],
};

function writeHuman(stream, msg) {
  if (!jsonOutput) stream.write(`${msg}\n`);
}

function err(msg) {
  report.errors.push(msg);
  writeHuman(process.stderr, `\x1b[31m[ERROR]\x1b[0m ${msg}`);
  errors++;
}
function ok(msg)  { writeHuman(process.stdout, `\x1b[32m[OK]\x1b[0m   ${msg}`); }
function info(msg) { writeHuman(process.stdout, `\x1b[36m[INFO]\x1b[0m ${msg}`); }

const REQUIRED_SECTIONS = [
  { name: "Problem", pattern: /##\s*\d*\.?\s*Problem/i },
  { name: "Constraints", pattern: /##\s*\d*\.?\s*Constraints/i },
  { name: "Non-Goals", pattern: /##\s*\d*\.?\s*Non-Goals/i },
  { name: "User Stories", pattern: /##\s*\d*\.?\s*User Stories/i }
];

const VALID_STATUSES = ["draft", "review", "approved", "implementing", "implemented", "deprecated", "stub"];
const PLAN_REQUIRED_STATUSES = ["approved", "implementing", "implemented"];
const TASKS_REQUIRED_STATUSES = ["implementing", "implemented"];

function finish() {
  report.specsFound = indexedSpecs?.length ?? 0;
  report.errorsCount = errors;
  report.ok = errors === 0;

  if (jsonOutput) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    console.log(`\n${"─".repeat(50)}`);
    if (errors === 0) {
      console.log(`\x1b[32m✅ All spec checks passed! (${report.specsValidated} specs validated)\x1b[0m\n`);
    } else {
      console.log(`\x1b[31m✗ ${errors} error(s) found in spec index\x1b[0m\n`);
    }
  }

  process.exit(errors > 0 ? 1 : 0);
}

function changedFilesFromGit() {
  if (process.env.LINT_SPECS_CHANGED_FILES) {
    return new Set(
      process.env.LINT_SPECS_CHANGED_FILES
        .split(/\r?\n|,/)
        .map((file) => file.trim().replaceAll("\\", "/"))
        .filter(Boolean)
    );
  }

  const commands = [
    ["diff", "--name-only", "origin/main...HEAD"],
    ["diff", "--name-only", "HEAD~1", "HEAD"],
    ["diff", "--name-only", "--cached"],
    ["diff", "--name-only"],
  ];
  const files = new Set();

  for (const gitArgs of commands) {
    try {
      const output = execFileSync("git", gitArgs, { cwd: ROOT, stdio: ["ignore", "pipe", "ignore"] })
        .toString()
        .trim();
      for (const file of output.split(/\r?\n/).filter(Boolean)) {
        files.add(file.replaceAll("\\", "/"));
      }
    } catch {
      // Different environments expose different git refs. Try the next option.
    }
  }

  try {
    const statusOutput = execFileSync("git", ["status", "--short", "--untracked-files=all"], {
      cwd: ROOT,
      stdio: ["ignore", "pipe", "ignore"],
    }).toString().trim();
    for (const line of statusOutput.split(/\r?\n/).filter(Boolean)) {
      const file = line.slice(3).replaceAll("\\", "/");
      if (file) files.add(file);
    }
  } catch {
    // Local working tree status is a convenience; CI diffs above are canonical.
  }

  return files;
}

function specDirFromLink(link) {
  return link.replace("/spec.md", "");
}

function specTouched(spec, changedFiles) {
  const dir = `specs/${specDirFromLink(spec.link)}/`;
  return [...changedFiles].some((file) => file === `specs/${spec.link}` || file.startsWith(dir));
}

function tasksAreComplete(tasksContent) {
  const incompleteStatusPattern = /\*\*Status\*\*:\s*`?(pending|in-progress)`?/i;
  const incompleteTablePattern = /\|\s*T\d+\s*\|\s*(pending|in-progress)\s*\|/i;
  return !incompleteStatusPattern.test(tasksContent) && !incompleteTablePattern.test(tasksContent);
}

function assertSelfTest(condition, message) {
  if (!condition) throw new Error(message);
}

function runSelfTest() {
  assertSelfTest(VALID_STATUSES.includes("implementing"), "implementing status should be valid");
  assertSelfTest(PLAN_REQUIRED_STATUSES.includes("approved"), "approved changed specs should require plan.md");
  assertSelfTest(TASKS_REQUIRED_STATUSES.includes("implementing"), "implementing changed specs should require tasks.md");
  assertSelfTest(tasksAreComplete("### T001\n**Status**: `complete`"), "complete task content should pass");
  assertSelfTest(!tasksAreComplete("### T001\n**Status**: `pending`"), "pending task content should fail");
  assertSelfTest(!tasksAreComplete("| T001 | in-progress | — | |"), "in-progress tracker row should fail");
  console.log("lint-specs self-test passed");
}

if (selfTest) {
  runSelfTest();
  process.exit(0);
}

let indexedSpecs = [];

// ─── 1. Check specs directory exists ─────────────────────────────────────────
if (!existsSync(SPECS_DIR)) {
  err("specs/ directory not found. Run: mkdir specs");
  finish();
}

// ─── 2. Check specs/README.md exists ─────────────────────────────────────────
if (!existsSync(SPECS_README)) {
  err("specs/README.md not found. The specs index is required.");
  finish();
}

// ─── 3. Parse specs from README.md table ─────────────────────────────────────
const readmeContent = readFileSync(SPECS_README, "utf-8");
const specRowPattern = /^\|(\s*\[SPEC-(\d+)\]\(([^)]+)\)[^|]*)\|(.+)$/gm;
const changedFiles = changedOnly ? changedFilesFromGit() : new Set();

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
if (changedOnly) info(`Changed-only mode: ${changedFiles.size} changed file(s) detected`);

// ─── 4. Validate each indexed spec ───────────────────────────────────────────
for (const spec of indexedSpecs) {
  const touched = changedOnly ? specTouched(spec, changedFiles) : false;
  if (changedOnly && !touched) continue;

  report.specsValidated++;

  const specDir = join(SPECS_DIR, specDirFromLink(spec.link));
  const specFile = join(SPECS_DIR, spec.link);
  const planFile = join(specDir, "plan.md");
  const tasksFile = join(specDir, "tasks.md");
  const specReport = {
    id: spec.id,
    title: spec.title,
    status: spec.status,
    touched,
    link: spec.link,
    errors: [],
  };
  report.specs.push(specReport);

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
  function specErr(msg) {
    specReport.errors.push(msg);
    err(msg);
    specErrors++;
  }

  try {
    const fileContent = readFileSync(specFile, "utf-8");
    const { data, content } = matter(fileContent);
    const status = data.status?.toLowerCase();

    // Validate Frontmatter
    if (!data.id) specErr(`${spec.id}: Missing 'id' in YAML frontmatter`);
    if (data.id && data.id !== spec.id) specErr(`${spec.id}: Frontmatter ID mismatch (found ${data.id})`);
    
    if (!data.status) {
      specErr(`${spec.id}: Missing 'status' in YAML frontmatter`);
    } else if (status !== spec.status) {
      specErr(`${spec.id}: Status mismatch — README says "${spec.status}", Frontmatter says "${data.status}"`);
    }

    if (!VALID_STATUSES.includes(status)) {
      specErr(`${spec.id}: Invalid status "${data.status}". Valid: ${VALID_STATUSES.join(", ")}`);
    }

    // Validate Required Sections (skip for stubs)
    if (status !== "stub") {
      for (const section of REQUIRED_SECTIONS) {
        if (!section.pattern.test(content)) {
          specErr(`${spec.id}: Missing required section "${section.name}"`);
        }
      }
    }

    // Progressive SDD enforcement:
    // full mode preserves bootstrap specs; changed-only mode is strict for PR work.
    if (changedOnly && status !== "stub") {
      if (PLAN_REQUIRED_STATUSES.includes(status) && !existsSync(planFile)) {
        specErr(`${spec.id}: ${status} specs changed in this PR must include plan.md`);
      }

      if (TASKS_REQUIRED_STATUSES.includes(status) && !existsSync(tasksFile)) {
        specErr(`${spec.id}: ${status} specs changed in this PR must include tasks.md`);
      }
    }

    if (status === "implementing" && !existsSync(tasksFile)) {
      specErr(`${spec.id}: implementing specs must include tasks.md`);
    }

    if (status === "implemented") {
      if (!existsSync(planFile)) {
        specErr(`${spec.id}: implemented specs must include plan.md`);
      }
      if (!existsSync(tasksFile)) {
        specErr(`${spec.id}: implemented specs must include tasks.md`);
      } else {
        const tasksContent = readFileSync(tasksFile, "utf-8");
        if (!tasksAreComplete(tasksContent)) {
          specErr(`${spec.id}: implemented specs cannot have pending or in-progress tasks`);
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
finish();
