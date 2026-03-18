# BinaryWaveLoader Component Integration Guide

## Overview

The `BinaryWaveLoader` component is a minimalist binary wave animation loader that creates a smooth wave effect using CSS gradients and animations. It's perfect for simple, elegant loading states.

## Component Location

- **Main Component**: `packages/components/src/Loader/BinaryWaveLoader.tsx`
- **Demo File**: `packages/components/src/Loader/BinaryWaveLoader.demo.tsx`
- **Guide**: `packages/components/src/Loader/BINARYWAVELOADER_GUIDE.md`

## Export Status

✅ Exported in `packages/components/src/index.ts`

## Integration Points

### 1. ShowcasePage

**File**: `packages/demo-app/src/pages/ShowcasePage.tsx`

- ✅ Import added
- Display section with multiple theme variations

### 2. PlaygroundPage

**File**: `packages/demo-app/src/pages/PlaygroundPage.tsx`

- ✅ Import added
- ComponentPlayground section for interactive testing

### 3. ComponentLibrary

**File**: `packages/demo-app/src/pages/playground/ComponentLibrary.tsx`

- ✅ Added to COMPONENTS array
- Category: "Loader"
- Code example included

## Props

| Prop              | Type   | Default | Description               |
| ----------------- | ------ | ------- | ------------------------- |
| `primaryColor`    | string | "#000"  | Color of the wave pattern |
| `backgroundColor` | string | "#ddd"  | Background color          |
| `width`           | string | "120px" | Width of the loader       |
| `height`          | string | "20px"  | Height of the loader      |

## Usage Examples

### Basic Usage

```tsx
import { BinaryWaveLoader } from '@rhuds/components';

export default function App() {
  return <BinaryWaveLoader />;
}
```

### Custom Colors

```tsx
<BinaryWaveLoader primaryColor="rgb(0, 255, 136)" backgroundColor="rgb(200, 200, 200)" />
```

### Custom Size

```tsx
<BinaryWaveLoader
  primaryColor="rgb(41, 242, 223)"
  backgroundColor="rgb(200, 200, 200)"
  width="200px"
  height="30px"
/>
```

## Features

- **Minimalist Design**: Clean, simple wave animation
- **Customizable Colors**: Full control over primary and background colors
- **Adjustable Size**: Customize width and height
- **Smooth Animation**: 2-second continuous wave effect
- **Performance**: Pure CSS animation, no JavaScript loops
- **Responsive**: Scales with custom dimensions

## Animation Details

### Wave Animation

- Duration: 2 seconds
- Type: Continuous loop
- Effect: Binary wave pattern that flows across the loader
- 6 segments that animate in sequence

## Theme Variations

The component supports multiple color themes:

1. **Default**: `primaryColor="#000"`, `backgroundColor="#ddd"`
2. **Green**: `primaryColor="rgb(0, 255, 136)"`
3. **Purple**: `primaryColor="rgb(169, 116, 255)"`
4. **Pink**: `primaryColor="rgb(255, 0, 110)"`
5. **Cyan**: `primaryColor="rgb(0, 217, 255)"`
6. **Gold**: `primaryColor="rgb(255, 215, 0)"`

## Size Variations

### Small

```tsx
<BinaryWaveLoader width="80px" height="15px" />
```

### Medium (Default)

```tsx
<BinaryWaveLoader width="120px" height="20px" />
```

### Large

```tsx
<BinaryWaveLoader width="200px" height="30px" />
```

## Performance

- Uses CSS gradients and animations
- No JavaScript animation loops
- Lightweight and efficient
- Suitable for production use

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Related Components

- `AnimatedLoadingText` - Animated text loader
- `ProgressLoader` - Progress-based loading indicator
- `Cube3DLoader` - 3D cube loading animation
- `AIMatrixLoader` - Matrix-style loading animation
- `ScrollingTextLoader` - Scrolling text animation

## Accessibility Notes

- The component is purely visual
- Consider adding a loading message or status text alongside for screen readers
- Animation is continuous and cannot be paused

## Demo

See `packages/components/src/Loader/BinaryWaveLoader.demo.tsx` for comprehensive examples with 8 different variations including theme colors and sizes.
