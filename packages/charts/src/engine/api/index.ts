/**
 * API Module - Advanced API Management
 * Exports all API management components
 */

export {
  APIVersioningManager,
  type APIVersion,
  type VersionedEndpoint,
  type VersionStrategy,
} from './APIVersioningManager';
export {
  GraphQLIntegration,
  type GraphQLType,
  type GraphQLField,
  type GraphQLResolver,
  type GraphQLQuery,
} from './GraphQLIntegration';
export { AnalyticsEngine, type APIMetric, type AnalyticsReport } from './AnalyticsEngine';
export {
  RateLimitingAdvanced,
  type RateLimitConfig,
  type RateLimitQuota,
  type RateLimitRule,
} from './RateLimitingAdvanced';
export {
  APIDocumentationGenerator,
  type APIEndpointDoc,
  type APIParameter,
  type APISchema,
  type APIExample,
} from './APIDocumentationGenerator';
