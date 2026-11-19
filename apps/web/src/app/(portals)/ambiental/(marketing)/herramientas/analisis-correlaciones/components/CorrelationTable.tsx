import React from "react";
import { classifyStrength, STRENGTH_LEGEND } from "../src/utils/correlations";

const methodInfo = {
  pearson: {
    label: "Pearson",
    color: "bg-blue-500",
    tooltip:
      "Coeficiente de correlación de Pearson: mide la relación lineal entre dos variables numéricas.",
  },
  spearman: {
    label: "Spearman",
    color: "bg-green-500",
    tooltip:
      "Correlación de Spearman: mide la relación monótona (no necesariamente lineal) entre dos variables numéricas.",
  },
  kendall: {
    label: "Kendall Tau",
    color: "bg-purple-500",
    tooltip:
      "Tau de Kendall: mide la concordancia en el orden de los valores entre dos variables numéricas.",
  },
};

export function getStrengthColor(value: number): string {
  const strength = classifyStrength(value);
  if (strength === "strong") return "text-blue-600";
  if (strength === "moderate") return "text-yellow-600";
  return "text-red-600";
}

function getStrengthEmoji(value: number): string {
  const strength = classifyStrength(value);
  if (strength === "strong") return "🔵";
  if (strength === "moderate") return "🟡";
  return "🔴";
}

interface CorrelationResult {
  column_a: string;
  column_b: string;
  pearson: number | null;
  spearman: number | null;
  kendall: number | null;
}

interface CorrelationTableProps {
  numericColumns: string[];
  correlationResults: CorrelationResult[];
}

export default function CorrelationTable({
  numericColumns,
  correlationResults,
}: CorrelationTableProps) {
  // Crear matriz para acceso rápido
  const matrix: Record<string, Record<string, CorrelationResult>> = {};
  correlationResults.forEach((res) => {
    if (!matrix[res.column_a]) matrix[res.column_a] = {};
    matrix[res.column_a][res.column_b] = res;
    // Simetría
    if (!matrix[res.column_b]) matrix[res.column_b] = {};
    matrix[res.column_b][res.column_a] = {
      column_a: res.column_b,
      column_b: res.column_a,
      pearson: res.pearson,
      spearman: res.spearman,
      kendall: res.kendall,
    };
  });

  return (
    <div>
      {/* Tabla de correlaciones */}
      <div className="overflow-x-auto">
        <table className="min-w-max w-full border rounded-lg bg-white">
          <thead>
            <tr>
              <th className="p-2 border bg-gray-50">Columna</th>
              {numericColumns.map((col, idx) => (
                <th
                  key={col}
                  className="p-2 border bg-gray-50 text-center font-bold text-blue-600"
                  title={col}
                >
                  V{idx + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {numericColumns.map((rowCol) => (
              <tr key={rowCol}>
                <td className="p-2 border font-semibold bg-gray-50">
                  {rowCol}
                </td>
                {numericColumns.map((colCol) => {
                  if (rowCol === colCol) {
                    return (
                      <td
                        key={colCol}
                        className="p-2 border bg-gray-100 text-center"
                      >
                        —
                      </td>
                    );
                  }
                  const res = matrix[rowCol]?.[colCol];
                  return (
                    <td key={colCol} className="p-2 border text-center">
                      {res ? (
                        <div className="flex flex-col gap-1 items-center">
                          {(["pearson", "spearman", "kendall"] as const).map(
                            (method) => {
                              const value = res[method];
                              if (value === null)
                                return (
                                  <span
                                    key={method}
                                    className="text-gray-300 text-xs"
                                  >
                                    N/A
                                  </span>
                                );
                              return (
                                <span
                                  key={method}
                                  className={`group relative cursor-help text-xs font-medium ${getStrengthColor(value)}`}
                                >
                                  {methodInfo[method].label}: {value.toFixed(2)}
                                  <span className="ml-1">
                                    {getStrengthEmoji(value)}
                                  </span>
                                  <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1 hidden group-hover:block bg-gray-800 text-white text-xs rounded px-2 py-1 z-10 whitespace-nowrap">
                                    {methodInfo[method].tooltip}
                                  </span>
                                </span>
                              );
                            },
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-300">N/A</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Leyenda de colores */}
      <div className="mt-4 text-xs text-gray-500">
        <span className="text-blue-600">🔵 {STRENGTH_LEGEND.strong}</span>,
        <span className="text-yellow-600 ml-2">🟡 {STRENGTH_LEGEND.moderate}</span>,
        <span className="text-red-600 ml-2">🔴 {STRENGTH_LEGEND.weak}</span>
      </div>

      {/* Leyenda de variables */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg border">
        <span className="font-semibold text-gray-700 text-sm block mb-2">
          Variables analizadas:
        </span>
        <div className="grid grid-cols-1 gap-1 text-xs">
          {numericColumns.map((col, i) => (
            <div key={col} className="flex items-start gap-2">
              <span className="font-bold text-blue-600 min-w-[30px]">
                V{i + 1}:
              </span>
              <span className="text-gray-600">{col}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
