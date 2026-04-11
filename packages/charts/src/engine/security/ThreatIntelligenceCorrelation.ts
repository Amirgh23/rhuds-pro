/**
 * Threat Intelligence Correlation
 * Correlate threat intelligence with hunting results
 */

/**
 * Intelligence correlation
 */
export interface IntelligenceCorrelation {
  id: string;
  timestamp: number;
  huntingResultId: string;
  threatIntelligenceId: string;
  correlationType: 'direct' | 'indirect' | 'related' | 'potential';
  confidence: number;
  severity: 'critical' | 'high' | 'medium' | 'low';
  correlationData: Record<string, unknown>;
  actionRecommendation: string;
}

/**
 * Threat profile
 */
export interface ThreatProfile {
  id: string;
  name: string;
  description: string;
  indicators: Array<{
    type: string;
    value: string;
    severity: string;
  }>;
  tactics: string[];
  techniques: string[];
  createdAt: number;
}

/**
 * Threat Intelligence Correlation
 * Correlate threat intelligence with hunting results
 */
export class ThreatIntelligenceCorrelation {
  private correlations: Map<string, IntelligenceCorrelation> = new Map();
  private correlationHistory: IntelligenceCorrelation[] = [];
  private threatProfiles: Map<string, ThreatProfile> = new Map();
  private correlationRules: Array<{
    name: string;
    evaluate: (
      huntingResult: Record<string, unknown>,
      threatProfile: ThreatProfile
    ) => IntelligenceCorrelation | null;
  }> = [];

  /**
   * Register correlation rule
   */
  registerCorrelationRule(
    name: string,
    evaluate: (
      huntingResult: Record<string, unknown>,
      threatProfile: ThreatProfile
    ) => IntelligenceCorrelation | null
  ): void {
    this.correlationRules.push({ name, evaluate });
  }

  /**
   * Create threat profile
   */
  createThreatProfile(
    name: string,
    description: string,
    indicators: Array<{ type: string; value: string; severity: string }>,
    tactics: string[],
    techniques: string[]
  ): ThreatProfile {
    const id = `profile-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const profile: ThreatProfile = {
      id,
      name,
      description,
      indicators,
      tactics,
      techniques,
      createdAt: Date.now(),
    };

    this.threatProfiles.set(id, profile);
    return profile;
  }

  /**
   * Correlate hunting result with threat intelligence
   */
  correlateResult(
    huntingResultId: string,
    huntingResult: Record<string, unknown>
  ): IntelligenceCorrelation[] {
    const correlations: IntelligenceCorrelation[] = [];

    for (const [, threatProfile] of this.threatProfiles) {
      for (const rule of this.correlationRules) {
        try {
          const correlation = rule.evaluate(huntingResult, threatProfile);
          if (correlation) {
            correlation.id = `corr-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            correlation.huntingResultId = huntingResultId;
            correlation.threatIntelligenceId = threatProfile.id;
            correlation.timestamp = Date.now();

            this.correlations.set(correlation.id, correlation);
            this.correlationHistory.push(correlation);
            correlations.push(correlation);
          }
        } catch {
          // Ignore rule errors
        }
      }
    }

    return correlations;
  }

  /**
   * Get threat profile
   */
  getThreatProfile(profileId: string): ThreatProfile | undefined {
    return this.threatProfiles.get(profileId);
  }

  /**
   * Get all threat profiles
   */
  getAllThreatProfiles(): ThreatProfile[] {
    return Array.from(this.threatProfiles.values());
  }

  /**
   * Get correlation
   */
  getCorrelation(correlationId: string): IntelligenceCorrelation | undefined {
    return this.correlations.get(correlationId);
  }

  /**
   * Get correlations by hunting result
   */
  getCorrelationsByHuntingResult(huntingResultId: string): IntelligenceCorrelation[] {
    return this.correlationHistory.filter((c) => c.huntingResultId === huntingResultId);
  }

  /**
   * Get correlations by threat profile
   */
  getCorrelationsByThreatProfile(threatProfileId: string): IntelligenceCorrelation[] {
    return this.correlationHistory.filter((c) => c.threatIntelligenceId === threatProfileId);
  }

  /**
   * Get high confidence correlations
   */
  getHighConfidenceCorrelations(minConfidence = 0.8, limit = 100): IntelligenceCorrelation[] {
    return this.correlationHistory
      .filter((c) => c.confidence >= minConfidence)
      .sort((a, b) => b.confidence - a.confidence)
      .slice(-limit);
  }

  /**
   * Get correlations by severity
   */
  getCorrelationsBySeverity(severity: string, limit = 100): IntelligenceCorrelation[] {
    return this.correlationHistory
      .filter((c) => c.severity === severity)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(-limit);
  }

  /**
   * Get correlation history
   */
  getCorrelationHistory(limit = 100): IntelligenceCorrelation[] {
    return this.correlationHistory.slice(-limit);
  }

  /**
   * Get correlation statistics
   */
  getStatistics(): Record<string, unknown> {
    const totalCorrelations = this.correlationHistory.length;
    const totalThreatProfiles = this.threatProfiles.size;

    const correlationTypeDistribution: Record<string, number> = {
      direct: 0,
      indirect: 0,
      related: 0,
      potential: 0,
    };

    for (const correlation of this.correlationHistory) {
      correlationTypeDistribution[correlation.correlationType]++;
    }

    const severityDistribution: Record<string, number> = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
    };

    for (const correlation of this.correlationHistory) {
      severityDistribution[correlation.severity]++;
    }

    const avgConfidence =
      totalCorrelations > 0
        ? this.correlationHistory.reduce((sum, c) => sum + c.confidence, 0) / totalCorrelations
        : 0;

    const highConfidenceCount = this.correlationHistory.filter((c) => c.confidence >= 0.8).length;

    return {
      totalCorrelations,
      totalThreatProfiles,
      correlationTypeDistribution,
      severityDistribution,
      avgConfidence,
      highConfidenceCount,
    };
  }

  /**
   * Export correlation report
   */
  exportCorrelationReport(format: 'json' | 'csv' = 'json'): string {
    if (format === 'json') {
      return JSON.stringify(
        {
          threatProfiles: Array.from(this.threatProfiles.values()),
          statistics: this.getStatistics(),
          recentCorrelations: this.correlationHistory.slice(-50),
        },
        null,
        2
      );
    }

    // CSV format
    const headers = ['CorrelationID', 'Type', 'Confidence', 'Severity', 'Timestamp'];
    const rows = this.correlationHistory
      .slice(-100)
      .map((c) => [c.id, c.correlationType, c.confidence, c.severity, c.timestamp]);

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    return csv;
  }
}
