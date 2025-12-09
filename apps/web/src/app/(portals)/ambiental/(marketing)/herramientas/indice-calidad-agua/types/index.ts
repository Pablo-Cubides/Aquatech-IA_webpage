// Tipos para la aplicación de índices de calidad del agua

export type Country = "Colombia" | "Internacional" | "Otro";

export type DataSource = "manual" | "csv" | "api";

export type IndexType = "IRCA" | "WQI" | "DWQI";

export interface WaterParameter {
  name: string;
  value: number;
  unit: string;
  timestamp?: Date;
}

export interface WaterSample {
  id: string;
  date: Date;
  location: string;
  country: Country;
  source: string;
  parameters: WaterParameter[];
  indices?: {
    IRCA?: IndexResult;
    WQI?: IndexResult;
    DWQI?: IndexResult;
  };
}

export interface IndexResult {
  value: number;
  category: string;
  riskLevel?: string;
  details: IndexDetail[];
  missingParameters?: string[];
  calculationDate: Date;
}

export interface IndexDetail {
  parameter: string;
  measuredValue: number;
  unit: string;
  standard?: number;
  complies: boolean;
  contribution?: number;
  qi?: number;
  weight?: number;
}

export interface IRCAParameter {
  name: string;
  unit: string;
  riskScore: number;
  minValue?: number;
  maxValue?: number;
  referenceNorm: string;
}

export interface WQIParameter {
  name: string;
  unit: string;
  weight: number;
  qiCurve: Array<{ value: number; qi: number }>;
}

export interface DWQIParameter {
  name: string;
  unit: string;
  standard: number; // Si (valor límite permisible)
  idealValue: number; // Vi (valor ideal, 0 para la mayoría)
  referenceNorm: string;
}

export interface NormProfile {
  id: string;
  name: string;
  country: Country;
  description: string;
  ircaParameters?: IRCAParameter[];
  wqiParameters?: WQIParameter[];
  dwqiParameters?: DWQIParameter[];
}

export interface ComparisonConfig {
  indexType: IndexType;
  samples: WaterSample[];
  groupBy: "date" | "location" | "country";
}

export interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
  }>;
}
