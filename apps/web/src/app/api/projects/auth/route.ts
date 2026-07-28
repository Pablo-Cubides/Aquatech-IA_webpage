import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { password } = await req.json();
    const adminPassword = process.env.ADMIN_PASSWORD || "aquatech2026";

    if (password === adminPassword) {
      return NextResponse.json({ success: true, message: "Acceso concedido" });
    }

    return NextResponse.json(
      { success: false, error: "Contraseña incorrecta" },
      { status: 401 }
    );
  } catch (error) {
    console.error("Error in admin auth:", error);
    return NextResponse.json(
      { error: "Error de servidor en autenticación" },
      { status: 500 }
    );
  }
}
