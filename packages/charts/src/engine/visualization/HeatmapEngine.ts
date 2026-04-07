/**
 * Heatmap Engine
 * Create heatmaps from data
 *
 * موتور نقشه حرارتی
 * ایجاد نقشه های حرارتی از داده ها
 */

import { EventEmitter } from 'events';

export interface HeatmapPoint {
  x: number;
  y: number;
  value: number;
  metadata?: Record<string, any>;
}

export interface HeatmapData {
  id: string;
  points: HeatmapPoint[];
  width: number;
  height: number;
  minValue?: number;
  maxValue?: number;
  metadata?: Record<string, any>;
}

export interface ColorStop {
  value: number;
  color: string;
}

export interface HeatmapConfig {
  colorStops: ColorStop[];
  smoothing: 'none' | 'gaussian' | 'bilinear';
  radius: number;
  opacity: number;
  interpolation: 'linear' | 'cubic';
}

export class HeatmapEngine extends EventEmitter {
  private heatmaps: Map<string, HeatmapData> = new Map();
  private grids: Map<string, number[][]> = new Map();
  private colorMaps: Map<string, Uint8ClampedArray> = new Map();
  private config: HeatmapConfig;

  constructor() {
    super();
    this.config = {
      colorStops: [
        { value: 0, color: '#0000ff' },
        { value: 0.25, color: '#00ffff' },
        { value: 0.5, color: '#00ff00' },
        { value: 0.75, color: '#ffff00' },
        { value: 1, color: '#ff0000' },
      ],
      smoothing: 'gaussian',
      radius: 50,
      opacity: 0.8,
      interpolation: 'linear',
    };
  }

  /**
   * Load heatmap data
   */
  loadHeatmap(heatmapData: HeatmapData): void {
    this.heatmaps.set(heatmapData.id, heatmapData);
    this.generateGrid(heatmapData.id);
    this.generateColorMap(heatmapData.id);
    this.emit('heatmap:loaded', { id: heatmapData.id });
  }

  /**
   * Generate density grid
   */
  private generateGrid(heatmapId: string): void {
    const heatmap = this.heatmaps.get(heatmapId);
    if (!heatmap) return;

    const grid: number[][] = Array(heatmap.height)
      .fill(null)
      .map(() => Array(heatmap.width).fill(0));

    // Calculate min/max values
    let minValue = heatmap.minValue ?? Infinity;
    let maxValue = heatmap.maxValue ?? -Infinity;

    heatmap.points.forEach((point) => {
      minValue = Math.min(minValue, point.value);
      maxValue = Math.max(maxValue, point.value);
    });

    // Distribute points to grid
    heatmap.points.forEach((point) => {
      const x = Math.floor((point.x / 100) * heatmap.width);
      const y = Math.floor((point.y / 100) * heatmap.height);

      if (x >= 0 && x < heatmap.width && y >= 0 && y < heatmap.height) {
        const normalized = (point.value - minValue) / (maxValue - minValue || 1);
        grid[y][x] = normalized;
      }
    });

    // Apply smoothing
    if (this.config.smoothing === 'gaussian') {
      this.applyGaussianSmoothing(grid, this.config.radius);
    } else if (this.config.smoothing === 'bilinear') {
      this.applyBilinearSmoothing(grid);
    }

    this.grids.set(heatmapId, grid);
    this.emit('grid:generated', { id: heatmapId });
  }

  /**
   * Apply Gaussian smoothing
   */
  private applyGaussianSmoothing(grid: number[][], radius: number): void {
    const height = grid.length;
    const width = grid[0].length;
    const sigma = radius / 3;
    const kernel: number[] = [];

    // Generate Gaussian kernel
    for (let i = -radius; i <= radius; i++) {
      kernel.push(Math.exp(-(i * i) / (2 * sigma * sigma)));
    }

    const sum = kernel.reduce((a, b) => a + b, 0);
    kernel.forEach((_, i) => {
      kernel[i] /= sum;
    });

    // Apply horizontal blur
    const temp: number[][] = grid.map((row) => [...row]);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let value = 0;
        for (let i = -radius; i <= radius; i++) {
          const px = Math.max(0, Math.min(width - 1, x + i));
          value += grid[y][px] * kernel[i + radius];
        }
        temp[y][x] = value;
      }
    }

    // Apply vertical blur
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let value = 0;
        for (let i = -radius; i <= radius; i++) {
          const py = Math.max(0, Math.min(height - 1, y + i));
          value += temp[py][x] * kernel[i + radius];
        }
        grid[y][x] = value;
      }
    }
  }

  /**
   * Apply bilinear smoothing
   */
  private applyBilinearSmoothing(grid: number[][]): void {
    const height = grid.length;
    const width = grid[0].length;
    const temp: number[][] = grid.map((row) => [...row]);

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const avg =
          (grid[y - 1][x - 1] +
            grid[y - 1][x] +
            grid[y - 1][x + 1] +
            grid[y][x - 1] +
            grid[y][x] +
            grid[y][x + 1] +
            grid[y + 1][x - 1] +
            grid[y + 1][x] +
            grid[y + 1][x + 1]) /
          9;
        temp[y][x] = avg;
      }
    }

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        grid[y][x] = temp[y][x];
      }
    }
  }

  /**
   * Generate color map
   */
  private generateColorMap(heatmapId: string): void {
    const grid = this.grids.get(heatmapId);
    if (!grid) return;

    const height = grid.length;
    const width = grid[0].length;
    const colorData = new Uint8ClampedArray(width * height * 4);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const value = grid[y][x];
        const color = this.interpolateColor(value);
        const idx = (y * width + x) * 4;

        colorData[idx] = color.r;
        colorData[idx + 1] = color.g;
        colorData[idx + 2] = color.b;
        colorData[idx + 3] = Math.floor(255 * this.config.opacity);
      }
    }

    this.colorMaps.set(heatmapId, colorData);
    this.emit('colormap:generated', { id: heatmapId });
  }

  /**
   * Interpolate color based on value
   */
  private interpolateColor(value: number): { r: number; g: number; b: number } {
    const stops = this.config.colorStops;
    let stop1 = stops[0];
    let stop2 = stops[stops.length - 1];

    for (let i = 0; i < stops.length - 1; i++) {
      if (value >= stops[i].value && value <= stops[i + 1].value) {
        stop1 = stops[i];
        stop2 = stops[i + 1];
        break;
      }
    }

    const t = (value - stop1.value) / (stop2.value - stop1.value || 1);
    const c1 = this.hexToRgb(stop1.color);
    const c2 = this.hexToRgb(stop2.color);

    return {
      r: Math.floor(c1.r + (c2.r - c1.r) * t),
      g: Math.floor(c1.g + (c2.g - c1.g) * t),
      b: Math.floor(c1.b + (c2.b - c1.b) * t),
    };
  }

  /**
   * Convert hex to RGB
   */
  private hexToRgb(hex: string): { r: number; g: number; b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 0, g: 0, b: 0 };
  }

  /**
   * Get grid
   */
  getGrid(heatmapId: string): number[][] | null {
    return this.grids.get(heatmapId) || null;
  }

  /**
   * Get color map
   */
  getColorMap(heatmapId: string): Uint8ClampedArray | null {
    return this.colorMaps.get(heatmapId) || null;
  }

  /**
   * Get heatmap
   */
  getHeatmap(heatmapId: string): HeatmapData | null {
    return this.heatmaps.get(heatmapId) || null;
  }

  /**
   * Set color stops
   */
  setColorStops(stops: ColorStop[]): void {
    this.config.colorStops = stops;
    this.heatmaps.forEach((_, id) => {
      this.generateColorMap(id);
    });
    this.emit('colorstops:updated', stops);
  }

  /**
   * Set smoothing
   */
  setSmoothing(smoothing: 'none' | 'gaussian' | 'bilinear'): void {
    this.config.smoothing = smoothing;
    this.heatmaps.forEach((_, id) => {
      this.generateGrid(id);
      this.generateColorMap(id);
    });
    this.emit('smoothing:updated', smoothing);
  }

  /**
   * Generate legend
   */
  generateLegend(heatmapId: string, steps: number = 10): Array<{ value: number; color: string }> {
    const legend: Array<{ value: number; color: string }> = [];

    for (let i = 0; i <= steps; i++) {
      const value = i / steps;
      const color = this.interpolateColor(value);
      legend.push({
        value,
        color: `rgb(${color.r},${color.g},${color.b})`,
      });
    }

    return legend;
  }

  /**
   * Remove heatmap
   */
  removeHeatmap(heatmapId: string): void {
    this.heatmaps.delete(heatmapId);
    this.grids.delete(heatmapId);
    this.colorMaps.delete(heatmapId);
    this.emit('heatmap:removed', { id: heatmapId });
  }
}
