"use client";

import { useState } from "react";
import { FIRMS_SOURCES } from "@/lib/firms";

interface FIRMSLayerControlProps {
  onToggle: (enabled: boolean) => void;
  onFiltersChange: (filters: { source: string; dayRange: number }) => void;
  fireCount: number;
}

export default function FIRMSLayerControl({
  onToggle,
  onFiltersChange,
  fireCount,
}: FIRMSLayerControlProps) {
  const [enabled, setEnabled] = useState(false);
  const [source, setSource] = useState("VIIRS_SNPP_NRT");
  const [dayRange, setDayRange] = useState(2);
  const [expanded, setExpanded] = useState(false);

  const handleToggle = () => {
    const newEnabled = !enabled;
    setEnabled(newEnabled);
    onToggle(newEnabled);
  };

  const handleSourceChange = (newSource: string) => {
    setSource(newSource);
    onFiltersChange({ source: newSource, dayRange });
  };

  const handleDayRangeChange = (newDayRange: number) => {
    setDayRange(newDayRange);
    onFiltersChange({ source, dayRange: newDayRange });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 mb-4 border-l-4 border-orange-400">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggle}
            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
              enabled
                ? "bg-orange-600 border-orange-600"
                : "bg-white border-gray-300"
            }`}
            aria-label="Toggle FIRMS layer"
          >
            {enabled && <span className="text-white text-xs">✓</span>}
          </button>
          <h3 className="font-semibold text-gray-800">
            🔥 Incendios (FIRMS)
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
        {fireCount > 0 && (
          <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded">
            {fireCount.toLocaleString()} focos de calor
          </span>
        )}
      </div>

      {/* Filters */}
      {expanded && (
        <div className="space-y-3 mt-3 pt-3 border-t border-gray-200">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Fuente de Datos
            </label>
            <select
              value={source}
              onChange={(e) => handleSourceChange(e.target.value)}
              className="w-full text-xs px-2 py-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
            >
              {FIRMS_SOURCES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label} ({s.description})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Últimos días
            </label>
            <div className="grid grid-cols-5 gap-1">
              {[1, 2, 3, 5, 7].map((d) => (
                <button
                  key={d}
                  onClick={() => handleDayRangeChange(d)}
                  className={`text-xs px-2 py-1 rounded border transition-colors ${
                    dayRange === d
                      ? "bg-orange-100 border-orange-500 text-orange-800"
                      : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {d}d
                </button>
              ))}
            </div>
          </div>

          <div className="text-xs text-gray-600 bg-orange-50 p-2 rounded">
            💡 <strong>FIRMS</strong> detecta anomalías térmicas usando satélites MODIS y VIIRS de la NASA.
            Los colores indican el nivel de confianza de detección.
          </div>
        </div>
      )}
    </div>
  );
}
