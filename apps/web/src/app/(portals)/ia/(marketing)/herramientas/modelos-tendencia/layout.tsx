import type { Metadata } from "next";
import React from "react";
import {
  ToolStructuredData,
  BreadcrumbStructuredData,
} from "@/components/seo/StructuredData";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://aquatechia.com";
const canonicalUrl = `${baseUrl}/ia/herramientas/modelos-tendencia`;

export const metadata: Metadata = {
  title: "Modelos de IA en Tendencia | Hugging Face Explorer | AquatechIA",
  description:
    "Descubre los modelos de inteligencia artificial más populares de Hugging Face. Explora tendencias semanales y mensuales en text-generation, image-generation, text-to-speech y más.",
  keywords: [
    "modelos de IA",
    "Hugging Face",
    "trending models",
    "machine learning",
    "deep learning",
    "transformers",
    "text-generation",
    "image-generation",
    "LLM",
    "inteligencia artificial",
    "AquatechIA",
  ],
  openGraph: {
    title: "Modelos de IA en Tendencia | AquatechIA",
    description:
      "Explora los modelos de IA más populares de Hugging Face con estadísticas de likes, descargas y tendencias.",
    type: "website",
    locale: "es_ES",
    url: canonicalUrl,
    siteName: "AquatechIA",
    images: [
      {
        url: `${baseUrl}/images/og/modelos-tendencia.jpg`,
        width: 1200,
        height: 630,
        alt: "Modelos de IA en Tendencia - Hugging Face Explorer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Modelos de IA en Tendencia | AquatechIA",
    description:
      "Descubre los modelos de IA más populares de Hugging Face esta semana",
    images: [`${baseUrl}/images/og/modelos-tendencia.jpg`],
  },
  alternates: {
    canonical: canonicalUrl,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ModelosTendenciaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ToolStructuredData
        name="Modelos de IA en Tendencia"
        description="Explorador de modelos de inteligencia artificial populares de Hugging Face con estadísticas en tiempo real."
        url={canonicalUrl}
        keywords={[
          "Hugging Face",
          "modelos IA",
          "machine learning",
          "trending",
          "transformers",
        ]}
      />
      <BreadcrumbStructuredData
        items={[
          { name: "Inicio", url: `${baseUrl}/ia` },
          { name: "Herramientas", url: `${baseUrl}/ia/herramientas` },
          { name: "Modelos en Tendencia", url: canonicalUrl },
        ]}
      />
      {children}
    </>
  );
}
