"use client";

import React, { useState } from "react";

export default function Page() {
  const [spinning, setSpinning] = useState(false);

  const handleSpin = () => {
    setSpinning(true);
    setTimeout(() => setSpinning(false), 2000);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
      }}
    >
      <h1 style={{ fontSize: "3em", marginBottom: "20px" }}>
        🎡 Ruleta Académica
      </h1>
      <p
        style={{
          fontSize: "1.2em",
          marginBottom: "30px",
          maxWidth: "500px",
          textAlign: "center",
        }}
      >
        Herramienta educativa interactiva para dinamizar el aprendizaje
      </p>

      <button
        onClick={handleSpin}
        disabled={spinning}
        style={{
          padding: "15px 40px",
          fontSize: "1.1em",
          backgroundColor: spinning ? "#ccc" : "#FF6B6B",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: spinning ? "not-allowed" : "pointer",
          opacity: spinning ? 0.6 : 1,
          transform: spinning ? "scale(1)" : "scale(1)",
          transition: "all 0.2s ease",
        }}
      >
        {spinning ? "⏳ Girando..." : "🎰 Girar Ruleta"}
      </button>

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
          ✨ Selecciona preguntas, tópicos o actividades de forma aleatoria
        </p>
      </div>
    </div>
  );
}
