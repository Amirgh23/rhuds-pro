/**
 * Spatial Audio System
 * Implements 3D positional audio with distance attenuation and occlusion
 */

export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface SpatialAudioConfig {
  position?: Vector3;
  orientation?: Vector3;
  refDistance?: number;
  maxDistance?: number;
  rolloffFactor?: number;
}

/**
 * Spatial Audio Source
 */
export class SpatialAudioSource {
  private panner: PannerNode;
  private position: Vector3 = { x: 0, y: 0, z: 0 };
  private orientation: Vector3 = { x: 0, y: 0, z: 1 };
  private refDistance: number;
  private maxDistance: number;
  private rolloffFactor: number;

  constructor(audioContext: AudioContext, config: SpatialAudioConfig = {}) {
    this.panner = audioContext.createPanner();
    this.panner.panningModel = 'HRTF';
    this.panner.distanceModel = 'inverse';

    this.refDistance = config.refDistance ?? 1;
    this.maxDistance = config.maxDistance ?? 10000;
    this.rolloffFactor = config.rolloffFactor ?? 1;

    this.panner.refDistance = this.refDistance;
    this.panner.maxDistance = this.maxDistance;
    this.panner.rolloffFactor = this.rolloffFactor;

    if (config.position) {
      this.setPosition(config.position);
    }
    if (config.orientation) {
      this.setOrientation(config.orientation);
    }
  }

  /**
   * Set position
   */
  setPosition(position: Vector3): void {
    this.position = position;
    this.panner.positionX.value = position.x;
    this.panner.positionY.value = position.y;
    this.panner.positionZ.value = position.z;
  }

  /**
   * Get position
   */
  getPosition(): Vector3 {
    return { ...this.position };
  }

  /**
   * Set orientation
   */
  setOrientation(orientation: Vector3): void {
    this.orientation = orientation;
    this.panner.orientationX.value = orientation.x;
    this.panner.orientationY.value = orientation.y;
    this.panner.orientationZ.value = orientation.z;
  }

  /**
   * Get orientation
   */
  getOrientation(): Vector3 {
    return { ...this.orientation };
  }

  /**
   * Set reference distance
   */
  setRefDistance(distance: number): void {
    this.refDistance = Math.max(0, distance);
    this.panner.refDistance = this.refDistance;
  }

  /**
   * Set max distance
   */
  setMaxDistance(distance: number): void {
    this.maxDistance = Math.max(this.refDistance, distance);
    this.panner.maxDistance = this.maxDistance;
  }

  /**
   * Set rolloff factor
   */
  setRolloffFactor(factor: number): void {
    this.rolloffFactor = Math.max(0, factor);
    this.panner.rolloffFactor = this.rolloffFactor;
  }

  /**
   * Get panner node
   */
  getPanner(): PannerNode {
    return this.panner;
  }

  /**
   * Calculate distance to listener
   */
  getDistance(listenerPosition: Vector3): number {
    const dx = this.position.x - listenerPosition.x;
    const dy = this.position.y - listenerPosition.y;
    const dz = this.position.z - listenerPosition.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }
}

/**
 * Listener (Spatial Audio Receiver)
 */
export class Listener {
  private listener: AudioListener;
  private position: Vector3 = { x: 0, y: 0, z: 0 };
  private forward: Vector3 = { x: 0, y: 0, z: -1 };
  private up: Vector3 = { x: 0, y: 1, z: 0 };

  constructor(audioContext: AudioContext) {
    this.listener = audioContext.listener;
  }

  /**
   * Set position
   */
  setPosition(position: Vector3): void {
    this.position = position;
    this.listener.positionX.value = position.x;
    this.listener.positionY.value = position.y;
    this.listener.positionZ.value = position.z;
  }

  /**
   * Get position
   */
  getPosition(): Vector3 {
    return { ...this.position };
  }

  /**
   * Set orientation (forward and up vectors)
   */
  setOrientation(forward: Vector3, up: Vector3): void {
    this.forward = forward;
    this.up = up;
    this.listener.forwardX.value = forward.x;
    this.listener.forwardY.value = forward.y;
    this.listener.forwardZ.value = forward.z;
    this.listener.upX.value = up.x;
    this.listener.upY.value = up.y;
    this.listener.upZ.value = up.z;
  }

  /**
   * Get forward vector
   */
  getForward(): Vector3 {
    return { ...this.forward };
  }

  /**
   * Get up vector
   */
  getUp(): Vector3 {
    return { ...this.up };
  }
}

/**
 * Spatial Audio Manager
 */
export class SpatialAudioManager {
  private audioContext: AudioContext;
  private listener: Listener;
  private sources: Map<string, SpatialAudioSource> = new Map();

  constructor(audioContext: AudioContext) {
    this.audioContext = audioContext;
    this.listener = new Listener(audioContext);
  }

  /**
   * Create spatial audio source
   */
  createSource(id: string, config: SpatialAudioConfig = {}): SpatialAudioSource {
    const source = new SpatialAudioSource(this.audioContext, config);
    this.sources.set(id, source);
    return source;
  }

  /**
   * Get spatial audio source
   */
  getSource(id: string): SpatialAudioSource | undefined {
    return this.sources.get(id);
  }

  /**
   * Remove spatial audio source
   */
  removeSource(id: string): void {
    this.sources.delete(id);
  }

  /**
   * Set listener position
   */
  setListenerPosition(position: Vector3): void {
    this.listener.setPosition(position);
  }

  /**
   * Set listener orientation
   */
  setListenerOrientation(forward: Vector3, up: Vector3): void {
    this.listener.setOrientation(forward, up);
  }

  /**
   * Get listener
   */
  getListener(): Listener {
    return this.listener;
  }

  /**
   * Update all source distances
   */
  updateDistances(): Map<string, number> {
    const distances = new Map<string, number>();
    const listenerPos = this.listener.getPosition();

    this.sources.forEach((source, id) => {
      const distance = source.getDistance(listenerPos);
      distances.set(id, distance);
    });

    return distances;
  }

  /**
   * Cleanup
   */
  cleanup(): void {
    this.sources.clear();
  }
}

export default {
  SpatialAudioSource,
  Listener,
  SpatialAudioManager,
};
