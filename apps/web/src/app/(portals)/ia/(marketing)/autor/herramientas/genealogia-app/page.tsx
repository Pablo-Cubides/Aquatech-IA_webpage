"use client";

import React, { useState } from "react";

export default function Page() {
  const [viewMode, setViewMode] = useState("tree");

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        background: "linear-gradient(135deg, #134e5e 0%, #71b280 100%)",
        color: "white",
      }}
    >
      <h1 style={{ fontSize: "3em", marginBottom: "20px" }}>
        🌳 Genealogía App
      </h1>
      <p
        style={{
          fontSize: "1.2em",
          marginBottom: "30px",
          maxWidth: "500px",
          textAlign: "center",
        }}
      >
        Visualiza y explora árboles genealógicos interactivos
      </p>

      <div style={{ display: "flex", gap: "15px", marginBottom: "30px" }}>
        <button
          onClick={() => setViewMode("tree")}
          style={{
            padding: "12px 30px",
            fontSize: "1em",
            backgroundColor:
              viewMode === "tree" ? "#FF6B6B" : "rgba(255,255,255,0.2)",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          📊 Vista Árbol
        </button>
        <button
          onClick={() => setViewMode("list")}
          style={{
            padding: "12px 30px",
            fontSize: "1em",
            backgroundColor:
              viewMode === "list" ? "#FF6B6B" : "rgba(255,255,255,0.2)",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          📋 Lista
        </button>
      </div>

      <div
        style={{
          marginTop: "40px",
          padding: "20px",
          backgroundColor: "rgba(255,255,255,0.1)",
          borderRadius: "8px",
          maxWidth: "500px",
        }}
      >
        <p style={{ margin: "0", lineHeight: "1.6" }}>
          🔗 Conecta individuos, visualiza lazos familiares y crea historias
          genealógicas
        </p>
      </div>
    </div>
  );
}
