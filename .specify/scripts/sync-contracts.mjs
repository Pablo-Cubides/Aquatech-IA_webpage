#!/usr/bin/env node
/**
 * Sincroniza los contratos Zod canónicos desde docs/contracts/ hacia
 * apps/web/src/lib/contracts/, detectando drift silencioso.
 *
 * Uso:
 *   node .specify/scripts/sync-contracts.mjs          # sincroniza (modo escritura)
 *   node .specify/scripts/sync-contracts.mjs --check  # solo verifica, exit 1 si hay drift
 *   node .specify/scripts/sync-contracts.mjs --dry-run # muestra qué haría sin escribir
 *
 * Canónicos: docs/contracts/*.zod.ts  (source of truth)
 * Destino:   apps/web/src/lib/contracts/*.zod.ts
 *
 * Diferencias entre canónico y destino permitidas:
 *   - El destino puede importar { z } from "zod" en lugar de una ruta relativa
 *   - El canónico tiene un bloque de comentario "Canonical version" en la cabecera
 */

import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from "fs";
import { createHash } from "crypto";
import { join, basename, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..", "..");
const CANONICAL_DIR = join(ROOT, "docs", "contracts");
const TARGET_DIR = join(ROOT, "apps", "web", "src", "lib", "contracts");

const isCheck = process.argv.includes("--check");
const isDryRun = process.argv.includes("--dry-run");

let driftCount = 0;
let syncCount = 0;

function hash(content) {
  return createHash("sha256").update(content).digest("hex").slice(0, 12);
}

/**
 * Normaliza el contenido para comparación:
 * ignora diferencias en comentarios de cabecera y espacios en blanco trailing.
 */
function normalize(content) {
  return content
    .replace(/\r\n/g, "\n") // normalize CRLF → LF (Windows git autocrlf)
    .split("\n")
    .filter((line) => !line.trim().startsWith("* Canonical version:"))
    .filter((line) => !line.trim().startsWith("// Canonical version:"))
    .map((l) => l.trimEnd())
    .join("\n")
    .trim();
}

/**
 * Adapta el contenido canónico para el destino:
 * - Reemplaza imports relativos de zod por el package name
 * - Agrega nota de "app copy" en la cabecera
 */
function adaptForTarget(canonical, filename) {
  const note = `/**\n * App copy — DO NOT edit directly.\n * Canonical: docs/contracts/${filename}\n * Sync: node .specify/scripts/sync-contracts.mjs\n */\n`;
  const adapted = canonical
    .replace(/\r\n/g, "\n") // normalize CRLF → LF before stripping
    // Quita el bloque de comentario canónico existente si lo hay
    .replace(/^\/\*\*[\s\S]*?\*\/\n/, "")
    // Asegura el import correcto
    .replace(/from ["']\.\.\/.*?zod["']/g, 'from "zod"')
    .trim();
  return note + "\n" + adapted + "\n";
}

// ─── Verificar dirs ───────────────────────────────────────────────────────────
if (!existsSync(CANONICAL_DIR)) {
  console.error(`[ERROR] docs/contracts/ no existe en ${CANONICAL_DIR}`);
  process.exit(1);
}
if (!existsSync(TARGET_DIR)) {
  if (isCheck) {
    console.error(`[ERROR] apps/web/src/lib/contracts/ no existe — ejecuta sync primero`);
    process.exit(1);
  }
  mkdirSync(TARGET_DIR, { recursive: true });
  console.log(`[INFO] Creado directorio ${TARGET_DIR}`);
}

// ─── Sincronizar cada contrato .zod.ts ───────────────────────────────────────
const contracts = readdirSync(CANONICAL_DIR).filter((f) => f.endsWith(".zod.ts"));

if (contracts.length === 0) {
  console.log("[INFO] No hay contratos .zod.ts en docs/contracts/");
  process.exit(0);
}

console.log(`\n📋 Verificando ${contracts.length} contrato(s)...\n`);

for (const filename of contracts) {
  const canonicalPath = join(CANONICAL_DIR, filename);
  const targetPath = join(TARGET_DIR, filename);
  const canonicalContent = readFileSync(canonicalPath, "utf-8");

  if (!existsSync(targetPath)) {
    if (isCheck) {
      console.error(`  ❌ ${filename} — FALTA en target (docs → apps/web/src/lib/contracts/)`);
      driftCount++;
      continue;
    }
    const adapted = adaptForTarget(canonicalContent, filename);
    if (!isDryRun) writeFileSync(targetPath, adapted, "utf-8");
    console.log(`  ✅ ${filename} — creado en target ${isDryRun ? "(dry-run)" : ""}`);
    syncCount++;
    continue;
  }

  const targetContent = readFileSync(targetPath, "utf-8");
  const canonicalNorm = normalize(canonicalContent);
  const targetNorm = normalize(targetContent);

  // Compara sin la nota de cabecera de "app copy"
  const targetBody = targetNorm.replace(/^\/\*\*[\s\S]*?\*\/\n\n/, "").trim();
  const canonicalBody = canonicalNorm.replace(/^\/\*\*[\s\S]*?\*\/\n\n/, "").trim();

  if (canonicalBody === targetBody) {
    console.log(`  ✅ ${filename} — sincronizado (hash: ${hash(canonicalBody)})`);
    continue;
  }

  // Hay drift
  driftCount++;
  if (isCheck) {
    console.error(`  ❌ ${filename} — DRIFT detectado`);
    console.error(`     Canónico: ${hash(canonicalBody)} | Target: ${hash(targetBody)}`);
    console.error(`     Ejecuta: node .specify/scripts/sync-contracts.mjs`);
    continue;
  }

  const adapted = adaptForTarget(canonicalContent, filename);
  if (!isDryRun) writeFileSync(targetPath, adapted, "utf-8");
  console.log(
    `  🔄 ${filename} — sincronizado (había drift) ${isDryRun ? "(dry-run)" : ""}`
  );
  syncCount++;
}

// ─── Resumen ─────────────────────────────────────────────────────────────────
console.log(`\n${"─".repeat(50)}`);
if (isCheck) {
  if (driftCount === 0) {
    console.log(`✅ Todos los contratos están sincronizados.\n`);
    process.exit(0);
  } else {
    console.error(`❌ ${driftCount} contrato(s) con drift. Ejecuta: node .specify/scripts/sync-contracts.mjs\n`);
    process.exit(1);
  }
} else {
  console.log(
    `✅ Sync completo: ${syncCount} actualizado(s), ${driftCount} con drift corregido.\n`
  );
  process.exit(0);
}
