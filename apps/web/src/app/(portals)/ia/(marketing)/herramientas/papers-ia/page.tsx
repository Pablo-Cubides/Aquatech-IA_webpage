'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Search, 
  BookOpen, 
  Calendar, 
  Filter, 
  ExternalLink,
  FileText,
  ChevronLeft,
  ChevronRight,
  Loader2,
  X,
  Users
} from 'lucide-react';
import { 
  ArxivPaper, 
  ArxivApiResponse, 
  BLOG_CATEGORY_NAMES,
  ARXIV_CATEGORY_NAMES,
  BLOG_TO_ARXIV_CATEGORIES
} from './types/arxiv';

const ITEMS_PER_PAGE = 20;

/**
 * Format date in a consistent way that won't cause hydration issues
 * Uses ISO format first, then formats on client only
 */
function formatDateSafe(dateString: string): string {
  try {
    const date = new Date(dateString);
    // Use consistent format that works the same on server and client
    const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
    const day = date.getUTCDate();
    const month = months[date.getUTCMonth()];
    const year = date.getUTCFullYear();
    return `${day} ${month} ${year}`;
  } catch {
    return dateString;
  }
}

/**
 * Format number consistently without locale issues
 */
function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return String(num);
}

export default function PapersIAPage() {
  const [papers, setPapers] = useState<ArxivPaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const [selectedPaper, setSelectedPaper] = useState<ArxivPaper | null>(null);
  const [sortBy, setSortBy] = useState<'submittedDate' | 'relevance'>('submittedDate');
  const [mounted, setMounted] = useState(false);

  // Handle hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchPapers = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      if (selectedCategory) params.set('category', selectedCategory);
      if (debouncedSearch) params.set('search', debouncedSearch);
      params.set('limit', String(ITEMS_PER_PAGE));
      params.set('start', String(currentPage * ITEMS_PER_PAGE));
      params.set('sortBy', sortBy);
      
      const response = await fetch(`/api/arxiv-papers?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Error al cargar los papers');
      }
      
      const data: ArxivApiResponse = await response.json();
      setPapers(data.papers);
      setTotalResults(data.totalResults);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, debouncedSearch, currentPage, sortBy]);

  useEffect(() => {
    fetchPapers();
  }, [fetchPapers]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(0);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(0);
  };

  const totalPages = useMemo(() => Math.ceil(totalResults / ITEMS_PER_PAGE), [totalResults]);

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const categoryButtons = useMemo(() => Object.entries(BLOG_CATEGORY_NAMES), []);

  // Helper to find which Blog Categories a paper belongs to based on its ArXiv tags
  const getPaperBlogCategories = useCallback((paperCategories: string[]) => {
    const matchedBlogCategories: string[] = [];
    
    Object.entries(BLOG_TO_ARXIV_CATEGORIES).forEach(([blogCatSlug, arxivCats]) => {
      // Check if any of the paper's categories match the arXiv categories for this blog category
      const hasMatch = paperCategories.some(cat => arxivCats.includes(cat));
      if (hasMatch) {
        matchedBlogCategories.push(BLOG_CATEGORY_NAMES[blogCatSlug]);
      }
    });

    // Remove duplicates and return
    return Array.from(new Set(matchedBlogCategories));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-black text-white">
      {/* Header */}
      <header className="relative overflow-hidden py-16 px-4">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.15),transparent_50%)]" />
        
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4 animate-fade-in">
            <BookOpen className="w-10 h-10 text-blue-400" aria-hidden="true" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Papers de IA
            </h1>
          </div>
          
          <p className="text-lg text-gray-300 max-w-2xl mx-auto animate-fade-in-delay">
            Explora los artículos científicos más recientes sobre inteligencia artificial desde ArXiv
          </p>

          <div className="flex justify-center gap-8 mt-6 text-sm text-gray-400 animate-fade-in-delay-2">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-400" aria-hidden="true" />
              <span suppressHydrationWarning>
                {mounted ? formatNumber(totalResults) : '...'} papers encontrados
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-400" aria-hidden="true" />
              <span>Actualizado cada 2 horas</span>
            </div>
          </div>
        </div>
      </header>

      {/* Search and Filters */}
      <section className="max-w-7xl mx-auto px-4 py-6" aria-label="Filtros de búsqueda">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="lg:col-span-2" role="search">
            <label htmlFor="paper-search" className="sr-only">Buscar papers</label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" aria-hidden="true" />
              <input
                id="paper-search"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por título, autor o tema..."
                className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setCurrentPage(0);
                  }}
                  className="absolute right-12 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-700 rounded-full transition-colors"
                  aria-label="Limpiar búsqueda"
                >
                  <X className="w-4 h-4 text-gray-400" aria-hidden="true" />
                </button>
              )}
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors"
              >
                Buscar
              </button>
            </div>
          </form>

          {/* Sort By */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" aria-hidden="true" />
            <label htmlFor="sort-select" className="sr-only">Ordenar por</label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value as 'submittedDate' | 'relevance');
                setCurrentPage(0);
              }}
              className="flex-1 px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            >
              <option value="submittedDate">Más recientes</option>
              <option value="relevance">Relevancia</option>
            </select>
          </div>
        </div>

        {/* Category Tabs */}
        <nav className="flex flex-wrap gap-2 mt-6" aria-label="Categorías de papers">
          <button
            onClick={() => handleCategoryChange('')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedCategory === ''
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
            aria-pressed={selectedCategory === ''}
          >
            Todos
          </button>
          {categoryButtons.map(([slug, name]) => (
            <button
              key={slug}
              onClick={() => handleCategoryChange(slug)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === slug
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
              aria-pressed={selectedCategory === slug}
            >
              {name}
            </button>
          ))}
        </nav>
      </section>

      {/* Papers Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-12" id="papers-list">
        {loading ? (
          <div className="flex items-center justify-center py-20" role="status" aria-label="Cargando papers">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" aria-hidden="true" />
            <span className="ml-3 text-gray-400">Cargando papers...</span>
          </div>
        ) : error ? (
          <div className="text-center py-20" role="alert">
            <p className="text-red-400 mb-4">{error}</p>
            <button
              onClick={fetchPapers}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Reintentar
            </button>
          </div>
        ) : papers.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" aria-hidden="true" />
            <p>No se encontraron papers para esta búsqueda</p>
          </div>
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2" role="list" aria-label="Lista de papers">
              {papers.map((paper, index) => (
                <article
                  key={paper.id}
                  onClick={() => setSelectedPaper(paper)}
                  onKeyDown={(e: React.KeyboardEvent) => e.key === 'Enter' && setSelectedPaper(paper)}
                  tabIndex={0}
                  role="listitem"
                  style={{ animationDelay: `${Math.min(index * 30, 300)}ms` }}
                  className="group p-6 bg-gray-800/40 backdrop-blur border border-gray-700/50 rounded-2xl hover:border-blue-500/50 hover:bg-gray-800/60 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 animate-slide-up"
                  aria-label={`Paper: ${paper.title}`}
                >
                  <div className="flex flex-wrap gap-2 mb-3">
                    {/* Display High-Level Blog Categories First */}
                    {getPaperBlogCategories(paper.categories).map((blogCat) => (
                      <span
                        key={blogCat}
                        className="px-2 py-0.5 text-xs font-bold bg-purple-500/20 text-purple-300 rounded-full border border-purple-500/30"
                      >
                        {blogCat}
                      </span>
                    ))}
                    
                    {/* Display Technical ArXiv Categories */}
                    {paper.categories.slice(0, 3).map((cat) => (
                      <span
                        key={cat}
                        className="px-2 py-0.5 text-xs font-medium bg-blue-500/20 text-blue-300 rounded-full"
                      >
                        {ARXIV_CATEGORY_NAMES[cat] || cat}
                      </span>
                    ))}
                  </div>

                  <h2 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-300 transition-colors line-clamp-2">
                    {paper.title}
                  </h2>

                  <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                    <Users className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                    <span className="truncate">
                      {paper.authors.slice(0, 3).join(', ')}
                      {paper.authors.length > 3 && ` et al.`}
                    </span>
                  </div>

                  <p className="text-sm text-gray-400 mb-4 line-clamp-3">
                    {truncateText(paper.abstract, 200)}
                  </p>

                  <div className="flex items-center justify-between">
                    <time 
                      dateTime={paper.published}
                      className="text-xs text-gray-500 flex items-center gap-1"
                    >
                      <Calendar className="w-3 h-3" aria-hidden="true" />
                      {formatDateSafe(paper.published)}
                    </time>
                    <div className="flex gap-2">
                      <a
                        href={paper.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e: React.MouseEvent) => e.stopPropagation()}
                        className="p-2 bg-gray-700/50 hover:bg-red-600/20 hover:text-red-400 rounded-lg transition-colors"
                        aria-label={`Ver PDF de ${paper.title}`}
                      >
                        <FileText className="w-4 h-4" aria-hidden="true" />
                      </a>
                      <a
                        href={paper.arxivUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e: React.MouseEvent) => e.stopPropagation()}
                        className="p-2 bg-gray-700/50 hover:bg-blue-600/20 hover:text-blue-400 rounded-lg transition-colors"
                        aria-label={`Ver en ArXiv: ${paper.title}`}
                      >
                        <ExternalLink className="w-4 h-4" aria-hidden="true" />
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <nav className="flex items-center justify-center gap-4 mt-8" aria-label="Paginación">
                <button
                  onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                  aria-label="Página anterior"
                >
                  <ChevronLeft className="w-4 h-4" aria-hidden="true" />
                  Anterior
                </button>
                <span className="text-gray-400" aria-current="page">
                  Página {currentPage + 1} de {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                  disabled={currentPage >= totalPages - 1}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
                  aria-label="Página siguiente"
                >
                  Siguiente
                  <ChevronRight className="w-4 h-4" aria-hidden="true" />
                </button>
              </nav>
            )}
          </>
        )}
      </div>

      {/* Paper Modal */}
      {selectedPaper && (
        <div
          onClick={() => setSelectedPaper(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            className="relative max-w-3xl w-full max-h-[90vh] overflow-y-auto bg-gray-900 border border-gray-700 rounded-2xl p-6 animate-scale-in"
          >
            <button
              onClick={() => setSelectedPaper(null)}
              className="absolute top-4 right-4 p-2 hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Cerrar modal"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>

            <div className="flex flex-wrap gap-2 mb-4">
              {selectedPaper.categories.map((cat) => (
                <span
                  key={cat}
                  className="px-3 py-1 text-sm font-medium bg-blue-500/20 text-blue-300 rounded-full"
                >
                  {ARXIV_CATEGORY_NAMES[cat] || cat}
                </span>
              ))}
            </div>

            <h2 id="modal-title" className="text-2xl font-bold text-white mb-4">
              {selectedPaper.title}
            </h2>

            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-400 mb-2">Autores</h3>
              <p className="text-gray-300">
                {selectedPaper.authors.join(', ')}
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-400 mb-2">Abstract</h3>
              <p className="text-gray-300 leading-relaxed">
                {selectedPaper.abstract}
              </p>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-400 mb-6">
              <time dateTime={selectedPaper.published} className="flex items-center gap-1">
                <Calendar className="w-4 h-4" aria-hidden="true" />
                Publicado: {formatDateSafe(selectedPaper.published)}
              </time>
              {selectedPaper.updated !== selectedPaper.published && (
                <time dateTime={selectedPaper.updated} className="flex items-center gap-1">
                  Actualizado: {formatDateSafe(selectedPaper.updated)}
                </time>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href={selectedPaper.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 rounded-xl font-medium transition-colors"
              >
                <FileText className="w-5 h-5" aria-hidden="true" />
                Ver PDF
              </a>
              <a
                href={selectedPaper.arxivUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-medium transition-colors"
              >
                <ExternalLink className="w-5 h-5" aria-hidden="true" />
                Ver en ArXiv
              </a>
              {selectedPaper.doi && (
                <a
                  href={`https://doi.org/${selectedPaper.doi}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl font-medium transition-colors"
                >
                  DOI
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slide-up {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes scale-in {
          from { 
            opacity: 0;
            transform: scale(0.9);
          }
          to { 
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
        
        .animate-fade-in-delay {
          animation: fade-in 0.5s ease-out 0.1s forwards;
          opacity: 0;
        }
        
        .animate-fade-in-delay-2 {
          animation: fade-in 0.5s ease-out 0.2s forwards;
          opacity: 0;
        }
        
        .animate-slide-up {
          animation: slide-up 0.4s ease-out forwards;
          opacity: 0;
        }
        
        .animate-scale-in {
          animation: scale-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
