import React from "react";

/**
 * Layout wrapper para la herramienta como-funcionan-llm
 * Esta carpeta contiene la estructura de la herramienta integrada al portal
 *
 * La estructura es:
 * - Root: /ia/herramientas/como-funcionan-llm
 * - App internals: ./app/* (con su propio layout en ./app/layout.tsx)
 */

export default function ComoFuncionanLLMLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Solo pasar los children - el layout real está en ./app/layout.tsx
  return <>{children}</>;
}
