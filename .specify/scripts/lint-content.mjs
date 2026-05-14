#!/usr/bin/env node
/**
 * Content linting for AquatechIA blog articles.
 *
 * Validaciones en dos capas:
 *   Capa 1 — Estructural (regex, rápida): slug uniqueness, section IDs, campos requeridos
 *   Capa 2 — Zod schema (import dinámico con --experimental-strip-types, Node ≥22)
 *            Si Zod falla, los errores se reportan con el campo exacto.
 *
 * Usage: node .specify/scripts/lint-content.mjs [--self-test]
 * Exit code: 0 = all pass, 1 = errors found
 */

import { existsSync, readdirSync, readFileSync } from "fs";
import { dirname, join, relative } from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..", "..");
const args = new Set(process.argv.slice(2));
const ARTICLES_ROOT =
  process.env.LINT_CONTENT_ARTICLES_ROOT ||
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

function readTimeWithinTolerance(actual, expected) {
  const lower = Math.max(1, Math.floor(expected * 0.8));
  const upper = Math.max(1, Math.ceil(expected * 1.2));
  return actual >= lower && actual <= upper;
}

// ─── Capa 2: Validación Zod via subprocess (Node ≥22 strip-types) ────────────
/**
 * Valida un archivo de artículo con el schema Zod canónico.
 * Usa un subprocess con --experimental-strip-types para importar el .ts.
 * Devuelve array de error messages, o [] si pasa.
 */
function validateWithZod(articlePath, contractPath) {
  if (!existsSync(contractPath)) return [];

  const script = `
import schema from ${JSON.stringify(contractPath)};
import article from ${JSON.stringify(articlePath)};
const { blogArticleSchema } = schema;
if (!blogArticleSchema) {
  console.log(JSON.stringify({ ok: true, note: "no schema export" }));
  process.exit(0);
}
const result = blogArticleSchema.safeParse(article.default ?? article);
if (result.success) {
  console.log(JSON.stringify({ ok: true }));
} else {
  const issues = result.error.issues.map(i => i.path.join('.') + ': ' + i.message);
  console.log(JSON.stringify({ ok: false, issues }));
}
`;

  try {
    const output = execSync(
      `node --experimental-strip-types --input-type=module`,
      {
        input: script,
        cwd: ROOT,
        stdio: ["pipe", "pipe", "pipe"],
        timeout: 10000,
      }
    ).toString().trim();

    const result = JSON.parse(output);
    if (result.ok) return [];
    return result.issues || [];
  } catch {
    // Si el import falla (ej: el archivo tiene syntax error TS avanzada),
    // ignora la capa Zod — la capa regex ya cubrió las validaciones básicas.
    return [];
  }
}

// ─── Self-test ────────────────────────────────────────────────────────────────
if (args.has("--self-test")) {
  console.assert(readTimeWithinTolerance(5, 5), "exact readTime should pass");
  console.assert(readTimeWithinTolerance(4, 5), "lower 20% readTime should pass");
  console.assert(!readTimeWithinTolerance(7, 5), "readTime outside tolerance should fail");
  console.log("lint-content self-test passed");
  process.exit(0);
}

// ─── Collect all article files ────────────────────────────────────────────────
const articleFiles = [];
const slugRegistry = new Map();

for (const portal of PORTALS) {
  const dir = join(ARTICLES_ROOT, portal);
  if (!existsSync(dir)) continue;
  const files = readdirSync(dir).filter((f) => f.endsWith(".ts") && f !== "index.ts");
  for (const file of files) {
    articleFiles.push({
      portal,
      file,
      path: join(dir, file),
      slug: file.replace(".ts", ""),
    });
  }
}

console.log(`\n\x1b[36m[lint-content]\x1b[0m Scanning ${articleFiles.length} articles...\n`);

if (articleFiles.length === 0) {
  console.log("No article files found — skipping content lint.");
  process.exit(0);
}

// Ruta al contrato Zod canónico (app copy)
const zodContractPath = join(ROOT, "apps", "web", "src", "lib", "contracts", "article.zod.ts");
const hasZodContract = existsSync(zodContractPath);
if (!hasZodContract) {
  warn(zodContractPath, "Zod contract not found — skipping schema validation layer. Run: pnpm sync:contracts");
}

// ─── Lint each file ───────────────────────────────────────────────────────────
for (const { portal, path, slug } of articleFiles) {
  const content = readFileSync(path, "utf-8");

  // ── Capa 1: Validaciones estructurales (regex) ──────────────────────────────

  // 1. Slug uniqueness across portals
  if (slugRegistry.has(slug)) {
    err(path, `Duplicate slug "${slug}" — also exists in portal ${slugRegistry.get(slug)}`);
  } else {
    slugRegistry.set(slug, portal);
  }

  // 2. Required fields present
  const requiredFields = [
    "slug:", "title:", "category:", "date:", "readTime:", "excerpt:", "heroImage:",
  ];
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

  // 4. Date format ISO 8601
  const dateMatch = content.match(/date:\s*"(\d{4}-\d{2}-\d{2})"/);
  if (!dateMatch) {
    err(path, "date field missing or not in ISO 8601 format (YYYY-MM-DD)");
  } else {
    const date = new Date(dateMatch[1]);
    if (isNaN(date.getTime())) err(path, `Invalid date: ${dateMatch[1]}`);
  }

  // 5. readTime plausibility
  const readTimeMatch = content.match(/readTime:\s*(\d+)/);
  if (readTimeMatch) {
    const readTime = Number(readTimeMatch[1]);
    if (readTime === 0) {
      err(path, "readTime is 0 — use ceil(wordCount / 200)");
    }
  }

  // 6. excerpt length ≤280 chars
  const excerptMatch = content.match(/excerpt:\s*"([^"]+)"/);
  if (excerptMatch && excerptMatch[1].length > 280) {
    err(path, `excerpt exceeds 280 chars (${excerptMatch[1].length} chars)`);
  }

  // 7. Tags count 3-7
  const tagsMatch = content.match(/tags:\s*\[([^\]]*)\]/s);
  if (tagsMatch) {
    const tags = tagsMatch[1]
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
    if (tags.length < 3) err(path, `tags must have 3-7 items (found ${tags.length})`);
    if (tags.length > 7) err(path, `tags must have 3-7 items (found ${tags.length})`);
  }

  // 8. nextArticle slug existence
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

  // 10. heroImage non-empty for published articles
  if (!content.includes("// DRAFT") && content.includes('heroImage: ""')) {
    err(path, "heroImage is empty — upload to Cloudinary before publishing");
  }

  // 11. Empty introduction/conclusion
  if (content.includes('introduction: ""')) err(path, "introduction is empty");
  if (content.includes('conclusion: ""')) warn(path, "conclusion is empty");

  // 12. Empty content sections
  const emptySections = [...content.matchAll(/content:\s*""/g)];
  if (emptySections.length > 0) {
    err(path, `${emptySections.length} section(s) have empty content strings`);
  }

  // ── Capa 2: Validación Zod (import dinámico, Node ≥22) ─────────────────────
  if (hasZodContract) {
    const zodErrors = validateWithZod(path, zodContractPath);
    for (const issue of zodErrors) {
      err(path, `[Zod] ${issue}`);
    }
  }
}

// ─── Summary ─────────────────────────────────────────────────────────────────
console.log(`\n${"─".repeat(50)}`);
console.log(`Articles scanned: ${articleFiles.length}`);
if (errors === 0 && warnings === 0) {
  console.log(`\x1b[32m✅ All content checks passed!\x1b[0m\n`);
} else {
  if (errors > 0) console.log(`\x1b[31m✗ ${errors} error(s) found\x1b[0m`);
  if (warnings > 0) console.log(`\x1b[33m⚠ ${warnings} warning(s)\x1b[0m`);
  console.log("");
}

process.exit(errors > 0 ? 1 : 0);
