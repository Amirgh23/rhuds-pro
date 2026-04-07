/**
 * Phase 13 Week 2 - Advanced API Management Integration Tests
 * تست‌های ادغام مدیریت API پیشرفته
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { APIVersioningManager } from '../../engine/api/APIVersioningManager';
import { GraphQLIntegration } from '../../engine/api/GraphQLIntegration';
import { APIAnalyticsEngine } from '../../engine/api/APIAnalyticsEngine';
import { RateLimitingAdvanced } from '../../engine/api/RateLimitingAdvanced';
import { APIDocumentationGenerator } from '../../engine/api/APIDocumentationGenerator';

describe('Phase 13 Week 2 - Advanced API Management', () => {
  describe('APIVersioningManager', () => {
    let versionManager: APIVersioningManager;

    beforeEach(() => {
      versionManager = new APIVersioningManager();
    });

    it('should register API versions', () => {
      versionManager.registerVersion('4.0.0', new Date());
      const versions = versionManager.getAllVersions();

      expect(versions.length).toBeGreaterThan(0);
      expect(versions.some((v) => v.version === '4.0.0')).toBe(true);
    });

    it('should register routes for versions', async () => {
      versionManager.registerRoute('/api/users', '1.0.0', async (req) => ({ users: [] }));

      const response = await versionManager.routeRequest('/api/users', '1.0.0', {});

      expect(response).toBeDefined();
    });

    it('should deprecate versions', () => {
      versionManager.deprecateVersion('1.0.0');
      const version = versionManager.getVersionInfo('1.0.0');

      expect(version?.deprecated).toBe(true);
      expect(version?.status).toBe('deprecated');
    });

    it('should add migration guides', () => {
      versionManager.addMigrationGuide({
        fromVersion: '1.0.0',
        toVersion: '2.0.0',
        breaking: ['removed_field'],
        deprecated: ['old_field'],
        newFeatures: ['new_field'],
        migrationSteps: ['Update field names'],
      });

      const guide = versionManager.getMigrationGuide('1.0.0', '2.0.0');

      expect(guide).toBeDefined();
      expect(guide?.breaking).toContain('removed_field');
    });

    it('should check version compatibility', () => {
      const compatible = versionManager.isCompatible('1.0.0', '1.5.0');
      const incompatible = versionManager.isCompatible('1.0.0', '2.0.0');

      expect(compatible).toBe(true);
      expect(incompatible).toBe(false);
    });

    it('should track version usage', async () => {
      versionManager.registerRoute('/api/test', '1.0.0', async (req) => ({ data: 'test' }));
      versionManager.registerRoute('/api/test', '2.0.0', async (req) => ({ data: 'test' }));

      await versionManager.routeRequest('/api/test', '1.0.0', {});
      await versionManager.routeRequest('/api/test', '2.0.0', {});

      const stats = versionManager.getStats();

      expect(stats.requestsV1).toBeGreaterThan(0);
      expect(stats.requestsV2).toBeGreaterThan(0);
    });
  });

  describe('GraphQLIntegration', () => {
    let graphql: GraphQLIntegration;

    beforeEach(() => {
      graphql = new GraphQLIntegration();
    });

    it('should register types', () => {
      graphql.registerType({
        name: 'User',
        kind: 'OBJECT',
        fields: [
          { name: 'id', type: 'ID', args: [] },
          { name: 'name', type: 'String', args: [] },
        ],
      });

      const schema = graphql.getSchema();

      expect(schema.types.some((t) => t.name === 'User')).toBe(true);
    });

    it('should register queries', () => {
      graphql.registerQuery({
        name: 'getUser',
        type: 'User',
        args: [{ name: 'id', type: 'ID', required: true }],
      });

      const schema = graphql.getSchema();

      expect(schema.queries.some((q) => q.name === 'getUser')).toBe(true);
    });

    it('should execute queries', async () => {
      const result = await graphql.executeQuery({
        query: 'query { getUser(id: "1") { id name } }',
      });

      expect(result).toBeDefined();
      expect(result.data).toBeDefined();
    });

    it('should cache query results', async () => {
      const query = { query: 'query { getUser(id: "1") { id name } }' };

      await graphql.executeQuery(query);
      const stats1 = graphql.getStats();

      await graphql.executeQuery(query);
      const stats2 = graphql.getStats();

      expect(stats2.cacheHits).toBeGreaterThan(stats1.cacheHits);
    });

    it('should execute mutations', async () => {
      graphql.registerMutation({
        name: 'createUser',
        type: 'User',
        args: [{ name: 'name', type: 'String', required: true }],
      });

      const result = await graphql.executeMutation({
        query: 'mutation { createUser(name: "John") { id name } }',
      });

      expect(result).toBeDefined();
    });

    it('should support subscriptions', () => {
      graphql.registerSubscription({
        name: 'userCreated',
        type: 'User',
        args: [],
      });

      const subId = graphql.subscribe(
        { query: 'subscription { userCreated { id name } }' },
        (data) => {
          console.log('Subscription data:', data);
        }
      );

      expect(subId).toBeDefined();

      const unsubscribed = graphql.unsubscribe(subId);

      expect(unsubscribed).toBe(true);
    });

    it('should get introspection', () => {
      graphql.registerQuery({
        name: 'getUser',
        type: 'User',
        args: [],
      });

      const introspection = graphql.getIntrospection();

      expect(introspection.types).toBeDefined();
      expect(introspection.queryType).toBe('Query');
    });
  });

  describe('APIAnalyticsEngine', () => {
    let analytics: APIAnalyticsEngine;

    beforeEach(() => {
      analytics = new APIAnalyticsEngine();
    });

    it('should track API requests', () => {
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

      const metrics = analytics.getMetrics();

      expect(metrics.totalRequests).toBe(1);
    });

    it('should calculate metrics', () => {
      for (let i = 0; i < 10; i++) {
        analytics.trackRequest({
          id: `req-${i}`,
          timestamp: Date.now(),
          method: 'GET',
          endpoint: '/api/users',
          version: '1.0.0',
          requestSize: 100,
          responseSize: 500,
          statusCode: 200,
          responseTime: 50 + i * 10,
        });
      }

      const metrics = analytics.getMetrics();

      expect(metrics.totalRequests).toBe(10);
      expect(metrics.averageResponseTime).toBeGreaterThan(0);
      expect(metrics.p95ResponseTime).toBeGreaterThan(0);
    });

    it('should track endpoint statistics', () => {
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

      const stats = analytics.getEndpointStats('/api/users', 'GET');

      expect(stats).toBeDefined();
      expect(stats?.requests).toBe(1);
    });

    it('should get top endpoints', () => {
      for (let i = 0; i < 5; i++) {
        analytics.trackRequest({
          id: `req-${i}`,
          timestamp: Date.now(),
          method: 'GET',
          endpoint: '/api/users',
          version: '1.0.0',
          requestSize: 100,
          responseSize: 500,
          statusCode: 200,
          responseTime: 50,
        });
      }

      const topEndpoints = analytics.getTopEndpoints(1);

      expect(topEndpoints.length).toBeGreaterThan(0);
      expect(topEndpoints[0].endpoint).toBe('/api/users');
    });

    it('should get health status', () => {
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

      const health = analytics.getHealthStatus();

      expect(health.healthy).toBeDefined();
      expect(health.errorRate).toBeDefined();
    });
  });

  describe('RateLimitingAdvanced', () => {
    let rateLimiter: RateLimitingAdvanced;

    beforeEach(() => {
      rateLimiter = new RateLimitingAdvanced({
        algorithm: 'token-bucket',
        requestsPerSecond: 10,
        burstSize: 20,
        windowSize: 1000,
      });
    });

    it('should allow requests within limit', () => {
      const status = rateLimiter.checkLimit('user-1');

      expect(status.allowed).toBe(true);
      expect(status.remaining).toBeGreaterThanOrEqual(0);
    });

    it('should block requests exceeding limit', () => {
      for (let i = 0; i < 25; i++) {
        rateLimiter.checkLimit('user-1');
      }

      const status = rateLimiter.checkLimit('user-1');

      expect(status.allowed).toBe(false);
    });

    it('should support sliding window algorithm', () => {
      const limiter = new RateLimitingAdvanced({
        algorithm: 'sliding-window',
        requestsPerSecond: 5,
        burstSize: 10,
        windowSize: 1000,
      });

      for (let i = 0; i < 5; i++) {
        limiter.checkLimit('user-1');
      }

      const status = limiter.checkLimit('user-1');

      expect(status.allowed).toBe(false);
    });

    it('should set user limits', () => {
      rateLimiter.setUserLimit('user-1', 5);

      for (let i = 0; i < 5; i++) {
        rateLimiter.checkLimit('user-1');
      }

      const status = rateLimiter.checkLimit('user-1');

      expect(status.allowed).toBe(false);
    });

    it('should reset user limits', () => {
      for (let i = 0; i < 25; i++) {
        rateLimiter.checkLimit('user-1');
      }

      rateLimiter.resetUserLimit('user-1');

      const status = rateLimiter.checkLimit('user-1');

      expect(status.allowed).toBe(true);
    });

    it('should track statistics', () => {
      rateLimiter.checkLimit('user-1');
      rateLimiter.checkLimit('user-2');

      const stats = rateLimiter.getStats();

      expect(stats.requestsAllowed).toBeGreaterThan(0);
      expect(stats.activeUsers).toBeGreaterThan(0);
    });
  });

  describe('APIDocumentationGenerator', () => {
    let docGen: APIDocumentationGenerator;

    beforeEach(() => {
      docGen = new APIDocumentationGenerator();
    });

    it('should register endpoints', () => {
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

      const endpoints = docGen.getEndpoints();

      expect(endpoints.length).toBe(1);
      expect(endpoints[0].path).toBe('/api/users');
    });

    it('should register schemas', () => {
      docGen.registerSchema('User', {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
        },
      });

      const stats = docGen.getStats();

      expect(stats.schemasGenerated).toBe(1);
    });

    it('should generate OpenAPI spec', () => {
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

      const spec = docGen.generateOpenAPISpec('Test API', '1.0.0', 'http://localhost:3000');

      expect(spec.openapi).toBe('3.0.0');
      expect(spec.info.title).toBe('Test API');
      expect(spec.paths['/api/users']).toBeDefined();
    });

    it('should generate code examples', () => {
      const endpoint: any = {
        path: '/api/users',
        method: 'GET',
        summary: 'Get users',
        parameters: [],
      };

      const jsExample = docGen.generateCodeExample(endpoint, 'javascript');
      const pyExample = docGen.generateCodeExample(endpoint, 'python');
      const curlExample = docGen.generateCodeExample(endpoint, 'curl');

      expect(jsExample).toContain('fetch');
      expect(pyExample).toContain('requests');
      expect(curlExample).toContain('curl');
    });

    it('should generate markdown documentation', () => {
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

      const markdown = docGen.generateMarkdown();

      expect(markdown).toContain('# API Documentation');
      expect(markdown).toContain('/api/users');
    });

    it('should export documentation', () => {
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

      const openapi = docGen.exportDocumentation('openapi');
      const markdown = docGen.exportDocumentation('markdown');

      expect(openapi).toBeDefined();
      expect(markdown).toBeDefined();
    });
  });

  describe('Integration Tests', () => {
    it('should work together in an API system', async () => {
      const versionManager = new APIVersioningManager();
      const graphql = new GraphQLIntegration();
      const analytics = new APIAnalyticsEngine();
      const rateLimiter = new RateLimitingAdvanced({
        algorithm: 'token-bucket',
        requestsPerSecond: 100,
        burstSize: 200,
        windowSize: 1000,
      });
      const docGen = new APIDocumentationGenerator();

      // Register endpoint
      versionManager.registerRoute('/api/users', '1.0.0', async (req) => ({ users: [] }));

      // Register GraphQL query
      graphql.registerQuery({
        name: 'getUsers',
        type: 'User',
        args: [],
      });

      // Register documentation
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

      // Check rate limit
      const limitStatus = rateLimiter.checkLimit('user-1');

      expect(limitStatus.allowed).toBe(true);

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

      expect(metrics.totalRequests).toBe(1);
    });
  });
});
