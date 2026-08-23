import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Enlaces Oficiales y Recursos Directos",
  description:
    "Accede rápidamente a todos los portales, herramientas de IA y recursos ambientales de AquatechIA.",
  alternates: {
    canonical: "/links",
  },
  openGraph: {
    title: "Enlaces Oficiales y Recursos | AquatechIA",
    description:
      "Accede rápidamente a todos los portales y herramientas de AquatechIA.",
    type: "website",
    url: "/links",
  },
};

export default function LinksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
