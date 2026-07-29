import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    dangerouslyIgnoreUnhandledErrors: true,
    testTimeout: 15000,
    hookTimeout: 15000,
    pool: "forks",
    setupFiles: ["./vitest.setup.ts"],
    include: ["**/*.{test,spec}.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "dist/",
        ".next/",
        "**/*.config.{ts,js}",
        "**/*.d.ts",
      ],
    },
  },
  resolve: {
    dedupe: ["react", "react-dom"],
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@/tools/llm": path.resolve(
        __dirname,
        "./src/app/(portals)/ia/(marketing)/herramientas/explora-modelo/src",
      ),
    },
  },
});
