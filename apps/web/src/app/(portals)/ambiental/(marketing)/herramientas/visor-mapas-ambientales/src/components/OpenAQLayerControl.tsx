"use client";

import { useState, useEffect } from "react";
import { getOpenAQMeasurements, openAQToGeoJSON } from "../lib/openaq";
import type { GeoJSONFeature } from "../types";

interface OpenAQLayerControlProps {
  onToggle: (enabled: boolean) => void;
  onDataLoad: (data: GeoJSONFeature[]) => void;
  onLoadingChange: (loading: boolean) => void;
  onError: (error: string | null) => void;
  onParameterChange?: (parameter: string) => void;
}

export default function OpenAQLayerControl({
  onToggle,
  onDataLoad,
  onLoadingChange,
  onError,
  onParameterChange,
}: OpenAQLayerControlProps) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [country, setCountry] = useState("CO"); // Colombia por defecto
  const [parameter, setParameter] = useState("pm25");

  // Notify parent when parameter changes
  useEffect(() => {
    if (onParameterChange) {
      onParameterChange(parameter);
    }
  }, [parameter, onParameterChange]);
  const [radius, setRadius] = useState(10); // km (max 25km for OpenAQ API)
  const [latitude] = useState(4.711); // Bogotá
  const [longitude] = useState(-74.0721); // Bogotá

  // Load OpenAQ data when enabled
  useEffect(() => {
    if (!isEnabled) {
      onDataLoad([]);
      return;
    }

    const loadData = async () => {
      setLoading(true);
      onLoadingChange(true);
      onError(null);

      try {
        // Get recent measurements
        const measurements = await getOpenAQMeasurements({
          country,
          parameter,
          latitude,
          longitude,
          radius,
          limit: 1000,
          dateFrom: new Date(Date.now() - 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0], // Last 24 hours in YYYY-MM-DD format
        });

        if (measurements.length === 0) {
          onError(
            "No se encontraron datos de OpenAQ para los filtros seleccionados",
          );
          onDataLoad([]);
        } else {
          const geojson = openAQToGeoJSON(measurements);
          onDataLoad(geojson);
          onError(null);
        }
      } catch (error) {
        console.error("Error loading OpenAQ data:", error);
        onError("Error al cargar datos de OpenAQ. Intenta nuevamente.");
        onDataLoad([]);
      } finally {
        setLoading(false);
        onLoadingChange(false);
      }
    };

    loadData();
  }, [
    isEnabled,
    country,
    parameter,
    radius,
    latitude,
    longitude,
    onDataLoad,
    onLoadingChange,
    onError,
  ]);

  return (
    <div className="space-y-3">
      {/* Enable toggle */}
      <label className="flex items-center space-x-3 cursor-pointer">
        <div className="relative">
          <input
            type="checkbox"
            checked={isEnabled}
            onChange={(e) => {
              const enabled = e.target.checked;
              setIsEnabled(enabled);
              onToggle(enabled);
            }}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-primary-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
        </div>
        <div>
          <div className="text-sm font-medium text-gray-900 flex items-center space-x-2">
            <span>Datos de OpenAQ</span>
            {loading && (
              <svg
                className="animate-spin h-4 w-4 text-primary-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            )}
          </div>
          <div className="text-xs text-gray-500">
            Calidad del aire en tiempo real
          </div>
        </div>
      </label>

      {/* Filters */}
      {isEnabled && (
        <div className="pl-14 space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              País
            </label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full text-sm border-gray-300 rounded focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="CO">Colombia</option>
              <option value="US">Estados Unidos</option>
              <option value="MX">México</option>
              <option value="BR">Brasil</option>
              <option value="AR">Argentina</option>
              <option value="CL">Chile</option>
              <option value="PE">Perú</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Contaminante
            </label>
            <select
              value={parameter}
              onChange={(e) => setParameter(e.target.value)}
              className="w-full text-sm border-gray-300 rounded focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="pm25">PM2.5 (Material Particulado Fino)</option>
              <option value="pm10">PM10 (Material Particulado)</option>
              <option value="o3">O₃ (Ozono)</option>
              <option value="no2">NO₂ (Dióxido de Nitrógeno)</option>
              <option value="so2">SO₂ (Dióxido de Azufre)</option>
              <option value="co">CO (Monóxido de Carbono)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Radio de búsqueda
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="50"
                max="1000"
                step="50"
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                className="flex-1"
              />
              <span className="text-xs text-gray-600 w-16">{radius} km</span>
            </div>
          </div>

          <div className="pt-2 border-t border-gray-200">
            <div className="flex items-start space-x-2 text-xs text-gray-600">
              <svg
                className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <p className="font-medium">Datos de OpenAQ</p>
                <p className="mt-1">
                  Estaciones de monitoreo global de calidad del aire con
                  actualizaciones cada hora.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
