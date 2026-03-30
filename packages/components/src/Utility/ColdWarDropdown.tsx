/**
 * ═══════════════════════════════════════════════════════════════════════════
 * COLD WAR DROPDOWN - AAA CINEMATIC IMPLEMENTATION
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React, { useState, ReactNode, CSSProperties } from 'react';
import { getComponentChamferClip, THEME_VARIANTS, ANIMATION_TOKENS } from '@rhuds/core';
import { getRgbString, generateTechCode } from '../utils/coldWarUtils';
import { ScanlinesOverlay } from '../utils/ScanlinesOverlay';

export interface ColdWarDropdownItem {
  id: string;
  label: string;
  icon?: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
}

export interface ColdWarDropdownProps {
  theme?: 'perseus' | 'greenTerminal' | 'satelliteView';
  items: ColdWarDropdownItem[];
  trigger: ReactNode;
  scanlines?: boolean;
  scanlinesIntensity?: 'low' | 'medium' | 'high';
  glow?: boolean;
  showCorners?: boolean;
  className?: string;
}

export const ColdWarDropdown: React.FC<ColdWarDropdownProps> = ({
  theme = 'perseus',
  items,
  trigger,
  scanlines = true,
  scanlinesIntensity = 'medium',
  glow = true,
  showCorners = true,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [techCode] = useState(() => generateTechCode('DRP'));
  const themeColors = THEME_VARIANTS[theme];
  const rgb = getRgbString(themeColors.primary);

  const handleItemClick = (item: ColdWarDropdownItem) => {
    if (!item.disabled) {
      item.onClick?.();
      setIsOpen(false);
    }
  };

  const menuStyles: CSSProperties = {
    position: 'absolute',
    top: '100%',
    left: 0,
    marginTop: '8px',
    minWidth: '200px',
    borderRadius: 0,
    clipPath: getComponentChamferClip('card'),
    background: `linear-gradient(135deg, rgba(10, 10, 20, 0.98) 0%, rgba(10, 10, 20, 0.95) 100())`,
    border: `1px solid rgba(${rgb}, 0.5)`,
    boxShadow: `inset 0 0 30px rgba(0, 0, 0, 0.6), 0 0 20px rgba(${rgb}, 0.4), 0 8px 16px rgba(0, 0, 0, 0.5)`,
    opacity: isOpen ? 1 : 0,
    visibility: isOpen ? 'visible' : 'hidden',
    transform: isOpen ? 'translateY(0)' : 'translateY(-10px)',
    transition: `all ${ANIMATION_TOKENS.timing.transition} ${ANIMATION_TOKENS.easing.smooth}`,
    zIndex: 1000,
    overflow: 'hidden',
  };

  const itemStyles = (item: ColdWarDropdownItem, isHovered: boolean): CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 12px',
    fontFamily: "'Share Tech Mono', 'Roboto Mono', monospace",
    fontSize: '12px',
    fontWeight: 500,
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    color: item.disabled ? `rgba(${rgb}, 0.3)` : themeColors.primary,
    background: isHovered && !item.disabled ? `rgba(${rgb}, 0.2)` : 'transparent',
    borderBottom: `1px solid rgba(${rgb}, 0.1)`,
    cursor: item.disabled ? 'not-allowed' : 'pointer',
    transition: `all ${ANIMATION_TOKENS.timing.hover} ${ANIMATION_TOKENS.easing.tactical}`,
    opacity: item.disabled ? 0.5 : 1,
    textShadow: isHovered && glow && !item.disabled ? `0 0 4px ${themeColors.primary}` : 'none',
  });

  return (
    <div style={{ position: 'relative', display: 'inline-block' }} className={className}>
      <div onClick={() => setIsOpen(!isOpen)} style={{ cursor: 'pointer' }}>
        {trigger}
      </div>
      <div style={menuStyles}>
        {items.map((item, index) => {
          const [isHovered, setIsHovered] = useState(false);
          return (
            <div
              key={item.id}
              style={itemStyles(item, isHovered)}
              onClick={() => handleItemClick(item)}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {item.icon && <span>{item.icon}</span>}
              <span style={{ flex: 1 }}>{item.label}</span>
              {index === 0 && <span style={{ fontSize: '8px', opacity: 0.5 }}>{techCode}</span>}
            </div>
          );
        })}
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
      </div>
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999,
          }}
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default ColdWarDropdown;
