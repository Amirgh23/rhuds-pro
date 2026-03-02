export interface ChartDataPoint {
  label: string;
  value: number;
}

export interface ChartProps {
  data: ChartDataPoint[];
  type?: 'line' | 'bar' | 'pie' | 'area';
  width?: number;
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  colors?: string[];
  className?: string;
}
