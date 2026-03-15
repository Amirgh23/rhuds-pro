'use client';

import { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [bootComplete, setBootComplete] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [glitchActive, setGlitchActive] = useState(false);
  const [time, setTime] = useState(new Date());
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Professional loader animation
  useEffect(() => {
    const duration = 1000; // 1 second total
    const interval = duration / 20;

    let progress = 0;
    const progressTimer = setInterval(() => {
      progress++;
      setLoadingText(`${Math.min(progress * 5, 100)}%`);

      if (progress >= 20) {
        clearInterval(progressTimer);
        setGlitchActive(true);
        setTimeout(() => setBootComplete(true), 150);
      }
    }, interval);

    return () => clearInterval(progressTimer);
  }, []);

  // Background canvas animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let rotation = 0;
    let pulsePhase = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(canvas.width, canvas.height) * 0.25;

      ctx.strokeStyle = 'rgba(255, 215, 0, 0.15)'; // YELLOW - Canvas Background
      ctx.lineWidth = 0.5;

      for (let lat = -80; lat <= 80; lat += 20) {
        const latRad = (lat * Math.PI) / 180;
        const y = centerY + radius * Math.sin(latRad) * 0.5;
        const r = radius * Math.cos(latRad);
        ctx.beginPath();
        for (let lng = 0; lng <= 360; lng += 5) {
          const lngRad = ((lng + rotation) * Math.PI) / 180;
          const x = centerX + r * Math.sin(lngRad);
          const z = r * Math.cos(lngRad);
          if (lng === 0) ctx.moveTo(x, y + z * 0.3);
          else ctx.lineTo(x, y + z * 0.3);
        }
        ctx.closePath();
        ctx.stroke();
      }

      for (let lng = 0; lng < 360; lng += 30) {
        const lngRad = ((lng + rotation) * Math.PI) / 180;
        ctx.beginPath();
        for (let lat = -90; lat <= 90; lat += 5) {
          const latRad = (lat * Math.PI) / 180;
          const x = centerX + radius * Math.cos(latRad) * Math.sin(lngRad);
          const y = centerY + radius * Math.sin(latRad) * 0.5;
          const z = radius * Math.cos(latRad) * Math.cos(lngRad);
          if (lat === -90) ctx.moveTo(x, y + z * 0.3);
          else ctx.lineTo(x, y + z * 0.3);
        }
        ctx.stroke();
      }

      const pulse = Math.sin(pulsePhase) * 0.3 + 0.7;
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);
      gradient.addColorStop(0, `rgba(255, 215, 0, ${0.08 * pulse})`); // YELLOW - Canvas Background
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      rotation += 0.15;
      pulsePhase += 0.05;
      animationId = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const hexCodesLeft = Array.from(
    { length: 20 },
    () =>
      `0x${Math.floor(Math.random() * 65535)
        .toString(16)
        .toUpperCase()
        .padStart(4, '0')}`
  );
  const hexCodesRight = Array.from(
    { length: 20 },
    () =>
      `0x${Math.floor(Math.random() * 65535)
        .toString(16)
        .toUpperCase()
        .padStart(4, '0')}`
  );

  // Creative Loader Screen - Professional Design
  if (!bootComplete) {
    return (
      <main
        className="min-h-screen flex items-center justify-center relative overflow-hidden"
        style={{ background: '#0A1225' }}
      >
        <canvas ref={canvasRef} className="fixed inset-0 z-0" style={{ opacity: 0.6 }} />
        <div
          className="fixed inset-0 z-10 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at center, transparent 0%, rgba(10, 18, 37, 0.9) 100%)',
          }}
        />

        <div
          className={`relative z-20 flex flex-col items-center justify-center ${glitchActive ? 'animate-pulse' : ''}`}
        >
          {/* Professional Circular Loader */}
          <div className="relative w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52">
            {/* Outer ring with gradient */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
              <defs>
                <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#29F2DF" />
                  <stop offset="50%" stopColor="#EF3EF1" />
                  <stop offset="100%" stopColor="#1C7FA6" />
                </linearGradient>
              </defs>
              {/* Background circle */}
              <circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke="rgba(40, 18, 90, 0.5)"
                strokeWidth="2"
              />
              {/* Animated progress circle */}
              <circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke="url(#gradient1)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={glitchActive ? 565 : `${parseInt(loadingText) * 5.65} 565`}
                transform="rotate(-90 100 100)"
                style={{
                  filter: 'drop-shadow(0 0 10px #29F2DF)',
                  transition: 'stroke-dasharray 0.1s ease-out',
                }}
              />
            </svg>

            {/* Inner rotating tech ring */}
            <div
              className="absolute inset-4 sm:inset-5 md:inset-6 animate-spin"
              style={{ animationDuration: '3s' }}
            >
              <svg className="w-full h-full" viewBox="0 0 160 160">
                {[...Array(12)].map((_, i) => (
                  <g key={i} transform={`rotate(${i * 30} 80 80)`}>
                    <line
                      x1="80"
                      y1="10"
                      x2="80"
                      y2="20"
                      stroke="#29F2DF"
                      strokeWidth="2"
                      opacity={0.3 + (i % 3) * 0.2}
                      style={{ filter: 'drop-shadow(0 0 3px #29F2DF)' }}
                    />
                  </g>
                ))}
              </svg>
            </div>

            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {/* Percentage display */}
              <div
                className="font-orbitron text-3xl sm:text-4xl md:text-5xl font-bold"
                style={{
                  background: 'linear-gradient(135deg, #29F2DF, #EF3EF1)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(0 0 20px rgba(41, 242, 223, 0.5))',
                }}
              >
                {loadingText}
              </div>

              {/* Status text */}
              <div
                className="font-rajdhani text-xs sm:text-sm tracking-[0.3em] mt-2 uppercase"
                style={{ color: '#1C7FA6', textShadow: '0 0 10px rgba(28, 127, 166, 0.5)' }}
              >
                {glitchActive ? 'SYSTEM READY' : 'INITIALIZING'}
              </div>
            </div>

            {/* Corner indicators */}
            <div
              className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2"
              style={{ borderColor: '#29F2DF' }}
            />
            <div
              className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2"
              style={{ borderColor: '#EF3EF1' }}
            />
            <div
              className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2"
              style={{ borderColor: '#1C7FA6' }}
            />
            <div
              className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2"
              style={{ borderColor: '#29F2DF' }}
            />
          </div>

          {/* Title below loader */}
          <div className="mt-6 sm:mt-8 text-center">
            <h1
              className="font-orbitron text-lg sm:text-xl md:text-2xl tracking-[0.2em] font-bold"
              style={{
                background: 'linear-gradient(135deg, #29F2DF 0%, #1C7FA6 50%, #EF3EF1 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0 0 15px rgba(41, 242, 223, 0.3))',
              }}
            >
              NEXUS TERMINAL
            </h1>
            <div
              className="font-rajdhani text-xs sm:text-sm mt-2 tracking-[0.2em] uppercase"
              style={{ color: '#29F2DF', textShadow: '0 0 10px rgba(41, 242, 223, 0.3)' }}
            >
              Secure Access Interface v3.7.1
            </div>
          </div>

          {/* Data stream lines */}
          <div className="flex gap-3 mt-6 sm:mt-8">
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="w-1 rounded-full animate-pulse"
                style={{
                  height: `${12 + (i % 3) * 8}px`,
                  background: i % 2 === 0 ? '#29F2DF' : '#EF3EF1',
                  boxShadow: i % 2 === 0 ? '0 0 8px #29F2DF' : '0 0 8px #EF3EF1',
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: '0.5s',
                }}
              />
            ))}
          </div>

          {/* Corner decorations */}
          <div
            className="fixed top-4 left-4 w-12 h-12 border-l-2 border-t-2 opacity-40"
            style={{ borderColor: '#29F2DF' }}
          />
          <div
            className="fixed top-4 right-4 w-12 h-12 border-r-2 border-t-2 opacity-40"
            style={{ borderColor: '#EF3EF1' }}
          />
          <div
            className="fixed bottom-4 left-4 w-12 h-12 border-l-2 border-b-2 opacity-40"
            style={{ borderColor: '#1C7FA6' }}
          />
          <div
            className="fixed bottom-4 right-4 w-12 h-12 border-r-2 border-b-2 opacity-40"
            style={{ borderColor: '#29F2DF' }}
          />

          {/* Scanning line */}
          <div
            className="fixed left-0 right-0 h-px z-30 animate-scan-line"
            style={{
              background:
                'linear-gradient(90deg, transparent 0%, rgba(41, 242, 223, 0.5) 50%, transparent 100%)',
              boxShadow: '0 0 15px rgba(41, 242, 223, 0.4)',
            }}
          />
        </div>
      </main>
    );
  }

  // Main interface after boot
  return (
    <main className="min-h-screen relative overflow-hidden" style={{ background: '#0A1225' }}>
      {/* Canvas Background */}
      <canvas ref={canvasRef} className="fixed inset-0 z-0" style={{ opacity: 0.8 }} />

      {/* Gradient Overlays */}
      <div
        className="fixed inset-0 z-10 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse at 50% 0%, rgba(40, 18, 90, 0.5) 0%, transparent 50%),
            radial-gradient(ellipse at 0% 50%, rgba(28, 127, 166, 0.3) 0%, transparent 40%),
            radial-gradient(ellipse at 100% 50%, rgba(239, 62, 241, 0.2) 0%, transparent 40%),
            radial-gradient(ellipse at 50% 100%, rgba(40, 18, 90, 0.4) 0%, transparent 50%)
          `,
        }}
      />

      {/* Vignette */}
      <div
        className="fixed inset-0 z-15 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 30%, rgba(10, 18, 37, 0.7) 100%)',
        }}
      />

      {/* Hex Code Streams - Hidden on mobile - GREEN */}
      <div className="hidden lg:block fixed top-0 bottom-0 left-4 w-16 xl:w-20 overflow-hidden z-20 pointer-events-none opacity-30">
        <div className="animate-hex-scroll" style={{ animationDuration: '25s' }}>
          {[...hexCodesLeft, ...hexCodesLeft].map((code, i) => (
            <div
              key={i}
              className="font-orbitron text-xs my-1"
              style={{
                color: '#00FF00',
                textShadow: '0 0 5px #00FF00',
              }}
            >
              {code}
            </div>
          ))}
        </div>
      </div>

      <div className="hidden lg:block fixed top-0 bottom-0 right-4 w-16 xl:w-20 overflow-hidden z-20 pointer-events-none opacity-30 text-right">
        <div className="animate-hex-scroll" style={{ animationDuration: '30s' }}>
          {[...hexCodesRight, ...hexCodesRight].map((code, i) => (
            <div
              key={i}
              className="font-orbitron text-xs my-1"
              style={{
                color: '#00FF00',
                textShadow: '0 0 5px #00FF00',
              }}
            >
              {code}
            </div>
          ))}
        </div>
      </div>

      {/* Scanning line - GOLD */}
      <div
        className="fixed left-0 right-0 h-px z-25 pointer-events-none animate-scan-line"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(255, 215, 0, 0.5) 50%, transparent 100%)',
          boxShadow: '0 0 20px rgba(255, 215, 0, 0.5)',
        }}
      />

      {/* Corner Frames - Responsive - YELLOW */}
      <div className="fixed top-0 left-0 w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 pointer-events-none z-30">
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20">
          <div
            className="absolute top-0 left-0 w-full h-px"
            style={{
              background: 'linear-gradient(90deg, #FFD700, transparent)',
              boxShadow: '0 0 10px #FFD700',
            }}
          />
          <div
            className="absolute top-0 left-0 w-px h-full"
            style={{
              background: 'linear-gradient(180deg, #FFD700, transparent)',
              boxShadow: '0 0 10px #FFD700',
            }}
          />
          <div
            className="absolute top-0 left-0 w-3 h-3 sm:w-4 sm:h-4 border-t-2 border-l-2"
            style={{ borderColor: '#FFD700' }}
          />
        </div>
      </div>
      <div className="fixed top-0 right-0 w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 pointer-events-none z-30">
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20">
          <div
            className="absolute top-0 right-0 w-full h-px"
            style={{
              background: 'linear-gradient(270deg, #FFD700, transparent)',
              boxShadow: '0 0 10px #FFD700',
            }}
          />
          <div
            className="absolute top-0 right-0 w-px h-full"
            style={{
              background: 'linear-gradient(180deg, #FFD700, transparent)',
              boxShadow: '0 0 10px #FFD700',
            }}
          />
          <div
            className="absolute top-0 right-0 w-3 h-3 sm:w-4 sm:h-4 border-t-2 border-r-2"
            style={{ borderColor: '#FFD700' }}
          />
        </div>
      </div>
      <div className="fixed bottom-0 left-0 w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 pointer-events-none z-30">
        <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20">
          <div
            className="absolute bottom-0 left-0 w-full h-px"
            style={{
              background: 'linear-gradient(90deg, #FFD700, transparent)',
              boxShadow: '0 0 10px #FFD700',
            }}
          />
          <div
            className="absolute bottom-0 left-0 w-px h-full"
            style={{
              background: 'linear-gradient(0deg, #FFD700, transparent)',
              boxShadow: '0 0 10px #FFD700',
            }}
          />
          <div
            className="absolute bottom-0 left-0 w-3 h-3 sm:w-4 sm:h-4 border-b-2 border-l-2"
            style={{ borderColor: '#FFD700' }}
          />
        </div>
      </div>
      <div className="fixed bottom-0 right-0 w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 pointer-events-none z-30">
        <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20">
          <div
            className="absolute bottom-0 right-0 w-full h-px"
            style={{
              background: 'linear-gradient(270deg, #FFD700, transparent)',
              boxShadow: '0 0 10px #FFD700',
            }}
          />
          <div
            className="absolute bottom-0 right-0 w-px h-full"
            style={{
              background: 'linear-gradient(0deg, #FFD700, transparent)',
              boxShadow: '0 0 10px #FFD700',
            }}
          />
          <div
            className="absolute bottom-0 right-0 w-3 h-3 sm:w-4 sm:h-4 border-b-2 border-r-2"
            style={{ borderColor: '#FFD700' }}
          />
        </div>
      </div>

      {/* Header - Responsive */}
      <header className="fixed top-0 left-0 right-0 flex items-center justify-between px-3 py-2 sm:px-4 sm:py-3 md:px-6 md:py-4 z-50">
        <div
          className="px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2 rounded"
          style={{
            background: 'rgba(40, 18, 90, 0.4)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(41, 242, 223, 0.3)',
          }}
        >
          <div
            className="font-orbitron text-xs sm:text-sm tracking-wider font-bold"
            style={{ color: '#29F2DF', textShadow: '0 0 10px rgba(41, 242, 223, 0.3)' }}
          >
            NEXUS TERMINAL
          </div>
          <div
            className="font-rajdhani text-xs hidden sm:block tracking-wider uppercase"
            style={{ color: '#1C7FA6' }}
          >
            Secure Access
          </div>
        </div>
        <div
          className="px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2 rounded text-right"
          style={{
            background: 'rgba(40, 18, 90, 0.4)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(41, 242, 223, 0.3)',
          }}
        >
          <div
            className="font-orbitron text-sm sm:text-base md:text-lg tracking-wider font-bold"
            style={{ color: '#29F2DF', textShadow: '0 0 15px rgba(41, 242, 223, 0.5)' }}
          >
            {formatTime(time)}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="min-h-screen flex flex-col items-center justify-center px-3 py-20 sm:px-4 sm:py-24 z-40 relative">
        {/* Title */}
        <div className="text-center mb-6 sm:mb-8 md:mb-10">
          <h1
            className="font-orbitron text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl tracking-[0.15em] mb-3 sm:mb-4 font-bold"
            style={{
              background: 'linear-gradient(135deg, #29F2DF 0%, #1C7FA6 50%, #EF3EF1 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 20px rgba(41, 242, 223, 0.3))',
            }}
          >
            ACCESS MODULES
          </h1>
          <p
            className="font-rajdhani text-sm sm:text-base md:text-lg tracking-[0.2em] px-2 uppercase font-medium"
            style={{ color: '#29F2DF', textShadow: '0 0 10px rgba(41, 242, 223, 0.3)' }}
          >
            Select Destination • Secure Connection Active
          </p>
          {/* Decorative line */}
          <div className="mt-3 sm:mt-4 flex items-center justify-center gap-2 sm:gap-3 px-4">
            <div
              className="w-8 sm:w-12 md:w-16 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, #29F2DF)' }}
            />
            <div
              className="w-1.5 h-1.5 sm:w-2 sm:h-2 rotate-45"
              style={{ border: '1px solid #29F2DF', boxShadow: '0 0 10px #29F2DF' }}
            />
            <div
              className="w-16 sm:w-24 md:w-32 h-px"
              style={{ background: 'linear-gradient(90deg, #29F2DF, #EF3EF1)' }}
            />
            <div
              className="w-1.5 h-1.5 sm:w-2 sm:h-2 rotate-45"
              style={{ border: '1px solid #EF3EF1', boxShadow: '0 0 10px #EF3EF1' }}
            />
            <div
              className="w-8 sm:w-12 md:w-16 h-px"
              style={{ background: 'linear-gradient(90deg, #EF3EF1, transparent)' }}
            />
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 md:gap-6 w-full max-w-sm sm:max-w-2xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl px-2 sm:px-4">
          {/* PLAYGROUND Card */}
          <div
            className="relative rounded-lg p-4 sm:p-5 md:p-6 cursor-pointer transition-all duration-300 hover:scale-[1.02] sm:hover:scale-105 group"
            style={{
              background:
                'linear-gradient(135deg, rgba(40, 18, 90, 0.5) 0%, rgba(10, 18, 37, 0.7) 100%)',
              backdropFilter: 'blur(20px)',
              border: '2px solid rgba(41, 242, 223, 0.5)',
              boxShadow:
                '0 0 30px rgba(41, 242, 223, 0.15), inset 0 0 30px rgba(41, 242, 223, 0.05)',
            }}
          >
            <div
              className="absolute top-0 left-0 w-4 h-4 sm:w-5 sm:h-5 border-t-2 border-l-2"
              style={{ borderColor: '#29F2DF' }}
            />
            <div
              className="absolute top-0 right-0 w-4 h-4 sm:w-5 sm:h-5 border-t-2 border-r-2"
              style={{ borderColor: '#29F2DF' }}
            />
            <div
              className="absolute bottom-0 left-0 w-4 h-4 sm:w-5 sm:h-5 border-b-2 border-l-2"
              style={{ borderColor: '#29F2DF' }}
            />
            <div
              className="absolute bottom-0 right-0 w-4 h-4 sm:w-5 sm:h-5 border-b-2 border-r-2"
              style={{ borderColor: '#29F2DF' }}
            />

            <div
              className="absolute top-2 right-2 font-orbitron text-xs tracking-wider"
              style={{ color: '#29F2DF', textShadow: '0 0 8px rgba(41, 242, 223, 0.4)' }}
            >
              0x7F3A
            </div>
            <svg
              width="36"
              height="36"
              className="sm:w-10 sm:h-10 md:w-12 md:h-12 mb-3 sm:mb-4 group-hover:scale-110 transition-transform"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#29F2DF"
              strokeWidth="1.5"
              style={{ filter: 'drop-shadow(0 0 5px #29F2DF)' }}
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
            <h3
              className="font-orbitron text-base sm:text-lg md:text-xl mb-2 sm:mb-3 tracking-[0.15em] font-bold"
              style={{ color: '#29F2DF', textShadow: '0 0 15px rgba(41, 242, 223, 0.4)' }}
            >
              PLAYGROUND
            </h3>
            <p
              className="font-rajdhani text-xs sm:text-sm leading-relaxed"
              style={{ color: '#8EC8D8' }}
            >
              Interactive development environment for testing and prototyping advanced quantum
              systems with real-time diagnostics.
            </p>
            <div
              className="mt-3 sm:mt-4 pt-3 sm:pt-4 flex items-center justify-between"
              style={{ borderTop: '1px solid rgba(41, 242, 223, 0.2)' }}
            >
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span
                  className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full animate-pulse"
                  style={{ background: '#29F2DF', boxShadow: '0 0 8px #29F2DF' }}
                />
                <span
                  className="font-rajdhani text-xs uppercase tracking-[0.15em] font-medium"
                  style={{ color: '#29F2DF' }}
                >
                  System Online
                </span>
              </div>
              <span
                className="font-orbitron text-xs tracking-wider"
                style={{ color: '#29F2DF', textShadow: '0 0 8px rgba(41, 242, 223, 0.5)' }}
              >
                ACCESS →
              </span>
            </div>
          </div>

          {/* SHOWCASE Card */}
          <div
            className="relative rounded-lg p-4 sm:p-5 md:p-6 cursor-pointer transition-all duration-300 hover:scale-[1.02] sm:hover:scale-105 group"
            style={{
              background:
                'linear-gradient(135deg, rgba(40, 18, 90, 0.5) 0%, rgba(10, 18, 37, 0.7) 100%)',
              backdropFilter: 'blur(20px)',
              border: '2px solid rgba(239, 62, 241, 0.5)',
              boxShadow:
                '0 0 30px rgba(239, 62, 241, 0.15), inset 0 0 30px rgba(239, 62, 241, 0.05)',
            }}
          >
            <div
              className="absolute top-0 left-0 w-4 h-4 sm:w-5 sm:h-5 border-t-2 border-l-2"
              style={{ borderColor: '#EF3EF1' }}
            />
            <div
              className="absolute top-0 right-0 w-4 h-4 sm:w-5 sm:h-5 border-t-2 border-r-2"
              style={{ borderColor: '#EF3EF1' }}
            />
            <div
              className="absolute bottom-0 left-0 w-4 h-4 sm:w-5 sm:h-5 border-b-2 border-l-2"
              style={{ borderColor: '#EF3EF1' }}
            />
            <div
              className="absolute bottom-0 right-0 w-4 h-4 sm:w-5 sm:h-5 border-b-2 border-r-2"
              style={{ borderColor: '#EF3EF1' }}
            />

            <div
              className="absolute top-2 right-2 font-orbitron text-xs tracking-wider"
              style={{ color: '#EF3EF1', textShadow: '0 0 8px rgba(239, 62, 241, 0.4)' }}
            >
              0xDEAD
            </div>
            <svg
              width="36"
              height="36"
              className="sm:w-10 sm:h-10 md:w-12 md:h-12 mb-3 sm:mb-4 group-hover:scale-110 transition-transform"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#EF3EF1"
              strokeWidth="1.5"
              style={{ filter: 'drop-shadow(0 0 5px #EF3EF1)' }}
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
            <h3
              className="font-orbitron text-base sm:text-lg md:text-xl mb-2 sm:mb-3 tracking-[0.15em] font-bold"
              style={{ color: '#EF3EF1', textShadow: '0 0 15px rgba(239, 62, 241, 0.4)' }}
            >
              SHOWCASE
            </h3>
            <p
              className="font-rajdhani text-xs sm:text-sm leading-relaxed"
              style={{ color: '#C878D8' }}
            >
              Display gallery featuring cutting-edge holographic demonstrations and advanced project
              exhibits.
            </p>
            <div
              className="mt-3 sm:mt-4 pt-3 sm:pt-4 flex items-center justify-between"
              style={{ borderTop: '1px solid rgba(239, 62, 241, 0.2)' }}
            >
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span
                  className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full animate-pulse"
                  style={{ background: '#EF3EF1', boxShadow: '0 0 8px #EF3EF1' }}
                />
                <span
                  className="font-rajdhani text-xs uppercase tracking-[0.15em] font-medium"
                  style={{ color: '#EF3EF1' }}
                >
                  System Online
                </span>
              </div>
              <span
                className="font-orbitron text-xs tracking-wider"
                style={{ color: '#EF3EF1', textShadow: '0 0 8px rgba(239, 62, 241, 0.5)' }}
              >
                ACCESS →
              </span>
            </div>
          </div>

          {/* DOCUMENTATION Card */}
          <div
            className="relative rounded-lg p-4 sm:p-5 md:p-6 cursor-pointer transition-all duration-300 hover:scale-[1.02] sm:hover:scale-105 group"
            style={{
              background:
                'linear-gradient(135deg, rgba(40, 18, 90, 0.5) 0%, rgba(10, 18, 37, 0.7) 100%)',
              backdropFilter: 'blur(20px)',
              border: '2px solid rgba(28, 127, 166, 0.5)',
              boxShadow:
                '0 0 30px rgba(28, 127, 166, 0.15), inset 0 0 30px rgba(28, 127, 166, 0.05)',
            }}
          >
            <div
              className="absolute top-0 left-0 w-4 h-4 sm:w-5 sm:h-5 border-t-2 border-l-2"
              style={{ borderColor: '#1C7FA6' }}
            />
            <div
              className="absolute top-0 right-0 w-4 h-4 sm:w-5 sm:h-5 border-t-2 border-r-2"
              style={{ borderColor: '#1C7FA6' }}
            />
            <div
              className="absolute bottom-0 left-0 w-4 h-4 sm:w-5 sm:h-5 border-b-2 border-l-2"
              style={{ borderColor: '#1C7FA6' }}
            />
            <div
              className="absolute bottom-0 right-0 w-4 h-4 sm:w-5 sm:h-5 border-b-2 border-r-2"
              style={{ borderColor: '#1C7FA6' }}
            />

            <div
              className="absolute top-2 right-2 font-orbitron text-xs tracking-wider"
              style={{ color: '#1C7FA6', textShadow: '0 0 8px rgba(28, 127, 166, 0.4)' }}
            >
              0xBEEF
            </div>
            <svg
              width="36"
              height="36"
              className="sm:w-10 sm:h-10 md:w-12 md:h-12 mb-3 sm:mb-4 group-hover:scale-110 transition-transform"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#1C7FA6"
              strokeWidth="1.5"
              style={{ filter: 'drop-shadow(0 0 5px #1C7FA6)' }}
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14,2 14,8 20,8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
            <h3
              className="font-orbitron text-base sm:text-lg md:text-xl mb-2 sm:mb-3 tracking-[0.15em] font-bold"
              style={{ color: '#1C7FA6', textShadow: '0 0 15px rgba(28, 127, 166, 0.4)' }}
            >
              DOCUMENTATION
            </h3>
            <p
              className="font-rajdhani text-xs sm:text-sm leading-relaxed"
              style={{ color: '#5BA8C8' }}
            >
              Comprehensive technical manuals and API references for seamless system integration
              protocols.
            </p>
            <div
              className="mt-3 sm:mt-4 pt-3 sm:pt-4 flex items-center justify-between"
              style={{ borderTop: '1px solid rgba(28, 127, 166, 0.2)' }}
            >
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span
                  className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full animate-pulse"
                  style={{ background: '#1C7FA6', boxShadow: '0 0 8px #1C7FA6' }}
                />
                <span
                  className="font-rajdhani text-xs uppercase tracking-[0.15em] font-medium"
                  style={{ color: '#1C7FA6' }}
                >
                  System Online
                </span>
              </div>
              <span
                className="font-orbitron text-xs tracking-wider"
                style={{ color: '#1C7FA6', textShadow: '0 0 8px rgba(28, 127, 166, 0.5)' }}
              >
                ACCESS →
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer - Responsive */}
      <footer className="fixed bottom-0 left-0 right-0 flex items-center justify-between px-3 py-2 sm:px-4 sm:py-3 md:px-6 md:py-4 z-50">
        <div
          className="px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2 rounded flex items-center gap-2 sm:gap-3 md:gap-4"
          style={{
            background: 'rgba(40, 18, 90, 0.4)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(41, 242, 223, 0.2)',
          }}
        >
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span
              className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full animate-pulse"
              style={{ background: '#29F2DF', boxShadow: '0 0 6px #29F2DF' }}
            />
            <span
              className="font-rajdhani text-xs uppercase tracking-wider font-medium"
              style={{ color: '#29F2DF' }}
            >
              Connected
            </span>
          </div>
          <div
            className="w-px h-3 sm:h-4 hidden sm:block"
            style={{ background: 'rgba(41, 242, 223, 0.3)' }}
          />
          <div className="items-center gap-1.5 sm:gap-2 hidden sm:flex">
            <span
              className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full animate-pulse"
              style={{ background: '#EF3EF1', boxShadow: '0 0 6px #EF3EF1' }}
            />
            <span
              className="font-rajdhani text-xs uppercase tracking-wider font-medium"
              style={{ color: '#EF3EF1' }}
            >
              Secured
            </span>
          </div>
        </div>
        <div
          className="px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2 rounded hidden sm:block"
          style={{
            background: 'rgba(40, 18, 90, 0.4)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(41, 242, 223, 0.2)',
          }}
        >
          <span
            className="font-rajdhani text-xs uppercase tracking-wider"
            style={{ color: '#29F2DF' }}
          >
            Encryption: AES-256
          </span>
        </div>
      </footer>
    </main>
  );
}
