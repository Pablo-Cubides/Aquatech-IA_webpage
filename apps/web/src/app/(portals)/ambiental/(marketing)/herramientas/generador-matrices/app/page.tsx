import HeroTabs from '../src/components/HeroTabs';

export default async function Home() {
  // Default knowledge structure (will be populated from file server-side)
  const knowledge = { fundamentos: [] } as any;

  return (
    <div className="max-w-7xl mx-auto">
      <HeroTabs knowledge={knowledge} />
    </div>
  );
}
