import { afterEach, describe, expect, it, vi } from "vitest";
import {
  RETIRED_WORLD_BANK_INDICATORS,
  getIndicatorData,
  getMultipleIndicators,
  getPopularIndicators,
  worldBankErrorMessage,
} from "../worldbank";

/**
 * ARQ-010 (punto 7). Estas pruebas NO hacen llamadas de red: cuentan con una lista de indicadores
 * retirados y con el cuerpo real que devuelve el Banco Mundial, y `fetch` está sustituido.
 *
 * CÓMO SE VERIFICÓ (2026-11-17, a mano, no en la prueba): consulta directa a
 *   https://api.worldbank.org/v2/country/CO/indicator/<ID>?format=json&date=2018:2020
 * - EN.ATM.CO2E.PC y EN.ATM.GHGT.KT.CE -> HTTP 200 con [{"message":[{"id":"175","key":"Invalid value",
 *   "value":"The indicator was not found. It may have been deleted or archived."}]}] (retirados).
 * - EN.GHG.CO2.PC.CE.AR5 (Colombia 2020 = 1,665 t CO2e/hab) y EN.GHG.ALL.MT.CE.AR5 (Colombia 2020 =
 *   199,65 Mt CO2e) -> datos. Metadatos de nombre y fuente: https://api.worldbank.org/v2/indicator/<ID>.
 * Para repetirlo: `curl -s "https://api.worldbank.org/v2/indicator/<ID>?format=json"`.
 */

const RETIRED_BODY = [
  {
    message: [{ id: "175", key: "Invalid value", value: "The indicator was not found. It may have been deleted or archived." }],
  },
];

const DATA_BODY = [
  { page: 1, pages: 1, per_page: 500, total: 2 },
  [
    {
      indicator: { id: "EN.GHG.CO2.PC.CE.AR5", value: "Carbon dioxide (CO2) emissions excluding LULUCF per capita (t CO2e/capita)" },
      country: { id: "CO", value: "Colombia" },
      countryiso3code: "COL",
      date: "2020",
      value: 1.665,
      unit: "",
      decimal: 1,
    },
    {
      indicator: { id: "EN.GHG.CO2.PC.CE.AR5", value: "Carbon dioxide (CO2) emissions excluding LULUCF per capita (t CO2e/capita)" },
      country: { id: "CO", value: "Colombia" },
      countryiso3code: "COL",
      date: "2019",
      value: 1.9,
      unit: "",
      decimal: 1,
    },
  ],
];

function stubFetch(bodyFor: (url: string) => unknown) {
  const fetchMock = vi.fn(async (url: string) => ({
    ok: true,
    status: 200,
    json: async () => bodyFor(String(url)),
  }));
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("indicadores populares del Banco Mundial", () => {
  const indicators = getPopularIndicators();

  it("ninguno es un indicador que el Banco Mundial ya retiró", () => {
    const retired = Object.keys(RETIRED_WORLD_BANK_INDICATORS);
    expect(retired.length).toBeGreaterThan(0);
    for (const indicator of indicators) {
      expect(retired, `${indicator.id} está retirado; usa ${RETIRED_WORLD_BANK_INDICATORS[indicator.id]}`).not.toContain(indicator.id);
    }
  });

  it("los sustitutos de los retirados SÍ están en la lista", () => {
    const ids = indicators.map((i) => i.id);
    for (const replacement of Object.values(RETIRED_WORLD_BANK_INDICATORS)) expect(ids).toContain(replacement);
  });

  it("los sustitutos llevan la etiqueta en español (excluyen LULUCF, CO2e) y la unidad nueva en Mt", () => {
    const byId = new Map(indicators.map((i) => [i.id, i]));
    expect(byId.get("EN.GHG.CO2.PC.CE.AR5")?.name).toBe(
      "Emisiones de dióxido de carbono (CO2) per cápita, excluye LULUCF (uso de la tierra, cambio de uso de la tierra y silvicultura) (t CO2e/cápita)",
    );
    expect(byId.get("EN.GHG.ALL.MT.CE.AR5")?.name).toBe(
      "Emisiones totales de gases de efecto invernadero (GEI), excluye LULUCF (uso de la tierra, cambio de uso de la tierra y silvicultura) (Mt CO2e)",
    );
  });

  it("los ids son únicos y tienen la forma de un código del Banco Mundial", () => {
    const ids = indicators.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^[A-Z0-9]+(\.[A-Z0-9]+)+$/);
  });
});

describe("worldBankErrorMessage: un 200 con [{message}] es un error", () => {
  it("reconoce el cuerpo de indicador retirado y devuelve su texto", () => {
    expect(worldBankErrorMessage(RETIRED_BODY)).toBe("The indicator was not found. It may have been deleted or archived.");
  });

  it("no confunde un cuerpo con datos, uno vacío ni un valor que no es una lista", () => {
    expect(worldBankErrorMessage(DATA_BODY)).toBeNull();
    expect(worldBankErrorMessage([{ page: 1, pages: 0, per_page: 500, total: 0 }, null])).toBeNull();
    expect(worldBankErrorMessage([])).toBeNull();
    expect(worldBankErrorMessage(null)).toBeNull();
    expect(worldBankErrorMessage({ message: [] })).toBeNull();
  });

  it("un mensaje sin detalle sigue siendo un error", () => {
    expect(worldBankErrorMessage([{ message: [] }])).toBe("respuesta de error sin detalle");
  });
});

describe("cliente del Banco Mundial (fetch sustituido, sin red)", () => {
  it("un 200 con [{message}] da null y no una serie vacía tomada por buena", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    stubFetch(() => RETIRED_BODY);
    expect(await getIndicatorData("CO", "EN.ATM.CO2E.PC", 2018, 2020)).toBeNull();
    expect(warn).toHaveBeenCalledWith(expect.stringContaining("EN.ATM.CO2E.PC"));
  });

  it("con datos devuelve la serie ordenada por año", async () => {
    stubFetch(() => DATA_BODY);
    const series = await getIndicatorData("CO", "EN.GHG.CO2.PC.CE.AR5", 2018, 2020);
    expect(series?.data).toEqual([
      { year: 2019, value: 1.9 },
      { year: 2020, value: 1.665 },
    ]);
    expect(series?.indicatorName).toContain("excluding LULUCF");
  });

  it("getMultipleIndicators descarta los retirados y conserva los vigentes", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
    stubFetch((url) => (url.includes("EN.ATM.CO2E.PC") ? RETIRED_BODY : DATA_BODY));
    const result = await getMultipleIndicators("CO", ["EN.ATM.CO2E.PC", "EN.GHG.CO2.PC.CE.AR5"], 2018, 2020);
    expect(result.map((r) => r.indicatorId)).toEqual(["EN.GHG.CO2.PC.CE.AR5"]);
  });

  it("si todos los indicadores están retirados no queda ninguna serie (la página muestra 'sin datos')", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
    stubFetch(() => RETIRED_BODY);
    expect(await getMultipleIndicators("CO", ["EN.ATM.CO2E.PC", "EN.ATM.GHGT.KT.CE"], 2018, 2020)).toEqual([]);
  });

  it("un indicador vigente sin datos para ese país/rango ([{page...}, null]) también da null", async () => {
    stubFetch(() => [{ page: 1, pages: 0, per_page: 500, total: 0 }, null]);
    expect(await getIndicatorData("CO", "EN.GHG.CO2.PC.CE.AR5", 1900, 1901)).toBeNull();
  });
});
