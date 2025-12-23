import type { Metadata } from "next";
import Link from "next/link";
import HeaderAmbiental from "@/components/nav/HeaderAmbiental";
import FooterAmbiental from "@/components/nav/FooterAmbiental";

export const metadata: Metadata = {
  title: "Manual de ECOstats | AquatechIA",
  description: "Guía de uso para ECOstats, la herramienta de análisis de correlaciones ambientales. Aprende sobre Pearson, Spearman y Kendall.",
};

const Section = ({ title, children, icon }: { title: string; children: React.ReactNode; icon: string }) => (
  <section className="mb-16 scroll-mt-24" id={title.toLowerCase().replace(/\s+/g, "-")}>
    <div className="flex items-center gap-4 mb-6">
      <span className="text-4xl">{icon}</span>
      <h2 className="text-3xl font-bold text-gray-900 border-b-4 border-cyan-500 pb-2">{title}</h2>
    </div>
    <div className="bg-white rounded-2xl shadow-xl shadow-cyan-500/5 border border-gray-100 p-8">
      {children}
    </div>
  </section>
);

const MethodCard = ({ title, description, usage }: { title: string; description: string; usage: string }) => (
  <div className="p-6 rounded-2xl border border-gray-100 bg-slate-50 h-full hover:shadow-md transition-all">
    <h4 className="text-xl font-bold mb-3 text-gray-900 text-cyan-700">{title}</h4>
    <p className="text-sm text-gray-700 mb-4">{description}</p>
    <div className="text-xs font-semibold bg-white p-3 rounded-lg border border-gray-200 text-gray-600">
      <span className="block mb-1 text-cyan-600 uppercase tracking-wider">Cuándo usarlo:</span>
      {usage}
    </div>
  </div>
);

export default function GuiaECOstatsPage() {
  return (
    <>
      <HeaderAmbiental />
      <main className="min-h-screen bg-slate-50 flex-grow">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-cyan-600 to-blue-500 text-white py-12 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        <div className="max-w-6xl mx-auto relative z-10 flex flex-col items-center text-center">
          <div className="animate-float mb-6">
            <img 
              src="/images/Portal ambiental/Herramientas/ECOStats - sin fondo.png" 
              alt="ECOstats" 
              className="max-w-full h-auto max-h-[160px] drop-shadow-lg"
            />
          </div>
          <div>
            <p className="text-xl text-cyan-50 max-w-2xl leading-relaxed mx-auto">
              Facilitando el análisis de datos para la investigación académica y proyectos ambientales. Descubre patrones ocultos con rigor estadístico.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Navigation Sidebar */}
        <aside className="lg:col-span-1 border-r border-gray-200 pr-8 hidden lg:block h-fit sticky top-24">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Contenido</h3>
          <nav className="flex flex-col gap-3">
            <a href="#introducción" className="text-gray-600 hover:text-cyan-600 font-medium transition-colors">👋 Introducción</a>
            <a href="#fuentes-de-datos" className="text-gray-600 hover:text-cyan-600 font-medium transition-colors">🌍 Fuentes de Datos</a>
            <a href="#métodos-estadísticos" className="text-gray-600 hover:text-cyan-600 font-medium transition-colors">📐 Métodos</a>
            <a href="#prepara-tus-datos" className="text-gray-600 hover:text-cyan-600 font-medium transition-colors">📊 Tus Datos</a>
            <a href="#codigo-abierto" className="text-gray-600 hover:text-cyan-600 font-medium transition-colors">💻 Código Abierto</a>
          </nav>
        </aside>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Section title="Introducción" icon="👋">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Ciencia de Datos para el Medio Ambiente</h3>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              <strong>ECOstats</strong> nace con la misión de democratizar el análisis estadístico avanzado. Diseñada para investigadores, estudiantes y gestores ambientales, esta herramienta permite validar hipótesis complejas sin la barrera de entrada de la programación.
            </p>
            <p className="text-gray-600 bg-cyan-50 p-6 rounded-xl border border-cyan-100">
              Ya sea para una <strong>tesis académica</strong>, un <strong>informe técnico</strong> o un <strong>proyecto de monitoreo</strong>, ECOstats te ofrece la precisión de R y Python en una interfaz amigable.
            </p>
          </Section>

          <Section title="Fuentes de Datos" icon="🌍">
            <p className="text-gray-700 mb-8">
              La plataforma no solo procesa tus archivos locales, sino que se conecta directamente con repositorios globales de prestigio para enriquecer tus análisis:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl border border-blue-100 bg-white hover:shadow-md transition-all">
                <h4 className="text-lg font-bold text-blue-800 mb-2">Banco Mundial</h4>
                <p className="text-sm text-gray-600">Acceso a indicadores de desarrollo, economía y medio ambiente de más de 200 países con series temporales históricas.</p>
              </div>
              <div className="p-6 rounded-2xl border border-cyan-100 bg-white hover:shadow-md transition-all">
                <h4 className="text-lg font-bold text-cyan-800 mb-2">WHO GHO</h4>
                <p className="text-sm text-gray-600">Observatorio Global de Salud de la OMS. Crucial para estudios de salud pública y su relación con factores ambientales.</p>
              </div>
            </div>
          </Section>

          <Section title="Métodos Estadísticos" icon="📐">
            <p className="text-gray-700 mb-8">
              ECOstats calcula simultáneamente tres tipos de coeficientes para darte una visión completa de tus datos:
            </p>
            <div className="grid md:grid-cols-1 gap-6">
              <MethodCard 
                title="Coeficiente de Pearson (r)"
                description="Mide la relación lineal entre dos variables. Es el estándar en investigación cuando los datos siguen una distribución normal."
                usage="Úsalo para correlaciones paramétricas en estudios con muestras grandes y distribuidas normalmente."
              />
              <MethodCard 
                title="Coeficiente de Spearman (ρ)"
                description="Evalúa relaciones monótonas basada en rangos. Ideal para datos que no cumplen supuestos de normalidad."
                usage="Perfecto para datos ambientales sesgados o con valores atípicos (outliers), común en ecología."
              />
              <MethodCard 
                title="Tau de Kendall (τ)"
                description="Una medida no paramétrica robusta de concordancia. Menos sensible a errores en los datos que Spearman."
                usage="Recomendado para datasets pequeños (<30 muestras) o cuando la precisión del ranking es crítica."
              />
            </div>
          </Section>

          <Section title="Prepara tus Datos" icon="📊">
            <div className="bg-slate-900 rounded-3xl p-8 text-white mb-8">
              <h4 className="text-2xl font-bold mb-4">💾 Archivo de Ejemplo</h4>
              <p className="mb-6 opacity-90">Descarga este archivo CSV preformateado para probar la herramienta y entender la estructura requerida.</p>
              <a 
                href="/datasets/ejemplo-correlaciones.csv" 
                download 
                className="inline-flex items-center gap-2 bg-cyan-500 text-white px-8 py-3 rounded-2xl font-bold hover:bg-cyan-400 transition-all shadow-lg shadow-cyan-500/20"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                Descargar CSV de Ejemplo
              </a>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">Estructura Simple</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-gray-700">
                    <span className="text-green-500 font-bold">✓</span>
                    Formatos: <strong>.CSV</strong> o <strong>.XLSX</strong>.
                  </li>
                  <li className="flex items-start gap-3 text-gray-700">
                    <span className="text-green-500 font-bold">✓</span>
                    Fila 1: Nombres de variables (ej. pH, OD).
                  </li>
                  <li className="flex items-start gap-3 text-gray-700">
                    <span className="text-green-500 font-bold">✓</span>
                    Filas 2+: Datos numéricos exclusivamente.
                  </li>
                </ul>
              </div>
            </div>
          </Section>

          <Section title="Código Abierto" icon="💻">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1">
                <p className="text-gray-700 leading-relaxed mb-6">
                  Fomentamos la <strong>Ciencia Abierta</strong>. Los algoritmos estadísticos que impulsan ECOstats son transparentes y auditables. Si eres desarrollador o investigador, te invitamos a revisar, mejorar o bifurcar nuestro código.
                </p>
                <a 
                  href="https://github.com/Pablo-Cubides/Analisis_correlacion.git" 
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
        </div>
      </div>
    </main>
    <FooterAmbiental />
  </>
  );
}
