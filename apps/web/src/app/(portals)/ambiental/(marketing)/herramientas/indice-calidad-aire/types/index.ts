/**
 * Air Quality Index Calculator - Core Types
 * Supports: US AQI, ICA Colombia, IBOCA Bogotá, EAQI Europe, WHO Index
 */

// ============================================
// POLLUTANT TYPES
// ============================================

export type PollutantId = 
  | 'pm25'    // PM₂.₅
  | 'pm10'    // PM₁₀
  | 'o3'      // Ozone
  | 'no2'     // Nitrogen Dioxide
  | 'so2'     // Sulfur Dioxide
  | 'co';     // Carbon Monoxide

export interface Pollutant {
  id: PollutantId;
  name: string;
  nameLong: string;
  unit: 'µg/m³' | 'mg/m³' | 'ppm' | 'ppb';
  description: string;
}

export const POLLUTANTS: Record<PollutantId, Pollutant> = {
  pm25: {
    id: 'pm25',
    name: 'PM₂.₅',
    nameLong: 'Material Particulado Fino',
    unit: 'µg/m³',
    description: 'Partículas con diámetro ≤ 2.5 micrómetros',
  },
  pm10: {
    id: 'pm10',
    name: 'PM₁₀',
    nameLong: 'Material Particulado',
    unit: 'µg/m³',
    description: 'Partículas con diámetro ≤ 10 micrómetros',
  },
  o3: {
    id: 'o3',
    name: 'O₃',
    nameLong: 'Ozono Troposférico',
    unit: 'µg/m³',
    description: 'Ozono a nivel del suelo',
  },
  no2: {
    id: 'no2',
    name: 'NO₂',
    nameLong: 'Dióxido de Nitrógeno',
    unit: 'µg/m³',
    description: 'Gas tóxico de combustión',
  },
  so2: {
    id: 'so2',
    name: 'SO₂',
    nameLong: 'Dióxido de Azufre',
    unit: 'µg/m³',
    description: 'Gas de combustión de azufre',
  },
  co: {
    id: 'co',
    name: 'CO',
    nameLong: 'Monóxido de Carbono',
    unit: 'mg/m³',
    description: 'Gas incoloro de combustión incompleta',
  },
};

// ============================================
// BREAKPOINT TYPES
// ============================================

export interface Breakpoint {
  /** Lower concentration limit */
  bpLo: number;
  /** Upper concentration limit */
  bpHi: number;
  /** Lower index limit */
  iLo: number;
  /** Upper index limit */
  iHi: number;
}

export interface PollutantBreakpoints {
  pollutantId: PollutantId;
  /** Averaging period in hours (e.g., 1, 8, 24) */
  averagingPeriod: number;
  breakpoints: Breakpoint[];
}

// ============================================
// CATEGORY TYPES
// ============================================

export interface Category {
  /** Lower index bound (inclusive) */
  min: number;
  /** Upper index bound (inclusive) */
  max: number;
  /** Category name */
  name: string;
  /** Short name for display */
  shortName: string;
  /** CSS color class or hex */
  color: string;
  /** Background color for cards */
  bgColor: string;
  /** Health message */
  healthMessage: string;
  /** Actions to take */
  actions: string;
}

// ============================================
// INDEX PROFILE TYPES
// ============================================

export type IndexProfileId = 
  | 'us-aqi'
  | 'ica-colombia'
  | 'iboca-bogota'
  | 'eaqi-europe'
  | 'who-index';

export interface IndexProfile {
  id: IndexProfileId;
  name: string;
  nameLong: string;
  country: string;
  description: string;
  normativeReference: string;
  /** Range of the index (e.g., 0-500 for AQI, 0-100% for WHO) */
  range: { min: number; max: number };
  /** Pollutant breakpoints for this index */
  pollutantBreakpoints: PollutantBreakpoints[];
  /** Categories for this index */
  categories: Category[];
  /** Whether this index uses percentage over guideline (WHO style) */
  isPercentageBased?: boolean;
}

// ============================================
// MEASUREMENT TYPES
// ============================================

export interface PollutantMeasurement {
  pollutantId: PollutantId;
  /** Concentration value */
  value: number;
  /** Unit of measurement */
  unit: 'µg/m³' | 'mg/m³' | 'ppm' | 'ppb';
  /** Averaging period in hours */
  averagingPeriod?: number;
}

export interface AirQualityMeasurement {
  /** Station or location identifier */
  stationId?: string;
  /** Station name */
  stationName?: string;
  /** Location (city, country) */
  location?: string;
  /** Measurement date/time */
  datetime: string;
  /** Individual pollutant measurements */
  pollutants: PollutantMeasurement[];
  /** Data source (manual, csv, openaq, etc.) */
  source: 'manual' | 'csv' | 'openaq' | 'airnow' | 'eea';
}

// ============================================
// CALCULATION RESULT TYPES
// ============================================

export interface SubIndexResult {
  pollutantId: PollutantId;
  pollutantName: string;
  concentration: number;
  unit: string;
  subIndex: number;
  category: Category;
  /** Breakpoint range used for calculation */
  breakpointUsed?: {
    bpLo: number;
    bpHi: number;
    iLo: number;
    iHi: number;
  };
}

export interface AQIResult {
  /** The index profile used */
  profileId: IndexProfileId;
  profileName: string;
  /** Final index value */
  index: number;
  /** Category for the final index */
  category: Category;
  /** The pollutant that determined the final index */
  criticalPollutant: PollutantId;
  criticalPollutantName: string;
  /** Individual sub-indices */
  subIndices: SubIndexResult[];
  /** Pollutants that were missing data */
  missingPollutants: PollutantId[];
  /** Original measurement data */
  measurement: AirQualityMeasurement;
  /** Calculation timestamp */
  calculatedAt: string;
}

// ============================================
// WHO SPECIFIC TYPES
// ============================================

export interface WHOGuideline {
  pollutantId: PollutantId;
  /** Annual guideline value */
  annualGuideline?: number;
  /** 24-hour guideline value */
  daily24hGuideline?: number;
  /** 8-hour guideline value */
  eightHourGuideline?: number;
  /** 1-hour guideline value */
  oneHourGuideline?: number;
  unit: 'µg/m³' | 'mg/m³';
}

export interface WHOResult {
  pollutantId: PollutantId;
  pollutantName: string;
  concentration: number;
  guideline: number;
  /** Percentage of guideline (100 = exactly at guideline) */
  percentage: number;
  /** Category based on percentage */
  category: 'complies' | 'slight-excess' | 'high-excess' | 'extreme-excess';
  categoryName: string;
  color: string;
}

// ============================================
// API/DATA SOURCE TYPES
// ============================================

export interface OpenAQStation {
  id: number;
  name: string;
  city?: string;
  country: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  parameters: PollutantId[];
}

export interface OpenAQMeasurement {
  date: {
    utc: string;
    local: string;
  };
  value: number;
  unit: string;
  parameter: string;
  location: string;
  city?: string;
  country: string;
}

// ============================================
// COMPARISON TYPES
// ============================================

export interface ComparisonData {
  measurements: AirQualityMeasurement[];
  results: AQIResult[];
  /** Comparison type */
  type: 'time-series' | 'stations' | 'indices';
}

// ============================================
// DATA SOURCE TYPES
// ============================================

export type DataSource = 'manual' | 'csv' | 'openaq';

export interface DataSourceConfig {
  source: DataSource;
  /** For OpenAQ: country code */
  country?: string;
  /** For OpenAQ: city name */
  city?: string;
  /** Date range */
  startDate?: string;
  endDate?: string;
}
