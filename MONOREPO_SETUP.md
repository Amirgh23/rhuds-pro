# RHUDS Pro Monorepo Setup

This document describes the monorepo infrastructure and build system for RHUDS Pro.

## Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0

### Installing pnpm

```bash
npm install -g pnpm@8
```

## Package Structure

RHUDS Pro is organized as a monorepo with 10 core packages:

1. **@rhuds/core** - Theme engine, animation system, audio system, state management
2. **@rhuds/components** - 100+ UI components across all categories
3. **@rhuds/frames** - SVG-based frame rendering system
4. **@rhuds/backgrounds** - Particle effects and animated backgrounds
5. **@rhuds/webgl** - Three.js integration and custom shaders
6. **@rhuds/hooks** - Custom React hooks for all features
7. **@rhuds/cli** - Command-line tools for scaffolding
8. **@rhuds/devtools** - Browser DevTools extension
9. **@rhuds/testing** - Testing utilities and property test generators
10. **@rhuds/docs** - Documentation site

Additional packages:
- **@rhuds/utils** - Shared utility functions
- **@rhuds/sfx** - Sound effects engine
- **@rhuds/demo-app** - Demo application
- **@rhuds/storybook** - Storybook for component development

## Installation

```bash
# Install dependencies
pnpm install
```

## Development

```bash
# Run all packages in development mode
pnpm dev

# Run specific package
pnpm dev --filter=@rhuds/core

# Run demo app
pnpm demo

# Run Storybook
pnpm storybook

# Run documentation site
pnpm dev --filter=@rhuds/docs
```

## Building

```bash
# Build all packages
pnpm build

# Build specific package
pnpm build --filter=@rhuds/core
```

## Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests for specific package
pnpm test --filter=@rhuds/core
```

## Code Quality

```bash
# Lint all packages
pnpm lint

# Format all code
pnpm format
```

## Monorepo Tools

### Turborepo

Turborepo orchestrates the monorepo build pipeline with:
- **Parallel execution** - Runs tasks across packages in parallel
- **Smart caching** - Caches build outputs for faster rebuilds
- **Dependency graph** - Builds packages in the correct order
- **Remote caching** - Share cache across team (optional)

Configuration: `turbo.json`

### pnpm Workspaces

pnpm manages package dependencies with:
- **Workspace protocol** - Link local packages with `workspace:*`
- **Efficient storage** - Content-addressable storage saves disk space
- **Fast installs** - Parallel installation and linking

Configuration: `pnpm-workspace.yaml`

### TypeScript Project References

TypeScript project references enable:
- **Incremental builds** - Only rebuild changed packages
- **Type checking** - Cross-package type checking
- **IDE support** - Better IntelliSense across packages

Configuration: `tsconfig.json` (root) and `packages/*/tsconfig.json`

## CI/CD Pipeline

GitHub Actions workflow (`.github/workflows/ci.yml`) runs:

1. **Lint** - ESLint checks on all packages
2. **Test** - Vitest tests with coverage
3. **Build** - Production builds of all packages

Triggers on:
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches

## Package Dependencies

```
@rhuds/components
  ├── @rhuds/core
  ├── @rhuds/frames
  ├── @rhuds/backgrounds
  ├── @rhuds/webgl
  └── @rhuds/hooks

@rhuds/frames
  └── @rhuds/core

@rhuds/backgrounds
  └── @rhuds/core

@rhuds/webgl
  └── @rhuds/core

@rhuds/hooks
  └── @rhuds/core

@rhuds/cli
  ├── @rhuds/core
  └── @rhuds/components

@rhuds/devtools
  └── @rhuds/core

@rhuds/testing
  └── @rhuds/core

@rhuds/docs
  ├── @rhuds/core
  ├── @rhuds/components
  ├── @rhuds/frames
  ├── @rhuds/backgrounds
  ├── @rhuds/webgl
  └── @rhuds/hooks
```

## Build System

Each package uses Vite for building:

- **Fast HMR** - Hot module replacement during development
- **Optimized builds** - Tree-shaking and code splitting
- **TypeScript support** - Native TypeScript compilation
- **Library mode** - Builds packages as libraries

Configuration: `packages/*/vite.config.ts`

## Testing Framework

Vitest is used for testing:

- **Fast execution** - Powered by Vite
- **Jest compatible** - Drop-in replacement for Jest
- **Property-based testing** - fast-check integration
- **Coverage reports** - v8 coverage provider

Configuration: `vitest.config.ts` and `packages/*/vite.config.ts`

## Code Quality Tools

### ESLint

- TypeScript support via `@typescript-eslint`
- React rules via `eslint-plugin-react`
- React Hooks rules via `eslint-plugin-react-hooks`

Configuration: `.eslintrc.json`

### Prettier

- Consistent code formatting
- Integrates with ESLint

Configuration: `.prettierrc.json`

## Adding a New Package

1. Create package directory: `packages/my-package/`
2. Add `package.json` with workspace dependencies
3. Add `tsconfig.json` extending root config
4. Add `vite.config.ts` for building
5. Add `src/index.ts` as entry point
6. Update root `tsconfig.json` paths and references
7. Run `pnpm install` to link the package

## Troubleshooting

### pnpm not found

Install pnpm globally:
```bash
npm install -g pnpm@8
```

### Build errors

Clear cache and rebuild:
```bash
pnpm clean
rm -rf node_modules
pnpm install
pnpm build
```

### Type errors across packages

Rebuild TypeScript project references:
```bash
pnpm build --filter=@rhuds/core
pnpm build
```

## Requirements Satisfied

This monorepo setup satisfies **Requirement 78: Monorepo Management**:

✅ 78.1 - Uses Turborepo for monorepo orchestration  
✅ 78.2 - Supports independent package versioning  
✅ 78.3 - Supports shared build cache  
✅ 78.4 - Supports parallel task execution  
✅ 78.5 - Supports workspace dependencies  
✅ 78.6 - Builds dependencies first (via Turborepo)  
✅ 78.7 - Supports selective package building (via --filter)
