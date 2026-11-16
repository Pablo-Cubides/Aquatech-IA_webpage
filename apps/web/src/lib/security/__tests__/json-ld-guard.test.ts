/**
 * Falla si algún bloque de JSON-LD del sitio se serializa sin safeJsonLd (SEC-002).
 * Encuentra los sitios por sí solo: no hay lista que envejezca.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, resolve, relative } from "node:path";
import { describe, expect, it } from "vitest";

const srcRoot = resolve(__dirname, "../../..");
const SKIP = new Set(["node_modules", ".next", ".turbo"]);

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    if (SKIP.has(entry)) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (/\.(tsx|ts)$/.test(entry) && !/\.test\.tsx?$/.test(entry)) out.push(full);
  }
  return out;
}

const files = walk(srcRoot).filter((f) => !f.endsWith("safe-json-ld.ts"));
const SINK = /dangerouslySetInnerHTML=\{\{[\s\S]{0,400}?\}\}/g;
const LD_SCRIPT = /application\/ld\+json[\s\S]{0,300}?dangerouslySetInnerHTML=\{\{[\s\S]{0,400}?\}\}/g;

describe("guarda de JSON-LD", () => {
  it("ningún dangerouslySetInnerHTML serializa con JSON.stringify directo", () => {
    const offenders = files.filter((f) =>
      (readFileSync(f, "utf8").match(SINK) ?? []).some((m) => m.includes("JSON.stringify(")),
    );
    expect(offenders.map((f) => relative(srcRoot, f))).toEqual([]);
  });

  it("todo <script type=ld+json> usa safeJsonLd(", () => {
    const offenders = files.filter((f) =>
      (readFileSync(f, "utf8").match(LD_SCRIPT) ?? []).some((m) => !m.includes("safeJsonLd(")),
    );
    expect(offenders.map((f) => relative(srcRoot, f))).toEqual([]);
  });

  it("encuentra los bloques JSON-LD del sitio (la guarda no está vacía)", () => {
    const total = files.reduce((n, f) => n + (readFileSync(f, "utf8").match(LD_SCRIPT) ?? []).length, 0);
    expect(total).toBeGreaterThan(10);
  });

  it("control positivo: detecta el patrón vulnerable", () => {
    const bad = `<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(x) }} />`;
    expect((bad.match(SINK) ?? []).some((m) => m.includes("JSON.stringify("))).toBe(true);
    expect(bad.match(LD_SCRIPT)?.[0].includes("safeJsonLd(")).toBe(false);
  });
});
