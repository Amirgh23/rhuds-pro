/**
 * Predictive Response Optimization
 * Uses historical data and machine learning to predict optimal response strategies
 * and optimize response effectiveness based on threat patterns.
 */

interface ThreatPattern {
  id: string;
  threatType: string;
  characteristics: Record<string, unknown>;
  frequency: number;
  averageSeverity: number;
  commonResponses: ResponsePattern[];
}

interface ResponsePattern {
  responseType: string;
  successRate: number;
  averageDuration: number;
  costScore: number;
  riskReduction: number;
}

interface PredictionModel {
  id: string;
  threatType: string;
  features: ModelFeature[];
  weights: number[];
  accuracy: number;
  lastUpdated: number;
}

interface ModelFeature {
  name: string;
  type: 'numeric' | 'categorical' | 'temporal';
  importance: number;
}

interface PredictionResult {
  threatId: string;
  predictedResponses: PredictedResponse[];
  confidence: number;
  reasoning: string;
  timestamp: number;
}

interface PredictedResponse {
  responseType: string;
  probability: number;
  expectedDuration: number;
  expectedCost: number;
  expectedRiskReduction: number;
  rank: number;
}

interface OptimizationRecommendation {
  id: string;
  threatId: string;
  currentResponse: string;
  recommendedResponse: string;
  improvementScore: number;
  reasoning: string;
  estimatedBenefit: string;
}

interface PredictionStatistics {
  totalPredictions: number;
  averageAccuracy: number;
  modelCount: number;
  patternCount: number;
  lastUpdateTime: number;
  predictionsByThreatType: Record<string, number>;
}

/**
 * Predictive Response Optimization Engine
 * Predicts optimal responses and provides optimization recommendations
 */
export class PredictiveResponseOptimization {
  private threatPatterns: Map<string, ThreatPattern> = new Map();
  private predictionModels: Map<string, PredictionModel> = new Map();
  private predictions: Map<string, PredictionResult> = new Map();
  private recommendations: Map<string, OptimizationRecommendation[]> = new Map();
  private predictionHistory: PredictionResult[] = [];

  /**
   * Record a threat pattern from historical data
   */
  recordThreatPattern(pattern: ThreatPattern): void {
    this.threatPatterns.set(pattern.id, pattern);
  }

  /**
   * Train a prediction model for a threat type
   */
  trainPredictionModel(threatType: string, trainingData: ThreatPattern[]): string {
    const modelId = `model_${threatType}_${Date.now()}`;

    // Extract features from training data
    const features: ModelFeature[] = [
      { name: 'severity', type: 'numeric', importance: 0.3 },
      { name: 'frequency', type: 'numeric', importance: 0.2 },
      { name: 'timeOfDay', type: 'temporal', importance: 0.15 },
      { name: 'targetType', type: 'categorical', importance: 0.25 },
      { name: 'attackVector', type: 'categorical', importance: 0.1 },
    ];

    // Initialize weights based on feature importance
    const weights = features.map((f) => f.importance);

    // Calculate model accuracy based on training data
    const accuracy = this.calculateModelAccuracy(trainingData, weights);

    const model: PredictionModel = {
      id: modelId,
      threatType,
      features,
      weights,
      accuracy,
      lastUpdated: Date.now(),
    };

    this.predictionModels.set(modelId, model);
    return modelId;
  }

  /**
   * Calculate model accuracy from training data
   */
  private calculateModelAccuracy(trainingData: ThreatPattern[], weights: number[]): number {
    if (trainingData.length === 0) return 0;

    let correctPredictions = 0;

    for (const pattern of trainingData) {
      const predictions = this.predictResponses(pattern);
      if (predictions.length > 0 && predictions[0].probability > 0.7) {
        correctPredictions += 1;
      }
    }

    return trainingData.length > 0 ? correctPredictions / trainingData.length : 0;
  }

  /**
   * Predict optimal responses for a threat
   */
  predictResponses(threat: ThreatPattern): PredictedResponse[] {
    const model = this.findBestModel(threat.threatType);
    if (!model) {
      return [];
    }

    // Score each response pattern
    const scoredResponses = threat.commonResponses.map((response, index) => {
      const score = this.calculateResponseScore(response, model.weights);
      return {
        responseType: response.responseType,
        probability: Math.min(score, 1),
        expectedDuration: response.averageDuration,
        expectedCost: response.costScore,
        expectedRiskReduction: response.riskReduction,
        rank: index + 1,
      };
    });

    // Sort by probability and return top predictions
    return scoredResponses
      .sort((a, b) => b.probability - a.probability)
      .slice(0, 5)
      .map((r, i) => ({ ...r, rank: i + 1 }));
  }

  /**
   * Calculate response effectiveness score
   */
  private calculateResponseScore(response: ResponsePattern, weights: number[]): number {
    const successWeight = 0.4;
    const durationWeight = 0.2;
    const costWeight = 0.2;
    const riskReductionWeight = 0.2;

    const normalizedDuration = Math.max(0, 1 - response.averageDuration / 3600000); // Normalize to 1 hour
    const normalizedCost = Math.max(0, 1 - response.costScore / 100);

    return (
      response.successRate * successWeight +
      normalizedDuration * durationWeight +
      normalizedCost * costWeight +
      response.riskReduction * riskReductionWeight
    );
  }

  /**
   * Find the best model for a threat type
   */
  private findBestModel(threatType: string): PredictionModel | undefined {
    let bestModel: PredictionModel | undefined;
    let bestAccuracy = 0;

    for (const model of this.predictionModels.values()) {
      if (model.threatType === threatType && model.accuracy > bestAccuracy) {
        bestModel = model;
        bestAccuracy = model.accuracy;
      }
    }

    return bestModel;
  }

  /**
   * Generate prediction for a threat
   */
  generatePrediction(threatId: string, threat: ThreatPattern): PredictionResult {
    const predictedResponses = this.predictResponses(threat);
    const confidence = predictedResponses.length > 0 ? predictedResponses[0].probability : 0;

    const reasoning =
      predictedResponses.length > 0
        ? `Based on ${threat.frequency} historical occurrences, ${predictedResponses[0].responseType} is recommended with ${(confidence * 100).toFixed(1)}% confidence`
        : 'Insufficient historical data for prediction';

    const prediction: PredictionResult = {
      threatId,
      predictedResponses,
      confidence,
      reasoning,
      timestamp: Date.now(),
    };

    this.predictions.set(threatId, prediction);
    this.predictionHistory.push(prediction);

    return prediction;
  }

  /**
   * Generate optimization recommendations
   */
  generateRecommendations(threatId: string, currentResponse: string): OptimizationRecommendation[] {
    const prediction = this.predictions.get(threatId);
    if (!prediction || prediction.predictedResponses.length === 0) {
      return [];
    }

    const recommendations: OptimizationRecommendation[] = [];

    for (const predicted of prediction.predictedResponses) {
      if (predicted.responseType !== currentResponse) {
        const improvementScore = predicted.probability - 0.5; // Baseline comparison

        recommendations.push({
          id: `rec_${threatId}_${predicted.responseType}_${Date.now()}`,
          threatId,
          currentResponse,
          recommendedResponse: predicted.responseType,
          improvementScore: Math.max(0, improvementScore),
          reasoning: `${predicted.responseType} has ${(predicted.probability * 100).toFixed(1)}% success rate vs current response`,
          estimatedBenefit: `${(predicted.expectedRiskReduction * 100).toFixed(1)}% risk reduction, ${(predicted.expectedDuration / 1000).toFixed(0)}s faster`,
        });
      }
    }

    this.recommendations.set(threatId, recommendations);
    return recommendations;
  }

  /**
   * Get prediction for a threat
   */
  getPrediction(threatId: string): PredictionResult | undefined {
    return this.predictions.get(threatId);
  }

  /**
   * Get recommendations for a threat
   */
  getRecommendations(threatId: string): OptimizationRecommendation[] {
    return this.recommendations.get(threatId) || [];
  }

  /**
   * Get recommendations by improvement score
   */
  getRecommendationsByScore(minScore: number = 0): OptimizationRecommendation[] {
    const allRecommendations = Array.from(this.recommendations.values()).flat();
    return allRecommendations
      .filter((r) => r.improvementScore >= minScore)
      .sort((a, b) => b.improvementScore - a.improvementScore);
  }

  /**
   * Update model with new data
   */
  updateModel(modelId: string, newData: ThreatPattern[]): void {
    const model = this.predictionModels.get(modelId);
    if (!model) return;

    // Recalculate accuracy with new data
    const newAccuracy = this.calculateModelAccuracy(newData, model.weights);
    model.accuracy = (model.accuracy + newAccuracy) / 2; // Average with previous accuracy
    model.lastUpdated = Date.now();
  }

  /**
   * Get prediction statistics
   */
  getStatistics(): PredictionStatistics {
    const accuracies = Array.from(this.predictionModels.values()).map((m) => m.accuracy);
    const averageAccuracy =
      accuracies.length > 0 ? accuracies.reduce((a, b) => a + b) / accuracies.length : 0;

    const predictionsByThreatType: Record<string, number> = {};
    for (const prediction of this.predictionHistory) {
      const threatType = this.threatPatterns.get(prediction.threatId)?.threatType || 'unknown';
      predictionsByThreatType[threatType] = (predictionsByThreatType[threatType] || 0) + 1;
    }

    return {
      totalPredictions: this.predictionHistory.length,
      averageAccuracy,
      modelCount: this.predictionModels.size,
      patternCount: this.threatPatterns.size,
      lastUpdateTime: Math.max(
        ...Array.from(this.predictionModels.values()).map((m) => m.lastUpdated),
        0
      ),
      predictionsByThreatType,
    };
  }

  /**
   * Export prediction report
   */
  exportPredictionReport(threatId: string): Record<string, unknown> {
    const prediction = this.predictions.get(threatId);
    const recommendations = this.recommendations.get(threatId) || [];

    return {
      threatId,
      prediction,
      recommendations,
      statistics: this.getStatistics(),
      timestamp: Date.now(),
    };
  }
}
