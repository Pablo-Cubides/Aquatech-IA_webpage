import './globals.css'
import { ReactNode } from 'react'

export const metadata = {
  title: 'Relational Insight',
  description: 'Análisis de correlaciones entre columnas numéricas',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-default font-sans min-h-screen flex flex-col">
        <header className="flex items-center h-16 px-4 border-b border-gray-100 justify-between">
          <div className="font-bold text-primary text-xl">Relational Insight</div>
          <nav>
            <a href="/about" className="text-primary hover:underline text-sm font-medium">Acerca de</a>
          </nav>
        </header>
        <main className="flex-1 flex flex-col items-center justify-start w-full px-4 py-8">
          {children}
        </main>
        <footer className="text-xs text-gray-400 py-4 text-center border-t border-gray-100">
          © 2025 Relational Insight — Desarrollado con Next.js & FastAPI
        </footer>
      </body>
    </html>
  )
}
