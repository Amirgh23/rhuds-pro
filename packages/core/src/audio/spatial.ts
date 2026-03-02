/**
 * 3D Spatial Audio System
 * Position, orientation, and distance attenuation
 */

import { SpatialConfig } from './types';

/**
 * Spatial audio manager
 */
export class SpatialAudioManager {
  private audioContext: AudioContext;
  private listener: AudioListener;
  private panners: Map<string, PannerNode> = new Map();

  constructor(audioContext: AudioContext) {
    this.audioContext = audioContext;
    this.listener = audioContext.listener;
  }

  /**
   * Create a panner node for spatial audio
   */
  createPanner(id: string, config: SpatialConfig): PannerNode {
    const panner = this.audioContext.createPanner();

    // Configure panner
    panner.panningModel = 'HRTF';
    panner.distanceModel = 'inverse';

    if (config.position) {
      panner.setPosition(config.position.x, config.position.y, config.position.z);
    }

    if (config.orientation) {
      panner.setOrientation(
        config.orientation.x,
        config.orientation.y,
        config.orientation.z
      );
    }

    panner.refDistance = config.refDistance ?? 1;
    panner.maxDistance = config.maxDistance ?? 10000;
    panner.rolloffFactor = config.rolloffFactor ?? 1;
    panner.coneInnerAngle = config.coneInnerAngle ?? 360;
    panner.coneOuterAngle = config.coneOuterAngle ?? 360;
    panner.coneOuterGain = config.coneOuterGain ?? 0;

    this.panners.set(id, panner);
    return panner;
  }

  /**
   * Update panner position
   */
  updatePosition(id: string, x: number, y: number, z: number): void {
    const panner = this.panners.get(id);
    if (panner) {
      panner.setPosition(x, y, z);
    }
  }

  /**
   * Update panner orientation
   */
  updateOrientation(id: string, x: number, y: number, z: number): void {
    const panner = this.panners.get(id);
    if (panner) {
      panner.setOrientation(x, y, z);
    }
  }

  /**
   * Update listener position
   */
  updateListenerPosition(x: number, y: number, z: number): void {
    if (this.listener.positionX) {
      this.listener.positionX.value = x;
      this.listener.positionY.value = y;
      this.listener.positionZ.value = z;
    } else {
      // Fallback for older browsers
      this.listener.setPosition(x, y, z);
    }
  }

  /**
   * Update listener orientation
   */
  updateListenerOrientation(
    forwardX: number,
    forwardY: number,
    forwardZ: number,
    upX: number = 0,
    upY: number = 1,
    upZ: number = 0
  ): void {
    if (this.listener.forwardX) {
      this.listener.forwardX.value = forwardX;
      this.listener.forwardY.value = forwardY;
      this.listener.forwardZ.value = forwardZ;
      this.listener.upX.value = upX;
      this.listener.upY.value = upY;
      this.listener.upZ.value = upZ;
    } else {
      // Fallback for older browsers
      this.listener.setOrientation(forwardX, forwardY, forwardZ, upX, upY, upZ);
    }
  }

  /**
   * Get panner node
   */
  getPanner(id: string): PannerNode | undefined {
    return this.panners.get(id);
  }

  /**
   * Remove panner
   */
  removePanner(id: string): void {
    const panner = this.panners.get(id);
    if (panner) {
      panner.disconnect();
      this.panners.delete(id);
    }
  }

  /**
   * Remove all panners
   */
  removeAllPanners(): void {
    this.panners.forEach((panner) => panner.disconnect());
    this.panners.clear();
  }
}

/**
 * Create spatial audio manager
 */
export function createSpatialAudio(audioContext: AudioContext): SpatialAudioManager {
  return new SpatialAudioManager(audioContext);
}

/**
 * Audio occlusion calculator
 */
export class AudioOcclusionCalculator {
  /**
   * Calculate occlusion factor based on obstacles
   * 
   * @param sourcePos - Source position
   * @param listenerPos - Listener position
   * @param obstacles - Array of obstacle positions and radii
   * @returns Occlusion factor (0 = fully occluded, 1 = no occlusion)
   */
  calculateOcclusion(
    sourcePos: { x: number; y: number; z: number },
    listenerPos: { x: number; y: number; z: number },
    obstacles: Array<{ x: number; y: number; z: number; radius: number }>
  ): number {
    let occlusion = 1;

    for (const obstacle of obstacles) {
      const distToObstacle = this.pointToLineDistance(
        obstacle,
        sourcePos,
        listenerPos
      );

      if (distToObstacle < obstacle.radius) {
        // Calculate occlusion based on how much the obstacle blocks the path
        const occlusionAmount = 1 - distToObstacle / obstacle.radius;
        occlusion *= 1 - occlusionAmount * 0.8; // Max 80% occlusion per obstacle
      }
    }

    return Math.max(0, Math.min(1, occlusion));
  }

  /**
   * Calculate distance from point to line segment
   */
  private pointToLineDistance(
    point: { x: number; y: number; z: number },
    lineStart: { x: number; y: number; z: number },
    lineEnd: { x: number; y: number; z: number }
  ): number {
    const dx = lineEnd.x - lineStart.x;
    const dy = lineEnd.y - lineStart.y;
    const dz = lineEnd.z - lineStart.z;

    const lengthSquared = dx * dx + dy * dy + dz * dz;

    if (lengthSquared === 0) {
      // Line start and end are the same point
      return this.distance3D(point, lineStart);
    }

    const t = Math.max(
      0,
      Math.min(
        1,
        ((point.x - lineStart.x) * dx +
          (point.y - lineStart.y) * dy +
          (point.z - lineStart.z) * dz) /
          lengthSquared
      )
    );

    const closestPoint = {
      x: lineStart.x + t * dx,
      y: lineStart.y + t * dy,
      z: lineStart.z + t * dz,
    };

    return this.distance3D(point, closestPoint);
  }

  /**
   * Calculate 3D distance between two points
   */
  private distance3D(
    p1: { x: number; y: number; z: number },
    p2: { x: number; y: number; z: number }
  ): number {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const dz = p2.z - p1.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }
}

/**
 * Distance attenuation calculator
 */
export class DistanceAttenuationCalculator {
  /**
   * Calculate attenuation based on distance
   * 
   * @param distance - Distance from source to listener
   * @param refDistance - Reference distance
   * @param maxDistance - Maximum distance
   * @param rolloffFactor - Rolloff factor
   * @param model - Distance model ('linear', 'inverse', 'exponential')
   * @returns Attenuation factor (0-1)
   */
  calculateAttenuation(
    distance: number,
    refDistance: number = 1,
    maxDistance: number = 10000,
    rolloffFactor: number = 1,
    model: 'linear' | 'inverse' | 'exponential' = 'inverse'
  ): number {
    if (distance <= refDistance) {
      return 1;
    }

    if (distance >= maxDistance) {
      return 0;
    }

    switch (model) {
      case 'linear':
        return (
          1 - rolloffFactor * ((distance - refDistance) / (maxDistance - refDistance))
        );

      case 'inverse':
        return refDistance / (refDistance + rolloffFactor * (distance - refDistance));

      case 'exponential':
        return Math.pow(distance / refDistance, -rolloffFactor);

      default:
        return 1;
    }
  }

  /**
   * Calculate attenuation with custom falloff curve
   */
  calculateCustomAttenuation(
    distance: number,
    curve: (distance: number) => number
  ): number {
    return Math.max(0, Math.min(1, curve(distance)));
  }
}
