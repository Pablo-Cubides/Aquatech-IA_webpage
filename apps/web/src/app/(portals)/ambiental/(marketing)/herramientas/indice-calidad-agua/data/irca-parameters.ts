// Constantes y datos normativos para IRCA (Colombia - Resolución 2115 de 2007)

import type { IRCAParameter } from "../types";

export const IRCA_PARAMETERS: IRCAParameter[] = [
  {
    name: "Color aparente",
    unit: "UPC",
    riskScore: 6,
    maxValue: 15,
    referenceNorm: "Resolución 2115 de 2007 - Colombia",
  },
  {
    name: "Turbiedad",
    unit: "UNT",
    riskScore: 15,
    maxValue: 2,
    referenceNorm: "Resolución 2115 de 2007 - Colombia",
  },
  {
    name: "pH",
    unit: "unidades",
    riskScore: 1.5,
    minValue: 6.5,
    maxValue: 9.0,
    referenceNorm: "Resolución 2115 de 2007 - Colombia",
  },
  {
    name: "Cloro residual libre",
    unit: "mg/L",
    riskScore: 15,
    minValue: 0.3,
    maxValue: 2.0,
    referenceNorm: "Resolución 2115 de 2007 - Colombia",
  },
  {
    name: "Alcalinidad total",
    unit: "mg/L CaCO₃",
    riskScore: 1,
    maxValue: 200,
    referenceNorm: "Resolución 2115 de 2007 - Colombia",
  },
  {
    name: "Calcio",
    unit: "mg/L",
    riskScore: 1,
    maxValue: 60,
    referenceNorm: "Resolución 2115 de 2007 - Colombia",
  },
  {
    name: "Fosfatos",
    unit: "mg/L",
    riskScore: 1,
    maxValue: 0.5,
    referenceNorm: "Resolución 2115 de 2007 - Colombia",
  },
  {
    name: "Manganeso",
    unit: "mg/L",
    riskScore: 1,
    maxValue: 0.1,
    referenceNorm: "Resolución 2115 de 2007 - Colombia",
  },
  {
    name: "Molibdeno",
    unit: "mg/L",
    riskScore: 1,
    maxValue: 0.07,
    referenceNorm: "Resolución 2115 de 2007 - Colombia",
  },
  {
    name: "Magnesio",
    unit: "mg/L",
    riskScore: 1,
    maxValue: 36,
    referenceNorm: "Resolución 2115 de 2007 - Colombia",
  },
  {
    name: "Zinc",
    unit: "mg/L",
    riskScore: 1,
    maxValue: 3,
    referenceNorm: "Resolución 2115 de 2007 - Colombia",
  },
  {
    name: "Dureza total",
    unit: "mg/L CaCO₃",
    riskScore: 1,
    maxValue: 300,
    referenceNorm: "Resolución 2115 de 2007 - Colombia",
  },
  {
    name: "Sulfatos",
    unit: "mg/L",
    riskScore: 1,
    maxValue: 250,
    referenceNorm: "Resolución 2115 de 2007 - Colombia",
  },
  {
    name: "Hierro total",
    unit: "mg/L",
    riskScore: 1.5,
    maxValue: 0.3,
    referenceNorm: "Resolución 2115 de 2007 - Colombia",
  },
  {
    name: "Cloruros",
    unit: "mg/L",
    riskScore: 1,
    maxValue: 250,
    referenceNorm: "Resolución 2115 de 2007 - Colombia",
  },
  {
    name: "Nitratos",
    unit: "mg/L NO₃⁻",
    riskScore: 1,
    maxValue: 10,
    referenceNorm: "Resolución 2115 de 2007 - Colombia",
  },
  {
    name: "Nitritos",
    unit: "mg/L NO₂⁻",
    riskScore: 3,
    maxValue: 0.1,
    referenceNorm: "Resolución 2115 de 2007 - Colombia",
  },
  {
    name: "Aluminio",
    unit: "mg/L",
    riskScore: 3,
    maxValue: 0.2,
    referenceNorm: "Resolución 2115 de 2007 - Colombia",
  },
  {
    name: "Fluoruros",
    unit: "mg/L",
    riskScore: 1,
    maxValue: 1.0,
    referenceNorm: "Resolución 2115 de 2007 - Colombia",
  },
  {
    name: "COT",
    unit: "mg/L",
    riskScore: 3,
    maxValue: 5,
    referenceNorm: "Resolución 2115 de 2007 - Colombia",
  },
  {
    name: "Coliformes totales",
    unit: "UFC/100mL",
    riskScore: 15,
    maxValue: 0,
    referenceNorm: "Resolución 2115 de 2007 - Colombia",
  },
  {
    name: "Escherichia coli",
    unit: "UFC/100mL",
    riskScore: 25,
    maxValue: 0,
    referenceNorm: "Resolución 2115 de 2007 - Colombia",
  },
];

// Suma total de puntajes IRCA si se analizan todos los parámetros
export const IRCA_TOTAL_SCORE = IRCA_PARAMETERS.reduce(
  (sum, param) => sum + param.riskScore,
  0
); // = 100

// Categorías de riesgo IRCA
export interface IRCARiskCategory {
  min: number;
  max: number;
  category: string;
  description: string;
  color: string;
}

export const IRCA_RISK_CATEGORIES: IRCARiskCategory[] = [
  {
    min: 0,
    max: 5,
    category: "Sin riesgo",
    description: "Agua apta para consumo humano",
    color: "#22c55e", // green-500
  },
  {
    min: 5.1,
    max: 14,
    category: "Riesgo bajo",
    description: "No es recomendable para consumo humano",
    color: "#84cc16", // lime-500
  },
  {
    min: 14.1,
    max: 35,
    category: "Riesgo medio",
    description: "No apta para consumo humano",
    color: "#eab308", // yellow-500
  },
  {
    min: 35.1,
    max: 80,
    category: "Riesgo alto",
    description: "Agua no apta para consumo humano",
    color: "#f97316", // orange-500
  },
  {
    min: 80.1,
    max: 100,
    category: "Inviable sanitariamente",
    description: "Agua no apta para consumo humano",
    color: "#ef4444", // red-500
  },
];

export function getIRCARiskCategory(ircaValue: number): IRCARiskCategory {
  return (
    IRCA_RISK_CATEGORIES.find(
      (cat) => ircaValue >= cat.min && ircaValue <= cat.max
    ) || IRCA_RISK_CATEGORIES[IRCA_RISK_CATEGORIES.length - 1]
  );
}
