/**
 * Audio System Exports
 */

export { BleepManager } from './BleepManager';
export { BleepsProvider, useBleeps } from './BleepsProvider';
export {
  ReverbEffect,
  DelayEffect,
  DistortionEffect,
  FilterEffect,
  CompressorEffect,
  EQEffect,
} from './effects';
export {
  FrequencyAnalyzer,
  BeatDetector,
  SpectrumAnalyzer,
  WaveformAnalyzer,
} from './visualization';
export { SpatialAudioSource, Listener, SpatialAudioManager } from './spatial';
export { DynamicMixer, AudioDucker } from './mixing';

export type {
  AudioSource,
  BleepConfig,
  SpatialConfig,
  AudioEffect,
  BleepPlayOptions,
  BleepState,
  BleepManagerConfig,
  AudioVisualizationData,
  BleepManagerInterface,
} from './types';
export type {
  EffectConfig,
  ReverbConfig,
  DelayConfig,
  DistortionConfig,
  FilterConfig,
  CompressorConfig,
  EQConfig,
} from './effects';
export type { AudioFeatures } from './visualization';
export type { Vector3, SpatialAudioConfig } from './spatial';
export type { MixingConfig, AudioTrack } from './mixing';
