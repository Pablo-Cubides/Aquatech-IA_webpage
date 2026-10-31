import type { Metadata } from "next";
import "./projection.css";

export const metadata: Metadata = {
  title: { default: "AquaQuiz | Aquatech", template: "%s | AquaQuiz" },
  description: "Preguntas en vivo y asistencia de clase con AquaQuiz.",
  robots: { index: false, follow: false },
};

export default function AquaQuizLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
