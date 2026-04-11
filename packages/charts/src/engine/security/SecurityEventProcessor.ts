/**
 * Security Event Processor
 * Processes and correlates security events
 */

/**
 * Security event
 */
export interface SecurityEvent {
  id: string;
  timestamp: number;
  type: string;
  source: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  data: Record<string, unknown>;
  processed: boolean;
  enriched: boolean;
  correlationId?: string;
}

/**
 * Event enrichment
 */
export interface EventEnrichment {
  eventId: string;
  timestamp: number;
  enrichmentType: string;
  data: Record<string, unknown>;
}

/**
 * Event correlation
 */
export interface EventCorrelation {
  id: string;
  timestamp: number;
  eventIds: string[];
  correlationType: string;
  confidence: number;
  description: string;
}

/**
 * Event processing rule
 */
export interface ProcessingRule {
  id: string;
  name: string;
  enabled: boolean;
  condition: (event: SecurityEvent) => boolean;
  action: (event: SecurityEvent) => void;
  priority: number;
}

/**
 * Security Event Processor
 * Processes, enriches, and correlates security events
 */
export class SecurityEventProcessor {
  private events: Map<string, SecurityEvent> = new Map();
  private eventHistory: SecurityEvent[] = [];
  private enrichments: Map<string, EventEnrichment[]> = new Map();
  private correlations: Map<string, EventCorrelation> = new Map();
  private processingRules: Map<string, ProcessingRule> = new Map();
  private eventQueue: SecurityEvent[] = [];
  private correlationWindow: number = 60000; // 1 minute

  /**
   * Add event to processing queue
   */
  addEvent(
    event: Omit<SecurityEvent, 'id' | 'timestamp' | 'processed' | 'enriched'>
  ): SecurityEvent {
    const id = `event-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const securityEvent: SecurityEvent = {
      ...event,
      id,
      timestamp: Date.now(),
      processed: false,
      enriched: false,
    };

    this.events.set(id, securityEvent);
    this.eventQueue.push(securityEvent);
    this.eventHistory.push(securityEvent);

    return securityEvent;
  }

  /**
   * Process events
   */
  processEvents(): void {
    while (this.eventQueue.length > 0) {
      const event = this.eventQueue.shift();
      if (!event) break;

      // Apply processing rules
      this.applyProcessingRules(event);

      // Enrich event
      this.enrichEvent(event);

      // Correlate with other events
      this.correlateEvent(event);

      event.processed = true;
    }
  }

  /**
   * Apply processing rules
   */
  private applyProcessingRules(event: SecurityEvent): void {
    const rules = Array.from(this.processingRules.values())
      .filter((r) => r.enabled)
      .sort((a, b) => b.priority - a.priority);

    for (const rule of rules) {
      if (rule.condition(event)) {
        rule.action(event);
      }
    }
  }

  /**
   * Enrich event
   */
  enrichEvent(event: SecurityEvent): void {
    const enrichments: EventEnrichment[] = [];

    // Enrich with context
    const contextEnrichment: EventEnrichment = {
      eventId: event.id,
      timestamp: Date.now(),
      enrichmentType: 'context',
      data: {
        eventCount: this.eventHistory.length,
        recentEvents: this.getRecentEventCount(event.source, 300000), // 5 minutes
      },
    };
    enrichments.push(contextEnrichment);

    // Enrich with threat intelligence
    const threatEnrichment: EventEnrichment = {
      eventId: event.id,
      timestamp: Date.now(),
      enrichmentType: 'threat_intelligence',
      data: {
        knownThreat: this.isKnownThreat(event),
        similarEvents: this.findSimilarEvents(event),
      },
    };
    enrichments.push(threatEnrichment);

    // Enrich with historical data
    const historicalEnrichment: EventEnrichment = {
      eventId: event.id,
      timestamp: Date.now(),
      enrichmentType: 'historical',
      data: {
        sourceHistory: this.getSourceHistory(event.source),
        typeHistory: this.getTypeHistory(event.type),
      },
    };
    enrichments.push(historicalEnrichment);

    this.enrichments.set(event.id, enrichments);
    event.enriched = true;
  }

  /**
   * Get recent event count
   */
  private getRecentEventCount(source: string, timeWindow: number): number {
    const cutoff = Date.now() - timeWindow;
    return this.eventHistory.filter((e) => e.source === source && e.timestamp > cutoff).length;
  }

  /**
   * Check if event is known threat
   */
  private isKnownThreat(event: SecurityEvent): boolean {
    // Simple heuristic: check if similar events exist
    return this.findSimilarEvents(event).length > 0;
  }

  /**
   * Find similar events
   */
  private findSimilarEvents(event: SecurityEvent, limit: number = 5): SecurityEvent[] {
    return this.eventHistory
      .filter((e) => e.type === event.type && e.source === event.source && e.id !== event.id)
      .slice(-limit);
  }

  /**
   * Get source history
   */
  private getSourceHistory(source: string): Record<string, unknown> {
    const sourceEvents = this.eventHistory.filter((e) => e.source === source);
    const severityCount: Record<string, number> = {};

    for (const event of sourceEvents) {
      severityCount[event.severity] = (severityCount[event.severity] || 0) + 1;
    }

    return {
      totalEvents: sourceEvents.length,
      severityDistribution: severityCount,
      lastEvent: sourceEvents.length > 0 ? sourceEvents[sourceEvents.length - 1].timestamp : null,
    };
  }

  /**
   * Get type history
   */
  private getTypeHistory(type: string): Record<string, unknown> {
    const typeEvents = this.eventHistory.filter((e) => e.type === type);
    const sourceCount: Record<string, number> = {};

    for (const event of typeEvents) {
      sourceCount[event.source] = (sourceCount[event.source] || 0) + 1;
    }

    return {
      totalEvents: typeEvents.length,
      sourceDistribution: sourceCount,
      lastEvent: typeEvents.length > 0 ? typeEvents[typeEvents.length - 1].timestamp : null,
    };
  }

  /**
   * Correlate event with others
   */
  private correlateEvent(event: SecurityEvent): void {
    const correlatedEvents = this.findCorrelatedEvents(event);

    if (correlatedEvents.length > 0) {
      const id = `correlation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const correlation: EventCorrelation = {
        id,
        timestamp: Date.now(),
        eventIds: [event.id, ...correlatedEvents.map((e) => e.id)],
        correlationType: this.determineCorrelationType(event, correlatedEvents),
        confidence: this.calculateCorrelationConfidence(event, correlatedEvents),
        description: `Correlated ${correlatedEvents.length + 1} events`,
      };

      this.correlations.set(id, correlation);
      event.correlationId = id;
    }
  }

  /**
   * Find correlated events
   */
  private findCorrelatedEvents(event: SecurityEvent): SecurityEvent[] {
    const cutoff = Date.now() - this.correlationWindow;
    const candidates = this.eventHistory.filter(
      (e) => e.timestamp > cutoff && e.id !== event.id && e.processed
    );

    return candidates.filter((e) => {
      const similarity = this.calculateEventSimilarity(event, e);
      return similarity > 0.6;
    });
  }

  /**
   * Calculate event similarity
   */
  private calculateEventSimilarity(event1: SecurityEvent, event2: SecurityEvent): number {
    let similarity = 0;

    // Same type
    if (event1.type === event2.type) similarity += 0.3;

    // Same source
    if (event1.source === event2.source) similarity += 0.3;

    // Same severity
    if (event1.severity === event2.severity) similarity += 0.2;

    // Similar data
    const commonKeys = Object.keys(event1.data).filter((k) => Object.keys(event2.data).includes(k));
    if (commonKeys.length > 0) {
      similarity += 0.2 * (commonKeys.length / Math.max(Object.keys(event1.data).length, 1));
    }

    return Math.min(similarity, 1);
  }

  /**
   * Determine correlation type
   */
  private determineCorrelationType(
    event: SecurityEvent,
    correlatedEvents: SecurityEvent[]
  ): string {
    if (event.type === correlatedEvents[0]?.type) {
      return 'same_type';
    }
    if (event.source === correlatedEvents[0]?.source) {
      return 'same_source';
    }
    return 'related';
  }

  /**
   * Calculate correlation confidence
   */
  private calculateCorrelationConfidence(
    event: SecurityEvent,
    correlatedEvents: SecurityEvent[]
  ): number {
    let confidence = 0.5;

    // More correlated events = higher confidence
    confidence += Math.min(correlatedEvents.length * 0.1, 0.3);

    // Same type = higher confidence
    if (event.type === correlatedEvents[0]?.type) {
      confidence += 0.2;
    }

    return Math.min(confidence, 1);
  }

  /**
   * Add processing rule
   */
  addProcessingRule(rule: Omit<ProcessingRule, 'id'>): ProcessingRule {
    const id = `rule-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const processingRule: ProcessingRule = { ...rule, id };
    this.processingRules.set(id, processingRule);
    return processingRule;
  }

  /**
   * Get event
   */
  getEvent(eventId: string): SecurityEvent | undefined {
    return this.events.get(eventId);
  }

  /**
   * Get event enrichments
   */
  getEventEnrichments(eventId: string): EventEnrichment[] {
    return this.enrichments.get(eventId) || [];
  }

  /**
   * Get event correlation
   */
  getEventCorrelation(correlationId: string): EventCorrelation | undefined {
    return this.correlations.get(correlationId);
  }

  /**
   * Get events by type
   */
  getEventsByType(type: string): SecurityEvent[] {
    return this.eventHistory.filter((e) => e.type === type);
  }

  /**
   * Get events by source
   */
  getEventsBySource(source: string): SecurityEvent[] {
    return this.eventHistory.filter((e) => e.source === source);
  }

  /**
   * Get events by severity
   */
  getEventsBySeverity(severity: SecurityEvent['severity']): SecurityEvent[] {
    return this.eventHistory.filter((e) => e.severity === severity);
  }

  /**
   * Get processing statistics
   */
  getStatistics(): Record<string, unknown> {
    const totalEvents = this.eventHistory.length;
    const processedEvents = this.eventHistory.filter((e) => e.processed).length;
    const enrichedEvents = this.eventHistory.filter((e) => e.enriched).length;
    const correlatedEvents = this.eventHistory.filter((e) => e.correlationId).length;

    const eventsByType: Record<string, number> = {};
    for (const event of this.eventHistory) {
      eventsByType[event.type] = (eventsByType[event.type] || 0) + 1;
    }

    const eventsBySeverity: Record<string, number> = {};
    for (const event of this.eventHistory) {
      eventsBySeverity[event.severity] = (eventsBySeverity[event.severity] || 0) + 1;
    }

    return {
      totalEvents,
      processedEvents,
      enrichedEvents,
      correlatedEvents,
      queueLength: this.eventQueue.length,
      eventsByType,
      eventsBySeverity,
      correlationCount: this.correlations.size,
    };
  }

  /**
   * Export event report
   */
  exportEventReport(format: 'json' | 'csv' = 'json'): string {
    if (format === 'json') {
      return JSON.stringify(this.eventHistory, null, 2);
    }

    // CSV format
    const headers = ['ID', 'Timestamp', 'Type', 'Source', 'Severity', 'Processed', 'Enriched'];
    const rows = this.eventHistory.map((e) => [
      e.id,
      e.timestamp,
      e.type,
      e.source,
      e.severity,
      e.processed,
      e.enriched,
    ]);

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    return csv;
  }
}
