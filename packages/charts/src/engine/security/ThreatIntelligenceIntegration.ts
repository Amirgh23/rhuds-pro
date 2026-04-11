/**
 * Threat Intelligence Integration
 * Integrates external threat intelligence sources
 */

/**
 * Threat intelligence source
 */
export interface ThreatIntelligenceSource {
  id: string;
  name: string;
  type: 'feed' | 'api' | 'manual';
  url?: string;
  apiKey?: string;
  enabled: boolean;
  lastSync?: number;
  syncInterval: number;
}

/**
 * Threat indicator
 */
export interface ThreatIndicator {
  id: string;
  timestamp: number;
  type: 'ip' | 'domain' | 'hash' | 'url' | 'email';
  value: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  source: string;
  confidence: number;
  lastSeen: number;
  firstSeen: number;
  tags: string[];
}

/**
 * Threat Intelligence Integration
 * Integrates external threat intelligence sources
 */
export class ThreatIntelligenceIntegration {
  private sources: Map<string, ThreatIntelligenceSource> = new Map();
  private indicators: Map<string, ThreatIndicator> = new Map();
  private indicatorHistory: ThreatIndicator[] = [];
  private syncSchedules: Map<string, NodeJS.Timeout> = new Map();
  private sourceHandlers: Map<string, () => Promise<ThreatIndicator[]>> = new Map();

  /**
   * Register threat intelligence source
   */
  registerSource(source: Omit<ThreatIntelligenceSource, 'id'>): ThreatIntelligenceSource {
    const id = `source-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const tiSource: ThreatIntelligenceSource = { ...source, id };
    this.sources.set(id, tiSource);
    return tiSource;
  }

  /**
   * Register source handler
   */
  registerSourceHandler(sourceId: string, handler: () => Promise<ThreatIndicator[]>): void {
    this.sourceHandlers.set(sourceId, handler);
  }

  /**
   * Sync threat intelligence
   */
  async syncThreatIntelligence(sourceId: string): Promise<ThreatIndicator[]> {
    const source = this.sources.get(sourceId);
    if (!source || !source.enabled) return [];

    const handler = this.sourceHandlers.get(sourceId);
    if (!handler) return [];

    try {
      const indicators = await handler();

      for (const indicator of indicators) {
        const id = `indicator-${indicator.type}-${indicator.value}`;
        this.indicators.set(id, indicator);
        this.indicatorHistory.push(indicator);
      }

      source.lastSync = Date.now();
      return indicators;
    } catch {
      return [];
    }
  }

  /**
   * Schedule automatic sync
   */
  scheduleSync(sourceId: string): void {
    const source = this.sources.get(sourceId);
    if (!source || !source.enabled) return;

    // Clear existing schedule
    const existingSchedule = this.syncSchedules.get(sourceId);
    if (existingSchedule) {
      clearInterval(existingSchedule);
    }

    // Schedule new sync
    const schedule = setInterval(() => {
      this.syncThreatIntelligence(sourceId);
    }, source.syncInterval);

    this.syncSchedules.set(sourceId, schedule);
  }

  /**
   * Check if indicator is known threat
   */
  isKnownThreat(type: string, value: string): ThreatIndicator | undefined {
    const id = `indicator-${type}-${value}`;
    return this.indicators.get(id);
  }

  /**
   * Get indicators by type
   */
  getIndicatorsByType(type: string): ThreatIndicator[] {
    return this.indicatorHistory
      .filter((i) => i.type === type)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 100);
  }

  /**
   * Get indicators by severity
   */
  getIndicatorsBySeverity(severity: string): ThreatIndicator[] {
    return this.indicatorHistory
      .filter((i) => i.severity === severity)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 100);
  }

  /**
   * Get indicators by source
   */
  getIndicatorsBySource(sourceId: string): ThreatIndicator[] {
    return this.indicatorHistory
      .filter((i) => i.source === sourceId)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 100);
  }

  /**
   * Get high confidence indicators
   */
  getHighConfidenceIndicators(minConfidence = 0.8): ThreatIndicator[] {
    return this.indicatorHistory
      .filter((i) => i.confidence >= minConfidence)
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 100);
  }

  /**
   * Get threat intelligence statistics
   */
  getStatistics(): Record<string, unknown> {
    const totalIndicators = this.indicatorHistory.length;
    const uniqueIndicators = this.indicators.size;

    const typeDistribution: Record<string, number> = {};
    for (const indicator of this.indicatorHistory) {
      typeDistribution[indicator.type] = (typeDistribution[indicator.type] || 0) + 1;
    }

    const severityDistribution: Record<string, number> = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
    };

    for (const indicator of this.indicatorHistory) {
      severityDistribution[indicator.severity]++;
    }

    const sourceStats: Record<string, Record<string, unknown>> = {};
    for (const source of this.sources.values()) {
      const sourceIndicators = this.indicatorHistory.filter((i) => i.source === source.id);
      sourceStats[source.id] = {
        sourceName: source.name,
        indicatorCount: sourceIndicators.length,
        lastSync: source.lastSync,
        enabled: source.enabled,
      };
    }

    const avgConfidence =
      totalIndicators > 0
        ? this.indicatorHistory.reduce((sum, i) => sum + i.confidence, 0) / totalIndicators
        : 0;

    return {
      totalIndicators,
      uniqueIndicators,
      typeDistribution,
      severityDistribution,
      avgConfidence: avgConfidence.toFixed(2),
      sourceCount: this.sources.size,
      sourceStats,
    };
  }

  /**
   * Get source
   */
  getSource(sourceId: string): ThreatIntelligenceSource | undefined {
    return this.sources.get(sourceId);
  }

  /**
   * Get all sources
   */
  getAllSources(): ThreatIntelligenceSource[] {
    return Array.from(this.sources.values());
  }

  /**
   * Get indicator
   */
  getIndicator(indicatorId: string): ThreatIndicator | undefined {
    return this.indicators.get(indicatorId);
  }

  /**
   * Update source
   */
  updateSource(id: string, updates: Partial<ThreatIntelligenceSource>): boolean {
    const source = this.sources.get(id);
    if (!source) return false;

    Object.assign(source, updates);
    return true;
  }

  /**
   * Delete source
   */
  deleteSource(id: string): boolean {
    const schedule = this.syncSchedules.get(id);
    if (schedule) {
      clearInterval(schedule);
      this.syncSchedules.delete(id);
    }
    this.sourceHandlers.delete(id);
    return this.sources.delete(id);
  }

  /**
   * Export threat intelligence report
   */
  exportThreatIntelligenceReport(format: 'json' | 'csv' = 'json'): string {
    if (format === 'json') {
      return JSON.stringify(
        {
          statistics: this.getStatistics(),
          indicators: this.indicatorHistory.slice(-100),
          sources: Array.from(this.sources.values()),
        },
        null,
        2
      );
    }

    // CSV format
    const headers = ['Type', 'Value', 'Severity', 'Confidence', 'Source', 'Timestamp'];
    const rows = this.indicatorHistory
      .slice(-100)
      .map((i) => [i.type, i.value, i.severity, i.confidence, i.source, i.timestamp]);

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    return csv;
  }
}
