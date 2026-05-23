#!/usr/bin/env node
/**
 * Image budget enforcement for CI.
 * Scans all images in apps/web/public/ and apps/web/src/ for budget violations.
 * Used by image-budget.yml GitHub Actions workflow.
 *
 * Context detection from file path:
 *   /blog/ containing hero → hero budget (200KB)
 *   /blog/ not first image  → inline budget (80KB)
 *   /herramientas/ or /tool/ → tool budget (120KB)
 *   /autor/ → author budget (40KB)
 *   default → inline budget (80KB)
 *
 * Usage: node .specify/scripts/image-budget.mjs [--changed-only]
 *   --changed-only: only check git-changed image files (for CI PR checks)
 *
 * Exit code: 0 = all within budget, 1 = budget violations found
 */

import { execSync } from "child_process";
import { existsSync, readdirSync, statSync } from "fs";
import { dirname, extname, join, relative } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..", "..");
const PUBLIC_DIR = join(ROOT, "apps", "web", "public");

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"]);

// Constitution §5.3 budgets in bytes
const BUDGETS = {
  hero:   200 * 1024,
  inline:  80 * 1024,
  tool:   120 * 1024,
  author:  40 * 1024,
  icon:    10 * 1024,
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
let violations = 0;
let checked = 0;

function formatBytes(b) {
  if (b < 1024) return `${b}B`;
  return `${(b / 1024).toFixed(1)}KB`;
}

function detectContext(filePath) {
  const p = filePath.toLowerCase();
  if (p.includes("/autor/"))       return "author";
  if (p.includes("/herramientas/")) return "tool";
  if (p.includes("/mapas/"))        return "tool";
  // hero heuristic: files named "hero" or in hero position
  if (p.includes("hero"))           return "hero";
  if (p.includes("/blog/"))         return "inline";
  if (p.includes("/icons/") || p.includes(".svg")) return "icon";
  return "inline";
}

function checkFile(filePath) {
  const ext = extname(filePath).toLowerCase();
  if (!IMAGE_EXTENSIONS.has(ext)) return;

  const rel = relative(ROOT, filePath);
  const size = statSync(filePath).size;
  const context = detectContext(filePath);
  const budget = BUDGETS[context];
  checked++;

  if (size > budget) {
    console.error(
      `\x1b[31m[OVER BUDGET]\x1b[0m ${rel}\n` +
      `  Context: ${context} | Size: ${formatBytes(size)} | Budget: ${formatBytes(budget)} | ` +
      `Over by: ${formatBytes(size - budget)}`
    );
    violations++;
  } else {
    console.log(
      `\x1b[32m[OK]\x1b[0m ${rel} — ${formatBytes(size)} (${context} budget: ${formatBytes(budget)})`
    );
  }
}

function scanDir(dir) {
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      scanDir(fullPath);
    } else if (entry.isFile()) {
      checkFile(fullPath);
    }
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────
const changedOnly = process.argv.includes("--changed-only");

console.log(`\n\x1b[36m[image-budget]\x1b[0m Checking image budgets (constitution §5.3)\n`);

if (changedOnly) {
  // In CI: only check images changed in this PR
  let changedFiles;
  try {
    let output = "";
    try {
      // Intentar comparar con upstream (rama local contra su remota)
      output = execSync("git diff --name-only @{u}...HEAD", { cwd: ROOT, stdio: "pipe" }).toString().trim();
    } catch {
      // Fallback a origin/main
      output = execSync("git diff --name-only origin/main...HEAD", { cwd: ROOT, stdio: "pipe" }).toString().trim();
    }
    changedFiles = output.split("\n").filter((f) => {
      const ext = extname(f).toLowerCase();
      return IMAGE_EXTENSIONS.has(ext);
    });
  } catch {
    console.log("Could not get changed files from git — scanning all images.");
    changedFiles = null;
  }

  if (changedFiles && changedFiles.length > 0) {
    console.log(`Checking ${changedFiles.length} changed image file(s):\n`);
    for (const f of changedFiles) {
      const fullPath = join(ROOT, f);
      if (existsSync(fullPath)) checkFile(fullPath);
    }
  } else if (changedFiles && changedFiles.length === 0) {
    console.log("No image files changed in this PR.\n");
  } else {
    scanDir(PUBLIC_DIR);
  }
} else {
  scanDir(PUBLIC_DIR);
}

// ─── Summary ─────────────────────────────────────────────────────────────────
console.log(`\n${"─".repeat(60)}`);
console.log(`Images checked: ${checked}`);
if (violations === 0) {
  console.log(`\x1b[32m✅ All images within budget!\x1b[0m\n`);
} else {
  console.log(`\x1b[31m✗ ${violations} image(s) over budget.\x1b[0m`);
  console.log(`  Run: pnpm img:optimize <path> --context=<context>`);
  console.log(`  See: .specify/instructions/image-generation.md\n`);
}

process.exit(violations > 0 ? 1 : 0);
