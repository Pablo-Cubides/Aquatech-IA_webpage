"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function LinkHubPage() {
  const [activeTheme, setActiveTheme] = useState<"ia" | "ambiental">("ia");

  const isIA = activeTheme === "ia";

  return (
    <div
      className={`min-h-screen transition-colors duration-500 py-10 px-4 flex flex-col items-center justify-between ${
        isIA ? "bg-[#0B0F19] text-white" : "bg-slate-50 text-slate-900"
      }`}
    >
      <div className="w-full max-w-md mx-auto flex flex-col items-center">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-2 border-cyan-400 p-1 shadow-xl bg-slate-900 flex items-center justify-center">
            <Image
              src="/logo.svg"
              alt="Aquatech IA Logo"
              width={80}
              height={80}
              className="object-contain"
              priority
              onError={(e) => {
                // Fallback if logo SVG path differs
                e.currentTarget.src = "/favicon.ico";
              }}
            />
          </div>

          <h1 className="text-2xl font-extrabold tracking-tight mb-1">
            Aquatech IA
          </h1>
          <p
            className={`text-xs max-w-xs mx-auto leading-relaxed ${
              isIA ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Tecnología para un futuro sostenible • Inteligencia Artificial &amp;
            Ingeniería Ambiental
          </p>
        </div>

        {/* Portal Brand Theme Selector */}
        <div
          className={`w-full p-1 rounded-full mb-8 flex text-xs font-bold border transition-all shadow-inner ${
            isIA
              ? "bg-slate-900/80 border-cyan-500/30"
              : "bg-slate-200 border-slate-300"
          }`}
        >
          <button
            onClick={() => setActiveTheme("ia")}
            className={`flex-1 py-2.5 rounded-full transition-all flex items-center justify-center gap-1.5 ${
              isIA
                ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md"
                : "text-gray-600 hover:text-black"
            }`}
          >
            <span>🤖</span> Tema IA
          </button>

          <button
            onClick={() => setActiveTheme("ambiental")}
            className={`flex-1 py-2.5 rounded-full transition-all flex items-center justify-center gap-1.5 ${
              !isIA
                ? "bg-gradient-to-r from-[#0077B6] to-[#10B981] text-white shadow-md"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <span>🌿</span> Tema Ambiental
          </button>
        </div>

        {/* Link Cards List */}
        <div className="w-full space-y-3.5">
          {/* Portal IA */}
          <Link
            href="/ia"
            className={`group w-full p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between shadow-lg hover:scale-[1.02] ${
              isIA
                ? "bg-gradient-to-r from-slate-900 to-cyan-950/70 border-cyan-500/40 hover:border-cyan-400"
                : "bg-white border-slate-200 hover:border-blue-500"
            }`}
          >
            <div className="flex items-center gap-3.5">
              <span className="text-2xl p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
                🤖
              </span>
              <div className="text-left">
                <h3 className="font-bold text-sm leading-tight">
                  Explorar Portal de Inteligencia Artificial
                </h3>
                <span className="text-[11px] opacity-75 font-normal">
                  Modelos, LLMs, visores y herramientas IA
                </span>
              </div>
            </div>
            <span className="text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
              Ir →
            </span>
          </Link>

          {/* Portal Ambiental */}
          <Link
            href="/ambiental"
            className={`group w-full p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between shadow-lg hover:scale-[1.02] ${
              isIA
                ? "bg-gradient-to-r from-slate-900 to-emerald-950/70 border-emerald-500/40 hover:border-emerald-400"
                : "bg-white border-slate-200 hover:border-emerald-500"
            }`}
          >
            <div className="flex items-center gap-3.5">
              <span className="text-2xl p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                🌿
              </span>
              <div className="text-left">
                <h3 className="font-bold text-sm leading-tight">
                  Explorar Portal de Ingeniería Ambiental
                </h3>
                <span className="text-[11px] opacity-75 font-normal">
                  Visores de mapas, índices de calidad e investigaciones
                </span>
              </div>
            </div>
            <span className="text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
              Ir →
            </span>
          </Link>

          {/* Instagram */}
          <a
            href="https://www.instagram.com/aquatech_ia/"
            target="_blank"
            rel="noopener noreferrer"
            className={`group w-full p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between shadow-md hover:scale-[1.02] ${
              isIA
                ? "bg-slate-900/90 border-pink-500/30 hover:border-pink-500"
                : "bg-white border-slate-200 hover:border-pink-500"
            }`}
          >
            <div className="flex items-center gap-3.5">
              <span className="text-2xl p-2 rounded-xl bg-pink-500/10 text-pink-500">
                📷
              </span>
              <div className="text-left">
                <h3 className="font-bold text-sm leading-tight">
                  Instagram Aquatech IA
                </h3>
                <span className="text-[11px] opacity-75 font-normal">
                  @aquatech_ia • Reels, proyectos y contenido diario
                </span>
              </div>
            </div>
            <span className="text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity text-pink-500">
              Seguir ↗
            </span>
          </a>

          {/* Facebook */}
          <a
            href="https://www.facebook.com/Aquatechia/"
            target="_blank"
            rel="noopener noreferrer"
            className={`group w-full p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between shadow-md hover:scale-[1.02] ${
              isIA
                ? "bg-slate-900/90 border-blue-500/30 hover:border-blue-500"
                : "bg-white border-slate-200 hover:border-blue-600"
            }`}
          >
            <div className="flex items-center gap-3.5">
              <span className="text-2xl p-2 rounded-xl bg-blue-500/10 text-blue-500">
                📘
              </span>
              <div className="text-left">
                <h3 className="font-bold text-sm leading-tight">
                  Facebook Aquatech IA
                </h3>
                <span className="text-[11px] opacity-75 font-normal">
                  Comunidad oficial y actualizaciones de proyectos
                </span>
              </div>
            </div>
            <span className="text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity text-blue-500">
              Visitar ↗
            </span>
          </a>

          {/* X (Twitter) */}
          <a
            href="https://x.com/Aquatech_ia"
            target="_blank"
            rel="noopener noreferrer"
            className={`group w-full p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between shadow-md hover:scale-[1.02] ${
              isIA
                ? "bg-slate-900/90 border-sky-400/30 hover:border-sky-400"
                : "bg-white border-slate-200 hover:border-black"
            }`}
          >
            <div className="flex items-center gap-3.5">
              <span className="text-2xl p-2 rounded-xl bg-sky-500/10 text-sky-400">
                🐦
              </span>
              <div className="text-left">
                <h3 className="font-bold text-sm leading-tight">
                  X (Twitter) Aquatech IA
                </h3>
                <span className="text-[11px] opacity-75 font-normal">
                  @Aquatech_ia • Noticias rápidas, hilos y papers
                </span>
              </div>
            </div>
            <span className="text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity text-sky-400">
              Seguir ↗
            </span>
          </a>

          {/* YouTube */}
          <a
            href="https://www.youtube.com/@AquatechIA"
            target="_blank"
            rel="noopener noreferrer"
            className={`group w-full p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between shadow-md hover:scale-[1.02] ${
              isIA
                ? "bg-slate-900/90 border-red-500/30 hover:border-red-500"
                : "bg-white border-slate-200 hover:border-red-600"
            }`}
          >
            <div className="flex items-center gap-3.5">
              <span className="text-2xl p-2 rounded-xl bg-red-500/10 text-red-500">
                ▶️
              </span>
              <div className="text-left">
                <h3 className="font-bold text-sm leading-tight">
                  YouTube Aquatech IA
                </h3>
                <span className="text-[11px] opacity-75 font-normal">
                  @AquatechIA • Tutoriales, ponencias y clases grabadas
                </span>
              </div>
            </div>
            <span className="text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity text-red-500">
              Suscribirse ↗
            </span>
          </a>

          {/* Proyectos de Investigación */}
          <Link
            href="/ia/autor/herramientas/proyectos-investigacion"
            className={`group w-full p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between shadow-lg hover:scale-[1.02] ${
              isIA
                ? "bg-gradient-to-r from-slate-900 to-purple-950/70 border-purple-500/40 hover:border-purple-400"
                : "bg-white border-slate-200 hover:border-purple-500"
            }`}
          >
            <div className="flex items-center gap-3.5">
              <span className="text-2xl p-2 rounded-xl bg-purple-500/10 text-purple-400">
                🎓
              </span>
              <div className="text-left">
                <h3 className="font-bold text-sm leading-tight">
                  Proyectos de Investigación Abiertos
                </h3>
                <span className="text-[11px] opacity-75 font-normal">
                  Cupos de trabajos de grado con Pablo Cubides
                </span>
              </div>
            </div>
            <span className="text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity text-purple-400">
              Ver Cupos →
            </span>
          </Link>
        </div>
      </div>

      {/* Footer copyright */}
      <footer className="mt-12 text-center text-xs opacity-60">
        © {new Date().getFullYear()} Aquatech IA • aquatechia.com
      </footer>
    </div>
  );
}
