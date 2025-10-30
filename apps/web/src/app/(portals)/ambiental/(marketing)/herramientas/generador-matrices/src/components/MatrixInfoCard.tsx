'use client';
import React from 'react';

export default function MatrixInfoCard({ type, title, onSelect, selected }: { type: string; title: string; onSelect: ()=>void; selected: boolean; }) {
  const descriptions: Record<string,string> = {
    leopold: 'Matriz cuali-cuantitativa. Para cada cruce acción×factor se asigna magnitud (±1..10) e importancia (1..10). Útil para impactos directos y rápidos.',
    conesa: 'Valoración multicriterio. Usa criterios como IN, EX, MO, etc. Para proyectos complejos y multicriterio.',
    battelle: 'Sistema cuantitativo por parámetros ambientales con UIP y calidades (sin/con) para calcular UIA por parámetro.'
  };

  return (
    <div className={`p-3 rounded border ${selected ? 'ring-2 ring-primary' : ''}`}>
      <div className="flex justify-between items-start">
        <div>
          <div className="font-semibold">{title}</div>
          <div className="text-xs text-gray-600 mt-1">{descriptions[type]}</div>
        </div>
        <div>
          <button onClick={onSelect} className="ml-4 px-3 py-1 border rounded text-sm">Seleccionar</button>
        </div>
      </div>
    </div>
  );
}
