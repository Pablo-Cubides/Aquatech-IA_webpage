/**
 * NASA EONET (Earth Observatory Natural Event Tracker) API Integration
 * API Documentation: https://eonet.gsfc.nasa.gov/docs/v3
 */

import type { GeoJSONFeature } from "../types";

export interface EONETEvent {
  id: string;
  title: string;
  description: string;
  link: string;
  categories: Array<{
    id: string;
    title: string;
  }>;
  sources: Array<{
    id: string;
    url: string;
  }>;
  geometry: Array<{
    date: string;
    type: "Point" | "Polygon";
    coordinates: number[] | number[][];
  }>;
  closed?: string;
}

export interface EONETCategory {
  id: string;
  title: string;
  description: string;
  link: string;
}

export interface EONETParams {
  status?: "open" | "closed" | "all";
  limit?: number;
  days?: number;
  category?: string;
  start?: string; // YYYY-MM-DD
  end?: string; // YYYY-MM-DD
}

/**
 * Get all available event categories from EONET
 */
export async function getEONETCategories(): Promise<EONETCategory[]> {
  try {
    const response = await fetch(`/api/eonet/categories`);
    if (!response.ok) throw new Error("Failed to fetch EONET categories");
    const data = await response.json();
    return data.categories || [];
  } catch (error) {
    console.error("Error fetching EONET categories:", error);
    return [];
  }
}

/**
 * Get natural events from NASA EONET API
 */
export async function getEONETEvents(
  params: EONETParams = {},
): Promise<EONETEvent[]> {
  try {
    const queryParams = new URLSearchParams();

    if (params.status) queryParams.append("status", params.status);
    if (params.limit) queryParams.append("limit", params.limit.toString());
    if (params.days) queryParams.append("days", params.days.toString());
    if (params.start) queryParams.append("start", params.start);
    if (params.end) queryParams.append("end", params.end);
    if (params.category) queryParams.append("category", params.category);

    const fullUrl = `/api/eonet/events?${queryParams.toString()}`;
    const response = await fetch(fullUrl);

    if (!response.ok) throw new Error("Failed to fetch EONET events");

    const data = await response.json();
    return data.events || [];
  } catch (error) {
    console.error("Error fetching EONET events:", error);
    return [];
  }
}

/**
 * Convert EONET events to GeoJSON features
 */
export function eonetToGeoJSON(events: EONETEvent[]): GeoJSONFeature[] {
  const features: GeoJSONFeature[] = [];

  events.forEach((event) => {
    // Use the most recent geometry point
    const latestGeometry = event.geometry[event.geometry.length - 1];

    if (latestGeometry.type === "Point") {
      const coords = latestGeometry.coordinates as number[];

      features.push({
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [coords[0], coords[1]], // [lon, lat]
        },
        properties: {
          id: event.id,
          estacion: event.title,
          fecha: latestGeometry.date.split("T")[0],
          descripcion: event.description,
          categoria: event.categories[0]?.title || "Desconocido",
          categoria_id: event.categories[0]?.id || "",
          estado: event.closed ? "Cerrado" : "Activo",
          link: event.link,
          source: event.sources[0]?.url || "",
          _eventType: "eonet",
          _markerColor: getCategoryColor(event.categories[0]?.id || ""),
        },
      });
    } else if (latestGeometry.type === "Polygon") {
      // For polygons, use the centroid
      const coords = latestGeometry.coordinates as number[][];
      if (coords.length > 0) {
        const centroid = calculateCentroid(coords);
        features.push({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: centroid,
          },
          properties: {
            id: event.id,
            estacion: event.title,
            fecha: latestGeometry.date.split("T")[0],
            descripcion: event.description,
            categoria: event.categories[0]?.title || "Desconocido",
            categoria_id: event.categories[0]?.id || "",
            estado: event.closed ? "Cerrado" : "Activo",
            link: event.link,
            source: event.sources[0]?.url || "",
            _eventType: "eonet",
            _markerColor: getCategoryColor(event.categories[0]?.id || ""),
          },
        });
      }
    }
  });

  return features;
}

/**
 * Calculate centroid of a polygon
 */
function calculateCentroid(coords: number[][]): [number, number] {
  let totalLon = 0;
  let totalLat = 0;
  const count = coords.length;

  coords.forEach((coord) => {
    totalLon += coord[0];
    totalLat += coord[1];
  });

  return [totalLon / count, totalLat / count];
}

/**
 * Get color based on event category
 */
export function getCategoryColor(categoryId: string): string {
  const colorMap: Record<string, string> = {
    wildfires: "#ff4500", // Red-Orange
    volcanoes: "#dc143c", // Crimson
    "severe-storms": "#4169e1", // Royal Blue
    floods: "#1e90ff", // Dodger Blue
    drought: "#daa520", // Goldenrod
    "dust-and-haze": "#cd853f", // Peru
    earthquakes: "#8b4513", // Saddle Brown
    "sea-and-lake-ice": "#87ceeb", // Sky Blue
    "temperature-extremes": "#ff6347", // Tomato
    landslides: "#8b4513", // Saddle Brown
    "snow-and-ice": "#b0e0e6", // Powder Blue
    "water-color": "#20b2aa", // Light Sea Green
    manmade: "#696969", // Dim Gray
  };

  return colorMap[categoryId] || "#808080"; // Default gray
}

/**
 * Get category display name in Spanish
 */
export function getCategoryNameES(categoryId: string): string {
  const nameMap: Record<string, string> = {
    wildfires: "Incendios Forestales",
    volcanoes: "Volcanes",
    "severe-storms": "Tormentas Severas",
    floods: "Inundaciones",
    drought: "Sequías",
    "dust-and-haze": "Polvo y Neblina",
    earthquakes: "Terremotos",
    "sea-and-lake-ice": "Hielo Marino y Lacustre",
    "temperature-extremes": "Temperaturas Extremas",
    landslides: "Deslizamientos de Tierra",
    "snow-and-ice": "Nieve y Hielo",
    "water-color": "Color del Agua",
    manmade: "Eventos Artificiales",
  };

  return nameMap[categoryId] || categoryId;
}

/**
 * Get all unique categories from events
 */
export function getEventCategories(events: EONETEvent[]): string[] {
  const categories = new Set<string>();
  events.forEach((event) => {
    if (event.categories[0]?.id) {
      categories.add(event.categories[0].id);
    }
  });
  return Array.from(categories);
}
