import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Página no encontrada - 404',
  description: 'La página que buscas no existe',
};

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <span className="text-6xl" role="img" aria-label="No encontrado">🔍</span>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Página no encontrada
        </h1>
        
        <p className="text-gray-600 mb-8">
          Lo sentimos, la página que buscas no existe o ha sido movida.
        </p>
        
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-block bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Volver al inicio
          </Link>
          
          <div className="mt-6">
            <p className="text-sm text-gray-500 mb-3">Páginas populares:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Link href="/matrices" className="text-sm text-primary hover:underline">
                Matrices
              </Link>
              <span className="text-gray-300">•</span>
              <Link href="/selector" className="text-sm text-primary hover:underline">
                Selector
              </Link>
              <span className="text-gray-300">•</span>
              <Link href="/casos" className="text-sm text-primary hover:underline">
                Casos
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
