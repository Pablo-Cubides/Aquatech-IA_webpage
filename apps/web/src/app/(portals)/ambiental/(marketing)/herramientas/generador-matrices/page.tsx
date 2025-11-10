import React from "react";
import fs from "fs";
import path from "path";
import type { Metadata } from "next";
import ClientHeroTabs from "./ClientHeroTabs";

export const metadata: Metadata = {
  title: "Generador de Matrices EIA | Herramientas",
  description:
    "Generador de matrices de Evaluación de Impacto Ambiental (Leopold, Conesa, Battelle). Aprende y construye matrices paso a paso.",
  keywords: [
    "matriz leopold",
    "matriz conesa",
    "battelle columbus",
    "EIA",
    "evaluación ambiental",
  ],
};

export default function GeneratorLanding() {
  // Load knowledge from public/knowledge.json
  let knowledge = {
    fundamentos: [
      {
        text: "Las matrices de Evaluación de Impacto Ambiental son herramientas sistemáticas que permiten identificar, valorar y comparar los efectos ambientales de un proyecto sobre los factores del medio ambiente.",
      },
    ],
    definiciones: [],
    ejemplos: {},
  };

  try {
    const knowledgePath = path.join(process.cwd(), "public", "knowledge.json");
    if (fs.existsSync(knowledgePath)) {
      const fileContent = fs.readFileSync(knowledgePath, "utf8");
      knowledge = JSON.parse(fileContent);
    }
  } catch (error) {
    console.error("Error loading knowledge.json:", error);
  }

  return (
    <div className="max-w-7xl mx-auto">
      <ClientHeroTabs knowledge={knowledge} />
    </div>
  );
}
