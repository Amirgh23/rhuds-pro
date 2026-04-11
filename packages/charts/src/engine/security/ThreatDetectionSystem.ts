/**
 * Threat Detection System
 * Real-time threat detection, anomaly detection, and security alerts
 */

export interface ThreatSignature {
  id: string;
  name: string;
  pattern: RegExp;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
}

export interface SecurityEvent {
  id: string;
  timestamp: number;
  type: string;
  source: string;
  data: Record<string, unknown>;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface ThreatAlert {
  id: string;
  timestamp: number;
  threatType: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  affectedResources: string[];
  recommendedActions: string[];
  status: 'open' | 'investigating' | 'resolved';
}

export interface AnomalyPattern {
  metric: string;
  baseline: number;
  threshold: number;
  windowSize: number;
}

/**
 * Threat Detection System
 * Detects security threats, anomalies, and generates alerts
 */
export class ThreatDetectionSystem {
  private signatures: Map<string, ThreatSignature> = new Map();
  private events: SecurityEvent[] = [];
  private alerts: ThreatAlert[] = [];
  private anomalyPatterns: Map<string, AnomalyPattern> = new Map();
  private metricHistory: Map<string, number[]> = new Map();
  private threatScores: Map<string, number> = new Map();

  constructor() {
    this.initializeSignatures();
    this.initializeAnomalyPatterns();
  }

  /**
   * Initialize threat signatures
   */
  private initializeSignatures(): void {
    const signatures: ThreatSignature[] = [
      {
        id: 'sql-injection',
        name: 'SQL Injection',
        pattern: /(\bUNION\b|\bSELECT\b|\bDROP\b|\bINSERT\b)/i,
        severity: 'critical',
        description: 'Potential SQL injection attack detected',
      },
      {
        id: 'xss-attack',
        name: 'Cross-Site Scripting',
        pattern: /(<script|javascript:|onerror=|onload=)/i,
        severity: 'high',
        description: 'Potential XSS attack detected',
      },
      {
        id: 'path-traversal',
        name: 'Path Traversal',
        pattern: /(\.\.|\/\/|\.\.\/)/,
        severity: 'high',
        description: 'Potential path traversal attack detected',
      },
      {
        id: 'brute-force',
        name: 'Brute Force Attack',
        pattern: /failed.*login/i,
        severity: 'medium',
        description: 'Multiple failed login attempts detected',
      },
      {
        id: 'ddos-pattern',
        name: 'DDoS Pattern',
        pattern: /high.*request.*rate/i,
        severity: 'high',
        description: 'Potential DDoS attack pattern detected',
      },
    ];

    signatures.forEach((sig) => this.signatures.set(sig.id, sig));
  }

  /**
   * Initialize anomaly patterns
   */
  private initializeAnomalyPatterns(): void {
    const patterns: AnomalyPattern[] = [
      {
        metric: 'request_rate',
        baseline: 100,
        threshold: 500,
        windowSize: 60,
      },
      {
        metric: 'error_rate',
        baseline: 0.01,
        threshold: 0.1,
        windowSize: 300,
      },
      {
        metric: 'response_time',
        baseline: 200,
        threshold: 5000,
        windowSize: 60,
      },
      {
        metric: 'failed_auth',
        baseline: 0.05,
        threshold: 0.5,
        windowSize: 300,
      },
      {
        metric: 'data_exfiltration',
        baseline: 1,
        threshold: 100,
        windowSize: 60,
      },
    ];

    patterns.forEach((pattern) => {
      this.anomalyPatterns.set(pattern.metric, pattern);
      this.metricHistory.set(pattern.metric, []);
    });
  }

  /**
   * Analyze security event
   */
  public analyzeEvent(event: SecurityEvent): ThreatAlert | null {
    this.events.push(event);

    // Check against threat signatures
    for (const [, signature] of this.signatures) {
      const eventStr = JSON.stringify(event.data);
      if (signature.pattern.test(eventStr)) {
        return this.createAlert(signature.name, signature.severity, signature.description, [
          event.source,
        ]);
      }
    }

    return null;
  }

  /**
   * Detect anomalies
   */
  public detectAnomalies(metric: string, value: number): ThreatAlert | null {
    const pattern = this.anomalyPatterns.get(metric);
    if (!pattern) return null;

    const history = this.metricHistory.get(metric) || [];
    history.push(value);

    // Keep only recent values
    if (history.length > pattern.windowSize) {
      history.shift();
    }

    this.metricHistory.set(metric, history);

    // Calculate average
    const average = history.reduce((a, b) => a + b, 0) / history.length;

    // Check if value exceeds threshold
    if (value > pattern.threshold) {
      const severity = value > pattern.threshold * 2 ? 'critical' : 'high';
      return this.createAlert(
        `Anomaly: ${metric}`,
        severity,
        `${metric} exceeded threshold: ${value} > ${pattern.threshold}`,
        [metric]
      );
    }

    return null;
  }

  /**
   * Create threat alert
   */
  private createAlert(
    threatType: string,
    severity: 'low' | 'medium' | 'high' | 'critical',
    description: string,
    affectedResources: string[]
  ): ThreatAlert {
    const alert: ThreatAlert = {
      id: this.generateId(),
      timestamp: Date.now(),
      threatType,
      severity,
      description,
      affectedResources,
      recommendedActions: this.getRecommendedActions(threatType),
      status: 'open',
    };

    this.alerts.push(alert);
    this.updateThreatScore(threatType, severity);

    return alert;
  }

  /**
   * Get recommended actions for threat type
   */
  private getRecommendedActions(threatType: string): string[] {
    const actions: Record<string, string[]> = {
      'SQL Injection': ['Review input validation', 'Use parameterized queries', 'Enable WAF rules'],
      'Cross-Site Scripting': [
        'Sanitize user input',
        'Implement CSP headers',
        'Use template escaping',
      ],
      'Path Traversal': [
        'Validate file paths',
        'Restrict directory access',
        'Use allowlist for files',
      ],
      'Brute Force Attack': ['Implement rate limiting', 'Enable account lockout', 'Require MFA'],
      'DDoS Pattern': ['Enable DDoS protection', 'Increase rate limits', 'Use CDN'],
    };

    return actions[threatType] || ['Investigate immediately', 'Review logs'];
  }

  /**
   * Update threat score
   */
  private updateThreatScore(threatType: string, severity: string): void {
    const severityScore: Record<string, number> = {
      low: 1,
      medium: 5,
      high: 10,
      critical: 25,
    };

    const currentScore = this.threatScores.get(threatType) || 0;
    this.threatScores.set(threatType, currentScore + severityScore[severity]);
  }

  /**
   * Get threat score
   */
  public getThreatScore(threatType?: string): number {
    if (threatType) {
      return this.threatScores.get(threatType) || 0;
    }

    // Return overall threat score
    let total = 0;
    for (const score of this.threatScores.values()) {
      total += score;
    }
    return total;
  }

  /**
   * Get active alerts
   */
  public getActiveAlerts(): ThreatAlert[] {
    return this.alerts.filter((alert) => alert.status === 'open');
  }

  /**
   * Get alerts by severity
   */
  public getAlertsBySeverity(severity: 'low' | 'medium' | 'high' | 'critical'): ThreatAlert[] {
    return this.alerts.filter((alert) => alert.severity === severity);
  }

  /**
   * Resolve alert
   */
  public resolveAlert(alertId: string): boolean {
    const alert = this.alerts.find((a) => a.id === alertId);
    if (alert) {
      alert.status = 'resolved';
      return true;
    }
    return false;
  }

  /**
   * Get threat statistics
   */
  public getThreatStatistics(): Record<string, unknown> {
    const criticalAlerts = this.alerts.filter((a) => a.severity === 'critical').length;
    const highAlerts = this.alerts.filter((a) => a.severity === 'high').length;
    const mediumAlerts = this.alerts.filter((a) => a.severity === 'medium').length;
    const lowAlerts = this.alerts.filter((a) => a.severity === 'low').length;

    return {
      totalEvents: this.events.length,
      totalAlerts: this.alerts.length,
      activeAlerts: this.getActiveAlerts().length,
      criticalAlerts,
      highAlerts,
      mediumAlerts,
      lowAlerts,
      overallThreatScore: this.getThreatScore(),
      topThreats: Array.from(this.threatScores.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, score]) => ({ name, score })),
    };
  }

  /**
   * Generate ID
   */
  private generateId(): string {
    return `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get events
   */
  public getEvents(startTime?: number, endTime?: number): SecurityEvent[] {
    return this.events.filter((event) => {
      if (startTime && event.timestamp < startTime) return false;
      if (endTime && event.timestamp > endTime) return false;
      return true;
    });
  }

  /**
   * Clear old data
   */
  public clearOldData(olderThanMs: number): void {
    const cutoffTime = Date.now() - olderThanMs;
    this.events = this.events.filter((e) => e.timestamp > cutoffTime);
    this.alerts = this.alerts.filter((a) => a.timestamp > cutoffTime);
  }
}
