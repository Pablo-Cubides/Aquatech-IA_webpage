export default function EmptyState() {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-white p-10 text-center">
      <p className="text-lg font-semibold">Sin resultados</p>
      <p className="text-sm text-neutral-600">Prueba con menos filtros o una búsqueda más amplia.</p>
    </div>
  );
}
