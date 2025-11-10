'use client';
import React from 'react';
import Link from 'next/link';

export default function CaseSelector({ selectedMatrix }: { selectedMatrix: 'leopold'|'conesa'|'battelle' }) {
  const cases = [
    { id: 'vias', nombre: 'Vía regional', sector: 'Infraestructura' },
    { id: 'mineria', nombre: 'Mina a rajo abierto', sector: 'Minería' },
    { id: 'ecoturismo', nombre: 'Complejo ecoturístico', sector: 'Turismo' },
    { id: 'hidroelectrica', nombre: 'Central hidroeléctrica', sector: 'Energía' }
  ];

  return (
    <div>
      <label className="block text-xs font-medium mb-2">Caso de estudio</label>
      <div className="space-y-2">
        {cases.map(c => (
          <div key={c.id} className="flex items-center justify-between border p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div>
              <div className="font-medium text-sm">{c.nombre}</div>
              <div className="text-xs text-gray-600">{c.sector}</div>
            </div>
            <div>
              <Link 
                href={`/ambiental/herramientas/generador-matrices/builder/${c.id}/${selectedMatrix}`}
                className="px-4 py-2 bg-primary text-white rounded-lg text-sm hover:bg-primary/90 transition-colors"
              >
                Construir matriz
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
