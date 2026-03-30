/**
 * ═══════════════════════════════════════════════════════════════════════════
 * COLD WAR TOOLTIP - AAA CINEMATIC IMPLEMENTATION
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * TACTICAL TOOLTIP - $1M IMPLEMENTATION
 *
 * FEATURES:
 * - Hover-triggered tooltip
 * - Multiple placement options
 * - Tactical styling with glow
 * - Corner brackets
 * - Scanlines effect
 */

import React, { useState, useRef, ReactNode, CSSProperties } from 'react';
import { getComponentChamferClip, THEME_VARIANTS, ANIMATION_TOKENS } from '@rhuds/core';
import { getRgbString, generateTechCode } from '../utils/coldWarUtils';

export interface ColdWarTooltipProps {
  /** Theme variant */
  theme?: 'perseus' | 'greenTerminal' | 'satelliteView';
  /** Tooltip content */
  content: ReactNode;
  /** Placement */
  placement?: 'top' | 'bottom' | 'left' | 'right';
  /** Apply glow effect */
  glow?: boolean;
  /** Show corner brackets */
  showCorners?: boolean;
  /** Children (trigger element) */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Cold War Tooltip Component
 */
export const ColdWarTooltip: React.FC<ColdWarTooltipProps> = ({
  theme = 'perseus',
  content,
  placement = 'top',
  glow = true,
  showCorners = true,
  children,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [techCode] = useState(() => generateTechCode('TIP'));
  const themeColors = THEME_VARIANTS[theme];
  const rgb = getRgbString(themeColors.primary);

  const containerStyles: CSSProperties = {
    position: 'relative',
    display: 'inline-block',
  };

  const getTooltipPosition = (): CSSProperties => {
    const baseStyles: CSSProperties = {
      position: 'absolute',
      zIndex: 1000,
    };

    switch (placement) {
      case 'top':
        return {
          ...baseStyles,
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginBottom: '8px',
        };
      case 'bottom':
        return {
          ...baseStyles,
          top: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginTop: '8px',
        };
      case 'left':
        return {
          ...baseStyles,
          right: '100%',
          top: '50%',
          transform: 'translateY(-50%)',
          marginRight: '8px',
        };
      case 'right':
        return {
          ...baseStyles,
          left: '100%',
          top: '50%',
          transform: 'translateY(-50%)',
          marginLeft: '8px',
        };
      default:
        return baseStyles;
    }
  };

  const tooltipStyles: CSSProperties = {
    ...getTooltipPosition(),
    padding: '8px 12px',
    fontFamily: "'Share Tech Mono', 'Roboto Mono', monospace",
    fontSize: '11px',
    fontWeight: 500,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    color: themeColors.primary,
    background: `
      repeating-linear-gradient(
        0deg,
        transparent,
        transparent 2px,
        rgba(${rgb}, 0.03) 2px,
        rgba(${rgb}, 0.03) 4px
      ),
      linear-gradient(135deg, rgba(10, 10, 20, 0.98) 0%, rgba(10, 10, 20, 0.95) 100%)
    `,
    border: `1px solid rgba(${rgb}, 0.5)`,
    borderRadius: 0,
    clipPath: getComponentChamferClip('button'),
    boxShadow: glow
      ? `
        inset 0 0 20px rgba(0, 0, 0, 0.6),
        inset 0 0 10px rgba(${rgb}, 0.1),
        0 0 20px rgba(${rgb}, 0.4),
        0 4px 12px rgba(0, 0, 0, 0.5)
      `
      : `
        inset 0 0 20px rgba(0, 0, 0, 0.6),
        0 4px 12px rgba(0, 0, 0, 0.5)
      `,
    whiteSpace: 'nowrap',
    opacity: isVisible ? 1 : 0,
    visibility: isVisible ? 'visible' : 'hidden',
    transition: `all ${ANIMATION_TOKENS.timing.transition} ${ANIMATION_TOKENS.easing.smooth}`,
    pointerEvents: 'none',
    textShadow: glow ? `0 0 4px ${themeColors.primary}` : 'none',
  };

  const arrowStyles: CSSProperties = {
    position: 'absolute',
    width: '8px',
    height: '8px',
    background: `rgba(10, 10, 20, 0.98)`,
    border: `1px solid rgba(${rgb}, 0.5)`,
    transform: 'rotate(45deg)',
    ...(placement === 'top' && {
      bottom: '-5px',
      left: '50%',
      marginLeft: '-4px',
      borderTop: 'none',
      borderLeft: 'none',
    }),
    ...(placement === 'bottom' && {
      top: '-5px',
      left: '50%',
      marginLeft: '-4px',
      borderBottom: 'none',
      borderRight: 'none',
    }),
    ...(placement === 'left' && {
      right: '-5px',
      top: '50%',
      marginTop: '-4px',
      borderTop: 'none',
      borderRight: 'none',
    }),
    ...(placement === 'right' && {
      left: '-5px',
      top: '50%',
      marginTop: '-4px',
      borderBottom: 'none',
      borderLeft: 'none',
    }),
  };

  return (
    <div
      className={className}
      style={containerStyles}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}

      <div style={tooltipStyles}>
        {content}

        {/* Arrow */}
        <div style={arrowStyles} />

        {/* Tech Code */}
        <div
          style={{
            position: 'absolute',
            bottom: '2px',
            right: '4px',
            fontSize: '7px',
            opacity: 0.4,
          }}
        >
          {techCode}
        </div>

        {/* Corner Brackets */}
        {showCorners && (
          <>
            <div
              style={{
                position: 'absolute',
                top: '2px',
                left: '2px',
                width: '6px',
                height: '6px',
                borderTop: `1px solid ${themeColors.primary}`,
                borderLeft: `1px solid ${themeColors.primary}`,
                opacity: 0.5,
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: '2px',
                right: '2px',
                width: '6px',
                height: '6px',
                borderTop: `1px solid ${themeColors.primary}`,
                borderRight: `1px solid ${themeColors.primary}`,
                opacity: 0.5,
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: '2px',
                left: '2px',
                width: '6px',
                height: '6px',
                borderBottom: `1px solid ${themeColors.primary}`,
                borderLeft: `1px solid ${themeColors.primary}`,
                opacity: 0.5,
              }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: '2px',
                right: '2px',
                width: '6px',
                height: '6px',
                borderBottom: `1px solid ${themeColors.primary}`,
                borderRight: `1px solid ${themeColors.primary}`,
                opacity: 0.5,
              }}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default ColdWarTooltip;
