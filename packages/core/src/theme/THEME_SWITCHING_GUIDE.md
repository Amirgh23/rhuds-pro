# Theme Switching and Persistence Guide

This guide demonstrates how to use the RHUDS Pro theme switching and persistence features.

## Features

- **Runtime Theme Switching** (Requirement 1.8): Switch themes without page reload
- **Theme Inheritance** (Requirement 1.9): Extend base themes with overrides
- **Theme Composition** (Requirement 1.10): Combine multiple theme fragments
- **localStorage Persistence** (Requirements 51.1-51.7): Save and restore theme preferences
- **Cross-Tab Sync** (Requirement 51.3): Sync theme changes across browser tabs
- **System Preference** (Requirement 51.4): Respect system dark/light mode

## Basic Usage

### 1. Create Themes

```typescript
import { createAppTheme } from '@rhuds/core/theme';

const lightTheme = createAppTheme({
  name: 'light',
  version: '1.0.0',
  primaryColor: '#00f6ff',
  secondaryColor: '#7b61ff',
  baseUnit: 4,
});

const darkTheme = createAppTheme({
  name: 'dark',
  version: '1.0.0',
  primaryColor: '#00f6ff',
  secondaryColor: '#7b61ff',
  baseUnit: 4,
});
```

### 2. Initialize Theme Manager

```typescript
import { ThemeManager } from '@rhuds/core/theme';

const manager = new ThemeManager(lightTheme);

// Register additional themes
manager.registerTheme(darkTheme);
```

### 3. Use in React

```typescript
import { useThemeManager } from '@rhuds/core/theme';

function App() {
  const {
    currentTheme,
    switchTheme,
    availableThemes,
    isLoading,
    error,
    systemPreference,
  } = useThemeManager(manager, {
    autoLoad: true, // Load from localStorage on mount
    respectSystemPreference: true, // Follow system dark/light mode
  });

  return (
    <div>
      <h1>Current Theme: {currentTheme.name}</h1>
      
      {/* Theme Switcher */}
      <select
        value={currentTheme.name}
        onChange={(e) => switchTheme(e.target.value)}
        disabled={isLoading}
      >
        {availableThemes.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
      
      {error && <p>Error: {error.message}</p>}
      
      <p>System Preference: {systemPreference}</p>
    </div>
  );
}
```

## Advanced Features

### Theme Inheritance

Extend a base theme with custom overrides:

```typescript
import { extendTheme } from '@rhuds/core/theme';

const customTheme = extendTheme(baseTheme, {
  name: 'custom',
  colors: {
    primary: {
      main: '#ff0000',
      light: '#ff6666',
      dark: '#cc0000',
      contrast: '#ffffff',
      alpha: (opacity) => `rgba(255, 0, 0, ${opacity})`,
    },
  },
  units: {
    space: {
      4: 20, // Override just one value
    },
  },
});

// All other properties are inherited from baseTheme
console.log(customTheme.typography); // Same as baseTheme
console.log(customTheme.units.space[5]); // Inherited from baseTheme
```

### Theme Composition

Combine multiple theme fragments:

```typescript
import { composeThemes } from '@rhuds/core/theme';

const colorFragment = {
  colors: {
    primary: createThemeColor('#ff0000'),
    secondary: createThemeColor('#00ff00'),
  },
};

const typographyFragment = {
  typography: {
    fontFamily: {
      primary: 'Inter, sans-serif',
      secondary: 'Orbitron, sans-serif',
      mono: 'Fira Code, monospace',
    },
  },
};

const composedTheme = composeThemes(
  baseTheme,
  colorFragment,
  typographyFragment
);
```

### Cross-Tab Synchronization

Enable theme sync across browser tabs:

```typescript
import { ThemeSyncManager } from '@rhuds/core/theme';

const syncManager = new ThemeSyncManager(manager);

// Theme changes in one tab will automatically sync to other tabs
// Clean up when done
syncManager.destroy();
```

### System Theme Preference

Watch for system theme changes:

```typescript
import {
  getSystemThemePreference,
  watchSystemThemePreference,
} from '@rhuds/core/theme';

// Get current preference
const preference = getSystemThemePreference(); // 'light' or 'dark'

// Watch for changes
const unwatch = watchSystemThemePreference((preference) => {
  console.log('System preference changed to:', preference);
  
  // Switch theme based on preference
  if (preference === 'dark') {
    manager.switchTheme('dark');
  } else {
    manager.switchTheme('light');
  }
});

// Clean up
unwatch();
```

### Custom Storage

Implement custom storage backend:

```typescript
import { ThemeStorage } from '@rhuds/core/theme';

class CustomStorage implements ThemeStorage {
  async save(theme: RHUDSTheme): Promise<void> {
    // Save to your backend
    await fetch('/api/theme', {
      method: 'POST',
      body: JSON.stringify(theme),
    });
  }

  async load(): Promise<RHUDSTheme | null> {
    // Load from your backend
    const response = await fetch('/api/theme');
    return response.json();
  }

  async clear(): Promise<void> {
    // Clear from your backend
    await fetch('/api/theme', { method: 'DELETE' });
  }
}

const manager = new ThemeManager(baseTheme, new CustomStorage());
```

### Theme Change Listeners

Subscribe to theme changes:

```typescript
const unsubscribe = manager.subscribe((theme) => {
  console.log('Theme changed to:', theme.name);
  
  // Update UI, analytics, etc.
  analytics.track('theme_changed', { theme: theme.name });
});

// Unsubscribe when done
unsubscribe();
```

## Performance

- Theme switching is instant (no page reload required)
- localStorage persistence completes within 100ms (Requirement 51.5)
- Theme changes trigger minimal re-renders
- Efficient deep merging for inheritance and composition

## Error Handling

The theme system handles errors gracefully:

- **localStorage quota exceeded**: Automatically clears old data and retries
- **Invalid theme data**: Returns null and logs error
- **Listener errors**: Isolated to prevent cascading failures
- **Storage errors**: Logged but don't crash the application

## TypeScript Support

Full TypeScript support with type inference:

```typescript
import type { RHUDSTheme, ThemeStorage } from '@rhuds/core/theme';

// Type-safe theme creation
const theme: RHUDSTheme = createAppTheme({
  name: 'my-theme',
  primaryColor: '#00f6ff',
});

// Type-safe storage implementation
class MyStorage implements ThemeStorage {
  // TypeScript ensures you implement all required methods
}
```

## Testing

The theme system includes comprehensive tests:

- Unit tests for all core functionality
- Integration tests for React hooks
- Property-based tests for round-trip serialization
- Performance tests for persistence timing

## Browser Support

- Modern browsers with localStorage support
- SSR-safe (gracefully handles missing window object)
- Works with React 18+ concurrent rendering
- Compatible with React Server Components

## Migration from Old Theme System

If you're migrating from the old RHUDS theme system:

```typescript
// Old system
import { ThemeProvider, useTheme } from '@rhuds/core/theme';

// New system - still compatible!
import { ThemeProvider, useTheme } from '@rhuds/core/theme';

// Plus new features:
import {
  ThemeManager,
  useThemeManager,
  extendTheme,
  composeThemes,
} from '@rhuds/core/theme';
```

The new system is backward compatible with the existing ThemeProvider and useTheme hook.
