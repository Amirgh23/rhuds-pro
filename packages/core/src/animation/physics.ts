/**
 * Physics-based Animation System
 * Implements spring dynamics, decay, and inertia animations
 */

export interface SpringConfig {
  mass?: number;
  tension?: number;
  friction?: number;
  velocity?: number;
}

export interface DecayConfig {
  velocity: number;
  deceleration?: number;
}

export interface InertiaConfig {
  velocity: number;
  friction?: number;
  minVelocity?: number;
}

/**
 * Spring dynamics using Hooke's law
 * F = -kx - cv (spring force + damping)
 */
export class SpringAnimation {
  private mass: number;
  private tension: number;
  private friction: number;
  private velocity: number;
  private position: number = 0;
  private target: number = 0;

  constructor(config: SpringConfig = {}) {
    this.mass = config.mass ?? 1;
    this.tension = config.tension ?? 170;
    this.friction = config.friction ?? 26;
    this.velocity = config.velocity ?? 0;
  }

  /**
   * Update spring animation
   * Returns current position
   */
  update(deltaTime: number = 0.016): number {
    const displacement = this.target - this.position;
    const springForce = -this.tension * displacement;
    const dampingForce = -this.friction * this.velocity;
    const totalForce = springForce + dampingForce;
    const acceleration = totalForce / this.mass;

    this.velocity += acceleration * deltaTime;
    this.position += this.velocity * deltaTime;

    return this.position;
  }

  /**
   * Set target value
   */
  setTarget(target: number): void {
    this.target = target;
  }

  /**
   * Check if animation is complete (settled)
   */
  isSettled(threshold: number = 0.001): boolean {
    const displacement = Math.abs(this.target - this.position);
    const velocityMagnitude = Math.abs(this.velocity);
    return displacement < threshold && velocityMagnitude < threshold;
  }

  /**
   * Get current state
   */
  getState() {
    return {
      position: this.position,
      velocity: this.velocity,
      target: this.target,
    };
  }

  /**
   * Reset animation
   */
  reset(position: number = 0, velocity: number = 0): void {
    this.position = position;
    this.velocity = velocity;
    this.target = position;
  }
}

/**
 * Decay animation - velocity decreases over time
 */
export class DecayAnimation {
  private velocity: number;
  private position: number = 0;
  private deceleration: number;

  constructor(config: DecayConfig) {
    this.velocity = config.velocity;
    this.deceleration = config.deceleration ?? 0.95;
  }

  /**
   * Update decay animation
   */
  update(deltaTime: number = 0.016): number {
    this.velocity *= Math.pow(this.deceleration, deltaTime * 60);
    this.position += this.velocity * deltaTime;
    return this.position;
  }

  /**
   * Check if animation is complete
   */
  isComplete(threshold: number = 0.001): boolean {
    return Math.abs(this.velocity) < threshold;
  }

  /**
   * Get current state
   */
  getState() {
    return {
      position: this.position,
      velocity: this.velocity,
    };
  }

  /**
   * Reset animation
   */
  reset(position: number = 0, velocity: number = 0): void {
    this.position = position;
    this.velocity = velocity;
  }
}

/**
 * Inertia animation - simulates momentum with friction
 */
export class InertiaAnimation {
  private velocity: number;
  private position: number = 0;
  private friction: number;
  private minVelocity: number;

  constructor(config: InertiaConfig) {
    this.velocity = config.velocity;
    this.friction = config.friction ?? 0.05;
    this.minVelocity = config.minVelocity ?? 0.001;
  }

  /**
   * Update inertia animation
   */
  update(deltaTime: number = 0.016): number {
    const frictionForce = -this.friction * this.velocity;
    this.velocity += frictionForce * deltaTime;

    if (Math.abs(this.velocity) < this.minVelocity) {
      this.velocity = 0;
    }

    this.position += this.velocity * deltaTime;
    return this.position;
  }

  /**
   * Check if animation is complete
   */
  isComplete(): boolean {
    return this.velocity === 0;
  }

  /**
   * Get current state
   */
  getState() {
    return {
      position: this.position,
      velocity: this.velocity,
    };
  }

  /**
   * Reset animation
   */
  reset(position: number = 0, velocity: number = 0): void {
    this.position = position;
    this.velocity = velocity;
  }
}

/**
 * Spring easing presets
 */
export const springPresets = {
  gentle: { mass: 1, tension: 100, friction: 20 },
  wobbly: { mass: 1, tension: 180, friction: 12 },
  stiff: { mass: 1, tension: 300, friction: 30 },
  molasses: { mass: 1, tension: 50, friction: 40 },
};

/**
 * Create a spring easing function
 */
export function createSpringEasing(config: SpringConfig = {}) {
  const spring = new SpringAnimation(config);
  spring.setTarget(1);

  return (t: number): number => {
    // Simulate spring animation over normalized time
    const steps = Math.ceil(t * 60); // 60 frames per second
    let value = 0;
    for (let i = 0; i < steps; i++) {
      value = spring.update(1 / 60);
    }
    return Math.min(1, Math.max(0, value));
  };
}

/**
 * Create a decay easing function
 */
export function createDecayEasing(config: DecayConfig) {
  const decay = new DecayAnimation(config);

  return (t: number): number => {
    const steps = Math.ceil(t * 60);
    let value = 0;
    for (let i = 0; i < steps; i++) {
      value = decay.update(1 / 60);
    }
    return Math.min(1, Math.max(0, value));
  };
}

/**
 * Create an inertia easing function
 */
export function createInertiaEasing(config: InertiaConfig) {
  const inertia = new InertiaAnimation(config);

  return (t: number): number => {
    const steps = Math.ceil(t * 60);
    let value = 0;
    for (let i = 0; i < steps; i++) {
      value = inertia.update(1 / 60);
    }
    return Math.min(1, Math.max(0, value));
  };
}

export default {
  SpringAnimation,
  DecayAnimation,
  InertiaAnimation,
};
