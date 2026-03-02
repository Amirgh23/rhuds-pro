import { createTheme, darkMode } from '../index'

describe('createTheme', () => {
  it('should create a theme with overrides', () => {
    const customTheme = createTheme('custom', darkMode, {
      colors: { primary: '#ff0000' },
    })

    expect(customTheme.name).toBe('custom')
    expect(customTheme.tokens.colors.primary).toBe('#ff0000')
    expect(customTheme.tokens.colors.secondary).toBe(darkMode.tokens.colors.secondary)
  })

  it('should throw error for empty name', () => {
    expect(() => createTheme('', darkMode)).toThrow('Theme name must be non-empty string')
  })

  it('should throw error for invalid base mode', () => {
    expect(() => createTheme('test', null as any)).toThrow('Base mode must be valid ThemeMode object')
  })

  it('should preserve all required tokens', () => {
    const customTheme = createTheme('test', darkMode)
    expect(customTheme.tokens.colors).toBeDefined()
    expect(customTheme.tokens.spacing).toBeDefined()
    expect(customTheme.tokens.typography).toBeDefined()
    expect(customTheme.tokens.shadows).toBeDefined()
    expect(customTheme.tokens.transitions).toBeDefined()
    expect(customTheme.tokens.breakpoints).toBeDefined()
  })

  it('should deep merge nested tokens', () => {
    const customTheme = createTheme('test', darkMode, {
      typography: {
        fontSize: { xs: '10px' },
      },
    })

    expect(customTheme.tokens.typography.fontSize.xs).toBe('10px')
    expect(customTheme.tokens.typography.fontSize.md).toBe(darkMode.tokens.typography.fontSize.md)
  })
})
