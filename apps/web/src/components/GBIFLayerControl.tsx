"use client";

import { useState } from "react";
import {
  POPULAR_TAXON_GROUPS,
  BASIS_OF_RECORD_OPTIONS,
} from "@/lib/gbif";

interface GBIFLayerControlProps {
  onToggle: (enabled: boolean) => void;
  onFiltersChange: (filters: GBIFFilters) => void;
  occurrenceCount: number;
}

export interface GBIFFilters {
  taxonKey?: number;
  basisOfRecord?: string;
  year?: number;
}

export default function GBIFLayerControl({
  onToggle,
  onFiltersChange,
  occurrenceCount,
}: GBIFLayerControlProps) {
  const [enabled, setEnabled] = useState(false);
  const [selectedTaxon, setSelectedTaxon] = useState<number | undefined>();
  const [selectedBasis, setSelectedBasis] = useState<string | undefined>();
  const [selectedYear, setSelectedYear] = useState<number | undefined>();
  const [expanded, setExpanded] = useState(false);

  const handleToggle = () => {
    const newEnabled = !enabled;
    setEnabled(newEnabled);
    onToggle(newEnabled);
  };

  const handleTaxonChange = (taxonKey: number | undefined) => {
    setSelectedTaxon(taxonKey);
    onFiltersChange({
      taxonKey,
      basisOfRecord: selectedBasis,
      year: selectedYear,
    });
  };

  const handleBasisChange = (basis: string | undefined) => {
    setSelectedBasis(basis);
    onFiltersChange({
      taxonKey: selectedTaxon,
      basisOfRecord: basis,
      year: selectedYear,
    });
  };

  const handleYearChange = (year: number | undefined) => {
    setSelectedYear(year);
    onFiltersChange({
      taxonKey: selectedTaxon,
      basisOfRecord: selectedBasis,
      year,
    });
  };

  const clearFilters = () => {
    setSelectedTaxon(undefined);
    setSelectedBasis(undefined);
    setSelectedYear(undefined);
    onFiltersChange({});
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
                ? "bg-green-600 border-green-600"
                : "bg-white border-gray-300"
            }`}
            aria-label="Toggle GBIF layer"
          >
            {enabled && <span className="text-white text-xs">✓</span>}
          </button>
          <h3 className="font-semibold text-gray-800">
            🌿 Biodiversidad (GBIF)
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
        {occurrenceCount > 0 && (
          <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
            {occurrenceCount.toLocaleString()} registros
          </span>
        )}
      </div>

      {/* Filters */}
      {expanded && (
        <div className="space-y-3 mt-3 pt-3 border-t border-gray-200">
          {/* Taxon Groups */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Grupo Taxonómico
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleTaxonChange(undefined)}
                className={`text-xs px-2 py-1 rounded border transition-colors ${
                  selectedTaxon === undefined
                    ? "bg-green-100 border-green-500 text-green-800"
                    : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                Todos
              </button>
              {POPULAR_TAXON_GROUPS.map((group) => (
                <button
                  key={group.taxonKey}
                  onClick={() => handleTaxonChange(group.taxonKey)}
                  className={`text-xs px-2 py-1 rounded border transition-colors ${
                    selectedTaxon === group.taxonKey
                      ? "bg-green-100 border-green-500 text-green-800"
                      : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                  title={group.description}
                >
                  {group.icon} {group.name}
                </button>
              ))}
            </div>
          </div>

          {/* Basis of Record */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Tipo de Registro
            </label>
            <select
              value={selectedBasis || ""}
              onChange={(e) =>
                handleBasisChange(e.target.value || undefined)
              }
              className="w-full text-xs px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Todos los tipos</option>
              {BASIS_OF_RECORD_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Year Filter */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Año (opcional)
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
              placeholder="Ej: 2023"
              className="w-full text-xs px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>

          {/* Clear Filters */}
          {(selectedTaxon || selectedBasis || selectedYear) && (
            <button
              onClick={clearFilters}
              className="w-full text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
            >
              Limpiar Filtros
            </button>
          )}

          {/* Info */}
          <div className="text-xs text-gray-600 bg-green-50 p-2 rounded">
            💡 <strong>GBIF</strong> contiene 3.6 mil millones de registros de
            biodiversidad global
          </div>
        </div>
      )}
    </div>
  );
}
