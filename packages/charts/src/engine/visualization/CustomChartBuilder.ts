/**
 * Custom Chart Builder
 * Allow users to create custom charts
 *
 * سازنده نمودار سفارشی
 * اجازه دهید کاربران نمودارهای سفارشی ایجاد کنند
 */

import { EventEmitter } from 'events';

export interface ChartTemplate {
  id: string;
  name: string;
  type: string;
  config: Record<string, any>;
  description?: string;
}

export interface DataMapping {
  source: string;
  target: string;
  transform?: (value: any) => any;
}

export interface ChartStyle {
  colors?: string[];
  fonts?: { family: string; size: number };
  margins?: { top: number; right: number; bottom: number; left: number };
  padding?: number;
  borderRadius?: number;
  backgroundColor?: string;
  gridLines?: boolean;
}

export interface CustomChart {
  id: string;
  name: string;
  type: string;
  data: Record<string, any>;
  mappings: DataMapping[];
  style: ChartStyle;
  template?: string;
  metadata?: Record<string, any>;
}

export class CustomChartBuilder extends EventEmitter {
  private charts: Map<string, CustomChart> = new Map();
  private templates: Map<string, ChartTemplate> = new Map();
  private presets: Map<string, ChartStyle> = new Map();

  constructor() {
    super();
    this.initializeTemplates();
    this.initializePresets();
  }

  /**
   * Initialize default templates
   */
  private initializeTemplates(): void {
    const templates: ChartTemplate[] = [
      {
        id: 'bar-chart',
        name: 'Bar Chart',
        type: 'bar',
        config: {
          orientation: 'vertical',
          stacked: false,
          showLegend: true,
          showGrid: true,
        },
      },
      {
        id: 'line-chart',
        name: 'Line Chart',
        type: 'line',
        config: {
          smooth: true,
          showPoints: true,
          showLegend: true,
          showGrid: true,
        },
      },
      {
        id: 'pie-chart',
        name: 'Pie Chart',
        type: 'pie',
        config: {
          showLabels: true,
          showLegend: true,
          donutHole: 0,
        },
      },
      {
        id: 'scatter-plot',
        name: 'Scatter Plot',
        type: 'scatter',
        config: {
          showTrendline: false,
          pointSize: 5,
          showLegend: true,
        },
      },
      {
        id: 'area-chart',
        name: 'Area Chart',
        type: 'area',
        config: {
          stacked: false,
          smooth: true,
          showLegend: true,
        },
      },
    ];

    templates.forEach((template) => {
      this.templates.set(template.id, template);
    });
  }

  /**
   * Initialize style presets
   */
  private initializePresets(): void {
    const presets: Record<string, ChartStyle> = {
      default: {
        colors: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd'],
        fonts: { family: 'Arial', size: 12 },
        margins: { top: 20, right: 20, bottom: 20, left: 20 },
        padding: 10,
        borderRadius: 4,
        backgroundColor: '#ffffff',
        gridLines: true,
      },
      dark: {
        colors: ['#00d9ff', '#ff006e', '#ffbe0b', '#8338ec', '#3a86ff'],
        fonts: { family: 'Courier New', size: 12 },
        margins: { top: 20, right: 20, bottom: 20, left: 20 },
        padding: 10,
        borderRadius: 4,
        backgroundColor: '#1a1a1a',
        gridLines: true,
      },
      minimal: {
        colors: ['#333333', '#666666', '#999999', '#cccccc', '#eeeeee'],
        fonts: { family: 'Helvetica', size: 11 },
        margins: { top: 10, right: 10, bottom: 10, left: 10 },
        padding: 5,
        borderRadius: 0,
        backgroundColor: '#ffffff',
        gridLines: false,
      },
      vibrant: {
        colors: ['#ff006e', '#ffbe0b', '#00d9ff', '#8338ec', '#3a86ff'],
        fonts: { family: 'Georgia', size: 13 },
        margins: { top: 25, right: 25, bottom: 25, left: 25 },
        padding: 15,
        borderRadius: 8,
        backgroundColor: '#f5f5f5',
        gridLines: true,
      },
    };

    Object.entries(presets).forEach(([name, style]) => {
      this.presets.set(name, style);
    });
  }

  /**
   * Create chart from template
   */
  createFromTemplate(chartId: string, templateId: string, data: Record<string, any>): CustomChart {
    const template = this.templates.get(templateId);
    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }

    const chart: CustomChart = {
      id: chartId,
      name: template.name,
      type: template.type,
      data,
      mappings: [],
      style: this.presets.get('default') || {},
      template: templateId,
    };

    this.charts.set(chartId, chart);
    this.emit('chart:created', { id: chartId, template: templateId });

    return chart;
  }

  /**
   * Create blank chart
   */
  createBlankChart(chartId: string, type: string, data: Record<string, any>): CustomChart {
    const chart: CustomChart = {
      id: chartId,
      name: `Chart ${chartId}`,
      type,
      data,
      mappings: [],
      style: this.presets.get('default') || {},
    };

    this.charts.set(chartId, chart);
    this.emit('chart:created', { id: chartId, type });

    return chart;
  }

  /**
   * Add data mapping
   */
  addMapping(chartId: string, mapping: DataMapping): void {
    const chart = this.charts.get(chartId);
    if (!chart) return;

    chart.mappings.push(mapping);
    this.emit('mapping:added', { chartId, mapping });
  }

  /**
   * Remove mapping
   */
  removeMapping(chartId: string, source: string): void {
    const chart = this.charts.get(chartId);
    if (!chart) return;

    chart.mappings = chart.mappings.filter((m) => m.source !== source);
    this.emit('mapping:removed', { chartId, source });
  }

  /**
   * Apply style preset
   */
  applyStylePreset(chartId: string, presetName: string): void {
    const chart = this.charts.get(chartId);
    const preset = this.presets.get(presetName);

    if (!chart || !preset) return;

    chart.style = { ...preset };
    this.emit('style:applied', { chartId, preset: presetName });
  }

  /**
   * Update style
   */
  updateStyle(chartId: string, style: Partial<ChartStyle>): void {
    const chart = this.charts.get(chartId);
    if (!chart) return;

    chart.style = { ...chart.style, ...style };
    this.emit('style:updated', { chartId, style });
  }

  /**
   * Update data
   */
  updateData(chartId: string, data: Record<string, any>): void {
    const chart = this.charts.get(chartId);
    if (!chart) return;

    chart.data = { ...chart.data, ...data };
    this.emit('data:updated', { chartId });
  }

  /**
   * Apply mappings to data
   */
  applyMappings(chartId: string): Record<string, any> {
    const chart = this.charts.get(chartId);
    if (!chart) return {};

    const mapped = { ...chart.data };

    chart.mappings.forEach((mapping) => {
      if (mapping.source in mapped) {
        const value = mapped[mapping.source];
        mapped[mapping.target] = mapping.transform ? mapping.transform(value) : value;
      }
    });

    return mapped;
  }

  /**
   * Export chart
   */
  exportChart(chartId: string, format: 'json' | 'svg' | 'png'): string | Blob {
    const chart = this.charts.get(chartId);
    if (!chart) return '';

    if (format === 'json') {
      return JSON.stringify(chart, null, 2);
    } else if (format === 'svg') {
      return this.generateSVG(chart);
    } else {
      // PNG would require canvas rendering
      return this.generateSVG(chart);
    }
  }

  /**
   * Generate SVG representation
   */
  private generateSVG(chart: CustomChart): string {
    const width = 800;
    const height = 600;
    const style = chart.style;

    let svg = `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">`;
    svg += `<rect width="${width}" height="${height}" fill="${style.backgroundColor || '#fff'}"/>`;

    // Add title
    svg += `<text x="${width / 2}" y="30" text-anchor="middle" font-size="18" font-weight="bold">${chart.name}</text>`;

    // Add chart type indicator
    svg += `<text x="20" y="60" font-size="12" fill="#666">Type: ${chart.type}</text>`;

    // Add data summary
    const dataKeys = Object.keys(chart.data).slice(0, 3);
    let yPos = 80;
    dataKeys.forEach((key) => {
      svg += `<text x="20" y="${yPos}" font-size="11" fill="#999">${key}: ${JSON.stringify(chart.data[key]).substring(0, 30)}</text>`;
      yPos += 20;
    });

    svg += '</svg>';
    return svg;
  }

  /**
   * Get chart
   */
  getChart(chartId: string): CustomChart | null {
    return this.charts.get(chartId) || null;
  }

  /**
   * Get template
   */
  getTemplate(templateId: string): ChartTemplate | null {
    return this.templates.get(templateId) || null;
  }

  /**
   * Get all templates
   */
  getAllTemplates(): ChartTemplate[] {
    return Array.from(this.templates.values());
  }

  /**
   * Get style preset
   */
  getStylePreset(presetName: string): ChartStyle | null {
    return this.presets.get(presetName) || null;
  }

  /**
   * Get all presets
   */
  getAllPresets(): string[] {
    return Array.from(this.presets.keys());
  }

  /**
   * Duplicate chart
   */
  duplicateChart(sourceId: string, newId: string): CustomChart | null {
    const source = this.charts.get(sourceId);
    if (!source) return null;

    const duplicate: CustomChart = {
      ...source,
      id: newId,
      name: `${source.name} (Copy)`,
      mappings: [...source.mappings],
      style: { ...source.style },
    };

    this.charts.set(newId, duplicate);
    this.emit('chart:duplicated', { sourceId, newId });

    return duplicate;
  }

  /**
   * Remove chart
   */
  removeChart(chartId: string): void {
    this.charts.delete(chartId);
    this.emit('chart:removed', { id: chartId });
  }
}
