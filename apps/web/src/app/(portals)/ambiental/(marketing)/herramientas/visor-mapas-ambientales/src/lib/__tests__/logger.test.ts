import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock process.env BEFORE importing logger
const originalEnv = process.env.NODE_ENV;

describe("Logger - Visor de Mapas Ambientales", () => {
  let consoleLogSpy: any;
  let consoleErrorSpy: any;

  beforeEach(() => {
    consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
    vi.clearAllMocks();
    vi.resetModules(); // Clear module cache
  });

  describe("development environment", () => {
    beforeEach(() => {
      vi.stubEnv("NODE_ENV", "development");
    });

    afterEach(() => {
      vi.unstubAllEnvs();
    });

    it("should log info messages", async () => {
      // Import AFTER setting NODE_ENV
      const { logger } = await import("../logger");
      logger.info("Test info message");

      expect(consoleLogSpy).toHaveBeenCalled();
      const call = consoleLogSpy.mock.calls[0];
      expect(call[0]).toContain("[INFO]");
      expect(call[2]).toBe("Test info message");
    });

    it("should log info with context", async () => {
      const { logger } = await import("../logger");
      const context = { userId: "123", action: "upload" };
      logger.info("User action", context);

      expect(consoleLogSpy).toHaveBeenCalled();
      const call = consoleLogSpy.mock.calls[0];
      expect(call[3]).toEqual(context);
    });

    it("should log warning messages", async () => {
      const { logger } = await import("../logger");
      logger.warn("Test warning");

      expect(consoleLogSpy).toHaveBeenCalled();
      const call = consoleLogSpy.mock.calls[0];
      expect(call[0]).toContain("[WARN]");
      expect(call[2]).toBe("Test warning");
    });

    it("should log warnings with context", async () => {
      const { logger } = await import("../logger");
      const context = { fileSize: "15MB", limit: "10MB" };
      logger.warn("File size exceeded", context);

      expect(consoleLogSpy).toHaveBeenCalled();
      const call = consoleLogSpy.mock.calls[0];
      expect(call[3]).toEqual(context);
    });

    it("should log error messages", async () => {
      const { logger } = await import("../logger");
      logger.error("Test error");

      expect(consoleLogSpy).toHaveBeenCalled();
      const call = consoleLogSpy.mock.calls[0];
      expect(call[0]).toContain("[ERROR]");
      expect(call[2]).toBe("Test error");
    });

    it("should log errors with Error object", async () => {
      const { logger } = await import("../logger");
      const error = new Error("Test error object");
      logger.error("Operation failed", error);

      expect(consoleLogSpy).toHaveBeenCalled();
      const call = consoleLogSpy.mock.calls[0];
      const context = call[3];
      expect(context.error.message).toBe("Test error object");
      expect(context.error.stack).toBeDefined();
    });

    it("should log errors with context", async () => {
      const { logger } = await import("../logger");
      const error = new Error("Upload error");
      const context = { datasetId: "456" };
      logger.error("Failed to upload", error, context);

      expect(consoleLogSpy).toHaveBeenCalled();
      const call = consoleLogSpy.mock.calls[0];
      expect(call[3].datasetId).toBe("456");
      expect(call[3].error.message).toBe("Upload error");
    });

    it("should handle non-Error objects", async () => {
      const { logger } = await import("../logger");
      const customError = { code: 500, message: "Custom error" };
      logger.error("Custom error", customError);

      expect(consoleLogSpy).toHaveBeenCalled();
      const call = consoleLogSpy.mock.calls[0];
      expect(call[3].error).toEqual(customError);
    });

    it("should log debug messages in development", async () => {
      const { logger } = await import("../logger");
      logger.debug("Debug message");

      expect(consoleLogSpy).toHaveBeenCalled();
      const call = consoleLogSpy.mock.calls[0];
      expect(call[0]).toContain("[DEBUG]");
      expect(call[2]).toBe("Debug message");
    });

    it("should log debug with context", async () => {
      const { logger } = await import("../logger");
      const context = { filters: ["air", "water"] };
      logger.debug("Filters applied", context);

      expect(consoleLogSpy).toHaveBeenCalled();
      const call = consoleLogSpy.mock.calls[0];
      expect(call[3]).toEqual(context);
    });

    it("should use blue style for info", async () => {
      const { logger } = await import("../logger");
      logger.info("Info");
      const style = consoleLogSpy.mock.calls[0][1];
      expect(style).toContain("#2196F3");
    });

    it("should use orange style for warn", async () => {
      const { logger } = await import("../logger");
      logger.warn("Warning");
      const style = consoleLogSpy.mock.calls[0][1];
      expect(style).toContain("#FF9800");
    });

    it("should use red style for error", async () => {
      const { logger } = await import("../logger");
      logger.error("Error");
      const style = consoleLogSpy.mock.calls[0][1];
      expect(style).toContain("#F44336");
    });

    it("should use gray style for debug", async () => {
      const { logger } = await import("../logger");
      logger.debug("Debug");
      const style = consoleLogSpy.mock.calls[0][1];
      expect(style).toContain("#9E9E9E");
    });
  });

  describe("production environment", () => {
    beforeEach(() => {
      vi.stubEnv("NODE_ENV", "production");
    });

    afterEach(() => {
      vi.unstubAllEnvs();
    });

    it("should only log errors in production", async () => {
      const { logger } = await import("../logger");
      const error = new Error("Production error");
      logger.error("Critical error", error);

      expect(consoleErrorSpy).toHaveBeenCalled();
      const output = consoleErrorSpy.mock.calls[0][0];
      expect(output).toContain("Critical error");
      expect(output).toContain("error");
    });

    it("should not log info in production", async () => {
      const { logger } = await import("../logger");
      logger.info("Info message");

      // Should not call console.log in production for info
      expect(consoleLogSpy).not.toHaveBeenCalled();
    });

    it("should not log debug in production", async () => {
      const { logger } = await import("../logger");
      logger.debug("Debug message");

      expect(consoleLogSpy).not.toHaveBeenCalled();
    });
  });
});
