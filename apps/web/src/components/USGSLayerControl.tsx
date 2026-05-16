"use client";

import { useState } from "react";
import { EARTHQUAKE_PERIODS, EARTHQUAKE_MAGNITUDES } from "@/lib/usgs";

interface USGSLayerControlProps {
  onToggle: (enabled: boolean) => void;
  onFiltersChange: (filters: { period: string; minMagnitude: string }) => void;
  earthquakeCount: number;
}

export default function USGSLayerControl({
  onToggle,
  onFiltersChange,
  earthquakeCount,
}: USGSLayerControlProps) {
  const [enabled, setEnabled] = useState(false);
  const [period, setPeriod] = useState("week");
  const [minMagnitude, setMinMagnitude] = useState("2.5");
  const [expanded, setExpanded] = useState(false);

  const handleToggle = () => {
    const newEnabled = !enabled;
    setEnabled(newEnabled);
    onToggle(newEnabled);
  };

  const handlePeriodChange = (newPeriod: string) => {
    setPeriod(newPeriod);
    onFiltersChange({ period: newPeriod, minMagnitude });
  };

  const handleMagnitudeChange = (newMag: string) => {
    setMinMagnitude(newMag);
    onFiltersChange({ period, minMagnitude: newMag });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 mb-4 border-l-4 border-red-400">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggle}
            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
              enabled
                ? "bg-red-600 border-red-600"
                : "bg-white border-gray-300"
            }`}
            aria-label="Toggle USGS layer"
          >
            {enabled && <span className="text-white text-xs">✓</span>}
          </button>
          <h3 className="font-semibold text-gray-800">
            🌍 Sismos (USGS)
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
        {earthquakeCount > 0 && (
          <span className="bg-red-100 text-red-800 px-2 py-1 rounded">
            {earthquakeCount.toLocaleString()} sismos
          </span>
        )}
      </div>

      {/* Filters */}
      {expanded && (
        <div className="space-y-3 mt-3 pt-3 border-t border-gray-200">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Período
            </label>
            <div className="grid grid-cols-2 gap-2">
              {EARTHQUAKE_PERIODS.map((p) => (
                <button
                  key={p.value}
                  onClick={() => handlePeriodChange(p.value)}
                  className={`text-xs px-2 py-1 rounded border transition-colors ${
                    period === p.value
                      ? "bg-red-100 border-red-500 text-red-800"
                      : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Magnitud Mínima
            </label>
            <div className="grid grid-cols-2 gap-2">
              {EARTHQUAKE_MAGNITUDES.map((m) => (
                <button
                  key={m.value}
                  onClick={() => handleMagnitudeChange(m.value)}
                  className={`text-xs px-2 py-1 rounded border transition-colors ${
                    minMagnitude === m.value
                      ? "bg-red-100 border-red-500 text-red-800"
                      : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div className="text-xs text-gray-600 bg-red-50 p-2 rounded">
            💡 Los colores de los marcadores indican la profundidad del sismo. Rojo = superficial, Azul = profundo.
          </div>
        </div>
      )}
    </div>
  );
}
