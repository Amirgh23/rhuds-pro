/**
 * Registry System Types
 * Defines types for managing chart components
 */

import type { DatasetController, ChartElement, Scale, Plugin, ChartType } from './index';

/**
 * Registry component type
 */
export type RegistryComponentType = 'controller' | 'element' | 'scale' | 'plugin';

/**
 * Registry entry for a component
 */
export interface RegistryEntry<T = any> {
  id: string;
  type: RegistryComponentType;
  component: T;
  metadata?: {
    description?: string;
    version?: string;
    author?: string;
  };
}

/**
 * Registry configuration
 */
export interface RegistryConfig {
  autoRegisterDefaults?: boolean;
  validateDuplicates?: boolean;
  throwOnError?: boolean;
}

/**
 * Registry lookup result
 */
export interface RegistryLookupResult<T = any> {
  found: boolean;
  component?: T;
  error?: string;
}

/**
 * Registry statistics
 */
export interface RegistryStats {
  totalControllers: number;
  totalElements: number;
  totalScales: number;
  totalPlugins: number;
  total: number;
}

/**
 * Controller registration options
 */
export interface ControllerRegistrationOptions {
  id: string;
  chartType: ChartType;
  component: any;
  metadata?: {
    description?: string;
    version?: string;
  };
}

/**
 * Element registration options
 */
export interface ElementRegistrationOptions {
  id: string;
  component: any;
  metadata?: {
    description?: string;
    version?: string;
  };
}

/**
 * Scale registration options
 */
export interface ScaleRegistrationOptions {
  id: string;
  scaleType: string;
  component: any;
  metadata?: {
    description?: string;
    version?: string;
  };
}

/**
 * Plugin registration options
 */
export interface PluginRegistrationOptions {
  id: string;
  component: Plugin;
  metadata?: {
    description?: string;
    version?: string;
  };
}
