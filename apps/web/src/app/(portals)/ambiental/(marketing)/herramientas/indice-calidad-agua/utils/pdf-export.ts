// Utilidades para exportar el reporte de calidad de agua a PDF
// Usando html2canvas y jspdf para generar el PDF

import type { WaterSample, IndexResult } from "../types";

/**
 * Genera y descarga un PDF con el reporte de calidad de agua
 */
export async function exportToPDF(
  sample: WaterSample,
  indices: {
    IRCA?: IndexResult;
    WQI?: IndexResult;
    DWQI?: IndexResult;
  }
): Promise<void> {
  // Crear el contenido HTML del reporte
  const reportHTML = generateReportHTML(sample, indices);
  
  // Crear un contenedor temporal
  const container = document.createElement("div");
  container.innerHTML = reportHTML;
  container.style.position = "absolute";
  container.style.left = "-9999px";
  container.style.top = "0";
  container.style.width = "210mm"; // A4 width
  document.body.appendChild(container);

  try {
    // Importar dinámicamente las librerías
    const html2canvas = (await import("html2canvas")).default;
    const { jsPDF } = await import("jspdf");

    // Capturar el contenido como imagen
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
    });

    // Crear el PDF
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const imgData = canvas.toDataURL("image/png");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

    // Descargar
    const fileName = `Reporte-Calidad-Agua-${sample.location.replace(/\s+/g, "-")}-${new Date().toISOString().split("T")[0]}.pdf`;
    pdf.save(fileName);
  } finally {
    // Limpiar el contenedor temporal
    document.body.removeChild(container);
  }
}

/**
 * Genera el HTML del reporte para convertir a PDF
 */
function generateReportHTML(
  sample: WaterSample,
  indices: {
    IRCA?: IndexResult;
    WQI?: IndexResult;
    DWQI?: IndexResult;
  }
): string {
  const dateStr = sample.sampleDate || 
    (sample.date ? sample.date.toLocaleDateString() : new Date().toLocaleDateString());

  return `
    <div style="font-family: Arial, sans-serif; padding: 40px; background: white; color: #333;">
      <!-- Header con Logo -->
      <div style="text-align: center; margin-bottom: 30px; border-bottom: 3px solid #10b981; padding-bottom: 20px;">
        <img 
          src="/images/portal-ambiental/logo-ia-sin-fondo.png" 
          alt="AquatechIA" 
          style="height: 80px; margin-bottom: 15px;"
          onerror="this.style.display='none'"
        />
        <h1 style="margin: 10px 0 5px 0; color: #1f2937; font-size: 24px;">
          Reporte de Calidad de Agua
        </h1>
        <p style="color: #6b7280; margin: 0; font-size: 12px;">
          Generado el ${new Date().toLocaleString()}
        </p>
      </div>

      <!-- Información de la Muestra -->
      <div style="margin-bottom: 25px; background: #f3f4f6; padding: 15px; border-radius: 8px;">
        <h2 style="margin: 0 0 15px 0; color: #1f2937; font-size: 16px; border-bottom: 1px solid #d1d5db; padding-bottom: 8px;">
          📋 Información de la Muestra
        </h2>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          <div>
            <strong style="color: #6b7280; font-size: 11px;">Ubicación:</strong>
            <p style="margin: 2px 0 0 0; font-size: 14px;">${sample.location}</p>
          </div>
          <div>
            <strong style="color: #6b7280; font-size: 11px;">Fecha de Muestreo:</strong>
            <p style="margin: 2px 0 0 0; font-size: 14px;">${dateStr}</p>
          </div>
          <div>
            <strong style="color: #6b7280; font-size: 11px;">País:</strong>
            <p style="margin: 2px 0 0 0; font-size: 14px;">${sample.country}</p>
          </div>
          <div>
            <strong style="color: #6b7280; font-size: 11px;">Parámetros Analizados:</strong>
            <p style="margin: 2px 0 0 0; font-size: 14px;">${sample.parameters.length}</p>
          </div>
        </div>
      </div>

      <!-- Parámetros Medidos -->
      <div style="margin-bottom: 25px;">
        <h2 style="margin: 0 0 15px 0; color: #1f2937; font-size: 16px; border-bottom: 1px solid #d1d5db; padding-bottom: 8px;">
          📊 Parámetros Analizados
        </h2>
        <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
          <thead>
            <tr style="background: #e5e7eb;">
              <th style="padding: 8px; text-align: left; border: 1px solid #d1d5db;">Parámetro</th>
              <th style="padding: 8px; text-align: center; border: 1px solid #d1d5db;">Valor</th>
              <th style="padding: 8px; text-align: center; border: 1px solid #d1d5db;">Unidad</th>
            </tr>
          </thead>
          <tbody>
            ${sample.parameters
              .map(
                (param, index) => `
              <tr style="background: ${index % 2 === 0 ? "#f9fafb" : "white"};">
                <td style="padding: 6px 8px; border: 1px solid #d1d5db;">${param.name}</td>
                <td style="padding: 6px 8px; text-align: center; border: 1px solid #d1d5db;">${param.value}</td>
                <td style="padding: 6px 8px; text-align: center; border: 1px solid #d1d5db;">${param.unit}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      </div>

      <!-- Índices Calculados -->
      <div style="margin-bottom: 25px;">
        <h2 style="margin: 0 0 15px 0; color: #1f2937; font-size: 16px; border-bottom: 1px solid #d1d5db; padding-bottom: 8px;">
          📈 Índices de Calidad Calculados
        </h2>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px;">
          ${indices.IRCA ? generateIndexCard("IRCA", "Resolución 2115 Colombia", indices.IRCA) : ""}
          ${indices.WQI ? generateIndexCard("WQI", "NSF Water Quality Index", indices.WQI) : ""}
          ${indices.DWQI ? generateIndexCard("DWQI", "Drinking Water Quality Index", indices.DWQI) : ""}
        </div>
      </div>

      ${generateIndexDetails(indices)}

      <!-- Footer -->
      <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #d1d5db; text-align: center; color: #9ca3af; font-size: 10px;">
        <p style="margin: 0;">
          Reporte generado automáticamente por AquatechIA | www.aquatechia.com
        </p>
        <p style="margin: 5px 0 0 0;">
          Este documento es informativo. Para fines legales, consulte con un laboratorio acreditado.
        </p>
      </div>
    </div>
  `;
}

/**
 * Genera una tarjeta de índice para el PDF
 */
function generateIndexCard(name: string, subtitle: string, result: IndexResult): string {
  const getColor = (category: string): string => {
    const lowerCategory = category.toLowerCase();
    if (lowerCategory.includes("sin riesgo") || lowerCategory.includes("excelente")) return "#22c55e";
    if (lowerCategory.includes("bajo") || lowerCategory.includes("buena")) return "#84cc16";
    if (lowerCategory.includes("medio") || lowerCategory.includes("media") || lowerCategory.includes("pobre")) return "#eab308";
    if (lowerCategory.includes("alto") || lowerCategory.includes("mala")) return "#f97316";
    return "#ef4444";
  };

  const color = getColor(result.category);

  return `
    <div style="background: white; border: 2px solid ${color}; border-radius: 8px; padding: 15px; text-align: center;">
      <h3 style="margin: 0 0 3px 0; font-size: 18px; color: #1f2937;">${name}</h3>
      <p style="margin: 0 0 10px 0; font-size: 10px; color: #6b7280;">${subtitle}</p>
      <div style="font-size: 32px; font-weight: bold; color: ${color}; margin: 10px 0;">
        ${result.value.toFixed(2)}
      </div>
      <div style="display: inline-block; background: ${color}20; color: ${color}; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: 600;">
        ${result.category}
      </div>
      <p style="margin: 10px 0 0 0; font-size: 11px; color: #6b7280;">
        ${result.riskLevel}
      </p>
    </div>
  `;
}

/**
 * Genera los detalles de cumplimiento de cada índice
 */
function generateIndexDetails(indices: {
  IRCA?: IndexResult;
  WQI?: IndexResult;
  DWQI?: IndexResult;
}): string {
  const details: string[] = [];

  if (indices.IRCA && indices.IRCA.details.length > 0) {
    const nonCompliant = indices.IRCA.details.filter(d => !d.complies);
    if (nonCompliant.length > 0) {
      details.push(`
        <div style="margin-bottom: 15px; background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 12px;">
          <h4 style="margin: 0 0 8px 0; color: #991b1b; font-size: 13px;">
            ⚠️ Parámetros IRCA que NO cumplen (${nonCompliant.length}):
          </h4>
          <ul style="margin: 0; padding-left: 20px; font-size: 12px; color: #7f1d1d;">
            ${nonCompliant.map(d => `<li>${d.parameter}: ${d.measuredValue} ${d.unit} (Límite: ${d.standardDisplay || d.standard})</li>`).join("")}
          </ul>
        </div>
      `);
    }
  }

  if (details.length === 0) {
    details.push(`
      <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 12px; text-align: center;">
        <p style="margin: 0; color: #166534; font-size: 13px;">
          ✅ Todos los parámetros analizados cumplen con las normas aplicables
        </p>
      </div>
    `);
  }

  return details.join("");
}

/**
 * Versión simplificada que usa window.print() si las librerías no están disponibles
 */
export function printReport(
  sample: WaterSample,
  indices: {
    IRCA?: IndexResult;
    WQI?: IndexResult;
    DWQI?: IndexResult;
  }
): void {
  const reportHTML = generateReportHTML(sample, indices);
  
  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Reporte de Calidad de Agua - ${sample.location}</title>
          <style>
            @media print {
              body { margin: 0; padding: 20px; }
            }
          </style>
        </head>
        <body>
          ${reportHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  }
}
