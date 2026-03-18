# Quick Start: Adding New Components

This is a quick reference for adding new components to @rhuds/components following the CyberLoginForm pattern.

## 5-Minute Setup

### 1. Create Component File

```bash
# Create the component file in the appropriate category
# Example: packages/components/src/Form/MyNewComponent.tsx
```

```typescript
import React from 'react';
import styled from 'styled-components';

export interface MyNewComponentProps {
  // Your props here
  className?: string;
}

export const MyNewComponent: React.FC<MyNewComponentProps> = ({
  className,
}) => {
  return <StyledWrapper className={className}>Content</StyledWrapper>;
};

const StyledWrapper = styled.div`
  /* Your styles */
`;

export default MyNewComponent;
```

### 2. Add Types

Update `packages/components/src/Form/types.ts`:

```typescript
export interface MyNewComponentProps {
  /** Prop description */
  prop?: string;
  className?: string;
}
```

### 3. Export Component

Update `packages/components/src/index.ts`:

```typescript
export { default as MyNewComponent } from './Form/MyNewComponent';
export type { MyNewComponentProps } from './Form/types';
```

### 4. Build

```bash
cd packages/components
pnpm run build
```

Done! Your component is now available.

## File Structure

```
packages/components/src/
├── Form/
│   ├── types.ts                    # All Form component types
│   ├── CyberLoginForm.tsx          # Component implementation
│   ├── CyberLoginForm.demo.tsx     # Demo (optional)
│   ├── CyberLoginForm.test.tsx     # Tests (optional)
│   └── CYBERLOGINFORM_GUIDE.md     # Guide (optional)
├── Button/
├── Input/
├── Layout/
├── Navigation/
├── DataDisplay/
├── Feedback/
├── Utility/
├── Advanced/
├── Specialized/
├── Loader/
├── Icon/
├── Text/
└── Visualization/
```

## Export Pattern (IMPORTANT)

Always use this exact pattern:

```typescript
// In component file
export const ComponentName: React.FC<ComponentNameProps> = ({ ... });
export default ComponentName;

// In index.ts
export { default as ComponentName } from './Category/ComponentName';
export type { ComponentNameProps } from './Category/types';
```

## Common Props Pattern

Most components should support:

```typescript
export interface ComponentProps {
  // Functional props
  onSomething?: (data: any) => void;

  // Customization props
  className?: string;
  style?: React.CSSProperties;

  // Color props (if applicable)
  primaryColor?: string;
  secondaryColor?: string;

  // Content props
  label?: string;
  placeholder?: string;
}
```

## Styling Pattern

Use styled-components with TypeScript:

```typescript
interface StyledProps {
  $primaryColor: string;
  $isActive: boolean;
}

const StyledComponent = styled.div<StyledProps>`
  color: ${(props) => props.$primaryColor};
  opacity: ${(props) => (props.$isActive ? 1 : 0.5)};
`;
```

**Note**: Use `$` prefix for transient props (props not passed to DOM)

## Build Commands

```bash
# Build components package
pnpm run build --filter=@rhuds/components

# Build with watch mode
pnpm run dev --filter=@rhuds/components

# Run tests
pnpm run test --filter=@rhuds/components

# Run linting
pnpm run lint --filter=@rhuds/components

# Format code
pnpm run format --filter=@rhuds/components
```

## Component Categories

| Category      | Purpose           | Examples                           |
| ------------- | ----------------- | ---------------------------------- |
| Button        | Button variants   | Button, GlitchButton, HudButton    |
| Input         | Text inputs       | Input, HoloInput, AiHudInput       |
| Form          | Form elements     | Checkbox, Radio, CyberLoginForm    |
| Layout        | Layout containers | Grid, Container, Stack, HudBox     |
| Navigation    | Navigation        | Navbar, Sidebar, Tabs, Breadcrumb  |
| DataDisplay   | Data display      | Table, Card, Tree, DataGrid        |
| Feedback      | User feedback     | Modal, Dialog, Notification, Alert |
| Utility       | Utility           | Tooltip, Dropdown, Popover         |
| Advanced      | Complex           | Carousel, Accordion, Stepper       |
| Specialized   | Specialized       | DatePicker, ColorPicker, Slider    |
| Loader        | Loading           | AbstergoLoader, HeartRateLoader    |
| Icon          | Icons             | Icon component                     |
| Text          | Text              | Text component                     |
| Visualization | Charts            | Chart component                    |

## TypeScript Tips

```typescript
// Use React.FC for functional components
export const MyComponent: React.FC<MyComponentProps> = ({ ... }) => { ... };

// Use React.ReactNode for children
interface Props {
  children?: React.ReactNode;
}

// Use React.CSSProperties for styles
interface Props {
  style?: React.CSSProperties;
}

// Use React.FormEvent for form events
const handleSubmit = (e: React.FormEvent) => { ... };

// Use React.ChangeEvent for input changes
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { ... };
```

## Common Mistakes to Avoid

❌ **Don't**: Use `any` types
✅ **Do**: Define proper interfaces

❌ **Don't**: Export both named and default without pattern
✅ **Do**: Use `export const` + `export default`

❌ **Don't**: Put all types in component file
✅ **Do**: Put types in types.ts

❌ **Don't**: Use inline styles
✅ **Do**: Use styled-components

❌ **Don't**: Forget to export in index.ts
✅ **Do**: Always export in main index.ts

## Verification Checklist

- [ ] Component file created in correct category
- [ ] Props interface defined in types.ts
- [ ] Component exported in index.ts
- [ ] Export uses correct pattern (default + named)
- [ ] TypeScript compiles without errors
- [ ] Build succeeds: `pnpm run build`
- [ ] Component appears in dist/index.js
- [ ] No console errors or warnings

## Example: Complete Component

```typescript
// packages/components/src/Button/MyButton.tsx
import React from 'react';
import styled from 'styled-components';

export interface MyButtonProps {
  label: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  className?: string;
}

export const MyButton: React.FC<MyButtonProps> = ({
  label,
  onClick,
  variant = 'primary',
  disabled = false,
  className,
}) => {
  return (
    <StyledButton
      onClick={onClick}
      disabled={disabled}
      $variant={variant}
      className={className}
    >
      {label}
    </StyledButton>
  );
};

interface StyledButtonProps {
  $variant: 'primary' | 'secondary';
}

const StyledButton = styled.button<StyledButtonProps>`
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: ${props =>
    props.$variant === 'primary' ? '#29F2DF' : '#1C7FA6'
  };
  color: #fff;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export default MyButton;
```

```typescript
// Update packages/components/src/Button/types.ts
export interface MyButtonProps {
  /** Button label text */
  label: string;

  /** Click handler */
  onClick?: () => void;

  /** Button variant */
  variant?: 'primary' | 'secondary';

  /** Disabled state */
  disabled?: boolean;

  /** Custom className */
  className?: string;
}
```

```typescript
// Update packages/components/src/index.ts
export { default as MyButton } from './Button/MyButton';
export type { MyButtonProps } from './Button/types';
```

## Need Help?

1. Check CyberLoginForm implementation: `packages/components/src/Form/CyberLoginForm.tsx`
2. Review COMPONENT_ADDITION_TEMPLATE.md for detailed guide
3. Look at existing components in the same category
4. Check TypeScript errors: `pnpm run lint`

---

**Last Updated**: March 17, 2026
**Version**: 1.0
