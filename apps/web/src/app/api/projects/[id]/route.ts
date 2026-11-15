import { NextResponse } from "next/server";
import {
  getProjectById,
  updateProjectStatus,
  saveOrUpdateProject,
  deleteProject,
  toPublicProject,
} from "@/lib/services/projects-store";
import { getAdminSession } from "@/lib/security/admin-session";
import {
  projectIdSchema,
  projectUpdateBodySchema,
} from "@/lib/schemas/projects.zod";

type RouteContext = { params: Promise<{ id: string }> };

// No confirmar la existencia de la superficie de escritura: sin ADMIN, 404.
const notFound = (message = "Proyecto no encontrado") =>
  NextResponse.json({ error: message }, { status: 404 });

async function parseId(context: RouteContext): Promise<string | null> {
  const parsed = projectIdSchema.safeParse((await context.params).id);
  return parsed.success ? parsed.data : null;
}

export async function GET(_req: Request, context: RouteContext) {
  try {
    const id = await parseId(context);
    const project = id ? getProjectById(id) : undefined;

    if (!project) return notFound();

    // Solo ADMIN ve estudiante / notas_admin (datos personales).
    const isAdmin = (await getAdminSession()) !== null;
    return NextResponse.json(isAdmin ? project : toPublicProject(project));
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      { error: "Error al obtener proyecto" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request, context: RouteContext) {
  if (!(await getAdminSession())) return notFound();

  try {
    const id = await parseId(context);
    if (!id) return NextResponse.json({ error: "Id inválido" }, { status: 400 });

    const parsed = projectUpdateBodySchema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json({ error: "Cuerpo inválido" }, { status: 400 });
    }

    const body = parsed.data;

    if (body.action === "updateStatus") {
      const result = updateProjectStatus(
        id,
        body.estado,
        body.estudiante,
        body.notas_admin,
      );

      if (!result) return notFound();

      return NextResponse.json(result);
    }

    const { action: _action, ...fields } = body;
    void _action;
    const updated = saveOrUpdateProject({ ...fields, id });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json(
      { error: "Error al actualizar proyecto" },
      { status: 500 }
    );
  }
}

export async function DELETE(_req: Request, context: RouteContext) {
  if (!(await getAdminSession())) return notFound();

  try {
    const id = await parseId(context);
    if (!id) return NextResponse.json({ error: "Id inválido" }, { status: 400 });

    const success = deleteProject(id);

    if (!success) return notFound();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { error: "Error al eliminar proyecto" },
      { status: 500 }
    );
  }
}
