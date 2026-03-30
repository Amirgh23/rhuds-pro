/**
 * Unit Tests for Advanced Audio Features
 * Tests spatial audio, effects, and visualization
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { SpatialAudioSource, Listener, SpatialAudioManager } from '../audio/spatial';
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

describe('Advanced Audio Features', () => {
  describe('Spatial Audio System', () => {
    let manager: SpatialAudioManager;

    beforeEach(() => {
      (global as any).window = { AudioContext: () => mockAudioContext };
      manager = new SpatialAudioManager(mockAudioContext as any);
    });

    afterEach(() => {
      manager.cleanup();
    });

    it('should create spatial audio source', () => {
      const source = manager.createSource('test', { position: { x: 1, y: 2, z: 3 } });
      expect(source).toBeDefined();
    });

    it('should get spatial audio source', () => {
      manager.createSource('test', { position: { x: 0, y: 0, z: 0 } });
      const source = manager.getSource('test');
      expect(source).toBeDefined();
    });

    it('should remove spatial audio source', () => {
      manager.createSource('test', {});
      manager.removeSource('test');
      const source = manager.getSource('test');
      expect(source).toBeUndefined();
    });

    it('should set listener position', () => {
      manager.setListenerPosition({ x: 5, y: 5, z: 5 });
      const listener = manager.getListener();
      expect(listener.getPosition()).toEqual({ x: 5, y: 5, z: 5 });
    });

    it('should set listener orientation', () => {
      manager.setListenerOrientation({ x: 0, y: 0, z: -1 }, { x: 0, y: 1, z: 0 });
      const listener = manager.getListener();
      expect(listener.getForward()).toEqual({ x: 0, y: 0, z: -1 });
    });

    it('should calculate distances', () => {
      manager.createSource('source1', { position: { x: 0, y: 0, z: 0 } });
      manager.createSource('source2', { position: { x: 3, y: 4, z: 0 } });
      manager.setListenerPosition({ x: 0, y: 0, z: 0 });

      const distances = manager.updateDistances();
      expect(distances.has('source1')).toBe(true);
      expect(distances.has('source2')).toBe(true);
    });
  });

  describe('Audio Effects', () => {
    describe('ReverbEffect', () => {
      it('should initialize with default config', () => {
        const effect = new ReverbEffect();
        expect(effect).toBeDefined();
      });

      it('should process audio', () => {
        const effect = new ReverbEffect();
        const input = new Float32Array([0.1, 0.2, 0.3]);
        const output = effect.process(input);
        expect(output.length).toBe(input.length);
      });

      it('should set decay', () => {
        const effect = new ReverbEffect();
        effect.setDecay(0.5);
        expect(effect).toBeDefined();
      });
    });

    describe('DelayEffect', () => {
      it('should initialize with default config', () => {
        const effect = new DelayEffect();
        expect(effect).toBeDefined();
      });

      it('should process audio', () => {
        const effect = new DelayEffect();
        const input = new Float32Array([0.1, 0.2, 0.3]);
        const output = effect.process(input);
        expect(output.length).toBe(input.length);
      });

      it('should set time', () => {
        const effect = new DelayEffect();
        effect.setTime(0.5);
        expect(effect).toBeDefined();
      });
    });

    describe('DistortionEffect', () => {
      it('should initialize with default config', () => {
        const effect = new DistortionEffect();
        expect(effect).toBeDefined();
      });

      it('should process audio', () => {
        const effect = new DistortionEffect();
        const input = new Float32Array([0.1, 0.2, 0.3]);
        const output = effect.process(input);
        expect(output.length).toBe(input.length);
      });

      it('should set amount', () => {
        const effect = new DistortionEffect();
        effect.setAmount(0.5);
        expect(effect).toBeDefined();
      });
    });

    describe('FilterEffect', () => {
      it('should initialize with default config', () => {
        const effect = new FilterEffect();
        expect(effect).toBeDefined();
      });

      it('should process audio', () => {
        const effect = new FilterEffect();
        const input = new Float32Array([0.1, 0.2, 0.3]);
        const output = effect.process(input);
        expect(output.length).toBe(input.length);
      });

      it('should set frequency', () => {
        const effect = new FilterEffect();
        effect.setFrequency(1000);
        expect(effect).toBeDefined();
      });
    });

    describe('CompressorEffect', () => {
      it('should initialize with default config', () => {
        const effect = new CompressorEffect();
        expect(effect).toBeDefined();
      });

      it('should process audio', () => {
        const effect = new CompressorEffect();
        const input = new Float32Array([0.1, 0.2, 0.3]);
        const output = effect.process(input);
        expect(output.length).toBe(input.length);
      });

      it('should set threshold', () => {
        const effect = new CompressorEffect();
        effect.setThreshold(-20);
        expect(effect).toBeDefined();
      });
    });

    describe('EQEffect', () => {
      it('should initialize with default config', () => {
        const effect = new EQEffect();
        expect(effect).toBeDefined();
      });

      it('should process audio', () => {
        const effect = new EQEffect();
        const input = new Float32Array([0.1, 0.2, 0.3]);
        const output = effect.process(input);
        expect(output.length).toBe(input.length);
      });

      it('should set bass', () => {
        const effect = new EQEffect();
        effect.setBass(6);
        expect(effect).toBeDefined();
      });
    });
  });

  describe('Audio Visualization', () => {
    let analyser: any;

    beforeEach(() => {
      analyser = mockAudioContext.createAnalyser();
    });

    describe('FrequencyAnalyzer', () => {
      it('should initialize', () => {
        const analyzer = new FrequencyAnalyzer(analyser);
        expect(analyzer).toBeDefined();
      });

      it('should get frequencies', () => {
        const analyzer = new FrequencyAnalyzer(analyser);
        const frequencies = analyzer.getFrequencies();
        expect(frequencies).toBeDefined();
      });

      it('should extract features', () => {
        const analyzer = new FrequencyAnalyzer(analyser);
        const features = analyzer.extractFeatures();
        expect(features.volume).toBeDefined();
        expect(features.bass).toBeDefined();
        expect(features.mid).toBeDefined();
        expect(features.treble).toBeDefined();
      });
    });

    describe('BeatDetector', () => {
      it('should initialize', () => {
        const detector = new BeatDetector();
        expect(detector).toBeDefined();
      });

      it('should detect beat', () => {
        const detector = new BeatDetector();
        const frequencies = new Uint8Array(256);
        const beat = detector.detectBeat(frequencies);
        expect(typeof beat).toBe('boolean');
      });

      it('should set threshold', () => {
        const detector = new BeatDetector();
        detector.setThreshold(0.5);
        expect(detector).toBeDefined();
      });

      it('should reset history', () => {
        const detector = new BeatDetector();
        detector.reset();
        expect(detector).toBeDefined();
      });
    });

    describe('SpectrumAnalyzer', () => {
      it('should initialize', () => {
        const analyzer = new SpectrumAnalyzer(analyser);
        expect(analyzer).toBeDefined();
      });

      it('should get spectrum', () => {
        const analyzer = new SpectrumAnalyzer(analyser);
        const spectrum = analyzer.getSpectrum();
        expect(spectrum).toBeDefined();
      });

      it('should get normalized spectrum', () => {
        const analyzer = new SpectrumAnalyzer(analyser);
        const spectrum = analyzer.getNormalizedSpectrum();
        expect(Array.isArray(spectrum)).toBe(true);
      });

      it('should set smoothing', () => {
        const analyzer = new SpectrumAnalyzer(analyser);
        analyzer.setSmoothing(0.5);
        expect(analyzer).toBeDefined();
      });
    });

    describe('WaveformAnalyzer', () => {
      it('should initialize', () => {
        const analyzer = new WaveformAnalyzer(analyser);
        expect(analyzer).toBeDefined();
      });

      it('should get waveform', () => {
        const analyzer = new WaveformAnalyzer(analyser);
        const waveform = analyzer.getWaveform();
        expect(waveform).toBeDefined();
      });

      it('should get normalized waveform', () => {
        const analyzer = new WaveformAnalyzer(analyser);
        const waveform = analyzer.getNormalizedWaveform();
        expect(Array.isArray(waveform)).toBe(true);
      });

      it('should get peak amplitude', () => {
        const analyzer = new WaveformAnalyzer(analyser);
        const peak = analyzer.getPeakAmplitude();
        expect(typeof peak).toBe('number');
      });

      it('should get RMS', () => {
        const analyzer = new WaveformAnalyzer(analyser);
        const rms = analyzer.getRMS();
        expect(typeof rms).toBe('number');
      });
    });
  });
});
