/**
 * Particle Physics System
 * Handles particle creation, physics simulation, and collision detection
 */

import { ParticleConfig, EmitterConfig, ParticleSystemConfig } from './types';

/**
 * Particle class with physics simulation
 */
export class Particle implements ParticleConfig {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  life: number;
  maxLife: number;
  ax: number = 0; // acceleration x
  ay: number = 0; // acceleration y

  constructor(config: ParticleConfig) {
    this.x = config.x;
    this.y = config.y;
    this.vx = config.vx;
    this.vy = config.vy;
    this.size = config.size;
    this.opacity = config.opacity;
    this.color = config.color || '#ffffff';
    this.life = config.life || 1;
    this.maxLife = config.maxLife || 1;
  }

  /**
   * Update particle physics
   */
  update(
    deltaTime: number,
    gravity: number = 0,
    friction: number = 0.99,
    bounds?: { width: number; height: number }
  ): void {
    // Apply acceleration
    this.vx += this.ax * deltaTime;
    this.vy += (this.ay + gravity) * deltaTime;

    // Apply friction
    this.vx *= friction;
    this.vy *= friction;

    // Update position
    this.x += this.vx * deltaTime;
    this.y += this.vy * deltaTime;

    // Boundary wrapping
    if (bounds) {
      if (this.x < 0) this.x = bounds.width;
      if (this.x > bounds.width) this.x = 0;
      if (this.y < 0) this.y = bounds.height;
      if (this.y > bounds.height) this.y = 0;
    }

    // Update life
    this.life -= deltaTime;

    // Update opacity based on life
    const lifeRatio = this.life / this.maxLife;
    this.opacity = lifeRatio * (this.opacity / (this.maxLife - this.life || 1));
  }

  /**
   * Apply force to particle
   */
  applyForce(fx: number, fy: number): void {
    this.ax += fx;
    this.ay += fy;
  }

  /**
   * Check if particle is alive
   */
  isAlive(): boolean {
    return this.life > 0;
  }

  /**
   * Distance to another particle
   */
  distanceTo(other: Particle): number {
    const dx = this.x - other.x;
    const dy = this.y - other.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
}

/**
 * Particle Emitter
 */
export class ParticleEmitter {
  x: number;
  y: number;
  rate: number;
  speed: number;
  size: number;
  color: string;
  direction: number;
  spread: number;
  life: number;
  private emitCounter: number = 0;

  constructor(config: EmitterConfig) {
    this.x = config.x;
    this.y = config.y;
    this.rate = config.rate;
    this.speed = config.speed;
    this.size = config.size;
    this.color = config.color || '#ffffff';
    this.direction = config.direction || 0;
    this.spread = config.spread || 0;
    this.life = config.life || 1;
  }

  /**
   * Emit particles
   */
  emit(deltaTime: number): Particle[] {
    const particles: Particle[] = [];
    this.emitCounter += this.rate * deltaTime;

    while (this.emitCounter >= 1) {
      const angle = (this.direction + (Math.random() - 0.5) * this.spread) * (Math.PI / 180);
      const vx = Math.cos(angle) * this.speed;
      const vy = Math.sin(angle) * this.speed;

      particles.push(
        new Particle({
          x: this.x + (Math.random() - 0.5) * this.size,
          y: this.y + (Math.random() - 0.5) * this.size,
          vx,
          vy,
          size: this.size * (0.5 + Math.random() * 0.5),
          opacity: 1,
          color: this.color,
          life: this.life,
          maxLife: this.life,
        })
      );

      this.emitCounter -= 1;
    }

    return particles;
  }
}

/**
 * Particle System
 */
export class ParticleSystem {
  particles: Particle[] = [];
  emitters: ParticleEmitter[] = [];
  config: ParticleSystemConfig;
  private lastTime: number = Date.now();

  constructor(config: ParticleSystemConfig = {}) {
    this.config = {
      maxParticles: config.maxParticles || 1000,
      gravity: config.gravity || 0,
      friction: config.friction || 0.99,
      collisionEnabled: config.collisionEnabled || false,
    };
  }

  /**
   * Add emitter
   */
  addEmitter(emitter: ParticleEmitter): void {
    this.emitters.push(emitter);
  }

  /**
   * Remove emitter
   */
  removeEmitter(emitter: ParticleEmitter): void {
    const index = this.emitters.indexOf(emitter);
    if (index > -1) {
      this.emitters.splice(index, 1);
    }
  }

  /**
   * Update particle system
   */
  update(bounds?: { width: number; height: number }, deltaTime?: number): void {
    if (deltaTime === undefined) {
      const now = Date.now();
      deltaTime = Math.min((now - this.lastTime) / 1000, 0.016); // Cap at 60fps
      this.lastTime = now;
    } else {
      this.lastTime = Date.now();
    }

    // Emit new particles
    for (const emitter of this.emitters) {
      const newParticles = emitter.emit(deltaTime);
      this.particles.push(...newParticles);
    }

    // Limit particle count
    if (this.particles.length > this.config.maxParticles!) {
      this.particles = this.particles.slice(0, this.config.maxParticles);
    }

    // Update particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const particle = this.particles[i];
      particle.update(deltaTime, this.config.gravity, this.config.friction, bounds);

      if (!particle.isAlive()) {
        this.particles.splice(i, 1);
      }
    }

    // Handle collisions
    if (this.config.collisionEnabled) {
      this.handleCollisions();
    }
  }

  /**
   * Handle particle collisions
   */
  private handleCollisions(): void {
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const p1 = this.particles[i];
        const p2 = this.particles[j];
        const distance = p1.distanceTo(p2);
        const minDistance = p1.size + p2.size;

        if (distance < minDistance) {
          // Simple elastic collision
          const angle = Math.atan2(p2.y - p1.y, p2.x - p1.x);
          const sin = Math.sin(angle);
          const cos = Math.cos(angle);

          // Rotate velocities
          const vx1 = p1.vx * cos + p1.vy * sin;
          const vy1 = p1.vy * cos - p1.vx * sin;
          const vx2 = p2.vx * cos + p2.vy * sin;
          const vy2 = p2.vy * cos - p2.vx * sin;

          // Swap velocities
          p1.vx = vx2 * cos - vy1 * sin;
          p1.vy = vy1 * cos + vx2 * sin;
          p2.vx = vx1 * cos - vy2 * sin;
          p2.vy = vy2 * cos + vx1 * sin;

          // Separate particles
          const overlap = minDistance - distance;
          const moveX = (overlap / 2) * cos;
          const moveY = (overlap / 2) * sin;
          p1.x -= moveX;
          p1.y -= moveY;
          p2.x += moveX;
          p2.y += moveY;
        }
      }
    }
  }

  /**
   * Clear all particles
   */
  clear(): void {
    this.particles = [];
  }

  /**
   * Get particle count
   */
  getParticleCount(): number {
    return this.particles.length;
  }
}
