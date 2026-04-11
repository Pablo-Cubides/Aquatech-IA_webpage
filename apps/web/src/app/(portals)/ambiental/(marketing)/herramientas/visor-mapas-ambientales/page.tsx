"use client";
import React from "react";
import Page from "./src/app/PageComponent";
import { ProcessProvider } from "./src/context/ProcessContext";

export default function VisorMapasWrapper() {
  return (
    <ProcessProvider toolName="visor-mapas-ambientales">
      <Page />
    </ProcessProvider>
  );
}
