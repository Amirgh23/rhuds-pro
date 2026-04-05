import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInterval, useTimeout } from '@rhuds/core';
import { Navigation } from './intro-page/components/Navigation';
import { CTAButtons } from './intro-page/components/CTAButtons';
import { GlassContextMenu } from '../components/GlassContextMenu';
import { GeometricWrapper } from '../components/GeometricWrapper';

const FULL_TEXT = 'INITIALIZING RHUDS PRO SYSTEM...';

// GitHub Stats (Real data - project not yet published)
const GITHUB_STATS = {
  stars: 0,
  downloads: 0,
  contributors: 1,
  version: 'v0.1.0',
};

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  life: number;
  maxLife: number;
}

interface Star {
  x: number;
  y: number;
  z: number;
  size: number;
  speed: number;
  opacity: number;
}

export default function IntroPage() {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [glitchActive, setGlitchActive] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<'cyan' | 'purple' | 'blue'>('cyan');
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 });
  const [animatedStats, setAnimatedStats] = useState({
    stars: 0,
    downloads: 0,
    contributors: 0,
  });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const starsRef = useRef<Star[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const hoverSoundRef = useRef<OscillatorNode | null>(null);

  // Initial load animation with progressive reveal
  useTimeout(() => setIsLoaded(true), 100);

  // Typing effect with variable speed
  const [typingIndex, setTypingIndex] = useState(0);
  const [typingDelay, setTypingDelay] = useState(60 + Math.random() * 40);
  const [shouldType, setShouldType] = useState(true);

  useEffect(() => {
    setTypedText(FULL_TEXT.slice(0, typingIndex));
  }, [typingIndex]);

  useInterval(
    () => {
      setTypingIndex((prev) => {
        const next = prev + 1;
        if (next % 5 === 0 && next <= FULL_TEXT.length) {
          setShouldType(false);
        }
        return next;
      });
    },
    shouldType && typingIndex <= FULL_TEXT.length ? typingDelay : null
  );

  useTimeout(
    () => {
      setShouldType(true);
      setTypingDelay(80);
    },
    !shouldType && typingIndex <= FULL_TEXT.length ? Math.random() * 200 : null
  );

  // Glitch effect with variable intensity
  const [glitchDelay, setGlitchDelay] = useState(2000 + Math.random() * 2000);
  const [shouldGlitch, setShouldGlitch] = useState(true);

  useInterval(
    () => {
      const intensity = Math.random() * 0.5 + 0.5;
      setGlitchActive(true);
      setGlitchDelay(2000 + Math.random() * 2000);
    },
    shouldGlitch ? glitchDelay : null
  );

  useTimeout(
    () => {
      setGlitchActive(false);
    },
    glitchActive ? 100 + Math.random() * 100 : null
  );

  // Audio initialization
  useEffect(() => {
    if (typeof window !== 'undefined' && window.AudioContext) {
      try {
        audioContextRef.current = new AudioContext();
        setAudioEnabled(true);
      } catch (e) {
        console.log('Audio not supported');
      }
    }
  }, []);

  // Animate GitHub stats
  const [statsStep, setStatsStep] = useState(0);
  const statsDuration = 2000;
  const statsSteps = 60;
  const statsStepDuration = statsDuration / statsSteps;

  useInterval(
    () => {
      setStatsStep((prev) => {
        const next = prev + 1;
        const progress = next / statsSteps;

        setAnimatedStats({
          stars: Math.floor(GITHUB_STATS.stars * progress),
          downloads: Math.floor(GITHUB_STATS.downloads * progress),
          contributors: Math.floor(GITHUB_STATS.contributors * progress),
        });

        return next;
      });
    },
    statsStep < statsSteps ? statsStepDuration : null
  );

  // Context menu handler
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      setContextMenuPos({ x: e.clientX, y: e.clientY });
      setShowContextMenu(true);
    };

    const handleClick = () => {
      setShowContextMenu(false);
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('click', handleClick);
    };
  }, []);

  // Play hover sound
  const playHoverSound = useCallback(
    (frequency: number = 440, duration: number = 0.1) => {
      if (!audioEnabled || !audioContextRef.current) return;

      try {
        if (hoverSoundRef.current) {
          hoverSoundRef.current.stop();
        }

        const oscillator = audioContextRef.current.createOscillator();
        const gainNode = audioContextRef.current.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContextRef.current.destination);

        oscillator.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime);
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(0.1, audioContextRef.current.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          audioContextRef.current.currentTime + duration
        );

        oscillator.start();
        oscillator.stop(audioContextRef.current.currentTime + duration);

        hoverSoundRef.current = oscillator;
      } catch (e) {
        // Silent fail for audio errors
      }
    },
    [audioEnabled]
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Main canvas animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    // Initialize particles with enhanced physics
    const initParticles = () => {
      const particleCount = Math.floor((canvas.width * canvas.height) / 8000);
      particlesRef.current = [];

      for (let i = 0; i < particleCount; i++) {
        const isSpecial = Math.random() < 0.1;
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * (isSpecial ? 1.5 : 0.8),
          vy: (Math.random() - 0.5) * (isSpecial ? 1.5 : 0.8),
          size: Math.random() * (isSpecial ? 4 : 2) + 0.5,
          opacity: Math.random() * (isSpecial ? 0.8 : 0.5) + 0.2,
          color: isSpecial ? '#FFFFFF' : Math.random() > 0.5 ? '#29F2DF' : '#EF3EF1',
          life: 1,
          maxLife: 1,
        });
      }
    };

    // Initialize starfield
    const initStars = () => {
      const starCount = Math.floor((canvas.width * canvas.height) / 2000);
      starsRef.current = [];

      for (let i = 0; i < starCount; i++) {
        starsRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          z: Math.random() * 1000,
          size: Math.random() * 1.5 + 0.5,
          speed: Math.random() * 2 + 0.5,
          opacity: Math.random() * 0.8 + 0.2,
        });
      }
    };

    const resize = () => {
      canvas.width = window.innerWidth * window.devicePixelRatio;
      canvas.height = window.innerHeight * window.devicePixelRatio;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      initParticles();
      initStars();
    };
    resize();
    window.addEventListener('resize', resize);
    initParticles();
    initStars();

    const draw = () => {
      time += 0.005;

      // Clear with dark background
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw and update particles
      particlesRef.current.forEach((particle) => {
        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Draw particle with glow
        const gradient = ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particle.size * 4
        );
        gradient.addColorStop(
          0,
          `${particle.color}${Math.floor(particle.opacity * 255)
            .toString(16)
            .padStart(2, '0')}`
        );
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 4, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw elegant grid
      const gridSize = 80;
      ctx.strokeStyle = 'rgba(41, 242, 223, 0.05)';
      ctx.lineWidth = 1;

      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw flowing energy lines
      ctx.strokeStyle = 'rgba(41, 242, 223, 0.12)';
      ctx.lineWidth = 2;

      for (let i = 0; i < 4; i++) {
        ctx.beginPath();
        const yOffset = (canvas.height / 5) * (i + 1);

        for (let x = 0; x <= canvas.width; x += 8) {
          const y =
            yOffset +
            Math.sin(time * 0.8 + x * 0.008 + i * 0.5) * 40 +
            Math.cos(time * 0.5 + x * 0.005) * 20;
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }

      // Draw accent circles
      const circleCount = 5;
      for (let i = 0; i < circleCount; i++) {
        const angle = time * 0.3 + (i * (Math.PI * 2)) / circleCount;
        const x = canvas.width / 2 + Math.cos(angle) * (canvas.width * 0.3);
        const y = canvas.height / 2 + Math.sin(angle) * (canvas.height * 0.3);

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, 100);
        gradient.addColorStop(0, 'rgba(239, 62, 241, 0.08)');
        gradient.addColorStop(1, 'transparent');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, 100, 0, Math.PI * 2);
        ctx.fill();
      }

      animationId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  const themes = {
    cyan: { primary: '#29F2DF', secondary: '#1C7FA6', name: 'Cyan' },
    purple: { primary: '#EF3EF1', secondary: '#9D4EDD', name: 'Purple' },
    blue: { primary: '#4CC9F0', secondary: '#4361EE', name: 'Blue' },
  };

  const features = [
    {
      id: 'playground',
      title: 'PLAYGROUND',
      subtitle: 'Interactive Sandbox',
      description: '51+ components ready to test and customize in real-time',
      icon: '⚡',
      color: themes[currentTheme].primary,
      gradient: `linear-gradient(135deg, ${themes[currentTheme].primary} 0%, ${themes[currentTheme].secondary} 100%)`,
      route: '/playground',
    },
    {
      id: 'showcase',
      title: 'SHOWCASE',
      subtitle: 'Component Gallery',
      description: 'Browse the complete library with live examples and guides',
      icon: '✨',
      color: themes[currentTheme].primary,
      gradient: `linear-gradient(135deg, ${themes[currentTheme].primary} 0%, ${themes[currentTheme].secondary} 100%)`,
      route: '/showcase',
    },
    {
      id: 'docs',
      title: 'DOCUMENTATION',
      subtitle: 'API Reference',
      description: 'Complete guides and integration examples for your projects',
      icon: '📚',
      color: themes[currentTheme].primary,
      gradient: `linear-gradient(135deg, ${themes[currentTheme].primary} 0%, ${themes[currentTheme].secondary} 100%)`,
      route: '/docs',
    },
  ];

  const contextMenuItems = [
    { icon: '⚡', label: 'Open Playground', action: () => navigate('/playground') },
    { icon: '✨', label: 'View Showcase', action: () => navigate('/showcase') },
    { icon: '📚', label: 'Read Docs', action: () => navigate('/docs') },
    { icon: '👤', label: 'View Portfolio', action: () => navigate('/portfolio') },
    { divider: true },
    {
      icon: '🔗',
      label: 'GitHub',
      action: () => window.open('https://github.com/yourusername/rhuds', '_blank'),
    },
    {
      icon: '📦',
      label: 'NPM',
      action: () => window.open('https://npmjs.com/package/@rhuds/core', '_blank'),
    },
    { divider: true },
    {
      icon: '📋',
      label: 'Copy Install Command',
      action: () => {
        navigator.clipboard.writeText('npm install @rhuds/core @rhuds/components');
        alert('Install command copied to clipboard!');
      },
    },
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #000000 0%, #0a0a0f 50%, #000000 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Navigation Bar */}
      <Navigation />

      {/* Animated Background */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
        }}
      />

      {/* Subtle gradient overlay */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1,
          pointerEvents: 'none',
          background: `
            radial-gradient(circle at ${50 + mousePosition.x * 15}% ${50 + mousePosition.y * 15}%, rgba(41, 242, 223, 0.06) 0%, transparent 60%),
            radial-gradient(circle at ${50 - mousePosition.x * 15}% ${50 - mousePosition.y * 15}%, rgba(239, 62, 241, 0.04) 0%, transparent 60%)
          `,
        }}
      />

      {/* Hero Section with advanced parallax */}
      <section
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 20,
          padding: '120px 20px 40px 20px',
          transform: `translateY(${scrollY * 0.3}px)`,
          perspective: '1000px',
        }}
      >
        {/* Terminal-style header */}
        <div
          style={{
            position: 'absolute',
            top: '80px',
            left: '50%',
            transform: `translateX(-50%) ${isLoaded ? 'translateY(0)' : 'translateY(-20px)'}`,
            fontFamily: 'monospace',
            fontSize: '15px',
            color: '#29F2DF',
            opacity: isLoaded ? 0.8 : 0,
            transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1)',
            padding: '12px 24px',
            background: 'rgba(41, 242, 223, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(41, 242, 223, 0.2)',
            boxShadow: '0 4px 20px rgba(41, 242, 223, 0.15)',
          }}
        >
          <span style={{ color: '#EF3EF1', fontWeight: 'bold' }}>{'>'}</span> {typedText}
          <span style={{ animation: 'blink 1s infinite', marginLeft: '2px' }}>▊</span>
        </div>

        {/* Logo/Brand with advanced 3D glassmorphism */}
        <div
          style={{
            marginBottom: '60px',
            animation: 'fadeInUp 1s ease-out 0.3s backwards',
            position: 'relative',
            padding: '60px 100px',
            background:
              'linear-gradient(135deg, rgba(41, 242, 223, 0.12) 0%, rgba(239, 62, 241, 0.12) 100%)',
            backdropFilter: 'blur(60px) saturate(200%)',
            border: '2px solid transparent',
            boxShadow: `
              0 30px 80px rgba(0, 0, 0, 0.6),
              0 0 150px rgba(41, 242, 223, 0.3),
              0 0 250px rgba(239, 62, 241, 0.2),
              0 0 350px rgba(28, 127, 166, 0.1),
              inset 0 4px 0 rgba(255, 255, 255, 0.3),
              inset 0 -4px 0 rgba(0, 0, 0, 0.4)
            `,
            transform: `
              perspective(1200px) 
              rotateX(${mousePosition.y * 3}deg) 
              rotateY(${mousePosition.x * 3}deg)
              translateZ(${scrollY * 0.05}px)
            `,
            transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease',
            willChange: 'transform, box-shadow',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderImage =
              'linear-gradient(135deg, #29F2DF, #EF3EF1, #1C7FA6) 1';
            e.currentTarget.style.boxShadow = `
              0 40px 100px rgba(0, 0, 0, 0.7),
              0 0 200px rgba(41, 242, 223, 0.5),
              0 0 300px rgba(239, 62, 241, 0.3),
              0 0 400px rgba(28, 127, 166, 0.2),
              inset 0 4px 0 rgba(255, 255, 255, 0.4),
              inset 0 -4px 0 rgba(0, 0, 0, 0.5)
            `;
            playHoverSound(523.25, 0.15); // C5 note
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderImage = 'none';
            e.currentTarget.style.boxShadow = `
              0 30px 80px rgba(0, 0, 0, 0.6),
              0 0 150px rgba(41, 242, 223, 0.3),
              0 0 250px rgba(239, 62, 241, 0.2),
              0 0 350px rgba(28, 127, 166, 0.1),
              inset 0 4px 0 rgba(255, 255, 255, 0.3),
              inset 0 -4px 0 rgba(0, 0, 0, 0.4)
            `;
          }}
        >
          {/* Logo container with overflow hidden for holographic layers */}
          <div style={{ position: 'relative', overflow: 'hidden' }}>
            {/* Holographic layers */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                fontSize: '80px',
                fontWeight: '900',
                letterSpacing: '8px',
                color: '#29F2DF',
                textAlign: 'center',
                opacity: 0.3,
                filter: 'blur(8px)',
                transform: glitchActive ? 'translate(4px, -4px)' : 'translate(2px, -2px)',
                transition: 'transform 0.1s',
                pointerEvents: 'none',
              }}
            >
              RHUDS
            </div>
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                fontSize: '80px',
                fontWeight: '900',
                letterSpacing: '8px',
                color: '#EF3EF1',
                textAlign: 'center',
                opacity: 0.3,
                filter: 'blur(8px)',
                transform: glitchActive ? 'translate(-4px, 4px)' : 'translate(-2px, 2px)',
                transition: 'transform 0.1s',
                pointerEvents: 'none',
              }}
            >
              RHUDS
            </div>

            {/* Main logo with advanced effects */}
            <div
              style={{
                position: 'relative',
                fontSize: '96px',
                fontWeight: '900',
                letterSpacing: '12px',
                background: 'linear-gradient(135deg, #29F2DF 0%, #EF3EF1 50%, #1C7FA6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundSize: '300% 300%',
                textAlign: 'center',
                filter: `
                  drop-shadow(0 0 60px rgba(41, 242, 223, 0.9))
                  drop-shadow(0 0 100px rgba(239, 62, 241, 0.6))
                  drop-shadow(0 0 150px rgba(28, 127, 166, 0.3))
                `,
                marginBottom: '24px',
                animation: `
                  glow 3s ease-in-out infinite,
                  gradientShift 6s ease infinite,
                  float3D 5s ease-in-out infinite
                `,
                transform: glitchActive ? 'skew(-3deg) translate(4px, -4px)' : 'skew(0deg)',
                transition: 'transform 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                textShadow: `
                  0 0 30px rgba(41, 242, 223, 0.5),
                  0 0 60px rgba(239, 62, 241, 0.3),
                  0 0 90px rgba(28, 127, 166, 0.2)
                `,
              }}
            >
              RHUDS
            </div>
          </div>

          {/* PRO badge with scan line */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                fontSize: '28px',
                fontWeight: 'bold',
                letterSpacing: '16px',
                color: '#29F2DF',
                textAlign: 'center',
                opacity: 0.95,
                textShadow: '0 0 40px rgba(41, 242, 223, 1), 0 0 80px rgba(41, 242, 223, 0.6)',
                padding: '12px 32px',
                border: '3px solid #29F2DF',
                position: 'relative',
                background: 'rgba(41, 242, 223, 0.08)',
                boxShadow:
                  '0 0 30px rgba(41, 242, 223, 0.4), inset 0 0 20px rgba(41, 242, 223, 0.1)',
              }}
            >
              PRO
              {/* Scan line effect */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background:
                    'linear-gradient(90deg, transparent, rgba(41, 242, 223, 0.6), transparent)',
                  animation: 'scan 2.5s linear infinite',
                }}
              />
            </div>
          </div>
        </div>

        {/* Tagline with advanced glassmorphism and parallax */}
        <div
          style={{
            maxWidth: '1000px',
            textAlign: 'center',
            marginBottom: '80px',
            animation: 'fadeInUp 1s ease-out 0.5s backwards',
            position: 'relative',
            padding: '60px',
            background:
              'linear-gradient(135deg, rgba(41, 242, 223, 0.1) 0%, rgba(239, 62, 241, 0.1) 100%)',
            backdropFilter: 'blur(40px) saturate(200%)',
            border: '2px solid rgba(41, 242, 223, 0.4)',
            boxShadow: `
              0 25px 70px rgba(0, 0, 0, 0.5),
              0 0 100px rgba(41, 242, 223, 0.25),
              0 0 150px rgba(239, 62, 241, 0.15),
              0 0 200px rgba(28, 127, 166, 0.1),
              inset 0 3px 0 rgba(255, 255, 255, 0.2),
              inset 0 -3px 0 rgba(0, 0, 0, 0.3)
            `,
            transform: `
              translateY(${scrollY * -0.15}px)
              rotateX(${mousePosition.y * 1}deg)
              rotateY(${mousePosition.x * 1}deg)
            `,
            transition: 'transform 0.3s ease-out, box-shadow 0.3s ease',
            willChange: 'transform',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = `
              0 35px 90px rgba(0, 0, 0, 0.6),
              0 0 150px rgba(41, 242, 223, 0.4),
              0 0 200px rgba(239, 62, 241, 0.25),
              0 0 250px rgba(28, 127, 166, 0.15),
              inset 0 3px 0 rgba(255, 255, 255, 0.25),
              inset 0 -3px 0 rgba(0, 0, 0, 0.4)
            `;
            playHoverSound(440, 0.1); // A4 note
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = `
              0 25px 70px rgba(0, 0, 0, 0.5),
              0 0 100px rgba(41, 242, 223, 0.25),
              0 0 150px rgba(239, 62, 241, 0.15),
              0 0 200px rgba(28, 127, 166, 0.1),
              inset 0 3px 0 rgba(255, 255, 255, 0.2),
              inset 0 -3px 0 rgba(0, 0, 0, 0.3)
            `;
          }}
        >
          {/* Decorative brackets */}
          <div
            style={{
              position: 'absolute',
              top: '-20px',
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: '24px',
              color: '#29F2DF',
              opacity: 0.4,
              letterSpacing: '20px',
            }}
          >
            {'[ ]'}
          </div>

          <h1
            style={{
              fontSize: '58px',
              fontWeight: '800',
              color: '#fff',
              marginBottom: '28px',
              lineHeight: '1.2',
              textShadow: `
                0 4px 20px rgba(0, 0, 0, 0.7),
                0 0 50px rgba(41, 242, 223, 0.5),
                0 0 80px rgba(239, 62, 241, 0.3)
              `,
              position: 'relative',
              letterSpacing: '1px',
              animation: 'textGlow 3s ease-in-out infinite',
            }}
          >
            <span
              style={{
                background: 'linear-gradient(135deg, #fff 0%, #29F2DF 50%, #EF3EF1 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: '900',
                backgroundSize: '200% 200%',
                animation: 'gradientShift 4s ease infinite',
              }}
            >
              Next-Gen HUD
            </span>{' '}
            <span
              style={{
                color: '#8EC8D8',
                fontWeight: '700',
                textShadow: '0 0 30px rgba(142, 200, 216, 0.5)',
              }}
            >
              Design System
            </span>
          </h1>

          <p
            style={{
              fontSize: '22px',
              color: '#C8D8E8',
              lineHeight: '1.8',
              maxWidth: '800px',
              margin: '0 auto 40px',
              textShadow: `
                0 2px 12px rgba(0, 0, 0, 0.8),
                0 0 20px rgba(41, 242, 223, 0.2)
              `,
              fontWeight: '400',
              animation: 'fadeInUp 1s ease-out 0.7s backwards',
            }}
          >
            Build stunning sci-fi interfaces with{' '}
            <span
              style={{
                color: '#29F2DF',
                fontWeight: '700',
                textShadow: '0 0 20px rgba(41, 242, 223, 0.8)',
                animation: 'pulse 2s ease-in-out infinite',
                position: 'relative',
                display: 'inline-block',
              }}
            >
              51+ premium components
            </span>
            . Powered by React, TypeScript, and cutting-edge animations.
          </p>

          {/* Tech badges with advanced effects */}
          <div
            style={{
              display: 'flex',
              gap: '20px',
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginTop: '40px',
              perspective: '1000px',
            }}
          >
            {['React 18', 'TypeScript', 'WebGL', 'Canvas API', 'Framer Motion'].map(
              (tech, index) => (
                <div
                  key={tech}
                  style={{
                    padding: '12px 28px',
                    background:
                      'linear-gradient(135deg, rgba(41, 242, 223, 0.2) 0%, rgba(239, 62, 241, 0.2) 100%)',
                    backdropFilter: 'blur(25px) saturate(200%)',
                    border: '2px solid rgba(41, 242, 223, 0.6)',
                    fontSize: '15px',
                    color: '#29F2DF',
                    fontWeight: '700',
                    letterSpacing: '0.5px',
                    animation: `fadeInUp 0.8s ease-out ${0.6 + index * 0.1}s backwards, float 3s ease-in-out ${index * 0.2}s infinite`,
                    boxShadow: `
                    0 10px 30px rgba(41, 242, 223, 0.3),
                    0 0 50px rgba(41, 242, 223, 0.2),
                    0 0 70px rgba(239, 62, 241, 0.1),
                    inset 0 2px 0 rgba(255, 255, 255, 0.25),
                    inset 0 -2px 0 rgba(0, 0, 0, 0.3)
                  `,
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: 'default',
                    position: 'relative',
                    overflow: 'hidden',
                    willChange: 'transform, box-shadow',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = `
                    translateY(-6px) 
                    scale(1.08) 
                    rotateX(${mousePosition.y * 5}deg) 
                    rotateY(${mousePosition.x * 5}deg)
                  `;
                    e.currentTarget.style.boxShadow = `
                    0 15px 40px rgba(41, 242, 223, 0.5),
                    0 0 80px rgba(41, 242, 223, 0.4),
                    0 0 100px rgba(239, 62, 241, 0.2),
                    inset 0 2px 0 rgba(255, 255, 255, 0.35)
                  `;
                    e.currentTarget.style.borderColor = '#FFFFFF';
                    e.currentTarget.style.color = '#FFFFFF';
                    playHoverSound(523.25 + index * 50, 0.1); // Ascending notes
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform =
                      'translateY(0) scale(1) rotateX(0) rotateY(0)';
                    e.currentTarget.style.boxShadow = `
                    0 10px 30px rgba(41, 242, 223, 0.3),
                    0 0 50px rgba(41, 242, 223, 0.2),
                    0 0 70px rgba(239, 62, 241, 0.1),
                    inset 0 2px 0 rgba(255, 255, 255, 0.25),
                    inset 0 -2px 0 rgba(0, 0, 0, 0.3)
                  `;
                    e.currentTarget.style.borderColor = 'rgba(41, 242, 223, 0.6)';
                    e.currentTarget.style.color = '#29F2DF';
                  }}
                >
                  {tech}
                  {/* Glow effect */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '100%',
                      height: '100%',
                      background:
                        'radial-gradient(circle, rgba(41, 242, 223, 0.1) 0%, transparent 70%)',
                      filter: 'blur(10px)',
                      opacity: 0,
                      transition: 'opacity 0.3s ease',
                      pointerEvents: 'none',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = '1';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = '0';
                    }}
                  />
                </div>
              )
            )}
          </div>
        </div>

        {/* CTA Buttons with advanced 3D effects */}
        <CTAButtons onPlaySound={playHoverSound} mousePosition={mousePosition} />

        {/* Advanced Scroll Indicator */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            left: '50%',
            transform: 'translateX(-50%)',
            animation: 'bounce 2s infinite, pulse 3s ease-in-out infinite',
          }}
        >
          <div
            style={{
              width: '3px',
              height: '50px',
              background: 'linear-gradient(to bottom, transparent, #29F2DF, #EF3EF1, transparent)',
              margin: '0 auto',
              filter: 'drop-shadow(0 0 10px rgba(41, 242, 223, 0.5))',
              position: 'relative',
            }}
          >
            {/* Pulsing orb */}
            <div
              style={{
                position: 'absolute',
                bottom: '0',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '12px',
                height: '12px',
                background: 'radial-gradient(circle, #29F2DF 0%, #EF3EF1 100%)',
                filter: 'blur(2px)',
                animation: 'pulse 1.5s ease-in-out infinite',
              }}
            />
          </div>
          <div
            style={{
              marginTop: '10px',
              fontSize: '12px',
              color: '#8EC8D8',
              letterSpacing: '2px',
              textAlign: 'center',
              opacity: 0.7,
              animation: 'fadeInOut 3s ease-in-out infinite',
            }}
          >
            SCROLL
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 20,
          padding: '120px 20px',
        }}
      >
        <div style={{ maxWidth: '1400px', width: '100%' }}>
          <h2
            style={{
              fontSize: '56px',
              fontWeight: '900',
              textAlign: 'center',
              marginBottom: '100px',
              background: 'linear-gradient(135deg, #29F2DF 0%, #EF3EF1 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '2px',
              textShadow: '0 0 60px rgba(41, 242, 223, 0.3)',
              position: 'relative',
            }}
          >
            Explore the System
            {/* Underline decoration */}
            <div
              style={{
                position: 'absolute',
                bottom: '-20px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '200px',
                height: '4px',
                background: 'linear-gradient(90deg, transparent, #29F2DF, #EF3EF1, transparent)',
                boxShadow: '0 0 20px rgba(41, 242, 223, 0.6)',
              }}
            />
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
              gap: '50px',
              padding: '0 20px',
            }}
          >
            {features.map((feature, index) => (
              <div
                key={feature.id}
                onClick={() => navigate(feature.route)}
                style={{
                  position: 'relative',
                  padding: '50px',
                  background:
                    'linear-gradient(135deg, rgba(41, 242, 223, 0.08) 0%, rgba(239, 62, 241, 0.08) 100%)',
                  backdropFilter: 'blur(40px) saturate(200%)',
                  border: `2px solid ${feature.color}50`,
                  cursor: 'pointer',
                  transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                  animation: `fadeInUp 0.8s ease-out ${0.2 + index * 0.2}s backwards`,
                  overflow: 'hidden',
                  boxShadow: `
                    0 20px 60px rgba(0, 0, 0, 0.4),
                    0 0 80px ${feature.color}20,
                    inset 0 2px 0 rgba(255, 255, 255, 0.15),
                    inset 0 -2px 0 rgba(0, 0, 0, 0.3)
                  `,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-16px) scale(1.03)';
                  e.currentTarget.style.borderColor = feature.color;
                  e.currentTarget.style.background = `linear-gradient(135deg, rgba(41, 242, 223, 0.12) 0%, rgba(239, 62, 241, 0.12) 100%)`;
                  e.currentTarget.style.boxShadow = `
                    0 30px 80px ${feature.color}60,
                    0 0 120px ${feature.color}40,
                    0 20px 60px rgba(0, 0, 0, 0.5),
                    inset 0 2px 0 rgba(255, 255, 255, 0.2)
                  `;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.borderColor = `${feature.color}50`;
                  e.currentTarget.style.background = `linear-gradient(135deg, rgba(41, 242, 223, 0.08) 0%, rgba(239, 62, 241, 0.08) 100%)`;
                  e.currentTarget.style.boxShadow = `
                    0 20px 60px rgba(0, 0, 0, 0.4),
                    0 0 80px ${feature.color}20,
                    inset 0 2px 0 rgba(255, 255, 255, 0.15),
                    inset 0 -2px 0 rgba(0, 0, 0, 0.3)
                  `;
                }}
              >
                {/* Gradient Overlay */}
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '6px',
                    background: feature.gradient,
                    boxShadow: `0 0 20px ${feature.color}80`,
                  }}
                />

                {/* Icon with glow */}
                <div
                  style={{
                    fontSize: '64px',
                    marginBottom: '32px',
                    filter: `drop-shadow(0 0 20px ${feature.color}80)`,
                    animation: 'float 3s ease-in-out infinite',
                  }}
                >
                  {feature.icon}
                </div>

                {/* Title */}
                <h3
                  style={{
                    fontSize: '32px',
                    fontWeight: '900',
                    letterSpacing: '3px',
                    color: feature.color,
                    marginBottom: '12px',
                    textShadow: `0 0 30px ${feature.color}90`,
                    fontFamily: 'system-ui, -apple-system, sans-serif',
                  }}
                >
                  {feature.title}
                </h3>

                {/* Subtitle */}
                <div
                  style={{
                    fontSize: '15px',
                    letterSpacing: '1.5px',
                    color: '#8EC8D8',
                    marginBottom: '24px',
                    opacity: 0.9,
                    fontWeight: '600',
                  }}
                >
                  {feature.subtitle}
                </div>

                {/* Description */}
                <p
                  style={{
                    fontSize: '17px',
                    lineHeight: '1.7',
                    color: '#C8D8E8',
                    marginBottom: '32px',
                    textShadow: '0 2px 8px rgba(0, 0, 0, 0.6)',
                  }}
                >
                  {feature.description}
                </p>

                {/* Arrow with animation */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    color: feature.color,
                    fontSize: '16px',
                    fontWeight: '800',
                    letterSpacing: '2px',
                    transition: 'gap 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.gap = '20px';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.gap = '12px';
                  }}
                >
                  EXPLORE
                  <span style={{ fontSize: '24px', transition: 'transform 0.3s ease' }}>→</span>
                </div>

                {/* Corner decorations */}
                <div
                  style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    width: '40px',
                    height: '40px',
                    borderTop: `3px solid ${feature.color}60`,
                    borderRight: `3px solid ${feature.color}60`,
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: '20px',
                    left: '20px',
                    width: '40px',
                    height: '40px',
                    borderBottom: `3px solid ${feature.color}60`,
                    borderLeft: `3px solid ${feature.color}60`,
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GitHub Stats Section */}
      <section
        style={{
          padding: '120px 20px',
          position: 'relative',
          zIndex: 20,
        }}
      >
        <h2
          style={{
            fontSize: '48px',
            fontWeight: '900',
            textAlign: 'center',
            marginBottom: '80px',
            background: `linear-gradient(135deg, ${themes[currentTheme].primary} 0%, ${themes[currentTheme].secondary} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '2px',
          }}
        >
          Project Status
        </h2>
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '40px',
          }}
        >
          {[
            {
              value: animatedStats.stars,
              label: 'GitHub Stars',
              icon: '⭐',
              color: themes[currentTheme].primary,
            },
            {
              value: animatedStats.downloads,
              label: 'Downloads',
              icon: '📦',
              color: themes[currentTheme].secondary,
            },
            {
              value: animatedStats.contributors,
              label: 'Contributors',
              icon: '👥',
              color: themes[currentTheme].primary,
            },
            {
              value: GITHUB_STATS.version,
              label: 'Version',
              icon: '🚀',
              color: themes[currentTheme].secondary,
            },
          ].map((stat, index) => (
            <div
              key={index}
              style={{
                padding: '40px',
                background: 'rgba(10, 10, 31, 0.8)',
                border: `2px solid ${stat.color}`,
                textAlign: 'center',
                animation: `fadeInUp 0.8s ease-out ${0.2 + index * 0.1}s backwards`,
                transition: 'all 0.3s ease',
                cursor: 'default',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px) scale(1.03)';
                e.currentTarget.style.boxShadow = `0 20px 60px ${stat.color}60`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ fontSize: '48px', marginBottom: '20px' }}>{stat.icon}</div>
              <div
                style={{
                  fontSize: '56px',
                  fontWeight: '900',
                  color: stat.color,
                  marginBottom: '15px',
                  fontFamily: 'monospace',
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: '16px',
                  color: '#8EC8D8',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Theme Switcher Section */}
      <section
        style={{
          padding: '120px 20px',
          position: 'relative',
          zIndex: 20,
        }}
      >
        <h2
          style={{
            fontSize: '48px',
            fontWeight: '900',
            textAlign: 'center',
            marginBottom: '40px',
            background: `linear-gradient(135deg, ${themes[currentTheme].primary} 0%, ${themes[currentTheme].secondary} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '2px',
          }}
        >
          Choose Your Theme
        </h2>
        <p
          style={{
            textAlign: 'center',
            fontSize: '18px',
            color: '#C8D8E8',
            marginBottom: '60px',
            maxWidth: '600px',
            margin: '0 auto 60px',
          }}
        >
          Experience the power of dynamic theming. Switch between color schemes instantly.
        </p>
        <div
          style={{
            display: 'flex',
            gap: '30px',
            justifyContent: 'center',
            flexWrap: 'wrap',
            maxWidth: '800px',
            margin: '0 auto',
          }}
        >
          {Object.entries(themes).map(([key, theme]) => (
            <button
              key={key}
              onClick={() => setCurrentTheme(key as 'cyan' | 'purple' | 'blue')}
              style={{
                padding: '20px 40px',
                background:
                  currentTheme === key
                    ? `linear-gradient(135deg, ${theme.primary} 0%, ${theme.secondary} 100%)`
                    : 'rgba(10, 10, 31, 0.8)',
                border: `3px solid ${theme.primary}`,
                color: currentTheme === key ? '#000' : theme.primary,
                fontSize: '18px',
                fontWeight: '800',
                letterSpacing: '2px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textTransform: 'uppercase',
                boxShadow:
                  currentTheme === key
                    ? `0 0 40px ${theme.primary}80, 0 10px 30px rgba(0,0,0,0.5)`
                    : 'none',
              }}
              onMouseEnter={(e) => {
                if (currentTheme !== key) {
                  e.currentTarget.style.background = `linear-gradient(135deg, ${theme.primary}20 0%, ${theme.secondary}20 100%)`;
                  e.currentTarget.style.transform = 'translateY(-4px)';
                }
                playHoverSound(440 + Object.keys(themes).indexOf(key) * 100, 0.1);
              }}
              onMouseLeave={(e) => {
                if (currentTheme !== key) {
                  e.currentTarget.style.background = 'rgba(10, 10, 31, 0.8)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }
              }}
            >
              {theme.name}
            </button>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section
        style={{
          padding: '120px 20px',
          position: 'relative',
          zIndex: 20,
        }}
      >
        <div
          style={{
            maxWidth: '1400px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '60px',
            textAlign: 'center',
          }}
        >
          {[
            { value: '51+', label: 'Components', color: themes[currentTheme].primary, icon: '⚡' },
            {
              value: '100%',
              label: 'TypeScript',
              color: themes[currentTheme].secondary,
              icon: '🔷',
            },
            { value: '∞', label: 'Possibilities', color: themes[currentTheme].primary, icon: '✨' },
          ].map((stat, index) => (
            <div
              key={index}
              style={{
                animation: `fadeInUp 0.8s ease-out ${0.2 + index * 0.15}s backwards`,
                padding: '40px',
                background:
                  'linear-gradient(135deg, rgba(41, 242, 223, 0.06) 0%, rgba(239, 62, 241, 0.06) 100%)',
                backdropFilter: 'blur(30px) saturate(180%)',
                border: `2px solid ${stat.color}40`,
                transition: 'all 0.4s ease',
                cursor: 'default',
                boxShadow: `
                  0 10px 40px rgba(0, 0, 0, 0.3),
                  0 0 60px ${stat.color}15,
                  inset 0 2px 0 rgba(255, 255, 255, 0.1)
                `,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px) scale(1.05)';
                e.currentTarget.style.borderColor = stat.color;
                e.currentTarget.style.boxShadow = `
                  0 20px 60px ${stat.color}40,
                  0 0 100px ${stat.color}30,
                  inset 0 2px 0 rgba(255, 255, 255, 0.15)
                `;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.borderColor = `${stat.color}40`;
                e.currentTarget.style.boxShadow = `
                  0 10px 40px rgba(0, 0, 0, 0.3),
                  0 0 60px ${stat.color}15,
                  inset 0 2px 0 rgba(255, 255, 255, 0.1)
                `;
              }}
            >
              <div
                style={{
                  fontSize: '48px',
                  marginBottom: '20px',
                  filter: `drop-shadow(0 0 20px ${stat.color}80)`,
                }}
              >
                {stat.icon}
              </div>
              <div
                style={{
                  fontSize: '72px',
                  fontWeight: '900',
                  color: stat.color,
                  marginBottom: '20px',
                  textShadow: `0 0 40px ${stat.color}90, 0 0 80px ${stat.color}50`,
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  letterSpacing: '2px',
                }}
              >
                {stat.value}
              </div>
              <div
                style={{
                  fontSize: '20px',
                  letterSpacing: '3px',
                  color: '#8EC8D8',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Context Menu */}
      {showContextMenu && (
        <GlassContextMenu
          x={contextMenuPos.x}
          y={contextMenuPos.y}
          onClose={() => setShowContextMenu(false)}
          onNavigate={(path) => {
            navigate(path);
            setShowContextMenu(false);
          }}
          onCopyInstall={() => {
            navigator.clipboard.writeText('npm install @rhuds/core @rhuds/components');
            setShowContextMenu(false);
          }}
        />
      )}

      {/* Animations */}
      <style>
        {`
        @keyframes contextMenuFadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateX(-50%) translateY(0);
          }
          50% {
            transform: translateX(-50%) translateY(15px);
          }
        }

        @keyframes glow {
          0%, 100% {
            filter: drop-shadow(0 0 50px rgba(41, 242, 223, 0.7)) drop-shadow(0 0 80px rgba(239, 62, 241, 0.4));
          }
          50% {
            filter: drop-shadow(0 0 70px rgba(41, 242, 223, 1)) drop-shadow(0 0 120px rgba(239, 62, 241, 0.6));
          }
        }

        @keyframes gradientShift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes scan {
          0% {
            left: -100%;
          }
          100% {
            left: 200%;
          }
        }

        @keyframes shine {
          0% {
            left: -100%;
          }
          50%, 100% {
            left: 200%;
          }
        }

        @keyframes blink {
          0%, 49% {
            opacity: 1;
          }
          50%, 100% {
            opacity: 0;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-15px);
          }
        }

        @keyframes float3D {
          0%, 100% {
            transform: translateY(0) rotateX(0) rotateY(0);
          }
          25% {
            transform: translateY(-10px) rotateX(2deg) rotateY(2deg);
          }
          50% {
            transform: translateY(-5px) rotateX(-1deg) rotateY(-1deg);
          }
          75% {
            transform: translateY(-8px) rotateX(1deg) rotateY(-2deg);
          }
        }

        @keyframes textGlow {
          0%, 100% {
            text-shadow: 
              0 4px 20px rgba(0, 0, 0, 0.7),
              0 0 50px rgba(41, 242, 223, 0.5),
              0 0 80px rgba(239, 62, 241, 0.3);
          }
          50% {
            text-shadow: 
              0 4px 25px rgba(0, 0, 0, 0.8),
              0 0 70px rgba(41, 242, 223, 0.7),
              0 0 110px rgba(239, 62, 241, 0.5),
              0 0 150px rgba(28, 127, 166, 0.3);
          }
        }

        @keyframes gridMove {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 20px 20px;
          }
        }

        @keyframes fadeInOut {
          0%, 100% {
            opacity: 0.5;
          }
          50% {
            opacity: 1;
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.85;
            transform: scale(1.08);
          }
        }

        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .logo-container {
            padding: 40px 50px !important;
          }
          
          .logo-text {
            font-size: 64px !important;
          }
          
          .tagline-container {
            padding: 40px !important;
          }
          
          .tagline-title {
            font-size: 42px !important;
          }
          
          .tagline-description {
            font-size: 18px !important;
          }
          
          .cta-button {
            padding: 18px 48px !important;
            font-size: 17px !important;
          }
        }

        @media (max-width: 480px) {
          .logo-container {
            padding: 30px 40px !important;
          }
          
          .logo-text {
            font-size: 48px !important;
            letter-spacing: 6px !important;
          }
          
          .pro-badge {
            font-size: 20px !important;
            letter-spacing: 10px !important;
          }
          
          .tagline-container {
            padding: 30px !important;
          }
          
          .tagline-title {
            font-size: 32px !important;
          }
          
          .tagline-description {
            font-size: 16px !important;
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
          }
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .logo-container {
            padding: 30px 40px !important;
          }
          
          .logo-text {
            font-size: 48px !important;
          }
          
          .tagline-container {
            padding: 30px !important;
          }
          
          .tagline-title {
            font-size: 36px !important;
          }
          
          .tagline-description {
            font-size: 16px !important;
          }
          
          .cta-button {
            padding: 16px 40px !important;
            font-size: 16px !important;
          }
        }

        @media (max-width: 480px) {
          .logo-container {
            padding: 20px 30px !important;
          }
          
          .logo-text {
            font-size: 36px !important;
            letter-spacing: 4px !important;
          }
          
          .pro-badge {
            font-size: 18px !important;
            letter-spacing: 8px !important;
          }
          
          .tagline-container {
            padding: 20px !important;
          }
          
          .tagline-title {
            font-size: 28px !important;
          }
          
          .tagline-description {
            font-size: 14px !important;
          }
        }
      `}
      </style>
    </div>
  );
}
