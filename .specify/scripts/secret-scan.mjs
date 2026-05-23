#!/usr/bin/env node
/**
 * Secret scan for staged files (cross-platform, replaces bash grep in lefthook).
 * Runs as pre-commit hook via lefthook.yml.
 *
 * Detects patterns like: password = "[redacted]", api_key: '[redacted]'
 * Exit code: 0 = clean, 1 = potential secret found
 */

import { execSync } from "child_process";
import { readFileSync, existsSync } from "fs";

const EXTENSIONS = /\.(ts|tsx|js|mjs|json)$/;
const SECRET_PATTERN =
  /(password|secret|api_key|private_key)\s*[:=]\s*['"][^'"]{8,}['"]/i;

// Get staged files
let staged;
try {
  staged = execSync("git diff --cached --name-only --diff-filter=ACM", {
    encoding: "utf-8",
  })
    .trim()
    .split("\n")
    .filter((f) => {
      if (!f || !EXTENSIONS.test(f) || !existsSync(f)) return false;
      if (f.includes("__tests__") || f.includes("__mocks__")) return false;
      if (f.includes(".test.") || f.includes(".spec.")) return false;
      return true;
    });
} catch {
  process.exit(0); // git not available or no staged files
}

if (staged.length === 0) process.exit(0);

let found = false;
for (const file of staged) {
  try {
    const content = readFileSync(file, "utf-8");
    const lines = content.split("\n");
    for (let i = 0; i < lines.length; i++) {
      const trimmed = lines[i].trim();
      // Skip comment lines
      if (trimmed.startsWith("//") || trimmed.startsWith("*") || trimmed.startsWith("#")) continue;
      if (SECRET_PATTERN.test(lines[i])) {
        console.error(
          `❌ Potential hardcoded secret in ${file}:${i + 1}: ${lines[i].trim().slice(0, 80)}`
        );
        found = true;
      }
    }
  } catch {
    // skip unreadable files
  }
}

if (found) {
  console.error(
    "\n❌ Move secrets to .env and add to .gitignore before committing."
  );
  process.exit(1);
}

console.log(`✓ Secret scan passed (${staged.length} file(s) checked)`);
process.exit(0);
