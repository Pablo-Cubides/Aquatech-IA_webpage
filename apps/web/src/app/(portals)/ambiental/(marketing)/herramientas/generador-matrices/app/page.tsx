import fs from 'fs';
import path from 'path';
import HeroTabs from '../src/components/HeroTabs';

export default function Home() {
  // Read parsed knowledge JSON if available
  const kbPath = path.join(process.cwd(), 'content', 'knowledge', 'knowledge.json');
  let knowledge = { fundamentos: [] } as any;
  try { knowledge = JSON.parse(fs.readFileSync(kbPath, 'utf8')); } catch (e) { /* ignore */ }

  return (
    <div className="max-w-7xl mx-auto">
      <HeroTabs knowledge={knowledge} />
    </div>
  );
}
