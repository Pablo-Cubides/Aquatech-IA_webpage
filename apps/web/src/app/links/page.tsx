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
          <div className="relative w-28 h-28 mx-auto mb-4 rounded-full overflow-hidden border-2 border-cyan-400/80 shadow-2xl p-0.5 bg-slate-900 flex items-center justify-center">
            <Image
              src="/images/aquatech-ia-avatar.png"
              alt="Aquatech IA Avatar"
              width={112}
              height={112}
              className="object-cover rounded-full w-full h-full"
              priority
              onError={(e) => {
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
              <span className="text-2xl p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
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
              <span className="text-2xl p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
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

          {/* Perfil del Autor (Pablo Cubides) */}
          <Link
            href="/ambiental/autor"
            className={`group w-full p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between shadow-lg hover:scale-[1.02] ${
              isIA
                ? "bg-gradient-to-r from-slate-900 to-purple-950/70 border-purple-500/40 hover:border-purple-400"
                : "bg-white border-slate-200 hover:border-purple-500"
            }`}
          >
            <div className="flex items-center gap-3.5">
              <span className="text-2xl p-2.5 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                👤
              </span>
              <div className="text-left">
                <h3 className="font-bold text-sm leading-tight">
                  Perfil del Autor — Pablo Cubides
                </h3>
                <span className="text-[11px] opacity-75 font-normal">
                  Trayectoria, proyectos y herramientas educativas
                </span>
              </div>
            </div>
            <span className="text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity text-purple-400">
              Ver Perfil →
            </span>
          </Link>

          {/* Instagram con Logo Oficial */}
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
              <div className="p-2.5 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center shadow-md">
                <svg
                  className="w-5 h-5 fill-none stroke-current stroke-[2]"
                  viewBox="0 0 24 24"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </div>
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

          {/* Facebook con Logo Oficial "f" */}
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
              <div className="p-2.5 rounded-xl bg-[#1877F2] text-white flex items-center justify-center shadow-md">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </div>
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

          {/* X (Twitter) con Logo Oficial "X" */}
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
              <div className="p-2.5 rounded-xl bg-black text-white border border-gray-700 flex items-center justify-center shadow-md">
                <svg
                  className="w-4 h-4 fill-current"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </div>
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
        </div>
      </div>

      {/* Footer copyright */}
      <footer className="mt-12 text-center text-xs opacity-60">
        © {new Date().getFullYear()} Aquatech IA • aquatechia.com
      </footer>
    </div>
  );
}
