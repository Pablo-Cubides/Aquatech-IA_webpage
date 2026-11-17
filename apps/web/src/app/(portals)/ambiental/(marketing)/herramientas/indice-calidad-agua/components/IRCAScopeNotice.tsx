import type { IRCAScope } from "../types";
import { describeIRCAScope } from "../utils/calculate-irca";

/**
 * Alcance del IRCA, junto al resultado y siempre visible (DOM-001 B1, DOM-002).
 * Declara sobre qué se calculó y qué no cubre; no sugiere que ningún ensayo sea obligatorio.
 */
export default function IRCAScopeNotice({ scope }: { scope: IRCAScope }) {
  return (
    <div className="text-xs text-gray-700 bg-gray-50 border border-gray-200 p-3 rounded space-y-2" data-testid="irca-scope">
      {scope.overrides.length > 0 && (
        <div className="text-red-800 bg-red-50 border border-red-200 p-2 rounded">
          <p className="font-semibold">IRCA = 100 por el parágrafo del art. 13 (Res. 2115/2007)</p>
          <ul className="list-disc list-inside">
            {scope.overrides.map((o) => (
              <li key={o.motivo}>
                {o.motivo} <span className="text-red-600">({o.cita})</span>
              </li>
            ))}
          </ul>
          <p className="mt-1">Valor según la fórmula del art. 14: {scope.formulaValue}%.</p>
        </div>
      )}
      <p className="font-medium">{describeIRCAScope(scope)}</p>
      {scope.unrecognized.length > 0 && (
        <p className="text-amber-800 bg-amber-50 p-2 rounded">
          No se reconocieron y NO entraron al cálculo: {scope.unrecognized.join(", ")}. Revise los nombres
          (p. ej. &quot;Escherichia coli&quot;, &quot;E. coli&quot;).
        </p>
      )}
      {scope.indeterminate.length > 0 && (
        <p className="text-amber-800 bg-amber-50 p-2 rounded">
          Resultados censurados que no permiten decidir si cumplen (excluidos del cálculo):{" "}
          {scope.indeterminate.join(", ")}.
        </p>
      )}
      <p>{scope.reminder}</p>
    </div>
  );
}
