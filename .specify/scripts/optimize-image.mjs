#!/usr/bin/env node
/**
 * Image optimization pipeline for AquatechIA.
 * Generates AVIF + WebP + JPEG variants and enforces size budgets.
 *
 * Usage:
 *   node .specify/scripts/optimize-image.mjs <input-path> [options]
 *
 * Options:
 *   --context=<hero|inline|tool|author|icon>  Image context (determines budget)
 *   --cloudinary                               Print Cloudinary upload instructions
 *   --output=<dir>                             Output directory (default: same as input)
 *   --dry-run                                  Show what would happen without writing files
 *
 * Examples:
 *   node .specify/scripts/optimize-image.mjs ./tmp/hero.jpg --context=hero
 *   node .specify/scripts/optimize-image.mjs ./tmp/hero.jpg --context=hero --cloudinary
 *   node .specify/scripts/optimize-image.mjs ./tmp/tool-screenshot.png --context=tool --output=./apps/web/public/images/portal-ia/herramientas/visor-difusion/
 */

import { existsSync, mkdirSync, statSync, writeFileSync } from "fs";
import { basename, dirname, extname, join, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ─── Budget definitions (constitution §5.3) ─────────────────────────────────
const BUDGETS = {
  hero:   200 * 1024,  // 200KB
  inline:  80 * 1024,  //  80KB
  tool:   120 * 1024,  // 120KB
  author:  40 * 1024,  //  40KB
  icon:    10 * 1024,  //  10KB
};

const WIDTHS = {
  hero:   1280,
  inline:  800,
  tool:    900,
  author:  200,
  icon:     64,
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
function log(msg)     { console.log(`\x1b[36m[img-optimize]\x1b[0m ${msg}`); }
function success(msg) { console.log(`\x1b[32m✓\x1b[0m ${msg}`); }
function warn(msg)    { console.warn(`\x1b[33m⚠\x1b[0m  ${msg}`); }
function error(msg)   { console.error(`\x1b[31m✗\x1b[0m ${msg}`); process.exit(1); }

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)}MB`;
}

function checkBudget(size, budget, context, format) {
  const over = size > budget;
  const msg = `${format}: ${formatBytes(size)} / budget: ${formatBytes(budget)}`;
  if (over) {
    warn(`OVER BUDGET — ${msg}`);
    return false;
  }
  success(`Within budget — ${msg}`);
  return true;
}

// ─── Parse args ──────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
if (args.length === 0) {
  error("Usage: node optimize-image.mjs <input-path> [--context=<hero|inline|tool|author|icon>] [--cloudinary] [--output=<dir>] [--dry-run]");
}

const inputPath = resolve(args[0]);
if (!existsSync(inputPath)) error(`Input file not found: ${inputPath}`);

const contextArg = args.find((a) => a.startsWith("--context="));
const context = contextArg ? contextArg.split("=")[1] : "inline";
if (!BUDGETS[context]) error(`Unknown context "${context}". Valid: ${Object.keys(BUDGETS).join(", ")}`);

const cloudinary = args.includes("--cloudinary");
const dryRun = args.includes("--dry-run");

const outputArg = args.find((a) => a.startsWith("--output="));
const outputDir = outputArg ? resolve(outputArg.split("=")[1]) : dirname(inputPath);

const baseName = basename(inputPath, extname(inputPath));
const budget = BUDGETS[context];

// ─── Process ─────────────────────────────────────────────────────────────────

log(`Input:   ${inputPath}`);
log(`Context: ${context} (budget: ${formatBytes(budget)})`);
log(`Output:  ${outputDir}`);
if (dryRun) log("DRY RUN — no files will be written");

// Try to load Sharp (installed as dev dependency)
let sharp;
try {
  const { default: s } = await import("sharp");
  sharp = s;
} catch {
  error("Sharp not available. Run: pnpm install (sharp is a devDependency in root package.json)");
}

if (!existsSync(outputDir) && !dryRun) {
  mkdirSync(outputDir, { recursive: true });
}

let allWithinBudget = true;

const maxWidth = WIDTHS[context];
const getPipeline = () => {
  let p = sharp(inputPath);
  if (maxWidth) {
    p = p.resize(maxWidth, null, { withoutEnlargement: true });
  }
  return p;
};

// ─── Generate AVIF ───────────────────────────────────────────────────────────
const avifPath = join(outputDir, `${baseName}.avif`);
log(`Generating AVIF...`);

if (!dryRun) {
  await getPipeline()
    .avif({ quality: 80, effort: 6 })
    .toFile(avifPath);

  const avifSize = statSync(avifPath).size;
  if (!checkBudget(avifSize, budget, context, "AVIF")) allWithinBudget = false;
} else {
  log(`[dry-run] Would write: ${avifPath}`);
}

// ─── Generate WebP ───────────────────────────────────────────────────────────
const webpPath = join(outputDir, `${baseName}.webp`);
log(`Generating WebP...`);

if (!dryRun) {
  await getPipeline()
    .webp({ quality: 82, effort: 5 })
    .toFile(webpPath);

  const webpSize = statSync(webpPath).size;
  if (!checkBudget(webpSize, budget, context, "WebP")) allWithinBudget = false;
} else {
  log(`[dry-run] Would write: ${webpPath}`);
}

// ─── Generate JPEG fallback ───────────────────────────────────────────────────
const jpegPath = join(outputDir, `${baseName}.jpg`);
log(`Generating JPEG fallback...`);

if (!dryRun) {
  await getPipeline()
    .jpeg({ quality: 85, progressive: true, mozjpeg: true })
    .toFile(jpegPath);

  const jpegSize = statSync(jpegPath).size;
  // JPEG gets 1.5x budget allowance as it's the last resort format
  if (!checkBudget(jpegSize, budget * 1.5, context, "JPEG")) allWithinBudget = false;
} else {
  log(`[dry-run] Would write: ${jpegPath}`);
}

// ─── Summary ─────────────────────────────────────────────────────────────────
console.log("");
if (!allWithinBudget) {
  console.log(`\x1b[33m⚠️  Some variants exceed the ${context} budget.\x1b[0m`);
  console.log("   Try reducing source image dimensions before optimizing.");
  console.log("   Max recommended source size for this context:");
  const dims = { hero: "1280×720", inline: "800×500", tool: "900×600", author: "200×200", icon: "64×64" };
  console.log(`   ${dims[context] || "check source dimensions"}`);
  process.exitCode = 1;
} else {
  console.log(`\x1b[32m✅ All variants within budget!\x1b[0m`);
}

// ─── Cloudinary instructions ──────────────────────────────────────────────────
if (cloudinary && !dryRun) {
  const assetId = baseName;
  console.log(`
\x1b[36m📦 Cloudinary upload instructions:\x1b[0m

  1. Upload the AVIF file to Cloudinary:
     File: ${avifPath}
     Folder: aquatechIA/[portal]/[context]/
     Public ID: ${assetId}

  2. Use this URL pattern in the article's heroImage or image field:
     https://res.cloudinary.com/aquatechIA/image/upload/q_auto,f_auto/[folder]/${assetId}

  3. Cloudinary auto-selects format (f_auto) and quality (q_auto) per browser.
     You only need to upload the AVIF — Cloudinary serves WebP/JPEG automatically.

  4. If AI-generated, create the manifest file:
     File: ${join(outputDir, assetId + ".image-manifest.json")}
     See: .specify/instructions/image-generation.md §AI-Generated Images
`);
}
