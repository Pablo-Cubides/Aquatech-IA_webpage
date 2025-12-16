"use client";

import { useState } from "react";
import type { WaterSample, Country } from "../types";
import { IRCA_PARAMETERS } from "../data/irca-parameters";

interface ManualDataEntryProps {
  selectedCountry: Country;
  onBack: () => void;
  onSubmit: (sample: WaterSample) => void;
}

interface ParameterInput {
  name: string;
  value: string;
  unit: string;
  riskScore: number;
  maxValue?: number;
  minValue?: number;
}

export default function ManualDataEntry({
  selectedCountry,
  onBack,
  onSubmit,
}: ManualDataEntryProps) {
  const [location, setLocation] = useState("");
  const [sampleDate, setSampleDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [parameters, setParameters] = useState<ParameterInput[]>(
    IRCA_PARAMETERS.map((p) => ({
      name: p.name,
      value: "",
      unit: p.unit,
      riskScore: p.riskScore,
      maxValue: p.maxValue,
      minValue: p.minValue,
    }))
  );

  const handleParameterChange = (index: number, newValue: string) => {
    const updated = [...parameters];
    updated[index].value = newValue;
    setParameters(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Filtrar solo parámetros con valores ingresados
    const filledParameters = parameters
      .filter((p) => p.value.trim() !== "")
      .map((p) => ({
        name: p.name,
        value: parseFloat(p.value),
        unit: p.unit,
      }));

    if (filledParameters.length === 0) {
      alert("Por favor ingrese al menos un parámetro");
      return;
    }

    const sample: WaterSample = {
      id: `manual-${Date.now()}`,
      location: location || "Sin ubicación",
      country: selectedCountry,
      sampleDate: sampleDate,
      parameters: filledParameters,
    };

    onSubmit(sample);
  };

  // Contar cuántos parámetros se han llenado
  const filledCount = parameters.filter((p) => p.value.trim() !== "").length;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Entrada Manual de Datos
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ubicación / Nombre de la muestra
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Ej: PTAP Municipal, Acueducto Vereda..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de muestreo
                </label>
                <input
                  type="date"
                  value={sampleDate}
                  onChange={(e) => setSampleDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>País seleccionado:</strong> {selectedCountry}
                {selectedCountry === "Colombia" && (
                  <span className="block mt-1">
                    Se calculará el IRCA según la Resolución 2115 de 2007
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Parámetros */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Parámetros de Calidad de Agua
              </h3>
              <span className="text-sm text-gray-500">
                {filledCount} de {parameters.length} parámetros ingresados
              </span>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              Ingrese solo los parámetros que tiene disponibles. Los campos
              vacíos serán ignorados en el cálculo.
            </p>

            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Parámetro
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Valor
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Unidad
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Límite Norma
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Puntaje IRCA
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {parameters.map((param, index) => {
                    const value = parseFloat(param.value);
                    const hasValue = param.value.trim() !== "";
                    let isOutOfRange = false;

                    if (hasValue && !isNaN(value)) {
                      if (
                        param.minValue !== undefined &&
                        param.maxValue !== undefined
                      ) {
                        isOutOfRange =
                          value < param.minValue || value > param.maxValue;
                      } else if (param.maxValue !== undefined) {
                        isOutOfRange = value > param.maxValue;
                      } else if (param.minValue !== undefined) {
                        isOutOfRange = value < param.minValue;
                      }
                    }

                    return (
                      <tr
                        key={param.name}
                        className={
                          hasValue
                            ? isOutOfRange
                              ? "bg-red-50"
                              : "bg-green-50"
                            : ""
                        }
                      >
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {param.name}
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            step="any"
                            value={param.value}
                            onChange={(e) =>
                              handleParameterChange(index, e.target.value)
                            }
                            placeholder="—"
                            className={`w-24 px-2 py-1 border rounded-md text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                              hasValue && isOutOfRange
                                ? "border-red-400 bg-red-50"
                                : "border-gray-300"
                            }`}
                          />
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {param.unit}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {param.minValue !== undefined &&
                          param.maxValue !== undefined
                            ? `${param.minValue} - ${param.maxValue}`
                            : param.maxValue !== undefined
                              ? `≤ ${param.maxValue}`
                              : param.minValue !== undefined
                                ? `≥ ${param.minValue}`
                                : "—"}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {param.riskScore}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={onBack}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md"
            >
              ← Volver
            </button>
            <button
              type="submit"
              disabled={filledCount === 0}
              className="px-6 py-3 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
            >
              Calcular Índices →
            </button>
          </div>
        </form>

        {/* Información del cálculo IRCA */}
        {selectedCountry === "Colombia" && (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-semibold text-yellow-900 mb-2">
              ℹ️ Sobre el cálculo del IRCA
            </h4>
            <div className="text-sm text-yellow-800 space-y-1">
              <p>
                <strong>Fórmula:</strong> IRCA (%) = (Σ puntajes NO conformes / Σ
                puntajes analizados) × 100
              </p>
              <p>
                El IRCA se calcula solo con los parámetros que usted ingrese.
                Entre más parámetros ingrese, más preciso será el resultado.
              </p>
              <p className="mt-2">
                <strong>Categorías:</strong>
              </p>
              <ul className="list-disc list-inside ml-2 space-y-0.5">
                <li>
                  <span className="text-green-700">0-5%:</span> Sin riesgo
                </li>
                <li>
                  <span className="text-lime-700">5.1-14%:</span> Riesgo bajo
                </li>
                <li>
                  <span className="text-yellow-700">14.1-35%:</span> Riesgo
                  medio
                </li>
                <li>
                  <span className="text-orange-700">35.1-80%:</span> Riesgo alto
                </li>
                <li>
                  <span className="text-red-700">80.1-100%:</span> Inviable
                  sanitariamente
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
