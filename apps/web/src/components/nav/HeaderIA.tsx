"use client";

import Link from "next/link";
import { useState } from "react";
import { AuthButton } from "../auth/AuthModal";

export default function HeaderIA() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-cyan-500/20 bg-black/80 px-6 md:px-10 py-3 backdrop-blur-md transition-all duration-300">
      {/* Logo y navegación principal */}
      <div className="flex items-center gap-4 md:gap-6">
        {/* Logo */}
        <Link
          href="/"
          className="transition-transform duration-300 hover:scale-105"
        >
          <div className="flex items-center gap-2">
            <img
              src="/images/gota-aquatech.png"
              alt="Logo Gota Aquatech"
              className="h-8 w-auto object-contain"
            />
            <img
              src="/images/portal-ia/nombre-ia.png"
              alt="Aquatech IA"
              className="h-8 w-auto object-contain"
            />
          </div>
        </Link>

        {/* Selector de portal */}
        <div className="hidden sm:flex h-9 items-center justify-center rounded-full bg-gray-900 p-1 text-sm border border-gray-700">
          <Link
            href="/ia"
            className="rounded-full bg-cyan-400 px-4 py-1 font-semibold text-black transition-all duration-300"
          >
            IA
          </Link>
          <Link
            href="/ambiental"
            className="px-4 py-1 font-medium text-[#CCCCCC] transition-all duration-300 hover:text-cyan-400"
          >
            Ambiental
          </Link>
        </div>
      </div>

      {/* Navegación y acciones */}
      <div className="flex items-center gap-4 md:gap-8">
        {/* Navegación principal */}
        <nav aria-label="Navegación principal de IA" className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link
            href="/ia/nosotros"
            className="text-[#CCCCCC] transition-colors duration-300 hover:text-cyan-400"
          >
            Nosotros
          </Link>
          <Link
            href="/ia/blog"
            className="text-[#CCCCCC] transition-colors duration-300 hover:text-cyan-400"
          >
            Blog
          </Link>
          <Link
            href="/ia/herramientas"
            className="text-[#CCCCCC] transition-colors duration-300 hover:text-cyan-400"
          >
            Herramientas
          </Link>
          <Link
            href="/ia/autor"
            className="text-[#CCCCCC] transition-colors duration-300 hover:text-cyan-400"
          >
            Autor
          </Link>
        </nav>

        {/* Botón de login */}
        <div className="hidden md:flex items-center gap-4">
          <AuthButton theme="dark" />
        </div>

        {/* Botón menú móvil */}
        <button
          className="md:hidden rounded-lg p-2 text-[#CCCCCC] transition-colors duration-300 hover:bg-gray-800 hover:text-cyan-400"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Menú móvil */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-black/95 border-b border-cyan-500/20 md:hidden backdrop-blur-md">
          <nav aria-label="Navegación móvil de IA" className="flex flex-col p-4 space-y-3">
            {/* Selector de portal en móvil */}
            <div className="flex h-9 items-center justify-center rounded-full bg-gray-900 p-1 text-sm border border-gray-700 sm:hidden mb-2">
              <Link
                href="/ia"
                className="rounded-full bg-cyan-400 px-4 py-1 font-semibold text-black transition-all duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                IA
              </Link>
              <Link
                href="/ambiental"
                className="px-4 py-1 font-medium text-[#CCCCCC] transition-all duration-300 hover:text-cyan-400"
                onClick={() => setIsMenuOpen(false)}
              >
                Ambiental
              </Link>
            </div>
            <Link
              href="/ia/nosotros"
              className="text-[#CCCCCC] transition-colors duration-300 hover:text-cyan-400 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Nosotros
            </Link>
            <Link
              href="/ia/blog"
              className="text-[#CCCCCC] transition-colors duration-300 hover:text-cyan-400 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Blog
            </Link>
            <Link
              href="/ia/herramientas"
              className="text-[#CCCCCC] transition-colors duration-300 hover:text-cyan-400 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Herramientas
            </Link>
            <Link
              href="/ia/autor"
              className="text-[#CCCCCC] transition-colors duration-300 hover:text-cyan-400 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Autor
            </Link>
            <div className="border-t border-cyan-500/20 mt-2 pt-4">
              <AuthButton
                theme="dark"
                className="text-left text-[#CCCCCC] hover:text-cyan-400 py-2 w-full text-sm"
              />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
