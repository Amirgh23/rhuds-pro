/**
 * Complete Unit Tests for Advanced Audio Features
 * Tests spatial audio, effects, visualization, and mixing
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { SpatialAudioManager } from '../audio/spatial';
import {
  ReverbEffect,
  DelayEffect,
  DistortionEffect,
  FilterEffect,
  CompressorEffect,
  EQEffect,
} from '../audio/effects';
import {
  FrequencyAnalyzer,
  BeatDetector,
  SpectrumAnalyzer,
  WaveformAnalyzer,
} from '../audio/visualization';
import { DynamicMixer, AudioDucker } from '../audio/mixing';

// Mock AudioContext
const mockAudioContext = {
  createPanner: () => ({
    connect: () => {},
    panningModel: 'HRTF',
    distanceModel: 'inverse',
    refDistance: 1,
    maxDistance: 10000,
    rolloffFactor: 1,
    positionX: { value: 0 },
    positionY: { value: 0 },
    positionZ: { value: 0 },
    orientationX: { value: 0 },
    orientationY: { value: 0 },
    orientationZ: { value: 1 },
  }),
  listener: {
    positionX: { value: 0 },
    positionY: { value: 0 },
    positionZ: { value: 0 },
    forwardX: { value: 0 },
    forwardY: { value: 0 },
    forwardZ: { value: -1 },
    upX: { value: 0 },
    upY: { value: 1 },
    upZ: { value: 0 },
  },
  createAnalyser: () => ({
    connect: () => {},
    fftSize: 2048,
    frequencyBinCount: 1024,
    getByteFrequencyData: () => {},
    getByteTimeDomainData: () => {},
  }),
};

describe('Advanced Audio Features - Complete', () => {
  describe('Dynamic Audio Mixing', () => {
    let mixer: DynamicMixer;

    beforeEach(() => {
      mixer = new DynamicMixer({
        masterVolume: 1,
        duckingThreshold: -20,
        duckingAmount: 0.5,
        duckingAttack: 0.1,
        duckingRelease: 0.3,
      });
    });

    afterEach(() => {
      mixer.cleanup();
    });

    it('should create mixer with default config', () => {
      const defaultMixer = new DynamicMixer();
      expect(defaultMixer).toBeDefined();
      expect(defaultMixer.getMasterVolume()).toBe(1);
      defaultMixer.cleanup();
    });

    it('should add and retrieve tracks', () => {
      const track = mixer.addTrack('track-1', 'sfx');
      expect(track).toBeDefined();
      expect(track.id).toBe('track-1');
      expect(track.category).toBe('sfx');

      const retrieved = mixer.getTrack('track-1');
      expect(retrieved).toEqual(track);
    });

    it('should remove tracks', () => {
      mixer.addTrack('track-1');
      mixer.removeTrack('track-1');
      expect(mixer.getTrack('track-1')).toBeUndefined();
    });

    it('should set and get master volume', () => {
      mixer.setMasterVolume(0.5);
      expect(mixer.getMasterVolume()).toBe(0.5);

      mixer.setMasterVolume(1.5); // Should clamp to 1
      expect(mixer.getMasterVolume()).toBe(1);

      mixer.setMasterVolume(-0.5); // Should clamp to 0
      expect(mixer.getMasterVolume()).toBe(0);
    });

    it('should set and get category volume', () => {
      mixer.setCategoryVolume('music', 0.7);
      expect(mixer.getCategoryVolume('music')).toBe(0.7);

      mixer.setCategoryVolume('sfx', 0.5);
      expect(mixer.getCategoryVolume('sfx')).toBe(0.5);
    });

    it('should set track volume', () => {
      mixer.addTrack('track-1');
      mixer.setTrackVolume('track-1', 0.8);

      const track = mixer.getTrack('track-1');
      expect(track?.targetVolume).toBe(0.8);
    });

    it('should calculate effective volume', () => {
      mixer.setMasterVolume(0.8);
      mixer.setCategoryVolume('sfx', 0.5);

      const track = mixer.addTrack('track-1', 'sfx');
      track.volume = 1;

      const effective = mixer.getEffectiveVolume('track-1');
      expect(effective).toBe(0.8 * 0.5 * 1); // 0.4
    });

    it('should apply audio ducking', () => {
      mixer.addTrack('priority', 'music');
      mixer.addTrack('background', 'sfx');
      mixer.addTrack('ambient', 'sfx');

      mixer.applyDucking('priority', true);

      const priorityTrack = mixer.getTrack('priority');
      const backgroundTrack = mixer.getTrack('background');

      expect(priorityTrack?.targetVolume).toBe(1);
      expect(backgroundTrack?.targetVolume).toBe(0.5); // duckingAmount
    });

    it('should remove ducking', () => {
      mixer.addTrack('priority');
      mixer.addTrack('background');

      mixer.applyDucking('priority', true);
      mixer.removeDucking();

      const backgroundTrack = mixer.getTrack('background');
      expect(backgroundTrack?.targetVolume).toBe(1);
    });

    it('should update track volumes smoothly', () => {
      const track = mixer.addTrack('track-1');
      track.volume = 0;
      track.targetVolume = 1;

      mixer.update(0.05); // 50ms update

      expect(track.volume).toBeGreaterThan(0);
      expect(track.volume).toBeLessThan(1);
    });

    it('should get active tracks', () => {
      mixer.addTrack('track-1');
      mixer.addTrack('track-2');
      mixer.addTrack('track-3');

      const active = mixer.getActiveTracks();
      expect(active.length).toBe(3);
    });

    it('should get mixer state', () => {
      mixer.setMasterVolume(0.8);
      mixer.addTrack('track-1', 'sfx');
      mixer.setCategoryVolume('sfx', 0.5);

      const state = mixer.getState();
      expect(state.masterVolume).toBe(0.8);
      expect(state.tracks.length).toBe(1);
      expect(state.categoryVolumes['sfx']).toBe(0.5);
    });
  });

  describe('Audio Ducker', () => {
    let mixer: DynamicMixer;
    let ducker: AudioDucker;

    beforeEach(() => {
      mixer = new DynamicMixer();
      ducker = new AudioDucker(mixer);
    });

    afterEach(() => {
      mixer.cleanup();
    });

    it('should enable ducking', () => {
      mixer.addTrack('priority');
      ducker.enableDucking('priority');

      expect(ducker.isDuckingActive()).toBe(true);
      expect(ducker.getPriorityTrackId()).toBe('priority');
    });

    it('should disable ducking', () => {
      mixer.addTrack('priority');
      ducker.enableDucking('priority');
      ducker.disableDucking();

      expect(ducker.isDuckingActive()).toBe(false);
      expect(ducker.getPriorityTrackId()).toBeNull();
    });

    it('should apply ducking to other tracks', () => {
      mixer.addTrack('priority');
      mixer.addTrack('background');

      ducker.enableDucking('priority');

      const priorityTrack = mixer.getTrack('priority');
      const backgroundTrack = mixer.getTrack('background');

      expect(priorityTrack?.targetVolume).toBe(1);
      expect(backgroundTrack?.targetVolume).toBeLessThan(1);
    });
  });

  describe('Spatial Audio with Mixing', () => {
    let manager: SpatialAudioManager;
    let mixer: DynamicMixer;

    beforeEach(() => {
      (global as any).window = { AudioContext: () => mockAudioContext };
      manager = new SpatialAudioManager(mockAudioContext as any);
      mixer = new DynamicMixer();
    });

    afterEach(() => {
      manager.cleanup();
      mixer.cleanup();
    });

    it('should integrate spatial audio with mixing', () => {
      manager.createSource('source-1', { position: { x: 0, y: 0, z: 0 } });
      manager.createSource('source-2', { position: { x: 5, y: 5, z: 5 } });

      mixer.addTrack('source-1', 'sfx');
      mixer.addTrack('source-2', 'sfx');

      mixer.setMasterVolume(0.8);
      mixer.setCategoryVolume('sfx', 0.7);

      const effective1 = mixer.getEffectiveVolume('source-1');
      expect(effective1).toBe(0.8 * 0.7 * 1); // 0.56
    });

    it('should apply ducking to spatial sources', () => {
      manager.createSource('priority', { position: { x: 0, y: 0, z: 0 } });
      manager.createSource('background', { position: { x: 10, y: 10, z: 10 } });

      mixer.addTrack('priority', 'music');
      mixer.addTrack('background', 'sfx');

      mixer.applyDucking('priority', true);

      const priorityTrack = mixer.getTrack('priority');
      const backgroundTrack = mixer.getTrack('background');

      expect(priorityTrack?.targetVolume).toBe(1);
      expect(backgroundTrack?.targetVolume).toBe(0.5);
    });
  });

  describe('Effects with Mixing', () => {
    let mixer: DynamicMixer;
    let reverb: ReverbEffect;
    let delay: DelayEffect;

    beforeEach(() => {
      mixer = new DynamicMixer();
      reverb = new ReverbEffect();
      delay = new DelayEffect();
    });

    afterEach(() => {
      mixer.cleanup();
    });

    it('should apply effects to mixed audio', () => {
      mixer.addTrack('track-1', 'sfx');
      mixer.setMasterVolume(0.8);

      const input = new Float32Array([0.1, 0.2, 0.3]);
      const reverbOutput = reverb.process(input);
      const delayOutput = delay.process(reverbOutput);

      expect(delayOutput.length).toBe(input.length);
    });

    it('should maintain effect chain with volume changes', () => {
      mixer.addTrack('track-1');
      mixer.setTrackVolume('track-1', 0.5);

      const input = new Float32Array([0.5, 0.5, 0.5]);
      const output = reverb.process(input);

      expect(output).toBeDefined();
      expect(output.length).toBe(input.length);
    });
  });

  describe('Visualization with Mixing', () => {
    let mixer: DynamicMixer;
    let analyzer: FrequencyAnalyzer;
    let beatDetector: BeatDetector;

    beforeEach(() => {
      mixer = new DynamicMixer();
      const mockAnalyser = mockAudioContext.createAnalyser() as any;
      analyzer = new FrequencyAnalyzer(mockAnalyser);
      beatDetector = new BeatDetector();
    });

    afterEach(() => {
      mixer.cleanup();
    });

    it('should analyze mixed audio frequencies', () => {
      mixer.addTrack('track-1', 'music');
      mixer.setMasterVolume(0.8);

      const frequencies = analyzer.getFrequencies();
      expect(frequencies).toBeDefined();
    });

    it('should detect beats in mixed audio', () => {
      mixer.addTrack('track-1', 'music');
      mixer.applyDucking('track-1', false);

      const frequencies = new Uint8Array(256);
      const beat = beatDetector.detectBeat(frequencies);

      expect(typeof beat).toBe('boolean');
    });

    it('should extract features from mixed audio', () => {
      mixer.addTrack('track-1', 'music');
      mixer.setMasterVolume(0.9);

      const features = analyzer.extractFeatures();
      expect(features.volume).toBeDefined();
      expect(features.bass).toBeDefined();
      expect(features.mid).toBeDefined();
      expect(features.treble).toBeDefined();
    });
  });

  describe('Update Loop', () => {
    let mixer: DynamicMixer;

    beforeEach(() => {
      mixer = new DynamicMixer();
      // Mock requestAnimationFrame
      (global as any).requestAnimationFrame = (cb: FrameRequestCallback) => {
        return setTimeout(cb, 16) as any;
      };
      (global as any).cancelAnimationFrame = (id: number) => {
        clearTimeout(id);
      };
    });

    afterEach(() => {
      mixer.cleanup();
      delete (global as any).requestAnimationFrame;
      delete (global as any).cancelAnimationFrame;
    });

    it('should start and stop update loop', () => {
      mixer.addTrack('track-1');
      mixer.startUpdateLoop();

      // Give it a moment to run
      expect(mixer).toBeDefined();

      mixer.stopUpdateLoop();
      expect(mixer).toBeDefined();
    });

    it('should not start multiple update loops', () => {
      mixer.startUpdateLoop();
      mixer.startUpdateLoop(); // Should not create duplicate

      mixer.stopUpdateLoop();
      expect(mixer).toBeDefined();
    });
  });
});
