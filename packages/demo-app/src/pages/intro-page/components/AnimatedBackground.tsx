/**
 * AnimatedBackground Component
 *
 * Canvas-based particle animation system for the intro page background.
 * Features:
 * - Responsive particle count (20-30 mobile, 80-100 desktop)
 * - Opacity control (0.1-0.3 range)
 * - requestAnimationFrame loop for smooth animation
 * - GPU acceleration with will-change
 * - Non-blocking animation that doesn't interfere with user interaction
 * - Performance monitoring with frame rate tracking
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import type { AnimatedBackgroundProps } from '../types';
import { BACKGROUND_CONFIG, BREAKPOINTS, COLOR_PALETTE, Z_INDEX } from '../constants';
import { useFrameRateMonitor } from '../hooks/useFrameRateMonitor';

/**
 * Particle interface for animation
 */
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  opacity: number;
}

/**
 * Grid configuration
 */
interface GridConfig {
  cellSize: number;
  color: string;
  opacity: number;
  strokeWidth: number;
}

/**
 * AnimatedBackground Component
 *
 * Renders a Canvas-based particle animation system behind all page content.
 * Particles move smoothly with physics simulation and fade in/out for visual interest.
 *
 * Props:
 * - type: Animation type ('particles', 'grid', or 'hybrid', default: 'particles')
 * - opacity: Background opacity (0.1-0.3, default: 0.15)
 * - color: Particle color (default: cyan)
 * - particleCount: Number of particles (auto-responsive if not specified)
 * - animationSpeed: Animation speed multiplier (0.5-2.0, default: 1.0)
 */
export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  type = 'particles',
  opacity = BACKGROUND_CONFIG.defaultOpacity,
  color = COLOR_PALETTE.primary,
  particleCount,
  animationSpeed = BACKGROUND_CONFIG.defaultSpeed,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  useFrameRateMonitor({ enabled: true });
  const timeRef = useRef(0);

  // Grid configuration
  const gridConfig: GridConfig = {
    cellSize: 50,
    color: '#FFD700', // GOLD - Grid lines
    opacity: 0.8,
    strokeWidth: 2,
  };

  // Clamp opacity to valid range
  const clampedOpacity = Math.max(
    BACKGROUND_CONFIG.minOpacity,
    Math.min(BACKGROUND_CONFIG.maxOpacity, opacity)
  );

  // Clamp animation speed to valid range
  const clampedSpeed = Math.max(
    BACKGROUND_CONFIG.minSpeed,
    Math.min(BACKGROUND_CONFIG.maxSpeed, animationSpeed)
  );

  /**
   * Get responsive particle count based on viewport width
   */
  const getResponsiveParticleCount = useCallback((): number => {
    if (particleCount !== undefined) {
      return particleCount;
    }

    const width = window.innerWidth;

    if (width < BREAKPOINTS.tablet) {
      return BACKGROUND_CONFIG.particleCountMobile;
    } else if (width < BREAKPOINTS.desktop) {
      return BACKGROUND_CONFIG.particleCountTablet;
    } else {
      return BACKGROUND_CONFIG.particleCountDesktop;
    }
  }, [particleCount]);

  /**
   * Initialize particles with random positions and velocities
   */
  const initializeParticles = useCallback(
    (canvas: HTMLCanvasElement): void => {
      const count = getResponsiveParticleCount();
      const particles: Particle[] = [];

      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5 * clampedSpeed,
          vy: (Math.random() - 0.5) * 0.5 * clampedSpeed,
          radius: Math.random() * 1.5 + 0.5,
          opacity: Math.random() * 0.5 + 0.3,
        });
      }

      particlesRef.current = particles;
    },
    [getResponsiveParticleCount, clampedSpeed]
  );

  /**
   * Update particle positions and handle boundary wrapping
   */
  const updateParticles = useCallback((canvas: HTMLCanvasElement): void => {
    const particles = particlesRef.current;

    particles.forEach((particle) => {
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Wrap around edges
      if (particle.x < 0) particle.x = canvas.width;
      if (particle.x > canvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = canvas.height;
      if (particle.y > canvas.height) particle.y = 0;

      // Gently oscillate opacity for visual interest
      particle.opacity += (Math.random() - 0.5) * 0.02;
      particle.opacity = Math.max(0.1, Math.min(0.8, particle.opacity));
    });
  }, []);

  /**
   * Render grid lines with glow effect
   */
  const renderGrid = useCallback(
    (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): void => {
      const { cellSize, color, opacity: gridOpacity, strokeWidth } = gridConfig;

      // Save context state
      ctx.save();

      // Set line style
      ctx.strokeStyle = color;
      ctx.lineWidth = strokeWidth;
      ctx.globalAlpha = gridOpacity;
      ctx.shadowColor = color;
      ctx.shadowBlur = 8;

      // Draw vertical lines
      for (let x = 0; x <= canvas.width; x += cellSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Draw horizontal lines
      for (let y = 0; y <= canvas.height; y += cellSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw radial glow effect across full width - STRONG
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const maxRadius = Math.sqrt(centerX * centerX + centerY * centerY) * 2;

      const radialGradient = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        maxRadius
      );
      radialGradient.addColorStop(0, `rgba(255, 215, 0, 0.9)`); // GOLD
      radialGradient.addColorStop(0.3, `rgba(255, 215, 0, 0.6)`);
      radialGradient.addColorStop(0.7, `rgba(255, 215, 0, 0.2)`);
      radialGradient.addColorStop(1, `rgba(255, 215, 0, 0)`);

      ctx.globalAlpha = 1;
      ctx.fillStyle = radialGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw intersection points with glow
      ctx.globalAlpha = gridOpacity * 1.2;
      ctx.fillStyle = color;
      ctx.shadowBlur = 12;
      for (let x = 0; x <= canvas.width; x += cellSize) {
        for (let y = 0; y <= canvas.height; y += cellSize) {
          const pulse = Math.sin(timeRef.current * 0.02 + x * 0.001 + y * 0.001) * 0.5 + 0.5;
          const size = 2 + pulse * 2;

          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Restore context state
      ctx.restore();
    },
    [gridConfig]
  );

  /**
   * Render particles to canvas
   */
  const renderParticles = useCallback(
    (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): void => {
      // Draw particles
      const particles = particlesRef.current;
      particles.forEach((particle) => {
        ctx.fillStyle = `rgba(0, 255, 0, ${particle.opacity * clampedOpacity * 0.3})`; // GREEN - Particles
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fill();
      });
    },
    [clampedOpacity]
  );

  /**
   * Animation loop using requestAnimationFrame
   */
  const animate = useCallback((): void => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas completely
    ctx.fillStyle = 'rgba(0, 0, 0, 1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Update and render
    updateParticles(canvas);
    renderGrid(canvas, ctx);
    renderParticles(canvas, ctx);

    timeRef.current += 1;

    // Schedule next frame
    animationFrameRef.current = requestAnimationFrame(animate);
  }, [updateParticles, renderParticles, renderGrid]);

  /**
   * Handle canvas resize
   */
  const handleResize = useCallback((): void => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Reinitialize particles on resize
    initializeParticles(canvas);
  }, [initializeParticles]);

  /**
   * Initialize canvas and start animation
   */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set initial canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Initialize particles
    initializeParticles(canvas);
    setIsInitialized(true);

    // Start animation loop
    animationFrameRef.current = requestAnimationFrame(animate);

    // Add resize listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [animate, initializeParticles, handleResize]);

  /**
   * Handle responsive particle count changes
   */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isInitialized) return;

    const newCount = getResponsiveParticleCount();
    const currentCount = particlesRef.current.length;

    if (newCount !== currentCount) {
      initializeParticles(canvas);
    }
  }, [getResponsiveParticleCount, isInitialized, initializeParticles]);

  return (
    <canvas
      ref={canvasRef}
      className="animated-background__canvas"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: Z_INDEX.background,
        willChange: 'transform',
        display: 'block',
      }}
      aria-hidden="true"
      data-testid="animated-background-canvas"
    />
  );
};

export default AnimatedBackground;
