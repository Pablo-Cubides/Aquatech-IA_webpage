import { NextResponse } from "next/server";
import {
  getAllProjects,
  getPublicProjects,
  saveOrUpdateProject,
} from "@/lib/services/projects-store";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const publicOnly = searchParams.get("publicOnly") === "true";
    const linea = searchParams.get("linea") || undefined;

    if (publicOnly) {
      const projects = getPublicProjects(linea);
      return NextResponse.json(projects);
    }

    const projects = getAllProjects();
    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Error al obtener proyectos" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.titulo) {
      return NextResponse.json(
        { error: "El título es obligatorio" },
        { status: 400 }
      );
    }

    const newProject = saveOrUpdateProject(body);
    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Error al crear proyecto" },
      { status: 500 }
    );
  }
}
