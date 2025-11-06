import type { Metadata } from "next";
import { Space_Grotesk, Noto_Sans } from "next/font/google";
import HeaderIA from "../../../components/nav/HeaderIA";
import FooterIA from "../../../components/nav/FooterIA";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-space",
});

const notoSans = Noto_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-noto",
});

export const metadata: Metadata = {
  title: "Aquatech IA - Inteligencia Artificial para el Agua y Ambiente",
  description:
    "Explora modelos generativos, visualizaciones y herramientas prácticas de IA aplicadas al agua y ambiente. Productos, blog y recursos especializados.",
  keywords: [
    "inteligencia artificial",
    "IA",
    "agua",
    "ambiente",
    "machine learning",
    "modelos generativos",
    "sostenibilidad",
    "tecnología ambiental",
  ],
  openGraph: {
    title: "Aquatech IA - Inteligencia Artificial para el Agua y Ambiente",
    description:
      "Modelos generativos e inteligencia artificial para la vida diaria",
    type: "website",
    locale: "es_ES",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aquatech IA",
    description: "Inteligencia Artificial aplicada al agua y ambiente",
  },
};

export default function IALayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${notoSans.variable} ${spaceGrotesk.variable} min-h-screen flex flex-col bg-black text-white`}
      style={
        {
          fontFamily: "var(--font-noto), 'Noto Sans', sans-serif",
          // CSS custom properties for IA theme
          "--primary-cyan": "#00efff",
          "--text-primary": "#ffffff",
          "--text-secondary": "#cccccc",
          "--dark-bg-1": "#000000",
          "--dark-bg-2": "#0a0a0f",
          "--dark-bg-3": "#10111A",
        } as React.CSSProperties
      }
    >
      <HeaderIA />
      <main className="flex-1">{children}</main>
      <FooterIA />
    </div>
  );
}
