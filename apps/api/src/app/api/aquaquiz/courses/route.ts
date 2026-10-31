import { NextRequest } from "next/server";
import { z } from "zod";
import { aquaQuizCourseCreateSchema } from "@ia-next/contracts";
import { prisma } from "@ia-next/database";
import {
  aquaQuizError,
  aquaQuizResponse,
  allowAquaQuizRequest,
  requireAquaQuizTeacher,
  validationError,
} from "@/lib/aquaquiz";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const auth = await requireAquaQuizTeacher(request);
  if (!auth.ok) return auth.response;

  const courses = await prisma.quizCourse.findMany({
    where: { ownerId: auth.account.id },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { enrollments: true, meetings: true, quizzes: true } },
      meetings: {
        orderBy: [{ classDate: "desc" }, { createdAt: "desc" }],
        take: 4,
        select: {
          id: true,
          classDate: true,
          lateAfterMinutes: true,
          attendanceLockedAt: true,
          _count: { select: { attendances: true, sessions: true } },
        },
      },
    },
  });
  return aquaQuizResponse({ courses });
}

export async function POST(request: NextRequest) {
  const auth = await requireAquaQuizTeacher(request);
  if (!auth.ok) return auth.response;

  const limited = await allowAquaQuizRequest(
    request,
    `courses:${auth.account.id}`,
  );
  if (limited) return limited;

  const parsed = aquaQuizCourseCreateSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success) return validationError();

  const course = await prisma.quizCourse.create({
    data: { ...parsed.data, ownerId: auth.account.id },
    select: { id: true, title: true, groupName: true, createdAt: true },
  });
  return aquaQuizResponse({ course }, { status: 201 });
}
