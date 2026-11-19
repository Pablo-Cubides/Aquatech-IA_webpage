/**
 * Artículos para las superficies que se indexan (sitemap, llms.txt, llms-full.txt).
 *
 * Esas superficies se regeneran cada 1-6 h (revalidate). Si la base de datos falla y se
 * regeneran con SOLO los artículos del código, el sitio pierde ~la mitad del contenido
 * indexable durante horas sin que nadie lo vea (ARQ-004, hallazgo de VIS). Aquí la regla es
 * una sola para las tres superficies:
 *
 *  - Producción de Vercel (VERCEL_ENV=production): el fallo se PROPAGA. En `next build` rompe
 *    el despliegue (el anterior sigue sirviendo) y en una revalidación en caliente Next
 *    conserva la última versión buena en vez de sustituirla por una incompleta.
 *  - Cualquier otro entorno (local, CI, preview sin base): se degrada con error ruidoso en el
 *    log y la señal de observabilidad de OPS-001, porque sin base es lo esperado.
 *  - ALLOW_INCOMPLETE_CONTENT=1: salida de emergencia para desplegar a sabiendas con el
 *    contenido incompleto. Debe retirarse en cuanto vuelva la base.
 */
import { getAllArticles, getAllArticlesStrict, type BlogArticle } from "@/lib/blog-articles";
import { logger } from "@/lib/logger";
import { reportDegradation } from "@/lib/observability/degradation";

type Portal = "ia" | "ambiental";

/** ¿Un contenido incompleto debe impedir publicar? */
export function mustBeComplete(env: Record<string, string | undefined> = process.env): boolean {
  if (env.ALLOW_INCOMPLETE_CONTENT === "1") return false;
  return env.VERCEL_ENV === "production";
}

export async function getArticlesForIndexing(portal: Portal): Promise<BlogArticle[]> {
  try {
    return await getAllArticlesStrict(portal);
  } catch (error) {
    if (mustBeComplete()) {
      throw Object.assign(
        new Error(
          `Contenido incompleto: no se pudieron leer los artículos de PostgreSQL para ${portal}. ` +
            "Se aborta para no publicar sitemap/llms.txt sin la mitad del contenido " +
            "(ALLOW_INCOMPLETE_CONTENT=1 para forzar).",
        ),
        { cause: error },
      );
    }
    // Directo al logger: durante `next build` reportDegradation calla a propósito.
    logger.error(
      `[articles] ${portal}: contenido indexable INCOMPLETO (solo código y caché de disco)`,
      error instanceof Error ? error : undefined,
    );
    reportDegradation("indexable-articles-incomplete", error, { portal });
    return getAllArticles(portal);
  }
}

/**
 * Cuántos artículos hay publicados, o `null` si no se puede saber con certeza. Un contador que
 * se pinta en una página nunca debe ser un subconjunto: ante cualquier fallo de la base el
 * consumidor no muestra la cifra.
 */
export async function getPublishedArticleCount(portal: Portal): Promise<number | null> {
  try {
    return (await getAllArticlesStrict(portal)).length;
  } catch (error) {
    logger.error(
      `[articles] ${portal}: no se muestra el contador de artículos (base de datos no disponible)`,
      error instanceof Error ? error : undefined,
    );
    reportDegradation("indexable-articles-incomplete", error, { portal, surface: "counter" });
    return null;
  }
}
