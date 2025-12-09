import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Visor de Difusión (PixelGen) | Herramientas IA | AquatechIA",
  description:
    "Visualiza paso a paso cómo los modelos de difusión generan imágenes desde ruido puro. Herramienta educativa interactiva para entender Stable Diffusion, DALL-E y similares.",
  keywords: [
    "difusión",
    "generación de imágenes",
    "IA generativa",
    "Stable Diffusion",
    "DALL-E",
    "modelos de difusión",
    "denoising",
    "inteligencia artificial",
    "AquatechIA",
  ],
  openGraph: {
    title: "Visor de Difusión (PixelGen) | AquatechIA",
    description:
      "Explora visualmente cómo los modelos de difusión transforman ruido en imágenes fotorrealistas.",
    type: "website",
    locale: "es_ES",
    url: "https://aquatechia.com/ia/herramientas/visor-difusion",
    siteName: "AquatechIA",
    images: [
      {
        url: "https://aquatechia.com/images/og/visor-difusion.jpg",
        width: 1200,
        height: 630,
        alt: "Visor de Difusión - Herramienta educativa de IA",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Visor de Difusión | AquatechIA",
    description:
      "Visualiza el proceso de difusión para generación de imágenes con IA",
    images: ["https://aquatechia.com/images/og/visor-difusion.jpg"],
  },
  alternates: {
    canonical: "https://aquatechia.com/ia/herramientas/visor-difusion",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function VisorDifusionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
