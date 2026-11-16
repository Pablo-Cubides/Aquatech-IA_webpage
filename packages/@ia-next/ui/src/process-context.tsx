"use client"; // React context: solo funciona en el cliente

import React, { type ReactNode } from "react";

// Contexto minimo que las herramientas montan en su page.tsx para saber en que
// herramienta estan (toolName). Sustituye a las copias de ProcessContext.tsx que
// habia en cada herramienta (ARQ-003, tres strikes). El contexto con reducer de
// como-funcionan-llm es otra cosa y se queda en su herramienta.
export interface ProcessContextType {
  toolName: string;
  userId?: string;
}

const ProcessContext = React.createContext<ProcessContextType | undefined>(
  undefined,
);

export const ProcessProvider: React.FC<{
  children: ReactNode;
  toolName: string;
}> = ({ children, toolName }) => {
  return (
    <ProcessContext.Provider value={{ toolName }}>
      {children}
    </ProcessContext.Provider>
  );
};

export const useProcess = (): ProcessContextType => {
  const context = React.useContext(ProcessContext);
  if (!context) {
    throw new Error("useProcess must be used within ProcessProvider");
  }
  return context;
};
