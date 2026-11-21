#!/usr/bin/env node
/**
 * Puerta de presupuesto de JS inicial por página (constitución §5.1: < 250 KB comprimidos).
 * OPS-001 la creó como medición manual; OPS-003 la convierte en puerta de CI BLOQUEANTE.
 *
 * Qué mide: para cada ruta de `.specify/bundle-budget.json`, pide el HTML a un servidor de
 * producción (`next start`), extrae los <script src> y <link rel=preload as=script> del HTML
 * inicial y suma su tamaño COMPRIMIDO (gzip nivel 6). Los chunks que se cargan después de
 * hidratar (next/dynamic, import() en manejadores) no cuentan: es justo lo que se difiere.
 *
 * Dos umbrales, los dos bloquean:
 *   1. Techo duro `ceilingKb` (250) por página. SIN excepciones: si una página necesita más,
 *      se cambia la §5.1 de la constitución, no se añade una lista de excepciones.
 *   2. Regresión: una página no puede superar su línea base + `regressionKb` (8).
 *
 * FALLA CERRADO: servidor que no arranca, ruta con HTTP != 200, HTML sin scripts, ruta sin línea
 * base o JSON vacío => código de salida 1 con mensaje. Nunca "0 páginas medidas, todo verde".
 *
 * Quién revisa la línea base: el coordinador, en cada integración. Toda subida de una base va en
 * un commit PROPIO con la página, el delta en KB y el porqué en el mensaje. Se sube con
 * `--update-baseline`; el diff de `.specify/bundle-budget.json` queda en el PR.
 *
 * Uso (tras `pnpm build`):
 *   node .specify/scripts/bundle-size.mjs --serve              # levanta `next start`, mide, lo apaga
 *   node .specify/scripts/bundle-size.mjs --base=http://localhost:3400   # contra un servidor ya levantado
 *   ... --update-baseline     reescribe las bases con lo medido (se niega si hay ERROR o techo roto)
 *   ... --json                añade una línea JSON con las medidas
 *   ... --paths=/,/ia         mide solo esas rutas (no usa la lista del JSON)
 *   ... --warn-only           solo informa (uso manual; NO usar en CI)
 *   ... --port=3410 --wait=90 puerto de --serve y segundos de espera a que el servidor responda
 */

import { spawn } from "node:child_process";
import { appendFileSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const CONFIG_PATH = path.resolve(ROOT, String(parseArgs().config ?? ".specify/bundle-budget.json"));

function parseArgs() {
  return Object.fromEntries(
    process.argv.slice(2).map((a) => {
      const [k, ...v] = a.replace(/^--/, "").split("=");
      return [k, v.length ? v.join("=") : true];
    }),
  );
}
const args = parseArgs();

function fail(message) {
  console.error(`\n[bundle-size] FALLO: ${message}`);
  process.exit(1);
}

let config;
try {
  config = JSON.parse(readFileSync(CONFIG_PATH, "utf8"));
} catch (error) {
  fail(`no se pudo leer ${path.relative(ROOT, CONFIG_PATH)}: ${error.message}`);
}
const CEILING_KB = Number(config.ceilingKb ?? 250);
const REGRESSION_KB = Number(config.regressionKb ?? 8);
const baseline = config.pages ?? {};

const paths =
  typeof args.paths === "string" ? args.paths.split(",").filter(Boolean) : Object.keys(baseline);
if (paths.length === 0) fail("la lista de páginas está vacía: una puerta sin páginas no comprueba nada.");

// Tope duro de duración: una puerta colgada bloquearía el job de CI hasta su timeout.
const MAX_SECONDS = Number(args.timeout ?? 600);
setTimeout(() => fail(`la medición superó ${MAX_SECONDS} s (servidor lento o colgado).`), MAX_SECONDS * 1000).unref();

// ─── Servidor ────────────────────────────────────────────────────────────────
let server = null;
const PORT = Number(args.port ?? 3410);
const BASE = String(args.serve ? `http://127.0.0.1:${PORT}` : (args.base ?? "http://localhost:3000")).replace(/\/$/, "");
const WAIT_SECONDS = Number(args.wait ?? 90);

function stopServer() {
  if (server && !server.killed) server.kill();
}
process.on("exit", stopServer);
for (const signal of ["SIGINT", "SIGTERM"]) process.on(signal, () => process.exit(130));

if (args.serve) {
  // Si ya hay algo escuchando en el puerto, mediríamos OTRO servidor (p. ej. uno de desarrollo
  // con otra compilación) y daría un verde falso: se aborta.
  const occupied = await fetch(`${BASE}/`, { signal: AbortSignal.timeout(2000) }).then(
    () => true,
    () => false,
  );
  if (occupied) fail(`el puerto ${PORT} ya está en uso: no se mide un servidor que no se levantó aquí (usa --port=OTRO).`);

  let nextBin;
  try {
    nextBin = createRequire(path.join(ROOT, "apps/web/package.json")).resolve("next/dist/bin/next");
  } catch (error) {
    fail(`no se encontró Next en apps/web (¿falta pnpm install?): ${error.message}`);
  }
  server = spawn(process.execPath, [nextBin, "start", "--port", String(PORT), "--hostname", "127.0.0.1"], {
    cwd: path.join(ROOT, "apps/web"),
    stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" },
  });
  let serverLog = "";
  server.stdout.on("data", (d) => (serverLog += d));
  server.stderr.on("data", (d) => (serverLog += d));
  let exited = null;
  server.on("exit", (code) => (exited = code ?? "señal"));

  const deadline = Date.now() + WAIT_SECONDS * 1000;
  let ready = false;
  while (Date.now() < deadline && exited === null) {
    try {
      const res = await fetch(`${BASE}/`, { signal: AbortSignal.timeout(3000) });
      if (res.ok) {
        ready = true;
        break;
      }
    } catch {
      // aún arrancando
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
  if (!ready) {
    console.error(serverLog.split("\n").slice(-25).join("\n"));
    fail(
      exited !== null
        ? `\`next start\` terminó con código ${exited} antes de responder (¿falta \`pnpm build\`?).`
        : `\`next start\` no respondió 200 en ${BASE}/ tras ${WAIT_SECONDS} s.`,
    );
  }
}

// ─── Medición ────────────────────────────────────────────────────────────────
const cache = new Map();

async function gzippedSize(url) {
  if (cache.has(url)) return cache.get(url);
  const res = await fetch(url, { signal: AbortSignal.timeout(30000) });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  const bytes = gzipSync(Buffer.from(await res.arrayBuffer()), { level: 6 }).length;
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

const round1 = (n) => Math.round(n * 10) / 10;
const rows = [];

for (const route of paths) {
  const row = { path: route, kb: null, base: baseline[route] ?? null, scripts: 0, status: "ERROR", note: "" };
  rows.push(row);
  try {
    const res = await fetch(BASE + route, { signal: AbortSignal.timeout(30000) });
    if (!res.ok) {
      row.note = `HTTP ${res.status}`;
      continue;
    }
    const urls = scriptsOf(await res.text());
    row.scripts = urls.length;
    if (urls.length === 0) {
      row.note = "HTML sin scripts: la medición no es válida";
      continue;
    }
    let total = 0;
    for (const u of urls) total += await gzippedSize(new URL(u, BASE).toString());
    row.kb = round1(total / 1024);
  } catch (error) {
    row.note = String(error.message ?? error).slice(0, 120);
    continue;
  }

  if (row.kb > CEILING_KB) {
    row.status = "SOBRE_TECHO";
    row.note = `supera el techo de ${CEILING_KB} KB`;
  } else if (row.base == null) {
    row.status = "SIN_BASE";
    row.note = "sin línea base: ejecuta --update-baseline y súbela en un commit propio";
  } else if (row.kb > row.base + REGRESSION_KB) {
    row.status = "REGRESION";
    row.note = `+${round1(row.kb - row.base)} KB sobre la base (máx. +${REGRESSION_KB})`;
  } else {
    row.status = "ok";
  }
}

// ─── Informe ─────────────────────────────────────────────────────────────────
const delta = (r) => (r.kb != null && r.base != null ? `${r.kb - r.base >= 0 ? "+" : ""}${round1(r.kb - r.base)}` : "–");
const width = Math.max(...rows.map((r) => r.path.length));
console.log(`JS inicial comprimido (gzip) por página — techo ${CEILING_KB} KB, regresión +${REGRESSION_KB} KB sobre la base`);
for (const r of rows) {
  console.log(
    `${r.path.padEnd(width)}  ${String(r.kb ?? "-").padStart(6)} KB  base ${String(r.base ?? "-").padStart(6)}  Δ ${delta(r).padStart(5)}  (${r.scripts} scripts)  ${r.status}${r.note ? "  " + r.note : ""}`,
  );
}

const bad = rows.filter((r) => r.status !== "ok");

if (process.env.GITHUB_STEP_SUMMARY) {
  const lines = [
    "### Presupuesto de JS inicial (gzip)",
    "",
    `Techo ${CEILING_KB} KB por página · regresión máx. +${REGRESSION_KB} KB sobre la línea base · ${rows.length} páginas medidas`,
    "",
    "| Página | KB | Base | Δ | Estado |",
    "|---|---:|---:|---:|---|",
    ...rows.map((r) => `| \`${r.path}\` | ${r.kb ?? "–"} | ${r.base ?? "–"} | ${delta(r)} | ${r.status === "ok" ? "✅ ok" : `❌ ${r.status} ${r.note}`} |`),
    "",
    bad.length
      ? `**${bad.length} página(s) fuera de presupuesto.** Si la subida es deliberada: \`node .specify/scripts/bundle-size.mjs --serve --update-baseline\` y súbela en un commit propio (página, delta y porqué en el mensaje).`
      : "Todas las páginas dentro de presupuesto.",
  ];
  appendFileSync(process.env.GITHUB_STEP_SUMMARY, lines.join("\n") + "\n");
}

if (args.json) {
  console.log(
    JSON.stringify({
      date: new Date().toISOString().slice(0, 10),
      ceilingKb: CEILING_KB,
      regressionKb: REGRESSION_KB,
      pages: Object.fromEntries(rows.map((r) => [r.path, r.kb])),
    }),
  );
}

if (args["update-baseline"]) {
  const unusable = rows.filter((r) => r.status === "ERROR" || r.status === "SOBRE_TECHO");
  if (unusable.length > 0) {
    fail(`no se reescribe la línea base: ${unusable.map((r) => `${r.path} (${r.status})`).join(", ")}.`);
  }
  if (typeof args.paths === "string") fail("--update-baseline no se combina con --paths: mediría solo una parte.");
  const next = {
    ...config,
    generated: new Date().toISOString().slice(0, 10),
    pages: Object.fromEntries(rows.map((r) => [r.path, r.kb])),
  };
  writeFileSync(CONFIG_PATH, JSON.stringify(next, null, 2) + "\n", "utf8");
  console.log(`\nLínea base escrita en ${path.relative(ROOT, CONFIG_PATH)} (${rows.length} páginas).`);
  console.log("Si alguna base SUBIÓ: commit propio con página, delta y porqué en el mensaje (revisa el coordinador).");
  process.exit(0);
}

if (bad.length > 0) {
  console.error(`\n${bad.length} página(s) fuera de presupuesto o sin medir.`);
  if (!args["warn-only"]) process.exit(1);
}

// Salida EXPLÍCITA: con --serve el servidor hijo y sus tuberías mantienen vivo el bucle de eventos
// y el proceso no terminaría nunca (colgaría el job de CI hasta su timeout). `exit` apaga el servidor.
process.exit(0);
