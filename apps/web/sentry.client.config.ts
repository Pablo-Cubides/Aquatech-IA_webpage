// Sentry client config placeholder
// Only initialize if SENTRY_DSN is set

export const initSentryClient = () => {
  if (!process.env.SENTRY_DSN) return;
  // Sentry.init({ dsn: process.env.SENTRY_DSN });
};
