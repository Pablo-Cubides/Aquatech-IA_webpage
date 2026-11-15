#!/usr/bin/env node
/**
 * Medición de JavaScript inicial por página (constitución §5.1: < 250 KB comprimidos).
 *
 * Para cada ruta pide el HTML a un servidor de producción ya levantado
 * (`pnpm --filter web build && pnpm --filter web exec next start --port 3100`),
 * extrae los <script src> y <link rel=preload as=script> del HTML inicial y suma
 * su tamaño COMPRIMIDO (gzip nivel 6, el que aplica `next start`). Los chunks que
 * se cargan después de hidratar (next/dynamic, import() en handlers) no cuentan:
 * son justo lo que se difiere.
 *
 * Uso:
 *   node .specify/scripts/bundle-size.mjs [--base=http://localhost:3100]
 *        [--budget=250] [--warn-only] [--json] [--paths=/,/ia,...]
 *
 * Salida: tabla KB por página y, con --json, una línea JSON para la bitácora.
 * Código de salida 1 si alguna página supera el presupuesto (salvo --warn-only).
 */

import { gzipSync } from "node:zlib";

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, "").split("=");
    return [k, v ?? true];
  }),
);

const BASE = String(args.base ?? "http://localhost:3100").replace(/\/$/, "");
const BUDGET_KB = Number(args.budget ?? 250);

const DEFAULT_PATHS = [
  "/",
  "/ia",
  "/ambiental",
  "/ia/blog/difusion-stable-diffusion",
  "/ambiental/blog/calculadora-irca-calidad-agua",
  "/ia/herramientas/como-funcionan-llm",
  "/ia/herramientas/visor-difusion",
  "/ia/herramientas/filtrado-ia",
  "/ia/herramientas/parametros-decodificacion",
  "/ia/herramientas/modelos-tendencia",
  "/ia/herramientas/papers-ia",
  "/ambiental/herramientas/visor-mapas-ambientales",
  "/ambiental/herramientas/normas-ambientales",
  "/ambiental/herramientas/generador-matrices",
  "/ambiental/herramientas/analisis-correlaciones",
  "/ambiental/herramientas/indice-calidad-agua",
  "/ambiental/herramientas/indice-calidad-aire",
];

const paths =
  typeof args.paths === "string" ? args.paths.split(",") : DEFAULT_PATHS;

const cache = new Map();

async function gzippedSize(url) {
  if (cache.has(url)) return cache.get(url);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  const bytes = gzipSync(Buffer.from(await res.arrayBuffer()), { level: 6 })
    .length;
  cache.set(url, bytes);
  return bytes;
}

function scriptsOf(html) {
  const urls = new Set();
  for (const m of html.matchAll(/<script\b[^>]*>/g)) {
    const tag = m[0];
    if (/\bnoModule\b|nomodule/i.test(tag)) continue;
    const src = tag.match(/\bsrc="([^"]+)"/);
    if (src) urls.add(src[1]);
  }
  for (const m of html.matchAll(/<link\b[^>]*>/g)) {
    const tag = m[0];
    if (/\bas="script"/.test(tag)) {
      const href = tag.match(/\bhref="([^"]+)"/);
      if (href) urls.add(href[1]);
    }
  }
  return [...urls];
}

const rows = [];
let over = 0;
for (const path of paths) {
  const res = await fetch(BASE + path);
  if (!res.ok) {
    console.error(`  ${path}: HTTP ${res.status}`);
    rows.push({ path, kb: null, scripts: 0 });
    continue;
  }
  const html = await res.text();
  const urls = scriptsOf(html);
  let total = 0;
  for (const u of urls) {
    total += await gzippedSize(new URL(u, BASE).toString());
  }
  const kb = Math.round((total / 1024) * 10) / 10;
  if (kb > BUDGET_KB) over++;
  rows.push({ path, kb, scripts: urls.length });
}

const width = Math.max(...rows.map((r) => r.path.length));
console.log(`JS inicial comprimido (gzip) por página — presupuesto ${BUDGET_KB} KB`);
for (const r of rows) {
  const flag = r.kb == null ? "ERROR" : r.kb > BUDGET_KB ? "SOBRE" : "ok";
  console.log(
    `${r.path.padEnd(width)}  ${String(r.kb ?? "-").padStart(7)} KB  (${r.scripts} scripts)  ${flag}`,
  );
}
if (args.json) {
  console.log(
    JSON.stringify({
      date: new Date().toISOString().slice(0, 10),
      budgetKb: BUDGET_KB,
      pages: Object.fromEntries(rows.map((r) => [r.path, r.kb])),
    }),
  );
}
if (over > 0) {
  console.error(`\n${over} página(s) por encima de ${BUDGET_KB} KB.`);
  if (!args["warn-only"]) process.exit(1);
}
