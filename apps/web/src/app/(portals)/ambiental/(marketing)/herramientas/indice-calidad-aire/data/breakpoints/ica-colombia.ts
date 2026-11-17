/**
 * ICA Colombia Breakpoints - Índice de Calidad del Aire Nacional
 * FUENTE CANÓNICA: @/lib/normativa (Res. 2254/2017, art. 20, Tabla 6). Este archivo solo
 * adapta esos cortes a la forma que usa el motor; no define valores propios.
 * Metodología de cálculo: art. 21 (interpolación lineal, como EPA 454/B-12-001).
 */

import type { PollutantBreakpoints, Category, Breakpoint } from '../../types';
import { TABLA_6_CORTES_ICA, type CorteICA } from '@/lib/normativa';

/**
 * ICA Colombia Categories (0-500)
 * Same structure as US AQI with Spanish terminology
 */
export const ICA_COLOMBIA_CATEGORIES: Category[] = [
  {
    min: 0,
    max: 50,
    name: 'Buena',
    shortName: 'Buena',
    color: '#00E400',
    bgColor: '#00E40020',
    healthMessage: 'La calidad del aire es satisfactoria y no representa un riesgo para la salud.',
    actions: 'Puede realizar actividades al aire libre sin restricción.',
  },
  {
    min: 51,
    max: 100,
    name: 'Aceptable',
    shortName: 'Aceptable',
    color: '#FFFF00',
    bgColor: '#FFFF0020',
    healthMessage: 'La calidad del aire es aceptable. Algunas personas muy sensibles pueden experimentar molestias.',
    actions: 'Personas con afecciones respiratorias deben limitar esfuerzos prolongados al aire libre.',
  },
  {
    min: 101,
    max: 150,
    name: 'Dañina a la salud de grupos sensibles',
    shortName: 'Grupos sensibles',
    color: '#FF7E00',
    bgColor: '#FF7E0020',
    healthMessage: 'Niños, adultos mayores y personas con enfermedades respiratorias pueden experimentar efectos en la salud.',
    actions: 'Grupos sensibles deben reducir actividades físicas al aire libre.',
  },
  {
    min: 151,
    max: 200,
    name: 'Dañina a la salud',
    shortName: 'Dañina',
    color: '#FF0000',
    bgColor: '#FF000020',
    healthMessage: 'Toda la población puede experimentar efectos en la salud. Grupos sensibles pueden experimentar efectos más graves.',
    actions: 'Todos deben reducir actividades físicas prolongadas al aire libre.',
  },
  {
    min: 201,
    max: 300,
    name: 'Muy dañina a la salud',
    shortName: 'Muy dañina',
    color: '#8F3F97',
    bgColor: '#8F3F9720',
    healthMessage: 'Alerta de salud: toda la población puede experimentar efectos graves en la salud.',
    actions: 'Evite actividades físicas al aire libre. Permanezca en interiores.',
  },
  {
    min: 301,
    max: 500,
    name: 'Peligrosa',
    shortName: 'Peligrosa',
    color: '#7E0023',
    bgColor: '#7E002320',
    healthMessage: 'Advertencia de emergencia de salud. Toda la población tiene alta probabilidad de verse afectada.',
    actions: 'Permanezca en interiores con ventanas cerradas. Evite cualquier actividad al aire libre.',
  },
];

type Col = 'pm10_24h' | 'pm25_24h' | 'co_8h' | 'so2_1h' | 'no2_1h' | 'o3_8h';

/** Convierte una columna de la Tabla 6 a puntos de corte. `scale` pasa µg/m³ → unidad de la herramienta. */
function fromTabla6(col: Col, scale = 1): Breakpoint[] {
  return TABLA_6_CORTES_ICA.map((row: CorteICA) => ({
    bpLo: Math.round(row[col][0] * scale * 1e6) / 1e6,
    bpHi: Math.round(row[col][1] * scale * 1e6) / 1e6,
    iLo: row.ica[0],
    iHi: row.ica[1],
  }));
}

/** PM2.5, 24 h, µg/m³ (Tabla 6). Cortes enteros: 0-12, 13-37, 38-55, 56-150, 151-250, 251-500. */
export const ICA_COLOMBIA_PM25: PollutantBreakpoints = {
  pollutantId: 'pm25',
  averagingPeriod: 24,
  breakpoints: fromTabla6('pm25_24h'),
  truncateDecimals: 0,
};

/** PM10, 24 h, µg/m³ (Tabla 6). */
export const ICA_COLOMBIA_PM10: PollutantBreakpoints = {
  pollutantId: 'pm10',
  averagingPeriod: 24,
  breakpoints: fromTabla6('pm10_24h'),
  truncateDecimals: 0,
};

/**
 * O3, 8 h, µg/m³ (Tabla 6). El ICA de O3 de 8 h no se calcula para concentraciones
 * superiores a 394 µg/m³ (nota 2 de la Tabla 6): ahí la norma exige el ICA de O3 de 1 h,
 * que esta herramienta aún no admite (ver bitácora DOM, pendiente).
 */
export const ICA_COLOMBIA_O3: PollutantBreakpoints = {
  pollutantId: 'o3',
  averagingPeriod: 8,
  breakpoints: fromTabla6('o3_8h'),
  truncateDecimals: 0,
};

/** NO2, 1 h, µg/m³ (Tabla 6). */
export const ICA_COLOMBIA_NO2: PollutantBreakpoints = {
  pollutantId: 'no2',
  averagingPeriod: 1,
  breakpoints: fromTabla6('no2_1h'),
  truncateDecimals: 0,
};

/** SO2, 1 h (no 24 h), µg/m³ (Tabla 6). */
export const ICA_COLOMBIA_SO2: PollutantBreakpoints = {
  pollutantId: 'so2',
  averagingPeriod: 1,
  breakpoints: fromTabla6('so2_1h'),
  truncateDecimals: 0,
};

/** CO, 8 h. La Tabla 6 está en µg/m³; la herramienta usa mg/m³ (÷1000, sin redondear: 5,094 mg/m³ = 5094 µg/m³). */
export const ICA_COLOMBIA_CO: PollutantBreakpoints = {
  pollutantId: 'co',
  averagingPeriod: 8,
  breakpoints: fromTabla6('co_8h', 1 / 1000),
  truncateDecimals: 3,
};

/**
 * Complete ICA Colombia Profile
 */
export const ICA_COLOMBIA_BREAKPOINTS: PollutantBreakpoints[] = [
  ICA_COLOMBIA_PM25,
  ICA_COLOMBIA_PM10,
  ICA_COLOMBIA_O3,
  ICA_COLOMBIA_NO2,
  ICA_COLOMBIA_SO2,
  ICA_COLOMBIA_CO,
];
