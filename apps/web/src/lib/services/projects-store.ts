import seedData from "../../../public/proyectos/projects.seed.json";

export interface ResearchProject {
  id: string;
  titulo: string;
  linea: string;
  familia: "A" | "B" | "C";
  resumen: string;
  que_lograras: string;
  por_que_importa: string;
  objetivos: string[];
  plan_trabajo: string[];
  entregable: string;
  nivel: "introductorio" | "intermedio" | "avanzado";
  prerrequisitos: string;
  estado: "bloqueado" | "abierto" | "en_desarrollo" | "completado";
  fecha_apertura: string | null;
  fecha_estado: string | null;
  estudiante: string | null;
  desbloquea: string[];
  complementa: string[];
  notas_admin: string | null;
}

// In-memory store initialized with seed data
let globalProjects: ResearchProject[] = (seedData as unknown as ResearchProject[]).map((p) => ({
  ...p,
  objetivos: p.objetivos || [],
  plan_trabajo: p.plan_trabajo || [],
  desbloquea: p.desbloquea || [],
  complementa: p.complementa || [],
}));

export function getAllProjects(): ResearchProject[] {
  return globalProjects;
}

export function getPublicProjects(lineaFilter?: string): ResearchProject[] {
  return globalProjects.filter((p) => {
    if (p.estado !== "abierto") return false;
    if (lineaFilter && lineaFilter !== "todas") {
      return p.linea.toLowerCase() === lineaFilter.toLowerCase();
    }
    return true;
  });
}

export function getProjectById(id: string): ResearchProject | undefined {
  return globalProjects.find((p) => p.id === id);
}

export interface UpdateStatusResult {
  project: ResearchProject;
  unlockedProjects: ResearchProject[];
}

export function updateProjectStatus(
  id: string,
  newStatus: ResearchProject["estado"],
  estudianteName?: string | null,
  adminNotes?: string | null
): UpdateStatusResult | null {
  const index = globalProjects.findIndex((p) => p.id === id);
  if (index === -1) return null;

  const today = new Date().toISOString().split("T")[0];
  const oldProject = globalProjects[index];
  const unlockedProjects: ResearchProject[] = [];

  const updatedProject: ResearchProject = {
    ...oldProject,
    estado: newStatus,
    fecha_estado: today,
    estudiante: estudianteName !== undefined ? estudianteName : oldProject.estudiante,
    notas_admin: adminNotes !== undefined ? adminNotes : oldProject.notas_admin,
    fecha_apertura:
      newStatus === "abierto" && !oldProject.fecha_apertura
        ? today
        : oldProject.fecha_apertura,
  };

  globalProjects[index] = updatedProject;

  // Automáticamente desbloquear proyectos si pasa a completado
  if (newStatus === "completado" && updatedProject.desbloquea?.length > 0) {
    updatedProject.desbloquea.forEach((targetId) => {
      const targetIndex = globalProjects.findIndex((p) => p.id === targetId);
      if (targetIndex !== -1 && globalProjects[targetIndex].estado === "bloqueado") {
        globalProjects[targetIndex] = {
          ...globalProjects[targetIndex],
          estado: "abierto",
          fecha_apertura: today,
          fecha_estado: today,
        };
        unlockedProjects.push(globalProjects[targetIndex]);
      }
    });
  }

  return { project: updatedProject, unlockedProjects };
}

export function isStaleProject(project: ResearchProject): boolean {
  if (project.estado !== "abierto" || !project.fecha_apertura) return false;
  const aperturaDate = new Date(project.fecha_apertura);
  const now = new Date();
  const diffYears = (now.getTime() - aperturaDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
  return diffYears >= 2;
}

export function saveOrUpdateProject(project: Partial<ResearchProject>): ResearchProject {
  const today = new Date().toISOString().split("T")[0];
  const existingIndex = globalProjects.findIndex((p) => p.id === project.id);

  if (existingIndex !== -1) {
    const updated: ResearchProject = {
      ...globalProjects[existingIndex],
      ...project,
      fecha_estado: today,
    } as ResearchProject;
    globalProjects[existingIndex] = updated;
    return updated;
  } else {
    const newProject: ResearchProject = {
      id: project.id || `proj-${Date.now()}`,
      titulo: project.titulo || "Nuevo Proyecto",
      linea: project.linea || "General",
      familia: project.familia || "A",
      resumen: project.resumen || "",
      que_lograras: project.que_lograras || "",
      por_que_importa: project.por_que_importa || "",
      objetivos: project.objetivos || [],
      plan_trabajo: project.plan_trabajo || [],
      entregable: project.entregable || "Trabajo de grado",
      nivel: project.nivel || "introductorio",
      prerrequisitos: project.prerrequisitos || "Ninguno",
      estado: project.estado || "abierto",
      fecha_apertura: project.estado === "abierto" ? today : null,
      fecha_estado: today,
      estudiante: project.estudiante || null,
      desbloquea: project.desbloquea || [],
      complementa: project.complementa || [],
      notas_admin: project.notas_admin || null,
    };
    globalProjects.unshift(newProject);
    return newProject;
  }
}

export function deleteProject(id: string): boolean {
  const initialLength = globalProjects.length;
  globalProjects = globalProjects.filter((p) => p.id !== id);
  return globalProjects.length < initialLength;
}
