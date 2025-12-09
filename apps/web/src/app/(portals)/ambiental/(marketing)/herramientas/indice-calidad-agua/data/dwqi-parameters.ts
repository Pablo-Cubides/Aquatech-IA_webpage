// Constantes para Drinking Water Quality Index (DWQI) - Método WA-WQI

import type { DWQIParameter } from "../types";

// Parámetros DWQI con valores estándar (Si) y valores ideales (Vi)
export const DWQI_PARAMETERS: DWQIParameter[] = [
  {
    name: "pH",
    unit: "unidades",
    standard: 8.5,
    idealValue: 7.0,
    referenceNorm: "WHO Guidelines",
  },
  {
    name: "Turbiedad",
    unit: "NTU",
    standard: 5,
    idealValue: 0,
    referenceNorm: "WHO Guidelines",
  },
  {
    name: "Color",
    unit: "UC",
    standard: 15,
    idealValue: 0,
    referenceNorm: "WHO Guidelines",
  },
  {
    name: "TDS",
    unit: "mg/L",
    standard: 1000,
    idealValue: 0,
    referenceNorm: "WHO Guidelines",
  },
  {
    name: "Dureza total",
    unit: "mg/L CaCO₃",
    standard: 300,
    idealValue: 0,
    referenceNorm: "WHO Guidelines",
  },
  {
    name: "Alcalinidad",
    unit: "mg/L CaCO₃",
    standard: 200,
    idealValue: 0,
    referenceNorm: "WHO Guidelines",
  },
  {
    name: "Cloruros",
    unit: "mg/L",
    standard: 250,
    idealValue: 0,
    referenceNorm: "WHO Guidelines",
  },
  {
    name: "Sulfatos",
    unit: "mg/L",
    standard: 250,
    idealValue: 0,
    referenceNorm: "WHO Guidelines",
  },
  {
    name: "Nitratos",
    unit: "mg/L",
    standard: 50,
    idealValue: 0,
    referenceNorm: "WHO Guidelines",
  },
  {
    name: "Fosfatos",
    unit: "mg/L",
    standard: 5,
    idealValue: 0,
    referenceNorm: "WHO Guidelines",
  },
  {
    name: "Hierro",
    unit: "mg/L",
    standard: 0.3,
    idealValue: 0,
    referenceNorm: "WHO Guidelines",
  },
  {
    name: "Conductividad",
    unit: "µS/cm",
    standard: 400,
    idealValue: 0,
    referenceNorm: "WHO Guidelines",
  },
  {
    name: "Cloro residual",
    unit: "mg/L",
    standard: 5,
    idealValue: 0.5,
    referenceNorm: "WHO Guidelines",
  },
  {
    name: "Calcio",
    unit: "mg/L",
    standard: 75,
    idealValue: 0,
    referenceNorm: "WHO Guidelines",
  },
  {
    name: "Magnesio",
    unit: "mg/L",
    standard: 50,
    idealValue: 0,
    referenceNorm: "WHO Guidelines",
  },
  {
    name: "Sodio",
    unit: "mg/L",
    standard: 200,
    idealValue: 0,
    referenceNorm: "WHO Guidelines",
  },
  {
    name: "Fluoruros",
    unit: "mg/L",
    standard: 1.5,
    idealValue: 0,
    referenceNorm: "WHO Guidelines",
  },
  {
    name: "Aluminio",
    unit: "mg/L",
    standard: 0.2,
    idealValue: 0,
    referenceNorm: "WHO Guidelines",
  },
];

// Categorías de calidad DWQI
export interface DWQICategory {
  min: number;
  max: number;
  category: string;
  description: string;
  color: string;
}

export const DWQI_CATEGORIES: DWQICategory[] = [
  {
    min: 0,
    max: 25,
    category: "Excelente",
    description: "Agua excelente, apta para consumo sin restricciones",
    color: "#22c55e", // green-500
  },
  {
    min: 26,
    max: 50,
    category: "Buena",
    description: "Agua buena, apta para consumo",
    color: "#84cc16", // lime-500
  },
  {
    min: 51,
    max: 75,
    category: "Pobre",
    description: "Agua pobre, requiere tratamiento",
    color: "#eab308", // yellow-500
  },
  {
    min: 76,
    max: 100,
    category: "Muy pobre",
    description: "Agua muy pobre, no recomendada",
    color: "#f97316", // orange-500
  },
  {
    min: 101,
    max: 999,
    category: "No apta",
    description: "Agua no apta para consumo humano",
    color: "#ef4444", // red-500
  },
];

export function getDWQICategory(dwqiValue: number): DWQICategory {
  return (
    DWQI_CATEGORIES.find(
      (cat) => dwqiValue >= cat.min && dwqiValue <= cat.max
    ) || DWQI_CATEGORIES[DWQI_CATEGORIES.length - 1]
  );
}
