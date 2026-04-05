# RHUDS Pro - Reactive HUD UI Design System

[![CI](https://github.com/yourusername/rhuds-pro/actions/workflows/ci.yml/badge.svg)](https://github.com/yourusername/rhuds-pro/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

یک سیستم طراحی جامع برای ساخت رابط‌های کاربری HUD (Heads-Up Display) با React و TypeScript.

## ✨ ویژگی‌ها

- **100+ Components** - کامپوننت‌های آماده برای استفاده
- **TypeScript** - نوع‌سازی کامل
- **Monorepo** - ساختار منظم با Turbo
- **Animation System** - سیستم انیمیشن پیشرفته
- **Theme System** - سیستم تم قابل تخصیص
- **WebGL Support** - رندرینگ 3D
- **Audio System** - سیستم صدا
- **Chart System** - سیستم نمودار (معادل ChartJS)
- **Accessibility** - پشتیبانی دسترسی‌پذیری
- **Dark Mode** - پشتیبانی حالت تاریک

## 🚀 شروع سریع

### Installation

```bash
npm install @rhuds/components @rhuds/core @rhuds/hooks
# یا
pnpm add @rhuds/components @rhuds/core @rhuds/hooks
```

### Basic Usage

```typescript
import { Button, HudBox } from '@rhuds/components';
import { useTheme } from '@rhuds/core';

export function App() {
  const { theme } = useTheme();

  return (
    <HudBox>
      <Button variant="primary">Click me</Button>
    </HudBox>
  );
}
```

## 📦 Packages

| Package              | Description                             |
| -------------------- | --------------------------------------- |
| `@rhuds/core`        | Core utilities, theme, animation, audio |
| `@rhuds/components`  | 100+ UI components                      |
| `@rhuds/hooks`       | Custom React hooks                      |
| `@rhuds/backgrounds` | Background effects                      |
| `@rhuds/frames`      | SVG frame components                    |
| `@rhuds/charts`      | Chart system                            |
| `@rhuds/webgl`       | WebGL and 3D rendering                  |
| `@rhuds/sfx`         | Sound effects engine                    |

## 📚 Documentation

- [Installation Guide](./INSTALLATION_GUIDE.md)
- [Architecture](./ARCHITECTURE.md)
- [Contributing Guide](./CONTRIBUTING.md)
- [API Documentation](./docs/api/)
- [Component Showcase](./packages/demo-app/)

## 🛠️ Development

### Setup

```bash
# Clone repository
git clone https://github.com/yourusername/rhuds-pro.git
cd rhuds-pro

# Install dependencies
pnpm install

# Start development
pnpm dev
```

### Available Scripts

```bash
# Development
pnpm dev              # Start dev server

# Building
pnpm build            # Build all packages

# Testing
pnpm test             # Run tests in watch mode
pnpm test:run         # Run tests once
pnpm test:coverage    # Generate coverage report

# Code Quality
pnpm lint             # Run ESLint
pnpm format           # Format code with Prettier
pnpm format:check     # Check formatting
pnpm type-check       # Type check with TypeScript

# Utilities
pnpm check:duplicates # Check for duplicate exports
pnpm archive:docs     # Archive old documentation
```

## 🏗️ Project Structure

```
rhuds-pro/
├── packages/
│   ├── core/          # Core utilities
│   ├── components/    # UI components
│   ├── hooks/         # Custom hooks
│   ├── backgrounds/   # Background effects
│   ├── frames/        # Frame components
│   ├── charts/        # Chart system
│   ├── webgl/         # WebGL rendering
│   ├── sfx/           # Sound effects
│   └── demo-app/      # Demo application
├── docs/              # Documentation
├── scripts/           # Utility scripts
└── .github/           # GitHub configuration
```

## 🎨 Components

### Basic Components

- Button, Text, Icon, Input

### Layout Components

- Grid, Container, Stack, HudBox, HudFrame

### Form Components

- Checkbox, Radio, Toggle, Slider, DatePicker, ColorPicker

### Navigation Components

- Navbar, Sidebar, Breadcrumb, Tabs, Menu, Pagination

### Data Display Components

- Table, DataGrid, Tree, Card, GlassCard

### Feedback Components

- Modal, Dialog, Notification, Toast, Alert

### Advanced Components

- Carousel, Accordion, Stepper, FileUpload, CodeEditor

### Loaders

- BinaryLoader, HackerLoader, ProgressLoader, Cube3DLoader

## 🎯 Roadmap

- [ ] Storybook integration
- [ ] Visual regression testing
- [ ] Performance monitoring
- [ ] Accessibility audit
- [ ] Mobile optimization
- [ ] Dark mode improvements
- [ ] More chart types
- [ ] WebXR support

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for details.

## 📄 License

MIT © 2024 RHUDS Pro

## 👨‍💻 Author

**Amirreza Ghaffarian Nakhodi**

- Email: contact@rhuds.dev
- GitHub: [@yourusername](https://github.com/yourusername)

## 🙏 Acknowledgments

- React team for the amazing framework
- TypeScript team for type safety
- All contributors and users

---

**Made with ❤️ for the web development community**
