import { useContext } from 'react'
import { ThemeContext } from './context'
import { ThemeContextValue } from './types'

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error(
      'useTheme must be used within <ThemeProvider>. ' +
        'Wrap your app with: <ThemeProvider><App /></ThemeProvider>'
    )
  }
  return context
}
