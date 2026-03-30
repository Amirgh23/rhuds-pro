/**
 * Dynamic Audio Mixing System
 * Handles real-time volume adjustment and audio ducking
 */

export interface MixingConfig {
  masterVolume?: number;
  duckingThreshold?: number;
  duckingAmount?: number;
  duckingAttack?: number;
  duckingRelease?: number;
}

export interface AudioTrack {
  id: string;
  volume: number;
  targetVolume: number;
  category?: string;
  isActive: boolean;
}

/**
 * DynamicMixer handles real-time volume adjustment and audio ducking
 */
export class DynamicMixer {
  private tracks: Map<string, AudioTrack> = new Map();
  private masterVolume: number = 1;
  private duckingThreshold: number = -20;
  private duckingAmount: number = 0.5;
  private duckingAttack: number = 0.1;
  private duckingRelease: number = 0.3;
  private categoryVolumes: Map<string, number> = new Map();
  private animationFrameId: number | null = null;

  constructor(config?: MixingConfig) {
    if (config?.masterVolume !== undefined) this.masterVolume = config.masterVolume;
    if (config?.duckingThreshold !== undefined) this.duckingThreshold = config.duckingThreshold;
    if (config?.duckingAmount !== undefined) this.duckingAmount = config.duckingAmount;
    if (config?.duckingAttack !== undefined) this.duckingAttack = config.duckingAttack;
    if (config?.duckingRelease !== undefined) this.duckingRelease = config.duckingRelease;
  }

  /**
   * Add a track to the mixer
   */
  addTrack(id: string, category?: string): AudioTrack {
    const track: AudioTrack = {
      id,
      volume: 1,
      targetVolume: 1,
      category,
      isActive: true,
    };
    this.tracks.set(id, track);
    return track;
  }

  /**
   * Remove a track from the mixer
   */
  removeTrack(id: string): void {
    this.tracks.delete(id);
  }

  /**
   * Get a track by ID
   */
  getTrack(id: string): AudioTrack | undefined {
    return this.tracks.get(id);
  }

  /**
   * Set master volume
   */
  setMasterVolume(volume: number): void {
    this.masterVolume = Math.max(0, Math.min(1, volume));
  }

  /**
   * Get master volume
   */
  getMasterVolume(): number {
    return this.masterVolume;
  }

  /**
   * Set category volume
   */
  setCategoryVolume(category: string, volume: number): void {
    this.categoryVolumes.set(category, Math.max(0, Math.min(1, volume)));
  }

  /**
   * Get category volume
   */
  getCategoryVolume(category: string): number {
    return this.categoryVolumes.get(category) ?? 1;
  }

  /**
   * Set track volume with smooth transition
   */
  setTrackVolume(id: string, volume: number, duration: number = 0.1): void {
    const track = this.tracks.get(id);
    if (track) {
      track.targetVolume = Math.max(0, Math.min(1, volume));
      if (duration === 0) {
        track.volume = track.targetVolume;
      }
    }
  }

  /**
   * Apply audio ducking to reduce volume of non-priority tracks
   */
  applyDucking(priorityTrackId: string, duckOtherTracks: boolean = true): void {
    const priorityTrack = this.tracks.get(priorityTrackId);
    if (!priorityTrack) return;

    this.tracks.forEach((track) => {
      if (track.id === priorityTrackId) {
        track.targetVolume = 1;
      } else if (duckOtherTracks) {
        track.targetVolume = this.duckingAmount;
      }
    });
  }

  /**
   * Remove ducking and restore normal volumes
   */
  removeDucking(): void {
    this.tracks.forEach((track) => {
      track.targetVolume = 1;
    });
  }

  /**
   * Get effective volume for a track (master * category * track)
   */
  getEffectiveVolume(id: string): number {
    const track = this.tracks.get(id);
    if (!track) return 0;

    const categoryVolume = track.category ? this.getCategoryVolume(track.category) : 1;
    return this.masterVolume * categoryVolume * track.volume;
  }

  /**
   * Update all track volumes with smooth transitions
   */
  update(deltaTime: number = 0.016): void {
    this.tracks.forEach((track) => {
      if (track.volume !== track.targetVolume) {
        const diff = track.targetVolume - track.volume;
        const rate = diff > 0 ? this.duckingAttack : this.duckingRelease;
        const change = rate * deltaTime;

        if (Math.abs(diff) < change) {
          track.volume = track.targetVolume;
        } else {
          track.volume += Math.sign(diff) * change;
        }
      }
    });
  }

  /**
   * Start continuous update loop
   */
  startUpdateLoop(): void {
    if (this.animationFrameId !== null) return;

    const loop = () => {
      this.update();
      this.animationFrameId = requestAnimationFrame(loop);
    };
    this.animationFrameId = requestAnimationFrame(loop);
  }

  /**
   * Stop update loop
   */
  stopUpdateLoop(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * Get all active tracks
   */
  getActiveTracks(): AudioTrack[] {
    return Array.from(this.tracks.values()).filter((t) => t.isActive);
  }

  /**
   * Get mixer state for debugging
   */
  getState() {
    return {
      masterVolume: this.masterVolume,
      tracks: Array.from(this.tracks.values()),
      categoryVolumes: Object.fromEntries(this.categoryVolumes),
    };
  }

  /**
   * Cleanup resources
   */
  cleanup(): void {
    this.stopUpdateLoop();
    this.tracks.clear();
    this.categoryVolumes.clear();
  }
}

/**
 * AudioDucker handles automatic volume reduction for non-priority audio
 */
export class AudioDucker {
  private mixer: DynamicMixer;
  private priorityTrackId: string | null = null;
  private duckingEnabled: boolean = false;

  constructor(mixer: DynamicMixer) {
    this.mixer = mixer;
  }

  /**
   * Enable ducking for a priority track
   */
  enableDucking(trackId: string): void {
    this.priorityTrackId = trackId;
    this.duckingEnabled = true;
    this.mixer.applyDucking(trackId, true);
  }

  /**
   * Disable ducking
   */
  disableDucking(): void {
    this.duckingEnabled = false;
    this.priorityTrackId = null;
    this.mixer.removeDucking();
  }

  /**
   * Check if ducking is active
   */
  isDuckingActive(): boolean {
    return this.duckingEnabled;
  }

  /**
   * Get priority track ID
   */
  getPriorityTrackId(): string | null {
    return this.priorityTrackId;
  }
}
