"use client";

import { useEffect, useRef, useState } from "react";
import type * as MapLibreGL from "maplibre-gl";
import type { GeoJSONFeature } from "../types";
import { MAPBOX_CONFIG } from "../config/mapbox";
import { getAQIColor } from "../lib/openaq";

// Check if WebGL is supported
function isWebGLSupported(): { supported: boolean; error?: string } {
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl");

    if (!gl) {
      return {
        supported: false,
        error:
          "WebGL no está disponible en este navegador o está deshabilitado",
      };
    }

    return { supported: true };
  } catch (e) {
    return {
      supported: false,
      error: "Error al verificar soporte WebGL",
    };
  }
}

export interface MapComponentProps {
  data: GeoJSONFeature[];
  onPointClick?: (feature: GeoJSONFeature) => void;
  selectedParameters: string[];
  colorByParameter?: boolean;
  onMapClick?: (lng: number, lat: number) => void;
}

export default function MapComponent({
  data,
  onPointClick,
  colorByParameter = false,
  onMapClick,
}: MapComponentProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<MapLibreGL.Map | null>(null);
  const maplibreRef = useRef<typeof import("maplibre-gl") | null>(null);
  
  // Use refs for callbacks and data to avoid stale closures in MapLibre event listeners
  const onPointClickRef = useRef(onPointClick);
  const onMapClickRef = useRef(onMapClick);
  const dataRef = useRef(data);
  
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  useEffect(() => {
    onPointClickRef.current = onPointClick;
  }, [onPointClick]);

  useEffect(() => {
    onMapClickRef.current = onMapClick;
  }, [onMapClick]);

  useEffect(() => {
    dataRef.current = data;
  }, [data]);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Check WebGL support before initializing map
    const webglCheck = isWebGLSupported();
    if (!webglCheck.supported) {
      setMapError(webglCheck.error || "WebGL no soportado");
      setMapLoaded(true); // Mark as loaded to show error message
      return;
    }

    const initializeMap = async () => {
      const rect = mapContainer.current?.getBoundingClientRect();
      if (!rect || rect.width === 0 || rect.height === 0) {
        setTimeout(initializeMap, 100);
        return;
      }

      if (!mapContainer.current) return;

      try {
        if (!maplibreRef.current) {
          const [{ default: maplibregl }] = await Promise.all([
            import("maplibre-gl"),
            import("maplibre-gl/dist/maplibre-gl.css"),
          ]);
          maplibreRef.current =
            maplibregl as unknown as typeof import("maplibre-gl");
        }

        const maplibregl = maplibreRef.current;
        if (!maplibregl) {
          throw new Error("Maplibre failed to load");
        }

        map.current = new maplibregl.Map({
          container: mapContainer.current,
          style: MAPBOX_CONFIG.style,
          center: [-74.0721, 4.711],
          zoom: 4,
          minZoom: 2,
          maxZoom: 19,
        });

        map.current.on("load", () => {
          setMapLoaded(true);
          map.current?.addControl(
            new maplibregl.NavigationControl(),
            "top-right",
          );
          
          // Handle general map clicks
          map.current?.on("click", (e) => {
            if (onMapClickRef.current) {
              // Only call it if we aren't clicking a feature in the points layer
              const features = map.current?.queryRenderedFeatures(e.point, { layers: ["points"] });
              if (!features || features.length === 0) {
                onMapClickRef.current(e.lngLat.lng, e.lngLat.lat);
              }
            }
          });
        });

        // Handle WebGL context loss
        map.current.on("error", (e) => {
          console.error("Map error:", e);
          if (
            e.error?.message?.includes("WebGL") ||
            e.error?.message?.includes("context")
          ) {
            setMapError(
              "Error de contexto WebGL. El mapa puede no funcionar correctamente.",
            );
          }
        });
      } catch (error) {
        console.error("Error initializing map:", error);
        const errorMessage =
          error instanceof Error ? error.message : String(error);

        if (
          errorMessage.includes("WebGL") ||
          errorMessage.includes("context")
        ) {
          setMapError("webgl-error");
        } else {
          setMapError("Error al inicializar el mapa");
        }
        setMapLoaded(true); // Still mark as loaded to show the UI
      }
    };

    setTimeout(initializeMap, 50);

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    const geojson: GeoJSON.FeatureCollection = {
      type: "FeatureCollection",
      features: data.map((f) => {
        // Extract coordinates - handle both flat array [lon, lat] and nested arrays
        const coords = Array.isArray(f.geometry.coordinates[0])
          ? ((f.geometry.coordinates[0] as number[]).slice(0, 2) as [
              number,
              number,
            ])
          : (f.geometry.coordinates.slice(0, 2) as [number, number]);

        // Calculate color based on source and data
        let color = "#888888"; // Default gray for unknown sources
        const source = f.properties.source as string;
        const layerType = f.properties._layerType as string;
        const eventType = f.properties._eventType as string;

        // Check if there's a pre-calculated color from data processing
        if (f.properties._markerColor) {
          color = f.properties._markerColor as string;
        } else if (f.properties._color) {
          color = f.properties._color as string;
        } else if (source === "openaq" || layerType === "openaq") {
          // OpenAQ data - use AQI color if parameter coloring is enabled
          if (colorByParameter) {
            const parameter = f.properties.parameter as string;
            const value = f.properties.value as number;
            if (parameter && value !== undefined) {
              color = getAQIColor(parameter, value);
            } else {
              color = "#3B82F6"; // Default blue for OpenAQ without value
            }
          } else {
            color = "#3B82F6"; // Blue for OpenAQ
          }
        } else if (source === "wqp" || layerType === "wqp") {
          // WQP data - cyan/teal for water quality
          color = "#06B6D4";
        } else if (source === "gbif" || layerType === "gbif") {
          // GBIF data - green for biodiversity
          color = "#10B981";
        } else if (
          source === "eonet" ||
          layerType === "eonet" ||
          eventType === "eonet"
        ) {
          // EONET data - orange/red for natural events (fallback if no _markerColor)
          color = "#F97316";
        }

        return {
          type: "Feature" as const,
          geometry: { type: "Point" as const, coordinates: coords },
          properties: {
            ...(f.properties || {}),
            // Only set _markerColor if it wasn't already set by data processing
            _markerColor:
              f.properties._markerColor || f.properties._color || color,
          },
        };
      }),
    };

    // Check if source AND layer exist
    const existingSource = map.current.getSource("points");
    const existingLayer = map.current.getLayer("points");

    if (existingSource) {
      // Source exists - update data (even if empty to clear the map)
      (existingSource as MapLibreGL.GeoJSONSource).setData(geojson);
    } else {
      // Create source
      map.current.addSource("points", { type: "geojson", data: geojson });
    }

    if (!existingLayer) {
      // Create layer if it doesn't exist with dynamic coloring
      map.current.addLayer({
        id: "points",
        type: "circle",
        source: "points",
        paint: {
          "circle-radius": [
            "case",
            ["==", ["get", "source"], "openaq"],
            6, // Smaller for OpenAQ
            8, // Default size
          ],
          "circle-color": ["get", "_markerColor"],
          "circle-stroke-color": "#FFFFFF",
          "circle-stroke-width": 2,
          "circle-opacity": 0.9,
        },
      });

      // Setup point click handler
      map.current.on("click", "points", (e) => {
        if (e.features?.[0]) {
          const feature = e.features[0];
          const featureId = feature.properties?.id;
          
          // Find original feature in dataRef to preserve nested properties (arrays, objects)
          // MapLibre stringifies nested properties in returned features
          const originalFeature = featureId 
            ? dataRef.current.find(f => f.properties.id === featureId) 
            : null;

          if (originalFeature) {
            onPointClickRef.current?.(originalFeature);
          } else {
            // Fallback
            const geoJsonFeature: GeoJSONFeature = {
              type: "Feature",
              geometry: feature.geometry as GeoJSONFeature["geometry"],
              properties: (feature.properties || {}) as Record<string, unknown>,
            };
            onPointClickRef.current?.(geoJsonFeature);
          }
        }
      });

      map.current.on("mouseenter", "points", () => {
        if (map.current) map.current.getCanvas().style.cursor = "pointer";
      });

      map.current.on("mouseleave", "points", () => {
        if (map.current) map.current.getCanvas().style.cursor = "";
      });
      
      // General map click handler
      map.current.on("click", (e) => {
        if (!map.current) return;
        // Check if we clicked on a point feature
        const features = map.current.queryRenderedFeatures(e.point, {
          layers: ["points"],
        });
        
        // If we didn't click a point, trigger the general map click
        if (!features || features.length === 0) {
          onMapClickRef.current?.(e.lngLat.lng, e.lngLat.lat);
        }
      });
    }

    if (data.length > 0) {
      const maplibregl = maplibreRef.current;
      if (!maplibregl) return;

      try {
        const bounds = new maplibregl.LngLatBounds();
        let validPoints = 0;
        
        data.forEach((f) => {
          if (f.geometry && Array.isArray(f.geometry.coordinates)) {
            let coords: [number, number];
            if (Array.isArray(f.geometry.coordinates[0])) {
              coords = (f.geometry.coordinates[0] as number[]).slice(0, 2) as [number, number];
            } else {
              coords = f.geometry.coordinates.slice(0, 2) as [number, number];
            }
            
            if (coords && coords.length >= 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
              bounds.extend(coords);
              validPoints++;
            }
          }
        });
        
        if (validPoints > 0) {
          map.current.fitBounds(bounds, { padding: 50, maxZoom: 16 });
        }
      } catch (err) {
        console.error("Error extending bounds:", err);
      }
    }
  }, [data, mapLoaded, colorByParameter]);

  return (
    <div className="w-full h-full relative" style={{ minHeight: "400px" }}>
      <div
        ref={mapContainer}
        className="w-full h-full"
        style={{ minHeight: "400px" }}
      />
      {mapError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-2xl p-6 max-w-md mx-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <svg
                  className="w-8 h-8 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  ⚠️ WebGL No Disponible
                </h3>
                <p className="text-sm text-gray-700 mb-4">
                  El mapa requiere WebGL para funcionar, pero no está disponible
                  en tu navegador.
                </p>

                {mapError === "webgl-error" && (
                  <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-4">
                    <p className="text-sm font-semibold text-blue-900 mb-2">
                      📌 Para Edge:
                    </p>
                    <ol className="text-xs text-blue-800 space-y-1 list-decimal list-inside">
                      <li>Abre edge://settings/system</li>
                      <li>
                        Activa "Usar aceleración de hardware cuando esté
                        disponible"
                      </li>
                      <li>Reinicia el navegador</li>
                    </ol>
                    <p className="text-xs text-blue-700 mt-3">
                      Si el problema persiste, actualiza los drivers de tu
                      tarjeta gráfica.
                    </p>
                  </div>
                )}

                <div className="bg-gray-50 rounded p-3 mb-4">
                  <p className="text-xs font-semibold text-gray-900 mb-2">
                    ✅ Navegadores recomendados:
                  </p>
                  <ul className="text-xs text-gray-700 space-y-1">
                    <li>• Google Chrome (última versión)</li>
                    <li>
                      • Microsoft Edge (última versión con aceleración
                      habilitada)
                    </li>
                    <li>• Firefox (última versión)</li>
                    <li>• Safari 15+</li>
                  </ul>
                </div>

                <button
                  onClick={() => window.location.reload()}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors text-sm"
                >
                  🔄 Reintentar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
