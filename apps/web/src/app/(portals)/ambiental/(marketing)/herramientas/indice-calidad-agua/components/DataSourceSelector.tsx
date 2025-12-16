"use client";

import { useState } from "react";
import type { DataSource, Country } from "../types";

interface DataSourceSelectorProps {
  onSourceSelected: (source: DataSource, country: Country) => void;
}

export default function DataSourceSelector({
  onSourceSelected,
}: DataSourceSelectorProps) {
  const [selectedCountry, setSelectedCountry] = useState<Country>("Colombia");
  const [selectedSource, setSelectedSource] = useState<DataSource | null>(null);

  const handleContinue = () => {
    if (selectedSource) {
      onSourceSelected(selectedSource, selectedCountry);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Seleccionar Fuente de Datos
        </h2>

        {/* Selección de País */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            País / Región
          </label>
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value as Country)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="Colombia">Colombia</option>
            <option value="Internacional">Internacional (OMS/WHO)</option>
            <option value="Otro">Otro</option>
          </select>
          <p className="mt-2 text-sm text-gray-500">
            {selectedCountry === "Colombia"
              ? "Se calculará IRCA (Resolución 2115/2007), WQI y DWQI"
              : "Se calculará WQI y DWQI con estándares internacionales"}
          </p>
        </div>

        {/* Selección de Fuente de Datos */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-4">
            Fuente de Datos
          </label>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Opción: Carga Manual */}
            <button
              onClick={() => setSelectedSource("manual")}
              className={`p-6 border-2 rounded-lg transition-all ${
                selectedSource === "manual"
                  ? "border-primary-500 bg-primary-50"
                  : "border-gray-300 hover:border-primary-300"
              }`}
            >
              <div className="text-4xl mb-3">📝</div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Carga Manual
              </h3>
              <p className="text-sm text-gray-600">
                Ingrese los valores de laboratorio uno por uno
              </p>
            </button>

            {/* Opción: Archivo CSV */}
            <button
              onClick={() => setSelectedSource("csv")}
              className={`p-6 border-2 rounded-lg transition-all ${
                selectedSource === "csv"
                  ? "border-primary-500 bg-primary-50"
                  : "border-gray-300 hover:border-primary-300"
              }`}
            >
              <div className="text-4xl mb-3">📊</div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Archivo CSV/Excel
              </h3>
              <p className="text-sm text-gray-600">
                Cargue múltiples muestras desde un archivo
              </p>
            </button>

            {/* Opción: API Externa */}
            <button
              onClick={() => setSelectedSource("api")}
              className={`p-6 border-2 rounded-lg transition-all ${
                selectedSource === "api"
                  ? "border-primary-500 bg-primary-50"
                  : "border-gray-300 hover:border-primary-300"
              }`}
            >
              <div className="text-4xl mb-3">🌐</div>
              <h3 className="font-semibold text-gray-900 mb-2">API Externa</h3>
              <p className="text-sm text-gray-600">
                Conectar con fuentes de datos públicas
              </p>
              <span className="inline-block mt-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                Próximamente
              </span>
            </button>
          </div>
        </div>

        {/* Botón Continuar */}
        <div className="flex justify-end">
          <button
            onClick={handleContinue}
            disabled={!selectedSource || selectedSource === "api"}
            className="px-6 py-3 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
          >
            Continuar →
          </button>
        </div>
      </div>

      {/* Información adicional */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">
          ℹ️ Índices calculados
        </h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>
            <strong>IRCA:</strong> Índice de Riesgo de la Calidad del Agua
            (solo Colombia)
          </li>
          <li>
            <strong>WQI:</strong> NSF Water Quality Index (9 parámetros)
          </li>
          <li>
            <strong>DWQI:</strong> Drinking Water Quality Index (método
            ponderado)
          </li>
        </ul>
      </div>
    </div>
  );
}
