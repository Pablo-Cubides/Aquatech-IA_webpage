import type { Metadata } from "next";
import Link from "next/link";
import HeaderAmbiental from "@/components/nav/HeaderAmbiental";
import FooterAmbiental from "@/components/nav/FooterAmbiental";
import { FAQStructuredData, WebPageStructuredData } from "@/components/seo/StructuredData";
import { AuthoritativeReferences } from "@/components/seo/AuthoritativeReferences";

export const metadata: Metadata = {
  title: "Centro de Soporte y Ayuda Técnica",
  description:
    "Centro de soporte técnico de Aquatech IA: asistencia técnica especializada, guías operativas y resolución de incidencias para herramientas ambientales e inteligencia artificial.",
  alternates: {
    canonical: "/soporte",
  },
  openGraph: {
    title: "Centro de Soporte y Ayuda Técnica | AquatechIA",
    description:
      "Asistencia técnica especializada y resolución de incidencias para herramientas ambientales e IA.",
    type: "website",
    url: "/soporte",
  },
};

const supportOptions = [
  {
    icon: "📧",
    title: "Correo Electrónico",
    description: "Escríbenos y te responderemos en menos de 24 horas hábiles.",
    action: "soporte@aquatechia.com",
    href: "mailto:soporte@aquatechia.com",
    buttonText: "Enviar Email",
  },
  {
    icon: "💬",
    title: "Chat de Soporte",
    description: "Chatea con nuestro equipo técnico especializado en horario laboral.",
    action: "Lunes a Viernes, 9:00 - 18:00 COT",
    href: "#",
    buttonText: "Próximamente",
    disabled: true,
  },
  {
    icon: "📚",
    title: "Documentación y Guías",
    description: "Explora manuales interactivos, tutoriales y normativas de nuestras herramientas.",
    action: "Acceso permanente 24/7",
    href: "/faq",
    buttonText: "Ver FAQ",
  },
];

const commonIssues = [
  {
    title: "¿Cómo resolver problemas de inicio de sesión o autenticación?",
    solution:
      "Verifica que estás utilizando el correo institucional o la cuenta vinculada (Google Workspace o credenciales corporativas). Si el sistema muestra sesión inválida o caducada, limpia la memoria caché y las cookies de tu navegador web para el dominio aquatechia.com y reinicia tu navegador.",
  },
  {
    title: "¿Por qué el visor de mapas ambientales o capas SIG no carga datos?",
    solution:
      "Asegúrate de haber seleccionado un país, una región geográfica y al menos un parámetro o capa activa (calidad de aire PM2.5, zonificación hídrica o cobertura forestal). Los tiempos de carga dependen de la disponibilidad de servidores WMS/WFS externos y de la resolución geoespacial solicitada.",
  },
  {
    title: "¿Qué formato deben tener los archivos geoespaciales o CSV para carga masiva?",
    solution:
      "Los archivos tabulares deben estar codificados en formato UTF-8 y contener columnas explícitas de coordenadas geográficas ('latitud' y 'longitud' o 'lat' y 'lon') en proyección EPSG:4326 (WGS84). También se admiten paquetes comprimidos Shapefile (.zip) y formatos GeoJSON estándar.",
  },
  {
    title: "¿Cómo optimizar el rendimiento y tiempo de respuesta en herramientas analíticas?",
    solution:
      "Para consultas con grandes volúmenes de registros temporales o satelitales, se recomienda filtrar por ventanas temporales acotadas (mensual o trimestral) y delimitar polígonos de interés específicos antes de ejecutar procesos de exportación o renderizado vectorial.",
  },
];

const soporteFaqs = commonIssues.map((issue) => ({
  question: issue.title,
  answer: issue.solution,
}));

export default function SoportePage() {
  return (
    <>
      <WebPageStructuredData
        title="Centro de Soporte y Ayuda Técnica | Aquatech IA"
        description="Centro de soporte técnico de Aquatech IA: asistencia técnica especializada, guías operativas y resolución de incidencias para herramientas ambientales e inteligencia artificial."
        url="https://www.aquatechia.com/soporte"
        datePublished="2024-06-01"
        dateModified="2026-09-06"
      />
      <FAQStructuredData faqs={soporteFaqs} />
      <HeaderAmbiental />
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex-grow">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Centro de Soporte Técnico
          </h1>
          <p className="text-lg md:text-xl text-emerald-100 max-w-3xl mx-auto leading-relaxed">
            El Centro de Soporte de Aquatech IA proporciona asistencia técnica especializada, documentación operativa y resolución de incidencias para nuestras plataformas de inteligencia artificial y herramientas de análisis ambiental.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Support Options */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            ¿Cómo podemos ayudarte?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {supportOptions.map((option, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center hover:shadow-md transition-shadow"
              >
                <div className="text-4xl mb-4">{option.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {option.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {option.description}
                </p>
                <p className="text-sm text-gray-500 mb-4">{option.action}</p>
                {option.disabled ? (
                  <span className="inline-block bg-gray-100 text-gray-500 px-4 py-2 rounded-lg text-sm cursor-not-allowed">
                    {option.buttonText}
                  </span>
                ) : (
                  <Link
                    href={option.href}
                    className="inline-block bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-800 transition-colors shadow-sm"
                  >
                    {option.buttonText}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Common Issues */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Solución a Problemas Comunes
          </h2>
          <div className="space-y-4">
            {commonIssues.map((issue, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <span className="text-amber-600">⚠️</span>
                  {issue.title}
                </h3>
                <p className="text-gray-700 pl-7 leading-relaxed">
                  <span className="font-bold text-emerald-800">
                    Solución:{" "}
                  </span>
                  {issue.solution}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Technical Architecture & Protocols */}
        <section className="mb-16 bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Protocolos de Soporte y SLA Operativo
          </h2>
          <p className="text-slate-700 leading-relaxed mb-4">
            Nuestro equipo de soporte técnico opera bajo estándares internacionales de disponibilidad de servicio (SLA) para asegurar la continuidad de proyectos ambientales críticos y despliegues de modelos de lenguaje en producción. Todas las incidencias reportadas son clasificadas según su criticidad operativa:
          </p>
          <div className="grid sm:grid-cols-3 gap-4 text-sm mt-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-900 block mb-1">Nivel 1: Urgente</span>
              <p className="text-slate-600">Caída total de servicios web o fallas en endpoints de inferencia de IA. Respuesta en menos de 2 horas.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-900 block mb-1">Nivel 2: Alto</span>
              <p className="text-slate-600">Degradación en capas de visualización cartográfica o latencias elevadas. Respuesta en 6 horas hábiles.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-900 block mb-1">Nivel 3: Consultas</span>
              <p className="text-slate-600">Dudas metodológicas, integración de APIs o sugerencias de producto. Respuesta en 24 horas hábiles.</p>
            </div>
          </div>
        </section>

        {/* Contact Form Placeholder */}
        <section className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-8 border border-emerald-200">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              ¿Aún necesitas ayuda?
            </h2>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto leading-relaxed">
              Si no encontraste la solución a tu problema técnico, envíanos un mensaje detallado indicando la herramienta, la URL del navegador y el mensaje de error para que nuestro equipo técnico pueda replicarlo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:soporte@aquatechia.com?subject=Solicitud de Soporte"
                className="inline-flex items-center justify-center gap-2 bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-800 transition-colors shadow-sm"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                Enviar Solicitud de Soporte
              </a>
              <Link
                href="/faq"
                className="inline-flex items-center justify-center gap-2 bg-white text-emerald-800 border border-emerald-300 px-6 py-3 rounded-lg font-semibold hover:bg-emerald-50 transition-colors shadow-sm"
              >
                Ver Preguntas Frecuentes
              </Link>
            </div>
          </div>
        </section>

        {/* Authoritative References GEO/SEO */}
        <section className="mt-12">
          <AuthoritativeReferences theme="light" />
        </section>

        {/* Back to Home */}
        <div className="mt-12 text-center">
          <Link
            href="/"
            className="text-emerald-800 hover:text-emerald-900 font-semibold"
          >
            ← Volver al inicio
          </Link>
        </div>
        </div>
      </main>
      <FooterAmbiental />
    </>
  );
}
