/**
 * AI & Machine Learning Module
 * Advanced AI capabilities including model management, predictive analytics, NLP, and computer vision
 */

export { AIModelManager } from './AIModelManager';
export type { AIModel, ModelVersion, ABTestConfig, ModelPerformance } from './AIModelManager';

export { PredictiveAnalyticsEngine } from './PredictiveAnalyticsEngine';
export type {
  TimeSeriesData,
  Forecast,
  RegressionResult,
  ClassificationResult,
  EnsembleResult,
} from './PredictiveAnalyticsEngine';

export { NLPIntegration } from './NLPIntegration';
export type {
  TextClassificationResult,
  SentimentResult,
  Entity,
  Topic,
  LanguageDetectionResult,
} from './NLPIntegration';

export { ComputerVisionIntegration } from './ComputerVisionIntegration';
export type {
  ImageClassificationResult,
  DetectedObject,
  FaceDetectionResult,
  SceneAnalysis,
  VideoAnalysisResult,
} from './ComputerVisionIntegration';

export { AnomalyDetectionSystem } from './AnomalyDetectionSystem';
export type { AnomalyScore, AnomalyAlert, AnomalyPattern } from './AnomalyDetectionSystem';
