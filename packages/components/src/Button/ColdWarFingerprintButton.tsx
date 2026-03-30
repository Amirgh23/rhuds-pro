/**
 * Cold War Fingerprint Button Component
 * Button with animated fingerprint scanner effect
 */

import React, { CSSProperties, useState } from 'react';
import { getRgbString, generateTechCode, ThemeVariant } from '../utils/coldWarUtils';
import { ScanlinesOverlay } from '../utils/ScanlinesOverlay';

export interface ColdWarFingerprintButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
  theme?: ThemeVariant;
  glow?: boolean;
  scanlines?: boolean;
  scanlinesIntensity?: 'low' | 'medium' | 'high';
  scanAnimated?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  style?: CSSProperties;
}

const THEME_COLORS = {
  perseus: { primary: '#FFB000', secondary: '#33FF00', background: '#0a0a0c', surface: '#1a1a1e' },
  greenTerminal: {
    primary: '#33FF00',
    secondary: '#FFB000',
    background: '#0a0a0c',
    surface: '#1a1a1e',
  },
  satelliteView: {
    primary: '#00CCFF',
    secondary: '#0066CC',
    background: '#3a3a3e',
    surface: '#2a2a2e',
  },
};

const VARIANT_COLORS = {
  primary: (theme: ThemeVariant) => THEME_COLORS[theme].primary,
  secondary: (theme: ThemeVariant) => THEME_COLORS[theme].secondary,
  danger: () => '#FF3333',
  success: (theme: ThemeVariant) => THEME_COLORS[theme].secondary,
};

export const ColdWarFingerprintButton: React.FC<ColdWarFingerprintButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  theme = 'perseus',
  glow = true,
  scanlines = false,
  scanlinesIntensity = 'medium',
  scanAnimated = true,
  disabled = false,
  onClick,
  className = '',
  style = {},
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isScanning, setIsScanning] = useState(false);

  const themeColors = THEME_COLORS[theme];
  const variantColor = VARIANT_COLORS[variant](theme);
  const rgb = getRgbString(variantColor);
  const techCode = generateTechCode('FP');

  const sizeMap = {
    sm: { padding: '8px 16px', fontSize: '12px', height: '32px', iconSize: '16px' },
    md: { padding: '12px 24px', fontSize: '14px', height: '40px', iconSize: '20px' },
    lg: { padding: '16px 32px', fontSize: '16px', height: '48px', iconSize: '24px' },
  };

  const handleClick = () => {
    if (!disabled && onClick) {
      setIsScanning(true);
      setTimeout(() => setIsScanning(false), 1000);
      onClick();
    }
  };

  const buttonStyle: CSSProperties = {
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    padding: sizeMap[size].padding,
    height: sizeMap[size].height,
    fontSize: sizeMap[size].fontSize,
    fontFamily: "'Share Tech Mono', 'Roboto Mono', monospace",
    fontWeight: 500,
    textTransform: 'uppercase',
    letterSpacing: '0.03em',
    color: disabled ? '#666' : variantColor,
    backgroundColor: disabled ? themeColors.surface : themeColors.background,
    border: `1px solid ${disabled ? '#666' : variantColor}`,
    clipPath: 'polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 150ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    opacity: disabled ? 0.5 : 1,
    overflow: 'hidden',
    ...style,
  };

  if (!disabled) {
    if (isHovered) {
      buttonStyle.backgroundColor = themeColors.surface;
      buttonStyle.transform = 'scale(1.02)';
      if (glow) {
        buttonStyle.boxShadow = `0 0 20px rgba(${rgb}, 0.4), inset 0 0 20px rgba(${rgb}, 0.1)`;
      }
    }
    if (isActive) {
      buttonStyle.transform = 'scale(0.98)';
      buttonStyle.borderWidth = '2px';
    }
  }

  const fingerprintStyle: CSSProperties = {
    width: sizeMap[size].iconSize,
    height: sizeMap[size].iconSize,
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const scanLineStyle: CSSProperties = {
    position: 'absolute',
    left: 0,
    right: 0,
    height: '2px',
    backgroundColor: variantColor,
    boxShadow: `0 0 10px rgba(${rgb}, 0.8)`,
    animation: isScanning ? 'fingerprint-scan 1s ease-in-out' : 'none',
    opacity: isScanning ? 1 : 0,
    pointerEvents: 'none',
  };

  const contentStyle: CSSProperties = {
    position: 'relative',
    zIndex: 10,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  const techCodeStyle: CSSProperties = {
    position: 'absolute',
    top: '2px',
    right: '4px',
    fontSize: '8px',
    color: disabled ? '#666' : variantColor,
    opacity: 0.5,
    pointerEvents: 'none',
    zIndex: 15,
  };

  return (
    <>
      <style>
        {`
          @keyframes fingerprint-scan {
            0% { top: 0; opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { top: 100%; opacity: 0; }
          }
        `}
      </style>
      <button
        className={className}
        style={buttonStyle}
        onClick={handleClick}
        disabled={disabled}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseDown={() => setIsActive(true)}
        onMouseUp={() => setIsActive(false)}
        aria-label={typeof children === 'string' ? children : undefined}
      >
        {/* Scanlines */}
        {scanlines && !disabled && <ScanlinesOverlay intensity={scanlinesIntensity} />}

        {/* Tech Code */}
        <span style={techCodeStyle}>{techCode}</span>

        {/* Content */}
        <span style={contentStyle}>
          {/* Fingerprint Icon */}
          <div style={fingerprintStyle}>
            <svg
              width={sizeMap[size].iconSize}
              height={sizeMap[size].iconSize}
              viewBox="0 0 24 24"
              fill="none"
              stroke={disabled ? '#666' : variantColor}
              strokeWidth="2"
            >
              <path d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
            </svg>
            {/* Scan Line */}
            <div style={scanLineStyle} />
          </div>
          {children}
        </span>
      </button>
    </>
  );
};

export default ColdWarFingerprintButton;
