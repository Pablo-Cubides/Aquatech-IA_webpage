import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Nosotros — Aquatech IA",
  description:
    "Conoce la misión, visión y valores de Aquatech IA: IA responsable aplicada al agua y al ambiente, con herramientas públicas, rigor científico y foco en impacto.",
};

export default function NosotrosPage() {
  return (
    <main className="bg-[#10111A] text-[#F3F6FF]">
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#131522] py-20 sm:py-28 lg:py-32">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#131522] via-transparent to-[#10111A] opacity-60" />
        <div
          aria-hidden
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg%20width%3D%2760%27%20height%3D%2760%27%20viewBox%3D%270%200%2060%2060%27%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%3E%3Cg%20fill%3D%27none%27%20fill-rule%3D%27evenodd%27%3E%3Cg%20fill%3D%27%239C92AC%27%20fill-opacity%3D%270.04%27%3E%3Cpath%20d%3D%27M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%27%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E")',
          }}
        />
        <div className="mx-auto grid max-w-screen-xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
          <div className="text-center lg:text-left">
            <h1
              className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl"
              style={{ fontFamily: "Space Grotesk, sans-serif" }}
            >
              Sobre Aquatech IA
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-lg text-[#B6C2DF] lg:mx-0">
              Unimos modelos generativos y ciencia ambiental para tomar mejores
              decisiones sobre el agua y el territorio.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4 lg:justify-start">
              <Link
                href="/ia/herramientas"
                className="inline-block rounded-lg bg-[#00EFFF] px-6 py-3 text-base font-bold text-[#10111A] transition-transform duration-200 hover:scale-105"
              >
                Explorar herramientas
              </Link>
              <Link
                href="/ia/blog"
                className="inline-block rounded-lg border border-white/20 bg-[#141725] px-6 py-3 text-base font-bold transition-all duration-200 hover:scale-105 hover:border-[#00EFFF] hover:text-[#00EFFF]"
              >
                Conocer el blog
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-2 rounded-lg bg-gradient-to-r from-[#00EFFF] to-blue-500 blur transition duration-1000 opacity-30 hover:opacity-40" />
            <div className="relative overflow-hidden rounded-lg shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop&crop=center"
                alt="Tecnología e IA aplicada al agua y ambiente"
                className="w-full h-auto transition-transform duration-300 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>

      {/* MISIÓN & VISIÓN */}
      <section className="bg-[#10111A] py-20 sm:py-24">
        <div className="mx-auto grid max-w-screen-xl grid-cols-1 gap-8 px-4 sm:px-6 md:grid-cols-2 lg:px-8">
          {/* Misión */}
          <article className="flex flex-col items-start rounded-lg border border-white/10 bg-[#141725] p-8 transition-all hover:-translate-y-1 hover:shadow-[0_0_15px_0_rgba(0,239,255,0.3)]">
            <div className="mb-4 rounded-full bg-[#00EFFF]/10 p-3">
              <svg
                className="text-[#00EFFF]"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                stroke="currentColor"
                fill="none"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <h2
              className="text-2xl font-bold"
              style={{ fontFamily: "Space Grotesk, sans-serif" }}
            >
              Misión
            </h2>
            <p className="mt-3 text-lg text-[#B6C2DF]">
              Acelerar soluciones ambientales con IA abierta, validada y
              responsable, convirtiendo datos complejos en decisiones operables
              para instituciones, empresas y ciudadanía.
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-[#B6C2DF]">
              <li>
                <span className="font-medium text-[#F3F6FF]">
                  Democratizar la IA ambiental:
                </span>{" "}
                herramientas públicas, documentación clara y ejemplos
                reproducibles.
              </li>
              <li>
                <span className="font-medium text-[#F3F6FF]">
                  Rigor científico continuo:
                </span>{" "}
                validación con expertos, trazabilidad de datos y evaluación de
                sesgos.
              </li>
              <li>
                <span className="font-medium text-[#F3F6FF]">
                  Impacto medible:
                </span>{" "}
                indicadores ambientales y de desempeño (calidad de agua,
                cobertura, tiempos de respuesta, ahorro).
              </li>
              <li>
                <span className="font-medium text-[#F3F6FF]">
                  Comunidad y formación:
                </span>{" "}
                productos, guías y repositorios para acelerar adopción real.
              </li>
            </ul>
            <Link
              href="#cta-final"
              className="mt-6 text-sm font-bold text-[#00EFFF] hover:underline"
            >
              Ver casos de uso →
            </Link>
          </article>

          {/* Visión */}
          <article className="flex flex-col items-start rounded-lg border border-white/10 bg-[#141725] p-8 transition-all hover:-translate-y-1 hover:shadow-[0_0_15px_0_rgba(0,239,255,0.3)]">
            <div className="mb-4 rounded-full bg-[#00EFFF]/10 p-3">
              <svg
                className="text-[#00EFFF]"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                stroke="currentColor"
                fill="none"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <circle cx="12" cy="12" r="3" />
                <path d="M12 1v6m0 6v6" />
                <path d="m21 12-6-3-6 3-6-3" />
              </svg>
            </div>
            <h2
              className="text-2xl font-bold"
              style={{ fontFamily: "Space Grotesk, sans-serif" }}
            >
              Visión
            </h2>
            <p className="mt-3 text-lg text-[#B6C2DF]">
              Ser la plataforma de referencia en IA ambiental de habla hispana:
              ética por diseño, modular, interoperable y con ecosistema de
              aliados que lleve soluciones del laboratorio al territorio.
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-[#B6C2DF]">
              <li>
                <span className="font-medium text-[#F3F6FF]">
                  IA ética por defecto:
                </span>{" "}
                filtros responsables, revisión humana y privacidad priorizada.
              </li>
              <li>
                <span className="font-medium text-[#F3F6FF]">
                  Plataforma modular:
                </span>{" "}
                microservicios Docker vercel-friendly y APIs interoperables.
              </li>
              <li>
                <span className="font-medium text-[#F3F6FF]">
                  Colaboración multi-actor:
                </span>{" "}
                academia, sector público y organizaciones locales.
              </li>
              <li>
                <span className="font-medium text-[#F3F6FF]">
                  Sostenibilidad digital:
                </span>{" "}
                optimización de cómputo y huella reducida en inferencia.
              </li>
            </ul>
            <Link
              href="#valores"
              className="mt-6 text-sm font-bold text-[#00EFFF] hover:underline"
            >
              Conoce nuestros valores →
            </Link>
          </article>
        </div>
      </section>

      {/* VALORES */}
      <section className="bg-[#131522] py-20 sm:py-24">
        <div className="mx-auto max-w-screen-xl px-4 text-center sm:px-6 lg:px-8">
          <h2
            className="text-3xl font-bold sm:text-4xl"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            Nuestros Valores
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-lg text-[#B6C2DF]">
            Principios que guían cada línea de código y cada decisión
            estratégica.
          </p>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              ["Transparencia", "Modelos, supuestos y fuentes trazables."],
              [
                "Rigor científico",
                "Validación, reproducibilidad y pares expertos.",
              ],
              ["Impacto", "Métricas claras ambientales y sociales."],
              ["Ética de IA", "Filtros responsables y revisión humana."],
              ["Colaboración", "Trabajo en red y co-creación abierta."],
              ["Sostenibilidad", "Soluciones duraderas y eficientes."],
            ].map(([title, copy]) => (
              <div
                key={title}
                className="rounded-lg border border-white/10 bg-[#141725] p-6 text-center transition-all hover:-translate-y-1 hover:shadow-[0_0_15px_0_rgba(0,239,255,0.2)]"
              >
                <h3 className="text-xl font-bold">{title}</h3>
                <p className="mt-2 text-sm text-[#B6C2DF]">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* IMPACTO EN NÚMEROS */}
      <section className="bg-[#10111A] py-16">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2
              className="text-3xl font-bold"
              style={{ fontFamily: "Space Grotesk, sans-serif" }}
            >
              Nuestro Impacto
            </h2>
            <p className="mt-3 text-lg text-[#B6C2DF]">
              Números que reflejan nuestro compromiso con la excelencia.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {[
              ["+120K", "Registros de calidad de agua analizados"],
              ["6", "Herramientas publicadas (3 IA / 3 Ambientales)"],
              ["12", "Alianzas y datasets integrados"],
              ["97%", "Uptime promedio en herramientas públicas"],
            ].map(([kpi, label]) => (
              <div
                key={kpi}
                className="rounded-lg border border-white/10 bg-[#141725] p-6 text-center transition-all hover:-translate-y-1 hover:shadow-[0_0_15px_0_rgba(0,239,255,0.2)]"
              >
                <div className="text-3xl font-bold text-[#00EFFF]">{kpi}</div>
                <p className="mt-2 text-sm text-[#B6C2DF]">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-[#131522] py-20 sm:py-24">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2
              className="text-3xl font-bold sm:text-4xl"
              style={{ fontFamily: "Space Grotesk, sans-serif" }}
            >
              Preguntas Frecuentes
            </h2>
            <p className="mt-3 text-lg text-[#B6C2DF]">
              Respuestas claras a tus dudas más comunes.
            </p>
          </div>

          <div className="mx-auto mt-12 max-w-3xl space-y-4">
            {faqItems.map(({ q, a }) => (
              <details
                key={q}
                className="group overflow-hidden rounded-lg border border-white/10 bg-[#141725]"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between p-5 hover:bg-white/5">
                  <span className="font-medium">{q}</span>
                  <svg
                    className="h-5 w-5 text-[#00EFFF] transition-transform duration-300 group-open:rotate-180"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </summary>
                <div className="px-5 pb-5 text-[#B6C2DF]">{a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="bg-gradient-to-tr from-[#00EFFF]/20 to-[#131522] py-20 sm:py-24">
        <div className="mx-auto max-w-screen-xl px-4 text-center sm:px-6 lg:px-8">
          <h2
            className="mx-auto max-w-3xl text-3xl font-bold md:text-4xl"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            ¿Listo para explorar el futuro del agua y el medio ambiente?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-[#B6C2DF]">
            Sumérgete en nuestras herramientas, descubre nuestros productos o
            colabora con nosotros.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/ia/herramientas"
              className="inline-block rounded-lg bg-[#00EFFF] px-8 py-4 text-lg font-bold text-[#10111A] shadow-[0_0_20px_rgba(0,239,255,0.4)] transition-transform duration-200 hover:scale-105"
            >
              Comenzar ahora
            </Link>
            <Link
              href="/ia/productos"
              className="inline-block rounded-lg border border-white/20 bg-[#141725] px-8 py-4 text-lg font-bold transition-all duration-200 hover:scale-105 hover:border-[#00EFFF] hover:text-[#00EFFF]"
            >
              Ver productos
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

const faqItems = [
  {
    q: "¿Cómo integran IA y ambiente?",
    a: "Combinamos datos satelitales, sensores locales y modelos climáticos con algoritmos de IA para predecir, analizar y priorizar acciones frente a desafíos hídricos y ambientales.",
  },
  {
    q: "¿Las herramientas son públicas?",
    a: "Sí, la mayoría son de acceso público para fomentar la colaboración. Algunas funciones avanzadas requieren autenticación gratuita para guardar proyectos o preferencias.",
  },
  {
    q: "¿Qué es un LLM?",
    a: "Un LLM (Large Language Model) es un modelo entrenado para entender y generar lenguaje. Lo usamos para resumir informes, responder preguntas y asistir en tareas técnicas de forma controlada.",
  },
  {
    q: "¿Dónde corre la infraestructura?",
    a: "El frontend corre en Vercel. Los microservicios (Docker) se despliegan en proveedores vercel-friendly o nubes dedicadas para optimizar costo y latencia, con monitoreo y logs centralizados.",
  },
  {
    q: "¿Puedo proponer datasets?",
    a: "¡Claro! Buscamos datos de calidad para mejorar modelos y evaluar sesgos. Si tienes uno, contáctanos a través de nuestros canales oficiales.",
  },
];
