import type { Metadata } from "next";
import { AquaQuizDashboard } from "./_components/teacher";

export const metadata: Metadata = {
  title: "AquaQuiz | Aquatech",
  description: "Preguntas en vivo, participación y asistencia para tus clases.",
  robots: { index: false, follow: false },
};

export default function AquaQuizPage() {
  return <AquaQuizDashboard />;
}
