import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { name, image } = body;

    // Validation
    if (!name && !image) {
      return new NextResponse("Missing fields", { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        ...(name && { name }),
        ...(image && { image }),
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("[USER_PROFILE_UPDATE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
