"use client";

import { useState } from "react";
import {
  POPULAR_CHARACTERISTICS,
  CHARACTERISTIC_TYPES,
  SITE_TYPES,
  US_STATES,
} from "@/lib/wqp";

interface WQPLayerControlProps {
  onToggle: (enabled: boolean) => void;
  onFiltersChange: (filters: WQPFilters) => void;
  stationCount: number;
}

export interface WQPFilters {
  statecode?: string; // US state code (e.g., "US:06" for California)
  characteristicName?: string;
  characteristicType?: string;
  siteType?: string;
  startDateLo?: string;
}

export default function WQPLayerControl({
  onToggle,
  onFiltersChange,
  stationCount,
}: WQPLayerControlProps) {
  const [enabled, setEnabled] = useState(false);
  const [selectedState, setSelectedState] = useState<string>("US:06"); // Default: California
  const [selectedCharacteristic, setSelectedCharacteristic] = useState<
    string | undefined
  >();
  const [selectedType, setSelectedType] = useState<string | undefined>();
  const [selectedSiteType, setSelectedSiteType] = useState<string | undefined>();
  const [selectedYear, setSelectedYear] = useState<number | undefined>();
  const [expanded, setExpanded] = useState(false);

  const handleToggle = () => {
    const newEnabled = !enabled;
    setEnabled(newEnabled);
    onToggle(newEnabled);
  };

  const handleStateChange = (stateCode: string) => {
    setSelectedState(stateCode);
    onFiltersChange({
      statecode: stateCode,
      characteristicName: selectedCharacteristic,
      characteristicType: selectedType,
      siteType: selectedSiteType,
      startDateLo: selectedYear ? `01-01-${selectedYear}` : undefined,
    });
  };

  const handleCharacteristicChange = (characteristic: string | undefined) => {
    setSelectedCharacteristic(characteristic);
    onFiltersChange({
      statecode: selectedState,
      characteristicName: characteristic,
      characteristicType: selectedType,
      siteType: selectedSiteType,
      startDateLo: selectedYear ? `01-01-${selectedYear}` : undefined,
    });
  };

  const handleTypeChange = (type: string | undefined) => {
    setSelectedType(type);
    onFiltersChange({
      statecode: selectedState,
      characteristicName: selectedCharacteristic,
      characteristicType: type,
      siteType: selectedSiteType,
      startDateLo: selectedYear ? `01-01-${selectedYear}` : undefined,
    });
  };

  const handleSiteTypeChange = (siteType: string | undefined) => {
    setSelectedSiteType(siteType);
    onFiltersChange({
      statecode: selectedState,
      characteristicName: selectedCharacteristic,
      characteristicType: selectedType,
      siteType,
      startDateLo: selectedYear ? `01-01-${selectedYear}` : undefined,
    });
  };

  const handleYearChange = (year: number | undefined) => {
    setSelectedYear(year);
    onFiltersChange({
      statecode: selectedState,
      characteristicName: selectedCharacteristic,
      characteristicType: selectedType,
      siteType: selectedSiteType,
      startDateLo: year ? `01-01-${year}` : undefined,
    });
  };

  const clearFilters = () => {
    setSelectedState("US:06"); // Reset to California
    setSelectedCharacteristic(undefined);
    setSelectedType(undefined);
    setSelectedSiteType(undefined);
    setSelectedYear(undefined);
    onFiltersChange({ statecode: "US:06" });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 mb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggle}
            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
              enabled
                ? "bg-blue-600 border-blue-600"
                : "bg-white border-gray-300"
            }`}
            aria-label="Toggle WQP layer"
          >
            {enabled && <span className="text-white text-xs">✓</span>}
          </button>
          <h3 className="font-semibold text-gray-800">
            💧 Calidad del Agua (WQP)
          </h3>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-gray-500 hover:text-gray-700 transition-colors"
          aria-label={expanded ? "Collapse" : "Expand"}
        >
          {expanded ? "▼" : "▶"}
        </button>
      </div>

      {/* Count Badge */}
      <div className="text-xs text-gray-600 mb-2">
        {stationCount > 0 && (
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
            {stationCount.toLocaleString()} estaciones
          </span>
        )}
      </div>

      {/* Filters */}
      {expanded && (
        <div className="space-y-3 mt-3 pt-3 border-t border-gray-200">
          {/* State Selector */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              🗺️ Estado de EE.UU.
            </label>
            <select
              value={selectedState}
              onChange={(e) => handleStateChange(e.target.value)}
              className="w-full text-xs px-2 py-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              {US_STATES.map((state) => (
                <option key={state.code} value={state.code}>
                  {state.name} ({state.abbr})
                </option>
              ))}
            </select>
          </div>

          {/* Popular Characteristics */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Parámetro Popular
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleCharacteristicChange(undefined)}
                className={`text-xs px-2 py-1 rounded border transition-colors ${
                  selectedCharacteristic === undefined
                    ? "bg-blue-100 border-blue-500 text-blue-800"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                Todos
              </button>
              {POPULAR_CHARACTERISTICS.map((char) => (
                <button
                  key={char.value}
                  onClick={() => handleCharacteristicChange(char.value)}
                  className={`text-xs px-2 py-1 rounded border transition-colors ${
                    selectedCharacteristic === char.value
                      ? "bg-blue-100 border-blue-500 text-blue-800"
                      : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                  title={char.description}
                >
                  {char.icon} {char.name}
                </button>
              ))}
            </div>
          </div>

          {/* Characteristic Type */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Categoría de Parámetros
            </label>
            <select
              value={selectedType || ""}
              onChange={(e) => handleTypeChange(e.target.value || undefined)}
              className="w-full text-xs px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todas las categorías</option>
              {CHARACTERISTIC_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Site Type */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Tipo de Sitio
            </label>
            <select
              value={selectedSiteType || ""}
              onChange={(e) =>
                handleSiteTypeChange(e.target.value || undefined)
              }
              className="w-full text-xs px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Todos los sitios</option>
              {SITE_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.icon} {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Year Filter */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Desde Año (opcional)
            </label>
            <input
              type="number"
              min="1900"
              max={new Date().getFullYear()}
              value={selectedYear || ""}
              onChange={(e) =>
                handleYearChange(
                  e.target.value ? parseInt(e.target.value) : undefined
                )
              }
              placeholder="Ej: 2020"
              className="w-full text-xs px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Clear Filters */}
          {(selectedCharacteristic ||
            selectedType ||
            selectedSiteType ||
            selectedYear) && (
            <button
              onClick={clearFilters}
              className="w-full text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
            >
              Limpiar Filtros
            </button>
          )}

          {/* Info */}
          <div className="text-xs text-red-700 bg-red-50 p-2 rounded">
            🛑 <strong>Importante:</strong> WQP es una base de datos exclusiva de <strong>Estados Unidos</strong> (USGS/EPA). No contiene mediciones de Colombia ni otros países.
          </div>

          {/* API Note */}
          <div className="text-xs text-amber-700 bg-amber-50 p-2 rounded">
            ⚠️ La API de WQP puede tardar unos segundos en responder debido al gran volumen de datos.
          </div>
        </div>
      )}
    </div>
  );
}
