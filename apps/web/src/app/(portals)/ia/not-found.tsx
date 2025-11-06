export default function IaNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#10111A] text-white">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-[#00EFFF] mb-4">404</h1>
        <h2 className="text-2xl mb-4">Página no encontrada</h2>
        <p className="text-[#CCCCCC] mb-8">
          La página que buscas no existe en el portal IA.
        </p>
        {/* TODO: Botón para volver al inicio */}
        {/* TODO: Enlaces sugeridos */}
      </div>
    </div>
  );
}
