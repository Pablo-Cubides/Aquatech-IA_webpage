import type { Metadata } from "next";
import type { ReactNode } from "react";

// Panel de gestion: fuera del indice.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function ProyectosAdminLayout({ children }: { children: ReactNode }) {
  return children;
}
