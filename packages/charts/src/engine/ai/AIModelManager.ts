/**
 * Advanced AI Model Management System
 * Handles model versioning, deployment, A/B testing, and performance tracking
 */

export interface AIModel {
  id: string;
  name: string;
  version: string;
  type: 'classification' | 'regression' | 'clustering' | 'nlp' | 'vision';
  status: 'draft' | 'training' | 'deployed' | 'archived';
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  createdAt: Date;
  updatedAt: Date;
  metadata: Record<string, unknown>;
}

export interface ModelVersion {
  version: string;
  modelId: string;
  timestamp: Date;
  metrics: {
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
  };
  parameters: Record<string, unknown>;
  status: 'active' | 'inactive';
}

export interface ABTestConfig {
  modelA: string;
  modelB: string;
  splitRatio: number; // 0-1
  duration: number; // milliseconds
  metrics: string[];
}

export interface ModelPerformance {
  modelId: string;
  timestamp: Date;
  predictions: number;
  accuracy: number;
  latency: number;
  errors: number;
}

/**
 * AIModelManager - Comprehensive AI model lifecycle management
 */
export class AIModelManager {
  private models: Map<string, AIModel> = new Map();
  private versions: Map<string, ModelVersion[]> = new Map();
  private abTests: Map<string, ABTestConfig> = new Map();
  private performance: ModelPerformance[] = [];
  private activeModel: string | null = null;

  /**
   * Register a new AI model
   */
  registerModel(model: AIModel): void {
    this.models.set(model.id, model);
    this.versions.set(model.id, []);
  }

  /**
   * Deploy a model version
   */
  deployModel(modelId: string, version: string): void {
    const model = this.models.get(modelId);
    if (!model) throw new Error(`Model ${modelId} not found`);

    model.status = 'deployed';
    model.version = version;
    this.activeModel = modelId;
  }

  /**
   * Create a new model version
   */
  createVersion(
    modelId: string,
    version: string,
    metrics: ModelVersion['metrics'],
    parameters: Record<string, unknown>
  ): void {
    const modelVersion: ModelVersion = {
      version,
      modelId,
      timestamp: new Date(),
      metrics,
      parameters,
      status: 'inactive',
    };

    const versions = this.versions.get(modelId) || [];
    versions.push(modelVersion);
    this.versions.set(modelId, versions);
  }

  /**
   * Setup A/B testing between two models
   */
  setupABTest(config: ABTestConfig): string {
    const testId = `ab-test-${Date.now()}`;
    this.abTests.set(testId, config);
    return testId;
  }

  /**
   * Get model for A/B test
   */
  getABTestModel(testId: string): string {
    const config = this.abTests.get(testId);
    if (!config) throw new Error(`A/B test ${testId} not found`);

    return Math.random() < config.splitRatio ? config.modelA : config.modelB;
  }

  /**
   * Track model performance
   */
  trackPerformance(
    modelId: string,
    predictions: number,
    accuracy: number,
    latency: number,
    errors: number
  ): void {
    this.performance.push({
      modelId,
      timestamp: new Date(),
      predictions,
      accuracy,
      latency,
      errors,
    });
  }

  /**
   * Get model performance metrics
   */
  getPerformanceMetrics(modelId: string, hours: number = 24): ModelPerformance[] {
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
    return this.performance.filter((p) => p.modelId === modelId && p.timestamp > cutoff);
  }

  /**
   * Automatic model retraining trigger
   */
  shouldRetrain(modelId: string, accuracyThreshold: number = 0.85): boolean {
    const metrics = this.getPerformanceMetrics(modelId, 24);
    if (metrics.length === 0) return false;

    const avgAccuracy = metrics.reduce((sum, m) => sum + m.accuracy, 0) / metrics.length;
    return avgAccuracy < accuracyThreshold;
  }

  /**
   * Get model by ID
   */
  getModel(modelId: string): AIModel | undefined {
    return this.models.get(modelId);
  }

  /**
   * Get all models
   */
  getAllModels(): AIModel[] {
    return Array.from(this.models.values());
  }

  /**
   * Get model versions
   */
  getVersions(modelId: string): ModelVersion[] {
    return this.versions.get(modelId) || [];
  }

  /**
   * Archive a model
   */
  archiveModel(modelId: string): void {
    const model = this.models.get(modelId);
    if (model) {
      model.status = 'archived';
    }
  }

  /**
   * Get active model
   */
  getActiveModel(): AIModel | undefined {
    return this.activeModel ? this.models.get(this.activeModel) : undefined;
  }

  /**
   * Compare model versions
   */
  compareVersions(modelId: string, v1: string, v2: string): Record<string, unknown> {
    const versions = this.versions.get(modelId) || [];
    const version1 = versions.find((v) => v.version === v1);
    const version2 = versions.find((v) => v.version === v2);

    if (!version1 || !version2) {
      throw new Error('One or both versions not found');
    }

    return {
      version1: version1.metrics,
      version2: version2.metrics,
      improvement: {
        accuracy: version2.metrics.accuracy - version1.metrics.accuracy,
        precision: version2.metrics.precision - version1.metrics.precision,
        recall: version2.metrics.recall - version1.metrics.recall,
        f1Score: version2.metrics.f1Score - version1.metrics.f1Score,
      },
    };
  }
}

export default AIModelManager;
