// Constantes para NSF Water Quality Index (WQI)

import { findBand } from "@/lib/scales/find-band";
import type { WQIParameter } from "../types";

// Parámetros NSF con sus pesos estándar
export const WQI_PARAMETERS: Omit<WQIParameter, "qiCurve">[] = [
  { name: "Oxígeno disuelto", unit: "mg/L", weight: 0.17 },
  { name: "Coliformes fecales", unit: "UFC/100mL", weight: 0.16 },
  { name: "pH", unit: "unidades", weight: 0.11 },
  { name: "DBO5", unit: "mg/L", weight: 0.11 },
  { name: "Cambio de temperatura", unit: "°C", weight: 0.10 },
  { name: "Fósforo total", unit: "mg/L", weight: 0.10 },
  { name: "Nitratos", unit: "mg/L", weight: 0.10 },
  { name: "Turbiedad", unit: "NTU", weight: 0.08 },
  { name: "Sólidos totales", unit: "mg/L", weight: 0.07 },
];

// Curvas de calidad Qi para cada parámetro (valor → Qi)
// Estos valores son aproximados basados en las curvas NSF estándar

export const QI_CURVES: Record<string, Array<{ value: number; qi: number }>> = {
  "Oxígeno disuelto": [
    { value: 0, qi: 0 },
    { value: 20, qi: 10 },
    { value: 40, qi: 30 },
    { value: 60, qi: 60 },
    { value: 80, qi: 85 },
    { value: 90, qi: 95 },
    { value: 100, qi: 100 },
    { value: 120, qi: 99 },
    { value: 140, qi: 95 },
  ],
  "Coliformes fecales": [
    { value: 0, qi: 100 },
    { value: 1, qi: 80 },
    { value: 10, qi: 60 },
    { value: 100, qi: 40 },
    { value: 1000, qi: 20 },
    { value: 10000, qi: 5 },
    { value: 100000, qi: 2 },
  ],
  pH: [
    { value: 2, qi: 0 },
    { value: 4, qi: 10 },
    { value: 5, qi: 30 },
    { value: 6, qi: 60 },
    { value: 7, qi: 90 },
    { value: 7.5, qi: 100 },
    { value: 8, qi: 90 },
    { value: 9, qi: 60 },
    { value: 10, qi: 30 },
    { value: 11, qi: 10 },
    { value: 12, qi: 0 },
  ],
  DBO5: [
    { value: 0, qi: 100 },
    { value: 2, qi: 90 },
    { value: 4, qi: 70 },
    { value: 6, qi: 50 },
    { value: 8, qi: 30 },
    { value: 10, qi: 20 },
    { value: 15, qi: 10 },
    { value: 20, qi: 5 },
    { value: 30, qi: 2 },
  ],
  "Cambio de temperatura": [
    { value: 0, qi: 100 },
    { value: 2, qi: 95 },
    { value: 4, qi: 85 },
    { value: 6, qi: 70 },
    { value: 8, qi: 55 },
    { value: 10, qi: 40 },
    { value: 12, qi: 25 },
    { value: 15, qi: 10 },
    { value: 20, qi: 0 },
  ],
  "Fósforo total": [
    { value: 0, qi: 100 },
    { value: 0.1, qi: 80 },
    { value: 0.5, qi: 60 },
    { value: 1, qi: 40 },
    { value: 2, qi: 20 },
    { value: 5, qi: 10 },
    { value: 10, qi: 5 },
  ],
  Nitratos: [
    { value: 0, qi: 100 },
    { value: 5, qi: 90 },
    { value: 10, qi: 80 },
    { value: 20, qi: 60 },
    { value: 30, qi: 40 },
    { value: 40, qi: 20 },
    { value: 50, qi: 10 },
    { value: 100, qi: 0 },
  ],
  Turbiedad: [
    { value: 0, qi: 100 },
    { value: 5, qi: 90 },
    { value: 10, qi: 80 },
    { value: 25, qi: 60 },
    { value: 50, qi: 40 },
    { value: 75, qi: 20 },
    { value: 100, qi: 10 },
    { value: 200, qi: 0 },
  ],
  "Sólidos totales": [
    { value: 0, qi: 100 },
    { value: 50, qi: 95 },
    { value: 100, qi: 85 },
    { value: 200, qi: 70 },
    { value: 300, qi: 55 },
    { value: 400, qi: 40 },
    { value: 500, qi: 25 },
    { value: 750, qi: 10 },
    { value: 1000, qi: 0 },
  ],
};

// Categorías de calidad WQI
export interface WQICategory {
  min: number;
  max: number;
  category: string;
  description: string;
  color: string;
}

export const WQI_CATEGORIES: WQICategory[] = [
  {
    min: 0,
    max: 24,
    category: "Muy mala",
    description: "Calidad de agua muy mala",
    color: "#7f1d1d", // red-900
  },
  {
    min: 25,
    max: 49,
    category: "Mala",
    description: "Calidad de agua mala",
    color: "#ef4444", // red-500
  },
  {
    min: 50,
    max: 69,
    category: "Media",
    description: "Calidad de agua media",
    color: "#eab308", // yellow-500
  },
  {
    min: 70,
    max: 89,
    category: "Buena",
    description: "Calidad de agua buena",
    color: "#84cc16", // lime-500
  },
  {
    min: 90,
    max: 100,
    category: "Excelente",
    description: "Calidad de agua excelente",
    color: "#22c55e", // green-500
  },
];

/**
 * Categoría de un WQI. `null` si el valor no es un número entre 0 y 100: nunca una categoría
 * inventada (antes, lo que no encajaba en ningún rango entero se etiquetaba «Muy mala»).
 * Un valor entre dos rangos enteros (89.79) cae en el inferior, la categoría prudente.
 */
export function getWQICategory(wqiValue: number): WQICategory | null {
  return findBand(wqiValue, WQI_CATEGORIES, { gap: "lower" });
}

// Función para interpolar Qi a partir de las curvas
export function interpolateQi(
  parameterName: string,
  measuredValue: number
): number {
  const curve = QI_CURVES[parameterName];
  // Sin curva no hay Qi: antes se devolvía 50 y el parámetro entraba al índice con un valor inventado.
  if (!curve) throw new Error(`WQI: no hay curva Qi para el parámetro "${parameterName}"`);
  if (!Number.isFinite(measuredValue)) {
    throw new Error(`WQI: valor no numérico para "${parameterName}"`);
  }

  // Si el valor está fuera de rango, usar los extremos
  if (measuredValue <= curve[0].value) return curve[0].qi;
  if (measuredValue >= curve[curve.length - 1].value)
    return curve[curve.length - 1].qi;

  // Interpolación lineal
  for (let i = 0; i < curve.length - 1; i++) {
    const p1 = curve[i];
    const p2 = curve[i + 1];

    if (measuredValue >= p1.value && measuredValue <= p2.value) {
      const ratio = (measuredValue - p1.value) / (p2.value - p1.value);
      return p1.qi + ratio * (p2.qi - p1.qi);
    }
  }

  // Con curvas ordenadas y un valor finito, el bucle de arriba siempre encuentra su tramo.
  throw new Error(`WQI: curva Qi de "${parameterName}" no ordenada o con huecos`);
}
