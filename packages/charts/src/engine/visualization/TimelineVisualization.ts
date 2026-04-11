/**
 * Timeline Visualization Engine
 * Renders temporal data with event markers, zoom, pan, and annotations
 */

export interface TimelineEvent {
  id: string;
  timestamp: number;
  label: string;
  description?: string;
  category?: string;
  color?: string;
  icon?: string;
}

export interface TimelineConfig {
  startTime: number;
  endTime: number;
  height: number;
  orientation?: 'horizontal' | 'vertical';
  showGrid?: boolean;
  gridInterval?: number;
}

export interface TimelineRange {
  start: number;
  end: number;
  duration: number;
}

export interface TimelineAnnotation {
  id: string;
  eventId: string;
  text: string;
  position: 'top' | 'bottom';
  color?: string;
}

export interface EventCluster {
  timestamp: number;
  events: TimelineEvent[];
  count: number;
}

/**
 * TimelineVisualization - Advanced timeline rendering
 */
export class TimelineVisualization {
  private config: TimelineConfig;
  private events: Map<string, TimelineEvent> = new Map();
  private annotations: Map<string, TimelineAnnotation> = new Map();
  private currentRange: TimelineRange;
  private zoomLevel: number = 1;

  constructor(config: TimelineConfig) {
    this.config = {
      orientation: 'horizontal',
      showGrid: true,
      gridInterval: 1000,
      ...config,
    };

    this.currentRange = {
      start: config.startTime,
      end: config.endTime,
      duration: config.endTime - config.startTime,
    };
  }

  /**
   * Add event to timeline
   */
  addEvent(event: TimelineEvent): void {
    this.events.set(event.id, event);
  }

  /**
   * Add multiple events
   */
  addEvents(events: TimelineEvent[]): void {
    for (const event of events) {
      this.addEvent(event);
    }
  }

  /**
   * Remove event
   */
  removeEvent(eventId: string): boolean {
    return this.events.delete(eventId);
  }

  /**
   * Get event by ID
   */
  getEvent(eventId: string): TimelineEvent | undefined {
    return this.events.get(eventId);
  }

  /**
   * Get events in time range
   */
  getEventsInRange(start: number, end: number): TimelineEvent[] {
    return Array.from(this.events.values()).filter(
      (event) => event.timestamp >= start && event.timestamp <= end
    );
  }

  /**
   * Get events in current view
   */
  getVisibleEvents(): TimelineEvent[] {
    return this.getEventsInRange(this.currentRange.start, this.currentRange.end);
  }

  /**
   * Add annotation
   */
  addAnnotation(annotation: TimelineAnnotation): void {
    this.annotations.set(annotation.id, annotation);
  }

  /**
   * Remove annotation
   */
  removeAnnotation(annotationId: string): boolean {
    return this.annotations.delete(annotationId);
  }

  /**
   * Get annotations for event
   */
  getAnnotationsForEvent(eventId: string): TimelineAnnotation[] {
    return Array.from(this.annotations.values()).filter((ann) => ann.eventId === eventId);
  }

  /**
   * Zoom in
   */
  zoomIn(factor: number = 1.5): void {
    this.zoomLevel *= factor;
    this.updateRangeForZoom();
  }

  /**
   * Zoom out
   */
  zoomOut(factor: number = 1.5): void {
    this.zoomLevel /= factor;
    this.updateRangeForZoom();
  }

  /**
   * Update range based on zoom level
   */
  private updateRangeForZoom(): void {
    const originalDuration = this.config.endTime - this.config.startTime;
    const newDuration = originalDuration / this.zoomLevel;
    const center = (this.currentRange.start + this.currentRange.end) / 2;

    this.currentRange.start = center - newDuration / 2;
    this.currentRange.end = center + newDuration / 2;
    this.currentRange.duration = newDuration;

    // Clamp to original range
    if (this.currentRange.start < this.config.startTime) {
      this.currentRange.start = this.config.startTime;
      this.currentRange.end = this.currentRange.start + newDuration;
    }
    if (this.currentRange.end > this.config.endTime) {
      this.currentRange.end = this.config.endTime;
      this.currentRange.start = this.currentRange.end - newDuration;
    }
  }

  /**
   * Pan timeline
   */
  pan(delta: number): void {
    const newStart = this.currentRange.start + delta;
    const newEnd = this.currentRange.end + delta;

    if (newStart >= this.config.startTime && newEnd <= this.config.endTime) {
      this.currentRange.start = newStart;
      this.currentRange.end = newEnd;
    }
  }

  /**
   * Reset to full range
   */
  reset(): void {
    this.zoomLevel = 1;
    this.currentRange = {
      start: this.config.startTime,
      end: this.config.endTime,
      duration: this.config.endTime - this.config.startTime,
    };
  }

  /**
   * Get current view range
   */
  getCurrentRange(): TimelineRange {
    return { ...this.currentRange };
  }

  /**
   * Get zoom level
   */
  getZoomLevel(): number {
    return this.zoomLevel;
  }

  /**
   * Cluster events by time
   */
  clusterEvents(interval: number): EventCluster[] {
    const clusters = new Map<number, TimelineEvent[]>();

    for (const event of this.getVisibleEvents()) {
      const clusterTime = Math.floor(event.timestamp / interval) * interval;
      if (!clusters.has(clusterTime)) {
        clusters.set(clusterTime, []);
      }
      clusters.get(clusterTime)!.push(event);
    }

    return Array.from(clusters.entries())
      .map(([timestamp, events]) => ({
        timestamp,
        events,
        count: events.length,
      }))
      .sort((a, b) => a.timestamp - b.timestamp);
  }

  /**
   * Get grid lines for current view
   */
  getGridLines(): number[] {
    if (!this.config.showGrid) return [];

    const lines: number[] = [];
    const interval = this.config.gridInterval! * this.zoomLevel;
    const start = Math.ceil(this.currentRange.start / interval) * interval;
    const end = Math.floor(this.currentRange.end / interval) * interval;

    for (let time = start; time <= end; time += interval) {
      lines.push(time);
    }

    return lines;
  }

  /**
   * Convert timestamp to pixel position
   */
  timestampToPixel(timestamp: number, width: number): number {
    const ratio = (timestamp - this.currentRange.start) / this.currentRange.duration;
    return ratio * width;
  }

  /**
   * Convert pixel position to timestamp
   */
  pixelToTimestamp(pixel: number, width: number): number {
    const ratio = pixel / width;
    return this.currentRange.start + ratio * this.currentRange.duration;
  }

  /**
   * Get timeline statistics
   */
  getStatistics(): Record<string, number | string> {
    const events = Array.from(this.events.values());
    const timestamps = events.map((e) => e.timestamp);

    if (timestamps.length === 0) {
      return {
        eventCount: 0,
        annotationCount: 0,
        timeSpan: 0,
        eventsPerDay: 0,
      };
    }

    const min = Math.min(...timestamps);
    const max = Math.max(...timestamps);
    const timeSpan = max - min;
    const eventsPerDay = (events.length / timeSpan) * (24 * 60 * 60 * 1000);

    return {
      eventCount: events.length,
      annotationCount: this.annotations.size,
      timeSpan,
      eventsPerDay: Math.round(eventsPerDay * 100) / 100,
      earliestEvent: new Date(min).toISOString(),
      latestEvent: new Date(max).toISOString(),
    };
  }

  /**
   * Export timeline data
   */
  exportData(): Record<string, unknown> {
    return {
      config: this.config,
      events: Array.from(this.events.values()),
      annotations: Array.from(this.annotations.values()),
      currentRange: this.currentRange,
      zoomLevel: this.zoomLevel,
    };
  }

  /**
   * Import timeline data
   */
  importData(data: Record<string, unknown>): void {
    if (data.events && Array.isArray(data.events)) {
      this.events.clear();
      for (const event of data.events as TimelineEvent[]) {
        this.addEvent(event);
      }
    }

    if (data.annotations && Array.isArray(data.annotations)) {
      this.annotations.clear();
      for (const annotation of data.annotations as TimelineAnnotation[]) {
        this.addAnnotation(annotation);
      }
    }
  }

  /**
   * Clear all data
   */
  clear(): void {
    this.events.clear();
    this.annotations.clear();
    this.reset();
  }
}
