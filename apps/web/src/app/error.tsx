"use client"; // Error boundaries must be Client Components (Next.js requirement)

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log para diagnóstico — Sentry capturará esto cuando esté configurado
    console.error("[root error boundary]", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white px-4">
      <div className="text-center max-w-md">
        <p className="text-5xl mb-4">⚠️</p>
        <h1 className="text-2xl font-semibold mb-2">Algo salió mal</h1>
        <p className="text-slate-400 mb-8">
          Ocurrió un error inesperado. Puedes intentar de nuevo o volver al
          inicio.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-cyan-500 text-slate-950 rounded-lg font-semibold hover:bg-cyan-400 transition-colors"
          >
            Intentar de nuevo
          </button>
          <Link
            href="/"
            className="px-6 py-3 border border-slate-700 rounded-lg font-semibold hover:bg-slate-800 transition-colors"
          >
            Ir al inicio
          </Link>
        </div>
        {error.digest && (
          <p className="text-xs text-slate-600 mt-6">Ref: {error.digest}</p>
        )}
      </div>
    </div>
  );
}
