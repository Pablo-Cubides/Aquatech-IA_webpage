/**
 * IBOCA Bogotá Breakpoints - Índice Bogotano de Calidad del Aire
 * Source: Resolución 2840 de 2023, Secretaría de Ambiente de Bogotá
 * Evolution of ICA national for better episode management
 */

import type { PollutantBreakpoints, Category } from '../../types';

/**
 * IBOCA Bogotá Categories (0-500)
 * Adapted for Bogotá's specific conditions
 */
export const IBOCA_CATEGORIES: Category[] = [
  {
    min: 0,
    max: 50,
    name: 'Favorable',
    shortName: 'Favorable',
    color: '#00E400',
    bgColor: '#00E40020',
    healthMessage: 'La calidad del aire es favorable para realizar cualquier actividad al aire libre.',
    actions: 'Disfrute de las actividades al aire libre.',
  },
  {
    min: 51,
    max: 100,
    name: 'Aceptable',
    shortName: 'Aceptable',
    color: '#FFFF00',
    bgColor: '#FFFF0020',
    healthMessage: 'La calidad del aire es aceptable para la mayoría de las personas.',
    actions: 'Población sensible debe considerar reducir actividad física intensa.',
  },
  {
    min: 101,
    max: 150,
    name: 'Moderada',
    shortName: 'Moderada',
    color: '#FF7E00',
    bgColor: '#FF7E0020',
    healthMessage: 'Grupos sensibles pueden presentar síntomas respiratorios.',
    actions: 'Grupos sensibles deben reducir actividades al aire libre.',
  },
  {
    min: 151,
    max: 200,
    name: 'Mala',
    shortName: 'Mala',
    color: '#FF0000',
    bgColor: '#FF000020',
    healthMessage: 'Toda la población puede experimentar efectos adversos en la salud.',
    actions: 'Limite actividades al aire libre. Use tapabocas si es necesario.',
  },
  {
    min: 201,
    max: 300,
    name: 'Muy Mala',
    shortName: 'Muy Mala',
    color: '#8F3F97',
    bgColor: '#8F3F9720',
    healthMessage: 'Declaración de episodio por contaminación atmosférica.',
    actions: 'Evite actividades al aire libre. Permanezca en interiores.',
  },
  {
    min: 301,
    max: 500,
    name: 'Peligrosa',
    shortName: 'Peligrosa',
    color: '#7E0023',
    bgColor: '#7E002320',
    healthMessage: 'Emergencia por contaminación atmosférica. Alto riesgo para la salud.',
    actions: 'Quédese en casa. Siga las indicaciones de las autoridades.',
  },
];

/**
 * PM2.5 Breakpoints for IBOCA (24-hour average, µg/m³)
 * Stricter thresholds adapted for Bogotá
 */
export const IBOCA_PM25: PollutantBreakpoints = {
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
 * PM10 Breakpoints for IBOCA (24-hour average, µg/m³)
 */
export const IBOCA_PM10: PollutantBreakpoints = {
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
 * O3 Breakpoints for IBOCA (8-hour average, µg/m³)
 */
export const IBOCA_O3: PollutantBreakpoints = {
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
 * NO2 Breakpoints for IBOCA (1-hour average, µg/m³)
 */
export const IBOCA_NO2: PollutantBreakpoints = {
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
 * SO2 Breakpoints for IBOCA (1-hour average, µg/m³)
 */
export const IBOCA_SO2: PollutantBreakpoints = {
  pollutantId: 'so2',
  averagingPeriod: 1,
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
 * CO Breakpoints for IBOCA (8-hour average, mg/m³)
 */
export const IBOCA_CO: PollutantBreakpoints = {
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
