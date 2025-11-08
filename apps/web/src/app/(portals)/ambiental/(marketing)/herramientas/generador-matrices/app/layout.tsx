import "./globals.css";
import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "EIA Matrix Studio - Matrices de Evaluación de Impacto Ambiental",
    template: "%s | EIA Matrix Studio",
  },
  description:
    "Herramienta educativa interactiva para aprender, construir y comparar matrices de Evaluación de Impacto Ambiental: Leopold, Conesa y Battelle-Columbus.",
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
