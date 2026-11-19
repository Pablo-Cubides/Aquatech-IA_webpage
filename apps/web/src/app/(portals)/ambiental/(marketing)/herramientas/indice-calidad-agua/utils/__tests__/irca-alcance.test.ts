import { describe, it, expect } from "vitest";
import { calculateIRCA, calculateMonthlyIRCA, describeIRCAScope } from "../calculate-irca";
import { IRCA_SCOPE_REMINDER } from "../../data/irca-scope";
import type { WaterSample } from "../../types";

function muestra(parameters: WaterSample["parameters"], date = "2024-03-05", id = "s"): WaterSample {
  return { id, sampleDate: date, location: "P1", country: "Colombia", dataSource: "manual", parameters };
}

describe("IRCA: parágrafo del art. 13 de la Res. 2115/2007", () => {
  it("una sustancia del art. 5 sobre el máximo (plomo 0,05 > 0,01 mg/L) da IRCA 100 aunque lo demás cumpla", () => {
    const r = calculateIRCA(
      muestra([
        { name: "pH", value: 7, unit: "u" },
        { name: "Turbiedad", value: 1, unit: "UNT" },
        { name: "Plomo", value: 0.05, unit: "mg/L" },
      ]),
    )!;
    expect(r.value).toBe(100);
    expect(r.category).toBe("Inviable sanitariamente");
    expect(r.scope!.formulaValue).toBe(0);
    expect(r.scope!.overrides[0].cita).toMatch(/art\. 5.*art\. 13/);
  });

  it("la presencia de Giardia o Cryptosporidium da IRCA 100", () => {
    const base = [{ name: "pH", value: 7, unit: "u" }];
    expect(calculateIRCA(muestra([...base, { name: "Giardia", value: 3, unit: "quistes" }]))!.value).toBe(100);
    expect(calculateIRCA(muestra([...base, { name: "Cryptosporidium", value: 1, unit: "ooquistes" }]))!.value).toBe(100);
  });

  it("NO se activa por no medir: sin esos resultados el IRCA sigue la fórmula del art. 14", () => {
    const r = calculateIRCA(muestra([{ name: "pH", value: 7, unit: "u" }]))!;
    expect(r.value).toBe(0);
    expect(r.scope!.overrides).toHaveLength(0);
  });

  it("una sustancia del art. 5 por debajo del máximo, o Giardia ausente, no activa el override", () => {
    const r = calculateIRCA(
      muestra([
        { name: "pH", value: 7, unit: "u" },
        { name: "Plomo", value: 0.005, unit: "mg/L" },
        { name: "Giardia", value: 0, unit: "quistes" },
      ]),
    )!;
    expect(r.value).toBe(0);
  });

  it("el override rige aunque no haya ninguna característica del Cuadro 6", () => {
    const r = calculateIRCA(muestra([{ name: "Arsénico", value: 0.5, unit: "mg/L" }]))!;
    expect(r.value).toBe(100);
    expect(r.scope!.calculatedOn).toBe(0);
  });
});

describe("IRCA: alcance siempre declarado (DOM-001 B1.1, B3)", () => {
  it("todo resultado lleva el recordatorio aprobado, tal cual, y no insinúa obligatoriedad ni cifras", () => {
    const r = calculateIRCA(muestra([{ name: "pH", value: 7, unit: "u" }]))!;
    expect(r.scope!.reminder).toBe(IRCA_SCOPE_REMINDER);
    expect(IRCA_SCOPE_REMINDER).toBe(
      "Este IRCA se calcula con las 22 características del Cuadro 6. La Res. 2115 exige además vigilar otras sustancias y, según el tamaño de la población atendida y el mapa de riesgo, Giardia y Cryptosporidium. Consulte a su autoridad sanitaria.",
    );
    expect(IRCA_SCOPE_REMINDER).not.toMatch(/suscriptores|debe medir|obligatori|más de \d/i);
  });

  it('un encabezado "E. coli" computa la característica y el resultado dice sobre cuántas se calculó', () => {
    for (const nombre of ["E. coli", "E.coli", "Ecoli", "Escherichia coli"]) {
      const r = calculateIRCA(
        muestra([
          { name: "pH", value: 7, unit: "u" },
          { name: nombre, value: 10, unit: "UFC/100mL" },
        ]),
      )!;
      expect(r.scope!.calculatedOn).toBe(2);
      expect(r.details.some((d) => d.parameter === "Escherichia coli" && !d.complies)).toBe(true);
      expect(r.value).toBeCloseTo((25 / 26.5) * 100, 1);
      expect(describeIRCAScope(r.scope!)).toBe(
        "Calculado sobre 2 de las 22 características del Cuadro 6 (suma de puntajes analizados: 26.5 de 100).",
      );
    }
  });

  it("los parámetros no reconocidos se informan, no se descartan en silencio", () => {
    const r = calculateIRCA(
      muestra([
        { name: "pH", value: 7, unit: "u" },
        { name: "Parámetro inventado", value: 1, unit: "x" },
      ]),
    )!;
    expect(r.scope!.unrecognized).toEqual(["Parámetro inventado"]);
  });

  it("nitratos y nitritos no se confunden", () => {
    const r = calculateIRCA(muestra([{ name: "Nitritos (NO2)", value: 0.5, unit: "mg/L" }]))!;
    expect(r.details).toHaveLength(1);
    expect(r.details[0].parameter).toBe("Nitritos");
  });
});

describe("IRCA: resultados censurados", () => {
  it('"<0,1" en nitritos (máx. 0,1) cumple con certeza; "<0,5" es indeterminado y se excluye e informa', () => {
    const ok = calculateIRCA(muestra([{ name: "Nitritos", value: 0.1, unit: "mg/L", censored: "<" }, { name: "pH", value: 7, unit: "u" }]))!;
    expect(ok.details.find((d) => d.parameter === "Nitritos")?.complies).toBe(true);

    const ind = calculateIRCA(muestra([{ name: "Nitritos", value: 0.5, unit: "mg/L", censored: "<" }, { name: "pH", value: 7, unit: "u" }]))!;
    expect(ind.details.map((d) => d.parameter)).toEqual(["pH"]);
    expect(ind.scope!.indeterminate[0]).toMatch(/Nitritos/);
  });

  it('E. coli "<1" (enzima-sustrato, Cuadro 5) cumple; "<10" es indeterminado', () => {
    const a = calculateIRCA(muestra([{ name: "E. coli", value: 1, unit: "UFC", censored: "<" }]))!;
    expect(a.value).toBe(0);
    const b = calculateIRCA(muestra([{ name: "E. coli", value: 10, unit: "UFC", censored: "<" }, { name: "pH", value: 7, unit: "u" }]))!;
    expect(b.scope!.indeterminate.length).toBe(1);
  });

  it('cloro residual "<0,1" (mín. 0,3) no cumple con certeza', () => {
    const r = calculateIRCA(muestra([{ name: "Cloro residual libre", value: 0.1, unit: "mg/L", censored: "<" }]))!;
    expect(r.details[0].complies).toBe(false);
  });
});

describe("IRCA mensual (art. 14): promedio de los IRCA por muestra", () => {
  it("promedia por mes y excluye (informando) las muestras sin IRCA calculable", () => {
    const m = calculateMonthlyIRCA([
      muestra([{ name: "Escherichia coli", value: 1, unit: "UFC" }], "2024-03-05", "a"), // 100
      muestra([{ name: "Escherichia coli", value: 0, unit: "UFC" }], "2024-03-20", "b"), // 0
      muestra([{ name: "Parámetro raro", value: 1, unit: "x" }], "2024-03-21", "c"), // no calculable
      muestra([{ name: "pH", value: 7, unit: "u" }], "2024-04-02", "d"),
    ]);
    expect(m.map((x) => x.month)).toEqual(["2024-03", "2024-04"]);
    expect(m[0]).toMatchObject({ value: 50, sampleCount: 2, excludedSamples: 1 });
    expect(m[1].value).toBe(0);
  });
});
