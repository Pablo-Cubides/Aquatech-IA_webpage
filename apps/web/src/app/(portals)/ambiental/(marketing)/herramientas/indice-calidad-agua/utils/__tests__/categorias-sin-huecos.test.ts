/* eslint-disable @typescript-eslint/no-non-null-assertion */

/**
 * Las categorías de los índices (WQI, DWQI, IRCA) no pueden tener huecos ni responder con una
 * categoría inventada cuando no encaja ninguna.
 *
 * Origen (ING-002): `WQI_CATEGORIES` tenía rangos enteros (0-24, 25-49, 50-69, 70-89, 90-100) y
 * `getWQICategory` caía en la primera categoría («Muy mala») cuando un valor decimal no encajaba:
 * un WQI de 89.79 se etiquetaba «Muy mala». Todas las pruebas usaban enteros y pasaban.
 *
 * Estas pruebas barren la escala entera con decimales: comprueban el efecto (la categoría que ve el
 * usuario), no que se llamara a una función.
 */

import { describe, it, expect } from "vitest";
import { getWQICategory, WQI_CATEGORIES, WQI_PARAMETERS, QI_CURVES, interpolateQi } from "../../data/wqi-parameters";
import { calculateWQI } from "../calculate-wqi";
import { calculateDWQI } from "../calculate-dwqi";
import type { WaterSample } from "../../types";
import { getDWQICategory, DWQI_CATEGORIES } from "../../data/dwqi-parameters";
import { getIRCARiskCategory } from "../../data/irca-parameters";

/** Valores de 0 a `hasta` en pasos de 0.01 (sin acumular error de coma flotante). */
function barrido(hasta: number): number[] {
  const out: number[] = [];
  for (let i = 0; i <= Math.round(hasta * 100); i++) out.push(i / 100);
  return out;
}

describe("WQI: categorías sin huecos", () => {
  const nombre = (v: number) => getWQICategory(v)?.category;

  it("clasifica los decimales entre rangos enteros (89.79 ya no es «Muy mala»)", () => {
    expect(nombre(89.79)).toBe("Buena");
    expect(nombre(89.5)).toBe("Buena");
    expect(nombre(24.5)).toBe("Muy mala");
    expect(nombre(49.5)).toBe("Mala");
    expect(nombre(69.5)).toBe("Media");
  });

  it("conserva las categorías de los valores enteros de siempre", () => {
    const esperado: Array<[number, string]> = [
      [0, "Muy mala"], [24, "Muy mala"], [25, "Mala"], [49, "Mala"], [50, "Media"],
      [69, "Media"], [70, "Buena"], [89, "Buena"], [90, "Excelente"], [100, "Excelente"],
    ];
    for (const [valor, categoria] of esperado) expect(nombre(valor), String(valor)).toBe(categoria);
  });

  it("todo valor de 0 a 100 tiene categoría y la peor nunca se da por respaldo", () => {
    const orden = WQI_CATEGORIES.map((c) => c.category);
    let anterior = -1;
    for (const v of barrido(100)) {
      const categoria = getWQICategory(v);
      expect(categoria, `WQI ${v} sin categoría`).not.toBeNull();
      const indice = orden.indexOf(categoria!.category);
      expect(indice, `WQI ${v} retrocede de categoría`).toBeGreaterThanOrEqual(anterior);
      anterior = indice;
    }
    expect(anterior).toBe(orden.length - 1);
  });

  it("fuera de la escala o no numérico: sin categoría (null), no «Muy mala»", () => {
    for (const v of [NaN, Infinity, -Infinity, -0.01, 100.01, 150]) {
      expect(getWQICategory(v), String(v)).toBeNull();
    }
  });
});

describe("DWQI: categorías sin huecos", () => {
  const nombre = (v: number) => getDWQICategory(v)?.category;

  it("clasifica los decimales entre rangos enteros (ya no cae en «No apta»)", () => {
    expect(nombre(25.5)).toBe("Buena");
    expect(nombre(50.5)).toBe("Pobre");
    expect(nombre(75.5)).toBe("Muy pobre");
    expect(nombre(100.5)).toBe("No apta");
  });

  it("conserva las categorías de los valores enteros de siempre", () => {
    const esperado: Array<[number, string]> = [
      [0, "Excelente"], [25, "Excelente"], [26, "Buena"], [50, "Buena"], [51, "Pobre"],
      [75, "Pobre"], [76, "Muy pobre"], [100, "Muy pobre"], [101, "No apta"], [999, "No apta"],
    ];
    for (const [valor, categoria] of esperado) expect(nombre(valor), String(valor)).toBe(categoria);
  });

  it("todo valor de 0 a 1000 tiene categoría, en orden, y por encima del último rango sigue «No apta»", () => {
    const orden = DWQI_CATEGORIES.map((c) => c.category);
    let anterior = -1;
    for (const v of barrido(1000)) {
      const categoria = getDWQICategory(v);
      expect(categoria, `DWQI ${v} sin categoría`).not.toBeNull();
      const indice = orden.indexOf(categoria!.category);
      expect(indice, `DWQI ${v} retrocede de categoría`).toBeGreaterThanOrEqual(anterior);
      anterior = indice;
    }
    expect(nombre(50000)).toBe("No apta");
  });

  it("no numérico o negativo: sin categoría (null)", () => {
    for (const v of [NaN, Infinity, -Infinity, -0.01]) {
      expect(getDWQICategory(v), String(v)).toBeNull();
    }
  });
});

describe("IRCA: categorías sin huecos", () => {
  const nombre = (v: number) => getIRCARiskCategory(v)?.category;

  it("todo valor de 0 a 100 tiene categoría, en orden", () => {
    let anterior = "";
    const vistos: string[] = [];
    for (const v of barrido(100)) {
      const categoria = getIRCARiskCategory(v);
      expect(categoria, `IRCA ${v} sin categoría`).not.toBeNull();
      if (categoria!.category !== anterior) vistos.push(categoria!.category);
      anterior = categoria!.category;
    }
    // Cinco niveles, cada uno una sola vez y en el orden de la Res. 2115, Cuadro 7.
    expect(vistos).toEqual([
      "Sin riesgo", "Riesgo bajo", "Riesgo medio", "Riesgo alto", "Inviable sanitariamente",
    ]);
  });

  it("no numérico: sin categoría (null), no «Inviable sanitariamente»", () => {
    for (const v of [NaN, Infinity, -Infinity]) {
      expect(getIRCARiskCategory(v), String(v)).toBeNull();
    }
  });

  it("un IRCA de 0 es «Sin riesgo»", () => {
    expect(nombre(0)).toBe("Sin riesgo");
  });
});

describe("WQI de extremo a extremo: la etiqueta que ve el usuario corresponde a su valor", () => {
  const BASE = [
    { name: "Oxígeno disuelto", unit: "%" },
    { name: "Coliformes fecales", unit: "UFC/100mL" },
    { name: "pH", unit: "Unidades de pH" },
    { name: "DBO5", unit: "mg/L" },
    { name: "Nitratos", unit: "mg/L" },
    { name: "Fosfatos", unit: "mg/L" },
    { name: "Temperatura", unit: "°C variación" },
    { name: "Turbiedad", unit: "UNT" },
    { name: "Sólidos disueltos totales", unit: "mg/L" },
  ];
  const muestra = (valores: number[]): WaterSample => ({
    id: "e2e",
    sampleDate: "2024-01-01",
    location: "Prueba",
    country: "Internacional",
    dataSource: "manual",
    parameters: BASE.map((b, i) => ({ ...b, value: valores[i] })),
  });

  it("recorre muchas muestras y la categoría siempre coincide con la escala del valor mostrado", () => {
    const esperada = (v: number) =>
      v < 25 ? "Muy mala" : v < 50 ? "Mala" : v < 70 ? "Media" : v < 90 ? "Buena" : "Excelente";
    let probadas = 0;
    const decimalesEnHueco: number[] = [];
    for (let oxigeno = 5; oxigeno <= 140; oxigeno += 3) {
      for (let turbiedad = 0; turbiedad <= 90; turbiedad += 7) {
        for (let fosfatos = 0; fosfatos <= 12; fosfatos += 2) {
          const r = calculateWQI(muestra([oxigeno, 40, 7.2, 3, 8, fosfatos, 3, turbiedad, 150]));
          if (!r) continue;
          probadas++;
          expect(r.category, `WQI ${r.value}`).toBe(esperada(r.value));
          const frac = r.value - Math.floor(r.value);
          if (frac > 0 && [24, 49, 69, 89].includes(Math.floor(r.value))) decimalesEnHueco.push(r.value);
        }
      }
    }
    expect(probadas).toBeGreaterThan(300);
    // La muestra incluye valores dentro de los antiguos huecos: la prueba no es vacía.
    expect(decimalesEnHueco.length).toBeGreaterThan(0);
  });

  it("un valor medido no numérico no cuenta como medición (antes entraba con Qi = 50)", () => {
    const sana = muestra([95, 1, 7, 1, 0.5, 0.01, 0, 1, 50]);
    const conNaN = muestra([95, 1, 7, 1, 0.5, 0.01, 0, 1, 50]);
    conNaN.parameters[0].value = NaN;
    const a = calculateWQI(sana)!;
    const b = calculateWQI(conNaN)!;
    expect(b.missingParameters).toContain("Oxígeno disuelto");
    expect(b.details.map((d) => d.parameter)).not.toContain("Oxígeno disuelto");
    expect(Number.isFinite(b.value)).toBe(true);
    expect(a.details.length).toBe(b.details.length + 1);
  });

  it("todos los parámetros WQI tienen curva Qi, y sin curva interpolateQi falla en vez de inventar 50", () => {
    for (const p of WQI_PARAMETERS) expect(QI_CURVES[p.name], p.name).toBeDefined();
    expect(() => interpolateQi("Parámetro inexistente", 5)).toThrow(/no hay curva/);
    expect(() => interpolateQi("pH", NaN)).toThrow(/no numérico/);
  });
});

describe("DWQI de extremo a extremo", () => {
  it("un DWQI decimal entre 25 y 26 es «Buena», no «No apta»", () => {
    // Se recorre un parámetro hasta cruzar la franja 25-26 y se comprueba la etiqueta de cada paso.
    const muestra = (arsenico: number): WaterSample => ({
      id: "dwqi",
      sampleDate: "2024-01-01",
      location: "Prueba",
      country: "Internacional",
      dataSource: "manual",
      parameters: [{ name: "pH", value: 7.5, unit: "Unidades de pH" }, { name: "Arsénico", value: arsenico, unit: "mg/L" }],
    });
    let visto = 0;
    for (let a = 0; a <= 0.05; a += 0.0005) {
      const r = calculateDWQI(muestra(a));
      if (!r) continue;
      visto++;
      const v = r.value;
      const esperada = v <= 25 ? "Excelente" : v <= 50 ? "Buena" : v <= 75 ? "Pobre" : v <= 100 ? "Muy pobre" : "No apta";
      expect(r.category, `DWQI ${v}`).toBe(esperada);
    }
    expect(visto).toBeGreaterThan(10);
  });
});
