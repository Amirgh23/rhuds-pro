/**
 * Background Effects Tests
 */

import { Particle, ParticleEmitter, ParticleSystem } from '../particles';
import { NebulaEffect, StarFieldEffect, AnimatedGradientEffect, PlasmaEffect, NoiseGenerator } from '../effects';

describe('Particle System', () => {
  describe('Particle', () => {
    it('should create a particle with correct properties', () => {
      const particle = new Particle({
        x: 10,
        y: 20,
        vx: 1,
        vy: 2,
        size: 5,
        opacity: 0.8,
        color: '#ff0000',
        life: 1,
        maxLife: 1,
      });

      expect(particle.x).toBe(10);
      expect(particle.y).toBe(20);
      expect(particle.vx).toBe(1);
      expect(particle.vy).toBe(2);
      expect(particle.size).toBe(5);
      expect(particle.opacity).toBe(0.8);
      expect(particle.color).toBe('#ff0000');
    });

    it('should update particle position based on velocity', () => {
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

      expect(particle.x).toBeCloseTo(1, 1);
      expect(particle.y).toBeCloseTo(2, 1);
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

      particle.update(0.1, 100); // gravity = 100

      expect(particle.vy).toBeGreaterThan(0);
    });

    it('should apply friction to particle', () => {
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
  });

  describe('ParticleEmitter', () => {
    it('should create an emitter with correct properties', () => {
      const emitter = new ParticleEmitter({
        x: 10,
        y: 20,
        rate: 100,
        speed: 50,
        size: 5,
        color: '#ff0000',
        direction: 90,
        spread: 45,
        life: 1,
      });

      expect(emitter.x).toBe(10);
      expect(emitter.y).toBe(20);
      expect(emitter.rate).toBe(100);
      expect(emitter.speed).toBe(50);
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

      const particles = emitter.emit(0.1); // 100 particles/sec * 0.1 sec = 10 particles

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
        direction: 0, // right
        spread: 0,
        life: 1,
      });

      const particles = emitter.emit(0.01);

      if (particles.length > 0) {
        expect(particles[0].vx).toBeGreaterThan(0);
        expect(Math.abs(particles[0].vy)).toBeLessThan(1);
      }
    });
  });

  describe('ParticleSystem', () => {
    it('should create a particle system with default config', () => {
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

    it('should update particles', () => {
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
      system.update();

      expect(system.particles.length).toBeGreaterThan(0);
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

    it('should clear all particles', () => {
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
      system.update();

      expect(system.particles.length).toBeGreaterThan(0);

      system.clear();
      expect(system.particles.length).toBe(0);
    });

    it('should get particle count', () => {
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
      system.update();

      expect(system.getParticleCount()).toBe(system.particles.length);
    });
  });
});

describe('Effects', () => {
  describe('NoiseGenerator', () => {
    it('should generate Perlin noise', () => {
      const generator = new NoiseGenerator(42);
      const noise = generator.perlin(0, 0, 0);

      expect(noise).toBeGreaterThanOrEqual(-1);
      expect(noise).toBeLessThanOrEqual(1);
    });

    it('should generate consistent noise with same seed', () => {
      const gen1 = new NoiseGenerator(42);
      const gen2 = new NoiseGenerator(42);

      const noise1 = gen1.perlin(1, 2, 3);
      const noise2 = gen2.perlin(1, 2, 3);

      expect(noise1).toBe(noise2);
    });

    it('should generate different noise with different seeds', () => {
      const gen1 = new NoiseGenerator(42);
      const gen2 = new NoiseGenerator(43);

      const noise1 = gen1.perlin(1, 2, 3);
      const noise2 = gen2.perlin(1, 2, 3);

      expect(noise1).not.toBe(noise2);
    });
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

    // Should complete 60 frames in less than 1 second (1000ms)
    expect(duration).toBeLessThan(1000);
  });

  it('should maintain 60fps with collision detection', () => {
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

    // Should complete 60 frames in less than 1 second
    expect(duration).toBeLessThan(1000);
  });
});
