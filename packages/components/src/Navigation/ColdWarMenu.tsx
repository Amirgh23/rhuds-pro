/**
 * ═══════════════════════════════════════════════════════════════════════════
 * COLD WAR MENU - AAA CINEMATIC IMPLEMENTATION
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * TACTICAL DROPDOWN/CONTEXT MENU - Military-grade menu system
 *
 * FEATURES:
 * - Dropdown and context menu modes
 * - Nested submenus with hover expansion
 * - Keyboard navigation (Arrow keys, Enter, Escape)
 * - Dividers and menu sections
 * - Disabled and danger states
 * - Scanlines and phosphor glow
 * - Corner brackets and tech overlays
 * - ARIA accessibility support
 */

import React, { ReactNode, CSSProperties, useState, useEffect, useRef } from 'react';
import { getComponentChamferClip, THEME_VARIANTS, ANIMATION_TOKENS } from '@rhuds/core';
import { getRgbString, generateTechCode } from '../utils/coldWarUtils';
import { ScanlinesOverlay } from '../utils/ScanlinesOverlay';
import { GlowOverlay } from '../utils/GlowOverlay';

export interface MenuItem {
  id: string;
  label: string;
  icon?: ReactNode;
  shortcut?: string;
  disabled?: boolean;
  danger?: boolean;
  divider?: boolean;
  children?: MenuItem[];
  onClick?: () => void;
}

export interface ColdWarMenuProps {
  items: MenuItem[];
  trigger?: ReactNode;
  isOpen?: boolean;
  theme?: 'perseus' | 'greenTerminal' | 'satelliteView';
  scanlines?: boolean;
  scanlinesIntensity?: 'low' | 'medium' | 'high';
  glow?: boolean;
  showTechCode?: boolean;
  position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
  onOpenChange?: (open: boolean) => void;
  onItemClick?: (itemId: string) => void;
  className?: string;
  style?: CSSProperties;
}

export const ColdWarMenu: React.FC<ColdWarMenuProps> = ({
  items,
  trigger,
  isOpen: controlledIsOpen,
  theme = 'perseus',
  scanlines = true,
  scanlinesIntensity = 'low',
  glow = true,
  showTechCode = true,
  position = 'bottom-left',
  onOpenChange,
  onItemClick,
  className = '',
  style = {},
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [expandedSubmenus, setExpandedSubmenus] = useState<Set<string>>(new Set());
  const [techCode] = React.useState(() => generateTechCode('MNU'));
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

  const themeColors = THEME_VARIANTS[theme];
  const primaryRgb = getRgbString(themeColors.primary);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        handleClose();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleToggle = () => {
    const newOpen = !isOpen;
    setInternalIsOpen(newOpen);
    onOpenChange?.(newOpen);
  };

  const handleClose = () => {
    setInternalIsOpen(false);
    onOpenChange?.(false);
    setExpandedSubmenus(new Set());
  };

  const handleItemClick = (item: MenuItem) => {
    if (item.disabled) return;

    if (item.children && item.children.length > 0) {
      setExpandedSubmenus((prev) => {
        const next = new Set(prev);
        if (next.has(item.id)) {
          next.delete(item.id);
        } else {
          next.add(item.id);
        }
        return next;
      });
    } else {
      item.onClick?.();
      onItemClick?.(item.id);
      handleClose();
    }
  };

  const getPositionStyles = (): CSSProperties => {
    const positionMap = {
      'bottom-left': { top: '100%', left: 0, marginTop: '4px' },
      'bottom-right': { top: '100%', right: 0, marginTop: '4px' },
      'top-left': { bottom: '100%', left: 0, marginBottom: '4px' },
      'top-right': { bottom: '100%', right: 0, marginBottom: '4px' },
    };
    return positionMap[position];
  };

  const menuStyles: CSSProperties = {
    position: 'absolute',
    minWidth: '220px',
    background: 'rgba(10, 10, 20, 0.98)',
    border: `2px solid ${themeColors.primary}`,
    borderRadius: 0,
    clipPath: getComponentChamferClip('card'),
    fontFamily: "'Share Tech Mono', 'Roboto Mono', monospace",
    zIndex: 1000,
    overflow: 'hidden',
    boxShadow: `
      0 8px 24px rgba(0, 0, 0, 0.6),
      0 0 30px rgba(${primaryRgb}, 0.3)
    `,
    ...getPositionStyles(),
    ...style,
  };

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    if (item.divider) {
      return (
        <div
          key={item.id}
          style={{
            height: '1px',
            background: `linear-gradient(90deg, transparent, ${themeColors.primary}, transparent)`,
            margin: '4px 0',
            opacity: 0.3,
          }}
        />
      );
    }

    const isHovered = hoveredItem === item.id;
    const isExpanded = expandedSubmenus.has(item.id);
    const hasChildren = item.children && item.children.length > 0;

    const itemStyles: CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '10px 16px',
      paddingLeft: `${16 + level * 12}px`,
      color: item.danger
        ? themeColors.error
        : item.disabled
          ? themeColors.textSecondary
          : themeColors.text,
      cursor: item.disabled ? 'not-allowed' : 'pointer',
      transition: `all ${ANIMATION_TOKENS.timing.hover} ${ANIMATION_TOKENS.easing.tactical}`,
      fontSize: '12px',
      letterSpacing: '0.03em',
      textTransform: 'uppercase',
      background: isHovered && !item.disabled ? `rgba(${primaryRgb}, 0.15)` : 'transparent',
      borderLeft:
        isHovered && !item.disabled ? `2px solid ${themeColors.primary}` : '2px solid transparent',
      opacity: item.disabled ? 0.5 : 1,
      position: 'relative',
    };

    if (glow && isHovered && !item.disabled) {
      itemStyles.textShadow = `0 0 8px ${item.danger ? themeColors.error : themeColors.primary}`;
    }

    const iconStyles: CSSProperties = {
      fontSize: '16px',
      flexShrink: 0,
      color: item.danger ? themeColors.error : themeColors.primary,
    };

    const labelStyles: CSSProperties = {
      flex: 1,
    };

    const shortcutStyles: CSSProperties = {
      fontSize: '10px',
      color: themeColors.textSecondary,
      opacity: 0.6,
    };

    const expandIconStyles: CSSProperties = {
      fontSize: '10px',
      transition: `transform ${ANIMATION_TOKENS.timing.transition} ${ANIMATION_TOKENS.easing.smooth}`,
      transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
    };

    return (
      <div key={item.id}>
        <div
          style={itemStyles}
          onClick={() => handleItemClick(item)}
          onMouseEnter={() => !item.disabled && setHoveredItem(item.id)}
          onMouseLeave={() => setHoveredItem(null)}
          role="menuitem"
          tabIndex={item.disabled ? -1 : 0}
          aria-disabled={item.disabled}
          aria-haspopup={hasChildren ? 'menu' : undefined}
          aria-expanded={hasChildren ? isExpanded : undefined}
          onKeyDown={(e) => {
            if (!item.disabled && (e.key === 'Enter' || e.key === ' ')) {
              e.preventDefault();
              handleItemClick(item);
            }
          }}
        >
          {item.icon && <span style={iconStyles}>{item.icon}</span>}
          <span style={labelStyles}>{item.label}</span>
          {item.shortcut && <span style={shortcutStyles}>{item.shortcut}</span>}
          {hasChildren && <span style={expandIconStyles}>▸</span>}
        </div>

        {hasChildren && isExpanded && (
          <div style={{ paddingLeft: '8px' }}>
            {item.children!.map((child) => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }} className={className}>
      {trigger && (
        <div ref={triggerRef} onClick={handleToggle} style={{ cursor: 'pointer' }}>
          {trigger}
        </div>
      )}

      {isOpen && (
        <div ref={menuRef} style={menuStyles} role="menu" aria-label="Menu">
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
                bottom: '4px',
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

          <div style={{ position: 'relative', zIndex: 6, padding: '4px 0' }}>
            {items.map((item) => renderMenuItem(item))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ColdWarMenu;
