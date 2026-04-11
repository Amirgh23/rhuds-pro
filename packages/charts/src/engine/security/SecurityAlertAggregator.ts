/**
 * Security Alert Aggregator
 * Alert aggregation and correlation
 */

/**
 * Alert correlation
 */
export interface AlertCorrelation {
  id: string;
  timestamp: number;
  alertIds: string[];
  correlationType: 'temporal' | 'source' | 'target' | 'pattern' | 'custom';
  confidence: number;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  metadata: Record<string, unknown>;
}

/**
 * Alert aggregate
 */
export interface AlertAggregate {
  id: string;
  timestamp: number;
  alertCount: number;
  correlationCount: number;
  severityDistribution: Record<string, number>;
  typeDistribution: Record<string, number>;
  sourceDistribution: Record<string, number>;
  topAlerts: Array<{
    id: string;
    severity: string;
    type: string;
    count: number;
  }>;
}

/**
 * Security Alert Aggregator
 * Alert aggregation and correlation
 */
export class SecurityAlertAggregator {
  private alerts: Map<string, Record<string, unknown>> = new Map();
  private correlations: Map<string, AlertCorrelation> = new Map();
  private correlationHistory: AlertCorrelation[] = [];
  private aggregates: AlertAggregate[] = [];
  private correlationRules: Array<{
    name: string;
    evaluate: (alerts: Array<Record<string, unknown>>) => AlertCorrelation | null;
  }> = [];

  /**
   * Register correlation rule
   */
  registerCorrelationRule(
    name: string,
    evaluate: (alerts: Array<Record<string, unknown>>) => AlertCorrelation | null
  ): void {
    this.correlationRules.push({ name, evaluate });
  }

  /**
   * Add alert
   */
  addAlert(alertId: string, alert: Record<string, unknown>): void {
    this.alerts.set(alertId, alert);
    this.evaluateCorrelations();
  }

  /**
   * Evaluate correlations
   */
  private evaluateCorrelations(): void {
    const alertArray = Array.from(this.alerts.values());

    for (const rule of this.correlationRules) {
      try {
        const correlation = rule.evaluate(alertArray);
        if (correlation) {
          this.correlations.set(correlation.id, correlation);
          this.correlationHistory.push(correlation);
        }
      } catch {
        // Ignore rule errors
      }
    }
  }

  /**
   * Get alert
   */
  getAlert(alertId: string): Record<string, unknown> | undefined {
    return this.alerts.get(alertId);
  }

  /**
   * Get all alerts
   */
  getAllAlerts(): Array<Record<string, unknown>> {
    return Array.from(this.alerts.values());
  }

  /**
   * Get correlation
   */
  getCorrelation(correlationId: string): AlertCorrelation | undefined {
    return this.correlations.get(correlationId);
  }

  /**
   * Get correlations by type
   */
  getCorrelationsByType(type: string): AlertCorrelation[] {
    return this.correlationHistory
      .filter((c) => c.correlationType === type)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 100);
  }

  /**
   * Get high confidence correlations
   */
  getHighConfidenceCorrelations(minConfidence = 0.8): AlertCorrelation[] {
    return this.correlationHistory
      .filter((c) => c.confidence >= minConfidence)
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 100);
  }

  /**
   * Get correlations by severity
   */
  getCorrelationsBySeverity(severity: string): AlertCorrelation[] {
    return this.correlationHistory
      .filter((c) => c.severity === severity)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 100);
  }

  /**
   * Generate aggregate
   */
  generateAggregate(): AlertAggregate {
    const severityDistribution: Record<string, number> = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
    };

    const typeDistribution: Record<string, number> = {};
    const sourceDistribution: Record<string, number> = {};
    const alertTypeCount: Record<string, number> = {};

    for (const alert of this.alerts.values()) {
      const severity = (alert.severity as string) || 'low';
      const type = (alert.type as string) || 'unknown';
      const source = (alert.source as string) || 'unknown';

      if (severity in severityDistribution) {
        severityDistribution[severity]++;
      }

      typeDistribution[type] = (typeDistribution[type] || 0) + 1;
      sourceDistribution[source] = (sourceDistribution[source] || 0) + 1;
      alertTypeCount[type] = (alertTypeCount[type] || 0) + 1;
    }

    const topAlerts = Object.entries(alertTypeCount)
      .map(([type, count]) => ({
        id: type,
        severity: 'unknown',
        type,
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const aggregate: AlertAggregate = {
      id: `agg-${Date.now()}`,
      timestamp: Date.now(),
      alertCount: this.alerts.size,
      correlationCount: this.correlations.size,
      severityDistribution,
      typeDistribution,
      sourceDistribution,
      topAlerts,
    };

    this.aggregates.push(aggregate);
    return aggregate;
  }

  /**
   * Get aggregates
   */
  getAggregates(limit = 100): AlertAggregate[] {
    return this.aggregates.slice(-limit);
  }

  /**
   * Get aggregation statistics
   */
  getStatistics(): Record<string, unknown> {
    const totalAlerts = this.alerts.size;
    const totalCorrelations = this.correlations.size;
    const avgAlertsPerCorrelation =
      totalCorrelations > 0
        ? this.correlationHistory.reduce((sum, c) => sum + c.alertIds.length, 0) / totalCorrelations
        : 0;

    const correlationTypeDistribution: Record<string, number> = {};
    for (const correlation of this.correlationHistory) {
      correlationTypeDistribution[correlation.correlationType] =
        (correlationTypeDistribution[correlation.correlationType] || 0) + 1;
    }

    const avgConfidence =
      totalCorrelations > 0
        ? this.correlationHistory.reduce((sum, c) => sum + c.confidence, 0) / totalCorrelations
        : 0;

    const highConfidenceCount = this.correlationHistory.filter((c) => c.confidence >= 0.8).length;

    return {
      totalAlerts,
      totalCorrelations,
      avgAlertsPerCorrelation,
      avgConfidence,
      highConfidenceCount,
      correlationTypeDistribution,
      aggregateCount: this.aggregates.length,
    };
  }

  /**
   * Export aggregation report
   */
  exportAggregationReport(format: 'json' | 'csv' = 'json'): string {
    if (format === 'json') {
      return JSON.stringify(
        {
          alerts: Array.from(this.alerts.values()).slice(-100),
          correlations: this.correlationHistory.slice(-100),
          statistics: this.getStatistics(),
          latestAggregate: this.aggregates[this.aggregates.length - 1],
        },
        null,
        2
      );
    }

    // CSV format
    const headers = ['CorrelationID', 'Type', 'Confidence', 'Severity', 'AlertCount'];
    const rows = this.correlationHistory
      .slice(-100)
      .map((c) => [c.id, c.correlationType, c.confidence, c.severity, c.alertIds.length]);

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    return csv;
  }
}
