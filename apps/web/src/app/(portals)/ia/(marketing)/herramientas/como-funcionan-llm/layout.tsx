import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Cómo Funcionan los LLMs | Herramientas IA | AquatechIA",
  description:
    "Aprende paso a paso cómo funcionan los Grandes Modelos de Lenguaje (LLM): tokenización, embeddings, atención, probabilidades y generación autorregresiva de texto.",
  keywords: [
    "LLM",
    "modelos de lenguaje",
    "GPT",
    "Transformer",
    "tokenización",
    "embeddings",
    "atención",
    "NLP",
    "inteligencia artificial",
    "machine learning",
    "AquatechIA",
  ],
  openGraph: {
    title: "Cómo Funcionan los LLMs | AquatechIA",
    description:
      "Herramienta educativa interactiva para entender el funcionamiento interno de ChatGPT, GPT-4, Claude y otros LLMs.",
    type: "website",
    locale: "es_ES",
    url: "https://aquatechia.com/ia/herramientas/como-funcionan-llm",
    siteName: "AquatechIA",
    images: [
      {
        url: "https://aquatechia.com/images/og/como-funcionan-llm.jpg",
        width: 1200,
        height: 630,
        alt: "Cómo Funcionan los LLMs - Herramienta educativa de IA",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cómo Funcionan los LLMs | AquatechIA",
    description:
      "Explora visualmente el proceso interno de los modelos de lenguaje",
    images: ["https://aquatechia.com/images/og/como-funcionan-llm.jpg"],
  },
  alternates: {
    canonical: "https://aquatechia.com/ia/herramientas/como-funcionan-llm",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function ComoFuncionanLLMLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
