/**
 * Security Intelligence Engine
 * Intelligence gathering and analysis for security operations
 */

/**
 * Intelligence source definition
 */
export interface IntelligenceSource {
  id: string;
  name: string;
  type: 'feed' | 'api' | 'manual' | 'internal';
  url?: string;
  enabled: boolean;
  lastUpdated?: Date;
}

/**
 * Intelligence data point
 */
export interface IntelligenceData {
  id: string;
  sourceId: string;
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  data: Record<string, unknown>;
  timestamp: Date;
  processed: boolean;
}

/**
 * Intelligence analysis result
 */
export interface IntelligenceAnalysis {
  id: string;
  dataIds: string[];
  type: string;
  findings: string[];
  confidence: number;
  recommendations: string[];
  timestamp: Date;
}

/**
 * Intelligence statistics
 */
export interface IntelligenceStatistics {
  totalSources: number;
  activeSources: number;
  totalDataPoints: number;
  processedDataPoints: number;
  totalAnalyses: number;
  averageConfidence: number;
  criticalCount: number;
  highCount: number;
}

/**
 * Security Intelligence Engine
 * Gathers and analyzes security intelligence from multiple sources
 */
export class SecurityIntelligenceEngine {
  private sources: Map<string, IntelligenceSource> = new Map();
  private data: Map<string, IntelligenceData> = new Map();
  private analyses: Map<string, IntelligenceAnalysis> = new Map();
  private sourceHandlers: Map<string, (sourceId: string) => Promise<IntelligenceData[]>> =
    new Map();

  /**
   * Register intelligence source
   */
  registerSource(source: Omit<IntelligenceSource, 'lastUpdated'>): IntelligenceSource {
    const fullSource: IntelligenceSource = {
      ...source,
      lastUpdated: new Date(),
    };
    this.sources.set(source.id, fullSource);
    return fullSource;
  }

  /**
   * Register source handler
   */
  registerSourceHandler(
    sourceType: string,
    handler: (sourceId: string) => Promise<IntelligenceData[]>
  ): void {
    this.sourceHandlers.set(sourceType, handler);
  }

  /**
   * Collect intelligence from source
   */
  async collectIntelligence(sourceId: string): Promise<IntelligenceData[]> {
    const source = this.sources.get(sourceId);
    if (!source) return [];

    const handler = this.sourceHandlers.get(source.type);
    if (!handler) return [];

    const collected = await handler(sourceId);
    collected.forEach((item) => {
      this.data.set(item.id, item);
    });

    source.lastUpdated = new Date();
    return collected;
  }

  /**
   * Add intelligence data point
   */
  addDataPoint(data: Omit<IntelligenceData, 'id'>): IntelligenceData {
    const id = `intel-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const fullData: IntelligenceData = { ...data, id };
    this.data.set(id, fullData);
    return fullData;
  }

  /**
   * Analyze intelligence data
   */
  analyzeIntelligence(dataIds: string[], type: string): IntelligenceAnalysis {
    const id = `analysis-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const dataPoints = dataIds
      .map((id) => this.data.get(id))
      .filter((d): d is IntelligenceData => d !== undefined);

    const findings = dataPoints.map((d) => `Finding from ${d.type}: ${JSON.stringify(d.data)}`);
    const confidence = Math.min(1, dataPoints.length / 10);

    const analysis: IntelligenceAnalysis = {
      id,
      dataIds,
      type,
      findings,
      confidence,
      recommendations: this.generateRecommendations(findings),
      timestamp: new Date(),
    };

    this.analyses.set(id, analysis);
    return analysis;
  }

  /**
   * Generate recommendations from findings
   */
  private generateRecommendations(findings: string[]): string[] {
    return findings.map((_, i) => `Recommendation ${i + 1}: Review and validate finding`);
  }

  /**
   * Get intelligence data
   */
  getIntelligenceData(dataId: string): IntelligenceData | undefined {
    return this.data.get(dataId);
  }

  /**
   * Get analysis
   */
  getAnalysis(analysisId: string): IntelligenceAnalysis | undefined {
    return this.analyses.get(analysisId);
  }

  /**
   * Get data by source
   */
  getDataBySource(sourceId: string): IntelligenceData[] {
    return Array.from(this.data.values()).filter((d) => d.sourceId === sourceId);
  }

  /**
   * Get data by severity
   */
  getDataBySeverity(severity: string): IntelligenceData[] {
    return Array.from(this.data.values()).filter((d) => d.severity === severity);
  }

  /**
   * Get high confidence analyses
   */
  getHighConfidenceAnalyses(threshold: number): IntelligenceAnalysis[] {
    return Array.from(this.analyses.values()).filter((a) => a.confidence >= threshold);
  }

  /**
   * Get unprocessed data
   */
  getUnprocessedData(): IntelligenceData[] {
    return Array.from(this.data.values()).filter((d) => !d.processed);
  }

  /**
   * Mark data as processed
   */
  markAsProcessed(dataId: string): void {
    const data = this.data.get(dataId);
    if (data) {
      data.processed = true;
    }
  }

  /**
   * Get statistics
   */
  getStatistics(): IntelligenceStatistics {
    const allData = Array.from(this.data.values());
    const processedData = allData.filter((d) => d.processed);
    const analyses = Array.from(this.analyses.values());

    return {
      totalSources: this.sources.size,
      activeSources: Array.from(this.sources.values()).filter((s) => s.enabled).length,
      totalDataPoints: allData.length,
      processedDataPoints: processedData.length,
      totalAnalyses: analyses.length,
      averageConfidence:
        analyses.length > 0
          ? analyses.reduce((sum, a) => sum + a.confidence, 0) / analyses.length
          : 0,
      criticalCount: allData.filter((d) => d.severity === 'critical').length,
      highCount: allData.filter((d) => d.severity === 'high').length,
    };
  }

  /**
   * Export intelligence report
   */
  exportIntelligenceReport(format: 'json' | 'csv'): string {
    const stats = this.getStatistics();
    const data = Array.from(this.data.values());
    const analyses = Array.from(this.analyses.values());

    if (format === 'json') {
      return JSON.stringify({ statistics: stats, data, analyses }, null, 2);
    }

    const rows = [
      ['Type', 'Value'],
      ['Total Sources', stats.totalSources.toString()],
      ['Active Sources', stats.activeSources.toString()],
      ['Total Data Points', stats.totalDataPoints.toString()],
      ['Processed Data Points', stats.processedDataPoints.toString()],
      ['Total Analyses', stats.totalAnalyses.toString()],
      ['Average Confidence', stats.averageConfidence.toFixed(2)],
      ['Critical Count', stats.criticalCount.toString()],
      ['High Count', stats.highCount.toString()],
    ];

    return rows.map((row) => row.join(',')).join('\n');
  }
}
