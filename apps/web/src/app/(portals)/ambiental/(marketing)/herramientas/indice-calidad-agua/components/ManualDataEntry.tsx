"use client";

import { useState, useMemo } from "react";
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

  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleParameterChange = (index: number, newValue: string) => {
    const updated = [...parameters];
    updated[index].value = newValue;
    setParameters(updated);
  };

  // Validación científica y de plausibilidad en tiempo real
  const validationResults = useMemo(() => {
    const criticalErrors: { param?: string; message: string }[] = [];
    const warnings: { param?: string; message: string }[] = [];
    const fieldStatus: Record<string, { type: "error" | "warning"; message: string }> = {};

    let coliformesValue: number | null = null;
    let coliformesParamName = "";
    let ecoliValue: number | null = null;
    let ecoliParamName = "";

    parameters.forEach((p) => {
      if (p.value.trim() === "") return;

      const numVal = parseFloat(p.value);
      const lowerName = p.name.toLowerCase();

      // Validación de número válido
      if (isNaN(numVal)) {
        const msg = `El valor para ${p.name} debe ser un número válido.`;
        criticalErrors.push({ param: p.name, message: msg });
        fieldStatus[p.name] = { type: "error", message: msg };
        return;
      }

      // Restricción: valores negativos prohibidos en parámetros de calidad del agua
      if (numVal < 0) {
        const msg = `El valor de ${p.name} no puede ser negativo (${numVal} ${p.unit}).`;
        criticalErrors.push({ param: p.name, message: msg });
        fieldStatus[p.name] = { type: "error", message: msg };
        return;
      }

      // Restricción estricta de pH: Escala física 0 a 14
      if (lowerName === "ph") {
        if (numVal < 0 || numVal > 14) {
          const msg = `El pH debe estar estrictamente en el rango de 0 a 14 (valor ingresado: ${numVal}). Valores fuera de esta escala no existen en soluciones acuosas estándar.`;
          criticalErrors.push({ param: p.name, message: msg });
          fieldStatus[p.name] = { type: "error", message: msg };
          return;
        } else if (numVal < 3 || numVal > 11) {
          const msg = `pH extremadamente ácido/básico (${numVal}). Representa un riesgo corrosivo severo para agua de consumo.`;
          warnings.push({ param: p.name, message: msg });
          fieldStatus[p.name] = { type: "warning", message: msg };
        }
      }

      // Detección de parámetros microbiológicos
      if (lowerName.includes("coliformes totales")) {
        coliformesValue = numVal;
        coliformesParamName = p.name;
      }
      if (lowerName.includes("escherichia coli") || lowerName.includes("e. coli")) {
        ecoliValue = numVal;
        ecoliParamName = p.name;
      }

      // Advertencias de límites extremos físicos para agua tratada/potable
      if (lowerName.includes("turbiedad") || lowerName.includes("turbidez")) {
        if (numVal > 2000) {
          const msg = `Turbiedad inusualmente alta (${numVal} UNT). Verifica si hubo error en la unidad o si es agua cruda con alta sedimentación.`;
          warnings.push({ param: p.name, message: msg });
          if (!fieldStatus[p.name]) fieldStatus[p.name] = { type: "warning", message: msg };
        }
      }

      if (lowerName.includes("cloro residual libre")) {
        if (numVal > 10) {
          const msg = `Cloro residual libre excesivo (${numVal} mg/L). Supera 5 veces el límite seguro para consumo (riesgo químico agudo).`;
          warnings.push({ param: p.name, message: msg });
          if (!fieldStatus[p.name]) fieldStatus[p.name] = { type: "warning", message: msg };
        }
      }

      if (lowerName.includes("conductividad")) {
        if (numVal > 50000) {
          const msg = `Conductividad extrema (${numVal} µS/cm), similar a salmuera o agua de mar. No corresponde a agua dulce.`;
          warnings.push({ param: p.name, message: msg });
          if (!fieldStatus[p.name]) fieldStatus[p.name] = { type: "warning", message: msg };
        }
      }
    });

    // Control microbiológico cruzado: E. coli es subespecie de Coliformes Totales
    if (coliformesValue !== null && ecoliValue !== null && ecoliValue > coliformesValue) {
      const msg = `Inconsistencia biológica detectada: El recuento de Escherichia coli (${ecoliValue} UFC/100mL) no puede ser mayor que el de Coliformes totales (${coliformesValue} UFC/100mL). E. coli es un taxón incluido dentro del grupo de coliformes totales.`;
      criticalErrors.push({ message: msg });
      if (ecoliParamName) {
        fieldStatus[ecoliParamName] = {
          type: "error",
          message: `E. coli (${ecoliValue}) excede Coliformes totales (${coliformesValue})`,
        };
      }
      if (coliformesParamName) {
        fieldStatus[coliformesParamName] = {
          type: "error",
          message: `Coliformes totales (${coliformesValue}) debe ser mayor o igual a E. coli (${ecoliValue})`,
        };
      }
    }

    return {
      criticalErrors,
      warnings,
      fieldStatus,
      hasErrors: criticalErrors.length > 0,
    };
  }, [parameters]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);

    if (validationResults.hasErrors) {
      return;
    }

    // Filtrar solo parámetros con valores ingresados
    const filledParameters = parameters
      .filter((p) => p.value.trim() !== "")
      .map((p) => ({
        name: p.name,
        value: parseFloat(p.value),
        unit: p.unit,
      }));

    if (filledParameters.length === 0) {
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
          {/* Alerta Destacada de Errores Críticos / Valores No Permitidos */}
          {validationResults.criticalErrors.length > 0 && (
            <div className="mb-6 p-5 bg-red-50 border-2 border-red-400 text-red-900 rounded-xl shadow-sm animate-in fade-in duration-300">
              <div className="flex items-start gap-3">
                <div className="p-1.5 bg-red-100 rounded-lg text-red-600 shrink-0">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-red-800">
                    Restricciones de Calidad de Agua no cumplidas ({validationResults.criticalErrors.length}):
                  </h4>
                  <ul className="list-disc list-inside text-xs sm:text-sm text-red-700 space-y-1">
                    {validationResults.criticalErrors.map((err, idx) => (
                      <li key={idx} className="leading-snug">
                        {err.message}
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-red-600 font-medium pt-1">
                    ⚠️ Debe corregir estos valores biológica o físicamente imposibles para habilitar el cálculo.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Alertas Informativas de Valores Atípicos / Extremos */}
          {validationResults.warnings.length > 0 && validationResults.criticalErrors.length === 0 && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-300 text-amber-900 rounded-xl shadow-sm animate-in fade-in duration-300">
              <div className="flex items-start gap-3">
                <span className="text-xl">⚠️</span>
                <div className="space-y-1">
                  <h4 className="font-bold text-xs sm:text-sm text-amber-800">
                    Advertencia de valores atípicos detectados:
                  </h4>
                  <ul className="list-disc list-inside text-xs text-amber-700 space-y-0.5">
                    {validationResults.warnings.map((warn, idx) => (
                      <li key={idx}>{warn.message}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {formSubmitted && filledCount === 0 && (
            <div className="mb-6 p-4 bg-orange-50 border border-orange-300 text-orange-800 rounded-lg text-sm font-medium">
              Por favor ingrese al menos un parámetro antes de calcular los índices.
            </div>
          )}

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

                    const statusInfo = validationResults.fieldStatus[param.name];
                    const hasCriticalError = statusInfo?.type === "error";
                    const hasWarning = statusInfo?.type === "warning";

                    return (
                      <tr
                        key={param.name}
                        className={
                          hasCriticalError
                            ? "bg-red-50/80"
                            : hasWarning
                              ? "bg-amber-50/60"
                              : hasValue
                                ? isOutOfRange
                                  ? "bg-orange-50/50"
                                  : "bg-green-50/40"
                                : ""
                        }
                      >
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          <div className="flex items-center gap-1.5">
                            {hasCriticalError && (
                              <span className="text-red-600 font-bold" title={statusInfo.message}>
                                ⛔
                              </span>
                            )}
                            {hasWarning && !hasCriticalError && (
                              <span className="text-amber-500 font-bold" title={statusInfo.message}>
                                ⚠️
                              </span>
                            )}
                            <span>{param.name}</span>
                          </div>
                          {hasCriticalError && (
                            <p className="text-xs text-red-600 font-medium mt-0.5 animate-in fade-in">
                              {statusInfo.message}
                            </p>
                          )}
                          {hasWarning && !hasCriticalError && (
                            <p className="text-xs text-amber-700 mt-0.5">
                              {statusInfo.message}
                            </p>
                          )}
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
                            className={`w-28 px-2.5 py-1.5 border rounded-md text-sm transition-all focus:ring-2 focus:border-transparent ${
                              hasCriticalError
                                ? "border-red-500 bg-red-100/50 text-red-900 focus:ring-red-400 font-semibold"
                                : hasWarning
                                  ? "border-amber-400 bg-amber-50 text-amber-900 focus:ring-amber-400"
                                  : hasValue && isOutOfRange
                                    ? "border-orange-300 bg-orange-50 text-orange-900 focus:ring-orange-400"
                                    : "border-gray-300 focus:ring-green-500"
                            }`}
                          />
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500 font-mono text-xs">
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
                        <td className="px-4 py-3 text-sm text-gray-500 font-medium">
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
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <button
              type="button"
              onClick={onBack}
              className="w-full sm:w-auto px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md transition-colors"
            >
              ← Volver
            </button>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              {validationResults.hasErrors && (
                <span className="text-xs text-red-600 font-medium">
                  ⛔ Hay valores no permitidos que impiden el cálculo
                </span>
              )}
              <button
                type="submit"
                disabled={filledCount === 0 || validationResults.hasErrors}
                className="w-full sm:w-auto px-6 py-3 bg-green-600 text-white rounded-md font-semibold hover:bg-green-700 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                Calcular Índices →
              </button>
            </div>
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
