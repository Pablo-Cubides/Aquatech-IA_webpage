import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Herramientas de IA | AquatechIA",
  description:
    "Explora nuestros módulos educativos de inteligencia artificial: visualizadores de LLMs, difusión de imágenes, parámetros de decodificación y filtrado de respuestas.",
  keywords: [
    "herramientas IA",
    "inteligencia artificial",
    "LLM",
    "modelos de lenguaje",
    "difusión",
    "generación de imágenes",
    "educación IA",
    "machine learning",
    "AquatechIA",
  ],
  openGraph: {
    title: "Herramientas de IA | AquatechIA",
    description:
      "Módulos educativos interactivos para aprender sobre inteligencia artificial: LLMs, difusión, filtrado y más.",
    type: "website",
    locale: "es_ES",
    url: "https://aquatechia.com/ia/herramientas",
    siteName: "AquatechIA",
    images: [
      {
        url: "https://aquatechia.com/images/og/herramientas-ia.jpg",
        width: 1200,
        height: 630,
        alt: "Herramientas de IA - AquatechIA",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Herramientas de IA | AquatechIA",
    description: "Módulos educativos interactivos de inteligencia artificial",
    images: ["https://aquatechia.com/images/og/herramientas-ia.jpg"],
  },
  alternates: {
    canonical: "https://aquatechia.com/ia/herramientas",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function HerramientasIALayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
