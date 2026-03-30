/**
 * ═══════════════════════════════════════════════════════════════════════════
 * COLD WAR ACCORDION - AAA CINEMATIC IMPLEMENTATION
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * TACTICAL COLLAPSIBLE PANELS - $1M IMPLEMENTATION
 *
 * FEATURES:
 * - Expandable/collapsible panels
 * - Chamfered corners
 * - Tactical animations
 * - Corner brackets
 * - Scanlines and glow effects
 */

import React, { useState, ReactNode, CSSProperties } from 'react';
import { getComponentChamferClip, THEME_VARIANTS, ANIMATION_TOKENS } from '@rhuds/core';
import { getRgbString, generateTechCode } from '../utils/coldWarUtils';
import { ScanlinesOverlay } from '../utils/ScanlinesOverlay';
import { GlowOverlay } from '../utils/GlowOverlay';

export interface ColdWarAccordionItem {
  id: string;
  title: string;
  content: ReactNode;
  disabled?: boolean;
}

export interface ColdWarAccordionProps {
  /** Theme variant */
  theme?: 'perseus' | 'greenTerminal' | 'satelliteView';
  /** Accordion items */
  items: ColdWarAccordionItem[];
  /** Allow multiple panels open */
  allowMultiple?: boolean;
  /** Default open items */
  defaultOpen?: string[];
  /** Apply scanlines effect */
  scanlines?: boolean;
  /** Scanlines intensity */
  scanlinesIntensity?: 'low' | 'medium' | 'high';
  /** Apply glow effect */
  glow?: boolean;
  /** Show corner brackets */
  showCorners?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Additional inline styles */
  style?: CSSProperties;
}

/**
 * Cold War Accordion Component
 */
export const ColdWarAccordion: React.FC<ColdWarAccordionProps> = ({
  theme = 'perseus',
  items,
  allowMultiple = false,
  defaultOpen = [],
  scanlines = true,
  scanlinesIntensity = 'medium',
  glow = true,
  showCorners = true,
  className = '',
  style = {},
}) => {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set(defaultOpen));
  const themeColors = THEME_VARIANTS[theme];
  const rgb = getRgbString(themeColors.primary);

  const toggleItem = (id: string) => {
    const newOpenItems = new Set(openItems);

    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      if (!allowMultiple) {
        newOpenItems.clear();
      }
      newOpenItems.add(id);
    }

    setOpenItems(newOpenItems);
  };

  const containerStyles: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    ...style,
  };

  return (
    <div className={className} style={containerStyles}>
      {items.map((item) => {
        const isOpen = openItems.has(item.id);
        const techCode = generateTechCode('ACC');

        const itemStyles: CSSProperties = {
          position: 'relative',
          borderRadius: 0,
          clipPath: getComponentChamferClip('card'),
          background: `
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(${rgb}, 0.02) 2px,
              rgba(${rgb}, 0.02) 4px
            ),
            linear-gradient(135deg, rgba(10, 10, 20, 0.95) 0%, rgba(10, 10, 20, 0.85) 100%)
          `,
          border: `1px solid rgba(${rgb}, ${isOpen ? 0.5 : 0.3})`,
          boxShadow: isOpen
            ? `
              inset 0 0 30px rgba(0, 0, 0, 0.6),
              inset 0 0 10px rgba(${rgb}, 0.1),
              0 0 20px rgba(${rgb}, 0.3),
              0 4px 12px rgba(0, 0, 0, 0.4)
            `
            : `
              inset 0 0 20px rgba(0, 0, 0, 0.5),
              0 2px 8px rgba(0, 0, 0, 0.3)
            `,
          transition: `all ${ANIMATION_TOKENS.timing.transition} ${ANIMATION_TOKENS.easing.smooth}`,
          overflow: 'hidden',
          opacity: item.disabled ? 0.5 : 1,
        };

        const headerStyles: CSSProperties = {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          fontFamily: "'Share Tech Mono', 'Roboto Mono', monospace",
          fontSize: '13px',
          fontWeight: 600,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          color: themeColors.primary,
          cursor: item.disabled ? 'not-allowed' : 'pointer',
          background: isOpen ? `rgba(${rgb}, 0.1)` : 'transparent',
          borderBottom: isOpen ? `1px solid rgba(${rgb}, 0.3)` : 'none',
          transition: `all ${ANIMATION_TOKENS.timing.hover} ${ANIMATION_TOKENS.easing.tactical}`,
          textShadow: glow ? `0 0 4px ${themeColors.primary}` : 'none',
        };

        const contentStyles: CSSProperties = {
          maxHeight: isOpen ? '1000px' : '0',
          opacity: isOpen ? 1 : 0,
          padding: isOpen ? '16px' : '0 16px',
          fontFamily: "'Share Tech Mono', 'Roboto Mono', monospace",
          fontSize: '13px',
          lineHeight: '1.6',
          color: themeColors.text,
          transition: `all ${ANIMATION_TOKENS.timing.transition} ${ANIMATION_TOKENS.easing.smooth}`,
          overflow: 'hidden',
        };

        const iconStyles: CSSProperties = {
          display: 'inline-block',
          width: '12px',
          height: '12px',
          border: `2px solid ${themeColors.primary}`,
          borderLeft: 'none',
          borderTop: 'none',
          transform: isOpen ? 'rotate(45deg)' : 'rotate(-45deg)',
          transition: `transform ${ANIMATION_TOKENS.timing.transition} ${ANIMATION_TOKENS.easing.tactical}`,
        };

        return (
          <div key={item.id} style={itemStyles}>
            {/* Header */}
            <div
              style={headerStyles}
              onClick={() => !item.disabled && toggleItem(item.id)}
              onMouseEnter={(e) => {
                if (!item.disabled) {
                  e.currentTarget.style.background = `rgba(${rgb}, 0.15)`;
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = isOpen ? `rgba(${rgb}, 0.1)` : 'transparent';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    display: 'inline-block',
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    background: themeColors.primary,
                    boxShadow: `0 0 6px ${themeColors.primary}`,
                    animation: isOpen ? 'led-pulse 1s ease-in-out infinite' : 'none',
                  }}
                />
                <span>{item.title}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '9px', opacity: 0.6 }}>{techCode}</span>
                <div style={iconStyles} />
              </div>
            </div>

            {/* Content */}
            <div style={contentStyles}>{item.content}</div>

            {/* Corner Brackets */}
            {showCorners && isOpen && (
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
                    zIndex: 10,
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
                    zIndex: 10,
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: '4px',
                    left: '4px',
                    width: '8px',
                    height: '8px',
                    borderBottom: `1px solid ${themeColors.primary}`,
                    borderLeft: `1px solid ${themeColors.primary}`,
                    opacity: 0.5,
                    zIndex: 10,
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: '4px',
                    right: '4px',
                    width: '8px',
                    height: '8px',
                    borderBottom: `1px solid ${themeColors.primary}`,
                    borderRight: `1px solid ${themeColors.primary}`,
                    opacity: 0.5,
                    zIndex: 10,
                  }}
                />
              </>
            )}

            {/* Scanlines */}
            {scanlines && isOpen && <ScanlinesOverlay intensity={scanlinesIntensity} />}

            {/* Glow */}
            {glow && isOpen && <GlowOverlay color={themeColors.primary} intensity="low" />}
          </div>
        );
      })}

      {/* Animations */}
      <style>
        {`
          @keyframes led-pulse {
            0%, 100% { opacity: 0.6; }
            50% { opacity: 1; }
          }
        `}
      </style>
    </div>
  );
};

export default ColdWarAccordion;
