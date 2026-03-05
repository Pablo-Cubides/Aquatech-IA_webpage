import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mapa Ambiental - Visualización de Datos Ambientales",
  description:
    "Plataforma interactiva para visualizar, analizar y gestionar datos ambientales en Colombia. Sistema de mapas con datos de calidad del agua, biodiversidad y monitoreo ambiental.",
  keywords: [
    "datos ambientales",
    "calidad del agua",
    "biodiversidad",
    "monitoreo ambiental",
    "Colombia",
    "GIS",
    "mapas interactivos",
    "geolocalización",
    "análisis ambiental",
    "datasets ambientales",
  ],
  authors: [{ name: "AquatechIA" }],
  creator: "AquatechIA",
  publisher: "AquatechIA",
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: "/ambiental/herramientas/visor-mapas-ambientales",
    title: "Mapa Ambiental - Visualización de Datos Ambientales | AquatechIA",
    description:
      "Plataforma interactiva para visualizar y analizar datos ambientales en Colombia con mapas interactivos y herramientas de análisis.",
    siteName: "AquatechIA",
    images: [
      {
        url: "/images/og-mapa-ambiental.jpg",
        width: 1200,
        height: 630,
        alt: "Mapa Ambiental - Visualización de Datos",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mapa Ambiental - Visualización de Datos Ambientales",
    description:
      "Plataforma interactiva para visualizar y analizar datos ambientales en Colombia",
    images: ["/images/og-mapa-ambiental.jpg"],
  },
};

export default function VisorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-2 text-sm text-center text-black border-t bg-warning-100 border-warning-300 text-warning-800">
        ⚠️ Los datos podrán ser borrados si el administrador lo considera
      </div>
    </div>
  );
}
