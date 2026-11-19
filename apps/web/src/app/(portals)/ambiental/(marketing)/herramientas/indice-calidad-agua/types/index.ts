// Tipos para la aplicación de índices de calidad del agua

export type Country = "Colombia" | "Internacional" | "Otro";

export type DataSource = "manual" | "csv" | "api";

export type IndexType = "IRCA" | "WQI" | "DWQI";

export interface WaterParameter {
  name: string;
  value: number;
  unit: string;
  timestamp?: Date;
  /**
   * Resultado censurado ("<0,1" o ">10"): `value` guarda el límite y este campo el operador.
   * Un resultado censurado NO es un número: la calculadora solo lo usa si el intervalo
   * (0, límite) o (límite, ∞) queda enteramente a un lado del valor normativo.
   */
  censored?: "<" | ">";
}

export interface WaterSample {
  id: string;
  date?: Date; // Usado internamente
  sampleDate?: string; // Formato string para CSV/inputs
  location: string;
  country: Country;
  source?: string; // Usado internamente
  dataSource?: DataSource; // Para inputs
  parameters: WaterParameter[];
  indices?: {
    IRCA?: IndexResult;
    WQI?: IndexResult;
    DWQI?: IndexResult;
  };
}

export interface IRCAScope {
  /** Características del Cuadro 6 sobre las que se calculó. */
  calculatedOn: number;
  /** Total de características del Cuadro 6 (22). */
  totalCharacteristics: number;
  /** Suma de puntajes de las características analizadas (denominador). */
  analyzedScore: number;
  /** Nombres de las características del Cuadro 6 que no se analizaron. */
  notAnalyzed: string[];
  /** Parámetros del archivo/formulario que no se reconocieron como característica del Cuadro 6 ni como sustancia de los arts. 5/8. */
  unrecognized: string[];
  /** Resultados censurados que no permiten decidir el cumplimiento y se excluyeron del cálculo. */
  indeterminate: string[];
  /** Motivos por los que se aplicó IRCA = 100 (art. 13, parágrafo), con cita. */
  overrides: Array<{ motivo: string; cita: string }>;
  /** IRCA según la fórmula del art. 14, antes de aplicar el parágrafo del art. 13. */
  formulaValue: number;
  /** Recordatorio de alcance que debe mostrarse junto al resultado. */
  reminder: string;
}

export interface IndexResult {
  value: number;
  category: string;
  riskLevel?: string;
  details: IndexDetail[];
  missingParameters?: string[];
  calculationDate: Date;
  /** Solo para IRCA: sobre qué se calculó y qué no cubre. */
  scope?: IRCAScope;
}

export interface IndexDetail {
  parameter: string;
  measuredValue: number;
  unit: string;
  standard?: number;
  standardDisplay?: string;
  complies: boolean;
  contribution?: number;
  qi?: number;
  weight?: number;
  value?: string; // Representación legible (ej: "Cumple", "No cumple", "Qi: 85.5")
  description?: string; // Descripción detallada opcional
}

export interface IRCAParameter {
  id?: string;
  /** Nombres alternativos aceptados al leer encabezados. */
  synonyms?: string[];
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
