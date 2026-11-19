"use client";

import { useEffect, useState } from "react";

interface ThemeToggleProps {
  onThemeChange?: (theme: "light" | "dark") => void;
}

export function ThemeToggle({ onThemeChange }: ThemeToggleProps) {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Leer del localStorage o usar preferencia del sistema
    const stored = localStorage.getItem("aula-score-theme") as
      | "light"
      | "dark"
      | null;
    const preferred =
      stored ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light");

    setTheme(preferred);
    document.documentElement.setAttribute("data-theme", preferred);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("aula-score-theme", newTheme);
    onThemeChange?.(newTheme);
  };

  if (!mounted) return null;

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-6 right-6 p-3 rounded-full bg-surface hover:bg-surface-hover transition-colors z-40"
      aria-label={`Cambiar a tema ${theme === "dark" ? "claro" : "oscuro"}`}
      title={`Tema ${theme === "dark" ? "claro" : "oscuro"}`}
    >
      {theme === "dark" ? "☀️" : "🌙"}
    </button>
  );
}
