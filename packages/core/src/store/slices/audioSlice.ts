/**
 * Audio State Slice
 * Manages global audio state
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AudioState {
  masterVolume: number;
  muted: boolean;
  categories: Record<
    string,
    {
      volume: number;
      muted: boolean;
    }
  >;
  activeBleeps: string[];
  spatialAudioEnabled: boolean;
}

const initialState: AudioState = {
  masterVolume: 1,
  muted: false,
  categories: {
    ui: { volume: 1, muted: false },
    music: { volume: 0.6, muted: false },
    sfx: { volume: 0.8, muted: false },
    ambient: { volume: 0.5, muted: false },
  },
  activeBleeps: [],
  spatialAudioEnabled: false,
};

const audioSlice = createSlice({
  name: 'audio',
  initialState,
  reducers: {
    setMasterVolume: (state, action: PayloadAction<number>) => {
      state.masterVolume = Math.max(0, Math.min(1, action.payload));
      localStorage.setItem('rhuds-master-volume', String(state.masterVolume));
    },

    setMuted: (state, action: PayloadAction<boolean>) => {
      state.muted = action.payload;
      localStorage.setItem('rhuds-audio-muted', String(action.payload));
    },

    toggleMute: (state) => {
      state.muted = !state.muted;
      localStorage.setItem('rhuds-audio-muted', String(state.muted));
    },

    setCategoryVolume: (
      state,
      action: PayloadAction<{ category: string; volume: number }>
    ) => {
      const { category, volume } = action.payload;
      if (!state.categories[category]) {
        state.categories[category] = { volume: 1, muted: false };
      }
      state.categories[category].volume = Math.max(0, Math.min(1, volume));
    },

    setCategoryMuted: (
      state,
      action: PayloadAction<{ category: string; muted: boolean }>
    ) => {
      const { category, muted } = action.payload;
      if (!state.categories[category]) {
        state.categories[category] = { volume: 1, muted: false };
      }
      state.categories[category].muted = muted;
    },

    toggleCategoryMute: (state, action: PayloadAction<string>) => {
      const category = action.payload;
      if (!state.categories[category]) {
        state.categories[category] = { volume: 1, muted: false };
      }
      state.categories[category].muted = !state.categories[category].muted;
    },

    registerBleep: (state, action: PayloadAction<string>) => {
      if (!state.activeBleeps.includes(action.payload)) {
        state.activeBleeps.push(action.payload);
      }
    },

    unregisterBleep: (state, action: PayloadAction<string>) => {
      state.activeBleeps = state.activeBleeps.filter(
        (id) => id !== action.payload
      );
    },

    setSpatialAudioEnabled: (state, action: PayloadAction<boolean>) => {
      state.spatialAudioEnabled = action.payload;
      localStorage.setItem(
        'rhuds-spatial-audio',
        String(action.payload)
      );
    },

    loadAudioFromStorage: (state) => {
      const masterVolume = localStorage.getItem('rhuds-master-volume');
      if (masterVolume !== null) {
        state.masterVolume = parseFloat(masterVolume);
      }

      const muted = localStorage.getItem('rhuds-audio-muted');
      if (muted !== null) {
        state.muted = muted === 'true';
      }

      const spatialAudio = localStorage.getItem('rhuds-spatial-audio');
      if (spatialAudio !== null) {
        state.spatialAudioEnabled = spatialAudio === 'true';
      }
    },
  },
});

export const {
  setMasterVolume,
  setMuted,
  toggleMute,
  setCategoryVolume,
  setCategoryMuted,
  toggleCategoryMute,
  registerBleep,
  unregisterBleep,
  setSpatialAudioEnabled,
  loadAudioFromStorage,
} = audioSlice.actions;

export default audioSlice.reducer;
