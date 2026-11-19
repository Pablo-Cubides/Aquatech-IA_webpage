/**
 * IBOCA Bogotá Breakpoints - Índice Bogotano de Calidad del Aire y Riesgo en Salud
 * FUENTE CANÓNICA: @/lib/normativa (Resolución Conjunta 2840 de 2023, art. 4, Tabla 1,
 * vigente desde 2023-12-16; deroga la Res. 868 de 2021). Este archivo solo adapta esos
 * cortes; no define valores propios.
 *
 * Averaging: PM2.5 y PM10 usan media móvil ponderada NowCast de 12 h; O3 8 h, NO2 1 h,
 * SO2 1 h y CO 8 h usan media móvil. La herramienta recibe el valor ya promediado: para
 * PM debe ser el valor NowCast de 12 h (art. 5 de la resolución), no un promedio de 24 h.
 */

import type { PollutantBreakpoints, Category, Breakpoint } from '../../types';
import { TABLA_1_CORTES_IBOCA, type CorteIBOCA } from '@/lib/normativa';

const COLORES: Record<string, string> = {
  Verde: '#00E400', // RVA 0,228,0 (Tabla 2 de la resolución)
  Amarillo: '#FFFF00',
  Naranja: '#FF7E00',
  Rojo: '#FF0000',
  Morado: '#8F3F97', // RVA 143,63,151
};

/** Categorías: nivel de riesgo y nivel de actuación de la Tabla 1 (el morado cubre 201-500). */
export const IBOCA_CATEGORIES: Category[] = TABLA_1_CORTES_IBOCA.map((row: CorteIBOCA) => ({
  min: row.ibocaRango[0],
  max: row.ibocaRango[1],
  name: row.nivelRiesgo,
  shortName: row.nivelRiesgo,
  color: COLORES[row.color],
  bgColor: `${COLORES[row.color]}20`,
  healthMessage: `Nivel de riesgo ${row.nivelRiesgo.toLowerCase()} (color ${row.color.toLowerCase()}). Los efectos en salud por nivel están en la Tabla 3 de la Res. 2840/2023.`,
  actions: `Nivel de actuación o respuesta: ${row.nivelActuacion}.`,
}));

type Col = 'pm25_12h_nowcast' | 'pm10_12h_nowcast' | 'o3_8h' | 'no2_1h' | 'so2_1h' | 'co_8h';

function fromTabla1(col: Col, scale = 1): Breakpoint[] {
  return TABLA_1_CORTES_IBOCA.map((row: CorteIBOCA) => ({
    bpLo: Math.round(row[col][0] * scale * 1e6) / 1e6,
    bpHi: Math.round(row[col][1] * scale * 1e6) / 1e6,
    iLo: row.ibocaRango[0],
    iHi: row.ibocaRango[1],
  }));
}

export const IBOCA_PM25: PollutantBreakpoints = {
  pollutantId: 'pm25',
  averagingPeriod: 12,
  breakpoints: fromTabla1('pm25_12h_nowcast'),
  truncateDecimals: 1,
};

export const IBOCA_PM10: PollutantBreakpoints = {
  pollutantId: 'pm10',
  averagingPeriod: 12,
  breakpoints: fromTabla1('pm10_12h_nowcast'),
  truncateDecimals: 1,
};

export const IBOCA_O3: PollutantBreakpoints = {
  pollutantId: 'o3',
  averagingPeriod: 8,
  breakpoints: fromTabla1('o3_8h'),
  truncateDecimals: 0,
};

export const IBOCA_NO2: PollutantBreakpoints = {
  pollutantId: 'no2',
  averagingPeriod: 1,
  breakpoints: fromTabla1('no2_1h'),
  truncateDecimals: 1,
};

export const IBOCA_SO2: PollutantBreakpoints = {
  pollutantId: 'so2',
  averagingPeriod: 1,
  breakpoints: fromTabla1('so2_1h'),
  truncateDecimals: 1,
};

/** CO 8 h: la Tabla 1 está en µg/m³; la herramienta usa mg/m³ (÷1000). */
export const IBOCA_CO: PollutantBreakpoints = {
  pollutantId: 'co',
  averagingPeriod: 8,
  breakpoints: fromTabla1('co_8h', 1 / 1000),
  truncateDecimals: 3,
};

/**
 * Complete IBOCA Bogotá Profile
 */
export const IBOCA_BREAKPOINTS: PollutantBreakpoints[] = [
  IBOCA_PM25,
  IBOCA_PM10,
  IBOCA_O3,
  IBOCA_NO2,
  IBOCA_SO2,
  IBOCA_CO,
];
