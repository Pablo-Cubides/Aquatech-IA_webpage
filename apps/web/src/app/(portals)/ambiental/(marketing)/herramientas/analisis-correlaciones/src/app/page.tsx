"use client";
import React, { useState } from "react";
import FileUploader from "../components/FileUploader";
import CorrelationTable from "../components/CorrelationTable";
import ResultsSection from "./ResultsSection";
import ErrorModal from "../components/ErrorModal";
import { sampleCorrelation } from "simple-statistics";

// Function to calculate Pearson correlation
function pearsonCorrelation(x: number[], y: number[]): number {
  return sampleCorrelation(x, y);
}

// Function to calculate Spearman correlation (basic implementation)
function spearmanCorrelation(x: number[], y: number[]): number {
  const n = x.length;
  const rankX = x
    .map((val, idx) => ({ val, idx }))
    .sort((a, b) => a.val - b.val)
    .map((item, rank) => rank + 1);
  const rankY = y
    .map((val, idx) => ({ val, idx }))
    .sort((a, b) => a.val - b.val)
    .map((item, rank) => rank + 1);
  return sampleCorrelation(rankX, rankY);
}

// Function to calculate Kendall correlation (basic implementation)
function kendallCorrelation(x: number[], y: number[]): number {
  let concordant = 0;
  let discordant = 0;
  for (let i = 0; i < x.length; i++) {
    for (let j = i + 1; j < x.length; j++) {
      const signX = Math.sign(x[j] - x[i]);
      const signY = Math.sign(y[j] - y[i]);
      if (signX === signY) concordant++;
      else if (signX !== signY) discordant++;
    }
  }
  return (concordant - discordant) / (concordant + discordant);
}

// Function to parse file
async function parseFile(file: File): Promise<any[]> {
  return new Promise(async (resolve, reject) => {
    if (file.name.endsWith(".csv")) {
      const Papa = (await import("papaparse")).default;
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          console.log("CSV parse complete:", results);
          if (results.errors.length > 0) {
            console.error("CSV parse errors:", results.errors);
          }

          const validData = (results.data as any[])
            .filter((row) => {
              return row && Object.keys(row).length > 0;
            })
            .map((row) => {
              const cleanRow: any = {};
              Object.keys(row).forEach((key) => {
                if (key && key.trim()) {
                  const cleanKey = key.trim();
                  let value = row[key];
                  // Intentar convertir strings a números
                  if (typeof value === "string" && value.trim()) {
                    const num = parseFloat(value.trim());
                    if (!isNaN(num) && isFinite(num)) {
                      value = num;
                    }
                  }
                  cleanRow[cleanKey] = value;
                }
              });
              return cleanRow;
            });

          console.log("Processed data:", validData);
          resolve(validData);
        },
        error: (error) => {
          console.error("CSV parse error:", error);
          reject(new Error("Error parsing CSV"));
        },
      });
    } else if (file.name.endsWith(".xlsx")) {
      const XLSX = await import("xlsx");
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const json = XLSX.utils.sheet_to_json(worksheet);
          resolve(json as any[]);
        } catch (error) {
          reject(new Error("Error reading Excel file"));
        }
      };
      reader.onerror = () => reject(new Error("Error reading Excel file"));
      reader.readAsArrayBuffer(file);
    } else {
      reject(new Error("Formato de archivo no soportado. Use .csv o .xlsx"));
    }
  });
}

// Function to calculate correlations
function calculateCorrelations(data: any[]): {
  correlation_results: any[];
  numeric_columns: string[];
  raw_data: any[];
} {
  const numericColumns = Object.keys(data[0] || {}).filter((key) => {
    return data.some((row) => typeof row[key] === "number" && !isNaN(row[key]));
  });

  if (numericColumns.length < 2) {
    throw new Error(
      "El archivo debe contener al menos dos columnas numéricas.",
    );
  }

  const results = [];
  for (let i = 0; i < numericColumns.length; i++) {
    for (let j = i + 1; j < numericColumns.length; j++) {
      const col1 = numericColumns[i];
      const col2 = numericColumns[j];

      const pairs = data
        .map((row) => ({ x: row[col1], y: row[col2] }))
        .filter(
          (pair) =>
            typeof pair.x === "number" &&
            typeof pair.y === "number" &&
            !isNaN(pair.x) &&
            !isNaN(pair.y),
        );

      if (pairs.length < 2) continue;

      const xVals = pairs.map((p) => p.x);
      const yVals = pairs.map((p) => p.y);

      let pearson = null;
      let spearman = null;
      let kendall = null;

      try {
        pearson = pearsonCorrelation(xVals, yVals);
      } catch {}

      try {
        spearman = spearmanCorrelation(xVals, yVals);
      } catch {}

      try {
        kendall = kendallCorrelation(xVals, yVals);
      } catch {}

      results.push({
        column_a: col1,
        column_b: col2,
        pearson: pearson !== null ? parseFloat(pearson.toFixed(4)) : null,
        spearman: spearman !== null ? parseFloat(spearman.toFixed(4)) : null,
        kendall: kendall !== null ? parseFloat(kendall.toFixed(4)) : null,
      });
    }
  }

  return {
    correlation_results: results,
    numeric_columns: numericColumns,
    raw_data: data,
  };
}

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);

  async function handleUpload(file: File) {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      console.log("Processing file:", file.name);
      const data = await parseFile(file);
      console.log("File parsed successfully, calculating correlations...");
      const resultData = calculateCorrelations(data);
      setResult({
        filename: file.name,
        ...resultData,
      });
    } catch (err: any) {
      console.error("Error processing file:", err);
      setError(err.message || "Error al procesar el archivo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#ffffff" }}>
      {/* Premium Header */}
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          background:
            "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
          paddingTop: "48px",
          paddingBottom: "48px",
        }}
      >
        {/* Decorative elements */}
        <div
          style={{
            position: "absolute",
            top: "-160px",
            right: "-160px",
            width: "320px",
            height: "320px",
            background:
              "radial-gradient(circle, rgba(6, 182, 212, 0.2) 0%, transparent 70%)",
            borderRadius: "50%",
            filter: "blur(80px)",
          }}
        ></div>
        <div
          style={{
            position: "absolute",
            bottom: "-160px",
            left: "-160px",
            width: "320px",
            height: "320px",
            background:
              "radial-gradient(circle, rgba(34, 197, 94, 0.2) 0%, transparent 70%)",
            borderRadius: "50%",
            filter: "blur(80px)",
          }}
        ></div>

        <div
          style={{
            position: "relative",
            zIndex: 10,
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 24px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: "32px",
              flexWrap: "wrap",
            }}
          >
            {/* Logo section */}
            <div style={{ flexShrink: 0 }}>
              <div
                style={{
                  position: "relative",
                  width: "96px",
                  height: "96px",
                  padding: "4px",
                  background:
                    "linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)",
                  borderRadius: "16px",
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.5)",
                }}
              >
                <img
                  src="/images/portal-ia/herramientas/ecostats-logo.png"
                  alt="ECOStats"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    backgroundColor: "white",
                    borderRadius: "12px",
                  }}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            </div>

            {/* Text section */}
            <div style={{ flex: 1 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "8px",
                  flexWrap: "wrap",
                }}
              >
                <h1
                  style={{
                    fontSize: "48px",
                    fontWeight: "bold",
                    color: "white",
                    margin: 0,
                    letterSpacing: "-1px",
                  }}
                >
                  ECOStats
                </h1>
                <span
                  style={{
                    display: "inline-block",
                    padding: "6px 12px",
                    fontSize: "12px",
                    fontWeight: "600",
                    color: "white",
                    background:
                      "linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)",
                    borderRadius: "9999px",
                  }}
                >
                  Análisis Avanzado
                </span>
              </div>
              <p
                style={{
                  fontSize: "18px",
                  color: "#cffafe",
                  margin: "16px 0",
                  lineHeight: "1.5",
                }}
              >
                Descubre relaciones entre variables ambientales mediante
                análisis de correlación
              </p>
              <p
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "14px",
                  color: "#cbd5e1",
                  margin: 0,
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    width: "8px",
                    height: "8px",
                    backgroundColor: "#22c55e",
                    borderRadius: "50%",
                  }}
                ></span>
                Métodos: Pearson, Spearman, Kendall Tau
              </p>
            </div>
          </div>
        </div>

        {/* Gradient divider */}
        <div
          style={{
            height: "4px",
            background:
              "linear-gradient(90deg, transparent, #06b6d4, transparent)",
            marginTop: "24px",
          }}
        ></div>
      </div>

      {/* Main content */}
      <div
        style={{ maxWidth: "1344px", margin: "0 auto", padding: "48px 24px" }}
      >
        {result ? (
          <>
            {/* Success state */}
            <div style={{ marginBottom: "32px" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 16px",
                  border: "1px solid #bbf7d0",
                  borderRadius: "8px",
                  background:
                    "linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)",
                }}
              >
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    backgroundColor: "#22c55e",
                    borderRadius: "50%",
                    animation: "pulse 2s infinite",
                  }}
                ></div>
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: "500",
                    color: "#15803d",
                  }}
                >
                  ✓ Análisis completado: {result.filename}
                </span>
              </div>
            </div>
            <ResultsSection result={result} />
          </>
        ) : (
          <>
            {/* Info cards */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "24px",
                marginBottom: "48px",
              }}
            >
              {[
                {
                  icon: "📊",
                  title: "Formato Flexible",
                  desc: "Soporta archivos CSV y XLSX de hasta 10 MB",
                  gradient: "linear-gradient(135deg, #cffafe 0%, #a5f3fc 100%)",
                },
                {
                  icon: "🔍",
                  title: "3 Métodos",
                  desc: "Pearson, Spearman y Kendall Tau",
                  gradient: "linear-gradient(135deg, #bfdbfe 0%, #93c5fd 100%)",
                },
                {
                  icon: "💾",
                  title: "Exporta",
                  desc: "Guarda resultados como CSV o PNG",
                  gradient: "linear-gradient(135deg, #bbf7d0 0%, #86efac 100%)",
                },
              ].map((card, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: "24px",
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 20px 25px -5px rgba(0, 0, 0, 0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 1px 3px rgba(0, 0, 0, 0.1)";
                  }}
                >
                  <div
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "8px",
                      background: card.gradient,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "24px",
                      marginBottom: "16px",
                    }}
                  >
                    {card.icon}
                  </div>
                  <h3
                    style={{
                      fontSize: "16px",
                      fontWeight: "600",
                      color: "#1e293b",
                      margin: "0 0 8px 0",
                    }}
                  >
                    {card.title}
                  </h3>
                  <p
                    style={{
                      fontSize: "14px",
                      color: "#64748b",
                      margin: 0,
                    }}
                  >
                    {card.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Upload section */}
            <div
              style={{
                padding: "32px",
                marginBottom: "32px",
                border: "1px solid #e2e8f0",
                background: "linear-gradient(135deg, #f8fafc 0%, #f0f9ff 100%)",
                borderRadius: "16px",
              }}
            >
              <h2
                style={{
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#1e293b",
                  margin: "0 0 8px 0",
                }}
              >
                Carga tu archivo
              </h2>
              <p
                style={{
                  fontSize: "16px",
                  color: "#475569",
                  margin: "0 0 24px 0",
                }}
              >
                Sube un archivo CSV o XLSX con datos numéricos para analizar
                correlaciones
              </p>
              <FileUploader onUpload={handleUpload} loading={loading} />
            </div>

            {/* Help section */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "32px",
              }}
            >
              <div
                style={{
                  padding: "24px",
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                }}
              >
                <h3
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#1e293b",
                    margin: "0 0 16px 0",
                  }}
                >
                  <span>📋</span> Requisitos del archivo
                </h3>
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  {[
                    "Mínimo 2 columnas numéricas",
                    "Valores vacíos se ignoran automáticamente",
                    "Máximo 10 MB de tamaño",
                    "Formatos: .csv o .xlsx",
                  ].map((item, idx) => (
                    <li
                      key={idx}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "8px",
                        fontSize: "14px",
                        color: "#475569",
                      }}
                    >
                      <span style={{ color: "#06b6d4", marginTop: "2px" }}>
                        ✓
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div
                style={{
                  padding: "24px",
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                }}
              >
                <h3
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#1e293b",
                    margin: "0 0 16px 0",
                  }}
                >
                  <span>🚀</span> Primeros pasos
                </h3>
                <ol
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  {[
                    "Descarga el archivo de ejemplo",
                    "Reemplaza con tus datos numéricos",
                    "Carga el archivo en la plataforma",
                    "Analiza los resultados interactivamente",
                  ].map((item, idx) => (
                    <li
                      key={idx}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "12px",
                        fontSize: "14px",
                        color: "#475569",
                      }}
                    >
                      <span
                        style={{
                          fontWeight: "600",
                          color: "#0284c7",
                          minWidth: "16px",
                        }}
                      >
                        {idx + 1}
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </>
        )}

        {/* Error modal */}
        {error && <ErrorModal message={error} onClose={() => setError(null)} />}

        {/* Loading state */}
        {loading && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 50,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              backdropFilter: "blur(4px)",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "16px",
                padding: "32px",
                backgroundColor: "white",
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                borderRadius: "16px",
              }}
            >
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)",
                  animation: "spin 1s linear infinite",
                }}
              ></div>
              <p
                style={{
                  fontWeight: "500",
                  color: "#1e293b",
                  margin: 0,
                }}
              >
                Analizando archivo…
              </p>
              <p
                style={{
                  fontSize: "12px",
                  color: "#94a3b8",
                  margin: 0,
                }}
              >
                Por favor espera mientras procesamos tus datos
              </p>
            </div>
          </div>
        )}

        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
}
