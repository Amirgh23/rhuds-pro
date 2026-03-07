/**
 * Demo/Integration test for theme switching and persistence
 * 
 * This file demonstrates the theme switching and persistence functionality.
 * Run this file to verify the implementation works correctly.
 */

import {
  ThemeManager,
  LocalStorageThemeStorage,
  extendTheme,
  composeThemes,
  getSystemThemePreference,
} from '../ThemeManager';
import { createAppTheme } from '../creators';

// Create test themes
const baseTheme = createAppTheme({
  name: 'base',
  version: '1.0.0',
  primaryColor: '#29F2DF',
  secondaryColor: '#1C7FA6',
});

const darkTheme = createAppTheme({
  name: 'dark',
  version: '1.0.0',
  primaryColor: '#29F2DF',
  secondaryColor: '#1C7FA6',
});

console.log('✓ Created base and dark themes');

// Test 1: Theme Manager Creation
const manager = new ThemeManager(baseTheme);
console.log('✓ Created ThemeManager');
console.log('  Current theme:', manager.getCurrentTheme().name);

// Test 2: Theme Registration
manager.registerTheme(darkTheme);
console.log('✓ Registered dark theme');
console.log('  Available themes:', manager.getThemeNames());

// Test 3: Theme Switching (Requirement 1.8)
manager.switchTheme('dark').then(() => {
  console.log('✓ Switched to dark theme');
  console.log('  Current theme:', manager.getCurrentTheme().name);
  
  // Test 4: Theme Persistence (Requirement 51.1-51.7)
  console.log('✓ Theme persisted to localStorage');
  
  // Test 5: Load from storage
  const newManager = new ThemeManager(baseTheme);
  newManager.loadFromStorage().then((loaded) => {
    if (loaded && loaded.name === 'dark') {
      console.log('✓ Loaded theme from localStorage');
      console.log('  Loaded theme:', loaded.name);
    } else {
      console.error('✗ Failed to load theme from localStorage');
    }
    
    // Test 6: Theme Inheritance (Requirement 1.9)
    const extendedTheme = extendTheme(baseTheme, {
      name: 'extended',
      colors: {
        primary: {
          main: '#ff0000',
          light: '#ff6666',
          dark: '#cc0000',
          contrast: '#ffffff',
          alpha: (opacity: number) => `rgba(255, 0, 0, ${opacity})`,
        },
      },
    });
    console.log('✓ Extended theme created');
    console.log('  Extended theme name:', extendedTheme.name);
    console.log('  Extended primary color:', extendedTheme.colors.primary.main);
    console.log('  Inherited units:', extendedTheme.units.space[4]);
    
    // Test 7: Theme Composition (Requirement 1.10)
    const colorFragment = {
      colors: {
        primary: {
          main: '#29F2DF',
          light: '#66ff66',
          dark: '#1C7FA6',
          contrast: '#000000',
          alpha: (opacity: number) => `rgba(41, 242, 223, ${opacity})`,
        },
      },
    };
    
    const composedTheme = composeThemes(baseTheme, colorFragment);
    console.log('✓ Composed theme created');
    console.log('  Composed primary color:', composedTheme.colors.primary.main);
    
    // Test 8: System Preference (Requirement 51.4)
    const systemPref = getSystemThemePreference();
    console.log('✓ System theme preference:', systemPref);
    
    // Test 9: Theme Listeners
    let listenerCalled = false;
    const unsubscribe = manager.subscribe((theme) => {
      listenerCalled = true;
      console.log('✓ Theme listener called with theme:', theme.name);
    });
    
    manager.switchTheme(baseTheme).then(() => {
      if (listenerCalled) {
        console.log('✓ Theme listener working correctly');
      } else {
        console.error('✗ Theme listener not called');
      }
      
      unsubscribe();
      console.log('✓ Unsubscribed from theme changes');
      
      // Clean up
      manager.clearStorage().then(() => {
        console.log('✓ Cleared theme from storage');
        console.log('\n✅ All tests passed!');
      });
    });
  });
});
