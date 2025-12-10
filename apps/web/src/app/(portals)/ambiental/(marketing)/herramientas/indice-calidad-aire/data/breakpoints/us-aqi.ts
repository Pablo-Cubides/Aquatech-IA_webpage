/**
 * US AQI Breakpoints - EPA Air Quality Index
 * Source: EPA 454/B-12-001 (Technical Assistance Document)
 * Reference: https://www.airnow.gov/aqi/aqi-basics/
 */

import type { PollutantBreakpoints, Category } from '../../types';

/**
 * US AQI Categories (0-500)
 */
export const US_AQI_CATEGORIES: Category[] = [
  {
    min: 0,
    max: 50,
    name: 'Buena',
    shortName: 'Buena',
    color: '#00E400',
    bgColor: '#00E40020',
    healthMessage: 'La calidad del aire es satisfactoria y la contaminación del aire representa poco o ningún riesgo.',
    actions: 'Disfrute de las actividades al aire libre.',
  },
  {
    min: 51,
    max: 100,
    name: 'Moderada',
    shortName: 'Moderada',
    color: '#FFFF00',
    bgColor: '#FFFF0020',
    healthMessage: 'La calidad del aire es aceptable. Algunas personas muy sensibles pueden experimentar síntomas.',
    actions: 'Grupos sensibles deben considerar reducir actividades prolongadas al aire libre.',
  },
  {
    min: 101,
    max: 150,
    name: 'Dañina para grupos sensibles',
    shortName: 'Sensibles',
    color: '#FF7E00',
    bgColor: '#FF7E0020',
    healthMessage: 'Los grupos sensibles pueden experimentar efectos en la salud. El público general no será afectado.',
    actions: 'Grupos sensibles deben reducir esfuerzos prolongados al aire libre.',
  },
  {
    min: 151,
    max: 200,
    name: 'Dañina',
    shortName: 'Dañina',
    color: '#FF0000',
    bgColor: '#FF000020',
    healthMessage: 'Todos pueden comenzar a experimentar efectos en la salud. Grupos sensibles pueden experimentar efectos más graves.',
    actions: 'Todos deben reducir esfuerzos prolongados al aire libre.',
  },
  {
    min: 201,
    max: 300,
    name: 'Muy dañina',
    shortName: 'Muy dañina',
    color: '#8F3F97',
    bgColor: '#8F3F9720',
    healthMessage: 'Alerta de salud: todos pueden experimentar efectos de salud más graves.',
    actions: 'Todos deben evitar esfuerzos prolongados al aire libre.',
  },
  {
    min: 301,
    max: 500,
    name: 'Peligrosa',
    shortName: 'Peligrosa',
    color: '#7E0023',
    bgColor: '#7E002320',
    healthMessage: 'Advertencia de salud de emergencia. Toda la población tiene más probabilidades de verse afectada.',
    actions: 'Todos deben evitar cualquier actividad al aire libre.',
  },
];

/**
 * PM2.5 Breakpoints (24-hour average, µg/m³)
 */
export const US_AQI_PM25: PollutantBreakpoints = {
  pollutantId: 'pm25',
  averagingPeriod: 24,
  breakpoints: [
    { bpLo: 0.0, bpHi: 12.0, iLo: 0, iHi: 50 },
    { bpLo: 12.1, bpHi: 35.4, iLo: 51, iHi: 100 },
    { bpLo: 35.5, bpHi: 55.4, iLo: 101, iHi: 150 },
    { bpLo: 55.5, bpHi: 150.4, iLo: 151, iHi: 200 },
    { bpLo: 150.5, bpHi: 250.4, iLo: 201, iHi: 300 },
    { bpLo: 250.5, bpHi: 500.4, iLo: 301, iHi: 500 },
  ],
};

/**
 * PM10 Breakpoints (24-hour average, µg/m³)
 */
export const US_AQI_PM10: PollutantBreakpoints = {
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
 * O3 Breakpoints (8-hour average, ppm converted to µg/m³)
 * 1 ppm O3 = 1960 µg/m³ at 25°C, 1 atm
 * EPA uses ppm, we convert to µg/m³ for consistency
 */
export const US_AQI_O3_8H: PollutantBreakpoints = {
  pollutantId: 'o3',
  averagingPeriod: 8,
  breakpoints: [
    { bpLo: 0, bpHi: 108, iLo: 0, iHi: 50 },       // 0-0.054 ppm
    { bpLo: 109, bpHi: 140, iLo: 51, iHi: 100 },   // 0.055-0.070 ppm
    { bpLo: 141, bpHi: 168, iLo: 101, iHi: 150 },  // 0.071-0.085 ppm
    { bpLo: 169, bpHi: 206, iLo: 151, iHi: 200 },  // 0.086-0.105 ppm
    { bpLo: 207, bpHi: 392, iLo: 201, iHi: 300 },  // 0.106-0.200 ppm
  ],
};

/**
 * NO2 Breakpoints (1-hour average, ppb converted to µg/m³)
 * 1 ppb NO2 = 1.88 µg/m³ at 25°C, 1 atm
 */
export const US_AQI_NO2: PollutantBreakpoints = {
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
 * SO2 Breakpoints (1-hour average, ppb converted to µg/m³)
 * 1 ppb SO2 = 2.62 µg/m³ at 25°C, 1 atm
 */
export const US_AQI_SO2: PollutantBreakpoints = {
  pollutantId: 'so2',
  averagingPeriod: 1,
  breakpoints: [
    { bpLo: 0, bpHi: 92, iLo: 0, iHi: 50 },       // 0-35 ppb
    { bpLo: 93, bpHi: 196, iLo: 51, iHi: 100 },   // 36-75 ppb
    { bpLo: 197, bpHi: 484, iLo: 101, iHi: 150 }, // 76-185 ppb
    { bpLo: 485, bpHi: 796, iLo: 151, iHi: 200 }, // 186-304 ppb
    { bpLo: 797, bpHi: 1583, iLo: 201, iHi: 300 },
    { bpLo: 1584, bpHi: 2620, iLo: 301, iHi: 500 },
  ],
};

/**
 * CO Breakpoints (8-hour average, mg/m³)
 * EPA uses ppm, we use mg/m³
 * 1 ppm CO = 1.145 mg/m³ at 25°C, 1 atm
 */
export const US_AQI_CO: PollutantBreakpoints = {
  pollutantId: 'co',
  averagingPeriod: 8,
  breakpoints: [
    { bpLo: 0, bpHi: 5.0, iLo: 0, iHi: 50 },
    { bpLo: 5.1, bpHi: 10.4, iLo: 51, iHi: 100 },
    { bpLo: 10.5, bpHi: 14.3, iLo: 101, iHi: 150 },
    { bpLo: 14.4, bpHi: 17.5, iLo: 151, iHi: 200 },
    { bpLo: 17.6, bpHi: 34.4, iLo: 201, iHi: 300 },
    { bpLo: 34.5, bpHi: 57.2, iLo: 301, iHi: 500 },
  ],
};

/**
 * Complete US AQI Profile
 */
export const US_AQI_BREAKPOINTS: PollutantBreakpoints[] = [
  US_AQI_PM25,
  US_AQI_PM10,
  US_AQI_O3_8H,
  US_AQI_NO2,
  US_AQI_SO2,
  US_AQI_CO,
];
