"use client";

import { useState } from "react";
import type { WaterSample, DataSource, Country, IndexResult } from "./types";
import DataSourceSelector from "./components/DataSourceSelector";
import { calculateIRCA, explainIRCACalculation } from "./utils/calculate-irca";
import { calculateWQI, explainWQICalculation } from "./utils/calculate-wqi";
import { calculateDWQI, explainDWQICalculation } from "./utils/calculate-dwqi";
import { getIRCARiskCategory } from "./data/irca-parameters";
import { getWQICategory } from "./data/wqi-parameters";
import { getDWQICategory } from "./data/dwqi-parameters";
import {
  parseCSV,
  csvToWaterSamples,
  generateExampleCSV,
  downloadCSV,
  waterSamplesToCSV,
} from "./utils/csv-utils";

type Step =
  | "select-source"
  | "input-data"
  | "view-results"
  | "compare";

export default function IndiceCalidadAguaPage() {
  const [currentStep, setCurrentStep] = useState<Step>("select-source");
  const [dataSource, setDataSource] = useState<DataSource | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<Country>("Colombia");
  const [samples, setSamples] = useState<WaterSample[]>([]);
  const [currentSampleIndex, setCurrentSampleIndex] = useState(0);

  // Manejador de selección de fuente
  const handleSourceSelected = (source: DataSource, country: Country) => {
    setDataSource(source);
    setSelectedCountry(country);
    setCurrentStep("input-data");
  };

  // Manejador de archivo CSV
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const rows = parseCSV(text);
      const waterSamples = csvToWaterSamples(rows);

      // Calcular índices para cada muestra
      const samplesWithIndices = waterSamples.map((sample) => ({
        ...sample,
        country: selectedCountry,
        indices: {
          IRCA: calculateIRCA(sample) || undefined,
          WQI: calculateWQI(sample) || undefined,
          DWQI: calculateDWQI(sample) || undefined,
        },
      }));

      setSamples(samplesWithIndices);
      setCurrentStep("view-results");
    };
    reader.readAsText(file);
  };

  // Renderizado condicional según el paso actual
  if (currentStep === "select-source") {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Calculadora de Índices de Calidad de Agua Potable
            </h1>
            <p className="text-lg text-gray-600">
              Calcule IRCA, WQI y DWQI a partir de datos de laboratorio
            </p>
          </div>

          <DataSourceSelector onSourceSelected={handleSourceSelected} />
        </div>
      </div>
    );
  }

  if (currentStep === "input-data") {
    if (dataSource === "csv") {
      return (
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-4xl mx-auto px-4">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Cargar Archivo CSV
              </h2>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seleccione su archivo CSV
                </label>
                <input
                  type="file"
                  accept=".csv,.txt"
                  onChange={handleFileUpload}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-blue-900 mb-2">
                  Formato esperado del CSV:
                </h3>
                <code className="text-sm text-blue-800 block">
                  fecha,ubicacion,pais,parametro,valor,unidad
                </code>
                <button
                  onClick={() =>
                    downloadCSV(
                      generateExampleCSV(),
                      "ejemplo-calidad-agua.csv"
                    )
                  }
                  className="mt-3 text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  ⬇️ Descargar archivo de ejemplo
                </button>
              </div>

              <button
                onClick={() => setCurrentStep("select-source")}
                className="text-gray-600 hover:text-gray-800"
              >
                ← Volver
              </button>
            </div>
          </div>
        </div>
      );
    }

    // TODO: Implementar formulario manual
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Entrada Manual de Datos
            </h2>
            <p className="text-gray-600 mb-6">
              Esta funcionalidad está en desarrollo. Por favor use la carga CSV.
            </p>
            <button
              onClick={() => setCurrentStep("select-source")}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              ← Volver
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (currentStep === "view-results") {
    const currentSample = samples[currentSampleIndex];

    if (!currentSample) {
      return (
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <p className="text-gray-600">No hay muestras para mostrar</p>
            <button
              onClick={() => setCurrentStep("select-source")}
              className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
            >
              ← Volver al inicio
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Resultados de Análisis
              </h1>
              <p className="text-gray-600">
                Muestra {currentSampleIndex + 1} de {samples.length}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentStep("select-source")}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md"
              >
                ← Nueva Consulta
              </button>
              <button
                onClick={() => {
                  const csv = waterSamplesToCSV(samples);
                  downloadCSV(csv, "resultados-calidad-agua.csv");
                }}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                📥 Exportar CSV
              </button>
            </div>
          </div>

          {/* Info de la muestra */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Información de la Muestra
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <span className="text-sm text-gray-500">Ubicación:</span>
                <p className="font-medium">{currentSample.location}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Fecha:</span>
                <p className="font-medium">
                  {currentSample.date?.toLocaleDateString() ?? currentSample.sampleDate ?? "N/A"}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-500">País:</span>
                <p className="font-medium">{currentSample.country}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Parámetros:</span>
                <p className="font-medium">
                  {currentSample.parameters.length}
                </p>
              </div>
            </div>
          </div>

          {/* Navegación entre muestras */}
          {samples.length > 1 && (
            <div className="flex justify-center gap-2 mb-6">
              <button
                onClick={() =>
                  setCurrentSampleIndex(Math.max(0, currentSampleIndex - 1))
                }
                disabled={currentSampleIndex === 0}
                className="px-4 py-2 bg-white border rounded-md disabled:opacity-50"
              >
                ← Anterior
              </button>
              <span className="px-4 py-2">
                {currentSampleIndex + 1} / {samples.length}
              </span>
              <button
                onClick={() =>
                  setCurrentSampleIndex(
                    Math.min(samples.length - 1, currentSampleIndex + 1)
                  )
                }
                disabled={currentSampleIndex === samples.length - 1}
                className="px-4 py-2 bg-white border rounded-md disabled:opacity-50"
              >
                Siguiente →
              </button>
            </div>
          )}

          {/* Tarjetas de Índices */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* IRCA */}
            {currentSample.indices?.IRCA && (
              <IndexCard
                title="IRCA"
                subtitle="Índice de Riesgo - Colombia"
                result={currentSample.indices.IRCA}
                color={
                  getIRCARiskCategory(currentSample.indices.IRCA.value).color
                }
                onExplain={() => {
                  if (currentSample.indices?.IRCA) {
                    const explanation = explainIRCACalculation(
                      currentSample,
                      currentSample.indices.IRCA
                    );
                    alert(explanation); // En producción usar un modal
                  }
                }}
              />
            )}

            {/* WQI */}
            {currentSample.indices?.WQI && (
              <IndexCard
                title="WQI"
                subtitle="NSF Water Quality Index"
                result={currentSample.indices.WQI}
                color={getWQICategory(currentSample.indices.WQI.value).color}
                onExplain={() => {
                  if (currentSample.indices?.WQI) {
                    const explanation = explainWQICalculation(
                      currentSample,
                      currentSample.indices.WQI
                    );
                    alert(explanation);
                  }
                }}
              />
            )}

            {/* DWQI */}
            {currentSample.indices?.DWQI && (
              <IndexCard
                title="DWQI"
                subtitle="Drinking Water Quality Index"
                result={currentSample.indices.DWQI}
                color={getDWQICategory(currentSample.indices.DWQI.value).color}
                onExplain={() => {
                  if (currentSample.indices?.DWQI) {
                    const explanation = explainDWQICalculation(
                      currentSample,
                      currentSample.indices.DWQI
                    );
                    alert(explanation);
                  }
                }}
              />
            )}
          </div>

          {/* Detalles de parámetros */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Parámetros Medidos
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Parámetro
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Valor Medido
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Unidad
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentSample.parameters.map((param, idx) => (
                    <tr key={idx}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {param.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {param.value}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {param.unit}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

// Componente auxiliar para mostrar cada índice
interface IndexCardProps {
  title: string;
  subtitle: string;
  result: IndexResult;
  color: string;
  onExplain: () => void;
}

function IndexCard({
  title,
  subtitle,
  result,
  color,
  onExplain,
}: IndexCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border-t-4" style={{ borderTopColor: color }}>
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
        <button
          onClick={onExplain}
          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
          title="Ver cálculo detallado"
        >
          ℹ️
        </button>
      </div>

      <div className="mb-4">
        <div className="text-4xl font-bold" style={{ color }}>
          {result.value.toFixed(2)}
        </div>
        <div
          className="inline-block px-3 py-1 rounded-full text-sm font-medium mt-2"
          style={{ backgroundColor: `${color}20`, color }}
        >
          {result.category}
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-4">{result.riskLevel}</p>

      {result.missingParameters && result.missingParameters.length > 0 && (
        <div className="text-xs text-yellow-700 bg-yellow-50 p-2 rounded">
          ⚠️ Faltan {result.missingParameters.length} parámetros
        </div>
      )}
    </div>
  );
}
