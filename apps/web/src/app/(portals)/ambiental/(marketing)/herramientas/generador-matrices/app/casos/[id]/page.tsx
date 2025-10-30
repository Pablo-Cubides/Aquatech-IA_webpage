import React from 'react';
import { notFound } from 'next/navigation';

export default function CasoPage({ params }: any) {
  const { id } = (params as any) as { id: string };
  const examples: Record<string, any> = {
    'vias': { nombre: 'Vía regional', sector: 'Infraestructura', desc: 'Tramo vial 20 km' },
    'mineria': { nombre: 'Mina', sector: 'Minería', desc: 'Mina a rajo abierto' }
  };
  const c = examples[id];
  if (!c) return notFound();

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold">{c.nombre}</h2>
      <p className="mb-4">Sector: {c.sector}</p>
      <p className="mb-6">{c.desc}</p>
      <div className="flex gap-4">
        <a className="border px-4 py-2 rounded" href={`/builder/${id}/leopold`}>Construir (Leopold)</a>
        <a className="border px-4 py-2 rounded" href={`/builder/${id}/conesa`}>Construir (Conesa)</a>
        <a className="border px-4 py-2 rounded" href={`/builder/${id}/battelle`}>Construir (Battelle)</a>
      </div>
    </div>
  );
}
