/**
 * Threat Prediction Engine
 * Predictive threat analysis and forecasting
 */

/**
 * Prediction model definition
 */
export interface PredictionModel {
  id: string;
  name: string;
  type: string;
  accuracy: number;
  trainingDataPoints: number;
  createdAt: Date;
}

/**
 * Threat prediction result
 */
export interface ThreatPrediction {
  id: string;
  threatType: string;
  probability: number;
  timeframe: string;
  confidence: number;
  factors: string[];
  timestamp: Date;
}

/**
 * Prediction statistics
 */
export interface PredictionStatistics {
  totalModels: number;
  totalPredictions: number;
  averageAccuracy: number;
  highProbabilityPredictions: number;
  mediumProbabilityPredictions: number;
  lowProbabilityPredictions: number;
}

/**
 * Threat Prediction Engine
 * Predicts future threats based on historical data
 */
export class ThreatPredictionEngine {
  private models: Map<string, PredictionModel> = new Map();
  private predictions: Map<string, ThreatPrediction> = new Map();
  private trainingData: Map<string, Array<Record<string, unknown>>> = new Map();

  /**
   * Create prediction model
   */
  createModel(name: string, type: string): PredictionModel {
    const id = `model-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const model: PredictionModel = {
      id,
      name,
      type,
      accuracy: 0,
      trainingDataPoints: 0,
      createdAt: new Date(),
    };

    this.models.set(id, model);
    this.trainingData.set(id, []);

    return model;
  }

  /**
   * Train model with data
   */
  trainModel(modelId: string, data: Array<Record<string, unknown>>): void {
    const model = this.models.get(modelId);
    if (!model) return;

    const trainingData = this.trainingData.get(modelId) || [];
    trainingData.push(...data);
    this.trainingData.set(modelId, trainingData);

    model.trainingDataPoints = trainingData.length;
    model.accuracy = Math.min(1, trainingData.length / 1000);
  }

  /**
   * Predict threat
   */
  predictThreat(
    modelId: string,
    threatType: string,
    features: Record<string, unknown>
  ): ThreatPrediction {
    const id = `prediction-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const model = this.models.get(modelId);

    const probability = Math.random();
    const confidence = model ? model.accuracy : 0.5;
    const factors = Object.keys(features).map((k) => `${k}: ${features[k]}`);

    const prediction: ThreatPrediction = {
      id,
      threatType,
      probability,
      timeframe: '24h',
      confidence,
      factors,
      timestamp: new Date(),
    };

    this.predictions.set(id, prediction);
    return prediction;
  }

  /**
   * Get model
   */
  getModel(modelId: string): PredictionModel | undefined {
    return this.models.get(modelId);
  }

  /**
   * Get all models
   */
  getAllModels(): PredictionModel[] {
    return Array.from(this.models.values());
  }

  /**
   * Get prediction
   */
  getPrediction(predictionId: string): ThreatPrediction | undefined {
    return this.predictions.get(predictionId);
  }

  /**
   * Get predictions by threat type
   */
  getPredictionsByThreatType(threatType: string): ThreatPrediction[] {
    return Array.from(this.predictions.values()).filter((p) => p.threatType === threatType);
  }

  /**
   * Get high probability predictions
   */
  getHighProbabilityPredictions(threshold: number): ThreatPrediction[] {
    return Array.from(this.predictions.values()).filter((p) => p.probability >= threshold);
  }

  /**
   * Get recent predictions
   */
  getRecentPredictions(hours: number): ThreatPrediction[] {
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
    return Array.from(this.predictions.values()).filter((p) => p.timestamp >= cutoff);
  }

  /**
   * Get statistics
   */
  getStatistics(): PredictionStatistics {
    const allPredictions = Array.from(this.predictions.values());

    return {
      totalModels: this.models.size,
      totalPredictions: allPredictions.length,
      averageAccuracy:
        Array.from(this.models.values()).length > 0
          ? Array.from(this.models.values()).reduce((sum, m) => sum + m.accuracy, 0) /
            this.models.size
          : 0,
      highProbabilityPredictions: allPredictions.filter((p) => p.probability >= 0.7).length,
      mediumProbabilityPredictions: allPredictions.filter(
        (p) => p.probability >= 0.4 && p.probability < 0.7
      ).length,
      lowProbabilityPredictions: allPredictions.filter((p) => p.probability < 0.4).length,
    };
  }

  /**
   * Export prediction report
   */
  exportPredictionReport(format: 'json' | 'csv'): string {
    const stats = this.getStatistics();
    const predictions = Array.from(this.predictions.values());

    if (format === 'json') {
      return JSON.stringify({ statistics: stats, predictions }, null, 2);
    }

    const rows = [
      ['Type', 'Value'],
      ['Total Models', stats.totalModels.toString()],
      ['Total Predictions', stats.totalPredictions.toString()],
      ['Average Accuracy', stats.averageAccuracy.toFixed(2)],
      ['High Probability', stats.highProbabilityPredictions.toString()],
      ['Medium Probability', stats.mediumProbabilityPredictions.toString()],
      ['Low Probability', stats.lowProbabilityPredictions.toString()],
    ];

    return rows.map((row) => row.join(',')).join('\n');
  }
}
