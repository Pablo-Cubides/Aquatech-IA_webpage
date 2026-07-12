import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArticle, getAllArticles } from "@/lib/blog-articles";
import { generateArticleSchema } from "@/lib/blog-seo";
import { renderSafeRichText } from "@/lib/security/safe-rich-text";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle("ia", slug);

  if (!article) {
    return {
      title: "Artículo no encontrado",
      description: "El artículo que buscas no está disponible",
    };
  }

  const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || "https://aquatechia.com").trim().replace(/\/+$/, "");
  const articleUrl = `${baseUrl}/ia/blog/${slug}`;

  return {
    title: article.title,
    description: article.excerpt,
    keywords: article.tags,
    authors: [{ name: article.author.name }],
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: article.date,
      authors: [article.author.name],
      images: [
        {
          url: article.heroImage,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
      url: articleUrl,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: [article.heroImage],
      creator: "@aquatechia",
    },
    alternates: {
      canonical: articleUrl,
    },
  };
}

export async function generateStaticParams() {
  const articles = getAllArticles("ia");
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

interface TOCSubsection {
  id: string;
  title: string;
}

interface TOCSection {
  id: string;
  title: string;
  subsections?: TOCSubsection[];
}

// Tabla de contenidos generada automáticamente
const generateTOC = (sections: TOCSection[]) => {
  return sections.map((section) => ({
    id: section.id,
    title: section.title,
    subsections:
      section.subsections?.map((sub) => ({
        id: sub.id,
        title: sub.title,
      })) || [],
  }));
};

function formatDate(iso: string) {
  const date = new Date(iso);
  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default async function BlogArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticle("ia", slug);

  if (!article) {
    notFound();
  }

  const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || "https://aquatechia.com").trim().replace(/\/+$/, "");
  const schema = generateArticleSchema(article, "ia", baseUrl);
  const toc = generateTOC(article.content.sections);

  return (
    <div className="bg-[#10111A] min-h-screen text-white">
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Artículo */}
          <article className="lg:col-span-8">
            {/* Breadcrumb */}
            <nav className="mb-8 text-sm">
              <ol className="flex items-center space-x-2 text-gray-400">
                <li>
                  <Link href="/ia" className="hover:text-[#00EFFF]">
                    Inicio
                  </Link>
                </li>
                <li>
                  <span>›</span>
                </li>
                <li>
                  <Link href="/ia/blog" className="hover:text-[#00EFFF]">
                    Blog
                  </Link>
                </li>
                <li>
                  <span>›</span>
                </li>
                <li className="text-[#00EFFF] font-medium">
                  {article.category}
                </li>
              </ol>
            </nav>

            {/* Meta + Título */}
            <div className="mb-8">
              <span className="inline-block bg-[#00EFFF] text-[#10111A] text-sm font-semibold px-3 py-1 rounded-full mb-4">
                {article.category}
              </span>
              <h1
                className="text-4xl md:text-5xl font-bold mb-6 text-white leading-tight"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                {article.title}
              </h1>

              <div className="flex flex-wrap items-center text-gray-300 text-sm gap-6 mb-6">
                <Link
                  href="/ia/autor"
                  className="flex items-center hover:opacity-80 transition-opacity"
                >
                  <Image
                    alt={`Avatar de ${article.author.name}`}
                    className="rounded-full mr-3"
                    src={article.author.avatar}
                    width={40}
                    height={40}
                  />
                  <div>
                    <div className="font-medium text-white">
                      Por {article.author.name}
                    </div>
                    {article.author.bio && (
                      <div className="text-xs text-gray-400">
                        {article.author.bio}
                      </div>
                    )}
                  </div>
                </Link>

                <div className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span>Publicado el {formatDate(article.date)}</span>
                </div>

                <div className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>{article.readTime} min de lectura</span>
                </div>

                <div className="flex items-center ml-auto space-x-2">
                  <button
                    aria-label="Compartir"
                    className="p-2 rounded-full hover:bg-gray-800 transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
                      />
                    </svg>
                  </button>
                  <button
                    aria-label="Guardar en favoritos"
                    className="p-2 rounded-full hover:bg-gray-800 transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Imagen hero */}
            <div className="rounded-xl overflow-hidden shadow-lg mb-8">
              <div className="relative w-full h-[300px] md:h-[480px]">
                <Image
                  alt={article.title}
                  src={article.heroImage}
                  fill
                  priority
                  className="object-cover"
                />
              </div>
            </div>

            {/* Contenido principal */}
            <div className="prose prose-lg max-w-none prose-invert">
              {/* Introducción */}
              <p className="text-xl leading-relaxed text-gray-300 mb-8 font-medium">
                {article.content.introduction}
              </p>

              {/* Secciones */}
              {article.content.sections.map((section) => (
                <section key={section.id} id={section.id} className="mb-12">
                  <h2
                    className="text-3xl font-bold text-white mb-6"
                    style={{ fontFamily: "Space Grotesk, sans-serif" }}
                  >
                    {section.title}
                  </h2>

                  <div
                    className="text-gray-300 leading-7 mb-6"
                    dangerouslySetInnerHTML={{
                      __html: renderSafeRichText(section.content, "text-white"),
                    }}
                  />

                  {/* Imagen de sección */}
                  {section.image && (
                    <div className="my-8 rounded-lg overflow-hidden shadow-md">
                      <div className="relative w-full h-[280px] md:h-[360px]">
                        <Image
                          alt={section.title}
                          src={section.image}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  )}

                  {/* Callout */}
                  {section.callout && (
                    <div
                      className={`callout border-l-4 p-6 rounded-lg my-8 flex items-start ${
                        section.callout.type === "info"
                          ? "bg-blue-900/20 border-[#0095FF]"
                          : section.callout.type === "success"
                            ? "bg-green-900/20 border-[#00EFFF]"
                            : "bg-red-900/20 border-red-500"
                      }`}
                    >
                      <div
                        className={`mr-3 text-2xl ${
                          section.callout.type === "info"
                            ? "text-[#0095FF]"
                            : section.callout.type === "success"
                              ? "text-[#00EFFF]"
                              : "text-red-500"
                        }`}
                      >
                        {section.callout.type === "info"
                          ? "💡"
                          : section.callout.type === "success"
                            ? "✅"
                            : "⚠️"}
                      </div>
                      <div>
                        <h4
                          className={`font-semibold text-lg mb-1 ${
                            section.callout.type === "info"
                              ? "text-blue-300"
                              : section.callout.type === "success"
                                ? "text-cyan-300"
                                : "text-red-300"
                          }`}
                        >
                          {section.callout.title}
                        </h4>
                        <div
                          className={
                            section.callout.type === "info"
                              ? "text-blue-200"
                              : section.callout.type === "success"
                                ? "text-cyan-200"
                                : "text-red-200"
                          }
                          dangerouslySetInnerHTML={{
                            __html: renderSafeRichText(section.callout.content, ""),
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Subsecciones */}
                  {section.subsections?.map((subsection) => (
                    <div
                      key={subsection.id}
                      id={subsection.id}
                      className="ml-6 mb-8"
                    >
                      <h3 className="text-2xl font-bold text-white mb-4">
                        {subsection.title}
                      </h3>
                      <div
                        className="text-gray-300 leading-7"
                        dangerouslySetInnerHTML={{
                          __html: renderSafeRichText(
                            subsection.content,
                            "text-white",
                          ),
                        }}
                      />
                    </div>
                  ))}
                </section>
              ))}

              {/* Conclusión */}
              {article.content.conclusion && (
                <section className="mb-12 p-6 bg-gray-900/50 rounded-xl border border-gray-800">
                  <h2
                    className="text-3xl font-bold text-white mb-6"
                    style={{ fontFamily: "Space Grotesk, sans-serif" }}
                  >
                    Conclusión
                  </h2>
                  <p className="text-gray-300 leading-7 text-lg">
                    {article.content.conclusion}
                  </p>
                </section>
              )}

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-8">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-800 text-gray-300 text-sm rounded-full hover:bg-[#00EFFF] hover:text-[#10111A] transition-colors cursor-pointer"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-4 lg:sticky top-24 self-start space-y-8">
            {/* TOC */}
            <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
              <h3
                className="text-xl font-bold mb-4 text-white"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                Tabla de contenidos
              </h3>
              <nav className="toc">
                <ul className="space-y-3">
                  {toc.map((item) => (
                    <li key={item.id}>
                      <a
                        className="text-gray-300 hover:text-[#00EFFF] transition-colors block py-1"
                        href={`#${item.id}`}
                      >
                        {item.title}
                      </a>
                      {item.subsections.length > 0 && (
                        <ul className="pl-4 mt-2 space-y-2 border-l border-gray-700">
                          {item.subsections.map((sub) => (
                            <li key={sub.id}>
                              <a
                                className="text-sm text-gray-400 hover:text-[#00EFFF] transition-colors block py-1"
                                href={`#${sub.id}`}
                              >
                                {sub.title}
                              </a>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* Buscador */}
            <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
              <div className="relative">
                <input
                  type="text"
                  aria-label="Buscar artículos en el blog"
                  placeholder="Buscar artículos..."
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-[#00EFFF] focus:border-[#00EFFF] text-white placeholder-gray-400 transition-colors"
                />
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5"
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
            </div>

            {/* Categorías */}
            <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-800">
              <h3
                className="text-xl font-bold mb-4 text-white"
                style={{ fontFamily: "Space Grotesk, sans-serif" }}
              >
                Categorías
              </h3>
              <ul className="space-y-2">
                {[
                  { name: "Machine Learning", count: 12 },
                  { name: "Deep Learning", count: 8 },
                  { name: "Transformers", count: 15 },
                  { name: "Computer Vision", count: 6 },
                ].map((category) => (
                  <li key={category.name}>
                    <Link
                      href={`/ia/blog?categoria=${category.name.toLowerCase().replace(/\s+/g, "-")}`}
                      className="flex justify-between items-center text-gray-300 hover:text-[#00EFFF] transition-colors py-1"
                    >
                      <span>{category.name}</span>
                      <span className="text-xs font-medium text-gray-500 bg-gray-800 px-2 py-1 rounded-full">
                        {category.count}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div className="bg-gradient-to-br from-[#00EFFF] to-[#0095FF] p-6 rounded-xl shadow-lg text-[#10111A]">
              <h3 className="text-xl font-bold mb-2">Mantente actualizado</h3>
              <p className="text-sm text-blue-900 mb-4">
                Suscríbete y recibe lo último en inteligencia artificial.
              </p>
              <form className="space-y-3">
                <input
                  type="email"
                  aria-label="Tu correo electrónico para suscribirte al boletín"
                  className="w-full px-4 py-3 rounded-lg bg-white/90 border border-white/30 focus:ring-2 focus:ring-white text-[#10111A] placeholder-gray-600 transition-colors"
                  placeholder="tu.email@ejemplo.com"
                />
                <button
                  type="submit"
                  className="w-full bg-[#10111A] text-[#00EFFF] font-bold py-3 px-4 rounded-lg hover:bg-gray-900 transition-colors"
                >
                  Suscribirme
                </button>
              </form>
            </div>
          </aside>
        </div>

        {/* Siguiente artículo */}
        {article.nextArticle && (
          <section className="mt-16 pt-8 border-t border-gray-800">
            <Link
              href={`/ia/blog/${article.nextArticle.slug}`}
              className="group block p-8 bg-gray-900/50 rounded-xl border border-gray-800 hover:bg-gray-900/70 transition-colors duration-300"
            >
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="text-center md:text-left mb-4 md:mb-0">
                  <p className="text-sm text-gray-400 mb-2">
                    Siguiente artículo
                  </p>
                  <h3 className="text-2xl md:text-3xl font-bold text-white group-hover:text-[#00EFFF] transition-colors">
                    {article.nextArticle.title}
                  </h3>
                </div>
                <div className="flex items-center text-[#00EFFF] transform group-hover:translate-x-2 transition-transform duration-300">
                  <span className="text-xl font-semibold mr-3">Leer más</span>
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          </section>
        )}
      </div>
    </div>
  );
}
