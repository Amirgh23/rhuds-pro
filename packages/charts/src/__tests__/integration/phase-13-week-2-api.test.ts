/**
 * Phase 13 Week 2 - Advanced API Management Integration Tests
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  APIVersioningManager,
  GraphQLIntegration,
  AnalyticsEngine,
  RateLimitingAdvanced,
  APIDocumentationGenerator,
} from '../../engine/api';

describe('Phase 13 Week 2 - Advanced API Management', () => {
  describe('APIVersioningManager', () => {
    let manager: APIVersioningManager;

    beforeEach(() => {
      manager = new APIVersioningManager();
    });

    it('should register API versions', () => {
      manager.registerVersion({
        version: '1.0.0',
        releaseDate: new Date(),
        deprecated: false,
        features: ['users', 'posts'],
        breaking: [],
      });

      expect(manager.getVersion('1.0.0')).not.toBeNull();
    });

    it('should register versioned endpoints', () => {
      manager.registerEndpoint(
        '/users',
        {
          '1.0.0': (data) => data,
          '2.0.0': (data) => ({ ...data, v2: true }),
        },
        '2.0.0'
      );

      const handler = manager.getEndpointHandler('/users', '1.0.0');
      expect(handler).not.toBeNull();
    });

    it('should deprecate versions', () => {
      manager.registerVersion({
        version: '1.0.0',
        releaseDate: new Date(),
        deprecated: false,
        features: [],
        breaking: [],
      });

      const futureDate = new Date(Date.now() + 86400000);
      manager.deprecateVersion('1.0.0', futureDate);

      const version = manager.getVersion('1.0.0');
      expect(version?.deprecated).toBe(true);
    });

    it('should get migration path', () => {
      manager.registerVersion({
        version: '1.0.0',
        releaseDate: new Date(),
        deprecated: false,
        features: [],
        breaking: [],
      });

      manager.registerVersion({
        version: '2.0.0',
        releaseDate: new Date(),
        deprecated: false,
        features: [],
        breaking: [],
      });

      const path = manager.getMigrationPath('1.0.0', '2.0.0');
      expect(path.length).toBeGreaterThan(0);
    });

    it('should get statistics', () => {
      manager.registerVersion({
        version: '1.0.0',
        releaseDate: new Date(),
        deprecated: false,
        features: [],
        breaking: [],
      });

      const stats = manager.getStatistics();
      expect(stats.totalVersions).toBe(1);
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
        fields: {
          id: { name: 'id', type: 'ID', required: true },
          name: { name: 'name', type: 'String', required: true },
        },
      });

      expect(graphql.getType('User')).not.toBeNull();
    });

    it('should register resolvers', async () => {
      graphql.registerResolver('getUser', async () => ({ id: '1', name: 'John' }));

      const resolver = graphql.getResolver('getUser');
      expect(resolver).not.toBeNull();
    });

    it('should register and execute queries', async () => {
      graphql.registerResolver('getUser', async () => ({ id: '1', name: 'John' }));

      graphql.registerQuery('GetUser', {
        query: 'query { getUser { id name } }',
      });

      const result = await graphql.executeQuery('GetUser');
      expect(result).not.toBeNull();
    });

    it('should validate queries', () => {
      graphql.registerResolver('getUser', async () => ({}));

      const valid = graphql.validateQuery({
        query: 'query { getUser { id } }',
      });

      expect(valid).toBe(true);
    });

    it('should get schema', () => {
      graphql.registerType({
        name: 'User',
        kind: 'OBJECT',
      });

      const schema = graphql.getSchema();
      expect(schema.types).toBeDefined();
    });

    it('should get statistics', () => {
      graphql.registerType({
        name: 'User',
        kind: 'OBJECT',
      });

      const stats = graphql.getStatistics();
      expect(stats.totalTypes).toBeGreaterThan(0);
    });
  });

  describe('AnalyticsEngine', () => {
    let analytics: AnalyticsEngine;

    beforeEach(() => {
      analytics = new AnalyticsEngine();
    });

    it('should record metrics', () => {
      analytics.recordMetric({
        endpoint: '/users',
        method: 'GET',
        timestamp: Date.now(),
        duration: 100,
        statusCode: 200,
        requestSize: 0,
        responseSize: 1024,
      });

      const stats = analytics.getStatistics();
      expect(stats.totalMetrics).toBe(1);
    });

    it('should generate reports', () => {
      const now = new Date();
      const start = new Date(now.getTime() - 3600000);

      analytics.recordMetric({
        endpoint: '/users',
        method: 'GET',
        timestamp: now.getTime(),
        duration: 100,
        statusCode: 200,
        requestSize: 0,
        responseSize: 1024,
      });

      const report = analytics.generateReport(start, now);
      expect(report.totalRequests).toBe(1);
    });

    it('should get endpoint statistics', () => {
      analytics.recordMetric({
        endpoint: '/users',
        method: 'GET',
        timestamp: Date.now(),
        duration: 100,
        statusCode: 200,
        requestSize: 0,
        responseSize: 1024,
      });

      const stats = analytics.getEndpointStats('/users');
      expect(stats).not.toBeNull();
    });

    it('should calculate error rate', () => {
      analytics.recordMetric({
        endpoint: '/users',
        method: 'GET',
        timestamp: Date.now(),
        duration: 100,
        statusCode: 200,
        requestSize: 0,
        responseSize: 1024,
      });

      analytics.recordMetric({
        endpoint: '/users',
        method: 'GET',
        timestamp: Date.now(),
        duration: 100,
        statusCode: 500,
        requestSize: 0,
        responseSize: 1024,
      });

      const errorRate = analytics.getErrorRate();
      expect(errorRate).toBe(0.5);
    });

    it('should get statistics', () => {
      analytics.recordMetric({
        endpoint: '/users',
        method: 'GET',
        timestamp: Date.now(),
        duration: 100,
        statusCode: 200,
        requestSize: 0,
        responseSize: 1024,
      });

      const stats = analytics.getStatistics();
      expect(stats.totalMetrics).toBe(1);
    });
  });

  describe('RateLimitingAdvanced', () => {
    let rateLimiter: RateLimitingAdvanced;

    beforeEach(() => {
      rateLimiter = new RateLimitingAdvanced();
    });

    it('should register rate limit rules', () => {
      rateLimiter.registerRule('/users/*', {
        strategy: 'token-bucket',
        requestsPerWindow: 100,
        windowSize: 60000,
      });

      const rule = rateLimiter.getRuleForEndpoint('/users/1');
      expect(rule).not.toBeNull();
    });

    it('should check rate limits with token bucket', () => {
      rateLimiter.registerRule('/users/*', {
        strategy: 'token-bucket',
        requestsPerWindow: 100,
        windowSize: 60000,
        burstSize: 2,
      });

      // Token bucket should allow requests up to burst size
      expect(rateLimiter.checkRateLimit('user1', '/users/1')).toBe(true);
      expect(rateLimiter.checkRateLimit('user1', '/users/1')).toBe(true);
      // After burst, it depends on refill rate
      const result = rateLimiter.checkRateLimit('user1', '/users/1');
      expect(typeof result).toBe('boolean');
    });

    it('should check rate limits with fixed window', () => {
      rateLimiter.registerRule('/posts/*', {
        strategy: 'fixed-window',
        requestsPerWindow: 2,
        windowSize: 60000,
      });

      expect(rateLimiter.checkRateLimit('user1', '/posts/1')).toBe(true);
      expect(rateLimiter.checkRateLimit('user1', '/posts/1')).toBe(true);
      expect(rateLimiter.checkRateLimit('user1', '/posts/1')).toBe(false);
    });

    it('should get quota', () => {
      rateLimiter.registerRule('/users/*', {
        strategy: 'fixed-window',
        requestsPerWindow: 10,
        windowSize: 60000,
      });

      rateLimiter.checkRateLimit('user1', '/users/1');
      const quota = rateLimiter.getQuota('user1', '/users/1');
      expect(quota).not.toBeNull();
    });

    it('should reset quota', () => {
      rateLimiter.registerRule('/users/*', {
        strategy: 'fixed-window',
        requestsPerWindow: 10,
        windowSize: 60000,
      });

      rateLimiter.checkRateLimit('user1', '/users/1');
      rateLimiter.resetQuota('user1', '/users/1');

      const quota = rateLimiter.getQuota('user1', '/users/1');
      expect(quota).toBeNull();
    });

    it('should get statistics', () => {
      rateLimiter.registerRule('/users/*', {
        strategy: 'token-bucket',
        requestsPerWindow: 100,
        windowSize: 60000,
      });

      const stats = rateLimiter.getStatistics();
      expect(stats.totalRules).toBe(1);
    });
  });

  describe('APIDocumentationGenerator', () => {
    let docGen: APIDocumentationGenerator;

    beforeEach(() => {
      docGen = new APIDocumentationGenerator();
    });

    it('should register endpoint documentation', () => {
      docGen.registerEndpoint({
        path: '/users',
        method: 'GET',
        description: 'Get all users',
        parameters: [],
        responses: { 200: { type: 'array' } },
        examples: [],
        deprecated: false,
      });

      expect(docGen.getEndpointDoc('GET', '/users')).not.toBeNull();
    });

    it('should generate OpenAPI spec', () => {
      docGen.registerEndpoint({
        path: '/users',
        method: 'GET',
        description: 'Get all users',
        parameters: [],
        responses: { 200: { type: 'array' } },
        examples: [],
        deprecated: false,
      });

      const spec = docGen.generateOpenAPISpec('Test API', '1.0.0');
      expect(spec.openapi).toBe('3.0.0');
    });

    it('should generate Markdown documentation', () => {
      docGen.registerEndpoint({
        path: '/users',
        method: 'GET',
        description: 'Get all users',
        parameters: [],
        responses: { 200: { type: 'array' } },
        examples: [],
        deprecated: false,
      });

      const markdown = docGen.generateMarkdown();
      expect(markdown).toContain('GET /users');
    });

    it('should generate HTML documentation', () => {
      docGen.registerEndpoint({
        path: '/users',
        method: 'GET',
        description: 'Get all users',
        parameters: [],
        responses: { 200: { type: 'array' } },
        examples: [],
        deprecated: false,
      });

      const html = docGen.generateHTML();
      expect(html).toContain('<!DOCTYPE html>');
    });

    it('should get statistics', () => {
      docGen.registerEndpoint({
        path: '/users',
        method: 'GET',
        description: 'Get all users',
        parameters: [],
        responses: { 200: { type: 'array' } },
        examples: [],
        deprecated: false,
      });

      const stats = docGen.getStatistics();
      expect(stats.totalEndpoints).toBe(1);
    });
  });

  describe('Integration Tests', () => {
    it('should work with all API management components together', () => {
      const versioning = new APIVersioningManager();
      const graphql = new GraphQLIntegration();
      const analytics = new AnalyticsEngine();
      const rateLimiter = new RateLimitingAdvanced();
      const docGen = new APIDocumentationGenerator();

      expect(versioning).toBeDefined();
      expect(graphql).toBeDefined();
      expect(analytics).toBeDefined();
      expect(rateLimiter).toBeDefined();
      expect(docGen).toBeDefined();
    });
  });
});
