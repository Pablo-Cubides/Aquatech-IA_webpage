"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePortalTheme } from "@/lib/hooks/usePortalTheme";
import { ResearchProject, isStaleProject } from "@/lib/services/projects-store";

export default function AdminProyectosPage() {
  const theme = usePortalTheme();
  const [authenticated, setAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");

  const [projects, setProjects] = useState<ResearchProject[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("todos");
  const [searchTerm, setSearchTerm] = useState("");

  // Notification for newly unlocked projects
  const [unlockedAlert, setUnlockedAlert] = useState<ResearchProject[]>([]);

  // Edit / Create Modal state
  const [editingProject, setEditingProject] = useState<Partial<ResearchProject> | null>(null);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      if (Array.isArray(data)) {
        setProjects(data);
      }
    } catch (err) {
      console.error("Error loading projects:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    try {
      const res = await fetch("/api/projects/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: passwordInput }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAuthenticated(true);
        fetchProjects();
      } else {
        setAuthError(data.error || "Contraseña de administración incorrecta");
      }
    } catch {
      setAuthError("Error de conexión con el servidor");
    }
  };

  const handleUpdateStatus = async (
    id: string,
    newStatus: ResearchProject["estado"],
    estudianteName?: string | null
  ) => {
    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "updateStatus",
          estado: newStatus,
          estudiante: estudianteName !== undefined ? estudianteName : null,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.unlockedProjects && data.unlockedProjects.length > 0) {
          setUnlockedAlert(data.unlockedProjects);
        }
        fetchProjects();
      }
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject || !editingProject.titulo) return;

    try {
      const res = await fetch(
        editingProject.id ? `/api/projects/${editingProject.id}` : "/api/projects",
        {
          method: editingProject.id ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(editingProject),
        }
      );

      if (res.ok) {
        setEditingProject(null);
        fetchProjects();
      }
    } catch (err) {
      console.error("Error saving project:", err);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este cupo de proyecto?")) return;
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
      if (res.ok) fetchProjects();
    } catch (err) {
      console.error("Error deleting project:", err);
    }
  };

  // Gate check
  if (!authenticated) {
    return (
      <div className={`min-h-screen ${theme.bgMain} flex items-center justify-center py-12 px-4`}>
        <div className={`max-w-md w-full ${theme.bgCard} p-8 rounded-2xl border ${theme.borderCard} shadow-2xl text-center`}>
          <div className="text-5xl mb-4">🔐</div>
          <h2 className={`text-2xl font-bold ${theme.textPrimary} mb-2`}>
            Panel Privado del Profesor
          </h2>
          <p className={`${theme.textSecondary} text-sm mb-6`}>
            Ingresa la contraseña de administración para gestionar el estado de los proyectos y las aperturas automáticas.
          </p>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <input
              type="password"
              required
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Contraseña de administrador"
              className={`w-full p-3 rounded-xl ${theme.bgInput} text-center border focus:outline-none`}
            />

            {authError && <p className="text-red-500 text-xs font-semibold">{authError}</p>}

            <button
              type="submit"
              className={`w-full py-3 rounded-xl font-bold ${theme.btnPrimary}`}
            >
              Ingresar al Panel
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-gray-200/20">
            <Link href={`${theme.portalBase}/autor/herramientas/proyectos-investigacion`} className={`text-xs ${theme.textAccent} hover:underline`}>
              ← Volver a la vista pública de proyectos
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Calculate metrics
  const totalCount = projects.length;
  const abiertosCount = projects.filter((p) => p.estado === "abierto").length;
  const enDesarrolloCount = projects.filter((p) => p.estado === "en_desarrollo").length;
  const completadosCount = projects.filter((p) => p.estado === "completado").length;
  const bloqueadosCount = projects.filter((p) => p.estado === "bloqueado").length;
  const staleProjects = projects.filter(isStaleProject);

  const filteredProjects = projects.filter((p) => {
    if (filterStatus !== "todos" && p.estado !== filterStatus) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        p.titulo.toLowerCase().includes(term) ||
        p.linea.toLowerCase().includes(term) ||
        p.id.toLowerCase().includes(term)
      );
    }
    return true;
  });

  return (
    <div className={`min-h-screen ${theme.bgMain} py-10 px-4 md:px-8 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto">
        {/* Header Bar */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-green-500 bg-green-500/10 px-3 py-1 rounded-full">
              Autenticado como Pablo Cubides
            </span>
            <h1 className={`text-3xl font-bold ${theme.textPrimary} mt-2`}>
              Administración de Proyectos
            </h1>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() =>
                setEditingProject({
                  id: "",
                  titulo: "",
                  linea: "Tratamiento de agua",
                  familia: "A",
                  resumen: "",
                  que_lograras: "",
                  por_que_importa: "",
                  objetivos: [""],
                  plan_trabajo: [""],
                  entregable: "Trabajo de grado",
                  nivel: "introductorio",
                  prerrequisitos: "Ninguno",
                  estado: "abierto",
                  desbloquea: [],
                  complementa: [],
                  notas_admin: "",
                })
              }
              className={`px-4 py-2.5 rounded-xl font-bold text-sm ${theme.btnPrimary} flex items-center gap-1.5`}
            >
              ➕ Crear Nuevo Cupo
            </button>
            <Link
              href={`${theme.portalBase}/autor/herramientas/proyectos-investigacion`}
              className={`px-4 py-2.5 rounded-xl font-semibold text-sm ${theme.btnSecondary}`}
            >
              👁️ Ver Vista Estudiante
            </Link>
          </div>
        </div>

        {/* Newly Unlocked Alert Banner */}
        {unlockedAlert.length > 0 && (
          <div className="mb-8 p-4 rounded-2xl bg-emerald-500/15 border-2 border-emerald-500 text-emerald-400 flex justify-between items-start">
            <div>
              <h4 className="font-bold text-base flex items-center gap-2">
                <span>🎉</span> ¡Proyectos desbloqueados automáticamente!
              </h4>
              <p className="text-xs text-emerald-300 mt-1">
                Al completar el trabajo, el sistema abrió automáticamente los siguientes cupos dependientes:
              </p>
              <ul className="list-disc ml-5 text-xs text-emerald-200 mt-2 space-y-1">
                {unlockedAlert.map((u) => (
                  <li key={u.id}>
                    <strong>{u.titulo}</strong> ({u.linea}) — Estado actual: <span className="underline">Abierto</span>
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={() => setUnlockedAlert([])}
              className="text-emerald-400 font-bold text-sm px-2"
            >
              ✕
            </button>
          </div>
        )}

        {/* Summary Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
          <div className={`${theme.bgCard} p-4 rounded-xl text-center border ${theme.borderCard}`}>
            <span className={`text-2xl font-bold ${theme.textPrimary}`}>{totalCount}</span>
            <span className={`block text-xs ${theme.textSecondary}`}>Total Proyectos</span>
          </div>
          <div className={`${theme.bgCard} p-4 rounded-xl text-center border border-green-500/30`}>
            <span className="text-2xl font-bold text-green-500">{abiertosCount}</span>
            <span className={`block text-xs ${theme.textSecondary}`}>Abiertos</span>
          </div>
          <div className={`${theme.bgCard} p-4 rounded-xl text-center border border-amber-500/30`}>
            <span className="text-2xl font-bold text-amber-500">{enDesarrolloCount}</span>
            <span className={`block text-xs ${theme.textSecondary}`}>En Desarrollo</span>
          </div>
          <div className={`${theme.bgCard} p-4 rounded-xl text-center border border-blue-500/30`}>
            <span className="text-2xl font-bold text-blue-500">{completadosCount}</span>
            <span className={`block text-xs ${theme.textSecondary}`}>Completados</span>
          </div>
          <div className={`${theme.bgCard} p-4 rounded-xl text-center border border-gray-500/30`}>
            <span className="text-2xl font-bold text-gray-400">{bloqueadosCount}</span>
            <span className={`block text-xs ${theme.textSecondary}`}>Bloqueados</span>
          </div>
        </div>

        {/* Section: Por Revisar (Stale Projects > 2 years) */}
        {staleProjects.length > 0 && (
          <div className="mb-8 p-6 rounded-2xl bg-amber-500/10 border-2 border-amber-500/40">
            <h3 className="font-bold text-amber-400 text-lg flex items-center gap-2 mb-2">
              <span>⚠️</span> Proyectos por revisar (Abiertos &gt; 2 años sin asignación)
            </h3>
            <p className={`text-xs ${theme.textSecondary} mb-4`}>
              Estos proyectos llevan más de 2 años abiertos. Considera actualizar su resumen, darles un enfoque más llamativo o cambiar sus prerrequisitos:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {staleProjects.map((stale) => (
                <div key={stale.id} className="p-3 rounded-xl bg-black/40 border border-amber-500/30 flex justify-between items-center text-xs">
                  <div>
                    <span className="font-bold text-amber-300">{stale.titulo}</span>
                    <span className="block text-gray-400">Abierto desde: {stale.fecha_apertura}</span>
                  </div>
                  <button
                    onClick={() => setEditingProject(stale)}
                    className="px-3 py-1.5 rounded-lg bg-amber-500 text-black font-bold text-xs"
                  >
                    Actualizar
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filters and Search Bar */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {["todos", "abierto", "en_desarrollo", "completado", "bloqueado"].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                  filterStatus === st
                    ? theme.btnPrimary
                    : `${theme.bgCard} ${theme.textSecondary} hover:border-[#0077B6]`
                }`}
              >
                {st.replace("_", " ")}
              </button>
            ))}
          </div>

          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar proyecto..."
            className={`p-2.5 rounded-xl ${theme.bgInput} text-xs border w-full sm:w-64 focus:outline-none`}
          />
        </div>

        {/* Projects List Table */}
        <div className={`${theme.bgCard} rounded-2xl border ${theme.borderCard} overflow-hidden shadow-lg`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className={`${theme.isAmbiental ? 'bg-gray-100 text-gray-700' : 'bg-gray-900 text-gray-300'} uppercase font-bold border-b border-gray-200/20`}>
                  <th className="p-4">Título / Línea</th>
                  <th className="p-4">Familia</th>
                  <th className="p-4">Estado</th>
                  <th className="p-4">Estudiante Asignado</th>
                  <th className="p-4">Desbloquea</th>
                  <th className="p-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200/10">
                {filteredProjects.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-500/5 transition-colors">
                    <td className="p-4">
                      <strong className={`block ${theme.textPrimary} font-semibold text-sm`}>{p.titulo}</strong>
                      <span className={`${theme.textSecondary} text-xs`}>{p.linea} • ID: {p.id}</span>
                    </td>

                    <td className="p-4 font-bold text-center">
                      <span className="px-2.5 py-1 rounded bg-gray-500/20">{p.familia}</span>
                    </td>

                    <td className="p-4">
                      <select
                        value={p.estado}
                        onChange={(e) =>
                          handleUpdateStatus(p.id, e.target.value as ResearchProject["estado"], p.estudiante)
                        }
                        className={`p-1.5 rounded text-xs font-bold border ${
                          p.estado === "abierto"
                            ? "bg-green-500/10 text-green-500 border-green-500/30"
                            : p.estado === "en_desarrollo"
                            ? "bg-amber-500/10 text-amber-500 border-amber-500/30"
                            : p.estado === "completado"
                            ? "bg-blue-500/10 text-blue-500 border-blue-500/30"
                            : "bg-gray-500/10 text-gray-400 border-gray-500/30"
                        }`}
                      >
                        <option value="bloqueado">bloqueado</option>
                        <option value="abierto">abierto</option>
                        <option value="en_desarrollo">en desarrollo</option>
                        <option value="completado">completado</option>
                      </select>
                    </td>

                    <td className="p-4">
                      <input
                        type="text"
                        defaultValue={p.estudiante || ""}
                        onBlur={(e) =>
                          handleUpdateStatus(p.id, p.estado, e.target.value || null)
                        }
                        placeholder="Asignar estudiante..."
                        className={`p-1.5 rounded ${theme.bgInput} text-xs border w-36 focus:outline-none`}
                      />
                    </td>

                    <td className="p-4 text-xs text-gray-400">
                      {p.desbloquea && p.desbloquea.length > 0 ? (
                        <span className="text-cyan-400 font-mono text-[10px]">{p.desbloquea.join(", ")}</span>
                      ) : (
                        "—"
                      )}
                    </td>

                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => setEditingProject(p)}
                        className="px-2.5 py-1 rounded bg-blue-600/20 text-blue-400 font-semibold hover:bg-blue-600/40"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteProject(p.id)}
                        className="px-2 py-1 rounded bg-red-600/20 text-red-400 font-semibold hover:bg-red-600/40"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Editor / Creator Form */}
        {editingProject && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className={`max-w-2xl w-full ${theme.bgCard} p-6 md:p-8 rounded-2xl border ${theme.borderCard} shadow-2xl max-h-[90vh] overflow-y-auto`}>
              <div className="flex justify-between items-center mb-6">
                <h3 className={`text-xl font-bold ${theme.textPrimary}`}>
                  {editingProject.id ? "Editar Proyecto" : "Crear Nuevo Cupo de Proyecto"}
                </h3>
                <button
                  onClick={() => setEditingProject(null)}
                  className="text-gray-400 hover:text-white font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveProject} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block font-semibold ${theme.textSecondary} mb-1`}>ID (Kebab Case) *</label>
                    <input
                      type="text"
                      required
                      value={editingProject.id || ""}
                      onChange={(e) => setEditingProject({ ...editingProject, id: e.target.value })}
                      placeholder="ej: coag-almidon-maiz"
                      className={`w-full p-2.5 rounded-lg ${theme.bgInput} border`}
                    />
                  </div>
                  <div>
                    <label className={`block font-semibold ${theme.textSecondary} mb-1`}>Familia</label>
                    <select
                      value={editingProject.familia || "A"}
                      onChange={(e) => setEditingProject({ ...editingProject, familia: e.target.value as "A" | "B" | "C" })}
                      className={`w-full p-2.5 rounded-lg ${theme.bgInput} border`}
                    >
                      <option value="A">Familia A (Modelación / IA / Tratamientos)</option>
                      <option value="B">Familia B (Productos / Sistemas)</option>
                      <option value="C">Familia C (Datos / Territorio / Gestión)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className={`block font-semibold ${theme.textSecondary} mb-1`}>Título *</label>
                  <input
                    type="text"
                    required
                    value={editingProject.titulo || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, titulo: e.target.value })}
                    className={`w-full p-2.5 rounded-lg ${theme.bgInput} border`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block font-semibold ${theme.textSecondary} mb-1`}>Línea de Investigación *</label>
                    <input
                      type="text"
                      required
                      value={editingProject.linea || ""}
                      onChange={(e) => setEditingProject({ ...editingProject, linea: e.target.value })}
                      className={`w-full p-2.5 rounded-lg ${theme.bgInput} border`}
                    />
                  </div>
                  <div>
                    <label className={`block font-semibold ${theme.textSecondary} mb-1`}>Nivel</label>
                    <select
                      value={editingProject.nivel || "introductorio"}
                      onChange={(e) => setEditingProject({ ...editingProject, nivel: e.target.value as "introductorio" | "intermedio" | "avanzado" })}
                      className={`w-full p-2.5 rounded-lg ${theme.bgInput} border`}
                    >
                      <option value="introductorio">introductorio</option>
                      <option value="intermedio">intermedio</option>
                      <option value="avanzado">avanzado</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className={`block font-semibold ${theme.textSecondary} mb-1`}>Resumen (2-3 frases) *</label>
                  <textarea
                    rows={3}
                    required
                    value={editingProject.resumen || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, resumen: e.target.value })}
                    className={`w-full p-2.5 rounded-lg ${theme.bgInput} border`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block font-semibold ${theme.textSecondary} mb-1`}>Qué lograrás</label>
                    <input
                      type="text"
                      value={editingProject.que_lograras || ""}
                      onChange={(e) => setEditingProject({ ...editingProject, que_lograras: e.target.value })}
                      className={`w-full p-2.5 rounded-lg ${theme.bgInput} border`}
                    />
                  </div>
                  <div>
                    <label className={`block font-semibold ${theme.textSecondary} mb-1`}>Por qué importa</label>
                    <input
                      type="text"
                      value={editingProject.por_que_importa || ""}
                      onChange={(e) => setEditingProject({ ...editingProject, por_que_importa: e.target.value })}
                      className={`w-full p-2.5 rounded-lg ${theme.bgInput} border`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block font-semibold ${theme.textSecondary} mb-1`}>Objetivos (uno por línea)</label>
                  <textarea
                    rows={3}
                    value={(editingProject.objetivos || []).join("\n")}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        objetivos: e.target.value.split("\n").filter(Boolean),
                      })
                    }
                    className={`w-full p-2.5 rounded-lg ${theme.bgInput} border`}
                  />
                </div>

                <div>
                  <label className={`block font-semibold ${theme.textSecondary} mb-1`}>Plan de trabajo (uno por línea)</label>
                  <textarea
                    rows={3}
                    value={(editingProject.plan_trabajo || []).join("\n")}
                    onChange={(e) =>
                      setEditingProject({
                        ...editingProject,
                        plan_trabajo: e.target.value.split("\n").filter(Boolean),
                      })
                    }
                    className={`w-full p-2.5 rounded-lg ${theme.bgInput} border`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`block font-semibold ${theme.textSecondary} mb-1`}>Desbloquea (IDs separados por coma)</label>
                    <input
                      type="text"
                      value={(editingProject.desbloquea || []).join(", ")}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          desbloquea: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                        })
                      }
                      placeholder="ej: coag-moringa, coag-nopal"
                      className={`w-full p-2.5 rounded-lg ${theme.bgInput} border`}
                    />
                  </div>

                  <div>
                    <label className={`block font-semibold ${theme.textSecondary} mb-1`}>Estado</label>
                    <select
                      value={editingProject.estado || "abierto"}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          estado: e.target.value as ResearchProject["estado"],
                        })
                      }
                      className={`w-full p-2.5 rounded-lg ${theme.bgInput} border`}
                    >
                      <option value="bloqueado">bloqueado</option>
                      <option value="abierto">abierto</option>
                      <option value="en_desarrollo">en desarrollo</option>
                      <option value="completado">completado</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className={`block font-semibold ${theme.textSecondary} mb-1`}>Notas Internas de Pablo</label>
                  <input
                    type="text"
                    value={editingProject.notas_admin || ""}
                    onChange={(e) => setEditingProject({ ...editingProject, notas_admin: e.target.value })}
                    className={`w-full p-2.5 rounded-lg ${theme.bgInput} border`}
                  />
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingProject(null)}
                    className="px-4 py-2.5 rounded-xl border border-gray-400 font-semibold"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className={`px-6 py-2.5 rounded-xl font-bold ${theme.btnPrimary}`}
                  >
                    Guardar Cambios
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
