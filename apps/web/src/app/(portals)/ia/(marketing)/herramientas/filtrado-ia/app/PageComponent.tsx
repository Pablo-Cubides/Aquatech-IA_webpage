"use client";

import MenuCasos from "../components/MenuCasos";
import VisualizadorCaso from "../components/VisualizadorCaso";
import { CasosProvider } from "../context/CasosContext";

export default function Home() {
  return (
    <CasosProvider>
      <main style={{ minHeight: "100vh", padding: 0 }}>
        {/* Logo */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            margin: "2rem 0 1rem",
          }}
        >
          <img
            src="/images/portal-ia/herramientas/filtrado-ia-logo.png"
            alt="FiltrarIA"
            style={{
              height: "auto",
              width: "440px",
              objectFit: "contain",
              paddingBottom: "1rem",
              margin: 0,
            }}
          />
        </div>
        <h1
          style={{
            textAlign: "center",
            color: "#1976d2",
            margin: "2rem 0 1rem",
          }}
        >
          Cómo la IA filtra sus respuestas
        </h1>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "2rem",
            justifyContent: "center",
            alignItems: "flex-start",
            flexWrap: "wrap",
          }}
        >
          <MenuCasos />
          <VisualizadorCaso />
        </div>
      </main>
    </CasosProvider>
  );
}
