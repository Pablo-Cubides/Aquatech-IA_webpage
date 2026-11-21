import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

/**
 * SEC-006: gbif/search devuelve el resultado ADELGAZADO, lo guarda en la caché de datos con un
 * `revalidate` largo y, si GBIF falla, el error llega al cliente sin el cuerpo del proveedor.
 * (La semántica de "copia anterior si falla la revalidación" es de Next y se midió aparte; aquí se
 * fija que la ruta la usa con los parámetros acordados.)
 */
const { cacheMock } = vi.hoisted(() => ({
  cacheMock: vi.fn((fn: unknown, _keys?: string[], _options?: { revalidate?: number }) => fn),
}));
vi.mock("next/cache", () => ({ unstable_cache: cacheMock }));
vi.mock("@/lib/logger", () => ({ logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() } }));
vi.mock("@/lib/security/rate-limit", () => ({ rateLimit: vi.fn(), getClientIP: () => "203.0.113.9" }));

import { resetLocalRateLimitForTests } from "@/lib/security/local-rate-limit";
import { GET } from "./route";

// `vi.clearAllMocks` borra las llamadas: se leen una vez, al importar la ruta.
const [, cacheKeys, cacheOptions] = cacheMock.mock.calls[0];

const fetchMock = vi.fn();
const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
const req = (query = "") => new NextRequest(`http://localhost/api/gbif/search${query}`);

const heavyRecord = (i: number) => ({
  key: i,
  scientificName: "Puma concolor",
  decimalLatitude: 4.5,
  decimalLongitude: -74.2,
  classKey: 359,
  extensions: { big: "x".repeat(5000) },
  gadmGids: ["COL.1_1"],
});

beforeEach(() => {
  vi.clearAllMocks();
  resetLocalRateLimitForTests();
  vi.stubGlobal("fetch", fetchMock);
  fetchMock.mockImplementation(async () =>
    Response.json({ offset: 0, limit: 300, endOfRecords: false, count: 5000, results: [heavyRecord(1), heavyRecord(2)] }),
  );
});

describe("respuesta adelgazada", () => {
  it("conserva results y los campos del visor; descarta el resto", async () => {
    const res = await GET(req("?country=CO&hasCoordinate=true&limit=300"));
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(body).toMatchObject({ offset: 0, limit: 300, endOfRecords: false, count: 5000 });
    expect(body.results).toHaveLength(2);
    expect(body.results[0]).toEqual({ key: 1, scientificName: "Puma concolor", decimalLatitude: 4.5, decimalLongitude: -74.2, classKey: 359 });
    expect(JSON.stringify(body)).not.toContain("gadmGids");
  });

  it("mantiene el Cache-Control público del CDN (1 h + stale-while-revalidate)", async () => {
    const res = await GET(req("?country=CO"));
    expect(res.headers.get("cache-control")).toBe("public, s-maxage=3600, stale-while-revalidate=7200");
  });

  it("una respuesta que no es una búsqueda de ocurrencias es 502 (no se cachea ni se reenvía)", async () => {
    fetchMock.mockImplementation(async () => Response.json({ algo: "raro" }));
    const res = await GET(req("?country=CO"));
    expect(res.status).toBe(502);
    expect((await res.json()).error).toBe("upstream_invalid");
  });
});

describe("caché de datos de Next", () => {
  it("guarda el resultado adelgazado 6 horas, con clave versionada", () => {
    expect(cacheOptions).toEqual({ revalidate: 6 * 60 * 60 });
    expect(cacheKeys).toEqual(["gbif-search-slim-v1"]);
  });

  it("la función cacheada recibe la consulta ya validada y ordenada (la clave no admite parámetros libres)", async () => {
    await GET(req("?limit=300&country=co&hasCoordinate=true"));
    const upstream = new URL(String(fetchMock.mock.calls[0][0]));
    expect(upstream.origin + upstream.pathname).toBe("https://api.gbif.org/v1/occurrence/search");
    expect(upstream.search).toBe("?country=co&hasCoordinate=true&limit=300");
  });
});

describe("fallos del proveedor", () => {
  it("429 => 503 con Retry-After, sin su cuerpo, y deja el registro de diagnóstico", async () => {
    fetchMock.mockImplementation(
      async () => new Response("CUERPO-INTERNO-DE-VARNISH", { status: 429, headers: { "retry-after": "9", "x-varnish-rli": "250" } }),
    );
    const res = await GET(req("?country=CO"));
    expect(res.status).toBe(503);
    expect(res.headers.get("retry-after")).toBe("9");
    expect(await res.text()).not.toContain("CUERPO-INTERNO");
    expect(String(warnSpy.mock.calls[0][0])).toContain("upstream-429");
  });

  it.each([
    [500, 502],
    [404, 404],
  ])("%i del proveedor => %i", async (upstream, expected) => {
    fetchMock.mockImplementation(async () => new Response("x", { status: upstream }));
    expect((await GET(req("?country=CO"))).status).toBe(expected);
  });

  it("timeout => 504", async () => {
    fetchMock.mockImplementation(async () => Promise.reject(Object.assign(new Error("t"), { name: "TimeoutError" })));
    expect((await GET(req("?country=CO"))).status).toBe(504);
  });

  it("un error inesperado dentro de la función cacheada también es una respuesta controlada", async () => {
    fetchMock.mockImplementation(async () => ({ ok: true, status: 200, headers: new Headers(), text: async () => { throw new Error("boom"); } }));
    expect((await GET(req("?country=CO"))).status).toBe(502);
  });
});
