import React from "react";
import { exportCorrelationsPDF } from "../src/utils/pdf-export";
import type { AnalysisResult } from "../types/analysis";

interface CorrelationResult {
  column_a: string;
  column_b: string;
  pearson: number | null;
  spearman: number | null;
  kendall: number | null;
}

interface ExportButtonsProps {
  correlationResults?: CorrelationResult[];
  numericColumns?: string[];
  rawData?: Record<string, unknown>[];
  contentRef?: React.RefObject<HTMLDivElement | null>;
  filename?: string;
  analysisType?: "correlation" | "growth" | "trend" | "comparison";
  results?: AnalysisResult; // Full result object for extended PDF generation
}

import { toPng } from "html-to-image";

const exportCSV = (data: CorrelationResult[]) => {
  const headers = [
    "Variable 1",
    "Variable 2",
    "Pearson",
    "Spearman",
    "Kendall",
  ];
  const rows = data.map((row) => [
    row.column_a,
    row.column_b,
    row.pearson?.toFixed(4) || "",
    row.spearman?.toFixed(4) || "",
    row.kendall?.toFixed(4) || "",
  ]);
  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join(
    "\n",
  );
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", "correlaciones.csv");
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const exportJSON = (data: CorrelationResult[]) => {
  const dataStr =
    "data:text/json;charset=utf-8," +
    encodeURIComponent(JSON.stringify(data, null, 2));
  const downloadAnchorNode = document.createElement("a");
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", "correlaciones.json");
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
};

const exportHeatmapPNG = async (
  ref: React.RefObject<HTMLDivElement | null>,
) => {
  if (!ref.current) return;
  try {
    const dataUrl = await toPng(ref.current, {
      backgroundColor: "#ffffff",
      quality: 0.95,
    });
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = "heatmap.png";
    link.click();
  } catch (e) {
    console.error("Error exporting PNG:", e);
  }
};

export default function ExportButtons({
  correlationResults = [],
  numericColumns = [],
  rawData = [],
  contentRef,
  filename,
  analysisType = "correlation",
  results,
}: ExportButtonsProps) {
  const handleExportPDF = async () => {
    await exportCorrelationsPDF(
      {
        filename: filename || "Analisis_Correlacion",
        correlationResults,
        numericColumns,
        rawDataCount: rawData.length,
        type: analysisType,
        fullResults: results,
      },
      contentRef?.current,
    );
  };

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      <button
        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition flex items-center gap-2"
        onClick={handleExportPDF}
      >
        <span>📄</span> Exportar Reporte PDF
      </button>

      {analysisType === "correlation" && (
        <>
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
        </>
      )}

      {contentRef && (
        <button
          className="bg-primary text-white px-3 py-1 rounded hover:bg-blue-700 transition"
          onClick={() => exportHeatmapPNG(contentRef)}
        >
          Exportar Visualización PNG
        </button>
      )}
    </div>
  );
}
