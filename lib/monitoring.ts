import * as Sentry from '@sentry/nextjs';
import LogRocket from 'logrocket';
import { Analytics } from '@vercel/analytics/react';
import posthog from 'posthog-js';

// Sentry Configuration
export const initSentry = () => {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    environment: process.env.NODE_ENV,
    tracesSampleRate: 0.1,
    beforeSend(event) {
      if (event.exception) {
        const error = event.exception.values?.[0];
        if (error?.value?.includes('Non-Error promise rejection')) {
          return null;
        }
      }
      return event;
    }
  });
};

// LogRocket Configuration
export const initLogRocket = () => {
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_LOGROCKET_ID) {
    LogRocket.init(process.env.NEXT_PUBLIC_LOGROCKET_ID);
    LogRocket.getSessionURL((sessionURL) => {
      Sentry.configureScope((scope) => {
        scope.setContext('LogRocket', { sessionURL });
      });
    });
  }
};

// PostHog Configuration
export const initPostHog = () => {
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
      loaded: (posthog) => {
        if (process.env.NODE_ENV === 'development') posthog.debug();
      }
    });
  }
};

// Google Analytics
export const gtag = (...args: any[]) => {
  if (typeof window !== 'undefined') {
    (window as any).gtag(...args);
  }
};

export const trackEvent = (action: string, category: string, label?: string, value?: number) => {
  gtag('event', action, {
    event_category: category,
    event_label: label,
    value: value
  });
  
  // Also track in PostHog
  if (typeof window !== 'undefined') {
    posthog.capture(action, { category, label, value });
  }
};

// User identification
export const identifyUser = (userId: string, traits?: Record<string, any>) => {
  LogRocket.identify(userId, traits);
  posthog.identify(userId, traits);
  Sentry.setUser({ id: userId, ...traits });
};

// Error tracking
export const trackError = (error: Error, context?: Record<string, any>) => {
  Sentry.captureException(error, { extra: context });
  LogRocket.captureException(error);
};