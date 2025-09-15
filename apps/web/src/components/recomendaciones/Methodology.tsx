export default function Methodology() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-2xl border border-[var(--border)] bg-white p-6">
        <h3 className="text-xl font-bold">Principios y criterios</h3>
        <ul className="mt-3 list-disc pl-5 text-sm text-neutral-700 space-y-1">
          <li>Calidad &gt; comisión. Curaduría humana, independiente.</li>
          <li>Reseñas ≥ 4.5/5, reputación, vigencia 2024–2025.</li>
          <li>Foco LatAm: agua, sostenibilidad, renovables, economía circular, IA aplicada.</li>
          <li>Revisión continua y retiro si baja la calidad.</li>
        </ul>
      </div>
      <div className="rounded-2xl border border-[var(--border)] bg-white p-6">
        <h3 className="text-xl font-bold">Transparencia</h3>
        <p className="mt-2 text-sm text-neutral-700">
          Podemos recibir comisión por algunos enlaces, sin costo extra para ti. Cumplimos políticas de cada programa.
          <br/>
          <em>As an Amazon Associate we earn from qualifying purchases.</em>
        </p>
      </div>
    </div>
  );
}
