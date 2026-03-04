# @rhuds/frames

Arwes-style Frame components for React with SVG rendering and animations.

## Features

- 🎨 **6 Frame Variants** - Octagon, Kranox, Corners, Lines, Underline, Nefrex
- ⚡ **SVG Rendering** - Dynamic path generation with percentage and calc() support
- 🎬 **Assembling Animations** - Smooth stroke-dasharray animations
- 🎯 **TypeScript** - Full type safety
- 🎮 **Animator Integration** - Works with @rhuds/core Animator
- 📦 **ClipPath Utilities** - Direct CSS clip-path generation

## Installation

```bash
npm install @rhuds/frames @rhuds/core @rhuds/hooks
```

## Quick Start

### Basic Usage (No Animation)

```tsx
import { FrameSVGOctagon } from '@rhuds/frames';

function App() {
  return (
    <div style={{ position: 'relative', width: 300, height: 150 }}>
      <style>
        {`
          [data-name=bg] { color: hsl(180, 75%, 10%); }
          [data-name=line] { color: hsl(180, 75%, 50%); }
        `}
      </style>
      <FrameSVGOctagon padding={4} squareSize={16} />
      <div style={{ position: 'absolute', inset: 20 }}>
        Your content here
      </div>
    </div>
  );
}
```

### With Animation

```tsx
import { useRef } from 'react';
import { Animator } from '@rhuds/core';
import { FrameSVGOctagon, useFrameSVGAssemblingAnimation } from '@rhuds/frames';

function AnimatedFrame() {
  const svgRef = useRef<SVGSVGElement>(null);
  const { onRender } = useFrameSVGAssemblingAnimation(svgRef);

  return (
    <Animator active={true}>
      <div style={{ position: 'relative', width: 300, height: 150 }}>
        <style>
          {`
            [data-name=bg] { color: hsl(180, 75%, 10%); }
            [data-name=line] { color: hsl(180, 75%, 50%); }
          `}
        </style>
        <FrameSVGOctagon
          elementRef={svgRef}
          onRender={onRender}
          padding={4}
          squareSize={16}
        />
        <div style={{ position: 'absolute', inset: 20 }}>
          Animated content
        </div>
      </div>
    </Animator>
  );
}
```

## Frame Components

### FrameSVGOctagon

Basic octagon frame with customizable corners.

```tsx
<FrameSVGOctagon
  padding={4}
  squareSize={16}
  leftTop={true}
  rightTop={true}
  rightBottom={true}
  leftBottom={true}
/>
```

### FrameSVGKranox

Complex assembling frame with decorative lines.

```tsx
<FrameSVGKranox
  padding={4}
  strokeWidth={2}
  squareSize={12}
  smallLineLength={12}
  largeLineLength={48}
/>
```

### FrameSVGCorners

Corner-only frame.

```tsx
<FrameSVGCorners
  padding={4}
  strokeWidth={1}
  cornerLength={32}
/>
```

### FrameSVGLines

Dashed line frame.

```tsx
<FrameSVGLines
  padding={4}
  strokeWidth={2}
  lineLength={8}
/>
```

### FrameSVGUnderline

Frame with corner squares and bottom underline.

```tsx
<FrameSVGUnderline
  padding={4}
  strokeWidth={1}
  squareSize={8}
/>
```

### FrameSVGNefrex

Complex frame combining basic and assembling styles.

```tsx
<FrameSVGNefrex
  padding={4}
  strokeWidth={2}
  squareSize={32}
  smallLineLength={32}
  largeLineLength={128}
/>
```

## Styling with data-name

All frames use `data-name` attributes for styling:

```css
[data-name=bg] {
  color: hsl(180, 75%, 10%);
  filter: drop-shadow(0 0 4px currentColor);
}

[data-name=line] {
  color: hsl(180, 75%, 50%);
  filter: drop-shadow(0 0 2px currentColor);
}
```

## ClipPath Utilities

For direct CSS usage without SVG:

```tsx
import { createFrameOctagonClip } from '@rhuds/frames';

const box = document.createElement('div');
box.style.clipPath = createFrameOctagonClip({ squareSize: '1rem' });
box.style.background = '#077';
```

## Custom SVG Paths

Create custom frames with `FrameSVG`:

```tsx
import { FrameSVG } from '@rhuds/frames';

const paths = [
  {
    name: 'bg',
    style: { fill: 'hsl(180, 75%, 10%)' },
    path: [
      ['M', 20, 20],
      ['L', '100% - 20', 20],
      ['L', '100% - 20', '100% - 20'],
      ['L', 20, '100% - 20'],
      'Z',
    ],
  },
];

<FrameSVG paths={paths} />
```

## Path Coordinate System

Supports:
- Numbers: `100`
- Percentages: `'100%'`
- Calculations: `'100% - 20'`, `'50% + 100'`

## API Reference

### Common Props

All Frame components accept:

- `elementRef?: RefObject<SVGSVGElement>` - Ref for SVG element
- `onRender?: (svg, width, height) => void` - Render callback
- `className?: string` - CSS class
- `style?: CSSProperties` - Inline styles

### Hooks

#### useFrameSVGRenderer

Manages SVG rendering with resize observer.

```tsx
const svgRef = useRef<SVGSVGElement>(null);
useFrameSVGRenderer(svgRef, (svg, width, height) => {
  // Custom render logic
});
```

#### useFrameSVGAssemblingAnimation

Provides assembling animation for frames.

```tsx
const svgRef = useRef<SVGSVGElement>(null);
const { onRender } = useFrameSVGAssemblingAnimation(svgRef);
```

### Core Functions

#### renderFrameSVGPaths

Renders SVG paths to a container.

```tsx
import { renderFrameSVGPaths } from '@rhuds/frames';

renderFrameSVGPaths(svgElement, width, height, paths);
```

## Examples

See `packages/frames/src/__tests__/ArwesFramesDemo.tsx` for complete examples.

## License

MIT
