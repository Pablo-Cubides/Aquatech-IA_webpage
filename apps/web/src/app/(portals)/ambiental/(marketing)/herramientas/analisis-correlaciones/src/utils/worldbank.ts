/**
 * World Bank API Integration Service
 * API Documentation: https://datahelpdesk.worldbank.org/knowledgebase/articles/889392-about-the-indicators-api-documentation
 */

export interface WBIndicator {
  id: string;
  name: string;
  sourceNote: string;
  sourceOrganization: string;
  topics?: Array<{ id: string; value: string }>;
}

export interface WBCountry {
  id: string;
  iso2Code: string;
  name: string;
  region: { id: string; value: string };
  incomeLevel: { id: string; value: string };
  capitalCity: string;
  longitude: string;
  latitude: string;
}

export interface WBDataPoint {
  indicator: { id: string; value: string };
  country: { id: string; value: string };
  countryiso3code: string;
  date: string; // Year as string
  value: number | null;
  unit: string;
  decimal: number;
}

export interface WBTimeSeriesData {
  indicatorId: string;
  indicatorName: string;
  countryId: string;
  countryName: string;
  data: Array<{ year: number; value: number | null }>;
}

const WB_API_BASE = "/api/proxy/worldbank";
const DEFAULT_PER_PAGE = 500;

/**
 * Indicadores que el Banco Mundial retiró: su API responde HTTP 200 con `[{"message":[{"id":"175",
 * "value":"The indicator was not found. It may have been deleted or archived."}]}]`. Verificado con
 * una consulta directa a api.worldbank.org el 2026-11-17. Una prueba comprueba que ninguno de los de
 * getPopularIndicators() esté aquí; si el Banco Mundial retira otro, añádelo con su sustituto.
 */
export const RETIRED_WORLD_BANK_INDICATORS: Readonly<Record<string, string>> = {
  "EN.ATM.CO2E.PC": "EN.GHG.CO2.PC.CE.AR5",
  "EN.ATM.GHGT.KT.CE": "EN.GHG.ALL.MT.CE.AR5",
};

/**
 * La API del Banco Mundial responde HTTP 200 también cuando falla: el cuerpo es `[{"message":[{id,key,value}]}]`
 * en lugar de `[{page,pages,...}, [datos]]`. Devuelve el texto del error, o null si el cuerpo no es un error.
 * Un 200 así NO es un éxito: la herramienta debe tratarlo como "sin datos".
 */
export function worldBankErrorMessage(body: unknown): string | null {
  if (!Array.isArray(body) || body.length === 0) return null;
  const first: unknown = body[0];
  if (!first || typeof first !== "object" || !("message" in first)) return null;
  const message = (first as { message: unknown }).message;
  if (!Array.isArray(message)) return "respuesta de error sin detalle";
  const texts = message
    .map((item) => (item && typeof item === "object" && "value" in item ? String((item as { value: unknown }).value) : ""))
    .filter(Boolean);
  return texts.join("; ") || "respuesta de error sin detalle";
}

/**
 * Get list of available countries
 */
export async function getCountries(): Promise<WBCountry[]> {
  try {
    // Usando el proxy: path=country
    const response = await fetch(
      `${WB_API_BASE}?path=country&format=json&per_page=300`,
    );
    const data = await response.json();
    const apiError = worldBankErrorMessage(data);
    if (apiError) throw new Error(`World Bank API: ${apiError}`);

    if (Array.isArray(data) && data.length > 1) {
      return data[1].filter(
        (country: WBCountry) =>
          country.region.value !== "Aggregates" && country.capitalCity,
      );
    }
    return [];
  } catch (error) {
    console.error("Error fetching countries:", error);
    return [];
  }
}

/**
 * Get list of popular environmental and economic indicators
 */
export function getPopularIndicators(): WBIndicator[] {
  return [
    // Environmental Indicators
    // Nombre, nota y fuente de EN.GHG.* tal como los publica el Banco Mundial (API v2, consultada el
    // 2026-11-17; el Banco Mundial no ofrece estos textos en español). El nombre y la nota de abajo son
    // traducción fiel de CONT (2026-11-19) de ese texto en inglés; la fuente (organización) se deja en el
    // original. Sustituyen a EN.ATM.CO2E.PC y
    // EN.ATM.GHGT.KT.CE, retirados por el Banco Mundial (ver RETIRED_WORLD_BANK_INDICATORS).
    {
      id: "EN.GHG.CO2.PC.CE.AR5",
      name: "Emisiones de dióxido de carbono (CO2) per cápita, excluye LULUCF (uso de la tierra, cambio de uso de la tierra y silvicultura) (t CO2e/cápita)",
      sourceNote:
        "Código EN.GHG.CO2.PC.CE.AR5. Emisiones anuales totales de dióxido de carbono (CO2), uno de los seis gases de efecto invernadero (GEI) de Kioto, de los sectores agrícola, energético, de residuos e industrial, excluido LULUCF, expresadas en valores equivalentes de dióxido de carbono y divididas por la población de la economía. Esta medida excluye los flujos de GEI causados por el uso de la tierra, el cambio de uso de la tierra y la silvicultura (LULUCF), porque esos flujos tienen mayores incertidumbres.",
      sourceOrganization:
        "EDGAR (Emissions Database for Global Atmospheric Research) Community GHG Database, Joint Research Centre (JRC) - European Commission",
    },
    {
      id: "EN.ATM.PM25.MC.M3",
      name: "Contaminación del aire PM2.5 (microgramos por metro cúbico)",
      sourceNote:
        "Exposición media anual de la población a concentraciones de partículas PM2.5",
      sourceOrganization:
        "Brauer et al. 2017, for Global Burden of Disease Study",
    },
    {
      id: "AG.LND.FRST.ZS",
      name: "Área forestal (% del área de tierra)",
      sourceNote:
        "Área forestal es la tierra bajo cobertura de bosques naturales o plantados",
      sourceOrganization:
        "Organización de las Naciones Unidas para la Alimentación y la Agricultura",
    },
    {
      id: "ER.H2O.FWTL.K3",
      name: "Extracción anual de agua dulce (km³)",
      sourceNote:
        "Extracción anual de agua dulce se refiere al volumen total de agua extraída",
      sourceOrganization: "Food and Agriculture Organization, AQUASTAT data",
    },
    {
      id: "EN.GHG.ALL.MT.CE.AR5",
      // OJO: la unidad pasó de kt (indicador retirado) a Mt de CO2e.
      name: "Emisiones totales de gases de efecto invernadero (GEI), excluye LULUCF (uso de la tierra, cambio de uso de la tierra y silvicultura) (Mt CO2e)",
      sourceNote:
        "Código EN.GHG.ALL.MT.CE.AR5. Medida de las emisiones anuales de los seis gases de efecto invernadero (GEI) cubiertos por el Protocolo de Kioto (dióxido de carbono (CO2), metano (CH4), óxido nitroso (N2O), hidrofluorocarbonos (HFC), perfluorocarbonos (PFC) y hexafluoruro de azufre (SF6)) de los sectores de energía, industria, residuos y agricultura, expresadas en valores equivalentes de dióxido de carbono. Esta medida excluye los flujos de GEI causados por el uso de la tierra, el cambio de uso de la tierra y la silvicultura (LULUCF), porque esos flujos tienen mayores incertidumbres. La equivalencia se calcula con los factores de potencial de calentamiento global (GWP) del Quinto Informe de Evaluación (AR5) del IPCC.",
      sourceOrganization:
        "EDGAR (Emissions Database for Global Atmospheric Research) Community GHG Database, Joint Research Centre (JRC) - European Commission",
    },
    {
      id: "EG.USE.ELEC.KH.PC",
      name: "Uso de energía eléctrica (kWh per cápita)",
      sourceNote: "Consumo de energía eléctrica per cápita",
      sourceOrganization: "IEA Statistics © OECD/IEA 2018",
    },

    // Socioeconomic Indicators
    {
      id: "NY.GDP.MKTP.CD",
      name: "PIB (US$ a precios actuales)",
      sourceNote:
        "Producto interno bruto a precios de mercado en dólares estadounidenses actuales",
      sourceOrganization: "World Bank national accounts data",
    },
    {
      id: "NY.GDP.PCAP.CD",
      name: "PIB per cápita (US$ actuales)",
      sourceNote: "PIB dividido por la población a mitad de año",
      sourceOrganization: "World Bank national accounts data",
    },
    {
      id: "SP.POP.TOTL",
      name: "Población total",
      sourceNote:
        "Población total basada en la definición de facto de población",
      sourceOrganization: "World Bank staff estimates",
    },
    {
      id: "SP.URB.TOTL.IN.ZS",
      name: "Población urbana (% del total)",
      sourceNote:
        "Porcentaje de población que vive en áreas urbanas según se definen por las oficinas nacionales de estadística",
      sourceOrganization: "United Nations Population Division",
    },
    {
      id: "SH.STA.BASS.ZS",
      name: "Acceso a servicios básicos de agua potable (% población)",
      sourceNote:
        "Porcentaje de personas que utilizan al menos servicios básicos de agua potable",
      sourceOrganization:
        "WHO/UNICEF Joint Monitoring Programme (JMP) for Water Supply, Sanitation and Hygiene",
    },
    {
      id: "AG.LND.AGRI.ZS",
      name: "Tierra agrícola (% del área de tierra)",
      sourceNote:
        "Tierra agrícola se refiere a la participación del área de tierra que es cultivable",
      sourceOrganization: "Food and Agriculture Organization",
    },
    {
      id: "ER.GDP.FWTL.M3.KD",
      name: "Productividad del agua (PIB constante de 2015 US$ por m³)",
      sourceNote:
        "Productividad del agua es calculada como el PIB dividido por el total de extracciones de agua dulce",
      sourceOrganization: "Food and Agriculture Organization, AQUASTAT data",
    },
    {
      id: "EN.POP.DNST",
      name: "Densidad de población (personas por km²)",
      sourceNote:
        "Densidad de población es la población de mitad de año dividida por área de tierra en km²",
      sourceOrganization:
        "Food and Agriculture Organization and World Bank estimates",
    },
    {
      id: "EG.ELC.RNEW.ZS",
      name: "Electricidad de fuentes renovables (% del total)",
      sourceNote:
        "Electricidad generada de fuentes renovables como porcentaje del total",
      sourceOrganization: "IEA Statistics © OECD/IEA",
    },
  ];
}

/**
 * Search indicators by keyword
 */
export async function searchIndicators(
  query: string,
  page: number = 1,
): Promise<{ indicators: WBIndicator[]; total: number }> {
  try {
    // Send q parameter to search indicators server-side for efficiency
    const searchParams = new URLSearchParams({
      path: "indicator",
      format: "json",
      per_page: "100",
      page: page.toString(),
      q: query,
    });

    const response = await fetchWithRetry(`${WB_API_BASE}?${searchParams.toString()}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const apiError = worldBankErrorMessage(data);
    if (apiError) throw new Error(`World Bank API: ${apiError}`);

    if (Array.isArray(data) && data.length > 1) {
      const allIndicators = data[1] as WBIndicator[];
      const filtered = allIndicators.filter(
        (ind) =>
          ind.name.toLowerCase().includes(query.toLowerCase()) ||
          ind.sourceNote?.toLowerCase().includes(query.toLowerCase()),
      );

      return {
        indicators: filtered.length > 0 ? filtered : allIndicators,
        total: data[0]?.total || filtered.length,
      };
    }
    return { indicators: [], total: 0 };
  } catch (error) {
    console.error("Error searching indicators:", error);
    return { indicators: [], total: 0 };
  }
}

/**
 * Helper to fetch with retry and exponential backoff
 */
async function fetchWithRetry(url: string, retries = 3, delay = 1000): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      // If we get rate limited (429) or server error, we retry
      if (response.status === 429 || response.status >= 500) {
        if (i < retries - 1) {
          console.warn(`[WorldBank API] Status ${response.status}. Retrying in ${delay}ms...`);
          await new Promise((res) => setTimeout(res, delay));
          delay *= 2; // Exponential backoff
          continue;
        }
      }
      return response;
    } catch (err) {
      if (i === retries - 1) throw err;
      console.warn(`[WorldBank API] Connection error. Retrying in ${delay}ms...`);
      await new Promise((res) => setTimeout(res, delay));
      delay *= 2;
    }
  }
  throw new Error("Failed to fetch after multiple retries");
}

/**
 * Nombre en español de un indicador de la lista de la herramienta (getPopularIndicators), o undefined si el
 * ID no está en la lista. La serie usa este nombre para que lo que se elige y lo que se grafica coincidan;
 * si no hay entrada, se conserva el nombre del Banco Mundial tal cual (CONT-008).
 */
export function localizedIndicatorName(indicatorId: string): string | undefined {
  return getPopularIndicators().find((indicator) => indicator.id === indicatorId)?.name;
}

/**
 * Get time series data for a specific indicator and country
 */
export async function getIndicatorData(
  countryCode: string,
  indicatorId: string,
  startYear: number,
  endYear: number,
): Promise<WBTimeSeriesData | null> {
  try {
    const path = `country/${countryCode}/indicator/${indicatorId}`;
    const response = await fetchWithRetry(
      `${WB_API_BASE}?path=${path}&format=json&date=${startYear}:${endYear}&per_page=${DEFAULT_PER_PAGE}`,
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();

    // HTTP 200 con `[{"message":...}]` (indicador retirado, parámetro inválido...) NO es un éxito.
    const apiError = worldBankErrorMessage(data);
    if (apiError) {
      console.warn(`[WorldBank API] ${indicatorId} en ${countryCode}: ${apiError}`);
      return null;
    }

    if (Array.isArray(data) && data.length > 1) {
      const rawData = data[1] as WBDataPoint[] | null;

      if (!rawData || rawData.length === 0) return null;

      const timeSeriesData: WBTimeSeriesData = {
        indicatorId: indicatorId,
        indicatorName: localizedIndicatorName(indicatorId) ?? rawData[0].indicator.value,
        countryId: countryCode,
        countryName: rawData[0].country.value,
        data: rawData
          .map((point) => ({
            year: parseInt(point.date),
            value: point.value,
          }))
          .sort((a, b) => a.year - b.year),
      };

      return timeSeriesData;
    }
    return null;
  } catch (error) {
    console.error(
      `Error fetching data for ${indicatorId} in ${countryCode}:`,
      error,
    );
    return null;
  }
}

/**
 * Get multiple indicators for a country
 */
export async function getMultipleIndicators(
  countryCode: string,
  indicatorIds: string[],
  startYear: number,
  endYear: number,
): Promise<WBTimeSeriesData[]> {
  const promises = indicatorIds.map((id) =>
    getIndicatorData(countryCode, id, startYear, endYear),
  );

  const results = await Promise.all(promises);
  return results.filter((r) => r !== null) as WBTimeSeriesData[];
}

/**
 * Get available years range for a country
 */
export async function getAvailableYears(): Promise<{
  min: number;
  max: number;
}> {
  try {
    // Default range based on typical World Bank data availability
    return {
      min: 1960,
      max: new Date().getFullYear() - 1,
    };
  } catch (error) {
    console.error("Error getting available years:", error);
    return { min: 1960, max: 2023 };
  }
}
