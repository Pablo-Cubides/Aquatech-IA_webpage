'use client';
import React from 'react';

interface ExportButtonsProps {
  matrixType: 'leopold' | 'conesa' | 'battelle';
  caseId: string;
  data: any;
  matrixRef?: React.RefObject<HTMLDivElement | null>;
}

export default function ExportButtons({ matrixType, caseId, data, matrixRef }: ExportButtonsProps) {
  
  const exportToPDF = async () => {
    // Dynamic imports para reducir bundle inicial
    const jsPDFModule = await import('jspdf');
    const autoTableModule = await import('jspdf-autotable');
    const html2canvasModule = await import('html2canvas');
    
    const jsPDF = jsPDFModule.default;
    const autoTable = (autoTableModule as any).default;
    const html2canvas = html2canvasModule.default;
    
    const doc = new jsPDF('landscape', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    
    // Header
    doc.setFontSize(20);
    doc.text('Matriz de Evaluación de Impacto Ambiental', pageWidth / 2, 20, { align: 'center' });
    
    doc.setFontSize(14);
    doc.text(`Método: ${matrixType.charAt(0).toUpperCase() + matrixType.slice(1)}`, pageWidth / 2, 30, { align: 'center' });
    doc.text(`Caso: ${caseId}`, pageWidth / 2, 40, { align: 'center' });
    
    // Fecha y hora
    const now = new Date();
    doc.setFontSize(10);
    doc.text(`Generado: ${now.toLocaleDateString()} ${now.toLocaleTimeString()}`, 20, pageHeight - 10);

    if (matrixType === 'leopold' && matrixRef?.current) {
      // Capturar la matriz Leopold como imagen (mejorar robustez y usar fallback de tabla)
      try {
        const el = matrixRef.current;
        const scale = typeof window !== 'undefined' ? (window.devicePixelRatio || 2) : 2;
        const canvas = await html2canvas(el, ({
          useCORS: true,
          logging: false,
          scale
        } as any));

        const imgData = canvas.toDataURL('image/png');
        const imgWidth = pageWidth - 40;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // If image is taller than page, split it or fallback to table
        if (imgHeight < pageHeight - 80) {
          doc.addImage(imgData, 'PNG', 20, 50, imgWidth, imgHeight);
        } else {
          // Fallback: export tabla con autotable para mayor control de paginación
          doc.text('Vista previa extensa: exportando como tabla...', 20, 60);
          // intentar extraer filas simples del DOM si es posible
          const rows: any[] = [];
          try {
            const table = el.querySelector('table');
            if (table) {
              const headers = Array.from(table.querySelectorAll('thead th')).map(h => (h.textContent || '').trim());
              const bodyRows = Array.from(table.querySelectorAll('tbody tr'));
              bodyRows.forEach(r => {
                const cols = Array.from(r.querySelectorAll('td')).map(td => (td.textContent || '').trim());
                rows.push(cols);
              });
              autoTable(doc, { startY: 70, head: [headers], body: rows, styles: { fontSize: 8 } });
            } else {
              doc.text('No se pudo obtener la tabla para exportar.', 20, 70);
            }
          } catch (err) {
            console.error('Error building fallback table:', err);
            doc.text('Error al generar la tabla de fallback', 20, 70);
          }
        }
      } catch (error) {
        console.error('Error capturing matrix:', error);
        // Fallback simple: crear tabla a partir de data
        try {
          autoTable(doc, {
            startY: 50,
            head: [['Impacto', 'Magnitud', 'Importancia', 'S']],
            body: (data || []).map((d: any) => [d.impactoId || '-', d.magnitud || '-', d.importancia || '-', d.S || '-']),
            styles: { fontSize: 8 }
          });
        } catch (err) {
          doc.text('Error al generar PDF de respaldo', 20, 60);
        }
      }
    } else if (matrixType === 'conesa') {
      // Tabla para Conesa
      autoTable(doc, {
        startY: 50,
        head: [['Impacto', 'IN', 'EX', 'MO', 'PE', 'RV', 'SI', 'AC', 'EF', 'PR', 'MC', 'I', 'Categoría']],
        body: data?.map((item: any, index: number) => [
          `Impacto ${index + 1}`,
          item.IN || '-',
          item.EX || '-',
          item.MO || '-',
          item.PE || '-',
          item.RV || '-',
          item.SI || '-',
          item.AC || '-',
          item.EF || '-',
          item.PR || '-',
          item.MC || '-',
          item.I || '-',
          item.categoria || '-'
        ]) || [],
        styles: { fontSize: 8 },
        headStyles: { fillColor: [255, 193, 7] }
      });
    } else if (matrixType === 'battelle') {
      // Tabla para Battelle
      autoTable(doc, {
        startY: 50,
        head: [['Factor', 'Categoría', 'UIP', 'Cal.Sin', 'Cal.Con', 'PIA Sin', 'PIA Con', 'UIA']],
        body: data?.map((item: any, index: number) => [
          `Factor ${index + 1}`,
          item.categoria || '-',
          item.uip || '-',
          item.calidad_sin || '-',
          item.calidad_con || '-',
          item.pia_sin?.toFixed(0) || '-',
          item.pia_con?.toFixed(0) || '-',
          (item.uia >= 0 ? '+' : '') + (item.uia?.toFixed(0) || '-')
        ]) || [],
        styles: { fontSize: 8 },
        headStyles: { fillColor: [33, 150, 243] }
      });
    }

    // Footer con información adicional
    doc.setFontSize(8);
    doc.text('EIA Matrix Studio - Herramienta Educativa', pageWidth / 2, pageHeight - 5, { align: 'center' });

    doc.save(`matriz-${matrixType}-${caseId}-${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const exportToCSV = () => {
    let csvContent = '';
    let filename = '';

    if (matrixType === 'leopold' && data) {
      csvContent = 'Impacto ID,Magnitud,Importancia,Significancia\n';
      data.forEach((item: any) => {
        csvContent += `${item.impactoId},${item.magnitud},${item.importancia},${item.S}\n`;
      });
      filename = `leopold-${caseId}`;
    } else if (matrixType === 'conesa' && data) {
      csvContent = 'Impacto ID,IN,EX,MO,PE,RV,SI,AC,EF,PR,MC,I,Categoría\n';
      data.forEach((item: any) => {
        csvContent += `${item.impactoId},${item.IN},${item.EX},${item.MO},${item.PE},${item.RV},${item.SI},${item.AC},${item.EF},${item.PR},${item.MC},${item.I},${item.categoria}\n`;
      });
      filename = `conesa-${caseId}`;
    } else if (matrixType === 'battelle' && data) {
      csvContent = 'Impacto ID,Categoría,UIP,Calidad Sin,Calidad Con,PIA Sin,PIA Con,UIA\n';
      data.forEach((item: any) => {
        csvContent += `${item.impactoId},${item.categoria},${item.uip},${item.calidad_sin},${item.calidad_con},${item.pia_sin},${item.pia_con},${item.uia}\n`;
      });
      filename = `battelle-${caseId}`;
    }

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}-${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToExcel = async () => {
    // Dynamic import de XLSX para optimizar bundle
    const XLSX = await import('xlsx');
    
    // Client-side .xlsx generation using SheetJS
    try {
      const ws = XLSX.utils.json_to_sheet((data as any[]) || []);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Matriz');
      const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([wbout], { type: 'application/octet-stream' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      const filename = `matriz-${matrixType}-${caseId}-${new Date().toISOString().slice(0, 10)}.xlsx`;
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      // Fallback: request server to generate xlsx
      try {
        const resp = await fetch('/api/export/xlsx', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data })
        });
        const blob = await resp.blob();
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.download = `matriz-${matrixType}-${caseId}-${new Date().toISOString().slice(0, 10)}.xlsx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (err2) {
        console.error('Error exporting to Excel', err2);
      }
    }
  };

  return (
    <div className="flex gap-3 flex-wrap">
      <button
        onClick={exportToPDF}
        aria-label={`Exportar ${matrixType} a PDF`}
        role="button"
        className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-300"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 0v12h8V4H6z" clipRule="evenodd" />
        </svg>
        Exportar PDF
      </button>

      <button
        onClick={exportToExcel}
        aria-label={`Exportar ${matrixType} a Excel`}
        role="button"
        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-300"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 1v10h10V5H5z" clipRule="evenodd" />
        </svg>
        Exportar Excel
      </button>

      <button
        onClick={exportToCSV}
        aria-label={`Exportar ${matrixType} a CSV`}
        role="button"
        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586l1.293-1.293a1 1 0 111.414 1.414L10.414 12l1.293 1.293a1 1 0 01-1.414 1.414L9 13.414l-1.293 1.293a1 1 0 01-1.414-1.414L7.586 12 6.293 10.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
        Exportar CSV
      </button>

      <div className="text-xs text-gray-600 flex items-center">
        📊 Datos para análisis externo
      </div>
    </div>
  );
}
