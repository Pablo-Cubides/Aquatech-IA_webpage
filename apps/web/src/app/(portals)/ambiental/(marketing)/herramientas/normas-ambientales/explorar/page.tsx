"use client";

// Proxy page to surface the nested explorador page (the component lives under src/app/...)
// This keeps the route available at /ambiental/herramientas/normas-ambientales/explorar
import ExplorarPage from "../src/app/explorar/page";

export default function ProxyExplorar() {
  return <ExplorarPage />;
}
