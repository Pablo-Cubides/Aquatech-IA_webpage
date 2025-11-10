"use client";
import React from "react";
import type { ImpactoBase } from "@/types";

interface ConesaFormProps {
  impactos: ImpactoBase[];
}

export default function ConesaForm({ impactos }: ConesaFormProps) {
  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <h4 className="text-lg font-semibold mb-4">⚖️ Matriz Conesa</h4>
      <div className="space-y-3">
        {impactos.slice(0, 5).map((impacto, idx) => (
          <div key={impacto.id} className="border rounded p-3 hover:bg-gray-50">
            <div className="flex justify-between items-center">
              <span className="font-medium">Impacto {idx + 1}</span>
              <div className="text-xs px-2 py-1 rounded bg-yellow-100">
                {impacto.signo === "+" ? "Positivo" : "Negativo"}
              </div>
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-4">
        Total de impactos evaluados: {impactos.length}
      </p>
    </div>
  );
}
