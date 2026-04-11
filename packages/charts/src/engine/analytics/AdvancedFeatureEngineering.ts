/**
 * Advanced Feature Engineering
 * Creates and transforms features for machine learning
 */

/**
 * Feature type
 */
export type FeatureType = 'numeric' | 'categorical' | 'temporal' | 'text' | 'derived';

/**
 * Feature definition
 */
export interface Feature {
  id: string;
  name: string;
  type: FeatureType;
  description: string;
  sourceColumns: string[];
  transformation?: (value: unknown) => number;
  statistics?: {
    mean: number;
    std: number;
    min: number;
    max: number;
  };
}

/**
 * Feature engineering result
 */
export interface FeatureEngineeringResult {
  id: string;
  timestamp: number;
  features: Feature[];
  transformedData: Record<string, number>[];
  statistics: Record<string, Record<string, number>>;
}

/**
 * Advanced Feature Engineering
 * Creates and transforms features for ML models
 */
export class AdvancedFeatureEngineering {
  private features: Map<string, Feature> = new Map();
  private results: Map<string, FeatureEngineeringResult> = new Map();

  /**
   * Create numeric feature
   */
  createNumericFeature(
    name: string,
    sourceColumns: string[],
    transformation?: (value: unknown) => number
  ): Feature {
    const id = `feat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const feature: Feature = {
      id,
      name,
      type: 'numeric',
      description: `Numeric feature: ${name}`,
      sourceColumns,
      transformation,
    };

    this.features.set(id, feature);
    return feature;
  }

  /**
   * Create categorical feature
   */
  createCategoricalFeature(name: string, sourceColumns: string[], categories: string[]): Feature {
    const id = `feat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const categoryMap = Object.fromEntries(categories.map((c, i) => [c, i]));

    const feature: Feature = {
      id,
      name,
      type: 'categorical',
      description: `Categorical feature: ${name}`,
      sourceColumns,
      transformation: (value) => categoryMap[String(value)] || 0,
    };

    this.features.set(id, feature);
    return feature;
  }

  /**
   * Create temporal feature
   */
  createTemporalFeature(name: string, sourceColumns: string[]): Feature {
    const id = `feat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const feature: Feature = {
      id,
      name,
      type: 'temporal',
      description: `Temporal feature: ${name}`,
      sourceColumns,
      transformation: (value) => {
        const date = new Date(String(value));
        return date.getTime() / 1000;
      },
    };

    this.features.set(id, feature);
    return feature;
  }

  /**
   * Create text feature
   */
  createTextFeature(name: string, sourceColumns: string[]): Feature {
    const id = `feat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const feature: Feature = {
      id,
      name,
      type: 'text',
      description: `Text feature: ${name}`,
      sourceColumns,
      transformation: (value) => {
        const text = String(value);
        return text.length;
      },
    };

    this.features.set(id, feature);
    return feature;
  }

  /**
   * Create derived feature
   */
  createDerivedFeature(
    name: string,
    sourceColumns: string[],
    transformation: (row: Record<string, unknown>) => number
  ): Feature {
    const id = `feat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const feature: Feature = {
      id,
      name,
      type: 'derived',
      description: `Derived feature: ${name}`,
      sourceColumns,
      transformation: (value) => {
        if (typeof value === 'object' && value !== null) {
          return transformation(value as Record<string, unknown>);
        }
        return 0;
      },
    };

    this.features.set(id, feature);
    return feature;
  }

  /**
   * Apply features to data
   */
  applyFeatures(data: Record<string, unknown>[], featureIds: string[]): FeatureEngineeringResult {
    const resultId = `result-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const selectedFeatures = featureIds
      .map((id) => this.features.get(id))
      .filter((f) => f !== undefined) as Feature[];

    const transformedData: Record<string, number>[] = [];
    const statistics: Record<string, Record<string, number>> = {};

    for (const feature of selectedFeatures) {
      statistics[feature.name] = {
        mean: 0,
        std: 0,
        min: Infinity,
        max: -Infinity,
      };
    }

    // Transform data
    for (const row of data) {
      const transformedRow: Record<string, number> = {};

      for (const feature of selectedFeatures) {
        let value = 0;

        if (feature.transformation) {
          const sourceValue = feature.sourceColumns
            .map((col) => row[col])
            .find((v) => v !== undefined);
          if (sourceValue !== undefined) {
            value = feature.transformation(sourceValue);
          }
        } else {
          const sourceValue = feature.sourceColumns
            .map((col) => row[col])
            .find((v) => v !== undefined);
          value = Number(sourceValue) || 0;
        }

        transformedRow[feature.name] = value;

        // Update statistics
        const stat = statistics[feature.name];
        stat.min = Math.min(stat.min, value);
        stat.max = Math.max(stat.max, value);
      }

      transformedData.push(transformedRow);
    }

    // Calculate mean and std
    for (const feature of selectedFeatures) {
      const values = transformedData.map((row) => row[feature.name]);
      const mean = values.reduce((a, b) => a + b, 0) / values.length;
      const variance = values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / values.length;

      statistics[feature.name].mean = mean;
      statistics[feature.name].std = Math.sqrt(variance);
    }

    const result: FeatureEngineeringResult = {
      id: resultId,
      timestamp: Date.now(),
      features: selectedFeatures,
      transformedData,
      statistics,
    };

    this.results.set(resultId, result);
    return result;
  }

  /**
   * Normalize features
   */
  normalizeFeatures(data: Record<string, number>[]): Record<string, number>[] {
    const normalized: Record<string, number>[] = [];

    // Calculate statistics
    const stats: Record<string, { mean: number; std: number }> = {};
    const keys = Object.keys(data[0] || {});

    for (const key of keys) {
      const values = data.map((row) => row[key]);
      const mean = values.reduce((a, b) => a + b, 0) / values.length;
      const variance = values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / values.length;
      stats[key] = { mean, std: Math.sqrt(variance) };
    }

    // Normalize
    for (const row of data) {
      const normalizedRow: Record<string, number> = {};
      for (const key of keys) {
        const { mean, std } = stats[key];
        normalizedRow[key] = (row[key] - mean) / (std || 1);
      }
      normalized.push(normalizedRow);
    }

    return normalized;
  }

  /**
   * Scale features
   */
  scaleFeatures(
    data: Record<string, number>[],
    min: number = 0,
    max: number = 1
  ): Record<string, number>[] {
    const scaled: Record<string, number>[] = [];

    // Calculate min/max
    const stats: Record<string, { min: number; max: number }> = {};
    const keys = Object.keys(data[0] || {});

    for (const key of keys) {
      const values = data.map((row) => row[key]);
      stats[key] = {
        min: Math.min(...values),
        max: Math.max(...values),
      };
    }

    // Scale
    for (const row of data) {
      const scaledRow: Record<string, number> = {};
      for (const key of keys) {
        const { min: minVal, max: maxVal } = stats[key];
        const range = maxVal - minVal || 1;
        scaledRow[key] = ((row[key] - minVal) / range) * (max - min) + min;
      }
      scaled.push(scaledRow);
    }

    return scaled;
  }

  /**
   * Get feature
   */
  getFeature(featureId: string): Feature | undefined {
    return this.features.get(featureId);
  }

  /**
   * List all features
   */
  listFeatures(): Feature[] {
    return Array.from(this.features.values());
  }

  /**
   * Get result
   */
  getResult(resultId: string): FeatureEngineeringResult | undefined {
    return this.results.get(resultId);
  }

  /**
   * Delete feature
   */
  deleteFeature(featureId: string): boolean {
    return this.features.delete(featureId);
  }
}
