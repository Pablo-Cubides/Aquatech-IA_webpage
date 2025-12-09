import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title:
    "Parámetros de Decodificación (LLM Tune) | Herramientas IA | AquatechIA",
  description:
    "Playground educativo interactivo para experimentar con parámetros de LLM: Temperature, Top-k, Top-p y penalización por repetición. Visualiza cómo afectan la generación de texto.",
  keywords: [
    "temperatura LLM",
    "top-k sampling",
    "top-p nucleus sampling",
    "parámetros de decodificación",
    "generación de texto",
    "LLM playground",
    "machine learning",
    "inteligencia artificial",
    "AquatechIA",
  ],
  openGraph: {
    title: "Parámetros de Decodificación (LLM Tune) | AquatechIA",
    description:
      "Experimenta con Temperature, Top-k, Top-p y más en este playground interactivo para entender la generación de texto con IA.",
    type: "website",
    locale: "es_ES",
    url: "https://aquatechia.com/ia/herramientas/parametros-decodificacion",
    siteName: "AquatechIA",
    images: [
      {
        url: "https://aquatechia.com/images/og/parametros-decodificacion.jpg",
        width: 1200,
        height: 630,
        alt: "LLM Tune - Explorador de Parámetros de Decodificación",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LLM Tune - Parámetros de Decodificación | AquatechIA",
    description:
      "Playground interactivo para experimentar con parámetros de modelos de lenguaje",
    images: ["https://aquatechia.com/images/og/parametros-decodificacion.jpg"],
  },
  alternates: {
    canonical:
      "https://aquatechia.com/ia/herramientas/parametros-decodificacion",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ParametrosDecodificacionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
