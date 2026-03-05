// Utilidades para exportar reporte de correlaciones a PDF
import { jsPDF } from "jspdf";
import { toPng } from "html-to-image";
import type { AnalysisResult } from "../../types/analysis";

interface CorrelationResult {
  column_a: string;
  column_b: string;
  pearson: number | null;
  spearman: number | null;
  kendall: number | null;
}

interface AnalysisReportData {
  filename: string;
  correlationResults: CorrelationResult[];
  numericColumns: string[];
  rawDataCount: number;
  type?: "correlation" | "growth" | "trend" | "comparison";
  fullResults?: AnalysisResult;
}

export async function exportCorrelationsPDF(
  data: AnalysisReportData,
  contentRef?: HTMLElement | null,
) {
  // Use LANDSCAPE for better heatmap display when there are many variables
  const useLandscape =
    data.numericColumns.length > 3 || data.type !== "correlation";

  const doc = new jsPDF({
    orientation: useLandscape ? "landscape" : "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  let yPosition = margin;

  // --- Header ---
  const logoUrl = "/images/Logo Aquatech - IA 512 - sin fondo.png";
  try {
    const img = new Image();
    img.src = logoUrl;
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
    });
    const logoHeight = 15;
    const logoWidth = (img.width / img.height) * logoHeight;
    const xLogo = (pageWidth - logoWidth) / 2;
    doc.addImage(img, "PNG", xLogo, yPosition, logoWidth, logoHeight);
    yPosition += logoHeight + 3;
  } catch (e) {
    console.error("Error loading logo for PDF", e);
    doc.setFontSize(22);
    doc.setTextColor(31, 41, 55);
    doc.text("Aquatech IA", pageWidth / 2, yPosition + 10, { align: "center" });
    yPosition += 15;
  }

  // Title
  doc.setFontSize(16);
  doc.setTextColor(31, 41, 55);
  const titleText =
    data.type === "growth"
      ? "Reporte de Análisis de Crecimiento"
      : data.type === "trend"
        ? "Reporte de Análisis de Tendencias"
        : data.type === "comparison"
          ? "Reporte de Análisis Comparativo"
          : "Reporte de Análisis de Correlaciones";

  doc.text(titleText, pageWidth / 2, yPosition + 4, { align: "center" });
  yPosition += 10;

  // Meta info with country/source
  doc.setFontSize(10);
  doc.setTextColor(107, 114, 128);
  doc.text(
    `Generado el: ${new Date().toLocaleString()}`,
    pageWidth / 2,
    yPosition,
    { align: "center" },
  );
  yPosition += 4;
  doc.text(`Fuente: ${data.filename}`, pageWidth / 2, yPosition, {
    align: "center",
  });
  yPosition += 6;

  // Divider
  doc.setDrawColor(6, 182, 212);
  doc.setLineWidth(0.5);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 6;

  // --- Content based on Type ---

  if (
    data.type === "growth" ||
    data.type === "trend" ||
    data.type === "comparison"
  ) {
    if (contentRef) {
      doc.setFontSize(12);
      doc.setTextColor(31, 41, 55);
      doc.text("Detalle por Indicador:", margin, yPosition);
      yPosition += 6;

      const children = Array.from(contentRef.children) as HTMLElement[];

      for (const child of children) {
        try {
          const dataUrl = await toPng(child, {
            backgroundColor: "#ffffff",
            quality: 0.95,
          });
          const imgProps = doc.getImageProperties(dataUrl);

          const pdfImgWidth = pageWidth - margin * 2;
          const pdfImgHeight = (imgProps.height * pdfImgWidth) / imgProps.width;

          if (yPosition + pdfImgHeight > pageHeight - margin) {
            doc.addPage();
            yPosition = margin;
          }

          doc.addImage(
            dataUrl,
            "PNG",
            margin,
            yPosition,
            pdfImgWidth,
            pdfImgHeight,
          );
          yPosition += pdfImgHeight + 5;
        } catch (err) {
          console.error("Error capturing element for PDF", err);
        }
      }
    }
  } else {
    // --- Correlation Logic ---

    // Summary Section
    doc.setFontSize(14);
    doc.setTextColor(31, 41, 55);
    doc.text("Resumen del Análisis", margin, yPosition);
    yPosition += 7;

    doc.setFontSize(11);
    doc.setTextColor(55, 65, 81);
    doc.text(
      `• Variables analizadas: ${data.numericColumns.length}`,
      margin + 5,
      yPosition,
    );
    yPosition += 5;
    doc.text(
      `• Registros procesados: ${data.rawDataCount}`,
      margin + 5,
      yPosition,
    );
    yPosition += 5;
    doc.text(
      `• Pares correlacionados: ${data.correlationResults.length}`,
      margin + 5,
      yPosition,
    );
    yPosition += 10;

    // Heatmap Image (full width in landscape)
    if (contentRef) {
      if (yPosition + 60 > pageHeight - margin) {
        doc.addPage();
        yPosition = margin;
      }

      doc.setFontSize(14);
      doc.setTextColor(31, 41, 55);
      doc.text("Visualización (Mapa de Calor)", margin, yPosition);
      yPosition += 6;

      try {
        const dataUrl = await toPng(contentRef, {
          backgroundColor: "#ffffff",
          quality: 0.95,
        });

        const imgProps = doc.getImageProperties(dataUrl);
        // Use full available width
        const maxWidth = pageWidth - margin * 2;
        const maxHeight = pageHeight - yPosition - margin - 10;

        let pdfImgWidth = maxWidth;
        let pdfImgHeight = (imgProps.height * pdfImgWidth) / imgProps.width;

        // Scale down if too tall
        if (pdfImgHeight > maxHeight) {
          const scale = maxHeight / pdfImgHeight;
          pdfImgHeight = maxHeight;
          pdfImgWidth = pdfImgWidth * scale;
        }

        doc.addImage(
          dataUrl,
          "PNG",
          (pageWidth - pdfImgWidth) / 2,
          yPosition,
          pdfImgWidth,
          pdfImgHeight,
        );
        yPosition += pdfImgHeight + 8;
      } catch (err) {
        console.error("Error capturing heatmap for PDF", err);
      }
    }

    // Correlation Table
    const sorted = [...data.correlationResults]
      .sort((a, b) => {
        const absA = Math.abs(a.pearson || 0);
        const absB = Math.abs(b.pearson || 0);
        return absB - absA;
      })
      .slice(0, 15);

    if (yPosition + 50 > pageHeight - margin) {
      doc.addPage();
      yPosition = margin;
    }

    doc.setFontSize(14);
    doc.setTextColor(31, 41, 55);
    doc.text("Top Correlaciones (Pearson)", margin, yPosition);
    yPosition += 8;

    // Table header
    const headers = [
      "Variable 1",
      "Variable 2",
      "Pearson",
      "Spearman",
      "Kendall",
    ];
    const colWidths = useLandscape
      ? [80, 80, 30, 30, 30]
      : [50, 50, 25, 25, 20];
    const startX = margin;

    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);

    doc.setFillColor(6, 182, 212);
    const tableWidth = colWidths.reduce((a, b) => a + b, 0);
    doc.rect(startX, yPosition - 4, tableWidth, 7, "F");

    let currentX = startX + 2;
    headers.forEach((h, i) => {
      doc.text(h, currentX, yPosition);
      currentX += colWidths[i];
    });

    yPosition += 6;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(55, 65, 81);

    sorted.forEach((row, i) => {
      if (yPosition > pageHeight - margin) {
        doc.addPage();
        yPosition = margin + 10;
      }

      if (i % 2 === 0) {
        doc.setFillColor(243, 244, 246);
        doc.rect(startX, yPosition - 4, tableWidth, 6, "F");
      }

      let cx = startX + 2;
      const truncate = (str: string, maxLen: number) => {
        return str.length > maxLen ? str.substring(0, maxLen - 3) + "..." : str;
      };

      const maxChars = useLandscape ? 40 : 25;
      doc.text(truncate(row.column_a, maxChars), cx, yPosition);
      cx += colWidths[0];

      doc.text(truncate(row.column_b, maxChars), cx, yPosition);
      cx += colWidths[1];

      const pVal = row.pearson ?? 0;
      if (Math.abs(pVal) > 0.7) doc.setTextColor(22, 163, 74);
      else if (Math.abs(pVal) < 0.3) doc.setTextColor(156, 163, 175);
      else doc.setTextColor(55, 65, 81);

      doc.text(pVal.toFixed(3), cx, yPosition);
      doc.setTextColor(55, 65, 81);
      cx += colWidths[2];

      doc.text(row.spearman?.toFixed(3) ?? "N/A", cx, yPosition);
      cx += colWidths[3];

      doc.text(row.kendall?.toFixed(3) ?? "N/A", cx, yPosition);

      yPosition += 6;
    });

    // --- EXPLANATION SECTION ---
    yPosition += 8;
    if (yPosition + 80 > pageHeight - margin) {
      doc.addPage();
      yPosition = margin;
    }

    doc.setFontSize(14);
    doc.setTextColor(31, 41, 55);
    doc.text("¿Qué significan las correlaciones?", margin, yPosition);
    yPosition += 8;

    doc.setFontSize(9);
    doc.setTextColor(55, 65, 81);

    // Pearson
    doc.setFont("helvetica", "bold");
    doc.text("Correlación de Pearson:", margin, yPosition);
    yPosition += 4;
    doc.setFont("helvetica", "normal");
    const pearsonText =
      "Mide la relación lineal entre dos variables. Valores cercanos a +1 indican correlación positiva fuerte, valores cercanos a -1 indican correlación negativa fuerte, y valores cercanos a 0 indican que no existe relación lineal.";
    const pearsonLines = doc.splitTextToSize(
      pearsonText,
      pageWidth - margin * 2,
    );
    doc.text(pearsonLines, margin, yPosition);
    yPosition += pearsonLines.length * 4 + 3;

    // Interpretación
    doc.setFont("helvetica", "italic");
    doc.text(
      "Interpretación: 0.75-1.00 = Muy fuerte | 0.50-0.74 = Moderada | 0.25-0.49 = Débil | 0.00-0.24 = Sin correlación",
      margin,
      yPosition,
    );
    yPosition += 6;
    doc.setFont("helvetica", "normal");

    // Spearman
    doc.setFont("helvetica", "bold");
    doc.text("Correlación de Spearman:", margin, yPosition);
    yPosition += 4;
    doc.setFont("helvetica", "normal");
    const spearmanText =
      "Evalúa la relación monotónica entre variables usando el orden de los datos en lugar de valores exactos. Es más robusta ante valores atípicos (outliers) y es ideal cuando los datos no siguen una distribución normal.";
    const spearmanLines = doc.splitTextToSize(
      spearmanText,
      pageWidth - margin * 2,
    );
    doc.text(spearmanLines, margin, yPosition);
    yPosition += spearmanLines.length * 4 + 3;

    // Kendall
    doc.setFont("helvetica", "bold");
    doc.text("Correlación de Kendall Tau:", margin, yPosition);
    yPosition += 4;
    doc.setFont("helvetica", "normal");
    const kendallText =
      "Mide la concordancia entre pares de observaciones. Es la más conservadora y funciona bien con muestras pequeñas o cuando hay muchos empates en los datos.";
    const kendallLines = doc.splitTextToSize(
      kendallText,
      pageWidth - margin * 2,
    );
    doc.text(kendallLines, margin, yPosition);
    yPosition += kendallLines.length * 4 + 5;

    // Tip box
    doc.setFillColor(239, 246, 255); // blue-50
    doc.rect(margin, yPosition, pageWidth - margin * 2, 12, "F");
    doc.setTextColor(30, 64, 175); // blue-800
    doc.setFont("helvetica", "bold");
    doc.text(
      "💡 Recuerda: Correlación no implica causalidad.",
      margin + 3,
      yPosition + 5,
    );
    doc.setFont("helvetica", "normal");
    doc.text(
      "Que dos variables estén correlacionadas no significa que una cause la otra.",
      margin + 3,
      yPosition + 9,
    );
  }

  // Footer on all pages
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(156, 163, 175);
    doc.text(
      `Página ${i} de ${pageCount}`,
      pageWidth - margin,
      pageHeight - 8,
      { align: "right" },
    );
    doc.text(
      "Generado por Aquatech IA | www.aquatechia.com",
      margin,
      pageHeight - 8,
    );
  }

  doc.save(
    `Reporte_${data.type === "growth" ? "Crecimiento" : "Correlaciones"}_${data.filename.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`,
  );
}
