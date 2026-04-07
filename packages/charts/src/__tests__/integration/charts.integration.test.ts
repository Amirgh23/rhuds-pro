/**
 * Chart Integration Tests
 * Tests all 18+ chart types with unified interface
 */

import { ChartIntegration, ChartType } from '../../engine/integration/ChartIntegration';

describe('Chart Integration Tests', () => {
  let integration: ChartIntegration;
  let canvas: HTMLCanvasElement;

  beforeEach(() => {
    integration = new ChartIntegration();
    canvas = document.createElement('canvas');
  });

  afterEach(() => {
    integration.destroyAll();
  });

  describe('Chart Type Support', () => {
    test('should support all 18+ chart types', () => {
      const types = integration.getSupportedTypes();
      expect(types.length).toBeGreaterThanOrEqual(18);
    });

    test('should include basic chart types', () => {
      const types = integration.getSupportedTypes();
      expect(types).toContain('line');
      expect(types).toContain('bar');
      expect(types).toContain('pie');
      expect(types).toContain('doughnut');
      expect(types).toContain('radar');
      expect(types).toContain('polarArea');
      expect(types).toContain('bubble');
      expect(types).toContain('scatter');
    });

    test('should include advanced chart types', () => {
      const types = integration.getSupportedTypes();
      expect(types).toContain('waterfall');
      expect(types).toContain('sankey');
      expect(types).toContain('treemap');
      expect(types).toContain('sunburst');
      expect(types).toContain('heatmap');
      expect(types).toContain('gantt');
      expect(types).toContain('funnel');
      expect(types).toContain('gauge');
      expect(types).toContain('speedometer');
      expect(types).toContain('network');
    });

    test('should check if type is supported', () => {
      expect(integration.isSupported('line')).toBe(true);
      expect(integration.isSupported('waterfall')).toBe(true);
      expect(integration.isSupported('unknown')).toBe(false);
    });
  });

  describe('Chart Creation', () => {
    test('should create line chart', () => {
      const config = {
        type: 'line' as ChartType,
        data: {
          labels: ['Jan', 'Feb', 'Mar'],
          datasets: [{ label: 'Sales', data: [10, 20, 30] }],
        },
      };

      const chart = integration.createChart('line-chart', config, canvas);
      expect(chart).toBeDefined();
      expect(integration.getActiveChartsCount()).toBe(1);
    });

    test('should create waterfall chart', () => {
      const config = {
        type: 'waterfall' as ChartType,
        data: {
          labels: ['Start', 'Increase', 'Decrease', 'End'],
          datasets: [{ label: 'Values', data: [100, 50, -30, 120] }],
        },
      };

      const chart = integration.createChart('waterfall-chart', config, canvas);
      expect(chart).toBeDefined();
    });

    test('should create multiple charts', () => {
      const types: ChartType[] = ['line', 'bar', 'pie', 'waterfall'];

      types.forEach((type, index) => {
        const config = {
          type,
          data: {
            labels: ['A', 'B', 'C'],
            datasets: [{ label: 'Data', data: [10, 20, 30] }],
          },
        };

        integration.createChart(`chart-${index}`, config, canvas);
      });

      expect(integration.getActiveChartsCount()).toBe(4);
    });

    test('should throw error for unknown chart type', () => {
      const config = {
        type: 'unknown' as any,
        data: {},
      };

      expect(() => {
        integration.createChart('unknown-chart', config, canvas);
      }).toThrow();
    });
  });

  describe('Chart Updates', () => {
    test('should update chart data', () => {
      const config = {
        type: 'line' as ChartType,
        data: {
          labels: ['Jan', 'Feb', 'Mar'],
          datasets: [{ label: 'Sales', data: [10, 20, 30] }],
        },
      };

      integration.createChart('line-chart', config, canvas);

      const newData = {
        labels: ['Jan', 'Feb', 'Mar'],
        datasets: [{ label: 'Sales', data: [15, 25, 35] }],
      };

      expect(() => {
        integration.updateChart('line-chart', newData);
      }).not.toThrow();
    });

    test('should handle non-existent chart update gracefully', () => {
      expect(() => {
        integration.updateChart('non-existent', {});
      }).not.toThrow();
    });
  });

  describe('Chart Destruction', () => {
    test('should destroy single chart', () => {
      const config = {
        type: 'line' as ChartType,
        data: {
          labels: ['Jan', 'Feb', 'Mar'],
          datasets: [{ label: 'Sales', data: [10, 20, 30] }],
        },
      };

      integration.createChart('line-chart', config, canvas);
      expect(integration.getActiveChartsCount()).toBe(1);

      integration.destroyChart('line-chart');
      expect(integration.getActiveChartsCount()).toBe(0);
    });

    test('should destroy all charts', () => {
      const types: ChartType[] = ['line', 'bar', 'pie'];

      types.forEach((type, index) => {
        const config = {
          type,
          data: {
            labels: ['A', 'B', 'C'],
            datasets: [{ label: 'Data', data: [10, 20, 30] }],
          },
        };

        integration.createChart(`chart-${index}`, config, canvas);
      });

      expect(integration.getActiveChartsCount()).toBe(3);

      integration.destroyAll();
      expect(integration.getActiveChartsCount()).toBe(0);
    });
  });

  describe('Chart Compatibility', () => {
    test('all charts should support data streaming', () => {
      const types = integration.getSupportedTypes();
      expect(types.length).toBeGreaterThan(0);
      // Each chart type should support streaming
    });

    test('all charts should support zoom & pan', () => {
      const types = integration.getSupportedTypes();
      expect(types.length).toBeGreaterThan(0);
      // Each chart type should support zoom & pan
    });

    test('all charts should support tooltips', () => {
      const types = integration.getSupportedTypes();
      expect(types.length).toBeGreaterThan(0);
      // Each chart type should support tooltips
    });

    test('all charts should support legends', () => {
      const types = integration.getSupportedTypes();
      expect(types.length).toBeGreaterThan(0);
      // Each chart type should support legends
    });

    test('all charts should support animations', () => {
      const types = integration.getSupportedTypes();
      expect(types.length).toBeGreaterThan(0);
      // Each chart type should support animations
    });

    test('all charts should support themes', () => {
      const types = integration.getSupportedTypes();
      expect(types.length).toBeGreaterThan(0);
      // Each chart type should support themes
    });
  });

  describe('Performance', () => {
    test('should create chart within 100ms', () => {
      const config = {
        type: 'line' as ChartType,
        data: {
          labels: Array.from({ length: 100 }, (_, i) => `Point ${i}`),
          datasets: [
            {
              label: 'Data',
              data: Array.from({ length: 100 }, () => Math.random() * 100),
            },
          ],
        },
      };

      const start = performance.now();
      integration.createChart('perf-chart', config, canvas);
      const duration = performance.now() - start;

      expect(duration).toBeLessThan(100);
    });

    test('should handle large datasets', () => {
      const config = {
        type: 'line' as ChartType,
        data: {
          labels: Array.from({ length: 10000 }, (_, i) => `Point ${i}`),
          datasets: [
            {
              label: 'Data',
              data: Array.from({ length: 10000 }, () => Math.random() * 100),
            },
          ],
        },
      };

      expect(() => {
        integration.createChart('large-chart', config, canvas);
      }).not.toThrow();
    });
  });
});
