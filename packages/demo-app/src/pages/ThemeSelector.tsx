import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ColdWarButton } from '@rhuds/components';
import { TacticalMotionBackground } from '../components/TacticalMotionBackground';

export const ThemeSelector: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Split Background */}
      {/* Left Side - RHUDS with Neon Animation */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '50%',
          height: '100%',
          background: '#0A1225',
          zIndex: 0,
          overflow: 'hidden',
        }}
      >
        {/* Animated gradient mesh */}
        <svg
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            filter: 'blur(40px)',
            opacity: 0.6,
          }}
          viewBox="0 0 600 800"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <filter id="gooey-left">
              <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <circle
            cx="150"
            cy="150"
            r="120"
            fill="rgba(41, 242, 223, 0.3)"
            filter="url(#gooey-left)"
          >
            <animate attributeName="cx" values="150;250;150" dur="15s" repeatCount="indefinite" />
            <animate attributeName="cy" values="150;250;150" dur="15s" repeatCount="indefinite" />
            <animate attributeName="r" values="120;150;120" dur="15s" repeatCount="indefinite" />
          </circle>

          <circle
            cx="450"
            cy="600"
            r="150"
            fill="rgba(239, 62, 241, 0.25)"
            filter="url(#gooey-left)"
          >
            <animate attributeName="cx" values="450;350;450" dur="18s" repeatCount="indefinite" />
            <animate attributeName="cy" values="600;500;600" dur="18s" repeatCount="indefinite" />
            <animate attributeName="r" values="150;180;150" dur="18s" repeatCount="indefinite" />
          </circle>

          <circle
            cx="300"
            cy="400"
            r="130"
            fill="rgba(28, 127, 166, 0.2)"
            filter="url(#gooey-left)"
          >
            <animate attributeName="cx" values="300;400;300" dur="20s" repeatCount="indefinite" />
            <animate attributeName="cy" values="400;300;400" dur="20s" repeatCount="indefinite" />
            <animate attributeName="r" values="130;160;130" dur="20s" repeatCount="indefinite" />
          </circle>
        </svg>

        {/* Grid overlay */}
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backgroundImage: `
              linear-gradient(0deg, rgba(41, 242, 223, 0.08) 1px, transparent 1px),
              linear-gradient(90deg, rgba(41, 242, 223, 0.08) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            animation: 'gridScroll 30s linear infinite',
          }}
        />

        {/* Floating particles */}
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            overflow: 'hidden',
          }}
        >
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: '2px',
                height: '2px',
                background: i % 2 === 0 ? 'rgba(41, 242, 223, 0.6)' : 'rgba(239, 62, 241, 0.6)',
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `floatNeon ${8 + Math.random() * 4}s ease-in-out infinite`,
                boxShadow:
                  i % 2 === 0
                    ? '0 0 10px rgba(41, 242, 223, 0.8)'
                    : '0 0 10px rgba(239, 62, 241, 0.8)',
              }}
            />
          ))}
        </div>

        {/* Pulsing glow */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(41, 242, 223, 0.15) 0%, transparent 70%)',
            filter: 'blur(60px)',
            animation: 'neonPulse 6s ease-in-out infinite',
          }}
        />
      </div>

      {/* Right Side - Cold War with Tactical HUD Animation */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '50%',
          height: '100%',
          background: '#0a0a0c',
          zIndex: 0,
          overflow: 'hidden',
          clipPath: 'inset(0 0 0 0)',
        }}
        data-theme="perseus"
      >
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          {/* Background layers without radar */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: 0,
            }}
          >
            {/* Grid layer */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundImage: `
                  linear-gradient(0deg, rgba(255, 176, 0, 0.08) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255, 176, 0, 0.08) 1px, transparent 1px)
                `,
                backgroundSize: '60px 60px',
                animation: 'gridPan 20s linear infinite',
              }}
            />

            {/* Scanlines */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundImage:
                  'repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.15) 1px, transparent 1px, transparent 2px)',
                opacity: 0.03,
              }}
            />

            {/* Vignette */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background:
                  'radial-gradient(ellipse at center, transparent 0%, rgba(0, 0, 0, 0.4) 100%)',
                opacity: 0.5,
              }}
            />
          </div>

          {/* Centered Radar */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '400px',
              height: '400px',
              zIndex: 1,
              opacity: 0.6,
            }}
          >
            {/* Radar circles */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '100%',
                height: '100%',
                border: '1px solid rgba(255, 176, 0, 0.3)',
                borderRadius: '50%',
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '75%',
                height: '75%',
                border: '1px solid rgba(255, 176, 0, 0.2)',
                borderRadius: '50%',
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '50%',
                height: '50%',
                border: '1px solid rgba(255, 176, 0, 0.2)',
                borderRadius: '50%',
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '25%',
                height: '25%',
                border: '1px solid rgba(255, 176, 0, 0.2)',
                borderRadius: '50%',
              }}
            />

            {/* Radar crosshair */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: 0,
                width: '100%',
                height: '1px',
                background: 'rgba(255, 176, 0, 0.2)',
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: '50%',
                width: '1px',
                height: '100%',
                background: 'rgba(255, 176, 0, 0.2)',
              }}
            />

            {/* Radar sweep */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background:
                  'conic-gradient(from 0deg, rgba(255, 176, 0, 0.4) 0deg, rgba(255, 176, 0, 0.1) 30deg, transparent 60deg)',
                borderRadius: '50%',
                animation: 'radarSweep 8s linear infinite',
                filter: 'blur(2px)',
              }}
            />

            {/* Center dot */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '8px',
                height: '8px',
                background: '#FFB000',
                borderRadius: '50%',
                boxShadow: '0 0 10px rgba(255, 176, 0, 0.8)',
              }}
            />
          </div>
        </div>
      </div>

      {/* Center Divider */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '2px',
          height: '100%',
          background:
            'linear-gradient(to bottom, transparent, #29F2DF 20%, #FFB000 80%, transparent)',
          boxShadow: '0 0 20px rgba(41, 242, 223, 0.5), 0 0 40px rgba(255, 176, 0, 0.3)',
          zIndex: 2,
        }}
      />

      {/* Content Container */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          width: '100%',
          height: '100%',
        }}
      >
        {/* RHUDS Side */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            minHeight: '100vh',
          }}
        >
          <div
            style={{
              textAlign: 'center',
              maxWidth: '500px',
            }}
          >
            <h1
              style={{
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                fontWeight: 700,
                color: '#29F2DF',
                marginBottom: '1rem',
                textShadow: '0 0 20px rgba(41, 242, 223, 0.5)',
                fontFamily: "'Orbitron', sans-serif",
              }}
            >
              RHUDS PRO
            </h1>
            <p
              style={{
                fontSize: 'clamp(1rem, 2vw, 1.2rem)',
                color: 'rgba(255, 255, 255, 0.8)',
                marginBottom: '2rem',
                lineHeight: 1.6,
              }}
            >
              Professional HUD Design System
            </p>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                alignItems: 'center',
                marginBottom: '2.5rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: '#29F2DF', fontSize: '1.5rem' }}>⬢</span>
                <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Futuristic Components</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: '#29F2DF', fontSize: '1.5rem' }}>⬢</span>
                <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Glass Morphism</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: '#29F2DF', fontSize: '1.5rem' }}>⬢</span>
                <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>Neon Effects</span>
              </div>
            </div>
            <button
              onClick={() => navigate('/intro')}
              style={{
                padding: '1.5rem 3rem',
                fontSize: '1.2rem',
                fontWeight: 700,
                color: '#0A1225',
                background: '#29F2DF',
                border: 'none',
                cursor: 'pointer',
                clipPath:
                  'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))',
                transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                boxShadow: '0 0 20px rgba(41, 242, 223, 0.5)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 0 30px rgba(41, 242, 223, 0.8)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 0 20px rgba(41, 242, 223, 0.5)';
              }}
            >
              Enter RHUDS
            </button>
          </div>
        </div>

        {/* Cold War Side */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            minHeight: '100vh',
          }}
          data-theme="perseus"
        >
          <div
            style={{
              textAlign: 'center',
              maxWidth: '500px',
            }}
          >
            <h1
              style={{
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                fontWeight: 700,
                color: '#FFB000',
                marginBottom: '1rem',
                textShadow: '0 0 20px rgba(255, 176, 0, 0.5)',
                fontFamily: "'Share Tech Mono', monospace",
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}
            >
              COLD WAR
            </h1>
            <p
              style={{
                fontSize: 'clamp(1rem, 2vw, 1.2rem)',
                color: 'rgba(255, 255, 255, 0.8)',
                marginBottom: '2rem',
                lineHeight: 1.6,
                fontFamily: "'Share Tech Mono', monospace",
              }}
            >
              Tactical Military HUD System
            </p>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                alignItems: 'center',
                marginBottom: '2.5rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: '#FFB000', fontSize: '1.5rem' }}>▸</span>
                <span
                  style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontFamily: "'Share Tech Mono', monospace",
                  }}
                >
                  Tactical Components
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: '#FFB000', fontSize: '1.5rem' }}>▸</span>
                <span
                  style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontFamily: "'Share Tech Mono', monospace",
                  }}
                >
                  Military Aesthetics
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: '#FFB000', fontSize: '1.5rem' }}>▸</span>
                <span
                  style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontFamily: "'Share Tech Mono', monospace",
                  }}
                >
                  Chamfered Corners
                </span>
              </div>
            </div>
            <ColdWarButton
              theme="perseus"
              variant="primary"
              size="lg"
              onClick={() => navigate('/coldwar-intro')}
              style={{
                fontSize: '1.2rem',
                padding: '1.5rem 3rem',
              }}
            >
              ENTER COLD WAR
            </ColdWarButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeSelector;

// Inline styles for animations
const styles = `
  @keyframes gridScroll {
    0% { transform: translateY(0); }
    100% { transform: translateY(60px); }
  }

  @keyframes floatNeon {
    0%, 100% { transform: translate(0, 0); opacity: 0; }
    10% { opacity: 1; }
    90% { opacity: 1; }
    100% { transform: translate(100px, -100px); opacity: 0; }
  }

  @keyframes neonPulse {
    0%, 100% { opacity: 0.4; transform: translate(-50%, -50%) scale(1); }
    50% { opacity: 0.8; transform: translate(-50%, -50%) scale(1.2); }
  }

  @keyframes radarSweep {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @keyframes gridPan {
    0% { transform: translate3d(0, 0, 0); }
    100% { transform: translate3d(60px, 60px, 0); }
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}
