import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Guía de Usuario | AquatechIA",
  description: "Manual completo de uso de las herramientas de AquatechIA. Aprende a usar el visor de mapas, la ruleta académica y más.",
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

const Step = ({ number, title, text }: { number: number; title: string; text: string }) => (
  <div className="flex gap-4 mb-6">
    <div className="flex-shrink-0 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
      {number}
    </div>
    <div>
      <h3 className="text-xl font-semibold text-gray-800 mb-1">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{text}</p>
    </div>
  </div>
);

export default function GuiaPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-cyan-700 text-white py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 animate-fade-in">
            Guía de Usuario <br />
            <span className="text-cyan-300">AquatechIA</span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl leading-relaxed">
            Domina todas las herramientas de nuestra plataforma. Desde inteligencia artificial generativa hasta monitoreo ambiental geoespacial.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Navigation Sidebar */}
        <aside className="lg:col-span-1 border-r border-gray-200 pr-8 hidden lg:block h-fit sticky top-24">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Contenido</h3>
          <nav className="flex flex-col gap-3">
            <a href="#inicio" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">🚀 Inicio</a>
            <a href="#portal-ia" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">🤖 Portal IA</a>
            <a href="#portal-ambiental" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">🌍 Portal Ambiental</a>
            <a href="#visor-de-mapas" className="text-gray-600 hover:text-blue-600 font-medium transition-colors ml-4">📍 Visor de Mapas</a>
            <a href="#subida-de-datos" className="text-gray-600 hover:text-blue-600 font-medium transition-colors ml-4">📊 Subida de Datos</a>
            <a href="#cuenta-y-creditos" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">💎 Cuenta y Créditos</a>
          </nav>
        </aside>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Section title="Inicio" icon="🚀">
            <p className="text-lg text-gray-700 mb-6">
              Bienvenido a AquatechIA. Nuestra plataforma está dividida en dos grandes mundos profesionales que se entrelazan mediante el uso de datos y algoritmos avanzados.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 bg-cyan-50 border border-cyan-100 rounded-xl">
                <h4 className="font-bold text-cyan-900 mb-2">Portal IA</h4>
                <p className="text-sm text-cyan-800">
                  Enfocado en educación, modelos generativos y el futuro de la tecnología. Ideal para estudiantes y desarrolladores.
                </p>
              </div>
              <div className="p-6 bg-blue-50 border border-blue-100 rounded-xl">
                <h4 className="font-bold text-blue-900 mb-2">Portal Ambiental</h4>
                <p className="text-sm text-blue-800">
                  Herramientas técnicas para la gestión de recursos hídricos, calidad del aire y cumplimiento normativo.
                </p>
              </div>
            </div>
          </Section>

          <Section title="Portal IA" icon="🤖">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Herramientas Destacadas</h3>
            <div className="space-y-8">
              <div className="border-l-4 border-cyan-400 pl-6 py-2">
                <h4 className="font-bold text-xl mb-2 text-gray-900">Visor de Difusión</h4>
                <p className="text-gray-600 mb-4">Aprende sobre la generación de imágenes mediante procesos de difusión y ruido gaussiano.</p>
                <Link href="/ia/herramientas/visor-difusion" className="text-cyan-600 font-semibold hover:underline">Ir al visor →</Link>
              </div>
              
              <div className="border-l-4 border-cyan-400 pl-6 py-2">
                <h4 className="font-bold text-xl mb-2 text-gray-900">Ruleta Académica</h4>
                <p className="text-gray-600 mb-4">Un juego dinámico para bancos de preguntas. Sube tu set de preguntas y gamifica el aprendizaje.</p>
                <ul className="list-disc list-inside text-sm text-gray-500 mb-4 ml-2">
                  <li>Selecciona un banco existente</li>
                  <li>Carga un archivo Excel con preguntas/respuestas</li>
                  <li>Gira la ruleta y responde</li>
                </ul>
                <Link href="/ia/autor/herramientas/ruleta-academica" className="text-cyan-600 font-semibold hover:underline">Jugar ahora →</Link>
              </div>
            </div>
          </Section>

          <Section title="Portal Ambiental" icon="🌍">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 font-primary">📍 Manual del Visor de Mapas</h3>
            <p className="text-gray-700 mb-8 italic">El visor de mapas es nuestra herramienta más potente para la visualización de datos espaciales complejos.</p>
            
            <div className="space-y-4">
              <Step number={1} title="Selección de Fuente de Datos" text="Usa el selector lateral para elegir entre datos globales (OpenAQ, NASA EONET, GBIF) o tus propios datos subidos vía CSV/Excel." />
              <Step number={2} title="Filtros Geográficos" text="Selecciona el país y el rango de fechas. El sistema consultará automáticamente las estaciones disponibles en tiempo real." />
              <Step number={3} title="Análisis de Parámetros" text="Marca los contaminantes o indicadores que deseas ver (PM2.5, NO2, O3, biodiversidad, etc.)." />
              <Step number={4} title="Visualización" text="Interactúa con los puntos en el mapa para ver detalles, valores exactos y metadatos de la estación." />
            </div>

            <div className="mt-10 p-8 bg-gradient-to-br from-indigo-900 to-blue-900 rounded-3xl text-white">
              <h4 className="text-2xl font-bold mb-4">💾 Dataset de Ejemplo</h4>
              <p className="mb-6 opacity-90">¿Quieres probar el mapa ahora mismo? Descarga este archivo CSV con datos reales de calidad del aire y súbelo al visor.</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href="/datasets/ejemplo-calidad-aire.csv" 
                  download 
                  className="bg-cyan-400 text-blue-900 px-8 py-3 rounded-2xl font-bold hover:bg-cyan-300 transition-all text-center flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  Descargar CSV de Ejemplo
                </a>
              </div>
            </div>
          </Section>

          <Section title="Subida de Datos" icon="📊">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Requerimientos para archivos propios</h3>
            <p className="text-gray-700 mb-6">Para que el sistema procese correctamente tus datos terrestres o acuáticos, el archivo debe cumplir con:</p>
            
            <table className="w-full text-left border-collapse mb-8 border border-gray-100 rounded-xl overflow-hidden shadow-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 font-bold border-b border-gray-100">Columna Obligatoria</th>
                  <th className="p-4 font-bold border-b border-gray-100">Descripción / Formato</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="p-4 border-b border-gray-100 font-mono text-sm">latitud</td><td className="p-4 border-b border-gray-100">Decimal (Ej: -34.603)</td></tr>
                <tr><td className="p-4 border-b border-gray-100 font-mono text-sm">longitud</td><td className="p-4 border-b border-gray-100">Decimal (Ej: -58.381)</td></tr>
                <tr><td className="p-4 border-b border-gray-100 font-mono text-sm">valor</td><td className="p-4 border-b border-gray-100">Número real (La magnitud medida)</td></tr>
                <tr><td className="p-4 border-b border-gray-100 font-mono text-sm">parametro</td><td className="p-4 border-b border-gray-100">Nombre del contaminante o sensor</td></tr>
              </tbody>
            </table>
            
            <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-xl">
              <p className="text-amber-800 text-sm font-medium">
                <strong>Tip Profesional:</strong> No uses comas como separadores decimales si el CSV usa comas para separar columnas. Te recomendamos usar puntos (.) para los decimales.
              </p>
            </div>
          </Section>

          <Section title="Cuenta y Créditos" icon="💎">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1">
                <p className="text-gray-700 mb-4 leading-relaxed">
                  AquatechIA utiliza un sistema de créditos para herramientas de procesamiento intensivo. 
                  Como usuario ADMIN, tienes acceso ilimitado a todas las funciones y puedes gestionar los créditos de otros colaboradores.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-gray-700">
                    <span className="text-green-500 font-bold">✓</span>
                    <span>Acceso a Modelos Generativos 6.0</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <span className="text-green-500 font-bold">✓</span>
                    <span>Descarga de Reportes en Alta Resolución</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <span className="text-green-500 font-bold">✓</span>
                    <span>Soporte Prioritario</span>
                  </div>
                </div>
              </div>
              <div className="w-full md:w-64 bg-slate-900 rounded-2xl p-6 text-center shadow-2xl">
                <div className="text-4xl mb-2">💠</div>
                <div className="text-3xl font-bold text-white mb-1">∞</div>
                <div className="text-cyan-400 text-xs font-bold uppercase tracking-wider">Plan Corporativo Admin</div>
              </div>
            </div>
          </Section>

          {/* Social / Support Links */}
          <div className="mt-20 border-t pt-10 text-center">
            <p className="text-gray-500 mb-4">¿Necesitas ayuda extra?</p>
            <div className="flex justify-center gap-6">
              <Link href="/faq" className="px-6 py-2 bg-white border border-gray-200 rounded-full text-blue-600 hover:bg-blue-50 transition-colors">Ver Preguntas Frecuentes</Link>
              <Link href="/soporte" className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">Contactar Soporte</Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer minimal info */}
      <footer className="bg-white border-t border-gray-200 py-10 mt-20 text-center">
        <p className="text-gray-400 text-sm">© 2025 AquatechIA - Tecnología para la sostenibilidad ambiental.</p>
      </footer>
    </div>
  );
}
