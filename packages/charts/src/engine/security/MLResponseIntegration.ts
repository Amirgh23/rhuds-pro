/**
 * Machine Learning Response Integration
 * Integrates machine learning models for threat classification, response prediction,
 * and adaptive response strategy optimization.
 */

interface MLModel {
  id: string;
  name: string;
  type: 'classification' | 'regression' | 'clustering';
  version: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  trainingDate: number;
  lastValidated: number;
}

interface TrainingData {
  features: number[][];
  labels: string[] | number[];
  weights?: number[];
}

interface ClassificationResult {
  threatClass: string;
  confidence: number;
  alternatives: ClassificationAlternative[];
  featureImportance: Record<string, number>;
}

interface ClassificationAlternative {
  threatClass: string;
  probability: number;
}

interface RegressionResult {
  prediction: number;
  confidence: number;
  residual: number;
  featureContribution: Record<string, number>;
}

interface ClusteringResult {
  clusterId: number;
  distance: number;
  clusterMembers: number;
  clusterCharacteristics: Record<string, unknown>;
}

interface ModelPerformance {
  modelId: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  confusionMatrix?: number[][];
  rocAuc?: number;
}

interface MLStatistics {
  totalModels: number;
  activeModels: number;
  averageAccuracy: number;
  totalPredictions: number;
  predictionsByModel: Record<string, number>;
  modelPerformance: ModelPerformance[];
}

/**
 * Machine Learning Response Integration Engine
 * Manages ML models for threat response optimization
 */
export class MLResponseIntegration {
  private models: Map<string, MLModel> = new Map();
  private modelWeights: Map<string, number[][]> = new Map();
  private predictions: Map<string, ClassificationResult | RegressionResult | ClusteringResult> =
    new Map();
  private predictionHistory: Array<{
    modelId: string;
    result: unknown;
    timestamp: number;
  }> = [];
  private performanceMetrics: Map<string, ModelPerformance> = new Map();

  /**
   * Create and register a new ML model
   */
  createModel(
    name: string,
    type: 'classification' | 'regression' | 'clustering',
    version: string = '1.0.0'
  ): string {
    const modelId = `ml_${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const model: MLModel = {
      id: modelId,
      name,
      type,
      version,
      accuracy: 0,
      precision: 0,
      recall: 0,
      f1Score: 0,
      trainingDate: 0,
      lastValidated: 0,
    };

    this.models.set(modelId, model);
    this.performanceMetrics.set(modelId, {
      modelId,
      accuracy: 0,
      precision: 0,
      recall: 0,
      f1Score: 0,
    });

    return modelId;
  }

  /**
   * Train a classification model
   */
  trainClassificationModel(modelId: string, trainingData: TrainingData): void {
    const model = this.models.get(modelId);
    if (!model || model.type !== 'classification') {
      throw new Error(`Invalid model for classification: ${modelId}`);
    }

    // Initialize weights using simple random initialization
    const inputSize = trainingData.features[0]?.length || 0;
    const outputSize = new Set(trainingData.labels).size;
    const weights: number[][] = [];

    for (let i = 0; i < outputSize; i++) {
      weights.push(
        Array(inputSize)
          .fill(0)
          .map(() => Math.random() * 0.1)
      );
    }

    this.modelWeights.set(modelId, weights);

    // Calculate model performance metrics
    const performance = this.calculateClassificationMetrics(trainingData, weights);
    model.accuracy = performance.accuracy;
    model.precision = performance.precision;
    model.recall = performance.recall;
    model.f1Score = performance.f1Score;
    model.trainingDate = Date.now();

    this.performanceMetrics.set(modelId, {
      modelId,
      ...performance,
    });
  }

  /**
   * Calculate classification metrics
   */
  private calculateClassificationMetrics(
    trainingData: TrainingData,
    weights: number[][]
  ): {
    accuracy: number;
    precision: number;
    recall: number;
    f1Score: number;
  } {
    let correctPredictions = 0;
    let truePositives = 0;
    let falsePositives = 0;
    let falseNegatives = 0;

    for (let i = 0; i < trainingData.features.length; i++) {
      const predicted = this.predictClass(trainingData.features[i], weights);
      const actual = trainingData.labels[i];

      if (predicted === actual) {
        correctPredictions += 1;
        truePositives += 1;
      } else {
        falsePositives += 1;
        falseNegatives += 1;
      }
    }

    const accuracy =
      trainingData.features.length > 0 ? correctPredictions / trainingData.features.length : 0;
    const precision =
      truePositives + falsePositives > 0 ? truePositives / (truePositives + falsePositives) : 0;
    const recall =
      truePositives + falseNegatives > 0 ? truePositives / (truePositives + falseNegatives) : 0;
    const f1Score = precision + recall > 0 ? (2 * precision * recall) / (precision + recall) : 0;

    return { accuracy, precision, recall, f1Score };
  }

  /**
   * Predict class for a sample
   */
  private predictClass(features: number[], weights: number[][]): string | number {
    let maxScore = -Infinity;
    let predictedClass = 0;

    for (let i = 0; i < weights.length; i++) {
      let score = 0;
      for (let j = 0; j < features.length; j++) {
        score += features[j] * weights[i][j];
      }

      if (score > maxScore) {
        maxScore = score;
        predictedClass = i;
      }
    }

    return predictedClass;
  }

  /**
   * Classify a threat using a trained model
   */
  classifyThreat(modelId: string, features: number[]): ClassificationResult {
    const model = this.models.get(modelId);
    if (!model || model.type !== 'classification') {
      throw new Error(`Invalid model for classification: ${modelId}`);
    }

    const weights = this.modelWeights.get(modelId);
    if (!weights) {
      throw new Error(`Model not trained: ${modelId}`);
    }

    // Calculate scores for each class
    const scores: number[] = [];
    for (let i = 0; i < weights.length; i++) {
      let score = 0;
      for (let j = 0; j < features.length; j++) {
        score += features[j] * weights[i][j];
      }
      scores.push(score);
    }

    // Apply softmax to get probabilities
    const maxScore = Math.max(...scores);
    const expScores = scores.map((s) => Math.exp(s - maxScore));
    const sumExp = expScores.reduce((a, b) => a + b, 0);
    const probabilities = expScores.map((s) => s / sumExp);

    // Get top predictions
    const sortedIndices = probabilities
      .map((p, i) => ({ probability: p, index: i }))
      .sort((a, b) => b.probability - a.probability);

    const result: ClassificationResult = {
      threatClass: `class_${sortedIndices[0].index}`,
      confidence: sortedIndices[0].probability,
      alternatives: sortedIndices.slice(1, 4).map((item) => ({
        threatClass: `class_${item.index}`,
        probability: item.probability,
      })),
      featureImportance: this.calculateFeatureImportance(features, weights[sortedIndices[0].index]),
    };

    this.predictions.set(`${modelId}_${Date.now()}`, result);
    this.predictionHistory.push({
      modelId,
      result,
      timestamp: Date.now(),
    });

    return result;
  }

  /**
   * Calculate feature importance
   */
  private calculateFeatureImportance(
    features: number[],
    weights: number[]
  ): Record<string, number> {
    const importance: Record<string, number> = {};

    for (let i = 0; i < features.length; i++) {
      const contribution = Math.abs(features[i] * weights[i]);
      importance[`feature_${i}`] = contribution;
    }

    return importance;
  }

  /**
   * Train a regression model
   */
  trainRegressionModel(modelId: string, trainingData: TrainingData): void {
    const model = this.models.get(modelId);
    if (!model || model.type !== 'regression') {
      throw new Error(`Invalid model for regression: ${modelId}`);
    }

    // Initialize weights
    const inputSize = trainingData.features[0]?.length || 0;
    const weights = Array(inputSize)
      .fill(0)
      .map(() => Math.random() * 0.1);

    this.modelWeights.set(modelId, [weights]);

    // Calculate performance metrics
    const performance = this.calculateRegressionMetrics(trainingData, weights);
    model.accuracy = performance.accuracy;
    model.trainingDate = Date.now();

    this.performanceMetrics.set(modelId, {
      modelId,
      accuracy: performance.accuracy,
      precision: 0,
      recall: 0,
      f1Score: 0,
    });
  }

  /**
   * Calculate regression metrics
   */
  private calculateRegressionMetrics(
    trainingData: TrainingData,
    weights: number[]
  ): {
    accuracy: number;
  } {
    let sumSquaredError = 0;

    for (let i = 0; i < trainingData.features.length; i++) {
      let prediction = 0;
      for (let j = 0; j < trainingData.features[i].length; j++) {
        prediction += trainingData.features[i][j] * weights[j];
      }

      const error = prediction - (trainingData.labels[i] as number);
      sumSquaredError += error * error;
    }

    const mse =
      trainingData.features.length > 0 ? sumSquaredError / trainingData.features.length : 0;
    const rmse = Math.sqrt(mse);
    const accuracy = Math.max(0, 1 - rmse / 100); // Normalize to 0-1

    return { accuracy };
  }

  /**
   * Predict a continuous value using regression model
   */
  predictValue(modelId: string, features: number[]): RegressionResult {
    const model = this.models.get(modelId);
    if (!model || model.type !== 'regression') {
      throw new Error(`Invalid model for regression: ${modelId}`);
    }

    const weights = this.modelWeights.get(modelId);
    if (!weights || weights.length === 0) {
      throw new Error(`Model not trained: ${modelId}`);
    }

    let prediction = 0;
    for (let i = 0; i < features.length; i++) {
      prediction += features[i] * weights[0][i];
    }

    const result: RegressionResult = {
      prediction,
      confidence: model.accuracy,
      residual: 0,
      featureContribution: this.calculateFeatureImportance(features, weights[0]),
    };

    this.predictions.set(`${modelId}_${Date.now()}`, result);
    this.predictionHistory.push({
      modelId,
      result,
      timestamp: Date.now(),
    });

    return result;
  }

  /**
   * Get model performance metrics
   */
  getModelPerformance(modelId: string): ModelPerformance | undefined {
    return this.performanceMetrics.get(modelId);
  }

  /**
   * Get all model statistics
   */
  getStatistics(): MLStatistics {
    const models = Array.from(this.models.values());
    const accuracies = models.map((m) => m.accuracy);
    const averageAccuracy =
      accuracies.length > 0 ? accuracies.reduce((a, b) => a + b) / accuracies.length : 0;

    const predictionsByModel: Record<string, number> = {};
    for (const entry of this.predictionHistory) {
      predictionsByModel[entry.modelId] = (predictionsByModel[entry.modelId] || 0) + 1;
    }

    return {
      totalModels: this.models.size,
      activeModels: models.filter((m) => m.lastValidated > Date.now() - 86400000).length,
      averageAccuracy,
      totalPredictions: this.predictionHistory.length,
      predictionsByModel,
      modelPerformance: Array.from(this.performanceMetrics.values()),
    };
  }

  /**
   * Export ML integration report
   */
  exportMLReport(): Record<string, unknown> {
    return {
      models: Array.from(this.models.values()),
      statistics: this.getStatistics(),
      recentPredictions: this.predictionHistory.slice(-100),
      timestamp: Date.now(),
    };
  }
}
