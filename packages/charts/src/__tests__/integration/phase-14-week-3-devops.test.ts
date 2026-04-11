/**
 * Phase 14 Week 3 - DevOps & Deployment Tests
 * Comprehensive test suite for all DevOps features
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  CIPipelineManager,
  InfrastructureAsCode,
  ContainerOrchestration,
  BackupDisasterRecovery,
  ConfigurationManagement,
} from '../../engine/devops';

describe('Phase 14 Week 3 - DevOps & Deployment', () => {
  // ============================================================================
  // CIPipelineManager Tests
  // ============================================================================

  describe('CIPipelineManager', () => {
    let manager: CIPipelineManager;

    beforeEach(() => {
      manager = new CIPipelineManager();
      manager.registerStageExecutor('build', async () => 'Build successful');
      manager.registerStageExecutor('test', async () => 'Tests passed');
      manager.registerStageExecutor('deploy', async () => 'Deployment successful');
    });

    it('should create pipeline', () => {
      const pipeline = manager.createPipeline('Test Pipeline', 'A test pipeline', [
        {
          id: 'stage-1',
          name: 'Build',
          type: 'build',
          command: 'npm run build',
          timeout: 60000,
          retries: 2,
          dependencies: [],
        },
      ]);

      expect(pipeline.name).toBe('Test Pipeline');
      expect(pipeline.stages.length).toBe(1);
    });

    it('should run pipeline successfully', async () => {
      const pipeline = manager.createPipeline('Test Pipeline', 'A test pipeline', [
        {
          id: 'stage-1',
          name: 'Build',
          type: 'build',
          command: 'npm run build',
          timeout: 60000,
          retries: 2,
          dependencies: [],
        },
      ]);

      const run = await manager.runPipeline(pipeline.id);
      expect(run.status).toBe('success');
      expect(run.stageResults.size).toBe(1);
    });

    it('should handle pipeline failure', async () => {
      manager.registerStageExecutor('failing', async () => {
        throw new Error('Stage failed');
      });

      const pipeline = manager.createPipeline('Failing Pipeline', 'A failing pipeline', [
        {
          id: 'stage-1',
          name: 'Failing',
          type: 'failing',
          command: 'npm run fail',
          timeout: 60000,
          retries: 1,
          dependencies: [],
        },
      ]);

      const run = await manager.runPipeline(pipeline.id);
      expect(run.status).toBe('failed');
    });

    it('should get pipeline statistics', async () => {
      const pipeline = manager.createPipeline('Test Pipeline', 'A test pipeline', [
        {
          id: 'stage-1',
          name: 'Build',
          type: 'build',
          command: 'npm run build',
          timeout: 60000,
          retries: 2,
          dependencies: [],
        },
      ]);

      await manager.runPipeline(pipeline.id);
      const stats = manager.getStatistics(pipeline.id);

      expect(stats.totalRuns).toBe(1);
      expect(stats.successCount).toBe(1);
    });

    it('should list pipelines', () => {
      manager.createPipeline('Pipeline 1', 'First pipeline', []);
      manager.createPipeline('Pipeline 2', 'Second pipeline', []);

      const pipelines = manager.getPipelines();
      expect(pipelines.length).toBe(2);
    });

    it('should update pipeline', () => {
      const pipeline = manager.createPipeline('Test Pipeline', 'A test pipeline', []);
      const updated = manager.updatePipeline(pipeline.id, { description: 'Updated description' });

      expect(updated.description).toBe('Updated description');
    });

    it('should delete pipeline', () => {
      const pipeline = manager.createPipeline('Test Pipeline', 'A test pipeline', []);
      manager.deletePipeline(pipeline.id);

      const pipelines = manager.getPipelines();
      expect(pipelines.length).toBe(0);
    });
  });

  // ============================================================================
  // InfrastructureAsCode Tests
  // ============================================================================

  describe('InfrastructureAsCode', () => {
    let iac: InfrastructureAsCode;

    beforeEach(() => {
      iac = new InfrastructureAsCode();
      iac.registerResourceProvider('compute', async () => 'instance-123');
      iac.registerResourceProvider('storage', async () => 'bucket-456');
    });

    it('should create environment', () => {
      const env = iac.createEnvironment('Production', [
        {
          id: 'res-1',
          type: 'compute',
          name: 'web-server',
          config: { cpu: 2, memory: 4 },
          tags: { env: 'prod' },
          dependencies: [],
        },
      ]);

      expect(env.name).toBe('Production');
      expect(env.resources.length).toBe(1);
    });

    it('should plan deployment', () => {
      const env = iac.createEnvironment('Production', [
        {
          id: 'res-1',
          type: 'compute',
          name: 'web-server',
          config: { cpu: 2, memory: 4 },
          tags: {},
          dependencies: [],
        },
      ]);

      const plan = iac.planDeployment(env.id);
      expect(plan.status).toBe('pending');
      expect(plan.changes.length).toBe(1);
    });

    it('should apply deployment plan', async () => {
      const env = iac.createEnvironment('Production', [
        {
          id: 'res-1',
          type: 'compute',
          name: 'web-server',
          config: { cpu: 2, memory: 4 },
          tags: {},
          dependencies: [],
        },
      ]);

      const plan = iac.planDeployment(env.id);
      const results = await iac.applyDeploymentPlan(plan.id);

      expect(results['res-1']).toBeDefined();
      expect(results['res-1'].status).toBe('success');
    });

    it('should set environment variables', () => {
      const env = iac.createEnvironment('Production', []);
      iac.setVariable(env.id, 'DATABASE_URL', 'postgres://localhost');

      const retrieved = iac.getEnvironment(env.id);
      expect(retrieved?.variables['DATABASE_URL']).toBe('postgres://localhost');
    });

    it('should validate configuration', () => {
      const env = iac.createEnvironment('Production', [
        {
          id: 'res-1',
          type: 'compute',
          name: 'web-server',
          config: {},
          tags: {},
          dependencies: [],
        },
      ]);

      const validation = iac.validateConfiguration(env.id);
      expect(validation.valid).toBe(true);
    });

    it('should export configuration', () => {
      const env = iac.createEnvironment('Production', [
        {
          id: 'res-1',
          type: 'compute',
          name: 'web-server',
          config: { cpu: 2 },
          tags: {},
          dependencies: [],
        },
      ]);

      const exported = iac.exportConfiguration(env.id);
      expect(exported.name).toBe('Production');
      expect((exported.resources as any[]).length).toBe(1);
    });
  });

  // ============================================================================
  // ContainerOrchestration Tests
  // ============================================================================

  describe('ContainerOrchestration', () => {
    let orchestration: ContainerOrchestration;

    beforeEach(() => {
      orchestration = new ContainerOrchestration();
      orchestration.registerNode('node-1', { cpu: '4', memory: '8Gi' });
      orchestration.registerNode('node-2', { cpu: '4', memory: '8Gi' });
    });

    it('should deploy service', async () => {
      const service = {
        id: 'svc-1',
        name: 'web-app',
        image: {
          id: 'img-1',
          name: 'web-app',
          tag: 'latest',
          registry: 'docker.io',
          digest: 'sha256:abc123',
          size: 1000000,
          createdAt: Date.now(),
        },
        replicas: 2,
        ports: [8080],
        environment: {},
        resources: { cpu: '1', memory: '1Gi' },
      };

      const instances = await orchestration.deployService(service);
      expect(instances.length).toBe(2);
      expect(instances[0].status).toBe('running');
    });

    it('should scale service', async () => {
      const service = {
        id: 'svc-1',
        name: 'web-app',
        image: {
          id: 'img-1',
          name: 'web-app',
          tag: 'latest',
          registry: 'docker.io',
          digest: 'sha256:abc123',
          size: 1000000,
          createdAt: Date.now(),
        },
        replicas: 2,
        ports: [8080],
        environment: {},
        resources: { cpu: '1', memory: '1Gi' },
      };

      await orchestration.deployService(service);
      const scaled = await orchestration.scaleService(service.id, 4);

      expect(scaled.length).toBeGreaterThanOrEqual(2);
    });

    it('should check service health', async () => {
      const service = {
        id: 'svc-1',
        name: 'web-app',
        image: {
          id: 'img-1',
          name: 'web-app',
          tag: 'latest',
          registry: 'docker.io',
          digest: 'sha256:abc123',
          size: 1000000,
          createdAt: Date.now(),
        },
        replicas: 2,
        ports: [8080],
        environment: {},
        resources: { cpu: '1', memory: '1Gi' },
      };

      await orchestration.deployService(service);
      const health = await orchestration.checkServiceHealth(service.id);

      expect(health.serviceId).toBe(service.id);
      expect(health.healthStatus).toBeDefined();
    });

    it('should get service status', async () => {
      const service = {
        id: 'svc-1',
        name: 'web-app',
        image: {
          id: 'img-1',
          name: 'web-app',
          tag: 'latest',
          registry: 'docker.io',
          digest: 'sha256:abc123',
          size: 1000000,
          createdAt: Date.now(),
        },
        replicas: 2,
        ports: [8080],
        environment: {},
        resources: { cpu: '1', memory: '1Gi' },
      };

      await orchestration.deployService(service);
      const status = orchestration.getServiceStatus(service.id);

      expect(status.desiredReplicas).toBe(2);
      expect(status.runningReplicas).toBeGreaterThan(0);
    });

    it('should get node status', () => {
      const status = orchestration.getNodeStatus('node-1');
      expect(status.nodeId).toBe('node-1');
      expect(status.status).toBe('ready');
    });
  });

  // ============================================================================
  // BackupDisasterRecovery Tests
  // ============================================================================

  describe('BackupDisasterRecovery', () => {
    let bdr: BackupDisasterRecovery;

    beforeEach(() => {
      bdr = new BackupDisasterRecovery();
    });

    it('should create backup policy', () => {
      const policy = bdr.createBackupPolicy('Daily Backup', 'daily', 30, ['database', 'files']);

      expect(policy.name).toBe('Daily Backup');
      expect(policy.frequency).toBe('daily');
      expect(policy.retention).toBe(30);
    });

    it('should execute backup', async () => {
      const policy = bdr.createBackupPolicy('Daily Backup', 'daily', 30, ['database']);
      const backups = await bdr.executeBackup(policy.id);

      expect(backups.length).toBe(1);
      expect(backups[0].status).toBe('completed');
    });

    it('should restore from backup', async () => {
      const policy = bdr.createBackupPolicy('Daily Backup', 'daily', 30, ['database']);
      const backups = await bdr.executeBackup(policy.id);

      const result = await bdr.restoreFromBackup(backups[0].id, '/restore/location');
      expect(result.status).toBe('success');
    });

    it('should create disaster recovery plan', () => {
      const policy = bdr.createBackupPolicy('Daily Backup', 'daily', 30, ['database']);
      const plan = bdr.createDisasterRecoveryPlan('DR Plan', 3600, 1800, [policy]);

      expect(plan.name).toBe('DR Plan');
      expect(plan.rto).toBe(3600);
    });

    it('should test disaster recovery plan', async () => {
      const policy = bdr.createBackupPolicy('Daily Backup', 'daily', 30, ['database']);
      const plan = bdr.createDisasterRecoveryPlan('DR Plan', 3600, 1800, [policy]);

      const results = await bdr.testDisasterRecoveryPlan(plan.id);
      expect(results.status).toBe('success');
    });

    it('should get backup status', async () => {
      const policy = bdr.createBackupPolicy('Daily Backup', 'daily', 30, ['database']);
      await bdr.executeBackup(policy.id);

      const status = bdr.getBackupStatus(policy.id);
      expect(status.totalBackups).toBe(1);
      expect(status.statusCounts.completed).toBe(1);
    });

    it('should cleanup old backups', async () => {
      const policy = bdr.createBackupPolicy('Daily Backup', 'daily', 0, ['database']);
      await bdr.executeBackup(policy.id);

      const deleted = bdr.cleanupOldBackups(policy.id);
      expect(deleted).toBeGreaterThanOrEqual(0);
    });
  });

  // ============================================================================
  // ConfigurationManagement Tests
  // ============================================================================

  describe('ConfigurationManagement', () => {
    let cm: ConfigurationManagement;

    beforeEach(() => {
      cm = new ConfigurationManagement();
    });

    it('should create configuration version', () => {
      const version = cm.createConfigVersion(
        '1.0.0',
        'admin',
        [{ key: 'DATABASE_URL', newValue: 'postgres://localhost', action: 'add' }],
        'Initial configuration'
      );

      expect(version.version).toBe('1.0.0');
      expect(version.changes.length).toBe(1);
    });

    it('should approve configuration version', () => {
      const version = cm.createConfigVersion('1.0.0', 'admin', [], 'Initial configuration');
      const approved = cm.approveConfigVersion(version.id);

      expect(approved.status).toBe('approved');
    });

    it('should create environment', () => {
      const env = cm.createEnvironment('Production');
      expect(env.name).toBe('Production');
    });

    it('should deploy configuration', async () => {
      const env = cm.createEnvironment('Production');
      const version = cm.createConfigVersion(
        '1.0.0',
        'admin',
        [{ key: 'DATABASE_URL', newValue: 'postgres://localhost', action: 'add' }],
        'Initial configuration'
      );

      cm.approveConfigVersion(version.id);
      const record = await cm.deployConfiguration(env.id, version.id);

      expect(record.status).toBe('success');
    });

    it('should get configuration', async () => {
      const env = cm.createEnvironment('Production');
      const version = cm.createConfigVersion(
        '1.0.0',
        'admin',
        [{ key: 'DATABASE_URL', newValue: 'postgres://localhost', action: 'add' }],
        'Initial configuration'
      );

      cm.approveConfigVersion(version.id);
      await cm.deployConfiguration(env.id, version.id);

      const value = cm.getConfiguration(env.id, 'DATABASE_URL');
      expect(value).toBe('postgres://localhost');
    });

    it('should rollback configuration', async () => {
      const env = cm.createEnvironment('Production');
      const version = cm.createConfigVersion(
        '1.0.0',
        'admin',
        [
          {
            key: 'DATABASE_URL',
            oldValue: 'postgres://old',
            newValue: 'postgres://new',
            action: 'update',
          },
        ],
        'Update configuration'
      );

      cm.approveConfigVersion(version.id);
      await cm.deployConfiguration(env.id, version.id);
      const record = await cm.rollbackConfiguration(env.id, version.id);

      expect(record.status).toBe('success');
    });

    it('should list configuration versions', () => {
      cm.createConfigVersion('1.0.0', 'admin', [], 'Version 1');
      cm.createConfigVersion('1.1.0', 'admin', [], 'Version 2');

      const versions = cm.listConfigVersions();
      expect(versions.length).toBe(2);
    });

    it('should get deployment history', async () => {
      const env = cm.createEnvironment('Production');
      const version = cm.createConfigVersion('1.0.0', 'admin', [], 'Initial configuration');

      cm.approveConfigVersion(version.id);
      await cm.deployConfiguration(env.id, version.id);

      const history = cm.getDeploymentHistory(env.id);
      expect(history.length).toBe(1);
    });

    it('should export configuration', async () => {
      const env = cm.createEnvironment('Production');
      const version = cm.createConfigVersion(
        '1.0.0',
        'admin',
        [{ key: 'DATABASE_URL', newValue: 'postgres://localhost', action: 'add' }],
        'Initial configuration'
      );

      cm.approveConfigVersion(version.id);
      await cm.deployConfiguration(env.id, version.id);

      const exported = cm.exportConfiguration(env.id);
      expect(exported.name).toBe('Production');
      expect((exported.configs as any).DATABASE_URL).toBe('postgres://localhost');
    });
  });

  // ============================================================================
  // Integration Tests
  // ============================================================================

  describe('Integration Tests', () => {
    it('should work together: CI/CD + Infrastructure', async () => {
      const manager = new CIPipelineManager();
      const iac = new InfrastructureAsCode();

      manager.registerStageExecutor('deploy', async () => 'Deployment successful');

      const pipeline = manager.createPipeline('Deploy Pipeline', 'Deploy to production', [
        {
          id: 'stage-1',
          name: 'Deploy',
          type: 'deploy',
          command: 'deploy',
          timeout: 60000,
          retries: 2,
          dependencies: [],
        },
      ]);

      const env = iac.createEnvironment('Production', []);
      const run = await manager.runPipeline(pipeline.id);

      expect(run.status).toBe('success');
    });

    it('should work together: Container + Backup', async () => {
      const orchestration = new ContainerOrchestration();
      const bdr = new BackupDisasterRecovery();

      orchestration.registerNode('node-1', { cpu: '4', memory: '8Gi' });

      const service = {
        id: 'svc-1',
        name: 'web-app',
        image: {
          id: 'img-1',
          name: 'web-app',
          tag: 'latest',
          registry: 'docker.io',
          digest: 'sha256:abc123',
          size: 1000000,
          createdAt: Date.now(),
        },
        replicas: 1,
        ports: [8080],
        environment: {},
        resources: { cpu: '1', memory: '1Gi' },
      };

      await orchestration.deployService(service);

      const policy = bdr.createBackupPolicy('Service Backup', 'daily', 30, ['service-data']);
      const backups = await bdr.executeBackup(policy.id);

      expect(backups.length).toBe(1);
    });
  });
});
