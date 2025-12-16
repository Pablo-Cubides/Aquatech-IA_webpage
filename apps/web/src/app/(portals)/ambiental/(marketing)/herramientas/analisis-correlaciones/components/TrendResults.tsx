
import React from 'react';
import type { TrendAnalysisResult } from '../types/analysis';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface TrendResultsProps {
  results: { [key: string]: TrendAnalysisResult };
  filename: string;
}

export default function TrendResults({ results, filename }: TrendResultsProps) {
  const indicators = Object.keys(results);

  return (
    <div className="space-y-12">
      <div className="text-center">
         <h2 className="text-2xl font-bold text-gray-800">Análisis de Tendencias</h2>
         <p className="text-gray-500">{filename}</p>
      </div>

      {indicators.map((indicator) => {
        const data = results[indicator];
        
        // Prepare chart data (historical + projections)
        // We need to re-generate points from slope/intercept for the "Trend Line" visual
        // Assuming linear regression y = mx + b
        
        // This is simplified, in a real app we'd pass the original historical points too for better visualization
        // But TrendAnalysisResult only has slope/intercept/projections. 
        // Let's assume the user wants to see the projections mainly.
        // Wait, for a good chart I need the historical data points too.
        // The implementation in aggregation.ts didn't return historical points in TrendAnalysisResult.
        // I should probably update aggregation.ts or just show projections here.
        // Let's show projections and summary stats for now.
        
        const trendColor = data.trend === 'increasing' ? 'text-green-600' : data.trend === 'decreasing' ? 'text-red-600' : 'text-gray-600';
        const trendIcon = data.trend === 'increasing' ? '↗️' : data.trend === 'decreasing' ? '↘️' : '➡️';

        return (
          <div key={indicator} className="p-6 bg-white border rounded-lg shadow-sm">
             <div className="flex justify-between items-start mb-4 border-b pb-2">
                <h3 className="text-lg font-semibold text-gray-800">{indicator}</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-bold bg-gray-100 ${trendColor}`}>
                    {trendIcon} Tendencia {data.trend === 'increasing' ? 'Creciente' : data.trend === 'decreasing' ? 'Decreciente' : 'Estable'}
                </span>
             </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-gray-50 rounded-lg">
                    <span className="block text-sm text-gray-500 mb-1">Pendiente (m)</span>
                    <span className="text-xl font-bold text-gray-800">{data.slope.toFixed(4)}</span>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                    <span className="block text-sm text-gray-500 mb-1">Intercepto (b)</span>
                    <span className="text-xl font-bold text-gray-800">{data.intercept.toFixed(2)}</span>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                    <span className="block text-sm text-gray-500 mb-1">R² (Ajuste)</span>
                    <span className="text-xl font-bold text-gray-800">{data.r2.toFixed(4)}</span>
                </div>
            </div>

            <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-500 mb-3">Proyecciones Futuras</h4>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                            <tr>
                                <th className="px-6 py-3">Año</th>
                                <th className="px-6 py-3">Valor Proyectado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.projections.map((p) => (
                                <tr key={p.year} className="bg-white border-b">
                                    <td className="px-6 py-4 font-medium text-gray-900">{p.year}</td>
                                    <td className="px-6 py-4">{p.value.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <p className="text-xs text-gray-400 italic">
                * Proyección basada en regresión lineal simple sobre los datos históricos disponibles.
            </p>
          </div>
        );
      })}
    </div>
  );
}
