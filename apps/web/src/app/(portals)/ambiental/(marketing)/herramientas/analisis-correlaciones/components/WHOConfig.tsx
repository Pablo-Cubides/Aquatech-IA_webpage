"use client";

import { useState, useEffect } from "react";
import {
  getWHOCountries,
  getPopularWHOIndicators,
  WHOCountry,
} from "@/utils/who";

interface WHOConfigProps {
  onConfigChange: (config: {
    country: string;
    compareCountry?: string;
    startYear: number;
    endYear: number;
    indicators: string[];
  }) => void;
  isComparison?: boolean;
}

export default function WHOConfig({ onConfigChange, isComparison = false }: WHOConfigProps) {
  const [countries, setCountries] = useState<WHOCountry[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>("COL");
  const [selectedCompareCountry, setSelectedCompareCountry] = useState<string>("");
  const [startYear, setStartYear] = useState<number>(2010);
  const [endYear, setEndYear] = useState<number>(2023);
  const [selectedIndicators, setSelectedIndicators] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const popularIndicators = getPopularWHOIndicators();

  useEffect(() => {
    loadCountries();
  }, []);

  async function loadCountries() {
    setLoadError(null);
    try {
      const data = await getWHOCountries();
      setCountries(data);
      if (data.length === 0) {
        setLoadError("No se pudieron cargar los países. Verifica tu conexión.");
      }
    } catch (error) {
      console.error("Error loading WHO countries:", error);
      setLoadError("Error de conexión. Haz clic para reintentar.");
    } finally {
      setLoading(false);
    }
  }

  function toggleIndicator(code: string) {
    const maxIndicators = isComparison ? 3 : 5;
    setSelectedIndicators((prev) =>
      prev.includes(code)
        ? prev.filter((c) => c !== code)
        : prev.length < maxIndicators
        ? [...prev, code]
        : prev
    );
  }

  const canAnalyze = selectedIndicators.length > 0 && 
    (!isComparison || (isComparison && selectedCompareCountry && selectedCompareCountry !== selectedCountry));

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00796B]"></div>
          <span className="ml-3 text-gray-600">Cargando configuración WHO...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center mb-4">
        <span className="text-2xl mr-2">⚕️</span>
        <h2 className="text-xl font-bold text-gray-900">
          Configuración WHO GHO
        </h2>
      </div>

      {/* Error Message with Retry */}
      {loadError && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
          <p className="text-red-700 text-sm">{loadError}</p>
          <button
            onClick={loadCountries}
            className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Country Selectors */}
      <div className={`grid ${isComparison ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'} gap-4 mb-6`}>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {isComparison ? "País A *" : "País"}
          </label>
          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00796B] focus:border-transparent"
          >
            {countries.map((country) => (
              <option key={country.Code} value={country.Code}>
                {country.Title}
              </option>
            ))}
          </select>
        </div>

        {isComparison && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              País B *
            </label>
            <select
              value={selectedCompareCountry}
              onChange={(e) => setSelectedCompareCountry(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00796B] focus:border-transparent"
            >
              <option value="">-- Selecciona un país --</option>
              {countries
                .filter((c) => c.Code !== selectedCountry)
                .map((country) => (
                  <option key={country.Code} value={country.Code}>
                    {country.Title}
                  </option>
                ))}
            </select>
          </div>
        )}
      </div>

      {/* Year Range */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Año Inicial
          </label>
          <input
            type="number"
            min={1990}
            max={endYear}
            value={startYear}
            onChange={(e) => setStartYear(parseInt(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00796B] focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Año Final
          </label>
          <input
            type="number"
            min={startYear}
            max={2023}
            value={endYear}
            onChange={(e) => setEndYear(parseInt(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00796B] focus:border-transparent"
          />
        </div>
      </div>

      {/* Indicator Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Indicadores de Salud (máximo {isComparison ? 3 : 5})
        </label>
        <div className="text-xs text-gray-500 mb-3">
          {selectedIndicators.length}/{isComparison ? 3 : 5} seleccionados
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {popularIndicators.map((indicator) => (
            <div
              key={indicator.code}
              onClick={() => toggleIndicator(indicator.code)}
              className={`
                p-3 rounded-lg border-2 cursor-pointer transition-all
                ${
                  selectedIndicators.includes(indicator.code)
                    ? "border-[#00796B] bg-[#E0F2F1]"
                    : "border-gray-200 hover:border-gray-300"
                }
              `}
            >
              <div className="flex items-start">
                <input
                  type="checkbox"
                  checked={selectedIndicators.includes(indicator.code)}
                  onChange={() => toggleIndicator(indicator.code)}
                  className="mt-1 h-4 w-4 text-[#00796B] rounded focus:ring-[#00796B]"
                />
                <div className="ml-3 flex-1">
                  <div className="font-medium text-gray-900">
                    {indicator.name}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {indicator.category} • {indicator.code}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedIndicators.length === 0 && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <span className="font-semibold">⚠️ Atención:</span> Selecciona al
            menos un indicador para continuar con el análisis.
          </p>
        </div>
      )}

      {isComparison && !selectedCompareCountry && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <span className="font-semibold">⚠️ Atención:</span> Selecciona el País B para la comparación.
          </p>
        </div>
      )}

      {/* Analyze Button */}
      {canAnalyze && (
        <button
          onClick={() => onConfigChange({
            country: selectedCountry,
            compareCountry: isComparison ? selectedCompareCountry : undefined,
            startYear,
            endYear,
            indicators: selectedIndicators,
          })}
          className="w-full mt-4 px-6 py-3 bg-[#00796B] text-white font-semibold rounded-lg hover:bg-[#00695C] transition-colors shadow-md hover:shadow-lg"
        >
          📊 {isComparison ? "Comparar Países" : "Analizar Datos"}
        </button>
      )}

      {/* Credits */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Datos proporcionados por:{" "}
          <a
            href="https://www.who.int/data/gho"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#00796B] hover:underline"
          >
            WHO Global Health Observatory
          </a>
        </p>
      </div>
    </div>
  );
}
