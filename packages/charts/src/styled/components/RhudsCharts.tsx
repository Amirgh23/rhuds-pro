/**
 * RHUDS Styled Chart Components
 * Chart components with RHUDS theme applied
 */

import React from 'react';
import { BaseChart, type BaseChartProps } from '../../react/components/index';
import { getRhudsChartOptions } from '../themes/RhudsTheme';
import type { Chart } from '../../engine/Chart';

const withRhudsTheme = (Component: React.ForwardRefExoticComponent<any>) => {
  return React.forwardRef<Chart | null, BaseChartProps>((props, ref) => (
    <Component
      {...props}
      variant="r-huds"
      options={{
        ...getRhudsChartOptions(),
        ...props.options,
      }}
      ref={ref}
    />
  ));
};

// RHUDS Line Chart
export const RhudsLineChart = withRhudsTheme(
  React.forwardRef<Chart | null, BaseChartProps>((props, ref) => (
    <BaseChart {...props} type="line" ref={ref} />
  ))
);
RhudsLineChart.displayName = 'RhudsLineChart';

// RHUDS Bar Chart
export const RhudsBarChart = withRhudsTheme(
  React.forwardRef<Chart | null, BaseChartProps>((props, ref) => (
    <BaseChart {...props} type="bar" ref={ref} />
  ))
);
RhudsBarChart.displayName = 'RhudsBarChart';

// RHUDS Pie Chart
export const RhudsPieChart = withRhudsTheme(
  React.forwardRef<Chart | null, BaseChartProps>((props, ref) => (
    <BaseChart {...props} type="pie" ref={ref} />
  ))
);
RhudsPieChart.displayName = 'RhudsPieChart';

// RHUDS Doughnut Chart
export const RhudsDoughnutChart = withRhudsTheme(
  React.forwardRef<Chart | null, BaseChartProps>((props, ref) => (
    <BaseChart {...props} type="doughnut" ref={ref} />
  ))
);
RhudsDoughnutChart.displayName = 'RhudsDoughnutChart';

// RHUDS Radar Chart
export const RhudsRadarChart = withRhudsTheme(
  React.forwardRef<Chart | null, BaseChartProps>((props, ref) => (
    <BaseChart {...props} type="radar" ref={ref} />
  ))
);
RhudsRadarChart.displayName = 'RhudsRadarChart';

// RHUDS Polar Area Chart
export const RhudsPolarAreaChart = withRhudsTheme(
  React.forwardRef<Chart | null, BaseChartProps>((props, ref) => (
    <BaseChart {...props} type="polarArea" ref={ref} />
  ))
);
RhudsPolarAreaChart.displayName = 'RhudsPolarAreaChart';

// RHUDS Bubble Chart
export const RhudsBubbleChart = withRhudsTheme(
  React.forwardRef<Chart | null, BaseChartProps>((props, ref) => (
    <BaseChart {...props} type="bubble" ref={ref} />
  ))
);
RhudsBubbleChart.displayName = 'RhudsBubbleChart';

// RHUDS Scatter Chart
export const RhudsScatterChart = withRhudsTheme(
  React.forwardRef<Chart | null, BaseChartProps>((props, ref) => (
    <BaseChart {...props} type="scatter" ref={ref} />
  ))
);
RhudsScatterChart.displayName = 'RhudsScatterChart';

// RHUDS Mixed Chart
export const RhudsMixedChart = withRhudsTheme(
  React.forwardRef<Chart | null, BaseChartProps>((props, ref) => (
    <BaseChart {...props} type="mixed" ref={ref} />
  ))
);
RhudsMixedChart.displayName = 'RhudsMixedChart';

export default {
  RhudsLineChart,
  RhudsBarChart,
  RhudsPieChart,
  RhudsDoughnutChart,
  RhudsRadarChart,
  RhudsPolarAreaChart,
  RhudsBubbleChart,
  RhudsScatterChart,
  RhudsMixedChart,
};
