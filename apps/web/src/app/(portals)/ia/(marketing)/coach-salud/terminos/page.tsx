import type { Metadata } from "next";
import Link from "next/link";
import {
  Lock,
  ArrowLeft,
  AlertTriangle,
} from "lucide-react";
import { SITE_URL } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Términos de Servicio | Coach Salud Personal - AquatechIA",
  description:
    "Términos y condiciones de uso de la integración privada Coach Salud Personal.",
  alternates: {
    canonical: `${SITE_URL}/ia/coach-salud/terminos`,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function CoachSaludTermsPage() {
  const lastUpdated = "27 de agosto de 2026";

  return (
    <div className="bg-[#0B0F19] text-white min-h-screen">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gradient-to-b from-[#060911] to-[#0B0F19] py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/ia/coach-salud"
            className="inline-flex items-center gap-2 text-sm text-[#00EFFF] hover:text-cyan-300 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a Coach Salud Personal
          </Link>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[#00EFFF] text-xs font-semibold uppercase tracking-wider mb-4">
            <Lock className="w-3.5 h-3.5" />
            Términos de Servicio &bull; Integración Privada
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            Términos de Servicio
          </h1>
          <p className="text-lg text-gray-300">
            Coach Salud Personal (Automatización e Integración Privada)
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Última actualización: {lastUpdated}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-12">
          {/* Medical Disclaimer Banner */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 md:p-8 space-y-3">
            <h2 className="text-xl font-bold text-amber-400 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Descargo de Responsabilidad Médico y de Bienestar
            </h2>
            <p className="text-gray-200 text-sm md:text-base leading-relaxed">
              <strong>Coach Salud Personal</strong> es una herramienta de
              automatización y análisis descriptivo de bienestar para uso
              personal. Los datos, resúmenes y reportes generados son con fines
              exclusivamente informativos y de seguimiento de hábitos personales.
              No constituyen asesoramiento médico, diagnóstico clínico,
              tratamiento ni recomendación médica profesional.
            </p>
          </div>

          {/* Section 1 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-[#00EFFF] border-b border-gray-800 pb-2">
              1. Aceptación y Naturaleza del Servicio
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Coach Salud Personal es una aplicación privada de uso individual.
              No es un producto comercial público, no ofrece suscripciones y no
              presta servicios a terceras personas.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Al conectar su cuenta de Google mediante OAuth, el usuario autoriza
              el acceso en modo solo lectura a las métricas solicitadas con el
              único fin de recibir sus resúmenes semanales automatizados.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-[#00EFFF] border-b border-gray-800 pb-2">
              2. Alcance del Acceso y Autorización OAuth
            </h2>
            <p className="text-gray-300 leading-relaxed">
              El acceso a los datos del usuario se realiza respetando los
              mecanismos estándar de autorización de Google. La integración:
            </p>
            <ul className="space-y-2 text-gray-300 text-sm list-disc list-inside ml-2">
              <li>
                Accede únicamente a datos expresamente concedidos en la pantalla
                de consentimiento de Google.
              </li>
              <li>
                Opera exclusivamente en modalidad de lectura de métricas de
                Google Fit / Health Connect.
              </li>
              <li>
                No altera, modifica ni borra ningún dato existente en su cuenta
                de Google.
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-[#00EFFF] border-b border-gray-800 pb-2">
              3. Propiedad y Confidencialidad de los Datos
            </h2>
            <p className="text-gray-300 leading-relaxed">
              El usuario retiene la titularidad completa y exclusiva sobre todos
              sus datos y métricas de salud. La integración no reclama ningún
              derecho sobre el contenido analizado y se compromete a no utilizar
              dicha información para fines comerciales, publicitarios ni de
              entrenamiento público de modelos.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-[#00EFFF] border-b border-gray-800 pb-2">
              4. Terminación y Revocación
            </h2>
            <p className="text-gray-300 leading-relaxed">
              El usuario puede dar por terminado el funcionamiento de la
              integración y revocar el acceso en cualquier momento mediante:
            </p>
            <ul className="space-y-2 text-gray-300 text-sm ml-2">
              <li className="flex items-start gap-2">
                <span className="text-[#00EFFF]">•</span>
                <span>
                  La página de gestión de permisos de Google:{" "}
                  <a
                    href="https://myaccount.google.com/permissions"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#00EFFF] hover:underline"
                  >
                    https://myaccount.google.com/permissions
                  </a>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#00EFFF]">•</span>
                <span>
                  Solicitud de eliminación de tokens y reportes en Supabase al
                  correo:{" "}
                  <span className="text-white font-mono">
                    privacy@aquatechia.com
                  </span>
                </span>
              </li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-[#00EFFF] border-b border-gray-800 pb-2">
              5. Limitación de Responsabilidad
            </h2>
            <p className="text-gray-300 leading-relaxed">
              La integración se ofrece "tal cual" (*as is*) para uso privado.
              AquatechIA no se responsabiliza por indisponibilidades temporales
              de las APIs de Google, fallos en la conectividad de los proveedores
              técnicos o interpretaciones erróneas de las métricas mostradas en
              los resúmenes informativos.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-[#00EFFF] border-b border-gray-800 pb-2">
              6. Contacto
            </h2>
            <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-xl text-sm text-gray-300 space-y-1">
              <p>
                <strong>Para consultas técnicas o legales:</strong>
              </p>
              <p>
                📧 <strong>Email:</strong>{" "}
                <span className="text-[#00EFFF]">legal@aquatechia.com</span> /{" "}
                <span className="text-[#00EFFF]">privacy@aquatechia.com</span>
              </p>
              <p>
                🌐 <strong>Sitio Web:</strong>{" "}
                <a
                  href="https://aquatechia.com/ia"
                  className="text-[#00EFFF] hover:underline"
                >
                  https://aquatechia.com/ia
                </a>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
