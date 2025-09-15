"use client";

import React, { useState, useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

type Post = {
  id: string;
  title: string;
  category:
    | "IA Generativa"
    | "Modelos"
    | "Mapas"
    | "Noticias IA"
    | "Sostenibilidad IA"
    | "Sostenibilidad"
    | "Datos Ambientales"
    | "Noticias Ambiental";
  date: string; // ISO yyyy-mm-dd para ordenar
  readTimeMin: number;
  excerpt: string;
  image: string;
  author: { name: string; avatar: string };
  views: number;
  portal: "ia" | "ambiental" | "both";
};

interface BlogSectionProps {
  portal?: "ia" | "ambiental";
}

const PAGE_SIZE = 6; // Cambié a 6 para mejor vista en grid de 3 columnas

// Posts para IA
const IA_POSTS: Post[] = [
  {
    id: "p1",
    title: "Detectando anomalías en sensores de agua con Transformers",
    category: "Modelos",
    date: "2024-06-12",
    readTimeMin: 8,
    excerpt:
      "Cómo adaptar arquitecturas Transformer a series temporales IoT para detectar fallas en redes de monitoreo hídrico.",
    image:
      "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1600&q=60",
    author: {
      name: "Carla Díaz",
      avatar:
        "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=120&q=60",
    },
    views: 5400,
    portal: "ia",
  },
  {
    id: "p2",
    title: "RAG para informes ambientales: del PDF a respuestas confiables",
    category: "IA Generativa",
    date: "2024-06-08",
    readTimeMin: 7,
    excerpt:
      "Diseña un pipeline RAG que cite fuentes y resuma estudios de impacto ambiental con referencias verificables.",
    image:
      "https://images.unsplash.com/photo-1526378722484-bd91ca387e72?auto=format&fit=crop&w=1600&q=60",
    author: {
      name: "Marcos Pérez",
      avatar:
        "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=120&q=60",
    },
    views: 7600,
    portal: "ia",
  },
  {
    id: "p3",
    title:
      "Mapas inteligentes: segmentación semántica de cuerpos de agua con IA",
    category: "Mapas",
    date: "2024-06-05",
    readTimeMin: 9,
    excerpt:
      "Usa modelos de segmentación para identificar lagos y embalses en imágenes satelitales y evaluar cambios.",
    image:
      "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=1600&q=60",
    author: {
      name: "Elena Rodríguez",
      avatar:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=60",
    },
    views: 9800,
    portal: "ia",
  },
  {
    id: "p4",
    title: "Aquatech IA lanza plataforma de datos con LLMs explicables",
    category: "Noticias IA",
    date: "2024-05-30",
    readTimeMin: 4,
    excerpt:
      "Nueva suite con trazabilidad de fuentes, dashboards y API para integración con flujos de monitoreo.",
    image:
      "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?auto=format&fit=crop&w=1600&q=60",
    author: {
      name: "Equipo Aquatech",
      avatar:
        "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?auto=format&fit=crop&w=120&q=60",
    },
    views: 6200,
    portal: "ia",
  },
  {
    id: "p5",
    title: "Ajuste fino (LoRA) de LLMs para normativas ambientales locales",
    category: "IA Generativa",
    date: "2024-06-17",
    readTimeMin: 10,
    excerpt:
      "Entrena adaptadores ligeros para consultar legislación y guías técnicas por país o región con alta precisión.",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=60",
    author: {
      name: "Nadia Fuentes",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=60",
    },
    views: 8700,
    portal: "ia",
  },
  {
    id: "p6",
    title:
      "Time-series + GNNs: pronóstico de caudales en cuencas interconectadas",
    category: "Modelos",
    date: "2024-06-14",
    readTimeMin: 11,
    excerpt:
      "Combina grafos hidrológicos con LSTMs/TCNs para mejorar la predicción de caudales y alertas tempranas.",
    image:
      "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1600&q=60",
    author: {
      name: "Luis Andrade",
      avatar:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=60",
    },
    views: 7900,
    portal: "ia",
  },
  {
    id: "p7",
    title: "Vision-Language Models para auditorías en campo",
    category: "IA Generativa",
    date: "2024-06-03",
    readTimeMin: 6,
    excerpt:
      "Capta imágenes en sitio y genera reportes con evidencia visual, citas y checklist de cumplimiento.",
    image:
      "https://images.unsplash.com/photo-1555255695-1639f2e43f4e?auto=format&fit=crop&w=1600&q=60",
    author: {
      name: "Andrea Rivas",
      avatar:
        "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?auto=format&fit=crop&w=120&q=60",
    },
    views: 5100,
    portal: "ia",
  },
  {
    id: "p8",
    title: "Prompt Engineering para reportes técnicos reproducibles",
    category: "IA Generativa",
    date: "2024-06-11",
    readTimeMin: 6,
    excerpt:
      "Estructuras de prompts, system guides y checklists para generar memorias técnicas consistentes.",
    image:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1600&q=60",
    author: {
      name: "Marcos Pérez",
      avatar:
        "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=120&q=60",
    },
    views: 8400,
    portal: "ia",
  },
];

// Posts para Ambiental
const AMBIENTAL_POSTS: Post[] = [
  {
    id: "a1",
    title: "Monitoreo de calidad del agua con sensores IoT en tiempo real",
    category: "Datos Ambientales",
    date: "2024-06-15",
    readTimeMin: 7,
    excerpt:
      "Implementación de redes de sensores para el monitoreo continuo de parámetros de calidad del agua en cuencas hidrográficas.",
    image:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1600&q=60",
    author: {
      name: "María González",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=60",
    },
    views: 4200,
    portal: "ambiental",
  },
  {
    id: "a2",
    title: "Evaluación de impacto ambiental con metodologías integradas",
    category: "Sostenibilidad",
    date: "2024-06-10",
    readTimeMin: 12,
    excerpt:
      "Aplicación de metodologías holísticas para evaluar el impacto ambiental de proyectos de infraestructura hídrica.",
    image:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1600&q=60",
    author: {
      name: "Carlos Mendoza",
      avatar:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=120&q=60",
    },
    views: 6800,
    portal: "ambiental",
  },
  {
    id: "a3",
    title: "Gestión sostenible de recursos hídricos en zonas áridas",
    category: "Sostenibilidad",
    date: "2024-06-07",
    readTimeMin: 9,
    excerpt:
      "Estrategias innovadoras para la conservación y manejo eficiente del agua en regiones con escasez hídrica.",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1600&q=60",
    author: {
      name: "Ana Luisa Vera",
      avatar:
        "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=120&q=60",
    },
    views: 5900,
    portal: "ambiental",
  },
  {
    id: "a4",
    title: "Mapeo de biodiversidad acuática con tecnología satelital",
    category: "Mapas",
    date: "2024-06-04",
    readTimeMin: 8,
    excerpt:
      "Uso de imágenes satelitales y análisis espacial para mapear y monitorear la biodiversidad en ecosistemas acuáticos.",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=60",
    author: {
      name: "Elena Rodríguez",
      avatar:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=60",
    },
    views: 7300,
    portal: "ambiental",
  },
  {
    id: "a5",
    title: "Nuevas regulaciones ambientales para la gestión del agua",
    category: "Noticias Ambiental",
    date: "2024-05-28",
    readTimeMin: 5,
    excerpt:
      "Análisis de las últimas regulaciones y políticas públicas para la gestión sostenible de recursos hídricos.",
    image:
      "https://images.unsplash.com/photo-1594736797933-d0a6ba652a2b?auto=format&fit=crop&w=1600&q=60",
    author: {
      name: "Equipo Aquatech",
      avatar:
        "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?auto=format&fit=crop&w=120&q=60",
    },
    views: 3800,
    portal: "ambiental",
  },
  {
    id: "a6",
    title: "Restauración de humedales: casos de éxito en Latinoamérica",
    category: "Sostenibilidad",
    date: "2024-06-02",
    readTimeMin: 10,
    excerpt:
      "Proyectos exitosos de restauración de humedales y su impacto en la conservación de la biodiversidad.",
    image:
      "https://images.unsplash.com/photo-1502780402662-acc01917124e?auto=format&fit=crop&w=1600&q=60",
    author: {
      name: "Roberto Silva",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=60",
    },
    views: 5600,
    portal: "ambiental",
  },
  {
    id: "a7",
    title: "Análisis de contaminantes emergentes en aguas superficiales",
    category: "Datos Ambientales",
    date: "2024-05-25",
    readTimeMin: 11,
    excerpt:
      "Detección y análisis de microplásticos y contaminantes farmacéuticos en cuerpos de agua urbanos.",
    image:
      "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?auto=format&fit=crop&w=1600&q=60",
    author: {
      name: "Patricia Morales",
      avatar:
        "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=120&q=60",
    },
    views: 4700,
    portal: "ambiental",
  },
  {
    id: "a8",
    title: "Cambio climático y recursos hídricos: adaptación y mitigación",
    category: "Sostenibilidad",
    date: "2024-06-01",
    readTimeMin: 14,
    excerpt:
      "Estrategias de adaptación al cambio climático en la gestión de recursos hídricos y ecosistemas acuáticos.",
    image:
      "https://images.unsplash.com/photo-1573160813959-df3665d9583e?auto=format&fit=crop&w=1600&q=60",
    author: {
      name: "Fernando López",
      avatar:
        "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=120&q=60",
    },
    views: 6500,
    portal: "ambiental",
  },
];

const IA_CATEGORIES = [
  "Todos",
  "IA Generativa",
  "Modelos",
  "Mapas",
  "Noticias IA",
];
const AMBIENTAL_CATEGORIES = [
  "Todos",
  "Sostenibilidad",
  "Datos Ambientales",
  "Mapas",
  "Noticias Ambiental",
];

export default function BlogSection({ portal }: BlogSectionProps) {
  const pathname = usePathname();
  const currentPortal =
    portal || (pathname.includes("/ia/") ? "ia" : "ambiental");
  const isDark = currentPortal === "ia";

  // Datos específicos por portal
  const ALL_POSTS = currentPortal === "ia" ? IA_POSTS : AMBIENTAL_POSTS;
  const CATEGORIES =
    currentPortal === "ia" ? IA_CATEGORIES : AMBIENTAL_CATEGORIES;

  // Estados
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("Todos");
  const [sort, setSort] = useState<"recent" | "popular" | "old">("recent");
  const [page, setPage] = useState(1);

  // Simulación de contador de vistas (actualizar en tiempo real)
  const [viewCounts, setViewCounts] = useState<Record<string, number>>(() => {
    const counts: Record<string, number> = {};
    ALL_POSTS.forEach((post) => {
      counts[post.id] = post.views;
    });
    return counts;
  });

  // Incrementar vistas cuando se "lee" un artículo
  const incrementViews = (postId: string) => {
    setViewCounts((prev) => ({
      ...prev,
      [postId]: (prev[postId] || 0) + 1,
    }));
  };

  // Posts con vistas actualizadas
  const postsWithUpdatedViews = useMemo(() => {
    return ALL_POSTS.map((post) => ({
      ...post,
      views: viewCounts[post.id] || post.views,
    }));
  }, [ALL_POSTS, viewCounts]);

  // Top 3 por vistas (más leídos)
  const featured = useMemo(() => {
    const sorted = [...postsWithUpdatedViews].sort((a, b) => b.views - a.views);
    return sorted.slice(0, 3);
  }, [postsWithUpdatedViews]);

  // Filtrar y ordenar para "Últimos posts"
  const filtered = useMemo(() => {
    const excludeIds = new Set(featured.map((p) => p.id));
    let list = postsWithUpdatedViews.filter((p) => !excludeIds.has(p.id));

    if (category !== "Todos") {
      list = list.filter((p) => p.category === category);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt.toLowerCase().includes(q) ||
          p.author.name.toLowerCase().includes(q),
      );
    }
    if (sort === "recent") {
      list = list.sort((a, b) => b.date.localeCompare(a.date));
    } else if (sort === "popular") {
      list = list.sort((a, b) => b.views - a.views);
    } else {
      list = list.sort((a, b) => a.date.localeCompare(b.date));
    }
    return list;
  }, [category, query, sort, featured, postsWithUpdatedViews]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const end = Math.min(start + PAGE_SIZE, total);
  const pageSlice = filtered.slice(start, end);

  useEffect(() => {
    setPage(1);
  }, [category, query, sort]);

  // Clases condicionales según el tema
  const bgMain = isDark ? "bg-[#10111A]" : "bg-[#F5F9F8]";
  const bgSecondary = isDark ? "bg-[#131522]" : "bg-white";
  const bgTertiary = isDark ? "bg-[#141725]" : "bg-gray-50";
  const textMain = isDark ? "text-[#f3f6ff]" : "text-[#0D161C]";
  const textSecondary = isDark ? "text-[#b6c2df]" : "text-gray-600";
  const textMuted = isDark ? "text-[#8a93b2]" : "text-gray-500";
  const borderColor = isDark ? "border-[#2a2d3a]" : "border-gray-200";
  const primaryColor = isDark ? "#00EFFF" : "#10B981";
  const primaryColorClass = isDark ? "text-[#00EFFF]" : "text-[#10B981]";
  const primaryBgClass = isDark ? "bg-[#00EFFF]" : "bg-[#10B981]";
  const primaryBorderClass = isDark ? "border-[#00EFFF]" : "border-[#10B981]";
  const hoverShadow = isDark
    ? "hover:shadow-[0_0_20px_rgba(0,239,255,0.25)]"
    : "hover:shadow-lg";

  const formatDate = (dateStr: string) => {
    return new Intl.DateTimeFormat("es", { dateStyle: "medium" }).format(
      new Date(dateStr),
    );
  };

  const formatViews = (views: number) => {
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}k`;
    }
    return views.toString();
  };

  return (
    <main className={`min-h-screen ${bgMain} ${textMain}`}>
      {/* HERO */}
      <section
        className={`py-16 md:py-24 text-center bg-gradient-to-b from-[var(--bg-main)] to-[var(--bg-secondary)]`}
        style={
          {
            "--bg-main": isDark ? "#10111A" : "#F5F9F8",
            "--bg-secondary": isDark ? "#131522" : "white",
          } as React.CSSProperties
        }
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1
            className="text-4xl md:text-6xl font-bold mb-4 tracking-tight"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            Blog de Aquatech {currentPortal === "ia" ? "IA" : "Ambiental"}
          </h1>
          <p
            className={`text-lg md:text-xl ${textSecondary} max-w-3xl mx-auto`}
          >
            {currentPortal === "ia"
              ? "Explora noticias, tutoriales y casos de uso sobre inteligencia artificial aplicada al agua y al ambiente."
              : "Descubre análisis, investigaciones y casos de estudio sobre gestión ambiental y sostenibilidad hídrica."}
          </p>
        </div>
      </section>

      {/* CONTROLES (sticky) */}
      <section
        className={`py-6 ${bgSecondary} sticky top-0 z-40 border-b ${borderColor}`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
            {/* Search */}
            <div className="relative flex-1">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar artículos…"
                className={`w-full ${bgTertiary} border ${borderColor} rounded-lg py-2 pl-10 pr-4 ${textMain} focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                style={
                  { "--tw-ring-color": primaryColor } as React.CSSProperties
                }
                type="text"
              />
              <svg
                className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${textMuted}`}
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

            {/* Chips */}
            <div className="flex flex-wrap items-center gap-2">
              {CATEGORIES.map((c) => {
                const active = category === c;
                return (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className={`text-sm font-medium px-4 py-1.5 rounded-full border transition-colors ${
                      active
                        ? `${primaryBgClass} ${isDark ? "text-[#10111A]" : "text-white"} ${primaryBorderClass}`
                        : `${borderColor} hover:${primaryBorderClass.replace("border-", "border-")} hover:${primaryColorClass.replace("text-", "text-")}`
                    }`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>

            {/* Sort */}
            <div className="relative w-full md:w-auto">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as any)}
                className={`w-full appearance-none ${bgTertiary} border ${borderColor} rounded-lg py-2 pl-4 pr-10 ${textMain} focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
                style={
                  { "--tw-ring-color": primaryColor } as React.CSSProperties
                }
              >
                <option value="recent">Más recientes</option>
                <option value="popular">Más leídos</option>
                <option value="old">Más antiguos</option>
              </select>
              <svg
                className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 ${textMuted}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED – MÁS LEÍDOS */}
      <section className={`py-12 md:py-16 ${bgMain}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2
              className="text-2xl md:text-3xl font-bold tracking-tight"
              style={{ fontFamily: "Space Grotesk, sans-serif" }}
            >
              Más leídos
            </h2>
            <p className={textSecondary}>
              Tres artículos destacados por cantidad de lecturas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featured.map((post, idx) => (
              <article
                key={post.id}
                className={`rounded-xl overflow-hidden border ${borderColor} ${bgSecondary} transition-all hover:-translate-y-1 ${hoverShadow} group cursor-pointer`}
                onClick={() => incrementViews(post.id)}
              >
                <div className="relative">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-52 object-cover group-hover:opacity-90 transition-opacity"
                  />
                  <div
                    className={`absolute top-3 left-3 ${primaryBgClass} ${isDark ? "text-[#10111A]" : "text-white"} px-2 py-1 rounded-full text-xs font-bold`}
                  >
                    #{idx + 1}
                  </div>
                  <div
                    className={`absolute top-3 right-3 ${bgSecondary} px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1`}
                  >
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                    {formatViews(post.views)}
                  </div>
                </div>
                <div className="p-5 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-semibold ${primaryColorClass} uppercase`}
                    >
                      {post.category}
                    </span>
                    <span className={`text-xs ${textMuted}`}>
                      {formatDate(post.date)}
                    </span>
                  </div>
                  <h3
                    className={`text-lg font-bold leading-snug hover:${primaryColorClass.replace("text-", "text-")}`}
                  >
                    {post.title}
                  </h3>
                  <p className={`text-sm ${textSecondary} line-clamp-3`}>
                    {post.excerpt}
                  </p>
                  <div
                    className={`flex items-center justify-between text-xs ${textMuted}`}
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={post.author.avatar}
                        className="w-6 h-6 rounded-full"
                        alt={post.author.name}
                      />
                      <span>{post.author.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4"
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
                      <span>{post.readTimeMin} min</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* LISTADO – ÚLTIMOS POSTS */}
      <section className={`py-12 md:py-16 ${bgMain}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2
              className="text-2xl md:text-3xl font-bold tracking-tight"
              style={{ fontFamily: "Space Grotesk, sans-serif" }}
            >
              Últimos posts
            </h2>
            <p className={textSecondary}>
              {total > 0
                ? `Mostrando ${start + 1}–${end} de ${total} resultados`
                : "Sin resultados. Prueba cambiar filtros o búsqueda."}
            </p>
          </div>

          {total === 0 ? (
            <div
              className={`rounded-xl border ${borderColor} ${bgSecondary} p-8 text-center`}
            >
              <p className={`${textSecondary} mb-4`}>
                No encontramos artículos para tu búsqueda.
              </p>
              <button
                onClick={() => {
                  setQuery("");
                  setCategory("Todos");
                  setSort("recent");
                }}
                className={`inline-flex items-center gap-2 rounded-lg border ${primaryBorderClass} px-4 py-2 text-sm font-semibold hover:${primaryBgClass.replace("bg-", "bg-")} hover:${isDark ? "text-[#10111A]" : "text-white"} transition-colors`}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Limpiar filtros
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {pageSlice.map((post) => (
                  <article
                    key={post.id}
                    className={`rounded-xl overflow-hidden border ${borderColor} ${bgSecondary} transition-all hover:-translate-y-1 ${hoverShadow} group cursor-pointer`}
                    onClick={() => incrementViews(post.id)}
                  >
                    <div className="relative">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-48 object-cover group-hover:opacity-90 transition-opacity"
                      />
                      <div
                        className={`absolute top-3 right-3 ${bgSecondary} px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1`}
                      >
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                        {formatViews(post.views)}
                      </div>
                    </div>
                    <div className="p-6 flex flex-col h-full">
                      <div className="mb-2 flex items-center gap-3 flex-wrap">
                        <span
                          className={`text-xs font-semibold ${primaryColorClass} uppercase`}
                        >
                          {post.category}
                        </span>
                        <span
                          className={`text-xs ${textMuted} flex items-center gap-1`}
                        >
                          <svg
                            className="w-3 h-3"
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
                          {formatDate(post.date)}
                        </span>
                        <span className={textMuted}>•</span>
                        <span
                          className={`text-xs ${textMuted} flex items-center gap-1`}
                        >
                          <svg
                            className="w-3 h-3"
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
                          {post.readTimeMin} min
                        </span>
                      </div>

                      <h3
                        className={`text-xl font-bold mb-2 hover:${primaryColorClass.replace("text-", "text-")} transition-colors`}
                      >
                        {post.title}
                      </h3>
                      <p
                        className={`${textSecondary} mb-4 line-clamp-3 flex-grow`}
                      >
                        {post.excerpt}
                      </p>

                      <div className="mt-auto flex items-center justify-between">
                        <div
                          className={`flex items-center gap-2 text-sm ${textMuted}`}
                        >
                          <img
                            src={post.author.avatar}
                            className="w-6 h-6 rounded-full"
                            alt={post.author.name}
                          />
                          <span>{post.author.name}</span>
                        </div>
                        <button
                          title="Guardar artículo (requiere iniciar sesión)"
                          className={`rounded-full border ${borderColor} hover:${primaryBorderClass.replace("border-", "border-")} p-2 transition-colors`}
                        >
                          <svg
                            className="w-4 h-4"
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
                  </article>
                ))}
              </div>

              {/* PAGINACIÓN */}
              <nav
                aria-label="Paginación"
                className={`flex items-center justify-between border-t ${borderColor} pt-8 mt-12`}
              >
                <button
                  disabled={currentPage === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className={`relative inline-flex items-center px-4 py-2 border rounded-md text-sm transition-colors ${
                    currentPage === 1
                      ? `${borderColor} ${textMuted} cursor-not-allowed`
                      : `${borderColor} ${textMain} hover:${primaryBgClass.replace("bg-", "bg-")} hover:${isDark ? "text-[#10111A]" : "text-white"}`
                  }`}
                >
                  Anterior
                </button>

                <div className="hidden sm:flex items-center gap-2">
                  {Array.from({ length: totalPages }).map((_, i) => {
                    const n = i + 1;
                    const active = n === currentPage;
                    const show =
                      n === 1 ||
                      n === totalPages ||
                      (n >= currentPage - 1 && n <= currentPage + 1);

                    if (!show) {
                      if (n === 2 && currentPage > 3)
                        return (
                          <span key={n} className={textMuted}>
                            …
                          </span>
                        );
                      if (n === totalPages - 1 && currentPage < totalPages - 2)
                        return (
                          <span key={n} className={textMuted}>
                            …
                          </span>
                        );
                      return null;
                    }

                    return (
                      <button
                        key={n}
                        onClick={() => setPage(n)}
                        className={`px-3 py-2 rounded-md border text-sm transition-colors ${
                          active
                            ? `${primaryBgClass} ${isDark ? "text-[#10111A]" : "text-white"} ${primaryBorderClass}`
                            : `${borderColor} ${textMain} hover:${primaryBgClass.replace("bg-", "bg-")} hover:${isDark ? "text-[#10111A]" : "text-white"}`
                        }`}
                      >
                        {n}
                      </button>
                    );
                  })}
                </div>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className={`relative inline-flex items-center px-4 py-2 border rounded-md text-sm transition-colors ${
                    currentPage === totalPages
                      ? `${borderColor} ${textMuted} cursor-not-allowed`
                      : `${borderColor} ${textMain} hover:${primaryBgClass.replace("bg-", "bg-")} hover:${isDark ? "text-[#10111A]" : "text-white"}`
                  }`}
                >
                  Siguiente
                </button>
              </nav>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
