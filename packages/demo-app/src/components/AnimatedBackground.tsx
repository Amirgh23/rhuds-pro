import React from 'react';

export const AnimatedBackground: React.FC = () => {
  return (
    <>
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}>
        {/* Base dark background */}
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: '#0A1225',
        }} />

        {/* Animated gradient mesh */}
        <svg
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            filter: 'blur(40px)',
            opacity: 0.6,
          }}
          viewBox="0 0 1200 800"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <filter id="gooey">
              <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Animated circles */}
          <circle cx="200" cy="150" r="150" fill="rgba(41, 242, 223, 0.3)" filter="url(#gooey)">
            <animate attributeName="cx" values="200;300;200" dur="15s" repeatCount="indefinite" />
            <animate attributeName="cy" values="150;250;150" dur="15s" repeatCount="indefinite" />
            <animate attributeName="r" values="150;180;150" dur="15s" repeatCount="indefinite" />
          </circle>

          <circle cx="1000" cy="600" r="200" fill="rgba(239, 62, 241, 0.25)" filter="url(#gooey)">
            <animate attributeName="cx" values="1000;900;1000" dur="18s" repeatCount="indefinite" />
            <animate attributeName="cy" values="600;500;600" dur="18s" repeatCount="indefinite" />
            <animate attributeName="r" values="200;230;200" dur="18s" repeatCount="indefinite" />
          </circle>

          <circle cx="600" cy="400" r="180" fill="rgba(28, 127, 166, 0.2)" filter="url(#gooey)">
            <animate attributeName="cx" values="600;700;600" dur="20s" repeatCount="indefinite" />
            <animate attributeName="cy" values="400;300;400" dur="20s" repeatCount="indefinite" />
            <animate attributeName="r" values="180;210;180" dur="20s" repeatCount="indefinite" />
          </circle>

          <circle cx="300" cy="700" r="160" fill="rgba(41, 242, 223, 0.2)" filter="url(#gooey)">
            <animate attributeName="cx" values="300;400;300" dur="17s" repeatCount="indefinite" />
            <animate attributeName="cy" values="700;600;700" dur="17s" repeatCount="indefinite" />
            <animate attributeName="r" values="160;190;160" dur="17s" repeatCount="indefinite" />
          </circle>
        </svg>

        {/* Grid overlay */}
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backgroundImage: `
            linear-gradient(0deg, rgba(41, 242, 223, 0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(41, 242, 223, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
          animation: 'gridScroll 30s linear infinite',
        }} />

        {/* Animated scan lines */}
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backgroundImage: 'repeating-linear-gradient(0deg, rgba(41, 242, 223, 0.05) 0px, rgba(41, 242, 223, 0.05) 2px, transparent 2px, transparent 4px)',
          animation: 'scanMove 8s linear infinite',
          pointerEvents: 'none',
        }} />

        {/* Floating particles */}
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
        }}>
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: '2px',
                height: '2px',
                background: i % 2 === 0 ? 'rgba(41, 242, 223, 0.6)' : 'rgba(239, 62, 241, 0.6)',
                borderRadius: '50%',
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float${i % 3} ${8 + Math.random() * 4}s ease-in-out infinite`,
                boxShadow: i % 2 === 0 ? '0 0 10px rgba(41, 242, 223, 0.8)' : '0 0 10px rgba(239, 62, 241, 0.8)',
              }}
            />
          ))}
        </div>

        {/* Pulsing center glow */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '800px',
          height: '800px',
          background: 'radial-gradient(circle, rgba(41, 242, 223, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(60px)',
          animation: 'centerPulse 6s ease-in-out infinite',
        }} />
      </div>

      <style>{`
        @keyframes gridScroll {
          0% { transform: translateY(0); }
          100% { transform: translateY(60px); }
        }

        @keyframes scanMove {
          0% { transform: translateY(0); }
          100% { transform: translateY(10px); }
        }

        @keyframes centerPulse {
          0%, 100% { opacity: 0.4; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.8; transform: translate(-50%, -50%) scale(1.2); }
        }

        @keyframes float0 {
          0%, 100% { transform: translate(0, 0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translate(100px, -100px); opacity: 0; }
        }

        @keyframes float1 {
          0%, 100% { transform: translate(0, 0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translate(-80px, -120px); opacity: 0; }
        }

        @keyframes float2 {
          0%, 100% { transform: translate(0, 0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translate(120px, -80px); opacity: 0; }
        }
      `}</style>
    </>
  );
};
