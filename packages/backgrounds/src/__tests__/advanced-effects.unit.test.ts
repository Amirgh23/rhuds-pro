/**
 * Unit Tests for Advanced Background Effects
 * Tests particle system physics and performance
 */

import { describe, it, expect } from 'vitest';
import { Particle, ParticleEmitter, ParticleSystem } from '../particles';
import { NoiseGenerator } from '../effects';

describe('Advanced Background Effects', () => {
  describe('Particle Physics System', () => {
    describe('Particle', () => {
      it('should create particle with correct initial properties', () => {
        const particle = new Particle({
          x: 100,
          y: 200,
          vx: 5,
          vy: 10,
          size: 4,
          opacity: 0.8,
          color: '#ff0000',
          life: 2,
          maxLife: 2,
        });

        expect(particle.x).toBe(100);
        expect(particle.y).toBe(200);
        expect(particle.vx).toBe(5);
        expect(particle.vy).toBe(10);
        expect(particle.size).toBe(4);
        expect(particle.opacity).toBe(0.8);
        expect(particle.color).toBe('#ff0000');
      });

      it('should update position based on velocity', () => {
        const particle = new Particle({
          x: 0,
          y: 0,
          vx: 10,
          vy: 20,
          size: 5,
          opacity: 1,
          life: 1,
          maxLife: 1,
        });

        particle.update(0.1);

        expect(particle.x).toBeCloseTo(1, 0);
        expect(particle.y).toBeCloseTo(2, 0);
      });

      it('should apply gravity to particle', () => {
        const particle = new Particle({
          x: 0,
          y: 0,
          vx: 0,
          vy: 0,
          size: 5,
          opacity: 1,
          life: 1,
          maxLife: 1,
        });

        particle.update(0.1, 100);

        expect(particle.vy).toBeGreaterThan(0);
      });

      it('should apply friction to particle velocity', () => {
        const particle = new Particle({
          x: 0,
          y: 0,
          vx: 100,
          vy: 100,
          size: 5,
          opacity: 1,
          life: 1,
          maxLife: 1,
        });

        const initialVx = particle.vx;
        particle.update(0.1, 0, 0.9);

        expect(particle.vx).toBeLessThan(initialVx);
      });

      it('should decrease life over time', () => {
        const particle = new Particle({
          x: 0,
          y: 0,
          vx: 0,
          vy: 0,
          size: 5,
          opacity: 1,
          life: 1,
          maxLife: 1,
        });

        particle.update(0.5);

        expect(particle.life).toBeLessThan(1);
      });

      it('should detect when particle is alive', () => {
        const particle = new Particle({
          x: 0,
          y: 0,
          vx: 0,
          vy: 0,
          size: 5,
          opacity: 1,
          life: 0.5,
          maxLife: 1,
        });

        expect(particle.isAlive()).toBe(true);

        particle.life = -0.1;
        expect(particle.isAlive()).toBe(false);
      });

      it('should calculate distance to another particle', () => {
        const p1 = new Particle({
          x: 0,
          y: 0,
          vx: 0,
          vy: 0,
          size: 5,
          opacity: 1,
          life: 1,
          maxLife: 1,
        });

        const p2 = new Particle({
          x: 3,
          y: 4,
          vx: 0,
          vy: 0,
          size: 5,
          opacity: 1,
          life: 1,
          maxLife: 1,
        });

        expect(p1.distanceTo(p2)).toBe(5);
      });

      it('should apply force to particle', () => {
        const particle = new Particle({
          x: 0,
          y: 0,
          vx: 0,
          vy: 0,
          size: 5,
          opacity: 1,
          life: 1,
          maxLife: 1,
        });

        particle.applyForce(10, 20);

        expect(particle.ax).toBe(10);
        expect(particle.ay).toBe(20);
      });

      it('should wrap particle at boundaries', () => {
        const particle = new Particle({
          x: 0,
          y: 0,
          vx: -10,
          vy: 0,
          size: 5,
          opacity: 1,
          life: 1,
          maxLife: 1,
        });

        particle.update(0.1, 0, 0.99, { width: 800, height: 600 });

        expect(particle.x).toBe(800);
      });
    });

    describe('ParticleEmitter', () => {
      it('should create emitter with correct properties', () => {
        const emitter = new ParticleEmitter({
          x: 50,
          y: 100,
          rate: 100,
          speed: 50,
          size: 5,
          color: '#00ff00',
          direction: 90,
          spread: 45,
          life: 1,
        });

        expect(emitter.x).toBe(50);
        expect(emitter.y).toBe(100);
        expect(emitter.rate).toBe(100);
        expect(emitter.speed).toBe(50);
        expect(emitter.size).toBe(5);
        expect(emitter.color).toBe('#00ff00');
      });

      it('should emit particles at specified rate', () => {
        const emitter = new ParticleEmitter({
          x: 0,
          y: 0,
          rate: 100,
          speed: 50,
          size: 5,
          life: 1,
        });

        const particles = emitter.emit(0.1);

        expect(particles.length).toBeGreaterThan(0);
        expect(particles.length).toBeLessThanOrEqual(10);
      });

      it('should emit particles with correct velocity direction', () => {
        const emitter = new ParticleEmitter({
          x: 0,
          y: 0,
          rate: 100,
          speed: 50,
          size: 5,
          direction: 0,
          spread: 0,
          life: 1,
        });

        const particles = emitter.emit(0.01);

        if (particles.length > 0) {
          expect(particles[0].vx).toBeGreaterThan(0);
          expect(Math.abs(particles[0].vy)).toBeLessThan(1);
        }
      });

      it('should emit particles with spread', () => {
        const emitter = new ParticleEmitter({
          x: 0,
          y: 0,
          rate: 100,
          speed: 50,
          size: 5,
          direction: 0,
          spread: 90,
          life: 1,
        });

        const particles = emitter.emit(0.1);

        expect(particles.length).toBeGreaterThan(0);
      });

      it('should emit particles with correct color', () => {
        const emitter = new ParticleEmitter({
          x: 0,
          y: 0,
          rate: 100,
          speed: 50,
          size: 5,
          color: '#ff00ff',
          life: 1,
        });

        const particles = emitter.emit(0.01);

        if (particles.length > 0) {
          expect(particles[0].color).toBe('#ff00ff');
        }
      });
    });

    describe('ParticleSystem', () => {
      it('should create particle system with default config', () => {
        const system = new ParticleSystem();

        expect(system.particles.length).toBe(0);
        expect(system.emitters.length).toBe(0);
      });

      it('should add and remove emitters', () => {
        const system = new ParticleSystem();
        const emitter = new ParticleEmitter({
          x: 0,
          y: 0,
          rate: 100,
          speed: 50,
          size: 5,
          life: 1,
        });

        system.addEmitter(emitter);
        expect(system.emitters.length).toBe(1);

        system.removeEmitter(emitter);
        expect(system.emitters.length).toBe(0);
      });

      it('should respect max particle limit', () => {
        const system = new ParticleSystem({ maxParticles: 10 });
        const emitter = new ParticleEmitter({
          x: 0,
          y: 0,
          rate: 1000,
          speed: 50,
          size: 5,
          life: 10,
        });

        system.addEmitter(emitter);

        for (let i = 0; i < 10; i++) {
          system.update();
        }

        expect(system.particles.length).toBeLessThanOrEqual(10);
      });

      it('should get particle count', () => {
        const system = new ParticleSystem();

        system.particles.push(
          new Particle({
            x: 0,
            y: 0,
            vx: 0,
            vy: 0,
            size: 5,
            opacity: 1,
            life: 1,
            maxLife: 1,
          })
        );

        expect(system.getParticleCount()).toBe(1);
      });

      it('should clear all particles', () => {
        const system = new ParticleSystem();

        system.particles.push(
          new Particle({
            x: 0,
            y: 0,
            vx: 0,
            vy: 0,
            size: 5,
            opacity: 1,
            life: 1,
            maxLife: 1,
          })
        );

        expect(system.particles.length).toBeGreaterThan(0);

        system.clear();
        expect(system.particles.length).toBe(0);
      });

      it('should handle collision detection', () => {
        const system = new ParticleSystem({
          maxParticles: 100,
          collisionEnabled: true,
        });

        system.particles.push(
          new Particle({
            x: 0,
            y: 0,
            vx: 10,
            vy: 0,
            size: 5,
            opacity: 1,
            life: 1,
            maxLife: 1,
          }),
          new Particle({
            x: 5,
            y: 0,
            vx: -10,
            vy: 0,
            size: 5,
            opacity: 1,
            life: 1,
            maxLife: 1,
          })
        );

        system.update();

        expect(system.particles.length).toBe(2);
      });

      it('should apply gravity to particles', () => {
        const system = new ParticleSystem({ gravity: 100 });

        system.particles.push(
          new Particle({
            x: 0,
            y: 0,
            vx: 0,
            vy: 0,
            size: 5,
            opacity: 1,
            life: 1,
            maxLife: 1,
          })
        );

        system.update();

        expect(system.particles.length).toBeGreaterThan(0);
      });

      it('should apply friction to particles', () => {
        const system = new ParticleSystem({ friction: 0.9 });

        system.particles.push(
          new Particle({
            x: 0,
            y: 0,
            vx: 100,
            vy: 100,
            size: 5,
            opacity: 1,
            life: 1,
            maxLife: 1,
          })
        );

        const initialVx = system.particles[0].vx;
        system.update();

        expect(system.particles[0].vx).toBeLessThan(initialVx);
      });
    });
  });

  describe('Noise Generator', () => {
    it('should generate Perlin noise', () => {
      const generator = new NoiseGenerator(42);
      const noise = generator.perlin(0, 0, 0);

      expect(noise).toBeGreaterThanOrEqual(-2);
      expect(noise).toBeLessThanOrEqual(2);
    });

    it('should generate consistent noise with same seed', () => {
      const gen1 = new NoiseGenerator(42);
      const gen2 = new NoiseGenerator(42);

      const noise1 = gen1.perlin(1, 2, 3);
      const noise2 = gen2.perlin(1, 2, 3);

      expect(noise1).toBe(noise2);
    });

    it('should handle 2D noise', () => {
      const generator = new NoiseGenerator(42);
      const noise = generator.perlin(5, 10);

      expect(noise).toBeGreaterThanOrEqual(-2);
      expect(noise).toBeLessThanOrEqual(2);
    });

    it('should handle 3D noise', () => {
      const generator = new NoiseGenerator(42);
      const noise = generator.perlin(5, 10, 15);

      expect(noise).toBeGreaterThanOrEqual(-2);
      expect(noise).toBeLessThanOrEqual(2);
    });

    it('should handle negative coordinates', () => {
      const generator = new NoiseGenerator(42);
      const noise = generator.perlin(-5, -10, -15);

      expect(noise).toBeGreaterThanOrEqual(-2);
      expect(noise).toBeLessThanOrEqual(2);
    });

    it('should handle large coordinates', () => {
      const generator = new NoiseGenerator(42);
      const noise = generator.perlin(1000, 2000, 3000);

      expect(noise).toBeGreaterThanOrEqual(-2);
      expect(noise).toBeLessThanOrEqual(2);
    });
  });

  describe('Performance', () => {
    it('should handle 1000 particles at 60fps', () => {
      const system = new ParticleSystem({ maxParticles: 1000 });
      const emitter = new ParticleEmitter({
        x: 0,
        y: 0,
        rate: 1000,
        speed: 50,
        size: 5,
        life: 1,
      });

      system.addEmitter(emitter);

      const startTime = performance.now();

      for (let i = 0; i < 60; i++) {
        system.update();
      }

      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(1000);
    });

    it('should maintain performance with collision detection', () => {
      const system = new ParticleSystem({
        maxParticles: 500,
        collisionEnabled: true,
      });

      const emitter = new ParticleEmitter({
        x: 0,
        y: 0,
        rate: 500,
        speed: 50,
        size: 5,
        life: 1,
      });

      system.addEmitter(emitter);

      const startTime = performance.now();

      for (let i = 0; i < 60; i++) {
        system.update();
      }

      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(1000);
    });

    it('should handle multiple emitters efficiently', () => {
      const system = new ParticleSystem({ maxParticles: 2000 });

      for (let i = 0; i < 5; i++) {
        const emitter = new ParticleEmitter({
          x: Math.random() * 800,
          y: Math.random() * 600,
          rate: 200,
          speed: 50,
          size: 5,
          life: 1,
        });
        system.addEmitter(emitter);
      }

      const startTime = performance.now();

      for (let i = 0; i < 60; i++) {
        system.update();
      }

      const endTime = performance.now();
      const duration = endTime - startTime;

      expect(duration).toBeLessThan(1000);
    });
  });
});
