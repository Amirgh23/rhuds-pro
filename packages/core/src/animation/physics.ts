/**
 * Physics-Based Animation System
 * Spring dynamics, decay, and inertia animations
 */

import { EasingFunction } from './types';

/**
 * Spring configuration
 */
export interface SpringConfig {
  mass?: number;
  tension?: number;
  friction?: number;
  velocity?: number;
  precision?: number;
}

/**
 * Spring animation state
 */
interface SpringState {
  position: number;
  velocity: number;
  target: number;
}

/**
 * Default spring configuration
 */
const defaultSpringConfig: Required<SpringConfig> = {
  mass: 1,
  tension: 170,
  friction: 26,
  velocity: 0,
  precision: 0.01,
};

/**
 * Create a spring-based easing function
 * 
 * Uses spring physics to create natural motion with configurable
 * mass, tension, and friction parameters.
 * 
 * @param config - Spring configuration
 * @returns Easing function
 */
export function createSpringEasing(config?: SpringConfig): EasingFunction {
  const cfg = { ...defaultSpringConfig, ...config };

  return (t: number): number => {
    if (t === 0 || t === 1) return t;

    const state: SpringState = {
      position: 0,
      velocity: cfg.velocity,
      target: 1,
    };

    const dt = 0.016; // 60fps
    const steps = Math.ceil(t / dt);

    for (let i = 0; i < steps; i++) {
      const spring = -cfg.tension * (state.position - state.target);
      const damper = -cfg.friction * state.velocity;
      const acceleration = (spring + damper) / cfg.mass;

      state.velocity += acceleration * dt;
      state.position += state.velocity * dt;
    }

    return state.position;
  };
}

/**
 * Decay animation configuration
 */
export interface DecayConfig {
  velocity: number;
  deceleration?: number;
  precision?: number;
}

/**
 * Create a decay-based easing function
 * 
 * Simulates deceleration from an initial velocity.
 * 
 * @param config - Decay configuration
 * @returns Easing function
 */
export function createDecayEasing(config: DecayConfig): EasingFunction {
  const deceleration = config.deceleration ?? 0.998;
  const precision = config.precision ?? 0.01;

  return (t: number): number => {
    if (t === 0) return 0;
    if (t === 1) return 1;

    let velocity = config.velocity;
    let position = 0;
    const dt = 0.016;
    const steps = Math.ceil(t / dt);

    for (let i = 0; i < steps; i++) {
      velocity *= deceleration;
      position += velocity * dt;

      if (Math.abs(velocity) < precision) break;
    }

    return Math.min(position, 1);
  };
}

/**
 * Inertia animation configuration
 */
export interface InertiaConfig {
  velocity: number;
  min?: number;
  max?: number;
  bounceStiffness?: number;
  bounceDamping?: number;
}

/**
 * Create an inertia-based easing function
 * 
 * Simulates momentum with optional boundary constraints.
 * 
 * @param config - Inertia configuration
 * @returns Easing function
 */
export function createInertiaEasing(config: InertiaConfig): EasingFunction {
  const min = config.min ?? 0;
  const max = config.max ?? 1;
  const bounceStiffness = config.bounceStiffness ?? 0.5;
  const bounceDamping = config.bounceDamping ?? 0.8;

  return (t: number): number => {
    if (t === 0) return 0;
    if (t === 1) return 1;

    let velocity = config.velocity;
    let position = 0;
    const dt = 0.016;
    const steps = Math.ceil(t / dt);

    for (let i = 0; i < steps; i++) {
      position += velocity * dt;

      // Apply boundary constraints with bounce
      if (position < min) {
        position = min;
        velocity = -velocity * bounceStiffness;
      } else if (position > max) {
        position = max;
        velocity = -velocity * bounceStiffness;
      }

      // Apply damping
      velocity *= bounceDamping;
    }

    return Math.max(min, Math.min(max, position));
  };
}

/**
 * Preset spring configurations
 */
export const springPresets = {
  default: { tension: 170, friction: 26 },
  gentle: { tension: 120, friction: 14 },
  wobbly: { tension: 180, friction: 12 },
  stiff: { tension: 210, friction: 20 },
  slow: { tension: 280, friction: 60 },
  molasses: { tension: 280, friction: 120 },
};
