import { describe, expect, it, vi } from "vitest";
import { jsPDF } from "jspdf";
import { autoTable } from "jspdf-autotable";
import { read, utils, write } from "xlsx";
import { AttributionControl, type Map } from "maplibre-gl";

describe("patched document and map dependencies", () => {
  it("generates a PDF with the existing table export APIs", () => {
    const doc = new jsPDF({ orientation: "landscape" });
    doc.text("Synthetic environmental assessment", 20, 20);
    autoTable(doc, {
      head: [["Indicator", "Value"]],
      body: [["Water quality", "42"]],
    });
    const pdf = doc.output();
    expect(pdf).toMatch(/^%PDF-/);
    expect(pdf).toContain("Water quality");
    expect(pdf).toContain("42");
    expect(pdf.trimEnd()).toMatch(/%%EOF$/);
  });

  it.each(["xlsx", "xls"] as const)(
    "round-trips a synthetic %s workbook with numeric and Unicode cells",
    (bookType) => {
      const rows = [{ Nombre: "Estación sintética", Nota: 4.5, Activo: true }];
      const workbook = utils.book_new();
      utils.book_append_sheet(workbook, utils.json_to_sheet(rows), "Datos");
      const bytes = write(workbook, { type: "array", bookType });
      const restored = read(bytes, { type: "array" });
      expect(restored.SheetNames).toEqual(["Datos"]);
      expect(utils.sheet_to_json(restored.Sheets.Datos)).toEqual(rows);
    },
  );

  it("removes adjacent unsafe attributes and script URLs from map attribution", () => {
    // Exercise the public control without GPU, tiles, credentials or network.
    const map = {
      style: { tileManagers: {}, stylesheet: {} },
      _getUIString: () => "Attribution",
      getCanvasContainer: () => document.createElement("div"),
      on: vi.fn(),
      off: vi.fn(),
    } as unknown as Map;
    const control = new AttributionControl({
      compact: false,
      customAttribution:
        '<a href="https://example.org/" onload="alert(1)" onclick="alert(2)">Safe credit</a>' +
        '<a href="javascript:alert(3)">Unsafe link</a><script>alert(4)</script>',
    });
    const container = control.onAdd(map);
    try {
      const attribution = container.querySelector(
        ".maplibregl-ctrl-attrib-inner",
      );
      expect(attribution?.textContent).toContain("Safe credit");
      expect(
        attribution?.querySelector('a[href="https://example.org/"]'),
      ).not.toBeNull();
      expect(
        attribution?.querySelector("[onload], [onclick], script"),
      ).toBeNull();
      expect(attribution?.querySelector('a[href^="javascript:"]')).toBeNull();
    } finally {
      control.onRemove();
    }
  });
});
