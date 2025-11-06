"use client";

import React from "react";
import { ProcessProvider } from "../context/ProcessContext";

export function ProviderWrapper({
  children,
  user,
}: {
  children: React.ReactNode;
  user?: any;
}) {
  return <ProcessProvider user={user}>{children}</ProcessProvider>;
}
