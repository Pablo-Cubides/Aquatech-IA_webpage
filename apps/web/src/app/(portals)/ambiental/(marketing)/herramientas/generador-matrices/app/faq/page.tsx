import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Preguntas Frecuentes sobre Evaluación de Impacto Ambiental - FAQ',
  description: 'Respuestas a las dudas más comunes sobre matrices de Leopold, Conesa y Battelle-Columbus. Guía completa de metodologías EIA para estudiantes y profesionales.',
  keywords: ['FAQ EIA', 'preguntas frecuentes impacto ambiental', 'matriz leopold dudas', 'metodo conesa explicado', 'battelle columbus preguntas', 'guia evaluacion ambiental'],
  openGraph: {
    title: 'FAQ - Preguntas Frecuentes sobre Evaluación de Impacto Ambiental',
    description: 'Todas las respuestas sobre matrices Leopold, Conesa y Battelle-Columbus en un solo lugar',
  },
};

export default function FAQPage() {
  const faqCategories = [
    {
      category: 'Matriz de Leopold',
      icon: '🌲',
      color: 'from-green-500 to-emerald-600',
      questions: [
        {
          q: '¿Qué es la matriz de Leopold y para qué sirve?',
          a: (
            <>
              <p className="mb-3">
                La Matriz de Leopold es una herramienta metodológica para la evaluación del impacto ambiental, presentada en 1971 
                por <strong>Luna Leopold</strong> y sus colegas del <a href="https://pubs.usgs.gov/circ/1971/0645/report.pdf" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Servicio Geológico de EE. UU. (USGS)</a>.
              </p>
              <p className="mb-3">
                Su propósito principal es servir como un sistema de análisis para identificar de manera sistemática las posibles 
                interacciones de causa y efecto entre las acciones de un proyecto y los diversos componentes del medio ambiente. 
                Funciona como un cuadro de doble entrada que sirve como una lista de verificación para asegurar que no se omitan 
                impactos potenciales durante una evaluación preliminar.
              </p>
              <p>
                Es una <a href="https://www.isotools.us/2023/07/20/matriz-leopold-de-causa-y-efecto-para-los-impactos-ambientales/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">herramienta fundamental para la gestión ambiental</a>, ya que ayuda a los evaluadores a tomar decisiones informadas en las primeras etapas de la planificación de un proyecto.
              </p>
            </>
          )
        },
        {
          q: '¿Cómo se elabora una matriz de Leopold paso a paso?',
          a: (
            <>
              <p className="mb-3 font-semibold">La elaboración de una Matriz de Leopold sigue un procedimiento estructurado:</p>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li><strong>Identificar Acciones y Factores:</strong> Se listan todas las actividades principales del proyecto en el eje de las columnas y los factores ambientales (físicos, biológicos, socioeconómicos) que podrían ser afectados en el eje de las filas.</li>
                <li><strong>Marcar Interacciones:</strong> En cada celda donde se presuma que una acción pueda impactar un factor, se traza una línea diagonal. Estas cuadrículas marcadas representan las interacciones a considerar.</li>
                <li><strong>Evaluar Magnitud:</strong> Para cada celda marcada, se asigna un valor numérico de 1 a 10 en la esquina superior izquierda, que indica el grado, extensión o escala de la alteración. Este valor va precedido de un signo positivo (+) si el impacto es beneficioso o negativo (-) si es perjudicial.</li>
                <li><strong>Evaluar Importancia:</strong> En la esquina inferior derecha de la misma celda, se asigna un valor de 1 a 10 que representa el peso relativo o la relevancia de dicho impacto para el proyecto.</li>
                <li><strong>Análisis y Resumen:</strong> Se realiza un análisis de los resultados, a menudo multiplicando magnitud por importancia y sumando los valores por filas y columnas para identificar las acciones más críticas y los factores más vulnerables.</li>
              </ol>
              <p className="mt-3">
                Este proceso debe ir acompañado de un informe narrativo que justifique las valoraciones. 
                Puedes consultar más detalles en <a href="https://www.ecoembesthecircularcampus.com/matriz-de-leopold/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">esta guía práctica</a>.
              </p>
            </>
          )
        },
        {
          q: '¿Cuáles son las ventajas y desventajas de la matriz de Leopold?',
          a: (
            <>
              <div className="mb-4">
                <p className="font-semibold text-green-700 mb-2">✓ Ventajas:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li><strong>Sencillez y Bajo Costo:</strong> Es un método fácil de entender y aplicar, que no requiere recursos computacionales complejos.</li>
                  <li><strong>Exhaustividad:</strong> Obliga a considerar una amplia gama de interacciones posibles, sirviendo como una lista de verificación completa.</li>
                  <li><strong>Comunicación Visual:</strong> Presenta los resultados de forma gráfica y clara, facilitando la comunicación de los principales impactos.</li>
                  <li><strong>Flexibilidad:</strong> Es aplicable a casi cualquier tipo de proyecto que pueda afectar al medio ambiente.</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-orange-700 mb-2">⚠ Desventajas:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li><strong>Alta Subjetividad:</strong> La asignación de valores de magnitud e importancia depende en gran medida del juicio del evaluador, lo que puede introducir sesgos.</li>
                  <li><strong>No considera Impactos Indirectos:</strong> La estructura matricial simple no representa adecuadamente las cadenas de efectos o los impactos secundarios y terciarios.</li>
                  <li><strong>Atemporalidad:</strong> No distingue inherentemente entre impactos a corto, mediano y largo plazo.</li>
                </ul>
              </div>
            </>
          )
        }
      ]
    },
    {
      category: 'Metodología de Conesa',
      icon: '⚖️',
      color: 'from-yellow-500 to-orange-600',
      questions: [
        {
          q: '¿En qué consiste la metodología de Conesa para la EIA?',
          a: (
            <>
              <p className="mb-3">
                La metodología de Conesa, desarrollada por <strong>Vicente Conesa Fernández-Vítora</strong>, es un método analítico 
                y cualitativo estructurado para la evaluación de impacto ambiental. Se basa en una matriz causa-efecto, pero profundiza 
                la valoración de cada impacto a través de un conjunto de <strong>once criterios definidos</strong> (como intensidad, extensión, 
                persistencia, reversibilidad, etc.).
              </p>
              <p className="mb-3">
                El objetivo es guiar el juicio del evaluador a través de un marco analítico, asignando valores a cada criterio para luego 
                calcular un índice de "Importancia" del impacto mediante una fórmula ponderada.
              </p>
              <p>
                Consulta <a href="https://www.researchgate.net/publication/280557688_Metodos_de_Evaluacion_de_Impacto_Ambiental_en_Colombia" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">este estudio académico</a> y 
                la <a href="https://idbinvest.org/sites/default/files/2022-04/PAGA%20UF0%20CAP%2004%20-%20EVALUACI%C3%93N%20IMPACTOS.pdf" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">guía técnica del IDB</a> para más detalles.
              </p>
            </>
          )
        },
        {
          q: '¿Cómo se calcula la importancia de un impacto según Conesa?',
          a: (
            <>
              <p className="mb-3">
                La importancia (I) de un impacto se calcula aplicando una fórmula que pondera los valores asignados a diez de los once criterios de evaluación:
              </p>
              <div className="bg-gray-100 rounded-lg p-4 mb-3 font-mono text-sm">
                I = ±(3×IN + 2×EX + MO + PE + RV + SI + AC + EF + PR + MC)
              </div>
              <p className="mb-3 font-semibold">Donde cada sigla corresponde a un criterio valorado numéricamente:</p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                <li><strong>IN:</strong> Intensidad (grado de incidencia)</li>
                <li><strong>EX:</strong> Extensión (área de influencia)</li>
                <li><strong>MO:</strong> Momento (plazo de manifestación)</li>
                <li><strong>PE:</strong> Persistencia (duración del efecto)</li>
                <li><strong>RV:</strong> Reversibilidad (capacidad de retorno natural)</li>
                <li><strong>SI:</strong> Sinergia (efecto combinado)</li>
                <li><strong>AC:</strong> Acumulación (incremento progresivo del efecto)</li>
                <li><strong>EF:</strong> Efecto (directo o indirecto)</li>
                <li><strong>PR:</strong> Periodicidad (regularidad de la manifestación)</li>
                <li><strong>MC:</strong> Recuperabilidad (posibilidad de restauración con intervención humana)</li>
              </ul>
              <p className="mt-3">
                El resultado numérico, que puede ir de 13 a 100, se clasifica en categorías como <strong>Irrelevante, Moderado, Severo o Crítico</strong>. 
                Revisa <a href="https://www.slideshare.net/slideshow/metodologia-conesa-paralaevalucionde/93381305" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">esta presentación técnica</a> para ejemplos detallados.
              </p>
            </>
          )
        },
        {
          q: '¿Qué es el método de Conesa simplificado?',
          a: (
            <>
              <p className="mb-3">
                El "método de Conesa simplificado" es una adaptación de la metodología original que se utiliza a menudo en la práctica 
                para agilizar la evaluación, especialmente en obras civiles de pequeña escala.
              </p>
              <p className="mb-3">
                La principal diferencia no radica en los criterios utilizados (generalmente se mantienen los mismos 10 u 11 atributos), 
                sino en la <strong>profundidad del análisis</strong> que los sustenta. Mientras que el método completo implica un estudio 
                exhaustivo para justificar cada valoración, la versión simplificada aplica los criterios y la fórmula de una manera más directa.
              </p>
              <p>
                Sin embargo, para proyectos de gran envergadura o con alta sensibilidad ambiental, se recomienda siempre utilizar la 
                metodología completa tal como se describe en la "Guía Metodológica para la evaluación del impacto ambiental".
              </p>
            </>
          )
        }
      ]
    },
    {
      category: 'Método Battelle-Columbus',
      icon: '🔬',
      color: 'from-blue-500 to-indigo-600',
      questions: [
        {
          q: '¿Qué es el sistema de evaluación ambiental de Battelle-Columbus?',
          a: (
            <>
              <p className="mb-3">
                El Sistema de Evaluación Ambiental (EES) de Battelle-Columbus es una metodología cuantitativa desarrollada en los años 70 
                para la EIA, diseñada originalmente para proyectos de recursos hídricos. Su enfoque se basa en una estructura jerárquica del 
                medio ambiente que incluye <strong>4 categorías, 18 componentes y 78 parámetros predefinidos</strong>.
              </p>
              <p className="mb-3">
                Utiliza "funciones de valor" para convertir mediciones de campo en un índice de calidad ambiental (de 0 a 1) y pondera 
                cada parámetro según su importancia relativa para obtener un puntaje final en "Unidades de Impacto Ambiental" (UIA).
              </p>
              <p>
                Consulta <a href="https://uon.sdsu.edu/the_battelle_ees.html" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">la documentación completa del sistema</a> y 
                <a href="https://ebooks.inflibnet.ac.in/esp12/chapter/eia-methodology/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline"> este libro técnico sobre la metodología</a>.
              </p>
            </>
          )
        },
        {
          q: '¿Cómo funcionan las Unidades de Impacto Ambiental (UIA)?',
          a: (
            <>
              <p className="mb-3">
                Las Unidades de Impacto Ambiental (UIA) son el resultado final del método Battelle-Columbus y permiten una medición cuantitativa del impacto. 
                El cálculo se realiza con la siguiente fórmula para cada parámetro:
              </p>
              <div className="bg-gray-100 rounded-lg p-4 mb-3 font-mono text-sm">
                UIA = (CA)ᵢ × (UIP)ᵢ
              </div>
              <p className="mb-3">Donde:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li><strong>(CA)ᵢ:</strong> Es el Índice de Calidad Ambiental del parámetro, un valor entre 0 y 1 obtenido a partir de gráficos 
                (funciones de valor) que traducen la medición real del parámetro (ej. mg/L de Oxígeno Disuelto) a una escala de calidad.</li>
                <li><strong>(UIP)ᵢ:</strong> Son las Unidades de Importancia del Parámetro, un índice ponderal predefinido que refleja la importancia 
                relativa de cada parámetro en la calidad ambiental general.</li>
              </ul>
              <p className="mt-3">
                El impacto neto del proyecto se calcula como la diferencia entre la suma total de UIA "con proyecto" y la suma total "sin proyecto". 
                Más información en <a href="https://uon.sdsu.edu/el_sea_de_battelle.html" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">este recurso académico</a>.
              </p>
            </>
          )
        }
      ]
    },
    {
      category: 'Comparativas y Aplicaciones',
      icon: '📊',
      color: 'from-purple-500 to-pink-600',
      questions: [
        {
          q: '¿Cuál es la diferencia entre la Matriz de Leopold y la de Conesa?',
          a: (
            <>
              <p className="mb-3 font-semibold">La diferencia fundamental radica en su objetivo y nivel de detalle:</p>
              <div className="grid md:grid-cols-2 gap-4 mb-3">
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-bold text-green-800 mb-2">🌲 Matriz de Leopold (1971)</h4>
                  <p className="text-sm">Se enfoca en la <strong>identificación de relaciones causa-efecto</strong>. Es un método cualitativo que 
                  permite una primera aproximación para saber dónde se producirán los impactos, pero su valoración de magnitud e importancia es 
                  altamente subjetiva.</p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4">
                  <h4 className="font-bold text-yellow-800 mb-2">⚖️ Matriz de Conesa (1997)</h4>
                  <p className="text-sm">Va un paso más allá y se centra en asignar una <strong>"Importancia" estructurada</strong> a cada impacto. 
                  Aunque también es cualitativo, obliga al evaluador a analizar cada interacción a través de once criterios específicos.</p>
                </div>
              </div>
              <p>
                En resumen: mientras Leopold <strong>identifica qué impactos pueden ocurrir</strong>, Conesa ofrece un sistema para 
                <strong> valorar cuán importantes son esos impactos</strong> de una manera más rigurosa.
              </p>
            </>
          )
        },
        {
          q: '¿Cómo interpretar una matriz de impacto ambiental?',
          a: (
            <>
              <p className="mb-3">Interpretar una matriz de impacto ambiental implica analizar los resultados para identificar los problemas clave y priorizar las acciones de mitigación:</p>
              <ol className="list-decimal list-inside space-y-2 ml-4">
                <li><strong>Análisis por Columnas (Acciones):</strong> Sumar las puntuaciones de cada columna para identificar qué actividades del proyecto generan los impactos más significativos (positivos o negativos).</li>
                <li><strong>Análisis por Filas (Factores):</strong> Sumar las puntuaciones de cada fila para determinar qué componentes del medio ambiente son los más vulnerables o afectados por el proyecto.</li>
                <li><strong>Identificación de "Puntos Calientes":</strong> Buscar las celdas individuales con las puntuaciones más altas (en valor absoluto) para señalar las interacciones más críticas que requieren atención inmediata.</li>
                <li><strong>Balance General:</strong> Evaluar la suma total de todos los impactos para obtener una visión general de si el proyecto tiene un balance ambiental neto positivo o negativo.</li>
              </ol>
            </>
          )
        }
      ]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center">
        <span className="text-6xl mb-4 block">❓</span>
        <h1 className="text-4xl font-bold mb-4">Preguntas Frecuentes</h1>
        <p className="text-xl text-gray-700 max-w-3xl mx-auto">
          Encuentra respuestas a las dudas más comunes sobre metodologías de Evaluación de Impacto Ambiental: 
          Leopold, Conesa y Battelle-Columbus
        </p>
      </div>

      {/* FAQ Categories */}
      {faqCategories.map((cat, catIndex) => (
        <div key={catIndex} className="space-y-6">
          {/* Category Header */}
          <div className={`bg-gradient-to-r ${cat.color} text-white rounded-lg p-6`}>
            <h2 className="text-3xl font-bold flex items-center">
              <span className="text-4xl mr-3">{cat.icon}</span>
              {cat.category}
            </h2>
          </div>

          {/* Questions */}
          <div className="space-y-4">
            {cat.questions.map((faq, faqIndex) => (
              <details key={faqIndex} className="bg-white rounded-lg shadow-md overflow-hidden group">
                <summary className="cursor-pointer p-6 hover:bg-gray-50 transition-colors list-none">
                  <div className="flex items-start justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 pr-8">{faq.q}</h3>
                    <svg className="w-6 h-6 text-gray-400 flex-shrink-0 transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </summary>
                <div className="px-6 pb-6 text-gray-700 leading-relaxed border-t border-gray-100 pt-4">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      ))}

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary to-accent text-white rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">¿Listo para aplicar estas metodologías?</h2>
        <p className="text-lg mb-6">Explora nuestras herramientas interactivas y casos de estudio</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/matrices"
            className="inline-block bg-white text-primary px-8 py-3 rounded-lg text-lg font-semibold hover:shadow-lg transition-shadow"
          >
            Ver Matrices
          </Link>
          <Link 
            href="/selector"
            className="inline-block bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-white hover:text-primary transition-colors"
          >
            Selector de Matriz
          </Link>
          <Link 
            href="/casos"
            className="inline-block bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-white hover:text-primary transition-colors"
          >
            Casos de Estudio
          </Link>
        </div>
      </div>

      {/* Back to home */}
      <div className="text-center">
        <Link href="/" className="text-primary hover:underline inline-flex items-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
