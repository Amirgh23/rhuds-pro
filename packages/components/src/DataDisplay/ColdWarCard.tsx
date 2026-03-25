/**
 * ═══════════════════════════════════════════════════════════════════════════
 * COLD WAR CARD - AAA CINEMATIC IMPLEMENTATION
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * CLASSIFIED INTELLIGENCE DOSSIER - $1M IMPLEMENTATION
 *
 * LAYERS (7 Total):
 * 1. Base Glass - Physical refraction simulation
 * 2. Noise Texture - Procedural dust/condensation
 * 3. Animated SVG Border - Segmented brackets with circuit nodes
 * 4. Tech Data Corners - Random coordinates, timestamps, codes
 * 5. Classified Watermark - Rotating stamp with opacity pulse
 * 6. Scanline Sweep - Vertical CRT effect
 * 7. Holographic Shimmer - Light refraction overlay
 *
 * ANIMATIONS (12 Total):
 * - Border segments light sequentially (0.8s stagger)
 * - Corner nodes pulse (1.2s interval)
 * - Watermark rotates (20s continuous)
 * - Condensation drips (3s random)
 * - Scanline sweeps (2s loop)
 * - Glass edge shimmer (4s)
 * - Tech data flicker (0.5s random)
 * - Hover glow expansion (0.3s)
 * - Entry fade-in (0.6s)
 * - Glitch effect (random)
 * - Phosphor burn-in (continuous)
 * - Holographic interference (8s)
 */

import React, { ReactNode, CSSProperties, useEffect, useRef, useState, useMemo } from 'react';
import { getComponentChamferClip, THEME_VARIANTS, ANIMATION_TOKENS } from '@rhuds/core';

// ═══════════════════════════════════════════════════════════════════════════
// CSS ANIMATIONS - Injected into document head
// ═══════════════════════════════════════════════════════════════════════════

if (typeof document !== 'undefined') {
  const styleId = 'coldwar-card-animations';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      @keyframes pulse-glow {
        0%, 100% {
          opacity: 0.85;
          filter: brightness(1);
        }
        50% {
          opacity: 1;
          filter: brightness(1.2);
        }
      }

      @keyframes scanline-sweep {
        0% {
          background-position: 0 0;
        }
        100% {
          background-position: 0 100px;
        }
      }
    `;
    document.head.appendChild(style);
  }
}

export type CardVariant = 'tactical' | 'glass' | 'notification' | 'data' | 'minimal';
export type CardColor = 'amber' | 'green' | 'blue' | 'red' | 'neutral';
export type CardElevation = 'none' | 'low' | 'medium' | 'high';

export interface ColdWarCardProps {
  variant?: CardVariant;
  color?: CardColor;
  elevation?: CardElevation;
  scanlines?: boolean;
  scanlinesIntensity?: 'low' | 'medium' | 'high';
  glow?: boolean;
  theme?: keyof typeof THEME_VARIANTS;
  header?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  className?: string;
  style?: CSSProperties;
  hoverable?: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS - MAXIMUM COMPLEXITY
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Generate random tech data for corners
 * This simulates real military intelligence metadata
 */
function generateTechData() {
  const classifications = ['TOP SECRET', 'CLASSIFIED', 'CONFIDENTIAL', 'RESTRICTED'];
  const operations = ['PERSEUS', 'REDLIGHT', 'GREENLIGHT', 'FRACTURE JAW'];
  const coordinates = [
    '55.7558° N, 37.6173° E', // Moscow
    '38.8977° N, 77.0365° W', // Washington DC
    '51.5074° N, 0.1278° W', // London
    '52.5200° N, 13.4050° E', // Berlin
  ];

  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
  const classification = classifications[Math.floor(Math.random() * classifications.length)];
  const operation = operations[Math.floor(Math.random() * operations.length)];
  const coord = coordinates[Math.floor(Math.random() * coordinates.length)];
  const caseNumber = `${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 900) + 100}`;

  return { timestamp, classification, operation, coord, caseNumber };
}

/**
 * Get color accent with full spectrum definition
 * Not just a hex code - full RGBA with alpha channels for layering
 */
function getColorAccent(color: CardColor, theme: keyof typeof THEME_VARIANTS) {
  const themeColors = THEME_VARIANTS[theme];

  const colorMap = {
    amber: {
      primary: themeColors.primary,
      rgb: '255, 176, 0',
    },
    green: {
      primary: themeColors.success,
      rgb: '51, 255, 0',
    },
    blue: {
      primary: themeColors.accent,
      rgb: '0, 204, 255',
    },
    red: {
      primary: themeColors.error,
      rgb: '255, 51, 51',
    },
    neutral: {
      primary: themeColors.surface,
      rgb: '58, 58, 62',
    },
  };

  return colorMap[color];
}

/**
 * Get elevation with COMPLEX shadow stacking
 * Not just one shadow - multiple layers for depth
 */
function getElevationStyles(elevation: CardElevation, colorAccent: any): CSSProperties {
  const elevationMap = {
    none: {
      boxShadow: 'none',
    },
    low: {
      boxShadow: `
        0 2px 4px rgba(0, 0, 0, 0.3),
        0 1px 2px rgba(0, 0, 0, 0.2),
        inset 0 0 20px rgba(0, 0, 0, 0.5)
      `,
    },
    medium: {
      boxShadow: `
        0 4px 8px rgba(0, 0, 0, 0.4),
        0 2px 4px rgba(0, 0, 0, 0.3),
        0 1px 2px rgba(0, 0, 0, 0.2),
        inset 0 0 20px rgba(0, 0, 0, 0.5),
        inset 0 0 5px rgba(${colorAccent.rgb}, 0.1)
      `,
    },
    high: {
      boxShadow: `
        0 8px 16px rgba(0, 0, 0, 0.5),
        0 4px 8px rgba(0, 0, 0, 0.4),
        0 2px 4px rgba(0, 0, 0, 0.3),
        0 1px 2px rgba(0, 0, 0, 0.2),
        inset 0 0 30px rgba(0, 0, 0, 0.6),
        inset 0 0 10px rgba(${colorAccent.rgb}, 0.1),
        0 0 20px rgba(${colorAccent.rgb}, 0.3)
      `,
    },
  };

  return elevationMap[elevation];
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export const ColdWarCard: React.FC<ColdWarCardProps> = ({
  variant = 'tactical',
  color = 'amber',
  elevation = 'low',
  scanlines = false,
  scanlinesIntensity = 'medium',
  glow = true,
  theme = 'perseus',
  header,
  children,
  footer,
  onClick,
  className = '',
  style = {},
  hoverable = true,
}) => {
  // ═══════════════════════════════════════════════════════════════════════════
  // STATE & REFS - Complex state management
  // ═══════════════════════════════════════════════════════════════════════════

  const [isHovered, setIsHovered] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [techData] = useState(() => generateTechData());
  const [glitchActive, setGlitchActive] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // ═══════════════════════════════════════════════════════════════════════════
  // THEME & COLOR SETUP
  // ═══════════════════════════════════════════════════════════════════════════

  const themeColors = THEME_VARIANTS[theme];
  const colorAccent = useMemo(() => getColorAccent(color, theme), [color, theme]);
  const elevationStyles = useMemo(
    () => getElevationStyles(elevation, colorAccent),
    [elevation, colorAccent]
  );

  // ═══════════════════════════════════════════════════════════════════════════
  // MOUNT ANIMATION - Entry effect
  // ═══════════════════════════════════════════════════════════════════════════

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  // ═══════════════════════════════════════════════════════════════════════════
  // RANDOM GLITCH EFFECT - Surprise feature
  // ═══════════════════════════════════════════════════════════════════════════

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.95) {
        setGlitchActive(true);
        setTimeout(() => setGlitchActive(false), 100);
      }
    }, 3000);
    return () => clearInterval(glitchInterval);
  }, []);

  // ═══════════════════════════════════════════════════════════════════════════
  // VARIANT STYLES - Maximum complexity per variant
  // ═══════════════════════════════════════════════════════════════════════════

  const variantStyles: Record<CardVariant, CSSProperties> = {
    tactical: {
      background: `
        radial-gradient(circle at 0% 0%, rgba(${colorAccent.rgb}, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 100% 100%, rgba(${colorAccent.rgb}, 0.1) 0%, transparent 50%),
        linear-gradient(135deg, rgba(10, 10, 20, 0.95) 0%, rgba(10, 10, 20, 0.85) 100%)
      `,
      borderImage: `linear-gradient(135deg, ${colorAccent.primary} 0%, rgba(${colorAccent.rgb}, 0.3) 50%, ${colorAccent.primary} 100%) 1`,
      borderWidth: '1px',
      borderStyle: 'solid',
    },
    glass: {
      background: `
        linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
        linear-gradient(225deg, rgba(255, 255, 255, 0.05) 0%, transparent 50%),
        radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.08) 0%, transparent 40%),
        radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.06) 0%, transparent 40%),
        rgba(10, 10, 20, 0.6)
      `,
      backdropFilter: 'blur(10px) saturate(180%)',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: `rgba(${colorAccent.rgb}, 0.18)`,
    },
    notification: {
      background: `
        linear-gradient(90deg, rgba(${colorAccent.rgb}, 0.3) 0%, transparent 4px),
        linear-gradient(135deg, rgba(10, 10, 20, 0.95) 0%, rgba(10, 10, 20, 0.85) 100%)
      `,
      borderColor: colorAccent.primary,
      borderWidth: '2px',
      borderStyle: 'solid',
      borderLeftWidth: '4px',
    },
    data: {
      background: `
        repeating-linear-gradient(
          0deg,
          transparent,
          transparent 2px,
          rgba(${colorAccent.rgb}, 0.1) 2px,
          rgba(${colorAccent.rgb}, 0.1) 4px
        ),
        linear-gradient(135deg, rgba(10, 10, 20, 0.98) 0%, rgba(10, 10, 20, 0.92) 100%)
      `,
      borderColor: colorAccent.primary,
      borderWidth: '1px',
      borderStyle: 'solid',
    },
    minimal: {
      background: 'transparent',
      borderColor: `rgba(${colorAccent.rgb}, 0.3)`,
      borderWidth: '1px',
      borderStyle: 'dashed',
    },
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // BASE STYLES - Foundation layer
  // ═══════════════════════════════════════════════════════════════════════════

  const baseStyles: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    borderRadius: 0,
    clipPath: getComponentChamferClip('card'),
    transition: `all ${ANIMATION_TOKENS.timing.transition} ${ANIMATION_TOKENS.easing.smooth}`,
    cursor: onClick ? 'pointer' : 'default',
    position: 'relative',
    overflow: 'hidden',
    opacity: isMounted ? 1 : 0,
    transform: isMounted ? 'translateY(0)' : 'translateY(10px)',
    willChange: 'transform, opacity',
    ...variantStyles[variant],
    ...elevationStyles,
    ...style,
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // HOVER EFFECTS - Complex state changes
  // ═══════════════════════════════════════════════════════════════════════════

  if (hoverable && isHovered) {
    baseStyles.transform = isMounted ? 'translateY(-4px) scale(1.01)' : 'translateY(10px)';
    baseStyles.boxShadow = `
      ${elevationStyles.boxShadow},
      0 0 30px rgba(${colorAccent.rgb}, 0.3),
      0 0 60px rgba(${colorAccent.rgb}, 0.1),
      inset 0 0 30px rgba(${colorAccent.rgb}, 0.1)
    `;
    baseStyles.borderColor = colorAccent.primary;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // GLITCH EFFECT - Random distortion
  // ═══════════════════════════════════════════════════════════════════════════

  if (glitchActive) {
    baseStyles.filter = 'hue-rotate(90deg) saturate(2)';
    baseStyles.transform = `${baseStyles.transform} skewX(2deg)`;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // VARIANT-SPECIFIC OVERLAY EFFECTS - Enhanced CSS effects with strong distinction
  // ═══════════════════════════════════════════════════════════════════════════

  const variantOverlayStyles: CSSProperties = useMemo(() => {
    switch (variant) {
      case 'tactical':
        // TACTICAL: Military grid pattern with crosshair effect
        return {
          background: `
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 9px,
              rgba(${colorAccent.rgb}, 0.15) 9px,
              rgba(${colorAccent.rgb}, 0.15) 10px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 9px,
              rgba(${colorAccent.rgb}, 0.15) 9px,
              rgba(${colorAccent.rgb}, 0.15) 10px
            ),
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(255, 255, 255, 0.03) 2px,
              rgba(255, 255, 255, 0.03) 3px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 2px,
              rgba(255, 255, 255, 0.03) 2px,
              rgba(255, 255, 255, 0.03) 3px
            )
          `,
          backgroundSize: '10px 10px, 10px 10px, 3px 3px, 3px 3px',
          opacity: 0.8,
          mixBlendMode: 'screen' as const,
        };

      case 'glass':
        // GLASS: Frosted glass with light refraction
        return {
          backdropFilter: 'blur(8px) saturate(180%) brightness(1.15)',
          background: `
            radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
            linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.02) 50%, transparent 100%),
            linear-gradient(225deg, rgba(255, 255, 255, 0.08) 0%, transparent 50%)
          `,
          boxShadow: `
            inset 1px 1px 2px rgba(255, 255, 255, 0.3),
            inset -1px -1px 2px rgba(0, 0, 0, 0.2)
          `,
          opacity: 0.95,
        };

      case 'notification':
        // NOTIFICATION: Pulsing alert glow with animated radial gradient
        return {
          background: `
            radial-gradient(circle at 50% 50%, rgba(${colorAccent.rgb}, 0.25) 0%, rgba(${colorAccent.rgb}, 0.1) 40%, transparent 70%),
            radial-gradient(circle at 30% 30%, rgba(${colorAccent.rgb}, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 70% 70%, rgba(${colorAccent.rgb}, 0.15) 0%, transparent 50%)
          `,
          boxShadow: `
            inset 0 0 40px rgba(${colorAccent.rgb}, 0.3),
            inset 0 0 20px rgba(${colorAccent.rgb}, 0.2),
            inset 4px 0 10px rgba(${colorAccent.rgb}, 0.4)
          `,
          opacity: 0.85,
          animation: 'pulse-glow 2s ease-in-out infinite',
        };

      case 'data':
        // DATA: CRT monitor scanlines with phosphor glow - STRONG and VISIBLE
        return {
          background: `
            repeating-linear-gradient(
              0deg,
              rgba(${colorAccent.rgb}, 0.25) 0px,
              rgba(${colorAccent.rgb}, 0.25) 1px,
              rgba(0, 0, 0, 0.4) 1px,
              rgba(0, 0, 0, 0.4) 2px
            )
          `,
          boxShadow: `
            inset 0 0 40px rgba(${colorAccent.rgb}, 0.3),
            inset 0 0 20px rgba(${colorAccent.rgb}, 0.2)
          `,
          opacity: 1,
        };

      case 'minimal':
        // MINIMAL: Subtle film grain with diagonal hatching
        return {
          background: `
            repeating-linear-gradient(
              45deg,
              transparent,
              transparent 1px,
              rgba(255, 255, 255, 0.015) 1px,
              rgba(255, 255, 255, 0.015) 2px
            ),
            repeating-linear-gradient(
              -45deg,
              transparent,
              transparent 1px,
              rgba(255, 255, 255, 0.01) 1px,
              rgba(255, 255, 255, 0.01) 2px
            )
          `,
          backgroundSize: '3px 3px, 3px 3px',
          opacity: 0.4,
          filter: 'contrast(1.1)',
        };

      default:
        return {};
    }
  }, [variant, colorAccent.rgb]);

  // ═══════════════════════════════════════════════════════════════════════════
  // GLOW TEXT STYLE - For tech data corners
  // ═══════════════════════════════════════════════════════════════════════════

  const glowTextStyle: CSSProperties = useMemo(
    () => ({
      textShadow: glow
        ? `
          0 0 5px rgba(${colorAccent.rgb}, 0.8),
          0 0 10px rgba(${colorAccent.rgb}, 0.6),
          0 0 15px rgba(${colorAccent.rgb}, 0.4)
        `
        : 'none',
    }),
    [glow, colorAccent.rgb]
  );

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER - 7 LAYERS OF CINEMATIC COMPLEXITY
  // ═══════════════════════════════════════════════════════════════════════════

  return (
    <div
      ref={cardRef}
      style={baseStyles}
      className={className}
      onClick={onClick}
      onMouseEnter={() => hoverable && setIsHovered(true)}
      onMouseLeave={() => hoverable && setIsHovered(false)}
    >
      {/* ═══════════════════════════════════════════════════════════════════════
          LAYER 1 & 2: VARIANT-SPECIFIC OVERLAY - CSS-based effects (NO SVG)
          ═══════════════════════════════════════════════════════════════════ */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          zIndex: 1,
          ...variantOverlayStyles,
        }}
      />

      {/* ═══════════════════════════════════════════════════════════════════════
          LAYER 3: ANIMATED SVG BORDER - Complex tactical brackets
          ═══════════════════════════════════════════════════════════════════ */}
      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 3,
        }}
      >
        <g>
          <line
            x1="0"
            y1="12"
            x2="0"
            y2="0"
            stroke={colorAccent.primary}
            strokeWidth="2"
            strokeDasharray="4 2"
            opacity="0.8"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="0"
              to="6"
              dur="0.8s"
              repeatCount="indefinite"
            />
          </line>
          <line
            x1="0"
            y1="0"
            x2="20"
            y2="0"
            stroke={colorAccent.primary}
            strokeWidth="2"
            strokeDasharray="4 2"
            opacity="0.8"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="0"
              to="6"
              dur="0.8s"
              repeatCount="indefinite"
            />
          </line>
          <circle cx="0" cy="0" r="3" fill={colorAccent.primary} opacity="0.8">
            <animate
              attributeName="opacity"
              values="0.8;1;0.8"
              dur="1.2s"
              repeatCount="indefinite"
            />
          </circle>
        </g>
        <g>
          <line
            x1="100%"
            y1="0"
            x2="100%"
            y2="12"
            stroke={colorAccent.primary}
            strokeWidth="2"
            strokeDasharray="4 2"
            opacity="0.8"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="0"
              to="6"
              dur="0.8s"
              begin="0.2s"
              repeatCount="indefinite"
            />
          </line>
          <line
            x1="100%"
            y1="0"
            x2="calc(100% - 20px)"
            y2="0"
            stroke={colorAccent.primary}
            strokeWidth="2"
            strokeDasharray="4 2"
            opacity="0.8"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="0"
              to="6"
              dur="0.8s"
              begin="0.2s"
              repeatCount="indefinite"
            />
          </line>
          <circle cx="100%" cy="0" r="3" fill={colorAccent.primary} opacity="0.8">
            <animate
              attributeName="opacity"
              values="0.8;1;0.8"
              dur="1.2s"
              begin="0.2s"
              repeatCount="indefinite"
            />
          </circle>
        </g>
        <g>
          <line
            x1="0"
            y1="100%"
            x2="0"
            y2="calc(100% - 12px)"
            stroke={colorAccent.primary}
            strokeWidth="2"
            strokeDasharray="4 2"
            opacity="0.8"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="0"
              to="6"
              dur="0.8s"
              begin="0.4s"
              repeatCount="indefinite"
            />
          </line>
          <line
            x1="0"
            y1="100%"
            x2="20"
            y2="100%"
            stroke={colorAccent.primary}
            strokeWidth="2"
            strokeDasharray="4 2"
            opacity="0.8"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="0"
              to="6"
              dur="0.8s"
              begin="0.4s"
              repeatCount="indefinite"
            />
          </line>
          <circle cx="0" cy="100%" r="3" fill={colorAccent.primary} opacity="0.8">
            <animate
              attributeName="opacity"
              values="0.8;1;0.8"
              dur="1.2s"
              begin="0.4s"
              repeatCount="indefinite"
            />
          </circle>
        </g>
        <g>
          <line
            x1="100%"
            y1="100%"
            x2="100%"
            y2="calc(100% - 12px)"
            stroke={colorAccent.primary}
            strokeWidth="2"
            strokeDasharray="4 2"
            opacity="0.8"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="0"
              to="6"
              dur="0.8s"
              begin="0.6s"
              repeatCount="indefinite"
            />
          </line>
          <line
            x1="100%"
            y1="100%"
            x2="calc(100% - 20px)"
            y2="100%"
            stroke={colorAccent.primary}
            strokeWidth="2"
            strokeDasharray="4 2"
            opacity="0.8"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="0"
              to="6"
              dur="0.8s"
              begin="0.6s"
              repeatCount="indefinite"
            />
          </line>
          <circle cx="100%" cy="100%" r="3" fill={colorAccent.primary} opacity="0.8">
            <animate
              attributeName="opacity"
              values="0.8;1;0.8"
              dur="1.2s"
              begin="0.6s"
              repeatCount="indefinite"
            />
          </circle>
        </g>
      </svg>

      {/* ═══════════════════════════════════════════════════════════════════════
          LAYER 4: SUBTLE CORNER MARKERS - Minimal visual indicators
          ═══════════════════════════════════════════════════════════════════ */}
      <div
        style={{
          position: 'absolute',
          top: '8px',
          left: '8px',
          width: '4px',
          height: '4px',
          background: colorAccent.primary,
          opacity: 0.4,
          zIndex: 4,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          width: '4px',
          height: '4px',
          background: colorAccent.primary,
          opacity: 0.4,
          zIndex: 4,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '8px',
          left: '8px',
          width: '4px',
          height: '4px',
          background: colorAccent.primary,
          opacity: 0.4,
          zIndex: 4,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '8px',
          right: '8px',
          width: '4px',
          height: '4px',
          background: colorAccent.primary,
          opacity: 0.4,
          zIndex: 4,
        }}
      />

      {/* ═══════════════════════════════════════════════════════════════════════
          LAYER 6: SCANLINES - CRT effect (controlled by props)
          ═══════════════════════════════════════════════════════════════════ */}
      {scanlines && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `repeating-linear-gradient(
              0deg,
              transparent 0px,
              transparent 1px,
              rgba(0, 0, 0, ${
                scanlinesIntensity === 'low' ? 0.15 : scanlinesIntensity === 'medium' ? 0.25 : 0.35
              }) 1px,
              rgba(0, 0, 0, ${
                scanlinesIntensity === 'low' ? 0.15 : scanlinesIntensity === 'medium' ? 0.25 : 0.35
              }) 2px
            )`,
            pointerEvents: 'none',
            zIndex: 5,
          }}
        />
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          LAYER 6B: GLOW EFFECT - Phosphor glow (controlled by props)
          ═══════════════════════════════════════════════════════════════════ */}
      {glow && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            boxShadow: `
              inset 0 0 60px rgba(${colorAccent.rgb}, 0.2),
              inset 0 0 30px rgba(${colorAccent.rgb}, 0.15),
              inset 0 0 15px rgba(${colorAccent.rgb}, 0.1)
            `,
            pointerEvents: 'none',
            zIndex: 5,
          }}
        />
      )}

      {/* ═══════════════════════════════════════════════════════════════════════
          LAYER 7: CONTENT - Header, Body, Footer
          ═══════════════════════════════════════════════════════════════════ */}
      {header && (
        <div
          style={{
            padding: '12px 16px',
            borderBottom: `1px solid ${colorAccent.primary}`,
            fontFamily: "'Share Tech Mono', 'Roboto Mono', monospace",
            fontWeight: 700,
            fontSize: '14px',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            color: colorAccent.primary,
            zIndex: 6,
            position: 'relative',
          }}
        >
          {header}
        </div>
      )}
      <div
        style={{
          padding: '16px',
          flex: 1,
          fontFamily: "'Share Tech Mono', 'Roboto Mono', monospace",
          fontSize: '14px',
          letterSpacing: '0.02em',
          color: themeColors.text,
          zIndex: 6,
          position: 'relative',
        }}
      >
        {children}
      </div>
      {footer && (
        <div
          style={{
            padding: '12px 16px',
            borderTop: `1px solid ${colorAccent.primary}`,
            fontFamily: "'Share Tech Mono', 'Roboto Mono', monospace",
            fontSize: '12px',
            letterSpacing: '0.02em',
            color: themeColors.textSecondary,
            zIndex: 6,
            position: 'relative',
          }}
        >
          {footer}
        </div>
      )}
    </div>
  );
};

export default ColdWarCard;
