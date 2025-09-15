import { prisma } from "@ia-next/database";

export enum LogLevel {
  DEBUG = "DEBUG",
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
  FATAL = "FATAL",
}

interface LogContext {
  traceId?: string;
  userId?: string;
  ipAddress?: string;
  userAgent?: string;
  endpoint?: string;
  method?: string;
  statusCode?: number;
  duration?: number;
  [key: string]: any;
}

class Logger {
  private async log(
    level: LogLevel,
    message: string,
    context?: LogContext,
  ): Promise<void> {
    try {
      // Log to database
      await prisma.systemLog.create({
        data: {
          level,
          message,
          context: context || {},
          traceId: context?.traceId,
          userId: context?.userId,
          ipAddress: context?.ipAddress,
          userAgent: context?.userAgent,
          endpoint: context?.endpoint,
          method: context?.method,
          statusCode: context?.statusCode,
          duration: context?.duration,
        },
      });

      // Also log to console for development
      if (process.env.NODE_ENV === "development") {
        const logMethod =
          level === LogLevel.ERROR || level === LogLevel.FATAL
            ? console.error
            : level === LogLevel.WARN
              ? console.warn
              : console.log;

        logMethod(`[${level}]`, message, context || {});
      }
    } catch (error) {
      // Fallback to console if database logging fails
      console.error("Failed to log to database:", error);
      console.log(`[${level}]`, message, context || {});
    }
  }

  debug(message: string, context?: LogContext) {
    return this.log(LogLevel.DEBUG, message, context);
  }

  info(message: string, context?: LogContext) {
    return this.log(LogLevel.INFO, message, context);
  }

  warn(message: string, context?: LogContext) {
    return this.log(LogLevel.WARN, message, context);
  }

  error(message: string, context?: LogContext) {
    return this.log(LogLevel.ERROR, message, context);
  }

  fatal(message: string, context?: LogContext) {
    return this.log(LogLevel.FATAL, message, context);
  }

  // Helper method for HTTP request logging
  request(
    method: string,
    endpoint: string,
    statusCode: number,
    duration: number,
    context?: Omit<
      LogContext,
      "method" | "endpoint" | "statusCode" | "duration"
    >,
  ) {
    const level =
      statusCode >= 500
        ? LogLevel.ERROR
        : statusCode >= 400
          ? LogLevel.WARN
          : LogLevel.INFO;

    return this.log(level, `${method} ${endpoint} - ${statusCode}`, {
      ...context,
      method,
      endpoint,
      statusCode,
      duration,
    });
  }
}

export const logger = new Logger();
