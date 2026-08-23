import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Herramientas de Gestión Ambiental",
  description:
    "Calculadoras de calidad de agua (IRCA, WQI), calidad del aire (AQI, ICA), análisis de correlaciones, visor de mapas GIS y base de datos de normas ambientales.",
  keywords: [
    "herramientas ambientales",
    "calidad del agua",
    "IRCA",
    "calidad del aire",
    "AQI",
    "visor GIS",
    "normas ambientales",
    "evaluación impacto ambiental",
    "AquatechIA",
  ],
  alternates: {
    canonical: "/ambiental/herramientas",
  },
  openGraph: {
    title: "Herramientas de Gestión Ambiental | AquatechIA",
    description:
      "Calculadoras de calidad de agua, calidad del aire, visor de mapas y análisis de normativas ambientales.",
    type: "website",
    url: "/ambiental/herramientas",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Herramientas Ambientales - AquatechIA",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Herramientas de Gestión Ambiental | AquatechIA",
    description:
      "Calculadoras de calidad de agua, aire, mapas GIS y normas ambientales.",
  },
};

export default function AmbientalHerramientasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
