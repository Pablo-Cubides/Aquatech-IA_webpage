import { defineConfig } from "vitest/config";
import path from "node:path";
import { hermeticTestEnv } from "../../vitest.hermetic";

export default defineConfig({
  resolve: { alias: { "@": path.resolve(__dirname, "./src") } },
  test: {
    environment: "node",
    // Entorno hermético (OPS-001): nada de base real, Sentry, Upstash ni correo.
    env: hermeticTestEnv,
    include: ["src/**/*.test.ts"],
    clearMocks: true,
    restoreMocks: true,
    mockReset: true,
  },
});
