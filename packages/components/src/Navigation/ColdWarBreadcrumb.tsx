/**
 * ═══════════════════════════════════════════════════════════════════════════
 * COLD WAR BREADCRUMB - AAA CINEMATIC IMPLEMENTATION
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * TACTICAL NAVIGATION PATH - Military-grade breadcrumb trail
 *
 * FEATURES:
 * - Chamfered tactical styling with corner brackets
 * - Animated separators with pulse effect
 * - Hover glow on interactive items
 * - Scanlines and phosphor glow effects
 * - Military tech codes and timestamps
 * - Keyboard navigation support
 * - ARIA accessibility labels
 */

import React, { ReactNode, CSSProperties } from 'react';
import { getComponentChamferClip, THEME_VARIANTS, ANIMATION_TOKENS } from '@rhuds/core';
import { getRgbString, generateTechCode } from '../utils/coldWarUtils';
import { ScanlinesOverlay } from '../utils/ScanlinesOverlay';
import { GlowOverlay } from '../utils/GlowOverlay';

export interface BreadcrumbItem {
  id: string;
  label: string;
  icon?: ReactNode;
  href?: string;
  onClick?: () => void;
}

export interface ColdWarBreadcrumbProps {
  items: BreadcrumbItem[];
  theme?: 'perseus' | 'greenTerminal' | 'satelliteView';
  scanlines?: boolean;
  scanlinesIntensity?: 'low' | 'medium' | 'high';
  glow?: boolean;
  separator?: ReactNode;
  showTechCode?: boolean;
  className?: string;
  style?: CSSProperties;
}

export const ColdWarBreadcrumb: React.FC<ColdWarBreadcrumbProps> = ({
  items,
  theme = 'perseus',
  scanlines = false,
  scanlinesIntensity = 'low',
  glow = true,
  separator,
  showTechCode = true,
  className = '',
  style = {},
}) => {
  const [hoveredIndex, setHoveredIndex] = React.useState<number | null>(null);
  const [techCode] = React.useState(() => generateTechCode('NAV'));

  const themeColors = THEME_VARIANTS[theme];
  const primaryRgb = getRgbString(themeColors.primary);

  const containerStyles: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    background: 'rgba(10, 10, 20, 0.8)',
    border: `1px solid ${themeColors.primary}`,
    borderRadius: 0,
    clipPath: getComponentChamferClip('card'),
    fontFamily: "'Share Tech Mono', 'Roboto Mono', monospace",
    fontSize: '12px',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    position: 'relative',
    overflow: 'hidden',
    ...style,
  };

  const defaultSeparator = (
    <span
      style={{
        color: themeColors.primary,
        opacity: 0.6,
        fontSize: '10px',
        animation: 'led-pulse 2s ease-in-out infinite',
      }}
    >
      ▸
    </span>
  );

  return (
    <nav
      className={className}
      style={containerStyles}
      aria-label="Breadcrumb navigation"
      role="navigation"
    >
      {scanlines && <ScanlinesOverlay intensity={scanlinesIntensity} />}
      {glow && <GlowOverlay color={themeColors.primary} intensity="low" />}

      {/* Corner brackets */}
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
          zIndex: 4,
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
          zIndex: 4,
        }}
      />

      {/* Tech code */}
      {showTechCode && (
        <div
          style={{
            position: 'absolute',
            bottom: '2px',
            right: '8px',
            fontSize: '8px',
            color: themeColors.primary,
            opacity: 0.3,
            letterSpacing: '0.05em',
            zIndex: 4,
          }}
        >
          {techCode}
        </div>
      )}

      <ol
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          listStyle: 'none',
          margin: 0,
          padding: 0,
          position: 'relative',
          zIndex: 6,
        }}
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isHovered = hoveredIndex === index;

          const itemStyles: CSSProperties = {
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: isLast ? themeColors.primary : themeColors.textSecondary,
            cursor: isLast ? 'default' : 'pointer',
            transition: `all ${ANIMATION_TOKENS.timing.hover} ${ANIMATION_TOKENS.easing.tactical}`,
            textDecoration: 'none',
            padding: '4px 8px',
            border: `1px solid ${isHovered && !isLast ? themeColors.primary : 'transparent'}`,
            clipPath:
              'polygon(3px 0, 100% 0, 100% calc(100% - 3px), calc(100% - 3px) 100%, 0 100%, 0 3px)',
            background: isHovered && !isLast ? `rgba(${primaryRgb}, 0.1)` : 'transparent',
          };

          if (glow && (isLast || isHovered)) {
            itemStyles.textShadow = `0 0 8px ${themeColors.primary}`;
          }

          if (isHovered && !isLast) {
            itemStyles.boxShadow = `0 0 10px rgba(${primaryRgb}, 0.3)`;
          }

          const content = (
            <>
              {item.icon && <span style={{ fontSize: '14px' }}>{item.icon}</span>}
              <span>{item.label}</span>
            </>
          );

          return (
            <React.Fragment key={item.id}>
              <li
                onMouseEnter={() => !isLast && setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {item.href ? (
                  <a
                    href={item.href}
                    style={itemStyles}
                    aria-current={isLast ? 'page' : undefined}
                    onClick={(e) => {
                      if (item.onClick) {
                        e.preventDefault();
                        item.onClick();
                      }
                    }}
                  >
                    {content}
                  </a>
                ) : item.onClick ? (
                  <button
                    onClick={item.onClick}
                    style={{
                      ...itemStyles,
                      background: itemStyles.background,
                      border: itemStyles.border,
                    }}
                    aria-current={isLast ? 'page' : undefined}
                  >
                    {content}
                  </button>
                ) : (
                  <span style={itemStyles} aria-current={isLast ? 'page' : undefined}>
                    {content}
                  </span>
                )}
              </li>
              {!isLast && (separator || defaultSeparator)}
            </React.Fragment>
          );
        })}
      </ol>

      <style>
        {`
          @keyframes led-pulse {
            0%, 100% { opacity: 0.6; }
            50% { opacity: 1; }
          }
        `}
      </style>
    </nav>
  );
};

export default ColdWarBreadcrumb;
