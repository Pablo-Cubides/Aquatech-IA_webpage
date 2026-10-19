import { getAllArticles } from "@/lib/blog-articles";

const oneLine = (text: string | undefined, max: number) => String(text || "").replace(/\s+/g, " ").trim().slice(0, max);

/**
 * Seccion de articulos para llms.txt / llms-full.txt, generada desde los articulos publicados (codigo + base de datos),
 * de modo que el archivo nunca quede desactualizado como los textos fijos de antes (listaban 10 de 89 paginas).
 */
export async function articlesSection(baseUrl: string, full = false): Promise<string> {
  const lines: string[] = ["", "## Artículos publicados", ""];
  for (const portal of ["ia", "ambiental"] as const) {
    const articles = await getAllArticles(portal);
    lines.push(`### Portal ${portal === "ia" ? "IA" : "Ambiental"}`, "");
    for (const article of articles) {
      lines.push(`- [${oneLine(article.title, 120)}](${baseUrl}/${portal}/blog/${article.slug}): ${oneLine(article.excerpt, full ? 400 : 160)}`);
    }
    lines.push("");
  }
  return lines.join("\n");
}
