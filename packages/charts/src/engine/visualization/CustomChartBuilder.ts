/**
 * Custom Chart Builder
 * Allows users to create custom charts with drag-and-drop, templates, and styling
 */

export type ChartType =
  | 'line'
  | 'bar'
  | 'scatter'
  | 'pie'
  | 'area'
  | 'bubble'
  | 'heatmap'
  | 'network'
  | 'timeline'
  | 'custom';

export interface ChartTemplate {
  id: string;
  name: string;
  type: ChartType;
  description: string;
  config: Record<string, unknown>;
  preview?: string;
}

export interface DataMapping {
  xAxis?: string;
  yAxis?: string;
  series?: string;
  label?: string;
  value?: string;
  color?: string;
  size?: string;
}

export interface ChartStyle {
  colors?: string[];
  fontSize?: number;
  fontFamily?: string;
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  padding?: number;
  margin?: number;
  opacity?: number;
  [key: string]: unknown;
}

export interface CustomChartConfig {
  id: string;
  name: string;
  type: ChartType;
  data: Record<string, unknown>[];
  mapping: DataMapping;
  style: ChartStyle;
  options?: Record<string, unknown>;
}

export interface ChartExport {
  format: 'json' | 'svg' | 'png' | 'csv';
  data: unknown;
}

/**
 * CustomChartBuilder - Advanced custom chart creation
 */
export class CustomChartBuilder {
  private templates: Map<string, ChartTemplate> = new Map();
  private charts: Map<string, CustomChartConfig> = new Map();
  private defaultTemplates: ChartTemplate[] = [];

  constructor() {
    this.initializeDefaultTemplates();
  }

  /**
   * Initialize default chart templates
   */
  private initializeDefaultTemplates(): void {
    this.defaultTemplates = [
      {
        id: 'line-basic',
        name: 'Basic Line Chart',
        type: 'line',
        description: 'Simple line chart for time series data',
        config: {
          showGrid: true,
          showLegend: true,
          showTooltip: true,
          smooth: false,
        },
      },
      {
        id: 'bar-grouped',
        name: 'Grouped Bar Chart',
        type: 'bar',
        description: 'Grouped bar chart for comparing categories',
        config: {
          orientation: 'vertical',
          grouped: true,
          showLegend: true,
          showValues: true,
        },
      },
      {
        id: 'pie-donut',
        name: 'Donut Chart',
        type: 'pie',
        description: 'Donut chart for showing proportions',
        config: {
          innerRadius: 0.4,
          showLegend: true,
          showLabels: true,
          showPercentage: true,
        },
      },
      {
        id: 'scatter-bubble',
        name: 'Bubble Chart',
        type: 'bubble',
        description: 'Bubble chart for three-dimensional data',
        config: {
          showGrid: true,
          showLegend: true,
          minBubbleSize: 5,
          maxBubbleSize: 50,
        },
      },
      {
        id: 'area-stacked',
        name: 'Stacked Area Chart',
        type: 'area',
        description: 'Stacked area chart for cumulative data',
        config: {
          stacked: true,
          showGrid: true,
          showLegend: true,
          opacity: 0.7,
        },
      },
    ];

    for (const template of this.defaultTemplates) {
      this.templates.set(template.id, template);
    }
  }

  /**
   * Get template by ID
   */
  getTemplate(templateId: string): ChartTemplate | undefined {
    return this.templates.get(templateId);
  }

  /**
   * Get all templates
   */
  getAllTemplates(): ChartTemplate[] {
    return Array.from(this.templates.values());
  }

  /**
   * Get templates by type
   */
  getTemplatesByType(type: ChartType): ChartTemplate[] {
    return Array.from(this.templates.values()).filter((t) => t.type === type);
  }

  /**
   * Create chart from template
   */
  createFromTemplate(
    chartId: string,
    templateId: string,
    data: Record<string, unknown>[],
    mapping: DataMapping
  ): CustomChartConfig {
    const template = this.getTemplate(templateId);
    if (!template) {
      throw new Error(`Template not found: ${templateId}`);
    }

    const config: CustomChartConfig = {
      id: chartId,
      name: template.name,
      type: template.type,
      data,
      mapping,
      style: this.getDefaultStyle(),
      options: template.config,
    };

    this.charts.set(chartId, config);
    return config;
  }

  /**
   * Create custom chart
   */
  createChart(
    chartId: string,
    type: ChartType,
    data: Record<string, unknown>[],
    mapping: DataMapping
  ): CustomChartConfig {
    const config: CustomChartConfig = {
      id: chartId,
      name: `Custom ${type} Chart`,
      type,
      data,
      mapping,
      style: this.getDefaultStyle(),
      options: {},
    };

    this.charts.set(chartId, config);
    return config;
  }

  /**
   * Get default style
   */
  private getDefaultStyle(): ChartStyle {
    return {
      colors: [
        '#1f77b4',
        '#ff7f0e',
        '#2ca02c',
        '#d62728',
        '#9467bd',
        '#8c564b',
        '#e377c2',
        '#7f7f7f',
        '#bcbd22',
        '#17becf',
      ],
      fontSize: 12,
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#ffffff',
      borderColor: '#cccccc',
      borderWidth: 1,
      padding: 10,
      margin: 10,
      opacity: 1,
    };
  }

  /**
   * Get chart by ID
   */
  getChart(chartId: string): CustomChartConfig | undefined {
    return this.charts.get(chartId);
  }

  /**
   * Update chart data
   */
  updateChartData(chartId: string, data: Record<string, unknown>[]): void {
    const chart = this.charts.get(chartId);
    if (chart) {
      chart.data = data;
    }
  }

  /**
   * Update data mapping
   */
  updateDataMapping(chartId: string, mapping: Partial<DataMapping>): void {
    const chart = this.charts.get(chartId);
    if (chart) {
      chart.mapping = { ...chart.mapping, ...mapping };
    }
  }

  /**
   * Update chart style
   */
  updateChartStyle(chartId: string, style: Partial<ChartStyle>): void {
    const chart = this.charts.get(chartId);
    if (chart) {
      chart.style = { ...chart.style, ...style };
    }
  }

  /**
   * Update chart options
   */
  updateChartOptions(chartId: string, options: Record<string, unknown>): void {
    const chart = this.charts.get(chartId);
    if (chart) {
      chart.options = { ...chart.options, ...options };
    }
  }

  /**
   * Validate chart configuration
   */
  validateChart(chartId: string): { valid: boolean; errors: string[] } {
    const chart = this.charts.get(chartId);
    const errors: string[] = [];

    if (!chart) {
      errors.push(`Chart not found: ${chartId}`);
      return { valid: false, errors };
    }

    if (!chart.data || chart.data.length === 0) {
      errors.push('Chart data is empty');
    }

    if (!chart.mapping || Object.keys(chart.mapping).length === 0) {
      errors.push('Data mapping is not configured');
    }

    if (!chart.style || Object.keys(chart.style).length === 0) {
      errors.push('Chart style is not configured');
    }

    return { valid: errors.length === 0, errors };
  }

  /**
   * Clone chart
   */
  cloneChart(sourceId: string, newId: string): CustomChartConfig | undefined {
    const source = this.charts.get(sourceId);
    if (!source) return undefined;

    const cloned: CustomChartConfig = {
      ...source,
      id: newId,
      data: [...source.data],
      mapping: { ...source.mapping },
      style: { ...source.style },
      options: { ...source.options },
    };

    this.charts.set(newId, cloned);
    return cloned;
  }

  /**
   * Delete chart
   */
  deleteChart(chartId: string): boolean {
    return this.charts.delete(chartId);
  }

  /**
   * Get all charts
   */
  getAllCharts(): CustomChartConfig[] {
    return Array.from(this.charts.values());
  }

  /**
   * Get charts by type
   */
  getChartsByType(type: ChartType): CustomChartConfig[] {
    return Array.from(this.charts.values()).filter((c) => c.type === type);
  }

  /**
   * Export chart
   */
  exportChart(chartId: string, format: 'json' | 'csv'): ChartExport | undefined {
    const chart = this.charts.get(chartId);
    if (!chart) return undefined;

    if (format === 'json') {
      return {
        format: 'json',
        data: chart,
      };
    }

    if (format === 'csv') {
      const csv = this.convertToCSV(chart);
      return {
        format: 'csv',
        data: csv,
      };
    }

    return undefined;
  }

  /**
   * Convert chart data to CSV
   */
  private convertToCSV(chart: CustomChartConfig): string {
    if (chart.data.length === 0) return '';

    const headers = Object.keys(chart.data[0]);
    const rows = chart.data.map((row) =>
      headers.map((header) => {
        const value = row[header];
        return typeof value === 'string' && value.includes(',') ? `"${value}"` : value;
      })
    );

    return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  }

  /**
   * Import chart
   */
  importChart(config: CustomChartConfig): void {
    this.charts.set(config.id, config);
  }

  /**
   * Get chart statistics
   */
  getStatistics(): Record<string, number> {
    const charts = Array.from(this.charts.values());
    const typeCount = new Map<ChartType, number>();

    for (const chart of charts) {
      typeCount.set(chart.type, (typeCount.get(chart.type) || 0) + 1);
    }

    return {
      totalCharts: charts.length,
      totalTemplates: this.templates.size,
      lineCharts: typeCount.get('line') || 0,
      barCharts: typeCount.get('bar') || 0,
      pieCharts: typeCount.get('pie') || 0,
      scatterCharts: typeCount.get('scatter') || 0,
      areaCharts: typeCount.get('area') || 0,
      bubbleCharts: typeCount.get('bubble') || 0,
      customCharts: typeCount.get('custom') || 0,
    };
  }

  /**
   * Clear all charts
   */
  clear(): void {
    this.charts.clear();
  }
}
