import type { Metadata } from "next";
import Link from "next/link";
import HeaderAmbiental from "@/components/nav/HeaderAmbiental";
import FooterAmbiental from "@/components/nav/FooterAmbiental";

export const metadata: Metadata = {
  title: "Guías y Manuales Técnicos",
  description: "Manuales detallados y guías técnicas para el uso de herramientas de inteligencia artificial y gestión ambiental de AquatechIA.",
  alternates: {
    canonical: "/guia",
  },
  openGraph: {
    title: "Guías y Manuales Técnicos | AquatechIA",
    description: "Manuales detallados y guías técnicas para el uso de herramientas de inteligencia artificial y gestión ambiental de AquatechIA.",
    type: "website",
    url: "/guia",
  },
};

const Section = ({ title, children, icon }: { title: string; children: React.ReactNode; icon: string }) => (
  <section className="mb-16 scroll-mt-24" id={title.toLowerCase().replace(/\s+/g, "-")}>
    <div className="flex items-center gap-4 mb-6">
      <span className="text-4xl">{icon}</span>
      <h2 className="text-3xl font-bold text-gray-900 border-b-4 border-blue-500 pb-2">{title}</h2>
    </div>
    <div className="bg-white rounded-2xl shadow-xl shadow-blue-500/5 border border-gray-100 p-8">
      {children}
    </div>
  </section>
);

const IntegrationCard = ({ title, description, badge, color }: { title: string; description: string; badge: string; color: string }) => (
  <div className={`p-6 rounded-2xl border ${color} bg-white h-full hover:shadow-lg transition-all`}>
    <span className="text-xs font-bold uppercase tracking-wider mb-2 block opacity-70">{badge}</span>
    <h4 className="text-xl font-bold mb-2 text-gray-900">{title}</h4>
    <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
  </div>
);

export default function GuiaGeoVisorPage() {
  return (
    <>
      <HeaderAmbiental />
      <main className="min-h-screen bg-slate-50 flex-grow">
      {/* Hero Header - Reduced height */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-12 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        <div className="max-w-6xl mx-auto relative z-10 flex flex-col items-center text-center">
          <div className="animate-float mb-8">
            <img 
              src="/images/portal-ambiental/herramientas/geovisor.png" 
              alt="GeoVisor" 
              className="max-w-full h-auto max-h-[300px] drop-shadow-2xl"
            />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
              Manual de Uso de GeoVisor
            </h1>
            <p className="text-xl text-blue-50 max-w-2xl leading-relaxed mx-auto">
              Una herramienta diseñada para investigadores y profesionales ambientales. Construye, visualiza y comparte tus mapas de investigación de forma abierta y gratuita.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Navigation Sidebar */}
        <aside className="lg:col-span-1 border-r border-gray-200 pr-8 hidden lg:block h-fit sticky top-24">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Contenido</h3>
          <nav className="flex flex-col gap-3">
            <a href="#introduccion" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">📄 Introducción</a>
            <a href="#integraciones-globales" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">🌐 Integraciones</a>
            <a href="#guia-de-uso" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">🕹️ Guía de Uso</a>
            <a href="#tus-propios-datos" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">📊 Tus Datos</a>
            <a href="#codigo-abierto" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">💻 Código Abierto</a>
          </nav>
        </aside>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Section title="Introducción" icon="📄">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Visualización para la Ciencia Abierta</h3>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              <strong>GeoVisor</strong> nace de la necesidad de democratizar el acceso a la visualización geoespacial compleja. En muchas ocasiones, los investigadores cuentan con datos valiosos pero carecen de plataformas amigables para graficarlos y compartirlos con la comunidad.
            </p>
            <p className="text-gray-600 bg-blue-50 p-6 rounded-xl border border-blue-100">
              Nuestra meta es facilitar que cualquier profesional pueda <strong>construir, analizar y difundir</strong> sus hallazgos mediante mapas interactivos, permitiendo una mejor comprensión de los impactos ambientales y fomentando la colaboración científica sin barreras de costos.
            </p>
          </Section>

          <Section title="Integraciones Globales" icon="🌐">
            <p className="text-gray-700 mb-8">
              GeoVisor no solo permite cargar datos propios, sino que se conecta en tiempo real con las fuentes de datos ambientales más importantes del mundo:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <IntegrationCard 
                badge="Calidad del Aire"
                title="OpenAQ"
                description="Acceso a miles de estaciones de monitoreo oficiales en todo el mundo. Filtra por contaminantes como PM2.5, NO2, y O3."
                color="border-blue-100"
              />
              <IntegrationCard 
                badge="Eventos Naturales"
                title="NASA EONET"
                description="Visualización de incendios forestales, erupciones volcánicas y tormentas capturadas por satélites de la NASA en tiempo real."
                color="border-orange-100"
              />
              <IntegrationCard 
                badge="Biodiversidad"
                title="GBIF"
                description="Consulta bases de datos mundiales de presencia de especies y biodiversidad para análisis de impacto en ecosistemas."
                color="border-blue-100"
              />
              <IntegrationCard 
                badge="Recursos Hídricos"
                title="Water Quality Portal"
                description="Integración de datos de calidad del agua coordinados por USGS, EPA y el National Water Quality Monitoring Council."
                color="border-cyan-100"
              />
            </div>
          </Section>

          <Section title="Guía de Uso" icon="🕹️">
            <div className="space-y-10">
              <div className="relative pl-8 border-l-2 border-blue-200">
                <span className="absolute -left-3.5 top-0 w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">1</span>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Selecciona la Fuente</h4>
                <p className="text-gray-600">Elige entre las capas de APIs externas (Globales) o activa la capa de "Datos Locales" para usar tus propios archivos.</p>
              </div>
              
              <div className="relative pl-8 border-l-2 border-blue-200">
                <span className="absolute -left-3.5 top-0 w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">2</span>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Ajusta los Filtros</h4>
                <p className="text-gray-600">Define el país de interés, el rango de fechas y los parámetros específicos que deseas analizar. La mayoría de capas externas requieren un parámetro seleccionado para mostrar puntos.</p>
              </div>

              <div className="relative pl-8 border-l-2 border-blue-200">
                <span className="absolute -left-3.5 top-0 w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">3</span>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Explora e Interactúa</h4>
                <p className="text-gray-600">Haz clic en los puntos del mapa para abrir el panel de detalles. Podrás ver gráficos de tendencias, valores exactos y metadatos de la estación o sensor.</p>
              </div>
            </div>
          </Section>

          <Section title="Tus Propios Datos" icon="📊">
            <div className="bg-slate-900 rounded-3xl p-8 text-white mb-8">
              <h4 className="text-2xl font-bold mb-4">💾 Pruebalo tú mismo</h4>
              <p className="mb-6 opacity-90">Descarga este dataset de ejemplo y súbelo en la sección "Local" de GeoVisor para ver cómo el sistema procesa archivos CSV.</p>
              <a 
                href="/datasets/ejemplo-calidad-aire.csv" 
                download 
                className="inline-flex items-center gap-2 bg-blue-400 text-blue-950 px-8 py-3 rounded-2xl font-bold hover:bg-blue-300 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                Descargar Dataset de Ejemplo
              </a>
            </div>

            <h3 className="text-xl font-bold text-gray-800 mb-4">Estructura del archivo CSV</h3>
            <table className="w-full text-left border-collapse border border-gray-100 rounded-xl overflow-hidden shadow-sm text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 font-bold border-b border-gray-100">Columna</th>
                  <th className="p-4 font-bold border-b border-gray-100">Formato</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="p-4 border-b border-gray-100 font-mono">latitud</td><td className="p-4 border-b border-gray-100 text-gray-600">Decimal (Ej: 4.711)</td></tr>
                <tr><td className="p-4 border-b border-gray-100 font-mono">longitud</td><td className="p-4 border-b border-gray-100 text-gray-600">Decimal (Ej: -74.072)</td></tr>
                <tr><td className="p-4 border-b border-gray-100 font-mono">valor</td><td className="p-4 border-b border-gray-100 text-gray-600">Numérico (Ej: 15.5)</td></tr>
                <tr><td className="p-4 border-b border-gray-100 font-mono">parametro</td><td className="p-4 border-b border-gray-100 text-gray-600">Texto (Ej: PM2.5)</td></tr>
              </tbody>
            </table>
          </Section>

          <Section title="Código Abierto" icon="💻">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1">
                <p className="text-gray-700 leading-relaxed mb-6">
                  Creemos en la transparencia y la colaboración. Todo el código que impulsa GeoVisor es de <strong>código abierto</strong>. Puedes ver cómo funcionan los algoritmos de procesamiento, proponer mejoras o incluso desplegar tu propia instancia.
                </p>
                <a 
                  href="https://github.com/Pablo-Cubides/Aquatech-IA_webpage.git" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                  Explorar Repositorio en GitHub
                </a>
              </div>
            </div>
          </Section>

          <div className="mt-20 border-t pt-10 text-center">
            <p className="text-gray-500 mb-4">¿Dudas adicionales?</p>
            <div className="flex justify-center gap-6">
              <Link href="/faq" className="px-6 py-2 bg-white border border-gray-200 rounded-full text-blue-600 hover:bg-blue-50 transition-colors">Preguntas Frecuentes</Link>
              <Link href="/soporte" className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">Centro de Soporte</Link>
            </div>
          </div>
        </div>
      </div>
    </main>
    <FooterAmbiental />
  </>
);
}
