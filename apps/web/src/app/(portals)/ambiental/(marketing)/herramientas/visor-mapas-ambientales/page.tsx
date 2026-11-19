"use client";
import React from "react";
import Page from "./src/app/PageComponent";
import { ProcessProvider } from "@ia-next/ui";

export default function VisorMapasWrapper() {
  return (
    <ProcessProvider toolName="visor-mapas-ambientales">
      <Page />
    </ProcessProvider>
  );
}
