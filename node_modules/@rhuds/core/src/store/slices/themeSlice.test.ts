import themeReducer, {
  setTheme,
  customizeToken,
  resetTheme,
  loadThemeFromStorage,
  ThemeState,
} from './themeSlice'

describe('themeSlice', () => {
  const initialState: ThemeState = {
    currentMode: 'dark',
    customTokens: {},
  }

  it('returns initial state', () => {
    expect(themeReducer(undefined, { type: 'unknown' })).toEqual(initialState)
  })

  it('handles setTheme', () => {
    const actual = themeReducer(initialState, setTheme('light'))
    expect(actual.currentMode).toEqual('light')
  })

  it('handles customizeToken', () => {
    const actual = themeReducer(
      initialState,
      customizeToken({ path: 'colors.primary', value: '#00ff00' })
    )
    expect(actual.customTokens['colors.primary']).toEqual('#00ff00')
  })

  it('handles resetTheme', () => {
    const stateWithTokens: ThemeState = {
      currentMode: 'neon-green',
      customTokens: { 'colors.primary': '#00ff00' },
    }
    const actual = themeReducer(stateWithTokens, resetTheme())
    expect(actual.currentMode).toEqual('dark')
    expect(actual.customTokens).toEqual({})
  })

  it('handles loadThemeFromStorage', () => {
    localStorage.setItem('rhuds-theme', 'neon-blue')
    const actual = themeReducer(initialState, loadThemeFromStorage())
    expect(actual.currentMode).toEqual('neon-blue')
    localStorage.removeItem('rhuds-theme')
  })

  it('ignores invalid theme from storage', () => {
    localStorage.setItem('rhuds-theme', 'invalid-theme')
    const actual = themeReducer(initialState, loadThemeFromStorage())
    expect(actual.currentMode).toEqual('dark')
    localStorage.removeItem('rhuds-theme')
  })

  it('supports multiple custom tokens', () => {
    let state = initialState
    state = themeReducer(
      state,
      customizeToken({ path: 'colors.primary', value: '#00ff00' })
    )
    state = themeReducer(
      state,
      customizeToken({ path: 'colors.secondary', value: '#00ffff' })
    )
    expect(state.customTokens['colors.primary']).toEqual('#00ff00')
    expect(state.customTokens['colors.secondary']).toEqual('#00ffff')
  })
})
