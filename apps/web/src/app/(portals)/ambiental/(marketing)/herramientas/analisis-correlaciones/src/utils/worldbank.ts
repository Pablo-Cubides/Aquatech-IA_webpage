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

const WB_API_BASE = "https://api.worldbank.org/v2";
const DEFAULT_PER_PAGE = 500;

/**
 * Get list of available countries
 */
export async function getCountries(): Promise<WBCountry[]> {
  try {
    const response = await fetch(
      `${WB_API_BASE}/country?format=json&per_page=300`
    );
    const data = await response.json();

    if (Array.isArray(data) && data.length > 1) {
      return data[1].filter(
        (country: WBCountry) =>
          country.region.value !== "Aggregates" && country.capitalCity
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
    {
      id: "EN.ATM.CO2E.PC",
      name: "Emisiones de CO2 (toneladas métricas per cápita)",
      sourceNote:
        "Emisiones de dióxido de carbono son las que provienen de la quema de combustibles fósiles",
      sourceOrganization: "Carbon Dioxide Information Analysis Center, ORNL",
    },
    {
      id: "EN.ATM.PM25.MC.M3",
      name: "Contaminación del aire PM2.5 (microgramos por metro cúbico)",
      sourceNote:
        "Exposición media anual de la población a concentraciones de partículas PM2.5",
      sourceOrganization: "Brauer et al. 2017, for Global Burden of Disease Study",
    },
    {
      id: "AG.LND.FRST.ZS",
      name: "Área forestal (% del área de tierra)",
      sourceNote:
        "Área forestal es la tierra bajo cobertura de bosques naturales o plantados",
      sourceOrganization: "Organización de las Naciones Unidas para la Alimentación y la Agricultura",
    },
    {
      id: "ER.H2O.FWTL.K3",
      name: "Extracción anual de agua dulce (km³)",
      sourceNote:
        "Extracción anual de agua dulce se refiere al volumen total de agua extraída",
      sourceOrganization: "Food and Agriculture Organization, AQUASTAT data",
    },
    {
      id: "EN.ATM.GHGT.KT.CE",
      name: "Emisiones de GEI (kt de equivalente de CO2)",
      sourceNote:
        "Emisiones totales de gases de efecto invernadero en equivalentes de CO2",
      sourceOrganization: "Climate Watch",
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
      sourceOrganization: "WHO/UNICEF Joint Monitoring Programme (JMP) for Water Supply, Sanitation and Hygiene",
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
      sourceOrganization: "Food and Agriculture Organization and World Bank estimates",
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
  page: number = 1
): Promise<{ indicators: WBIndicator[]; total: number }> {
  try {
    const response = await fetch(
      `${WB_API_BASE}/indicator?format=json&per_page=${DEFAULT_PER_PAGE}&page=${page}`
    );
    const data = await response.json();

    if (Array.isArray(data) && data.length > 1) {
      const allIndicators = data[1] as WBIndicator[];
      const filtered = allIndicators.filter(
        (ind) =>
          ind.name.toLowerCase().includes(query.toLowerCase()) ||
          ind.sourceNote?.toLowerCase().includes(query.toLowerCase())
      );

      return {
        indicators: filtered,
        total: filtered.length,
      };
    }
    return { indicators: [], total: 0 };
  } catch (error) {
    console.error("Error searching indicators:", error);
    return { indicators: [], total: 0 };
  }
}

/**
 * Get time series data for a specific indicator and country
 */
export async function getIndicatorData(
  countryCode: string,
  indicatorId: string,
  startYear: number,
  endYear: number
): Promise<WBTimeSeriesData | null> {
  try {
    const response = await fetch(
      `${WB_API_BASE}/country/${countryCode}/indicator/${indicatorId}?format=json&date=${startYear}:${endYear}&per_page=${DEFAULT_PER_PAGE}`
    );
    const data = await response.json();

    if (Array.isArray(data) && data.length > 1) {
      const rawData = data[1] as WBDataPoint[];

      if (rawData.length === 0) return null;

      const timeSeriesData: WBTimeSeriesData = {
        indicatorId: indicatorId,
        indicatorName: rawData[0].indicator.value,
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
      error
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
  endYear: number
): Promise<WBTimeSeriesData[]> {
  const promises = indicatorIds.map((id) =>
    getIndicatorData(countryCode, id, startYear, endYear)
  );

  const results = await Promise.all(promises);
  return results.filter((r) => r !== null) as WBTimeSeriesData[];
}

/**
 * Get available years range for a country
 */
export async function getAvailableYears(
  countryCode: string
): Promise<{ min: number; max: number }> {
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
