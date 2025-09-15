// Sentry server configuration placeholder
// Only initialize if SENTRY_DSN is provided

export const initSentry = () => {
  if (!process.env.SENTRY_DSN) {
    console.log("Sentry DSN not provided, skipping initialization");
    return;
  }

  // TODO: Implement Sentry server initialization
  // import * as Sentry from '@sentry/nextjs';
  // Sentry.init({
  //   dsn: process.env.SENTRY_DSN,
  //   environment: process.env.SENTRY_ENV || 'development',
  // });

  console.log("Sentry would be initialized here");
};

// Initialize on module load
initSentry();
