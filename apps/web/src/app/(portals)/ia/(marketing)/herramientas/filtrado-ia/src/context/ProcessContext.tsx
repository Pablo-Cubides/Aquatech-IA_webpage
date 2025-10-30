"use client";
import React, { ReactNode } from "react";

interface ProcessContextType {
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
    <ProcessContext.Provider
      value={{
        toolName,
      }}
    >
      {children}
    </ProcessContext.Provider>
  );
};

export const useProcess = () => {
  const context = React.useContext(ProcessContext);
  if (!context) {
    throw new Error("useProcess must be used within ProcessProvider");
  }
  return context;
};
