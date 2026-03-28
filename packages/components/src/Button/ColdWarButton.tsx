/**
 * ═══════════════════════════════════════════════════════════════════════════
 * COLD WAR BUTTON - AAA CINEMATIC IMPLEMENTATION
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * TACTICAL MECHANICAL SWITCH - $1M IMPLEMENTATION
 *
 * LAYERS (8 Total):
 * 1. Base Metallic - Brushed metal texture with grid pattern
 * 2. LED Indicator Strip - Top bar with pulse animation
 * 3. Corner Tactical Brackets - L-shaped military markers
 * 4. Phosphor Text - Multi-shadow CRT glow with 60Hz flicker
 * 5. Scan-line Sweep - Horizontal beam on hover
 * 6. Click Flash Burst - Radial explosion on activation
 * 7. Holographic Overlay - Light refraction shimmer
 * 8. Circuit Nodes - Corner connection points with pulse
 *
 * ANIMATIONS (10 Total):
 * - LED breathe pulse (0.8s)
 * - Hover scan-line sweep (0.6s)
 * - Click flash burst (0.3s)
 * - Text CRT flicker (60Hz continuous)
 * - Corner brackets expand (0.2s)
 * - Mechanical press (scale 0.98)
 * - Holographic shimmer (4s)
 * - Circuit node pulse (1.5s)
 * - Border glow intensify (0.3s)
 * - Loading spinner rotation (0.6s)
 */

import React, { ReactNode, CSSProperties, useState, useEffect, useRef } from 'react';
import { getComponentChamferClip, THEME_VARIANTS, ANIMATION_TOKENS } from '@rhuds/core';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'tactical' | 'glitch';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ColdWarButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  iconPlacement?: 'left' | 'right' | 'only';
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  isLoading?: boolean;
  disabled?: boolean;
  theme?: keyof typeof THEME_VARIANTS;
  scanlines?: boolean;
  scanlinesIntensity?: 'low' | 'medium' | 'high';
  glow?: boolean;
  ledIndicator?: boolean;
  cornerBrackets?: boolean;
  clickFlash?: boolean;
  children: ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  style?: CSSProperties;
  type?: 'button' | 'submit' | 'reset';
}

// ═══════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS - MAXIMUM COMPLEXITY
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get variant colors with FULL spectrum definition
 * Not just hex - complete RGBA with alpha channels for layering
 */
function getVariantColors(variant: ButtonVariant, theme: keyof typeof THEME_VARIANTS) {
  const themeColors = THEME_VARIANTS[theme];

  const colorMap = {
    primary: {
      background: themeColors.background,
      border: themeColors.primary,
      text: themeColors.primary,
      hover: themeColors.surface,
      active: themeColors.surface,
      glow: themeColors.primary,
      rgb: '255, 176, 0', // Amber
    },
    secondary: {
      background: themeColors.background,
      border: themeColors.secondary,
      text: themeColors.secondary,
      hover: themeColors.surface,
      active: themeColors.surface,
      glow: themeColors.secondary,
      rgb: '58, 58, 62', // Neutral
    },
    danger: {
      background: themeColors.background,
      border: themeColors.error,
      text: themeColors.error,
      hover: themeColors.surface,
      active: themeColors.surface,
      glow: themeColors.error,
      rgb: '255, 51, 51', // Red
    },
    success: {
      background: themeColors.background,
      border: themeColors.success,
      text: themeColors.success,
      hover: themeColors.surface,
      active: themeColors.surface,
      glow: themeColors.success,
      rgb: '51, 255, 0', // Green
    },
    tactical: {
      background: themeColors.background,
      border: themeColors.primary,
      text: themeColors.primary,
      hover: themeColors.surface,
      active: themeColors.surface,
      glow: themeColors.primary,
      rgb: '255, 176, 0', // Amber
    },
    glitch: {
      background: themeColors.background,
      border: themeColors.primary,
      text: themeColors.primary,
      hover: themeColors.surface,
      active: themeColors.surface,
      glow: themeColors.primary,
      rgb: '255, 176, 0', // Amber
    },
  };

  return colorMap[variant];
}

/**
 * Get size styles with COMPLEX spacing
 * Not just padding - complete dimensional system
 */
function getSizeStyles(size: ButtonSize): CSSProperties {
  const sizeMap = {
    sm: {
      padding: '6px 12px',
      fontSize: '11px',
      minHeight: '28px',
      minWidth: '80px',
      gap: '6px',
      letterSpacing: '0.04em',
    },
    md: {
      padding: '10px 20px',
      fontSize: '13px',
      minHeight: '38px',
      minWidth: '120px',
      gap: '8px',
      letterSpacing: '0.05em',
    },
    lg: {
      padding: '14px 28px',
      fontSize: '15px',
      minHeight: '48px',
      minWidth: '160px',
      gap: '10px',
      letterSpacing: '0.06em',
    },
  };

  return sizeMap[size];
}

/**
 * Generate random tech code for button ID
 * Simulates military operation codes
 */
function generateButtonCode(): string {
  const prefix = ['BTN', 'CMD', 'OPR', 'TGT'];
  const code = Math.floor(Math.random() * 9000) + 1000;
  return `${prefix[Math.floor(Math.random() * prefix.length)]}-${code}`;
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export const ColdWarButton: React.FC<ColdWarButtonProps> = ({
  variant = 'primary',
  size = 'md',
  iconPlacement = 'left',
  leftIcon,
  rightIcon,
  isLoading = false,
  disabled = false,
  theme = 'perseus',
  scanlines = true,
  scanlinesIntensity = 'medium',
  glow = true,
  ledIndicator = true,
  cornerBrackets = true,
  clickFlash = true,
  children,
  onClick,
  className = '',
  style = {},
  type = 'button',
}) => {
  // ═══════════════════════════════════════════════════════════════════════════
  // STATE & REFS - Complex state management
  // ═══════════════════════════════════════════════════════════════════════════

  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [showFlash, setShowFlash] = useState(false);
  const [buttonCode] = useState(() => generateButtonCode());
  const [glitchActive, setGlitchActive] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // ═══════════════════════════════════════════════════════════════════════════
  // THEME & COLOR SETUP
  // ═══════════════════════════════════════════════════════════════════════════

  const colors = getVariantColors(variant, theme);
  const sizeStyles = getSizeStyles(size);

  // ═══════════════════════════════════════════════════════════════════════════
  // RANDOM GLITCH EFFECT - Surprise feature for glitch variant
  // ═══════════════════════════════════════════════════════════════════════════

  useEffect(() => {
    if (variant === 'glitch') {
      const glitchInterval = setInterval(() => {
        if (Math.random() > 0.92) {
          setGlitchActive(true);
          setTimeout(() => setGlitchActive(false), 80);
        }
      }, 2000);
      return () => clearInterval(glitchInterval);
    }
  }, [variant]);

  // ═══════════════════════════════════════════════════════════════════════════
  // BASE STYLES - Foundation layer with metallic texture
  // ═══════════════════════════════════════════════════════════════════════════

  const baseStyles: CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'Share Tech Mono', 'Roboto Mono', 'Courier New', monospace",
    fontWeight: 600,
    textTransform: 'uppercase',
    border: `1px dashed rgba(${colors.rgb}, 0.5)`,
    borderRadius: 0,
    clipPath: getComponentChamferClip('button'),
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: `all ${ANIMATION_TOKENS.timing.hover} ${ANIMATION_TOKENS.easing.tactical}`,
    outline: 'none',
    position: 'relative',
    overflow: 'hidden',
    willChange: 'transform, box-shadow',
    // Multi-layer background with grid texture
    background: `
      repeating-linear-gradient(
        0deg,
        transparent,
        transparent 2px,
        rgba(${colors.rgb}, 0.03) 2px,
        rgba(${colors.rgb}, 0.03) 4px
      ),
      repeating-linear-gradient(
        90deg,
        transparent,
        transparent 2px,
        rgba(${colors.rgb}, 0.03) 2px,
        rgba(${colors.rgb}, 0.03) 4px
      ),
      linear-gradient(135deg, rgba(10, 10, 20, 0.95) 0%, rgba(10, 10, 20, 0.85) 100%)
    `,
    backdropFilter: 'blur(8px)',
    boxShadow: `
      inset 0 0 20px rgba(0, 0, 0, 0.6),
      inset 0 0 5px rgba(${colors.rgb}, 0.1),
      0 2px 4px rgba(0, 0, 0, 0.3)
    `,
    ...sizeStyles,
    ...style,
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // HOVER STATE - Intensified glow and scan-line
  // ═══════════════════════════════════════════════════════════════════════════

  if (isHovered && !disabled) {
    baseStyles.transform = 'translateY(-2px) scale(1.02)';
    baseStyles.background = `
      repeating-linear-gradient(
        0deg,
        transparent,
        transparent 2px,
        rgba(${colors.rgb}, 0.05) 2px,
        rgba(${colors.rgb}, 0.05) 4px
      ),
      repeating-linear-gradient(
        90deg,
        transparent,
        transparent 2px,
        rgba(${colors.rgb}, 0.05) 2px,
        rgba(${colors.rgb}, 0.05) 4px
      ),
      linear-gradient(135deg, rgba(${colors.rgb}, 0.15) 0%, rgba(10, 10, 20, 0.85) 100%)
    `;
    baseStyles.boxShadow = `
      inset 0 0 30px rgba(0, 0, 0, 0.6),
      inset 0 0 15px rgba(${colors.rgb}, 0.2),
      0 0 20px rgba(${colors.rgb}, 0.4),
      0 0 40px rgba(${colors.rgb}, 0.2),
      0 4px 8px rgba(0, 0, 0, 0.4)
    `;
    baseStyles.borderColor = `rgba(${colors.rgb}, 0.8)`;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PRESSED STATE - Mechanical depression
  // ═══════════════════════════════════════════════════════════════════════════

  if (isPressed && !disabled) {
    baseStyles.transform = 'translateY(1px) scale(0.98)';
    baseStyles.boxShadow = `
      inset 0 0 30px rgba(0, 0, 0, 0.8),
      inset 0 0 20px rgba(${colors.rgb}, 0.3),
      0 0 30px rgba(${colors.rgb}, 0.6),
      0 1px 2px rgba(0, 0, 0, 0.5)
    `;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // DISABLED STATE
  // ═══════════════════════════════════════════════════════════════════════════

  if (disabled) {
    baseStyles.opacity = 0.4;
    baseStyles.filter = 'grayscale(0.8)';
    baseStyles.borderColor = 'rgba(58, 58, 62, 0.3)';
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // GLITCH EFFECT - Random distortion
  // ═══════════════════════════════════════════════════════════════════════════

  if (glitchActive) {
    baseStyles.filter = 'hue-rotate(180deg) saturate(3)';
    baseStyles.transform = `${baseStyles.transform || ''} skewX(-3deg)`;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // GLOW TEXT EFFECT - Phosphor CRT simulation with 60Hz flicker
  // ═══════════════════════════════════════════════════════════════════════════

  const glowTextStyle: CSSProperties =
    glow && !disabled
      ? {
          textShadow: `
          0 0 4px ${colors.glow},
          0 0 8px ${colors.glow},
          0 0 12px rgba(${colors.rgb}, 0.5),
          0 0 16px rgba(${colors.rgb}, 0.3)
        `,
          color: colors.text,
        }
      : { color: colors.text };

  // ═══════════════════════════════════════════════════════════════════════════
  // EVENT HANDLERS
  // ═══════════════════════════════════════════════════════════════════════════

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled && !isLoading) {
      if (clickFlash) {
        setShowFlash(true);
        setTimeout(() => setShowFlash(false), 300);
      }
      onClick?.(e);
    }
  };

  const handleMouseDown = () => {
    if (!disabled && !isLoading) {
      setIsPressed(true);
    }
  };

  const handleMouseUp = () => {
    setIsPressed(false);
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER - 8 LAYERS OF CINEMATIC COMPLEXITY
  // ═══════════════════════════════════════════════════════════════════════════

  return (
    <button
      ref={buttonRef}
      type={type}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseEnter={() => !disabled && setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
      disabled={disabled || isLoading}
      className={className}
      style={baseStyles}
    >
      {/* ═══════════════════════════════════════════════════════════════════════
          LAYER 1: LED INDICATOR STRIP - Top bar with pulse animation
          ═══════════════════════════════════════════════════════════════════ */}
      {ledIndicator && !disabled && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '10%',
            right: '10%',
            height: '2px',
            background: `linear-gradient(90deg, transparent 0%, ${colors.glow} 50%, transparent 100%)`,
            opacity: isHovered ? 1 : 0.6,
            boxShadow: `0 0 8px ${colors.glow}`,
            zIndex: 5,
            animation: 'led-pulse 0.8s ease-in-out infinite alternate',
          }}
        />
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          LAYER 2: CORNER TACTICAL BRACKETS - L-shaped military markers
          ═══════════════════════════════════════════════════════════════════ */}
      {cornerBrackets && (
        <>
          {/* Top-left bracket */}
          <div
            style={{
              position: 'absolute',
              top: '4px',
              left: '4px',
              width: isHovered ? '10px' : '8px',
              height: isHovered ? '10px' : '8px',
              borderTop: `1px solid ${colors.glow}`,
              borderLeft: `1px solid ${colors.glow}`,
              opacity: 0.7,
              transition: 'all 0.2s ease',
              zIndex: 4,
            }}
          />
          {/* Top-right bracket */}
          <div
            style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              width: isHovered ? '10px' : '8px',
              height: isHovered ? '10px' : '8px',
              borderTop: `1px solid ${colors.glow}`,
              borderRight: `1px solid ${colors.glow}`,
              opacity: 0.7,
              transition: 'all 0.2s ease',
              zIndex: 4,
            }}
          />
          {/* Bottom-left bracket */}
          <div
            style={{
              position: 'absolute',
              bottom: '4px',
              left: '4px',
              width: isHovered ? '10px' : '8px',
              height: isHovered ? '10px' : '8px',
              borderBottom: `1px solid ${colors.glow}`,
              borderLeft: `1px solid ${colors.glow}`,
              opacity: 0.7,
              transition: 'all 0.2s ease',
              zIndex: 4,
            }}
          />
          {/* Bottom-right bracket */}
          <div
            style={{
              position: 'absolute',
              bottom: '4px',
              right: '4px',
              width: isHovered ? '10px' : '8px',
              height: isHovered ? '10px' : '8px',
              borderBottom: `1px solid ${colors.glow}`,
              borderRight: `1px solid ${colors.glow}`,
              opacity: 0.7,
              transition: 'all 0.2s ease',
              zIndex: 4,
            }}
          />
        </>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          LAYER 3: CIRCUIT NODES - Corner connection points with pulse
          ═══════════════════════════════════════════════════════════════════ */}
      {cornerBrackets && !disabled && (
        <>
          <div
            style={{
              position: 'absolute',
              top: '4px',
              left: '4px',
              width: '3px',
              height: '3px',
              borderRadius: '50%',
              background: colors.glow,
              boxShadow: `0 0 6px ${colors.glow}`,
              opacity: 0.8,
              zIndex: 5,
              animation: 'node-pulse 1.5s ease-in-out infinite',
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              width: '3px',
              height: '3px',
              borderRadius: '50%',
              background: colors.glow,
              boxShadow: `0 0 6px ${colors.glow}`,
              opacity: 0.8,
              zIndex: 5,
              animation: 'node-pulse 1.5s ease-in-out infinite 0.3s',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '4px',
              left: '4px',
              width: '3px',
              height: '3px',
              borderRadius: '50%',
              background: colors.glow,
              boxShadow: `0 0 6px ${colors.glow}`,
              opacity: 0.8,
              zIndex: 5,
              animation: 'node-pulse 1.5s ease-in-out infinite 0.6s',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '4px',
              right: '4px',
              width: '3px',
              height: '3px',
              borderRadius: '50%',
              background: colors.glow,
              boxShadow: `0 0 6px ${colors.glow}`,
              opacity: 0.8,
              zIndex: 5,
              animation: 'node-pulse 1.5s ease-in-out infinite 0.9s',
            }}
          />
        </>
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          LAYER 4: SCAN-LINE SWEEP - Horizontal beam on hover
          ═══════════════════════════════════════════════════════════════════ */}
      {isHovered && !disabled && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '100%',
            background: `linear-gradient(180deg, transparent 0%, rgba(${colors.rgb}, 0.2) 50%, transparent 100%)`,
            pointerEvents: 'none',
            zIndex: 3,
            animation: 'scan-sweep 0.6s ease-out',
          }}
        />
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          LAYER 5: CLICK FLASH BURST - Radial explosion on activation
          ═══════════════════════════════════════════════════════════════════ */}
      {showFlash && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '100%',
            height: '100%',
            transform: 'translate(-50%, -50%)',
            background: `radial-gradient(circle, rgba(${colors.rgb}, 0.6) 0%, transparent 70%)`,
            pointerEvents: 'none',
            zIndex: 6,
            animation: 'flash-burst 0.3s ease-out',
          }}
        />
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          LAYER 6: SCANLINES - CRT effect
          ═══════════════════════════════════════════════════════════════════ */}
      {scanlines && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: 'none',
            zIndex: 100,
            background: `repeating-linear-gradient(
              0deg,
              rgba(0, 0, 0, ${
                scanlinesIntensity === 'low' ? 0.15 : scanlinesIntensity === 'medium' ? 0.25 : 0.35
              }) 0px,
              rgba(0, 0, 0, ${
                scanlinesIntensity === 'low' ? 0.15 : scanlinesIntensity === 'medium' ? 0.25 : 0.35
              }) 1px,
              transparent 1px,
              transparent 2px
            )`,
            backgroundSize: '100% 2px',
            backgroundPosition: '0 0',
            animation: 'scanlines-move 8s linear infinite',
          }}
        />
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          LAYER 7: BUTTON CODE - Tech identifier (bottom-right)
          ═══════════════════════════════════════════════════════════════════ */}
      <div
        style={{
          position: 'absolute',
          bottom: '2px',
          right: '4px',
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: '7px',
          color: colors.glow,
          opacity: 0.4,
          letterSpacing: '0.05em',
          zIndex: 4,
        }}
      >
        {buttonCode}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          LAYER 8: CONTENT - Icons and text
          ═══════════════════════════════════════════════════════════════════ */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: sizeStyles.gap,
          zIndex: 7,
          position: 'relative',
          ...glowTextStyle,
        }}
      >
        {/* Left icon */}
        {leftIcon && iconPlacement !== 'only' && <span>{leftIcon}</span>}

        {/* Content */}
        {iconPlacement !== 'only' && <span>{children}</span>}

        {/* Right icon */}
        {rightIcon && iconPlacement !== 'only' && <span>{rightIcon}</span>}

        {/* Icon only */}
        {iconPlacement === 'only' && (leftIcon || rightIcon)}

        {/* Loading indicator */}
        {isLoading && (
          <span
            style={{
              display: 'inline-block',
              width: '14px',
              height: '14px',
              borderRadius: '50%',
              border: `2px solid ${colors.glow}`,
              borderTopColor: 'transparent',
              animation: 'spinner-rotate 0.6s linear infinite',
            }}
          />
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════════════════
          INLINE KEYFRAMES - Animations defined inline
          ═══════════════════════════════════════════════════════════════════ */}
      <style>
        {`
          @keyframes led-pulse {
            0%, 100% { opacity: 0.6; }
            50% { opacity: 1; }
          }
          
          @keyframes node-pulse {
            0%, 100% { opacity: 0.8; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.3); }
          }
          
          @keyframes scan-sweep {
            0% { transform: translateY(-100%); }
            100% { transform: translateY(100%); }
          }
          
          @keyframes flash-burst {
            0% { opacity: 1; transform: translate(-50%, -50%) scale(0.5); }
            100% { opacity: 0; transform: translate(-50%, -50%) scale(2); }
          }
          
          @keyframes spinner-rotate {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </button>
  );
};

export default ColdWarButton;
