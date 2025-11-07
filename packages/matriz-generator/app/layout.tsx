import "./globals.css";
import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "EIA Matrix Studio - Matrices de Evaluación de Impacto Ambiental",
    template: "%s | EIA Matrix Studio",
  },
  description:
    "Herramienta educativa interactiva para aprender, construir y comparar matrices de Evaluación de Impacto Ambiental: Leopold, Conesa y Battelle-Columbus. Ideal para estudiantes y profesionales.",
  keywords: [
    "EIA",
    "evaluación impacto ambiental",
    "matriz leopold",
    "matriz conesa",
    "battelle columbus",
    "educación ambiental",
    "herramienta EIA",
  ],
  authors: [{ name: "Pablo Cubides" }],
  creator: "Pablo Cubides",
  publisher: "EIA Matrix Studio",
  metadataBase: new URL("https://eia-matrix-studio.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "EIA Matrix Studio - Matrices de Evaluación de Impacto Ambiental",
    description:
      "Herramienta educativa interactiva para matrices de EIA: Leopold, Conesa y Battelle",
    url: "https://eia-matrix-studio.vercel.app",
    siteName: "EIA Matrix Studio",
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EIA Matrix Studio",
    description:
      "Herramienta educativa para matrices de Evaluación de Impacto Ambiental",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-white text-black antialiased">
        <div className="min-h-screen">
          <header className="border-b py-4 px-6">
            <h1 className="text-2xl font-bold">EIA Matrix Studio</h1>
          </header>
          <main className="p-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
