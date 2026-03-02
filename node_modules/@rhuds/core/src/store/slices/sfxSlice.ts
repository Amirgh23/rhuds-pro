import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface SFXState {
  enabled: boolean
  volume: number
}

const initialState: SFXState = {
  enabled: true,
  volume: 1,
}

const sfxSlice = createSlice({
  name: 'sfx',
  initialState,
  reducers: {
    setEnabled: (state, action: PayloadAction<boolean>) => {
      state.enabled = action.payload
      localStorage.setItem('rhuds-sfx-enabled', JSON.stringify(action.payload))
    },
    setVolume: (state, action: PayloadAction<number>) => {
      state.volume = Math.max(0, Math.min(1, action.payload))
      localStorage.setItem('rhuds-sfx-volume', JSON.stringify(state.volume))
    },
    toggleEnabled: (state) => {
      state.enabled = !state.enabled
      localStorage.setItem('rhuds-sfx-enabled', JSON.stringify(state.enabled))
    },
    loadSFXFromStorage: (state) => {
      const savedEnabled = localStorage.getItem('rhuds-sfx-enabled')
      const savedVolume = localStorage.getItem('rhuds-sfx-volume')

      if (savedEnabled !== null) {
        state.enabled = JSON.parse(savedEnabled)
      }

      if (savedVolume !== null) {
        const volume = JSON.parse(savedVolume)
        state.volume = Math.max(0, Math.min(1, volume))
      }
    },
  },
})

export const { setEnabled, setVolume, toggleEnabled, loadSFXFromStorage } =
  sfxSlice.actions
export default sfxSlice.reducer
