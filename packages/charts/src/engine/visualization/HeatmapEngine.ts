/**
 * Heatmap Engine
 * Creates heatmaps from data with color mapping, density calculation, and smoothing
 */

export interface HeatmapPoint {
  x: number;
  y: number;
  value: number;
}

export interface HeatmapConfig {
  width: number;
  height: number;
  cellSize: number;
  smoothing?: number;
  colorScheme?: 'viridis' | 'plasma' | 'inferno' | 'magma' | 'custom';
  customColors?: string[];
}

export interface HeatmapCell {
  x: number;
  y: number;
  value: number;
  color: string;
  density: number;
}

export interface HeatmapData {
  cells: HeatmapCell[];
  min: number;
  max: number;
  mean: number;
}

export interface ColorMap {
  [key: number]: string;
}

/**
 * HeatmapEngine - Advanced heatmap generation and rendering
 */
export class HeatmapEngine {
  private config: HeatmapConfig;
  private points: HeatmapPoint[] = [];
  private grid: Map<string, number> = new Map();
  private colorMap: ColorMap = {};

  constructor(config: HeatmapConfig) {
    this.config = {
      smoothing: 1,
      colorScheme: 'viridis',
      ...config,
    };
    this.initializeColorMap();
  }

  /**
   * Initialize color map based on scheme
   */
  private initializeColorMap(): void {
    const scheme = this.config.colorScheme;

    if (scheme === 'custom' && this.config.customColors) {
      this.generateCustomColorMap(this.config.customColors);
    } else {
      this.generateColorScheme(scheme);
    }
  }

  /**
   * Generate standard color scheme
   */
  private generateColorScheme(scheme: string): void {
    const schemes: Record<string, string[]> = {
      viridis: [
        '#440154',
        '#482878',
        '#3e4a89',
        '#31688e',
        '#26828e',
        '#35b779',
        '#6ece58',
        '#b5de2b',
        '#fde724',
      ],
      plasma: [
        '#0d0887',
        '#46039f',
        '#7201a8',
        '#9c179e',
        '#bd3786',
        '#d8576b',
        '#ed7953',
        '#fb9f3a',
        '#fdca26',
        '#f0f921',
      ],
      inferno: [
        '#000004',
        '#170b3b',
        '#420a68',
        '#932667',
        '#dd513a',
        '#f37819',
        '#fcb040',
        '#ffea46',
        '#ffffd2',
      ],
      magma: [
        '#000004',
        '#140e4b',
        '#3b0f70',
        '#561b7e',
        '#7e2e84',
        '#a12e7a',
        '#c44e52',
        '#e16462',
        '#fd9668',
        '#fde724',
      ],
    };

    const colors = schemes[scheme] || schemes.viridis;
    this.generateCustomColorMap(colors);
  }

  /**
   * Generate custom color map
   */
  private generateCustomColorMap(colors: string[]): void {
    this.colorMap = {};
    for (let i = 0; i < colors.length; i++) {
      const key = i / (colors.length - 1);
      this.colorMap[key] = colors[i];
    }
  }

  /**
   * Add data points
   */
  addPoints(points: HeatmapPoint[]): void {
    this.points.push(...points);
    this.updateGrid();
  }

  /**
   * Clear all points
   */
  clearPoints(): void {
    this.points = [];
    this.grid.clear();
  }

  /**
   * Update grid with current points
   */
  private updateGrid(): void {
    this.grid.clear();

    for (const point of this.points) {
      const cellX = Math.floor(point.x / this.config.cellSize);
      const cellY = Math.floor(point.y / this.config.cellSize);
      const key = `${cellX},${cellY}`;

      const current = this.grid.get(key) || 0;
      this.grid.set(key, current + point.value);
    }
  }

  /**
   * Generate heatmap data
   */
  generateHeatmap(): HeatmapData {
    const cells: HeatmapCell[] = [];
    let min = Infinity;
    let max = -Infinity;
    let sum = 0;
    let count = 0;

    // Calculate statistics
    for (const value of this.grid.values()) {
      min = Math.min(min, value);
      max = Math.max(max, value);
      sum += value;
      count++;
    }

    const mean = count > 0 ? sum / count : 0;
    const range = max - min || 1;

    // Generate cells
    for (const [key, value] of this.grid.entries()) {
      const [x, y] = key.split(',').map(Number);
      const normalized = (value - min) / range;
      const color = this.getColor(normalized);
      const density = this.calculateDensity(x, y);

      cells.push({
        x: x * this.config.cellSize,
        y: y * this.config.cellSize,
        value,
        color,
        density,
      });
    }

    // Apply smoothing if configured
    if (this.config.smoothing && this.config.smoothing > 1) {
      this.applySmoothingFilter(cells);
    }

    return { cells, min, max, mean };
  }

  /**
   * Get color for normalized value
   */
  private getColor(normalized: number): string {
    normalized = Math.max(0, Math.min(1, normalized));

    let closestKey = 0;
    let closestDist = 1;

    for (const key of Object.keys(this.colorMap).map(Number)) {
      const dist = Math.abs(key - normalized);
      if (dist < closestDist) {
        closestDist = dist;
        closestKey = key;
      }
    }

    return this.colorMap[closestKey];
  }

  /**
   * Calculate density around a cell
   */
  private calculateDensity(x: number, y: number): number {
    let density = 0;
    const radius = 2;

    for (let dx = -radius; dx <= radius; dx++) {
      for (let dy = -radius; dy <= radius; dy++) {
        const key = `${x + dx},${y + dy}`;
        const value = this.grid.get(key) || 0;
        const distance = Math.sqrt(dx * dx + dy * dy) || 1;
        density += value / distance;
      }
    }

    return density;
  }

  /**
   * Apply smoothing filter
   */
  private applySmoothingFilter(cells: HeatmapCell[]): void {
    const cellMap = new Map<string, HeatmapCell>();
    for (const cell of cells) {
      cellMap.set(`${cell.x},${cell.y}`, cell);
    }

    for (const cell of cells) {
      let sum = cell.value;
      let count = 1;

      for (let dx = -this.config.cellSize; dx <= this.config.cellSize; dx += this.config.cellSize) {
        for (
          let dy = -this.config.cellSize;
          dy <= this.config.cellSize;
          dy += this.config.cellSize
        ) {
          if (dx === 0 && dy === 0) continue;

          const key = `${cell.x + dx},${cell.y + dy}`;
          const neighbor = cellMap.get(key);
          if (neighbor) {
            sum += neighbor.value;
            count++;
          }
        }
      }

      cell.value = sum / count;
    }
  }

  /**
   * Get heatmap statistics
   */
  getStatistics(): Record<string, number> {
    const values = Array.from(this.grid.values());

    if (values.length === 0) {
      return {
        cellCount: 0,
        pointCount: 0,
        min: 0,
        max: 0,
        mean: 0,
        median: 0,
        stdDev: 0,
      };
    }

    const sorted = [...values].sort((a, b) => a - b);
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    const mean = values.reduce((a, b) => a + b) / values.length;
    const median = sorted[Math.floor(sorted.length / 2)];

    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    const stdDev = Math.sqrt(variance);

    return {
      cellCount: this.grid.size,
      pointCount: this.points.length,
      min,
      max,
      mean,
      median,
      stdDev,
    };
  }

  /**
   * Get color map
   */
  getColorMap(): ColorMap {
    return { ...this.colorMap };
  }

  /**
   * Set custom color scheme
   */
  setColorScheme(
    scheme: 'viridis' | 'plasma' | 'inferno' | 'magma' | 'custom',
    colors?: string[]
  ): void {
    if (scheme === 'custom' && colors) {
      this.generateCustomColorMap(colors);
    } else {
      this.generateColorScheme(scheme);
    }
  }

  /**
   * Export heatmap as image data
   */
  exportAsImageData(width: number, height: number): ImageData {
    const canvas = new OffscreenCanvas(width, height);
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Failed to get canvas context');
    }

    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;

    const heatmap = this.generateHeatmap();

    for (const cell of heatmap.cells) {
      const x = Math.floor((cell.x / this.config.width) * width);
      const y = Math.floor((cell.y / this.config.height) * height);

      if (x >= 0 && x < width && y >= 0 && y < height) {
        const idx = (y * width + x) * 4;
        const rgb = this.hexToRgb(cell.color);

        data[idx] = rgb[0];
        data[idx + 1] = rgb[1];
        data[idx + 2] = rgb[2];
        data[idx + 3] = 255;
      }
    }

    return imageData;
  }

  /**
   * Convert hex color to RGB
   */
  private hexToRgb(hex: string): [number, number, number] {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
      : [0, 0, 0];
  }
}
