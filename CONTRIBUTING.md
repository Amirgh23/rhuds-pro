# Contributing to RHUDS Pro

شکریہ که به RHUDS Pro کمک می‌کنید! این راهنما شامل تمام اطلاعات لازم برای مشارکت است.

## شروع کار

### Prerequisites

- Node.js >= 18
- pnpm >= 8

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

## Development Workflow

### 1. Create a branch

```bash
git checkout -b feature/your-feature-name
```

### 2. Make changes

- Follow the code style (ESLint + Prettier)
- Add tests for new features
- Update documentation

### 3. Run checks

```bash
# Lint
pnpm lint

# Format
pnpm format

# Type check
pnpm type-check

# Test
pnpm test:run

# Check for duplicate exports
pnpm check:duplicates
```

### 4. Commit

```bash
git add .
git commit -m "feat: description of changes"
```

### 5. Push and create PR

```bash
git push origin feature/your-feature-name
```

## Code Style

### TypeScript

- Use strict mode
- Add explicit return types
- Use interfaces for props

### React Components

```typescript
interface ComponentProps {
  children?: ReactNode;
  className?: string;
  // ... other props
}

export const Component: React.FC<ComponentProps> = ({
  children,
  className,
}) => {
  return <div className={className}>{children}</div>;
};
```

### Hooks

```typescript
export function useMyHook() {
  const [state, setState] = useState(null);

  useEffect(() => {
    // cleanup
    return () => {
      // cleanup code
    };
  }, []);

  return state;
}
```

## Testing

### Unit Tests

```typescript
describe('Component', () => {
  it('should render', () => {
    render(<Component />);
    expect(screen.getByText('text')).toBeInTheDocument();
  });
});
```

### Property-Based Tests

```typescript
import fc from 'fast-check';

it('should handle any string', () => {
  fc.assert(
    fc.property(fc.string(), (str) => {
      expect(typeof str).toBe('string');
    })
  );
});
```

## Documentation

### JSDoc Comments

```typescript
/**
 * Brief description
 *
 * @param prop1 - Description of prop1
 * @param prop2 - Description of prop2
 * @returns Description of return value
 * @example
 * const result = myFunction('value');
 */
export function myFunction(prop1: string, prop2: number): string {
  // ...
}
```

### Component Documentation

- Add README.md in component directory
- Include usage examples
- Document all props
- Include screenshots if applicable

## Package Structure

When adding a new component:

```
packages/components/src/Category/
├── Component.tsx          # Main component
├── Component.test.tsx     # Tests
├── Component.demo.tsx     # Demo/example
├── types.ts              # Type definitions
└── README.md             # Documentation
```

## Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style
- `refactor`: Code refactoring
- `perf`: Performance improvement
- `test`: Test addition/modification
- `chore`: Build/dependency changes

### Example

```
feat(components): add new Button variant

- Added CyberButton component
- Added tests
- Updated documentation

Closes #123
```

## Pull Request Process

1. Update documentation
2. Add/update tests
3. Ensure all checks pass
4. Request review from maintainers
5. Address feedback
6. Merge when approved

## Reporting Issues

### Bug Report

- Describe the bug
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots/videos if applicable

### Feature Request

- Describe the feature
- Use cases
- Proposed implementation (optional)

## Questions?

- Check existing issues/discussions
- Read documentation
- Ask in GitHub discussions

## Code of Conduct

- Be respectful
- Be inclusive
- Be constructive
- Report inappropriate behavior

Thank you for contributing! 🎉
