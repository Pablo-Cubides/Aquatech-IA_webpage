// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,

  // Set sampling rate for performance monitoring
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

  // Capture Console messages
  integrations: [Sentry.consoleIntegration()],

  // Performance Monitoring
  profilesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,

  // Environment
  environment: process.env.NODE_ENV,

  // Release tracking
  release: process.env.VERCEL_GIT_COMMIT_SHA || "development",

  // Debug mode in development
  debug: process.env.NODE_ENV === "development",

  // Enable error replay in production
  replaysSessionSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
  replaysOnErrorSampleRate: 1.0,

  // Filter out certain transactions
  beforeSend(event, hint) {
    // Don't send health check requests
    if (event.request?.url?.includes("/api/health")) {
      return null;
    }

    // Don't send webhook requests (they can be noisy)
    if (event.request?.url?.includes("/webhook")) {
      return null;
    }

    return event;
  },
});

export const initSentryServer = () => {
  // Sentry is already initialized above
  console.log("Sentry server initialized");
};
