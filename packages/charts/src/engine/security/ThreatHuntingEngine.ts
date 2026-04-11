/**
 * Threat Hunting Engine
 * Advanced threat hunting and pattern detection
 */

/**
 * Hunt query
 */
export interface HuntQuery {
  id: string;
  name: string;
  description: string;
  query: string;
  filters: Record<string, unknown>;
  createdAt: number;
  updatedAt: number;
  status: 'draft' | 'active' | 'completed' | 'archived';
}

/**
 * Hunt result
 */
export interface HuntResult {
  id: string;
  queryId: string;
  timestamp: number;
  matchCount: number;
  matches: Array<{
    id: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    type: string;
    data: Record<string, unknown>;
  }>;
  duration: number;
  status: 'pending' | 'completed' | 'failed';
}

/**
 * Threat Hunting Engine
 * Advanced threat hunting and pattern detection
 */
export class ThreatHuntingEngine {
  private queries: Map<string, HuntQuery> = new Map();
  private results: Map<string, HuntResult> = new Map();
  private resultHistory: HuntResult[] = [];
  private queryHandlers: Map<
    string,
    (query: string, filters: Record<string, unknown>) => Promise<Array<Record<string, unknown>>>
  > = new Map();

  /**
   * Register query handler
   */
  registerQueryHandler(
    queryType: string,
    handler: (
      query: string,
      filters: Record<string, unknown>
    ) => Promise<Array<Record<string, unknown>>>
  ): void {
    this.queryHandlers.set(queryType, handler);
  }

  /**
   * Create hunt query
   */
  createQuery(
    name: string,
    description: string,
    query: string,
    filters: Record<string, unknown> = {}
  ): HuntQuery {
    const id = `query-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const huntQuery: HuntQuery = {
      id,
      name,
      description,
      query,
      filters,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      status: 'draft',
    };

    this.queries.set(id, huntQuery);
    return huntQuery;
  }

  /**
   * Execute hunt query
   */
  async executeQuery(queryId: string): Promise<HuntResult | null> {
    const query = this.queries.get(queryId);
    if (!query) return null;

    const resultId = `result-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const startTime = Date.now();

    const result: HuntResult = {
      id: resultId,
      queryId,
      timestamp: startTime,
      matchCount: 0,
      matches: [],
      duration: 0,
      status: 'pending',
    };

    this.results.set(resultId, result);

    try {
      // Extract query type from query string
      const queryType = query.query.split(':')[0] || 'default';
      const handler = this.queryHandlers.get(queryType);

      if (handler) {
        const matches = await handler(query.query, query.filters);

        result.matches = matches.slice(0, 1000).map((match, idx) => ({
          id: `match-${resultId}-${idx}`,
          severity: (match.severity as HuntResult['matches'][0]['severity']) || 'medium',
          type: (match.type as string) || 'unknown',
          data: match,
        }));

        result.matchCount = result.matches.length;
        result.status = 'completed';
      } else {
        result.status = 'failed';
      }
    } catch (error) {
      result.status = 'failed';
    }

    result.duration = Date.now() - startTime;
    query.status = 'active';
    query.updatedAt = Date.now();

    this.resultHistory.push(result);
    return result;
  }

  /**
   * Get query
   */
  getQuery(queryId: string): HuntQuery | undefined {
    return this.queries.get(queryId);
  }

  /**
   * Get all queries
   */
  getAllQueries(): HuntQuery[] {
    return Array.from(this.queries.values());
  }

  /**
   * Get active queries
   */
  getActiveQueries(): HuntQuery[] {
    return Array.from(this.queries.values()).filter((q) => q.status === 'active');
  }

  /**
   * Get result
   */
  getResult(resultId: string): HuntResult | undefined {
    return this.results.get(resultId);
  }

  /**
   * Get results by query
   */
  getResultsByQuery(queryId: string, limit = 100): HuntResult[] {
    return this.resultHistory.filter((r) => r.queryId === queryId).slice(-limit);
  }

  /**
   * Get result history
   */
  getResultHistory(limit = 100): HuntResult[] {
    return this.resultHistory.slice(-limit);
  }

  /**
   * Get hunting statistics
   */
  getStatistics(): Record<string, unknown> {
    const totalQueries = this.queries.size;
    const activeQueries = Array.from(this.queries.values()).filter(
      (q) => q.status === 'active'
    ).length;
    const totalResults = this.resultHistory.length;
    const totalMatches = this.resultHistory.reduce((sum, r) => sum + r.matchCount, 0);

    const avgMatchesPerResult = totalResults > 0 ? totalMatches / totalResults : 0;
    const avgExecutionTime =
      totalResults > 0
        ? this.resultHistory.reduce((sum, r) => sum + r.duration, 0) / totalResults
        : 0;

    const severityDistribution: Record<string, number> = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
    };

    for (const result of this.resultHistory) {
      for (const match of result.matches) {
        severityDistribution[match.severity]++;
      }
    }

    return {
      totalQueries,
      activeQueries,
      totalResults,
      totalMatches,
      avgMatchesPerResult,
      avgExecutionTime,
      severityDistribution,
    };
  }

  /**
   * Export hunting report
   */
  exportHuntingReport(format: 'json' | 'csv' = 'json'): string {
    if (format === 'json') {
      return JSON.stringify(
        {
          queries: Array.from(this.queries.values()),
          statistics: this.getStatistics(),
          recentResults: this.resultHistory.slice(-50),
        },
        null,
        2
      );
    }

    // CSV format
    const headers = ['QueryID', 'ResultID', 'Timestamp', 'MatchCount', 'Duration'];
    const rows = this.resultHistory
      .slice(-100)
      .map((r) => [r.queryId, r.id, r.timestamp, r.matchCount, r.duration]);

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    return csv;
  }
}
