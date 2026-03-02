# Getting Started

Get up and running with RHUDS in minutes.

## Installation

Install RHUDS packages using npm or yarn:

```bash
npm install @rhuds/core @rhuds/components
```

Or with yarn:

```bash
yarn add @rhuds/core @rhuds/components
```

## Basic Setup

### 1. Wrap Your App with Providers

```tsx
import React from 'react';
import { ThemeProvider, BleepsProvider } from '@rhuds/core';

function App() {
  return (
    <ThemeProvider>
      <BleepsProvider>
        <YourApp />
      </BleepsProvider>
    </ThemeProvider>
  );
}

export default App;
```

### 2. Use Components

```tsx
import { Button, Text } from '@rhuds/components';

function MyComponent() {
  return (
    <div>
      <Text variant="h1">Welcome to RHUDS</Text>
      <Button variant="primary" onClick={() => console.log('Clicked!')}>
        Click Me
      </Button>
    </div>
  );
}
```

## Create Your First Theme

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

## Next Steps

- [Explore Components](./api/components.md)
- [Learn About Theming](./guides/theming.md)
- [Add Animations](./guides/animation.md)
- [Configure Audio](./guides/audio.md)

## Examples

Check out the [examples directory](./examples/) for complete working examples.
