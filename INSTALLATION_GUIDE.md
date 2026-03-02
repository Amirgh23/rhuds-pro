# RHUDS Pro - Installation Guide

Complete guide for installing and setting up RHUDS Pro in your project.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation Methods](#installation-methods)
3. [Basic Setup](#basic-setup)
4. [Configuration](#configuration)
5. [Verification](#verification)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required
- **Node.js**: 16.x or higher
- **Package Manager**: npm, yarn, or pnpm

### Recommended
- **TypeScript**: 4.5 or higher
- **React**: 18.0 or higher

### Check Your Environment

```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Check pnpm version (if using pnpm)
pnpm --version
```

---

## Installation Methods

### Method 1: Using pnpm (Recommended)

```bash
# Install core package
pnpm add @rhuds/core

# Install components package
pnpm add @rhuds/components

# Install additional packages (optional)
pnpm add @rhuds/backgrounds @rhuds/frames @rhuds/hooks
```

### Method 2: Using npm

```bash
# Install core package
npm install @rhuds/core

# Install components package
npm install @rhuds/components

# Install additional packages (optional)
npm install @rhuds/backgrounds @rhuds/frames @rhuds/hooks
```

### Method 3: Using yarn

```bash
# Install core package
yarn add @rhuds/core

# Install components package
yarn add @rhuds/components

# Install additional packages (optional)
yarn add @rhuds/backgrounds @rhuds/frames @rhuds/hooks
```

---

## Basic Setup

### 1. Wrap Your App with ThemeProvider

```typescript
// src/App.tsx
import React from 'react';
import { ThemeProvider } from '@rhuds/core';
import { Button, Text } from '@rhuds/components';

function App() {
  return (
    <ThemeProvider>
      <div>
        <Text variant="h1">Welcome to RHUDS Pro</Text>
        <Button variant="primary">Get Started</Button>
      </div>
    </ThemeProvider>
  );
}

export default App;
```

### 2. Import Components

```typescript
// Import individual components
import { Button, Text, Input } from '@rhuds/components';

// Import hooks
import { useTheme, useBleeps } from '@rhuds/core';

// Import utilities
import { lighten, darken } from '@rhuds/core';
```

### 3. Use Components

```typescript
function MyComponent() {
  return (
    <div>
      <Text variant="h2">Hello World</Text>
      <Button variant="primary" size="md">
        Click me
      </Button>
    </div>
  );
}
```

---

## Configuration

### TypeScript Configuration

Add to your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "allowImportingTsExtensions": true,
    "strict": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

### Vite Configuration

If using Vite, add to `vite.config.ts`:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['@rhuds/core', '@rhuds/components'],
  },
});
```

### Webpack Configuration

If using Webpack, add to `webpack.config.js`:

```javascript
module.exports = {
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
};
```

---

## Advanced Setup

### With Custom Theme

```typescript
import { ThemeProvider, createTheme } from '@rhuds/core';

const customTheme = createTheme({
  name: 'custom',
  colors: {
    primary: '#FF0000',
    secondary: '#00FF00',
    background: '#000000',
    text: '#FFFFFF',
  },
});

function App() {
  return (
    <ThemeProvider theme={customTheme}>
      <YourApp />
    </ThemeProvider>
  );
}
```

### With Audio System

```typescript
import { BleepsProvider } from '@rhuds/core';

const audioConfig = {
  sounds: {
    click: { src: '/sounds/click.mp3' },
    hover: { src: '/sounds/hover.mp3' },
  },
};

function App() {
  return (
    <ThemeProvider>
      <BleepsProvider config={audioConfig}>
        <YourApp />
      </BleepsProvider>
    </ThemeProvider>
  );
}
```

### With Notification System

```typescript
import { NotificationProvider } from '@rhuds/components';

function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <YourApp />
      </NotificationProvider>
    </ThemeProvider>
  );
}
```

### Complete Setup

```typescript
import React from 'react';
import { ThemeProvider, BleepsProvider } from '@rhuds/core';
import { NotificationProvider } from '@rhuds/components';

function App() {
  return (
    <ThemeProvider>
      <BleepsProvider>
        <NotificationProvider>
          <YourApp />
        </NotificationProvider>
      </BleepsProvider>
    </ThemeProvider>
  );
}

export default App;
```

---

## Verification

### Test Installation

Create a test component to verify installation:

```typescript
// src/TestComponent.tsx
import React from 'react';
import { Button, Text } from '@rhuds/components';
import { useTheme } from '@rhuds/core';

export function TestComponent() {
  const { setTheme } = useTheme();

  return (
    <div>
      <Text variant="h1">RHUDS Pro Test</Text>
      <Button onClick={() => setTheme('dark')}>
        Switch to Dark Theme
      </Button>
    </div>
  );
}
```

### Run Development Server

```bash
# Using Vite
pnpm dev

# Using Create React App
pnpm start

# Using Next.js
pnpm dev
```

### Check Browser Console

Open browser console and verify no errors:
- No TypeScript errors
- No import errors
- Components render correctly

---

## Troubleshooting

### Common Issues

#### Issue 1: Module Not Found

**Error:**
```
Cannot find module '@rhuds/core' or its corresponding type declarations
```

**Solution:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules
pnpm install

# Or clear cache
pnpm store prune
pnpm install
```

#### Issue 2: TypeScript Errors

**Error:**
```
Type 'X' is not assignable to type 'Y'
```

**Solution:**
- Ensure TypeScript version is 4.5 or higher
- Check `tsconfig.json` configuration
- Restart TypeScript server in your IDE

#### Issue 3: Theme Not Applied

**Error:**
Components don't have theme styling

**Solution:**
- Ensure `ThemeProvider` wraps your app
- Check that components are imported correctly
- Verify theme configuration

#### Issue 4: Build Errors

**Error:**
```
Build failed with errors
```

**Solution:**
```bash
# Clear build cache
rm -rf dist
rm -rf .turbo

# Rebuild
pnpm build
```

### Getting Help

If you encounter issues:

1. **Check Documentation**: [Components API](packages/components/COMPONENTS_API.md)
2. **Search Issues**: [GitHub Issues](https://github.com/your-org/rhuds-pro/issues)
3. **Ask Community**: [GitHub Discussions](https://github.com/your-org/rhuds-pro/discussions)
4. **Report Bug**: [New Issue](https://github.com/your-org/rhuds-pro/issues/new)

---

## Next Steps

After installation:

1. **Read Documentation**: [Components API](packages/components/COMPONENTS_API.md)
2. **Try Examples**: [Quick Start Guide](QUICK_START_COMPONENTS.md)
3. **Explore Demos**: Check demo applications in `packages/components/src/__tests__/`
4. **Customize Theme**: [Theme Guide](packages/core/src/theme/THEME_SWITCHING_GUIDE.md)
5. **Add Animations**: [Animation Guide](packages/core/src/animation/ANIMATION_GUIDE.md)

---

## Package Versions

### Core Packages
- `@rhuds/core`: ^0.1.0
- `@rhuds/components`: ^0.1.0

### Optional Packages
- `@rhuds/backgrounds`: ^0.1.0
- `@rhuds/frames`: ^0.1.0
- `@rhuds/hooks`: ^0.1.0

### Peer Dependencies
- `react`: ^18.0.0
- `react-dom`: ^18.0.0

---

## System Requirements

### Minimum
- Node.js 16.x
- 2GB RAM
- Modern browser (Chrome, Firefox, Safari, Edge)

### Recommended
- Node.js 18.x or higher
- 4GB RAM
- Latest browser version

---

## Browser Support

- Chrome: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Edge: Latest 2 versions

---

## Additional Resources

- [Components API](packages/components/COMPONENTS_API.md)
- [Hooks API](packages/hooks/HOOKS_API.md)
- [Utilities API](packages/core/UTILITIES_API.md)
- [Theme Guide](packages/core/src/theme/THEME_SWITCHING_GUIDE.md)
- [Animation Guide](packages/core/src/animation/ANIMATION_GUIDE.md)

---

**Installation complete! You're ready to build with RHUDS Pro.**

**Version**: 0.1.0  
**Last Updated**: March 2, 2026
