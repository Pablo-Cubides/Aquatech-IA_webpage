import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

/**
 * SEC-006: (1) toda llamada a un tercero se identifica con la URL del sitio (nunca un correo),
 * (2) un 429 del proveedor deja en los registros lo necesario para distinguir "nos limita por IP" de
 * "nos limita por identificarnos mal", y (3) esos avisos SÍ salen en producción.
 */
vi.mock("@/lib/logger", () => ({ logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() } }));

import { UPSTREAM_USER_AGENT, fetchUpstreamJson, upstreamHeaders } from "../public-proxy";

const fetchMock = vi.fn();
const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubGlobal("fetch", fetchMock);
});
afterEach(() => vi.unstubAllGlobals());

describe("User-Agent de las llamadas salientes", () => {
  it("es la URL del sitio, sin correo ni datos personales", () => {
    expect(UPSTREAM_USER_AGENT).toBe("AquatechIA/1.0 (+https://aquatechia.com)");
    expect(UPSTREAM_USER_AGENT).not.toMatch(/@/);
  });

  it("fetchUpstreamJson lo envía por defecto aunque la ruta no declare cabeceras", async () => {
    fetchMock.mockResolvedValue(new Response("{}", { status: 200 }));
    await fetchUpstreamJson("t", "https://example.org/x", { timeoutMs: 1000 });
    expect(fetchMock.mock.calls[0][1].headers["User-Agent"]).toBe(UPSTREAM_USER_AGENT);
  });

  it("conserva las cabeceras de la ruta y una ruta puede sobrescribirlo (sin duplicados por mayúsculas)", () => {
    const headers = upstreamHeaders({ Accept: "application/json", "user-agent": "otro/1.0" });
    expect(headers).toEqual({ Accept: "application/json", "user-agent": "otro/1.0" });
  });

  it("ninguna ruta ni módulo de servidor llama a un tercero con otro identificador", () => {
    const root = path.resolve(__dirname, "../../..");
    const files: string[] = [];
    const walk = (dir: string) => {
      for (const entry of readdirSync(dir)) {
        const full = path.join(dir, entry);
        if (statSync(full).isDirectory()) {
          if (entry !== "__tests__" && entry !== "node_modules") walk(full);
        } else if (/\.ts$/.test(entry) && !/\.test\.ts$/.test(entry)) files.push(full);
      }
    };
    walk(path.join(root, "app", "api"));
    walk(path.join(root, "lib", "security"));

    const offenders: string[] = [];
    for (const file of files) {
      const source = readFileSync(file, "utf8");
      // Un User-Agent escrito a mano es el síntoma: debe venir de UPSTREAM_USER_AGENT.
      if (/["']user-agent["']\s*:\s*["']/i.test(source)) offenders.push(`${file}: User-Agent literal`);
      // Un fetch directo a un https:// de tercero fuera del helper debe usar UPSTREAM_USER_AGENT.
      if (/\bfetch\(\s*[`"']https?:\/\//.test(source) || /\bfetch\(\s*(targetUrl|url)\b/.test(source)) {
        if (!source.includes("UPSTREAM_USER_AGENT") && !source.includes("upstreamHeaders")) {
          offenders.push(`${file}: fetch directo sin UPSTREAM_USER_AGENT`);
        }
      }
      if (/contact@|@aquatechia/i.test(source)) offenders.push(`${file}: correo en el código de servidor`);
    }
    expect(offenders.map((o) => o.replace(root, ""))).toEqual([]);
  });
});

describe("registro del 429 del proveedor", () => {
  const rateLimited = (headers: Record<string, string>, body: string) =>
    new Response(body, { status: 429, headers });

  it("registra retry-after, x-varnish-rli/rlg y los primeros 200 caracteres del cuerpo, con console.warn", async () => {
    fetchMock.mockResolvedValue(
      rateLimited(
        { "retry-after": "12", "x-varnish-rli": "250", "x-varnish-rlg": "250", "set-cookie": "secreto=1", "x-otro": "no" },
        `Too Many Requests\n${"a".repeat(500)}`,
      ),
    );
    const result = await fetchUpstreamJson("gbif:search", "https://api.gbif.org/v1/occurrence/search?k=SECRETO", {
      timeoutMs: 1000,
    });

    expect(result.ok).toBe(false);
    expect(warnSpy).toHaveBeenCalledTimes(1);
    const line = String(warnSpy.mock.calls[0][0]);
    const entry = JSON.parse(line);
    expect(entry).toMatchObject({ tag: "upstream-429", proxy: "gbif:search", status: 429 });
    expect(entry.headers).toEqual({ "retry-after": "12", "x-varnish-rli": "250", "x-varnish-rlg": "250" });
    expect(entry.body.length).toBeLessThanOrEqual(200);
    expect(entry.body.startsWith("Too Many Requests a")).toBe(true); // el salto de línea no rompe el registro
    expect(line).not.toContain("SECRETO"); // nunca la URL ni la clave
    expect(line).not.toContain("secreto=1"); // solo cabeceras de límite
  });

  it("al cliente le llega 503 con Retry-After y sin el cuerpo del proveedor", async () => {
    fetchMock.mockResolvedValue(rateLimited({ "retry-after": "7" }, "cuerpo interno del proveedor"));
    const result = await fetchUpstreamJson("gbif:search", "https://api.gbif.org/x", { timeoutMs: 1000 });
    if (result.ok) throw new Error("debía fallar");
    expect(result.response.status).toBe(503);
    expect(result.response.headers.get("retry-after")).toBe("7");
    expect(JSON.stringify(await result.response.json())).not.toContain("cuerpo interno");
  });

  it("un cuerpo ilegible no impide responder", async () => {
    const broken = new Response("x", { status: 429 });
    vi.spyOn(broken, "text").mockRejectedValue(new Error("boom"));
    fetchMock.mockResolvedValue(broken);
    const result = await fetchUpstreamJson("t", "https://example.org/x", { timeoutMs: 1000 });
    expect(result.ok).toBe(false);
    expect(JSON.parse(String(warnSpy.mock.calls[0][0])).body).toBe("(sin cuerpo legible)");
  });

  it("otros errores del proveedor no escriben este registro", async () => {
    fetchMock.mockResolvedValue(new Response("x", { status: 500 }));
    await fetchUpstreamJson("t", "https://example.org/x", { timeoutMs: 1000 });
    expect(warnSpy).not.toHaveBeenCalled();
  });
});
