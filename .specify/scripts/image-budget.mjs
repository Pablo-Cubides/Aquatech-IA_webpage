#!/usr/bin/env node
/**
 * Image budget enforcement for CI (constitución §5.3).
 *
 * Context detection from file path:
 *   /autor/ → author (40KB) · /herramientas/ o /mapas/ → tool (120KB)
 *   "hero" en la ruta → hero (200KB) · /blog/ → inline (80KB)
 *   /icons/ o .svg → icon (10KB) · por defecto → inline (80KB)
 *
 * Modos (OPS-001):
 *   (sin flags)         Escanea todo apps/web/public. Sale 1 si algo supera su presupuesto.
 *   --changed-only      Solo imágenes cambiadas respecto a la base (ver --base).
 *   --base=<ref>        Base para --changed-only (p. ej. origin/main, HEAD~1). Sin ella usa
 *                       el upstream de la rama y, si no hay, origin/main.
 *   --baseline[=ruta]   TRINQUETE: la deuda conocida (ruta por defecto
 *                       .specify/image-budget-baseline.json) no bloquea; bloquea toda imagen
 *                       fuera de presupuesto que NO esté en la línea base o que haya CRECIDO.
 *   --update-baseline   Reescribe la línea base con el estado actual (se hace tras arreglar
 *                       imágenes, nunca para esconder una nueva). Siempre sale 0.
 *   --warn-only         Informa pero sale 0.
 *
 * Exit code: 0 = bien (o solo deuda conocida), 1 = incumplimientos que bloquean.
 */

import { execSync } from "child_process";
import {
  appendFileSync,
  existsSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from "fs";
import { dirname, extname, join, relative } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..", "..");
const PUBLIC_DIR = join(ROOT, "apps", "web", "public");
const DEFAULT_BASELINE = join(ROOT, ".specify", "image-budget-baseline.json");

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif"]);

// Constitution §5.3 budgets in bytes
const BUDGETS = {
  hero: 200 * 1024,
  inline: 80 * 1024,
  tool: 120 * 1024,
  author: 40 * 1024,
  icon: 10 * 1024,
};

// ─── Args ────────────────────────────────────────────────────────────────────
const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, ...v] = a.replace(/^--/, "").split("=");
    return [k, v.length ? v.join("=") : true];
  }),
);
const changedOnly = Boolean(args["changed-only"]);
const warnOnly = Boolean(args["warn-only"]);
const updateBaseline = Boolean(args["update-baseline"]);
const useBaseline = Boolean(args.baseline) || updateBaseline;
const baselinePath =
  typeof args.baseline === "string" ? join(ROOT, args.baseline) : DEFAULT_BASELINE;

// ─── Helpers ─────────────────────────────────────────────────────────────────
const violationList = [];
let checked = 0;

function formatBytes(b) {
  if (b < 1024) return `${b}B`;
  return `${(b / 1024).toFixed(1)}KB`;
}

function detectContext(filePath) {
  const p = filePath.toLowerCase().replace(/\\/g, "/");
  if (p.includes("/autor/")) return "author";
  if (p.includes("/herramientas/")) return "tool";
  if (p.includes("/mapas/")) return "tool";
  if (p.includes("hero")) return "hero";
  if (p.includes("/blog/")) return "inline";
  if (p.includes("/icons/") || p.includes(".svg")) return "icon";
  return "inline";
}

function checkFile(filePath) {
  const ext = extname(filePath).toLowerCase();
  if (!IMAGE_EXTENSIONS.has(ext)) return;

  const rel = relative(ROOT, filePath).replace(/\\/g, "/");
  const size = statSync(filePath).size;
  const context = detectContext(filePath);
  const budget = BUDGETS[context];
  checked++;
  if (size > budget) violationList.push({ rel, size, budget, context });
}

function scanDir(dir) {
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) scanDir(fullPath);
    else if (entry.isFile()) checkFile(fullPath);
  }
}

function changedImages() {
  const tries = args.base
    ? [`git diff --name-only --diff-filter=AM ${args.base}...HEAD`, `git diff --name-only --diff-filter=AM ${args.base} HEAD`]
    : ["git diff --name-only --diff-filter=AM @{u}...HEAD", "git diff --name-only --diff-filter=AM origin/main...HEAD"];
  for (const cmd of tries) {
    try {
      const out = execSync(cmd, { cwd: ROOT, stdio: "pipe" }).toString().trim();
      return out.split("\n").filter((f) => f && IMAGE_EXTENSIONS.has(extname(f).toLowerCase()));
    } catch {
      // probar la siguiente
    }
  }
  return null;
}

function summary(lines) {
  console.log(lines.join("\n"));
  if (process.env.GITHUB_STEP_SUMMARY) {
    appendFileSync(process.env.GITHUB_STEP_SUMMARY, lines.join("\n") + "\n");
  }
}

// ─── Main ────────────────────────────────────────────────────────────────────
console.log(`\n\x1b[36m[image-budget]\x1b[0m Checking image budgets (constitution §5.3)\n`);

if (changedOnly) {
  const files = changedImages();
  if (files === null) {
    // Mejor escanear todo que dejar pasar sin mirar: en CI una puerta ciega es peor que una lenta.
    console.log("No se pudo obtener la lista de cambios de git: se escanean todas las imágenes.");
    scanDir(PUBLIC_DIR);
  } else {
    console.log(files.length ? `Revisando ${files.length} imagen(es) cambiada(s)\n` : "Ninguna imagen cambiada.\n");
    for (const f of files) {
      const full = join(ROOT, f);
      if (existsSync(full)) checkFile(full);
    }
  }
} else {
  scanDir(PUBLIC_DIR);
}

for (const v of violationList) {
  console.error(
    `\x1b[31m[OVER BUDGET]\x1b[0m ${v.rel}\n  Context: ${v.context} | Size: ${formatBytes(v.size)} | Budget: ${formatBytes(v.budget)} | Over by: ${formatBytes(v.size - v.budget)}`,
  );
}

if (updateBaseline) {
  const files = Object.fromEntries(
    violationList.sort((a, b) => a.rel.localeCompare(b.rel)).map((v) => [v.rel, v.size]),
  );
  writeFileSync(
    baselinePath,
    JSON.stringify({ generated: new Date().toISOString().slice(0, 10), count: violationList.length, files }, null, 2) + "\n",
  );
  console.log(`\nLínea base escrita: ${violationList.length} imagen(es) sobre presupuesto → ${relative(ROOT, baselinePath)}`);
  process.exit(0);
}

let blocking = violationList;
let known = [];
let stale = [];
if (useBaseline) {
  const baseline = existsSync(baselinePath)
    ? JSON.parse(readFileSync(baselinePath, "utf8")).files ?? {}
    : {};
  blocking = violationList.filter((v) => !(v.rel in baseline) || v.size > baseline[v.rel]);
  known = violationList.filter((v) => !blocking.includes(v));
  if (!changedOnly) {
    const present = new Set(violationList.map((v) => v.rel));
    stale = Object.keys(baseline).filter((rel) => !present.has(rel));
  }
}

const lines = [
  `\n${"─".repeat(60)}`,
  `Imágenes revisadas: ${checked} · sobre presupuesto: ${violationList.length}`,
];
if (useBaseline) {
  lines.push(`Deuda conocida (línea base): ${known.length} · NUEVAS o más pesadas: ${blocking.length}`);
  if (stale.length) {
    lines.push(`La línea base tiene ${stale.length} entrada(s) ya resueltas o borradas: ejecuta --update-baseline para encoger la deuda.`);
  }
}
if (blocking.length === 0) {
  lines.push(violationList.length === 0 ? "✅ Todas las imágenes dentro de presupuesto." : "✅ Sin imágenes nuevas fuera de presupuesto (solo deuda conocida).");
} else {
  lines.push(`✗ ${blocking.length} imagen(es) bloquean.`, "  Optimizar: pnpm img:optimize <ruta> --context=hero|inline|tool|author");
  for (const v of blocking.slice(0, 30)) lines.push(`  - ${v.rel} (${formatBytes(v.size)} > ${formatBytes(v.budget)})`);
}
summary(lines);

process.exit(blocking.length > 0 && !warnOnly ? 1 : 0);
