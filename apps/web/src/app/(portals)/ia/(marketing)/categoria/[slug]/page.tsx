import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  getCategoryBySlug,
  getAllCategorySlugs,
  getArticlesByCategory,
  generateCategorySchema,
  generateBreadcrumbSchema,
  getCategoryBreadcrumbs,
} from "@/lib/blog-seo";

// Generar rutas estáticas para todas las categorías
export async function generateStaticParams() {
  const slugs = getAllCategorySlugs("ia", true);
  return slugs.map((slug) => ({ slug }));
}

// Generar metadata SEO dinámica
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug("ia", slug);

  if (!category) {
    return {
      title: "Categoría no encontrada",
    };
  }

  const canonicalUrl = `https://aquatechia.com/ia/categoria/${slug}`;

  return {
    title: category.metaTitle,
    description: category.metaDescription,
    keywords: category.keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: category.metaTitle,
      description: category.metaDescription,
      url: canonicalUrl,
      type: "website",
      siteName: "AquatechIA - Portal IA",
    },
    twitter: {
      card: "summary_large_image",
      title: category.metaTitle,
      description: category.metaDescription,
    },
    robots: category.noindex
      ? { index: false, follow: true }
      : { index: true, follow: true },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getCategoryBySlug("ia", slug);

  if (!category) {
    notFound();
  }

  const articles = getArticlesByCategory("ia", slug);
  const breadcrumbs = getCategoryBreadcrumbs("ia", category);
  const categorySchema = generateCategorySchema(category, "ia", articles);
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(categorySchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      <main className="min-h-screen bg-gradient-to-b from-violet-50 to-white">
        {/* Breadcrumbs */}
        <nav
          aria-label="Breadcrumb"
          className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8"
        >
          <ol className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
            {breadcrumbs.map((crumb, index) => (
              <li key={crumb.url} className="flex items-center">
                {index > 0 && <span className="mx-2">/</span>}
                {index === breadcrumbs.length - 1 ? (
                  <span className="font-medium text-violet-700">
                    {crumb.name}
                  </span>
                ) : (
                  <Link
                    href={crumb.url.replace("https://aquatechia.com", "")}
                    className="hover:text-violet-600 hover:underline"
                  >
                    {crumb.name}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </nav>

        {/* Header */}
        <header className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            {category.h1}
          </h1>
          <p className="mt-4 max-w-3xl text-lg text-gray-600">
            {category.description}
          </p>
        </header>

        {/* Articles Grid */}
        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
          {articles.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <article
                  key={article.slug}
                  className="group overflow-hidden rounded-2xl bg-white shadow-lg transition-all hover:shadow-xl"
                >
                  <Link href={`/ia/blog/${article.slug}`}>
                    <div className="relative aspect-video overflow-hidden">
                      <Image
                        src={article.heroImage}
                        alt={article.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                    <div className="p-6">
                      <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
                        <time dateTime={article.date}>
                          {new Date(article.date).toLocaleDateString("es-ES", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </time>
                        <span>•</span>
                        <span>{article.readTime} min lectura</span>
                      </div>
                      <h2 className="text-xl font-semibold text-gray-900 group-hover:text-violet-600">
                        {article.title}
                      </h2>
                      <p className="mt-2 line-clamp-3 text-gray-600">
                        {article.excerpt}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {article.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-violet-100 px-3 py-1 text-xs font-medium text-violet-700"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl bg-white p-12 text-center shadow-lg">
              <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-violet-100 p-4">
                <svg
                  className="h-8 w-8 text-violet-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                Próximamente
              </h2>
              <p className="mt-2 text-gray-600">
                Estamos preparando contenido de calidad para esta categoría.
                ¡Vuelve pronto!
              </p>
              <Link
                href="/ia/blog"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-violet-600 px-6 py-3 font-medium text-white transition-colors hover:bg-violet-700"
              >
                Ver todos los artículos
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          )}
        </section>

        {/* Back to Blog CTA */}
        {articles.length > 0 && (
          <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
            <div className="flex justify-center">
              <Link
                href="/ia/blog"
                className="inline-flex items-center gap-2 rounded-full border-2 border-violet-600 px-6 py-3 font-medium text-violet-600 transition-colors hover:bg-violet-50"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Volver al blog
              </Link>
            </div>
          </section>
        )}
      </main>
    </>
  );
}
