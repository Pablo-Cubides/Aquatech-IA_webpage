import type { Metadata } from "next";

export { default } from "@/app/(portals)/ia/(marketing)/autor/herramientas/ruleta-academica/juego/page";

// Espejo de la pagina del Portal IA (las herramientas del autor se consolidan en /ia): la canonica apunta a ella.
export const metadata: Metadata = {
  alternates: { canonical: "/ia/autor/herramientas/ruleta-academica/juego" },
};
