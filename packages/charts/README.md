# @rhuds/charts

Chart.js equivalent charting system for RHUDS with dual theme support (RHUDS neon and ColdWar HUD).

## Overview

A complete, modern charting system built as a completely independent package with zero modifications to existing library code. Provides all Chart.js capabilities including:

- **9 Chart Types**: Line, Bar, Pie, Doughnut, Radar, PolarArea, Bubble, Scatter, Mixed
- **Dual Themes**: RHUDS (neon cyberpunk) and ColdWar (tactical military)
- **Full Type Safety**: Complete TypeScript support with no implicit any types
- **React Integration**: Components and hooks for seamless React integration
- **Plugin System**: Extensible architecture for custom features
- **Animation System**: Smooth transitions and property changes
- **Event System**: Full interactivity with hover and click handling
- **Responsive**: Automatic adaptation to container size changes
- **Large Dataset Support**: Efficient rendering of 10k+ data points

## Architecture

The system is organized in three layers:

### Engine Layer (`packages/charts/engine`)

Core charting system with:

- Registry system for component management
- Dataset controllers for each chart type
- Chart elements (Point, Line, Arc, Rectangle, Bar)
- Scale system (Linear, Category, Time, Logarithmic)
- Plugin system with lifecycle hooks
- Animation engine
- Event system
- Layout manager
- Update pipeline

### React Layer (`packages/charts/react`)

React integration with:

- BaseChart component for canvas management
- Specialized chart components (LineChart, BarChart, etc.)
- React hooks (useChart, useChartData, useChartOptions, useChartTheme)
- Responsive behavior
- Event delegation

### Styled Layer (`packages/charts/styled`)

Theme-aware styled components with:

- RHUDS variants with neon effects
- ColdWar variants with tactical styling
- Theme switching support
- Effect application (glow, scanlines, etc.)

## Installation

```bash
npm install @rhuds/charts
```

## Quick Start

```typescript
import { LineChart } from '@rhuds/charts/react';

export function MyChart() {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [
      {
        label: 'Sales',
        data: [12, 19, 3, 5, 2],
        borderColor: '#29F2DF',
        backgroundColor: 'rgba(41, 242, 223, 0.1)',
      },
    ],
  };

  return (
    <LineChart
      data={data}
      variant="r-huds"
      width={800}
      height={400}
    />
  );
}
```

## Themes

### RHUDS Theme

Neon cyberpunk aesthetic with:

- Bright neon colors
- Glow effects
- Smooth animations
- Futuristic styling

```typescript
<LineChart data={data} variant="r-huds" />
```

### ColdWar Theme

Military tactical aesthetic with:

- Muted military colors
- Scanline effects
- Tactical styling
- Radar-inspired visuals

```typescript
<LineChart data={data} variant="coldwar" />
```

## Chart Types

- **LineChart**: Visualize trends over time
- **BarChart**: Compare values across categories
- **PieChart**: Show proportions of a whole
- **DoughnutChart**: Pie chart with center cutout
- **RadarChart**: Compare multiple variables
- **PolarAreaChart**: Visualize data in polar coordinates
- **BubbleChart**: Visualize three-dimensional data
- **ScatterChart**: Show relationship between two variables
- **MixedChart**: Combine multiple chart types

## Documentation

Full API documentation is available in the `docs/` directory.

## Testing

```bash
npm run test          # Run tests in watch mode
npm run test:run      # Run tests once
npm run type-check    # Check TypeScript types
```

## Building

```bash
npm run build
```

## License

MIT
