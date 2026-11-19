import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@ia-next/database";
import { NextResponse } from "next/server";

const httpUrl = z
  .string()
  .max(2048)
  .refine((value) => {
    try {
      const { protocol } = new URL(value);
      return protocol === "https:" || protocol === "http:";
    } catch {
      return false;
    }
  }, "URL inválida");

const profileSchema = z
  .object({
    name: z.string().trim().min(1).max(100).optional(),
    image: httpUrl.optional(),
  })
  .refine((value) => value.name !== undefined || value.image !== undefined, {
    message: "Missing fields",
  });

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const parsed = profileSchema.safeParse(await req.json().catch(() => null));

    if (!parsed.success) {
      return new NextResponse("Invalid fields", { status: 400 });
    }

    const { name, image } = parsed.data;

    // `select` explícito: nunca devolver el registro completo (incluye el hash
    // de `password`, el `role` y los `credits`).
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        ...(name && { name }),
        ...(image && { image }),
      },
      select: { id: true, name: true, image: true },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("[USER_PROFILE_UPDATE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
