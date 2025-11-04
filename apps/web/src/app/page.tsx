import Link from "next/link";
import Image from "next/image";
import { Space_Grotesk, Noto_Sans } from "next/font/google";

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
  title: "Aquatech IA",
  description:
    "Landing dividida entre IA (tema oscuro) y Gestión Ambiental (tema claro).",
};

export default function Home() {
  return (
    <div
      className={`${notoSans.variable} ${spaceGrotesk.variable} min-h-screen flex flex-col items-center justify-center bg-gray-50`}
      style={{ fontFamily: "var(--font-noto)" }}
    >
      {/* Header */}
      <header className="w-full max-w-5xl mx-auto pt-10 pb-8">
        <h1
          className="text-center text-4xl font-bold tracking-wide text-gray-900"
          style={{ fontFamily: "var(--font-space)" }}
        >
          Aquatech IA
        </h1>
      </header>

      {/* Tarjetas centradas */}
      <div className="w-full max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-4 pb-12">
        {/* IA */}
        <Link
          href="/ia"
          aria-label="Ir al portal de Inteligencia Artificial"
          className="group bg-black rounded-2xl shadow-lg flex flex-col items-center py-10 px-6 transition-all duration-500 ease-out hover:shadow-2xl hover:-translate-y-1"
        >
          <Image
            src="/images/technology-hero.jpg"
            alt="Ilustración tecnológica abstracta de IA"
            width={480}
            height={270}
            className="object-cover rounded-xl mb-8 shadow-md transition-transform duration-500 group-hover:scale-105"
            priority
          />
          <h2
            className="text-white text-4xl font-bold mb-4 text-center transition-colors duration-300 group-hover:text-cyan-400"
            style={{ fontFamily: "var(--font-space)" }}
          >
            Inteligencia Artificial
          </h2>
          <p className="text-gray-400 text-lg text-center transition-colors duration-300 group-hover:text-gray-200">
            Modelos generativos e inteligencia artificial para la vida diaria.
          </p>
        </Link>

        {/* Ambiental */}
        <Link
          href="/ambiental"
          aria-label="Ir al portal de Gestión Ambiental"
          className="group bg-white rounded-2xl shadow-lg flex flex-col items-center py-10 px-6 transition-all duration-500 ease-out hover:shadow-2xl hover:-translate-y-1"
        >
          <Image
            src="/images/mountains-hero.jpg"
            alt="Ilustración paisajística azul y verde"
            width={480}
            height={270}
            className="object-cover rounded-xl mb-8 shadow-md transition-transform duration-500 group-hover:scale-105"
            priority
          />
          <h2
            className="text-gray-900 text-4xl font-bold mb-4 text-center transition-colors duration-300 group-hover:text-blue-600"
            style={{ fontFamily: "var(--font-space)" }}
          >
            Gestión Ambiental
          </h2>
          <p className="text-gray-600 text-lg text-center transition-colors duration-300 group-hover:text-gray-900">
            Mapas, normas y herramientas para un futuro sostenible.
          </p>
        </Link>
      </div>
    </div>
  );
}
