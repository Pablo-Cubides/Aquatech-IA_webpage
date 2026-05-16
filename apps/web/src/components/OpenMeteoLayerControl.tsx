"use client";

import { useState } from "react";

interface OpenMeteoLayerControlProps {
  onToggle: (enabled: boolean) => void;
}

export default function OpenMeteoLayerControl({
  onToggle,
}: OpenMeteoLayerControlProps) {
  const [enabled, setEnabled] = useState(false);

  const handleToggle = () => {
    const newEnabled = !enabled;
    setEnabled(newEnabled);
    onToggle(newEnabled);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 mb-4 border-l-4 border-blue-400">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggle}
            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
              enabled
                ? "bg-blue-500 border-blue-500"
                : "bg-white border-gray-300"
            }`}
            aria-label="Toggle OpenMeteo layer"
          >
            {enabled && <span className="text-white text-xs">✓</span>}
          </button>
          <h3 className="font-semibold text-gray-800">
            🌦️ Clima (Open-Meteo)
          </h3>
        </div>
      </div>

      {enabled && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-blue-700 bg-blue-50 p-2 rounded">
            💡 <strong>Instrucción:</strong> Haga clic en cualquier punto del mapa para ver las condiciones meteorológicas actuales en esa ubicación.
          </p>
        </div>
      )}
    </div>
  );
}
