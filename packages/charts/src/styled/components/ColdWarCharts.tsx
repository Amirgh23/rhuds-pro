/**
 * ColdWar Styled Chart Components
 * Chart components with ColdWar theme applied
 */

import React from 'react';
import { BaseChart, type BaseChartProps } from '../../react/components/BaseChart';
import { getColdWarChartOptions } from '../themes/ColdWarTheme';
import type { Chart } from '../../engine/Chart';

const withColdWarTheme = (Component: React.ForwardRefExoticComponent<any>) => {
  return React.forwardRef<Chart | null, BaseChartProps>((props, ref) => (
    <Component
      {...props}
      variant="coldwar"
      options={{
        ...getColdWarChartOptions(),
        ...props.options,
      }}
      ref={ref}
    />
  ));
};

// ColdWar Line Chart
export const ColdWarLineChart = withColdWarTheme(
  React.forwardRef<Chart | null, BaseChartProps>((props, ref) => (
    <BaseChart {...props} type="line" ref={ref} />
  ))
);
ColdWarLineChart.displayName = 'ColdWarLineChart';

// ColdWar Bar Chart
export const ColdWarBarChart = withColdWarTheme(
  React.forwardRef<Chart | null, BaseChartProps>((props, ref) => (
    <BaseChart {...props} type="bar" ref={ref} />
  ))
);
ColdWarBarChart.displayName = 'ColdWarBarChart';

// ColdWar Pie Chart
export const ColdWarPieChart = withColdWarTheme(
  React.forwardRef<Chart | null, BaseChartProps>((props, ref) => (
    <BaseChart {...props} type="pie" ref={ref} />
  ))
);
ColdWarPieChart.displayName = 'ColdWarPieChart';

// ColdWar Doughnut Chart
export const ColdWarDoughnutChart = withColdWarTheme(
  React.forwardRef<Chart | null, BaseChartProps>((props, ref) => (
    <BaseChart {...props} type="doughnut" ref={ref} />
  ))
);
ColdWarDoughnutChart.displayName = 'ColdWarDoughnutChart';

// ColdWar Radar Chart
export const ColdWarRadarChart = withColdWarTheme(
  React.forwardRef<Chart | null, BaseChartProps>((props, ref) => (
    <BaseChart {...props} type="radar" ref={ref} />
  ))
);
ColdWarRadarChart.displayName = 'ColdWarRadarChart';

// ColdWar Polar Area Chart
export const ColdWarPolarAreaChart = withColdWarTheme(
  React.forwardRef<Chart | null, BaseChartProps>((props, ref) => (
    <BaseChart {...props} type="polarArea" ref={ref} />
  ))
);
ColdWarPolarAreaChart.displayName = 'ColdWarPolarAreaChart';

// ColdWar Bubble Chart
export const ColdWarBubbleChart = withColdWarTheme(
  React.forwardRef<Chart | null, BaseChartProps>((props, ref) => (
    <BaseChart {...props} type="bubble" ref={ref} />
  ))
);
ColdWarBubbleChart.displayName = 'ColdWarBubbleChart';

// ColdWar Scatter Chart
export const ColdWarScatterChart = withColdWarTheme(
  React.forwardRef<Chart | null, BaseChartProps>((props, ref) => (
    <BaseChart {...props} type="scatter" ref={ref} />
  ))
);
ColdWarScatterChart.displayName = 'ColdWarScatterChart';

// ColdWar Mixed Chart
export const ColdWarMixedChart = withColdWarTheme(
  React.forwardRef<Chart | null, BaseChartProps>((props, ref) => (
    <BaseChart {...props} type="mixed" ref={ref} />
  ))
);
ColdWarMixedChart.displayName = 'ColdWarMixedChart';

export default {
  ColdWarLineChart,
  ColdWarBarChart,
  ColdWarPieChart,
  ColdWarDoughnutChart,
  ColdWarRadarChart,
  ColdWarPolarAreaChart,
  ColdWarBubbleChart,
  ColdWarScatterChart,
  ColdWarMixedChart,
};
