import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

const { rateLimitMock, loggerMock } = vi.hoisted(() => ({
  rateLimitMock: vi.fn(),
  loggerMock: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));

vi.mock("@/lib/security/rate-limit", () => ({
  rateLimit: rateLimitMock,
  getClientIP: () => "203.0.113.7",
}));
vi.mock("@/lib/logger", () => ({ logger: loggerMock }));
// SEC-006: fuera del runtime de Next no hay caché de datos; aquí `unstable_cache` es transparente.
vi.mock("next/cache", () => ({ unstable_cache: (fn: unknown) => fn }));

import { resetLocalRateLimitForTests } from "@/lib/security/local-rate-limit";
import { GET as usgsGET } from "../usgs/earthquakes/route";
import { GET as eonetEventsGET } from "../eonet/events/route";
import { GET as gbifGET } from "../gbif/search/route";
import { GET as meteoGET } from "../openmeteo/weather/route";
import { GET as wqpSearchGET } from "../wqp/search/route";
import { GET as wqpResultsGET } from "../wqp/results/route";
import { GET as locationsGET } from "../openaq/locations/route";
import { GET as parametersGET } from "../openaq/parameters/route";
import { GET as sensorGET } from "../openaq/sensors/[id]/measurements/route";
import { GET as stationsGET } from "../aqi-stations/route";
import { GET as arxivGET } from "../arxiv-papers/route";
import { GET as gifGET } from "../visor-export-gif/route";
import { POST as stepPOST } from "../visor-step/route";
import { POST as calcPOST } from "../aqi-calculator/route";

const req = (p: string, init?: RequestInit) => new NextRequest(`http://localhost${p}`, init as never);
const fetchMock = vi.fn();
const OPENAQ_KEY = "openaq-secret-key-9876";
const ok = () => new Response(JSON.stringify({ results: [] }), { status: 200 });

beforeEach(() => {
  vi.clearAllMocks();
  resetLocalRateLimitForTests();
  vi.unstubAllEnvs();
  vi.stubGlobal("fetch", fetchMock);
  fetchMock.mockImplementation(async () => ok());
  rateLimitMock.mockResolvedValue({ success: true, limit: 30, remaining: 29, reset: Date.now() + 60_000 });
});

describe("parámetros que entran en la RUTA del upstream: sin inyección", () => {
  it.each([
    ["usgs period", () => usgsGET(req("/api/usgs/earthquakes?period=week/../../x"))],
    ["usgs minMagnitude", () => usgsGET(req("/api/usgs/earthquakes?minMagnitude=2.5/../x"))],
    ["eonet category con barra", () => eonetEventsGET(req("/api/eonet/events?category=../events"))],
    ["eonet category con punto", () => eonetEventsGET(req("/api/eonet/events?category=a.b"))],
    ["wqp siteid con barra", () => wqpResultsGET(req("/api/wqp/results?siteid=a/../b"))],
    ["openaq sensor id no numérico", () => sensorGET(req("/api/openaq/sensors/x/measurements"), { params: Promise.resolve({ id: "1/../2" }) })],
    ["openaq sensor id con ceros", () => sensorGET(req("/api/openaq/sensors/x/measurements"), { params: Promise.resolve({ id: "007" }) })],
    ["gbif geometry con caracteres raros", () => gbifGET(req("/api/gbif/search?geometry=POINT(1%202)%3Bdrop"))],
    ["openmeteo latitude fuera de rango", () => meteoGET(req("/api/openmeteo/weather?latitude=91&longitude=0"))],
    ["openmeteo sin longitud", () => meteoGET(req("/api/openmeteo/weather?latitude=4"))],
    ["wqp provider desconocido", () => wqpSearchGET(req("/api/wqp/search?providers=EVIL"))],
    ["parámetro desconocido en usgs", () => usgsGET(req("/api/usgs/earthquakes?x=1"))],
  ])("400 y NO llama al proveedor: %s", async (_label, call) => {
    const res = await call();
    expect(res.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("los valores válidos llegan al upstream en la ruta esperada", async () => {
    await usgsGET(req("/api/usgs/earthquakes?period=day&minMagnitude=4.5"));
    expect(String(fetchMock.mock.calls[0][0])).toBe(
      "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_day.geojson",
    );
    await eonetEventsGET(req("/api/eonet/events?category=wildfires&limit=5"));
    expect(String(fetchMock.mock.calls[1][0])).toBe("https://eonet.gsfc.nasa.gov/api/v3/categories/wildfires?limit=5");
  });

  it("wqp acepta providers repetido (lo que manda el cliente) y fija mimeType/zip", async () => {
    const res = await wqpSearchGET(
      req("/api/wqp/search?providers=NWIS&providers=STORET&mimeType=geojson&zip=no&resultLimit=10&bBox=-80,-4,-66,13"),
    );
    expect(res.status).toBe(200);
    const url = new URL(String(fetchMock.mock.calls[0][0]));
    expect(url.searchParams.getAll("providers")).toEqual(["NWIS", "STORET"]);
    expect(url.searchParams.get("mimeType")).toBe("geojson");
    expect(url.searchParams.get("resultLimit")).toBeNull();
  });

  it("openmeteo redondea coordenadas (misma caché para puntos cercanos)", async () => {
    await meteoGET(req("/api/openmeteo/weather?latitude=4.60971234&longitude=-74.08175"));
    const url = new URL(String(fetchMock.mock.calls[0][0]));
    expect(url.searchParams.get("latitude")).toBe("4.61");
    expect(url.searchParams.get("longitude")).toBe("-74.08");
  });
});

describe("errores del proveedor: nunca se reenvía su cuerpo", () => {
  it.each([
    ["usgs", () => usgsGET(req("/api/usgs/earthquakes"))],
    ["gbif", () => gbifGET(req("/api/gbif/search?limit=5"))],
    ["wqp", () => wqpResultsGET(req("/api/wqp/results?siteid=USGS-0164"))],
    ["openmeteo", () => meteoGET(req("/api/openmeteo/weather?latitude=4&longitude=-74"))],
  ])("%s: 500 del proveedor => 502 sin su cuerpo", async (_label, call) => {
    fetchMock.mockImplementation(async () => new Response("INTERNAL-STACKTRACE-DETAIL", { status: 500 }));
    const res = await call();
    expect(res.status).toBe(502);
    expect(await res.text()).not.toContain("INTERNAL-STACKTRACE-DETAIL");
  });

  it("timeout => 504", async () => {
    fetchMock.mockImplementation(async () => Promise.reject(Object.assign(new Error("t"), { name: "TimeoutError" })));
    expect((await usgsGET(req("/api/usgs/earthquakes"))).status).toBe(504);
  });

  it("límite en memoria => 429 sin llamar al proveedor", async () => {
    for (let i = 0; i < 60; i++) await usgsGET(req("/api/usgs/earthquakes"));
    fetchMock.mockClear();
    const res = await usgsGET(req("/api/usgs/earthquakes"));
    expect(res.status).toBe(429);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(rateLimitMock).not.toHaveBeenCalled(); // sin clave propia: no toca el almacén compartido
  });
});

describe("OpenAQ (clave propia)", () => {
  it("sin OPENAQ_API_KEY: 503 claro, sin llamar al proveedor (la v3 exige clave)", async () => {
    vi.stubEnv("OPENAQ_API_KEY", "");
    for (const res of [
      await locationsGET(req("/api/openaq/locations?limit=5")),
      await parametersGET(req("/api/openaq/parameters")),
      await stationsGET(req("/api/aqi-stations")),
    ]) {
      expect(res.status).toBe(503);
    }
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("con clave: la envía en X-API-Key y no la escribe en logs ni respuestas", async () => {
    vi.stubEnv("OPENAQ_API_KEY", OPENAQ_KEY);
    const spies = [vi.spyOn(console, "log"), vi.spyOn(console, "warn"), vi.spyOn(console, "error")].map((s) =>
      s.mockImplementation(() => {}),
    );
    const res = await locationsGET(req("/api/openaq/locations?coordinates=4.6,-74.08&radius=99999&limit=50&order_by=lastUpdated&sort=desc"));
    expect(res.status).toBe(200);
    const [url, init] = fetchMock.mock.calls[0];
    expect(init.headers["X-API-Key"]).toBe(OPENAQ_KEY);
    const upstream = new URL(String(url));
    expect(upstream.searchParams.get("radius")).toBe("25000"); // acotado, como antes
    expect(upstream.searchParams.get("order_by")).toBeNull();
    expect(await res.text()).not.toContain(OPENAQ_KEY);

    fetchMock.mockImplementation(async () => new Response("denied", { status: 401 }));
    expect((await parametersGET(req("/api/openaq/parameters"))).status).toBe(502);

    const logged = JSON.stringify([...spies.flatMap((s) => s.mock.calls), ...Object.values(loggerMock).flatMap((m) => m.mock.calls)]);
    expect(logged).not.toContain(OPENAQ_KEY);
    expect(logged).not.toContain("api.openaq.org");
    spies.forEach((s) => s.mockRestore());
  });

  it("límite cerrado + presupuesto global compartido por todas las rutas de OpenAQ", async () => {
    vi.stubEnv("OPENAQ_API_KEY", OPENAQ_KEY);
    await locationsGET(req("/api/openaq/locations"));
    await parametersGET(req("/api/openaq/parameters"));
    const budgetKeys = rateLimitMock.mock.calls.map(([k]) => k).filter((k: string) => k.startsWith("proxy-budget:"));
    expect(new Set(budgetKeys)).toEqual(new Set(["proxy-budget:openaq"]));
    for (const [, config] of rateLimitMock.mock.calls) expect(config.failureMode).toBe("closed");

    fetchMock.mockClear();
    rateLimitMock.mockResolvedValueOnce({ success: false, limit: 30, remaining: 0, reset: Date.now() + 1000, reason: "backend-unavailable" });
    expect((await locationsGET(req("/api/openaq/locations"))).status).toBe(503);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("la ruta openaq/measurements ya no existe (apuntaba a un endpoint inexistente de la v3)", () => {
    expect(existsSync(path.join(process.cwd(), "src/app/api/openaq/measurements/route.ts"))).toBe(false);
  });

  it("aqi-stations: la acción `latest` fue eliminada (400)", async () => {
    vi.stubEnv("OPENAQ_API_KEY", OPENAQ_KEY);
    const res = await stationsGET(req("/api/aqi-stations?action=latest&country=1"));
    expect(res.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("aqi-stations: limit acotado (antes parseInt sin tope)", async () => {
    vi.stubEnv("OPENAQ_API_KEY", OPENAQ_KEY);
    await stationsGET(req("/api/aqi-stations?limit=999999999"));
    expect(new URL(String(fetchMock.mock.calls[0][0])).searchParams.get("limit")).toBe("1000");
    expect(fetchMock.mock.calls[0][1].headers["X-API-Key"]).toBe(OPENAQ_KEY);
  });
});

describe("arXiv", () => {
  it("rechaza search con caracteres de control y parámetros desconocidos (SEC-005a: las comillas y paréntesis ya se admiten)", async () => {
    for (const q of ["?search=a%00b", "?foo=1", "?limit=abc", "?sortBy=evil"]) {
      expect((await arxivGET(req(`/api/arxiv-papers${q}`))).status, q).toBe(400);
    }
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe("visor-export-gif: Content-Disposition", () => {
  it("rechaza case_id con comillas o saltos de línea (inyección de cabecera)", async () => {
    for (const id of ['a"b', "a%0d%0aSet-Cookie:x=1", "a/b", "a b", ""]) {
      const res = await gifGET(req(`/api/visor-export-gif?case_id=${id}`));
      expect(res.status, id).toBe(400);
    }
  });

  it("acepta los ids reales y los parámetros que envía la UI", async () => {
    const res = await gifGET(
      req("/api/visor-export-gif?case_id=flux-1.1-2&include_noise=true&overlay_opacity=0.8&frame_ms=350&linger_last_ms=1200"),
    );
    expect(res.status).toBe(200);
    expect(res.headers.get("content-disposition")).toBe('attachment; filename="diffusion_flux-1.1-2.gif"');
  });
});

describe("visor-step", () => {
  const post = (body: unknown) =>
    stepPOST(req("/api/visor-step", { method: "POST", body: typeof body === "string" ? body : JSON.stringify(body), headers: { "content-type": "application/json" } }));

  it("caso válido", async () => {
    const res = await post({ prompt_id: "1", step: 2 });
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({ step: 2, total_steps: 9 });
  });

  it.each(["constructor", "__proto__", "toString", "hasOwnProperty"])("'%s' no es un caso (antes llegaba al prototipo)", async (id) => {
    const res = await post({ prompt_id: id, step: 0 });
    // "constructor"/"toString"... pasan el formato y deben dar 404 (hasOwnProperty); "__proto__"
    // ni siquiera cumple el formato (400). Nunca un 500 ni un acierto por el prototipo.
    expect([400, 404]).toContain(res.status);
    expect(await res.text()).not.toContain("Internal");
  });

  it.each([
    ["step negativo", { prompt_id: "1", step: -1 }],
    ["step fraccionario", { prompt_id: "1", step: 1.5 }],
    ["step como texto", { prompt_id: "1", step: "2" }],
    ["clave de más", { prompt_id: "1", step: 1, extra: true }],
    ["sin prompt_id", { step: 1 }],
    ["prompt_id con caracteres raros", { prompt_id: "1\n2", step: 1 }],
  ])("400: %s", async (_label, body) => {
    expect((await post(body)).status).toBe(400);
  });

  it("JSON roto => 400", async () => {
    expect((await post("{not json")).status).toBe(400);
  });
});

describe("aqi-calculator", () => {
  const post = (body: unknown) =>
    calcPOST(req("/api/aqi-calculator", { method: "POST", body: JSON.stringify(body), headers: { "content-type": "application/json" } }));
  const measurement = {
    datetime: "2026-11-16T10:00:00Z",
    source: "manual",
    pollutants: [{ pollutantId: "pm25", value: 35, unit: "µg/m³" }],
  };

  it("calcula con un cuerpo válido", async () => {
    const res = await post({ measurements: [measurement], profileId: "us-aqi" });
    expect(res.status).toBe(200);
    expect((await res.json()).count).toBe(1);
  });

  it.each([
    ["perfil desconocido", { measurements: [measurement], profileId: "__proto__" }],
    ["sin mediciones", { measurements: [], profileId: "us-aqi" }],
    ["valor no numérico", { measurements: [{ ...measurement, pollutants: [{ pollutantId: "pm25", value: "x", unit: "µg/m³" }] }], profileId: "us-aqi" }],
    ["contaminante desconocido", { measurements: [{ ...measurement, pollutants: [{ pollutantId: "xx", value: 1, unit: "ppm" }] }], profileId: "us-aqi" }],
    ["demasiadas mediciones", { measurements: Array.from({ length: 20_001 }, () => measurement), profileId: "us-aqi" }],
  ])("400: %s", async (_label, body) => {
    expect((await post(body)).status).toBe(400);
  });
});

describe("guarda estática de los proxies", () => {
  const root = path.join(process.cwd(), "src/app/api");
  const files = [
    "usgs/earthquakes", "eonet/categories", "eonet/events", "gbif/search", "openmeteo/weather", "wqp/search",
    "wqp/results", "openaq/locations", "openaq/parameters", "openaq/sensors/[id]/measurements", "aqi-stations",
    "arxiv-papers", "visor-export-gif", "visor-step", "visor-prompts", "aqi-calculator", "firms/fires", "huggingface-trending",
  ].map((dir) => path.join(root, dir, "route.ts"));

  it("ningún proxy escribe la URL del proveedor ni la clave en la consola", () => {
    for (const file of files) {
      const code = readFileSync(file, "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
      expect(code, file).not.toMatch(/console\.log/);
      expect(code, file).not.toMatch(/console\.(warn|error)\([^)]*(Url|URL|url|apiKey|API_KEY)/);
      expect(code, file).not.toMatch(/details:\s*(error|errorMessage)/);
    }
  });

  it("todo proxy con proveedor externo pasa por public-proxy (Zod estricto + límite)", () => {
    const external = files.filter((f) => !/visor-|aqi-calculator/.test(f));
    for (const file of external) {
      expect(readFileSync(file, "utf8"), file).toContain("@/lib/security/public-proxy");
    }
  });

  it("no queda ninguna ruta de api sin guardia entre las del inventario (existen todas)", () => {
    for (const file of files) expect(statSync(file).isFile(), file).toBe(true);
    expect(readdirSync(path.join(root, "openaq"))).not.toContain("measurements");
  });
});
