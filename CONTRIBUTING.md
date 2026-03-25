# Contributing to RHUDS Pro

Thank you for your interest in contributing to RHUDS Pro! This document provides guidelines and instructions for contributing.

---

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Setup](#development-setup)
4. [Project Structure](#project-structure)
5. [Cold War Design Guidelines](#cold-war-design-guidelines)
6. [Development Workflow](#development-workflow)
7. [Coding Standards](#coding-standards)
8. [Testing Guidelines](#testing-guidelines)
9. [Documentation](#documentation)
10. [Pull Request Process](#pull-request-process)
11. [Release Process](#release-process)

---

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inspiring community for all. Please be respectful and constructive in all interactions.

### Our Standards

- Use welcoming and inclusive language
- Be respectful of differing viewpoints
- Accept constructive criticism gracefully
- Focus on what is best for the community
- Show empathy towards other community members

---

## Getting Started

### Prerequisites

- Node.js 18+ or 20+
- npm, yarn, or pnpm
- Git
- Code editor (VS Code recommended)

### First Time Setup

1. **Fork the repository**

   ```bash
   # Click "Fork" on GitHub
   ```

2. **Clone your fork**

   ```bash
   git clone https://github.com/YOUR_USERNAME/rhuds-pro.git
   cd rhuds-pro
   ```

3. **Add upstream remote**

   ```bash
   git remote add upstream https://github.com/original/rhuds-pro.git
   ```

4. **Install dependencies**

   ```bash
   npm install
   ```

5. **Build packages**

   ```bash
   npm run build
   ```

6. **Run tests**
   ```bash
   npm test
   ```

---

## Cold War Design Guidelines

### Color Palette

All new components must use the Cold War tactical color palette:

```typescript
// Primary Colors
--cw-color-primary: #FFB000;        // Tactical Amber
--cw-color-secondary: #33FF00;      // Phosphor Green
--cw-color-error: #FF3333;          // Muted Red
--cw-color-background: #0a0a0c;     // Deep Black
--cw-color-surface: #1a1a1f;        // Surface Gray
--cw-color-text: #f0f0f0;           // Off-White
```

### Typography

All components must use the Cold War monospace font stack:

```css
font-family: 'Share Tech Mono', 'Roboto Mono', 'Courier New', monospace;
```

Font sizes and weights:

- **Headers**: 24px, weight 700, letter-spacing 0.05em, uppercase
- **Body**: 14px, weight 400, letter-spacing 0.01em
- **Buttons**: 14px, weight 600, letter-spacing 0.03em, uppercase
- **Code**: 12px, weight 400, letter-spacing 0.02em

### Geometry

All components must use chamfered corners with clip-path:

```css
/* Button (8px chamfer) */
clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));

/* Input (12px chamfer) */
clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px));

/* Card (12px chamfer) */
clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px));
```

### Animations

All animations must use tactical easing and timing:

```css
/* Timing */
--cw-timing-fast: 100ms;
--cw-timing-normal: 150ms;
--cw-timing-slow: 250ms;

/* Easing */
--cw-easing-tactical: cubic-bezier(0.68, -0.55, 0.265, 1.55);
--cw-easing-snappy: cubic-bezier(0.34, 1.56, 0.64, 1);
--cw-easing-smooth: cubic-bezier(0.25, 0.46, 0.45, 0.94);

/* Usage */
transition: all var(--cw-timing-normal) var(--cw-easing-tactical);
```

### Effects

Components should support Cold War effects:

- **Glow**: `box-shadow: 0 0 10px rgba(255, 176, 0, 0.5);`
- **Scanlines**: Repeating linear gradient overlay
- **Flicker**: CRT flicker animation (150ms)
- **Phosphor**: Soft glow with blur layers

### Component Structure

New components should follow this structure:

```typescript
import React from 'react';
import { getComponentChamferClip } from '@rhuds/core';
import { THEME_VARIANTS } from '@rhuds/core';
import { ANIMATION_TOKENS } from '@rhuds/core';

export interface ColdWarComponentProps {
  /** Component variant */
  variant?: 'primary' | 'secondary' | 'tactical';
  /** Component size */
  size?: 'sm' | 'md' | 'lg';
  /** Theme variant */
  theme?: keyof typeof THEME_VARIANTS;
  /** Apply glow effect */
  glow?: boolean;
  /** Apply scanlines effect */
  scanlines?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Additional inline styles */
  style?: React.CSSProperties;
}

export const ColdWarComponent: React.FC<ColdWarComponentProps> = ({
  variant = 'primary',
  size = 'md',
  theme = 'perseus',
  glow = true,
  scanlines = false,
  className = '',
  style = {},
}) => {
  const baseStyles: React.CSSProperties = {
    fontFamily: "'Share Tech Mono', 'Roboto Mono', 'Courier New', monospace",
    clipPath: getComponentChamferClip('component'),
    transition: `all ${ANIMATION_TOKENS.timing.hover} ${ANIMATION_TOKENS.easing.tactical}`,
    ...style,
  };

  return (
    <div className={className} style={baseStyles}>
      {/* Component content */}
    </div>
  );
};
```

### Testing Cold War Components

All Cold War components must include:

1. **Visual tests** - Verify colors, geometry, and effects
2. **Accessibility tests** - Verify WCAG AA compliance
3. **Animation tests** - Verify 60fps performance
4. **Responsive tests** - Verify mobile/tablet/desktop

```typescript
describe('ColdWarComponent', () => {
  it('should render with correct colors', () => {
    const { container } = render(<ColdWarComponent />);
    const element = container.querySelector('[data-testid="component"]');
    expect(element).toHaveStyle('color: #FFB000');
  });

  it('should have correct clip-path', () => {
    const { container } = render(<ColdWarComponent />);
    const element = container.querySelector('[data-testid="component"]');
    expect(element).toHaveStyle('clip-path: polygon(...)');
  });

  it('should meet WCAG AA contrast', () => {
    // Use axe-core for accessibility testing
    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });

  it('should animate at 60fps', () => {
    // Use performance monitoring
    const startTime = performance.now();
    // Trigger animation
    const endTime = performance.now();
    expect(endTime - startTime).toBeLessThan(16.67); // 60fps = 16.67ms per frame
  });
});
```

---

## Development Setup

### Recommended VS Code Extensions

- ESLint
- Prettier
- TypeScript and JavaScript Language Features
- GitLens

### Environment Setup

```bash
# Create .env file (if needed)
cp .env.example .env

# Install git hooks
npm run prepare
```

---

## Project Structure

```
rhuds-pro/
├── packages/
│   ├── core/           # Core systems (theme, animation, audio)
│   ├── components/     # UI components
│   ├── frames/         # Frame rendering
│   ├── backgrounds/    # Background effects
│   ├── hooks/          # Custom hooks
│   ├── sfx/            # Sound effects
│   ├── cli/            # CLI tools
│   └── demo-app/       # Demo application
├── docs/               # Documentation
├── .github/            # GitHub workflows
└── turbo.json          # Turborepo configuration
```

### Package Dependencies

```
@rhuds/core (base)
  ↓
@rhuds/components → @rhuds/hooks
  ↓
@rhuds/frames, @rhuds/backgrounds
  ↓
@rhuds/demo-app
```

---

## Development Workflow

### 1. Create a Branch

```bash
# Update main branch
git checkout main
git pull upstream main

# Create feature branch
git checkout -b feature/your-feature-name

# Or bug fix branch
git checkout -b fix/bug-description
```

### Branch Naming Convention

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Test additions/changes
- `chore/` - Maintenance tasks

### 2. Make Changes

```bash
# Make your changes
# ...

# Run tests
npm test

# Run linter
npm run lint

# Format code
npm run format
```

### 3. Commit Changes

We use conventional commits:

```bash
# Format: <type>(<scope>): <subject>

git commit -m "feat(components): add new Button variant"
git commit -m "fix(theme): resolve color contrast issue"
git commit -m "docs(hooks): update useTheme documentation"
```

**Commit Types:**

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Code style (formatting)
- `refactor` - Code refactoring
- `test` - Tests
- `chore` - Maintenance

### 4. Push Changes

```bash
git push origin feature/your-feature-name
```

### 5. Create Pull Request

1. Go to GitHub
2. Click "New Pull Request"
3. Fill in the PR template
4. Request review

---

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Define proper types and interfaces
- Avoid `any` type
- Use strict mode

```typescript
// Good
interface ButtonProps {
  variant: 'primary' | 'secondary';
  onClick: () => void;
}

// Bad
interface ButtonProps {
  variant: any;
  onClick: any;
}
```

### React Components

- Use functional components
- Use hooks for state management
- Implement proper prop types
- Add JSDoc comments

```typescript
/**
 * Button component with multiple variants
 *
 * @param variant - Button style variant
 * @param onClick - Click handler
 */
export function Button({ variant, onClick }: ButtonProps) {
  // Implementation
}
```

### File Naming

- Components: `PascalCase.tsx`
- Hooks: `camelCase.ts`
- Utilities: `camelCase.ts`
- Tests: `*.test.tsx` or `*.test.ts`

### Code Style

- Use 2 spaces for indentation
- Use single quotes for strings
- Add trailing commas
- Max line length: 100 characters

```typescript
// Good
const config = {
  name: 'example',
  value: 42,
};

// Bad
const config = {
  name: 'example',
  value: 42,
};
```

---

## Testing Guidelines

### Test Structure

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click me</Button>);
    screen.getByText('Click me').click();
    expect(onClick).toHaveBeenCalled();
  });
});
```

### Test Coverage

- Aim for 80%+ coverage
- Test all public APIs
- Test edge cases
- Test error handling

### Running Tests

```bash
# Run all tests
npm test

# Run specific package tests
npm test --workspace=@rhuds/components

# Run with coverage
npm test -- --coverage

# Watch mode
npm test -- --watch
```

---

## Documentation

### Code Documentation

- Add JSDoc comments to all public APIs
- Include examples in documentation
- Document parameters and return types

````typescript
/**
 * Create a new theme
 *
 * @param config - Theme configuration
 * @returns Complete theme object
 *
 * @example
 * ```typescript
 * const theme = createTheme({
 *   name: 'dark',
 *   colors: { primary: '#0066cc' }
 * });
 * ```
 */
export function createTheme(config: ThemeConfig): Theme {
  // Implementation
}
````

### README Files

- Each package should have a README
- Include installation instructions
- Provide usage examples
- Document all exports

### API Documentation

- Update API docs when adding features
- Keep examples up to date
- Document breaking changes

---

## Pull Request Process

### Before Submitting

- [ ] Tests pass locally
- [ ] Code is formatted
- [ ] No linting errors
- [ ] Documentation is updated
- [ ] Commit messages follow convention
- [ ] Branch is up to date with main

### PR Template

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing

How has this been tested?

## Checklist

- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No breaking changes
- [ ] Follows coding standards
```

### Review Process

1. Automated checks run (CI/CD)
2. Code review by maintainers
3. Address feedback
4. Approval and merge

### After Merge

- Delete your branch
- Update your fork
- Celebrate! 🎉

---

## Release Process

### Versioning

We use Semantic Versioning (SemVer):

- **MAJOR**: Breaking changes
- **MINOR**: New features (backward compatible)
- **PATCH**: Bug fixes

### Release Steps

1. Update version in package.json
2. Update CHANGELOG.md
3. Create git tag
4. Push to npm
5. Create GitHub release

---

## Getting Help

### Resources

- [Documentation](./docs)
- [API Reference](./packages/components/COMPONENTS_API.md)
- [GitHub Issues](https://github.com/yourusername/rhuds-pro/issues)
- [GitHub Discussions](https://github.com/yourusername/rhuds-pro/discussions)

### Questions?

- Open a discussion on GitHub
- Ask in issues (use "question" label)
- Check existing documentation

---

## Recognition

Contributors will be:

- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Credited in documentation

---

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to RHUDS Pro! 🚀
