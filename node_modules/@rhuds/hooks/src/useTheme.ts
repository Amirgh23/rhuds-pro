import React from 'react'

// Re-export from core to avoid circular dependency
// This will be properly imported from @rhuds/core in the actual implementation
export function useTheme() {
  // This will be implemented to use the ThemeContext from core
  throw new Error('useTheme must be used within <ThemeProvider>')
}
