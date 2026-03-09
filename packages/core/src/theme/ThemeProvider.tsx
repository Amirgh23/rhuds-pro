import React from 'react'
import { ThemeContext } from './context'
import { ThemeMode, ThemeContextValue } from './types'
import { DEFAULT_THEMES } from './themes'

interface ThemeProviderProps {
  themes?: ThemeMode[]
  defaultTheme?: ThemeMode['name']
  children: React.ReactNode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  themes = DEFAULT_THEMES,
  defaultTheme = 'dark',
  children,
}) => {
  const [currentMode, setCurrentMode] = React.useState<ThemeMode>(() => {
    // Try to load from localStorage
    const saved = localStorage.getItem('rhuds-theme')
    if (saved) {
      const theme = themes.find((t) => t.name === saved)
      if (theme) return theme
    }
    // Fall back to default
    return themes.find((t) => t.name === defaultTheme) || themes[0]
  })

  const [customTokens, setCustomTokens] = React.useState<Record<string, string>>({})

  // Inject CSS variables
  React.useEffect(() => {
    const root = document.documentElement
    const tokens = { ...currentMode.tokens }

    // Merge custom tokens
    const mergedTokens = deepMerge(tokens, customTokens)

    // Inject CSS variables
    injectCSSVariables(mergedTokens)
  }, [currentMode, customTokens])

  const handleSetTheme = React.useCallback((themeName: ThemeMode['name']) => {
    const theme = themes.find((t) => t.name === themeName)
    if (theme) {
      setCurrentMode(theme)
      localStorage.setItem('rhuds-theme', themeName)
    }
  }, [themes])

  const handleCustomizeToken = React.useCallback((path: string, value: string) => {
    if (!isValidTokenValue(value)) {
      console.error(`Invalid token value for "${path}": ${value}`)
      return
    }
    setCustomTokens((prev) => ({
      ...prev,
      [path]: value,
    }))
  }, [])

  const value: ThemeContextValue = {
    currentMode,
    availableModes: themes,
    setTheme: handleSetTheme,
    customizeToken: handleCustomizeToken,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

function deepMerge(target: any, source: any): any {
  const result = { ...target }
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      if (typeof source[key] === 'object' && source[key] !== null) {
        result[key] = deepMerge(result[key] || {}, source[key])
      } else {
        result[key] = source[key]
      }
    }
  }
  return result
}

function injectCSSVariables(tokens: any, prefix = 'rhuds'): void {
  const root = document.documentElement
  const flattenTokens = flattenObject(tokens)
  for (const [key, value] of Object.entries(flattenTokens)) {
    root.style.setProperty(`--${prefix}-${key}`, String(value))
  }
}

function flattenObject(obj: any, prefix = ''): Record<string, any> {
  const result: Record<string, any> = {}
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key]
      const newKey = prefix ? `${prefix}-${key}` : key
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        Object.assign(result, flattenObject(value, newKey))
      } else {
        result[newKey] = value
      }
    }
  }
  return result
}

function isValidTokenValue(value: string): boolean {
  // Basic validation - check if it's a valid CSS value
  if (typeof value !== 'string' || value.length === 0) {
    return false
  }
  // Prevent XSS by checking for suspicious patterns
  if (value.includes('<') || value.includes('>') || value.includes(';')) {
    return false
  }
  return true
}
