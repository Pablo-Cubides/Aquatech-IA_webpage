import type { Resource } from "./types-env";

type Ctx = { site: string; campaign: string };

export function buildAffiliateUrl(r: Resource, ctx: Ctx) {
  const url = new URL(r.affiliate_url);
  url.searchParams.set("utm_source", r.platform.toLowerCase());
  url.searchParams.set("utm_medium", "affiliate");
  url.searchParams.set("utm_campaign", `${ctx.site}-${ctx.campaign}`);
  url.searchParams.set("utm_content", r.slug);
  // Amazon tag (ajusta tu tag)
  if (r.platform.toLowerCase().includes("amazon") && !url.searchParams.has("tag")) {
    url.searchParams.set("tag", "aquaportal-20");
  }
  return url.toString();
}

declare global {
  interface Window { gtag?: (...args:any[])=>void }
}

export function trackViewList(items: Resource[]) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", "view_item_list", {
    item_list_id: "recomendaciones_grid",
    item_list_name: "Recomendaciones portal ambiental",
    items: items.slice(0, 12).map((r, i) => ({
      item_id: r.id,
      item_name: r.title,
      item_category: r.type,
      platform: r.platform,
      price: r.price ?? null,
      rating: r.rating_value ?? null,
      index: i,
    })),
  });
}
export function trackAffiliateClick(r: Resource) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", "click_affiliate", {
    item_id: r.id,
    item_name: r.title,
    item_category: r.type,
    platform: r.platform,
  });
}
