import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

type MatrixDetailProps = { params: Promise<{ type: string }> };

const matrixInfo: Record<string, { title: string; description: string }> = {
  leopold: {
    title: 'Matriz de Leopold',
    description: 'La matriz clásica de EIA desarrollada en 1971. Utiliza magnitud (-10 a +10) e importancia (1 a 10) para evaluar impactos ambientales de forma rápida y visual.'
  },
  conesa: {
    title: 'Matriz de Conesa',
    description: 'Metodología española multicriterio con 10 atributos. Evalúa intensidad, extensión, momento, persistencia y más para clasificar impactos como irrelevantes, moderados, severos o críticos.'
  },
  battelle: {
    title: 'Sistema Battelle-Columbus',
    description: 'Sistema cuantitativo que usa Unidades de Importancia (UIP) y calidad ambiental (0-1) para análisis económico-ambiental detallado de proyectos.'
  }
};

export async function generateMetadata({ params }: MatrixDetailProps): Promise<Metadata> {
  const { type } = await params;
  const info = matrixInfo[type as keyof typeof matrixInfo];
  
  if (!info) {
    return {
      title: 'Matriz no encontrada',
    };
  }
  
  return {
    title: info.title,
    description: info.description,
    openGraph: {
      title: `${info.title} - EIA Matrix Studio`,
      description: info.description,
    },
  };
}

export default async function MatrixDetailPage({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  const matrixData: Record<string, any> = {
    leopold: {
      title: 'Matriz de Leopold',
      description: 'La matriz de Leopold es una herramienta clásica de evaluación de impacto ambiental desarrollada en 1971 por Luna Leopold y sus colaboradores del Servicio Geológico de EE.UU. (USGS).',
      formula: 'Significancia (S) = |Magnitud| × Importancia',
      references: [
        { title: 'Publicación original USGS (1971)', url: 'https://pubs.usgs.gov/circ/1971/0645/report.pdf' },
        { title: 'Guía práctica matriz Leopold', url: 'https://www.isotools.us/2023/07/20/matriz-leopold-de-causa-y-efecto-para-los-impactos-ambientales/' },
        { title: 'Análisis de causa y efecto', url: 'https://www.ecoembesthecircularcampus.com/matriz-de-leopold/' }
      ],
      explanation: {
        magnitud: 'Grado de alteración que produce la acción sobre el factor. Escala de -10 a +10 con signo (+ beneficioso, - perjudicial).',
        importancia: 'Peso relativo del factor en el conjunto del medio ambiente. Escala de 1 a 10 (1 = poca importancia, 10 = muy importante).',
        significancia: 'Resultado final que combina magnitud e importancia. Permite priorizar impactos.'
      },
      steps: [
        'Identificar acciones del proyecto por fase (preoperativa, operativa, cierre)',
        'Listar factores ambientales (físicos, bióticos, socioeconómicos)',
        'Crear matriz de interacciones acción × factor',
        'Asignar magnitud (-10 a +10) para cada interacción',
        'Asignar importancia (1 a 10) para cada interacción',
        'Calcular significancia S = |Magnitud| × Importancia',
        'Interpretar resultados y priorizar impactos'
      ],
      advantages: [
        'Metodología simple y fácil de entender',
        'Visualización clara en formato matricial',
        'Permite evaluación rápida',
        'Ideal para fines educativos',
        'Diferencia entre impactos positivos y negativos'
      ],
      limitations: [
        'Subjetividad en asignación de valores',
        'No considera interacciones entre impactos',
        'Limitada para proyectos muy complejos',
        'No incluye medidas de probabilidad',
        'Dificultad para comparar proyectos diferentes'
      ]
    },
    conesa: {
      title: 'Matriz de Conesa',
      description: 'Metodología española desarrollada por Vicente Conesa Fernández-Vítora que utiliza evaluación multicriterio con 10 atributos para mayor objetividad en la valoración de impactos.',
      formula: 'I = 3×IN + 2×EX + MO + PE + RV + SI + AC + EF + PR + MC',
      references: [
        { title: 'Métodos de Evaluación de Impacto Ambiental', url: 'https://www.researchgate.net/publication/280557688_Metodos_de_Evaluacion_de_Impacto_Ambiental_en_Colombia' },
        { title: 'Metodología Conesa aplicada', url: 'https://www.slideshare.net/slideshow/metodologia-conesa-paralaevalucionde/93381305' },
        { title: 'Guía técnica de evaluación (IDB)', url: 'https://idbinvest.org/sites/default/files/2022-04/PAGA%20UF0%20CAP%2004%20-%20EVALUACI%C3%93N%20IMPACTOS.pdf' }
      ],
      explanation: {
        criteria: 'IN (Intensidad), EX (Extensión), MO (Momento), PE (Persistencia), RV (Reversibilidad), SI (Sinergia), AC (Acumulación), EF (Efecto), PR (Periodicidad), MC (Recuperabilidad)',
        calculation: 'Cada criterio se evalúa en escalas específicas y se pondera según la fórmula',
        categories: 'Irrelevante (<25), Moderado (25-49), Severo (50-74), Crítico (≥75)'
      },
      steps: [
        'Identificar acciones y factores ambientales',
        'Evaluar cada interacción con 10 criterios',
        'IN: Grado de incidencia (1, 2, 4, 8, 12)',
        'EX: Área de influencia (1, 2, 4, 8) + zona crítica',
        'Aplicar fórmula de cálculo I = 3×IN + 2×EX + ...',
        'Categorizar impactos según valor I',
        'Proponer medidas según categoría'
      ],
      advantages: [
        'Mayor objetividad y detalle',
        'Considera múltiples aspectos del impacto',
        'Categorización clara de impactos',
        'Ampliamente aceptada en España',
        'Permite justificación técnica robusta'
      ],
      limitations: [
        'Más compleja de aplicar',
        'Requiere mayor tiempo y conocimiento',
        'Posible sobrecomplicación para proyectos simples',
        'Subjetividad en algunos criterios',
        'Necesita experiencia para aplicar correctamente'
      ]
    },
    battelle: {
      title: 'Sistema Battelle-Columbus',
      description: 'Sistema cuantitativo desarrollado por el Instituto Battelle-Columbus para evaluación objetiva mediante parámetros ambientales con Unidades de Impacto Ambiental (UIA).',
      formula: 'UIA = UIP × (Calidad_con_proyecto - Calidad_sin_proyecto)',
      references: [
        { title: 'Sistema de Evaluación Ambiental Battelle', url: 'https://uon.sdsu.edu/el_sea_de_battelle.html' },
        { title: 'EIA Methodology - Battelle Approach', url: 'https://ebooks.inflibnet.ac.in/esp12/chapter/eia-methodology/' },
        { title: 'The Battelle Environmental Evaluation System', url: 'https://uon.sdsu.edu/the_battelle_ees.html' }
      ],
      explanation: {
        uip: 'Unidades de Importancia del Parámetro: peso relativo (0-1), suma total = 1',
        quality: 'Calidad ambiental: valor de 0 a 1 (0 = mínima calidad, 1 = máxima calidad)',
        uia: 'Unidades de Impacto Ambiental: resultado que puede ser positivo o negativo'
      },
      steps: [
        'Seleccionar parámetros ambientales relevantes',
        'Asignar UIP (pesos) a cada parámetro',
        'Verificar que suma de UIP = 1',
        'Evaluar calidad sin proyecto (0-1)',
        'Evaluar calidad con proyecto (0-1)',
        'Calcular UIA para cada parámetro',
        'Sumar UIA total y analizar por categorías'
      ],
      advantages: [
        'Enfoque completamente cuantitativo',
        'Permite comparación económica',
        'Resultados objetivos y replicables',
        'Ideal para análisis de alternativas',
        'Agregación por categorías ambientales'
      ],
      limitations: [
        'Requiere datos cuantitativos precisos',
        'Dificultad para valorar aspectos cualitativos',
        'Complejidad en asignación de UIP',
        'Necesita expertise técnico especializado',
        'Posible pérdida de información cualitativa'
      ]
    }
  };

  const matrix = matrixData[type];
  if (!matrix) return notFound();

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-primary mb-4">{matrix.title}</h1>
        <p className="text-xl text-gray-700 max-w-3xl mx-auto">{matrix.description}</p>
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-4">Fórmula principal</h2>
        <div className="bg-white rounded-lg p-6 text-center">
          <code className="text-2xl font-mono text-primary">{matrix.formula}</code>
        </div>
        <div className="mt-6 grid gap-4">
          {Object.entries(matrix.explanation).map(([key, value]) => (
            <div key={key} className="bg-white rounded-lg p-4">
              <div className="font-semibold capitalize mb-2">{key.replace(/([A-Z])/g, ' $1')}</div>
              <p className="text-gray-700">{value as string}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold text-green-700 mb-4">✓ Ventajas</h3>
          <ul className="space-y-2">
            {matrix.advantages.map((advantage: string, index: number) => (
              <li key={index} className="flex items-start">
                <span className="text-green-500 mr-2 mt-1">•</span>
                <span>{advantage}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold text-orange-700 mb-4">⚠ Limitaciones</h3>
          <ul className="space-y-2">
            {matrix.limitations.map((limitation: string, index: number) => (
              <li key={index} className="flex items-start">
                <span className="text-orange-500 mr-2 mt-1">•</span>
                <span>{limitation}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-8">
        <h3 className="text-2xl font-bold mb-6">Proceso paso a paso</h3>
        <div className="grid gap-4">
          {matrix.steps.map((step: string, index: number) => (
            <div key={index} className="flex items-start border-l-4 border-primary pl-4 py-2">
              <span className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center text-sm mr-4 flex-shrink-0">
                {index + 1}
              </span>
              <span className="text-gray-700">{step}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Referencias académicas y técnicas */}
      {matrix.references && matrix.references.length > 0 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/>
            </svg>
            Referencias y documentación técnica
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Consulta estas fuentes académicas y técnicas para profundizar en la metodología:
          </p>
          <ul className="space-y-3">
            {matrix.references.map((ref: any, index: number) => (
              <li key={index} className="flex items-start">
                <svg className="w-4 h-4 mr-2 mt-1 text-primary flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                </svg>
                <a 
                  href={ref.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:text-blue-700 hover:underline text-sm"
                >
                  {ref.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="bg-gradient-to-r from-primary to-accent text-white rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">¿Listo para aplicar {matrix.title}?</h2>
        <p className="text-lg mb-6">Elige un caso de estudio para ver cómo se aplica esta matriz paso a paso</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href={`/matrices/${type}/casos`}
            className="inline-block bg-white text-primary px-8 py-3 rounded-lg text-lg font-semibold hover:shadow-lg transition-shadow"
          >
            Siguiente: Elegir caso de estudio →
          </Link>
          <Link 
            href="/faq"
            className="inline-block bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-white hover:text-primary transition-colors"
          >
            ¿Dudas? Ver FAQ
          </Link>
        </div>
      </div>
    </div>
  );
}
