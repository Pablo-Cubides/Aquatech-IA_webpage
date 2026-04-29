#!/usr/bin/env node
/**
 * Bootstrap a new SDD feature spec directory.
 * Usage: node .specify/scripts/new-feature.mjs <slug> [--spec-id=NNN]
 * Example: node .specify/scripts/new-feature.mjs user-notifications --spec-id=012
 */

import { execSync } from "child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..", "..");
const SPECS_DIR = join(ROOT, "specs");
const TEMPLATES_DIR = join(__dirname, "..", "templates");

// ─── Helpers ────────────────────────────────────────────────────────────────

function log(msg) { console.log(`\x1b[36m[new-feature]\x1b[0m ${msg}`); }
function success(msg) { console.log(`\x1b[32m✓\x1b[0m ${msg}`); }
function error(msg) { console.error(`\x1b[31m✗\x1b[0m ${msg}`); process.exit(1); }

function getNextSpecId() {
  if (!existsSync(SPECS_DIR)) return "001";
  const dirs = readdirSync(SPECS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && /^\d{3}-/.test(d.name))
    .map((d) => parseInt(d.name.slice(0, 3), 10));
  if (dirs.length === 0) return "001";
  const max = Math.max(...dirs);
  return String(max + 1).padStart(3, "0");
}

function readTemplate(name) {
  const path = join(TEMPLATES_DIR, name);
  if (!existsSync(path)) error(`Template not found: ${path}`);
  return readFileSync(path, "utf-8");
}

function applyTemplate(template, vars) {
  return Object.entries(vars).reduce(
    (t, [k, v]) => t.replaceAll(`[${k}]`, v).replaceAll(`NNN`, vars.specId),
    template
  );
}

// ─── Main ────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
if (args.length === 0) {
  error("Usage: node .specify/scripts/new-feature.mjs <slug> [--spec-id=NNN]");
}

const slug = args[0].toLowerCase().replace(/\s+/g, "-");
if (!/^[a-z0-9-]+$/.test(slug)) error("Slug must be kebab-case (a-z, 0-9, hyphens only).");

const specIdArg = args.find((a) => a.startsWith("--spec-id="));
const specId = specIdArg ? specIdArg.split("=")[1].padStart(3, "0") : getNextSpecId();

const specDirName = `${specId}-${slug}`;
const specDir = join(SPECS_DIR, specDirName);

if (existsSync(specDir)) error(`Spec directory already exists: specs/${specDirName}`);

const today = new Date().toISOString().slice(0, 10);
const title = slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

const vars = { specId, slug, title, today };

// Create directories
mkdirSync(specDir, { recursive: true });
log(`Created specs/${specDirName}/`);

// Generate spec.md
const specContent = applyTemplate(readTemplate("spec.template.md"), vars)
  .replace("SPEC-NNN", `SPEC-${specId}`)
  .replace("[Feature Title / Título de la feature]", title)
  .replace(/YYYY-MM-DD/g, today);
writeFileSync(join(specDir, "spec.md"), specContent);
success("spec.md created");

// Generate plan.md
const planContent = applyTemplate(readTemplate("plan.template.md"), vars)
  .replace("SPEC-NNN", `SPEC-${specId}`)
  .replace(/YYYY-MM-DD/g, today);
writeFileSync(join(specDir, "plan.md"), planContent);
success("plan.md created");

// Generate tasks.md
const tasksContent = applyTemplate(readTemplate("tasks.template.md"), vars)
  .replace("SPEC-NNN", `SPEC-${specId}`);
writeFileSync(join(specDir, "tasks.md"), tasksContent);
success("tasks.md created");

// Update specs/README.md index
const specsReadme = join(SPECS_DIR, "README.md");
if (existsSync(specsReadme)) {
  const content = readFileSync(specsReadme, "utf-8");
  const newRow = `| [SPEC-${specId}](${specDirName}/spec.md) | ${title} | draft | ${today} |`;
  const updatedContent = content.replace(
    "<!-- NEW SPECS ABOVE THIS LINE -->",
    `${newRow}\n<!-- NEW SPECS ABOVE THIS LINE -->`
  );
  writeFileSync(specsReadme, updatedContent);
  success("specs/README.md updated");
}

// Create git branch
try {
  execSync(`git checkout -b spec/SPEC-${specId}-${slug}`, { stdio: "pipe", cwd: ROOT });
  success(`Git branch created: spec/SPEC-${specId}-${slug}`);
} catch {
  log("Could not create git branch automatically (may already exist or git not available).");
}

console.log(`
\x1b[32m✅ SPEC-${specId} bootstrapped successfully!\x1b[0m

  📁 specs/${specDirName}/
     ├── spec.md    ← Fill in: problem, user stories, business rules, NFRs
     ├── plan.md    ← Fill after spec is approved: technical design
     └── tasks.md   ← Fill after plan is approved: atomic tasks

  Next steps:
  1. Fill out specs/${specDirName}/spec.md
  2. Run: /spec.clarify to validate open questions
  3. Get spec approved, then fill plan.md
  4. Get plan approved, then fill tasks.md
  5. Start implementing task by task
`);
