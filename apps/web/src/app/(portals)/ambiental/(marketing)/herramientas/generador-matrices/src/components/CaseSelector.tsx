'use client';
import React from 'react';

export default function CaseSelector({ selectedMatrix }: { selectedMatrix: 'leopold'|'conesa'|'battelle' }) {
  const cases = [
    { id: 'vias', nombre: 'Vía regional', sector: 'Infraestructura' },
    { id: 'mineria', nombre: 'Mina a rajo abierto', sector: 'Minería' }
  ];

  return (
    <div>
      <label className="block text-xs font-medium">Caso</label>
      <div className="mt-2 space-y-2">
        {cases.map(c => (
          <div key={c.id} className="flex items-center justify-between border p-2 rounded">
            <div>
              <div className="font-medium">{c.nombre}</div>
              <div className="text-xs text-gray-600">{c.sector}</div>
            </div>
            <div>
              <a className="px-3 py-1 border rounded text-sm" href={`/builder/${c.id}/${selectedMatrix}`}>Ir a matriz</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
