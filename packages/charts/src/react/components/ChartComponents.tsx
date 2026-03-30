/**
 * Chart Type Components
 * Specialized components for each chart type
 */

import React from 'react';
import BaseChart, { type BaseChartProps } from './BaseChart';
import type { Chart } from '../../engine/Chart';

// Line Chart
export const LineChart = React.forwardRef<Chart | null, BaseChartProps>((props, ref) => (
  <BaseChart {...props} type="line" ref={ref} />
));
LineChart.displayName = 'LineChart';

// Bar Chart
export const BarChart = React.forwardRef<Chart | null, BaseChartProps>((props, ref) => (
  <BaseChart {...props} type="bar" ref={ref} />
));
BarChart.displayName = 'BarChart';

// Pie Chart
export const PieChart = React.forwardRef<Chart | null, BaseChartProps>((props, ref) => (
  <BaseChart {...props} type="pie" ref={ref} />
));
PieChart.displayName = 'PieChart';

// Doughnut Chart
export const DoughnutChart = React.forwardRef<Chart | null, BaseChartProps>((props, ref) => (
  <BaseChart {...props} type="doughnut" ref={ref} />
));
DoughnutChart.displayName = 'DoughnutChart';

// Radar Chart
export const RadarChart = React.forwardRef<Chart | null, BaseChartProps>((props, ref) => (
  <BaseChart {...props} type="radar" ref={ref} />
));
RadarChart.displayName = 'RadarChart';

// Polar Area Chart
export const PolarAreaChart = React.forwardRef<Chart | null, BaseChartProps>((props, ref) => (
  <BaseChart {...props} type="polarArea" ref={ref} />
));
PolarAreaChart.displayName = 'PolarAreaChart';

// Bubble Chart
export const BubbleChart = React.forwardRef<Chart | null, BaseChartProps>((props, ref) => (
  <BaseChart {...props} type="bubble" ref={ref} />
));
BubbleChart.displayName = 'BubbleChart';

// Scatter Chart
export const ScatterChart = React.forwardRef<Chart | null, BaseChartProps>((props, ref) => (
  <BaseChart {...props} type="scatter" ref={ref} />
));
ScatterChart.displayName = 'ScatterChart';

// Mixed Chart
export const MixedChart = React.forwardRef<Chart | null, BaseChartProps>((props, ref) => (
  <BaseChart {...props} type="mixed" ref={ref} />
));
MixedChart.displayName = 'MixedChart';

export default {
  LineChart,
  BarChart,
  PieChart,
  DoughnutChart,
  RadarChart,
  PolarAreaChart,
  BubbleChart,
  ScatterChart,
  MixedChart,
};
