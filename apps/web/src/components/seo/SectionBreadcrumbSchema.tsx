"use client";

import { usePathname } from "next/navigation";
import { BreadcrumbStructuredData } from "@/components/seo/StructuredData";
import { SITE_URL } from "@/lib/site-config";

const SITE = SITE_URL;

// Solo las paginas de seccion que hoy no declaran su propia ruta de navegacion.
// Los articulos y las herramientas ya emiten BreadcrumbList: no se repiten aqui.
const LABELS: Record<string, string> = {
  "/ia": "Portal IA",
  "/ia/nosotros": "Nosotros",
  "/ia/blog": "Blog",
  "/ia/herramientas": "Herramientas",
  "/ia/autor": "Autor",
  "/ia/terms": "Términos y condiciones",
  "/ia/privacy": "Política de privacidad",
  "/ia/coach-salud": "Coach Salud",
  "/ia/coach-salud/privacidad": "Privacidad",
  "/ia/coach-salud/terminos": "Términos",
  "/ambiental": "Portal Ambiental",
  "/ambiental/nosotros": "Nosotros",
  "/ambiental/blog": "Blog",
  "/ambiental/herramientas": "Herramientas",
  "/ambiental/productos": "Productos",
  "/ambiental/autor": "Autor",
  "/ambiental/terms": "Términos y condiciones",
  "/ambiental/privacy": "Política de privacidad",
  "/faq": "Preguntas frecuentes",
  "/soporte": "Soporte",
  "/links": "Enlaces",
  "/guia": "Guía",
};

export function SectionBreadcrumbSchema() {
  const pathname = (usePathname() || "").replace(/\/$/, "");
  if (!LABELS[pathname]) return null;
  const parts = pathname.split("/").filter(Boolean);
  const items = [{ name: "Inicio", url: SITE }];
  let current = "";
  for (const part of parts) {
    current += `/${part}`;
    items.push({ name: LABELS[current] ?? part, url: `${SITE}${current}` });
  }
  return <BreadcrumbStructuredData items={items} />;
}
