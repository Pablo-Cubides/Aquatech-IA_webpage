import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import HeaderAmbiental from "@/components/nav/HeaderAmbiental";
import FooterAmbiental from "@/components/nav/FooterAmbiental";
import HeaderIA from "@/components/nav/HeaderIA";
import FooterIA from "@/components/nav/FooterIA";
import { guidesData } from "@/lib/guides-data";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(guidesData).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = guidesData[slug];
  if (!guide) {
    return {
      title: "Guía no encontrada | AquatechIA",
    };
  }

  return {
    title: `${guide.title} | AquatechIA`,
    description: guide.description,
  };
}

export default async function GuiaDinamicaPage({ params }: Props) {
  const { slug } = await params;
  const guide = guidesData[slug];

  if (!guide) {
    notFound();
  }

  const isIA = guide.portal === "ia";
  const Header = isIA ? HeaderIA : HeaderAmbiental;
  const Footer = isIA ? FooterIA : FooterAmbiental;

  return (
    <>
      <Header />
      <main className={`min-h-screen flex-grow ${isIA ? "bg-black text-white" : "bg-slate-50 text-slate-900"}`}>
        {/* Hero Header */}
        <div className={`py-16 px-6 relative overflow-hidden border-b ${
          isIA 
            ? "bg-gradient-to-r from-gray-950 via-slate-900 to-gray-950 border-cyan-500/20 text-white" 
            : "bg-gradient-to-r from-cyan-600 to-blue-500 border-blue-200 text-white"
        }`}>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2240%22 height=%2240%22><g fill-opacity=%220.05%22><path d=%22M0,0 l10,10 l-10,10 l-10,-10 Z%22 fill=%22%23000%22/><path d=%22M20,0 l10,10 l-10,10 l-10,-10 Z%22 fill=%22%23000%22/><path d=%22M0,20 l10,10 l-10,10 l-10,-10 Z%22 fill=%22%23000%22/><path d=%22M20,20 l10,10 l-10,10 l-10,-10 Z%22 fill=%22%23000%22/></g></svg>')] opacity-10"></div>
          <div className="max-w-6xl mx-auto relative z-10 flex flex-col items-center text-center">
            <span className={`text-xs font-bold uppercase tracking-wider mb-4 px-3 py-1 rounded-full ${
              isIA 
                ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30" 
                : "bg-white/20 text-white border border-white/30"
            }`}>
              {guide.badge}
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
              {guide.title}
            </h1>
            <p className={`text-lg max-w-2xl leading-relaxed mx-auto ${isIA ? "text-slate-300" : "text-cyan-50"}`}>
              {guide.subtitle}
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Navigation Sidebar */}
          <aside className={`lg:col-span-1 border-r pr-8 hidden lg:block h-fit sticky top-24 ${
            isIA ? "border-slate-800 text-slate-400" : "border-slate-200 text-slate-600"
          }`}>
            <h3 className="text-sm font-bold uppercase tracking-widest mb-4 opacity-50">
              Contenido
            </h3>
            <nav className="flex flex-col gap-3">
              {guide.sections.map((section, idx) => {
                const sectionId = section.title.toLowerCase().replace(/\s+/g, "-");
                return (
                  <a
                    key={idx}
                    href={`#${sectionId}`}
                    className={`font-medium transition-colors hover:underline ${
                      isIA ? "hover:text-cyan-400" : "hover:text-cyan-600"
                    }`}
                  >
                    {section.icon} {section.title}
                  </a>
                );
              })}
              <div className="border-t my-4 pt-4 border-current opacity-20"></div>
              <Link 
                href={isIA ? "/ia/herramientas" : "/ambiental/herramientas"}
                className={`text-sm font-semibold flex items-center gap-2 ${
                  isIA ? "text-cyan-400 hover:text-cyan-300" : "text-blue-600 hover:text-blue-700"
                }`}
              >
                ← Volver a Herramientas
              </Link>
            </nav>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {guide.sections.map((section, idx) => {
              const sectionId = section.title.toLowerCase().replace(/\s+/g, "-");
              return (
                <section
                  key={idx}
                  className="mb-16 scroll-mt-24"
                  id={sectionId}
                >
                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-4xl">{section.icon}</span>
                    <h2 className={`text-3xl font-bold border-b-4 pb-2 ${
                      isIA ? "text-white border-cyan-500" : "text-gray-900 border-cyan-500"
                    }`}>
                      {section.title}
                    </h2>
                  </div>
                  <div className={`rounded-2xl border p-8 shadow-xl ${
                    isIA 
                      ? "bg-slate-900/60 border-slate-800 shadow-cyan-950/20" 
                      : "bg-white border-gray-100 shadow-cyan-500/5"
                  }`}>
                    <div 
                      className={`prose max-w-none leading-relaxed ${
                        isIA 
                          ? "prose-invert text-slate-300 prose-headings:text-white" 
                          : "text-gray-700 prose-headings:text-gray-900"
                      }`}
                      dangerouslySetInnerHTML={{ __html: section.content }}
                    />
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
