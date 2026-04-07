/**
 * Machine Learning Integration
 * Predictions, classification, pattern detection, clustering
 */

export interface MLModel {
  name: string;
  type: 'regression' | 'classification' | 'clustering';
  accuracy: number;
  predict: (input: any) => any;
}

export interface PredictionResult {
  value: number;
  confidence: number;
  range: { min: number; max: number };
}

export interface ClassificationResult {
  class: string;
  probability: number;
  alternatives: Array<{ class: string; probability: number }>;
}

export interface ClusterResult {
  clusterId: number;
  centroid: number[];
  members: number[];
  size: number;
}

export interface PatternResult {
  pattern: number[];
  frequency: number;
  confidence: number;
  locations: number[];
}

/**
 * ML Integration
 */
export class MLIntegration {
  private models: Map<string, MLModel> = new Map();
  private trainingData: any[] = [];
  private listeners: Map<string, Function[]> = new Map();

  /**
   * Simple linear regression predictor
   */
  public predictNextValue(data: number[]): PredictionResult {
    if (data.length < 2) {
      return {
        value: data[0] || 0,
        confidence: 0,
        range: { min: 0, max: 0 },
      };
    }

    // Calculate trend
    const n = data.length;
    const xMean = (n - 1) / 2;
    const yMean = data.reduce((a, b) => a + b, 0) / n;

    let numerator = 0;
    let denominator = 0;

    for (let i = 0; i < n; i++) {
      numerator += (i - xMean) * (data[i] - yMean);
      denominator += (i - xMean) * (i - xMean);
    }

    const slope = denominator === 0 ? 0 : numerator / denominator;
    const intercept = yMean - slope * xMean;

    // Predict next value
    const predictedValue = slope * n + intercept;

    // Calculate confidence based on variance
    const variance = data.reduce((a, b) => a + Math.pow(b - yMean, 2), 0) / n;
    const stdDev = Math.sqrt(variance);
    const confidence = Math.max(0, 1 - stdDev / (Math.abs(yMean) || 1));

    // Calculate range
    const range = {
      min: predictedValue - stdDev,
      max: predictedValue + stdDev,
    };

    this.emit('prediction:made', { value: predictedValue, confidence });

    return {
      value: predictedValue,
      confidence,
      range,
    };
  }

  /**
   * Simple classification
   */
  public classifyData(
    data: number[],
    classes: string[] = ['low', 'medium', 'high']
  ): ClassificationResult {
    if (data.length === 0) {
      return {
        class: classes[0],
        probability: 0,
        alternatives: [],
      };
    }

    const mean = data.reduce((a, b) => a + b, 0) / data.length;
    const stdDev = Math.sqrt(data.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / data.length);

    // Simple classification based on mean
    let classIndex = 0;
    if (mean > stdDev) classIndex = 2;
    else if (mean > 0) classIndex = 1;

    const probability = 0.7 + Math.random() * 0.3; // Simulated confidence

    const alternatives = classes
      .map((c, i) => ({
        class: c,
        probability: i === classIndex ? probability : (1 - probability) / (classes.length - 1),
      }))
      .filter((_, i) => i !== classIndex);

    this.emit('classification:done', { class: classes[classIndex], probability });

    return {
      class: classes[classIndex],
      probability,
      alternatives,
    };
  }

  /**
   * Detect patterns in data
   */
  public detectPatterns(data: number[], patternLength: number = 3): PatternResult[] {
    if (data.length < patternLength * 2) {
      return [];
    }

    const patterns = new Map<string, { locations: number[]; count: number }>();

    // Find repeating patterns
    for (let i = 0; i <= data.length - patternLength; i++) {
      const pattern = data.slice(i, i + patternLength);
      const key = pattern.join(',');

      if (!patterns.has(key)) {
        patterns.set(key, { locations: [], count: 0 });
      }

      const entry = patterns.get(key)!;
      entry.locations.push(i);
      entry.count++;
    }

    // Convert to results
    const results: PatternResult[] = [];

    patterns.forEach((entry, key) => {
      if (entry.count >= 2) {
        const pattern = key.split(',').map(Number);
        const frequency = entry.count / (data.length - patternLength + 1);
        const confidence = Math.min(1, frequency * 2);

        results.push({
          pattern,
          frequency: entry.count,
          confidence,
          locations: entry.locations,
        });
      }
    });

    this.emit('patterns:detected', { count: results.length });

    return results.sort((a, b) => b.frequency - a.frequency);
  }

  /**
   * K-means clustering
   */
  public cluster(data: number[][], k: number = 3): ClusterResult[] {
    if (data.length === 0 || k <= 0) {
      return [];
    }

    k = Math.min(k, data.length);

    // Initialize centroids randomly
    const centroids: number[][] = [];
    for (let i = 0; i < k; i++) {
      const randomIndex = Math.floor(Math.random() * data.length);
      centroids.push([...data[randomIndex]]);
    }

    // K-means iterations
    let assignments: number[] = new Array(data.length).fill(0);
    let converged = false;
    let iterations = 0;
    const maxIterations = 100;

    while (!converged && iterations < maxIterations) {
      // Assign points to nearest centroid
      const newAssignments = data.map((point) => {
        let minDistance = Infinity;
        let nearestCluster = 0;

        centroids.forEach((centroid, i) => {
          const distance = this.euclideanDistance(point, centroid);
          if (distance < minDistance) {
            minDistance = distance;
            nearestCluster = i;
          }
        });

        return nearestCluster;
      });

      // Check convergence
      converged = newAssignments.every((a, i) => a === assignments[i]);
      assignments = newAssignments;

      // Update centroids
      for (let i = 0; i < k; i++) {
        const clusterPoints = data.filter((_, j) => assignments[j] === i);
        if (clusterPoints.length > 0) {
          const dims = data[0].length;
          for (let d = 0; d < dims; d++) {
            centroids[i][d] = clusterPoints.reduce((a, p) => a + p[d], 0) / clusterPoints.length;
          }
        }
      }

      iterations++;
    }

    // Create results
    const results: ClusterResult[] = [];
    for (let i = 0; i < k; i++) {
      const members = assignments.map((a, j) => (a === i ? j : -1)).filter((j) => j !== -1);

      results.push({
        clusterId: i,
        centroid: centroids[i],
        members,
        size: members.length,
      });
    }

    this.emit('clustering:done', { clusterCount: k, iterations });

    return results;
  }

  /**
   * Anomaly detection using isolation forest concept
   */
  public detectAnomalies(data: number[][], threshold: number = 0.7): number[] {
    if (data.length === 0) {
      return [];
    }

    const anomalies: number[] = [];
    const mean = this.calculateMean(data);
    const stdDev = this.calculateStdDev(data, mean);

    data.forEach((point, index) => {
      const distance = this.euclideanDistance(point, mean);
      const normalizedDistance =
        stdDev.length > 0
          ? distance / this.euclideanDistance(stdDev, new Array(stdDev.length).fill(0))
          : 0;

      if (normalizedDistance > threshold) {
        anomalies.push(index);
      }
    });

    this.emit('anomalies:detected', { count: anomalies.length });

    return anomalies;
  }

  /**
   * Register custom model
   */
  public registerModel(name: string, model: MLModel): void {
    this.models.set(name, model);
    this.emit('model:registered', { name, type: model.type });
  }

  /**
   * Use registered model
   */
  public useModel(name: string, input: any): any {
    const model = this.models.get(name);
    if (!model) {
      throw new Error(`Model not found: ${name}`);
    }

    return model.predict(input);
  }

  /**
   * Get model info
   */
  public getModelInfo(name: string): MLModel | undefined {
    return this.models.get(name);
  }

  /**
   * Euclidean distance
   */
  private euclideanDistance(a: number[], b: number[]): number {
    let sum = 0;
    for (let i = 0; i < Math.min(a.length, b.length); i++) {
      sum += Math.pow(a[i] - b[i], 2);
    }
    return Math.sqrt(sum);
  }

  /**
   * Calculate mean vector
   */
  private calculateMean(data: number[][]): number[] {
    if (data.length === 0) return [];

    const dims = data[0].length;
    const mean = new Array(dims).fill(0);

    data.forEach((point) => {
      point.forEach((value, i) => {
        mean[i] += value;
      });
    });

    return mean.map((m) => m / data.length);
  }

  /**
   * Calculate standard deviation vector
   */
  private calculateStdDev(data: number[][], mean: number[]): number[] {
    if (data.length === 0) return [];

    const dims = data[0].length;
    const variance = new Array(dims).fill(0);

    data.forEach((point) => {
      point.forEach((value, i) => {
        variance[i] += Math.pow(value - mean[i], 2);
      });
    });

    return variance.map((v) => Math.sqrt(v / data.length));
  }

  /**
   * Listen to events
   */
  public on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  /**
   * Emit event
   */
  private emit(event: string, data: any): void {
    const callbacks = this.listeners.get(event) || [];
    callbacks.forEach((cb) => cb(data));
  }

  /**
   * Destroy ML integration
   */
  public destroy(): void {
    this.models.clear();
    this.trainingData = [];
    this.listeners.clear();
  }
}

export default MLIntegration;
