import { describe, it, expect, vi, beforeEach } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import { NextRequest } from "next/server";
import { resetLocalRateLimitForTests } from "@/lib/security/local-rate-limit";
import { GET } from "./route";

vi.mock("@/lib/logger", () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));

const call = (query: string) => GET(new NextRequest(`http://localhost/api/proxy/worldbank?${query}`));
const fetchMock = vi.fn();

/**
 * SEC-005a: los IDs de indicador salen del código REAL del cliente (analisis-correlaciones), no de
 * ejemplos escritos a mano: así la prueba sigue lo que la herramienta pide de verdad. Antes solo se
 * probaba `country/all` y `../secret`, y por eso el patrón que rechazaba todos los indicadores (con
 * punto) pasaba en verde.
 */
const CLIENT_FILE = path.join(
  process.cwd(),
  "src/app/(portals)/ambiental/(marketing)/herramientas/analisis-correlaciones/src/utils/worldbank.ts",
);
const clientSource = readFileSync(CLIENT_FILE, "utf8");
const REAL_INDICATORS = [...clientSource.matchAll(/\bid:\s*"([A-Z0-9]+(?:\.[A-Z0-9]+)+)"/g)].map((m) => m[1]);

describe("/api/proxy/worldbank", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetLocalRateLimitForTests();
    vi.stubGlobal("fetch", fetchMock);
    fetchMock.mockImplementation(async () => new Response(JSON.stringify([{ page: 1 }, []]), { status: 200 }));
  });

  it("control: la extracción encuentra los indicadores reales de la herramienta (con punto)", () => {
    expect(REAL_INDICATORS.length).toBeGreaterThanOrEqual(10);
    expect(REAL_INDICATORS).toEqual(expect.arrayContaining(["AG.LND.FRST.ZS", "EN.ATM.CO2E.PC", "NY.GDP.MKTP.CD", "SP.POP.TOTL"]));
  });

  it("TODOS los indicadores reales de la herramienta pasan con la forma exacta de getIndicatorData", async () => {
    for (const id of REAL_INDICATORS) {
      fetchMock.mockClear();
      const res = await call(`path=country/CO/indicator/${id}&format=json&date=2000:2020&per_page=500`);
      expect(res.status, id).toBe(200);
      expect(String(fetchMock.mock.calls[0][0])).toBe(
        `https://api.worldbank.org/v2/country/CO/indicator/${id}?date=2000%3A2020&format=json&per_page=500`,
      );
    }
  });

  it("las otras formas reales: lista de países y búsqueda de indicadores", async () => {
    expect((await call("path=country&format=json&per_page=300")).status).toBe(200);
    expect((await call("path=indicator&format=json&per_page=100&page=2&q=forest%20area")).status).toBe(200);
    expect((await call("path=country/all/indicator/SP.POP.TOTL&format=json&date=2019")).status).toBe(200);
  });

  it.each([
    "../secret",
    "country/../../x",
    "country/./CO",
    "country//CO",
    ".",
    "..",
    "country/CO/indicator/AG..LND",
    "country/CO/indicator/.AG.LND",
    "country/CO/indicator/AG.LND.",
    "country/CO:80",
    "country/CO;BR",
    "https://evil.example/x",
    "//evil.example/x",
    "country/%2e%2e/x",
    "country\\CO",
    "a/b/c/d/e/f/g", // más de 6 segmentos
  ])("400 y NO llama al Banco Mundial: path=%s", async (value) => {
    const res = await call(`path=${value}`);
    expect(res.status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it.each([
    ["sin path", "format=json"],
    ["parámetro desconocido", "path=country&foo=1"],
    ["parámetro repetido", "path=country&path=indicator"],
    ["per_page enorme", "path=country&per_page=100000"],
    ["format distinto de json", "path=country&format=xml"],
    ["date inválido", "path=country&date=2000:2020:2030"],
  ])("400: %s", async (_label, query) => {
    expect((await call(query)).status).toBe(400);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("limita por IP (memoria) y no toca el almacén compartido", async () => {
    for (let i = 0; i < 60; i++) await call("path=country");
    expect((await call("path=country")).status).toBe(429);
  });

  it("errores del proveedor: no se reenvía su cuerpo", async () => {
    fetchMock.mockImplementation(async () => new Response("DETALLE-INTERNO", { status: 500 }));
    const res = await call("path=country");
    expect(res.status).toBe(502);
    expect(await res.text()).not.toContain("DETALLE-INTERNO");
  });

  it("respuesta correcta con caché pública", async () => {
    const res = await call("path=country");
    expect(res.headers.get("cache-control")).toContain("s-maxage=3600");
  });
});
