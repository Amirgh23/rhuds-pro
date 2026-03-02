# 🚀 RHUDS - How to Run the Project

## Prerequisites

Before running the project, ensure you have:
- **Node.js** >= 18.0.0 ([Download](https://nodejs.org/))
- **npm** (comes with Node.js) or **yarn** or **pnpm**

## Step 1: Install Dependencies

```bash
# Using npm (recommended)
npm install

# Or using yarn
yarn install

# Or using pnpm
pnpm install
```

This will install all dependencies for the monorepo and all packages.

## Step 2: Choose How to Run

### Option A: Run Demo Application (Recommended) 🎯

The demo app showcases all components with interactive features.

```bash
npm run demo
```

**Output:**
```
  VITE v4.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

**Access the app**: Open your browser and go to `http://localhost:5173`

**Features in Demo App:**
- 🎨 Theme Switcher - Switch between 5 themes
- 🧩 Component Showcase - View all 20 components
- 🎬 Animation Demo - See animations in action
- 🔊 Sound Effects - Test sound effects
- 📱 Responsive Design - Test on different screen sizes

---

### Option B: View Component Documentation (Storybook) 📖

Storybook provides interactive documentation for all components.

```bash
npm run storybook
```

**Output:**
```
  Storybook 7.x.x started
  ➜ Local:   http://localhost:6006/
```

**Access Storybook**: Open your browser and go to `http://localhost:6006`

**Features in Storybook:**
- 📚 Component Stories - All 20 components documented
- 🎨 Theme Switcher - Test components in different themes
- ♿ Accessibility Panel - Check accessibility features
- 📝 Code Examples - View component usage code
- 🔍 Props Documentation - See all available props

---

### Option C: Run All Development Servers 🔄

Run all dev servers simultaneously (requires Turborepo).

```bash
npm run dev
```

This will start:
- Demo app on `http://localhost:5173`
- Storybook on `http://localhost:6006`
- Other package dev servers

---

### Option D: Build for Production 📦

Create optimized production builds.

```bash
# Build all packages
npm run build

# Build specific package
cd packages/core && npm run build
```

**Output:**
```
dist/
├── core/
├── hooks/
├── utils/
└── sfx/
```

---

## Step 3: Run Tests (Optional)

```bash
# Run all tests
npm run test

# Run tests in watch mode (re-run on file changes)
npm run test:watch

# Run tests for specific package
cd packages/core && npm run test
```

---

## Step 4: Lint and Format Code (Optional)

```bash
# Check code quality
npm run lint

# Auto-format code
npm run format
```

---

## 🎯 Quick Reference

| Task | Command | URL |
|------|---------|-----|
| **Run Demo App** | `npm run demo` | http://localhost:5173 |
| **View Storybook** | `npm run storybook` | http://localhost:6006 |
| **Run All Servers** | `npm run dev` | Multiple |
| **Run Tests** | `npm run test` | - |
| **Build Production** | `npm run build` | - |
| **Lint Code** | `npm run lint` | - |
| **Format Code** | `npm run format` | - |

---

## 📁 Project Structure

```
rhuds/
├── packages/
│   ├── core/              # Main component library
│   │   ├── src/
│   │   │   ├── components/    # 20 components
│   │   │   ├── theme/         # Theme system
│   │   │   └── store/         # Redux store
│   │   └── package.json
│   ├── hooks/             # Custom React hooks
│   ├── utils/             # Utility functions
│   ├── sfx/               # Sound effects engine
│   ├── storybook/         # Storybook configuration
│   └── demo-app/          # Demo application
├── .github/workflows/     # CI/CD pipelines
├── tsconfig.json          # TypeScript config
├── jest.config.js         # Jest config
├── turbo.json             # Turborepo config
└── package.json           # Root package config
```

---

## 🎨 What You'll See

### Demo App Features
- **Home Page** - Project overview
- **Components Showcase** - All 20 components with examples
- **Theme Customization** - Switch between 5 themes
- **Sound Effects Demo** - Test all 6 sound effects
- **Animations Demo** - See animations in action
- **Responsive Layout** - Test on mobile/tablet/desktop

### Storybook Features
- **Component Stories** - Interactive component examples
- **Props Documentation** - All available props listed
- **Accessibility Panel** - Check ARIA attributes
- **Theme Switcher** - Test in different themes
- **Code Examples** - Copy-paste ready code

---

## 🐛 Troubleshooting

### Issue: Port Already in Use

**Error**: `EADDRINUSE: address already in use :::5173`

**Solution**:
```bash
# Kill the process using the port
# On Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Or use a different port:
cd packages/demo-app && npm run dev -- --port 3000
```

### Issue: Dependencies Not Installed

**Error**: `Cannot find module 'react'`

**Solution**:
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

### Issue: TypeScript Errors

**Error**: `Cannot find type definition file for 'jest'`

**Solution**:
```bash
# Install type definitions
npm install --save-dev @types/jest @types/node @types/react @types/react-dom
```

### Issue: Vite Not Found

**Error**: `'vite' is not recognized as an internal or external command`

**Solution**:
```bash
# Reinstall dependencies
npm install

# Or use npx
npx vite
```

---

## 📚 Documentation

- **README.md** - Project overview
- **SETUP_AND_RUN_GUIDE.md** - Detailed setup guide
- **PROJECT_STATUS_REPORT.md** - Comprehensive status report
- **IMPLEMENTATION_STATUS.md** - Implementation details
- **Storybook** - Interactive component documentation

---

## 🎓 Learning Resources

### Component Usage
1. Open Storybook: `npm run storybook`
2. Browse components in the sidebar
3. View code examples for each component
4. Check props documentation

### Theme Customization
1. Open demo app: `npm run demo`
2. Use theme switcher to test themes
3. Check `packages/core/src/theme/themes.ts` for theme definitions

### Sound Effects
1. Open demo app: `npm run demo`
2. Navigate to Sound Effects demo
3. Test different sound effects
4. Check `packages/sfx/src/SoundEffectsEngine.ts` for implementation

### Animations
1. Open demo app: `npm run demo`
2. Navigate to Animations demo
3. See animations in action
4. Check `packages/hooks/src/useComponentAnimation.ts` for hook

---

## 🚀 Next Steps

1. ✅ Install dependencies: `npm install`
2. ✅ Run demo app: `npm run demo`
3. ✅ Explore components
4. ✅ View Storybook: `npm run storybook`
5. ✅ Run tests: `npm run test`
6. ✅ Build for production: `npm run build`

---

## 📞 Support

For issues or questions:
1. Check the documentation files
2. Review component stories in Storybook
3. Check test files for usage examples
4. Review the demo app for implementation examples

---

## ✨ Enjoy!

The RHUDS design system is ready to use. Start exploring the components and building amazing HUD interfaces! 🎉

**Happy coding!** 🚀
