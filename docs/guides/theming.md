# Theming Guide

Learn how to customize and create themes in RHUDS.

## Overview

RHUDS provides a powerful theming system that allows you to customize colors, typography, spacing, and more.

## Basic Theme Setup

### Using Built-in Themes

```tsx
import { ThemeProvider } from '@rhuds/core';

const darkTheme = {
  name: 'dark',
  tokens: {
    colors: {
      primary: '#00f6ff',
      secondary: '#7b61ff',
      background: '#0a0a0a',
      text: '#ffffff',
      // ... more colors
    },
    // ... more tokens
  },
};

function App() {
  return (
    <ThemeProvider themes={[darkTheme]} defaultTheme="dark">
      <YourApp />
    </ThemeProvider>
  );
}
```

## Creating Custom Themes

### Using createAppTheme

The easiest way to create a theme:

```tsx
import { createAppTheme } from '@rhuds/core';

const myTheme = createAppTheme({
  name: 'cyberpunk',
  primaryColor: '#ff00ff',
  secondaryColor: '#00ffff',
  baseUnit: 4,
  fontFamily: 'Orbitron, sans-serif',
});
```

### Manual Theme Creation

For full control:

```tsx
import { createThemeColor, createThemeUnit } from '@rhuds/core';

const customTheme = {
  name: 'custom',
  version: '1.0.0',
  colors: {
    primary: createThemeColor('#00f6ff'),
    secondary: createThemeColor('#7b61ff'),
    success: createThemeColor('#00ff9f'),
    warning: createThemeColor('#ffb800'),
    error: createThemeColor('#ff0055'),
    info: createThemeColor('#00b8ff'),
    neutral: createThemeColor('#8b8b8b'),
    background: createThemeColor('#0a0a0a'),
    text: createThemeColor('#ffffff'),
  },
  units: {
    space: createThemeUnit(4),
    size: createThemeUnit(4),
    radius: createThemeUnit(2),
    shadow: {
      sm: '0 1px 2px rgba(0,0,0,0.1)',
      md: '0 4px 6px rgba(0,0,0,0.1)',
      lg: '0 10px 15px rgba(0,0,0,0.1)',
    },
  },
  typography: {
    fontFamily: {
      primary: 'Orbitron, sans-serif',
      secondary: 'Rajdhani, sans-serif',
      mono: 'Fira Code, monospace',
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      bold: 700,
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
    },
  },
};
```

## Using Themes

### Accessing Theme in Components

```tsx
import { useTheme } from '@rhuds/core';

function MyComponent() {
  const theme = useTheme();
  
  return (
    <div style={{
      color: theme.currentMode.tokens.colors.primary,
      padding: theme.currentMode.tokens.spacing['4'],
      fontFamily: theme.currentMode.tokens.typography.fontFamily,
    }}>
      Themed content
    </div>
  );
}
```

### Switching Themes

```tsx
function ThemeSwitcher() {
  const { setTheme, availableModes } = useTheme();
  
  return (
    <select onChange={(e) => setTheme(e.target.value)}>
      {availableModes.map(mode => (
        <option key={mode.name} value={mode.name}>
          {mode.name}
        </option>
      ))}
    </select>
  );
}
```

## Color System

### Creating Colors

```tsx
import { createThemeColor } from '@rhuds/core';

const primary = createThemeColor('#00f6ff');

// Access variants
console.log(primary.main);        // '#00f6ff'
console.log(primary.light);       // Lighter variant
console.log(primary.dark);        // Darker variant
console.log(primary.alpha(0.5));  // With 50% opacity
```

### Color Utilities

```tsx
import { lighten, darken, adjustAlpha } from '@rhuds/core';

const lighter = lighten('#00f6ff', 0.2);  // 20% lighter
const darker = darken('#00f6ff', 0.2);    // 20% darker
const transparent = adjustAlpha('#00f6ff', 0.5);  // 50% opacity
```

## Typography

### Font Families

```tsx
const typography = {
  fontFamily: {
    primary: 'Orbitron, sans-serif',    // For body text
    secondary: 'Rajdhani, sans-serif',  // For headings
    mono: 'Fira Code, monospace',       // For code
  },
};
```

### Font Sizes

```tsx
const typography = {
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem',// 30px
    '4xl': '2.25rem', // 36px
  },
};
```

## Spacing System

### Unit Scale

RHUDS uses a numeric scale (0-10) for spacing:

```tsx
const spacing = {
  0: '0px',      // 0
  1: '4px',      // 1 * baseUnit
  2: '8px',      // 2 * baseUnit
  3: '12px',     // 3 * baseUnit
  4: '16px',     // 4 * baseUnit
  5: '24px',     // 6 * baseUnit
  6: '32px',     // 8 * baseUnit
  7: '48px',     // 12 * baseUnit
  8: '64px',     // 16 * baseUnit
  9: '96px',     // 24 * baseUnit
  10: '128px',   // 32 * baseUnit
};
```

### Using Spacing

```tsx
<div style={{
  padding: theme.currentMode.tokens.spacing['4'],
  margin: theme.currentMode.tokens.spacing['2'],
}}>
  Content
</div>
```

## Breakpoints

### Responsive Design

```tsx
import { useBreakpoint } from '@rhuds/core';

function ResponsiveComponent() {
  const breakpoint = useBreakpoint();
  
  return (
    <div>
      {breakpoint === 'mobile' && <MobileView />}
      {breakpoint === 'tablet' && <TabletView />}
      {breakpoint === 'desktop' && <DesktopView />}
    </div>
  );
}
```

### Custom Breakpoints

```tsx
const customBreakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};
```

## Theme Validation

Validate your theme before using:

```tsx
import { validateTheme } from '@rhuds/core';

const isValid = validateTheme(myTheme);

if (!isValid) {
  console.error('Invalid theme configuration');
}
```

## Best Practices

1. **Use Semantic Colors**: Name colors by purpose (primary, success) not appearance (blue, green)
2. **Consistent Spacing**: Stick to the spacing scale for consistency
3. **Limit Font Sizes**: Use 6-8 font sizes maximum
4. **Test Accessibility**: Ensure sufficient color contrast
5. **Document Custom Themes**: Add comments explaining color choices

## Examples

### Dark Theme

```tsx
const darkTheme = createAppTheme({
  name: 'dark',
  primaryColor: '#00f6ff',
  secondaryColor: '#7b61ff',
  baseUnit: 4,
});
```

### Light Theme

```tsx
const lightTheme = createAppTheme({
  name: 'light',
  primaryColor: '#0066cc',
  secondaryColor: '#6b46c1',
  baseUnit: 4,
});
```

### Neon Theme

```tsx
const neonTheme = createAppTheme({
  name: 'neon',
  primaryColor: '#ff00ff',
  secondaryColor: '#00ffff',
  baseUnit: 4,
  fontFamily: 'Audiowide, sans-serif',
});
```

## Next Steps

- [Animation Guide](./animation.md)
- [Component Customization](./component-customization.md)
- [API Reference](../api/core.md)
