"use client";
import React from "react";
import Page from "./app/page";
import { ReactNode } from "react";

// Context Provider para gestionar el estado de la herramienta
function CorrelacionesProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export default function AnalisisCorrelacionesWrapper() {
  return (
    <CorrelacionesProvider>
      <Page />
    </CorrelacionesProvider>
  );
}
