# Installation

## Package Manager

RHUDS is available as multiple npm packages. Install only what you need.

### Core Package (Required)

```bash
npm install @rhuds/core
```

The core package includes:
- Theme system
- Animation engine
- Audio system
- State management
- Base utilities

### Components Package

```bash
npm install @rhuds/components
```

Includes 49+ UI components:
- Basic components (Button, Text, Icon, etc.)
- Form components (Input, Select, Checkbox, etc.)
- Navigation components (Tabs, Pagination, etc.)
- Advanced components (Modal, Dropdown, Accordion, etc.)

### Optional Packages

```bash
# Decorative frames
npm install @rhuds/frames

# Background effects
npm install @rhuds/backgrounds

# WebGL 3D components
npm install @rhuds/webgl

# Custom hooks
npm install @rhuds/hooks
```

## Peer Dependencies

RHUDS requires React 18+:

```bash
npm install react@^18.0.0 react-dom@^18.0.0
```

## TypeScript

RHUDS is written in TypeScript and includes type definitions. No additional setup required.

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
```

## CDN (Not Recommended)

For quick prototyping, you can use unpkg:

```html
<script src="https://unpkg.com/@rhuds/core@latest/dist/index.js"></script>
<script src="https://unpkg.com/@rhuds/components@latest/dist/index.js"></script>
```

## Verify Installation

Create a test file to verify installation:

```tsx
import { Button } from '@rhuds/components';
import { ThemeProvider } from '@rhuds/core';

function Test() {
  return (
    <ThemeProvider>
      <Button>Test Button</Button>
    </ThemeProvider>
  );
}
```

## Troubleshooting

### Module Not Found

If you see module errors, ensure all peer dependencies are installed:

```bash
npm install react react-dom
```

### TypeScript Errors

Add `skipLibCheck: true` to your tsconfig.json:

```json
{
  "compilerOptions": {
    "skipLibCheck": true
  }
}
```

### Build Errors

Clear your node_modules and reinstall:

```bash
rm -rf node_modules package-lock.json
npm install
```

## Next Steps

- [Getting Started Guide](./getting-started.md)
- [Project Structure](./project-structure.md)
- [API Reference](./api/)
