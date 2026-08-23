import React from "react";
import { Metadata } from "next";
import { Space_Grotesk, Noto_Sans } from "next/font/google";
import HeaderAmbiental from "@/components/nav/HeaderAmbiental";
import FooterAmbiental from "@/components/nav/FooterAmbiental";
import { SITE_URL, DEFAULT_LOCALE } from "@/lib/site-config";

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
  title: "Portal de Gestión Ambiental | Normas, Mapas y Herramientas",
  description:
    "Herramientas de gestión ambiental, normatividad ambiental internacional, mapas interactivos, análisis de impacto ambiental, monitoreo de agua, aire, residuos y vertimientos. Soluciones sostenibles para profesionales.",
  keywords: [
    "gestión ambiental",
    "normativa ambiental",
    "sostenibilidad",
    "herramientas ambientales",
    "mapas ambientales",
    "evaluación ambiental",
    "calidad del agua",
    "calidad del aire",
    "residuos sólidos",
    "tecnología ambiental",
  ],
  openGraph: {
    title: "Portal Ambiental | AquatechIA",
    description:
      "Herramientas, normas y recursos para gestión ambiental sostenible. Mapas, análisis y soluciones.",
    type: "website",
    locale: DEFAULT_LOCALE,
    url: `${SITE_URL}/ambiental`,
    siteName: "AquatechIA",
    images: [
      {
        url: `${SITE_URL}/images/og-image-ambiental.jpg`,
        width: 1200,
        height: 630,
        alt: "Portal Ambiental - Gestión Sostenible con AquatechIA",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Portal Ambiental | AquatechIA",
    description: "Gestión ambiental sostenible con herramientas innovadoras",
    images: [`${SITE_URL}/images/og-image-ambiental.jpg`],
    creator: "@aquatechia",
  },
  alternates: {
    canonical: `${SITE_URL}/ambiental`,
  },
};

export default function AmbientalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${notoSans.variable} ${spaceGrotesk.variable} min-h-screen flex flex-col bg-white text-black`}
      style={
        {
          fontFamily: "var(--font-noto)",
          "--primary-blue": "#0077B6",
          "--success-green": "#10B981",
          "--text-primary": "#000000",
          "--text-secondary": "#666666",
          "--light-bg": "#ffffff",
        } as React.CSSProperties
      }
    >
      <HeaderAmbiental />
      <main className="flex-grow">{children}</main>
      <FooterAmbiental />
    </div>
  );
}
