import type { Metadata } from "next";
import { Space_Grotesk, Noto_Sans } from "next/font/google";
import HeaderIA from "../../../components/nav/HeaderIA";
import FooterIA from "../../../components/nav/FooterIA";

const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || "https://aquatechia.com").trim().replace(/\/+$/, "");

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
  title: "Portal de Inteligencia Artificial | Modelos, Herramientas y Cursos | AquatechIA",
  description:
    "Explora modelos generativos, visualizaciones y herramientas prácticas de inteligencia artificial aplicadas al agua y ambiente. Productos, blog, cursos y recursos especializados para profesionales.",
  keywords: [
    "inteligencia artificial",
    "IA",
    "agua",
    "ambiente",
    "machine learning",
    "modelos generativos",
    "LLM",
    "sostenibilidad",
    "tecnología ambiental",
    "IA educativa",
  ],
  openGraph: {
    title: "Portal IA | Inteligencia Artificial | AquatechIA",
    description:
      "Modelos generativos e inteligencia artificial para la vida diaria y la sostenibilidad",
    type: "website",
    locale: "es_ES",
    url: `${baseUrl}/ia`,
    siteName: "AquatechIA",
    images: [
      {
        url: `${baseUrl}/images/og-image-ia.jpg`,
        width: 1200,
        height: 630,
        alt: "Portal IA - Inteligencia Artificial con AquatechIA",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Portal IA | AquatechIA",
    description: "Inteligencia Artificial aplicada al agua y ambiente",
    images: [`${baseUrl}/images/og-image-ia.jpg`],
    creator: "@aquatechia",
  },
  alternates: {
    canonical: `${baseUrl}/ia`,
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
