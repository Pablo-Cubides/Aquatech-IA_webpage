import type { Metadata } from "next";
import Link from "next/link";
import HeaderAmbiental from "@/components/nav/HeaderAmbiental";
import FooterAmbiental from "@/components/nav/FooterAmbiental";

export const metadata: Metadata = {
  title: "Preguntas Frecuentes | AquatechIA",
  description:
    "Encuentra respuestas a las preguntas más comunes sobre AquatechIA, nuestras herramientas de inteligencia artificial y gestión ambiental.",
};

const faqs = [
  {
    question: "¿Qué es AquatechIA?",
    answer:
      "AquatechIA es una plataforma que combina inteligencia artificial con gestión ambiental, ofreciendo herramientas especializadas para profesionales del sector agua y medioambiente.",
  },
  {
    question: "¿Las herramientas son gratuitas?",
    answer:
      "Muchas de nuestras herramientas son de acceso libre. Algunas funcionalidades avanzadas requieren registro o suscripción. Puedes explorar todas las herramientas disponibles en la sección correspondiente de cada portal.",
  },
  {
    question: "¿Cómo puedo acceder al Visor de Mapas Ambientales?",
    answer:
      "El Visor de Mapas Ambientales está disponible en el Portal Ambiental → Herramientas → Visor de Mapas. Puedes visualizar datos de calidad del aire, agua y otros parámetros ambientales de fuentes como OpenAQ, GBIF y más.",
  },
  {
    question: "¿Qué datos muestra el Visor de Mapas?",
    answer:
      "El visor integra datos de múltiples fuentes: OpenAQ (calidad del aire), GBIF (biodiversidad), WQP (calidad del agua en USA), y EONET (eventos naturales de la NASA). También puedes cargar tus propios datasets en formato CSV o Excel.",
  },
  {
    question: "¿Puedo usar las herramientas sin crear una cuenta?",
    answer:
      "Sí, la mayoría de herramientas de visualización y consulta funcionan sin necesidad de registro. Para guardar configuraciones, cargar datos propios o acceder a funciones premium, necesitarás crear una cuenta.",
  },
  {
    question: "¿Cómo funciona el sistema de créditos?",
    answer:
      "Algunas herramientas avanzadas consumen créditos. Al registrarte recibes créditos gratuitos. Puedes adquirir más créditos según tus necesidades. Las herramientas básicas no consumen créditos.",
  },
  {
    question: "¿Los datos de calidad del aire están actualizados?",
    answer:
      "Los datos de OpenAQ se actualizan en tiempo real desde estaciones de monitoreo oficiales en todo el mundo. La frecuencia de actualización depende de cada estación de monitoreo.",
  },
  {
    question: "¿Puedo exportar los datos y análisis?",
    answer:
      "Sí, la mayoría de nuestras herramientas permiten exportar resultados en formatos como CSV, Excel o PDF según la herramienta específica.",
  },
];

export default function FAQPage() {
  return (
    <>
      <HeaderAmbiental />
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex-grow">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Preguntas Frecuentes
          </h1>
          <p className="text-xl text-blue-100">
            Encuentra respuestas a las dudas más comunes
          </p>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-start gap-3">
                <span className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </span>
                {faq.question}
              </h3>
              <p className="text-gray-600 leading-relaxed pl-11">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 text-center bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-8 border border-blue-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            ¿No encontraste lo que buscabas?
          </h2>
          <p className="text-gray-600 mb-6">
            Nuestro equipo está listo para ayudarte con cualquier consulta.
          </p>
          <Link
            href="/soporte"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Contactar Soporte
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>

        {/* Back to Home */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-700 font-medium"
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
