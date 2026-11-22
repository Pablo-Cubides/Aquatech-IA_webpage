import { describe, expect, it } from "vitest";
import { jsPDF } from "jspdf";
import { addPaginatedImage } from "../pdf-export";

// PNG de 1x1 píxel: basta para comprobar cuántas hojas se generan con jsPDF real.
const PNG_1X1 =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";

function newDoc() {
  return new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
}

describe("addPaginatedImage (informe de agua)", () => {
  it("un informe que cabe en una hoja genera una sola hoja", () => {
    const doc = newDoc();
    // Alto = mitad de A4 al ancho de la hoja.
    expect(addPaginatedImage(doc, PNG_1X1, 1000, 700)).toBe(1);
    expect(doc.getNumberOfPages()).toBe(1);
  });

  it("un informe largo se reparte en varias hojas y no se corta", () => {
    const doc = newDoc();
    // Alto = 3,5 veces el de una hoja A4 → 4 hojas (antes: 1 hoja con el 71 % de los datos perdido).
    const widthPx = 1000;
    const a4Ratio = 297 / 210;
    const heightPx = Math.round(widthPx * a4Ratio * 3.5);
    expect(addPaginatedImage(doc, PNG_1X1, widthPx, heightPx)).toBe(4);
    expect(doc.getNumberOfPages()).toBe(4);
  });

  it("un alto exactamente igual a N hojas no añade una hoja en blanco", () => {
    const doc = newDoc();
    const widthPx = 2000;
    const { width, height } = doc.internal.pageSize;
    const heightPx = Math.round((widthPx * height * 2) / width); // 2 hojas justas
    expect(addPaginatedImage(doc, PNG_1X1, widthPx, heightPx)).toBe(2);
  });
});
