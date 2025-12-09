import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Cómo la IA Filtra Respuestas | Herramientas IA | AquatechIA",
  description:
    "Comprende los mecanismos de seguridad, moderación y filtrado que utilizan los modelos de IA para analizar y clasificar las respuestas generadas.",
  keywords: [
    "filtrado IA",
    "moderación de contenido",
    "seguridad IA",
    "RLHF",
    "content moderation",
    "safety AI",
    "clasificación de riesgo",
    "inteligencia artificial",
    "AquatechIA",
  ],
  openGraph: {
    title: "Cómo la IA Filtra Respuestas | AquatechIA",
    description:
      "Explora los sistemas de filtrado y moderación que protegen las respuestas de los modelos de IA.",
    type: "website",
    locale: "es_ES",
    url: "https://aquatechia.com/ia/herramientas/filtrado-ia",
    siteName: "AquatechIA",
    images: [
      {
        url: "https://aquatechia.com/images/og/filtrado-ia.jpg",
        width: 1200,
        height: 630,
        alt: "Filtrado de IA - Herramienta educativa de AquatechIA",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cómo la IA Filtra Respuestas | AquatechIA",
    description:
      "Aprende sobre moderación y seguridad en modelos de inteligencia artificial",
    images: ["https://aquatechia.com/images/og/filtrado-ia.jpg"],
  },
  alternates: {
    canonical: "https://aquatechia.com/ia/herramientas/filtrado-ia",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function FiltradoIALayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
