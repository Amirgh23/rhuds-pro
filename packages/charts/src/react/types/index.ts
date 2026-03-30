/**
 * React Component Types
 * Defines types for React chart components and hooks
 */

import type { CSSProperties, Ref, ReactNode } from 'react';
import type {
  ChartData,
  ChartOptions,
  ChartVariant,
  ChartTheme,
  ChartEvent,
  ChartElement,
  Chart,
} from '../../engine/types';

// Re-export commonly used types
export type { ChartData, ChartOptions, ChartVariant, ChartTheme, ChartEvent, ChartElement, Chart };

/**
 * Base chart component props
 */
export interface BaseChartProps<TData = any, TOptions = any> {
  /** Chart data */
  data: ChartData<TData>;

  /** Chart options */
  options?: ChartOptions<TOptions>;

  /** Canvas width in pixels */
  width?: number;

  /** Canvas height in pixels */
  height?: number;

  /** Inline styles */
  style?: CSSProperties;

  /** CSS class name */
  className?: string;

  /** Chart variant (theme) */
  variant?: ChartVariant;

  /** Theme overrides */
  themeOverrides?: Partial<ChartTheme>;

  /** Hover event handler */
  onHover?: (event: ChartEvent, elements: ChartElement[]) => void;

  /** Click event handler */
  onClick?: (event: ChartEvent, elements: ChartElement[]) => void;

  /** Ref to chart instance */
  chartRef?: Ref<Chart | null>;

  /** Additional props */
  [key: string]: any;
}

/**
 * Line chart props
 */
export interface LineChartProps extends BaseChartProps {
  // Line chart specific props
}

/**
 * Bar chart props
 */
export interface BarChartProps extends BaseChartProps {
  // Bar chart specific props
}

/**
 * Pie chart props
 */
export interface PieChartProps extends BaseChartProps {
  // Pie chart specific props
}

/**
 * Doughnut chart props
 */
export interface DoughnutChartProps extends BaseChartProps {
  // Doughnut chart specific props
}

/**
 * Radar chart props
 */
export interface RadarChartProps extends BaseChartProps {
  // Radar chart specific props
}

/**
 * Polar area chart props
 */
export interface PolarAreaChartProps extends BaseChartProps {
  // Polar area chart specific props
}

/**
 * Bubble chart props
 */
export interface BubbleChartProps extends BaseChartProps {
  // Bubble chart specific props
}

/**
 * Scatter chart props
 */
export interface ScatterChartProps extends BaseChartProps {
  // Scatter chart specific props
}

/**
 * Mixed chart props
 */
export interface MixedChartProps extends BaseChartProps {
  // Mixed chart specific props
}

/**
 * useChart hook return type
 */
export interface UseChartReturn {
  chart: Chart | null;
  isInitialized: boolean;
  error: Error | null;
}

/**
 * useChartData hook return type
 */
export interface UseChartDataReturn<TData = any> {
  data: ChartData<TData>;
  setData: (data: ChartData<TData>) => void;
  updateData: (updates: Partial<ChartData<TData>>) => void;
}

/**
 * useChartOptions hook return type
 */
export interface UseChartOptionsReturn<TOptions = any> {
  options: ChartOptions<TOptions>;
  setOptions: (options: ChartOptions<TOptions>) => void;
  updateOptions: (updates: Partial<ChartOptions<TOptions>>) => void;
}

/**
 * useChartTheme hook return type
 */
export interface UseChartThemeReturn {
  theme: ChartTheme;
  variant: ChartVariant;
  setVariant: (variant: ChartVariant) => void;
  setTheme: (theme: Partial<ChartTheme>) => void;
}
