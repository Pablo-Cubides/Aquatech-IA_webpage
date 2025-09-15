"use client";

import Link from "next/link";
import { AuthButton } from "../auth/AuthModal";

export default function HeaderIA() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-solid border-white/10 bg-[#141725]/80 px-6 md:px-10 py-3 backdrop-blur-md">
      {/* Logo y navegación principal */}
      <div className="flex items-center gap-4 md:gap-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="rounded-full bg-[#00EFFF] p-2">
            <svg
              className="h-6 w-6 text-[#10111A]"
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-[#F3F6FF]">Aquatech IA</h1>
        </Link>

        {/* Selector de portal */}
        <div className="hidden sm:flex h-9 items-center justify-center rounded-full bg-[#1F2437] p-1 text-sm">
          <Link
            href="/ia"
            className="rounded-full bg-[#00EFFF] px-4 py-1 font-semibold text-[#10111A]"
          >
            IA
          </Link>
          <Link
            href="/ambiental"
            className="px-4 py-1 font-medium text-[#B6C2DF] hover:text-[#00EFFF] transition-colors"
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
            className="text-[#B6C2DF] transition-colors hover:text-[#00EFFF]"
          >
            Nosotros
          </Link>
          <Link
            href="/ia/blog"
            className="text-[#B6C2DF] transition-colors hover:text-[#00EFFF]"
          >
            Blog
          </Link>
          <Link
            href="/ia/herramientas"
            className="text-[#B6C2DF] transition-colors hover:text-[#00EFFF]"
          >
            Herramientas
          </Link>
          <Link
            href="/ia/autor"
            className="text-[#B6C2DF] transition-colors hover:text-[#00EFFF]"
          >
            Autor
          </Link>
          <Link
            href="/ia/productos"
            className="text-[#B6C2DF] transition-colors hover:text-[#00EFFF]"
          >
            Productos
          </Link>
        </nav>

        {/* Botón de login */}
        <div className="flex items-center gap-4">
          <AuthButton theme="dark" />
        </div>

        {/* Menú móvil (placeholder) */}
        <button className="md:hidden p-2 text-[#B6C2DF] hover:text-[#00EFFF]">
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
