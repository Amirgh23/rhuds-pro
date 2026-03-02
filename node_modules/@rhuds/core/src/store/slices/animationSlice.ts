/**
 * Animation State Slice
 * Manages global animation state
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AnimationState {
  enabled: boolean;
  reducedMotion: boolean;
  globalSpeed: number;
  activeAnimations: string[];
  animationPreferences: {
    duration: {
      enter: number;
      exit: number;
    };
    easing: {
      enter: string;
      exit: string;
    };
  };
}

const initialState: AnimationState = {
  enabled: true,
  reducedMotion: false,
  globalSpeed: 1,
  activeAnimations: [],
  animationPreferences: {
    duration: {
      enter: 300,
      exit: 200,
    },
    easing: {
      enter: 'easeInOut',
      exit: 'easeInOut',
    },
  },
};

const animationSlice = createSlice({
  name: 'animation',
  initialState,
  reducers: {
    setAnimationEnabled: (state, action: PayloadAction<boolean>) => {
      state.enabled = action.payload;
      localStorage.setItem('rhuds-animation-enabled', String(action.payload));
    },

    setReducedMotion: (state, action: PayloadAction<boolean>) => {
      state.reducedMotion = action.payload;
      localStorage.setItem('rhuds-reduced-motion', String(action.payload));
    },

    setGlobalSpeed: (state, action: PayloadAction<number>) => {
      state.globalSpeed = Math.max(0.1, Math.min(4, action.payload));
    },

    registerAnimation: (state, action: PayloadAction<string>) => {
      if (!state.activeAnimations.includes(action.payload)) {
        state.activeAnimations.push(action.payload);
      }
    },

    unregisterAnimation: (state, action: PayloadAction<string>) => {
      state.activeAnimations = state.activeAnimations.filter(
        (id) => id !== action.payload
      );
    },

    setAnimationDuration: (
      state,
      action: PayloadAction<{ enter?: number; exit?: number }>
    ) => {
      if (action.payload.enter !== undefined) {
        state.animationPreferences.duration.enter = action.payload.enter;
      }
      if (action.payload.exit !== undefined) {
        state.animationPreferences.duration.exit = action.payload.exit;
      }
    },

    setAnimationEasing: (
      state,
      action: PayloadAction<{ enter?: string; exit?: string }>
    ) => {
      if (action.payload.enter) {
        state.animationPreferences.easing.enter = action.payload.enter;
      }
      if (action.payload.exit) {
        state.animationPreferences.easing.exit = action.payload.exit;
      }
    },

    loadAnimationFromStorage: (state) => {
      const enabled = localStorage.getItem('rhuds-animation-enabled');
      if (enabled !== null) {
        state.enabled = enabled === 'true';
      }

      const reducedMotion = localStorage.getItem('rhuds-reduced-motion');
      if (reducedMotion !== null) {
        state.reducedMotion = reducedMotion === 'true';
      }

      // Check system preference for reduced motion
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        state.reducedMotion = true;
      }
    },
  },
});

export const {
  setAnimationEnabled,
  setReducedMotion,
  setGlobalSpeed,
  registerAnimation,
  unregisterAnimation,
  setAnimationDuration,
  setAnimationEasing,
  loadAnimationFromStorage,
} = animationSlice.actions;

export default animationSlice.reducer;
