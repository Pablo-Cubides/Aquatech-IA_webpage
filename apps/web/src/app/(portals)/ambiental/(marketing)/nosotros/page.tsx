import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Aquatech Ambiental — Nosotros",
  description:
    "Impulsamos la gestión ambiental con datos, análisis y tecnología de vanguardia para proteger nuestros ecosistemas.",
};

export default function AmbientalNosotrosPage() {
  return (
    <main className="bg-[#F5F9F8] text-[#0D161C]">
      {/* HERO */}
      <section className="relative overflow-hidden py-20 sm:py-28 lg:py-32 bg-white">
        {/* Fondos sutiles */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-[#F5F9F8] opacity-60" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg%20width%3D%2760%27%20height%3D%2760%27%20viewBox%3D%270%200%2060%2060%27%20xmlns%3D%27http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%27%3E%3Cg%20fill%3D%27none%27%20fill-rule%3D%27evenodd%27%3E%3Cg%20fill%3D%27%2322c55e%27%20fill-opacity%3D%270.04%27%3E%3Cpath%20d%3D%27M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%27%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E")',
          }}
        />
        <div className="relative mx-auto grid max-w-screen-xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="text-center lg:text-left">
            <h1
              className="tracking-tight text-4xl font-bold md:text-5xl lg:text-6xl"
              style={{ fontFamily: "Space Grotesk, sans-serif" }}
            >
              Sobre Aquatech Ambiental
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-lg text-gray-700 lg:mx-0 md:text-xl">
              Impulsamos la gestión ambiental con datos, análisis y tecnología
              de vanguardia para proteger nuestros ecosistemas.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4 lg:justify-start">
              <Link
                href="/ambiental/herramientas"
                className="inline-block rounded-lg bg-[#10B981] px-6 py-3 text-base font-bold text-white transition-transform duration-200 hover:scale-105"
              >
                Explorar herramientas
              </Link>
              <Link
                href="/ambiental/blog"
                className="inline-block rounded-lg border border-gray-300 bg-white px-6 py-3 text-base font-bold transition-all duration-200 hover:scale-105 hover:border-[#10B981] hover:text-[#10B981]"
              >
                Leer nuestro blog
              </Link>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-2 rounded-lg bg-gradient-to-r from-[#10B981] to-green-300 blur opacity-20 transition duration-1000 group-hover:opacity-40" />
            <div className="relative overflow-hidden rounded-lg shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop&crop=center"
                alt="Tecnología para el monitoreo y gestión ambiental"
                className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>

      {/* MISIÓN / VISIÓN */}
      <section className="bg-[#F5F9F8] py-20 sm:py-24">
        <div className="mx-auto grid max-w-screen-xl gap-8 px-4 sm:px-6 md:grid-cols-2 lg:px-8">
          {/* Misión */}
          <div className="flex flex-col items-start rounded-lg border border-gray-200 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
            <div className="mb-4 rounded-full bg-green-100 p-3">
              <svg
                className="text-[#10B981]"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
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
            <p className="mt-3 text-lg text-gray-700">
              Empoderar a comunidades y organizaciones con{" "}
              <strong className="font-semibold text-[#0D161C]">
                datos ambientales accesibles
              </strong>{" "}
              y herramientas intuitivas para una toma de decisiones{" "}
              <strong className="font-semibold text-[#0D161C]">
                informada y sostenible
              </strong>
              .
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-gray-700">
              <li>
                <span className="font-medium text-[#0D161C]">
                  Democratizar datos ambientales:
                </span>{" "}
                capas de agua, cobertura vegetal, clima y calidad del aire con
                licencias abiertas.
              </li>
              <li>
                <span className="font-medium text-[#0D161C]">
                  Traducir complejidad:
                </span>{" "}
                convertir datos complejos en indicadores útiles para gestión
                pública y comunitaria.
              </li>
              <li>
                <span className="font-medium text-[#0D161C]">
                  Formación continua:
                </span>{" "}
                productos y guías prácticas para capacitar equipos técnicos.
              </li>
              <li>
                <span className="font-medium text-[#0D161C]">
                  Ética y privacidad:
                </span>{" "}
                prácticas responsables en todo el ciclo de los datos.
              </li>
            </ul>
            <Link
              href="#cta-final"
              className="mt-6 text-sm font-bold text-[#10B981] hover:underline"
            >
              Ver casos de uso →
            </Link>
          </div>

          {/* Visión */}
          <div className="flex flex-col items-start rounded-lg border border-gray-200 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">
            <div className="mb-4 rounded-full bg-green-100 p-3">
              <svg
                className="text-[#10B981]"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
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
            <p className="mt-3 text-lg text-gray-700">
              Ser el referente en la{" "}
              <strong className="font-semibold text-[#0D161C]">
                democratización de la información ambiental
              </strong>
              , transformando datos en{" "}
              <strong className="font-semibold text-[#0D161C]">
                acciones concretas
              </strong>{" "}
              para un futuro más verde.
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-gray-700">
              <li>
                <span className="font-medium text-[#0D161C]">
                  Interoperabilidad por defecto:
                </span>{" "}
                estándares abiertos y APIs para facilitar integración.
              </li>
              <li>
                <span className="font-medium text-[#0D161C]">
                  Arquitectura modular:
                </span>{" "}
                microservicios escalables y costo-efectivos.
              </li>
              <li>
                <span className="font-medium text-[#0D161C]">
                  Colaboración multi-actor:
                </span>{" "}
                ONGs, academia, gobiernos y sector privado unidos.
              </li>
              <li>
                <span className="font-medium text-[#0D161C]">
                  Sostenibilidad digital:
                </span>{" "}
                infraestructura con baja huella y alta eficiencia.
              </li>
            </ul>
            <Link
              href="#valores"
              className="mt-6 text-sm font-bold text-[#10B981] hover:underline"
            >
              Conoce nuestros valores →
            </Link>
          </div>
        </div>
      </section>

      {/* VALORES */}
      <section id="valores" className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2
              className="text-3xl font-bold sm:text-4xl"
              style={{ fontFamily: "Space Grotesk, sans-serif" }}
            >
              Nuestros Valores
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-lg text-gray-700">
              Principios que guían cada análisis de datos y cada decisión
              estratégica.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Ciencia Abierta",
                desc: "Nuestros métodos, datos y resultados son transparentes y accesibles.",
              },
              {
                title: "Rigor Analítico",
                desc: "Validamos metodologías con expertos y estándares científicos.",
              },
              {
                title: "Impacto Positivo",
                desc: "Medimos y maximizamos nuestra contribución a la salud del planeta.",
              },
              {
                title: "Ética de Datos",
                desc: "Privacidad, seguridad y uso responsable de la información.",
              },
              {
                title: "Colaboración",
                desc: "Trabajamos en red con ONGs, academia y sector público.",
              },
              {
                title: "Sostenibilidad",
                desc: "Soluciones duraderas y respetuosas con los límites del planeta.",
              },
            ].map((valor) => (
              <div
                key={valor.title}
                className="rounded-lg border border-gray-200 bg-white p-6 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <h3 className="text-xl font-bold">{valor.title}</h3>
                <p className="mt-2 text-sm text-gray-700">{valor.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* IMPACTO EN NÚMEROS */}
      <section className="bg-[#F5F9F8] py-16">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2
              className="text-3xl font-bold"
              style={{ fontFamily: "Space Grotesk, sans-serif" }}
            >
              Nuestro Impacto
            </h2>
            <p className="mt-3 text-lg text-gray-700">
              Datos que reflejan nuestro compromiso ambiental.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {[
              ["+50K", "Hectáreas de ecosistemas monitoreados"],
              ["25", "Proyectos ambientales completados"],
              ["8", "Alianzas con organizaciones locales"],
              ["95%", "Precisión en análisis de calidad del agua"],
            ].map(([kpi, label]) => (
              <div
                key={kpi}
                className="rounded-lg border border-gray-200 bg-white p-6 text-center shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="text-3xl font-bold text-[#10B981]">{kpi}</div>
                <p className="mt-2 text-sm text-gray-700">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2
              className="text-3xl font-bold sm:text-4xl"
              style={{ fontFamily: "Space Grotesk, sans-serif" }}
            >
              Preguntas Frecuentes
            </h2>
            <p className="mt-3 text-lg text-gray-700">
              Respuestas claras a tus dudas más comunes sobre nuestra gestión
              ambiental.
            </p>
          </div>

          <div className="mx-auto mt-12 max-w-3xl space-y-4">
            {faqItems.map(({ q, a }) => (
              <details
                key={q}
                className="group overflow-hidden rounded-lg border border-gray-200 bg-white"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between p-5 hover:bg-gray-50">
                  <span className="font-medium">{q}</span>
                  <svg
                    className="h-5 w-5 text-[#10B981] transition-transform duration-300 group-open:rotate-180"
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
                <div className="px-5 pb-5 text-gray-700">{a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section
        id="cta-final"
        className="bg-gradient-to-tr from-green-100 to-[#F5F9F8] py-20 sm:py-24"
      >
        <div className="mx-auto max-w-screen-xl px-4 text-center sm:px-6 lg:px-8">
          <h2
            className="mx-auto max-w-3xl text-3xl font-bold md:text-4xl"
            style={{ fontFamily: "Space Grotesk, sans-serif" }}
          >
            ¿Listo para transformar datos en acción ambiental?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-gray-700">
            Explora nuestras herramientas, profundiza con nuestros análisis o
            colabora con nosotros para un planeta más sano.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/ambiental/herramientas"
              className="inline-block rounded-lg bg-[#10B981] px-8 py-4 text-lg font-bold text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-transform duration-200 hover:scale-105"
            >
              Empezar a explorar
            </Link>
            <Link
              href="/ambiental/productos"
              className="inline-block rounded-lg border border-gray-300 bg-white px-8 py-4 text-lg font-bold transition-all duration-200 hover:scale-105 hover:border-[#10B981] hover:text-[#10B981]"
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
    q: "¿Qué tipo de datos ambientales utilizan?",
    a: "Integramos datos de satélites (calidad del aire, deforestación), sensores de monitoreo en tiempo real (calidad del agua, estaciones meteorológicas) y bases de datos gubernamentales y académicas.",
  },
  {
    q: "¿Sus herramientas son de uso gratuito?",
    a: "Sí, el acceso a nuestras herramientas de visualización y análisis de datos es público y gratuito. Algunas funcionalidades avanzadas para la gestión de proyectos específicos pueden requerir un registro sin costo.",
  },
  {
    q: "¿Cómo garantizan la calidad de los datos?",
    a: "Aplicamos validación cruzada con fuentes múltiples, limpieza para eliminar anomalías y trabajamos con expertos para asegurar interpretación correcta y confiabilidad.",
  },
  {
    q: "¿Qué tecnologías utilizan?",
    a: "Usamos tecnologías web modernas para visualización; Python/R para análisis; y bases geoespaciales para manejo eficiente de información geográfica.",
  },
  {
    q: "¿Puedo proponer un proyecto o dataset?",
    a: "¡Absolutamente! Si tienes un dataset o una idea de proyecto, contáctanos a través de nuestros canales oficiales para evaluar colaboraciones.",
  },
];
