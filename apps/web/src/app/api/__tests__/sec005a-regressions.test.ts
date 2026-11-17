import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

/**
 * SEC-005a: regresiones de validadores que rechazaban uso LEGÍTIMO. Cada caso sale de lo que el código
 * cliente envía de verdad (buscador de papers, CSV de calidad del aire, autocompletado de GBIF, mapa),
 * no de ejemplos inventados.
 */
const { rateLimitMock } = vi.hoisted(() => ({ rateLimitMock: vi.fn() }));
vi.mock("@/lib/security/rate-limit", () => ({ rateLimit: rateLimitMock, getClientIP: () => "203.0.113.7" }));
vi.mock("@/lib/logger", () => ({ logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() } }));

import { resetLocalRateLimitForTests } from "@/lib/security/local-rate-limit";
import { GET as suggestGET } from "../gbif/species/suggest/route";
import { GET as speciesGET } from "../gbif/species/[key]/route";
import { GET as meteoGET } from "../openmeteo/weather/route";
import { GET as locationsGET } from "../openaq/locations/route";
import { POST as calcPOST } from "../aqi-calculator/route";
import { searchTaxonSuggestions, getTaxonDetails } from "@/lib/gbif";

const req = (p: string, init?: RequestInit) => new NextRequest(`http://localhost${p}`, init as never);
const fetchMock = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  resetLocalRateLimitForTests();
  vi.unstubAllEnvs();
  vi.stubGlobal("fetch", fetchMock);
  fetchMock.mockImplementation(async () => new Response(JSON.stringify([{ key: 2435098, canonicalName: "Puma" }]), { status: 200 }));
  rateLimitMock.mockResolvedValue({ success: true, limit: 30, remaining: 29, reset: Date.now() + 60_000 });
});

describe("GBIF: el navegador pasa por NUESTRO proxy (connect-src queda en 'self')", () => {
  it("suggest con el texto que escribe la persona (nombres científicos, tildes, apóstrofos)", async () => {
    for (const q of ["Puma concolor", "águila", "Tapirus (Tapirus) pinchaque", "o'brien", "Quercus × robur"]) {
      fetchMock.mockClear();
      const res = await suggestGET(req(`/api/gbif/species/suggest?q=${encodeURIComponent(q)}&limit=10`));
      expect(res.status, q).toBe(200);
      const upstream = new URL(String(fetchMock.mock.calls[0][0]));
      expect(upstream.origin + upstream.pathname).toBe("https://api.gbif.org/v1/species/suggest");
      expect(upstream.searchParams.get("q")).toBe(q);
      expect(upstream.searchParams.get("limit")).toBe("10");
    }
  });

  it("suggest rechaza lo que no es una búsqueda: sin q, q enorme, control, parámetro desconocido", async () => {
    for (const query of ["", "?q=", `?q=${"x".repeat(101)}`, "?q=a%00b", "?q=abc&foo=1", "?q=a&q=b"]) {
      expect((await suggestGET(req(`/api/gbif/species/suggest${query}`))).status, query).toBe(400);
    }
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("suggest acota limit (1-50) en vez de rechazarlo", async () => {
    await suggestGET(req("/api/gbif/species/suggest?q=puma&limit=9999"));
    expect(new URL(String(fetchMock.mock.calls[0][0])).searchParams.get("limit")).toBe("50");
  });

  it("detalle de taxón: key real; las rutas con inyección se rechazan", async () => {
    const ok = await speciesGET(req("/api/gbif/species/2435098"), { params: Promise.resolve({ key: "2435098" }) });
    expect(ok.status).toBe(200);
    expect(String(fetchMock.mock.calls[0][0])).toBe("https://api.gbif.org/v1/species/2435098");
    for (const key of ["0", "007", "1/../2", "abc", "1e3", "-5", "1234567890123"]) {
      fetchMock.mockClear();
      expect((await speciesGET(req("/api/gbif/species/x"), { params: Promise.resolve({ key }) })).status, key).toBe(400);
      expect(fetchMock).not.toHaveBeenCalled();
    }
  });

  it("lib/gbif.ts llama a /api/gbif/* (relativo), nunca a api.gbif.org", async () => {
    fetchMock.mockImplementation(async () => new Response("[]", { status: 200 }));
    await searchTaxonSuggestions("Puma concolor");
    await getTaxonDetails(2435098);
    const urls = fetchMock.mock.calls.map((c) => String(c[0]));
    expect(urls[0]).toBe("/api/gbif/species/suggest?q=Puma%20concolor&limit=10");
    expect(urls[1]).toBe("/api/gbif/species/2435098");
    expect(urls.join(" ")).not.toContain("api.gbif.org");
  });
});

describe("arXiv: el buscador acepta lo que la gente escribe", () => {
  const ATOM = `<?xml version="1.0"?><feed><opensearch:totalResults>0</opensearch:totalResults></feed>`;

  // Cada caso usa el módulo recién cargado: la ruta espacia a 4 s las consultas a arXiv (su política).
  async function freshGET() {
    vi.resetModules();
    vi.doMock("@/lib/security/rate-limit", () => ({ rateLimit: rateLimitMock, getClientIP: () => "203.0.113.7" }));
    vi.doMock("@/lib/logger", () => ({ logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() } }));
    return (await import("../arxiv-papers/route")).GET;
  }

  it.each([
    ['"attention is all you need"'],
    ["what's new in LLM's?"],
    ["transformer (BERT) & GPT/3"],
    ["C++ #1 100% accuracy"],
    ["modelos de lenguaje: evaluación"],
  ])("search=%s pasa y llega a arXiv codificado", async (search) => {
    fetchMock.mockImplementation(async () => new Response(ATOM, { status: 200 }));
    const GET = await freshGET();
    const res = await GET(req(`/api/arxiv-papers?search=${encodeURIComponent(search)}&limit=20&start=0&sortBy=relevance`));
    expect(res.status).toBe(200);
    const upstream = new URL(String(fetchMock.mock.calls[0][0]));
    expect(upstream.searchParams.get("search_query")).toContain(search);
  });

  it("sigue rechazando caracteres de control y más de 100 caracteres", async () => {
    const GET = await freshGET();
    for (const search of ["a%00b", "a%0d%0ab", "x".repeat(101)]) {
      expect((await GET(req(`/api/arxiv-papers?search=${search}`))).status, search).toBe(400);
    }
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe("aqi-calculator: el CSV completo de una serie real cabe", () => {
  const row = (i: number) => ({
    datetime: new Date(Date.UTC(2025, 0, 1) + i * 3_600_000).toISOString(),
    stationId: "Kennedy",
    stationName: "Estación Kennedy",
    location: "Bogotá, Colombia",
    pollutants: [
      { pollutantId: "pm25", value: 12.5, unit: "µg/m³" },
      { pollutantId: "pm10", value: 30.1, unit: "µg/m³" },
      { pollutantId: "o3", value: 40.2, unit: "µg/m³" },
      { pollutantId: "no2", value: 22.3, unit: "µg/m³" },
      { pollutantId: "so2", value: 5.4, unit: "µg/m³" },
      { pollutantId: "co", value: 0.8, unit: "mg/m³" },
    ],
    source: "csv",
  });
  const post = (body: string) =>
    calcPOST(req("/api/aqi-calculator", { method: "POST", body, headers: { "content-type": "application/json" } }));

  it("un año de datos horarios (8 760 filas, 6 contaminantes) se calcula", async () => {
    const body = JSON.stringify({ measurements: Array.from({ length: 8760 }, (_, i) => row(i)), profileId: "us-aqi" });
    const bytes = new TextEncoder().encode(body).length;
    // Documenta la cifra que justifica el tope: ~3,5 MB (por encima de los 300 KB anteriores, por debajo de 5 MB).
    expect(bytes).toBeGreaterThan(3_000_000);
    expect(bytes).toBeLessThan(5 * 1024 * 1024);
    const res = await post(body);
    expect(res.status).toBe(200);
    expect((await res.json()).count).toBe(8760);
  });

  it("el tope sigue existiendo: más de 20 000 filas => 400; más de 5 MB => 413", async () => {
    const tiny = { datetime: "2025-01-01T00:00:00Z", pollutants: [{ pollutantId: "pm25", value: 1, unit: "ppb" }], source: "csv" };
    const many = JSON.stringify({ measurements: Array.from({ length: 20_001 }, () => tiny), profileId: "us-aqi" });
    expect((await post(many)).status).toBe(400);
    const huge = JSON.stringify({ measurements: [tiny], profileId: "us-aqi", pad: "x".repeat(5 * 1024 * 1024) });
    expect((await post(huge)).status).toBe(413);
  });
});

describe("coordenadas con los decimales de un float de JavaScript (hasta 17)", () => {
  it("openmeteo", async () => {
    const res = await meteoGET(req("/api/openmeteo/weather?latitude=4.609710000000001&longitude=-74.08175000000001"));
    expect(res.status).toBe(200);
    const upstream = new URL(String(fetchMock.mock.calls[0][0]));
    expect(upstream.searchParams.get("latitude")).toBe("4.61");
    expect(upstream.searchParams.get("longitude")).toBe("-74.08");
  });

  it("openaq locations (coordinates lat,lon)", async () => {
    vi.stubEnv("OPENAQ_API_KEY", "k");
    fetchMock.mockImplementation(async () => new Response(JSON.stringify({ results: [] }), { status: 200 }));
    const res = await locationsGET(req("/api/openaq/locations?coordinates=4.609710000000001,-74.08175000000001&radius=25000&limit=100"));
    expect(res.status).toBe(200);
  });

  it("fuera de rango sigue rechazándose", async () => {
    expect((await meteoGET(req("/api/openmeteo/weather?latitude=91&longitude=0"))).status).toBe(400);
  });
});
