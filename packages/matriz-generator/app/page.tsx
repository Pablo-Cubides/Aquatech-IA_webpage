// Note: In monorepo context, we use dynamic import with fallback
// The knowledge.json will be served from the portal wrapper
import HeroTabs from '@components/HeroTabs';

// Mock knowledge data - actual data comes from wrapper portal
const mockKnowledge = { fundamentos: [] };

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto">
      <HeroTabs knowledge={mockKnowledge} />
    </div>
  );
}
