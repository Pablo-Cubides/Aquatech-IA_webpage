/**
 * EAQI Europe Breakpoints - European Air Quality Index
 * Source: European Environment Agency (EEA)
 * Reference: https://airindex.eea.europa.eu/
 */

import type { PollutantBreakpoints, Category } from '../../types';

/**
 * EAQI Categories (1-6 levels instead of 0-500)
 * Note: EAQI uses discrete levels, not continuous interpolation
 */
export const EAQI_CATEGORIES: Category[] = [
  {
    min: 1,
    max: 1,
    name: 'Buena',
    shortName: 'Buena',
    color: '#50F0E6',
    bgColor: '#50F0E620',
    healthMessage: 'La calidad del aire es buena. Disfrute de sus actividades habituales al aire libre.',
    actions: 'Ninguna restricción.',
  },
  {
    min: 2,
    max: 2,
    name: 'Aceptable',
    shortName: 'Aceptable',
    color: '#50CCAA',
    bgColor: '#50CCAA20',
    healthMessage: 'La calidad del aire es aceptable. Disfrute de sus actividades habituales al aire libre.',
    actions: 'Ninguna restricción para la población general.',
  },
  {
    min: 3,
    max: 3,
    name: 'Moderada',
    shortName: 'Moderada',
    color: '#F0E641',
    bgColor: '#F0E64120',
    healthMessage: 'Personas sensibles pueden experimentar síntomas.',
    actions: 'Grupos sensibles deben considerar reducir ejercicio intenso.',
  },
  {
    min: 4,
    max: 4,
    name: 'Pobre',
    shortName: 'Pobre',
    color: '#FF5050',
    bgColor: '#FF505020',
    healthMessage: 'Grupos sensibles pueden experimentar efectos en la salud. El público general menos propenso a ser afectado.',
    actions: 'Grupos sensibles deben reducir actividad física al aire libre.',
  },
  {
    min: 5,
    max: 5,
    name: 'Muy Pobre',
    shortName: 'Muy Pobre',
    color: '#960032',
    bgColor: '#96003220',
    healthMessage: 'Efectos en la salud pueden ocurrir en el público general. Grupos sensibles pueden experimentar efectos más serios.',
    actions: 'Todos deben reducir actividad física al aire libre, especialmente prolongada.',
  },
  {
    min: 6,
    max: 6,
    name: 'Extremadamente Pobre',
    shortName: 'Extrema',
    color: '#7D2181',
    bgColor: '#7D218120',
    healthMessage: 'El público general puede experimentar efectos serios en la salud.',
    actions: 'Evitar actividad física al aire libre.',
  },
];

/**
 * PM2.5 Breakpoints for EAQI (24-hour average, µg/m³)
 * Uses discrete levels (1-6), we adapt to work with our calculation engine
 */
export const EAQI_PM25: PollutantBreakpoints = {
  pollutantId: 'pm25',
  averagingPeriod: 24,
  breakpoints: [
    { bpLo: 0, bpHi: 10, iLo: 1, iHi: 1 },
    { bpLo: 10.1, bpHi: 20, iLo: 2, iHi: 2 },
    { bpLo: 20.1, bpHi: 25, iLo: 3, iHi: 3 },
    { bpLo: 25.1, bpHi: 50, iLo: 4, iHi: 4 },
    { bpLo: 50.1, bpHi: 75, iLo: 5, iHi: 5 },
    { bpLo: 75.1, bpHi: 999, iLo: 6, iHi: 6 },
  ],
};

/**
 * PM10 Breakpoints for EAQI (24-hour average, µg/m³)
 */
export const EAQI_PM10: PollutantBreakpoints = {
  pollutantId: 'pm10',
  averagingPeriod: 24,
  breakpoints: [
    { bpLo: 0, bpHi: 20, iLo: 1, iHi: 1 },
    { bpLo: 20.1, bpHi: 40, iLo: 2, iHi: 2 },
    { bpLo: 40.1, bpHi: 50, iLo: 3, iHi: 3 },
    { bpLo: 50.1, bpHi: 100, iLo: 4, iHi: 4 },
    { bpLo: 100.1, bpHi: 150, iLo: 5, iHi: 5 },
    { bpLo: 150.1, bpHi: 999, iLo: 6, iHi: 6 },
  ],
};

/**
 * O3 Breakpoints for EAQI (maximum 8-hour mean, µg/m³)
 */
export const EAQI_O3: PollutantBreakpoints = {
  pollutantId: 'o3',
  averagingPeriod: 8,
  breakpoints: [
    { bpLo: 0, bpHi: 50, iLo: 1, iHi: 1 },
    { bpLo: 50.1, bpHi: 100, iLo: 2, iHi: 2 },
    { bpLo: 100.1, bpHi: 130, iLo: 3, iHi: 3 },
    { bpLo: 130.1, bpHi: 240, iLo: 4, iHi: 4 },
    { bpLo: 240.1, bpHi: 380, iLo: 5, iHi: 5 },
    { bpLo: 380.1, bpHi: 999, iLo: 6, iHi: 6 },
  ],
};

/**
 * NO2 Breakpoints for EAQI (1-hour, µg/m³)
 */
export const EAQI_NO2: PollutantBreakpoints = {
  pollutantId: 'no2',
  averagingPeriod: 1,
  breakpoints: [
    { bpLo: 0, bpHi: 40, iLo: 1, iHi: 1 },
    { bpLo: 40.1, bpHi: 90, iLo: 2, iHi: 2 },
    { bpLo: 90.1, bpHi: 120, iLo: 3, iHi: 3 },
    { bpLo: 120.1, bpHi: 230, iLo: 4, iHi: 4 },
    { bpLo: 230.1, bpHi: 340, iLo: 5, iHi: 5 },
    { bpLo: 340.1, bpHi: 999, iLo: 6, iHi: 6 },
  ],
};

/**
 * SO2 Breakpoints for EAQI (1-hour, µg/m³)
 */
export const EAQI_SO2: PollutantBreakpoints = {
  pollutantId: 'so2',
  averagingPeriod: 1,
  breakpoints: [
    { bpLo: 0, bpHi: 100, iLo: 1, iHi: 1 },
    { bpLo: 100.1, bpHi: 200, iLo: 2, iHi: 2 },
    { bpLo: 200.1, bpHi: 350, iLo: 3, iHi: 3 },
    { bpLo: 350.1, bpHi: 500, iLo: 4, iHi: 4 },
    { bpLo: 500.1, bpHi: 750, iLo: 5, iHi: 5 },
    { bpLo: 750.1, bpHi: 999, iLo: 6, iHi: 6 },
  ],
};

/**
 * Complete EAQI Profile
 * Note: EAQI does not include CO in its standard calculation
 */
export const EAQI_BREAKPOINTS: PollutantBreakpoints[] = [
  EAQI_PM25,
  EAQI_PM10,
  EAQI_O3,
  EAQI_NO2,
  EAQI_SO2,
];
