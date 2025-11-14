"use client";

import Image from "next/image";
import { useMemo, useState, useEffect } from "react";
import Filters, {
  type FiltersState,
  defaultFilters,
} from "@/components/recomendaciones/Filters";
import CardCourse from "@/components/recomendaciones/CardCourse";
import CardProduct from "@/components/recomendaciones/CardProduct";
import CardEbookSoftware from "@/components/recomendaciones/CardEbookSoftware";
import RatingStars from "@/components/recomendaciones/RatingStars";
import EmptyState from "@/components/recomendaciones/EmptyState";
import Methodology from "@/components/recomendaciones/Methodology";
import FAQ from "@/components/recomendaciones/FAQ";
import CardSkeleton from "@/components/recomendaciones/CardSkeleton";
import { filterItems, sortItems } from "@/lib/filters-env";
import { buildAffiliateUrl, trackViewList } from "@/lib/track-env";
import type { Resource } from "@/lib/types-env";

import data from "@/data/recommendations.json";

// Static metadata moved to layout or use dynamic title setting

const PAGE_SIZE = 12;

export default function ProductosAmbientalPage() {
  const items = data as Resource[];

  const [filters, setFilters] = useState<FiltersState>(defaultFilters);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const filtered = useMemo(() => filterItems(items, filters), [items, filters]);
  const sorted = useMemo(
    () => sortItems(filtered, filters.sortBy),
    [filtered, filters.sortBy],
  );
  const visible = useMemo(
    () => sorted.slice(0, page * PAGE_SIZE),
    [sorted, page],
  );

  useEffect(() => setPage(1), [filters]);
  useEffect(() => trackViewList(visible), [visible]);

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: visible.map((r, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: buildAffiliateUrl(r, { site: "aquaportal", campaign: "productos" }),
      name: r.title,
    })),
  };

  return (
    <>
      <style jsx global>{`
        :root {
          --bg: #f5f9f8;
          --panel: #ffffff;
          --ink: #0d161c;
          --muted: #4b5563;
          --border: #e5e7eb;
          --accent: #22c55e;
          --accent-2: #0ea5e9;
        }
        body {
          background: var(--bg);
        }
      `}</style>

      {/* HERO */}
      <section className="border-b border-[var(--border)] bg-white backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 text-center">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <img
              src="/images/Portal ambiental/Aquatech-ia logo dark 512.png"
              alt="Aquatech IA"
              className="h-20 w-auto object-contain"
            />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--ink)]">
            Recursos recomendados para aprender, trabajar y equiparte en gestión
            ambiental & IA
          </h1>
          <p className="mt-4 text-lg text-[var(--muted)] max-w-3xl mx-auto">
            Solo recomendamos lo que usaríamos en nuestros proyectos académicos
            y profesionales.
          </p>

          {/* Tags rápidos */}
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {[
              "#agua",
              "#sostenibilidad",
              "#renovables",
              "#economía-circular",
              "#IA-aplicada",
              "#productividad",
              "#automatización",
            ].map((t) => (
              <span
                key={t}
                className="rounded-full bg-black/5 px-3 py-1 text-sm"
              >
                {t}
              </span>
            ))}
          </div>

          <div className="mt-6 flex gap-3 justify-center">
            <a
              href="#metodologia"
              className="rounded-lg border-2 border-[var(--accent)] px-4 py-2 font-semibold text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white transition"
            >
              Cómo seleccionamos
            </a>
            <a
              href="#disclaimer"
              className="rounded-lg border-2 border-[var(--accent-2)] px-4 py-2 font-semibold text-[var(--accent-2)] hover:bg-[var(--accent-2)] hover:text-white transition"
            >
              Política de afiliados
            </a>
          </div>
        </div>
      </section>

      {/* FILTROS STICKY */}
      <section className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--panel)]/90 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
          <Filters value={filters} onChange={setFilters} />
        </div>
      </section>

      {/* COLECCIONES DESTACADAS */}
      <section className="py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-[var(--ink)] mb-4">
            Colecciones destacadas
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Top productos 2025: energías renovables",
                cover:
                  "https://lh3.googleusercontent.com/aida-public/AB6AXuDOgJHwbOF-r9c2LvYn7JplFF-uSjnKMfD-8elW0VGrjV0oO3ltmHSpJFBxQxxRS04pj_-vBszfDbY7grvzfl15cJXe2eExZYb6D_gto2akCswCqOFVywhPKVprzOUjkszdX8MIJGa27Vt76d80wDkndfbGHx0Dtm6IvYh89PrNJ6yI1edFZOBD-kQjQRgVFh7d42IzLqKWETlGzXtj_riQdmPfGE-4gr9GphRk1D-genEwSszrNmya0TM1GFi45CnWorLE6Rbfnz0",
              },
              {
                title: "Kit eco-tech para docentes y estudiantes",
                cover:
                  "https://lh3.googleusercontent.com/aida-public/AB6AXuBkgHyegf0xWv2idaqLPTvDV0i5VfdBMKswOabK2ojej2qNmTF1nhB3CwOTzBSJZgYSQBNjg7DQG4Y_BYbmRQhUE33TFGkYLUGpjjVP1GLbjFEuP_PvNiHCnqjqHH351kQKmhpIcpbPrarSqta7V-f6Oe0g3Whg98dyZRfrZ2zjfmpFOtaByHv4fWqg0POkhFWgS3uoiRCC4e8ixXQjTKF6j8_fio9FXhhs5sVaxkN5VsW-mvEkKiEogPT9FlzCvPzCo4wuH_sFOR8",
              },
              {
                title: "IA aplicada al ambiente: aprende hoy",
                cover:
                  "https://lh3.googleusercontent.com/aida-public/AB6AXuAN4xW0bPQWzUYAQkvvVMHyif5ZNR7ROozVbty6BroXhhQqQl-NLEASQDagOYe88H6nvdS9ksQakjE63ppjEjFj99yT_eslsC8UaIVd_e_98ln_wjgDeJmHgObPgQK8EAbhNxCX5VUGQBPDX7PlLY-UlanM6cQSkNW5oKCB_Q_eVFNW54tvML9_zipn34yLoxAxbM0yU6spHOuI3prfF4X2KQAxLPDv7TCnfWhvKlEd3GpNZrDozZwmAqCqFcV_UImfm4N_df1WoYs",
              },
            ].map((c, i) => (
              <div
                key={i}
                className="group relative overflow-hidden rounded-2xl border border-[var(--border)] bg-white"
              >
                <Image
                  src={c.cover}
                  alt={c.title}
                  width={800}
                  height={500}
                  className="h-40 w-full object-cover transition group-hover:scale-105"
                />
                <div className="p-4">
                  <h3 className="font-semibold">{c.title}</h3>
                  <p className="text-sm text-[var(--muted)]">
                    Selección curada por nuestro equipo.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GRID */}
      <section className="pb-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {visible.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {visible.map((r) => {
                switch (r.type) {
                  case "course":
                  case "certification":
                  case "membership":
                    return <CardCourse key={r.id} item={r} />;
                  case "product":
                    return <CardProduct key={r.id} item={r} />;
                  case "ebook":
                  case "software":
                    return <CardEbookSoftware key={r.id} item={r} />;
                  default:
                    return null;
                }
              })}
            </div>
          )}

          {visible.length < sorted.length && (
            <div className="mt-8 text-center">
              <button
                className="rounded-xl bg-black text-white px-6 py-3 font-semibold shadow hover:shadow-md"
                onClick={() => {
                  setLoading(true);
                  setTimeout(() => {
                    setPage((p) => p + 1);
                    setLoading(false);
                  }, 250);
                }}
              >
                {loading ? "Cargando..." : "Cargar más"}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* METODOLOGÍA / CONFIANZA */}
      <section
        id="metodologia"
        className="border-t border-[var(--border)] bg-[var(--panel)] py-16"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Methodology />
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <FAQ />
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="border-t border-[var(--border)] bg-[var(--panel)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 text-center">
          <h3 className="text-3xl font-bold text-[var(--ink)]">
            Recibe nuestras recomendaciones
          </h3>
          <p className="mt-2 text-[var(--muted)]">
            Suscríbete y recibe novedades y ofertas (Brevo).
          </p>
          <form
            className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row"
            onSubmit={(e) => {
              e.preventDefault();
              alert("¡Gracias! Pronto tendrás novedades.");
            }}
          >
            <input
              type="email"
              required
              placeholder="Tu correo"
              className="w-full rounded-lg border border-[var(--border)] bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-[var(--accent)]"
            />
            <button className="rounded-lg bg-[var(--accent)] px-6 py-3 font-semibold text-white hover:opacity-90">
              Suscribirme
            </button>
          </form>

          <p id="disclaimer" className="mt-6 text-xs text-[var(--muted)]">
            Algunos enlaces son de afiliado; sin costo extra para ti, podemos
            recibir una comisión si compras a través de ellos. As an Amazon
            Associate we earn from qualifying purchases. Curaduría
            independiente.
          </p>
        </div>
      </section>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
    </>
  );
}
