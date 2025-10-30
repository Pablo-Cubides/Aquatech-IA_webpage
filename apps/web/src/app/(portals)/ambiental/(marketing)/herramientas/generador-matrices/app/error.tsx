'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log del error a un servicio de monitoreo
    console.error('Error capturado:', error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <span className="text-6xl" role="img" aria-label="Error">⚠️</span>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Algo salió mal
        </h1>
        
        <p className="text-gray-600 mb-8">
          Lo sentimos, ha ocurrido un error inesperado. Nuestro equipo ha sido notificado.
        </p>
        
        {process.env.NODE_ENV === 'development' && error.message && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
            <p className="text-sm font-mono text-red-800 break-words">
              {error.message}
            </p>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Intentar de nuevo
          </button>
          
          <Link
            href="/"
            className="border-2 border-gray-300 px-6 py-3 rounded-lg font-semibold hover:border-primary hover:text-primary transition-colors"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
