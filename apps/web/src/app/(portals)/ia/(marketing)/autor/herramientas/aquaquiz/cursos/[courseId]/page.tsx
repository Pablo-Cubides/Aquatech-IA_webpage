import { AquaQuizCourse } from "../../_components/teacher";

export default async function AquaQuizCoursePage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;
  return <AquaQuizCourse courseId={courseId} />;
}
