import { configureStore } from '@reduxjs/toolkit'
import themeReducer from './slices/themeSlice'
import uiReducer from './slices/uiSlice'
import sfxReducer from './slices/sfxSlice'

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    ui: uiReducer,
    sfx: sfxReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore notification action callbacks
        ignoredActions: ['ui/addNotification'],
        ignoredPaths: ['ui.notifications[].action.onClick'],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
