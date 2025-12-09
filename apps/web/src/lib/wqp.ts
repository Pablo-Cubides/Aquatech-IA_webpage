/**
 * Water Quality Portal (WQP) API Integration
 * USGS + EPA + 400+ agencies water quality data
 * Base URL: https://www.waterqualitydata.us
 * Documentation: https://www.waterqualitydata.us/webservices_documentation/
 */

export interface WQPStation {
  OrganizationIdentifier: string;
  OrganizationFormalName: string;
  MonitoringLocationIdentifier: string;
  MonitoringLocationName: string;
  MonitoringLocationTypeName: string;
  MonitoringLocationDescriptionText?: string;
  HUCEightDigitCode?: string;
  LatitudeMeasure: number;
  LongitudeMeasure: number;
  SourceMapScaleNumeric?: string;
  HorizontalCoordinateReferenceSystemDatumName?: string;
  CountryCode: string;
  StateCode?: string;
  CountyCode?: string;
  ProviderName: string; // NWIS, STEWARDS, STORET
}

export interface WQPSearchParams {
  bBox?: string; // "west,south,east,north" in decimal degrees
  countrycode?: string; // "US", "MX", "CA"
  statecode?: string; // "US:06" (California)
  countycode?: string; // "US:06:075" (San Francisco)
  characteristicName?: string; // "Temperature", "pH", etc.
  characteristicType?: string; // "Nutrient", "Physical", etc.
  siteType?: string; // "Stream", "Lake", etc.
  startDateLo?: string; // "01-01-2020"
  startDateHi?: string; // "12-31-2023"
  providers?: string[]; // ["NWIS", "STORET", "STEWARDS"]
}

export interface WQPStationResult {
  stations: WQPStation[];
  totalCount: number;
}

const BASE_URL = 'https://www.waterqualitydata.us';

/**
 * Search for monitoring stations with geographic coordinates
 */
export async function searchStations(
  params: WQPSearchParams
): Promise<WQPStationResult> {
  try {
    const queryParams = new URLSearchParams();
    
    // Bounding box for map view
    if (params.bBox) {
      queryParams.append('bBox', params.bBox);
    }
    
    if (params.countrycode) {
      queryParams.append('countrycode', params.countrycode);
    }
    
    if (params.statecode) {
      queryParams.append('statecode', params.statecode);
    }
    
    if (params.countycode) {
      queryParams.append('countycode', params.countycode);
    }
    
    if (params.characteristicName) {
      queryParams.append('characteristicName', params.characteristicName);
    }
    
    if (params.characteristicType) {
      queryParams.append('characteristicType', params.characteristicType);
    }
    
    if (params.siteType) {
      queryParams.append('siteType', params.siteType);
    }
    
    if (params.startDateLo) {
      queryParams.append('startDateLo', params.startDateLo);
    }
    
    if (params.startDateHi) {
      queryParams.append('startDateHi', params.startDateHi);
    }
    
    if (params.providers && params.providers.length > 0) {
      params.providers.forEach(provider => {
        queryParams.append('providers', provider);
      });
    }
    
    // Return as GeoJSON for easy mapping
    queryParams.append('mimeType', 'geojson');
    queryParams.append('zip', 'no');

    const response = await fetch(
      `${BASE_URL}/data/Station/search?${queryParams}`
    );
    
    if (!response.ok) {
      throw new Error(`WQP API error: ${response.status}`);
    }

    const geojson = await response.json();
    
    // Extract stations from GeoJSON features
    const stations: WQPStation[] = geojson.features.map((feature: any) => ({
      ...feature.properties,
      LatitudeMeasure: feature.geometry.coordinates[1],
      LongitudeMeasure: feature.geometry.coordinates[0],
    }));

    return {
      stations,
      totalCount: stations.length,
    };
  } catch (error) {
    console.error('Error fetching WQP stations:', error);
    throw error;
  }
}

/**
 * Popular water quality parameters
 */
export const POPULAR_CHARACTERISTICS = [
  {
    name: 'Temperatura',
    value: 'Temperature, water',
    icon: '🌡️',
    unit: '°C',
    description: 'Temperatura del agua'
  },
  {
    name: 'pH',
    value: 'pH',
    icon: '⚗️',
    unit: 'pH',
    description: 'Acidez o alcalinidad'
  },
  {
    name: 'Oxígeno Disuelto',
    value: 'Dissolved oxygen (DO)',
    icon: '💧',
    unit: 'mg/L',
    description: 'Oxígeno disponible para vida acuática'
  },
  {
    name: 'Turbidez',
    value: 'Turbidity',
    icon: '🌫️',
    unit: 'NTU',
    description: 'Claridad del agua'
  },
  {
    name: 'Conductividad',
    value: 'Specific conductance',
    icon: '⚡',
    unit: 'µS/cm',
    description: 'Contenido de sales disueltas'
  },
  {
    name: 'Nitratos',
    value: 'Nitrate',
    icon: '🧪',
    unit: 'mg/L',
    description: 'Nutriente indicador de contaminación'
  },
  {
    name: 'Fosfatos',
    value: 'Phosphate-phosphorus',
    icon: '🧬',
    unit: 'mg/L',
    description: 'Nutriente causante de eutrofización'
  },
  {
    name: 'Coliformes Fecales',
    value: 'Fecal Coliform',
    icon: '🦠',
    unit: 'CFU/100mL',
    description: 'Indicador de contaminación fecal'
  },
];

/**
 * Characteristic types (categories)
 */
export const CHARACTERISTIC_TYPES = [
  {
    value: 'Physical',
    label: 'Físicos',
    description: 'Temperatura, turbidez, color, olor'
  },
  {
    value: 'Nutrient',
    label: 'Nutrientes',
    description: 'Nitrógeno, fósforo, carbono'
  },
  {
    value: 'Inorganics, Major, Metals',
    label: 'Metales',
    description: 'Plomo, mercurio, cadmio, arsénico'
  },
  {
    value: 'Inorganics, Major, Non-metals',
    label: 'Inorgánicos',
    description: 'Cloro, sulfatos, carbonatos'
  },
  {
    value: 'Microbiological',
    label: 'Microbiológicos',
    description: 'Bacterias, coliformes, patógenos'
  },
  {
    value: 'Organics, other',
    label: 'Orgánicos',
    description: 'Pesticidas, herbicidas, químicos'
  },
];

/**
 * Site types
 */
export const SITE_TYPES = [
  {
    value: 'Stream',
    label: 'Río/Arroyo',
    icon: '🏞️',
    description: 'Cuerpos de agua fluyentes'
  },
  {
    value: 'Lake, Reservoir, Impoundment',
    label: 'Lago/Embalse',
    icon: '🏔️',
    description: 'Cuerpos de agua estancados'
  },
  {
    value: 'Well',
    label: 'Pozo',
    icon: '⛲',
    description: 'Agua subterránea'
  },
  {
    value: 'Estuary',
    label: 'Estuario',
    icon: '🌊',
    description: 'Desembocadura de ríos al mar'
  },
  {
    value: 'Ocean',
    label: 'Océano',
    icon: '🌊',
    description: 'Aguas marinas'
  },
  {
    value: 'Spring',
    label: 'Manantial',
    icon: '💦',
    description: 'Surgencia natural de agua'
  },
  {
    value: 'Wetland',
    label: 'Humedal',
    icon: '🌾',
    description: 'Pantanos, ciénagas, marismas'
  },
];

/**
 * Get marker color by site type
 */
export function getSiteTypeColor(siteType?: string): string {
  if (!siteType) return '#3498db';
  
  const lowerType = siteType.toLowerCase();
  
  if (lowerType.includes('stream') || lowerType.includes('river')) {
    return '#3498db'; // Blue for streams
  }
  if (lowerType.includes('lake') || lowerType.includes('reservoir')) {
    return '#2ecc71'; // Green for lakes
  }
  if (lowerType.includes('well')) {
    return '#9b59b6'; // Purple for wells
  }
  if (lowerType.includes('estuary') || lowerType.includes('ocean')) {
    return '#1abc9c'; // Teal for marine
  }
  if (lowerType.includes('wetland')) {
    return '#27ae60'; // Dark green for wetlands
  }
  if (lowerType.includes('spring')) {
    return '#16a085'; // Turquoise for springs
  }
  
  return '#95a5a6'; // Gray for unknown
}

/**
 * Format station for display
 */
export function formatStation(station: WQPStation): string {
  const parts: string[] = [];
  
  parts.push(`<strong>${station.MonitoringLocationName || station.MonitoringLocationIdentifier}</strong>`);
  
  if (station.MonitoringLocationTypeName) {
    parts.push(`Tipo: ${station.MonitoringLocationTypeName}`);
  }
  
  if (station.OrganizationFormalName) {
    parts.push(`Organización: ${station.OrganizationFormalName}`);
  }
  
  if (station.MonitoringLocationDescriptionText) {
    parts.push(`${station.MonitoringLocationDescriptionText}`);
  }
  
  if (station.ProviderName) {
    parts.push(`Fuente: ${station.ProviderName}`);
  }
  
  return parts.join('<br>');
}

/**
 * Create bounding box string from map bounds
 */
export function createBBox(
  west: number,
  south: number,
  east: number,
  north: number
): string {
  return `${west},${south},${east},${north}`;
}
