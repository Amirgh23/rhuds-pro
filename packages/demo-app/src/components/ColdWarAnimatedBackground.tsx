/**
 * Cold War Animated Background Component
 * Provides tactical military aesthetic with animated elements
 */

import React, { useEffect, useRef } from 'react';
import './ColdWarAnimatedBackground.css';

interface ColdWarAnimatedBackgroundProps {
  variant?: 'perseus' | 'green-terminal' | 'satellite-view';
  intensity?: 'low' | 'medium' | 'high';
}

export const ColdWarAnimatedBackground: React.FC<ColdWarAnimatedBackgroundProps> = ({
  variant = 'perseus',
  intensity = 'medium',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Animation variables
    let animationId: number;
    let time = 0;

    // Get color based on variant
    const getColors = () => {
      switch (variant) {
        case 'green-terminal':
          return {
            primary: '#33ff00',
            secondary: '#66ff33',
            accent: '#00ccff',
          };
        case 'satellite-view':
          return {
            primary: '#00ccff',
            secondary: '#0066cc',
            accent: '#ffb000',
          };
        default: // perseus
          return {
            primary: '#ffb000',
            secondary: '#ffd633',
            accent: '#0066cc',
          };
      }
    };

    const colors = getColors();

    // Get intensity settings
    const getIntensitySettings = () => {
      switch (intensity) {
        case 'low':
          return { gridOpacity: 0.15, scanlineOpacity: 0.08, noiseOpacity: 0.05 };
        case 'high':
          return { gridOpacity: 0.35, scanlineOpacity: 0.2, noiseOpacity: 0.15 };
        default: // medium
          return { gridOpacity: 0.25, scanlineOpacity: 0.12, noiseOpacity: 0.1 };
      }
    };

    const intensitySettings = getIntensitySettings();

    // Draw animated grid
    const drawGrid = () => {
      const gridSize = 40;
      const offset = (time * 20) % gridSize;

      ctx.strokeStyle = colors.primary;
      ctx.globalAlpha = intensitySettings.gridOpacity;
      ctx.lineWidth = 1;

      // Vertical lines
      for (let x = -offset; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Horizontal lines
      for (let y = -offset; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
    };

    // Draw scanlines
    const drawScanlines = () => {
      ctx.strokeStyle = colors.primary;
      ctx.globalAlpha = intensitySettings.scanlineOpacity;
      ctx.lineWidth = 1;

      const scanlineSpacing = 3;
      const offset = (time * 50) % scanlineSpacing;

      for (let y = -offset; y < canvas.height; y += scanlineSpacing) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
    };

    // Draw noise (optimized - only every few frames)
    let noiseCounter = 0;
    const drawNoise = () => {
      noiseCounter++;
      if (noiseCounter % 3 !== 0) return; // Draw noise every 3 frames

      const imageData = ctx.createImageData(canvas.width, canvas.height);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const noise = Math.random() * 255;
        data[i] = noise; // R
        data[i + 1] = noise; // G
        data[i + 2] = noise; // B
        data[i + 3] = intensitySettings.noiseOpacity * 255; // A
      }

      ctx.globalAlpha = 0.5;
      ctx.putImageData(imageData, 0, 0);
      ctx.globalAlpha = 1;
    };

    // Draw animated corner markers
    const drawCornerMarkers = () => {
      const markerSize = 30;
      const markerWidth = 2;
      const pulse = Math.sin(time * 3) * 0.5 + 0.5;

      ctx.strokeStyle = colors.secondary;
      ctx.globalAlpha = 0.6 + pulse * 0.4;
      ctx.lineWidth = markerWidth;

      // Top-left
      ctx.beginPath();
      ctx.moveTo(20, 20);
      ctx.lineTo(20 + markerSize, 20);
      ctx.moveTo(20, 20);
      ctx.lineTo(20, 20 + markerSize);
      ctx.stroke();

      // Top-right
      ctx.beginPath();
      ctx.moveTo(canvas.width - 20, 20);
      ctx.lineTo(canvas.width - 20 - markerSize, 20);
      ctx.moveTo(canvas.width - 20, 20);
      ctx.lineTo(canvas.width - 20, 20 + markerSize);
      ctx.stroke();

      // Bottom-left
      ctx.beginPath();
      ctx.moveTo(20, canvas.height - 20);
      ctx.lineTo(20 + markerSize, canvas.height - 20);
      ctx.moveTo(20, canvas.height - 20);
      ctx.lineTo(20, canvas.height - 20 - markerSize);
      ctx.stroke();

      // Bottom-right
      ctx.beginPath();
      ctx.moveTo(canvas.width - 20, canvas.height - 20);
      ctx.lineTo(canvas.width - 20 - markerSize, canvas.height - 20);
      ctx.moveTo(canvas.width - 20, canvas.height - 20);
      ctx.lineTo(canvas.width - 20, canvas.height - 20 - markerSize);
      ctx.stroke();

      ctx.globalAlpha = 1;
    };

    // Draw animated radar circles
    const drawRadarCircles = () => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const maxRadius = Math.min(canvas.width, canvas.height) / 4;

      ctx.strokeStyle = colors.accent;
      ctx.globalAlpha = 0.3;
      ctx.lineWidth = 1;

      const radarOffset = (time * 30) % maxRadius;

      for (let r = radarOffset; r < maxRadius; r += 40) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Radar lines
      ctx.globalAlpha = 0.2;
      for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 4) {
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(
          centerX + Math.cos(angle + time) * maxRadius,
          centerY + Math.sin(angle + time) * maxRadius
        );
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
    };

    // Animation loop
    const animate = () => {
      // Clear canvas with semi-transparent background for trail effect
      ctx.fillStyle = 'rgba(10, 10, 12, 0.95)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw background elements
      drawGrid();
      drawScanlines();
      drawNoise();
      drawCornerMarkers();
      drawRadarCircles();

      time += 0.016; // ~60fps
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [variant, intensity]);

  return (
    <canvas
      ref={canvasRef}
      className="cold-war-animated-background"
      data-variant={variant}
      data-intensity={intensity}
    />
  );
};

export default ColdWarAnimatedBackground;
