import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@ia-next/database";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { rateLimitByIP, getClientIP } from "@/lib/security/rate-limit";
import { sanitizeInput } from "@/lib/security/validation";
import { logger } from "@/lib/logger";

const registerSchema = z.object({
  name: z.string().trim().min(2).max(80).optional().or(z.literal("")),
  email: z.string().trim().email().max(254),
  password: z
    .string()
    .min(10, "La contraseña debe tener al menos 10 caracteres")
    .max(128, "La contraseña es demasiado larga")
    .regex(/[a-z]/, "La contraseña debe incluir minúsculas")
    .regex(/[A-Z]/, "La contraseña debe incluir mayúsculas")
    .regex(/[0-9]/, "La contraseña debe incluir números")
    .regex(/[^A-Za-z0-9]/, "La contraseña debe incluir un símbolo"),
});

export async function POST(request: NextRequest) {
  const clientIP = getClientIP(request.headers);

  const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) {
      return error.message;
    }
    return "Unknown error";
  };

  try {
    const rateLimitResult = await rateLimitByIP(clientIP, {
      interval: 15 * 60 * 1000,
      uniqueTokenPerInterval: 10,
    });

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: "Demasiados intentos. Intenta nuevamente más tarde." },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": rateLimitResult.limit.toString(),
            "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
            "X-RateLimit-Reset": new Date(rateLimitResult.reset).toISOString(),
          },
        },
      );
    }

    const parsedBody = registerSchema.safeParse(await request.json());

    if (!parsedBody.success) {
      return NextResponse.json(
        { error: parsedBody.error.issues[0]?.message || "Datos inválidos" },
        { status: 400 },
      );
    }

    const email = parsedBody.data.email.toLowerCase();
    const password = parsedBody.data.password;
    const name = parsedBody.data.name
      ? sanitizeInput(parsedBody.data.name).slice(0, 80)
      : null;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      await logger.warn("Registration attempt for existing email", {
        email,
        ipAddress: clientIP,
      });
      return NextResponse.json(
        { error: "No fue posible crear la cuenta" },
        { status: 409 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      {
        message: "Usuario creado exitosamente",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    logger.error("Error creating user", {
      error: getErrorMessage(error),
      ipAddress: clientIP,
    });

    return NextResponse.json(
      { error: "Error al crear el usuario" },
      { status: 500 },
    );
  }
}
