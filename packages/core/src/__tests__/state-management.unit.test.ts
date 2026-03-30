/**
 * Unit Tests for State Management System
 * Tests Redux store, slices, and middleware
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import themeReducer, { customizeToken } from '../store/slices/themeSlice';
import audioReducer, { setCategoryVolume } from '../store/slices/audioSlice';
import animationReducer from '../store/slices/animationSlice';
import uiReducer, { openModal, closeModal, addNotification } from '../store/slices/uiSlice';

describe('State Management System', () => {
  describe('Theme Slice', () => {
    let store: any;

    beforeEach(() => {
      store = configureStore({
        reducer: { theme: themeReducer },
      });
    });

    it('should have initial state', () => {
      const state = store.getState().theme;
      expect(state.currentMode).toBe('dark');
      expect(state.customTokens).toEqual({});
    });

    it('should customize token', () => {
      store.dispatch(customizeToken({ path: 'colors.primary', value: '#FF0000' }));
      expect(store.getState().theme.customTokens['colors.primary']).toBe('#FF0000');
    });
  });

  describe('Audio Slice', () => {
    let store: any;

    beforeEach(() => {
      store = configureStore({
        reducer: { audio: audioReducer },
      });
    });

    it('should have initial state', () => {
      const state = store.getState().audio;
      expect(state.masterVolume).toBe(1);
      expect(state.muted).toBe(false);
      expect(state.spatialAudioEnabled).toBe(false);
    });

    it('should set category volume', () => {
      store.dispatch(setCategoryVolume({ category: 'music', volume: 0.7 }));
      expect(store.getState().audio.categories.music.volume).toBe(0.7);
    });
  });

  describe('UI Slice', () => {
    let store: any;

    beforeEach(() => {
      store = configureStore({
        reducer: { ui: uiReducer },
      });
    });

    it('should open modal', () => {
      store.dispatch(openModal('testModal'));
      expect(store.getState().ui.openModals).toContain('testModal');
    });

    it('should close modal', () => {
      store.dispatch(openModal('testModal'));
      store.dispatch(closeModal('testModal'));
      expect(store.getState().ui.openModals).not.toContain('testModal');
    });

    it('should add notification', () => {
      store.dispatch(
        addNotification({
          id: 'notif-1',
          type: 'success',
          message: 'Test notification',
        })
      );
      expect(store.getState().ui.notifications.length).toBe(1);
    });
  });

  describe('Combined Store', () => {
    let store: any;

    beforeEach(() => {
      store = configureStore({
        reducer: {
          theme: themeReducer,
          audio: audioReducer,
          animation: animationReducer,
          ui: uiReducer,
        },
      });
    });

    it('should manage multiple slices', () => {
      store.dispatch(customizeToken({ path: 'colors.primary', value: '#FF0000' }));
      store.dispatch(setCategoryVolume({ category: 'music', volume: 0.7 }));
      store.dispatch(openModal('settings'));

      const state = store.getState();
      expect(state.theme.customTokens['colors.primary']).toBe('#FF0000');
      expect(state.audio.categories.music.volume).toBe(0.7);
      expect(state.ui.openModals).toContain('settings');
    });
  });

  describe('State Selectors', () => {
    let store: any;

    beforeEach(() => {
      store = configureStore({
        reducer: {
          theme: themeReducer,
          audio: audioReducer,
        },
      });
    });

    it('should select theme state', () => {
      store.dispatch(customizeToken({ path: 'colors.primary', value: '#FF0000' }));
      const themeState = store.getState().theme;
      expect(themeState.customTokens['colors.primary']).toBe('#FF0000');
    });

    it('should select audio state', () => {
      store.dispatch(setCategoryVolume({ category: 'music', volume: 0.5 }));
      const audioState = store.getState().audio;
      expect(audioState.categories.music.volume).toBe(0.5);
    });

    it('should select nested state', () => {
      store.dispatch(setCategoryVolume({ category: 'music', volume: 0.8 }));
      const musicVolume = store.getState().audio.categories.music.volume;
      expect(musicVolume).toBe(0.8);
    });
  });
});
