# Week 3: Component Usage Guides

**Status**: ✅ COMPLETE  
**Date**: April 8, 2026  
**Version**: 1.0.0

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Button Usage Guide](#button-usage-guide)
3. [Input Usage Guide](#input-usage-guide)
4. [Checkbox Usage Guide](#checkbox-usage-guide)
5. [Theme Usage Guide](#theme-usage-guide)
6. [Advanced Patterns](#advanced-patterns)

---

## Getting Started

### Installation

```bash
npm install @rhuds/components
# or
yarn add @rhuds/components
# or
pnpm add @rhuds/components
```

### Basic Setup

```typescript
import { ThemeProvider, Button, Input, Checkbox } from '@rhuds/components';

function App() {
  return (
    <ThemeProvider>
      <YourApp />
    </ThemeProvider>
  );
}
```

### Import Styles

```typescript
// In your main CSS file
import '@rhuds/components/dist/index.css';
```

---

## Button Usage Guide

### Basic Button

```typescript
import { Button } from '@rhuds/components';

function MyComponent() {
  return <Button>Click me</Button>;
}
```

### Button with Variant

```typescript
// Primary button
<Button variant="primary">Primary</Button>

// Secondary button
<Button variant="secondary">Secondary</Button>

// Danger button
<Button variant="danger">Delete</Button>

// Success button
<Button variant="success">Confirm</Button>

// Warning button
<Button variant="warning">Warning</Button>
```

### Button with Theme

```typescript
// Neon theme
<Button theme="neon">Neon Button</Button>

// Cyberpunk theme
<Button theme="cyberpunk">Cyberpunk Button</Button>

// Cold War theme
<Button theme="coldwar">Cold War Button</Button>

// Glitch theme
<Button theme="glitch">Glitch Button</Button>
```

### Button with Size

```typescript
// Small button
<Button size="sm">Small</Button>

// Medium button (default)
<Button size="md">Medium</Button>

// Large button
<Button size="lg">Large</Button>
```

### Button with State

```typescript
// Disabled button
<Button disabled>Disabled</Button>

// Loading button
<Button loading={isLoading}>
  {isLoading ? 'Loading...' : 'Submit'}
</Button>
```

### Button with Event Handler

```typescript
function MyComponent() {
  const handleClick = () => {
    console.log('Button clicked!');
  };

  return <Button onClick={handleClick}>Click me</Button>;
}
```

### Button Combinations

```typescript
// Large primary neon button
<Button
  variant="primary"
  theme="neon"
  size="lg"
  onClick={handleSubmit}
>
  Submit
</Button>

// Small danger cyberpunk button
<Button
  variant="danger"
  theme="cyberpunk"
  size="sm"
  onClick={handleDelete}
>
  Delete
</Button>
```

---

## Input Usage Guide

### Basic Input

```typescript
import { Input } from '@rhuds/components';

function MyComponent() {
  const [value, setValue] = useState('');

  return (
    <Input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="Enter text"
    />
  );
}
```

### Input with Theme

```typescript
// Hacker theme
<Input theme="hacker" placeholder="Hacker input" />

// Holographic theme
<Input theme="holo" placeholder="Holo input" />

// Bash theme
<Input theme="bash" placeholder="Bash input" />

// Gradient theme
<Input theme="gradient" placeholder="Gradient input" />
```

### Input with Size

```typescript
// Small input
<Input size="sm" placeholder="Small" />

// Medium input (default)
<Input size="md" placeholder="Medium" />

// Large input
<Input size="lg" placeholder="Large" />
```

### Input with Validation

```typescript
function MyComponent() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    if (!isValidEmail(value)) {
      setError('Invalid email format');
    } else {
      setError('');
    }
  };

  return (
    <Input
      type="email"
      value={email}
      onChange={handleChange}
      error={!!error}
      errorMessage={error}
      placeholder="Enter email"
    />
  );
}
```

### Input with Different Types

```typescript
// Text input
<Input type="text" placeholder="Text" />

// Email input
<Input type="email" placeholder="Email" />

// Password input
<Input type="password" placeholder="Password" />

// Number input
<Input type="number" placeholder="Number" />

// Search input
<Input type="search" placeholder="Search" />

// URL input
<Input type="url" placeholder="URL" />
```

### Input with State

```typescript
// Disabled input
<Input disabled placeholder="Disabled" />

// Read-only input
<Input readOnly value="Read-only" />

// With error
<Input error={true} errorMessage="This field is required" />
```

---

## Checkbox Usage Guide

### Basic Checkbox

```typescript
import { Checkbox } from '@rhuds/components';

function MyComponent() {
  const [checked, setChecked] = useState(false);

  return (
    <Checkbox
      checked={checked}
      onChange={(e) => setChecked(e.target.checked)}
      label="Accept terms"
    />
  );
}
```

### Checkbox with Theme

```typescript
// Neon theme
<Checkbox theme="neon" label="Neon checkbox" />

// Cyberpunk theme
<Checkbox theme="cyberpunk" label="Cyberpunk checkbox" />

// Bubble theme
<Checkbox theme="bubble" label="Bubble checkbox" />

// Glitch theme
<Checkbox theme="glitch" label="Glitch checkbox" />
```

### Checkbox with Size

```typescript
// Small checkbox
<Checkbox size="sm" label="Small" />

// Medium checkbox (default)
<Checkbox size="md" label="Medium" />

// Large checkbox
<Checkbox size="lg" label="Large" />
```

### Checkbox with State

```typescript
// Disabled checkbox
<Checkbox disabled label="Disabled" />

// Indeterminate state
<Checkbox indeterminate={true} label="Indeterminate" />

// Checked by default
<Checkbox defaultChecked={true} label="Checked" />
```

### Checkbox Group

```typescript
function CheckboxGroup() {
  const [selected, setSelected] = useState([]);

  const options = ['Option 1', 'Option 2', 'Option 3'];

  const handleChange = (option) => {
    setSelected(prev =>
      prev.includes(option)
        ? prev.filter(o => o !== option)
        : [...prev, option]
    );
  };

  return (
    <div>
      {options.map(option => (
        <Checkbox
          key={option}
          checked={selected.includes(option)}
          onChange={() => handleChange(option)}
          label={option}
        />
      ))}
    </div>
  );
}
```

---

## Theme Usage Guide

### Setup ThemeProvider

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

### Access Theme in Component

```typescript
import { useThemeContext } from '@rhuds/components';

function MyComponent() {
  const { theme, switchTheme, isDark } = useThemeContext();

  return (
    <div style={{ color: theme.colors.primary }}>
      <p>Current theme: {theme.name}</p>
      <button onClick={() => switchTheme('light')}>
        Switch to Light
      </button>
    </div>
  );
}
```

### Get Current Theme

```typescript
import { useCurrentTheme } from '@rhuds/components';

function MyComponent() {
  const theme = useCurrentTheme();

  return (
    <div style={{
      backgroundColor: theme.colors.background,
      color: theme.colors.foreground,
      padding: theme.spacing.md
    }}>
      Content
    </div>
  );
}
```

### Switch Theme

```typescript
import { useSwitchTheme } from '@rhuds/components';

function ThemeSwitcher() {
  const switchTheme = useSwitchTheme();

  return (
    <div>
      <button onClick={() => switchTheme('light')}>Light</button>
      <button onClick={() => switchTheme('dark')}>Dark</button>
      <button onClick={() => switchTheme('auto')}>Auto</button>
    </div>
  );
}
```

### Theme Configuration

```typescript
const customTheme = {
  name: 'custom',
  colors: {
    primary: '#FF00FF',
    secondary: '#00FFFF',
    danger: '#FF0000',
    success: '#00FF00',
    warning: '#FFFF00',
    background: '#000000',
    foreground: '#FFFFFF',
    border: '#333333',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  typography: {
    fontFamily: 'monospace',
    fontSize: {
      sm: '12px',
      md: '14px',
      lg: '16px',
    },
    fontWeight: {
      normal: 400,
      bold: 700,
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      loose: 1.8,
    },
  },
  shadows: {
    sm: '0 1px 2px rgba(0,0,0,0.1)',
    md: '0 4px 6px rgba(0,0,0,0.1)',
    lg: '0 10px 15px rgba(0,0,0,0.1)',
  },
};
```

---

## Advanced Patterns

### Form with Multiple Components

```typescript
function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Submit form
      await submitLogin(email, password);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        theme="hacker"
      />

      <Input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        theme="hacker"
      />

      <Checkbox
        checked={rememberMe}
        onChange={(e) => setRememberMe(e.target.checked)}
        label="Remember me"
      />

      <Button
        onClick={handleSubmit}
        loading={loading}
        variant="primary"
        theme="neon"
      >
        {loading ? 'Logging in...' : 'Login'}
      </Button>
    </div>
  );
}
```

### Dynamic Theme Switching

```typescript
function ThemeSwitcher() {
  const { switchTheme, isDark } = useThemeContext();
  const [theme, setTheme] = useState('dark');

  const themes = ['light', 'dark', 'auto'];

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    switchTheme(newTheme);
  };

  return (
    <div>
      {themes.map(t => (
        <Button
          key={t}
          variant={theme === t ? 'primary' : 'secondary'}
          onClick={() => handleThemeChange(t)}
        >
          {t}
        </Button>
      ))}
    </div>
  );
}
```

### Responsive Component

```typescript
function ResponsiveForm() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div>
      <Input
        size={isMobile ? 'sm' : 'md'}
        placeholder="Enter text"
      />

      <Button
        size={isMobile ? 'sm' : 'md'}
        variant="primary"
      >
        Submit
      </Button>
    </div>
  );
}
```

### Custom Hook for Form State

```typescript
function useFormState(initialValues) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setValues(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const setFieldError = (field, error) => {
    setErrors(prev => ({
      ...prev,
      [field]: error
    }));
  };

  return {
    values,
    errors,
    handleChange,
    setFieldError,
    setValues,
    setErrors
  };
}

// Usage
function MyForm() {
  const { values, errors, handleChange } = useFormState({
    email: '',
    password: '',
    rememberMe: false
  });

  return (
    <div>
      <Input
        name="email"
        value={values.email}
        onChange={handleChange}
        error={!!errors.email}
        errorMessage={errors.email}
      />

      <Input
        name="password"
        type="password"
        value={values.password}
        onChange={handleChange}
        error={!!errors.password}
        errorMessage={errors.password}
      />

      <Checkbox
        name="rememberMe"
        checked={values.rememberMe}
        onChange={handleChange}
        label="Remember me"
      />
    </div>
  );
}
```

---

## Performance Tips

### 1. Memoize Components

```typescript
const MyButton = React.memo(({ onClick, children }) => (
  <Button onClick={onClick}>{children}</Button>
));
```

### 2. Use useCallback for Handlers

```typescript
const handleClick = useCallback(() => {
  console.log('clicked');
}, []);

<Button onClick={handleClick}>Click</Button>
```

### 3. Lazy Load Components

```typescript
const LazyButton = React.lazy(() => import('./Button'));

<Suspense fallback={<div>Loading...</div>}>
  <LazyButton />
</Suspense>
```

---

## Accessibility Tips

### 1. Use aria-label

```typescript
<Button aria-label="Close dialog">×</Button>
```

### 2. Use aria-describedby

```typescript
<Input
  aria-describedby="email-help"
  placeholder="Email"
/>
<span id="email-help">Enter your email address</span>
```

### 3. Use aria-invalid

```typescript
<Input
  aria-invalid={!!error}
  error={!!error}
  errorMessage={error}
/>
```

---

## Common Patterns

### Loading State

```typescript
const [loading, setLoading] = useState(false);

const handleSubmit = async () => {
  setLoading(true);
  try {
    await submitForm();
  } finally {
    setLoading(false);
  }
};

<Button loading={loading} onClick={handleSubmit}>
  Submit
</Button>
```

### Error Handling

```typescript
const [error, setError] = useState('');

const handleChange = (e) => {
  const value = e.target.value;
  if (!isValid(value)) {
    setError('Invalid input');
  } else {
    setError('');
  }
};

<Input
  error={!!error}
  errorMessage={error}
  onChange={handleChange}
/>
```

### Conditional Rendering

```typescript
{isLoggedIn ? (
  <Button onClick={handleLogout}>Logout</Button>
) : (
  <Button onClick={handleLogin}>Login</Button>
)}
```

---

## Troubleshooting

### Components Not Rendering

**Problem**: Components not showing up

**Solution**: Make sure ThemeProvider is at the root

```typescript
<ThemeProvider>
  <App />
</ThemeProvider>
```

### Styles Not Applying

**Problem**: Component styles not showing

**Solution**: Import CSS file

```typescript
import '@rhuds/components/dist/index.css';
```

### Theme Not Changing

**Problem**: Theme switch not working

**Solution**: Use useSwitchTheme hook

```typescript
const switchTheme = useSwitchTheme();
switchTheme('dark');
```

---

## Best Practices

1. ✅ Always wrap app with ThemeProvider
2. ✅ Use semantic variants (primary, danger, success)
3. ✅ Type your props with TypeScript
4. ✅ Use hooks for theme access
5. ✅ Memoize components when needed
6. ✅ Use aria attributes for accessibility
7. ✅ Handle loading and error states
8. ✅ Test components thoroughly

---

**Last Updated**: April 8, 2026  
**Status**: ✅ COMPLETE  
**Quality**: Production Ready
