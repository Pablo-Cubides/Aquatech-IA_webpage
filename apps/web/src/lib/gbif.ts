/**
 * GBIF (Global Biodiversity Information Facility) API Integration
 * Base URL: https://api.gbif.org/v1
 * Documentation: https://www.gbif.org/developer/occurrence
 */

export interface GBIFOccurrence {
  key: number;
  scientificName: string;
  decimalLatitude: number;
  decimalLongitude: number;
  country?: string;
  countryCode?: string;
  year?: number;
  month?: number;
  day?: number;
  eventDate?: string;
  basisOfRecord?: string;
  kingdom?: string;
  phylum?: string;
  class?: string;
  order?: string;
  family?: string;
  genus?: string;
  species?: string;
  taxonKey?: number;
  speciesKey?: number;
  kingdomKey?: number;
  phylumKey?: number;
  classKey?: number;
  orderKey?: number;
  familyKey?: number;
  genusKey?: number;
  media?: Array<{
    type: string;
    format: string;
    identifier: string; // The URL
  }>;
}

export interface GBIFSearchParams {
  country?: string; // ISO 2-letter country code
  year?: number | string; // Year or range "2020,2023"
  taxonKey?: number; // Specific taxon
  scientificName?: string; // Scientific name
  hasCoordinate?: boolean;
  basisOfRecord?: string; // HUMAN_OBSERVATION, PRESERVED_SPECIMEN, etc.
  limit?: number;
  offset?: number;
  geometry?: string; // WKT polygon for geographic filtering
}

export interface GBIFSearchResult {
  offset: number;
  limit: number;
  endOfRecords: boolean;
  count: number;
  results: GBIFOccurrence[];
}

export interface TaxonSuggestion {
  key: number;
  scientificName: string;
  canonicalName: string;
  rank: string;
  kingdom?: string;
  phylum?: string;
  class?: string;
  order?: string;
  family?: string;
}

const BASE_URL = 'https://api.gbif.org/v1';

/**
 * Search for species occurrences with geographic coordinates
 */
export async function searchOccurrences(
  params: GBIFSearchParams
): Promise<GBIFSearchResult> {
  try {
    const queryParams = new URLSearchParams();
    
    // Always require coordinates for map display
    queryParams.append('hasCoordinate', 'true');
    
    if (params.country) {
      queryParams.append('country', params.country);
    }
    
    if (params.year) {
      queryParams.append('year', params.year.toString());
    }
    
    if (params.taxonKey) {
      queryParams.append('taxonKey', params.taxonKey.toString());
    }
    
    if (params.scientificName) {
      queryParams.append('scientificName', params.scientificName);
    }
    
    if (params.basisOfRecord) {
      queryParams.append('basisOfRecord', params.basisOfRecord);
    }
    
    if (params.geometry) {
      queryParams.append('geometry', params.geometry);
    }
    
    queryParams.append('limit', (params.limit || 300).toString());
    queryParams.append('offset', (params.offset || 0).toString());

    const response = await fetch(`/api/gbif/search?${queryParams}`);
    
    if (!response.ok) {
      throw new Error(`GBIF API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching GBIF occurrences:', error);
    throw error;
  }
}

/**
 * Search for taxon suggestions (autocomplete)
 */
export async function searchTaxonSuggestions(
  query: string,
  limit: number = 10
): Promise<TaxonSuggestion[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/species/suggest?q=${encodeURIComponent(query)}&limit=${limit}`
    );
    
    if (!response.ok) {
      throw new Error(`GBIF API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error searching taxon suggestions:', error);
    throw error;
  }
}

/**
 * Get taxon details by key
 */
export async function getTaxonDetails(taxonKey: number): Promise<TaxonSuggestion> {
  try {
    const response = await fetch(`${BASE_URL}/species/${taxonKey}`);
    
    if (!response.ok) {
      throw new Error(`GBIF API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching taxon details:', error);
    throw error;
  }
}

/**
 * Popular taxon groups for quick filtering
 */
export const POPULAR_TAXON_GROUPS = [
  {
    name: 'Aves',
    taxonKey: 212, // Aves class
    icon: '🦅',
    description: 'Pájaros y aves de todo tipo'
  },
  {
    name: 'Mamíferos',
    taxonKey: 359, // Mammalia class
    icon: '🦁',
    description: 'Mamíferos terrestres y acuáticos'
  },
  {
    name: 'Peces',
    taxonKey: 11676, // Actinopterygii class
    icon: '🐟',
    description: 'Peces de agua dulce y salada'
  },
  {
    name: 'Insectos',
    taxonKey: 216, // Insecta class
    icon: '🦋',
    description: 'Mariposas, escarabajos, abejas, etc.'
  },
  {
    name: 'Plantas',
    taxonKey: 7707728, // Tracheophyta phylum
    icon: '🌿',
    description: 'Plantas vasculares'
  },
  {
    name: 'Reptiles',
    taxonKey: 358, // Reptilia class
    icon: '🦎',
    description: 'Serpientes, lagartos, tortugas'
  },
  {
    name: 'Anfibios',
    taxonKey: 131, // Amphibia class
    icon: '🐸',
    description: 'Ranas, sapos, salamandras'
  },
  {
    name: 'Hongos',
    taxonKey: 5, // Fungi kingdom
    icon: '🍄',
    description: 'Hongos y setas'
  },
];

/**
 * Basis of record options
 */
export const BASIS_OF_RECORD_OPTIONS = [
  {
    value: 'HUMAN_OBSERVATION',
    label: 'Observación Humana',
    description: 'Observaciones directas en campo'
  },
  {
    value: 'PRESERVED_SPECIMEN',
    label: 'Espécimen Preservado',
    description: 'Especímenes en museos o colecciones'
  },
  {
    value: 'LIVING_SPECIMEN',
    label: 'Espécimen Vivo',
    description: 'Organismos vivos en jardines botánicos, zoológicos'
  },
  {
    value: 'FOSSIL_SPECIMEN',
    label: 'Fósil',
    description: 'Especímenes fosilizados'
  },
  {
    value: 'MACHINE_OBSERVATION',
    label: 'Observación Automática',
    description: 'Cámaras trampa, sensores automáticos'
  },
];

/**
 * Generate marker color based on taxon group
 */
export function getTaxonColor(occurrence: { classKey?: number; phylumKey?: number; kingdomKey?: number }): string {
  // Try to match at different taxonomic levels (class, phylum, kingdom)
  const taxonKeys = [occurrence.classKey, occurrence.phylumKey, occurrence.kingdomKey].filter(Boolean);
  
  for (const taxonKey of taxonKeys) {
    const group = POPULAR_TAXON_GROUPS.find(g => g.taxonKey === taxonKey);
    if (group) {
      const colors: Record<string, string> = {
        'Aves': '#4A90E2',
        'Mamíferos': '#E67E22',
        'Peces': '#3498DB',
        'Insectos': '#9B59B6',
        'Plantas': '#27AE60',
        'Reptiles': '#16A085',
        'Anfibios': '#F39C12',
        'Hongos': '#95A5A6',
      };
      return colors[group.name] || '#666666';
    }
  }
  
  return '#666666';
}

/**
 * Format occurrence for display
 */
export function formatOccurrence(occurrence: GBIFOccurrence): string {
  const parts: string[] = [];
  
  // Scientific name as main title
  parts.push(`<strong>🔬 ${occurrence.scientificName}</strong>`);
  
  // Taxonomy hierarchy
  const taxonomy: string[] = [];
  if (occurrence.kingdom) taxonomy.push(occurrence.kingdom);
  if (occurrence.phylum) taxonomy.push(occurrence.phylum);
  if (occurrence.class) taxonomy.push(occurrence.class);
  if (occurrence.order) taxonomy.push(occurrence.order);
  if (occurrence.family) taxonomy.push(occurrence.family);
  if (occurrence.genus) taxonomy.push(occurrence.genus);
  if (occurrence.species) taxonomy.push(occurrence.species);
  
  if (taxonomy.length > 0) {
    parts.push(`📚 Clasificación: ${taxonomy.join(' → ')}`);
  }
  
  // Temporal information
  if (occurrence.eventDate) {
    parts.push(`📅 ${occurrence.eventDate}`);
  } else if (occurrence.year) {
    parts.push(`📅 ${occurrence.year}`);
    if (occurrence.month) {
      parts.push(`${occurrence.month}/${occurrence.day || '01'}`);
    }
  }
  
  // Geographic information
  if (occurrence.country || occurrence.countryCode) {
    parts.push(`🌍 ${occurrence.country || occurrence.countryCode}`);
  }
  
  // Coordinates
  if (occurrence.decimalLatitude && occurrence.decimalLongitude) {
    parts.push(`📍 Lat: ${occurrence.decimalLatitude.toFixed(4)}°, Lon: ${occurrence.decimalLongitude.toFixed(4)}°`);
  }
  
  // Record basis
  if (occurrence.basisOfRecord) {
    const basis = BASIS_OF_RECORD_OPTIONS.find(b => b.value === occurrence.basisOfRecord);
    parts.push(`📋 ${basis?.label || occurrence.basisOfRecord}`);
  }
  
  return parts.join('<br>');
}

/**
 * Create bounding box WKT from map bounds
 */
export function createBBoxWKT(
  north: number,
  south: number,
  east: number,
  west: number
): string {
  return `POLYGON((${west} ${south},${east} ${south},${east} ${north},${west} ${north},${west} ${south}))`;
}
