import React, { useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

interface CTAButtonsProps {
  onPlaySound?: (frequency: number, duration: number) => void;
  mousePosition?: { x: number; y: number };
}

export const CTAButtons: React.FC<CTAButtonsProps> = ({
  onPlaySound,
  mousePosition = { x: 0, y: 0 },
}) => {
  const navigate = useNavigate();
  const primaryButtonRef = useRef<HTMLButtonElement>(null);
  const secondaryButtonRef = useRef<HTMLButtonElement>(null);

  const handlePrimaryClick = useCallback(() => {
    onPlaySound?.(659.25, 0.2); // E5 note
    navigate('/playground');
  }, [navigate, onPlaySound]);

  const handleSecondaryClick = useCallback(() => {
    onPlaySound?.(523.25, 0.2); // C5 note
    navigate('/docs');
  }, [navigate, onPlaySound]);

  return (
    <div
      style={{
        display: 'flex',
        gap: '28px',
        flexWrap: 'wrap',
        justifyContent: 'center',
        animation: 'fadeInUp 1s ease-out 0.8s backwards',
        perspective: '1000px',
      }}
    >
      {/* Primary CTA Button */}
      <button
        ref={primaryButtonRef}
        onClick={handlePrimaryClick}
        style={{
          position: 'relative',
          padding: '22px 64px',
          fontSize: '19px',
          fontWeight: '800',
          letterSpacing: '4px',
          color: '#000',
          background: 'linear-gradient(135deg, #29F2DF 0%, #1C7FA6 100%)',
          border: 'none',
          borderRadius: '16px',
          cursor: 'pointer',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: `
            0 0 60px rgba(41, 242, 223, 0.8),
            0 12px 40px rgba(0, 0, 0, 0.5),
            0 0 100px rgba(41, 242, 223, 0.3),
            inset 0 3px 0 rgba(255, 255, 255, 0.5),
            inset 0 -3px 0 rgba(0, 0, 0, 0.4)
          `,
          overflow: 'hidden',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          transformStyle: 'preserve-3d',
          willChange: 'transform, box-shadow',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = `
            translateY(-10px) 
            scale(1.08)
            rotateX(${mousePosition.y * 3}deg)
            rotateY(${mousePosition.x * 3}deg)
          `;
          e.currentTarget.style.boxShadow = `
            0 0 100px rgba(41, 242, 223, 1),
            0 25px 80px rgba(41, 242, 223, 0.8),
            0 0 150px rgba(41, 242, 223, 0.5),
            inset 0 3px 0 rgba(255, 255, 255, 0.6)
          `;
          onPlaySound?.(587.33, 0.15); // D5 note
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0) scale(1) rotateX(0) rotateY(0)';
          e.currentTarget.style.boxShadow = `
            0 0 60px rgba(41, 242, 223, 0.8),
            0 12px 40px rgba(0, 0, 0, 0.5),
            0 0 100px rgba(41, 242, 223, 0.3),
            inset 0 3px 0 rgba(255, 255, 255, 0.5),
            inset 0 -3px 0 rgba(0, 0, 0, 0.4)
          `;
        }}
      >
        <span style={{ position: 'relative', zIndex: 1 }}>GET STARTED</span>
        {/* Advanced shine effect */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background:
              'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.7), transparent)',
            animation: 'shine 2s infinite',
            filter: 'blur(5px)',
          }}
        />
      </button>

      {/* Secondary CTA Button */}
      <button
        ref={secondaryButtonRef}
        onClick={handleSecondaryClick}
        style={{
          position: 'relative',
          padding: '22px 64px',
          fontSize: '19px',
          fontWeight: '800',
          letterSpacing: '4px',
          color: '#29F2DF',
          background: 'rgba(41, 242, 223, 0.15)',
          backdropFilter: 'blur(30px) saturate(200%)',
          border: '3px solid #29F2DF',
          borderRadius: '16px',
          cursor: 'pointer',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          overflow: 'hidden',
          boxShadow: `
            0 0 50px rgba(41, 242, 223, 0.5),
            0 0 80px rgba(41, 242, 223, 0.2),
            inset 0 3px 0 rgba(255, 255, 255, 0.2),
            inset 0 -3px 0 rgba(0, 0, 0, 0.3)
          `,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          transformStyle: 'preserve-3d',
          willChange: 'transform, box-shadow, background',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(41, 242, 223, 0.25)';
          e.currentTarget.style.transform = `
            translateY(-10px)
            rotateX(${mousePosition.y * 2}deg)
            rotateY(${mousePosition.x * 2}deg)
          `;
          e.currentTarget.style.boxShadow = `
            0 25px 60px rgba(41, 242, 223, 0.8),
            0 0 120px rgba(41, 242, 223, 0.6),
            0 0 180px rgba(41, 242, 223, 0.3),
            inset 0 3px 0 rgba(255, 255, 255, 0.3)
          `;
          e.currentTarget.style.borderColor = '#FFFFFF';
          e.currentTarget.style.color = '#FFFFFF';
          onPlaySound?.(493.88, 0.15); // B4 note
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(41, 242, 223, 0.15)';
          e.currentTarget.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
          e.currentTarget.style.boxShadow = `
            0 0 50px rgba(41, 242, 223, 0.5),
            0 0 80px rgba(41, 242, 223, 0.2),
            inset 0 3px 0 rgba(255, 255, 255, 0.2),
            inset 0 -3px 0 rgba(0, 0, 0, 0.3)
          `;
          e.currentTarget.style.borderColor = '#29F2DF';
          e.currentTarget.style.color = '#29F2DF';
        }}
      >
        <span style={{ position: 'relative', zIndex: 1 }}>VIEW DOCS</span>
        {/* Animated corner accents */}
        <div
          style={{
            position: 'absolute',
            top: '8px',
            left: '8px',
            width: '20px',
            height: '20px',
            borderTop: '3px solid currentColor',
            borderLeft: '3px solid currentColor',
            opacity: 0.7,
            animation: 'pulse 2s ease-in-out infinite',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '8px',
            right: '8px',
            width: '20px',
            height: '20px',
            borderBottom: '3px solid currentColor',
            borderRight: '3px solid currentColor',
            opacity: 0.7,
            animation: 'pulse 2s ease-in-out infinite 1s',
          }}
        />
        {/* Holographic grid overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              linear-gradient(90deg, transparent 49%, rgba(41, 242, 223, 0.1) 50%, transparent 51%),
              linear-gradient(0deg, transparent 49%, rgba(41, 242, 223, 0.1) 50%, transparent 51%)
            `,
            backgroundSize: '20px 20px',
            opacity: 0.3,
            pointerEvents: 'none',
            animation: 'gridMove 10s linear infinite',
          }}
        />
      </button>
    </div>
  );
};

CTAButtons.displayName = 'CTAButtons';
