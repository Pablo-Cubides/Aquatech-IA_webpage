"use client"
import React from "react"
import Page from "./src/app/page"
import { ProcessProvider } from "./src/context/ProcessContext"

export default function FiltradorIAWrapper() {
  return (
    <ProcessProvider toolName="filtrado-ia">
      <Page />
    </ProcessProvider>
  )
}
