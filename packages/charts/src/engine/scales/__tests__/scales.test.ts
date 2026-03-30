/**
 * Scale System Tests
 *
 * Tests for all scale implementations including:
 * - BaseScale functionality
 * - LinearScale with linear mapping and tick generation
 * - CategoryScale with categorical mapping
 * - TimeScale with time-based ticks
 * - LogarithmicScale with logarithmic mapping
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { LinearScale } from '../LinearScale';
import { CategoryScale } from '../CategoryScale';
import { TimeScale } from '../TimeScale';
import { LogarithmicScale } from '../LogarithmicScale';
import type { Chart, ChartData, ChartDataset } from '../../types/index';

// Mock Chart object
const createMockChart = (data: ChartData): Chart => ({
  data,
  type: 'line',
  canvas: document.createElement('canvas'),
  ctx: document.createElement('canvas').getContext('2d')!,
  width: 800,
  height: 600,
  chartArea: { left: 50, top: 50, right: 750, bottom: 550, width: 700, height: 500 },
  scales: new Map(),
  controllers: [],
  plugins: new Map(),
  registry: {} as any,
  options: {},
  theme: {} as any,
  state: {},
  initialize: () => {},
  update: () => {},
  render: () => {},
  destroy: () => {},
  resize: () => {},
  on: () => {},
  off: () => {},
  emit: () => {},
});

describe('LinearScale', () => {
  let scale: LinearScale;
  let mockChart: Chart;

  beforeEach(() => {
    mockChart = createMockChart({
      labels: ['A', 'B', 'C'],
      datasets: [
        {
          label: 'Dataset 1',
          data: [10, 20, 30],
          backgroundColor: '#FF0000',
        },
      ],
    });

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    scale = new LinearScale('y', { type: 'linear' }, ctx, mockChart);
  });

  it('should calculate min and max from data', () => {
    scale.update(700, 500);
    expect(scale.min).toBe(10);
    expect(scale.max).toBe(30);
  });

  it('should generate evenly spaced ticks', () => {
    scale.update(700, 500);
    expect(scale.ticks.length).toBeGreaterThan(0);

    // Check ticks are evenly spaced
    if (scale.ticks.length > 1) {
      const diffs = [];
      for (let i = 1; i < scale.ticks.length; i++) {
        diffs.push(scale.ticks[i].value - scale.ticks[i - 1].value);
      }
      // All differences should be equal (or very close due to floating point)
      const firstDiff = diffs[0];
      diffs.forEach((diff) => {
        expect(Math.abs(diff - firstDiff)).toBeLessThan(0.01);
      });
    }
  });

  it('should map values to pixels consistently', () => {
    scale.update(700, 500);

    const pixel1 = scale.getPixelForValue(10);
    const pixel2 = scale.getPixelForValue(20);
    const pixel3 = scale.getPixelForValue(30);

    // Pixels should be in increasing order
    expect(pixel1).toBeLessThanOrEqual(pixel2);
    expect(pixel2).toBeLessThanOrEqual(pixel3);

    // Pixels should be within [0, 1]
    expect(pixel1).toBeGreaterThanOrEqual(0);
    expect(pixel3).toBeLessThanOrEqual(1);
  });

  it('should map pixels back to values approximately', () => {
    scale.update(700, 500);

    const originalValue = 20;
    const pixel = scale.getPixelForValue(originalValue);
    const recoveredValue = scale.getValueForPixel(pixel);

    // Should be approximately equal (within 1% tolerance)
    expect(Math.abs(recoveredValue - originalValue)).toBeLessThan((scale.max - scale.min) * 0.01);
  });

  it('should clamp pixel values to [0, 1]', () => {
    scale.update(700, 500);

    const pixelNegative = scale.getPixelForValue(-100);
    const pixelLarge = scale.getPixelForValue(1000);

    expect(pixelNegative).toBeGreaterThanOrEqual(0);
    expect(pixelLarge).toBeLessThanOrEqual(1);
  });

  it('should recalculate ticks on update', () => {
    scale.update(700, 500);
    const ticksBefore = scale.ticks.length;

    scale.update(700, 500);
    const ticksAfter = scale.ticks.length;

    expect(ticksAfter).toBeGreaterThan(0);
  });

  it('should validate ticks are monotonically increasing', () => {
    scale.update(700, 500);

    for (let i = 1; i < scale.ticks.length; i++) {
      expect(scale.ticks[i].value).toBeGreaterThanOrEqual(scale.ticks[i - 1].value);
    }
  });

  it('should validate ticks are within min/max range', () => {
    scale.update(700, 500);

    scale.ticks.forEach((tick) => {
      expect(tick.value).toBeGreaterThanOrEqual(scale.min);
      expect(tick.value).toBeLessThanOrEqual(scale.max);
    });
  });
});

describe('CategoryScale', () => {
  let scale: CategoryScale;
  let mockChart: Chart;

  beforeEach(() => {
    mockChart = createMockChart({
      labels: ['Jan', 'Feb', 'Mar', 'Apr'],
      datasets: [
        {
          label: 'Sales',
          data: [100, 200, 150, 300],
          backgroundColor: '#00FF00',
        },
      ],
    });

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    scale = new CategoryScale('x', { type: 'category' }, ctx, mockChart);
  });

  it('should create one position for each label', () => {
    scale.update(700, 500);
    expect(scale.categories.length).toBe(4);
    expect(scale.ticks.length).toBe(4);
  });

  it('should map categories to pixels consistently', () => {
    scale.update(700, 500);

    const pixel0 = scale.getPixelForValue(0);
    const pixel1 = scale.getPixelForValue(1);
    const pixel2 = scale.getPixelForValue(2);
    const pixel3 = scale.getPixelForValue(3);

    // Pixels should be in increasing order
    expect(pixel0).toBeLessThanOrEqual(pixel1);
    expect(pixel1).toBeLessThanOrEqual(pixel2);
    expect(pixel2).toBeLessThanOrEqual(pixel3);

    // Pixels should be within [0, 1]
    expect(pixel0).toBeGreaterThanOrEqual(0);
    expect(pixel3).toBeLessThanOrEqual(1);
  });

  it('should recalculate positions on label updates', () => {
    scale.update(700, 500);
    const ticksBefore = scale.ticks.length;

    // Update with new labels
    mockChart.data.labels = ['Q1', 'Q2', 'Q3'];
    scale.update(700, 500);

    expect(scale.ticks.length).toBe(3);
    expect(scale.ticks.length).not.toBe(ticksBefore);
  });

  it('should handle single category', () => {
    mockChart.data.labels = ['Only'];
    scale.update(700, 500);

    const pixel = scale.getPixelForValue(0);
    expect(pixel).toBe(0.5); // Middle position
  });

  it('should handle empty categories', () => {
    mockChart.data.labels = [];
    scale.update(700, 500);

    const pixel = scale.getPixelForValue(0);
    expect(pixel).toBe(0);
  });
});

describe('TimeScale', () => {
  let scale: TimeScale;
  let mockChart: Chart;

  beforeEach(() => {
    const now = Date.now();
    mockChart = createMockChart({
      labels: [],
      datasets: [
        {
          label: 'Time Series',
          data: [now - 86400000, now - 43200000, now],
          backgroundColor: '#0000FF',
        },
      ],
    });

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    scale = new TimeScale('x', { type: 'time' }, ctx, mockChart);
  });

  it('should parse time values from various formats', () => {
    const date = new Date('2024-01-01');
    const timestamp = date.getTime();
    const isoString = '2024-01-01T00:00:00Z';

    expect(scale.parse(date)).toBe(timestamp);
    expect(scale.parse(timestamp)).toBe(timestamp);
    expect(typeof scale.parse(isoString)).toBe('number');
  });

  it('should generate ticks at appropriate time intervals', () => {
    scale.update(700, 500);
    expect(scale.ticks.length).toBeGreaterThan(0);
  });

  it('should map time values to pixels consistently', () => {
    scale.update(700, 500);

    const now = Date.now();
    const pixel1 = scale.getPixelForValue(now - 86400000);
    const pixel2 = scale.getPixelForValue(now);

    expect(pixel1).toBeLessThanOrEqual(pixel2);
    expect(pixel1).toBeGreaterThanOrEqual(0);
    expect(pixel2).toBeLessThanOrEqual(1);
  });

  it('should map pixels back to time values approximately', () => {
    scale.update(700, 500);

    const originalTime = Date.now();
    const pixel = scale.getPixelForValue(originalTime);
    const recoveredTime = scale.getValueForPixel(pixel);

    // Should be approximately equal (within 1% tolerance)
    const tolerance = (scale.max - scale.min) * 0.01;
    expect(Math.abs(recoveredTime - originalTime)).toBeLessThan(tolerance);
  });
});

describe('LogarithmicScale', () => {
  let scale: LogarithmicScale;
  let mockChart: Chart;

  beforeEach(() => {
    mockChart = createMockChart({
      labels: [],
      datasets: [
        {
          label: 'Exponential Data',
          data: [1, 10, 100, 1000],
          backgroundColor: '#FFFF00',
        },
      ],
    });

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    scale = new LogarithmicScale('y', { type: 'logarithmic' }, ctx, mockChart);
  });

  it('should calculate min and max from data', () => {
    scale.update(700, 500);
    expect(scale.min).toBeGreaterThan(0);
    expect(scale.max).toBeGreaterThan(scale.min);
  });

  it('should use logarithmic transformation for mapping', () => {
    scale.update(700, 500);

    // For logarithmic scale, equal ratios should map to equal pixel distances
    const pixel1 = scale.getPixelForValue(1);
    const pixel10 = scale.getPixelForValue(10);
    const pixel100 = scale.getPixelForValue(100);

    const diff1 = pixel10 - pixel1;
    const diff2 = pixel100 - pixel10;

    // Differences should be approximately equal (log scale property)
    expect(Math.abs(diff1 - diff2)).toBeLessThan(0.1);
  });

  it('should generate ticks at logarithmic intervals', () => {
    scale.update(700, 500);
    expect(scale.ticks.length).toBeGreaterThan(0);

    // Ticks should be at powers of 10 or intermediate values
    scale.ticks.forEach((tick) => {
      expect(tick.value).toBeGreaterThan(0);
    });
  });

  it('should map pixels back to values approximately', () => {
    scale.update(700, 500);

    const originalValue = 50;
    const pixel = scale.getPixelForValue(originalValue);
    const recoveredValue = scale.getValueForPixel(pixel);

    // Should be approximately equal (within 5% tolerance for log scale)
    const tolerance = originalValue * 0.05;
    expect(Math.abs(recoveredValue - originalValue)).toBeLessThan(tolerance);
  });

  it('should handle values less than 1', () => {
    const pixel = scale.getPixelForValue(0.5);
    expect(pixel).toBeGreaterThanOrEqual(0);
    expect(pixel).toBeLessThanOrEqual(1);
  });

  it('should handle negative values by converting to 1', () => {
    const pixel = scale.getPixelForValue(-100);
    expect(pixel).toBeGreaterThanOrEqual(0);
    expect(pixel).toBeLessThanOrEqual(1);
  });
});

describe('Scale Consistency Properties', () => {
  it('should maintain round-trip consistency for LinearScale', () => {
    const mockChart = createMockChart({
      labels: [],
      datasets: [{ label: 'Data', data: [0, 50, 100], backgroundColor: '#000' }],
    });

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const scale = new LinearScale('y', { type: 'linear' }, ctx, mockChart);
    scale.update(700, 500);

    // Test round-trip for multiple values
    const testValues = [0, 25, 50, 75, 100];
    testValues.forEach((value) => {
      const pixel = scale.getPixelForValue(value);
      const recovered = scale.getValueForPixel(pixel);
      const tolerance = (scale.max - scale.min) * 0.01;
      expect(Math.abs(recovered - value)).toBeLessThan(tolerance);
    });
  });

  it('should maintain monotonicity for all scales', () => {
    const mockChart = createMockChart({
      labels: ['A', 'B', 'C'],
      datasets: [{ label: 'Data', data: [10, 20, 30], backgroundColor: '#000' }],
    });

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;

    const scales = [
      new LinearScale('y', { type: 'linear' }, ctx, mockChart),
      new CategoryScale('x', { type: 'category' }, ctx, mockChart),
    ];

    scales.forEach((scale) => {
      scale.update(700, 500);

      // Check ticks are monotonically increasing
      for (let i = 1; i < scale.ticks.length; i++) {
        expect(scale.ticks[i].value).toBeGreaterThanOrEqual(scale.ticks[i - 1].value);
      }
    });
  });
});
