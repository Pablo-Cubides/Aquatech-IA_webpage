import Link from "next/link";
import Image from "next/image";
import { Space_Grotesk, Noto_Sans } from "next/font/google";
import { ChevronRight } from "lucide-react";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-space",
});

const notoSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-noto",
});

export const metadata = {
  title: "Aquatech IA - Innovación y Sostenibilidad",
  description:
    "Plataforma de Inteligencia Artificial y Gestión Ambiental. Tecnología para un futuro sostenible.",
};

export default function Home() {
  return (
    <div
      className={`${notoSans.variable} ${spaceGrotesk.variable} h-screen relative overflow-hidden`}
    >
      {/* Fondo dividido con texturas */}
      <div className="absolute inset-0 flex">
        {/* Lado Negro (IA) */}
        <div className="w-1/2 bg-black relative overflow-hidden">
          {/* Textura grid */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `repeating-linear-gradient(0deg, rgba(255,255,255,0.05) 0px, transparent 1px, transparent 40px),
                               repeating-linear-gradient(90deg, rgba(255,255,255,0.05) 0px, transparent 1px, transparent 40px)`,
            }}
          />
          {/* Efectos de luz */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        {/* Lado Blanco (Ambiental) */}
        <div className="w-1/2 bg-white relative overflow-hidden">
          {/* Textura dots */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, rgba(0,0,0,0.15) 1px, transparent 0)`,
              backgroundSize: "32px 32px",
            }}
          />
          {/* Efectos de luz */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-green-500/15 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
      </div>

      {/* Línea divisoria vertical central con efecto glow */}
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gray-400 to-transparent transform -translate-x-1/2 z-10">
        <div className="absolute inset-0 w-2 -ml-[3px] bg-gradient-to-b from-transparent via-white/50 to-transparent blur-sm" />
      </div>

      {/* Contenido principal */}
      <div className="relative z-20 h-full flex flex-col items-center justify-center px-4 py-8">
        {/* Logo principal */}
        <div className="text-center mb-8 animate-in fade-in slide-in-from-top-8 duration-1000">
          <div className="flex justify-center">
            <div className="relative">
              <Image
                src="/images/Logo Aquatech - IA 512 - sin fondo.png"
                alt="Aquatech IA"
                width={280}
                height={280}
                className="object-contain drop-shadow-2xl animate-in zoom-in duration-700"
                priority
              />
              {/* Glow effect alrededor del logo */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-green-500/20 rounded-full blur-3xl -z-10 animate-pulse" />
            </div>
          </div>
        </div>

        {/* Tarjetas de portales */}
        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-6">
          {/* Portal IA */}
          <Link
            href="/ia"
            aria-label="Ir al portal de Inteligencia Artificial"
            className="group relative h-[320px] overflow-hidden rounded-2xl animate-in fade-in slide-in-from-left-8 duration-1000 delay-200"
          >
            {/* Imagen de fondo */}
            <div className="absolute inset-0">
              <Image
                src="/images/technology-hero.jpg"
                alt="Tecnología e Inteligencia Artificial"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                priority
              />
              {/* Overlay oscuro */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-black/20 group-hover:from-black/70 group-hover:via-black/50 transition-all duration-500" />
              {/* Textura */}
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `repeating-linear-gradient(45deg, rgba(255,255,255,0.05) 0px, transparent 2px, transparent 10px)`,
                }}
              />
            </div>

            {/* Contenido */}
            <div className="relative h-full flex flex-col items-center justify-center p-8 text-center">
              <h2
                className="text-4xl md:text-5xl font-bold mb-3 text-white group-hover:text-cyan-400 transition-colors duration-300"
                style={{ fontFamily: "var(--font-space)" }}
              >
                Inteligencia
                <br />
                Artificial
              </h2>

              <p className="text-gray-300 text-base mb-6 max-w-sm group-hover:text-gray-100 transition-colors duration-300">
                Modelos generativos e IA para transformar tu día a día
              </p>

              <div className="flex items-center gap-2 text-cyan-400 font-semibold group-hover:gap-4 transition-all duration-300">
                <span>Explorar portal</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </div>

              {/* Decoración */}
              <div className="absolute top-6 right-6 w-24 h-24 border border-cyan-500/30 rounded-full group-hover:scale-150 group-hover:opacity-0 transition-all duration-700" />
              <div className="absolute bottom-6 left-6 w-20 h-20 border border-blue-500/30 rounded-full group-hover:scale-150 group-hover:opacity-0 transition-all duration-700 delay-100" />
            </div>
          </Link>

          {/* Portal Ambiental */}
          <Link
            href="/ambiental"
            aria-label="Ir al portal de Gestión Ambiental"
            className="group relative h-[320px] overflow-hidden rounded-2xl animate-in fade-in slide-in-from-right-8 duration-1000 delay-200"
          >
            {/* Imagen de fondo */}
            <div className="absolute inset-0">
              <Image
                src="/images/mountains-hero.jpg"
                alt="Gestión Ambiental y Sostenibilidad"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                priority
              />
              {/* Overlay claro */}
              <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-white/40 to-white/20 group-hover:from-white/70 group-hover:via-white/50 transition-all duration-500" />
              {/* Textura */}
              <div
                className="absolute inset-0 opacity-[0.08]"
                style={{
                  backgroundImage: `radial-gradient(circle at 2px 2px, rgba(0,119,182,0.3) 1px, transparent 0)`,
                  backgroundSize: "24px 24px",
                }}
              />
            </div>

            {/* Contenido */}
            <div className="relative h-full flex flex-col items-center justify-center p-8 text-center">
              <h2
                className="text-4xl md:text-5xl font-bold mb-3 text-gray-900 group-hover:text-green-600 transition-colors duration-300"
                style={{ fontFamily: "var(--font-space)" }}
              >
                Gestión
                <br />
                Ambiental
              </h2>

              <p className="text-gray-700 text-base mb-6 max-w-sm group-hover:text-gray-900 transition-colors duration-300">
                Mapas, normas y herramientas para un planeta sostenible
              </p>

              <div className="flex items-center gap-2 text-green-600 font-semibold group-hover:gap-4 transition-all duration-300">
                <span>Explorar portal</span>
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </div>

              {/* Decoración */}
              <div className="absolute top-6 left-6 w-24 h-24 border border-green-500/30 rounded-full group-hover:scale-150 group-hover:opacity-0 transition-all duration-700" />
              <div className="absolute bottom-6 right-6 w-20 h-20 border border-blue-500/30 rounded-full group-hover:scale-150 group-hover:opacity-0 transition-all duration-700 delay-100" />
            </div>
          </Link>
        </div>

        {/* Footer minimalista */}
        <div className="mt-8 text-center animate-in fade-in duration-1000 delay-500">
          <p className="text-xs text-gray-500">
            © 2025 Aquatech IA · Innovación en cada gota
          </p>
        </div>
      </div>
    </div>
  );
}
