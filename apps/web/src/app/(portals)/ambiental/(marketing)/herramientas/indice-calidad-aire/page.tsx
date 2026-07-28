"use client";

import React, { useState, useCallback } from "react";
import {
  Wind,
  Upload,
  Calculator,
  Globe,
  FileText,
  RefreshCw,
  ChevronDown,
  Info,
  AlertTriangle,
  Download,
} from "lucide-react";
import type {
  AirQualityMeasurement,
  PollutantMeasurement,
  PollutantId,
  IndexProfileId,
  AQIResult,
  DataSource,
} from "./types";
import { POLLUTANTS } from "./types";
import {
  csvToMeasurements,
  generateExampleCSV,
  downloadCSV,
} from "./utils/csv-parser";
import { exportAirQualityPDF } from "./utils/pdf-export";

// Index profile options
const INDEX_PROFILES = [
  {
    id: "us-aqi",
    name: "US AQI (EPA)",
    flag: "🇺🇸",
    description: "Índice oficial de Estados Unidos",
  },
  {
    id: "ica-colombia",
    name: "ICA Colombia",
    flag: "🇨🇴",
    description: "Resolución 2254 de 2017",
  },
  {
    id: "iboca-bogota",
    name: "IBOCA Bogotá",
    flag: "🏙️",
    description: "Resolución 2840 de 2023",
  },
  {
    id: "eaqi-europe",
    name: "EAQI Europa",
    flag: "🇪🇺",
    description: "Índice de la EEA",
  },
  {
    id: "who-index",
    name: "Índice OMS",
    flag: "🌍",
    description: "Guías OMS 2021 (% sobre guía)",
  },
] as const;

// Pollutant order for display
const POLLUTANT_ORDER: PollutantId[] = [
  "pm25",
  "pm10",
  "o3",
  "no2",
  "so2",
  "co",
];

export default function IndiceCalidadAirePage() {
  // State
  const [dataSource, setDataSource] = useState<DataSource>("manual");
  const [selectedProfile, setSelectedProfile] =
    useState<IndexProfileId>("us-aqi");
  const [manualValues, setManualValues] = useState<Record<PollutantId, string>>(
    {
      pm25: "",
      pm10: "",
      o3: "",
      no2: "",
      so2: "",
      co: "",
    },
  );
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<AirQualityMeasurement[]>([]);
  const [results, setResults] = useState<AQIResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState<AQIResult | null>(
    null,
  );

  // Handle manual value change
  const handleManualChange = (pollutantId: PollutantId, value: string) => {
    setManualValues((prev) => ({ ...prev, [pollutantId]: value }));
  };

  // Handle CSV file upload
  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setCsvFile(file);
      setError(null);

      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        const result = csvToMeasurements(text);

        if (result.errors.length > 0) {
          setError(result.errors.join(". "));
          return;
        }

        if (result.measurements.length === 0) {
          setError("No se encontraron datos válidos en el archivo");
          return;
        }

        setCsvData(result.measurements);
      };
      reader.readAsText(file);
    },
    [],
  );

  // Calculate AQI
  const calculateAQI = async () => {
    setLoading(true);
    setError(null);

    try {
      let measurements: AirQualityMeasurement[] = [];

      if (dataSource === "manual") {
        // Build measurement from manual input
        const pollutants: PollutantMeasurement[] = [];

        for (const id of POLLUTANT_ORDER) {
          const value = parseFloat(manualValues[id]);
          if (!isNaN(value) && value >= 0) {
            pollutants.push({
              pollutantId: id,
              value,
              unit: id === "co" ? "mg/m³" : "µg/m³",
            });
          }
        }

        if (pollutants.length === 0) {
          setError("Ingrese al menos un valor de contaminante");
          setLoading(false);
          return;
        }

        measurements = [
          {
            datetime: new Date().toISOString(),
            pollutants,
            source: "manual",
          },
        ];
      } else if (dataSource === "csv") {
        if (csvData.length === 0) {
          setError("No hay datos CSV cargados");
          setLoading(false);
          return;
        }
        measurements = csvData;
      }

      // Call API
      const response = await fetch("/api/aqi-calculator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          measurements,
          profileId: selectedProfile,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al calcular");
      }

      setResults(data.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const handleReset = () => {
    setManualValues({ pm25: "", pm10: "", o3: "", no2: "", so2: "", co: "" });
    setCsvFile(null);
    setCsvData([]);
    setResults([]);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50">
      {/* Header */}
      <header className="relative py-12 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-sky-600/10 via-blue-600/10 to-cyan-600/10" />
        <div className="relative max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Wind className="w-10 h-10 text-sky-600" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-sky-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Calculadora de Calidad del Aire
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Calcula índices AQI, ICA Colombia, IBOCA, EAQI y OMS a partir de
            concentraciones de contaminantes
          </p>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 pb-12">
        {/* Data Source Selector */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-sky-600" />
            Fuente de Datos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                id: "manual" as DataSource,
                icon: Calculator,
                label: "Entrada Manual",
                desc: "Ingresa valores directamente",
              },
              {
                id: "csv" as DataSource,
                icon: Upload,
                label: "Archivo CSV",
                desc: "Carga un archivo con datos",
              },
              {
                id: "openaq" as DataSource,
                icon: Globe,
                label: "OpenAQ (Próximamente)",
                desc: "Datos en tiempo real",
                disabled: true,
              },
            ].map((source) => (
              <button
                key={source.id}
                onClick={() => !source.disabled && setDataSource(source.id)}
                disabled={source.disabled}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  dataSource === source.id
                    ? "border-sky-500 bg-sky-50"
                    : source.disabled
                      ? "border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed"
                      : "border-gray-200 bg-white hover:border-sky-300"
                }`}
              >
                <source.icon
                  className={`w-6 h-6 mb-2 ${dataSource === source.id ? "text-sky-600" : "text-gray-400"}`}
                />
                <div className="font-medium text-gray-800">{source.label}</div>
                <div className="text-sm text-gray-500">{source.desc}</div>
              </button>
            ))}
          </div>
        </section>

        {/* Index Profile Selector */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5 text-sky-600" />
            Índice a Calcular
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {INDEX_PROFILES.map((profile) => (
              <button
                key={profile.id}
                onClick={() => setSelectedProfile(profile.id)}
                className={`p-3 rounded-xl border-2 transition-all text-left ${
                  selectedProfile === profile.id
                    ? "border-sky-500 bg-sky-50"
                    : "border-gray-200 bg-white hover:border-sky-300"
                }`}
              >
                <div className="text-2xl mb-1">{profile.flag}</div>
                <div className="font-medium text-gray-800 text-sm">
                  {profile.name}
                </div>
                <div className="text-xs text-gray-500">
                  {profile.description}
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Data Input */}
        <section className="mb-8">
          {dataSource === "manual" && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-4">
                Concentraciones de Contaminantes
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {POLLUTANT_ORDER.map((id) => (
                  <div key={id}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {POLLUTANTS[id].name}
                      <span className="text-gray-400 ml-1">
                        ({POLLUTANTS[id].unit})
                      </span>
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={manualValues[id]}
                      onChange={(e) => handleManualChange(id, e.target.value)}
                      placeholder="0.0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {dataSource === "csv" && (
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-4">
                Cargar Archivo CSV
              </h3>
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-8 hover:border-sky-400 transition-colors">
                <Upload className="w-12 h-12 text-gray-400 mb-4" />
                <input
                  type="file"
                  accept=".csv,.txt"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="csv-upload"
                />
                <label
                  htmlFor="csv-upload"
                  className="cursor-pointer px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
                >
                  Seleccionar Archivo
                </label>
                {csvFile && (
                  <p className="mt-3 text-sm text-gray-600">
                    {csvFile.name} ({csvData.length} mediciones)
                  </p>
                )}
                <button
                  onClick={() =>
                    downloadCSV(
                      generateExampleCSV(),
                      "ejemplo-calidad-aire.csv",
                    )
                  }
                  className="mt-4 text-sm text-sky-600 hover:text-sky-700 flex items-center gap-1"
                >
                  <Download className="w-4 h-4" />
                  Descargar archivo de ejemplo
                </button>
              </div>
            </div>
          )}
        </section>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div className="text-red-700">{error}</div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={calculateAQI}
            disabled={loading}
            className="flex-1 py-3 px-6 bg-gradient-to-r from-sky-600 to-blue-600 text-white rounded-xl font-medium hover:from-sky-700 hover:to-blue-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <Calculator className="w-5 h-5" />
            )}
            {loading ? "Calculando..." : "Calcular Índice"}
          </button>
          <button
            onClick={handleReset}
            className="py-3 px-6 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
          >
            Limpiar
          </button>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-sky-600" />
              Resultados
            </h2>

            <div className="flex justify-end mb-4">
              <button
                onClick={() => exportAirQualityPDF(results)}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm"
              >
                <FileText className="w-4 h-4" />
                Exportar Reporte PDF
              </button>
            </div>

            {results.map((result, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
              >
                {/* Main Result */}
                <div
                  className="p-6"
                  style={{ borderLeft: `4px solid ${result.category.color}` }}
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="text-sm text-gray-500 mb-1">
                        {result.profileName}
                      </div>
                      <div className="flex items-baseline gap-3">
                        <span
                          className="text-5xl font-bold"
                          style={{ color: result.category.color }}
                        >
                          {result.index >= 0 ? result.index : "N/D"}
                        </span>
                        <span
                          className="px-3 py-1 rounded-full text-sm font-medium"
                          style={{
                            backgroundColor: result.category.bgColor,
                            color: result.category.color,
                          }}
                        >
                          {result.category.name}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">
                        Contaminante crítico
                      </div>
                      <div className="text-lg font-semibold text-gray-800">
                        {result.criticalPollutantName}
                      </div>
                    </div>
                  </div>

                  <p className="mt-4 text-gray-600">
                    {result.category.healthMessage}
                  </p>
                  <p className="mt-2 text-sm text-gray-500">
                    {result.category.actions}
                  </p>
                </div>

                {/* Sub-indices */}
                <div className="px-6 pb-6">
                  <button
                    onClick={() =>
                      setShowExplanation(
                        showExplanation === result ? null : result,
                      )
                    }
                    className="flex items-center gap-2 text-sm text-sky-600 hover:text-sky-700 mb-4"
                  >
                    <Info className="w-4 h-4" />
                    {showExplanation === result ? "Ocultar" : "Ver"} detalles
                    del cálculo
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${showExplanation === result ? "rotate-180" : ""}`}
                    />
                  </button>

                  {showExplanation === result && (
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h4 className="font-medium text-gray-700 mb-3">
                        Subíndices por contaminante
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                        {result.subIndices.map((sub) => (
                          <div
                            key={sub.pollutantId}
                            className="bg-white rounded-lg p-3 border"
                            style={{ borderColor: sub.category.color }}
                          >
                            <div className="text-sm font-medium text-gray-700">
                              {sub.pollutantName}
                            </div>
                            <div className="text-xs text-gray-500">
                              {sub.concentration} {sub.unit}
                            </div>
                            <div
                              className="text-lg font-bold mt-1"
                              style={{ color: sub.category.color }}
                            >
                              {sub.subIndex}
                            </div>
                          </div>
                        ))}
                      </div>

                      {result.missingPollutants.length > 0 && (
                        <div className="mt-3 text-sm text-yellow-700 bg-yellow-50 p-2 rounded">
                          ⚠️ Sin datos para:{" "}
                          {result.missingPollutants
                            .map((p) => POLLUTANTS[p].name)
                            .join(", ")}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Info Section */}
        <section className="mt-12 bg-gradient-to-br from-sky-50 to-blue-50 rounded-2xl p-6 border border-sky-200">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Info className="w-5 h-5 text-sky-600" />
            Sobre los índices de calidad del aire
          </h3>
          <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-600">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">
                ¿Cómo se calcula?
              </h4>
              <p>
                Cada contaminante tiene una tabla de "breakpoints" que relaciona
                concentraciones con valores de índice. Se calcula un subíndice
                para cada contaminante mediante interpolación lineal, y el
                índice final es el máximo de todos los subíndices.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">
                Contaminantes incluidos
              </h4>
              <ul className="space-y-1">
                <li>
                  • <strong>PM₂.₅ / PM₁₀</strong>: Material particulado
                </li>
                <li>
                  • <strong>O₃</strong>: Ozono troposférico
                </li>
                <li>
                  • <strong>NO₂</strong>: Dióxido de nitrógeno
                </li>
                <li>
                  • <strong>SO₂</strong>: Dióxido de azufre
                </li>
                <li>
                  • <strong>CO</strong>: Monóxido de carbono
                </li>
              </ul>
            </div>
          </div>
        </section>
      </div>

      {/* Explanation Modal */}
      {showExplanation && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowExplanation(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal content would go here */}
          </div>
        </div>
      )}
    </div>
  );
}
