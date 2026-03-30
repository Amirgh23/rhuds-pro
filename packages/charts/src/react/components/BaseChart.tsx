/**
 * Base Chart Component
 * React wrapper for the Chart engine
 */

import React, { useEffect, useRef, useState } from 'react';
import type { ChartOptions, ChartData, ChartType } from '../../engine/types/index';
import { Chart } from '../../engine/Chart';

export interface BaseChartProps {
  type: ChartType;
  data: ChartData;
  options?: Partial<ChartOptions>;
  variant?: 'r-huds' | 'coldwar';
  width?: number | string;
  height?: number | string;
  onReady?: (chart: Chart) => void;
  onUpdate?: (chart: Chart) => void;
  onError?: (error: Error) => void;
}

export const BaseChart = React.forwardRef<Chart | null, BaseChartProps>(
  (
    {
      type,
      data,
      options = {},
      variant = 'r-huds',
      width = '100%',
      height = 400,
      onReady,
      onUpdate,
      onError,
    },
    ref
  ) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const chartRef = useRef<Chart | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isReady, setIsReady] = useState(false);

    // Initialize chart
    useEffect(() => {
      if (!canvasRef.current) return;

      try {
        // Create chart instance
        const chart = new Chart(canvasRef.current, {
          type,
          data,
          options: {
            ...options,
            variant,
          },
        });

        chartRef.current = chart;
        setIsReady(true);

        if (onReady) {
          onReady(chart);
        }

        // Expose chart instance to ref
        if (typeof ref === 'function') {
          ref(chart);
        } else if (ref) {
          ref.current = chart;
        }
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        if (onError) {
          onError(err);
        }
        console.error('Error initializing chart:', err);
      }

      return () => {
        // Cleanup
        if (chartRef.current) {
          chartRef.current.destroy();
          chartRef.current = null;
        }
      };
    }, [type, variant, onReady, onError, ref]);

    // Update chart on data/options change
    useEffect(() => {
      if (!chartRef.current || !isReady) return;

      try {
        chartRef.current.data = data;
        chartRef.current.options = {
          ...chartRef.current.options,
          ...options,
        };
        chartRef.current.update('default');

        if (onUpdate) {
          onUpdate(chartRef.current);
        }
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));
        if (onError) {
          onError(err);
        }
        console.error('Error updating chart:', err);
      }
    }, [data, options, isReady, onUpdate, onError]);

    // Handle responsive behavior
    useEffect(() => {
      if (!containerRef.current || !chartRef.current) return;

      const resizeObserver = new ResizeObserver(() => {
        if (chartRef.current) {
          chartRef.current.update('resize');
        }
      });

      resizeObserver.observe(containerRef.current);

      return () => {
        resizeObserver.disconnect();
      };
    }, [isReady]);

    return (
      <div
        ref={containerRef}
        style={{
          width,
          height: typeof height === 'number' ? `${height}px` : height,
          position: 'relative',
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            display: 'block',
            width: '100%',
            height: '100%',
          }}
        />
      </div>
    );
  }
);

BaseChart.displayName = 'BaseChart';

export default BaseChart;
