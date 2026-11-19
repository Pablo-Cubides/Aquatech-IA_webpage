import { beforeEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import { NextRequest } from "next/server";

const { rateLimitMock } = vi.hoisted(() => ({ rateLimitMock: vi.fn() }));

vi.mock("@/lib/security/rate-limit", () => ({
  rateLimit: rateLimitMock,
  getClientIP: () => "203.0.113.7",
}));
vi.mock("@/lib/logger", () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));

const HF_PAYLOAD = [
  { id: "acme/real-model", likes: 10, downloads: 5, trendingScore: 3.5, pipeline_tag: "text-generation", tags: ["a"], createdAt: "2026-11-01T00:00:00Z", private: false },
];

describe("GET /api/huggingface-trending (SEC-003)", () => {
  const fetchMock = vi.fn();
  let GET: (req: NextRequest) => Promise<Response>;

  const call = (query = "") => GET(new NextRequest(`http://localhost/api/huggingface-trending${query}`));

  beforeEach(async () => {
    vi.clearAllMocks();
    vi.resetModules(); // la caché en memoria de la ruta no debe filtrarse entre pruebas
    vi.unstubAllEnvs();
    vi.stubGlobal("fetch", fetchMock);
    fetchMock.mockImplementation(async () => new Response(JSON.stringify(HF_PAYLOAD), { status: 200 }));
    rateLimitMock.mockResolvedValue({ success: true, limit: 30, remaining: 29, reset: Date.now() + 60_000 });
    ({ GET } = await import("./route"));
  });

  it("devuelve modelos reales y los marca como tales", async () => {
    const res = await call("?period=month&limit=10&category=text-generation");
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.source).toBe("huggingface.co");
    expect(body.models[0]).toMatchObject({ id: "acme/real-model", author: "acme" });
    const url = new URL(String(fetchMock.mock.calls[0][0]));
    expect(url.searchParams.get("sort")).toBe("likes30d");
    expect(url.searchParams.get("limit")).toBe("10");
    expect(url.searchParams.get("pipeline_tag")).toBe("text-generation");
    expect(res.headers.get("cache-control")).toContain("s-maxage=3600");
  });

  it("envía la clave como Bearer solo si existe", async () => {
    vi.stubEnv("HUGGINGFACE_API_KEY", "hf_test_value");
    await call();
    expect(fetchMock.mock.calls[0][1].headers.Authorization).toBe("Bearer hf_test_value");
  });

  it.each([
    ["500 del Hub", async () => new Response("down", { status: 500 }), 502],
    ["429 del Hub", async () => new Response("slow", { status: 429 }), 503],
    ["falla de red", async () => Promise.reject(new TypeError("fetch failed")), 502],
    ["timeout", async () => Promise.reject(Object.assign(new Error("t"), { name: "TimeoutError" })), 504],
    ["JSON inválido", async () => new Response("<html>", { status: 200 }), 502],
    ["forma inesperada", async () => new Response(JSON.stringify({ models: [] }), { status: 200 }), 502],
  ])("%s: error, NUNCA una lista de respaldo", async (_label, impl, status) => {
    fetchMock.mockImplementation(impl);
    const res = await call();
    expect(res.status).toBe(status);
    const body = await res.json();
    expect(body.models).toBeUndefined();
    expect(JSON.stringify(body)).not.toMatch(/llama|gemma|mistral|mock/i);
  });

  it.each([
    ["clave desconocida", "?foo=1"],
    ["period inválido", "?period=year"],
    ["limit fuera de rango", "?limit=500"],
    ["category con caracteres raros", "?category=a%26b%3D1"],
    ["parámetro repetido", "?limit=10&limit=20"],
  ])("400 sin llamar al Hub: %s", async (_label, query) => {
    expect((await call(query)).status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("límite cerrado y almacén caído = 503 sin llamar al Hub", async () => {
    await call();
    for (const [, config] of rateLimitMock.mock.calls) expect(config.failureMode).toBe("closed");
    fetchMock.mockClear();
    rateLimitMock.mockResolvedValueOnce({ success: false, limit: 30, remaining: 0, reset: Date.now() + 1000, reason: "backend-unavailable" });
    expect((await call()).status).toBe(503);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("guarda estática: sin datos de respaldo en el código", () => {
    const source = readFileSync(path.join(process.cwd(), "src/app/api/huggingface-trending/route.ts"), "utf8");
    const code = source.replace(/\/\*[\s\S]*?\*\//g, "");
    expect(code).not.toMatch(/generateMock|\(mock|mock-fallback|Llama-3-8B/);
  });
});
