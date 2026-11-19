/* eslint-disable @typescript-eslint/no-non-null-assertion */
/**
 * Tests que FIJAN las constantes normativas y citan su origen. Si una norma cambia, estos
 * tests son los que avisan: no se "arreglan" cambiando el número sin cambiar la cita
 * y re-verificar contra el texto oficial (ver coordinacion/bitacora-DOM.md).
 */
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";
import {
  CARACTERISTICAS_IRCA,
  IRCA_PUNTAJE_TOTAL,
  IRCA_NIVELES_RIESGO,
  SUSTANCIAS_ART5,
  CUADRO_16_GIARDIA_CRYPTO,
  fechaVencimientoCuadro16,
  ART13_PARAGRAFO_TEXTO,
  PLAGUICIDAS_SUMA_MAX_MG_L,
  TABLA_1_LIMITES_2018,
  TABLA_2_LIMITES_2030,
  PM_24H_DESDE_2018_07_01,
  limiteAireVigente,
  TABLA_4_NIVELES,
  TABLA_6_CORTES_ICA,
  TABLA_1_CORTES_IBOCA,
} from "../index";
import { ICA_COLOMBIA_BREAKPOINTS } from "@/app/(portals)/ambiental/(marketing)/herramientas/indice-calidad-aire/data/breakpoints/ica-colombia";
import { IBOCA_BREAKPOINTS } from "@/app/(portals)/ambiental/(marketing)/herramientas/indice-calidad-aire/data/breakpoints/iboca-bogota";
import { calculatePollutantSubIndex } from "@/app/(portals)/ambiental/(marketing)/herramientas/indice-calidad-aire/utils/calculate-aqi";
import { ICA_COLOMBIA_CATEGORIES } from "@/app/(portals)/ambiental/(marketing)/herramientas/indice-calidad-aire/data/breakpoints/ica-colombia";

describe("Res. 2115/2007 — Cuadro 6 (art. 13): 22 características, puntajes que suman 100", () => {
  it("son 22, suman 100 y cada puntaje es el del Cuadro 6", () => {
    const esperado: Record<string, number> = {
      color: 6, turbiedad: 15, ph: 1.5, cloro: 15, alcalinidad: 1, calcio: 1, fosfatos: 1, manganeso: 1,
      molibdeno: 1, magnesio: 1, zinc: 1, dureza: 1, sulfatos: 1, hierro: 1.5, cloruros: 1, nitratos: 1,
      nitritos: 3, aluminio: 3, fluoruros: 1, cot: 3, coliformes: 15, ecoli: 25,
    };
    expect(CARACTERISTICAS_IRCA).toHaveLength(22);
    for (const c of CARACTERISTICAS_IRCA) expect(c.puntaje, c.id).toBe(esperado[c.id]);
    expect(CARACTERISTICAS_IRCA.reduce((s, c) => s + c.puntaje, 0)).toBe(IRCA_PUNTAJE_TOTAL);
    expect(IRCA_PUNTAJE_TOTAL).toBe(100);
  });

  it("valores máximos aceptables (arts. 2, 4, 6, 7, 9, 11)", () => {
    const max = Object.fromEntries(CARACTERISTICAS_IRCA.map((c) => [c.id, c.max]));
    expect(max).toMatchObject({
      color: 15, turbiedad: 2, ph: 9.0, cloro: 2.0, alcalinidad: 200, calcio: 60, fosfatos: 0.5,
      manganeso: 0.1, molibdeno: 0.07, magnesio: 36, zinc: 3, dureza: 300, sulfatos: 250, hierro: 0.3,
      cloruros: 250, nitratos: 10, nitritos: 0.1, aluminio: 0.2, fluoruros: 1.0, cot: 5, coliformes: 0, ecoli: 0,
    });
    expect(CARACTERISTICAS_IRCA.find((c) => c.id === "ph")?.min).toBe(6.5);
    expect(CARACTERISTICAS_IRCA.find((c) => c.id === "cloro")?.min).toBe(0.3);
  });

  it("cada constante cita norma, artículo, fecha de vigencia y URL", () => {
    for (const c of CARACTERISTICAS_IRCA) {
      for (const cita of [c.citaPuntaje, c.citaLimite]) {
        expect(cita.norma).toBe("Resolución 2115 de 2007");
        expect(cita.articulo.length).toBeGreaterThan(3);
        expect(cita.vigenteDesde).toBe("2007-07-04");
        expect(cita.url).toMatch(/^https:\/\//);
      }
    }
  });
});

describe("Res. 2115/2007 — art. 15, Cuadro 7: cinco rangos", () => {
  it("0-5, 5.1-14, 14.1-35, 35.1-80, 80.1-100", () => {
    expect(IRCA_NIVELES_RIESGO.map((n) => [n.min, n.max, n.etiquetaNorma])).toEqual([
      [0, 5, "SIN RIESGO"], [5.1, 14, "BAJO"], [14.1, 35, "MEDIO"], [35.1, 80, "ALTO"], [80.1, 100, "INVIABLE SANITARIAMENTE"],
    ]);
  });
});

describe("Res. 2115/2007 — art. 13 parágrafo, art. 5 (Cuadro 2), art. 8, art. 34 (Cuadro 16)", () => {
  it("el parágrafo del art. 13 condiciona a un RESULTADO (arts. 5 u 8) o a presencia de Giardia/Cryptosporidium", () => {
    expect(ART13_PARAGRAFO_TEXTO).toContain("exceden los valores máximos aceptables");
    expect(ART13_PARAGRAFO_TEXTO).toContain("puntaje máximo de 100 puntos independientemente de los otros resultados");
    expect(ART13_PARAGRAFO_TEXTO).toContain("presencia de Giardia y Cryptosporidium");
    expect(ART13_PARAGRAFO_TEXTO).toContain("artículo 34");
  });

  it("Cuadro 2 (art. 5), mg/L", () => {
    const m = Object.fromEntries(SUSTANCIAS_ART5.map((s) => [s.id, s.max]));
    expect(m).toEqual({
      antimonio: 0.02, arsenico: 0.01, bario: 0.7, cadmio: 0.003, cianuro: 0.05, cobre: 1.0, cromo: 0.05,
      mercurio: 0.001, niquel: 0.02, plomo: 0.01, selenio: 0.01, thm: 0.2, hap: 0.01,
    });
  });

  it("art. 8, parágrafo 2: suma de plaguicidas ≤ 0,1 mg/L", () => {
    expect(PLAGUICIDAS_SUMA_MAX_MG_L).toBe(0.1);
  });

  it("Cuadro 16 es un CALENDARIO desde el 4-jul-2007 (8, 6, 5, 4 y 3 años) y todos los plazos ya vencieron", () => {
    expect(CUADRO_16_GIARDIA_CRYPTO.map((r) => r.anios)).toEqual([8, 6, 5, 4, 3]);
    expect(CUADRO_16_GIARDIA_CRYPTO.map((r) => r.poblacionHasta)).toEqual([10_000, 20_000, 100_000, 500_000, null]);
    expect(fechaVencimientoCuadro16(8)).toBe("2015-07-04");
    for (const r of CUADRO_16_GIARDIA_CRYPTO) {
      expect(fechaVencimientoCuadro16(r.anios) < "2026-11-17").toBe(true);
    }
  });
});

describe("Res. 2254/2017 — Tabla 1, parágrafo 1 y Tabla 2: vigentes vs. futuros", () => {
  it("Tabla 1 (desde 2018-01-01)", () => {
    const get = (c: string, t: string) => TABLA_1_LIMITES_2018.find((l) => l.contaminante === c && l.tiempo === t)?.valor;
    expect([get("PM10", "anual"), get("PM10", "24 horas"), get("PM2.5", "anual"), get("PM2.5", "24 horas")]).toEqual([50, 100, 25, 50]);
    expect([get("SO2", "24 horas"), get("SO2", "1 hora"), get("NO2", "anual"), get("NO2", "1 hora")]).toEqual([50, 100, 60, 200]);
    expect([get("O3", "8 horas"), get("CO", "8 horas"), get("CO", "1 hora")]).toEqual([100, 5000, 35000]);
  });

  it("desde el 1-jul-2018 PM10 24 h = 75 y PM2.5 24 h = 37 (no 100 ni 50)", () => {
    expect(PM_24H_DESDE_2018_07_01.map((l) => [l.contaminante, l.valor, l.vigenteDesde])).toEqual([
      ["PM10", 75, "2018-07-01"], ["PM2.5", 37, "2018-07-01"],
    ]);
    expect(limiteAireVigente("PM10", "24 horas", "2018-06-30")?.valor).toBe(100);
    expect(limiteAireVigente("PM10", "24 horas", "2026-11-17")?.valor).toBe(75);
    expect(limiteAireVigente("PM2.5", "24 horas", "2026-11-17")?.valor).toBe(37);
  });

  it("Tabla 2 (2030) contiene SOLO PM10 anual 30, PM2.5 anual 15, SO2 24 h 20 y NO2 anual 40", () => {
    expect(TABLA_2_LIMITES_2030.map((l) => [l.contaminante, l.tiempo, l.valor, l.vigenteDesde])).toEqual([
      ["PM10", "anual", 30, "2030-01-01"], ["PM2.5", "anual", 15, "2030-01-01"],
      ["SO2", "24 horas", 20, "2030-01-01"], ["NO2", "anual", 40, "2030-01-01"],
    ]);
    expect(limiteAireVigente("SO2", "24 horas", "2026-11-17")?.valor).toBe(50);
    expect(limiteAireVigente("SO2", "24 horas", "2030-01-01")?.valor).toBe(20);
  });

  it("el JSON público distingue vigentes de futuros y coincide con la fuente canónica", () => {
    const file = path.resolve(__dirname, "../../../../public/data/calidad-aire/colombia.json");
    const json = JSON.parse(readFileSync(file, "utf-8")) as { registros: { parametro: string; limite: string; notas: string[] }[] };
    const num = (s: string) => Number(s.replace(/[^\d,.]/g, "").replace(/\./g, "").replace(",", "."));
    const tiempo = (n: string) => (n.includes("anual") ? "anual" : n.includes("24 horas") ? "24 horas" : n.includes("8 horas") ? "8 horas" : "1 hora");
    const fut = json.registros.filter((r) => r.notas[0].startsWith("FUTURO"));
    const vig = json.registros.filter((r) => r.notas[0].startsWith("VIGENTE"));
    expect(fut.length + vig.length).toBe(json.registros.length);
    expect(fut).toHaveLength(4);
    for (const r of fut) {
      const l = TABLA_2_LIMITES_2030.find((x) => x.contaminante === r.parametro && x.tiempo === tiempo(r.notas[0]));
      expect(l, `${r.parametro} ${r.notas[0]}`).toBeDefined();
      expect(num(r.limite)).toBe(l!.valor);
      expect(r.notas[0]).toContain("1-ene-2030");
    }
    for (const r of vig) {
      const t = tiempo(r.notas[0]);
      const desde = r.notas[0].includes("1-jul-2018") ? "2018-07-01" : "2018-01-01";
      const l = limiteAireVigente(r.parametro as never, t as never, desde);
      expect(l, `${r.parametro} ${r.notas[0]}`).toBeDefined();
      expect(num(r.limite)).toBe(l!.valor);
      expect(l!.vigenteDesde).toBe(desde);
    }
  });
});

describe("Res. 2254/2017 — Tabla 6 (ICA) y Tabla 4: coherencia y consumo por la herramienta", () => {
  it("cada columna de la Tabla 6 es contigua (el siguiente rango empieza donde termina el anterior + 1)", () => {
    const cols = ["pm10_24h", "pm25_24h", "co_8h", "so2_1h", "no2_1h", "o3_8h"] as const;
    for (const c of cols) {
      for (let i = 1; i < TABLA_6_CORTES_ICA.length; i++) {
        const prev = TABLA_6_CORTES_ICA[i - 1][c];
        const cur = TABLA_6_CORTES_ICA[i][c];
        if (c === "o3_8h" && i === TABLA_6_CORTES_ICA.length - 1) {
          expect(cur).toEqual([394, 394]); // nota (2): O3 8 h no se calcula sobre 394
          continue;
        }
        expect(cur[0], `${c}[${i}]`).toBe(prev[1] + 1);
      }
    }
  });

  it("los cortes del ICA ≥101 coinciden con los umbrales de la Tabla 4 (Prevención/Alerta/Emergencia)", () => {
    const fila = (idx: number) => TABLA_6_CORTES_ICA[idx];
    const t4 = (c: string) => TABLA_4_NIVELES.find((n) => n.contaminante === c)!;
    expect(fila(2).co_8h[0]).toBe(t4("CO").prevencion[0]);
    expect(fila(3).co_8h[0]).toBe(t4("CO").alerta[0]);
    expect(fila(4).co_8h[0]).toBe(t4("CO").emergenciaDesde);
    expect(fila(2).pm25_24h[0]).toBe(t4("PM2.5").prevencion[0]);
    expect(fila(3).pm25_24h[0]).toBe(t4("PM2.5").alerta[0]);
    expect(fila(4).pm25_24h[0]).toBe(t4("PM2.5").emergenciaDesde);
    expect(fila(2).so2_1h[0]).toBe(t4("SO2").prevencion[0]);
    expect(fila(3).so2_1h[0]).toBe(t4("SO2").alerta[0]);
    expect(fila(4).so2_1h[0]).toBe(t4("SO2").emergenciaDesde);
    expect(fila(2).no2_1h[0]).toBe(t4("NO2").prevencion[0]);
    expect(fila(3).no2_1h[0]).toBe(t4("NO2").alerta[0]);
    expect(fila(4).no2_1h[0]).toBe(t4("NO2").emergenciaDesde);
    expect(fila(2).o3_8h[0]).toBe(t4("O3").prevencion[0]);
    expect(fila(3).o3_8h[0]).toBe(t4("O3").alerta[0]);
    expect(fila(4).o3_8h[0]).toBe(t4("O3").emergenciaDesde);
    expect(fila(2).pm10_24h[0]).toBe(t4("PM10").prevencion[0]);
    expect(fila(3).pm10_24h[0]).toBe(t4("PM10").alerta[0]);
    expect(fila(4).pm10_24h[0]).toBe(t4("PM10").emergenciaDesde);
  });

  it("C3: cortes corregidos — CO 5094/10819 µg/m³, SO2 a 1 h, NO2 y O3 sin desfase, O3 1 h presente", () => {
    expect(TABLA_6_CORTES_ICA[0].co_8h).toEqual([0, 5094]);
    expect(TABLA_6_CORTES_ICA[1].co_8h).toEqual([5095, 10819]);
    expect(TABLA_6_CORTES_ICA[1].no2_1h).toEqual([101, 189]);
    expect(TABLA_6_CORTES_ICA[2].no2_1h).toEqual([190, 677]);
    expect(TABLA_6_CORTES_ICA[3].o3_8h).toEqual([168, 207]);
    expect(TABLA_6_CORTES_ICA[4].o3_8h).toEqual([208, 393]);
    expect(TABLA_6_CORTES_ICA[5].so2_1h).toEqual([1584, 2629]);
    expect(TABLA_6_CORTES_ICA.map((r) => r.o3_1h)).toEqual([null, null, [245, 323], [324, 401], [402, 794], [795, 1185]]);
  });

  it("la herramienta consume la Tabla 6: SO2 es de 1 h y los valores en los cortes dan el ICA esperado", () => {
    const calc = (id: "pm25" | "no2" | "so2" | "co" | "o3" | "pm10", c: number) =>
      calculatePollutantSubIndex(id, c, ICA_COLOMBIA_BREAKPOINTS, ICA_COLOMBIA_CATEGORIES)!.subIndex;
    expect(ICA_COLOMBIA_BREAKPOINTS.find((b) => b.pollutantId === "so2")!.averagingPeriod).toBe(1);
    expect(calc("pm25", 12.5)).toBe(50); // 12,5 se trunca a 12 (la tabla es entera): no cae en un hueco
    expect(calc("pm25", 13)).toBe(51);
    expect(calc("no2", 189)).toBe(100);
    expect(calc("no2", 190)).toBe(101);
    expect(calc("co", 10.819)).toBe(100); // mg/m³
    expect(calc("co", 10.82)).toBe(101);
    expect(calc("o3", 207)).toBe(200);
    expect(calc("o3", 208)).toBe(201);
    expect(calc("so2", 94)).toBe(51);
  });
});

describe("IBOCA — Res. Conjunta 2840/2023, Tabla 1", () => {
  it("PM2.5 (NowCast 12 h) y rangos contiguos", () => {
    expect(TABLA_1_CORTES_IBOCA.map((r) => r.pm25_12h_nowcast)).toEqual([
      [0, 12.0], [12.1, 35.4], [35.5, 55.4], [55.5, 151.2], [151.3, 250.4], [250.5, 500.4],
    ]);
    expect(TABLA_1_CORTES_IBOCA.map((r) => r.nivelActuacion)).toEqual([
      "Prevención", "Prevención", "Alerta Fase 1", "Alerta Fase 2", "Emergencia", "Emergencia",
    ]);
    expect(TABLA_1_CORTES_IBOCA[5].co_8h).toEqual([28100, 54802]);
  });

  it("la herramienta usa PM de 12 h y los cortes de 2840/2023 (no los derogados de 868/2021: 55,5-150,4)", () => {
    const pm25 = IBOCA_BREAKPOINTS.find((b) => b.pollutantId === "pm25")!;
    expect(pm25.averagingPeriod).toBe(12);
    expect(pm25.breakpoints[3]).toMatchObject({ bpLo: 55.5, bpHi: 151.2 });
  });
});
