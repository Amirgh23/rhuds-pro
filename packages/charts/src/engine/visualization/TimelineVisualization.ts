/**
 * Timeline Visualization
 * Visualize temporal data
 *
 * تصور خط زمانی
 * تصور داده های زمانی
 */

import { EventEmitter } from 'events';

export interface TimelineEvent {
  id: string;
  timestamp: number;
  title: string;
  description?: string;
  category?: string;
  color?: string;
  metadata?: Record<string, any>;
}

export interface TimelineData {
  id: string;
  events: TimelineEvent[];
  startTime: number;
  endTime: number;
  metadata?: Record<string, any>;
}

export interface TimelineConfig {
  orientation: 'horizontal' | 'vertical';
  scale: 'linear' | 'logarithmic';
  zoom: number;
  pan: number;
  showLabels: boolean;
  eventSize: number;
}

export interface TimelineFilter {
  categories?: string[];
  startTime?: number;
  endTime?: number;
  searchText?: string;
}

export class TimelineVisualization extends EventEmitter {
  private timelines: Map<string, TimelineData> = new Map();
  private filteredEvents: Map<string, TimelineEvent[]> = new Map();
  private annotations: Map<string, Map<string, string>> = new Map();
  private config: TimelineConfig;
  private filters: Map<string, TimelineFilter> = new Map();

  constructor() {
    super();
    this.config = {
      orientation: 'horizontal',
      scale: 'linear',
      zoom: 1,
      pan: 0,
      showLabels: true,
      eventSize: 10,
    };
  }

  /**
   * Load timeline data
   */
  loadTimeline(timelineData: TimelineData): void {
    this.timelines.set(timelineData.id, timelineData);
    this.sortEvents(timelineData.id);
    this.filteredEvents.set(timelineData.id, [...timelineData.events]);
    this.annotations.set(timelineData.id, new Map());
    this.emit('timeline:loaded', { id: timelineData.id });
  }

  /**
   * Sort events by timestamp
   */
  private sortEvents(timelineId: string): void {
    const timeline = this.timelines.get(timelineId);
    if (!timeline) return;

    timeline.events.sort((a, b) => a.timestamp - b.timestamp);
    this.emit('events:sorted', { id: timelineId });
  }

  /**
   * Apply filter
   */
  applyFilter(timelineId: string, filter: TimelineFilter): void {
    const timeline = this.timelines.get(timelineId);
    if (!timeline) return;

    this.filters.set(timelineId, filter);

    let filtered = [...timeline.events];

    if (filter.categories && filter.categories.length > 0) {
      filtered = filtered.filter((e) => filter.categories!.includes(e.category || ''));
    }

    if (filter.startTime !== undefined) {
      filtered = filtered.filter((e) => e.timestamp >= filter.startTime!);
    }

    if (filter.endTime !== undefined) {
      filtered = filtered.filter((e) => e.timestamp <= filter.endTime!);
    }

    if (filter.searchText) {
      const text = filter.searchText.toLowerCase();
      filtered = filtered.filter(
        (e) => e.title.toLowerCase().includes(text) || e.description?.toLowerCase().includes(text)
      );
    }

    this.filteredEvents.set(timelineId, filtered);
    this.emit('filter:applied', { id: timelineId, count: filtered.length });
  }

  /**
   * Clear filter
   */
  clearFilter(timelineId: string): void {
    const timeline = this.timelines.get(timelineId);
    if (!timeline) return;

    this.filters.delete(timelineId);
    this.filteredEvents.set(timelineId, [...timeline.events]);
    this.emit('filter:cleared', { id: timelineId });
  }

  /**
   * Add annotation
   */
  addAnnotation(timelineId: string, eventId: string, annotation: string): void {
    let annotations = this.annotations.get(timelineId);
    if (!annotations) {
      annotations = new Map();
      this.annotations.set(timelineId, annotations);
    }

    annotations.set(eventId, annotation);
    this.emit('annotation:added', { timelineId, eventId });
  }

  /**
   * Remove annotation
   */
  removeAnnotation(timelineId: string, eventId: string): void {
    const annotations = this.annotations.get(timelineId);
    if (annotations) {
      annotations.delete(eventId);
      this.emit('annotation:removed', { timelineId, eventId });
    }
  }

  /**
   * Get annotation
   */
  getAnnotation(timelineId: string, eventId: string): string | null {
    const annotations = this.annotations.get(timelineId);
    return annotations?.get(eventId) || null;
  }

  /**
   * Calculate event positions
   */
  calculatePositions(timelineId: string): Map<string, { position: number; label: string }> {
    const timeline = this.timelines.get(timelineId);
    const filtered = this.filteredEvents.get(timelineId);

    if (!timeline || !filtered) return new Map();

    const positions = new Map<string, { position: number; label: string }>();
    const timeRange = timeline.endTime - timeline.startTime;

    filtered.forEach((event) => {
      let position = (event.timestamp - timeline.startTime) / timeRange;

      if (this.config.scale === 'logarithmic') {
        position = Math.log(position + 1) / Math.log(2);
      }

      position = position * this.config.zoom + this.config.pan;

      positions.set(event.id, {
        position: Math.max(0, Math.min(1, position)),
        label: new Date(event.timestamp).toLocaleDateString(),
      });
    });

    return positions;
  }

  /**
   * Get events in range
   */
  getEventsInRange(timelineId: string, startTime: number, endTime: number): TimelineEvent[] {
    const filtered = this.filteredEvents.get(timelineId);
    if (!filtered) return [];

    return filtered.filter((e) => e.timestamp >= startTime && e.timestamp <= endTime);
  }

  /**
   * Get timeline
   */
  getTimeline(timelineId: string): TimelineData | null {
    return this.timelines.get(timelineId) || null;
  }

  /**
   * Get filtered events
   */
  getFilteredEvents(timelineId: string): TimelineEvent[] {
    return this.filteredEvents.get(timelineId) || [];
  }

  /**
   * Set zoom
   */
  setZoom(zoom: number): void {
    this.config.zoom = Math.max(0.1, Math.min(10, zoom));
    this.emit('zoom:changed', { zoom: this.config.zoom });
  }

  /**
   * Set pan
   */
  setPan(pan: number): void {
    this.config.pan = Math.max(-1, Math.min(1, pan));
    this.emit('pan:changed', { pan: this.config.pan });
  }

  /**
   * Set orientation
   */
  setOrientation(orientation: 'horizontal' | 'vertical'): void {
    this.config.orientation = orientation;
    this.emit('orientation:changed', { orientation });
  }

  /**
   * Get statistics
   */
  getStatistics(timelineId: string): {
    totalEvents: number;
    filteredEvents: number;
    timeSpan: number;
    categories: string[];
  } {
    const timeline = this.timelines.get(timelineId);
    const filtered = this.filteredEvents.get(timelineId);

    if (!timeline || !filtered) {
      return {
        totalEvents: 0,
        filteredEvents: 0,
        timeSpan: 0,
        categories: [],
      };
    }

    const categories = Array.from(
      new Set(timeline.events.map((e) => e.category || 'uncategorized'))
    );

    return {
      totalEvents: timeline.events.length,
      filteredEvents: filtered.length,
      timeSpan: timeline.endTime - timeline.startTime,
      categories,
    };
  }

  /**
   * Export timeline
   */
  exportTimeline(timelineId: string, format: 'json' | 'csv'): string {
    const timeline = this.timelines.get(timelineId);
    const filtered = this.filteredEvents.get(timelineId);

    if (!timeline || !filtered) return '';

    if (format === 'json') {
      return JSON.stringify(
        {
          id: timelineId,
          events: filtered,
          metadata: timeline.metadata,
        },
        null,
        2
      );
    } else {
      // CSV format
      const headers = ['ID', 'Timestamp', 'Title', 'Description', 'Category'];
      const rows = filtered.map((e) => [
        e.id,
        new Date(e.timestamp).toISOString(),
        e.title,
        e.description || '',
        e.category || '',
      ]);

      const csv = [headers, ...rows]
        .map((row) => row.map((cell) => `"${cell}"`).join(','))
        .join('\n');
      return csv;
    }
  }

  /**
   * Remove timeline
   */
  removeTimeline(timelineId: string): void {
    this.timelines.delete(timelineId);
    this.filteredEvents.delete(timelineId);
    this.annotations.delete(timelineId);
    this.filters.delete(timelineId);
    this.emit('timeline:removed', { id: timelineId });
  }
}
