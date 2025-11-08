"use client";
import React from "react";
import type { ImpactoBase } from "../types";

interface LeopoldGridProps {
  impactos: ImpactoBase[];
}

export default function LeopoldGrid({ impactos }: LeopoldGridProps) {
  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200">
      <h4 className="text-lg font-semibold mb-4">🔲 Grid Leopold</h4>
      <div className="grid grid-cols-5 gap-2">
        {impactos.map((impacto) => (
          <div
            key={impacto.id}
            className={`p-3 rounded text-center text-sm font-semibold text-white ${
              impacto.signo === "+" ? "bg-green-500" : "bg-red-500"
            }`}
          >
            {impacto.signo}
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-4">
        Total de impactos: {impactos.length}
      </p>
    </div>
  );
}
