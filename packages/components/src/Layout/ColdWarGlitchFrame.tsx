import React, { CSSProperties, useState, useEffect } from 'react';
import { getRgbString, generateTechCode, ThemeVariant } from '../utils/coldWarUtils';
import { ScanlinesOverlay } from '../utils/ScanlinesOverlay';

export interface ColdWarGlitchFrameProps {
  children: React.ReactNode;
  title?: string;
  theme?: ThemeVariant;
  color?: 'amber' | 'green' | 'blue' | 'red';
  scanlines?: boolean;
  glow?: boolean;
  glitchIntensity?: 'low' | 'medium' | 'high';
  className?: string;
  style?: CSSProperties;
}

const THEME_COLORS = {
  perseus: { primary: '#FFB000', background: '#0a0a0c', surface: '#1a1a1e' },
  greenTerminal: { primary: '#33FF00', background: '#0a0a0c', surface: '#1a1a1e' },
  satelliteView: { primary: '#00CCFF', background: '#3a3a3e', surface: '#2a2a2e' },
};

const COLOR_MAP = { amber: '#FFB000', green: '#33FF00', blue: '#00CCFF', red: '#FF3333' };

export const ColdWarGlitchFrame: React.FC<ColdWarGlitchFrameProps> = ({
  children,
  title,
  theme = 'perseus',
  color = 'amber',
  scanlines = false,
  glow = false,
  glitchIntensity = 'medium',
  className = '',
  style = {},
}) => {
  const [glitchOffset, setGlitchOffset] = useState({ x: 0, y: 0 });
  const themeColors = THEME_COLORS[theme];
  const frameColor = COLOR_MAP[color];
  const techCode = generateTechCode('GLITCH');
  const intensityMap = { low: 1, medium: 2, high: 3 };
  const maxOffset = intensityMap[glitchIntensity];

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setGlitchOffset({
          x: (Math.random() - 0.5) * maxOffset * 2,
          y: (Math.random() - 0.5) * maxOffset * 2,
        });
        setTimeout(() => setGlitchOffset({ x: 0, y: 0 }), 100);
      }
    }, 2000);
    return () => clearInterval(interval);
  }, [maxOffset]);

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        padding: '24px',
        backgroundColor: themeColors.background,
        border: `2px solid ${frameColor}`,
        clipPath:
          'polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px)',
        overflow: 'hidden',
        transform: `translate(${glitchOffset.x}px, ${glitchOffset.y}px)`,
        transition: 'transform 100ms ease-out',
        ...style,
      }}
    >
      {scanlines && <ScanlinesOverlay intensity="medium" />}
      {title && (
        <div
          style={{
            position: 'absolute',
            top: '8px',
            left: '16px',
            fontSize: '12px',
            fontFamily: "'Share Tech Mono', monospace",
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            color: frameColor,
            zIndex: 10,
          }}
        >
          {title}
        </div>
      )}
      <div
        style={{
          position: 'absolute',
          top: '4px',
          right: '16px',
          fontSize: '8px',
          fontFamily: "'Share Tech Mono', monospace",
          color: frameColor,
          opacity: 0.5,
          zIndex: 10,
        }}
      >
        {techCode}
      </div>
      <div style={{ position: 'relative', zIndex: 5 }}>{children}</div>
    </div>
  );
};

export default ColdWarGlitchFrame;
