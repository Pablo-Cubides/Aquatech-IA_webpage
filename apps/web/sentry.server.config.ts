// Sentry en el servidor (Node). Lo carga instrumentation.ts. Sin DSN no hace nada.
import * as Sentry from "@sentry/nextjs";
import {
  IGNORED_ERRORS,
  IGNORED_TRANSACTIONS,
  SERVER_TRACES_SAMPLE_RATE,
  scrubBreadcrumb,
  scrubEvent,
  sentryDsn,
  sentryEnvironment,
} from "@/lib/observability/sentry-options";

const dsn = sentryDsn();

if (dsn) {
  Sentry.init({
    dsn,
    environment: sentryEnvironment(),
    release: process.env.VERCEL_GIT_COMMIT_SHA,
    sendDefaultPii: false,
    tracesSampleRate: SERVER_TRACES_SAMPLE_RATE,
    ignoreErrors: IGNORED_ERRORS,
    ignoreTransactions: IGNORED_TRANSACTIONS,
    beforeSend: (event, hint) => scrubEvent(event, hint),
    beforeBreadcrumb: (breadcrumb) => scrubBreadcrumb(breadcrumb),
  });
}
