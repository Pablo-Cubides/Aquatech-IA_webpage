import { beforeEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import { NextRequest } from "next/server";

const { rateLimitMock, loggerMock } = vi.hoisted(() => ({
  rateLimitMock: vi.fn(),
  loggerMock: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));

vi.mock("@/lib/security/rate-limit", () => ({
  rateLimit: rateLimitMock,
  getClientIP: () => "203.0.113.7",
}));
vi.mock("@/lib/logger", () => ({ logger: loggerMock }));

import { GET } from "./route";

const SECRET = "FIRMS-SECRET-KEY-123";
const call = (query = "") => GET(new NextRequest(`http://localhost/api/firms/fires${query}`));
const CSV =
  "latitude,longitude,bright_ti4,scan,track,acq_date,acq_time,satellite,instrument,confidence,frp,daynight\n" +
  "4.6,-74.1,330.1,0.4,0.4,2026-11-16,1830,N,VIIRS,n,12.5,N\n";

describe("GET /api/firms/fires (SEC-003)", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.unstubAllEnvs();
    vi.stubEnv("FIRMS_MAP_KEY", SECRET);
    vi.stubGlobal("fetch", fetchMock);
    fetchMock.mockImplementation(async () => new Response(CSV, { status: 200 }));
    rateLimitMock.mockResolvedValue({ success: true, limit: 30, remaining: 29, reset: Date.now() + 60_000 });
  });

  it("devuelve los registros reales con caché pública", async () => {
    const res = await call("?day_range=1");
    expect(res.status).toBe(200);
    expect(res.headers.get("cache-control")).toContain("s-maxage=1800");
    const body = await res.json();
    expect(body).toHaveLength(1);
    expect(body[0]).toMatchObject({ latitude: "4.6", longitude: "-74.1", satellite: "N" });
  });

  it("sin FIRMS_MAP_KEY responde 503 honesto: nada inventado y sin llamar al proveedor", async () => {
    vi.stubEnv("FIRMS_MAP_KEY", "");
    vi.stubEnv("NEXT_PUBLIC_FIRMS_MAP_KEY", SECRET); // la variable vieja ya no cuenta
    const res = await call();
    expect(res.status).toBe(503);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(await res.json()).toMatchObject({ error: "not_configured" });
  });

  it.each([
    ["el proveedor responde 500", async () => new Response("boom", { status: 500 }), 502],
    ["el proveedor responde 401", async () => new Response("bad key", { status: 401 }), 502],
    ["el proveedor limita (429)", async () => new Response("slow", { status: 429, headers: { "retry-after": "30" } }), 503],
    ["falla de red", async () => Promise.reject(new TypeError("fetch failed")), 502],
    ["timeout", async () => Promise.reject(Object.assign(new Error("t"), { name: "TimeoutError" })), 504],
    ["200 con un mensaje que no es CSV (clave inválida)", async () => new Response("Invalid MAP_KEY.", { status: 200 }), 502],
  ])("%s: error, NUNCA incendios inventados", async (_label, impl, status) => {
    fetchMock.mockImplementation(impl);
    const res = await call();
    expect(res.status).toBe(status);
    const text = await res.text();
    expect(text).not.toContain("latitude");
    expect(text).not.toContain("VIIRS");
    expect(text).not.toContain("boom");
    expect(text).not.toContain("bad key");
  });

  it("cuerpo vacío del proveedor = sin incendios (lista vacía), no error", async () => {
    fetchMock.mockImplementation(async () => new Response("", { status: 200 }));
    const res = await call();
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual([]);
  });

  it("la clave nunca se escribe en logs ni en la respuesta", async () => {
    const spies = [vi.spyOn(console, "log"), vi.spyOn(console, "warn"), vi.spyOn(console, "error")].map((s) =>
      s.mockImplementation(() => {}),
    );
    for (const impl of [
      async () => new Response(CSV, { status: 200 }),
      async () => new Response("x", { status: 500 }),
      async () => Promise.reject(new Error("fetch failed")),
    ]) {
      fetchMock.mockImplementation(impl);
      const res = await call();
      expect(await res.text()).not.toContain(SECRET);
    }
    const logged = JSON.stringify([
      ...spies.flatMap((s) => s.mock.calls),
      ...Object.values(loggerMock).flatMap((m) => m.mock.calls),
    ]);
    expect(logged).not.toContain(SECRET);
    spies.forEach((s) => s.mockRestore());
  });

  it("llama al proveedor con la clave del servidor y parámetros validados", async () => {
    await call("?source=MODIS_NRT&day_range=3&area=-80,-4,-66,13");
    const url = String(fetchMock.mock.calls[0][0]);
    expect(url).toBe(`https://firms.modaps.eosdis.nasa.gov/api/area/csv/${SECRET}/MODIS_NRT/-80,-4,-66,13/3`);
  });

  it.each([
    ["clave desconocida", "?foo=1"],
    ["day_range fuera de 1-5 (la documentación de FIRMS)", "?day_range=7"],
    ["source fuera de la lista", "?source=../../etc"],
    ["area con inyección de ruta", "?area=-82,-5,-66,14/../x"],
    ["area desordenada", "?area=10,10,0,0"],
    ["parámetro repetido", "?day_range=1&day_range=2"],
  ])("400 sin llamar al proveedor: %s", async (_label, query) => {
    const res = await call(query);
    expect(res.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("límite: clave propia => cerrado; excedido = 429; almacén caído = 503; ninguno llama al proveedor", async () => {
    await call();
    for (const [, config] of rateLimitMock.mock.calls) expect(config.failureMode).toBe("closed");

    rateLimitMock.mockResolvedValueOnce({ success: false, limit: 30, remaining: 0, reset: Date.now() + 5000, reason: "limit-exceeded" });
    fetchMock.mockClear();
    expect((await call()).status).toBe(429);

    rateLimitMock.mockResolvedValueOnce({ success: false, limit: 30, remaining: 0, reset: Date.now() + 5000, reason: "backend-unavailable" });
    expect((await call()).status).toBe(503);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("presupuesto global agotado = 503 sin tocar el proveedor", async () => {
    rateLimitMock
      .mockResolvedValueOnce({ success: true, limit: 30, remaining: 1, reset: Date.now() + 1000 })
      .mockResolvedValueOnce({ success: false, limit: 1000, remaining: 0, reset: Date.now() + 1000, reason: "limit-exceeded" });
    const res = await call();
    expect(res.status).toBe(503);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("guarda estática: el código de la ruta no genera datos ni usa la variable pública", () => {
    const source = readFileSync(path.join(process.cwd(), "src/app/api/firms/fires/route.ts"), "utf8");
    const code = source.replace(/\/\*[\s\S]*?\*\//g, "");
    expect(code).not.toMatch(/Math\.random|generateMock/);
    expect(code).not.toContain("NEXT_PUBLIC");
    expect(code).not.toMatch(/console\.(log|warn|error)/);
  });
});
