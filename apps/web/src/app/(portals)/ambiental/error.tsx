"use client";

"use client";

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AmbientalError({ error, reset }: Props) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F9F8] text-[#0D161C]">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-[#0077B6] mb-4">Error</h1>
        <h2 className="text-2xl mb-4">Algo salió mal</h2>
        <p className="text-gray-600 mb-8">
          Ha ocurrido un error inesperado en el portal ambiental.
        </p>
        {/* TODO: Botón retry estilizado */}
        {/* TODO: Reporte de error a Sentry */}
        <button
          onClick={reset}
          className="bg-[#10B981] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#0077B6] transition-colors"
        >
          Intentar de nuevo
        </button>
      </div>
    </div>
  );
}
