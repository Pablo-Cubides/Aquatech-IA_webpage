/**
 * Water Quality Portal (WQP) API Integration
 * USGS + EPA + 400+ agencies water quality data
 * Base URL: https://www.waterqualitydata.us
 * Documentation: https://www.waterqualitydata.us/webservices_documentation/
 */

// US States with their bounding boxes and state codes
export interface USState {
  code: string; // State code for API (e.g., "US:06")
  name: string;
  abbr: string; // State abbreviation (e.g., "CA")
  bbox: string; // "west,south,east,north" in decimal degrees
}

export const US_STATES: USState[] = [
  {
    code: "US:06",
    name: "California",
    abbr: "CA",
    bbox: "-124.48,32.53,-114.13,42.01",
  },
  {
    code: "US:48",
    name: "Texas",
    abbr: "TX",
    bbox: "-106.65,25.84,-93.51,36.50",
  },
  {
    code: "US:12",
    name: "Florida",
    abbr: "FL",
    bbox: "-87.63,24.52,-80.03,31.00",
  },
  {
    code: "US:36",
    name: "New York",
    abbr: "NY",
    bbox: "-79.76,40.50,-71.86,45.01",
  },
  {
    code: "US:42",
    name: "Pennsylvania",
    abbr: "PA",
    bbox: "-80.52,39.72,-74.69,42.27",
  },
  {
    code: "US:17",
    name: "Illinois",
    abbr: "IL",
    bbox: "-91.51,36.97,-87.02,42.51",
  },
  {
    code: "US:39",
    name: "Ohio",
    abbr: "OH",
    bbox: "-84.82,38.40,-80.52,41.98",
  },
  {
    code: "US:13",
    name: "Georgia",
    abbr: "GA",
    bbox: "-85.61,30.36,-80.84,35.00",
  },
  {
    code: "US:37",
    name: "North Carolina",
    abbr: "NC",
    bbox: "-84.32,33.84,-75.46,36.59",
  },
  {
    code: "US:26",
    name: "Michigan",
    abbr: "MI",
    bbox: "-90.42,41.70,-82.42,48.19",
  },
  {
    code: "US:53",
    name: "Washington",
    abbr: "WA",
    bbox: "-124.85,45.54,-116.92,49.00",
  },
  {
    code: "US:04",
    name: "Arizona",
    abbr: "AZ",
    bbox: "-114.82,31.33,-109.05,37.00",
  },
  {
    code: "US:25",
    name: "Massachusetts",
    abbr: "MA",
    bbox: "-73.51,41.24,-69.93,42.89",
  },
  {
    code: "US:55",
    name: "Wisconsin",
    abbr: "WI",
    bbox: "-92.89,42.49,-86.25,47.31",
  },
  {
    code: "US:27",
    name: "Minnesota",
    abbr: "MN",
    bbox: "-97.24,43.50,-89.49,49.38",
  },
  {
    code: "US:08",
    name: "Colorado",
    abbr: "CO",
    bbox: "-109.06,36.99,-102.04,41.00",
  },
  {
    code: "US:51",
    name: "Virginia",
    abbr: "VA",
    bbox: "-83.68,36.54,-75.24,39.47",
  },
  {
    code: "US:41",
    name: "Oregon",
    abbr: "OR",
    bbox: "-124.70,41.99,-116.46,46.29",
  },
  {
    code: "US:24",
    name: "Maryland",
    abbr: "MD",
    bbox: "-79.49,37.97,-75.05,39.72",
  },
  {
    code: "US:29",
    name: "Missouri",
    abbr: "MO",
    bbox: "-95.77,35.99,-89.10,40.61",
  },
];

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
  resultLimit?: number; // Max number of results to return (default 5000)
}

export interface WQPStationResult {
  stations: WQPStation[];
  totalCount: number;
}

interface WQPGeoJSONFeature {
  properties: Omit<WQPStation, "LatitudeMeasure" | "LongitudeMeasure">;
  geometry: {
    coordinates: [number, number];
  };
}

interface WQPGeoJSONResponse {
  features: WQPGeoJSONFeature[];
}

/**
 * Search for monitoring stations with geographic coordinates
 */
export async function searchStations(
  params: WQPSearchParams,
): Promise<WQPStationResult> {
  try {
    const queryParams = new URLSearchParams();

    // Bounding box for map view
    if (params.bBox) {
      queryParams.append("bBox", params.bBox);
    }

    if (params.countrycode) {
      queryParams.append("countrycode", params.countrycode);
    }

    if (params.statecode) {
      queryParams.append("statecode", params.statecode);
    }

    if (params.countycode) {
      queryParams.append("countycode", params.countycode);
    }

    if (params.characteristicName) {
      queryParams.append("characteristicName", params.characteristicName);
    }

    if (params.characteristicType) {
      queryParams.append("characteristicType", params.characteristicType);
    }

    if (params.siteType) {
      queryParams.append("siteType", params.siteType);
    }

    if (params.startDateLo) {
      queryParams.append("startDateLo", params.startDateLo);
    }

    if (params.startDateHi) {
      queryParams.append("startDateHi", params.startDateHi);
    }

    if (params.providers && params.providers.length > 0) {
      params.providers.forEach((provider) => {
        queryParams.append("providers", provider);
      });
    }

    // Limit results for performance (default 5000)
    if (params.resultLimit) {
      queryParams.append("resultLimit", params.resultLimit.toString());
    }

    // Return as GeoJSON for easy mapping
    queryParams.append("mimeType", "geojson");
    queryParams.append("zip", "no");

    const response = await fetch(`/api/wqp/search?${queryParams}`);

    if (!response.ok) {
      throw new Error(`WQP API error: ${response.status}`);
    }

    const geojson = (await response.json()) as WQPGeoJSONResponse;

    // Extract stations from GeoJSON features
    const stations: WQPStation[] = geojson.features.map((feature) => ({
      ...feature.properties,
      LatitudeMeasure: feature.geometry.coordinates[1],
      LongitudeMeasure: feature.geometry.coordinates[0],
    }));

    return {
      stations,
      totalCount: stations.length,
    };
  } catch (error) {
    console.error("Error fetching WQP stations:", error);
    throw error;
  }
}

/**
 * Popular water quality parameters
 */
export const POPULAR_CHARACTERISTICS = [
  {
    name: "Temperatura",
    value: "Temperature, water",
    icon: "🌡️",
    unit: "°C",
    description: "Temperatura del agua",
  },
  {
    name: "pH",
    value: "pH",
    icon: "⚗️",
    unit: "pH",
    description: "Acidez o alcalinidad",
  },
  {
    name: "Oxígeno Disuelto",
    value: "Dissolved oxygen (DO)",
    icon: "💧",
    unit: "mg/L",
    description: "Oxígeno disponible para vida acuática",
  },
  {
    name: "Turbidez",
    value: "Turbidity",
    icon: "🌫️",
    unit: "NTU",
    description: "Claridad del agua",
  },
  {
    name: "Conductividad",
    value: "Specific conductance",
    icon: "⚡",
    unit: "µS/cm",
    description: "Contenido de sales disueltas",
  },
  {
    name: "Nitratos",
    value: "Nitrate",
    icon: "🧪",
    unit: "mg/L",
    description: "Nutriente indicador de contaminación",
  },
  {
    name: "Fosfatos",
    value: "Phosphate-phosphorus",
    icon: "🧬",
    unit: "mg/L",
    description: "Nutriente causante de eutrofización",
  },
  {
    name: "Coliformes Fecales",
    value: "Fecal Coliform",
    icon: "🦠",
    unit: "CFU/100mL",
    description: "Indicador de contaminación fecal",
  },
];

/**
 * Characteristic types (categories)
 */
export const CHARACTERISTIC_TYPES = [
  {
    value: "Physical",
    label: "Físicos",
    description: "Temperatura, turbidez, color, olor",
  },
  {
    value: "Nutrient",
    label: "Nutrientes",
    description: "Nitrógeno, fósforo, carbono",
  },
  {
    value: "Inorganics, Major, Metals",
    label: "Metales",
    description: "Plomo, mercurio, cadmio, arsénico",
  },
  {
    value: "Inorganics, Major, Non-metals",
    label: "Inorgánicos",
    description: "Cloro, sulfatos, carbonatos",
  },
  {
    value: "Microbiological",
    label: "Microbiológicos",
    description: "Bacterias, coliformes, patógenos",
  },
  {
    value: "Organics, other",
    label: "Orgánicos",
    description: "Pesticidas, herbicidas, químicos",
  },
];

/**
 * Site types
 */
export const SITE_TYPES = [
  {
    value: "Stream",
    label: "Río/Arroyo",
    icon: "🏞️",
    description: "Cuerpos de agua fluyentes",
  },
  {
    value: "Lake, Reservoir, Impoundment",
    label: "Lago/Embalse",
    icon: "🏔️",
    description: "Cuerpos de agua estancados",
  },
  {
    value: "Well",
    label: "Pozo",
    icon: "⛲",
    description: "Agua subterránea",
  },
  {
    value: "Estuary",
    label: "Estuario",
    icon: "🌊",
    description: "Desembocadura de ríos al mar",
  },
  {
    value: "Ocean",
    label: "Océano",
    icon: "🌊",
    description: "Aguas marinas",
  },
  {
    value: "Spring",
    label: "Manantial",
    icon: "💦",
    description: "Surgencia natural de agua",
  },
  {
    value: "Wetland",
    label: "Humedal",
    icon: "🌾",
    description: "Pantanos, ciénagas, marismas",
  },
];

/**
 * Get marker color by site type
 */
export function getSiteTypeColor(siteType?: string): string {
  if (!siteType) return "#3498db";

  const lowerType = siteType.toLowerCase();

  if (lowerType.includes("stream") || lowerType.includes("river")) {
    return "#3498db"; // Blue for streams
  }
  if (lowerType.includes("lake") || lowerType.includes("reservoir")) {
    return "#2ecc71"; // Green for lakes
  }
  if (lowerType.includes("well")) {
    return "#9b59b6"; // Purple for wells
  }
  if (lowerType.includes("estuary") || lowerType.includes("ocean")) {
    return "#1abc9c"; // Teal for marine
  }
  if (lowerType.includes("wetland")) {
    return "#27ae60"; // Dark green for wetlands
  }
  if (lowerType.includes("spring")) {
    return "#16a085"; // Turquoise for springs
  }

  return "#95a5a6"; // Gray for unknown
}

/**
 * Format station for display with enhanced information
 */
export function formatStation(station: WQPStation): string {
  const parts: string[] = [];

  // Main title
  parts.push(
    `<strong>${station.MonitoringLocationName || station.MonitoringLocationIdentifier}</strong>`,
  );

  // Location type with emoji
  if (station.MonitoringLocationTypeName) {
    const typeEmoji = station.MonitoringLocationTypeName.includes("Stream")
      ? "🌊"
      : station.MonitoringLocationTypeName.includes("Lake")
        ? "💧"
        : station.MonitoringLocationTypeName.includes("Estuary")
          ? "🏞️"
          : "📍";
    parts.push(`${typeEmoji} ${station.MonitoringLocationTypeName}`);
  }

  // Coordinates
  if (station.LatitudeMeasure && station.LongitudeMeasure) {
    parts.push(
      `📍 Lat: ${station.LatitudeMeasure.toFixed(4)}°, Lon: ${station.LongitudeMeasure.toFixed(4)}°`,
    );
  }

  // Organization
  if (station.OrganizationFormalName) {
    parts.push(`🏢 ${station.OrganizationFormalName}`);
  }

  // Description
  if (station.MonitoringLocationDescriptionText) {
    parts.push(`ℹ️ ${station.MonitoringLocationDescriptionText}`);
  }

  // Provider
  if (station.ProviderName) {
    parts.push(`📊 Fuente: ${station.ProviderName}`);
  }

  // HUC information (watershed)
  if (station.HUCEightDigitCode) {
    parts.push(`🗺️ Cuenca: ${station.HUCEightDigitCode}`);
  }

  // State/County information
  if (station.StateCode || station.CountyCode) {
    const location: string[] = [];
    if (station.StateCode) location.push(station.StateCode);
    if (station.CountyCode) location.push(station.CountyCode);
    parts.push(`📌 ${location.join(" - ")}`);
  }

  return parts.join("<br>");
}

/**
 * Create bounding box string from map bounds
 */
export function createBBox(
  west: number,
  south: number,
  east: number,
  north: number,
): string {
  return `${west},${south},${east},${north}`;
}
