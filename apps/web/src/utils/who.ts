/**
 * WHO GHO (Global Health Observatory) OData API Integration
 * Base URL: https://ghoapi.azureedge.net/api
 * Documentation: https://www.who.int/data/gho/info/gho-odata-api
 */

export interface WHOIndicator {
  IndicatorCode: string;
  IndicatorName: string;
  Language: string;
}

export interface WHOCountry {
  Code: string;
  Title: string;
  Dimension: string;
  ParentDimension?: string;
  ParentCode?: string;
  ParentTitle?: string;
}

export interface WHODataPoint {
  Id: number;
  IndicatorCode: string;
  SpatialDimType: string;
  SpatialDim: string; // Country code
  TimeDimType: string;
  TimeDim: number; // Year
  Dim1Type?: string;
  Dim1?: string; // Sex, Age group, etc.
  DataSourceDimType?: string;
  DataSourceDim?: string;
  Value?: string;
  NumericValue?: number;
  Low?: number;
  High?: number;
  Comments?: string;
  Date?: string;
  TimeDimensionValue?: string;
  TimeDimensionBegin?: string;
  TimeDimensionEnd?: string;
}

export interface WHOTimeSeriesData {
  indicatorCode: string;
  indicatorName: string;
  countryCode: string;
  countryName: string;
  data: Array<{
    year: number;
    value: number;
  }>;
}

const BASE_URL = '/api/proxy/who';

/**
 * Indicadores populares de WHO GHO
 */
export const POPULAR_WHO_INDICATORS = [
  {
    code: 'WHOSIS_000001',
    name: 'Life expectancy at birth (years)',
    category: 'Health Status'
  },
  {
    code: 'SDGAIRBOD',
    name: 'Ambient air pollution - attributable deaths',
    category: 'Environmental Health'
  },
  {
    code: 'WSH_SANITATION_SAFELY_MANAGED',
    name: 'Population using safely managed sanitation services (%)',
    category: 'Water & Sanitation'
  },
  {
    code: 'WSH_WATER_SAFELY_MANAGED',
    name: 'Population using safely managed drinking water services (%)',
    category: 'Water & Sanitation'
  },
  {
    code: 'MDG_0000000025',
    name: 'Infant mortality rate (per 1000 live births)',
    category: 'Mortality'
  },
  {
    code: 'MDG_0000000026',
    name: 'Under-five mortality rate (per 1000 live births)',
    category: 'Mortality'
  },
  {
    code: 'SDGPM25',
    name: 'Annual mean PM2.5 concentration (μg/m³)',
    category: 'Environmental Health'
  },
  {
    code: 'NUTRITION_ANAEMIA_WOMEN',
    name: 'Prevalence of anaemia in women (%)',
    category: 'Nutrition'
  },
  {
    code: 'NUTRITION_WH_2',
    name: 'Prevalence of wasting in children under 5 (%)',
    category: 'Nutrition'
  },
  {
    code: 'SA_0000001462',
    name: 'Prevalence of current tobacco use (%)',
    category: 'Risk Factors'
  },
  {
    code: 'NCD_BMI_30A',
    name: 'Prevalence of obesity among adults (%)',
    category: 'Risk Factors'
  },
  {
    code: 'MALARIA_EST_DEATHS',
    name: 'Estimated malaria deaths',
    category: 'Communicable Diseases'
  },
  {
    code: 'TB_e_mort_exc_tbhiv_100k',
    name: 'Tuberculosis mortality rate (per 100,000)',
    category: 'Communicable Diseases'
  },
  {
    code: 'HIV_0000000001',
    name: 'HIV prevalence among adults aged 15-49 (%)',
    category: 'Communicable Diseases'
  },
  {
    code: 'WHOSIS_000015',
    name: 'Maternal mortality ratio (per 100,000 live births)',
    category: 'Mortality'
  }
];

/**
 * Fetch all available WHO countries
 */
export async function getWHOCountries(): Promise<WHOCountry[]> {
  try {
    // Uso de proxy: path=DIMENSION/COUNTRY/DimensionValues
    const response = await fetch(`${BASE_URL}?path=DIMENSION/COUNTRY/DimensionValues`);
    if (!response.ok) {
      throw new Error(`WHO API error: ${response.status}`);
    }
    const data = await response.json();
    return data.value || [];
  } catch (error) {
    console.error('Error fetching WHO countries:', error);
    throw error;
  }
}

/**
 * Get popular WHO indicators
 */
export function getPopularWHOIndicators() {
  return POPULAR_WHO_INDICATORS;
}

/**
 * Search WHO indicators by keyword
 */
export async function searchWHOIndicators(keyword: string): Promise<WHOIndicator[]> {
  try {
    const response = await fetch(`${BASE_URL}?path=Indicator`);
    if (!response.ok) {
      throw new Error(`WHO API error: ${response.status}`);
    }
    const data = await response.json();
    const indicators = data.value || [];
    
    // Filter by keyword
    const filtered = indicators.filter((ind: WHOIndicator) =>
      ind.IndicatorName.toLowerCase().includes(keyword.toLowerCase()) ||
      ind.IndicatorCode.toLowerCase().includes(keyword.toLowerCase())
    );
    
    return filtered.slice(0, 50); // Limit results
  } catch (error) {
    console.error('Error searching WHO indicators:', error);
    throw error;
  }
}

/**
 * Fetch time series data for a specific indicator and country
 */
export async function getWHOIndicatorData(
  indicatorCode: string,
  countryCode: string,
  startYear?: number,
  endYear?: number
): Promise<WHOTimeSeriesData> {
  try {
    // Build OData filter
    let filter = `SpatialDim eq '${countryCode}'`;
    if (startYear) {
      filter += ` and TimeDim ge ${startYear}`;
    }
    if (endYear) {
      filter += ` and TimeDim le ${endYear}`;
    }

    const url = `${BASE_URL}?path=${indicatorCode}&$filter=${encodeURIComponent(filter)}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`WHO API error: ${response.status}`);
    }

    const result = await response.json();
    const dataPoints: WHODataPoint[] = result.value || [];

    // Get indicator name
    const indicator = POPULAR_WHO_INDICATORS.find(ind => ind.code === indicatorCode);
    const indicatorName = indicator?.name || indicatorCode;

    // Get country name
    const countries = await getWHOCountries();
    const country = countries.find(c => c.Code === countryCode);
    const countryName = country?.Title || countryCode;

    // Process and aggregate data (some indicators have multiple dimensions)
    const yearValueMap = new Map<number, number[]>();
    
    dataPoints.forEach(point => {
      if (point.NumericValue !== null && point.NumericValue !== undefined) {
        if (!yearValueMap.has(point.TimeDim)) {
          yearValueMap.set(point.TimeDim, []);
        }
        yearValueMap.get(point.TimeDim)!.push(point.NumericValue);
      }
    });

    // Calculate mean for each year (in case of multiple values per year)
    const data = Array.from(yearValueMap.entries())
      .map(([year, values]) => ({
        year,
        value: values.reduce((sum, val) => sum + val, 0) / values.length
      }))
      .sort((a, b) => a.year - b.year);

    return {
      indicatorCode,
      indicatorName,
      countryCode,
      countryName,
      data
    };
  } catch (error) {
    console.error(`Error fetching WHO data for ${indicatorCode}:`, error);
    throw error;
  }
}

/**
 * Fetch multiple indicators for correlation analysis
 */
export async function getMultipleWHOIndicators(
  indicatorCodes: string[],
  countryCode: string,
  startYear?: number,
  endYear?: number
): Promise<WHOTimeSeriesData[]> {
  try {
    const promises = indicatorCodes.map(code =>
      getWHOIndicatorData(code, countryCode, startYear, endYear)
    );
    return await Promise.all(promises);
  } catch (error) {
    console.error('Error fetching multiple WHO indicators:', error);
    throw error;
  }
}

/**
 * Convert WHO data to a format compatible with correlation analysis
 */
export function formatWHODataForCorrelation(data: WHOTimeSeriesData) {
  return data.data.map(point => ({
    year: point.year.toString(),
    value: point.value
  }));
}
