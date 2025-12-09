"use client";

import type { GeoJSONFeature } from "../types";

interface ExportButtonsProps {
  data: GeoJSONFeature[];
  datasetName?: string;
  selectedDate?: string;
}

export default function ExportButtons({
  data,
  datasetName = "dataset",
  selectedDate,
}: ExportButtonsProps) {
  const exportToCSV = () => {
    if (data.length === 0) {
      alert("No hay datos para exportar");
      return;
    }

    // Extract all unique property keys
    const allKeys = new Set<string>();
    data.forEach((feature) => {
      Object.keys(feature.properties).forEach((key) => allKeys.add(key));
    });

    // Add coordinate columns
    const headers = ["latitud", "longitud", ...Array.from(allKeys)];

    // Build CSV
    const rows = data.map((feature) => {
      const coords = feature.geometry.coordinates;
      const lat = Array.isArray(coords[0]) ? coords[0][1] : coords[1];
      const lon = Array.isArray(coords[0]) ? coords[0][0] : coords[0];

      const row: (string | number)[] = [
        typeof lat === 'number' ? lat : 0,
        typeof lon === 'number' ? lon : 0
      ];
      allKeys.forEach((key) => {
        const value = feature.properties[key];
        row.push(value !== undefined && value !== null ? String(value) : "");
      });
      return row;
    });

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row
          .map((cell) => {
            const cellStr = String(cell);
            return cellStr.includes(",") ? `"${cellStr}"` : cellStr;
          })
          .join(",")
      ),
    ].join("\n");

    downloadFile(
      csvContent,
      `${datasetName}${selectedDate ? `_${selectedDate}` : ""}.csv`,
      "text/csv"
    );
  };

  const exportToGeoJSON = () => {
    if (data.length === 0) {
      alert("No hay datos para exportar");
      return;
    }

    const geojson = {
      type: "FeatureCollection",
      features: data.map((f) => ({
        type: "Feature",
        geometry: f.geometry,
        properties: f.properties,
      })),
    };

    downloadFile(
      JSON.stringify(geojson, null, 2),
      `${datasetName}${selectedDate ? `_${selectedDate}` : ""}.geojson`,
      "application/geo+json"
    );
  };

  const exportToJSON = () => {
    if (data.length === 0) {
      alert("No hay datos para exportar");
      return;
    }

    const jsonData = data.map((feature) => {
      const coords = feature.geometry.coordinates;
      const lat = Array.isArray(coords[0]) ? coords[0][1] : coords[1];
      const lon = Array.isArray(coords[0]) ? coords[0][0] : coords[0];

      return {
        latitud: lat,
        longitud: lon,
        ...feature.properties,
      };
    });

    downloadFile(
      JSON.stringify(jsonData, null, 2),
      `${datasetName}${selectedDate ? `_${selectedDate}` : ""}.json`,
      "application/json"
    );
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (data.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-600 font-medium">
        {data.length} punto{data.length !== 1 ? "s" : ""}
      </span>
      <div className="h-4 w-px bg-gray-300" />
      <button
        onClick={exportToCSV}
        className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
        title="Exportar como CSV"
      >
        <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        CSV
      </button>
      <button
        onClick={exportToGeoJSON}
        className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
        title="Exportar como GeoJSON"
      >
        <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
          />
        </svg>
        GeoJSON
      </button>
      <button
        onClick={exportToJSON}
        className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
        title="Exportar como JSON"
      >
        <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
          />
        </svg>
        JSON
      </button>
    </div>
  );
}
