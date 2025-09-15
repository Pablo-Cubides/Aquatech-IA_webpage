"use client";

import Link from "next/link";
import { useState } from "react";
import { AuthButton } from "../auth/AuthModal";

export default function HeaderAmbiental() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200 bg-white/80 px-10 py-3 backdrop-blur-md">
      <div className="flex items-center gap-6">
        {/* Logo y nombre */}
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-[#0077B6] p-2">
            <svg
              className="h-6 w-6 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-[#0D161C]">Aquatech IA</h1>
        </div>

        {/* Selector de portales */}
        <div className="flex h-9 items-center justify-center rounded-full bg-gray-100 p-1 text-sm">
          <Link
            href="/ia"
            className="px-4 py-1 font-medium text-gray-600 hover:text-[#0077B6] transition-colors"
          >
            IA
          </Link>
          <Link
            href="/ambiental"
            className="rounded-full bg-[#0077B6] px-4 py-1 font-semibold text-white"
          >
            Ambiental
          </Link>
        </div>
      </div>

      {/* Navegación desktop */}
      <div className="hidden lg:flex items-center gap-8">
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link
            href="/ambiental/nosotros"
            className="text-gray-700 transition-colors hover:text-[#0077B6]"
          >
            Nosotros
          </Link>
          <Link
            href="/ambiental/blog"
            className="text-gray-700 transition-colors hover:text-[#0077B6]"
          >
            Blog
          </Link>
          <Link
            href="/ambiental/herramientas"
            className="text-gray-700 transition-colors hover:text-[#0077B6]"
          >
            Herramientas
          </Link>
          <Link
            href="/ambiental/autor"
            className="text-gray-700 transition-colors hover:text-[#0077B6]"
          >
            Autor
          </Link>
          <Link
            href="/ambiental/productos"
            className="text-gray-700 transition-colors hover:text-[#0077B6]"
          >
            Productos
          </Link>
        </nav>

        {/* Botón de login */}
        <div className="flex items-center gap-4">
          <AuthButton theme="light" />
        </div>
      </div>

      {/* Botón menú móvil */}
      <button
        className="lg:hidden rounded-lg p-2 text-gray-700 hover:bg-gray-100"
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

      {/* Menú móvil */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-200 lg:hidden">
          <nav className="flex flex-col p-4 space-y-3">
            <Link
              href="/ambiental/nosotros"
              className="text-gray-700 hover:text-[#0077B6] py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Nosotros
            </Link>
            <Link
              href="/ambiental/blog"
              className="text-gray-700 hover:text-[#0077B6] py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Blog
            </Link>
            <Link
              href="/ambiental/herramientas"
              className="text-gray-700 hover:text-[#0077B6] py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Herramientas
            </Link>
            <Link
              href="/ambiental/autor"
              className="text-gray-700 hover:text-[#0077B6] py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Autor
            </Link>
            <Link
              href="/ambiental/productos"
              className="text-gray-700 hover:text-[#0077B6] py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Productos
            </Link>
            <div className="border-t border-gray-200 mt-2 pt-4">
              <AuthButton
                theme="light"
                className="text-left text-gray-700 hover:text-[#0077B6] py-2 w-full text-sm"
              />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
