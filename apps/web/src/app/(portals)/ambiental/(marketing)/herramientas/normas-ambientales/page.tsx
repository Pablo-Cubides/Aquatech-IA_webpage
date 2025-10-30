"use client"
import React from "react"
import Page from "./src/app/page"
import { ProcessProvider } from "./src/context/ProcessContext"

export default function NormasAmbientalesWrapper() {
  return (
    <ProcessProvider toolName="normas-ambientales">
      <Page />
    </ProcessProvider>
  )
}
