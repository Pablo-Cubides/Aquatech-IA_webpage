"use client";

import React from "react";

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

interface ModelCardProps {
  model: HFModel;
  rank: number;
}

const PIPELINE_COLORS: Record<string, string> = {
  "text-generation": "from-purple-500 to-purple-700",
  "text-to-image": "from-pink-500 to-rose-600",
  "text-to-speech": "from-green-500 to-emerald-600",
  "image-text-to-text": "from-blue-500 to-cyan-600",
  "automatic-speech-recognition": "from-orange-500 to-amber-600",
  translation: "from-indigo-500 to-violet-600",
  "fill-mask": "from-teal-500 to-cyan-600",
  default: "from-gray-500 to-gray-700",
};

const PIPELINE_LABELS: Record<string, string> = {
  "text-generation": "Generación de Texto",
  "text-to-image": "Texto a Imagen",
  "text-to-speech": "Texto a Voz",
  "image-text-to-text": "Imagen a Texto",
  "automatic-speech-recognition": "Reconocimiento de Voz",
  translation: "Traducción",
  "fill-mask": "Fill Mask",
};

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
}

function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Hoy";
  if (diffDays === 1) return "Ayer";
  if (diffDays < 7) return `Hace ${diffDays} días`;
  if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;
  return `Hace ${Math.floor(diffDays / 30)} meses`;
}

export default function ModelCard({ model, rank }: ModelCardProps) {
  const pipelineColor = model.pipeline_tag
    ? PIPELINE_COLORS[model.pipeline_tag] || PIPELINE_COLORS.default
    : PIPELINE_COLORS.default;

  const pipelineLabel = model.pipeline_tag
    ? PIPELINE_LABELS[model.pipeline_tag] || model.pipeline_tag
    : "Modelo";

  const huggingFaceUrl = `https://huggingface.co/${model.id}`;
  const modelName = model.id.split("/")[1] || model.id;

  // Get first 4 relevant tags (excluding common ones)
  const displayTags = model.tags
    .filter(
      (tag) =>
        !tag.startsWith("license:") &&
        !tag.startsWith("arxiv:") &&
        !tag.startsWith("region:") &&
        !tag.startsWith("base_model:") &&
        tag !== model.library_name &&
        tag !== model.pipeline_tag
    )
    .slice(0, 4);

  return (
    <article
      className="group relative bg-gradient-to-br from-[#1a1b2e]/80 to-[#10111A]/80 rounded-xl border border-[rgba(0,239,255,0.1)] hover:border-[rgba(0,239,255,0.3)] transition-all duration-300 overflow-hidden hover:shadow-lg hover:shadow-[rgba(0,239,255,0.1)]"
    >
      {/* Rank Badge */}
      <div className="absolute top-3 left-3 z-10">
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${
            rank <= 3
              ? "bg-gradient-to-br from-[#FFD21E] to-[#FF9500] text-[#10111A]"
              : "bg-[#10111A]/80 text-[#CCCCCC] border border-[rgba(0,239,255,0.2)]"
          }`}
        >
          {rank}
        </div>
      </div>

      {/* Pipeline Tag Badge */}
      {model.pipeline_tag && (
        <div className="absolute top-3 right-3 z-10">
          <span
            className={`px-2 py-1 rounded-md text-xs font-medium bg-gradient-to-r ${pipelineColor} text-white`}
          >
            {pipelineLabel}
          </span>
        </div>
      )}

      {/* Content */}
      <div className="p-5 pt-14">
        {/* Author */}
        <p className="text-xs text-[#00efff] font-medium mb-1 truncate">
          {model.author}
        </p>

        {/* Model Name */}
        <h3 className="text-lg font-bold text-white mb-2 truncate group-hover:text-[#00efff] transition-colors">
          {modelName}
        </h3>

        {/* Stats Row */}
        <div className="flex items-center gap-4 mb-3">
          <div className="flex items-center gap-1 text-sm">
            <span className="text-red-400">❤️</span>
            <span className="text-white font-medium">{formatNumber(model.likes)}</span>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <span className="text-green-400">⬇️</span>
            <span className="text-white font-medium">{formatNumber(model.downloads)}</span>
          </div>
          {model.trendingScore > 0 && (
            <div className="flex items-center gap-1 text-sm">
              <span className="text-[#FFD21E]">🔥</span>
              <span className="text-[#FFD21E] font-medium">{model.trendingScore}</span>
            </div>
          )}
        </div>

        {/* Tags */}
        {displayTags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {displayTags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 bg-[#10111A]/50 text-[#CCCCCC] text-xs rounded border border-[rgba(0,239,255,0.1)]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Library & Date */}
        <div className="flex items-center justify-between text-xs text-[#666666] mb-4">
          {model.library_name && (
            <span className="bg-[#10111A]/50 px-2 py-0.5 rounded">
              {model.library_name}
            </span>
          )}
          <span>{getRelativeTime(model.createdAt)}</span>
        </div>

        {/* CTA Button */}
        <a
          href={huggingFaceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center px-4 py-2.5 bg-gradient-to-r from-[#00efff] to-[#0095ff] text-[#10111A] rounded-lg font-semibold text-sm hover:from-white hover:to-white transition-all duration-300"
        >
          Ver en Hugging Face →
        </a>
      </div>
    </article>
  );
}
