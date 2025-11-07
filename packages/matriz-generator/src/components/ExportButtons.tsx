"use client";
import React from "react";

interface ExportButtonsProps {
  matrixType: "leopold" | "conesa" | "battelle";
  caseId: string;
  data: any;
  matrixRef?: React.RefObject<HTMLDivElement | null>;
}

export default function ExportButtons({
  matrixType,
  caseId,
  data,
  matrixRef,
}: ExportButtonsProps) {
  const exportToPDF = async () => {
    console.log("Exportar a PDF:", { matrixType, caseId });
    // Dynamic imports para reducir bundle inicial
    try {
      const { default: jsPDF } = await import("jspdf");
      await import("jspdf-autotable");
      const { default: html2canvas } = await import("html2canvas");

      const doc = new jsPDF("landscape", "mm", "a4");
      const pageWidth = doc.internal.pageSize.width;
      const pageHeight = doc.internal.pageSize.height;

      // Header
      doc.setFontSize(20);
      doc.text("Matriz de Evaluación de Impacto Ambiental", pageWidth / 2, 20, {
        align: "center",
      });
      doc.setFontSize(14);
      doc.text(
        `Método: ${matrixType.charAt(0).toUpperCase() + matrixType.slice(1)}`,
        pageWidth / 2,
        30,
        { align: "center" },
      );

      const now = new Date();
      doc.setFontSize(10);
      doc.text(`Generado: ${now.toLocaleDateString()}`, 20, pageHeight - 10);

      doc.save(`matriz-${matrixType}-${caseId}.pdf`);
    } catch (error) {
      console.error("Error exportando PDF:", error);
    }
  };

  const exportToExcel = async () => {
    console.log("Exportar a Excel:", { matrixType, caseId });
    try {
      const { writeFile, utils } = await import("xlsx");
      const ws = utils.json_to_sheet(data);
      const wb = utils.book_new();
      utils.book_append_sheet(wb, ws, "Matriz");
      writeFile(wb, `matriz-${matrixType}-${caseId}.xlsx`);
    } catch (error) {
      console.error("Error exportando Excel:", error);
    }
  };

  const exportToCSV = async () => {
    console.log("Exportar a CSV:", { matrixType, caseId });
    try {
      const { stringify } = await import("csv-stringify/sync");
      const csv = stringify(data);
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `matriz-${matrixType}-${caseId}.csv`;
      a.click();
    } catch (error) {
      console.error("Error exportando CSV:", error);
    }
  };

  return (
    <div className="flex gap-3 flex-wrap">
      <button
        onClick={exportToPDF}
        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
      >
        📄 Descargar PDF
      </button>
      <button
        onClick={exportToExcel}
        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
      >
        📊 Descargar Excel
      </button>
      <button
        onClick={exportToCSV}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
      >
        📋 Descargar CSV
      </button>
      <button
        onClick={() => window.print()}
        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
      >
        🖨️ Imprimir
      </button>
    </div>
  );
}
