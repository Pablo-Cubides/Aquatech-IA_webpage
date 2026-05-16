/**
 * USGS Earthquake API Integration
 * Base URL: https://earthquake.usgs.gov/fdsnws/event/1/
 * Documentation: https://earthquake.usgs.gov/fdsnws/event/1/
 * Returns GeoJSON natively - no proxy needed (CORS enabled)
 */

import type { GeoJSONFeature } from "../app/(portals)/ambiental/(marketing)/herramientas/visor-mapas-ambientales/src/types";

export interface USGSEarthquakeParams {
  period?: "hour" | "day" | "week" | "month";
  minMagnitude?: "significant" | "4.5" | "2.5" | "1.0" | "all";
}

/**
 * Get color based on earthquake depth (km)
 */
export function getDepthColor(depth: number): string {
  if (depth < 10) return "#ff4444";    // Very shallow - bright red
  if (depth < 30) return "#ff8800";    // Shallow - orange
  if (depth < 70) return "#ffcc00";    // Intermediate - yellow
  if (depth < 150) return "#88cc00";   // Deep - yellow-green
  if (depth < 300) return "#00cc88";   // Deeper - teal
  return "#4488ff";                     // Very deep - blue
}

/**
 * Get magnitude display size
 */
export function getMagnitudeSize(mag: number): number {
  if (mag < 2) return 4;
  if (mag < 3) return 6;
  if (mag < 4) return 8;
  if (mag < 5) return 10;
  if (mag < 6) return 14;
  if (mag < 7) return 18;
  return 24;
}

/**
 * Fetch earthquakes from USGS GeoJSON feed
 */
export async function getEarthquakes(
  params: USGSEarthquakeParams = {}
): Promise<GeoJSONFeature[]> {
  try {
    const period = params.period || "week";
    const minMag = params.minMagnitude || "2.5";

    // USGS provides pre-built GeoJSON feeds
    const url = `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/${minMag}_${period}.geojson`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`USGS API error: ${response.status}`);
    }

    const data = await response.json();

    // Map to our GeoJSON feature format
    const features: GeoJSONFeature[] = (data.features || []).map((f: any) => {
      const coords = f.geometry.coordinates; // [lon, lat, depth]
      const props = f.properties;
      const depth = coords[2] || 0;
      const mag = props.mag || 0;

      return {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [coords[0], coords[1]],
        },
        properties: {
          id: f.id,
          _layerType: "usgs_earthquake",
          title: props.title,
          magnitude: mag,
          depth: depth,
          place: props.place,
          time: props.time,
          url: props.url,
          tsunami: props.tsunami,
          alert: props.alert,
          status: props.status,
          _markerColor: getDepthColor(depth),
        },
      };
    });

    return features;
  } catch (error) {
    console.error("Error fetching USGS earthquakes:", error);
    return [];
  }
}

/**
 * Earthquake depth legend ranges
 */
export const DEPTH_LEGEND = [
  { label: "< 10 km (Muy superficial)", color: "#ff4444" },
  { label: "10–30 km (Superficial)", color: "#ff8800" },
  { label: "30–70 km (Intermedio)", color: "#ffcc00" },
  { label: "70–150 km (Profundo)", color: "#88cc00" },
  { label: "150–300 km (Muy profundo)", color: "#00cc88" },
  { label: "> 300 km (Ultra profundo)", color: "#4488ff" },
];

/**
 * Available periods
 */
export const EARTHQUAKE_PERIODS = [
  { value: "hour", label: "Última hora" },
  { value: "day", label: "Últimas 24 horas" },
  { value: "week", label: "Últimos 7 días" },
  { value: "month", label: "Últimos 30 días" },
];

/**
 * Available magnitude thresholds
 */
export const EARTHQUAKE_MAGNITUDES = [
  { value: "significant", label: "Significativos" },
  { value: "4.5", label: "M 4.5+" },
  { value: "2.5", label: "M 2.5+" },
  { value: "1.0", label: "M 1.0+" },
  { value: "all", label: "Todos" },
];
