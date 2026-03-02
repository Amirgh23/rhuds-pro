import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface ThemeState {
  currentMode: 'dark' | 'light' | 'neon-green' | 'neon-blue' | 'neon-red'
  customTokens: Record<string, string>
}

const initialState: ThemeState = {
  currentMode: 'dark',
  customTokens: {},
}

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<ThemeState['currentMode']>) => {
      state.currentMode = action.payload
      localStorage.setItem('rhuds-theme', action.payload)
    },
    customizeToken: (
      state,
      action: PayloadAction<{ path: string; value: string }>
    ) => {
      state.customTokens[action.payload.path] = action.payload.value
    },
    resetTheme: (state) => {
      state.customTokens = {}
      state.currentMode = 'dark'
      localStorage.removeItem('rhuds-theme')
    },
    loadThemeFromStorage: (state) => {
      const savedTheme = localStorage.getItem('rhuds-theme')
      if (
        savedTheme &&
        ['dark', 'light', 'neon-green', 'neon-blue', 'neon-red'].includes(
          savedTheme
        )
      ) {
        state.currentMode = savedTheme as ThemeState['currentMode']
      }
    },
  },
})

export const { setTheme, customizeToken, resetTheme, loadThemeFromStorage } =
  themeSlice.actions
export default themeSlice.reducer
