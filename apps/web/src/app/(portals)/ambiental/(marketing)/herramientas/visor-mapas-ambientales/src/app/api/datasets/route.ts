import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { logger } from "@/lib/logger";

export async function GET() {
  try {
    if (!supabase) {
      logger.warn("Supabase not configured", { endpoint: "/api/datasets" });
      return NextResponse.json(
        {
          error: "Supabase no configurado. Configure las variables de entorno.",
        },
        { status: 503 },
      );
    }

    const { data: datasets, error } = await supabase
      .from("datasets")
      .select("id, name, description, created_at, owner_id")
      .order("created_at", { ascending: false });

    if (error) {
      logger.error("Failed to fetch datasets", error, {
        endpoint: "/api/datasets",
      });
      return NextResponse.json(
        { error: "Error al cargar los datasets" },
        { status: 500 },
      );
    }

    logger.info("Datasets fetched successfully", {
      count: datasets?.length || 0,
    });
    return NextResponse.json({ datasets });
  } catch (error) {
    logger.error("Unexpected error in GET /api/datasets", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    if (!supabase) {
      logger.warn("Supabase not configured", {
        endpoint: "/api/datasets",
        method: "POST",
      });
      return NextResponse.json(
        {
          error: "Supabase no configurado. Configure las variables de entorno.",
        },
        { status: 503 },
      );
    }

    const body = await request.json();
    const {
      name,
      description,
      owner_id,
      column_mapping,
      available_dates,
      parameters,
      units,
      max_points_per_day,
    } = body;

    // Validate required fields
    if (!name || !description || !owner_id || !column_mapping) {
      logger.warn("Missing required fields in POST /api/datasets", {
        providedFields: Object.keys(body),
      });
      return NextResponse.json(
        {
          error: "Faltan campos obligatorios",
        },
        { status: 400 },
      );
    }

    const { data: dataset, error } = await supabase
      .from("datasets")
      .insert([
        {
          name,
          description,
          owner_id,
          column_mapping,
          available_dates: available_dates || [],
          parameters: parameters || [],
          units: units || {},
          max_points_per_day: max_points_per_day || null,
        },
      ])
      .select()
      .single();

    if (error) {
      logger.error("Failed to create dataset", error, { name, owner_id });
      return NextResponse.json(
        { error: "Error al crear el dataset" },
        { status: 500 },
      );
    }

    logger.info("Dataset created successfully", {
      datasetId: dataset.id,
      name,
    });
    return NextResponse.json({ dataset });
  } catch (error) {
    logger.error("Unexpected error in POST /api/datasets", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  try {
    if (!supabase) {
      logger.warn("Supabase not configured", {
        endpoint: "/api/datasets",
        method: "DELETE",
      });
      return NextResponse.json(
        {
          error: "Supabase no configurado. Configure las variables de entorno.",
        },
        { status: 503 },
      );
    }

    const url = new URL(request.url);
    const datasetId = url.searchParams.get("id");

    if (!datasetId) {
      logger.warn("Dataset ID missing in DELETE request");
      return NextResponse.json(
        { error: "ID del dataset requerido" },
        { status: 400 },
      );
    }

    // SECURITY: Verify authentication
    const authHeader = request.headers.get("authorization");
    const userId = extractUserIdFromAuth(authHeader);

    if (!userId) {
      logger.warn("Unauthorized DELETE attempt", {
        datasetId,
        ip: request.headers.get("x-forwarded-for"),
      });
      return NextResponse.json(
        { error: "Autenticación requerida" },
        { status: 401 },
      );
    }

    // Fetch dataset to verify ownership
    const { data: dataset, error: fetchError } = await supabase
      .from("datasets")
      .select("owner_id, id")
      .eq("id", datasetId)
      .single();

    if (fetchError || !dataset) {
      logger.warn("Dataset not found", { datasetId, userId });
      return NextResponse.json(
        { error: "Dataset no encontrado" },
        { status: 404 },
      );
    }

    // SECURITY: Check authorization - only owner can delete
    const isOwner = dataset.owner_id === userId;
    const isAdmin = await checkIfAdmin(userId); // TODO: Implement admin check

    if (!isOwner && !isAdmin) {
      logger.warn("Unauthorized delete attempt", {
        datasetId,
        userId,
        owner: dataset.owner_id,
      });
      return NextResponse.json(
        { error: "No tienes permisos para eliminar este dataset" },
        { status: 403 },
      );
    }

    const { error } = await supabase
      .from("datasets")
      .delete()
      .eq("id", datasetId);

    if (error) {
      logger.error("Failed to delete dataset", error, { datasetId });
      return NextResponse.json(
        { error: "Error al eliminar el dataset" },
        { status: 500 },
      );
    }

    logger.info("Dataset deleted successfully", {
      datasetId,
      userId,
      wasOwner: isOwner,
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("Unexpected error in DELETE /api/datasets", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}

/**
 * Helper: Extract user ID from Authorization header
 * TODO: Replace with proper JWT validation
 */
function extractUserIdFromAuth(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  // TODO: Validate and decode JWT token
  // For now, return null - implement proper JWT validation
  return null;
}

/**
 * Helper: Check if user is admin
 * TODO: Implement based on your user role system
 */
async function checkIfAdmin(userId: string): Promise<boolean> {
  try {
    if (!supabase) {
      return false;
    }

    const { data: user } = await supabase
      .from("users")
      .select("role")
      .eq("id", userId)
      .single();

    return user?.role === "admin";
  } catch {
    return false;
  }
}
