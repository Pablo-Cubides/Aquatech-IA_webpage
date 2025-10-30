import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

type MatrixCasesProps = { params: Promise<{ type: string }> };

const matrixTitles: Record<string, string> = {
  leopold: 'Leopold',
  conesa: 'Conesa', 
  battelle: 'Battelle-Columbus'
};

export async function generateMetadata({ params }: MatrixCasesProps): Promise<Metadata> {
  const { type } = await params;
  const matrixName = matrixTitles[type as keyof typeof matrixTitles] || 'Matriz';
  
  return {
    title: `Casos de Estudio - Matriz ${matrixName}`,
    description: `Explora casos de estudio reales para aplicar la matriz ${matrixName}: infraestructura, minería, ecoturismo y energía. Aprende con ejemplos prácticos.`,
    openGraph: {
      title: `Casos de Estudio - Matriz ${matrixName}`,
      description: `Casos de estudio reales para la matriz ${matrixName}`,
    },
  };
}

export default async function MatrixCasesPage({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  const matrixTitles: Record<string, string> = {
    leopold: 'Leopold',
    conesa: 'Conesa', 
    battelle: 'Battelle-Columbus'
  };

  const matrix = matrixTitles[type];
  if (!matrix) return notFound();

  const cases = [
    {
      id: 'vias',
      nombre: 'Construcción de vía regional',
      sector: 'Infraestructura',
      descripcion: 'Construcción de 25 km de vía secundaria que conecta dos municipios, incluyendo 3 puentes menores y obras de drenaje.',
      factoresSensibles: ['Cuencas hidrográficas', 'Comunidades rurales', 'Cobertura vegetal'],
      duracion: '18 meses',
      complejidad: 'Media',
      tipicalMatrix: ['leopold', 'conesa'],
      whyGoodFor: {
        leopold: 'Proyecto lineal con impactos claros y localizados. Ideal para demostrar evaluación rápida.',
        conesa: 'Permite análisis detallado de impactos en múltiples medios (agua, suelo, social).',
        battelle: 'Aplicable pero puede ser excesivo para este tipo de proyecto.'
      }
    },
    {
      id: 'mineria',
      nombre: 'Mina de carbón a rajo abierto', 
      sector: 'Minería',
      descripcion: 'Explotación minera de carbón térmico con capacidad de 2 millones ton/año, incluye área industrial, botaderos y vías de acceso.',
      factoresSensibles: ['Calidad del aire', 'Aguas subterráneas', 'Paisaje', 'Comunidades étnicas'],
      duracion: '25 años',
      complejidad: 'Alta',
      tipicalMatrix: ['conesa', 'battelle'],
      whyGoodFor: {
        leopold: 'Útil para identificación inicial, pero limitada para la complejidad del proyecto.',
        conesa: 'Excelente para evaluar múltiples criterios y categorizar impactos críticos.',
        battelle: 'Ideal para análisis cuantitativo detallado y comparación de alternativas.'
      }
    },
    {
      id: 'hidroelectrica',
      nombre: 'Central hidroeléctrica',
      sector: 'Energía', 
      descripcion: 'Construcción de central hidroeléctrica de 150 MW con embalse de 800 ha, túneles de conducción y líneas de transmisión.',
      factoresSensibles: ['Ecosistemas acuáticos', 'Comunidades ribereñas', 'Patrimonio cultural'],
      duracion: '30 años',
      complejidad: 'Muy alta',
      tipicalMatrix: ['conesa', 'battelle'],
      whyGoodFor: {
        leopold: 'Insuficiente para capturar la complejidad de impactos acumulativos.',
        conesa: 'Muy adecuada para evaluar impactos múltiples y sinérgicos.',
        battelle: 'Excelente para análisis económico-ambiental y optimización.'
      }
    },
    {
      id: 'ecoturismo',
      nombre: 'Complejo ecoturístico',
      sector: 'Turismo',
      descripcion: 'Desarrollo ecoturístico con 50 cabañas, senderos interpretativos, centro de visitantes y actividades de observación.',
      factoresSensibles: ['Fauna silvestre', 'Comunidades locales', 'Recursos hídricos'],
      duracion: '20 años', 
      complejidad: 'Baja-Media',
      tipicalMatrix: ['leopold', 'conesa'],
      whyGoodFor: {
        leopold: 'Perfecta para proyectos con impactos principalmente positivos y negativos balanceados.',
        conesa: 'Permite evaluar criterios sociales y ambientales en detalle.',
        battelle: 'Puede ser excesiva, aunque útil para análisis económico del turismo.'
      }
    }
  ];

  // Filter cases that are good for this matrix type
  const recommendedCases = cases.filter(c => 
    c.tipicalMatrix.includes(type) || 
    c.whyGoodFor[type as keyof typeof c.whyGoodFor]?.includes('Excelente') ||
    c.whyGoodFor[type as keyof typeof c.whyGoodFor]?.includes('Ideal') ||
    c.whyGoodFor[type as keyof typeof c.whyGoodFor]?.includes('Muy adecuada')
  );

  const otherCases = cases.filter(c => !recommendedCases.includes(c));

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Casos para Matriz de {matrix}</h1>
        <p className="text-lg text-gray-700">
          Elige un caso de estudio para ver cómo aplicar la matriz de {matrix} paso a paso
        </p>
      </div>

      {recommendedCases.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-green-700 mb-6">✅ Casos recomendados para {matrix}</h2>
          <div className="grid gap-6">
            {recommendedCases.map(caso => (
              <div key={caso.id} className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-green-500">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold mb-2">{caso.nombre}</h3>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      {caso.sector}
                    </span>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    <div>Duración: {caso.duracion}</div>
                    <div>Complejidad: {caso.complejidad}</div>
                  </div>
                </div>

                <p className="text-gray-700 mb-4">{caso.descripcion}</p>

                <div className="mb-4">
                  <h4 className="font-semibold mb-2">Factores ambientales sensibles:</h4>
                  <div className="flex flex-wrap gap-2">
                    {caso.factoresSensibles.map((factor, i) => (
                      <span key={i} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                        {factor}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                  <h4 className="font-semibold text-blue-800 mb-2">¿Por qué es ideal para {matrix}?</h4>
                  <p className="text-blue-700 text-sm">
                    {caso.whyGoodFor[type as keyof typeof caso.whyGoodFor]}
                  </p>
                </div>

                <div className="flex gap-4">
                  <Link 
                    href={`/builder/${caso.id}/${type}`}
                    className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex-1 text-center"
                  >
                    Construir matriz de {matrix} →
                  </Link>
                  <Link
                    href={`/casos/${caso.id}`}
                    className="border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Ver detalles del caso
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {otherCases.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold text-gray-700 mb-6">Otros casos disponibles</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {otherCases.map(caso => (
              <div key={caso.id} className="bg-white rounded-lg shadow p-4 border">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold">{caso.nombre}</h3>
                  <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
                    {caso.sector}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-3">{caso.descripcion}</p>

                <div className="bg-orange-50 p-3 rounded mb-3">
                  <p className="text-orange-700 text-xs">
                    {caso.whyGoodFor[type as keyof typeof caso.whyGoodFor]}
                  </p>
                </div>

                <div className="flex gap-2">
                  <Link 
                    href={`/builder/${caso.id}/${type}`}
                    className="bg-gray-600 text-white px-4 py-2 rounded text-sm hover:bg-gray-700 transition-colors flex-1 text-center"
                  >
                    Probar con {matrix}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-gray-50 rounded-lg p-6 text-center">
        <h3 className="font-bold text-lg mb-2">¿No encuentras el caso que buscas?</h3>
        <p className="text-gray-600 mb-4">Puedes crear tu propio caso personalizado o explorar otras matrices</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/admin" className="border px-4 py-2 rounded hover:bg-white transition-colors">
            Crear caso personalizado
          </Link>
          <Link href="/faq" className="bg-purple-100 text-purple-700 border border-purple-300 px-4 py-2 rounded hover:bg-purple-200 transition-colors">
            ❓ Ver preguntas frecuentes
          </Link>
          <Link href="/matrices" className="text-primary hover:underline px-4 py-2">
            ← Volver a tipos de matrices
          </Link>
        </div>
      </div>
    </div>
  );
}
