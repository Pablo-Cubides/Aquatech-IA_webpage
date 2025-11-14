"use client";

import Link from "next/link";
import { AuthButton } from "../auth/AuthModal";

export default function HeaderIA() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-cyan-500/20 bg-black/80 px-6 md:px-10 py-3 backdrop-blur-md transition-all duration-300">
      {/* Logo y navegación principal */}
      <div className="flex items-center gap-4 md:gap-6">
        {/* Logo */}
        <Link
          href="/"
          className="transition-transform duration-300 hover:scale-105"
        >
          <img
            src="/images/Portal IA/Nombre Aquatech-ia light.png"
            alt="Aquatech IA"
            className="h-8 w-auto object-contain"
          />
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
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
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
          <Link
            href="/ia/productos"
            className="text-[#CCCCCC] transition-colors duration-300 hover:text-cyan-400"
          >
            Productos
          </Link>
        </nav>

        {/* Botón de login */}
        <div className="flex items-center gap-4">
          <AuthButton theme="dark" />
        </div>

        {/* Menú móvil (placeholder) */}
        <button className="md:hidden p-2 text-[#CCCCCC] transition-colors duration-300 hover:text-cyan-400">
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>
    </header>
  );
}
