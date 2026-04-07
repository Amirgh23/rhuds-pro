/**
 * Sentry Configuration
 * Error tracking and monitoring setup
 */

let Sentry: any = null;
let BrowserTracing: any = null;

try {
  Sentry = require('@sentry/react');
  BrowserTracing = require('@sentry/tracing').BrowserTracing;
} catch (e) {
  console.warn('Sentry not available - error tracking disabled');
}

/**
 * Initialize Sentry for error tracking and performance monitoring
 */
export const initializeSentry = () => {
  if (!Sentry) return;

  const isDevelopment = import.meta.env.DEV;
  const isProduction = import.meta.env.PROD;

  Sentry.init({
    // DSN (Data Source Name) - Replace with your actual Sentry DSN
    dsn: import.meta.env.VITE_SENTRY_DSN || 'https://your-sentry-dsn@sentry.io/project-id',

    // Environment
    environment: isDevelopment ? 'development' : isProduction ? 'production' : 'staging',

    // Release version
    release: '1.0.0-phase6',

    // Performance Monitoring
    tracesSampleRate: isProduction ? 0.1 : 1.0,
    integrations: [
      new BrowserTracing({
        // Set sampling rate for performance monitoring
        tracingOrigins: ['localhost', /^\//],
        // Capture interactions
        routingInstrumentation: Sentry.reactRouterV6Instrumentation(window.history),
      }),
    ],

    // Error filtering
    beforeSend(event: any, hint: any) {
      // Filter out certain errors
      if (event.exception) {
        const error = hint.originalException;

        // Ignore network errors in development
        if (isDevelopment && error instanceof Error) {
          if (error.message.includes('Network') || error.message.includes('CORS')) {
            return null;
          }
        }

        // Ignore 404 errors
        if (error instanceof Error && error.message.includes('404')) {
          return null;
        }
      }

      return event;
    },

    // Breadcrumb filtering
    beforeBreadcrumb(breadcrumb: any, hint: any) {
      // Filter out certain breadcrumbs
      if (breadcrumb.category === 'console' && breadcrumb.level === 'debug') {
        return null;
      }

      return breadcrumb;
    },

    // Attach stack traces
    attachStacktrace: true,

    // Max breadcrumbs
    maxBreadcrumbs: 100,

    // Debug mode
    debug: isDevelopment,

    // Ignore errors
    ignoreErrors: [
      // Browser extensions
      'top.GLOBALS',
      // Random plugins/extensions
      'chrome-extension://',
      'moz-extension://',
      // Network errors
      'NetworkError',
      'Network request failed',
      // User cancelled
      'AbortError',
      'User cancelled',
    ],

    // Deny URLs
    denyUrls: [
      // Browser extensions
      /extensions\//i,
      /^chrome:\/\//i,
      /^moz-extension:\/\//i,
    ],

    // Allow URLs
    allowUrls: [
      // Your domain
      /https?:\/\/(www\.)?localhost/,
      /https?:\/\/(www\.)?your-domain\.com/,
    ],
  });

  // Set user context if available
  const user = localStorage.getItem('user');
  if (user) {
    try {
      const userData = JSON.parse(user);
      Sentry.setUser({
        id: userData.id,
        email: userData.email,
        username: userData.username,
      });
    } catch (e) {
      // Ignore parsing errors
    }
  }

  // Set tags
  Sentry.setTag('app_version', '1.0.0-phase6');
  Sentry.setTag('environment', isDevelopment ? 'development' : 'production');
};

/**
 * Capture exception
 */
export const captureException = (error: Error, context?: Record<string, any>) => {
  if (!Sentry) return;
  if (context) {
    Sentry.captureException(error, {
      contexts: {
        custom: context,
      },
    });
  } else {
    Sentry.captureException(error);
  }
};

/**
 * Capture message
 */
export const captureMessage = (message: string, level: string = 'info') => {
  if (!Sentry) return;
  Sentry.captureMessage(message, level);
};

/**
 * Set user context
 */
export const setSentryUser = (userId: string, email?: string, username?: string) => {
  if (!Sentry) return;
  Sentry.setUser({
    id: userId,
    email,
    username,
  });
};

/**
 * Clear user context
 */
export const clearSentryUser = () => {
  if (!Sentry) return;
  Sentry.setUser(null);
};

/**
 * Add breadcrumb
 */
export const addBreadcrumb = (
  message: string,
  category: string = 'custom',
  level: string = 'info',
  data?: Record<string, any>
) => {
  if (!Sentry) return;
  Sentry.addBreadcrumb({
    message,
    category,
    level,
    data,
  });
};

/**
 * Start transaction
 */
export const startTransaction = (name: string, op: string = 'http.request') => {
  if (!Sentry) return null;
  return Sentry.startTransaction({
    name,
    op,
  });
};

/**
 * Set context
 */
export const setContext = (name: string, context: Record<string, any>) => {
  if (!Sentry) return;
  Sentry.setContext(name, context);
};

/**
 * Set tag
 */
export const setTag = (key: string, value: string | number | boolean) => {
  if (!Sentry) return;
  Sentry.setTag(key, value);
};

/**
 * Set level
 */
export const setLevel = (level: string) => {
  if (!Sentry) return;
  Sentry.setLevel(level);
};

export default Sentry;
