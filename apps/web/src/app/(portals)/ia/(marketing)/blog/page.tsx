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
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Blog IA</h1>
            <p className="text-xl md:text-2xl text-[#CCCCCC] mb-8 max-w-3xl mx-auto">
              Explora el futuro de la inteligencia artificial: desde fundamentos
              técnicos hasta aplicaciones revolucionarias que están
              transformando nuestro mundo
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">
            Artículos Destacados
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {featuredArticles.map((article) => (
              <Link
                key={article.slug}
                href={`/ia/blog/${article.slug}`}
                className="group block bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700 hover:border-cyan-400 hover:shadow-xl hover:shadow-cyan-400/10 transition-all"
              >
                <div className="relative h-48">
                  <Image
                    src={article.heroImage}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-cyan-500 text-gray-900 px-3 py-1 rounded-full text-sm font-bold">
                      {article.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors line-clamp-2">
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
                        className="rounded-full border border-cyan-400"
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
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-8 text-center">
              Todos los Artículos
            </h2>

            {/* Barra de búsqueda y filtros */}
            <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
              <div className="flex flex-col lg:flex-row gap-4 items-center">
                {/* Búsqueda */}
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Buscar artículos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-gray-400"
                  />
                </div>

                {/* Filtro por categoría */}
                <div className="w-full lg:w-auto">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full lg:w-auto px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white"
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
                    className="w-full lg:w-auto px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white"
                  >
                    <option value="recent">Más recientes</option>
                    <option value="popular">Más populares</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Lista de artículos */}
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredArticles.map((article) => (
              <Link
                key={article.slug}
                href={`/ia/blog/${article.slug}`}
                className="group block bg-gray-800/50 rounded-xl overflow-hidden border border-gray-700 hover:border-cyan-400 hover:shadow-xl hover:shadow-cyan-400/10 transition-all"
              >
                <div className="relative h-48">
                  <Image
                    src={article.heroImage}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-cyan-500 text-gray-900 px-3 py-1 rounded-full text-sm font-bold">
                      {article.category}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-gray-900/80 text-white px-2 py-1 rounded text-xs font-medium">
                      {article.readTime} min
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors line-clamp-2">
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
                        className="rounded-full border border-cyan-400"
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
                          className="bg-cyan-900/50 text-cyan-300 border border-cyan-600 px-2 py-1 rounded text-xs"
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
            <div className="text-center py-12">
              <div className="text-gray-600 text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-white mb-2">
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
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Mantente al Día con la IA</h2>
          <p className="text-xl text-cyan-100 mb-8">
            Recibe los últimos avances en inteligencia artificial y artículos
            técnicos directamente en tu email
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Tu email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-cyan-50 transition-colors">
              Suscribirse
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
