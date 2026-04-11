/**
 * Pattern Detection Engine
 * Advanced pattern detection and analysis
 */

/**
 * Detection pattern
 */
export interface DetectionPattern {
  id: string;
  name: string;
  description: string;
  type: 'behavioral' | 'network' | 'file' | 'process' | 'registry';
  signature: Record<string, unknown>;
  severity: 'critical' | 'high' | 'medium' | 'low';
  enabled: boolean;
  createdAt: number;
  updatedAt: number;
}

/**
 * Pattern match
 */
export interface PatternMatch {
  id: string;
  patternId: string;
  timestamp: number;
  severity: 'critical' | 'high' | 'medium' | 'low';
  confidence: number;
  matchedData: Record<string, unknown>;
  context: Record<string, unknown>;
}

/**
 * Pattern Detection Engine
 * Advanced pattern detection and analysis
 */
export class PatternDetectionEngine {
  private patterns: Map<string, DetectionPattern> = new Map();
  private matches: Map<string, PatternMatch> = new Map();
  private matchHistory: PatternMatch[] = [];
  private detectionHandlers: Map<
    string,
    (signature: Record<string, unknown>, data: Record<string, unknown>) => boolean
  > = new Map();

  /**
   * Register detection handler
   */
  registerDetectionHandler(
    patternType: string,
    handler: (signature: Record<string, unknown>, data: Record<string, unknown>) => boolean
  ): void {
    this.detectionHandlers.set(patternType, handler);
  }

  /**
   * Create detection pattern
   */
  createPattern(
    name: string,
    description: string,
    type: string,
    signature: Record<string, unknown>,
    severity: string
  ): DetectionPattern {
    const id = `pattern-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const pattern: DetectionPattern = {
      id,
      name,
      description,
      type: type as DetectionPattern['type'],
      signature,
      severity: severity as DetectionPattern['severity'],
      enabled: true,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.patterns.set(id, pattern);
    return pattern;
  }

  /**
   * Analyze data against patterns
   */
  analyzeData(data: Record<string, unknown>): PatternMatch[] {
    const detectedMatches: PatternMatch[] = [];

    for (const [, pattern] of this.patterns) {
      if (!pattern.enabled) continue;

      const handler = this.detectionHandlers.get(pattern.type);
      if (!handler) continue;

      try {
        const isMatch = handler(pattern.signature, data);
        if (isMatch) {
          const matchId = `match-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

          const match: PatternMatch = {
            id: matchId,
            patternId: pattern.id,
            timestamp: Date.now(),
            severity: pattern.severity,
            confidence: 0.95,
            matchedData: data,
            context: { patternName: pattern.name, patternType: pattern.type },
          };

          this.matches.set(matchId, match);
          this.matchHistory.push(match);
          detectedMatches.push(match);
        }
      } catch {
        // Ignore handler errors
      }
    }

    return detectedMatches;
  }

  /**
   * Get pattern
   */
  getPattern(patternId: string): DetectionPattern | undefined {
    return this.patterns.get(patternId);
  }

  /**
   * Get all patterns
   */
  getAllPatterns(): DetectionPattern[] {
    return Array.from(this.patterns.values());
  }

  /**
   * Get enabled patterns
   */
  getEnabledPatterns(): DetectionPattern[] {
    return Array.from(this.patterns.values()).filter((p) => p.enabled);
  }

  /**
   * Get patterns by type
   */
  getPatternsByType(type: string): DetectionPattern[] {
    return Array.from(this.patterns.values()).filter((p) => p.type === type);
  }

  /**
   * Enable pattern
   */
  enablePattern(patternId: string): boolean {
    const pattern = this.patterns.get(patternId);
    if (!pattern) return false;

    pattern.enabled = true;
    pattern.updatedAt = Date.now();
    return true;
  }

  /**
   * Disable pattern
   */
  disablePattern(patternId: string): boolean {
    const pattern = this.patterns.get(patternId);
    if (!pattern) return false;

    pattern.enabled = false;
    pattern.updatedAt = Date.now();
    return true;
  }

  /**
   * Get match
   */
  getMatch(matchId: string): PatternMatch | undefined {
    return this.matches.get(matchId);
  }

  /**
   * Get matches by pattern
   */
  getMatchesByPattern(patternId: string, limit = 100): PatternMatch[] {
    return this.matchHistory.filter((m) => m.patternId === patternId).slice(-limit);
  }

  /**
   * Get matches by severity
   */
  getMatchesBySeverity(severity: string, limit = 100): PatternMatch[] {
    return this.matchHistory
      .filter((m) => m.severity === severity)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(-limit);
  }

  /**
   * Get match history
   */
  getMatchHistory(limit = 100): PatternMatch[] {
    return this.matchHistory.slice(-limit);
  }

  /**
   * Get detection statistics
   */
  getStatistics(): Record<string, unknown> {
    const totalPatterns = this.patterns.size;
    const enabledPatterns = Array.from(this.patterns.values()).filter((p) => p.enabled).length;
    const totalMatches = this.matchHistory.length;

    const matchesBySeverity: Record<string, number> = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
    };

    for (const match of this.matchHistory) {
      matchesBySeverity[match.severity]++;
    }

    const matchesByType: Record<string, number> = {};
    for (const match of this.matchHistory) {
      const pattern = this.patterns.get(match.patternId);
      if (pattern) {
        matchesByType[pattern.type] = (matchesByType[pattern.type] || 0) + 1;
      }
    }

    const avgConfidence =
      totalMatches > 0
        ? this.matchHistory.reduce((sum, m) => sum + m.confidence, 0) / totalMatches
        : 0;

    return {
      totalPatterns,
      enabledPatterns,
      disabledPatterns: totalPatterns - enabledPatterns,
      totalMatches,
      matchesBySeverity,
      matchesByType,
      avgConfidence,
    };
  }

  /**
   * Export detection report
   */
  exportDetectionReport(format: 'json' | 'csv' = 'json'): string {
    if (format === 'json') {
      return JSON.stringify(
        {
          patterns: Array.from(this.patterns.values()),
          statistics: this.getStatistics(),
          recentMatches: this.matchHistory.slice(-50),
        },
        null,
        2
      );
    }

    // CSV format
    const headers = ['PatternID', 'MatchID', 'Severity', 'Confidence', 'Timestamp'];
    const rows = this.matchHistory
      .slice(-100)
      .map((m) => [m.patternId, m.id, m.severity, m.confidence, m.timestamp]);

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    return csv;
  }
}
