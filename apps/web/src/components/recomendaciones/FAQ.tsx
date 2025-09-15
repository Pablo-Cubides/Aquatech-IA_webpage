export default function FAQ() {
  const faqs = [
    ["¿Cómo seleccionan los recursos?", "Evaluamos reseñas, reputación, vigencia y aplicabilidad real. Probamos o verificamos el contenido cuando es posible."],
    ["¿Ganan comisión?", "Sí, a través de enlaces de afiliado. No afecta el precio que pagas y mantiene este proyecto sostenible."],
    ["¿Cómo sugiero un recurso?", "Escríbenos por el formulario de contacto o redes. Revisamos sugerencias en cada actualización."],
  ];
  return (
    <div>
      <h3 className="text-3xl font-bold text-[var(--ink)] text-center mb-8">Preguntas frecuentes</h3>
      <div className="divide-y rounded-2xl border border-[var(--border)] bg-white">
        {faqs.map(([q, a], i) => (
          <details key={i} className="group p-5">
            <summary className="flex cursor-pointer list-none items-center justify-between">
              <h4 className="font-semibold">{q}</h4>
              <span className="ml-3 inline-flex h-7 w-7 items-center justify-center rounded-md border border-[var(--border)] text-neutral-600 transition group-open:rotate-180">▼</span>
            </summary>
            <div className="pt-3 text-sm text-neutral-700">{a}</div>
          </details>
        ))}
      </div>
    </div>
  );
}
