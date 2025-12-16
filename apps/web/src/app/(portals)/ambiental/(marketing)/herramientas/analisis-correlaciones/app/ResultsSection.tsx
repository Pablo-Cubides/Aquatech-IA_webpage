import React from "react";
import CorrelationTable from "../components/CorrelationTable";
import ExportButtons from "../components/ExportButtons";
import GrowthResults from "../components/GrowthResults";
import TrendResults from "../components/TrendResults";
import ComparisonResults from "../components/ComparisonResults";
import type { AnalysisResult } from "../types/analysis";

export default function ResultsSection({ result }: { result: AnalysisResult }) {
  const contentRef = React.useRef<HTMLDivElement | null>(null);

  if (result.type === 'growth' && result.growth_results) {
      return (
          <>
            <ExportButtons
                correlationResults={[]} // Not needed for growth
                numericColumns={[]}
                rawData={[]}
                contentRef={contentRef}
                filename={result.filename}
                analysisType="growth"
                results={result} // Pass full result for PDF generation
            />
            <div ref={contentRef}>
                <GrowthResults results={result.growth_results} filename={result.filename} />
            </div>
          </>
      );
  }

  if (result.type === 'trend' && result.trend_results) {
      return (
          <>
            <ExportButtons
                correlationResults={[]}
                numericColumns={[]}
                rawData={[]}
                contentRef={contentRef}
                filename={result.filename}
                analysisType="trend"
                results={result}
            />
             <div ref={contentRef}>
                <TrendResults results={result.trend_results} filename={result.filename} />
             </div>
          </>
      );
  }

  if (result.type === 'comparison' && result.comparison_results) {
      return (
          <>
            <ExportButtons
                correlationResults={[]}
                numericColumns={[]}
                rawData={[]}
                contentRef={contentRef}
                filename={result.filename}
                analysisType="comparison"
                results={result}
            />
             <div ref={contentRef}>
                <ComparisonResults results={result.comparison_results} filename={result.filename} />
             </div>
          </>
      );
  }
  
  // Default to correlation view
  return (
    <div className="flex flex-col gap-8">
      <div className="mb-2 font-semibold text-center text-green-700">
        ¡Análisis completado!
      </div>
      
      {result.correlation_results && result.numeric_columns && result.raw_data && (
      <>
        <ExportButtons
            correlationResults={result.correlation_results}
            numericColumns={result.numeric_columns}
            rawData={result.raw_data}
            contentRef={contentRef}
            filename={result.filename}
            analysisType="correlation"
            results={result}
        />
        
        {/* Tabla matriz con V1, V2... */}
        <div ref={contentRef}>
          <CorrelationTable
              numericColumns={result.numeric_columns}
              correlationResults={result.correlation_results}
          />
        </div>
        
        {/* Tabla de lista de correlaciones */}
        <div className="mt-8">
            <h3 className="font-semibold text-gray-800 mb-4">Top Correlaciones</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full border rounded-lg bg-white">
                <thead>
                  <tr className="bg-cyan-500 text-white">
                    <th className="p-3 text-left">Variable 1</th>
                    <th className="p-3 text-left">Variable 2</th>
                    <th className="p-3 text-center">Pearson</th>
                    <th className="p-3 text-center">Spearman</th>
                    <th className="p-3 text-center">Kendall</th>
                  </tr>
                </thead>
                <tbody>
                  {[...result.correlation_results]
                    .sort((a, b) => Math.abs(b.pearson || 0) - Math.abs(a.pearson || 0))
                    .slice(0, 15)
                    .map((row, i) => (
                      <tr key={i} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        <td className="p-3 text-sm text-gray-700" title={row.column_a}>
                          {row.column_a.length > 35 ? row.column_a.substring(0, 35) + '...' : row.column_a}
                        </td>
                        <td className="p-3 text-sm text-gray-700" title={row.column_b}>
                          {row.column_b.length > 35 ? row.column_b.substring(0, 35) + '...' : row.column_b}
                        </td>
                        <td className={`p-3 text-center font-medium ${
                          Math.abs(row.pearson || 0) > 0.7 ? 'text-green-600' : 
                          Math.abs(row.pearson || 0) < 0.3 ? 'text-gray-400' : 'text-gray-700'
                        }`}>
                          {row.pearson?.toFixed(3) ?? 'N/A'}
                        </td>
                        <td className={`p-3 text-center font-medium ${
                          Math.abs(row.spearman || 0) > 0.7 ? 'text-green-600' : 
                          Math.abs(row.spearman || 0) < 0.3 ? 'text-gray-400' : 'text-gray-700'
                        }`}>
                          {row.spearman?.toFixed(3) ?? 'N/A'}
                        </td>
                        <td className={`p-3 text-center font-medium ${
                          Math.abs(row.kendall || 0) > 0.7 ? 'text-green-600' : 
                          Math.abs(row.kendall || 0) < 0.3 ? 'text-gray-400' : 'text-gray-700'
                        }`}>
                          {row.kendall?.toFixed(3) ?? 'N/A'}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
        </div>
      </>
      )}

      {/* Info Sections - kept only for correlation context, or could be made generic */}
      {result.type === 'correlation' && (
        <div className="p-6 mt-12 border rounded-lg bg-gray-50">
            <h3 className="mb-4 text-lg font-semibold text-gray-800">
            ¿Qué significan las correlaciones?
            </h3>
            <div className="space-y-6 text-sm text-gray-700">
             <div>
                <h4 className="mb-2 font-semibold text-gray-900">📊 Correlación de Pearson</h4>
                <p className="mb-2">
                  Mide la <strong>relación lineal</strong> entre dos variables. Es la más utilizada cuando se espera que los datos sigan una línea recta. 
                  Valores cercanos a <span className="text-blue-600 font-medium">+1</span> indican una correlación positiva fuerte (cuando una variable sube, la otra también). 
                  Valores cercanos a <span className="text-red-600 font-medium">-1</span> indican una correlación negativa fuerte (cuando una sube, la otra baja). 
                  Valores cercanos a <span className="text-gray-500 font-medium">0</span> indican que no existe relación lineal.
                </p>
                <div className="mt-2 p-3 bg-white rounded border text-xs">
                  <strong>Interpretación de rangos:</strong><br/>
                  • <span className="text-blue-700">0.75 a 1.00:</span> Correlación muy fuerte<br/>
                  • <span className="text-blue-600">0.50 a 0.74:</span> Correlación moderada<br/>
                  • <span className="text-yellow-600">0.25 a 0.49:</span> Correlación débil<br/>
                  • <span className="text-gray-500">0.00 a 0.24:</span> Sin correlación significativa
                </div>
             </div>
             
             <div>
                <h4 className="mb-2 font-semibold text-gray-900">📈 Correlación de Spearman</h4>
                <p className="mb-2">
                  Evalúa la <strong>relación monotónica</strong> entre variables, es decir, si cuando una aumenta la otra también tiende a aumentar (o disminuir), 
                  pero no necesariamente de forma lineal. Utiliza el orden o ranking de los datos en lugar de sus valores exactos. 
                  Es más robusta ante valores atípicos (outliers) y es ideal cuando los datos no siguen una distribución normal.
                </p>
                <div className="mt-2 p-3 bg-white rounded border text-xs">
                  <strong>¿Cuándo usar Spearman?</strong><br/>
                  • Cuando los datos tienen valores extremos o atípicos<br/>
                  • Cuando la relación no es perfectamente lineal<br/>
                  • Para datos ordinales (rankings, escalas de satisfacción)
                </div>
             </div>
             
             <div>
                <h4 className="mb-2 font-semibold text-gray-900">🔄 Correlación de Kendall Tau</h4>
                <p className="mb-2">
                  Mide la <strong>concordancia entre pares</strong> de observaciones. Compara cuántos pares de puntos están ordenados de la misma manera 
                  en ambas variables versus cuántos están ordenados de forma opuesta. Es la más conservadora de las tres y funciona bien con 
                  muestras pequeñas o cuando hay muchos empates en los datos.
                </p>
                <div className="mt-2 p-3 bg-white rounded border text-xs">
                  <strong>Ventajas de Kendall:</strong><br/>
                  • Mejor para muestras pequeñas (n &lt; 30)<br/>
                  • Más estable estadísticamente<br/>
                  • Maneja bien datos con empates
                </div>
             </div>
             
             <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="mb-2 font-semibold text-blue-800">💡 Consejo práctico</h4>
                <p className="text-blue-900">
                  En análisis ambientales, una correlación de <strong>0.5 o superior</strong> generalmente indica una relación 
                  significativa entre variables. Sin embargo, recuerda que <strong>correlación no implica causalidad</strong>: 
                  que dos variables estén correlacionadas no significa que una cause la otra.
                </p>
             </div>
            </div>
        </div>
      )}
    </div>
  );
}
