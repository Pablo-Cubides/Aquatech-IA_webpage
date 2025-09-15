import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "../../packages/@ia-next/ui/src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // IA Portal (Dark Theme)
        ia: {
          background: "#18181b",
          foreground: "#ffffff",
          primary: "#3b82f6",
          secondary: "#64748b",
        },
        // Ambiental Portal (Light Theme)
        ambiental: {
          background: "#f4f4f5",
          foreground: "#18181b",
          primary: "#10b981",
          secondary: "#64748b",
        },
      },
    },
  },
  plugins: [],
};

export default config;
