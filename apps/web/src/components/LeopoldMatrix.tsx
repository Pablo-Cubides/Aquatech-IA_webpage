"use client";
import React from "react";
import type { ImpactoBase } from "@/types";

interface LeopoldMatrixProps {
  impactos: ImpactoBase[];
}

export default function LeopoldMatrix({ impactos }: LeopoldMatrixProps) {
  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <h4 className="text-lg font-semibold mb-4">📊 Matriz Leopold</h4>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-green-100">
              <th className="border p-2 text-left">Acción</th>
              <th className="border p-2 text-left">Factor</th>
              <th className="border p-2">Signo</th>
              <th className="border p-2">Magnitud</th>
              <th className="border p-2">Importancia</th>
            </tr>
          </thead>
          <tbody>
            {impactos.map((impacto, idx) => (
              <tr key={impacto.id} className="hover:bg-gray-50">
                <td className="border p-2">Acción {idx + 1}</td>
                <td className="border p-2">Factor {idx + 1}</td>
                <td className="border p-2 text-center">
                  <span
                    className={`font-bold ${impacto.signo === "+" ? "text-green-600" : "text-red-600"}`}
                  >
                    {impacto.signo}
                  </span>
                </td>
                <td className="border p-2 text-center">-</td>
                <td className="border p-2 text-center">-</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-500 mt-4">
        Total de impactos: {impactos.length}
      </p>
    </div>
  );
}
