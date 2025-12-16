// Utilidades para exportar el reporte de calidad del aire a PDF
// Usando html2canvas y jspdf

import type { AQIResult } from "../types";

/**
 * Genera y descarga un PDF con el reporte de calidad del aire
 */
export async function exportAirQualityPDF(results: AQIResult[]): Promise<void> {
  if (results.length === 0) return;

  // Crear el contenido HTML del reporte
  const reportHTML = generateReportHTML(results);
  
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

    // Si el contenido es muy largo, manejar múltiples páginas (básico: escalar si es necesario o cortar)
    // Por ahora asumimos que cabe en una hoja o ajustamos
    if (pdfHeight > pdf.internal.pageSize.getHeight()) {
        const ratio = pdf.internal.pageSize.getHeight() / pdfHeight;
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth * ratio, pdf.internal.pageSize.getHeight());
    } else {
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    }

    // Descargar
    const fileName = `Reporte-Calidad-Aire-${new Date().toISOString().split("T")[0]}.pdf`;
    pdf.save(fileName);
  } finally {
    // Limpiar el contenedor temporal
    document.body.removeChild(container);
  }
}

/**
 * Genera el HTML del reporte para convertir a PDF
 */
function generateReportHTML(results: AQIResult[]): string {
  // Tomamos el primer resultado como principal si hay varios, o listamos todos
  // Para simplificar el reporte, mostramos los resultados secuencialmente
  
  const dateStr = new Date().toLocaleString();

  return `
    <div style="font-family: Arial, sans-serif; padding: 40px; background: white; color: #333;">
      <!-- Header con Logo -->
      <div style="text-align: center; margin-bottom: 30px; border-bottom: 3px solid #0284c7; padding-bottom: 20px;">
        <img 
          src="/images/Logo Aquatech - IA 512 - sin fondo.png" 
          alt="AquatechIA" 
          style="height: 80px; margin-bottom: 15px;"
          onerror="this.style.display='none'"
        />
        <h1 style="margin: 10px 0 5px 0; color: #1f2937; font-size: 24px;">
          Reporte de Calidad del Aire
        </h1>
        <p style="color: #6b7280; margin: 0; font-size: 12px;">
          Generado el ${dateStr}
        </p>
      </div>

      ${results.map((result, index) => generateResultSection(result, index)).join('<hr style="margin: 30px 0; border: 0; border-top: 1px dashed #d1d5db;" />')}

      <!-- Footer -->
      <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #d1d5db; text-align: center; color: #9ca3af; font-size: 10px;">
        <p style="margin: 0;">
          Reporte generado automáticamente por AquatechIA | www.aquatechia.com
        </p>
        <p style="margin: 5px 0 0 0;">
          Los índices calculados son referenciales basados en metodologías estándar (${results.map(r => r.profileName).join(', ')}).
        </p>
      </div>
    </div>
  `;
}

function generateResultSection(result: AQIResult, index: number): string {
  return `
    <div style="margin-bottom: 20px;">
      <!-- Resumen del Índice -->
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px;">
        <div>
          <h2 style="margin: 0 0 5px 0; color: #1f2937; font-size: 18px;">
            ${result.profileName}
          </h2>
          <p style="margin: 0; color: #6b7280; font-size: 12px;">
            Medición #${index + 1}
          </p>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 36px; font-weight: bold; color: ${result.category.color};">
            ${result.index}
          </div>
          <div style="display: inline-block; background: ${result.category.color}20; color: ${result.category.color}; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">
            ${result.category.name}
          </div>
        </div>
      </div>

      <!-- Mensajes de Salud -->
      <div style="background: #f3f4f6; border-left: 4px solid ${result.category.color}; padding: 15px; border-radius: 4px; margin-bottom: 20px;">
        <p style="margin: 0 0 8px 0; font-weight: bold; color: #374151; font-size: 14px;">Impacto en Salud:</p>
        <p style="margin: 0 0 10px 0; color: #4b5563; font-size: 13px;">${result.category.healthMessage}</p>
        <p style="margin: 0 0 5px 0; font-weight: bold; color: #374151; font-size: 14px;">Recomendaciones:</p>
        <p style="margin: 0; color: #4b5563; font-size: 13px;">${result.category.actions}</p>
      </div>

      <!-- Tabla de Detalles -->
      <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 16px; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px;">
        Desglose por Contaminante
      </h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 12px;">
        <thead>
          <tr style="background: #f9fafb;">
            <th style="padding: 10px; text-align: left; border-bottom: 2px solid #e5e7eb; color: #6b7280;">Contaminante</th>
            <th style="padding: 10px; text-align: center; border-bottom: 2px solid #e5e7eb; color: #6b7280;">Concentración</th>
            <th style="padding: 10px; text-align: center; border-bottom: 2px solid #e5e7eb; color: #6b7280;">Subíndice</th>
            <th style="padding: 10px; text-align: center; border-bottom: 2px solid #e5e7eb; color: #6b7280;">Estado</th>
          </tr>
        </thead>
        <tbody>
          ${result.subIndices.map(sub => `
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: 500;">
                ${sub.pollutantName}
                ${sub.pollutantId === result.criticalPollutant ? '<span style="color: #ef4444; font-size: 10px; margin-left: 5px;">(Crítico)</span>' : ''}
              </td>
              <td style="padding: 10px; text-align: center; border-bottom: 1px solid #e5e7eb;">
                ${sub.concentration} ${sub.unit}
              </td>
              <td style="padding: 10px; text-align: center; border-bottom: 1px solid #e5e7eb; font-weight: bold;">
                ${sub.subIndex}
              </td>
              <td style="padding: 10px; text-align: center; border-bottom: 1px solid #e5e7eb;">
                <span style="color: ${sub.category.color}; font-weight: 500;">
                  ${sub.category.name}
                </span>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      ${result.missingPollutants.length > 0 ? `
        <div style="margin-top: 15px; font-size: 11px; color: #b45309; background: #fffbeb; padding: 10px; border-radius: 4px;">
          <strong>Nota:</strong> No se incluyeron datos para: ${result.missingPollutants.join(', ')}.
        </div>
      ` : ''}
    </div>
  `;
}
