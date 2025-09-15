"use client";
import Image from "next/image";
import { buildAffiliateUrl, trackAffiliateClick } from "@/lib/track-env";
import type { Resource } from "@/lib/types-env";

export default function CardEbookSoftware({ item }: { item: Resource }) {
  const href = buildAffiliateUrl(item, { site: "aquaportal", campaign: "recomendaciones" });

  return (
    <article className="flex flex-col rounded-2xl border border-[var(--border)] bg-white p-4 hover:shadow-lg transition">
      <div className="relative mb-3 aspect-[4/3] w-full overflow-hidden rounded-xl bg-black/5">
        <Image
          src={item.images?.[0]?.src || "https://via.placeholder.com/800x600"}
          alt={item.images?.[0]?.alt || item.title}
          fill
          className="object-cover"
          sizes="(max-width:768px) 100vw, (min-width:769px) 25vw"
        />
        <div className="absolute left-2 top-2 flex gap-2">
          <span className="rounded-full bg-purple-600 px-2 py-1 text-[11px] font-bold text-white">
            {item.type === "ebook" ? "Ebook" : "Software"}
          </span>
        </div>
      </div>

      <h3 className="line-clamp-2 text-[17px] font-bold">{item.title}</h3>
      <p className="mt-1 line-clamp-3 text-sm text-[var(--muted)]">{item.description}</p>

      <div className="mt-3 flex flex-wrap gap-2 text-[12px]">
        {item.format && <span className="rounded-full bg-black/5 px-2 py-0.5">{item.format}</span>}
        {item.language && <span className="rounded-full bg-black/5 px-2 py-0.5">Idioma: {item.language.toUpperCase()}</span>}
        {item.platform && <span className="rounded-full bg-black/5 px-2 py-0.5">{item.platform}</span>}
      </div>

      <div className="mt-3 flex items-center justify-between text-sm">
        <span>⭐ {item.rating_value?.toFixed(1) || "5.0"}/5</span>
        <span className="font-bold">{item.price ? `${item.currency || "USD"} ${item.price}` : "—"}</span>
      </div>

      <a
        href={href}
        target="_blank"
        rel="nofollow sponsored noopener"
        onClick={() => trackAffiliateClick(item)}
        className="mt-3 inline-flex items-center justify-center rounded-xl bg-black px-4 py-2 font-semibold text-white hover:bg-neutral-800"
      >
        {item.type === "ebook" ? "Ver ebook" : "Ver software"}
      </a>
    </article>
  );
}
