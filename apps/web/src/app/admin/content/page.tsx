"use client";

import React, { useState, useEffect } from "react";
import {
  Plus,
  Clock,
  Bot,
  Check,
  Copy,
  Trash2,
  Pause,
  Play,
  ExternalLink,
  Search,
  FileText,
  Sparkles,
  AlertCircle,
  RefreshCw,
  CheckCircle2,
  X,
  Code,
} from "lucide-react";
import Link from "next/link";

interface BlogArticleItem {
  id: string;
  slug: string;
  portal: "ia" | "ambiental";
  title: string;
  category: string;
  date: string;
  readTime: number;
  excerpt: string;
  author: {
    name: string;
    avatar: string;
    bio?: string;
  };
  tags: string[];
  status?: "PUBLISHED" | "SCHEDULED" | "PAUSED" | "ARCHIVED";
  source?: "AGENT" | "ADMIN" | "CODE";
  publishedAt?: string;
  createdAt?: string;
}

export default function ContentManagerPage() {
  const [articles, setArticles] = useState<BlogArticleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPortal, setSelectedPortal] = useState<"ALL" | "ia" | "ambiental">("ALL");
  const [selectedStatus, setSelectedStatus] = useState<"ALL" | "PUBLISHED" | "SCHEDULED" | "PAUSED">("ALL");

  // Modals
  const [showAgentModal, setShowAgentModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);
  const [copiedPython, setCopiedPython] = useState(false);
  const [copiedNode, setCopiedNode] = useState(false);

  // Status toggle & delete state
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // New article form
  const [formData, setFormData] = useState({
    portal: "ia" as "ia" | "ambiental",
    title: "",
    category: "Inteligencia Artificial",
    excerpt: "",
    content: "",
    status: "PUBLISHED" as "PUBLISHED" | "SCHEDULED" | "PAUSED",
    tags: "",
  });
  const [formSubmitting, setFormSubmitting] = useState(false);

  const fetchArticles = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/blog/articles?includeCode=true");
      if (!res.ok) {
        throw new Error("Error al obtener los artículos de blog");
      }
      const data = await res.json();
      setArticles(data.articles || []);
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : "Error de conexión.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  // Filtered list
  const filteredArticles = articles.filter((article) => {
    const matchesPortal = selectedPortal === "ALL" || article.portal === selectedPortal;
    const matchesStatus =
      selectedStatus === "ALL" ||
      (selectedStatus === "PUBLISHED" && (article.status === "PUBLISHED" || !article.status)) ||
      article.status === selectedStatus;

    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesPortal && matchesStatus && matchesSearch;
  });

  // Metrics calculation
  const totalArticles = articles.length;
  const publishedCount = articles.filter(
    (a) => a.status === "PUBLISHED" || !a.status || a.source === "CODE"
  ).length;
  const scheduledCount = articles.filter((a) => a.status === "SCHEDULED").length;
  const pausedCount = articles.filter((a) => a.status === "PAUSED").length;
  const agentCount = articles.filter((a) => a.source === "AGENT").length;

  // Toggle status (Pause / Publish)
  const handleToggleStatus = async (article: BlogArticleItem) => {
    if (article.source === "CODE") {
      alert("Este artículo está codificado en los archivos TypeScript. Para modificarlo o pausarlo, edita src/lib/blog-articles.ts.");
      return;
    }

    const nextStatus = article.status === "PAUSED" ? "PUBLISHED" : "PAUSED";
    setActionLoadingId(article.id);

    try {
      const res = await fetch(`/api/admin/blog/articles/${article.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "No se pudo actualizar el estado.");
      }

      setArticles((prev) =>
        prev.map((item) =>
          item.id === article.id ? { ...item, status: nextStatus } : item
        )
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al cambiar estado";
      alert(msg);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Delete article
  const handleDelete = async (article: BlogArticleItem) => {
    if (article.source === "CODE") {
      alert("Los artículos estáticos del código no pueden eliminarse desde la API. Puedes retirarlos del archivo TypeScript.");
      return;
    }

    if (!confirm(`¿Estás seguro de eliminar el artículo "${article.title}"? Esta acción no se puede deshacer.`)) {
      return;
    }

    setActionLoadingId(article.id);
    try {
      const res = await fetch(`/api/admin/blog/articles/${article.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "No se pudo eliminar el artículo.");
      }

      setArticles((prev) => prev.filter((item) => item.id !== article.id));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al eliminar";
      alert(msg);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Create article form submit
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      alert("Por favor completa el título y el contenido.");
      return;
    }

    setFormSubmitting(true);
    try {
      const tagsArray = formData.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      const res = await fetch("/api/admin/blog/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          tags: tagsArray,
          source: "ADMIN",
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Error al crear artículo");
      }

      const data = await res.json();
      setArticles((prev) => [data.article, ...prev]);
      setShowCreateModal(false);
      setFormData({
        portal: "ia",
        title: "",
        category: "Inteligencia Artificial",
        excerpt: "",
        content: "",
        status: "PUBLISHED",
        tags: "",
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error al guardar el artículo";
      alert(msg);
    } finally {
      setFormSubmitting(false);
    }
  };

  const copyToClipboard = (text: string, setter: (val: boolean) => void) => {
    navigator.clipboard.writeText(text);
    setter(true);
    setTimeout(() => setter(false), 2000);
  };

  const API_KEY_EXAMPLE = "aquatech-agent-key-2026";
  const ENDPOINT_EXAMPLE = typeof window !== "undefined" ? `${window.location.origin}/api/admin/blog/articles` : "https://aquatechia.com/api/admin/blog/articles";

  const curlSnippet = `curl -X POST "${ENDPOINT_EXAMPLE}" \\
  -H "Authorization: Bearer ${API_KEY_EXAMPLE}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "portal": "ia",
    "title": "Avances en Agentes Autónomos y Modelos Multimodales 2026",
    "category": "Inteligencia Artificial",
    "excerpt": "Cómo los sistemas multi-agente están transformando la productividad técnica.",
    "content": "## Introducción\\nLos agentes autónomos combinan razonamiento con ejecución de herramientas...\\n\\n## Arquitectura de Memoria\\nPara coordinar tareas complejas, se integran memorias episódicas...\\n\\n## Conclusión\\nLa nueva era de la IA se enfoca en la orquestación continua.",
    "status": "PUBLISHED",
    "tags": ["Agentes", "IA", "Automatización"]
  }'`;

  const pythonSnippet = `import requests

url = "${ENDPOINT_EXAMPLE}"
headers = {
    "Authorization": "Bearer ${API_KEY_EXAMPLE}",
    "Content-Type": "application/json"
}

payload = {
    "portal": "ia",  # "ia" o "ambiental"
    "title": "Avances en Agentes Autónomos y Modelos Multimodales 2026",
    "category": "Inteligencia Artificial",
    "excerpt": "Cómo los sistemas multi-agente están transformando la productividad técnica.",
    "content": """## Introducción
Los agentes autónomos combinan razonamiento con ejecución de herramientas...

## Arquitectura de Memoria
Para coordinar tareas complejas, se integran memorias episódicas...

## Conclusión
La nueva era de la IA se enfoca en la orquestación continua.""",
    "status": "PUBLISHED",  # "PUBLISHED", "SCHEDULED" o "PAUSED"
    "tags": ["Agentes", "IA", "Automatización"]
}

response = requests.post(url, json=payload, headers=headers)
print("Estado:", response.status_code)
print("Respuesta:", response.json())`;

  const nodeSnippet = `const response = await fetch("${ENDPOINT_EXAMPLE}", {
  method: "POST",
  headers: {
    "Authorization": "Bearer ${API_KEY_EXAMPLE}",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    portal: "ia", // "ia" o "ambiental"
    title: "Avances en Agentes Autónomos y Modelos Multimodales 2026",
    category: "Inteligencia Artificial",
    excerpt: "Cómo los sistemas multi-agente están transformando la productividad técnica.",
    content: \`## Introducción
Los agentes autónomos combinan razonamiento con ejecución de herramientas...

## Conclusión
La nueva era de la IA se enfoca en la orquestación continua.\`,
    status: "PUBLISHED", // Por defecto listo para publicar
    tags: ["Agentes", "IA", "Automatización"],
  }),
});

const result = await response.json();
console.log(result);`;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Gestor de Artículos de Blog
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              API Agentes Activa
            </span>
          </div>
          <p className="text-slate-400 mt-2 text-sm max-w-2xl">
            Permite que tus agentes de IA publiquen artículos automáticamente mediante API Key.
            Administra, pausa, reprograma o elimina cualquier publicación de ambos portales.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAgentModal(true)}
            className="bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 hover:border-slate-600 px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm font-medium transition-all shadow-sm"
          >
            <Bot className="w-4 h-4 text-emerald-400" />
            <span>Acceso para Agentes</span>
          </button>

          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm font-semibold transition-all shadow-lg shadow-emerald-900/30"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Artículo</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center gap-3 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium uppercase tracking-wider">
            <span>Total Artículos</span>
            <FileText className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-white">{totalArticles}</span>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-emerald-400 text-xs font-medium uppercase tracking-wider">
            <span>Publicados</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-emerald-400">{publishedCount}</span>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-blue-400 text-xs font-medium uppercase tracking-wider">
            <span>Programados</span>
            <Clock className="w-4 h-4 text-blue-400" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-blue-400">{scheduledCount}</span>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-amber-400 text-xs font-medium uppercase tracking-wider">
            <span>Pausados</span>
            <Pause className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-amber-400">{pausedCount}</span>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-cyan-400 text-xs font-medium uppercase tracking-wider">
            <span>De Agentes IA</span>
            <Bot className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="mt-3">
            <span className="text-2xl font-bold text-cyan-400">{agentCount}</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por título, slug o categoría..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Portal selector */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setSelectedPortal("ALL")}
              className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                selectedPortal === "ALL"
                  ? "bg-slate-800 text-white"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setSelectedPortal("ia")}
              className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                selectedPortal === "ia"
                  ? "bg-cyan-500/20 text-cyan-300"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Portal IA
            </button>
            <button
              onClick={() => setSelectedPortal("ambiental")}
              className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                selectedPortal === "ambiental"
                  ? "bg-emerald-500/20 text-emerald-300"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Portal Ambiental
            </button>
          </div>

          {/* Status selector */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setSelectedStatus("ALL")}
              className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                selectedStatus === "ALL"
                  ? "bg-slate-800 text-white"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setSelectedStatus("PUBLISHED")}
              className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                selectedStatus === "PUBLISHED"
                  ? "bg-emerald-500/20 text-emerald-300"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Publicados
            </button>
            <button
              onClick={() => setSelectedStatus("SCHEDULED")}
              className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                selectedStatus === "SCHEDULED"
                  ? "bg-blue-500/20 text-blue-300"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Programados
            </button>
            <button
              onClick={() => setSelectedStatus("PAUSED")}
              className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                selectedStatus === "PAUSED"
                  ? "bg-amber-500/20 text-amber-300"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Pausados
            </button>
          </div>

          <button
            onClick={fetchArticles}
            className="p-2 rounded-xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition-colors"
            title="Recargar artículos"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* Articles Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-12 text-center text-slate-500 flex flex-col items-center justify-center gap-3">
            <RefreshCw className="w-8 h-8 animate-spin text-emerald-500" />
            <p className="text-sm">Cargando catálogo de artículos...</p>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <AlertCircle className="w-10 h-10 mx-auto mb-3 opacity-40 text-slate-400" />
            <p className="text-base font-medium text-slate-300">No se encontraron artículos</p>
            <p className="text-xs text-slate-500 mt-1">Prueba cambiando los filtros o usa el endpoint para que tus agentes publiquen.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/60 border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-6">Artículo</th>
                  <th className="py-4 px-4">Portal</th>
                  <th className="py-4 px-4">Origen</th>
                  <th className="py-4 px-4">Estado</th>
                  <th className="py-4 px-4">Fecha</th>
                  <th className="py-4 px-6 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredArticles.map((article) => {
                  const isPaused = article.status === "PAUSED";
                  const isScheduled = article.status === "SCHEDULED";
                  const isCode = article.source === "CODE";
                  const isActionLoading = actionLoadingId === article.id;

                  return (
                    <tr
                      key={article.id || article.slug}
                      className="hover:bg-slate-800/30 transition-colors group"
                    >
                      {/* Title & Excerpt */}
                      <td className="py-4 px-6">
                        <div className="max-w-md">
                          <div className="font-semibold text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
                            {article.title}
                          </div>
                          <div className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                            /{article.portal}/blog/{article.slug}
                          </div>
                          <div className="text-xs text-slate-400/80 line-clamp-1 mt-1">
                            {article.excerpt}
                          </div>
                        </div>
                      </td>

                      {/* Portal */}
                      <td className="py-4 px-4">
                        {article.portal === "ia" ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                            Portal IA
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            Ambiental
                          </span>
                        )}
                      </td>

                      {/* Source */}
                      <td className="py-4 px-4">
                        {article.source === "AGENT" ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
                            <Bot className="w-3 h-3" />
                            Agente IA
                          </span>
                        ) : article.source === "ADMIN" ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            Panel Admin
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-400 border border-slate-700">
                            <Code className="w-3 h-3" />
                            Código TS
                          </span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        {isPaused ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                            <Pause className="w-3 h-3" />
                            Pausado
                          </span>
                        ) : isScheduled ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            <Clock className="w-3 h-3" />
                            Programado
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <CheckCircle2 className="w-3 h-3" />
                            Publicado
                          </span>
                        )}
                      </td>

                      {/* Date */}
                      <td className="py-4 px-4 text-xs text-slate-400 whitespace-nowrap">
                        {article.date}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          {/* Preview Link */}
                          <Link
                            href={`/${article.portal}/blog/${article.slug}`}
                            target="_blank"
                            className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                            title="Ver en el blog"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>

                          {/* Pause / Resume Button (Only dynamic articles) */}
                          {!isCode && (
                            <button
                              onClick={() => handleToggleStatus(article)}
                              disabled={isActionLoading}
                              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                                isPaused
                                  ? "bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30"
                                  : "bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 border border-amber-500/30"
                              }`}
                              title={isPaused ? "Publicar / Reanudar" : "Pausar publicación"}
                            >
                              {isActionLoading ? (
                                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              ) : isPaused ? (
                                <>
                                  <Play className="w-3.5 h-3.5 fill-current" />
                                  <span>Publicar</span>
                                </>
                              ) : (
                                <>
                                  <Pause className="w-3.5 h-3.5 fill-current" />
                                  <span>Pausar</span>
                                </>
                              )}
                            </button>
                          )}

                          {/* Delete Button (Only dynamic articles) */}
                          {!isCode && (
                            <button
                              onClick={() => handleDelete(article)}
                              disabled={isActionLoading}
                              className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 hover:border-red-500/40 transition-colors"
                              title="Eliminar artículo"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Agent Access Modal */}
      {showAgentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Acceso API para Agentes de IA</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Tus agentes pueden publicar artículos en automático mediante esta API
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAgentModal(false)}
                className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
              {/* Endpoint & Key Info */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Endpoint URL (POST)
                </label>
                <div className="flex items-center justify-between bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 font-mono text-xs text-emerald-400">
                  <span>{ENDPOINT_EXAMPLE}</span>
                  <button
                    onClick={() => copyToClipboard(ENDPOINT_EXAMPLE, setCopiedKey)}
                    className="text-slate-400 hover:text-white p-1"
                    title="Copiar Endpoint"
                  >
                    {copiedKey ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    API Key del Agente (Bearer Token)
                  </label>
                  <span className="text-[11px] text-slate-500">
                    Configurable vía BLOG_AGENT_API_KEY en .env
                  </span>
                </div>
                <div className="flex items-center justify-between bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 font-mono text-xs text-purple-400">
                  <span>Authorization: Bearer {API_KEY_EXAMPLE}</span>
                  <button
                    onClick={() => copyToClipboard(API_KEY_EXAMPLE, setCopiedKey)}
                    className="text-slate-400 hover:text-white p-1"
                    title="Copiar API Key"
                  >
                    {copiedKey ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Code Snippets */}
              <div className="space-y-4 pt-2">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Code className="w-4 h-4 text-emerald-400" />
                  Ejemplos de Integración para tus Agentes
                </h4>

                {/* cURL */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-semibold">cURL (Bash / Terminal / n8n)</span>
                    <button
                      onClick={() => copyToClipboard(curlSnippet, setCopiedCurl)}
                      className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 text-[11px]"
                    >
                      {copiedCurl ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCurl ? "Copiado" : "Copiar"}</span>
                    </button>
                  </div>
                  <pre className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-300 font-mono overflow-x-auto leading-relaxed">
                    {curlSnippet}
                  </pre>
                </div>

                {/* Python */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-semibold">Python (LangChain / CrewAI / Scripts)</span>
                    <button
                      onClick={() => copyToClipboard(pythonSnippet, setCopiedPython)}
                      className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 text-[11px]"
                    >
                      {copiedPython ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedPython ? "Copiado" : "Copiar"}</span>
                    </button>
                  </div>
                  <pre className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-300 font-mono overflow-x-auto leading-relaxed">
                    {pythonSnippet}
                  </pre>
                </div>

                {/* TypeScript / Node.js */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-semibold">Node.js / TypeScript</span>
                    <button
                      onClick={() => copyToClipboard(nodeSnippet, setCopiedNode)}
                      className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 text-[11px]"
                    >
                      {copiedNode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedNode ? "Copiado" : "Copiar"}</span>
                    </button>
                  </div>
                  <pre className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-300 font-mono overflow-x-auto leading-relaxed">
                    {nodeSnippet}
                  </pre>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-end">
              <button
                onClick={() => setShowAgentModal(false)}
                className="bg-slate-800 hover:bg-slate-700 text-white px-5 py-2 rounded-xl text-sm font-medium transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Create Article Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <form onSubmit={handleCreateSubmit}>
              <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Plus className="w-5 h-5 text-emerald-400" />
                  Crear Nuevo Artículo Manual
                </h3>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300">Portal de Destino</label>
                    <select
                      value={formData.portal}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          portal: e.target.value as "ia" | "ambiental",
                          category:
                            e.target.value === "ia"
                              ? "Inteligencia Artificial"
                              : "Gestión Ambiental",
                        })
                      }
                      className="mt-1.5 w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="ia">Portal IA</option>
                      <option value="ambiental">Portal Ambiental</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300">Estado Inicial</label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          status: e.target.value as "PUBLISHED" | "SCHEDULED" | "PAUSED",
                        })
                      }
                      className="mt-1.5 w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                    >
                      <option value="PUBLISHED">Publicado (Inmediato)</option>
                      <option value="SCHEDULED">Programado</option>
                      <option value="PAUSED">Pausado / Borrador</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300">Título del Artículo</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Guía Completa de Modelos de Difusión..."
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="mt-1.5 w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300">Categoría</label>
                    <input
                      type="text"
                      placeholder="Ej. LLMs, Machine Learning, Agua..."
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="mt-1.5 w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300">Etiquetas (separadas por coma)</label>
                    <input
                      type="text"
                      placeholder="IA, LLM, Python, Tutorial"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      className="mt-1.5 w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300">Resumen / Extracto</label>
                  <textarea
                    rows={2}
                    placeholder="Breve descripción para la tarjeta y SEO..."
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    className="mt-1.5 w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-slate-300">Contenido en Markdown</label>
                    <span className="text-[11px] text-slate-500">Usa ## para títulos de sección</span>
                  </div>
                  <textarea
                    rows={8}
                    required
                    placeholder={`## Introducción\nTexto inicial explicativo...\n\n## Desarrollo Principal\nContenido técnico detallado...\n\n## Conclusión\nResumen y conclusiones clave...`}
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="mt-1.5 w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2"
                >
                  {formSubmitting && <RefreshCw className="w-4 h-4 animate-spin" />}
                  <span>{formSubmitting ? "Guardando..." : "Crear Artículo"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
