import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function IntroPage() {
  const navigate = useNavigate();
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

  useEffect(() => {
    const duration = 1000;
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

      ctx.strokeStyle = 'rgba(41, 242, 223, 0.15)';
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
      gradient.addColorStop(0, `rgba(41, 242, 223, ${0.08 * pulse})`);
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

  if (!bootComplete) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0A1225',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, zIndex: 0, opacity: 0.6 }} />
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10,
            pointerEvents: 'none',
            background:
              'radial-gradient(ellipse at center, transparent 0%, rgba(10, 18, 37, 0.9) 100%)',
          }}
        />
        <div
          style={{
            position: 'relative',
            zIndex: 20,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ position: 'relative', width: '200px', height: '200px' }}>
            <svg
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
              viewBox="0 0 200 200"
            >
              <defs>
                <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#29F2DF" />
                  <stop offset="50%" stopColor="#EF3EF1" />
                  <stop offset="100%" stopColor="#1C7FA6" />
                </linearGradient>
              </defs>
              <circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke="rgba(40, 18, 90, 0.5)"
                strokeWidth="2"
              />
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
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  fontSize: '48px',
                  fontWeight: 'bold',
                  background: 'linear-gradient(135deg, #29F2DF, #EF3EF1)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  filter: 'drop-shadow(0 0 20px rgba(41, 242, 223, 0.5))',
                }}
              >
                {loadingText}
              </div>
              <div
                style={{
                  fontSize: '12px',
                  letterSpacing: '3px',
                  marginTop: '8px',
                  color: '#1C7FA6',
                  textShadow: '0 0 10px rgba(28, 127, 166, 0.5)',
                }}
              >
                {glitchActive ? 'SYSTEM READY' : 'INITIALIZING'}
              </div>
            </div>
          </div>
          <h1
            style={{
              marginTop: '32px',
              fontSize: '24px',
              letterSpacing: '2px',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #29F2DF 0%, #1C7FA6 50%, #EF3EF1 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 15px rgba(41, 242, 223, 0.3))',
            }}
          >
            RHUDS PRO
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0A1225',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, zIndex: 0, opacity: 0.8 }} />
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 10,
          pointerEvents: 'none',
          background:
            'radial-gradient(ellipse at 50% 0%, rgba(40, 18, 90, 0.5) 0%, transparent 50%), radial-gradient(ellipse at 0% 50%, rgba(28, 127, 166, 0.3) 0%, transparent 40%), radial-gradient(ellipse at 100% 50%, rgba(239, 62, 241, 0.2) 0%, transparent 40%), radial-gradient(ellipse at 50% 100%, rgba(40, 18, 90, 0.4) 0%, transparent 50%)',
        }}
      />

      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 24px',
          zIndex: 50,
        }}
      >
        <div
          style={{
            padding: '8px 16px',
            borderRadius: '4px',
            background: 'rgba(40, 18, 90, 0.4)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(41, 242, 223, 0.3)',
          }}
        >
          <div
            style={{
              fontSize: '14px',
              letterSpacing: '1px',
              fontWeight: 'bold',
              color: '#29F2DF',
              textShadow: '0 0 10px rgba(41, 242, 223, 0.3)',
            }}
          >
            RHUDS PRO
          </div>
        </div>
        <div
          style={{
            padding: '8px 16px',
            borderRadius: '4px',
            textAlign: 'right',
            background: 'rgba(40, 18, 90, 0.4)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(41, 242, 223, 0.3)',
          }}
        >
          <div
            style={{
              fontSize: '16px',
              letterSpacing: '1px',
              fontWeight: 'bold',
              color: '#29F2DF',
              textShadow: '0 0 15px rgba(41, 242, 223, 0.5)',
            }}
          >
            {formatTime(time)}
          </div>
        </div>
      </header>

      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px 16px 16px',
          zIndex: 40,
          position: 'relative',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1
            style={{
              fontSize: '48px',
              letterSpacing: '2px',
              marginBottom: '16px',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #29F2DF 0%, #1C7FA6 50%, #EF3EF1 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 20px rgba(41, 242, 223, 0.3))',
            }}
          >
            COMPONENT LIBRARY
          </h1>
          <p
            style={{
              fontSize: '14px',
              letterSpacing: '2px',
              color: '#29F2DF',
              textShadow: '0 0 10px rgba(41, 242, 223, 0.3)',
            }}
          >
            Explore • Experiment • Integrate
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
            width: '100%',
            maxWidth: '1200px',
            padding: '0 16px',
          }}
        >
          {/* PLAYGROUND */}
          <div
            onClick={() => navigate('/playground')}
            style={{
              position: 'relative',
              borderRadius: '8px',
              padding: '24px',
              cursor: 'pointer',
              transition: 'all 0.3s',
              background:
                'linear-gradient(135deg, rgba(40, 18, 90, 0.5) 0%, rgba(10, 18, 37, 0.7) 100%)',
              backdropFilter: 'blur(20px)',
              border: '2px solid rgba(41, 242, 223, 0.5)',
              boxShadow:
                '0 0 30px rgba(41, 242, 223, 0.15), inset 0 0 30px rgba(41, 242, 223, 0.05)',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
            }}
          >
            <div
              style={{
                fontSize: '12px',
                letterSpacing: '1px',
                color: '#29F2DF',
                textShadow: '0 0 8px rgba(41, 242, 223, 0.4)',
                position: 'absolute',
                top: '8px',
                right: '8px',
              }}
            >
              0x7F3A
            </div>
            <h3
              style={{
                fontSize: '20px',
                marginBottom: '12px',
                letterSpacing: '2px',
                fontWeight: 'bold',
                color: '#29F2DF',
                textShadow: '0 0 15px rgba(41, 242, 223, 0.4)',
              }}
            >
              PLAYGROUND
            </h3>
            <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#8EC8D8' }}>
              Test and experiment with 51+ UI components. Interactive sandbox for building and
              customizing your interfaces with real-time preview.
            </p>
            <div
              style={{
                marginTop: '16px',
                paddingTop: '16px',
                borderTop: '1px solid rgba(41, 242, 223, 0.2)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#29F2DF',
                    boxShadow: '0 0 8px #29F2DF',
                    animation: 'pulse 2s infinite',
                  }}
                />
                <span style={{ fontSize: '12px', letterSpacing: '1px', color: '#29F2DF' }}>
                  System Online
                </span>
              </div>
              <span
                style={{
                  fontSize: '12px',
                  letterSpacing: '1px',
                  color: '#29F2DF',
                  textShadow: '0 0 8px rgba(41, 242, 223, 0.5)',
                }}
              >
                ACCESS →
              </span>
            </div>
          </div>

          {/* SHOWCASE */}
          <div
            onClick={() => navigate('/showcase')}
            style={{
              position: 'relative',
              borderRadius: '8px',
              padding: '24px',
              cursor: 'pointer',
              transition: 'all 0.3s',
              background:
                'linear-gradient(135deg, rgba(40, 18, 90, 0.5) 0%, rgba(10, 18, 37, 0.7) 100%)',
              backdropFilter: 'blur(20px)',
              border: '2px solid rgba(239, 62, 241, 0.5)',
              boxShadow:
                '0 0 30px rgba(239, 62, 241, 0.15), inset 0 0 30px rgba(239, 62, 241, 0.05)',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
            }}
          >
            <div
              style={{
                fontSize: '12px',
                letterSpacing: '1px',
                color: '#EF3EF1',
                textShadow: '0 0 8px rgba(239, 62, 241, 0.4)',
                position: 'absolute',
                top: '8px',
                right: '8px',
              }}
            >
              0xDEAD
            </div>
            <h3
              style={{
                fontSize: '20px',
                marginBottom: '12px',
                letterSpacing: '2px',
                fontWeight: 'bold',
                color: '#EF3EF1',
                textShadow: '0 0 15px rgba(239, 62, 241, 0.4)',
              }}
            >
              SHOWCASE
            </h3>
            <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#C878D8' }}>
              Browse the complete component library. See all 51+ components in action with live
              examples, variations, and implementation guides.
            </p>
            <div
              style={{
                marginTop: '16px',
                paddingTop: '16px',
                borderTop: '1px solid rgba(239, 62, 241, 0.2)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#EF3EF1',
                    boxShadow: '0 0 8px #EF3EF1',
                    animation: 'pulse 2s infinite',
                  }}
                />
                <span style={{ fontSize: '12px', letterSpacing: '1px', color: '#EF3EF1' }}>
                  System Online
                </span>
              </div>
              <span
                style={{
                  fontSize: '12px',
                  letterSpacing: '1px',
                  color: '#EF3EF1',
                  textShadow: '0 0 8px rgba(239, 62, 241, 0.5)',
                }}
              >
                ACCESS →
              </span>
            </div>
          </div>

          {/* DOCUMENTATION */}
          <div
            onClick={() => navigate('/docs')}
            style={{
              position: 'relative',
              borderRadius: '8px',
              padding: '24px',
              cursor: 'pointer',
              transition: 'all 0.3s',
              background:
                'linear-gradient(135deg, rgba(40, 18, 90, 0.5) 0%, rgba(10, 18, 37, 0.7) 100%)',
              backdropFilter: 'blur(20px)',
              border: '2px solid rgba(28, 127, 166, 0.5)',
              boxShadow:
                '0 0 30px rgba(28, 127, 166, 0.15), inset 0 0 30px rgba(28, 127, 166, 0.05)',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = 'scale(1)';
            }}
          >
            <div
              style={{
                fontSize: '12px',
                letterSpacing: '1px',
                color: '#1C7FA6',
                textShadow: '0 0 8px rgba(28, 127, 166, 0.4)',
                position: 'absolute',
                top: '8px',
                right: '8px',
              }}
            >
              0xBEEF
            </div>
            <h3
              style={{
                fontSize: '20px',
                marginBottom: '12px',
                letterSpacing: '2px',
                fontWeight: 'bold',
                color: '#1C7FA6',
                textShadow: '0 0 15px rgba(28, 127, 166, 0.4)',
              }}
            >
              DOCUMENTATION
            </h3>
            <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#5BA8C8' }}>
              Complete API documentation, component guides, and integration examples. Learn how to
              use RHUDS Pro in your projects.
            </p>
            <div
              style={{
                marginTop: '16px',
                paddingTop: '16px',
                borderTop: '1px solid rgba(28, 127, 166, 0.2)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: '#1C7FA6',
                    boxShadow: '0 0 8px #1C7FA6',
                    animation: 'pulse 2s infinite',
                  }}
                />
                <span style={{ fontSize: '12px', letterSpacing: '1px', color: '#1C7FA6' }}>
                  System Online
                </span>
              </div>
              <span
                style={{
                  fontSize: '12px',
                  letterSpacing: '1px',
                  color: '#1C7FA6',
                  textShadow: '0 0 8px rgba(28, 127, 166, 0.5)',
                }}
              >
                ACCESS →
              </span>
            </div>
          </div>
        </div>
      </div>

      <footer
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 24px',
          zIndex: 50,
        }}
      >
        <div
          style={{
            padding: '8px 16px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            background: 'rgba(40, 18, 90, 0.4)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(41, 242, 223, 0.2)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#29F2DF',
                boxShadow: '0 0 6px #29F2DF',
                animation: 'pulse 2s infinite',
              }}
            />
            <span style={{ fontSize: '12px', letterSpacing: '1px', color: '#29F2DF' }}>
              Connected
            </span>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
