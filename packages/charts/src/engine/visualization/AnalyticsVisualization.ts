/**
 * Analytics Visualization Engine
 * Advanced visualization for analytics results
 */

/**
 * Visualization type
 */
export type VisualizationType =
  | 'heatmap'
  | 'scatter'
  | 'bubble'
  | 'sankey'
  | 'sunburst'
  | 'treemap';

/**
 * Visualization configuration
 */
export interface VisualizationConfig {
  type: VisualizationType;
  width: number;
  height: number;
  margin: { top: number; right: number; bottom: number; left: number };
  colorScheme: string[];
  interactive: boolean;
  responsive: boolean;
}

/**
 * Visualization data point
 */
export interface DataPoint {
  x: number;
  y: number;
  value?: number;
  label?: string;
  category?: string;
  color?: string;
}

/**
 * Rendered visualization
 */
export interface RenderedVisualization {
  id: string;
  type: VisualizationType;
  svg: string;
  data: DataPoint[];
  config: VisualizationConfig;
  timestamp: number;
}

/**
 * Analytics Visualization Engine
 * Renders analytics data as interactive visualizations
 */
export class AnalyticsVisualization {
  private visualizations: Map<string, RenderedVisualization> = new Map();

  /**
   * Create heatmap visualization
   */
  createHeatmap(
    data: Record<string, number[]>,
    config: Partial<VisualizationConfig> = {}
  ): RenderedVisualization {
    const id = `viz-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const fullConfig: VisualizationConfig = {
      type: 'heatmap',
      width: 800,
      height: 600,
      margin: { top: 20, right: 20, bottom: 20, left: 20 },
      colorScheme: ['#0000ff', '#00ffff', '#00ff00', '#ffff00', '#ff0000'],
      interactive: true,
      responsive: true,
      ...config,
    };

    const dataPoints: DataPoint[] = [];
    const keys = Object.keys(data);
    const maxValue = Math.max(...keys.flatMap((k) => data[k]));

    for (let i = 0; i < keys.length; i++) {
      for (let j = 0; j < data[keys[i]].length; j++) {
        const value = data[keys[i]][j];
        const colorIndex = Math.floor((value / maxValue) * (fullConfig.colorScheme.length - 1));
        dataPoints.push({
          x: j,
          y: i,
          value,
          label: `${keys[i]}-${j}`,
          color: fullConfig.colorScheme[colorIndex],
        });
      }
    }

    const svg = this.renderHeatmapSVG(dataPoints, fullConfig);

    const visualization: RenderedVisualization = {
      id,
      type: 'heatmap',
      svg,
      data: dataPoints,
      config: fullConfig,
      timestamp: Date.now(),
    };

    this.visualizations.set(id, visualization);
    return visualization;
  }

  /**
   * Create scatter plot visualization
   */
  createScatterPlot(
    data: DataPoint[],
    config: Partial<VisualizationConfig> = {}
  ): RenderedVisualization {
    const id = `viz-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const fullConfig: VisualizationConfig = {
      type: 'scatter',
      width: 800,
      height: 600,
      margin: { top: 20, right: 20, bottom: 20, left: 20 },
      colorScheme: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd'],
      interactive: true,
      responsive: true,
      ...config,
    };

    const svg = this.renderScatterSVG(data, fullConfig);

    const visualization: RenderedVisualization = {
      id,
      type: 'scatter',
      svg,
      data,
      config: fullConfig,
      timestamp: Date.now(),
    };

    this.visualizations.set(id, visualization);
    return visualization;
  }

  /**
   * Create bubble chart visualization
   */
  createBubbleChart(
    data: DataPoint[],
    config: Partial<VisualizationConfig> = {}
  ): RenderedVisualization {
    const id = `viz-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const fullConfig: VisualizationConfig = {
      type: 'bubble',
      width: 800,
      height: 600,
      margin: { top: 20, right: 20, bottom: 20, left: 20 },
      colorScheme: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd'],
      interactive: true,
      responsive: true,
      ...config,
    };

    const svg = this.renderBubbleSVG(data, fullConfig);

    const visualization: RenderedVisualization = {
      id,
      type: 'bubble',
      svg,
      data,
      config: fullConfig,
      timestamp: Date.now(),
    };

    this.visualizations.set(id, visualization);
    return visualization;
  }

  /**
   * Create Sankey diagram
   */
  createSankey(
    nodes: Array<{ id: string; label: string }>,
    links: Array<{ source: string; target: string; value: number }>,
    config: Partial<VisualizationConfig> = {}
  ): RenderedVisualization {
    const id = `viz-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const fullConfig: VisualizationConfig = {
      type: 'sankey',
      width: 800,
      height: 600,
      margin: { top: 20, right: 20, bottom: 20, left: 20 },
      colorScheme: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd'],
      interactive: true,
      responsive: true,
      ...config,
    };

    const dataPoints = nodes.map((n, i) => ({
      x: (i % 5) * 150,
      y: Math.floor(i / 5) * 150,
      label: n.label,
      value: links.filter((l) => l.source === n.id).reduce((sum, l) => sum + l.value, 0),
    }));

    const svg = this.renderSankeySVG(nodes, links, fullConfig);

    const visualization: RenderedVisualization = {
      id,
      type: 'sankey',
      svg,
      data: dataPoints,
      config: fullConfig,
      timestamp: Date.now(),
    };

    this.visualizations.set(id, visualization);
    return visualization;
  }

  /**
   * Create sunburst diagram
   */
  createSunburst(
    hierarchyData: Record<string, Record<string, number>>,
    config: Partial<VisualizationConfig> = {}
  ): RenderedVisualization {
    const id = `viz-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const fullConfig: VisualizationConfig = {
      type: 'sunburst',
      width: 800,
      height: 800,
      margin: { top: 20, right: 20, bottom: 20, left: 20 },
      colorScheme: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd'],
      interactive: true,
      responsive: true,
      ...config,
    };

    const dataPoints: DataPoint[] = [];
    let colorIndex = 0;

    for (const category in hierarchyData) {
      for (const item in hierarchyData[category]) {
        dataPoints.push({
          x: Math.random() * fullConfig.width,
          y: Math.random() * fullConfig.height,
          value: hierarchyData[category][item],
          label: item,
          category,
          color: fullConfig.colorScheme[colorIndex % fullConfig.colorScheme.length],
        });
        colorIndex++;
      }
    }

    const svg = this.renderSunburstSVG(hierarchyData, fullConfig);

    const visualization: RenderedVisualization = {
      id,
      type: 'sunburst',
      svg,
      data: dataPoints,
      config: fullConfig,
      timestamp: Date.now(),
    };

    this.visualizations.set(id, visualization);
    return visualization;
  }

  /**
   * Create treemap visualization
   */
  createTreemap(
    hierarchyData: Record<string, Record<string, number>>,
    config: Partial<VisualizationConfig> = {}
  ): RenderedVisualization {
    const id = `viz-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const fullConfig: VisualizationConfig = {
      type: 'treemap',
      width: 800,
      height: 600,
      margin: { top: 20, right: 20, bottom: 20, left: 20 },
      colorScheme: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd'],
      interactive: true,
      responsive: true,
      ...config,
    };

    const dataPoints: DataPoint[] = [];
    let colorIndex = 0;

    for (const category in hierarchyData) {
      for (const item in hierarchyData[category]) {
        dataPoints.push({
          x: Math.random() * fullConfig.width,
          y: Math.random() * fullConfig.height,
          value: hierarchyData[category][item],
          label: item,
          category,
          color: fullConfig.colorScheme[colorIndex % fullConfig.colorScheme.length],
        });
        colorIndex++;
      }
    }

    const svg = this.renderTreemapSVG(hierarchyData, fullConfig);

    const visualization: RenderedVisualization = {
      id,
      type: 'treemap',
      svg,
      data: dataPoints,
      config: fullConfig,
      timestamp: Date.now(),
    };

    this.visualizations.set(id, visualization);
    return visualization;
  }

  /**
   * Render heatmap SVG
   */
  private renderHeatmapSVG(data: DataPoint[], config: VisualizationConfig): string {
    const cellSize = 20;
    let svg = `<svg width="${config.width}" height="${config.height}" xmlns="http://www.w3.org/2000/svg">`;

    for (const point of data) {
      const x = config.margin.left + point.x * cellSize;
      const y = config.margin.top + point.y * cellSize;
      svg += `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" fill="${point.color}" stroke="#ccc"/>`;
    }

    svg += '</svg>';
    return svg;
  }

  /**
   * Render scatter plot SVG
   */
  private renderScatterSVG(data: DataPoint[], config: VisualizationConfig): string {
    const maxX = Math.max(...data.map((d) => d.x));
    const maxY = Math.max(...data.map((d) => d.y));
    const scaleX = (config.width - config.margin.left - config.margin.right) / maxX;
    const scaleY = (config.height - config.margin.top - config.margin.bottom) / maxY;

    let svg = `<svg width="${config.width}" height="${config.height}" xmlns="http://www.w3.org/2000/svg">`;

    for (const point of data) {
      const x = config.margin.left + point.x * scaleX;
      const y = config.height - config.margin.bottom - point.y * scaleY;
      const radius = 5;
      svg += `<circle cx="${x}" cy="${y}" r="${radius}" fill="${point.color || '#1f77b4'}" opacity="0.7"/>`;
    }

    svg += '</svg>';
    return svg;
  }

  /**
   * Render bubble chart SVG
   */
  private renderBubbleSVG(data: DataPoint[], config: VisualizationConfig): string {
    const maxX = Math.max(...data.map((d) => d.x));
    const maxY = Math.max(...data.map((d) => d.y));
    const maxValue = Math.max(...data.map((d) => d.value || 1));
    const scaleX = (config.width - config.margin.left - config.margin.right) / maxX;
    const scaleY = (config.height - config.margin.top - config.margin.bottom) / maxY;

    let svg = `<svg width="${config.width}" height="${config.height}" xmlns="http://www.w3.org/2000/svg">`;

    for (const point of data) {
      const x = config.margin.left + point.x * scaleX;
      const y = config.height - config.margin.bottom - point.y * scaleY;
      const radius = ((point.value || 1) / maxValue) * 30 + 5;
      svg += `<circle cx="${x}" cy="${y}" r="${radius}" fill="${point.color || '#1f77b4'}" opacity="0.6"/>`;
    }

    svg += '</svg>';
    return svg;
  }

  /**
   * Render Sankey SVG
   */
  private renderSankeySVG(
    nodes: Array<{ id: string; label: string }>,
    links: Array<{ source: string; target: string; value: number }>,
    config: VisualizationConfig
  ): string {
    let svg = `<svg width="${config.width}" height="${config.height}" xmlns="http://www.w3.org/2000/svg">`;

    // Draw links
    for (const link of links) {
      const sourceIndex = nodes.findIndex((n) => n.id === link.source);
      const targetIndex = nodes.findIndex((n) => n.id === link.target);
      const x1 = config.margin.left + 50;
      const y1 = config.margin.top + sourceIndex * 50;
      const x2 = config.width - config.margin.right - 50;
      const y2 = config.margin.top + targetIndex * 50;
      const width = Math.max(1, link.value / 10);
      svg += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#999" stroke-width="${width}" opacity="0.5"/>`;
    }

    // Draw nodes
    for (let i = 0; i < nodes.length; i++) {
      const x = config.margin.left + 50;
      const y = config.margin.top + i * 50;
      svg += `<circle cx="${x}" cy="${y}" r="10" fill="${config.colorScheme[i % config.colorScheme.length]}"/>`;
      svg += `<text x="${x + 20}" y="${y + 5}" font-size="12">${nodes[i].label}</text>`;
    }

    svg += '</svg>';
    return svg;
  }

  /**
   * Render sunburst SVG
   */
  private renderSunburstSVG(
    hierarchyData: Record<string, Record<string, number>>,
    config: VisualizationConfig
  ): string {
    const centerX = config.width / 2;
    const centerY = config.height / 2;
    const radius = Math.min(config.width, config.height) / 2 - 20;

    let svg = `<svg width="${config.width}" height="${config.height}" xmlns="http://www.w3.org/2000/svg">`;

    let angle = 0;
    let colorIndex = 0;

    for (const category in hierarchyData) {
      const items = Object.keys(hierarchyData[category]);
      const angleSlice = (2 * Math.PI) / items.length;

      for (let i = 0; i < items.length; i++) {
        const startAngle = angle + i * angleSlice;
        const endAngle = startAngle + angleSlice;
        const x1 = centerX + radius * Math.cos(startAngle);
        const y1 = centerY + radius * Math.sin(startAngle);
        const x2 = centerX + radius * Math.cos(endAngle);
        const y2 = centerY + radius * Math.sin(endAngle);

        svg += `<path d="M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z" fill="${config.colorScheme[colorIndex % config.colorScheme.length]}" stroke="white"/>`;
        colorIndex++;
      }

      angle += (2 * Math.PI) / Object.keys(hierarchyData).length;
    }

    svg += '</svg>';
    return svg;
  }

  /**
   * Render treemap SVG
   */
  private renderTreemapSVG(
    hierarchyData: Record<string, Record<string, number>>,
    config: VisualizationConfig
  ): string {
    let svg = `<svg width="${config.width}" height="${config.height}" xmlns="http://www.w3.org/2000/svg">`;

    const cellWidth = (config.width - config.margin.left - config.margin.right) / 5;
    const cellHeight = (config.height - config.margin.top - config.margin.bottom) / 5;

    let row = 0,
      col = 0;
    let colorIndex = 0;

    for (const category in hierarchyData) {
      for (const item in hierarchyData[category]) {
        const x = config.margin.left + col * cellWidth;
        const y = config.margin.top + row * cellHeight;

        svg += `<rect x="${x}" y="${y}" width="${cellWidth}" height="${cellHeight}" fill="${config.colorScheme[colorIndex % config.colorScheme.length]}" stroke="white" stroke-width="2"/>`;
        svg += `<text x="${x + 10}" y="${y + 20}" font-size="12" fill="white">${item}</text>`;

        col++;
        if (col >= 5) {
          col = 0;
          row++;
        }
        colorIndex++;
      }
    }

    svg += '</svg>';
    return svg;
  }

  /**
   * Get visualization
   */
  getVisualization(vizId: string): RenderedVisualization | undefined {
    return this.visualizations.get(vizId);
  }

  /**
   * List all visualizations
   */
  listVisualizations(): RenderedVisualization[] {
    return Array.from(this.visualizations.values());
  }

  /**
   * Export visualization as SVG
   */
  exportSVG(vizId: string): string | undefined {
    const viz = this.visualizations.get(vizId);
    return viz?.svg;
  }

  /**
   * Delete visualization
   */
  deleteVisualization(vizId: string): boolean {
    return this.visualizations.delete(vizId);
  }
}
