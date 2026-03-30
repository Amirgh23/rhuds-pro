/**
 * Glow Effects
 * RHUDS glow and neon pulse effects
 */

export interface GlowConfig {
  color: string;
  blur: number;
  spread: number;
  opacity: number;
}

export const applyGlowEffect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  config: GlowConfig
): void => {
  ctx.save();

  // Create glow effect using multiple circles with decreasing opacity
  for (let i = 0; i < 3; i++) {
    ctx.globalAlpha = config.opacity * (1 - i / 3);
    ctx.fillStyle = config.color;
    ctx.beginPath();
    ctx.arc(x, y, radius + i * config.blur, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
};

export const applyNeonPulseEffect = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number,
  config: GlowConfig,
  progress: number
): void => {
  ctx.save();

  // Pulse effect based on animation progress
  const pulseRadius = radius * (1 + Math.sin(progress * Math.PI * 2) * 0.2);
  const pulseOpacity = config.opacity * (0.5 + Math.sin(progress * Math.PI * 2) * 0.5);

  ctx.globalAlpha = pulseOpacity;
  ctx.fillStyle = config.color;
  ctx.beginPath();
  ctx.arc(x, y, pulseRadius, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
};

export const applyScanlineEffect = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  config: { color: string; spacing: number; opacity: number }
): void => {
  ctx.save();

  ctx.strokeStyle = config.color;
  ctx.globalAlpha = config.opacity;
  ctx.lineWidth = 1;

  for (let y = 0; y < height; y += config.spacing) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  ctx.restore();
};

export default {
  applyGlowEffect,
  applyNeonPulseEffect,
  applyScanlineEffect,
};
