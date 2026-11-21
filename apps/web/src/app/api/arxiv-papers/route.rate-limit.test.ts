import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

/**
 * SEC-006: un 429 de arXiv (que bloquea IP si se le insiste) es "reintenta más tarde": 503 con
 * `Retry-After` (mismo criterio que el resto de proxies), no un 502 de "fallo del proveedor". Un 500 sigue
 * siendo 502. En ningún caso se reenvía el cuerpo de arXiv.
 */
vi.mock("@/lib/logger", () => ({ logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() } }));
vi.mock("@/lib/security/rate-limit", () => ({ rateLimit: vi.fn(), getClientIP: () => "203.0.113.20" }));

import { resetLocalRateLimitForTests } from "@/lib/security/local-rate-limit";
import { GET } from "./route";

const fetchMock = vi.fn();
const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
vi.spyOn(console, "error").mockImplementation(() => {});

let counter = 0;
// Una consulta distinta por prueba: la caché en memoria y la cola son del módulo.
const call = async () => {
  const pending = GET(new NextRequest(`http://localhost/api/arxiv-papers?search=prueba${counter++}`));
  await vi.advanceTimersByTimeAsync(30_000);
  return pending;
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.useFakeTimers();
  resetLocalRateLimitForTests();
  vi.stubGlobal("fetch", fetchMock);
});
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("arxiv-papers: respuestas del proveedor", () => {
  it("429 con Retry-After => 503 con ese Retry-After y sin el cuerpo de arXiv", async () => {
    fetchMock.mockImplementation(async () => new Response("CUERPO-INTERNO-DE-ARXIV", { status: 429, headers: { "retry-after": "42" } }));
    const res = await call();
    expect(res.status).toBe(503);
    expect(res.headers.get("retry-after")).toBe("42");
    expect((await res.json()).error).toBe("upstream_rate_limited");
    expect(fetchMock).toHaveBeenCalledTimes(2); // un reintento (comportamiento existente), no más
  });

  it("429 sin Retry-After => 503 con 60 s por defecto", async () => {
    fetchMock.mockImplementation(async () => new Response("x", { status: 429 }));
    const res = await call();
    expect(res.status).toBe(503);
    expect(res.headers.get("retry-after")).toBe("60");
  });

  it("deja el registro de diagnóstico del 429 (sin URL ni cuerpo de más de 200 caracteres)", async () => {
    fetchMock.mockImplementation(async () => new Response("a".repeat(500), { status: 429, headers: { "retry-after": "5" } }));
    await call();
    const lines = warnSpy.mock.calls.map((c) => String(c[0])).filter((l) => l.includes("upstream-429"));
    expect(lines.length).toBeGreaterThanOrEqual(1);
    const entry = JSON.parse(lines[0]);
    expect(entry).toMatchObject({ proxy: "arxiv:papers", status: 429 });
    expect(entry.body.length).toBeLessThanOrEqual(200);
    expect(lines[0]).not.toContain("export.arxiv.org");
  });

  it("control: un 500 de arXiv sigue siendo 502", async () => {
    fetchMock.mockImplementation(async () => new Response("x", { status: 500 }));
    const res = await call();
    expect(res.status).toBe(502);
    expect(res.headers.get("retry-after")).toBeNull();
  });

  it("un 429 seguido de un 200 en el reintento responde con los artículos", async () => {
    const xml = `<?xml version="1.0"?><feed xmlns:opensearch="http://a9.com/-/spec/opensearch/1.1/"><opensearch:totalResults>0</opensearch:totalResults></feed>`;
    fetchMock
      .mockResolvedValueOnce(new Response("x", { status: 429, headers: { "retry-after": "1" } }))
      .mockResolvedValueOnce(new Response(xml, { status: 200 }));
    const res = await call();
    expect(res.status).toBe(200);
  });
});
