# Contributing to RHUDS Pro

Thank you for your interest in contributing to RHUDS Pro! This document provides guidelines and instructions for contributing.

---

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Setup](#development-setup)
4. [Project Structure](#project-structure)
5. [Development Workflow](#development-workflow)
6. [Coding Standards](#coding-standards)
7. [Testing Guidelines](#testing-guidelines)
8. [Documentation](#documentation)
9. [Pull Request Process](#pull-request-process)
10. [Release Process](#release-process)

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
  name: "example",
  value: 42
}
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

```typescript
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
```

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
