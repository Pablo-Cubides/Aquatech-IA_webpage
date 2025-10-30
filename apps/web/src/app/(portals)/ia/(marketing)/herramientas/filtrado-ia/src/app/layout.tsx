import '../styles/globals.css';
import { Inter } from 'next/font/google';
import type { ReactNode } from 'react';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Cómo la IA filtra sus respuestas',
  description: 'App educativa sobre filtrado y alineamiento de IA',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className={inter.className} style={{ background: '#fff', color: '#222' }}>
        {children}
      </body>
    </html>
  );
}
