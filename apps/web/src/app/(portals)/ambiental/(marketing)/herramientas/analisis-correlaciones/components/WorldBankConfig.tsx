"use client";

import { useState, useEffect } from "react";
import {
  getCountries,
  getPopularIndicators,
  searchIndicators,
  type WBCountry,
  type WBIndicator,
} from "../src/utils/worldbank";

interface WorldBankConfigProps {
  onConfigChange: (config: WorldBankConfig) => void;
  isComparison?: boolean;
}

export interface WorldBankConfig {
  country: WBCountry;
  compareCountry?: WBCountry;
  indicators: WBIndicator[];
  startYear: number;
  endYear: number;
}

export default function WorldBankConfig({
  onConfigChange,
  isComparison = false,
}: WorldBankConfigProps) {
  const [countries, setCountries] = useState<WBCountry[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<WBCountry | null>(
    null
  );
  const [selectedCompareCountry, setSelectedCompareCountry] = useState<WBCountry | null>(
    null
  );
  const [indicators, setIndicators] = useState<WBIndicator[]>([]);
  const [selectedIndicators, setSelectedIndicators] = useState<WBIndicator[]>(
    []
  );
  const [startYear, setStartYear] = useState<number>(2000);
  const [endYear, setEndYear] = useState<number>(2023);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Load countries on mount
  const loadCountriesData = async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const countriesList = await getCountries();
      if (countriesList.length === 0) {
        setLoadError("No se pudieron cargar los países. Verifica tu conexión a internet.");
      }
      setCountries(countriesList);
    } catch (err) {
      setLoadError("Error de conexión. Haz clic para reintentar.");
      console.error("Error loading countries:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadCountriesData();
  }, []);

  // Load popular indicators
  useEffect(() => {
    const popular = getPopularIndicators();
    setIndicators(popular);
  }, []);

  // Handle search
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setIndicators(getPopularIndicators());
      return;
    }

    setLoading(true);
    const { indicators: results } = await searchIndicators(searchQuery);
    setIndicators(results);
    setLoading(false);
  };

  // Toggle indicator selection
  const toggleIndicator = (indicator: WBIndicator) => {
    if (selectedIndicators.find((ind) => ind.id === indicator.id)) {
      setSelectedIndicators(
        selectedIndicators.filter((ind) => ind.id !== indicator.id)
      );
    } else {
      if (selectedIndicators.length < 5) {
        // Limit to 3 for comparison mode, 5 otherwise
        const maxIndicators = isComparison ? 3 : 5;
        if (selectedIndicators.length < maxIndicators) {
            setSelectedIndicators([...selectedIndicators, indicator]);
        } else {
            alert(`En modo comparación puedes seleccionar máximo ${maxIndicators} indicadores`);
        }
      } else {
        alert("Puedes seleccionar máximo 5 indicadores");
      }
    }
  };

  // Handle fetch data
  const handleFetchData = () => {
    if (!selectedCountry) {
      alert("Por favor selecciona un país");
      return;
    }
    if (isComparison && !selectedCompareCountry) {
        alert("Por favor selecciona el segundo país para comparar");
        return;
    }
    if (selectedIndicators.length === 0) {
      alert("Por favor selecciona al menos un indicador");
      return;
    }
    if (startYear >= endYear) {
      alert("El año inicial debe ser menor que el año final");
      return;
    }

    onConfigChange({
      country: selectedCountry,
      compareCountry: selectedCompareCountry || undefined,
      indicators: selectedIndicators,
      startYear,
      endYear,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="text-3xl">🌍</div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Configuración de Datos del Banco Mundial
          </h2>
          <p className="text-sm text-gray-600">
            Datos proporcionados por{" "}
            <a
              href="https://data.worldbank.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#00796B] hover:underline font-medium"
            >
              World Bank Open Data
            </a>
          </p>
        </div>
      </div>

      {/* Error Message with Retry */}
      {loadError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
          <p className="text-red-700 text-sm">{loadError}</p>
          <button
            onClick={loadCountriesData}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? "Cargando..." : "Reintentar"}
          </button>
        </div>
      )}

      {/* Country Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
            1. Selecciona {isComparison ? "País A" : "un país"} *
            </label>
            <select
            value={selectedCountry?.id || ""}
            onChange={(e) => {
                const country = countries.find((c) => c.id === e.target.value);
                setSelectedCountry(country || null);
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00796B] focus:border-transparent"
            >
            <option value="">-- Selecciona un país --</option>
            {countries.map((country) => (
                <option key={country.id} value={country.id}>
                {country.name}
                </option>
            ))}
            </select>
        </div>

        {isComparison && (
            <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">
                 Selecciona País B *
                 </label>
                 <select
                 value={selectedCompareCountry?.id || ""}
                 onChange={(e) => {
                     const country = countries.find((c) => c.id === e.target.value);
                     setSelectedCompareCountry(country || null);
                 }}
                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00796B] focus:border-transparent"
                 >
                 <option value="">-- Selecciona un país --</option>
                 {countries.map((country) => (
                     <option key={country.id} value={country.id}>
                     {country.name}
                     </option>
                 ))}
                 </select>
             </div>
        )}
      </div>

      {/* Year Range Selection */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            2. Año inicial *
          </label>
          <input
            type="number"
            min="1960"
            max={endYear}
            value={startYear}
            onChange={(e) => setStartYear(parseInt(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00796B] focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Año final *
          </label>
          <input
            type="number"
            min={startYear}
            max="2023"
            value={endYear}
            onChange={(e) => setEndYear(parseInt(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00796B] focus:border-transparent"
          />
        </div>
      </div>

      {/* Indicators Selection */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            3. Selecciona indicadores (máximo 5) *
          </label>
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="text-xs text-[#00796B] hover:text-[#004D40] font-medium"
          >
            {showSearch ? "Ver populares" : "Buscar otros"}
          </button>
        </div>

        {/* Search Bar */}
        {showSearch && (
          <div className="flex space-x-2 mb-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Buscar indicadores..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00796B] focus:border-transparent text-sm"
            />
            <button
              onClick={handleSearch}
              className="px-4 py-2 bg-[#00796B] text-white rounded-lg hover:bg-[#004D40] transition-colors text-sm"
            >
              Buscar
            </button>
          </div>
        )}

        {/* Selected Indicators */}
        {selectedIndicators.length > 0 && (
          <div className="mb-3 p-3 bg-[#E0F2F1] rounded-lg">
            <p className="text-xs font-medium text-gray-700 mb-2">
              Seleccionados ({selectedIndicators.length}/5):
            </p>
            <div className="space-y-1">
              {selectedIndicators.map((ind) => (
                <div
                  key={ind.id}
                  className="flex items-center justify-between text-xs"
                >
                  <span className="text-gray-800">{ind.name}</span>
                  <button
                    onClick={() => toggleIndicator(ind)}
                    className="text-red-600 hover:text-red-800 ml-2"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Available Indicators */}
        <div className="border border-gray-200 rounded-lg max-h-96 overflow-y-auto">
          {indicators.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              {loading ? "Cargando indicadores..." : "No se encontraron indicadores"}
            </div>
          ) : (
            indicators.map((indicator) => {
              const isSelected = selectedIndicators.some(
                (ind) => ind.id === indicator.id
              );
              return (
                <button
                  key={indicator.id}
                  onClick={() => toggleIndicator(indicator)}
                  disabled={
                    !isSelected && selectedIndicators.length >= 5
                  }
                  className={`
                    w-full p-3 text-left border-b border-gray-100 hover:bg-gray-50 transition-colors
                    ${isSelected ? "bg-[#E0F2F1]" : ""}
                    ${!isSelected && selectedIndicators.length >= 5 ? "opacity-50 cursor-not-allowed" : ""}
                  `}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {isSelected && "✓ "}
                        {indicator.name}
                      </p>
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                        {indicator.sourceNote}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Fuente: {indicator.sourceOrganization}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Fetch Button */}
      <button
        onClick={handleFetchData}
        disabled={!selectedCountry || selectedIndicators.length === 0 || loading}
        className="w-full py-3 bg-[#00796B] text-white font-semibold rounded-lg hover:bg-[#004D40] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? "Cargando..." : "Obtener Datos y Analizar"}
      </button>

      {/* Info */}
      <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-xs text-yellow-800">
          <span className="font-semibold">ℹ️ Nota:</span> Los datos del Banco
          Mundial pueden tener valores faltantes para ciertos años y países.
          La herramienta solo analizará los años con datos completos.
        </p>
      </div>
    </div>
  );
}
