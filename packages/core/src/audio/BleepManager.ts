/**
 * Bleep Manager
 * Core audio management system
 */

import {
  BleepManager,
  BleepManagerConfig,
  BleepConfig,
  Bleep,
  BleepState,
  AudioCategory,
} from './types';

/**
 * Internal bleep implementation
 */
class BleepImpl implements Bleep {
  id: string;
  config: BleepConfig;
  private audioContext: AudioContext;
  private audioBuffer: AudioBuffer | null = null;
  private sourceNode: AudioBufferSourceNode | null = null;
  private gainNode: GainNode;
  private pannerNode: PannerNode | null = null;
  private state: BleepState = 'idle';
  private startTime: number = 0;
  private pauseTime: number = 0;
  private categoryVolume: number = 1;
  private masterVolume: number = 1;

  constructor(
    id: string,
    config: BleepConfig,
    audioContext: AudioContext,
    categoryVolume: number,
    masterVolume: number
  ) {
    this.id = id;
    this.config = config;
    this.audioContext = audioContext;
    this.categoryVolume = categoryVolume;
    this.masterVolume = masterVolume;

    // Create gain node
    this.gainNode = audioContext.createGain();
    this.updateVolume();

    // Create panner node for spatial audio
    if (config.spatial?.enabled) {
      this.pannerNode = audioContext.createPanner();
      this.configureSpatialAudio();
      this.gainNode.connect(this.pannerNode);
      this.pannerNode.connect(audioContext.destination);
    } else {
      this.gainNode.connect(audioContext.destination);
    }

    // Preload if configured
    if (config.preload) {
      this.load();
    }
  }

  private configureSpatialAudio(): void {
    if (!this.pannerNode || !this.config.spatial) return;

    const spatial = this.config.spatial;
    
    if (spatial.position) {
      this.pannerNode.setPosition(
        spatial.position.x,
        spatial.position.y,
        spatial.position.z
      );
    }

    if (spatial.orientation) {
      this.pannerNode.setOrientation(
        spatial.orientation.x,
        spatial.orientation.y,
        spatial.orientation.z
      );
    }

    this.pannerNode.refDistance = spatial.refDistance ?? 1;
    this.pannerNode.maxDistance = spatial.maxDistance ?? 10000;
    this.pannerNode.rolloffFactor = spatial.rolloffFactor ?? 1;
    this.pannerNode.coneInnerAngle = spatial.coneInnerAngle ?? 360;
    this.pannerNode.coneOuterAngle = spatial.coneOuterAngle ?? 360;
    this.pannerNode.coneOuterGain = spatial.coneOuterGain ?? 0;
  }

  private async load(): Promise<void> {
    if (this.audioBuffer || this.state === 'loading') return;

    this.state = 'loading';

    try {
      // Try each source until one loads successfully
      for (const source of this.config.sources) {
        try {
          const response = await fetch(source.src);
          const arrayBuffer = await response.arrayBuffer();
          this.audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
          this.state = 'ready';
          return;
        } catch (error) {
          console.warn(`Failed to load audio source: ${source.src}`, error);
        }
      }

      throw new Error('All audio sources failed to load');
    } catch (error) {
      this.state = 'idle';
      throw error;
    }
  }

  async play(): Promise<void> {
    if (this.state === 'playing') return;

    // Load if not loaded
    if (!this.audioBuffer) {
      await this.load();
    }

    if (!this.audioBuffer) {
      throw new Error('Audio buffer not loaded');
    }

    // Stop any existing playback
    this.stop();

    // Create new source node
    this.sourceNode = this.audioContext.createBufferSource();
    this.sourceNode.buffer = this.audioBuffer;
    this.sourceNode.playbackRate.value = this.config.rate ?? 1;

    // Configure looping
    if (this.config.loop?.enabled) {
      this.sourceNode.loop = true;
      if (this.config.loop.start !== undefined) {
        this.sourceNode.loopStart = this.config.loop.start;
      }
      if (this.config.loop.end !== undefined) {
        this.sourceNode.loopEnd = this.config.loop.end;
      }
    }

    // Connect to gain node
    this.sourceNode.connect(this.gainNode);

    // Handle playback end
    this.sourceNode.onended = () => {
      if (this.state === 'playing') {
        this.state = 'stopped';
      }
    };

    // Start playback
    const offset = this.pauseTime > 0 ? this.pauseTime : 0;
    this.sourceNode.start(0, offset);
    this.startTime = this.audioContext.currentTime - offset;
    this.pauseTime = 0;
    this.state = 'playing';
  }

  pause(): void {
    if (this.state !== 'playing') return;

    this.pauseTime = this.audioContext.currentTime - this.startTime;
    this.stop();
    this.state = 'paused';
  }

  stop(): void {
    if (this.sourceNode) {
      try {
        this.sourceNode.stop();
      } catch (error) {
        // Ignore errors from stopping already stopped nodes
      }
      this.sourceNode.disconnect();
      this.sourceNode = null;
    }
    this.pauseTime = 0;
    this.state = 'stopped';
  }

  resume(): void {
    if (this.state === 'paused') {
      this.play();
    }
  }

  seek(time: number): void {
    const wasPlaying = this.state === 'playing';
    this.stop();
    this.pauseTime = time;
    if (wasPlaying) {
      this.play();
    }
  }

  setVolume(volume: number): void {
    this.config.volume = Math.max(0, Math.min(1, volume));
    this.updateVolume();
  }

  setRate(rate: number): void {
    this.config.rate = Math.max(0.1, Math.min(4, rate));
    if (this.sourceNode) {
      this.sourceNode.playbackRate.value = this.config.rate;
    }
  }

  private updateVolume(): void {
    const volume = (this.config.volume ?? 1) * this.categoryVolume * this.masterVolume;
    this.gainNode.gain.value = volume;
  }

  updateCategoryVolume(volume: number): void {
    this.categoryVolume = volume;
    this.updateVolume();
  }

  updateMasterVolume(volume: number): void {
    this.masterVolume = volume;
    this.updateVolume();
  }

  getState(): BleepState {
    return this.state;
  }

  getDuration(): number {
    return this.audioBuffer?.duration ?? 0;
  }

  getCurrentTime(): number {
    if (this.state === 'playing' && this.sourceNode) {
      return this.audioContext.currentTime - this.startTime;
    }
    return this.pauseTime;
  }

  unload(): void {
    this.stop();
    this.audioBuffer = null;
    this.state = 'idle';
  }
}

/**
 * Create a bleep manager instance
 */
export function createBleepManager(config?: BleepManagerConfig): BleepManager {
  const audioContext = config?.audioContext ?? new AudioContext();
  const bleeps = new Map<string, BleepImpl>();
  const categories = new Map<string, AudioCategory>(
    Object.entries(config?.categories ?? {})
  );
  let masterVolume = config?.masterVolume ?? 1;

  const manager: BleepManager = {
    createBleep(id: string, bleepConfig: BleepConfig): Bleep {
      const category = bleepConfig.category ?? 'default';
      
      // Ensure category exists
      if (!categories.has(category)) {
        categories.set(category, {
          name: category,
          volume: 1,
          muted: false,
        });
      }

      const categoryData = categories.get(category)!;
      const categoryVolume = categoryData.muted ? 0 : categoryData.volume;

      const bleep = new BleepImpl(
        id,
        bleepConfig,
        audioContext,
        categoryVolume,
        masterVolume
      );

      bleeps.set(id, bleep);
      return bleep;
    },

    getBleep(id: string): Bleep | undefined {
      return bleeps.get(id);
    },

    removeBleep(id: string): void {
      const bleep = bleeps.get(id);
      if (bleep) {
        bleep.unload();
        bleeps.delete(id);
      }
    },

    async play(id: string): Promise<void> {
      const bleep = bleeps.get(id);
      if (bleep) {
        await bleep.play();
      }
    },

    pause(id: string): void {
      const bleep = bleeps.get(id);
      if (bleep) {
        bleep.pause();
      }
    },

    stop(id: string): void {
      const bleep = bleeps.get(id);
      if (bleep) {
        bleep.stop();
      }
    },

    stopAll(): void {
      bleeps.forEach((bleep) => bleep.stop());
    },

    setMasterVolume(volume: number): void {
      masterVolume = Math.max(0, Math.min(1, volume));
      bleeps.forEach((bleep) => bleep.updateMasterVolume(masterVolume));
    },

    getMasterVolume(): number {
      return masterVolume;
    },

    setCategoryVolume(category: string, volume: number): void {
      const categoryData = categories.get(category);
      if (categoryData) {
        categoryData.volume = Math.max(0, Math.min(1, volume));
        const effectiveVolume = categoryData.muted ? 0 : categoryData.volume;
        
        bleeps.forEach((bleep) => {
          if (bleep.config.category === category) {
            bleep.updateCategoryVolume(effectiveVolume);
          }
        });
      }
    },

    getCategoryVolume(category: string): number {
      return categories.get(category)?.volume ?? 1;
    },

    muteCategory(category: string): void {
      const categoryData = categories.get(category);
      if (categoryData) {
        categoryData.muted = true;
        bleeps.forEach((bleep) => {
          if (bleep.config.category === category) {
            bleep.updateCategoryVolume(0);
          }
        });
      }
    },

    unmuteCategory(category: string): void {
      const categoryData = categories.get(category);
      if (categoryData) {
        categoryData.muted = false;
        bleeps.forEach((bleep) => {
          if (bleep.config.category === category) {
            bleep.updateCategoryVolume(categoryData.volume);
          }
        });
      }
    },

    async preloadAll(): Promise<void> {
      const promises = Array.from(bleeps.values()).map((bleep) =>
        bleep.getState() === 'idle' ? bleep.play().then(() => bleep.stop()) : Promise.resolve()
      );
      await Promise.all(promises);
    },

    unloadAll(): void {
      bleeps.forEach((bleep) => bleep.unload());
    },

    getAudioContext(): AudioContext {
      return audioContext;
    },
  };

  return manager;
}
