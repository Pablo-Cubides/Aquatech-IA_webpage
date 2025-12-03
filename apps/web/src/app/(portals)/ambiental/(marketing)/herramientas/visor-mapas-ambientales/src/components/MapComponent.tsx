"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { GeoJSONFeature } from "../types";
import { MAPBOX_CONFIG } from "../config/mapbox";

export interface MapComponentProps {
  data: GeoJSONFeature[];
  onPointClick?: (feature: GeoJSONFeature) => void;
  selectedParameters: string[];
}

export default function MapComponent({
  data,
  onPointClick,
}: MapComponentProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    const initializeMap = () => {
      const rect = mapContainer.current?.getBoundingClientRect();
      if (!rect || rect.width === 0 || rect.height === 0) {
        setTimeout(initializeMap, 100);
        return;
      }

      if (!mapContainer.current) return;
      
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
      });
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
          ? (f.geometry.coordinates[0] as number[]).slice(0, 2) as [number, number]
          : f.geometry.coordinates.slice(0, 2) as [number, number];
        return {
          type: "Feature" as const,
          geometry: { type: "Point" as const, coordinates: coords },
          properties: f.properties || {},
        };
      }),
    };

    // Check if source AND layer exist
    const existingSource = map.current.getSource("points");
    const existingLayer = map.current.getLayer("points");

    if (existingSource) {
      // Source exists - update data (even if empty to clear the map)
      (existingSource as maplibregl.GeoJSONSource).setData(geojson);
    } else {
      // Create source
      map.current.addSource("points", { type: "geojson", data: geojson });
    }

    if (!existingLayer) {
      // Create layer if it doesn't exist
      map.current.addLayer({
        id: "points",
        type: "circle",
        source: "points",
        paint: {
          "circle-radius": 8,
          "circle-color": "#FF0000",
          "circle-stroke-color": "#FFFFFF",
          "circle-stroke-width": 2,
        },
      });

      map.current.on("click", "points", (e) => {
        if (onPointClick && e.features?.[0]) {
          const feature = e.features[0];
          // Convert maplibre feature to our GeoJSONFeature type
          const geoJsonFeature: GeoJSONFeature = {
            type: "Feature",
            geometry: feature.geometry as GeoJSONFeature["geometry"],
            properties: (feature.properties || {}) as Record<string, unknown>,
          };
          onPointClick(geoJsonFeature);
        }
      });

      map.current.on("mouseenter", "points", () => {
        if (map.current) map.current.getCanvas().style.cursor = "pointer";
      });

      map.current.on("mouseleave", "points", () => {
        if (map.current) map.current.getCanvas().style.cursor = "";
      });
    }

    if (data.length > 0) {
      const bounds = new maplibregl.LngLatBounds();
      data.forEach((f) =>
        bounds.extend(f.geometry.coordinates as [number, number]),
      );
      map.current.fitBounds(bounds, { padding: 50, maxZoom: 16 });
    }
  }, [data, mapLoaded, onPointClick]);

  return (
    <div
      ref={mapContainer}
      className="w-full h-full"
      style={{ minHeight: "400px" }}
    />
  );
}
