# Monitoring Quick Reference Guide

**Last Updated**: April 6, 2026
**Phase**: 6 - Monitoring & Optimization
**Status**: ✅ ACTIVE

---

## 🚀 Quick Start

### 1. Initialize Monitoring in App.tsx

```typescript
import { useMonitoring } from './hooks/useMonitoring';
import MonitoringDashboard from './components/MonitoringDashboard';

function App() {
  const { logger, alertManager } = useMonitoring({
    enableSentry: true,
    enableAnalytics: true,
    enableLogging: true,
    enableAlerts: true,
  });

  return (
    <div>
      {/* Your app */}
      <MonitoringDashboard />
    </div>
  );
}
```

### 2. Track Page Views

```typescript
import { usePageTracking } from './hooks/useMonitoring';

function HomePage() {
  usePageTracking('HomePage');
  return <div>Home</div>;
}
```

### 3. Track Errors

```typescript
import { useErrorTracking } from './hooks/useMonitoring';

function MyComponent() {
  const trackError = useErrorTracking();

  const handleClick = () => {
    try {
      // Your code
    } catch (error) {
      trackError(error as Error, 'MyComponent.handleClick');
    }
  };

  return <button onClick={handleClick}>Click</button>;
}
```

### 4. Log Messages

```typescript
import { logger } from './config/logging.config';

// Debug
logger.debug('Debug message', 'context', { data: 'value' });

// Info
logger.info('Info message', 'context');

// Warning
logger.warn('Warning message', 'context');

// Error
logger.error('Error message', 'context', {}, error);

// Critical
logger.critical('Critical message', 'context', {}, error);
```

### 5. Track Custom Events

```typescript
import { trackEvent } from './config/analytics.config';

trackEvent('button_clicked', {
  button_name: 'submit',
  page: 'checkout',
});
```

### 6. Check Metrics for Alerts

```typescript
import { alertManager } from './config/alerts.config';

// Check page load time
alertManager.checkMetrics('page_load_time', 2500);

// Check memory usage
alertManager.checkMetrics('memory_usage', 35);

// Check error rate
alertManager.checkMetrics('error_rate', 0.05);
```

---

## 📊 Monitoring Systems

### Sentry (Error Tracking)

**Import**:

```typescript
import {
  initializeSentry,
  captureException,
  captureMessage,
  setSentryUser,
  addBreadcrumb,
  setContext,
  setTag,
} from './config/sentry.config';
```

**Usage**:

```typescript
// Capture exception
captureException(error, { context: 'MyComponent' });

// Capture message
captureMessage('Something happened', 'warning');

// Set user
setSentryUser('user-123', 'user@example.com', 'username');

// Add breadcrumb
addBreadcrumb('User clicked button', 'user-action');

// Set context
setContext('user', { id: '123', email: 'user@example.com' });

// Set tag
setTag('environment', 'production');
```

### Google Analytics (Performance Tracking)

**Import**:

```typescript
import {
  initializeAnalytics,
  trackPageView,
  trackEvent,
  trackPerformanceMetrics,
  trackUserEngagement,
  trackError,
  trackConversion,
  setUserId,
  trackCustomMetric,
  trackMemoryUsage,
  trackCPUUsage,
  trackFrameRate,
} from './config/analytics.config';
```

**Usage**:

```typescript
// Track page view
trackPageView('/home', 'Home Page');

// Track event
trackEvent('purchase', { value: 99.99, currency: 'USD' });

// Track performance
trackPerformanceMetrics();

// Track engagement
trackUserEngagement();

// Track error
trackError(error, 'MyComponent');

// Track conversion
trackConversion('purchase-123', 99.99);

// Set user ID
setUserId('user-123');

// Track custom metric
trackCustomMetric('custom_metric', 42, 'custom');

// Track memory
trackMemoryUsage();

// Track CPU
trackCPUUsage();

// Track frame rate
trackFrameRate();
```

### Logging (Centralized Logs)

**Import**:

```typescript
import {
  logger,
  initializeLogging,
  logPerformanceMetrics,
  logMemoryUsage,
  logNetworkRequest,
  logUserAction,
  logComponentLifecycle,
} from './config/logging.config';
```

**Usage**:

```typescript
// Log messages
logger.debug('Debug message', 'context', { data: 'value' });
logger.info('Info message', 'context');
logger.warn('Warning message', 'context');
logger.error('Error message', 'context', {}, error);
logger.critical('Critical message', 'context', {}, error);

// Get logs
const allLogs = logger.getLogs();
const errorLogs = logger.getLogsByLevel('ERROR');
const contextLogs = logger.getLogsByContext('MyComponent');

// Export logs
const json = logger.exportLogs();

// Get statistics
const stats = logger.getStatistics();
// { total: 100, debug: 20, info: 50, warn: 20, error: 10, critical: 0 }

// Log performance
logPerformanceMetrics();

// Log memory
logMemoryUsage();

// Log network request
logNetworkRequest('GET', '/api/data', 200, 150, 1024);

// Log user action
logUserAction('button_clicked', { button: 'submit' });

// Log component lifecycle
logComponentLifecycle('MyComponent', 'mount', { props: {} });
```

### Alerts (Alert Management)

**Import**:

```typescript
import {
  alertManager,
  initializeAlerts,
  ALERT_RULES,
  AlertSeverity,
  AlertChannel,
} from './config/alerts.config';
```

**Usage**:

```typescript
// Check metrics
alertManager.checkMetrics('page_load_time', 2500);
alertManager.checkMetrics('memory_usage', 35);
alertManager.checkMetrics('error_rate', 0.05);

// Get alerts
const activeAlerts = alertManager.getActiveAlerts();
const allAlerts = alertManager.getAlerts();

// Acknowledge alert
alertManager.acknowledgeAlert('alert-id');

// Resolve alert
alertManager.resolveAlert('alert-id');

// Get statistics
const stats = alertManager.getStatistics();
// { total: 10, active: 2, critical: 1, warning: 1, info: 0 }
```

---

## 🎯 Common Tasks

### Track User Signup

```typescript
import { setSentryUser } from './config/sentry.config';
import { setUserId } from './config/analytics.config';
import { logger } from './config/logging.config';

function handleSignup(user) {
  setSentryUser(user.id, user.email, user.username);
  setUserId(user.id);
  logger.info('User signed up', 'auth', { userId: user.id });
}
```

### Track Page Performance

```typescript
import { usePerformanceTracking } from './hooks/useMonitoring';

function HomePage() {
  usePerformanceTracking();
  return <div>Home</div>;
}
```

### Track User Interactions

```typescript
import { useUserTracking } from './hooks/useMonitoring';

function App() {
  useUserTracking();
  return <div>App</div>;
}
```

### Track Network Requests

```typescript
import { useNetworkTracking } from './hooks/useMonitoring';

function App() {
  useNetworkTracking();
  return <div>App</div>;
}
```

### Handle Errors

```typescript
import { captureException } from './config/sentry.config';
import { logger } from './config/logging.config';

try {
  // Your code
} catch (error) {
  captureException(error as Error, { context: 'MyComponent' });
  logger.error('Error occurred', 'MyComponent', {}, error as Error);
}
```

### Create Error Boundary

```typescript
import { captureException } from './config/sentry.config';

class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    captureException(error, { errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return <div>Error occurred</div>;
    }
    return this.props.children;
  }
}
```

---

## 📈 Monitoring Dashboard

### Access Dashboard

```typescript
import MonitoringDashboard from './components/MonitoringDashboard';

// In your page
<MonitoringDashboard />
```

### Dashboard Features

- **Metrics Tab**: Real-time performance metrics
- **Alerts Tab**: Active alerts and notifications
- **Logs Tab**: Recent log entries
- **Refresh Button**: Manual refresh of metrics

### Metrics Displayed

- Page Load Time
- Memory Usage
- Error Rate
- Uptime

---

## 🔔 Alert Rules

### Pre-configured Rules

```
Performance:
  - page-load-time-high: > 5s
  - tti-high: > 7s
  - fcp-high: > 2s
  - memory-usage-high: > 70MB
  - memory-usage-critical: > 100MB
  - cpu-usage-high: > 50%
  - cpu-usage-critical: > 80%
  - frame-rate-low: < 50 FPS

Reliability:
  - error-rate-high: > 0.5%
  - error-rate-critical: > 1%
  - critical-error-detected: > 0
  - uptime-low: < 99%

User:
  - api-response-time-high: > 3s
  - user-satisfaction-low: < 4.0/5
```

### Alert Channels

- Email
- Slack
- PagerDuty
- SMS
- Webhook

---

## 🧪 Testing

### Test Error Tracking

```typescript
import { captureException } from './config/sentry.config';

// In console
captureException(new Error('Test error'));
```

### Test Analytics

```typescript
import { trackEvent } from './config/analytics.config';

// In console
trackEvent('test_event', { test: true });
```

### Test Logging

```typescript
import { logger } from './config/logging.config';

// In console
logger.info('Test log', 'test');
```

### Test Alerts

```typescript
import { alertManager } from './config/alerts.config';

// In console
alertManager.checkMetrics('page_load_time', 6000); // Trigger alert
```

---

## 📋 Environment Variables

```bash
# Sentry
VITE_SENTRY_DSN=https://your-dsn@sentry.io/project-id

# Google Analytics
VITE_GA_ID=G-XXXXXXXXXX

# Logging
VITE_LOG_ENDPOINT=/api/logs

# Alerts
VITE_ALERT_EMAIL=alerts@example.com
VITE_ALERT_SLACK_WEBHOOK=https://hooks.slack.com/...
VITE_ALERT_PAGERDUTY_KEY=your-key

# Feature Flags
VITE_ENABLE_SENTRY=true
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_LOGGING=true
VITE_ENABLE_ALERTS=true
```

---

## 🚀 Best Practices

1. **Initialize Early**: Call useMonitoring in App.tsx
2. **Track Page Views**: Use usePageTracking in each page
3. **Handle Errors**: Use try-catch with error tracking
4. **Log Important Events**: Use logger for key actions
5. **Monitor Performance**: Track metrics regularly
6. **Set User Context**: Identify users for better debugging
7. **Use Breadcrumbs**: Track user actions leading to errors
8. **Configure Alerts**: Set up alerts for critical metrics
9. **Review Logs**: Check logs regularly for issues
10. **Test Systems**: Verify all monitoring systems work

---

## 📞 Support

### Documentation

- Setup Guide: `WEEK_1_SETUP_GUIDE.md`
- Phase 6 Overview: `PHASE_6_MONITORING_OPTIMIZATION.md`
- Action Plan: `PHASE_6_ACTION_PLAN.md`
- Week 1 Complete: `PHASE_6_WEEK_1_COMPLETE.md`

### Configuration Files

- Sentry: `packages/demo-app/src/config/sentry.config.ts`
- Analytics: `packages/demo-app/src/config/analytics.config.ts`
- Logging: `packages/demo-app/src/config/logging.config.ts`
- Alerts: `packages/demo-app/src/config/alerts.config.ts`

### Hooks

- useMonitoring: `packages/demo-app/src/hooks/useMonitoring.ts`

### Components

- MonitoringDashboard: `packages/demo-app/src/components/MonitoringDashboard.tsx`

---

**Monitoring Quick Reference** ✅
**Last Updated**: April 6, 2026
**Status**: ACTIVE

</content>
