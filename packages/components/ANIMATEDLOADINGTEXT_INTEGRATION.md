# AnimatedLoadingText Component Integration Guide

## Overview

The `AnimatedLoadingText` component is a cyberpunk-styled animated loading indicator that displays customizable text with animated letter effects and directional arrows. It's perfect for loading states and initialization sequences.

## Component Location

- **Main Component**: `packages/components/src/Loader/AnimatedLoadingText.tsx`
- **Demo File**: `packages/components/src/Loader/AnimatedLoadingText.demo.tsx`
- **Guide**: `packages/components/src/Loader/ANIMATEDLOADINGTEXT_GUIDE.md`

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

| Prop              | Type   | Default   | Description                          |
| ----------------- | ------ | --------- | ------------------------------------ |
| `text`            | string | "LOADING" | The text to display and animate      |
| `primaryColor`    | string | "white"   | Color of the text and arrows         |
| `backgroundColor` | string | "#171030" | Background color for the fade effect |
| `fontSize`        | string | "1.5em"   | Font size for the text               |

## Usage Examples

### Basic Usage

```tsx
import { AnimatedLoadingText } from '@rhuds/components';

export default function App() {
  return <AnimatedLoadingText />;
}
```

### Custom Text and Colors

```tsx
<AnimatedLoadingText
  text="INITIALIZING"
  primaryColor="rgb(0, 255, 136)"
  backgroundColor="rgb(15, 15, 25)"
/>
```

### With Theme Integration

```tsx
import { useTheme } from '@rhuds/core';
import { AnimatedLoadingText } from '@rhuds/components';

export function LoadingScreen() {
  const theme = useTheme();

  return (
    <AnimatedLoadingText
      text="LOADING"
      primaryColor={theme.colors.primary}
      backgroundColor={theme.colors.background}
    />
  );
}
```

## Features

- **Customizable Text**: Display any text you want
- **Animated Letters**: Each letter animates with staggered timing
- **Directional Arrows**: Four animated arrows that pulse in sequence
- **Color Customization**: Full control over primary and background colors
- **Responsive**: Scales with font size adjustments
- **Cyberpunk Aesthetic**: Fits perfectly with RHUDS design system

## Animation Details

### Letter Animation

- Duration: 2 seconds
- Staggered delay: 0.1s between each letter
- Effect: Letters bounce up and fade to background color

### Arrow Animation

- Duration: 2 seconds
- Staggered delays: 0, 0.5s, 1s, 1.5s
- Effect: Arrows pulse with the primary color

## Theme Variations

The component supports multiple color themes:

1. **Default (White)**: `primaryColor="white"`
2. **Green**: `primaryColor="rgb(0, 255, 136)"`
3. **Purple**: `primaryColor="rgb(169, 116, 255)"`
4. **Pink**: `primaryColor="rgb(255, 0, 110)"`
5. **Cyan**: `primaryColor="rgb(0, 217, 255)"`
6. **Gold**: `primaryColor="rgb(255, 215, 0)"`

## Performance

- Uses CSS animations for smooth performance
- No JavaScript animation loops
- Lightweight and efficient
- Suitable for production use

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Related Components

- `ProgressLoader` - Progress-based loading indicator
- `Cube3DLoader` - 3D cube loading animation
- `BinaryLoader` - Binary code loading animation
- `AIMatrixLoader` - Matrix-style loading animation
- `ScrollingTextLoader` - Scrolling text animation

## Accessibility Notes

- The component is purely visual
- Consider adding a loading message or status text alongside for screen readers
- Animation is continuous and cannot be paused

## Demo

See `packages/components/src/Loader/AnimatedLoadingText.demo.tsx` for comprehensive examples with 8 different theme variations.
