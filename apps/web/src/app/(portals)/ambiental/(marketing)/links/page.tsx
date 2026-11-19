import type { Metadata } from "next";

export { default } from "@/app/links/page";

// Misma pagina que /links: la canonica apunta a /links para no competir consigo misma ni duplicar contenido en el indice.
export const metadata: Metadata = {
  alternates: { canonical: "/links" },
};
