# RHUDS Hooks API Documentation

Custom React hooks for RHUDS Pro components and applications.

---

## Table of Contents

1. [Theme Hooks](#theme-hooks)
2. [Animation Hooks](#animation-hooks)
3. [Audio Hooks](#audio-hooks)
4. [Form Hooks](#form-hooks)
5. [Utility Hooks](#utility-hooks)

---

## Theme Hooks

### useTheme

Access the current theme context.

```typescript
import { useTheme } from '@rhuds/core';

function MyComponent() {
  const theme = useTheme();
  
  return (
    <div style={{ color: theme.colors.text }}>
      Themed content
    </div>
  );
}
```

**Returns:**
- `currentMode`: ThemeMode - Current theme mode
- `availableModes`: ThemeMode[] - Available theme modes
- `setTheme`: (mode: string) => void - Switch theme
- `customizeToken`: (path: string, value: string) => void - Customize theme token

### useThemeManager

Advanced theme management hook.

```typescript
import { useThemeManager } from '@rhuds/core';

function ThemeSwitcher() {
  const manager = useThemeManager();
  
  return (
    <button onClick={() => manager.switchTheme('dark')}>
      Switch to Dark
    </button>
  );
}
```

**Returns:**
- `currentTheme`: RHUDSTheme - Current theme object
- `switchTheme`: (name: string) => void - Switch theme
- `updateTheme`: (overrides: ThemeOverride) => void - Update theme
- `resetTheme`: () => void - Reset to default
- `exportTheme`: () => SerializableTheme - Export theme
- `importTheme`: (theme: SerializableTheme) => void - Import theme

---

## Animation Hooks

### useAnimation

Create and manage animations.

```typescript
import { useAnimation } from '@rhuds/core';

function AnimatedBox() {
  const animation = useAnimation({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    duration: 500,
    easing: 'easeInOut',
  });
  
  return <div style={animation.style}>Animated content</div>;
}
```

**Options:**
- `from`: React.CSSProperties - Starting styles
- `to`: React.CSSProperties - Ending styles
- `duration`: number - Animation duration (ms)
- `easing`: string - Easing function name
- `delay`: number - Animation delay (ms)
- `repeat`: number - Number of repeats
- `direction`: 'normal' | 'reverse' | 'alternate'

**Returns:**
- `style`: React.CSSProperties - Animated styles
- `play`: () => void - Play animation
- `pause`: () => void - Pause animation
- `reset`: () => void - Reset animation
- `isPlaying`: boolean - Is animation playing

### useAnimator

Use the Animator component system.

```typescript
import { useAnimator } from '@rhuds/core';

function MyComponent() {
  const animator = useAnimator();
  
  return (
    <Animator
      state={animator.state}
      onStateChange={animator.setState}
    >
      Content
    </Animator>
  );
}
```

**Returns:**
- `state`: 'entering' | 'entered' | 'exiting' | 'exited'
- `setState`: (state: string) => void
- `enter`: () => void
- `exit`: () => void

### useSpring

Create spring physics animations.

```typescript
import { useSpring } from '@rhuds/core';

function SpringBox() {
  const spring = useSpring({
    from: { x: 0 },
    to: { x: 100 },
    tension: 170,
    friction: 26,
  });
  
  return <div style={{ transform: `translateX(${spring.x}px)` }}>Box</div>;
}
```

**Options:**
- `from`: Record<string, number> - Starting values
- `to`: Record<string, number> - Ending values
- `tension`: number - Spring tension (default: 170)
- `friction`: number - Spring friction (default: 26)
- `mass`: number - Spring mass (default: 1)

**Returns:**
- `values`: Record<string, number> - Current values
- `isAnimating`: boolean - Is animating

---

## Audio Hooks

### useBleeps

Access audio playback functionality.

```typescript
import { useBleeps } from '@rhuds/core';

function SoundButton() {
  const { play, stop, setVolume } = useBleeps();
  
  return (
    <button onClick={() => play('click')}>
      Click me
    </button>
  );
}
```

**Returns:**
- `play`: (soundKey: string, options?: PlayOptions) => void - Play sound
- `stop`: (soundKey?: string) => void - Stop sound
- `pause`: (soundKey?: string) => void - Pause sound
- `resume`: (soundKey?: string) => void - Resume sound
- `setVolume`: (volume: number, category?: string) => void - Set volume
- `getVolume`: (category?: string) => number - Get volume
- `preload`: (soundKey: string) => Promise<void> - Preload sound

### useAudioVisualization

Create audio visualizations.

```typescript
import { useAudioVisualization } from '@rhuds/core';

function Visualizer() {
  const { frequencies, waveform, beat } = useAudioVisualization();
  
  return (
    <div>
      {frequencies.map((freq, i) => (
        <div key={i} style={{ height: freq }}></div>
      ))}
    </div>
  );
}
```

**Returns:**
- `frequencies`: number[] - Frequency data
- `waveform`: number[] - Waveform data
- `beat`: boolean - Is beat detected
- `energy`: number - Audio energy level

---

## Form Hooks

### useForm

Manage form state and validation.

```typescript
import { useForm } from '@rhuds/components';

function MyForm() {
  const { values, errors, handleChange, handleSubmit } = useForm({
    initialValues: { email: '', password: '' },
    onSubmit: (values) => console.log(values),
    validate: {
      email: [{ type: 'email' }],
      password: [{ type: 'required' }],
    },
  });
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        name="email"
        value={values.email}
        onChange={handleChange}
      />
      {errors.email && <span>{errors.email}</span>}
    </form>
  );
}
```

**Options:**
- `initialValues`: Record<string, any> - Initial form values
- `onSubmit`: (values: Record<string, any>) => void - Submit handler
- `validate`: Record<string, FormValidationRule[]> - Validation rules

**Returns:**
- `values`: Record<string, any> - Form values
- `errors`: Record<string, string> - Form errors
- `touched`: Record<string, boolean> - Touched fields
- `handleChange`: (e: React.ChangeEvent) => void - Change handler
- `handleSubmit`: (e: React.FormEvent) => void - Submit handler
- `reset`: () => void - Reset form
- `setFieldValue`: (field: string, value: any) => void - Set field value
- `setFieldError`: (field: string, error: string) => void - Set field error

### useFormField

Manage individual form field state.

```typescript
import { useFormField } from '@rhuds/components';

function EmailField() {
  const field = useFormField('email', '', [{ type: 'email' }]);
  
  return (
    <div>
      <input {...field.inputProps} />
      {field.error && <span>{field.error}</span>}
    </div>
  );
}
```

**Returns:**
- `value`: any - Field value
- `error`: string - Field error
- `touched`: boolean - Is field touched
- `inputProps`: object - Input element props
- `setValue`: (value: any) => void - Set value
- `setError`: (error: string) => void - Set error
- `setTouched`: (touched: boolean) => void - Set touched

---

## Utility Hooks

### useLocalStorage

Persist state to localStorage.

```typescript
import { useLocalStorage } from '@rhuds/hooks';

function MyComponent() {
  const [value, setValue] = useLocalStorage('myKey', 'default');
  
  return (
    <button onClick={() => setValue('new value')}>
      {value}
    </button>
  );
}
```

**Parameters:**
- `key`: string - Storage key
- `initialValue`: any - Initial value

**Returns:**
- `value`: any - Current value
- `setValue`: (value: any) => void - Set value
- `removeValue`: () => void - Remove from storage

### useSessionStorage

Persist state to sessionStorage.

```typescript
import { useSessionStorage } from '@rhuds/hooks';

function MyComponent() {
  const [value, setValue] = useSessionStorage('myKey', 'default');
  
  return <div>{value}</div>;
}
```

**Parameters:**
- `key`: string - Storage key
- `initialValue`: any - Initial value

**Returns:**
- `value`: any - Current value
- `setValue`: (value: any) => void - Set value
- `removeValue`: () => void - Remove from storage

### useDebounce

Debounce a value.

```typescript
import { useDebounce } from '@rhuds/hooks';

function SearchComponent() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  
  useEffect(() => {
    // Perform search with debouncedSearch
  }, [debouncedSearch]);
  
  return <input value={search} onChange={(e) => setSearch(e.target.value)} />;
}
```

**Parameters:**
- `value`: any - Value to debounce
- `delay`: number - Debounce delay (ms)

**Returns:**
- `debouncedValue`: any - Debounced value

### useThrottle

Throttle a function.

```typescript
import { useThrottle } from '@rhuds/hooks';

function ScrollComponent() {
  const handleScroll = useThrottle(() => {
    console.log('Scrolling...');
  }, 1000);
  
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);
  
  return <div>Content</div>;
}
```

**Parameters:**
- `callback`: (...args: any[]) => void - Function to throttle
- `delay`: number - Throttle delay (ms)

**Returns:**
- `throttledCallback`: (...args: any[]) => void - Throttled function

### usePrevious

Get previous value.

```typescript
import { usePrevious } from '@rhuds/hooks';

function MyComponent() {
  const [count, setCount] = useState(0);
  const prevCount = usePrevious(count);
  
  return (
    <div>
      Current: {count}, Previous: {prevCount}
    </div>
  );
}
```

**Parameters:**
- `value`: any - Value to track

**Returns:**
- `previousValue`: any - Previous value

### useAsync

Handle async operations.

```typescript
import { useAsync } from '@rhuds/hooks';

function DataComponent() {
  const { data, loading, error } = useAsync(
    async () => {
      const response = await fetch('/api/data');
      return response.json();
    },
    []
  );
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return <div>{JSON.stringify(data)}</div>;
}
```

**Parameters:**
- `asyncFunction`: () => Promise<T> - Async function
- `dependencies`: any[] - Dependency array

**Returns:**
- `data`: T | null - Async data
- `loading`: boolean - Is loading
- `error`: Error | null - Error object

### useMediaQuery

Detect media query matches.

```typescript
import { useMediaQuery } from '@rhuds/hooks';

function ResponsiveComponent() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  return (
    <div>
      {isMobile ? 'Mobile view' : 'Desktop view'}
    </div>
  );
}
```

**Parameters:**
- `query`: string - Media query string

**Returns:**
- `matches`: boolean - Does media query match

### useClickOutside

Detect clicks outside element.

```typescript
import { useClickOutside } from '@rhuds/hooks';

function Dropdown() {
  const ref = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  
  useClickOutside(ref, () => setIsOpen(false));
  
  return (
    <div ref={ref}>
      {isOpen && <div>Dropdown content</div>}
    </div>
  );
}
```

**Parameters:**
- `ref`: React.RefObject - Element reference
- `callback`: () => void - Click outside callback

### useKeyPress

Detect key presses.

```typescript
import { useKeyPress } from '@rhuds/hooks';

function SearchComponent() {
  const isEnterPressed = useKeyPress('Enter');
  
  useEffect(() => {
    if (isEnterPressed) {
      // Handle Enter key
    }
  }, [isEnterPressed]);
  
  return <input />;
}
```

**Parameters:**
- `key`: string - Key to detect

**Returns:**
- `isPressed`: boolean - Is key pressed

---

## Best Practices

### 1. Hook Dependencies

Always include proper dependency arrays:

```typescript
// Good
useEffect(() => {
  // Effect code
}, [dependency1, dependency2]);

// Bad
useEffect(() => {
  // Effect code
}); // Missing dependencies
```

### 2. Custom Hooks

Create custom hooks for reusable logic:

```typescript
function useCustomLogic(initialValue) {
  const [value, setValue] = useState(initialValue);
  
  const handleChange = useCallback((newValue) => {
    setValue(newValue);
  }, []);
  
  return { value, handleChange };
}
```

### 3. Performance Optimization

Use memoization for expensive computations:

```typescript
const memoizedValue = useMemo(() => {
  return expensiveComputation(value);
}, [value]);

const memoizedCallback = useCallback(() => {
  doSomething(value);
}, [value]);
```

---

## TypeScript Support

All hooks have full TypeScript support:

```typescript
import { useForm, UseFormProps } from '@rhuds/components';

const formProps: UseFormProps = {
  initialValues: { email: '' },
  onSubmit: (values) => console.log(values),
};

const form = useForm(formProps);
```

---

**Last Updated**: March 2, 2026  
**Version**: 0.1.0
