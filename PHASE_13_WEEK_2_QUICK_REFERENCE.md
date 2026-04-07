# Phase 13 Week 2 - Quick Reference Guide

**راهنمای سریع برای مدیریت API پیشرفته**

---

## 🚀 Quick Start

### API Versioning Manager

```typescript
import { APIVersioningManager } from './engine/api/APIVersioningManager';

const versionManager = new APIVersioningManager();

// Register version
versionManager.registerVersion('2.0.0', new Date());

// Register route
versionManager.registerRoute('/api/users', '1.0.0', async (req) => {
  return { users: [] };
});

// Route request
const response = await versionManager.routeRequest('/api/users', '1.0.0', {});

// Deprecate version
versionManager.deprecateVersion('1.0.0');

// Add migration guide
versionManager.addMigrationGuide({
  fromVersion: '1.0.0',
  toVersion: '2.0.0',
  breaking: ['removed_field'],
  deprecated: ['old_field'],
  newFeatures: ['new_field'],
  migrationSteps: ['Update field names'],
});
```

### GraphQL Integration

```typescript
import { GraphQLIntegration } from './engine/api/GraphQLIntegration';

const graphql = new GraphQLIntegration();

// Register type
graphql.registerType({
  name: 'User',
  kind: 'OBJECT',
  fields: [
    { name: 'id', type: 'ID', args: [] },
    { name: 'name', type: 'String', args: [] },
  ],
});

// Register query
graphql.registerQuery({
  name: 'getUser',
  type: 'User',
  args: [{ name: 'id', type: 'ID', required: true }],
});

// Execute query
const result = await graphql.executeQuery({
  query: 'query { getUser(id: "1") { id name } }',
});

// Subscribe
const subId = graphql.subscribe({ query: 'subscription { userCreated { id name } }' }, (data) =>
  console.log(data)
);

// Unsubscribe
graphql.unsubscribe(subId);
```

### API Analytics Engine

```typescript
import { APIAnalyticsEngine } from './engine/api/APIAnalyticsEngine';

const analytics = new APIAnalyticsEngine();

// Track request
analytics.trackRequest({
  id: 'req-1',
  timestamp: Date.now(),
  method: 'GET',
  endpoint: '/api/users',
  version: '1.0.0',
  requestSize: 100,
  responseSize: 500,
  statusCode: 200,
  responseTime: 50,
});

// Get metrics
const metrics = analytics.getMetrics();
console.log(`Average response time: ${metrics.averageResponseTime}ms`);

// Get endpoint stats
const stats = analytics.getEndpointStats('/api/users', 'GET');

// Get top endpoints
const topEndpoints = analytics.getTopEndpoints(10);

// Get health status
const health = analytics.getHealthStatus();

// Export analytics
const report = analytics.exportAnalytics();
```

### Rate Limiting Advanced

```typescript
import { RateLimitingAdvanced } from './engine/api/RateLimitingAdvanced';

const rateLimiter = new RateLimitingAdvanced({
  algorithm: 'token-bucket',
  requestsPerSecond: 10,
  burstSize: 20,
  windowSize: 1000,
});

// Check limit
const status = rateLimiter.checkLimit('user-1');

if (status.allowed) {
  // Process request
} else {
  // Return 429 Too Many Requests
  console.log(`Retry after ${status.retryAfter} seconds`);
}

// Set user limit
rateLimiter.setUserLimit('premium-user', 100);

// Reset limit
rateLimiter.resetUserLimit('user-1');

// Get stats
const stats = rateLimiter.getStats();
```

### API Documentation Generator

```typescript
import { APIDocumentationGenerator } from './engine/api/APIDocumentationGenerator';

const docGen = new APIDocumentationGenerator();

// Register endpoint
docGen.registerEndpoint({
  path: '/api/users',
  method: 'GET',
  summary: 'Get users',
  description: 'Retrieve all users',
  parameters: [],
  responses: [{ status: 200, description: 'Success' }],
  tags: ['users'],
  deprecated: false,
});

// Register schema
docGen.registerSchema('User', {
  type: 'object',
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
  },
});

// Generate OpenAPI spec
const spec = docGen.generateOpenAPISpec('My API', '1.0.0', 'http://localhost:3000');

// Generate code examples
const jsExample = docGen.generateCodeExample(endpoint, 'javascript');
const pyExample = docGen.generateCodeExample(endpoint, 'python');
const curlExample = docGen.generateCodeExample(endpoint, 'curl');

// Generate markdown
const markdown = docGen.generateMarkdown();

// Export documentation
const openapi = docGen.exportDocumentation('openapi');
const html = docGen.exportDocumentation('html');
```

---

## 📊 Performance Targets

| Operation        | Target  | Actual |
| ---------------- | ------- | ------ |
| Route Lookup     | < 10ms  | ✅     |
| Query Execute    | < 100ms | ✅     |
| Analytics Track  | < 5ms   | ✅     |
| Rate Limit Check | < 5ms   | ✅     |
| Doc Generation   | < 50ms  | ✅     |

---

## 🔧 Configuration Examples

### High-Performance API

```typescript
const versionManager = new APIVersioningManager({
  warningPeriod: 90,
  sunsetPeriod: 180,
  notifyClients: true,
  gracefulDegradation: true,
});
```

### GraphQL with Caching

```typescript
const graphql = new GraphQLIntegration();
// Queries are automatically cached
// Mutations invalidate related cache
```

### Strict Rate Limiting

```typescript
const rateLimiter = new RateLimitingAdvanced({
  algorithm: 'token-bucket',
  requestsPerSecond: 5,
  burstSize: 10,
  windowSize: 1000,
});
```

### Comprehensive Analytics

```typescript
const analytics = new APIAnalyticsEngine();
// Automatically tracks all requests
// Calculates metrics every minute
// Keeps last hour of data
```

---

## 🎯 Common Patterns

### Version Migration Pattern

```typescript
// Check if version is deprecated
const version = versionManager.getVersionInfo('1.0.0');
if (version?.deprecated) {
  // Notify client about migration
  const guide = versionManager.getMigrationGuide('1.0.0', '2.0.0');
  console.log('Migration steps:', guide?.migrationSteps);
}
```

### GraphQL Query Optimization

```typescript
// Queries are automatically optimized
const result = await graphql.executeQuery({
  query: 'query { getUser(id: "1") { id name } }',
  variables: { userId: '1' },
});

// Results are cached for identical queries
```

### Rate Limit Enforcement

```typescript
// Check limit before processing
const status = rateLimiter.checkLimit(userId);

if (!status.allowed) {
  response.status(429);
  response.set('Retry-After', status.retryAfter);
  response.send('Too Many Requests');
  return;
}

// Process request
```

### Analytics Monitoring

```typescript
// Monitor health continuously
const health = analytics.getHealthStatus();

if (!health.healthy) {
  console.warn('API health issues:', health.warnings);
  // Alert operations team
}
```

---

## 📈 Monitoring

### Version Usage

```typescript
const stats = versionManager.getStats();
console.log(`V1 requests: ${stats.requestsV1}`);
console.log(`V2 requests: ${stats.requestsV2}`);
console.log(`Deprecated calls: ${stats.deprecatedCalls}`);
```

### GraphQL Performance

```typescript
const stats = graphql.getStats();
console.log(`Cache hit rate: ${stats.cacheHits / (stats.cacheHits + stats.cacheMisses)}`);
console.log(`Active subscriptions: ${stats.subscriptionsActive}`);
```

### API Health

```typescript
const metrics = analytics.getMetrics();
console.log(`Error rate: ${(metrics.errorRate * 100).toFixed(2)}%`);
console.log(`P99 response time: ${metrics.p99ResponseTime}ms`);
console.log(`Requests/sec: ${metrics.requestsPerSecond.toFixed(2)}`);
```

### Rate Limit Status

```typescript
const stats = rateLimiter.getStats();
console.log(`Allow rate: ${(stats.allowRate * 100).toFixed(2)}%`);
console.log(`Active users: ${stats.activeUsers}`);
console.log(`Blocked requests: ${stats.requestsBlocked}`);
```

---

## 🐛 Troubleshooting

### Version Not Found

```typescript
// Check if version exists
const version = versionManager.getVersionInfo('1.0.0');
if (!version) {
  console.log('Version not found');
}

// Get available versions
const versions = versionManager.getAllVersions();
```

### GraphQL Query Slow

```typescript
// Check query complexity
const plan = graphql.planQuery(query);
console.log(`Complexity: ${plan.complexity}`);
console.log(`Estimated time: ${plan.estimated Time}ms`);

// Clear cache if needed
graphql.clearCache();
```

### Rate Limit Issues

```typescript
// Check user limit
const limit = rateLimiter.getUserLimit('user-1');
console.log(`Remaining: ${limit?.remaining}`);

// Reset if needed
rateLimiter.resetUserLimit('user-1');
```

### Analytics Not Tracking

```typescript
// Check if requests are being tracked
const metrics = analytics.getMetrics();
console.log(`Total requests: ${metrics.totalRequests}`);

// Clear and restart if needed
analytics.clear();
```

---

## 📚 Files Reference

| File                           | Purpose            | Lines |
| ------------------------------ | ------------------ | ----- |
| `APIVersioningManager.ts`      | Version management | 280+  |
| `GraphQLIntegration.ts`        | GraphQL support    | 350+  |
| `APIAnalyticsEngine.ts`        | Analytics tracking | 350+  |
| `RateLimitingAdvanced.ts`      | Rate limiting      | 300+  |
| `APIDocumentationGenerator.ts` | Documentation      | 350+  |
| `phase-13-week-2-api.test.ts`  | Tests              | 600+  |

---

## 🔗 Related Resources

- `PHASE_13_PLANNING.md` - Full roadmap
- `PHASE_13_WEEK_2_COMPLETION.md` - Detailed report
- `PHASE_13_WEEK_1_COMPLETION.md` - Week 1 features
- `ARCHITECTURE.md` - System architecture

---

**Last Updated**: 8 آپریل 2026  
**Status**: ✅ COMPLETE
