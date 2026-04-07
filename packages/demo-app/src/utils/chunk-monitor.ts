/**
 * Chunk Size Monitoring
 * Monitors and reports chunk sizes to help identify optimization opportunities
 */

export interface ChunkSizeReport {
  timestamp: number;
  chunks: Array<{
    name: string;
    size: number;
    gzipSize: number;
    status: 'ok' | 'warning' | 'critical';
  }>;
  totalSize: number;
  totalGzipSize: number;
}

const CHUNK_SIZE_LIMITS = {
  main: 100, // KB
  vendor: 200, // KB
  route: 50, // KB
  component: 30, // KB
};

/**
 * Get chunk size status
 */
function getChunkStatus(chunkName: string, sizeKB: number): 'ok' | 'warning' | 'critical' {
  let limit = CHUNK_SIZE_LIMITS.component;

  if (chunkName === 'main') {
    limit = CHUNK_SIZE_LIMITS.main;
  } else if (chunkName.includes('vendor')) {
    limit = CHUNK_SIZE_LIMITS.vendor;
  } else if (chunkName.startsWith('route-')) {
    limit = CHUNK_SIZE_LIMITS.route;
  }

  if (sizeKB > limit * 1.2) {
    return 'critical';
  } else if (sizeKB > limit) {
    return 'warning';
  }
  return 'ok';
}

/**
 * Monitor chunk sizes from performance API
 */
export async function monitorChunkSizes(): Promise<ChunkSizeReport> {
  const chunks: ChunkSizeReport['chunks'] = [];
  let totalSize = 0;
  let totalGzipSize = 0;

  // Get all script resources
  const resources = performance.getEntriesByType('resource').filter((r) => r.name.includes('.js'));

  for (const resource of resources) {
    const name =
      resource.name
        .split('/')
        .pop()
        ?.replace(/\.[^.]+$/, '') || 'unknown';
    const size = (resource as PerformanceResourceTiming).transferSize || 0;
    const sizeKB = size / 1024;

    chunks.push({
      name,
      size,
      gzipSize: size, // Approximate, actual gzip size would come from server headers
      status: getChunkStatus(name, sizeKB),
    });

    totalSize += size;
    totalGzipSize += size;
  }

  return {
    timestamp: Date.now(),
    chunks: chunks.sort((a, b) => b.size - a.size),
    totalSize,
    totalGzipSize,
  };
}

/**
 * Log chunk size report
 */
export function logChunkSizeReport(report: ChunkSizeReport): void {
  console.group('📦 Chunk Size Report');
  console.table(
    report.chunks.map((c) => ({
      Chunk: c.name,
      'Size (KB)': (c.size / 1024).toFixed(2),
      'Gzip (KB)': (c.gzipSize / 1024).toFixed(2),
      Status: c.status.toUpperCase(),
    }))
  );
  console.log(`Total: ${(report.totalSize / 1024).toFixed(2)} KB`);
  console.log(`Total Gzip: ${(report.totalGzipSize / 1024).toFixed(2)} KB`);
  console.groupEnd();
}

/**
 * Get chunks that exceed size limits
 */
export function getOversizedChunks(report: ChunkSizeReport): ChunkSizeReport['chunks'] {
  return report.chunks.filter((c) => c.status !== 'ok');
}

/**
 * Generate optimization recommendations
 */
export function generateOptimizationRecommendations(report: ChunkSizeReport): string[] {
  const recommendations: string[] = [];
  const oversized = getOversizedChunks(report);

  if (oversized.length === 0) {
    return ['✅ All chunks are within size limits'];
  }

  for (const chunk of oversized) {
    const sizeKB = chunk.size / 1024;

    if (chunk.status === 'critical') {
      recommendations.push(
        `🔴 ${chunk.name}: ${sizeKB.toFixed(2)} KB - Consider further code splitting`
      );
    } else {
      recommendations.push(`🟡 ${chunk.name}: ${sizeKB.toFixed(2)} KB - Monitor for growth`);
    }
  }

  return recommendations;
}

/**
 * Initialize chunk monitoring
 */
export function initChunkMonitoring(): void {
  if (typeof window === 'undefined') return;

  // Monitor on page load
  window.addEventListener('load', async () => {
    const report = await monitorChunkSizes();
    logChunkSizeReport(report);

    const recommendations = generateOptimizationRecommendations(report);
    console.group('💡 Optimization Recommendations');
    recommendations.forEach((rec) => console.log(rec));
    console.groupEnd();
  });
}
