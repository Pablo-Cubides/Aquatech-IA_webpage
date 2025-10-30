/* eslint-disable no-console */
import * as Sentry from "@sentry/nextjs";

export const logEvent = (
  eventName: string,
  params?: Record<string, unknown>,
  userId?: string,
) => {
  if (process.env.NODE_ENV === "development") {
    console.log(`[Analytics Event] ${eventName}`, params || "");
  }

  try {
    Sentry.captureMessage(`Tool Event: ${eventName}`, {
      level: "info",
      tags: {
        tool: "modelos-difusion",
        event: eventName,
        ...(userId && { userId }),
      },
      extra: params || {},
    });
  } catch (error) {
    console.error("Failed to log event to Sentry:", error);
  }
};

export const trackPageView = (path: string, userId?: string) => {
  logEvent("page_view", { page_path: path }, userId);
};

export const trackToolEvent = (
  eventType: string,
  details?: Record<string, unknown>,
  userId?: string,
) => {
  logEvent(`tool_${eventType}`, details, userId);
};

export const trackError = (
  error: Error,
  context?: Record<string, unknown>,
  userId?: string,
) => {
  Sentry.captureException(error, {
    tags: {
      tool: "modelos-difusion",
      ...(userId && { userId }),
    },
    extra: context || {},
  });
};
