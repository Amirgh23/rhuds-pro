import fc from 'fast-check'
import { darkMode, lightMode, neonGreenMode, neonBlueMode, neonRedMode } from '../themes'
import { ThemeMode } from '../types'

/**
 * **Validates: Requirements FR-3, FR-4**
 * Property-based tests for theme system correctness
 */

describe('Theme System Properties', () => {
  const allThemes = [darkMode, lightMode, neonGreenMode, neonBlueMode, neonRedMode]

  it('should have all required token categories in every theme', () => {
    const requiredCategories = ['colors', 'spacing', 'typography', 'shadows', 'transitions', 'breakpoints']

    allThemes.forEach((theme) => {
      requiredCategories.forEach((category) => {
        expect(theme.tokens).toHaveProperty(category)
        expect(theme.tokens[category as keyof typeof theme.tokens]).toBeDefined()
      })
    })
  })

  it('should have all required color tokens', () => {
    const requiredColors = [
      'primary',
      'secondary',
      'accent',
      'background',
      'surface',
      'text',
      'border',
      'success',
      'warning',
      'error',
      'info',
    ]

    allThemes.forEach((theme) => {
      requiredColors.forEach((color) => {
        expect(theme.tokens.colors).toHaveProperty(color)
        expect(typeof theme.tokens.colors[color as keyof typeof theme.tokens.colors]).toBe('string')
      })
    })
  })

  it('should have valid CSS color values for all color tokens', () => {
    fc.assert(
      fc.property(fc.constantFrom(...allThemes), (theme: ThemeMode) => {
        const colors = theme.tokens.colors
        for (const [key, value] of Object.entries(colors)) {
          // Check if it's a valid hex color or rgb/rgba
          const isValidColor =
            /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value) ||
            /^rgb\(/.test(value) ||
            /^rgba\(/.test(value)
          expect(isValidColor).toBe(true)
        }
        return true
      })
    )
  })

  it('should have valid CSS time values for transitions', () => {
    fc.assert(
      fc.property(fc.constantFrom(...allThemes), (theme: ThemeMode) => {
        const transitions = theme.tokens.transitions
        for (const [_key, value] of Object.entries(transitions)) {
          // Check if it's a valid CSS time value
          expect(/^\d+ms\s+ease/.test(value)).toBe(true)
        }
        return true
      })
    )
  })

  it('should have valid CSS size values for spacing', () => {
    fc.assert(
      fc.property(fc.constantFrom(...allThemes), (theme: ThemeMode) => {
        const spacing = theme.tokens.spacing
        for (const [_key, value] of Object.entries(spacing)) {
          // Check if it's a valid CSS size value
          expect(/^\d+px$/.test(value)).toBe(true)
        }
        return true
      })
    )
  })

  it('should have consistent theme structure across all themes', () => {
    const firstTheme = allThemes[0]
    const firstThemeKeys = Object.keys(firstTheme.tokens).sort()

    allThemes.forEach((theme) => {
      const themeKeys = Object.keys(theme.tokens).sort()
      expect(themeKeys).toEqual(firstThemeKeys)
    })
  })

  it('should have unique theme names', () => {
    const names = allThemes.map((t) => t.name)
    const uniqueNames = new Set(names)
    expect(uniqueNames.size).toBe(names.length)
  })

  it('should have valid breakpoint values', () => {
    fc.assert(
      fc.property(fc.constantFrom(...allThemes), (theme: ThemeMode) => {
        const breakpoints = theme.tokens.breakpoints
        for (const [_key, value] of Object.entries(breakpoints)) {
          // Check if it's a valid CSS size value
          expect(/^\d+px$/.test(value)).toBe(true)
        }
        return true
      })
    )
  })
})
