"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import CorrelationTable from "../components/CorrelationTable";
import CorrelationHeatmap from "../components/CorrelationHeatmap";
import ExportButtons from "../components/ExportButtons";

interface DataRow {
  [key: string]: string | number | null | undefined;
}

interface CorrelationResult {
  column_a: string;
  column_b: string;
  pearson: number | null;
  spearman: number | null;
  kendall: number | null;
}

interface AnalysisResult {
  filename: string;
  correlation_results: CorrelationResult[];
  numeric_columns: string[];
  raw_data: DataRow[];
}

// Dynamic import for heavy chart component (recharts)
const ScatterPlot = dynamic(() => import("../components/ScatterPlot"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Cargando gráfico...</p>
      </div>
    </div>
  ),
});

const methodOptions = [
  { value: "pearson", label: "Pearson", icon: "📈", desc: "Relación lineal" },
  {
    value: "spearman",
    label: "Spearman",
    icon: "📊",
    desc: "Relación monotónica",
  },
  {
    value: "kendall",
    label: "Kendall Tau",
    icon: "🎯",
    desc: "Concordancia ordinal",
  },
];

export default function ResultsSection({ result }: { result: AnalysisResult }) {
  const [method, setMethod] = useState<"pearson" | "spearman" | "kendall">(
    "pearson",
  );
  const [selectedPair, setSelectedPair] = useState<[string, string] | null>(
    null,
  );

  const handleSelectPair = (a: string, b: string) => {
    setSelectedPair([a, b]);
  };

  const heatmapRef = React.useRef<HTMLDivElement>(null);
  return (
    <div className="flex flex-col gap-12">
      {/* Export buttons */}
      <div className="flex flex-wrap gap-4">
        <ExportButtons
          correlationResults={result.correlation_results}
          numericColumns={result.numeric_columns}
          rawData={result.raw_data}
          heatmapRef={heatmapRef}
        />
      </div>

      {/* Tabs section */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Resultados del Análisis
          </h2>

          {/* Method selector */}
          <div className="flex flex-wrap gap-3 mb-8">
            {methodOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setMethod(opt.value as "pearson" | "spearman" | "kendall")}
                className={`px-4 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                  method === opt.value
                    ? "bg-gradient-to-r from-cyan-400 to-blue-500 text-white shadow-lg"
                    : "bg-white border border-slate-200 text-slate-700 hover:border-cyan-300 hover:shadow-md"
                }`}
              >
                <span className="text-lg">{opt.icon}</span>
                <div className="text-left">
                  <div className="text-sm leading-none">{opt.label}</div>
                  <div className="text-xs opacity-75 leading-none mt-1">
                    {opt.desc}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Correlation Table */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"></span>
              Tabla de correlaciones
            </h3>
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <CorrelationTable
                numericColumns={result.numeric_columns}
                correlationResults={result.correlation_results}
              />
            </div>
          </div>
        </div>

        {/* Heatmap */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
            <span className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"></span>
            Mapa de calor:{" "}
            {methodOptions.find((o) => o.value === method)?.label}
          </h3>
          <div
            ref={heatmapRef}
            className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm"
          >
            <CorrelationHeatmap
              numericColumns={result.numeric_columns}
              correlationResults={result.correlation_results}
              method={method}
              onSelectPair={handleSelectPair}
              selectedPair={selectedPair}
            />
          </div>
        </div>

        {/* Scatter plot */}
        {selectedPair && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"></span>
              Gráfico de dispersión: {selectedPair[0]} vs {selectedPair[1]}
            </h3>
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <ScatterPlot
                data={result.raw_data.filter(
                  (row: DataRow) =>
                    typeof row[selectedPair[0]] === "number" &&
                    typeof row[selectedPair[1]] === "number",
                )}
                xKey={selectedPair[0]}
                yKey={selectedPair[1]}
              />
            </div>
          </div>
        )}
      </div>

      {/* Educational section */}
      <div className="bg-gradient-to-br from-slate-50 to-blue-50 border border-slate-200 rounded-2xl p-8">
        <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <span className="text-2xl">📚</span> Guía educativa
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow">
            <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
              <span className="text-lg">📈</span> Correlación de Pearson
            </h4>
            <p className="text-sm text-slate-600">
              Mide la relación lineal entre dos variables. Un valor cercano a{" "}
              <strong>1</strong> indica correlación positiva fuerte,{" "}
              <strong>-1</strong> negativa fuerte, y <strong>0</strong> sin
              relación lineal.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow">
            <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
              <span className="text-lg">📊</span> Correlación de Spearman
            </h4>
            <p className="text-sm text-slate-600">
              Evalúa relaciones monotónicas basadas en rangos. Útil cuando los
              datos no siguen distribución normal o hay valores atípicos.
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow">
            <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
              <span className="text-lg">🎯</span> Correlación de Kendall Tau
            </h4>
            <p className="text-sm text-slate-600">
              Mide concordancia ordinal. Menos sensible a valores extremos.
              Valores cercanos a <strong>±1</strong> indican fuerte
              concordancia.
            </p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-slate-700">
            <strong className="text-blue-900">
              💡 Interpretación general:
            </strong>{" "}
            Correlaciones entre <strong>0.8-1.0</strong> son fuertes,{" "}
            <strong>0.6-0.8</strong> moderadas, <strong>0.3-0.6</strong>{" "}
            débiles.
            <strong className="block mt-2">
              ⚠️ Recuerda: Correlación no implica causalidad.
            </strong>
          </p>
        </div>
      </div>
    </div>
  );
}
