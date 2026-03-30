/**
 * Bleep Manager - Core Audio System
 * Manages sound effects, playback, and audio mixing
 */

import type {
  BleepConfig,
  BleepPlayOptions,
  BleepState,
  BleepManagerConfig,
  AudioVisualizationData,
  BleepManagerInterface,
} from './types';

export class BleepManager implements BleepManagerInterface {
  private audioContext: AudioContext;
  private bleeps: Map<string, BleepData> = new Map();
  private masterGain: GainNode;
  private categoryGains: Map<string, GainNode> = new Map();
  private analyser: AnalyserNode;
  private masterVolume: number = 1;
  private categoryVolumes: Map<string, number> = new Map();

  constructor(config: BleepManagerConfig = {}) {
    this.audioContext =
      config.audioContext || new (window.AudioContext || (window as any).webkitAudioContext)();

    this.masterGain = this.audioContext.createGain();
    this.masterGain.connect(this.audioContext.destination);
    this.masterGain.gain.value = config.masterVolume ?? 1;

    this.analyser = this.audioContext.createAnalyser();
    this.analyser.connect(this.masterGain);

    if (config.categoryVolumes) {
      Object.entries(config.categoryVolumes).forEach(([category, volume]) => {
        this.setCategoryVolume(category, volume);
      });
    }
  }

  /**
   * Create a new bleep
   */
  createBleep(config: BleepConfig): void {
    if (this.bleeps.has(config.id)) {
      console.warn(`Bleep with id "${config.id}" already exists`);
      return;
    }

    const bleep: BleepData = {
      config,
      sources: new Map(),
      playing: false,
      paused: false,
      currentTime: 0,
      volume: config.volume ?? 1,
    };

    this.bleeps.set(config.id, bleep);

    if (config.preload) {
      this.preloadBleep(config.id);
    }
  }

  /**
   * Play a bleep
   */
  playBleep(id: string, options: BleepPlayOptions = {}): void {
    const bleep = this.bleeps.get(id);
    if (!bleep) {
      console.warn(`Bleep with id "${id}" not found`);
      return;
    }

    // Stop if already playing
    if (bleep.playing) {
      this.stopBleep(id);
    }

    const volume = options.volume ?? bleep.volume;
    const loop = options.loop ?? bleep.config.loop ?? false;

    // Create gain node for this playback
    const gainNode = this.audioContext.createGain();
    gainNode.gain.value = volume;

    // Connect to category gain or master gain
    const category = bleep.config.category;
    if (category && this.categoryGains.has(category)) {
      gainNode.connect(this.categoryGains.get(category)!);
    } else {
      gainNode.connect(this.analyser);
    }

    // Create audio buffer source
    const source = this.audioContext.createBufferSource();

    // Get or load audio buffer
    const audioBuffer = bleep.sources.get(bleep.config.sources[0].url);
    if (audioBuffer) {
      source.buffer = audioBuffer;
      source.loop = loop;

      if (loop && bleep.config.loopStart !== undefined && bleep.config.loopEnd !== undefined) {
        source.loopStart = bleep.config.loopStart;
        source.loopEnd = bleep.config.loopEnd;
      }

      source.connect(gainNode);
      source.start(0, options.startTime ?? 0);

      bleep.playing = true;
      bleep.paused = false;
      bleep.source = source;
      bleep.gainNode = gainNode;

      // Track playback time
      const startTime = this.audioContext.currentTime;
      const updateTime = () => {
        if (bleep.playing && !bleep.paused) {
          bleep.currentTime = this.audioContext.currentTime - startTime;
          requestAnimationFrame(updateTime);
        }
      };
      updateTime();
    }
  }

  /**
   * Stop a bleep
   */
  stopBleep(id: string): void {
    const bleep = this.bleeps.get(id);
    if (!bleep || !bleep.playing) return;

    if (bleep.source) {
      try {
        bleep.source.stop();
      } catch (e) {
        // Already stopped
      }
    }

    bleep.playing = false;
    bleep.paused = false;
    bleep.currentTime = 0;
  }

  /**
   * Pause a bleep
   */
  pauseBleep(id: string): void {
    const bleep = this.bleeps.get(id);
    if (!bleep || !bleep.playing) return;

    if (bleep.source) {
      try {
        bleep.source.stop();
      } catch (e) {
        // Already stopped
      }
    }

    bleep.paused = true;
  }

  /**
   * Resume a paused bleep
   */
  resumeBleep(id: string): void {
    const bleep = this.bleeps.get(id);
    if (!bleep || !bleep.paused) return;

    this.playBleep(id, { startTime: bleep.currentTime });
  }

  /**
   * Set bleep volume
   */
  setBleepVolume(id: string, volume: number): void {
    const bleep = this.bleeps.get(id);
    if (!bleep) return;

    bleep.volume = Math.max(0, Math.min(1, volume));

    if (bleep.gainNode) {
      bleep.gainNode.gain.value = bleep.volume;
    }
  }

  /**
   * Set category volume
   */
  setCategoryVolume(category: string, volume: number): void {
    this.categoryVolumes.set(category, Math.max(0, Math.min(1, volume)));

    let gainNode = this.categoryGains.get(category);
    if (!gainNode) {
      gainNode = this.audioContext.createGain();
      gainNode.connect(this.analyser);
      this.categoryGains.set(category, gainNode);
    }

    gainNode.gain.value = this.categoryVolumes.get(category)!;
  }

  /**
   * Set master volume
   */
  setMasterVolume(volume: number): void {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    this.masterGain.gain.value = this.masterVolume;
  }

  /**
   * Get bleep state
   */
  getBleepState(id: string): BleepState | null {
    const bleep = this.bleeps.get(id);
    if (!bleep) return null;

    return {
      id,
      playing: bleep.playing,
      paused: bleep.paused,
      currentTime: bleep.currentTime,
      duration: bleep.config.sources[0].duration ?? 0,
      volume: bleep.volume,
    };
  }

  /**
   * Preload a bleep
   */
  async preloadBleep(id: string): Promise<void> {
    const bleep = this.bleeps.get(id);
    if (!bleep) return;

    for (const source of bleep.config.sources) {
      if (!bleep.sources.has(source.url)) {
        try {
          const response = await fetch(source.url);
          const arrayBuffer = await response.arrayBuffer();
          const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
          bleep.sources.set(source.url, audioBuffer);
        } catch (error) {
          console.error(`Failed to preload bleep "${id}":`, error);
        }
      }
    }
  }

  /**
   * Get visualization data
   */
  getVisualizationData(): AudioVisualizationData {
    const frequencies = new Uint8Array(this.analyser.frequencyBinCount);
    const waveform = new Uint8Array(this.analyser.frequencyBinCount);

    this.analyser.getByteFrequencyData(frequencies);
    this.analyser.getByteTimeDomainData(waveform);

    // Calculate volume
    let sum = 0;
    for (let i = 0; i < frequencies.length; i++) {
      sum += frequencies[i];
    }
    const volume = sum / frequencies.length / 255;

    // Calculate frequency bands
    const bandSize = Math.floor(frequencies.length / 3);
    let bass = 0,
      mid = 0,
      treble = 0;

    for (let i = 0; i < bandSize; i++) {
      bass += frequencies[i];
    }
    for (let i = bandSize; i < bandSize * 2; i++) {
      mid += frequencies[i];
    }
    for (let i = bandSize * 2; i < frequencies.length; i++) {
      treble += frequencies[i];
    }

    bass /= bandSize * 255;
    mid /= bandSize * 255;
    treble /= (frequencies.length - bandSize * 2) * 255;

    return {
      frequencies,
      waveform,
      volume,
      bass,
      mid,
      treble,
    };
  }

  /**
   * Cleanup resources
   */
  cleanup(): void {
    // Stop all playing bleeps
    this.bleeps.forEach((_, id) => {
      this.stopBleep(id);
    });

    // Close audio context if we created it
    if (this.audioContext.state !== 'closed') {
      this.audioContext.close();
    }

    this.bleeps.clear();
    this.categoryGains.clear();
  }
}

interface BleepData {
  config: BleepConfig;
  sources: Map<string, AudioBuffer>;
  playing: boolean;
  paused: boolean;
  currentTime: number;
  volume: number;
  source?: AudioBufferSourceNode;
  gainNode?: GainNode;
}

export default BleepManager;
