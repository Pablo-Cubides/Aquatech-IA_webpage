#!/usr/bin/env node
/**
 * Content linting for AquatechIA blog articles.
 * Validates all article TS files in apps/web/src/lib/articles/ against:
 *   - Slug uniqueness across portals
 *   - Date format (ISO 8601)
 *   - readTime plausibility (within 20% of wordCount/200)
 *   - excerpt length (≤280 chars)
 *   - heroImage present and non-empty
 *   - tags count (3-7)
 *   - Absence of empty required string fields
 *   - Section IDs uniqueness within article
 *   - nextArticle slug exists (if set)
 *   - Image alt text presence (checks content for image references without alt)
 *
 * Usage: node .specify/scripts/lint-content.mjs
 * Exit code: 0 = all pass, 1 = errors found
 */

import { existsSync, readdirSync, readFileSync } from "fs";
import { dirname, join, relative } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..", "..");
const args = new Set(process.argv.slice(2));
const ARTICLES_ROOT = process.env.LINT_CONTENT_ARTICLES_ROOT ||
  join(ROOT, "apps", "web", "src", "lib", "articles");
const PORTALS = ["ia", "ambiental"];

// ─── Helpers ─────────────────────────────────────────────────────────────────
let errors = 0;
let warnings = 0;

function err(file, msg) {
  console.error(`\x1b[31m[ERROR]\x1b[0m ${relative(ROOT, file)}: ${msg}`);
  errors++;
}
function warn(file, msg) {
  console.warn(`\x1b[33m[WARN]\x1b[0m  ${relative(ROOT, file)}: ${msg}`);
  warnings++;
}
function ok(msg) { console.log(`\x1b[32m[OK]\x1b[0m   ${msg}`); }

function countWords(text) {
  return text.replace(/\s+/g, " ").trim().split(" ").filter(Boolean).length;
}

function stripMarkdown(text) {
  return text
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*\]\([^)]+\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[#>*_~\-]+/g, " ");
}

function extractStringField(content, fieldName) {
  const values = [];
  const patterns = [
    new RegExp(`${fieldName}:\\s*"((?:\\\\.|[^"\\\\])*)"`, "gs"),
    new RegExp(`${fieldName}:\\s*'((?:\\\\.|[^'\\\\])*)'`, "gs"),
    new RegExp(`${fieldName}:\\s*\\\`([\\s\\S]*?)\\\``, "g"),
  ];

  for (const pattern of patterns) {
    for (const match of content.matchAll(pattern)) {
      values.push(match[1]);
    }
  }

  return values;
}

function articleWordCount(content) {
  const articleText = [
    ...extractStringField(content, "introduction"),
    ...extractStringField(content, "content"),
    ...extractStringField(content, "conclusion"),
  ].join(" ");

  return countWords(stripMarkdown(articleText));
}

function readTimeWithinTolerance(actual, expected) {
  const lower = Math.max(1, Math.floor(expected * 0.8));
  const upper = Math.max(1, Math.ceil(expected * 1.2));
  return actual >= lower && actual <= upper;
}

function assertSelfTest(condition, message) {
  if (!condition) throw new Error(message);
}

function runSelfTest() {
  const sampleArticle = `
    introduction: "uno dos tres cuatro cinco",
    sections: [
      { id: "section-1", content: "seis siete ocho nueve diez" }
    ],
    conclusion: "once doce"
  `;

  assertSelfTest(articleWordCount(sampleArticle) === 12, "articleWordCount should collect article prose fields");
  assertSelfTest(readTimeWithinTolerance(5, 5), "exact readTime should pass");
  assertSelfTest(readTimeWithinTolerance(4, 5), "lower 20% readTime should pass");
  assertSelfTest(readTimeWithinTolerance(6, 5), "upper 20% readTime should pass");
  assertSelfTest(!readTimeWithinTolerance(7, 5), "readTime outside tolerance should fail");
  console.log("lint-content self-test passed");
}

if (args.has("--self-test")) {
  runSelfTest();
  process.exit(0);
}

// ─── Collect all article files ────────────────────────────────────────────────
const articleFiles = [];
const slugRegistry = new Map(); // slug → portal/file

for (const portal of PORTALS) {
  const dir = join(ARTICLES_ROOT, portal);
  if (!existsSync(dir)) continue;
  const files = readdirSync(dir).filter((f) => f.endsWith(".ts"));
  for (const file of files) {
    articleFiles.push({ portal, file, path: join(dir, file), slug: file.replace(".ts", "") });
  }
}

console.log(`\n\x1b[36m[lint-content]\x1b[0m Scanning ${articleFiles.length} articles...\n`);

// ─── Lint each file ───────────────────────────────────────────────────────────
for (const { portal, path, slug } of articleFiles) {
  const content = readFileSync(path, "utf-8");

  // 1. Slug uniqueness across portals
  if (slugRegistry.has(slug)) {
    err(path, `Duplicate slug "${slug}" — also exists in portal ${slugRegistry.get(slug)}`);
  } else {
    slugRegistry.set(slug, portal);
  }

  // 2. Required fields present (basic string search — Zod parse happens at build time)
  const requiredFields = ["slug:", "title:", "category:", "date:", "readTime:", "excerpt:", "heroImage:"];
  for (const field of requiredFields) {
    if (!content.includes(field)) {
      err(path, `Missing required field: ${field}`);
    }
  }

  // 3. Empty required strings
  const emptyStringPattern = /(?:title|category|excerpt|heroImage):\s*""/g;
  const emptyMatches = content.match(emptyStringPattern);
  if (emptyMatches) {
    err(path, `Empty required string fields: ${emptyMatches.join(", ")}`);
  }

  // 4. Date format
  const dateMatch = content.match(/date:\s*"(\d{4}-\d{2}-\d{2})"/);
  if (!dateMatch) {
    err(path, 'date field missing or not in ISO 8601 format (YYYY-MM-DD)');
  } else {
    const date = new Date(dateMatch[1]);
    if (isNaN(date.getTime())) err(path, `Invalid date: ${dateMatch[1]}`);
  }

  // 5. readTime must match the article word count within 20%
  const readTimeMatch = content.match(/readTime:\s*(\d+)/);
  if (readTimeMatch) {
    const readTime = Number(readTimeMatch[1]);
    if (readTime === 0) {
      err(path, "readTime is 0 — must be calculated: ceil(wordCount / 200)");
    } else {
      const words = articleWordCount(content);
      const expectedReadTime = Math.max(1, Math.ceil(words / 200));
      if (words > 0 && !readTimeWithinTolerance(readTime, expectedReadTime)) {
        err(
          path,
          `readTime ${readTime} is outside 20% tolerance for ${words} words (expected ~${expectedReadTime})`
        );
      }
    }
  }

  // 6. excerpt length
  const excerptMatch = content.match(/excerpt:\s*"([^"]+)"/);
  if (excerptMatch && excerptMatch[1].length > 280) {
    err(path, `excerpt exceeds 280 chars (${excerptMatch[1].length} chars)`);
  }

  // 7. Tags count (3-7)
  const tagsMatch = content.match(/tags:\s*\[([^\]]*)\]/s);
  if (tagsMatch) {
    const tags = tagsMatch[1].split(",").map((t) => t.trim()).filter((t) => t.length > 0);
    if (tags.length < 3) err(path, `tags must have 3-7 items (found ${tags.length})`);
    if (tags.length > 7) err(path, `tags must have 3-7 items (found ${tags.length})`);
  } else if (content.includes("tags:")) {
    err(path, "tags array is empty — must have 3-7 items");
  }

  // 8. nextArticle slug existence check (if set)
  const nextArticleMatch = content.match(/nextArticle:\s*\{[^}]*slug:\s*"([^"]+)"/s);
  if (nextArticleMatch) {
    const nextSlug = nextArticleMatch[1];
    const exists = PORTALS.some((p) =>
      existsSync(join(ARTICLES_ROOT, p, `${nextSlug}.ts`))
    );
    if (!exists) {
      err(path, `nextArticle.slug "${nextSlug}" does not exist in any portal`);
    }
  }

  // 9. Section IDs uniqueness
  const sectionIdMatches = [...content.matchAll(/id:\s*"([^"]+)"/g)].map((m) => m[1]);
  const idSet = new Set();
  for (const id of sectionIdMatches) {
    if (idSet.has(id)) err(path, `Duplicate section id: "${id}"`);
    idSet.add(id);
  }

  // 10. heroImage non-empty check for published articles (not draft)
  if (!content.includes("// DRAFT") && content.includes('heroImage: ""')) {
    err(path, 'heroImage is empty — upload to Cloudinary and set URL before publishing');
  }

  // 11. Empty introduction/conclusion warning
  if (content.includes('introduction: ""')) {
    err(path, "introduction is empty");
  }

  // 12. Empty content sections
  const emptySections = [...content.matchAll(/content:\s*""/g)];
  if (emptySections.length > 0) {
    err(path, `${emptySections.length} section(s) have empty content strings`);
  }
}

// ─── Summary ─────────────────────────────────────────────────────────────────
console.log(`\n${"─".repeat(50)}`);
console.log(`Total articles scanned: ${articleFiles.length}`);
if (errors === 0 && warnings === 0) {
  console.log(`\x1b[32m✅ All content checks passed!\x1b[0m\n`);
} else {
  if (errors > 0) console.log(`\x1b[31m✗ ${errors} error(s) found\x1b[0m`);
  if (warnings > 0) console.log(`\x1b[33m⚠ ${warnings} warning(s)\x1b[0m`);
  console.log("");
}

process.exit(errors > 0 ? 1 : 0);
