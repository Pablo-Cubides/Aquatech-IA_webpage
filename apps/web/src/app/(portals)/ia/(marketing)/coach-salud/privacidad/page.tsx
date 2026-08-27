import type { Metadata } from "next";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  ArrowLeft,
  ExternalLink,
  Database,
  Bot,
  MessageSquare,
  Mail,
  Scale,
  Heart,
  Moon,
  Footprints,
} from "lucide-react";
import { SITE_URL } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Política de Privacidad | Coach Salud Personal - AquatechIA",
  description:
    "Política de Privacidad de Coach Salud Personal. Detalles sobre el tratamiento de datos, permisos OAuth de Google Health/Fit, almacenamiento y derechos del usuario.",
  alternates: {
    canonical: `${SITE_URL}/ia/coach-salud/privacidad`,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function CoachSaludPrivacyPage() {
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
            Política de Privacidad &bull; Integración Privada
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            Política de Privacidad
          </h1>
          <p className="text-lg text-gray-300">
            Coach Salud Personal (Integración Privada de Métricas de Bienestar)
          </p>
          <p className="text-xs text-gray-400 mt-2">
            Última actualización: {lastUpdated}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-12">
          {/* Summary Callout */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-900/60 border border-cyan-500/30 rounded-2xl p-6 md:p-8 space-y-4">
            <h2 className="text-xl font-bold text-[#00EFFF] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5" />
              Resumen Fundamental de Privacidad
            </h2>
            <p className="text-gray-300 leading-relaxed">
              <strong>Coach Salud Personal</strong> es una integración privada de
              automatización y análisis de métricas personales desarrollada para
              uso individual exclusivo del propietario de la cuenta. No es un
              servicio comercial, no está abierta a registros públicos de
              terceros, no vende datos, no realiza publicidad y no elabora
              perfiles con fines comerciales.
            </p>
          </div>

          {/* Section 1 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-[#00EFFF] border-b border-gray-800 pb-2">
              1. Alcance y Naturaleza de la Integración
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Coach Salud Personal es una aplicación privada alojada de forma
              informativa en el ecosistema de <strong>AquatechIA</strong> para
              dar cumplimiento a los requisitos oficiales de verificación y
              transparencia de Google OAuth.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Su finalidad exclusiva es consultar, mediante previa y explícita
              autorización del propietario de la cuenta de Google, métricas de
              salud y actividad física para generar resúmenes periódicos de
              bienestar personal.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-[#00EFFF] border-b border-gray-800 pb-2">
              2. Datos Consultados y Modo de Acceso (Solo Lectura)
            </h2>
            <p className="text-gray-300 leading-relaxed">
              La integración solicita únicamente permisos de{" "}
              <strong className="text-white">solo lectura (read-only)</strong> a
              través de las APIs de Google Fit / Google Health Connect. La
              aplicación nunca solicita permisos de modificación ni escritura en
              su cuenta de Google.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-gray-900/60 border border-gray-800 p-4 rounded-xl flex items-start gap-3">
                <Footprints className="w-5 h-5 text-[#00EFFF] mt-0.5" />
                <div>
                  <h3 className="font-semibold text-white text-sm">
                    Actividad y Pasos
                  </h3>
                  <p className="text-xs text-gray-400">
                    Número de pasos diarios, distancia caminada y minutos de
                    actividad registrados.
                  </p>
                </div>
              </div>

              <div className="bg-gray-900/60 border border-gray-800 p-4 rounded-xl flex items-start gap-3">
                <Moon className="w-5 h-5 text-[#00EFFF] mt-0.5" />
                <div>
                  <h3 className="font-semibold text-white text-sm">
                    Sueño y Descanso
                  </h3>
                  <p className="text-xs text-gray-400">
                    Duración del sueño, horarios de inicio/fin y fases de sueño
                    cuando estén disponibles.
                  </p>
                </div>
              </div>

              <div className="bg-gray-900/60 border border-gray-800 p-4 rounded-xl flex items-start gap-3">
                <Scale className="w-5 h-5 text-[#00EFFF] mt-0.5" />
                <div>
                  <h3 className="font-semibold text-white text-sm">
                    Métricas Corporales
                  </h3>
                  <p className="text-xs text-gray-400">
                    Peso, Índice de Masa Corporal (IMC) y porcentaje de grasa
                    corporal registrados.
                  </p>
                </div>
              </div>

              <div className="bg-gray-900/60 border border-gray-800 p-4 rounded-xl flex items-start gap-3">
                <Heart className="w-5 h-5 text-[#00EFFF] mt-0.5" />
                <div>
                  <h3 className="font-semibold text-white text-sm">
                    Frecuencia Cardíaca
                  </h3>
                  <p className="text-xs text-gray-400">
                    Pulsaciones por minuto en reposo y registros de ritmo
                    cardíaco durante actividades.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-[#00EFFF] border-b border-gray-800 pb-2">
              3. Almacenamiento, Infraestructura y Proveedores Técnicos
            </h2>
            <p className="text-gray-300 leading-relaxed">
              En aras de total transparencia, se aclara la infraestructura
              utilizada en el funcionamiento de esta automatización:
            </p>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start gap-3 bg-gray-900/40 p-4 rounded-xl border border-gray-800/80">
                <Database className="w-5 h-5 text-[#00EFFF] mt-1 shrink-0" />
                <div>
                  <strong className="text-white">Almacenamiento de Tokens en Supabase:</strong>{" "}
                  Los tokens de autorización OAuth se almacenan de manera
                  cifrada en una base de datos privada en Supabase, accesible
                  únicamente mediante credenciales del desarrollador.
                </div>
              </li>
              <li className="flex items-start gap-3 bg-gray-900/40 p-4 rounded-xl border border-gray-800/80">
                <Bot className="w-5 h-5 text-[#00EFFF] mt-1 shrink-0" />
                <div>
                  <strong className="text-white">Procesamiento por Inteligencia Artificial y Modelos Coach:</strong>{" "}
                  Los datos consultados son procesados por modelos analíticos
                  para sintetizar las métricas y generar reportes semanales, los
                  cuales se archivan como archivos privados de Coach.
                </div>
              </li>
              <li className="flex items-start gap-3 bg-gray-900/40 p-4 rounded-xl border border-gray-800/80">
                <MessageSquare className="w-5 h-5 text-[#00EFFF] mt-1 shrink-0" />
                <div>
                  <strong className="text-white">Notificaciones a Slack Privado:</strong>{" "}
                  Los resúmenes ejecutivos se transmiten directamente al canal o
                  espacio privado de Slack configurado por el usuario.
                </div>
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-[#00EFFF] border-b border-gray-800 pb-2">
              4. Compromiso de No Comercialización y Requisitos de Uso Limitado
            </h2>
            <div className="bg-gray-900/60 border border-gray-800 p-6 rounded-2xl space-y-3">
              <p className="text-gray-300 leading-relaxed">
                Coach Salud Personal cumple estrictamente con la{" "}
                <strong className="text-white">
                  Google API Services User Data Policy
                </strong>
                , incluyendo los requerimientos de{" "}
                <strong className="text-[#00EFFF]">Uso Limitado (Limited Use)</strong>:
              </p>
              <ul className="space-y-2 text-sm text-gray-300 list-disc list-inside ml-2">
                <li>
                  Los datos nunca se venden, alquilan ni ceden a terceros.
                </li>
                <li>
                  No se utilizan datos de salud para publicidad, mercadeo,
                  retargeting ni elaboración de perfiles comerciales.
                </li>
                <li>
                  Los datos no se transfieren a terceros salvo los proveedores de
                  infraestructura técnica estrictamente indispensables para la
                  generación del reporte personal solicitado por el usuario.
                </li>
                <li>
                  Ninguna persona humana tiene acceso para leer los datos de
                  salud del usuario a menos que el usuario lo solicite
                  explícitamente para soporte técnico o sea requerido por ley.
                </li>
              </ul>
            </div>
          </section>

          {/* Section 5 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-[#00EFFF] border-b border-gray-800 pb-2">
              5. Revocación de Acceso y Eliminación de Datos
            </h2>
            <p className="text-gray-300 leading-relaxed">
              El usuario mantiene el control absoluto sobre sus datos en todo
              momento y dispone de las siguientes opciones inmediatas:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="bg-gray-900/40 border border-gray-800 p-5 rounded-xl space-y-2">
                <h3 className="font-semibold text-white text-base flex items-center gap-2">
                  <ExternalLink className="w-4 h-4 text-[#00EFFF]" />
                  Revocar Permisos OAuth
                </h3>
                <p className="text-xs text-gray-400">
                  Puedes desconectar o eliminar el acceso de la integración en
                  cualquier instante desde el panel de seguridad de Google:
                </p>
                <a
                  href="https://myaccount.google.com/permissions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-[#00EFFF] font-semibold hover:underline pt-1"
                >
                  myaccount.google.com/permissions
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="bg-gray-900/40 border border-gray-800 p-5 rounded-xl space-y-2">
                <h3 className="font-semibold text-white text-base flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#00EFFF]" />
                  Solicitar Eliminación de Datos
                </h3>
                <p className="text-xs text-gray-400">
                  Puedes solicitar en cualquier momento la eliminación total y
                  definitiva de tus tokens almacenados en Supabase y reportes
                  generados escribiendo a:
                </p>
                <p className="text-xs font-mono text-cyan-300 pt-1">
                  privacy@aquatechia.com
                </p>
              </div>
            </div>
          </section>

          {/* Section 6 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-[#00EFFF] border-b border-gray-800 pb-2">
              6. Contacto y Responsable
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Para cualquier consulta, aclaración sobre el tratamiento de datos o
              ejercicio de derechos de privacidad en relación con Coach Salud
              Personal:
            </p>
            <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-xl text-sm text-gray-300 space-y-1">
              <p>
                <strong>Entidad de Alojamiento:</strong> AquatechIA
              </p>
              <p>
                <strong>Responsable de Privacidad:</strong> Equipo de Seguridad y Privacidad
              </p>
              <p>
                <strong>Correo Electrónico:</strong>{" "}
                <span className="text-[#00EFFF]">privacy@aquatechia.com</span>
              </p>
              <p>
                <strong>Sitio Web:</strong>{" "}
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
