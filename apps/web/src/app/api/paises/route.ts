import path from "path";
import fs from "fs";

export const runtime = "nodejs";

// Camachi domains
const VALID_DOMAINS = ["agua", "calidad-aire", "residuos-solidos", "vertimientos"];

export async function GET(request: Request) {
  const url = new URL(request.url);
  const dominio = url.searchParams.get("dominio");

  if (!dominio) {
    return Response.json(
      { error: "Dominio requerido. Opciones: " + VALID_DOMAINS.join(", ") },
      { status: 400 }
    );
  }

  if (!VALID_DOMAINS.includes(dominio)) {
    return Response.json(
      { error: `Dominio inválido. Opciones válidas: ${VALID_DOMAINS.join(", ")}` },
      { status: 400 }
    );
  }

  try {
    const domainDir = path.join(process.cwd(), "data", "json", dominio);

    if (!fs.existsSync(domainDir)) {
      return Response.json(
        { error: `Dominio no encontrado: ${dominio}` },
        { status: 404 }
      );
    }

    // Read all JSON files in the domain folder
    const files = fs.readdirSync(domainDir).filter((f) => f.endsWith(".json"));

    const countries = files
      .map((file) => {
        try {
          const filePath = path.join(domainDir, file);
          const content = fs.readFileSync(filePath, "utf-8");
          const data = JSON.parse(content);
          const countryName = data.pais || data.country || file.replace(".json", "");
          const countryCode = file.replace(".json", "").toUpperCase();

          return {
            code: countryCode,
            name: countryName,
          };
        } catch {
          return null;
        }
      })
      .filter((c): c is { code: string; name: string } => c !== null)
      .sort((a, b) => a.name.localeCompare(b.name, "es"));

    return Response.json({
      success: true,
      dominio,
      countries,
      total: countries.length,
    });
  } catch (error) {
    console.error("Error reading countries:", error);
    return Response.json(
      { error: "Error al leer datos de países" },
      { status: 500 }
    );
  }
}
