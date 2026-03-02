/**
 * Audio System Types
 * Core type definitions for the RHUDS Pro audio system
 */

/**
 * Audio source configuration
 */
export interface AudioSource {
  src: string;
  format?: string;
}

/**
 * Audio loop configuration
 */
export interface LoopConfig {
  enabled: boolean;
  start?: number;
  end?: number;
}

/**
 * Spatial audio configuration
 */
export interface SpatialConfig {
  enabled: boolean;
  position?: { x: number; y: number; z: number };
  orientation?: { x: number; y: number; z: number };
  refDistance?: number;
  maxDistance?: number;
  rolloffFactor?: number;
  coneInnerAngle?: number;
  coneOuterAngle?: number;
  coneOuterGain?: number;
}

/**
 * Audio effect types
 */
export type AudioEffectType =
  | 'reverb'
  | 'delay'
  | 'distortion'
  | 'filter'
  | 'compressor'
  | 'eq';

/**
 * Filter types
 */
export type FilterType = 'lowpass' | 'highpass' | 'bandpass' | 'notch';

/**
 * Audio effect configuration
 */
export interface AudioEffect {
  type: AudioEffectType;
  enabled: boolean;
  params?: Record<string, number>;
}

/**
 * Reverb effect parameters
 */
export interface ReverbEffect extends AudioEffect {
  type: 'reverb';
  params: {
    decay?: number;
    preDelay?: number;
    wetDryMix?: number;
  };
}

/**
 * Delay effect parameters
 */
export interface DelayEffect extends AudioEffect {
  type: 'delay';
  params: {
    delayTime?: number;
    feedback?: number;
    wetDryMix?: number;
  };
}

/**
 * Filter effect parameters
 */
export interface FilterEffect extends AudioEffect {
  type: 'filter';
  params: {
    filterType?: FilterType;
    frequency?: number;
    Q?: number;
    gain?: number;
  };
}

/**
 * Bleep configuration
 */
export interface BleepConfig {
  sources: AudioSource[];
  volume?: number;
  rate?: number;
  loop?: LoopConfig;
  preload?: boolean;
  category?: string;
  spatial?: SpatialConfig;
  effects?: AudioEffect[];
}

/**
 * Bleep instance
 */
export interface Bleep {
  id: string;
  config: BleepConfig;
  play: () => Promise<void>;
  pause: () => void;
  stop: () => void;
  resume: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  setRate: (rate: number) => void;
  getState: () => BleepState;
  getDuration: () => number;
  getCurrentTime: () => number;
  unload: () => void;
}

/**
 * Bleep state
 */
export type BleepState = 'idle' | 'loading' | 'ready' | 'playing' | 'paused' | 'stopped';

/**
 * Audio category configuration
 */
export interface AudioCategory {
  name: string;
  volume: number;
  muted: boolean;
}

/**
 * Bleep manager configuration
 */
export interface BleepManagerConfig {
  masterVolume?: number;
  categories?: Record<string, AudioCategory>;
  audioContext?: AudioContext;
}

/**
 * Bleep manager interface
 */
export interface BleepManager {
  createBleep: (id: string, config: BleepConfig) => Bleep;
  getBleep: (id: string) => Bleep | undefined;
  removeBleep: (id: string) => void;
  play: (id: string) => Promise<void>;
  pause: (id: string) => void;
  stop: (id: string) => void;
  stopAll: () => void;
  setMasterVolume: (volume: number) => void;
  getMasterVolume: () => number;
  setCategoryVolume: (category: string, volume: number) => void;
  getCategoryVolume: (category: string) => number;
  muteCategory: (category: string) => void;
  unmuteCategory: (category: string) => void;
  preloadAll: () => Promise<void>;
  unloadAll: () => void;
  getAudioContext: () => AudioContext;
}

/**
 * Audio visualization data
 */
export interface AudioVisualizationData {
  frequencyData: Uint8Array;
  timeDomainData: Uint8Array;
  volume: number;
  bass: number;
  mid: number;
  treble: number;
}

/**
 * Audio analyzer configuration
 */
export interface AudioAnalyzerConfig {
  fftSize?: number;
  smoothingTimeConstant?: number;
  minDecibels?: number;
  maxDecibels?: number;
}

/**
 * Beat detection configuration
 */
export interface BeatDetectionConfig {
  threshold?: number;
  minInterval?: number;
  onBeat?: () => void;
}
