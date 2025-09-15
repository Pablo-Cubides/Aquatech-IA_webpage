export default function AmbientalNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F9F8] text-[#0D161C]">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-[#0077B6] mb-4">404</h1>
        <h2 className="text-2xl mb-4">Página no encontrada</h2>
        <p className="text-gray-600 mb-8">
          La página que buscas no existe en el portal ambiental.
        </p>
        {/* TODO: Botón para volver al inicio */}
        {/* TODO: Enlaces sugeridos */}
      </div>
    </div>
  );
}
