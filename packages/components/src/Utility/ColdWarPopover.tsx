/**
 * ═══════════════════════════════════════════════════════════════════════════
 * COLD WAR POPOVER - AAA CINEMATIC IMPLEMENTATION
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React, { useState, ReactNode, CSSProperties } from 'react';
import { getComponentChamferClip, THEME_VARIANTS, ANIMATION_TOKENS } from '@rhuds/core';
import { getRgbString, generateTechCode } from '../utils/coldWarUtils';
import { ScanlinesOverlay } from '../utils/ScanlinesOverlay';
import { GlowOverlay } from '../utils/GlowOverlay';

export interface ColdWarPopoverProps {
  theme?: 'perseus' | 'greenTerminal' | 'satelliteView';
  content: ReactNode;
  title?: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  trigger?: 'click' | 'hover';
  scanlines?: boolean;
  scanlinesIntensity?: 'low' | 'medium' | 'high';
  glow?: boolean;
  showCorners?: boolean;
  children: ReactNode;
  className?: string;
}

export const ColdWarPopover: React.FC<ColdWarPopoverProps> = ({
  theme = 'perseus',
  content,
  title,
  placement = 'top',
  trigger = 'click',
  scanlines = true,
  scanlinesIntensity = 'medium',
  glow = true,
  showCorners = true,
  children,
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [techCode] = useState(() => generateTechCode('POP'));
  const themeColors = THEME_VARIANTS[theme];
  const rgb = getRgbString(themeColors.primary);

  const handleTrigger = () => {
    if (trigger === 'click') {
      setIsVisible(!isVisible);
    }
  };

  const getPopoverPosition = (): CSSProperties => {
    const baseStyles: CSSProperties = { position: 'absolute', zIndex: 1000 };
    switch (placement) {
      case 'top':
        return {
          ...baseStyles,
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginBottom: '12px',
        };
      case 'bottom':
        return {
          ...baseStyles,
          top: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginTop: '12px',
        };
      case 'left':
        return {
          ...baseStyles,
          right: '100%',
          top: '50%',
          transform: 'translateY(-50%)',
          marginRight: '12px',
        };
      case 'right':
        return {
          ...baseStyles,
          left: '100%',
          top: '50%',
          transform: 'translateY(-50%)',
          marginLeft: '12px',
        };
      default:
        return baseStyles;
    }
  };

  const popoverStyles: CSSProperties = {
    ...getPopoverPosition(),
    minWidth: '200px',
    maxWidth: '300px',
    borderRadius: 0,
    clipPath: getComponentChamferClip('card'),
    background: `linear-gradient(135deg, rgba(10, 10, 20, 0.98) 0%, rgba(10, 10, 20, 0.95) 100%)`,
    border: `1px solid rgba(${rgb}, 0.5)`,
    boxShadow: `inset 0 0 30px rgba(0, 0, 0, 0.6), 0 0 20px rgba(${rgb}, 0.4), 0 8px 16px rgba(0, 0, 0, 0.5)`,
    opacity: isVisible ? 1 : 0,
    visibility: isVisible ? 'visible' : 'hidden',
    transition: `all ${ANIMATION_TOKENS.timing.transition} ${ANIMATION_TOKENS.easing.smooth}`,
  };

  return (
    <div
      style={{ position: 'relative', display: 'inline-block' }}
      className={className}
      onClick={trigger === 'click' ? handleTrigger : undefined}
      onMouseEnter={trigger === 'hover' ? () => setIsVisible(true) : undefined}
      onMouseLeave={trigger === 'hover' ? () => setIsVisible(false) : undefined}
    >
      {children}
      <div style={popoverStyles}>
        {title && (
          <div
            style={{
              padding: '8px 12px',
              borderBottom: `1px solid rgba(${rgb}, 0.3)`,
              fontFamily: "'Share Tech Mono', 'Roboto Mono', monospace",
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              color: themeColors.primary,
              background: `rgba(${rgb}, 0.1)`,
            }}
          >
            {title}
          </div>
        )}
        <div
          style={{
            padding: '12px',
            fontFamily: "'Share Tech Mono', 'Roboto Mono', monospace",
            fontSize: '12px',
            color: themeColors.text,
          }}
        >
          {content}
        </div>
        {showCorners && (
          <>
            <div
              style={{
                position: 'absolute',
                top: '4px',
                left: '4px',
                width: '8px',
                height: '8px',
                borderTop: `1px solid ${themeColors.primary}`,
                borderLeft: `1px solid ${themeColors.primary}`,
                opacity: 0.5,
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: '4px',
                right: '4px',
                width: '8px',
                height: '8px',
                borderTop: `1px solid ${themeColors.primary}`,
                borderRight: `1px solid ${themeColors.primary}`,
                opacity: 0.5,
              }}
            />
          </>
        )}
        {scanlines && <ScanlinesOverlay intensity={scanlinesIntensity} />}
        {glow && <GlowOverlay color={themeColors.primary} intensity="low" />}
      </div>
    </div>
  );
};

export default ColdWarPopover;
