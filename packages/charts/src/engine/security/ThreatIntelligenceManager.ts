/**
 * Threat Intelligence Manager
 * Manages threat intelligence data and analysis
 */

/**
 * Intelligence source
 */
export type IntelligenceSource = 'internal' | 'external' | 'community' | 'vendor' | 'government';

/**
 * Intelligence confidence
 */
export type IntelligenceConfidence = 'high' | 'medium' | 'low';

/**
 * Threat indicator
 */
export interface ThreatIndicator {
  id: string;
  type: 'ip' | 'domain' | 'hash' | 'url' | 'email' | 'file' | 'certificate';
  value: string;
  confidence: IntelligenceConfidence;
  firstSeen: number;
  lastSeen: number;
  sources: string[];
  metadata: Record<string, unknown>;
}

/**
 * Threat intelligence record
 */
export interface ThreatIntelligenceRecord {
  id: string;
  timestamp: number;
  source: IntelligenceSource;
  threatName: string;
  threatDescription: string;
  indicators: ThreatIndicator[];
  severity: 'critical' | 'high' | 'medium' | 'low';
  ttl: number;
  expiresAt: number;
  relatedThreats: string[];
  metadata: Record<string, unknown>;
}

/**
 * Intelligence correlation
 */
export interface IntelligenceCorrelation {
  id: string;
  timestamp: number;
  records: string[];
  correlationType: 'same_actor' | 'same_campaign' | 'same_infrastructure' | 'related';
  confidence: number;
  description: string;
}

/**
 * Threat Intelligence Manager
 * Manages threat intelligence collection, analysis, and sharing
 */
export class ThreatIntelligenceManager {
  private records: Map<string, ThreatIntelligenceRecord> = new Map();
  private indicators: Map<string, ThreatIndicator> = new Map();
  private correlations: Map<string, IntelligenceCorrelation> = new Map();
  private recordHistory: ThreatIntelligenceRecord[] = [];
  private indicatorIndex: Map<string, string[]> = new Map(); // value -> ids

  /**
   * Add intelligence record
   */
  addIntelligenceRecord(
    record: Omit<ThreatIntelligenceRecord, 'id' | 'timestamp' | 'expiresAt'>
  ): ThreatIntelligenceRecord {
    const id = `intel-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const now = Date.now();
    const expiresAt = now + record.ttl;

    const intelligenceRecord: ThreatIntelligenceRecord = {
      ...record,
      id,
      timestamp: now,
      expiresAt,
    };

    this.records.set(id, intelligenceRecord);
    this.recordHistory.push(intelligenceRecord);

    // Index indicators
    for (const indicator of record.indicators) {
      this.indicators.set(indicator.id, indicator);
      const existing = this.indicatorIndex.get(indicator.value) || [];
      existing.push(indicator.id);
      this.indicatorIndex.set(indicator.value, existing);
    }

    return intelligenceRecord;
  }

  /**
   * Add threat indicator
   */
  addThreatIndicator(indicator: Omit<ThreatIndicator, 'id'>): ThreatIndicator {
    const id = `indicator-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const threatIndicator: ThreatIndicator = { ...indicator, id };

    this.indicators.set(id, threatIndicator);

    const existing = this.indicatorIndex.get(indicator.value) || [];
    existing.push(id);
    this.indicatorIndex.set(indicator.value, existing);

    return threatIndicator;
  }

  /**
   * Search indicators
   */
  searchIndicators(value: string): ThreatIndicator[] {
    const indicatorIds = this.indicatorIndex.get(value) || [];
    return indicatorIds
      .map((id) => this.indicators.get(id))
      .filter((i): i is ThreatIndicator => i !== undefined);
  }

  /**
   * Correlate intelligence records
   */
  correlateRecords(
    recordIds: string[],
    correlationType: IntelligenceCorrelation['correlationType']
  ): IntelligenceCorrelation | null {
    // Verify all records exist
    for (const id of recordIds) {
      if (!this.records.has(id)) return null;
    }

    const id = `correlation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const correlation: IntelligenceCorrelation = {
      id,
      timestamp: Date.now(),
      records: recordIds,
      correlationType,
      confidence: this.calculateCorrelationConfidence(recordIds),
      description: `Correlated ${recordIds.length} records as ${correlationType}`,
    };

    this.correlations.set(id, correlation);
    return correlation;
  }

  /**
   * Calculate correlation confidence
   */
  private calculateCorrelationConfidence(recordIds: string[]): number {
    let confidence = 0.5; // Base confidence

    // More records = higher confidence
    confidence += Math.min(recordIds.length * 0.1, 0.3);

    // Check indicator overlap
    const allIndicators: Set<string> = new Set();
    let totalIndicators = 0;

    for (const recordId of recordIds) {
      const record = this.records.get(recordId);
      if (record) {
        for (const indicator of record.indicators) {
          allIndicators.add(indicator.value);
          totalIndicators++;
        }
      }
    }

    const overlapRatio = allIndicators.size / Math.max(totalIndicators, 1);
    confidence += overlapRatio * 0.2;

    return Math.min(confidence, 1);
  }

  /**
   * Get intelligence record
   */
  getIntelligenceRecord(recordId: string): ThreatIntelligenceRecord | undefined {
    return this.records.get(recordId);
  }

  /**
   * Get active records
   */
  getActiveRecords(): ThreatIntelligenceRecord[] {
    const now = Date.now();
    return this.recordHistory.filter((r) => r.expiresAt > now);
  }

  /**
   * Get records by source
   */
  getRecordsBySource(source: IntelligenceSource): ThreatIntelligenceRecord[] {
    return this.recordHistory.filter((r) => r.source === source);
  }

  /**
   * Get records by severity
   */
  getRecordsBySeverity(severity: ThreatIntelligenceRecord['severity']): ThreatIntelligenceRecord[] {
    return this.recordHistory.filter((r) => r.severity === severity);
  }

  /**
   * Get records by threat name
   */
  getRecordsByThreatName(threatName: string): ThreatIntelligenceRecord[] {
    return this.recordHistory.filter((r) => r.threatName.includes(threatName));
  }

  /**
   * Get related threats
   */
  getRelatedThreats(recordId: string): ThreatIntelligenceRecord[] {
    const record = this.records.get(recordId);
    if (!record) return [];

    const related: ThreatIntelligenceRecord[] = [];
    for (const relatedId of record.relatedThreats) {
      const relatedRecord = this.records.get(relatedId);
      if (relatedRecord) related.push(relatedRecord);
    }

    return related;
  }

  /**
   * Get correlations for record
   */
  getCorrelationsForRecord(recordId: string): IntelligenceCorrelation[] {
    return Array.from(this.correlations.values()).filter((c) => c.records.includes(recordId));
  }

  /**
   * Clean expired records
   */
  cleanExpiredRecords(): number {
    const now = Date.now();
    let removed = 0;

    for (const [id, record] of this.records) {
      if (record.expiresAt < now) {
        this.records.delete(id);
        removed++;
      }
    }

    return removed;
  }

  /**
   * Get intelligence statistics
   */
  getStatistics(): Record<string, unknown> {
    const activeRecords = this.getActiveRecords();
    const totalRecords = this.recordHistory.length;
    const totalIndicators = this.indicators.size;

    const recordsBySource: Record<string, number> = {};
    for (const record of activeRecords) {
      recordsBySource[record.source] = (recordsBySource[record.source] || 0) + 1;
    }

    const recordsBySeverity: Record<string, number> = {};
    for (const record of activeRecords) {
      recordsBySeverity[record.severity] = (recordsBySeverity[record.severity] || 0) + 1;
    }

    const indicatorsByType: Record<string, number> = {};
    for (const indicator of this.indicators.values()) {
      indicatorsByType[indicator.type] = (indicatorsByType[indicator.type] || 0) + 1;
    }

    return {
      totalRecords,
      activeRecords: activeRecords.length,
      expiredRecords: totalRecords - activeRecords.length,
      totalIndicators,
      recordsBySource,
      recordsBySeverity,
      indicatorsByType,
      correlationCount: this.correlations.size,
    };
  }

  /**
   * Export intelligence report
   */
  exportIntelligenceReport(format: 'json' | 'csv' = 'json'): string {
    const activeRecords = this.getActiveRecords();

    if (format === 'json') {
      return JSON.stringify(activeRecords, null, 2);
    }

    // CSV format
    const headers = [
      'ID',
      'Timestamp',
      'Threat Name',
      'Source',
      'Severity',
      'Indicators',
      'Expires At',
    ];
    const rows = activeRecords.map((r) => [
      r.id,
      r.timestamp,
      r.threatName,
      r.source,
      r.severity,
      r.indicators.length,
      r.expiresAt,
    ]);

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    return csv;
  }

  /**
   * Get threat actor profile
   */
  getThreatActorProfile(actorName: string): Record<string, unknown> {
    const records = this.recordHistory.filter((r) => r.threatName.includes(actorName));

    const indicators: Set<string> = new Set();
    const campaigns: Set<string> = new Set();
    const infrastructure: Set<string> = new Set();

    for (const record of records) {
      for (const indicator of record.indicators) {
        indicators.add(indicator.value);
      }
      for (const related of record.relatedThreats) {
        campaigns.add(related);
      }
    }

    return {
      actorName,
      recordCount: records.length,
      indicatorCount: indicators.size,
      campaignCount: campaigns.size,
      firstSeen: records.length > 0 ? Math.min(...records.map((r) => r.timestamp)) : null,
      lastSeen: records.length > 0 ? Math.max(...records.map((r) => r.timestamp)) : null,
      severity: records.length > 0 ? records[0].severity : 'low',
    };
  }

  /**
   * Get indicator timeline
   */
  getIndicatorTimeline(indicatorValue: string): Array<{ timestamp: number; action: string }> {
    const indicatorIds = this.indicatorIndex.get(indicatorValue) || [];
    const timeline: Array<{ timestamp: number; action: string }> = [];

    for (const id of indicatorIds) {
      const indicator = this.indicators.get(id);
      if (indicator) {
        timeline.push({
          timestamp: indicator.firstSeen,
          action: 'First seen',
        });
        timeline.push({
          timestamp: indicator.lastSeen,
          action: 'Last seen',
        });
      }
    }

    return timeline.sort((a, b) => a.timestamp - b.timestamp);
  }
}
