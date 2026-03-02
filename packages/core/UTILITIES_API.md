# RHUDS Utilities API Documentation

Utility functions and helpers for RHUDS Pro.

---

## Table of Contents

1. [Color Utilities](#color-utilities)
2. [Theme Utilities](#theme-utilities)
3. [Animation Utilities](#animation-utilities)
4. [Validation Utilities](#validation-utilities)
5. [Format Utilities](#format-utilities)

---

## Color Utilities

### Color Conversion

#### hexToRgb

Convert HEX color to RGB.

```typescript
import { hexToRgb } from '@rhuds/core';

const rgb = hexToRgb('#FF0000');
// { r: 255, g: 0, b: 0 }
```

#### rgbToHex

Convert RGB color to HEX.

```typescript
import { rgbToHex } from '@rhuds/core';

const hex = rgbToHex(255, 0, 0);
// '#FF0000'
```

#### rgbToHsl

Convert RGB color to HSL.

```typescript
import { rgbToHsl } from '@rhuds/core';

const hsl = rgbToHsl(255, 0, 0);
// { h: 0, s: 100, l: 50 }
```

#### hslToRgb

Convert HSL color to RGB.

```typescript
import { hslToRgb } from '@rhuds/core';

const rgb = hslToRgb(0, 100, 50);
// { r: 255, g: 0, b: 0 }
```

### Color Manipulation

#### lighten

Lighten a color.

```typescript
import { lighten } from '@rhuds/core';

const lighter = lighten('#FF0000', 0.2);
// Lighter red
```

#### darken

Darken a color.

```typescript
import { darken } from '@rhuds/core';

const darker = darken('#FF0000', 0.2);
// Darker red
```

#### saturate

Increase color saturation.

```typescript
import { saturate } from '@rhuds/core';

const saturated = saturate('#FF0000', 0.2);
// More saturated red
```

#### desaturate

Decrease color saturation.

```typescript
import { desaturate } from '@rhuds/core';

const desaturated = desaturate('#FF0000', 0.2);
// Less saturated red
```

#### generateColorVariations

Generate color variations.

```typescript
import { generateColorVariations } from '@rhuds/core';

const variations = generateColorVariations('#FF0000', {
  lighten: [0.1, 0.2, 0.3],
  darken: [0.1, 0.2, 0.3],
});
// { light: [...], dark: [...] }
```

### Alpha Channel

#### alpha

Add alpha channel to color.

```typescript
import { alpha } from '@rhuds/core';

const transparent = alpha('#FF0000', 0.5);
// 'rgba(255, 0, 0, 0.5)'
```

#### createAlphaFunction

Create alpha function for color.

```typescript
import { createAlphaFunction } from '@rhuds/core';

const alphaFn = createAlphaFunction('#FF0000');
const transparent = alphaFn(0.5);
// 'rgba(255, 0, 0, 0.5)'
```

### Gradients

#### createGradient

Create gradient definition.

```typescript
import { createGradient } from '@rhuds/core';

const gradient = createGradient({
  type: 'linear',
  angle: 45,
  colors: ['#FF0000', '#00FF00'],
});
```

#### createLinearGradient

Create linear gradient.

```typescript
import { createLinearGradient } from '@rhuds/core';

const gradient = createLinearGradient({
  angle: 45,
  colors: ['#FF0000', '#00FF00'],
});
// 'linear-gradient(45deg, #FF0000, #00FF00)'
```

#### createRadialGradient

Create radial gradient.

```typescript
import { createRadialGradient } from '@rhuds/core';

const gradient = createRadialGradient({
  colors: ['#FF0000', '#00FF00'],
});
// 'radial-gradient(circle, #FF0000, #00FF00)'
```

### Accessibility

#### getContrastRatio

Calculate contrast ratio between two colors.

```typescript
import { getContrastRatio } from '@rhuds/core';

const ratio = getContrastRatio('#FFFFFF', '#000000');
// 21 (maximum contrast)
```

#### isAccessibleColor

Check if color combination is accessible.

```typescript
import { isAccessibleColor } from '@rhuds/core';

const isAccessible = isAccessibleColor('#FFFFFF', '#000000', 'AAA');
// true (WCAG AAA compliant)
```

#### findAccessibleColor

Find accessible color from palette.

```typescript
import { findAccessibleColor } from '@rhuds/core';

const color = findAccessibleColor('#FFFFFF', palette, 'AA');
// Returns accessible color from palette
```

---

## Theme Utilities

### Theme Creation

#### createTheme

Create a new theme.

```typescript
import { createTheme } from '@rhuds/core';

const theme = createTheme({
  name: 'custom',
  colors: {
    primary: '#FF0000',
    secondary: '#00FF00',
  },
});
```

#### extendTheme

Extend existing theme.

```typescript
import { extendTheme } from '@rhuds/core';

const extendedTheme = extendTheme(baseTheme, {
  colors: {
    primary: '#FF0000',
  },
});
```

#### composeThemes

Compose multiple themes.

```typescript
import { composeThemes } from '@rhuds/core';

const composedTheme = composeThemes(theme1, theme2, theme3);
```

### Theme Management

#### getSystemThemePreference

Get system theme preference.

```typescript
import { getSystemThemePreference } from '@rhuds/core';

const preference = getSystemThemePreference();
// 'light' or 'dark'
```

#### watchSystemThemePreference

Watch system theme preference changes.

```typescript
import { watchSystemThemePreference } from '@rhuds/core';

const unwatch = watchSystemThemePreference((preference) => {
  console.log('System theme changed to:', preference);
});

// Stop watching
unwatch();
```

---

## Animation Utilities

### Easing Functions

#### easeIn

Ease in animation.

```typescript
import { easeIn } from '@rhuds/core';

const value = easeIn(0.5); // 0.25
```

#### easeOut

Ease out animation.

```typescript
import { easeOut } from '@rhuds/core';

const value = easeOut(0.5); // 0.75
```

#### easeInOut

Ease in-out animation.

```typescript
import { easeInOut } from '@rhuds/core';

const value = easeInOut(0.5); // 0.5
```

#### easeInQuad, easeOutQuad, easeInOutQuad

Quadratic easing functions.

```typescript
import { easeInQuad, easeOutQuad, easeInOutQuad } from '@rhuds/core';

const value1 = easeInQuad(0.5);
const value2 = easeOutQuad(0.5);
const value3 = easeInOutQuad(0.5);
```

#### easeInCubic, easeOutCubic, easeInOutCubic

Cubic easing functions.

```typescript
import { easeInCubic, easeOutCubic, easeInOutCubic } from '@rhuds/core';

const value1 = easeInCubic(0.5);
const value2 = easeOutCubic(0.5);
const value3 = easeInOutCubic(0.5);
```

### Animation Helpers

#### interpolateColor

Interpolate between two colors.

```typescript
import { interpolateColor } from '@rhuds/core';

const color = interpolateColor('#FF0000', '#00FF00', 0.5);
// Midpoint color between red and green
```

#### createColorTransitionKeyframes

Create color transition keyframes.

```typescript
import { createColorTransitionKeyframes } from '@rhuds/core';

const keyframes = createColorTransitionKeyframes(
  '#FF0000',
  '#00FF00',
  5
);
// [0%, 25%, 50%, 75%, 100%] keyframes
```

---

## Validation Utilities

### Email Validation

#### isValidEmail

Check if email is valid.

```typescript
import { isValidEmail } from '@rhuds/core';

const valid = isValidEmail('user@example.com');
// true
```

### URL Validation

#### isValidUrl

Check if URL is valid.

```typescript
import { isValidUrl } from '@rhuds/core';

const valid = isValidUrl('https://example.com');
// true
```

### Number Validation

#### isValidNumber

Check if value is valid number.

```typescript
import { isValidNumber } from '@rhuds/core';

const valid = isValidNumber('123');
// true
```

#### isInRange

Check if number is in range.

```typescript
import { isInRange } from '@rhuds/core';

const valid = isInRange(50, 0, 100);
// true
```

### String Validation

#### isValidLength

Check if string length is valid.

```typescript
import { isValidLength } from '@rhuds/core';

const valid = isValidLength('password', 8, 20);
// true if length is between 8 and 20
```

#### hasSpecialCharacters

Check if string has special characters.

```typescript
import { hasSpecialCharacters } from '@rhuds/core';

const has = hasSpecialCharacters('pass@word');
// true
```

---

## Format Utilities

### Number Formatting

#### formatNumber

Format number with separators.

```typescript
import { formatNumber } from '@rhuds/core';

const formatted = formatNumber(1234567);
// '1,234,567'
```

#### formatCurrency

Format number as currency.

```typescript
import { formatCurrency } from '@rhuds/core';

const formatted = formatCurrency(1234.56, 'USD');
// '$1,234.56'
```

#### formatPercent

Format number as percentage.

```typescript
import { formatPercent } from '@rhuds/core';

const formatted = formatPercent(0.75);
// '75%'
```

### Date Formatting

#### formatDate

Format date.

```typescript
import { formatDate } from '@rhuds/core';

const formatted = formatDate(new Date(), 'MM/DD/YYYY');
// '03/02/2026'
```

#### formatTime

Format time.

```typescript
import { formatTime } from '@rhuds/core';

const formatted = formatTime(new Date(), 'HH:mm:ss');
// '14:30:45'
```

#### formatRelativeTime

Format relative time.

```typescript
import { formatRelativeTime } from '@rhuds/core';

const formatted = formatRelativeTime(new Date(Date.now() - 3600000));
// '1 hour ago'
```

### String Formatting

#### capitalize

Capitalize string.

```typescript
import { capitalize } from '@rhuds/core';

const capitalized = capitalize('hello');
// 'Hello'
```

#### camelCase

Convert to camel case.

```typescript
import { camelCase } from '@rhuds/core';

const camel = camelCase('hello-world');
// 'helloWorld'
```

#### kebabCase

Convert to kebab case.

```typescript
import { kebabCase } from '@rhuds/core';

const kebab = kebabCase('helloWorld');
// 'hello-world'
```

#### snakeCase

Convert to snake case.

```typescript
import { snakeCase } from '@rhuds/core';

const snake = snakeCase('helloWorld');
// 'hello_world'
```

#### truncate

Truncate string.

```typescript
import { truncate } from '@rhuds/core';

const truncated = truncate('Hello World', 5);
// 'Hello...'
```

---

## Best Practices

### 1. Color Utilities

Always validate colors before using:

```typescript
import { isValidHexColor } from '@rhuds/core';

if (isValidHexColor(color)) {
  // Use color
}
```

### 2. Theme Utilities

Use theme utilities for consistency:

```typescript
import { extendTheme } from '@rhuds/core';

const customTheme = extendTheme(baseTheme, customizations);
```

### 3. Validation Utilities

Validate user input:

```typescript
import { isValidEmail } from '@rhuds/core';

if (isValidEmail(email)) {
  // Process email
}
```

### 4. Format Utilities

Format output for display:

```typescript
import { formatCurrency } from '@rhuds/core';

const display = formatCurrency(price, 'USD');
```

---

## TypeScript Support

All utilities have full TypeScript support:

```typescript
import { formatNumber } from '@rhuds/core';

const result: string = formatNumber(1234567);
```

---

**Last Updated**: March 2, 2026  
**Version**: 0.1.0
