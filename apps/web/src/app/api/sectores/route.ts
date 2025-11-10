import path from "path";
import fs from "fs";

export const runtime = "nodejs";

const VALID_DOMAINS = [
  "agua",
  "calidad-aire",
  "residuos-solidos",
  "vertimientos",
];

export async function GET(request: Request) {
  const url = new URL(request.url);
  const dominio = url.searchParams.get("dominio");
  const pais = url.searchParams.get("pais");

  if (!dominio || !pais) {
    return Response.json(
      { error: "Parámetros requeridos: dominio, pais" },
      { status: 400 },
    );
  }

  if (!VALID_DOMAINS.includes(dominio)) {
    return Response.json(
      { error: `Dominio inválido. Opciones: ${VALID_DOMAINS.join(", ")}` },
      { status: 400 },
    );
  }

  try {
    // Normalize country filename to lower-case slug
    const countrySlug = String(pais).toLowerCase();
    const countryFile = path.join(
      process.cwd(),
      "data",
      "json",
      dominio,
      `${countrySlug}.json`,
    );

    if (!fs.existsSync(countryFile)) {
      return Response.json(
        { error: `País no encontrado: ${pais}` },
        { status: 404 },
      );
    }

    const content = fs.readFileSync(countryFile, "utf-8");
    const data = JSON.parse(content);

    // Return empty array if no sectors exist (e.g., calidad-aire, residuos-solidos)
    const sectors = Object.keys(data.sectors || {}).map((sectorKey) => ({
      id: sectorKey.replace(/_/g, "-").toLowerCase(),
      label:
        data.sectors[sectorKey].name ||
        sectorKey.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
    }));

    return Response.json({
      success: true,
      dominio,
      pais,
      sectors,
      total: sectors.length,
    });
  } catch (error) {
    console.error("Error reading sectors:", error);
    return Response.json({ error: "Error al leer sectores" }, { status: 500 });
  }
}
