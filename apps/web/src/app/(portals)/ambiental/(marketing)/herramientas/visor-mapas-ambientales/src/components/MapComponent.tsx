"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { GeoJSONFeature } from "@/types";

interface MapComponentProps {
  data: GeoJSONFeature[];
  onPointClick?: (feature: GeoJSONFeature) => void;
  selectedParameters: string[];
}

export default function MapComponent({
  data,
  onPointClick,
  selectedParameters,
}: MapComponentProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Initialize map with optimized basemap and error handling
  useEffect(() => {
    if (!mapContainer.current) {
      console.log("Map container not available");
      return;
    }

    // Ensure container has dimensions before initializing
    const initializeMap = () => {
      const rect = mapContainer.current?.getBoundingClientRect();
      if (!rect || rect.width === 0 || rect.height === 0) {
        console.log("Container not ready, retrying...");
        setTimeout(initializeMap, 100);
        return;
      }

      console.log("Initializing map with dimensions:", rect.width, rect.height);

      try {
        // Use OpenStreetMap tiles directly - completely free, no API key required
        // Configure to avoid CORS issues by using HTTPS and proper headers
        map.current = new maplibregl.Map({
          container: mapContainer.current!,
          style: {
            version: 8,
            sources: {
              osm: {
                type: "raster",
                tiles: [
                  "https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                ],
                tileSize: 256,
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                maxzoom: 19
              },
            },
            layers: [
              {
                id: "osm-tiles",
                type: "raster",
                source: "osm",
                minzoom: 0,
                maxzoom: 22
              },
            ],
          },
          center: [-74.0721, 4.711], // Bogotá, Colombia
          zoom: 4, // Start with zoom 4 to see all data
          minZoom: 2,
          maxZoom: 19,
          pitch: 0,
          bearing: 0,
        });

        console.log("Map initialized successfully");
      } catch (err) {
        console.error("Error inicializando mapa:", err);
      }
    };

    // Small delay to ensure DOM is ready
    setTimeout(initializeMap, 50);

    // Add navigation controls with better positioning
    const navControl = new maplibregl.NavigationControl();
    if (map.current) {
      map.current.addControl(navControl, "top-right");
    }

    // Add fullscreen control (if available)
    if ("FullscreenControl" in maplibregl && map.current) {
      map.current.addControl(
        new (maplibregl as any).FullscreenControl(),
        "top-right",
      );
    }

    // Add event listeners for debugging
    if (map.current) {
      map.current.on('load', () => {
        console.log('Map loaded successfully');
        setMapLoaded(true);
      });

      map.current.on('error', (e) => {
        console.error('Map error:', e);
      });

      map.current.on('sourcedata', (e) => {
        if (e.sourceId === 'osm' && e.isSourceLoaded) {
          console.log('OSM tiles loaded successfully via proxy');
        }
      });

      map.current.on('sourcedataabort', (e) => {
        console.error('Tile loading aborted:', e);
      });
    }

    // Mark map as loaded (fallback)
    const handleLoad = () => {
      setMapLoaded(true);
    };

    if (map.current) {
      map.current.on("load", handleLoad);
    }

    return () => {
      if (map.current) {
        map.current.off("load", handleLoad);
        map.current.remove();
      }
    };
  }, []);

  // Update data layers with optimizations
  useEffect(() => {
    if (!map.current || !mapLoaded) {
      console.log('Map not ready for data layers:', { map: !!map.current, mapLoaded });
      return;
    }

    console.log('Adding data layers for', data.length, 'points');

    const geojsonData = {
      type: "FeatureCollection" as const,
      features: data,
    };

    console.log('GeoJSON data:', geojsonData);

    // Update layers function
    const updateLayers = () => {
      if (!map.current) return;

      // Remove existing layers safely
      const layerIds = ["points-layer", "points-cluster"];
      layerIds.forEach((id) => {
        try {
          if (map.current?.getLayer(id)) {
            map.current.removeLayer(id);
          }
        } catch {
          // Layer doesn't exist
        }
      });

      // Remove existing source
      try {
        if (map.current?.getSource("points")) {
          map.current.removeSource("points");
        }
      } catch {
        // Source doesn't exist
      }

      // Add optimized data source (cluster if >100 points for performance)
      map.current.addSource("points", {
        type: "geojson",
        data: geojsonData,
        cluster: data.length > 100,
        clusterMaxZoom: 14,
        clusterRadius: 50,
        buffer: 128,
      } as any);

      console.log('Added points source with clustering:', data.length > 100);

      // Add cluster layer if there are many points
      if (data.length > 100) {
        map.current.addLayer({
          id: "points-cluster",
          type: "circle",
          source: "points",
          filter: ["has", "point_count"],
          paint: {
            "circle-color": [
              "step",
              ["get", "point_count"],
              "#0077B6", // Primary (navy-light) for small clusters
              10,
              "#10B981", // Success/secondary for medium clusters
              50,
              "#FF3333", // Warning/Error color for large clusters
              100,
              "#FF3333", // Red for 100+
            ],
            "circle-radius": [
              "step",
              ["get", "point_count"],
              15,
              10,
              20,
              50,
              25,
              100,
              30,
            ],
            "circle-stroke-width": 2,
            "circle-stroke-color": "#000000",
            "circle-opacity": 0.9,
          },
        } as any);

        // Cluster click handler - zoom in
        const handleClusterClick = (e: any) => {
          if (!e.features?.[0] || !map.current) return;
          const geometry = e.features[0].geometry;
          const coords = (geometry as any).coordinates;
          map.current.easeTo({
            center: coords,
            zoom: Math.min(map.current.getZoom() + 2, 19),
          });
        };
        map.current.on("click", "points-cluster", handleClusterClick);
      }

      // Add individual points layer - simplified for debugging
      const pointsLayerId = "points-layer";
      if (map.current.getLayer(pointsLayerId)) {
        map.current.removeLayer(pointsLayerId);
      }

      const pointsLayer = {
        id: pointsLayerId,
        type: "circle" as const,
        source: "points",
        paint: {
          "circle-color": "#FF0000", // Bright red for visibility
          "circle-radius": 8,
          "circle-stroke-width": 3,
          "circle-stroke-color": "#FFFFFF",
          "circle-opacity": 1.0,
        },
      };

      console.log('Adding simplified points layer:', pointsLayer);
      map.current.addLayer(pointsLayer as any);

      // Add click handler
      map.current.on("click", pointsLayerId, (e: any) => {
        console.log('Point clicked:', e.features);
        if (onPointClick && e.features?.[0]) {
          onPointClick(e.features[0] as any as GeoJSONFeature);
        }
      });

      // Add hover effects
      map.current.on("mouseenter", pointsLayerId, () => {
        if (map.current) map.current.getCanvas().style.cursor = "pointer";
      });
      map.current.on("mouseleave", pointsLayerId, () => {
        if (map.current) map.current.getCanvas().style.cursor = "";
      });

      console.log('Points layer added successfully - checking if visible');

      // Force a map refresh
      setTimeout(() => {
        if (map.current) {
          map.current.triggerRepaint();
          console.log('Map repainted');
        }
      }, 100);

      // Fit bounds to data
      if (data.length > 0) {
        const bounds = new maplibregl.LngLatBounds();
        data.forEach((feature) => {
          const coords = (feature.geometry as any).coordinates as [
            number,
            number,
          ];
          bounds.extend(coords);
        });
        map.current.fitBounds(bounds, { padding: 50, maxZoom: 16 });
      }
    };

    // Update when style is loaded
    if (map.current.isStyleLoaded()) {
      updateLayers();
    } else {
      map.current.once("load", updateLayers);
    }
  }, [data, onPointClick, mapLoaded, selectedParameters]);

  return (
    <div
      ref={mapContainer}
      className="w-full h-full"
      style={{ minHeight: "400px" }}
    />
  );
}
