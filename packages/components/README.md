# @rhuds/components

RHUDS Pro component library with 100+ UI components for building immersive, futuristic user interfaces.

## Features

### Basic Components
- **Text** - Typography with multiple variants and animations
- **Button** - Interactive buttons with multiple variants and states
- **Icon** - SVG icons with rotation, flip, and animation support
- **Input** - Text input with validation and error handling
- **Select** - Dropdown select with search functionality

### Layout Components
- **Grid** - Responsive grid layout with configurable columns
- **Container** - Max-width container with responsive padding
- **Stack** - Flexible stack layout (row or column)

### Form Components (Coming Soon)
- Checkbox, Radio, Switch
- Form validation system
- Form state management

### Navigation Components (Coming Soon)
- Navbar, Sidebar
- Breadcrumb, Tabs, Menu
- Pagination

### Data Display Components (Coming Soon)
- Table with sorting and filtering
- DataGrid with virtualization
- Tree with expandable nodes

### Feedback Components (Coming Soon)
- Modal, Dialog, Drawer
- Notification system
- Alert, Progress, Spinner

## Installation

```bash
npm install @rhuds/components
```

## Usage

### Text Component

```tsx
import { Text } from '@rhuds/components';

export function MyComponent() {
  return (
    <Text variant="h1" color="#00ffff">
      Hello World
    </Text>
  );
}
```

### Button Component

```tsx
import { Button } from '@rhuds/components';

export function MyComponent() {
  return (
    <Button variant="primary" onClick={() => console.log('Clicked!')}>
      Click Me
    </Button>
  );
}
```

### Icon Component

```tsx
import { Icon } from '@rhuds/components';

export function MyComponent() {
  return (
    <Icon name="check" size={32} color="#00ff00" />
  );
}
```

### Input Component

```tsx
import { Input } from '@rhuds/components';
import { useState } from 'react';

export function MyComponent() {
  const [value, setValue] = useState('');

  return (
    <Input
      label="Email"
      type="email"
      placeholder="Enter email..."
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}
```

### Select Component

```tsx
import { Select } from '@rhuds/components';
import { useState } from 'react';

export function MyComponent() {
  const [value, setValue] = useState('');

  const options = [
    { label: 'Option 1', value: 'opt1' },
    { label: 'Option 2', value: 'opt2' },
    { label: 'Option 3', value: 'opt3' },
  ];

  return (
    <Select
      label="Choose"
      options={options}
      value={value}
      onChange={setValue}
      searchable={true}
    />
  );
}
```

### Grid Component

```tsx
import { Grid, Text } from '@rhuds/components';

export function MyComponent() {
  return (
    <Grid columns={3} gap="1rem">
      <Text>Item 1</Text>
      <Text>Item 2</Text>
      <Text>Item 3</Text>
    </Grid>
  );
}
```

### Container Component

```tsx
import { Container, Text } from '@rhuds/components';

export function MyComponent() {
  return (
    <Container maxWidth="1200px" padding="2rem">
      <Text>Centered content</Text>
    </Container>
  );
}
```

### Stack Component

```tsx
import { Stack, Button } from '@rhuds/components';

export function MyComponent() {
  return (
    <Stack direction="row" gap="1rem">
      <Button>Button 1</Button>
      <Button>Button 2</Button>
      <Button>Button 3</Button>
    </Stack>
  );
}
```

## Component Props

### Text

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | 'h1' \| 'h2' \| ... \| 'code' | 'body' | Text variant |
| align | 'left' \| 'center' \| 'right' \| 'justify' | 'left' | Text alignment |
| weight | 'light' \| 'normal' \| 'semibold' \| 'bold' | 'normal' | Font weight |
| color | string | theme.colors.text | Text color |
| size | number | - | Font size in pixels |
| truncate | boolean | false | Truncate with ellipsis |
| maxLines | number | - | Max lines before truncation |

### Button

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | 'primary' \| 'secondary' \| 'danger' \| 'success' \| 'warning' | 'primary' | Button variant |
| size | 'sm' \| 'md' \| 'lg' | 'md' | Button size |
| loading | boolean | false | Show loading state |
| disabled | boolean | false | Disable button |
| fullWidth | boolean | false | Full width button |

### Icon

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| name | string | - | Icon name |
| svg | string | - | Custom SVG content |
| size | number | 24 | Icon size in pixels |
| color | string | theme.colors.text | Icon color |
| rotate | number | 0 | Rotation in degrees |
| flip | 'horizontal' \| 'vertical' \| 'both' | - | Flip direction |
| animated | boolean | false | Enable animation |

### Input

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| type | 'text' \| 'email' \| ... | 'text' | Input type |
| label | string | - | Input label |
| placeholder | string | - | Placeholder text |
| error | string | - | Error message |
| success | string | - | Success message |
| disabled | boolean | false | Disable input |
| required | boolean | false | Required field |

### Select

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| options | SelectOption[] | - | Select options |
| value | string \| number | - | Selected value |
| label | string | - | Select label |
| placeholder | string | 'Select an option' | Placeholder text |
| error | string | - | Error message |
| searchable | boolean | false | Enable search |
| disabled | boolean | false | Disable select |

### Grid

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| columns | number | 1 | Number of columns |
| gap | number \| string | '1rem' | Gap between items |

### Container

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| maxWidth | number \| string | '1200px' | Max width |
| padding | number \| string | '1rem' | Padding |
| centered | boolean | true | Center content |

### Stack

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| direction | 'row' \| 'column' | 'column' | Stack direction |
| gap | number \| string | '1rem' | Gap between items |
| align | string | 'stretch' | Align items |
| justify | string | 'flex-start' | Justify content |

## Integration

### With Theme System

All components automatically use the theme system:

```tsx
import { useTheme } from '@rhuds/core';

const theme = useTheme();
const color = theme.colors.primary;
```

### With Animation System

Components can be wrapped with Animator:

```tsx
import { Animator } from '@rhuds/core';
import { Button } from '@rhuds/components';

<Animator>
  <Button>Animated Button</Button>
</Animator>
```

### With Audio System

Components trigger audio feedback:

```tsx
import { useBleeps } from '@rhuds/core';

const { play } = useBleeps();
play('click');
```

## Accessibility

All components support:
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Focus management
- Screen reader support

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Performance

- Optimized re-renders with React.memo
- Lazy loading support
- Minimal bundle size
- 60fps animations

## API Reference

### Text Component

```typescript
interface TextProps {
  children: React.ReactNode;
  variant?: TextVariant;
  align?: TextAlign;
  weight?: TextWeight;
  color?: string;
  size?: number;
  lineHeight?: number;
  letterSpacing?: number;
  transform?: TextTransform;
  animated?: boolean;
  animationSpeed?: number;
  truncate?: boolean;
  maxLines?: number;
  className?: string;
  style?: React.CSSProperties;
  as?: 'p' | 'span' | 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}
```

### Button Component

```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  children: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  style?: React.CSSProperties;
}
```

### Icon Component

```typescript
interface IconProps {
  name?: string;
  svg?: string;
  size?: number;
  color?: string;
  rotate?: number;
  flip?: 'horizontal' | 'vertical' | 'both';
  animated?: boolean;
  animationSpeed?: number;
  className?: string;
  style?: React.CSSProperties;
}
```

### Input Component

```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  type?: InputType;
  label?: string;
  placeholder?: string;
  error?: string;
  success?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  style?: React.CSSProperties;
}
```

### Select Component

```typescript
interface SelectProps {
  options: SelectOption[];
  value?: string | number;
  onChange?: (value: string | number) => void;
  label?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  searchable?: boolean;
  className?: string;
  style?: React.CSSProperties;
}
```

### Grid Component

```typescript
interface GridProps {
  columns?: number | Record<string, number>;
  gap?: number | string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}
```

### Container Component

```typescript
interface ContainerProps {
  maxWidth?: number | string;
  padding?: number | string;
  centered?: boolean;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}
```

### Stack Component

```typescript
interface StackProps {
  direction?: 'row' | 'column';
  gap?: number | string;
  align?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around';
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}
```

## License

MIT

## Contributing

Contributions are welcome! Please read our contributing guidelines first.

## Support

For issues and questions, please visit our GitHub repository.
