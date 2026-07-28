"use client";

import Link from "next/link";
import { Space_Grotesk, Noto_Sans } from "next/font/google";
import dynamic from "next/dynamic";
import React from "react";

// Types for note search results
interface Note {
  id: string;
  code: string;
  studentName?: string | null;
  course: string;
  university: string;
  grade: number;
}

interface SearchResult {
  found?: boolean;
  count?: number;
  notes: Note[];
  note?: Note; // Single note result for code lookup
}

const UploadNotesComponent = dynamic(() => import("./UploadNotes"), {
  ssr: false,
});

// TODO: Move metadata to layout.tsx file

const space = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-space-grotesk",
});

const noto = Noto_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-noto-sans",
});

import { usePortalTheme } from "@/lib/hooks/usePortalTheme";

// Types for note search results
// ... existing types ...

export default function ConsultaNotaIAPage() {
  const theme = usePortalTheme();
  const [universities, setUniversities] = React.useState<string[]>([]);
  const [courses, setCourses] = React.useState<string[]>([]);
  const [university, setUniversity] = React.useState<string>("");
  const [course, setCourse] = React.useState<string>("");
  const [code, setCode] = React.useState<string>("");
  const [result, setResult] = React.useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isLoadingUniversities, setIsLoadingUniversities] =
    React.useState(true);
  const [isLoadingCourses, setIsLoadingCourses] = React.useState(false);
  const [error, setError] = React.useState<string>("");

  React.useEffect(() => {
    setIsLoadingUniversities(true);
    fetch("/api/notes")
      .then((r) => r.json())
      .then((data) => {
        setUniversities(data.universities || []);
        setError("");
      })
      .catch((err) => {
        console.error("Error loading universities:", err);
        setUniversities([]);
        setError("Error cargando universidades");
      })
      .finally(() => setIsLoadingUniversities(false));
  }, []);

  React.useEffect(() => {
    if (!university) {
      setCourses([]);
      return;
    }
    setIsLoadingCourses(true);
    fetch(`/api/notes?university=${encodeURIComponent(university)}`)
      .then((r) => r.json())
      .then((data) => {
        setCourses(data.courses || []);
        setError("");
      })
      .catch((err) => {
        console.error("Error loading courses:", err);
        setCourses([]);
        setError("Error cargando cursos");
      })
      .finally(() => setIsLoadingCourses(false));
  }, [university]);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!code && !university) {
      setError(
        "Debes seleccionar al menos una universidad o ingresar un código",
      );
      return;
    }

    setIsLoading(true);
    setError("");
    setResult(null);

    try {
      const params = new URLSearchParams();
      if (university) params.set("university", university);
      if (course) params.set("course", course);
      if (code) params.set("code", code);

      const res = await fetch("/api/notes?" + params.toString());
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Error consultando notas");
      }

      setResult(json);

      if (code && !json.found) {
        setError("No se encontró ninguna nota con ese código");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error consultando notas";
      console.error("Search error:", err);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setUniversity("");
    setCourse("");
    setCode("");
    setResult(null);
    setError("");
  };

  return (
    <div
      className={`${space.variable} ${noto.variable} min-h-screen ${theme.isAmbiental ? 'bg-gradient-to-br from-slate-50 to-blue-50 text-gray-800' : 'bg-[#000000] text-white'}`}
    >
      {/* Design System */}
      <style jsx global>{`
        :root {
          --primary-cyan: ${theme.isAmbiental ? '#0077B6' : '#00efff'};
          --accent-purple: ${theme.isAmbiental ? '#10B981' : '#8b5cf6'};
          --accent-pink: #ec4899;
          --deep-blue: ${theme.isAmbiental ? '#ffffff' : '#000000'};
          --panel-bg: ${theme.isAmbiental ? '#ffffff' : '#10111a'};
          --text-primary: ${theme.isAmbiental ? '#0D161C' : '#ffffff'};
          --text-secondary: ${theme.isAmbiental ? '#4b5563' : '#cccccc'};
          --border-color: ${theme.isAmbiental ? 'rgba(0, 119, 182, 0.2)' : 'rgba(0, 239, 255, 0.1)'};
        }

        .container-app {
          background: ${theme.isAmbiental ? '#ffffff' : 'linear-gradient(145deg, var(--panel-bg) 0%, var(--deep-blue) 100%)'};
          border: 1px solid var(--border-color);
          border-radius: 16px;
          padding: 2rem;
          min-height: 600px;
          position: relative;
          overflow: hidden;
          box-shadow: ${theme.isAmbiental ? '0 10px 25px -5px rgba(0,0,0,0.05)' : 'none'};
        }

        .container-app::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: ${theme.isAmbiental 
            ? 'radial-gradient(circle at 20% 20%, rgba(0, 119, 182, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(16, 185, 129, 0.05) 0%, transparent 50%)'
            : 'radial-gradient(circle at 20% 20%, rgba(139, 92, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(0, 239, 255, 0.1) 0%, transparent 50%)'};
          pointer-events: none;
        }

        .app-content {
          position: relative;
          z-index: 1;
        }
      `}</style>

      <main className="px-4 md:px-8 py-6 md:py-10">
        <div className="mx-auto max-w-7xl">
          {/* Breadcrumbs */}
          <nav className="mb-8">
            <ol className="flex items-center space-x-2 text-sm">
              <li>
                <Link
                  href={theme.portalBase}
                  className="text-[var(--text-secondary)] hover:text-[var(--primary-cyan)]"
                >
                  {theme.isAmbiental ? 'Portal Ambiental' : 'Portal IA'}
                </Link>
              </li>
              <ChevronRight className="w-4 h-4 text-[var(--text-secondary)]" />
              <li>
                <Link
                  href={`${theme.portalBase}/autor`}
                  className="text-[var(--text-secondary)] hover:text-[var(--primary-cyan)]"
                >
                  Pablo Cubides
                </Link>
              </li>
              <ChevronRight className="w-4 h-4 text-[var(--text-secondary)]" />
              <li>
                <span className="text-[var(--primary-cyan)]">
                  Consulta tu Nota
                </span>
              </li>
            </ol>
          </nav>

          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-auto h-60 justify-center">
                <img
                  src="/images/portal-ia/autor/consulta-nota.png"
                  alt="Consulta tu Nota"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
              Revisa tus calificaciones, progreso y retroalimentación de
              productos de IA y programación de manera rápida y organizada.
            </p>
          </div>

          {/* App Container */}
          <div className="container-app mb-12">
            <div className="app-content">
              <form onSubmit={handleSearch} className="max-w-3xl mx-auto py-8">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Universidad
                    </label>
                    <select
                      value={university}
                      onChange={(e) => {
                        setUniversity(e.target.value);
                        setCourse(""); // Reset course when university changes
                      }}
                      disabled={isLoadingUniversities || isLoading}
                      className="w-full p-3 bg-black/40 border border-[var(--border-color)] rounded disabled:opacity-50"
                    >
                      <option value="">
                        {isLoadingUniversities
                          ? "Cargando..."
                          : "Selecciona Universidad"}
                      </option>
                      {universities.map((u) => (
                        <option key={u} value={u}>
                          {u}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Curso
                    </label>
                    <select
                      value={course}
                      onChange={(e) => setCourse(e.target.value)}
                      disabled={!university || isLoadingCourses || isLoading}
                      className="w-full p-3 bg-black/40 border border-[var(--border-color)] rounded disabled:opacity-50"
                    >
                      <option value="">
                        {isLoadingCourses ? "Cargando..." : "Selecciona Curso"}
                      </option>
                      {courses.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Código Estudiante
                    </label>
                    <input
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="Ej: 1234567"
                      disabled={isLoading}
                      className="w-full p-3 bg-black/40 border border-[var(--border-color)] rounded disabled:opacity-50"
                    />
                  </div>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <div className="flex gap-3 justify-center">
                  <button
                    type="submit"
                    disabled={isLoading || (!code && !university)}
                    className="px-6 py-3 bg-gradient-to-r from-[var(--primary-cyan)] to-[var(--accent-purple)] text-white font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Consultando...
                      </>
                    ) : (
                      "Consultar"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleReset}
                    disabled={isLoading}
                    className="px-6 py-3 border border-[var(--border-color)] text-[var(--text-primary)] font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Reiniciar
                  </button>
                </div>
              </form>

              <div className="max-w-3xl mx-auto mt-8">
                {result?.note ? (
                  <div className="p-6 bg-gradient-to-br from-green-500/10 to-blue-500/10 border border-green-500/30 rounded-lg">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-6 h-6 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-lg mb-3 text-green-400">
                          Nota Encontrada
                        </h4>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-[var(--text-secondary)]">
                              Universidad:
                            </span>
                            <div className="font-medium">
                              {result.note.university}
                            </div>
                          </div>
                          <div>
                            <span className="text-[var(--text-secondary)]">
                              Curso:
                            </span>
                            <div className="font-medium">
                              {result.note.course}
                            </div>
                          </div>
                          <div>
                            <span className="text-[var(--text-secondary)]">
                              Código:
                            </span>
                            <div className="font-medium">
                              {result.note.code}
                            </div>
                          </div>
                          <div>
                            <span className="text-[var(--text-secondary)]">
                              Estudiante:
                            </span>
                            <div className="font-medium">
                              {result.note.studentName || "No especificado"}
                            </div>
                          </div>
                        </div>
                        <div className="mt-4 p-4 bg-black/30 rounded-lg">
                          <div className="text-[var(--text-secondary)] text-sm mb-1">
                            Calificación
                          </div>
                          <div className="text-3xl font-bold text-[var(--primary-cyan)]">
                            {result.note.grade.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : result?.notes && result.notes.length > 0 ? (
                  <div>
                    <h4 className="font-bold mb-4 flex items-center gap-2">
                      <span>
                        Resultados ({result.count || result.notes.length})
                      </span>
                    </h4>
                    <div className="grid gap-3 max-h-96 overflow-y-auto">
                      {result.notes.map((n: Note) => (
                        <div
                          key={n.id}
                          className="p-4 bg-black/20 border border-[var(--border-color)] rounded-lg hover:border-[var(--primary-cyan)] transition-colors"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="font-semibold text-lg mb-1">
                                {n.code}{" "}
                                {n.studentName ? `— ${n.studentName}` : ""}
                              </div>
                              <div className="text-sm text-[var(--text-secondary)]">
                                {n.course} • {n.university}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-[var(--primary-cyan)]">
                                {n.grade.toFixed(2)}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : result !== null ? (
                  <div className="text-center p-8 bg-black/20 border border-[var(--border-color)] rounded-lg">
                    <svg
                      className="w-16 h-16 mx-auto mb-4 text-[var(--text-secondary)]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-[var(--text-secondary)]">
                      No se encontraron resultados
                    </p>
                    <p className="text-sm text-[var(--text-secondary)] mt-2">
                      Intenta con otros filtros de búsqueda
                    </p>
                  </div>
                ) : (
                  <div className="text-center p-8 bg-black/20 border border-[var(--border-color)] rounded-lg">
                    <svg
                      className="w-16 h-16 mx-auto mb-4 text-[var(--text-secondary)]"
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
                    <p className="text-[var(--text-secondary)]">
                      Selecciona una universidad y/o ingresa un código para
                      consultar
                    </p>
                  </div>
                )}
              </div>

              {/* Admin upload component */}
              <div className="max-w-3xl mx-auto mt-8">
                <UploadNotesComponent />
              </div>
            </div>
          </div>

          {/* Features Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-gradient-to-r from-[var(--primary-cyan)] to-[var(--accent-purple)] flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Historial Completo</h3>
              <p className="text-[var(--text-secondary)] text-sm">
                Accede a todas tus calificaciones históricas organizadas por
                producto y fecha
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-gradient-to-r from-[var(--accent-purple)] to-[var(--accent-pink)] flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                Estadísticas Detalladas
              </h3>
              <p className="text-[var(--text-secondary)] text-sm">
                Visualiza tu progreso con gráficos y métricas de rendimiento
                académico
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-gradient-to-r from-[var(--accent-pink)] to-[var(--primary-cyan)] flex items-center justify-center">
                <Download className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Exportar Reportes</h3>
              <p className="text-[var(--text-secondary)] text-sm">
                Descarga reportes en PDF con tus calificaciones y certificados
              </p>
            </div>
          </div>

          {/* Related Tools */}
          <div className="bg-[var(--panel-bg)] rounded-2xl p-8 border border-[var(--border-color)]">
            <h3 className="text-xl font-bold mb-6">
              Otras Herramientas Estudiantiles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link
                href="/ia/autor/herramientas/ruleta-preguntas"
                className="flex items-center gap-4 p-4 rounded-lg border border-[var(--border-color)] hover:border-[var(--accent-purple)] transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-[var(--accent-purple)] to-[var(--accent-pink)] flex items-center justify-center">
                  <RotateCcw className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold group-hover:text-[var(--accent-purple)]">
                    Ruleta de Preguntas
                  </h4>
                  <p className="text-sm text-[var(--text-secondary)]">
                    Practica con preguntas aleatorias
                  </p>
                </div>
              </Link>
              <Link
                href="/ia/autor/herramientas/analisis-correlaciones"
                className="flex items-center gap-4 p-4 rounded-lg border border-[var(--border-color)] hover:border-[var(--accent-pink)] transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-[var(--accent-pink)] to-[var(--primary-cyan)] flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold group-hover:text-[var(--accent-pink)]">
                    Análisis de Correlaciones
                  </h4>
                  <p className="text-sm text-[var(--text-secondary)]">
                    Visualiza datos y estadísticas
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* Icons */
function ChevronRight(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707A1 1 0 118.707 5.293l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" />
    </svg>
  );
}

function BarChart3(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M3 3v18h18" />
      <path d="M18 17V9" />
      <path d="M13 17V5" />
      <path d="M8 17v-3" />
    </svg>
  );
}

function TrendingUp(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6h-6z" />
    </svg>
  );
}

function Download(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7,10 12,15 17,10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
}

function RotateCcw(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M1 4v6h6" />
      <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
    </svg>
  );
}
