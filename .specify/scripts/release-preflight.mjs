#!/usr/bin/env node
/**
 * Release preflight checklist.
 * Runs all validations before pushing to main (invoked by husky pre-push).
 *
 * Usage: node .specify/scripts/release-preflight.mjs
 * Exit code: 0 = all checks passed, 1 = one or more checks failed
 */

import { execSync } from "child_process";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..", "..");

// ─── Helpers ─────────────────────────────────────────────────────────────────
let failures = 0;
const results = [];

function run(label, cmd, { optional = false } = {}) {
  process.stdout.write(`  ${label}... `);
  try {
    execSync(cmd, { cwd: ROOT, stdio: "pipe" });
    console.log(`\x1b[32m✓\x1b[0m`);
    results.push({ label, status: "pass" });
  } catch (e) {
    if (optional) {
      console.log(`\x1b[33m⚠ (warning — not blocking)\x1b[0m`);
      results.push({ label, status: "warn" });
    } else {
      console.log(`\x1b[31m✗ FAILED\x1b[0m`);
      console.log(`\x1b[31m    ${e.stderr?.toString().slice(0, 300) || e.message}\x1b[0m`);
      results.push({ label, status: "fail" });
      failures++;
    }
  }
}

// ─── Preflight ────────────────────────────────────────────────────────────────
console.log(`\n\x1b[36m🚀 Release Preflight — AquatechIA\x1b[0m`);
console.log(`   Running before push to main. See: .specify/templates/release-spec.template.md\n`);

console.log(`\x1b[1mCode Quality\x1b[0m`);
run("TypeScript typecheck", "pnpm typecheck");
run("ESLint lint", "pnpm lint");
run("Tests", "pnpm test");

console.log(`\n\x1b[1mContent & Assets\x1b[0m`);
run("Content lint (articles)", "node .specify/scripts/lint-content.mjs");
run("Spec index lint", "node .specify/scripts/lint-specs.mjs");
run("Image budget (changed files)", "node .specify/scripts/image-budget.mjs --changed-only");

console.log(`\n\x1b[1mSecurity\x1b[0m`);
run("Dependency audit", "pnpm audit --audit-level moderate", { optional: true });

// ─── Summary ─────────────────────────────────────────────────────────────────
console.log(`\n${"─".repeat(50)}`);
const passed = results.filter((r) => r.status === "pass").length;
const warned = results.filter((r) => r.status === "warn").length;
const failed = results.filter((r) => r.status === "fail").length;

console.log(`Checks: ${passed} passed, ${warned} warned, ${failed} failed\n`);

if (failures === 0) {
  console.log(`\x1b[32m✅ Preflight passed! Safe to push.\x1b[0m`);
  console.log(`   Vercel will auto-deploy to production on push to main.\n`);
} else {
  console.log(`\x1b[31m✗ Preflight FAILED — push blocked.\x1b[0m`);
  console.log(`  Fix the failing checks before pushing.`);
  console.log(`  See: .specify/templates/release-spec.template.md for full checklist.`);
  console.log(`\n  ⚠️  Do NOT use --no-verify unless this is a documented hotfix.\n`);
}

process.exit(failures > 0 ? 1 : 0);
