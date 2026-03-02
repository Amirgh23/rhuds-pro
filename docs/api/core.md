# Core API

Core functionality and utilities for RHUDS.

## Theme System

### ThemeProvider

Root provider for theme context.

```tsx
import { ThemeProvider } from '@rhuds/core';

<ThemeProvider themes={[darkTheme, lightTheme]} defaultTheme="dark">
  <App />
</ThemeProvider>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `themes` | `ThemeMode[]` | - | Available themes |
| `defaultTheme` | `string` | - | Default theme name |
| `children` | `ReactNode` | - | App content |

---

### useTheme

Hook to access current theme.

```tsx
import { useTheme } from '@rhuds/core';

function MyComponent() {
  const theme = useTheme();
  
  return (
    <div style={{ color: theme.currentMode.tokens.colors.primary }}>
      Themed content
    </div>
  );
}
```

#### Returns

```typescript
{
  currentMode: ThemeMode;
  availableModes: ThemeMode[];
  setTheme: (mode: string) => void;
  customizeToken: (path: string, value: string) => void;
}
```

---

### createAppTheme

Create a custom theme.

```tsx
import { createAppTheme } from '@rhuds/core';

const myTheme = createAppTheme({
  name: 'my-theme',
  primaryColor: '#00f6ff',
  secondaryColor: '#7b61ff',
  baseUnit: 4,
  fontFamily: 'Orbitron, sans-serif',
});
```

#### Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `name` | `string` | - | Theme name |
| `primaryColor` | `string` | `'#00f6ff'` | Primary color |
| `secondaryColor` | `string` | `'#7b61ff'` | Secondary color |
| `baseUnit` | `number` | `4` | Base spacing unit |
| `fontFamily` | `string` | - | Font family |
| `breakpoints` | `object` | - | Custom breakpoints |

---

### createThemeColor

Create a color with utilities.

```tsx
import { createThemeColor } from '@rhuds/core';

const color = createThemeColor('#00f6ff');

console.log(color.main);        // '#00f6ff'
console.log(color.light);       // Lighter variant
console.log(color.dark);        // Darker variant
console.log(color.alpha(0.5));  // With alpha
```

#### Methods

- `main`: Base color
- `light`: Lighter variant
- `dark`: Darker variant
- `alpha(value)`: Color with alpha channel

---

## Animation System

### Animator

Animation component with enter/exit animations.

```tsx
import { Animator } from '@rhuds/core';

<Animator animate>
  <div>Animated content</div>
</Animator>
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `animate` | `boolean` | `true` | Enable animation |
| `duration` | `number` | `300` | Animation duration (ms) |
| `easing` | `string` | `'ease-out'` | Easing function |
| `children` | `ReactNode` | - | Content to animate |

---

### useAnimator

Hook for programmatic animations.

```tsx
import { useAnimator } from '@rhuds/core';

function MyComponent() {
  const animator = useAnimator();
  
  const handleClick = () => {
    animator.animate({
      from: { opacity: 0 },
      to: { opacity: 1 },
      duration: 300,
    });
  };
  
  return <button onClick={handleClick}>Animate</button>;
}
```

---

### createAnimation

Create custom animations.

```tsx
import { createAnimation } from '@rhuds/core';

const fadeIn = createAnimation({
  from: { opacity: 0, transform: 'translateY(20px)' },
  to: { opacity: 1, transform: 'translateY(0)' },
  duration: 300,
  easing: 'ease-out',
});
```

---

## Audio System

### BleepsProvider

Provider for audio context.

```tsx
import { BleepsProvider } from '@rhuds/core';

<BleepsProvider>
  <App />
</BleepsProvider>
```

---

### useBleep

Hook to play sound effects.

```tsx
import { useBleep } from '@rhuds/core';

function MyComponent() {
  const bleep = useBleep();
  
  const handleClick = () => {
    bleep.play('click');
  };
  
  return <button onClick={handleClick}>Click Me</button>;
}
```

#### Methods

- `play(name)`: Play sound by name
- `stop(name)`: Stop sound
- `setVolume(volume)`: Set global volume (0-1)

---

### BleepManager

Manage audio presets.

```tsx
import { BleepManager } from '@rhuds/core';

const bleepManager = new BleepManager({
  sounds: {
    click: { src: '/sounds/click.mp3' },
    hover: { src: '/sounds/hover.mp3' },
  },
});
```

---

## State Management

### Store

Redux store with pre-configured slices.

```tsx
import { store } from '@rhuds/core';
import { Provider } from 'react-redux';

<Provider store={store}>
  <App />
</Provider>
```

---

### useAppDispatch

Typed dispatch hook.

```tsx
import { useAppDispatch } from '@rhuds/core';

function MyComponent() {
  const dispatch = useAppDispatch();
  
  const handleAction = () => {
    dispatch(someAction());
  };
}
```

---

### useAppSelector

Typed selector hook.

```tsx
import { useAppSelector } from '@rhuds/core';

function MyComponent() {
  const theme = useAppSelector(state => state.ui.theme);
  
  return <div>Current theme: {theme}</div>;
}
```

---

## Utilities

### Color Utilities

```tsx
import { 
  hexToRgb, 
  rgbToHex, 
  lighten, 
  darken,
  adjustAlpha 
} from '@rhuds/core';

const rgb = hexToRgb('#00f6ff');
const hex = rgbToHex(0, 246, 255);
const lighter = lighten('#00f6ff', 0.2);
const darker = darken('#00f6ff', 0.2);
const withAlpha = adjustAlpha('#00f6ff', 0.5);
```

---

### Validation

```tsx
import { validateTheme } from '@rhuds/core';

const isValid = validateTheme(myTheme);
```

---

### Breakpoints

```tsx
import { useBreakpoint } from '@rhuds/core';

function MyComponent() {
  const breakpoint = useBreakpoint();
  
  return (
    <div>
      Current breakpoint: {breakpoint}
    </div>
  );
}
```

---

## Types

### ThemeMode

```typescript
interface ThemeMode {
  name: 'light' | 'dark' | 'neon-green' | 'neon-blue' | 'neon-red';
  tokens: ThemeTokens;
}
```

### ThemeTokens

```typescript
interface ThemeTokens {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    border: string;
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  spacing: Record<string, string>;
  typography: {
    fontFamily: string;
    fontSize: Record<string, string>;
    fontWeight: Record<string, number>;
    lineHeight: Record<string, number>;
  };
  shadows: Record<string, string>;
  transitions: {
    fast: string;
    normal: string;
    slow: string;
  };
  breakpoints: Record<string, string>;
}
```

### RHUDSTheme

```typescript
interface RHUDSTheme {
  name?: string;
  version?: string;
  colors: ColorSystem;
  units: UnitSystem;
  typography: TypographySystem;
  breakpoints: BreakpointSystem;
  animation: AnimationDefaults;
  zIndex: ZIndexSystem;
}
```
