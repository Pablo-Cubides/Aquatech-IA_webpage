/**
 * OpenAQ API Service
 * https://docs.openaq.org/docs
 */

export interface OpenAQLocation {
  id: number;
  name: string;
  locality?: string;
  timezone?: string;
  country: {
    id: string;
    code: string;
    name: string;
  };
  owner?: {
    id: number;
    name: string;
  };
  providers?: Array<{
    id: number;
    name: string;
  }>;
  isMobile: boolean;
  isMonitor: boolean;
  instruments?: Array<{
    id: number;
    name: string;
  }>;
  sensors?: Array<{
    id: number;
    name: string;
    parameter: {
      id: number;
      name: string;
      units: string;
      displayName: string;
    };
  }>;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  bounds?: number[];
  distance?: number;
  datetime_first?: {
    utc: string;
    local: string;
  };
  datetime_last?: {
    utc: string;
    local: string;
  };
}

export interface OpenAQMeasurement {
  locationId: number;
  location: string;
  parameter: {
    id: number;
    name: string;
    units: string;
    displayName: string;
  };
  value: number;
  date: {
    utc: string;
    local: string;
  };
  coordinates: {
    latitude: number;
    longitude: number;
  };
  country: {
    id: string;
    code: string;
    name: string;
  };
  city?: string;
  isMobile: boolean;
  isAnalysis: boolean;
  entity?: string;
  sensorType?: string;
}

const OPENAQ_API_BASE = 'https://api.openaq.org/v3';

/**
 * Get locations near a coordinate with recent measurements
 */
export async function getOpenAQLocations(params: {
  latitude?: number;
  longitude?: number;
  radius?: number; // in km
  country?: string;
  city?: string;
  limit?: number;
  parameter?: string; // pm25, pm10, o3, no2, so2, co
}): Promise<OpenAQLocation[]> {
  try {
    const searchParams = new URLSearchParams();
    
    if (params.latitude && params.longitude) {
      searchParams.append('coordinates', `${params.latitude},${params.longitude}`);
      if (params.radius) {
        searchParams.append('radius', (params.radius * 1000).toString()); // convert km to m
      }
    }
    
    if (params.country) searchParams.append('country', params.country);
    if (params.city) searchParams.append('city', params.city);
    if (params.parameter) searchParams.append('parameter', params.parameter);
    searchParams.append('limit', (params.limit || 100).toString());
    searchParams.append('order_by', 'lastUpdated');
    searchParams.append('sort', 'desc');

    const response = await fetch(`${OPENAQ_API_BASE}/locations?${searchParams.toString()}`, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`OpenAQ API error: ${response.status}`);
    }

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Error fetching OpenAQ locations:', error);
    return [];
  }
}

/**
 * Get latest measurements for locations
 */
export async function getOpenAQMeasurements(params: {
  locationId?: number;
  country?: string;
  city?: string;
  parameter?: string;
  latitude?: number;
  longitude?: number;
  radius?: number;
  limit?: number;
  dateFrom?: string; // ISO format
  dateTo?: string; // ISO format
}): Promise<OpenAQMeasurement[]> {
  try {
    const searchParams = new URLSearchParams();
    
    if (params.locationId) searchParams.append('location_id', params.locationId.toString());
    if (params.country) searchParams.append('country', params.country);
    if (params.city) searchParams.append('city', params.city);
    if (params.parameter) searchParams.append('parameter', params.parameter);
    
    if (params.latitude && params.longitude) {
      searchParams.append('coordinates', `${params.latitude},${params.longitude}`);
      if (params.radius) {
        searchParams.append('radius', (params.radius * 1000).toString());
      }
    }
    
    if (params.dateFrom) searchParams.append('date_from', params.dateFrom);
    if (params.dateTo) searchParams.append('date_to', params.dateTo);
    
    searchParams.append('limit', (params.limit || 1000).toString());
    searchParams.append('order_by', 'datetime');
    searchParams.append('sort', 'desc');

    const response = await fetch(`${OPENAQ_API_BASE}/measurements?${searchParams.toString()}`, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`OpenAQ API error: ${response.status}`);
    }

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Error fetching OpenAQ measurements:', error);
    return [];
  }
}

/**
 * Get available parameters (pollutants)
 */
export async function getOpenAQParameters(): Promise<Array<{
  id: number;
  name: string;
  units: string;
  displayName: string;
  description?: string;
}>> {
  try {
    const response = await fetch(`${OPENAQ_API_BASE}/parameters`, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`OpenAQ API error: ${response.status}`);
    }

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error('Error fetching OpenAQ parameters:', error);
    return [];
  }
}

/**
 * Convert OpenAQ measurements to GeoJSON features
 */
export function openAQToGeoJSON(measurements: OpenAQMeasurement[]) {
  return measurements
    .filter(m => m.coordinates && m.coordinates.latitude && m.coordinates.longitude)
    .map(m => ({
      type: 'Feature' as const,
      geometry: {
        type: 'Point' as const,
        coordinates: [m.coordinates.longitude, m.coordinates.latitude],
      },
      properties: {
        id: `openaq-${m.locationId}-${m.date.utc}`,
        source: 'openaq',
        locationId: m.locationId,
        location: m.location,
        parameter: m.parameter.name,
        parameterDisplay: m.parameter.displayName,
        value: m.value,
        units: m.parameter.units,
        date: m.date.local,
        dateUTC: m.date.utc,
        country: m.country.name,
        countryCode: m.country.code,
        city: m.city || 'N/A',
        isMobile: m.isMobile,
        sensorType: m.sensorType || 'N/A',
        entity: m.entity || 'N/A',
      },
    }));
}

/**
 * Get air quality index color based on parameter and value
 */
export function getAQIColor(parameter: string, value: number): string {
  // Simplified AQI color coding
  const thresholds: Record<string, number[]> = {
    pm25: [12, 35.4, 55.4, 150.4, 250.4], // µg/m³
    pm10: [54, 154, 254, 354, 424], // µg/m³
    o3: [54, 70, 85, 105, 200], // ppb
    no2: [53, 100, 360, 649, 1249], // ppb
    so2: [35, 75, 185, 304, 604], // ppb
    co: [4.4, 9.4, 12.4, 15.4, 30.4], // ppm
  };

  const colors = [
    '#00E400', // Good (Green)
    '#FFFF00', // Moderate (Yellow)
    '#FF7E00', // Unhealthy for Sensitive Groups (Orange)
    '#FF0000', // Unhealthy (Red)
    '#8F3F97', // Very Unhealthy (Purple)
    '#7E0023', // Hazardous (Maroon)
  ];

  const paramThresholds = thresholds[parameter.toLowerCase()];
  if (!paramThresholds) return colors[0]; // Default to good

  for (let i = 0; i < paramThresholds.length; i++) {
    if (value <= paramThresholds[i]) {
      return colors[i];
    }
  }

  return colors[colors.length - 1]; // Hazardous
}

/**
 * Get AQI category label
 */
export function getAQICategory(parameter: string, value: number): string {
  const thresholds: Record<string, number[]> = {
    pm25: [12, 35.4, 55.4, 150.4, 250.4],
    pm10: [54, 154, 254, 354, 424],
    o3: [54, 70, 85, 105, 200],
    no2: [53, 100, 360, 649, 1249],
    so2: [35, 75, 185, 304, 604],
    co: [4.4, 9.4, 12.4, 15.4, 30.4],
  };

  const categories = [
    'Bueno',
    'Moderado',
    'Malo para Sensibles',
    'Malo',
    'Muy Malo',
    'Peligroso',
  ];

  const paramThresholds = thresholds[parameter.toLowerCase()];
  if (!paramThresholds) return categories[0];

  for (let i = 0; i < paramThresholds.length; i++) {
    if (value <= paramThresholds[i]) {
      return categories[i];
    }
  }

  return categories[categories.length - 1];
}
