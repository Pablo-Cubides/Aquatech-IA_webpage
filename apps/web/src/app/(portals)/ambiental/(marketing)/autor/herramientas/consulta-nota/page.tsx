import type { Metadata } from "next";

export { default } from "@/app/(portals)/ia/(marketing)/autor/herramientas/consulta-nota/page";

// Pagina privada o de gestion: fuera del indice.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};
