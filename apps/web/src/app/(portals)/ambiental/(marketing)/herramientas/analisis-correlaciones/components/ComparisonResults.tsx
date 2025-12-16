"use client";

import React from 'react';
import type { ComparisonResult } from '../types/analysis';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface ComparisonResultsProps {
  results: ComparisonResult;
  filename: string;
}

export default function ComparisonResults({ results, filename }: ComparisonResultsProps) {
  // Group data by indicator for individual charts
  // results.countries contains entries like "Colombia - PIB", "Chile - PIB"
  // We need to group by indicator (the part after " - ")
  
  const indicatorGroups: Map<string, { country: string; data: number[]; fullName: string }[]> = new Map();
  
  results.countries.forEach((fullName, idx) => {
    const parts = fullName.split(' - ');
    const country = parts[0];
    const indicator = parts.slice(1).join(' - ') || fullName;
    
    if (!indicatorGroups.has(indicator)) {
      indicatorGroups.set(indicator, []);
    }
    indicatorGroups.get(indicator)!.push({
      country,
      data: results.values[idx],
      fullName
    });
  });

  const colors = [
    '#2563eb', // blue
    '#16a34a', // green
    '#dc2626', // red
    '#d97706', // amber
    '#9333ea', // purple
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
         <h2 className="text-2xl font-bold text-gray-800">Análisis Comparativo</h2>
         <p className="text-gray-500">{filename}</p>
      </div>

      {/* Individual Charts per Indicator */}
      {Array.from(indicatorGroups.entries()).map(([indicator, countries], groupIdx) => {
        // Build chart data for this indicator
        const chartData = results.years.map((year, yearIdx) => {
          const point: Record<string, string | number> = { year };
          countries.forEach(c => {
            point[c.country] = c.data[yearIdx];
          });
          return point;
        });

        return (
          <div key={indicator} className="p-6 bg-white border rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{indicator}</h3>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number) => value.toLocaleString()}
                  />
                  <Legend />
                  {countries.map((c, idx) => (
                    <Line
                      key={c.country}
                      type="monotone"
                      dataKey={c.country}
                      name={c.country}
                      stroke={colors[idx % colors.length]}
                      strokeWidth={2}
                      dot={{ r: 3 }}
                      activeDot={{ r: 6 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      })}

      {/* Statistics Table */}
      <div className="p-6 bg-white border rounded-lg shadow-sm">
         <h3 className="text-lg font-semibold text-gray-800 mb-4">Estadísticas Descriptivas</h3>
         <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">País / Indicador</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mínimo</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Máximo</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Media</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Desv. Std</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {results.statistics.map((stat, idx) => (
                        <tr key={stat.country} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{stat.country}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stat.min.toLocaleString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stat.max.toLocaleString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stat.mean.toFixed(2)}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stat.stdDev.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
