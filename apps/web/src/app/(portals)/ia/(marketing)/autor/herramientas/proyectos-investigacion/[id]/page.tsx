"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePortalTheme } from "@/lib/hooks/usePortalTheme";
import { ResearchProject } from "@/lib/services/projects-store";

export default function FichaProyectoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const theme = usePortalTheme();
  const [project, setProject] = useState<ResearchProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Application Form State
  const [showForm, setShowForm] = useState(false);
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [programa, setPrograma] = useState("");
  const [fechaReunion, setFechaReunion] = useState("");
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    fetch(`/api/projects/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Proyecto no encontrado");
        return res.json();
      })
      .then((data) => setProject(data))
      .catch((err) => setError(err.message || "Error al cargar la ficha"))
      .finally(() => setLoading(false));
  }, [id]);

  const pabloEmail = process.env.NEXT_PUBLIC_PABLO_EMAIL || "pacubidesg@gmail.com";

  const handleGenerateOutlookDraft = (e: React.FormEvent) => {
    e.preventDefault();
    if (!project || !nombre || !correo || !programa || !fechaReunion) return;

    const subject = `Proyecto: ${project.titulo} — ${nombre}`;
    const bodyText = `Proyecto seleccionado: ${project.titulo}

Nombre: ${nombre}
Correo: ${correo}
Programa y semestre: ${programa}
Fecha propuesta para reunirnos: ${fechaReunion}

Mensaje:
${mensaje || "Sin mensaje adicional"}`;

    const outlookUrl = `https://outlook.office.com/mail/deeplink/compose?to=${encodeURIComponent(
      pabloEmail
    )}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;

    // Open Outlook Web in new tab
    window.open(outlookUrl, "_blank");
  };

  const mailtoUrl = project
    ? `mailto:${pabloEmail}?subject=${encodeURIComponent(
        `Proyecto: ${project.titulo} — ${nombre || "Estudiante"}`
      )}&body=${encodeURIComponent(
        `Proyecto seleccionado: ${project.titulo}\n\nNombre: ${nombre}\nCorreo: ${correo}\nPrograma: ${programa}\nFecha propuesta: ${fechaReunion}\n\nMensaje:\n${mensaje}`
      )}`
    : "#";

  if (loading) {
    return (
      <div className={`min-h-screen ${theme.bgMain} flex flex-col items-center justify-center`}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0077B6] mb-4"></div>
        <p className={theme.textSecondary}>Cargando ficha del proyecto...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className={`min-h-screen ${theme.bgMain} py-16 px-4 flex flex-col items-center justify-center text-center`}>
        <div className="text-6xl mb-4">🔍</div>
        <h2 className={`text-2xl font-bold ${theme.textPrimary} mb-2`}>
          {error || "Proyecto no encontrado"}
        </h2>
        <p className={`${theme.textSecondary} mb-6 max-w-md`}>
          El proyecto consultado no existe o no está disponible en este momento.
        </p>
        <button
          onClick={() => router.push(`${theme.portalBase}/autor/herramientas/proyectos-investigacion`)}
          className={`px-6 py-3 rounded-xl font-semibold ${theme.btnPrimary}`}
        >
          ← Volver a la Vitrina de Proyectos
        </button>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme.bgMain} py-10 px-4 md:px-8 transition-colors duration-300`}>
      <div className="max-w-4xl mx-auto">
        {/* Navigation Breadcrumbs */}
        <nav className="mb-6">
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
            <li>
              <Link href={`${theme.portalBase}/autor/herramientas/proyectos-investigacion`} className={`${theme.textSecondary} hover:${theme.textAccent}`}>
                Proyectos de Investigación
              </Link>
            </li>
            <li className={theme.textSecondary}>/</li>
            <li className={`font-semibold ${theme.textAccent} truncate max-w-xs`}>{project.titulo}</li>
          </ol>
        </nav>

        {/* Back Link */}
        <button
          onClick={() => router.push(`${theme.portalBase}/autor/herramientas/proyectos-investigacion`)}
          className={`mb-6 text-sm font-semibold ${theme.textAccent} hover:underline flex items-center gap-1`}
        >
          ← Volver al Catálogo
        </button>

        {/* Main Ficha Card */}
        <div className={`${theme.bgCard} rounded-2xl p-6 md:p-10 border ${theme.borderCard} shadow-xl mb-8`}>
          {/* Header info */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${theme.isAmbiental ? 'bg-emerald-100 text-[#10B981]' : 'bg-cyan-900/60 text-cyan-300'}`}>
              {project.linea}
            </span>
            <div className="flex items-center gap-3 text-xs">
              <span className={`font-medium ${theme.textSecondary} capitalize`}>Nivel: <strong>{project.nivel}</strong></span>
              <span className={`font-medium ${theme.textSecondary}`}>Entregable: <strong>{project.entregable}</strong></span>
            </div>
          </div>

          <h1 className={`text-2xl md:text-4xl font-bold ${theme.textPrimary} mb-6 leading-tight`}>
            {project.titulo}
          </h1>

          {/* Resumen */}
          <div className="mb-8">
            <h3 className={`text-sm font-semibold uppercase tracking-wider ${theme.textSecondary} mb-2`}>
              Descripción del proyecto
            </h3>
            <p className={`${theme.textPrimary} text-base md:text-lg leading-relaxed`}>
              {project.resumen}
            </p>
          </div>

          {/* Destacados (Qué lograrás + Por qué importa) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {project.que_lograras && (
              <div className={`p-4 rounded-xl ${theme.isAmbiental ? 'bg-blue-50 border-blue-200' : 'bg-cyan-950/40 border-cyan-900'} border`}>
                <h4 className={`font-bold text-sm ${theme.isAmbiental ? 'text-[#0077B6]' : 'text-cyan-400'} mb-1 flex items-center gap-1.5`}>
                  <span>🎯</span> Qué lograrás
                </h4>
                <p className={`${theme.textPrimary} text-sm`}>{project.que_lograras}</p>
              </div>
            )}

            {project.por_que_importa && (
              <div className={`p-4 rounded-xl ${theme.isAmbiental ? 'bg-emerald-50 border-emerald-200' : 'bg-emerald-950/40 border-emerald-900'} border`}>
                <h4 className={`font-bold text-sm ${theme.isAmbiental ? 'text-[#10B981]' : 'text-emerald-400'} mb-1 flex items-center gap-1.5`}>
                  <span>💡</span> Por qué importa
                </h4>
                <p className={`${theme.textPrimary} text-sm`}>{project.por_que_importa}</p>
              </div>
            )}
          </div>

          {/* Objetivos */}
          {project.objetivos && project.objetivos.length > 0 && (
            <div className="mb-8">
              <h3 className={`text-sm font-semibold uppercase tracking-wider ${theme.textSecondary} mb-3`}>
                Objetivos del proyecto
              </h3>
              <ul className="space-y-2.5">
                {project.objetivos.map((obj, idx) => (
                  <li key={idx} className={`flex items-start gap-3 text-sm ${theme.textPrimary}`}>
                    <span className={`flex-shrink-0 w-6 h-6 rounded-full ${theme.isAmbiental ? 'bg-blue-100 text-[#0077B6]' : 'bg-cyan-900 text-cyan-300'} font-bold text-xs flex items-center justify-center mt-0.5`}>
                      {idx + 1}
                    </span>
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Plan de Trabajo */}
          {project.plan_trabajo && project.plan_trabajo.length > 0 && (
            <div className="mb-8">
              <h3 className={`text-sm font-semibold uppercase tracking-wider ${theme.textSecondary} mb-3`}>
                Plan de Trabajo Sugerido
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {project.plan_trabajo.map((paso, idx) => (
                  <div key={idx} className={`p-3.5 rounded-xl ${theme.isAmbiental ? 'bg-slate-100 border-gray-200' : 'bg-gray-900/60 border-gray-700'} border text-sm flex gap-3 items-center`}>
                    <span className="text-[#10B981] font-bold">✓</span>
                    <span className={theme.textPrimary}>{paso}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Prerrequisitos */}
          <div className={`p-4 rounded-xl ${theme.isAmbiental ? 'bg-gray-100' : 'bg-gray-900'} mb-8 flex flex-wrap justify-between items-center text-sm gap-2`}>
            <span className={theme.textSecondary}>Prerrequisitos recomendados:</span>
            <span className={`font-semibold ${theme.textPrimary}`}>{project.prerrequisitos || "Ninguno"}</span>
          </div>

          {/* CTA Select Button */}
          {!showForm && (
            <div className="text-center pt-4">
              <button
                onClick={() => setShowForm(true)}
                className={`w-full md:w-auto px-8 py-4 rounded-xl text-lg font-bold ${theme.btnPrimary} shadow-lg transition-transform hover:scale-[1.02]`}
              >
                🤝 Elegir este proyecto de investigación
              </button>
            </div>
          )}
        </div>

        {/* Application Form Drawer / Section */}
        {showForm && (
          <div className={`${theme.bgCard} rounded-2xl p-6 md:p-8 border-2 ${theme.isAmbiental ? 'border-[#0077B6]' : 'border-cyan-500'} shadow-2xl transition-all animate-in fade-in`}>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className={`text-xl font-bold ${theme.textPrimary}`}>
                  Postularse al Proyecto
                </h3>
                <p className={`${theme.textSecondary} text-sm`}>
                  Completa tus datos para estructurar la solicitud y agendar una reunión con el profesor Pablo Cubides.
                </p>
              </div>
              <button
                onClick={() => setShowForm(false)}
                className={`${theme.textSecondary} hover:${theme.textPrimary} text-sm font-semibold`}
              >
                ✕ Cancelar
              </button>
            </div>

            <form onSubmit={handleGenerateOutlookDraft} className="space-y-4">
              <div>
                <label className={`block text-xs font-semibold uppercase ${theme.textSecondary} mb-1`}>
                  Proyecto Seleccionado (Fijo)
                </label>
                <input
                  type="text"
                  readOnly
                  value={project.titulo}
                  className={`w-full p-3 rounded-lg ${theme.isAmbiental ? 'bg-gray-100 text-gray-700' : 'bg-gray-900 text-gray-400'} text-sm font-medium border border-gray-300/30 cursor-not-allowed`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-semibold uppercase ${theme.textSecondary} mb-1`}>
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ej. María Fernanda Pérez"
                    className={`w-full p-3 rounded-lg ${theme.bgInput} text-sm border focus:outline-none`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-semibold uppercase ${theme.textSecondary} mb-1`}>
                    Correo Institucional *
                  </label>
                  <input
                    type="email"
                    required
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                    placeholder="ejemplo@universidad.edu.co"
                    className={`w-full p-3 rounded-lg ${theme.bgInput} text-sm border focus:outline-none`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={`block text-xs font-semibold uppercase ${theme.textSecondary} mb-1`}>
                    Programa y Semestre *
                  </label>
                  <input
                    type="text"
                    required
                    value={programa}
                    onChange={(e) => setPrograma(e.target.value)}
                    placeholder="Ej. Ing. Ambiental - 8° Semestre"
                    className={`w-full p-3 rounded-lg ${theme.bgInput} text-sm border focus:outline-none`}
                  />
                </div>

                <div>
                  <label className={`block text-xs font-semibold uppercase ${theme.textSecondary} mb-1`}>
                    Fecha propuesta para reunión *
                  </label>
                  <input
                    type="date"
                    required
                    value={fechaReunion}
                    onChange={(e) => setFechaReunion(e.target.value)}
                    className={`w-full p-3 rounded-lg ${theme.bgInput} text-sm border focus:outline-none`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-xs font-semibold uppercase ${theme.textSecondary} mb-1`}>
                  Mensaje adicional / Motivación (Opcional)
                </label>
                <textarea
                  rows={3}
                  value={mensaje}
                  onChange={(e) => setMensaje(e.target.value)}
                  placeholder="Cuéntale brevemente a Pablo tu interés o disponibilidad de horario..."
                  className={`w-full p-3 rounded-lg ${theme.bgInput} text-sm border focus:outline-none`}
                />
              </div>

              <div className="pt-4 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  className={`flex-1 py-4 px-6 rounded-xl font-bold text-base ${theme.btnPrimary} flex items-center justify-center gap-2 shadow-lg`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 002-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Generar borrador en Outlook
                </button>

                <a
                  href={mailtoUrl}
                  className={`py-4 px-6 rounded-xl font-semibold text-sm ${theme.btnSecondary} text-center flex items-center justify-center`}
                >
                  Abrir con otro correo (mailto)
                </a>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
