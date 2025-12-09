"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import ModelCard from "./components/ModelCard";
import PeriodFilter from "./components/PeriodFilter";
import CategoryFilter from "./components/CategoryFilter";

interface HFModel {
  id: string;
  modelId: string;
  author: string;
  likes: number;
  downloads: number;
  trendingScore: number;
  pipeline_tag?: string;
  tags: string[];
  createdAt: string;
  library_name?: string;
}

interface APIResponse {
  models: HFModel[];
  cached: boolean;
  period: string;
  limit: number;
  category: string;
  error?: string;
}

const CATEGORIES = [
  { value: "all", label: "Todos", icon: "🌐" },
  { value: "text-generation", label: "Generación de Texto", icon: "💬" },
  { value: "text-to-image", label: "Texto a Imagen", icon: "🎨" },
  { value: "text-to-speech", label: "Texto a Voz", icon: "🔊" },
  { value: "image-text-to-text", label: "Imagen a Texto", icon: "👁️" },
  { value: "automatic-speech-recognition", label: "Reconocimiento de Voz", icon: "🎤" },
  { value: "translation", label: "Traducción", icon: "🌍" },
  { value: "fill-mask", label: "Fill Mask", icon: "🎭" },
];

export default function ModelosTendenciaPage() {
  const [models, setModels] = useState<HFModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<"week" | "month">("week");
  const [category, setCategory] = useState("all");
  const [cached, setCached] = useState(false);

  const fetchModels = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        period,
        limit: "20",
        ...(category !== "all" && { category }),
      });

      const response = await fetch(`/api/huggingface-trending?${params}`);
      const data: APIResponse = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setModels(data.models);
      setCached(data.cached);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar modelos");
      setModels([]);
    } finally {
      setLoading(false);
    }
  }, [period, category]);

  useEffect(() => {
    fetchModels();
  }, [fetchModels]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#000000] via-[#0A0E27] to-[#000000] text-white">
      {/* Header */}
      <header className="border-b border-[rgba(0,239,255,0.1)] bg-[#10111A]/80 backdrop-blur-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumbs */}
          <nav className="mb-6" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm text-[#CCCCCC]">
              <li>
                <Link href="/ia" className="hover:text-[#00efff] transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <span className="mx-2">/</span>
              </li>
              <li>
                <Link href="/ia/herramientas" className="hover:text-[#00efff] transition-colors">
                  Herramientas
                </Link>
              </li>
              <li>
                <span className="mx-2">/</span>
              </li>
              <li className="text-[#00efff] font-medium">Modelos en Tendencia</li>
            </ol>
          </nav>

          {/* Title Section */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FFD21E] to-[#FF9500] flex items-center justify-center shadow-lg shadow-[#FFD21E]/20">
                <span className="text-3xl">🤗</span>
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-[#00efff] bg-clip-text text-transparent">
                  Modelos de IA en Tendencia
                </h1>
                <p className="text-[#CCCCCC] mt-1">
                  Powered by{" "}
                  <a
                    href="https://huggingface.co"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#FFD21E] hover:underline"
                  >
                    Hugging Face
                  </a>
                </p>
              </div>
            </div>

            {cached && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-[#10b981]/10 border border-[#10b981]/30 rounded-full text-sm text-[#10b981]">
                <span>⚡</span>
                <span>Datos en caché</span>
              </div>
            )}
          </div>

          {/* Description */}
          <p className="mt-6 text-[#CCCCCC] max-w-3xl leading-relaxed">
            Explora los modelos de inteligencia artificial más populares de la comunidad Hugging Face.
            Filtra por período de tendencia y categoría para descubrir los últimos avances en machine learning.
          </p>
        </div>
      </header>

      {/* Filters Section */}
      <section className="sticky top-0 z-40 bg-[#10111A]/95 backdrop-blur-md border-b border-[rgba(0,239,255,0.1)] py-4">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
            <PeriodFilter period={period} onChange={setPeriod} />
            <CategoryFilter
              categories={CATEGORIES}
              selected={category}
              onChange={setCategory}
            />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-[#00efff]/30 border-t-[#00efff] rounded-full animate-spin mb-4" />
            <p className="text-[#CCCCCC]">Cargando modelos de Hugging Face...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-6xl mb-4">⚠️</div>
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={fetchModels}
              className="px-6 py-2 bg-[#00efff] text-[#10111A] rounded-lg font-semibold hover:bg-white transition-colors"
            >
              Reintentar
            </button>
          </div>
        ) : models.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-[#CCCCCC]">No se encontraron modelos para esta categoría.</p>
          </div>
        ) : (
          <>
            {/* Stats Bar */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-[#CCCCCC]">
                Mostrando <span className="text-white font-semibold">{models.length}</span> modelos
                {" "}—{" "}
                {period === "week" ? "Tendencia última semana" : "Tendencia último mes"}
              </p>
            </div>

            {/* Models Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {models.map((model, index) => (
                <ModelCard key={model.id} model={model} rank={index + 1} />
              ))}
            </div>
          </>
        )}
      </main>

      {/* Footer References */}
      <footer className="border-t border-[rgba(0,239,255,0.1)] bg-[#10111A]/50 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📚</span>
              <div>
                <p className="text-sm text-[#CCCCCC]">
                  Datos proporcionados por la{" "}
                  <a
                    href="https://huggingface.co/docs/hub/api"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#00efff] hover:underline"
                  >
                    API de Hugging Face Hub
                  </a>
                </p>
                <p className="text-xs text-[#666666] mt-1">
                  Los modelos mostrados pertenecen a sus respectivos autores y organizaciones.
                </p>
              </div>
            </div>
            <a
              href="https://huggingface.co/models"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#FFD21E] text-[#10111A] rounded-lg font-semibold hover:bg-[#FFE566] transition-colors"
            >
              <span>🤗</span>
              Ver todos en Hugging Face
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
