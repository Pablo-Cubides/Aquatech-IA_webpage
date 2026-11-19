/**
 * Site Configuration & SEO Constants
 * Single Source of Truth for base URLs and canonical domain definitions.
 */

export const SITE_URL = (
  process.env.NEXT_PUBLIC_BASE_URL || "https://aquatechia.com"
)
  .trim()
  .replace(/\/+$/, "");

export const SITE_NAME = "AquatechIA";
export const DEFAULT_LOCALE = "es_CO";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/images/og-image.jpg`;
export const DEFAULT_LOGO = `${SITE_URL}/images/logo-aquatech.png`;

/**
 * Perfiles oficiales de AquatechIA. Fuente de verdad: los enlaces del pie de pagina (FooterIA / FooterAmbiental).
 * No agregar aqui perfiles que no existan: un dato inventado en JSON-LD es peor que su ausencia (no hay LinkedIn de empresa).
 */
export const SOCIAL_PROFILES = [
  "https://x.com/Aquatech_ia",
  "https://www.facebook.com/Aquatechia/",
  "https://www.instagram.com/aquatech_ia/",
  "https://www.youtube.com/@AquatechIA",
] as const;

/** Handle real de la cuenta de X (x.com/Aquatech_ia) para twitter:creator. */
export const TWITTER_HANDLE = "@Aquatech_ia";

/**
 * Helper to generate absolute canonical URLs safely.
 */
export function getCanonicalUrl(path: string = ""): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  if (normalizedPath === "/" || normalizedPath === "") {
    return SITE_URL;
  }
  return `${SITE_URL}${normalizedPath.replace(/\/+$/, "")}`;
}
