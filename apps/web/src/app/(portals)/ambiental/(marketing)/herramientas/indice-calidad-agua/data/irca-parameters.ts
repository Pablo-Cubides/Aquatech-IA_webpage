// Constantes IRCA (Colombia - Resolución 2115 de 2007).
// FUENTE CANÓNICA: @/lib/normativa (res-2115-2007.ts). Este archivo solo adapta esos datos
// a la forma que usa la herramienta; no define valores normativos propios.

import { findBand } from "@/lib/scales/find-band";
import type { IRCAParameter } from "../types";
import {
  CARACTERISTICAS_IRCA,
  IRCA_NIVELES_RIESGO,
} from "@/lib/normativa";

export const IRCA_PARAMETERS: IRCAParameter[] = CARACTERISTICAS_IRCA.map((c) => ({
  id: c.id,
  name: c.nombre,
  unit: c.unidad,
  riskScore: c.puntaje,
  ...(c.min !== undefined ? { minValue: c.min } : {}),
  ...(c.max !== undefined ? { maxValue: c.max } : {}),
  synonyms: [...c.sinonimos],
  referenceNorm: `${c.citaLimite.norma}, ${c.citaLimite.articulo}`,
}));

// Suma total de puntajes IRCA si se analizan todos los parámetros
export const IRCA_TOTAL_SCORE = IRCA_PARAMETERS.reduce(
  (sum, param) => sum + param.riskScore,
  0
); // = 100

export interface IRCARiskCategory {
  min: number;
  max: number;
  category: string;
  description: string;
  color: string;
}

const IRCA_COLORS = ["#22c55e", "#84cc16", "#eab308", "#f97316", "#ef4444"];

// Art. 15, Cuadro 7 de la Res. 2115/2007 (vía @/lib/normativa)
export const IRCA_RISK_CATEGORIES: IRCARiskCategory[] = IRCA_NIVELES_RIESGO.map((n, i) => ({
  min: n.min,
  max: n.max,
  category: n.nivel,
  description: n.descripcion,
  color: IRCA_COLORS[i],
}));

/**
 * Categoría de riesgo de un IRCA. `null` si el valor no es un número: nunca una categoría
 * inventada (antes, un NaN se etiquetaba «Inviable sanitariamente», el peor nivel).
 *
 * La Resolución 2115 publica los rangos con un decimal (0–5, 5.1–14, 14.1–35, 35.1–80, 80.1–100).
 * Un valor como 5.05 o 14.05 (frecuente cuando no se analizan todos los parámetros) caía entre dos
 * rangos. Se clasifica con el valor a un decimal: 5.05 → 5.1 (riesgo bajo). Fuera de 0-100 se
 * acota, porque el IRCA es un porcentaje y solo puede salirse por error de coma flotante.
 */
export function getIRCARiskCategory(ircaValue: number): IRCARiskCategory | null {
  if (!Number.isFinite(ircaValue)) return null;
  const value = Math.min(100, Math.max(0, Math.round(ircaValue * 10) / 10));
  return findBand(value, IRCA_RISK_CATEGORIES, { gap: "upper" });
}
