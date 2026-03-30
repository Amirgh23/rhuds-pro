/**
 * useChart Hook
 * Manages chart instance lifecycle
 */

import { useRef, useCallback } from 'react';
import type { Chart } from '../../engine/Chart';
import type { ChartOptions, ChartData } from '../../engine/types/index';

export interface UseChartOptions {
  onReady?: (chart: Chart) => void;
  onUpdate?: (chart: Chart) => void;
  onError?: (error: Error) => void;
}

export const useChart = (options: UseChartOptions = {}) => {
  const chartRef = useRef<Chart | null>(null);

  const getChart = useCallback(() => {
    return chartRef.current;
  }, []);

  const updateChart = useCallback(
    (data: ChartData, chartOptions?: Partial<ChartOptions>) => {
      if (!chartRef.current) return;

      chartRef.current.data = data;
      if (chartOptions) {
        chartRef.current.options = {
          ...chartRef.current.options,
          ...chartOptions,
        };
      }
      chartRef.current.update('default');

      if (options.onUpdate) {
        options.onUpdate(chartRef.current);
      }
    },
    [options]
  );

  const destroyChart = useCallback(() => {
    if (chartRef.current) {
      chartRef.current.destroy();
      chartRef.current = null;
    }
  }, []);

  const resetChart = useCallback(() => {
    if (chartRef.current) {
      chartRef.current.update('reset');
    }
  }, []);

  return {
    chartRef,
    getChart,
    updateChart,
    destroyChart,
    resetChart,
  };
};

export default useChart;
