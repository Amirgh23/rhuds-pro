# Cold War Backgrounds - Quick Start

## Installation

All components are exported from `@rhuds/backgrounds`:

```tsx
import {
  ColdWarGridLines,
  ColdWarRadar,
  ColdWarScanlines,
  ColdWarParticles,
  ColdWarNoise,
} from '@rhuds/backgrounds';
```

## Basic Usage

```tsx
<ColdWarGridLines width={800} height={600} theme="greenTerminal" intensity="medium" />
```

## Themes

- `perseus` - Warm amber (vintage military)
- `greenTerminal` - Classic green monochrome
- `satelliteView` - Cool blue tactical

## Intensity

- `low` - Subtle background effect
- `medium` - Balanced (recommended)
- `high` - Strong focal element

## Accessibility

All components automatically respect `prefers-reduced-motion` media query.

## Performance

- Canvas-based rendering
- RequestAnimationFrame optimization
- Particle pooling
- Minimal memory footprint

## Combining Effects

Stack components with `position: absolute` for layered effects:

```tsx
<div style={{ position: 'relative', width: 800, height: 600 }}>
  <ColdWarGridLines width={800} height={600} style={{ position: 'absolute' }} />
  <ColdWarScanlines width={800} height={600} style={{ position: 'absolute' }} />
</div>
```

## Demo

Run the interactive demo:

```tsx
import { ColdWarBackgroundsDemo } from '@rhuds/backgrounds/coldwar';

export default ColdWarBackgroundsDemo;
```
