/**
 * Phase 15 Week 4 - Production Deployment & Monitoring Tests
 * Comprehensive test suite for deployment and monitoring features
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  DeploymentManager,
  type DeploymentConfig,
  type DeploymentStatus,
} from '../../engine/deployment/DeploymentManager';
import {
  ProductionMonitoring,
  type AlertConfig,
  type HealthCheckResult,
} from '../../engine/monitoring/ProductionMonitoring';
import {
  HealthCheckSystem,
  type EndpointConfig,
  type ServiceHealth,
} from '../../engine/health/HealthCheckSystem';

describe('Phase 15 Week 4 - Production Deployment & Monitoring', () => {
  // ============================================================================
  // DeploymentManager Tests
  // ============================================================================

  describe('DeploymentManager', () => {
    let deploymentManager: DeploymentManager;

    beforeEach(() => {
      deploymentManager = new DeploymentManager();
    });

    it('should create a deployment with valid config', () => {
      const config: DeploymentConfig = {
        environment: 'production',
        version: '2.0.0',
        timestamp: Date.now(),
        features: ['feature-1', 'feature-2'],
        rollbackEnabled: true,
      };

      const deployment = deploymentManager.createDeployment(config);

      expect(deployment).toBeDefined();
      expect(deployment.id).toMatch(/^deploy-/);
      expect(deployment.status).toBe('pending');
      expect(deployment.config).toEqual(config);
    });

    it('should start a deployment', () => {
      const config: DeploymentConfig = {
        environment: 'staging',
        version: '1.5.0',
        timestamp: Date.now(),
        features: [],
        rollbackEnabled: true,
      };

      const deployment = deploymentManager.createDeployment(config);
      const started = deploymentManager.startDeployment(deployment.id);

      expect(started).toBe(true);
      const status = deploymentManager.getDeploymentStatus(deployment.id);
      expect(status?.status).toBe('in-progress');
    });

    it('should complete a deployment with metrics', () => {
      const config: DeploymentConfig = {
        environment: 'production',
        version: '2.1.0',
        timestamp: Date.now(),
        features: ['feature-3'],
        rollbackEnabled: true,
      };

      const deployment = deploymentManager.createDeployment(config);
      deploymentManager.startDeployment(deployment.id);

      const metrics = { deploymentTime: 5000, successRate: 99.9 };
      const completed = deploymentManager.completeDeployment(deployment.id, metrics);

      expect(completed).toBe(true);
      const status = deploymentManager.getDeploymentStatus(deployment.id);
      expect(status?.status).toBe('completed');
      expect(status?.metrics).toEqual(metrics);
      expect(deploymentManager.getCurrentVersion()).toBe('2.1.0');
    });

    it('should fail a deployment with error message', () => {
      const config: DeploymentConfig = {
        environment: 'production',
        version: '2.2.0',
        timestamp: Date.now(),
        features: [],
        rollbackEnabled: true,
      };

      const deployment = deploymentManager.createDeployment(config);
      const failed = deploymentManager.failDeployment(deployment.id, 'Database migration failed');

      expect(failed).toBe(true);
      const status = deploymentManager.getDeploymentStatus(deployment.id);
      expect(status?.status).toBe('failed');
      expect(status?.error).toBe('Database migration failed');
    });

    it('should rollback a deployment', () => {
      const config1: DeploymentConfig = {
        environment: 'production',
        version: '1.0.0',
        timestamp: Date.now(),
        features: [],
        rollbackEnabled: true,
      };

      const deployment1 = deploymentManager.createDeployment(config1);
      deploymentManager.completeDeployment(deployment1.id, {});
      expect(deploymentManager.getCurrentVersion()).toBe('1.0.0');

      const config2: DeploymentConfig = {
        environment: 'production',
        version: '2.0.0',
        timestamp: Date.now(),
        features: [],
        rollbackEnabled: true,
      };

      const deployment2 = deploymentManager.createDeployment(config2);
      deploymentManager.completeDeployment(deployment2.id, {});
      expect(deploymentManager.getCurrentVersion()).toBe('2.0.0');

      const rolledBack = deploymentManager.rollbackDeployment(deployment2.id);

      expect(rolledBack).toBe(true);
      const status = deploymentManager.getDeploymentStatus(deployment2.id);
      expect(status?.status).toBe('rolled-back');
      // After rollback, version should revert to previous
      expect(deploymentManager.getCurrentVersion()).toBe('1.0.0');
    });

    it('should get deployment duration', () => {
      const config: DeploymentConfig = {
        environment: 'production',
        version: '2.3.0',
        timestamp: Date.now(),
        features: [],
        rollbackEnabled: true,
      };

      const deployment = deploymentManager.createDeployment(config);
      deploymentManager.startDeployment(deployment.id);

      vi.useFakeTimers();
      vi.advanceTimersByTime(5000);

      deploymentManager.completeDeployment(deployment.id, {});
      const duration = deploymentManager.getDeploymentDuration(deployment.id);

      vi.useRealTimers();

      expect(duration).toBeGreaterThan(0);
    });

    it('should list all deployments', () => {
      const config1: DeploymentConfig = {
        environment: 'production',
        version: '1.0.0',
        timestamp: Date.now(),
        features: [],
        rollbackEnabled: true,
      };

      const config2: DeploymentConfig = {
        environment: 'staging',
        version: '1.1.0',
        timestamp: Date.now(),
        features: [],
        rollbackEnabled: true,
      };

      deploymentManager.createDeployment(config1);
      deploymentManager.createDeployment(config2);

      const deployments = deploymentManager.listDeployments();

      expect(deployments.length).toBe(2);
    });

    it('should get deployment history with limit', () => {
      for (let i = 0; i < 5; i++) {
        const config: DeploymentConfig = {
          environment: 'production',
          version: `1.${i}.0`,
          timestamp: Date.now(),
          features: [],
          rollbackEnabled: true,
        };

        const deployment = deploymentManager.createDeployment(config);
        deploymentManager.completeDeployment(deployment.id, {});
      }

      const history = deploymentManager.getDeploymentHistory(3);

      expect(history.length).toBe(3);
    });

    it('should get deployment metrics', () => {
      const config: DeploymentConfig = {
        environment: 'production',
        version: '2.4.0',
        timestamp: Date.now(),
        features: [],
        rollbackEnabled: true,
      };

      const deployment = deploymentManager.createDeployment(config);
      const metrics = { deploymentTime: 3000, successRate: 100 };
      deploymentManager.completeDeployment(deployment.id, metrics);

      const retrieved = deploymentManager.getDeploymentMetrics(deployment.id);

      expect(retrieved).toEqual(metrics);
    });
  });

  // ============================================================================
  // ProductionMonitoring Tests
  // ============================================================================

  describe('ProductionMonitoring', () => {
    let monitoring: ProductionMonitoring;

    beforeEach(() => {
      monitoring = new ProductionMonitoring();
    });

    it('should register health check', () => {
      const id = monitoring.registerHealthCheck('api-health');

      expect(id).toMatch(/^health-/);
    });

    it('should record health check result', () => {
      const id = monitoring.registerHealthCheck('api-health');
      const checks = { database: true, cache: true, api: true };
      const metrics = { responseTime: 100, errorRate: 0 };

      const result = monitoring.recordHealthCheck(id, checks, metrics);

      expect(result.status).toBe('healthy');
      expect(result.checks).toEqual(checks);
      expect(result.metrics).toEqual(metrics);
    });

    it('should record degraded health check', () => {
      const id = monitoring.registerHealthCheck('api-health');
      const checks = { database: true, cache: false, api: true };
      const metrics = { responseTime: 500, errorRate: 5 };

      const result = monitoring.recordHealthCheck(id, checks, metrics);

      expect(result.status).toBe('degraded');
    });

    it('should create alert configuration', () => {
      const alertConfig = {
        name: 'High CPU Usage',
        metric: 'cpu_usage',
        threshold: 80,
        operator: '>' as const,
        enabled: true,
        cooldown: 60000,
      };

      const alert = monitoring.createAlert(alertConfig);

      expect(alert.id).toMatch(/^alert-/);
      expect(alert.name).toBe('High CPU Usage');
    });

    it('should trigger alert when metric exceeds threshold', () => {
      const alert = monitoring.createAlert({
        name: 'High Memory',
        metric: 'memory_usage',
        threshold: 80,
        operator: '>',
        enabled: true,
        cooldown: 0,
      });

      const triggered = monitoring.checkMetric('memory_usage', 85);

      expect(triggered.length).toBeGreaterThan(0);
      expect(triggered[0].configId).toBe(alert.id);
    });

    it('should not trigger alert when metric is below threshold', () => {
      monitoring.createAlert({
        name: 'High Memory',
        metric: 'memory_usage',
        threshold: 80,
        operator: '>',
        enabled: true,
        cooldown: 0,
      });

      const triggered = monitoring.checkMetric('memory_usage', 50);

      expect(triggered.length).toBe(0);
    });

    it('should respect alert cooldown', () => {
      const alert = monitoring.createAlert({
        name: 'High CPU',
        metric: 'cpu_usage',
        threshold: 80,
        operator: '>',
        enabled: true,
        cooldown: 60000,
      });

      const triggered1 = monitoring.checkMetric('cpu_usage', 85);
      const triggered2 = monitoring.checkMetric('cpu_usage', 85);

      expect(triggered1.length).toBeGreaterThan(0);
      expect(triggered2.length).toBe(0);
    });

    it('should record metric values', () => {
      monitoring.recordMetric('response_time', 100);
      monitoring.recordMetric('response_time', 150);
      monitoring.recordMetric('response_time', 120);

      const stats = monitoring.getMetricStats('response_time');

      expect(stats?.min).toBe(100);
      expect(stats?.max).toBe(150);
      expect(stats?.count).toBe(3);
    });

    it('should calculate metric statistics', () => {
      for (let i = 1; i <= 100; i++) {
        monitoring.recordMetric('latency', i);
      }

      const stats = monitoring.getMetricStats('latency');

      expect(stats?.min).toBe(1);
      expect(stats?.max).toBe(100);
      expect(stats?.avg).toBe(50.5);
      expect(stats?.count).toBe(100);
    });

    it('should get alert history', () => {
      monitoring.createAlert({
        name: 'Alert 1',
        metric: 'metric1',
        threshold: 50,
        operator: '>',
        enabled: true,
        cooldown: 0,
      });

      monitoring.checkMetric('metric1', 60);
      monitoring.checkMetric('metric1', 70);

      const history = monitoring.getAlertHistory();

      expect(history.length).toBeGreaterThan(0);
    });

    it('should get active alerts', () => {
      const alert1 = monitoring.createAlert({
        name: 'Alert 1',
        metric: 'metric1',
        threshold: 50,
        operator: '>',
        enabled: true,
        cooldown: 0,
      });

      const alert2 = monitoring.createAlert({
        name: 'Alert 2',
        metric: 'metric2',
        threshold: 100,
        operator: '<',
        enabled: false,
        cooldown: 0,
      });

      const active = monitoring.getActiveAlerts();

      expect(active.length).toBe(1);
      expect(active[0].id).toBe(alert1.id);
    });

    it('should update alert configuration', () => {
      const alert = monitoring.createAlert({
        name: 'Alert',
        metric: 'metric',
        threshold: 50,
        operator: '>',
        enabled: true,
        cooldown: 0,
      });

      const updated = monitoring.updateAlert(alert.id, { threshold: 75 });

      expect(updated).toBe(true);
    });

    it('should disable alert', () => {
      const alert = monitoring.createAlert({
        name: 'Alert',
        metric: 'metric',
        threshold: 50,
        operator: '>',
        enabled: true,
        cooldown: 0,
      });

      monitoring.disableAlert(alert.id);
      const active = monitoring.getActiveAlerts();

      expect(active.length).toBe(0);
    });

    it('should get health summary', () => {
      const id1 = monitoring.registerHealthCheck('check1');
      const id2 = monitoring.registerHealthCheck('check2');

      monitoring.recordHealthCheck(id1, { service: true }, {});
      monitoring.recordHealthCheck(id2, { service: false }, {});

      const summary = monitoring.getHealthSummary();

      expect(summary.totalChecks).toBe(2);
      expect(summary.healthy).toBe(1);
      expect(summary.degraded).toBe(1);
    });

    it('should clear old data', () => {
      const id = monitoring.registerHealthCheck('check');
      monitoring.recordHealthCheck(id, { service: true }, {});

      vi.useFakeTimers();
      vi.advanceTimersByTime(2 * 60 * 60 * 1000); // 2 hours

      monitoring.clearOldData(60 * 60 * 1000); // Clear older than 1 hour

      vi.useRealTimers();

      const summary = monitoring.getHealthSummary();
      expect(summary.totalChecks).toBe(0);
    });
  });

  // ============================================================================
  // HealthCheckSystem Tests
  // ============================================================================

  describe('HealthCheckSystem', () => {
    let healthCheck: HealthCheckSystem;

    beforeEach(() => {
      healthCheck = new HealthCheckSystem();
    });

    afterEach(() => {
      healthCheck.clearAllChecks();
    });

    it('should register endpoint', async () => {
      const config: EndpointConfig = {
        name: 'api-endpoint',
        url: 'https://api.example.com/health',
        method: 'GET',
        timeout: 5000,
        expectedStatus: 200,
        retries: 3,
      };

      healthCheck.registerEndpoint(config);
      // Perform a health check to create service health
      await healthCheck.performHealthCheck('api-endpoint');
      const health = healthCheck.getServiceHealth('api-endpoint');

      expect(health).toBeDefined();
    });

    it('should perform health check', async () => {
      const config: EndpointConfig = {
        name: 'api-endpoint',
        url: 'https://api.example.com/health',
        method: 'GET',
        timeout: 5000,
        expectedStatus: 200,
        retries: 1,
      };

      healthCheck.registerEndpoint(config);
      const result = await healthCheck.performHealthCheck('api-endpoint');

      expect(result).toBeDefined();
      expect(result.endpoint).toBe('api-endpoint');
      expect(result.timestamp).toBeGreaterThan(0);
    });

    it('should get service health', async () => {
      const config: EndpointConfig = {
        name: 'api-endpoint',
        url: 'https://api.example.com/health',
        method: 'GET',
        timeout: 5000,
        expectedStatus: 200,
        retries: 1,
      };

      healthCheck.registerEndpoint(config);
      await healthCheck.performHealthCheck('api-endpoint');

      const health = healthCheck.getServiceHealth('api-endpoint');

      expect(health?.name).toBe('api-endpoint');
      expect(health?.status).toBeDefined();
    });

    it('should get all service health', async () => {
      const config1: EndpointConfig = {
        name: 'api-1',
        url: 'https://api1.example.com/health',
        method: 'GET',
        timeout: 5000,
        expectedStatus: 200,
        retries: 1,
      };

      const config2: EndpointConfig = {
        name: 'api-2',
        url: 'https://api2.example.com/health',
        method: 'GET',
        timeout: 5000,
        expectedStatus: 200,
        retries: 1,
      };

      healthCheck.registerEndpoint(config1);
      healthCheck.registerEndpoint(config2);

      await healthCheck.performHealthCheck('api-1');
      await healthCheck.performHealthCheck('api-2');

      const allHealth = healthCheck.getAllServiceHealth();

      expect(allHealth.length).toBe(2);
    });

    it('should get health check history', async () => {
      const config: EndpointConfig = {
        name: 'api-endpoint',
        url: 'https://api.example.com/health',
        method: 'GET',
        timeout: 5000,
        expectedStatus: 200,
        retries: 1,
      };

      healthCheck.registerEndpoint(config);

      for (let i = 0; i < 5; i++) {
        await healthCheck.performHealthCheck('api-endpoint');
      }

      const history = healthCheck.getHealthCheckHistory('api-endpoint');

      expect(history.length).toBe(5);
    });

    it('should get health check history with limit', async () => {
      const config: EndpointConfig = {
        name: 'api-endpoint',
        url: 'https://api.example.com/health',
        method: 'GET',
        timeout: 5000,
        expectedStatus: 200,
        retries: 1,
      };

      healthCheck.registerEndpoint(config);

      for (let i = 0; i < 10; i++) {
        await healthCheck.performHealthCheck('api-endpoint');
      }

      const history = healthCheck.getHealthCheckHistory('api-endpoint', 5);

      expect(history.length).toBe(5);
    });

    it('should calculate uptime percentage', async () => {
      const config: EndpointConfig = {
        name: 'api-endpoint',
        url: 'https://api.example.com/health',
        method: 'GET',
        timeout: 5000,
        expectedStatus: 200,
        retries: 1,
      };

      healthCheck.registerEndpoint(config);
      await healthCheck.performHealthCheck('api-endpoint');

      const uptime = healthCheck.getUptimePercentage('api-endpoint');

      expect(uptime).toBeGreaterThan(0);
      expect(uptime).toBeLessThanOrEqual(100);
    });

    it('should get system health summary', async () => {
      const config1: EndpointConfig = {
        name: 'api-1',
        url: 'https://api1.example.com/health',
        method: 'GET',
        timeout: 5000,
        expectedStatus: 200,
        retries: 1,
      };

      const config2: EndpointConfig = {
        name: 'api-2',
        url: 'https://api2.example.com/health',
        method: 'GET',
        timeout: 5000,
        expectedStatus: 200,
        retries: 1,
      };

      healthCheck.registerEndpoint(config1);
      healthCheck.registerEndpoint(config2);

      await healthCheck.performHealthCheck('api-1');
      await healthCheck.performHealthCheck('api-2');

      const summary = healthCheck.getSystemHealthSummary();

      expect(summary.totalServices).toBe(2);
      expect(summary.avgResponseTime).toBeGreaterThanOrEqual(0);
    });

    it('should start and stop continuous checks', async () => {
      const config: EndpointConfig = {
        name: 'api-endpoint',
        url: 'https://api.example.com/health',
        method: 'GET',
        timeout: 5000,
        expectedStatus: 200,
        retries: 1,
      };

      healthCheck.registerEndpoint(config);

      // Perform initial check
      await healthCheck.performHealthCheck('api-endpoint');

      healthCheck.startContinuousChecks('api-endpoint', 100);

      // Wait for at least one more check
      await new Promise((resolve) => setTimeout(resolve, 250));

      healthCheck.stopContinuousChecks('api-endpoint');

      const history = healthCheck.getHealthCheckHistory('api-endpoint');
      expect(history.length).toBeGreaterThan(1);
    });

    it('should clear all checks', async () => {
      const config: EndpointConfig = {
        name: 'api-endpoint',
        url: 'https://api.example.com/health',
        method: 'GET',
        timeout: 5000,
        expectedStatus: 200,
        retries: 1,
      };

      healthCheck.registerEndpoint(config);
      await healthCheck.performHealthCheck('api-endpoint');

      healthCheck.clearAllChecks();

      const allHealth = healthCheck.getAllServiceHealth();
      expect(allHealth.length).toBe(0);
    });
  });

  // ============================================================================
  // Integration Tests
  // ============================================================================

  describe('Integration Tests', () => {
    it('should coordinate deployment with monitoring', () => {
      const deploymentManager = new DeploymentManager();
      const monitoring = new ProductionMonitoring();

      const config: DeploymentConfig = {
        environment: 'production',
        version: '2.0.0',
        timestamp: Date.now(),
        features: ['feature-1'],
        rollbackEnabled: true,
      };

      const deployment = deploymentManager.createDeployment(config);
      deploymentManager.startDeployment(deployment.id);

      const healthId = monitoring.registerHealthCheck('deployment-health');
      monitoring.recordHealthCheck(healthId, { deployment: true }, { successRate: 100 });

      deploymentManager.completeDeployment(deployment.id, { deploymentTime: 5000 });

      const summary = monitoring.getHealthSummary();
      expect(summary.totalChecks).toBe(1);
      expect(deploymentManager.getCurrentVersion()).toBe('2.0.0');
    });

    it('should handle deployment failure with monitoring alerts', () => {
      const deploymentManager = new DeploymentManager();
      const monitoring = new ProductionMonitoring();

      const config: DeploymentConfig = {
        environment: 'production',
        version: '2.0.0',
        timestamp: Date.now(),
        features: [],
        rollbackEnabled: true,
      };

      const deployment = deploymentManager.createDeployment(config);
      deploymentManager.failDeployment(deployment.id, 'Database connection failed');

      monitoring.createAlert({
        name: 'Deployment Failed',
        metric: 'deployment_status',
        threshold: 0,
        operator: '==',
        enabled: true,
        cooldown: 0,
      });

      const triggered = monitoring.checkMetric('deployment_status', 0);

      expect(triggered.length).toBeGreaterThan(0);
      const status = deploymentManager.getDeploymentStatus(deployment.id);
      expect(status?.status).toBe('failed');
    });

    it('should track deployment metrics with health checks', () => {
      const deploymentManager = new DeploymentManager();
      const healthCheck = new HealthCheckSystem();

      const config: DeploymentConfig = {
        environment: 'production',
        version: '2.0.0',
        timestamp: Date.now(),
        features: [],
        rollbackEnabled: true,
      };

      const deployment = deploymentManager.createDeployment(config);
      deploymentManager.completeDeployment(deployment.id, {
        deploymentTime: 5000,
        successRate: 99.9,
      });

      const endpointConfig: EndpointConfig = {
        name: 'post-deployment-check',
        url: 'https://api.example.com/health',
        method: 'GET',
        timeout: 5000,
        expectedStatus: 200,
        retries: 1,
      };

      healthCheck.registerEndpoint(endpointConfig);

      const metrics = deploymentManager.getDeploymentMetrics(deployment.id);
      expect(metrics?.deploymentTime).toBe(5000);
      expect(metrics?.successRate).toBe(99.9);
    });
  });
});
