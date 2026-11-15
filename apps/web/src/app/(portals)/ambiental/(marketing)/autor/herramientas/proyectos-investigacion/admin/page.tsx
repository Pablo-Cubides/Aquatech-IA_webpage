import type { Metadata } from "next";

export { default } from "@/app/(portals)/ia/(marketing)/autor/herramientas/proyectos-investigacion/admin/page";

// Pagina privada o de gestion: fuera del indice.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};
