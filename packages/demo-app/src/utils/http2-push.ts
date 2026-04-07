/**
 * HTTP/2 Server Push Utilities
 * Manages critical resource preloading via HTTP/2 push
 */

export interface PushResource {
  path: string;
  type: 'script' | 'style' | 'font' | 'image';
  priority: 'critical' | 'high' | 'medium' | 'low';
}

/**
 * Critical resources to push on initial page load
 */
export const CRITICAL_RESOURCES: PushResource[] = [
  // Vendor chunks - essential for app functionality
  {
    path: '/vendor-react.js',
    type: 'script',
    priority: 'critical',
  },
  {
    path: '/vendor-rhuds.js',
    type: 'script',
    priority: 'critical',
  },
  // Main app bundle
  {
    path: '/main.js',
    type: 'script',
    priority: 'critical',
  },
  // Critical CSS
  {
    path: '/styles/global.css',
    type: 'style',
    priority: 'critical',
  },
  {
    path: '/styles/cold-war-theme.css',
    type: 'style',
    priority: 'high',
  },
];

/**
 * High-priority resources to push on route navigation
 */
export const HIGH_PRIORITY_RESOURCES: PushResource[] = [
  {
    path: '/vendor-utils.js',
    type: 'script',
    priority: 'high',
  },
  {
    path: '/route-showcase.js',
    type: 'script',
    priority: 'high',
  },
  {
    path: '/route-playground.js',
    type: 'script',
    priority: 'high',
  },
];

/**
 * Medium-priority resources for secondary routes
 */
export const MEDIUM_PRIORITY_RESOURCES: PushResource[] = [
  {
    path: '/route-docs.js',
    type: 'script',
    priority: 'medium',
  },
  {
    path: '/route-coldwar.js',
    type: 'script',
    priority: 'medium',
  },
  {
    path: '/route-charts.js',
    type: 'script',
    priority: 'medium',
  },
];

/**
 * Get Link header value for HTTP/2 push
 */
export function generateLinkHeader(resources: PushResource[]): string {
  return resources
    .map((resource) => {
      const rel = resource.priority === 'critical' ? 'preload' : 'prefetch';
      const as = getAsAttribute(resource.type);
      return `<${resource.path}>; rel=${rel}; as=${as}`;
    })
    .join(', ');
}

/**
 * Get 'as' attribute for Link header
 */
function getAsAttribute(type: PushResource['type']): string {
  switch (type) {
    case 'script':
      return 'script';
    case 'style':
      return 'style';
    case 'font':
      return 'font';
    case 'image':
      return 'image';
    default:
      return 'fetch';
  }
}

/**
 * Get MIME type for resource
 */
export function getMimeType(type: PushResource['type']): string {
  switch (type) {
    case 'script':
      return 'application/javascript';
    case 'style':
      return 'text/css';
    case 'font':
      return 'font/woff2';
    case 'image':
      return 'image/webp';
    default:
      return 'application/octet-stream';
  }
}

/**
 * Calculate total size of resources to push
 */
export function calculatePushSize(resources: PushResource[]): number {
  // Estimated sizes in bytes
  const sizes: Record<string, number> = {
    '/vendor-react.js': 80000,
    '/vendor-rhuds.js': 60000,
    '/vendor-utils.js': 40000,
    '/main.js': 50000,
    '/route-showcase.js': 35000,
    '/route-playground.js': 40000,
    '/route-docs.js': 25000,
    '/route-coldwar.js': 45000,
    '/route-charts.js': 30000,
    '/styles/global.css': 15000,
    '/styles/cold-war-theme.css': 20000,
  };

  return resources.reduce((total, resource) => {
    return total + (sizes[resource.path] || 0);
  }, 0);
}

/**
 * Get optimal push strategy based on connection speed
 */
export function getOptimalPushStrategy(
  connection?: 'slow-2g' | '2g' | '3g' | '4g'
): PushResource[] {
  switch (connection) {
    case 'slow-2g':
    case '2g':
      // Only push critical resources on slow connections
      return CRITICAL_RESOURCES;
    case '3g':
      // Push critical and high-priority on 3G
      return [...CRITICAL_RESOURCES, ...HIGH_PRIORITY_RESOURCES];
    case '4g':
    default:
      // Push all resources on fast connections
      return [...CRITICAL_RESOURCES, ...HIGH_PRIORITY_RESOURCES, ...MEDIUM_PRIORITY_RESOURCES];
  }
}

/**
 * Monitor HTTP/2 push effectiveness
 */
export interface PushMetrics {
  resourcesPushed: number;
  totalSizePushed: number;
  averageLoadTime: number;
  cacheHitRate: number;
  pushEffectiveness: number; // 0-100
}

const pushMetrics: Map<string, PushMetrics> = new Map();

export function recordPushMetric(resource: string, metric: PushMetrics): void {
  pushMetrics.set(resource, metric);
}

export function getPushMetrics(): PushMetrics[] {
  return Array.from(pushMetrics.values());
}

export function calculatePushEffectiveness(): number {
  const metrics = getPushMetrics();
  if (metrics.length === 0) return 0;

  const avgEffectiveness =
    metrics.reduce((sum, m) => sum + m.pushEffectiveness, 0) / metrics.length;
  return Math.round(avgEffectiveness);
}

/**
 * Get push recommendations
 */
export function getPushRecommendations(): string[] {
  const recommendations: string[] = [];
  const metrics = getPushMetrics();

  if (metrics.length === 0) {
    return ['No push metrics available yet'];
  }

  const avgEffectiveness = calculatePushEffectiveness();

  if (avgEffectiveness < 50) {
    recommendations.push('⚠️ Push effectiveness is low - consider reducing pushed resources');
  } else if (avgEffectiveness > 80) {
    recommendations.push('✅ Push strategy is highly effective');
  }

  const avgLoadTime = metrics.reduce((sum, m) => sum + m.averageLoadTime, 0) / metrics.length;
  if (avgLoadTime > 1000) {
    recommendations.push('⚠️ Average load time is high - consider optimizing pushed resources');
  }

  const avgCacheHit = metrics.reduce((sum, m) => sum + m.cacheHitRate, 0) / metrics.length;
  if (avgCacheHit > 70) {
    recommendations.push('💡 High cache hit rate - consider reducing push frequency');
  }

  return recommendations;
}

/**
 * Initialize HTTP/2 push monitoring
 */
export function initHttp2PushMonitoring(): void {
  if (typeof window === 'undefined') return;

  window.addEventListener('load', () => {
    const resources = getOptimalPushStrategy(getConnectionSpeed());
    const totalSize = calculatePushSize(resources);

    console.group('📡 HTTP/2 Push Metrics');
    console.log(`Resources Pushed: ${resources.length}`);
    console.log(`Total Size: ${(totalSize / 1024).toFixed(2)} KB`);
    console.log(`Push Effectiveness: ${calculatePushEffectiveness()}%`);

    const recommendations = getPushRecommendations();
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
