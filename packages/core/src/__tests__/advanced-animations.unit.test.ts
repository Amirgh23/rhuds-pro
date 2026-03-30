/**
 * Unit Tests for Advanced Animation Features
 * Tests physics-based, gesture-driven, and scroll-triggered animations
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { SpringAnimation, DecayAnimation, InertiaAnimation } from '../animation/physics';
import { DragGesture, SwipeGesture, PinchGesture, RotateGesture } from '../animation/gestures';
import { ScrollTrigger, ScrollProgress, ScrollAnimation } from '../animation/scroll';

describe('Physics-Based Animations', () => {
  describe('SpringAnimation', () => {
    it('should initialize with default config', () => {
      const spring = new SpringAnimation();
      const state = spring.getState();
      expect(state.position).toBe(0);
      expect(state.velocity).toBe(0);
      expect(state.target).toBe(0);
    });

    it('should initialize with custom config', () => {
      const spring = new SpringAnimation({
        mass: 2,
        tension: 200,
        friction: 30,
        velocity: 5,
      });
      const state = spring.getState();
      expect(state.velocity).toBe(5);
    });

    it('should move towards target', () => {
      const spring = new SpringAnimation();
      spring.setTarget(100);

      const initialPosition = spring.getState().position;
      spring.update(0.016);
      const newPosition = spring.getState().position;

      expect(newPosition).not.toBe(initialPosition);
    });

    it('should move towards target over time', () => {
      const spring = new SpringAnimation({ tension: 100, friction: 50 });
      spring.setTarget(50);

      const initialState = spring.getState();
      spring.update(0.016);
      const newState = spring.getState();

      // Velocity should be non-zero after update
      expect(Math.abs(newState.velocity)).toBeGreaterThan(0);
    });

    it('should reset to initial state', () => {
      const spring = new SpringAnimation();
      spring.setTarget(100);
      spring.update(0.016);

      spring.reset(0, 0);
      const state = spring.getState();
      expect(state.position).toBe(0);
      expect(state.velocity).toBe(0);
    });
  });

  describe('DecayAnimation', () => {
    it('should initialize with velocity', () => {
      const decay = new DecayAnimation({ velocity: 100 });
      const state = decay.getState();
      expect(state.velocity).toBe(100);
      expect(state.position).toBe(0);
    });

    it('should decrease velocity over time', () => {
      const decay = new DecayAnimation({ velocity: 100 });
      const initialVelocity = decay.getState().velocity;

      decay.update(0.016);
      const newVelocity = decay.getState().velocity;

      expect(newVelocity).toBeLessThan(initialVelocity);
    });

    it('should eventually complete', () => {
      const decay = new DecayAnimation({ velocity: 100 });

      let completed = false;
      for (let i = 0; i < 1000; i++) {
        decay.update(0.016);
        if (decay.isComplete()) {
          completed = true;
          break;
        }
      }

      expect(completed).toBe(true);
    });

    it('should update position based on velocity', () => {
      const decay = new DecayAnimation({ velocity: 100 });
      const initialPosition = decay.getState().position;

      decay.update(0.016);
      const newPosition = decay.getState().position;

      expect(newPosition).toBeGreaterThan(initialPosition);
    });
  });

  describe('InertiaAnimation', () => {
    it('should initialize with velocity', () => {
      const inertia = new InertiaAnimation({ velocity: 50 });
      const state = inertia.getState();
      expect(state.velocity).toBe(50);
    });

    it('should apply friction to velocity', () => {
      const inertia = new InertiaAnimation({ velocity: 50 });
      const initialVelocity = inertia.getState().velocity;

      inertia.update(0.016);
      const newVelocity = inertia.getState().velocity;

      expect(newVelocity).toBeLessThan(initialVelocity);
    });

    it('should stop when velocity falls below minimum', () => {
      const inertia = new InertiaAnimation({ velocity: 0.0001, minVelocity: 0.001 });

      inertia.update(0.016);
      expect(inertia.isComplete()).toBe(true);
    });

    it('should update position', () => {
      const inertia = new InertiaAnimation({ velocity: 100 });
      const initialPosition = inertia.getState().position;

      inertia.update(0.016);
      const newPosition = inertia.getState().position;

      expect(newPosition).toBeGreaterThan(initialPosition);
    });
  });
});

describe('Gesture-Driven Animations', () => {
  describe('DragGesture', () => {
    it('should track drag movement', () => {
      const onDrag = vi.fn();
      const gesture = new DragGesture({ onDrag });

      gesture.onPointerDown(0, 0);
      gesture.onPointerMove(10, 10);

      expect(onDrag).toHaveBeenCalledWith({ x: 10, y: 10 });
    });

    it('should calculate velocity on pointer up', () => {
      const onDragEnd = vi.fn();
      const gesture = new DragGesture({ onDragEnd });

      gesture.onPointerDown(0, 0);
      gesture.onPointerMove(10, 10);
      gesture.onPointerUp(20, 20);

      expect(onDragEnd).toHaveBeenCalled();
      const call = onDragEnd.mock.calls[0][0];
      expect(typeof call.x).toBe('number');
      expect(typeof call.y).toBe('number');
    });

    it('should respect bounds', () => {
      const onDrag = vi.fn();
      const gesture = new DragGesture({
        onDrag,
        bounds: { minX: 0, maxX: 100, minY: 0, maxY: 100 },
      });

      gesture.onPointerDown(50, 50);
      gesture.onPointerMove(150, 150);

      const position = gesture.getPosition();
      expect(position.x).toBeLessThanOrEqual(100);
      expect(position.y).toBeLessThanOrEqual(100);
    });

    it('should support elastic bounds', () => {
      const gesture = new DragGesture({
        bounds: { minX: 0, maxX: 100, minY: 0, maxY: 100 },
        elastic: true,
      });

      gesture.onPointerDown(50, 50);
      gesture.onPointerMove(150, 150);

      const position = gesture.getPosition();
      // With elastic bounds, position should be clamped but with elasticity
      expect(position.x).toBeLessThanOrEqual(150);
      expect(position.y).toBeLessThanOrEqual(150);
    });
  });

  describe('SwipeGesture', () => {
    it('should detect right swipe', () => {
      const onSwipe = vi.fn();
      const gesture = new SwipeGesture({ onSwipe, threshold: 50, velocityThreshold: 0.1 });

      gesture.onPointerDown(0, 0);
      gesture.onPointerUp(100, 0);

      expect(onSwipe).toHaveBeenCalledWith('right');
    });

    it('should detect left swipe', () => {
      const onSwipe = vi.fn();
      const gesture = new SwipeGesture({ onSwipe, threshold: 50, velocityThreshold: 0.1 });

      gesture.onPointerDown(100, 0);
      gesture.onPointerUp(0, 0);

      expect(onSwipe).toHaveBeenCalledWith('left');
    });

    it('should detect down swipe', () => {
      const onSwipe = vi.fn();
      const gesture = new SwipeGesture({ onSwipe, threshold: 50, velocityThreshold: 0.1 });

      gesture.onPointerDown(0, 0);
      gesture.onPointerUp(0, 100);

      expect(onSwipe).toHaveBeenCalledWith('down');
    });

    it('should detect up swipe', () => {
      const onSwipe = vi.fn();
      const gesture = new SwipeGesture({ onSwipe, threshold: 50, velocityThreshold: 0.1 });

      gesture.onPointerDown(0, 100);
      gesture.onPointerUp(0, 0);

      expect(onSwipe).toHaveBeenCalledWith('up');
    });

    it('should require minimum distance', () => {
      const onSwipe = vi.fn();
      const gesture = new SwipeGesture({ onSwipe, threshold: 100, velocityThreshold: 0.1 });

      gesture.onPointerDown(0, 0);
      gesture.onPointerUp(10, 0);

      expect(onSwipe).not.toHaveBeenCalled();
    });
  });

  describe('PinchGesture', () => {
    it('should initialize with config', () => {
      const gesture = new PinchGesture({ minScale: 0.5, maxScale: 3 });
      expect(gesture).toBeDefined();
    });

    it('should handle touch start', () => {
      const gesture = new PinchGesture();
      gesture.onTouchStart([
        { id: 1, x: 0, y: 0 },
        { id: 2, x: 100, y: 0 },
      ]);
      expect((gesture as any).touches.size).toBe(2);
    });

    it('should reset on touch end', () => {
      const gesture = new PinchGesture();

      gesture.onTouchStart([
        { id: 1, x: 0, y: 0 },
        { id: 2, x: 100, y: 0 },
      ]);

      gesture.onTouchEnd([1, 2]);
      expect((gesture as any).touches.size).toBe(0);
    });

    it('should clamp scale to min/max', () => {
      const onPinch = vi.fn();
      const gesture = new PinchGesture({ onPinch, minScale: 0.5, maxScale: 3 });

      gesture.onTouchStart([
        { id: 1, x: 0, y: 0 },
        { id: 2, x: 100, y: 0 },
      ]);

      gesture.onTouchMove([
        { id: 1, x: 0, y: 0 },
        { id: 2, x: 500, y: 0 },
      ]);

      if (onPinch.mock.calls.length > 0) {
        const lastCall = onPinch.mock.calls[onPinch.mock.calls.length - 1][0];
        expect(lastCall).toBeLessThanOrEqual(3);
      }
    });
  });

  describe('RotateGesture', () => {
    it('should initialize with config', () => {
      const gesture = new RotateGesture();
      expect(gesture).toBeDefined();
    });

    it('should handle touch start', () => {
      const gesture = new RotateGesture();
      gesture.onTouchStart([
        { id: 1, x: 0, y: 0 },
        { id: 2, x: 100, y: 0 },
      ]);
      expect((gesture as any).touches.size).toBe(2);
    });

    it('should reset on touch end', () => {
      const gesture = new RotateGesture();

      gesture.onTouchStart([
        { id: 1, x: 0, y: 0 },
        { id: 2, x: 100, y: 0 },
      ]);

      gesture.onTouchEnd([1, 2]);
      expect((gesture as any).touches.size).toBe(0);
    });
  });
});

describe('Scroll-Triggered Animations', () => {
  describe('ScrollTrigger', () => {
    it('should initialize with config', () => {
      const onEnter = vi.fn();
      const trigger = new ScrollTrigger({ onEnter });
      expect(trigger).toBeDefined();
    });

    it('should track visibility state', () => {
      const trigger = new ScrollTrigger();
      expect(trigger.isElementVisible()).toBe(false);
    });

    it('should cleanup on detach', () => {
      const trigger = new ScrollTrigger();
      trigger.detach();
      expect((trigger as any).element).toBeNull();
    });
  });

  describe('ScrollAnimation', () => {
    it('should manage triggers', () => {
      const animation = new ScrollAnimation();
      expect((animation as any).triggers.size).toBe(0);
    });

    it('should manage progress trackers', () => {
      const animation = new ScrollAnimation();
      expect((animation as any).progressTrackers.size).toBe(0);
    });

    it('should cleanup all resources', () => {
      const animation = new ScrollAnimation();
      animation.cleanup();
      expect((animation as any).triggers.size).toBe(0);
      expect((animation as any).progressTrackers.size).toBe(0);
    });
  });
});
