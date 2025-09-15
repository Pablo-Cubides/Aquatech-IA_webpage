export type ResourceType = "course" | "product" | "ebook" | "software" | "certification" | "membership";

export interface Resource {
  id: string;
  slug: string;
  type: ResourceType;
  title: string;
  subtitle?: string;
  description: string;
  language: "es" | "en";
  region?: "LatAm" | "Global";
  topics: string[];
  level?: "intro" | "intermedio" | "avanzado";
  format?: string;
  platform: string;
  affiliate_network?: string; // Hotmart/Impact/Rakuten/Amazon/…
  affiliate_url: string;
  price?: number;
  currency?: string;
  list_price?: number;
  discount_pct?: number;
  rating_value?: number;
  rating_count?: number;
  reviews_excerpt?: string[];
  duration_hours?: number;
  instructors?: string[];
  includes?: string[]; // certificado, comunidad, soporte
  brand?: string;
  specs?: Record<string, string | number | boolean>;
  sustainability_flags?: string[]; // eco, eficiencia-energética, reciclable…
  images: { src: string; alt: string; width?: number; height?: number }[];
  video_url?: string;
  badges?: string[]; // new, best-rated, editor-pick
  published_at?: string;
  last_verified_at?: string;
  compliance?: { affiliate_disclaimer_shown?: boolean; price_policy_ok?: boolean };
  inventory_status?: "in-stock" | "out-of-stock";
  tracking?: { utm_source?: string; utm_medium?: string; utm_campaign?: string; utm_content?: string };
}
