import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Soporte | AquatechIA",
  description:
    "¿Necesitas ayuda? Contacta con el equipo de soporte de AquatechIA. Estamos aquí para asistirte con cualquier consulta sobre nuestras herramientas.",
};

const supportOptions = [
  {
    icon: "📧",
    title: "Correo Electrónico",
    description: "Escríbenos y te responderemos en menos de 24 horas.",
    action: "soporte@aquatechia.com",
    href: "mailto:soporte@aquatechia.com",
    buttonText: "Enviar Email",
  },
  {
    icon: "💬",
    title: "Chat de Soporte",
    description: "Chatea con nuestro equipo en horario laboral.",
    action: "Lunes a Viernes, 9:00 - 18:00 COT",
    href: "#",
    buttonText: "Próximamente",
    disabled: true,
  },
  {
    icon: "📚",
    title: "Documentación",
    description: "Explora guías y tutoriales de nuestras herramientas.",
    action: "Acceso 24/7",
    href: "/faq",
    buttonText: "Ver FAQ",
  },
];

const commonIssues = [
  {
    title: "Problemas de inicio de sesión",
    solution:
      "Verifica que estás usando la cuenta correcta (Google o credenciales). Si el problema persiste, intenta limpiar las cookies del navegador.",
  },
  {
    title: "El mapa no carga datos",
    solution:
      "Asegúrate de seleccionar un país y al menos un parámetro (PM2.5, NO2, etc.). Los datos dependen de la disponibilidad de estaciones de monitoreo en tu zona.",
  },
  {
    title: "Error al cargar mi archivo CSV",
    solution:
      "Verifica que tu archivo tenga columnas de latitud y longitud. Los formatos aceptados son CSV y Excel (.xlsx).",
  },
  {
    title: "Las herramientas cargan lentamente",
    solution:
      "Algunas herramientas procesan grandes volúmenes de datos. Intenta reducir el rango de fechas o el área geográfica de consulta.",
  },
];

export default function SoportePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-500 text-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Centro de Soporte
          </h1>
          <p className="text-xl text-emerald-100">
            Estamos aquí para ayudarte
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
                    className="inline-block bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
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
                  <span className="text-amber-500">⚠️</span>
                  {issue.title}
                </h3>
                <p className="text-gray-600 pl-7">
                  <span className="font-medium text-emerald-600">
                    Solución:{" "}
                  </span>
                  {issue.solution}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Form Placeholder */}
        <section className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-8 border border-emerald-100">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              ¿Aún necesitas ayuda?
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Si no encontraste la solución a tu problema, envíanos un mensaje
              detallado y nuestro equipo técnico te responderá lo antes posible.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:soporte@aquatechia.com?subject=Solicitud de Soporte"
                className="inline-flex items-center justify-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
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
                className="inline-flex items-center justify-center gap-2 bg-white text-emerald-600 border border-emerald-200 px-6 py-3 rounded-lg font-medium hover:bg-emerald-50 transition-colors"
              >
                Ver Preguntas Frecuentes
              </Link>
            </div>
          </div>
        </section>

        {/* Back to Home */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-emerald-600 hover:text-emerald-700 font-medium"
          >
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
