"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { type BlogArticle } from "@/lib/blog-articles";
import { type BlogCategory } from "@/lib/blog-categories";

interface BlogContentProps {
  articles: BlogArticle[];
  categories: BlogCategory[];
  portal: "ia" | "ambiental";
}

function classNames(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

function formatDate(iso: string) {
  const date = new Date(iso);
  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function BlogContent({ articles, categories, portal }: BlogContentProps) {
  const [search, setSearch] = useState("");
  const [activeCategorySlug, setActiveCategorySlug] = useState<string | null>(null);
  const [sort, setSort] = useState<"newest" | "oldest" | "popular">("newest");
  const [view, setView] = useState<"grid" | "list">("grid");

  const isAmbiental = portal === "ambiental";
  const primaryColor = isAmbiental ? "green" : "violet";
  const gradientColors = isAmbiental
    ? "from-[#10B981]/20 via-white to-[#0077B6]/15"
    : "from-violet-500/20 via-white to-purple-500/15";

  const posts = useMemo(() => {
    let data = [...articles];

    // Filtro por categoría SEO
    if (activeCategorySlug) {
      const category = categories.find((c) => c.slug === activeCategorySlug);
      if (category) {
        // Mapear categoría SEO a categorías de artículos legacy
        data = data.filter((p) => {
          // Por ahora filtramos por nombre de categoría existente
          // En el futuro, los artículos tendrán categorySlug
          return p.category
            .toLowerCase()
            .includes(category.displayName.toLowerCase().slice(0, 10));
        });
      }
    }

    // Búsqueda simple
    if (search.trim()) {
      const q = search.toLowerCase();
      data = data.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.author.name.toLowerCase().includes(q),
      );
    }

    // Orden
    if (sort === "newest") {
      data.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
    } else if (sort === "oldest") {
      data.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      );
    } else if (sort === "popular") {
      data.sort((a, b) => b.readTime - a.readTime);
    }

    return data;
  }, [articles, categories, activeCategorySlug, search, sort]);

  const featured = posts[0];
  const list = posts.slice(1);

  return (
    <main className="min-h-screen bg-[#F9FAFB] text-[#1F2937]">
      {/* HERO */}
      <section
        className={`py-16 md:py-24 bg-gradient-to-br ${gradientColors} text-center relative overflow-hidden`}
      >
        <div
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(${isAmbiental ? "16,185,129" : "139,92,246"},.3) 1px, transparent 0)`,
            backgroundSize: "20px 20px",
          }}
        />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <h1
            className={`text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r ${isAmbiental ? "from-[#0077B6] via-[#10B981] to-[#10B981]" : "from-violet-600 via-purple-600 to-violet-600"} bg-clip-text text-transparent`}
          >
            {isAmbiental ? "Blog Ambiental" : "Blog de IA"}
          </h1>
          <p className="text-lg md:text-xl text-[#4B5563] max-w-3xl mx-auto mt-6">
            {isAmbiental
              ? "Artículos, análisis y soluciones innovadoras para los desafíos ambientales del siglo XXI"
              : "Guías, tutoriales y análisis sobre inteligencia artificial, machine learning y tecnologías emergentes"}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link
              href="#articulos"
              className={`bg-${primaryColor}-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-${primaryColor}-700 transition-colors`}
              style={{
                backgroundColor: isAmbiental ? "#16a34a" : "#7c3aed",
              }}
            >
              Explorar Artículos
            </Link>
            <Link
              href={`/${portal}/nosotros`}
              className={`border-2 border-${primaryColor}-600 text-${primaryColor}-600 px-8 py-3 rounded-full font-semibold hover:bg-${primaryColor}-600 hover:text-white transition-colors`}
              style={{
                borderColor: isAmbiental ? "#16a34a" : "#7c3aed",
                color: isAmbiental ? "#16a34a" : "#7c3aed",
              }}
            >
              Conoce Nuestro Equipo
            </Link>
          </div>
        </div>
      </section>

      {/* BARRA DE BÚSQUEDA + FILTROS (sticky) */}
      <section className="py-6 bg-white/90 backdrop-blur-sm sticky top-0 z-40 border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Búsqueda */}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Buscar artículos, temas o autores..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`w-full bg-white border border-gray-300 rounded-lg py-3 pl-12 pr-4 text-[#1F2937] focus:outline-none focus:ring-2 focus:ring-${primaryColor}-500 focus:border-transparent transition-all`}
              />
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {/* Filtros por categoría SEO */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => setActiveCategorySlug(null)}
                className={classNames(
                  "px-4 py-2 rounded-full text-sm font-medium border transition-all",
                  activeCategorySlug === null
                    ? `bg-${primaryColor}-600 text-white border-${primaryColor}-600 shadow-lg`
                    : `bg-white text-[#4B5563] border-gray-300 hover:bg-${primaryColor}-50 hover:border-${primaryColor}-300 hover:text-${primaryColor}-700`,
                )}
                style={
                  activeCategorySlug === null
                    ? {
                        backgroundColor: isAmbiental ? "#16a34a" : "#7c3aed",
                        borderColor: isAmbiental ? "#16a34a" : "#7c3aed",
                      }
                    : {}
                }
              >
                Todos
              </button>
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/${portal}/categoria/${cat.slug}`}
                  className={classNames(
                    "px-4 py-2 rounded-full text-sm font-medium border transition-all",
                    activeCategorySlug === cat.slug
                      ? `bg-${primaryColor}-600 text-white border-${primaryColor}-600 shadow-lg`
                      : `bg-white text-[#4B5563] border-gray-300 hover:bg-${primaryColor}-50 hover:border-${primaryColor}-300 hover:text-${primaryColor}-700`,
                  )}
                >
                  {cat.displayName}
                </Link>
              ))}
            </div>

            {/* Controles adicionales */}
            <div className="flex items-center gap-3">
              <select
                value={sort}
                onChange={(e) =>
                  setSort(e.target.value as "newest" | "oldest" | "popular")
                }
                className={`bg-white border border-gray-300 rounded-lg py-2 pl-4 pr-10 text-[#4B5563] focus:outline-none focus:ring-2 focus:ring-${primaryColor}-500 focus:border-transparent`}
              >
                <option value="newest">Más Recientes</option>
                <option value="oldest">Más Antiguos</option>
                <option value="popular">Más Populares</option>
              </select>

              {/* Toggle de vista */}
              <div className="hidden sm:flex items-center gap-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setView("grid")}
                  className={classNames(
                    "p-2 rounded-md transition-colors",
                    view === "grid"
                      ? `bg-white text-${primaryColor}-600 shadow-sm`
                      : "text-gray-500 hover:text-gray-700",
                  )}
                  style={
                    view === "grid"
                      ? { color: isAmbiental ? "#16a34a" : "#7c3aed" }
                      : {}
                  }
                  title="Vista en cuadrícula"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M3 3h7v7H3V3zm0 11h7v7H3v-7zm11-11h7v7h-7V3zm0 11h7v7h-7v-7z" />
                  </svg>
                </button>
                <button
                  onClick={() => setView("list")}
                  className={classNames(
                    "p-2 rounded-md transition-colors",
                    view === "list"
                      ? `bg-white text-${primaryColor}-600 shadow-sm`
                      : "text-gray-500 hover:text-gray-700",
                  )}
                  style={
                    view === "list"
                      ? { color: isAmbiental ? "#16a34a" : "#7c3aed" }
                      : {}
                  }
                  title="Vista en lista"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M3 6h18v2H3V6zm0 5h18v2H3v-2zm0 5h18v2H3v-2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENIDO PRINCIPAL */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* MAIN CONTENT */}
          <div className="lg:w-3/4">
            {/* Header */}
            <div className="mb-8 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
              <div>
                <h2 id="articulos" className="text-3xl font-bold text-gray-900">
                  Artículos
                </h2>
                <p className="text-gray-600 mt-1">
                  {posts.length > 0 ? (
                    <>
                      Mostrando {posts.length} artículo
                      {posts.length !== 1 ? "s" : ""}
                    </>
                  ) : (
                    "No se encontraron artículos"
                  )}
                </p>
              </div>
            </div>

            {/* Artículo destacado */}
            {featured && view === "grid" && (
              <article className="rounded-xl border border-gray-200 bg-white overflow-hidden mb-12 group shadow-lg hover:shadow-xl transition-shadow">
                <div className="grid md:grid-cols-2">
                  <Link
                    href={`/${portal}/blog/${featured.slug}`}
                    className="relative aspect-[16/10] md:aspect-auto md:h-full block"
                  >
                    <Image
                      src={featured.heroImage}
                      alt={featured.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                    <div className="absolute top-4 left-4">
                      <span
                        className={`bg-${primaryColor}-600 text-white px-3 py-1 rounded-full text-sm font-bold`}
                        style={{
                          backgroundColor: isAmbiental ? "#16a34a" : "#7c3aed",
                        }}
                      >
                        Destacado
                      </span>
                    </div>
                  </Link>
                  <div className="p-6 md:p-8 flex flex-col">
                    <div className="mb-3">
                      <span
                        className={`text-sm font-semibold text-${primaryColor}-600 uppercase tracking-wide`}
                        style={{
                          color: isAmbiental ? "#16a34a" : "#7c3aed",
                        }}
                      >
                        {featured.category}
                      </span>
                    </div>
                    <h3
                      className={`text-2xl lg:text-3xl font-bold mb-4 group-hover:text-${primaryColor}-600 transition-colors leading-tight`}
                    >
                      <Link href={`/${portal}/blog/${featured.slug}`}>
                        {featured.title}
                      </Link>
                    </h3>
                    <p className="text-[#4B5563] mb-6 flex-grow leading-relaxed">
                      {featured.excerpt}
                    </p>
                    <div className="mt-auto flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <Image
                          src={featured.author.avatar}
                          alt={featured.author.name}
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                        <span className="text-[#1F2937] font-medium">
                          {featured.author.name}
                        </span>
                      </div>
                      <span>•</span>
                      <span>{formatDate(featured.date)}</span>
                      <span>•</span>
                      <span>{featured.readTime} min lectura</span>
                    </div>
                  </div>
                </div>
              </article>
            )}

            {/* Grid/Lista de artículos */}
            {posts.length > 0 ? (
              <div
                className={classNames(
                  view === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 gap-8"
                    : "space-y-6",
                )}
              >
                {list.map((post) =>
                  view === "grid" ? (
                    <CardGrid
                      key={post.slug}
                      post={post}
                      portal={portal}
                      primaryColor={primaryColor}
                      isAmbiental={isAmbiental}
                    />
                  ) : (
                    <CardList
                      key={post.slug}
                      post={post}
                      portal={portal}
                      primaryColor={primaryColor}
                      isAmbiental={isAmbiental}
                    />
                  ),
                )}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                <div className="text-gray-400 text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No se encontraron artículos
                </h3>
                <p className="text-gray-600 mb-6">
                  Intenta ajustar tus filtros de búsqueda o explorar otras
                  categorías.
                </p>
                <button
                  onClick={() => {
                    setSearch("");
                    setActiveCategorySlug(null);
                    setSort("newest");
                  }}
                  className={`bg-${primaryColor}-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-${primaryColor}-700 transition-colors`}
                  style={{
                    backgroundColor: isAmbiental ? "#16a34a" : "#7c3aed",
                  }}
                >
                  Limpiar Filtros
                </button>
              </div>
            )}
          </div>

          {/* SIDEBAR */}
          <aside className="lg:w-1/4 space-y-8">
            {/* Artículos populares */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-xl font-bold mb-6 text-gray-900">
                Artículos Populares
              </h3>
              <ul className="space-y-4">
                {articles.slice(0, 3).map((post) => (
                  <li key={`popular-${post.slug}`}>
                    <Link
                      href={`/${portal}/blog/${post.slug}`}
                      className="group flex gap-4 items-start"
                    >
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={post.heroImage}
                          alt={post.title}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4
                          className={`font-semibold text-gray-900 group-hover:text-${primaryColor}-600 transition-colors text-sm leading-tight`}
                        >
                          {post.title.length > 50
                            ? post.title.slice(0, 47) + "..."
                            : post.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                          <span>{formatDate(post.date)}</span>
                          <span>•</span>
                          <span>{post.readTime} min</span>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div
              className={`bg-gradient-to-br ${isAmbiental ? "from-green-600 to-blue-600" : "from-violet-600 to-purple-600"} p-8 rounded-xl text-white`}
            >
              <h3 className="text-2xl font-bold mb-3">Mantente Informado</h3>
              <p
                className={`mb-6 ${isAmbiental ? "text-green-100" : "text-violet-100"}`}
              >
                {isAmbiental
                  ? "Recibe los últimos artículos y análisis ambientales directamente en tu email."
                  : "Recibe las últimas novedades sobre IA, tutoriales y guías directamente en tu email."}
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  // TODO: Implement subscription
                }}
                className="space-y-3"
              >
                <input
                  type="email"
                  required
                  placeholder="Tu correo electrónico"
                  className="w-full rounded-lg px-4 py-3 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
                />
                <button
                  type="submit"
                  className={`w-full rounded-lg px-4 py-3 font-bold bg-white text-${primaryColor}-600 hover:bg-${primaryColor}-50 transition-colors`}
                  style={{
                    color: isAmbiental ? "#16a34a" : "#7c3aed",
                  }}
                >
                  Suscribirse
                </button>
              </form>
              <p
                className={`mt-4 text-xs ${isAmbiental ? "text-green-100" : "text-violet-100"}`}
              >
                Respetamos tu privacidad. Sin spam, solo contenido valioso.
              </p>
            </div>

            {/* Categorías SEO */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="text-xl font-bold mb-6 text-gray-900">
                Categorías
              </h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <Link
                    key={category.slug}
                    href={`/${portal}/categoria/${category.slug}`}
                    className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors group flex justify-between items-center"
                  >
                    <span
                      className={`font-medium text-gray-900 group-hover:text-${primaryColor}-600`}
                    >
                      {category.displayName}
                    </span>
                    <svg
                      className="w-4 h-4 text-gray-400 group-hover:text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

interface CardProps {
  post: BlogArticle;
  portal: "ia" | "ambiental";
  primaryColor: string;
  isAmbiental: boolean;
}

function CardGrid({ post, portal, isAmbiental }: CardProps) {
  return (
    <article className="rounded-xl border border-gray-200 bg-white overflow-hidden group shadow-sm hover:shadow-lg transition-all">
      <Link
        href={`/${portal}/blog/${post.slug}`}
        className="relative block aspect-[16/9]"
      >
        <Image
          src={post.heroImage}
          alt={post.title}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4">
          <span
            className="text-white px-3 py-1 rounded-full text-xs font-bold"
            style={{
              backgroundColor: isAmbiental ? "#16a34a" : "#7c3aed",
            }}
          >
            {post.category}
          </span>
        </div>
      </Link>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-3 group-hover:text-green-600 transition-colors leading-tight">
          <Link href={`/${portal}/blog/${post.slug}`}>{post.title}</Link>
        </h3>
        <p className="text-[#4B5563] mb-4 leading-relaxed">{post.excerpt}</p>
        <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <Image
              src={post.author.avatar}
              alt={post.author.name}
              width={24}
              height={24}
              className="rounded-full"
            />
            <span className="font-medium">{post.author.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>{formatDate(post.date)}</span>
            <span>•</span>
            <span>{post.readTime} min</span>
          </div>
        </div>
      </div>
    </article>
  );
}

function CardList({ post, portal, isAmbiental }: CardProps) {
  return (
    <article className="rounded-xl border border-gray-200 bg-white overflow-hidden group shadow-sm hover:shadow-lg transition-all">
      <div className="grid sm:grid-cols-[240px,1fr] gap-0">
        <Link
          href={`/${portal}/blog/${post.slug}`}
          className="relative block aspect-[16/10] sm:aspect-auto sm:h-full"
        >
          <Image
            src={post.heroImage}
            alt={post.title}
            fill
            sizes="(max-width: 640px) 100vw, 240px"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-4 left-4">
            <span
              className="text-white px-3 py-1 rounded-full text-xs font-bold"
              style={{
                backgroundColor: isAmbiental ? "#16a34a" : "#7c3aed",
              }}
            >
              {post.category}
            </span>
          </div>
        </Link>
        <div className="p-6 flex flex-col">
          <h3 className="text-xl font-bold mb-3 group-hover:text-green-600 transition-colors leading-tight">
            <Link href={`/${portal}/blog/${post.slug}`}>{post.title}</Link>
          </h3>
          <p className="text-[#4B5563] flex-grow leading-relaxed">
            {post.excerpt}
          </p>
          <div className="flex items-center justify-between text-sm text-gray-500 mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2">
              <Image
                src={post.author.avatar}
                alt={post.author.name}
                width={24}
                height={24}
                className="rounded-full"
              />
              <span className="font-medium">{post.author.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>{formatDate(post.date)}</span>
              <span>•</span>
              <span>{post.readTime} min</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
