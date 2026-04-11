# Week 3: Component API Documentation

**Status**: ✅ COMPLETE  
**Date**: April 8, 2026  
**Version**: 1.0.0

---

## Table of Contents

1. [Button Components](#button-components)
2. [Input Components](#input-components)
3. [Checkbox Components](#checkbox-components)
4. [Theme System](#theme-system)
5. [Common Props](#common-props)
6. [Type Definitions](#type-definitions)

---

## Button Components

### BaseButton

**Location**: `packages/components/src/core/BaseButton.tsx`

**Description**: Consolidated base button component supporting 7 themes, 7 variants, and 3 sizes.

#### Props

```typescript
interface ButtonProps {
  // Content
  children?: React.ReactNode;

  // Styling
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'tactical' | 'glitch';
  theme?: 'rhuds' | 'coldwar' | 'cyberpunk' | 'neon' | 'glitch' | 'glow' | 'holo';
  size?: 'sm' | 'md' | 'lg';

  // State
  disabled?: boolean;
  loading?: boolean;

  // Events
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onHover?: (hovered: boolean) => void;

  // HTML
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  style?: React.CSSProperties;

  // Accessibility
  aria-label?: string;
  aria-disabled?: boolean;
  title?: string;
}
```

#### Examples

```typescript
// Basic button
<Button>Click me</Button>

// With variant and theme
<Button variant="primary" theme="neon">
  Neon Button
</Button>

// With size
<Button size="lg" variant="danger">
  Large Danger Button
</Button>

// With loading state
<Button loading={isLoading}>
  {isLoading ? 'Loading...' : 'Submit'}
</Button>

// With event handler
<Button onClick={() => console.log('clicked')}>
  Click Handler
</Button>
```

#### Variants

| Variant   | Description                 |
| --------- | --------------------------- |
| primary   | Primary action button       |
| secondary | Secondary action button     |
| danger    | Destructive action button   |
| success   | Success/confirmation button |
| warning   | Warning/caution button      |
| tactical  | Tactical/military style     |
| glitch    | Glitch effect button        |

#### Themes

| Theme     | Description         |
| --------- | ------------------- |
| rhuds     | Default RHUDS theme |
| coldwar   | Cold War aesthetic  |
| cyberpunk | Cyberpunk style     |
| neon      | Neon glow effect    |
| glitch    | Glitch effect       |
| glow      | Glowing effect      |
| holo      | Holographic effect  |

#### Sizes

| Size | Description                 |
| ---- | --------------------------- |
| sm   | Small button (32px height)  |
| md   | Medium button (40px height) |
| lg   | Large button (48px height)  |

---

## Input Components

### BaseInput

**Location**: `packages/components/src/core/BaseInput.tsx`

**Description**: Consolidated base input component supporting 8 themes and 3 sizes.

#### Props

```typescript
interface InputProps {
  // Value
  value?: string;
  defaultValue?: string;

  // Styling
  theme?: 'rhuds' | 'coldwar' | 'cyberpunk' | 'hacker' | 'holo' | 'bash' | 'floating' | 'gradient';
  size?: 'sm' | 'md' | 'lg';

  // Placeholder
  placeholder?: string;

  // State
  disabled?: boolean;
  readOnly?: boolean;

  // Validation
  error?: boolean;
  errorMessage?: string;

  // Events
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;

  // HTML
  type?: 'text' | 'email' | 'password' | 'number' | 'search' | 'url';
  className?: string;
  style?: React.CSSProperties;

  // Accessibility
  aria-label?: string;
  aria-describedby?: string;
  aria-invalid?: boolean;
}
```

#### Examples

```typescript
// Basic input
<Input placeholder="Enter text" />

// With theme
<Input theme="hacker" placeholder="Hacker input" />

// With size
<Input size="lg" placeholder="Large input" />

// With error
<Input
  error={true}
  errorMessage="This field is required"
  placeholder="Required field"
/>

// With event handler
<Input
  onChange={(e) => setValue(e.target.value)}
  value={value}
  placeholder="Controlled input"
/>

// With validation
<Input
  type="email"
  placeholder="Enter email"
  error={!isValidEmail}
  errorMessage="Invalid email format"
/>
```

#### Themes

| Theme     | Description           |
| --------- | --------------------- |
| rhuds     | Default RHUDS theme   |
| coldwar   | Cold War aesthetic    |
| cyberpunk | Cyberpunk style       |
| hacker    | Hacker/terminal style |
| holo      | Holographic effect    |
| bash      | Bash terminal style   |
| floating  | Floating label style  |
| gradient  | Gradient border style |

#### Sizes

| Size | Description                |
| ---- | -------------------------- |
| sm   | Small input (32px height)  |
| md   | Medium input (40px height) |
| lg   | Large input (48px height)  |

---

## Checkbox Components

### BaseCheckbox

**Location**: `packages/components/src/core/BaseCheckbox.tsx`

**Description**: Consolidated base checkbox component supporting 8 themes and 3 sizes.

#### Props

```typescript
interface CheckboxProps {
  // Value
  checked?: boolean;
  defaultChecked?: boolean;

  // Styling
  theme?: 'rhuds' | 'coldwar' | 'cyberpunk' | 'neon' | 'glitch' | 'glow' | 'holo' | 'bubble';
  size?: 'sm' | 'md' | 'lg';

  // Label
  label?: string;

  // State
  disabled?: boolean;
  indeterminate?: boolean;

  // Events
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;

  // HTML
  className?: string;
  style?: React.CSSProperties;

  // Accessibility
  aria-label?: string;
  aria-describedby?: string;
  aria-checked?: boolean | 'mixed';
}
```

#### Examples

```typescript
// Basic checkbox
<Checkbox label="Accept terms" />

// With theme
<Checkbox theme="neon" label="Neon checkbox" />

// With size
<Checkbox size="lg" label="Large checkbox" />

// Controlled checkbox
<Checkbox
  checked={isChecked}
  onChange={(e) => setIsChecked(e.target.checked)}
  label="Controlled checkbox"
/>

// Disabled checkbox
<Checkbox disabled label="Disabled checkbox" />

// Indeterminate state
<Checkbox
  indeterminate={true}
  label="Indeterminate checkbox"
/>
```

#### Themes

| Theme     | Description         |
| --------- | ------------------- |
| rhuds     | Default RHUDS theme |
| coldwar   | Cold War aesthetic  |
| cyberpunk | Cyberpunk style     |
| neon      | Neon glow effect    |
| glitch    | Glitch effect       |
| glow      | Glowing effect      |
| holo      | Holographic effect  |
| bubble    | Bubble style        |

#### Sizes

| Size | Description            |
| ---- | ---------------------- |
| sm   | Small checkbox (16px)  |
| md   | Medium checkbox (20px) |
| lg   | Large checkbox (24px)  |

---

## Theme System

### ThemeProvider

**Location**: `packages/core/src/theme/ThemeProvider.tsx`

**Description**: Centralized theme management system providing context-based theme distribution.

#### Props

```typescript
interface ThemeProviderProps {
  children: React.ReactNode;
  initialTheme?: 'light' | 'dark' | 'auto';
  themes?: Record<string, Theme>;
}
```

#### Example

```typescript
import { ThemeProvider } from '@rhuds/components';

function App() {
  return (
    <ThemeProvider initialTheme="dark">
      <YourApp />
    </ThemeProvider>
  );
}
```

### useThemeContext

**Description**: Hook to access current theme context.

```typescript
const { theme, switchTheme, isDark } = useThemeContext();
```

#### Returns

```typescript
interface ThemeContextValue {
  theme: Theme;
  switchTheme: (themeName: string) => void;
  isDark: boolean;
  colors: Record<string, string>;
}
```

#### Example

```typescript
function MyComponent() {
  const { theme, switchTheme, isDark } = useThemeContext();

  return (
    <div style={{ color: theme.colors.primary }}>
      <button onClick={() => switchTheme('dark')}>
        {isDark ? 'Light' : 'Dark'} Mode
      </button>
    </div>
  );
}
```

### useCurrentTheme

**Description**: Hook to get current theme configuration.

```typescript
const theme = useCurrentTheme();
```

#### Returns

```typescript
interface Theme {
  name: string;
  colors: Record<string, string>;
  spacing: Record<string, string>;
  typography: Record<string, any>;
  shadows: Record<string, string>;
}
```

### useThemeConfig

**Description**: Hook to get theme configuration.

```typescript
const config = useThemeConfig();
```

### useSwitchTheme

**Description**: Hook to switch themes.

```typescript
const switchTheme = useSwitchTheme();
switchTheme('dark');
```

---

## Common Props

### Styling Props

All components support these common styling props:

```typescript
interface CommonProps {
  className?: string;
  style?: React.CSSProperties;
  variant?: string;
  theme?: string;
  size?: 'sm' | 'md' | 'lg';
}
```

### State Props

All components support these state props:

```typescript
interface StateProps {
  disabled?: boolean;
  loading?: boolean;
  error?: boolean;
  success?: boolean;
}
```

### Event Props

All components support these event props:

```typescript
interface EventProps {
  onClick?: (e: React.MouseEvent) => void;
  onChange?: (e: React.ChangeEvent) => void;
  onFocus?: (e: React.FocusEvent) => void;
  onBlur?: (e: React.FocusEvent) => void;
  onHover?: (hovered: boolean) => void;
}
```

### Accessibility Props

All components support these accessibility props:

```typescript
interface AccessibilityProps {
  'aria-label'?: string;
  'aria-describedby'?: string;
  'aria-disabled'?: boolean;
  'aria-invalid'?: boolean;
  'aria-checked'?: boolean | 'mixed';
  role?: string;
  tabIndex?: number;
}
```

---

## Type Definitions

### ButtonVariant

```typescript
type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'danger'
  | 'success'
  | 'warning'
  | 'tactical'
  | 'glitch';
```

### ButtonTheme

```typescript
type ButtonTheme = 'rhuds' | 'coldwar' | 'cyberpunk' | 'neon' | 'glitch' | 'glow' | 'holo';
```

### InputTheme

```typescript
type InputTheme =
  | 'rhuds'
  | 'coldwar'
  | 'cyberpunk'
  | 'hacker'
  | 'holo'
  | 'bash'
  | 'floating'
  | 'gradient';
```

### CheckboxTheme

```typescript
type CheckboxTheme =
  | 'rhuds'
  | 'coldwar'
  | 'cyberpunk'
  | 'neon'
  | 'glitch'
  | 'glow'
  | 'holo'
  | 'bubble';
```

### ComponentSize

```typescript
type ComponentSize = 'sm' | 'md' | 'lg';
```

### Theme

```typescript
interface Theme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    danger: string;
    success: string;
    warning: string;
    background: string;
    foreground: string;
    border: string;
    [key: string]: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    [key: string]: string;
  };
  typography: {
    fontFamily: string;
    fontSize: Record<string, string>;
    fontWeight: Record<string, number>;
    lineHeight: Record<string, number>;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    [key: string]: string;
  };
}
```

---

## API Summary

### Components

| Component | Location          | Props | Themes | Sizes |
| --------- | ----------------- | ----- | ------ | ----- |
| Button    | core/BaseButton   | 10+   | 7      | 3     |
| Input     | core/BaseInput    | 12+   | 8      | 3     |
| Checkbox  | core/BaseCheckbox | 10+   | 8      | 3     |

### Hooks

| Hook            | Purpose              | Returns                     |
| --------------- | -------------------- | --------------------------- |
| useThemeContext | Access theme context | ThemeContextValue           |
| useCurrentTheme | Get current theme    | Theme                       |
| useThemeConfig  | Get theme config     | ThemeConfig                 |
| useSwitchTheme  | Switch themes        | (themeName: string) => void |

### Providers

| Provider      | Purpose               | Props                          |
| ------------- | --------------------- | ------------------------------ |
| ThemeProvider | Provide theme context | children, initialTheme, themes |

---

## Best Practices

### 1. Use ThemeProvider at Root

```typescript
// ✅ Good
<ThemeProvider>
  <App />
</ThemeProvider>

// ❌ Bad
<App>
  <ThemeProvider>...</ThemeProvider>
</App>
```

### 2. Use Hooks for Theme Access

```typescript
// ✅ Good
const { theme, switchTheme } = useThemeContext();

// ❌ Bad
const theme = useTheme(); // Not a real hook
```

### 3. Type Your Props

```typescript
// ✅ Good
interface MyButtonProps extends ButtonProps {
  customProp?: string;
}

// ❌ Bad
interface MyButtonProps {
  customProp?: string;
}
```

### 4. Use Semantic Variants

```typescript
// ✅ Good
<Button variant="danger">Delete</Button>
<Button variant="success">Confirm</Button>

// ❌ Bad
<Button variant="red">Delete</Button>
<Button variant="green">Confirm</Button>
```

---

## Troubleshooting

### Theme Not Applying

**Problem**: Theme styles not showing up

**Solution**: Make sure ThemeProvider is at the root of your app

```typescript
<ThemeProvider>
  <App />
</ThemeProvider>
```

### Props Not Working

**Problem**: Component props not having effect

**Solution**: Check prop names and types

```typescript
// ✅ Correct
<Button variant="primary" size="lg" />

// ❌ Wrong
<Button variant="primary" size="large" />
```

### Type Errors

**Problem**: TypeScript errors with component props

**Solution**: Import types explicitly

```typescript
import { Button, type ButtonProps } from '@rhuds/components';
```

---

## Version History

### v1.0.0 (April 8, 2026)

- Initial release
- 3 base components
- 1 theme system
- 25 wrapper components
- Full TypeScript support

---

## Support

For questions or issues:

- 📧 Email: support@rhuds.dev
- 🐛 Issues: GitHub Issues
- 💬 Discussion: GitHub Discussions
- 📚 Docs: https://rhuds.dev/docs

---

**Last Updated**: April 8, 2026  
**Status**: ✅ COMPLETE  
**Quality**: Production Ready
