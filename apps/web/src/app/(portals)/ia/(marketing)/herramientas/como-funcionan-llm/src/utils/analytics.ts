/* eslint-disable no-console */
import * as Sentry from '@sentry/nextjs';

// Analytics service integrated with Sentry for production tracking
// and console logging for development

export const logEvent = (eventName: string, params?: Record<string, unknown>, userId?: string) => {
  // Development logging
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Analytics Event] ${eventName}`, params || '');
  }

  // Sentry tracking for production
  try {
    Sentry.captureMessage(`Tool Event: ${eventName}`, {
      level: 'info',
      tags: {
        tool: 'como-funcionan-llm',
        event: eventName,
        ...(userId && { userId }),
      },
      extra: params || {},
    });
  } catch (error) {
    console.error('Failed to log event to Sentry:', error);
  }
};

export const trackPageView = (path: string, userId?: string) => {
  logEvent('page_view', { page_path: path }, userId);
};

// Track tool-specific events
export const trackToolEvent = (eventType: string, details?: Record<string, unknown>, userId?: string) => {
  logEvent(`tool_${eventType}`, details, userId);
};

// Error tracking
export const trackError = (error: Error, context?: Record<string, unknown>, userId?: string) => {
  Sentry.captureException(error, {
    tags: {
      tool: 'como-funcionan-llm',
      ...(userId && { userId }),
    },
    extra: context || {},
  });
};

