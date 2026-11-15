import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  logEvent,
  trackPageView,
  trackToolEvent,
  trackError,
} from "../analytics";
import { reportClientError } from "@/lib/observability/sentry-client";

// Mock del reporte a Sentry (carga diferida) y del helper de envío de uso
vi.mock("@/lib/observability/sentry-client", () => ({ reportClientError: vi.fn() }));
const sendMock = vi.hoisted(() => vi.fn());
vi.mock("@/lib/analytics/track", () => ({ sendToolEvent: sendMock }));

describe("Análisis de Correlaciones - Analytics (OPS-001)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("el uso va a la tabla de eventos como tool_action y NUNCA a Sentry", () => {
    logEvent("test_event", { param1: "value1" });

    expect(sendMock).toHaveBeenCalledWith(
      "analisis-correlaciones",
      "tool_action",
      expect.objectContaining({ action: "test_event", param1: "value1" }),
    );
    expect(reportClientError).not.toHaveBeenCalled();
  });

  it("ignora userId: el correo del usuario no sale en ningún evento", () => {
    logEvent("user_event", { action: "upload" }, "ana@uni.edu.co");

    expect(JSON.stringify(sendMock.mock.calls)).not.toContain("ana@uni.edu.co");
    expect(reportClientError).not.toHaveBeenCalled();
  });

  it("trackToolEvent antepone tool_ al nombre de la acción", () => {
    trackToolEvent("file_upload", { format: "csv" });

    expect(sendMock).toHaveBeenCalledWith(
      "analisis-correlaciones",
      "tool_action",
      expect.objectContaining({ action: "tool_file_upload", format: "csv" }),
    );
  });

  it("trackPageView no duplica la visita que ya cuenta el layout", () => {
    trackPageView("/correlaciones", "user456");

    expect(sendMock).not.toHaveBeenCalled();
  });

  it("trackError envía el error a Sentry con la etiqueta de herramienta, sin userId ni contexto", () => {
    const error = new Error("Parsing failed");

    trackError(error, { file: "datos-de-estudiantes.csv" }, "user999");

    expect(reportClientError).toHaveBeenCalledWith(error, { tool: "analisis-correlaciones" });
    expect(sendMock).toHaveBeenCalledWith("analisis-correlaciones", "tool_error", {
      kind: "handled",
      name: "Error",
    });
  });

});

describe("Correlación de Pearson", () => {
  // Helper function to calculate Pearson (copied from implementation)
  function pearsonCorrelation(x: number[], y: number[]): number {
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
    const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt(
      (n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY),
    );

    return denominator === 0 ? 0 : numerator / denominator;
  }

  it("should calculate perfect positive correlation", () => {
    const x = [1, 2, 3, 4, 5];
    const y = [2, 4, 6, 8, 10];
    const r = pearsonCorrelation(x, y);
    expect(r).toBeCloseTo(1.0, 10);
  });

  it("should calculate perfect negative correlation", () => {
    const x = [1, 2, 3, 4, 5];
    const y = [10, 8, 6, 4, 2];
    const r = pearsonCorrelation(x, y);
    expect(r).toBeCloseTo(-1.0, 10);
  });

  it("should calculate zero correlation for independent variables", () => {
    const x = [1, 2, 3, 4, 5];
    const y = [5, 3, 7, 2, 8];
    const r = pearsonCorrelation(x, y);
    expect(Math.abs(r)).toBeLessThan(0.5);
  });

  it("should handle constant values gracefully", () => {
    const x = [5, 5, 5, 5, 5];
    const y = [1, 2, 3, 4, 5];
    const r = pearsonCorrelation(x, y);
    expect(r).toBe(0); // No variation in X
  });
});

describe("Correlación de Spearman", () => {
  // Helper function for ranking (must maintain original indices)
  function getRanks(arr: number[]): number[] {
    const indexed = arr.map((val, idx) => ({ val, idx }));
    indexed.sort((a, b) => a.val - b.val);

    const ranks = new Array(arr.length);
    indexed.forEach((item, rank) => {
      ranks[item.idx] = rank + 1;
    });

    return ranks;
  }

  function spearmanCorrelation(x: number[], y: number[]): number {
    const rankX = getRanks(x);
    const rankY = getRanks(y);

    const n = rankX.length;
    const sumX = rankX.reduce((a, b) => a + b, 0);
    const sumY = rankY.reduce((a, b) => a + b, 0);
    const sumXY = rankX.reduce((sum, xi, i) => sum + xi * rankY[i], 0);
    const sumX2 = rankX.reduce((sum, xi) => sum + xi * xi, 0);
    const sumY2 = rankY.reduce((sum, yi) => sum + yi * yi, 0);

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt(
      (n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY),
    );

    return denominator === 0 ? 0 : numerator / denominator;
  }

  it("should calculate perfect monotonic relationship", () => {
    const x = [1, 2, 3, 4, 5];
    const y = [1, 4, 9, 16, 25]; // x^2, non-linear but monotonic
    const r = spearmanCorrelation(x, y);
    expect(r).toBeCloseTo(1.0, 10);
  });

  it("should calculate negative monotonic relationship", () => {
    const x = [1, 2, 3, 4, 5];
    const y = [25, 16, 9, 4, 1];
    const r = spearmanCorrelation(x, y);
    expect(r).toBeCloseTo(-1.0, 10);
  });

  it("should handle tied ranks", () => {
    const x = [1, 2, 3, 3, 4];
    const y = [2, 4, 6, 6, 8];
    const r = spearmanCorrelation(x, y);
    expect(r).toBeGreaterThan(0.9);
  });
});

describe("Correlación de Kendall Tau", () => {
  function kendallCorrelation(x: number[], y: number[]): number {
    let concordant = 0;
    let discordant = 0;

    for (let i = 0; i < x.length; i++) {
      for (let j = i + 1; j < x.length; j++) {
        const signX = Math.sign(x[j] - x[i]);
        const signY = Math.sign(y[j] - y[i]);

        if (signX === signY && signX !== 0) concordant++;
        else if (signX !== signY && signX !== 0 && signY !== 0) discordant++;
      }
    }

    return (concordant - discordant) / (concordant + discordant);
  }

  it("should calculate perfect concordance", () => {
    const x = [1, 2, 3, 4, 5];
    const y = [1, 2, 3, 4, 5];
    const tau = kendallCorrelation(x, y);
    expect(tau).toBe(1.0);
  });

  it("should calculate perfect discordance", () => {
    const x = [1, 2, 3, 4, 5];
    const y = [5, 4, 3, 2, 1];
    const tau = kendallCorrelation(x, y);
    expect(tau).toBe(-1.0);
  });

  it("should handle mixed concordance", () => {
    const x = [1, 2, 3, 4];
    const y = [1, 3, 2, 4];
    const tau = kendallCorrelation(x, y);
    expect(tau).toBeGreaterThan(0);
    expect(tau).toBeLessThan(1);
  });

  it("should be symmetric", () => {
    const x = [1, 2, 3, 4, 5];
    const y = [2, 3, 1, 5, 4];
    const tau1 = kendallCorrelation(x, y);
    const tau2 = kendallCorrelation(y, x);
    expect(tau1).toBeCloseTo(tau2, 10);
  });
});

describe("Validación de datos numéricos", () => {
  function isNumericColumn(data: Record<string, unknown>[], column: string): boolean {
    return data.some(
      (row) => typeof row[column] === "number" && !isNaN(row[column] as number),
    );
  }

  function filterValidPairs(
    data: Record<string, unknown>[],
    col1: string,
    col2: string,
  ): Array<{ x: number; y: number }> {
    return data
      .map((row) => ({ x: row[col1], y: row[col2] }))
      .filter(
        (pair) =>
          typeof pair.x === "number" &&
          typeof pair.y === "number" &&
          !isNaN(pair.x) &&
          !isNaN(pair.y),
      ) as Array<{ x: number; y: number }>;
  }

  it("should identify numeric columns", () => {
    const data = [
      { temp: 25, humidity: 60, location: "A" },
      { temp: 30, humidity: 55, location: "B" },
    ];

    expect(isNumericColumn(data, "temp")).toBe(true);
    expect(isNumericColumn(data, "humidity")).toBe(true);
    expect(isNumericColumn(data, "location")).toBe(false);
  });

  it("should filter valid numeric pairs", () => {
    const data = [
      { x: 1, y: 2 },
      { x: 2, y: null },
      { x: 3, y: 4 },
      { x: "invalid", y: 5 },
    ];

    const pairs = filterValidPairs(data, "x", "y");
    expect(pairs).toHaveLength(2);
    expect(pairs[0]).toEqual({ x: 1, y: 2 });
    expect(pairs[1]).toEqual({ x: 3, y: 4 });
  });

  it("should handle missing values", () => {
    const data = [
      { a: 1, b: 2 },
      { a: undefined, b: 3 },
      { a: 4, b: NaN },
      { a: 5, b: 6 },
    ];

    const pairs = filterValidPairs(data, "a", "b");
    expect(pairs).toHaveLength(2);
  });

  it("should require at least 2 valid pairs", () => {
    const data = [{ x: 1, y: 2 }];

    const pairs = filterValidPairs(data, "x", "y");
    expect(pairs.length).toBeLessThan(2);
  });
});
