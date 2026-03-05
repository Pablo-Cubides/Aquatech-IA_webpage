"use client";

import { useState, useEffect, useCallback } from "react";
import { getEONETEvents, eonetToGeoJSON, type EONETParams } from "../lib/eonet";
import type { GeoJSONFeature } from "../types";

interface EONETLayerControlProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  onDataLoad: (data: GeoJSONFeature[]) => void;
  onLoadingChange: (loading: boolean) => void;
  onError: (error: string) => void;
}

export default function EONETLayerControl({
  enabled,
  onToggle,
  onDataLoad,
  onLoadingChange,
  onError,
}: EONETLayerControlProps) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"open" | "closed" | "all">("open");
  const [days, setDays] = useState<number>(30);
  const [category, setCategory] = useState<string>("");
  const [showInfo, setShowInfo] = useState(false);

  const categories = [
    { id: "", name: "Todas las categorías" },
    { id: "wildfires", name: "Incendios Forestales" },
    { id: "volcanoes", name: "Volcanes" },
    { id: "severe-storms", name: "Tormentas Severas" },
    { id: "floods", name: "Inundaciones" },
    { id: "drought", name: "Sequías" },
    { id: "earthquakes", name: "Terremotos" },
    { id: "landslides", name: "Deslizamientos" },
    { id: "temperature-extremes", name: "Temperaturas Extremas" },
    { id: "snow-and-ice", name: "Nieve y Hielo" },
  ];

  const fetchEONETData = useCallback(async () => {
    setLoading(true);
    onLoadingChange(true);

    try {
      const params: EONETParams = {
        status,
        days,
        limit: 100,
      };

      if (category) {
        params.category = category;
      }

      const events = await getEONETEvents(params);
      const geoJSON = eonetToGeoJSON(events);

      onDataLoad(geoJSON);
      onError("");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error desconocido";
      onError(`Error al cargar eventos de NASA EONET: ${message}`);
      onDataLoad([]);
    } finally {
      setLoading(false);
      onLoadingChange(false);
    }
  }, [status, days, category, onLoadingChange, onDataLoad, onError]);

  useEffect(() => {
    if (enabled) {
      fetchEONETData();
    } else {
      onDataLoad([]);
    }
  }, [enabled, status, days, category, fetchEONETData, onDataLoad]);

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">🛰️</span>
          <h3 className="font-semibold text-gray-900">NASA EONET</h3>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Información"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={enabled}
              onChange={(e) => onToggle(e.target.checked)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
          </label>
        </div>
      </div>

      {showInfo && (
        <div className="mb-3 p-3 bg-white rounded-lg text-xs text-gray-600 border border-purple-200">
          <p className="font-medium text-purple-700 mb-1">
            🌍 Eventos Naturales en Tiempo Real
          </p>
          <p>
            Datos de la NASA Earth Observatory Natural Event Tracker (EONET).
            Incluye incendios, volcanes, tormentas, terremotos y más eventos
            naturales monitoreados por satélites.
          </p>
        </div>
      )}

      {enabled && (
        <div className="space-y-3">
          {/* Status Filter */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Estado del Evento
            </label>
            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as "open" | "closed" | "all")
              }
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="open">🟢 Activos</option>
              <option value="closed">⚫ Cerrados</option>
              <option value="all">🔵 Todos</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Categoría
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Days Range */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Últimos {days} días
            </label>
            <input
              type="range"
              min="1"
              max="365"
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1 día</span>
              <span className="font-medium text-purple-600">{days} días</span>
              <span>1 año</span>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600"></div>
              <span className="ml-2 text-xs text-gray-600">
                Cargando eventos...
              </span>
            </div>
          )}

          {/* Refresh Button */}
          <button
            onClick={fetchEONETData}
            disabled={loading}
            className="w-full py-2 px-4 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span>Actualizar Eventos</span>
          </button>
        </div>
      )}
    </div>
  );
}
