# Component Addition Template

This guide shows how to add new components following the CyberLoginForm pattern.

## Step-by-Step Process

### 1. Create Component File

Create `packages/components/src/[Category]/[ComponentName].tsx`:

```typescript
import React from 'react';
import styled from 'styled-components';

export interface [ComponentName]Props {
  // Define your props here
  className?: string;
}

export const [ComponentName]: React.FC<[ComponentName]Props> = ({
  className,
  // destructure other props
}) => {
  return (
    <StyledWrapper className={className}>
      {/* Component JSX */}
    </StyledWrapper>
  );
};

interface StyledWrapperProps {
  // Define styled component props
}

const StyledWrapper = styled.div<StyledWrapperProps>`
  /* Your styles here */
`;

export default [ComponentName];
```

### 2. Add Types to types.ts

Update `packages/components/src/[Category]/types.ts`:

```typescript
export interface [ComponentName]Props {
  /** Description of prop 1 */
  prop1?: string;

  /** Description of prop 2 */
  prop2?: boolean;

  /** Custom className */
  className?: string;
}
```

### 3. Export in index.ts

Update `packages/components/src/index.ts`:

```typescript
export { default as [ComponentName] } from './[Category]/[ComponentName]';
export type { [ComponentName]Props } from './[Category]/types';
```

### 4. Create Demo File (Optional)

Create `packages/components/src/[Category]/[ComponentName].demo.tsx`:

```typescript
import React from 'react';
import { [ComponentName] } from '../index';

export function [ComponentName]Demo() {
  return (
    <div style={{ padding: '20px' }}>
      <h2>[ComponentName] Component</h2>
      <[ComponentName] />
    </div>
  );
}
```

### 5. Create Test File (Optional)

Create `packages/components/src/[Category]/[ComponentName].test.tsx`:

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { [ComponentName] } from '../index';

describe('[ComponentName]', () => {
  it('renders the component', () => {
    render(<[ComponentName] />);
    expect(screen.getByRole('...')).toBeInTheDocument();
  });
});
```

### 6. Create Guide File (Optional)

Create `packages/components/src/[Category]/[COMPONENTNAME]_GUIDE.md`:

```markdown
# [ComponentName] Component Guide

## Overview

Brief description of the component.

## Props

- `prop1`: Description
- `prop2`: Description

## Usage Example

\`\`\`typescript
import { [ComponentName] } from '@rhuds/components';

export function MyComponent() {
return <[ComponentName] prop1="value" />;
}
\`\`\`

## Styling

The component uses styled-components and supports custom className prop.
```

## Build and Test

```bash
# Build the components package
pnpm run build --filter=@rhuds/components

# Run tests
pnpm run test --filter=@rhuds/components

# Run linting
pnpm run lint --filter=@rhuds/components
```

## Component Categories

Choose the appropriate category for your component:

- **Button**: Button components and variants
- **Input**: Input fields and text inputs
- **Form**: Form-related components (checkboxes, radios, login forms, etc.)
- **Layout**: Layout components (grid, container, stack, etc.)
- **Navigation**: Navigation components (navbar, sidebar, tabs, etc.)
- **DataDisplay**: Data display components (tables, cards, etc.)
- **Feedback**: Feedback components (modals, notifications, etc.)
- **Utility**: Utility components (tooltips, dropdowns, etc.)
- **Advanced**: Advanced components (carousel, accordion, etc.)
- **Specialized**: Specialized components (date picker, color picker, etc.)
- **Loader**: Loading indicators
- **Icon**: Icon components
- **Text**: Text components
- **Visualization**: Charts and visualizations

## Export Pattern

Always use this pattern for exports:

```typescript
// In component file
export const ComponentName: React.FC<ComponentNameProps> = ({ ... });
export default ComponentName;

// In index.ts
export { default as ComponentName } from './Category/ComponentName';
export type { ComponentNameProps } from './Category/types';
```

## Color System

Use theme colors from `packages/core/src/theme/themes.ts`:

```typescript
// Dark mode colors
primary: '#29F2DF';
secondary: '#1C7FA6';
accent: '#EF3EF1';
background: '#0A1225';
surface: '#28125A';
text: '#e0e0e0';
border: '#1C7FA6';
```

Allow users to override with optional props:

```typescript
export interface ComponentProps {
  primaryColor?: string;
  secondaryColor?: string;
  // ... other color props
}
```

## TypeScript Best Practices

- Always define prop interfaces
- Use `React.FC<Props>` for functional components
- Add JSDoc comments for props
- Use `styled.div<Props>` for styled components with props
- Avoid `any` types

## Testing Best Practices

- Test rendering
- Test prop variations
- Test user interactions
- Test accessibility
- Use meaningful test descriptions

---

**Last Updated**: March 17, 2026
**Template Version**: 1.0
