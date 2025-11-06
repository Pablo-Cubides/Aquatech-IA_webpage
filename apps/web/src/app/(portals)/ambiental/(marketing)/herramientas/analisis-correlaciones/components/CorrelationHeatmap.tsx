import React from "react"

interface CorrelationResult {
  column_a: string
  column_b: string
  pearson: number
  spearman: number
  kendall: number
}

interface CorrelationHeatmapProps {
  numericColumns: string[]
  correlationResults: CorrelationResult[]
  method: "pearson" | "spearman" | "kendall"
  onSelectPair?: (a: string, b: string) => void
  selectedPair?: [string, string] | null
}

function getColor(value: number) {
  // Azul fuerte = correlación fuerte, amarillo = moderada, rojo = débil
  if (Math.abs(value) > 0.75) return "bg-blue-400 text-white"
  if (Math.abs(value) >= 0.4) return "bg-yellow-300 text-gray-900"
  return "bg-red-300 text-gray-900"
}

export default function CorrelationHeatmap({ numericColumns, correlationResults, method, onSelectPair, selectedPair }: CorrelationHeatmapProps) {
  // Crear matriz para acceso rápido
  const matrix: Record<string, Record<string, number>> = {}
  correlationResults.forEach(res => {
    if (!matrix[res.column_a]) matrix[res.column_a] = {}
    matrix[res.column_a][res.column_b] = res[method]
    // Simetría
    if (!matrix[res.column_b]) matrix[res.column_b] = {}
    matrix[res.column_b][res.column_a] = res[method]
  })

  return (
    <div className="overflow-x-auto">
      <table className="min-w-max w-full border rounded-lg bg-white mt-6">
        <thead>
          <tr>
            <th className="p-2 border bg-gray-50">Columna</th>
            {numericColumns.map(col => (
              <th key={col} className="p-2 border bg-gray-50">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {numericColumns.map(rowCol => (
            <tr key={rowCol}>
              <td className="p-2 border font-semibold bg-gray-50">{rowCol}</td>
              {numericColumns.map(colCol => {
                if (rowCol === colCol) {
                  return <td key={colCol} className="p-2 border bg-gray-100 text-center">—</td>
                }
                const value = matrix[rowCol]?.[colCol]
                const isSelected = selectedPair && ((selectedPair[0] === rowCol && selectedPair[1] === colCol) || (selectedPair[1] === rowCol && selectedPair[0] === colCol))
                return (
                  <td
                    key={colCol}
                    className={`p-2 border text-center cursor-pointer transition-all ${value !== undefined ? getColor(value) : 'bg-gray-100'} ${isSelected ? 'ring-2 ring-primary' : ''}`}
                    title={`Correlación: ${value !== undefined ? value.toFixed(2) : 'N/A'}`}
                    onClick={() => value !== undefined && onSelectPair?.(rowCol, colCol)}
                  >
                    {value !== undefined ? value.toFixed(2) : 'N/A'}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-2 text-xs text-gray-500">
        <span className="bg-blue-400 text-white px-2 py-1 rounded">Fuerte (&gt; 0.75)</span>
        <span className="bg-yellow-300 text-gray-900 px-2 py-1 rounded ml-2">Moderada (0.4–0.75)</span>
        <span className="bg-red-300 text-gray-900 px-2 py-1 rounded ml-2">Débil (&lt; 0.4)</span>
      </div>
    </div>
  )
}
