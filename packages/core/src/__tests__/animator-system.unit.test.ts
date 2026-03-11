import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  createAnimatorSystem,
  getAnimatorSystemConfig,
  isAnimatorSystemInitialized,
  resetAnimatorSystem,
  updateAnimatorSystemConfig,
} from '../animation/createAnimatorSystem';
import { createAnimation } from '../animation/createAnimation';
import {
  SubsystemManager,
  createFadeSubsystem,
  createScaleSubsystem,
} from '../animation/subsystems';
import type { AnimationConfig } from '../animation/types';

describe('Animator System Unit Tests', () => {
  beforeEach(() => {
    resetAnimatorSystem();
    vi.useFakeTimers();
  });

  afterEach(() => {
    resetAnimatorSystem();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('Animator System Initialization', () => {
    it('should initialize with default configuration', () => {
      const config = createAnimatorSystem();

      expect(config).toBeDefined();
      expect(config.defaultDuration).toBeDefined();
      expect(config.defaultEasing).toBeDefined();
      expect(isAnimatorSystemInitialized()).toBe(true);
    });

    it('should merge custom configuration with defaults', () => {
      const customConfig = {
        defaultDuration: {
          enter: 500,
          exit: 300,
          stagger: 100,
          delay: 50,
        },
      };

      const config = createAnimatorSystem(customConfig);

      expect(config.defaultDuration.enter).toBe(500);
      expect(config.defaultDuration.exit).toBe(300);
      expect(config.defaultDuration.stagger).toBe(100);
      expect(config.defaultDuration.delay).toBe(50);
    });

    it('should return same config on subsequent calls', () => {
      const config1 = createAnimatorSystem();
      const config2 = getAnimatorSystemConfig();

      expect(config1).toEqual(config2);
    });

    it('should auto-initialize on getAnimatorSystemConfig if not initialized', () => {
      resetAnimatorSystem();
      expect(isAnimatorSystemInitialized()).toBe(false);

      const config = getAnimatorSystemConfig();

      expect(config).toBeDefined();
      expect(isAnimatorSystemInitialized()).toBe(true);
    });
  });

  describe('Animator System Configuration Updates', () => {
    it('should update duration configuration', () => {
      createAnimatorSystem();

      updateAnimatorSystemConfig({
        defaultDuration: {
          enter: 400,
          exit: 250,
          stagger: 75,
          delay: 25,
        },
      });

      const config = getAnimatorSystemConfig();
      expect(config.defaultDuration.enter).toBe(400);
      expect(config.defaultDuration.exit).toBe(250);
    });

    it('should update easing configuration', () => {
      createAnimatorSystem();

      updateAnimatorSystemConfig({
        defaultEasing: {
          enter: 'easeOutCubic',
          exit: 'easeInCubic',
        },
      });

      const config = getAnimatorSystemConfig();
      expect(config.defaultEasing.enter).toBe('easeOutCubic');
      expect(config.defaultEasing.exit).toBe('easeInCubic');
    });

    it('should preserve unmodified configuration during updates', () => {
      const initialConfig = createAnimatorSystem({
        defaultDuration: {
          enter: 300,
          exit: 200,
          stagger: 50,
          delay: 0,
        },
      });

      updateAnimatorSystemConfig({
        defaultDuration: {
          enter: 400,
          exit: 200,
          stagger: 50,
          delay: 0,
        },
      });

      const updatedConfig = getAnimatorSystemConfig();
      expect(updatedConfig.defaultDuration.exit).toBe(200);
      expect(updatedConfig.defaultDuration.stagger).toBe(50);
    });
  });

  describe('Animation Creation', () => {
    beforeEach(() => {
      vi.stubGlobal(
        'requestAnimationFrame',
        vi.fn((cb) => setTimeout(cb, 16))
      );
      vi.stubGlobal('cancelAnimationFrame', vi.fn());
    });

    afterEach(() => {
      vi.unstubAllGlobals();
    });

    it('should create animation with valid configuration', () => {
      const config: AnimationConfig = {
        duration: 300,
        easing: 'easeInOut',
        delay: 0,
      };

      const animation = createAnimation(config);

      expect(animation).toBeDefined();
      expect(animation.getProgress).toBeDefined();
      expect(animation.play).toBeDefined();
      expect(animation.pause).toBeDefined();
      expect(animation.stop).toBeDefined();
      expect(animation.getProgress()).toBe(0);
    });

    it('should support animation playback control', () => {
      const config: AnimationConfig = { duration: 300 };
      const animation = createAnimation(config);

      animation.play();
      expect(animation.isPlaying()).toBe(true);

      animation.pause();
      expect(animation.isPlaying()).toBe(false);

      animation.stop();
      expect(animation.getProgress()).toBe(0);
    });

    it('should track animation progress', () => {
      const config: AnimationConfig = { duration: 300 };
      const animation = createAnimation(config);

      expect(animation.getProgress()).toBe(0);

      animation.seek(0.5);
      expect(animation.getProgress()).toBeCloseTo(0.5, 1);
    });

    it('should support animation seeking', () => {
      const config: AnimationConfig = { duration: 1000 };
      const animation = createAnimation(config);

      animation.seek(0.5);
      expect(animation.getProgress()).toBeCloseTo(0.5, 1);

      animation.seek(0.75);
      expect(animation.getProgress()).toBeCloseTo(0.75, 1);
    });

    it('should clamp seek progress to 0-1 range', () => {
      const config: AnimationConfig = { duration: 500 };
      const animation = createAnimation(config);

      animation.seek(1.5);
      expect(animation.getProgress()).toBe(1);

      animation.seek(-0.5);
      expect(animation.getProgress()).toBe(0);
    });

    it('should support animation reversal', () => {
      const config: AnimationConfig = { duration: 1000 };
      const animation = createAnimation(config);

      animation.seek(0.5);
      const progressBefore = animation.getProgress();

      animation.reverse();
      // After reverse, progress should be inverted
      expect(animation.getProgress()).toBeCloseTo(1 - progressBefore, 1);
    });
  });

  describe('Subsystem Manager', () => {
    it('should register and retrieve subsystems', () => {
      const manager = new SubsystemManager();
      const mockElement = {
        style: {},
      } as any;

      const fadeSubsystem = createFadeSubsystem(mockElement);
      manager.register(fadeSubsystem);

      const retrieved = manager.get('fade');
      expect(retrieved).toBeDefined();
      expect(retrieved?.name).toBe('fade');
    });

    it('should unregister subsystems', () => {
      const manager = new SubsystemManager();
      const mockElement = {
        style: {},
      } as any;

      const fadeSubsystem = createFadeSubsystem(mockElement);
      manager.register(fadeSubsystem);

      expect(manager.get('fade')).toBeDefined();

      manager.unregister('fade');
      expect(manager.get('fade')).toBeUndefined();
    });

    it('should call cleanup on subsystem unregister', () => {
      const manager = new SubsystemManager();
      const cleanupFn = vi.fn();

      const subsystem = {
        name: 'test',
        cleanup: cleanupFn,
      };

      manager.register(subsystem);
      manager.unregister('test');

      expect(cleanupFn).toHaveBeenCalled();
    });

    it('should get all registered subsystems', () => {
      const manager = new SubsystemManager();
      const mockElement = {
        style: {},
      } as any;

      const fadeSubsystem = createFadeSubsystem(mockElement);
      const scaleSubsystem = createScaleSubsystem(mockElement);

      manager.register(fadeSubsystem);
      manager.register(scaleSubsystem);

      const all = manager.getAll();
      expect(all).toHaveLength(2);
      expect(all.map((s) => s.name)).toContain('fade');
      expect(all.map((s) => s.name)).toContain('scale');
    });

    it('should cleanup all subsystems', () => {
      const manager = new SubsystemManager();
      const cleanupFn1 = vi.fn();
      const cleanupFn2 = vi.fn();

      const subsystem1 = {
        name: 'test1',
        cleanup: cleanupFn1,
      };

      const subsystem2 = {
        name: 'test2',
        cleanup: cleanupFn2,
      };

      manager.register(subsystem1);
      manager.register(subsystem2);

      manager.cleanup();

      expect(cleanupFn1).toHaveBeenCalled();
      expect(cleanupFn2).toHaveBeenCalled();
      expect(manager.getAll()).toHaveLength(0);
    });

    it('should notify subsystems of state changes', () => {
      const manager = new SubsystemManager();
      const onEntering = vi.fn();
      const onEntered = vi.fn();
      const onExiting = vi.fn();
      const onExited = vi.fn();

      const subsystem = {
        name: 'test',
        onEntering,
        onEntered,
        onExiting,
        onExited,
      };

      manager.register(subsystem);

      const mockControl = { flow: { entered: false, entering: true } };

      manager.notify('entering', mockControl as any);
      expect(onEntering).toHaveBeenCalledWith(mockControl);

      manager.notify('entered', mockControl as any);
      expect(onEntered).toHaveBeenCalledWith(mockControl);

      manager.notify('exiting', mockControl as any);
      expect(onExiting).toHaveBeenCalledWith(mockControl);

      manager.notify('exited', mockControl as any);
      expect(onExited).toHaveBeenCalledWith(mockControl);
    });
  });

  describe('Animation Subsystems', () => {
    it('should create fade subsystem with correct behavior', () => {
      const element = {
        style: {},
      } as any;
      const subsystem = createFadeSubsystem(element);

      expect(subsystem.name).toBe('fade');

      subsystem.onEntering?.({} as any);
      expect(element.style.opacity).toBe('0');

      subsystem.onEntered?.({} as any);
      expect(element.style.opacity).toBe('1');

      subsystem.onExiting?.({} as any);
      expect(element.style.opacity).toBe('0');

      subsystem.onExited?.({} as any);
      expect(element.style.opacity).toBe('0');
    });

    it('should create scale subsystem with custom values', () => {
      const element = {
        style: {},
      } as any;
      const subsystem = createScaleSubsystem(element, 0.5, 1.2);

      expect(subsystem.name).toBe('scale');

      subsystem.onEntering?.({} as any);
      expect(element.style.transform).toContain('scale(0.5)');

      subsystem.onEntered?.({} as any);
      expect(element.style.transform).toContain('scale(1.2)');
    });

    it('should handle subsystem state transitions', () => {
      const element = {
        style: {},
      } as any;
      const manager = new SubsystemManager();

      const fadeSubsystem = createFadeSubsystem(element);
      const scaleSubsystem = createScaleSubsystem(element);

      manager.register(fadeSubsystem);
      manager.register(scaleSubsystem);

      const mockControl = { flow: { entered: false, entering: true } };

      manager.notify('entering', mockControl as any);
      expect(element.style.opacity).toBe('0');
      expect(element.style.transform).toContain('scale(0.8)');

      manager.notify('entered', mockControl as any);
      expect(element.style.opacity).toBe('1');
      expect(element.style.transform).toContain('scale(1)');
    });
  });

  describe('System Reset', () => {
    it('should reset system to initial state', () => {
      createAnimatorSystem({
        defaultDuration: {
          enter: 500,
          exit: 300,
          stagger: 100,
          delay: 50,
        },
      });

      expect(isAnimatorSystemInitialized()).toBe(true);

      resetAnimatorSystem();

      expect(isAnimatorSystemInitialized()).toBe(false);

      const config = getAnimatorSystemConfig();
      expect(config.defaultDuration.enter).toBe(300);
    });

    it('should allow reconfiguration after reset', () => {
      createAnimatorSystem({
        defaultDuration: {
          enter: 500,
          exit: 300,
          stagger: 100,
          delay: 50,
        },
      });

      resetAnimatorSystem();

      const newConfig = createAnimatorSystem({
        defaultDuration: {
          enter: 400,
          exit: 250,
          stagger: 75,
          delay: 25,
        },
      });

      expect(newConfig.defaultDuration.enter).toBe(400);
      expect(newConfig.defaultDuration.exit).toBe(250);
    });
  });

  describe('Animation Lifecycle', () => {
    beforeEach(() => {
      vi.stubGlobal(
        'requestAnimationFrame',
        vi.fn((cb) => setTimeout(cb, 16))
      );
      vi.stubGlobal('cancelAnimationFrame', vi.fn());
    });

    afterEach(() => {
      vi.unstubAllGlobals();
    });

    it('should support animation pause and resume', () => {
      const config: AnimationConfig = { duration: 1000 };
      const animation = createAnimation(config);

      animation.play();
      expect(animation.isPlaying()).toBe(true);

      animation.pause();
      expect(animation.isPlaying()).toBe(false);

      animation.play();
      expect(animation.isPlaying()).toBe(true);
    });

    it('should reset animation on stop', () => {
      const config: AnimationConfig = { duration: 1000 };
      const animation = createAnimation(config);

      animation.seek(0.5);
      expect(animation.getProgress()).toBeCloseTo(0.5, 1);

      animation.stop();
      expect(animation.isPlaying()).toBe(false);
      expect(animation.getProgress()).toBe(0);
    });

    it('should call callbacks at appropriate times', () => {
      const onStart = vi.fn();
      const onUpdate = vi.fn();
      const onComplete = vi.fn();

      const config: AnimationConfig = {
        duration: 100,
        onStart,
        onUpdate,
        onComplete,
      };

      const animation = createAnimation(config);
      animation.play();

      expect(onStart).toHaveBeenCalled();
    });
  });
});
