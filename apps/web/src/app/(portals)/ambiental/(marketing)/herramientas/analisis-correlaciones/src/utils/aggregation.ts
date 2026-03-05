/**
 * Temporal Data Aggregation Utilities
 * Handles different time scales and aggregation methods
 */

export interface TimeSeriesPoint {
  year: number;
  month?: number;
  value: number | null;
}

export interface AggregatedData {
  period: string; // e.g., "2020", "2020-Q1", "2020-01"
  value: number;
  count: number; // Number of data points aggregated
}

export type AggregationMethod = "mean" | "sum" | "min" | "max" | "median";
export type AggregationPeriod = "yearly" | "quarterly" | "monthly";

/**
 * Calculate mean of an array
 */
function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, val) => sum + val, 0) / values.length;
}

/**
 * Calculate median of an array
 */
function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

/**
 * Apply aggregation method to array of values
 */
function aggregate(values: number[], method: AggregationMethod): number {
  if (values.length === 0) return 0;

  switch (method) {
    case "mean":
      return mean(values);
    case "sum":
      return values.reduce((sum, val) => sum + val, 0);
    case "min":
      return Math.min(...values);
    case "max":
      return Math.max(...values);
    case "median":
      return median(values);
    default:
      return mean(values);
  }
}

/**
 * Aggregate data by year
 */
export function aggregateByYear(
  data: TimeSeriesPoint[],
  method: AggregationMethod = "mean",
): AggregatedData[] {
  const yearGroups = new Map<number, number[]>();

  data.forEach((point) => {
    if (point.value !== null) {
      if (!yearGroups.has(point.year)) {
        yearGroups.set(point.year, []);
      }
      const group = yearGroups.get(point.year);
      if (group) {
        group.push(point.value);
      }
    }
  });

  const result: AggregatedData[] = [];
  yearGroups.forEach((values, year) => {
    result.push({
      period: year.toString(),
      value: aggregate(values, method),
      count: values.length,
    });
  });

  return result.sort((a, b) => parseInt(a.period) - parseInt(b.period));
}

/**
 * Aggregate data by quarter
 */
export function aggregateByQuarter(
  data: TimeSeriesPoint[],
  method: AggregationMethod = "mean",
): AggregatedData[] {
  const quarterGroups = new Map<string, number[]>();

  data.forEach((point) => {
    if (point.value !== null && point.month) {
      const quarter = Math.ceil(point.month / 3);
      const key = `${point.year}-Q${quarter}`;

      if (!quarterGroups.has(key)) {
        quarterGroups.set(key, []);
      }
      const group = quarterGroups.get(key);
      if (group) {
        group.push(point.value);
      }
    }
  });

  const result: AggregatedData[] = [];
  quarterGroups.forEach((values, period) => {
    result.push({
      period,
      value: aggregate(values, method),
      count: values.length,
    });
  });

  return result.sort((a, b) => a.period.localeCompare(b.period));
}

/**
 * Aggregate data by month
 */
export function aggregateByMonth(
  data: TimeSeriesPoint[],
  method: AggregationMethod = "mean",
): AggregatedData[] {
  const monthGroups = new Map<string, number[]>();

  data.forEach((point) => {
    if (point.value !== null && point.month) {
      const key = `${point.year}-${String(point.month).padStart(2, "0")}`;

      if (!monthGroups.has(key)) {
        monthGroups.set(key, []);
      }
      const group = monthGroups.get(key);
      if (group) {
        group.push(point.value);
      }
    }
  });

  const result: AggregatedData[] = [];
  monthGroups.forEach((values, period) => {
    result.push({
      period,
      value: aggregate(values, method),
      count: values.length,
    });
  });

  return result.sort((a, b) => a.period.localeCompare(b.period));
}

/**
 * Detect temporal scale of data
 */
export function detectTemporalScale(
  data: TimeSeriesPoint[],
): AggregationPeriod {
  const hasMonthData = data.some((point) => point.month !== undefined);

  if (!hasMonthData) return "yearly";

  // Check density of data
  const years = new Set(data.map((p) => p.year));
  const months = data.filter((p) => p.month).length;

  const avgPointsPerYear = months / years.size;

  if (avgPointsPerYear >= 10) return "monthly";
  if (avgPointsPerYear >= 3) return "quarterly";
  return "yearly";
}

/**
 * Align two datasets to common time periods
 */
export function alignDatasets(
  dataset1: AggregatedData[],
  dataset2: AggregatedData[],
): { aligned1: number[]; aligned2: number[]; periods: string[] } {
  const periods1 = new Set(dataset1.map((d) => d.period));
  const periods2 = new Set(dataset2.map((d) => d.period));

  // Find common periods
  const commonPeriods = Array.from(periods1).filter((p) => periods2.has(p));
  commonPeriods.sort();

  // Create aligned arrays
  const map1 = new Map(dataset1.map((d) => [d.period, d.value]));
  const map2 = new Map(dataset2.map((d) => [d.period, d.value]));

  const aligned1 = commonPeriods
    .map((p) => map1.get(p))
    .filter((value): value is number => value !== undefined);
  const aligned2 = commonPeriods
    .map((p) => map2.get(p))
    .filter((value): value is number => value !== undefined);

  return {
    aligned1,
    aligned2,
    periods: commonPeriods,
  };
}

/**
 * Normalize data to 0-1 range
 */
export function normalizeData(values: number[]): number[] {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min;

  if (range === 0) return values.map(() => 0.5);

  return values.map((v) => (v - min) / range);
}

/**
 * Standardize data (z-score normalization)
 */
export function standardizeData(values: number[]): number[] {
  const avg = mean(values);
  const variance =
    values.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) /
    values.length;
  const stdDev = Math.sqrt(variance);

  if (stdDev === 0) return values.map(() => 0);

  return values.map((v) => (v - avg) / stdDev);
}

/**
 * Fill missing values with interpolation
 */
export function interpolateMissing(data: AggregatedData[]): AggregatedData[] {
  const result = [...data];

  for (let i = 0; i < result.length; i++) {
    if (result[i].value === 0 && result[i].count === 0) {
      // Find previous and next non-zero values
      let prevIdx = i - 1;
      while (prevIdx >= 0 && result[prevIdx].count === 0) prevIdx--;

      let nextIdx = i + 1;
      while (nextIdx < result.length && result[nextIdx].count === 0) nextIdx++;

      if (prevIdx >= 0 && nextIdx < result.length) {
        // Linear interpolation
        const prevVal = result[prevIdx].value;
        const nextVal = result[nextIdx].value;
        const steps = nextIdx - prevIdx;
        const step = (nextVal - prevVal) / steps;

        result[i].value = prevVal + step * (i - prevIdx);
        result[i].count = -1; // Mark as interpolated
      }
    }
  }

  return result;
}

/**
 * Calculate moving average
 */
export function movingAverage(
  data: AggregatedData[],
  windowSize: number = 3,
): AggregatedData[] {
  const result: AggregatedData[] = [];

  for (let i = 0; i < data.length; i++) {
    const start = Math.max(0, i - Math.floor(windowSize / 2));
    const end = Math.min(data.length, i + Math.ceil(windowSize / 2));
    const window = data.slice(start, end);

    const values = window.map((d) => d.value);
    result.push({
      period: data[i].period,
      value: mean(values),
      count: window.length,
    });
  }

  return result;
}

// ============================================================================
// NEW ANALYSIS TYPES
// ============================================================================

export interface GrowthAnalysisResult {
  periods: string[];
  values: number[];
  growthRates: number[]; // % change year-over-year
  cagr: number; // Compound Annual Growth Rate
  totalChange: number; // % change from start to end
  avgGrowthRate: number; // Average of all growth rates
}

/**
 * Calculate growth rates and CAGR
 */
export function calculateGrowthAnalysis(
  data: Array<{ year: string; value: number }>,
): GrowthAnalysisResult {
  const sortedData = [...data].sort(
    (a, b) => parseInt(a.year) - parseInt(b.year),
  );

  const periods = sortedData.map((d) => d.year);
  const values = sortedData.map((d) => d.value);
  const growthRates: number[] = [];

  // Calculate year-over-year growth rates
  for (let i = 1; i < values.length; i++) {
    const prevValue = values[i - 1];
    const currentValue = values[i];

    if (prevValue === 0) {
      growthRates.push(0);
    } else {
      const rate = ((currentValue - prevValue) / prevValue) * 100;
      growthRates.push(rate);
    }
  }

  // Calculate CAGR (Compound Annual Growth Rate)
  const startValue = values[0];
  const endValue = values[values.length - 1];
  const years = values.length - 1;

  let cagr = 0;
  if (startValue > 0 && years > 0) {
    cagr = (Math.pow(endValue / startValue, 1 / years) - 1) * 100;
  }

  // Total change
  const totalChange =
    startValue !== 0 ? ((endValue - startValue) / startValue) * 100 : 0;

  // Average growth rate
  const avgGrowthRate =
    growthRates.length > 0
      ? growthRates.reduce((sum, rate) => sum + rate, 0) / growthRates.length
      : 0;

  return {
    periods,
    values,
    growthRates,
    cagr,
    totalChange,
    avgGrowthRate,
  };
}

export interface TrendAnalysisResult {
  slope: number; // Linear regression slope
  intercept: number; // Linear regression intercept
  r2: number; // R-squared (goodness of fit)
  projections: Array<{ year: string; value: number }>; // Future projections
  trend: "increasing" | "decreasing" | "stable";
}

/**
 * Perform trend analysis with linear regression
 */
export function calculateTrendAnalysis(
  data: Array<{ year: string; value: number }>,
  projectYears: number = 3,
): TrendAnalysisResult {
  const sortedData = [...data].sort(
    (a, b) => parseInt(a.year) - parseInt(b.year),
  );

  // Prepare data for regression
  const x = sortedData.map((_, i) => i); // 0, 1, 2, ...
  const y = sortedData.map((d) => d.value);

  // Calculate means
  const xMean = x.reduce((sum, val) => sum + val, 0) / x.length;
  const yMean = y.reduce((sum, val) => sum + val, 0) / y.length;

  // Calculate slope and intercept
  let numerator = 0;
  let denominator = 0;

  for (let i = 0; i < x.length; i++) {
    numerator += (x[i] - xMean) * (y[i] - yMean);
    denominator += Math.pow(x[i] - xMean, 2);
  }

  const slope = denominator !== 0 ? numerator / denominator : 0;
  const intercept = yMean - slope * xMean;

  // Calculate R-squared
  let ssRes = 0; // Sum of squared residuals
  let ssTot = 0; // Total sum of squares

  for (let i = 0; i < x.length; i++) {
    const predicted = slope * x[i] + intercept;
    ssRes += Math.pow(y[i] - predicted, 2);
    ssTot += Math.pow(y[i] - yMean, 2);
  }

  const r2 = ssTot !== 0 ? 1 - ssRes / ssTot : 0;

  // Determine trend
  let trend: "increasing" | "decreasing" | "stable" = "stable";
  if (Math.abs(slope) > 0.01) {
    // Threshold for "stable"
    trend = slope > 0 ? "increasing" : "decreasing";
  }

  // Generate projections
  const lastYear = parseInt(sortedData[sortedData.length - 1].year);
  const projections: Array<{ year: string; value: number }> = [];

  for (let i = 1; i <= projectYears; i++) {
    const futureX = x.length - 1 + i;
    const projectedValue = slope * futureX + intercept;
    projections.push({
      year: (lastYear + i).toString(),
      value: Math.max(0, projectedValue), // Prevent negative projections
    });
  }

  return {
    slope,
    intercept,
    r2,
    projections,
    trend,
  };
}

export interface ComparisonResult {
  countries: string[];
  years: string[];
  values: number[][]; // values[countryIndex][yearIndex]
  rankings: Array<{
    year: string;
    ranking: Array<{ country: string; value: number; rank: number }>;
  }>;
  statistics: {
    country: string;
    min: number;
    max: number;
    mean: number;
    stdDev: number;
  }[];
}

/**
 * Compare multiple countries/datasets
 */
export function calculateComparisonAnalysis(
  datasets: Array<{
    name: string; // Country or dataset name
    data: Array<{ year: string; value: number }>;
  }>,
): ComparisonResult {
  // Get all unique years
  const allYears = new Set<string>();
  datasets.forEach((ds) => {
    ds.data.forEach((point) => allYears.add(point.year));
  });
  const years = Array.from(allYears).sort();

  // Build values matrix
  const countries = datasets.map((ds) => ds.name);
  const values: number[][] = [];

  datasets.forEach((ds) => {
    const yearValues: number[] = [];
    years.forEach((year) => {
      const point = ds.data.find((p) => p.year === year);
      yearValues.push(point?.value ?? 0);
    });
    values.push(yearValues);
  });

  // Calculate rankings for each year
  const rankings = years.map((year) => {
    const yearIndex = years.indexOf(year);
    const countryValues = countries.map((country, i) => ({
      country,
      value: values[i][yearIndex],
      rank: 0,
    }));

    // Sort by value descending
    countryValues.sort((a, b) => b.value - a.value);

    // Assign ranks
    countryValues.forEach((item, index) => {
      item.rank = index + 1;
    });

    return { year, ranking: countryValues };
  });

  // Calculate statistics for each country
  const statistics = datasets.map((ds, i) => {
    const countryValues = values[i].filter((v) => v > 0); // Exclude zeros

    if (countryValues.length === 0) {
      return {
        country: ds.name,
        min: 0,
        max: 0,
        mean: 0,
        stdDev: 0,
      };
    }

    const min = Math.min(...countryValues);
    const max = Math.max(...countryValues);
    const meanVal =
      countryValues.reduce((sum, v) => sum + v, 0) / countryValues.length;

    const variance =
      countryValues.reduce((sum, v) => sum + Math.pow(v - meanVal, 2), 0) /
      countryValues.length;
    const stdDev = Math.sqrt(variance);

    return {
      country: ds.name,
      min,
      max,
      mean: meanVal,
      stdDev,
    };
  });

  return {
    countries,
    years,
    values,
    rankings,
    statistics,
  };
}
