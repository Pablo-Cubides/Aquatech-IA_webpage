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
 * Helper to generate absolute canonical URLs safely.
 */
export function getCanonicalUrl(path: string = ""): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  if (normalizedPath === "/" || normalizedPath === "") {
    return SITE_URL;
  }
  return `${SITE_URL}${normalizedPath.replace(/\/+$/, "")}`;
}
