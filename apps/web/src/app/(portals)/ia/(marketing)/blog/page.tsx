"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getAllArticles } from "@/lib/blog-articles";

// Datos de artículos
const articles = getAllArticles("ia");

export default function BlogIA() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [sortBy, setSortBy] = useState("recent");

  // Obtener categorías únicas
  const categories = [
    "Todos",
    ...Array.from(new Set(articles.map((article) => article.category))),
  ];

  // Filtrar artículos
  const filteredArticles = articles
    .filter((article) => {
      const matchesSearch =
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "Todos" || article.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === "recent") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else if (sortBy === "popular") {
        return b.readTime - a.readTime; // Usando readTime como proxy de popularidad
      }
      return 0;
    });

  // Artículos destacados (primeros 3)
  const featuredArticles = articles.slice(0, 3);

  return (
    <div className="min-h-screen bg-[#000000] text-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#00EFFF] to-[#0095FF]">
        <div className="max-w-6xl px-6 py-16 mx-auto">
          <div className="text-center">
            <h1 className="mb-6 text-4xl font-bold md:text-6xl">Blog IA</h1>
            <p className="text-xl md:text-2xl text-[#000000] mb-8 max-w-3xl mx-auto">
              Explora el futuro de la inteligencia artificial: desde fundamentos
              técnicos hasta aplicaciones revolucionarias que están
              transformando nuestro mundo
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="#articulos"
                className="bg-[#00EFFF] text-[#000000] px-8 py-3 rounded-full font-semibold hover:bg-white transition-colors"
              >
                Explorar Artículos
              </Link>
              <Link
                href="/ia/nosotros"
                className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-[#00EFFF] hover:text-[#000000] transition-colors"
              >
                Conoce Nuestro Equipo
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Artículos Destacados */}
      <section className="py-16 bg-[#10111A]">
        <div className="max-w-6xl px-6 mx-auto">
          <h2 className="mb-12 text-3xl font-bold text-center text-white">
            Artículos Destacados
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {featuredArticles.map((article) => (
              <Link
                key={article.slug}
                href={`/ia/blog/${article.slug}`}
                className="block overflow-hidden transition-all border border-gray-700 group bg-gray-800/50 rounded-xl hover:border-cyan-400 hover:shadow-xl hover:shadow-cyan-400/10"
              >
                <div className="relative h-48">
                  <Image
                    src={article.heroImage}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 text-sm font-bold text-gray-900 rounded-full bg-cyan-500">
                      {article.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="mb-3 text-xl font-bold text-white transition-colors group-hover:text-cyan-400 line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-[#CCCCCC] mb-4 line-clamp-2">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-sm text-[#CCCCCC]">
                    <div className="flex items-center space-x-2">
                      <Image
                        src={article.author.avatar}
                        alt={article.author.name}
                        width={24}
                        height={24}
                        className="border rounded-full border-cyan-400"
                      />
                      <span>{article.author.name}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span>{article.date}</span>
                      <span>•</span>
                      <span>{article.readTime} min</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Filtros y Lista de Artículos */}
      <section id="articulos" className="py-16">
        <div className="max-w-6xl px-6 mx-auto">
          <div className="mb-12">
            <h2 className="mb-8 text-3xl font-bold text-center text-white">
              Todos los Artículos
            </h2>

            {/* Barra de búsqueda y filtros */}
            <div className="p-6 border border-gray-700 bg-gray-800/50 rounded-xl">
              <div className="flex flex-col items-center gap-4 lg:flex-row">
                {/* Búsqueda */}
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Buscar artículos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 text-white placeholder-gray-400 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                </div>

                {/* Filtro por categoría */}
                <div className="w-full lg:w-auto">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-3 text-white bg-gray-700 border border-gray-600 rounded-lg lg:w-auto focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Ordenar por */}
                <div className="w-full lg:w-auto">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-4 py-3 text-white bg-gray-700 border border-gray-600 rounded-lg lg:w-auto focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  >
                    <option value="recent">Más recientes</option>
                    <option value="popular">Más populares</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Lista de artículos */}
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {filteredArticles.map((article) => (
              <Link
                key={article.slug}
                href={`/ia/blog/${article.slug}`}
                className="block overflow-hidden transition-all border border-gray-700 group bg-gray-800/50 rounded-xl hover:border-cyan-400 hover:shadow-xl hover:shadow-cyan-400/10"
              >
                <div className="relative h-48">
                  <Image
                    src={article.heroImage}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 text-sm font-bold text-gray-900 rounded-full bg-cyan-500">
                      {article.category}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="px-2 py-1 text-xs font-medium text-white rounded bg-gray-900/80">
                      {article.readTime} min
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="mb-3 text-xl font-bold text-white transition-colors group-hover:text-cyan-400 line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-[#CCCCCC] mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Image
                        src={article.author.avatar}
                        alt={article.author.name}
                        width={32}
                        height={32}
                        className="border rounded-full border-cyan-400"
                      />
                      <div>
                        <p className="text-sm font-medium text-white">
                          {article.author.name}
                        </p>
                        <p className="text-xs text-[#CCCCCC]">{article.date}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {article.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs border rounded bg-cyan-900/50 text-cyan-300 border-cyan-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Mensaje si no hay resultados */}
          {filteredArticles.length === 0 && (
            <div className="py-12 text-center">
              <div className="mb-4 text-6xl text-gray-600">🔍</div>
              <h3 className="mb-2 text-xl font-semibold text-white">
                No se encontraron artículos
              </h3>
              <p className="text-[#CCCCCC]">
                Intenta ajustar tus filtros de búsqueda o explorar otras
                categorías.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-cyan-600">
        <div className="max-w-4xl px-6 mx-auto text-center">
          <h2 className="mb-4 text-3xl font-bold">Mantente al Día con la IA</h2>
          <p className="mb-8 text-xl text-cyan-100">
            Recibe los últimos avances en inteligencia artificial y artículos
            técnicos directamente en tu email
          </p>
          <div className="flex flex-col justify-center max-w-md gap-4 mx-auto sm:flex-row">
            <input
              type="email"
              placeholder="Tu email"
              className="flex-1 px-4 py-3 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="px-6 py-3 font-semibold text-blue-600 transition-colors bg-white rounded-lg hover:bg-cyan-50">
              Suscribirse
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
