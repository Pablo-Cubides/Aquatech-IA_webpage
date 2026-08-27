import type { Metadata } from "next";
import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  FileText,
  ExternalLink,
  Bot,
  Heart,
  Moon,
  Footprints,
  Scale,
  CheckCircle2,
  Database,
  MessageSquare,
} from "lucide-react";
import { SITE_URL } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Coach Salud Personal | Integración Privada - AquatechIA",
  description:
    "Página informativa sobre la integración privada de uso personal Coach Salud Personal. Declaración de alcance, arquitectura y políticas de privacidad conforme a requisitos de Google OAuth.",
  alternates: {
    canonical: `${SITE_URL}/ia/coach-salud`,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function CoachSaludPage() {
  return (
    <div className="bg-[#0B0F19] text-white min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-gray-800/80 bg-gradient-to-b from-[#060911] via-[#0B0F19] to-[#0B0F19] py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[#00EFFF] text-xs font-semibold uppercase tracking-wider mb-6">
            <Lock className="w-3.5 h-3.5" />
            Integración Privada &bull; Uso Individual
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 text-white">
            Coach Salud <span className="text-[#00EFFF]">Personal</span>
          </h1>

          {/* Official Declaration Box */}
          <div className="bg-gradient-to-r from-gray-900/90 to-gray-900/60 border-l-4 border-[#00EFFF] p-6 md:p-8 rounded-r-2xl shadow-2xl backdrop-blur-sm mb-8">
            <h2 className="text-lg font-semibold text-[#00EFFF] mb-3 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5" />
              Declaración Oficial de Propósito y Alcance
            </h2>
            <div className="space-y-4 text-gray-200 text-base md:text-lg leading-relaxed">
              <p>
                <strong>Coach Salud Personal</strong> es una integración privada
                de uso individual. No es un producto comercial, no está
                disponible para registro público y no ofrece servicios a
                terceros.
              </p>
              <p>
                Su función es consultar, con autorización del propietario de la
                cuenta, información de <strong>Google Health</strong> y{" "}
                <strong>Google Fit</strong> para preparar resúmenes personales
                semanales de actividad física, sueño y métricas corporales.
              </p>
              <p className="text-gray-400 text-sm md:text-base">
                Aquatechia aloja esta página informativa para identificar la
                integración y proporcionar su política de privacidad. Coach
                Salud Personal funciona como una automatización privada e
                independiente.
              </p>
            </div>
          </div>

          {/* Action Links */}
          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              href="/ia/coach-salud/privacidad"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#00EFFF] text-black font-semibold hover:bg-cyan-300 transition-all shadow-lg shadow-cyan-500/20"
            >
              <FileText className="w-4 h-4" />
              Ver Política de Privacidad
            </Link>
            <Link
              href="/ia/coach-salud/terminos"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gray-800/90 border border-gray-700 text-white font-semibold hover:bg-gray-700 transition-all"
            >
              <FileText className="w-4 h-4" />
              Ver Términos de Servicio
            </Link>
          </div>
        </div>
      </section>

      {/* Main Details Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* Features / Data Handled Grid */}
        <section>
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-white mb-3">
              Métricas y Datos Consultados
            </h2>
            <p className="text-gray-400">
              La integración opera estrictamente en modalidad de{" "}
              <strong className="text-cyan-300">solo lectura</strong> para las
              siguientes fuentes autorizadas:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-2xl hover:border-cyan-500/30 transition-all">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-[#00EFFF] flex items-center justify-center mb-4">
                <Footprints className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Actividad y Pasos
              </h3>
              <p className="text-sm text-gray-400">
                Conteo diario de pasos, distancia recorrida y minutos de
                actividad física registrados.
              </p>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-2xl hover:border-cyan-500/30 transition-all">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-[#00EFFF] flex items-center justify-center mb-4">
                <Moon className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Sueño y Descanso
              </h3>
              <p className="text-sm text-gray-400">
                Horas totales de sueño, desglose de fases y patrones de descanso
                semanales.
              </p>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-2xl hover:border-cyan-500/30 transition-all">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-[#00EFFF] flex items-center justify-center mb-4">
                <Scale className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Composición Corporal
              </h3>
              <p className="text-sm text-gray-400">
                Registro de peso, Índice de Masa Corporal (IMC) y porcentaje de
                grasa corporal cuando estén disponibles.
              </p>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-2xl hover:border-cyan-500/30 transition-all">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-[#00EFFF] flex items-center justify-center mb-4">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Frecuencia Cardíaca
              </h3>
              <p className="text-sm text-gray-400">
                Pulsaciones en reposo y rangos de frecuencia cardíaca durante la
                actividad física.
              </p>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-2xl hover:border-cyan-500/30 transition-all">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-[#00EFFF] flex items-center justify-center mb-4">
                <Bot className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Resúmenes con IA
              </h3>
              <p className="text-sm text-gray-400">
                Procesamiento analítico privado para sintetizar metas personales
                y progresos semanales.
              </p>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-2xl hover:border-cyan-500/30 transition-all">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-[#00EFFF] flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Sin Fines Comerciales
              </h3>
              <p className="text-sm text-gray-400">
                Cero publicidad, cero monetización y ninguna transferencia de
                datos a redes de marketing o terceros.
              </p>
            </div>
          </div>
        </section>

        {/* Technical Architecture Flow */}
        <section className="bg-gray-900/40 border border-gray-800 rounded-3xl p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
            Arquitectura y Flujo Técnico de la Integración
          </h2>
          <p className="text-gray-300 mb-8 leading-relaxed">
            Para garantizar la máxima transparencia exigida por las políticas de
            desarrolladores de Google, se describe el flujo técnico de los datos:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-black/40 border border-gray-800/80 p-6 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-[#00EFFF] px-2.5 py-1 rounded bg-cyan-500/10 border border-cyan-500/20">
                    PASO 1
                  </span>
                  <Database className="w-5 h-5 text-gray-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">
                  1. Autenticación y Supabase
                </h3>
                <p className="text-sm text-gray-400">
                  Los tokens de acceso OAuth se almacenan de forma segura y
                  cifrada en una base de datos privada de Supabase perteneciente
                  al usuario.
                </p>
              </div>
            </div>

            <div className="bg-black/40 border border-gray-800/80 p-6 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-[#00EFFF] px-2.5 py-1 rounded bg-cyan-500/10 border border-cyan-500/20">
                    PASO 2
                  </span>
                  <Bot className="w-5 h-5 text-gray-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">
                  2. Procesamiento y Coach IA
                </h3>
                <p className="text-sm text-gray-400">
                  Un modelo de inteligencia artificial analiza las métricas de
                  la semana y genera reportes derivados guardados como archivos
                  privados de Coach.
                </p>
              </div>
            </div>

            <div className="bg-black/40 border border-gray-800/80 p-6 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-[#00EFFF] px-2.5 py-1 rounded bg-cyan-500/10 border border-cyan-500/20">
                    PASO 3
                  </span>
                  <MessageSquare className="w-5 h-5 text-gray-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">
                  3. Entrega a Slack Personal
                </h3>
                <p className="text-sm text-gray-400">
                  Los resúmenes ejecutivos cortos se envían exclusivamente al
                  espacio/canal de Slack privado del propio usuario.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Guarantees & Revocation */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-900/30 border border-gray-800 p-6 md:p-8 rounded-2xl space-y-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-[#00EFFF]" />
              Compromisos de Privacidad
            </h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-[#00EFFF] mt-0.5">•</span>
                <span>
                  <strong>Acceso de solo lectura:</strong> No se realizan
                  modificaciones ni escrituras en tu cuenta de Google.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#00EFFF] mt-0.5">•</span>
                <span>
                  <strong>Cero venta de datos:</strong> No se venden, ceden ni
                  utilizan tus datos para fines publicitarios ni creación de
                  perfiles comerciales.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#00EFFF] mt-0.5">•</span>
                <span>
                  <strong>Sin registro público:</strong> La aplicación está
                  estrictamente restringida para la cuenta autorizada del
                  desarrollador/propietario.
                </span>
              </li>
            </ul>
          </div>

          <div className="bg-gray-900/30 border border-gray-800 p-6 md:p-8 rounded-2xl space-y-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <ExternalLink className="w-5 h-5 text-[#00EFFF]" />
              Revocación y Contacto
            </h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              Puedes revocar los permisos de acceso de esta integración en
              cualquier instante directamente desde la configuración de tu cuenta
              de Google:
            </p>
            <a
              href="https://myaccount.google.com/permissions"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-[#00EFFF] hover:underline"
            >
              Administrar permisos en myaccount.google.com/permissions
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <div className="pt-2 border-t border-gray-800/80 text-xs text-gray-400">
              <p>
                Para solicitar la supresión completa de tokens y reportes
                almacenados, contáctanos a:{" "}
                <span className="text-gray-200 font-mono">
                  privacy@aquatechia.com
                </span>
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
