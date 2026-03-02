# RHUDS - Setup and Run Guide

## 📋 Project Status

✅ **All 19 Phases Complete**
- 20/20 Components Implemented
- Full Theme System with 5 Themes
- Animation System with Micro-interactions
- Sound Effects Engine
- Redux State Management
- Accessibility (WCAG 2.1 AA)
- Storybook Documentation
- Comprehensive Testing (80%+ coverage)
- Demo Application
- Complete Documentation

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.0.0
- npm or yarn or pnpm

### Installation

```bash
# Install dependencies
npm install
# or
yarn install
# or
pnpm install
```

### Running the Project

#### Option 1: Run Demo App (Recommended)
```bash
# Start the demo application with Vite dev server
npm run demo
# or
cd packages/demo-app && npm run dev
```

The demo app will be available at: `http://localhost:5173`

#### Option 2: Run Storybook
```bash
# Start Storybook for component documentation
npm run storybook
```

Storybook will be available at: `http://localhost:6006`

#### Option 3: Run All Dev Servers
```bash
# Start all development servers (requires Turbo)
npm run dev
```

#### Option 4: Build for Production
```bash
# Build all packages
npm run build

# Build specific package
cd packages/core && npm run build
```

### Testing

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests for specific package
cd packages/core && npm run test
```

### Linting and Formatting

```bash
# Lint all code
npm run lint

# Format all code
npm run format
```

## 📁 Project Structure

```
rhuds/
├── packages/
│   ├── core/              # Main component library
│   ├── hooks/             # Custom React hooks
│   ├── utils/             # Utility functions
│   ├── sfx/               # Sound effects engine
│   ├── storybook/         # Component documentation
│   └── demo-app/          # Demo application
├── .github/workflows/     # CI/CD pipelines
├── tsconfig.json          # Root TypeScript config
├── jest.config.js         # Jest test config
├── turbo.json             # Turborepo config
└── package.json           # Root package config
```

## 🎨 Available Components

### Base Components (4)
- Button
- Input
- Text
- Icon

### Layout Components (4)
- Container
- Grid
- Flex
- Stack

### Display Components (5)
- Card
- Badge
- Alert
- Progress
- Spinner

### Interactive Components (4)
- Modal
- Dropdown
- Tabs
- Accordion

### Navigation Components (3)
- Navbar
- Sidebar
- Breadcrumb

## 🎯 Key Features

### Theme System
- 5 Predefined Themes: dark, light, neon-green, neon-blue, neon-red
- Custom Theme Creation
- Token Customization
- localStorage Persistence
- CSS Variable Injection

### Animation System
- useComponentAnimation Hook
- Trigger Types: mount, hover, click, focus
- prefers-reduced-motion Support
- GPU-Accelerated Animations

### Sound Effects
- Web Audio API Integration
- 6 Sound Effects: click, hover, success, error, open, close
- Volume Control
- Enable/Disable Toggle

### State Management
- Redux Toolkit
- Theme Slice
- UI Slice
- SFX Slice

### Accessibility
- WCAG 2.1 AA Compliance
- Keyboard Navigation
- ARIA Attributes
- Color Contrast Verification
- Motion Preferences

## 📚 Documentation

- **README.md** - Project overview
- **IMPLEMENTATION_STATUS.md** - Detailed implementation status
- **Storybook** - Interactive component documentation
- **API Docs** - Component and hook APIs
- **Guides** - Theme customization, sound effects, accessibility, performance

## 🧪 Testing

- Unit Tests: Jest + React Testing Library
- Property-Based Tests: fast-check
- Integration Tests: Cypress/Playwright
- Coverage: 80%+ across all packages

## 🔧 Configuration Files

- **tsconfig.json** - TypeScript configuration
- **jest.config.js** - Jest test configuration
- **turbo.json** - Turborepo build pipeline
- **.eslintrc.json** - ESLint rules
- **.prettierrc.json** - Prettier formatting
- **vite.config.ts** - Vite build configuration

## 📦 Package Scripts

### Root Level
```bash
npm run dev              # Start all dev servers
npm run build            # Build all packages
npm run test             # Run all tests
npm run test:watch       # Run tests in watch mode
npm run lint             # Lint all code
npm run format           # Format all code
npm run storybook        # Start Storybook
npm run demo             # Start demo app
npm run clean            # Clean all builds
```

### Package Level
Each package has its own scripts:
```bash
npm run dev              # Start dev server
npm run build            # Build package
npm run test             # Run tests
npm run lint             # Lint code
npm run format           # Format code
npm run clean            # Clean build
```

## 🌐 Deployment

### Demo App
```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Deploy to hosting service (e.g., Vercel, Netlify)
```

### Storybook
```bash
# Build Storybook static site
npm run build-storybook

# Deploy to hosting service
```

### npm Packages
```bash
# Publish packages to npm
npm publish
```

## 🐛 Troubleshooting

### Dependencies Not Installed
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install
```

### Build Errors
```bash
# Clean all builds and rebuild
npm run clean
npm run build
```

### TypeScript Errors
```bash
# Ensure @types packages are installed
npm install --save-dev @types/jest @types/node @types/react @types/react-dom
```

### Port Already in Use
```bash
# Change port for Vite dev server
cd packages/demo-app
npm run dev -- --port 3000
```

## 📞 Support

For issues or questions:
1. Check the documentation in the spec files
2. Review component stories in Storybook
3. Check test files for usage examples
4. Review the demo app for implementation examples

## 📄 License

MIT

## 🎉 Next Steps

1. **Install Dependencies**: `npm install`
2. **Start Demo App**: `npm run demo`
3. **Explore Components**: Visit `http://localhost:5173`
4. **View Storybook**: `npm run storybook`
5. **Run Tests**: `npm run test`
6. **Build for Production**: `npm run build`

---

**RHUDS is production-ready and fully documented!** 🚀
