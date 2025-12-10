/**
 * Index Profiles - Central registry of all AQI calculation profiles
 */

import type { IndexProfile, IndexProfileId } from '../types';
import { US_AQI_BREAKPOINTS, US_AQI_CATEGORIES } from './breakpoints/us-aqi';
import { ICA_COLOMBIA_BREAKPOINTS, ICA_COLOMBIA_CATEGORIES } from './breakpoints/ica-colombia';
import { IBOCA_BREAKPOINTS, IBOCA_CATEGORIES } from './breakpoints/iboca-bogota';
import { EAQI_BREAKPOINTS, EAQI_CATEGORIES } from './breakpoints/eaqi-europe';
import { WHO_INDEX_CATEGORIES } from './breakpoints/who-guidelines';

/**
 * US AQI Profile
 */
export const US_AQI_PROFILE: IndexProfile = {
  id: 'us-aqi',
  name: 'US AQI',
  nameLong: 'US EPA Air Quality Index',
  country: 'Estados Unidos',
  description: 'Índice de Calidad del Aire de la Agencia de Protección Ambiental de Estados Unidos (EPA)',
  normativeReference: 'EPA 454/B-12-001',
  range: { min: 0, max: 500 },
  pollutantBreakpoints: US_AQI_BREAKPOINTS,
  categories: US_AQI_CATEGORIES,
};

/**
 * ICA Colombia Profile
 */
export const ICA_COLOMBIA_PROFILE: IndexProfile = {
  id: 'ica-colombia',
  name: 'ICA Colombia',
  nameLong: 'Índice de Calidad del Aire - Colombia',
  country: 'Colombia',
  description: 'Índice nacional de calidad del aire basado en metodología EPA, adoptado por el IDEAM',
  normativeReference: 'Resolución 2254 de 2017',
  range: { min: 0, max: 500 },
  pollutantBreakpoints: ICA_COLOMBIA_BREAKPOINTS,
  categories: ICA_COLOMBIA_CATEGORIES,
};

/**
 * IBOCA Bogotá Profile
 */
export const IBOCA_PROFILE: IndexProfile = {
  id: 'iboca-bogota',
  name: 'IBOCA',
  nameLong: 'Índice Bogotano de Calidad del Aire',
  country: 'Colombia - Bogotá',
  description: 'Índice local de Bogotá para gestión de episodios de contaminación atmosférica',
  normativeReference: 'Resolución 2840 de 2023',
  range: { min: 0, max: 500 },
  pollutantBreakpoints: IBOCA_BREAKPOINTS,
  categories: IBOCA_CATEGORIES,
};

/**
 * EAQI Europe Profile
 */
export const EAQI_PROFILE: IndexProfile = {
  id: 'eaqi-europe',
  name: 'EAQI',
  nameLong: 'European Air Quality Index',
  country: 'Unión Europea',
  description: 'Índice europeo de calidad del aire de la Agencia Europea de Medio Ambiente (EEA)',
  normativeReference: 'EEA Air Quality Index',
  range: { min: 1, max: 6 },
  pollutantBreakpoints: EAQI_BREAKPOINTS,
  categories: EAQI_CATEGORIES,
};

/**
 * WHO Index Profile (internal, percentage-based)
 */
export const WHO_INDEX_PROFILE: IndexProfile = {
  id: 'who-index',
  name: 'Índice OMS',
  nameLong: 'Índice basado en Guías OMS 2021',
  country: 'Global',
  description: 'Índice interno basado en el porcentaje sobre los valores guía de la OMS 2021. No es un estándar oficial.',
  normativeReference: 'WHO Global Air Quality Guidelines 2021',
  range: { min: 0, max: 9999 }, // Percentage, no upper limit
  pollutantBreakpoints: [], // Uses WHO_GUIDELINES instead
  categories: WHO_INDEX_CATEGORIES,
  isPercentageBased: true,
};

/**
 * All available index profiles
 */
export const INDEX_PROFILES: Record<IndexProfileId, IndexProfile> = {
  'us-aqi': US_AQI_PROFILE,
  'ica-colombia': ICA_COLOMBIA_PROFILE,
  'iboca-bogota': IBOCA_PROFILE,
  'eaqi-europe': EAQI_PROFILE,
  'who-index': WHO_INDEX_PROFILE,
};

/**
 * Get an index profile by ID
 */
export function getIndexProfile(id: IndexProfileId): IndexProfile | undefined {
  return INDEX_PROFILES[id];
}

/**
 * Get all available index profiles
 */
export function getAllIndexProfiles(): IndexProfile[] {
  return Object.values(INDEX_PROFILES);
}

/**
 * Get index profiles applicable for a country
 */
export function getProfilesForCountry(country: string): IndexProfile[] {
  const profiles = [US_AQI_PROFILE, EAQI_PROFILE, WHO_INDEX_PROFILE]; // Always available
  
  const countryLower = country.toLowerCase();
  
  if (countryLower.includes('colombia')) {
    profiles.push(ICA_COLOMBIA_PROFILE);
  }
  
  if (countryLower.includes('bogota') || countryLower.includes('bogotá')) {
    profiles.push(IBOCA_PROFILE);
  }
  
  return profiles;
}
