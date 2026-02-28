export { store } from './store'
export type { RootState, AppDispatch } from './store'

// Theme slice
export { default as themeReducer } from './slices/themeSlice'
export {
  setTheme,
  customizeToken,
  resetTheme,
  loadThemeFromStorage,
} from './slices/themeSlice'
export type { ThemeState } from './slices/themeSlice'

// UI slice
export { default as uiReducer } from './slices/uiSlice'
export {
  openModal,
  closeModal,
  closeAllModals,
  openDropdown,
  closeDropdown,
  closeAllDropdowns,
  addNotification,
  removeNotification,
  clearNotifications,
} from './slices/uiSlice'
export type { UIState, Notification } from './slices/uiSlice'

// SFX slice
export { default as sfxReducer } from './slices/sfxSlice'
export {
  setEnabled,
  setVolume,
  toggleEnabled,
  loadSFXFromStorage,
} from './slices/sfxSlice'
export type { SFXState } from './slices/sfxSlice'
