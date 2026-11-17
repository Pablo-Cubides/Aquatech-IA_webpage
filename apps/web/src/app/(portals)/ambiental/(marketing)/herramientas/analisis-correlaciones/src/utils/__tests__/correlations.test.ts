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

// Las pruebas de Pearson, Spearman y Kendall que había aquí probaban COPIAS locales de las funciones,
// no el código de producción (por eso nadie vio que el Spearman daba siempre 1,00). Se retiraron en
// ARQ-010: las pruebas reales, contra valores de referencia independientes, están en correlations-math.test.ts.

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
