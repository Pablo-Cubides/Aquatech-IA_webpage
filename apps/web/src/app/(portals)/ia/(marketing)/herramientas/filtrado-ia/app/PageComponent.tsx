"use client";

import MenuCasos from "../components/MenuCasos";
import VisualizadorCaso from "../components/VisualizadorCaso";
import { CasosProvider } from "../context/CasosContext";
import { WebPageStructuredData } from "@/components/seo/StructuredData";
import { AuthoritativeReferences } from "@/components/seo/AuthoritativeReferences";

export default function Home() {
  return (
    <>
      <WebPageStructuredData
        title="Cómo la IA Filtra Respuestas | Aquatech IA"
        description="Comprende los mecanismos de seguridad, moderación y filtrado que utilizan los modelos de IA para analizar y clasificar las respuestas generadas."
        url="https://aquatechia.com/ia/herramientas/filtrado-ia"
        datePublished="2024-06-01"
        dateModified="2026-09-06"
      />
      <CasosProvider>
        <main className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <div className="flex justify-center my-6">
            <img
              src="/images/portal-ia/herramientas/filtrado-ia-logo.png"
              alt="FiltrarIA"
              className="h-auto w-80 md:w-96 object-contain"
            />
          </div>

          <div className="max-w-4xl mx-auto text-center mb-10">
            <h1 className="text-3xl md:text-5xl font-bold text-cyan-400 mb-4">
              Cómo la IA filtra sus respuestas
            </h1>
            <p className="text-base md:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Esta herramienta interactiva ilustra los procesos de moderación, guardrails éticos, filtros heurísticos y técnicas de alineamiento (RLHF/RLAIF) implementados para evitar la generación de respuestas dañinas o sesgadas en sistemas de inteligencia artificial.
            </p>
          </div>

          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 justify-center items-start">
            <MenuCasos />
            <VisualizadorCaso />
          </div>

          {/* Fundamentación Teórica y Mecanismos de Moderación */}
          <section className="max-w-6xl mx-auto mt-20 pt-12 border-t border-slate-800 text-slate-300 space-y-8">
            <div className="bg-slate-900/80 rounded-2xl p-8 border border-slate-800 shadow-xl">
              <h2 className="text-2xl md:text-3xl font-bold text-cyan-400 mb-4">
                Mecanismos de Filtrado, Moderación y Seguridad en Modelos de Lenguaje
              </h2>
              <p className="text-slate-300 leading-relaxed mb-6">
                Los sistemas de inteligencia artificial generativa no solo deben ser capaces de predecir el siguiente token de manera probabilística, sino que requieren rigurosos marcos de alineamiento de seguridad para prevenir la divulgación de material peligroso, información confidencial, incitación al odio o instrucciones de explotación cibernética.
              </p>

              <div className="grid md:grid-cols-3 gap-6 text-sm">
                <div className="bg-slate-950/60 p-5 rounded-xl border border-slate-800">
                  <h3 className="font-bold text-cyan-300 mb-2">1. Guardrails de Entrada (Input Filtering)</h3>
                  <p className="text-slate-400 leading-relaxed">
                    Antes de que el prompt alcance la red neuronal, analizadores léxicos y clasificadores ligeros de toxicidad examinan la entrada en busca de patrones de inyección de prompt (jailbreaks), lenguaje ofensivo o violaciones a las políticas de uso establecidas.
                  </p>
                </div>

                <div className="bg-slate-950/60 p-5 rounded-xl border border-slate-800">
                  <h3 className="font-bold text-blue-400 mb-2">2. Alineamiento (RLHF & Constitutional AI)</h3>
                  <p className="text-slate-400 leading-relaxed">
                    Durante la etapa de post-entrenamiento, el modelo se calibra mediante aprendizaje por refuerzo a partir de retroalimentación humana (RLHF) y principios éticos explícitos (Constitutional AI), aprendiendo a declinar peticiones perjudiciales con explicaciones fundamentadas.
                  </p>
                </div>

                <div className="bg-slate-950/60 p-5 rounded-xl border border-slate-800">
                  <h3 className="font-bold text-emerald-400 mb-2">3. Clasificadores de Salida (Output Guards)</h3>
                  <p className="text-slate-400 leading-relaxed">
                    Las respuestas generadas en tiempo de inferencia son evaluadas por modelos de moderación secundarios especializados que miden vectores de riesgo (daño autoinfligido, violencia, discriminación) antes de entregar el flujo de texto al usuario final.
                  </p>
                </div>
              </div>
            </div>

            {/* Referencias Oficiales Autorizadas GEO */}
            <div className="mt-12">
              <AuthoritativeReferences theme="dark" />
            </div>
          </section>
        </main>
      </CasosProvider>
    </>
  );
}
