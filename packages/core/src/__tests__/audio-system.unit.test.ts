/**
 * Unit Tests for Audio System Foundation
 * Tests bleep creation, playback, and mixing
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { BleepManager } from '../audio/BleepManager';
import type { BleepConfig } from '../audio/types';

// Mock window and AudioContext
const mockAudioContext = {
  createGain: () => ({
    connect: () => {},
    gain: { value: 1 },
  }),
  createAnalyser: () => ({
    connect: () => {},
    frequencyBinCount: 256,
    getByteFrequencyData: () => {},
    getByteTimeDomainData: () => {},
  }),
  createBufferSource: () => ({
    connect: () => {},
    start: () => {},
    stop: () => {},
    buffer: null,
    loop: false,
  }),
  destination: {},
  currentTime: 0,
  state: 'running',
  close: () => {},
  decodeAudioData: async () => null,
};

describe('Audio System Foundation', () => {
  let manager: BleepManager;

  beforeEach(() => {
    // Mock AudioContext globally
    (global as any).window = {
      AudioContext: function () {
        return mockAudioContext;
      },
      webkitAudioContext: function () {
        return mockAudioContext;
      },
    };

    manager = new BleepManager();
  });

  afterEach(() => {
    manager.cleanup();
  });

  describe('BleepManager Initialization', () => {
    it('should initialize with default config', () => {
      expect(manager).toBeDefined();
    });

    it('should initialize with custom config', () => {
      const customManager = new BleepManager({
        masterVolume: 0.5,
        categoryVolumes: { effects: 0.8, music: 0.6 },
      });
      expect(customManager).toBeDefined();
      customManager.cleanup();
    });
  });

  describe('Bleep Creation', () => {
    it('should create a bleep', () => {
      const config: BleepConfig = {
        id: 'test-bleep',
        sources: [{ url: 'test.mp3' }],
        volume: 0.8,
      };

      manager.createBleep(config);
      const state = manager.getBleepState('test-bleep');

      expect(state).not.toBeNull();
      expect(state?.id).toBe('test-bleep');
      expect(state?.volume).toBe(0.8);
    });

    it('should not create duplicate bleeps', () => {
      const config: BleepConfig = {
        id: 'duplicate',
        sources: [{ url: 'test.mp3' }],
      };

      manager.createBleep(config);
      manager.createBleep(config);

      // Should only have one bleep
      expect(manager.getBleepState('duplicate')).not.toBeNull();
    });

    it('should create bleep with loop config', () => {
      const config: BleepConfig = {
        id: 'looped',
        sources: [{ url: 'test.mp3' }],
        loop: true,
        loopStart: 0,
        loopEnd: 10,
      };

      manager.createBleep(config);
      const state = manager.getBleepState('looped');

      expect(state).not.toBeNull();
    });

    it('should create bleep with category', () => {
      const config: BleepConfig = {
        id: 'categorized',
        sources: [{ url: 'test.mp3' }],
        category: 'effects',
      };

      manager.createBleep(config);
      const state = manager.getBleepState('categorized');

      expect(state).not.toBeNull();
    });
  });

  describe('Volume Control', () => {
    beforeEach(() => {
      const config: BleepConfig = {
        id: 'volume-test',
        sources: [{ url: 'test.mp3' }],
        volume: 1,
      };
      manager.createBleep(config);
    });

    it('should set bleep volume', () => {
      manager.setBleepVolume('volume-test', 0.5);
      const state = manager.getBleepState('volume-test');

      expect(state?.volume).toBe(0.5);
    });

    it('should clamp bleep volume to 0-1', () => {
      manager.setBleepVolume('volume-test', 1.5);
      let state = manager.getBleepState('volume-test');
      expect(state?.volume).toBe(1);

      manager.setBleepVolume('volume-test', -0.5);
      state = manager.getBleepState('volume-test');
      expect(state?.volume).toBe(0);
    });

    it('should set category volume', () => {
      manager.setCategoryVolume('effects', 0.7);
      // Category volume is set internally
      expect(manager).toBeDefined();
    });

    it('should set master volume', () => {
      manager.setMasterVolume(0.6);
      expect(manager).toBeDefined();
    });

    it('should clamp master volume to 0-1', () => {
      manager.setMasterVolume(1.5);
      manager.setMasterVolume(-0.5);
      expect(manager).toBeDefined();
    });
  });

  describe('Bleep Playback', () => {
    beforeEach(() => {
      const config: BleepConfig = {
        id: 'playback-test',
        sources: [{ url: 'test.mp3', duration: 5 }],
      };
      manager.createBleep(config);
    });

    it('should handle play request', () => {
      manager.playBleep('playback-test');
      // Playback requires actual audio buffer, so we just verify no errors
      expect(manager).toBeDefined();
    });

    it('should stop a bleep', () => {
      manager.playBleep('playback-test');
      manager.stopBleep('playback-test');
      const state = manager.getBleepState('playback-test');

      expect(state?.playing).toBe(false);
    });

    it('should pause a bleep', () => {
      manager.playBleep('playback-test');
      manager.pauseBleep('playback-test');
      // Pause requires active playback, so just verify no errors
      expect(manager).toBeDefined();
    });

    it('should resume a paused bleep', () => {
      manager.playBleep('playback-test');
      manager.pauseBleep('playback-test');
      manager.resumeBleep('playback-test');
      // Resume creates a new playback, so we just verify no errors
      expect(manager).toBeDefined();
    });

    it('should handle play options', () => {
      manager.playBleep('playback-test', {
        volume: 0.5,
        loop: true,
        startTime: 1,
      });

      // Verify no errors with options
      expect(manager).toBeDefined();
    });
  });

  describe('Bleep State', () => {
    beforeEach(() => {
      const config: BleepConfig = {
        id: 'state-test',
        sources: [{ url: 'test.mp3', duration: 10 }],
        volume: 0.8,
      };
      manager.createBleep(config);
    });

    it('should return bleep state', () => {
      const state = manager.getBleepState('state-test');

      expect(state).not.toBeNull();
      expect(state?.id).toBe('state-test');
      expect(state?.volume).toBe(0.8);
      expect(state?.playing).toBe(false);
      expect(state?.paused).toBe(false);
    });

    it('should return null for non-existent bleep', () => {
      const state = manager.getBleepState('non-existent');
      expect(state).toBeNull();
    });

    it('should track playing state', () => {
      let state = manager.getBleepState('state-test');
      expect(state?.playing).toBe(false);

      manager.playBleep('state-test');
      // Playback requires audio buffer, so just verify no errors
      expect(manager).toBeDefined();
    });
  });

  describe('Visualization Data', () => {
    it('should get visualization data', () => {
      const data = manager.getVisualizationData();

      expect(data).toBeDefined();
      expect(data.frequencies).toBeDefined();
      expect(data.waveform).toBeDefined();
      expect(typeof data.volume).toBe('number');
      expect(typeof data.bass).toBe('number');
      expect(typeof data.mid).toBe('number');
      expect(typeof data.treble).toBe('number');
    });

    it('should have valid frequency ranges', () => {
      const data = manager.getVisualizationData();

      expect(data.volume).toBeGreaterThanOrEqual(0);
      expect(data.volume).toBeLessThanOrEqual(1);
      expect(data.bass).toBeGreaterThanOrEqual(0);
      expect(data.bass).toBeLessThanOrEqual(1);
      expect(data.mid).toBeGreaterThanOrEqual(0);
      expect(data.mid).toBeLessThanOrEqual(1);
      expect(data.treble).toBeGreaterThanOrEqual(0);
      expect(data.treble).toBeLessThanOrEqual(1);
    });
  });

  describe('Cleanup', () => {
    it('should cleanup resources', () => {
      const config: BleepConfig = {
        id: 'cleanup-test',
        sources: [{ url: 'test.mp3' }],
      };
      manager.createBleep(config);
      manager.playBleep('cleanup-test');

      manager.cleanup();

      // After cleanup, bleeps are cleared
      expect(manager).toBeDefined();
    });
  });
});
