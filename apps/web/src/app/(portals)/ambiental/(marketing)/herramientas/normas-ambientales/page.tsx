"use client"
import React from "react"
import Page from "./src/app/PageComponent"
import { ProcessProvider } from "@ia-next/ui"

export default function NormasAmbientalesWrapper() {
  return (
    <ProcessProvider toolName="normas-ambientales">
      <Page />
    </ProcessProvider>
  )
}
