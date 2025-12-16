
export interface CorrelationResult {
  column_a: string;
  column_b: string;
  pearson: number | null;
  spearman: number | null;
  kendall: number | null;
}

export interface DataRow {
  [key: string]: string | number | null | undefined;
}

export interface GrowthAnalysisResult {
    periods: string[];
    values: number[];
    growthRates: number[];
    cagr: number;
    totalChange: number;
    avgGrowthRate: number;
}
  
export interface TrendAnalysisResult {
    slope: number;
    intercept: number;
    r2: number;
    projections: Array<{ year: string; value: number }>;
    trend: 'increasing' | 'decreasing' | 'stable';
}
  
export interface ComparisonResult {
    countries: string[];
    years: string[];
    values: number[][]; // values[countryIndex][yearIndex]
    rankings: Array<{ year: string; ranking: Array<{ country: string; value: number; rank: number }> }>;
    statistics: {
      country: string;
      min: number;
      max: number;
      mean: number;
      stdDev: number;
    }[];
}

// Union Type for Analysis Result
export interface AnalysisResult {
  filename: string;
  type: 'correlation' | 'growth' | 'trend' | 'comparison';
  correlation_results?: CorrelationResult[];
  numeric_columns?: string[];
  raw_data?: DataRow[];
  growth_results?: { [key: string]: GrowthAnalysisResult }; // Map indicator/column name -> result
  trend_results?: { [key: string]: TrendAnalysisResult };
  comparison_results?: ComparisonResult;
}
