/**
 * Preload/Prefetch Strategy Utilities
 * Manages intelligent resource preloading and prefetching
 */

export interface ResourceHint {
  url: string;
  type: 'preload' | 'prefetch' | 'preconnect' | 'dns-prefetch';
  as?: string;
  crossOrigin?: boolean;
}

/**
 * Critical resources to preload immediately
 */
export const PRELOAD_RESOURCES: ResourceHint[] = [
  {
    url: '/vendor-react.js',
    type: 'preload',
    as: 'script',
  },
  {
    url: '/vendor-rhuds.js',
    type: 'preload',
    as: 'script',
  },
  {
    url: '/main.js',
    type: 'preload',
    as: 'script',
  },
  {
    url: '/styles/global.css',
    type: 'preload',
    as: 'style',
  },
];

/**
 * Secondary resources to prefetch
 */
export const PREFETCH_RESOURCES: ResourceHint[] = [
  {
    url: '/vendor-utils.js',
    type: 'prefetch',
    as: 'script',
  },
  {
    url: '/route-showcase.js',
    type: 'prefetch',
    as: 'script',
  },
  {
    url: '/route-playground.js',
    type: 'prefetch',
    as: 'script',
  },
  {
    url: '/route-docs.js',
    type: 'prefetch',
    as: 'script',
  },
];

/**
 * External services to preconnect
 */
export const PRECONNECT_RESOURCES: ResourceHint[] = [
  {
    url: 'https://fonts.googleapis.com',
    type: 'preconnect',
    crossOrigin: true,
  },
  {
    url: 'https://fonts.gstatic.com',
    type: 'preconnect',
    crossOrigin: true,
  },
];

/**
 * DNS prefetch for external domains
 */
export const DNS_PREFETCH_RESOURCES: ResourceHint[] = [
  {
    url: 'https://cdn.example.com',
    type: 'dns-prefetch',
  },
  {
    url: 'https://api.example.com',
    type: 'dns-prefetch',
  },
];

/**
 * Apply resource hint to document
 */
export function applyResourceHint(hint: ResourceHint): void {
  if (typeof document === 'undefined') return;

  const link = document.createElement('link');
  link.rel = hint.type;
  link.href = hint.url;

  if (hint.as) {
    link.as = hint.as;
  }

  if (hint.crossOrigin) {
    link.crossOrigin = 'anonymous';
  }

  document.head.appendChild(link);
}

/**
 * Apply multiple resource hints
 */
export function applyResourceHints(hints: ResourceHint[]): void {
  hints.forEach((hint) => applyResourceHint(hint));
}

/**
 * Get optimal preload strategy based on connection
 */
export function getOptimalPreloadStrategy(
  connection?: 'slow-2g' | '2g' | '3g' | '4g'
): ResourceHint[] {
  const baseResources = [...PRELOAD_RESOURCES];

  switch (connection) {
    case 'slow-2g':
    case '2g':
      // Only preload critical resources
      return baseResources;
    case '3g':
      // Preload critical + some prefetch
      return [...baseResources, ...PREFETCH_RESOURCES.slice(0, 2)];
    case '4g':
    default:
      // Preload all resources
      return [...baseResources, ...PREFETCH_RESOURCES, ...PRECONNECT_RESOURCES];
  }
}

/**
 * Monitor preload effectiveness
 */
export interface PreloadMetrics {
  resourcesPreloaded: number;
  totalSizePreloaded: number;
  averageLoadTime: number;
  cacheHitRate: number;
  preloadEffectiveness: number; // 0-100
}

const preloadMetrics: Map<string, PreloadMetrics> = new Map();

export function recordPreloadMetric(resource: string, metric: PreloadMetrics): void {
  preloadMetrics.set(resource, metric);
}

export function getPreloadMetrics(): PreloadMetrics[] {
  return Array.from(preloadMetrics.values());
}

export function calculatePreloadEffectiveness(): number {
  const metrics = getPreloadMetrics();
  if (metrics.length === 0) return 0;

  const avgEffectiveness =
    metrics.reduce((sum, m) => sum + m.preloadEffectiveness, 0) / metrics.length;
  return Math.round(avgEffectiveness);
}

/**
 * Get preload recommendations
 */
export function getPreloadRecommendations(): string[] {
  const recommendations: string[] = [];
  const metrics = getPreloadMetrics();

  if (metrics.length === 0) {
    return ['No preload metrics available yet'];
  }

  const avgEffectiveness = calculatePreloadEffectiveness();

  if (avgEffectiveness < 60) {
    recommendations.push('⚠️ Preload effectiveness is low - consider adjusting strategy');
  } else if (avgEffectiveness > 85) {
    recommendations.push('✅ Preload strategy is highly effective');
  }

  const avgLoadTime = metrics.reduce((sum, m) => sum + m.averageLoadTime, 0) / metrics.length;
  if (avgLoadTime > 800) {
    recommendations.push('⚠️ Average load time is high - consider preloading more resources');
  }

  const avgCacheHit = metrics.reduce((sum, m) => sum + m.cacheHitRate, 0) / metrics.length;
  if (avgCacheHit > 75) {
    recommendations.push('💡 High cache hit rate - preload strategy is working well');
  }

  return recommendations;
}

/**
 * Initialize preload/prefetch monitoring
 */
export function initPreloadMonitoring(): void {
  if (typeof window === 'undefined') return;

  window.addEventListener('load', () => {
    const strategy = getOptimalPreloadStrategy(getConnectionSpeed());

    console.group('📦 Preload/Prefetch Metrics');
    console.log(`Resources Preloaded: ${PRELOAD_RESOURCES.length}`);
    console.log(`Resources Prefetched: ${PREFETCH_RESOURCES.length}`);
    console.log(`Preload Effectiveness: ${calculatePreloadEffectiveness()}%`);

    const recommendations = getPreloadRecommendations();
    console.group('💡 Recommendations');
    recommendations.forEach((rec) => console.log(rec));
    console.groupEnd();

    console.groupEnd();
  });
}

/**
 * Get current connection speed
 */
function getConnectionSpeed(): 'slow-2g' | '2g' | '3g' | '4g' {
  if (typeof navigator === 'undefined') return '4g';

  const connection = (navigator as any).connection;
  if (!connection) return '4g';

  return connection.effectiveType || '4g';
}

/**
 * Prefetch route on navigation
 */
export function prefetchRoute(routePath: string): void {
  const routeChunkMap: Record<string, string> = {
    '/showcase': '/route-showcase.js',
    '/playground': '/route-playground.js',
    '/docs': '/route-docs.js',
    '/coldwar': '/route-coldwar.js',
    '/charts': '/route-charts.js',
  };

  const chunkUrl = routeChunkMap[routePath];
  if (chunkUrl) {
    applyResourceHint({
      url: chunkUrl,
      type: 'prefetch',
      as: 'script',
    });
  }
}

/**
 * Preload critical fonts
 */
export function preloadFonts(): void {
  const fonts = [
    {
      url: '/fonts/primary.woff2',
      type: 'preload' as const,
      as: 'font',
      crossOrigin: true,
    },
    {
      url: '/fonts/secondary.woff2',
      type: 'prefetch' as const,
      as: 'font',
      crossOrigin: true,
    },
  ];

  applyResourceHints(fonts);
}

/**
 * DNS prefetch for analytics and tracking
 */
export function dnsPrefetchAnalytics(): void {
  const services = [
    { url: 'https://www.google-analytics.com', type: 'dns-prefetch' as const },
    { url: 'https://www.googletagmanager.com', type: 'dns-prefetch' as const },
  ];

  applyResourceHints(services);
}
