"use client";
import Image from "next/image";
import { buildAffiliateUrl, trackAffiliateClick } from "@/lib/track-env";
import type { Resource } from "@/lib/types-env";

export default function CardProduct({ item }: { item: Resource }) {
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
          <span className="rounded-full bg-sky-600 px-2 py-1 text-[11px] font-bold text-white">Producto</span>
          {item.sustainability_flags?.includes("eco") && (
            <span className="rounded-full bg-emerald-600 px-2 py-1 text-[11px] font-bold text-white">ECO</span>
          )}
        </div>
      </div>

      <h3 className="line-clamp-2 text-[17px] font-bold">{item.title}</h3>
      <p className="mt-1 line-clamp-3 text-sm text-[var(--muted)]">{item.description}</p>

      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
        {(item.reviews_excerpt || item.includes || []).slice(0, 3).map((b, i) => (
          <li key={i}>{b}</li>
        ))}
      </ul>

      <div className="mt-3 grid grid-cols-3 items-center text-sm">
        <span className="font-semibold">{item.brand ?? item.platform}</span>
        <span className="justify-self-center">⭐ {item.rating_value?.toFixed(1)}/5{item.rating_count ? ` (${item.rating_count})` : ""}</span>
        <span className="justify-self-end font-bold">
          {item.price ? `${item.currency || "USD"} ${Intl.NumberFormat("es-CO").format(item.price)}` : "Precio dinámico"}
        </span>
      </div>

      <a
        href={href}
        target="_blank"
        rel="nofollow sponsored noopener"
        onClick={() => trackAffiliateClick(item)}
        className="mt-3 inline-flex items-center justify-center rounded-xl bg-black px-4 py-2 font-semibold text-white hover:bg-neutral-800"
      >
        Ver producto
      </a>

      <p className="mt-1 text-center text-[11px] text-[var(--muted)]">Política de precios según tienda/afiliado.</p>
    </article>
  );
}
