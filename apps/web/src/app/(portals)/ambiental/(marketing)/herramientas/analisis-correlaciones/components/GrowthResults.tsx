"use client";

import React from 'react';
import type { GrowthAnalysisResult } from '../types/analysis';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface GrowthResultsProps {
  results: { [key: string]: GrowthAnalysisResult };
  filename: string;
}

// Custom tooltip to show growth rate
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border rounded-lg shadow-lg">
        <p className="font-semibold text-gray-800">{label}</p>
        <p className="text-blue-600">Valor: {data.value?.toLocaleString()}</p>
        {data.growth !== undefined && data.growth !== 0 && (
          <p className={`text-sm ${data.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            Cambio anual: {data.growth >= 0 ? '+' : ''}{data.growth.toFixed(2)}%
          </p>
        )}
      </div>
    );
  }
  return null;
};

export default function GrowthResults({ results, filename }: GrowthResultsProps) {
  const indicators = Object.keys(results);

  return (
    <div className="space-y-8">
      <div className="text-center">
         <h2 className="text-2xl font-bold text-gray-800">Análisis de Crecimiento</h2>
         <p className="text-gray-500">{filename}</p>
         <p className="text-sm text-blue-600 mt-2">
            ✓ Se procesaron {indicators.length} indicador(es) con datos disponibles
         </p>
         {indicators.length > 1 && (
           <p className="text-xs text-gray-400 mt-1">↓ Desplázate hacia abajo para ver todos los gráficos ({indicators.length} total)</p>
         )}
      </div>

      {indicators.map((indicator) => {
        const data = results[indicator];
        const chartData = data.periods.map((period, i) => ({
            period,
            value: data.values[i],
            growth: data.growthRates[i] || 0
        }));

        return (
          <div key={indicator} className="p-6 bg-white border rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">{indicator}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 bg-blue-50 rounded-lg">
                    <span className="block text-sm text-blue-600 mb-1">CAGR (Crecimiento Anual Compuesto)</span>
                    <span className={`text-2xl font-bold ${data.cagr >= 0 ? 'text-blue-800' : 'text-red-600'}`}>
                      {data.cagr >= 0 ? '+' : ''}{data.cagr.toFixed(2)}%
                    </span>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                    <span className="block text-sm text-green-600 mb-1">Cambio Total ({data.periods[0]} - {data.periods[data.periods.length-1]})</span>
                    <span className={`text-2xl font-bold ${data.totalChange >= 0 ? 'text-green-800' : 'text-red-600'}`}>
                      {data.totalChange >= 0 ? '+' : ''}{data.totalChange.toFixed(2)}%
                    </span>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                    <span className="block text-sm text-purple-600 mb-1">Crecimiento Promedio Anual</span>
                    <span className={`text-2xl font-bold ${data.avgGrowthRate >= 0 ? 'text-purple-800' : 'text-red-600'}`}>
                      {data.avgGrowthRate >= 0 ? '+' : ''}{data.avgGrowthRate.toFixed(2)}%
                    </span>
                </div>
            </div>

            <div className="h-[300px] w-full mb-4">
               <h4 className="text-sm font-medium text-gray-500 mb-2">Evolución en el Tiempo (pasa el cursor para ver % cambio anual)</h4>
               <ResponsiveContainer width="100%" height="100%">
                 <LineChart data={chartData}>
                   <CartesianGrid strokeDasharray="3 3" />
                   <XAxis dataKey="period" />
                   <YAxis />
                   <Tooltip content={<CustomTooltip />} />
                   <Legend />
                   <Line 
                     type="monotone" 
                     dataKey="value" 
                     stroke="#2563eb" 
                     name="Valor" 
                     strokeWidth={2}
                     dot={{ r: 3 }}
                     activeDot={{ r: 6 }}
                   />
                 </LineChart>
               </ResponsiveContainer>
            </div>
          </div>
        );
      })}
    </div>
  );
}
