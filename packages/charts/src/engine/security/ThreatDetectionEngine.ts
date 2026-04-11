/**
 * Threat Detection Engine
 * Real-time threat detection and analysis
 */

/**
 * Threat level
 */
export type ThreatLevel = 'critical' | 'high' | 'medium' | 'low' | 'info';

/**
 * Threat type
 */
export type ThreatType =
  | 'malware'
  | 'intrusion'
  | 'data_exfiltration'
  | 'privilege_escalation'
  | 'lateral_movement'
  | 'anomalous_behavior'
  | 'brute_force'
  | 'injection_attack'
  | 'ddos'
  | 'unknown';

/**
 * Threat detection pattern
 */
export interface ThreatPattern {
  id: string;
  name: string;
  type: ThreatType;
  enabled: boolean;
  rules: Array<{
    field: string;
    operator: 'equals' | 'contains' | 'regex' | 'greater_than' | 'less_than';
    value: unknown;
  }>;
  severity: ThreatLevel;
  confidence: number;
}

/**
 * Detected threat
 */
export interface DetectedThreat {
  id: string;
  timestamp: number;
  type: ThreatType;
  level: ThreatLevel;
  confidence: number;
  source: string;
  target: string;
  description: string;
  indicators: string[];
  patternIds: string[];
  metadata: Record<string, unknown>;
  status: 'open' | 'investigating' | 'contained' | 'resolved' | 'false_positive';
}

/**
 * Threat intelligence
 */
export interface ThreatIntelligence {
  id: string;
  timestamp: number;
  source: string;
  threatType: ThreatType;
  indicators: string[];
  severity: ThreatLevel;
  description: string;
  ttl: number;
}

/**
 * Threat Detection Engine
 * Detects and analyzes security threats in real-time
 */
export class ThreatDetectionEngine {
  private patterns: Map<string, ThreatPattern> = new Map();
  private threats: Map<string, DetectedThreat> = new Map();
  private threatHistory: DetectedThreat[] = [];
  private intelligence: Map<string, ThreatIntelligence> = new Map();
  private alerts: Array<{ timestamp: number; threat: DetectedThreat; message: string }> = [];
  private correlationWindow: number = 60000; // 1 minute

  /**
   * Create threat pattern
   */
  createPattern(pattern: Omit<ThreatPattern, 'id'>): ThreatPattern {
    const id = `pattern-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const threatPattern: ThreatPattern = { ...pattern, id };
    this.patterns.set(id, threatPattern);
    return threatPattern;
  }

  /**
   * Detect threat from event
   */
  detectThreat(event: {
    source: string;
    target: string;
    data: Record<string, unknown>;
    timestamp?: number;
  }): DetectedThreat | null {
    const timestamp = event.timestamp || Date.now();
    let highestConfidence = 0;
    let matchedPattern: ThreatPattern | null = null;
    const matchedPatterns: string[] = [];

    // Check all patterns
    for (const pattern of this.patterns.values()) {
      if (!pattern.enabled) continue;

      if (this.matchesPattern(event.data, pattern)) {
        matchedPatterns.push(pattern.id);
        if (pattern.confidence > highestConfidence) {
          highestConfidence = pattern.confidence;
          matchedPattern = pattern;
        }
      }
    }

    if (!matchedPattern) return null;

    // Create threat
    const id = `threat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const threat: DetectedThreat = {
      id,
      timestamp,
      type: matchedPattern.type,
      level: matchedPattern.severity,
      confidence: highestConfidence,
      source: event.source,
      target: event.target,
      description: `Detected ${matchedPattern.type} threat`,
      indicators: this.extractIndicators(event.data),
      patternIds: matchedPatterns,
      metadata: event.data,
      status: 'open',
    };

    this.threats.set(id, threat);
    this.threatHistory.push(threat);
    this.generateAlert(threat);

    return threat;
  }

  /**
   * Match event against pattern
   */
  private matchesPattern(data: Record<string, unknown>, pattern: ThreatPattern): boolean {
    for (const rule of pattern.rules) {
      const value = data[rule.field];

      switch (rule.operator) {
        case 'equals':
          if (value !== rule.value) return false;
          break;
        case 'contains':
          if (!String(value).includes(String(rule.value))) return false;
          break;
        case 'regex':
          if (!new RegExp(String(rule.value)).test(String(value))) return false;
          break;
        case 'greater_than':
          if (Number(value) <= Number(rule.value)) return false;
          break;
        case 'less_than':
          if (Number(value) >= Number(rule.value)) return false;
          break;
      }
    }

    return true;
  }

  /**
   * Extract indicators from event data
   */
  private extractIndicators(data: Record<string, unknown>): string[] {
    const indicators: string[] = [];

    for (const [key, value] of Object.entries(data)) {
      if (
        key.includes('ip') ||
        key.includes('host') ||
        key.includes('domain') ||
        key.includes('hash')
      ) {
        indicators.push(String(value));
      }
    }

    return indicators;
  }

  /**
   * Generate alert for threat
   */
  private generateAlert(threat: DetectedThreat): void {
    const message = `${threat.level.toUpperCase()} threat detected: ${threat.type} (${(threat.confidence * 100).toFixed(0)}% confidence)`;
    this.alerts.push({
      timestamp: Date.now(),
      threat,
      message,
    });
  }

  /**
   * Add threat intelligence
   */
  addIntelligence(intel: Omit<ThreatIntelligence, 'id'>): ThreatIntelligence {
    const id = `intel-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const intelligence: ThreatIntelligence = { ...intel, id };
    this.intelligence.set(id, intelligence);
    return intelligence;
  }

  /**
   * Correlate threats
   */
  correlateThreats(): Array<{ threats: DetectedThreat[]; correlation: number }> {
    const correlations: Array<{ threats: DetectedThreat[]; correlation: number }> = [];
    const recentThreats = this.threatHistory.filter(
      (t) => Date.now() - t.timestamp < this.correlationWindow
    );

    for (let i = 0; i < recentThreats.length; i++) {
      for (let j = i + 1; j < recentThreats.length; j++) {
        const threat1 = recentThreats[i];
        const threat2 = recentThreats[j];

        const correlation = this.calculateCorrelation(threat1, threat2);
        if (correlation > 0.5) {
          correlations.push({
            threats: [threat1, threat2],
            correlation,
          });
        }
      }
    }

    return correlations;
  }

  /**
   * Calculate correlation between threats
   */
  private calculateCorrelation(threat1: DetectedThreat, threat2: DetectedThreat): number {
    let score = 0;

    // Same type
    if (threat1.type === threat2.type) score += 0.3;

    // Same source or target
    if (threat1.source === threat2.source || threat1.target === threat2.target) score += 0.3;

    // Similar indicators
    const commonIndicators = threat1.indicators.filter((i) => threat2.indicators.includes(i));
    if (commonIndicators.length > 0) {
      score += 0.2 * (commonIndicators.length / Math.max(threat1.indicators.length, 1));
    }

    // Similar confidence
    const confidenceDiff = Math.abs(threat1.confidence - threat2.confidence);
    if (confidenceDiff < 0.2) score += 0.2;

    return Math.min(score, 1);
  }

  /**
   * Get threat
   */
  getThreat(threatId: string): DetectedThreat | undefined {
    return this.threats.get(threatId);
  }

  /**
   * Get open threats
   */
  getOpenThreats(): DetectedThreat[] {
    return this.threatHistory.filter((t) => t.status === 'open');
  }

  /**
   * Get critical threats
   */
  getCriticalThreats(): DetectedThreat[] {
    return this.threatHistory.filter((t) => t.level === 'critical');
  }

  /**
   * Get threats by type
   */
  getThreatsByType(type: ThreatType): DetectedThreat[] {
    return this.threatHistory.filter((t) => t.type === type);
  }

  /**
   * Get threats by source
   */
  getThreatsBySource(source: string): DetectedThreat[] {
    return this.threatHistory.filter((t) => t.source === source);
  }

  /**
   * Get threats in time range
   */
  getThreatsInTimeRange(startTime: number, endTime: number): DetectedThreat[] {
    return this.threatHistory.filter((t) => t.timestamp >= startTime && t.timestamp <= endTime);
  }

  /**
   * Update threat status
   */
  updateThreatStatus(threatId: string, status: DetectedThreat['status']): boolean {
    const threat = this.threats.get(threatId);
    if (!threat) return false;

    threat.status = status;
    return true;
  }

  /**
   * Get threat statistics
   */
  getStatistics(): Record<string, unknown> {
    const totalThreats = this.threatHistory.length;
    const openThreats = this.getOpenThreats().length;
    const criticalThreats = this.getCriticalThreats().length;

    const threatsByType: Record<string, number> = {};
    for (const threat of this.threatHistory) {
      threatsByType[threat.type] = (threatsByType[threat.type] || 0) + 1;
    }

    const threatsByLevel: Record<string, number> = {};
    for (const threat of this.threatHistory) {
      threatsByLevel[threat.level] = (threatsByLevel[threat.level] || 0) + 1;
    }

    return {
      totalThreats,
      openThreats,
      criticalThreats,
      averageConfidence:
        totalThreats > 0
          ? this.threatHistory.reduce((sum, t) => sum + t.confidence, 0) / totalThreats
          : 0,
      threatsByType,
      threatsByLevel,
      alertCount: this.alerts.length,
    };
  }

  /**
   * Get alerts
   */
  getAlerts(limit?: number): Array<{ timestamp: number; threat: DetectedThreat; message: string }> {
    if (limit) {
      return this.alerts.slice(-limit);
    }
    return [...this.alerts];
  }

  /**
   * Update pattern
   */
  updatePattern(id: string, updates: Partial<ThreatPattern>): boolean {
    const pattern = this.patterns.get(id);
    if (!pattern) return false;

    Object.assign(pattern, updates);
    return true;
  }

  /**
   * Delete pattern
   */
  deletePattern(id: string): boolean {
    return this.patterns.delete(id);
  }

  /**
   * Get all patterns
   */
  getPatterns(): ThreatPattern[] {
    return Array.from(this.patterns.values());
  }

  /**
   * Export threat report
   */
  exportThreatReport(format: 'json' | 'csv' = 'json'): string {
    if (format === 'json') {
      return JSON.stringify(this.threatHistory, null, 2);
    }

    // CSV format
    const headers = [
      'ID',
      'Timestamp',
      'Type',
      'Level',
      'Confidence',
      'Source',
      'Target',
      'Status',
    ];
    const rows = this.threatHistory.map((t) => [
      t.id,
      t.timestamp,
      t.type,
      t.level,
      t.confidence,
      t.source,
      t.target,
      t.status,
    ]);

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    return csv;
  }
}
