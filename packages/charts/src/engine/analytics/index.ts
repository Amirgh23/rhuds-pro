/**
 * Analytics Engine Module
 * Advanced analytics and insights
 */

export {
  PredictiveAnalyticsEngine,
  type PredictionModel,
  type Prediction,
  type TrainingConfig,
  type ModelMetrics,
} from './PredictiveAnalyticsEngine';

export {
  AnomalyDetectionSystem,
  type Anomaly,
  type AnomalyConfig,
  type DetectionResult,
  type AnomalyMethod,
} from './AnomalyDetectionSystem';

export {
  TrendAnalysisEngine,
  type TrendAnalysis,
  type Pattern,
  type MovingAverage,
  type TrendDirection,
} from './TrendAnalysisEngine';

export {
  CorrelationAnalyzer,
  type CorrelationResult,
  type CorrelationMatrix,
  type CovarianceResult,
} from './CorrelationAnalyzer';

export {
  ForecastingSystem,
  type Forecast,
  type ARIMAParams,
  type ExponentialSmoothingParams,
} from './ForecastingSystem';
