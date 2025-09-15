"use client";
import Image from "next/image";
import { buildAffiliateUrl, trackAffiliateClick } from "@/lib/track-env";
import type { Resource } from "@/lib/types-env";

export default function CardCourse({ item }: { item: Resource }) {
  const href = buildAffiliateUrl(item, { site: "aquaportal", campaign: "recomendaciones" });
  const updated = item.last_verified_at?.slice(0, 10) || item.published_at?.slice(0, 10);

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
          <span className="rounded-full bg-emerald-600 px-2 py-1 text-[11px] font-bold text-white">
            {item.type === "certification" ? "Certificación" : item.type === "membership" ? "Membresía" : "Curso"}
          </span>
          {item.badges?.includes("best-rated") && (
            <span className="rounded-full bg-black/70 px-2 py-1 text-[11px] font-bold text-white">Mejor valorado</span>
          )}
        </div>
      </div>

      <h3 className="line-clamp-2 text-[17px] font-bold">{item.title}</h3>
      <p className="mt-1 line-clamp-3 text-sm text-[var(--muted)]">{item.description}</p>

      <div className="mt-3 flex flex-wrap gap-1">
        {(item.topics || []).slice(0, 3).map((t) => (
          <span key={t} className="rounded-full bg-black/5 px-2 py-0.5 text-[11px]">{t}</span>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-3 items-center text-sm">
        <span className="font-semibold">{item.platform}</span>
        <span className="justify-self-center">⭐ {item.rating_value?.toFixed(1)}/5{item.rating_count ? ` (${item.rating_count})` : ""}</span>
        <span className="justify-self-end font-bold">{item.price ? `${item.currency || "USD"} ${item.price}` : item.list_price ? `${item.currency||"USD"} ${item.list_price}` : "—"}</span>
      </div>

      <p className="mt-1 text-center text-[11px] text-[var(--muted)]">Actualizado: {updated?.slice(0,7) || "2025"}</p>

      <a
        href={href}
        target="_blank"
        rel="nofollow sponsored noopener"
        onClick={() => trackAffiliateClick(item)}
        className="mt-3 inline-flex items-center justify-center rounded-xl bg-black px-4 py-2 font-semibold text-white hover:bg-neutral-800"
      >
        Ver curso
      </a>
      {item.includes?.length ? (
        <p className="mt-1 text-[11px] text-center text-[var(--muted)]">Incluye: {item.includes.slice(0,3).join(", ")}</p>
      ) : null}
    </article>
  );
}
