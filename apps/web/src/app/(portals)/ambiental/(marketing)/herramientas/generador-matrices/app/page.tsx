import HeroTabs from "../src/components/HeroTabs";

export default function Page() {
  const knowledge = { fundamentos: [{ text: "Introducción a matrices de EIA." }] };
  return (
    <div className="max-w-7xl mx-auto">
      <HeroTabs knowledge={knowledge} />
    </div>
  );
}
