export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const dominio = url.searchParams.get("dominio");

  // Mock data for demonstration
  const paisesData: Record<string, Array<{ code: string; name: string }>> = {
    agua: [
      { code: "CO", name: "Colombia" },
      { code: "MX", name: "México" },
      { code: "PE", name: "Perú" },
      { code: "AR", name: "Argentina" },
      { code: "BR", name: "Brasil" },
      { code: "CL", name: "Chile" },
    ],
    ambiental: [
      { code: "CO", name: "Colombia" },
      { code: "MX", name: "México" },
      { code: "PE", name: "Perú" },
      { code: "AR", name: "Argentina" },
      { code: "BR", name: "Brasil" },
      { code: "CL", name: "Chile" },
      { code: "EC", name: "Ecuador" },
    ],
  };

  if (!dominio) {
    return Response.json({ error: "Dominio requerido" }, { status: 400 });
  }

  const countries = paisesData[dominio] || [];

  return Response.json({
    success: true,
    countries,
  });
}
