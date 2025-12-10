/**
 * WHO Air Quality Guidelines 2021
 * Source: World Health Organization Global Air Quality Guidelines
 * Reference: https://www.who.int/publications/i/item/9789240034228
 * 
 * Note: WHO does not define an official index, but provides guideline values.
 * We create an internal "WHO Index" based on percentage over guideline.
 */

import type { WHOGuideline, Category } from '../../types';

/**
 * WHO Guidelines for each pollutant (µg/m³ unless specified)
 * Based on WHO Global Air Quality Guidelines 2021
 */
export const WHO_GUIDELINES: WHOGuideline[] = [
  {
    pollutantId: 'pm25',
    annualGuideline: 5,        // µg/m³ annual mean
    daily24hGuideline: 15,     // µg/m³ 24-hour mean (3-4 exceedances per year)
    unit: 'µg/m³',
  },
  {
    pollutantId: 'pm10',
    annualGuideline: 15,       // µg/m³ annual mean
    daily24hGuideline: 45,     // µg/m³ 24-hour mean
    unit: 'µg/m³',
  },
  {
    pollutantId: 'o3',
    eightHourGuideline: 100,   // µg/m³ 8-hour mean (peak season)
    unit: 'µg/m³',
  },
  {
    pollutantId: 'no2',
    annualGuideline: 10,       // µg/m³ annual mean
    daily24hGuideline: 25,     // µg/m³ 24-hour mean
    unit: 'µg/m³',
  },
  {
    pollutantId: 'so2',
    daily24hGuideline: 40,     // µg/m³ 24-hour mean
    unit: 'µg/m³',
  },
  {
    pollutantId: 'co',
    daily24hGuideline: 4,      // mg/m³ 24-hour mean
    unit: 'mg/m³',
  },
];

/**
 * WHO Index Categories (percentage-based)
 * This is our internal interpretation, not an official WHO index
 * 
 * 0-100% = Within guideline (complies)
 * 100-150% = Slight excess
 * 150-300% = High excess
 * >300% = Extreme excess
 */
export const WHO_INDEX_CATEGORIES: Category[] = [
  {
    min: 0,
    max: 100,
    name: 'Cumple con la guía OMS',
    shortName: 'Cumple',
    color: '#00E400',
    bgColor: '#00E40020',
    healthMessage: 'La concentración está dentro del valor guía de la OMS para protección de la salud.',
    actions: 'Nivel seguro según estándares OMS.',
  },
  {
    min: 101,
    max: 150,
    name: 'Exceso leve',
    shortName: 'Exceso leve',
    color: '#FFFF00',
    bgColor: '#FFFF0020',
    healthMessage: 'La concentración supera ligeramente el valor guía de la OMS.',
    actions: 'Grupos sensibles deben tomar precauciones.',
  },
  {
    min: 151,
    max: 300,
    name: 'Exceso alto',
    shortName: 'Exceso alto',
    color: '#FF7E00',
    bgColor: '#FF7E0020',
    healthMessage: 'La concentración supera significativamente el valor guía de la OMS.',
    actions: 'Se recomienda reducir exposición prolongada.',
  },
  {
    min: 301,
    max: 9999,
    name: 'Exceso extremo',
    shortName: 'Extremo',
    color: '#FF0000',
    bgColor: '#FF000020',
    healthMessage: 'La concentración es muy superior al valor guía de la OMS. Riesgo significativo para la salud.',
    actions: 'Evitar exposición. Tomar medidas de protección.',
  },
];

/**
 * Get WHO guideline for a specific pollutant and period
 */
export function getWHOGuideline(
  pollutantId: string,
  period: 'annual' | 'daily' | '8hour' | '1hour' = 'daily'
): number | undefined {
  const guideline = WHO_GUIDELINES.find(g => g.pollutantId === pollutantId);
  if (!guideline) return undefined;
  
  switch (period) {
    case 'annual':
      return guideline.annualGuideline;
    case 'daily':
      return guideline.daily24hGuideline;
    case '8hour':
      return guideline.eightHourGuideline;
    case '1hour':
      return guideline.oneHourGuideline;
    default:
      return guideline.daily24hGuideline || guideline.annualGuideline;
  }
}

/**
 * Get category based on percentage over WHO guideline
 */
export function getWHOCategory(percentage: number): Category {
  for (const category of WHO_INDEX_CATEGORIES) {
    if (percentage >= category.min && percentage <= category.max) {
      return category;
    }
  }
  return WHO_INDEX_CATEGORIES[WHO_INDEX_CATEGORIES.length - 1];
}

/**
 * Calculate percentage of WHO guideline
 * @param concentration Measured concentration
 * @param guideline WHO guideline value
 * @returns Percentage (100 = exactly at guideline)
 */
export function calculateWHOPercentage(concentration: number, guideline: number): number {
  return (concentration / guideline) * 100;
}
