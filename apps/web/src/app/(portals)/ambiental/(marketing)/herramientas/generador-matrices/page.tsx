import HeroTabs from "./src/components/HeroTabs";

export default function GeneradorPage() {
  // Load a minimal knowledge object (the portal wrapper may provide richer data later)
  const knowledge = { fundamentos: [{ text: "Introducción a matrices de EIA." }] };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <HeroTabs knowledge={knowledge} />
    </div>
  );
}
