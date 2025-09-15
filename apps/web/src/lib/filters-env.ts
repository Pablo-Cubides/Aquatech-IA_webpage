import type { Resource } from "./types-env";

export type SortBy = "relevance" | "rating" | "price_asc" | "price_desc" | "newest" | "bestsellers";

export type FiltersState = {
  q: string;
  type: "all" | "course" | "product" | "ebook" | "software" | "certification" | "membership";
  topics: string[];
  level: ("intro" | "intermedio" | "avanzado")[];
  format: string[];
  language: ("es" | "en")[];
  region: ("LatAm" | "Global")[];
  platform: string[];
  price: "all" | "free" | "<25" | "25-100" | "100-300" | "300+";
  sortBy: SortBy;
};

export function filterItems(items: Resource[], f: FiltersState) {
  return items.filter((it) => {
    if (f.type !== "all" && it.type !== f.type) return false;

    // búsqueda
    const q = f.q.trim().toLowerCase();
    if (q) {
      const bag = `${it.title} ${it.description} ${it.platform} ${(it.topics || []).join(" ")}`.toLowerCase();
      if (!bag.includes(q)) return false;
    }

    // temas
    if (f.topics.length && !it.topics?.some((t) => f.topics.includes(t))) return false;

    // nivel (solo cursos/cert)
    if (f.level.length && ["course", "certification"].includes(it.type)) {
      if (!it.level || !f.level.includes(it.level)) return false;
    }

    // formato
    if (f.format.length) {
      if (!it.format || !f.format.includes(it.format)) return false;
    }

    // idioma
    if (f.language.length && !f.language.includes(it.language)) return false;

    // región
    if (f.region.length && it.region && !f.region.includes(it.region)) return false;

    // plataforma/marca
    if (f.platform.length && !f.platform.includes(it.platform)) return false;

    // precio (cursos/ebooks/software)
    if (f.price !== "all" && ["course", "ebook", "software", "certification", "membership"].includes(it.type)) {
      const p = it.price ?? 0;
      if (f.price === "free" && p !== 0) return false;
      if (f.price === "<25" && !(p > 0 && p < 25)) return false;
      if (f.price === "25-100" && !(p >= 25 && p <= 100)) return false;
      if (f.price === "100-300" && !(p > 100 && p <= 300)) return false;
      if (f.price === "300+" && !(p > 300)) return false;
    }

    return true;
  });
}

export function sortItems(items: Resource[], sort: SortBy) {
  const arr = [...items];
  const byDate = (x?: string) => (x ? new Date(x).getTime() : 0);
  switch (sort) {
    case "rating":
      arr.sort((a, b) => (b.rating_value || 0) - (a.rating_value || 0));
      break;
    case "newest":
      arr.sort((a, b) => byDate(b.last_verified_at || b.published_at) - byDate(a.last_verified_at || a.published_at));
      break;
    case "bestsellers":
      arr.sort((a, b) => (b.rating_count || 0) - (a.rating_count || 0));
      break;
    case "price_asc":
      arr.sort((a, b) => (a.price ?? Number.POSITIVE_INFINITY) - (b.price ?? Number.POSITIVE_INFINITY));
      break;
    case "price_desc":
      arr.sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
      break;
    default:
      // relevancia simple: rating + frescura
      arr.sort((a, b) => {
        const r = (b.rating_value || 0) - (a.rating_value || 0);
        if (r !== 0) return r;
        return byDate(b.last_verified_at || b.published_at) - byDate(a.last_verified_at || a.published_at);
      });
  }
  return arr;
}
