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
