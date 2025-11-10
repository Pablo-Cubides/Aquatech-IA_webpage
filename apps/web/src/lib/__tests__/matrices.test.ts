import { describe, it, expect } from "vitest";
import {
  computeLeopoldCell,
  computeConesa,
  computeBattelle,
} from "@/lib/matrices";

describe("Leopold Matrix Calculations", () => {
  describe("computeLeopoldCell", () => {
    it("should clamp magnitud to -10..10 range", () => {
      const cellOver = computeLeopoldCell({
        impactoId: "i1",
        magnitud: 15,
        importancia: 5,
        S: 0,
      });
      expect(cellOver.magnitud).toBe(10);

      const cellUnder = computeLeopoldCell({
        impactoId: "i2",
        magnitud: -15,
        importancia: 5,
        S: 0,
      });
      expect(cellUnder.magnitud).toBe(-10);
    });

    it("should clamp importancia to 1..10 range", () => {
      const cellOver = computeLeopoldCell({
        impactoId: "i1",
        magnitud: 5,
        importancia: 15,
        S: 0,
      });
      expect(cellOver.importancia).toBe(10);

      const cellUnder = computeLeopoldCell({
        impactoId: "i2",
        magnitud: 5,
        importancia: 0,
        S: 0,
      });
      expect(cellUnder.importancia).toBe(1);
    });

    it("should calculate S = |magnitud| × importancia", () => {
      const cell1 = computeLeopoldCell({
        impactoId: "i1",
        magnitud: 8,
        importancia: 7,
        S: 0,
      });
      expect(cell1.S).toBe(8 * 7);

      const cell2 = computeLeopoldCell({
        impactoId: "i2",
        magnitud: -6,
        importancia: 9,
        S: 0,
      });
      expect(cell2.S).toBe(6 * 9);
    });

    it("should preserve impactoId", () => {
      const cell = computeLeopoldCell({
        impactoId: "impact-123",
        magnitud: 5,
        importancia: 5,
        S: 0,
      });
      expect(cell.impactoId).toBe("impact-123");
    });

    it("should handle edge values correctly", () => {
      const cell1 = computeLeopoldCell({
        impactoId: "i1",
        magnitud: 10,
        importancia: 10,
        S: 0,
      });
      expect(cell1.S).toBe(100);

      const cell2 = computeLeopoldCell({
        impactoId: "i2",
        magnitud: -10,
        importancia: 1,
        S: 0,
      });
      expect(cell2.S).toBe(10);
    });
  });
});

describe("Conesa Matrix Calculations", () => {
  describe("computeConesa", () => {
    it("should clamp all criteria to valid ranges", () => {
      const impact = computeConesa({
        impactoId: "i1",
        IN: 15, // max 12
        EX: 10, // max 8
        MO: 5, // max 4
        PE: 5, // max 4
        RV: 5, // max 4
        SI: 5, // max 4
        AC: 5, // max 4
        EF: 5, // max 4
        PR: 5, // max 4
        MC: 10, // max 8
      });

      expect(impact.IN).toBe(12);
      expect(impact.EX).toBe(8);
      expect(impact.MO).toBe(4);
      expect(impact.PE).toBe(4);
      expect(impact.RV).toBe(4);
      expect(impact.SI).toBe(4);
      expect(impact.AC).toBe(4);
      expect(impact.EF).toBe(4);
      expect(impact.PR).toBe(4);
      expect(impact.MC).toBe(8);
    });

    it("should calculate I with correct formula: I = 3×IN + 2×EX + MO + PE + RV + SI + AC + EF + PR + MC", () => {
      const impact = computeConesa({
        impactoId: "i1",
        IN: 8,
        EX: 4,
        MO: 2,
        PE: 2,
        RV: 2,
        SI: 2,
        AC: 2,
        EF: 2,
        PR: 2,
        MC: 4,
      });

      const expectedI = 3 * 8 + 2 * 4 + 2 + 2 + 2 + 2 + 2 + 2 + 2 + 4;
      expect(impact.I).toBe(expectedI);
    });

    it('should categorize as "Irrelevante" when I < 25', () => {
      const impact = computeConesa({
        impactoId: "i1",
        IN: 1,
        EX: 1,
        MO: 1,
        PE: 1,
        RV: 1,
        SI: 1,
        AC: 1,
        EF: 1,
        PR: 1,
        MC: 1,
      });

      expect(impact.I).toBeLessThan(25);
      expect(impact.categoria).toBe("Irrelevante");
    });

    it('should categorize as "Moderado" when 25 ≤ I < 50', () => {
      const impact = computeConesa({
        impactoId: "i1",
        IN: 6,
        EX: 2,
        MO: 2,
        PE: 2,
        RV: 1,
        SI: 1,
        AC: 1,
        EF: 1,
        PR: 1,
        MC: 1,
      });

      expect(impact.I).toBeGreaterThanOrEqual(25);
      expect(impact.I).toBeLessThan(50);
      expect(impact.categoria).toBe("Moderado");
    });

    it('should categorize as "Severo" when 50 ≤ I < 75', () => {
      const impact = computeConesa({
        impactoId: "i1",
        IN: 10,
        EX: 6,
        MO: 2,
        PE: 2,
        RV: 2,
        SI: 2,
        AC: 2,
        EF: 2,
        PR: 2,
        MC: 2,
      });

      expect(impact.I).toBeGreaterThanOrEqual(50);
      expect(impact.I).toBeLessThan(75);
      expect(impact.categoria).toBe("Severo");
    });

    it('should categorize as "Crítico" when I ≥ 75', () => {
      const impact = computeConesa({
        impactoId: "i1",
        IN: 12,
        EX: 8,
        MO: 4,
        PE: 4,
        RV: 4,
        SI: 4,
        AC: 4,
        EF: 4,
        PR: 4,
        MC: 8,
      });

      expect(impact.I).toBeGreaterThanOrEqual(75);
      expect(impact.categoria).toBe("Crítico");
    });

    it("should handle partial input with defaults", () => {
      const impact = computeConesa({
        impactoId: "i1",
        IN: 8,
        EX: 4,
      });

      expect(impact.IN).toBe(8);
      expect(impact.EX).toBe(4);
      expect(impact.MO).toBe(1); // default
      expect(impact.I).toBeGreaterThan(0);
    });

    it("should apply positive sign", () => {
      const impact = computeConesa({
        impactoId: "i1",
        IN: 8,
        EX: 4,
        MO: 2,
        PE: 2,
        RV: 2,
        SI: 2,
        AC: 2,
        EF: 2,
        PR: 2,
        MC: 4,
        signo: "+",
      });

      expect(impact.signo).toBe("+");
    });

    it("should apply negative sign", () => {
      const impact = computeConesa({
        impactoId: "i1",
        IN: 8,
        EX: 4,
        MO: 2,
        PE: 2,
        RV: 2,
        SI: 2,
        AC: 2,
        EF: 2,
        PR: 2,
        MC: 4,
        signo: "-",
      });

      expect(impact.signo).toBe("-");
    });
  });
});

describe("Battelle-Columbus System Calculations", () => {
  describe("computeBattelle", () => {
    it("should clamp UIP to 1..1000 range", () => {
      const impact1 = computeBattelle({
        impactoId: "i1",
        categoria: "FÍSICO-QUÍMICO",
        uip: 1500,
        calidad_sin: 2,
        calidad_con: 3,
      });
      expect(impact1.uip).toBe(1000);

      const impact2 = computeBattelle({
        impactoId: "i2",
        categoria: "FÍSICO-QUÍMICO",
        uip: 0,
        calidad_sin: 2,
        calidad_con: 3,
      });
      expect(impact2.uip).toBe(1);
    });

    it("should clamp calidad values to 1..4 range", () => {
      const impact1 = computeBattelle({
        impactoId: "i1",
        categoria: "BIOLÓGICO",
        uip: 100,
        calidad_sin: 0,
        calidad_con: 5,
      });
      expect(impact1.calidad_sin).toBe(1);
      expect(impact1.calidad_con).toBe(4);
    });

    it("should calculate PIA_sin = UIP × calidad_sin", () => {
      const impact = computeBattelle({
        impactoId: "i1",
        categoria: "CULTURAL",
        uip: 200,
        calidad_sin: 3,
        calidad_con: 2,
      });

      expect(impact.pia_sin).toBe(200 * 3);
    });

    it("should calculate PIA_con = UIP × calidad_con", () => {
      const impact = computeBattelle({
        impactoId: "i1",
        categoria: "ECOLÓGICO-ESTÉTICO",
        uip: 150,
        calidad_sin: 2,
        calidad_con: 4,
      });

      expect(impact.pia_con).toBe(150 * 4);
    });

    it("should calculate UIA = PIA_con - PIA_sin", () => {
      const impact = computeBattelle({
        impactoId: "i1",
        categoria: "FÍSICO-QUÍMICO",
        uip: 100,
        calidad_sin: 2,
        calidad_con: 4,
      });

      const expectedUIA = 100 * 4 - 100 * 2;
      expect(impact.uia).toBe(expectedUIA);
    });

    it("should handle positive impact (quality improves)", () => {
      const impact = computeBattelle({
        impactoId: "i1",
        categoria: "BIOLÓGICO",
        uip: 100,
        calidad_sin: 2,
        calidad_con: 4,
      });

      expect(impact.uia).toBeGreaterThan(0);
    });

    it("should handle negative impact (quality decreases)", () => {
      const impact = computeBattelle({
        impactoId: "i1",
        categoria: "CULTURAL",
        uip: 100,
        calidad_sin: 4,
        calidad_con: 2,
      });

      expect(impact.uia).toBeLessThan(0);
    });

    it("should handle neutral impact (no quality change)", () => {
      const impact = computeBattelle({
        impactoId: "i1",
        categoria: "ECOLÓGICO-ESTÉTICO",
        uip: 100,
        calidad_sin: 3,
        calidad_con: 3,
      });

      expect(impact.uia).toBe(0);
    });

    it("should preserve categoria", () => {
      const categories: Array<
        "FÍSICO-QUÍMICO" | "BIOLÓGICO" | "CULTURAL" | "ECOLÓGICO-ESTÉTICO"
      > = ["FÍSICO-QUÍMICO", "BIOLÓGICO", "CULTURAL", "ECOLÓGICO-ESTÉTICO"];

      categories.forEach((cat) => {
        const impact = computeBattelle({
          impactoId: "i1",
          categoria: cat,
          uip: 100,
          calidad_sin: 2,
          calidad_con: 3,
        });
        expect(impact.categoria).toBe(cat);
      });
    });

    it("should handle maximum values correctly", () => {
      const impact = computeBattelle({
        impactoId: "i1",
        categoria: "FÍSICO-QUÍMICO",
        uip: 1000,
        calidad_sin: 1,
        calidad_con: 4,
      });

      expect(impact.pia_sin).toBe(1000);
      expect(impact.pia_con).toBe(4000);
      expect(impact.uia).toBe(3000);
    });

    it("should handle minimum positive values", () => {
      const impact = computeBattelle({
        impactoId: "i1",
        categoria: "BIOLÓGICO",
        uip: 1,
        calidad_sin: 1,
        calidad_con: 2,
      });

      expect(impact.pia_sin).toBe(1);
      expect(impact.pia_con).toBe(2);
      expect(impact.uia).toBe(1);
    });
  });
});

describe("Matrix Calculations Edge Cases", () => {
  it("Leopold should handle zero magnitud", () => {
    const cell = computeLeopoldCell({
      impactoId: "i1",
      magnitud: 0,
      importancia: 5,
      S: 0,
    });
    expect(cell.S).toBe(0);
  });

  it("Conesa should handle all minimum values", () => {
    const impact = computeConesa({
      impactoId: "i1",
      IN: 1,
      EX: 1,
      MO: 1,
      PE: 1,
      RV: 1,
      SI: 1,
      AC: 1,
      EF: 1,
      PR: 1,
      MC: 1,
    });

    const minI = 3 * 1 + 2 * 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1 + 1;
    expect(impact.I).toBe(minI);
  });

  it("Conesa should handle all maximum values", () => {
    const impact = computeConesa({
      impactoId: "i1",
      IN: 12,
      EX: 8,
      MO: 4,
      PE: 4,
      RV: 4,
      SI: 4,
      AC: 4,
      EF: 4,
      PR: 4,
      MC: 8,
    });

    const maxI = 3 * 12 + 2 * 8 + 4 + 4 + 4 + 4 + 4 + 4 + 4 + 8;
    expect(impact.I).toBe(maxI);
  });

  it("Battelle should handle partial values with defaults", () => {
    const impact = computeBattelle({
      impactoId: "i1",
      categoria: "FÍSICO-QUÍMICO",
      uip: 100,
    });

    expect(impact.calidad_sin).toBeGreaterThanOrEqual(1);
    expect(impact.calidad_con).toBeGreaterThanOrEqual(1);
    expect(impact.pia_sin).toBeGreaterThan(0);
    expect(impact.pia_con).toBeGreaterThan(0);
  });
});
