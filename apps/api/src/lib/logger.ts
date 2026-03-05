import { prisma } from "@ia-next/database";
import type { Prisma } from "@prisma/client";

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
  [key: string]: unknown;
}

interface QueuedLog {
  level: LogLevel;
  message: string;
  context?: LogContext;
  timestamp: Date;
}

class Logger {
  private queue: QueuedLog[] = [];
  private flushInterval: NodeJS.Timeout | null = null;
  private readonly BATCH_SIZE = 50;
  private readonly MAX_QUEUE_SIZE = 5000;
  private readonly FLUSH_INTERVAL_MS = 5000; // 5 seconds
  private isFlushing = false;
  private droppedLogs = 0;

  constructor() {
    // Start flush interval
    this.startFlushInterval();

    // Flush on process exit
    if (typeof process !== "undefined") {
      process.on("beforeExit", () => this.flushSync());
      process.on("SIGINT", () => {
        this.flushSync();
        process.exit(0);
      });
      process.on("SIGTERM", () => {
        this.flushSync();
        process.exit(0);
      });
    }
  }

  private startFlushInterval() {
    if (this.flushInterval) return;

    this.flushInterval = setInterval(() => {
      this.flush().catch(console.error);
    }, this.FLUSH_INTERVAL_MS);

    // Don't keep process alive just for logging
    if (this.flushInterval.unref) {
      this.flushInterval.unref();
    }
  }

  private async flush(): Promise<void> {
    if (this.isFlushing || this.queue.length === 0) return;

    this.isFlushing = true;
    const logsToFlush = this.queue.splice(0, this.BATCH_SIZE);

    try {
      // Batch insert to database
      await prisma.systemLog.createMany({
        data: logsToFlush.map((log) => ({
          level: log.level,
          message: log.message,
          context: (log.context || {}) as Prisma.InputJsonValue,
          traceId: log.context?.traceId,
          userId: log.context?.userId,
          ipAddress: log.context?.ipAddress,
          userAgent: log.context?.userAgent,
          endpoint: log.context?.endpoint,
          method: log.context?.method,
          statusCode: log.context?.statusCode,
          duration: log.context?.duration,
          createdAt: log.timestamp,
        })),
        skipDuplicates: true,
      });

      // If there are more logs, schedule another flush immediately
      if (this.queue.length > 0) {
        setImmediate(() => this.flush());
      }
    } catch (error) {
      console.error("Failed to flush logs to database:", error);
      // Re-add logs to queue for retry (at the beginning) with bounded memory
      this.ensureQueueCapacity(logsToFlush.length);
      this.queue.unshift(...logsToFlush);
    } finally {
      this.isFlushing = false;
    }
  }

  private ensureQueueCapacity(incomingCount: number): void {
    const overflow = this.queue.length + incomingCount - this.MAX_QUEUE_SIZE;

    if (overflow > 0) {
      this.queue.splice(0, overflow);
      this.droppedLogs += overflow;

      if (this.droppedLogs % 100 === 0 || this.droppedLogs === overflow) {
        console.warn(
          `[Logger] Dropped ${this.droppedLogs} log entries due to queue pressure`,
        );
      }
    }
  }

  private flushSync(): void {
    // Synchronous flush on exit (best effort)
    if (this.queue.length === 0) return;

    console.log(`[Logger] Flushing ${this.queue.length} remaining logs...`);
    // In production, you might want to use a synchronous logging service here
  }

  private async log(
    level: LogLevel,
    message: string,
    context?: LogContext,
  ): Promise<void> {
    try {
      // Always log to console in development
      if (process.env.NODE_ENV === "development") {
        const logMethod =
          level === LogLevel.ERROR || level === LogLevel.FATAL
            ? console.error
            : level === LogLevel.WARN
              ? console.warn
              : console.log;

        logMethod(`[${level}]`, message, context || {});
      }

      // Add to queue for batch processing (bounded)
      this.ensureQueueCapacity(1);
      this.queue.push({
        level,
        message,
        context,
        timestamp: new Date(),
      });

      // Immediate flush for critical errors
      if (level === LogLevel.FATAL || level === LogLevel.ERROR) {
        await this.flush();
      }

      // Flush if queue is getting large
      if (this.queue.length >= this.BATCH_SIZE) {
        // Don't await - let it flush asynchronously
        this.flush().catch(console.error);
      }
    } catch (error) {
      // Fallback to console if queueing fails
      console.error("Failed to queue log:", error);
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

  // Manual flush method for testing or shutdown
  async forceFlush(): Promise<void> {
    await this.flush();
  }
}

export const logger = new Logger();
