/**
 * Aislamiento entre portales (constitución §2.2, ADR-0014, ARQ-003/ARQ-005).
 *
 * Tres comprobaciones:
 *  1. Ningún archivo de `(portals)/ia` importa de `(portals)/ambiental`, ni al revés, ni por alias
 *     ni por ruta relativa ni por `export ... from`.
 *  2. tsconfig.json tiene UNA regla de alias (`@/*` → `./src/*`). Antes `@/components/*` y
 *     `@/lib/*` caían a los `src/` de 5 herramientas: un `@/lib/x` podía resolver a código de una
 *     herramienta de OTRO portal sin que ningún grep del cruce lo viera.
 *  3. El código compartido (`src/lib`, `src/components`, `src/app/api`) solo importa de un portal lo
 *     que ya importaba el 2026-11-15 (trinquete: la lista solo puede disminuir).
 */
import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const WEB_ROOT = path.resolve(__dirname, "../../..");
const SRC = path.join(WEB_ROOT, "src");
const EXT = ["", ".ts", ".tsx", ".js", ".jsx", ".mjs", "/index.ts", "/index.tsx", "/index.js"];

const norm = (p: string) => p.split(path.sep).join("/");

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === ".next") continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (/\.(tsx?|jsx?|mjs)$/.test(entry.name)) out.push(norm(full));
  }
  return out;
}

function resolveFile(base: string): string | null {
  for (const ext of EXT) {
    const candidate = base + ext;
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) return norm(candidate);
  }
  return null;
}

const IMPORT_RE = /(?:from\s*|import\s*\(\s*|import\s+|require\(\s*)["']([^"']+)["']/g;

/** Destinos locales (dentro de src) que importa un archivo. */
function localImports(file: string): string[] {
  const text = fs.readFileSync(file, "utf8");
  const targets: string[] = [];
  for (const m of text.matchAll(IMPORT_RE)) {
    const spec = m[1];
    let base: string | null = null;
    if (spec.startsWith(".")) base = path.resolve(path.dirname(file), spec);
    else if (spec.startsWith("@/")) base = path.join(SRC, spec.slice(2));
    if (!base) continue;
    const resolved = resolveFile(base);
    if (resolved) targets.push(resolved);
  }
  return targets;
}

const portalOf = (file: string) => file.match(/\/src\/app\/\(portals\)\/(ia|ambiental)\//)?.[1] ?? null;
const rel = (file: string) => norm(path.relative(SRC, file));
const files = walk(SRC);

describe("aislamiento entre portales", () => {
  it("ningún archivo de un portal importa del otro", () => {
    const violations: string[] = [];
    for (const file of files) {
      const own = portalOf(file);
      if (!own) continue;
      for (const target of localImports(file)) {
        const other = portalOf(target);
        if (other && other !== own) violations.push(`${rel(file)} → ${rel(target)}`);
      }
    }
    expect(violations).toEqual([]);
  });

  it("tsconfig.json tiene un solo alias, sin fallbacks a carpetas de herramientas", () => {
    const tsconfig = fs.readFileSync(path.join(WEB_ROOT, "tsconfig.json"), "utf8");
    const paths = JSON.parse(tsconfig).compilerOptions.paths as Record<string, string[]>;
    expect(paths).toEqual({ "@/*": ["./src/*"] });
  });

  it("el código compartido solo importa de un portal lo que ya importaba (trinquete)", () => {
    // archivo compartido → destino bajo (portals). Ver ARQ-003, hallazgo (b). Solo puede disminuir.
    const KNOWN = new Set<string>([
      "app/admin/tools/notes/page.tsx → app/(portals)/ia/(marketing)/autor/herramientas/consulta-nota/UploadNotes.tsx",
      "app/admin/tools/regulations/page.tsx → app/(portals)/ambiental/(marketing)/herramientas/normas-ambientales/src/components/RegulatorySourcesAdmin.tsx",
      "app/admin/tools/maps/page.tsx → app/(portals)/ambiental/(marketing)/herramientas/visor-mapas-ambientales/src/components/UploadWizard.tsx",
      "app/api/aqi-calculator/route.ts → app/(portals)/ambiental/(marketing)/herramientas/indice-calidad-aire/types/index.ts",
      "app/api/aqi-calculator/route.ts → app/(portals)/ambiental/(marketing)/herramientas/indice-calidad-aire/utils/calculate-aqi.ts",
      "app/api/aqi-calculator/route.ts → app/(portals)/ambiental/(marketing)/herramientas/indice-calidad-aire/utils/calculate-who.ts",
      "app/api/aqi-calculator/route.ts → app/(portals)/ambiental/(marketing)/herramientas/indice-calidad-aire/data/index-profiles.ts",
      "app/api/aqi-stations/route.ts → app/(portals)/ambiental/(marketing)/herramientas/indice-calidad-aire/lib/openaq-client.ts",
      "app/api/arxiv-papers/route.ts → app/(portals)/ia/(marketing)/herramientas/papers-ia/types/arxiv.ts",
      "lib/firms.ts → app/(portals)/ambiental/(marketing)/herramientas/visor-mapas-ambientales/src/types/index.ts",
      "lib/usgs.ts → app/(portals)/ambiental/(marketing)/herramientas/visor-mapas-ambientales/src/types/index.ts",
    ]);
    const isShared = (file: string) => !portalOf(file) && !file.includes("/__tests__/") && !/\.test\.tsx?$/.test(file);
    const found: string[] = [];
    for (const file of files) {
      if (!isShared(file)) continue;
      for (const target of localImports(file)) {
        if (portalOf(target)) found.push(`${rel(file)} → ${rel(target)}`);
      }
    }
    const nuevas = found.filter((f) => !KNOWN.has(f));
    expect(nuevas, "importaciones nuevas de código compartido hacia un portal").toEqual([]);
    const resueltas = [...KNOWN].filter((k) => !found.includes(k));
    expect(resueltas, "ya no existen: quítalas de KNOWN").toEqual([]);
  });
});
