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
              className="max-w-full h-auto max-h-[120px] drop-shadow-lg"
            />
          </div>
          <div>
            <h1 className="text-4xl font-bold mb-4">Manual de Usuario</h1>
            <p className="text-xl text-cyan-50 max-w-2xl leading-relaxed mx-auto">
              Descubre patrones ocultos en tus datos ambientales con análisis estadístico avanzado, simplificado para ti.
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
            <a href="#métodos-estadísticos" className="text-gray-600 hover:text-cyan-600 font-medium transition-colors">📐 Métodos</a>
            <a href="#prepara-tus-datos" className="text-gray-600 hover:text-cyan-600 font-medium transition-colors">📊 Tus Datos</a>
            <a href="#paso-a-paso" className="text-gray-600 hover:text-cyan-600 font-medium transition-colors">👣 Paso a Paso</a>
          </nav>
        </aside>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Section title="Introducción" icon="👋">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">¿Qué es ECOstats?</h3>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              <strong>ECOstats</strong> es una herramienta diseñada para investigadores ambientales que necesitan validar hipótesis rápidamente. Permite cargar datasets propios y calcular automáticamente matrices de correlación utilizando tres métodos estadísticos robustos, sin necesidad de escribir código en R o Python.
            </p>
            <p className="text-gray-600 bg-cyan-50 p-6 rounded-xl border border-cyan-100">
              Ideal para estudios de calidad de agua, aire o biodiversidad donde se busca entender cómo una variable (ej. Temperatura) afecta a otra (ej. Oxígeno Disuelto).
            </p>
          </Section>

          <Section title="Métodos Estadísticos" icon="📐">
            <p className="text-gray-700 mb-8">
              ECOstats calcula simultáneamente tres tipos de coeficientes para darte una visión completa de tus datos:
            </p>
            <div className="grid md:grid-cols-1 gap-6">
              <MethodCard 
                title="Coeficiente de Pearson (r)"
                description="Mide la relación lineal entre dos variables. Es el más común pero asume que tus datos siguen una distribución normal."
                usage="Úsalo cuando tus datos tienen una curva de campana (normalidad) y buscas relaciones de línea recta."
              />
              <MethodCard 
                title="Coeficiente de Spearman (ρ)"
                description="Evalúa relaciones monótonas (crecientes o decrecientes) sin importar si son lineales. Se basa en el rango de los datos."
                usage="Perfecto para datos ambientales que no son normales o tienen valores atípicos (outliers)."
              />
              <MethodCard 
                title="Tau de Kendall (τ)"
                description="Similar a Spearman pero más robusto con datasets pequeños. Mide la concordancia entre pares de observaciones."
                usage="Recomendado cuando tienes pocos datos muestrales (<30) y quieres mayor precisión que Spearman."
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

            <h3 className="text-xl font-bold text-gray-800 mb-4">Reglas del Archivo</h3>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start gap-3 text-gray-700">
                <span className="text-green-500 font-bold">✓</span>
                El archivo debe ser formato <strong>.CSV</strong> o <strong>.XLSX</strong>.
              </li>
              <li className="flex items-start gap-3 text-gray-700">
                <span className="text-green-500 font-bold">✓</span>
                La primera fila debe contener los <strong>nombres de las variables</strong> (ej. pH, OD, Temperatura).
              </li>
              <li className="flex items-start gap-3 text-gray-700">
                <span className="text-green-500 font-bold">✓</span>
                Todas las demás filas deben ser <strong>datos numéricos</strong>. El texto será ignorado.
              </li>
              <li className="flex items-start gap-3 text-gray-700">
                <span className="text-green-500 font-bold">✓</span>
                Se usan <strong>puntos (.)</strong> para decimales, no comas.
              </li>
            </ul>
          </Section>

          <Section title="Paso a Paso" icon="👣">
            <div className="space-y-10">
              <div className="relative pl-8 border-l-2 border-cyan-200">
                <span className="absolute -left-3.5 top-0 w-7 h-7 bg-cyan-600 text-white rounded-full flex items-center justify-center font-bold">1</span>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Carga el Archivo</h4>
                <p className="text-gray-600">Arrastra tu archivo al área de carga o haz clic para seleccionarlo desde tu ordenador.</p>
              </div>
              
              <div className="relative pl-8 border-l-2 border-cyan-200">
                <span className="absolute -left-3.5 top-0 w-7 h-7 bg-cyan-600 text-white rounded-full flex items-center justify-center font-bold">2</span>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Revisión Automática</h4>
                <p className="text-gray-600">El sistema validará que existan columnas numéricas. Si hay errores de formato, te avisará inmediatamente.</p>
              </div>

              <div className="relative pl-8 border-l-2 border-cyan-200">
                <span className="absolute -left-3.5 top-0 w-7 h-7 bg-cyan-600 text-white rounded-full flex items-center justify-center font-bold">3</span>
                <h4 className="text-lg font-bold text-gray-900 mb-2">Visualiza Resultados</h4>
                <p className="text-gray-600">Obtendrás una tabla resumen con todos los pares de variables correlacionadas. Puedes ordenar por fuerza de correlación.</p>
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
