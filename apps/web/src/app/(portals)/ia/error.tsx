"use client";

"use client";

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function IaError({ error, reset }: Props) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#10111A] text-white">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-[#0095FF] mb-4">Error</h1>
        <h2 className="text-2xl mb-4">Algo salió mal</h2>
        <p className="text-[#CCCCCC] mb-8">
          Ha ocurrido un error inesperado en el portal IA.
        </p>
        {/* TODO: Botón retry estilizado */}
        {/* TODO: Reporte de error a Sentry */}
        <button
          onClick={reset}
          className="bg-[#00EFFF] text-[#10111A] px-6 py-3 rounded-lg font-semibold hover:bg-[#0095FF] transition-colors"
        >
          Intentar de nuevo
        </button>
      </div>
    </div>
  );
}
