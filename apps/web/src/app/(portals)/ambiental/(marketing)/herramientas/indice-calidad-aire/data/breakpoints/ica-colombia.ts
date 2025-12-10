/**
 * ICA Colombia Breakpoints - Índice de Calidad del Aire Nacional
 * Source: Resolución 2254 de 2017, IDEAM/Minambiente
 * Based on EPA 454/B-12-001 methodology
 */

import type { PollutantBreakpoints, Category } from '../../types';

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

/**
 * PM2.5 Breakpoints for ICA Colombia (24-hour average, µg/m³)
 * Based on Resolución 2254 de 2017
 */
export const ICA_COLOMBIA_PM25: PollutantBreakpoints = {
  pollutantId: 'pm25',
  averagingPeriod: 24,
  breakpoints: [
    { bpLo: 0.0, bpHi: 12.0, iLo: 0, iHi: 50 },
    { bpLo: 12.1, bpHi: 37.0, iLo: 51, iHi: 100 },
    { bpLo: 37.1, bpHi: 55.0, iLo: 101, iHi: 150 },
    { bpLo: 55.1, bpHi: 150.0, iLo: 151, iHi: 200 },
    { bpLo: 150.1, bpHi: 250.0, iLo: 201, iHi: 300 },
    { bpLo: 250.1, bpHi: 500.0, iLo: 301, iHi: 500 },
  ],
};

/**
 * PM10 Breakpoints for ICA Colombia (24-hour average, µg/m³)
 */
export const ICA_COLOMBIA_PM10: PollutantBreakpoints = {
  pollutantId: 'pm10',
  averagingPeriod: 24,
  breakpoints: [
    { bpLo: 0, bpHi: 54, iLo: 0, iHi: 50 },
    { bpLo: 55, bpHi: 154, iLo: 51, iHi: 100 },
    { bpLo: 155, bpHi: 254, iLo: 101, iHi: 150 },
    { bpLo: 255, bpHi: 354, iLo: 151, iHi: 200 },
    { bpLo: 355, bpHi: 424, iLo: 201, iHi: 300 },
    { bpLo: 425, bpHi: 604, iLo: 301, iHi: 500 },
  ],
};

/**
 * O3 Breakpoints for ICA Colombia (8-hour average, µg/m³)
 */
export const ICA_COLOMBIA_O3: PollutantBreakpoints = {
  pollutantId: 'o3',
  averagingPeriod: 8,
  breakpoints: [
    { bpLo: 0, bpHi: 106, iLo: 0, iHi: 50 },
    { bpLo: 107, bpHi: 138, iLo: 51, iHi: 100 },
    { bpLo: 139, bpHi: 167, iLo: 101, iHi: 150 },
    { bpLo: 168, bpHi: 206, iLo: 151, iHi: 200 },
    { bpLo: 207, bpHi: 392, iLo: 201, iHi: 300 },
    { bpLo: 393, bpHi: 588, iLo: 301, iHi: 500 },
  ],
};

/**
 * NO2 Breakpoints for ICA Colombia (1-hour average, µg/m³)
 */
export const ICA_COLOMBIA_NO2: PollutantBreakpoints = {
  pollutantId: 'no2',
  averagingPeriod: 1,
  breakpoints: [
    { bpLo: 0, bpHi: 100, iLo: 0, iHi: 50 },
    { bpLo: 101, bpHi: 188, iLo: 51, iHi: 100 },
    { bpLo: 189, bpHi: 676, iLo: 101, iHi: 150 },
    { bpLo: 677, bpHi: 1220, iLo: 151, iHi: 200 },
    { bpLo: 1221, bpHi: 2348, iLo: 201, iHi: 300 },
    { bpLo: 2349, bpHi: 3852, iLo: 301, iHi: 500 },
  ],
};

/**
 * SO2 Breakpoints for ICA Colombia (24-hour average, µg/m³)
 */
export const ICA_COLOMBIA_SO2: PollutantBreakpoints = {
  pollutantId: 'so2',
  averagingPeriod: 24,
  breakpoints: [
    { bpLo: 0, bpHi: 93, iLo: 0, iHi: 50 },
    { bpLo: 94, bpHi: 197, iLo: 51, iHi: 100 },
    { bpLo: 198, bpHi: 486, iLo: 101, iHi: 150 },
    { bpLo: 487, bpHi: 797, iLo: 151, iHi: 200 },
    { bpLo: 798, bpHi: 1583, iLo: 201, iHi: 300 },
    { bpLo: 1584, bpHi: 2620, iLo: 301, iHi: 500 },
  ],
};

/**
 * CO Breakpoints for ICA Colombia (8-hour average, mg/m³)
 */
export const ICA_COLOMBIA_CO: PollutantBreakpoints = {
  pollutantId: 'co',
  averagingPeriod: 8,
  breakpoints: [
    { bpLo: 0, bpHi: 5.0, iLo: 0, iHi: 50 },
    { bpLo: 5.1, bpHi: 10.0, iLo: 51, iHi: 100 },
    { bpLo: 10.1, bpHi: 14.0, iLo: 101, iHi: 150 },
    { bpLo: 14.1, bpHi: 17.0, iLo: 151, iHi: 200 },
    { bpLo: 17.1, bpHi: 34.0, iLo: 201, iHi: 300 },
    { bpLo: 34.1, bpHi: 57.0, iLo: 301, iHi: 500 },
  ],
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
