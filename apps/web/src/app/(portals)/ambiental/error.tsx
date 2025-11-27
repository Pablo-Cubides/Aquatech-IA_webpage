"use client";

import { useEffect } from "react";
import Link from "next/link";

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AmbientalError({ error, reset }: Props) {
  useEffect(() => {
    // TODO: Error reporting to Sentry
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F9F8] text-[#0D161C]">
      <div className="text-center p-8 max-w-lg mx-auto">
        <svg
          className="w-24 h-24 text-red-500 mx-auto mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h1 className="text-4xl font-bold text-[#0077B6] mb-4">
          ¡Ups! Algo salió mal
        </h1>
        <p className="text-gray-600 mb-6">
          Ha ocurrido un error inesperado en el portal ambiental. Nuestro
          equipo técnico ha sido notificado.
        </p>
        <p className="text-sm text-gray-500 mb-8">
          ERROR: {error.message || "Error desconocido"}
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={reset}
            className="bg-[#10B981] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#0077B6] transition-colors"
          >
            Intentar de nuevo
          </button>
          <Link href="/ambiental">
            <p className="bg-transparent border-2 border-[#0077B6] text-[#0077B6] px-6 py-3 rounded-lg font-semibold hover:bg-[#0077B6] hover:text-white transition-colors">
              Volver al inicio
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
