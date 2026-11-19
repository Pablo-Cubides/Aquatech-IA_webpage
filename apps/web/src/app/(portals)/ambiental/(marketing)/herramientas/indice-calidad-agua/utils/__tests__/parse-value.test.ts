import { describe, it, expect } from "vitest";
import { parseLabValue } from "../parse-value";
import { parseCSV, csvToWaterSamplesDetailed } from "../csv-utils";

describe("parseLabValue (DOM-001 B2)", () => {
  it('lee decimal con coma y con punto: "0,5" → 0.5', () => {
    expect(parseLabValue("0,5")).toEqual({ kind: "number", value: 0.5 });
    expect(parseLabValue("0.5")).toEqual({ kind: "number", value: 0.5 });
    expect(parseLabValue("1.234,5")).toEqual({ kind: "number", value: 1234.5 });
    expect(parseLabValue("1,234.5")).toEqual({ kind: "number", value: 1234.5 });
  });

  it('trata los censurados como censurados, nunca como 0 ni NaN: "<0,1", "< 0,1"', () => {
    expect(parseLabValue("<0,1")).toEqual({ kind: "censored", operator: "<", limit: 0.1 });
    expect(parseLabValue("< 0,1")).toEqual({ kind: "censored", operator: "<", limit: 0.1 });
    expect(parseLabValue(">10")).toEqual({ kind: "censored", operator: ">", limit: 10 });
  });

  it("un valor basura es inválido, nunca 0", () => {
    for (const raw of ["abc", "ND", "", "1.2.3", "<abc", "12 mg"]) {
      expect(parseLabValue(raw).kind).toBe("invalid");
    }
  });
});

describe("CSV con decimal coma, censurados y basura", () => {
  const csv = [
    "fecha,ubicacion,parametro,valor,unidad",
    '2024-01-01,P1,Turbiedad,"0,5",UNT',
    '2024-01-01,P1,Nitritos,"<0,1",mg/L',
    "2024-01-01,P1,pH,xyz,unidades",
  ].join("\n");

  it("lee 0,5 entre comillas, conserva el censurado y reporta la basura sin volverla 0", () => {
    const { samples, issues } = csvToWaterSamplesDetailed(parseCSV(csv), "Colombia");
    const params = samples[0].parameters;
    expect(params.find((p) => p.name === "Turbiedad")?.value).toBe(0.5);
    expect(params.find((p) => p.name === "Nitritos")).toMatchObject({ value: 0.1, censored: "<" });
    expect(params.find((p) => p.name === "pH")).toBeUndefined();
    expect(issues).toHaveLength(1);
    expect(issues[0]).toMatchObject({ line: 4, parameter: "pH", raw: "xyz" });
  });

  it("acepta punto y coma como delimitador (Excel regional)", () => {
    const rows = parseCSV("fecha;ubicacion;parametro;valor;unidad\n2024-01-01;P1;Turbiedad;0,5;UNT");
    expect(csvToWaterSamplesDetailed(rows, "Colombia").samples[0].parameters[0].value).toBe(0.5);
  });

  it("una columna de valor ausente es un error, no un 0", () => {
    const { samples, issues } = csvToWaterSamplesDetailed(
      [{ fecha: "2024-01-01", ubicacion: "P1", parametro: "pH", unidad: "u" }],
      "Colombia",
    );
    expect(samples[0].parameters).toHaveLength(0);
    expect(issues).toHaveLength(1);
  });
});
