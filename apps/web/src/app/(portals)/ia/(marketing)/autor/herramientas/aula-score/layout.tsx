import { ReactNode } from "react";
import "@/components/autor-tools/aula-score/theme.css";

export default function AulaScoreLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className="min-h-screen bg-background text-foreground"
      data-theme="dark"
    >
      {children}
    </div>
  );
}
