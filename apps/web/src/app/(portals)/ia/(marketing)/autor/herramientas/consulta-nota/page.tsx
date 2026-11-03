import Link from "next/link";
import { getServerSession } from "next-auth";
import type { Metadata } from "next";
import { authOptions } from "@/lib/auth";
import GradeReportLookup from "./GradeReportLookup";
import GradeReportUpload from "./GradeReportUpload";
export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Consulta tus calificaciones | Aquatech IA",
  robots: { index: false, follow: false },
};
export default async function ConsultaNotaIAPage() {
  const session = await getServerSession(authOptions);
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-8">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/ia/autor"
          className="text-sm text-cyan-100 hover:underline"
        >
          Aquatech IA / Herramientas
        </Link>
        <header className="mb-8 mt-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
            Consulta académica
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Tus calificaciones y sus motivos
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-300">
            Ingresa tu código para consultar las notas por actividad. El icono
            de detalle explica cada calificación.
          </p>
        </header>
        <GradeReportLookup />
        {session?.user.role === "ADMIN" ? <GradeReportUpload /> : null}
      </div>
    </main>
  );
}
