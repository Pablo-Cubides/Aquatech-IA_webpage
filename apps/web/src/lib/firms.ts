/**
 * NASA FIRMS (Fire Information for Resource Management System) API Integration
 * Base URL: https://firms.modaps.eosdis.nasa.gov
 * Documentation: https://firms.modaps.eosdis.nasa.gov/api/
 * Requires MAP_KEY for authentication
 */

import type { GeoJSONFeature } from "../app/(portals)/ambiental/(marketing)/herramientas/visor-mapas-ambientales/src/types";

export interface FIRMSParams {
  source?: "VIIRS_SNPP_NRT" | "VIIRS_NOAA20_NRT" | "MODIS_NRT";
  dayRange?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  area?: string; // "world" or country ISO code
}

/**
 * Get fire confidence color
 */
export function getFireConfidenceColor(confidence: string | number): string {
  const c = typeof confidence === "string" ? confidence.toLowerCase() : "";
  const n = typeof confidence === "number" ? confidence : parseInt(c);

  if (c === "high" || n >= 80) return "#ff0000";     // Red - high confidence
  if (c === "nominal" || n >= 50) return "#ff8c00";  // Orange - nominal
  if (c === "low" || n >= 30) return "#ffcc00";      // Yellow - low
  return "#ff8c00";                                    // Default orange
}

/**
 * Fetch active fires from NASA FIRMS via our API proxy
 */
export async function getActiveFires(
  params: FIRMSParams = {}
): Promise<GeoJSONFeature[]> {
  try {
    const source = params.source || "VIIRS_SNPP_NRT";
    const dayRange = params.dayRange || 2;
    const area = params.area || "-82,-5,-66,14";

    const queryParams = new URLSearchParams({
      source,
      day_range: dayRange.toString(),
      area,
    });

    const response = await fetch(`/api/firms/fires?${queryParams.toString()}`);
    if (!response.ok) {
      throw new Error(`FIRMS API error: ${response.status}`);
    }

    const data = await response.json();

    // The CSV data is parsed by the proxy into JSON array
    const features: GeoJSONFeature[] = (data || []).map((f: any, idx: number) => ({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [parseFloat(f.longitude), parseFloat(f.latitude)],
      },
      properties: {
        id: `fire-${idx}`,
        _layerType: "firms",
        brightness: parseFloat(f.bright_ti4 || f.brightness || 0),
        scan: parseFloat(f.scan || 0),
        track: parseFloat(f.track || 0),
        acq_date: f.acq_date,
        acq_time: f.acq_time,
        satellite: f.satellite,
        instrument: f.instrument,
        confidence: f.confidence,
        frp: parseFloat(f.frp || 0), // Fire Radiative Power
        daynight: f.daynight,
        _markerColor: getFireConfidenceColor(f.confidence),
      },
    }));

    return features;
  } catch (error) {
    console.error("Error fetching FIRMS data:", error);
    return [];
  }
}

/**
 * FIRMS data sources
 */
export const FIRMS_SOURCES = [
  { value: "VIIRS_SNPP_NRT", label: "VIIRS (Suomi NPP)", description: "Resolución 375m" },
  { value: "VIIRS_NOAA20_NRT", label: "VIIRS (NOAA-20)", description: "Resolución 375m" },
  { value: "MODIS_NRT", label: "MODIS (Terra/Aqua)", description: "Resolución 1km" },
];

/**
 * Confidence legend
 */
export const FIRE_CONFIDENCE_LEGEND = [
  { label: "Alta confianza", color: "#ff0000" },
  { label: "Confianza nominal", color: "#ff8c00" },
  { label: "Baja confianza", color: "#ffcc00" },
];
