/**
 * Code Splitting Utilities
 * Provides dynamic route loading and chunk management
 */

import { ComponentType, lazy } from 'react';

interface DynamicRouteOptions {
  chunkName?: string;
  preload?: boolean;
  prefetch?: boolean;
}

/**
 * Create a lazy-loaded route component with chunk naming
 */
export function createLazyRoute<P extends object>(
  importFn: () => Promise<{ default: ComponentType<P> }>,
  options: DynamicRouteOptions = {}
) {
  const { chunkName } = options;

  // Add webpack magic comment for chunk naming
  const wrappedImport = () => {
    const comment = chunkName ? `/* webpackChunkName: "${chunkName}" */` : '';
    return importFn();
  };

  return lazy(wrappedImport);
}

/**
 * Preload a chunk by creating a link element
 */
export function preloadChunk(chunkName: string): void {
  if (typeof document === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'script';
  link.href = `/dist/${chunkName}.js`;
  document.head.appendChild(link);
}

/**
 * Prefetch a chunk for later use
 */
export function prefetchChunk(chunkName: string): void {
  if (typeof document === 'undefined') return;

  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.as = 'script';
  link.href = `/dist/${chunkName}.js`;
  document.head.appendChild(link);
}

/**
 * Monitor chunk loading performance
 */
export interface ChunkMetrics {
  chunkName: string;
  loadTime: number;
  size: number;
  cached: boolean;
}

const chunkMetrics: Map<string, ChunkMetrics> = new Map();

export function recordChunkMetric(metric: ChunkMetrics): void {
  chunkMetrics.set(metric.chunkName, metric);
}

export function getChunkMetrics(): ChunkMetrics[] {
  return Array.from(chunkMetrics.values());
}

export function getChunkMetric(chunkName: string): ChunkMetrics | undefined {
  return chunkMetrics.get(chunkName);
}

/**
 * Analyze bundle chunks
 */
export interface BundleAnalysis {
  totalSize: number;
  chunks: Array<{
    name: string;
    size: number;
    percentage: number;
  }>;
}

export function analyzeBundleChunks(metrics: ChunkMetrics[]): BundleAnalysis {
  const totalSize = metrics.reduce((sum, m) => sum + m.size, 0);

  return {
    totalSize,
    chunks: metrics
      .map((m) => ({
        name: m.chunkName,
        size: m.size,
        percentage: (m.size / totalSize) * 100,
      }))
      .sort((a, b) => b.size - a.size),
  };
}

/**
 * Get chunk loading strategy recommendation
 */
export function getChunkStrategy(chunkName: string): 'preload' | 'prefetch' | 'lazy' {
  // Critical chunks should be preloaded
  const criticalChunks = ['main', 'vendor'];
  if (criticalChunks.includes(chunkName)) {
    return 'preload';
  }

  // Route chunks should be prefetched
  const routeChunks = ['showcase', 'playground', 'docs', 'coldwar', 'charts'];
  if (routeChunks.includes(chunkName)) {
    return 'prefetch';
  }

  // Everything else is lazy loaded
  return 'lazy';
}
