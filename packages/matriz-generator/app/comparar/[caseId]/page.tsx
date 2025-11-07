import LeopoldGrid from '@components/LeopoldGrid';
import LeopoldMatrix from '@components/LeopoldMatrix';
import ConesaForm from '@components/ConesaForm';
import BattelleTable from '@components/BattelleTable';
import { ImpactoBase } from '@types/index';

const sampleCases = [
  { id: 'vias', sector: 'Infraestructura', nombre: 'Construcción de Vía Regional', descripcion: 'Construcción de tramo vial', matrices: ['leopold', 'conesa', 'battelle'] },
  { id: 'mineria', sector: 'Minería', nombre: 'Mina a Rajo Abierto', descripcion: 'Proyecto minero', matrices: ['battelle', 'leopold', 'conesa'] }
];

export default async function Comparar({ params }: { params: Promise<{ caseId: string }> }) {
  const { caseId } = await params;
  const caso = sampleCases.find((c: any) => c.id === caseId);
  
  if (!caso) {
    return <div className="max-w-6xl mx-auto p-6">Caso no encontrado</div>;
  }

  // Generar impactos de ejemplo basados en el caso
  const impactosEjemplo: ImpactoBase[] = [
    { id: 'imp1', actionId: 'act1', factorId: 'fac1', signo: '-' },
    { id: 'imp2', actionId: 'act2', factorId: 'fac2', signo: '+' },
    { id: 'imp3', actionId: 'act3', factorId: 'fac3', signo: '-' },
    { id: 'imp4', actionId: 'act4', factorId: 'fac4', signo: '+' },
    { id: 'imp5', actionId: 'act5', factorId: 'fac5', signo: '-' }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <a href={`/builder/${caseId}/leopold`} className="text-primary hover:underline">
            ← Volver al constructor
          </a>
        </div>
        
        <h1 className="text-3xl font-bold mb-2">Comparación de Matrices</h1>
        <h2 className="text-xl text-gray-700 mb-4">Caso: {caso.nombre}</h2>
        
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">📊 Vista Comparativa</h3>
          <p className="text-sm text-blue-800">
            Análisis simultáneo de los mismos impactos evaluados con las tres metodologías principales.
            Observa cómo cada método prioriza diferentes aspectos y criterios de evaluación.
          </p>
        </div>
      </div>

      {/* Comparación en 3 columnas */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Leopold Matrix */}
        <div className="bg-white border-2 border-green-200 rounded-lg">
          <div className="bg-green-100 px-6 py-4 border-b border-green-200">
            <h3 className="text-lg font-bold text-green-800">🌲 Matriz Leopold</h3>
            <p className="text-sm text-green-700">Enfoque: Magnitud × Importancia</p>
          </div>
          <div className="p-6">
            <LeopoldMatrix impactos={impactosEjemplo} />
          </div>
        </div>

        {/* Conesa Matrix */}
        <div className="bg-white border-2 border-yellow-200 rounded-lg">
          <div className="bg-yellow-100 px-6 py-4 border-b border-yellow-200">
            <h3 className="text-lg font-bold text-yellow-800">⚖️ Matriz Conesa</h3>
            <p className="text-sm text-yellow-700">Enfoque: Valoración multicriterio (10 atributos)</p>
          </div>
          <div className="p-6">
            <ConesaForm impactos={impactosEjemplo} />
          </div>
        </div>

        {/* Battelle Matrix */}
        <div className="bg-white border-2 border-blue-200 rounded-lg">
          <div className="bg-blue-100 px-6 py-4 border-b border-blue-200">
            <h3 className="text-lg font-bold text-blue-800">🔬 Battelle-Columbus</h3>
            <p className="text-sm text-blue-700">Enfoque: Unidades de Impacto (UIA)</p>
          </div>
          <div className="p-6">
            <BattelleTable impactos={impactosEjemplo} />
          </div>
        </div>

      </div>

      {/* Análisis comparativo */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4">🔍 Análisis Comparativo</h3>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded p-4 border">
            <h4 className="font-semibold text-green-800 mb-2">Leopold - Fortalezas</h4>
            <ul className="text-sm space-y-1">
              <li>• Visualización clara en matriz</li>
              <li>• Fácil identificación de impactos críticos</li>
              <li>• Metodología visual e intuitiva</li>
              <li>• Ideal para comparar alternativas</li>
            </ul>
          </div>

          <div className="bg-white rounded p-4 border">
            <h4 className="font-semibold text-yellow-800 mb-2">Conesa - Fortalezas</h4>
            <ul className="text-sm space-y-1">
              <li>• Análisis muy detallado (10 criterios)</li>
              <li>• Categorización clara de impactos</li>
              <li>• Ampliamente usado en España</li>
              <li>• Excelente para EIA oficiales</li>
            </ul>
          </div>

          <div className="bg-white rounded p-4 border">
            <h4 className="font-semibold text-blue-800 mb-2">Battelle - Fortalezas</h4>
            <ul className="text-sm space-y-1">
              <li>• Cuantificación precisa (UIA)</li>
              <li>• Análisis por categorías ambientales</li>
              <li>• Comparación objetiva de escenarios</li>
              <li>• Base científica sólida</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 bg-blue-100 rounded p-4">
          <h4 className="font-semibold text-blue-900 mb-2">💡 Recomendaciones para este caso:</h4>
          <div className="text-sm text-blue-800">
            <strong>{caso.nombre}:</strong> Para este tipo de proyecto se recomienda usar 
            <strong> {caso.matrices[0]} como método principal</strong> ya que se ajusta mejor 
            a las características del sector {caso.sector}. 
            Las otras matrices pueden usarse como métodos complementarios para validar resultados.
          </div>
        </div>
      </div>

      {/* Acciones */}
      <div className="mt-8 space-y-4">
        <div className="flex justify-center gap-4">
          <a 
            href={`/builder/${caseId}/leopold`} 
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            📊 Continuar con Leopold
          </a>
          <a 
            href={`/builder/${caseId}/conesa`} 
            className="bg-yellow-600 text-white px-6 py-3 rounded-lg hover:bg-yellow-700 transition-colors"
          >
            ⚖️ Continuar con Conesa
          </a>
          <a 
            href={`/builder/${caseId}/battelle`} 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            🔬 Continuar con Battelle
          </a>
        </div>
        
        <div className="flex justify-center">
          <a 
            href="/selector" 
            className="bg-purple-100 text-purple-700 border-2 border-purple-300 px-6 py-3 rounded-lg hover:bg-purple-200 transition-colors inline-flex items-center gap-2"
          >
            ❓ ¿Dudas sobre cuál metodología elegir? Ver FAQ
          </a>
        </div>
      </div>
    </div>
  );
}
