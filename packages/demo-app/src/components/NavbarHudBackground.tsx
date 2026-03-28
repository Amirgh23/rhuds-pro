import React, { useEffect, useRef } from 'react';

export const NavbarHudBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = 70;

    let animationId: number;
    let time = 0;

    const drawGrid = () => {
      ctx.fillStyle = 'rgba(10, 18, 37, 0.95)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Gradient overlay
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, 'rgba(41, 242, 223, 0.05)');
      gradient.addColorStop(0.5, 'rgba(10, 18, 37, 0)');
      gradient.addColorStop(1, 'rgba(255, 176, 0, 0.03)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Horizontal scan lines
      ctx.strokeStyle = 'rgba(41, 242, 223, 0.08)';
      ctx.lineWidth = 1;
      for (let y = 0; y < canvas.height; y += 4) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Animated vertical lines
      ctx.strokeStyle = 'rgba(255, 176, 0, 0.1)';
      ctx.lineWidth = 1;
      const spacing = 80;
      const offset = (time * 20) % spacing;
      for (let x = -offset; x < canvas.width; x += spacing) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      // Glitch effect lines
      if (Math.random() > 0.95) {
        ctx.fillStyle = `rgba(255, 176, 0, ${Math.random() * 0.15})`;
        const glitchY = Math.random() * canvas.height;
        const glitchHeight = Math.random() * 3 + 1;
        ctx.fillRect(0, glitchY, canvas.width, glitchHeight);
      }

      // Corner accents
      ctx.strokeStyle = 'rgba(41, 242, 223, 0.3)';
      ctx.lineWidth = 2;
      const cornerSize = 15;

      // Top-left
      ctx.beginPath();
      ctx.moveTo(0, cornerSize);
      ctx.lineTo(0, 0);
      ctx.lineTo(cornerSize, 0);
      ctx.stroke();

      // Top-right
      ctx.beginPath();
      ctx.moveTo(canvas.width - cornerSize, 0);
      ctx.lineTo(canvas.width, 0);
      ctx.lineTo(canvas.width, cornerSize);
      ctx.stroke();

      // Bottom-left
      ctx.beginPath();
      ctx.moveTo(0, canvas.height - cornerSize);
      ctx.lineTo(0, canvas.height);
      ctx.lineTo(cornerSize, canvas.height);
      ctx.stroke();

      // Bottom-right
      ctx.beginPath();
      ctx.moveTo(canvas.width - cornerSize, canvas.height);
      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(canvas.width, canvas.height - cornerSize);
      ctx.stroke();

      time += 0.016;
    };

    const animate = () => {
      drawGrid();
      animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '70px',
        zIndex: 998,
        pointerEvents: 'none',
      }}
    />
  );
};
