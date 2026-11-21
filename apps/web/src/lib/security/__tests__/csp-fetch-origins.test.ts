import { describe, expect, it } from "vitest";
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
// @ts-expect-error: next.config.mjs no tiene tipos
import nextConfig from "../../../../next.config.mjs";

/**
 * SEC-005a: el código de CLIENTE que llama a un origen externo debe estar en `connect-src`; si no, el
 * navegador lo bloquea en producción sin que ningún otro test lo note. Pasó con GBIF: SEC-003b quitó
 * `api.gbif.org` de la CSP por "destino sin uso" y `lib/gbif.ts` lo llamaba directo desde el navegador.
 *
 * La política es que los terceros pasan por un proxy nuestro (/api/...) y `connect-src` queda en
 * 'self' + GA + vitals. Esta prueba falla si algo vuelve a llamar directo a un origen no permitido.
 */

type Rule = { source: string; headers: { key: string; value: string }[] };

async function connectSrc(): Promise<string[]> {
  const rules: Rule[] = await nextConfig.headers();
  const csp = rules.flatMap((rule) => rule.headers).find((h) => h.key === "Content-Security-Policy")?.value ?? "";
  const directive = csp.split(";").map((d) => d.trim()).find((d) => d.startsWith("connect-src"));
  return (directive ?? "").split(/\s+/).slice(1);
}

/** Orígenes absolutos que un archivo de cliente usa en una llamada de red. */
export function absoluteNetworkOrigins(source: string): string[] {
  const origins = new Set<string>();
  const code = source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");

  // fetch("https://x/..."), new URL("https://x/..."), sendBeacon, WebSocket, EventSource
  const direct = /(?:\bfetch|new URL|sendBeacon|new WebSocket|new EventSource)\(\s*[`'"]((?:https?|wss?):\/\/[^'"`/\s$]+)/g;
  for (const m of code.matchAll(direct)) origins.add(m[1]);

  // const BASE_URL = 'https://x/v1' (y similares), usada luego en un fetch del mismo archivo
  if (/\bfetch\(|new URL\(|sendBeacon\(/.test(code)) {
    const constant =
      /\b(?:const|let|var)\s+[A-Za-z_]*(?:URL|BASE|ENDPOINT|API|HOST)[A-Za-z_]*\s*(?::\s*string)?\s*=\s*[`'"]((?:https?|wss?):\/\/[^'"`/\s$]+)/g;
    for (const m of code.matchAll(constant)) origins.add(m[1]);
  }
  return [...origins];
}

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) {
      if (["node_modules", "__tests__", ".next"].includes(name)) continue;
      // Rutas de API y utilidades de servidor: corren en el servidor, no sujetas a connect-src.
      if (full.split(path.sep).slice(-2).join("/") === "app/api") continue;
      walk(full, out);
    } else if (/\.(ts|tsx)$/.test(name) && !/\.test\./.test(name)) {
      out.push(full);
    }
  }
  return out;
}

const isAllowed = (origin: string, allowed: string[]) =>
  allowed.some((entry) => entry === origin || (entry.includes("*") && new RegExp(`^${entry.replace(/[.]/g, "\\.").replace("*", "[^.]+")}$`).test(origin)));

describe("connect-src cubre todo lo que el cliente llama directamente", () => {
  it("control positivo: el detector encuentra el patrón que rompió GBIF", () => {
    const old = `const BASE_URL = 'https://api.gbif.org/v1';\nexport async function f(){ return fetch(\`\${BASE_URL}/species/1\`); }`;
    expect(absoluteNetworkOrigins(old)).toEqual(["https://api.gbif.org"]);
    expect(absoluteNetworkOrigins(`fetch("https://example.test/x")`)).toEqual(["https://example.test"]);
    expect(absoluteNetworkOrigins(`fetch("/api/gbif/search")`)).toEqual([]);
    expect(absoluteNetworkOrigins(`<a href="https://arxiv.org/abs/1">x</a>`)).toEqual([]);
  });

  it("control positivo: recorre el código cliente real", () => {
    const files = walk(path.join(process.cwd(), "src"));
    expect(files.length).toBeGreaterThan(200);
    expect(files.some((f) => /lib[\\/]gbif\.ts$/.test(f))).toBe(true);
  });

  it("ningún archivo de cliente llama a un origen externo que no esté en connect-src", async () => {
    const allowed = await connectSrc();
    expect(allowed).toContain("'self'");

    const offenders: string[] = [];
    for (const file of walk(path.join(process.cwd(), "src"))) {
      const source = readFileSync(file, "utf8");
      // Código que lee secretos del servidor (process.env sin NEXT_PUBLIC) no corre en el navegador.
      if (/process\.env\.(?!NEXT_PUBLIC_|NODE_ENV)/.test(source)) continue;
      for (const origin of absoluteNetworkOrigins(source)) {
        if (!isAllowed(origin, allowed)) offenders.push(`${path.relative(process.cwd(), file)} -> ${origin}`);
      }
    }
    expect(offenders, "llamadas directas del cliente bloqueadas por la CSP: usa un proxy /api/... (ver SEC-005a)").toEqual([]);
  });
});
