"use client"
import React, { useState } from "react"
import CorrelationTable from "../components/CorrelationTable"
import CorrelationHeatmap from "../components/CorrelationHeatmap"
import ScatterPlot from "../components/ScatterPlot"
import ExportButtons from "../components/ExportButtons"

const methodOptions = [
  { value: "pearson", label: "Pearson" },
  { value: "spearman", label: "Spearman" },
  { value: "kendall", label: "Kendall Tau" },
]

export default function ResultsSection({ result }: { result: any }) {
  const [method, setMethod] = useState<"pearson" | "spearman" | "kendall">("pearson")
  const [selectedPair, setSelectedPair] = useState<[string, string] | null>(null)

  const handleSelectPair = (a: string, b: string) => {
    setSelectedPair([a, b])
  }

  const heatmapRef = React.useRef<HTMLDivElement>(null)
  return (
    <div className="flex flex-col gap-8">
      <div className="mb-2 font-semibold text-center text-green-700">¡Análisis completado!</div>
      <ExportButtons correlationResults={result.correlation_results} numericColumns={result.numeric_columns} rawData={result.raw_data} heatmapRef={heatmapRef} />
      <CorrelationTable
        numericColumns={result.numeric_columns}
        correlationResults={result.correlation_results}
      />
      <div className="mt-8">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-semibold">Mapa de calor:</span>
          <select
            className="px-2 py-1 text-sm border rounded"
            value={method}
            onChange={e => setMethod(e.target.value as any)}
          >
            {methodOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div ref={heatmapRef}>
          <CorrelationHeatmap
            numericColumns={result.numeric_columns}
            correlationResults={result.correlation_results}
            method={method}
            onSelectPair={handleSelectPair}
            selectedPair={selectedPair}
          />
        </div>
      </div>
      {selectedPair && (
        <div className="mt-8">
          <ScatterPlot
            data={result.raw_data.filter((row: any) =>
              typeof row[selectedPair[0]] === 'number' && typeof row[selectedPair[1]] === 'number')}
            xKey={selectedPair[0]}
            yKey={selectedPair[1]}
          />
        </div>
      )}
      
      <div className="p-6 mt-12 border rounded-lg bg-gray-50">
        <h3 className="mb-4 text-lg font-semibold text-gray-800">¿Qué significan las correlaciones?</h3>
        <div className="space-y-4 text-sm text-gray-700">
          <div>
            <h4 className="mb-1 font-medium text-gray-900">Correlación de Pearson:</h4>
            <p>Mide la relación lineal entre dos variables. Un valor cercano a 1 indica una correlación positiva fuerte (cuando una variable aumenta, la otra también lo hace). Un valor cercano a -1 indica una correlación negativa fuerte (cuando una variable aumenta, la otra disminuye). Un valor cercano a 0 indica poca o ninguna relación lineal.</p>
          </div>
          
          <div>
            <h4 className="mb-1 font-medium text-gray-900">Correlación de Spearman:</h4>
            <p>Evalúa la relación monotónica entre dos variables, basada en rangos en lugar de valores absolutos. Es útil cuando los datos no siguen una distribución normal o cuando hay valores atípicos. Valores cercanos a 1 o -1 indican una relación fuerte, mientras que valores cercanos a 0 sugieren una relación débil o inexistente.</p>
          </div>
          
          <div>
            <h4 className="mb-1 font-medium text-gray-900">Correlación de Kendall Tau:</h4>
            <p>Mide la concordancia ordinal entre dos variables, evaluando si los pares de observaciones tienen el mismo orden relativo. Es menos sensible a valores extremos que Pearson y Spearman. Valores cercanos a 1 indican una fuerte concordancia, valores cercanos a -1 indican discordancia fuerte, y valores cercanos a 0 sugieren independencia ordinal.</p>
          </div>
          
          <div>
            <h4 className="mb-1 font-medium text-gray-900">Interpretación general:</h4>
            <p>Correlaciones entre 0.8 y 1.0 (o -0.8 y -1.0) se consideran fuertes. Entre 0.6 y 0.8 (o -0.6 y -0.8) moderadas. Entre 0.3 y 0.6 (o -0.3 y -0.6) débiles. Y por debajo de 0.3 (o -0.3) muy débiles o inexistentes. Recuerda que la correlación no implica causalidad.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
