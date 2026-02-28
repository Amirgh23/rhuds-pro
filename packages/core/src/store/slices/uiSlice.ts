import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Notification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

export interface UIState {
  openModals: string[]
  activeDropdowns: string[]
  notifications: Notification[]
}

const initialState: UIState = {
  openModals: [],
  activeDropdowns: [],
  notifications: [],
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    openModal: (state, action: PayloadAction<string>) => {
      if (!state.openModals.includes(action.payload)) {
        state.openModals.push(action.payload)
      }
    },
    closeModal: (state, action: PayloadAction<string>) => {
      state.openModals = state.openModals.filter((id) => id !== action.payload)
    },
    closeAllModals: (state) => {
      state.openModals = []
    },
    openDropdown: (state, action: PayloadAction<string>) => {
      if (!state.activeDropdowns.includes(action.payload)) {
        state.activeDropdowns.push(action.payload)
      }
    },
    closeDropdown: (state, action: PayloadAction<string>) => {
      state.activeDropdowns = state.activeDropdowns.filter(
        (id) => id !== action.payload
      )
    },
    closeAllDropdowns: (state) => {
      state.activeDropdowns = []
    },
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.push(action.payload)

      // Auto-remove notification after duration
      if (action.payload.duration) {
        setTimeout(() => {
          state.notifications = state.notifications.filter(
            (n) => n.id !== action.payload.id
          )
        }, action.payload.duration)
      }
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(
        (n) => n.id !== action.payload
      )
    },
    clearNotifications: (state) => {
      state.notifications = []
    },
  },
})

export const {
  openModal,
  closeModal,
  closeAllModals,
  openDropdown,
  closeDropdown,
  closeAllDropdowns,
  addNotification,
  removeNotification,
  clearNotifications,
} = uiSlice.actions
export default uiSlice.reducer
