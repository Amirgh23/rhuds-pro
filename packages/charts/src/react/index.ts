/**
 * React Layer - React components and hooks
 * Exports all React chart components and hooks
 */

// Export all types
export * from './types/index';

// Export components (but not BaseChartProps to avoid conflict)
export { default as BaseChart } from './components/BaseChart';
export {
  LineChart,
  BarChart,
  PieChart,
  DoughnutChart,
  RadarChart,
  PolarAreaChart,
  BubbleChart,
  ScatterChart,
  MixedChart,
} from './components/ChartComponents';

// Export hooks
export { useChart } from './hooks/useChart';
export { useChartData } from './hooks/useChartData';
export { useChartOptions } from './hooks/useChartOptions';
export { useChartTheme } from './hooks/useChartTheme';
