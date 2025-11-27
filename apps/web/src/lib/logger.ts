/**
 * Logger Estructurado
 * Sistema de logging centralizado para el proyecto Mapa Ambiental
 * En desarrollo: console output
 * En producción: preparado para integración con Sentry/Winston
 */

type LogLevel = "info" | "warn" | "error" | "debug";

interface LogContext {
  [key: string]: any;
}

class Logger {
  private isDevelopment: boolean;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === "development";
  }

  /**
   * Info log
   * Use for: successful operations, normal application flow
   */
  info(message: string, context?: LogContext): void {
    this.log("info", message, context);
  }

  /**
   * Warning log
   * Use for: unusual but non-critical situations
   */
  warn(message: string, context?: LogContext): void {
    this.log("warn", message, context);
  }

  /**
   * Error log
   * Use for: captured errors that need investigation
   */
  error(message: string, error?: Error | unknown, context?: LogContext): void {
    const errorContext = {
      ...context,
      error:
        error instanceof Error
          ? {
              message: error.message,
              stack: error.stack,
              name: error.name,
            }
          : error,
    };
    this.log("error", message, errorContext);
  }

  /**
   * Debug log
   * Use for: detailed debugging information
   */
  debug(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      this.log("debug", message, context);
    }
  }

  private log(level: LogLevel, message: string, context?: LogContext): void {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      ...context,
    };

    if (this.isDevelopment) {
      // En desarrollo: output colorido a consola
      this.consoleOutput(level, message, context);
    } else {
      // En producción: preparado para servicio de logging
      // La empresa integrará con Sentry, Winston, CloudWatch, etc.
      this.productionLog(logEntry);
    }
  }

  private consoleOutput(
    level: LogLevel,
    message: string,
    context?: LogContext,
  ): void {
    const styles = {
      info: "color: #2196F3; font-weight: bold",
      warn: "color: #FF9800; font-weight: bold",
      error: "color: #F44336; font-weight: bold",
      debug: "color: #9E9E9E; font-weight: bold",
    };

    // Check if running in browser or node
    const isBrowser = typeof window !== "undefined";

    if (isBrowser) {
      console.log(
        `%c[${level.toUpperCase()}]`,
        styles[level],
        message,
        context ? context : "",
      );
    } else {
      // Node.js output
      console.log(
        `[${level.toUpperCase()}] ${message}`,
        context ? JSON.stringify(context) : "",
      );
    }
  }

  private productionLog(logEntry: any): void {
    // En producción, la empresa configurará integración con:
    // - Sentry para error tracking
    // - Winston para logs estructurados
    // - CloudWatch/Datadog para monitoring

    // For now, we only save to avoid losing critical information
    if (logEntry.level === "error") {
      console.error(JSON.stringify(logEntry));
    }
  }
}

// Singleton instance
export const logger = new Logger();
