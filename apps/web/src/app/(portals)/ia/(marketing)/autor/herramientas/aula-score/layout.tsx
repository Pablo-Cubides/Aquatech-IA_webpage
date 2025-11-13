import { ReactNode } from 'react';
import './theme.css';

export default function AulaScoreLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground" data-theme="dark">
      {children}
    </div>
  );
}
