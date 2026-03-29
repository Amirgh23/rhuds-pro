# Bubble Chart - Quick Start Guide

## Installation

The Bubble Chart component is already integrated into the RHUDS component library.

## Basic Usage

### RHUDS Theme (Modern, Clean)

```tsx
import { RhudsBubbleChart } from '@rhuds/components/Visualization';

const data = [
  { x: 10, y: 20, r: 15, label: 'A' },
  { x: 25, y: 35, r: 20, label: 'B' },
  { x: 40, y: 15, r: 18, label: 'C' },
];

export function MyChart() {
  return <RhudsBubbleChart data={data} xLabel="Performance" yLabel="Efficiency" />;
}
```

### Cold War Theme (Military, Tactical)

```tsx
import { ColdWarBubbleChart } from '@rhuds/components/Visualization';

export function TacticalChart() {
  return <ColdWarBubbleChart data={data} xLabel="Threat Level" yLabel="Strategic Value" />;
}
```

## Data Structure

Each data point needs:

```typescript
{
  x: number;           // X-axis value (0-100 recommended)
  y: number;           // Y-axis value (0-100 recommended)
  r: number;           // Radius/size (5-50 recommended)
  label?: string;      // Optional label (1-2 chars)
  color?: string;      // Optional hex color
}
```

## Common Examples

### Sales Analytics

```tsx
const salesData = [
  { x: 45, y: 60, r: 25, label: 'Q1' },
  { x: 55, y: 75, r: 30, label: 'Q2' },
  { x: 65, y: 80, r: 35, label: 'Q3' },
  { x: 70, y: 85, r: 40, label: 'Q4' },
];

<RhudsBubbleChart data={salesData} xLabel="Market Share" yLabel="Revenue" />;
```

### Performance Metrics

```tsx
const metricsData = [
  { x: 30, y: 40, r: 20, label: 'CPU' },
  { x: 50, y: 60, r: 25, label: 'RAM' },
  { x: 70, y: 50, r: 30, label: 'GPU' },
];

<RhudsBubbleChart data={metricsData} xLabel="Utilization" yLabel="Performance" />;
```

### Tactical Analysis

```tsx
const tacticalData = [
  { x: 30, y: 40, r: 20, label: 'A', color: '#FFB000' },
  { x: 50, y: 60, r: 25, label: 'B', color: '#33FF00' },
  { x: 70, y: 50, r: 30, label: 'C', color: '#FF3333' },
];

<ColdWarBubbleChart data={tacticalData} xLabel="Threat Level" yLabel="Priority" />;
```

## Props Reference

```typescript
interface BubbleChartProps {
  data: BubbleDataPoint[]; // Required: data points
  width?: number; // Default: 600
  height?: number; // Default: 400
  showGrid?: boolean; // Default: true
  showLegend?: boolean; // Default: true
  xLabel?: string; // Default: 'X Axis'
  yLabel?: string; // Default: 'Y Axis'
  colors?: string[]; // Custom color palette
  className?: string; // CSS class
  variant?: 'rhuds' | 'coldwar'; // Theme
}
```

## Styled Variants

For pre-styled containers:

```tsx
import { RhudsBubbleChartStyled, ColdWarBubbleChartStyled } from '@rhuds/components/Visualization';

// RHUDS with styling
<RhudsBubbleChartStyled data={data} />

// Cold War with tactical styling
<ColdWarBubbleChartStyled data={data} />
```

## Theme Colors

### RHUDS

- Primary: `#29F2DF` (Cyan)
- Secondary: `#1C7FA6` (Blue)
- Accent: `#EF3EF1` (Magenta)

### Cold War

- Primary: `#FFB000` (Tactical Amber)
- Secondary: `#33FF00` (Phosphor Green)
- Accent: `#FF3333` (Muted Red)

## Tips

1. **Data Range**: Keep X/Y values in 0-100 for better visualization
2. **Bubble Size**: Use radius 5-50 for optimal visibility
3. **Labels**: Keep short (1-2 characters) to avoid overlap
4. **Colors**: Use contrasting colors for distinction
5. **Grid**: Enable for better readability

## Files

- **Component**: `packages/components/src/Visualization/BubbleChart.tsx`
- **RHUDS Variant**: `packages/components/src/Visualization/BubbleChart.rhuds.tsx`
- **Cold War Variant**: `packages/components/src/Visualization/BubbleChart.coldwar.tsx`
- **Demo**: `packages/demo-app/src/components/BubbleChartShowcase.tsx`

## Documentation

- **General Guide**: `packages/components/src/Visualization/BUBBLECHART_GUIDE.md`
- **RHUDS Guide**: `packages/components/src/Visualization/BUBBLECHART_RHUDS_GUIDE.md`
- **Cold War Guide**: `packages/components/src/Visualization/BUBBLECHART_COLDWAR_GUIDE.md`
- **Integration**: `packages/components/BUBBLECHART_INTEGRATION.md`

## Next Steps

1. Import the component
2. Prepare your data
3. Choose a theme (RHUDS or Cold War)
4. Customize as needed
5. Integrate into your application

For more details, see the full documentation files.
