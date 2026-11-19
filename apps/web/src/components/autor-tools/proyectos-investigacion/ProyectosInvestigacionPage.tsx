"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePortalTheme } from "@/lib/hooks/usePortalTheme";
import { ResearchProject } from "@/lib/services/projects-store";

export default function ProyectosInvestigacionPage() {
  const theme = usePortalTheme();
  const [projects, setProjects] = useState<ResearchProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLinea, setSelectedLinea] = useState<string>("todas");

  useEffect(() => {
    fetch("/api/projects?publicOnly=true")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProjects(data);
        }
      })
      .catch((err) => console.error("Error fetching public projects:", err))
      .finally(() => setLoading(false));
  }, []);

  const lineas = Array.from(new Set(projects.map((p) => p.linea)));

  const filteredProjects = projects.filter((p) => {
    if (selectedLinea === "todas") return true;
    return p.linea.toLowerCase() === selectedLinea.toLowerCase();
  });

  return (
    <div className={`min-h-screen ${theme.bgMain} py-10 px-4 md:px-8 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto">
        {/* Navigation Breadcrumbs */}
        <nav className="mb-6 flex justify-between items-center">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link href={theme.portalBase} className={`${theme.textSecondary} hover:${theme.textAccent}`}>
                {theme.isAmbiental ? "Portal Ambiental" : "Portal IA"}
              </Link>
            </li>
            <li className={theme.textSecondary}>/</li>
            <li>
              <Link href={`${theme.portalBase}/autor`} className={`${theme.textSecondary} hover:${theme.textAccent}`}>
                Pablo Cubides
              </Link>
            </li>
            <li className={theme.textSecondary}>/</li>
            <li className={`font-semibold ${theme.textAccent}`}>Proyectos de Investigación</li>
          </ol>

          <Link
            href={`${theme.portalBase}/autor/herramientas/proyectos-investigacion/admin`}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium border ${theme.borderCard} ${theme.textSecondary} hover:${theme.textAccent} transition-colors`}
          >
            🔒 Panel Admin
          </Link>
        </nav>

        {/* Hero Header */}
        <div className="text-center mb-12 max-w-3xl mx-auto">
          <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full mb-3 ${theme.isAmbiental ? 'bg-blue-100 text-[#0077B6]' : 'bg-cyan-950 text-cyan-400 border border-cyan-800'}`}>
            Cupos Abiertos de Investigación
          </span>
          <h1 className={`text-3xl md:text-5xl font-bold ${theme.textPrimary} mb-4`}>
            Vitrina de Proyectos de Investigación
          </h1>
          <p className={`${theme.textSecondary} text-base md:text-lg`}>
            Explora los trabajos de grado y proyectos abiertos en las líneas de tratamiento de agua, gestión ambiental, biocarbón e inteligencia artificial.
          </p>
        </div>

        {/* Linea Filter Pills */}
        {!loading && lineas.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            <button
              onClick={() => setSelectedLinea("todas")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedLinea === "todas"
                  ? theme.btnPrimary
                  : `${theme.bgCard} ${theme.textSecondary} hover:border-[#0077B6]`
              }`}
            >
              Todas ({projects.length})
            </button>
            {lineas.map((linea) => {
              const count = projects.filter((p) => p.linea === linea).length;
              return (
                <button
                  key={linea}
                  onClick={() => setSelectedLinea(linea)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedLinea === linea
                      ? theme.btnPrimary
                      : `${theme.bgCard} ${theme.textSecondary} hover:border-[#0077B6]`
                  }`}
                >
                  {linea} ({count})
                </button>
              );
            })}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0077B6] mb-4"></div>
            <p className={theme.textSecondary}>Cargando proyectos disponibles...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredProjects.length === 0 && (
          <div className={`text-center py-16 px-4 ${theme.bgCard} rounded-2xl max-w-lg mx-auto`}>
            <div className="text-5xl mb-4">🔬</div>
            <h3 className={`text-xl font-bold ${theme.textPrimary} mb-2`}>
              No hay proyectos abiertos en esta línea
            </h3>
            <p className={`${theme.textSecondary} text-sm mb-6`}>
              Intenta seleccionando otra línea de investigación o vuelve a consultar pronto.
            </p>
            <button
              onClick={() => setSelectedLinea("todas")}
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm ${theme.btnPrimary}`}
            >
              Ver todos los proyectos
            </button>
          </div>
        )}

        {/* Projects Grid */}
        {!loading && filteredProjects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className={`${theme.bgCard} rounded-2xl p-6 flex flex-col justify-between transition-all hover:scale-[1.01]`}
              >
                <div>
                  <div className="flex justify-between items-start gap-2 mb-4">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${theme.isAmbiental ? 'bg-emerald-100 text-[#10B981]' : 'bg-cyan-900/60 text-cyan-300'}`}>
                      {project.linea}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-green-500/10 text-green-500 border border-green-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                      Abierto
                    </span>
                  </div>

                  <h3 className={`text-xl font-bold ${theme.textPrimary} mb-3 leading-snug`}>
                    {project.titulo}
                  </h3>

                  <p className={`${theme.textSecondary} text-sm mb-4 line-clamp-3 leading-relaxed`}>
                    {project.resumen}
                  </p>

                  {project.que_lograras && (
                    <div className={`p-3 rounded-xl mb-4 text-xs ${theme.isAmbiental ? 'bg-blue-50/60 text-[#0077B6]' : 'bg-gray-900/70 text-cyan-300'} border ${theme.borderCard}`}>
                      <strong className="block mb-1">🎯 Qué lograrás:</strong>
                      {project.que_lograras}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-gray-200/20 flex items-center justify-between mt-2">
                  <span className={`text-xs font-medium ${theme.textSecondary} capitalize`}>
                    Nivel: {project.nivel}
                  </span>
                  <Link
                    href={`${theme.portalBase}/autor/herramientas/proyectos-investigacion/${project.id}`}
                    className={`inline-flex items-center gap-1 text-sm font-bold ${theme.textAccent} hover:underline`}
                  >
                    Ver Ficha →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
