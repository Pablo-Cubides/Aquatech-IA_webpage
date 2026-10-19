import ToolSeoBlock from "@/components/seo/ToolSeoBlock";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToolSeoBlock slug="generador-matrices" portal="ambiental" />
    </>
  );
}
