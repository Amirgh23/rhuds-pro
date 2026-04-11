/**
 * Anomaly Detection System
 * Detects anomalies and outliers in data
 */

/**
 * Anomaly detection method
 */
export type AnomalyMethod = 'zscore' | 'iqr' | 'isolation-forest' | 'dbscan' | 'autoencoder';

/**
 * Detected anomaly
 */
export interface Anomaly {
  id: string;
  timestamp: number;
  dataPoint: Record<string, number>;
  score: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  method: AnomalyMethod;
  explanation: string;
}

/**
 * Anomaly detection configuration
 */
export interface AnomalyConfig {
  method: AnomalyMethod;
  threshold: number;
  sensitivity: number;
  windowSize: number;
  minClusterSize?: number;
  eps?: number;
}

/**
 * Detection result
 */
export interface DetectionResult {
  id: string;
  timestamp: number;
  anomalies: Anomaly[];
  normalCount: number;
  anomalyCount: number;
  anomalyRate: number;
}

/**
 * Anomaly Detection System
 * Detects anomalies using multiple algorithms
 */
export class AnomalyDetectionSystem {
  private detectionResults: Map<string, DetectionResult> = new Map();
  private dataHistory: Record<string, number>[] = [];
  private anomalies: Anomaly[] = [];

  /**
   * Detect anomalies in dataset
   */
  detectAnomalies(data: Record<string, number>[], config: AnomalyConfig): DetectionResult {
    const resultId = `detection-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const anomalies: Anomaly[] = [];

    // Store data history
    this.dataHistory.push(...data);

    // Apply selected detection method
    let detectedAnomalies: Anomaly[] = [];

    if (config.method === 'zscore') {
      detectedAnomalies = this.detectZScore(data, config);
    } else if (config.method === 'iqr') {
      detectedAnomalies = this.detectIQR(data, config);
    } else if (config.method === 'isolation-forest') {
      detectedAnomalies = this.detectIsolationForest(data, config);
    } else if (config.method === 'dbscan') {
      detectedAnomalies = this.detectDBSCAN(data, config);
    } else if (config.method === 'autoencoder') {
      detectedAnomalies = this.detectAutoencoder(data, config);
    }

    anomalies.push(...detectedAnomalies);
    this.anomalies.push(...anomalies);

    const result: DetectionResult = {
      id: resultId,
      timestamp: Date.now(),
      anomalies,
      normalCount: data.length - anomalies.length,
      anomalyCount: anomalies.length,
      anomalyRate: anomalies.length / data.length,
    };

    this.detectionResults.set(resultId, result);
    return result;
  }

  /**
   * Z-Score based anomaly detection
   */
  private detectZScore(data: Record<string, number>[], config: AnomalyConfig): Anomaly[] {
    const anomalies: Anomaly[] = [];
    const keys = Object.keys(data[0] || {});

    for (const key of keys) {
      const values = data.map((d) => d[key] || 0);
      const mean = values.reduce((a, b) => a + b, 0) / values.length;
      const variance = values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / values.length;
      const stdDev = Math.sqrt(variance);

      for (let i = 0; i < data.length; i++) {
        const zScore = Math.abs((values[i] - mean) / (stdDev || 1));
        if (zScore > config.threshold) {
          const severity = this.calculateSeverity(zScore, config.threshold);
          anomalies.push({
            id: `anomaly-${Date.now()}-${i}`,
            timestamp: Date.now(),
            dataPoint: data[i],
            score: zScore,
            severity,
            method: 'zscore',
            explanation: `Z-score ${zScore.toFixed(2)} exceeds threshold ${config.threshold}`,
          });
        }
      }
    }

    return anomalies;
  }

  /**
   * IQR based anomaly detection
   */
  private detectIQR(data: Record<string, number>[], config: AnomalyConfig): Anomaly[] {
    const anomalies: Anomaly[] = [];
    const keys = Object.keys(data[0] || {});

    for (const key of keys) {
      const values = data.map((d) => d[key] || 0).sort((a, b) => a - b);
      const q1 = values[Math.floor(values.length * 0.25)];
      const q3 = values[Math.floor(values.length * 0.75)];
      const iqr = q3 - q1;
      const lowerBound = q1 - 1.5 * iqr;
      const upperBound = q3 + 1.5 * iqr;

      for (let i = 0; i < data.length; i++) {
        const value = data[i][key] || 0;
        if (value < lowerBound || value > upperBound) {
          const distance = Math.min(Math.abs(value - lowerBound), Math.abs(value - upperBound));
          const severity = this.calculateSeverity(distance / iqr, config.threshold);

          anomalies.push({
            id: `anomaly-${Date.now()}-${i}`,
            timestamp: Date.now(),
            dataPoint: data[i],
            score: distance / iqr,
            severity,
            method: 'iqr',
            explanation: `Value ${value} outside IQR bounds [${lowerBound.toFixed(2)}, ${upperBound.toFixed(2)}]`,
          });
        }
      }
    }

    return anomalies;
  }

  /**
   * Isolation Forest based anomaly detection
   */
  private detectIsolationForest(data: Record<string, number>[], config: AnomalyConfig): Anomaly[] {
    const anomalies: Anomaly[] = [];
    const numTrees = 100;
    const sampleSize = Math.min(256, data.length);

    for (let i = 0; i < data.length; i++) {
      let anomalyScore = 0;

      for (let t = 0; t < numTrees; t++) {
        const sample = this.randomSample(data, sampleSize);
        const depth = this.isolationTreeDepth(data[i], sample, 0);
        anomalyScore += depth;
      }

      anomalyScore /= numTrees;
      const normalizedScore = Math.exp(-anomalyScore / 10);

      if (normalizedScore > config.threshold) {
        const severity = this.calculateSeverity(normalizedScore, config.threshold);
        anomalies.push({
          id: `anomaly-${Date.now()}-${i}`,
          timestamp: Date.now(),
          dataPoint: data[i],
          score: normalizedScore,
          severity,
          method: 'isolation-forest',
          explanation: `Isolation score ${normalizedScore.toFixed(3)} exceeds threshold`,
        });
      }
    }

    return anomalies;
  }

  /**
   * DBSCAN based anomaly detection
   */
  private detectDBSCAN(data: Record<string, number>[], config: AnomalyConfig): Anomaly[] {
    const anomalies: Anomaly[] = [];
    const eps = config.eps || 0.5;
    const minPts = config.minClusterSize || 5;
    const visited = new Set<number>();
    const clusters: number[][] = [];

    for (let i = 0; i < data.length; i++) {
      if (visited.has(i)) continue;

      const neighbors = this.getNeighbors(data, i, eps);

      if (neighbors.length < minPts) {
        // Mark as noise/anomaly
        anomalies.push({
          id: `anomaly-${Date.now()}-${i}`,
          timestamp: Date.now(),
          dataPoint: data[i],
          score: 1.0,
          severity: 'high',
          method: 'dbscan',
          explanation: `Point has fewer than ${minPts} neighbors within eps=${eps}`,
        });
      } else {
        // Start new cluster
        const cluster: number[] = [];
        this.expandCluster(data, i, neighbors, cluster, visited, eps, minPts);
        clusters.push(cluster);
      }

      visited.add(i);
    }

    return anomalies;
  }

  /**
   * Autoencoder based anomaly detection
   */
  private detectAutoencoder(data: Record<string, number>[], config: AnomalyConfig): Anomaly[] {
    const anomalies: Anomaly[] = [];

    // Simplified autoencoder: encode-decode with bottleneck
    for (let i = 0; i < data.length; i++) {
      const point = Object.values(data[i]);

      // Encode: reduce dimensionality
      const encoded = this.encode(point);

      // Decode: reconstruct
      const decoded = this.decode(encoded);

      // Calculate reconstruction error
      let error = 0;
      for (let j = 0; j < point.length; j++) {
        error += (point[j] - decoded[j]) ** 2;
      }
      error = Math.sqrt(error / point.length);

      if (error > config.threshold) {
        const severity = this.calculateSeverity(error, config.threshold);
        anomalies.push({
          id: `anomaly-${Date.now()}-${i}`,
          timestamp: Date.now(),
          dataPoint: data[i],
          score: error,
          severity,
          method: 'autoencoder',
          explanation: `Reconstruction error ${error.toFixed(3)} exceeds threshold`,
        });
      }
    }

    return anomalies;
  }

  /**
   * Encode data (dimensionality reduction)
   */
  private encode(data: number[]): number[] {
    // Simple PCA-like encoding
    const encoded: number[] = [];
    for (let i = 0; i < Math.min(3, data.length); i++) {
      encoded.push(data[i] || 0);
    }
    return encoded;
  }

  /**
   * Decode data (reconstruction)
   */
  private decode(encoded: number[]): number[] {
    // Simple reconstruction
    const decoded: number[] = [];
    for (let i = 0; i < encoded.length; i++) {
      decoded.push(encoded[i] * 0.95); // Add some noise
    }
    return decoded;
  }

  /**
   * Get neighbors within eps distance
   */
  private getNeighbors(data: Record<string, number>[], index: number, eps: number): number[] {
    const neighbors: number[] = [];
    const point = data[index];

    for (let i = 0; i < data.length; i++) {
      if (i === index) continue;
      const distance = this.euclideanDistance(point, data[i]);
      if (distance <= eps) {
        neighbors.push(i);
      }
    }

    return neighbors;
  }

  /**
   * Expand cluster in DBSCAN
   */
  private expandCluster(
    data: Record<string, number>[],
    index: number,
    neighbors: number[],
    cluster: number[],
    visited: Set<number>,
    eps: number,
    minPts: number
  ): void {
    cluster.push(index);
    visited.add(index);

    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        const newNeighbors = this.getNeighbors(data, neighbor, eps);

        if (newNeighbors.length >= minPts) {
          this.expandCluster(data, neighbor, newNeighbors, cluster, visited, eps, minPts);
        }
      }
    }
  }

  /**
   * Calculate Euclidean distance
   */
  private euclideanDistance(a: Record<string, number>, b: Record<string, number>): number {
    let sum = 0;
    for (const key in a) {
      const diff = (a[key] || 0) - (b[key] || 0);
      sum += diff * diff;
    }
    return Math.sqrt(sum);
  }

  /**
   * Isolation tree depth
   */
  private isolationTreeDepth(
    point: Record<string, number>,
    data: Record<string, number>[],
    depth: number
  ): number {
    if (data.length <= 1 || depth > 20) return depth;

    const keys = Object.keys(point);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    const values = data.map((d) => d[randomKey] || 0);
    const minVal = Math.min(...values);
    const maxVal = Math.max(...values);
    const splitValue = minVal + Math.random() * (maxVal - minVal);

    const left = data.filter((d) => (d[randomKey] || 0) < splitValue);
    const right = data.filter((d) => (d[randomKey] || 0) >= splitValue);

    const pointValue = point[randomKey] || 0;
    const nextData = pointValue < splitValue ? left : right;

    return this.isolationTreeDepth(point, nextData, depth + 1);
  }

  /**
   * Random sample from data
   */
  private randomSample<T>(data: T[], size: number): T[] {
    const sample: T[] = [];
    for (let i = 0; i < size; i++) {
      sample.push(data[Math.floor(Math.random() * data.length)]);
    }
    return sample;
  }

  /**
   * Calculate severity based on score
   */
  private calculateSeverity(
    score: number,
    threshold: number
  ): 'low' | 'medium' | 'high' | 'critical' {
    const ratio = score / threshold;
    if (ratio > 3) return 'critical';
    if (ratio > 2) return 'high';
    if (ratio > 1.5) return 'medium';
    return 'low';
  }

  /**
   * Get detection result
   */
  getDetectionResult(resultId: string): DetectionResult | undefined {
    return this.detectionResults.get(resultId);
  }

  /**
   * Get all anomalies
   */
  getAllAnomalies(): Anomaly[] {
    return this.anomalies;
  }

  /**
   * Get anomalies by severity
   */
  getAnomaliesBySeverity(severity: string): Anomaly[] {
    return this.anomalies.filter((a) => a.severity === severity);
  }

  /**
   * Get anomalies by method
   */
  getAnomaliesByMethod(method: AnomalyMethod): Anomaly[] {
    return this.anomalies.filter((a) => a.method === method);
  }

  /**
   * Clear anomalies
   */
  clearAnomalies(): void {
    this.anomalies = [];
    this.detectionResults.clear();
  }
}
