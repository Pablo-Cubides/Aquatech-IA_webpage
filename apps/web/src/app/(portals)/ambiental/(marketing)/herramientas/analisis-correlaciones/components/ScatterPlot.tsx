"use client"
import React from "react"
import {
  ResponsiveContainer,
  ScatterChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Scatter,
  Legend,
} from "recharts"

interface ScatterPlotProps {
  data: Array<Record<string, number>>
  xKey: string
  yKey: string
}

export default function ScatterPlot({ data, xKey, yKey }: ScatterPlotProps) {
  return (
    <div className="w-full h-72 bg-white rounded border shadow flex flex-col items-center justify-center">
      <h3 className="font-semibold mb-2">Gráfica de dispersión: {xKey} vs {yKey}</h3>
      <ResponsiveContainer width="100%" height="90%">
        <ScatterChart>
          <CartesianGrid />
          <XAxis dataKey={xKey} name={xKey} tick={{ fontSize: 12 }} />
          <YAxis dataKey={yKey} name={yKey} tick={{ fontSize: 12 }} />
          <Tooltip
            formatter={(value: any, name: string) => [value, name]}
            labelFormatter={() => ''}
          />
          <Legend />
          <Scatter name="Datos" data={data} fill="#2563eb" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  )
}
