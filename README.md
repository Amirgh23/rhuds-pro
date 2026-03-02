# RHUDS Pro - Advanced React UI Design System

<div align="center">

![RHUDS Pro](https://img.shields.io/badge/RHUDS-Pro-blue)
![Version](https://img.shields.io/badge/version-0.1.0-green)
![License](https://img.shields.io/badge/license-MIT-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue)

**A comprehensive, production-ready React UI design system with advanced theming, animations, and audio capabilities.**

[Features](#features) • [Installation](#installation) • [Documentation](#documentation) • [Examples](#examples) • [Contributing](#contributing)

</div>

---

## 🚀 Features

### Core Systems
- **🎨 Advanced Theme Engine** - Runtime theme switching, persistence, cross-tab sync
- **🌈 Color System** - 20+ manipulation functions, WCAG accessibility compliance
- **✨ Animation System** - Physics-based, gesture-driven, scroll-triggered animations
- **🔊 3D Spatial Audio** - Web Audio API integration with effects pipeline
- **📦 State Management** - Redux Toolkit with undo/redo support
- **🖼️ Frame Rendering** - 6 SVG frame variants with clipping paths
- **🌌 Background Effects** - 8 particle-based animated backgrounds

### UI Components (42 Total)
- **Basic**: Text, Button, Icon, Input, Select
- **Layout**: Grid, Container, Stack
- **Form**: Checkbox, Radio, Switch, validation
- **Navigation**: Navbar, Sidebar, Breadcrumb, Tabs, Menu, Pagination
- **Data Display**: Table, DataGrid (virtual scrolling), Tree
- **Feedback**: Modal, Dialog, Notification
- **Utility**: Tooltip, Popover, Dropdown
- **Advanced**: Carousel, Accordion, Stepper

### Developer Experience
- **📚 15 Custom Hooks** - Theme, animation, audio, form, utility hooks
- **🛠️ 50+ Utilities** - Color, format, validation, animation helpers
- **📖 Comprehensive Docs** - 5,000+ lines of documentation
- **🧪 370+ Tests** - Full test coverage with Vitest
- **📦 Monorepo** - Turborepo with optimized builds
- **🎯 TypeScript** - 100% type coverage

---

## 📦 Installation

### Prerequisites
- Node.js 18+ or 20+
- npm, yarn, or pnpm

### Quick Start

```bash
# Install all packages
npm install @rhuds/core @rhuds/components @rhuds/hooks

# Or install individually
npm install @rhuds/core        # Core systems
npm install @rhuds/components  # UI components
npm install @rhuds/hooks       # Custom hooks
npm install @rhuds/frames      # Frame rendering
npm install @rhuds/backgrounds # Background effects
```

### Basic Setup

```tsx
import React from 'react';
import { ThemeProvider, createAppTheme } from '@rhuds/core';
import { Button, Text } from '@rhuds/components';

const theme = createAppTheme({
  name: 'my-theme',
  colors: {
    primary: '#0066cc',
    secondary: '#6c757d',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Text variant="h1">Welcome to RHUDS Pro</Text>
      <Button variant="primary">Get Started</Button>
    </ThemeProvider>
  );
}

export default App;
```

---

## 📖 Documentation

### Core Documentation
- [Theme System Guide](./packages/core/src/theme/THEME_SWITCHING_GUIDE.md)
- [Animation Guide](./packages/core/src/animation/ANIMATION_GUIDE.md)
- [Utilities API](./packages/core/UTILITIES_API.md)

### Component Documentation
- [Components API](./packages/components/COMPONENTS_API.md) - All 42 components
- [Hooks API](./packages/hooks/HOOKS_API.md) - All 15 hooks
- [Installation Guide](./INSTALLATION_GUIDE.md) - Detailed setup instructions

### Package READMEs
- [@rhuds/core](./packages/core/README.md)
- [@rhuds/components](./packages/components/README.md)
- [@rhuds/backgrounds](./packages/backgrounds/README.md)

---

## 🎯 Quick Examples

### Theme Switching

```tsx
import { useTheme } from '@rhuds/core';

function ThemeSwitcher() {
  const { currentMode, setTheme } = useTheme();
  
  return (
    <button onClick={() => setTheme('dark')}>
      Current: {currentMode}
    </button>
  );
}
```

### Animated Components

```tsx
import { Animator } from '@rhuds/core';
import { Button } from '@rhuds/components';

function AnimatedButton() {
  return (
    <Animator>
      <Button variant="primary">
        Hover me!
      </Button>
    </Animator>
  );
}
```

### Data Grid with Virtual Scrolling

```tsx
import { DataGrid } from '@rhuds/components';

function MyDataGrid() {
  const data = Array.from({ length: 10000 }, (_, i) => ({
    id: i,
    name: `Item ${i}`,
    value: Math.random() * 100,
  }));

  return (
    <DataGrid
      data={data}
      columns={[
        { key: 'id', label: 'ID', sortable: true },
        { key: 'name', label: 'Name', filterable: true },
        { key: 'value', label: 'Value', sortable: true },
      ]}
      virtualScroll
      height={600}
    />
  );
}
```

### Background Effects

```tsx
import { Dots, Nebula } from '@rhuds/backgrounds';

function MyBackground() {
  return (
    <>
      <Dots pattern="grid" size={2} spacing={50} />
      <Nebula colors={['#ff0080', '#7928ca']} />
    </>
  );
}
```

### Custom Hooks

```tsx
import { useLocalStorage, useDebounce } from '@rhuds/hooks';

function SearchComponent() {
  const [search, setSearch] = useLocalStorage('search', '');
  const debouncedSearch = useDebounce(search, 500);
  
  // Use debouncedSearch for API calls
  return (
    <input
      value={search}
      onChange={(e) => setSearch(e.target.value)}
    />
  );
}
```

---

## 🏗️ Architecture

### Monorepo Structure

```
packages/
├── core/           # Theme, animation, audio, state
├── components/     # 42 UI components
├── frames/         # SVG frame rendering
├── backgrounds/    # Particle effects
├── hooks/          # 15 custom hooks
├── sfx/            # Sound effects
├── cli/            # CLI tools
└── demo-app/       # Demo application
```

### Technology Stack
- **Framework**: React 18+ with TypeScript
- **Build**: Vite + Turborepo
- **State**: Redux Toolkit
- **Testing**: Vitest + Jest
- **Styling**: CSS-in-JS (inline styles + theme system)
- **Animation**: Custom animation system
- **Audio**: Web Audio API

---

## 🎨 Theming

RHUDS Pro includes a powerful theming system:

```tsx
import { createAppTheme, ThemeProvider } from '@rhuds/core';

const customTheme = createAppTheme({
  name: 'custom',
  colors: {
    primary: '#0066cc',
    secondary: '#6c757d',
    accent: '#ff0080',
    background: '#ffffff',
    surface: '#f8f9fa',
    text: '#212529',
    border: '#dee2e6',
    success: '#28a745',
    warning: '#ffc107',
    error: '#dc3545',
    info: '#17a2b8',
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      md: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 576,
      md: 768,
      lg: 992,
      xl: 1200,
    },
  },
});

<ThemeProvider theme={customTheme}>
  <App />
</ThemeProvider>
```

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests for specific package
npm test --workspace=@rhuds/components

# Run tests in watch mode
npm test -- --watch

# Generate coverage report
npm test -- --coverage
```

---

## 🚀 Building

```bash
# Build all packages
npm run build

# Build specific package
npm run build --workspace=@rhuds/core

# Development mode
npm run dev
```

---

## 📊 Performance

- **Component Render**: <16ms (60fps)
- **Animations**: 60fps
- **Audio Latency**: <50ms
- **Virtual Scrolling**: <16ms per frame
- **Theme Switch**: <100ms
- **Bundle Size**: <500KB (gzipped)

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

### Development Setup

```bash
# Clone repository
git clone https://github.com/yourusername/rhuds-pro.git
cd rhuds-pro

# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test
```

---

## 📝 License

MIT License - see [LICENSE](./LICENSE) file for details.

---

## 🙏 Acknowledgments

- Built with React, TypeScript, and Vite
- Inspired by modern design systems
- Community feedback and contributions

---

## 📞 Support

- **Documentation**: [Full Docs](./docs)
- **Issues**: [GitHub Issues](https://github.com/yourusername/rhuds-pro/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/rhuds-pro/discussions)

---

## 🗺️ Roadmap

- [ ] Additional component variants
- [ ] More animation presets
- [ ] Enhanced accessibility features
- [ ] Internationalization support
- [ ] Storybook integration
- [ ] Figma design kit

---

<div align="center">

**Made with ❤️ by the RHUDS Pro Team**

[⬆ Back to Top](#rhuds-pro---advanced-react-ui-design-system)

</div>
