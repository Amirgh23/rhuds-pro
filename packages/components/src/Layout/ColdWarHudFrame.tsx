import React, { CSSProperties } from 'react';
import { getRgbString, generateTechCode, ThemeVariant } from '../utils/coldWarUtils';
import { ScanlinesOverlay } from '../utils/ScanlinesOverlay';
import { GlowOverlay } from '../utils/GlowOverlay';

export interface ColdWarHudFrameProps {
  children: React.ReactNode;
  title?: string;
  theme?: ThemeVariant;
  color?: 'amber' | 'green' | 'blue' | 'red';
  scanlines?: boolean;
  glow?: boolean;
  showCorners?: boolean;
  className?: string;
  style?: CSSProperties;
}

const THEME_COLORS = {
  perseus: { primary: '#FFB000', background: '#0a0a0c', surface: '#1a1a1e' },
  greenTerminal: { primary: '#33FF00', background: '#0a0a0c', surface: '#1a1a1e' },
  satelliteView: { primary: '#00CCFF', background: '#3a3a3e', surface: '#2a2a2e' },
};

const COLOR_MAP = { amber: '#FFB000', green: '#33FF00', blue: '#00CCFF', red: '#FF3333' };

export const ColdWarHudFrame: React.FC<ColdWarHudFrameProps> = ({
  children,
  title,
  theme = 'perseus',
  color = 'amber',
  scanlines = false,
  glow = false,
  showCorners = true,
  className = '',
  style = {},
}) => {
  const themeColors = THEME_COLORS[theme];
  const frameColor = COLOR_MAP[color];
  const techCode = generateTechCode('FRAME');

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
        ...style,
      }}
    >
      {scanlines && <ScanlinesOverlay intensity="medium" />}
      {glow && <GlowOverlay color={frameColor} intensity="low" />}
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
      {showCorners && (
        <>
          <div
            style={{
              position: 'absolute',
              top: '4px',
              left: '4px',
              width: '12px',
              height: '12px',
              borderTop: `2px solid ${frameColor}`,
              borderLeft: `2px solid ${frameColor}`,
              zIndex: 10,
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              width: '12px',
              height: '12px',
              borderTop: `2px solid ${frameColor}`,
              borderRight: `2px solid ${frameColor}`,
              zIndex: 10,
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '4px',
              left: '4px',
              width: '12px',
              height: '12px',
              borderBottom: `2px solid ${frameColor}`,
              borderLeft: `2px solid ${frameColor}`,
              zIndex: 10,
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '4px',
              right: '4px',
              width: '12px',
              height: '12px',
              borderBottom: `2px solid ${frameColor}`,
              borderRight: `2px solid ${frameColor}`,
              zIndex: 10,
            }}
          />
        </>
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

export default ColdWarHudFrame;
