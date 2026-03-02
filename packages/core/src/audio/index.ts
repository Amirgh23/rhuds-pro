/**
 * Audio System
 * Core audio system for RHUDS Pro
 */

// Types
export * from './types';

// Bleep Manager
export { createBleepManager } from './BleepManager';

// React Integration
export { BleepsProvider, useBleeps, useBleep } from './BleepsProvider';

// Audio Effects
export { AudioEffectsProcessor, createAudioEffects } from './effects';

// Audio Visualization
export {
  AudioAnalyzer,
  AudioVisualizer,
  createAudioAnalyzer,
} from './visualization';

// Spatial Audio
export {
  SpatialAudioManager,
  AudioOcclusionCalculator,
  DistanceAttenuationCalculator,
  createSpatialAudio,
} from './spatial';
