import { NextResponse } from "next/server";
import {
  getAllProjects,
  getPublicProjects,
  saveOrUpdateProject,
  toPublicProject,
} from "@/lib/services/projects-store";
import { getAdminSession } from "@/lib/security/admin-session";
import { projectBodySchema, projectsQuerySchema } from "@/lib/schemas/projects.zod";

// No confirmar la existencia de la superficie de escritura: sin ADMIN, 404.
const notFound = () => NextResponse.json({ error: "No encontrado" }, { status: 404 });

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = projectsQuerySchema.safeParse({
      publicOnly: searchParams.get("publicOnly") ?? undefined,
      linea: searchParams.get("linea") ?? undefined,
    });

    if (!query.success) {
      return NextResponse.json({ error: "Parámetros inválidos" }, { status: 400 });
    }

    const { publicOnly, linea } = query.data;

    // Solo ADMIN ve estudiante / notas_admin (datos personales).
    const isAdmin = (await getAdminSession()) !== null;

    if (publicOnly === "true") {
      return NextResponse.json(getPublicProjects(linea).map(toPublicProject));
    }

    const projects = getAllProjects();
    return NextResponse.json(isAdmin ? projects : projects.map(toPublicProject));
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Error al obtener proyectos" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  if (!(await getAdminSession())) return notFound();

  try {
    const body = projectBodySchema.safeParse(await req.json().catch(() => null));
    if (!body.success) {
      return NextResponse.json(
        { error: "El título es obligatorio y los campos deben ser válidos" },
        { status: 400 }
      );
    }

    const newProject = saveOrUpdateProject(body.data);
    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Error al crear proyecto" },
      { status: 500 }
    );
  }
}
