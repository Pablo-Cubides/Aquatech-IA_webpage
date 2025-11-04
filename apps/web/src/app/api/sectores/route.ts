export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const dominio = url.searchParams.get("dominio");
  const pais = url.searchParams.get("pais");

  // Mock data for demonstration
  const sectoresData: Record<string, string[]> = {
    agua: [
      "agricultura",
      "industria",
      "municipalidad",
      "energia",
      "mineria",
    ],
    ambiental: [
      "forestal",
      "biodiversidad",
      "aire",
      "agua-superficial",
      "aguas-subterraneas",
      "suelo",
    ],
  };

  if (!dominio) {
    return Response.json({ error: "Dominio requerido" }, { status: 400 });
  }

  const sectors = sectoresData[dominio] || [];

  return Response.json({
    success: true,
    sectors,
  });
}
