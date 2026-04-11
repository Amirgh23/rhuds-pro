/**
 * Documentation Module - Automatic Documentation Generation
 * Exports all documentation generation classes
 */

export { APIDocumentationGenerator } from './APIDocumentationGenerator';
export type {
  APIEndpoint,
  APIDocumentation,
  ParameterDef,
  RequestBodyDef,
  ResponseDef,
  APIExample,
  AuthenticationDef,
  RateLimitDef,
} from './APIDocumentationGenerator';

export { UsageGuideGenerator } from './UsageGuideGenerator';
export type {
  GuideSection,
  CodeExample,
  UsageGuide,
  TutorialStep,
  Tutorial,
} from './UsageGuideGenerator';

export { ArchitectureDocumenter } from './ArchitectureDocumenter';
export type {
  Component,
  InterfaceDef,
  MethodDef,
  ArchitectureLayer,
  ArchitecturePattern,
  Interaction,
  ArchitectureDocument,
  DataFlowDiagram,
  DataFlow,
  DeploymentModel,
  DeploymentEnvironment,
  ResourceRequirements,
} from './ArchitectureDocumenter';

export { BestPracticesCompiler } from './BestPracticesCompiler';
export type {
  BestPractice,
  PracticeExample,
  BestPracticesGuide,
  PracticeCategory,
  ChecklistItem,
  PracticeMetrics,
} from './BestPracticesCompiler';

export { TroubleshootingGuideBuilder } from './TroubleshootingGuideBuilder';
export type {
  Issue,
  Solution,
  TroubleshootingGuide,
  TroubleshootingCategory,
  FAQItem,
  DiagnosticTool,
  TroubleshootingMetrics,
} from './TroubleshootingGuideBuilder';
