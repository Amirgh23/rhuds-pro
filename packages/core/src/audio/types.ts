/**
 * Audio System Types and Interfaces
 */

export interface AudioSource {
  url: string;
  format?: 'mp3' | 'wav' | 'ogg' | 'aac';
  duration?: number;
}

export interface BleepConfig {
  id: string;
  sources: AudioSource[];
  volume?: number;
  loop?: boolean;
  loopStart?: number;
  loopEnd?: number;
  category?: string;
  preload?: boolean;
}

export interface SpatialConfig {
  enabled?: boolean;
  x?: number;
  y?: number;
  z?: number;
  refDistance?: number;
  maxDistance?: number;
  rolloffFactor?: number;
}

export interface AudioEffect {
  type: 'reverb' | 'delay' | 'distortion' | 'filter' | 'compressor' | 'eq';
  enabled?: boolean;
  params?: Record<string, number>;
}

export interface BleepPlayOptions {
  volume?: number;
  loop?: boolean;
  spatial?: SpatialConfig;
  effects?: AudioEffect[];
  startTime?: number;
  duration?: number;
}

export interface BleepState {
  id: string;
  playing: boolean;
  paused: boolean;
  currentTime: number;
  duration: number;
  volume: number;
}

export interface BleepManagerConfig {
  masterVolume?: number;
  categoryVolumes?: Record<string, number>;
  audioContext?: AudioContext;
  preloadAll?: boolean;
}

export interface AudioVisualizationData {
  frequencies: Uint8Array;
  waveform: Uint8Array;
  volume: number;
  bass: number;
  mid: number;
  treble: number;
}

export interface BleepManagerInterface {
  createBleep(config: BleepConfig): void;
  playBleep(id: string, options?: BleepPlayOptions): void;
  stopBleep(id: string): void;
  pauseBleep(id: string): void;
  resumeBleep(id: string): void;
  setBleepVolume(id: string, volume: number): void;
  setCategoryVolume(category: string, volume: number): void;
  setMasterVolume(volume: number): void;
  getBleepState(id: string): BleepState | null;
  preloadBleep(id: string): Promise<void>;
  getVisualizationData(): AudioVisualizationData;
  cleanup(): void;
}
