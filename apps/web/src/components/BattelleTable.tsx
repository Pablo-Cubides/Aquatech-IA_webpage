"use client";
import React from "react";
import type { ImpactoBase } from "@/types";

interface BattelleTableProps {
  impactos: ImpactoBase[];
}

export default function BattelleTable({ impactos }: BattelleTableProps) {
  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <h4 className="text-lg font-semibold mb-4">
        🔬 Matriz Battelle-Columbus
      </h4>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-blue-100">
              <th className="border p-2 text-left">Impacto</th>
              <th className="border p-2 text-center">UIP</th>
              <th className="border p-2 text-center">Calidad Sin</th>
              <th className="border p-2 text-center">Calidad Con</th>
              <th className="border p-2 text-center">UIA</th>
            </tr>
          </thead>
          <tbody>
            {impactos.map((impacto, idx) => (
              <tr key={impacto.id} className="hover:bg-gray-50">
                <td className="border p-2">Impacto {idx + 1}</td>
                <td className="border p-2 text-center">50</td>
                <td className="border p-2 text-center">2</td>
                <td className="border p-2 text-center">3</td>
                <td className="border p-2 text-center font-semibold">50</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-gray-500 mt-4">
        Total de parámetros: {impactos.length}
      </p>
    </div>
  );
}
