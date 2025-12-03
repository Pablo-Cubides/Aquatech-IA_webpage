import React from "react";

interface CorrelationResult {
  column_a: string;
  column_b: string;
  pearson: number | null;
  spearman: number | null;
  kendall: number | null;
}

interface ExportButtonsProps {
  correlationResults: CorrelationResult[];
  numericColumns: string[];
  rawData: Record<string, unknown>[];
  heatmapRef?: React.RefObject<HTMLDivElement | null>;
}

function exportCSV(results: CorrelationResult[]) {
  const header = ["Columna A", "Columna B", "Pearson", "Spearman", "Kendall"];
  const rows = results.map((r) => [
    r.column_a,
    r.column_b,
    r.pearson,
    r.spearman,
    r.kendall,
  ]);
  const csv = [header, ...rows].map((row) => row.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "reporte_correlacion.csv";
  a.click();
  URL.revokeObjectURL(url);
}

function exportJSON(results: CorrelationResult[]) {
  const blob = new Blob([JSON.stringify(results, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "reporte_correlacion.json";
  a.click();
  URL.revokeObjectURL(url);
}

function exportHeatmapPNG(ref: React.RefObject<HTMLDivElement | null>) {
  if (!ref.current) return;
  import("html-to-image").then((htmlToImage) => {
    if (ref.current) {
      htmlToImage.toPng(ref.current).then((dataUrl) => {
        const a = document.createElement("a");
        a.href = dataUrl;
        a.download = "heatmap.png";
        a.click();
      });
    }
  });
}

export default function ExportButtons({
  correlationResults,
  heatmapRef,
}: ExportButtonsProps) {
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      <button
        className="bg-primary text-white px-3 py-1 rounded hover:bg-blue-700 transition"
        onClick={() => exportCSV(correlationResults)}
      >
        Descargar CSV
      </button>
      <button
        className="bg-primary text-white px-3 py-1 rounded hover:bg-blue-700 transition"
        onClick={() => exportJSON(correlationResults)}
      >
        Descargar JSON
      </button>
      {heatmapRef && (
        <button
          className="bg-primary text-white px-3 py-1 rounded hover:bg-blue-700 transition"
          onClick={() => exportHeatmapPNG(heatmapRef)}
        >
          Exportar heatmap como PNG
        </button>
      )}
    </div>
  );
}
