/**
 * Resource Hints Optimization
 * Advanced optimization of preconnect, dns-prefetch, and prerender
 */

export interface OptimizedResourceHint {
  url: string;
  type: 'preconnect' | 'dns-prefetch' | 'prerender';
  priority: 'critical' | 'high' | 'medium';
  crossOrigin?: boolean;
}

/**
 * Critical preconnect resources
 */
export const CRITICAL_PRECONNECT: OptimizedResourceHint[] = [
  {
    url: 'https://fonts.googleapis.com',
    type: 'preconnect',
    priority: 'critical',
    crossOrigin: true,
  },
  {
    url: 'https://fonts.gstatic.com',
    type: 'preconnect',
    priority: 'critical',
    crossOrigin: true,
  },
];

/**
 * High-priority preconnect resources
 */
export const HIGH_PRIORITY_PRECONNECT: OptimizedResourceHint[] = [
  {
    url: 'https://cdn.example.com',
    type: 'preconnect',
    priority: 'high',
    crossOrigin: true,
  },
];

/**
 * DNS prefetch for external services
 */
export const DNS_PREFETCH_SERVICES: OptimizedResourceHint[] = [
  {
    url: 'https://www.google-analytics.com',
    type: 'dns-prefetch',
    priority: 'high',
  },
  {
    url: 'https://www.googletagmanager.com',
    type: 'dns-prefetch',
    priority: 'high',
  },
  {
    url: 'https://api.example.com',
    type: 'dns-prefetch',
    priority: 'medium',
  },
];

/**
 * Critical pages to prerender
 */
export const PRERENDER_PAGES: OptimizedResourceHint[] = [
  {
    url: '/index.html',
    type: 'prerender',
    priority: 'critical',
  },
  {
    url: '/showcase',
    type: 'prerender',
    priority: 'high',
  },
];

/**
 * Apply optimized resource hint
 */
export function applyOptimizedResourceHint(hint: OptimizedResourceHint): void {
  if (typeof document === 'undefined') return;

  const link = document.createElement('link');
  link.rel = hint.type;
  link.href = hint.url;

  if (hint.crossOrigin) {
    link.crossOrigin = 'anonymous';
  }

  document.head.appendChild(link);
}

/**
 * Apply multiple optimized resource hints
 */
export function applyOptimizedResourceHints(hints: OptimizedResourceHint[]): void {
  hints.forEach((hint) => applyOptimizedResourceHint(hint));
}

/**
 * Get optimal resource hints based on connection
 */
export function getOptimalResourceHints(
  connection?: 'slow-2g' | '2g' | '3g' | '4g'
): OptimizedResourceHint[] {
  const baseHints = [...CRITICAL_PRECONNECT];

  switch (connection) {
    case 'slow-2g':
    case '2g':
      // Only critical preconnect on slow connections
      return baseHints;
    case '3g':
      // Add high-priority preconnect and DNS prefetch
      return [
        ...baseHints,
        ...HIGH_PRIORITY_PRECONNECT,
        ...DNS_PREFETCH_SERVICES.filter((s) => s.priority === 'high'),
      ];
    case '4g':
    default:
      // All hints on fast connections
      return [
        ...baseHints,
        ...HIGH_PRIORITY_PRECONNECT,
        ...DNS_PREFETCH_SERVICES,
        ...PRERENDER_PAGES,
      ];
  }
}

/**
 * Optimize preconnect headers
 */
export function optimizePreconnectHeaders(): void {
  const hints = getOptimalResourceHints(getConnectionSpeed());
  const preconnectHints = hints.filter((h) => h.type === 'preconnect');

  applyOptimizedResourceHints(preconnectHints);
}

/**
 * Optimize DNS prefetch headers
 */
export function optimizeDnsPrefetchHeaders(): void {
  const hints = getOptimalResourceHints(getConnectionSpeed());
  const dnsPrefetchHints = hints.filter((h) => h.type === 'dns-prefetch');

  applyOptimizedResourceHints(dnsPrefetchHints);
}

/**
 * Implement prerender for critical pages
 */
export function implementPrerender(): void {
  const hints = getOptimalResourceHints(getConnectionSpeed());
  const prerenderHints = hints.filter((h) => h.type === 'prerender');

  applyOptimizedResourceHints(prerenderHints);
}

/**
 * Monitor resource hint effectiveness
 */
export interface ResourceHintMetrics {
  hintsApplied: number;
  totalConnectionTime: number;
  averageLoadTime: number;
  dnsResolutionTime: number;
  hintEffectiveness: number; // 0-100
}

const hintMetrics: Map<string, ResourceHintMetrics> = new Map();

export function recordResourceHintMetric(resource: string, metric: ResourceHintMetrics): void {
  hintMetrics.set(resource, metric);
}

export function getResourceHintMetrics(): ResourceHintMetrics[] {
  return Array.from(hintMetrics.values());
}

export function calculateResourceHintEffectiveness(): number {
  const metrics = getResourceHintMetrics();
  if (metrics.length === 0) return 0;

  const avgEffectiveness =
    metrics.reduce((sum, m) => sum + m.hintEffectiveness, 0) / metrics.length;
  return Math.round(avgEffectiveness);
}

/**
 * Get resource hint recommendations
 */
export function getResourceHintRecommendations(): string[] {
  const recommendations: string[] = [];
  const metrics = getResourceHintMetrics();

  if (metrics.length === 0) {
    return ['No resource hint metrics available yet'];
  }

  const avgEffectiveness = calculateResourceHintEffectiveness();

  if (avgEffectiveness < 70) {
    recommendations.push('⚠️ Resource hint effectiveness is low - consider adjusting strategy');
  } else if (avgEffectiveness > 90) {
    recommendations.push('✅ Resource hint strategy is highly effective');
  }

  const avgDnsTime = metrics.reduce((sum, m) => sum + m.dnsResolutionTime, 0) / metrics.length;
  if (avgDnsTime > 100) {
    recommendations.push('⚠️ DNS resolution time is high - consider DNS prefetch optimization');
  }

  const avgConnectionTime =
    metrics.reduce((sum, m) => sum + m.totalConnectionTime, 0) / metrics.length;
  if (avgConnectionTime > 200) {
    recommendations.push('⚠️ Connection time is high - consider preconnect optimization');
  }

  return recommendations;
}

/**
 * Initialize resource hint monitoring
 */
export function initResourceHintMonitoring(): void {
  if (typeof window === 'undefined') return;

  window.addEventListener('load', () => {
    const hints = getOptimalResourceHints(getConnectionSpeed());

    console.group('🔗 Resource Hints Optimization');
    console.log(`Hints Applied: ${hints.length}`);
    console.log(`Preconnect: ${hints.filter((h) => h.type === 'preconnect').length}`);
    console.log(`DNS Prefetch: ${hints.filter((h) => h.type === 'dns-prefetch').length}`);
    console.log(`Prerender: ${hints.filter((h) => h.type === 'prerender').length}`);
    console.log(`Effectiveness: ${calculateResourceHintEffectiveness()}%`);

    const recommendations = getResourceHintRecommendations();
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
 * Measure DNS resolution time
 */
export function measureDnsResolutionTime(domain: string): Promise<number> {
  return new Promise((resolve) => {
    const startTime = performance.now();

    // Use fetch to measure DNS resolution
    fetch(`https://${domain}`, { method: 'HEAD', mode: 'no-cors' })
      .then(() => {
        const endTime = performance.now();
        resolve(endTime - startTime);
      })
      .catch(() => {
        resolve(0);
      });
  });
}

/**
 * Measure connection time
 */
export function measureConnectionTime(url: string): Promise<number> {
  return new Promise((resolve) => {
    const startTime = performance.now();

    fetch(url, { method: 'HEAD', mode: 'no-cors' })
      .then(() => {
        const endTime = performance.now();
        resolve(endTime - startTime);
      })
      .catch(() => {
        resolve(0);
      });
  });
}

/**
 * Optimize all resource hints
 */
export function optimizeAllResourceHints(): void {
  optimizePreconnectHeaders();
  optimizeDnsPrefetchHeaders();
  implementPrerender();
}
