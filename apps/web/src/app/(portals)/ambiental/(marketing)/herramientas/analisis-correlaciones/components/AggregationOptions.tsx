"use client";

import { useState } from "react";
import type {
  AggregationMethod,
  AggregationPeriod,
} from "../src/utils/aggregation";

interface AggregationOptionsProps {
  onApply: (method: AggregationMethod, period: AggregationPeriod) => void;
  defaultMethod?: AggregationMethod;
  defaultPeriod?: AggregationPeriod;
}

export default function AggregationOptions({
  onApply,
  defaultMethod = "mean",
  defaultPeriod = "yearly",
}: AggregationOptionsProps) {
  const [method, setMethod] = useState<AggregationMethod>(defaultMethod);
  const [period, setPeriod] = useState<AggregationPeriod>(defaultPeriod);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleApply = () => {
    onApply(method, period);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900">
          Opciones de Agregación Temporal
        </h3>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-sm text-[#00796B] hover:text-[#004D40] font-medium"
        >
          {showAdvanced ? "Ocultar opciones" : "Ver opciones"}
        </button>
      </div>

      {showAdvanced && (
        <>
          {/* Aggregation Period */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Período de Agregación
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setPeriod("yearly")}
                className={`
                  px-4 py-2 rounded-lg border-2 transition-colors text-sm font-medium
                  ${
                    period === "yearly"
                      ? "border-[#00796B] bg-[#E0F2F1] text-[#00796B]"
                      : "border-gray-200 hover:border-[#00796B] text-gray-700"
                  }
                `}
              >
                📅 Anual
              </button>
              <button
                onClick={() => setPeriod("quarterly")}
                className={`
                  px-4 py-2 rounded-lg border-2 transition-colors text-sm font-medium
                  ${
                    period === "quarterly"
                      ? "border-[#00796B] bg-[#E0F2F1] text-[#00796B]"
                      : "border-gray-200 hover:border-[#00796B] text-gray-700"
                  }
                `}
              >
                📊 Trimestral
              </button>
              <button
                onClick={() => setPeriod("monthly")}
                className={`
                  px-4 py-2 rounded-lg border-2 transition-colors text-sm font-medium
                  ${
                    period === "monthly"
                      ? "border-[#00796B] bg-[#E0F2F1] text-[#00796B]"
                      : "border-gray-200 hover:border-[#00796B] text-gray-700"
                  }
                `}
              >
                📆 Mensual
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {period === "yearly" &&
                "Los datos se agruparán por año completo"}
              {period === "quarterly" &&
                "Los datos se agruparán por trimestres (Q1, Q2, Q3, Q4)"}
              {period === "monthly" &&
                "Los datos se agruparán por mes calendario"}
            </p>
          </div>

          {/* Aggregation Method */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Método de Agregación
            </label>
            <div className="space-y-2">
              {[
                {
                  value: "mean" as AggregationMethod,
                  label: "Promedio",
                  icon: "📊",
                  description: "Calcula la media aritmética de los valores",
                },
                {
                  value: "sum" as AggregationMethod,
                  label: "Suma",
                  icon: "➕",
                  description: "Suma todos los valores del período",
                },
                {
                  value: "median" as AggregationMethod,
                  label: "Mediana",
                  icon: "📈",
                  description:
                    "Valor medio que divide los datos en dos mitades",
                },
                {
                  value: "min" as AggregationMethod,
                  label: "Mínimo",
                  icon: "⬇️",
                  description: "Valor más bajo del período",
                },
                {
                  value: "max" as AggregationMethod,
                  label: "Máximo",
                  icon: "⬆️",
                  description: "Valor más alto del período",
                },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setMethod(option.value)}
                  className={`
                    w-full p-3 rounded-lg border-2 transition-colors text-left
                    ${
                      method === option.value
                        ? "border-[#00796B] bg-[#E0F2F1]"
                        : "border-gray-200 hover:border-[#00796B]"
                    }
                  `}
                >
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">{option.icon}</span>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">
                        {option.label}
                        {method === option.value && (
                          <span className="ml-2 text-[#00796B]">✓</span>
                        )}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {option.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Apply Button */}
          <button
            onClick={handleApply}
            className="w-full py-2 bg-[#00796B] text-white font-semibold rounded-lg hover:bg-[#004D40] transition-colors"
          >
            Aplicar Agregación
          </button>

          {/* Info */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-800">
              <span className="font-semibold">💡 Consejo:</span> Usa{" "}
              <strong>Promedio</strong> para datos que representan tasas o
              porcentajes. Usa <strong>Suma</strong> para datos acumulativos
              como emisiones totales o producción.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
