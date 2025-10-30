import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Casos de Estudio - Proyectos Reales de EIA',
  description: 'Explora casos de estudio reales: infraestructura vial, minería, ecoturismo y centrales hidroeléctricas. Aprende a aplicar matrices EIA con ejemplos prácticos del mundo real.',
  keywords: ['casos estudio EIA', 'proyectos ambientales', 'ejemplos matriz ambiental', 'estudios impacto'],
  openGraph: {
    title: 'Casos de Estudio - Proyectos Reales de EIA',
    description: 'Casos de estudio reales para aplicar matrices de evaluación ambiental',
  },
};

const sampleCases = [
  { id: 'vias', sector: 'Infraestructura', nombre: 'Vía regional', descripcion: 'Construcción de tramo vial', factoresSensibles: ['cuenca', 'comunidades'] },
  { id: 'mineria', sector: 'Minería', nombre: 'Mina a rajo abierto', descripcion: 'Proyecto minero', factoresSensibles: ['areas protegidas', 'agua'] }
];

export default function Casos() {
  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Catálogo de casos</h2>
      <div className="grid grid-cols-2 gap-4">
        {sampleCases.map(c => (
          <Link key={c.id} href={`/casos/${c.id}`} className="border p-4 rounded block">
            <h3 className="font-bold">{c.nombre}</h3>
            <p className="text-sm">{c.descripcion}</p>
            <div className="mt-2 text-xs">{c.factoresSensibles.map((f,i)=> <span key={i} className="inline-block bg-gray-100 px-2 py-1 mr-2 rounded">{f}</span>)}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
