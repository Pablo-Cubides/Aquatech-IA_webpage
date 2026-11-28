import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";
import { hermeticTestEnv } from "../../vitest.hermetic";

export default defineConfig({
  plugins: [react() as any],
  // Test TSX files are excluded by Next's tsconfig; keep their runtime explicit.
  oxc: { jsx: { runtime: "automatic", importSource: "react" } },
  test: {
    globals: true,
    environment: "jsdom",
    // Entorno hermético (OPS-001): nada de base real, Sentry, Upstash ni escrituras al repo.
    env: hermeticTestEnv,
    globalSetup: ["./vitest.global-setup.ts"],
    testTimeout: 30000,
    hookTimeout: 30000,
    pool: "forks",
    fileParallelism: false,
    setupFiles: ["./vitest.setup.ts"],
    include: ["**/*.{test,spec}.{ts,tsx}"],
    coverage: {
      provider: "v8",
      // `json-summary` genera coverage-summary.json, que lee la puerta de cobertura del CI (ING-002).
      reporter: ["text", "json", "json-summary", "html"],
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
    },
  },
});
